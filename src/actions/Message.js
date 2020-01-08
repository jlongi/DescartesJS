/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class Message extends descartesJS.Action {
    /**
     * Descartes message action
     * @param {DescartesApp} parent the Descartes application
     * @param {String} parameter the values of the action
     */
    constructor(parent, parameter) {
      super(parent, parameter);
      this.parameter = (parameter || "").replace(/\\n/g, "\n").replace(/&squot;/g, "'");
    }

    /**
     * Execute the action
     */
    execute() {
      alert(this.parameter);
    }
  }

  descartesJS.Message = Message;
  return descartesJS;
})(descartesJS || {});
