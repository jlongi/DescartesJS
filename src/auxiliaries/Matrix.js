/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes matrix
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Matrix = function(parent, values){
    var evaluator = parent.evaluator;
    var parser = evaluator.parser;

    /**
     * number of rows of a matrix
     * type {Node}
     * @private
     */
    this.rows = parser.parse("3");

    /**
     * number of columns of a matrix
     * type {Node}
     * @private
     */
    this.columns = parser.parse("3");

    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);

    // parse the expression
    this.expresion = this.splitInstructions(parser, this.expresion);

    var rows = evaluator.evalExpression(this.rows);
    var cols = evaluator.evalExpression(this.columns);

    var mat = [];
    mat.type = "matrix";
    
    var vectInit;
    for (var j=0, k=cols; j<k; j++) {
      vectInit = [];
      for (var i=0, l=rows; i<l; i++) {
        vectInit.push(0);
      }
      mat[j] = vectInit;
    }
    evaluator.matrices[this.id] = mat;
    
    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Matrix, descartesJS.Auxiliary);

  /**
   * Update the matrix
   */
  descartesJS.Matrix.prototype.update = function() {
    var evaluator = this.evaluator;
    var rows = evaluator.evalExpression(this.rows);
    var cols = evaluator.evalExpression(this.columns);

    evaluator.setVariable(this.id + ".filas", rows);
    evaluator.setVariable(this.id + ".columnas", cols);

    var mat = evaluator.matrices[this.id];
    mat.rows = rows;
    mat.cols = cols;

    for(var i=0, l=this.expresion.length; i<l; i++) {
      evaluator.evalExpression(this.expresion[i]);
    }
  }

  return descartesJS;
})(descartesJS || {});