/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes function
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Function = function(parent, values){
    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);

    var evaluator = this.evaluator;
    var parser = evaluator.parser;

    var parPos = this.id.indexOf("(");
    this.name = this.id.substring(0, parPos);
    this.params = this.id.substring(parPos+1, this.id.length-1);
    this.domain = (this.range) ? parser.parse(this.range) : parser.parse("1");
    
    if (this.params == "") {
      this.params = [];
    } else {
      this.params = this.params.split(",");
    }
    
    this.numberOfParams = this.params.length;
    
    // if do not have an algorithm ignore the init, doExpr and whileExpr values
    if (!this.algorithm) {
      this.init = "";
      this.doExpr = "";
      this.whileExpr = "";
    }

    // parse the expression
    this.expresion = parser.parse(this.expresion);
    
    // this.functionExec = this.buildAlgorithm();
    // evaluator.setFunction(this.name, this.functionExec);
    evaluator.setFunction(this.name, this.buildAlgorithm());
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Function, descartesJS.Auxiliary);

  return descartesJS;
})(descartesJS || {});