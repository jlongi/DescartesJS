/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  var evaluator;
  var expr;
  var exprX;
  var exprY;
  var exprZ;
  
  /**
   * A Descartes 3D point
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the point
   */
  descartesJS.Point3D = function(parent, values) {
    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Point3D, descartesJS.Graphic3D);

  /**
   * Build the primitives corresponding to the point
   */
  descartesJS.Point3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    // do not apply the rotations in the model view matrix transformation
    this.updateMVMatrix();

    expr = evaluator.evalExpression(this.expresion);
    exprX = expr[0][0];
    exprY = expr[0][1];
    exprZ = expr[0][2];

    this.primitives.push( new descartesJS.Primitive3D( { vertices: [this.transformVertex( new descartesJS.Vector4D(exprX, exprY, exprZ, 1) )],
                               type: "vertex",
                               backColor: this.backcolor, 
                               frontColor: this.color, 
                               size: evaluator.evalExpression(this.width)
                             } ) );

    // add a text primitive only if the text has content
    if (this.text !== "") {
      this.primitives.push( new descartesJS.Primitive3D( { vertices: [this.transformVertex( new descartesJS.Vector4D(exprX, exprY, exprZ, 1) )],
                                 type: "text",
                                 frontColor: this.color, 
                                 font: this.font,
                                 decimals: evaluator.evalExpression(this.decimals),
                                 fixed: this.fixed,
                                 displace: this.fontSize,
                                 evaluator: evaluator,
                                 text: this.text,
                                 family: this.family,
                                 familyValue: this.familyValue
                               } ) );
    }
  }

  return descartesJS;
})(descartesJS || {});