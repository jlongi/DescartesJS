/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let evaluator;
  let oldFieldValue;
  let oldValue;
  let resultValue;
  let evalMin;
  let evalMax;
  let int_color;
  let tmp_answer;

  class TextField extends descartesJS.Control {
    /**
     * Descartes text field control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the text field control
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

      // modification to change the name of the text field with an expression
      if ((/^\[.*\]$/).test(self.name)) {
        self.name = self.parser.parse(self.name.slice(1, -1));
      }
      else {
        self.name = self.parser.parse(`'${self.name.trim()}'`);
      }

      if (self.valueExprString === undefined) {
        self.valueExprString = (self.onlyText) ? '0' : "";
      }

      // an empty string
      self.emptyString = false;

      // the evaluation of the control
      self.ok = 0;

      // tabular index
      self.tabindex = ++parent.tabindex;
      
      // if the answer exist
      if (self.evaluate) {
        if (self.answer) {
          tmp_answer = self.answer.match(/^krypto_(.*)$/);

          // the answer is encrypted
          if (tmp_answer) {
            self.answer = (new descartesJS.Krypto()).decode(tmp_answer[1]);
          }

          self.answer = descartesJS.answerRegEx(self.answer, self.evaluator, self.onlyText);
        }
        // if the evaluate checkbox is marked but no answer is given, then don't evaluate
        else {
          self.evaluate = false;
        }
      }

      // if the text field is only text, then the value has to fulfill the validation norms
      if (self.onlyText) {
        if ( !(/^'.*'$/).test(self.valueExprString) ) {
          self.valueExpr = self.evaluator.parser.parse( `'${self.valueExprString}'` );
        }

        /**
         * validate value for a only text control
         */
        self.validateValue = function(value) {
          value = value.toString();
          if ( (value == "''") || (value == "'") ) {
            return "";
          }

          if (value && (/^'.*'$/).test(value)) {
            return value.slice(1, -1);
          }

          return value;
        }
        self.formatValue = function(value) {
          return value.toString();
        }
      }

      // control container
      self.containerControl = descartesJS.newHTML("div", {
        class : "DescartesTextFieldContainer",
        id    : self.id,
      });

      // the text field
      self.field = descartesJS.newHTML("input", {
        type     : "text",
        id       : self.id + "TextField",
        class    : "DescartesTextFieldField",
        tabindex : self.tabindex,
      });

      // the label
      self.label = descartesJS.newHTML("canvas", {
        class : "DescartesTextFieldLabel",
      });
      self.label_ctx = self.label.getContext("2d");
      self.ratio = parent.ratio;

      // add the elements to the container
      self.containerControl.appendChild(self.label);
      self.containerControl.appendChild(self.field);

      self.cover = descartesJS.newHTML("div", {
        class : "TextfieldCover"
      });
      if (self.keyboard) {
        self.containerControl.appendChild(self.cover);
      }

      self.activoStr = self.id + ".activo";
      self.activeStr = self.id + ".active";

      self.addControlContainer(self.containerControl);

      // register the mouse and touch events
      self.addEvents();

      self.init();
    }

    /**
     * Init the text field
     */
    init(changeSizePos) {
      self = this;
      evaluator = self.evaluator;

      self.label.innerHTML = evaluator.eval(self.name).toString();
      let name = self.label.textContent;

      // validate the initial value
      if (!changeSizePos) {
        self.value = self.validateValue( evaluator.eval(self.valueExpr) );
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

      let fieldValueSize = descartesJS.getTextWidth(fieldValue+"_", self.fieldFontSize+"px " + descartesJS.sansserif_font);

      // widths are calculated for each element
      let labelWidth = parseInt(self.w/2);
      let minTFWidth = fieldValueSize;
      let minLabelWidth = self.text_object.textNodes.metrics.w + parseInt(self.fieldFontSize);

      if (!self.visible) {
        labelWidth = self.w;
        minTFWidth = 0;
      }

      if (labelWidth < minLabelWidth) {
        labelWidth = minLabelWidth;
      }

      if (name == "") {
        labelWidth = 0;
      }

      if (self.w-labelWidth < minTFWidth) {
        labelWidth = self.w - minTFWidth;
      }

      if (labelWidth < 0) {
        labelWidth=0;
      }

      let fieldWidth = self.w - (labelWidth);

      self.containerControl.setAttribute("style", `width:${self.w}px;height:${self.h}px;left:${self.x}px;top:${self.y}px;z-index:${self.zIndex};`);

      self.field.setAttribute("style", `font-size:${self.fieldFontSize}px;width:${fieldWidth}px;height:${self.h}px;left:${labelWidth}px; font-family:${(self.font_family == "Serif")?descartesJS.serif_font:((self.font_family == "Monospaced")?descartesJS.monospace_font:descartesJS.sansserif_font)};`);
      self.field.value = fieldValue;
      self.cover.setAttribute("style", `;width:${fieldWidth}px;height:${self.h}px;left:${labelWidth}px;`);

      self.label.setAttribute("style", `font-size:${self.fieldFontSize}px;width:${labelWidth}px;height:${self.h}px;line-height:${self.h}px;background-color:${self.label_color.getColor()};color:${self.label_text_color.getColor()};`);

      self.label.width  = labelWidth * self.ratio;
      self.label.height = self.h * self.ratio;

      // if the text field evaluates, get the ok value
      if (self.evaluate) {
        self.ok = self.evalAnswer();
      }

      // register the control value
      self.evaluator.setVariable(self.id, self.value);
      self.evaluator.setVariable(self.id+".ok", self.ok);

      self.oldValue = self.value;

      self.update();
    }

    /**
     * Update the text field
     */
    update() {
      self = this;
      evaluator = self.evaluator;

      // check if the control is active and visible
      self.activeIfValue = (evaluator.eval(self.activeif) > 0);
      self.drawIfValue   = (evaluator.eval(self.drawif) > 0);

      // enable or disable the control
      self.field.disabled = !self.activeIfValue;

      // hide or show the text field control
      self.containerControl.style.display = (self.drawIfValue) ? "block" : "none";

      if ( !(self.parent.animation.playing) || (document.activeElement != self.field)) {
        oldFieldValue = self.field.value;
        oldValue = self.value;

        // update the text field value
        self.value = self.validateValue( evaluator.getVariable(self.id) );
        self.field.value = self.formatValue(self.value);

        if ((self.value === oldValue) && (self.field.value != oldFieldValue)) {
          // update the spinner value
          self.value = self.validateValue(oldFieldValue);
          self.field.value = self.formatValue(self.value);
        }

        // register the control value
        evaluator.setVariable(self.id, self.value);
      }

      // update the position and size
      self.updatePositionAndSize();

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

      let tmp = value.toString().replace(this.parent.decimal_symbol_regexp, ".");
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
        let incr = evaluator.eval(this.incr);
        resultValue = (incr === 0) ? 0 : (incr * Math.round(resultValue / incr));
      }

      resultValue = parseFloat(parseFloat(resultValue).toFixed(evaluator.eval(this.decimals)));

      return resultValue;
    }

    /**
     * Format the value with the number of decimals, the exponential representation and the decimal symbol
     * @param {String} value that value to format
     * @return {String} return the value with the format applied
     */
    formatValue(value) {
      if (value === "") {
        return value;
      }

      return super.formatValue(value);
    }

    /**
     * Change the text field value
     * @param {String} value is the new value to update the text field
     */
    changeValue(value) {
      if (this.activeIfValue) {
        this.value = this.validateValue(value);
        this.field.value = this.formatValue(this.value);

        // if the text field evaluates, get the ok value
        if (this.evaluate) {
          this.ok = this.evalAnswer();
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
    evalAnswer() {
      return descartesJS.esCorrecto(this.answer, this.value, this.evaluator);
    }

    /**
     * Deactivate the control
     */
    deactivate() {
      this.evaluator.setVariable(this.activoStr, 0);
      this.evaluator.setVariable(this.activeStr, 0);
    }

    /**
     * Register the mouse and touch events
     */
    addEvents() {
      let self = this;

      // prevent the default events int the label
      self.label.addEventListener("touchstart", descartesJS.preventDefault);
      self.label.addEventListener("mousedown",  descartesJS.preventDefault);

      /**
       */
      self.field.addEventListener("mousedown", function (evt) {
        self.parent.deactivateControls();
        self.evaluator.setVariable(self.activoStr, 1);
        self.evaluator.setVariable(self.activeStr, 1);
        self.parent.update();
      });
      /**
       */
      self.field.addEventListener("blur", function (evt) {
        if (self.drawIfValue) {
          self.changeValue(self.field.value, true);
        }
      });

      /**
       *
       */      
      self.field.addEventListener("keydown", function (evt) {
        if (self.activeIfValue) {
          // responds to enter
          if (evt.keyCode == 13) {
            self.changeValue(self.field.value, true);
          }
        }
      });

      /*
       * Prevent an error with the focus of a text field
       */
      self.field.addEventListener("click", function(evt) {
        this.focus();
      });

      /**
       * 
       */
      self.cover.addEventListener("click", function(evt) {
        self.parent.deactivateControls();
        self.evaluator.setVariable(self.activoStr, 1);
        self.evaluator.setVariable(self.activeStr, 1);
        self.parent.update();

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
