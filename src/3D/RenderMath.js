/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let MathSqrt = Math.sqrt;
  let MathSin  = Math.sin;
  let MathCos  = Math.cos;
  let MathAbs  = Math.abs;

  /**
   * 
   */
  class Vec4D {
    /**
     * 
     */
    constructor(x=0, y=0, z=0, w=1) {
      this.D = new Float32Array(4);
      this.set(x, y, z, w);
    }

    /**
     * 
     */
    set(x, y, z, w) {
      this.D[0] = x;
      this.D[1] = y;
      this.D[2] = z;
      this.D[3] = w;
      return this;
    }

    // Getters y setters
    get x() { return this.D[0]; }
    set x(val) { this.D[0] = val; }
    get y() { return this.D[1]; }
    set y(val) { this.D[1] = val; }
    get z() { return this.D[2]; }
    set z(val) { this.D[2] = val; }
    get w() { return this.D[3]; }
    set w(val) { this.D[3] = val; }

    /**
     * 
     */
    norm3D() {
      let x = this.D[0];
      let y = this.D[1];
      let z = this.D[2];
      return MathSqrt(x * x + y * y + z * z);
    }

    /**
     * 
     */
    normalize3D(out=new Vec4D()) {
      let len = this.norm3D();
      if (len === 0) {
        return out.set(0, 0, 0, this.w);
      }
      let invLen = 1 / len;
      return out.set(
        this.D[0] * invLen,
        this.D[1] * invLen,
        this.D[2] * invLen,
        this.w
      );
    }

    /**
     * 
     */
    dotProduct3D(other) {
      return this.D[0] * other.D[0] + 
             this.D[1] * other.D[1] + 
             this.D[2] * other.D[2];
    }

    /**
     * 
     */
    crossProduct3D(other, out=new Vec4D()) {
      let [x1, y1, z1] = this.D;
      let [x2, y2, z2] = other.D;
      return out.set(
        y1 * z2 - z1 * y2,
        z1 * x2 - x1 * z2,
        x1 * y2 - y1 * x2,
        out.w
      );
    }

    /**
     * 
     */
    scalarProd3D(s, out=new Vec4D()) {
      return out.set(
        this.D[0] * s,
        this.D[1] * s,
        this.D[2] * s,
        this.w
      );
    }

    /**
     * 
     */
    subtract3D(other, out=new Vec4D()) {
      return out.set(
        this.D[0] - other.D[0],
        this.D[1] - other.D[1],
        this.D[2] - other.D[2],
        this.w
      );
    }

    /**
     * 
     */
    add3D(other, out=new Vec4D()) {
      return out.set(
        this.D[0] + other.D[0],
        this.D[1] + other.D[1],
        this.D[2] + other.D[2],
        this.w
      );
    }

    /**
     * 
     */
    equals3D(other, epsilon) {
      return (MathAbs(this.D[0] - other.D[0]) <= epsilon) &&
             (MathAbs(this.D[1] - other.D[1]) <= epsilon) &&
             (MathAbs(this.D[2] - other.D[2]) <= epsilon);
    }

    /**
     * 
     */
    clone() {
      return new Vec4D(this.D[0], this.D[1], this.D[2], this.D[3]);
    }
  }

  class Mat4 {
    /**
     * 
     */
    constructor(
      a00=0, a01=0, a02=0, a03=0,
      a10=0, a11=0, a12=0, a13=0,
      a20=0, a21=0, a22=0, a23=0,
      a30=0, a31=0, a32=0, a33=0
    ) {
      // row-major form
      this.D = new Float32Array(16);
      this.set(
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        a30, a31, a32, a33
      );
    }

    /**
     * 
     */
    set(
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        a30, a31, a32, a33
    ) {
      let d = this.D;
      // row 0
      d[0] = a00; d[1] = a01; d[2] = a02; d[3] = a03;
      // row 1
      d[4] = a10; d[5] = a11; d[6] = a12; d[7] = a13;
      // row 2
      d[8] = a20; d[9] = a21; d[10] = a22; d[11] = a23;
      // row 3
      d[12] = a30; d[13] = a31; d[14] = a32; d[15] = a33;
      return this;
    }

    /**
     * 
     */
    setIdentity() {
      let d = this.D;
      d[0]=1;  d[1]=0;  d[2]=0;  d[3]=0;
      d[4]=0;  d[5]=1;  d[6]=0;  d[7]=0;
      d[8]=0;  d[9]=0;  d[10]=1; d[11]=0;
      d[12]=0; d[13]=0; d[14]=0; d[15]=1;
      return this;
    }

    /**
     * 
     */
    mulV4(v, out=new Vec4D()) {
      let d = this.D;
      let v_d = v.D;
      let out_d = out.D;

      let x = v_d[0];
      let y = v_d[1];
      let z = v_d[2];
      let w = v_d[3];

      out_d[0] = x * d[0] + y * d[4] + z * d[8]  + w * d[12]; // v.x * a00 + v.y * a10 + v.z * a20 + v.w * a30
      out_d[1] = x * d[1] + y * d[5] + z * d[9]  + w * d[13]; // v.x * a01 + v.y * a11 + v.z * a21 + v.w * a31
      out_d[2] = x * d[2] + y * d[6] + z * d[10] + w * d[14]; // v.x * a02 + v.y * a12 + v.z * a22 + v.w * a32
      out_d[3] = x * d[3] + y * d[7] + z * d[11] + w * d[15]; // v.x * a03 + v.y * a13 + v.z * a23 + v.w * a33

      return out;
    }

    /**
     * 
     */
    translate(v, out=new Mat4().setIdentity()) {
      let d = this.D;
      let o = out.D;

      if (!(v instanceof Vec4D)) {
        v = new Vec4D(v.x, v.y, v.z, v.w);
      }

      let vx = v.D[0];
      let vy = v.D[1];
      let vz = v.D[2];

      // row 0
      o[0]=d[0]; o[1]=d[1]; o[2]=d[2];   o[3]=d[3];
      // row 1
      o[4]=d[4]; o[5]=d[5]; o[6]=d[6];   o[7]=d[7];
      // row 2
      o[8]=d[8]; o[9]=d[9]; o[10]=d[10]; o[11]=d[11];

      // translation
      o[12] = d[0] * vx + d[4] * vy + d[8]  * vz + d[12]; // a00*vx + a10*vy + a20*vz + a30
      o[13] = d[1] * vx + d[5] * vy + d[9]  * vz + d[13]; // a01*vx + a11*vy + a21*vz + a31
      o[14] = d[2] * vx + d[6] * vy + d[10] * vz + d[14]; // a02*vx + a12*vy + a22*vz + a32
      o[15] = d[3] * vx + d[7] * vy + d[11] * vz + d[15]; // a03*vx + a13*vy + a23*vz + a33

      return out;
    }

    /**
     * 
     */
    rotateX(angle, out=new Mat4().setIdentity()) {
      let d = this.D;
      let o = out.D;
      let s = MathSin(angle);
      let c = MathCos(angle);

      // row 0 (col 0,1,2,3) copy
      o[0]=d[0]; o[1]=d[1]; o[2]=d[2]; o[3]=d[3];

      // row 1 (col 4,5,6,7)
      o[4] = d[4] * c + d[8]  * s; // a10 * c + a20 * s
      o[5] = d[5] * c + d[9]  * s; // a11 * c + a21 * s
      o[6] = d[6] * c + d[10] * s; // a12 * c + a22 * s
      o[7] = d[7] * c + d[11] * s; // a13 * c + a23 * s

      // row 2 (col 8,9,10,11)
      o[8]  = d[4] * -s + d[8]  * c; // a10 * -s + a20 * c
      o[9]  = d[5] * -s + d[9]  * c; // a11 * -s + a21 * c
      o[10] = d[6] * -s + d[10] * c; // a12 * -s + a22 * c
      o[11] = d[7] * -s + d[11] * c; // a13 * -s + a23 * c

      // Fila 3 (col 12,13,14,15) copy
      o[12]=d[12]; o[13]=d[13]; o[14]=d[14]; o[15]=d[15];

      return out;
    }

    /**
     * 
     */
    rotateY(angle, out=new Mat4().setIdentity()) {
      let d = this.D;
      let o = out.D;
      let s = MathSin(angle);
      let c = MathCos(angle);

      // row 0 (col 0,1,2,3)
      o[0] = d[0] * c + d[8]  * -s; // a00 * c + a20 * -s
      o[1] = d[1] * c + d[9]  * -s; // a01 * c + a21 * -s
      o[2] = d[2] * c + d[10] * -s; // a02 * c + a22 * -s
      o[3] = d[3] * c + d[11] * -s; // a03 * c + a23 * -s

      // row 1 (col 4,5,6,7) copy
      o[4]=d[4]; o[5]=d[5]; o[6]=d[6]; o[7]=d[7];

      // row 2 (col 8,9,10,11) 
      o[8]  = d[0] * s + d[8]  * c; // a00 * s + a20 * c
      o[9]  = d[1] * s + d[9]  * c; // a01 * s + a21 * c
      o[10] = d[2] * s + d[10] * c; // a02 * s + a22 * c
      o[11] = d[3] * s + d[11] * c; // a03 * s + a23 * c

      // row 3 (col 12,13,14,15) copy
      o[12]=d[12]; o[13]=d[13]; o[14]=d[14]; o[15]=d[15];

      return out;
    }

    /**
     * 
     */
    rotateZ(angle, out = new Mat4().setIdentity()) {
      let d = this.D;
      let o = out.D;
      let s = MathSin(angle);
      let c = MathCos(angle);

      // row 0 (col 0,1,2,3)
      o[0] = d[0] * c + d[4] * s; // a00 * c + a10 * s
      o[1] = d[1] * c + d[5] * s; // a01 * c + a11 * s
      o[2] = d[2] * c + d[6] * s; // a02 * c + a12 * s
      o[3] = d[3] * c + d[7] * s; // a03 * c + a13 * s

      // row 1 (col 4,5,6,7)
      o[4] = d[0] * -s + d[4] * c; // a00 * -s + a10 * c
      o[5] = d[1] * -s + d[5] * c; // a01 * -s + a11 * c
      o[6] = d[2] * -s + d[6] * c; // a02 * -s + a12 * c
      o[7] = d[3] * -s + d[7] * c; // a03 * -s + a13 * c

      // row 2 (col 8,9,10,11) copy
      o[8]=d[8]; o[9]=d[9]; o[10]=d[10]; o[11]=d[11];

      // row 3 (col 12,13,14,15) copy
      o[12]=d[12]; o[13]=d[13]; o[14]=d[14]; o[15]=d[15];

      return out;
    }

    /**
     * 
     */
    clone() {
        let cloned = new Mat4();
        cloned.D.set(this.D);
        return cloned;
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  descartesJS.norm3D = function(v) {
    if (!(v instanceof Vec4D)) {
      v = new Vec4D(v.x, v.y, v.z, v.w);
    }
    return v.norm3D();
  }

  descartesJS.normalize3D = function(v) {
    if (!(v instanceof Vec4D)) {
      v = new Vec4D(v.x, v.y, v.z, v.w);
    }
    return v.normalize3D().clone();
  }

  descartesJS.dotProduct3D = function(v1, v2) {
    if (!(v1 instanceof Vec4D)) {
      v1 = new Vec4D(v1.x, v1.y, v1.z, v1.w);
    }
    if (!(v2 instanceof Vec4D)) {
      v2 = new Vec4D(v2.x, v2.y, v2.z, v2.w);
    }

    return v1.dotProduct3D(v2);
  }

  descartesJS.crossProduct3D = function(v1, v2) {
    if (!(v1 instanceof Vec4D)) {
      v1 = new Vec4D(v1.x, v1.y, v1.z, v1.w);
    }
    if (!(v2 instanceof Vec4D)) {
      v2 = new Vec4D(v2.x, v2.y, v2.z, v2.w);
    }

    return v1.crossProduct3D(v2).clone();
  }

  descartesJS.scalarProd3D = function(v, s) {
    if (!(v instanceof Vec4D)) {
      v = new Vec4D(v.x, v.y, v.z, v.w);
    }
    return v.scalarProd3D(s).clone();
  }

  descartesJS.subtract3D = function(v1, v2) {
    if (!(v1 instanceof Vec4D)) {
      v1 = new Vec4D(v1.x, v1.y, v1.z, v1.w);
    }
    if (!(v2 instanceof Vec4D)) {
      v2 = new Vec4D(v2.x, v2.y, v2.z, v2.w);
    }

    return v1.subtract3D(v2).clone();
  }

  descartesJS.add3D = function(v1, v2) {
    if (!(v1 instanceof Vec4D)) {
      v1 = new Vec4D(v1.x, v1.y, v1.z, v1.w);
    }
    if (!(v2 instanceof Vec4D)) {
      v2 = new Vec4D(v2.x, v2.y, v2.z, v2.w);
    }

    return v1.add3D(v2).clone();
  }

  descartesJS.equals3D = function(p1, p2, epsilon) {
    if (!(p1 instanceof Vec4D)) {
      p1 = new Vec4D(p1.x, p1.y, p1.z, p1.w);
    }
    if (!(p2 instanceof Vec4D)) {
      p2 = new Vec4D(p2.x, p2.y, p2.z, p2.w);
    }

    return p1.equals3D(p2, epsilon);
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  descartesJS.Vec4D = Vec4D;
  descartesJS.Mat4 = Mat4;
  return descartesJS;
})(descartesJS || {});