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
  var vertices;

  /**
   * A Descartes 3D face
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the triangle
   */
  descartesJS.Face3D = function(parent, values) {
    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Face3D, descartesJS.Graphic3D);
  
  /**
   * Build the primitives corresponding to the face
   */
  descartesJS.Face3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    this.updateMVMatrix();

    expr = evaluator.evalExpression(this.expresion);

    vertices = [];

    for (var i=expr.length-1; i>=0; i--) {
      vertices.push( this.transformVertex(new descartesJS.Vector4D(expr[i][0], expr[i][1], expr[i][2], 1)) );
    }

    this.primitives.push( new descartesJS.Primitive3D( { vertices: vertices,
                               type: "face",
                               frontColor: this.color, 
                               backColor: this.backcolor, 
                               edges: this.edges, 
                               model: this.model
                             } ) );

  }
  
  return descartesJS;
})(descartesJS || {});