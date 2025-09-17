/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  const regExpType2D = "-text-image-point-polygon-arc-segment-arrow-macro-curve-equation-sequence-rectangle-fill-";

  let expr;

  class Macro extends descartesJS.BaseMacro {
    /**
     * A Descartes macro (2D)
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the macro
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values, "parseGraphic", regExpType2D);

      this.inirot = this.inirot || parent.evaluator.parser.parse("0");
      this.inipos = this.inipos || parent.evaluator.parser.parse("(0,0)");

      // assign the values to replace the defaults values of the object
      Object.assign(this, values);
    }

    /**
     * Update the macro
     */
    update() {
      expr = this.evaluator.eval(this.inipos)[0];
      this.iniPosX = expr[0];
      this.iniPosY = expr[1];
    }

    /**
     * Auxiliary function for draw a macro
     * @param {CanvasRenderingContext2D} ctx rendering context on which the macro is drawn
     */
    drawAux(ctx) {
      for (let i=0, l=this.graphics.length; i<l; i++) {
        if (this.graphics[i]) {
          ctx.save();

          if (this.graphics[i].abs_coord) {
            ctx.translate(this.iniPosX, this.iniPosY);
          }
          else {
            ctx.translate(this.iniPosX * this.space.scale, -this.iniPosY * this.space.scale);
          }

          this.graphics[i].draw();

          ctx.restore();
        }
      }
    }
  }

  descartesJS.Macro = Macro;
  return descartesJS;
})(descartesJS || {});
