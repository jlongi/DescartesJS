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

    this.mvMatrix = (new descartesJS.Matrix4x4()).setIdentity();
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
      this.primitives.push(new descartesJS.Primitive3D( [ vertices[0],
                                                          vertices[i+1],
                                                          (i+2 <= Nu) ? vertices[i+2] : vertices[1] ],
                                                        "face",
                                                        { backcolor: this.color.getColor(), 
                                                          fillStyle: this.backcolor.getColor(), 
                                                          strokeStyle: "#808080", 
                                                          lineCap: "round",
                                                          lineJoin: "round",
                                                          edges: this.edges, 
                                                          model: this.model,
                                                          fcolor: this.color,
                                                          bcolor: this.backcolor
                                                        }
                                                      ));
    }

  }
  
  return descartesJS;
})(descartesJS || {});