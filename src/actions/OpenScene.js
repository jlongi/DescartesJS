/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class OpenScene extends descartesJS.Action {
    /**
     * Descartes open scene action
     * @param {DescartesApp} parent the Descartes application
     * @param {String} parameter the values of the action
     */
    constructor(parent, parameter = "") {
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
        theParameter = (theParameter.substring(11)).replace(/&squot;/g, "'");

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
        window.open(theParameter, this.target, `width=${this.parent.width},height=${this.parent.height},left=${(window.screen.width - this.parent.width)/2},top=${(window.screen.height - this.parent.height)/2},location=0,menubar=0,scrollbars=0,status=0,titlebar=0,toolbar=0`);
      }
    }
  }

  descartesJS.OpenScene = OpenScene;
  return descartesJS;
})(descartesJS || {});
