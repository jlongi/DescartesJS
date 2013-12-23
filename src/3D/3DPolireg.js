/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var Nu;
  var vertices;
  var w;
  var l;
  var theta;

  /**
   * A Descartes 3D regular polygon
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the triangle
   */
  descartesJS.Polireg3D = function(parent, values) {
    this.width = parent.evaluator.parser.parse("2");
    this.length = parent.evaluator.parser.parse("2");

    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Polireg3D, descartesJS.Graphic3D);
  
  /**
   * Build the primitives corresponding to the regular polygon
   */
  descartesJS.Polireg3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    this.updateMVMatrix();

    Nu = evaluator.evalExpression(this.Nu);

    vertices = [this.transformVertex( new descartesJS.Vector4D(0, 0, 0, 1) )];
    w = evaluator.evalExpression(this.width)/2;
    l = evaluator.evalExpression(this.length)/2;
    theta = (2*Math.PI) / Nu;

    for (var i=0; i<Nu; i++) {
      vertices.push ( this.transformVertex( new descartesJS.Vector4D(w*Math.cos(theta*i), l*Math.sin(theta*i), 0, 1) ) );
    }

    for (var i=0; i<Nu; i++) {
      this.primitives.push( new descartesJS.Primitive3D( { vertices: [ vertices[0],
                                                                       (i+2 <= Nu) ? vertices[i+2] : vertices[1],
                                                                       vertices[i+1]
                                                                     ],
                                                           type: "face",
                                                           frontColor: this.color.getColor(), 
                                                           backColor: this.backcolor.getColor(), 
                                                           edges: this.edges, 
                                                           model: this.model
                                                         },
                            this.space ));
    }

  }
  
  return descartesJS;
})(descartesJS || {});