/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class Clear extends descartesJS.Action {
    /**
     * Descartes clear action
     * @param {DescartesApp} parent the Descartes application
     */
    constructor(parent) {
      super(parent);
    }

    /**
     * Execute the action
     */
    execute() {
      this.parent.clear();
    }
  }

  descartesJS.Clear = Clear;
  return descartesJS;
})(descartesJS || {});
