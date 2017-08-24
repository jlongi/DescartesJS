/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathRound = Math.round;

  var evaluator;
  var space;
  var points;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var tmpLineWidth;
  var lineDesp;
  var x, y, w, h, r, sign;

  /**
   * A Descartes Rectangle
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the Rectangle
   */
  descartesJS.Rectangle = function(parent, values) {
    /**
     * the stroke width of the graph
     * type {Number}
     * @private
     */
    this.width = parent.evaluator.parser.parse("1");

    /**
     * the condition and the color of the fill
     * type {String}
     * @private
     */
    this.fill = "";

    /**
     */
    this.border_radius = parent.evaluator.parser.parse("0");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    this.endPoints = [];
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Rectangle, descartesJS.Graphic);

  /**
   * Update Rectangle
   */
  descartesJS.Rectangle.prototype.update = function() {
    evaluator = this.evaluator;
    
    expr = evaluator.eval(this.expresion);
    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression
    this.w = 150;
    this.h = 100;

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

    // configuration of the form (x,y,ew,eh)
    if (expr[0].length >= 4) {
      this.w = expr[0][2];
      this.h = expr[0][3];
    }

    // configuration of the form (x,y)(ew,eh)
    if ((expr[1]) && (expr[1].length == 2)) {
      this.w = expr[1][0];
      this.h = expr[1][1];
    }
  }

  /**
   * Draw the Rectangle
   */
  descartesJS.Rectangle.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.fill, this.color);
  }

  /**
   * Draw the trace of the Rectangle
   */
  descartesJS.Rectangle.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }

  /**
   * Auxiliary function for draw a Rectangle
   * @param {CanvasRenderingContext2D} ctx rendering context on which the Rectangle is drawn
   * @param {String} fill the fill color of the Rectangle
   * @param {String} stroke the stroke color of the Rectangle
   */
  descartesJS.Rectangle.prototype.drawAux = function(ctx, fill, stroke) {
    evaluator = this.evaluator;
    space = this.space;

    // the width of a line can not be 0 or negative
    tmpLineWidth = mathRound( evaluator.eval(this.width) );
    ctx.lineWidth = (tmpLineWidth > 0) ? tmpLineWidth : 0.000001;

    ctx.strokeStyle = stroke.getColor();
    ctx.lineCap = "round";
    ctx.lineJoin = "miter";

    lineDesp = (tmpLineWidth > 0) ? .5 : 0;

    x = mathRound( (this.abs_coord) ? this.exprX : space.getAbsoluteX(this.exprX) );
    y = mathRound( (this.abs_coord) ? this.exprY : space.getAbsoluteY(this.exprY) );
    w = (this.abs_coord) ? this.w : this.w*space.scale;
    h = (this.abs_coord) ? this.h : -this.h*space.scale;
    r = evaluator.eval(this.border_radius);
    sign = (this.abs_coord) ? 1 : -1;

    this.ctx.beginPath();
    if (r !== 0) {
      this.ctx.moveTo(x + r, y);
      this.ctx.lineTo(x + w - r, y);
      this.ctx.quadraticCurveTo(x + w, y, x + w, y + sign*r);
      this.ctx.lineTo(x + w, y + h - sign*r);
      this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      this.ctx.lineTo(x + r, y + h);
      this.ctx.quadraticCurveTo(x, y + h, x, y + h - sign*r);
      this.ctx.lineTo(x, y + sign*r);
      this.ctx.quadraticCurveTo(x, y, x + r, y);
      this.ctx.closePath();
    }
    else {
      ctx.moveTo(x+lineDesp, y+lineDesp);
      ctx.lineTo(x+lineDesp + w, y+lineDesp);
      ctx.lineTo(x+lineDesp + w, y+lineDesp + h);
      ctx.lineTo(x+lineDesp, y+lineDesp + h);
    }
    ctx.closePath();
    
    // draw the fill
    if (this.fill) {
      ctx.fillStyle = fill.getColor();
      ctx.fill();
    }

    this.dashStyle();
    // draw the stroke
    ctx.stroke();

    // restore the dash style
    ctx.setLineDash([]);
  }

  return descartesJS;
})(descartesJS || {});
