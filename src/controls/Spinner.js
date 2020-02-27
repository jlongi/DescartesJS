/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var tmpIncr;
  var oldFieldValue;
  var oldValue;
  var resultValue;
  var incr;
  var decimals;
  var evalMin;
  var evalMax;
  var hasTouchSupport;
  var parseTrue;
  var tmp_image_dec_src;
  var tmp_image_inc_src;

  class Spinner extends descartesJS.Control {
    /**
     * Descartes spinner control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the spinner control
     */
    constructor(parent, values){
      // call the parent constructor
      super(parent, values);

      this.flat = this.image_dec_src && this.image_inc_src;
      this.btn_pos = this.btn_pos || "v_left";
      this.horizontal = (this.btn_pos === "h_left") || (this.btn_pos === "h_right") || (this.btn_pos === "h_left_right");
      this.label_color = this.label_color || new descartesJS.Color("e0e4e8", parent.evaluator);
      this.label_text_color = this.label_text_color || new descartesJS.Color("000000", parent.evaluator);

      // tabular index
      this.tabindex = ++this.parent.tabindex;

      if (this.name == "_._") {
        this.name = "";
      }

      // modification to change the name of the button with an expression
      if (this.name.match(/^\[.*\]?/)) {
        this.name = this.parser.parse(this.name.substring(1, this.name.length-1));
      }
      else {
        this.name = this.parser.parse("'" + this.name + "'");
      }

      // control container
      this.container = descartesJS.newHTML("div", {
        class : "DescartesSpinnerContainer",
        id    : this.id,
      });
      this.divUp = descartesJS.newHTML("div", {
        class : "DJS_Up",
      });
      this.divDown = descartesJS.newHTML("div", {
        class : "DJS_Down",
      });
      this.field = descartesJS.newHTML("input", {
        type     : "text",
        id       : this.id+"_spinner",
        class    : "DescartesSpinnerField",
        tabindex : this.tabindex,
      });

      // the label
      this.label = descartesJS.newHTML("label", {
        class : "DescartesSpinnerLabel",
      });

      this.container.appendChild(this.label);
      this.container.appendChild(this.field);
      this.container.appendChild(this.divUp);
      this.container.appendChild(this.divDown);

      this.addControlContainer(this.container);

      parseTrue = this.evaluator.parser.parse("1");

      // if the decimals are negative or zero
      this.originalIncr = this.incr;
      if ( (this.evaluator.eval(this.decimals) < 0) || (this.evaluator.eval(this.incr) === 0) ) {
        var tmpIncr = this.evaluator.eval(this.incr);

        if (tmpIncr > 0) {
          this.incr = this.evaluator.parser.parse(parseInt(tmpIncr).toString());
          this.originalIncr = this.incr;
        }
        else {
          this.incr = parseTrue;
        }
      }

      // check for images for the buttons
      if (this.image_dec_src) {
        if (this.image_dec_src.match(/^\[.*\]?/)) {
          this.image_dec_src = this.parser.parse(this.image_dec_src.substring(1, this.image_dec_src.length-1));
        }
        else {
          this.image_dec_src = this.parser.parse("'" + this.image_dec_src + "'");
        }
        this.old_image_dec_src = this.evaluator.eval(this.image_dec_src).toString().trim();
        this.image_dec = this.parent.getImage( this.old_image_dec_src );
      }
      if (this.image_inc_src) {
        if (this.image_inc_src.match(/^\[.*\]?/)) {
          this.image_inc_src = this.parser.parse(this.image_inc_src.substring(1, this.image_inc_src.length-1));
        }
        else {
          this.image_inc_src = this.parser.parse("'" + this.image_inc_src + "'");
        }
        this.old_image_inc_src = this.evaluator.eval(this.image_inc_src).toString().trim();
        this.image_inc = this.parent.getImage( this.old_image_inc_src );
      }

      // register the mouse and touch events
      this.addEvents();

      // init the menu parameters
      this.init();
    }

    /**
     * Init the spinner
     */
    init() {
      evaluator = this.evaluator;

      var name = evaluator.eval(this.name).toString();
      this.label.innerHTML = name;
      name = this.label.textContent;
      
      // validate the initial value
      this.value = this.validateValue(evaluator.eval(this.valueExpr));

      // get the width of the initial value to determine the width of the text field
      var fieldValue = this.formatOutputValue(this.value);

      // find the font size of the text field
      this.fieldFontSize = (this.parent.version !== 2) ? descartesJS.getFieldFontSize(this.h) : 10;

      // extra space added to the name
      var extraSpace = (this.parent.version !== 2) ? "__" : "_____";

      var fieldValueSize = descartesJS.getTextWidth(fieldValue+"_", this.fieldFontSize+"px " + descartesJS.sansserif_font);

      if (this.horizontal) {
        // for each element calculated width
        var canvasWidth = parseInt(this.h);
        var labelWidth = parseInt(this.w/2 - canvasWidth);
        var minTFWidth = fieldValueSize;
        var minLabelWidth = descartesJS.getTextWidth(name+extraSpace, this.fieldFontSize+"px " + descartesJS.sansserif_font);

        if (!this.visible) {
          labelWidth = this.w - 2*canvasWidth;
          minTFWidth = 0;
        }

        if (labelWidth < minLabelWidth) {
          labelWidth = minLabelWidth;
        }

        if (name == "") {
          labelWidth = 0;
        }

        if (this.w-labelWidth-canvasWidth < minTFWidth) {
          labelWidth = this.w - canvasWidth - minTFWidth;
        }

        if (labelWidth < 0) {
          labelWidth=0;
        }

        var fieldWidth = this.w - (labelWidth + 2*canvasWidth);

        this.container.setAttribute("style", `width:${this.w}px;height:${this.h}px;left:${this.x}px;top:${this.y}px;z-index:${this.zIndex};background-color:transparent;`);

        this.divUp.setAttribute("style", `width:${canvasWidth}px;height:${canvasWidth}px;${(this.btn_pos === "h_left")?"left:"+(labelWidth+canvasWidth):"right:0"}px;top:0;${(this.flat)?'border-width:0;':''}`);
        this.divDown.setAttribute("style", `width:${canvasWidth}px;height:${canvasWidth}px;left:${labelWidth + ((this.btn_pos === "h_right")?fieldWidth:0)}px;top:0;${(this.flat)?'border-width:0;':''}`);

        this.field.setAttribute("style", `font-family:${descartesJS.sansserif_font};font-size:${this.fieldFontSize}px;width:${fieldWidth}px;height:${this.h}px;left:${canvasWidth + labelWidth + ((this.btn_pos === "h_left")?canvasWidth:((this.btn_pos === "h_right")?-canvasWidth:0))}px;text-align:center;`);
        this.field.value = fieldValue;
        if (!this.visible) {
          this.field.style.display = "none";
        }

        this.label.setAttribute("style", `font-size:${this.fieldFontSize}px;width:${labelWidth}px;height:${this.h}px;line-height:${this.h}px;background-color:${this.label_color.getColor()};color:${this.label_text_color.getColor()};`);
      }
      else {
        // for each element calculated width
        var canvasWidth = 2 + parseInt(this.h/2);
        var labelWidth = parseInt(this.w/2 - canvasWidth/2);
        var minTFWidth = fieldValueSize;
        var minLabelWidth = descartesJS.getTextWidth(name+extraSpace, this.fieldFontSize+"px " + descartesJS.sansserif_font);

        if (!this.visible) {
          labelWidth = this.w - canvasWidth;
          minTFWidth = 0;
        }

        if (labelWidth < minLabelWidth) {
          labelWidth = minLabelWidth;
        }

        if (name == "") {
          labelWidth = 0;
        }

        if (this.w-labelWidth-canvasWidth < minTFWidth) {
          labelWidth = this.w - canvasWidth - minTFWidth;
        }

        if (labelWidth < 0) {
          labelWidth=0;
        }

        var fieldWidth = this.w - (labelWidth + canvasWidth);

        this.container.setAttribute("style", `width:${this.w}px;height:${this.h}px;left:${this.x}px;top:${this.y}px;z-index:${this.zIndex};background-color:transparent;`);

        var divStyle = `width:${canvasWidth}px;left:${labelWidth+((this.btn_pos === "v_right")?fieldWidth:0)}px;`;

        this.divUp.setAttribute("style", `${divStyle};height:${this.h/2+1}px;top:0;${(this.flat)?'border-width:0;':''}`);
        this.divDown.setAttribute("style", `${divStyle};height:${this.h/2-1}px;top:${this.h/2+1}px;${(this.flat)?'border-width:0;':''}`);

        this.field.setAttribute("style", `font-family:${descartesJS.sansserif_font};font-size:${this.fieldFontSize}px;width:${fieldWidth}px;height:${this.h}px;left:${((this.btn_pos === "v_left")?canvasWidth:0) + labelWidth}px;`);
        this.field.value = fieldValue;
        if (!this.visible) {
          this.field.style.display = "none";
        }

        this.label.setAttribute("style", `font-size:${this.fieldFontSize}px;width:${labelWidth}px;height:${this.h}px;line-height:${this.h}px;background-color:${this.label_color.getColor()};color:${this.label_text_color.getColor()};`);
      }

      if (this.image_dec && this.image_dec.ready) {
        this.divDown.style["background-image"] = "url(" + this.image_dec.src + ")";
      }
      if (this.image_inc && this.image_inc.ready) {
        this.divUp.style["background-image"] = "url(" + this.image_inc.src + ")";
      }

      this.divUp.setAttribute("horizontal", (this.horizontal)?true:false);
      this.divDown.setAttribute("horizontal", (this.horizontal)?true:false);

      // register the control value
      evaluator.setVariable(this.id, this.value);
    }

    /**
     * Update the spinner
     */
    update() {
      evaluator = this.evaluator;

      this.label.innerHTML = evaluator.eval(this.name).toString();

      if (evaluator.eval(this.decimals) < 0) {
        tmpIncr = evaluator.eval(this.incr);

        if (tmpIncr > 0) {
          this.incr = evaluator.parser.parse(parseInt(tmpIncr).toString());
          this.originalIncr = this.incr;
        }
        else {
          this.incr = parseTrue;
        }
      }
      else {
        this.incr = (evaluator.eval(this.originalIncr) !== 0) ? this.originalIncr : parseTrue;
      }

      // check if the control is active and visible
      this.activeIfValue = (evaluator.eval(this.activeif) > 0);
      this.drawIfValue = (evaluator.eval(this.drawif) > 0);

      // enable or disable the control
      this.field.disabled = !this.activeIfValue;
      this.divUp.setAttribute("active", !this.field.disabled);
      this.divDown.setAttribute("active", !this.field.disabled);

      // hide or show the spinner control
      if (this.drawIfValue) {
        this.updateStyle();
        this.container.style.display = "block"
      }
      else {
        this.click = false;
        this.container.style.display = "none";
      }

      // change in the images of the buttons
      if (this.image_dec) {
        tmp_image_dec_src = this.evaluator.eval(this.image_dec_src).toString().trim();
        if (this.old_image_dec_src !== tmp_image_dec_src) {
          this.divDown.style["background-image"] = "url(" + this.image_dec.src + ")";
          this.old_image_dec_src = tmp_image_dec_src;
        }
      }
      if (this.image_inc) {
        tmp_image_inc_src = this.evaluator.eval(this.image_inc_src).toString().trim();
        if (this.old_image_inc_src !== tmp_image_inc_src) {
          this.divUp.style["background-image"] = "url(" + this.image_inc.src + ")";
          this.image_inc_src = tmp_image_inc_src;
        }
      }

      // update the position and size
      this.updatePositionAndSize();

      if ( !(this.parent.animation.playing) || (document.activeElement != this.field) ) {
        oldFieldValue = this.field.value;
        oldValue = this.value;

        // update the spinner value
        this.value = this.validateValue( evaluator.getVariable(this.id) );
        this.field.value = this.formatOutputValue(this.value);

        if ((this.value == oldValue) && (this.field.value != oldFieldValue)) {
          // update the spinner value
          this.value = this.validateValue( oldFieldValue );
          this.field.value = this.formatOutputValue(this.value);
        }

        // register the control value
        evaluator.setVariable(this.id, this.value);
      }
    }

    /**
     * 
     */
    updateStyle() {
      this.divUp.style.borderStyle = (this.up) ? "inset" : "outset";
      this.divUp.style.borderColor = (this.up) ? "gray" : "#f0f8ff";
      this.divUp.style.backgroundColor = (this.up) ? "#bfbfbf" : "";
      this.divUp.style.backgroundColor = (this.flat) ? "transparent" : this.divUp.style.backgroundColor;
      this.divUp.style.backgroundPosition = (this.up) ? "calc(50% + 1px) calc(50% + 1px)" : "center";

      this.divDown.style.borderStyle = (this.down) ? "inset" : "outset";
      this.divDown.style.borderColor = (this.down) ? "gray" : "#f0f8ff";
      this.divDown.style.backgroundColor = (this.down) ? "#bfbfbf" : "";
      this.divDown.style.backgroundColor = (this.flat) ? "transparent" : this.divDown.style.backgroundColor;
      this.divDown.style.backgroundPosition = (this.down) ? "calc(50% + 1px) calc(50% + 1px)" : "center";
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
        if (value.toString().match("e")) {
          value = parseFloat(value).toFixed(20);
        }
      }
      value = (value != undefined) ? value.toString() : "0";

      var tmp = value.replace(this.parent.decimal_symbol, ".");
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
        resultValue = (incr == 0) ? 0 : (incr * Math.round(resultValue / incr));
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
        this.field.value = this.formatOutputValue(this.value);

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

      var self = this;
      var delay = (hasTouchSupport) ? 500 : 200;
      var timer;

      // prevent the context menu display
      self.divUp.oncontextmenu = self.divDown.oncontextmenu = self.field.oncontextmenu = self.label.oncontextmenu = function() { return false; };

      // prevent the default events int the label
      this.label.addEventListener("touchstart", descartesJS.preventDefault);
      this.label.addEventListener("mousedown", descartesJS.preventDefault);

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
      this.field.addEventListener("keydown", onKeyDown_TextField);

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
      this.divUp.addEventListener("touchstart", onMouseDown_UpButton);
      this.divUp.addEventListener("mousedown", onMouseDown_UpButton);

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
        self.updateStyle();
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
        self.updateStyle();
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
        self.updateStyle();
        // evt.preventDefault();
      }

      this.divUp.addEventListener("touchend", onMouseUp_UpButton);
      window.addEventListener("touchend", onMouseUp_UpButton);
      this.divUp.addEventListener("mouseup", onMouseUp_UpButton);
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

      this.divDown.addEventListener("touchend", onMouseUp_DownButton);
      window.addEventListener("touchend", onMouseUp_DownButton);
      this.divDown.addEventListener("mouseup", onMouseUp_DownButton);
      window.addEventListener("mouseup", onMouseUp_DownButton);

      /**
       *
       */
      document.addEventListener("visibilitychange", function(evt) {
        self.up = false;
        self.down = false;
        descartesJS.clearTimeout(timer);
        self.updateStyle();
      });

      /**
       * Prevent an error with the focus of a text field
       */
      self.field.addEventListener("click", function(evt) {
        // this.select();
        this.focus();
      });
    }
  }

  descartesJS.Spinner = Spinner;
  return descartesJS;
})(descartesJS || {});
