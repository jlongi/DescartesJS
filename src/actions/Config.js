/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class Config extends descartesJS.Action {
    /**
     * Descartes config action
     * @param {DescartesApp} parent the Descartes application
     * @param {String} parameter the values of the action
     */
    constructor(parent, parameter) {
      super(parent, parameter);
    }

    /**
     * Execute the action
     */
    execute() {
      if (this.parent.editor) {
        this.parent.editor.show();
      }
      else {
        var codeWindow = window.open("about:blank", "_blank", "width=800px,height=600px,location=no,menubar=no,scrollbars=yes")
        codeWindow.document.write("<xmp style='width:100%;height:100%;'><script type='text/javascript' src='http://arquimedes.matem.unam.mx/Descartes5/lib/descartes-min.js'></script>" + (this.parent.applet.outerHTML.replace(/<applet/g, "<ajs").replace(/<\/applet/g, "</ajs")) + "</xmp>");
      }
      
    }
  }

  descartesJS.Config = Config;
  return descartesJS;
})(descartesJS || {});
