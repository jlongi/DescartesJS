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

    var tmp;
    var evaluator = parent.evaluator;
    var parser = evaluator.parser;
    var algorithmAuxiliary = new descartesJS.Auxiliary(parent);

    this.delay = (values.delay) ? parser.parse(values.delay) : parser.parse("60");
    this.loop = (values.loop) ? values.loop : false;
    this.auto = ((values.auto == undefined) && (this.parent.version === 2)) ? true : values.auto;
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
        self.timer = setTimeout(self.animationExec, ((delay < 10) ? 10 : delay));
      } else {
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
    if (!this.playing) {
      // this.reinit();
    
      this.playing = true;
      this.timer = setTimeout(this.animationExec, this.parent.evaluator.evalExpression(this.delay));
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
    clearInterval(this.timer);
  }
  
  /**
   * Reinit the animation
   */
  descartesJS.Animation.prototype.reinit = function() {
    for (var i=0, l=this.init.length; i<l; i++) {
      this.parent.evaluator.evalExpression(this.init[i]);
    }
  }
  
  return descartesJS;
})(descartesJS || {});