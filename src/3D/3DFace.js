/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var vertices;
  var evaluator;
  var expr;

  class Face3D extends descartesJS.Graphic3D {
    /**
     * A Descartes 3D face
     * @ 
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the triangle
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);
    }
    
    /**
     * Build the primitives corresponding to the face
     */
    buildPrimitives() {
      evaluator = this.evaluator;

      this.updateMVMatrix();

      expr = evaluator.eval(this.expresion);

      vertices = [];

      for (var i=expr.length-1; i>=0; i--) {
        vertices.push( this.transformVertex(new descartesJS.Vector4D(expr[i][0], expr[i][1], expr[i][2], 1)) );
      }

      var tmpEdgeColor = (this.edges) ? this.edges.getColor() : "";

      this.primitives.push( new descartesJS.Primitive3D( { 
        vertices: vertices,
        type: "face",
        frontColor: this.color.getColor(), 
        backColor: this.backcolor.getColor(), 
        edges: tmpEdgeColor, 
        model: this.model
      },
      this.space ));
    }
  }
  
  descartesJS.Face3D = Face3D;
  return descartesJS;
})(descartesJS || {});
