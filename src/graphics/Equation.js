/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var PI2 = Math.PI*2;
  
  /**
   * Una ecuacion de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la ecuacion
   */
  descartesJS.Equation = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    this.width = (this.width == -1) ? this.evaluator.parser.parse("1") : this.width;

    this.generateStroke();

    // se modifica la expresion y se construye un evaluador de newton
    this.parseExpresion();

    // ## parche para la version de descartes 2 ## //
    this.visible = ((this.parent.version == 2) && (this.visible == undefined)) ? true : false;
    
    if (this.visible) {
      this.registerTextField();
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Equation, descartesJS.Graphic);

  /**
   * 
   */
  descartesJS.Equation.prototype.parseExpresion = function() {
    if (this.expresion.type == "compOperator") {
      var left = this.expresion.childs[0];
      var right = this.expresion.childs[1];

      if ( (left.type == "identifier") && (left.value == "y") && (!right.contains("y")) ) {
        this.funExpr = right;
        this.drawAux = this.drawAuxFunY;
      }
      
      else if ( (right.type == "identifier") && (right.value == "y") && (!left.contains("y")) ) {
        this.funExpr = left;
        this.drawAux = this.drawAuxFunY;        
      }
      
      else if ( (left.type == "identifier") && (left.value == "x") && (!right.contains("x")) ) {
        this.funExpr = right;
        this.drawAux = this.drawAuxFunX;
      }
      
      else if ( (right.type == "identifier") && (right.value == "x") && (!left.contains("x")) ) {
        this.funExpr = right;
        this.drawAux = this.drawAuxFunX;
      }
    }

    this.newt = new descartesJS.R2Newton(this.evaluator, this.expresion);
  }
  
  /**
   * 
   */
  descartesJS.Equation.prototype.generateStroke = function() {
    this.auxCanvas = document.createElement("canvas");
    var width = parseInt(this.evaluator.evalExpression(this.width));
    this.width_2 = parseInt(width/2) || 1;
    this.auxCanvas.setAttribute("width", width);
    this.auxCanvas.setAttribute("height", width);
    this.auxCtx = this.auxCanvas.getContext("2d");
    this.auxCtx.beginPath();
    this.auxCtx.arc(this.width_2, this.width_2, this.width_2, 0, Math.PI*2, false);
    this.auxCtx.fill();
  }
  
  /**
   * Actualiza la ecuacion
   */
  descartesJS.Equation.prototype.update = function() { }
  
  /**
   * Dibuja la ecuacion
   */
  descartesJS.Equation.prototype.draw = function() {
    // si la familia esta activada entonces se dibujan varias veces los elementos
    if (this.family != "") {
      this.drawFamilyAux(this.ctx, this.fill, this.color);
    }
    
    // si la familia no esta activada
    // si la condicion de dibujo del elemento es verdadera entonces se actualiza y dibuja el elemento
    else  {
      // se dibuja el elemento
      // se actualizan los valores antes de dibujar el elemento
      this.update();
      // se dibuja el elemento
      this.drawAux(this.ctx, this.fill, this.color);
    }
  }
  
  /**
   * Dibuja el rastro de la ecuacion
   */
  descartesJS.Equation.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.fill, this.trace);
  }
  
  var evaluator;
  var parser;
  var space;
  var color;
  var width;
  var desp;
  var savex;
  var savey;
  var netsz;
  var w;
  var h;
  var dx;
  var dy;
  var q0;
  var qb;
  var t;
  var Q;
  var q;
  var Qx;
  var Qy;
  var t0;
  var zeroVisited;
  var side;
  var changeSide;
  var Px;
  var Py;
  var i;
  var j;
  
  /**
   * Funcion auxiliar para dibujar un arco
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el arco
   * @param {String} fill el color de relleno del arco
   * @param {String} stroke el color del trazo del arco
   */
  descartesJS.Equation.prototype.drawAux = function(ctx, fill, stroke) {
    ctx.lineWidth = 1;
    evaluator = this.evaluator;
    parser = evaluator.parser;
    space = this.space;

    color = descartesJS.getColor(evaluator, this.color);
    ctx.fillStyle = stroke;
    
    width = evaluator.evalExpression(this.width);
    desp = (width%2) ? .5 : 0;
    width = MathFloor(width)/2;

    savex = parser.getVariable("x");
    savey = parser.getVariable("y");
    netsz = 8;
    
    w = space.w;
    h = space.h;
    
    dx = MathFloor(w/netsz);
    if (dx<3) {
      dx=3;
    }
    dy = MathFloor(h/netsz);
    if (dy<3) {
      dy=3;
    }

    b = [];

    q0 = new descartesJS.R2();
    qb = new descartesJS.R2();
    t = new descartesJS.R2();

    for (j=MathFloor(dy/2); j<h; j+=dy) {
      for (i=MathFloor(dx/2); i<w; i+=dx) {
        if (this.abs_coord) {
          q = this.newt.findZero(new descartesJS.R2(i, j));
          evaluator.setVariable("x", q.x);
          evaluator.setVariable("y", q.y);
          Q = new descartesJS.R2(q.x, q.y);
        } else {
          q = this.newt.findZero(new descartesJS.R2(space.getRelativeX(i), space.getRelativeY(j)));
          evaluator.setVariable("x", q.x);
          evaluator.setVariable("y", q.y);
          Q = new descartesJS.R2(space.getAbsoluteX(q.x), space.getAbsoluteY(q.y));
        }
        
        Qx = MathFloor(Q.ix());
        Qy = MathFloor(Q.iy());
//         if (Qx<0 || Qx>=w || Qy<0 || Qy>=h || b[Qx][Qy]) {
        if (Qx<0 || Qx>=w || Qy<0 || Qy>=h || b[Qx + Qy*space.w]) {
          continue; // cero detectado
        }
//         b[Qx][Qy] = true;
        b[Qx + Qy*space.w] = true;

        q0.x = q.x;
        q0.y = q.y;
        qb.x = q.x;
        qb.y = q.y;
        
        // t=t0= Unit Tangent Vector
        t0 = this.newt.getUnitNormal();
        if (t0.x==0 && t0.y==0) {
          continue; /* Zero normal vector */
        }
        
        t0.rotL90();
        t.x = t0.x;
        t.y = t0.y;
        
        zeroVisited = 0;
        side = 0;
        changeSide = false;

        while (side < 2)  {
          if (changeSide) {
            t.x = -t0.x;
            t.y = -t0.y; // Invert Unit Tangent Vector
            
            q.x = q0.x;
            q.y = q0.y;
            
            qb.x = q.x;
            qb.y = q.y;
            
            Q = (this.abs_coord) ? (new descartesJS.R2(q.x, q.y)) : (new descartesJS.R2(space.getAbsoluteX(q.x), space.getAbsoluteY(q.y)));
            
            Qx = Q.ix();
            Qy = Q.iy();
            changeSide = false;
            zeroVisited = 0;
          }
          
          if (this.abs_coord) {
            q.x+=t.x; 
            q.y+=t.y; // advance along t aprox one pixel
          } else {
            q.x+=t.x/space.scale;
            q.y+=t.y/space.scale; // advance along t aprox one pixel
          }
          
          q = this.newt.findZero(q);
          evaluator.setVariable("x", q.x);
          evaluator.setVariable("y", q.y);
          
          t.x = q.x-qb.x;
          t.y = q.y-qb.y;
          t.normalize(); // update Unit Tangent Vector
          
          if (t.x==0 && t.y==0) {
            break; /* Zero tangent vector */
          }
          
          qb.x = q.x;
          qb.y = q.y;
          
          if (this.abs_coord) {
            Q = new descartesJS.R2(q.x, q.y);
          } else {
            Q = new descartesJS.R2(space.getAbsoluteX(q.x), space.getAbsoluteY(q.y));
          }
          
          Px = MathFloor(Q.ix());
          Py = MathFloor(Q.iy());
          
          if (Px!=Qx || Py!=Qy) {
            Qx = Px;
            Qy = Py;
            
            if (0<=Qx && Qx<w && 0<=Qy && Qy<h) {
              zeroVisited = 0;
              
              if (b[Qx + Qy*space.w]) {
//               if (b[Qx][Qy]) { /* Zero already detected */
                break;
              } else {
                b[Qx + Qy*space.w] = true;
//                 b[Qx][Qy]=true;
//                 if ((descartesJS.rangeOK) && (evaluator.evalExpression(this.drawif))) {
                if (descartesJS.rangeOK) {
                  ctx.drawImage(this.auxCanvas, (Qx-this.width_2), (Qy-this.width_2));
//                   descartesJS.drawPixel(ctx, Qx+desp, Qy+desp, width);
                }
              }
            } else {
              changeSide = true; 
              side++; /* Zero out of bounds */
            }
          } else if ( ++zeroVisited > 4 ) {
            changeSide = true; 
            side++; /* Stationary Zero */
          }
        }
      }
    }
 }

  /**
   * 
   */
  descartesJS.Equation.prototype.drawAuxFunY = function(ctx, fill, stroke) {
    var evaluator = this.evaluator;
    var space = this.space;
    var w = space.w;
    var dx = 1/space.scale;
    var theZeroY = space.getAbsoluteY(0);

    var width = evaluator.evalExpression(this.width);

    var color = descartesJS.getColor(evaluator, this.color);
    var colorFillM = descartesJS.getColor(evaluator, this.fillM);
    var colorFillP = descartesJS.getColor(evaluator, this.fillP);
    ctx.fillStyle = color;    
    
    var initX = space.getRelativeX(0);
    var tmpX;
    var tmpY;
    var actualTmpAbsoluteX;
    var actualTmpAbsoluteY;    

    evaluator.setVariable("x", initX);
    var previousTmpAbsoluteX = space.getAbsoluteX(initX);
    var previousTmpAbsoluteY = space.getAbsoluteY(evaluator.evalExpression(this.funExpr));
    
    var va = 0;    
    var min;
    var max;
    var minmax;
    
    for (var i=1; i<w; i++) {
      tmpX = initX + i*dx;
      evaluator.setVariable("x", tmpX);
      tmpY = evaluator.evalExpression(this.funExpr)
      evaluator.setVariable("y", tmpY);
      
      actualTmpAbsoluteX = space.getAbsoluteX(tmpX);
      actualTmpAbsoluteY = space.getAbsoluteY(tmpY);
      
      min = Math.min(va, tmpY);
      max = Math.max(va, tmpY);
      minmax = { min: min, max: max};
      
      if ( (tmpY !== undefined) && (descartesJS.rangeOK) && (evaluator.evalExpression(this.drawif)) ) {
        if ( !this.hasSingularity(dx, tmpX, "x", tmpX-dx, va, tmpX, tmpY, minmax) ){
          
          if ((this.fillM) || (this.fillP)) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = (actualTmpAbsoluteY > theZeroY) ? colorFillM : colorFillP;
            ctx.beginPath();
            ctx.moveTo(actualTmpAbsoluteX+.5, actualTmpAbsoluteY);
            ctx.lineTo(actualTmpAbsoluteX+.5, theZeroY);
            ctx.stroke();
          }

          ctx.lineWidth = width;
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(previousTmpAbsoluteX, previousTmpAbsoluteY);
          ctx.lineTo(actualTmpAbsoluteX, actualTmpAbsoluteY);
          ctx.stroke();
        }
        
      }
      
      va = tmpY || 0;
      
      previousTmpAbsoluteX = actualTmpAbsoluteX;
      previousTmpAbsoluteY = actualTmpAbsoluteY;
    }
    
  }
  
  /**
   * 
   */
  descartesJS.Equation.prototype.drawAuxFunX = function(ctx, fill, stroke) {
    var evaluator = this.evaluator;
    var space = this.space;
    var h = space.h;
    var dy = 1/space.scale;
    var theZeroX = space.getAbsoluteX(0);

    var width = evaluator.evalExpression(this.width);

    var color = descartesJS.getColor(evaluator, this.color);
    var colorFillM = descartesJS.getColor(evaluator, this.fillM);
    var colorFillP = descartesJS.getColor(evaluator, this.fillP);
    ctx.fillStyle = color;    
    
    var initY = space.getRelativeY(h);
    var tmpY;
    var tmpX;
    var actualTmpAbsoluteX;
    var actualTmpAbsoluteY;    

    evaluator.setVariable("y", initY);
    var previousTmpAbsoluteX = space.getAbsoluteX(evaluator.evalExpression(this.funExpr));
    var previousTmpAbsoluteY = space.getAbsoluteY(initY);
    
    var va = 0;    
    var min;
    var max;
    var minmax;
    
    for (var i=1; i<h; i++) {
      tmpY = initY + i*dy;
      evaluator.setVariable("y", tmpY);
      tmpX = evaluator.evalExpression(this.funExpr)
      evaluator.setVariable("x", tmpX);

      actualTmpAbsoluteX = space.getAbsoluteX(tmpX);
      actualTmpAbsoluteY = space.getAbsoluteY(tmpY);
      
      min = Math.min(va, tmpX);
      max = Math.max(va, tmpX);
      minmax = { min: min, max: max};

      if ( (tmpY !== undefined) && (descartesJS.rangeOK) && (evaluator.evalExpression(this.drawif)) ) {
        if ( !this.hasSingularity(dy, tmpY, "y", tmpY-dy, va, tmpY, tmpX, minmax) ){
          
          if ((this.fillM) || (this.fillP)) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = (actualTmpAbsoluteX > theZeroX) ? colorFillM : colorFillP;
            ctx.beginPath();
            ctx.moveTo(actualTmpAbsoluteX, actualTmpAbsoluteY+.5);
            ctx.lineTo(theZeroX, actualTmpAbsoluteY+.5);
            ctx.stroke();
          }

          ctx.lineWidth = width;
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(previousTmpAbsoluteX, previousTmpAbsoluteY);
          ctx.lineTo(actualTmpAbsoluteX, actualTmpAbsoluteY);
          ctx.stroke();
        }
        
      }

      va = tmpX || 0;
        
      previousTmpAbsoluteX = actualTmpAbsoluteX;
      previousTmpAbsoluteY = actualTmpAbsoluteY;
    }
    
  }
  
// //   if ( !this.hasSingularity(dx, tmpX, "x", tmpX-dx, va, tmpX, tmpY, minmax) ){
// //   X = tmpX
// //   vari = "x"
// //   a = tmpX-dx
// //   va = tmpY <-anterior
// //   b = tmpX
// //   vb = tmpY
// //   minimo entre tmpY anterior y tmpY
// //   maximo entre tmpY anterior y tmpY

  /**
   * 
   */
  descartesJS.Equation.prototype.hasSingularity = function(e, X, vari, a, va, b, vb, minmax) {
    if ( (Math.abs(b-a) < 1E-12) || ((Math.abs(b-a) < 1E-8) && (Math.abs(vb-va) > Math.abs(e))) ) {
      return true;
    }
    var disc = false;
    var saveX = X;
    
    var Xr = (a+b)/2;
    this.evaluator.setVariable(vari, Xr);
    var auxv = this.evaluator.evalExpression(this.funExpr);
    
//     try {
      if ((minmax.min <= auxv) && (auxv <= minmax.max)) {
        disc = false;
      } else {
        minmax.x = Math.min(minmax.min, auxv);
        minmax.y = Math.max(minmax.max, auxv);
        disc = this.hasSingularity(e, X, vari, a, va, Xr, auxv, minmax) || this.hasSingularity(e, X, vari, Xr, auxv, b, vb, minmax);
      }
//     }catch (e) { 
//       disc = true; 
//     }
        
    this.evaluator.setVariable(vari, saveX);

    return disc;
  }
  
  /**
   * Dibuja un pixel
   * @param {2DContext} ctx el contexto de canvas donde dibujar
   * @param {Number} x la posicion en x del pixel
   * @param {Number} y la posicion en y del pixel
   * @param {String} color el color del pixel a dibujar
   * @param {Number} radius el tamano del pixel
   */
  descartesJS.drawPixel = function(ctx, x, y, radius) {
//     ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, 0, PI2, false);
//     ctx.fill();
  }

  /**
   * 
   */
  descartesJS.Equation.prototype.registerTextField = function() {
    var textField = document.createElement("input");
    textField.value = this.expresionString;
    textField.disabled = !(this.editable);
    
    var self = this;
    textField.onkeydown = function(evt) {
      if (evt.keyCode == 13) {
        self.expresion = self.evaluator.parser.parse(this.value);
        self.parseExpresion();
        self.parent.update();
      }
    }
   
    this.parent.editableRegion.textFields.push(textField); 
  }
  
  return descartesJS;
})(descartesJS || {});