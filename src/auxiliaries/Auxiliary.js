/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * Un auxiliar de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen un auxiliar de descartes
   */
  descartesJS.Auxiliary = function(parent, values) {
    /**
     * La aplicacion de descartes a la que corresponde el auxiliar
     * type DescartesApp
     * @private
     */
    this.parent = parent;
    this.evaluator = this.parent.evaluator;

    var parser = parent.evaluator.parser;

    /**
     * El identificador del auxiliar
     * type String
     * @private
     */
    this.id = "";
    
    /**
     * La expresion del auxiliar
     * type String
     * @private
     */
    this.expresion = "";

    /**
     * La forma en la que se evalua el auxiliar
     * type String
     * @private
     */
    this.evaluate = "onlyOnce";

    /**
     * El numero de elementos de un vector
     * type Number
     * @private
     */
    this.size = parser.parse("3");

    /**
     * El numero de renglones de una matriz
     * type Number
     * @private
     */
    this.rows = parser.parse("3");

    /**
     * El numero de columnas de una matriz
     * type Number
     * @private
     */
    this.columns = parser.parse("3");

    // se recorre values para reemplazar los valores iniciales del auxiliar
    for (var propName in values) {
      // solo se verifican las propiedades propias del objeto values
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }
  }  
  
  /**
   * Inicia el algoritmo
   */
  descartesJS.Auxiliary.prototype.firstRun = function() { }

  /**
   * Actualiza los valores del auxiliar
   */
  descartesJS.Auxiliary.prototype.update = function() { }
  
  /**
   * Divide la expresion utilizando el punto y coma como delimitador y solo considera solo las expresiones no vacias
   * @param [DescartesJS.Parser] parser es el objeto de parseo de expresiones
   * @param [String] expression es la expresion a dividir
   * @return [Node] regresa una lista de expresiones parseadas
   */
  descartesJS.Auxiliary.prototype.splitInstructions = function(parser, expression) {
    var tmp;
    var tmpExpression = [];

    // se dividen todas las expresiones de la expresion separadas por punto y coma y se parsean
    if (expression) {
      expression = expression.split(";");
    } else {
      expression = [""];
    }
    
    // se agregan solo las instrucciones que ejecuten algo, es decir, aquellas cuyo parseo no devuelven null
    for (var i=0, l=expression.length; i<l; i++) {
      tmp = parser.parse(expression[i], true);
      if (tmp) {
        tmpExpression.push(tmp);
      }
    }
    
    return tmpExpression;
  }

  return descartesJS;
})(descartesJS || {});