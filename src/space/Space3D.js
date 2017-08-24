/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathRound = Math.round;
  var MathMax   = Math.max;
  var MathMin   = Math.min;
  var MathCos   = Math.cos;
  var MathSin   = Math.sin;
  var MathSqrt  = Math.sqrt;
  var MathPI_2  = Math.PI/2;
  var tiltAngle = Math.PI*15/180;
  var cosTiltAngle = Math.cos(tiltAngle);
  var sinTiltAngle = Math.sin(tiltAngle);
  var tanTiltAngle = Math.tan(tiltAngle);
  var minScale = 0.000001;
  var maxScale = 1000000;

  var evaluator;
  var parent;
  var self;
  var thisGraphics_i;
  var thisGraphicsNext;
  var primitives;
  var primitivesLength;
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

  // :-/
  var cfactor = 3;

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
    self.backCanvas.setAttribute("id", self.id + "_background");
    self.backCanvas.setAttribute("width", self.w + "px");
    self.backCanvas.setAttribute("height", self.h + "px");
  
    self.canvas = document.createElement("canvas");
    self.canvas.setAttribute("id", self.id + "_canvas");
    self.canvas.setAttribute("width", self.w + "px");
    self.canvas.setAttribute("height", self.h + "px");
    self.canvas.setAttribute("class", "DescartesSpace3DCanvas");
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
    self.graphicControlContainer.setAttribute("id", self.id + "_graphicControls");
    self.graphicControlContainer.setAttribute("style", "position:absolute;left:0px;top:0px;z-index:" + self.zIndex + ";");

    // create a control container
    self.numericalControlContainer = document.createElement("div");
    self.numericalControlContainer.setAttribute("id", self.id + "_numericalControls");
    self.numericalControlContainer.setAttribute("style", "position:absolute;left:0px;top:0px;z-index:" + self.zIndex + ";");

    // create the principal container
    self.container = document.createElement("div");
    self.container.setAttribute("id", self.id);
    self.container.setAttribute("class", "DescartesSpace3DContainer");
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
    self.uber.init.call(self);

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
      u: 0,
      v: 0,
      w: 0
    };
    self.Ojo = {
      x: 3*self.w_2,
      y: 0,
      z: 0
    };
    self.evaluator.setVariable(self.ojoXStr, self.Ojo.x);
    self.evaluator.setVariable(self.ojoYStr, self.Ojo.y);
    self.evaluator.setVariable(self.ojoZStr, self.Ojo.z);

    self.VR = {
      x: 0,
      y: 0,
      z: 1
    };
    self.VN = {
      x: 0,
      y: 0,
      z: 1
    };
    self.Rf = [[],[],[]];
    self.Rf[0][0] = 1;
    self.Rf[0][1] = 0;
    self.Rf[0][2] = 0;
    self.Rf[1][0] = 0;
    self.Rf[1][1] = 1;
    self.Rf[1][2] = 0;
    self.Rf[2][0] = 0;
    self.Rf[2][1] = 0;
    self.Rf[2][2] = 1;
    self.Rn = [[],[],[]];
    self.Rn[0][0] = 1;
    self.Rn[0][1] = 0;
    self.Rn[0][2] = 0;
    self.Rn[1][0] = 0;
    self.Rn[1][1] = 1;
    self.Rn[1][2] = 0;
    self.Rn[2][0] = 0;
    self.Rn[2][1] = 0;
    self.Rn[2][2] = 1;

    self.dfi = 0;
    self.dalfa = 0;
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
  }
var Ra = [[],[],[]];
var Rb, c, s, umc, velo;

  /**
   * Update the space
   * @param {Boolean} firstTime condition if is the first time in draw the space
   */
  descartesJS.Space3D.prototype.update = function(firstTime) {
    self = this;
    evaluator = self.evaluator;
    parent = self.parent;

    // prevents the change of the width and height from an external change
    if (!self.resizable) {
      evaluator.setVariable(self.wStr, self.w);
      evaluator.setVariable(self.hStr, self.h);
    }

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
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.rotateVertex = function(v) {
    // Z rotation
    angle = -descartesJS.degToRad(self.evaluator.getVariable(self.rotZStr));
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

    velo = 0;

    Ra[0][0] = 0;
    Ra[0][1] = -self.VR.z;
    Ra[0][2] = self.VR.y;
    Ra[1][0] = self.VR.z;
    Ra[1][1] = 0;
    Ra[1][2] = -self.VR.x;
    Ra[2][0] = -self.VR.y;
    Ra[2][1] = self.VR.x;
    Ra[2][2] = 0;
    Rb = multiplyMatrix(Ra, Ra);
    c = Math.cos(self.dfi);
    s = Math.sin(self.dfi);
    umc = 1-c;
    Ra[0][0] = 1 + s*Ra[0][0] + umc*Rb[0][0];
    Ra[0][1] = 0 + s*Ra[0][1] + umc*Rb[0][1];
    Ra[0][2] = 0 + s*Ra[0][2] + umc*Rb[0][2];
    Ra[1][0] = 0 + s*Ra[1][0] + umc*Rb[1][0];
    Ra[1][1] = 1 + s*Ra[1][1] + umc*Rb[1][1];
    Ra[1][2] = 0 + s*Ra[1][2] + umc*Rb[1][2];
    Ra[2][0] = 0 + s*Ra[2][0] + umc*Rb[2][0];
    Ra[2][1] = 0 + s*Ra[2][1] + umc*Rb[2][1];
    Ra[2][2] = 1 + s*Ra[2][2] + umc*Rb[2][2];
    self.Rf = multiplyMatrix(self.Rf, Ra);
    Ra[0][0] = 0;
    Ra[0][1] = -self.VN.z;
    Ra[0][2] = self.VN.y;
    Ra[1][0] = self.VN.z;
    Ra[1][1] = 0;
    Ra[1][2] = -self.VN.x;
    Ra[2][0] = -self.VN.y;
    Ra[2][1] = self.VN.x;
    Ra[2][2] = 0;
    Rb = multiplyMatrix(Ra, Ra);
    c = Math.cos(self.dalfa);
    s = Math.sin(self.dalfa);
    umc = 1-c;
    Ra[0][0] = 1 + s*Ra[0][0] + umc*Rb[0][0];
    Ra[0][1] = 0 + s*Ra[0][1] + umc*Rb[0][1];
    Ra[0][2] = 0 + s*Ra[0][2] + umc*Rb[0][2];
    Ra[1][0] = 0 + s*Ra[1][0] + umc*Rb[1][0];
    Ra[1][1] = 1 + s*Ra[1][1] + umc*Rb[1][1];
    Ra[1][2] = 0 + s*Ra[1][2] + umc*Rb[1][2];
    Ra[2][0] = 0 + s*Ra[2][0] + umc*Rb[2][0];
    Ra[2][1] = 0 + s*Ra[2][1] + umc*Rb[2][1];
    Ra[2][2] = 1 + s*Ra[2][2] + umc*Rb[2][2];
    self.Rn = multiplyMatrix(self.Rn, Ra);
    var ux = -self.Rn[0][0];
    var uy = -self.Rn[0][1];
    var uz = -self.Rn[0][2];
    var vx = -self.Rn[1][0];
    var vy = -self.Rn[1][1];
    var vz = -self.Rn[1][2];
    var wx = -self.Rn[2][0];
    var wy = -self.Rn[2][1];
    var wz = -self.Rn[2][2];
    Ra = multiplyMatrix(self.Rf, self.Rn);
    var Ux = -Ra[0][0];
    var Uy = -Ra[0][1];
    var Uz = -Ra[0][2];
    var Vx = -Ra[1][0];
    var Vy = -Ra[1][1];
    var Vz = -Ra[1][2];
    var Wx = -Ra[2][0];
    var Wy = -Ra[2][1];
    var Wz = -Ra[2][2];

    var _SE = Math.abs(self.Ojo.x/self.scale);
    var obsx = (self.Ojo.x/self.scale)/_SE;
    var obsy = (self.Ojo.y/self.scale)/_SE;
    var obsz = (self.Ojo.z/self.scale)/_SE;
    var obsy_displaced = (obsy!=0);
    var obsz_displaced = (obsz!=0);
    var SE = {};
    SE.x = _SE*ux;
    SE.y = _SE*uy;
    SE.z = _SE*uz;
    self.S.x = self.S.x - velo*ux;
    self.S.y = self.S.y - velo*uy;
    self.S.z = self.S.z - velo*uz;
    var E = {};
    E.x = self.S.x + SE.x;
    E.y = self.S.y + SE.y;
    E.z = self.S.z + SE.z;
    E.u = E.x*ux + E.y*uy + E.z*uz;
    E.v = E.x*vx + E.y*vy + E.z*vz;
    E.w = E.x*wx + E.y*wy + E.z*wz;
    self.S.u = self.S.x*ux + self.S.y*uy + self.S.z*uz;
    self.S.v = self.S.x*vx + self.S.y*vy + self.S.z*vz;
    self.S.w = self.S.x*wx + self.S.y*wy + self.S.z*wz;
    SE.u = SE.x*ux + SE.y*uy + SE.z*uz;
    SE.v = SE.x*vx + SE.y*vy + SE.z*vz;
    SE.w = SE.x*wx + SE.y*wy + SE.z*wz;
    
    var x0 = v.x;
    var y0 = v.y;
    var z0 = v.z;
    var fixed = false;
    var P = {};
    P.u = (fixed) ? ux*x0 + uy*y0 + uz*z0 : Ux*x0 + Uy*y0 + Uz*z0;
    P.v = (fixed) ? vx*x0 + vy*y0 + vz*z0 : Vx*x0 + Vy*y0 + Vz*z0;
    P.w = (fixed) ? wx*x0 + wy*y0 + wz*z0 : Wx*x0 + Wy*y0 + Wz*z0;
    var fctr = SE.u/(E.u-P.u);
    var x2 = (obsy_displaced) ? fctr*(self.S.v - P.v + obsy*(self.S.u-P.u)) : fctr*(self.S.v - P.v);
    var y2 = (obsz_displaced) ? fctr*(self.S.w - P.w + obsz*(self.S.u-P.u)) : fctr*(self.S.w - P.w);

    return {
      x: self.getAbsoluteX(x2),
      y: self.getAbsoluteY(-y2),
      z: z0
    };
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.computeColor = function(color, primitive, metal) {
    var self = this;
    if (color.match("rgba")) {
      color = descartesJS.RGBAToHexColor(color);
    }
    else if (color.match("#")) {
      color = new descartesJS.Color(color.substring(1));
    }

    // toEye = descartesJS.subtract3D(self.eye, primitive.average);
    toEye = descartesJS.subtract3D(self.Ojo, primitive.average);
    aveDistanceToEye = descartesJS.norm3D(toEye);
    unitToEye = descartesJS.scalarProduct3D(toEye, 1/aveDistanceToEye);

    self.lights[3] = descartesJS.subtract3D(self.light3, primitive.average);
    dl3 = descartesJS.norm3D(self.lights[3]);

    for (var i=0, l=self.intensity.length-1; i<l; i++) {
      intensity[i] = self.intensity[i]*self.dim;
    }
    intensity[3] = ((self.userIntensity*self.userIntensity)/dl3) || 0;

    I = (metal) ? self.dim/2 : self.dim/4;
    c = 0;

    normal = (primitive.direction >= 0) ? primitive.normal : descartesJS.scalarProduct3D(primitive.normal, -1);
    
    for (var i=0, l=self.lights.length; i<l; i++) {
      if (metal) {
        c = MathMax( 0, descartesJS.dotProduct3D(reflectedRay(self.lights[i], normal), unitToEye) );
        c = c*c*c;
      }
      else {
        c = MathMax(0, descartesJS.dotProduct3D(self.lights[i], normal));
      }

      I+= intensity[i]*c;
    }
    I = MathMin(I, 1);

    return "rgba(" + MathFloor(color.r*I) + "," + MathFloor(color.g*I) + "," + MathFloor(color.b*I) + "," + color.a + ")";
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
    var self = this;

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
      for(var i=0, l=self.graphics.length; i<l; i++) {
        self.graphics[i].update();
      }

      self.primitives = [];
      // split the primitives if needed
      for (var i=0, l=self.graphics.length; i<l; i++) {
        thisGraphics_i = self.graphics[i];

        if ((thisGraphics_i.split) || (self.split)) {
          for (var j=i+1; j<l; j++) {
            thisGraphicsNext = self.graphics[j];

            if ((thisGraphicsNext.split) || (self.split)) {
              thisGraphics_i.splitFace(thisGraphicsNext);
            }
          }
        }

        self.primitives = self.primitives.concat( thisGraphics_i.primitives || [] );
      }
      // end split
    }

    for(var i=0, l=self.primitives.length; i<l; i++) {
      self.primitives[i].computeDepth(this);
    }

    this.primitives = self.primitives.sort(function (a, b) { return b.depth - a.depth; });

    // draw the primitives
    if (self.render === "painter") {
      self.drawPainter(self.primitives);
    }
    else {
      for(var i=0, l=self.primitives.length; i<l; i++) {
        self.primitives[i].draw(self.ctx, this);
      }
    }

    // draw the graphic controls
    for (var i=0, l=self.graphicsCtr.length; i<l; i++) {
      self.graphicsCtr[i].draw();
    }
  }

  /**
   *
   */
  descartesJS.Space3D.prototype.drawPainter = function(primitives) {
    var self = this;
    var l = primitives.length;

    for (var i=0; i<l; i++) {
      primitives[i].drawn = false;
      primitives[i].draw(self.ctx, this);
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
      drawface[i].draw(self.ctx, this);
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
    var lastTime = 0;

    self.canvas.oncontextmenu = function () { return false; };

    self.canvas.addEventListener("touchstart", onTouchStart);

    /**
     * @param {Event} evt
     * @private
     */
    function onTouchStart(evt) {
      // remove the focus of the controls
      document.body.focus();

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
      document.body.focus();

      self.click = 0;
      self.evaluator.setVariable(self.id + ".mouse_pressed", 0);

      window.removeEventListener("touchmove", onMouseMove, false);
      window.removeEventListener("touchend", onTouchEnd, false);

      evt.preventDefault();
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
      // if (Date.now() - lastTime > 70) {
        self.parent.update();
        lastTime = Date.now();
      // }
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
  }

  /** 
   * 
   */
  function multiplyMatrix(M1, M2) {
    var R = [[], [], []];

    R[0][0] = M1[0][0]*M2[0][0] + M1[0][1]*M2[1][0] + M1[0][2]*M2[2][0];
    R[0][1] = M1[0][0]*M2[0][1] + M1[0][1]*M2[1][1] + M1[0][2]*M2[2][1];
    R[0][2] = M1[0][0]*M2[0][2] + M1[0][1]*M2[1][2] + M1[0][2]*M2[2][2];

    R[1][0] = M1[1][0]*M2[0][0] + M1[1][1]*M2[1][0] + M1[1][2]*M2[2][0];
    R[1][1] = M1[1][0]*M2[0][1] + M1[1][1]*M2[1][1] + M1[1][2]*M2[2][1];
    R[1][2] = M1[1][0]*M2[0][2] + M1[1][1]*M2[1][2] + M1[1][2]*M2[2][2];

    R[2][0] = M1[2][0]*M2[0][0] + M1[2][1]*M2[1][0] + M1[2][2]*M2[2][0];
    R[2][1] = M1[2][0]*M2[0][1] + M1[2][1]*M2[1][1] + M1[2][2]*M2[2][1];
    R[2][2] = M1[2][0]*M2[0][2] + M1[2][1]*M2[1][2] + M1[2][2]*M2[2][2];

    return R;
  }

  return descartesJS;
})(descartesJS || {});
