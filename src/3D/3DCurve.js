/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;

  let vertices;
  let Nu;
  let tempParamU;
  let tempParamX;
  let tempParamY;
  let tempParamZ;  
  let evaluator;
  
  class Curve3D extends descartesJS.Graphic3D {
    /**
     * A Descartes 3D curve
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the curve
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      self = this;

      self.width = self.width || parent.evaluator.parser.parse("1");
      self.expresion = self.parseExpression();
    }
    
    /**
     * Build the primitives corresponding to the curve
     */
    buildPrimitives() {
      self = this;

      evaluator = self.evaluator;

      self.updateMVMatrix();

      // store the x, y, z and u parameter values
      tempParamX = evaluator.getVariable("x");
      tempParamY = evaluator.getVariable("y");
      tempParamZ = evaluator.getVariable("z");
      tempParamU = evaluator.getVariable("u");

      evaluator.setVariable("u", 0);
      Nu = evaluator.eval(self.Nu);

      vertices = [];

      for (let ui=0; ui<=Nu; ui++) {
        evaluator.setVariable("u", ui/Nu);

        // eval all the sub terms in the expression
        for (let exp of self.expresion) {
          evaluator.eval(exp);
        }

        vertices.push( 
          self.transformVertex(
            new descartesJS.Vec4D(
              evaluator.getVariable("x"),
              evaluator.getVariable("y"),
              evaluator.getVariable("z")
            )
          )
        );
      }

      for (let i=0, l=vertices.length-1; i<l; i++) {
        self.primitives.push(
          new descartesJS.Primitive3D( { 
            V: [ vertices[i], vertices[i+1] ],
            type: "edge",
            frontColor: self.color.getColor(), 
            lineWidth: evaluator.eval(self.width)
          },
          self.space )
        );
      }

      if ((self.fill) && (vertices.length > 2)) {
        self.primitives.push( 
          new descartesJS.Primitive3D( { 
            V: vertices,
            type: "face",
            frontColor: self.fill.getColor(), 
            backColor: self.fill.getColor(), 
            edges: "", 
            model: self.model
          },
          self.space )
        );
      }

      // restore the values
      evaluator.setVariable("x", tempParamX);
      evaluator.setVariable("y", tempParamY);
      evaluator.setVariable("z", tempParamZ);
      evaluator.setVariable("u", tempParamU);
    }
  }

  descartesJS.Curve3D = Curve3D;
  return descartesJS;
})(descartesJS || {});
