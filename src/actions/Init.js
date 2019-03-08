/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class Init extends descartesJS.Action {
    /**
     * Descartes init action
     * @param {DescartesApp} parent the Descartes application
     * @param {String} parameter the values of the action
     */
    constructor(parent, parameter) {
      super(parent, parameter);
    }
    
    /**
     * Execute the action
     */
    execute() {
      this.parent.init();
    }
  }

  descartesJS.Init = Init;
  return descartesJS;
})(descartesJS || {});
