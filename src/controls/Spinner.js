/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var tmpIncr;
  var expr;
  var oldFieldValue;
  var oldValue;
  var ctx;
  var w;
  var h;
  var c1;
  var c2;
  var triaX;
  var triaY;
  var resultValue;
  var incr;
  var decimals;
  var evalMin;
  var evalMax;
  var hasTouchSupport;
  var parseTrue;

  /**
   * Descartes spinner control
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the spinner control
   */
  descartesJS.Spinner = function(parent, values){
    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    // tabular index
    this.tabindex = ++this.parent.tabindex;

    if (this.name == "_._") {
      this.name = "";
    }

    // change the name of the button with an expression
    if ((this.name.charAt(0) === "[") && (this.name.charAt(this.name.length-1) === "]")) {
      this.name = this.parser.parse(this.name.substring(1, this.name.length-1));
    }
    else {
      this.name = this.parser.parse("'" + this.name + "'");
    }

    // control container
    this.container = document.createElement("div");
    this.canvas = document.createElement("canvas");
    this.divUp = document.createElement("div");
    this.divDown = document.createElement("div");
    this.field = document.createElement("input");

    // the label
    this.label = document.createElement("label");

    this.container.appendChild(this.label);
    this.container.appendChild(this.field);
    this.container.appendChild(this.canvas);
    this.container.appendChild(this.divUp);
    this.container.appendChild(this.divDown);

    this.addControlContainer(this.container);

    parseTrue = this.evaluator.parser.parse("1");

    // if the decimals are negative or zero
    this.originalIncr = this.incr;
    if ( (this.evaluator.eval(this.decimals) < 0) || (this.evaluator.eval(this.incr) == 0) ) {
      var tmpIncr = this.evaluator.eval(this.incr);

      if (tmpIncr > 0) {
        this.incr = this.evaluator.parser.parse(parseInt(tmpIncr).toString());
        this.originalIncr = this.incr;
      }
      else {
        this.incr = parseTrue;
      }
    }

    // register the mouse and touch events
    this.addEvents();

    // init the menu parameters
    this.init();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Spinner, descartesJS.Control);

  /**
   * Init the spinner
   */
  descartesJS.Spinner.prototype.init = function() {
    evaluator = this.evaluator;

    var name = evaluator.eval(this.name).toString();
    this.label.innerHTML = name;

    // validate the initial value
    this.value = this.validateValue(evaluator.eval(this.valueExpr));

    // get the width of the initial value to determine the width of the text field
    var fieldValue = this.formatOutputValue(this.value);

    // find the font size of the text field
    this.fieldFontSize = (this.parent.version !== 2) ? descartesJS.getFieldFontSize(this.h) : 10;

    // extra space added to the name
    var extraSpace = (this.parent.version !== 2) ? "__" : "_____";

    var fieldValueSize = descartesJS.getTextWidth(fieldValue+"_", this.fieldFontSize+"px " + descartesJS.sansserif_font);

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

    this.container.setAttribute("class", "DescartesSpinnerContainer");
    this.container.setAttribute("style", "width:" + this.w + "px;height:" + this.h + "px;left:" + this.x + "px;top:" + this.y + "px;z-index:" + this.zIndex + ";");
    this.container.setAttribute("id", this.id);

    this.canvas.setAttribute("width", canvasWidth+"px");
    this.canvas.setAttribute("height", this.h+"px");
    this.canvas.setAttribute("style", "position:absolute;left:" + labelWidth + "px;top:0;");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    var divStyle = "opacity:0;cursor:pointer;position:absolute;width:" + canvasWidth + "px;height:" + this.h/2 + "px;left:" + labelWidth + "px;";
    this.divUp.setAttribute("class", "up");
    this.divUp.setAttribute("style", divStyle+"top:0;");
    this.divDown.setAttribute("class", "down");
    this.divDown.setAttribute("style", divStyle+"top:" + this.h/2 + "px;");

    this.field.setAttribute("type", "text");
    this.field.setAttribute("id", this.id+"_spinner");
    this.field.setAttribute("class", "DescartesSpinnerField");
    this.field.setAttribute("style", "font-family:" + descartesJS.sansserif_font + ";font-size:" + this.fieldFontSize + "px;width:" + fieldWidth + "px;height:" + this.h + "px;left:" + (canvasWidth + labelWidth) + "px;");
    this.field.setAttribute("tabindex", this.tabindex);
    this.field.value = fieldValue;
    if (!this.visible) {
      this.field.style.display = "none";
    }

    this.label.setAttribute("class", "DescartesSpinnerLabel");
    this.label.setAttribute("style", "font-size:" + this.fieldFontSize + "px;width:" + labelWidth + "px;height:" + this.h + "px;line-height:" + this.h + "px;");

    // register the control value
    evaluator.setVariable(this.id, this.value);

    // create the background gradient
    this.createGradient(this.h/2, this.h);

    // this.update();
  }

  /**
   * Update the spinner
   */
  descartesJS.Spinner.prototype.update = function() {
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

    // hide or show the spinner control
    if (this.drawIfValue) {
      this.container.style.display = "block"
      this.draw();
    }
    else {
      this.click = false;
      this.container.style.display = "none";
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
   * Draw the spinner
   */
  descartesJS.Spinner.prototype.draw = function() {
// return;
    ctx = this.ctx;

    w = this.canvas.width;
    h = this.canvas.height

    ctx.fillStyle = "#f0f8ff";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = this.linearGradient;
    ctx.fillRect(0, 0, w, h);

    // draw the upper lines for depth efect
    if (this.up) {
      c1 = "gray";
      c2 = "#f0f8ff";
    } else {
      c1 = "#f0f8ff";
      c2 = "gray";
    }

    descartesJS.drawLine(ctx, 0, 0, w, 0, c1);
    descartesJS.drawLine(ctx, 0, 0, 0, h/2, c1);
    descartesJS.drawLine(ctx, 0, h/2, w, h/2, c2);

    // draw the lower lines for depth efect
    if (this.down) {
      c1 = "gray";
      c2 = "#f0f8ff";
    } else {
      c1 = "#f0f8ff";
      c2 = "gray";
    }

    descartesJS.drawLine(ctx, 0, h/2+1, w, h/2+1, c1);
    descartesJS.drawLine(ctx, 0, h/2+1, 0, h, c1);
    descartesJS.drawLine(ctx, 0, h-1, w, h-1, c2);

    triaX = [parseInt(w/2+1), parseInt(w/5+1), parseInt(w-w/5+1)];
    triaY = [parseInt(h/8+1), parseInt(h/8+1+h/4), parseInt(h/8+1+h/4)];

    // draw the uper triangle
    ctx.fillStyle = (this.activeIfValue) ? "#2244cc" : "#8888aa";
    ctx.beginPath();
    ctx.moveTo(triaX[0], triaY[0]);
    ctx.lineTo(triaX[1], triaY[1]);
    ctx.lineTo(triaX[2], triaY[2]);
    ctx.fill();

    triaY = [parseInt(h-h/8), parseInt(h-h/8-h/4), parseInt(h-h/8-h/4)];

    // draw the lower triangle
    ctx.fillStyle = (this.activeIfValue) ? "#d00018" : "#aa8888";
    ctx.beginPath();
    ctx.moveTo(triaX[0], triaY[0]);
    ctx.lineTo(triaX[1], triaY[1]);
    ctx.lineTo(triaX[2], triaY[2]);
    ctx.fill();

    // draw another layer for pressed effect
    ctx.fillStyle = "rgba(0,0,0,"+ 24/255 +")";
    if (this.up) {
      ctx.fillRect(0, 0, w, h/2);
    }
    if (this.down) {
      ctx.fillRect(0, h/2, w, h);
    }
  }

  /**
   * Validate if the value is the range [min, max]
   * @param {String} value the value to validate
   * @return {Number} return the value like a number,
   *                         is greater than the upper limit then return the upper limit
   *                         is less than the lower limit then return the lower limit
   */
  descartesJS.Spinner.prototype.validateValue = function(value) {
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
  descartesJS.Spinner.prototype.increase = function() {
    this.changeValue( parseFloat(this.value) + this.evaluator.eval(this.incr) );
  }

  /**
   * Decrease the value of the spinner
   */
  descartesJS.Spinner.prototype.decrease = function() {
    this.changeValue( parseFloat(this.value) - this.evaluator.eval(this.incr) );
  }

  /**
   * Change the spinner value
   */
  descartesJS.Spinner.prototype.changeValue = function(value) {
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
  descartesJS.Spinner.prototype.addEvents = function() {
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
     * @param {Function} fun the function to execut
     * @param {Boolean} firstime a flag to indicated if is the first time clicked
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
          self.draw();
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
          self.draw();
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
      self.draw();
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
      self.draw();
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
      self.draw();
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
      self.draw();
    });

    /**
     * Prevent an error with the focus of a text field
     */
    self.field.addEventListener("click", function(evt) {
      this.select();
      this.focus();
    });
  }

  return descartesJS;
})(descartesJS || {});
