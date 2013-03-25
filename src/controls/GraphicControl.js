/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  var evaluator;
  var parser;
  var x;
  var y;
  var cpos;
  var ctx;
  var backCtx;
  var constraintPosition;

  var hasTouchSupport;

  /**
   * Descartes graphic control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic control
   */
  descartesJS.GraphicControl = function(parent, values) {
    /**
     * Descartes application
     * type {DescartesApp}
     * @private
     */
    parser = parent.evaluator.parser;
    
    /**
     * space identifier
     * type {String}
     * @private
     */
    this.spaceID = "E0";

    /**
     * text
     * type {String}
     * @private
     */
    this.text = "";

    /**
     * size
     * type {Node}
     * @private
     */
    this.size = parser.parse("4");

    /**
     * font control
     * type {String}
     * @private
     */
    this.font = "Monospaced,PLAIN,12";
    
    /**
     * image control
     * type {Image}
     * @private
     */
    this.image = new Image();
    var self = this;
    this.image.onload = function() {
      this.ready = 1;
    }

    /**
     * image file name
     * type {String}
     * @private
     */
    this.imageSrc = "";
    
    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    this.touchId = null;
    
    // get the Descartes font
    this.font = descartesJS.convertFont(this.font);
    
    // build the contraint
    if (this.constraintExpr) {
      this.constraint = parser.parse(this.constraintExpr);
      
      if (this.constraint.type == "(expr)") {
        this.constraint = parser.parse(this.constraintExpr.substring(1, this.constraintExpr.length-1));
      }

      if (this.constraint.type == "compOperator") {
        var left = this.constraint.childs[0];
        var right = this.constraint.childs[1];
        this.newt = new descartesJS.R2Newton(this.evaluator, this.constraint);
      } else {
        this.constraint = null;
      }

      constraintPosition = new descartesJS.R2(0, 0);
    }

    // get the container
    this.container = this.getContainer();

    // dom element for catch the mouse events
    this.mouseCacher = document.createElement("div");
    this.mouseCacher.setAttribute("class", "DescartesGraphicControl");
    this.mouseCacher.setAttribute("id", this.id);
    this.mouseCacher.setAttribute("dragged", true);
    this.mouseCacher.setAttribute("tabindex", "-1"); 
 
    this.ctx = this.space.ctx;

    this.container.appendChild(this.mouseCacher);
    
    // register the mouse and touch events
    this.registerMouseAndTouchEvents();

    this.init();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.GraphicControl, descartesJS.Control);

  /**
   * Init the graphic control
   */
  descartesJS.GraphicControl.prototype.init = function() {
    evaluator = this.evaluator;
    hasTouchSupport = descartesJS.hasTouchSupport;
    
    // find the x and y position
    var expr = evaluator.evalExpression(this.expresion);
    this.x = expr[0][0];
    this.y = expr[0][1];
    evaluator.setVariable(this.id+".x", this.x);
    evaluator.setVariable(this.id+".y", this.y);

    var radioTouch = 70;
    
    // if the control has an image name
    if ((this.imageSrc != "") && !(this.imageSrc.toLowerCase().match(/vacio.gif$/))) {
      this.image = this.parent.getImage(this.imageSrc);

      this.width = this.image.width;
      this.height = this.image.height;
    
      this._w = ((hasTouchSupport) && (this.width < radioTouch)) ? radioTouch : this.width;
      this._h = ((hasTouchSupport) && (this.height < radioTouch)) ? radioTouch : this.height;
    } else {
      this.width = (evaluator.evalExpression(this.size)*2);
      this.height = (evaluator.evalExpression(this.size)*2);
      
      this._w = ((hasTouchSupport) && (this.width < radioTouch)) ? radioTouch : this.width;
      this._h = ((hasTouchSupport) && (this.height < radioTouch)) ? radioTouch : this.height;
    }

    this.mouseCacher.setAttribute("style", "cursor: pointer; background-color: rgba(255, 255, 255, 0); width: " +this._w+ "px; height: " +this._h+ "px; z-index: " + this.zIndex + ";");
    this.mouseCacher.style.left = parseInt(this.space.getAbsoluteX(this.x)-this._w/2)+"px";
    this.mouseCacher.style.top = parseInt(this.space.getAbsoluteY(this.y)-this._h/2)+"px";

    evaluator.setVariable(this.id+".activo", 0);
  }
  
  /**
   * Update the graphic control
   */
  descartesJS.GraphicControl.prototype.update = function() {
    evaluator = this.evaluator;

    // check if the control is active and visible
    this.activeIfValue = (evaluator.evalExpression(this.activeif) > 0);
    this.drawIfValue = (evaluator.evalExpression(this.drawif) > 0);

    // update the position
    this.x = evaluator.getVariable(this.id+".x");
    this.y = evaluator.getVariable(this.id+".y");
    x = this.space.getAbsoluteX(this.x);
    y = this.space.getAbsoluteY(this.y);

    if (!this.active) {
      this.mouseCacher.style.left = parseInt(x-this._w/2)+"px";
      this.mouseCacher.style.top = parseInt(y-this._h/2)+"px";
    }
    
    this.mouseCacher.style.display = (this.drawIfValue) ? "block" : "none";
    
    // eval the constraint    
    if (this.constraint) {
      this.evalConstraint();
    }

    this.draw();
  }

  /**
   * Draw the graphic control
   */
  descartesJS.GraphicControl.prototype.draw = function() {
    evaluator = this.evaluator;

    if (this.drawIfValue) {
      ctx = this.ctx;
      backCtx = this.space.backgroundCtx;
      x = parseInt(this.space.getAbsoluteX(this.x))+.5;
      y = parseInt(this.space.getAbsoluteY(this.y))+.5;
      
      if (this.text != "") {
        this.drawText(x, y);
      }

      // if the control do not have a image or is not ready
      if (!this.image.ready) {
        ctx.beginPath();
        ctx.arc(x, y, parseInt(this.width/2), 0, PI2, false);
    
        ctx.fillStyle = descartesJS.getColor(evaluator, this.colorInt);
        ctx.fill();
      
        ctx.lineWidth = 1;
        ctx.strokeStyle = descartesJS.getColor(evaluator, this.color);
        ctx.stroke();
      
        if (this.active) {
          ctx.beginPath();
          ctx.arc(x, y, parseInt(this.width/2)-2, 0, PI2, false);
          ctx.strokeStyle = "black";
          ctx.stroke();
        }

        // if has trace
        if (this.trace) {
          backCtx.lineWidth = 1;
          backCtx.strokeStyle = descartesJS.getColor(evaluator, this.trace);
          backCtx.beginPath();
          backCtx.arc(x, y, parseInt(this.width/2), 0, PI2, false);
          backCtx.stroke();
        }
      } 
      // if the control has an image and is ready
      else {
      	if (this.image.complete){
          ctx.drawImage(this.image, parseInt(x-this.image.width/2), parseInt(y-this.image.height/2));
        }
        
        // if has trace
        if (this.trace) {
          backCtx.save();
          backCtx.translate(x, y);
          backCtx.scale(parseInt(this.image.width/2), parseInt(this.image.height/2));

          backCtx.beginPath();
          backCtx.arc(0, 0, 1, 0, PI2, false);
          backCtx.restore();
        
          backCtx.lineWidth = 1;
          backCtx.strokeStyle = descartesJS.getColor(evaluator, this.trace);
          backCtx.stroke();
        }
      }
    }
    
  }

  /**
   * Eval the constraint and change the position
   */
  descartesJS.GraphicControl.prototype.evalConstraint = function(x, y) {
    constraintPosition.set(this.x, this.y);

    cpos = this.newt.findZero(constraintPosition);
    this.x = cpos.x;
    this.y = cpos.y;
    this.evaluator.setVariable(this.id+".x", this.x);
    this.evaluator.setVariable(this.id+".y", this.y);
  }

  /**
   * Draw the graphic control text
   */
  descartesJS.GraphicControl.prototype.drawText = function(x, y) {
    ctx = this.ctx;
    evaluator = this.evaluator;
    
    ctx.fillStyle = descartesJS.getColor(evaluator, this.color);
    ctx.font = this.font;
    ctx.textBaseline = "alphabetic";

    ctx.fillText(evaluator.evalExpression(this.text[0], evaluator.evalExpression(this.decimals), this.fixed), 
                 parseInt(x+1+this.width/2), 
                 parseInt(y-1-this.height/2)
                );
  }

  /**
   * Add the control to a espace and get the space container
   * @return {HTMLDiv} return the space container
   */
  descartesJS.GraphicControl.prototype.getContainer = function() {
    var spaces = this.parent.spaces;
    var space_i;
    // si el control esta en un espacio interno
    for(var i=0, l=spaces.length; i<l; i++) {
      space_i = spaces[i];

      if (space_i.id == this.spaceID) {
        space_i.addCtr(this);
        this.zIndex = space_i.zIndex;
        // set the space to draw the control
        this.space = space_i;
        return space_i.graphicControlContainer;
      }
    }
    
    // if do not find the space return the first space 
    spaces[0].addCtr(this);
    this.zIndex = spaces[0].zIndex;
    // set the space to draw the control
    this.space = spaces[0];
    return spaces[0].graphicControlContainer;
  }
  
  /**
   * Deactivate the graphic control removing the circle mark
   */
  descartesJS.GraphicControl.prototype.deactivate = function() {
    this.active = false;
    this.evaluator.setVariable(this.id+".activo", 0);
  }  
  
  /**
   * Register the mouse and touch events
   */
  descartesJS.GraphicControl.prototype.registerMouseAndTouchEvents = function() {
    var self = this;

    this.click = false;
    this.over = false;
    this.active = false;

    // prevent the context menu display
    this.mouseCacher.oncontextmenu = function () { return false; };    

    if (descartesJS.hasTouchSupport) {
      this.mouseCacher.addEventListener("touchstart", onTouchStart, false);
    } else {
      this.mouseCacher.addEventListener("mousedown", onMouseDown, false);
      this.mouseCacher.addEventListener("mouseover", onMouseOver, false);
      this.mouseCacher.addEventListener("mouseout", onMouseOut, false);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseDown(evt) {
      evt.preventDefault();

      // IE
      if (evt.which == null) {
        self.whichButton = (evt.button < 2) ? "LEFT" : ((evt.button == 4) ? "MIDDLE" : "RIGHT");
      } 
      // the others
      else {
        self.whichButton = (evt.which < 2) ? "LEFT" : ((evt.which == 2) ? "MIDDLE" : "RIGHT");
      }

      if (self.whichButton == "LEFT") {
        if ((self.activeIfValue) && (self.over)) {
          
          self.parent.deactivateGraphiControls();
          self.click = true;
          self.active = true;
          self.evaluator.setVariable(self.id+".activo", 1);
          
          self.posAnte = self.getCursorPosition(evt);
          self.prePos = { x : self.space.getAbsoluteX(self.x), y : self.space.getAbsoluteY(self.y) };
          
          window.addEventListener("mouseup", onMouseUp, false);
          window.addEventListener("mousemove", onMouseMove, false);
        }
      }
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de presionar un boton
     * @private
     */
    function onTouchStart(evt) {
      evt.preventDefault();

      if (self.activeIfValue) {
        self.parent.deactivateGraphiControls();
        self.click = true;
        self.active = true;
        self.evaluator.setVariable(self.id+".activo", 1);

        self.posAnte = self.getCursorPosition(evt);
        self.prePos = { x : self.space.getAbsoluteX(self.x), y : self.space.getAbsoluteY(self.y) };
        
        window.addEventListener("touchmove", onMouseMove, false);
        window.addEventListener("touchend", onMouseUp, false);
      }
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseUp(evt) {
      evt.preventDefault();
      self.touchId = null;

      if ((self.activeIfValue) || (self.active)) {
        self.click = false;

        if (descartesJS.hasTouchSupport) {
          window.removeEventListener("touchmove", onMouseMove, false);
          window.removeEventListener("touchend", onMouseUp, false);
        } else {
          window.removeEventListener("mouseup", onMouseUp, false);
          window.removeEventListener("mousemove", onMouseMove, false);
        }
        
        self.parent.update();
        
        self.mouseCacher.style.left = (self.space.getAbsoluteX(self.x)-self._w/2)+"px";
        self.mouseCacher.style.top = (self.space.getAbsoluteY(self.y)-self._h/2)+"px";
      }
    }
    
    var posNew;
    var tmpX;
    var tmpY;
    var cpos;

    /**
     * 
     * @param {Event}
     * @private
     */
    function onMouseMove(evt) {
      evt.preventDefault();
      evt.touchId = self.touchId;

      posNew = self.getCursorPosition(evt);

      self.posX = self.prePos.x - (self.posAnte.x - posNew.x);
      self.posY = self.prePos.y - (self.posAnte.y - posNew.y);
      
      ////////////////////////////////////////////////////////////////////////////
      // if (self.constraint) {
        // tmpX = self.space.getRelativeX(self.posX);
        // tmpY = self.space.getRelativeY(self.posY);
        
        // cpos = self.newt.findZero(new descartesJS.R2(tmpX, tmpY));
        // self.x = cpos.x;
        // self.y = cpos.y;
        // self.evaluator.setVariable(self.id+".x", self.x);
        // self.evaluator.setVariable(self.id+".y", self.y);
      // }
      // ////////////////////////////////////////////////////////////////////////////
      // else {
        self.evaluator.setVariable(self.id+".x", self.space.getRelativeX(self.posX));
        self.evaluator.setVariable(self.id+".y", self.space.getRelativeY(self.posY));
      // }

      // update the controls
      self.parent.updateControls();

      self.parent.update();      
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseOver(evt) {
      self.over = true;
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseOut(evt) {
      self.over = false;
      self.click = false;
    }
    
    // function onBlur(evt) {
    //   console.log("en blur");
    // }
    // this.mouseCacher.addEventListener("blur", onBlur, false);        
  }
  
  /**
   * Get the cursor position in absolute coordinates
   * @param {Event} evt the event that has the cursor postion
   * @return {Object} return the position of the mouse in absolute coordinates
   */
  descartesJS.GraphicControl.prototype.getCursorPosition = function(evt) {
    // if has touch events
    if (evt.touches) {
      var touch;

      if (!evt.touchId) {
        for (var i=0, l=evt.touches.length; i<l; i++) {
          if (evt.target == evt.touches[i].target) {
            touch = evt.touches[i];

            this.touchId = touch.identifier;
         
            break;
          }
        }
      }
      else {
        for (var i=0, l=evt.touches.length; i<l; i++){
          if (evt.touches[i].identifier == evt.touchId) {
            touch = evt.touches[i];

            break;
          }
        }
      }
      // var touch = evt.touches[0];
    
      mouseX = touch.pageX; 
      mouseY = touch.pageY;
    } 
    // if has mouse events
    else {
      // all browsers
      if (evt.pageX != undefined && evt.pageY != undefined) { 
        mouseX = evt.pageX; 
        mouseY = evt.pageY;
      } 
      // IE
      else { 
        mouseX = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mouseY = evt.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
      }
    }

    return { x: mouseX - (this.space.container.offsetLeft + this.space.container.parentNode.offsetLeft), 
             y: mouseY - (this.space.container.offsetTop + this.space.container.parentNode.offsetTop)
           };
  }

  return descartesJS;
})(descartesJS || {});