/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathRound = Math.round;
  var MathMin   = Math.min;
  var MathMax   = Math.max;
  var MathAcos  = Math.acos;
  var MathSqrt  = Math.sqrt;
  var MathPI    = Math.PI;
  var Math_PI_2 = MathPI/2;
  var Math_2_PI = 2*MathPI;

  var evaluator;
  var expr;
  var macroAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var u1;
  var u2;
  var v1;
  var v2;
  var w1;
  var w2;
  var angulo1;
  var angulo2;
  var tmpAngulo1;
  var tmpAngulo2;
  var space;
  var coordX;
  var coordY;
  var radius;
  var tempAng;
  var clockwise;
//var tmpLineWidth;

  class Arc extends descartesJS.Graphic {
    /**
     * A Descartes arc
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the arc
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.width = this.width || parent.evaluator.parser.parse("1");
      this.fill = this.fill || "";
      this.center = this.center || parent.evaluator.parser.parse("(0,0)");
      this.radius = this.radius || parent.evaluator.parser.parse("1");
      this.init = this.init || "0";
      this.end = this.end || "90";

      if (this.init.match(/^_\(/)) {
        this.initFlag = true;
        this.init = this.init.substring(1);
      }
      if (this.end.match(/^_\(/)) {
        this.endFlag = true;
        this.end = this.end.substring(1);
      }

      this.initExpr = parent.evaluator.parser.parse(this.init);
      this.endExpr = parent.evaluator.parser.parse(this.end);

      this.text = new descartesJS.TextObject(this, this.text);
    }

    /**
     * Update the arc
     */
    update() {
      evaluator = this.evaluator;

      expr = evaluator.eval(this.center);
      this.exprX = expr[0][0]; // the first value of the first expression
      this.exprY = expr[0][1]; // the second value of the first expression

      macroAngle = 0;

      // MACRO //
      // rotate the elements in case the graphic is part of a macro
      if (this.rotateExp) {
        macroAngle = descartesJS.degToRad(evaluator.eval(this.rotateExp));
        cosTheta = Math.cos(macroAngle);
        senTheta = Math.sin(macroAngle);

        tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
        tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
        this.exprX = tmpRotX;
        this.exprY = tmpRotY;
      }
      // MACRO //

      var initVal = evaluator.eval(this.initExpr);
      var endVal  = evaluator.eval(this.endExpr);

      // if the expression of the initial and final angle are parenthesized expressions
      if ( (/^(\(|\[)expr(\)|\])$/i).test(this.initExpr.type) && (/^(\(|\[)expr(\)|\])$/i).test(this.endExpr.type) ) {
        u1 = initVal[0][0];
        u2 = initVal[0][1];
        v1 = endVal[0][0];
        v2 = endVal[0][1];

        // arc expressed with points in the space
        if (!this.vectors) {
          // if (this.abs_coord) {
          //   u1 =  u1 - this.exprX;
          //   u2 = -u2 + this.exprY;
          //   v1 =  v1 - this.exprX;
          //   v2 = -v2 + this.exprY;
          // }
          // else {
          //   u1 = u1 - this.exprX;
          //   u2 = u2 - this.exprY;
          //   v1 = v1 - this.exprX;
          //   v2 = v2 - this.exprY;
          // }

          u1 =  u1 - this.exprX;
          u2 = -u2 + this.exprY;
          v1 =  v1 - this.exprX;
          v2 = -v2 + this.exprY;

          if (!this.abs_coord) {
            u2 = -u2;
            v2 = -v2;
          }
        }
        // arc expressed with vectors
        else {
          if (this.abs_coord) {
            u2 = -u2;
            v2 = -v2;
          }
        }

        w1 = 1;
        w2 = 0;

        // find the angles
        angulo1 = (u1 == 0) ? ((u2 < 0) ? 3*Math_PI_2 : Math_PI_2) : MathAcos( (u1*w1)/MathSqrt(u1*u1+u2*u2) );
        angulo2 = (v1 == 0) ? ((v2 < 0) ? 3*Math_PI_2 : Math_PI_2) : MathAcos( (v1*w1)/MathSqrt(v1*v1+v2*v2) );
        angulo1 += macroAngle;
        angulo2 += macroAngle;

        // change considering the quadrant for the first angle
        if ((u1 > 0) && (u2 > 0) && this.abs_coord) {
          angulo1 = Math_2_PI-angulo1;
        }
        if ((u1 > 0) && (u2 < 0) && !this.abs_coord) {
          angulo1 = Math_2_PI-angulo1;
        }
        if ((u1 < 0) && (u2 < 0) && !this.abs_coord) {
          angulo1 = Math_2_PI-angulo1;
        }
        if ((u1 < 0) && (u2 > 0) && this.abs_coord) {
          angulo1 = Math_2_PI-angulo1;
        }

        // change considering the quadrant for the second angle
        if ((v1 > 0) && (v2 > 0) && this.abs_coord) {
          angulo2 = Math_2_PI-angulo2;
        }
        if ((v1 > 0) && (v2 < 0) && !this.abs_coord) {
          angulo2 = Math_2_PI-angulo2;
        }
        if ((v1 < 0) && (v2 < 0) && !this.abs_coord) {
          angulo2 = Math_2_PI-angulo2;
        }
        if ((v1 < 0) && (v2 > 0) && this.abs_coord) {
          angulo2 = Math_2_PI-angulo2;
        }

        if (this.initFlag) {
          tmpAngulo1 = angulo1;
          angulo1 = angulo2;
          angulo2 = tmpAngulo1;
        }
        else {
          // always choose the angles in order from lowest to highest
          tmpAngulo1 = MathMin(angulo1, angulo2);
          tmpAngulo2 = MathMax(angulo1, angulo2);
          angulo1 = tmpAngulo1;
          angulo2 = tmpAngulo2;

          // if the internal angle if greater than PI and the angle is in absolute coordinates
          if (((angulo2 - angulo1) > MathPI) && this.abs_coord) {
            angulo1 = tmpAngulo2;
            angulo2 = tmpAngulo1;
          }
          // if the internal angle if less than PI and the angle is in relative coordinates
          if (((angulo2 - angulo1) <= MathPI) && !this.abs_coord) {
            angulo1 = tmpAngulo2;
            angulo2 = tmpAngulo1;
          }
        }

        this.iniAng = angulo1;
        this.endAng = angulo2;

        this.drawPoints = true;
      }
      // arc expressed with angles
      else {
        this.iniAng = descartesJS.degToRad(initVal) +macroAngle;
        this.endAng = descartesJS.degToRad(endVal)  +macroAngle;
        this.drawAngle = true;
      }
    }

    /**
     * Draw the arc
     */
    draw() {
      super.draw(this.fill, this.color);
    }

    /**
     * Draw the trace of the arc
     */
    drawTrace() {
      super.drawTrace(this.fill, this.trace);
    }

    /**
     * Auxiliary function for draw an arc
     * @param {CanvasRenderingContext2D} ctx rendering context on which the arc is drawn
     * @param {String} fill the fill color of the arc
     * @param {String} stroke the stroke color of the arc
     */
    drawAux(ctx, fill, stroke) {
      evaluator = this.evaluator;
      space = this.space;

      radius = Math.max(0, evaluator.eval(this.radius));

      // the width of a line can not be 0 or negative
      // tmpLineWidth = MathRound( evaluator.eval(this.width) );
      // ctx.lineWidth = (tmpLineWidth > 0) ? tmpLineWidth : 0.000001;
ctx.lineWidth = Math.max(
  0.000001, 
  MathRound( evaluator.eval(this.width) )
);

      ctx.lineCap = "round";
      ctx.strokeStyle = stroke.getColor();

      if (this.abs_coord) {
        coordX = MathRound(this.exprX);
        coordY = MathRound(this.exprY);
      }
      else {
        coordX = MathRound(space.getAbsoluteX(this.exprX));
        coordY = MathRound(space.getAbsoluteY(this.exprY));
        radius = radius*space.scale;
        this.iniAng = -this.iniAng;
        this.endAng = -this.endAng;
      }

      // draw the arc when specified in angles
      if ( (this.drawAngle) && (this.iniAng > this.endAng) ) {
        tempAng = this.iniAng;
        this.iniAng = this.endAng;
        this.endAng = tempAng;
      }

      // // draw the arc when specified in angles
      // if (this.drawAngle) {
      //   if (this.abs_coord) {
      //     coordX = MathRound(this.exprX);
      //     coordY = MathRound(this.exprY);
      //   }
      //   else {
      //     coordX = MathRound(space.getAbsoluteX(this.exprX));
      //     coordY = MathRound(space.getAbsoluteY(this.exprY));
      //     radius = radius*space.scale;
      //     this.iniAng = -this.iniAng;
      //     this.endAng = -this.endAng;
      //   }

      //   if (this.iniAng > this.endAng) {
      //     tempAng = this.iniAng;
      //     this.iniAng = this.endAng;
      //     this.endAng = tempAng;
      //   }
      // }
      // // draw the arc when specified with points
      // else if (this.drawPoints) {
      //   if (this.abs_coord) {
      //     coordX = MathRound(this.exprX);
      //     coordY = MathRound(this.exprY);
      //   }
      //   else {
      //     coordX = MathRound(space.getAbsoluteX(this.exprX));
      //     coordY = MathRound(space.getAbsoluteY(this.exprY));
      //     radius = radius*space.scale;
      //     this.iniAng = -this.iniAng;
      //     this.endAng = -this.endAng;
      //   }
      // }

      if (this.fill) {
        ctx.fillStyle = fill.getColor();
        ctx.beginPath();
        ctx.moveTo(coordX, coordY);
        ctx.arc(coordX, coordY, radius, this.iniAng, this.endAng, clockwise);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(coordX, coordY, radius, this.iniAng, this.endAng, clockwise);
      this.dashStyle();
      ctx.stroke();

      // draw the text of the arc
      if (this.text.hasContent) {
        this.text.draw(ctx, this.color, coordX, coordY);
      }
    }
  }

  descartesJS.Arc = Arc;
  return descartesJS;
})(descartesJS || {});
