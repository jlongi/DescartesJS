/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;

  /**
   * Un boton de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el boton
   */
  descartesJS.Button = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Control.call(this, parent, values);

    // modificacion para hacer que el boton sea mas configurable y pueda recibir su nombre de una variable
    if ((this.name.charAt(0) == "[") && (this.name.charAt(this.name.length-1))) {
      this.name = this.parser.parse(this.name.substring(1, this.name.length-1));
    }
    else {
      this.name = this.parser.parse("'" + this.name + "'");
    }
    
    // colores en el formato
    // _COLORES_ffffff_000000_P_22
    // en el campo de la imagen, el primer color especifica el fondo del boton, el segundo especifica el color del texto y el ultimo numerp especifica el tamaño de la fuente.
    var tmpParam;
    if (this.imageSrc.match("_COLORES_")) {
      tmpParam = this.imageSrc.split("_");
      this.colorInt = tmpParam[2];
      this.color = tmpParam[3];
      this.font_size = this.parser.parse(tmpParam[5]);
      this.imageSrc = "";
    }

    // modificacion para hacer que el boton sea mas configurable y pueda recibir el nombre de la imagen a mostrar desde una variable
    if ((this.imageSrc.charAt(0) == "[") && (this.imageSrc.charAt(this.imageSrc.length-1))) {
      this.imageSrc = this.parser.parse(this.imageSrc.substring(1, this.imageSrc.length-1));
    }
    else {
      this.imageSrc = this.parser.parse("'" + this.imageSrc + "'");
    }
    
    // si el boton tiene una imagen asignada entonces se carga y se intenta asociar las imagenes de over y down correspondientes
    var imageSrc = this.evaluator.evalExpression(this.imageSrc).trim();
    if (imageSrc != "") {
      var prefix = imageSrc.substr(0, imageSrc.lastIndexOf("."));
      var sufix  = imageSrc.substr(imageSrc.lastIndexOf("."));

      // la imagen es vacia
      if (imageSrc.toLowerCase().match(/vacio.gif$/)) {
        this.image.ready = 1;
        // si la leccion es de Descartes 3, entonces como la imagen es una imagen vacia el nombre no se dibuja, para las demas versiones si se dibuja
        if (this.parent.version == 3) {
//           this.name = "";
          this.name = this.parser.parse('');
        }
        imageSrc = this.parser.parse("'vacio.gif'");
      } 
      // la imagen no es vacia
      else {
        this.image = this.parent.getImage(imageSrc);
        this.imageOver =  this.parent.getImage(prefix + "_over" + sufix);
        this.imageDown =  this.parent.getImage(prefix + "_down" + sufix);
//         this.imageOver.src =  prefix + "_over" + sufix;
//         this.imageDown.src =  prefix + "_down" + sufix;
      }
    }
    
    // se obtiene el contenedor al cual pertenece el control
    var container = this.getContainer();

    // se crea el canvas, se obtiene el contexto de render y se agrega el canvas al contenedor
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("class", "DescartesButton");
    this.canvas.setAttribute("id", this.id);
    this.canvas.setAttribute("width", this.w+"px");
    this.canvas.setAttribute("height", this.h+"px");
    this.canvas.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    this.canvas.style.display = (this.evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";

    this.ctx = this.canvas.getContext("2d");

    // se agrega el contenedor del boton al contenedor del espacio, en orden inverso al que aparecen listados
    if (!container.childNodes[0]) {
      container.appendChild(this.canvas);
    } else {
      container.insertBefore(this.canvas, container.childNodes[0]);
    }

    // se registran los eventos del mouse, cuando se de soporte a dispositivos moviles se deben de registrar los eventos correspondientes
    this.registerMouseEvents();

    // se inician los parametros del boton
    this.init();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Button, descartesJS.Control);

  /**
   * Inicia el boton
   */
  descartesJS.Button.prototype.init = function() {
    var canvas = this.canvas;
    var expr = this.evaluator.evalExpression(this.expresion);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      this.w = parseInt(expr[0][2]);
      this.h = parseInt(expr[0][3]);
    }
    
    canvas.setAttribute("width", this.w+"px");
    canvas.setAttribute("height", this.h+"px");
    canvas.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");

    this.createGradient(this.w, this.h);
    this.draw();
  }
  
  /**
   * Actualiza el boton
   */
  descartesJS.Button.prototype.update = function() {
    var changeX = false;
    var changeY = false;
    var changeW = false;
    var changeH = false;

    // se actualiza si el boton es visible o no
    if (this.evaluator.evalExpression(this.drawif) > 0) {
      this.canvas.style.display = "block";
      this.draw();
    } else {
      this.click = false;
      this.canvas.style.display = "none";
    }    

    this.evaluator.evalExpression(this.activeif);
    
    // se actualiza la poscion y el tamano del boton
    var expr = this.evaluator.evalExpression(this.expresion);
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

    // si cambio el ancho o el alto del boton se calcula de nuevo el gradiente
    if (changeW || changeH) {
      this.createGradient(this.canvas.width, this.canvas.height);
    }

    // se actualiza el estilo del boton si cambia su tamano o su posicion
    if (changeW || changeH || changeX || changeY) {
      this.canvas.setAttribute("width", this.w+"px");
      this.canvas.setAttribute("height", this.h+"px");
      this.canvas.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
      this.draw();
    }

  }
  
  /**
   * Crea un gradiente lineal para el boton
   * @param {Number} w es el ancho del canvas sobre el cual se quiere crear el gradiente lineal
   * @param {Number} h es el alto del canvas sobre el cual se quiere crear el gradiente lineal
   */
  descartesJS.Button.prototype.createGradient = function(w, h) {
    this.linearGradient = this.ctx.createLinearGradient(0, 0, 0, h);
    var hh = h*h;
    var di;
    
    for (var i=0; i<h; i++) {
      di = MathFloor(i-(35*h)/100);
      this.linearGradient.addColorStop(i/h, "rgba(0,0,0,"+ ((di*di*192)/hh)/255 +")");
    }
  }
  /**
   * Dibuja el boton
   */
  descartesJS.Button.prototype.draw = function() {
    var font_size = this.evaluator.evalExpression(this.font_size);
    var name = this.evaluator.evalExpression(this.name);
    var imageSrc = this.evaluator.evalExpression(this.imageSrc);
    var image;
    if (imageSrc == "vacio.gif") {
      image = {ready: true};
    }
    else {
      image = this.parent.getImage(imageSrc);
    }
    
    var ctx = this.ctx;

    ctx.clearRect(0, 0, this.w, this.h);

    // desplazamiento para que parezca que el texto se mueve cuando se presiona el boton
    var despX = 0, despY = 0;
    if (this.click) {
      despX = 1;
      despY = 1;
    }
    
//     if (this.image.ready) {      
    if ((image) && (image.ready)) {
//       if ( ((this.image.src != "") || (!this.imageSrc.toLowerCase().match(/vacio.gif$/))) && (this.image.complete)) {
      if ( ((image.src != "") || (!imageSrc.toLowerCase().match(/vacio.gif$/))) && (image.complete) ) {
//         ctx.drawImage(this.image, (this.w-this.image.width)/2+despX, (this.h-this.image.height)/2+despY);
        ctx.drawImage(image, (this.w-image.width)/2+despX, (this.h-image.height)/2+despY);
      }
    }
    
    else {
      ctx.fillStyle = descartesJS.getColor(this.evaluator, this.colorInt);
      ctx.fillRect(0, 0, this.w, this.h);

      if (!this.click) {
        descartesJS.drawLine(ctx, this.w-1, 0, this.w-1, this.h, "rgba(0,0,0,"+(0x80/255)+")");
        descartesJS.drawLine(ctx, 0, 0, 0, this.h, "rgba(0,0,0,"+(0x18/255)+")");
        descartesJS.drawLine(ctx, 1, 0, 1, this.h, "rgba(0,0,0,"+(0x08/255)+")");
      }
      
      ctx.fillStyle = this.linearGradient;
      ctx.fillRect(0, 0, this.w, this.h);
    }
    
    if ((this.imageOver.src != "") && (this.imageOver.ready) && (this.over)) {
//       ctx.drawImage(this.imageOver, (this.w-this.image.width)/2+despX, (this.h-this.image.height)/2+despY);
      ctx.drawImage(this.imageOver, (this.w-image.width)/2+despX, (this.h-image.height)/2+despY);
    }

    if ((this.imageDown.src != "") && (this.imageDown.ready) && (this.click)){
//       ctx.drawImage(this.imageDown, (this.w-this.image.width)/2+despX, (this.h-this.image.height)/2+despY);
      ctx.drawImage(this.imageDown, (this.w-image.width)/2+despX, (this.h-image.height)/2+despY);
    } 
    
    else if (this.click) {
      ctx.save();
      descartesJS.drawLine(ctx, 0, 0, 0, this.h-2, "gray");
      descartesJS.drawLine(ctx, 0, 0, this.w-1, 0, "gray"); 

      ctx.fillStyle = "rgba(0, 0, 0,"+(0x18/255)+")";
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.restore();
    }
      
    ctx.fillStyle = descartesJS.getColor(this.evaluator, this.color);
    ctx.font = this.italics + " " + this.bold + " " + font_size + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // borde alrededor del texto
    ctx.strokeStyle = descartesJS.getColor(this.evaluator, this.colorInt);
    ctx.lineWidth = font_size/12;
    if (this.stroke != this.fillStyle) {
//       ctx.strokeText(this.name, MathFloor(this.w/2 + despX)+.5, MathFloor(this.h/2 + despY)+.5);
      ctx.strokeText(name, MathFloor(this.w/2 + despX)+.5, MathFloor(this.h/2 + despY)+.5);
    }

    // se escribe el nombre del boton
//     ctx.fillText(this.name, MathFloor(this.w/2 + despX)+.5, MathFloor(this.h/2 + despY)+.5);
    ctx.fillText(name, MathFloor(this.w/2 + despX)+.5, MathFloor(this.h/2 + despY)+.5);

    if (this.underlined) {
//       var txtW = ctx.measureText(this.name).width;
      var txtW = ctx.measureText(name).width;
      ctx.strokeStyle = descartesJS.getColor(this.evaluator, this.color);
      ctx.lineWidth = MathFloor(font_size/10);
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo( (this.w-txtW)/2 + despX, MathFloor(this.h + font_size)/2 + ctx.lineWidth/2 - 1.5 + despY );
      ctx.lineTo( (this.w+txtW)/2 + despX, MathFloor(this.h + font_size)/2 + ctx.lineWidth/2 - 1.5 + despY );
      ctx.stroke();
    }
     
    if (!this.evaluator.evalExpression(this.activeif)) {
      ctx.fillStyle = "rgba(" + 0xf0 + "," + 0xf0 + "," + 0xf0 + "," + (0xa0/255) + ")";
      ctx.fillRect(0, 0, this.w, this.h);
    }
    
//     ctx.restore();
  }
  
  /**
   * Ejecuta la accion del boton y actualiza
   */
  descartesJS.Button.prototype.bottonPressed = function() {
//     this.evaluator.setVariable(this.id, 0);
    // se actualizan los controles
    this.parent.updateControls();    
    // ejecutamos la accion
    if (this.action == "init") {
      this.click = false;
    } 

    this.actionExec.execute();

    // se actualizan los controles
    this.parent.updateControls();

    // si la accion es animar, entonces no se actualizan los elementos
    if (this.action != "animate") {
      // se actualizan los valores
      this.parent.update();
    }
  }
  
  /**
   * Registra los eventos del mouse del boton
   */
  descartesJS.Button.prototype.registerMouseEvents = function() {
    var hasTouchSupport = descartesJS.hasTouchSupport;
    
    this.canvas.oncontextmenu = function () { return false; };
    
    // copia de this para ser pasado a las funciones internas
    var self = this;
    var delay = 900;
    var timer;

    /**
     * Se repite durante un determinado tiempo una funcion, sirve para repedir incrementos o decrementos en el boton al dejar presionado alguno de los botones
     * @param {Number} delayTime el tiempo que se debe esperar antes de ejectuar de nuevo la funcion
     * @param {Number} fun la funcion a ejecutar
     * @private
     */
    function repeat(delayTime, fun, firstTime) {
      if (self.click) {
        fun.call(self);
//         delayTime = (delayTime < 30) ? 30 : delayTime-200;
        delayTime = (firstTime) ? delayTime : 30;
        timer = setTimeout(function() { repeat(delayTime, fun); }, delayTime);
      } else {
        clearInterval(timer);
      }
    }

    
    this.click = false;
    this.over = false;
    
    if (hasTouchSupport) {
      this.canvas.addEventListener("touchstart", onMouseDown, false);
    } else {
      this.canvas.addEventListener("mousedown", onMouseDown, false);
      this.canvas.addEventListener("mouseover", onMouseOver, false);
      this.canvas.addEventListener("mouseout", onMouseOut, false);
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de presionar un boton
     * @private
     */
    function onMouseDown(evt) {
      evt.preventDefault();

      // ie
      if (evt.which == null) {
        self.whichButton = (evt.button < 2) ? "LEFT" : ((evt.button == 4) ? "MIDDLE" : "RIGHT");
      } 
      // los demas
      else {
        self.whichButton = (evt.which < 2) ? "LEFT" : ((evt.which == 2) ? "MIDDLE" : "RIGHT");
      }

      if (self.whichButton == "LEFT") {
        if (self.evaluator.evalExpression(self.activeif) > 0) {
          self.click = true;
          
          self.draw();
          
          // se registra el valor de la variable
          self.evaluator.setVariable(self.id, self.evaluator.evalExpression(self.valueExpr));

          if (self.action == "calculate") {
            repeat(delay, self.bottonPressed, true);
          }
          
          if (hasTouchSupport) {
            window.addEventListener("touchend", onMouseUp, false);
          } else {
            window.addEventListener("mouseup", onMouseUp, false);

          }
        }
      }
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de soltar un boton
     * @private
     */
    function onMouseUp(evt) {
      if ((self.evaluator.evalExpression(self.activeif) > 0) || (self.click)) {
        self.click = false;
        self.draw();
        
        if (self.action != "calculate") {
          self.bottonPressed();
        }
        
        evt.preventDefault();

        if (hasTouchSupport) {
          window.removeEventListener("touchend", onMouseUp, false);
        } else {
          window.removeEventListener("mouseup", onMouseUp, false);
        }
      }
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de colocar el mouse sobre el boton
     * @private
     */
    function onMouseOver(evt) {
      self.over = true;
      self.draw();
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de sacar el mouse del boton
     * @private
     */
    function onMouseOut(evt) {
      self.over = false;
      self.click = false;
      self.draw();
    }
  }

  return descartesJS;
})(descartesJS || {});
