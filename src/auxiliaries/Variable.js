/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes variable
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Variable = function(parent, values){
    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);

    var parser = this.evaluator.parser;
 
    this.expresionString = this.expresion;
    this.expresion = parser.parse(this.expresionString);

    if (this.expresion) {
      parser.setVariable(this.id, this.expresion);
    }
    
    if (this.editable) {
      this.registerTextField();
      this.parent.editableRegionVisible = true;
    }    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Variable, descartesJS.Auxiliary);
  
  /**
   * 
   */
  descartesJS.Variable.prototype.registerTextField = function() {
    var container = descartesJS.newHTML("div");

    var label = descartesJS.newHTML("label");
    // underscores are added at the beginning and end to determine the initial size of the label
    label.appendChild( document.createTextNode("___" + this.id + "=___") );
    
    var textField = descartesJS.newHTML("input");
    textField.value = this.expresionString;
    textField.disabled = !(this.editable);

    container.appendChild(label);
    container.appendChild(textField);

    var self = this;
    var parser = self.evaluator.parser;
    textField.onkeydown = function(evt) {
      if (evt.keyCode == 13) {
        self.expresion = parser.parse(this.value);
        
        parser.setVariable(self.id, self.expresion);
        self.parent.update();
      }
    }
    
    var containerTextField = { container: container,  type: "div" };
    this.parent.editableRegion.textFields.push(containerTextField);
  }
  
  return descartesJS;
})(descartesJS || {});
