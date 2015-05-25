/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;


  var b;

  var evaluator;
  var parser;
  var space;
  var color;
  var width;
  var savex;
  var savey;
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

descartesJS._debug_vez = 0;
  
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
    if (this.expresion.type === "compOperator") {
      var left = this.expresion.childs[0];
      var right = this.expresion.childs[1];

      if ( (left.type == "identifier") && (left.value == "y") && (!right.contains("y")) ) {
        this.funExpr = right;
        this.of_y = false;
        this.drawAux = this.drawAuxFun;
      }
      
      else if ( (right.type == "identifier") && (right.value == "y") && (!left.contains("y")) ) {
        this.funExpr = left;
        this.of_y = false;
        this.drawAux = this.drawAuxFun;        
      }
      
      else if ( (left.type == "identifier") && (left.value == "x") && (!right.contains("x")) ) {
        this.funExpr = right;
        this.of_y = true;
        this.drawAux = this.drawAuxFun;
      }
      
      else if ( (right.type == "identifier") && (right.value == "x") && (!left.contains("x")) ) {
        this.of_y = true;
        this.funExpr = right;
        this.drawAux = this.drawAuxFun;
      }
    }

    this.newt = new descartesJS.R2Newton(this.evaluator, this.expresion);
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
   * Auxiliar function for draw a family graphic
   * @param {CanvasRenderingContext2D} ctx the render context to draw
   * @param {String} fill the fill color of the graphic
   * @param {String} stroke the stroke color of the graphic
   */
  descartesJS.Equation.prototype.drawFamilyAux = function(ctx, fill, stroke) {
    evaluator = this.evaluator;

    // update the family values
    this.getFamilyValues();

    // save the las value of the family parameter
    tempParam = evaluator.getVariable(this.family);

    if (this.fSteps >= 0) {
      // draw all the family mebers of the graphic
      for(var i=0, l=this.fSteps; i<=l; i++) {
        // update the value of the family parameter
        evaluator.setVariable(this.family, this.familyInf+(i*this.family_sep));

        // // if the condition to draw if true then update and draw the graphic
        // if ( evaluator.evalExpression(this.drawif) > 0 ) {
          // update the values of the graphic
          this.update();
          // draw the graphic
          this.drawAux(ctx, fill, stroke);
        // }
      }
    }

    evaluator.setVariable(this.family, tempParam);
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
    //
    if ( this.evaluator.evalExpression(this.drawif) <= 0 ) {
      return;
    }

    var Qxa;
    var Qya;
    var secondVisit;
    var Qsx;
    var Qsy;

    evaluator = this.evaluator;
    parser = evaluator.parser;
    space = this.space;
    width = evaluator.evalExpression(this.width);

    // ctx.fillStyle = stroke.getColor();
    ctx.strokeStyle = this.color.getColor();
    ctx.lineWidth = width;

    savex = parser.getVariable("x");
    savey = parser.getVariable("y");
    
    // w = space.w;
    // h = space.h;
    w = space.w +24;
    h = space.h +24;

    
    dx = w/9;
    if (dx<3) {
      dx=3;
    }
    dy = h/7;
    if (dy<3) {
      dy=3;
    }

    b = [];

    q0.set(0, 0);
    qb.set(0, 0);
    t.set(0, 0);

    var np = 8;
    var dist = 0.25;
    var ds = np;
    if (!this.abs_coord) {
      dist = dist/space.scale;
      ds = ds/space.scale;
    }

    // init the canvas path
    ctx.beginPath();

    for (j=parseInt(dy/2); j<h; j+=dy) {
      for (i=parseInt(dx/2); i<w; i+=dx) {
        if (this.abs_coord) {
          q_ij.set(i, j);
          q = this.newt.findZero(q_ij, dist);
          if (q == null) {
            continue;
          }
          evaluator.setVariable("x", q.x);
          evaluator.setVariable("y", q.y);
          Q.set(q.x, q.y);
        } 
        else {
          q_ij.set(space.getRelativeX(i), space.getRelativeY(j));
          q = this.newt.findZero(q_ij, dist);
          if (q == null) {
            continue;
          }
          evaluator.setVariable("x", q.x);
          evaluator.setVariable("y", q.y);
          Q.set(space.getAbsoluteX(q.x), space.getAbsoluteY(q.y));
        }

        Qx = Q.ix();
        Qy = Q.iy();

        // if ((Qx>=0) && (Qx<w) && (Qy>=0) && (Qy<h)) {
        if ((Qx>=-12) && (Qx<w+24) && (Qy>=-12) && (Qy<h+24)) {
          // if (b[Qx + Qy*space.w]) {
          if (b[Qx+12 + (Qy+12)*space.w]) {
            continue; // zero already detected
          }
          // b[Qx + Qy*space.w] = true;
          b[Qx+12 + (Qy+12)*space.w] = true;
        }

        if (descartesJS.rangeOK) {
          ctx.moveTo(Qx, Qy);
          ctx.lineTo(Qx, Qy);
        }

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
            // Invert Unit Tangent Vector
            t.x = -t0.x;
            t.y = -t0.y;
            
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
          
          q.x+=ds*t.x; 
          q.y+=ds*t.y;

          q = this.newt.findZero(q, dist);
          if (q == null) {
            continue;
          }

          evaluator.setVariable("x", q.x);
          evaluator.setVariable("y", q.y);
          
          t.x = q.x-qb.x;
          t.y = q.y-qb.y;
          t.normalize(); // update Unit Tangent Vector
          
          if ((t.x==0) && (t.y==0)) {
            break; /* Zero tangent vector */
          }
          
          qb.x = q.x;
          qb.y = q.y;
          
          if (this.abs_coord) {
            Q.set(q.x, q.y);
          } else {
            Q.set(space.getAbsoluteX(q.x), space.getAbsoluteY(q.y));
          }
          
          Px = parseInt(Q.ix());
          Py = parseInt(Q.iy());
          
          if ((Px!=Qx) || (Py!=Qy)) {
            Qxa = Qx;
            Qya = Qy;
            Qx = Px;
            Qy = Py;
            
            // if ((Qx>=0) && (Qx<w) && (Qy>=0) && (Qy<h)) {
            if ((Qx>=-12) && (Qx<w+24) && (Qy>=-12) && (Qy<h+24)) {
              zeroVisited = 0;

              // secondVisit = b[Qx + Qy*space.w];
              secondVisit = b[Qx+12 + (Qy+12)*space.w];

              // b[Qx + Qy*space.w] = true;
              b[Qx+12 + (Qy+12)*space.w] = true;
              for (var s=1; s<np; s++) {
                Qsx = Qxa + Math.round((Qx-Qxa)*s/np);
                Qsy = Qya + Math.round((Qy-Qya)*s/np);
                if ((0<=Qsx) && (Qsx<w) && (0<=Qsy) && (Qsy<h)) {
                  // b[Qsx + Qsy*space.w] = true;
                  b[Qsx+12 + (Qsy+12)*space.w] = true;
                }
              }

              if (descartesJS.rangeOK) {
                ctx.moveTo(Qxa, Qya);
                ctx.lineTo(Qx, Qy);
              }

              if (secondVisit) {
                break;
              }
            }
            else {
              changeSide = true; 
              side++; /* Zero out of bounds */
            }
          }
          else if ( ++zeroVisited > 4 ) {
            changeSide = true; 
            side++; /* Stationary Zero */
          }
        }
      }
    }
    
    ctx.stroke();
    // reset the translation
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

/**
 *
 */
descartesJS.Equation.prototype.X = function(size, x, abs_coord) {
  if (!abs_coord) {
    x = (this.space.w/2+this.space.Ox) + this.space.scale*x;
  }
  if (x < -size) {
    x = -size;
  }
  if (x > this.space.w+size) {
    x = this.space.w+size;
  }

  return x;
}

/**
 *
 */
descartesJS.Equation.prototype.Y = function(size, y, abs_coord) {
  if (!abs_coord) {
    y = (this.space.h/2+this.space.Oy) - this.space.scale*y;
  }
  if (y < -size) {
    y = -size;
  }
  if (y > this.space.h+size) {
    y = this.space.h+size;
  }

  return y;
}

/**
 *
 */
descartesJS.Equation.prototype.XX = function(size, v, abs_coord) {
  return Math.round(this.X(size, v, abs_coord));
}

/**
 *
 */
descartesJS.Equation.prototype.YY = function(size, v, abs_coord) {
  return Math.round(this.Y(size, v, abs_coord));
}

/**
 * 
 */
descartesJS.Equation.prototype.extrapolate = function(cond, X, Y, F, v, dx) {
  var saveX = this.evaluator.getVariable(X);
  var dxx = dx/2;
  var Dx = 0;
  var vv = v;

  while (Math.abs(dxx)>1E-15) {
    var xa = this.evaluator.getVariable(X);
    var x  = this.evaluator.getVariable(X) + dxx;

    this.evaluator.setVariable(X, x);

    var ok = true;

    try {
      var vva = vv;
      vv = this.evaluator.evalExpression(this.funExpr);
      this.evaluator.setVariable(Y, vv);

      if (this.evaluator.evalExpression(cond) > 0) {
        var minmax = new descartesJS.R2(Math.min(vva, vv), Math.max(vva, vv));
        var sing = 0;

        if (dx>0) {
          sing = this.Singularity(Math.abs(dxx), X, F, xa, vva, x, vv, minmax);
        } 
        else {
          sing = this.Singularity(Math.abs(dxx), X, F, x, vv, xa, vva, minmax);
        }
        if (sing > 0) {
          ok = false;
        }
      } 
      else {
        ok = false;
      }
    } 
    catch (e) {
      ok = false;
    }

    if (ok) {
      Dx += dxx;
    } 
    else {
      this.evaluator.setVariable(X, xa);
    }
    dxx/=2;
  }

  this.evaluator.setVariable(X, saveX);

  return new descartesJS.R2(Dx/Math.abs(dx),vv);
}


/**
 * 
 */
descartesJS.Equation.prototype.extrapolateOnSingularity = function(cond, X, Y, F, v, dx) {
  var saveX = this.evaluator.getVariable(X);
  var dxx = dx/2;
  var Dx = 0;
  var vv = v;

  while (Math.abs(dxx)>1E-15) {
    this.evaluator.setVariable(X, this.evaluator.getVariable(X) +dxx);
    var ok = true;

    if (this.evaluator.evalExpression(cond) > 0) {
      try {
        var vva = vv;
        vv = this.evaluator.evalExpression(this.funExpr);
        
        this.evaluator.setVariable(Y, vv);

        if (this.evaluator.evalExpression(cond) <= 0) {
          ok = false;
        }
      }
      catch (e) {
        ok = false;
      }
    }
    else {
      ok = false;
    }

    if (ok) {
      Dx += dxx;
    }
    else {
      this.evaluator.setVariable(X, this.evaluator.getVariable(X)-dxx);
    }
    dxx/=2;
  }
  
  if (Dx == 0) {
    dxx = dx/2;
    Dx = dx;
    vv = v;

    while (Math.abs(dxx)>1E-15) {
      this.evaluator.setVariable(X, this.evaluator.getVariable(X)-dxx);

      var ok = true;

      if (this.evaluator.evalExpression(cond) > 0) {
        try {
          vv = this.evaluator.evalExpression(this.funExpr);
        }
        catch (e) {
          ok = false;
        }
      }
      else {
        ok = false;
      }

      if (ok) {
        Dx += -dxx;
      } 
      else {
        this.evaluator.setVariable(X, this.evaluator.getVariable(X)+dxx);
      }
      dxx/=2;
    }
  }

  this.evaluator.setVariable(X, saveX);

  return new descartesJS.R2(Dx/Math.abs(dx), vv);
}

/**
 * 
 */
descartesJS.Equation.prototype.Singularity = function(e, X, F, a, va, b, vb, minmax) {
    if (isNaN(vb) || isNaN(va) || isNaN(minmax.y) || isNaN(minmax.x)) {
      return 2;
    }
    if (a >= b) {
      return 2;
    }
    var saveX = this.evaluator.getVariable(X);
    var disc=0;

    try {
      if ( (Math.abs(b-a) < 1E-15) || 
           ( (Math.abs(b-a) < 1E-12) && (Math.abs(vb-va) > Math.abs(e)) ) 
         ) {
        this.evaluator.setVariable(X, saveX);
        return 1;
      }

      var ab2=(a+b)/2;
      this.evaluator.setVariable(X, ab2);

      var auxv = NaN;

      try {
        auxv = this.evaluator.evalExpression(this.funExpr);
      }
      catch (e) {
        return 2;
      }

      if (isNaN(auxv)) {
        return 2;
      }
      

      if (Math.abs(vb-va)>e) {  // detectar saltos
        var epsilon = 1E-12;
        this.evaluator.setVariable(X, a-epsilon);
        var _v = this.evaluator.evalExpression(this.funExpr);
        var _D = (va-_v)/epsilon;

        this.evaluator.setVariable(X, b+epsilon);
        var v_ = this.evaluator.evalExpression(this.funExpr);
        var D_ = (v_-vb)/epsilon;
        var Dj = (vb-va)/(b-a);

        if ( (Math.abs(D_) < 10) || 
             (Math.abs(_D) < 10)
           ) { 
          if ( (D_ >= 0 && _D >= 0) || (D_ <= 0 && _D <= 0) ) {
            if (4*Math.abs(D_) < Math.abs(Dj)) {
              this.evaluator.setVariable(X, saveX);
              return 2;
            }
          }
        }
      }
      if (isNaN(minmax.x) || isNaN(minmax.y) || (isNaN(auxv))){
        return 2;
      }
      else if (!((minmax.x <= auxv) && (auxv <= minmax.y))) {
        this.evaluator.setVariable(X, ab2);
        minmax.x = Math.min(va, auxv);
        minmax.y = Math.max(va, auxv);
        var s1 = this.Singularity(e/2, X, F, a, va, ab2, auxv, minmax);

        this.evaluator.setVariable(X, b);
        minmax.x = Math.min(vb, auxv);
        minmax.y = Math.max(vb, auxv);
        var s2 = this.Singularity(e/2, X, F, ab2, auxv, b, vb, minmax);

        disc = Math.max(s1, s2);
      }
    } 
    catch (exc) {
      disc = 1;
    }

    this.evaluator.setVariable(X, saveX)

    return disc;
  }

  /**
   * Auxiliary function for draw an equation of y
   * @param {CanvasRenderingContext2D} ctx rendering context on which the equation is drawn
   * @param {String} fill the fill color of the equation
   * @param {String} stroke the stroke color of the equation
   */
  descartesJS.Equation.prototype.drawAuxFun = function(ctx, fill, stroke) {
    savex = this.evaluator.parser.getVariable("x");
    savey = this.evaluator.parser.getVariable("y");
    descartesJS.rangeOK = 1;
    
    var X = "x";
    var Y = "y";

    if (this.of_y) {
      X = "y";
      Y = "x";
    }

    // var F = 000000;
    var F = 0;
    var cond = (this.drawif);
    var width = this.evaluator.evalExpression(this.width);

    var defa = false;
    var singa = 0;
    var Or = new descartesJS.R2((this.space.w/2+this.space.Ox), (this.space.h/2+this.space.Oy));
    var y0 = (this.of_y) ? Or.ix() : Or.iy();

    var y = 0;
    var ya = 0;
    var x = 0;
    var xa = 0;

    var dx = 1/this.space.scale;
    var Xr = dx*((this.of_y)?-this.space.h+(this.space.h/2+this.space.Oy):-(this.space.w/2+this.space.Ox));
    var va = 0;

    if (this.abs_coord) {
      Xr = 0;
      dx = 1;
    }

    var condWhile = (this.of_y) ? this.space.h+2 : this.space.w+2;
    while (x <= condWhile) {
      var def = true;
      var sing = 0;
      this.evaluator.setVariable(X, Xr);

      try {
        var v = this.evaluator.evalExpression(this.funExpr);

        // if (!isNaN(v)) {
        if (true) {
          this.evaluator.setVariable(Y, v);

          if ((this.evaluator.evalExpression(this.drawif) > 0) && (descartesJS.rangeOK)) {
            if (defa) {
              var min = Math.min(va, v);
              var max = Math.max(va, v);
              var minmax = new descartesJS.R2(min, max);

              sing = this.Singularity(dx, X, F, Xr-dx, va, Xr, v, minmax);

              if (sing === 0) {
                if (va <= v) {
                  va = minmax.x;
                  v =  minmax.y;
                }
                else {
                  v = minmax.x;
                  va = minmax.y;
                }

                var nya = (this.of_y) ? this.XX(width, va, this.abs_coord) : this.YY(width, va, this.abs_coord);
                if (this.abs_coord) {
                  y = Math.round(v);
                } 
                else {
                  y = (this.of_y) ? this.XX(width, v, this.abs_coord) : this.YY(width, v, this.abs_coord);
                }

                if ((this.fillM) && (y>y0)) {
                  ctx.lineWidth = 1;
                  ctx.strokeStyle = this.fillM.getColor();
                  ctx.beginPath();
                  // Line(g[i],width,x,y0+1,x,y,of_y);
                  if (this.of_y) {
                    ctx.moveTo(y0+1, this.space.h-x+.5);
                    ctx.lineTo(y, this.space.h-x+.5);
                  }
                  else {
                    ctx.moveTo(x+.5, y0+1);
                    ctx.lineTo(x+.5, y);
                  }

                  ctx.stroke();
                }
                if ((this.fillP) && (y<y0)) {
                  ctx.lineWidth = 1;
                  ctx.strokeStyle = this.fillP.getColor();
                  // Line(g[i],width,x,y0-1,x,y,of_y);
                  ctx.beginPath();
                  if (this.of_y) {
                    ctx.moveTo(y0-1, this.space.h-x+.5);
                    ctx.lineTo(y, this.space.h-x+.5);
                  }
                  else {
                    ctx.moveTo(x+.5, y0-1);
                    ctx.lineTo(x+.5, y);
                  }
                  ctx.stroke();
                }

                ctx.lineWidth = width;
                ctx.strokeStyle = this.color.getColor();

                ctx.beginPath();
                // Line(g[i],width,xa,nya,x,y,of_y);
                if (this.of_y) {
                  ctx.moveTo(nya+.5, this.space.h-xa);
                  ctx.lineTo(y+.5, this.space.h-x);
                }
                else {
                  ctx.moveTo(xa+.5, nya);
                  ctx.lineTo(x+.5, y);
                }
                ctx.stroke();
              }
              // sing === 1
              else if (sing === 1) {
                this.evaluator.setVariable(X, Xr-dx);
                var pn = this.extrapolate(cond, X, Y, F, va, dx);
                y = (this.of_y)?this.XX(width, pn.y, this.abs_coord):this.YY(width, pn.y, this.abs_coord);

                //
                ctx.lineWidth = width;
                ctx.strokeStyle = this.color.getColor();

                ctx.beginPath();
                // Line(g[i],width,xa,ya, xa+(int)Math.round(pn.x),y,of_y);
                if (this.of_y) {
                  ctx.moveTo(ya+.5, this.space.h-xa);
                  ctx.lineTo(y+.5, this.space.h-xa+Math.round(pn.x));
                }
                else {
                  ctx.moveTo(xa+.5, ya);
                  ctx.lineTo(xa+Math.round(pn.x)+.5, y);
                }
                ctx.stroke();
                //

                this.evaluator.setVariable(X, Xr);
                var pa = this.extrapolate(cond, X, Y, F, v, -dx);
                ya = this.YY(width, pa.y, this.abs_coord);
                y = this.YY(width, v, this.abs_coord);



                //
                ctx.lineWidth = width;
                ctx.strokeStyle = this.color.getColor();

                ctx.beginPath();
                // Line(g[i],width,x+(int)Math.round(pa.x),ya, x,y,of_y);
                if (this.of_y) {
                  ctx.moveTo(ya+.5, this.space.h-x);
                  ctx.lineTo(y+.5, this.space.h-x);
                }
                else {
                  ctx.moveTo(x+.5, ya);
                  ctx.lineTo(x+.5, y);
                }
                ctx.stroke();
                //

             }
              // sing === 2
              else {
                y = (this.of_y)?this.XX(width, v, this.abs_coord):this.YY(width, v, this.abs_coord);

                //
                ctx.lineWidth = width;
                ctx.strokeStyle = this.color.getColor();

                ctx.beginPath();
                // Line(g[i],width,x, y,x,y,of_y);
                if (this.of_y) {
                  ctx.moveTo(y+.5, this.space.h-x);
                  ctx.lineTo(y+.5, this.space.h-x);
                }
                else {
                  ctx.moveTo(x+.5, y);
                  ctx.lineTo(x+.5, y);
                }
                ctx.stroke();
                //

              }
            }
            // defa === false; extrapolate forward
            else {
              var pa = this.extrapolateOnSingularity(cond, X, Y, F, v, -dx);

              ya = (this.of_y)?this.XX(width, pa.y, this.abs_coord):this.YY(width, pa.y, this.abs_coord);
              y  = (this.of_y)?this.XX(width, v, this.abs_coord):this.YY(width, v, this.abs_coord);

              //
              // Line(g[i],width,x+(int)Math.round(pa.x),ya,x,y,of_y);
              ctx.lineWidth = width;
              ctx.strokeStyle = this.color.getColor();
              ctx.beginPath();

              if (this.of_y) {
                ctx.moveTo(ya, this.space.h-(x+Math.round(pa.x))+.5);
                ctx.lineTo(y,  this.space.h-x+.5);
              }
              else {
                ctx.moveTo(x+Math.round(pa.x), ya);
                ctx.lineTo(x, y);
              }
              ctx.stroke();
              //
            }

            va = v;
          }

          else {
            def = false;
          }
        }
      }
      catch(e) {
        def = false;
      }

      if (defa && !def) {
        this.evaluator.setVariable(X, Xr-dx);
        this.evaluator.setVariable(Y, va);

        var pn = this.extrapolate(cond, X, Y, F, va, dx);
        y = (this.of_y)?this.XX(width, pn.y, this.abs_coord):this.YY(width, pn.y, this.abs_coord);

        //
        // Line(g[i],width,xa,ya,xa+(int)Math.round(pn.x),y,of_y);
        ctx.lineWidth = width;
        ctx.strokeStyle = this.color.getColor();
        ctx.beginPath();
        if (this.of_y) {
          ctx.moveTo(ya, this.space.h-(xa+Math.round(pn.x))+.5);
          ctx.lineTo(y, this.space.h-(xa+Math.round(pn.x))+.5);
        }
        else {
          ctx.moveTo((xa+Math.round(pn.x))+.5, ya);
          ctx.lineTo((xa+Math.round(pn.x))+.5, y);
        }
        ctx.stroke();
        //

        this.evaluator.setVariable(X, Xr);
      }

      defa = def;
      singa = sing;
      Xr += dx;
      ya = y;
      xa = x++;
    }


    this.evaluator.parser.setVariable("x", savex);
    this.evaluator.parser.setVariable("y", savey);
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