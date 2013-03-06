/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un poligono de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el poligono
   */
  descartesJS.Polireg3D = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic3D.call(this, parent, values);

    this.width = (this.width == -1) ? this.evaluator.parser.parse("2") : this.width;
    this.length = (this.length == -1) ? this.evaluator.parser.parse("2") : this.length;

    this.mvMatrix = (new descartesJS.Matrix4x4()).setIdentity();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Polireg3D, descartesJS.Graphic3D);
  
  /**
   * Actualiza el poligono
   */
  descartesJS.Polireg3D.prototype.update = function() {
    var evaluator = this.evaluator;

    this.endPoints = [];

    this.numPoints = evaluator.evalExpression(this.Nu);
    var angle = (2*Math.PI)/this.numPoints;

    for(var i=0, l=this.numPoints; i<l; i++){
      this.endPoints[i] = {x: 0.5*Math.cos(i*angle), y: 0.5*Math.sin(i*angle), z: 0};
    }

    this.mvMatrix = this.mvMatrix.setIdentity();
    this.mvMatrix = this.mvMatrix.scale(new descartesJS.Vector3D(evaluator.evalExpression(this.width), evaluator.evalExpression(this.length)));
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
   * Dibuja el poligono
   */
  descartesJS.Polireg3D.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.color, this.color);
  }
  
  /**
   * Dibuja el rastro del poligono
   */
  descartesJS.Polireg3D.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar un poligono
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el poligono
   * @param {String} fill el color de relleno del poligono
   */
  descartesJS.Polireg3D.prototype.drawAux = function(ctx, fill, stroke) {
    if (this.numPoints != 0) {
    var evaluator = this.evaluator;

    ctx.lineWidth = 1;
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = "#808080";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    var originX = this.space.transformCoordinateX(0);
    var originY = this.space.transformCoordinateY(0);
    
    var p1 = this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(this.endPoints[0].x, this.endPoints[0].y, this.endPoints[0].z, 1.0));
    var coordX = (p1.w != 0) ? this.space.transformCoordinateX(p1.x/p1.w) : -1000000; //this.space.transformCoordinateX(p1.x);
    var coordY = (p1.w != 0) ? this.space.transformCoordinateY(p1.y/p1.w) : -1000000; //this.space.transformCoordinateY(p1.y);    
    var p2;
    var coordX1;
    var coordX1;
    
    ctx.beginPath();
    
    for(var i=1, l=this.endPoints.length; i<l; i++) {
      p2 = this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(this.endPoints[i].x, this.endPoints[i].y, this.endPoints[i].z, 1.0));
      coordX1 = (p2.w != 0) ? this.space.transformCoordinateX(p2.x/p2.w) : -1000000; //this.space.transformCoordinateX(p1.x);
      coordY1 = (p2.w != 0) ? this.space.transformCoordinateY(p2.y/p2.w) : -1000000; //this.space.transformCoordinateY(p1.y);    

      ctx.moveTo(originX, originY);
      ctx.lineTo(coordX, coordY);
      ctx.lineTo(coordX1, coordY1);
      
      coordX = coordX1;
      coordY = coordY1;
    }
    p2 = this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(this.endPoints[0].x, this.endPoints[0].y, this.endPoints[0].z, 1.0));
    coordX1 = (p2.w != 0) ? this.space.transformCoordinateX(p2.x/p2.w) : -1000000; //this.space.transformCoordinateX(p1.x);
    coordY1 = (p2.w != 0) ? this.space.transformCoordinateY(p2.y/p2.w) : -1000000; //this.space.transformCoordinateY(p1.y);    

    ctx.moveTo(originX, originY);
    ctx.lineTo(coordX, coordY);
    ctx.lineTo(coordX1, coordY1);
              
    // modelo de iluminacion de alambre
    if (this.model == "wire") {
      ctx.strokeStyle = ctx.fillStyle;
      ctx.stroke();
    }
    else {
      ctx.fill();

      if (this.edges) {
        ctx.stroke();
      }
    }
    }   
  }
  
  return descartesJS;
})(descartesJS || {});
