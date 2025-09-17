/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let evaluator;
  let expr;

  class Triangle3D extends descartesJS.Graphic3D {
    /**
     * A Descartes 3D triangle
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the triangle
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);
    }

    /**
     * Build the primitives corresponding to the triangle
     */
    buildPrimitives() {
      self = this;
      evaluator = self.evaluator;

      self.updateMVMatrix();

      expr = evaluator.eval(self.expresion);

      self.primitives.push(
        new descartesJS.Primitive3D( { 
          V: [ 
            self.transformVertex( new descartesJS.Vec4D(expr[0][0], expr[0][1], expr[0][2]) ),
            self.transformVertex( new descartesJS.Vec4D(expr[2][0], expr[2][1], expr[2][2]) ),
            self.transformVertex( new descartesJS.Vec4D(expr[1][0], expr[1][1], expr[1][2]) )
          ],
          type: "face",
          frontColor: self.color.getColor(),
          backColor: self.backcolor.getColor(),
          edges: (self.edges) ? self.edges.getColor() : "",
          model: self.model
        },
        self.space
      ));
    }
  }

  descartesJS.Triangle3D = Triangle3D;
  return descartesJS;
})(descartesJS || {});
