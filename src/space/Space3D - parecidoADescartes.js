/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathRound = Math.round;
  var MathCos   = Math.cos;
  var MathSin   = Math.sin;
  var MathPI_2  = Math.PI/2;

  var valorArbitrario = 4.826;

  var evaluator;
  var parent;
  var self;
  var thisGraphics_i;
  var primitives;
  var primitivesLength;
  var hasTouchSupport;
  var changeX;
  var changeY;
  var cosAlpha;
  var sinAlpha;
  var cosBeta;
  var sinBeta;
  
  /**
   * Descartes 3D space
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.Space3D = function(parent, values) {
    // call the parent constructor
    descartesJS.Space.call(this, parent, values);
    
    self = this;

    // create the canvas
    self.backgroundCanvas = document.createElement("canvas");
    self.backgroundCanvas.setAttribute("id", self.id + "_background");
    self.backgroundCanvas.setAttribute("width", self.w + "px");
    self.backgroundCanvas.setAttribute("height", self.h + "px");
    // self.backgroundCtx = self.backgroundCanvas.getContext("2d");
    // self.backgroundCtx.imageSmoothingEnabled = false;
    // self.backgroundCtx.mozImageSmoothingEnabled = false;
    // self.backgroundCtx.webkitImageSmoothingEnabled = false;

    self.canvas = document.createElement("canvas");
    self.canvas.setAttribute("id", self.id + "_canvas");
    self.canvas.setAttribute("width", self.w + "px");
    self.canvas.setAttribute("height", self.h + "px");
    self.canvas.setAttribute("class", "DescartesSpace3DCanvas");
    self.canvas.setAttribute("style", "z-index: " + self.zIndex + ";");
    self.ctx = self.canvas.getContext("2d");
    self.ctx.imageSmoothingEnabled = false;
    self.ctx.mozImageSmoothingEnabled = false;
    self.ctx.webkitImageSmoothingEnabled = false;
    
    // create a graphic control container
    self.graphicControlContainer = document.createElement("div");
    self.graphicControlContainer.setAttribute("id", self.id + "_graphicControls");
    self.graphicControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + self.zIndex + ";");
    
    // create a control container
    self.numericalControlContainer = document.createElement("div");
    self.numericalControlContainer.setAttribute("id", self.id + "_numericalControls");
    self.numericalControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + self.zIndex + ";");

    // create the principal container
    self.container = document.createElement("div");
    self.container.setAttribute("id", self.id);
    self.container.setAttribute("class", "DescartesSpace3DContainer");
    self.container.setAttribute("style", "left: " + self.x + "px; top: " + self.y + "px; z-index: " + self.zIndex + ";");

    // add the elements to the container
    self.container.appendChild(self.backgroundCanvas);
    self.container.appendChild(self.canvas);
    self.container.appendChild(self.graphicControlContainer);
    self.container.appendChild(self.numericalControlContainer);
    
    parent.container.insertBefore(self.container, parent.loader);
    
    // initial value of the observer
    self.observer = (self.w + self.h) * 2.5;
    self.evaluator.setVariable(self.id + ".observador", self.observer);

    self.eye = new descartesJS.Vector3D(3, 0, 0);
    self.eye = new descartesJS.Vector3D(1, 1, 1);
    self.center = new descartesJS.Vector3D(0, 0, 0);
    self.yUpEye = new descartesJS.Vector3D(0, 0, 1);

    self.distanceEyeCenter = self.observer/(5.5*self.scale);

    self.alpha = 0;
    self.beta = 0;
    
    // set the value to the rotation variables
    self.evaluator.setVariable(self.id + ".rot.z", self.alpha);
    self.evaluator.setVariable(self.id + ".rot.y", -self.beta);

    self.lookAtMatrix = new descartesJS.Matrix4x4();
    self.perspectiveMatrix = new descartesJS.Matrix4x4();
    self.perspective = (new descartesJS.Matrix4x4()).perspective(45, self.w/self.h, 0.01, 1000.0);
    self.rotationMatrix = new descartesJS.Matrix4x4();

    // build the look at matrix to orient the camera
    self.lookAtMatrix = self.lookAtMatrix.setIdentity().lookAt(self.eye, self.center, self.yUpEye);
    // build the perspective matrix
    self.perspectiveMatrix = self.perspective.multiply(self.lookAtMatrix);

    self.OxString = self.id + ".Ox";
    self.OyString = self.id + ".Oy";
    self.scaleString = self.id + ".escala";
    self.wString = self.id + "._w";
    self.hString = self.id + "._h";
    self.observerString = self.id + ".observador";

    self.update();

    // register the mouse and touch events
    self.registerMouseAndTouchEvents();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Space3D, descartesJS.Space);

  /**
   * Init the space
   */
  descartesJS.Space3D.prototype.init = function() {
    self = this;
    
    // call the init of the parent
    self.uber.init.call(self);

    // update the size of the canvas if has some regions
    if (self.canvas) {
      // self.backgroundCanvas.setAttribute("width", self.w + "px");
      // self.backgroundCanvas.setAttribute("height", self.h + "px");
      self.canvas.setAttribute("width", self.w + "px");
      self.canvas.setAttribute("height", self.h + "px");
    };

    // find the offset of the container
    if (self.container) {
      self.findOffset();
    }

    self.w_2 = self.w/2;
    self.h_2 = self.h/2;

    self.oldMouse = {x: 0, y: 0};
  }

  /**
   * Update the space
   * @param {Boolean} firstTime condition if is the first time in draw the space
   */
  descartesJS.Space3D.prototype.update = function(firstTime) {
    self = this;
    evaluator = self.evaluator;
    parent = self.parent;

    // prevents the change of the width and height from an external change
    evaluator.setVariable(self.wString, self.w);
    evaluator.setVariable(self.hString, self.h);

    // check the draw if condition
    self.drawIfValue = evaluator.evalExpression(self.drawif) > 0;

    if (self.drawIfValue) {
      changeX = (self.x !== (evaluator.evalExpression(self.xExpr) + self.displaceRegionWest));
      changeY = (self.y !== (evaluator.evalExpression(self.yExpr) + parent.plecaHeight  + self.displaceRegionNorth));

      // check if the space has change
      self.spaceChange = firstTime ||
                         changeX ||
                         changeY ||
                         (self.drawBefore !== self.drawIfValue) ||
                         (self.Ox !== evaluator.getVariable(self.OxString)) ||
                         (self.Oy !== evaluator.getVariable(self.OyString)) ||
                         (self.scale !== evaluator.getVariable(self.scaleString));

      self.x = (changeX) ? evaluator.evalExpression(self.xExpr) + self.displaceRegionWest : self.x;
      self.y = (changeY) ? evaluator.evalExpression(self.yExpr) + parent.plecaHeight + self.displaceRegionNorth : self.y;
      self.Ox = evaluator.getVariable(self.OxString);
      self.Oy = evaluator.getVariable(self.OyString);
      self.scale = evaluator.getVariable(self.scaleString);
      self.drawBefore = self.drawIfValue;

      self.observer = evaluator.getVariable(self.observerString);

      // if (self.observer < .5*(self.w+self.h)) {
      //   self.observer = .5*(self.w+self.h);
      //   evaluator.setVariable(self.observerString, self.observer);
      // }

      // check if the scale is not below the lower limit
      if (self.scale < 0.000001) {
        self.scale = 0.000001;
        evaluator.setVariable(self.scaleString, 0.000001);
      }
      // check if the scale is not above the upper limit
      else if (self.scale > 1000000) {
        self.scale = 1000000;
        evaluator.setVariable(self.scaleString, 1000000);
      }

      // if some property change then adjust the container style
      if ((changeX) || (changeY)) {
        self.container.style.left = self.x + "px";
        self.container.style.top = self.y + "px";
        self.findOffset();
      }

      self.container.style.display = "block";

      // draw the geometry
      self.draw();
    }
    // hide the space
    else {
      self.container.style.display = "none";
    }

  }

  /**
   * Auxiliary function to sort the primitives
   */
  function depthSort(a, b) {
    return b.depth - a.depth;
  }


  /**
   * Draw the primitives of the graphics, the primitives are obtained from the update step
   */
  descartesJS.Space3D.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = this.background.getColor();
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // draw the background image if any
    if ( (this.image) && (this.image.src != "") && (this.image.ready) && (this.image.complete) ) {
      if (this.bg_display === "topleft") {
        this.ctx.drawImage(this.image, 0, 0);
      } 
      else if (this.bg_display === "stretch") {
        this.ctx.drawImage(this.image, 0, 0, this.w, this.h);
      } 
      else if (this.bg_display === "patch") {
        this.ctx.fillStyle = ctx.createPattern(this.image, "repeat");
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
      else if (this.bg_display === "center") {
        this.ctx.drawImage(this.image, (this.w-this.image.width)/2, (this.h-this.image.height)/2);
      }
    }

    this.setRotation();

    // if not interact with the space
    // if (!this.click) {
      this.primitives = [];

      // update the graphics
      for(var i=0, l=this.graphics.length; i<l; i++) {
        thisGraphics_i = this.graphics[i];
        thisGraphics_i.update();
        this.primitives = this.primitives.concat( thisGraphics_i.primitives || [] ); 
      }

      // update the background background graphics
      for(var i=0, l=this.backgroundGraphics.length; i<l; i++) {
        thisGraphics_i = this.backgroundGraphics[i];
        thisGraphics_i.update();
        this.primitives = this.primitives.concat( thisGraphics_i.primitives || [] ); 
      }

    // }

    primitives = this.primitives;
    primitivesLength = primitives.length;

    for(var i=0; i<primitivesLength; i++) {
      primitives[i].computeDepth(this);
    }

    primitives = primitives.sort(depthSort);

    for(var i=0; i<primitivesLength; i++) {
      primitives[i].draw(this.ctx);
    }

    // draw the graphic controls
    for (var i=0, l=this.graphicsCtr.length; i<l; i++) {
      this.graphicsCtr[i].draw();
    }

  }

  /**
   * 
   */
  descartesJS.Space3D.prototype.transformCoordinateX = function(x) {
    return this.w_2 + this.Ox + x*this.scale*2;
    return this.Ox + parseInt((x+1)*this.w_2);
    // return this.w_2 + this.Ox + x*this.scale;
  }
  
  /**
   * 
   */
  descartesJS.Space3D.prototype.transformCoordinateY = function(y) {
    return this.h_2 + this.Oy - y*this.scale*2;
    return this.Oy + parseInt((1-y)*this.h_2);
    // return this.h_2 + this.Oy - y*this.scale;
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.setRotation = function() {
    self = this;

    self.distanceEyeCenter = self.observer/(5.5*self.scale);

    // self.eye.set(self.distanceEyeCenter, 0, 0);    
    // build the look at matrix to orient the camera
    self.lookAtMatrix = self.lookAtMatrix.setIdentity().lookAt(self.eye, self.center, self.yUpEye);
    // build the perspective matrix
    self.perspectiveMatrix = self.perspective.multiply(self.lookAtMatrix);

    self.alpha = descartesJS.degToRad( self.evaluator.getVariable(self.id + ".rot.z"));
    self.beta  = descartesJS.degToRad(-self.evaluator.getVariable(self.id + ".rot.y"));

    self.alpha = MathRound( descartesJS.radToDeg(self.alpha + (self.mouse_x - self.oldMouse.x)) );
    self.beta  = MathRound( descartesJS.radToDeg(self.beta  + (self.mouse_y - self.oldMouse.y)) );

    // set the value to the rotation variables
    self.evaluator.setVariable(self.id + ".rot.z", self.alpha);
    self.evaluator.setVariable(self.id + ".rot.y", -self.beta);

    self.alpha = descartesJS.degToRad(self.alpha);
    self.beta = descartesJS.degToRad(self.beta);

    self.rotationMatrix = self.rotationMatrix.setIdentity().rotateY(-self.beta +Math.PI/10).rotateZ(self.alpha);
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.project = function(v) {
    console.log(v);
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.rotateVertex = function(v) {
    var i2do = 2/this.observer;
    var cb = Math.cos(this.beta -Math.PI/18);
    var sb = Math.sin(this.beta -Math.PI/18);
    var ca = Math.cos(this.alpha);
    var sa = Math.sin(this.alpha);
    var ux = ca*cb;
    var uy = sa*cb;
    var uz = sb;
    var Xx = -sa;
    var Xy = ca;
    var Xz = 0;
    var Yx = -sb*ca;
    var Yy = -sb*sa;
    var Yz = cb;

    var xx = ux*v.x + uy*v.y + uz*v.z;
    var f = 1/(2 - xx*i2do);
    var nX = f*(Xx*v.x + Xy*v.y);
    var nY = f*(Yx*v.x + Yy*v.y + Yz*v.z);
    var nZ = xx;

    // console.log("|||||", nX, nY, nZ);
    return new descartesJS.Vector3D(nX, nY, nZ);
  }

  /**
   * Register the mouse and touch events
   */
  descartesJS.Space3D.prototype.registerMouseAndTouchEvents = function() {
    self = this;

    hasTouchSupport = descartesJS.hasTouchSupport;

    this.canvas.oncontextmenu = function () { return false; };

    if (hasTouchSupport) {
      // if (this.sensitive_to_mouse_movements) {
      //   this.canvas.addEventListener("touchmove",  onSensitiveToMouseMovements);
      // }
      this.canvas.addEventListener("touchstart", onTouchStart);
    }

    /**
     * @param {Event} evt
     * @private
     */
    function onTouchStart(evt) {
      self.click = 1;
      self.evaluator.setVariable(self.id + ".mouse_pressed", 1);

      // se desactivan los controles graficos
      self.parent.deactivateGraphiControls();

      onSensitiveToMouseMovements(evt);

      window.addEventListener("touchmove", onMouseMove);
      window.addEventListener("touchend", onTouchEnd);

      // if ((!self.fixed) || (self.sensitive_to_mouse_movements)) {
        evt.preventDefault();
      // }
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onTouchEnd(evt) {
      self.click = 0;
      self.evaluator.setVariable(self.id + ".mouse_pressed", 0);

      window.removeEventListener("touchmove", onMouseMove, false);
      window.removeEventListener("touchend", onTouchEnd, false);

      evt.preventDefault();
    }
  
    ///////////////////////////////////////////////////////////////////////////
    // 
    ///////////////////////////////////////////////////////////////////////////
    if (!hasTouchSupport) {
      // if (this.sensitive_to_mouse_movements) {
      //   this.canvas.addEventListener("mousemove", onSensitiveToMouseMovements);
      // }
      this.canvas.addEventListener("mousedown", onMouseDown);
    }
    
    /**
     * 
     * @param {Event} evt
     * @private
     */
    function onMouseDown(evt) {
      self.click = 1;

      // se desactivan los controles graficos
      self.parent.deactivateGraphiControls();
      
      self.whichButton = descartesJS.whichButton(evt);

      if (self.whichButton === "R") {
        window.addEventListener("mouseup", onMouseUp);
        
        // if fixed add a zoom manager
        if (!self.fixed) {
          self.clickPosForZoom = (self.getCursorPosition(evt)).y;
          self.tempScale = self.scale;
          window.addEventListener("mousemove", onMouseMoveZoom);
        }
      }

      else if (self.whichButton == "L") {
        self.evaluator.setVariable(self.id + ".mouse_pressed", 1);

        self.posAnte = self.getCursorPosition(evt);
        self.oldMouse.x = self.getRelativeX(self.posAnte.x);
        self.oldMouse.y = self.getRelativeY(self.posAnte.y);

        onSensitiveToMouseMovements(evt);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      }
      
      evt.preventDefault();
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseUp(evt) {
      self.click = 0;
      self.evaluator.setVariable(self.id + ".mouse_pressed", 0);
      evt.preventDefault();

      if (self.whichButton === "R") {
        window.removeEventListener("mousemove", onMouseMoveZoom, false);
      }

      window.removeEventListener("mousemove", onMouseMove, false);
      window.removeEventListener("mouseup", onMouseUp, false);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onSensitiveToMouseMovements(evt) {
      self.posAnte = self.getCursorPosition(evt);
      self.mouse_x = self.getRelativeX(self.posAnte.x);
      self.mouse_y = self.getRelativeY(self.posAnte.y);

      self.evaluator.setVariable(self.id + ".mouse_x", self.mouse_x);
      self.evaluator.setVariable(self.id + ".mouse_y", self.mouse_y);

      self.parent.update();
    }
    
    /**
     *
     * @param {Event} evt 
     * @private
     */
    function onMouseMoveZoom(evt) {
      evt.preventDefault();

      self.clickPosForZoomNew = (self.getCursorPosition(evt)).y;

      self.evaluator.setVariable(self.scaleString, self.tempScale + (self.tempScale/45)*((self.clickPosForZoom-self.clickPosForZoomNew)/10));

      self.parent.update();
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseMove(evt) {
      if ((!self.fixed) && (self.click)) {
        onSensitiveToMouseMovements(evt);

        self.setRotation();
      
        self.oldMouse = { x: self.mouse_x, 
                     y: self.mouse_y 
                   };
      }
    }
  }
  
  return descartesJS;
})(descartesJS || {});