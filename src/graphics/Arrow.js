/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var mathRound = Math.round;

  var evaluator;
  var points;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var space;
  var midpX;
  var midpY;
  var desp;
  var width1;
  var width2;
  var scale;
  var vlength;
  var coordX;
  var coordY;
  var coordX1;
  var coordY1;
  var spear;

  /**
   * A Descartes arrow
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the arrow
  */
  descartesJS.Arrow = function(parent, values) {
    /**
     * the stroke width of the graph
     * type {Number}
     * @private
     */
    this.width = parent.evaluator.parser.parse("5");

    /**
     * width of the point
     * type {Node}
     * @private
     */
    this.size = parent.evaluator.parser.parse("2");

    /**
     * the size of the spear (arrow)
     * type {Node}
     * @private
     */
    this.spear = parent.evaluator.parser.parse("8");

    /**
     * the color of the arrow
     * type {String}
     * @private
     */
    this.arrow = new descartesJS.Color("ee0022");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    this.text = new descartesJS.TextObject(this, this.text);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Arrow, descartesJS.Graphic);

  /**
   * Update the arrow
   */
  descartesJS.Arrow.prototype.update = function() {
    evaluator = this.evaluator;

    points = evaluator.eval(this.expresion);
    this.endPoints = [];

    for(var i=0, l=points.length; i<l; i++){
      this.endPoints[i] = {x: points[i][0], y: points[i][1]};
    }

    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.eval(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);

      for (var i=0, l=this.endPoints.length; i<l; i++) {
        tmpRotX = this.endPoints[i].x*cosTheta - this.endPoints[i].y*senTheta;
        tmpRotY = this.endPoints[i].x*senTheta + this.endPoints[i].y*cosTheta;
        this.endPoints[i].x = tmpRotX;
        this.endPoints[i].y = tmpRotY;
      }
    }

  }

  /**
   * Draw the arrow
   */
  descartesJS.Arrow.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.arrow, this.color);
  }

  /**
   * Draw the trace of the arrow
   */
  descartesJS.Arrow.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.arrow, this.trace);
  }

  /**
   * Auxiliary function for draw an arrow
   * @param {CanvasRenderingContext2D} ctx rendering context on which the arrow is drawn
   * @param {String} fill the fill color of the arrow
   * @param {String} stroke the stroke color of the arrow
   */
  descartesJS.Arrow.prototype.drawAux = function(ctx, fill, stroke){
    evaluator = this.evaluator;
    space = this.space;

    desp = 10 + evaluator.eval(this.size);
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
    ctx.lineWidth = 2.0;

    if (this.abs_coord) {
      coordX =  mathRound(this.endPoints[0].x);
      coordY =  mathRound(this.endPoints[0].y);

      coordX1 = mathRound(this.endPoints[1].x);
      coordY1 = mathRound(this.endPoints[1].y);
    } else {
      coordX =  mathRound(space.getAbsoluteX(this.endPoints[0].x));
      coordY =  mathRound(space.getAbsoluteY(this.endPoints[0].y));

      coordX1 = mathRound(space.getAbsoluteX(this.endPoints[1].x));
      coordY1 = mathRound(space.getAbsoluteY(this.endPoints[1].y));
    }

    var spear = evaluator.eval(this.spear);
    if (spear < 0) {
      spear = 0
    }

    ctx.save();
    ctx.translate(coordX, coordY, vlength);

    if (this.abs_coord) {
      if (((this.vect.x >= 0) && (this.vect.y >= 0)) || ((this.vect.x <= 0) && (this.vect.y >= 0))) {
        ctx.rotate(this.angle)
      } else {
        ctx.rotate(-this.angle)
      }
    } else {
      vlength = vlength*scale;

      if (((this.vect.x >= 0) && (this.vect.y >= 0)) || ((this.vect.x <= 0) && (this.vect.y >= 0))) {
        ctx.rotate(-this.angle)
      } else {
        ctx.rotate(this.angle)
      }
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

  return descartesJS;
})(descartesJS || {});
