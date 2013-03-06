/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un algoritmo de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el algoritmo
   */
  descartesJS.Algorithm = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Auxiliary.call(this, parent, values);

    var tmp;
    var evaluator = this.evaluator;
    var parser = evaluator.parser;

    // se parsea la expresion init
    this.init = this.splitInstructions(parser, this.init);

    // se parsea la expresion doExpr
    this.doExpr = this.splitInstructions(parser, this.doExpr);
    
    // se parsea la expresion de while
    if (this.whileExpr) {
      this.whileExpr = parser.parse(this.whileExpr);
    }
    
    // se crea la funcion a ejecutar en cada evaluacion del algoritmo
    this.algorithmExec = function() {
      for (var i=0, l=this.init.length; i<l; i++) {
        evaluator.evalExpression(this.init[i]);
      }
      
      do {
        for (var i=0, l=this.doExpr.length; i<l; i++) {
          evaluator.evalExpression(this.doExpr[i]);
        }
      }
      while (evaluator.evalExpression(this.whileExpr) > 0);
    }

//     this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Algorithm, descartesJS.Auxiliary);

  /**
   * Actualiza el algoritmo
   */
  descartesJS.Algorithm.prototype.update = function() {
    this.algorithmExec();
    
// //     if ((this.evaluate) && (this.evaluate == "onlyOnce")) {
    if (this.evaluate == "onlyOnce") {
      this.update = function() {};
    }
  }

  return descartesJS;
})(descartesJS || {});