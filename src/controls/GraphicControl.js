/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  const PI2 = Math.PI*2;
  const radioTouch = 48;
  const radioTouchImage = 32;

  let evaluator;
  let parser;
  let x;
  let y;
  let width;
  let height;
  let c_pos;
  let ctx;
  let backCtx;
  let constraintPosition;
  let hasTouchSupport;
  let tmp;

  class GraphicControl extends descartesJS.Control {
    /**
     * Descartes graphic control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the graphic control
     */
    constructor(parent, values) {
      super(parent, values);

      parser = parent.evaluator.parser;

      self = this;
      self.spaceID = values.spaceID || "";
      self.text = values.text || "";
      self.size = values.size || parser.parse("4");
      self.font = values.font || "Serif,PLAIN,12";
      self.image = new Image();
      self.image.onload = function() {
        this.ready = 1;
      }
      self.imageSrc = values.imageSrc || "";
      
      if ((/^\[.*\]$/).test(self.imageSrc)) {
        self.imageSrc = self.parser.parse(self.imageSrc.slice(1, -1));
      }
      else {
        self.imageSrc = self.parser.parse(`'${self.imageSrc}'`);
      }

      // get the Descartes font
      self.font = descartesJS.convertFont(self.font);

      // build the constraint
      if (self.constraintExpr) {
        self.constraint = parser.parse(self.constraintExpr);

        if (self.constraint.type == "(expr)") {
          self.constraint = parser.parse(self.constraintExpr.substring(1, self.constraintExpr.length-1));
        }

        if (self.constraint.type == "compOperator") {
          let left = self.constraint.childs[0];
          let right = self.constraint.childs[1];

          if ( (left.type == "identifier") && (left.value == "y") && (!right.contains("y")) ) {
            self.constVar = "x";
            self.noConstVar = "y";
            self.evalConst = self.evalConstXoY;
            self.constraint = right;
          }
          else if ( (left.type == "identifier") && (left.value == "x") && (!right.contains("x")) ) {
            self.constVar = "y";
            self.noConstVar = "x";
            self.evalConst = self.evalConstXoY;
            self.constraint = right;
          }
          else {
            self.newt = new descartesJS.R2Newton(self.evaluator, self.constraint);
          }
        }
        else {
          self.constraint = null;
        }

        constraintPosition = new descartesJS.R2(0, 0);
      }

      // get the container
      self.container = self.getContainer();

      // dom element for catch the mouse events
      self.mouseCatcher = descartesJS.newHTML("div", {
        class    : "DescartesGraphicControl",
        id       : self.id,
        dragged  : true,
        tabindex : "-1",
        style    : `z-index:${self.zIndex};`,
      });

      self.ctx = self.space.ctx;

      self.container.appendChild(self.mouseCatcher);

      // register the mouse and touch events
      self.addEvents();

      self.xStr = self.id + ".x";
      self.yStr = self.id + ".y";
      self.activoStr = self.id + ".activo";
      self.activeStr = self.id + ".active";

      let init_str = ((self.space.id !== "") && (parent.version !== 2)) ? self.space.id + "." : "";
      self.mX = init_str + "mouse_x";
      self.mY = init_str + "mouse_y";
      self.mClicked = init_str + "mouse_clicked";
      self.mClicIzq = init_str + "clic_izquierdo";

      self.init();
    }

    /**
     * Init the graphic control
     */
    init(preservePos) {
      self = this;
      evaluator = self.evaluator;
      hasTouchSupport = descartesJS.hasTouchSupport;

      // find the x and y position
      if (!preservePos) {
        let expr = evaluator.eval(self.expresion)[0];
        self.x = expr[0];
        self.y = expr[1];
        evaluator.setVariable(self.xStr, self.x);
        evaluator.setVariable(self.yStr, self.y);
      }
      self.img_src_eval = evaluator.eval(self.imageSrc).toString().trim();

      // if the control has an image name
      if ((self.img_src_eval != "") && !((/vacio.gif$/i).test(self.img_src_eval))) {
        self.image = self.parent.getImage(self.img_src_eval);

        self.width  = self.image.width;
        self.height = self.image.height;

        self._w = Math.max(self.width, radioTouchImage);
        self._h = Math.max(self.height, radioTouchImage);
      }
      else {
        self.width  = (evaluator.eval(self.size)*2);
        self.height = (evaluator.eval(self.size)*2);

        self._w = ((hasTouchSupport) && (self.width < radioTouch))  ? radioTouch : self.width;
        self._h = ((hasTouchSupport) && (self.height < radioTouch)) ? radioTouch : self.height;

        // set a style to make the button round
        self.mouseCatcher.style.borderRadius = parseInt( Math.min(self._w, self._h)/2 ) + "px";
      }

      self.mouseCatcher.style.width  = self._w + "px";
      self.mouseCatcher.style.height = self._h + "px";
      self.mouseCatcher.style.left = parseInt(self.space.getAbsoluteX(self.x)-self._w/2)+"px";
      self.mouseCatcher.style.top  = parseInt(self.space.getAbsoluteY(self.y)-self._h/2)+"px";

      evaluator.setVariable(self.activoStr, 0);
      evaluator.setVariable(self.activeStr, 0);

      self.setImage = false;

      self.update();
    }

    /**
     * Update the graphic control
     */
    update() {
      self = this;
      evaluator = self.evaluator;

      if (evaluator.eval(self.imageSrc).toString().trim() !== self.img_src_eval) {
        self.init(true);
      }

      // check if the control is active and visible
      self.activeIfValue = (evaluator.eval(self.activeif) > 0);
      self.drawIfValue   = (evaluator.eval(self.drawif) > 0);

      // update the position
      self.x = evaluator.getVariable(self.xStr);
      self.y = evaluator.getVariable(self.yStr);

      x = self.space.getAbsoluteX(self.x);
      y = self.space.getAbsoluteY(self.y);

      self.mouseCatcher.style.display = (!self.activeIfValue) ? "none" : "block";
      self.mouseCatcher.style.left = parseInt(x-self._w/2)+"px";
      self.mouseCatcher.style.top  = parseInt(y-self._h/2)+"px";

      // eval the constraint
      if (self.constraint) {
        self.evalConst();
      }

      self.draw();
    }

    /**
     * Draw the graphic control
     */
    draw() {
      self = this;
      evaluator = self.evaluator;

      if (self.drawIfValue) {
        ctx = self.ctx;
        backCtx = self.space.backgroundCtx;
        x = parseInt(self.space.getAbsoluteX(this.x)) + 0.5;
        y = parseInt(self.space.getAbsoluteY(this.y)) + 0.5;

        if (self.text != "") {
          self.drawText(x, y);
        }

        // if the control do not have a image or is not ready
        if (!self.image.ready) {
          width = parseInt(self.width/2);

          ctx.beginPath();
          ctx.arc(x, y, width, 0, PI2);

          ctx.fillStyle = self.colorInt.getColor();
          ctx.fill();

          ctx.lineWidth = 1;
          ctx.strokeStyle = self.color.getColor();
          ctx.stroke();

          if (self.active) {
            ctx.strokeStyle = self.colorInt.borderColor();
            ctx.beginPath();
            ctx.arc(x, y, width-2, 0, PI2);
            ctx.stroke();
          }

          // if has trace
          if (self.trace) {
            backCtx.strokeStyle = self.trace.getColor();
            backCtx.beginPath();
            backCtx.arc(x, y, width, 0, PI2);
            backCtx.stroke();
          }
        }
        // if the control has an image and is ready
        else {
          width  = self.image.width/2;
          height = self.image.height/2;
          if ((self.image.complete) && (!self.setImage)) {
            ctx.drawImage(self.image, parseInt(x-width), parseInt(y-height));
          }

          // if has trace
          if (self.trace) {
            backCtx.save();
            backCtx.translate(x, y);
            backCtx.scale(parseInt(width), parseInt(height));

            backCtx.beginPath();
            backCtx.arc(0, 0, 1, 0, PI2);
            backCtx.restore();

            backCtx.lineWidth = 1;
            backCtx.strokeStyle = self.trace.getColor();
            backCtx.stroke();
          }
        }
      }
    }

    /**
     * Eval the constraint and change the position
     */
    evalConst() {
      constraintPosition.set(this.x, this.y);
      c_pos = this.newt.findZero(constraintPosition, 1/this.space.scale, true);
      this.x = c_pos.x;
      this.y = c_pos.y;
      this.evaluator.setVariable(this.xStr, this.x);
      this.evaluator.setVariable(this.yStr, this.y);
    }

    /**
     * Eval the constraint and change the position
     */
    evalConstXoY() {
      evaluator = this.evaluator;

      tmp = evaluator.getVariable(this.constVar);

      evaluator.setVariable(this.constVar, this[this.constVar]);
      this[this.noConstVar] = evaluator.eval( this.constraint );

      evaluator.setVariable(this.xStr, this.x);
      evaluator.setVariable(this.yStr, this.y);

      evaluator.setVariable(this.constVar, tmp);
    }

    /**
     * Draw the graphic control text
     */
    drawText(x, y) {
      self = this;
      evaluator = self.evaluator;
      ctx = self.ctx;
      ctx.fillStyle = self.color.getColor();
      ctx.textBaseline = "alphabetic";

      // simpleText
      if (self.text.type == "simpleText") {
        ctx.font = self.font;

        ctx.fillText(
          self.text.toString(evaluator.eval(self.decimals), self.fixed),
          parseInt(x+1+self.width/2),
          parseInt(y-1-self.height/2)
        );
      }
      // rtfNode
      else {
        ctx.strokeStyle = self.color.getColor();
        self.text.draw(ctx, parseInt(x+1+self.width/2), parseInt(y-1-self.height/2), self.decimals, self.fixed, "start", true, self.color.getColor());
      }
    }

    /**
     * Add the control to a space and get the space container
     * @return {HTMLDiv} return the space container
     */
    getContainer() {
      let spaces = this.parent.spaces;

      // if the control is in a internal space
      for (let space_i of spaces) {
        if (space_i.id == this.spaceID) {
          space_i.addCtr(this);
          this.zIndex = space_i.zIndex;
          // set the space to draw the control
          this.space = space_i;
          return space_i.graphicControlContainer;
        }
      }

      // if do not find the space return the first space
      spaces[0].addCtr(this);
      this.zIndex = spaces[0].zIndex;
      // set the space to draw the control
      this.space = spaces[0];
      return spaces[0].graphicControlContainer;
    }

    /**
     * Deactivate the graphic control removing the circle mark
     */
    deactivate() {
      this.active = false;
      this.evaluator.setVariable(this.activoStr, 0);
      this.evaluator.setVariable(this.activeStr, 0);
      this.evaluator.setVariable(this.mClicIzq,  0);
    }

    /**
     * Register the mouse and touch events
     */
    addEvents() {
      let lastTime = 0;
      let posNew;
      let self = this;

      self.click  = false;
      self.over   = false;
      self.active = false;

      self.mouseCatcher.addEventListener("touchstart", onMouseDown);
      self.mouseCatcher.addEventListener("mousedown", onMouseDown);
      self.mouseCatcher.addEventListener("mouseover", onMouseOver);
      self.mouseCatcher.addEventListener("mouseout", onMouseOut);

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseDown(evt) {
        // remove the focus of the controls
        document.body.focus();

        evt.preventDefault();

        self.whichBtn = descartesJS.whichBtn(evt);

        if ( (self.whichBtn == "L") && (self.activeIfValue) ) {
          self.parent.deactivateControls();
          self.click = self.active = true;

          self.evaluator.setVariable(self.activoStr, 1);
          self.evaluator.setVariable(self.activeStr, 1);

          self.evaluator.setVariable(self.mClicked, 0);
          self.evaluator.setVariable(self.mClicIzq, 0);

          self.posAnte = descartesJS.getCursorPosition(evt, self.container);
          self.prePos = { 
            x: self.space.getAbsoluteX(self.x), 
            y: self.space.getAbsoluteY(self.y) 
          };

          self.evaluator.setVariable(self.mX, self.space.getRelativeX(self.posAnte.x));
          self.evaluator.setVariable(self.mY, self.space.getRelativeY(self.posAnte.y));

          self.parent.update();

          window.addEventListener("touchend", onMouseUp);
          window.addEventListener("touchmove", onMouseMove);
          window.addEventListener("mouseup", onMouseUp);
          window.addEventListener("mousemove", onMouseMove);
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

        evt.preventDefault();
        evt.stopPropagation();

        self.evaluator.setVariable(self.mClicked, 1);
        self.evaluator.setVariable(self.mClicIzq, 1);

        if ((self.activeIfValue) || (self.active)) {
          self.click = false;

          // remove all event listener
          window.removeEventListener("mouseup",   onMouseUp);
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("touchend",  onMouseUp);
          window.removeEventListener("touchmove", onMouseMove);

          posNew = (descartesJS.getCursorPosition(evt, self.container)) || posNew;

          self.posX = self.prePos.x - (self.posAnte.x - posNew.x);
          self.posY = self.prePos.y - (self.posAnte.y - posNew.y);

          self.evaluator.setVariable(self.xStr, self.space.getRelativeX(self.posX));
          self.evaluator.setVariable(self.yStr, self.space.getRelativeY(self.posY));
          self.evaluator.setVariable(self.mX, self.space.getRelativeX(posNew.x));
          self.evaluator.setVariable(self.mY, self.space.getRelativeY(posNew.y));

          self.parent.updateControls();
          self.parent.update();

          self.mouseCatcher.style.left = (self.space.getAbsoluteX(self.x)-self._w/2)+"px";
          self.mouseCatcher.style.top  = (self.space.getAbsoluteY(self.y)-self._h/2)+"px";
        }

        let act = self.evaluator.getVariable(self.activeStr);

        // deactivate control
        self.parent.deactivateControls();
        self.parent.updateControls();
        self.evaluator.setVariable(self.activoStr, act);
        self.evaluator.setVariable(self.activeStr, act);
        self.parent.update();
      }

      /**
       *
       * @param {Event}
       * @private
       */
      function onMouseMove(evt) {
        evt.preventDefault();

        self.evaluator.setVariable(self.mClicked, 0);
        self.evaluator.setVariable(self.mClicIzq, 0);

        posNew = descartesJS.getCursorPosition(evt, self.container);

        self.posX = self.prePos.x - (self.posAnte.x - posNew.x);
        self.posY = self.prePos.y - (self.posAnte.y - posNew.y);

        self.evaluator.setVariable(self.xStr, self.space.getRelativeX(self.posX));
        self.evaluator.setVariable(self.yStr, self.space.getRelativeY(self.posY));
        self.evaluator.setVariable(self.mX, self.space.getRelativeX(posNew.x));
        self.evaluator.setVariable(self.mY, self.space.getRelativeY(posNew.y));

        // limit the number of updates in the lesson
        if (Date.now() - lastTime > 80) {
          // update the controls
          self.parent.updateControls();
          self.parent.update();
          lastTime = Date.now();
        }
      }

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseOver(evt) {
        self.over = true;
      }

      /**
       *
       * @param {Event} evt
       * @private
       */
      function onMouseOut(evt) {
        self.over = false;
        self.click = false;
      }
    }
  }

  descartesJS.GraphicControl = GraphicControl;
  return descartesJS;
})(descartesJS || {});
