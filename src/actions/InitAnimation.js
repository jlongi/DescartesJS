/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class InitAnimation {
    /**
     * Descartes init animation action
     * @param {DescartesApp} parent the Descartes application
     */
    constructor(parent) {
      this.parent = parent;
    }
    
    /**
     * Execute the action
     */
    execute() {
      this.parent.reinitAnimation();
    }
  }

  descartesJS.InitAnimation = InitAnimation;
  return descartesJS;
})(descartesJS || {});
