/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathRound = Math.round;
  var PI2 = Math.PI*2;

  var evaluator;
  var space;
  var points;
  var radianAngle;
  var size;
  var lineDesp;
  var coordX;
  var coordY;
  var coordX1;
  var coordY1;
  //var tmpLineWidth;

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
      this.endPoints = [];

      for(var i=0, l=points.length; i<l; i++){
        this.endPoints[i] = {
          x: points[i][0], 
          y: points[i][1]
        };
      }

      // MACRO //
      // rotate the elements in case the graphic is part of a macro
      if (this.rotateExp) {
        radianAngle = descartesJS.degToRad(evaluator.eval(this.rotateExp));

        for (var i=0, l=this.endPoints.length; i<l; i++) {
          this.endPoints[i] = this.rotate(this.endPoints[i].x, this.endPoints[i].y, radianAngle);
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
      // tmpLineWidth = MathRound( evaluator.eval(this.width) );
      // ctx.lineWidth = (tmpLineWidth > 0) ? tmpLineWidth : 0.000001;
ctx.lineWidth = Math.max(
  0.000001, 
  MathRound( evaluator.eval(this.width) )
);

      size = evaluator.eval(this.size);

      ctx.fillStyle = fill.getColor();
      ctx.strokeStyle = stroke.getColor();
      ctx.lineCap = "round";

      lineDesp = (ctx.lineWidth%2 == 0) ? 0 : 0.5;

      if (this.abs_coord) {
        coordX =  MathRound(this.endPoints[0].x);
        coordY =  MathRound(this.endPoints[0].y);
        coordX1 = MathRound(this.endPoints[1].x);
        coordY1 = MathRound(this.endPoints[1].y);
      } else {
        coordX =  MathRound(space.getAbsoluteX(this.endPoints[0].x));
        coordY =  MathRound(space.getAbsoluteY(this.endPoints[0].y));
        coordX1 = MathRound(space.getAbsoluteX(this.endPoints[1].x));
        coordY1 = MathRound(space.getAbsoluteY(this.endPoints[1].y));
      }

      ctx.beginPath();
      ctx.moveTo(coordX+lineDesp, coordY+lineDesp);
      ctx.lineTo(coordX1+lineDesp, coordY1+lineDesp);

      this.dashStyle();
      ctx.stroke();

      if (size > 0) {
        ctx.beginPath();
        ctx.arc(coordX, coordY, size, 0, PI2);
        ctx.arc(coordX1, coordY1, size, 0, PI2);
        ctx.fill();
      }

      // restore the dash style
      ctx.setLineDash([]);

      // draw the text of the segment
      if (this.text.hasContent) {
        this.text.draw(
          ctx, 
          stroke, 
          parseInt((coordX + coordX1)/2) -3, parseInt((coordY + coordY1)/2) +3 // midpoint
        );
      }
    }
  }

  descartesJS.Segment = Segment;
  return descartesJS;
})(descartesJS || {});
