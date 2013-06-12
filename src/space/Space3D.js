/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathRound = Math.round;
  var MathMax   = Math.max;
  var MathCos   = Math.cos;
  var MathSin   = Math.sin;
  var MathSqrt  = Math.sqrt;
  var MathPI_2  = Math.PI/2;
  var tiltAngle = Math.PI*15/180;
  var minScale = 0.000001;
  var maxScale = 1000000;

  var evaluator;
  var parent;
  var self;
  var thisGraphics_i;
  var thisGraphicsNext;
  var primitives;
  var primitivesLength;
  var hasTouchSupport;
  var changeX;
  var changeY;
  var dispX;
  var dispY;

  var dx;
  var dy;
  var dz;
  var t;

  var angle;
  var cosAngle;
  var sinAngle;
  var newV1;

  var r;
  var g;
  var b;
  var angle;
  var dl3;
  var intensity = [];
  var I;
  var c;
  var normal;
  var toEye;
  var aveDistanceToEye;
  var unitToEye;

  var t_rr;
  var r_rr;
  var N_rr;

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
    // self.backgroundCtx = self.backgroundCanvas.getContext("2d");
    // self.backgroundCtx.imageSmoothingEnabled = false;
    // self.backgroundCtx.mozImageSmoothingEnabled = false;
    // self.backgroundCtx.webkitImageSmoothingEnabled = false;

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
    
    self.eye = { x: 0, y: 0, z: 0 };

    self.lights = [ { x: 50, y:  50, z: 70},
                    { x: 50, y: -50, z: 30},
                    { x: 20, y:   0, z: -80},
                    { x:  0, y:   0, z: 0}
                  ];
    for (var i=0, l=self.lights.length; i<l; i++) {
      self.lights[i] = descartesJS.normalize3D(self.lights[i]);
    }
    self.light3 = { x:  0, y:   0, z: 0};

    self.intensity = [.4, .5, .3, 0];
    self.userIntensity = 0;
    self.dim = 1;
    self.tmpIntensity = [];
    
    self.OxStr = self.id + ".Ox";
    self.OyStr = self.id + ".Oy";
    self.scaleStr = self.id + ".escala";
    self.wStr = self.id + "._w";
    self.hStr = self.id + "._h";
    self.obsStr = self.id + ".observador";
    self.rotZStr = self.id + ".rot.z";
    self.rotYStr = self.id + ".rot.y";
    self.userI_Dim_Str = self.id + ".userIlum.dim";
    self.userI_I_Str = self.id + ".userIlum.I";
    self.userI_x_Str = self.id + ".userIlum.x";
    self.userI_y_Str = self.id + ".userIlum.y";
    self.userI_z_Str = self.id + ".userIlum.z";

    // set the value to the rotation variables
    self.evaluator.setVariable(self.rotZStr, 0);
    self.evaluator.setVariable(self.rotYStr, 0);
    self.evaluator.setVariable(self.userI_Dim_Str, self.dim);
    self.evaluator.setVariable(self.userI_I_Str, self.userIntensity);
    self.evaluator.setVariable(self.userI_x_Str, 0);
    self.evaluator.setVariable(self.userI_y_Str, 0);
    self.evaluator.setVariable(self.userI_z_Str, 0);

    // register the mouse and touch events
    self.registerMouseAndTouchEvents();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Space3D, descartesJS.Space);

  /**
   * Init the space
   */
  descartesJS.Space3D.prototype.init = function(checkObserver) {
    self = this;
    
    // call the init of the parent
    self.uber.init.call(self);

    // update the size of the canvas if has some regions
    if (self.canvas) {
      // self.backgroundCanvas.setAttribute("width", self.w + "px");
      // self.backgroundCanvas.setAttribute("height", self.h + "px");
      self.canvas.setAttribute("width", self.w + "px");
      self.canvas.setAttribute("height", self.h + "px");
    };

    // find the offset of the container
    if (self.container) {
      self.findOffset();
    }

    self.w_2 = self.w/2;
    self.h_2 = self.h/2;

    self.oldMouse = {x: 0, y: 0};
  }

  /**
   * Update the space
   * @param {Boolean} firstTime condition if is the first time in draw the space
   */
  descartesJS.Space3D.prototype.update = function(firstTime) {
    self = this;
    evaluator = self.evaluator;
    parent = self.parent;

    // prevents the change of the width and height from an external change
    evaluator.setVariable(self.wStr, self.w);
    evaluator.setVariable(self.hStr, self.h);

    // check the draw if condition
    self.drawIfValue = evaluator.evalExpression(self.drawif) > 0;

    if (self.drawIfValue) {
      changeX = (self.x !== (evaluator.evalExpression(self.xExpr) + self.displaceRegionWest));
      changeY = (self.y !== (evaluator.evalExpression(self.yExpr) + parent.plecaHeight  + self.displaceRegionNorth));

      // check if the space has change
      self.spaceChange = firstTime ||
                         changeX ||
                         changeY ||
                         (self.drawBefore !== self.drawIfValue) ||
                         (self.Ox !== evaluator.getVariable(self.OxStr)) ||
                         (self.Oy !== evaluator.getVariable(self.OyStr)) ||
                         (self.scale !== evaluator.getVariable(self.scaleStr));

      self.x = (changeX) ? evaluator.evalExpression(self.xExpr) + self.displaceRegionWest : self.x;
      self.y = (changeY) ? evaluator.evalExpression(self.yExpr) + parent.plecaHeight + self.displaceRegionNorth : self.y;
      self.Ox = evaluator.getVariable(self.OxStr);
      self.Oy = evaluator.getVariable(self.OyStr);
      self.scale = evaluator.getVariable(self.scaleStr);
      self.drawBefore = self.drawIfValue;

      if (firstTime) {
        var observerSet;
        // check if the observer is the name of some control
        for (var i=0, l=self.parent.controls.length; i<l; i++) {
          if (self.parent.controls[i].id === self.obsStr) {
            observerSet = true;
          }
        }

        if (observerSet) {
          self.observer = evaluator.getVariable(self.obsStr) || (self.w + self.h) * 0.5;
        }
        else {
          self.observer = (self.w + self.h) * 2.5;
        }

        self.observer = MathMax(self.observer, 0.1*(self.w+self.h));

        evaluator.setVariable(self.obsStr, self.observer);

        ////////////////////////////////////////////////////////////////////////////////////////////////
        self.eye = { x: (self.observer/self.scale)*MathCos(tiltAngle), 
                     y: 0, 
                     z: (self.observer/self.scale)*MathSin(tiltAngle)
                   };
        self.D = self.scale*self.eye.x/MathCos(tiltAngle);
        self.XE = MathRound(self.scale*self.eye.y +0.5);
        self.YE = MathRound(self.scale*self.eye.z +0.5);
        ////////////////////////////////////////////////////////////////////////////////////////////////
      }

      self.observer = MathMax(evaluator.getVariable(self.obsStr), 0.1*(self.w+self.h));
      evaluator.setVariable(self.obsStr, self.observer);

      // check if the scale is not below the lower limit
      if (self.scale < minScale) {
        self.scale = minScale;
        evaluator.setVariable(self.scaleStr, minScale);
      }
      // check if the scale is not above the upper limit
      else if (self.scale > maxScale) {
        self.scale = maxScale;
        evaluator.setVariable(self.scaleStr, maxScale);
      }

      // if some property change then adjust the container style
      if ((changeX) || (changeY)) {
        self.container.style.left = self.x + "px";
        self.container.style.top = self.y + "px";
        self.findOffset();
      }

      self.container.style.display = "block";

      self.dim = evaluator.getVariable(self.userI_Dim_Str);
      self.userIntensity = evaluator.getVariable(self.userI_I_Str);
      // user defined light
      self.light3 = { x: parseInt(evaluator.getVariable(self.userI_x_Str)),
                      y: parseInt(evaluator.getVariable(self.userI_y_Str)),
                      z: parseInt(evaluator.getVariable(self.userI_z_Str))
                    };

      self.updateCamera();

      // draw the geometry
      self.draw();
    }
    // hide the space
    else {
      self.container.style.display = "none";
    }
  }

  /**
   * Auxiliary function to sort the primitives
   */
  function depthSort(a, b) {
    return b.depth - a.depth;
  }

  /**
   * Draw the primitives of the graphics, the primitives are obtained from the update step
   */
  descartesJS.Space3D.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = this.background.getColor();
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // draw the background image if any
    if ( (this.image) && (this.image.src != "") && (this.image.ready) && (this.image.complete) ) {
      if (this.bg_display === "topleft") {
        this.ctx.drawImage(this.image, 0, 0);
      } 
      else if (this.bg_display === "stretch") {
        this.ctx.drawImage(this.image, 0, 0, this.w, this.h);
      } 
      else if (this.bg_display === "patch") {
        this.ctx.fillStyle = ctx.createPattern(this.image, "repeat");
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
      else if (this.bg_display === "center") {
        this.ctx.drawImage(this.image, (this.w-this.image.width)/2, (this.h-this.image.height)/2);
      }
    }

    // if not interact with the space
    // if (!this.click) {
      // update the graphics to build its primitives
      for(var i=0, l=this.graphics.length; i<l; i++) {
        thisGraphics_i = this.graphics[i];
        thisGraphics_i.update();
      }
    // }

    this.primitives = [];

    // split the primitives if needed
    for (var i=0, l=this.graphics.length; i<l; i++) {
      thisGraphics_i = this.graphics[i];

      if ((thisGraphics_i.split) || (this.split)) {
        for (var j=i+1; j<l; j++) {
          thisGraphicsNext = this.graphics[j];

          if ((thisGraphicsNext.split) || (this.split)) {
            thisGraphics_i.splitFace(thisGraphicsNext);
          }
        }
      }

      this.primitives = this.primitives.concat( thisGraphics_i.primitives || [] );
    }

    primitives = this.primitives;
    primitivesLength = primitives.length;

    for(var i=0; i<primitivesLength; i++) {
      primitives[i].computeDepth(this);
    }

    primitives = primitives.sort(depthSort);

    for(var i=0; i<primitivesLength; i++) {
      primitives[i].draw(this.ctx, this);
    }

    // draw the graphic controls
    for (var i=0, l=this.graphicsCtr.length; i<l; i++) {
      this.graphicsCtr[i].draw();
    }
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.updateCamera = function() {
    self = this;

    self.D = self.observer;

    self.eye.x = self.D/self.scale;
    self.eye.y = self.XE/self.scale;
    self.eye.z = self.YE/self.scale;
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.rotateVertex = function(v) {
    // Z rotation
    angle = descartesJS.degToRad(self.evaluator.getVariable(self.rotZStr));
    cosAngle = MathCos(angle);
    sinAngle = MathSin(angle);

    newV1 = { x: v.x*cosAngle - v.y*sinAngle,
              y: v.x*sinAngle + v.y*cosAngle,
              z: v.z
            };

    // Y rotation    
    angle  = descartesJS.degToRad(self.evaluator.getVariable(self.rotYStr));
    cosAngle  = MathCos(angle);
    sinAngle  = MathSin(angle);

    return { x: newV1.z*sinAngle + newV1.x*cosAngle,
             y: newV1.y,
             z: newV1.z*cosAngle - newV1.x*sinAngle
           };
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.project = function(v) {
    self = this;

    dx = self.eye.x - v.x;
    dy = self.eye.y - v.y;
    dz = self.eye.z - v.z;
    t = -v.x/MathSqrt(dx*dx + dy*dy + dz*dz) || 0;

    dx =  self.scale*(v.y + t*(self.eye.y - v.y));
    dy = -self.scale*(v.z + t*(self.eye.z - v.z));

    return { x: parseInt(dx +this.w_2 +this.Ox),
             y: parseInt(dy +this.h_2 +this.Oy),
             z: t
           };
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.computeColor = function(color, primitive, metal) {
    toEye = descartesJS.subtract3D(this.eye, primitive.average);
    aveDistanceToEye = descartesJS.norm3D(toEye);
    unitToEye = descartesJS.scalarProduct3D(toEye, 1/aveDistanceToEye);

    this.lights[3] = descartesJS.subtract3D( this.light3, primitive.average);
    dl3 = descartesJS.norm3D(this.lights[3]);

    for (var i=0, l=this.intensity.length-1; i<l; i++) {
      intensity[i] = this.intensity[i]*this.dim;
    }
    intensity[3] = ((this.userIntensity*this.userIntensity)/dl3) || 0;

    I = (metal) ? this.dim/2 : this.dim/4;
    c = 0;

    normal = (primitive.direction >=0) ? primitive.normal : descartesJS.scalarProduct3D(primitive.normal, -1);

    for (var i=0, l=this.lights.length; i<l; i++) {
      if (metal) {
        c = Math.max( 0, descartesJS.dotProduct3D(reflectedRay(this.lights[i], normal), unitToEye) );
        c = c*c*c;
      }
      else {
        c = Math.max(0, descartesJS.dotProduct3D(this.lights[i], normal));
      }

      I+= intensity[i]*c;
    }
    I = Math.min(I, 1);

    r = MathFloor(color.r*I);
    g = MathFloor(color.g*I);
    b = MathFloor(color.b*I);

    return "rgba(" + r + "," + g + "," + b + "," + color.a + ")";
  }    

  /**
   *
   */
  function reflectedRay(l, uN) {
    t_rr = descartesJS.subtract3D(l, descartesJS.scalarProduct3D(uN, descartesJS.dotProduct3D(l, uN)));
    r_rr = descartesJS.add3D(l, descartesJS.scalarProduct3D(t_rr, -2));
    N_rr = descartesJS.norm3D(r_rr);
    if (N_rr !== 0) {
      return descartesJS.scalarProduct3D(r_rr, 1/N_rr);
    }
    return descartesJS.scalarProduct3D(l, -1);
  }

  /**
   * Register the mouse and touch events
   */
  descartesJS.Space3D.prototype.registerMouseAndTouchEvents = function() {
    self = this;

    hasTouchSupport = descartesJS.hasTouchSupport;

    this.canvas.oncontextmenu = function () { return false; };

    if (hasTouchSupport) {
      // if (this.sensitive_to_mouse_movements) {
      //   this.canvas.addEventListener("touchmove",  onSensitiveToMouseMovements);
      // }
      this.canvas.addEventListener("touchstart", onTouchStart);
    }

    /**
     * @param {Event} evt
     * @private
     */
    function onTouchStart(evt) {
      self.click = 1;
      self.evaluator.setVariable(self.id + ".mouse_pressed", 1);

      // se desactivan los controles graficos
      self.parent.deactivateGraphiControls();

      self.posAnte = self.getCursorPosition(evt);
      self.oldMouse.x = self.getRelativeX(self.posAnte.x);
      self.oldMouse.y = self.getRelativeY(self.posAnte.y);

      onSensitiveToMouseMovements(evt);

      window.addEventListener("touchmove", onMouseMove);
      window.addEventListener("touchend", onTouchEnd);

      // if ((!self.fixed) || (self.sensitive_to_mouse_movements)) {
        evt.preventDefault();
      // }
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onTouchEnd(evt) {
      self.click = 0;
      self.evaluator.setVariable(self.id + ".mouse_pressed", 0);

      window.removeEventListener("touchmove", onMouseMove, false);
      window.removeEventListener("touchend", onTouchEnd, false);

      evt.preventDefault();
    }
  
    ///////////////////////////////////////////////////////////////////////////
    // 
    ///////////////////////////////////////////////////////////////////////////
    if (!hasTouchSupport) {
      // if (this.sensitive_to_mouse_movements) {
      //   this.canvas.addEventListener("mousemove", onSensitiveToMouseMovements);
      // }
      this.canvas.addEventListener("mousedown", onMouseDown);
    }
    
    /**
     * 
     * @param {Event} evt
     * @private
     */
    function onMouseDown(evt) {
      self.click = 1;

      // se desactivan los controles graficos
      self.parent.deactivateGraphiControls();
      
      self.whichButton = descartesJS.whichButton(evt);

      if (self.whichButton === "R") {
        window.addEventListener("mouseup", onMouseUp);
        
        // if fixed add a zoom manager
        if (!self.fixed) {
          self.clickPosForZoom = (self.getCursorPosition(evt)).y;
          self.tempScale = self.scale;
          window.addEventListener("mousemove", onMouseMoveZoom);
        }
      }

      else if (self.whichButton == "L") {
        self.evaluator.setVariable(self.id + ".mouse_pressed", 1);

        self.posAnte = self.getCursorPosition(evt);
        self.oldMouse.x = self.getRelativeX(self.posAnte.x);
        self.oldMouse.y = self.getRelativeY(self.posAnte.y);

        onSensitiveToMouseMovements(evt);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
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

      if (self.whichButton === "R") {
        window.removeEventListener("mousemove", onMouseMoveZoom, false);
      }

      window.removeEventListener("mousemove", onMouseMove, false);
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
      evt.preventDefault();

      self.clickPosForZoomNew = (self.getCursorPosition(evt)).y;

      self.evaluator.setVariable(self.scaleStr, self.tempScale + (self.tempScale/45)*((self.clickPosForZoom-self.clickPosForZoomNew)/10));

      self.parent.update();
    }
    
    this.disp = {x: 0, y: 0};

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseMove(evt) {
      if ((!self.fixed) && (self.click)) {

        dispX = parseInt((self.oldMouse.x - self.mouse_x)*50);
        dispY = parseInt((self.oldMouse.y - self.mouse_y)*50);

        if ((dispX !== self.disp.x) || (dispY !== self.disp.y)) {
          self.alpha = descartesJS.degToRad( self.evaluator.getVariable(self.rotZStr));
          self.beta  = descartesJS.degToRad(-self.evaluator.getVariable(self.rotYStr));

          self.alpha = MathRound( descartesJS.radToDeg(self.alpha) - dispX );
          self.beta  = MathRound( descartesJS.radToDeg(self.beta)  - dispY );

          // set the value to the rotation variables
          self.evaluator.setVariable(self.rotZStr, self.alpha);
          self.evaluator.setVariable(self.rotYStr, -self.beta);

          self.disp.x = dispX;
          self.disp.y = dispY;

          self.oldMouse.x = self.getRelativeX(self.posAnte.x);
          self.oldMouse.y = self.getRelativeY(self.posAnte.y);
        }

        onSensitiveToMouseMovements(evt);

        evt.preventDefault();
      }
    }
  }
  
  return descartesJS;
})(descartesJS || {});