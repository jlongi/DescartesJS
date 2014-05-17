/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  /**
   * Descartes animation
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
  */
  descartesJS.Animation = function(parent, values) {
    /**
     * Descartes application
     * type {DescartesApp}
     * @private
     */
    this.parent = parent;

    var tmp;
    var evaluator = parent.evaluator;
    var parser = evaluator.parser;
    var algorithmAuxiliary = new descartesJS.Auxiliary(parent);

    this.start = null;

    this.delay = (values.delay) ? parser.parse(values.delay) : parser.parse("60");
    this.loop = (values.loop) ? values.loop : false;
    // this.auto = ((values.auto == undefined) && (this.parent.version === 2)) ? true : values.auto;
    this.auto = (values.auto == undefined) ? true : values.auto;
    this.controls = values.controls;

    // parse the init expression
    this.init = algorithmAuxiliary.splitInstructions(parser, values.init);

    // parse the do expression
    this.doExpr = algorithmAuxiliary.splitInstructions(parser, values.doExpr);

    // parse the while expression
    if (values.whileExpr) {
      this.whileExpr = parser.parse(values.whileExpr);
    }
    
    var self = this;
    var delay;
    var i;
    var l = self.doExpr.length;

    this.animationExec = function() {
      for (i=0; i<l; i++) {
        evaluator.evalExpression(self.doExpr[i]);
      }

      self.parent.update();

      if ( (self.playing) && ((evaluator.evalExpression(self.whileExpr) > 0) || (self.loop)) ) {
        delay = evaluator.evalExpression(self.delay);

        if (!window.requestAnimationFrame) {
          self.timer = setTimeout(self.animationExec, ((delay < 10) ? 10 : delay));
        }

      } 
      else {
        self.stop();
        self.parent.update();
      }
    }

    this.playing = false;

    // init the animation automatically
    if (this.auto) {
      this.play();
    }
  }  
  
  /**
   * Play the animation
   */
  descartesJS.Animation.prototype.play = function() {
    var self = this;
    if (!this.playing) {
      this.reinit();
    
      this.playing = true;
      delay = this.parent.evaluator.evalExpression(this.delay);

      if (window.requestAnimationFrame) {
        this.timer = requestAnimationFrame( function(t) {
          self.step(t);
        });
      } 
      else {
        this.timer = setTimeout(this.animationExec, ((delay < 10) ? 10 : delay));
      }
    } 
    
    else {
      this.stop();
    }
  }

  /**
   * Stop the animation
   */
  descartesJS.Animation.prototype.stop = function() {
    this.playing = false;

    if (window.requestAnimationFrame) {
      window.cancelAnimationFrame(this.timer);
    }
    else {
      clearInterval(this.timer);
    }
  }
  
  /**
   * Reinit the animation
   */
  descartesJS.Animation.prototype.reinit = function() {
    for (var i=0, l=this.init.length; i<l; i++) {
      this.parent.evaluator.evalExpression(this.init[i]);
    }
  }

  /**
   *
   */
  descartesJS.Animation.prototype.step = function(timestamp) {
    var self = this;

    if (self.start === null) {
      self.start = timestamp;
    }

    delay = self.parent.evaluator.evalExpression(self.delay);
    delay = (delay < 10) ? 10 : delay;

    // if ( ((timestamp - self.start) > delay) && (self.parent.evaluator.evalExpression(self.whileExpr) > 0) ) {
    if ((timestamp - self.start) > delay) {
      self.animationExec();
      // self.start = self.start + (timestamp - self.start);
      self.start = null;
    }

    // stop condition
    if (self.playing) {
    // if (self.parent.evaluator.evalExpression(self.whileExpr) > 0) {
      self.timer = requestAnimationFrame( function(t) {
        self.step(t);
      });
    }
  }
  
  return descartesJS;
})(descartesJS || {});