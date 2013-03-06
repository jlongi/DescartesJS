/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un relleno de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el relleno
   */
  descartesJS.Fill = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    // this.pixelStack = [];
    // this.startColor;
    // console.log(this.expresion, this.ctx, "|", this.space.w, this.space.h)
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Fill, descartesJS.Graphic);

  /**
   * Actualiza el relleno
   */
  descartesJS.Fill.prototype.update = function() {
    // var evaluator = this.evaluator;

    // var expr = evaluator.evalExpression(this.expresion);
    // this.exprX = expr[0][0]; //el primer valor de la primera expresion
    // this.exprY = expr[0][1]; //el segundo valor de la primera expresion

    // this.exprX = parseInt( this.space.getAbsoluteX(this.exprX+.1) );
    // this.exprY = parseInt( this.space.getAbsoluteY(this.exprY+.1) );

    // this.imageData = this.ctx.getImageData(0, 0, this.space.w, this.space.h);

    // var pixelPos = (this.exprY*this.space.w + this.exprX) * 4;
    // this.startColor = { r: this.imageData.data[pixelPos],
    //                     g: this.imageData.data[pixelPos+1],
    //                     b: this.imageData.data[pixelPos+2],
    //                     a: this.imageData.data[pixelPos+3]
    //                   }

    // this.pixelStack.push( [this.exprX, this.exprY] );
    // // console.log(this.startColor, pixelPos, this.exprX, this.exprY, this.imageData)
  }

  /**
   * Dibuja el relleno
   */
  descartesJS.Fill.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.color, this.color);
  }

  /**
   * Dibuja el rastro del relleno
   */
  descartesJS.Fill.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar un relleno
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el relleno
   * @param {String} fill el color de relleno del relleno
   */
  descartesJS.Fill.prototype.drawAux = function(ctx, fill) {
    // var evaluator = this.evaluator;
    // var fillColor = getColorComponents(descartesJS.getColor(evaluator, fill));
    // var newPos;
    // var x;
    // var y;

    // while (this.pixelStack.length) {
    //   newPos = this.pixelStack.pop();
    //   x = newPos[0];
    //   y = newPos[1];
    // }
  }

  function getColorComponents(color) {
    // var tmp;
    // var resultColor = { r: 0, g: 0, b: 0, a: 0 };

    // if (color.match(/^rgba/)) {
    //   tmp = color.substring(5, color.length-1).split(",");
    //   resultColor.r = tmp[0];
    //   resultColor.g = tmp[1];
    //   resultColor.b = tmp[2];
    //   resultColor.a = tmp[3];

    //   return resultColor;
    // }
    // else if (color.match(/^#/)) {
    //   tmp = color.substring(1);
    //   resultColor.r = parseInt(tmp.substring(0,2), 16);
    //   resultColor.g = parseInt(tmp.substring(2,4), 16);
    //   resultColor.b = parseInt(tmp.substring(4,6), 16);

    //   return resultColor;
    // }
  }

  return descartesJS;
})(descartesJS || {});