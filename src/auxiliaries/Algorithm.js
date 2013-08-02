/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes algorithm
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Algorithm = function(parent, values){
    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);

    var evaluator = this.evaluator;
    this.parseExpressions(evaluator.parser);
    
    // create the function to exec when the algorithm evaluates
    this.algorithmExec = function() {
      this.iterations = 0;

      for (var i=0, l=this.init.length; i<l; i++) {
        evaluator.evalExpression(this.init[i]);
      }
      
      do {
        for (var i=0, l=this.doExpr.length; i<l; i++) {
          evaluator.evalExpression(this.doExpr[i]);
        }

        if (++this.iterations > 100000) {
          console.log("se ha excedido el límite de 100000 repeticiones en el algoritmo", this.id);
          return 0;
        }
      }
      while (evaluator.evalExpression(this.whileExpr) > 0);
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Algorithm, descartesJS.Auxiliary);

  /**
   * Update the algorithm
   */
  descartesJS.Algorithm.prototype.update = function() {
    this.algorithmExec();
    
    if (this.evaluate === "onlyOnce") {
      this.update = function() {};
    }
  }

  return descartesJS;
})(descartesJS || {});