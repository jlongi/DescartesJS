/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let PI2 = Math.PI*2;
  let MathRound = Math.round;

  let evaluator;
  let space;
  let tmpRot;
  let coordX;
  let coordY;
  let size;

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

      [this.X, this.Y] = evaluator.eval(this.expresion)[0];

      // rotate the elements in case the graphic is part of a macro
      if (this.rotateExp) {
        tmpRot = this.rotate(this.X, this.Y, descartesJS.degToRad(evaluator.eval(this.rotateExp)));
        this.X = tmpRot.x;
        this.Y = tmpRot.y;
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

      coordX = MathRound( (this.abs_coord) ? this.X : space.getAbsoluteX(this.X) );
      coordY = MathRound( (this.abs_coord) ? this.Y : space.getAbsoluteY(this.Y) );

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
