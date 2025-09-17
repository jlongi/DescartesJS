/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let evaluator;
  let expr;
  let exprX;
  let exprY;
  let exprZ;
  
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
      self = this;

      evaluator = self.evaluator;

      // do not apply the rotations in the model view matrix transformation
      self.updateMVMatrix();

      expr = evaluator.eval(self.expresion)[0];
      exprX = expr[0];
      exprY = expr[1];
      exprZ = expr[2];

      self.primitives.push(
        new descartesJS.Primitive3D( { 
          V: [self.transformVertex( new descartesJS.Vec4D(exprX, exprY, exprZ) )],
          type: "vertex",
          backColor: self.backcolor.getColor(), 
          frontColor: self.color.getColor(), 
          size: evaluator.eval(self.width)
        })
      );

      // add a text primitive only if the text has content
      if (self.text !== "") {
        self.offset_dist  = self.offset_dist || evaluator.parser.parse("10");
        self.offset_angle = self.offset_angle || evaluator.parser.parse("270");

        self.primitives.push(
          new descartesJS.Primitive3D( { 
            V: [self.transformVertex( new descartesJS.Vec4D(exprX, exprY, exprZ) )],
            type: "text",
            fromPoint: true,
            frontColor: self.color.getColor(), 
            font_size:   self.font_size,
            font_style:  self.font_style,
            font_family: self.font_family,
            decimals: evaluator.eval(self.decimals),
            fixed: self.fixed,
            evaluator: evaluator,
            text: new descartesJS.TextObject(self, self.text),
            family: self.family,
            familyValue: self.fVal,
            offset_dist: self.offset_dist,
            offset_angle: self.offset_angle
          },
          self.space
        ));
      }
    }
  }

  descartesJS.Point3D = Point3D;
  return descartesJS;
})(descartesJS || {});
