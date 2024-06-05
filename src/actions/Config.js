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
     */
    constructor(parent) {
      super(parent);
    }

    /**
     * Execute the action
     */
    execute() {
      if (this.parent.editor) {
        this.parent.editor.show();
      }
      else {
        window.open("about:blank", "_blank", "width=800px,height=600px,location=no,menubar=no,scrollbars=yes").document.write("<xmp style='width:100%;height:100%;'>" + (this.parent.applet.outerHTML.replace(/<applet/g, "<ajs").replace(/<\/applet/g, "</ajs")) + "</xmp>");
      }
    }
  }

  descartesJS.Config = Config;
  return descartesJS;
})(descartesJS || {});
