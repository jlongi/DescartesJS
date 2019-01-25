/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes function
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.JsFunction = function(parent, values){
    this.code = "";
    
    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);

    var evaluator = this.evaluator;
    // var parser = evaluator.parser;

    var parPos = this.id.indexOf("(");
    this.name = this.id.substring(0, parPos);

    this.params = this.id.substring(parPos+1, this.id.indexOf(")"));
    this.params = (this.params === "") ? [] : this.params.split(",");

    this.functionCode = this.code.replace(/\\;/g, ";") + ";\nreturn " + (this.expresion || 0) + ";";
    // this.functionCode = this.functionCode.replace(/getVar/g, "this.getVariable").replace(/setVar/g, "this.setVariable");
// console.log(this.functionCode)
    this.functionExec = new Function(this.params, this.functionCode);
    evaluator.setFunction(this.name, this.functionExec);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.JsFunction, descartesJS.Auxiliary);

  return descartesJS;
})(descartesJS || {});
