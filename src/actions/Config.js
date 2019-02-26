/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes config action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.Config = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Config, descartesJS.Action);

  var jsScript = "<script type='text/javascript' src='http://arquimedes.matem.unam.mx/Descartes5/lib/descartes-min.js'></script>\n";


  /**
   * Execute the action
   */
  descartesJS.Config.prototype.execute = function() {
    if (this.parent.editor) {
      this.parent.editor.show();
    }
    else {
      var codeWindow = window.open("about:blank", "_blank", "width=800px,height=600px,location=no,menubar=no,scrollbars=yes")
      codeWindow.document.write("<xmp style='width:100%; height:100%;'>" + jsScript + (this.parent.applet.outerHTML.replace(/<applet/g, "<ajs").replace(/<\/applet/g, "</ajs")) + "</xmp>");
    }
    
  }

  return descartesJS;
})(descartesJS || {});
