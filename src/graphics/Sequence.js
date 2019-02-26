/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  var mathRound = Math.round;

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

  /**
   * A Descartes sequence
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the sequence
   */
  descartesJS.Sequence = function(parent, values) {
    /**
     * width of the point
     * type {Node}
     * @private
     */
    this.size = parent.evaluator.parser.parse("2");

    this.range = parent.evaluator.parser.parse("[1, 100]");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    // Descartes 2 visible
    this.visible = ((this.parent.version === 2) && (this.visible == undefined)) ? true : this.visible;
    if (this.visible) {
      this.registerTextField();
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Sequence, descartesJS.Graphic);

  /**
   * Update the sequence
   */
  descartesJS.Sequence.prototype.update = function() {
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
  descartesJS.Sequence.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.color, this.color);
  }

  /**
   * Draw the trace of the sequence
   */
  descartesJS.Sequence.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }

  /**
   * Auxiliary function for draw a sequence
   * @param {CanvasRenderingContext2D} ctx rendering context on which the sequence is drawn
   * @param {String} fill the fill color of the sequence
   */
  descartesJS.Sequence.prototype.drawAux = function(ctx, fill) {
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

      coordX = mathRound( (this.abs_coord) ? this.exprX : space.getAbsoluteX(this.exprX) );
      coordY = mathRound( (this.abs_coord) ? this.exprY : space.getAbsoluteY(this.exprY) );

      ctx.beginPath();
      ctx.arc(coordX, coordY, size, 0, PI2, true);
      ctx.fill()
    }

    ctx.fill();

    // draw the text of the sequence
    if (this.text !== [""]) {
      this.fontSize = Math.max( 5, evaluator.eval(this.font_size) );
      this.font = this.font_style + " " + this.fontSize + "px " + this.font_family;

      this.uber.drawText.call(this, ctx, this.text, coordX+desp, coordY-desp, this.color, this.font, "start", "alphabetic", evaluator.eval(this.decimals), this.fixed, true);
    }

    evaluator.setVariable("n", tmpValue);
  }

  /**
   * Register a text field in case the equation expression is editable
   */
  descartesJS.Sequence.prototype.registerTextField = function() {
    var textField = document.createElement("input");
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

  return descartesJS;
})(descartesJS || {});
