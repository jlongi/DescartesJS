/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var v1;
  var v2;

  /**
   * 3D primitive (vertex, face, text, edge)
   * @constructor 
   */
  descartesJS.Primitive3D = function (vertices, type, style, mvMatrix) {
    this.vertices = vertices;
    this.type = type;
    this.style = style;
    this.mvMatrix = mvMatrix;

    this.transformedVertices = [];

    // asign the corresponding drawing function
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
    else if (type === "edge") {
      this.draw = drawEdge;
    }
  }

  /**
   * Set the vertices of the primitive
   * @param {Array<Vector4D>} vertices an array of the new vertex information
   */
  descartesJS.Primitive3D.prototype.setVertices = function (vertices) {
    this.vertices = vertices;
  }

  /**
   * Set the model view matrix of the primitive
   * @param {Matrix4x4} mvMatrix is the new model view matrix
   */
  descartesJS.Primitive3D.prototype.setMvMatrix = function (mvMatrix) {
    this.mvMatrix = mvMatrix;
  }

  /**
   * Set the style (how the primitive look) of the primitive 
   * @param {Object} style is an object containing the style information of the primitive
   */
  descartesJS.Primitive3D.prototype.setStyle = function(style) {
    this.style = style;
  }

  /**
   * Compute a transformation to the vertices
   * @param
   */
  descartesJS.Primitive3D.prototype.computeDepth = function(space) {
    v1 = (this.vertices[0].toVector3D()).direction(this.vertices[1].toVector3D());
    v2 = (this.vertices[0].toVector3D()).direction(this.vertices[2].toVector3D());
    this.normal = v1.crossProduct(v2);
    this.direction = this.normal.dotProduct(space.eye);

    this.depth = 0;
    for (var i=0, l=this.vertices.length; i<l; i++) {
      this.transformedVertices[i] = space.perspectiveMatrix.multiplyVector4( this.vertices[i] ).toVector3D();

      this.depth += this.transformedVertices[i].z;

      this.transformedVertices[i].x = space.transformCoordinateX(this.transformedVertices[i].x);
      this.transformedVertices[i].y = space.transformCoordinateY(this.transformedVertices[i].y);
    }

    this.depth /= l;
  }

  /**
   * Auxiliary function to set the style of the primitive into a render context
   * @param {RenderingContext} ctx the render context to set the style
   * @param {Object} style an object with the values of the style to setup in the context
   */
  function setContextStyle(ctx, style) {
    for( var i in style ) {
      ctx[i] = style[i];
    }
  }

  /**
   *
   */
  function drawVertex() {

  }

  /**
   *
   */
  function drawFace(ctx) {
    setContextStyle(ctx, this.style);

    if (this.direction > 0) {
      ctx.fillStyle = this.style.backcolor;
    }

    ctx.beginPath();
    ctx.moveTo(this.transformedVertices[0].x, this.transformedVertices[0].y);
    for (var i=1, l=this.transformedVertices.length; i<l; i++) {
      ctx.lineTo(this.transformedVertices[i].x, this.transformedVertices[i].y);
    }
    ctx.closePath();

    ctx.fill();

    ctx.strokeStyle = this.style.fillStyle;
    ctx.lineWidth = 1;
    ctx.stroke();

    // wireframe render
    if (this.style.model == "wire") {
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.style.fillStyle;

      ctx.stroke();
    }
    else {
      if (this.style.edges) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.style.strokeStyle;
        
        ctx.stroke();
      }
    }
    // ctx.lineWidth = 1;
    // ctx.stroke();

    // // draw the centroid
    // var tmpX = this.space.transformCoordinateX(this.centroid.x);
    // var tmpY = this.space.transformCoordinateY(this.centroid.y);

    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.arc(tmpX, tmpY, 2, 0, 2*Math.PI)
    // ctx.fill();
  }

  /**
   *
   */
  function drawText() {

  }

  /**
   *
   */
  function drawEdge() {

  }

  return descartesJS;
})(descartesJS || {});