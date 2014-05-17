/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathRound = Math.round;

  var evaluator;
  var expr;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var iniAng;
  var endAng;
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
  var tmpLineWidth;

  /**
   * A Descartes arc
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the arc
   */
  descartesJS.Arc = function(parent, values) {
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
     * center of an arc
     * type {Node}
     * @private
     */
    this.center = parent.evaluator.parser.parse("(0,0)");

    /**
     * radius of an arc
     * type {Node}
     * @private
     */
    this.radius = parent.evaluator.parser.parse("1");

    /**
     * initial angle or vector of an arc
     * type {Node}
     * @private
     */
    this.init = "0";


    /**
     * final angle or vector of an arc
     * type {Node}
     * @private
     */
    this.end = "90";

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

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
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Arc, descartesJS.Graphic);

  /**
   * Update the arc
   */
  descartesJS.Arc.prototype.update = function() {
    evaluator = this.evaluator;

    expr = evaluator.evalExpression(this.center);
    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression
    
    radianAngle = 0;

    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }

    var initVal = evaluator.evalExpression(this.initExpr);
    var endVal  = evaluator.evalExpression(this.endExpr);

    // if the expression of the initial and final angle are parenthesized expressions
    if ( ((this.initExpr.type == "(expr)") && (this.endExpr.type == "(expr)")) || 
         ((this.initExpr.type == "[expr]") && (this.endExpr.type == "[expr]")) || 
         ((this.initExpr.type == "(expr)") && (this.endExpr.type == "[expr]")) || 
         ((this.initExpr.type == "[expr]") && (this.endExpr.type == "(expr)")) 
       ) {

      u1 = initVal[0][0];
      u2 = initVal[0][1];
      v1 = endVal[0][0];
      v2 = endVal[0][1];


      // arc expressed with points in the space
      if (!this.vectors) {
        if (this.abs_coord) {
          u1 =  u1 - this.exprX;
          u2 = -u2 + this.exprY;
          v1 =  v1 - this.exprX;
          v2 = -v2 + this.exprY;
        }
        else {
          u1 = u1 - this.exprX;
          u2 = u2 - this.exprY;
          v1 = v1 - this.exprX;
          v2 = v2 - this.exprY;
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
      angulo1 = (u1 == 0) ? ((u2 < 0) ? -Math.PI/2 : Math.PI/2) : Math.acos( (u1*w1)/Math.sqrt(u1*u1+u2*u2) );
      angulo2 = (v1 == 0) ? ((v2 < 0) ? -Math.PI/2 : Math.PI/2) : Math.acos( (v1*w1)/Math.sqrt(v1*v1+v2*v2) );

      angulo1 += radianAngle;
      angulo2 += radianAngle;

      // change considering the quadrant for the first angle
      if ((u1 > 0) && (u2 > 0) && this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      if ((u1 > 0) && (u2 < 0) && !this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      if ((u1 < 0) && (u2 < 0) && !this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      if ((u1 < 0) && (u2 > 0) && this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      
      // change considering the quadrant for the second angle
      if ((v1 > 0) && (v2 > 0) && this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      if ((v1 > 0) && (v2 < 0) && !this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      if ((v1 < 0) && (v2 < 0) && !this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      if ((v1 < 0) && (v2 > 0) && this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }

      // always choose the angles in order from lowest to highest
      tmpAngulo1 = Math.min(angulo1, angulo2);
      tmpAngulo2 = Math.max(angulo1, angulo2);
      angulo1 = tmpAngulo1;
      angulo2 = tmpAngulo2;

      // if the internal angle if greater than PI and the angle is in absolute coordinates
      if (((angulo2 - angulo1) > Math.PI) && this.abs_coord) {
        angulo1 = tmpAngulo2;
        angulo2 = tmpAngulo1;
      }
      // if the internal angle if less than PI and the angle is in relative coordinates
      if (((angulo2 - angulo1) <= Math.PI) && !this.abs_coord) {
        angulo1 = tmpAngulo2;
        angulo2 = tmpAngulo1;
      }

      this.iniAng = angulo1;
      this.endAng = angulo2;

      this.drawPoints = true;
    }
    // arc expressed with angles
    else {
      this.iniAng = descartesJS.degToRad(initVal) +radianAngle;
      this.endAng = descartesJS.degToRad(endVal)  +radianAngle;
      this.drawAngle = true;
    }

  }

  /**
   * Draw the arc
   */
  descartesJS.Arc.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.fill, this.color);
  }

  /**
   * Draw the trace of the arc
   */
  descartesJS.Arc.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.fill, this.trace);
  }
  
  /**
   * Auxiliary function for draw an arc
   * @param {CanvasRenderingContext2D} ctx rendering context on which the arc is drawn
   * @param {String} fill the fill color of the arc
   * @param {String} stroke the stroke color of the arc
   */
  descartesJS.Arc.prototype.drawAux = function(ctx, fill, stroke) {
    evaluator = this.evaluator;
    space = this.space;

    radius = evaluator.evalExpression(this.radius);
    if (radius < 0) {
      radius = 0;
    }

    // the width of a line can not be 0 or negative
    tmpLineWidth = mathRound( evaluator.evalExpression(this.width) );
    ctx.lineWidth = (tmpLineWidth > 0) ? tmpLineWidth : 0.000001;

    ctx.lineCap = "round";
    ctx.strokeStyle = stroke.getColor();

    // draw the arc when especified in angles
    if (this.drawAngle) {
      if (this.abs_coord) {
        coordX = mathRound(this.exprX);
        coordY = mathRound(this.exprY);
      }
      else {
        coordX = mathRound(space.getAbsoluteX(this.exprX));
        coordY = mathRound(space.getAbsoluteY(this.exprY));
        radius = radius*space.scale;
        this.iniAng = -this.iniAng;
        this.endAng = -this.endAng;
      }

      if (this.iniAng > this.endAng) {
        tempAng = this.iniAng;
        this.iniAng = this.endAng;
        this.endAng = tempAng;
      }       
    }
    // draw the arc when especified with points
    else if (this.drawPoints) {
      if (this.abs_coord) {
        coordX = mathRound(this.exprX);
        coordY = mathRound(this.exprY);
      }
      else {
        coordX = mathRound(space.getAbsoluteX(this.exprX));
        coordY = mathRound(space.getAbsoluteY(this.exprY));
        radius = radius*space.scale;
        this.iniAng = -this.iniAng;
        this.endAng = -this.endAng;
      }      
    }

    if (this.fill) {
      ctx.fillStyle = fill.getColor();
      ctx.beginPath();
      ctx.moveTo(coordX, coordY);
      ctx.arc(coordX, coordY, radius, this.iniAng, this.endAng, clockwise);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(coordX, coordY, radius, this.iniAng, this.endAng, clockwise);
    ctx.stroke();
    
    // draw the text of the arc
    if (this.text != [""]) {
      this.uber.drawText.call(this, ctx, this.text, coordX+4, coordY-2, this.color, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed, true);
    }      
  }

  return descartesJS;
})(descartesJS || {});