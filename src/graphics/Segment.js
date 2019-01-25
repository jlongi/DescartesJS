/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathRound = Math.round;
  var PI2 = Math.PI*2;

  var evaluator;
  var space;
  var points;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var tmpLineWidth;
  var desp;
  var midpX;
  var midpY;
  var size;
  var lineDesp;
  var coordX;
  var coordY;
  var coordX1;
  var coordY1;

  /**
   * A Descartes segment
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the segment
   */
  descartesJS.Segment = function(parent, values) {
    /**
     * the stroke width of the graph
     * type {Number}
     * @private
     */
    this.width = parent.evaluator.parser.parse("1");

    /**
     * width of the point
     * type {Node}
     * @private
     */
    this.size = parent.evaluator.parser.parse("2");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    this.text = new descartesJS.TextObject(this, this.text);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Segment, descartesJS.Graphic);

  /**
   * Update the segment
   */
  descartesJS.Segment.prototype.update = function() {
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
   * Draw the segment
   */
  descartesJS.Segment.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.color, this.color);
  }

  /**
   * Draw the trace of the segment
   */
  descartesJS.Segment.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }

  /**
   * Auxiliary function for draw a segment
   * @param {CanvasRenderingContext2D} ctx rendering context on which the segment is drawn
   * @param {String} fill the fill color of the segment
   * @param {String} stroke the stroke color of the segment
   */
  descartesJS.Segment.prototype.drawAux = function(ctx, fill, stroke){
    evaluator = this.evaluator;
    space = this.space;

    // the width of a line can not be 0 or negative
    tmpLineWidth = mathRound( evaluator.eval(this.width) );
    ctx.lineWidth = (tmpLineWidth > 0) ? tmpLineWidth : 0.000001;

    size = evaluator.eval(this.size);
    if (size < 0) {
      size = 0;
    }

    ctx.fillStyle = fill.getColor();
    ctx.strokeStyle = stroke.getColor();
    ctx.lineCap = "round";

    desp = 10+ctx.lineWidth;

    lineDesp = (ctx.lineWidth%2 == 0) ? 0 : 0.5;

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

    ctx.beginPath();
    ctx.moveTo(coordX+lineDesp, coordY+lineDesp);
    ctx.lineTo(coordX1+lineDesp, coordY1+lineDesp);

    this.dashStyle();
    ctx.stroke();

    if (size > 0) {
      ctx.beginPath();
      ctx.arc(coordX, coordY, size, 0, PI2, true);
      ctx.arc(coordX1, coordY1, size, 0, PI2, true);
      ctx.fill();
    }

    // restor the dash style
    ctx.setLineDash([]);

    // draw the text of the segment
    if (this.text.hasContent) {
      midpX = parseInt((coordX + coordX1)/2) -3;
      midpY = parseInt((coordY + coordY1)/2) +3;
      this.text.draw(ctx, stroke, midpX, midpY);
    }
  }

  return descartesJS;
})(descartesJS || {});
