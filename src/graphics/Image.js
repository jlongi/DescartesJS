/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una imagen de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el imagen
   */
  descartesJS.Image = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);
    
    this.img = new Image();
    // this.img.ready = 0;
    // this.img.onload = function() {
    //   this.ready = 1;
      
    //   this.onload = function() {};
    // }
    // this.img.src = this.evaluator.evalExpression(this.file);

    this.scaleX = 1;
    this.scaleY = 1;

    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Image, descartesJS.Graphic);

  /**
   * Actualiza los valores de la imagen
   */
  descartesJS.Image.prototype.update = function() {
    var evaluator = this.evaluator;

    var expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0]; //el primer valor de la primera expresion
    this.exprY = expr[0][1]; //el segundo valor de la primera expresion

    // se rotan los elementos en caso de ser un macro con rotacion
    if (this.rotateExp) {
      var radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      var cosTheta = Math.cos(radianAngle);
      var senTheta = Math.sin(radianAngle);
      var tmpRotX;
      var tmpRotY;
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }
    
    if (expr[0].length == 4) {
      this.centered = true;
      this.scaleX = expr[0][2];
      if (this.scaleX == 0) {
        this.scaleX = .00001;
      }
      this.scaleY = expr[0][3];
      if (this.scaleY == 0) {
        this.scaleY = .00001;
      }
    }      
      
    if ((expr[1]) && (expr[1].length == 2)) {
      this.centered = true;
      this.scaleX = expr[1][0];
      if (this.scaleX == 0) {
        this.scaleX = .00001;
      }
      this.scaleY = expr[1][1];      
      if (this.scaleY == 0) {
        this.scaleY = .00001;
      }
    }
    
    var imgFile = evaluator.evalExpression(this.file);

    if ((imgFile) || (imgFile == "")) {
      this.img = this.parent.getImage(imgFile);
    }
  }
  
  /**
   * Dibuja la imagen
   */
  descartesJS.Image.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this);
  }

  /**
   * Dibuja el rastro de la imagen
   */
  descartesJS.Image.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this);
  }
  
  /**
   * Funcion auxiliar para dibujar una imagen
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja una imagen
   * @param {String} fill el color de relleno de una imagen
   * @param {String} stroke el color del trazo de una imagen
   */
  descartesJS.Image.prototype.drawAux = function(ctx, fill, stroke) {
    var evaluator = this.evaluator;

    if ( (this.img) && (this.img.ready) && (this.img.complete) ) {
      var despX = (this.centered) ? 0 : this.img.width/2;
      var despY = (this.centered) ? 0 : this.img.height/2;
      var coordX = (this.abs_coord) ? this.exprX : this.space.getAbsoluteX(this.exprX);
      var coordY = (this.abs_coord) ? this.exprY : this.space.getAbsoluteY(this.exprY);
      var rotation = descartesJS.degToRad(-evaluator.evalExpression(this.inirot));

      ctx.translate(coordX+despX, coordY+despY);
      ctx.rotate(rotation);
      ctx.scale(this.scaleX, this.scaleY);

      if (this.opacity) {
        ctx.globalAlpha = evaluator.evalExpression(this.opacity);
      }

      ctx.drawImage(this.img, -this.img.width/2, -this.img.height/2);
      
      // try {
      //   ctx.drawImage(this.img, -this.img.width/2, -this.img.height/2);
      // }
      // catch(e) {
      // }

      // se resetean las trasnformaciones
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalAlpha = 1;
    }
  }
  
  return descartesJS;
})(descartesJS || {});