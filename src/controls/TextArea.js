/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let evaluator;
  let displaceY;
  let newText;
  let parseAnswer;

  class TextArea extends descartesJS.Control {
    /**
     * Descartes TextArea control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the TextArea control
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      // is needed for the insertAtCursor function
      let self = this;

      self.font_family = values.font_family || "sansserif";
      self.style = values.style || ",PLAIN,";
      self.font_size = values.font_size || 12;

      if (typeof(self.font_size !== "number")) {
        self.font_size = self.evaluator.eval(self.font_size);
      }
  
      self.font = self.font_family + self.style + self.font_size;

      // overwrite scroll
      self.evaluator.setVariable(self.id + "._scroll_x", 0);
      self.evaluator.setVariable(self.id + "._scroll_y", 0);

      // always show in the interior region
      self.region = "interior";

      // tabular index
      self.tabindex = ++parent.tabindex;

      // the answer exist
      if (self.answer) {
        // the answer is encrypted
        if ((/^krypto_/).test(self.answer)) {
          self.answer = (new descartesJS.Krypto()).decode(self.answer.substring(7));
        }

        parseAnswer = self.parent.lessonParser.parseText(self.answer);
      }

      // control container
      self.containerControl = descartesJS.newHTML("div", {
        class      : "DescartesTextAreaContainer",
        id         : self.id,
        spellcheck : "false",
      });

      // the text area
      self.textArea = descartesJS.newHTML("textarea", {
        class      : "DescartesTextArea",
        spellcheck : "false",
      });
      self.textAreaAnswer = descartesJS.newHTML("div", {
        class : "DescartesTextArea",
      });

      // show answer button
      self.showButton = descartesJS.newHTML("div", {
        class : "DJS_Gradient",
      });

      // add the elements to the container
      self.containerControl.appendChild(self.textArea);
      self.containerControl.appendChild(self.textAreaAnswer);
      self.containerControl.appendChild(self.showButton);

      self.cover = descartesJS.newHTML("div", {
        class : "TextfieldCover"
      });
      if (self.keyboard) {
        self.containerControl.appendChild(self.cover);
      }

      self.addControlContainer(self.containerControl);

      self.showAnswer = false;

      self.text = self.rawText || "";

      self.evaluator.setVariable(self.id, self.text);

      let cursor_pos;
      self.evaluator.setFunction(self.id + ".insertAtCursor", function(str) {
        cursor_pos = self.textArea.selectionStart + str.length;
        self.textArea.value = self.textArea.value.substring(0, self.textArea.selectionStart) + str + self.textArea.value.substring(self.textArea.selectionEnd);
        self.textArea.selectionStart = self.textArea.selectionEnd = cursor_pos;
        self.textArea.focus();
        return 0;
      });

      self.evaluator.setFunction(self.id + ".update", () => {
        self.update();
      });

      self.evaluator.setFunction(self.id + ".scrollTo", (num) => {
        self.textArea.scrollTop = num;
      });

      // register the mouse and touch events
      self.addEvents();

      self.init();
    }

    /**
     * Init the text area
     */
    init() {
      self = this;
      
      displaceY = (self.answer) ? 30 : 7;
      evaluator = self.evaluator;

      let newText = self.text.replace(/\\n/g, "\n");

      self.containerControl.setAttribute("style", `width:${self.w}px;height:${self.h}px;left:${self.x}px;top:${self.y}px;z-index:${self.zIndex};`);

      let style_text_area = `width:${self.w-6}px;height:${self.h-displaceY}px;font:${descartesJS.convertFont(self.font)};line-height:${self.font_size}px;`;

      // text area
      self.textArea.setAttribute("style", style_text_area);
      self.textArea.value = newText;

      // text area answer
      self.textAreaAnswer.setAttribute("style", `${style_text_area}display:${(self.showAnswer) ? "block" : "none"};`);
      self.textAreaAnswer.innerHTML = `<span>${self.answer}</span>`;

      // show answer button
      self.showButton.setAttribute("style", `text-align:center;width:20px;height:16px;position:absolute;bottom:4px;right:4px;cursor:pointer;border:1px outset #c0c0c0;display:${(self.answer) ? "block" : "none"};`);
      self.showButton.innerHTML = `<span style="position:relative;top:1px;text-align:center;font:11px ${descartesJS.sansserif_font};">S</span>`;

      self.cover.setAttribute("style", `position:absolute;width:${self.w}px;height:${self.h}px;left:0px;top:0px;`);

      self.update();
    }

    /**
     * Update the text area
     */
    update() {
      self = this;
      evaluator = self.evaluator;
      
      // check if the control is active and visible
      self.activeIfValue = (evaluator.eval(self.activeif) > 0);
      self.drawIfValue   = (evaluator.eval(self.drawif) > 0);

      if (evaluator.getVariable(self.id) !== self.oldValue) {
        self.textArea.value = (evaluator.getVariable(self.id) || "").replace(/\\n/g, "\n");
      }

      newText = (self.textArea.value || "");
      newText = (newText.charAt(newText.length-1) === "\n") ? newText.substring(0, newText.length-1) : newText;
      newText = newText.replace(/\n/g, "\\n").replace(/\s/g, " ");

      evaluator.setVariable(self.id, newText);

      self.oldFieldValue = newText;
      self.oldValue = evaluator.getVariable(self.id);

      // enable or disable the control
      (self.activeIfValue) ? self.textArea.removeAttribute("disabled") : self.textArea.setAttribute("disabled", true);

      // hide or show the text field control
      self.containerControl.style.display = (self.drawIfValue) ? "block" : "none";

      self.textArea.style["overflow-x"] = (evaluator.getVariable(self.id + "._scroll_x") > 0) ? "auto" : "unset";
      self.textArea.style["overflow-y"] = (evaluator.getVariable(self.id + "._scroll_y") > 0) ? "auto" : "unset";

      // update the position and size
      self.updatePositionAndSize();
    }

    changeValue(val) {
      this.textArea.value = val;
      this.update();
    }

    /**
     * Register the mouse and touch events
     */
    addEvents() {
      let self = this;

      /**
       * @param {Event} evt
       * @private
       */
      function onMouseDown(evt) {
        evt.preventDefault();
        self.showAnswer = !self.showAnswer;
        self.textAreaAnswer.style.display = (self.showAnswer) ? "block" : "none";
        self.showButton.childNodes[0].childNodes[0].textContent = (self.showAnswer) ? "T" : "S";
        self.textArea.blur();
      }
      self.showButton.addEventListener("mousedown", onMouseDown);

      self.showButton.onmouseup = self.showButton.onmouseout = (evt) => { evt.preventDefault(); };
      

      function getSelection() {
        self.cursorInd = window.getSelection().focusOffset;
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
