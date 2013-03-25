/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes play audio action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.PlayAudio = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
    
    this.filenameExpr = (parameter) ? this.evaluator.parser.parse("'" + parameter.split(" ")[0].trim() + "'") : "";
    this.filename = this.evaluator.evalExpression(this.filenameExpr);
    this.theAudio = parent.getAudio(this.filename);
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.PlayAudio, descartesJS.Action);
  
  var theAudio;
  /**
   * Execute the action
   */
  descartesJS.PlayAudio.prototype.execute = function() {
    // this.filename = this.evaluator.evalExpression(this.filenameExpr);
    // var theAudio = this.parent.getAudio(this.filename);

    var theAudio = this.theAudio;

    // if the audio is paused then play it
    if (theAudio.paused) {
      theAudio.play();
    }
    // if the audio is playing then stop it
    else {
      theAudio.pause();
      theAudio.currentTime = 0.0;
    }
  }

  return descartesJS;
})(descartesJS || {});