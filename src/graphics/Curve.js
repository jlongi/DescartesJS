/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathRound = Math.round;

  /**
   * A Descartes curve
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the curve
   */
  descartesJS.Curve = function(parent, values) {
    /**
     * parameter for drawing a curve
     * type {String}
     * @private
     */
    this.parameter = "t";
    
    /**
     * the interval of the curve
     * type {Node}
     * @private
     */
    this.parameter_interval = parent.evaluator.parser.parse("[0,1]");

    /**
     * the number of steps of the curve
     * type {Node}
     * @private
     */
    this.parameter_steps = parent.evaluator.parser.parse("8");

    /**
     * the stroke width of the graph
     * type {Number}
     * @private
     */
    this.width = parent.evaluator.parser.parse("1");

    /**
     * the condition and the color of the fill
     * type {String}
     * @private
     */
    this.fill = "";

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    // Descartes 2 visible
    this.visible = ((this.parent.version == 2) && (this.visible == undefined)) ? true : false;
    if (this.visible) {
      this.registerTextField();
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Curve, descartesJS.Graphic);
  
  var evaluator;
  var para;
  var space;
  var tmpLineWidth;
  var lineDesp;
  var tempParam;
  var expr;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;

  /**
   * Update the curve
   */
  descartesJS.Curve.prototype.update = function() {
    evaluator = this.evaluator;

    para = evaluator.evalExpression(this.parameter_interval);

    this.paraInf = para[0][0]; // the first value of the first expression
    this.paraSup = para[0][1]; // the second value of the first expression

    this.pSteps = evaluator.evalExpression(this.parameter_steps);
    this.paraSep = (this.pSteps > 0) ? Math.abs(this.paraSup - this.paraInf)/this.pSteps : 0;
  }

  /**
   * Draw the curve
   */
  descartesJS.Curve.prototype.draw = function(){
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.fill, this.color);
  }

  /**
   * Draw the trace of the curve
   */
  descartesJS.Curve.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.fill, this.trace);
  }
  
  /**
   * Auxiliary function for draw a curve
   * @param {CanvasRenderingContext2D} ctx rendering context on which the curve is drawn
   * @param {String} fill the fill color of the curve
   * @param {String} stroke the stroke color of the curve
   */
  descartesJS.Curve.prototype.drawAux = function(ctx, fill, stroke){
    evaluator = this.evaluator;
    space = this.space;

    // the width of a line can not be 0 or negative
    tmpLineWidth = mathRound( evaluator.evalExpression(this.width) );
    ctx.lineWidth = (tmpLineWidth > 0) ? tmpLineWidth : 0.000001;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = stroke.getColor();
    
    tempParam = evaluator.getVariable(this.parameter);
    
    ctx.beginPath();
    
    evaluator.setVariable(this.parameter, this.paraInf);
    
    expr = evaluator.evalExpression(this.expresion);
    this.exprX = (this.abs_coord) ? mathRound(expr[0][0]) : mathRound(space.getAbsoluteX(expr[0][0]));
    this.exprY = (this.abs_coord) ? mathRound(expr[0][1]) : mathRound(space.getAbsoluteY(expr[0][1]));

    // MACRO //
    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }
    // MACRO //
    
    lineDesp = .5;

    ctx.moveTo(this.exprX+lineDesp, this.exprY+lineDesp);
    for(var i=1; i<=this.pSteps; i++) {
      evaluator.setVariable( this.parameter, (this.paraInf+(i*this.paraSep)) );
      
      expr = evaluator.evalExpression(this.expresion);
      this.exprX = (this.abs_coord) ? mathRound(expr[0][0]) : mathRound(space.getAbsoluteX(expr[0][0]));
      this.exprY = (this.abs_coord) ? mathRound(expr[0][1]) : mathRound(space.getAbsoluteY(expr[0][1]));

      // MACRO //
      // rotate the elements in case the graphic is part of a macro
      if (this.rotateExp) {
        tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
        tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
        this.exprX = tmpRotX;
        this.exprY = tmpRotY;
      }
      // MACRO //
      
      ctx.lineTo(this.exprX+lineDesp, this.exprY+lineDesp);
    }
        
    if (this.fill) {
      ctx.fillStyle = fill.getColor();
      ctx.fill();
    }
    ctx.stroke();
    
    evaluator.setVariable(this.parameter, tempParam);        
  }
    
  /**
   * Register a text field in case the curve expression is editable
   */
  descartesJS.Curve.prototype.registerTextField = function() {
    var textField = document.createElement("input");
    textField.value = this.expresionString;
    textField.disabled = !(this.editable);

    var self = this;
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