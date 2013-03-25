/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  
  /**
   * Un punto de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el punto
   */
  descartesJS.Point3D = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic3D.call(this, parent, values);

    this.mvMatrix = (new descartesJS.Matrix4x4()).setIdentity();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Point3D, descartesJS.Graphic3D);

  /**
   * Actualiza el punto
   */
  descartesJS.Point3D.prototype.update = function() {
    var evaluator = this.evaluator;

    var expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0]; //el primer valor de la primera expresion
    this.exprY = expr[0][1]; //el segundo valor de la primera expresion
    this.exprZ = expr[0][2] || 0; //el segundo valor de la primera expresion

    this.mvMatrix = this.mvMatrix.setIdentity();
    this.mvMatrix = this.space.perspectiveMatrix.multiply(this.mvMatrix);

//     // se rotan los elementos en caso de ser un macro con rotacion
//     if (this.rotateExp) {
//       var radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
//       var cosTheta = Math.cos(radianAngle);
//       var senTheta = Math.sin(radianAngle);
//       var tmpRotX;
//       var tmpRotY;
//       
//       tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
//       tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
//       this.exprX = tmpRotX;
//       this.exprY = tmpRotY;
//     }
  }

  /**
   * Dibuja el punto
   */
  descartesJS.Point3D.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.color, this.backcolor);
  }

  /**
   * Dibuja el rastro del punto
   */
  descartesJS.Point3D.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar un punto
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el punto
   * @param {String} fill el color de relleno del punto
   */
  descartesJS.Point3D.prototype.drawAux = function(ctx, stroke, fill){
    var evaluator = this.evaluator;

    var p1 = this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(this.exprX, this.exprY, this.exprZ, 1.0));
    var coordX = (p1.w != 0) ? this.space.transformCoordinateX(p1.x/p1.w) : -1000000; //this.space.transformCoordinateX(p1.x);
    var coordY = (p1.w != 0) ? this.space.transformCoordinateY(p1.y/p1.w) : -1000000; //this.space.transformCoordinateY(p1.y);
    
    var width = evaluator.evalExpression(this.width);
    var desp = width;

    // se dibuja el punto
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = descartesJS.getColor(evaluator, stroke);
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(coordX, coordY, width, 0, PI2, true);
    ctx.stroke();
    ctx.fill();

    // se dibuja el texto
    if (this.text != [""]) {
      this.uber.drawText.call(this, ctx, this.text, coordX+desp, coordY+desp, this.color, this.font, "start", "hanging", evaluator.evalExpression(this.decimals), this.fixed);
    }
  }

  return descartesJS;
})(descartesJS || {});