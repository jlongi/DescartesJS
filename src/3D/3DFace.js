/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;

  let vertices;
  let evaluator;
  let expr;

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
      self = this;

      evaluator = self.evaluator;

      self.updateMVMatrix();

      expr = evaluator.eval(self.expresion);

      vertices = [];

      for (let i=expr.length-1; i>=0; i--) {
        vertices.push( 
          self.transformVertex(
            new descartesJS.Vec4D(
              expr[i][0],
              expr[i][1],
              expr[i][2]
            )
          )
        );
      }

      self.primitives.push(
        new descartesJS.Primitive3D( { 
          V: vertices,
          type: "face",
          frontColor: self.color.getColor(), 
          backColor: self.backcolor.getColor(), 
          edges: (self.edges) ? self.edges.getColor() : "", 
          model: self.model
        },
        self.space )
      );
    }
  }
  
  descartesJS.Face3D = Face3D;
  return descartesJS;
})(descartesJS || {});
