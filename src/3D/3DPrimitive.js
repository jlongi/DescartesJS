/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var Math2PI = 2*Math.PI;
  var lineCap = lineJoin = "round";
  var epsilon = 0.00000001;

  var evaluator;
  var verticalDisplace;
  var pointDisplace;

  var tempParam;
  var tmpVertices;

  var i;
  var l;
  var d;

  var v;
  var p;
  var ray;
  var state;
  var k;

  class Primitive3D {
    /**
     * 3D primitive (vertex, face, text, edge)
     */
    constructor(values, space) {
      // assign the values to replace the defaults values of the object
      Object.assign(this, values);

      this.space = space;

      this.projVert = [];
      this.spaceVertices = [];

      this.newProjVert = [];
      this.newSpaceVert = [];

      // assign the corresponding drawing function
      if (this.type === "vertex") {
        this.draw = drawVertex;
      }
      else if (this.type === "face") {
        this.normal = getNormal(this.vertices[0], this.vertices[1], this.vertices[2]);
        this.draw = drawFace;
      }
      else if (this.type === "text") {
        this.draw = drawPrimitiveText;
      }
      else if (this.type === "edge") {
        this.draw = drawEdge;
      }

      // overwrite the computeDepth function if the primitive is a text
      if (this.isText) {
        this.computeDepth = function() {
          this.normal = { x: 0, y: 0, z: 0 };
          this.projVert = this.vertices;
          this.depth = this.vertices[0].z;
          this.average = this.vertices[0];
        }
      }
    }

    /**
     * Compute a transformation to the vertices
     * @param
     */
    computeDepth(space) {
      this.space = space;

      this.average = { x: 0, y: 0, z: 0 };

      // remove repeated vertices
      this.removeDoubles();

      this.normal = { x: 0, y: 1, z: 0 };
      this.direction = { x: 1, y: 0, z: 0 };

      // apply the camera rotation
      for (i=0, l=this.vertices.length; i<l; i++) {
        this.spaceVertices[i] = space.rotateVertex(this.vertices[i]);
        this.average.x += this.spaceVertices[i].x;
        this.average.y += this.spaceVertices[i].y;
        this.average.z += this.spaceVertices[i].z;
      }
      this.average = descartesJS.scalarProduct3D(this.average, 1/l);
      this.average_proy = space.project(this.average);
      this.depth = descartesJS.norm3D(descartesJS.subtract3D(space.eye, this.average));

      // triangles and faces
      if (this.vertices.length > 2) {
        this.normal = getNormal(this.spaceVertices[0], this.spaceVertices[1], this.spaceVertices[2]);
      }

      // project and store the vertices in the projVert array
      for (i=0, l=this.vertices.length; i<l; i++) {
        this.newSpaceVert[i] = this.spaceVertices[i];
        this.projVert[i] = this.newProjVert[i] = space.project(this.spaceVertices[i]);
      }

      // // triangles and faces
      if (this.vertices.length > 2) {
        this.direction = getNormal(this.projVert[0], this.projVert[1], this.projVert[2]).z;
      }

      //////////////////////////////////////////////////
      this.minDistanceToEye =  Infinity;
      this.maxDistanceToEye = -Infinity;
      this.minx =  Infinity;
      this.maxx = -Infinity;
      this.miny =  Infinity;
      this.maxy = -Infinity;
      
      for (i=0, l=this.vertices.length; i<l; i++) {
        d = descartesJS.norm3D(descartesJS.subtract3D(this.spaceVertices[i], space.eye));
        this.minDistanceToEye = Math.min(this.minDistanceToEye, d);
        this.maxDistanceToEye = Math.max(this.maxDistanceToEye, d);
      }
      for (i=0, l=this.vertices.length; i<l; i++) {
        if (this.minx > this.projVert[i].x) {
          this.minx = this.projVert[i].x;
        }
        if (this.maxx < this.projVert[i].x) {
          this.maxx = this.projVert[i].x;
        }

        if (this.miny > this.projVert[i].y) {
          this.miny = this.projVert[i].y;
        }
        if (this.maxy < this.projVert[i].y) {
          this.maxy = this.projVert[i].y;
        }
      }
    }

    /**
     *
     */
    removeDoubles() {
      if (this.type !== "edge") {
        tmpVertices = [];
        for (i=0, l=this.vertices.length; i<l; i++) {
          if ( (Math.abs(this.vertices[i].x - this.vertices[(i+1)%l].x) > epsilon) ||
              (Math.abs(this.vertices[i].y - this.vertices[(i+1)%l].y) > epsilon) ||
              (Math.abs(this.vertices[i].z - this.vertices[(i+1)%l].z) > epsilon) ||
              (Math.abs(this.vertices[i].w - this.vertices[(i+1)%l].w) > epsilon)

          ) {
            tmpVertices.push(this.vertices[i]);
          }
        }

        if (tmpVertices.length === 0) {
          tmpVertices.push(this.vertices[0]);
        }

        this.vertices = tmpVertices;
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

      //
      var offset_dist = evaluator.eval(this.offset_dist);
      var offset_angle = -descartesJS.degToRad( evaluator.eval(this.offset_angle) );
      x += offset_dist*Math.cos(offset_angle);
      y += offset_dist*Math.sin(offset_angle);
      ctx.textNode.pos = { x:x, y:y };
      //
    
      if (text.hasContent) {
        // update the metrics, the true means that the text isn't draw
        text.draw(ctx, fill, x, y, true);
        
        pointDisplace = (this.fromPoint) ? text.textNodes.metrics.w/2 : 0;
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
        var i1 = i2 = null;
        var ix1 = ix2 = 0;
        var oneIsInterior;
        var j1;
        var j2;
        var inter;
        var J;
        var j;
        var k;
        var P = this.vertices;
        var pP = p.vertices;

        for (var i=0, l=pP.length; i<l; i++) {
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
            else if (!descartesJS.equals3DEpsilon(inter, i1, epsilon)) {
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
            for (var j=0, k=P.length; j<k; j++) {
              inter = p.intersection( this.vertices[j], this.vertices[(j+1)%k] );
              if (inter !== null) {
                if (j1 === null) {
                  j1 = inter;
                }
                else if (!descartesJS.equals3DEpsilon(inter, j1, epsilon)) {
                  j2 = inter;
                  break;
                }
              }
            }
          }

          if ( (oneIsInterior) || ((j1 !== null) && (j2 !== null) && (p.isInterior(j1)) && (p.isInterior(j2))) ) {
            var splitted = true;
            var P0 = pP;
            var V = null;
            var v = null;

            if (P0.length === 2) {
              if (descartesJS.equals3DEpsilon(i1, P0[0], epsilon) || descartesJS.equals3DEpsilon(i1, P0[1], epsilon)) {
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

              for (var i=0; i<P0.length; i++) {
                if (i < ix1) {
                  V[J++] = P0[i];
                  // V[J++] = new descartesJS.Vector4D(P0[i].x, P0[i].y, P0[i].z, 1);
                }
                else if (i == ix1) {
                  V[J++] = P0[i];
                  V[J++] = i1;
                  v[j++] = i1;
                  // V[J++] = new descartesJS.Vector4D(P0[i].x, P0[i].y, P0[i].z, 1);
                  // V[J++] = new descartesJS.Vector4D(i1.x, i1.y, i1.z, 1);
                  // v[j++] = new descartesJS.Vector4D(i1.x, i1.y, i1.z, 1);
                }
                else if (i < ix2) {
                  v[j++] = P0[i];
                  // v[j++] = new descartesJS.Vector4D(P0[i].x, P0[i].y, P0[i].z, 1);
                }
                else if (i == ix2) {
                  v[j++] = P0[i];
                  v[j++] = i2;
                  V[J++] = i2;
                  // v[j++] = new descartesJS.Vector4D(P0[i].x, P0[i].y, P0[i].z, 1);
                  // v[j++] = new descartesJS.Vector4D(i2.x, i2.y, i2.z, 1);
                  // V[J++] = new descartesJS.Vector4D(i2.x, i2.y, i2.z, 1);
                }
                else {
                  V[J++] = P0[i];
                  // V[J++] = new descartesJS.Vector4D(P0[i].x, P0[i].y, P0[i].z, 1);
                }
              }
            }

            if (splitted) {
              var fa = [];
              fa[0] = new Primitive3D( { vertices: V,
                                                    type: "face",
                                                    frontColor: p.frontColor,
                                                    backColor: p.backColor,
                                                    edges: p.edges,
                                                    model: p.model
                                                    },
                                                    this.space );
              fa[0].removeDoubles()
              fa[0].normal = p.normal;

              fa[1] = new Primitive3D( { vertices: v,
                                                    type: "face",
                                                    frontColor: p.frontColor,
                                                    backColor: p.backColor,
                                                    edges: p.edges,
                                                    model: p.model
                                                    },
                                                    this.space );
              fa[1].removeDoubles()
              fa[1].normal = p.normal;


              if (fa[0].vertices.length > 2) {
                if (fa[1].vertices.length > 2) {
                  return fa;
                }
                else {
                  return [fa[0]];
                }
              }
              else {
                if (fa[1].vertices.length > 2) {
                  return [fa[1]];
                }
                else {
                  return [p];
                }
              }

              // return fa;
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
      var di;
      var d;
      var d0;
      var P = this.vertices;
      var pP = p.vertices;

      if (P.length > 0) {
        d = descartesJS.dotProduct3D(pP[0], p.normal);
        d0 = descartesJS.dotProduct3D(P[0], p.normal);

        if (Math.abs(d-d0) < epsilon) {
          return true;
        }
        for (var i=1, l=P.length; i<l; i++) {
          di = descartesJS.dotProduct3D(P[i], p.normal);

          if ( (Math.abs(d-di) < epsilon) || (di>d && d0<d) || (di<d && d0>d) ) {
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
      var P = this.vertices;

      if (P.length > 0) {
        var p12 = descartesJS.subtract3D(p2, p1);
        var den = descartesJS.dotProduct3D(p12, this.normal);
        if (den !== 0) {
          var t = descartesJS.dotProduct3D( descartesJS.subtract3D(P[0], p1), this.normal ) / den;

          if ((-epsilon < t) && (t < 1+epsilon)) {
            return descartesJS.add3D(p1, descartesJS.scalarProduct3D(p12, t));
          }
        }
      }

      return null;
    }

    /**
     *
     */
    isInterior(r) {
      var P = this.vertices;

      if (P.length > 0) {
        var D = 0;
        var u = descartesJS.subtract3D(P[0], r);

        for (var i=0, l=P.length; i<l; i++) {
          var v = descartesJS.subtract3D(P[(i+1)%l], r);
          var D1 = descartesJS.dotProduct3D( descartesJS.crossProduct3D(u, v), this.normal );

          if (Math.abs(D1) < epsilon) {
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
      if (this.minDistanceToEye >= F.maxDistanceToEye || this.maxx <= F.minx || this.minx >= F.maxx || this.maxy <= F.miny || this.miny >= F.maxy) {
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
// console.log("state=", state, "v=", v)
// return;
        if ((v != null) && (v.length > 0)) {
// console.log("--------", state, "--------")
          for (k=0; k<v.length; k++) {
            V.push(v[k]);
          }

          for (i=0, l=v.length; i<l; i++) {
            p = v[i];
            ray = this.space.rayFromEye(p.x, p.y);
            
            try {
              t = this.distanceToEyeAlong(ray) - F.distanceToEyeAlong(ray);

// console.log(p.x, ",", p.y, v[i], "t=", t)
              
              if (t <= -epsilon) {
                return true;
              }
              else if (t >= epsilon) {
                return false;
              }
            }
            catch(e) {
// console.log("Error: inFrontOf");
              // return false;
            }
          }
        }
      }
      return false;
    }

    /**
     *
     */
    intersections(F) {
      var V = [];
      var pi;
      var qi;
      var pj;
      var qj;
      var ip;
      var newIP = new descartesJS.R2();

      // var P = this.spaceVertices;
      // var FP = F.spaceVertices;
      // var pr = this.projVert;
      // var Fpr = F.projVert;

      var P = this.newSpaceVert;
      var FP = F.newSpaceVert;
      var pr = this.newProjVert;
      var Fpr = F.newProjVert;


      for (var i=0, l=P.length; i<l; i++) {
        pi = P[i];
        qi = P[(i+1)%l];
        for (var j=0, Fl=FP.length; j<Fl; j++) {
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
      var den = descartesJS.dotProduct3D(this.normal, ray);

      if (Math.abs(den) > 0.000001) {
        var normalToEye = descartesJS.dotProduct3D( descartesJS.subtract3D(this.average, this.space.eye), this.normal );
        return normalToEye/den;
      }
      throw new Exception("Face is invisible");
    }

    /**
     *
     */
    verticesContainedIn(F) {
      var V = [];
      // var P = this.spaceVertices;
      // var pr = this.projVert;

      var P = this.newSpaceVert;
      var pr = this.newProjVert;

      for (var i=0, l=P.length; i<l; i++) { 
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
      var D = 0;
      var D1;
      // var P = this.spaceVertices;
      // var pr = this.projVert;
      
      var P = this.newSpaceVert;
      var pr = this.newProjVert;

      for (var i=0, l=P.length; i<l; i++) {
        D1 = ((pr[i].x-p.x)*(pr[(i+1)%l].y-p.y))-((pr[(i+1)%l].x-p.x)*(pr[i].y-p.y));

        if (D != 0) {
          if (Math.abs(D1)<epsilon) {
            if (Math.abs(pr[i].x-pr[(i+1)%l].x)>epsilon) {
              return (Math.min(pr[i].x,pr[(i+1)%l].x)<=p.x+epsilon && p.x<=Math.max(pr[i].x,pr[(i+1)%l].x)+epsilon);
            } else if (Math.abs(pr[i].y-pr[(i+1)%l].y)>epsilon) {
              return (Math.min(pr[i].y,pr[(i+1)%l].y)<=p.y+epsilon && p.y<=Math.max(pr[i].y,pr[(i+1)%l].y)+epsilon);
            }
          }
          else if ( (D>0 && D1<0) || (D<0 && D1>0) ) {
            return false;
          }
        }
        D=D1;
      }
      return true;
    }

    /**
     *
     */
    isVertex(p) {
      // var P = this.spaceVertices;
      var P = this.newSpaceVert;

      for (var i=0, l=P.length; i<l; i++) {
        if (descartesJS.equals3DEpsilon(p, P[i], epsilon)) {
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
      ctx.fillStyle = this.backColor;
      ctx.strokeStyle = this.frontColor;

      ctx.beginPath();
      ctx.arc(this.projVert[0].x, this.projVert[0].y, this.size, 0, Math2PI);
      ctx.fill();
      ctx.stroke();
    }
  }

  /**
   *
   */
  function drawFace(ctx, space) {
    ctx.textNode = null;

    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;
    ctx.lineWidth = 0.4;

    // set the path to draw
    ctx.beginPath();
    ctx.moveTo(this.projVert[0].x, this.projVert[0].y);
    for (i=1, l=this.projVert.length; i<l; i++) {
      ctx.lineTo(this.projVert[i].x, this.projVert[i].y);
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
  function drawPrimitiveText(ctx) {
    // awful hack to help the editor's pstricks exporter
    ctx.textNode = null;
    ctx.oldTextNode = "_a1b2c3_";
    // end awful hack

    tempParam = this.evaluator.getVariable(this.family);
    this.evaluator.setVariable(this.family, this.familyValue);
    this.fontSize = Math.max( 5, this.evaluator.eval(this.font_size) );
    this.font = this.font_style + " " + this.fontSize + "px " + this.font_family;

    this.drawText(ctx, this.text, this.projVert[0].x, this.projVert[0].y, this.frontColor, this.font, "left", "alphabetic", this.decimals, this.fixed, true);

    this.evaluator.setVariable(this.family, tempParam);
  }

  /**
   *
   */
  function drawEdge(ctx) {
    ctx.textNode = null;

    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.frontColor;

    // set the path to draw
    ctx.beginPath();
    ctx.moveTo(this.projVert[0].x, this.projVert[0].y);
    ctx.lineTo(this.projVert[1].x, this.projVert[1].y);

    // set the line dash
    if (this.lineDash === "dot") {
      ctx.lineCap = "butt";
      ctx.setLineDash([ctx.lineWidth, ctx.lineWidth])
    }
    else if (this.lineDash === "dash") {
      ctx.lineCap = "butt";
      ctx.setLineDash([ctx.lineWidth*4, ctx.lineWidth*3])
    }
    else if (this.lineDash === "dash_dot") {
      ctx.lineCap = "butt";
      ctx.setLineDash([ctx.lineWidth*4, ctx.lineWidth*2, ctx.lineWidth, ctx.lineWidth*2])
    }
    else {
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
