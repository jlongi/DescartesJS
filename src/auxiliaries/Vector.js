/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes vector
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Vector = function(parent, values) {
    var evaluator = parent.evaluator;
    var parser = evaluator.parser;

    /**
     * number of elements of the vector
     * type {Node}
     * @private
     */
    this.size = parser.parse("3");

    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);
    
    this.expresion = this.expresion.split(";");
    
    var response;
    // if has an asociate file then read it
    if (this.file) {
      // if the vector is embedded in the page
      var vectorElement = document.getElementById(this.file);
      if ((vectorElement) && (vectorElement.type == "descartes/vectorFile")) {
        response = vectorElement.text;
        
        if (response[0] == '\n') {
          response = response.substring(1);
        }
      }
      // read the vector data from a file
      else {
        response = descartesJS.openExternalFile(this.file);
      }
      
      // if the reading info has content, split the content
      if (response != null) {
        response = response.split("\n");
      }
        
      // if the file has no content or could not be read
      if ( (response == null) || ((response.length == 1) && (response[0] == "")) ) {
        response = [];
        this.size = 0;
      }
      // if the file has content and could be read
      else {
        this.expresion = [];
        this.size = null;
      }
        
      var tmpImg;
      var nonEmptyValuesIndex = 0;
      var regExpImage = /[\w-//]*(\.png|\.jpg|\.gif|\.svg|\.PNG|\.JPG|\.GIF|\.SVG)/g;

      for(var i=0, l=response.length; i<l; i++) {
        if (response[i].match(/./)) {
          this.expresion[nonEmptyValuesIndex] = this.id + "[" + nonEmptyValuesIndex + "]=" + response[i];
          nonEmptyValuesIndex++;
          
          // if the value has a reference to a imagen, then preload it
          tmpImg = response[i].match(regExpImage);
          if (tmpImg) {
            this.parent.getImage(tmpImg);
          }
        }
      }
      
      if (this.size === null) {
        this.size = parser.parse( this.expresion.length + "" );
      }
      
    }

    var tmpExp;
    // parse the elements of the expression
    for(var i=0, l=this.expresion.length; i<l; i++) {
      tmpExp = parser.parse(this.expresion[i], true);
      
      // if the expression is not an assignment
      if ((tmpExp) && (tmpExp.type != "asign")) {
        tmpExp = parser.parse( this.id + "[" + i + "]=" + this.expresion[i], true );
      }

      this.expresion[i] = tmpExp;
    }

    var vectInit = [];
    for (var i=0, l=evaluator.evalExpression(this.size); i<l; i++) {
      vectInit.push(0);
    }
    evaluator.vectors[this.id] = vectInit;
    
    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Vector, descartesJS.Auxiliary);

  /**
   * Update the vector
   */
  descartesJS.Vector.prototype.update = function() {
    var evaluator = this.evaluator;

    evaluator.setVariable(this.id + ".long", evaluator.evalExpression(this.size));

    for(var i=0, l=this.expresion.length; i<l; i++) {
      evaluator.evalExpression(this.expresion[i]);
    }
  }

  return descartesJS;
})(descartesJS || {});