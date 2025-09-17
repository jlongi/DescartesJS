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

      let evaluator = this.evaluator;
  
      this.expresionString = this.expresion;
      this.expresion = evaluator.parser.parse(this.expresionString);

      if (this.expresion) {
        evaluator.setVariable(this.id, this.expresion);
      }
      
      if (this.editable) {
        this.registerTextField();
        parent.editableRegionVisible = true;
      }    
    }
    
    /**
     * 
     */
    registerTextField() {
      let self = this;
      let evaluator = self.evaluator;

      let container = descartesJS.newHTML("div");
      let label = descartesJS.newHTML("label");

      // underscores are added at the beginning and end to determine the initial size of the label
      label.appendChild( document.createTextNode(`___${self.id}=___`) );
      
      let textField = descartesJS.newHTML("input");
      textField.value = self.expresionString;
      textField.disabled = !self.editable;

      container.appendChild(label);
      container.appendChild(textField);

      textField.onkeydown = function(evt) {
        if (evt.keyCode == 13) {
          self.expresion = parser.parse(this.value);
          evaluator.setVariable(self.id, self.expresion);
          self.parent.update();
        }
      }

      self.parent.editableRegion.textFields.push({ container:container, type:"div" });
    }
  }

  descartesJS.Variable = Variable;  
  return descartesJS;
})(descartesJS || {});
