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
  descartesJS.Variable = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Auxiliary.call(this, parent, values);
    
    var parser = this.evaluator.parser;
 
    this.expresionString = this.expresion;
    this.expresion = parser.parse(this.expresionString);

    if (this.expresion) {
      parser.setVariable(this.id, this.expresion);
    }
    
    if (this.editable) {
      this.registerTextField();
    }    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Variable, descartesJS.Auxiliary);
  
  /**
   * 
   */
  descartesJS.Variable.prototype.registerTextField = function() {
    var container = document.createElement("div");

    var label = document.createElement("label");
    label.appendChild( document.createTextNode("_" + this.id + "=_") ); // se agregan guiones bajo al principio y final para determinarl el tama;o inicial de la etiqueta
    
    var textField = document.createElement("input");
    textField.value = this.expresionString;
    textField.disabled = !(this.editable);

    container.appendChild(label);
    container.appendChild(textField);

    var self = this;
    textField.onkeydown = function(evt) {
      if (evt.keyCode == 13) {
        self.expresion = self.evaluator.parser.parse(this.value);
        self.evaluator.parser.setVariable(self.id, self.expresion)
        self.parent.update();
      }
    }
    
    var containerTextField = { container: container,  type: "div" };
    this.parent.editableRegion.textFields.push(containerTextField);
  }
  
  return descartesJS;
})(descartesJS || {});