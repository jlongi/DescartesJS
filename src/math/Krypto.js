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
  var MathAbs = Math.abs;
  var stringfromCharCode = String.fromCharCode;
  
  var a1 = 1.0;
  var a2 = 1.4;
  var a3 = 0.6;
  var a4 = 2.2;

  var ll;

  var n;
  var a;
  var b;
  var c;

  var encripMeu;
  var desencripMeu;
  var nx;
  var x;
  var y;

  /**
   * Descartes krypto
   * @constructor 
   * @param {String} key the key of encryptation
   */
  descartesJS.Krypto = function(key = 0){
    this.key = key.toString();
  }

  /**
   * @param {Number} n
   * @return {String}
   */
  descartesJS.Krypto.prototype.getKey = function(n) {
    ll = [];
    for (var i=0; i<256; i++) {
      ll[i] = stringfromCharCode(this.alfanum( MathFloor( MathAbs(7.5*(MathSin(a1*i-n) + MathSin(a2*i+n) + MathSin(a3*i-n) + MathSin(a4*i+n))) ) ));
    }
    
    return ll.join("");
  }
  
  /**
   * @param {String} s the string to encode
   * @return {String}
   */
  descartesJS.Krypto.prototype.encode = function(s) {
    n = MathFloor(31*MathRandom());
    this.key = this.getKey(n);
    
    return stringfromCharCode(this.alfanum(n)) + this.encripta(s);
  }
  
  /**
   * @param {String} s the string to decode
   * @return {String}
   */
  descartesJS.Krypto.prototype.decode = function(s) {
    n = this.numalfa( s.charCodeAt(0) );
    this.key = this.getKey(n);

    return this.desencripta(s.substring(1));
  }

  /**
   * @param {String} OrigMeu
   * @return {String}
   */
  descartesJS.Krypto.prototype.encripta = function(OrigMeu) {
    return this.bytesToString( this.encriptaAux(this.stringToBytes(OrigMeu)));
  }
  
  /**
   * @param {Array<Bytes>} OrigMeu
   * @return {String}
   */
  descartesJS.Krypto.prototype.encriptaAux = function(OrigMeu) {
    if ((OrigMeu == null) || (this.key == null)) {
      return null;
    }
    
    encripMeu = new Array(3*OrigMeu.length);
    
    for (var i=0, l=OrigMeu.length; i<l; i++) {
      x = MathFloor(OrigMeu[i]+128)*256 + MathRound(MathRandom()*255) + MathRound(MathRandom()*255)*256*256;
      y = MathFloor((x<<this.shift(i))/256);

      encripMeu[3*i]   = this.alfanum(y%32); 
      encripMeu[3*i+1] = this.alfanum((y/32)%32);
      encripMeu[3*i+2] = this.alfanum((y/1024)%32);
    }

    return encripMeu;
  }
    
  /**
   * @param {String} OrigMeu
   * @return {String}
   */
  descartesJS.Krypto.prototype.desencripta = function(OrigMeu) {
    return this.bytesToString( this.desencriptaAux(this.stringToBytes(OrigMeu)));
  }
  
  /**
   * @param {Array<Bytes>} OrigMeu
   * @return {String}
   */
  descartesJS.Krypto.prototype.desencriptaAux = function(OrigMeu) {
    if ((OrigMeu == null) || (this.key == null)) {
      return null;
    }

    desencripMeu = new Array(OrigMeu.length/3);

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
   * @param Number {Array<Number>} k
   * @return Number {Array<Number>}
   */
  descartesJS.Krypto.prototype.alfanum = function(k) {
    return ((k < 10) ? 48 : 87) + MathFloor(k);
  }
  
  /**
   * @param Number {Array<Number>} b
   * @return Number {Array<Number>}
   */
  descartesJS.Krypto.prototype.numalfa = function(b) {
    return b - ((b < 58) ? 48 : 87);
  }
  
  /**
   * @param {String} 
   * @return {Array<Number>}
   */
  descartesJS.Krypto.prototype.stringToBytes = function(OrigMeu) {
    b = [];
    
    for (var i=0, l=OrigMeu.length; i<l; i++) {
      b.push( OrigMeu.charCodeAt(i) );
    }
    
    return b;
  }

  /**
   * @param {Array<Number>}
   * @return {String} 
   */
  descartesJS.Krypto.prototype.bytesToString = function(b) {
    for (var i=0, l=b.length; i<l; i++) {
      b[i] = stringfromCharCode(b[i]);
    }

    return b.join("");
  }
  
  /**
   * @param {Number}
   * @return {Number} 
   */
  descartesJS.Krypto.prototype.shift = function(i) {
    a = (this.key).charCodeAt(i%(this.key.length));
    b = this.numalfa(a);
    c = MathFloor((b/2)%8);
    if (c == 0) {
      c = 4;
    }
    return c;
  }

  /**
   * @param {String} n
   * @return {Array<Number>}
   */
  descartesJS.Krypto.prototype.parseByte = function(n) {
    n = parseInt(n);
    n = (n < 0) ? 0 : n;
    n = (n > 255) ? 255 : n;
    
    return n;
  }
  
  return descartesJS;
})(descartesJS || {});
