/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let evaluator;
  let int_color;

  class Checkbox extends descartesJS.Control {
    /**
     * Descartes checkbox control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the checkbox control
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      self = this;

      self.label_color      = self.label_color      || new descartesJS.Color("e0e4e8", parent.evaluator);
      self.label_text_color = self.label_text_color || new descartesJS.Color("000000", parent.evaluator);

      self.typeCtr = "checkbox";
      self.pressed = values.pressed || false;

      // checkbox or radio button
      self.radio_group = (values.radio_group || "").trim();
      if (self.radio_group !== "") {
        self.typeCtr = "radio";
      }

      self.name_str = self.name;

      // if the name init with single quotes, then scape them with the \u0027 character code
      if ((/^\&squot;.*\&squot;$/).test(self.name)) {
        self.name = self.name.replace("&squot;", "\\u0027");
      }

      // change to the name of the Checkbox with an expression
      if ((/^\[.*\]$/).test(self.name)) {
        self.name = self.parser.parse(self.name.slice(1, -1));
      }
      else {
        self.name = self.parser.parse(`'${self.name.trim()}'`);
      }

      // tabular index
      self.tabindex = ++parent.tabindex;

      // control container
      self.containerControl = descartesJS.newHTML("div", {
        class : "DescartesCheckboxContainer",
        id    : self.id,
      });

      // the checkbox
      self.checkbox = descartesJS.newHTML("input", {
        type     : self.typeCtr,
        id       : self.id + self.typeCtr,
        class    : "DescartesCheckbox",
        tabindex : self.tabindex,
      });

      if (self.radio_group !== "") {
        self.checkbox.setAttribute("name", self.radio_group);
      }
      self.checkbox.internalID = self.id;

      // the label
      self.label = descartesJS.newHTML("canvas", {
        class : "DescartesCheckboxLabel",
      });
      self.label_ctx = self.label.getContext("2d");
      self.ratio = parent.ratio;

      // the dummyLabel
      self.dummyLabel = descartesJS.newHTML("label", {
        "for" : self.id+self.typeCtr,
      });

      self.value = self.evaluator.eval(self.valueExpr);
      self.evaluator.setVariable(self.id, self.value);

      // add the elements to the container
      self.containerControl.appendChild(self.label);
      self.containerControl.appendChild(self.checkbox);
      self.containerControl.appendChild(self.dummyLabel);

      self.addControlContainer(self.containerControl);

      // register the mouse and touch events
      self.addEvents();

      self.init();
    };

    /**
     * Init the checkbox
     */
    init(changeSizePos) {
      self = this;
      evaluator = self.evaluator;

      self.label.innerHTML = evaluator.eval(self.name).toString();

      // find the font size of the checkbox
      self.labelFontSize = (evaluator.eval(self.font_size)>0) ? evaluator.eval(self.font_size) : descartesJS.getFieldFontSize(self.h);
      let labelWidth = Math.max(self.w - self.h, 0);

      //new
      self.text_object = new descartesJS.TextObject({
        parent : {
          decimal_symbol : self.parent.decimal_symbol
        },
        evaluator : evaluator,
        decimals : self.decimals,
        fixed: false,
        align: "left",
        anchor: "center_center",
        width: self.parser.parse("0"),
        font_size: self.parser.parse(""+ self.labelFontSize),
        font_family: self.font_family,
        italics: self.italics,
        bold: self.bold,
      }, self.name_str);
      //new
      self.text_object.draw(self.label_ctx, self.label_text_color.getColor(), 0, 0, true);

      self.containerControl.setAttribute("style", `width:${self.w}px;height:${self.h}px;left:${self.x}px;top:${self.y}px;z-index:${self.zIndex};`);

      if (self.position == "right") {
        self.dummyLabel.setAttribute("style", `position:absolute;width:${self.h}px;height:${self.h}px;left:${labelWidth}px;`);

        self.checkbox.setAttribute("style", `width:${self.h}px;height:${self.h}px;left:${labelWidth}px;`);
        self.label.setAttribute("style", `font-size:${self.labelFontSize}px;width:${labelWidth}px;height:${self.h}px;line-height:${self.h}px;background-color:${self.label_color.getColor()};color:${self.label_text_color.getColor()};`);
      }
      else {
        self.dummyLabel.setAttribute("style", `position:absolute;width:${self.h}px;height:${self.h}px;left:0;`);

        self.checkbox.setAttribute("style", `width:${self.h}px;height:${self.h}px;left:0;`);
        self.label.setAttribute("style", `font-size:${self.labelFontSize}px;width:${labelWidth}px;height:${self.h}px;line-height:${self.h}px;background-color:${self.label_color.getColor()};color:${self.label_text_color.getColor()};left:${self.h}px`);
      }

      self.checkbox.checked = (evaluator.getVariable(self.id) != 0);

      self.label.width  = labelWidth*self.ratio;
      self.label.height = self.h*self.ratio;

      self.update();
    };

    /**
     * Update the checkbox
     */
    update() {
      self = this;
      evaluator = self.evaluator;

      // check if the control is active and visible
      self.activeIfValue = (evaluator.eval(self.activeif) > 0);
      self.drawIfValue   = (evaluator.eval(self.drawif) > 0);

      // enable or disable the control
      self.checkbox.disabled = !self.activeIfValue;

      // hide or show the checkbox control
      self.containerControl.style.display = (self.drawIfValue) ? "block" : "none";

      if ( !(self.parent.animation.playing) || (document.activeElement != self.checkbox)) {
        let oldVal = (evaluator.getVariable(self.id) !== 0) ? 1 : 0;

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

          // register the control value
          evaluator.setVariable(self.id, self.value);
        }
        // update the radio button value
        else {
          self.value = evaluator.getVariable(self.id);
          evaluator.setVariable(self.radio_group, 0);

          let radios = document.querySelectorAll(`[name=${self.radio_group}]`);
          let last_radio_checked = -1;

          if (self.pressed) {
            for (let i=radios.length-1; i>=0; i--) {
              evaluator.setVariable(radios[i].internalID, 0);
              radios[i].checked = false;
            }

            evaluator.setVariable(self.id, 1);
            self.checkbox.checked = true;
            self.value = 1;
            evaluator.setVariable(self.radio_group, self.id);
            self.pressed = 0;
          }
          else {
            for (let i=radios.length-1; i>=0; i--) {
              last_radio_checked = (evaluator.getVariable(radios[i].internalID) != 0) ? i : last_radio_checked;
              evaluator.setVariable(radios[i].internalID, 0);
              radios[i].checked = false;
            }

            if (last_radio_checked >= 0) {
              evaluator.setVariable(radios[last_radio_checked].internalID, 1);
              radios[last_radio_checked].checked = true;
              evaluator.setVariable(self.radio_group, radios[last_radio_checked].internalID);
            }

            self.value = (self.checkbox.checked) ? 1 : 0;
          }
        }

      }

      // update the position and size
      self.updatePositionAndSize();

      //
      self.label_ctx.setTransform(self.ratio, 0, 0, self.ratio, 0, 0);

      // draw the text to get the width
      self.text_object.draw(self.label_ctx, self.label_text_color.getColor(), 0, 0);
      
      self.label_ctx.clearRect(0, 0, self.label.width, self.label.height);

      int_color = self.label_color.getColor();
      if (int_color && (/CanvasGradient|CanvasPattern/).test(int_color.constructor.name)) {
        self.label_ctx.fillStyle = int_color;
        self.label_ctx.fillRect(0, 0, self.label_ctx.canvas.width, self.label_ctx.canvas.height);
      }

      if (self.text_object.textNodes.metrics.w > self.label.width/self.ratio) {
        self.text_object.anchor = "center_left";
        self.text_object.draw(self.label_ctx, self.label_text_color.getColor(), 5, self.label.height/self.ratio/2); 
      }
      else {
        self.text_object.anchor = "center_center";
        self.text_object.draw(self.label_ctx, self.label_text_color.getColor(), self.label.width/self.ratio/2, self.label.height/self.ratio/2);
      }
      self.label_ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    /**
     * Register the mouse and touch events
     */
    addEvents() {
      let self = this;

      // prevent the default events in the label
      self.label.ontouchstart = self.label.onmousedown = self.dummyLabel.onmousedown = descartesJS.preventDefault;

      /*
       * Prevent an error with the focus of a checkbox
       */
      self.checkbox.addEventListener("click", () => {
        self.pressed = true;
        self.updateAndExecAction();
      });
    }
  }

  descartesJS.Checkbox = Checkbox;
  return descartesJS;
})(descartesJS || {});
