/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var regExpAudio = /[\w\.\-//]*(\.ogg|\.oga|\.mp3|\.wav)/gi;

  /**
   * Descartes play audio action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.PlayAudio = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);
   
    parameter = parameter || '';
    if (parameter.match(regExpAudio)) {
      this.filenameExpr = this.evaluator.parser.parse("'" + parameter.match(regExpAudio) + "'");
    }
    else {
      // if the parameter inits with braces [], extract the expression
      if ( (parameter !== '') && (parameter.charAt(0) === '[') && (parameter.charAt(parameter.length-1) === ']') ) {
        parameter = parameter.substring(1, parameter.length-1);
      }
      this.filenameExpr = this.evaluator.parser.parse(parameter);
    }
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.PlayAudio, descartesJS.Action);
  
  /**
   * Execute the action
   */
  descartesJS.PlayAudio.prototype.execute = function() {
    this.theAudio = this.parent.getAudio( this.evaluator.eval(this.filenameExpr) );

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
