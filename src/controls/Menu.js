/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let MathAbs = Math.abs;
  let parser;
  let evaluator;
  let tempInd;
  let diff;
  let rest;
  let closeBracket;
  let tmpText;
  let pos;
  let ignoreSquareBracket;
  let charAt;
  let int_color;

  class Menu extends descartesJS.Control {
    /**
     * Descartes menu control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the menu control
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      let self = this;

      parser = self.parser;
      evaluator = self.evaluator;

      self.label_color = self.label_color || new descartesJS.Color("e0e4e8", evaluator);
      self.label_text_color = self.label_text_color || new descartesJS.Color("000000", evaluator);

      self.options = values.options || "";

      // the evaluation of the control
      self.ok = 0;

      // tabular index
      self.tabindex = ++parent.tabindex;

      // if the answer exist
      if (self.answer) {
        // the answer is encrypted
        if ((/^krypto_/).test(self.answer)) {
          self.answer = (new descartesJS.Krypto()).decode(self.answer.substring(7));
        }
        self.answer = parseInt(self.answer.split(",")[0].replace("[", "")) || 0;
      }

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

      self.evaluator.setFunction(self.id + ".setOptions", setOptions);

      /**
       * Auxiliary function to set the options to the menu
       */
      function setOptions(options) {
        // options are separated using the comma as separator
        self.options = options.split(",");
        self.menuOptions = [];
        self.strVal = [];

        let splitOption;

        // parse the options
        for (let i=0, l=self.options.length; i<l; i++) {
          // split the options if has values with square brackets (option[value])
          splitOption = self.customSplit(self.options[i]);

          // if divide the option only has a value, then are not specifying its value and take the order in which it appears
          if (splitOption.length == 1) {
            self.menuOptions.push( splitOption[0] );
            self.strVal.push( i.toString() );
          }
          // if divide the option has two values, then has a value specified
          else if (splitOption.length == 2) {
            self.menuOptions.push( splitOption[0] );

            // if the value is an empty string, then assign the order value
            if (splitOption[1] == "") {
              self.strVal.push( i.toString() );
            }
            // if not, then use te specified value
            else {
              self.strVal.push(splitOption[1]);
            }
          }
        }

        for (let i=0, l=self.menuOptions.length; i<l; i++) {
          // is an expression
          if ((/^\[.*\]$/).test(self.menuOptions[i]) ) {
            self.menuOptions[i] = parser.parse( self.menuOptions[i].slice(1, -1) );
          }
          // is a string
          else {
            self.menuOptions[i] = parser.parse( `'${self.menuOptions[i]}'` );
          }
        }

        // parse the option values
        for (let i=0, l=self.strVal.length; i<l; i++) {
          if ((/^\[.*\]$/).test(self.strVal[i]) ) {
            self.strVal[i] = parser.parse( self.strVal[i].slice(1, -1) );
          }
          else {
            self.strVal[i] = parser.parse( self.strVal[i] );
          }
        }

        // remove all the previous options
        self.select.innerHTML = "";

        // add the options to the menu
        let opt;
        for (let menuOptions_i of self.menuOptions) {
          opt = descartesJS.newHTML("option");
          opt.innerHTML = evaluator.eval(menuOptions_i);
          self.select.appendChild(opt);
        }

        return 0;
      }

      // control container
      self.containerControl = descartesJS.newHTML("div", {
        class : "DescartesMenuContainer",
        id    : self.id,
      });

      // the label
      self.label = descartesJS.newHTML("canvas", {
        class : "DescartesMenuLabel",
      });
      self.label_ctx = self.label.getContext("2d");
      self.ratio = parent.ratio;

      // the menu
      self.select = descartesJS.newHTML("select", {
        id       : self.id + "_menuSelect",
        class    : "DescartesMenuSelect",
        tabindex : self.tabindex,
      });
      // the text field
      self.field = descartesJS.newHTML("input", {
        type     : "text",
        id       : self.id + "_menuField",
        class    : "DescartesMenuField",
        tabindex : self.tabindex,
      });

      setOptions(self.options);


      // add the elements to the container
      self.containerControl.appendChild(self.label);
      self.containerControl.appendChild(self.select);

      // if visible then show the text field
      if (self.visible) {
        self.containerControl.appendChild(self.field);
      }

      self.cover = descartesJS.newHTML("div", {
        class : "TextfieldCover"
      });
      if ( (self.keyboard) && (self.visible) ) {
        self.containerControl.appendChild(self.cover);
      }

      self.addControlContainer(self.containerControl);

      // register the mouse and touch events
      self.addEvents();

      // init the menu parameters
      self.init();
    }

    /**
     * Init the menu
     */
    init(noupdate) {
      self = this;
      evaluator = self.evaluator;

      self.label.innerHTML = evaluator.eval(self.name).toString();
      let name = self.label.textContent;

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

      let minchw = 0;
      let indMinTFw = 0;
      let minTFw = 0;
      let mow;
      self.value = (noupdate) ? self.value : evaluator.eval(self.valueExpr);
      self.idxVal = self.getIndex(self.value);

      // find the widest choice to set the menu width
      for (let i=0, l=self.menuOptions.length; i<l; i++) {
        mow = descartesJS.getTextWidth( evaluator.eval(self.menuOptions[i]).toString(), `${self.fieldFontSize}px ${descartesJS.sansserif_font}` );
        if (mow > minchw) {
          minchw = mow;
          indMinTFw = i;
        }
      }

      minchw += 25;
      minTFw = descartesJS.getTextWidth( self.formatValue(evaluator.eval(self.strVal[indMinTFw])), `${self.fieldFontSize}px ${descartesJS.sansserif_font}` ) + 7;

      let labelWidth = self.text_object.textNodes.metrics.w +parseInt(self.fieldFontSize);

      let fieldWidth = minTFw;

      if (name == "") {
        labelWidth = 0;
      }
      if (!self.visible) {
        fieldWidth = 0;
      }
      let chw = self.w - fieldWidth - labelWidth;
      while (chw<minchw && labelWidth>0) {
        labelWidth--;
        chw++;
      }
      while (chw<minchw && fieldWidth>0) {
        fieldWidth--;
        chw++;
      }
      while (labelWidth+chw+fieldWidth+1<self.w) {
        chw++;
        fieldWidth++;
      }
      let chx = labelWidth;
      let TFx = chx + chw;
      fieldWidth = self.w - TFx;

      let fieldValue = self.formatValue( evaluator.eval(self.strVal[self.idxVal]) );

      self.containerControl.setAttribute("style", `width:${self.w}px;height:${self.h}px;left:${self.x}px;top:${self.y}px;z-index:${self.zIndex};`);

      self.label.setAttribute("style", `font-size:${self.fieldFontSize}px;width:${labelWidth}px;height:${self.h}px;line-height:${self.h}px;background-color:${self.label_color.getColor()};color:${self.label_text_color.getColor()};`);
      self.label.width = labelWidth*self.ratio;
      self.label.height = self.h*self.ratio;

      self.field.value = fieldValue;
      self.field.setAttribute("style", `font-size:${self.fieldFontSize}px;width:${fieldWidth}px;height:${self.h}px;left:${TFx}px;`);
      self.cover.setAttribute("style", `width:${fieldWidth}px;height:${self.h}px;left:${TFx}px;`);

      self.select.setAttribute("style", `text-align:left;font-size:${self.fieldFontSize}px;width:${chw}px;height:${self.h}px;left:${chx}px;`);
      self.select.selectedIndex = self.idxVal;

      // register the control value
      evaluator.setVariable(self.id, parseFloat(fieldValue.replace(self.parent.decimal_symbol, ".")));

      self.update();
    }

    /**
     * Update the menu
     */
    update() {
      self = this;
      evaluator = self.evaluator;

      // check if the control is active and visible
      self.activeIfValue = (evaluator.eval(self.activeif) > 0);
      self.drawIfValue   = (evaluator.eval(self.drawif) > 0);

      // enable or disable the control
      self.field.disabled  = (self.activeIfValue) ? false : true;
      self.select.disabled = (self.activeIfValue) ? false : true;

      // hide or show the menu control
      if (self.drawIfValue) {
        self.containerControl.style.display = "block";
      } else {
        self.click = false;
        self.containerControl.style.display = "none";
      }

      if ( !(self.parent.animation.playing) || (document.activeElement != self.select) ) {
        for (let i=0, l=self.menuOptions.length; i<l; i++) {
          self.select.options[i].innerHTML = (evaluator.eval( self.menuOptions[i] ) || "").replace(/\\u002C/g, ",");
        }

        // update the value of the menu
        self.value = evaluator.getVariable(self.id);

        if (isNaN(self.value)) {
          self.value = 0;
        }
        self.field.value = self.formatValue(self.value);

        // register the control value
        evaluator.setVariable(self.id, parseFloat(self.value));
        self.select.selectedIndex = parseFloat(self.getIndex(self.value));
      }

      self.ok = (self.value == self.answer) ? 1 : 0;
      self.evaluator.setVariable(self.id+".ok", self.ok);

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
     *
     */
    customSplit(op) {
      closeBracket = false;
      tmpText = "";
      pos = 0;
      ignoreSquareBracket = -1;

      while (pos < op.length) {
        charAt = op.charAt(pos);

        // find a open square bracket
        if ((charAt === "[") && (ignoreSquareBracket === -1)) {
          if ((closeBracket) || (tmpText != "")) {
            tmpText += "¦";
          }

          ignoreSquareBracket++;

        }
        else if (charAt === "[") {
          ignoreSquareBracket++;
        }

        // if find a close square bracket add the string +'
        else if ((charAt === "]") && (ignoreSquareBracket === 0)) {
          closeBracket = true;
          ignoreSquareBracket--;
        }

        else if (op.charAt(pos) == "]") {
          ignoreSquareBracket = (ignoreSquareBracket < 0) ? ignoreSquareBracket : ignoreSquareBracket-1;
        }

        tmpText += op.charAt(pos);

        pos++;
      }

      return tmpText.split("¦");
    }

    /**
     * Get the selected index
     * @param {String} val the value to find the index
     * @return {Number} return the index associated to the value
     */
    getIndex(val) {
      val = parseFloat( (val.toString()).replace(this.parent.decimal_symbol, ".") );
      tempInd = -1;
      diff = Infinity;

      for (let i=0, l=this.strVal.length; i<l; i++) {
        rest = MathAbs( val - parseFloat( this.evaluator.eval(this.strVal[i])) );

        if (rest <= diff) {
          diff = rest;
          tempInd = i;
        }
      }

      if (this.select.options[this.select.selectedIndex]) {
        this.evaluator.setVariable(this.id+".txt", this.select.options[this.select.selectedIndex].text);
      }

      return tempInd;
    }

    /**
     * Change the menu value
     */
    changeValue(value, keyboard) {
      self = this;

      if (self.activeIfValue) {
        // register the control value
        if (keyboard) {
          self.idxVal = self.getIndex(value);
          self.value = self.evaluator.eval( self.strVal[self.idxVal] );
          self.field.value = self.formatValue(self.idxVal);
          self.select.selectedIndex = self.idxVal;
        }

        self.evaluator.setVariable(self.id, self.value);

        self.updateAndExecAction();
      }
    }

    /**
     * Register the mouse and touch events
     */
    addEvents() {
      let self = this;

      self.label.addEventListener("touchstart", descartesJS.preventDefault)
      self.label.addEventListener("mousedown",  descartesJS.preventDefault)

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onChangeSelect(evt) {
        self.value = self.evaluator.eval( self.strVal[this.selectedIndex] );
        self.field.value = self.formatValue(self.value);
        self.evaluator.setVariable(self.id, self.field.value);

        self.changeValue();

        evt.preventDefault();
      }
      self.select.addEventListener("change", onChangeSelect);

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onKeyDown_TextField(evt) {
        // responds to enter
        if (evt.keyCode == 13) {
          self.idxVal = self.getIndex(self.field.value);

          self.value = self.evaluator.eval( self.strVal[self.idxVal] );
          self.field.value = self.formatValue(self.idxVal);
          self.select.selectedIndex = self.idxVal;

          self.changeValue();
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

      /*
      * Prevent an error with the focus of a text field
      */
      self.field.addEventListener("click", function(evt) {
        self.field.focus();
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

  descartesJS.Menu = Menu;
  return descartesJS;
})(descartesJS || {});
