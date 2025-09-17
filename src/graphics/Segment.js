/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let MathRound = Math.round;
  let PI2 = Math.PI*2;

  let evaluator;
  let space;
  let points;
  let radianAngle;
  let size;
  let lineDesp;
  let coordX1;
  let coordY1;
  let coordX2;
  let coordY2;
  let tmpLineWidth;

  class Segment extends descartesJS.Graphic {
    /**
     * A Descartes segment
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the segment
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.width = this.width || parent.evaluator.parser.parse("1");
      this.size = this.size || parent.evaluator.parser.parse("2");

      this.text = new descartesJS.TextObject(this, this.text);
    }

    /**
     * Update the segment
     */
    update() {
      evaluator = this.evaluator;

      points = evaluator.eval(this.expresion);
      this.points = [];

      for (let i=0, l=points.length; i<l; i++) {
        this.points[i] = {x: points[i][0], y: points[i][1]};
      }

      // MACRO //
      // rotate the elements in case the graphic is part of a macro
      if (this.rotateExp) {
        radianAngle = descartesJS.degToRad(evaluator.eval(this.rotateExp));

        for (let i=0, l=this.points.length; i<l; i++) {
          this.points[i] = this.rotate(this.points[i].x, this.points[i].y, radianAngle);
        }
      }
      // MACRO //
    }

    /**
     * Draw the segment
     */
    draw() {
      super.draw(this.color, this.color);
    }

    /**
     * Draw the trace of the segment
     */
    drawTrace() {
      super.drawTrace(this.trace, this.trace);
    }

    /**
     * Auxiliary function for draw a segment
     * @param {CanvasRenderingContext2D} ctx rendering context on which the segment is drawn
     * @param {String} fill the fill color of the segment
     * @param {String} stroke the stroke color of the segment
     */
    drawAux(ctx, fill, stroke) {
      evaluator = this.evaluator;
      space = this.space;

      // the width of a line can not be 0 or negative
      tmpLineWidth = MathRound( evaluator.eval(this.width) );
      ctx.lineWidth = Math.max(
        0.000001, 
        tmpLineWidth
      );

      size = evaluator.eval(this.size);

      ctx.fillStyle = fill.getColor();
      ctx.strokeStyle = stroke.getColor();
      ctx.lineCap = "round";

      lineDesp = (ctx.lineWidth%2 == 0) ? 0 : 0.5;

      if (this.abs_coord) {
        coordX1 = MathRound(this.points[0].x);
        coordY1 = MathRound(this.points[0].y);
        coordX2 = MathRound(this.points[1].x);
        coordY2 = MathRound(this.points[1].y);
      } else {
        coordX1 = MathRound(space.getAbsoluteX(this.points[0].x));
        coordY1 = MathRound(space.getAbsoluteY(this.points[0].y));
        coordX2 = MathRound(space.getAbsoluteX(this.points[1].x));
        coordY2 = MathRound(space.getAbsoluteY(this.points[1].y));
      }

      ctx.beginPath();
      ctx.moveTo(coordX1+lineDesp, coordY1+lineDesp);
      ctx.lineTo(coordX2+lineDesp, coordY2+lineDesp);

      this.dashStyle();
      ctx.stroke();

      if (size > 0) {
        ctx.beginPath();
        ctx.arc(coordX1, coordY1, size, 0, PI2);
        ctx.arc(coordX2, coordY2, size, 0, PI2);
        ctx.fill();
      }

      // restore the dash style
      ctx.setLineDash([]);

      // draw the text of the segment
      if (this.text.hasContent) {
        this.text.draw(
          ctx, 
          stroke, 
          parseInt((coordX1 + coordX2)/2) -3, parseInt((coordY1 + coordY2)/2) +3 // midpoint
        );
      }
    }
  }

  descartesJS.Segment = Segment;
  return descartesJS;
})(descartesJS || {});
