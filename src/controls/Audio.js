/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;

  /**
   * Descartes audio control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the audio control
   */
  descartesJS.Audio = function(parent, values) {
    /**
     * condition to show the controls
     * type {Boolean}
     * @private
     */
    this.controls = true;

    this.file = "";

    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    // the audio position and size
    var expr = this.evaluator.evalExpression(this.expresion);
    if (expr[0].length == 4) {
      this.w = expr[0][2];
      this.h = expr[0][3];
    } else {
      this.w = 100;
      this.h = 28;
    }
    
    this.audio = this.parent.getAudio(this.file);

    if (this.autoplay) {
      this.audio.setAttribute("autoplay", "autoplay");
      this.audio.play();
    }
    
    if (this.loop) {
      this.audio.setAttribute("loop", "loop");
    }

    if (this.controls) {
      this.audio.setAttribute("controls", "controls");
    }

    this.audio.setAttribute("style", "position: absolute; width: " + this.w + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");

    this.addControlContainer(this.audio);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Audio, descartesJS.Control);

  /**
   * Init the audio
   */
  descartesJS.Audio.prototype.init = function() {
    // this.audio.setAttribute("width", this.w);
    // this.audio.setAttribute("height", this.h);
    this.audio.style.left = this.x + "px";
    this.audio.style.top  = this.y + "px";

    this.update();
  }

  /**
   * Update the audio control
   */
  descartesJS.Audio.prototype.update = function() {
    evaluator = this.evaluator;
    
    // hide or show the audio control
    if (evaluator.evalExpression(this.drawif) > 0) {
      this.audio.style.display = "block";
    } else {
      this.audio.style.display = "none";
      this.audio.pause();
    }    

    // update the position and size
    this.updatePositionAndSize();
  }
  
  return descartesJS;
})(descartesJS || {});