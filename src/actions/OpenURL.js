/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class OpenURL {
    /**
     * Descartes open URL action
     * @param {DescartesApp} parent the Descartes application
     * @param {String} parameter the values of the action
     */
    constructor(parent, parameter="") {
      this.parent = parent;
      this.param = parameter.trim();
      this.target = "_blank";
    }
    
    /**
     * Execute the action
     */
    execute(param_window="") {
      let theParameter = this.param;

      // the parameter has a target
      let split_parameter = (theParameter).match(/^(.*)\s*target=(.*)/);
      if (split_parameter) {
        theParameter = split_parameter[1].trim();
        this.target  = split_parameter[2].trim();
      }

      // the parameter direction is an expression
      if ((/^\[.*\]$/).test(theParameter)) {
        theParameter = this.parent.evaluator.eval( this.parent.evaluator.parser.parse(theParameter.slice(1, -1)) );
      }

      // if the parameter is JavaScript code
      split_parameter = (theParameter).match(/^javascript:(.*)$/);
      if (split_parameter) {
        // replace the &squot; with '
        theParameter = new descartesJS.SimpleText(this.parent, (split_parameter[1]).replace(/&squot;/g, "'"));

        try {
          (new Function(theParameter.toString()))();
          return;
        }
        catch(e) {}
      }
      // if the parameter is a file name
      else {
        // if the parameter is a file name relative to the current page
        if (!(/^(http|www)/).test(theParameter)) {
          let location = (window.__dirname || window.location.href);
          theParameter = location.substring(0, location.lastIndexOf("/")+1) + theParameter;
        }
        if (theParameter.startsWith("www.")) {
          theParameter = "https://" + theParameter;
        }

        // build an action to open a new page relative to the actual page
        window.open(theParameter, this.target, param_window);
        return;
      }
    }
  }

  class OpenScene extends OpenURL {
    /**
     * Descartes open OpenScene action
     * @param {DescartesApp} parent the Descartes application
     * @param {String} parameter the values of the action
     */
    constructor(parent, parameter="") {
      super(parent, parameter);
    }
    execute() {
      super.execute(`width=${this.parent.width},height=${this.parent.height},left=${(window.screen.width - this.parent.width)/2},top=${(window.screen.height - this.parent.height)/2},location=0,menubar=0,scrollbars=0,status=0,titlebar=0,toolbar=0`);
    }
  }

  descartesJS.OpenURL = OpenURL;
  descartesJS.OpenScene = OpenScene;
  return descartesJS;
})(descartesJS || {});
