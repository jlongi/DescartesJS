/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathRound = Math.round;
  var MathCos   = Math.cos;
  var MathSin   = Math.sin;
  
  /**
   * Un espacio de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la aplicacion de descartes
   */
  descartesJS.Space3D = function(parent, values) {
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
    this.canvas.setAttribute("class", "DescartesSpace3DCanvas");
    this.canvas.setAttribute("style", "z-index: " + this.zIndex + ";");
    this.ctx = this.canvas.getContext("2d");
    
    // se crean contenedores para los controles graficos y los numericos
    this.graphicControlContainer = document.createElement("div");
    this.graphicControlContainer.setAttribute("id", this.id + "_graphicControls");
    this.graphicControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + this.zIndex + ";");
    
    this.numericalControlContainer = document.createElement("div");
    this.numericalControlContainer.setAttribute("id", this.id + "_numericalControls");
    this.numericalControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + this.zIndex + ";");

    // se crea el contenedor principal
    this.container = document.createElement("div");
    this.container.setAttribute("id", this.id);
    this.container.setAttribute("class", "DescartesSpace3DContainer");
    this.container.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");

    // se agregan los elementos al DOM
    this.container.appendChild(this.backgroundCanvas);
    this.container.appendChild(this.canvas);
    this.container.appendChild(this.graphicControlContainer);
    this.container.appendChild(this.numericalControlContainer);
    
    parent.container.insertBefore(this.container, parent.loader);

    // encuentra el offset del contenedor para el calculo de la posicion del mouse
    this.findOffset();
    
    // this.eye = new descartesJS.Vector3D(this.scale/5, 2, 5);
    this.eye = new descartesJS.Vector3D(0,0,0);
    this.center = new descartesJS.Vector3D(0, 0, 0);
    this.yUpEye = new descartesJS.Vector3D(0, 0, 1);
    // this.distanceEyeCenter = Math.sqrt(Math.pow(this.eye.x-this.center.x, 2) + Math.pow(this.eye.y-this.center.y, 2) + Math.pow(this.eye.z-this.center.z, 2));
    this.distanceEyeCenter = 10;
    this.alpha = Math.PI/4;
    this.beta = -Math.PI/5;
    
    // this.lookAtMatrix = (new descartesJS.Matrix4x4()).lookAt(this.eye, this.center, this.yUpEye);
    // this.perspectiveMatrix = perspective.multiply(this.lookAtMatrix);

    this.lookAtMatrix = new descartesJS.Matrix4x4();
    this.perspectiveMatrix = new descartesJS.Matrix4x4();
    this.perspective = (new descartesJS.Matrix4x4()).perspective(45, this.w/this.h, 0.01, 1000.0);

    cosAlpha = MathCos(-this.alpha);
    sinAlpha = MathSin(-this.alpha);
    cosBeta = MathCos(this.beta);
    sinBeta = MathSin(this.beta);

    this.eye.set(this.distanceEyeCenter*cosAlpha*cosBeta, 
                 this.distanceEyeCenter*sinAlpha*cosBeta, 
                -this.distanceEyeCenter*sinBeta);

    this.yUpEye = this.yUpEye.set(MathCos(-this.alpha - Math.PI/2), MathSin(-this.alpha - Math.PI/2), 0).crossProduct(this.eye).normalize();

    this.lookAtMatrix = this.lookAtMatrix.setIdentity().lookAt(this.eye, this.center, this.yUpEye);

    this.perspectiveMatrix = this.perspective.multiply(this.lookAtMatrix);

    // this.scene = new descartesJS.Scene();
  
    this.registerMouseEvents();

    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Space3D, descartesJS.Space);
    
  /**
   * Actualiza los valores del espacio
   * @param [Boolean] firstTime variable que indica si se esta actualizando por primera vez
   */
  descartesJS.Space3D.prototype.update = function(firstTime) {
    // // si hay que dibujar entonces se dibuja
    // if ( this.evaluator.evalExpression(this.drawif) > 0 ) {    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = descartesJS.getColor(this.evaluator, this.background);
    this.ctx.fillRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);

    // la escena no se esta moviendo
    if (!this.click) {
      this.scene = new descartesJS.Scene(this);

      //se dibujan las graficas que no son del fondo
      for(var i=0, l=this.graphics.length; i<l; i++) {
        var thisGraphics_i = this.graphics[i];
        // if (!thisGraphics_i.background) {
          thisGraphics_i.update();
        // }
      }
    }

    this.scene.draw();

    // }
  }

  /**
   * 
   */
  descartesJS.Space3D.prototype.transformCoordinateX = function(x) {
    var w_2 = this.w/2;
    return MathFloor(x*w_2 + w_2 + this.Ox);
  }
  
  /**
   * 
   */
  descartesJS.Space3D.prototype.transformCoordinateY = function(y) {
    var h_2 = this.h/2;
    return MathFloor(-y*h_2 + h_2 + this.Oy);
  }

  /**
   * Se registran los eventos del mouse del espacio
   */
  descartesJS.Space3D.prototype.registerMouseEvents = function() {
    // se crea una variable con el valor del objeto (Space2D) para que el ambiente de las funciones pueda utilizarlo
    var self = this;
    var hasTouchSupport = descartesJS.hasTouchSupport;
    var oldMouse = {x: 0, y: 0};

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

//       // se desactivan los controles graficos
//       self.parent.deactivateGraphiControls();

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

      // self.parent.update();
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
      
//       // se desactivan los controles graficos
//       self.parent.deactivateGraphiControls();

      // ie
      if (evt.which == null) {
        self.whichButton = (evt.button < 2) ? "LEFT" : ((evt.button == 4) ? "MIDDLE" : "RIGHT");
      } 
      // los demas
      else {
        self.whichButton = (evt.which < 2) ? "LEFT" : ((evt.which == 2) ? "MIDDLE" : "RIGHT");
      }
      
//       // se bloquea la aparicion del menu contextual y si el espacio no esta fijo se asigna un manejador para el zoom
//       if (self.whichButton == "RIGHT") {
// //        window.oncontextmenu = function () { return false; };
//         window.addEventListener("mouseup", onMouseUp, false);
        

//         if (!self.fixed) {
//           self.clickPosForZoom = (self.getCursorPosition(evt)).y;
//           self.tempScale = self.scale;
//           window.addEventListener("mousemove", onMouseMoveZoom, false);
//         }
//       }
      
      if (self.whichButton == "LEFT") {
        self.parent.evaluator.setVariable(self.id + ".mouse_pressed", 1);

        self.posAnte = self.getCursorPosition(evt);
        oldMouse.x = self.getRelativeX(self.posAnte.x);
        oldMouse.y = self.getRelativeY(self.posAnte.y);

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
//      window.oncontextmenu = "";
      }

//       if (!self.sensitive_to_mouse_movements) {
//         window.removeEventListener("mousemove", onMouseMove, false);
//       }
      window.removeEventListener("mouseup", onMouseUp, false);

// //       if (self.whichButton == "LEFT") {
// //         window.removeEventListener("mousemove", onMouseMove, false);
// //       }      
      
//       // self.parent.update();
      
//       self.parent.update();
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
      // self.clickPosForZoomNew = (self.getCursorPosition(evt)).y;

      // // ## parche para descartes 2 ## //
      // var escalaString = (self.parent.version != 2) ? self.id + ".escala" : "escala";

      // self.evaluator.setVariable(escalaString, self.tempScale + (self.tempScale/45)*((self.clickPosForZoom-self.clickPosForZoomNew)/10));
      
      // self.parent.update();
      
      // evt.preventDefault();
    }

    var cosAlpha;
    var sinAlpha;
    var cosBeta;
    var sinBeta;
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de mover el mouse
     * @private
     */
    function onMouseMove(evt) {
      // // si el espacio no esta fijo entonces se modifica la posicion del origen
      // if (!self.fixed) {
      //   self.posNext = self.getCursorPosition(evt);
      //   var disp = { x:MathFloor(self.posAnte.x-self.posNext.x), 
      //                y:MathFloor(self.posAnte.y-self.posNext.y) };
                    
      //   var OxString = self.id + ".Ox";
      //   var OyString = self.id + ".Oy";
      //   self.parent.evaluator.setVariable(OxString, (self.Ox - disp.x));
      //   self.parent.evaluator.setVariable(OyString, (self.Oy - disp.y));
      //   self.posAnte.x -= disp.x;
      //   self.posAnte.y -= disp.y;
      // }

      if (self.click) {
        onSensitiveToMouseMovements(evt);
        // self.alpha = (self.alpha + (self.mouse_x - oldMouse.x)*.2);
        // self.beta = (self.beta + (self.mouse_y - oldMouse.y)*.2);
        self.alpha = (self.alpha + (self.mouse_x - oldMouse.x));
        self.beta = (self.beta + (self.mouse_y - oldMouse.y));
        // console.log(self.alpha, self.beta)
        cosAlpha = MathCos(-self.alpha);
        sinAlpha = MathSin(-self.alpha);
        cosBeta = MathCos(self.beta);
        sinBeta = MathSin(self.beta);

// ca=cos(-alfa);sa=sen(-alfa);cb=cos(beta);sb=sen(beta);ux=ca*cb;uy=sa*cb;uz=sb;Xx=-sa;Xy=ca;Xz=0;Yx=-sb*ca;Yy=-sb*sa;Yz=cb;

        // self.eye = new descartesJS.Vector3D(self.distanceEyeCenter*cosAlpha*cosBeta, self.distanceEyeCenter*sinAlpha*cosBeta, self.distanceEyeCenter*sinBeta);
        self.eye.set(self.distanceEyeCenter*cosAlpha*cosBeta, 
                     self.distanceEyeCenter*sinAlpha*cosBeta, 
                    -self.distanceEyeCenter*sinBeta);

        self.yUpEye = self.yUpEye.set(MathCos(-self.alpha - Math.PI/2), 
                                      MathSin(-self.alpha - Math.PI/2), 
                                      0
                                     ).crossProduct(self.eye).normalize();

        self.lookAtMatrix = self.lookAtMatrix.setIdentity().lookAt(self.eye, self.center, self.yUpEye);

        self.perspectiveMatrix = self.perspective.multiply(self.lookAtMatrix);
      
        oldMouse = { x: self.mouse_x, y: self.mouse_y };
      }

      // // intenta mantener el gesto de deslizar en las tablets
      // if ((!self.fixed) || (self.sensitive_to_mouse_movements)) {
      //   evt.preventDefault();
      // }
    }
  }
  
  
  return descartesJS;
})(descartesJS || {});
