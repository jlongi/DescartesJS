/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathMax = Math.max;
  var MathMin = Math.min;

  descartesJS.R2 = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  descartesJS.R2.prototype.copy = function() {
    return new descartesJS.R2(this.x, this.y);
  }
  
  descartesJS.R2.prototype.ix = function() {
    return Math.round(MathMax(MathMin(this.x,32000), -32000));
  }

  descartesJS.R2.prototype.iy = function() {
    return Math.round(MathMax(MathMin(this.y,32000), -32000));
  }

  descartesJS.R2.prototype.equals = function(p) {
    return ((this.x == p.x) && (this.y == p.y)); 
  }

  descartesJS.R2.prototype.norm2 = function() {
    return this.x*this.x + this.y*this.y; 
  }

  descartesJS.R2.prototype.norm = function() {
    return Math.sqrt( this.norm2() ); 
  }

  descartesJS.R2.prototype.distance = function(p) {
    var q = this.copy(); 
    q.sub(p); 
    
    return q.norm(); 
  }

  descartesJS.R2.prototype.dot = function(p) {
    return this.x*p.x + this.y*p.y; 
  }

  descartesJS.R2.prototype.det = function(p) {
    return this.x*p.y - this.y*p.x; 
  }

  descartesJS.R2.prototype.mul = function(m) {
    this.x*=m;
    this.y*=m; 
  }

  descartesJS.R2.prototype.div = function(d) {
    this.x/=d;
    this.y/=d; 
  }

  descartesJS.R2.prototype.add = function(p) {
    this.x+=p.x;
    this.y+=p.y; 
  }

  descartesJS.R2.prototype.sub = function(p) {
    this.x-=p.x;
    this.y-=p.y; 
  }

  descartesJS.R2.prototype.normalize = function() {
    var abso = this.norm(); 
    if (abso != 0.0) { 
      this.div(abso); 
    }
  }

  descartesJS.R2.prototype.rotR90 = function() {
    var aux = this.x;
    this.x = this.y;
    this.y = -aux; 
  }

  descartesJS.R2.prototype.rotL90 = function() {
    var aux = this.x;
    this.x = -this.y;
    this.y = aux;
  }

  descartesJS.R2.prototype.rot = function(t) {
    var p = this.copy();
    var cost = Math.cos(t);
    var sint = Math.sin(t);
    this.x = p.x*cost - p.y*sint;
    this.y = p.x*sint + p.y*cost;
  }

  descartesJS.R2.prototype.rot = function(g) {
    this.rot(g*Math.PI/180); 
  }

  descartesJS.R2.prototype.intersection = function(p1, p2, q1, q2) {
    var A11 = (p2.x-p1.x);
    var A12 = (q1.x-q2.x);
    var B1 = q1.x-p1.x;
    
    var A21 = (p2.y-p1.y);
    var A22 = (q1.y-q2.y);
    var B2 = q1.y-p1.y;
    
    var mp;
    var Mp;
    var mq;
    var Mq;
    
    var Det = A11*A22-A12*A21;
    if (Math.abs(Det) > 0.000001) {
      var s = ( B1*A22-B2*A12)/Det;
      var t = (-B1*A21+B2*A11)/Det;
      if (0<=s && s<=1 && 0<=t && t<=1) {
        return new descartesJS.R2(p1.x+A11*s, p1.y+A21*s);
      } else {
        return null;
      }
    } 
    
    else if ((p2.x-q1.x)*B2 != (p2.y-q1.y)*B1) {
      return null; // no están alineados
    } else { // están alineados
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

  return descartesJS;
})(descartesJS || {});
