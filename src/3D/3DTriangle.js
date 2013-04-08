/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;

  /**
   * Un triangulo de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el triangulo
   */
  descartesJS.Triangle3D = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic3D.call(this, parent, values);

    this.width = (this.width == -1) ? this.evaluator.parser.parse("1") : this.width;
    this.mvMatrix = (new descartesJS.Matrix4x4()).setIdentity();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Triangle3D, descartesJS.Graphic3D);

  /**
   * Actualiza el triangulo
   */
  descartesJS.Triangle3D.prototype.update = function() {
    var evaluator = this.evaluator;

    var points = evaluator.evalExpression(this.expresion);
    this.endPoints = [];

    for(var i=0, l=points.length; i<l; i++){
      this.endPoints[i] = {x: points[i][0], y: points[i][1], z: points[i][2]};
    }

    this.mvMatrix = this.mvMatrix.setIdentity();
    this.mvMatrix = this.space.perspectiveMatrix.multiply(this.mvMatrix);

    var v = [];
    var depth = 0;
    var v1;
    var v2;
    for (var i=0; i<3; i++) {
      v[i] = this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(this.endPoints[i].x, 
                                                                    this.endPoints[i].y,
                                                                    this.endPoints[i].z,
                                                                    1.0));
      if (i == 0) {
        v1 = new descartesJS.Vector3D( v[i].x, v[i].y, v[i].z );
      }
      if (i == 1) {
        v2 = new descartesJS.Vector3D( v[i].x, v[i].y, v[i].z );
      }

      v[i].x = (v[i].w !== 0) ? this.space.transformCoordinateX(v[i].x / v[i].w) : -1000000;
      v[i].y = (v[i].w !== 0) ? this.space.transformCoordinateY(v[i].y / v[i].w) : -1000000;
      depth += v[i].z;
    }
    depth = depth/3;
    console.log(v1);

    this.space.scene.add(new descartesJS.Primitive3D( v,
                                                      depth,
                                                     "triangle",
                                                     { lineWidth: 2, fillStyle: descartesJS.getColor(evaluator, this.color), strokeStyle: "#808080", lineCap: "round"},
                                                     this.ctx
                                                     ));
  }

  /**
   * Dibuja el triangulo
   */
  descartesJS.Triangle3D.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.color, this.color);
  }
  
  /**
   * Dibuja el rastro del triangulo
   */
  descartesJS.Triangle3D.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar un triangulo
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el triangulo
   * @param {String} fill el color de relleno del triangulo
   */
  descartesJS.Triangle3D.prototype.drawAux = function(ctx, fill, stroke){
    var evaluator = this.evaluator;

    ctx.lineWidth = 2;
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = "#808080";
    ctx.lineCap = "round";
   
    var p1 = this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(this.endPoints[0].x, this.endPoints[0].y, this.endPoints[0].z, 1.0));
    var coordX = (p1.w !== 0) ? this.space.transformCoordinateX(p1.x/p1.w) : -1000000; //this.space.transformCoordinateX(p1.x);
    var coordY = (p1.w !== 0) ? this.space.transformCoordinateY(p1.y/p1.w) : -1000000; //this.space.transformCoordinateY(p1.y);
    
    var p2 = this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(this.endPoints[1].x, this.endPoints[1].y, this.endPoints[1].z, 1.0));
    var coordX1 = (p2.w !== 0) ? this.space.transformCoordinateX(p2.x/p2.w) : -1000000; //this.space.transformCoordinateX(p2.x);
    var coordY1 = (p2.w !== 0) ? this.space.transformCoordinateY(p2.y/p2.w) : -1000000; //this.space.transformCoordinateY(p2.y);
        
    var p3 = this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(this.endPoints[2].x, this.endPoints[2].y, this.endPoints[2].z, 1.0));
    var coordX2 = (p3.w !== 0) ? this.space.transformCoordinateX(p3.x/p3.w) : -1000000; //this.space.transformCoordinateX(p3.x);
    var coordY2 = (p3.w !== 0) ? this.space.transformCoordinateY(p3.y/p3.w) : -1000000; //this.space.transformCoordinateY(p3.y);

    ctx.beginPath();
    ctx.moveTo(coordX, coordY);
    ctx.lineTo(coordX1, coordY1);
    ctx.lineTo(coordX2, coordY2);
    ctx.closePath();
    
    // modelo de iluminacion de alambre
    if (this.model === "wire") {
      ctx.lineWidth = 1;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.stroke();
    }
    else {
      if (this.edges) {
        ctx.stroke();
      }

      ctx.fill();
    }
  }
  
  return descartesJS;
})(descartesJS || {});