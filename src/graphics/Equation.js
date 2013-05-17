/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var PI2 = Math.PI*2;

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
  var q_ij;
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

  var theZeroX;
  var theZeroY;
  var initX;
  var initY;
  var tmpX;
  var tmpY;
  var actualTmpAbsoluteX;
  var actualTmpAbsoluteY;
  var previousTmpAbsoluteX;
  var previousTmpAbsoluteY;
  var min;
  var max;
  var minmax;
  var va;
  var colorFillM;
  var colorFillP;
  var disc;
  var saveX;
  var Xr;
  var auxv;
  
  /**
   * A Descartes equation
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the equation
   */
  descartesJS.Equation = function(parent, values) {
    /**
     * the stroke width of the graph
     * type {Number}
     * @private
     */
    this.width = parent.evaluator.parser.parse("1");

    /**
     * the condition and the color of the fill
     * type {String}
     * @private
     */
    // this.fill = "";
    
    /**
     * the condition and the color of the fill+
     * type {String}
     * @private
     */
    this.fillP = "";//new descartesJS.Color("00ff80");

    /**
     * the condition and the color of the fill-
     * type {String}
     * @private
     */
    this.fillM = "";//new descartesJS.Color("ffc800");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    // generate a stroke pattern
    this.generateStroke();

    // parse the expression and build a newton evaluator
    this.parseExpression();

    // Descartes 2 visible
    this.visible = ((this.parent.version === 2) && (this.visible == undefined)) ? true : this.visible;
    if (this.visible) {
      this.registerTextField();
    }

    q0 = new descartesJS.R2();
    qb = new descartesJS.R2();
    t = new descartesJS.R2();
    q_ij = new descartesJS.R2();
    Q = new descartesJS.R2();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Equation, descartesJS.Graphic);

  /**
   * Parse the expression and build a newton evaluator
   */
  descartesJS.Equation.prototype.parseExpression = function() {
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
   * Generate an image corresponding to the stroke of the equation
   */
  descartesJS.Equation.prototype.generateStroke = function() {
    this.auxCanvas = document.createElement("canvas");
    var width = parseInt(this.evaluator.evalExpression(this.width));
    this.width_2 = parseInt(width/2) || 1;
    this.auxCanvas.setAttribute("width", width);
    this.auxCanvas.setAttribute("height", width);
    this.auxCtx = this.auxCanvas.getContext("2d");

    this.auxCtx.fillStyle = this.color.getColor();

    this.auxCtx.beginPath();
    this.auxCtx.arc(this.width_2, this.width_2, this.width_2, 0, Math.PI*2, false);
    this.auxCtx.fill();
  }
  
  /**
   * Update the equation
   */
  descartesJS.Equation.prototype.update = function() { }
  
  /**
   * Draw the equation (special case of the draw defined in Graphic)
   */
  descartesJS.Equation.prototype.draw = function() {
    // if the equation has a family
    if (this.family != "") {
      this.drawFamilyAux(this.ctx, this.fill, this.color);
    }
    // if the equation has not a family
    else  {
      // update the values of the equation
      this.update();
      // draw the equation
      this.drawAux(this.ctx, this.fill, this.color);
    }
  }
  
  /**
   * Draw the trace of the equation
   */
  descartesJS.Equation.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.fill, this.trace);
  }
    
  /**
   * Auxiliary function for draw an non explicit equation 
   * @param {CanvasRenderingContext2D} ctx rendering context on which the equation is drawn
   * @param {String} fill the fill color of the equation
   * @param {String} stroke the stroke color of the equation
   */
  descartesJS.Equation.prototype.drawAux = function(ctx, fill, stroke) {
    ctx.lineWidth = 1;
    evaluator = this.evaluator;
    parser = evaluator.parser;
    space = this.space;
    
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

    q0.set(0, 0);
    qb.set(0, 0);
    t.set(0, 0);

    for (j=MathFloor(dy/2); j<h; j+=dy) {
      for (i=MathFloor(dx/2); i<w; i+=dx) {
        if (this.abs_coord) {
          q_ij.set(i, j);
          q = this.newt.findZero(q_ij);
          evaluator.setVariable("x", q.x);
          evaluator.setVariable("y", q.y);
          Q.set(q.x, q.y);
        } else {
          q_ij.set(space.getRelativeX(i), space.getRelativeY(j));
          q = this.newt.findZero(q_ij);
          evaluator.setVariable("x", q.x);
          evaluator.setVariable("y", q.y);
          Q.set(space.getAbsoluteX(q.x), space.getAbsoluteY(q.y));
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
            
            if (this.abs_coord) {
              Q.set(q.x, q.y);
            }
            else {
              Q.set(space.getAbsoluteX(q.x), space.getAbsoluteY(q.y));
            }

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
            Q.set(q.x, q.y);
          } else {
            Q.set(space.getAbsoluteX(q.x), space.getAbsoluteY(q.y));
          }
          
          Px = MathFloor(Q.ix());
          Py = MathFloor(Q.iy());
          
          if (Px!=Qx || Py!=Qy) {
            Qx = Px;
            Qy = Py;
            
            if (0<=Qx && Qx<w && 0<=Qy && Qy<h) {
              zeroVisited = 0;
              
              if (b[Qx + Qy*space.w]) {
                break;
              } 
              else {
                b[Qx + Qy*space.w] = true;
                if ((descartesJS.rangeOK) && (evaluator.evalExpression(this.drawif))) {
                  ctx.drawImage(this.auxCanvas, (Qx-this.width_2), (Qy-this.width_2));
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
   * Auxiliary function for draw an equation of y
   * @param {CanvasRenderingContext2D} ctx rendering context on which the equation is drawn
   * @param {String} fill the fill color of the equation
   * @param {String} stroke the stroke color of the equation
   */
  descartesJS.Equation.prototype.drawAuxFunY = function(ctx, fill, stroke) {
    evaluator = this.evaluator;
    space = this.space;
    w = space.w;
    dx = 1/space.scale;
    theZeroY = space.getAbsoluteY(0);

    width = evaluator.evalExpression(this.width);

    color = this.color.getColor();
    ctx.fillStyle = color;    
    
    initX = space.getRelativeX(0);

    evaluator.setVariable("x", initX);
    previousTmpAbsoluteX = space.getAbsoluteX(initX);
    previousTmpAbsoluteY = space.getAbsoluteY(evaluator.evalExpression(this.funExpr));
    
    va = 0;
    
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
            if (this.fillM) {
              colorFillM = this.fillM.getColor();
            }
            if (this.fillP) {
              colorFillP = this.fillP.getColor();
            }

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
   * Auxiliary function for draw an equation of x
   * @param {CanvasRenderingContext2D} ctx rendering context on which the equation is drawn
   * @param {String} fill the fill color of the equation
   * @param {String} stroke the stroke color of the equation
   */
  descartesJS.Equation.prototype.drawAuxFunX = function(ctx, fill, stroke) {
    evaluator = this.evaluator;
    space = this.space;
    h = space.h;
    dy = 1/space.scale;
    theZeroX = space.getAbsoluteX(0);

    width = evaluator.evalExpression(this.width);

    color = this.color.getColor();
    ctx.fillStyle = color;    
    
    initY = space.getRelativeY(h);

    evaluator.setVariable("y", initY);
    previousTmpAbsoluteX = space.getAbsoluteX(evaluator.evalExpression(this.funExpr));
    previousTmpAbsoluteY = space.getAbsoluteY(initY);
    
    var va = 0;    
    
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
            if (this.fillM) {
              colorFillM = this.fillM.getColor();
            }
            if (this.fillP) {
              colorFillP = this.fillP.getColor();
            }

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
   * Find if the equation has a singularity
   */
  descartesJS.Equation.prototype.hasSingularity = function(e, X, vari, a, va, b, vb, minmax) {
    if ( (Math.abs(b-a) < 1E-12) || ((Math.abs(b-a) < 1E-8) && (Math.abs(vb-va) > Math.abs(e))) ) {
      return true;
    }
    disc = false;
    saveX = X;
    
    Xr = (a+b)/2;
    this.evaluator.setVariable(vari, Xr);
    auxv = this.evaluator.evalExpression(this.funExpr);
    
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
   * Draw a pixel using an arc
   * @param {CanvasRenderingContext2D} ctx rendering context on which the equation is drawn
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   * @param {Number} radius the size of the pixel
   */
  descartesJS.drawPixel = function(ctx, x, y, radius) {
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, 0, PI2, false);
  }

  /**
   * Register a text field in case the equation expression is editable
   */
  descartesJS.Equation.prototype.registerTextField = function() {
    var textField = document.createElement("input");
    textField.value = this.expresionString;
    textField.disabled = !(this.editable);
    
    var self = this;
    textField.onkeydown = function(evt) {
      if (evt.keyCode == 13) {
        self.expresion = self.evaluator.parser.parse(this.value);
        self.parseExpression();
        self.parent.update();
      }
    }
   
    this.parent.editableRegion.textFields.push(textField); 
  }
  
  return descartesJS;
})(descartesJS || {});