/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathRound = Math.round;
  var PI2 = Math.PI*2;
  
  /**
   * Un espacio de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la aplicacion de descartes
   */
  descartesJS.Space2D = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Space.call(this, parent, values);

    // se crean los elementos graficos
    this.backgroundCanvas = document.createElement("canvas");
    this.backgroundCanvas.setAttribute("id", this.id + "_background");
    this.backgroundCanvas.setAttribute("width", this.w + "px");
    this.backgroundCanvas.setAttribute("height", this.h + "px");
    this.backgroundCtx = this.backgroundCanvas.getContext("2d");

    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", this.id + "_canvas");
    this.canvas.setAttribute("width", this.w + "px");
    this.canvas.setAttribute("height", this.h + "px");
    this.canvas.setAttribute("class", "DescartesSpace2DCanvas");
    this.canvas.setAttribute("style", "z-index: " + this.zIndex + ";");
    this.ctx = this.canvas.getContext("2d");

    // se crean contenedores para los controles graficos y los numericos
    this.graphicControlContainer = document.createElement("div");
    this.graphicControlContainer.setAttribute("id", this.id + "_graphicControls");
//    this.graphicControlContainer.setAttribute("style", "width: " +this.w+ "px; height:" +this.h+ "px; position: absolute; overflow: hidden; left: 0px; top: 0px; z-index: " + this.zIndex + ";");
    this.graphicControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + this.zIndex + ";");
//     this.graphicControlContainer.style.cssText = "position: absolute; left: 0px; top: 0px; z-index: " + this.zIndex + ";");
    
    this.numericalControlContainer = document.createElement("div");
    this.numericalControlContainer.setAttribute("id", this.id + "_numericalControls");
//    this.numericalControlContainer.setAttribute("style", "width: " +this.w+ "px; height:" +this.h+ "px; position: absolute; overflow: hidden; left: 0px; top: 0px; z-index: " + this.zIndex + ";");
    this.numericalControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + this.zIndex + ";");

    // se crea el contenedor principal
    this.container = document.createElement("div");
    this.container.setAttribute("id", this.id);
    this.container.setAttribute("class", "DescartesSpace2DContainer");
    this.container.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");

    // ### ARQUIMEDES ###
    if ((this.parent.arquimedes) && (descartesJS.getColor(this.evaluator, this.background) === "#f0f8fa")) {
      this.container.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + "; border: 1px solid #b8c4c8;");
    }
    // ### ARQUIMEDES ###

    // se agregan los elementos al DOM
    this.container.appendChild(this.backgroundCanvas);
    this.container.appendChild(this.canvas);
    this.container.appendChild(this.graphicControlContainer);
    this.container.appendChild(this.numericalControlContainer);
    
    parent.container.insertBefore(this.container, parent.loader);

    // encuentra el offset del contenedor para el calculo de la posicion del mouse
    this.findOffset();

    // soporte para generar una imagen del contenido del espacio
    this.parent.images[this.id + ".image"] = this.canvas;
    this.parent.images[this.id + ".image"].ready = 1;
    this.parent.images[this.id + ".image"].complete = true;
    this.evaluator.setVariable(this.id + ".image", this.id + ".image");

    // soporte para generar una imagen del contenido del fondo del espacio
    this.parent.images[this.id + ".back"] = this.backgroundCanvas;
    this.parent.images[this.id + ".back"].ready = 1;
    this.parent.images[this.id + ".back"].complete = true;
    this.evaluator.setVariable(this.id + ".back", this.id + ".back");

    this.drawBefore = (this.evaluator.evalExpression(this.drawif) > 0);
    
    // se registran los eventos del mouse, cuando se de soporte a dispositivos moviles se deben de registrar los eventos correspondientes
    if (this.id !== "descartesJS_scenario") {
      this.registerMouseEvents();
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Space2D, descartesJS.Space);

  var thisGraphics_i;
  /**
   * Actualiza los valores del espacio
   * @param [Boolean] firstTime variable que indica si se esta actualizando por primera vez
   */
  descartesJS.Space2D.prototype.update = function(firstTime) {
    // ## parche para descartes 2 ## //
    var OxString = (this.parent.version != 2) ? this.id + ".Ox" : "Ox";
    var OyString = (this.parent.version != 2) ? this.id + ".Oy" : "Oy";
    var escalaString = (this.parent.version != 2) ? this.id + ".escala" : "escala";

    var evaluator = this.evaluator;
    
    // se garantiza que el ancho y el alto no sean modificados desde una variable externa
    evaluator.setVariable(this.id + "._w", this.w);
    evaluator.setVariable(this.id + "._h", this.h);

    var changeX = (this.x != evaluator.evalExpression(this.xExpr) + this.displaceRegionWest);
    var changeY = (this.y != evaluator.evalExpression(this.yExpr) + this.parent.plecaHeight  + this.displaceRegionNorth);
    // se checa si el espacio ha cambiado, es decir que cambio su posicion en x o y, que cambio la posicion de su origen o su escala
    this.spaceChange = firstTime || 
                       changeX || changeY ||
                       (this.drawBefore != (evaluator.evalExpression(this.drawif) > 0)) ||
                       (this.Ox != evaluator.getVariable(OxString)) ||
                       (this.Oy != evaluator.getVariable(OyString)) ||
                       (this.scale != evaluator.getVariable(escalaString));

    this.x = (changeX) ? evaluator.evalExpression(this.xExpr) + this.displaceRegionWest: this.x;
    this.y = (changeY) ? evaluator.evalExpression(this.yExpr) + this.parent.plecaHeight  + this.displaceRegionNorth : this.y;
    this.Ox = evaluator.getVariable(OxString);
    this.Oy = evaluator.getVariable(OyString);
    this.scale = evaluator.getVariable(escalaString);
    this.drawBefore = (evaluator.evalExpression(this.drawif) > 0);

    // se verifica que la escala no sobrepase el limite inferior
    if (this.scale < 0.000001) {
      this.scale = 0.000001;
      evaluator.setVariable(escalaString, 0);
    } 
    // se verifica que la escala no sobrepase el limite superiro    
    else if (this.scale > 1000000) {
      this.scale = 1000000;
      evaluator.setVariable(escalaString, 1000000);
    }
    
    // si cambio alguna propiedad del espacio entonces cambiamos las propiedades del contenedor
    if (changeX) {
      this.container.style.left = this.x + "px";
    }
    if (changeY) {
      this.container.style.top = this.y + "px";
    }
    if ((changeX) || (changeY)) {
      this.findOffset();
    }

    // si hay que dibujar entonces se dibuja
    if ( evaluator.evalExpression(this.drawif) > 0 ) {
      this.container.style.display = "block";
      
      // se dibujan los rastros de las graficas
      for(var i=0, l=this.graphics.length; i<l; i++) {
        thisGraphics_i = this.graphics[i];

        // si las graficas tiene rastro, el espacio no ha cambiado, no se ha presionado el mouse y las graficas no perteneces al fondo, hay que dibujar los graficos
        if ( (thisGraphics_i.trace != "") && (!this.spaceChange) && (!this.click) && (!thisGraphics_i.background) ) {
          thisGraphics_i.drawTrace();
        }
      }

      this.drawBackground();
      this.draw();
    } else {
      this.container.style.display = "none";
    }
    
  }

  /**
   * Dibuja el fondo del espacio
   */
  descartesJS.Space2D.prototype.drawBackground = function() {
    if (this.spaceChange) {
      var evaluator = this.evaluator;
      var ctx = this.backgroundCtx;

      // se dibuja el color del fondo
      ctx.clearRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
      ctx.fillStyle = descartesJS.getColor(evaluator, this.background);
      ctx.fillRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);

      // se dibuja la imagen, si es que tiene
      if ( (this.image) && (this.image.src != "") && (this.image.ready) && (this.image.complete) ) {
        if (this.bg_display == "topleft") {
          ctx.drawImage(this.image, 0, 0);
        } 
        else if (this.bg_display == "stretch") {
          ctx.drawImage(this.image, 0, 0, this.w, this.h);
        } 
        else if (this.bg_display == "patch") {
          ctx.fillStyle = ctx.createPattern(this.image, "repeat");
          ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        else if (this.bg_display == "center") {
          ctx.drawImage(this.image, (this.w-this.image.width)/2, (this.h-this.image.height)/2);
        }
      }
      
      var rsc = this.scale;
      var dec = 0;
      var wh_temp = ((this.w+this.h) < 0) ? 0 : (this.w+this.h);
      while (rsc>(wh_temp)) {
        rsc/=10; dec++; 
      }
      while (rsc<(wh_temp)/10) { 
        rsc*=10;
      }

      ctx.lineWidth = 1;

      //se dibuja la red grande
      if (this.net != "") {
        ctx.strokeStyle = descartesJS.getColor(evaluator, this.net);
        this.drawMarks(ctx, rsc/10, -1);
      }
      
      //se dibuja la red mas fina
      if ( ((this.parent.version != 2) && (this.net10 != "")) || 
           ((this.parent.version == 2) && (this.net != "") && (this.net10 != ""))
         ) {
        ctx.strokeStyle = descartesJS.getColor(evaluator, this.net10);
        this.drawMarks(ctx, rsc, -1);
      }
      
      //se dibujan los ejes
      if (this.axes != "") {
        ctx.strokeStyle = descartesJS.getColor(evaluator, this.axes);
        
        ctx.beginPath();
        // el eje X
        if ((this.x_axis != "") || (this.parent.version != 2)) {
          ctx.moveTo(0, MathFloor(this.h/2+this.Oy)+.5);
          ctx.lineTo(this.w, MathFloor(this.h/2+this.Oy)+.5);
        }

        // el eje Y
        if ((this.y_axis != "") || (this.parent.version != 2)) {
          ctx.moveTo(MathFloor(this.w/2+this.Ox)+.5, 0);
          ctx.lineTo(MathFloor(this.w/2+this.Ox)+.5, this.h);
        }
        
        ctx.stroke();
        
        this.drawMarks(ctx, rsc, 4);
        this.drawMarks(ctx, rsc/2, 2);
        this.drawMarks(ctx, (rsc/2)/5, 1);
      }
      
      //se dibuja el nombre de los ejes
      if ((this.x_axis != "") || (this.y_axis != "")) {
        ctx.fillStyle = descartesJS.getColor(evaluator, this.axes);
        ctx.font = "12px Arial";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillText(this.x_axis, MathFloor(this.w)-2, MathFloor(this.h/2+this.Oy));
        ctx.fillText(this.y_axis, MathFloor(this.w/2+this.Ox)-2, 0); 
      }
      
      //se dibujan los numeros en los ejes
      if ((this.numbers) && (this.axes != "")) {
        ctx.fillStyle = descartesJS.getColor(evaluator, this.axes);
        ctx.font = "12px Arial";
        ctx.textAlign = "start";
        ctx.textBaseline = "bottom";

        if (rsc>(this.w+this.h)/2) {
          this.drawNumbers(ctx, rsc/5, (rsc<=this.scale)?dec+1:dec);
        } 
        
        else if (rsc>(this.w+this.h)/4) {
          this.drawNumbers(ctx, rsc/2, (rsc<=this.scale)?dec+1:dec);
        } 
        
        else {
          this.drawNumbers(ctx, rsc, dec);
        }
      }
            
      //se dibujan solo las graficas del fondo
      for(var i=0, l=this.graphics.length; i<l; i++) {
        var thisGraphics_i = this.graphics[i];
        if (thisGraphics_i.background) {
          thisGraphics_i.draw();
        }
      }
      
    }
  }

  /**
   * Se dibuja el espacio y todo lo que contiene
   */
  descartesJS.Space2D.prototype.draw = function() {
    var ctx = this.ctx;
    var thisGraphics_i;
    var thisCtrs_i;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    //se dibujan las graficas que no son del fondo
    for(var i=0, l=this.graphics.length; i<l; i++) {
      thisGraphics_i = this.graphics[i];

      if (!thisGraphics_i.background) {
        thisGraphics_i.draw();
      }
    }

    //se dibujan los controles graficos
    for (var i=0, l=this.ctrs.length; i<l; i++) {
      thisCtrs_i = this.ctrs[i];
      if (thisCtrs_i.type == "graphic") {
        thisCtrs_i.draw();
      }
    }
        
    //se dibuja el texto mostrando la posicion del mouse
    if ((this.text != "") && (this.click) && (this.whichButton == "LEFT")) {
      ctx.fillStyle = descartesJS.getColor(this.evaluator, this.text);
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 1;
      ctx.font = "12px Courier New";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";

      var coordTxt_X = (this.scale <= 1) ? ((this.mouse_x).toFixed(0)) : (this.mouse_x).toFixed((this.scale).toString().length);
      var coordTxt_Y = (this.scale <= 1) ? ((this.mouse_y).toFixed(0)) : (this.mouse_y).toFixed((this.scale).toString().length);
      var coordTxt = "(" + coordTxt_X + "," + coordTxt_Y + ")";
      var coordTxtW = ctx.measureText(coordTxt).width;
      var mouseX = this.getAbsoluteX(this.mouse_x);
      var mouseY = this.getAbsoluteY(this.mouse_y);
      var posX = MathFloor(mouseX);
      var posY = MathFloor(mouseY-10);

      // evitar que la posicion del texto del mouse se salga del espacio
      if ((posX+coordTxtW/2) > this.w) {
        posX = this.w-coordTxtW/2;
      } 
      else if ((posX-coordTxtW/2) < 0) {
        posX = coordTxtW/2;
      }
      if ((posY+1) > this.h) {
        posY = this.h;
      } 
      else if ((posY-14) < 0) { // 14 el alto del texto (12px + 2)
        posY = 15;
      }

      ctx.fillText(coordTxt, posX, posY);

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 2.5, 0, PI2, true);
      ctx.stroke();
    }
  }
  
  /**
   * Se dibujan las marcas de los ejes del espacio
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja
   * @param {Number} rsc
   * @param {Number} sz
   */
  descartesJS.Space2D.prototype.drawMarks = function(ctx, rsc, sz) {
    var w = this.w;
    var h = this.h;
    var x, y;
    
    var x1 = 0;
    var x2 = w;
    var y1 = 0;
    var y2 = h;
    var Ox = MathFloor(w/2+this.Ox);
    var Oy = MathFloor(h/2+this.Oy);
    
    if (sz >= 0) {
      x1 = Ox-sz;
      x2 = Ox+sz;
      y1 = Oy-sz;
      y2 = Oy+sz;
    }
        
    ctx.beginPath();
    for (var i=-MathRound(Ox/rsc); (x = Ox + MathRound(i*rsc)) < w; i++) {
      ctx.moveTo(x+.5, y1+.5);
      ctx.lineTo(x+.5, y2+.5);
    }
    for (var i=-MathRound(Oy/rsc); (y = Oy + MathRound(i*rsc)) < h; i++) {
      ctx.moveTo(x1+.5, y+.5);
      ctx.lineTo(x2+.5, y+.5);
    }
    ctx.stroke();

  }
    
  /**
   * Se dibujan los numeros de los ejes del espacio
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja
   * @param {Number} rsc
   * @param {Number} dec
   */
  descartesJS.Space2D.prototype.drawNumbers = function(ctx, rsc, dec) {
    var w = this.w;
    var h = this.h;
    var x, y;
    
    var Ox = MathFloor(w/2+this.Ox);
    var Oy = MathFloor(h/2+this.Oy);
    
    for (var i=-MathRound(Ox/rsc); (x = Ox + MathRound(i*rsc)) < w; i++) {
      ctx.fillText(parseFloat( (i*rsc/this.scale).toFixed(4) ), x+2, Oy-2);
    }
    
    for (var i=-MathRound(Oy/rsc); (y = Oy + MathRound(i*rsc)) < h; i++) {
      ctx.fillText(parseFloat( (-i*rsc/this.scale).toFixed(4) ), Ox+2, y-2);
    }
  }
  
  /**
   * Se registran los eventos del mouse del espacio
   */
  descartesJS.Space2D.prototype.registerMouseEvents = function() {
    // se crea una variable con el valor del objeto (Space2D) para que el ambiente de las funciones pueda utilizarlo
    var self = this;
    var hasTouchSupport = descartesJS.hasTouchSupport;

    // bloqueo del menu contextual
    this.canvas.oncontextmenu = function () { return false; };

    ///////////////////////////////////////////////////////////////////////////
    // Registro de eventos de touch (iOS, android)
    ///////////////////////////////////////////////////////////////////////////
    if (hasTouchSupport) {
      if (this.sensitive_to_mouse_movements) {
        this.canvas.addEventListener("touchmove",  onSensitiveToMouseMovements, false);
      }
      this.canvas.addEventListener("touchstart", onTouchStart, false);
    }

    /**
     * @param {Event} evt el evento lanzado por la accion de iniciar un touch
     * @private
     */
    function onTouchStart(evt) {
      self.click = 1;
      self.parent.evaluator.setVariable(self.id + ".mouse_pressed", 1);

      // se desactivan los controles graficos
      self.parent.deactivateGraphiControls();

      onSensitiveToMouseMovements(evt);
      
//      self.parent.update();

      window.addEventListener("touchmove", onMouseMove, false);
      window.addEventListener("touchend", onTouchEnd, false);

      // intenta mantener el gesto de deslizar en las tablets      
      if ((!self.fixed) || (self.sensitive_to_mouse_movements)) {
        evt.preventDefault();
      }
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de finalizar un touch
     * @private
     */
    function onTouchEnd(evt) {
      self.click = 0;
      self.parent.evaluator.setVariable(self.id + ".mouse_pressed", 0);

      window.removeEventListener("touchmove", onMouseMove, false);
      window.removeEventListener("touchend", onTouchEnd, false);

      // self.parent.update();

      evt.preventDefault();

      self.parent.update();      
    }
  
    ///////////////////////////////////////////////////////////////////////////
    // Registro de eventos de mouse
    ///////////////////////////////////////////////////////////////////////////
    if (!hasTouchSupport) {
      if (this.sensitive_to_mouse_movements) {
        this.canvas.addEventListener("mousemove", onSensitiveToMouseMovements, false);
      }
      this.canvas.addEventListener("mousedown", onMouseDown, false);
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de presionar un boton
     * @private
     */
    function onMouseDown(evt) {
      self.click = 1;
      self.parent.evaluator.setVariable(self.id + ".mouse_pressed", 1);
      
      // se desactivan los controles graficos
      self.parent.deactivateGraphiControls();

      // ie
      if (evt.which == null) {
        self.whichButton = (evt.button < 2) ? "LEFT" : ((evt.button == 4) ? "MIDDLE" : "RIGHT");
      } 
      // los demas
      else {
        self.whichButton = (evt.which < 2) ? "LEFT" : ((evt.which == 2) ? "MIDDLE" : "RIGHT");
      }
      
      // se bloquea la aparicion del menu contextual y si el espacio no esta fijo se asigna un manejador para el zoom
      if (self.whichButton == "RIGHT") {
//        window.oncontextmenu = function () { return false; };
        window.addEventListener("mouseup", onMouseUp, false);
        

        if (!self.fixed) {
          self.clickPosForZoom = (self.getCursorPosition(evt)).y;
          self.tempScale = self.scale;
          window.addEventListener("mousemove", onMouseMoveZoom, false);
        }
      }
      
      if (self.whichButton == "LEFT") {
        self.parent.evaluator.setVariable(self.id + ".mouse_pressed", 1);
        
        onSensitiveToMouseMovements(evt);

        window.addEventListener("mousemove", onMouseMove, false);
        window.addEventListener("mouseup", onMouseUp, false);
      }
      
      evt.preventDefault();
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de soltar un boton
     * @private
     */
    function onMouseUp(evt) {
      self.click = 0;
      self.parent.evaluator.setVariable(self.id + ".mouse_pressed", 0);
      evt.preventDefault();

      // se desbloquea la aparicion del menu contextual
      if (self.whichButton == "RIGHT") {
        window.removeEventListener("mousemove", onMouseMoveZoom, false);
//	    window.oncontextmenu = "";
      }

      if (!self.sensitive_to_mouse_movements) {
        window.removeEventListener("mousemove", onMouseMove, false);
      }
      window.removeEventListener("mouseup", onMouseUp, false);

//       if (self.whichButton == "LEFT") {
//         window.removeEventListener("mousemove", onMouseMove, false);
//       }      
      
      // self.parent.update();
      
      self.parent.update();
    }
    
    /**
     * 
     */
    function onSensitiveToMouseMovements(evt) {
      self.posAnte = self.getCursorPosition(evt);
      self.mouse_x = self.getRelativeX(self.posAnte.x);
      self.mouse_y = self.getRelativeY(self.posAnte.y);
      self.parent.evaluator.setVariable(self.id + ".mouse_x", self.mouse_x);
      self.parent.evaluator.setVariable(self.id + ".mouse_y", self.mouse_y);
      
      self.parent.update();
    }
    
    /**
     * @param {Event} evt el evento lanzado por la acción de mover el mouse con el boton derecho presionado
     * @private
     */
    function onMouseMoveZoom(evt) {
      self.clickPosForZoomNew = (self.getCursorPosition(evt)).y;

      // ## parche para descartes 2 ## //
      var escalaString = (self.parent.version != 2) ? self.id + ".escala" : "escala";

      self.evaluator.setVariable(escalaString, self.tempScale + (self.tempScale/45)*((self.clickPosForZoom-self.clickPosForZoomNew)/10));
      
      self.parent.update();
      
      evt.preventDefault();
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de mover el mouse
     * @private
     */
    function onMouseMove(evt) {
      // si el espacio no esta fijo entonces se modifica la posicion del origen
      if (!self.fixed) {
        self.posNext = self.getCursorPosition(evt);
        var disp = { x:MathFloor(self.posAnte.x-self.posNext.x), 
                     y:MathFloor(self.posAnte.y-self.posNext.y) };
                    
        // ## parche para descartes 2 ## //
        var OxString = (self.parent.version != 2) ? self.id + ".Ox" : "Ox";
        var OyString = (self.parent.version != 2) ? self.id + ".Oy" : "Oy";
        self.parent.evaluator.setVariable(OxString, (self.Ox - disp.x));
        self.parent.evaluator.setVariable(OyString, (self.Oy - disp.y));
        self.posAnte.x -= disp.x;
        self.posAnte.y -= disp.y;
      }

      if (self.click) {
        onSensitiveToMouseMovements(evt);
      }

      // intenta mantener el gesto de deslizar en las tablets
      if ((!self.fixed) || (self.sensitive_to_mouse_movements)) {
        evt.preventDefault();
      }
    }
  }
    
  return descartesJS;
})(descartesJS || {});
