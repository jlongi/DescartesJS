/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var v1_x;
  var v1_y;
  var v1_z;
  var v2_x;
  var v2_y;
  var v2_z;  

  /**
   * A Descartes 3D polyline
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the polygon
   */
  descartesJS.Polygon3D = function(parent, values) {

    this.width = parent.evaluator.parser.parse("1");

    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Polygon3D, descartesJS.Graphic3D);
  
  /**
   * Build the primitives corresponding to the polygon
   */
  descartesJS.Polygon3D.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    // do not apply the rotations in the model view matrix transformation
    this.updateMVMatrix();

    expr = evaluator.evalExpression(this.expresion);

    for (var i=0, l=expr.length-1; i<l; i++) {
      v1_x = expr[i][0];
      v1_y = expr[i][1];
      v1_z = expr[i][2];

      v2_x = expr[i+1][0];
      v2_y = expr[i+1][1];
      v2_z = expr[i+1][2];

      this.primitives.push( new descartesJS.Primitive3D( { vertices: [ this.transformVertex( new descartesJS.Vector4D(v1_x, v1_y, v1_z, 1) ),
                                                                       this.transformVertex( new descartesJS.Vector4D(v2_x, v2_y, v2_z, 1) )
                                                                     ],
                                                           type: "edge",
                                                           frontColor: this.color.getColor(), 
                                                           lineWidth: evaluator.evalExpression(this.width)
                                                         },
                            this.space ));

    }
  }
  
  return descartesJS;
})(descartesJS || {});