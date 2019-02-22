/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathMax   = Math.max;
  var MathCos   = Math.cos;
  var MathSin   = Math.sin;
  var minScale = 0.000001;
  var maxScale = 1000000;

  var evaluator;
  var parent;
  var self;
  var thisGraphics_i;
  var thisGraphicsNext;
  var changeX;
  var changeY;
  var dispX;
  var dispY;

  var angle;
  var cosAngle;
  var sinAngle;
  var newV1;

  var r;
  var g;
  var b;
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

  var observerSet;

  var auxVertex;

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
    self.backCanvas = document.createElement("canvas");
    self.backCanvas.id = self.id + "_background";
    self.backCanvas.setAttribute("width", self.w + "px");
    self.backCanvas.setAttribute("height", self.h + "px");
  
    self.canvas = document.createElement("canvas");
    self.canvas.id = self.id + "_canvas";
    self.canvas.setAttribute("width", self.w + "px");
    self.canvas.setAttribute("height", self.h + "px");
    self.canvas.className = "DescartesSpace3DCanvas";
    self.canvas.setAttribute("style", "z-index: " + self.zIndex + ";");
    self.ctx = self.canvas.getContext("2d");
    self.ctx.imageSmoothingEnabled = false;

    // variable to expose the image of the space
    var id_name = self.id + ".image";
    self.parent.images[id_name] = self.canvas;
    self.parent.images[id_name].ready = 1;
    self.parent.images[id_name].complete = true;
    self.parent.images[id_name].canvas = true;
    self.evaluator.setVariable(id_name, id_name);

    // create a graphic control container
    self.graphicControlContainer = document.createElement("div");
    self.graphicControlContainer.id = self.id + "_graphicControls";
    self.graphicControlContainer.setAttribute("style", "position:absolute;left:0px;top:0px;z-index:" + self.zIndex + ";");

    // create a control container
    self.numericalControlContainer = document.createElement("div");
    self.numericalControlContainer.id = self.id + "_numericalControls";
    self.numericalControlContainer.setAttribute("style", "position:absolute;left:0px;top:0px;z-index:" + self.zIndex + ";");

    // create the principal container
    self.container = document.createElement("div");
    self.container.id = self.id;
    self.container.className = "DescartesSpace3DContainer";
    self.container.setAttribute("style", "left:" + self.x + "px;top:" + self.y + "px;z-index:" + self.zIndex + ";");

    // add the elements to the container
    self.container.appendChild(self.backCanvas);
    self.container.appendChild(self.canvas);
    self.container.appendChild(self.graphicControlContainer);
    self.container.appendChild(self.numericalControlContainer);

    parent.container.insertBefore(self.container, parent.loader);

    self.eye = { x: 0, y: 0, z: 0 };

    self.lights = [ 
      { x: 50, y:  50, z: 70},
      { x: 50, y: -50, z: 30},
      { x: 20, y:   0, z: -80},
      { x:  0, y:   0, z: 0}
    ];
    for (var i=0, l=self.lights.length; i<l; i++) {
      self.lights[i] = descartesJS.normalize3D(self.lights[i]);
    }
    self.light3 = { x:0, y:0, z:0 };

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
    self.ojoXStr = self.id + ".Ojo.x";
    self.ojoYStr = self.id + ".Ojo.y";
    self.ojoZStr = self.id + ".Ojo.z";
    self.rotZStr = self.id + ".rot.z";
    self.rotYStr = self.id + ".rot.y";
    self.userIDimStr = self.id + ".userIlum.dim";
    self.userIIStr = self.id + ".userIlum.I";
    self.userIxStr = self.id + ".userIlum.x";
    self.userIyStr = self.id + ".userIlum.y";
    self.userIzStr = self.id + ".userIlum.z";

    // set the value to the rotation variables
    self.evaluator.setVariable(self.rotZStr, 0);
    self.evaluator.setVariable(self.rotYStr, 0);
    self.evaluator.setVariable(self.userIDimStr, self.dim);
    self.evaluator.setVariable(self.userIIStr, self.userIntensity);
    self.evaluator.setVariable(self.userIxStr, 0);
    self.evaluator.setVariable(self.userIyStr, 0);
    self.evaluator.setVariable(self.userIzStr, 0);

    // function to calc the position of a external point
    auxVertex = new descartesJS.Primitive3D( { vertices: [new descartesJS.Vector4D(0, 0, 0, 1)],
                                               type: "vertex"
                                             },
                                             self );
    self.evaluator.setFunction(self.id + "._X3D2D_", function(x, y, z) {
      auxVertex.vertices[0].x = x;
      auxVertex.vertices[0].y = y;
      auxVertex.vertices[0].z = z;
      auxVertex.computeDepth(self)
      return auxVertex.projVert[0].x;
    });
    self.evaluator.setFunction(self.id + "._Y3D2D_", function(x, y, z) {
      auxVertex.vertices[0].x = x;
      auxVertex.vertices[0].y = y;
      auxVertex.vertices[0].z = z;
      auxVertex.computeDepth(self)
      return auxVertex.projVert[0].y;
    });
    //

    if(self.resizable) {
      self.wModExpr = parent.evaluator.parser.parse(self.wModExpr);
      self.hModExpr = parent.evaluator.parser.parse(self.hModExpr);
    }
    // self.ratio = parent.ratio;
    self.ratio = 1;


    // register the mouse and touch events
    self.addEvents();
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
    // self.uber.init.call(self);
    self.initSpace();

    // update the size of the canvas if has some regions
    if (self.canvas) {
      self.canvas.width  = self.backCanvas.width  = self.w;
      self.canvas.height = self.backCanvas.height = self.h;
      self.canvas.style.width  = self.backCanvas.style.width  = self.w + "px";
      self.canvas.style.height = self.backCanvas.style.height = self.h + "px";
    };

    self.w_2 = self.w/2;
    self.h_2 = self.h/2;

    self.w_plus_h = self.w + self.h;

    self.oldMouse = {x: 0, y: 0};

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    var rescale = (self.h/1080)*(40/self.scale);
    self.S = { 
      x: -20.6*rescale,
      y: 0,
      z: 0,
    };
    self.Ojo = {
      x: 3*self.w_2,
      // x: 30*self.w_2,
      y: 0,
      z: 0
    };
    self.evaluator.setVariable(self.ojoXStr, self.Ojo.x);
    self.evaluator.setVariable(self.ojoYStr, self.Ojo.y);
    self.evaluator.setVariable(self.ojoZStr, self.Ojo.z);

    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
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
    self.drawIfValue = evaluator.eval(self.drawif) > 0;

    if (self.drawIfValue) {
      //////////////////////////////////////////////////////////////////////////////////
      // change in the space size
      if (self.resizable) {
        wModExpr = self.evaluator.eval(self.wModExpr);
        hModExpr = self.evaluator.eval(self.hModExpr);

        if ((self.old_w != wModExpr) || (self.old_h != hModExpr)) {
          self.w = wModExpr;
          self.h = hModExpr;
          self.w_2 = self.w/2;
          self.h_2 = self.h/2;
          evaluator.setVariable(self.wStr, self.w);
          evaluator.setVariable(self.hStr, self.h);
          self.old_w = self.w;
          self.old_h = self.h;
          self.canvas.width  = self.backCanvas.width  = self.w *self.ratio;
          self.canvas.height = self.backCanvas.height = self.h *self.ratio;
          self.canvas.style.width  = self.backCanvas.style.width  = self.w + "px";
          self.canvas.style.height = self.backCanvas.style.height = self.h + "px";
          firstTime = true;

          var rescale = (self.h/1080)*(40/self.scale);
          self.S = { 
            x: -20.6*rescale,
            y: 0,
            z: 0,
          };
          self.Ojo = {
            x: 3*self.w_2,
            // x: 30*self.w_2,
            y: 0,
            z: 0
          };
          self.evaluator.setVariable(self.ojoXStr, self.Ojo.x);
          self.evaluator.setVariable(self.ojoYStr, self.Ojo.y);
          self.evaluator.setVariable(self.ojoZStr, self.Ojo.z);

        }
      }
      //////////////////////////////////////////////////////////////////////////////////

      changeX = (self.x !== (evaluator.eval(self.xExpr) + self.displaceRegionWest));
      changeY = (self.y !== (evaluator.eval(self.yExpr) + parent.plecaHeight  + self.displaceRegionNorth));

      // check if the space has change
      self.spaceChange = firstTime ||
                         changeX ||
                         changeY ||
                         (self.drawBefore !== self.drawIfValue) ||
                         (self.Ox !== evaluator.getVariable(self.OxStr)) ||
                         (self.Oy !== evaluator.getVariable(self.OyStr)) ||
                         (self.Ojo.x !== evaluator.getVariable(self.ojoXStr)) ||
                         (self.Ojo.y !== evaluator.getVariable(self.ojoYStr)) ||
                         (self.Ojo.z !== evaluator.getVariable(self.ojoZStr)) ||
                         (self.scale !== evaluator.getVariable(self.scaleStr));

      self.x = (changeX) ? evaluator.eval(self.xExpr) + self.displaceRegionWest : self.x;
      self.y = (changeY) ? evaluator.eval(self.yExpr) + parent.plecaHeight + self.displaceRegionNorth : self.y;
      self.Ojo.x = evaluator.getVariable(self.ojoXStr);
      self.Ojo.y = evaluator.getVariable(self.ojoYStr);
      self.Ojo.z = evaluator.getVariable(self.ojoZStr);
      self.Ox = evaluator.getVariable(self.OxStr);
      self.Oy = evaluator.getVariable(self.OyStr);
      self.scale = evaluator.getVariable(self.scaleStr);
      self.drawBefore = self.drawIfValue;

      if ((firstTime) || (self.observer == undefined)) {
        // check if the observer is the name of some control
        for (var i=0, l=self.parent.controls.length; i<l; i++) {
          if (self.parent.controls[i].id === self.obsStr) {
            observerSet = true;
          }
        }

        if (observerSet) {
          self.observer = evaluator.getVariable(self.obsStr) || (self.w_plus_h) * 2.5;
        }
        else {
          self.observer = (self.w_plus_h) * 2.5;
        }

        self.observer = MathMax(self.observer, 0.25*(self.w_plus_h));

        evaluator.setVariable(self.obsStr, self.observer);
      }

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
      }

      self.container.style.display = "block";

      self.dim = evaluator.getVariable(self.userIDimStr);
      self.userIntensity = evaluator.getVariable(self.userIIStr);
      // user defined light
      self.light3 = { x: parseInt(evaluator.getVariable(self.userIxStr)),
                      y: parseInt(evaluator.getVariable(self.userIyStr)),
                      z: parseInt(evaluator.getVariable(self.userIzStr))
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
   *
   */
  descartesJS.Space3D.prototype.updateCamera = function() {
    // self = this;

    // self.D = self.observer / cfactor;
    // self.eye.x = self.D/self.scale;
    // self.eye.y = 0;
    // self.eye.z = self.D/self.scale*tanTiltAngle;

    this.eye = descartesJS.scalarProduct3D(this.Ojo, 1/this.scale);
// console.log(this.eye, this.Ojo)
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.rotateVertex = function(v) {
    // Z rotation
    angle = descartesJS.degToRad(self.evaluator.getVariable(self.rotZStr));
    cosAngle = MathCos(angle);
    sinAngle = MathSin(angle);

    newV1 = { 
      x: v.x*cosAngle - v.y*sinAngle,
      y: v.x*sinAngle + v.y*cosAngle,
      z: v.z
    };

    // Y rotation
    angle  = descartesJS.degToRad(self.evaluator.getVariable(self.rotYStr));
    cosAngle  = MathCos(angle);
    sinAngle  = MathSin(angle);

    return { 
      x: newV1.z*sinAngle + newV1.x*cosAngle,
      y: newV1.y,
      z: newV1.z*cosAngle - newV1.x*sinAngle
    };
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.project = function(v) {
    self = this;

    var oldProj = this.evaluator.getVariable("URL.oldProj");
    oldProj = true;

    if (oldProj) {
    // old projection
      var lambda = (self.eye.x) / (v.x - self.eye.x);
      var pV = {
        x: self.getAbsoluteX( lambda*( self.eye.y - v.y) ),
        y: self.getAbsoluteY( lambda*( self.eye.z - v.z) ),
        z: self.eye.x - v.x
        // z: self.scale*(self.eye.x - v.x)
      };
  // console.log(v, pV)
      return pV;
    }
    else {
      // new projection
      var _SE = (self.eye.x);
      var fctr = _SE / (-self.S.x + _SE - v.x);
      var pV = {
        x: self.getAbsoluteX( fctr*(v.y - self.S.y) ),
        y: self.getAbsoluteY( fctr*(v.z - self.S.z) ),
        z: self.scale*(self.eye.x - v.x)
      };
  // console.log("nueva", v, pV);
      return pV;
    }
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.computeColor = function(color, primitive, metal) {
    if (color.match("rgba")) {
      color = descartesJS.RGBAToHexColor(color);
    }
    else if (color.match("#")) {
      color = new descartesJS.Color(color.substring(1));
    }

    toEye = descartesJS.subtract3D(this.eye, primitive.average);
    aveDistanceToEye = descartesJS.norm3D(toEye);
    unitToEye = descartesJS.scalarProduct3D(toEye, 1/aveDistanceToEye);

    this.lights[3] = descartesJS.subtract3D(this.light3, primitive.average);
    dl3 = descartesJS.norm3D(this.lights[3]);

    for (var i=0, l=this.intensity.length-1; i<l; i++) {
      intensity[i] = this.intensity[i]*this.dim;
    }
    intensity[3] = ((this.userIntensity*this.userIntensity)/dl3) || 0;

    I = (metal) ? this.dim/2 : this.dim/4;
    c = 0;

    normal = (primitive.direction < 0) ? primitive.normal : descartesJS.scalarProduct3D(primitive.normal, -1);

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

  //********************************************************************************************************************
  //********************************************************************************************************************
  //********************************************************************************************************************

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
    if (!this.click) {
      // update the graphics to build its primitives
      for(var i=0, l=this.graphics.length; i<l; i++) {
        this.graphics[i].update();
      }
      
      this.primitives = [];
      // split the primitives if needed
      if (this.split) {
        for (var i=0, l=this.graphics.length; i<l; i++) {
          thisGraphics_i = this.graphics[i];

          for (var j=i+1; j<l; j++) {
            thisGraphicsNext = this.graphics[j];

            thisGraphics_i.splitFace(thisGraphicsNext);
            thisGraphicsNext.splitFace(thisGraphics_i);
          }

          this.primitives = this.primitives.concat( thisGraphics_i.primitives || [] );
        }
      }
      else {
        for (var i=0, l=this.graphics.length; i<l; i++) {
          thisGraphics_i = this.graphics[i];

          if (thisGraphics_i.split) {
            for (var j=i+1; j<l; j++) {
              thisGraphicsNext = this.graphics[j];

              if (thisGraphicsNext.split) {
                thisGraphics_i.splitFace(thisGraphicsNext);
              }
            }
          }

          this.primitives = this.primitives.concat( thisGraphics_i.primitives || [] );
        }
      }
      // end split
    }

    for(var i=0, l=this.primitives.length; i<l; i++) {
      this.primitives[i].computeDepth(this);
    }

    this.primitives = this.primitives.sort(function (a, b) { return b.depth - a.depth; });
    
    // draw the primitives
    if (this.render === "painter") {
      this.drawPainter(this.primitives);
    }
    else {
      for(var i=0, l=this.primitives.length; i<l; i++) {
        this.primitives[i].draw(this.ctx, this);
      }
    }

    // draw the graphic controls
    for (var i=0, l=this.graphicsCtr.length; i<l; i++) {
      this.graphicsCtr[i].draw();
    }
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.drawPainter = function(primitives) {
    var l = primitives.length;

    for (var i=0; i<l; i++) {
      primitives[i].drawn = false;
      primitives[i].draw(this.ctx, this);
    }

    var V = [];
    var drawface = [];
    var drawix = 0;
    var NC = primitives.length;
    var epsilon0 = 0.001;
    var epsilon = epsilon0;
    var NCa;
    var oneDrawn;
    var canDraw;

    while (true) {
      NCa = NC;
      oneDrawn = false;
      for (var i=0; i<l; i++) {
        if (!primitives[i].drawn) {
          canDraw = true;
          for (var j=0; j<l; j++) {
            if ( (j!=i) && 
                 (!primitives[j].drawn) && 
                 (primitives[i].inFrontOf(V, primitives[j], epsilon))
                ) {
              canDraw = false;
              break;
            }
          }
          if (canDraw) {
            NC--;
            drawface[drawix++] = primitives[i];
            primitives[i].drawn = true;
            oneDrawn = true;
          }
        }
      }
      if (NC == 0) { // PA ended CORRECTLY"
        break;
      } 
      else if (NC == NCa) { // Can't continue;
        epsilon=epsilon*10;

        if (epsilon>0.1) {
//          console.log("Error in Painter Algorithm");
          for (var i=0; i<l; i++) {
            if (!primitives[i].drawn) {
              drawface[drawix++] = primitives[i];
              primitives[i].drawn = true;
            }
          }
          break;
        }
      } 
      else {
        epsilon = epsilon0;
      }
    }

    // draw the primitives
    for (var i=0; i<l; i++) {
      drawface[i].draw(this.ctx, this);
    }
  }

  /**
   * 
   */
  descartesJS.Space3D.prototype.rayFromEye = function(x, y) {
    return {
      x: -this.eye.x,
      y: (x - (this.w_2 + this.Ox))/this.scale - this.eye.y,
      z: ((this.h_2 + this.Oy) - y)/this.scale - this.eye.z
    };
  }


//********************************************************************************************************************
//********************************************************************************************************************
//********************************************************************************************************************

  /**
   * Register the mouse and touch events
   */
  descartesJS.Space3D.prototype.addEvents = function() {
    var self = this;

    this.canvas.oncontextmenu = function () { return false; };

    this.canvas.addEventListener("touchstart", onTouchStart);

    /**
     * @param {Event} evt
     * @private
     */
    function onTouchStart(evt) {
      // remove the focus of the controls
      window.focus();
      document.activeElement.blur();

      self.click = 1;
      self.evaluator.setVariable(self.id + ".mouse_pressed", 1);

      // se desactivan los controles graficos
      self.parent.deactivateGraphiControls();

      self.posAnte = descartesJS.getCursorPosition(evt, self.container);
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
      // remove the focus of the controls
      window.focus();
      document.activeElement.blur();

      self.click = 0;
      self.evaluator.setVariable(self.id + ".mouse_pressed", 0);

      window.removeEventListener("touchmove", onMouseMove, false);
      window.removeEventListener("touchend", onTouchEnd, false);

      evt.preventDefault();

      self.parent.update();
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    ///////////////////////////////////////////////////////////////////////////
    this.canvas.addEventListener("mousedown", onMouseDown);

    /**
     *
     * @param {Event} evt
     * @private
     */
    function onMouseDown(evt) {
      // remove the focus of the controls
      document.body.focus();

      self.click = 1;

      // se desactivan los controles graficos
      self.parent.deactivateGraphiControls();

      self.whichBtn = descartesJS.whichBtn(evt);

      if (self.whichBtn === "R") {
        window.addEventListener("mouseup", onMouseUp);

        self.posObserver = (descartesJS.getCursorPosition(evt, self.container)).x;
        self.posObserverNew = self.posObserver;

        self.posZoom = (descartesJS.getCursorPosition(evt, self.container)).y;
        self.posZoomNew = self.posZoom;

        // if fixed add a zoom manager
        if (!self.fixed) {
          self.tempScale = self.scale;
          self.tempObserver = self.observer;
          window.addEventListener("mousemove", onMouseMoveZoom);
        }
      }

      else if (self.whichBtn == "L") {
        self.evaluator.setVariable(self.id + ".mouse_pressed", 1);

        self.posAnte = descartesJS.getCursorPosition(evt, self.container);
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
      // remove the focus of the controls
      document.body.focus();

      self.click = 0;
      self.evaluator.setVariable(self.id + ".mouse_pressed", 0);
      evt.preventDefault();

      if (self.whichBtn === "R") {
        window.removeEventListener("mousemove", onMouseMoveZoom, false);

        // show the external space
        if ((self.posZoom == self.posZoomNew) && (descartesJS.showConfig)) {
          self.parent.externalSpace.show();
        }
      }

      window.removeEventListener("mousemove", onMouseMove, false);
      window.removeEventListener("mouseup", onMouseUp, false);

      self.parent.update();
    }

    /**
     *
     * @param {Event} evt
     * @private
     */
    function onSensitiveToMouseMovements(evt) {
      self.posAnte = descartesJS.getCursorPosition(evt, self.container);
      self.mouse_x = self.getRelativeX(self.posAnte.x);
      self.mouse_y = self.getRelativeY(self.posAnte.y);
      self.evaluator.setVariable(self.id + ".mouse_x", self.mouse_x);
      self.evaluator.setVariable(self.id + ".mouse_y", self.mouse_y);

      // limit the number of updates in the lesson
      self.parent.update();
    }

    /**
     *
     * @param {Event} evt
     * @private
     */
    function onMouseMoveZoom(evt) {
      evt.preventDefault();

      self.posZoomNew = (descartesJS.getCursorPosition(evt, self.container)).y;
      self.evaluator.setVariable(self.scaleStr, self.tempScale + (self.tempScale/45)*((self.posZoom-self.posZoomNew)/10));

      self.posObserverNew = (descartesJS.getCursorPosition(evt, self.container)).x;
      self.evaluator.setVariable(self.obsStr, self.tempObserver - (self.posObserver-self.posObserverNew)*2.5);

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
        dispX = (self.getAbsoluteX(self.oldMouse.x)  - self.getAbsoluteX(self.mouse_x))/4;
        dispY = (-self.getAbsoluteY(self.oldMouse.y) + self.getAbsoluteY(self.mouse_y))/4;

        if ((dispX !== self.disp.x) || (dispY !== self.disp.y)) {
          self.alpha = descartesJS.degToRad( self.evaluator.getVariable(self.rotZStr));
          self.beta  = descartesJS.degToRad(-self.evaluator.getVariable(self.rotYStr));

          self.alpha = descartesJS.radToDeg(self.alpha) - dispX;
          self.beta  = descartesJS.radToDeg(self.beta)  - dispY;

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

    /**
     * dbclick
     */
    this.canvas.addEventListener("dblclick", function(evt) {
      // self.parent.externalSpace.show();
    });
  }

  return descartesJS;
})(descartesJS || {});
