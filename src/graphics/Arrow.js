/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let MathFloor = Math.floor;
  let MathRound = Math.round;

  let evaluator;
  let points;
  let radianAngle;
  let space;
  let width1;
  let width2;
  let scale;
  let vlength;
  let coordX;
  let coordY;
  let coordX1;
  let coordY1;
  let spear;

  class Arrow extends descartesJS.Graphic {
    /**
     * A Descartes arrow
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the arrow
    */
   constructor(parent, values) {
      // call the parent constructor
      super(parent, values);
    
      this.width = this.width || parent.evaluator.parser.parse("5");
      this.size  = this.size  || parent.evaluator.parser.parse("2");
      this.spear = this.spear || parent.evaluator.parser.parse("8");
      this.arrow = this.arrow || new descartesJS.Color("ee0022");

      this.text = new descartesJS.TextObject(this, this.text);

      this.V = new descartesJS.Vector2D(0, 0);
      
      this.points = [];
    }

    /**
     * Update the arrow
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
     * Draw the arrow
     */
    draw() {
      super.draw(this.arrow, this.color);
    }

    /**
     * Draw the trace of the arrow
     */
    drawTrace() {
      super.drawTrace(this.arrow, this.trace);
    }

    /**
     * Auxiliary function for draw an arrow
     * @param {CanvasRenderingContext2D} ctx rendering context on which the arrow is drawn
     * @param {String} fill the fill color of the arrow
     * @param {String} stroke the stroke color of the arrow
     */
    drawAux(ctx, fill, stroke) {
      evaluator = this.evaluator;
      space = this.space;
      points = this.points;

      width1 = Math.max(0, evaluator.eval(this.width));
      width2 = Math.ceil(width1/2);
      scale = space.scale;

      this.V.x = points[1].x - points[0].x;
      this.V.y = points[1].y - points[0].y;
      vlength = this.V.vLength();
      this.angle = Math.atan2(this.V.y, this.V.x)

      ctx.fillStyle = fill.getColor();
      ctx.strokeStyle = stroke.getColor();
      ctx.lineWidth = 2;

      if (this.abs_coord) {
        coordX =  MathRound(points[0].x);
        coordY =  MathRound(points[0].y);

        coordX1 = MathRound(points[1].x);
        coordY1 = MathRound(points[1].y);
      } else {
        coordX =  MathRound(space.getAbsoluteX(points[0].x));
        coordY =  MathRound(space.getAbsoluteY(points[0].y));

        coordX1 = MathRound(space.getAbsoluteX(points[1].x));
        coordY1 = MathRound(space.getAbsoluteY(points[1].y));
      }

      spear = Math.max(0, evaluator.eval(this.spear));

      ctx.save();
      ctx.translate(coordX, coordY);

      if (this.abs_coord) {
        ctx.rotate( this.angle );
      } else {
        vlength = vlength*scale;
        ctx.rotate( -this.angle );
      }

      ctx.beginPath();
      ctx.moveTo(-width2,                         MathFloor(-width2));
      ctx.lineTo(MathFloor(vlength-spear-width1), MathFloor(-width2));
      ctx.lineTo(MathFloor(vlength-2*spear),      MathFloor(-spear-width2));
      ctx.lineTo(MathFloor(vlength),              0);
      ctx.lineTo(MathFloor(vlength-2*spear),      MathFloor(spear+width2));
      ctx.lineTo(MathFloor(vlength-spear-width1), MathFloor(width2));
      ctx.lineTo(-width2,                         MathFloor(width2));
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.restore();

      // draw the text of the arrow
      if (this.text.hasContent) {
        this.text.draw(
          ctx, 
          stroke, 
          parseInt((coordX + coordX1)/2) -3, parseInt((coordY + coordY1)/2) +3 // midpoint
        );
      }
    }
  }

  descartesJS.Arrow = Arrow;
  return descartesJS;
})(descartesJS || {});
