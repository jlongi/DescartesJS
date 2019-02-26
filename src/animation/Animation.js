/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

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

    var evaluator = parent.evaluator;
    var parser = evaluator.parser;
    var algorithmAuxiliary = new descartesJS.Auxiliary(parent);
    var self = this;

    self.delay = (values.delay) ? parser.parse(values.delay) : parser.parse("60");
    self.loop = (values.loop) ? values.loop : false;
    self.auto = (values.auto == undefined) ? true : values.auto;
    self.controls = values.controls;
    
    // parse the init expression
    self.init = algorithmAuxiliary.splitInstructions(parser, values.init);

    // parse the do expression
    self.doExpr = algorithmAuxiliary.splitInstructions(parser, values.doExpr);

    // parse the while expression
    if (values.whileExpr) {
      self.whileExpr = parser.parse(values.whileExpr);
    }
    
    var i;
    var l = self.doExpr.length;

    self.animExec = function() {  
      for (i=0; i<l; i++) {
        evaluator.eval(self.doExpr[i]);
      }
      self.parent.update();

      if ( (self.playing) && ((evaluator.eval(self.whileExpr) > 0) || (self.loop)) ) {
        self.timer = descartesJS.setTimeout(self.animExec, evaluator.eval(self.delay));
      } 
      else {
        self.stop();
        self.pause = false;
        self.parent.update();
      }
    }

    self.playing = false;

    // init the animation automatically
    if (self.auto) {
      self.play();
    }    
  }  
  
  /**
   * Play the animation
   */
  descartesJS.Animation.prototype.play = function() {
    if (!this.playing) {
      if (!this.pause) {
        this.reinit();
      }

      this.playing = true;
      this.pause = false;
      this.timer = descartesJS.setTimeout(this.animExec, Math.max(10, this.parent.evaluator.eval(this.delay)));
    } 
    else {
      this.pause = true;
      this.stop();
    }
  }

  /**
   * Stop the animation
   */
  descartesJS.Animation.prototype.stop = function() {
    this.playing = false;
    descartesJS.clearTimeout(this.timer);
  }
  
  /**
   * Reinit the animation
   */
  descartesJS.Animation.prototype.reinit = function() {
    for (var i=0, l=this.init.length; i<l; i++) {
      this.parent.evaluator.eval(this.init[i]);
    }
  }
  
  return descartesJS;
})(descartesJS || {});
