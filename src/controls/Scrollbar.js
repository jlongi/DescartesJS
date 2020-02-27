/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;

  var HORIZONTAL = "h";
  var VERTICAL = "v";

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
  var newValue;
  var limInf;
  var limSup;
  var min;
  var max;
  var name;

  class Scrollbar extends descartesJS.Control {
    /**
     * Descartes scrollbar control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the scrollbar control
     */
    constructor(parent, values){
      // call the parent constructor
      super(parent, values);

      this.label_color = this.label_color || new descartesJS.Color("e0e4e8", parent.evaluator);
      this.label_text_color = this.label_text_color || new descartesJS.Color("000000", parent.evaluator);

      // modification to change the name of the button with an expression
      if (this.name.match(/^\[.*\]?/)) {
        this.name = this.parser.parse(this.name.substring(1, this.name.length-1));
      }
      else {
        this.name = this.parser.parse("'" + this.name + "'");
      }

      this.orientation = (this.w >= this.h) ? HORIZONTAL : VERTICAL;

      // control container
      this.container = descartesJS.newHTML("div", {
        class : "DescartesScrollbarContainer",
        id    : this.id,
      });
      this.canvas = descartesJS.newHTML("canvas");
      this.divUp = descartesJS.newHTML("div", {
        class : "DescartesCatcher up",
      });
      this.divDown = descartesJS.newHTML("div", {
        class : "DescartesCatcher down",
      });
      this.field = descartesJS.newHTML("input", {
        type  : "text",
        id    : this.id + "scrollbar",
        class : "DescartesScrollbarField",
      });

      // the scroll handler
      this.scrollHandler = descartesJS.newHTML("div", {
        class : "DescartesCatcher manipulator",
      });

      // the label
      this.label = descartesJS.newHTML("label", {
        class : "DescartesScrollbarLabel",
      });

      // add the elements to the container
      this.container.appendChild(this.canvas);
      this.container.appendChild(this.label);
      this.container.appendChild(this.divUp);
      this.container.appendChild(this.divDown);
      this.container.appendChild(this.field);
      this.container.appendChild(this.scrollHandler);

      this.addControlContainer(this.container);

      // register the mouse and touch events
      this.addEvents();

      // init the menu parameters
      this.init();
    }

    /**
     * Init the scrollbar
     */
    init() {
      evaluator = this.evaluator;

      // if has decimals the increment are the interval [min, max] divided by 100, if not then the increment is 1
      if (evaluator.eval(this.decimals) == 0) {
        this.incr = 1;
      }
      else {
        this.incr = (evaluator.eval(this.max) - evaluator.eval(this.min)) / 100;
      }

      // validate the initial value
      this.value = this.validateValue( evaluator.eval(this.valueExpr) );

      // format the output value
      fieldValue = this.formatOutputValue(this.value);

      expr = this.evaluator.eval(this.expresion);
      this.x = expr[0][0];
      this.y = expr[0][1];
      if (expr[0].length == 4) {
        this.w = expr[0][2];
        this.h = expr[0][3];
      }
      this.orientation = (this.w >= this.h) ? HORIZONTAL : VERTICAL;

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
    initScroll(fieldValue) {
      self = this;
      evaluator = self.evaluator;

      name = evaluator.eval(self.name).toString();
      self.label.innerHTML = name;
      name = this.label.textContent;

      var defaultHeight = (self.orientation === VERTICAL) ? parseInt(19 + (5*(self.h-100))/100) : self.h;

      // find the font size of the text field
      self.fieldFontSize = (self.orientation === VERTICAL) ? (defaultHeight - parseInt(self.h/20) -1) : ((self.parent.version !== 2) ? descartesJS.getFieldFontSize(defaultHeight) : 10);

      var fieldValueSize = descartesJS.getTextWidth(fieldValue+"_", self.fieldFontSize+"px " + descartesJS.sansserif_font);

      var spaceH = self.parent.getSpaceById(self.spaceID).h;

      self.labelHeight = (name == "") ? 0 : defaultHeight;
      self.fieldHeight = (self.visible == "") ? 0 : defaultHeight;

      // vertical orientation
      if (self.orientation === VERTICAL) {
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

        self.scrollHandlerW = self.w;
        self.scrollHandlerH = parseInt( (self.canvasHeight -self.upHeight -self.downH -self.labelHeight -self.fieldHeight)/10 );
        self.scrollHandlerH = (self.scrollHandlerH < 15) ? 15 : self.scrollHandlerH;

        self.limInf = TFy -self.downH -self.scrollHandlerH;
        self.limSup = sby+self.downH;
      }
      else {
        var minsbw = 58;

        // get the width of all elements in the scrollbar
        var minLabelWidth = descartesJS.getTextWidth(name, self.fieldFontSize+"px " + descartesJS.sansserif_font) +10;
        self.labelWidth = minLabelWidth;
        var minTFWidth = fieldValueSize;
        self.fieldWidth = minTFWidth;

        if (name == "") {
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

        self.scrollHandlerW = parseInt( (self.canvasWidth-self.upWidth-self.downW)/10 );
        self.scrollHandlerW = (self.scrollHandlerW < 15) ? 15 : self.scrollHandlerW;
        self.scrollHandlerH = self.h;

        self.limInf = sbx+self.downW;
        self.limSup = sbx+self.canvasWidth-self.downW -self.scrollHandlerW;
      }

      self.container.setAttribute("style", `width:${self.w}px;height:${self.h}px;left:${self.x}px;top:${self.y}px;z-index:${self.zIndex};`);

      self.canvas.setAttribute("width", self.w+"px");
      self.canvas.setAttribute("height", self.h+"px");
      self.canvas.setAttribute("style", "position:absolute;left:0;top:0;");
      self.ctx = self.canvas.getContext("2d");
      self.ctx.imageSmoothingEnabled = false;

      self.divUp.setAttribute("style", `width:${self.upWidth}px;height:${self.upHeight}px;left:${self.upX}px;top:${self.upY}px;`);

      self.divDown.setAttribute("style", `width:${self.downW}px;height:${self.downH}px;left:${self.downX}px;top:${self.downY}px;`);

      self.scrollHandler.setAttribute("style", `width:${self.scrollHandlerW}px;height:${self.scrollHandlerH}px;left:${(self.orientation === VERTICAL) ? 0 : self.limInf}px;top:${(self.orientation === VERTICAL) ? self.limInf : 0}px;`);

      // style the text field
      self.field.setAttribute("style", `font-size:${self.fieldFontSize}px;width:${self.fieldWidth}px;height:${self.fieldHeight}px;left:${self.fieldX}px;top:0;`);
      if (self.fieldHeight === 0) {
        self.field.style.display = "none";
      }

      // style the label
      self.label.setAttribute("style", `font-size:${self.fieldFontSize}px;width:${self.labelWidth}px;height:${self.labelHeight}px;line-height:${self.labelHeight}px;left:0;top:${self.labelY}px;background-color:${this.label_color.getColor()};color:${this.label_text_color.getColor()};`);
    }

    /**
     * Update the scrollbar
     */
    update() {
      evaluator = this.evaluator;

      this.label.innerHTML = evaluator.eval(this.name).toString();

      // the increment is the interval [min, max] divided by 100 if has decimals, if not then the increment is 1
      if (evaluator.eval(this.decimals) == 0) {
        this.incr = 1;
      }
      else {
        this.incr = (evaluator.eval(this.max) - evaluator.eval(this.min)) / 100;
      }

      // check if the control is active and visible
      this.activeIfValue = (evaluator.eval(this.activeif) > 0);
      this.drawIfValue = (evaluator.eval(this.drawif) > 0);

      // enable or disable the control
      this.field.disabled = !this.activeIfValue;

      // hide or show the menu control
      if (this.drawIfValue) {
        this.container.style.display = "block";
        this.draw();
      } else {
        this.container.style.display = "none";
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
    draw() {
      self = this;
      ctx = self.ctx;

      tmpW = MathFloor(this.w);
      tmpH = MathFloor(this.h);

      ctx.fillStyle = "#e0e4e8";
      ctx.fillRect(0, 0, tmpW, tmpH);

      ctx.strokeStyle = "#7a8a99";
      ctx.fillStyle = "#ccdcec";

      if (self.down) {
        ctx.fillRect(self.downX+.5, self.downY+.5, self.downW, self.downH-1);
      }
      ctx.strokeRect(self.downX+.5, self.downY+.5, self.downW, self.downH-1);

      if (self.up) {
        ctx.fillRect(self.upX+.5, self.upY-.5, self.upWidth, self.upHeight+1);
      }
      ctx.strokeRect(self.upX+.5, self.upY-.5, self.upWidth, self.upHeight+1);

      desp = 4;
      ctx.fillStyle = "black";
      ctx.beginPath();

      if (self.orientation === HORIZONTAL) {
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
          ctx.fillRect(tmpPos+.5, 0, MathFloor(self.scrollHandlerW), tmpH);
          ctx.strokeStyle = "#6382bf";
          ctx.strokeRect(tmpPos+.5, 0, MathFloor(self.scrollHandlerW), tmpH);

          // scroll handler lines
          smw = MathFloor(self.scrollHandlerW/2);
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
          ctx.fillRect(0, tmpPos+.5, tmpW, MathFloor(self.scrollHandlerH));
          ctx.strokeStyle = "#6382bf";
          ctx.strokeRect(0, tmpPos+.5, tmpW, MathFloor(self.scrollHandlerH));

          // scroll handler lines
          smw = MathFloor(self.scrollHandlerH/2);
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
        ctx.fillStyle = `rgba(240,240,240,${0xa0/255})`;
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
    validateValue(value) {
      evaluator = this.evaluator;
      resultValue = value.toString();
      resultValue = parseFloat( resultValue.replace(this.parent.decimal_symbol, ".") );

      // if the value is a string that do not represent a number, parseFloat return NaN
      if (isNaN(resultValue)) {
        resultValue = 0;
      }

      // if is less than the lower limit
      this.minimo = evaluator.eval(this.min);
      if (resultValue < this.minimo) {
        this.value = null;
        resultValue = this.minimo;
      }

      // if si greater than the upper limit
      this.maximo = evaluator.eval(this.max);
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
        resultValue = parseFloat(parseFloat(resultValue).toFixed(evaluator.eval(this.decimals)));
      }

      return resultValue;
    }

    /**
     * Increase the value of the scrollbar
     */
    increase() {
      this.changeValue( parseFloat(this.value) + this.incr );
    }

    /**
     * Decrease the value of the scrollbar
     */
    decrease() {
      this.changeValue( parseFloat(this.value) - this.incr );
    }

    /**
     * Increase by then the value of the scrollbar
     */
    increase10() {
      desp = (this.evaluator.eval(this.max)-this.evaluator.eval(this.min))/10;

      if (this.orientation == HORIZONTAL) {
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
    decrease10() {
      desp = (this.evaluator.eval(this.max)-this.evaluator.eval(this.min))/10;

      if (this.orientation == HORIZONTAL) {
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
    changeValue(value) {
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
    changeValueForScrollMovement() {
      evaluator = this.evaluator;
      limInf = this.limInf;
      limSup = this.limSup;
      min = evaluator.eval(this.min);
      max = evaluator.eval(this.max);
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
        // execute the action
        this.actionExec.execute();
        // update again the controls
        this.parent.update();
      }
    }

    /**
     * Change the position of the scroll handler give the value
     */
    changeScrollPositionFromValue() {
      evaluator = this.evaluator;
      limInf = this.limInf;
      limSup = this.limSup;
      min = evaluator.eval(this.min);
      max = evaluator.eval(this.max);
      incr = this.incr;

      this.pos = (((this.value-min)*(limSup-limInf))/(max-min))+limInf;

      this.scrollHandler.style[(this.orientation == HORIZONTAL) ? "left" : "top"] = this.pos + "px";
    }

    /**
     * Register the mouse and touch events
     */
    addEvents() {
      var self = this;
      var delay = 350;
      var timer;

      // prevent the context menu display
      self.canvas.oncontextmenu = self.divUp.oncontextmenu = self.divDown.oncontextmenu = self.label.oncontextmenu = self.field.oncontextmenu = self.scrollHandler.oncontextmenu = function () { return false; };

      /**
       * Repeat a function during a period of time, when the user click and hold the click in the button
       * @param {Number} delayTime the delay of time between the function repetition
       * @param {Function} fun the function to execute
       * @param {Boolean} firstTime a flag to indicated if is the first time clicked
       * @private
       */
      function repeat(delayTime, fun, firstTime, limit) {
        descartesJS.clearTimeout(timer);

        if ((self.up || self.down || self.canvasClick) && (Math.abs(self.value - limit) > .0000001)) {
          fun.call(self);
          delayTime = (firstTime) ? delayTime : 30;
          timer = descartesJS.setTimeout(function() { repeat(delayTime, fun, false, limit); }, delayTime);
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

        self.whichBtn = descartesJS.whichBtn(evt);

        if ( (self.whichBtn == "L") && (self.activeIfValue) ) {
          self.clickPos = descartesJS.getCursorPosition(evt, self.container);
          self.canvasClick = true;

          if (self.orientation == HORIZONTAL) {
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

      this.canvas.addEventListener("touchstart", onMouseDown_canvas);
      this.canvas.addEventListener("mousedown", onMouseDown_canvas);

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseOut_canvas(evt) {
        self.canvasClick = false;
        descartesJS.clearTimeout(timer);
        evt.preventDefault();
      }
      this.divDown.addEventListener("mouseout", onMouseOut_DownButton);

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseUp_Canvas(evt) {
        self.canvasClick = false;
        descartesJS.clearTimeout(timer);
      }
      window.addEventListener("touchend", onMouseUp_Canvas);
      window.addEventListener("mouseup", onMouseUp_Canvas);

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseMove_Canvas(evt) {
        if (self.canvasClick == true) {
          self.clickPos = descartesJS.getCursorPosition(evt, self.container);
          evt.preventDefault();
        }
      }
      this.canvas.addEventListener("touchmove", onMouseMove_Canvas);
      this.canvas.addEventListener("mousemove", onMouseMove_Canvas);

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseDown_scrollHandler(evt) {
        if (self.activeIfValue) {
          self.scrollClick = true;

          self.initPos = descartesJS.getCursorPosition(evt, self.container);

          window.addEventListener("mouseup", onMouseUp_scrollHandler);
          window.addEventListener("mousemove", onMouseMove_scrollHandler);

          evt.preventDefault();
        }
      }

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onTouchStart_scrollHandler(evt) {
        if (self.activeIfValue) {
          self.scrollClick = true;

          self.initPos = descartesJS.getCursorPosition(evt, self.container);

          window.addEventListener("touchend", onTouchEnd_scrollHandler);
          window.addEventListener("touchmove", onMouseMove_scrollHandler);

          evt.preventDefault();
        }
      }

      this.scrollHandler.addEventListener("touchstart", onTouchStart_scrollHandler);
      this.scrollHandler.addEventListener("mousedown", onMouseDown_scrollHandler);

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseUp_scrollHandler(evt) {
        self.scrollClick = false;

        self.prePos = self.pos;

        window.removeEventListener("mouseup", onMouseUp_scrollHandler, false);
        window.removeEventListener("mousemove", onMouseMove_scrollHandler, false);

        evt.preventDefault();
      }

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onTouchEnd_scrollHandler(evt) {
        self.scrollClick = false;

        self.prePos = self.pos;

        window.removeEventListener("touchend", onTouchEnd_scrollHandler, false);
        window.removeEventListener("touchmove", onMouseMove_scrollHandler, false);

        evt.preventDefault();
      }

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseMove_scrollHandler(evt) {
        var newPos = descartesJS.getCursorPosition(evt, self.container);

        if (self.orientation == HORIZONTAL) {
          self.pos = self.prePos - (self.initPos.x - newPos.x);

          if (self.pos < self.limInf) {
            self.pos =  self.limInf;
          }

          if (self.pos > self.limSup) {
            self.pos =  self.limSup;
          }

          self.scrollHandler.setAttribute("style", `width:${self.scrollHandlerW}px;height:${self.h}px;left:${self.pos}px;top:0;`);
        }
        else {
          self.pos = self.prePos - (self.initPos.y - newPos.y);

          if (self.pos > self.limInf) {
            self.pos =  self.limInf;
          }

          if (self.pos < self.limSup) {
            self.pos =  self.limSup;
          }

          self.scrollHandler.setAttribute("style", `width:${self.w}px;height:${self.scrollHandlerH}px;left:0;top:${self.pos}px;`);
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

        self.whichBtn = descartesJS.whichBtn(evt);

        if (self.whichBtn == "L") {
          if (self.activeIfValue) {
            self.up = true;
            repeat(delay, self.increase, true, self.maximo);
          }
        }
      }
      this.divUp.addEventListener("touchstart", onMouseDown_UpButton);
      this.divUp.addEventListener("mousedown", onMouseDown_UpButton);

      /**
       *
       * @param {Event}
       * @private
       */
      function onMouseDown_DownButton(evt) {
        evt.preventDefault();

        self.whichBtn = descartesJS.whichBtn(evt);

        if (self.whichBtn == "L") {
          if (self.activeIfValue) {
            self.down = true;
            repeat(delay, self.decrease, true, self.minimo);
          }
        }
      }
      this.divDown.addEventListener("touchstart", onMouseDown_DownButton);
      this.divDown.addEventListener("mousedown", onMouseDown_DownButton);

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseOut_UpButton(evt) {
        self.up = false;
        descartesJS.clearTimeout(timer);
        evt.preventDefault();
      }
      this.divUp.addEventListener("mouseout", onMouseOut_UpButton);

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseOut_DownButton(evt) {
        self.down = false;
        descartesJS.clearTimeout(timer);
        evt.preventDefault();
      }
      this.divDown.addEventListener("mouseout", onMouseOut_DownButton);

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseUp_UpButton(evt) {
        self.up = false;
        descartesJS.clearTimeout(timer);
        self.draw();
      }
      window.addEventListener("touchend", onMouseUp_UpButton);
      window.addEventListener("mouseup", onMouseUp_UpButton);

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseUp_DownButton(evt) {
        self.down = false;
        descartesJS.clearTimeout(timer);
        self.draw();
      }
      window.addEventListener("touchend", onMouseUp_DownButton);
      window.addEventListener("mouseup", onMouseUp_DownButton);

    }
  }

  descartesJS.Scrollbar = Scrollbar;
  return descartesJS;
})(descartesJS || {});
