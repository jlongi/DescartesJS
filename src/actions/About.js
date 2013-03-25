/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes about action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.About = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);

    if (!parameter) {
      this.urlAbout = window.location.href.substring(0, window.location.href.lastIndexOf("/")+1) + parameter;
    }
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.About, descartesJS.Action);

  /**
   * Execute the action
   */
  descartesJS.About.prototype.execute = function() {
    if (this.urlAbout) {
      var codeWindow = window.open(this.urlAbout, "_blank", "width=800px,height=600px,location=no,menubar=no,scrollbars=yes")
    }
    else {
      var codeWindow = window.open("about:blank", "_blank", "width=800px,height=600px,location=no,menubar=no,scrollbars=yes")
      codeWindow.document.write("<hmtl><head><title>Créditos</title></head><body><h1>Aquí van los créditos</h1></body></html>");
    }
  }

  return descartesJS;
})(descartesJS || {});