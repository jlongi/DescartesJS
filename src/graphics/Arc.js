/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  /**
   * Un arco de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el arco
   */
  descartesJS.Arc = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);
    
    this.width = (this.width == -1) ? this.evaluator.parser.parse("1") : this.width;    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Arc, descartesJS.Graphic);

  /**
   * Actualiza el arco
   */
  descartesJS.Arc.prototype.update = function() {
    var evaluator = this.evaluator;

    var expr = evaluator.evalExpression(this.center);
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

    var iniAng = evaluator.evalExpression(this.init);
    var endAng = evaluator.evalExpression(this.end);

    // si la expresion del angulo inicial y el final son expresiones parentizadas, entonces los angulos estan especificados como vectores
    if ( ((this.init.type == "(expr)") && (this.end.type == "(expr)")) || 
         ((this.init.type == "[expr]") && (this.end.type == "[expr]")) || 
         ((this.init.type == "(expr)") && (this.end.type == "[expr]")) || 
         ((this.init.type == "[expr]") && (this.end.type == "(expr)")) 
       ) {
      this.vectors = true;
      var u1 = iniAng[0][0];
      var u2 = iniAng[0][1];
      var v1 = endAng[0][0];
      var v2 = endAng[0][1];
    
      var w1 = 1;
      var w2 = 0;
      var angulo1;
      var angulo2;
      
      // se encuentran los angulos
      angulo1 = Math.acos( (u1*w1+u2*w2)/Math.sqrt(u1*u1+u2*u2) );
      angulo2 = Math.acos( (v1*w1+v2*w2)/Math.sqrt(v1*v1+v2*v2) );

      // cambio en base al cuadrante para el primer angulo
      if ((u1 > 0) && (u2 > 0) && !this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      if ((u1 > 0) && (u2 < 0) && this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      if ((u1 < 0) && (u2 < 0) && this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      if ((u1 < 0) && (u2 > 0) && !this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      
      // cambio en base al cuadrante para el segundo angulo
      if ((v1 > 0) && (v2 > 0) && !this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      if ((v1 > 0) && (v2 < 0) && this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      if ((v1 < 0) && (v2 < 0) && this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      if ((v1 < 0) && (v2 > 0) && !this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      
//       this.anguloInterior = Math.acos( (u1*v1+u2*v2)/(Math.sqrt(u1*u1+u2*u2)*Math.sqrt(v1*v1+v2*v2)) );

      // se escoge siempre los angulos en orden del menor al mayor
      var tmpAngulo1 = Math.min(angulo1, angulo2);
      var tmpAngulo2 = Math.max(angulo1, angulo2);
      angulo1 = tmpAngulo1;
      angulo2 = tmpAngulo2;

      // si el angulo interno es mayor que PI y el arco esta en coordenadas absolutas
      if (((angulo2 - angulo1) > Math.PI) && this.abs_coord) {
        angulo1 = tmpAngulo2;
        angulo2 = tmpAngulo1;
      }
      // si el angulo interno es menor que PI y el arco esta en coordenadas relativas
      if (((angulo2 - angulo1) <= Math.PI) && !this.abs_coord) {
        angulo1 = tmpAngulo2;
        angulo2 = tmpAngulo1;
      }

//       console.log(u1, u2, "-------", v1, v2, "-------", angulo1*180/Math.PI, angulo2*180/Math.PI, "-------", this.anguloInterior*180/Math.PI);

      this.iniAng = angulo1;
      this.endAng = angulo2;
    }
    else {
      this.vectors = false;
      this.iniAng = descartesJS.degToRad(iniAng);
      this.endAng = descartesJS.degToRad(endAng);
    }
    
  }

  /**
   * Dibuja el arco
   */
  descartesJS.Arc.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.fill, this.color);
  }

  /**
   * Dibuja el rastro del arco
   */
  descartesJS.Arc.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.fill, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar un arco
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el arco
   * @param {String} fill el color de relleno del arco
   * @param {String} stroke el color del trazo del arco
   */
  descartesJS.Arc.prototype.drawAux = function(ctx, fill, stroke) {
    var evaluator = this.evaluator;
    var space = this.space;
    
    var desp = 1;
    var coordX = (this.abs_coord) ? MathFloor(this.exprX)+.5 : MathFloor(space.getAbsoluteX(this.exprX))+.5;
    var coordY = (this.abs_coord) ? MathFloor(this.exprY)+.5 : MathFloor(space.getAbsoluteY(this.exprY))+.5;
    var radius = evaluator.evalExpression(this.radius);
    
    if (!this.vectors) {
      // verificacion de los datos
      if (this.iniAng > this.endAng) {
        var tempAng = this.iniAng;
        this.iniAng = this.endAng;
        this.endAng = tempAng;
      }
    }
   
    if (radius < 0) {
      radius = 0;
    }
    
    var clockwise = false;

    if (!this.abs_coord) {
      radius = radius*space.scale;
      if (!this.vectors) {
        this.iniAng = -this.iniAng;
        this.endAng = -this.endAng;
        clockwise = true;
      }
    }
    
    // si los arcos estan especificados con vectores
    if (this.vectors) {
      if (this.abs_coord) {
        clockwise = false;
      }
      else {
        clockwise = true;
      }
    }
    
    // el ancho de una linea no puede ser 0 ni negativa
    var tmpLineWidth = evaluator.evalExpression(this.width);
    if (tmpLineWidth <=0) {
      tmpLineWidth = 0.000001;
    }
    ctx.lineWidth = tmpLineWidth;

    ctx.lineCap = "round";
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = descartesJS.getColor(evaluator, stroke);

    // se crea otro arco para dibujar el area coloreada del arco
    if (this.fill) {
      ctx.beginPath();
      ctx.moveTo(coordX, coordY);
      ctx.arc(coordX, coordY, radius, this.iniAng, this.endAng, clockwise);
      ctx.fill();        
    }
      
    ctx.beginPath();
    ctx.arc(coordX, coordY, radius, this.iniAng, this.endAng, clockwise);
    ctx.stroke();
    
    // se dibuja el texto
    if (this.text != [""]) {
      this.uber.drawText.call(this, ctx, this.text, coordX+desp, coordY-desp, this.color, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed);
    }
      
//     ctx.restore();    
  }

  return descartesJS;
})(descartesJS || {});