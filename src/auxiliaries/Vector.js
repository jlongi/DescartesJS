/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let evaluator;
  let parser;
  let newFile;
  let response;

  class Vector extends descartesJS.Auxiliary {
    /**
     * Descartes vector
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the auxiliary
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      self = this;
      parser = parent.evaluator.parser;

      /**
       * number of elements of the vector
       * type {Node}
       * @private
       */
      self.size = self.size || parser.parse("3");
      
      self.expresion = self.expresion.split(";");

      self.parseFile = parser.parse(self.file);
      
      self.update();
    }
    
    /**
     * Update the vector
     */
    update() {
      self = this;
      let expr = self.expresion;
      let vectorElement;
      
      evaluator = self.evaluator;
      parser = evaluator.parser;

      // if the filename is a variable
      self.oldFile = self.file;
      newFile = evaluator.eval(self.parseFile);
      if (newFile) {
        self.file = newFile;
      }

      // if has an associate file then read it
      if (self.file) {
        // if the file is embedded in the page
        vectorElement = document.getElementById(self.file);
        if ((vectorElement) && (vectorElement.type == "descartes/vectorFile")) {
          response = vectorElement.text;
        }
        // read the vector data from a file
        else {
          response = descartesJS.openFile(self.file);
        }

        // if the file has content, split the content
        if (response != null) {
          response = response.replace(/\r/g, "").split("\n");
          response = response.filter((response_i) => (response_i.trim() !== ""));
        }

        // if the file has no content or could not be read
        if ( (response == null) || ((response.length == 1) && (response[0] == "")) ) {
          response = [];
          self.size = parser.parse("0");
        }
        // if the file has content and could be read
        else {
          expr = response;
          self.size = null;
        }
        
        if (self.size === null) {
          self.size = parser.parse( expr.length + "" );
        }
      }

      let tmp_val;
      let tmpExp;
      let newExpression = expr.map((expr_i, i) => {
        tmpExp = parser.parse(expr_i, true);

        // if the expression is not an assignment
        if ((tmpExp) && (tmpExp.type !== "assign")) {
          tmp_val = NaN;

          if (this.parent.decimal_symbol == ",") {
            tmp_val = parseFloat(expr_i.replace(",", "."));
          }

          // if tmp_val es NaN then expr_i is a string or a variable, if not is NaN then is a number
          tmpExp = parser.parse( `${self.id}[${i}]=${(isNaN(tmp_val)) ? expr_i : tmp_val}`, true );
        }

        return tmpExp;
      });

      let vecInit = (Array(parseInt(Math.abs(evaluator.eval(self.size))))).fill(0);
      vecInit._size_ = vecInit.length;
      evaluator.vectors[self.id] = vecInit;
      evaluator.setVariable(self.id + ".long", vecInit._size_);

      for (let newExpression_i of newExpression) {
        evaluator.eval(newExpression_i);
      }    
    }
  }

  descartesJS.Vector = Vector;
  return descartesJS;
})(descartesJS || {});
