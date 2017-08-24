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

    this.local = "";

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
  descartesJS.Auxiliary.prototype.firstRun = function() { };

  /**
   * Update the auxiliary
   */
  descartesJS.Auxiliary.prototype.update = function() { };

  var tmp;
  var tmpExpression;
  
  /**
   * Split the expression using the semicolon as separator, ignoring the empty expressions
   * @param {Parser} parser a Descartes parser object
   * @param {String} expression the expression to split
   * @return {Array<Node>} return an array of nodes correspoding to the expression split
   */
  descartesJS.Auxiliary.prototype.splitInstructions = function(parser, expression) {
    tmpExpression = [];

    expression = (expression) ? descartesJS.splitSeparator(expression) : [""];

    // add only the instructions that execute something, i.e. instructions whit parsing different of null
    for (var i=0, l=expression.length; i<l; i++) {
      descartesJS.DEBUG.lineCount = i;
      tmp = parser.parse(expression[i], true);
      if (tmp) {
        tmpExpression.push(tmp);
      }
    }
    
    return tmpExpression;
  }

  /**
   *
   */
  descartesJS.Auxiliary.prototype.getPrivateVariables = function(parser, expression) {
    tmpExpression = [];

    if (expression) {
      expression = expression.split(/;|,/);
    } else {
      expression = [""];
    }

    // add only the instructions tha execute something, i.e. instructions whit parsing different of null
    for (var i=0, l=expression.length; i<l; i++) {
      tmp = parser.parse(expression[i], true);
      if (tmp) {
        tmpExpression.push(tmp);
      }
    }    

    // add the identifier nodes to local variables
    for (var i=0, l=tmpExpression.length; i<l; i++) {
      if (tmpExpression[i].type === "asign") {
        tmpExpression[i] = tmpExpression[i].childs[0].value;
      }
      else if (tmpExpression[i].type === "identifier") {
        tmpExpression[i] = tmpExpression[i].value;
      }
      else {
        tmpExpression[i] = "";
      }
    }

    return tmpExpression;
  }

  /**
   *
   */
  descartesJS.Auxiliary.prototype.parseExpressions = function(parser) {
    descartesJS.DEBUG.paramName = "inicio";
    // parse the init expression
    this.init = this.splitInstructions(parser, this.init);

    descartesJS.DEBUG.paramName = "local";
    // parse the local expression
    this.privateVars = this.getPrivateVariables(parser, this.local);

    descartesJS.DEBUG.paramName = "hacer";
    // parse the do expression
    this.doExpr = this.splitInstructions(parser, this.doExpr);
    
    descartesJS.DEBUG.paramName = "mientras";
    // parse the while expression
    this.whileExpr = parser.parse(this.whileExpr);
  }

  return descartesJS;
})(descartesJS || {});