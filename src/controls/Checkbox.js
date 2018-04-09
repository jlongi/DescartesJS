/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;

  var Checkbox = (function() {
    /**
     * Descartes checkbox control
     * @constructor
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the checkbox control
     */
    function Checkbox(parent, values){
      var self = this;

      self.radio_group = "";
      self.typeCtr = "checkbox";
      self.pressed = false;

      // call the parent constructor
      descartesJS.Control.call(self, parent, values);

      // checkbox or radiobutton
      self.radio_group = self.radio_group.trim();
      if (self.radio_group !== "") {
        self.typeCtr = "radio";
      }

      // modification to change the name of the Checkbox with an expression
      if ((self.name.charAt(0) === "[") && (self.name.charAt(self.name.length-1) === "]")) {
        self.name = self.parser.parse(self.name.substring(1, self.name.length-1));
      }
      else {
        self.name = self.parser.parse("'" + self.name.trim() + "'");
      }

      // tabular index
      self.tabindex = ++self.parent.tabindex;

      // control container
      self.containerControl = document.createElement("div");

      // the checkbox
      self.checkbox = document.createElement("input");
      self.checkbox.setAttribute("type", self.typeCtr);
      if (self.radio_group !== "") {
        self.checkbox.setAttribute("name", self.radio_group);
      }
      self.checkbox.internalID = this.id;
        
      // the label
      self.label = document.createElement("label");

      // the dummyLabel
      self.dummyLabel = document.createElement("label");

      self.value = self.evaluator.eval(self.valueExpr);

      // add the elements to the container
      self.containerControl.appendChild(self.label);
      self.containerControl.appendChild(self.checkbox);
      self.containerControl.appendChild(self.dummyLabel);

      self.addControlContainer(self.containerControl);

      // register the mouse and touch events
      self.addEvents();

      self.init();
    };

    ////////////////////////////////////////////////////////////////////////////////////
    // create an inheritance of Control
    ////////////////////////////////////////////////////////////////////////////////////
    descartesJS.extend(Checkbox, descartesJS.Control);

    /**
     * Init the checkbox
     */
    Checkbox.prototype.init = function(changeSizePos) {
      var self = this;
      evaluator = self.evaluator;

      self.label.innerHTML = evaluator.eval(self.name).toString();

      // find the font size of the checkbox
      self.labelFontSize = descartesJS.getFieldFontSize(self.h);
      var labelWidth = Math.max(self.w - self.h, 0);

      self.containerControl.setAttribute("class", "DescartesCheckboxContainer");
      self.containerControl.setAttribute("style", "width: " + self.w + "px; height: " + self.h + "px; left: " + self.x + "px; top: " + self.y + "px; z-index: " + self.zIndex + ";");

      self.dummyLabel.setAttribute("style", "position:absolute; width : " + self.h + "px; height : " + self.h + "px; left: " + labelWidth + "px;");
      self.dummyLabel.setAttribute("for", self.id+self.typeCtr);

      self.checkbox.setAttribute("type", self.typeCtr);
      self.checkbox.setAttribute("id", self.id+self.typeCtr);
      self.checkbox.setAttribute("class", "DescartesCheckbox");
      self.checkbox.setAttribute("style", "width : " + self.h + "px; height : " + self.h + "px; left: " + labelWidth + "px;");
      self.checkbox.setAttribute("tabindex", self.tabindex);
      self.checkbox.checked = (self.value != 0);

      self.label.setAttribute("class", "DescartesCheckboxLabel");
      self.label.setAttribute("style", "font-size:" + self.labelFontSize + "px; width: " + labelWidth + "px; height: " + self.h + "px; line-height: " + self.h + "px;");
      
      // register the control value
      self.evaluator.setVariable(self.id, self.value);
     
      self.update();
    };

    /**
     * Update the checkbox
     */
    Checkbox.prototype.update = function() {
      var self = this;
      evaluator = self.evaluator;

      self.label.innerHTML = evaluator.eval(self.name).toString();

      // check if the control is active and visible
      self.activeIfValue = (evaluator.eval(self.activeif) > 0);
      self.drawIfValue = (evaluator.eval(self.drawif) > 0);

      // enable or disable the control
      self.checkbox.disabled = !self.activeIfValue;

      // hide or show the checkbox control
      self.containerControl.style.display = (self.drawIfValue) ? "block" : "none";

      if ( !(self.parent.animation.playing) || (document.activeElement != self.checkbox)) {
        var oldVal = (evaluator.getVariable(self.id) !== 0) ? 1 : 0;
        
        // update the checkbox value
        if (self.radio_group === "") {
          if (self.pressed) {
            self.value = (self.checkbox.checked) ? 1 : 0;
            self.pressed = false;
          }
          else {
            self.value = oldVal;
            self.checkbox.checked = (self.value !== 0);
          }
        }
        // update the radiobutton value
        else {
          self.value = (self.checkbox.checked) ? 1 : 0;
          if (self.pressed) {
            evaluator.setVariable(self.radio_group, self.id);
            self.pressed = false;
          }
          
          // if (self.pressed) {
            // var radios = document.querySelectorAll("[name="+self.radio_group+"]");
            // for (var i=radios.length-1; i>=0; i--) {
            //   evaluator.setVariable(radios[i].internalID, 0);
            // }
            // self.value = 1;
            // self.pressed = false;
          // }
          // else {
          //   self.value = oldVal;
          //   self.checkbox.checked = (self.value !== 0);
          //   var radios = document.querySelectorAll("[name="+self.radio_group+"]");
          //   for (var i=radios.length-1; i>=0; i--) {
          //     if (radios[i].checked === false) {
          //       evaluator.setVariable(radios[i].internalID, 0);
          //     }
          //   }
          // }
        }

        // register the control value
        evaluator.setVariable(self.id, self.value);
      }

      // update the position and size
      self.updatePositionAndSize();
    }

    /**
     * Register the mouse and touch events
     */
    Checkbox.prototype.addEvents = function() {
      var self = this;

      // prevent the context menu display
      self.checkbox.oncontextmenu = self.label.oncontextmenu = self.dummyLabel.oncontextmenu = function() { return false; };

      // prevent the default events int the label
      self.label.addEventListener("touchstart", descartesJS.preventDefault);
      self.label.addEventListener("mousedown", descartesJS.preventDefault);
      self.dummyLabel.addEventListener("touchstart", descartesJS.preventDefault);
      self.dummyLabel.addEventListener("mousedown", descartesJS.preventDefault);

      /*
      * Prevent an error with the focus of a checkbox
      */
      self.checkbox.addEventListener("click", function(evt) {
        self.pressed = true;
        self.updateAndExecAction();
      });
    }

    return Checkbox;
  })();
  descartesJS.Checkbox = Checkbox;

  return descartesJS;
})(descartesJS || {});