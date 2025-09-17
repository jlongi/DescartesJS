/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class Calculate {
    /**
     * Descartes calculate action
     * @param {DescartesApp} parent the Descartes application
     * @param {String} parameter the values of the action
     */
    constructor(parent, parameter="") {
      this.parent = parent;

      // replace the semicolon with a newline, since both notations can appear in the expression
      parameter = descartesJS.splitSeparator( (parameter || "").replace(/&squot;/g, "'") );

      // add only the instructions that execute something, i.e. instructions with parsing different of null
      this.inst = parameter.map((parameter_i) => this.parent.evaluator.parser.parse(parameter_i, true)).filter((tmp) => tmp);
    }

    /**
     * Execute the action
     */
    execute() {
      for (let expr of this.inst) {
        this.parent.evaluator.eval(expr);
      }
    }
  }

  descartesJS.Calculate = Calculate;
  return descartesJS;
})(descartesJS || {});
