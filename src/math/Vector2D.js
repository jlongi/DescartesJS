/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un vector en R2
   * @constructor 
   * @param {x} componente x del vector
   * @param {y} componente y del vector
   */
  descartesJS.Vector2D = function(x, y) {
    this.x = x;
    this.y = y;
  }
  
  /**
   * Vector correspondiente al eje X
   * @const
   * @type {Vector2D}
   */ 
  descartesJS.Vector2D.AXIS_X = new descartesJS.Vector2D(1, 0);;

  /**
   * Vector correspondiente al eje Y
   * @const
   * @type {Vector2D}
   */ 
  descartesJS.Vector2D.AXIS_Y = new descartesJS.Vector2D(0, 1);

  /**
   * Se calcula la longitud del vector
   * @return {Number} la longitud del vector
   */
  descartesJS.Vector2D.prototype.vectorLength = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
  
  /**
   * Se calcula el producto punto entre dos vectores
   * @param {Vector2D} el segundo vector para calcular el producto punto
   * @return {Number} el producto punto entre dos vectores
   */
  descartesJS.Vector2D.prototype.dotProduct = function(v) {
    return this.x*v.x + this.y*v.y;
  }
  
  /**
   * Se calcula el angulo entre dos vectores
   * @param {Vector2D} el segundo vector para calcular el angulo
   * @return {Number} el angulo entre dos vectores
   */
  descartesJS.Vector2D.prototype.angleBetweenVectors = function(v) {
    return Math.acos(this.dotProduct(v)/(this.vectorLength()*v.vectorLength()));
  }

  return descartesJS;
})(descartesJS || {});
