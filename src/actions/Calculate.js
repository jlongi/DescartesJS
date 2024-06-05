/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class Calculate extends descartesJS.Action {
    /**
     * Descartes calculate action
     * @param {DescartesApp} parent the Descartes application
     * @param {String} parameter the values of the action
     */
    constructor(parent, parameter = "") {
      super(parent);

      // replace the semicolon with a newline, since both notations can appear in the expression
      parameter = descartesJS.splitSeparator( (parameter || "").replace(/&squot;/g, "'") );

      // add only the instructions tha execute something, i.e. instructions with parsing different of null
      this.inst = [];
      let tmp;
      for (let i=0, l=parameter.length; i<l; i++) {
        tmp = this.evaluator.parser.parse(parameter[i], true);
        if (tmp) {
          this.inst.push(tmp);
        }
      }
    }

    /**
     * Execute the action
     */
    execute() {
      for (let i=0, l=this.inst.length; i<l; i++) {
        this.evaluator.eval(this.inst[i]);
      }
    }
  }

  descartesJS.Calculate = Calculate;
  return descartesJS;
})(descartesJS || {});
