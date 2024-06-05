/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var displaceY;
  var newText;

  class TextArea extends descartesJS.Control {
    /**
     * Descartes TextArea control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the TextArea control
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.font_family = values.font_family || "sansserif";
      this.style = values.style || ",PLAIN,";
      this.font_size = values.font_size || 12;

      if (typeof(this.font_size !== "number")) {
        this.font_size = this.evaluator.eval(this.font_size);
      }
  
      this.font = this.font_family + this.style + this.font_size;

      // overwrite scroll
      this.evaluator.setVariable(this.id + "._scroll_x", 0);
      this.evaluator.setVariable(this.id + "._scroll_y", 0);

      // always show in the interior region
      this.region = "interior";

      // tabular index
      this.tabindex = ++this.parent.tabindex;

      // the answer exist
      if (this.answer) {
        // the answer is encrypted
        if (this.answer.match("krypto_")) {
          this.answer = (new descartesJS.Krypto()).decode(this.answer.substring(7));
        }

        var parseAnswer = this.parent.lessonParser.parseText(this.answer);
      }

      // control container
      this.containerControl = descartesJS.newHTML("div", {
        class      : "DescartesTextAreaContainer",
        id         : this.id,
        spellcheck : "false",
      });

      // the text area
      this.textArea = descartesJS.newHTML("textarea", {
        class      : "DescartesTextAreaContainer",
        spellcheck : "false",
      });
      this.textAreaAnswer = descartesJS.newHTML("div", {
        class : "DescartesTextAreaContainer",
      });

      // show answer button
      this.showButton = descartesJS.newHTML("div", {
        class : "DJS_Gradient",
      });

      // add the elements to the container
      this.containerControl.appendChild(this.textArea);
      this.containerControl.appendChild(this.textAreaAnswer);
      this.containerControl.appendChild(this.showButton);

      this.cover = descartesJS.newHTML("div", {
        class : "TextfieldCover"
      });
      if (this.keyboard) {
        this.containerControl.appendChild(this.cover);
      }

      this.addControlContainer(this.containerControl);

      this.showAnswer = false;

      this.text = this.rawText || "";

      // rtf answer
      if ((parseAnswer) && (parseAnswer.type !== "simpleText")) {
        if (!this.text.hasFormula) {
          this.answer = parseAnswer.toHTML();
        }
        else {
          this.answer = "";
        }
      }

      this.evaluator.setVariable(this.id, this.text);

      var self = this;
      var cursor_pos;
      this.evaluator.setFunction(this.id + ".insertAtCursor", function(str) {
        cursor_pos = self.textArea.selectionStart + str.length;
        self.textArea.value = self.textArea.value.substring(0, self.textArea.selectionStart) + str + self.textArea.value.substring(self.textArea.selectionEnd);
        self.textArea.selectionStart = self.textArea.selectionEnd = cursor_pos;
        self.textArea.focus();
        return 0;
      });

      this.evaluator.setFunction(this.id + ".update", function() {
        self.update();
      });

      this.evaluator.setFunction(this.id + ".scrollTo", function(num) {
        self.textArea.scrollTop = num;
      });

      // register the mouse and touch events
      this.addEvents();

      this.init();
    }

    /**
     * Init the text area
     */
    init() {
      displaceY = (this.answer) ? 28 : 4;
      evaluator = this.evaluator;

      var newText = this.text.replace(/\\n/g, "\n");

      this.containerControl.setAttribute("style", `width:${this.w}px;height:${this.h}px;left:${this.x}px;top:${this.y}px;z-index:${this.zIndex};`);

      let style_text_area = `padding:5px;width:${this.w-4}px;height:${this.h-displaceY}px;left:2px;top:2px;background-color:white;text-align:left;font:${descartesJS.convertFont(this.font)};line-height:${this.font_size}px;`;

      // text area
      this.textArea.setAttribute("style", style_text_area);
      this.textArea.value = newText;

      // text area answer
      this.textAreaAnswer.setAttribute("style", `${style_text_area}display:${(this.showAnswer) ? "block" : "none"};`);
      this.textAreaAnswer.innerHTML = `<span>${this.answer}</span>`;

      // show answer button
      this.showButton.setAttribute("style", `width:20px;height:16px;position:absolute;bottom:4px;right:4px;cursor:pointer;border:1px outset #f0f8ff;display:${(this.answer) ? "block" : "none"};`);
      this.showButton.innerHTML = `<span style="position:relative;top:1px;text-align:center;font:11px ${descartesJS.sansserif_font};">S</span>`;

      this.cover.setAttribute("style", `position:absolute;width:${this.w}px;height:${this.h}px;left:0px;top:0px;`);

      this.update();
    }

    /**
     * Update the text area
     */
    update() {
      evaluator = this.evaluator;
      
      // check if the control is active and visible
      this.activeIfValue = (evaluator.eval(this.activeif) > 0);
      this.drawIfValue = (evaluator.eval(this.drawif) > 0);

      if (evaluator.getVariable(this.id) !== this.oldValue) {
        this.textArea.value = (evaluator.getVariable(this.id) || "").replace(/\\n/g, "\n");
      }

      newText = (this.textArea.value || "");
      newText = (newText.charAt(newText.length-1) === "\n") ? newText.substring(0, newText.length-1) : newText;
      newText = newText.replace(/\n/g, "\\n").replace(/\s/g, " ");

      evaluator.setVariable(this.id, newText);

      this.oldFieldValue = newText;
      this.oldValue = evaluator.getVariable(this.id);

      // enable or disable the control
      (this.activeIfValue) ? this.textArea.removeAttribute("disabled") : this.textArea.setAttribute("disabled", true);

      // hide or show the text field control
      this.containerControl.style.display = (this.drawIfValue) ? "block" : "none";

      this.textArea.style["overflow-x"] = (evaluator.getVariable(this.id + "._scroll_x") > 0) ? "auto" : "unset";
      this.textArea.style["overflow-y"] = (evaluator.getVariable(this.id + "._scroll_y") > 0) ? "auto" : "unset";

      // update the position and size
      this.updatePositionAndSize();
    }

    changeValue(val) {
      this.textArea.value = val;
      this.update();
    }

    /**
     * Register the mouse and touch events
     */
    addEvents() {
      var self = this;

      self.cover.oncontextmenu = function() { return false; };

      /**
       * @param {Event} evt
       * @private
       */
      function onMouseDown(evt) {
        evt.preventDefault();
        self.showAnswer = !self.showAnswer;
        self.textAreaAnswer.style.display = (self.showAnswer) ? "block" : "none";
        self.showButton.childNodes[0].childNodes[0].textContent = (self.showAnswer) ? "T" : "S";
      }
      self.showButton.addEventListener("mousedown", onMouseDown);

      /**
       * @param {Event} evt
       * @private
       */
      function onMouseUp(evt) {
        evt.preventDefault();
      }
      self.showButton.addEventListener("mouseup",  onMouseUp);
      self.showButton.addEventListener("mouseout", onMouseUp);

      function getSelection() {
        var selection = window.getSelection();
        self.cursorInd = selection.focusOffset;
      }
      self.textArea.addEventListener("blur", getSelection);

      // prevent the paste of content with style
      self.textArea.addEventListener("paste", (evt) => {
        evt.preventDefault();
        document.execCommand("insertHTML", false, evt.clipboardData.getData("text/plain").replace(/\n/g, "<br>"));
      });

      self.textArea.addEventListener("keydown", function(evt) {
        if ((evt.key === "PageDown") || (evt.key === "PageUp")) {
          evt.stopPropagation();
          evt.preventDefault();
        }
      });

      self.cover.addEventListener("pointerdown", function(evt) {
        let pos = self.evaluator.eval(self.kbexp);

        if (self.activeIfValue) {
          self.parent.keyboard.show(
            self,
            self.kblayout, 
            pos[0][0] || 0,
            pos[0][1] || 0,
            self.id, 
            self.textArea, 
            true
          );
        }
      });
    }
  }

  descartesJS.TextArea = TextArea;
  return descartesJS;
})(descartesJS || {});
