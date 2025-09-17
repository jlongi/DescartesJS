/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let Nu;
  let vertices;
  let w;
  let l;
  let theta;
  let evaluator;

  class Polireg3D extends descartesJS.Graphic3D {
    /**
     * A Descartes 3D regular polygon
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the triangle
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      self = this;

      self.width  = self.width  || parent.evaluator.parser.parse("2");
      self.length = self.length || parent.evaluator.parser.parse("2");
    }
    
    /**
     * Build the primitives corresponding to the regular polygon
     */
    buildPrimitives() {
      self = this;
      evaluator = self.evaluator;

      self.updateMVMatrix();

      Nu = evaluator.eval(self.Nu);

      vertices = [self.transformVertex( new descartesJS.Vec4D() )];
      w = evaluator.eval(self.width)/2;
      l = evaluator.eval(self.length)/2;
      theta = (2*Math.PI) / Nu;

      for (let i=0; i<Nu; i++) {
        vertices.push ( self.transformVertex( new descartesJS.Vec4D(w*Math.cos(theta*i), l*Math.sin(theta*i), 0) ) );
      }

      let tmpFrontColor = self.color.getColor();
      let tmpBackColor  = self.backcolor.getColor();
      let tmpEdgeColor  = (self.edges) ? self.edges.getColor() : "";

      for (let i=0; i<Nu; i++) {
        self.primitives.push(
          new descartesJS.Primitive3D( { 
            V: [ 
              vertices[0],
              (i+2 <= Nu) ? vertices[i+2] : vertices[1],
              vertices[i+1]
            ],
            type: "face",
            frontColor: tmpFrontColor,
            backColor:  tmpBackColor,
            edges: tmpEdgeColor,
            model: self.model
          },
          self.space
        ));
      }
    }
  }

  descartesJS.Polireg3D = Polireg3D;
  return descartesJS;
})(descartesJS || {});
