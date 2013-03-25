/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var evaluator;
  var displaceY;

  /**
   * Descartes scrollbar control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the scrollbar control
   */
  descartesJS.TextArea = function(parent, values){
    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    // always show in the interior region
    this.region = "interior";

    // tabular index
    this.tabindex = ++this.parent.tabindex;

    // la respuesta existe
    if (this.answer) {
      // la respuesta esta encriptada
      if (this.answer.match("krypto_")) {
        var krypt = new descartesJS.Krypto();
        this.answer = krypt.decode(this.answer.substring(7));
      }

      var parseAnswer = this.parent.lessonParser.parseText(this.answer);
    }

    // control container
    this.containerControl = document.createElement("div");

    // the text area
    this.textArea = document.createElement("div");
    this.textAreaAnswer = document.createElement("div");

    // show answer button
    this.showButton = document.createElement("div");
    
    // active cover
    this.activeCover = document.createElement("div");
    
    // add the elements to the container
    this.containerControl.appendChild(this.textArea);
    this.containerControl.appendChild(this.textAreaAnswer);
    this.containerControl.appendChild(this.showButton);
    this.containerControl.appendChild(this.activeCover);
    
    this.addControlContainer(this.containerControl);
    
    this.showAnswer = false;

    // plain text
    if ( (this.text == undefined) || (this.text.type == undefined)) {
      this.text = this.rawText || "";
    }
    else {
      if (this.text.hasFormula) {
        this.text = this.rawText;
      }
      else {
        this.text = this.text.toHTML();
      }
    }
    
    // rtf answer
    if ((parseAnswer) && (parseAnswer.type != undefined)) {
      if (!this.text.hasFormula) {
        this.answer = parseAnswer.toHTML();
      }
    }
   
    this.evaluator.setVariable(this.id, this.text);

    this.drawButton();
    
    // register the mouse and touch events
    this.registerMouseAndTouchEvents();

    this.init();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.TextArea, descartesJS.Control);

  /**
   * Init the text area
   */
  descartesJS.TextArea.prototype.init = function() {
    displaceY = (this.answer) ? 28 : 8;
    evaluator = this.evaluator;
    
    this.text = evaluator.getVariable(this.id);

    this.containerControl.setAttribute("class", "DescartesTextAreaContainer");
    this.containerControl.setAttribute("style", "width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    this.containerControl.style.display = (evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
    this.containerControl.setAttribute("spellcheck", "false");

    // text area
    this.textArea.setAttribute("class", "DescartesTextAreaContainer");
    this.textArea.setAttribute("style", "width: " + (this.w-8) + "px; height: " + (this.h-displaceY) + "px; left: 4px; top: 4px; background-color: white; text-align: left; font: " + descartesJS.convertFont(this.font) + ";");
    this.textArea.setAttribute("contenteditable", "true");  
    this.textArea.innerHTML = "<span style='position: relative; top: 10px; left: 10px; white-space: nowrap;' >" + this.text + "</span>";
    
    // text area answer
    this.textAreaAnswer.setAttribute("class", "DescartesTextAreaContainer");
    this.textAreaAnswer.setAttribute("style", "width: " + (this.w-8) + "px; height: " + (this.h-displaceY) + "px; left: 4px; top: 4px; background-color: white; text-align: left; font: " + descartesJS.convertFont(this.font) + ";");
    this.textAreaAnswer.style.display = (this.showAnswer) ? "block" : "none";
    this.textAreaAnswer.innerHTML = "<span style='position: relative; top: 10px; left: 10px; white-space: nowrap;'>" + this.answer + "</span>";
    
    // show answer button
    this.showButton.setAttribute("style", "width: 20px; height: 16px; position: absolute; bottom: 4px; right: 4px; cursor: pointer;");
    this.showButton.style.backgroundImage = "url(" + this.imageUnPush + ")";
    this.showButton.style.display = (this.answer) ? "block" : "none";
    this.showButton.innerHTML = "<span style='position: relative; top: 2px; text-align: center; font: 9px Arial'> S </span>";

    this.activeCover.setAttribute("style", "position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px;");
  }
  
  /**
   * Draw the show/hide button
   */
  descartesJS.TextArea.prototype.drawButton = function() {
    var w = 20;
    var h = 16;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    var ctx = canvas.getContext("2d");

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
  descartesJS.TextArea.prototype.update = function() {
    evaluator = this.evaluator;

    // check if the control is active and visible
    this.activeIfValue = (evaluator.evalExpression(this.activeif) > 0);
    this.drawIfValue = (evaluator.evalExpression(this.drawif) > 0);

    evaluator.setVariable(this.id, this.text);

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
  descartesJS.TextArea.prototype.registerMouseAndTouchEvents = function() {
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
  }

  descartesJS.TextArea.prototype.getScreenshot = function() {
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", this.w);
    canvas.setAttribute("height", this.h);
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.fillRect(0, 0, this.w, this.h);
    ctx.strokeRect(0, 0, this.w, this.h);

    return canvas;
  }  
  
  return descartesJS;
})(descartesJS || {});