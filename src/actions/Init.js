/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes init action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.Init = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Init, descartesJS.Action);

  /**
   * Execute the action
   */
  descartesJS.Init.prototype.execute = function() {
    this.parent.init();
  }

  return descartesJS;
})(descartesJS || {});
