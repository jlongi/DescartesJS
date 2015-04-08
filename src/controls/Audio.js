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

    this.oldDrawIf = 0;

    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    var self = this;

    // the audio position and size
    var expr = self.evaluator.evalExpression(self.expresion);
    if (expr[0].length == 4) {
      self.w = expr[0][2];
      self.h = expr[0][3];
    } else {
      self.w = 200;
      self.h = 28;
    }
    
    self.audio = self.parent.getAudio(self.file);

    if (self.autoplay) {
      self.audio.setAttribute("autoplay", "autoplay");
      self.audio.play();
    }
    
    if (self.loop) {
      self.audio.setAttribute("loop", "loop");
    }

    if (self.controls) {
      self.audio.setAttribute("controls", "controls");
    }

    self.audio.setAttribute("style", "position: absolute; width: " + self.w + "px; left: " + self.x + "px; top: " + self.y + "px; z-index: " + self.zIndex + ";");

    self.addControlContainer(self.audio);

    //
    self.evaluator.setFunction(self.id + ".play", function() {
      self.audio.play();
      return 0;
    });
    self.evaluator.setFunction(self.id + ".pause", function() {
      self.audio.pause();
      return 0;
    });
    self.evaluator.setFunction(self.id + ".stop", function() {
      self.audio.pause();
      self.audio.currentTime = 0.0;
      return 0;
    });
    self.evaluator.setFunction(self.id + ".currentTime", function(time) {
      self.audio.currentTime = parseFloat(time);
      return 0;
    });
    self.audio.addEventListener("timeupdate", function(evt) {
      self.evaluator.setVariable(self.id + ".currentTime", self.audio.currentTime);
      // self.parent.update();
    });
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

  var drawif;
  /**
   * Update the audio control
   */
  descartesJS.Audio.prototype.update = function() {
    evaluator = this.evaluator;

    drawif = evaluator.evalExpression(this.drawif) > 0
    
    // hide or show the audio control
    if (drawif) {
      this.audio.style.display = "block";
    } else {
      this.audio.style.display = "none";

      if (drawif !== this.oldDrawIf) {
        this.audio.pause();
      }
    }    

    this.oldDrawIf = drawif;

    // update the position and size
    this.updatePositionAndSize();
  }
  
  return descartesJS;
})(descartesJS || {});