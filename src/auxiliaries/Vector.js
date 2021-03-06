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

  class Vector extends descartesJS.Auxiliary {
    /**
     * Descartes vector
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the auxiliary
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      evaluator = parent.evaluator;
      parser = evaluator.parser;

      /**
       * number of elements of the vector
       * type {Node}
       * @private
       */
      this.size = this.size || parser.parse("3");
      
      this.expresion = this.expresion.split(";");

      this.parseFile = parser.parse(this.file);
      
      this.update();
    }
    
    /**
     * Update the vector
     */
    update() {
      var expr = this.expresion;
      var vectorElement;
      
      evaluator = this.evaluator;
      parser = evaluator.parser;

      // if the filename is a variable
      this.oldFile = this.file;
      newFile = evaluator.eval(this.parseFile);
      if (newFile) {
        this.file = newFile;
      }

      // if has an associate file then read it
      if (this.file) {
        // if the vector is embedded in the page
        vectorElement = document.getElementById(this.file);
        if ((vectorElement) && (vectorElement.type == "descartes/vectorFile")) {
          response = vectorElement.text;
        }
        // read the vector data from a file
        else {
          response = descartesJS.openExternalFile(this.file);
        }

        // if the read information has content, split the content
        if (response != null) {
          response = response.replace(/\r/g, "").split("\n");

          var tmpResponse = [];
          for (var i=0,l=response.length; i<l; i++) {

            if (response[i] != "") {
              tmpResponse.push( response[i] );
            }
          }
          response = tmpResponse;
        }

        // if the file has no content or could not be read
        if ( (response == null) || ((response.length == 1) && (response[0] == "")) ) {
          response = [];
          this.size = parser.parse("0");
        }
        // if the file has content and could be read
        else {
          expr = response;
          this.size = null;
        }
        
        if (this.size === null) {
          this.size = parser.parse( expr.length + "" );
        }
      }

      var tmpExp;
      var newExpression = [];
      // parse the elements of the expression
      for(var i=0, l=expr.length; i<l; i++) {
        tmpExp = parser.parse(expr[i], true);

        // if the expression is not an assignment
        if ((tmpExp) && (tmpExp.type != "assign")) {
          tmpExp = parser.parse( this.id + "[" + i + "]=" + expr[i], true );
        }

        newExpression.push( tmpExp );
      }

      var tmp_size = parseInt(Math.abs(evaluator.eval(this.size)));
      var vectInit = (Array(tmp_size)).fill(0);
      vectInit._size_ = vectInit.length;
      evaluator.vectors[this.id] = vectInit;
      evaluator.setVariable(this.id + ".long", vectInit._size_);

      for(var i=0, l=newExpression.length; i<l; i++) {
        evaluator.eval(newExpression[i]);
      }    
    }
  }

  descartesJS.Vector = Vector;
  return descartesJS;
})(descartesJS || {});
