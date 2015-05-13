/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  var mathRound = Math.round;

  var evaluator;
  var space;
  var expr;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var coordX;
  var coordY;
  var range;
  var size;
  var desp;
  var tmp;

  /**
   * A Descartes sequence
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the sequence
   */
  descartesJS.Sequence = function(parent, values) {
    /**
     * width of the point
     * type {Node}
     * @private
     */
    this.size = parent.evaluator.parser.parse("2");

    this.range = parent.evaluator.parser.parse("[1, 100]");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Sequence, descartesJS.Graphic);

  /**
   * Update the sequence
   */
  descartesJS.Sequence.prototype.update = function() { 
    evaluator = this.evaluator;

    expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression

    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }

    range = evaluator.evalExpression(this.range);
    this.rangeInf = range[0][0];
    this.rangeMax = range[0][1];
  }

  /**
   * Draw the sequence
   */
  descartesJS.Sequence.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.color, this.color);
  }

  /**
   * Draw the trace of the sequence
   */
  descartesJS.Sequence.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Auxiliary function for draw a sequence
   * @param {CanvasRenderingContext2D} ctx rendering context on which the sequence is drawn
   * @param {String} fill the fill color of the sequence
   */
  descartesJS.Sequence.prototype.drawAux = function(ctx, fill) {
    evaluator = this.evaluator;
    space = this.space;

    size = Math.ceil(evaluator.evalExpression(this.size)-.4);
    desp = size;

    ctx.fillStyle = fill.getColor();

    ctx.beginPath();

    if (this.rangeInf > this.rangeMax) {
      tmp = this.rangeInf;
      this.rangeInf = this.rangeMax;
      this.rangeMax = tmp;
    }
      
    var tmpValue = evaluator.getVariable("n");
    for (var i=this.rangeInf, l=this.rangeMax; i<=l; i++) {
      evaluator.setVariable("n", i);
      
      expr = evaluator.evalExpression(this.expresion);
      this.exprX = expr[0][0];
      this.exprY = expr[0][1];
   
      coordX = (this.abs_coord) ? mathRound(this.exprX) : mathRound(space.getAbsoluteX(this.exprX));
      coordY = (this.abs_coord) ? mathRound(this.exprY) : mathRound(space.getAbsoluteY(this.exprY));

      ctx.beginPath();
      ctx.arc(coordX, coordY, size, 0, PI2, true);
      ctx.fill()
    }
    
    ctx.fill();

    // draw the text of the sequence
    if (this.text != [""]) {
      this.uber.drawText.call(this, ctx, this.text, coordX+desp, coordY-desp, this.color, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed, true);
    }

    evaluator.setVariable("n", tmpValue);

  }

  return descartesJS;
})(descartesJS || {});