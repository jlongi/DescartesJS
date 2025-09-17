/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let evaluator;
  let expr;

  class Text3D extends descartesJS.Graphic3D {
    /**
     * A Descartes 3D text
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the triangle
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);    

      this.shadowColor = (this.shadowColor) ? this.shadowColor.getColor() : "transparent";
    }
  
    /**
     * Build the primitives corresponding to the point
     */
    buildPrimitives() {
      self = this;
      evaluator = self.evaluator;

      expr = evaluator.eval(self.expresion)[0];

      self.primitives.push(
        new descartesJS.Primitive3D( { 
          V: [new descartesJS.Vec4D(expr[0], expr[1], 0)],
          type:"text",
          frontColor: self.color.getColor(),
          font_size: self.font_size,
          font_style: self.font_style,
          font_family: self.font_family,
          decimals: evaluator.eval(self.decimals),
          fixed: self.fixed,
          displace: 0,
          isText: true,
          evaluator: evaluator,
          text: new descartesJS.TextObject(self, self.text),
          family: self.family,
          familyValue: self.fVal
        },
        self.space
      ));
    }
  }
  
  descartesJS.Text3D = Text3D;
  return descartesJS;
})(descartesJS || {});
