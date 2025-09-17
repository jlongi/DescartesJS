/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let MathRound = Math.round;

  let evaluator;
  let space;
  let points;
  let radianAngle;
  let tmpLineWidth;
  let lineDesp;
  let coordX;
  let coordY;

  class Polygon extends descartesJS.Graphic {
    /**
     * A Descartes polygon
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the polygon
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.width = this.width || parent.evaluator.parser.parse("1");
      this.fill = this.fill || "";

      this.points = [];
    }

    /**
     * Update polygon
     */
    update() {
      evaluator = this.evaluator;

      points = evaluator.eval(this.expresion);

      for (let i=0, l=points.length; i<l; i++) {
        this.points[i] = {x: points[i][0], y: points[i][1]};
      }

      // rotate the elements in case the graphic is part of a macro
      if (this.rotateExp) {
        radianAngle = descartesJS.degToRad(evaluator.eval(this.rotateExp));

        for (let i=0, l=this.points.length; i<l; i++) {
          this.points[i] = this.rotate(this.points[i].x, this.points[i].y, radianAngle);
        }
      }
    }

    /**
     * Draw the polygon
     */
    draw() {
      super.draw(this.fill, this.color);
    }

    /**
     * Draw the trace of the polygon
     */
    drawTrace() {
      super.drawTrace(this.trace, this.trace);
    }

    /**
     * Auxiliary function for draw a polygon
     * @param {CanvasRenderingContext2D} ctx rendering context on which the polygon is drawn
     * @param {String} fill the fill color of the polygon
     * @param {String} stroke the stroke color of the polygon
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

      ctx.strokeStyle = stroke.getColor();
      ctx.lineCap = ctx.lineJoin = "round";

      lineDesp = (tmpLineWidth > 0) ? 0.5 : 0;

      coordX = MathRound( (this.abs_coord) ? this.points[0].x : space.getAbsoluteX(this.points[0].x) );
      coordY = MathRound( (this.abs_coord) ? this.points[0].y : space.getAbsoluteY(this.points[0].y) );

      ctx.beginPath();
      ctx.moveTo(coordX+lineDesp, coordY+lineDesp);

      for(let i=1, l=this.points.length; i<l; i++) {
        coordX = MathRound( (this.abs_coord) ? this.points[i].x : space.getAbsoluteX(this.points[i].x) );
        coordY = MathRound( (this.abs_coord) ? this.points[i].y : space.getAbsoluteY(this.points[i].y) );
        
        ctx.lineTo(coordX+lineDesp, coordY+lineDesp);
      }

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

  descartesJS.Polygon = Polygon;
  return descartesJS;
})(descartesJS || {});
