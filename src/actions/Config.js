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
  descartesJS.Config = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Config, descartesJS.Action);

  /**
   * Ejecuta la accion
   */
  descartesJS.Config.prototype.execute = function() {
    var codeWindow = window.open("about:blank", "_blank", "width=800px,height=600px,location=no,menubar=no,scrollbars=yes")
//     codeWindow.document.write("<textarea style='width:100%; height:100%;'>" + this.parent.applet.outerHTML + "</textarea>");
    codeWindow.document.write("<xmp style='width:100%; height:100%;'>" + this.parent.applet.outerHTML + "</xmp>");
  }

  return descartesJS;
})(descartesJS || {});