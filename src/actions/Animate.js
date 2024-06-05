/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class Animate extends descartesJS.Action {
    /**
     * Descartes animate action
     * @param {DescartesApp} parent the Descartes application
     */
    constructor(parent) {
      super(parent);
    }

    /**
     * Execute the action
     */
    execute() {
      this.parent.play();
    }
  }

  descartesJS.Animate = Animate;
  return descartesJS;
})(descartesJS || {});
