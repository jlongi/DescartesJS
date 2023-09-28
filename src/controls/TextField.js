/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var oldFieldValue;
  var oldValue;
  var resultValue;
  var evalMin;
  var evalMax;
  var int_color;

  class TextField extends descartesJS.Control {
    /**
     * Descartes text field control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the text field control
     */
    constructor(parent, values){
      // call the parent constructor
      super(parent, values);

      this.label_color = this.label_color || new descartesJS.Color("e0e4e8", parent.evaluator);
      this.label_text_color = this.label_text_color || new descartesJS.Color("000000", parent.evaluator);

      this.name_str = this.name;

      // modification to change the name of the text field with an expression
      if (this.name.match(/^\[.*\]?/)) {
        this.name = this.parser.parse(this.name.substring(1, this.name.length-1));
      }
      else {
        this.name = this.parser.parse("'" + this.name.trim() + "'");
      }

      if (this.valueExprString === undefined) {
        this.valueExprString = (this.onlyText) ? '0' : "";
      }

      // an empty string
      this.emptyString = false;

      // the evaluation of the control
      this.ok = 0;

      // tabular index
      this.tabindex = ++this.parent.tabindex;

      this.regExpDecimalSymbol = new RegExp("\\" + this.parent.decimal_symbol, "g");

      // if the answer exist
      if (this.answer) {
        // the answer is encrypted
        if (this.answer.match("krypto_")) {
          this.answer = (new descartesJS.Krypto()).decode(this.answer.substring(7));
        }
        this.answerPattern = this.answer;

        this.answer = descartesJS.buildRegularExpressionsPatterns(this.answer, this.evaluator);

        if (this.onlyText) {
          // find the first answer pattern
          var sepIndex = this.answerPattern.indexOf("|");
          this.firstAnswer = (sepIndex == -1) ? this.answerPattern : this.answerPattern.substring(0, sepIndex);
        } else {
          // find the minimum value of the first interval of a numeric answer pattern
          this.firstAnswer = this.parser.parse( this.answerPattern.substring(1, this.answerPattern.indexOf(",")) );
        }
      }

      // if the text field is only text, then the value has to fulfill the validation norms
      if (this.onlyText) {
        if ( !(this.valueExprString.match(/^'/)) || !(this.valueExprString.match(/'$/)) ) {
          this.valueExpr = this.evaluator.parser.parse( "'" + this.valueExprString + "'" );
        }

        /**
         * validate value for a only text control
         */
        this.validateValue = function(value) {
          value = value.toString();
          if ( (value == "''") || (value == "'") ) {
            return "";
          }

          if ((value) && value.match(/^'/) && value.match(/'$/)) {
            return value.substring(1,value.length-1);
          }

          return value;
        }
        this.formatOutputValue = function(value) {
          return value.toString();
        }
      }

      // control container
      this.containerControl = descartesJS.newHTML("div", {
        class : "DescartesTextFieldContainer",
        id    : this.id,
      });

      // the text field
      this.field = descartesJS.newHTML("input", {
        type     : "text",
        id       : this.id + "TextField",
        class    : "DescartesTextFieldField",
        tabindex : this.tabindex,
      });

      // the label
      this.label = descartesJS.newHTML("canvas", {
        class : "DescartesTextFieldLabel",
      });
      this.label_ctx = this.label.getContext("2d");
      this.ratio = parent.ratio;

      // add the elements to the container
      this.containerControl.appendChild(this.label);
      this.containerControl.appendChild(this.field);

      this.cover = descartesJS.newHTML("div", {
        class : "TextfieldCover"
      });
      if (this.keyboard) {
        this.containerControl.appendChild(this.cover);
      }

      this.addControlContainer(this.containerControl);

      // register the mouse and touch events
      this.addEvents();

      this.init();
    }

    /**
     * Init the text field
     */
    init(changeSizePos) {
      evaluator = this.evaluator;

      this.label.innerHTML = evaluator.eval(this.name).toString();
      var name = this.label.textContent;

      // validate the initial value
      if (!changeSizePos) {
        this.value = this.validateValue( evaluator.eval(this.valueExpr) );
      }

      // get the width of the initial value to determine the width of the text field
      var fieldValue = this.formatOutputValue(this.value);

      // find the font size of the text field
      this.fieldFontSize = (evaluator.eval(this.font_size)>0) ? evaluator.eval(this.font_size) : descartesJS.getFieldFontSize(this.h);

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
      }, this.name_str);
      //new
      this.text_object.draw(this.label_ctx, this.label_text_color.getColor(), 0, 0, true);

      var fieldValueSize = descartesJS.getTextWidth(fieldValue+"_", this.fieldFontSize+"px " + descartesJS.sansserif_font);

      // widths are calculated for each element
      var labelWidth = parseInt(this.w/2);
      var minTFWidth = fieldValueSize;
      var minLabelWidth = this.text_object.textNodes.metrics.w +parseInt(this.fieldFontSize);

      if (!this.visible) {
        labelWidth = this.w;
        minTFWidth = 0;
      }

      if (labelWidth < minLabelWidth) {
        labelWidth = minLabelWidth;
      }

      if (name == "") {
        labelWidth = 0;
      }

      if (this.w-labelWidth < minTFWidth) {
        labelWidth = this.w - minTFWidth;
      }

      if (labelWidth < 0) {
        labelWidth=0;
      }

      var fieldWidth = this.w - (labelWidth);

      this.containerControl.setAttribute("style", `width:${this.w}px;height:${this.h}px;left:${this.x}px;top:${this.y}px;z-index:${this.zIndex};`);

      this.field.setAttribute("style", `font-size:${this.fieldFontSize}px;width:${fieldWidth}px;height:${this.h}px;left:${labelWidth}px; font-family:${(this.font_family == "Serif")?descartesJS.serif_font:((this.font_family == "Monospaced")?descartesJS.monospace_font:descartesJS.sansserif_font)};`);
      this.field.value = fieldValue;
      this.cover.setAttribute("style", `;width:${fieldWidth}px;height:${this.h}px;left:${labelWidth}px;`);

      this.label.setAttribute("style", `font-size:${this.fieldFontSize}px;width:${labelWidth}px;height:${this.h}px;line-height:${this.h}px;background-color:${this.label_color.getColor()};color:${this.label_text_color.getColor()};`);

      this.label.width = labelWidth*this.ratio;
      this.label.height = this.h*this.ratio;

      // if the text field evaluates, get the ok value
      if (this.evaluate) {
        this.ok = this.evaluateAnswer();
      }

      // register the control value
      this.evaluator.setVariable(this.id, this.value);
      this.evaluator.setVariable(this.id+".ok", this.ok);

      this.oldValue = this.value;

      this.update();
    }

    /**
     * Update the text field
     */
    update() {
      evaluator = this.evaluator;

      // check if the control is active and visible
      this.activeIfValue = (evaluator.eval(this.activeif) > 0);
      this.drawIfValue = (evaluator.eval(this.drawif) > 0);

      // enable or disable the control
      this.field.disabled = !this.activeIfValue;

      // hide or show the text field control
      this.containerControl.style.display = (this.drawIfValue) ? "block" : "none";

      if ( !(this.parent.animation.playing) || (document.activeElement != this.field)) {
        oldFieldValue = this.field.value;
        oldValue = this.value;

        // update the text field value
        this.value = this.validateValue( evaluator.getVariable(this.id) );
        this.field.value = this.formatOutputValue(this.value);

        if ((this.value === oldValue) && (this.field.value != oldFieldValue)) {
          // update the spinner value
          this.value = this.validateValue( oldFieldValue );
          this.field.value = this.formatOutputValue(this.value);
        }

        // register the control value
        evaluator.setVariable(this.id, this.value);
      }

      // update the position and size
      this.updatePositionAndSize();

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
     * Validate if the value is in the range [min, max]
     * @param {String} value the value to validate
     * @return {Number} return the value like a number,
     *                         is greater than the upper limit then return the upper limit
     *                         is less than the lower limit then return the lower limit
     */
    validateValue(value) {
      // if the value is an empty text
      if ((value === "") || (value == "''")) {
        return "";
      }

      evaluator = this.evaluator;

      var tmp = value.toString().replace(this.regExpDecimalSymbol, ".", "g");
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

      // if is less than the lower limit
      if (resultValue < evalMin) {
        resultValue = evalMin;
      }

      // if is greater than the upper limit
      if (resultValue > evalMax) {
        resultValue = evalMax;
      }

      if (this.discrete) {
        var incr = evaluator.eval(this.incr);
        resultValue = (incr === 0) ? 0 : (incr * Math.round(resultValue / incr));
      }

      resultValue = parseFloat(parseFloat(resultValue).toFixed(evaluator.eval(this.decimals)));

      return resultValue;
    }

    /**
     * Format the value with the number of decimals, the exponential representation and the decimal symbol
     * @param {String} value tha value to format
     * @return {String} return the value with the format applied
     */
    formatOutputValue(value) {
      if (value === "") {
        return "";
      }

      return super.formatOutputValue(value);
    }

    /**
     * Change the text field value
     * @param {String} value is the new value to update the text field
     */
    changeValue(value) {
      if (this.activeIfValue) {
        this.value = this.validateValue(value);
        this.field.value = this.formatOutputValue(this.value);

        // if the text field evaluates, get the ok value
        if (this.evaluate) {
          this.ok = this.evaluateAnswer();
        }

        // register the control value
        this.evaluator.setVariable(this.id, this.value);
        this.evaluator.setVariable(this.id+".ok", this.ok);

        this.updateAndExecAction();
      }
    }

    /**
     * @return
     */
    evaluateAnswer() {
      return descartesJS.esCorrecto(this.answer, this.value, this.evaluator, this.answer);
    }

    /**
     * @return
     */
    getFirstAnswer() {
      // if the text field has an answer pattern
      if (this.answer) {
        // if the text field is only text
        if (this.onlyText) {
          return this.firstAnswer;
        }
        // if the text field is numeric
        else {
          return this.evaluator.eval(this.firstAnswer);
        }
      }
      // if the text field has not an answer pattern
      else {
        return "";
      }
    }

    /**
     * Register the mouse and touch events
     */
    addEvents() {
      var self = this;

      // prevent the context menu display
      self.field.oncontextmenu = self.label.oncontextmenu = self.cover.oncontextmenu = function() { return false; };

      // prevent the default events int the label
      self.label.addEventListener("touchstart", descartesJS.preventDefault);
      self.label.addEventListener("mousedown", descartesJS.preventDefault);

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
       * @param {Event} evt
       * @private
       */
      function onKeyDown_TextField(evt) {
        if (self.activeIfValue) {
          // responds to enter
          if (evt.keyCode == 13) {
            self.changeValue(self.field.value, true);
          }
        }
      }
      this.field.addEventListener("keydown", onKeyDown_TextField);

      /*
       * Prevent an error with the focus of a text field
       */
      self.field.addEventListener("click", function(evt) {
        // this.select();
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

  descartesJS.TextField = TextField;
  return descartesJS;
})(descartesJS || {});
