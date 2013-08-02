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
  var decimals;
  var indexDot;
  var value;
  var limInf;
  var limSup;
  var cond1;
  var cond2;
  var cond3;
  var cond4;
  var answer_i_0;
  var answer_i_1;
  var tmpValue;
  var tmpAnswer;
  var regExpPattern;
  var answerValue;
  var evalMin;
  var evalMax;

  var hasTouchSupport;

  /**
   * Descartes text field control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the text field control
   */
  descartesJS.TextField = function(parent, values){
    // call the parent constructor
    descartesJS.Control.call(this, parent, values);
    
    if (this.valueExprString === undefined) {
      if (this.onlyText) {
        this.valueExprString = '0';
      }
      else {
        this.valueExprString = "";
      }
    }

    // an empty string
    this.emptyString = false;

    // the evaluation of the control
    this.ok = 0;
    
    // tabular index
    this.tabindex = ++this.parent.tabindex;

    // if the answer exist
    if (this.answer) {
      // the answer is encrypted
      if (this.answer.match("krypto_")) {
        var krypt = new descartesJS.Krypto();
        this.answer = krypt.decode(this.answer.substring(7));
      }
      this.answerPattern = this.answer;

      this.answer = descartesJS.buildRegularExpresionsPatterns(this.answer, this.evaluator);

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

      this.validateValue = function(value) {
        // value = value.replace(evaluator.parent.decimal_symbol, ".");

        if ( (value == "''") || (value == "'") ) {
          return "";
        }

        if (value.match(/^'/) && value.match(/'$/)) {
          return value.substring(1,value.length-1);
        }

        return value;
      }
      this.formatOutputValue = function(value) { 
        return value.toString(); 
      }
    }
    
    // if the name is only white spaces
    if (this.name.trim() == "") {
      this.name = "";
    }

    // control container
    this.containerControl = document.createElement("div");

    // the text field
    this.field = document.createElement("input");

    // the label
    this.label = document.createElement("label");
    this.txtLabel = document.createTextNode(this.name);
    this.label.appendChild(this.txtLabel);
    
    // add the elements to the container
    this.containerControl.appendChild(this.label);
    this.containerControl.appendChild(this.field);
    
    this.addControlContainer(this.containerControl);
    
    // register the mouse and touch events
    this.registerMouseAndTouchEvents();
    
    this.init();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.TextField, descartesJS.Control);
  
  /**
   * Init the text field
   */
  descartesJS.TextField.prototype.init = function() {
    evaluator = this.evaluator;
    
    // validate the initial value
    this.value = this.validateValue( evaluator.evalExpression(this.valueExpr) );

    // get the width of the initial value to determine the width of the text field
    var fieldValue = this.formatOutputValue(this.value);

    // find the font size of the text field
    this.fieldFontSize = descartesJS.getFieldFontSize(this.h);

    var fieldValueSize = descartesJS.getTextWidth(fieldValue+"_", this.fieldFontSize+"px Arial");
    
    // widths are calculated for each element
    var labelWidth = parseInt(this.w/2);
    var minTFWidth = fieldValueSize;
    var minLabelWidth = descartesJS.getTextWidth(this.name, this.fieldFontSize+"px Arial");
    
    if (labelWidth < minLabelWidth) {
      labelWidth = minLabelWidth;
    }
    
    if (this.name == "") {
      labelWidth = 0;
    }
    
    if (this.w-labelWidth < minTFWidth) {
      labelWidth = this.w - minTFWidth;
    }
    
    if (labelWidth < 0) {
      labelWidth=0;
    }
    
    var fieldWidth = this.w - (labelWidth);
    
    this.containerControl.setAttribute("class", "DescartesTextFieldContainer");
    this.containerControl.setAttribute("style", "width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    
    this.field.setAttribute("type", "text");
    this.field.setAttribute("id", this.id+"TextField");
    this.field.setAttribute("class", "DescartesTextFieldField");
    this.field.setAttribute("style", "font-size: " + this.fieldFontSize + "px; width : " + (fieldWidth -2) + "px; height : " + (this.h-2) + "px; left: " + (labelWidth) + "px;");
    this.field.setAttribute("tabindex", this.tabindex);
    this.field.value = fieldValue;
    
    this.label.setAttribute("class", "DescartesTextFieldLabel");
    this.label.setAttribute("style", "font-size:" + this.fieldFontSize + "px; width: " + labelWidth + "px; height: " + this.h + "px; line-height: " + this.h + "px;");
    
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
  descartesJS.TextField.prototype.update = function() {
    evaluator = this.evaluator;
    
    // check if the control is active and visible
    this.activeIfValue = (evaluator.evalExpression(this.activeif) > 0);
    this.drawIfValue = (evaluator.evalExpression(this.drawif) > 0);

    // enable or disable the control
    this.field.disabled = !this.activeIfValue;
    
    // hide or show the text field control
    if (this.drawIfValue) {
      this.containerControl.style.display = "block";
    } else {
      this.containerControl.style.display = "none";
    }    
    
    // update the position and size
    this.updatePositionAndSize();
    
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

  /**
   * Validate if the value is in the range [min, max]
   * @param {String} value the value to validate
   * @return {Number} return the value like a number, 
   *                         is greater than the upper limit then return the upper limit
   *                         is less than the lower limit then return the lower limit
   */
  descartesJS.TextField.prototype.validateValue = function(value) {
    // if the value is an empty text
    if ((value === "") || (value == "''")) {
      return "";
    }
    
    evaluator = this.evaluator;
    
    resultValue = parseFloat( evaluator.evalExpression( evaluator.parser.parse(value.toString().replace(this.parent.decimal_symbol, ".")) ) );
    
    // if the value is a string that do not represent a number, parseFloat return NaN
    if (isNaN(resultValue)) {
      resultValue = 0; 
    }
    
    evalMin = evaluator.evalExpression(this.min);
    if (evalMin == "") {
      evalMin = -Math.Infinity;
    }
    evalMax = evaluator.evalExpression(this.max);
    if (evalMax == "") {
      evalMax = Math.Infinity;
    }

    if (this.discrete) {
      var incr = evaluator.evalExpression(this.incr);
      resultValue = (incr==0) ? 0 : (incr * Math.round(resultValue / incr));
    }
    
    resultValue = parseFloat(parseFloat(resultValue).toFixed(evaluator.evalExpression(this.decimals)));
    
    return resultValue;    
  }
  
  /**
   * Format the value with the number of decimals, the exponential representation and the decimal symbol
   * @param {String} value tha value to format
   * @return {String} return the value with the format applyed
   */
  descartesJS.TextField.prototype.formatOutputValue = function(value) {
    if (value === "") {
      return "";
    }

    // call the draw function of the father (uber instead of super as it is reserved word)
    return this.uber.formatOutputValue.call(this, value);
  }

  /**
   * Change the text field value
   * @param {String} value is the new value to update the text field
   * @param {Boolean} update is a condition to update the parent or not
   */
  descartesJS.TextField.prototype.changeValue = function(value, update) {
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
  descartesJS.TextField.prototype.evaluateAnswer = function() {
    return descartesJS.esCorrecto(this.answer, this.value, this.evaluator, this.answer);
  }
  
  /**
   * @return 
   */
  descartesJS.TextField.prototype.getFirstAnswer = function() {
    // if the text field has an answer pattern
    if (this.answer) {
      // if the text field is only text
      if (this.onlyText) {
        return this.firstAnswer;
      }
      // if the text field is numeric
      else {
        return this.evaluator.evalExpression(this.firstAnswer);
      }
    }
    // if the text field has not an anser pattern
    else {
      return "";
    }
  }  
    
  /**
   * Register the mouse and touch events
   */
  descartesJS.TextField.prototype.registerMouseAndTouchEvents = function() {
    hasTouchSupport = descartesJS.hasTouchSupport;

    var self = this;    

    // prevent the context menu display
    self.label.oncontextmenu = function() { return false; };
    // prevent the default events int the label    
    if (hasTouchSupport) {
      self.label.addEventListener("touchstart", function (evt) { evt.preventDefault(); return false; });
    } 
    else {
      self.label.addEventListener("mousedown", function (evt) { evt.preventDefault(); return false; });
    }

    /**
     * 
     * @param {Event} evt
     * @private
     */
    function onBlur_textField(evt) {
      // self.update();
      self.changeValue(self.field.value, true);
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
  }
  
  return descartesJS;
})(descartesJS || {});