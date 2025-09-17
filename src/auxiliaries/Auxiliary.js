/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  let self;
  let tmpExpression;
  let tmp;

  class Auxiliary {
    /**
     * Descartes auxiliary
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the auxiliary
     */
    constructor(parent, values) {
      self = this;

      self.parent = parent;
      self.evaluator = parent.evaluator;
      self.id = self.expresion = self.init = self.privateVars = self.doExpr = self.whileExpr = "";
      self.evaluate = "onlyOnce";

      // assign the values to replace the defaults values of the object
      Object.assign(self, values);
    }  
    
    /**
     * Set the first run of an algorithm
     */
    firstRun() { };

    /**
     * Update the auxiliary
     */
    update() { };
  }

  /**
   * Support functions for auxiliary
   */

  /**
   * Split the expression using the semicolon as separator, ignoring the empty expressions
   * @param {Parser} parser a Descartes parser object
   * @param {String} expression the expression to split
   * @return {Array<Node>} return an array of nodes corresponding to the expression split
   */
  descartesJS.splitInstructions = function(parser, expression) {
    expression = (expression) ? descartesJS.splitSeparator(expression) : [""];

    // add only the instructions that execute something, i.e. instructions with parsing different of null
    return expression.map((expr_i, i) => {
      descartesJS.DEBUG.lineCount = i;
      return parser.parse(expr_i, true);
    }).filter((tmp) => tmp);
  }

  /**
   *
   */
  descartesJS.parseExpr = function(element, values, parser) {
    // parse the init expression
    descartesJS.DEBUG.pName = "inicio";
    element.init = descartesJS.splitInstructions(parser, values.init);

    // parse the local expression
    descartesJS.DEBUG.pName = "local";
    element.privateVars = descartesJS.getPrivateVariables(parser, values.local);

    // parse the do expression
    descartesJS.DEBUG.pName = "hacer";
    element.doExpr = descartesJS.splitInstructions(parser, values.doExpr);
    
    // parse the while expression
    descartesJS.DEBUG.pName = "mientras";
    element.whileExpr = parser.parse(values.whileExpr);
  }

  /**
   *
   */
  descartesJS.getPrivateVariables = function(parser, expression) {
    tmpExpression = [];

    expression = (expression) ? expression.split(/;|,/) : [""];

    // add only the instructions that execute something, i.e. instructions with parsing different of null
    for (let expr_i of expression) {
      tmp = parser.parse(expr_i, true);
      if (tmp) {
        tmpExpression.push(tmp);
      }
    }    

    // add the identifier nodes to local variables
    for (let i=0, l=tmpExpression.length; i<l; i++) {
      if (tmpExpression[i].type === "assign") {
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

  descartesJS.Auxiliary = Auxiliary;
  return descartesJS;
})(descartesJS || {});
