/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * Descartes action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.Action = function(parent, parameter) {
    /**
     * Descartes application
     * type {DescartesApp}
     * @private
     */
    this.parent = parent;

    this.evaluator = this.parent.evaluator;
  }  
  
  /**
   * Execute the action
   */
  descartesJS.Action.prototype.execute = function() { }
  
  return descartesJS;
})(descartesJS || {});