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
  var self;
  var thisGraphics_i;
  var hasTouchSupport;
  
  /**
   * Descartes 3D space
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.Space3D = function(parent, values) {
    // call the parent constructor
    descartesJS.Space.call(this, parent, values);
    
    self = this;

    // create the canvas
    self.backgroundCanvas = document.createElement("canvas");
    self.backgroundCanvas.setAttribute("id", self.id + "_background");
    self.backgroundCanvas.setAttribute("width", self.w + "px");
    self.backgroundCanvas.setAttribute("height", self.h + "px");
    self.backgroundCtx = self.backgroundCanvas.getContext("2d");
    self.backgroundCtx.imageSmoothingEnabled = false;
    self.backgroundCtx.mozImageSmoothingEnabled = false;
    self.backgroundCtx.webkitImageSmoothingEnabled = false;

    self.canvas = document.createElement("canvas");
    self.canvas.setAttribute("id", self.id + "_canvas");
    self.canvas.setAttribute("width", self.w + "px");
    self.canvas.setAttribute("height", self.h + "px");
    self.canvas.setAttribute("class", "DescartesSpace3DCanvas");
    self.canvas.setAttribute("style", "z-index: " + self.zIndex + ";");
    self.ctx = self.canvas.getContext("2d");
    self.ctx.imageSmoothingEnabled = false;
    self.ctx.mozImageSmoothingEnabled = false;
    self.ctx.webkitImageSmoothingEnabled = false;
    
    // create a graphic control container
    self.graphicControlContainer = document.createElement("div");
    self.graphicControlContainer.setAttribute("id", self.id + "_graphicControls");
    self.graphicControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + self.zIndex + ";");
    
    // create a control container
    self.numericalControlContainer = document.createElement("div");
    self.numericalControlContainer.setAttribute("id", self.id + "_numericalControls");
    self.numericalControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + self.zIndex + ";");

    // create the principal container
    self.container = document.createElement("div");
    self.container.setAttribute("id", self.id);
    self.container.setAttribute("class", "DescartesSpace3DContainer");
    self.container.setAttribute("style", "left: " + self.x + "px; top: " + self.y + "px; z-index: " + self.zIndex + ";");

    // add the elements to the container
    self.container.appendChild(self.backgroundCanvas);
    self.container.appendChild(self.canvas);
    self.container.appendChild(self.graphicControlContainer);
    self.container.appendChild(self.numericalControlContainer);
    
    parent.container.insertBefore(self.container, parent.loader);
    
    // self.eye = new descartesJS.Vector3D(self.scale/5, 2, 5);
    self.eye = new descartesJS.Vector3D(0,0,0);
    self.center = new descartesJS.Vector3D(0, 0, 0);
    self.yUpEye = new descartesJS.Vector3D(0, 0, 1);
    // self.distanceEyeCenter = Math.sqrt(Math.pow(self.eye.x-self.center.x, 2) + Math.pow(self.eye.y-self.center.y, 2) + Math.pow(self.eye.z-self.center.z, 2));
    self.distanceEyeCenter = 10;
    self.alpha = Math.PI/4;
    self.beta = -Math.PI/5;
    
    // self.lookAtMatrix = (new descartesJS.Matrix4x4()).lookAt(self.eye, self.center, self.yUpEye);
    // self.perspectiveMatrix = perspective.multiply(self.lookAtMatrix);

    self.lookAtMatrix = new descartesJS.Matrix4x4();
    self.perspectiveMatrix = new descartesJS.Matrix4x4();
    self.perspective = (new descartesJS.Matrix4x4()).perspective(45, self.w/self.h, 0.01, 1000.0);

    cosAlpha = MathCos(-self.alpha);
    sinAlpha = MathSin(-self.alpha);
    cosBeta = MathCos(self.beta);
    sinBeta = MathSin(self.beta);

    self.eye.set(self.distanceEyeCenter*cosAlpha*cosBeta, 
                 self.distanceEyeCenter*sinAlpha*cosBeta, 
                -self.distanceEyeCenter*sinBeta);

    self.yUpEye = self.yUpEye.set(MathCos(-self.alpha - Math.PI/2), MathSin(-self.alpha - Math.PI/2), 0).crossProduct(self.eye).normalize();

    self.lookAtMatrix = self.lookAtMatrix.setIdentity().lookAt(self.eye, self.center, self.yUpEye);

    self.perspectiveMatrix = self.perspective.multiply(self.lookAtMatrix);

    // register the mouse and touch events
    self.registerMouseAndTouchEvents();

    self.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Space3D, descartesJS.Space);

  /**
   * Init the space
   */
  descartesJS.Space3D.prototype.init = function() {
    self = this;
    
    // call the init of the parent
    self.uber.init.call(self);

    // update the size of the canvas if has some regions
    if (self.canvas) {
      self.backgroundCanvas.setAttribute("width", self.w + "px");
      self.backgroundCanvas.setAttribute("height", self.h + "px");
      self.canvas.setAttribute("width", self.w + "px");
      self.canvas.setAttribute("height", self.h + "px");
    };

    // find the offset of the container
    if (self.container) {
      self.findOffset();
    }

    self.w_2 = self.w/2;
    self.h_2 = self.h/2;
  }

  /**
   * Update the space
   * @param {Boolean} firstTime condition if is the first time in draw the space
   */
  descartesJS.Space3D.prototype.update = function(firstTime) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = descartesJS.getColor(this.evaluator, this.background);
    this.ctx.fillRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);

    // the scene is not moving
    if (!this.click) {
      this.scene = new descartesJS.Scene(this);

      //se dibujan las graficas que no son del fondo
      for(var i=0, l=this.graphics.length; i<l; i++) {
        thisGraphics_i = this.graphics[i];
        thisGraphics_i.update();
      }
    }

    this.scene.draw();
  }

  /**
   * 
   */
  descartesJS.Space3D.prototype.transformCoordinateX = function(x) {
    return MathFloor((x+1)*this.w_2 + this.Ox);
  }
  
  /**
   * 
   */
  descartesJS.Space3D.prototype.transformCoordinateY = function(y) {
    return MathFloor((1-y)*this.h_2 + this.Oy);
  }

  /**
   * Register the mouse and touch events
   */
  descartesJS.Space3D.prototype.registerMouseAndTouchEvents = function() {
    var self = this;
    hasTouchSupport = descartesJS.hasTouchSupport;
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
      self.evaluator.setVariable(self.id + ".mouse_pressed", 1);

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
      self.evaluator.setVariable(self.id + ".mouse_pressed", 0);

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
      
      if (self.whichButton == "LEFT") {
        self.evaluator.setVariable(self.id + ".mouse_pressed", 1);

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
     * @param {Event} evt 
     * @private
     */
    function onMouseUp(evt) {
      self.click = 0;
      self.evaluator.setVariable(self.id + ".mouse_pressed", 0);
      evt.preventDefault();

      if (self.whichButton == "RIGHT") {
        window.removeEventListener("mousemove", onMouseMoveZoom, false);
      }

      window.removeEventListener("mouseup", onMouseUp, false);
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onSensitiveToMouseMovements(evt) {
      self.posAnte = self.getCursorPosition(evt);
      self.mouse_x = self.getRelativeX(self.posAnte.x);
      self.mouse_y = self.getRelativeY(self.posAnte.y);

      self.evaluator.setVariable(self.id + ".mouse_x", self.mouse_x);
      self.evaluator.setVariable(self.id + ".mouse_y", self.mouse_y);

      self.parent.update();
    }
    
    /**
     *
     * @param {Event} evt 
     * @private
     */
    function onMouseMoveZoom(evt) {
    }

    var cosAlpha;
    var sinAlpha;
    var cosBeta;
    var sinBeta;
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseMove(evt) {
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
    }
  }
  
  
  return descartesJS;
})(descartesJS || {});