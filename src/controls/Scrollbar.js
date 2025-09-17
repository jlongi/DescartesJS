/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;

  const HORIZONTAL = "h";
  const VERTICAL = "v";

  let MathFloor = Math.floor;

  let evaluator;
  let fieldValue;
  let expr;
  let ctx;
  let tmpH;
  let tmpW;
  let desp;
  let tmpPos;
  let resultValue;
  let incr;
  let newValue;
  let limInf;
  let limSup;
  let min;
  let max;
  let name;
  let int_color;

  class Scrollbar extends descartesJS.Control {
    /**
     * Descartes scrollbar control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the scrollbar control
     */
    constructor(parent, values){
      // call the parent constructor
      super(parent, values);

      self = this;
      self.label_color = self.label_color || new descartesJS.Color("e0e4e8", parent.evaluator);
      self.label_text_color = self.label_text_color || new descartesJS.Color("000000", parent.evaluator);

      self.name_str = self.name;

      // if the name init with single quotes, then scape them with the \u0027 character code
      if ((/^\&squot;.*\&squot;$/).test(self.name)) {
        self.name = self.name.replace("&squot;", "\\u0027");
      }

      // modification to change the name of the button with an expression
      if ((/^\[.*\]$/).test(self.name)) {
        self.name = self.parser.parse(self.name.slice(1, -1));
      }
      else {
        self.name = self.parser.parse(`'${self.name}'`);
      }

      self.orientation = (self.w >= self.h) ? HORIZONTAL : VERTICAL;

      // control container
      self.container = descartesJS.newHTML("div", {
        class : "DescartesScrollbarContainer",
        id    : self.id,
      });
      self.canvas = descartesJS.newHTML("canvas");
      self.divUp = descartesJS.newHTML("div", {
        class : "DescartesCatcher up",
      });
      self.divDown = descartesJS.newHTML("div", {
        class : "DescartesCatcher down",
      });
      self.field = descartesJS.newHTML("input", {
        type  : "text",
        id    : self.id + "scrollbar",
        class : "DescartesScrollbarField",
      });

      // the scroll handler
      self.handler = descartesJS.newHTML("div", {
        class : "DescartesCatcher manipulator",
      });

      // the label
      self.label = descartesJS.newHTML("canvas", {
        class : "DescartesScrollbarLabel",
      });
      self.label_ctx = self.label.getContext("2d");
      self.ratio = parent.ratio;

      // add the elements to the container
      self.container.appendChild(self.canvas);
      self.container.appendChild(self.label);
      self.container.appendChild(self.divUp);
      self.container.appendChild(self.divDown);
      self.container.appendChild(self.field);
      self.container.appendChild(self.handler);

      self.cover = descartesJS.newHTML("div", {
        class : "TextfieldCover"
      });
      if ( (self.keyboard) && (self.visible) ) {
        self.container.appendChild(self.cover);
      }

      self.addControlContainer(self.container);

      // register the mouse and touch events
      self.addEvents();

      // init the menu parameters
      self.init();
    }

    /**
     * Init the scrollbar
     */
    init() {
      self = this;
      evaluator = self.evaluator;

      // if has decimals the increment are the interval [min, max] divided by 100, if not then the increment is 1
      if (evaluator.eval(self.decimals) == 0) {
        self.incr = 1;
      }
      else {
        self.incr = (evaluator.eval(self.max) - evaluator.eval(self.min)) / 100;
      }

      // validate the initial value
      self.value = self.validateValue( evaluator.eval(self.valueExpr) );

      // format the output value
      fieldValue = self.formatValue(self.value);

      expr = self.evaluator.eval(self.expresion)[0];
      self.x = expr[0];
      self.y = expr[1];
      if (expr.length == 4) {
        self.w = expr[2];
        self.h = expr[3];
      }
      self.orientation = (self.w >= self.h) ? HORIZONTAL : VERTICAL;

      // init the scroll configuration
      self.initScroll(fieldValue);

      // change the value if really need a change
      self.changeScrollPosition();
      self.prePos = self.pos;

      // register the control value
      evaluator.setVariable(self.id, self.value);
    }

    /**
     * Init the scroll configuration
     */
    initScroll(fieldValue) {
      self = this;
      evaluator = self.evaluator;

      self.label.innerHTML = evaluator.eval(self.name).toString();
      name = self.label.textContent;

      let defaultHeight = (self.orientation === VERTICAL) ? parseInt(19 + (5*(self.h-100))/100) : self.h;

      // find the font size of the text field
      self.fieldFontSize = (evaluator.eval(self.font_size)>0) ? evaluator.eval(self.font_size) : ( (self.orientation === VERTICAL) ? (defaultHeight - parseInt(self.h/20) -1) : descartesJS.getFieldFontSize(defaultHeight) );

      //new
      self.text_object = new descartesJS.TextObject({
        parent : {
          decimal_symbol : self.parent.decimal_symbol
        },
        evaluator : self.evaluator,
        decimals : self.decimals,
        fixed: false,
        align: "left",
        anchor: "center_center",
        width: self.parser.parse("0"),
        font_size: self.parser.parse(""+ self.fieldFontSize),
        font_family: self.font_family,
        italics: self.italics,
        bold: self.bold,
      }, self.name_str);
      //new
      self.text_object.draw(self.label_ctx, self.label_text_color.getColor(), 0, 0, true);

      let fieldValueSize = descartesJS.getTextWidth(fieldValue+"_", self.fieldFontSize+"px " + descartesJS.sansserif_font);

      let spaceH = self.parent.getSpaceById(self.spaceID).h;

      self.labelHeight = (name == "") ? 0 : defaultHeight;
      self.fieldHeight = (self.visible == "") ? 0 : defaultHeight;

      // vertical orientation
      if (self.orientation === VERTICAL) {
        self.canvasWidth = self.w;
        self.canvasHeight = self.h - self.labelHeight - self.fieldHeight;

        if (self.canvasHeight + self.y - spaceH >= 18) {
          self.canvasHeight = spaceH;
        }

        let sbx = 0;
        let sby = self.fieldHeight;
        let TFy = sby + self.canvasHeight;

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

        self.handlerW = self.w;
        self.handlerH = parseInt( (self.canvasHeight -self.upHeight -self.downH -self.labelHeight -self.fieldHeight)/10 );
        self.handlerH = ((self.canvasHeight-self.upHeight-self.downH-self.labelHeight-self.fieldHeight) > self.w*2) ? self.w : self.handlerH;
        self.handlerH = (self.handlerH < 15) ? 15 : self.handlerH;

        self.limInf = TFy -self.downH -self.handlerH;
        self.limSup = sby+self.downH;
      }
      // horizontal orientation
      else {
        let minsbw = 58;

        // get the width of all elements in the scrollbar
        let minLabelWidth = self.text_object.textNodes.metrics.w +parseInt(self.fieldFontSize);

        self.labelWidth = minLabelWidth;
        let minTFWidth = fieldValueSize;
        self.fieldWidth = minTFWidth;

        if (name == "") {
          self.labelWidth = 0;
        }

        if (!self.visible) {
          self.fieldWidth = 0;
        }

        let sbw = self.w - self.fieldWidth - self.labelWidth;
        while ((sbw < minsbw) && (self.labelWidth > 0)) {
          self.labelWidth--;
          sbw++;
        }
        while ((sbw < minsbw) && (self.fieldWidth > 0)) {
          self.fieldWidth--;
          sbw++;
        }

        let sbx = self.labelWidth;
        let sby = 0;
        let TFx = sbx + sbw;
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

        self.handlerW = parseInt( (self.canvasWidth-self.upWidth-self.downW)/10 );
        self.handlerW = ((self.canvasWidth-self.upWidth-self.downW) > self.h*2) ? self.h : self.handlerW;
        self.handlerW = (self.handlerW < 15) ? 15 : self.handlerW;
        self.handlerH = self.h;

        self.limInf = sbx+self.downW;
        self.limSup = sbx+self.canvasWidth-self.downW -self.handlerW;
      }

      self.container.setAttribute("style", `width:${self.w}px;height:${self.h}px;left:${self.x}px;top:${self.y}px;z-index:${self.zIndex};`);

      self.canvas.setAttribute("width", self.w+"px");
      self.canvas.setAttribute("height", self.h+"px");
      self.canvas.setAttribute("style", "position:absolute;left:0;top:0;");
      self.ctx = self.canvas.getContext("2d");
      self.ctx.imageSmoothingEnabled = false;

      self.divUp.setAttribute("style", `width:${self.upWidth}px;height:${self.upHeight}px;left:${self.upX}px;top:${self.upY}px;`);

      self.divDown.setAttribute("style", `width:${self.downW}px;height:${self.downH}px;left:${self.downX}px;top:${self.downY}px;`);

      self.handler.setAttribute("style", `width:${self.handlerW}px;height:${self.handlerH}px;left:${(self.orientation === VERTICAL) ? 0 : self.limInf}px;top:${(self.orientation === VERTICAL) ? self.limInf : 0}px;`);

      // style the text field
      self.field.setAttribute("style", `font-size:${self.fieldFontSize}px;width:${self.fieldWidth}px;height:${self.fieldHeight}px;left:${self.fieldX}px;top:0;`);
      self.cover.setAttribute("style", `width:${self.fieldWidth}px;height:${self.fieldHeight}px;left:${self.fieldX}px;top:0;`);

      if (self.fieldHeight === 0) {
        self.field.style.display = "none";
      }

      // style the label
      self.label.setAttribute("style", `font-size:${self.fieldFontSize}px;width:${self.labelWidth}px;height:${self.labelHeight}px;line-height:${self.labelHeight}px;left:0;top:${self.labelY}px;background-color:${self.label_color.getColor()};color:${self.label_text_color.getColor()};`);

      self.label.width  = self.labelWidth * self.ratio;
      self.label.height = self.labelHeight * self.ratio;
    }

    /**
     * Update the scrollbar
     */
    update() {
      self = this;
      evaluator = self.evaluator;

      // the increment is the interval [min, max] divided by 100 if has decimals, if not then the increment is 1
      if (evaluator.eval(self.decimals) == 0) {
        self.incr = 1;
      }
      else {
        self.incr = (evaluator.eval(self.max) - evaluator.eval(self.min)) / 100;
      }

      // check if the control is active and visible
      self.activeIfValue = (evaluator.eval(self.activeif) > 0);
      self.drawIfValue   = (evaluator.eval(self.drawif) > 0);

      // enable or disable the control
      self.field.disabled = !self.activeIfValue;

      // hide or show the menu control
      if (self.drawIfValue) {
        self.container.style.display = "block";
        self.draw();
      } else {
        self.container.style.display = "none";
      }

      // update the position and size
      self.updatePositionAndSize();

      // update the value of the menu
      let tmpValue = self.validateValue( evaluator.getVariable(self.id) );
      if ( (tmpValue != self.value) && !((Math.abs(tmpValue - self.value)>0) && (Math.abs(tmpValue - self.value)<0.000000001))) {
        self.value = tmpValue;
        self.changeScrollPosition();
        self.prePos = self.pos;
      }

      self.value = tmpValue;
      self.field.value = self.formatValue(self.value);

      // register the control value
      evaluator.setVariable(self.id, self.value);

      //
      self.label_ctx.setTransform(self.ratio, 0, 0, self.ratio, 0, 0);
      
      // draw the text to get the width
      self.text_object.draw(self.label_ctx, self.label_text_color.getColor(), 0, 0);

      self.label_ctx.clearRect(0, 0, self.label.width, self.label.height);

      int_color = self.label_color.getColor();
      if (int_color && (/CanvasGradient|CanvasPattern/).test(int_color.constructor.name)) {
        self.label_ctx.fillStyle = int_color;
        self.label_ctx.fillRect(0, 0, self.label_ctx.canvas.width, self.label_ctx.canvas.height);
      }

      if (self.text_object.textNodes.metrics.w > self.label.width/self.ratio) {
        self.text_object.anchor = "center_left";
        self.text_object.draw(self.label_ctx, self.label_text_color.getColor(), 5, self.label.height/self.ratio/2); 
      }
      else {
        self.text_object.anchor = "center_center";
        self.text_object.draw(self.label_ctx, self.label_text_color.getColor(), self.label.width/self.ratio/2, self.label.height/self.ratio/2);
      }
      self.label_ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    /**
     * Draw the scrollbar
     */
    draw() {
      self = this;
      ctx = self.ctx;

      tmpW = MathFloor(self.w);
      tmpH = MathFloor(self.h);

      // background color
      ctx.fillStyle = self.color.getColor();
      ctx.fillRect(0, 0, tmpW, tmpH);

      ctx.fillStyle = "black";
      ctx.beginPath();

      // horizontal
      if (self.orientation === HORIZONTAL) {
        // external border
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.strokeRect(parseInt(self.labelWidth)+0.5, 0.5, tmpW-1 -parseInt(self.labelWidth), tmpH-1);

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
        ctx.fillStyle = self.colorInt.getColor();
        ctx.fillRect(tmpPos+.5, desp, MathFloor(self.handlerW), tmpH-(desp*2));
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
        ctx.fillStyle = self.colorInt.getColor();
        ctx.fillRect(desp, tmpPos+.5, tmpW-(desp*2), MathFloor(self.handlerH));
      }

      // inactive shade
      if (!self.activeIfValue) {
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
      self = this;
      evaluator = self.evaluator;
      resultValue = value.toString();
      resultValue = parseFloat( resultValue.replace(self.parent.decimal_symbol, ".") );

      // if the value is a string that do not represent a number, parseFloat return NaN
      if (isNaN(resultValue)) {
        resultValue = 0;
      }

      // if is less than the lower limit
      self.minimo = evaluator.eval(self.min);
      if (resultValue < self.minimo) {
        self.value = null;
        resultValue = self.minimo;
      }

      // if si greater than the upper limit
      self.maximo = evaluator.eval(self.max);
      if (resultValue > self.maximo) {
        self.value = null;
        resultValue = self.maximo;
      }

      incr = self.incr;
      resultValue = (incr != 0) ? (resultValue*incr)/incr : 0;

      if (self.fixed) {
        resultValue = parseFloat(parseFloat(resultValue).toFixed(evaluator.eval(self.decimals)));
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
      self = this;
      desp = (self.evaluator.eval(self.max) - self.evaluator.eval(self.min))/10;

      if (self.orientation == HORIZONTAL) {
        if (self.clickPos.x > self.prePos) {
          self.changeValue( parseFloat(self.value) + desp );
        }
      }
      else {
        if (self.clickPos.y < self.prePos) {
          self.changeValue( parseFloat(self.value) + desp );
        }
      }
    }

    /**
     * Decrease by then the value of the scrollbar
     */
    decrease10() {
      self = this;
      desp = (self.evaluator.eval(self.max) - self.evaluator.eval(self.min))/10;

      if (self.orientation == HORIZONTAL) {
        if (self.clickPos.x < self.prePos) {
          self.changeValue( parseFloat(self.value) - desp );
        }
      } else {
        if (self.clickPos.y > self.prePos) {
          self.changeValue( parseFloat(self.value) - desp );
        }
      }
    }

    /**
     * Change the scrollbar value
     */
    changeValue(value) {
      self = this;

      if (self.activeIfValue) {
        newValue = self.validateValue(value);

        // change the value if really need a change
        if (newValue != self.value) {
          self.value = newValue;
          self.field.value = self.formatValue(newValue);

          self.changeScrollPosition();

          self.prePos = self.pos;

          // register the control value
          self.evaluator.setVariable(self.id, self.value);
        }

        self.updateAndExecAction();
      }
    }

    /**
     * Change the value when the scroll handler move
     */
    changeValueMovement() {
      evaluator = this.evaluator;
      limInf = this.limInf;
      limSup = this.limSup;
      min = evaluator.eval(this.min);
      max = evaluator.eval(this.max);
      incr = this.incr;

      newValue = MathFloor( (((this.pos-limInf)*(max-min))/(limSup-limInf))/incr )*incr +min;

      // if the value change, the update everything
      if (newValue != this.value) {
        this.value = newValue;
        this.field.value = this.formatValue(newValue);

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
    changeScrollPosition() {
      self = this;
      evaluator = self.evaluator;
      limInf = self.limInf;
      limSup = self.limSup;
      min = evaluator.eval(self.min);
      max = evaluator.eval(self.max);
      incr = self.incr;

      self.pos = (((self.value-min)*(limSup-limInf))/(max-min)) + limInf;

      self.handler.style[(self.orientation == HORIZONTAL) ? "left" : "top"] = self.pos + "px";
    }

    /**
     * Register the mouse and touch events
     */
    addEvents() {
      let self = this;
      let timer;
      const delay = 350;

      /**
       * Repeat a function during a period of time, when the user click and hold the click in the button
       * @param {Number} delayTime the delay of time between the function repetition
       * @param {Function} fun the function to execute
       * @param {Boolean} firstTime a flag to indicated if is the first time clicked
       * @private
       */
      function repeat(delayTime, fun, firstTime, limit) {
        descartesJS.clearTimeout(timer);

        if ((self.up || self.down || self.canvasClick) && (Math.abs(self.value - limit) > 0.0000001)) {
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
      self.field.addEventListener("keydown", onKeyDown_TextField);

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
      self.field.addEventListener("blur", onBlur_textField);

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

      self.canvas.addEventListener("touchstart", onMouseDown_canvas);
      self.canvas.addEventListener("mousedown", onMouseDown_canvas);

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
      self.divDown.addEventListener("mouseout", onMouseOut_DownButton);

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
      self.canvas.addEventListener("touchmove", onMouseMove_Canvas);
      self.canvas.addEventListener("mousemove", onMouseMove_Canvas);

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

      self.handler.addEventListener("touchstart", onTouchStart_scrollHandler);
      self.handler.addEventListener("mousedown", onMouseDown_scrollHandler);

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
        let newPos = descartesJS.getCursorPosition(evt, self.container);

        if (self.orientation == HORIZONTAL) {
          self.pos = self.prePos - (self.initPos.x - newPos.x);

          if (self.pos < self.limInf) {
            self.pos =  self.limInf;
          }

          if (self.pos > self.limSup) {
            self.pos =  self.limSup;
          }

          self.handler.setAttribute("style", `width:${self.handlerW}px;height:${self.h}px;left:${self.pos}px;top:0;`);
        }
        else {
          self.pos = self.prePos - (self.initPos.y - newPos.y);

          if (self.pos > self.limInf) {
            self.pos =  self.limInf;
          }

          if (self.pos < self.limSup) {
            self.pos =  self.limSup;
          }

          self.handler.setAttribute("style", `width:${self.w}px;height:${self.handlerH}px;left:0;top:${self.pos}px;`);
        }

        self.changeValueMovement();

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
      self.divUp.addEventListener("touchstart", onMouseDown_UpButton);
      self.divUp.addEventListener("mousedown", onMouseDown_UpButton);

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
      self.divDown.addEventListener("touchstart", onMouseDown_DownButton);
      self.divDown.addEventListener("mousedown", onMouseDown_DownButton);

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
      self.divUp.addEventListener("mouseout", onMouseOut_UpButton);

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
      self.divDown.addEventListener("mouseout", onMouseOut_DownButton);

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
