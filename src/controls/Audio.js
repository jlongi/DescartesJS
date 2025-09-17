/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let evaluator;
  let tmpFile;
  let drawif;

  class Audio extends descartesJS.Control {
    /**
     * Descartes audio control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the audio control
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);
      
      let self = this;

      self.controls = values.controls || true;
      self.file = values.file || "";
      self.oldDrawIf = 0;

      // the audio position and size
      let expr = self.evaluator.eval(self.expresion);
      let cond = (expr[0].length == 4);
      self.w = (cond) ? expr[0][2] : 200;
      self.h = (cond) ? expr[0][3] : 28;

      self.audio = self.parent.getAudio(self.file);
      self.oldFile = self.file;

      if ((/^\[.*\]$/).test(self.file)) {
        self.file = self.evaluator.parser.parse(self.file.slice(1, -1));
      }
      
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

      self.audio.setAttribute("style", `position:absolute;width:${self.w}px;left:${self.x}px;top:${self.y}px;z-index:${self.zIndex};`);

      self.addControlContainer(self.audio);

      //
      self.evaluator.setFunction(self.id + ".play", function() {
        try {
          self.audio.play();
        } catch(e) {}

        return 0;
      });
      self.evaluator.setFunction(self.id + ".pause", function() {
        try {
          self.audio.pause();
        } catch(e) {}

        return 0;
      });
      self.evaluator.setFunction(self.id + ".stop", function() {
        try {
          self.audio.pause();
          self.audio.currentTime = 0;
        } catch(e) {}

        return 0;
      });
      self.evaluator.setFunction(self.id + ".currentTime", function(time) {
        try {
          self.audio.currentTime = parseFloat(time);
        } catch(e) {}

        return 0;
      });
      self.audio.addEventListener("timeupdate", function() {
        self.evaluator.setVariable(self.id + ".currentTime", self.audio.currentTime);
        self.evaluator.setVariable(self.id + ".playing", (self.audio.paused) ? 0 : 1);
        self.evaluator.setVariable(self.id + ".duration", self.audio.duration);
      });
    }

    /**
     * Init the audio
     */
    init() {
      this.audio.style.left = `${this.x}px`;
      this.audio.style.top  = `${this.y}px`;

      this.update();
    }

    /**
     * Update the audio control
     */
    update() {
      evaluator = this.evaluator;

      // the file name is variable
      if (typeof(this.file) !== "string") {
        tmpFile = evaluator.eval(this.file);
        
        if (this.old !== tmpFile) {
          this.audio.src = this.old = tmpFile;
        }
      }

      drawif = evaluator.eval(this.drawif) > 0;

      // hide or show the audio control
      this.audio.style.display = (drawif) ? "block" : "none";
      if ((!drawif) && (drawif !== this.oldDIF)) {
        this.audio.pause();
      }
      this.oldDIF = drawif;

      // update the position and size
      this.updatePositionAndSize();
    }
  }

  descartesJS.Audio = Audio;
  return descartesJS;
})(descartesJS || {});
