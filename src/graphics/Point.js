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
  var size;
  var desp;

  /**
   * A Descartes point
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the point
   */
  descartesJS.Point = function(parent, values) {
    /**
     * width of the point
     * type {Node}
     * @private
     */
    this.size = parent.evaluator.parser.parse("2");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Point, descartesJS.Graphic);

  /**
   * Update the point
   */
  descartesJS.Point.prototype.update = function() {
    evaluator = this.evaluator;

    expr = evaluator.eval(this.expresion);

    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression

    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.eval(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);

      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }
  }

  /**
   * Draw the point
   */
  descartesJS.Point.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.color, this.color);
  }

  /**
   * Draw the trace of the point
   */
  descartesJS.Point.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }

  /**
   * Auxiliary function for draw a point
   * @param {CanvasRenderingContext2D} ctx rendering context on which the point is drawn
   * @param {String} fill the fill color of the point
   */
  descartesJS.Point.prototype.drawAux = function(ctx, fill){
    evaluator = this.evaluator;
    space = this.space;

    size = mathRound(evaluator.eval(this.size));
    desp = size+1;

    ctx.fillStyle = fill.getColor();

    coordX = mathRound( (this.abs_coord) ? this.exprX : space.getAbsoluteX(this.exprX) );
    coordY = mathRound( (this.abs_coord) ? this.exprY : space.getAbsoluteY(this.exprY) );

    ctx.beginPath();
    ctx.arc(coordX, coordY, size, 0, PI2, true);
    ctx.fill()

    // draw the text of the text
    if (this.text != [""]) {
      this.fontSize = Math.max( 5, evaluator.eval(this.font_size) );
      this.font = this.font_style + " " + this.fontSize + "px " + this.font_family;
      this.uber.drawText.call(this, ctx, this.text, coordX+desp+1, coordY-desp, fill, this.font, "start", "alphabetic", evaluator.eval(this.decimals), this.fixed, true);
    }

  }

  return descartesJS;
})(descartesJS || {});
