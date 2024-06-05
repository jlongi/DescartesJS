/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class Algorithm extends descartesJS.Auxiliary {
    /**
     * Descartes algorithm
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the auxiliary
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      var evaluator = this.evaluator;
      this.parseExpressions(evaluator.parser);
      
      var self = this;
      var max_ite;

      // create the function to exec when the algorithm evaluates
      this.algorithmExec = function() {
        self.iterations = 0;
        max_ite = evaluator.getVariable("_NUM_MAX_ITE_ALG_") || 100000;

        for (var i=0, l=self.init.length; i<l; i++) {
          evaluator.eval(self.init[i]);
        }
        
        do {
          for (var i=0, l=self.doExpr.length; i<l; i++) {
            evaluator.eval(self.doExpr[i]);
          }

          if (++self.iterations > max_ite) {
            console.warn("se ha excedido el límite de " + max_ite + " repeticiones en el algoritmo << " + self.name + " >>");
            return 0;
          }
        }
        while (evaluator.eval(self.whileExpr) > 0);
      }
    }
    
    /**
     * Update the algorithm
     */
    update() {
      this.algorithmExec();
      
      if (this.evaluate === "onlyOnce") {
        this.update = function() {};
      }
    }
  }

  descartesJS.Algorithm = Algorithm;
  return descartesJS;
})(descartesJS || {});
