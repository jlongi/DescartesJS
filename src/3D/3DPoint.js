/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  var evaluator;
  var expr;
  
  /**
   * A Descartes 3D point
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the point
   */
  descartesJS.Point3D = function(parent, values) {
    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);

    this.mvMatrix = (new descartesJS.Matrix4x4()).setIdentity();
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
    this.exprX = expr[0][0];
    this.exprY = expr[0][1];
    this.exprZ = expr[0][2];

    this.primitives.push(new descartesJS.Primitive3D( [this.transformVertex( new descartesJS.Vector4D(this.exprX, this.exprY, this.exprZ, 1) )],
                                                      "vertex",
                                                      { fillStyle: this.backcolor.getColor(), 
                                                        strokeStyle: this.color.getColor(), 
                                                        lineCap: "round", 
                                                        lineJoin: "round",
                                                        lineWidth: 1,
                                                        size: evaluator.evalExpression(this.width)
                                                      }
                                                    ));

    this.primitives.push(new descartesJS.Primitive3D( [this.transformVertex( new descartesJS.Vector4D(this.exprX, this.exprY, this.exprZ, 1) )],
                                                      "text",
                                                      { fillStyle: this.color.getColor(),
                                                        font: this.font,
                                                        decimals: this.evaluator.evalExpression(this.decimals),
                                                        fixed: this.fixed,
                                                        displace: this.fontSize
                                                      },
                                                      this.evaluator,
                                                      this.text
                                                    ));

  }

  return descartesJS;
})(descartesJS || {});