/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes openscene action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.OpenScene = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
    
    this.parameter = parameter;
    this.target = "_blank";
    
    var indexOfTarget = this.parameter.indexOf("target");
    
    if (indexOfTarget != -1) {
      this.target = this.parameter.substring(indexOfTarget);
      this.target = this.target.substring(this.target.indexOf("=")+1);
      this.parameter = this.parameter.substring(0, indexOfTarget-1);
    }

    // if the parameter is JavaScript code
    if (this.parameter.substring(0,10) == "javascript") {
      // replace the &squot; with '
      this.parameter = (this.parameter.substring(11)).replace(/&squot;/g, "'");
      
      this.actionExec = function() {
        eval(this.parameter);
      }
    } 

    // if the paramater is a file name
    else {
      // if the parameter is a file name relative to the current page
      if (this.parameter.substring(0,7) != "http://") {
        var location = window.__dirname || window.location.href;
        this.parameter = location.substring(0, location.lastIndexOf("/")+1) + this.parameter;
      }
 
      // build an action to open a new page relative to the actual page
      this.actionExec = function() {
        window.open(this.parameter, this.target, "width=" + this.parent.width + ",height=" + this.parent.height + ",left=" + (window.screen.width - this.parent.width)/2 + ", top=" + (window.screen.height - this.parent.height)/2 + "location=0,menubar=0,scrollbars=0,status=0,titlebar=0,toolbar=0");
      }
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.OpenScene, descartesJS.Action);

  /**
   * Execute the action
   */
  descartesJS.OpenScene.prototype.execute = function() {
    this.actionExec();
  }

  return descartesJS;
})(descartesJS || {});