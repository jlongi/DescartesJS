/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una curva de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la curva
   */
  descartesJS.Curve3D = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic3D.call(this, parent, values);

    var parser = this.evaluator.parser;
    
    this.width = (this.width == -1) ? parser.parse("1") : this.width;

    this.mvMatrix = (new descartesJS.Matrix4x4()).setIdentity();

    this.exprX = parser.parse( this.findExpresionX(this.expresion) );
    this.exprY = parser.parse( this.findExpresionY(this.expresion) );
    this.exprZ = parser.parse( this.findExpresionZ(this.expresion) );
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Curve3D, descartesJS.Graphic3D);
  
  /**
   * Actualiza la curva
   */
  descartesJS.Curve3D.prototype.update = function() {
    var evaluator = this.evaluator;

    this.mvMatrix = this.mvMatrix.setIdentity();
    this.mvMatrix = this.space.perspectiveMatrix.multiply(this.mvMatrix);    
  }

  /**
   * dibuja la curva
   */
  descartesJS.Curve3D.prototype.draw = function(){
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.fill, this.color);
  }

  /**
   * Dibuja el rastro de la curva
   */
  descartesJS.Curve3D.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.fill, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar una curva
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja una curva
   * @param {String} fill el color de relleno de una curva
   * @param {String} stroke el color del trazo de una curva
   */
  descartesJS.Curve3D.prototype.drawAux = function(ctx, fill, stroke){
    var evaluator = this.evaluator;
    var space = this.space;

    // el ancho de una linea no puede ser 0 ni negativa
    var tmpLineWidth = this.evaluator.evalExpression(this.width);
    if (tmpLineWidth <=0) {
      tmpLineWidth = 0.000001;
    }
    ctx.lineWidth = tmpLineWidth;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = descartesJS.getColor(evaluator, stroke);
    
    var tempParam = evaluator.getVariable("u");
    
    ctx.beginPath();
    
    evaluator.setVariable("u", 0);

    var Nu = evaluator.evalExpression(this.Nu);
    var p1 = this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(evaluator.evalExpression(this.exprX),
                                                                    evaluator.evalExpression(this.exprY),
                                                                    evaluator.evalExpression(this.exprZ),
                                                                    1.0
                                                                   ));
    var coordX = (p1.w != 0) ? this.space.transformCoordinateX(p1.x/p1.w) : -1000000; //this.space.transformCoordinateX(p1.x);
    var coordY = (p1.w != 0) ? this.space.transformCoordinateY(p1.y/p1.w) : -1000000; //this.space.transformCoordinateY(p1.y);

    ctx.moveTo(coordX, coordY);
    
    for(var i=1; i<=Nu; i++) {
      evaluator.setVariable("u", i/Nu);
      
      p1 = this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(evaluator.evalExpression(this.exprX),
                                                                  evaluator.evalExpression(this.exprY),
                                                                  evaluator.evalExpression(this.exprZ),
                                                                  1.0
                                                                 ));
      coordX = (p1.w != 0) ? this.space.transformCoordinateX(p1.x/p1.w) : -1000000; //this.space.transformCoordinateX(p1.x);
      coordY = (p1.w != 0) ? this.space.transformCoordinateY(p1.y/p1.w) : -1000000; //this.space.transformCoordinateY(p1.y);
      
      ctx.lineTo(coordX, coordY);
    }

    ctx.stroke();
    
    evaluator.setVariable("u", tempParam);
  }

  return descartesJS;
})(descartesJS || {});