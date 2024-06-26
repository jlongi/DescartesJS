/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var regExpAudio = /[\w\.\-//]*(\.ogg|\.oga|\.mp3|\.wav)/gi;

  class PlayAudio extends descartesJS.Action {
    /**
     * Descartes play audio action
     * @param {DescartesApp} parent the Descartes application
     * @param {String} parameter the values of the action
     */
    constructor(parent, parameter = "") {
      super(parent);
    
      if (parameter.match(regExpAudio)) {
        this.filename = this.evaluator.parser.parse(`'${parameter.match(regExpAudio)}'`);
      }
      else {
        // if the parameter inits with braces [], extract the expression
        if (parameter.match(/^\[.*\]?/)) {
          parameter = parameter.substring(1, parameter.length-1);
        }
        this.filename = this.evaluator.parser.parse(parameter);
      }
    }
    
    /**
     * Execute the action
     */
    execute() {
      var theAudio = this.theAudio = this.parent.getAudio( this.evaluator.eval(this.filename) );

      // if the audio is paused then play it
      if (theAudio.paused) {
        theAudio.play();
      }
      // if the audio is playing then stop it
      else {
        theAudio.pause();
        theAudio.currentTime = 0;
      }
    }
  }

  descartesJS.PlayAudio = PlayAudio;
  return descartesJS;
})(descartesJS || {});
