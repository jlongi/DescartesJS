/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una matriz de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la matriz
   */
  descartesJS.Matrix = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Auxiliary.call(this, parent, values);

    var evaluator = this.evaluator;

    // se parsea la expresion
    this.expresion = this.splitInstructions(evaluator.parser, this.expresion);

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
  // se crea la herencia de Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Matrix, descartesJS.Auxiliary);

  /**
   * Actualiza la matriz
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

    // evaluator.setVariable(this.id + ".filas", evaluator.evalExpression(this.rows));
    // evaluator.setVariable(this.id + ".columnas", evaluator.evalExpression(this.columns));
        
    for(var i=0, l=this.expresion.length; i<l; i++) {
      evaluator.evalExpression(this.expresion[i]);
    }
  }

  return descartesJS;
})(descartesJS || {});