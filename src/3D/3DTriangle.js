/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var v1_x;
  var v1_y;
  var v1_z;
  var v2_x;
  var v2_y;
  var v2_z;
  var v3_x;
  var v3_y;
  var v3_z;

  /**
   * A Descartes 3D triangle
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the triangle
   */
  descartesJS.Triangle3D = function(parent, values) {
    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Triangle3D, descartesJS.Graphic3D);

  /**
   * Build the primitives corresponding to the triangle
   */
  descartesJS.Triangle3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    this.updateMVMatrix();

    expr = evaluator.evalExpression(this.expresion);
    v1_x = expr[0][0];
    v1_y = expr[0][1];
    v1_z = expr[0][2];

    v2_x = expr[1][0];
    v2_y = expr[1][1];
    v2_z = expr[1][2];

    v3_x = expr[2][0];
    v3_y = expr[2][1];
    v3_z = expr[2][2];

    this.primitives.push( new descartesJS.Primitive3D( { vertices: [ this.transformVertex( new descartesJS.Vector4D(v1_x, v1_y, v1_z, 1) ),
                                                                     this.transformVertex( new descartesJS.Vector4D(v3_x, v3_y, v3_z, 1) ),
                                                                     this.transformVertex( new descartesJS.Vector4D(v2_x, v2_y, v2_z, 1) )
                                                                   ],
                                                         type: "face",
                                                         frontColor: this.color,
                                                         backColor: this.backcolor, 
                                                         edges: this.edges, 
                                                         model: this.model
                                                       } ) );

  }

  return descartesJS;
})(descartesJS || {});