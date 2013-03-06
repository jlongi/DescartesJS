/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * @constructor 
   */
  descartesJS.Scene = function(parent, pMatrix) {
    this.parent = parent;
    this.graphics = [];
  }

  /**
   *
   */
  descartesJS.Scene.prototype.add = function(g) {
    this.graphics.push(g);
  }

  /**
   *
   */
  function compare(a, b) {
    return b.depth - a.depth;
  }

  /**
   *
   */
  descartesJS.Scene.prototype.draw = function() {
    for(var i=0, l=this.graphics.length; i<l; i++) {
      this.graphics[i].transformVertices(this.parent);
    }

    this.graphics = this.graphics.sort(compare);

    for(var i=0, l=this.graphics.length; i<l; i++) {
      this.graphics[i].draw();
    }
  } 

  /**
   *
   */
  descartesJS.Primitive3D = function (vertices, type, style, mvMatrix, ctx) {
    this.vertices = vertices;
    this.type = type;
    this.style = style;
    this.mvMatrix = mvMatrix;
    this.ctx = ctx;
    this.transformedVertices = [];
    this.centroid = new descartesJS.Vector4D(0, 0, 0, 1);

    // asign the correct drawing function
    if (type === "vertex") {
      this.draw = drawVertex;
    }
    else if (type === "triangle") {
      this.draw = drawTriangle;
    }
    else if (type === "face") {
      this.draw = drawFace;
    }
    else if (type === "text") {
      this.draw = drawText;
    }
    else if (type === "segment") {
      this.draw = drawSegment;
    }
  }

  /**
   *
   */
  descartesJS.Primitive3D.prototype.transformVertices = function (space) {
    this.depth = 0;

    for (var i=0, l=this.vertices.length; i<l; i++) {
      this.transformedVertices[i] = space.perspectiveMatrix.multiplyVector4( this.vertices[i] ).toVector3D();

      this.depth += this.transformedVertices[i].z;

      this.transformedVertices[i].x = space.transformCoordinateX(this.transformedVertices[i].x);
      this.transformedVertices[i].y = space.transformCoordinateY(this.transformedVertices[i].y);
    }
    this.depth = this.depth / l;
  }

  /**
   *
   */
  descartesJS.Primitive3D.prototype.setStyle = function() {
    for( var i in this.style ) {
      this.ctx[i] = this.style[i];
    }
  }

  /**
   *
   */
  var drawVertex = function() {

  }

  /**
   *
   */
  var drawFace = function() {
    var ctx = this.ctx;
    this.setStyle();

    ctx.beginPath();
    ctx.moveTo(this.transformedVertices[0].x, this.transformedVertices[0].y);
    for (var i=1, l=this.transformedVertices.length; i<l; i++) {
      ctx.lineTo(this.transformedVertices[i].x, this.transformedVertices[i].y);
    }
    ctx.closePath();

    // modelo de iluminacion de alambre
    if (this.style.model == "wire") {
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.fillStyle;
      ctx.stroke();
    }
    else {
      if (this.style.edges) {
        ctx.stroke();
      }
    }

    ctx.fill();
  }

  /**
   *
   */
  var drawText = function() {

  }

  /**
   *
   */
  var drawSegment = function() {

  }

  return descartesJS;
})(descartesJS || {});
