/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathSqrt = Math.sqrt;
  var MathSin = Math.sin;
  var MathCos = Math.cos;
  var MathAbs = Math.abs;

  var len;
  var s;
  var c;
  var a00;
  var a01;
  var a02;
  var a03;
  var a10;
  var a11;
  var a12;
  var a13;
  var a20;
  var a21;
  var a22;
  var a23;

  var pres = 1000000000;

  class Vector4D {
    constructor(x, y, z, w) {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
      this.w = w || 0;
      this.adjustDec();
    }

    adjustDec() {
      this.x = parseInt(this.x*pres)/pres;
      this.y = parseInt(this.y*pres)/pres;
      this.z = parseInt(this.z*pres)/pres;
    }
  }

  class Matrix4x4 {
    constructor( a00, a01, a02, a03,
                 a10, a11, a12, a13,
                 a20, a21, a22, a23,
                 a30, a31, a32, a33
               ) {
      this.a00 = a00 || 0;
      this.a01 = a01 || 0;
      this.a02 = a02 || 0;
      this.a03 = a03 || 0;
      this.a10 = a10 || 0;
      this.a11 = a11 || 0;
      this.a12 = a12 || 0;
      this.a13 = a13 || 0;
      this.a20 = a20 || 0;
      this.a21 = a21 || 0;
      this.a22 = a22 || 0;
      this.a23 = a23 || 0;
      this.a30 = a30 || 0;
      this.a31 = a31 || 0;
      this.a32 = a32 || 0;
      this.a33 = a33 || 0;
    }

    setIdentity() {
      this.a00 = 1;
      this.a01 = 0;
      this.a02 = 0;
      this.a03 = 0;
      
      this.a10 = 0;
      this.a11 = 1;
      this.a12 = 0;
      this.a13 = 0;
      
      this.a20 = 0;
      this.a21 = 0;
      this.a22 = 1;
      this.a23 = 0;

      this.a30 = 0;
      this.a31 = 0;
      this.a32 = 0;
      this.a33 = 1;
      
      return this;
    }

    multiplyVector4(v) {
      return new Vector4D(
        v.x * this.a00 + v.y * this.a10 + v.z * this.a20 + v.w * this.a30,
        v.x * this.a01 + v.y * this.a11 + v.z * this.a21 + v.w * this.a31,
        v.x * this.a02 + v.y * this.a12 + v.z * this.a22 + v.w * this.a32,
        v.x * this.a03 + v.y * this.a13 + v.z * this.a23 + v.w * this.a33
      );
    }

    translate(v) {
      return new Matrix4x4(
        this.a00, this.a01, this.a02, this.a03,
        this.a10, this.a11, this.a12, this.a13,
        this.a20, this.a21, this.a22, this.a23,
        this.a00 * v.x + this.a10 * v.y + this.a20 * v.z + this.a30, this.a01 * v.x + this.a11 * v.y + this.a21 * v.z + this.a31, this.a02 * v.x + this.a12 * v.y + this.a22 * v.z + this.a32, this.a03 * v.x + this.a13 * v.y + this.a23 * v.z + this.a33
      );
    }

    rotateX(angle) {
      s = MathSin(angle);
      c = MathCos(angle);
      
      a10 = this.a10;
      a11 = this.a11;
      a12 = this.a12;
      a13 = this.a13;
      a20 = this.a20;
      a21 = this.a21;
      a22 = this.a22;
      a23 = this.a23;
      
      return new Matrix4x4(
        this.a00, this.a01, this.a02, this.a03,
        a10 *  c + a20 * s, a11 *  c + a21 * s, a12 *  c + a22 * s, a13 *  c + a23 * s,
        a10 * -s + a20 * c, a11 * -s + a21 * c, a12 * -s + a22 * c, a13 * -s + a23 * c,
        this.a30, this.a31, this.a32, this.a33
      );
    }
    
    rotateY(angle) {
      s = MathSin(angle);
      c = MathCos(angle);
      
      a00 = this.a00;
      a01 = this.a01;
      a02 = this.a02;
      a03 = this.a03;
      a20 = this.a20;
      a21 = this.a21;
      a22 = this.a22;
      a23 = this.a23;
      
      return new Matrix4x4(
        a00 * c + a20 * -s, a01 * c + a21 * -s, a02 * c + a22 * -s, a03 * c + a23 * -s,
        this.a10, this.a11, this.a12, this.a13, 
        a00 * s + a20 * c, a01 * s + a21 * c, a02 * s + a22 * c, a03 * s + a23 * c,
        this.a30, this.a31, this.a32, this.a33
      );
    }

    rotateZ(angle) {  
      s = MathSin(angle);
      c = MathCos(angle);
      
      a00 = this.a00;
      a01 = this.a01;
      a02 = this.a02;
      a03 = this.a03;
      a10 = this.a10;
      a11 = this.a11;
      a12 = this.a12;
      a13 = this.a13;
      
      return new Matrix4x4(
        a00 *  c + a10 * s, a01 *  c + a11 * s, a02 *  c + a12 * s, a03 *  c + a13 * s,
        a00 * -s + a10 * c, a01 * -s + a11 * c, a02 * -s + a12 * c, a03 * -s + a13 * c,
        this.a20, this.a21, this.a22, this.a23,
        this.a30, this.a31, this.a32, this.a33
      );
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  descartesJS.norm3D = function(v) {
    return MathSqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }

  descartesJS.normalize3D = function(v) {
    len = descartesJS.norm3D(v);

    if (len === 0) {
      return { 
        x: 0, 
        y: 0, 
        z: 0 
      };
    }
    else if (len === 1) {
      return { 
        x: v.x, 
        y: v.y, 
        z: v.z 
      };
    }
    
    len = 1/len;

    return { 
      x: v.x*len, 
      y: v.y*len, 
      z: v.z*len 
    };   
  }

  descartesJS.dotProduct3D = function(v1, v2) {
    return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;    
  }

  descartesJS.crossProduct3D = function(v1, v2) {
    return { 
      x: v1.y*v2.z - v1.z*v2.y,
      y: v1.z*v2.x - v1.x*v2.z,
      z: v1.x*v2.y - v1.y*v2.x
    };
  }

  descartesJS.scalarProduct3D = function(v, s) {
    return { 
      x: v.x*s, 
      y: v.y*s,
      z: v.z*s
    };
  }

  descartesJS.subtract3D = function(v1, v2) {
    return { 
      x: v1.x - v2.x,
      y: v1.y - v2.y,
      z: v1.z - v2.z
    };
  }

  descartesJS.add3D = function(v1, v2) {
    return { 
      x: v1.x + v2.x,
      y: v1.y + v2.y,
      z: v1.z + v2.z
    };
  }

  descartesJS.equals3DEpsilon = function(p1, p2, epsilon) {
    return (MathAbs(p1.x-p2.x) <= epsilon) && 
            (MathAbs(p1.y-p2.y) <= epsilon) && 
            (MathAbs(p1.z-p2.z) <= epsilon);
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  descartesJS.Vector4D = Vector4D;
  descartesJS.Matrix4x4 = Matrix4x4;
  return descartesJS;
})(descartesJS || {});