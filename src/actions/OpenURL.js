/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class OpenURL extends descartesJS.Action {
    /**
     * Descartes open URL action
     * @param {DescartesApp} parent the Descartes application
     * @param {String} parameter the values of the action
     */
    constructor(parent, parameter) {
      super(parent);

      this.parameter = parameter.trim();
      this.target = "_blank";
    }
    
    /**
     * Execute the action
     */
    execute() {
      let theParameter = this.parameter;

      if (theParameter.match(/^\[.*\]?/)) {
        theParameter = this.evaluator.eval( this.evaluator.parser.parse(theParameter.substring(1, theParameter.length-1)) );
      }

      let indexOfTarget = theParameter.indexOf("target");

      if (indexOfTarget != -1) {
        this.target = theParameter.substring(indexOfTarget);
        this.target = this.target.substring(this.target.indexOf("=")+1);
        theParameter = theParameter.substring(0, indexOfTarget-1);
      }

      // if the parameter is JavaScript code
      if (theParameter.substring(0,10) == "javascript") {
        // replace the &squot; with '
        theParameter = new descartesJS.SimpleText(this.parent, (theParameter.substring(11)).replace(/&squot;/g, "'"));

        try {
          eval(theParameter.toString());
          return;
        }
        catch(e) {}
      }
      // if the parameter is a file name
      else {
        // if the parameter is a file name relative to the current page
        if (theParameter.substring(0,4) != "http") {
          let location = (window.__dirname || window.location.href);
          theParameter = location.substring(0, location.lastIndexOf("/")+1) + theParameter;
        }

        // build an action to open a new page relative to the actual page
        window.open(theParameter, this.target);
        return;
      }
    }
  }

  descartesJS.OpenURL = OpenURL;
  return descartesJS;
})(descartesJS || {});
