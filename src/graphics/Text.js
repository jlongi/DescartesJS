/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var expr;
  var tmpRot;
  var posX;
  var posY;

  /**
   * A Descartes text
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the text
   */
  descartesJS.Text = function(parent, values) {
    /**
     * the stroke width of the graph
     * type {Number}
     * @private
     */
    this.width = parent.evaluator.parser.parse("0");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);
    
    // alignment
    this.align = this.align || "left";
    // anchor
    this.anchor = this.anchor || "top_left";

    this.text = new descartesJS.TextObject(this, this.text);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Text, descartesJS.Graphic);

  /**
   * Update the text
   */
  descartesJS.Text.prototype.update = function() {
    evaluator = this.evaluator;

    expr = evaluator.eval(this.expresion);
    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression

    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      tmpRot = this.rotate(expr[0][0], expr[0][1], descartesJS.degToRad(evaluator.eval(this.rotateExp)));

      this.exprX = tmpRot.x;
      this.exprY = tmpRot.y;
    }
  }

  /**
   * Draw the text
   */
  descartesJS.Text.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.color);
  }

  /**
   * Draw the trace of the text
   */
  descartesJS.Text.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.trace);
  }

  /**
   * Auxiliary function for draw a text
   * @param {CanvasRenderingContext2D} ctx rendering context on which the text is drawn
   * @param {String} fill the fill color of the text
   * @param {String} stroke the stroke color of the text
   */
  descartesJS.Text.prototype.drawAux = function(ctx, fill) {
    if (this.abs_coord) {
      posX = parseInt(this.exprX);
      posY = parseInt(this.exprY);
    }
    else {
      posX = parseInt( this.space.getAbsoluteX(this.exprX) );
      posY = parseInt( this.space.getAbsoluteY(this.exprY) );
    }

    this.text.draw(ctx, fill, posX, posY);
  }

  return descartesJS;
})(descartesJS || {});
