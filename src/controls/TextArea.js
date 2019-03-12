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
    constructor(parent, values){
      // call the parent constructor
      super(parent, values);

      this.font_family = values.font_family || "Monospaced";
      this.style = values.style || ",PLAIN,";
      this.font_size = values.font_size || 12;

      if (typeof(this.font_size !== "number")) {
        this.font_size = this.evaluator.eval(this.font_size);
      }
  
      this.font = this.font_family + this.style + this.font_size;

      // always show in the interior region
      this.region = "interior";

      // tabular index
      this.tabindex = ++this.parent.tabindex;

      // la respuesta existe
      if (this.answer) {
        // la respuesta esta encriptada
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
      this.textArea = descartesJS.newHTML("div", {
        class           : "DescartesTextAreaContainer",
        contenteditable : "true",
      });
      this.textAreaAnswer = descartesJS.newHTML("div", {
        class : "DescartesTextAreaContainer",
      });

      // show answer button
      this.showButton = descartesJS.newHTML("div");

      // active cover
      this.activeCover = descartesJS.newHTML("div");

      // add the elements to the container
      this.containerControl.appendChild(this.textArea);
      this.containerControl.appendChild(this.textAreaAnswer);
      this.containerControl.appendChild(this.showButton);
      this.containerControl.appendChild(this.activeCover);

      this.addControlContainer(this.containerControl);

      this.showAnswer = false;

      // plain text
      if ( (this.text == undefined) || (this.text.type == "simpleText")) {
        this.text = this.rawText || "";
      }
      // rtf text
      else {
        if (this.text.hasFormula) {
          this.text = this.rawText;
        }
        else {
          this.text = this.text.toHTML();
        }
      }

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

      this.drawButton();

      var self = this;
      var sel;
      var range;
      var newText;
      this.evaluator.setFunction(this.id + ".insertAtCursor", function(str) {
        sel = window.getSelection();
        if (sel && sel.getRangeAt && sel.rangeCount) {
          newText = document.createTextNode(str);
          range = sel.getRangeAt(0);
          range.deleteContents();
          range.insertNode(newText);
          
          // move the caret to the end of the inserted text
          range.setStart(newText, newText.length);
          range.setEnd(newText, newText.length);
          sel.removeAllRanges();
          sel.addRange(range);

          self.textArea.focus();
        }
        return 0;
      });

      this.evaluator.setFunction(this.id + ".update", function() {
        self.update();
      })

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

      var newText;

      if (this.text.match(/<span/)) {
        newText = this.text;
      }
      else {
        newText = this.text.replace(/\\n/g, "<br/>");
      }

      this.containerControl.setAttribute("style", `width:${this.w}px;height:${this.h}px;left:${this.x}px;top:${this.y}px;z-index:${this.zIndex};`);
      this.containerControl.style.display = (evaluator.eval(this.drawif) > 0) ? "block" : "none";

      // text area
      this.textArea.setAttribute("style", `padding:5px;width:${this.w-4}px;height:${this.h-displaceY}px;left:2px;top:2px;background-color:white;text-align:left;font:${descartesJS.convertFont(this.font)};line-height:${this.font_size}px;`);
      this.textArea.innerHTML = newText;

      // text area answer
      this.textAreaAnswer.setAttribute("style", `width:${this.w-8}px;height:${this.h-displaceY}px;left:4px;top:4px;background-color:white;text-align:left;font:${descartesJS.convertFont(this.font)};display:${(this.showAnswer) ? "block" : "none"};`);
      this.textAreaAnswer.innerHTML = "<span style='position:relative;top:10px;left:10px;white-space:nowrap;'>" + this.answer + "</span>";

      // show answer button
      this.showButton.setAttribute("style", `width:20px;height:16px;position:absolute;bottom:4px;right:4px;cursor:pointer;background-image:url(${this.imageUnPush});display:${(this.answer) ? "block" : "none"};`);
      this.showButton.innerHTML = "<span style='position: relative; top: 2px; text-align: center; font: 9px Arial'> S </span>";

      this.activeCover.setAttribute("style", `position:absolute;width:${this.w}px;height:${this.h}px;left:${this.x}px;top:${this.y}px;`);

      this.update();
    }

    /**
     * Draw the show/hide button
     */
    drawButton() {
      var w = 20;
      var h = 16;

      var canvas = descartesJS.newHTML("canvas", {
        width  : w,
        height : h,
      });

      var ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;

      this.canvas = canvas;
      this.ctx = ctx;
      this.createGradient(w, h);

      ctx.lineWidth = 1;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = this.linearGradient;
      ctx.fillRect(0, 0, w, h);
      descartesJS.drawLine(ctx, w-1, 0, w-1, h, "rgba(0,0,0,"+(0x80/255)+")");
      descartesJS.drawLine(ctx, 0, 0, 0, h, "rgba(0,0,0,"+(0x18/255)+")");
      descartesJS.drawLine(ctx, 1, 0, 1, h, "rgba(0,0,0,"+(0x08/255)+")");
      this.imageUnPush = canvas.toDataURL();

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = this.linearGradient;
      ctx.fillRect(0, 0, w, h);
      descartesJS.drawLine(ctx, 0, 0, 0, h-2, "gray");
      descartesJS.drawLine(ctx, 0, 0, w-1, 0, "gray");
      ctx.fillStyle = "rgba(0, 0, 0,"+(0x18/255)+")";
      ctx.fillRect(0, 0, this.w, this.h);

      this.imagePush = canvas.toDataURL();
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
        this.textArea.innerText = (evaluator.getVariable(this.id) || "").replace(/\\n/g, "\n");
      }

      newText = (this.textArea.innerText || "");
      newText = (newText.charAt(newText.length-1) === "\n") ? newText.substring(0, newText.length-1) : newText;
      newText = newText.replace(/\n/g, "\\n").replace(/\s/g, " ");

      evaluator.setVariable(this.id, newText);

      this.oldFieldValue = newText;
      this.oldValue = evaluator.getVariable(this.id);

      // enable or disable the control
      this.activeCover.style.display = (this.activeIfValue) ? "none" : "block";

      // hide or show the text field control
      this.containerControl.style.display = (this.drawIfValue) ? "block" : "none";

      // update the position and size
      this.updatePositionAndSize();
    }

    /**
     * Register the mouse and touch events
     */
    addEvents() {
      var self = this;

      /**
       * @param {Event} evt
       * @private
       */
      function onMouseDown(evt) {
        evt.preventDefault();
        self.showAnswer = !self.showAnswer;
        self.textAreaAnswer.style.display = (self.showAnswer) ? "block" : "none";
        self.showButton.childNodes[0].childNodes[0].textContent = (self.showAnswer) ? "T" : "S";
        self.showButton.style.backgroundImage = "url(" + self.imagePush + ")";
      }
      this.showButton.addEventListener("mousedown", onMouseDown);

      /**
       * @param {Event} evt
       * @private
       */
      function onMouseUp(evt) {
        evt.preventDefault();
        self.showButton.style.backgroundImage = "url(" + self.imageUnPush + ")";
      }
      this.showButton.addEventListener("mouseup",  onMouseUp);
      this.showButton.addEventListener("mouseout", onMouseUp);

      function getSelection() {
        var selection = window.getSelection();
        self.cursorInd = selection.focusOffset;
      }
      this.textArea.addEventListener("blur", getSelection);

      // prevent the paste of content with style
      this.textArea.addEventListener("paste", (evt) => {
        evt.preventDefault();
        document.execCommand("insertHTML", false, evt.clipboardData.getData("text/plain"));
      });
    }
  }

  descartesJS.TextArea = TextArea;
  return descartesJS;
})(descartesJS || {});
