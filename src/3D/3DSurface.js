/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una superficie de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la superficie
   */
  descartesJS.Surface3D = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic3D.call(this, parent, values);

    var parser = this.evaluator.parser;
    
    this.width = (this.width == -1) ? parser.parse("1") : this.width;

    this.mvMatrix = (new descartesJS.Matrix4x4()).setIdentity();

    this.exprX = parser.parse( this.findExpresionX(this.expresion) );
    this.exprY = parser.parse( this.findExpresionY(this.expresion) );
    this.exprZ = parser.parse( this.findExpresionZ(this.expresion) );
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Surface3D, descartesJS.Graphic3D);
  
  var evaluator;
  var tempParamU;
  var tempParamV;
  var Nu;
  var Nv;
  var xEval;
  var yEval;
  var zEval;
  var vertices;
  var faces;
  var v;
  var fillStyle;

  /**
   * Actualiza la superficie
   */
  descartesJS.Surface3D.prototype.update = function() {
    evaluator = this.evaluator;
    tempParamU = evaluator.getVariable("u");
    tempParamV = evaluator.getVariable("v");  
    evaluator.setVariable("u", 0);
    evaluator.setVariable("v", 0);
    Nu = evaluator.evalExpression(this.Nu);
    Nv = evaluator.evalExpression(this.Nv);

    fillStyle = descartesJS.getColor(evaluator, this.color);

    vertices = [];
    faces = [];

    for (var ui=0; ui<=Nu; ui++) {
      evaluator.setVariable("u", ui/Nu);

      for (var vi=0; vi<=Nv; vi++) {
        evaluator.setVariable("v", vi/Nv);
        xEval = evaluator.evalExpression(this.exprX);
        yEval = evaluator.evalExpression(this.exprY);
        evaluator.setVariable("x", xEval);
        evaluator.setVariable("y", yEval);
        zEval = evaluator.evalExpression(this.exprZ);
        
        // vertices.push( this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(xEval, yEval, zEval, 1)) );

        vertices.push( new descartesJS.Vector4D(xEval, yEval, zEval, 1) );
      }
    }

    for (var ui=0; ui<Nu; ui++) {
      for (var vi=0; vi<Nv; vi++) {
        v = [];
        v.push(vertices[vi + ui*Nv + ui]);
        v.push(vertices[vi+1 + ui*Nv + ui]);
        v.push(vertices[vi+2 + (ui+1)*Nv  + ui]);
        v.push(vertices[vi+1 + (ui+1)*Nv  + ui]);

        this.space.scene.add(new descartesJS.Primitive3D( v,
                                                          "face",
                                                          { lineWidth: 2, fillStyle: fillStyle, strokeStyle: "#808080", lineCap: "round", lineJoin: "round", edges: this.edges},
                                                          this.mvMatrix,
                                                          this.ctx
                                                        ));

      }
    }
  }

  return descartesJS;
})(descartesJS || {});