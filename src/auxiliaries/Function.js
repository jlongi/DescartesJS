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
    this.params = this.id.substring(parPos+1, this.id.indexOf(")"));
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

    this.parseExpressions(parser);
      
    this.expresion = parser.parse(this.expresion);

    var self = this;

    this.functionExec = function() {
      this.iterations = 0;

      if (self.numberOfParams <= arguments.length) {

        // saves the private variables
        var localVars = [];
        for (var i=0, l=self.privateVars.length; i<l; i++) {
          localVars.push( evaluator.getVariable(self.privateVars[i]) );
          // set the local variables to 0
          evaluator.setVariable(self.privateVars[i], 0);
        }

        // saves the variable values ​​that have the same names as function parameters
        var paramsTemp = [];
        for (var i=0, l=self.params.length; i<l; i++) {
          paramsTemp[i] = evaluator.getVariable(self.params[i]) || 0;
          // associated input parameters of the function with parameter names
          evaluator.setVariable(self.params[i], arguments[i]);
        }
        
        for (var i=0, l=self.init.length; i<l; i++) {
          evaluator.eval(self.init[i]);
        }
        
        do {
          for (var i=0, l=self.doExpr.length; i<l; i++) {
            evaluator.eval(self.doExpr[i]);
          }

          if (++this.iterations > 100000) {
            console.log("se ha excedido el límite de 100000 repeticiones en la función << " + self.name + " >>");
            return 0;
          }
        }
        while (evaluator.eval(self.whileExpr) > 0);

        // evaluates to the return value
        var result = evaluator.eval(self.expresion);
        descartesJS.rangeOK = evaluator.eval(self.domain);

        // restore the variable values that have the same names as function parameters
        for (var i=0, l=self.params.length; i<l; i++) {
          evaluator.setVariable(self.params[i], paramsTemp[i]);
        }

        // restore the local variable values
        for (var i=0, l=self.privateVars.length; i<l; i++) {
          evaluator.setVariable(self.privateVars[i], localVars[i]);
        }          
      
        return result;
      }
      
      return 0;
    }

    
    evaluator.setFunction(this.name, this.functionExec);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Function, descartesJS.Auxiliary);

  return descartesJS;
})(descartesJS || {});