/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class Variable extends descartesJS.Auxiliary {
    /**
     * Descartes variable
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the auxiliary
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

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
    
    /**
     * 
     */
    registerTextField() {
      let container = descartesJS.newHTML("div");
      let label = descartesJS.newHTML("label");

      // underscores are added at the beginning and end to determine the initial size of the label
      label.appendChild( document.createTextNode("___" + this.id + "=___") );
      
      let textField = descartesJS.newHTML("input");
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

      this.parent.editableRegion.textFields.push({ container:container, type:"div" });
    }
  }

  descartesJS.Variable = Variable;  
  return descartesJS;
})(descartesJS || {});
