/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let MathFloor = Math.floor;
  let MathRound = Math.round;
  let hh;
  let di;
  let changeX;
  let changeY;
  let changeW;
  let changeH;
  let expr;

  let temporalCompare;
  let resultValue;
  let decimals;
  let indexDot;
  let subS;
  let parent;

  class Control {
    /**
     * Descartes control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the control
     */
    constructor(parent, values) {
      self = this;

      self.parent = parent;
      self.evaluator = parent.evaluator;
      let parser = self.parser = parent.evaluator.parser;

      self.id = (values.type !== "GraphicControl") ? "C" : "G";

      self.region = "south";

      self.x = self.y = 0;

      self.w = (values.type !== "Video") ? 100 : 350;
      self.h = (values.type !== "Video") ? 23 : 120;

      self.keyboard = false;
      self.kblayout = "1x16";

      if ((values.type !== "GraphicControl") && (values.type !== "Audio") && (values.type !== "Video")) {
        if (values.type !== "TextArea") {
          self.expresion = parser.parse("(0,0,100,23)");
        } else {
          self.expresion = parser.parse("(0,0,300,200)");
          self.w = 300;
          self.h = 200;
        }
      }
      else {
        self.expresion = parser.parse("(0,0)");
      }

      self.fixed = self.visible = true;

      self.color = new descartesJS.Color((values.gui == "Scrollbar") ? "e0e4e8" : "222222");
  
      self.colorInt = "cc0022";
      if (values.gui == "Scrollbar") {
        self.colorInt = "182C61";
      }
      else if (values.type !== "GraphicControl") {
        self.colorInt = "f0f8ff";
      }
      self.colorInt = new descartesJS.Color(self.colorInt);

      self.font_size = parser.parse("0");

      self.type = self.gui = self.bold = self.italics = self.underlined = self.action = self.param = self.tooltip = self.Explanation = self.msg_pos = self.cID = "";

      self.paramFont = self.tooltipFont = self.ExplanationFont = "Monospace 12px";

      self.drawif = self.activeif = parser.parse("1");

      self.valueExpr = parser.parse("0");

      self.decimals = parser.parse("2");

      self.min = parser.parse("-Infinity");
      self.max = parser.parse("Infinity")

      self.incr = parser.parse("0.1");

      self.discrete = self.exponentialif = false;

      self.zIndex = -1;

      // assign the values to replace the defaults values of the object
      Object.assign(self, values);

      // move the video and audio controls to the interior region
      if ((/Video|Audio/).test(self.type)) {
        self.region = "interior";
      }

      // ## Descartes 2 patch ## //
      if (self.name == undefined) {
        self.name = (self.parent.version == 2) ? self.id : "_nada_";
      }
      self.name = ((/_\._|_nada_|_void_/).test(self.name)) ? "" : self.name;

      let expr = self.evaluator.eval(self.expresion)[0];
      self.x = MathRound(expr[0]);
      self.y = MathRound(expr[1]);
      if (expr.length == 4) {
        self.w = MathRound(expr[2]);
        self.h = MathRound(expr[3]);
      }

      self.actionExec = parent.lessonParser.parseAction(self);
    }

    /**
     * Init the control parameters
     */
    init() { }

    /**
     * Update the control
     */
    update() { }

    /**
     * Draw the control
     */
    draw() { }

    /**
     * Get the space container and add the control to it
     * @return {HTMLnode} return the space container associated with the control
     */
    getContainer() {
      self = this;
      let spaces = self.parent.spaces;

      // if the control is in the interior region
      if (self.region === "interior") {
        for (let space_i of spaces) {
          if (space_i.id === self.spaceID) {
            space_i.addCtr(self);
            self.zIndex = space_i.zIndex;
            self.space = space_i;
            return space_i.numCtrContainer;
          }
        }
      }
      // if the control is in the external region
      else if (self.region === "external") {
        self.parent.externalSpace.addCtr(self);
        return self.parent.externalSpace.container;
      }
      // if the control is in the scenario
      else if (self.region === "scenario") {
        // has a cID
        if (self.cID) {
          self.expresion = self.evaluator.parser.parse(`(0,-1000,${self.w},${self.h})`);
          self.parent.stage.stageSpace.addCtr(self);
          self.zIndex = self.parent.stage.stageSpace.zIndex;
          return self.parent.stage.stageSpace.numCtrContainer;
        }
        else {
          return self.parent.externalSpace.container;
        }
      }
      // if the control is in the north, south, east or west region
      else if ((/north|south|east|west/).test(self.region)) {
        self.parent[self.region + "Space"].controls.push(self);
        return self.parent[self.region + "Space"].container;
      }

      // if do not find a space with the identifier then return the first space
      spaces[0].addCtr(self);
      self.zIndex = spaces[0].zIndex;
      return spaces[0].numCtrContainer;
    }

    /**
     *
     * @return {HTMLnode} return the space container associated with the control
     */
    addControlContainer(controlContainer) {
      this.getContainer().appendChild(controlContainer);

      // DESCOMENTAR SI SE QUIERE RECUPERAR QUE LOS CONTROLES SE AGREGUEN EN ORDEN INVERSO
      /**
      // get the control container
      const container = this.getContainer();

      // add the container in inverse order to the space container
      container.appendChild(controlContainer);

      if (!container.childNodes[0]) {
        container.appendChild(controlContainer);
      }
      else {
        container.insertBefore(controlContainer, container.childNodes[0]);
      }
      */
    }

    /**
     * Update the position and size of the control
     */
    updatePositionAndSize() {
      self = this;
      changeX = changeY = changeW = changeH = false;
      expr = self.evaluator.eval(self.expresion)[0];

      temporalCompare = MathRound(expr[0]);
      changeX = MathRound(self.x) !== temporalCompare;
      self.x = temporalCompare;

      temporalCompare = MathRound(expr[1]);
      changeY = MathRound(self.y) !== temporalCompare;
      self.y = temporalCompare;

      if (expr.length === 4) {
        temporalCompare = MathRound(expr[2]);
        changeW = MathRound(self.w) !== temporalCompare;
        self.w = temporalCompare;

        temporalCompare = MathRound(expr[3]);
        changeH = MathRound(self.h) !== temporalCompare;
        self.h = temporalCompare;
      }

      // if has some change, then init the control and redraw it
      if ((changeW) || (changeH) || (changeX) || (changeY)) {
        self.init(true, true);
        self.draw();
      }
    }

    /**
     * Format the value with the number of decimals, the exponential representation and the decimal symbol
     * @param {String} value that value to format
     * @return {String} return the value with the format applied
     */
    formatValue(value) {
      self = this;
      parent = self.parent;
      resultValue = value+"";
      decimals = self.evaluator.eval(self.decimals);

      indexDot = resultValue.indexOf(".");
      if ( indexDot != -1 ) {
        subS = resultValue.substring(indexDot+1);

        if (subS.length > decimals) {
          resultValue = parseFloat(resultValue).toFixed(decimals);
        }
      }

      if (self.fixed) {
        // ## patch for Descartes 2 ##
        // in a different version than 2, then fixed stays as it should
        // if the version is 2 but do not use exponential notation
        if ( (parent.version !== 2) || ((parent.version === 2) && (!self.exponentialif)) ) {
          resultValue = parseFloat(value).toFixed(decimals);
        }
      }

      // if the value is zero then do not show the E in the exponential notation
      if ((self.exponentialif) && (parseFloat(resultValue) != 0)) {
        // ## patch for Descartes 2 ##
        // in the version 2 do not show the decimals
        if ((self.fixed) && (parent.version !== 2)) {
          resultValue = parseFloat(resultValue).toExponential(decimals);
        }
        else {
          resultValue = parseFloat(resultValue).toExponential();
        }
        resultValue = resultValue.toUpperCase().replace("+", "");
      }

      return resultValue.replace(".", parent.decimal_symbol);
    }

    /**
     *
     */
    updateAndExecAction() {
      parent = this.parent;

      // update the controls
      parent.updateControls();

      // if the action is init, release the click
      if (this.action === "init") {
        this.click = false;
      }
      // execute the action
      this.actionExec.execute();

      // update again the controls
      parent.updateControls();

      // if the action is animate then do not update the scene
      if (this.action !== "animate") {
        // update the scene
        parent.update();
      }

      // update again the controls
      parent.updateControls();
    }

    /**
     * Create a linear gradient for the background
     * @param {Number} w is the width of the canvas on which you want to create the linear gradient
     * @param {Number} h is the height of the canvas on which you want to create the linear gradient
     */
    createGradient(w, h) {
      this.linearGradient = this.ctx.createLinearGradient(0, 0, 0, h);
      hh = h*h;

      for (let i=0; i<h; i++) {
        di = MathFloor(i-(35*h)*0.01);
        this.linearGradient.addColorStop(i/h, `rgba(0,0,0,${((di*di*192)/hh)/255})`);
      }
    }
  }

  descartesJS.Control = Control;
  return descartesJS;
})(descartesJS || {});
