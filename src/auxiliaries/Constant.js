/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class Constant extends descartesJS.Auxiliary {
    /**
     * Descartes constant
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the auxiliary
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);
      
      this.expresion = this.evaluator.parser.parse(this.expresion);
      this.update();
    }
    
    /**
     * Update constant
     */
    update() {
      this.evaluator.setVariable(this.id, this.evaluator.eval(this.expresion));
    }
  }

  descartesJS.Constant = Constant;
  return descartesJS;
})(descartesJS || {});
