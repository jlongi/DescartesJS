/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una animacion de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen una animacion de descartes
   */
  descartesJS.Animation = function(parent, values) {
    /**
     * La aplicacion de descartes a la que corresponde la animacion
     * type DescartesApp
     * @private
     */
    this.parent = parent;

    var tmp;
    var evaluator = parent.evaluator;
    var parser = evaluator.parser;
    var algorithmAuxiliary = new descartesJS.Auxiliary(parent);

    this.delay = (values.delay) ? parser.parse(values.delay) : parser.parse("60");
    this.loop = (values.loop) ? values.loop : false;
    this.auto = ((values.auto == undefined) && (this.parent.version == 2)) ? true : values.auto;
    this.controls = values.controls;
    
    // se parsea la expresion init
    this.init = algorithmAuxiliary.splitInstructions(parser, values.init);

    // se parsea la expresion doExpr
    this.doExpr = algorithmAuxiliary.splitInstructions(parser, values.doExpr);

    // se parsea la expresion de while
    if (values.whileExpr) {
      this.whileExpr = parser.parse(values.whileExpr);
    }
    
    var self = this;
    // se construye la funcion a ejecutar durante la animacion
    this.animationExec = function() {
      
      for (var i=0, l=self.doExpr.length; i<l; i++) {
        evaluator.evalExpression(self.doExpr[i]);
      }

      self.parent.update();

      if ( (self.playing) && ((evaluator.evalExpression(self.whileExpr) > 0) || (self.loop)) ) {
        self.timer = setTimeout(self.animationExec, evaluator.evalExpression(self.delay));
      } else {
//         console.log("animacion detenida");
        self.stop();
        self.parent.update();
      }
    }

    this.playing = false;
    // se encuentra si la animacion se inicia automaticamente
    if (this.auto) {
      this.play();
    }    
  }  
  
  /**
   * Inicia la animacion
   */
  descartesJS.Animation.prototype.play = function() {
    if (!this.playing) {
//       console.log("animacion iniciada");
      this.reinit();
    
      this.playing = true;
      this.timer = setTimeout(this.animationExec, this.parent.evaluator.evalExpression(this.delay));
    } 
    
    else {
      this.stop();
    }
  }

  /**
   * Detiene la animacion
   */
  descartesJS.Animation.prototype.stop = function() {
    this.playing = false;
    clearInterval(this.timer);
  }
  
  /**
   * Reinicia la animacion
   */
  descartesJS.Animation.prototype.reinit = function() {
// //     var evaluator = this.parent.evaluator;
    for (var i=0, l=this.init.length; i<l; i++) {
// //       evaluator.evalExpression(this.init[i]);
      this.parent.evaluator.evalExpression(this.init[i]);
    }
  }
  
  return descartesJS;
})(descartesJS || {});