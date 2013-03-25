/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathRound = Math.round;

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
    this.init = parent.evaluator.parser.parse("0");

    /**
     * final angle or vector of an arc
     * type {Node}
     * @private
     */
    this.end = parent.evaluator.parser.parse("90");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Arc, descartesJS.Graphic);

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
   * Update the arc
   */
  descartesJS.Arc.prototype.update = function() {
    evaluator = this.evaluator;

    expr = evaluator.evalExpression(this.center);
    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression
    
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

    iniAng = evaluator.evalExpression(this.init);
    endAng = evaluator.evalExpression(this.end);

    // if the expression of the initial and final angle are parenthesized expressions, then the angles are specified as vectors
    if ( ((this.init.type == "(expr)") && (this.end.type == "(expr)")) || 
         ((this.init.type == "[expr]") && (this.end.type == "[expr]")) || 
         ((this.init.type == "(expr)") && (this.end.type == "[expr]")) || 
         ((this.init.type == "[expr]") && (this.end.type == "(expr)")) 
       ) {
      this.vectors = true;
      u1 = iniAng[0][0];
      u2 = iniAng[0][1];
      v1 = endAng[0][0];
      v2 = endAng[0][1];
    
      w1 = 1;
      w2 = 0;
      
      // find the angles
      angulo1 = Math.acos( (u1*w1+u2*w2)/Math.sqrt(u1*u1+u2*u2) );
      angulo2 = Math.acos( (v1*w1+v2*w2)/Math.sqrt(v1*v1+v2*v2) );

      // change considering the quadrant for the first angle
      if ((u1 > 0) && (u2 > 0) && !this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      if ((u1 > 0) && (u2 < 0) && this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      if ((u1 < 0) && (u2 < 0) && this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      if ((u1 < 0) && (u2 > 0) && !this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      
      // change considering the quadrant for the second angle
      if ((v1 > 0) && (v2 > 0) && !this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      if ((v1 > 0) && (v2 < 0) && this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      if ((v1 < 0) && (v2 < 0) && this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      if ((v1 < 0) && (v2 > 0) && !this.abs_coord) {
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
    }
    else {
      this.vectors = false;
      this.iniAng = descartesJS.degToRad(iniAng);
      this.endAng = descartesJS.degToRad(endAng);
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

    coordX = (this.abs_coord) ? mathRound(this.exprX) : mathRound(space.getAbsoluteX(this.exprX));
    coordY = (this.abs_coord) ? mathRound(this.exprY) : mathRound(space.getAbsoluteY(this.exprY));
    radius = evaluator.evalExpression(this.radius);
    
    if (!this.vectors) {
      if (this.iniAng > this.endAng) {
        tempAng = this.iniAng;
        this.iniAng = this.endAng;
        this.endAng = tempAng;
      }
    }
   
    if (radius < 0) {
      radius = 0;
    }
    
    clockwise = false;

    if (!this.abs_coord) {
      radius = radius*space.scale;
      if (!this.vectors) {
        this.iniAng = -this.iniAng;
        this.endAng = -this.endAng;
        clockwise = true;
      }
    }
    
    // if the arc is especified with vectors
    if (this.vectors) {
      if (this.abs_coord) {
        clockwise = false;
      }
      else {
        clockwise = true;
      }
    }
    
    // the width of a line can not be 0 or negative
    tmpLineWidth = mathRound( evaluator.evalExpression(this.width) );
    ctx.lineWidth = (tmpLineWidth > 0) ? tmpLineWidth : 0.000001;

    ctx.lineCap = "round";
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = descartesJS.getColor(evaluator, stroke);

    ctx.beginPath();
    ctx.arc(coordX, coordY, radius, this.iniAng, this.endAng, clockwise);
    if (this.fill) {
      ctx.fill();
    }
    ctx.stroke();
    
    // draw the text of the arc
    if (this.text != [""]) {
      this.uber.drawText.call(this, ctx, this.text, coordX+4, coordY-2, this.color, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed, true);
    }      
  }

  return descartesJS;
})(descartesJS || {});