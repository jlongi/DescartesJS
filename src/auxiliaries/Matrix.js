/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var parser;
  var rows;
  var cols;
  var mat;

  class Matrix extends descartesJS.Auxiliary {
    /**
     * Descartes matrix
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the auxiliary
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      evaluator = parent.evaluator;
      parser = evaluator.parser;

      this.rows = this.rows || parser.parse("3");
      this.columns = this.columns || parser.parse("3");

      // parse the expression
      this.expresion = this.splitInstructions(parser, this.expresion);

      rows = evaluator.eval(this.rows);
      cols = evaluator.eval(this.columns);

      mat = [];
      mat.type = "matrix";
      
      for (var j=0, k=cols; j<k; j++) {
        mat[j] = (Array(rows)).fill(0);
      }
      evaluator.matrices[this.id] = mat;
      
      this.update();
    }

    /**
     * Update the matrix
     */
    update() {
      evaluator = this.evaluator;
      rows = evaluator.eval(this.rows);
      cols = evaluator.eval(this.columns);

      evaluator.setVariable(this.id + ".filas", rows);
      evaluator.setVariable(this.id + ".columnas", cols);

      mat = evaluator.matrices[this.id];
      mat.rows = rows;
      mat.cols = cols;

      for(var i=0, l=this.expresion.length; i<l; i++) {
        evaluator.eval(this.expresion[i]);
      }
    }
  }

  descartesJS.Matrix = Matrix;
  return descartesJS;
})(descartesJS || {});
