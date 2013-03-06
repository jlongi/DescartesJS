/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathSin = Math.sin;
  var MathFloor = Math.floor;
  var MathRandom = Math.random;
  var MathRound = Math.round;
  var stringfromCharCode = String.fromCharCode;
  
  /**
   * 
   * @constructor 
   * @param {string} key la llave de encriptacion
   */
  descartesJS.Krypto = function(key){
    key = key || 0;
    this.key = key.toString();
  }

  /**
   * @param Number n 
   * @return String
   */
  descartesJS.Krypto.prototype.getKey = function(n) {
    var a1 = 1.0;
    var a2 = 1.4;
    var a3 = 0.6;
    var a4 = 2.2;
   
    var ll = new Array(256);
    for (var i=0; i<256; i++) {
      ll[i] = stringfromCharCode(this.alfanum( MathFloor( Math.abs(7.5*(MathSin(a1*i-n) + MathSin(a2*i+n) + MathSin(a3*i-n) + MathSin(a4*i+n))) ) ));
    }
    
    return ll.join("");
  }
  
  /**
   * @param String s es la cadena a codificar
   * @return String
   */
  descartesJS.Krypto.prototype.encode = function(s) {
    var n = MathFloor(31*MathRandom());
    
    this.key = this.getKey(n);

    var b = stringfromCharCode(this.alfanum(n));
    
    var encriptado = b + this.encripta(s)

    return encriptado;
  }
  
  /**
   * @param String s es la cadena a decodificar
   * @return String
   */
  descartesJS.Krypto.prototype.decode = function(s) {
    var n = this.numalfa( s.charCodeAt(0) );

    this.key = this.getKey(n);

    return this.desencripta(s.substring(1));
  }

  /**
   * @param String 
   * @return String
   */
  descartesJS.Krypto.prototype.encripta = function(OrigMeu) {
    return this.bytesToString( this.encriptaAux(this.stringToBytes(OrigMeu)));
  }
  
  /**
   * @param [Bytes]
   * @return String
   */
  descartesJS.Krypto.prototype.encriptaAux = function(OrigMeu) {
    if (OrigMeu == null) {
      return null;
    }
    
    if (this.key == null) {
      return null;
    }
    
    var encripMeu = new Array(3*OrigMeu.length);
    
    var x, y;
    for (var i=0, l=OrigMeu.length; i<l; i++) {
      x = MathFloor(OrigMeu[i]+128)*256 + MathRound(MathRandom()*255) + MathRound(MathRandom()*255)*256*256;
      y = MathFloor((x<<this.shift(i))/256);

      encripMeu[3*i] =   this.alfanum(y%32); 
      encripMeu[3*i+1] = this.alfanum((y/32)%32);
      encripMeu[3*i+2] = this.alfanum((y/1024)%32);
    }

    return encripMeu;
  }
    
  /**
   * @param String 
   * @return String
   */
  descartesJS.Krypto.prototype.desencripta = function(OrigMeu) {
    return this.bytesToString( this.desencriptaAux(this.stringToBytes(OrigMeu)));
  }
  
  /**
   * @param [Bytes]
   * @return String
   */
  descartesJS.Krypto.prototype.desencriptaAux = function(OrigMeu) {
    if (OrigMeu == null) {
      return null;
    }
    if (this.key == null) {
      return null;
    }

    var desencripMeu = new Array(OrigMeu.length/3);
    
    var x, y;
    var nx;
    for (var i=0, l=desencripMeu.length; i<l; i++) {
      y = this.numalfa(OrigMeu[3*i]) + this.numalfa(OrigMeu[3*i+1])*32 + this.numalfa(OrigMeu[3*i+2])*1024;
      x = MathFloor((y*256)>>this.shift(i));
      
      nx = (MathFloor(x/256)%256)-128;
      if (nx < 0) {
        nx = nx +256;
      }
      
      desencripMeu[i] = nx;
    }
    
    return desencripMeu;   
  }
  
  /**
   * @param Number <Integer>
   * return Number <Byte>
   */
  descartesJS.Krypto.prototype.alfanum = function(k) {
    k = MathFloor(k);
    if (k<10) {
      return 48 + k;
    } else {
      return 87 + k;
    }
  }
  
  /**
   * @param Number <Byte>
   * return Number <Integer>
   */
  descartesJS.Krypto.prototype.numalfa = function(b) {
    if (b<58) {
      return b-48;
    } else {
      return b-87;
    }
  }
  
  /**
   * @param String 
   * return [Bytes]
   */
  descartesJS.Krypto.prototype.stringToBytes = function(OrigMeu) {
    var b = new Array(OrigMeu.length);
    
    for (var i=0, l=OrigMeu.length; i<l; i++) {
      b[i] = OrigMeu.charCodeAt(i);
    }
    
    return b;
  }

  /**
   * @param [bytes]
   * return String 
   */
  descartesJS.Krypto.prototype.bytesToString = function(b) {
    for (var i=0, l=b.length; i<l; i++) {
      b[i] = stringfromCharCode(b[i]);
    }

    return b.join("");
  }
  
  /**
   * @param Number
   * return Number 
   */
  descartesJS.Krypto.prototype.shift = function(i) {
    var a = (this.key).charCodeAt(i%(this.key.length));
    var b = this.numalfa(a);
    var c = MathFloor((b/2)%8);
    if (c == 0) {
      c = 4;
    }
    return c;
  }

  /**
   * @param String s es la cadena a decodificar
   * return byte
   */
  descartesJS.Krypto.prototype.parseByte = function(n) {
    n = parseInt(n);
    n = (n < 0) ? 0 : n;
    n = (n > 255) ? 255 : n;
    
    return n;
  }
  
  return descartesJS;
})(descartesJS || {});
