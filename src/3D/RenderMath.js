/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un espacio de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la aplicacion de descartes
   */
  descartesJS.RenderMath = {};

  /**
   * Regresa la inversa de la raiz cuadrada
   */
  descartesJS.RenderMath.inverseSqrt = function(n) {
    return 1.0 / Math.sqrt(number);
  }
  
  /**
   * Vector bidimensional
   */
  descartesJS.Vector2D = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
  
  descartesJS.Vector2D.prototype.clone = function() {
    return new descartesJS.Vector2D(this.x,
                                    this.y
                                   );
  }
  
  descartesJS.Vector2D.prototype.add = function(v) {
    return new descartesJS.Vector2D(this.x + v.x,
                                    this.y + v.y
                                   );
  }

  descartesJS.Vector2D.prototype.substract = function(v) {
    return new descartesJS.Vector2D(this.x - v.x,
                                    this.y - v.y
                                   );
  }
  
  descartesJS.Vector2D.prototype.multiply = function(v) {
    return new descartesJS.Vector2D(this.x * v.x,
                                    this.y * v.y
                                   );
  }

  descartesJS.Vector2D.prototype.divide = function(v) {
    return new descartesJS.Vector2D(this.x / v.x,
                                    this.y / v.y
                                   );
  }
  
  descartesJS.Vector2D.prototype.scale = function(s) {
    return new descartesJS.Vector2D(this.x * s,
                                    this.y * s
                                   );
  }
  
  descartesJS.Vector2D.prototype.dist = function(v) {
    var x = v.x - this.x;
    var y = v.y - this.y;
    return Math.sqrt(x*x + y*y);
  }
  
  descartesJS.Vector2D.prototype.negate = function() {
    return new descartesJS.Vector2D(-this.x,
                                    -this.y
                                   );
  }
  
  descartesJS.Vector2D.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
    
  descartesJS.Vector2D.prototype.squaredLength = function() {
    return this.x * this.x + this.y * this.y;
  }

  descartesJS.Vector2D.prototype.normalize = function() {
    var len = this.squaredLength();
    
    if (len > 0) {
      len = Math.sqrt(len);
      return new descartesJS.Vector2D(this.x / len,
                                      this.y / len
                                     );
    }
    else {
      return new descartesJS.Vector2D(0,
                                      0
                                     );
    }
  }
  
  descartesJS.Vector2D.prototype.crossProduct = function(v) {
//     return new descartesJS.Vector2D(0,
//                                     0,
//                                     this.x * v.y - this.y * v.x
//                                    );
    return this.x * v.y - this.y * v.x;
  }
  
  descartesJS.Vector2D.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y;
  }
  
  descartesJS.Vector2D.prototype.direction = function(v) {
    var x = this.x - v.x;
    var y = this.y - v.y;
    var len = x * x + y * y;

    if (!len) {
      return new descartesJS.Vector2D(0, 0);
    }
    
    len = 1 / Math.sqrt(len);
    
    return new descartesJS.Vector2D(x * len,
                                    y * len
                                   );
  }
  
  descartesJS.Vector2D.prototype.lerp = function(v, lerp) {
    return new descartesJS.Vector2D(this.x + lerp * (v.x - this.x),
                                    this.y + lerp * (v.y - this.y)
                                   );
  }
  
  /**
   * Vector tridimensional
   */
  descartesJS.Vector3D = function(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  descartesJS.Vector3D.prototype.set = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    return this;
  }

  descartesJS.Vector3D.prototype.toVector4D = function() {
    return new descartesJS.Vector4D(this.x, this.y, this.z, 1);
  }
  
  descartesJS.Vector3D.prototype.copy = function() {
    return new descartesJS.Vector3D(this.x, 
                                    this.y, 
                                    this.z);
  }
  
  descartesJS.Vector3D.prototype.add = function(v) {
    return new descartesJS.Vector3D(this.x + v.x,
                                    this.y + v.y,
                                    this.z + v.z);
  }
  
  descartesJS.Vector3D.prototype.substract = function(v) {
    return new descartesJS.Vector3D(this.x - v.x,
                                    this.y - v.y,
                                    this.z - v.z);
  }
  
  descartesJS.Vector3D.prototype.multiply = function(v) {
    return new descartesJS.Vector3D(this.x * v.x, 
                                    this.y * v.y, 
                                    this.z * v.z);
  }
  
  descartesJS.Vector3D.prototype.negate = function() {
    return new descartesJS.Vector3D(-this.x,
                                    -this.y,
                                    -this.z);
  }
  
  descartesJS.Vector3D.prototype.scale = function(s) {
    return new descartesJS.Vector3D(this.x * s, 
                                    this.y * s, 
                                    this.z * s);
  }
  
  descartesJS.Vector3D.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  
  descartesJS.Vector3D.prototype.squaredLength = function() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  
  descartesJS.Vector3D.prototype.normalize = function() {
    var len = this.length();
    
    // la norma del vector es cero
    if (len == 0) {
      return new descartesJS.Vector3D(0, 0, 0);
    }
    // la norma es uno, ya estaba normalizado
    else if (len == 1) {
      return new descartesJS.Vector3D(this.x, 
                                      this.y, 
                                      this.z);
    }
    
    len = 1.0 / len;

    return new descartesJS.Vector3D(this.x * len, 
                                    this.y * len, 
                                    this.z * len);
  }
  
  descartesJS.Vector3D.prototype.crossProduct = function(v) {
    return new descartesJS.Vector3D(this.y * v.z - this.z * v.y, 
                                    this.z * v.x - this.x * v.z,
                                    this.x * v.y - this.y * v.x);
  }
  
  descartesJS.Vector3D.prototype.dotProduct = function(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;

  }
  
  //genera un vector unitario que apunta de un vector a otro
  descartesJS.Vector3D.prototype.direction = function(v) {
    var x = this.x - v.x;
    var y = this.y - v.y;
    var z = this.z - v.z;
    var len = Math.sqrt(x * x + y * y + z * z);

    // la norma del vector es cero
    if (len == 0) {
      return new descartesJS.Vector3D(0, 0, 0);
    }

    len = 1.0 / len;

    return new descartesJS.Vector3D(x * len, 
                                    y * len, 
                                    z * len);
  }
  
  // linear interpolation
  descartesJS.Vector3D.prototype.lerp = function(v, interpolant) {
    return new descartesJS.Vector3D(this.x + interpolant*(v.x - this.x), 
                                    this.y + interpolant*(v.y - this.y),
                                    this.z + interpolant*(v.z - this.z));
  }

  // distancia entre dos vectores
  descartesJS.Vector3D.prototype.distance = function(v) {
    var x = v.x - this.x;
    var y = v.y - this.y;
    var z = v.z - this.z;

    return Math.sqrt(x*x + y*y + z*z);
  }
  
  // proyecta el vector del espacio de la pantalla al espacio del objeto
  // viewport [x, y, width, height]
  descartesJS.Vector3D.prototype.unproject = function(view, proj, viewport) {
    var v = new descartesJS.Vector4D( (this.x - viewport.x) * 2.0 / viewport.width - 1.0, 
                                      (this.y - viewport.y) * 2.0 / viewport.height - 1.0, 
                                      2.0 * this.z - 1.0,
                                      v[3] = 1.0 
                                    );

    var m = proj.multiply(view);
    if (!m.inverse()) {
      return null;
    }
    
    v = m.multiplyVector4(v);
    if (v.w == 0.0) {
      return null;
    }
    
    return new descartesJS.Vector3D(v.x / v.w,
                                    v.y / v.w,
                                    v.z / v.w);
  }
  
  // regresa un quaternion entre dos vectores
  descartesJS.Vector3D.prototype.rotationTo = function(v) {
    var xUnitVec3 = new descartesJS.Vector3D(1, 0, 0);
    var yUnitVec3 = new descartesJS.Vector3D(0, 1, 0);
    var zUnitVec3 = new descartesJS.Vector3D(0, 0, 1);
    
    var d = this.dotProduct(v);
//     var axis = new descartesJS.Vector3D();
    var quaternion = new descartesJS.Quaternion();
    
    if (d >= 1.0) {
      quaternion.setIdentity();
    }
    else if (d < (0.000001 - 1.0)) {
      axis = xUnitVec3.crossProduct(this);
      if (axis.length() < 0.000001) {
        axis = yUnitVec3.crossProduct(this);
      }
      if (axis.length() < 0.000001) {
        axis =  zUnitVec3.crossProduct(this);
      }
      axis = axis.normalize();
      
      quaternion = Quaternion.fromAngleAxis(Math.PI, axis);
    }
    
    else {
      var s = Math.squrt((1.0 + d) * 2.0);
      var sInv = 1.0 / s;
      axis = this.crossProduct(v);
      quaternion.x = axis.x * sInv;
      quaternion.y = axis.y * sInv;
      quaternion.z = axis.z * sInv;
      quaternion.w = s * 0.5;
      quaternion = Quaternion.normalize();
    }
    
    if (quaternion.w > 1.0) {
      quaternion.w = 1.0;
    }
    else if (quaternion.w < -1.0) {
      quaternion.w = -1.0;
    }
    
    return quaternion;
  }
  
  descartesJS.Vector4D = function(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 0;
  }

  descartesJS.Vector4D.prototype.set = function(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  descartesJS.Vector4D.prototype.toVector3D = function() {
    var w = (this.w !== 0) ? 1/this.w : 0;
    return new descartesJS.Vector3D(this.x*w, this.y*w, this.z*w);
  }
  
  
  descartesJS.Vector4D.prototype.clone = function() {
    return new descartesJS.Vector4D(this.x, this.y, this.z, this.w);
  }
  
  descartesJS.Vector4D.prototype.add = function(v) {
    return new descartesJS.Vector4D(this.x + v.x,
                                    this.y + v.y,
                                    this.z + v.z,
                                    this.w + v.w
                                   );
  }
  
  descartesJS.Vector4D.prototype.substract = function(v) {
    return new descartesJS.Vector4D(this.x - v.x,
                                    this.y - v.y,
                                    this.z - v.z,
                                    this.w - v.w
                                   );
  }
  
  descartesJS.Vector4D.prototype.multiply = function(v) {
    return new descartesJS.Vector4D(this.x * v.x,
                                    this.y * v.y,
                                    this.z * v.z,
                                    this.w * v.w
                                   );
  }
  
  descartesJS.Vector4D.prototype.divide = function(v) {
    return new descartesJS.Vector4D(this.x / v.x,
                                    this.y / v.y,
                                    this.z / v.z,
                                    this.w / v.w
                                   );
  }
  
  descartesJS.Vector4D.prototype.scale = function(s) {
    return new descartesJS.Vector4D(this.x * s,
                                    this.y * s,
                                    this.z * s,
                                    this.w * s
                                   );
  }
  
  descartesJS.Vector4D.prototype.negate = function() {
    return new descartesJS.Vector4D(-this.x,
                                    -this.y,
                                    -this.z,
                                    -this.w
                                   );
  }
  
  descartesJS.Vector4D.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  
  descartesJS.Vector4D.prototype.squaredLength = function() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  
  descartesJS.Vector4D.prototype.lerp = function(v, lerp) {
    return new descartesJS.Vector4D(this.x + lerp * (v.x - this.x),
                                    this.y + lerp * (v.y - this.y),
                                    this.z + lerp * (v.z - this.z),
                                    this.w + lerp * (v.w - this.w)
                                   );
  }
  
  descartesJS.Matrix2x2 = function( a00, a01, 
                                    a10, a11
                                  ) {
    this.a00 = a00 || 0;
    this.a01 = a01 || 0;
    this.a10 = a10 || 0;
    this.a11 = a11 || 0;
  }
  
  descartesJS.Matrix2x2.prototype.clone = function() {
    return new descartesJS.Matrix2x2(this.a00, this.a01,
                                     this.a10, this.a11
                                    );
  }

  descartesJS.Matrix2x2.prototype.setIdentity = function() {
    this.a00 = 1;
    this.a01 = 0;
    this.a10 = 0;
    this.a11 = 1;

    return this;
  }

  descartesJS.Matrix2x2.prototype.transpose = function() {
    return new descartesJS.Matrix2x2(this.a00, this.a10,
                                     this.a01, this.a11
                                    );
  }
  
  descartesJS.Matrix2x2.prototype.determinant = function() {
    return this.a00 * this.a11 - this.a10 * this.a01;
  }

  descartesJS.Matrix2x2.prototype.inverse = function() {
    var det = this.determinant();
    
    if (!det) {
      return null;
    }
    
    det = 1 / det;
    
    return new descartesJS.Matrix2x2( this.a11 * det, -this.a10 * det,
                                     -this.a01 * det,  this.a00 * det
                                    );
  }
  
  descartesJS.Matrix2x2.prototype.multiply = function(m) {
    return new descartesJS.Matrix2x2(this.a00 * m.a00 + this.a01 * m.a10,
                                     this.a00 * m.a01 + this.a01 * m.a11,
                                     this.a10 * m.a00 + this.a11 * m.a10,
                                     this.a10 * m.a01 + this.a11 * m.a11
                                    );
  }
  
  descartesJS.Matrix2x2.prototype.rotate = function(angle) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    
    return new descartesJS.Matrix2x2(this.a00 *  c + this.a01 * s,
                                     this.a00 * -s + this.a01 * c,
                                     this.a10 *  c + this.a11 * s,
                                     this.a10 * -s + this.a11 * c
                                    );
  }
    
  descartesJS.Matrix2x2.prototype.multiplyVector2 = function(v) {
    return new descartesJS.Vector2D(v.x * this.a00 + v.y * this.a01,
                                    v.x * this.a10 + v.y * this.a11
                                   );
  }
  
  descartesJS.Matrix2x2.prototype.scale = function(v) {
    return new descartesJS.Matrix2x2(this.a00 * v.x, this.a01 * v.y,
                                     this.a10 * v.x, this.a11 * v.y
                                    );
  }    

  descartesJS.Matrix3x3 = function( a00, a01, a02, 
                                    a10, a11, a12,
                                    a20, a21, a22
                                   ) {
    this.a00 = a00 || 0;
    this.a01 = a01 || 0;
    this.a02 = a02 || 0;
    this.a10 = a10 || 0;
    this.a11 = a11 || 0;
    this.a12 = a12 || 0;
    this.a20 = a20 || 0;
    this.a21 = a21 || 0;
    this.a22 = a22 || 0;
  }
  
  descartesJS.Matrix3x3.prototype.copy = function() {
    return new descartesJS.Matrix3x3(this.a00, this.a01, this.a02, 
                                     this.a10, this.a11, this.a12, 
                                     this.a20, this.a21, this.a22
                                    ); 
  }

  descartesJS.Matrix3x3.prototype.determinant = function() {
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    
    return a00 * ( a22 * a11 - a12 * a21) + 
           a01 * (-a22 * a10 + a12 * a20) + 
           a02 * ( a21 * a10 - a11 * a20);
  }

  descartesJS.Matrix3x3.prototype.inverse = function() {
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;

    var b01 =  a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 =  a21 * a10 - a11 * a20;
    
    var d = a00 * b01 + a01 * b11 + a02 * b21;
    
    if (!d) { 
      return null; 
    }

    var invD = 1 / d;
    
    return new descartesJS.Matrix3x3( b01 * invD,  (-a22 * a01 + a02 * a21) * invD,  ( a12 * a01 - a02 * a11) * invD,
                                      b11 * invD,  ( a22 * a00 - a02 * a20) * invD,  (-a12 * a00 + a02 * a10) * invD,
                                      b21 * invD,  (-a21 * a00 + a01 * a20) * invD,  ( a11 * a00 - a01 * a10) * invD
                                    );
  }
  
  descartesJS.Matrix3x3.prototype.multply = function(m) {
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    
    var b00 = m.a00;
    var b01 = m.a01;
    var b02 = m.a02;
    var b10 = m.a10;
    var b11 = m.a11;
    var b12 = m.a12;
    var b20 = m.a20;
    var b21 = m.a21;
    var b22 = m.a22;
    
    return new descartesJS.Matrix3x3( b00 * a00 + b01 * a10 + b02 * a20, b00 * a01 + b01 * a11 + b02 * a21, b00 * a02 + b01 * a12 + b02 * a22,
                                      b10 * a00 + b11 * a10 + b12 * a20, b10 * a01 + b11 * a11 + b12 * a21, b10 * a02 + b11 * a12 + b12 * a22,
                                      b20 * a00 + b21 * a10 + b22 * a20, b20 * a01 + b21 * a11 + b22 * a21, b20 * a02 + b21 * a12 + b22 * a22
                                    );
  }
  
  descartesJS.Matrix3x3.prototype.multiplyVector2 = function(v) {
    return new descartesJS.Vector2D(v.x * this.a00 + v.y * this.a10 + this.a20,
                                    v.x * this.a01 + v.y * this.a11 + this.a21);
  }
  
  descartesJS.Matrix3x3.prototype.multiplyVector3 = function(v) {
    return new descartesJS.Vector3D(v.x * this.a00 + v.y * this.a10 + v.z * this.a20,
                                    v.x * this.a01 + v.y * this.a11 + v.z * this.a21,
                                    v.x * this.a02 + v.y * this.a12 + v.z * this.a22
                                   );
  }
  
  descartesJS.Matrix3x3.prototype.setIdentity = function() {
    this.a00 = 1;
    this.a01 = 0;
    this.a02 = 0;
    
    this.a10 = 0;
    this.a11 = 1;
    this.a12 = 0;
    
    this.a20 = 0;
    this.a21 = 0;
    this.a22 = 1;
    
    return this;
  }
  
  descartesJS.Matrix3x3.prototype.transpose = function() {
    return new descartesJS.Matrix3x3(this.a00, this.a10, this.a20,
                                     this.a01, this.a11, this.a21,
                                     this.a02, this.a12, this.a22
                                    );
  }

  descartesJS.Matrix3x3.prototype.toMatrix4x4 = function() {
    return new descartesJS.Matrix4x4(this.a00, this.a01, this.a02, 0,
                                     this.a10, this.a11, this.a12, 0,
                                     this.a20, this.a21, this.a22, 0,
                                     0,        0,        0,        1
                                     );
  }
  
  descartesJS.Matrix4x4 = function( a00, a01, a02, a03,
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
  
  descartesJS.Matrix4x4.prototype.copy = function() {
    return new descartesJS.Matrix4x4(this.a00, this.a01, this.a02, this.a03,
                                     this.a10, this.a11, this.a12, this.a13,
                                     this.a20, this.a21, this.a22, this.a23,
                                     this.a30, this.a31, this.a32, this.a33
                                    ); 
  }

  descartesJS.Matrix4x4.prototype.setIdentity = function() {
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
    
  descartesJS.Matrix4x4.prototype.transpose = function() {
    return new descartesJS.Matrix3x3(this.a00, this.a10, this.a20, this.a30,
                                     this.a01, this.a11, this.a21, this.a31,
                                     this.a02, this.a12, this.a22, this.a32,
                                     this.a03, this.a13, this.a23, this.a33
                                    );
  }

  descartesJS.Matrix4x4.prototype.determinant = function() {
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a03 = this.a03;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a13 = this.a13;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    var a23 = this.a23;
    var a30 = this.a30;
    var a31 = this.a31;
    var a32 = this.a32;
    var a33 = this.a33;
    
    return a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 +
           a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 +
           a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 +
           a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 +
           a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 +
           a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33;
  }

  descartesJS.Matrix4x4.prototype.inverse = function() {
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a03 = this.a03;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a13 = this.a13;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    var a23 = this.a23;
    var a30 = this.a30;
    var a31 = this.a31;
    var a32 = this.a32;
    var a33 = this.a33;

    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    
    var d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
    
    if (!d) { 
      return null; 
    }

    var invD = 1 / d;
    
    return new descartesJS.Matrix4x4((a11 * b11 - a12 * b10 + a13 * b09) * invD,  (-a01 * b11 + a02 * b10 - a03 * b09) * invD, (a31 * b05 - a32 * b04 + a33 * b03) * invD,  (-a21 * b05 + a22 * b04 - a23 * b03) * invD, 
                                     (-a10 * b11 + a12 * b08 - a13 * b07) * invD, (a00 * b11 - a02 * b08 + a03 * b07) * invD,  (-a30 * b05 + a32 * b02 - a33 * b01) * invD, (a20 * b05 - a22 * b02 + a23 * b01) * invD,
                                     (a10 * b10 - a11 * b08 + a13 * b06) * invD,  (-a00 * b10 + a01 * b08 - a03 * b06) * invD, (a30 * b04 - a31 * b02 + a33 * b00) * invD,  (-a20 * b04 + a21 * b02 - a23 * b00) * invD, 
                                     (-a10 * b09 + a11 * b07 - a12 * b06) * invD, (a00 * b09 - a01 * b07 + a02 * b06) * invD,  (-a30 * b03 + a31 * b01 - a32 * b00) * invD, (a20 * b03 - a21 * b01 + a22 * b00) * invD
                                    );
  }

  descartesJS.Matrix4x4.prototype.toRotationMat = function() {
    return new descartesJS.Matrix4x4(this.a00, this.a01, this.a02, this.a03,
                                     this.a10, this.a11, this.a12, this.a13,
                                     this.a20, this.a21, this.a22, this.a23,
                                     0,        0,        0,        1);
  }
  
  descartesJS.Matrix4x4.prototype.toMatrix3x3 = function() {
    return new descartesJS.Matrix4x4(this.a00, this.a01, this.a02,
                                     this.a10, this.a11, this.a12,
                                     this.a20, this.a21, this.a22)    
  }

  descartesJS.Matrix4x4.prototype.toInverseMat3 = function() {
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;

    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;

    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;

    var b01 = a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 = a21 * a10 - a11 * a20;

    var d = a00 * b01 + a01 * b11 + a02 * b21;

    if (!d) { 
      return null; 
    }
    
    var invD = 1 / d;

    return new descartesJS.Matrix3x3(b01 * id, (-a22 * a01 + a02 * a21) * id, ( a12 * a01 - a02 * a11) * id,
                                     b11 * id, ( a22 * a00 - a02 * a20) * id, (-a12 * a00 + a02 * a10) * id,
                                     b21 * id, (-a21 * a00 + a01 * a20) * id, ( a11 * a00 - a01 * a10) * id
                                    );
  }

  descartesJS.Matrix4x4.prototype.multiply = function(m) {
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a03 = this.a03;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a13 = this.a13;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    var a23 = this.a23;
    var a30 = this.a30;
    var a31 = this.a31;
    var a32 = this.a32;
    var a33 = this.a33;
    
    var b00 = m.a00;
    var b01 = m.a01;
    var b02 = m.a02;
    var b03 = m.a03;
    var b10 = m.a10;
    var b11 = m.a11;
    var b12 = m.a12;
    var b13 = m.a13;
    var b20 = m.a20;
    var b21 = m.a21;
    var b22 = m.a22;
    var b23 = m.a23;
    var b30 = m.a30;
    var b31 = m.a31;
    var b32 = m.a32;
    var b33 = m.a33;
    
    return new descartesJS.Matrix4x4(b00*a00 + b01*a10 + b02*a20 + b03*a30, b00*a01 + b01*a11 + b02*a21 + b03*a31, b00*a02 + b01*a12 + b02*a22 + b03*a32, b00*a03 + b01*a13 + b02*a23 + b03*a33,
                                     b10*a00 + b11*a10 + b12*a20 + b13*a30, b10*a01 + b11*a11 + b12*a21 + b13*a31, b10*a02 + b11*a12 + b12*a22 + b13*a32, b10*a03 + b11*a13 + b12*a23 + b13*a33,
                                     b20*a00 + b21*a10 + b22*a20 + b23*a30, b20*a01 + b21*a11 + b22*a21 + b23*a31, b20*a02 + b21*a12 + b22*a22 + b23*a32, b20*a03 + b21*a13 + b22*a23 + b23*a33,
                                     b30*a00 + b31*a10 + b32*a20 + b33*a30, b30*a01 + b31*a11 + b32*a21 + b33*a31, b30*a02 + b31*a12 + b32*a22 + b33*a32, b30*a03 + b31*a13 + b32*a23 + b33*a33
                                    );
  }
  
  descartesJS.Matrix4x4.prototype.multiplyVector3 = function(v) {
    return new descartesJS.Vector3D(v.x * this.a00 + v.y * this.a10 + v.z * this.a20 + this.a30,
                                    v.x * this.a01 + v.y * this.a11 + v.z * this.a21 + this.a31,
                                    v.x * this.a02 + v.y * this.a12 + v.z * this.a22 + this.a32
                                   );
  }
  
  descartesJS.Matrix4x4.prototype.multiplyVector4 = function(v) {
    return new descartesJS.Vector4D(v.x * this.a00 + v.y * this.a10 + v.z * this.a20 + v.w * this.a30,
                                    v.x * this.a01 + v.y * this.a11 + v.z * this.a21 + v.w * this.a31,
                                    v.x * this.a02 + v.y * this.a12 + v.z * this.a22 + v.w * this.a32,
                                    v.x * this.a03 + v.y * this.a13 + v.z * this.a23 + v.w * this.a33
                                   );
  }

  descartesJS.Matrix4x4.prototype.translate = function(v) {
    return new descartesJS.Matrix4x4(this.a00, this.a01, this.a02, this.a03,
                                     this.a10, this.a11, this.a12, this.a13,
                                     this.a20, this.a21, this.a22, this.a23,
                                     this.a00 * v.x + this.a10 * v.y + this.a20 * v.z + this.a30, this.a01 * v.x + this.a11 * v.y + this.a21 * v.z + this.a31, this.a02 * v.x + this.a12 * v.y + this.a22 * v.z + this.a32, this.a03 * v.x + this.a13 * v.y + this.a23 * v.z + this.a33
                                    );
  }
    
  descartesJS.Matrix4x4.prototype.scale = function(v) {
    return new descartesJS.Matrix4x4(this.a00 * v.x, this.a01 * v.x, this.a02 * v.x, this.a03 * v.x,
                                     this.a10 * v.y, this.a11 * v.y, this.a12 * v.y, this.a13 * v.y,
                                     this.a20 * v.z, this.a21 * v.z, this.a22 * v.z, this.a23 * v.z,
                                     this.a30, this.a31, this.a32, this.a33
                                    );
  }

  descartesJS.Matrix4x4.prototype.rotate = function(angle, axis) {
    var len = Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z);
    
    if (!len) {
      return null;
    }
    
    if (len !== 1) {
      len = 1 / len;
      axis.x *= len;
      axis.y *= len;
      axis.z *= len;
    }
    
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    var t = 1 - c;

    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a03 = this.a03;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a13 = this.a13;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    var a23 = this.a23;
    
    var b00 = axis.x * axis.x * t + c; 
    var b01 = axis.y * axis.x * t + axis.z * s;
    var b02 = axis.z * axis.x * t - axis.y * s;
    var b10 = axis.x * axis.y * t - axis.z * s;
    var b11 = axis.y * axis.y * t + c;
    var b12 = axis.z * axis.y * t + axis.x * s;
    var b20 = axis.x * axis.z * t + axis.y * s;
    var b21 = axis.y * axis.z * t - axis.x * s;
    var b22 = axis.z * axis.z * t + c;

    return new descartesJS.Matrix4x4(a00 * b00 + a10 * b01 + a20 * b02,  a01 * b00 + a11 * b01 + a21 * b02,  a02 * b00 + a12 * b01 + a22 * b02,  a03 * b00 + a13 * b01 + a23 * b02,
                                     a00 * b10 + a10 * b11 + a20 * b12,  a01 * b10 + a11 * b11 + a21 * b12,  a02 * b10 + a12 * b11 + a22 * b12,  a03 * b10 + a13 * b11 + a23 * b12,
                                     a00 * b20 + a10 * b21 + a20 * b22,  a01 * b20 + a11 * b21 + a21 * b22,  a02 * b20 + a12 * b21 + a22 * b22,  a03 * b20 + a13 * b21 + a23 * b22,
                                     this.a30, this.a31, this.a32, this.a33
                                    );
  }

  descartesJS.Matrix4x4.prototype.rotateX = function(angle) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a13 = this.a13;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    var a23 = this.a23;
    
    return new descartesJS.Matrix4x4(this.a00, this.a01, this.a02, this.a03,
                                     a10 *  c + a20 * s, a11 *  c + a21 * s, a12 *  c + a22 * s, a13 *  c + a23 * s,
                                     a10 * -s + a20 * c, a11 * -s + a21 * c, a12 * -s + a22 * c, a13 * -s + a23 * c,
                                     this.a30, this.a31, this.a32, this.a33
                                    );
  }
  
  descartesJS.Matrix4x4.prototype.rotateY = function(angle) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a03 = this.a03;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    var a23 = this.a23;
    
    return new descartesJS.Matrix4x4(a00 * c + a20 * -s, a01 * c + a21 * -s, a02 * c + a22 * -s, a03 * c + a23 * -s,
                                     this.a10, this.a11, this.a12, this.a13, 
                                     a00 * s + a20 * c, a01 * s + a21 * c, a02 * s + a22 * c, a03 * s + a23 * c,
                                     this.a30, this.a31, this.a32, this.a33
                                    );
  }

  descartesJS.Matrix4x4.prototype.rotateZ = function(angle) {  
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a03 = this.a03;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a13 = this.a13;
    
    return new descartesJS.Matrix4x4(a00 *  c + a10 * s, a01 *  c + a11 * s, a02 *  c + a12 * s, a03 *  c + a13 * s,
                                     a00 * -s + a10 * c, a01 * -s + a11 * c, a02 * -s + a12 * c, a03 * -s + a13 * c,
                                     this.a20, this.a21, this.a22, this.a23,
                                     this.a30, this.a31, this.a32, this.a33
                                    );
  }
  
  descartesJS.Matrix4x4.prototype.frustum = function(left, right, bottom, top, near, far) {
    var rl = (right - left);
    var tb = (top - bottom);
    var fn = (far - near);
    
    return new descartesJS.Matrix4x4((near * 2) / rl, 0, 0, 0,
                                     0, (near * 2) / tb, 0, 0,
                                     (right + left) / rl, (top + bottom) / tb, -(far + near) / fn, -1,
                                     0, 0, -(far * near * 2) / fn, 0
                                    );
  }
  
  descartesJS.Matrix4x4.prototype.perspective = function(fovy, aspect, near, far) {
    var top = near * Math.tan(fovy * Math.PI / 360.0);
    var right = top * aspect;
    
    return this.frustum(-right, right, -top, top, near, far);
  }
  
  descartesJS.Matrix4x4.prototype.ortho = function(left, right, bottom, top, near, far) {
    var rl = (right - left);
    var tb = (top - bottom);
    var fn = (far - near);
    
    return new descartesJS.Matrix4x4(2 / rl, 0, 0, 0,
                                     0, 2 / tb, 0, 0,
                                     0, 0, -2 / fn, 0,
                                     -(left + right) / rl, -(top + bottom) / tb, -(far + near) / fn, 1
                                    );
  }
  
  descartesJS.Matrix4x4.prototype.lookAt = function(eye, center, up) {
    if ((eye.x === center.x) && (eye.y === center.y) && (eye.z === center.z)) {
      return (new descartesJS.Matrix4x4()).setIdentity();
    }
    
    var z0 = eye.x - center.x;
    var z1 = eye.y - center.y;
    var z2 = eye.z - center.z;
    
    var len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    var x0 = up.y * z2 - up.z * z1;
    var x1 = up.z * z0 - up.x * z2;
    var x2 = up.x * z1 - up.y * z0;        
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    var y0 = z1 * x2 - z2 * x1;
    var y1 = z2 * x0 - z0 * x2;
    var y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }
    
    return new descartesJS.Matrix4x4(x0, y0, z0, 0,
                                     x1, y1, z1, 0,
                                     x2, y2, z2, 0,
                                     -(x0 * eye.x + x1 * eye.y + x2 * eye.z), -(y0 * eye.x + y1 * eye.y + y2 * eye.z), -(z0 * eye.x + z1 * eye.y + z2 * eye.z), 1
                                    );
  }
  
  descartesJS.Matrix4x4.prototype.fromRotationTranslation = function(v) {
    var x2 = 2 * this.x;
    var y2 = 2 * this.y;
    var z2 = 2 * this.z;
    
    var xx = this.x * x2;
    var xy = this.x * y2;
    var xz = this.x * z2;
    var yy = this.y * y2;
    var yz = this.y * z2;
    var zz = this.z * z2;
    var wx = this.w * x2;
    var wy = this.w * y2;
    var wz = this.w * z2;
    
    return new descartesJS.Matrix4x4(1 - (yy + zz), xy + wz, xz - wy, 0,
                                     xy - wz, 1 - (xx + zz), yz + wx, 0,
                                     xz + wy, yz - wx, 1 - (xx + yy), 0,
                                     v.x, v.y, v.z, 1
                                    );
  }
    
  descartesJS.Quaternion = function(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 0;
  }
  
  descartesJS.Quaternion.prototype.clone = function() {
   return new descartesJS.Quaternion(this.x, this.y, this.z, this.w); 
  }
  
  descartesJS.Quaternion.prototype.setIdentity = function() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 1;
    
    return this;
  }
  
  descartesJS.Quaternion.prototype.calculateW = function() {
    return new descartesJS.Quaternion(this.x, 
                                      this.y, 
                                      this.z, 
                                      -Math.sqrt(Math.abs(1.0 - this.x * this.x - this.y * this.y - this.z * this.z))
                                      );
  }
  
  descartesJS.Quaternion.prototype.dot = function(q) {
    return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
  }
    
  descartesJS.Quaternion.prototype.inverse = function() {
    var dot = this.dot(this);
    var invDot = 0;
    
    if (dot != 0) {
      invDot = 1.0/dot;
    }
    
    return new descartesJS.Quaternion(-this.x * invDot,
                                      -this.y * invDot,
                                      -this.z * invDot,
                                       this.w * invDot
                                     );
  }
  
  descartesJS.Quaternion.prototype.conjugate = function() {
    return new descartesJS.Quaternion(-this.x,
                                      -this.y,
                                      -this.z,
                                       this.w
                                     );
  }
  
  descartesJS.Quaternion.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  
  descartesJS.Quaternion.prototype.normalize = function(quat, dest) {
    var len = this.length();
    
    if (len === 0) {
      return new descartesJS.Quaternion();
    }
    
    len = 1 / len;
    
    return new descartesJS.Quaternion(this.x * len,
                                      this.y * len,
                                      this.z * len,
                                      this.w * len
                                     );
  }
  
  descartesJS.Quaternion.prototype.add = function(q) {
    return new descartesJS.Quaternion(this.x + q.x,
                                      this.y + q.y,
                                      this.z + q.z,
                                      this.w + q.w
                                     );
  }

  descartesJS.Quaternion.prototype.multiply = function(q) {
    return new descartesJS.Quaternion(this.x * q.w + this.w * q.x + this.y * q.z - this.z * q.y,
                                      this.y * q.w + this.w * q.y + this.z * q.x - this.x * q.z,
                                      this.z * q.w + this.w * q.z + this.x * q.y - this.y * q.x,
                                      this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z
                                     );
  }

  descartesJS.Quaternion.prototype.multiplyVector3 = function(v) {
    var ix =  this.w * v.x + this.y * v.z - this.z * v.y;
    var iy =  this.w * v.y + this.z * v.x - this.x * v.z;
    var iz =  this.w * v.z + this.x * v.y - this.y * v.x;
    var iw = -this.x * v.x - this.y * v.y - this.z * v.z;
 
    return new descartesJS.Vector3D(ix * this.w + iw * -this.x + iy * -this.z - iz * -this.y,
                                    iy * this.w + iw * -this.y + iz * -this.x - ix * -this.z,
                                    iz * this.w + iw * -this.z + ix * -this.y - iy * -this.x
                                   );
  }
  
  descartesJS.Quaternion.prototype.scale = function(s) {
    return new descartesJS.Quaternion(this.x * s,
                                      this.y * s,
                                      this.z * s,
                                      this.w * s
                                     );
  }

  descartesJS.Quaternion.prototype.toMatrix3x3 = function() {
    var x2 = this.x + this.x;
    var y2 = this.y + this.y;
    var z2 = this.z + this.z;
    
    var xx = this.x * x2;
    var xy = this.x * y2;
    var xz = this.x * z2;
    var yy = this.y * y2;
    var yz = this.y * z2;
    var zz = this.z * z2;
    var wx = this.w * x2;
    var wy = this.w * y2;
    var wz = this.w * z2;
    
    return new descartesJS.Matrix3x3(1 - (yy + zz), xy + wz, xz - wy,
                                     xy - wz, 1 - (xx + zz), yz + wx,
                                     xz + wy, yz - wx, 1 - (xx + yy)
                                    );
  }

  descartesJS.Quaternion.prototype.toMat4 = function() {
    var x2 = this.x + this.x;
    var y2 = this.y + this.y;
    var z2 = this.z + this.z;
    
    var xx = this.x * x2;
    var xy = this.x * y2;
    var xz = this.x * z2;
    var yy = this.y * y2;
    var yz = this.y * z2;
    var zz = this.z * z2;
    var wx = this.w * x2;
    var wy = this.w * y2;
    var wz = this.w * z2;
    
    return new descartesJS.Matrix4x4(1 - (yy + zz), xy + wz, xz - wy, 0,
                                     xy - wz, 1 - (xx + zz), yz + wx, 0,
                                     xz + wy, yz - wx, 1 - (xx + yy), 0,
                                     0, 0, 0, 1
                                    );
  }
  
  descartesJS.Quaternion.prototype.slerp = function(q, slerp) {
    var cosHalfTheta = this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
    
    if (Math.abs(cosHalfTheta) >= 1) {
      return new descartesJS.Quaternion(this.x,
                                        this.y,
                                        this.z,
                                        this.w
                                       );
    }
    
    var halfTheta = Math.acos(cosHalfTheta);
    var sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
    
    if (Math.abs(sinHalfTheta) < 0.001) {
      return new descartesJS.Quaternion(this.x * 0.5 + q.x * 0.5,
                                        this.y * 0.5 + q.y * 0.5,
                                        this.z * 0.5 + q.z * 0.5,
                                        this.w * 0.5 + q.w * 0.5
                                       );
    }
    
    var ratioA = Math.sin((1 - slerp) * halfTheta) / sinHalfTheta;
    var ratioB = Math.sin(slerp * halfTheta) / sinHalfTheta;
    
    return new descartesJS.Quaternion(this.x * ratioA + q.x * ratioB,
                                      this.y * ratioA + q.y * ratioB,
                                      this.z * ratioA + q.z * ratioB,
                                      this.w * ratioA + q.w * ratioB
                                     );
  }

  // matriz de 3x3
  descartesJS.Quaternion.prototype.fromRotationMatrix = function(m) {
    var quaternion = new descartesJS.Quaternion();
    fTrace = m.a00 + m.a11 + m.a22;
    var fRoot;
    
    if ( fTrace > 0 ) {
      fRoot = Math.sqrt(fTrace + 1);
      quaternion.w = .5 * fRoot;
      fRoot = .5 / fRoot;
      quaternion.x = (m.a21 - m.a12) * fRoot;
      quaternion.y = (m.a02 - m.a20) * fRoot;
      quaternion.z = (m.a10 - m.a01) * fRoot;
    }
    else {
//       var s_iNext = this.fromRotationMatrix.s_iNext = this.fromRotationMatrix.s_iNext || [1,2,0];
      var s_iNext = [1,2,0];
      var i = 0;
      var mat = [m.a00, m.a01, m.a02, m.a10, m.a11, m.a12, m.a20, m.a21, m.a22];

      if (mat[4] > mat[0]) {
        i = 1;
      }
      if (mat[8] > mat[i*3+i]) {
        i = 2;
      }
      var j = s_iNext[i];
      var k = s_iNext[j];

      fRoot = Math.sqrt(mat[i*3+i]-mat[j*3+j]-mat[k*3+k] + 1.0);

      if (i == 0) {
        quaternion.x = 0.5 * fRoot;
      }
      else if (i == 1) {
        quaternion.y = 0.5 * fRoot;
      }
      else {
        quaternion.z = 0.5 * fRoot;
      }
      
      fRoot = 0.5 / fRoot;
      
      quaternion.w = (mat[k*3+j] - mat[j*3+k]) * fRoot;

      if (j == 0) {
        quaternion.x = (mat[j*3+i] + mat[i*3+j]) * fRoot;
      }
      else if (j == 1) {
        quaternion.y = (mat[j*3+i] + mat[i*3+j]) * fRoot;
      }
      else {
        quaternion.z = (mat[j*3+i] + mat[i*3+j]) * fRoot;
      }
      
      if (j == 0) {
        quaternion.x = (mat[k*3+i] + mat[i*3+k]) * fRoot;
      }
      else if (j == 1) {
        quaternion.y = (mat[k*3+i] + mat[i*3+k]) * fRoot;
      }
      else {
        quaternion.z = (mat[k*3+i] + mat[i*3+k]) * fRoot;
      }
    }
    
    return quaternion;
  }
  
  descartesJS.Quaternion.prototype.setIdentity = function() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 1;
    return this;
  }
  
  descartesJS.Quaternion.prototype.fromAngleAxis = function(angle, axis) {
    var half = angle * 0.5;
    var s = Math.sin(half);
    
    return new descartesJS.Quaternion(Math.cos(half),
                                      s * axis.x,
                                      s * axis.y,
                                      s * axis.z
                                     );
  }

  descartesJS.Quaternion.prototype.toAngleAxis = function() {
    var sqrlen = this.x * this.x + this.y * this.y + this.z * this.z;
    var vector = new descartesJS.Vector4D();
    
    if (sqrlen > 0) {
      vector.w = 2 * Math.acos(this.w);
      var invlen = descartesJS.RenderMath.inverseSqrt(sqrlen);
      vector.x = this.x * invlen;
      vector.y = this.y * invlen;
      vector.z = this.z * invlen;
    }
    else {
      vector.x = 1;
      vector.y = 0;
      vector.z = 0;
      vector.w = 0;
    }
    
    return vector;
  }
  
  
  descartesJS.Matrix4x4.prototype.toArray = function() {
    return [this.a00, this.a01, this.a02, this.a03, 
            this.a10, this.a11, this.a12, this.a13,
            this.a20, this.a21, this.a22, this.a23,
            this.a30, this.a31, this.a32, this.a33
           ];
  }

  return descartesJS;
})(descartesJS || {});