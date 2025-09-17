/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let evaluator;
  let tmpIncr;
  let oldFieldValue;
  let oldValue;
  let resultValue;
  let incr;
  let decimals;
  let evalMin;
  let evalMax;
  let hasTouchSupport;
  let parseTrue;
  let tmp_image_dec_src;
  let tmp_image_inc_src;
  let int_color;

  class Spinner extends descartesJS.Control {
    /**
     * Descartes spinner control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the spinner control
     */
    constructor(parent, values){
      // call the parent constructor
      super(parent, values);

      self = this;

      self.flat = self.image_dec_src && self.image_inc_src;
      self.btn_pos = self.btn_pos || "v_left";
      self.horizontal = (self.btn_pos === "h_left") || (self.btn_pos === "h_right") || (self.btn_pos === "h_left_right");
      self.label_color = self.label_color || new descartesJS.Color("e0e4e8", parent.evaluator);
      self.label_text_color = self.label_text_color || new descartesJS.Color("000000", parent.evaluator);

      // tabular index
      self.tabindex = ++parent.tabindex;

      self.name_str = self.name;

      self.initial_value = 0;
      try {
        self.initial_value = self.evaluator.eval(self.parser.parse(self.valueExprString))
      } catch(e) {console.log(e);};

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

      // control container
      self.container = descartesJS.newHTML("div", {
        class : "DescartesSpinnerContainer",
        id    : self.id,
      });
      self.divUp = descartesJS.newHTML("div", {
        class : "DJS_Up",
      });
      self.divDown = descartesJS.newHTML("div", {
        class : "DJS_Down",
      });
      self.field = descartesJS.newHTML("input", {
        type     : "text",
        id       : self.id+"_spinner",
        class    : "DescartesSpinnerField",
        tabindex : self.tabindex,
      });

      // the label
      self.label = descartesJS.newHTML("canvas", {
        class : "DescartesSpinnerLabel",
      });
      self.label_ctx = self.label.getContext("2d");
      self.ratio = parent.ratio;

      self.container.appendChild(self.label);
      self.container.appendChild(self.field);
      self.container.appendChild(self.divUp);
      self.container.appendChild(self.divDown);

      self.cover = descartesJS.newHTML("div", {
        class : "TextfieldCover"
      });
      if ( (self.keyboard) && (self.visible) ) {
        self.container.appendChild(self.cover);
      }

      self.addControlContainer(self.container);

      parseTrue = self.evaluator.parser.parse("1");

      // if the decimals are negative or zero
      self.originalIncr = self.incr;
      if ( (self.evaluator.eval(self.decimals) < 0) || (self.evaluator.eval(self.incr) === 0) ) {
        let tmpIncr = self.evaluator.eval(self.incr);

        if (tmpIncr > 0) {
          self.originalIncr = self.incr = self.evaluator.parser.parse(parseInt(tmpIncr).toString());
        }
        else {
          self.incr = parseTrue;
        }
      }

      // check for images for the buttons
      if (self.image_dec_src) {
        if ((/^\[.*\]$/).test(self.image_dec_src)) {
          self.image_dec_src = self.parser.parse(self.image_dec_src.slice(1, -1));
        }
        else {
          self.image_dec_src = self.parser.parse(`'${self.image_dec_src}'`);
        }
        self.old_image_dec_src = self.evaluator.eval(self.image_dec_src).toString().trim();
        self.image_dec = self.parent.getImage( self.old_image_dec_src );
      }
      if (self.image_inc_src) {
        if ((/^\[.*\]$/).test(self.image_inc_src)) {
          self.image_inc_src = self.parser.parse(self.image_inc_src.slice(1, -1));
        }
        else {
          self.image_inc_src = self.parser.parse(`'${self.image_inc_src}'`);
        }
        self.old_image_inc_src = self.evaluator.eval(self.image_inc_src).toString().trim();
        self.image_inc = self.parent.getImage( self.old_image_inc_src );
      }

      // register the mouse and touch events
      self.addEvents();

      // init the menu parameters
      self.init();
    }

    /**
     * Init the spinner
     */
    init(force, maintain_val) {
      self = this;
      evaluator = self.evaluator;

      self.label.innerHTML = evaluator.eval(self.name).toString();
      let name = self.label.textContent;

      // validate the initial value
      if (!maintain_val) {
        self.value = self.validateValue(evaluator.eval(self.valueExpr));
      }

      // get the width of the initial value to determine the width of the text field
      let fieldValue = self.formatValue(self.value);

      // find the font size of the text field
      self.fieldFontSize = (evaluator.eval(self.font_size)>0) ? evaluator.eval(self.font_size) : descartesJS.getFieldFontSize(self.h);

      //new
      self.text_object = new descartesJS.TextObject({
        parent : {
          decimal_symbol : self.parent.decimal_symbol
        },
        evaluator : evaluator,
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

      // extra space added to the name
      let extraSpace = (self.parent.version !== 2) ? "__" : "_____";

      let fieldValueSize = descartesJS.getTextWidth(fieldValue+"_", `${self.fieldFontSize}px ${descartesJS.sansserif_font}`);

      if (self.horizontal) {
        // for each element calculated width
        let canvasWidth = parseInt(self.h);
        let labelWidth = parseInt(self.w/2 - canvasWidth);
        let minTFWidth = fieldValueSize;
        let minLabelWidth = self.text_object.textNodes.metrics.w + parseInt(self.fieldFontSize);

        if (!self.visible) {
          labelWidth = self.w - 2*canvasWidth;
          minTFWidth = 0;
        }

        if (labelWidth < minLabelWidth) {
          labelWidth = minLabelWidth;
        }

        if (name == "") {
          labelWidth = 0;
        }

        if (self.w-labelWidth-canvasWidth < minTFWidth) {
          labelWidth = self.w - canvasWidth - minTFWidth;
        }

        if (labelWidth < 0) {
          labelWidth=0;
        }

        let fieldWidth = self.w - (labelWidth + 2*canvasWidth);

        self.container.setAttribute("style", `width:${self.w}px;height:${self.h}px;left:${self.x}px;top:${self.y}px;z-index:${self.zIndex};background-color:transparent;`);

        self.divUp.setAttribute("style", `width:${canvasWidth}px;height:${canvasWidth}px;${(self.btn_pos === "h_left")?"left:"+(labelWidth+canvasWidth):"right:0"}px;top:0;${(self.flat)?'border-width:0;':''}`);
        self.divDown.setAttribute("style", `width:${canvasWidth}px;height:${canvasWidth}px;left:${labelWidth + ((self.btn_pos === "h_right")?fieldWidth:0)}px;top:0;${(self.flat)?'border-width:0;':''}`);

        self.field.setAttribute("style", `font-family:${descartesJS.sansserif_font};font-size:${self.fieldFontSize}px;width:${fieldWidth}px;height:${self.h}px;left:${canvasWidth + labelWidth + ((self.btn_pos === "h_left")?canvasWidth:((self.btn_pos === "h_right")?-canvasWidth:0))}px;text-align:center;`);
        self.cover.setAttribute("style", `width:${fieldWidth}px;height:${self.h}px;left:${canvasWidth + labelWidth + ((self.btn_pos === "h_left")?canvasWidth:((self.btn_pos === "h_right")?-canvasWidth:0))}px;text-align:center;`);

        self.field.value = fieldValue;
        if (!self.visible) {
          self.field.style.display = "none";
        }

        self.label.setAttribute("style", `font-size:${self.fieldFontSize}px;width:${labelWidth}px;height:${self.h}px;line-height:${self.h}px;background-color:${self.label_color.getColor()};color:${self.label_text_color.getColor()};`);

        self.label.width  = labelWidth * self.ratio;
        self.label.height = self.h * self.ratio;
      }
      else {
        // for each element calculated width
        let canvasWidth = 2 + parseInt(self.h/2);
        let labelWidth = parseInt(self.w/2 - canvasWidth/2);
        let minTFWidth = fieldValueSize;
        let minLabelWidth = descartesJS.getTextWidth(name+extraSpace, self.fieldFontSize+"px " + descartesJS.sansserif_font);

        if (!self.visible) {
          labelWidth = self.w - canvasWidth;
          minTFWidth = 0;
        }

        if (labelWidth < minLabelWidth) {
          labelWidth = minLabelWidth;
        }

        if (name == "") {
          labelWidth = 0;
        }

        if (self.w-labelWidth-canvasWidth < minTFWidth) {
          labelWidth = self.w - canvasWidth - minTFWidth;
        }

        if (labelWidth < 0) {
          labelWidth=0;
        }

        let fieldWidth = self.w - (labelWidth + canvasWidth);

        self.container.setAttribute("style", `width:${self.w}px;height:${self.h}px;left:${self.x}px;top:${self.y}px;z-index:${self.zIndex};background-color:transparent;`);

        let divStyle = `width:${canvasWidth}px;left:${labelWidth+((self.btn_pos === "v_right")?fieldWidth:0)}px;`;

        self.divUp.setAttribute("style", `${divStyle};height:${self.h/2+1}px;top:0;${(self.flat)?'border-width:0;':''}`);
        self.divDown.setAttribute("style", `${divStyle};height:${self.h/2-1}px;top:${self.h/2+1}px;${(self.flat)?'border-width:0;':''}`);

        self.field.setAttribute("style", `font-family:${descartesJS.sansserif_font};font-size:${self.fieldFontSize}px;width:${fieldWidth}px;height:${self.h}px;left:${((self.btn_pos === "v_left")?canvasWidth:0) + labelWidth}px;`);
        self.cover.setAttribute("style", `width:${fieldWidth}px;height:${self.h}px;left:${((self.btn_pos === "v_left")?canvasWidth:0) + labelWidth}px;`);

        self.field.value = fieldValue;
        if (!self.visible) {
          self.field.style.display = "none";
        }

        self.label.setAttribute("style", `font-size:${self.fieldFontSize}px;width:${labelWidth}px;height:${self.h}px;line-height:${self.h}px;background-color:${self.label_color.getColor()};color:${self.label_text_color.getColor()};`);
        
        self.label.width  = labelWidth*self.ratio;
        self.label.height = self.h*self.ratio;
      }

      if (self.image_dec && self.image_dec.ready) {
        self.divDown.style["background-image"] = `url(${self.image_dec.src})`;

      }
      if (self.image_inc && self.image_inc.ready) {
        self.divUp.style["background-image"] = `url(${self.image_inc.src})`;
      }

      self.divUp.setAttribute("horizontal",   self.horizontal);
      self.divDown.setAttribute("horizontal", self.horizontal);

      // register the control value
      evaluator.setVariable(self.id, self.value);
    }

    /**
     * Update the spinner
     */
    update() {
      self = this;
      evaluator = self.evaluator;

      // this.label.innerHTML = evaluator.eval(this.name).toString();

      if (evaluator.eval(self.decimals) < 0) {
        tmpIncr = evaluator.eval(self.incr);

        if (tmpIncr > 0) {
          self.originalIncr = self.incr = evaluator.parser.parse(parseInt(tmpIncr).toString());
        }
        else {
          self.incr = parseTrue;
        }
      }
      else {
        self.incr = (evaluator.eval(self.originalIncr) !== 0) ? self.originalIncr : parseTrue;
      }

      // check if the control is active and visible
      self.activeIfValue = (evaluator.eval(self.activeif) > 0);
      self.drawIfValue   = (evaluator.eval(self.drawif) > 0);

      // enable or disable the control
      self.field.disabled = !self.activeIfValue;
      self.divUp.setAttribute("active",   !self.field.disabled);
      self.divDown.setAttribute("active", !self.field.disabled);

      // hide or show the spinner control
      if (self.drawIfValue) {
        self.updateStyle();
        self.container.style.display = "block"
      }
      else {
        self.click = false;
        self.container.style.display = "none";
      }

      // change in the images of the buttons
      if (self.image_dec) {
        tmp_image_dec_src = self.evaluator.eval(self.image_dec_src).toString().trim();
        if (self.old_image_dec_src !== tmp_image_dec_src) {
          self.divDown.style["background-image"] = `url(${tmp_image_dec_src})`;
          self.old_image_dec_src = tmp_image_dec_src;
        }
      }
      if (self.image_inc) {
        tmp_image_inc_src = self.evaluator.eval(self.image_inc_src).toString().trim();
        if (self.old_image_inc_src !== tmp_image_inc_src) {
          self.divUp.style["background-image"] = `url(${tmp_image_inc_src})`;
          self.image_inc_src = tmp_image_inc_src;
        }
      }

      // update the position and size
      self.updatePositionAndSize();

      if ( !(self.parent.animation.playing) || (document.activeElement != self.field) ) {
        oldFieldValue = self.field.value;
        oldValue = self.value;

        // update the spinner value
        self.value = self.validateValue( evaluator.getVariable(self.id) );
        self.field.value = self.formatValue(self.value);

        if ((self.value == oldValue) && (self.field.value != oldFieldValue)) {
          // update the spinner value
          self.value = self.validateValue(oldFieldValue);
          self.field.value = self.formatValue(self.value);
        }

        // register the control value
        evaluator.setVariable(self.id, self.value);
      }

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
     * 
     */
    updateStyle() {
      self = this;
      self.divUp.style.borderStyle = (self.up) ? "inset" : "outset";
      self.divUp.style.borderColor = (self.up) ? "gray" : "#f0f8ff";
      self.divUp.style.backgroundColor = (self.up) ? "#bfbfbf" : "";
      self.divUp.style.backgroundColor = (self.flat) ? "transparent" : self.divUp.style.backgroundColor;
      self.divUp.style.backgroundPosition = (self.up) ? "calc(50% + 1px) calc(50% + 1px)" : "center";

      self.divDown.style.borderStyle = (self.down) ? "inset" : "outset";
      self.divDown.style.borderColor = (self.down) ? "gray" : "#f0f8ff";
      self.divDown.style.backgroundColor = (self.down) ? "#bfbfbf" : "";
      self.divDown.style.backgroundColor = (self.flat) ? "transparent" : self.divDown.style.backgroundColor;
      self.divDown.style.backgroundPosition = (self.down) ? "calc(50% + 1px) calc(50% + 1px)" : "center";
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

      if (!isNaN(parseFloat(value))) {
        // remove the exponential notation of the number and convert it to a fixed notation
        if (value.toString().includes("e")) {
          value = parseFloat(value).toFixed(20);
        }
      }
      value = (value != undefined) ? value.toString() : "0";

      let tmp = value.replace(this.parent.decimal_symbol, ".");
      if (tmp == parseFloat(tmp)) {
        resultValue = parseFloat(tmp);
      }
      else {
        resultValue = parseFloat( evaluator.eval( evaluator.parser.parse(tmp) ) );
      }

      // if the value is a string that do not represent a number, parseFloat return NaN
      if (isNaN(resultValue)) {
        resultValue = 0;
      }

      evalMin = evaluator.eval(this.min);
      evalMax = evaluator.eval(this.max);

      if (evalMin === "") {
        evalMin = -Infinity;
      }
      if (evalMax === "") {
        evalMax = Infinity;
      }

      // if is less than the lower limit or greater than the upper limit
      resultValue = Math.min( Math.max(resultValue, evalMin), evalMax );

      if (this.discrete) {
        incr = evaluator.eval(this.incr);
        resultValue = (incr == 0) ? 0 : this.initial_value + (incr * Math.round((resultValue-this.initial_value) / incr));
      }
      
      decimals = evaluator.eval(this.decimals);
      if (decimals <= 0) {
        decimals = 0;
      }

      resultValue = parseFloat(parseFloat(resultValue).toFixed(decimals));

      return resultValue;
    }

    /**
     * Increase the value of the spinner
     */
    increase() {
      this.changeValue( parseFloat(this.value) + this.evaluator.eval(this.incr) );
    }

    /**
     * Decrease the value of the spinner
     */
    decrease() {
      this.changeValue( parseFloat(this.value) - this.evaluator.eval(this.incr) );
    }

    /**
     * Change the spinner value
     */
    changeValue(value) {
      if (this.activeIfValue) {
        this.value = this.validateValue(value);
        this.field.value = this.formatValue(this.value);

        // register the control value
        this.evaluator.setVariable(this.id, this.value);

        this.updateAndExecAction();
      }
    }

    /**
     * Register the mouse and touch events
     */
    addEvents() {
      hasTouchSupport = descartesJS.hasTouchSupport;

      let self = this;
      let delay = (hasTouchSupport) ? 500 : 200;
      let timer;

      // prevent the default events int the label
      self.label.addEventListener("touchstart", descartesJS.preventDefault);
      self.label.addEventListener("mousedown", descartesJS.preventDefault);

      /**
       * Repeat a function during a period of time, when the user click and hold the click in the button
       * @param {Number} delayTime the delay of time between the function repetition
       * @param {Function} fun the function to execute
       * @param {Boolean} firstTime a flag to indicated if is the first time clicked
       * @private
       */
      function repeat(delayTime, fun, firstTime) {
        descartesJS.clearTimeout(timer);

        if (self.up || self.down) {
          fun.call(self);
          delayTime = (firstTime) ? delayTime : 10;
          timer = descartesJS.setTimeout(function() { repeat(delayTime, fun); }, delayTime);
        }
      }

      /**
       *
       * @param {Event} evt
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
      function onMouseDown_UpButton(evt) {
        evt.preventDefault();

        self.whichBtn = descartesJS.whichBtn(evt);

        if (self.whichBtn == "L") {
          if (self.activeIfValue) {
            self.up = true;
            repeat(delay, self.increase, true);
          }
        }
      }
      self.divUp.addEventListener("touchstart", onMouseDown_UpButton);
      self.divUp.addEventListener("mousedown", onMouseDown_UpButton);

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseDown_DownButton(evt) {
        evt.preventDefault();

        self.whichBtn = descartesJS.whichBtn(evt);

        if (self.whichBtn == "L") {
          if (self.activeIfValue) {
            self.down = true;
            repeat(delay, self.decrease, true);
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
        self.updateStyle();
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
        self.updateStyle();
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
        self.updateStyle();
        // evt.preventDefault();
      }

      self.divUp.addEventListener("touchend", onMouseUp_UpButton);
      window.addEventListener("touchend", onMouseUp_UpButton);
      self.divUp.addEventListener("mouseup", onMouseUp_UpButton);
      window.addEventListener("mouseup", onMouseUp_UpButton);

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseUp_DownButton(evt) {
        self.down = false;
        descartesJS.clearTimeout(timer);
        self.updateStyle();
        // evt.preventDefault();
      }

      self.divDown.addEventListener("touchend", onMouseUp_DownButton);
      window.addEventListener("touchend", onMouseUp_DownButton);
      self.divDown.addEventListener("mouseup", onMouseUp_DownButton);
      window.addEventListener("mouseup", onMouseUp_DownButton);

      /**
       *
       */
      document.addEventListener("visibilitychange", function(evt) {
        self.up = self.down = false;
        descartesJS.clearTimeout(timer);
        self.updateStyle();
      });

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
       * Prevent an error with the focus of a text field
       */
      self.field.addEventListener("click", function(evt) {
        this.focus();
      });

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

  descartesJS.Spinner = Spinner;
  return descartesJS;
})(descartesJS || {});
