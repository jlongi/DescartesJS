/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let evaluator;
  let expr;
  let tmpFrontColor;

  class Polygon3D extends descartesJS.Graphic3D {
    /**
     * A Descartes 3D polyline
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the polygon
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.width = this.width || parent.evaluator.parser.parse("1");
    }

    /**
     * Build the primitives corresponding to the polygon
     */
    buildPrimitives() {
      self = this;
      evaluator = self.evaluator;

      // do not apply the rotations in the model view matrix transformation
      self.updateMVMatrix();

      expr = evaluator.eval(self.expresion);

      tmpFrontColor = self.color.getColor();

      for (let i=0, l=expr.length-1; i<l; i++) {
        self.primitives.push(
          new descartesJS.Primitive3D( { 
            V: [ 
              self.transformVertex( new descartesJS.Vec4D(expr[i][0],   expr[i][1],   expr[i][2]) ),
              self.transformVertex( new descartesJS.Vec4D(expr[i+1][0], expr[i+1][1], expr[i+1][2]) )
            ],
            type: "edge",
            frontColor: tmpFrontColor, 
            lineWidth: evaluator.eval(self.width)
          },
          self.space
        ));
      }
    }
  }
  
  descartesJS.Polygon3D = Polygon3D;
  return descartesJS;
})(descartesJS || {});
