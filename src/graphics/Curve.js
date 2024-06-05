/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathRound = Math.round;

  var evaluator;
  var para;
  var space;
  var tempParam;
  var expr;
  var radianAngle;
  var tmpRot;
  var lineDesp = 0.5;
  var POS_LIMIT = 1000000;

  class Curve extends descartesJS.Graphic {
    /**
     * A Descartes curve
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the curve
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.parameter = this.parameter || "t";
      this.parameter_interval = this.parameter_interval || parent.evaluator.parser.parse("[0,1]");
      this.parameter_steps = this.parameter_steps || parent.evaluator.parser.parse("8");
      this.width = this.width || parent.evaluator.parser.parse("1");
      this.fill = this.fill || "";

      // Descartes 2 visible
      this.visible = ((this.parent.version === 2) && (this.visible == undefined)) ? true : this.visible;
      if (this.visible) {
        this.registerTextField();
      }
    }

    /**
     * Update the curve
     */
    update() {
      evaluator = this.evaluator;

      para = evaluator.eval(this.parameter_interval);

      this.paraInf = para[0][0]; // the first value of the first expression
      this.paraSup = para[0][1]; // the second value of the first expression

      this.pSteps = evaluator.eval(this.parameter_steps);
      this.paraSep = (this.pSteps > 0) ? Math.abs(this.paraSup - this.paraInf)/this.pSteps : 0;
    }

    /**
     * Draw the curve
     */
    draw() {
      super.draw(this.fill, this.color);
    }

    /**
     * Draw the trace of the curve
     */
    drawTrace() {
      super.drawTrace(this.fill, this.trace);
    }

    /**
     * Auxiliary function for draw a curve
     * @param {CanvasRenderingContext2D} ctx rendering context on which the curve is drawn
     * @param {String} fill the fill color of the curve
     * @param {String} stroke the stroke color of the curve
     */
    drawAux(ctx, fill, stroke) {
      evaluator = this.evaluator;
      space = this.space;

      // the width of a line can not be 0 or negative
      ctx.lineWidth = Math.max(
        0.000001, 
        MathRound( evaluator.eval(this.width) )
      );

      ctx.lineCap = ctx.lineJoin = "round";
      ctx.strokeStyle = stroke.getColor();

      tempParam = evaluator.getVariable(this.parameter);

      ctx.beginPath();

      evaluator.setVariable(this.parameter, this.paraInf);

      expr = evaluator.eval(this.expresion);
      this.exprX = MathRound( (this.abs_coord) ? expr[0][0] : space.getAbsoluteX(expr[0][0]) );
      this.exprY = MathRound( (this.abs_coord) ? expr[0][1] : space.getAbsoluteY(expr[0][1]) );

      // MACRO //
      // rotate the elements in case the graphic is part of a macro
      if (this.rotateExp) {
        radianAngle = descartesJS.degToRad(evaluator.eval(this.rotateExp));
        tmpRot = this.rotate(expr[0][0], expr[0][1], radianAngle);

        this.exprX = MathRound( (this.abs_coord) ? tmpRot.x : space.getAbsoluteX(tmpRot.x) );
        this.exprY = MathRound( (this.abs_coord) ? tmpRot.y : space.getAbsoluteY(tmpRot.y) );
      }
      // MACRO //

      ctx.moveTo(this.exprX+lineDesp, this.exprY+lineDesp);
      for(var i=1; i<=this.pSteps; i++) {
        evaluator.setVariable( this.parameter, (this.paraInf+(i*this.paraSep)) );

        expr = evaluator.eval(this.expresion);
    
        // MACRO //
        // rotate the elements in case the graphic is part of a macro
        if (this.rotateExp) {
          tmpRot = this.rotate(expr[0][0], expr[0][1], radianAngle);
          expr[0][0] = tmpRot.x;
          expr[0][1] = tmpRot.y;
        }
        // MACRO //

        this.exprX = MathRound( (this.abs_coord) ? expr[0][0] : space.getAbsoluteX(expr[0][0]) );
        this.exprY = MathRound( (this.abs_coord) ? expr[0][1] : space.getAbsoluteY(expr[0][1]) );

        if ( !isNaN(this.exprX) && !isNaN(this.exprY) && (this.exprX > -POS_LIMIT) && (this.exprX < POS_LIMIT) && (this.exprY > -POS_LIMIT) && (this.exprY < POS_LIMIT) ) {
          ctx.lineTo(this.exprX+lineDesp, this.exprY+lineDesp);
        }
      }

      if (this.fill) {
        ctx.fillStyle = fill.getColor();
        ctx.fill("evenodd");
      }

      this.dashStyle();
      ctx.stroke();

      // restore the dash style
      ctx.setLineDash([]);

      evaluator.setVariable(this.parameter, tempParam);
    }

    /**
     * Register a text field in case the curve expression is editable
     */
    registerTextField() {
      var textField = descartesJS.newHTML("input");
      textField.value = this.expresionString;
      textField.disabled = !(this.editable);

      var self = this;
      textField.oncontextmenu = function () { return false; };
      textField.onkeydown = function(evt) {
        if (evt.keyCode == 13) {
          self.expresion = self.evaluator.parser.parse(this.value);
          self.parent.update();
        }
      }

      this.parent.editableRegion.textFields.push(textField);
    }
  }

  descartesJS.Curve = Curve;
  return descartesJS;
})(descartesJS || {});
