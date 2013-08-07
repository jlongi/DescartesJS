/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var parser;
  var newFile;
  var response;

  /**
   * Descartes vector
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Vector = function(parent, values) {
    evaluator = parent.evaluator;
    parser = evaluator.parser;

    /**
     * number of elements of the vector
     * type {Node}
     * @private
     */
    this.size = parser.parse("3");

    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);
    
    this.expresion = this.expresion.split(";");

    this.parseFile = parser.parse(this.file);
    
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
    var expresion = this.expresion;

    evaluator = this.evaluator;
    parser = evaluator.parser;

    // if the filename is a variable
    this.oldFile = this.file;
    newFile = evaluator.evalExpression(this.parseFile);
    if (newFile) {
      this.file = newFile;
    }

    var response;
    // if has an asociate file then read it
    if (this.file) {
      // if the vector is embedded in the page
      vectorElement = document.getElementById(this.file);
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

      // if the read information has content, split the content
      if (response != null) {
        response = response.replace(/\r/g, "").split("\n");
      }

      // if the file has no content or could not be read
      if ( (response == null) || ((response.length == 1) && (response[0] == "")) ) {
        response = [];
        this.size = 0;
      }
      // if the file has content and could be read
      else {
        expresion = response;
        this.size = null;
      }
      
      if (this.size === null) {
        this.size = parser.parse( expresion.length + "" );
      }
    }

    var tmpExp;
    var newExpression = [];
    // parse the elements of the expression
    for(var i=0, l=expresion.length; i<l; i++) {
      tmpExp = parser.parse(expresion[i], true);

      // if the expression is not an assignment
      if ((tmpExp) && (tmpExp.type != "asign")) {
        tmpExp = parser.parse( this.id + "[" + i + "]=" + expresion[i], true );
      }

      newExpression.push( tmpExp );
    }

    var vectInit = [];
    for (var i=0, l=evaluator.evalExpression(this.size); i<l; i++) {
      vectInit.push(0);
    }
    evaluator.vectors[this.id] = vectInit;

    evaluator.setVariable(this.id + ".long", evaluator.evalExpression(this.size));

    for(var i=0, l=newExpression.length; i<l; i++) {
      evaluator.evalExpression(newExpression[i]);
    }    
  }

  return descartesJS;
})(descartesJS || {});