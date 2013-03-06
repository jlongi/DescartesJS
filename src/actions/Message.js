/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una accion de mostrar el contenido de una leccion de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el parametro de la accion
   */
  descartesJS.Message = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
    
    this.parameter = parameter;
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Message, descartesJS.Action);

  /**
   * Ejecuta la accion
   */
  descartesJS.Message.prototype.execute = function() {
    alert(this.parameter);
  }

  return descartesJS;
})(descartesJS || {});