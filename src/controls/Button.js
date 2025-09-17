/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  const gifPattern = /[\w\.\-//]*(\.gif)/gi;
  const canvasGradientPattern = /CanvasGradient|CanvasPattern/;

  let MathFloor = Math.floor;
  let MathAbs = Math.abs;

  let evaluator;
  let btn;
  let ctx;
  let expr;
  let font_size;
  let name;
  let imageSrc;
  let image;
  let desp;
  let despX;
  let despY;
  let txtW;
  let txtH;

  let _img_w;
  let _img_h;
  let _image_pos_x;
  let _image_pos_y;
  let _text_pos_x;
  let _text_pos_y;

  let container;

  let checkOver;
  let checkClick;
  let checkActive;
  let checkDrawIf;
  let checkName;
  let checkImageSrc;
  let checkBackColor;
  let checkTextColor;
  let checkImageReady;

  let prefix;
  let suffix;
  let imageOverSrc;
  let imageDownSrc;
  let imageOver;
  let imageDown;

  let int_color;

  class Button extends descartesJS.Control {
    /**
     * Descartes button control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the button control
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      self = this;

      self.imageSrc = values.imageSrc || "";
      self.image = values.image || new Image();
      self.imageOver = values.imageOver || new Image();
      self.imageDown = values.imageDown || new Image();
      self.flat = values.flat || false;
      self.borderColor = values.borderColor || false;
      self.text_align = values.text_align || "center_center";
      self.image_align = values.image_align || "center_center";

      self.font_family = descartesJS.getFontName(values.font_family || "arial");

      self.ratio = parent.ratio;

      // font size not set
      if (self.font_size === -1) {
        self.noFSize = true;
      }

      if (self.borderColor) {
        self.borderColor = new descartesJS.Color(self.borderColor);
      }
      self.text_align  = self.text_align.split("_");
      self.image_align = self.image_align.split("_");

      self.oName = self.name;

      // modification to change the name of the button with an expression
      if ((/^\[.*\]$/).test(self.name)) {
        self.name = self.parser.parse(self.name.slice(1, -1));
      }
      else {
        self.name = self.parser.parse(`'${self.name}'`);
      }

      let tmpParam;
      self.classContainer = (self.cssClass) ? ` ${self.cssClass} ` : "";

      self.extra_style = self.extra_style || "";

      if ((/^_STYLE_/).test(self.imageSrc.trim())) {
        self.imageSrc = "vacio.gif";
        self.extra_style = self.imageSrc.trim().substring(8);
      }

      if (self.extra_style) {
        self.customStyle = true;
        self.btnStyle = [];
        self.conStyle = [];
        self.conStyle.textBorder = 3;

        let tempo;
        let extra_style_id;
        let extra_style_value;
        let prefixRGB;
        for (let style_i of self.extra_style.split("|")) {
          tempo = (style_i.trim()).match(/(.*)=(.*)/);
          extra_style_id    = (tempo) ? tempo[1].trim() : "";
          extra_style_value = (tempo) ? tempo[2].trim() : "";
          prefixRGB = (extra_style_value.match(/rgb/g)) ? "" : "#";

          if (extra_style_id === "class") {
            self.classContainer = " " + extra_style_value;
          }
          else if (extra_style_id === "border") {
            self.btnStyle.push( { type: "border-style", value: "solid" } );
            self.btnStyle.push( { type: "border-width", value: extra_style_value + "px" } );
          }
          else if (extra_style_id === "borderRadius") {
            self.btnStyle.push( { type: "border-radius", value: extra_style_value + "px" } );
            self.conStyle.push( { type: "border-radius", value: extra_style_value + "px" } );
          }
          else if (extra_style_id === "borderColor") {
            self.btnStyle.push( { type: "border-color", value: prefixRGB + extra_style_value } );
          }
          else if ((/^(overColor|downColor|inactiveColor|inactiveColorBorder|shadowTextColor|shadowBoxColor|shadowInsetBoxColor)$/).test(extra_style_id)
          ) {
            self.conStyle[extra_style_id] = prefixRGB + extra_style_value;
          }
          else if (extra_style_id === "font") {
            self.conStyle[extra_style_id] = extra_style_value.toLowerCase();
          }
          else if ((/^(shadowTextBlur|shadowTextOffsetX|shadowTextOffsetY|shadowBoxBlur|shadowBoxOffsetX|shadowBoxOffsetY|shadowInsetBoxBlur|shadowInsetBoxOffsetX|shadowInsetBoxOffsetY|textBorder)$/).test(extra_style_id)) {
            self.conStyle[extra_style_id] = parseFloat(extra_style_value) || 0;
          }
          else if ((/^(imgSizeW|imgSizeH)$/).test(extra_style_id)) {
            self[extra_style_id] = parseFloat(extra_style_value) || 0;
          }

          else if (extra_style_id === "flat") {
            self[extra_style_id] = parseInt(extra_style_value) == 1;
          }
        }
      }

      // color expression of the form _COLORES_ffffff_000000_P_22 specified in the image field
      // the first color is the background color
      // the second color is the text color
      // the last number is the font size
      if (self.imageSrc.startsWith("_COLORES_")) {
        tmpParam       = self.imageSrc.split("_");
        self.colorInt  = new descartesJS.Color(tmpParam[2]);
        self.color     = new descartesJS.Color(tmpParam[3]);
        self.font_size = self.parser.parse(tmpParam[5]);
        self.imageSrc  = "";
      }

      if ((/^\[.*\]$/).test(self.imageSrc)) {
        self.imageSrc = self.parser.parse(self.imageSrc.slice(1, -1));
      }
      else {
        self.imageSrc = self.parser.parse(`'${self.imageSrc}'`);
      }

      // if the button has an image then load it and try to load the over and down images
      let imageSrc = self.evaluator.eval(self.imageSrc).toString().trim();

      if (imageSrc != "") {
        prefix = imageSrc.substr(0, imageSrc.lastIndexOf("."));
        suffix  = imageSrc.substr(imageSrc.lastIndexOf("."));

        // empty image, i.e. reference to vacio.gif
        if (imageSrc.match(/vacio.gif$/i)) {
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

          // if the name is empty, do not try to get over and down images
          if (prefix) {
            try {
              this.imageOver = this.parent.getImage(prefix + "_over" + suffix);
              this.imageDown = this.parent.getImage(prefix + "_down" + suffix);
            } catch(e) {};
          }
        }
      }

      self.container = descartesJS.newHTML("div", {
        class : "DescartesButtonContainer" + self.classContainer,
        id    : self.id,
        style : `width:${self.w}px;height:${self.h}px;left:${self.x}px;top:${self.y}px;z-index:${self.zIndex};`,
      });

      // create the btn and the rendering context
      self.btn = descartesJS.newHTML("canvas", {
        width  : self.w * self.ratio,
        height : self.h * self.ratio,
        style  : `position:absolute;left:0;top:0;width:${self.w}px;height:${self.h}px;`,
      });

      self.ctx = self.btn.getContext("2d");
      self.ctx.imageSmoothingEnabled = false;

      if (self.tooltip) {
        self.btn.title = self.tooltip;
      }

      self.container.appendChild(self.btn);

      self.addControlContainer(self.container);

      // register the mouse and touch events
      self.addEvents();

      // init the button parameters
      self.init();
    }

    /**
     * Init the button
     */
    init(force) {
      self = this;
      evaluator = self.evaluator;
      container = self.container;
      btn = self.btn;
      ctx = self.ctx;
      expr = evaluator.eval(self.expresion)[0];
      self.x = expr[0];
      self.y = expr[1];
      if (expr.length == 4) {
        self.w = parseInt(expr[2]);
        self.h = parseInt(expr[3]);
      }

      btn.width  = self.w *self.ratio;
      btn.height = self.h *self.ratio;
      btn.setAttribute("style", `position:absolute;left:0;top:0;width:${self.w}px;height:${self.h}px;box-sizing:border-box;`);
      container.setAttribute("style", `width:${self.w}px;height:${self.h}px;left:${self.x}px;top:${self.y}px;z-index:${self.zIndex};display:block;`);


      if (self.btnStyle) {
        for (let btnStyle_i of self.btnStyle) {
          btn.style[btnStyle_i.type] = btnStyle_i.value;
        }
      }
      if (self.conStyle) {
        for (let conStyle_i of self.conStyle) {
          container.style[conStyle_i.type] = conStyle_i.value;
        }

        if (self.conStyle.shadowBoxColor) {
          container.style.boxShadow = `${self.conStyle.shadowBoxOffsetX || 0}px ${self.conStyle.shadowBoxOffsetY || 2}px ${self.conStyle.shadowBoxBlur || 2}px 1px ${self.conStyle.shadowBoxColor}`;
        }
        if (self.conStyle.shadowInsetBoxColor) {
          btn.style.boxShadow = `${self.conStyle.shadowInsetBoxOffsetX || 0}px ${self.conStyle.shadowInsetBoxOffsetY || -2}px ${self.conStyle.shadowInsetBoxBlur || 1}px 1px ${self.conStyle.shadowInsetBoxColor} inset`;
        }
      }


      // font size not set
      if (self.noFSize) {
        self.font_size = evaluator.parser.parse(descartesJS.getFieldFontSize(this.h) +"");
      }
      self.fs_evaluated = evaluator.eval(self.font_size);

      // create the background gradient
      self.createGradient(self.w, self.h);

      container.style.display = (evaluator.eval(self.drawif) > 0) ? "block" : "none";

      ctx.lineJoin = "round";
      ctx.font = `${self.italics} ${self.bold} ${self.fs_evaluated}px ${self.font_family}`;

      self.text_object = new descartesJS.TextObject({
        parent : {
          decimal_symbol : self.parent.decimal_symbol
        },
        evaluator : evaluator,
        decimals : self.decimals,
        fixed: false,
        align: "left",
        anchor: "center_center",
        width: self.parser.parse("0"),
        font_size: self.font_size,
        font_family: self.font_family,
        italics: self.italics,
        bold: self.bold,
        border: self.borderColor, 
        border_size: (self.conStyle) ? self.conStyle.textBorder : undefined,
        shadowBlur: (self.conStyle && self.conStyle.shadowTextColor) ? self.conStyle.shadowTextBlur || 1 : undefined,
        shadowOffsetX: (self.conStyle && self.conStyle.shadowTextColor) ? self.conStyle.shadowTextOffsetX || 0 : undefined,
        shadowOffsetY: (self.conStyle && self.conStyle.shadowTextColor) ? self.conStyle.shadowTextOffsetY || 2 : undefined,
        shadowColor: (self.conStyle && self.conStyle.shadowTextColor) ? self.conStyle.shadowTextColor: undefined,
      }, self.oName);
      
      self.draw(force);
    }

    /**
     * Update the button
     */
    update() {
      self = this;
      evaluator = self.evaluator;
      container = self.container;

      // check if the control is active and visible
      self.activeIfValue = (evaluator.eval(self.activeif) > 0);
      self.drawIfValue   = (evaluator.eval(self.drawif) > 0);

      // hide or show the button control
      if ( ((self.space) ? self.space.drawIfValue : true) && self.drawIfValue ) {
        container.style.display = "block";
        self.draw();

        container.style.cursor = self.btn.style.cursor = (self.activeIfValue) ? "pointer" : "not-allowed";

        container.setAttribute("active", self.activeIfValue);
        
        // update the position and size
        self.updatePositionAndSize();
      }
      else {
        container.style.display = "none";
        self.buttonClick = false;
      }
    }

    /**
     * Draw the button
     */
    draw(force) {
      self = this;
      container = self.container;
      evaluator = self.evaluator;
      btn = self.btn;
      ctx = self.ctx;

      name = evaluator.eval(self.name);
      // update the text
      self.text_object.draw(descartesJS.ctx, "#000000", 0, 0);
      // get a string from the textNodes
      name = self.text_object.textNodes.toStr();

      imageSrc = self.evaluator.eval(self.imageSrc).toString().trim();

      if (!force) {
        checkOver = (self.over === self.oldOver);
        checkClick = (self.buttonClick === self.oldButtonClick);
        checkActive = (self.activeIfValue === self.oldActiveIfValue);
        checkDrawIf = (self.drawIfValue === self.oldDrawIfValue);
        checkName = (name === self.oldName);
        checkImageSrc = (imageSrc === self.oldImageSrc);
        checkBackColor = (self.colorInt.getColor() === self.oldBackColor);
        checkTextColor = (self.color.getColor() === self.oldTextColor);
        checkImageReady = (self.image.ready === self.oldImageReady);

        self.oldOver = self.over;
        self.oldButtonClick = self.buttonClick;
        self.oldActiveIfValue = self.activeIfValue;
        self.oldDrawIfValue = self.drawIfValue;
        self.oldName = name;
        self.oldImageSrc = imageSrc;
        self.oldBackColor = self.colorInt.getColor();
        self.oldTextColor = self.color.getColor();
        self.oldImageReady = self.image.ready;

        if (checkOver && checkClick && checkActive && checkDrawIf && checkName && checkImageSrc && checkBackColor && checkTextColor && checkImageReady) {
          return;
        };
      }

      ctx.save();
      ctx.setTransform(self.ratio, 0, 0, self.ratio, 0, 0);

      font_size = self.fs_evaluated;
      container.setAttribute("data-name", name);

      if (imageSrc) {
        image = (imageSrc === "vacio.gif") ? this.emptyImage : this.parent.getImage(imageSrc);

        prefix = imageSrc.substr(0, imageSrc.lastIndexOf("."));
        suffix  = imageSrc.substr(imageSrc.lastIndexOf("."));

        imageOverSrc = prefix + "_over" + suffix;
        imageDownSrc = prefix + "_down" + suffix;
        imageOver = (imageSrc === "vacio.gif") ? this.emptyImage : this.parent.getImage(imageOverSrc);
        imageDown = (imageSrc === "vacio.gif") ? this.emptyImage : this.parent.getImage(imageDownSrc);
      }
      else {
        image = imageOver = imageDown = self.emptyImg;
      }

      ctx.clearRect(0, 0, self.w, self.h);

      // text displace when the button is pressed
      despX = despY = (self.buttonClick) ? 1 : 0;

      //////////////////////////////////////////////////////////
      // text position
      //////////////////////////////////////////////////////////
      self.text_object.draw(ctx, self.color.getColor(), 0, 0, true);

      txtW = self.text_object.textNodes.metrics.w;
      txtH = self.text_object.textNodes.metrics.h;

      // horizontal text align
      if (self.text_align[1] == "center") {
        _text_pos_x = MathFloor(self.w/2 + despX)-0.5;
      }
      else if (self.text_align[1] == "left") {
        _text_pos_x = txtW/2 + 5 + despX;
      }
      else if (self.text_align[1] == "right") {
        _text_pos_x = self.w - txtW/2 + despX -5;
      }

      // vertical text align
      if (self.text_align[0] == "center") {
        _text_pos_y = MathFloor(self.h/2 + despY)-0.5;
      }
      else if (self.text_align[0] == "top") {
        _text_pos_y = txtH/2 + despY +4;
      }
      else if (self.text_align[0] == "bottom") {
        _text_pos_y = self.h - txtH/2 + despY -3;
      }

      //////////////////////////////////////////////////////////
      // image position
      //////////////////////////////////////////////////////////
      if (image) {
        _img_w = self.imgSizeW || image.width;
        _img_h = self.imgSizeH || image.height;

        // horizontal image align
        if (self.image_align[1] == "center") {
          _image_pos_x = parseInt((self.w - _img_w)/2) +despX;
        }
        else if (self.image_align[1] == "left") {
          _image_pos_x = despX;
        }
        else if (self.image_align[1] == "right") {
          _image_pos_x = self.w-_img_w +despX;
        }

        // vertical image align
        if (self.image_align[0] == "center") {
          _image_pos_y = parseInt((self.h - _img_h)/2) +despY;
        }
        else if (self.image_align[0] == "top") {
          _image_pos_y = despY;
        }
        else if (self.image_align[0] == "bottom") {
          _image_pos_y = self.h - _img_h +despY;
        }
  
        ////////////////////////////////////////////////////////////////////////////////////////
        // the image is ready
        if ((image) && (image.ready)) {
          if ( (image !== self.emptyImg) && (image.complete) ) {
            // check if is a gif image
            if ( imageSrc.match(gifPattern) ) {
              btn.style.backgroundRepeat = "no-repeat";
              btn.style.backgroundImage = `url('${imageSrc}')`;
              btn.style.backgroundPosition = `${_image_pos_x}px ${_image_pos_y}px`;
            }
            else {
              // the background is drawn, even with the image
              if ((self.image_align[0] != "center") || (self.image_align[1] != "center")) {
                int_color = self.colorInt.getColor();

                if (int_color && canvasGradientPattern.test(int_color.constructor.name) ) {
                  ctx.fillStyle = int_color;
                  ctx.fillRect(0, 0, self.w, self.h);
                } else {
                  container.style.backgroundColor = int_color;
                }
              }

              ctx.drawImage(
                image, 
                0, 0,
                image.width, image.height,
                _image_pos_x, _image_pos_y,
                _img_w, _img_h
              );
            }
          }
          else if ((self.emptyImg) && (self.customStyle)) {
            int_color = self.colorInt.getColor();

            if (int_color && canvasGradientPattern.test(int_color.constructor.name) ) {
              ctx.fillStyle = int_color;
              ctx.fillRect(0, 0, self.w, self.h);
            } else {
              container.style.backgroundColor = int_color;
            }
          }
        }
      }
      // the image is not ready or the button do not have a image
      else {
        int_color = self.colorInt.getColor();

        if (int_color && canvasGradientPattern.test(int_color.constructor.name) ) {
          ctx.fillStyle = int_color;
          ctx.fillRect(0, 0, self.w, self.h);
        } else {
          container.style.backgroundColor = int_color;

          // add the gradient and border when not flat
          if (!self.flat) {
            if (!self.buttonClick) {
              self.drawLine(ctx, self.w-1, 0, self.w-1, self.h, "rgba(0,0,0,0.5)");
              self.drawLine(ctx, 0, 0, 0, self.h, "rgba(0,0,0,0.09)");
              self.drawLine(ctx, 1, 0, 1, self.h, "rgba(0,0,0,0.03)");
            }

            ctx.fillStyle = self.linearGradient;
            ctx.fillRect(0, 0, self.w, self.h);
          }
        }
      }

      ////////////////////////////////////////////////////////////////////////////////////////
      // over image
      if (self.activeIfValue) {
        if ( (imageOver !== self.emptyImg) && (self.over) && (imageOver.ready) && (imageOver.complete) ) {
          if ( imageOverSrc.match(gifPattern) ) {
            btn.style.backgroundImage = `url('${imageOverSrc}')`;
            btn.style.backgroundPosition = `${_image_pos_x}px ${_image_pos_y}px`;
          }
          else {
            ctx.drawImage(imageOver, _image_pos_x, _image_pos_y);
          }
        }
        else if ((self.customStyle) && (self.conStyle.overColor) && (self.over)) {
          container.style.backgroundColor = self.conStyle.overColor;
        }
      }

      ////////////////////////////////////////////////////////////////////////////////////////
      // down image
      if (self.activeIfValue) {
        if ( (imageDown !== self.emptyImg) && (self.buttonClick) && (imageDown.ready) && (imageDown.complete) ) {
          if ( imageDownSrc.match(gifPattern) ) {
            btn.style.backgroundImage = `url('${imageDownSrc}')`;
            btn.style.backgroundPosition = `${_image_pos_x}px ${_image_pos_y}px`;
          }
          else {
            ctx.drawImage(imageDown, _image_pos_x, _image_pos_y);
          }
        }
        else if ((self.customStyle) && (self.conStyle.downColor) && (self.buttonClick)) {
          container.style.backgroundColor = self.conStyle.downColor;
        }
      }
      else if ((self.buttonClick) && (!image)) {
        ctx.fillStyle = "rgba(0,0,0,0.09)";
        ctx.fillRect(0, 0, self.w, self.h);
      }

      ////////////////////////////////////////////////////////////////////////////////////////

      ////////////////////////////////////////////////////////////////////////////////////////
      ctx.fillStyle = self.color.getColor();

      if (self.customStyle) {
        if ((self.conStyle.shadowTextColor) && (self.conStyle.textBorder > 0)) {
          ctx.lineWidth   = self.conStyle.textBorder;
          ctx.strokeStyle = self.conStyle.shadowTextColor;
        }
      }

      if (self.borderColor) {
        ctx.lineWidth   = parseInt(font_size/6);
        ctx.strokeStyle = self.borderColor.getColor();
      }

      ////////////////////////////////////////////////////////////////////////////////////////
      // write the button name
      self.text_object.draw(ctx, self.color.getColor(), _text_pos_x, _text_pos_y);

      ////////////////////////////////////////////////////////////////////////////////////////
      // draw the under line
      if (self.underlined) {
        ctx.strokeStyle = self.color.getColor();
        ctx.lineWidth = MathFloor(font_size*0.1) || 2;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo( _text_pos_x -txtW/2 + despX, _text_pos_y + MathFloor(font_size/2) + MathFloor(font_size/5) - 1.5 );
        ctx.lineTo( _text_pos_x +txtW/2 + despX, _text_pos_y + MathFloor(font_size/2) + MathFloor(font_size/5) - 1.5 );
        ctx.stroke();
      }

      ////////////////////////////////////////////////////////////////////////////////////////
      if (!self.activeIfValue) {
        if ((self.customStyle) && (self.conStyle.inactiveColor)) {
          container.style.backgroundColor = self.conStyle.inactiveColor;
        }
        else {
          ctx.fillStyle = "rgba(240,240,240,0.6)";
          ctx.fillRect(0, 0, self.w, self.h);
        }
      }

      ctx.restore();

      // for the screenshot
      self._image_pos_x = _image_pos_x;
      self._image_pos_y = _image_pos_y;
    }

    /**
     * Function for draw the spinner control, that draws a line
     * @param {2DContext} ctx the canvas context to draw
     * @param {Number} x1 the x position of the initial point
     * @param {Number} y1 the y position of the initial point
     * @param {Number} x2 the x position of the final point
     * @param {Number} y2 the y position of the final point
     * @param {String} strokeStyle the style of the stroke used to draw the line
     * @param {Number} lineWidth the width of the line to draw
     */
    drawLine(ctx, x1, y1, x2, y2, strokeStyle="black", lineWidth=1) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeStyle;
      desp = (ctx.lineWidth%2)*0.5;

      ctx.beginPath();
      ctx.moveTo(MathFloor(x1)+desp, MathFloor(y1)+desp);
      ctx.lineTo(MathFloor(x2)+desp, MathFloor(y2)+desp);
      ctx.stroke();
    }

    /**
     *
     */
    drawTextBorder() {
      // compute the correct components
      this.colorInt.getColor();
      this.color.getColor();

      return !((( MathAbs(this.colorInt.r - this.color.r) + MathAbs(this.colorInt.g - this.color.g) + MathAbs(this.colorInt.b - this.color.b) )/255) < 0.5);
    }

    /**
     * Register the mouse and touch events
     */
    addEvents() {
      let self = this;
      let delay = 1000;
      let timer;

      /**
       * Repeat a function during a period of time, when the user click and hold the click in the button
       * @param {Number} delayTime the delay of time between the function repetition
       * @param {Function} fun the function to execute
       * @param {Boolean} firsTime a flag to indicated if is the first time clicked
       * @private
       */
      function repeat(delayTime, fun, firstTime) {
        descartesJS.clearTimeout(timer);

        if ((self.buttonClick) && (self.drawIfValue) && (self.activeIfValue)) {
          fun.call(self);
          delayTime = (firstTime) ? delayTime : 100;
          timer = descartesJS.setTimeout(function() { repeat(delayTime, fun, false); }, delayTime);
        }
      }

      this.buttonClick = false;
      this.over = false;

      this.btn.addEventListener("touchstart", onMouseDown);
      this.btn.addEventListener("mousedown", onMouseDown);
      this.btn.addEventListener("mouseover", onMouseOver);
      this.btn.addEventListener("mouseout", onMouseOut);

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseDown(evt) {
        // remove the focus of the controls
        self.parent.deactivateControls();
        
        this.focus();

        evt.preventDefault();
        evt.stopPropagation();

        // blur other elements when clicked
        if (document.activeElement != document.body) {
          document.activeElement.blur();
        }

        self.whichBtn = descartesJS.whichBtn(evt);

        if ( (self.whichBtn == "L") && (self.activeIfValue) ) {
          self.buttonClick = true;

          self.draw();

          if (self.action == "calculate") {
            // the value of the variable is set
            self.evaluator.setVariable(self.id, self.evaluator.eval(self.valueExpr));
            repeat(delay, self.updateAndExecAction, true);
          }

          self.btn.removeEventListener("touchend", onMouseUp);
          self.btn.addEventListener("touchend", onMouseUp);
          self.btn.removeEventListener("mouseup", onMouseUp);
          self.btn.addEventListener("mouseup", onMouseUp);
        }
      }

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseUp(evt) {
        // needed for the save action
        descartesJS.newBlobContent = null;

        // remove the focus of the controls
        this.focus();

        evt.preventDefault();
        evt.stopPropagation();

        if ((self.activeIfValue) || (self.buttonClick)) {
          self.buttonClick = false;
          self.draw();

          if (self.action != "calculate") {
            // the value of the variable is set
            self.evaluator.setVariable(self.id, self.evaluator.eval(self.valueExpr));
            self.updateAndExecAction();
          }

          self.btn.removeEventListener("touchend", onMouseUp);
          self.btn.removeEventListener("mouseup", onMouseUp);
        }
        // maybe an error
        else {
          self.parent.update();
        }
      }

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();

        self.over = true;
        self.draw();
      }

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseOut(evt) {
        // needed for the save action
        descartesJS.newBlobContent = null;
        
        evt.preventDefault();
        evt.stopPropagation();

        self.over = false;
        self.buttonClick = false;
        self.draw();
      }

      /**
       *
       */
      document.addEventListener("visibilitychange", function(evt) {
        // needed for the save action
        descartesJS.newBlobContent = null;
        self.buttonClick = false;
      });
    }
  }

  descartesJS.Button = Button;
  return descartesJS;
})(descartesJS || {});
