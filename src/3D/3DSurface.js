/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var tempParamU;
  var tempParamV;
  var Nu;
  var Nv;
  var xEval;
  var yEval;
  var zEval;
  var vertices;
  var v;

  /**
   * A Descartes 3D surface
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the surface
   */
  descartesJS.Surface3D = function(parent, values) {
    /**
     * the parameter name for a curve
     * type {String}
     * @private
     */
    this.parameter = "t";

    /**
     * the interval of the curve parameter
     * type {Node}
     * @private
     */
    this.parameter_interval = parent.evaluator.parser.parse("[0,1]");

    /**
     * the number of steps of the curve parameter
     * type {Node}
     * @private
     */
    this.parameter_steps = parent.evaluator.parser.parse("8");

    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);

    var parser = this.evaluator.parser;
    
    this.mvMatrix = (new descartesJS.Matrix4x4()).setIdentity();

    this.exprX = parser.parse( this.findExpresion(this.expresion, "x") );
    this.exprY = parser.parse( this.findExpresion(this.expresion, "y") );
    this.exprZ = parser.parse( this.findExpresion(this.expresion, "z") );

    this.XcontainsY = this.exprX.contains("y");
    this.XcontainsZ = this.exprX.contains("z");
    this.YcontainsX = this.exprY.contains("x");
    this.YcontainsZ = this.exprY.contains("z");
    this.ZcontainsX = this.exprZ.contains("x");
    this.ZcontainsY = this.exprZ.contains("y");
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Surface3D, descartesJS.Graphic3D);
  
  /**
   * Build the primitives corresponding to the surface
   */
  descartesJS.Surface3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    this.updateMVMatrix();

    // store the u and v parameter values
    tempParamU = evaluator.getVariable("u");
    tempParamV = evaluator.getVariable("v");

    evaluator.setVariable("u", 0);
    evaluator.setVariable("v", 0);
    Nu = evaluator.evalExpression(this.Nu);
    Nv = evaluator.evalExpression(this.Nv);

    // array to store the computed vertices 
    vertices = [];

    for (var ui=0; ui<=Nu; ui++) {
      evaluator.setVariable("u", ui/Nu);

      for (var vi=0; vi<=Nv; vi++) {
        evaluator.setVariable("v", vi/Nv);

        xEval = evaluator.evalExpression(this.exprX);
        evaluator.setVariable("x", xEval);
        yEval = evaluator.evalExpression(this.exprY);
        evaluator.setVariable("y", yEval);
        zEval = evaluator.evalExpression(this.exprZ);
        evaluator.setVariable("z", zEval);
        
        vertices.push( this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(xEval, yEval, zEval, 1)) );
      }
    }

    for (var ui=0; ui<Nu; ui++) {
      for (var vi=0; vi<Nv; vi++) {
        v = [];
        v.push(vertices[vi + ui*Nv + ui]);
        v.push(vertices[vi+1 + ui*Nv + ui]);
        v.push(vertices[vi+2 + (ui+1)*Nv  + ui]);
        v.push(vertices[vi+1 + (ui+1)*Nv  + ui]);

        this.primitives.push(new descartesJS.Primitive3D( v,
                                                          "face",
                                                          { backcolor: this.backcolor.getColor(), 
                                                            fillStyle: this.color.getColor(), 
                                                            strokeStyle: "#808080", 
                                                            lineCap: "round", 
                                                            lineJoin: "round", 
                                                            edges: this.edges, 
                                                            model: this.model
                                                          }
                                                        ));

      }
    }

    evaluator.setVariable("u", tempParamU);
    evaluator.setVariable("v", tempParamV);    
  }  

  return descartesJS;
})(descartesJS || {});