/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  var MathRound = Math.round;

  var evaluator;
  var space;
  var expr;
  var tmpRot;
  var coordX;
  var coordY;
  var size;

  class Point extends descartesJS.Graphic {
    /**
     * A Descartes point
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the point
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.size = this.size || parent.evaluator.parser.parse("2");

      this.text = new descartesJS.TextObject(this, this.text);
    }

    /**
     * Update the point
     */
    update() {
      evaluator = this.evaluator;

      expr = evaluator.eval(this.expresion);

      this.exprX = expr[0][0]; // the first value of the first expression
      this.exprY = expr[0][1]; // the second value of the first expression

      // rotate the elements in case the graphic is part of a macro
      if (this.rotateExp) {
        tmpRot = this.rotate(expr[0][0], expr[0][1], descartesJS.degToRad(evaluator.eval(this.rotateExp)));

        this.exprX = tmpRot.x;
        this.exprY = tmpRot.y;
      }
    }

    /**
     * Draw the point
     */
    draw() {
      super.draw(this.color, this.color);
    }

    /**
     * Draw the trace of the point
     */
    drawTrace() {
      super.drawTrace(this.trace, this.trace);
    }

    /**
     * Auxiliary function for draw a point
     * @param {CanvasRenderingContext2D} ctx rendering context on which the point is drawn
     * @param {String} fill the fill color of the point
     */
    drawAux(ctx, fill) {
      space = this.space;

      ctx.fillStyle = fill.getColor();

      coordX = MathRound( (this.abs_coord) ? this.exprX : space.getAbsoluteX(this.exprX) );
      coordY = MathRound( (this.abs_coord) ? this.exprY : space.getAbsoluteY(this.exprY) );

      size = MathRound(this.evaluator.eval(this.size));

      if (size > 0) {
        ctx.beginPath();
        ctx.arc(coordX, coordY, size, 0, PI2);
        ctx.fill()
      }

      // draw the text of the text
      if (this.text.hasContent) {
        this.text.draw(ctx, fill, coordX, coordY);
      }
    }
  }

  descartesJS.Point = Point;
  return descartesJS;
})(descartesJS || {});
