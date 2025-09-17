/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  const Math2PI = 2*Math.PI;
  const epsilon = 0.00000001;
  const big_number = Infinity;

  let MathAbs = Math.abs;
  let MathMin = Math.min;
  let MathMax = Math.max;
  
  let evaluator;
  let verticalDisplace;
  let pointDisplace;

  let tempParam;
  let tmpVertices;
  let d;
  let v;
  let ray;
  let state;

  class Primitive3D {
    /**
     * 3D primitive (vertex, face, text, edge)
     */
    constructor(values, space) {
      // assign the values to replace the defaults values of the object
      Object.assign(this, values);

      self = this;
      self.space = space;

      self.projV  = [];
      self.spaceV = [];

      self.newProjV  = [];
      self.newSpaceV = [];

      // assign the corresponding drawing function
      if (self.type === "vertex") {
        self.draw = drawVertex;
      }
      else if (self.type === "face") {
        self.normal = getNormal(self.V[0], self.V[1], self.V[2]);
        self.draw = drawFace;
      }
      else if (self.type === "text") {
        self.draw = drawText;
      }
      else if (self.type === "edge") {
        self.draw = drawEdge;
      }

      // overwrite the computeDepth function if the primitive is a text
      if (self.isText) {
        self.computeDepth = function() {
          this.normal = { x: 0, y: 0, z: 0 };
          this.projV  = this.V;
          this.depth  = this.V[0].z;
          this.avg    = this.V[0];
        }
      }
    }

    /**
     * Compute a transformation to the vertices
     * @param
     */
    computeDepth(space) {
      self = this;
      self.space = space;

      self.avg = { x: 0, y: 0, z: 0 };

      // remove repeated vertices
      self.removeDoubles();

      self.normal    = { x: 0, y: 1, z: 0 };
      self.direction = { x: 1, y: 0, z: 0 };

      // apply the camera rotation
      let l = self.V.length;
      for (let i=0; i<l; i++) {
        self.spaceV[i] = space.rotateVertex(self.V[i]);
        self.avg.x += self.spaceV[i].x;
        self.avg.y += self.spaceV[i].y;
        self.avg.z += self.spaceV[i].z;
      }
      self.avg = descartesJS.scalarProd3D(self.avg, 1/l);
      self.avg_proy = space.project(self.avg);
      self.depth = descartesJS.norm3D(descartesJS.subtract3D(space.eye, self.avg));

      // triangles and faces
      if (self.V.length > 2) {
        self.normal = getNormal(self.spaceV[0], self.spaceV[1], self.spaceV[2]);
      }

      // project and store the vertices in the projVert array
      for (let i=0, l=self.V.length; i<l; i++) {
        self.newSpaceV[i] = self.spaceV[i];
        self.projV[i] = self.newProjV[i] = space.project(self.spaceV[i]);
      }

      // // triangles and faces
      if (self.V.length > 2) {
        self.direction = getNormal(self.projV[0], self.projV[1], self.projV[2]).z;
      }

      //////////////////////////////////////////////////
      self.minDistToEye =  big_number;
      self.maxDistToEye = -big_number;
      self.minX =  big_number;
      self.maxX = -big_number;
      self.minY =  big_number;
      self.maxY = -big_number;
      
      for (let i=0, l=self.V.length; i<l; i++) {
        d = descartesJS.norm3D(descartesJS.subtract3D(self.spaceV[i], space.eye));
        self.minDistToEye = MathMin(self.minDistToEye, d);
        self.maxDistToEye = MathMax(self.maxDistToEye, d);
      }
      for (let i=0, l=self.V.length; i<l; i++) {
        if (self.minX > self.projV[i].x) {
          self.minX = self.projV[i].x;
        }
        if (self.maxX < self.projV[i].x) {
          self.maxX = self.projV[i].x;
        }

        if (self.minY > self.projV[i].y) {
          self.minY = self.projV[i].y;
        }
        if (self.maxY < self.projV[i].y) {
          self.maxY = self.projV[i].y;
        }
      }
    }

    /**
     *
     */
    removeDoubles() {
      self = this;

      if (self.type !== "edge") {
        tmpVertices = [];

        for (let i=0, l=self.V.length; i<l; i++) {
          if (
            (MathAbs(self.V[i].x - self.V[(i+1)%l].x) > epsilon) ||
            (MathAbs(self.V[i].y - self.V[(i+1)%l].y) > epsilon) ||
            (MathAbs(self.V[i].z - self.V[(i+1)%l].z) > epsilon) ||
            (MathAbs(self.V[i].w - self.V[(i+1)%l].w) > epsilon)
          ) {
            tmpVertices.push(self.V[i]);
          }
        }

        if (tmpVertices.length === 0) {
          tmpVertices.push(self.V[0]);
        }

        self.V = tmpVertices;
      }
    }

    /**
     * Draw the text of the graphic
     * @param {CanvasRenderingContext2D} ctx the context render to draw
     * @param {String} text the text to draw
     * @param {Number} x the x position of the text
     * @param {Number} y the y position of the text
     * @param {String} fill the fill color of the graphic
     * @param {String} font the font of the text
     * @param {String} align the alignment of the text
     * @param {String} baseline the baseline of the text
     * @param {Number} decimals the number of decimals of the text
     * @param {Boolean} fixed the number of significant digits of the number in the text
     * @param {Boolean} displaceY a flag to indicate if the text needs a displace in the y position
     */
    drawText(ctx, text, x, y, fill, font, align, baseline, decimals, fixed, displaceY) {
      evaluator = this.evaluator;
      ctx.textNode = text;

      let offset_dist = evaluator.eval(this.offset_dist);
      let offset_angle = -descartesJS.degToRad( evaluator.eval(this.offset_angle) );
      x += offset_dist*Math.cos(offset_angle);
      y += offset_dist*Math.sin(offset_angle);
      ctx.textNode.pos = { x:x, y:y };
    
      if (text.hasContent) {
        // update the metrics, the true means that the text isn't draw
        text.draw(ctx, fill, x, y, true);
        
        pointDisplace    = (this.fromPoint) ? text.textNodes.metrics.w/2 : 0;
        verticalDisplace = (this.fromPoint) ? text.textNodes.metrics.h/2 : 0;

        // text 
        text.draw(ctx, fill, x -pointDisplace, y -verticalDisplace);
      }
    }

    /**
     *
     */
    splitFace(p) {
      if (this.intersects(p)) {
        let i1 = null;
        let i2 = null;
        let ix1 = 0;
        let ix2 = 0;
        let oneIsInterior;
        let j1;
        let j2;
        let inter;
        let J;
        let j;
        let k;
        let P = this.V;
        let pP = p.V;

        for (let i=0, l=pP.length; i<l; i++) {
          inter = this.intersection( pP[i], pP[(i+1)%l] );

          if (inter !== null) {
            if (i1 === null) {
              i1 = inter;
              ix1 = i;
              if (pP.length === 2) {
                i2 = i1;
                break;
              }
            }
            else if (!descartesJS.equals3D(inter, i1, epsilon)) {
              i2 = inter;
              ix2 = i;
              break;
            }
          }
        }

        if ((i1 !== null) && (i2 !== null)) {
          oneIsInterior = this.isInterior(i1) || this.isInterior(i2);
          j1 = null;
          j2 = null;

          if ((!oneIsInterior) && (pP.length >= 3)) {
            for (let j=0, k=P.length; j<k; j++) {
              inter = p.intersection( this.V[j], this.V[(j+1)%k] );

              if (inter !== null) {
                if (j1 === null) {
                  j1 = inter;
                }
                else if (!descartesJS.equals3D(inter, j1, epsilon)) {
                  j2 = inter;
                  break;
                }
              }
            }
          }

          if ( (oneIsInterior) || ((j1 !== null) && (j2 !== null) && (p.isInterior(j1)) && (p.isInterior(j2))) ) {
            let splitted = true;
            let P0 = pP;
            let V = null;
            let v = null;

            if (P0.length === 2) {
              if (descartesJS.equals3D(i1, P0[0], epsilon) || descartesJS.equals3D(i1, P0[1], epsilon)) {
                splitted = false;
              }
              else {
                V = [];
                V[0] = P0[0];
                V[1] = i1;
                v = [];
                v[0] = i1;
                v[1] = P0[1]
              }
            }
            else {
              V = [];
              v = [];
              J=0;
              j=0;
              k=0;

              for (let i=0; i<P0.length; i++) {
                if (i < ix1) {
                  V[J++] = P0[i];
                }
                else if (i == ix1) {
                  V[J++] = P0[i];
                  V[J++] = i1;
                  v[j++] = i1;
                }
                else if (i < ix2) {
                  v[j++] = P0[i];
                }
                else if (i == ix2) {
                  v[j++] = P0[i];
                  v[j++] = i2;
                  V[J++] = i2;
                }
                else {
                  V[J++] = P0[i];
                }
              }
            }

            if (splitted) {
              let fa = [];
              fa[0] = new Primitive3D({
                V: V,
                type: "face",
                frontColor: p.frontColor,
                backColor: p.backColor,
                edges: p.edges,
                model: p.model
                },
                this.space
              );
              fa[0].removeDoubles()
              fa[0].normal = p.normal;

              fa[1] = new Primitive3D({
                V: v,
                type: "face",
                frontColor: p.frontColor,
                backColor: p.backColor,
                edges: p.edges,
                model: p.model
                },
                this.space
              );
              fa[1].removeDoubles()
              fa[1].normal = p.normal;

              if (fa[0].V.length > 2) {
                if (fa[1].V.length > 2) {
                  return fa;
                }
                else {
                  return [fa[0]];
                }
              }
              else {
                if (fa[1].V.length > 2) {
                  return [fa[1]];
                }
                else {
                  return [p];
                }
              }
            }
          }
        }
      }

      return [p];
    }

    /**
     * check if two faces has an intersection
     */
    intersects(p) {
      return this.intersectsPlane(p) && p.intersectsPlane(this);
    }

    /**
     * check if two planes intersects
     */
    intersectsPlane(p) {
      let di;
      let d;
      let d0;
      let P = this.V;
      let pP = p.V;

      if (P.length > 0) {
        d = descartesJS.dotProduct3D(pP[0], p.normal);
        d0 = descartesJS.dotProduct3D(P[0], p.normal);

        if (MathAbs(d-d0) < epsilon) {
          return true;
        }
        for (let i=1, l=P.length; i<l; i++) {
          di = descartesJS.dotProduct3D(P[i], p.normal);

          if ( (MathAbs(d-di) < epsilon) || (di>d && d0<d) || (di<d && d0>d) ) {
            return true;
          }
        }
      }
      return false;
    } 

    /**
     *
     */
    intersection(p1, p2) {
      let P = this.V;

      if (P.length > 0) {
        let p12 = descartesJS.subtract3D(p2, p1);
        let den = descartesJS.dotProduct3D(p12, this.normal);
        if (den !== 0) {
          let t = descartesJS.dotProduct3D( descartesJS.subtract3D(P[0], p1), this.normal ) / den;

          if ((-epsilon < t) && (t < 1+epsilon)) {
            return descartesJS.add3D(p1, descartesJS.scalarProd3D(p12, t));
          }
        }
      }

      return null;
    }

    /**
     *
     */
    isInterior(r) {
      let P = this.V;

      if (P.length > 0) {
        let D = 0;
        let u = descartesJS.subtract3D(P[0], r);

        for (let i=0, l=P.length; i<l; i++) {
          let v = descartesJS.subtract3D(P[(i+1)%l], r);
          let D1 = descartesJS.dotProduct3D( descartesJS.crossProduct3D(u, v), this.normal );

          if (MathAbs(D1) < epsilon) {
            if (descartesJS.dotProduct3D(u, v) < 0) {
              return true;
            }
          }
          else {
            if (((D < 0) && (D1 > 0)) || ((D > 0) && (D1 < 0))) {
              return false;
            }
            u = v;
            D = D1;
          }
        }
      }

      return true;
    }

    /**
     *
     */
    inFrontOf(V, F, epsilon) {
      if (this.minDistToEye >= F.maxDistToEye || this.maxX <= F.minX || this.minX >= F.maxX || this.maxY <= F.minY || this.minY >= F.maxY) {
        return false;
      }

      for (state=0; state<3; state++) {
        v = null;

        if (state === 0) {
          v = this.intersections(F);
        }
        else if (state === 1) {
          v = F.verticesContainedIn(this);
        }
        else {
          v = this.verticesContainedIn(F);
        }

        if ((v != null) && (v.length > 0)) {
          for (let v_k of v) {
            V.push(v_k);
          }

          for (let v_i of v) {
            ray = this.space.rayFromEye(v_i.x, v_i.y);
            
            try {
              t = this.distanceToEyeAlong(ray) - F.distanceToEyeAlong(ray);
              
              if (t <= -epsilon) {
                return true;
              }
              else if (t >= epsilon) {
                return false;
              }
            }
            catch(e) { }
          }
        }
      }
      return false;
    }

    /**
     *
     */
    intersections(F) {
      let V = [];
      let pi;
      let qi;
      let pj;
      let qj;
      let ip;
      let newIP = new descartesJS.R2();

      let P = this.newSpaceV;
      let FP = F.newSpaceV;
      let pr = this.newProjV;
      let Fpr = F.newProjV;

      for (let i=0, l=P.length; i<l; i++) {
        pi = P[i];
        qi = P[(i+1)%l];

        for (let j=0, Fl=FP.length; j<Fl; j++) {
          pj = FP[j];
          qj = FP[(j+1)%Fl];

          if ( (pi!=pj) && (pi!=qj)  && (qi!=pj) && (qi!=qj) ) {
            ip = newIP.intersection(pr[i], pr[(i+1)%l], Fpr[j], Fpr[(j+1)%Fl]);
            if (ip != null) {
              V.push(ip);
            }
          }
        }
      }

      return V;
    }

    /**
     *
     */
    distanceToEyeAlong(ray) {
      let den = descartesJS.dotProduct3D(this.normal, ray);

      if (MathAbs(den) > 0.000001) {
        return descartesJS.dotProduct3D( descartesJS.subtract3D(this.avg, this.space.eye), this.normal ) / den;
      }
      throw new Exception("Face is invisible");
    }

    /**
     *
     */
    verticesContainedIn(F) {
      let V = [];
      let P = this.newSpaceV;
      let pr = this.newProjV;

      for (let i=0, l=P.length; i<l; i++) { 
        if (!F.isVertex(P[i]) && F.appearsToContain(pr[i])) {
          V.push(pr[i]);
        }
      }
      return V;
    }

    /**
     *
     */
    appearsToContain(p) {
      let D = 0;
      let D1;      
      let P = this.newSpaceV;
      let pr = this.newProjV;

      for (let i=0, l=P.length; i<l; i++) {
        D1 = ((pr[i].x-p.x)*(pr[(i+1)%l].y-p.y))-((pr[(i+1)%l].x-p.x)*(pr[i].y-p.y));

        if (D != 0) {
          if (MathAbs(D1)<epsilon) {
            if (MathAbs(pr[i].x-pr[(i+1)%l].x)>epsilon) {
              return (MathMin(pr[i].x,pr[(i+1)%l].x)<=p.x+epsilon && p.x<=MathMax(pr[i].x,pr[(i+1)%l].x)+epsilon);
            }
            else if (MathAbs(pr[i].y-pr[(i+1)%l].y)>epsilon) {
              return (MathMin(pr[i].y,pr[(i+1)%l].y)<=p.y+epsilon && p.y<=MathMax(pr[i].y,pr[(i+1)%l].y)+epsilon);
            }
          }
          else if ( (D>0 && D1<0) || (D<0 && D1>0) ) {
            return false;
          }
        }
        D = D1;
      }
      return true;
    }

    /**
     *
     */
    isVertex(p) {
      let P = this.newSpaceV;

      for (let P_i of P) {
        if (descartesJS.equals3D(p, P_i, epsilon)) {
          return true;
        }
      }
      return false;
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  function drawVertex(ctx) {
    ctx.textNode = null;

    if (parseInt(this.size) !== 0) {
      ctx.lineWidth = 1;
      ctx.fillStyle   = this.backColor;
      ctx.strokeStyle = this.frontColor;

      ctx.beginPath();
      ctx.arc(this.projV[0].x, this.projV[0].y, this.size, 0, Math2PI);
      ctx.fill();
      ctx.stroke();
    }
  }

  /**
   *
   */
  function drawFace(ctx, space) {
    ctx.textNode = null;

    ctx.lineCap = ctx.lineJoin = "round";
    ctx.lineWidth = 0.4;

    // set the path to draw
    ctx.beginPath();
    ctx.moveTo(this.projV[0].x, this.projV[0].y);

    for (let i=1, l=this.projV.length; i<l; i++) {
      ctx.lineTo(this.projV[i].x, this.projV[i].y);
    }

    ctx.closePath();

    // color render
    if (this.model === "color") {
      ctx.fillStyle = (this.direction < 0) ? this.backColor : this.frontColor;
      ctx.strokeStyle = ctx.fillStyle;

      ctx.stroke();
      ctx.fill();
    }
    // light and metal render
    else if ( (this.model === "light") || (this.model === "metal") ) {
      ctx.fillStyle = space.computeColor( ((this.direction < 0) ? this.backColor : this.frontColor), this, (this.model === "metal"));
      ctx.strokeStyle = ctx.fillStyle;

      ctx.stroke();
      ctx.fill();
    }
    // wireframe render
    else if (this.model === "wire") {
      ctx.lineWidth = 1.25;
      ctx.strokeStyle = this.frontColor;
      ctx.stroke();
    }

    // draw the edges
    if ((this.edges) && (this.model !== "wire")) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.edges;
      ctx.stroke();
    }
  }

  /**
   *
   */
  function drawText(ctx) {
    ctx.textNode = null;

    // save family variable value
    tempParam = this.evaluator.getVariable(this.family);

    this.evaluator.setVariable(this.family, this.fVal);
    this.fontSize = MathMax( 5, this.evaluator.eval(this.font_size) );
    this.font = `${this.font_style} ${this.fontSize}px ${this.font_family}`;

    this.drawText(ctx, this.text, this.projV[0].x, this.projV[0].y, this.frontColor, this.font, "left", "alphabetic", this.decimals, this.fixed, true);

    this.evaluator.setVariable(this.family, tempParam);
  }

  /**
   *
   */
  function drawEdge(ctx) {
    ctx.textNode = null;

    ctx.lineCap = "butt";
    ctx.lineJoin = "round";
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.frontColor;

    // set the path to draw
    ctx.beginPath();
    ctx.moveTo(this.projV[0].x, this.projV[0].y);
    ctx.lineTo(this.projV[1].x, this.projV[1].y);

    // set the line dash
    if (this.lineDash === "dot") {
      ctx.setLineDash([ctx.lineWidth, ctx.lineWidth])
    }
    else if (this.lineDash === "dash") {
      ctx.setLineDash([ctx.lineWidth*4, ctx.lineWidth*3])
    }
    else if (this.lineDash === "dash_dot") {
      ctx.setLineDash([ctx.lineWidth*4, ctx.lineWidth*2, ctx.lineWidth, ctx.lineWidth*2])
    }
    else {
      ctx.lineCap = "round";
      ctx.setLineDash([]);
    }

    ctx.stroke();
  }

  /**
   *
   */
  function getNormal(u1, u2, u3) {
    return descartesJS.normalize3D( 
      descartesJS.crossProduct3D(
        descartesJS.subtract3D(u1, u2), 
        descartesJS.subtract3D(u1, u3)
      ) 
    );
  }

  descartesJS.Primitive3D = Primitive3D;
  return descartesJS;
})(descartesJS || {});
