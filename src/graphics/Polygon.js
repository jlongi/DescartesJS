/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathRound = Math.round;

  var evaluator;
  var space;
  var points;
  var radianAngle;
  var tmpLineWidth;
  var lineDesp;
  var coordX;
  var coordY;

  /**
   * A Descartes polygon
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the polygon
   */
  descartesJS.Polygon = function(parent, values) {
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

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    this.endPoints = [];
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Polygon, descartesJS.Graphic);

  /**
   * Update polygon
   */
  descartesJS.Polygon.prototype.update = function() {
    evaluator = this.evaluator;

    points = evaluator.eval(this.expresion);

    for(var i=0, l=points.length; i<l; i++){
      this.endPoints[i] = { x: points[i][0], y: points[i][1] };
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
   * Draw the polygon
   */
  descartesJS.Polygon.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.fill, this.color);
  }

  /**
   * Draw the trace of the polygon
   */
  descartesJS.Polygon.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }

  /**
   * Auxiliary function for draw a polygon
   * @param {CanvasRenderingContext2D} ctx rendering context on which the polygon is drawn
   * @param {String} fill the fill color of the polygon
   * @param {String} stroke the stroke color of the polygon
   */
  descartesJS.Polygon.prototype.drawAux = function(ctx, fill, stroke) {
    evaluator = this.evaluator;
    space = this.space;

    // the width of a line can not be 0 or negative
    tmpLineWidth = MathRound( evaluator.eval(this.width) );
    ctx.lineWidth = (tmpLineWidth > 0) ? tmpLineWidth : 0.000001;

    ctx.strokeStyle = stroke.getColor();
    ctx.lineCap = ctx.lineJoin = "round";

    lineDesp = (tmpLineWidth > 0) ? .5 : 0;

    coordX = MathRound( (this.abs_coord) ? this.endPoints[0].x : space.getAbsoluteX(this.endPoints[0].x) );
    coordY = MathRound( (this.abs_coord) ? this.endPoints[0].y : space.getAbsoluteY(this.endPoints[0].y) );

    ctx.beginPath();
    ctx.moveTo(coordX+lineDesp, coordY+lineDesp);

    for(var i=1, l=this.endPoints.length; i<l; i++) {
      coordX = MathRound( (this.abs_coord) ? this.endPoints[i].x : space.getAbsoluteX(this.endPoints[i].x) );
      coordY = MathRound( (this.abs_coord) ? this.endPoints[i].y : space.getAbsoluteY(this.endPoints[i].y) );
      
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

  return descartesJS;
})(descartesJS || {});
