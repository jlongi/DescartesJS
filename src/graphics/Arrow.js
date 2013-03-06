/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  
  /**
   * Una flecha de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la flecha
   */
  descartesJS.Arrow = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    this.width = (this.width == -1) ? this.evaluator.parser.parse("5") : this.width;

  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Arrow, descartesJS.Graphic);
  
  /**
   * Actualiza la flecha
   */
  descartesJS.Arrow.prototype.update = function() {
    var evaluator = this.evaluator;

    var points = evaluator.evalExpression(this.expresion);
    this.endPoints = [];

    for(var i=0, l=points.length; i<l; i++){
      this.endPoints[i] = {x: points[i][0], y: points[i][1]};
    }
    
    // se rotan los elementos en caso de ser un macro con rotacion
    if (this.rotateExp) {
      var radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      var cosTheta = Math.cos(radianAngle);
      var senTheta = Math.sin(radianAngle);
      var tmpRotX;
      var tmpRotY;
      
      for (var i=0, l=this.endPoints.length; i<l; i++) {
        tmpRotX = this.endPoints[i].x*cosTheta - this.endPoints[i].y*senTheta;
        tmpRotY = this.endPoints[i].x*senTheta + this.endPoints[i].y*cosTheta;
        this.endPoints[i].x = tmpRotX;
        this.endPoints[i].y = tmpRotY;
      }      
    }
    
  }

  /**
   * Dibuja la flecha
   */
  descartesJS.Arrow.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.arrow, this.color);
  }

  /**
   * Dibuja el rastro de la flecha
   */
  descartesJS.Arrow.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.arrow, this.trace);
  }

  /**
   * Funcion auxiliar para dibujar una flecha
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja la flecha
   * @param {String} fill el color de relleno de la flecha
   * @param {String} stroke el color del trazo de la flecha
   */
  descartesJS.Arrow.prototype.drawAux = function(ctx, fill, stroke){
    var evaluator = this.evaluator;
    var space = this.space;

    var midpX, midpY;
    var desp = 10 + evaluator.evalExpression(this.size);
    var width1 = evaluator.evalExpression(this.width);
    if (width1 < 1) {
      width1 = 1;
    }
    var width2 = Math.ceil(width1/2);
    var scale = space.scale;
    
    this.vect = new descartesJS.Vector2D(this.endPoints[1].x-this.endPoints[0].x, this.endPoints[1].y-this.endPoints[0].y);
    var vlength = this.vect.vectorLength();
    this.angle = this.vect.angleBetweenVectors(descartesJS.Vector2D.AXIS_X);
    
//     ctx.save();
    
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = descartesJS.getColor(evaluator, stroke);
    ctx.lineWidth = 1.0;
    
    var lineDesp = (ctx.lineWidth%2 == 0) ? 0 : 0.5
    
    var coordX, coordY, coordX1, coordY1, spear;
    if (this.abs_coord) {
      coordX =  this.endPoints[0].x;
      coordY =  this.endPoints[0].y;
      
      coordX1 = this.endPoints[1].x;
      coordY1 = this.endPoints[1].y;
    } else {
      coordX =  space.getAbsoluteX(this.endPoints[0].x);
      coordY =  space.getAbsoluteY(this.endPoints[0].y);
    
      coordX1 = space.getAbsoluteX(this.endPoints[1].x);
      coordY1 = space.getAbsoluteY(this.endPoints[1].y);        
    }
    
    var spear = evaluator.evalExpression(this.spear);
    if (spear < 0) {
      spear = 0
    }
    
    ctx.save();
    ctx.translate(coordX, coordY, vlength);
    
    if (this.abs_coord) {
      if (((this.vect.x >= 0) && (this.vect.y >= 0)) || ((this.vect.x <= 0) && (this.vect.y >= 0))) {
        ctx.rotate(this.angle)
      } else {
        ctx.rotate(-this.angle)
      }
    } else {
      vlength = vlength*scale;
      
      if (((this.vect.x >= 0) && (this.vect.y >= 0)) || ((this.vect.x <= 0) && (this.vect.y >= 0))) {
        ctx.rotate(-this.angle)
      } else {
        ctx.rotate(this.angle)
      }
    }
    
    ctx.beginPath();
//     ctx.moveTo(-width2 +.5,                         MathFloor(-width2) +.5);
//     ctx.lineTo(MathFloor(vlength-spear-width1) +.5, MathFloor(-width2) +.5);
//     ctx.lineTo(MathFloor(vlength-2*spear) +.5,      MathFloor(-spear-width2) +.5);
//     ctx.lineTo(MathFloor(vlength) +.5,             .5);
//     ctx.lineTo(MathFloor(vlength-2*spear) +.5,      MathFloor(spear+width2) +.5);
//     ctx.lineTo(MathFloor(vlength-spear-width1) +.5, MathFloor(width2) +.5);
//     ctx.lineTo(-width2 +.5,                         MathFloor(width2) +.5);
    ctx.moveTo(-width2 +.5,                         MathFloor(-width2) +.5);
    ctx.lineTo(MathFloor(vlength-spear-width1) +.5, MathFloor(-width2) +.5);
    ctx.lineTo(MathFloor(vlength-2*spear) +.5,      MathFloor(-spear-width2) +.5);
    ctx.lineTo(MathFloor(vlength) +.5,              0);
    ctx.lineTo(MathFloor(vlength-2*spear) +.5,      MathFloor(spear+width2) -.5);
    ctx.lineTo(MathFloor(vlength-spear-width1) +.5, MathFloor(width2) -.5);
    ctx.lineTo(-width2 +.5,                         MathFloor(width2) -.5);
    
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
    
    // se dibuja el texto
    if (this.text != [""]) {
      midpX = (coordX + coordX1)/2;
      midpY = (coordY + coordY1)/2;
      
      this.uber.drawText.call(this, ctx, this.text, midpX, midpY, stroke, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed);
    }
    
//     ctx.restore();
  }
  
  return descartesJS;
})(descartesJS || {});