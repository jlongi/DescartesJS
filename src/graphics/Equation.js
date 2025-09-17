/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let b;
  let tempParam;

  let evaluator;
  let parser;
  let space;
  let width;
  let savex;
  let savey;
  let w;
  let h;
  let dx;
  let dy;
  let q0;
  let qb;
  let t;
  let Q;
  let q;
  let q_ij;
  let Qx;
  let Qy;
  let t0;
  let zeroVisited;
  let side;
  let changeSide;
  let Px;
  let Py;
  let i;
  let j;
  
  let Qxa;
  let Qya;
  let secondVisit;
  let Qsx;
  let Qsy;
  let np;
  let dist;
  let ds;

  class Equation extends descartesJS.Graphic {
    /**
     * A Descartes equation
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the equation
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.width = this.width || parent.evaluator.parser.parse("1");
      this.fillP = this.fillP || "";
      this.fillM = this.fillM || "";

      // parse the expression and build a newton evaluator
      this.parseExpression();

      // Descartes 2 visible
      this.visible = ((this.parent.version === 2) && (this.visible == undefined)) ? true : this.visible;
      if (this.visible) {
        this.registerTextField();
      }

      q0 = new descartesJS.R2();
      qb = new descartesJS.R2();
      t  = new descartesJS.R2();
      Q  = new descartesJS.R2();
      q_ij = new descartesJS.R2();

      this.cInd = 0;
    }

    /**
     * Parse the expression and build a newton evaluator
     */
    parseExpression() {
      if (this.expresion.type === "compOperator") {
        let left  = this.expresion.childs[0];
        let right = this.expresion.childs[1];

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
          this.funExpr = right;
          this.of_y = true;
          this.drawAux = this.drawAuxFun;
        }
      }

      this.newt = new descartesJS.R2Newton(this.evaluator, this.expresion);
    }

    /**
     * Update the equation
     */
    update() { }

    /**
     * Draw the equation (special case of the draw defined in Graphic)
     */
    draw() {
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
     * Auxiliary function for draw a family graphic
     * @param {CanvasRenderingContext2D} ctx the render context to draw
     * @param {String} fill the fill color of the graphic
     * @param {String} stroke the stroke color of the graphic
     */
    drawFamilyAux(ctx, fill, stroke) {
      evaluator = this.evaluator;

      // update the family values
      this.getFamilyValues();

      // save the las value of the family parameter
      tempParam = evaluator.getVariable(this.family);

      if (this.fSteps >= 0) {
        // draw all the family members of the graphic
        for (let i=0, l=this.fSteps; i<=l; i++) {
          // update the value of the family parameter
          evaluator.setVariable(this.family, this.fInf+(i*this.fSep));

          // update the values of the graphic
          this.update();
          // draw the graphic
          this.drawAux(ctx, fill, stroke);
        }
      }

      evaluator.setVariable(this.family, tempParam);
    }

    /**
     * Draw the trace of the equation
     */
    drawTrace() {
      super.drawTrace(this.fill, this.trace)
    }

    /**
     * Auxiliary function for draw an non explicit equation
     * @param {CanvasRenderingContext2D} ctx rendering context on which the equation is drawn
     * @param {String} fill the fill color of the equation
     * @param {String} stroke the stroke color of the equation
     */
    drawAux(ctx, fill, stroke) {
      //
      if ( this.evaluator.eval(this.drawif) <= 0 ) {
        return;
      }
      //
      this.cInd = 0;

      evaluator = this.evaluator;
      parser = evaluator.parser;
      space = this.space;
      width = evaluator.eval(this.width);

      ctx.strokeStyle = this.color.getColor();
      ctx.lineWidth = width;

      savex = evaluator.getVariable("x");
      savey = evaluator.getVariable("y");

      // w = space.w;
      // h = space.h;
      w = space.w +24;
      h = space.h +24;

      dx = w/9;
      if (dx < 3) {
        dx = 3;
      }
      dy = h/7;
      if (dy < 3) {
        dy = 3;
      }

      if (this.cInd == 0) {
        b = [];
        this.cInd++;
      }
      else {
        this.cInd = (this.cInd+1)%10000000;
      }

      q0.set(0, 0);
      qb.set(0, 0);
      t.set(0, 0);

      np = 8;
      dist = 0.25;
      ds = np;
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
            if (b[Qx+12 + (Qy+12)*space.w] === this.cInd) {
              continue; // zero already detected
            }
            // b[Qx + Qy*space.w] = true;
            b[Qx+12 + (Qy+12)*space.w] = this.cInd;
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
                b[Qx+12 + (Qy+12)*space.w] = this.cInd;

                for (let s=1; s<np; s++) {
                  Qsx = Qxa + Math.round((Qx-Qxa)*s/np);
                  Qsy = Qya + Math.round((Qy-Qya)*s/np);
                  if ((0<=Qsx) && (Qsx<w) && (0<=Qsy) && (Qsy<h)) {
                    // b[Qsx + Qsy*space.w] = true;
                    b[Qsx+12 + (Qsy+12)*space.w] = this.cInd;
                  }
                }

                if (descartesJS.rangeOK) {
                  ctx.moveTo(Qxa, Qya);
                  ctx.lineTo(Qx, Qy);
                }

                if (secondVisit === this.cInd) {
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

      // restore x and y values
      evaluator.setVariable("x", savex);
      evaluator.setVariable("y", savey);
    }

    /**
     *
     */
    X(size, x, abs_coord) {
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
    Y(size, y, abs_coord) {
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
    XX(size, v, abs_coord) {
      return Math.round(this.X(size, v, abs_coord));
    }

    /**
     *
     */
    YY(size, v, abs_coord) {
      return Math.round(this.Y(size, v, abs_coord));
    }

    /**
     *
     */
    extrapolate(cond, X, Y, F, v, dx) {
      evaluator = this.evaluator;
      let saveX = evaluator.getVariable(X);
      let dxx = dx/2;
      let Dx = 0;
      let vv = v;
      let xa;
      let x;
      let ok;
      let vva;
      let minmax;
      let sing;

      while (Math.abs(dxx)>1E-15) {
        xa = evaluator.getVariable(X);
        x  = evaluator.getVariable(X) + dxx;

        evaluator.setVariable(X, x);

        ok = true;

        try {
          vva = vv;
          vv = evaluator.eval(this.funExpr);
          evaluator.setVariable(Y, vv);

          if (evaluator.eval(cond) > 0) {
            minmax = new descartesJS.R2(Math.min(vva, vv), Math.max(vva, vv));
            sing = 0;

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
          evaluator.setVariable(X, xa);
        }
        dxx/=2;
      }

      evaluator.setVariable(X, saveX);

      return new descartesJS.R2(Dx/Math.abs(dx), vv);
    }


    /**
     *
     */
    extrapolateOnSingularity(cond, X, Y, F, v, dx) {
      evaluator = this.evaluator;
      let saveX = evaluator.getVariable(X);
      let dxx = dx/2;
      let Dx = 0;
      let vv = v;
      let ok;
      let vva;

      while (Math.abs(dxx)>1E-15) {
        evaluator.setVariable(X, evaluator.getVariable(X) +dxx);
        ok = true;

        if (evaluator.eval(cond) > 0) {
          try {
            vva = vv;
            vv = evaluator.eval(this.funExpr);

            evaluator.setVariable(Y, vv);

            if (evaluator.eval(cond) <= 0) {
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
          evaluator.setVariable(X, evaluator.getVariable(X)-dxx);
        }
        dxx/=2;
      }

      if (Dx == 0) {
        dxx = dx/2;
        Dx = dx;
        vv = v;

        while (Math.abs(dxx)>1E-15) {
          evaluator.setVariable(X, evaluator.getVariable(X)-dxx);

          let ok = true;

          if (evaluator.eval(cond) > 0) {
            try {
              vv = evaluator.eval(this.funExpr);
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
            evaluator.setVariable(X, evaluator.getVariable(X)+dxx);
          }
          dxx/=2;
        }
      }

      evaluator.setVariable(X, saveX);

      return new descartesJS.R2(Dx/Math.abs(dx), vv);
    }

    /**
     *
     */
    Singularity(e, X, F, a, va, b, vb, minmax) {
      evaluator = this.evaluator;

      if (isNaN(vb) || isNaN(va) || isNaN(minmax.y) || isNaN(minmax.x)) {
        return 2;
      }
      if (a >= b) {
        return 2;
      }
      let saveX = evaluator.getVariable(X);
      let disc = 0;

      try {
        if ( (Math.abs(b-a) < 1E-15) ||
            ( (Math.abs(b-a) < 1E-12) && (Math.abs(vb-va) > Math.abs(e)) )
          ) {
          evaluator.setVariable(X, saveX);
          return 1;
        }

        let ab2 = (a+b)/2;
        evaluator.setVariable(X, ab2);

        let auxv = NaN;

        try {
          auxv = evaluator.eval(this.funExpr);
        }
        catch (e) {
          return 2;
        }

        if (isNaN(auxv)) {
          return 5;
        }

        if (Math.abs(vb-va)>e) {  // detect jumps
          let epsilon = 1E-12;
          evaluator.setVariable(X, a-epsilon);
          let _v = evaluator.eval(this.funExpr);
          let _D = (va-_v)/epsilon;

          evaluator.setVariable(X, b+epsilon);
          let v_ = evaluator.eval(this.funExpr);
          let D_ = (v_-vb)/epsilon;
          let Dj = (vb-va)/(b-a);

          if ( (Math.abs(D_) < 10) || (Math.abs(_D) < 10) ) {
            if ( (D_ >= 0 && _D >= 0) || (D_ <= 0 && _D <= 0) ) {
              if (4*Math.abs(D_) < Math.abs(Dj)) {
                evaluator.setVariable(X, saveX);
                return 2;
              }
            }
          }
        }

        if (isNaN(minmax.x) || isNaN(minmax.y) || (isNaN(auxv))){
          return 2;
        }
        else if (!((minmax.x <= auxv) && (auxv <= minmax.y))) {
          evaluator.setVariable(X, ab2);
          minmax.x = Math.min(va, auxv);
          minmax.y = Math.max(va, auxv);
          let s1 = this.Singularity(e/2, X, F, a, va, ab2, auxv, minmax);

            evaluator.setVariable(X, b);
            minmax.x = Math.min(vb, auxv);
            minmax.y = Math.max(vb, auxv);
            let s2 = this.Singularity(e/2, X, F, ab2, auxv, b, vb, minmax);

            disc = Math.max(s1, s2);
          }
        }
      catch (exc) {
        disc = 1;
      }

      evaluator.setVariable(X, saveX)

      return disc;
    }

    /**
     * 
     */
    drawAuxFun(ctx, fill, stroke) {
      evaluator = this.evaluator;

      savex = evaluator.getVariable("x");
      savey = evaluator.getVariable("y");
      descartesJS.rangeOK = 1;

      let X = "x";
      let Y = "y";

      if (this.of_y) {
        X = "y";
        Y = "x";
      }

      let F = 0;
      let cond = (this.drawif);
      let width = evaluator.eval(this.width);

      let defa = false;
      let singa = 0;
      let Or = new descartesJS.R2((this.space.w/2+this.space.Ox), (this.space.h/2+this.space.Oy));
      let y0 = (this.of_y) ? Or.ix() : Or.iy();

      let y = 0;
      let ya = 0;
      let x = 0;
      let xa = 0;

      let dx = 1/this.space.scale;
      let Xr = dx*((this.of_y) ? (-this.space.h+Or.y) : -Or.x);
      let va = 0;

      if (this.abs_coord) {
        Xr = 0;
        dx = 1;
      }

      let def;
      let sing;
      let v;
      let min;
      let max;
      let minmax;
      let nya;
      let pn;
      let pa;

      let condWhile = (this.of_y) ? this.space.h+2 : this.space.w+2;
      while (x <= condWhile) {
        def = true;
        sing = 0;
        evaluator.setVariable(X, Xr);

        try {
          v = evaluator.eval(this.funExpr);

          // if (!isNaN(v) && (Math.abs(v) > 1e-6)) {
          if (!isNaN(v)) {
            evaluator.setVariable(Y, v);

            if ((evaluator.eval(this.drawif) > 0) && (descartesJS.rangeOK)) {
              if (defa) {
                min = Math.min(va, v);
                max = Math.max(va, v);
                minmax = new descartesJS.R2(min, max);

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

                  nya = parseInt( (this.of_y) ? this.XX(width, va, this.abs_coord) : this.YY(width, va, this.abs_coord) );
                  if (this.abs_coord) {
                    y = Math.round(v);
                  }
                  else {
                    y = parseInt( (this.of_y) ? this.XX(width, v, this.abs_coord) : this.YY(width, v, this.abs_coord) );
                  }

                  // fill the equation (fill minus)
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
                  // fill maximums
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
                  ctx.strokeStyle = stroke.getColor();

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
                  evaluator.setVariable(X, Xr-dx);
                  pn = this.extrapolate(cond, X, Y, F, va, dx);
                  y = ( (this.of_y) ? this.XX(width, pn.y, this.abs_coord) : this.YY(width, pn.y, this.abs_coord) );
                  //
                  ctx.lineWidth = width;
                  ctx.strokeStyle = stroke.getColor();
                  
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

                  evaluator.setVariable(X, Xr);
                  pa = this.extrapolate(cond, X, Y, F, v, -dx);
                  ya = ( (this.of_y) ? this.XX(width, pa.y, this.abs_coord) : this.YY(width, pa.y, this.abs_coord) );
                  y = ( (this.of_y) ? this.XX(width, v, this.abs_coord) : this.YY(width, v, this.abs_coord) );

                  //
                  ctx.lineWidth = width;
                  ctx.strokeStyle = stroke.getColor();
                  
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
                }
                // sing === 2
                else if (sing === 2) {
                  y = ( (this.of_y) ? this.XX(width, v, this.abs_coord) : this.YY(width, v, this.abs_coord) );

                  //
                  ctx.lineWidth = width;
                  ctx.strokeStyle = stroke.getColor();
                  
                  ctx.beginPath();
                  // Line(g[i],width,x,y,x,y,of_y);
                  if (this.of_y) {
                    ctx.moveTo(ya+.5, this.space.h-x);
                    ctx.lineTo(y+.5, this.space.h-x);
                  }
                  else {
                    ctx.moveTo(x+.5, ya);
                    ctx.lineTo(x+.5, y);
                  }
                  ////////////////////
                  // ctx.stroke(); //
                  ////////////////////
                }
              }
              // defa === false; extrapolate forward
              else {
                pa = this.extrapolateOnSingularity(cond, X, Y, F, v, -dx);

                ya = (this.of_y) ? this.XX(width, pa.y, this.abs_coord) : this.YY(width, pa.y, this.abs_coord);
                y  = ( (this.of_y) ? this.XX(width, v, this.abs_coord) : this.YY(width, v, this.abs_coord) );

                //
                // Line(g[i],width,x+(int)Math.round(pa.x),ya,x,y,of_y);
                ctx.lineWidth = width;
                ctx.strokeStyle = stroke.getColor();
                
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
          evaluator.setVariable(X, Xr-dx);
          evaluator.setVariable(Y, va);

          pn = this.extrapolate(cond, X, Y, F, va, dx);
          y = parseInt( (this.of_y) ? this.XX(width, pn.y, this.abs_coord) : this.YY(width, pn.y, this.abs_coord) );

          if ((evaluator.eval(this.drawif) > 0) && (descartesJS.rangeOK)) {
            //
            // Line(g[i],width,xa,ya,xa+(int)Math.round(pn.x),y,of_y);
            ctx.lineWidth = width;
            ctx.strokeStyle = stroke.getColor();
            
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
          }

          evaluator.setVariable(X, Xr);
        }

        defa = def;
        singa = sing;
        Xr += dx;
        ya = y;
        xa = x++;
      }

      evaluator.setVariable("x", savex);
      evaluator.setVariable("y", savey);
    }

    /**
     * Register a text field in case the equation expression is editable
     */
    registerTextField() {
      let self = this;
      let textField = descartesJS.newHTML("input");
      textField.value = self.expresionString;
      textField.disabled = !(self.editable);

      textField.onkeydown = function(evt) {
        if (evt.keyCode == 13) {
          self.expresion = self.evaluator.parser.parse(this.value);
          self.parseExpression();
          self.parent.update();
        }
      }

      self.parent.editableRegion.textFields.push(textField);
    }
  }

  descartesJS.Equation = Equation;
  return descartesJS;
})(descartesJS || {});
