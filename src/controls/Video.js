/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let evaluator;
  let drawif;

  class Video extends descartesJS.Control {
    /**
     * Descartes video control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the video control
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);
      
      self = this;

      self.controls = values.controls || true;
      self.file = values.file || "";
      self.oldDrawIf = 0;

      evaluator = self.evaluator;

      let expr = evaluator.eval(self.expresion)[0];
      if (expr.length == 4) {
        self.w = expr[2];
        self.h = expr[3];
      } else {
        self.w = null;
        self.h = null;
      }

      let filename = self.file;
      let indexDot = filename.lastIndexOf(".");

      if (indexDot != -1) {
        filename = self.file.substring(0, indexDot);
      }

      self.video = descartesJS.newHTML("video", {
        poster : filename + '.png',
        style  : `position:absolute;overflow:hidden;left:${self.x}px;top:${self.y}px;outline:none;background:rgba(0,0,0,0);`,
      });

      if (self.autoplay) {
        self.video.setAttribute("autoplay", "autoplay");
      }

      if (self.loop) {
        self.video.setAttribute("loop", "loop");
      }

      if (self.controls) {
        self.video.setAttribute("controls", "controls");
      }


      if (self.w) {
        self.video.setAttribute("width",  self.w);
        self.video.setAttribute("height", self.h);
      }

      let source;
      //mp4
      if (self.video.canPlayType("video/mp4")) {
        source = descartesJS.newHTML("source", {
          src  : filename + ".mp4",
          type : "video/mp4",
        });
        self.video.appendChild(source);
      }
      // ogg, ogv
      if (self.video.canPlayType("video/ogg")) {
        source = descartesJS.newHTML("source", {
          src  : filename + ".ogg",
          type : "video/ogg",
        });
        self.video.appendChild(source);

        source = descartesJS.newHTML("source", {
          src  : filename + ".ogv",
          type : "video/ogg",
        });
        self.video.appendChild(source);
      }
      // webm
      if (self.video.canPlayType("video/webm")) {
        source = descartesJS.newHTML("source", {
          src  : filename + ".webm",
          type : "video/webm",
        });
        self.video.appendChild(source);
      }

      self.addControlContainer(self.video);

      //
      evaluator.setFunction(self.id + ".play", function() {
        try {
          self.video.play();
        } catch(e) {}

        return 0;
      });
      evaluator.setFunction(self.id + ".pause", function() {
        try {
          self.video.pause();
        } catch(e) {}

        return 0;
      });
      evaluator.setFunction(self.id + ".stop", function() {
        try {
          self.video.pause();
          self.video.currentTime = 0;
        } catch(e) {}

        return 0;
      });
      evaluator.setFunction(self.id + ".currentTime", function(time) {
        try {
          self.video.currentTime = parseFloat(time);
        } catch(e) {}

        return 0;
      });
      self.video.addEventListener("timeupdate", function(evt) {
        evaluator.setVariable(self.id + ".currentTime", self.video.currentTime);
      });
    }

    /**
     * Init the video
     */
    init() {
      this.video.style.left = this.x + "px";
      this.video.style.top  = this.y + "px";

      this.update();
    }

    /**
     * Update the video control
     */
    update() {
      self = this;
      evaluator = self.evaluator;
      
      drawif = evaluator.eval(self.drawif) > 0

      // hide or show the video control
      if (drawif) {
        self.video.style.display = "block"
      } else {
        self.video.style.display = "none";

        if (drawif !== self.oldDrawIf) {
          self.video.pause();
        }
      }

      self.oldDrawIf = drawif;

      // update the position and size
      self.updatePositionAndSize();
    }
  }

  descartesJS.Video = Video;
  return descartesJS;
})(descartesJS || {});
