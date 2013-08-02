/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;

  var horizontalScrollbar = "h";
  var verticalScrollbar = "v";

  var evaluator;
  var self;
  var fieldValue;
  var expr;
  var ctx;
  var tmpH;
  var tmpW;
  var desp;
  var tmpPos;
  var smw;
  var resultValue;
  var incr;
  var decimals;
  var indexDot;
  var subS;
  var newValue;
  var limInf;
  var limSup;
  var min;
  var max;

  var hasTouchSupport;

  var tmpContainer;
  var tmpDisplay;
  var pos;

  /**
   * Descartes scrollbar control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the scrollbar control
   */
  descartesJS.Scrollbar = function(parent, values){
    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    this.orientation = (this.w >= this.h) ? horizontalScrollbar : verticalScrollbar;

    // control container
    this.containerControl = document.createElement("div");
    this.canvas = document.createElement("canvas");
    this.divUp = document.createElement("div");
    this.divDown = document.createElement("div");
    this.field = document.createElement("input");

    // the scroll handler
    this.scrollManipulator = document.createElement("div");

    // the label
    this.label = document.createElement("label");
    this.txtLabel = document.createTextNode(this.name);
    this.label.appendChild(this.txtLabel);

    // add the elements to the container
    this.containerControl.appendChild(this.canvas);
    this.containerControl.appendChild(this.label);
    this.containerControl.appendChild(this.divUp);
    this.containerControl.appendChild(this.divDown);
    this.containerControl.appendChild(this.field);
    this.containerControl.appendChild(this.scrollManipulator);
    
    this.addControlContainer(this.containerControl);

    // register the mouse and touch events
    this.registerMouseAndTouchEvents();

    // init the menu parameters
    this.init();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Scrollbar, descartesJS.Control);

  /**
   * Init the scrollbar
   */
  descartesJS.Scrollbar.prototype.init = function() {
    evaluator = this.evaluator;
    
    // get the offset of the scrollbar container to get the correct mouse cordinates
    this.findOffset();

    // if has decimasl the increment are the interval [min, max] dividen by 100, if not then the incremente is 1
    if (evaluator.evalExpression(this.decimals) == 0) {
      this.incr = 1;
    }
    else {
      this.incr = (evaluator.evalExpression(this.max) - evaluator.evalExpression(this.min)) / 100;
    }

    // validate the initial value
    this.value = this.validateValue( evaluator.evalExpression(this.valueExpr) );

    // format the output value
    fieldValue = this.formatOutputValue(this.value);

    expr = this.evaluator.evalExpression(this.expresion);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      this.w = expr[0][2];
      this.h = expr[0][3];
    }
    this.orientation = (this.w >= this.h) ? horizontalScrollbar : verticalScrollbar;

    // init the scroll configuration
    this.initScroll(fieldValue);

    // change the value if really need a change
    this.changeScrollPositionFromValue();
    this.prePos = this.pos;
    // register the control value
    evaluator.setVariable(this.id, this.value);
  }

  /**
   * Init the scroll configuration
   */
  descartesJS.Scrollbar.prototype.initScroll = function(fieldValue) {
    self = this;
    evaluator = self.evaluator;

    var defaultHeight = (self.orientation === verticalScrollbar) ? parseInt(19 + (5*(self.h-100))/100) : self.h;

    // find the font size of the text field
    self.fieldFontSize = (self.orientation === verticalScrollbar) ? (defaultHeight - parseInt(self.h/20) -1) : ((self.parent.version !== 2) ? descartesJS.getFieldFontSize(defaultHeight) : 10);

    var fieldValueSize = descartesJS.getTextWidth(fieldValue+"_", self.fieldFontSize+"px Arial");
    
    var spaceH = self.parent.getSpaceById(self.spaceID).h;
    
    self.labelHeight = (self.name == "") ? 0 : defaultHeight;
    self.fieldHeight = (self.visible == "") ? 0 : defaultHeight;
    
    // vertical orientation
    if (self.orientation === verticalScrollbar) {
      self.canvasWidth = self.w;
      self.canvasHeight = self.h - self.labelHeight - self.fieldHeight;    

      if (self.canvasHeight + self.y - spaceH >= 18) {
        self.canvasHeight = spaceH;
      }
      
      var sbx = 0;
      var sby = self.fieldHeight;
      var TFy = sby + self.canvasHeight;

      self.canvasX = 0;
      self.canvasY = self.fieldHeight;
      
      self.labelWidth = self.w;
      self.labelY = TFy;
      
      self.upWidth = self.downW = self.w;
      self.upHeight = self.downH = 15;
      self.upX = 0;
      self.upY = self.fieldHeight;
      self.downX = 0;
      self.downY = TFy-self.downH;
      
      self.fieldWidth = self.w;
      self.fieldX = 0;
      
      self.scrollManipulatorW = self.w;
      self.scrollManipulatorH = parseInt( (self.canvasHeight -self.upHeight -self.downH -self.labelHeight -self.fieldHeight)/10 );
      self.scrollManipulatorH = (self.scrollManipulatorH < 15) ? 15 : self.scrollManipulatorH;
      
      self.scrollManipulatorLimInf = TFy -self.downH -self.scrollManipulatorH;
      self.scrollManipulatorLimSup = sby+self.downH;
    }
    else {
      var minsbw = 58;
      
      // get the width of all elements in the scrollbar
      var minLabelWidth = descartesJS.getTextWidth(self.name, self.fieldFontSize+"px Arial") +10;
      self.labelWidth = minLabelWidth;
      var minTFWidth = fieldValueSize;
      self.fieldWidth = minTFWidth;
      
      if (self.name == "") {
        self.labelWidth = 0;
      }
      
      if (!self.visible) {
        self.fieldWidth = 0;
      }
      
      var sbw = self.w - self.fieldWidth - self.labelWidth;
      while ((sbw < minsbw) && (self.labelWidth > 0)) {
        self.labelWidth--;
        sbw++;
      }
      while ((sbw < minsbw) && (self.fieldWidth > 0)) {
        self.fieldWidth--;
        sbw++;
      }
      
      var sbx = self.labelWidth;
      var sby = 0;
      var TFx = sbx + sbw;
      self.fieldWidth = self.w - TFx;
      
      self.canvasWidth = sbw;
      self.canvasHeight = self.h;
      self.canvasX = self.labelWidth;
      self.canvasY = 0;

      self.fieldX = self.canvasWidth + self.labelWidth;
      
      self.labelHeight = self.h;
      self.labelY = 0;
      
      self.upWidth = self.downW = 15;
      self.upHeight = self.downH = self.h;
      self.upX = TFx-self.downW;
      self.upY = 0;
      self.downX = self.labelWidth;
      self.downY = 0;
      
      self.scrollManipulatorW = parseInt( (self.canvasWidth-self.upWidth-self.downW)/10 );
      self.scrollManipulatorW = (self.scrollManipulatorW < 15) ? 15 : self.scrollManipulatorW;
      self.scrollManipulatorH = self.h;
      
      self.scrollManipulatorLimInf = sbx+self.downW;
      self.scrollManipulatorLimSup = sbx+self.canvasWidth-self.downW -self.scrollManipulatorW;
    }

    self.containerControl.setAttribute("class", "DescartesScrollbarContainer");
    self.containerControl.setAttribute("style", "width: " + self.w + "px; height: " + self.h + "px; left: " + self.x + "px; top: " + self.y + "px; z-index: " + self.zIndex + ";");
    
    self.canvas.setAttribute("width", self.w+"px");
    self.canvas.setAttribute("height", self.h+"px");
    self.canvas.setAttribute("style", "position: absolute; left: 0px; top: 0px;");    
    self.ctx = self.canvas.getContext("2d");
  
    self.divUp.setAttribute("class", "DescartesCatcher");
    self.divUp.setAttribute("style", "width : " + self.upWidth + "px; height : " + self.upHeight + "px; left: " + self.upX + "px; top: " + self.upY + "px;");
    self.divDown.setAttribute("class", "DescartesCatcher");
    self.divDown.setAttribute("style", "width : " + self.downW + "px; height : " + self.downH + "px; left: " + self.downX + "px; top: " + self.downY + "px;");
    
    self.scrollManipulator.setAttribute("class", "DescartesCatcher");
    self.scrollManipulator.setAttribute("style", "width : " + self.scrollManipulatorW + "px; height : " + self.scrollManipulatorH + "px;");
    self.scrollManipulator.style.top = ((self.orientation === verticalScrollbar) ? self.scrollManipulatorLimInf : 0) + "px";
    self.scrollManipulator.style.left = ((self.orientation === verticalScrollbar) ? 0 : self.scrollManipulatorLimInf) + "px";
        
    // style the text field
    self.field.setAttribute("type", "text");
    self.field.setAttribute("id", self.id+"scrollbar");
    self.field.setAttribute("class", "DescartesScrollbarField");
    self.field.setAttribute("style", "font-size: " + self.fieldFontSize + "px; width : " + (self.fieldWidth-2) + "px; height : " + (self.fieldHeight-2) + "px; left: " + self.fieldX + "px; top: 0px;");
    self.field.value = fieldValue;
    if (self.fieldHeight === 0) {
      self.field.style.display = "none";
    }
    
    // style the label
    self.label.setAttribute("class", "DescartesScrollbarLabel");
    self.label.setAttribute("style", "font-size:" + self.fieldFontSize + "px; width: " + self.labelWidth + "px; height: " + self.labelHeight + "px; line-height: " + self.labelHeight + "px; left: 0px; top:" + self.labelY + "px;");
    
    // create the label text
    self.txtLabel = document.createTextNode(self.name);

    // this.update();
  }
    
  /**
   * Update the scrollbar
   */
  descartesJS.Scrollbar.prototype.update = function() {
    evaluator = this.evaluator;

    // the incremente is the interval [min, max] dividen by 100 if has decimasl, if not then the incremente is 1
    if (evaluator.evalExpression(this.decimals) == 0) {
      this.incr = 1;
    }
    else {
      this.incr = (evaluator.evalExpression(this.max) - evaluator.evalExpression(this.min)) / 100;
    }

    // check if the control is active and visible
    this.activeIfValue = (evaluator.evalExpression(this.activeif) > 0);
    this.drawIfValue = (evaluator.evalExpression(this.drawif) > 0);

    // enable or disable the control
    this.field.disabled = !this.activeIfValue;
    
    // hide or show the menu control
    if (this.drawIfValue) {
      this.containerControl.style.display = "block";
      this.draw();
    } else {
      this.containerControl.style.display = "none";
    }
    
    // update the position and size
    this.updatePositionAndSize();

    // update the value of the menu
    var tmpValue = this.validateValue( evaluator.getVariable(this.id) );
    if ( (tmpValue != this.value) && !((Math.abs(tmpValue - this.value)>0) && (Math.abs(tmpValue - this.value)<.000000001))) {
      this.value = tmpValue;
      this.changeScrollPositionFromValue();
      this.prePos = this.pos;
    }

    this.value = tmpValue;
    this.field.value = this.formatOutputValue(this.value);

    // register the control value
    evaluator.setVariable(this.id, this.value);
  }

  /**
   * Draw the scrollbar
   */
  descartesJS.Scrollbar.prototype.draw = function() {
    self = this;
    ctx = self.ctx;

    tmpW = MathFloor(this.w);
    tmpH = MathFloor(this.h);

    ctx.fillStyle = "#e0e4e8";
    ctx.fillRect(0, 0, tmpW, tmpH);

    ctx.strokeStyle = "#7a8a99";

    if (self.down) {
      ctx.fillStyle = "#ccdcec";
      ctx.fillRect(self.downX+.5, self.downY+.5, self.downW, self.downH-1);
    }
    ctx.strokeRect(self.downX+.5, self.downY+.5, self.downW, self.downH-1);

    if (self.up) {
      ctx.fillStyle = "#ccdcec";
      ctx.fillRect(self.upX+.5, self.upY-.5, self.upWidth, self.upHeight+1);
    }
    ctx.strokeRect(self.upX+.5, self.upY-.5, self.upWidth, self.upHeight+1);

    desp = 4;
    ctx.fillStyle = "black";
    ctx.beginPath();

    if (self.orientation === horizontalScrollbar) {
      // triangle in the buttons
      ctx.moveTo(self.downX +desp, self.downH/2);
      ctx.lineTo(self.downX +self.downW -desp, desp);
      ctx.lineTo(self.downX +self.downW -desp, self.downH -desp);
      ctx.moveTo(self.upX + self.upWidth -desp, self.downH/2);
      ctx.lineTo(self.upX +desp, desp);
      ctx.lineTo(self.upX +desp, self.downH -desp);
      ctx.fill();

      if (self.activeIfValue) {
        // scroll handler
        tmpPos = MathFloor(self.pos);
        ctx.fillStyle = "#ccdcec";
        ctx.fillRect(tmpPos+.5, 0, MathFloor(self.scrollManipulatorW), tmpH);
        ctx.strokeStyle = "#6382bf";
        ctx.strokeRect(tmpPos+.5, 0, MathFloor(self.scrollManipulatorW), tmpH);

        // scroll handler lines
        smw = MathFloor(self.scrollManipulatorW/2);
        ctx.beginPath();
        ctx.moveTo(tmpPos+smw+.5-2, 3);
        ctx.lineTo(tmpPos+smw+.5-2, tmpH-3);
        ctx.moveTo(tmpPos+smw+.5,   3);
        ctx.lineTo(tmpPos+smw+.5,   tmpH-3);
        ctx.moveTo(tmpPos+smw+.5+2, 3);
        ctx.lineTo(tmpPos+smw+.5+2, tmpH-3);
        ctx.stroke();
      }

    }
    else {
      // triangle in the buttons
      ctx.moveTo(self.downX +self.downW/2, self.downY +self.downH -desp);
      ctx.lineTo(self.downX +desp, self.downY +desp);
      ctx.lineTo(self.downX +self.downW -desp, self.downY +desp);
      ctx.moveTo(self.upX +self.upWidth/2, self.upY +desp);
      ctx.lineTo(self.upX +desp, self.upY +self.upHeight -desp);
      ctx.lineTo(self.upX +self.upWidth -desp, self.upY +self.upHeight -desp);
      ctx.fill();

      if (self.activeIfValue) {
        // scroll handler
        tmpPos = MathFloor(self.pos);
        ctx.fillStyle = "#ccdcec";
        ctx.fillRect(0, tmpPos+.5, tmpW, MathFloor(self.scrollManipulatorH));
        ctx.strokeStyle = "#6382bf";
        ctx.strokeRect(0, tmpPos+.5, tmpW, MathFloor(self.scrollManipulatorH));

        // scroll handler lines
        smw = MathFloor(self.scrollManipulatorH/2);
        ctx.beginPath();
        ctx.moveTo(3,      tmpPos+smw+.5-2);
        ctx.lineTo(tmpW-3, tmpPos+smw+.5-2);
        ctx.moveTo(3,      tmpPos+smw+.5);
        ctx.lineTo(tmpW-3, tmpPos+smw+.5);
        ctx.moveTo(3,      tmpPos+smw+.5+2);
        ctx.lineTo(tmpW-3, tmpPos+smw+.5+2);
        ctx.stroke();
      }
    }

    // external border
    ctx.strokeRect(.5, .5, tmpW-1, tmpH-1);

    // inactive shade
    if (!self.activeIfValue) {
      ctx.fillStyle = "rgba(" + 0xf0 + "," + 0xf0 + "," + 0xf0 + "," + (0xa0/255) + ")";
      ctx.fillRect(0, 0, tmpW, tmpH.h);
    }
  }
  
  /**
   * Validate if the value is the range [min, max]
   * @param {String} value the value to validate
   * @return {Number} return the value like a number, 
   *                         is greater than the upper limit then return the upper limit
   *                         is less than the lower limit then return the lower limit
   */
  descartesJS.Scrollbar.prototype.validateValue = function(value) {
    evaluator = this.evaluator;
    resultValue = value.toString();
    resultValue = parseFloat( resultValue.replace(this.parent.decimal_symbol, ".") );

    // if the value is a string that do not represent a number, parseFloat return NaN
    if (isNaN(resultValue)) {
      resultValue = 0; 
    }
    
    // if is less than the lower limit
    this.minimo = evaluator.evalExpression(this.min);
    if (resultValue < this.minimo) {
      this.value = null;
      resultValue = this.minimo;
    }

    // if si greater than the upper limit
    this.maximo = evaluator.evalExpression(this.max);
    if (resultValue > this.maximo) {
      this.value = null;
      resultValue = this.maximo;
    }

    incr = this.incr;
    resultValue = (incr != 0) ? (resultValue*incr)/incr : 0;

//     if (this.discrete) {
//       var incr = this.incr;
//       resultValue = incr * Math.round(resultValue / incr);
//     }

    if (this.fixed) {
      resultValue = parseFloat(parseFloat(resultValue).toFixed(evaluator.evalExpression(this.decimals)));
    }

    return resultValue;
  }

  /**
   * Increase the value of the scrollbar
   */
  descartesJS.Scrollbar.prototype.increase = function() {
    this.changeValue( parseFloat(this.value) + this.incr );
  }
  
  /**
   * Decrease the value of the scrollbar
   */
  descartesJS.Scrollbar.prototype.decrease = function() {
    this.changeValue( parseFloat(this.value) - this.incr );
  }

  /**
   * Increase by then the value of the scrollbar
   */
  descartesJS.Scrollbar.prototype.increase10 = function() {
    desp = (this.evaluator.evalExpression(this.max)-this.evaluator.evalExpression(this.min))/10;

    if (this.orientation == horizontalScrollbar) {
      if (this.clickPos.x > this.prePos) {
        this.changeValue( parseFloat(this.value) + desp );
      }
    } else {
      if (this.clickPos.y < this.prePos) {
        this.changeValue( parseFloat(this.value) + desp );
      }      
    }
  }
  
  /**
   * Decrease by then the value of the scrollbar
   */
  descartesJS.Scrollbar.prototype.decrease10 = function() {
    desp = (this.evaluator.evalExpression(this.max)-this.evaluator.evalExpression(this.min))/10;

    if (this.orientation == horizontalScrollbar) {
      if (this.clickPos.x < this.prePos) {
        this.changeValue( parseFloat(this.value) - desp );
      } 
    } else {
      if (this.clickPos.y > this.prePos) {
        this.changeValue( parseFloat(this.value) - desp );
      } 
    }
  }
  
  /**
   * Change the scrollbar value
   */
  descartesJS.Scrollbar.prototype.changeValue = function(value) {
    if (this.activeIfValue) {
      newValue = this.validateValue(value);

      // change the value if really need a change
      if (newValue != this.value) {
        this.value = newValue;
        this.field.value = this.formatOutputValue(newValue);
        
        this.changeScrollPositionFromValue();

        this.prePos = this.pos;

        // register the control value
        this.evaluator.setVariable(this.id, this.value);

        this.updateAndExecAction();
      }
    }
  }

  /**
   * Change the value when the scroll handler move
   */
  descartesJS.Scrollbar.prototype.changeValueForScrollMovement = function() {
    evaluator = this.evaluator;
    limInf = this.scrollManipulatorLimInf;
    limSup = this.scrollManipulatorLimSup;
    min = evaluator.evalExpression(this.min);
    max = evaluator.evalExpression(this.max);
    incr = this.incr;
        
    newValue = MathFloor( (((this.pos-limInf)*(max-min))/(limSup-limInf))/incr )*incr  +min;
    
    // if the value change, the update everything
    if (newValue != this.value) {
      this.value = newValue;
      this.field.value = this.formatOutputValue(newValue);
      
      // register the control value
      evaluator.setVariable(this.id, this.value);
      
      // update the controls
      this.parent.updateControls();
      // execute the acction
      this.actionExec.execute();
      // update again the controls
      this.parent.update();
    }
  }
  
  /**
   * Change the position of the scroll handler give the value
   */
  descartesJS.Scrollbar.prototype.changeScrollPositionFromValue = function() {
    evaluator = this.evaluator;
    limInf = this.scrollManipulatorLimInf;
    limSup = this.scrollManipulatorLimSup;
    min = evaluator.evalExpression(this.min);
    max = evaluator.evalExpression(this.max);
    incr = this.incr;
    
    this.pos = (((this.value-min)*(limSup-limInf))/(max-min))+limInf;
    
    if (this.orientation == horizontalScrollbar) {
      // this.scrollManipulator.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + this.scrollManipulatorW + "px; height : " + this.h + "px; left: " + this.pos + "px; top: 0px;");
      this.scrollManipulator.style.left = this.pos + "px";
    } else {
      // this.scrollManipulator.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + this.w + "px; height : " + this.scrollManipulatorH + "px; left: 0px; top: " + this.pos + "px;");
      this.scrollManipulator.style.top = this.pos + "px";
    }
  }
  
  /**
   * Register the mouse and touch events
   */
  descartesJS.Scrollbar.prototype.registerMouseAndTouchEvents = function() {
    hasTouchSupport = descartesJS.hasTouchSupport;

    var self = this;
    var delay = (hasTouchSupport) ? 500 : 200;
    var timer;

    // prevent the context menu display
    self.canvas.oncontextmenu = self.divUp.oncontextmenu = self.divDown.oncontextmenu = self.label.oncontextmenu = self.field.oncontextmenu = self.scrollManipulator.oncontextmenu = function () { return false; };

    /**
     * Repeat a function during a period of time, when the user click and hold the click in the button
     * @param {Number} delayTime the delay of time between the function repetition
     * @param {Function} fun the function to execut
     * @param {Boolean} firstime a flag to indicated if is the first time clicked
     * @private
     */    
    function repeat(delayTime, fun, firstTime, limit) {
      clearInterval(timer);

      if ((self.up || self.down || self.canvasClick) && (Math.abs(self.value - limit) > .0000001)) {
        fun.call(self);
        delayTime = (firstTime) ? delayTime : 30;
        timer = setTimeout(function() { repeat(delayTime, fun, false, limit); }, delayTime);
      }
    }
    
    /**
     * 
     * @param {Event} 
     * @private
     */
    function onKeyDown_TextField(evt) {
      // responds to enter
      if (evt.keyCode == 13) {
        self.changeValue(self.field.value);
      }
    }
    this.field.addEventListener("keydown", onKeyDown_TextField);
    
    /**
     * 
     * @param {Event} 
     * @private
     */
    function onMouseDown_canvas(evt) {
      evt.preventDefault();

      self.whichButton = descartesJS.whichButton(evt);

      if (self.whichButton == "L") {
        if (self.activeIfValue) {
          self.clickPos = self.getCursorPosition(evt);
          self.canvasClick = true;
          
          if (self.orientation == horizontalScrollbar) {
            if (self.clickPos.x < self.prePos) {
              repeat(delay, self.decrease10, true, self.minimo);
            } 
            else {
              repeat(delay, self.increase10, true, self.maximo);
            }
          } 
          else {
            if (self.clickPos.y < self.prePos) {
              repeat(delay, self.increase10, true, self.maximo);
            } 
            else {
              repeat(delay, self.decrease10, true, self.minimo);
            }
          }
        }
      }
    }
    if (hasTouchSupport) {
      this.canvas.addEventListener("touchstart", onMouseDown_canvas);
    } else {
      this.canvas.addEventListener("mousedown", onMouseDown_canvas);
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseOut_canvas(evt) {
      self.canvasClick = false;
      clearInterval(timer);
      evt.preventDefault();
    }
    if (!hasTouchSupport) {
      this.divDown.addEventListener("mouseout", onMouseOut_DownButton);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseUp_Canvas(evt) {
      self.canvasClick = false;
      clearInterval(timer);
      evt.preventDefault();
    }
    if (hasTouchSupport) {
      window.addEventListener("touchend", onMouseUp_Canvas);
    } else {
      window.addEventListener("mouseup", onMouseUp_Canvas);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseMove_Canvas(evt) {
      if (self.canvasClick == true) {
        self.clickPos = self.getCursorPosition(evt);
        evt.preventDefault();
      }
    }
    if (hasTouchSupport) {
      this.canvas.addEventListener("touchmove", onMouseMove_Canvas);
    } else {
      this.canvas.addEventListener("mousemove", onMouseMove_Canvas);
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseDown_scrollManipulator(evt) {
      if (self.activeIfValue) {
        self.scrollClick = true;
        
        self.initPos = self.getCursorPosition(evt);

        window.addEventListener("mouseup", onMouseUp_scrollManipulator);
        window.addEventListener("mousemove", onMouseMove_scrollManipulator);
        
        evt.preventDefault();
      }
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onTouchStart_scrollManipulator(evt) {
      if (self.activeIfValue) {
        self.scrollClick = true;
        
        self.initPos = self.getCursorPosition(evt);

        window.addEventListener("touchend", onTouchEnd_scrollManipulator);
        window.addEventListener("touchmove", onToucheMove_scrollManipulator);
        
        evt.preventDefault();
      }    
    }
    
    if (hasTouchSupport) {
      this.scrollManipulator.addEventListener("touchstart", onTouchStart_scrollManipulator);
    } else {
      this.scrollManipulator.addEventListener("mousedown", onMouseDown_scrollManipulator);
    }
    
    /**
     * 
     * @param {Event} evt
     * @private
     */
    function onMouseUp_scrollManipulator(evt) {
      self.scrollClick = false;

      self.prePos = self.pos;

      window.removeEventListener("mouseup", onMouseUp_scrollManipulator, false);
      window.removeEventListener("mousemove", onMouseMove_scrollManipulator, false);

      evt.preventDefault();
    }
    
    /**
     * 
     * @param {Event} evt
     * @private
     */
    function onTouchEnd_scrollManipulator(evt) {
      self.scrollClick = false;

      self.prePos = self.pos;

      window.removeEventListener("touchend", onTouchEnd_scrollManipulator, false);
      window.removeEventListener("touchmove", onMouseMove_scrollManipulator, false);

      evt.preventDefault();
    }
    
    /**
     * 
     * @param {Event} evt
     * @private
     */
    function onMouseMove_scrollManipulator(evt) {
      var newPos = self.getCursorPosition(evt);

      if (self.orientation == horizontalScrollbar) {
        self.pos = self.prePos - (self.initPos.x - newPos.x);

        if (self.pos < self.scrollManipulatorLimInf) {
          self.pos =  self.scrollManipulatorLimInf;
        }
      
        if (self.pos > self.scrollManipulatorLimSup) {
          self.pos =  self.scrollManipulatorLimSup;
        }

        self.scrollManipulator.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + self.scrollManipulatorW + "px; height : " + self.h + "px; left: " + self.pos + "px; top: 0px;"); 
      } else {
        self.pos = self.prePos - (self.initPos.y - newPos.y);

        if (self.pos > self.scrollManipulatorLimInf) {
          self.pos =  self.scrollManipulatorLimInf;
        }
      
        if (self.pos < self.scrollManipulatorLimSup) {
          self.pos =  self.scrollManipulatorLimSup;
        }
       
        self.scrollManipulator.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + self.w + "px; height : " + self.scrollManipulatorH + "px; left: 0px; top: " + self.pos + "px;"); 
      }
      
      self.changeValueForScrollMovement();

      evt.preventDefault();
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseDown_UpButton(evt) {
      evt.preventDefault();

      self.whichButton = descartesJS.whichButton(evt);

      if (self.whichButton == "L") {
        if (self.activeIfValue) {
          self.up = true;
          repeat(delay, self.increase, true, self.maximo);
        }
      }
    }
    if (hasTouchSupport) {
      this.divUp.addEventListener("touchstart", onMouseDown_UpButton);
    } else {
      this.divUp.addEventListener("mousedown", onMouseDown_UpButton);
    }
    
    /**
     * 
     * @param {Event} 
     * @private
     */
    function onMouseDown_DownButton(evt) {
      evt.preventDefault();

      self.whichButton = descartesJS.whichButton(evt);

      if (self.whichButton == "L") {
        if (self.activeIfValue) {
          self.down = true;
          repeat(delay, self.decrease, true, self.minimo);
        }
      }
    }
    if (hasTouchSupport) {
      this.divDown.addEventListener("touchstart", onMouseDown_DownButton);
    } else {
      this.divDown.addEventListener("mousedown", onMouseDown_DownButton);
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseOut_UpButton(evt) {
      self.up = false;
      clearInterval(timer);
      evt.preventDefault();      
    }
    if (!hasTouchSupport) {
      this.divUp.addEventListener("mouseout", onMouseOut_UpButton);
    }

    /**
     * 
     * @param {Event} evt
     * @private
     */
    function onMouseOut_DownButton(evt) {
      self.down = false;
      clearInterval(timer);
      evt.preventDefault();
    }
    if (!hasTouchSupport) {
      this.divDown.addEventListener("mouseout", onMouseOut_DownButton);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseUp_UpButton(evt) {
      self.up = false;
      clearInterval(timer);
      evt.preventDefault();
      self.draw();
    }
    if (hasTouchSupport) {
      window.addEventListener("touchend", onMouseUp_UpButton);
    } else {
      window.addEventListener("mouseup", onMouseUp_UpButton);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseUp_DownButton(evt) {
      self.down = false;
      clearInterval(timer);
      evt.preventDefault();
      self.draw();
    }
    if (hasTouchSupport) {
      window.addEventListener("touchend", onMouseUp_DownButton);
    } else {
      window.addEventListener("mouseup", onMouseUp_DownButton);
    }
    
  }
  
 /**
   * Find the offset postion of a scrollbar
   */
  descartesJS.Scrollbar.prototype.findOffset = function() {
    tmpContainer = this.containerControl;

    this.offsetLeft = 0;
    this.offsetTop = 0;

    // store the display style
    tmpDisplay = this.containerControl.style.display;

    // make visible the element to get the offset values
    this.containerControl.style.display = "block";

    while (tmpContainer) {
      this.offsetLeft += (tmpContainer.offsetLeft || 0);
      this.offsetTop  += (tmpContainer.offsetTop || 0);
      
      tmpContainer = tmpContainer.parentNode;
    }

    // restore the display style
    this.containerControl.style.display = tmpDisplay;
  }

  /**
   * Get the cursor position of the mouse in absolute coordinates respect to space where it is
   * @param {Event} evt the event containing the mouse position
   * @return {Object} return an object with the cursor position
   */
  descartesJS.Scrollbar.prototype.getCursorPosition = function(evt) {
    pos = descartesJS.getCursorPosition(evt);

    return { x: pos.x - this.offsetLeft, 
             y: pos.y - this.offsetTop 
           };
  }  

  return descartesJS;
})(descartesJS || {});