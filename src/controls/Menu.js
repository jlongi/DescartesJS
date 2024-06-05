/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  const MathAbs = Math.abs;

  var parser;
  var evaluator;
  var tempInd;
  var diff;
  var rest;
  var closeBracket;
  var tmpText;
  var pos;
  var ignoreSquareBracket;
  var charAt;
  var int_color;

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

      self.label_color = self.label_color || new descartesJS.Color("e0e4e8", parent.evaluator);
      self.label_text_color = self.label_text_color || new descartesJS.Color("000000", parent.evaluator);

      self.options = values.options || "";

      parser = self.parser;
      evaluator = self.evaluator;

      // the evaluation of the control
      self.ok = 0;

      // tabular index
      self.tabindex = ++self.parent.tabindex;

      // if the answer exist
      if (self.answer) {
        // the answer is encrypted
        if (self.answer.match("krypto_")) {
          self.answer = (new descartesJS.Krypto()).decode(self.answer.substring(7));
        }
        self.answer = parseInt(self.answer.split(",")[0].replace("[", "")) || 0;
      }

      self.name_str = self.name;

      // modification to change the name of the button with an expression
      if (self.name.match(/^\[.*\]?/)) {
        self.name = self.parser.parse(self.name.substring(1, self.name.length-1));
      }
      else {
        self.name = self.parser.parse("'" + self.name + "'");
      }

      self.evaluator.setFunction(self.id + ".setOptions", setOptions);

      /**
       * Auxiliary function to set the options to the menu
       */
      function setOptions(options) {
        // options are separated using the comma as separator
        self.options = options.split(",");
        self.menuOptions = [];
        self.strValue = [];

        var splitOption;

        // parse the options
        for (var i=0, l=self.options.length; i<l; i++) {
          // split the options if has values with square brackets (option[value])
          splitOption = self.customSplit(self.options[i]);

          // if divide the option only has a value, then are not specifying its value and take the order in which it appears
          if (splitOption.length == 1) {
            self.menuOptions.push( splitOption[0] );
            self.strValue.push( i.toString() );
          }
          // if divide the option has two values, then has a value specified
          else if (splitOption.length == 2) {
            self.menuOptions.push( splitOption[0] );

            // if the value is an empty string, then assign the order value
            if (splitOption[1] == "") {
              self.strValue.push( i.toString() );
            }
            // if not, then use te specified value
            else {
              self.strValue.push(splitOption[1]);
            }
          }
        }

        for (var i=0, l=self.menuOptions.length; i<l; i++) {
          // is an expression
          if ( (self.menuOptions[i].match(/^\[/)) && (self.menuOptions[i].match(/\]$/)) ) {
            self.menuOptions[i] = parser.parse( self.menuOptions[i].substring(1, self.menuOptions[i].length-1) );
          }
          // is a string
          else {
            self.menuOptions[i] = parser.parse( "'" + self.menuOptions[i] + "'" );
          }
        }

        // parse the option values
        for (var i=0, l=self.strValue.length; i<l; i++) {
          if ( (self.strValue[i].match(/^\[/)) && (self.strValue[i].match(/\]$/)) ) {
            self.strValue[i] = parser.parse( self.strValue[i].substring(1, self.strValue[i].length-1) );
          }
          else {
            self.strValue[i] = parser.parse( self.strValue[i] );
          }
        }

        // remove all the previous options
        self.select.innerHTML = "";

        // add the options to the menu
        var opt;
        for (var i=0, l=self.menuOptions.length; i<l; i++) {
          opt = descartesJS.newHTML("option");
          opt.innerHTML = evaluator.eval( self.menuOptions[i] );
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
      //
      setOptions(self.options);
      //

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
      let self = this;
      evaluator = self.evaluator;

      self.label.innerHTML = evaluator.eval(self.name).toString();
      var name = self.label.textContent;

      // find the font size of the text field
      self.fieldFontSize = (evaluator.eval(self.font_size)>0) ? evaluator.eval(self.font_size) : descartesJS.getFieldFontSize(self.h);

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

      var minchw = 0;
      var indMinTFw = 0;
      var minTFw = 0;
      var mow;
      self.value = (noupdate) ? self.value : evaluator.eval(self.valueExpr);
      self.indexValue = self.getIndex(self.value);

      // find the widest choice to set the menu width
      for (var i=0, l=self.menuOptions.length; i<l; i++) {
        mow = descartesJS.getTextWidth( evaluator.eval(self.menuOptions[i]).toString(), self.fieldFontSize+"px " + descartesJS.sansserif_font );
        if (mow > minchw) {
          minchw = mow;
          indMinTFw = i;
        }
      }

      minchw += 25;
      minTFw = descartesJS.getTextWidth( self.formatOutputValue(evaluator.eval(self.strValue[indMinTFw])), self.fieldFontSize+"px " + descartesJS.sansserif_font ) + 7;

      var labelWidth = self.text_object.textNodes.metrics.w +parseInt(self.fieldFontSize);

      var fieldWidth = minTFw;

      if (name == "") {
        labelWidth = 0;
      }
      if (!self.visible) {
        fieldWidth = 0;
      }
      var chw = self.w - fieldWidth - labelWidth;
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
      var chx = labelWidth;
      var TFx = chx + chw;
      fieldWidth = self.w - TFx;

      var fieldValue = self.formatOutputValue( evaluator.eval(self.strValue[self.indexValue]) );

      self.containerControl.setAttribute("style", `width:${self.w}px;height:${self.h}px;left:${self.x}px;top:${self.y}px;z-index:${self.zIndex};`);

      self.label.setAttribute("style", `font-size:${self.fieldFontSize}px;width:${labelWidth}px;height:${self.h}px;line-height:${self.h}px;background-color:${self.label_color.getColor()};color:${self.label_text_color.getColor()};`);
      self.label.width = labelWidth*self.ratio;
      self.label.height = self.h*self.ratio;

      self.field.value = fieldValue;
      self.field.setAttribute("style", `font-size:${self.fieldFontSize}px;width:${fieldWidth}px;height:${self.h}px;left:${TFx}px;`);
      self.cover.setAttribute("style", `width:${fieldWidth}px;height:${self.h}px;left:${TFx}px;`);

      self.select.setAttribute("style", `text-align:left;font-size:${self.fieldFontSize}px;width:${chw}px;height:${self.h}px;left:${chx}px;`);
      self.select.selectedIndex = self.indexValue;

      // register the control value
      evaluator.setVariable(self.id, parseFloat(fieldValue.replace(self.parent.decimal_symbol, ".")));

      self.update();
    }

    /**
     * Update the menu
     */
    update() {
      let self = this;
      evaluator = self.evaluator;

      // check if the control is active and visible
      self.activeIfValue = (evaluator.eval(self.activeif) > 0);
      self.drawIfValue = (evaluator.eval(self.drawif) > 0);

      // enable or disable the control
      self.field.disabled = (self.activeIfValue) ? false : true;
      self.select.disabled = (self.activeIfValue) ? false : true;

      // hide or show the menu control
      if (self.drawIfValue) {
        self.containerControl.style.display = "block";
      } else {
        self.click = false;
        self.containerControl.style.display = "none";
      }

      if ( !(self.parent.animation.playing) || (document.activeElement != self.select) ) {
        for (var i=0, l=self.menuOptions.length; i<l; i++) {
          self.select.options[i].innerHTML = (evaluator.eval( self.menuOptions[i] ) || "").replace(/\\u002C/g, ",");
        }

        // update the value of the menu
        self.value = evaluator.getVariable(self.id);

        if (isNaN(self.value)) {
          self.value = 0;
        }
        self.field.value = self.formatOutputValue(self.value);

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
      if (int_color && ((int_color.constructor.name === "CanvasGradient") || (int_color.constructor.name === "CanvasPattern"))) {
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

        tmpText = tmpText + op.charAt(pos);

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

      for (var i=0, l=this.strValue.length; i<l; i++) {
        rest = MathAbs( val - parseFloat( this.evaluator.eval(this.strValue[i])) );

        if (rest <= diff) {
          diff = rest;
          tempInd = i;
        }
      }

      return tempInd;
    }

    /**
     * Change the menu value
     */
    changeValue(value, keyboard) {
      if (this.activeIfValue) {
        // register the control value
        if (keyboard) {
          this.indexValue = this.getIndex(value);
          this.value = this.evaluator.eval( this.strValue[this.indexValue] );
          this.field.value = this.formatOutputValue(this.indexValue);
          this.select.selectedIndex = this.indexValue;
        }

        this.evaluator.setVariable(this.id, this.value);

        this.updateAndExecAction();
      }
    }

    /**
     * Register the mouse and touch events
     */
    addEvents() {
      let self = this;

      // prevent the context menu display
      self.select.oncontextmenu = self.label.oncontextmenu = self.field.oncontextmenu = self.cover.oncontextmenu = function() { return false; };

      self.label.addEventListener("touchstart", descartesJS.preventDefault)
      self.label.addEventListener("mousedown", descartesJS.preventDefault)

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onChangeSelect(evt) {
        self.value = self.evaluator.eval( self.strValue[this.selectedIndex] );
        self.field.value = self.formatOutputValue(self.value);
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
          self.indexValue = self.getIndex(self.field.value);

          self.value = self.evaluator.eval( self.strValue[self.indexValue] );
          self.field.value = self.formatOutputValue(self.indexValue);
          self.select.selectedIndex = self.indexValue;

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
