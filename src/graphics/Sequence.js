/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let PI2 = Math.PI*2;
  let MathRound = Math.round;

  let evaluator;
  let space;
  let expr;
  let tmpRot;
  let coordX;
  let coordY;
  let range;
  let size;
  let desp;
  let tmp;

  class Sequence extends descartesJS.Graphic {
    /**
     * A Descartes sequence
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the sequence
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.size  = this.size || parent.evaluator.parser.parse("2");
      this.range = this.range || parent.evaluator.parser.parse("[1, 100]");

      // Descartes 2 visible
      this.visible = ((this.parent.version === 2) && (this.visible == undefined)) ? true : this.visible;
      if (this.visible) {
        this.registerTextField();
      }
    }

    /**
     * Update the sequence
     */
    update() {
      evaluator = this.evaluator;

      [this.X, this.Y] = evaluator.eval(this.expresion)[0];

      // rotate the elements in case the graphic is part of a macro
      if (this.rotateExp) {
        tmpRot = this.rotate(this.X, this.Y, descartesJS.degToRad(evaluator.eval(this.rotateExp)));
        this.X = tmpRot.x;
        this.Y = tmpRot.y;
      }

      range = evaluator.eval(this.range)[0];
      this.rangeInf = range[0];
      this.rangeMax = range[1];
    }

    /**
     * Draw the sequence
     */
    draw() {
      super.draw(this.color, this.color);
    }

    /**
     * Draw the trace of the sequence
     */
    drawTrace() {
      super.drawTrace(this.trace, this.trace);
    }

    /**
     * Auxiliary function for draw a sequence
     * @param {CanvasRenderingContext2D} ctx rendering context on which the sequence is drawn
     * @param {String} fill the fill color of the sequence
     */
    drawAux(ctx, fill) {
      evaluator = this.evaluator;
      space = this.space;

      desp = size = Math.ceil(evaluator.eval(this.size) - 0.4);

      ctx.fillStyle = fill.getColor();

      ctx.beginPath();

      if (this.rangeInf > this.rangeMax) {
        tmp = this.rangeInf;
        this.rangeInf = this.rangeMax;
        this.rangeMax = tmp;
      }

      let tmpValue = evaluator.getVariable("n");

      for (let i=this.rangeInf, l=this.rangeMax; i<=l; i++) {
        evaluator.setVariable("n", i);

        [this.X, this.Y] = evaluator.eval(this.expresion)[0];

        coordX = MathRound( (this.abs_coord) ? this.X : space.getAbsoluteX(this.X) );
        coordY = MathRound( (this.abs_coord) ? this.Y : space.getAbsoluteY(this.Y) );

        ctx.beginPath();
        ctx.arc(coordX, coordY, size, 0, PI2);
        ctx.fill()
      }

      ctx.fill();

      // draw the text of the sequence
      if (this.text != [""]) {
        this.fontSize = Math.max( 5, evaluator.eval(this.font_size) );
        this.font = this.font_style + " " + this.fontSize + "px " + this.font_family;

        super.drawText(ctx, this.text, coordX+desp, coordY-desp, this.color, this.font, "start", "alphabetic", evaluator.eval(this.decimals), this.fixed, true);
      }

      evaluator.setVariable("n", tmpValue);
    }

    /**
     * Register a text field in case the equation expression is editable
     */
    registerTextField() {
      let self = this;

      let textField = descartesJS.newHTML("input");
      textField.value = self.expresionString;
      textField.disabled = !(self.editable);

      textField.onkeydown = function(evt) {
        if (evt.keyCode == 13) {
          self.expresion = self.evaluator.parser.parse(this.value);
          self.parent.update();
        }
      }

      self.parent.editableRegion.textFields.push(textField);
    }
  }

  descartesJS.Sequence = Sequence;
  return descartesJS;
})(descartesJS || {});
