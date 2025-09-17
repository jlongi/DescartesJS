/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class PlayAudio {
    /**
     * Descartes play audio action
     * @param {DescartesApp} parent the Descartes application
     * @param {String} parameter the values of the action
     */
    constructor(parent, parameter="") {
      this.parent = parent;
    
      const match_audio = parameter.match(/[\w\.\-//]*(\.ogg|\.oga|\.mp3|\.wav)/gi);
      if (match_audio) {
        this.filename = this.parent.evaluator.parser.parse(`'${match_audio}'`);
      }
      else {
        // if the parameter inits with braces [], extract the expression
        if ((/^\[.*\]$/).test(parameter)) {
          parameter = parameter.slice(1, -1);
        }
        this.filename = this.parent.evaluator.parser.parse(parameter);
      }
    }
    
    /**
     * Execute the action
     */
    execute() {
      const theAudio = this.parent.getAudio( this.parent.evaluator.eval(this.filename) );

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
