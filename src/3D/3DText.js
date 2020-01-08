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

  class Text3D extends descartesJS.Graphic3D {
    /**
     * A Descartes 3D text
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the triangle
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

      expr = evaluator.eval(this.expresion);
      exprX = expr[0][0];
      exprY = expr[0][1];
      exprZ = 0;

      this.primitives.push( new descartesJS.Primitive3D( { 
        vertices: [new descartesJS.Vector4D(exprX, exprY, exprZ, 1)],
        type:"text",
        frontColor: this.color.getColor(),
        font_size: this.font_size,
        font_style: this.font_style,
        font_family: this.font_family,
        decimals: evaluator.eval(this.decimals),
        fixed: this.fixed,
        displace: 0,
        isText: true,
        evaluator: evaluator,
        text: new descartesJS.TextObject(this, this.text),
        family: this.family,
        familyValue: this.familyValue
      },
      this.space ));
    }
  }
  
  descartesJS.Text3D = Text3D;
  return descartesJS;
})(descartesJS || {});
