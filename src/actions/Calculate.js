/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes calculate action
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} parameter the values of the action
   */
  descartesJS.Calculate = function(parent, parameter) {
    // call the parent constructor
    descartesJS.Action.call(this, parent, parameter);

    var evaluator = this.evaluator;
    var parser = evaluator.parser;

    // replace the semicolon with a newline, since both notations can appear in the expression
    parameter = parameter || "";
    parameter = parameter.replace(/&squot;/g, "'");
    parameter = descartesJS.splitSeparator(parameter);

    // add only the instructions tha execute something, i.e. instructions with parsing different of null
    var tmpParameter = [];
    var tmp;
    for (var i=0, l=parameter.length; i<l; i++) {
      tmp = parser.parse(parameter[i], true);
      if (tmp) {
        tmpParameter.push(tmp);
      }
    }

    var i;
    var l = tmpParameter.length;
    /**
     * Execute the action
     */
    this.execute = function() {
      for (i=0; i<l; i++) {
        evaluator.eval(tmpParameter[i]);
      }
    }

  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Calculate, descartesJS.Action);

  return descartesJS;
})(descartesJS || {});