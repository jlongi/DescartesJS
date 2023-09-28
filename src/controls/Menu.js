/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathAbs = Math.abs;

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

      this.label_color = this.label_color || new descartesJS.Color("e0e4e8", parent.evaluator);
      this.label_text_color = this.label_text_color || new descartesJS.Color("000000", parent.evaluator);

      this.options = values.options || "";

      parser = this.parser;
      evaluator = this.evaluator;

      // the evaluation of the control
      this.ok = 0;

      // tabular index
      this.tabindex = ++this.parent.tabindex;

      // if the answer exist
      if (this.answer) {
        // the answer is encrypted
        if (this.answer.match("krypto_")) {
          this.answer = (new descartesJS.Krypto()).decode(this.answer.substring(7));
        }

        this.answer = parseInt(this.answer.split(",")[0].replace("[", "")) || 0;
      }

      this.name_str = this.name;

      // modification to change the name of the button with an expression
      if (this.name.match(/^\[.*\]?/)) {
        this.name = this.parser.parse(this.name.substring(1, this.name.length-1));
      }
      else {
        this.name = this.parser.parse("'" + this.name + "'");
      }

      var self = this;
      this.evaluator.setFunction(this.id + ".setOptions", setOptions);
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
      this.containerControl = descartesJS.newHTML("div", {
        class : "DescartesMenuContainer",
        id    : this.id,
      });

      // the label
      this.label = descartesJS.newHTML("canvas", {
        class : "DescartesMenuLabel",
      });
this.label_ctx = this.label.getContext("2d");
this.ratio = parent.ratio;

      // the menu
      this.select = descartesJS.newHTML("select", {
        id       : this.id + "_menuSelect",
        class    : "DescartesMenuSelect",
        tabindex : this.tabindex,
      });
      // the text field
      this.field = descartesJS.newHTML("input", {
        type     : "text",
        id       : this.id + "_menuField",
        class    : "DescartesMenuField",
        tabindex : this.tabindex,
      });
      //
      setOptions(this.options);
      //

      // add the elements to the container
      this.containerControl.appendChild(this.label);
      this.containerControl.appendChild(this.select);

      // if visible then show the text field
      if (this.visible) {
        this.containerControl.appendChild(this.field);
      }

      this.cover = descartesJS.newHTML("div", {
        class : "TextfieldCover"
      });
      if ( (this.keyboard) && (this.visible) ) {
        this.containerControl.appendChild(this.cover);
      }


      this.addControlContainer(this.containerControl);

      // register the mouse and touch events
      this.addEvents();

      // init the menu parameters
      this.init();
    }

    /**
     * Init the menu
     */
    init(noupdate) {
      evaluator = this.evaluator;

      this.label.innerHTML = evaluator.eval(this.name).toString();
      var name = this.label.textContent;

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

      var minchw = 0;
      var indMinTFw = 0;
      var minTFw = 0;
      var mow;
      this.value = (noupdate) ? this.value : evaluator.eval(this.valueExpr);
      this.indexValue = this.getIndex(this.value);

      // find the widest choice to set the menu width
      for (var i=0, l=this.menuOptions.length; i<l; i++) {
        mow = descartesJS.getTextWidth( evaluator.eval(this.menuOptions[i]).toString(), this.fieldFontSize+"px " + descartesJS.sansserif_font );
        if (mow > minchw) {
          minchw = mow;
          indMinTFw = i;
        }
      }

      minchw += 25;
      minTFw = descartesJS.getTextWidth( this.formatOutputValue(evaluator.eval(this.strValue[indMinTFw])), this.fieldFontSize+"px " + descartesJS.sansserif_font ) + 7;

//      var labelWidth = descartesJS.getTextWidth(name, this.fieldFontSize+"px " + descartesJS.sansserif_font) +10;
var labelWidth = this.text_object.textNodes.metrics.w +parseInt(this.fieldFontSize);

      var fieldWidth = minTFw;

      if (name == "") {
        labelWidth = 0;
      }
      if (!this.visible) {
        fieldWidth = 0;
      }
      var chw = this.w - fieldWidth - labelWidth;
      while (chw<minchw && labelWidth>0) {
        labelWidth--;
        chw++;
      }
      while (chw<minchw && fieldWidth>0) {
        fieldWidth--;
        chw++;
      }
      while (labelWidth+chw+fieldWidth+1<this.w) {
        chw++;
        fieldWidth++;
      }
      var chx = labelWidth;
      var TFx = chx + chw;
      fieldWidth = this.w - TFx;

      var fieldValue = this.formatOutputValue( evaluator.eval(this.strValue[this.indexValue]) );

      this.containerControl.setAttribute("style", `width:${this.w}px;height:${this.h}px;left:${this.x}px;top:${this.y}px;z-index:${this.zIndex};`);

      this.label.setAttribute("style", `font-size:${this.fieldFontSize}px;width:${labelWidth}px;height:${this.h}px;line-height:${this.h}px;background-color:${this.label_color.getColor()};color:${this.label_text_color.getColor()};`);
this.label.width = labelWidth*this.ratio;
this.label.height = this.h*this.ratio;

      this.field.value = fieldValue;
      this.field.setAttribute("style", `font-size:${this.fieldFontSize}px;width:${fieldWidth}px;height:${this.h}px;left:${TFx}px;`);
      this.cover.setAttribute("style", `width:${fieldWidth}px;height:${this.h}px;left:${TFx}px;`);

      this.select.setAttribute("style", `text-align:left;font-size:${this.fieldFontSize}px;width:${chw}px;height:${this.h}px;left:${chx}px;`);
      this.select.selectedIndex = this.indexValue;

      // register the control value
      evaluator.setVariable(this.id, parseFloat(fieldValue.replace(this.parent.decimal_symbol, ".")));

      this.update();
    }

    /**
     * Update the menu
     */
    update() {
      evaluator = this.evaluator;

      // check if the control is active and visible
      this.activeIfValue = (evaluator.eval(this.activeif) > 0);
      this.drawIfValue = (evaluator.eval(this.drawif) > 0);

      // enable or disable the control
      this.field.disabled = (this.activeIfValue) ? false : true;
      this.select.disabled = (this.activeIfValue) ? false : true;

      // hide or show the menu control
      if (this.drawIfValue) {
        this.containerControl.style.display = "block";
      } else {
        this.click = false;
        this.containerControl.style.display = "none";
      }

      if ( !(this.parent.animation.playing) || (document.activeElement != this.select) ) {
        // this.label.innerHTML = evaluator.eval(this.name).toString();

        for (var i=0, l=this.menuOptions.length; i<l; i++) {
          this.select.options[i].innerHTML = evaluator.eval( this.menuOptions[i] );
        }

        // update the value of the menu
        this.value = evaluator.getVariable(this.id);

        if (isNaN(this.value)) {
          this.value = 0;
        }
        this.field.value = this.formatOutputValue(this.value);

        // register the control value
        evaluator.setVariable(this.id, parseFloat(this.value));
        this.select.selectedIndex = parseFloat(this.getIndex(this.value));
      }

      this.ok = (this.value == this.answer) ? 1 : 0;
      this.evaluator.setVariable(this.id+".ok", this.ok);

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
    changeValue() {
      if (this.activeIfValue) {
        // register the control value
        this.evaluator.setVariable(this.id, this.value);

        this.updateAndExecAction();
      }
    }

    /**
     * Register the mouse and touch events
     */
    addEvents() {
      var self = this;

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
      this.select.addEventListener("change", onChangeSelect);

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

  descartesJS.Menu = Menu;
  return descartesJS;
})(descartesJS || {});
