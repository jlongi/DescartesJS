/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
    
  var evaluator;
  var canvas;
  var ctx;
  var expr;
  var font_size;
  var name;
  var imageSrc;
  var image;
  var despX;
  var despY;
  var txtW;
  var hasTouchSupport;
  var delay = 2000;

  var _image_pos_x;
  var _image_pos_y;
  var _text_pos_x;
  var _text_pos_y;

  var _i_h;
  var _font_h;
  var newButtonCondition;

  var gifPattern = /[\w\.\-//]*(\.gif)/gi;

  /**
   * Descartes button control
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the button control
   */
  descartesJS.Button = function(parent, values) {
    /**
     * image file name
     * type {String}
     * @private
     */
    this.imageSrc = "";

    /**
     * image
     * type {Image}
     * @private
     */
    this.image = new Image();
    
    /**
     * over image
     * type {Image}
     * @private
     */
    this.imageOver = new Image();

    /**
     * down image
     * type {Image}
     * @private
     */
    this.imageDown = new Image();

    // call the parent constructor
    descartesJS.Control.call(this, parent, values);

    if (this.font_size === -1) {
      this.fontSizeNotSet = true;
    }

    // modification to change the name of the button with an expression
    if ((this.name.charAt(0) === "[") && (this.name.charAt(this.name.length-1) === "]")) {
      this.name = this.parser.parse(this.name.substring(1, this.name.length-1));
    }
    else {
      this.name = this.parser.parse("'" + this.name + "'");
    }

    // color expression of the form _COLORES_ffffff_000000_P_22 specified in the image field
    // the first color is the background color
    // the second color is the text color
    // the last number ir the font size
    var tmpParam;
    if (this.imageSrc.match("_COLORES_")) {
      tmpParam       = this.imageSrc.split("_");
      this.colorInt  = new descartesJS.Color(tmpParam[2]);
      this.color     = new descartesJS.Color(tmpParam[3]);
      this.font_size = this.parser.parse(tmpParam[5]);
      this.imageSrc  = "";
    }

    if (this.imageSrc.charAt(0) == '[') {
      this.imageSrc = this.parser.parse(this.imageSrc);
    }
    else {
      this.imageSrc = this.parser.parse("'" + this.imageSrc + "'");
    }
    
    // if the button has an image then load it and try to load the over and down images
    var imageSrc = this.evaluator.evalExpression(this.imageSrc).trim();
    if (imageSrc != "") {
      var prefix = imageSrc.substr(0, imageSrc.lastIndexOf("."));
      var sufix  = imageSrc.substr(imageSrc.lastIndexOf("."));

      // empty image, i.e. reference to vacio.gif
      if (imageSrc.toLowerCase().match(/vacio.gif$/)) {
        this.imageSrc = this.parser.parse("'vacio.gif'");

        this.image.ready = 1;

        // ## Descartes 3 patch ##
        // if the image is empty then the name of the button is not displayed
        if (this.parent.version === 3) {
          this.name = this.parser.parse('');
        }
        // ## Descartes 3 ##

        this.emptyImage = { ready: true };
        imageSrc = this.parser.parse("'vacio.gif'");
      } 
      // the image is not empty
      else {
        this.image = this.parent.getImage(imageSrc);
        this.imageOver = this.parent.getImage(prefix + "_over" + sufix);
        this.imageDown = this.parent.getImage(prefix + "_down" + sufix);
      }
    }

    // create the canvas and the rendering context
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("class", "DescartesButton");
    this.canvas.setAttribute("id", this.id);
    this.canvas.setAttribute("width", this.w+"px");
    this.canvas.setAttribute("height", this.h+"px");
    this.canvas.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");

    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;

    this.addControlContainer(this.canvas);

    // register the mouse and touch events
    this.registerMouseAndTouchEvents();

    // init the button parameters
    this.init();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Button, descartesJS.Control);

  /**
   * Init the button
   */
  descartesJS.Button.prototype.init = function() {
    evaluator = this.evaluator;
    canvas = this.canvas;
    expr = evaluator.evalExpression(this.expresion);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      this.w = parseInt(expr[0][2]);
      this.h = parseInt(expr[0][3]);
    }
    
    canvas.setAttribute("width", this.w+"px");
    canvas.setAttribute("height", this.h+"px");
    canvas.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + "; display: block; background-repeat: no-repeat;");

    if (this.fontSizeNotSet) {
      this.font_size = evaluator.parser.parse(descartesJS.getFieldFontSize(this.h) +"");
    }

    // create the background gradient
    this.createGradient(this.w, this.h);

    canvas.style.display = (evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
  }
  
  /**
   * Update the button
   */
  descartesJS.Button.prototype.update = function() {
    evaluator = this.evaluator;
    canvas = this.canvas;

    // check if the control is active and visible
    this.activeIfValue = (evaluator.evalExpression(this.activeif) > 0);
    this.drawIfValue = (evaluator.evalExpression(this.drawif) > 0);

    // hide or show the button control
    if (this.drawIfValue) {
      canvas.style.display = "block";
      this.draw();
    } else {
      canvas.style.display = "none";
      // this.buttonClick = false;
    }

    canvas.style.cursor = (this.activeIfValue) ? "pointer" : "not-allowed";

    // update the position and size
    this.updatePositionAndSize();
  }

  /**
   * Draw the button
   */
  descartesJS.Button.prototype.draw = function() {
    evaluator = this.evaluator;
    ctx = this.ctx;

    font_size = evaluator.evalExpression(this.font_size);
    name = evaluator.evalExpression(this.name);

    imageSrc = evaluator.evalExpression(this.imageSrc);
    image = (imageSrc === "vacio.gif") ? this.emptyImage : this.parent.getImage(imageSrc);
    
    ctx.clearRect(0, 0, this.w, this.h);

    // text displace when the button is pressed
    despX = 0;
    despY = 0;
    if (this.buttonClick) {
      despX = 1;
      despY = 1;
    }

    _text_pos_x = MathFloor(this.w/2 + despX)-.5;
    _text_pos_y = MathFloor(this.h/2 + despY)-.5;

    //////////////////////////////////////////////////////////
    // text at the bottom
    if (image) {
      _i_h = image.height || 100000000;
      _font_h = descartesJS.getFontMetrics(this.italics + " " + this.bold + " " + font_size + "px Arial").h;
      newButtonCondition = (name != "") ? (((this.h-_i_h-_font_h-2) >=0 ) ? true : false) : false;

      _image_pos_x = parseInt((this.w-image.width)/2)+despX;
      _image_pos_y = (newButtonCondition) ? (parseInt((this.h -_font_h -image.height +2)/2)) : (parseInt((this.h-image.height)/2)+despY);

      if (newButtonCondition) {
        _text_pos_y = parseInt(this.h - _font_h/2 -2);

        ctx.fillStyle = this.colorInt.getColor();
        ctx.fillRect(0, 0, this.w, this.h);
      }
    }
    //////////////////////////////////////////////////////////

    // the image is ready
    if ((image) && (image.ready)) {
      if ( (image !== this.emptyImage) && (image.complete) ) {
        // check if is a gif image
        if ( (this.image.src).match(gifPattern) ) {
          this.canvas.style.backgroundImage = "url(" + this.image.src + ")";
          this.canvas.style.backgroundPosition = (_image_pos_x) + "px " + (_image_pos_y) + "px";
        }
        else {
          ctx.drawImage(image, _image_pos_x, _image_pos_y);
        }
      }
    }
    // the image is not ready or do not have a image
    else {
      ctx.fillStyle = this.colorInt.getColor();
      ctx.fillRect(0, 0, this.w, this.h);

      if (!this.buttonClick) {
        descartesJS.drawLine(ctx, this.w-1, 0, this.w-1, this.h, "rgba(0,0,0,"+(0x80/255)+")");
        descartesJS.drawLine(ctx, 0, 0, 0, this.h, "rgba(0,0,0,"+(0x18/255)+")");
        descartesJS.drawLine(ctx, 1, 0, 1, this.h, "rgba(0,0,0,"+(0x08/255)+")");
      }
      
      ctx.fillStyle = this.linearGradient;
      ctx.fillRect(0, 0, this.w, this.h);
    }
    
    if ( (this.activeIfValue) && (this.imageOver.src != "") && (this.imageOver.ready) && (this.over) ) {
      if ( (this.image.src).match(gifPattern) ) {
        this.canvas.style.backgroundImage = "url(" + this.imageOver.src + ")";
        this.canvas.style.backgroundPosition = (_image_pos_x) + "px " + (_image_pos_y) + "px";
      }
      else {
        ctx.drawImage(this.imageOver, _image_pos_x, _image_pos_y);
      }
    }

    if ( (this.activeIfValue) && (this.imageDown.src != "") && (this.imageDown.ready) && (this.buttonClick) ) {
      if ( (this.image.src).match(gifPattern) ) {
        this.canvas.style.backgroundImage = "url(" + this.imageDown.src + ")";
        this.canvas.style.backgroundPosition = (_image_pos_x) + "px " + (_image_pos_y) + "px";
      }
      else {
        ctx.drawImage(this.imageDown, _image_pos_x, _image_pos_y);
      }
    }
    else if ((this.buttonClick) && (!image)) {
      descartesJS.drawLine(ctx, 0, 0, 0, this.h-2, "gray");
      descartesJS.drawLine(ctx, 0, 0, this.w-1, 0, "gray"); 

      ctx.fillStyle = "rgba(0, 0, 0,"+(0x18/255)+")";
      ctx.fillRect(0, 0, this.w, this.h);
    }
      
    ctx.fillStyle = this.color.getColor();
    ctx.font = this.italics + " " + this.bold + " " + font_size + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // text border
    if (this.colorInt.getColor() != this.color.getColor()) {
      ctx.lineJoin = "round";
      ctx.lineWidth = parseInt(font_size/6);
      ctx.strokeStyle = this.colorInt.getColor();
      ctx.strokeText(name, _text_pos_x, _text_pos_y);
    }

    // write the button name
    ctx.fillText(name, _text_pos_x, _text_pos_y);

    // draw the under line
    if (this.underlined) {
      txtW = ctx.measureText(name).width;
      ctx.strokeStyle = this.color.getColor();
      ctx.lineWidth = MathFloor(font_size/10) || 2;
      ctx.lineCap = "round";

      ctx.beginPath();
      // ctx.moveTo( parseInt((this.w-txtW)/2) + despX, MathFloor((this.h + font_size)/2) + MathFloor(font_size/5) - 1.5 + despY );
      // ctx.lineTo( parseInt((this.w+txtW)/2) + despX, MathFloor((this.h + font_size)/2) + MathFloor(font_size/5) - 1.5 + despY );
      ctx.moveTo( parseInt((this.w-txtW)/2) + despX, _text_pos_y + MathFloor(font_size/2) + MathFloor(font_size/5) - 1.5 );
      ctx.lineTo( parseInt((this.w+txtW)/2) + despX, _text_pos_y + MathFloor(font_size/2) + MathFloor(font_size/5) - 1.5 );
      ctx.stroke();
    }
     
    if (!this.activeIfValue) {
      ctx.fillStyle = "rgba(" + 0xf0 + "," + 0xf0 + "," + 0xf0 + "," + (0xa0/255) + ")";
      ctx.fillRect(0, 0, this.w, this.h);      
      // ctx.globalCompositeOperation = "destination-in";
      // ctx.fillStyle = "rgba(" + 0xf0 + "," + 0xf0 + "," + 0xf0 + "," + (0x66/255) + ")";
      // ctx.fillRect(0, 0, this.w, this.h);
      // ctx.globalCompositeOperation = "source-over";
    }
    
  }
  
  /**
   * Function executed when the button is pressed
   */
  descartesJS.Button.prototype.buttonPressed = function() {
    this.updateAndExecAction();
  }
  
  /**
   * Register the mouse and touch events
   */
  descartesJS.Button.prototype.registerMouseAndTouchEvents = function() {
    hasTouchSupport = descartesJS.hasTouchSupport;
    var self = this;
    var timer;

    // prevent the context menu display
    self.canvas.oncontextmenu = function () { return false; };

    /**
     * Repeat a function during a period of time, when the user click and hold the click in the button
     * @param {Number} delayTime the delay of time between the function repetition
     * @param {Function} fun the function to execut
     * @param {Boolean} firstime a flag to indicated if is the first time clicked
     * @private
     */
    function repeat(delayTime, fun, firstTime) {
      clearInterval(timer);

      if ((self.buttonClick) && (self.drawIfValue) && (self.activeIfValue)) {
        fun.call(self);
        delayTime = (firstTime) ? delayTime : 100;
        timer = setTimeout(function() { repeat(delayTime, fun); }, delayTime);
      }


    }

    this.buttonClick = false;
    this.over = false;
    
    if (hasTouchSupport) {
      this.canvas.addEventListener("touchstart", onMouseDown);
    } else {
      this.canvas.addEventListener("mousedown", onMouseDown);
      this.canvas.addEventListener("mouseover", onMouseOver);
      this.canvas.addEventListener("mouseout", onMouseOut);
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseDown(evt) {
      // remove the focus of the controls
      document.body.focus();

      evt.preventDefault();
      evt.stopPropagation();

      // blur other elements when clicked
      if (document.activeElement != document.body) {
        document.activeElement.blur();
      }

      self.whichButton = descartesJS.whichButton(evt);

      if (self.whichButton == "L") {
        if (self.activeIfValue) {
          self.buttonClick = true;
          
          self.draw();
          
          // se registra el valor de la variable
          self.evaluator.setVariable(self.id, self.evaluator.evalExpression(self.valueExpr));

          if (self.action == "calculate") {
            repeat(delay, self.buttonPressed, true);
          }
          
          if (hasTouchSupport) {
            self.canvas.removeEventListener("touchend", onMouseUp);
            self.canvas.addEventListener("touchend", onMouseUp);
          } 
          else {
            self.canvas.removeEventListener("mouseup", onMouseUp);
            self.canvas.addEventListener("mouseup", onMouseUp);
          }
        }
      }
    }

    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseUp(evt) {
      // remove the focus of the controls
      document.body.focus();
      
      if ((self.activeIfValue) || (self.buttonClick)) {
        self.buttonClick = false;
        self.draw();
        
        if (self.action != "calculate") {
          self.buttonPressed();
        }
        
        evt.preventDefault();
        evt.stopPropagation();

        if (hasTouchSupport) {
          self.canvas.removeEventListener("touchend", onMouseUp);
        } 
        else {
          self.canvas.removeEventListener("mouseup", onMouseUp);
        }
      }
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseOver(evt) {
      self.over = true;
      self.draw();
    }
    
    /**
     * 
     * @param {Event} evt 
     * @private
     */
    function onMouseOut(evt) {
      self.over = false;
      self.buttonClick = false;
      self.draw();
    }


  }

  descartesJS.Button.prototype.getScreenshot = function() {
    return this.canvas;
  }

  return descartesJS;
})(descartesJS || {});