/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var vertices;
  var Nu;
  var tempParamU;
  var tempParamX;
  var tempParamY;
  var tempParamZ;  

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
    
    this.expresion = this.parseExpression();
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
    tempParamX = evaluator.getVariable("x");
    tempParamY = evaluator.getVariable("y");
    tempParamZ = evaluator.getVariable("z");
    tempParamU = evaluator.getVariable("u");

    evaluator.setVariable("u", 0);
    Nu = evaluator.eval(this.Nu);

    vertices = [];

    for (var ui=0; ui<=Nu; ui++) {
      evaluator.setVariable("u", ui/Nu);

      // eval all the sub terms in the expression
      for (var ii=0, ll=this.expresion.length; ii<ll; ii++) {
        evaluator.eval(this.expresion[ii]);
      }

      vertices.push( this.transformVertex(new descartesJS.Vector4D(evaluator.getVariable("x"), evaluator.getVariable("y"), evaluator.getVariable("z"), 1)) );
    }

    for (var i=0, l=vertices.length-1; i<l; i++) {
      // this.primitives.push( new descartesJS.Primitive3D( { 
      //   vertices: [ vertices[i], vertices[i+1] ],
      //   type: "edge",
      //   frontColor: this.color.getColor(), 
      //   lineWidth: evaluator.eval(this.width)
      // },
      // this.space ));

      this.primitives.push( new descartesJS.Primitive3D( { 
        vertices: [ vertices[i], vertices[i+1] ],
        type: "edge",
        frontColor: this.color.getColor(), 
        lineWidth: evaluator.eval(this.width)
      },
      this.space ));
    }

    if ((this.fill) && (vertices.length > 2)) {
      this.primitives.push( new descartesJS.Primitive3D( { 
        vertices: vertices,
        type: "face",
        frontColor: this.fill.getColor(), 
        backColor: this.fill.getColor(), 
        edges: "", 
        model: this.model
      },
      this.space ));
    }

    evaluator.setVariable("x", tempParamX);
    evaluator.setVariable("y", tempParamZ);
    evaluator.setVariable("z", tempParamY);
    evaluator.setVariable("u", tempParamU);
  }

  return descartesJS;
})(descartesJS || {});