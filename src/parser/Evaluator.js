/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;

  class Evaluator {
    /**
     * Descartes evaluator
     * @parent {DescartesApp} parent the parent associated with the evaluator
     */
    constructor(parent) {
      this.parent = parent;
      this.parser = new descartesJS.Parser(this);
      this.variables = this.parser.variables;
      this.functions = this.parser.functions;
      this.vectors   = this.parser.vectors;
      this.matrices  = this.parser.matrices;
      this.definitions = this.parser.definitions;
    }

    /**
     * 
     */
    setDefinition(name, value) {
      this.definitions[name] = value;
    }
    /**
     * 
     */
    getDefinition(name) {
      return this.definitions[name];
    }

    /**
     * Set the value to a variable
     * @param {String} name the name of the variable to set
     * @param {Object} value the value of the variable to set
     */
    setVariable(name, value) {
      this.variables[name] = value;
    }

    /**
     * Get the value to a variable
     * @param {String} name the name of the variable to get the value
     */
    getVariable(name) {
      return this.variables[name];
    }

    /**
     * Set the value of a position in a vector
     * @param {String} name the name of the vector to set
     * @param {Number} pos the position in the vector to set
     * @param {Object} value the value of the vector to set
     */
    setVector(name, pos, value) {
      pos = (pos<0) ? 0 : MathFloor(pos);
      this.vectors[name][pos] = value;
    }

    /**
     * Get the value to a vector
     * @param {String} name the name of the vector to get the value
     */
    getVector(name, pos) {
      pos = (pos < 0) ? 0 : MathFloor(pos);
      return this.vectors[name][pos];
    }

    /**
     * Set the value of a position in a matrix
     * @param {String} name the name of the matrix to set
     * @param {Number} pos1 the row position in the matrix to set
     * @param {Number} pos2 the column position in the matrix to set
     * @param {Object} value the value of the matrix to set
     */
    setMatrix(name, pos1, pos2, value) {
      pos1 = (pos1 < 0) ? 0 : MathFloor(pos1);
      pos2 = (pos2 < 0) ? 0 : MathFloor(pos2);
      if (this.matrices[name][pos1] == undefined) {
        this.matrices[name][pos1] = [];
      }
      this.matrices[name][pos1][pos2] = value;
    }

    /**
     * Get the value to a matrix
     * @param {String} name the name of the matrix to get the value
     */
    getMatrix(name, pos1, pos2) {
      pos1 = (pos1<0) ? 0 : MathFloor(pos1);
      pos2 = (pos2<0) ? 0 : MathFloor(pos2);
      return this.matrices[name][pos1][pos2];
    }

    /**
     * Set the value to a function
     * @param {String} name the name of the function to set
     * @param {Object} value the value of the function to set
     */
    setFunction(name, value) {
      this.functions[name] = value;
    }

    /**
     * Get a function
     * @param {String} name the name of the function to get
     */
    getFunction(name) {
      return this.functions[name];
    }

    /**
     *
     */
    eval(expr) {
      return (expr) ? expr.evaluate(this) : 0;
    }
  }

  // evaluator used in a range evaluation
  descartesJS.externalEvaluator = new Evaluator();

  descartesJS.Evaluator = Evaluator;
  return descartesJS;
})(descartesJS || {});
