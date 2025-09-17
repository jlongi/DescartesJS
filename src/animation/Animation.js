/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;

  class Animation {
    /**
     * Descartes animation
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the graphic
    */
   constructor(parent, values) {
      let self = this;

      /**
       * Descartes application
       * type {DescartesApp}
       * @private
       */
      self.parent = parent;

      let evaluator = parent.evaluator;
      let parser = evaluator.parser;

      self.delay = parser.parse((values.delay) ? values.delay : "60");
      self.loop = (values.loop) ? values.loop : false;
      self.auto = (values.auto == undefined) ? true : values.auto;
      self.controls = values.controls;
      
      // parse the init, do and while expressions
      descartesJS.parseExpr(self, values, parser);

      self.animExec = function() {
        for (let expr of self.doExpr) {
          evaluator.eval(expr);
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
    play() {
      self = this;

      if (self.playing) {
        self.pause = true;
        self.stop();
      }
      else {
        if (!self.pause) {
          self.reinit();
        }
        self.playing = true;
        self.pause = false;
        self.timer = descartesJS.setTimeout(self.animExec, Math.max(10, self.parent.evaluator.eval(self.delay)));
      }
    }

    /**
     * Stop the animation
     */
    stop() {
      this.playing = false;
      descartesJS.clearTimeout(this.timer);
    }
    
    /**
     * Reinit the animation
     */
    reinit() {
      for (let expr of this.init) {
        this.parent.evaluator.eval(expr);
      }
    }
  }

  descartesJS.Animation = Animation;
  return descartesJS;
})(descartesJS || {});
