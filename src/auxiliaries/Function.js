/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class Function extends descartesJS.Auxiliary {
    /**
     * Descartes function
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the auxiliary
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      let self = this;
      let evaluator = self.evaluator;
      let parser = evaluator.parser;

      let parPos = self.id.indexOf("(");
      self.name = self.id.substring(0, parPos);
      self.params = self.id.substring(parPos+1, self.id.indexOf(")"));
      self.domain = (self.range) ? parser.parse(self.range) : parser.parse("1");

      self.params = (self.params === "") ? [] : self.params.split(",");
      
      self.numParams = self.params.length;

      // if do not have an algorithm ignore the init, doExpr and whileExpr values
      if (!self.algorithm) {
        self.init = self.doExpr = self.whileExpr = "";
      }

      descartesJS.parseExpr(self, self, parser);
        
      self.expresion = parser.parse(self.expresion);

      let max_ite;

      self.functionExec = function() {
        let ite = 0;

        if (self.numParams <= arguments.length) {
          // saves the private variables
          let localVars = [];
          for (let expr of self.privateVars) {
            localVars.push( evaluator.getVariable(expr) );
            // assign 0 to all the local variables
            evaluator.setVariable(expr, 0);
          }

          // saves the variable values ​​that have the same names as function parameters
          let paramsTemp = [];
          self.params.forEach((paramName, i) => {
            paramsTemp.push( evaluator.getVariable(paramName) );
            // associated input parameters of the function with parameter names
            evaluator.setVariable(paramName, arguments[i]);
          });
          
          for (let expr of self.init) {
            evaluator.eval(expr);
          }

          max_ite = evaluator.getVariable("_NUM_MAX_ITE_ALG_") || 100000;

          do {
            for (let expr of self.doExpr) {
              evaluator.eval(expr);
            }

            if (++ite > max_ite) {
              console.warn(`se ha excedido el límite de ${max_ite} repeticiones en la función «${self.name}»`);
              return 0;
            }
          }
          while (evaluator.eval(self.whileExpr) > 0);

          // evaluates the return value
          let result = evaluator.eval(self.expresion);
          descartesJS.rangeOK = evaluator.eval(self.domain);

          // restore the variable values that have the same names as function parameters
          self.params.forEach((paramName, i) => {
            evaluator.setVariable(paramName, paramsTemp[i]);
          });

          // restore the local variable values
          self.privateVars.forEach((paramName, i) => {
            evaluator.setVariable(paramName, localVars[i]);
          });
        
          return result;
        }
        
        return 0;
      }
      
      evaluator.setFunction(self.name, self.functionExec);
    }
  }

  descartesJS.Function = Function;
  return descartesJS;
})(descartesJS || {});
