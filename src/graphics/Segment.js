/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;

  /**
   * Un segmento de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el segmento
   */
  descartesJS.Segment = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    this.width = (this.width == -1) ? this.evaluator.parser.parse("1") : this.width;

  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Segment, descartesJS.Graphic);

  /**
   * Actualiza el segmento
   */
  descartesJS.Segment.prototype.update = function() {
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
   * Dibuja el segmento
   */
  descartesJS.Segment.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.color, this.color);
  }
  
  /**
   * Dibuja el rastro del segmento
   */
  descartesJS.Segment.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar un segmento
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el segmento
   * @param {String} fill el color de relleno del segmento
   */
  descartesJS.Segment.prototype.drawAux = function(ctx, fill, stroke){
    var evaluator = this.evaluator;

    // el ancho de una linea no puede ser 0 ni negativa
    var tmpLineWidth = evaluator.evalExpression(this.width);
    if (tmpLineWidth <=0) {
      tmpLineWidth = 0.000001;
    }
    ctx.lineWidth = tmpLineWidth;

    var desp, midpX, midpY;
    
    var size = evaluator.evalExpression(this.size);
    if (size < 0) {
      size = 0;
    }
    
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = descartesJS.getColor(evaluator, stroke);
    ctx.lineCap = "round";
    
    desp = 10+ctx.lineWidth;
    
    var lineDesp = (ctx.lineWidth%2 == 0) ? 0 : 0.5;
    
    var coordX, coordY, coordX1, coordY1, spear;      
    if (this.abs_coord) {
      coordX =  this.endPoints[0].x;
      coordY =  this.endPoints[0].y;
      coordX1 = this.endPoints[1].x;
      coordY1 = this.endPoints[1].y;
    } else {
      coordX =  this.space.getAbsoluteX(this.endPoints[0].x);
      coordY =  this.space.getAbsoluteY(this.endPoints[0].y);
      coordX1 = this.space.getAbsoluteX(this.endPoints[1].x);
      coordY1 = this.space.getAbsoluteY(this.endPoints[1].y);        
    }
    
    var size = evaluator.evalExpression(this.size);
    if (size < 0) {
      size = 0;
    }
    
    ctx.beginPath();
    ctx.moveTo(coordX+lineDesp, coordY+lineDesp);
    ctx.lineTo(coordX1+lineDesp, coordY1+lineDesp);
    
    // se dibuja el texto
    if (this.text != [""]) {
      midpX = (coordX + coordX1)/2;
      midpY = (coordY + coordY1)/2;
      
      this.uber.drawText.call(this, ctx, this.text, midpX+desp, midpY-desp, this.color, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed);
    }
    
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(coordX, coordY, size, 0, PI2, true);
    ctx.arc(coordX1, coordY1, size, 0, PI2, true);
    ctx.fill();
    
//     ctx.restore();
  }
  
  return descartesJS;
})(descartesJS || {});