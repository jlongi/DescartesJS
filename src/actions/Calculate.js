/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una accion de calcular de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el parametro de la accion
   */
  descartesJS.Calculate = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
    
    // variables auxiliares
    var evaluator = this.evaluator;
    var parser = evaluator.parser;

    //se reemplazan los ; (punto y coma) por el salto de linea, ya que pueden aparecer ambas notaciones en la expresion
    this.parameter = parameter.replace(/&squot;/g, "'");
    this.parameter = this.parameter.replace(/;/g, "\\n");
    this.parameter = this.parameter.split("\\n") || [""];

    // se agregan solo las instrucciones que ejecuten algo, es decir, aquellas cuyo parseo no devuelven null
    var tmpParameter = [];
    var tmp;
    for (var i=0, l=this.parameter.length; i<l; i++) {
      tmp = parser.parse(this.parameter[i], true);
      if (tmp) {
        tmpParameter.push(tmp);
      }
    }
    this.parameter = tmpParameter;

    // la accion a ejecutar
    this.actionExec = function() {
      for (var i=0, l=this.parameter.length; i<l; i++) {
        evaluator.evalExpression(this.parameter[i]);
      }
    }

  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Calculate, descartesJS.Action);
  
  /**
   * Ejecuta la accion
   */
  descartesJS.Calculate.prototype.execute = function() {
    this.actionExec();
  }

  return descartesJS;
})(descartesJS || {});