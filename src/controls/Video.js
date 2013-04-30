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

    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    var evaluator = this.evaluator;    
    
    var expr = this.evaluator.evalExpression(this.expresion);
    if (expr[0].length == 4) {
      this.w = expr[0][2];
      this.h = expr[0][3];
    } else {
      this.w = null;
      this.h = null;
    }
    
    this.video = document.createElement("video");

    if (this.autoplay) {
      this.video.setAttribute("autoplay", "autoplay");
    }

    if (this.loop) {
      this.video.setAttribute("loop", "loop");
    }

    if (this.controls) {
      this.video.setAttribute("controls", "controls");
    }

    if (this.poster) {
      this.video.setAttribute("poster", this.poster);
    }

    if (this.w) {
      this.video.setAttribute("width", this.w);
      this.video.setAttribute("height", this.h);
    }
    this.video.setAttribute("style", "position: absolute; overflow: hidden; left: " + this.x + "px; top: " + this.y + "px;");
    
    var filename = this.file;
    var indexDot = filename.lastIndexOf(".");
    
    if (indexDot != -1) {
      filename = this.file.substring(0, indexDot);
    }
    
    var source;
    //mp4
    if (this.video.canPlayType("video/mp4")) {
      source = document.createElement("source");
      source.setAttribute("src", filename + ".mp4");
      source.setAttribute("type", "video/mp4");
      this.video.appendChild(source);
    }
    // ogg, ogv
    if (this.video.canPlayType("video/ogg")) {
      source = document.createElement("source");
      source.setAttribute("src", filename + ".ogg");
      source.setAttribute("type", "video/ogg");
      this.video.appendChild(source);

      source = document.createElement("source");
      source.setAttribute("src", filename + ".ogv");
      source.setAttribute("type", "video/ogg");
      this.video.appendChild(source);
    }
    // webm
    if (this.video.canPlayType("video/webm")) {
      source = document.createElement("source");
      source.setAttribute("src", filename + ".webm");
      source.setAttribute("type", "video/webm");
      this.video.appendChild(source);
    }

    this.addControlContainer(this.video);
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

  /**
   * Update the video control
   */
  descartesJS.Video.prototype.update = function() {
    evaluator = this.evaluator;

    // hide or show the audio control
    if (evaluator.evalExpression(this.drawif) > 0) {
      this.video.style.display = "block"
    } else {
      this.video.style.display = "none";
      this.video.pause();
    }

    // update the position and size
    this.updatePositionAndSize();    
  }
    
  return descartesJS;
})(descartesJS || {});