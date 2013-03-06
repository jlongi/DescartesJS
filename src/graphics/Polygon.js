/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathRound = Math.round;

  /**
   * Un poligono de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el poligono
   */
  descartesJS.Polygon = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    this.width = (this.width == -1) ? this.evaluator.parser.parse("1") : this.width;
    this.endPoints = [];
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Polygon, descartesJS.Graphic);
  
  var evaluator;
  var space;
  var points;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var tmpLineWidth;
  var lineDesp;
  var coordX;
  var coordY;
  /**
   * Actualiza el poligono
   */
  descartesJS.Polygon.prototype.update = function() {
    evaluator = this.evaluator;

    points = evaluator.evalExpression(this.expresion);
    
    for(var i=0, l=points.length; i<l; i++){
      this.endPoints[i] = { x: points[i][0], y: points[i][1] };
    }
    
    // se rotan los elementos en caso de ser un macro con rotacion
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      for (var i=0, l=this.endPoints.length; i<l; i++) {
        tmpRotX = this.endPoints[i].x*cosTheta - this.endPoints[i].y*senTheta;
        tmpRotY = this.endPoints[i].x*senTheta + this.endPoints[i].y*cosTheta;
        this.endPoints[i].x = tmpRotX;
        this.endPoints[i].y = tmpRotY;
      }      
    }
  }
  
  /**
   * Dibuja el poligono
   */
  descartesJS.Polygon.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.fill, this.color);
  }
  
  /**
   * Dibuja el rastro del poligono
   */
  descartesJS.Polygon.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar un poligono
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el poligono
   * @param {String} fill el color de relleno del poligono
   */
  descartesJS.Polygon.prototype.drawAux = function(ctx, fill, stroke) {
    evaluator = this.evaluator;
    space = this.space;

    // el ancho de una linea no puede ser 0 ni negativa
    tmpLineWidth = mathRound( evaluator.evalExpression(this.width) );
    ctx.lineWidth = (tmpLineWidth > 0) ? tmpLineWidth : 0.000001;
    
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = descartesJS.getColor(evaluator, stroke);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    lineDesp = .5;

    coordX = (this.abs_coord) ? mathRound(this.endPoints[0].x) : mathRound(space.getAbsoluteX(this.endPoints[0].x));
    coordY = (this.abs_coord) ? mathRound(this.endPoints[0].y) : mathRound(space.getAbsoluteY(this.endPoints[0].y));
    
    ctx.beginPath();
    ctx.moveTo(coordX+lineDesp, coordY+lineDesp);
    
    for(var i=1, l=this.endPoints.length; i<l; i++) {
      coordX = (this.abs_coord) ? this.endPoints[i].x : space.getAbsoluteX(this.endPoints[i].x);
      coordY = (this.abs_coord) ? this.endPoints[i].y : space.getAbsoluteY(this.endPoints[i].y);
      
      ctx.lineTo(coordX+lineDesp, coordY+lineDesp);
    }
    
    // se rellena el poligono
    if (this.fill) {
      ctx.fill();
    }
    
    // se dibuja el borde
    ctx.stroke();
  }
  
  return descartesJS;
})(descartesJS || {});