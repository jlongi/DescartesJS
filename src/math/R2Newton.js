/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var delta = 0.000001;

  var evaluator;
  var FV;
  var xa;
  var ya;
  var q;
  var newQ;
  var savex;
  var savey;

  var _unitNormal;


  /**
   * Descartes R2Newton
   * @constructor 
   * @param {Evaluator} evaluator the Descartes evaluator
   * @param {String} constraint the constraint of the R2Newton
   */
  descartesJS.R2Newton = function(evaluator, constraint) {
    this.evaluator = evaluator;
    this.constraint = constraint;
    
    if ((this.constraint.value == "==") || (this.constraint.value == "<") || (this.constraint.value == "<=") || (this.constraint.value == ">") || (this.constraint.value == ">=")) {
      
      if ((this.constraint.value == "<") || (this.constraint.value == "<=")) {
        this.sign = "menor";
      }
      
      else if ((this.constraint.value == ">") || (this.constraint.value == ">=")) {
        this.sign = "mayor";
      }
      
      else {
        this.sign = "igual"; 
      }
      
      // a constraint of the form "something = somethingElse" is converted to "someting - somethingElse = 0"
      this.constraint = this.constraint.equalToMinus();
      // evaluates onlye the left size, because the right size is 0
      this.constraint = this.constraint.childs[0];
    }

    newQ = new descartesJS.R2(0, 0);
    q = new descartesJS.R2(0, 0);
    _unitNormal = new descartesJS.R2(0, 0);
  }
  
  /**
   * 
   */
  descartesJS.R2Newton.prototype.getUnitNormal = function() {
    this.normal.normalize();
    
    return _unitNormal.set(this.normal.x, this.normal.y);
  }
  
  /**
   * 
   */
  descartesJS.R2Newton.prototype.gradient = function(q0) {
    evaluator = this.evaluator;
    
    newQ.x = 0;
    newQ.y = 0;

    savex = evaluator.getVariable("x");
    savey = evaluator.getVariable("y");

    evaluator.setVariable("x", q0.x);
    evaluator.setVariable("y", q0.y);

    this.f0 = evaluator.eval(this.constraint);
    
    evaluator.setVariable("x", evaluator.getVariable("x") + delta);

    FV = evaluator.eval(this.constraint);
   
    newQ.x = (FV-this.f0)/delta;
    newQ.x = (!isNaN(newQ.x)) ? newQ.x : Infinity;
    
    evaluator.setVariable("x", evaluator.getVariable("x") - delta);
    evaluator.setVariable("y", evaluator.getVariable("y") + delta);

    FV = evaluator.eval(this.constraint);

    newQ.y = (FV-this.f0)/delta;
    newQ.y = (!isNaN(newQ.y)) ? newQ.y : Infinity;

    evaluator.setVariable("x", savex);
    evaluator.setVariable("y", savey);
    
    return newQ;    
  }

  /**
   * 
   */
  descartesJS.R2Newton.prototype.findZero = function(q0, dist, is_graphic_control) {
    evaluator = this.evaluator;
    
    q.x = q0.x;
    q.y = q0.y;
    
    savex = evaluator.getVariable("x");
    savey = evaluator.getVariable("y");
    
    evaluator.setVariable("x", q0.x);
    evaluator.setVariable("y", q0.y);
    
    this.f0 = evaluator.eval(this.constraint);
    
    if ((this.sign === "menor") && (this.f0 <= 0)) {
      return q;
    } 
    else if ((this.sign === "mayor") && (this.f0 >= 0)) {
      return q;
    }
    
    evaluator.setVariable("x", savex);
    evaluator.setVariable("y", savey);

    for (var i=0; i<16; i++) {
      xa = q.x;
      ya = q.y;

      this.normal = this.gradient(q);

      if (this.normal.norm2() != 0) {
        this.normal.mul(-this.f0/this.normal.norm2());
      }

      q.x = xa+this.normal.x; 
      q.y = ya+this.normal.y;
      
      if (this.normal.norm() < dist) {
        if ((this.normal.x === 0) && (this.normal.y === 0)) {
          this.normal.x = q.x-q0.x;
          this.normal.y = q.y-q0.y;
        }
        return q;
      }
    }

    if (is_graphic_control) {
      return q;
    }
    else {
      return null;
    }
  }

  return descartesJS;
})(descartesJS || {});