/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;

  /**
   * Descartes video control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the video control
   */
  descartesJS.Video = function(parent, values) {
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
    evaluator = self.evaluator;    
    
    var expr = self.evaluator.evalExpression(self.expresion);
    if (expr[0].length == 4) {
      self.w = expr[0][2];
      self.h = expr[0][3];
    } else {
      self.w = null;
      self.h = null;
    }
    
    self.video = document.createElement("video");

    if (self.autoplay) {
      self.video.setAttribute("autoplay", "autoplay");
    }

    if (self.loop) {
      self.video.setAttribute("loop", "loop");
    }

    if (self.controls) {
      self.video.setAttribute("controls", "controls");
    }

    if (self.poster) {
      self.video.setAttribute("poster", self.poster);
    }

    if (self.w) {
      self.video.setAttribute("width", self.w);
      self.video.setAttribute("height", self.h);
    }
    self.video.setAttribute("style", "position: absolute; overflow: hidden; left: " + self.x + "px; top: " + self.y + "px;");
    
    var filename = self.file;
    var indexDot = filename.lastIndexOf(".");
    
    if (indexDot != -1) {
      filename = self.file.substring(0, indexDot);
    }
    
    var source;
    //mp4
    if (self.video.canPlayType("video/mp4")) {
      source = document.createElement("source");
      source.setAttribute("src", filename + ".mp4");
      // source.setAttribute("type", "video/mp4");
      self.video.appendChild(source);
    }
    // ogg, ogv
    if (self.video.canPlayType("video/ogg")) {
      source = document.createElement("source");
      source.setAttribute("src", filename + ".ogg");
      source.setAttribute("type", "video/ogg");
      self.video.appendChild(source);

      source = document.createElement("source");
      source.setAttribute("src", filename + ".ogv");
      source.setAttribute("type", "video/ogg");
      self.video.appendChild(source);
    }
    // webm
    if (self.video.canPlayType("video/webm")) {
      source = document.createElement("source");
      source.setAttribute("src", filename + ".webm");
      source.setAttribute("type", "video/webm");
      self.video.appendChild(source);
    }

    self.addControlContainer(self.video);

    //
    self.evaluator.setFunction(self.id + ".play", function() {
      self.video.play();
      return 0;
    });
    self.evaluator.setFunction(self.id + ".pause", function() {
      self.video.pause();
      return 0;
    });
    self.evaluator.setFunction(self.id + ".stop", function() {
      self.video.pause();
      self.video.currentTime = 0.0;
      return 0;
    });
    self.evaluator.setFunction(self.id + ".currentTime", function(time) {
      self.video.currentTime = parseFloat(time);
      return 0;
    });
    self.video.addEventListener("timeupdate", function(evt) {
      self.evaluator.setVariable(self.id + ".currentTime", self.video.currentTime);
    });
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Video, descartesJS.Control);

  /**
   * Init the audio
   */
  descartesJS.Video.prototype.init = function() {
    // this.video.setAttribute("width", this.w);
    // this.video.setAttribute("height", this.h);
    this.video.style.left = this.x + "px";
    this.video.style.top  = this.y + "px";

    this.update();
  }

  var drawif;
  /**
   * Update the video control
   */
  descartesJS.Video.prototype.update = function() {
    evaluator = this.evaluator;

    drawif = evaluator.evalExpression(this.drawif) > 0

    // hide or show the video control
    if (evaluator.evalExpression(this.drawif) > 0) {
      this.video.style.display = "block"
    } else {
      this.video.style.display = "none";

      if (drawif !== this.oldDrawIf) {
        this.video.pause();
      }
    }

    this.oldDrawIf = drawif;

    // update the position and size
    this.updatePositionAndSize();    
  }
    
  return descartesJS;
})(descartesJS || {});