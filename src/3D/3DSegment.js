/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let tempParamU;
  let evaluator;
  let expr;

  class Segment3D extends descartesJS.Graphic3D {
    /**
     * A Descartes 3D segment
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the point
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.width = this.width || parent.evaluator.parser.parse("1");
    }

    /**
     * Build the primitives corresponding to the segment
     */
    buildPrimitives() {
      self = this;
      evaluator = self.evaluator;

      // do not apply the rotations in the model view matrix transformation
      self.updateMVMatrix();

      tempParamU = evaluator.getVariable("u");
      evaluator.setVariable("u", self.Nu);

      expr = evaluator.eval(self.expresion);

      self.primitives.push(
        new descartesJS.Primitive3D({ 
          V: [ 
            self.transformVertex( new descartesJS.Vec4D(expr[0][0], expr[0][1], expr[0][2]) ),
            self.transformVertex( new descartesJS.Vec4D(expr[1][0], expr[1][1], expr[1][2]) )
          ],
          type: "edge",
          lineDash: self.lineDash,
          frontColor: self.color.getColor(), 
          lineWidth: evaluator.eval(self.width)
        },
       self.space
      ));

      evaluator.setVariable("u", tempParamU);
    }
  }

  descartesJS.Segment3D = Segment3D;
  return descartesJS;
})(descartesJS || {});
