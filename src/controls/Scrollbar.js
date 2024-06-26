/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  const MathFloor = Math.floor;

  const delay = 350;
  const HORIZONTAL = "h";
  const VERTICAL = "v";

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
  var int_color;

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

      this.name_str = this.name;

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
      this.label = descartesJS.newHTML("canvas", {
        class : "DescartesScrollbarLabel",
      });
      this.label_ctx = this.label.getContext("2d");
      this.ratio = parent.ratio;

      // add the elements to the container
      this.container.appendChild(this.canvas);
      this.container.appendChild(this.label);
      this.container.appendChild(this.divUp);
      this.container.appendChild(this.divDown);
      this.container.appendChild(this.field);
      this.container.appendChild(this.scrollHandler);

      this.cover = descartesJS.newHTML("div", {
        class : "TextfieldCover"
      });
      if ( (this.keyboard) && (this.visible) ) {
        this.container.appendChild(this.cover);
      }

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

      self.label.innerHTML = evaluator.eval(self.name).toString();
      name = self.label.textContent;

      var defaultHeight = (self.orientation === VERTICAL) ? parseInt(19 + (5*(self.h-100))/100) : self.h;

      // find the font size of the text field
      self.fieldFontSize = (evaluator.eval(self.font_size)>0) ? evaluator.eval(self.font_size) : ( (self.orientation === VERTICAL) ? (defaultHeight - parseInt(self.h/20) -1) : descartesJS.getFieldFontSize(defaultHeight) );

      //new
      this.text_object = new descartesJS.TextObject({
        parent : {
          decimal_symbol : this.parent.decimal_symbol
        },
        evaluator : this.evaluator,
        decimals : this.decimals,
        fixed: false,
        align: "left",
        anchor: "center_center",
        width: this.parser.parse("0"),
        font_size: this.parser.parse(""+ this.fieldFontSize),
        font_family: this.font_family,
        italics: this.italics,
        bold: this.bold,
      }, self.name_str);
      //new
      this.text_object.draw(this.label_ctx, this.label_text_color.getColor(), 0, 0, true);

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
        self.upHeight = self.downH = self.w;
        self.upX = 0;
        self.upY = self.fieldHeight;
        self.downX = 0;
        self.downY = TFy-self.downH;

        self.fieldWidth = self.w;
        self.fieldX = 0;

        self.scrollHandlerW = self.w;
        self.scrollHandlerH = parseInt( (self.canvasHeight -self.upHeight -self.downH -self.labelHeight -self.fieldHeight)/10 );
        self.scrollHandlerH = ((self.canvasHeight-self.upHeight-self.downH-self.labelHeight-self.fieldHeight) > self.w*2) ? self.w : self.scrollHandlerH;
        self.scrollHandlerH = (self.scrollHandlerH < 15) ? 15 : self.scrollHandlerH;

        self.limInf = TFy -self.downH -self.scrollHandlerH;
        self.limSup = sby+self.downH;
      }
      // horizontal orientation
      else {
        var minsbw = 58;

        // get the width of all elements in the scrollbar
        var minLabelWidth = this.text_object.textNodes.metrics.w +parseInt(this.fieldFontSize);

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

        self.upWidth = self.downW = self.h;
        self.upHeight = self.downH = self.h;
        self.upX = TFx-self.downW;
        self.upY = 0;
        self.downX = self.labelWidth;
        self.downY = 0;

        self.scrollHandlerW = parseInt( (self.canvasWidth-self.upWidth-self.downW)/10 );
        self.scrollHandlerW = ((self.canvasWidth-self.upWidth-self.downW) > self.h*2) ? self.h : self.scrollHandlerW;
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
      self.cover.setAttribute("style", `width:${self.fieldWidth}px;height:${self.fieldHeight}px;left:${self.fieldX}px;top:0;`);

      if (self.fieldHeight === 0) {
        self.field.style.display = "none";
      }

      // style the label
      self.label.setAttribute("style", `font-size:${self.fieldFontSize}px;width:${self.labelWidth}px;height:${self.labelHeight}px;line-height:${self.labelHeight}px;left:0;top:${self.labelY}px;background-color:${this.label_color.getColor()};color:${this.label_text_color.getColor()};`);

      this.label.width = self.labelWidth * this.ratio;
      this.label.height = self.labelHeight * this.ratio;
    }

    /**
     * Update the scrollbar
     */
    update() {
      evaluator = this.evaluator;

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

      //
      this.label_ctx.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
      
      // draw the text to get the width
      this.text_object.draw(this.label_ctx, this.label_text_color.getColor(), 0, 0);

      this.label_ctx.clearRect(0, 0, this.label.width, this.label.height);

      int_color = this.label_color.getColor();
      if (int_color && ((int_color.constructor.name === "CanvasGradient") || (int_color.constructor.name === "CanvasPattern"))) {
        this.label_ctx.fillStyle = int_color;
        this.label_ctx.fillRect(0,0,this.label_ctx.canvas.width,this.label_ctx.canvas.height);
      }

      if (this.text_object.textNodes.metrics.w > this.label.width/this.ratio) {
        this.text_object.anchor = "center_left";
        this.text_object.draw(this.label_ctx, this.label_text_color.getColor(), 5, this.label.height/this.ratio/2); 
      }
      else {
        this.text_object.anchor = "center_center";
        this.text_object.draw(this.label_ctx, this.label_text_color.getColor(), this.label.width/this.ratio/2, this.label.height/this.ratio/2);
      }
      this.label_ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    /**
     * Draw the scrollbar
     */
    draw() {
      self = this;
      ctx = self.ctx;

      tmpW = MathFloor(this.w);
      tmpH = MathFloor(this.h);

      // background color
      ctx.fillStyle = this.color.getColor();
      ctx.fillRect(0, 0, tmpW, tmpH);

      ctx.fillStyle = "black";
      ctx.beginPath();

      // horizontal
      if (self.orientation === HORIZONTAL) {
        // external border
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.strokeRect(parseInt(self.labelWidth)+.5, .5, tmpW-1 -parseInt(self.labelWidth), tmpH-1);

        // arrow in the buttons
        ctx.lineWidth = Math.ceil((12*self.upWidth)/100) || 1;
        ctx.strokeStyle = self.colorInt.getColor();

        ctx.moveTo(self.downX+ (62.215*self.upWidth)/100, (20*self.downH)/100);
        ctx.lineTo(self.downX+ (32.449*self.upWidth)/100, self.downH/2);
        ctx.lineTo(self.downX+ (62.215*self.upWidth)/100, (80*self.downH)/100);

        ctx.moveTo(self.upX+ (32.449*self.upWidth)/100, (20*self.downH)/100);
        ctx.lineTo(self.upX+ (62.215*self.upWidth)/100, self.downH/2);
        ctx.lineTo(self.upX+ (32.449*self.upWidth)/100, (80*self.downH)/100);

        ctx.stroke();

        // scroll handler
        tmpPos = MathFloor(self.pos);
        desp = Math.ceil(tmpH/10) || 1;
        ctx.fillStyle = this.colorInt.getColor();
        ctx.fillRect(tmpPos+.5, desp, MathFloor(self.scrollHandlerW), tmpH-(desp*2));
      }
      // vertical
      else {
        // external border
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.strokeRect(.5, .5, tmpW-1, tmpH-parseInt(self.labelHeight)-0.5);
        
        // arrow in the buttons
        ctx.lineWidth = Math.ceil((12*self.upWidth)/100) || 1;
        ctx.strokeStyle = self.colorInt.getColor();
        
        ctx.moveTo((20*self.upWidth)/100, self.h - self.labelHeight - (70*self.downH)/100);
        ctx.lineTo((50*self.upWidth)/100, self.h - self.labelHeight - (40.237*self.downH)/100);
        ctx.lineTo((80*self.upWidth)/100, self.h - self.labelHeight - (70*self.downH)/100);

        ctx.moveTo((20*self.upWidth)/100, self.upY+(70*self.downH)/100);
        ctx.lineTo((50*self.upWidth)/100, self.upY+(40.237*self.downH)/100);
        ctx.lineTo((80*self.upWidth)/100, self.upY+(70*self.downH)/100);

        ctx.stroke();

        // scroll handler
        tmpPos = MathFloor(self.pos);
        desp = Math.ceil(tmpW/10) || 1;
        ctx.fillStyle = this.colorInt.getColor();
        ctx.fillRect(desp, tmpPos+.5, tmpW-(desp*2), MathFloor(self.scrollHandlerH));
      }

      // inactive shade
      if (!self.activeIfValue) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
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
        }

        this.updateAndExecAction();
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
      var timer;

      // prevent the context menu display
      self.canvas.oncontextmenu = self.divUp.oncontextmenu = self.divDown.oncontextmenu = self.label.oncontextmenu = self.field.oncontextmenu = self.scrollHandler.oncontextmenu = self.cover.oncontextmenu = function () { return false; };

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
       * @param {Event} evt
       * @private
       */
      function onBlur_textField(evt) {
        if (self.drawIfValue) {
          self.changeValue(self.field.value, true);
        }
      }
      this.field.addEventListener("blur", onBlur_textField);

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

      /**
       * 
       */
      self.cover.addEventListener("click", function(evt) {
        let pos = self.evaluator.eval(self.kbexp);

        if (self.activeIfValue) {
          self.parent.keyboard.show(
            self,
            self.kblayout, 
            pos[0][0] || 0,
            pos[0][1] || 0,
            self.id, 
            self.field, 
            self.onlyText
          );
        }
      });
    }
  }

  descartesJS.Scrollbar = Scrollbar;
  return descartesJS;
})(descartesJS || {});
