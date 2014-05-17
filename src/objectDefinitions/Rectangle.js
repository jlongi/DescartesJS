/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathRound = Math.round;

  /**
   * Descartes Rectangle
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the GenericDefinition
   */
  descartesJS.Rectangle = function(parent, values){
    this.fill = "";

    // call the parent constructor
    descartesJS.GenericDefinition.call(this, parent, values);

    this.evaluator.setDefinition(this.id, this);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of GenericDefinition
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Rectangle, descartesJS.GenericDefinition);
  
  /**
   * Update the Rectangle
   */
  descartesJS.Rectangle.prototype.update = function() {
  }

  /**
   * Draw the Rectangle
   */
  descartesJS.Rectangle.prototype.draw = function(ctx, fill, stroke, genericGraphic) {
    var space = genericGraphic.space;
    var evaluator = this.evaluator;
    var _x = _y = _w = _h = 0;

    if (genericGraphic.abs_coord) {
      _x = mathRound(evaluator.evalExpression(this.x));
      _y = mathRound(evaluator.evalExpression(this.y));
      _w = mathRound(evaluator.evalExpression(this.width));
      _h = mathRound(evaluator.evalExpression(this.height));
    }
    else {
      _x = mathRound(space.getAbsoluteX(evaluator.evalExpression(this.x)));
      _y = mathRound(space.getAbsoluteY(evaluator.evalExpression(this.y)));
      _w = evaluator.evalExpression(this.width)*space.scale;
      _h = evaluator.evalExpression(this.height)*space.scale;
    }

    var tmpLineWidth = mathRound( evaluator.evalExpression(genericGraphic.width) );
    ctx.lineWidth = (tmpLineWidth > 0) ? tmpLineWidth : 0.000001;

    var lineDesp = (ctx.lineWidth%2 == 0) ? 0 : 0.5;

    ctx.strokeStyle = stroke.getColor();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
      ctx.moveTo(_x+lineDesp,     _y+lineDesp);
      ctx.lineTo(_x+lineDesp +_w, _y+lineDesp);
      ctx.lineTo(_x+lineDesp +_w, _y+lineDesp +_h);
      ctx.lineTo(_x+lineDesp,     _y+lineDesp +_h);
    ctx.closePath();

    // draw the fill
    if (genericGraphic.fill) {
      ctx.fillStyle = fill.getColor();
      ctx.fill();
    }
    
    // draw the stroke
    ctx.stroke();
  }  

  
  return descartesJS;
})(descartesJS || {});