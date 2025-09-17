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
  let resultValue;
  let incr;
  let newValue;
  let min;
  let max;
  let name;
  let int_color;

  class Slider extends descartesJS.Control {
    /**
     * Descartes slider control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the slider control
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
        class : "DescartesSliderContainer",
        id    : self.id,
      });

      self.field = descartesJS.newHTML("input", {
        type  : "text",
        id    : self.id + "slider",
        class : "DescartesSliderField",
      });

      self.sliderCtr = descartesJS.newHTML("input", {
        type : "range",
        id   : self.id + "range",
        min  : 0,
        max  : 100,
        step : "any",
        class : "DescartesRange",
      });

      // the label
      self.label = descartesJS.newHTML("canvas", {
        class : "DescartesSliderLabel",
      });
      self.label_ctx = self.label.getContext("2d");
      self.ratio = parent.ratio;

      // add the elements to the container
      self.container.appendChild(self.label);
      self.container.appendChild(self.field);
      self.container.appendChild(self.sliderCtr);

      self.cover = descartesJS.newHTML("div", {
        class : "TextfieldCover"
      });
      if ( (self.keyboard) && (self.visible) ) {
        self.container.appendChild(self.cover);
      }

      self.addControlContainer(self.container);

      // register the mouse and touch events
      self.addEvents();

      // init the slider parameters
      self.init();
    }

    /**
     * Init the slider
     */
    init() {
      self = this;
      evaluator = self.evaluator;

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
      self.initSlider(fieldValue);

      // change the value if really need a change
      self.changeSliderPosition();

      self.prePos = self.pos;
      // register the control value
      evaluator.setVariable(self.id, self.value);
    }

    /**
     * Init the scroll configuration
     */
    initSlider(fieldValue) {
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

      let fieldValueSize = descartesJS.getTextWidth(fieldValue+"_", `${self.fieldFontSize}px ${descartesJS.sansserif_font}`);

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

        self.fieldWidth = self.w;
        self.fieldX = 0;

        self.sliderCtr.style = `position:absolute;left:0;top:${self.canvasY}px;width:${self.canvasHeight}px;height:${self.canvasWidth}px;transform-origin:${self.canvasWidth/2}px ${self.canvasWidth/2}px;transform:rotate(90deg);margin:0;padding:0;--thumb_size:${self.canvasWidth}px;--track_h:${parseInt(self.canvasWidth/3)}px;`;
      }
      // horizontal orientation
      else {
        let minsbw = 58;

        // get the width of all elements in the slider
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
      self.label.setAttribute("style", `font-size:${self.fieldFontSize}px;width:${self.labelWidth}px;height:${self.labelHeight}px;line-height:${self.labelHeight}px;left:0;top:${self.labelY}px;background-color:${self.label_color.getColor()};color:${self.label_text_color.getColor()};`);

      self.label.width  = self.labelWidth  * self.ratio;
      self.label.height = self.labelHeight * self.ratio;
    }

    /**
     * Update the slider
     */
    update() {
      let self = this;
      evaluator = self.evaluator;

      // check if the control is active and visible
      self.activeIfValue = (evaluator.eval(self.activeif) > 0);
      self.drawIfValue   = (evaluator.eval(self.drawif) > 0);

      // enable or disable the control
      self.field.disabled = !self.activeIfValue;

      // hide or show the slider control
      if (self.drawIfValue) {
        self.container.style.display = "block";
        self.draw();
      } else {
        self.container.style.display = "none";
      }

      // update the position and size
      self.updatePositionAndSize();

      // update the value of the slider
      let tmpValue = self.validateValue( evaluator.getVariable(self.id) );
      if ( (tmpValue != self.value) && !((Math.abs(tmpValue - self.value)>0) && (Math.abs(tmpValue - self.value)<0.000000001))) {
        self.value = tmpValue;
        self.changeSliderPosition();
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
        self.label_ctx.fillRect(0,0,self.label_ctx.canvas.width,self.label_ctx.canvas.height);
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
     * Draw the slider
     */
    draw() {
      self = this;

      // track color
      self.sliderCtr.style.setProperty("--track_color", self.color.getColor());

      // thumb color
      self.sliderCtr.style.setProperty("--thumb_color", self.colorInt.getColor());

      // horizontal
      self.sliderCtr.value = self.pos;
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

      incr = evaluator.eval(self.incr);
      resultValue = (incr != 0) ? (resultValue*incr)/incr : 0;

      if (self.fixed) {
        resultValue = parseFloat(parseFloat(resultValue).toFixed(evaluator.eval(self.decimals)));
      }

      return resultValue;
    }

    /**
     * Change the slider value
     */
    changeValue(value) {
      self = this;
      if (self.activeIfValue) {
        newValue = self.validateValue(value);

        // change the value if really need a change
        if (newValue != self.value) {
          self.value = newValue;
          self.field.value = self.formatValue(newValue);

          self.changeSliderPosition();

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
    changeValueForSliderMovement() {
      evaluator = this.evaluator;
      min = evaluator.eval(this.min);
      max = evaluator.eval(this.max);
      incr = evaluator.eval(this.incr);

      newValue = MathFloor( (((this.pos)*(max-min))/100)/incr )*incr + min;

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
    changeSliderPosition() {
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
      let self = this;

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
