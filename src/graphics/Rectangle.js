/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let MathRound = Math.round;
  let MathMin = Math.min;
  let MathMax = Math.max;
  let MathAbs = Math.abs;

  let evaluator;
  let space;
  let tmpRot;
  let tmpLineWidth;
  let lineDesp;
  let expr;
  let x, y, w, h, r, sign;

  class Rectangle extends descartesJS.Graphic {
    /**
     * A Descartes Rectangle
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the Rectangle
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.width = this.width || parent.evaluator.parser.parse("1");
      this.fill = this.fill || "";
      this.border_radius = this.border_radius || parent.evaluator.parser.parse("0");
    }

    /**
     * Update Rectangle
     */
    update() {
      evaluator = this.evaluator;

      expr = evaluator.eval(this.expresion);
      this.X = expr[0][0]; // the first value of the first expression
      this.Y = expr[0][1]; // the second value of the first expression
      this.w = 150;
      this.h = 100;

      // rotate the elements in case the graphic is part of a macro
      if (this.rotateExp) {
        tmpRot = this.rotate(expr[0][0], expr[0][1], descartesJS.degToRad(evaluator.eval(this.rotateExp)));

        this.X = tmpRot.x;
        this.Y = tmpRot.y;
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

      this.w = MathMax(0, this.w);
      this.h = MathMax(0, this.h);
    }

    /**
     * Draw the Rectangle
     */
    draw() {
      super.draw(this.fill, this.color);
    }

    /**
     * Draw the trace of the Rectangle
     */
    drawTrace() {
      super.drawTrace(this.fill, this.trace, "trace");
    }

    /**
     * Auxiliary function for draw a Rectangle
     * @param {CanvasRenderingContext2D} ctx rendering context on which the Rectangle is drawn
     * @param {String} fill the fill color of the Rectangle
     * @param {String} stroke the stroke color of the Rectangle
     */
    drawAux(ctx, fill, stroke, msg) {
      evaluator = this.evaluator;
      space = this.space;

      // the width of a line can not be 0 or negative
      tmpLineWidth = MathRound( evaluator.eval(this.width) );
      ctx.lineWidth = MathMax(
        0.000001, 
        tmpLineWidth
      );

      ctx.strokeStyle = stroke.getColor();
      ctx.lineCap = "round";
      ctx.lineJoin = "miter";

      lineDesp = (tmpLineWidth > 0) ? 0.5 : 0;

      x = MathRound( (this.abs_coord) ? this.X : space.getAbsoluteX(this.X) ) +lineDesp;
      y = MathRound( (this.abs_coord) ? this.Y : space.getAbsoluteY(this.Y) ) +lineDesp;
      w = (this.abs_coord) ? this.w :  this.w*space.scale;
      h = (this.abs_coord) ? this.h : -this.h*space.scale;
      r = MathMin( 
        MathMax(0, evaluator.eval(this.border_radius)), 
        MathAbs(w)*0.5,
        MathAbs(h)*0.5 
      );
      sign = (this.abs_coord) ? 1 : -1;

      ctx.beginPath();
      if (r == 0) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
      }
      else {
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + sign*r, r);
        ctx.lineTo(x + w, y + h - sign*r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - sign*r, r);
        ctx.lineTo(x, y + sign*r);
        ctx.arcTo(x, y, x + r, y, r);
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
  }
  
  descartesJS.Rectangle = Rectangle;
  return descartesJS;
})(descartesJS || {});
