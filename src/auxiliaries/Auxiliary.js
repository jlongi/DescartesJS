/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * Descartes auxiliary
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Auxiliary = function(parent, values) {
    /**
     * Descartes application
     * type {DescartesApp}
     * @private
     */
    this.parent = parent;
    this.evaluator = this.parent.evaluator;

    var parser = parent.evaluator.parser;

    /**
     * identifier of the auxiliary
     * type {String}
     * @private
     */
    this.id = "";

    /**
     * the expression of the auxiliary
     * type {String}
     * @private
     */
    this.expresion = "";

    /**
     * type of evaluation of the auxiliary
     * type {String}
     * @private
     */
    this.evaluate = "onlyOnce";

    // traverse the values to replace the defaults values of the object
    for (var propName in values) {
      // verify the own properties of the object
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }
  }  
  
  /**
   * Set the first run of an algotithm
   */
  descartesJS.Auxiliary.prototype.firstRun = function() { }

  /**
   * Update the auxiliary
   */
  descartesJS.Auxiliary.prototype.update = function() { }
  
  var tmp;
  var tmpExpression;
  var i;
  var l;

  /**
   * Split the expression using the semicolon as separator, ignoring the empty expressions
   * @param {Parser} parser a Descartes parser object
   * @param {String} expression the expression to split
   * @return {Array<Node>} return an array of nodes correspoding to the expression split
   */
  descartesJS.Auxiliary.prototype.splitInstructions = function(parser, expression) {
    tmpExpression = [];

    // split the expression separated
    if (expression) {
      expression = expression.split(";");
    } else {
      expression = [""];
    }
    
    // add only the instructions tha execute something, i.e. instructions whit parsing different of null
    for (i=0, l=expression.length; i<l; i++) {
      tmp = parser.parse(expression[i], true);
      if (tmp) {
        tmpExpression.push(tmp);
      }
    }
    
    return tmpExpression;
  }

  /**
   */
  descartesJS.Auxiliary.prototype.getPrivateVariables = function(expression) {
    tmpExpression = [];

    for (i=0, l=expression.length; i<l; i++) {
      if (expression[i].type === "asign") {
        tmpExpression.push(expression[i].childs[0].value);
      }
    }
    
    return tmpExpression;
  }

  /**
   *
   */
  descartesJS.Auxiliary.prototype.buildAlgorithm = function() {
    var self = this;
    var evaluator = self.evaluator;
    var parser = evaluator.parser;

    // parse the init expression
    self.init = self.splitInstructions(parser, self.init);
    
    // NEW CODE
    // get the private vars in the function
    // self.privateVars = self.getPrivateVariables(self.init);
    self.privateVars = [];
    // NEW CODE

    // parse the do expression
    self.doExpr = self.splitInstructions(parser, self.doExpr);
    
    // parse the while expression
    if (self.whileExpr) {
      self.whileExpr = parser.parse(self.whileExpr);
    }

    // NEW CODE
    var localVars;
    // NEW CODE
    var paramsTemp;
    var i;
    var l;
    var privateVarL = self.privateVars.length;
    var paramsL = self.params.length;
    var initL = self.init.length;
    var doL = self.doExpr.length;

    function algorithmExec() {
      if (self.numberOfParams == arguments.length) {

        // NEW CODE
        // saves the private variables
        localVars = [];
        for (i=0; i<privateVarL; i++) {
          localVars.push( evaluator.getVariable(self.privateVars[i]) );
        }
        // NEW CODE

        // saves the variable values ​​that have the same names as function parameters
        paramsTemp = [];
        for (i=0; i<paramsL; i++) {
          paramsTemp.push( evaluator.getVariable(self.params[i]) );

          // associated input parameters of the function with parameter names
          evaluator.setVariable(self.params[i], arguments[i]);
        }

        for (i=0; i<initL; i++) {
          evaluator.evalExpression(self.init[i]);
        }
        
        do {
          for (i=0; i<doL; i++) {
            evaluator.evalExpression(self.doExpr[i]);
          }
        }
        while (evaluator.evalExpression(self.whileExpr) > 0);

        // evaluates to the return value
        result = evaluator.evalExpression(self.expresion);
        descartesJS.rangeOK = evaluator.evalExpression(self.domain);

        // restore the variable values that have the same names as function parameters
        for (i=0; i<paramsL; i++) {
          evaluator.setVariable(self.params[i], paramsTemp[i]);
        }

        // NEW CODE
        // restore the local variable values
        for (i=0; i<privateVarL; i++) {
          evaluator.setVariable(self.privateVars[i], localVars[i]);
        }
        // NEW CODE

        return result;
      }
    }

    return algorithmExec;
  }

  return descartesJS;
})(descartesJS || {});