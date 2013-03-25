/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes R2 vector
   * @constructor 
   * @param {Number} x the x component of the vector
   * @param {Number} y the y component of the vector
   */
  descartesJS.Vector2D = function(x, y) {
    this.x = x;
    this.y = y;
  }
  
  /**
   * Axis X vector
   * @const
   * @type {Vector2D}
   */ 
  descartesJS.Vector2D.AXIS_X = new descartesJS.Vector2D(1, 0);;

  /**
   * Axis Y vector
   * @const
   * @type {Vector2D}
   */ 
  descartesJS.Vector2D.AXIS_Y = new descartesJS.Vector2D(0, 1);

  /**
   * Get the lenght of a 2D vector
   * @return {Number} return the lenght of a 2D vector
   */
  descartesJS.Vector2D.prototype.vectorLength = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
  
  /**
   * Calculate the dot product of two vectors
   * @param {Vector2D} v the second vector for the calculation of the dot product
   * @return {Number} return the dot product
   */
  descartesJS.Vector2D.prototype.dotProduct = function(v) {
    return this.x*v.x + this.y*v.y;
  }
  
  /**
   * Calculate the angle between two vectors
   * @param {Vector2D} v the second vector for the calculation of the angle between two vectors
   * @return {Number} return the angle between two vectors
   */
  descartesJS.Vector2D.prototype.angleBetweenVectors = function(v) {
    return Math.acos(this.dotProduct(v)/(this.vectorLength()*v.vectorLength()));
  }

  return descartesJS;
})(descartesJS || {});
