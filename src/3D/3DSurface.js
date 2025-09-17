/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let evaluator;
  let tempParamU;
  let tempParamV;
  let tempParamX;
  let tempParamY;
  let tempParamZ;
  let Nu;
  let Nv;
  let vertices;
  let v;

  class Surface3D extends descartesJS.Graphic3D {
    /**
     * A Descartes 3D surface
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the surface
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      self = this;

      self.param = self.param || "t";
      self.parameter_interval = self.parameter_interval || parent.evaluator.parser.parse("[0,1]");
      self.parameter_steps = self.parameter_steps || parent.evaluator.parser.parse("8");

      self.expresion = self.parseExpression();
    }
    
    /**
     * Build the primitives corresponding to the surface
     */
    buildPrimitives() {
      self = this;
      evaluator = self.evaluator;

      self.updateMVMatrix();

      // store the u and v parameter values
      tempParamX = evaluator.getVariable("x");
      tempParamY = evaluator.getVariable("y");
      tempParamZ = evaluator.getVariable("z");
      tempParamU = evaluator.getVariable("u");
      tempParamV = evaluator.getVariable("v");

      evaluator.setVariable("u", 0);
      evaluator.setVariable("v", 0);
      Nu = parseInt(evaluator.eval(self.Nu));
      Nv = parseInt(evaluator.eval(self.Nv));

      // array to store the computed vertices 
      vertices = [];

      for (let ui=0; ui<=Nu; ui++) {
        evaluator.setVariable("u", ui/Nu);

        for (let vi=0; vi<=Nv; vi++) {
          evaluator.setVariable("v", vi/Nv);

          // eval all the sub terms in the expression
          for (let expr of self.expresion) {
            evaluator.eval(expr);
          }

          vertices.push( self.transformVertex(new descartesJS.Vec4D(evaluator.getVariable("x"), evaluator.getVariable("y"), evaluator.getVariable("z"))) );
        }
      }

      let tmpFrontColor = self.color.getColor();
      let tmpBackColor  = self.backcolor.getColor();
      let tmpEdgeColor  = (self.edges) ? self.edges.getColor() : "";

      for (let ui=0; ui<Nu; ui++) {
        for (let vi=0; vi<Nv; vi++) {
          v = [];
          v.push(vertices[vi   + ui*Nv + ui]);      // 0
          v.push(vertices[vi+1 + ui*Nv + ui]);      // 1
          v.push(vertices[vi+2 + (ui+1)*Nv  + ui]); // 2
          v.push(vertices[vi+1 + (ui+1)*Nv  + ui]); // 3

          self.primitives.push(
            new descartesJS.Primitive3D( { 
              V: v,
              type: "face",
              frontColor: tmpFrontColor,
              backColor: tmpBackColor,
              edges: tmpEdgeColor,
              model: self.model
            },
            self.space
          ));
        }
      }

      evaluator.setVariable("x", tempParamX);
      evaluator.setVariable("y", tempParamY);
      evaluator.setVariable("z", tempParamZ);
      evaluator.setVariable("u", tempParamU);
      evaluator.setVariable("v", tempParamV);
    }  
  }

  descartesJS.Surface3D = Surface3D;
  return descartesJS;
})(descartesJS || {});
