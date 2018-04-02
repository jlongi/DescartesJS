/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathSin = Math.sin;
  var MathCos = Math.cos;
  var MathPI  = Math.PI;
  var Math2PI = 2*MathPI;

  var vec4D;

  var evaluator;
  var width;
  var height;
  var length;
  var Nu;
  var Nv;
  var v;
  var x;
  var y;
  var z;
  var theta;
  var phi;

  var R;
  var r;

  var goldenRatio = 1.6180339887;
  var width_d_goldenRatio;
  var width_m_goldenRatio;

  var tmpMatrix;

  var currentLine;
  var tempValue;
  var tempFace;

  var i;
  var l;
  var j;
  var k;


  /**
   * A Descartes 3D face
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the triangle
   */
  descartesJS.OtherGeometry = function(parent, values) {
    this.width = parent.evaluator.parser.parse("2");
    this.height = parent.evaluator.parser.parse("2");
    this.length = parent.evaluator.parser.parse("2");
    this.R = parent.evaluator.parser.parse("2");
    this.r = parent.evaluator.parser.parse("1");

    vec4D = descartesJS.Vector4D;

    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);

    switch (this.type) {
      case("cube"):
        this.buildGeometry = buildCube;
        break;

      case("box"):
        this.buildGeometry = buildBox;
        break;

      case("tetrahedron"):
        this.buildGeometry = buildTetrahedron;
        break;

      case("octahedron"):
        this.buildGeometry = buildOctahedron;
        break;

      case("sphere"):
        this.isSphere = true;
      case("ellipsoid"):
        this.buildGeometry = buildSphere;
        break;

      case("dodecahedron"):
        this.buildGeometry = buildDodecahedron;
        break;

      case("icosahedron"):
        this.buildGeometry = buildIcosahedron;
        break;

      case("cone"):
        this.buildGeometry = buildCone;
        break;

      case("cylinder"):
        this.buildGeometry = buildCylinder;
        break;

      case("torus"):
        this.buildGeometry = buildTorus;
        break;

      case("mesh"):
        this.fileData = descartesJS.openExternalFile(this.evaluator.eval(this.file)).split(/\r/);
        this.buildGeometry = buildMesh;
        break;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.OtherGeometry, descartesJS.Graphic3D);

  /**
   * Build the primitives corresponding to the face
   */
  descartesJS.OtherGeometry.prototype.buildPrimitives = function() {
    evaluator = this.evaluator;

    this.updateMVMatrix();

    // construct the vertices
    this.buildGeometry(evaluator.eval(this.width), evaluator.eval(this.height), evaluator.eval(this.length), evaluator.eval(this.Nu), evaluator.eval(this.Nv));

    var tmpFrontColor = this.color.getColor();
    var tmpBackColor = this.backcolor.getColor();
    var tmpEdgeColor = (this.edges) ? this.edges.getColor() : "";

    for (i=0, l=this.faces.length; i<l; i++) {
      v = [];
      for (j=0, k=this.faces[i].length; j<k; j++) {
        v.push( this.transformVertex(this.vertices[this.faces[i][j]]) );
      }

      this.primitives.push( new descartesJS.Primitive3D( { vertices: v,
                                                           type: "face",
                                                           frontColor: tmpFrontColor,
                                                           backColor: tmpBackColor,
                                                           edges: tmpEdgeColor,
                                                           model: this.model
                                                         },
                            this.space ));
    }
  }

  /**
   * Define the vertex and faces of the cube
   */
  function buildCube(width, height, length, Nu, Nv) {
    buildBox.call(this, width/1.8, width/1.8, width/1.8, Nu, Nv);
  }

  /**
   * Define the vertex and faces of the box
   */
  function buildBox(width, height, length, Nu, Nv) {
    width  = width/2;
    height = height/2;
    length = length/2;

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    this.vertices = [ new vec4D( width,  length,  height, 1), //0
                      new vec4D( width, -length,  height, 1), //1
                      new vec4D( width,  length, -height, 1), //2
                      new vec4D( width, -length, -height, 1), //3
                      new vec4D(-width,  length,  height, 1), //4
                      new vec4D(-width, -length,  height, 1), //5
                      new vec4D(-width,  length, -height, 1), //6
                      new vec4D(-width, -length, -height, 1)  //7
               ];

    this.faces = [[2, 3, 1, 0], [1, 5, 4, 0], [5, 7, 6, 4], [6, 7, 3, 2], [4, 6, 2, 0], [3, 7, 5, 1]];

    this.updateValues(width, height, length, Nu, Nv);

  }

  /**
   * Define the vertex and faces of the tetrahedron
   */
  function buildTetrahedron(width, height, length, Nu, Nv) {
    width = width/2;

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    this.vertices = [ new vec4D(          0,           0,       width, 1), //0
                      new vec4D(-0.49*width, -0.86*width, -0.32*width, 1), //1
                      new vec4D(-0.49*width,  0.86*width, -0.32*width, 1), //2
                      new vec4D(    1*width,           0, -0.32*width, 1)  //3
               ];

    this.faces = [[3, 2, 1], [1, 2, 0], [2, 3, 0], [3, 1, 0]];

    this.updateValues(width, height, length, Nu, Nv);
  }

  /**
   * Define the vertex and faces of the octahedron
   */
  function buildOctahedron(width, height, length, Nu, Nv) {
    width = width/2;

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    this.vertices = [ new vec4D( 0,          0,  width, 1), //0
                      new vec4D( width,      0,      0, 1), //1
                      new vec4D(-width,      0,      0, 1), //2
                      new vec4D( 0,      width,      0, 1), //3
                      new vec4D( 0,     -width,      0, 1), //4
                      new vec4D( 0,          0, -width, 1)  //5
               ];

    this.faces = [[3, 1, 0], [2, 3, 0], [1, 4, 0], [4, 2, 0], [1, 3, 5], [3, 2, 5], [4, 1, 5], [2, 4, 5]];

    this.updateValues(width, height, length, Nu, Nv);
  }

  /**
   * Define the vertex and faces of the dodecahedron
   */
  function buildDodecahedron(width, height, length, Nu, Nv) {
    width = width/3.4;

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    width_d_goldenRatio = width/goldenRatio;
    width_m_goldenRatio = width*goldenRatio;

    this.vertices = [ new vec4D( width,  width,  width, 1), //0
                      new vec4D( width,  width, -width, 1), //1
                      new vec4D( width, -width,  width, 1), //2
                      new vec4D( width, -width, -width, 1), //3
                      new vec4D(-width,  width,  width, 1), //4
                      new vec4D(-width,  width, -width, 1), //5
                      new vec4D(-width, -width,  width, 1), //6
                      new vec4D(-width, -width, -width, 1), //7

                      new vec4D(0,  width_d_goldenRatio,  width_m_goldenRatio, 1), //8
                      new vec4D(0,  width_d_goldenRatio, -width_m_goldenRatio, 1), //9
                      new vec4D(0, -width_d_goldenRatio,  width_m_goldenRatio, 1), //10
                      new vec4D(0, -width_d_goldenRatio, -width_m_goldenRatio, 1), //11

                      new vec4D( width_d_goldenRatio,  width_m_goldenRatio, 0, 1), //12
                      new vec4D( width_d_goldenRatio, -width_m_goldenRatio, 0, 1), //13
                      new vec4D(-width_d_goldenRatio,  width_m_goldenRatio, 0, 1), //14
                      new vec4D(-width_d_goldenRatio, -width_m_goldenRatio, 0, 1), //15

                      new vec4D( width_m_goldenRatio, 0,  width_d_goldenRatio, 1), //16
                      new vec4D( width_m_goldenRatio, 0, -width_d_goldenRatio, 1), //17
                      new vec4D(-width_m_goldenRatio, 0,  width_d_goldenRatio, 1), //18
                      new vec4D(-width_m_goldenRatio, 0, -width_d_goldenRatio, 1)  //19
               ];

    // tmpMatrix = new descartesJS.Matrix4x4().setIdentity().rotate(-MathPI/6, new descartesJS.Vector3D(0, 1, 0));
    tmpMatrix = new descartesJS.Matrix4x4().setIdentity().rotateY(-MathPI/6);
    for (i=0, l=this.vertices.length; i<l; i++) {
      this.vertices[i] = tmpMatrix.multiplyVector4(this.vertices[i]);
    }

    this.faces = [[0, 16, 2, 10, 8], [12, 1, 17, 16, 0], [8, 4, 14, 12, 0], [2, 16, 17, 3, 13], [13, 15, 6, 10, 2], [6, 18, 4, 8, 10], [3, 17, 1, 9, 11], [13, 3, 11, 7, 15], [1, 12, 14, 5, 9], [11, 9, 5, 19, 7], [5, 14, 4, 18, 19], [6, 15, 7, 19, 18]];

    this.updateValues(width, height, length, Nu, Nv);
  }

  /**
   * Define the vertex and faces of the icosahedron
   */
  function buildIcosahedron(width, height, length, Nu, Nv) {
    width = width/4;

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    width_m_goldenRatio = width*goldenRatio;

    this.vertices = [ new vec4D(0,  width,  width_m_goldenRatio, 1), //0
                      new vec4D(0,  width, -width_m_goldenRatio, 1), //1
                      new vec4D(0, -width,  width_m_goldenRatio, 1), //2
                      new vec4D(0, -width, -width_m_goldenRatio, 1), //3

                      new vec4D( width,  width_m_goldenRatio, 0, 1), //4
                      new vec4D( width, -width_m_goldenRatio, 0, 1), //5
                      new vec4D(-width,  width_m_goldenRatio, 0, 1), //6
                      new vec4D(-width, -width_m_goldenRatio, 0, 1), //7

                      new vec4D( width_m_goldenRatio, 0,  width, 1), //8
                      new vec4D( width_m_goldenRatio, 0, -width, 1), //9
                      new vec4D(-width_m_goldenRatio, 0,  width, 1), //10
                      new vec4D(-width_m_goldenRatio, 0, -width, 1)  //11
                    ];

    this.faces = [[10, 0, 2], [0, 8, 2], [8, 5, 2], [5, 7, 2], [7, 10, 2],
                  [6, 0, 10], [11, 6, 10], [7, 11, 10], [7, 3, 11], [5, 3, 7], [9, 3, 5], [8, 9, 5], [4, 9, 8], [0, 4, 8], [6, 4, 0],
                  [11, 3, 1], [6, 11, 1], [4, 6, 1], [9, 4, 1], [3, 9, 1]];

    // tmpMatrix = new descartesJS.Matrix4x4().setIdentity().rotate(-1.029, new descartesJS.Vector3D(0, 1, 0));
    tmpMatrix = new descartesJS.Matrix4x4().setIdentity().rotateY(-1.029);
    for (i=0, l=this.vertices.length; i<l; i++) {
      this.vertices[i] = tmpMatrix.multiplyVector4(this.vertices[i]);
    }

    this.updateValues(width, height, length, Nu, Nv);
  }

  /**
   * Define the vertex and faces of the sphere
   */
  function buildSphere(width, height, length, Nu, Nv) {
    width = width/2;

    if (this.isSphere) {
      height = width;
      length = width;
    }
    else {
      height = height/2;
      length = length/2;
    }

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    this.vertices = [new vec4D(0, 0, height, 1)];

    for (i=1; i<Nu; i++) {
      phi = (i*MathPI)/Nu;
      for (j=0; j<Nv; j++) {
        theta = (j*Math2PI)/Nv;

        x = width  * MathSin(phi) * MathCos(theta);
        y = length * MathSin(phi) * MathSin(theta);
        z = height * MathCos(phi);

        this.vertices.push(new vec4D(x, y, z, 1));
      }
    }
    this.vertices.push(new vec4D(0, 0, -height, 1));

    this.faces = [];
    // upper part
    for (i=0; i<Nv; i++) {
      this.faces.push([0, ((i+1)%Nv)+1, (i%Nv)+1]);
    }

    // center part
    for (i=1; i<Nu-1; i++) {
      for (j=0; j<Nv; j++) {
        this.faces.push([ j+1 +(i-1)*Nv,
                         (j+1)%Nv +1 +(i-1)*Nv,
                         (j+1)%Nv +1 +i*Nv,
                         j+1 +i*Nv
                        ]);
      }
    }

    // lower part
    for (i=0; i<Nv; i++) {
      this.faces.push([this.vertices.length-1, this.vertices.length-1-Nv +i, this.vertices.length-1-Nv +((i+1)%Nv)]);
    }

    this.updateValues(width, height, length, Nu, Nv);
  }

  /**
   * Define the vertex and faces of the cone
   */
  function buildCone(width, height, length, Nu, Nv) {
    width  = width/2;
    height = height/2;
    length = length/2;

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    this.vertices = [];

    for (i=0; i<Nv; i++) {
      for (j=0; j<Nu; j++) {
        x = width  * (Nv-i)/Nv * MathCos(j*Math2PI/Nu);
        y = length * (Nv-i)/Nv * MathSin(j*Math2PI/Nu);
        z = height -i*2*height/Nv;

        this.vertices.push(new vec4D(x, y, z, 1));
      }
    }
    this.vertices.push(new vec4D(0, 0, -height, 1))

    this.faces = [];

    for (i=0; i<Nv-1; i++) {
      for (j=0; j<Nu; j++) {
        this.faces.push( [j +i*Nu,
                          (j+1)%Nu +i*Nu,
                          (j+1)%Nu +(i+1)*Nu,
                          j +(i+1)*Nu
                         ]
                       );
      }
    }

    // punta
    for (i=0; i<Nu; i++) {
      this.faces.push([this.vertices.length-1, this.vertices.length-1 -Nu +i, this.vertices.length-1 -Nu +(i+1)%Nu]);
    }

    this.updateValues(width, height, length, Nu, Nv);
  }

  /**
   * Define the vertex and faces of the cone
   */
  function buildCylinder(width, height, length, Nu, Nv) {
    width  = width/2;
    height = height/2;
    length = length/2;

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    this.vertices = [];

    for (i=0; i<Nv+1; i++) {
      for (j=0; j<Nu; j++) {
        x = width  * MathCos(j*Math2PI/Nu);
        y = length * MathSin(j*Math2PI/Nu);
        z = height -i*2*height/Nv;

        this.vertices.push(new vec4D(x, y, z, 1));
      }
    }

    this.faces = [];

    for (i=0; i<Nv; i++) {
      for (j=0; j<Nu; j++) {
        this.faces.push( [j +i*Nu,
                          (j+1)%Nu +i*Nu,
                          (j+1)%Nu +(i+1)*Nu,
                          j +(i+1)*Nu
                         ]
                       );
      }
    }

    this.updateValues(width, height, length, Nu, Nv);
  }

  /**
   * Define the vertex and faces of a torus
   */
  function buildTorus(width, height, length, Nu, Nv) {
    width  = width/2;
    height = height/2;
    length = length/2;

    R = evaluator.eval(this.R);
    r = evaluator.eval(this.r);

    // if the geometry has to change
    if (this.changeGeometry(width, height, length, Nu, Nv)) {
      return;
    }

    this.vertices = [];

    for (i=0; i<Nv+1; i++) {
      for (j=0; j<Nu; j++) {
        x = -(R + r * MathSin(Math2PI*j/Nu)) * MathSin(Math2PI*i/Nv);
        y =  (R + r * MathSin(Math2PI*j/Nu))  * MathCos(Math2PI*i/Nv);
        z = r * MathCos(Math2PI*j/Nu);
        this.vertices.push(new vec4D(x, y, z, 1));
      }
    }
    this.faces = [];

    for (i=0; i<Nv; i++) {
      for (j=0; j<Nu; j++) {
        this.faces.push( [j +i*Nu,
                          j +(i+1)*Nu,
                          (j+1)%Nu +(i+1)*Nu,
                          (j+1)%Nu +i*Nu
                         ]
                       );
      }
    }

    this.updateValues(width, height, length, Nu, Nv);
  }

  /**
   * Define the vertex and faces of a mesh
   */
  function buildMesh() {
    this.vertices = [];
    this.faces = [];

    function toInt(x) { return parseInt(x); };
    function toFloat(x) { return parseFloat(x); };

    for (i=0, l=this.fileData.length; i<l; i++) {
      currentLine = this.fileData[i];

      if (currentLine.match(/^V\(/)) {
        tempValue = currentLine.substring(2, currentLine.length-1).split(",").map(toFloat);
        this.vertices.push( new vec4D(tempValue[0] || 0, tempValue[1] || 0, tempValue[2] || 0, 1) );
      }

      else if (currentLine.match(/^F\(/)) {
        tempValue = currentLine.substring(2, currentLine.length-1).split(",").map(toInt);
        this.faces.push(tempValue.reverse());
      }
    }
  }

  /**
   *
   */
  descartesJS.OtherGeometry.prototype.changeGeometry = function(width, height, length, Nu, Nv) {
    return (this.oldWidth  === width) && (this.oldHeight === height) && (this.oldLength === length) && (this.oldNu === Nu) && (this.oldNv === Nv);
  }

  /**
   *
   */
  descartesJS.OtherGeometry.prototype.updateValues = function(width, height, length, Nu, Nv) {
    this.oldWidth = width;
    this.oldHeight = height;
    this.oldLength = length;
    this.oldNv = Nv;
    this.oldNu = Nu;
  }

  return descartesJS;
})(descartesJS || {});
