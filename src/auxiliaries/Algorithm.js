/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let max_ite;
  let evaluator;

  class Algorithm extends descartesJS.Auxiliary {
    /**
     * Descartes algorithm
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the auxiliary
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      descartesJS.parseExpr(this, this, this.evaluator.parser);
    }

    // create the function to exec when the algorithm evaluates
    algorithmExec() {
      let ite = 0;

      evaluator = this.evaluator;
      max_ite = evaluator.getVariable("_NUM_MAX_ITE_ALG_") || 100000;

      for (let expr of this.init) {
        evaluator.eval(expr);
      }

      do {
        for (let expr of this.doExpr) {
          evaluator.eval(expr);
        }

        if (++ite > max_ite) {
          console.warn(`se ha excedido el límite de ${max_ite} repeticiones en el algoritmo «${this.name}»`);
          return 0;
        }
      }
      while (evaluator.eval(this.whileExpr) > 0);
    }
    
    /**
     * Update the algorithm
     */
    update() {
      this.algorithmExec();
      
      if (this.evaluate === "onlyOnce") {
        this.update = ()=>{};
      }
    }
  }

  descartesJS.Algorithm = Algorithm;
  return descartesJS;
})(descartesJS || {});
