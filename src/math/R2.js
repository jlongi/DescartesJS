/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathMax = Math.max;
  var MathMin = Math.min;
  var MathPI = Math.PI;
  var MathCos = Math.cos;
  var MathSin = Math.sin;
  var MathAbs = Math.abs;
  var MathRound = Math.round;
  var aux;
  var q;
  var p;
  var s;
  var t;
  var cost;
  var sint;

  var A11;
  var A12;
  var B1;
  var A21;
  var A22;
  var B2;
    
  var mp;
  var Mp;
  var mq;
  var Mq;
  var Det;

  class R2 {
    /**
     * Descartes R2
     * @param {Number} x the x position
     * @param {Number} y the y position
     */
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }

    set(x = 0, y = 0) {
      this.x = x;
      this.y = y;
      return this;
    }

    copy() {
      return new R2(this.x, this.y);
    }
    
    ix() {
      return MathRound(MathMax(MathMin(this.x, 32000), -32000));
    }

    iy() {
      return MathRound(MathMax(MathMin(this.y, 32000), -32000));
    }

    equals(p) {
      return ((this.x === p.x) && (this.y === p.y)); 
    }

    norm2() {
      return this.x*this.x + this.y*this.y; 
    }

    norm() {
      return Math.sqrt( this.norm2() ); 
    }

    distance(p) {
      q = this.copy(); 
      q.sub(p); 
      
      return q.norm(); 
    }

    dot(p) {
      return this.x*p.x + this.y*p.y; 
    }

    det(p) {
      return this.x*p.y - this.y*p.x; 
    }

    mul(m) {
      this.x *= m;
      this.y *= m; 
    }

    div(d) {
      this.x /= d;
      this.y /= d; 
    }

    add(p) {
      this.x += p.x;
      this.y += p.y; 
    }

    sub(p) {
      this.x -= p.x;
      this.y -= p.y; 
    }

    normalize() {
      aux = this.norm(); 
      if (aux != 0.0) { 
        this.div(aux); 
      }
    }

    rotR90() {
      aux = this.x;
      this.x = this.y;
      this.y = -aux; 
    }

    rotL90() {
      aux = this.x;
      this.x = -this.y;
      this.y = aux;
    }

    rot(t) {
      p = this.copy();
      cost = MathCos(t);
      sint = MathSin(t);
      this.x = p.x*cost - p.y*sint;
      this.y = p.x*sint + p.y*cost;
    }

    rot2(g) {
      this.rot(g*MathPI/180); 
    }

    intersection(p1, p2, q1, q2) {
      A11 = p2.x - p1.x;
      A12 = q1.x - q2.x;
      B1  = q1.x - p1.x;
      
      A21 = p2.y - p1.y;
      A22 = q1.y - q2.y;
      B2  = q1.y - p1.y;

      Det = A11*A22 - A12*A21;
      if (MathAbs(Det) > 0.000001) {
        s = ( B1*A22-B2*A12)/Det;
        t = (-B1*A21+B2*A11)/Det;
        
        if (0<=s && s<=1 && 0<=t && t<=1) {
          return new R2(p1.x+A11*s, p1.y+A21*s);
        } else {
          return null;
        }
      } 
      
      else if ((p2.x-q1.x)*B2 != (p2.y-q1.y)*B1) {
        return null;
      } 
      else {
        if (p1.x != p2.x) {
          mp = MathMin(p1.x, p2.x);
          Mp = MathMax(p1.x, p2.x);
          
          if (mp<=q1.x && q1.x<=Mp) {
            return q1;
          } 
          else if (mp<=q2.x && q2.x<=Mp) {
            return q2;
          }
          return null;
        } 
        else if (q1.x != q2.x) {
          mq = MathMin(q1.x, q2.x);
          Mq = MathMax(q1.x, q2.x);
          
          if (mq<=p1.x && p1.x<=Mq) {
            return p1;
          } 
          else if (mq<=p2.x && p2.x<=Mq) {
            return p2;
          }
          return null;
        } 
        else if (p1.y != p2.y) {
          mp = MathMin(p1.y, p2.y);
          Mp = MathMax(p1.y, p2.y);
          
          if (mp<=q1.y && q1.y<=Mp) {
            return q1;
          } 
          else if (mp<=q2.y && q2.y<=Mp) {
            return q2;
          }
          return null;
        } 
        else if (q1.y != q2.y) {
          mq=MathMin(q1.y, q2.y);
          Mq=MathMax(q1.y, q2.y);
          
          if (mq<=p1.y && p1.y<=Mq) {
            return p1;
          } 
          else if (mq<=p2.y && p2.y<=Mq) {
            return p2;
          }
          return null;
        } 
        else if (p1.x==q1.x && p1.y==q1.y) {
          return p1;
        } else {
          return null;
        }
      }
    }
  }

  descartesJS.R2 = R2;
  return descartesJS;
})(descartesJS || {});
