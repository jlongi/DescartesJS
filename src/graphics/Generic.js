/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * A Descartes Generic
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the Generic
   */
  descartesJS.Generic = function(parent, values) {
    this.width = parent.evaluator.parser.parse("1");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Generic, descartesJS.Graphic);

  /**
   * Update the Generic
   */
  descartesJS.Generic.prototype.update = function() { 
  }

  /**
   * Draw the Generic
   */
  descartesJS.Generic.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.fill, this.color);
  }

  /**
   * Draw the trace of the Generic
   */
  descartesJS.Generic.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Auxiliary function for draw a Generic
   * @param {CanvasRenderingContext2D} ctx rendering context on which the Generic is drawn
   * @param {String} fill the fill color of the Generic
   * @param {String} stroke the stroke color of the Generic
   */
  descartesJS.Generic.prototype.drawAux = function(ctx, fill, stroke){
    var objDef = this.evaluator.getDefinition(this.expresionString);
    if (objDef) {
      objDef.draw(ctx, fill, stroke, this);
    }
  }

  return descartesJS;
})(descartesJS || {});