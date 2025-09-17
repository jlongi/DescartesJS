/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;

  const goldenRatio = 1.6180339887;
  const MathPI  = Math.PI;
  const Math2PI = 2*MathPI;
  const MathSqrt3 = Math.sqrt(3);

  let MathSin = Math.sin;
  let MathCos = Math.cos;
  
  let vec4D; // short name for descartesJS.Vec4D class

  let evaluator;
  let v;
  let theta;
  let phi;

  let R;
  let r;

  let width_d_goldenRatio;
  let width_m_goldenRatio;

  let tmpMatrix;

  let currentLine;
  let tempValue;

  /**
   * 
   */
  class OtherGeometry3D extends descartesJS.Graphic3D {
    /**
     * A Descartes 3D face
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the triangle
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      self = this;

      self.width  = self.width  || parent.evaluator.parser.parse("2");
      self.height = self.height || parent.evaluator.parser.parse("2");
      self.length = self.length || parent.evaluator.parser.parse("2");
      self.R = self.R || parent.evaluator.parser.parse("2");
      self.r = self.r || parent.evaluator.parser.parse("1");

      vec4D = descartesJS.Vec4D;
    }

    /**
     * Build the primitives corresponding to the face
     */
    buildPrimitives() {
      self = this;
      evaluator = self.evaluator;

      self.updateMVMatrix();

      // construct the vertices
      self.buildGeometry(evaluator.eval(self.width), evaluator.eval(self.height), evaluator.eval(self.length), evaluator.eval(self.Nu), evaluator.eval(self.Nv));

      let tmpFrontColor = self.color.getColor();
      let tmpBackColor  = self.backcolor.getColor();
      let tmpEdgeColor  = (self.edges) ? self.edges.getColor() : "";

      for (let face_i of self.faces) {
        v = [];
        for (let face_i_j of face_i) {
          v.push( self.transformVertex(self.V[face_i_j]) );
        }

        self.primitives.push( 
          new descartesJS.Primitive3D( {
            V: v,
            type: "face",
            frontColor: tmpFrontColor,
            backColor: tmpBackColor,
            edges: tmpEdgeColor,
            model: self.model
          },
          self.space
        ));
      }
    }

    /**
     *
     */
    changeGeometry(width, height, length, Nu, Nv) {
      return (this.oldW  === width) && (this.oldH === height) && (this.oldL === length) && (this.oldNu === Nu) && (this.oldNv === Nv);
    }

    /**
     *
     */
    updateValues(width, height, length, Nu, Nv) {
      this.oldW = width;
      this.oldH = height;
      this.oldL = length;
      this.oldNv = Nv;
      this.oldNu = Nu;
    }
  }


  /**
   * 
   */
  class Box3D extends OtherGeometry3D {
    constructor(parent, values) {
      super(parent, values);

      this.faces = [[2, 3, 1, 0], [1, 5, 4, 0], [5, 7, 6, 4], [6, 7, 3, 2], [4, 6, 2, 0], [3, 7, 5, 1]];
    }
  
    buildGeometry(width, height, length, Nu, Nv) {
      width  = width/2;
      height = height/2;
      length = length/2;
  
      // if the geometry has to change
      if (this.changeGeometry(width, height, length, Nu, Nv)) {
        return;
      }
  
      this.V = [
        new vec4D( width,  length,  height), //0
        new vec4D( width, -length,  height), //1
        new vec4D( width,  length, -height), //2
        new vec4D( width, -length, -height), //3
        new vec4D(-width,  length,  height), //4
        new vec4D(-width, -length,  height), //5
        new vec4D(-width,  length, -height), //6
        new vec4D(-width, -length, -height)  //7
      ];

      this.updateValues(width, height, length, Nu, Nv);
    }
  }


  /**
   * 
   */
  class Cube3D extends Box3D {
    constructor(parent, values) {
      super(parent, values);
    }
  
    buildGeometry(width, height, length, Nu, Nv) {
      height = width/MathSqrt3;
      super.buildGeometry(height, height, height, Nu, Nv);
    }
  }


  /**
   * 
   */
  class Tetrahedron3D extends OtherGeometry3D {
    constructor(parent, values) {
      super(parent, values);

      this.faces = [[1, 3, 2], [0, 1, 2], [0, 2, 3], [0, 3, 1]];
    }
  
    buildGeometry(width, height, length, Nu, Nv) {
      width = width/2;
  
      // if the geometry has to change
      if (this.changeGeometry(width, height, length, Nu, Nv)) {
        return;
      }
      
      let angle = Math2PI/3;
      let c = Math.cos(angle);
      let s = Math.sin(angle);
      let x = width*2*Math.sqrt(2)/3;
      let y = 0;
      let z = -width*1/3;
      let x0 =  x*c + y*s;
      let y0 = -x*s + y*c;
      this.V = [
        new vec4D( 0,   0, width), //0
        new vec4D(x0,  y0,     z), //1
        new vec4D(x0, -y0,     z), //2
        new vec4D( x,   y,     z), //3
      ];

      this.updateValues(width, height, length, Nu, Nv);
    }
  }


  /**
   * 
   */
  class Octahedron3D extends OtherGeometry3D {
    constructor(parent, values) {
      super(parent, values);

      this.faces = [[3, 1, 0], [2, 3, 0], [1, 4, 0], [4, 2, 0], [1, 3, 5], [3, 2, 5], [4, 1, 5], [2, 4, 5]];
    }
  
    buildGeometry(width, height, length, Nu, Nv) {
      width = width/2;
  
      // if the geometry has to change
      if (this.changeGeometry(width, height, length, Nu, Nv)) {
        return;
      }
  
      this.V = [
        new vec4D( 0,          0,  width), //0
        new vec4D( width,      0,      0), //1
        new vec4D(-width,      0,      0), //2
        new vec4D( 0,      width,      0), //3
        new vec4D( 0,     -width,      0), //4
        new vec4D( 0,          0, -width)  //5
      ];
    
      this.updateValues(width, height, length, Nu, Nv);
    }
  }


  /**
   * 
   */
  class Ellipsoid3D extends OtherGeometry3D {
    constructor(parent, values) {
      super(parent, values);
    }
  
    buildGeometry(width, height, length, Nu, Nv) {
      width  = width/2;
      height = height/2;
      length = length/2;
  
      // if the geometry has to change
      if (this.changeGeometry(width, height, length, Nu, Nv)) {
        return;
      }
  
      this.V = [new vec4D(0, 0, height)];
  
      for (let i=1; i<Nu; i++) {
        phi = (i*MathPI)/Nu;
        for (let j=0; j<Nv; j++) {
          theta = (j*Math2PI)/Nv;

          this.V.push(
            new vec4D(
              width  * MathSin(phi) * MathCos(theta),
              length * MathSin(phi) * MathSin(theta),
              height * MathCos(phi)
            )
          );
        }
      }
      this.V.push(new vec4D(0, 0, -height));
  
      this.faces = [];
      // upper part
      for (let i=0; i<Nv; i++) {
        this.faces.push([0, ((i+1)%Nv)+1, (i%Nv)+1]);
      }
  
      // center part
      for (let i=1; i<Nu-1; i++) {
        for (let j=0; j<Nv; j++) {
          this.faces.push([
            j+1 +(i-1)*Nv,
            (j+1)%Nv +1 +(i-1)*Nv,
            (j+1)%Nv +1 +i*Nv,
            j+1 +i*Nv
          ]);
        }
      }
  
      // lower part
      for (let i=0; i<Nv; i++) {
        this.faces.push([this.V.length-1, this.V.length-1-Nv +i, this.V.length-1-Nv +((i+1)%Nv)]);
      }
  
      this.updateValues(width, height, length, Nu, Nv);
    }
  }


  /**
   * 
   */
  class Sphere3D extends Ellipsoid3D {
    constructor(parent, values) {
      super(parent, values);
    }
  
    buildGeometry(width, height, length, Nu, Nv) {
      super.buildGeometry(width, width, width, Nu, Nv);
    }
  }


  /**
   * 
   */
  class Dodecahedron3D extends OtherGeometry3D {
    constructor(parent, values) {
      super(parent, values);

      this.faces = [[0, 16, 2, 10, 8], [12, 1, 17, 16, 0], [8, 4, 14, 12, 0], [2, 16, 17, 3, 13], [13, 15, 6, 10, 2], [6, 18, 4, 8, 10], [3, 17, 1, 9, 11], [13, 3, 11, 7, 15], [1, 12, 14, 5, 9], [11, 9, 5, 19, 7], [5, 14, 4, 18, 19], [6, 15, 7, 19, 18]];
    }
  
    buildGeometry(width, height, length, Nu, Nv) {
      width = width/Math.PI;
  
      // if the geometry has to change
      if (this.changeGeometry(width, height, length, Nu, Nv)) {
        return;
      }
  
      width_d_goldenRatio = width/goldenRatio;
      width_m_goldenRatio = width*goldenRatio;
  
      this.V = [
        new vec4D( width,  width,  width), //0
        new vec4D( width,  width, -width), //1
        new vec4D( width, -width,  width), //2
        new vec4D( width, -width, -width), //3
        new vec4D(-width,  width,  width), //4
        new vec4D(-width,  width, -width), //5
        new vec4D(-width, -width,  width), //6
        new vec4D(-width, -width, -width), //7
  
        new vec4D(0,  width_d_goldenRatio,  width_m_goldenRatio), //8
        new vec4D(0,  width_d_goldenRatio, -width_m_goldenRatio), //9
        new vec4D(0, -width_d_goldenRatio,  width_m_goldenRatio), //10
        new vec4D(0, -width_d_goldenRatio, -width_m_goldenRatio), //11
  
        new vec4D( width_d_goldenRatio,  width_m_goldenRatio, 0), //12
        new vec4D( width_d_goldenRatio, -width_m_goldenRatio, 0), //13
        new vec4D(-width_d_goldenRatio,  width_m_goldenRatio, 0), //14
        new vec4D(-width_d_goldenRatio, -width_m_goldenRatio, 0), //15
  
        new vec4D( width_m_goldenRatio, 0,  width_d_goldenRatio), //16
        new vec4D( width_m_goldenRatio, 0, -width_d_goldenRatio), //17
        new vec4D(-width_m_goldenRatio, 0,  width_d_goldenRatio), //18
        new vec4D(-width_m_goldenRatio, 0, -width_d_goldenRatio)  //19
      ];
  
      tmpMatrix = new descartesJS.Mat4().setIdentity().rotateY(-MathPI/6);
  
      for (let i=0, l=this.V.length; i<l; i++) {
        this.V[i] = tmpMatrix.mulV4(this.V[i]);
      }
 
      this.updateValues(width, height, length, Nu, Nv);
    }
  }


  /**
   * 
   */
  class Icosahedron3D extends OtherGeometry3D {
    constructor(parent, values) {
      super(parent, values);

      this.faces = [[10, 0, 2], [0, 8, 2], [8, 5, 2], [5, 7, 2], [7, 10, 2],
      [6, 0, 10], [11, 6, 10], [7, 11, 10], [7, 3, 11], [5, 3, 7], [9, 3, 5], [8, 9, 5], [4, 9, 8], [0, 4, 8], [6, 4, 0],
      [11, 3, 1], [6, 11, 1], [4, 6, 1], [9, 4, 1], [3, 9, 1]];
    }
  
    buildGeometry(width, height, length, Nu, Nv) {
      width = width/3.8;
  
      // if the geometry has to change
      if (this.changeGeometry(width, height, length, Nu, Nv)) {
        return;
      }
  
      width_m_goldenRatio = width*goldenRatio;
  
      this.V = [
        new vec4D(0,  width,  width_m_goldenRatio), //0
        new vec4D(0,  width, -width_m_goldenRatio), //1
        new vec4D(0, -width,  width_m_goldenRatio), //2
        new vec4D(0, -width, -width_m_goldenRatio), //3
  
        new vec4D( width,  width_m_goldenRatio, 0), //4
        new vec4D( width, -width_m_goldenRatio, 0), //5
        new vec4D(-width,  width_m_goldenRatio, 0), //6
        new vec4D(-width, -width_m_goldenRatio, 0), //7
  
        new vec4D( width_m_goldenRatio, 0,  width), //8
        new vec4D( width_m_goldenRatio, 0, -width), //9
        new vec4D(-width_m_goldenRatio, 0,  width), //10
        new vec4D(-width_m_goldenRatio, 0, -width)  //11
      ];
    
      tmpMatrix = new descartesJS.Mat4().setIdentity().rotateY(-1.0285);
  
      for (let i=0, l=this.V.length; i<l; i++) {
        this.V[i] = tmpMatrix.mulV4(this.V[i]);
      }
  
      this.updateValues(width, height, length, Nu, Nv);
    }
  }


  /**
   * 
   */
  class Cone3D extends OtherGeometry3D {
    constructor(parent, values) {
      super(parent, values);
    }
  
    buildGeometry(width, height, length, Nu, Nv) {
      width  = width/2;
      height = height/2;
      length = length/2;
  
      // if the geometry has to change
      if (this.changeGeometry(width, height, length, Nu, Nv)) {
        return;
      }
  
      this.V = [];
  
      for (let i=0; i<Nv; i++) {
        for (let j=0; j<Nu; j++) {
          this.V.push(
            new vec4D(
              width  * (Nv-i)/Nv * MathCos(j*Math2PI/Nu),
              length * (Nv-i)/Nv * MathSin(j*Math2PI/Nu),
              height -i*2*height/Nv
            )
          );
        }
      }
      this.V.push(new vec4D(0, 0, -height))
  
      this.faces = [];
  
      for (let i=0; i<Nv-1; i++) {
        for (let j=0; j<Nu; j++) {
          this.faces.push([
            j +i*Nu,
            (j+1)%Nu +i*Nu,
            (j+1)%Nu +(i+1)*Nu,
            j +(i+1)*Nu
          ]);
        }
      }
  
      // tip
      for (let i=0; i<Nu; i++) {
        this.faces.push([this.V.length-1, this.V.length-1 -Nu +i, this.V.length-1 -Nu +(i+1)%Nu]);
      }
  
      this.updateValues(width, height, length, Nu, Nv);
    }
  }


  /**
   * 
   */
  class Cylinder3D extends OtherGeometry3D {
    constructor(parent, values) {
      super(parent, values);
    }
  
    buildGeometry(width, height, length, Nu, Nv) {
      width  = width/2;
      height = height/2;
      length = length/2;
  
      // if the geometry has to change
      if (this.changeGeometry(width, height, length, Nu, Nv)) {
        return;
      }
  
      this.V = [];
  
      for (let i=0; i<Nv+1; i++) {
        for (let j=0; j<Nu; j++) {
          this.V.push(
            new vec4D(
              width  * MathCos(j*Math2PI/Nu),
              length * MathSin(j*Math2PI/Nu),
              height -i*2*height/Nv
            )
          );
        }
      }
  
      this.faces = [];
  
      for (let i=0; i<Nv; i++) {
        for (let j=0; j<Nu; j++) {
          this.faces.push([
            j +i*Nu,
            (j+1)%Nu +i*Nu,
            (j+1)%Nu +(i+1)*Nu,
            j +(i+1)*Nu
          ]);
        }
      }
  
      this.updateValues(width, height, length, Nu, Nv);
    }
  }


  /**
   * 
   */
  class Torus3D extends OtherGeometry3D {
    constructor(parent, values) {
      super(parent, values);
    }
  
    buildGeometry(width, height, length, Nu, Nv) {
      width  = width/2;
      height = height/2;
      length = length/2;
  
      R = evaluator.eval(this.R);
      r = evaluator.eval(this.r);
  
      // if the geometry has to change
      if (this.changeGeometry(width, height, length, Nu, Nv)) {
        return;
      }
  
      this.V = [];
  
      for (let i=0; i<Nv+1; i++) {
        for (let j=0; j<Nu; j++) {
          this.V.push(
            new vec4D(
              -(R + r * MathSin(Math2PI*j/Nu)) * MathSin(Math2PI*i/Nv),
               (R + r * MathSin(Math2PI*j/Nu)) * MathCos(Math2PI*i/Nv),
              r * MathCos(Math2PI*j/Nu)
            )
          );
        }
      }
      this.faces = [];
  
      for (let i=0; i<Nv; i++) {
        for (let j=0; j<Nu; j++) {
          this.faces.push([
            j +i*Nu,
            j +(i+1)*Nu,
            (j+1)%Nu +(i+1)*Nu,
            (j+1)%Nu +i*Nu
          ]);
        }
      }
  
      this.updateValues(width, height, length, Nu, Nv);
    }
  }


  /**
   * 
   */
  class Mesh3D extends OtherGeometry3D {
    constructor(parent, values) {
      super(parent, values);
      self.fileData = descartesJS.openFile(self.evaluator.eval(self.file)).split(/\r/);
    }
  
    buildGeometry() {
      this.V = [];
      this.faces = [];
  
      for (let i=0, l=this.fileData.length; i<l; i++) {
        currentLine = this.fileData[i];
  
        if (currentLine.startsWith("V")) {
          tempValue = currentLine.slice(2, -1).split(",").map(parseFloat);
          this.V.push( 
            new vec4D(
              tempValue[0] || 0,
              tempValue[1] || 0,
              tempValue[2] || 0
            )
          );
        }
  
        else if (currentLine.startsWith("F")) {
          tempValue = currentLine.slice(2, -1).split(",").map(parseInt);
          this.faces.push(tempValue.reverse());
        }
      }
    }
  }

  descartesJS.OtherGeometry3D = OtherGeometry3D;
  descartesJS.Cube3D = Cube3D;
  descartesJS.Box3D = Box3D;
  descartesJS.Tetrahedron3D = Tetrahedron3D;
  descartesJS.Octahedron3D = Octahedron3D;
  descartesJS.Sphere3D = Sphere3D;
  descartesJS.Ellipsoid3D = Ellipsoid3D;
  descartesJS.Dodecahedron3D = Dodecahedron3D;
  descartesJS.Icosahedron3D = Icosahedron3D;
  descartesJS.Cone3D = Cone3D;
  descartesJS.Cylinder3D = Cylinder3D;
  descartesJS.Torus3D = Torus3D;
  descartesJS.Mesh3D = Mesh3D;

  return descartesJS;
})(descartesJS || {});
