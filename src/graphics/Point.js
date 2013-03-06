/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  var mathRound = Math.round;
  
  /**
   * Un punto de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el punto
   */
  descartesJS.Point = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Point, descartesJS.Graphic);

  var evaluator;
  var space;
  var expr;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var coordX;
  var coordY;
  var size;
  var desp;

  /**
   * Actualiza el punto
   */
  descartesJS.Point.prototype.update = function() { 
    evaluator = this.evaluator;

    expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0]; //el primer valor de la primera expresion
    this.exprY = expr[0][1]; //el segundo valor de la primera expresion

    // se rotan los elementos en caso de ser un macro con rotacion
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }
  }

  /**
   * Dibuja el punto
   */
  descartesJS.Point.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.color, this.color);
  }

  /**
   * Dibuja el rastro del punto
   */
  descartesJS.Point.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar un punto
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el punto
   * @param {String} fill el color de relleno del punto
   */
  descartesJS.Point.prototype.drawAux = function(ctx, fill){
    evaluator = this.evaluator;
    space = this.space;

    size = mathRound(evaluator.evalExpression(this.size));
    desp = size;

    // se dibuja el punto
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);

    coordX = (this.abs_coord) ? mathRound(this.exprX) : mathRound(space.getAbsoluteX(this.exprX));
    coordY = (this.abs_coord) ? mathRound(this.exprY) : mathRound(space.getAbsoluteY(this.exprY));
     
    ctx.beginPath();
    ctx.arc(coordX, coordY, size, 0, PI2, true);
    ctx.fill()

    // se dibuja el texto
    if (this.text != [""]) {
      this.uber.drawText.call(this, ctx, this.text, coordX+desp, coordY-desp, this.color, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed);
    }

  }

  return descartesJS;
})(descartesJS || {});