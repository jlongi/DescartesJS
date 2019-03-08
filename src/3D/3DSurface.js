/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var tempParamU;
  var tempParamV;
  var tempParamX;
  var tempParamY;
  var tempParamZ;
  var Nu;
  var Nv;
  var vertices;
  var v;

  var ui;
  var vi;
  var ii;
  var ll;

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

    this.expresion = this.parseExpression();
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
    tempParamX = evaluator.getVariable("x");
    tempParamY = evaluator.getVariable("y");
    tempParamZ = evaluator.getVariable("z");
    tempParamU = evaluator.getVariable("u");
    tempParamV = evaluator.getVariable("v");

    evaluator.setVariable("u", 0);
    evaluator.setVariable("v", 0);
    Nu = parseInt(evaluator.eval(this.Nu));
    Nv = parseInt(evaluator.eval(this.Nv));

    // array to store the computed vertices 
    vertices = [];

    for (ui=0; ui<=Nu; ui++) {
      evaluator.setVariable("u", ui/Nu);

      for (vi=0; vi<=Nv; vi++) {
        evaluator.setVariable("v", vi/Nv);

        // eval all the sub terms in the expression
        for (ii=0, ll=this.expresion.length; ii<ll; ii++) {
          evaluator.eval(this.expresion[ii]);
        }

        vertices.push( this.transformVertex(new descartesJS.Vector4D(evaluator.getVariable("x"), evaluator.getVariable("y"), evaluator.getVariable("z"), 1)) );
      }
    }

    var tmpFrontColor = this.color.getColor();
    var tmpBackColor = this.backcolor.getColor();
    var tmpEdgeColor = (this.edges) ? this.edges.getColor() : "";

    for (ui=0; ui<Nu; ui++) {
      for (vi=0; vi<Nv; vi++) {
        v = [];
        v.push(vertices[vi + ui*Nv + ui]);        // 0
        v.push(vertices[vi+1 + ui*Nv + ui]);      // 1
        v.push(vertices[vi+2 + (ui+1)*Nv  + ui]); // 2
        v.push(vertices[vi+1 + (ui+1)*Nv  + ui]); // 3

        this.primitives.push( new descartesJS.Primitive3D( { vertices: v,
                                                             type: "face",
                                                             frontColor: tmpFrontColor,
                                                             backColor: tmpBackColor,
                                                             edges: tmpEdgeColor,
                                                             model: this.model
                                                           },
                                                          this.space ));

      }
    }

    evaluator.setVariable("x", tempParamX);
    evaluator.setVariable("y", tempParamY);
    evaluator.setVariable("z", tempParamZ);
    evaluator.setVariable("u", tempParamU);
    evaluator.setVariable("v", tempParamV);
  }  

  return descartesJS;
})(descartesJS || {});