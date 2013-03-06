/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una constante de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la constante
   */
  descartesJS.Constant = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Auxiliary.call(this, parent, values);
    
    this.expresion = this.evaluator.parser.parse(this.expresion);
    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Constant, descartesJS.Auxiliary);
  
  /**
   * Actualiza la constante
   */
  descartesJS.Constant.prototype.update = function() {
    this.evaluator.setVariable(this.id, this.evaluator.evalExpression(this.expresion));
  }

  return descartesJS;
})(descartesJS || {});