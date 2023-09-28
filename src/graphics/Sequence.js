/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  var MathRound = Math.round;

  var evaluator;
  var space;
  var expr;
  var tmpRot;
  var coordX;
  var coordY;
  var range;
  var size;
  var desp;
  var tmp;

  class Sequence extends descartesJS.Graphic {
    /**
     * A Descartes sequence
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the sequence
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.size = this.size || parent.evaluator.parser.parse("2");
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

      expr = evaluator.eval(this.expresion);
      this.exprX = expr[0][0]; // the first value of the first expression
      this.exprY = expr[0][1]; // the second value of the first expression

      // rotate the elements in case the graphic is part of a macro
      if (this.rotateExp) {
        tmpRot = this.rotate(expr[0][0], expr[0][1], descartesJS.degToRad(evaluator.eval(this.rotateExp)));

        this.exprX = tmpRot.x;
        this.exprY = tmpRot.y;
      }

      range = evaluator.eval(this.range);
      this.rangeInf = range[0][0];
      this.rangeMax = range[0][1];
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

      var tmpValue = evaluator.getVariable("n");
      for (var i=this.rangeInf, l=this.rangeMax; i<=l; i++) {
        evaluator.setVariable("n", i);

        expr = evaluator.eval(this.expresion);
        this.exprX = expr[0][0];
        this.exprY = expr[0][1];

        coordX = MathRound( (this.abs_coord) ? this.exprX : space.getAbsoluteX(this.exprX) );
        coordY = MathRound( (this.abs_coord) ? this.exprY : space.getAbsoluteY(this.exprY) );

        ctx.beginPath();
        ctx.arc(coordX, coordY, size, 0, PI2, true);
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
      var textField = descartesJS.newHTML("input");
      textField.value = this.expresionString;
      textField.disabled = !(this.editable);

      var self = this;
      oncontextmenu = function (evt) { return false; };
      textField.onkeydown = function(evt) {
        if (evt.keyCode == 13) {
          self.expresion = self.evaluator.parser.parse(this.value);
          self.parent.update();
        }
      }

      this.parent.editableRegion.textFields.push(textField);
    }
  }

  descartesJS.Sequence = Sequence;
  return descartesJS;
})(descartesJS || {});
