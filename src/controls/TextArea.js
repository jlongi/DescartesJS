/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;

  /**
   * Un campo de texto de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el campo de texto
   */
  descartesJS.TextArea = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Control.call(this, parent, values);

    // siempre van en la region interior
    this.region = "interior";

    // el indice de tabulacion del campo de texto, que determina el orden en el que se salta cuando se presiona el tabulador
    this.tabindex = ++this.parent.tabindex;

    // la respuesta existe
    if (this.answer) {
      // la respuesta esta encriptada
      if (this.answer.match("krypto_")) {
        var krypt = new descartesJS.Krypto();
        this.answer = krypt.decode(this.answer.substring(7));
      }
    }
    
    // contenedor del espacio
    var container = this.getContainer();

    // contenedor del control
    this.containerControl = document.createElement("div");

    // area de texto
    this.textArea = document.createElement("div");
    // area de texto de la respuesta
    this.textAreaAnswer = document.createElement("div");
    // boton para mostrar respuesta
    this.showButton = document.createElement("div");
    // active cover
    this.activeCover = document.createElement("div");
    
    this.containerControl.appendChild(this.textArea);
    this.containerControl.appendChild(this.textAreaAnswer);
    this.containerControl.appendChild(this.showButton);
    this.containerControl.appendChild(this.activeCover);
    
    // por ultimo se agrega el contenedor del pulsador al contenedor del espacio, en orden inverso al que aparecen listados
    if (!container.childNodes[0]) {
      container.appendChild(this.containerControl);
    } else {
      container.insertBefore(this.containerControl, container.childNodes[0]);
    }
    
    ////////////////////////////////////////////
    // se inicia el texto
    ////////////////////////////////////////////
    this.showAnswer = false;
    // texto sin formato
    if (this.text.type == undefined) {
      this.text = this.rawText;
    }
    else {
      if (this.text.hasFormula) {
        this.text = this.rawText;
      }
      else {
        this.text = this.text.toHTML();
      }
    }
    
    // answer
    var parseAnswer = this.parent.lessonParser.parseText(this.answer);
    // rtf answer
    if (parseAnswer.type != undefined) {
      if (!this.text.hasFormula) {
        this.answer = parseAnswer.toHTML();
      }
    }
   
    this.evaluator.setVariable(this.id, this.text);
    ////////////////////////////////////////////    

    this.drawButton();
    
    this.init();
    
    // se registran los eventos del mouse, cuando se de soporte a dispositivos moviles se deben de registrar los eventos correspondientes
    this.registerMouseEvents();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.TextArea, descartesJS.Control);

  /**
   * Inicia los valores del pulsador
   */
  descartesJS.TextArea.prototype.init = function() {
    var displaceY = (this.answer) ? 28 : 8;
    evaluator = this.evaluator;
    
    this.text = evaluator.getVariable(this.id);

    this.containerControl.setAttribute("class", "DescartesTextAreaContainer");
    this.containerControl.setAttribute("style", "width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    this.containerControl.style.display = (evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
    this.containerControl.setAttribute("spellcheck", "false");

    // area de texto
    this.textArea.setAttribute("class", "DescartesTextAreaContainer");
    this.textArea.setAttribute("style", "width: " + (this.w-8) + "px; height: " + (this.h-displaceY) + "px; left: 4px; top: 4px; background-color: white; text-align: left; font: " + descartesJS.convertFont(this.font) + ";");
    this.textArea.setAttribute("contenteditable", "true");
    
    this.textArea.innerHTML = "<span style='position: relative; top: 10px; left: 10px; white-space: nowrap;' >" + this.text + "</span>";
    
    // area de respuesta
    this.textAreaAnswer.setAttribute("class", "DescartesTextAreaContainer");
    this.textAreaAnswer.setAttribute("style", "width: " + (this.w-8) + "px; height: " + (this.h-displaceY) + "px; left: 4px; top: 4px; background-color: white; text-align: left; font: " + descartesJS.convertFont(this.font) + ";");
    this.textAreaAnswer.style.display = (this.showAnswer) ? "block" : "none";

    this.textAreaAnswer.innerHTML = "<span style='position: relative; top: 10px; left: 10px; white-space: nowrap;'>" + this.answer + "</span>";
    
    // boton para mostrar respuesta
    this.showButton.setAttribute("style", "width: 20px; height: 16px; position: absolute; bottom: 4px; right: 4px; cursor: pointer;");
    this.showButton.style.backgroundImage = "url(" + this.imageUnPush + ")";
    this.showButton.innerHTML = "<span style='position: relative; top: 2px; text-align: center; font: 9px Arial'> S </span>";
    
    this.activeCover.setAttribute("style", "position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px;");
    this.activeCover.style.display = (evaluator.evalExpression(this.activeif) > 0) ? "none" : "block";
  }
  
  /**
   * 
   */
  descartesJS.TextArea.prototype.drawButton = function() {
    var w = 20;
    var h = 16;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    var ctx = canvas.getContext("2d");

    var linearGradient = ctx.createLinearGradient(0, 0, 0, h);
    var hh = h*h;
    var di;
    
    for (var i=0; i<h; i++) {
      di = MathFloor(i-(35*h)/100);
      linearGradient.addColorStop(i/h, "rgba(0,0,0,"+ ((di*di*192)/hh)/255 +")");
    }
 
    ctx.lineWidth = 1;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h); 
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, w, h);
    descartesJS.drawLine(ctx, w-1, 0, w-1, h, "rgba(0,0,0,"+(0x80/255)+")");
    descartesJS.drawLine(ctx, 0, 0, 0, h, "rgba(0,0,0,"+(0x18/255)+")");
    descartesJS.drawLine(ctx, 1, 0, 1, h, "rgba(0,0,0,"+(0x08/255)+")");
    this.imageUnPush = canvas.toDataURL();

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h); 
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, w, h);
    descartesJS.drawLine(ctx, 0, 0, 0, h-2, "gray");
    descartesJS.drawLine(ctx, 0, 0, w-1, 0, "gray"); 
    ctx.fillStyle = "rgba(0, 0, 0,"+(0x18/255)+")";
    ctx.fillRect(0, 0, this.w, this.h);
//     descartesJS.drawLine(ctx, 0, 0, 0, h, "rgba(0,0,0,"+(0x18/255)+")");
//     descartesJS.drawLine(ctx, 1, 0, 1, h, "rgba(0,0,0,"+(0x08/255)+")");

    this.imagePush = canvas.toDataURL();
   }
  
  /**
   * Actualiza el campo de texto
   */
  descartesJS.TextArea.prototype.update = function() {
    evaluator = this.evaluator;

    evaluator.setVariable(this.id, this.text);

    var changeX = false;
    var changeY = false;
    var changeW = false;
    var changeH = false;

    // se actualiza la propiedad de activacion
    this.activeCover.style.display = (evaluator.evalExpression(this.activeif) > 0) ? "none" : "block";
    
    // se actualiza si el campo de texto es visible o no
    this.containerControl.style.display = (evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";

    // se actualiza la poscion y el tamano del campo de texto
    var expr = evaluator.evalExpression(this.expresion);
    changeX = (this.x != expr[0][0]);
    changeY = (this.y != expr[0][1]);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      changeW = (this.w != expr[0][2]);
      changeH = (this.h != expr[0][3]);
      this.w = expr[0][2];
      this.h = expr[0][3];
    }

    // se actualiza el estilo del campo de texto si cambia su tamano o su posicion
    if (changeW || changeH || changeX || changeY) {
      this.init();
    }
  }

  /**
   * Se registran los eventos del mouse del boton
   */
  descartesJS.TextArea.prototype.registerMouseEvents = function() {
    // copia de this para ser pasado a las funciones internas
    var self = this;

    /**
     * @param {Event} evt el evento lanzado cuando da click en el boton
     * @private
     */
    function onMouseDown(evt) {
      evt.preventDefault();
      self.showAnswer = !self.showAnswer;
      self.textAreaAnswer.style.display = (self.showAnswer) ? "block" : "none";
//       self.showButton.innerHTML = (self.showAnswer) ? "<span style='position: relative; top: 2px; text-align: center; font: 11px Arial'> T </span>" : "<span style='position: relative; top: 2px; text-align: center; font: 11px Arial'> S </span>";
//       console.log(self.showButton.childNodes[0].childNodes[0].textContent)
      self.showButton.childNodes[0].childNodes[0].textContent = (self.showAnswer) ? "T" : "S";
      self.showButton.style.backgroundImage = "url(" + self.imagePush + ")";

    }
    this.showButton.addEventListener("mousedown", onMouseDown);    

    /**
     * @param {Event} evt el evento lanzado cuando da click en el boton
     * @private
     */
    function onMouseUp(evt) {
      evt.preventDefault();
      self.showButton.style.backgroundImage = "url(" + self.imageUnPush + ")";
    }
    this.showButton.addEventListener("mouseup",  onMouseUp);
    this.showButton.addEventListener("mouseout", onMouseUp);
  }
  
  return descartesJS;
})(descartesJS || {});
