/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class Vector2D {
    /**
     * Descartes R2 vector
     * @param {Number} x the x component of the vector
     * @param {Number} y the y component of the vector
     */
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    
    /**
     * Get the length of a 2D vector
     * @return {Number} return the length of a 2D vector
     */
    vectorLength() {
      return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    
    /**
     * Calculate the dot product of two vectors
     * @param {Vector2D} v the second vector for the calculation of the dot product
     * @return {Number} return the dot product
     */
    dotProduct(v) {
      return this.x*v.x + this.y*v.y;
    }
    
    /**
     * Calculate the angle between two vectors
     * @param {Vector2D} v the second vector for the calculation of the angle between two vectors
     * @return {Number} return the angle between two vectors
     */
    angleBetweenVectors(v) {
      return Math.acos(this.dotProduct(v)/(this.vectorLength()*v.vectorLength()));
    }
  }

  /**
   * Axis X vector
   * @const
   * @type {Vector2D}
   */ 
  Vector2D.AXIS_X = new Vector2D(1, 0);;

  /**
   * Axis Y vector
   * @const
   * @type {Vector2D}
   */ 
  Vector2D.AXIS_Y = new Vector2D(0, 1);

  descartesJS.Vector2D = Vector2D;
  return descartesJS;
})(descartesJS || {});
