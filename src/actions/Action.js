/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * Una accion de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen una accion de descartes
   */
  descartesJS.Action = function(parent, parameter) {
    /**
     * La aplicacion de descartes a la que corresponde la accion
     * type DescartesApp
     * @private
     */
    this.parent = parent;
    this.evaluator = this.parent.evaluator;
  }  
  
  /**
   * Ejecuta la accion
   */
  descartesJS.Action.prototype.execute = function() { }
  
  return descartesJS;
})(descartesJS || {});