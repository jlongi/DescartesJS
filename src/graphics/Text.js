/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var expr;
  var tmpRot;
  var posX;
  var posY;

  class Text extends descartesJS.Graphic {
    /**
     * A Descartes text
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the text
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.width = this.width || parent.evaluator.parser.parse("0");
      
      // alignment
      if (!this.align) {
        this.align = "left";
      }
      // anchor
      if (!this.anchor) {
        this.anchor = "top_left"
      };

      this.shadowColor = (this.shadowColor) ? this.shadowColor.getColor() : "transparent";

      this.text = new descartesJS.TextObject(this, this.text);
    }

    /**
     * Update the text
     */
    update() {
      evaluator = this.evaluator;

      expr = evaluator.eval(this.expresion);
      this.exprX = expr[0][0]; // the first value of the first expression
      this.exprY = expr[0][1]; // the second value of the first expression

      // rotate the elements in case the graphic is part of a macro
      if (this.rotateExp) {
        tmpRot = this.rotate(expr[0][0], expr[0][1], descartesJS.degToRad(evaluator.eval(this.rotateExp)));

        this.exprX = tmpRot.x;
        this.exprY = tmpRot.y;
      }
    }

    /**
     * Draw the text
     */
    draw() {
      super.draw(this.color);
    }

    /**
     * Draw the trace of the text
     */
    drawTrace() {
      super.drawTrace(this.trace);
    }

    /**
     * Auxiliary function for draw a text
     * @param {CanvasRenderingContext2D} ctx rendering context on which the text is drawn
     * @param {String} fill the fill color of the text
     * @param {String} stroke the stroke color of the text
     */
    drawAux(ctx, fill) {
      if (this.abs_coord) {
        posX = parseInt(this.exprX);
        posY = parseInt(this.exprY);
      }
      else {
        posX = parseInt( this.space.getAbsoluteX(this.exprX) );
        posY = parseInt( this.space.getAbsoluteY(this.exprY) );
      }

      this.text.draw(ctx, fill, posX, posY);
    }
  }

  descartesJS.Text = Text;
  return descartesJS;
})(descartesJS || {});
