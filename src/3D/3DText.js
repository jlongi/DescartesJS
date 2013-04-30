/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

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

    expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0];
    this.exprY = expr[0][1];
    this.exprZ = 0;

    this.primitives.push(new descartesJS.Primitive3D( [new descartesJS.Vector4D(this.exprX, this.exprY, this.exprZ, 1)],
                                                      "text",
                                                      { fillStyle: this.color.getColor(),
                                                        font: this.font,
                                                        decimals: this.evaluator.evalExpression(this.decimals),
                                                        fixed: this.fixed,
                                                        displace: 0,
                                                        isText: true
                                                      },
                                                      this.evaluator,
                                                      this.text
                                                    ));

  }
  
  return descartesJS;
})(descartesJS || {});