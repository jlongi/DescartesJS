/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var width;
  var height;
  var length;
  var backcolor;
  var fillStyle;
  var v;

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

    // call the parent constructor
    descartesJS.Graphic3D.call(this, parent, values);

    this.mvMatrix = (new descartesJS.Matrix4x4()).setIdentity();

    // console.log("XXXXX", this.type)

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



      case("mesh"):
        this.fileData = descartesJS.openExternalFile(this.evaluator.evalExpression(this.file)).split(/\r/);
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

    this.buildGeometry();

    backcolor = this.color.getColor();
    fillStyle = this.backcolor.getColor();

    for (var i=0, l=this.faces.length; i<l; i++) {
      v = [];
      for (var j=0, k=this.faces[i].length; j<k; j++) {
        v.push( this.mvMatrix.multiplyVector4(this.vertices[this.faces[i][j]]) );
      }

      this.primitives.push(new descartesJS.Primitive3D( v,
                                                        "face",
                                                        { backcolor: backcolor, 
                                                          fillStyle: fillStyle, 
                                                          strokeStyle: "#808080", 
                                                          lineCap: "round",
                                                          lineJoin: "round",
                                                          edges: this.edges, 
                                                          model: this.model
                                                        }
                                                      ));
    }

  }

  /**
   * Define the vertex and faces of the cube
   */
  function buildCube() {
    width = this.evaluator.evalExpression(this.width)/4;

    this.vertices = [ new descartesJS.Vector4D( width,  width,  width, 1), //0
                      new descartesJS.Vector4D( width, -width,  width, 1), //1
                      new descartesJS.Vector4D( width,  width, -width, 1), //2
                      new descartesJS.Vector4D( width, -width, -width, 1), //3
                      new descartesJS.Vector4D(-width,  width,  width, 1), //4
                      new descartesJS.Vector4D(-width, -width,  width, 1), //5
                      new descartesJS.Vector4D(-width,  width, -width, 1), //6
                      new descartesJS.Vector4D(-width, -width, -width, 1)  //7
               ];

    this.faces = [[0, 1, 3, 2], [0, 4, 5, 1], [4, 6, 7, 5], [2, 3, 7, 6], [0, 2, 6, 4], [1, 5, 7, 3]];
  }

  /**
   * Define the vertex and faces of the box
   */
  function buildBox() {
    width =  this.evaluator.evalExpression(this.width)/2;
    height = this.evaluator.evalExpression(this.height)/2;
    length = this.evaluator.evalExpression(this.length)/2;

    this.vertices = [ new descartesJS.Vector4D( width,  length,  height, 1), //0
                      new descartesJS.Vector4D( width, -length,  height, 1), //1
                      new descartesJS.Vector4D( width,  length, -height, 1), //2
                      new descartesJS.Vector4D( width, -length, -height, 1), //3
                      new descartesJS.Vector4D(-width,  length,  height, 1), //4
                      new descartesJS.Vector4D(-width, -length,  height, 1), //5
                      new descartesJS.Vector4D(-width,  length, -height, 1), //6
                      new descartesJS.Vector4D(-width, -length, -height, 1)  //7
               ];

    this.faces = [[0, 1, 3, 2], [0, 4, 5, 1], [4, 6, 7, 5], [2, 3, 7, 6], [0, 2, 6, 4], [1, 5, 7, 3]];
  }

  /**
   * Define the vertex and faces of the tetrahedron
   */
  function buildTetrahedron() {
    width = evaluator.evalExpression(this.width)/2;

    this.vertices = [ new descartesJS.Vector4D(          0,           0,       width, 1), //0
                      new descartesJS.Vector4D(-0.49*width, -0.86*width, -0.32*width, 1), //1
                      new descartesJS.Vector4D(-0.49*width,  0.86*width, -0.32*width, 1), //2
                      new descartesJS.Vector4D(    1*width,           0, -0.32*width, 1)  //3
               ];

    this.faces = [[1, 2, 3], [0, 2, 1], [0, 3, 2], [0, 1, 3]];
  }

  /**
   * Define the vertex and faces of the octahedron
   */
  function buildOctahedron() {
    width = evaluator.evalExpression(this.width)/2;

    this.vertices = [ new descartesJS.Vector4D( 0,          0,  width, 1), //0
                      new descartesJS.Vector4D( width,      0,      0, 1), //1
                      new descartesJS.Vector4D(-width,      0,      0, 1), //2
                      new descartesJS.Vector4D( 0,      width,      0, 1), //3
                      new descartesJS.Vector4D( 0,     -width,      0, 1), //4
                      new descartesJS.Vector4D( 0,          0, -width, 1)  //5
               ];

    this.faces = [[0, 1, 3], [0, 3, 2], [0, 4, 1], [0, 2, 4], [5, 3, 1], [5, 2, 3], [5, 1, 4], [5, 4, 2]];
  }
  
  var currentLine;
  var tempValue;
  var tempFace;
  /**
   * Define the vertex and faces of the octahedron
   */
  function buildMesh() {
    this.vertices = [];
    this.faces = [];

    function toInt(x) { return parseInt(x); };
    function toFloat(x) { return parseFloat(x); };

    for (var i=0, l=this.fileData.length; i<l; i++) {
      currentLine = this.fileData[i];
      
      if (currentLine.match(/^V\(/)) {
        tempValue = currentLine.substring(2, currentLine.length-1).split(",").map(toFloat);
        this.vertices.push( new descartesJS.Vector4D(tempValue[0] || 0, tempValue[1] || 0, tempValue[2] || 0, 1) );
      }

      else if (currentLine.match(/^F\(/)) {
        tempValue = currentLine.substring(2, currentLine.length-1).split(",").map(toInt);
        this.faces.push(tempValue);
      }
    }

    // console.log(this.faces)

  }

  return descartesJS;
})(descartesJS || {});