/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes message action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.Message = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
    
    this.parameter = (parameter || "").replace(/\\n/g, "\n").replace(/&squot;/g, "'");
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Message, descartesJS.Action);

  /**
   * Execute the action
   */
  descartesJS.Message.prototype.execute = function() {
    alert(this.parameter);
  }

  return descartesJS;
})(descartesJS || {});
