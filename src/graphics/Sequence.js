/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  
  /**
   * Una secuencia de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la secuencia
   */
  descartesJS.Sequence = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);
    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Sequence, descartesJS.Graphic);

  /**
   * Actualiza la secuencia
   */
  descartesJS.Sequence.prototype.update = function() { 
    var evaluator = this.evaluator;

    var expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0]; //el primer valor de la primera expresion
    this.exprY = expr[0][1]; //el segundo valor de la primera expresion

    // se rotan los elementos en caso de ser un macro con rotacion
    if (this.rotateExp) {
      var radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      var cosTheta = Math.cos(radianAngle);
      var senTheta = Math.sin(radianAngle);
      var tmpRotX;
      var tmpRotY;
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }

    var range = evaluator.evalExpression(this.range);
    this.rangeInf = range[0][0];
    this.rangeMax = range[0][1];
  }

  /**
   * Dibuja la secuencia
   */
  descartesJS.Sequence.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.color, this.color);
  }

  /**
   * Dibuja el rastro de la secuencia
   */
  descartesJS.Sequence.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar una secuencia
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja la secuencia
   * @param {String} fill el color de relleno de la secuencia
   */
  descartesJS.Sequence.prototype.drawAux = function(ctx, fill){
    var evaluator = this.evaluator;
    
    var coordX;
    var coordY;
    var expr;
    var size = Math.ceil(evaluator.evalExpression(this.size)-.4);
    var desp = size;

//     ctx.save();

    // se dibuja la secuencia
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);

    ctx.beginPath();

    if (this.rangeInf > this.rangeMax) {
      var tmp = this.rangeInf;
      this.rangeInf = this.rangeMax;
      this.rangeMax = tmp;
    }
      
    var tmpValue = evaluator.getVariable("n");
    for (var i=this.rangeInf, l=this.rangeMax; i<=l; i++) {

      evaluator.setVariable("n", i);
      
      expr = evaluator.evalExpression(this.expresion);
      this.exprX = expr[0][0];
      this.exprY = expr[0][1];
      
      if (this.abs_coord) {
        coordX = expr[0][0];
        coordX = expr[0][1];
      } else {
        coordX = this.space.getAbsoluteX(expr[0][0]);
        coordY = this.space.getAbsoluteY(expr[0][1]);
      }
      
      ctx.moveTo(coordX, coordY);
      ctx.arc(coordX, coordY, size, 0, PI2, true);
    }
    evaluator.setVariable("n", tmpValue);
    
    ctx.fill();

    // se dibuja el texto
    if (this.text != [""]) {
      this.uber.drawText.call(this, ctx, this.text, coordX+desp, coordY-desp, this.color, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed);
    }

//     ctx.restore();
  }

  return descartesJS;
})(descartesJS || {});