/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class Action {
    /**
     * Descartes action
     * @param {DescartesApp} parent the Descartes application
     */
    constructor(parent) {
      this.parent = parent;
      this.evaluator = this.parent.evaluator;
    }  
    
    /**
     * Execute the action
     */
    execute() { }
  }

  descartesJS.Action = Action;
  return descartesJS;
})(descartesJS || {});
