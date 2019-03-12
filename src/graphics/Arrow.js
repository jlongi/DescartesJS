/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathRound = Math.round;

  var evaluator;
  var points;
  var radianAngle;
  var space;
  var midpX;
  var midpY;
  var width1;
  var width2;
  var scale;
  var vlength;
  var coordX;
  var coordY;
  var coordX1;
  var coordY1;
  var spear;

  class Arrow extends descartesJS.Graphic {
    /**
     * A Descartes arrow
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the arrow
    */
   constructor(parent, values) {
      // call the parent constructor
      super(parent, values);
    
      this.width = this.width || parent.evaluator.parser.parse("5");
      this.size = this.size || parent.evaluator.parser.parse("2");
      this.spear = this.spear || parent.evaluator.parser.parse("8");
      this.arrow = this.arrow || new descartesJS.Color("ee0022");

      this.text = new descartesJS.TextObject(this, this.text);
    }

    /**
     * Update the arrow
     */
    update() {
      evaluator = this.evaluator;

      points = evaluator.eval(this.expresion);
      this.endPoints = [];

      for(var i=0, l=points.length; i<l; i++){
        this.endPoints[i] = {x: points[i][0], y: points[i][1]};
      }

      // rotate the elements in case the graphic is part of a macro
      if (this.rotateExp) {
        radianAngle = descartesJS.degToRad(evaluator.eval(this.rotateExp));

        for (var i=0, l=this.endPoints.length; i<l; i++) {
          this.endPoints[i] = this.rotate(this.endPoints[i].x, this.endPoints[i].y, radianAngle);
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

      width1 = evaluator.eval(this.width);
      if (width1 < 0) {
        width1 = 0;
      }

      width2 = Math.ceil(width1/2);
      scale = space.scale;

      this.vect = new descartesJS.Vector2D(this.endPoints[1].x-this.endPoints[0].x, this.endPoints[1].y-this.endPoints[0].y);
      vlength = this.vect.vectorLength();
      this.angle = this.vect.angleBetweenVectors(descartesJS.Vector2D.AXIS_X);

      ctx.fillStyle = fill.getColor();
      ctx.strokeStyle = stroke.getColor();
      ctx.lineWidth = 2;

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

      spear = evaluator.eval(this.spear);
      if (spear < 0) {
        spear = 0
      }

      ctx.save();
      ctx.translate(coordX, coordY, vlength);

      if (this.abs_coord) {
        // if (((this.vect.x >= 0) && (this.vect.y >= 0)) || ((this.vect.x <= 0) && (this.vect.y >= 0))) {
        //   ctx.rotate(this.angle)
        // } else {
        //   ctx.rotate(-this.angle)
        // }
        ctx.rotate( this.angle * ((this.vect.y >= 0) ? 1 : -1) );
      } else {
        vlength = vlength*scale;

        // if (((this.vect.x >= 0) && (this.vect.y >= 0)) || ((this.vect.x <= 0) && (this.vect.y >= 0))) {
        //   ctx.rotate(-this.angle)
        // } else {
        //   ctx.rotate(this.angle)
        // }
        ctx.rotate( this.angle * ((this.vect.y >= 0) ? -1 : 1) );
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
        midpX = parseInt((coordX + coordX1)/2) -3;
        midpY = parseInt((coordY + coordY1)/2) +3;
        this.text.draw(ctx, stroke, midpX, midpY);
      }
    }
  }

  descartesJS.Arrow = Arrow;
  return descartesJS;
})(descartesJS || {});
