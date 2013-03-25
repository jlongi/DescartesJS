/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes constant
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Constant = function(parent, values){
    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);
    
    this.expresion = this.evaluator.parser.parse(this.expresion);
    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Constant, descartesJS.Auxiliary);
  
  /**
   * Update constant
   */
  descartesJS.Constant.prototype.update = function() {
    this.evaluator.setVariable(this.id, this.evaluator.evalExpression(this.expresion));
  }

  return descartesJS;
})(descartesJS || {});