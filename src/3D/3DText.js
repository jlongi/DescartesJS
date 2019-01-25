/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var expr;
  var exprX;
  var exprY;
  var exprZ;

  /**
   * A Descartes 3D text
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the triangle
   */
  descartesJS.Text3D = function(parent, values) {
    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Text3D, descartesJS.Graphic3D);
  
  /**
   * Build the primitives corresponding to the point
   */
  descartesJS.Text3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    expr = evaluator.eval(this.expresion);
    exprX = expr[0][0];
    exprY = expr[0][1];
    exprZ = 0;

    this.primitives.push( new descartesJS.Primitive3D( { 
      vertices: [new descartesJS.Vector4D(exprX, exprY, exprZ, 1)],
      type:"text",
      frontColor: this.color.getColor(),
      font_size: this.font_size,
      font_style: this.font_style,
      font_family: this.font_family,
      decimals: evaluator.eval(this.decimals),
      fixed: this.fixed,
      displace: 0,
      isText: true,
      evaluator: evaluator,
      text: new descartesJS.TextObject(this, this.text),
      family: this.family,
      familyValue: this.familyValue
    },
    this.space ));

  }
  
  return descartesJS;
})(descartesJS || {});