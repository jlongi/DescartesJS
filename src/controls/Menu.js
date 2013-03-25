/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathAbs = Math.abs;

  var expr
  var val;
  var tempInd;
  var diff;
  var rest;
  var resultValue;
  var decimals;
  var indexDot;
  var subS;
  var hasTouchSupport;

  /**
   * Descartes menu control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the menu control
   */
  descartesJS.Menu = function(parent, values) {
    this.options = "";

    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    var parser = this.parser;
    
    // options are separated using the comma as separator
    this.options = this.options.split(",");
    
    this.menuOptions = [];
    this.strValue = [];
    
    var splitOption;
    // parse the options
    for (var i=0, l=this.options.length; i<l; i++) {
      // split the options if has values with square backets (option[value])
      splitOption = this.options[i].split(/[\[\]]/,2);

      // if divide the option only has a value, then are not specifying its value and take the order in which it appears
      if (splitOption.length == 1) {
        this.menuOptions.push( splitOption[0] );
        this.strValue.push( i.toString() );
      } 
      // if divide the option has two values, then has a value specified
      else if (splitOption.length == 2) {
        this.menuOptions.push( splitOption[0] );
        
        // if the value is an empty string, then asign the order value
        if (splitOption[1] == "") {
          this.strValue.push( i.toString() );
        }
        // if not, then use te especified value
        else {
          this.strValue.push(splitOption[1]);
        }
      }
    }

    // parse the option values
    for (var i=0, l=this.strValue.length; i<l; i++) {
      this.strValue[i] = parser.parse( this.strValue[i] );
    }
   
    // control container
    this.containerControl = document.createElement("div");

    // the label
    this.label = document.createElement("label");
    this.txtLabel = document.createTextNode(this.name);
    this.label.appendChild(this.txtLabel);
    
    // the menu
    this.select = document.createElement("select");

    // add the options to the menu
    var opt;
    for (var i=0, l=this.menuOptions.length; i<l; i++) {
      opt = document.createElement("option");
      opt.innerHTML = this.menuOptions[i];
      this.select.appendChild(opt);
    }

    // the text field
    this.field = document.createElement("input");

    // add the elements to the container
    this.containerControl.appendChild(this.label);
    this.containerControl.appendChild(this.select);
    
    // if visible then show the text field
    if (this.visible) {
      this.containerControl.appendChild(this.field);
    }

    this.addControlContainer(this.containerControl);
    
    // register the mouse and touch events
    this.registerMouseAndTouchEvents();

    // init the menu parameters
    this.init();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Menu, descartesJS.Control);

  var evaluator;

  /**
   * Init the menu
   */
  descartesJS.Menu.prototype.init = function() {
    evaluator = this.evaluator;

    // find the font size of the text field
    this.fieldFontSize = (this.parent.version != 2) ? descartesJS.getFieldFontSize(this.h) : 10;

    var minchw = 0;
    var indMinTFw = 0;
    var minTFw = 0;
    var mow;
    this.value = evaluator.evalExpression(this.valueExpr);
    this.indexValue = this.getIndex(this.value);

    // find the widest choice to set the menu width
    for (var i=0, l=this.menuOptions.length; i<l; i++) {
      mow = descartesJS.getTextWidth( this.menuOptions[i], this.fieldFontSize+"px Arial" );
      if (mow > minchw) {
        minchw = mow;
        indMinTFw = i;
      }
    }
    
    minchw += 25;
    minTFw = descartesJS.getTextWidth( this.formatOutputValue(evaluator.evalExpression(this.strValue[indMinTFw])), this.fieldFontSize+"px Arial" ) + 7;
    
    var labelWidth = descartesJS.getTextWidth(this.name, this.fieldFontSize+"px Arial") +10;
    var fieldWidth = minTFw;

    if (this.name == "") {
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
    
    var fieldValue = this.formatOutputValue( evaluator.evalExpression(this.strValue[this.indexValue]) );

    this.containerControl.setAttribute("class", "DescartesSpinnerContainer");
    this.containerControl.setAttribute("style", "width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");

    this.label.setAttribute("class", "DescartesMenuLabel");
    this.label.setAttribute("style", "font-size:" + this.fieldFontSize + "px; width: " + labelWidth + "px; height: " + this.h + "px; line-height: " + this.h + "px;");
    
    this.field.setAttribute("type", "text");
    this.field.setAttribute("id", this.id+"menu");
    this.field.value = fieldValue;
    this.field.setAttribute("class", "DescartesMenuField");
    this.field.setAttribute("style", "font-size: " + this.fieldFontSize + "px; width : " + (fieldWidth -2) + "px; height : " + (this.h-2) + "px; left: " + TFx + "px;");

    this.select.setAttribute("id", this.id+"menuSelect");
    this.select.setAttribute("class", "DescartesMenuSelect");
    this.select.setAttribute("style", "text-align: left; font-size: " + this.fieldFontSize + "px; width : " + chw + "px; height : " + this.h + "px; left: " + chx + "px; border-color: #7a8a99; border-width: 1.5px; border-style: solid; background-color: #eeeeee;");
    this.select.selectedIndex = this.indexValue;

    // register the control value
    evaluator.setVariable(this.id, parseFloat(fieldValue));
  }

  /**
   * Update the menu
   */
  descartesJS.Menu.prototype.update = function() { 
    evaluator = this.evaluator;

    // check if the control is active and visible
    this.activeIfValue = (evaluator.evalExpression(this.activeif) > 0);
    this.drawIfValue = (evaluator.evalExpression(this.drawif) > 0);

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

    // update the position and size
    this.updatePositionAndSize();
    
    // update the value of the menu
    this.value = evaluator.getVariable(this.id);
    this.field.value = this.formatOutputValue(this.value);
    
    // register the control value
    evaluator.setVariable(this.id, parseFloat(this.value));
    this.select.selectedIndex = parseFloat(this.getIndex(this.value));
 }

  /**
   * Get the selected index
   * @param {String} val the value to find the index
   * @return {Number} return the index asociated to the value
   */
  descartesJS.Menu.prototype.getIndex = function(val) {
    val = parseFloat( (val.toString()).replace(this.parent.decimal_symbol, ".") );
    tempInd = -1;
    diff = Infinity;
    
    for (var i=0, l=this.strValue.length; i<l; i++) {
      rest = MathAbs( val - parseFloat( this.evaluator.evalExpression(this.strValue[i])) );
      
      if (rest <= diff) {
        diff = rest;
        tempInd = i;
      }
    }
        
    return tempInd;
  }
  
  /**
   * Format the value with the number of decimals, the exponential representation and the decimal symbol
   * @param {String} value tha value to format
   * @return {String} return the value with the format applyed
   */
  descartesJS.Menu.prototype.formatOutputValue = function(value) {
    resultValue = value+"";

    decimals = this.evaluator.evalExpression(this.decimals);

    indexDot = resultValue.indexOf(".");
    if ( indexDot != -1 ) {
      subS = resultValue.substring(indexDot+1);
      if (subS.length > decimals) {
        resultValue = parseFloat(resultValue).toFixed(decimals);
      }
    }
    
    if (this.fixed) {
      resultValue = parseFloat(value).toFixed(decimals);
    }
    
    if (this.exponentialif) {
      resultValue = resultValue.toExponential(decimals);
      resultValue = resultValue.toUpperCase();
      resultValue = resultValue.replace("+", "")
    }

    resultValue = resultValue.replace(".", this.parent.decimal_symbol);
    return resultValue;
  }

  /**
   * Change the menu value
   */
  descartesJS.Menu.prototype.changeValue = function() {
    if (this.activeIfValue) {
      // register the control value
      this.evaluator.setVariable(this.id, this.value);

      this.updateAndExecAction();
    }
  }

  /**
   * Register the mouse and touch events
   */
  descartesJS.Menu.prototype.registerMouseAndTouchEvents = function() {
    hasTouchSupport = descartesJS.hasTouchSupport;

    var self = this;

    // prevent the context menu display
    self.select.oncontextmenu = self.label.oncontextmenu = self.field.oncontextmenu = function() { return false; };

    if (hasTouchSupport) {
      self.label.addEventListener("touchstart", function (evt) { evt.preventDefault(); return false; })
    } 
    else {
      self.label.addEventListener("mousedown", function (evt) { evt.preventDefault(); return false; })
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onChangeSelect(evt) {
      self.value = self.evaluator.evalExpression( self.strValue[this.selectedIndex] );
      self.field.value = self.formatOutputValue(self.value);
      self.evaluator.setVariable(self.id, self.field.value);
      
      self.changeValue();
      
      evt.preventDefault();
    }
    this.select.addEventListener("change", onChangeSelect, false);
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onKeyDown_TextField(evt) {
      // responds to enter
      if (evt.keyCode == 13) {
        self.indexValue = self.getIndex(self.field.value);

        self.value = self.evaluator.evalExpression( self.strValue[self.indexValue] );
        self.field.value = self.formatOutputValue(self.indexValue);
        self.select.selectedIndex = self.indexValue;
        
        self.changeValue();
      }
    }
    this.field.addEventListener("keydown", onKeyDown_TextField, false);
  }

  return descartesJS;
})(descartesJS || {});