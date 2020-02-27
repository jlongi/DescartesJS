/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var drawif;

  class Audio extends descartesJS.Control {
    /**
     * Descartes audio control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the audio control
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);
      
      var self = this;

      self.controls = values.controls || true;
      self.file = values.file || "";
      self.oldDrawIf = 0;

      // the audio position and size
      var expr = self.evaluator.eval(self.expresion);
      if (expr[0].length == 4) {
        self.w = expr[0][2];
        self.h = expr[0][3];
      } else {
        self.w = 200;
        self.h = 28;
      }

      self.audio = self.parent.getAudio(self.file);
      self.oldFile = self.file;


      if (self.file.charAt(self.file.length-1) === "]") {
        self.file = self.evaluator.parser.parse(self.file.substring(1, self.file.length-1));
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
          self.audio.currentTime = 0.0;
        } catch(e) {}

        return 0;
      });
      self.evaluator.setFunction(self.id + ".currentTime", function(time) {
        try {
          self.audio.currentTime = parseFloat(time);
        } catch(e) {}

        return 0;
      });
      self.audio.addEventListener("timeupdate", function(evt) {
        self.evaluator.setVariable(self.id + ".currentTime", self.audio.currentTime);
      });
    }

    /**
     * Init the audio
     */
    init() {
      // this.audio.setAttribute("width", this.w);
      // this.audio.setAttribute("height", this.h);
      this.audio.style.left = this.x + "px";
      this.audio.style.top  = this.y + "px";

      this.update();
    }

    /**
     * Update the audio control
     */
    update() {
      evaluator = this.evaluator;

      // the file name is variable
      if (typeof(this.file) !== "string") {
        this.tmpFile = evaluator.eval(this.file);
        if (this.oldFile !== this.tmpFile) {
          this.audio.src = this.tmpFile;
          this.oldFile = this.tmpFile;
        }
      }

      drawif = evaluator.eval(this.drawif) > 0;

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
  }

  descartesJS.Audio = Audio;
  return descartesJS;
})(descartesJS || {});
