/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var vertices;
  var v;
  var Nu;

  /**
   * A Descartes 3D curve
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the curve
   */
  descartesJS.Curve3D = function(parent, values) {
    this.width = parent.evaluator.parser.parse("1");

    // se llama al constructor del padre
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
  descartesJS.extend(descartesJS.Curve3D, descartesJS.Graphic3D);
  
  
  /**
   * Build the primitives corresponding to the curve
   */
  descartesJS.Curve3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    this.updateMVMatrix();

    // store the u and v parameter values
    tempParamU = evaluator.getVariable("u");

    evaluator.setVariable("u", 0);
    Nu = evaluator.evalExpression(this.Nu);

    vertices = [];

    for (var ui=0; ui<=Nu; ui++) {
      evaluator.setVariable("u", ui/Nu);

      xEval = evaluator.evalExpression(this.exprX);
      evaluator.setVariable("x", xEval);
      yEval = evaluator.evalExpression(this.exprY);
      evaluator.setVariable("y", yEval);
      zEval = evaluator.evalExpression(this.exprZ);
      evaluator.setVariable("z", zEval);

      vertices.push( this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(xEval, yEval, zEval, 1)) );
    }

    for (var i=0, l=vertices.length-1; i<l; i++) {
      this.primitives.push(new descartesJS.Primitive3D( [ vertices[i],
                                                          vertices[i+1] ],
                                                        "edge",
                                                        { strokeStyle: this.color.getColor(), 
                                                          lineCap: "round", 
                                                          lineJoin: "round",
                                                          lineWidth: this.evaluator.evalExpression(this.width)
                                                        }
                                                      ));
    }

    evaluator.setVariable("u", tempParamU);
  }

  return descartesJS;
})(descartesJS || {});