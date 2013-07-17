/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathRound = Math.round;
  var PI2 = Math.PI*2;
  var minScale = 0.000001;
  var maxScale = 1000000;

  var axisFont = descartesJS.convertFont("SansSerif,PLAIN,12");
  var mouseTextFont = descartesJS.convertFont("Monospaced,PLAIN,12");

  var self;

  var evaluator;
  var parent;
  var ctx;

  var changeX;
  var changeY;
  var thisGraphics_i;
  var thisCtrs_i;

  var rsc;
  var dec;
  var wh_temp;

  var w;
  var h;
  var x;
  var y;
  var Ox;
  var Oy;
  var x1;
  var x2;
  var y1;
  var y2;

  var coordTxt_X;
  var coordTxt_Y;
  var coordTxt;
  var coordTxtW;
  var mouseX;
  var mouseY;
  var posX;
  var posY;

  var hasTouchSupport;
  var disp;

  /**
   * Descartes 2D space
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.Space2D = function(parent, values) {
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
    self.canvas.setAttribute("class", "DescartesSpace2DCanvas");
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
    self.container.setAttribute("class", "DescartesSpace2DContainer");
    self.container.setAttribute("style", "left: " + self.x + "px; top: " + self.y + "px; z-index: " + self.zIndex + ";");

    // ### ARQUIMEDES ###
    // if is the default arquimedes add a border to the container
    if ((self.parent.arquimedes) && (self.background.getColor() === "#f0f8fa")) {
      self.container.style.border = "1px solid #b8c4c8";
    }
    // ### ARQUIMEDES ###

    // add the elements to the container
    self.container.appendChild(self.backgroundCanvas);
    self.container.appendChild(self.canvas);
    self.container.appendChild(self.graphicControlContainer);
    self.container.appendChild(self.numericalControlContainer);
    
    parent.container.insertBefore(self.container, parent.loader);

    // variable to expose the image of the space
    self.parent.images[self.id + ".image"] = self.canvas;
    self.parent.images[self.id + ".image"].ready = 1;
    self.parent.images[self.id + ".image"].complete = true;
    self.evaluator.setVariable(self.id + ".image", self.id + ".image");

    // variable to expose the image of the background space
    self.parent.images[self.id + ".back"] = self.backgroundCanvas;
    self.parent.images[self.id + ".back"].ready = 1;
    self.parent.images[self.id + ".back"].complete = true;
    self.evaluator.setVariable(self.id + ".back", self.id + ".back");

    if ((self.id !== "") && (parent.version !== 2)) {
      self.OxString    = self.id + ".Ox";
      self.OyString    = self.id + ".Oy";
      self.scaleString = self.id + ".escala";
      self.wString     = self.id + "._w";
      self.hString     = self.id + "._h";  
      self.mxString    = self.id + ".mouse_x";
      self.myString    = self.id + ".mouse_y";
      self.mpressedString = self.id + ".mouse_pressed";
      self.mclickedString = self.id + ".mouse_clicked";
    }
    else {
      self.OxString    = "Ox";
      self.OyString    = "Oy";
      self.scaleString = "escala";
      self.wString     = "_w";
      self.hString     = "_h";
      self.mxString    = "mouse_x";
      self.myString    = "mouse_y";
      self.mpressedString = "mouse_pressed";
      self.mclickedString = "mouse_clicked";
    }

    // register the mouse and touch events
    if (self.id !== "descartesJS_scenario") {
      self.registerMouseAndTouchEvents();
    }

  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Space2D, descartesJS.Space);

  /**
   * Init the space
   */
  descartesJS.Space2D.prototype.init = function() {
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
  }

  /**
   * Update the space
   * @param {Boolean} firstTime condition if is the first time in draw the space
   */
  descartesJS.Space2D.prototype.update = function(firstTime) {
    self = this;
    evaluator = self.evaluator;
    parent = self.parent;

    // prevents the change of the width and height from an external change
    evaluator.setVariable(self.wString, self.w);
    evaluator.setVariable(self.hString, self.h);

    // check the draw if condition
    self.drawIfValue = evaluator.evalExpression(self.drawif) > 0;

    // draw the space
    if (self.drawIfValue) {

      changeX = (self.x !== (evaluator.evalExpression(self.xExpr) + self.displaceRegionWest));
      changeY = (self.y !== (evaluator.evalExpression(self.yExpr) + parent.plecaHeight  + self.displaceRegionNorth));

      // check if the space has change
      self.spaceChange = firstTime ||
                         changeX ||
                         changeY ||
                         (self.drawBefore !== self.drawIfValue) ||
                         (self.Ox !== evaluator.getVariable(self.OxString)) ||
                         (self.Oy !== evaluator.getVariable(self.OyString)) ||
                         (self.scale !== evaluator.getVariable(self.scaleString));

      self.x = (changeX) ? evaluator.evalExpression(self.xExpr) + self.displaceRegionWest : self.x;
      self.y = (changeY) ? evaluator.evalExpression(self.yExpr) + parent.plecaHeight + self.displaceRegionNorth : self.y;
      self.Ox = evaluator.getVariable(self.OxString);
      self.Oy = evaluator.getVariable(self.OyString);
      self.scale = evaluator.getVariable(self.scaleString);
      self.drawBefore = self.drawIfValue;

      // check if the scale is not below the lower limit
      if (self.scale < minScale) {
        self.scale = minScale;
        evaluator.setVariable(self.scaleString, minScale);
      }
      // check if the scale is not above the upper limit
      else if (self.scale > maxScale) {
        self.scale = maxScale;
        evaluator.setVariable(self.scaleString, maxScale);
      }
      
      // if some property change then adjust the container style
      if ((changeX) || (changeY)) {
        self.container.style.left = self.x + "px";
        self.container.style.top = self.y + "px";
        self.findOffset();
      }

      self.container.style.display = "block";
        
      // draw the trace
      self.drawTrace = (!self.spaceChange) && (!self.click);

      if (self.spaceChange) {
        self.drawBackground();
      }
      self.draw();
    } 
    // hide the space
    else {
      self.container.style.display = "none";
    }
    
  }

  /**
   * Draw the space background 
   */
  descartesJS.Space2D.prototype.drawBackground = function() {
    evaluator = this.evaluator;
    ctx = this.backgroundCtx;

    // draw the background color
    ctx.clearRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
    ctx.fillStyle = this.background.getColor();
    ctx.fillRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);

    // draw the background image if any
    if ( (this.image) && (this.image.src != "") && (this.image.ready) && (this.image.complete) ) {
      if (this.bg_display === "topleft") {
        ctx.drawImage(this.image, 0, 0);
      } 
      else if (this.bg_display === "stretch") {
        ctx.drawImage(this.image, 0, 0, this.w, this.h);
      } 
      else if (this.bg_display === "patch") {
        ctx.fillStyle = ctx.createPattern(this.image, "repeat");
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
      else if (this.bg_display === "center") {
        ctx.drawImage(this.image, (this.w-this.image.width)/2, (this.h-this.image.height)/2);
      }
    }
    
    rsc = this.scale;
    dec = 0;
    wh_temp = ((this.w+this.h) < 0) ? 0 : (this.w+this.h);

    while (rsc>(wh_temp)) {
      rsc/=10; 
      dec++; 
    }
    while (rsc<(wh_temp)/10) {
      rsc*=10;
    }

    ctx.lineWidth = 1;

    // draw the big net
    if (this.net !== "") {
      ctx.strokeStyle = this.net.getColor();
      this.drawMarks(ctx, rsc/10, -1);
    }
    
    // draw the finnest net
    if ( ((this.parent.version !== 2) && (this.net10 !== "")) || 
         ((this.parent.version === 2) && (this.net !== "") && (this.net10 !== ""))
       ) {
      ctx.strokeStyle = this.net10.getColor();
      this.drawMarks(ctx, rsc, -1);
    }
    
    // draw the axes
    if (this.axes !== "") {
      ctx.strokeStyle = this.axes.getColor();
      
      ctx.beginPath();
      // x axis
      if ((this.x_axis !== "") || (this.parent.version !== 2)) {
        ctx.moveTo(0, MathFloor(this.h/2+this.Oy)+.5);
        ctx.lineTo(this.w, MathFloor(this.h/2+this.Oy)+.5);
      }

      // y axis
      if ((this.y_axis !== "") || (this.parent.version !== 2)) {
        ctx.moveTo(MathFloor(this.w/2+this.Ox)+.5, 0);
        ctx.lineTo(MathFloor(this.w/2+this.Ox)+.5, this.h);
      }
      
      ctx.stroke();

      this.drawMarks(ctx, rsc, 4);
      this.drawMarks(ctx, rsc/2, 2);
      this.drawMarks(ctx, rsc/10, 1);
    }
    
    // draw the axis names
    if ((this.x_axis !== "") || (this.y_axis !== "")) {
      ctx.fillStyle = (this.axes !== "") ? this.axes.getColor() : "black";

      ctx.font = axisFont
      ctx.textAlign = "right";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(this.x_axis, MathFloor(this.w)-2, MathFloor(this.h/2+this.Oy)+12);
      ctx.fillText(this.y_axis, MathFloor(this.w/2+this.Ox)-2, 12); 
    }
    
    // draw the axis numbers
    if ((this.numbers) && (this.axes != "")) {
      ctx.fillStyle = this.axes.getColor();
      ctx.font = axisFont
      ctx.textAlign = "start";
      ctx.textBaseline = "bottom";

      if (rsc > ((this.w+this.h)/2)) {
        this.drawNumbers(ctx, rsc/5, (rsc<=this.scale)?dec+1:dec);
      } 
      
      else if (rsc > ((this.w+this.h)/4)) {
        this.drawNumbers(ctx, rsc/2, (rsc<=this.scale)?dec+1:dec);
      } 
      
      else {
        this.drawNumbers(ctx, rsc, dec);
      }
    }

    // draw the background graphics
    for(var i=0, l=this.backgroundGraphics.length; i<l; i++) {
      this.backgroundGraphics[i].draw();
    }    
  }

  /**
   * Draw the space
   */
  descartesJS.Space2D.prototype.draw = function() {
    ctx = this.ctx;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // draw the no background graphics
    for(var i=0, l=this.graphics.length; i<l; i++) {
      thisGraphics_i = this.graphics[i];

      if ((thisGraphics_i.trace !== "") && (this.drawTrace)) {
        thisGraphics_i.drawTrace();
      }

      thisGraphics_i.draw();
    }

    // draw the graphic controls
    for (var i=0, l=this.graphicsCtr.length; i<l; i++) {
      this.graphicsCtr[i].draw();
    }

    // draw the text showing the mouse postion
    if ((this.text != "") && (this.click) && (this.whichButton === "L")) {
      ctx.fillStyle = this.text.getColor();
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 1;
      ctx.font = mouseTextFont;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      coordTxt_X = (this.scale <= 1) ? ((this.mouse_x).toFixed(0)) : (this.mouse_x).toFixed((this.scale).toString().length);
      coordTxt_Y = (this.scale <= 1) ? ((this.mouse_y).toFixed(0)) : (this.mouse_y).toFixed((this.scale).toString().length);
      coordTxt = "(" + coordTxt_X + "," + coordTxt_Y + ")";
      coordTxtW = MathFloor(ctx.measureText(coordTxt).width/2);
      mouseX = this.getAbsoluteX(this.mouse_x);
      mouseY = this.getAbsoluteY(this.mouse_y);
      posX = MathFloor(mouseX);
      posY = MathFloor(mouseY-10);

      // prevents the mouse position text get out of the space
      if ((posX+coordTxtW) > this.w) {
        posX = this.w-coordTxtW;
      } 
      else if ((posX-coordTxtW) < 0) {
        posX = coordTxtW;
      }
      if ((posY+1) > this.h) {
        posY = this.h;
      } 
      else if ((posY-14) < 0) { // 14 is aproximately the text width
        posY = 15;
      }

      ctx.fillText(coordTxt, posX, posY);

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 2.5, 0, PI2, true);
      ctx.stroke();
    }
  }
  
  /**
   * Draw the axis marks in the space
   * @param {CanvasRenderingContext2D} ctx the rendering context to draw
   * @param {Number} rsc
   * @param {Number} sz
   */
  descartesJS.Space2D.prototype.drawMarks = function(ctx, rsc, sz) {
    w = this.w;
    h = this.h;
    
    x1 = 0;
    x2 = w;
    y1 = 0;
    y2 = h;
    Ox = MathFloor(w/2+this.Ox);
    Oy = MathFloor(h/2+this.Oy);
    
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
   * Draw the axis numbers
   * @param {CanvasRenderingContext2D} ctx the rendering context to draw
   * @param {Number} rsc
   * @param {Number} dec
   */
  descartesJS.Space2D.prototype.drawNumbers = function(ctx, rsc, dec) {
    w = this.w;
    h = this.h;
    
    Ox = MathFloor(w/2+this.Ox);
    Oy = MathFloor(h/2+this.Oy);
    
    for (var i=-MathRound(Ox/rsc); (x = Ox + MathRound(i*rsc)) < w; i++) {
      ctx.fillText(parseFloat( (i*rsc/this.scale).toFixed(4) ), x+1, Oy-2);
    }
    
    for (var i=-MathRound(Oy/rsc); (y = Oy + MathRound(i*rsc)) < h; i++) {
      if (parseFloat( (-i*rsc/this.scale) ) !== 0) {
        ctx.fillText(parseFloat( (-i*rsc/this.scale).toFixed(4) ), Ox+5, y+5);
      }
    }
  }
  
  /**
   * Register the mouse and touch events
   */
  descartesJS.Space2D.prototype.registerMouseAndTouchEvents = function() {
    var self = this;
    hasTouchSupport = descartesJS.hasTouchSupport;

    // prevent the context menu display
    self.canvas.oncontextmenu = function () { return false; };

    ///////////////////////////////////////////////////////////////////////////
    // Registro de eventos de touch (iOS, android)
    ///////////////////////////////////////////////////////////////////////////
    if (hasTouchSupport) {
      if (this.sensitive_to_mouse_movements) {
        this.canvas.addEventListener("touchmove",  onSensitiveToMouseMovements);
      }
      this.canvas.addEventListener("touchstart", onTouchStart);
    }

    /**
     * @param {Event} evt 
     * @private
     */
    function onTouchStart(evt) {
      self.click = 1;
      self.evaluator.setVariable(self.mpressedString, 1);
      self.evaluator.setVariable(self.mclickedString, 0);

      // deactivate the graphic controls
      self.parent.deactivateGraphiControls();

      onSensitiveToMouseMovements(evt);
      
      window.addEventListener("touchmove", onMouseMove);
      window.addEventListener("touchend", onTouchEnd);

      // try to preserv the slide gesture in the tablets
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
      self.evaluator.setVariable(self.mpressedString, 0);
      self.evaluator.setVariable(self.mclickedString, 1);

      window.removeEventListener("touchmove", onMouseMove, false);
      window.removeEventListener("touchend", onTouchEnd, false);

      evt.preventDefault();

      self.parent.update();      
    }
  
    ///////////////////////////////////////////////////////////////////////////
    // Registro de eventos de mouse
    ///////////////////////////////////////////////////////////////////////////
    if (!hasTouchSupport) {
      if (this.sensitive_to_mouse_movements) {
        this.canvas.addEventListener("mousemove", onSensitiveToMouseMovements);
      }
      this.canvas.addEventListener("mousedown", onMouseDown);
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseDown(evt) {
      self.click = 1;

      // deactivate the graphic controls
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
      
      if (self.whichButton === "L") {
        self.evaluator.setVariable(self.mpressedString, 1);
        self.evaluator.setVariable(self.mclickedString, 0);

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
      self.evaluator.setVariable(self.mpressedString, 0);
      self.evaluator.setVariable(self.mclickedString, 1);

      evt.preventDefault();

      if (self.whichButton === "R") {
        window.removeEventListener("mousemove", onMouseMoveZoom, false);
      }

      if (!self.sensitive_to_mouse_movements) {
        window.removeEventListener("mousemove", onMouseMove, false);
      }

      window.removeEventListener("mouseup", onMouseUp, false);
      
      self.parent.update();
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
      self.evaluator.setVariable(self.mxString, self.mouse_x);
      self.evaluator.setVariable(self.myString, self.mouse_y);
      self.evaluator.setVariable(self.mclickedString, 0);

      self.parent.update();
    }
    
    /**
     * @param {Event} evt
     * @private
     */
    function onMouseMoveZoom(evt) {
      evt.preventDefault();

      self.clickPosForZoomNew = (self.getCursorPosition(evt)).y;

      self.evaluator.setVariable(self.scaleString, self.tempScale + (self.tempScale/45)*((self.clickPosForZoom-self.clickPosForZoomNew)/10));

      self.parent.update();      
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseMove(evt) {
      // if the space is not fixed, then change the origin coordinates
      if (!self.fixed) {
        self.posNext = self.getCursorPosition(evt);
        disp = { x: MathFloor(self.posAnte.x-self.posNext.x), 
                 y: MathFloor(self.posAnte.y-self.posNext.y) };

        self.evaluator.setVariable(self.OxString, (self.Ox - disp.x));
        self.evaluator.setVariable(self.OyString, (self.Oy - disp.y));
        self.posAnte.x -= disp.x;
        self.posAnte.y -= disp.y;
      }

      onSensitiveToMouseMovements(evt);

      // // try to preserv the slide gesture in the tablets
      // if ((!self.fixed) || (self.sensitive_to_mouse_movements)) {
      evt.preventDefault();
      // }
    }
  }
    
  return descartesJS;
})(descartesJS || {});