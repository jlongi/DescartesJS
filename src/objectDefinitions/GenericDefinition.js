/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes GenericDefinition
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.GenericDefinition = function(parent, values){
    this.parent = parent;
    this.evaluator = this.parent.evaluator;

    this.id = "_";

    // traverse the values to replace the defaults values of the object
    for (var propName in values) {
      // verify the own properties of the object
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }
  }

  /**
   * Update the GenericDefinition
   */
  // descartesJS.GenericDefinition.prototype.update = function() { }   

  /**
   * Draw the GenericDefinition
   */
  // descartesJS.GenericDefinition.prototype.draw = function() { }   
    
  return descartesJS;
})(descartesJS || {});