/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  const minScale = 0.000001;
  const maxScale = 1000000;

  let MathFloor = Math.floor;
  let MathMax   = Math.max;
  let MathCos   = Math.cos;
  let MathSin   = Math.sin;

  let evaluator;
  let parent;
  let self;
  let thisGraphics_i;
  let thisGraphicsNext;
  let changeX;
  let changeY;
  let dispX;
  let dispY;

  let angle;
  let cosAngle;
  let sinAngle;
  let newV1;

  let r;
  let g;
  let b;
  let dl3;
  let intensity = [];
  let I;
  let c;
  let normal;
  let toEye;
  let aveDistanceToEye;
  let unitToEye;

  let t_rr;
  let r_rr;
  let N_rr;

  let observerSet;

  let auxVertex;

  class Space3D extends descartesJS.Space {
    /**
     * Descartes 3D space
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the graphic
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      self = this;
      self.ratio = parent.ratio;

      // create the canvas
      self.backCanvas = descartesJS.newHTML("canvas", {
        id     : self.id + "_background",
        width : (self.w * self.ratio) + "px",
        height : (self.h * self.ratio) + "px", // por alguna razón extraña esto hace que algunas escenas no funcionen en el iPad
      });
    
      self.canvas = descartesJS.newHTML("canvas", {
        id     : self.id + "_canvas",
        width : (self.w * self.ratio) + "px",
        height : (self.h * self.ratio) + "px", // por alguna razón extraña esto hace que algunas escenas no funcionen en el iPad
        class  : "DescartesSpace3DCanvas",
        style  : "z-index: " + self.zIndex + ";",
      });
      self.ctx = self.canvas.getContext("2d");
      self.ctx.imageSmoothingEnabled = false;
      self.canvas.ratio = self.ratio;

      self.canvas.style = self.backCanvas.style = `${(self.border_width>0)?"border:"+self.border_width+"px solid "+self.border_color.getColor()+";" : ""}${self.border_radius?"border-radius:"+self.border_radius+"px;":""}`;

      // variable to expose the image of the space
      let id_name = self.id + ".image";
      self.parent.images[id_name] = self.canvas;
      self.parent.images[id_name].ready = 1;
      self.parent.images[id_name].complete = true;
      self.parent.images[id_name].canvas = true;
      self.evaluator.setVariable(id_name, id_name);

      // create a graphic control container
      self.graphicControlContainer = descartesJS.newHTML("div", {
        id    : self.id + "_graphicControls",
        style : `position:absolute;left:0px;top:0px;z-index:${self.zIndex};`,
      });

      // create a control container
      self.numCtrContainer = descartesJS.newHTML("div", {
        id    : self.id + "_numericalControls",
        style : `position:absolute;left:0px;top:0px;z-index:${self.zIndex};`,
      });

      // create the principal container
      self.container = descartesJS.newHTML("div", {
        id    : self.id,
        class : "DescartesSpace3DContainer",
        style : `z-index:${self.zIndex};`,
      });

      // add the elements to the container
      self.container.appendChild(self.backCanvas);
      self.container.appendChild(self.canvas);
      self.container.appendChild(self.graphicControlContainer);
      self.container.appendChild(self.numCtrContainer);

      parent.container.insertBefore(self.container, parent.loader);

      self.eye = { x: 0, y: 0, z: 0 };

      self.lights = [ 
        { x: 50, y:  50, z: 70},
        { x: 50, y: -50, z: 30},
        { x: 20, y:   0, z: -80},
        { x:  0, y:   0, z: 0}
      ];
      for (let i=0, l=self.lights.length; i<l; i++) {
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
      self.mxStr = self.id + ".mouse_x";
      self.myStr = self.id + ".mouse_y";
      self.mpressedStr = self.id + ".mouse_pressed";
      self.mclickedStr = self.id + ".mouse_clicked";
      self.mclickIzqStr = self.id + ".clic_izquierdo";
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
      auxVertex = new descartesJS.Primitive3D({
        V: [new descartesJS.Vec4D()],
        type: "vertex"
      },
      self);

      self.evaluator.setFunction(self.id + "._X3D2D_", function(x, y, z) {
        auxVertex.V[0].x = x;
        auxVertex.V[0].y = y;
        auxVertex.V[0].z = z;
        auxVertex.computeDepth(self)
        return auxVertex.projV[0].x;
      });
      self.evaluator.setFunction(self.id + "._Y3D2D_", function(x, y, z) {
        auxVertex.V[0].x = x;
        auxVertex.V[0].y = y;
        auxVertex.V[0].z = z;
        auxVertex.computeDepth(self)
        return auxVertex.projV[0].y;
      });
      //

      if(self.resizable) {
        self.wModExpr = parent.evaluator.parser.parse(self.wModExpr);
        self.hModExpr = parent.evaluator.parser.parse(self.hModExpr);
      }


      // register the mouse and touch events
      self.addEvents();
    }

    /**
     * Init the space
     */
    init(checkObserver) {
      self = this;

      // call the init of the parent
      self.initSpace();

      // update the size of the canvas if has some regions
      if (self.canvas) {
        self.old_w = self.w;
        self.old_h = self.h;
        self.canvas.width  = self.backCanvas.width  = self.w *self.ratio;
        self.canvas.height = self.backCanvas.height = self.h *self.ratio;
        self.canvas.style.width  = self.backCanvas.style.width  = self.w + "px";
        self.canvas.style.height = self.backCanvas.style.height = self.h + "px";
      };

      self.w_2 = self.w/2;
      self.h_2 = self.h/2;

      self.w_plus_h = self.w + self.h;

      self.oldMouse = {x: 0, y: 0};

      ////////////////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////
      let rescale = (self.h/1080)*(40/self.scale);
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
    update(firstTime) {
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

            let rescale = (self.h/1080)*(40/self.scale);
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
          for (let i=0, l=self.parent.controls.length; i<l; i++) {
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
          self.container.style.top  = self.y + "px";
        }

        self.container.style.display = "block";

        self.dim = evaluator.getVariable(self.userIDimStr);
        self.userIntensity = evaluator.getVariable(self.userIIStr);
        // user defined light
        self.light3 = { 
          x: parseInt(evaluator.getVariable(self.userIxStr)),
          y: parseInt(evaluator.getVariable(self.userIyStr)),
          z: parseInt(evaluator.getVariable(self.userIzStr))
        };

        self.updateCamera();

        self.ctx.setTransform(self.ratio, 0, 0, self.ratio, 0, 0);

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
    updateCamera() {
      this.eye = descartesJS.scalarProd3D(this.Ojo, 1/this.scale);
    }

    /**
     *
     */
    rotateVertex(v) {
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
    project(v) {
      let lambda = (self.eye.x) / (v.x - self.eye.x);
      return {
        x: self.getAbsoluteX( lambda*( self.eye.y - v.y) ),
        y: self.getAbsoluteY( lambda*( self.eye.z - v.z) ),
        z: self.eye.x - v.x
      };
    }

    /**
     *
     */
    computeColor(color, primitive, metal) {
      if (typeof(color) != "object") {
        if (color.match("rgba")) {
          color = descartesJS.RGBAToHexColor(color);
        }
        else if (color.match("#")) {
          color = new descartesJS.Color(color.substring(1));
        }
      }
      
      toEye = descartesJS.subtract3D(this.eye, primitive.avg);
      aveDistanceToEye = descartesJS.norm3D(toEye);
      unitToEye = descartesJS.scalarProd3D(toEye, 1/aveDistanceToEye);

      this.lights[3] = descartesJS.subtract3D(this.light3, primitive.avg);
      dl3 = descartesJS.norm3D(this.lights[3]);

      for (let i=0, l=this.intensity.length-1; i<l; i++) {
        intensity[i] = this.intensity[i]*this.dim;
      }
      intensity[3] = ((this.userIntensity*this.userIntensity)/dl3) || 0;

      I = (metal) ? this.dim/2 : this.dim/4;
      c = 0;

      normal = (primitive.direction < 0) ? primitive.normal : descartesJS.scalarProd3D(primitive.normal, -1);

      for (let i=0, l=this.lights.length; i<l; i++) {
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

    //********************************************************************************************************************
    //********************************************************************************************************************
    //********************************************************************************************************************

    /**
     * Draw the primitives of the graphics, the primitives are obtained from the update step
     */
    draw() {
      self = this;
      self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
      self.ctx.fillStyle = self.background.getColor();
      self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);

      // draw the background image if any
      if ( (self.image) && (self.image.src != "") && (self.image.ready) && (self.image.complete) ) {
        if (self.bg_display === "topleft") {
          self.ctx.drawImage(self.image, 0, 0);
        }
        else if (self.bg_display === "stretch") {
          self.ctx.drawImage(self.image, 0, 0, self.w, self.h);
        }
        else if (self.bg_display === "patch") {
          self.ctx.fillStyle = ctx.createPattern(self.image, "repeat");
          self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
        }
        else if (self.bg_display === "center") {
          self.ctx.drawImage(self.image, (self.w-self.image.width)/2, (self.h-self.image.height)/2);
        }
      }

      // if not interact with the space
      if (!self.click) {
        // update the graphics to build its primitives
        for (let graphics_i of self.graphics) {
          graphics_i.update();
        }
        
        self.primitives = [];
        // split the primitives if needed
        if (self.split) {
          for (let i=0, l=self.graphics.length; i<l; i++) {
            thisGraphics_i = self.graphics[i];

            for (let j=i+1; j<l; j++) {
              thisGraphicsNext = self.graphics[j];

              thisGraphics_i.splitFace(thisGraphicsNext);
              thisGraphicsNext.splitFace(thisGraphics_i);
            }

            self.primitives = self.primitives.concat( thisGraphics_i.primitives || [] );
          }
        }
        else {
          for (let i=0, l=this.graphics.length; i<l; i++) {
            thisGraphics_i = this.graphics[i];

            if (thisGraphics_i.split) {
              for (let j=i+1; j<l; j++) {
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

      for (let primitives_i of this.primitives) {
        primitives_i.computeDepth(this);
      }

      this.primitives = this.primitives.sort(sort_function);
      
      // draw the primitives
      if (this.render === "painter") {
        this.drawPainter(this.primitives);
      }
      else {
        for (let primitives_i of this.primitives) {
          primitives_i.draw(this.ctx, this);
        }
      }

      // draw the graphic controls
      for (let graphicsCtr_i of this.graphicsCtr) {
        graphicsCtr_i.draw();
      }
    }

    /**
     *
     */
    drawPainter(primitives) {
      let l = primitives.length;

      for (let i=0; i<l; i++) {
        primitives[i].drawn = false;
        primitives[i].draw(this.ctx, this);
      }

      let V = [];
      let drawface = [];
      let drawix = 0;
      let NC = primitives.length;
      let epsilon0 = 0.001;
      let epsilon = epsilon0;
      let NCa;
      let oneDrawn;
      let canDraw;

      while (true) {
        NCa = NC;
        oneDrawn = false;

        for (let i=0; i<l; i++) {
          if (!primitives[i].drawn) {
            canDraw = true;
            for (let j=0; j<l; j++) {
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
            for (let i=0; i<l; i++) {
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
      for (let i=0; i<l; i++) {
        drawface[i].draw(this.ctx, this);
      }
    }

    /**
     * 
     */
    rayFromEye(x, y) {
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
    addEvents() {
      let self = this;

      self.canvas.addEventListener("touchstart", onTouchStart);

      /**
       * @param {Event} evt
       * @private
       */
      function onTouchStart(evt) {
        // remove the focus of the controls
        window.focus();
        document.activeElement.blur();

        self.click = 1;
        self.evaluator.setVariable(self.mpressedStr, 1);

        // deactivate the graphic controls
        self.parent.deactivateControls();

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
        self.evaluator.setVariable(self.mpressedStr, 0);

        window.removeEventListener("touchmove", onMouseMove, false);
        window.removeEventListener("touchend", onTouchEnd, false);

        evt.preventDefault();

        self.parent.update();
      }

      ///////////////////////////////////////////////////////////////////////////
      //
      ///////////////////////////////////////////////////////////////////////////
      self.canvas.addEventListener("mousedown", onMouseDown);

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseDown(evt) {
        // remove the focus of the controls
        document.body.focus();

        self.click = 1;

        // deactivate the graphic controls
        self.parent.deactivateControls();

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
          self.evaluator.setVariable(self.mpressedStr, 1);

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
        self.evaluator.setVariable(self.mpressedStr, 0);
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
        self.evaluator.setVariable(self.mxStr, self.mouse_x);
        self.evaluator.setVariable(self.myStr, self.mouse_y);

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

      self.disp = {x: 0, y: 0};

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

      document.addEventListener("visibilitychange", function(evt) {
        onMouseUp(evt);
      });

      document.addEventListener("mouseleave", function(evt) {
        onMouseUp(evt);
      });
    }
  }

  /**
   *
   */
  function reflectedRay(l, uN) {
    t_rr = descartesJS.subtract3D(l, descartesJS.scalarProd3D(uN, descartesJS.dotProduct3D(l, uN)));
    r_rr = descartesJS.add3D(l, descartesJS.scalarProd3D(t_rr, -2));
    N_rr = descartesJS.norm3D(r_rr);
    if (N_rr !== 0) {
      return descartesJS.scalarProd3D(r_rr, 1/N_rr);
    }
    return descartesJS.scalarProd3D(l, -1);
  }

  /**
   * 
   */
  function sort_function(a, b) {
    return b.depth - a.depth;
  }

  descartesJS.Space3D = Space3D;
  return descartesJS;
})(descartesJS || {});
