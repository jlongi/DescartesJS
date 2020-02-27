/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var expr;
  var exprX;
  var exprY;
  var exprZ;
  
  class Point3D extends descartesJS.Graphic3D {
    /**
     * A Descartes 3D point
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the point
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);
    }

    /**
     * Build the primitives corresponding to the point
     */
    buildPrimitives() {
      evaluator = this.evaluator;

      // do not apply the rotations in the model view matrix transformation
      this.updateMVMatrix();

      expr = evaluator.eval(this.expresion);
      exprX = expr[0][0];
      exprY = expr[0][1];
      exprZ = expr[0][2];

      this.primitives.push( new descartesJS.Primitive3D( { 
        vertices: [this.transformVertex( new descartesJS.Vector4D(exprX, exprY, exprZ, 1) )],
        type: "vertex",
        backColor: this.backcolor.getColor(), 
        frontColor: this.color.getColor(), 
        size: evaluator.eval(this.width)
      } ) );

      // add a text primitive only if the text has content
      if (this.text !== "") {
        this.offset_dist = this.offset_dist || evaluator.parser.parse("10");
        this.offset_angle = this.offset_angle || evaluator.parser.parse("270");

        this.primitives.push( new descartesJS.Primitive3D( { 
          vertices: [this.transformVertex( new descartesJS.Vector4D(exprX, exprY, exprZ, 1) )],
          type: "text",
          fromPoint: true,
          frontColor: this.color.getColor(), 
          font_size: this.font_size,
          font_style: this.font_style,
          font_family: this.font_family,
          decimals: evaluator.eval(this.decimals),
          fixed: this.fixed,
          evaluator: evaluator,
          text: new descartesJS.TextObject(this, this.text),
          family: this.family,
          familyValue: this.familyValue,
          offset_dist: this.offset_dist,
          offset_angle: this.offset_angle
        },
        this.space ));
      }
    }
  }

  descartesJS.Point3D = Point3D;
  return descartesJS;
})(descartesJS || {});
