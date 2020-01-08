/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var Nu;
  var vertices;
  var w;
  var l;
  var theta;
  var evaluator;

  class Polireg3D extends descartesJS.Graphic3D {
    /**
     * A Descartes 3D regular polygon
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the triangle
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.width = this.width || parent.evaluator.parser.parse("2");
      this.length = this.length || parent.evaluator.parser.parse("2");
    }
    
    /**
     * Build the primitives corresponding to the regular polygon
     */
    buildPrimitives() {
      evaluator = this.evaluator;

      this.updateMVMatrix();

      Nu = evaluator.eval(this.Nu);

      vertices = [this.transformVertex( new descartesJS.Vector4D(0, 0, 0, 1) )];
      w = evaluator.eval(this.width)/2;
      l = evaluator.eval(this.length)/2;
      theta = (2*Math.PI) / Nu;

      for (var i=0; i<Nu; i++) {
        vertices.push ( this.transformVertex( new descartesJS.Vector4D(w*Math.cos(theta*i), l*Math.sin(theta*i), 0, 1) ) );
      }

      var tmpFrontColor = this.color.getColor();
      var tmpBackColor = this.backcolor.getColor();
      var tmpEdgeColor = (this.edges) ? this.edges.getColor() : "";

      for (var i=0; i<Nu; i++) {
        this.primitives.push( new descartesJS.Primitive3D( { 
          vertices: [ 
            vertices[0],
            (i+2 <= Nu) ? vertices[i+2] : vertices[1],
            vertices[i+1]
          ],
          type: "face",
          frontColor: tmpFrontColor,
          backColor: tmpBackColor,
          edges: tmpEdgeColor,
          model: this.model
        },
        this.space ));
      }
    }
  }

  descartesJS.Polireg3D = Polireg3D;
  return descartesJS;
})(descartesJS || {});
