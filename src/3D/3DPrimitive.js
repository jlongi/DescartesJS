/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var v1;
  var v2;
  var evaluator;
  var verticalDisplace;
  var theText;

  /**
   * 3D primitive (vertex, face, text, edge)
   * @constructor 
   */
  descartesJS.Primitive3D = function (vertices, type, style, evaluator, text) {
    this.vertices = vertices;
    this.type = type;
    this.style = style;
    this.evaluator = evaluator;
    this.text = text || "";

    this.light = descartesJS.Vector3D(1,1,1);

    this.transformedVertices = [];

    // asign the corresponding drawing function
    if (type === "vertex") {
      this.draw = drawVertex;
    }
    else if (type === "face") {
      this.draw = drawFace;
    }
    else if (type === "text") {
      this.draw = drawPrimitiveText;
    }
    else if (type === "edge") {
      this.draw = drawEdge;
    }

    // overwrite the computeDepth function if the primitive is a text
    if (style.isText) {
      this.computeDepth = function(space) {
        this.transformedVertices = this.vertices;
        this.depth = (space.perspectiveMatrix.multiplyVector4( this.vertices[0] ).toVector3D()).z;
      }
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
    // triangles and faces
    if (this.vertices.length >2) {
      v1 = (this.vertices[0].toVector3D()).direction(this.vertices[1].toVector3D());
      v2 = (this.vertices[0].toVector3D()).direction(this.vertices[2].toVector3D());
      this.normal = v1.crossProduct(v2);
      this.direction = this.normal.dotProduct(space.eye);
    }

    this.depth = 0;
    this.zMin =  10000;
    this.zMax = -10000;
    for (var i=0, l=this.vertices.length; i<l; i++) {
      this.transformedVertices[i] = space.perspectiveMatrix.multiplyVector4( this.vertices[i] ).toVector3D();

      this.depth += this.transformedVertices[i].z;
      this.zMin = Math.min(this.zMin, this.transformedVertices[i].z);
      this.zMax = Math.max(this.zMax, this.transformedVertices[i].z);

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
  function drawVertex(ctx) {
    setContextStyle(ctx, this.style);

    ctx.beginPath();
    ctx.arc(this.transformedVertices[0].x, this.transformedVertices[0].y, this.style.size, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  /**
   *
   */
  function drawFace(ctx) {
    setContextStyle(ctx, this.style);

    // set the path to draw
    ctx.beginPath();
    ctx.moveTo(this.transformedVertices[0].x, this.transformedVertices[0].y);
    for (var i=1, l=this.transformedVertices.length; i<l; i++) {
      ctx.lineTo(this.transformedVertices[i].x, this.transformedVertices[i].y);
    }
    ctx.closePath();

    // color render
    if (this.style.model === "color") {
      // necesary to cover completely the primitive
      if (this.direction >= 0) {
        ctx.fillStyle = this.style.backcolor;
        ctx.strokeStyle = this.style.backcolor;
      }
      else {
        ctx.strokeStyle = this.style.fillStyle;
      }

      ctx.fill();

      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // light and metal render (incomplete)
    else if ( (this.style.model === "light") || (this.style.model === "metal") ){
      // necesary to cover completely the primitive
      if (this.direction > 0) {
        ctx.fillStyle = this.style.backcolor;
        ctx.strokeStyle = this.style.backcolor;
      }
      else {
        ctx.strokeStyle = this.style.fillStyle;
      }

      ctx.fill();

      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // wireframe render
    else if (this.style.model === "wire") {
      ctx.lineWidth = 1.25;
      ctx.strokeStyle = this.style.fillStyle;

      ctx.stroke();
    }

    // draw the edges
    if ((this.style.edges) && (this.style.model !== "wire")) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.style.strokeStyle;
      
      ctx.stroke();
    }
  }

  /**
   *
   */
  function drawPrimitiveText(ctx) {
    this.drawText(ctx, this.text, this.transformedVertices[0].x, this.transformedVertices[0].y +this.style.displace, this.style.fillStyle, this.style.font, "left", "alphabetic", this.style.decimals, this.style.fixed, true);
  }

  /**
   *
   */
  function drawEdge(ctx) {
    setContextStyle(ctx, this.style);

    // set the path to draw
    ctx.beginPath();
    ctx.moveTo(this.transformedVertices[0].x, this.transformedVertices[0].y);
    ctx.lineTo(this.transformedVertices[1].x, this.transformedVertices[1].y);

    ctx.stroke();
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
  descartesJS.Primitive3D.prototype.drawText = function(ctx, text, x, y, fill, font, align, baseline, decimals, fixed, displaceY) {
    // rtf text
    if (text.type == "rtfNode") {
      ctx.fillStyle = fill;
      ctx.strokeStyle = fill;
      ctx.textBaseline = "alphabetic";
      text.draw(ctx, x, y, decimals, fixed, align, displaceY);
      
      return;
    }

    // simple text (none rtf text)
    if (text.type === "simpleText") {
      text = text.toString(decimals, fixed).split("\\n");
    }

    x = x + (font.match("Arial") ? -2 : (font.match("Times") ? -2: 0));
    
    evaluator = this.evaluator;
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;

    verticalDisplace = this.fontSize*1.2 || 0;

    for (var i=0, l=text.length; i<l; i++) {
      theText = text[i];

      if (this.border) {
        ctx.strokeText(theText, x, y+(verticalDisplace*i));
      }
      ctx.fillText(theText, x, y+(verticalDisplace*i));
    }
  }

  return descartesJS;
})(descartesJS || {});