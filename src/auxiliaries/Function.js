/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una funcion de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la funcion
   */
  descartesJS.Function = function(parent, values){
    // se llama al constructor del padre
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
    
    // se parsea la expresion init
    this.init = this.splitInstructions(parser, this.init);

    // se parsea la expresion doExpr
    this.doExpr = this.splitInstructions(parser, this.doExpr);
    
    // se parsea la expresion de while
    if (this.whileExpr) {
      this.whileExpr = parser.parse(this.whileExpr);
    }
      
    this.expresion = parser.parse(this.expresion);

    var self = this;
    if (this.algorithm) {
      this.functionExec = function() {
        if (self.numberOfParams == arguments.length) {

          // se guardan los valores de las variables que tienen el mismo nombre que los parametros de la funcion
          var paramsTemp = [];
          for (var i=0, l=self.params.length; i<l; i++) {
            paramsTemp[i] = evaluator.getVariable(self.params[i]);
            
            // se asocian los parametros de entrada de la funcion con los nombres de los parametros
            evaluator.setVariable(self.params[i], arguments[i]);
          }
          
          for (var i=0, l=self.init.length; i<l; i++) {
            evaluator.evalExpression(self.init[i]);
          }
          
          do {
            for (var i=0, l=self.doExpr.length; i<l; i++) {
              evaluator.evalExpression(self.doExpr[i]);
            }
          }
          while (evaluator.evalExpression(self.whileExpr) > 0);
                   
          // se evalua el valor de regreso
          var result = evaluator.evalExpression(self.expresion);
          descartesJS.rangeOK = evaluator.evalExpression(self.domain);
//         var result = (evaluator.evalExpression(self.domain)) ? evaluator.evalExpression(self.expresion) : "Función no definida";

          // se restauran los valores de las variables que tienen el mismo nombre que los parametros de la funcion
          for (var i=0, l=self.params.length; i<l; i++) {
            evaluator.setVariable(self.params[i], paramsTemp[i]);
          }
        
          return result;
        }
        
        return 0;
      }
    } else {
      this.functionExec = function() {
        if (self.numberOfParams == arguments.length) {
          
          // se guardan los valores de las variables que tienen el mismo nombre que los parametros de la funcion
          var paramsTemp = [];
          for (var i=0, l=self.params.length; i<l; i++) {
            paramsTemp[i] = evaluator.getVariable(self.params[i]);
            
            // se asocian los parametros de entrada de la funcion con los nombres de los parametros
            evaluator.setVariable(self.params[i], arguments[i]);
          }
          
          // se evalua el valor de regreso
          var result = evaluator.evalExpression(self.expresion);
          descartesJS.rangeOK = evaluator.evalExpression(self.domain);
//         var result = (evaluator.evalExpression(self.domain)) ? evaluator.evalExpression(self.expresion) : "Función no definida";

          // se restauran los valores de las variables que tienen el mismo nombre que los parametros de la funcion
          for (var i=0, l=self.params.length; i<l; i++) {
            evaluator.setVariable(self.params[i], paramsTemp[i]);
          }
        
          return result;
        }
        
        return 0;
      }
    }
    
    evaluator.setFunction(this.name, this.functionExec);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Function, descartesJS.Auxiliary);

  return descartesJS;
})(descartesJS || {});