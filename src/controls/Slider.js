/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  const MathFloor = Math.floor;

  const HORIZONTAL = "h";
  const VERTICAL = "v";

  var evaluator;
  var self;
  var fieldValue;
  var expr;
  var resultValue;
  var incr;
  var newValue;
  var min;
  var max;
  var name;
  var int_color;

  class Slider extends descartesJS.Control {
    /**
     * Descartes slider control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the slider control
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
        class : "DescartesSliderContainer",
        id    : this.id,
      });

      this.field = descartesJS.newHTML("input", {
        type  : "text",
        id    : this.id + "slider",
        class : "DescartesSliderField",
      });

      this.sliderCtr = descartesJS.newHTML("input", {
        type : "range",
        id   : this.id + "range",
        min  : 0,
        max  : 100,
        step : "any",
        class : "DescartesRange",
      });

      // the label
      this.label = descartesJS.newHTML("canvas", {
        class : "DescartesSliderLabel",
      });
      this.label_ctx = this.label.getContext("2d");
      this.ratio = parent.ratio;

      // add the elements to the container
      this.container.appendChild(this.label);
      this.container.appendChild(this.field);
      this.container.appendChild(this.sliderCtr);

      this.cover = descartesJS.newHTML("div", {
        class : "TextfieldCover"
      });
      if ( (this.keyboard) && (this.visible) ) {
        this.container.appendChild(this.cover);
      }

      this.addControlContainer(this.container);

      // register the mouse and touch events
      this.addEvents();

      // init the slider parameters
      this.init();
    }

    /**
     * Init the slider
     */
    init() {
      evaluator = this.evaluator;

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
      this.initSlider(fieldValue);

      // change the value if really need a change
      this.changeSliderPositionFromValue();

      this.prePos = this.pos;
      // register the control value
      evaluator.setVariable(this.id, this.value);
    }

    /**
     * Init the scroll configuration
     */
    initSlider(fieldValue) {
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

        self.fieldWidth = self.w;
        self.fieldX = 0;

        self.sliderCtr.style = `position:absolute;left:0;top:${self.canvasY}px;width:${self.canvasHeight}px;height:${self.canvasWidth}px;transform-origin:${self.canvasWidth/2}px ${self.canvasWidth/2}px;transform:rotate(90deg);margin:0;padding:0;--thumb_size:${self.canvasWidth}px;--track_h:${parseInt(self.canvasWidth/3)}px;`;
      }
      // horizontal orientation
      else {
        var minsbw = 58;

        // get the width of all elements in the slider
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

        self.sliderCtr.style = `position:absolute;left:${self.canvasX}px;top:0;width:${self.canvasWidth}px;height:${self.canvasHeight}px;margin:0;padding:0;--thumb_size:${self.canvasHeight}px;--track_h:${parseInt(self.canvasHeight/3)}px;`;
      }

      self.container.setAttribute("style", `width:${self.w}px;height:${self.h}px;left:${self.x}px;top:${self.y}px;z-index:${self.zIndex};`);

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
     * Update the slider
     */
    update() {
      evaluator = this.evaluator;

      // check if the control is active and visible
      this.activeIfValue = (evaluator.eval(this.activeif) > 0);
      this.drawIfValue = (evaluator.eval(this.drawif) > 0);

      // enable or disable the control
      this.field.disabled = !this.activeIfValue;

      // hide or show the slider control
      if (this.drawIfValue) {
        this.container.style.display = "block";
        this.draw();
      } else {
        this.container.style.display = "none";
      }

      // update the position and size
      this.updatePositionAndSize();

      // update the value of the slider
      var tmpValue = this.validateValue( evaluator.getVariable(this.id) );
      if ( (tmpValue != this.value) && !((Math.abs(tmpValue - this.value)>0) && (Math.abs(tmpValue - this.value)<.000000001))) {
        this.value = tmpValue;
        this.changeSliderPositionFromValue();
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
     * Draw the slider
     */
    draw() {
      self = this;

      // track color
      this.sliderCtr.style.setProperty("--track_color", this.color.getColor());

      // thumb color
      this.sliderCtr.style.setProperty("--thumb_color", this.colorInt.getColor());

      // horizontal
      this.sliderCtr.value = this.pos;
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

      incr = evaluator.eval(this.incr);
      resultValue = (incr != 0) ? (resultValue*incr)/incr : 0;

      if (this.fixed) {
        resultValue = parseFloat(parseFloat(resultValue).toFixed(evaluator.eval(this.decimals)));
      }

      return resultValue;
    }

    /**
     * Change the slider value
     */
    changeValue(value) {
      if (this.activeIfValue) {
        newValue = this.validateValue(value);

        // change the value if really need a change
        if (newValue != this.value) {
          this.value = newValue;
          this.field.value = this.formatOutputValue(newValue);

          this.changeSliderPositionFromValue();

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
    changeValueForSliderMovement() {
      evaluator = this.evaluator;
      min = evaluator.eval(this.min);
      max = evaluator.eval(this.max);
      incr = evaluator.eval(this.incr);

      newValue = MathFloor( (((this.pos)*(max-min))/100)/incr )*incr  +min;

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
    changeSliderPositionFromValue() {
      evaluator = this.evaluator;
      min = evaluator.eval(this.min);
      max = evaluator.eval(this.max);
      incr = evaluator.eval(this.incr);
      this.pos = ((this.value-min)*100)/(max-min);
    }

    /**
     * Register the mouse and touch events
     */
    addEvents() {
      var self = this;

      // prevent the context menu display
      self.label.oncontextmenu = self.field.oncontextmenu = self.cover.oncontextmenu = function () { return false; };

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

      self.sliderCtr.addEventListener("input", function(evt) {
        self.pos = evt.target.value;
        self.changeValueForSliderMovement();
      });
    }
  }

  descartesJS.Slider = Slider;
  return descartesJS;
})(descartesJS || {});
