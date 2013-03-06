/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var delta = 0.000000000001;
  var epsilon = 0.000001;
  
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
      
      // una restriccion de la forma "algo = otraCosa" se convierte en "algo - otraCosa = 0"
      this.constraint = this.constraint.equalToMinus();
      // se evalua solo el lado izquierdo, ya que el lado derecho es 0
      this.constraint = this.constraint.childs[0];
    }
  }
  
  /**
   * 
   */
  descartesJS.R2Newton.prototype.getUnitNormal = function() {
    this.normal.normalize();
    return this.normal.copy();
  }
  
  /**
   * 
   */
  descartesJS.R2Newton.prototype.gradient = function(q0) {
    var evaluator = this.evaluator;
    
    var q = new descartesJS.R2(0, 0);
    
    var savex = evaluator.getVariable("x");
    var savey = evaluator.getVariable("y");

    evaluator.setVariable("x", q0.x);
    evaluator.setVariable("y", q0.y);

    this.f0 = evaluator.evalExpression(this.constraint);
    
    evaluator.setVariable("x", evaluator.getVariable("x") + delta);

    var FV = evaluator.evalExpression(this.constraint);
   
    q.x = (FV-this.f0)/delta;
    q.x = (!isNaN(q.x)) ? q.x : Infinity;
    
    evaluator.setVariable("x", evaluator.getVariable("x") - delta);
    evaluator.setVariable("y", evaluator.getVariable("y") + delta);

    FV = evaluator.evalExpression(this.constraint);

    q.y = (FV-this.f0)/delta;
    q.y = (!isNaN(q.y)) ? q.y : Infinity;

    evaluator.setVariable("x", savex);
    evaluator.setVariable("y", savey);
    
    return q;    
  }

  /**
   * 
   */
  // return R2
  // q0 es de tipo R2
  descartesJS.R2Newton.prototype.findZero = function(q0) {
    var evaluator = this.evaluator;
    
    var q = q0.copy();
    
    var savex = evaluator.getVariable("x");
    var savey = evaluator.getVariable("y");
    
    evaluator.setVariable("x", q0.x);
    evaluator.setVariable("y", q0.y);
    
    this.f0 = evaluator.evalExpression(this.constraint);
    
    if ((this.sign == "menor") && (this.f0 <= 0)) {
      return q;
    } 
    else if ((this.sign=="mayor") && (this.f0 >= 0)) {
      return q;
    }
    
    evaluator.setVariable("x", savex);
    evaluator.setVariable("y", savey);

    var xa;
    var ya;
    for (var i=0; i<256; i++) {
      xa = q.x;
      ya = q.y;

      this.normal = this.gradient(q);

      if (this.normal.norm2() != 0) {
        this.normal.mul(-this.f0/this.normal.norm2());
      }

      q.x = xa+this.normal.x; 
      q.y = ya+this.normal.y;
      
      if (this.normal.norm() < epsilon) {
        if ((this.normal.x == 0) && (this.normal.y == 0)) {
          this.normal.x = q.x-q0.x;
          this.normal.y = q.y-q0.y;
        }
        return q;
      }
    }
    
    return q;
  }

  return descartesJS;
})(descartesJS || {});
