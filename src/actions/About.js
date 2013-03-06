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
  descartesJS.About = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
    this.urlAbout = null;
    if (parameter != "") {
      this.urlAbout = window.location.href.substring(0, window.location.href.lastIndexOf("/")+1) + parameter;
    }
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.About, descartesJS.Action);

  /**
   * Ejecuta la accion
   */
  descartesJS.About.prototype.execute = function() {
    console.log(this.urlAbout)
    
    if (this.urlAbout) {
      var codeWindow = window.open(this.urlAbout, "_blank", "width=800px,height=600px,location=no,menubar=no,scrollbars=yes")
    }
    else {
      var codeWindow = window.open("about:blank", "_blank", "width=800px,height=600px,location=no,menubar=no,scrollbars=yes")
//     codeWindow.document.write("<textarea style='width:100%; height:100%;'>" + this.parent.applet.outerHTML + "</textarea>");
      codeWindow.document.write("<hmtl><head><title>Créditos</title></head><body><h1>Aquí van los créditos</h1></body></html>");
    }
  }

  return descartesJS;
})(descartesJS || {});