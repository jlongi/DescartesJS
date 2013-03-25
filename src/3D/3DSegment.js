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
  descartesJS.Segment3D = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic3D.call(this, parent, values);

    this.width = (this.width == -1) ? this.evaluator.parser.parse("1") : this.width;
    this.mvMatrix = (new descartesJS.Matrix4x4()).setIdentity();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Segment3D, descartesJS.Graphic3D);

  /**
   * Actualiza el segmento
   */
  descartesJS.Segment3D.prototype.update = function() {
    var evaluator = this.evaluator;

    var points = evaluator.evalExpression(this.expresion);
    this.endPoints = [];

    for(var i=0, l=points.length; i<l; i++){
      this.endPoints[i] = {x: points[i][0], y: points[i][1], z: points[i][2]};
    }

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
//       for (var i=0, l=this.endPoints.length; i<l; i++) {
//         tmpRotX = this.endPoints[i].x*cosTheta - this.endPoints[i].y*senTheta;
//         tmpRotY = this.endPoints[i].x*senTheta + this.endPoints[i].y*cosTheta;
//         this.endPoints[i].x = tmpRotX;
//         this.endPoints[i].y = tmpRotY;
//       }      
//     }
  }

  /**
   * Dibuja el segmento
   */
  descartesJS.Segment3D.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.color, this.color);
  }
  
  /**
   * Dibuja el rastro del segmento
   */
  descartesJS.Segment3D.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar un segmento
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el segmento
   * @param {String} fill el color de relleno del segmento
   */
  descartesJS.Segment3D.prototype.drawAux = function(ctx, fill, stroke){
    var evaluator = this.evaluator;

    // el ancho de una linea no puede ser 0 ni negativa
    var tmpLineWidth = evaluator.evalExpression(this.width);
    if (tmpLineWidth <=0) {
      tmpLineWidth = 0.000001;
    }
    ctx.lineWidth = tmpLineWidth;

    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = descartesJS.getColor(evaluator, stroke);
    ctx.lineCap = "round";
   
    var p1 = this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(this.endPoints[0].x, this.endPoints[0].y, this.endPoints[0].z, 1.0));
    var coordX = (p1.w != 0) ? this.space.transformCoordinateX(p1.x/p1.w) : -1000000; //this.space.transformCoordinateX(p1.x);
    var coordY = (p1.w != 0) ? this.space.transformCoordinateY(p1.y/p1.w) : -1000000; //this.space.transformCoordinateY(p1.y);
    
    var p2 = this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(this.endPoints[1].x, this.endPoints[1].y, this.endPoints[1].z, 1.0));
    var coordX1 = (p2.w != 0) ? this.space.transformCoordinateX(p2.x/p2.w) : -1000000; //this.space.transformCoordinateX(p2.x);
    var coordY1 = (p2.w != 0) ? this.space.transformCoordinateY(p2.y/p2.w) : -1000000; //this.space.transformCoordinateY(p2.y);
        
    ctx.beginPath();
    ctx.moveTo(coordX, coordY);
    ctx.lineTo(coordX1, coordY1);
    
    ctx.stroke();
  }
  
  return descartesJS;
})(descartesJS || {});