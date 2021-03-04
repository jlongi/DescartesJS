/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathRound = Math.round;
  var hh;
  var di;
  var changeX;
  var changeY;
  var changeW;
  var changeH;
  var expr;

  var temporalCompare;
  var resultValue;
  var decimals;
  var indexDot;
  var subS;
  var parent;

  class Control {
    /**
     * Descartes control
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the control
     */
    constructor(parent, values) {
      /**
       * Descartes application
       * type {DescartesApp}
       * @private
       */
      this.parent = parent;
      this.evaluator = parent.evaluator;
      this.parser = parent.evaluator.parser;
      var parser = this.parser;

      /**
       * identifier
       * type {String}
       * @private
       */
      this.id = (values.type !== "GraphicControl") ? "C" : "G";

      /**
       * type (numeric or graphic)
       * type {String}
       * @private
       */
      this.type = "";

      /**
       * interface
       * type {String}
       * @private
       */
      this.gui = "";

      /**
       * region to draw
       * type {String}
       * @private
       */
      this.region = "south";

      /**
       * x position
       * type {Number}
       * @private
       */
      this.x = 0;

      /**
       * y position
       * type {Number}
       * @private
       */
      this.y = 0;

      /**
       * width
       * type {Number}
       * @private
       */
      this.w = (values.type !== "Video") ? 100 : 350;

      /**
       * height
       * type {Number}
       * @private
       */
      this.h = (values.type !== "Video") ? 23 : 120;

      /**
       * position and size expression
       * type {String}
       * @private
       */
      if ((values.type !== "GraphicControl") && (values.type !== "Audio") && (values.type !== "Video")) {
        if (values.type !== "TextArea") {
          this.expresion = parser.parse("(0,0,100,23)");
        } else {
          this.expresion = parser.parse("(0,0,300,200)");
          this.w = 300;
          this.h = 200;
        }
      }
      else {
        this.expresion = parser.parse("(0,0)");
      }

      /**
       * condition to use fixed notation in the number values
       * type {Boolean}
       * @private
       */
      this.fixed = true;

      /**
       * condition visibility
       * type {Boolean}
       * @private
       */
      this.visible = true;

      /**
       * text color
       * type {String}
       * @private
       */
      this.color = new descartesJS.Color("222222");

      /**
       * control color
       * type {String}
       * @private
       */
      this.colorInt = new descartesJS.Color((values.type !== "GraphicControl") ? "f0f8ff" : "cc0022");

      /**
       * font size of the control
       * type {Object}
       * @private
       */
      this.font_size = parser.parse("0");

      /**
       * bold text condition
       * type {String}
       * @private
       */
      this.bold = "";

      /**
       * italic text condition
       * type {String}
       * @private
       */
      this.italics = "";

      /**
       * underline text condition
       * type {String}
       * @private
       */
      this.underlined = "";

      /**
       * action type
       * type {String}
       * @private
       */
      this.action = "";

      /**
       * parameter
       * type {String}
       * @private
       */
      this.parameter = "";

      /**
       * tooltip text
       * type {String}
       * @private
       */
      this.tooltip = "";

      /**
       * control explanation
       * type {String}
       * @private
       */
      this.Explanation = "";

      /**
       * message position
       * type {String}
       * @private
       */
      this.msg_pos = "";

      /**
       * component identifier
       * type {String}
       * @private
       */
      this.cID = "";

      this.parameterFont = this.tooltipFont = this.ExplanationFont = "Monospace 12px";

      /**
       * draw condition
       * type {Node}
       * @private
       */
      this.drawif = parser.parse("1");

      /**
       * active condition
       * type {Node}
       * @private
       */
      this.activeif = parser.parse("1");

      /**
       * initial value (spinner)
       * type {Node}
       * @private
       */
      this.valueExpr = parser.parse("0");

      /**
       * decimal number of the text
       * type {Node}
       * @private
       */
      this.decimals = parser.parse("2");

      /**
       * lower limit
       * type {Node}
       * @private
       */
      this.min = parser.parse("-Infinity");

      /**
       * upper limit
       * type {Node}
       * @private
       */
      this.max = parser.parse("Infinity");

      /**
       * increment
       * type {Node}
       * @private
       */
      this.incr = parser.parse("0.1");

      /**
       * discrete numbers condition
       * type {Boolean}
       * @private
       */
      this.discrete = false;

      /**
       * condition to use exponential notation
       * type {Boolean}
       * @private
       */
      this.exponentialif = false;

      /**
       * z index
       * @type {Number}
       * @private
       */
      this.zIndex = -1;

      // assign the values to replace the defaults values of the object
      Object.assign(this, values);

      // move the video and audio controls to the interior region
      if (((this.type === "Video") || (this.type === "Audio")) && (this.region !== "interior")) {
        this.region = "interior";
      }

      // ## Descartes 2 patch ## //
      if (this.name == undefined) {
        this.name = (this.parent.version == 2) ? this.id : "_nada_";
      }
      this.name = ((this.name == "_._") || (this.name == "_nada_") || (this.name == "_void_")) ? "" : this.name;

      var expr = this.evaluator.eval(this.expresion);
      this.x = MathRound(expr[0][0]);
      this.y = MathRound(expr[0][1]);
      if (expr[0].length == 4) {
        this.w = MathRound(expr[0][2]);
        this.h = MathRound(expr[0][3]);
      }

      this.actionExec = parent.lessonParser.parseAction(this);
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
      var spaces = this.parent.spaces;
      var space_i;
      // if the control is in the interior region
      if (this.region === "interior") {
        for(var i=0, l=spaces.length; i<l; i++) {
          space_i = spaces[i];
          if (space_i.id === this.spaceID) {
            space_i.addCtr(this);
            this.zIndex = space_i.zIndex;
            this.space = space_i;
            // this.space = space_i;
            return space_i.numericalControlContainer;
          }
        }
      }
      // if the control is in the external region
      else if (this.region === "external") {
        this.parent.externalSpace.addCtr(this);
        return this.parent.externalSpace.container;
      }
      // if the control is in the scenario
      else if (this.region === "scenario") {
        // has a cID
        if (this.cID) {
          this.expresion = this.evaluator.parser.parse("(0,-1000," + this.w + "," + this.h + ")");
          this.parent.stage.stageSpace.addCtr(this);
          this.zIndex = this.parent.stage.stageSpace.zIndex;
          return this.parent.stage.stageSpace.numericalControlContainer;
        }
        else {
          return this.parent.externalSpace.container;
        }

      }
      // if the control is in the north, south, east or west region
      else if ((/north|south|east|west/).test(this.region)) {
        this.parent[this.region + "Space"].controls.push(this);
        return this.parent[this.region + "Space"].container;
      }

      // if do not find a space with the identifier then return the first space
      spaces[0].addCtr(this);
      this.zIndex = spaces[0].zIndex;
      return spaces[0].numericalControlContainer;
    }

    /**
     *
     * @return {HTMLnode} return the space container associated with the control
     */
    addControlContainer(controlContainer) {
      // get the control container
      var container = this.getContainer();

      // add the container in inverse order to the space container
      if (!container.childNodes[0]) {
        container.appendChild(controlContainer);
      }
      else {
        container.insertBefore(controlContainer, container.childNodes[0]);
      }
    }

    /**
     * Update the position and size of the control
     */
    updatePositionAndSize() {
      changeX = changeY = changeW = changeH = false;
      expr = this.evaluator.eval(this.expresion);

      temporalCompare = MathRound(expr[0][0]);
      changeX = MathRound(this.x) !== temporalCompare;
      this.x = temporalCompare;

      temporalCompare = MathRound(expr[0][1]);
      changeY = MathRound(this.y) !== temporalCompare;
      this.y = temporalCompare;

      if (expr[0].length === 4) {
        temporalCompare = MathRound(expr[0][2]);
        changeW = MathRound(this.w) !== temporalCompare;
        this.w = temporalCompare

        temporalCompare = MathRound(expr[0][3]);
        changeH = MathRound(this.h) !== temporalCompare;
        this.h = temporalCompare;
      }

      // if has some change, then init the control and redraw it
      if ((changeW) || (changeH) || (changeX) || (changeY)) {
        this.init(true, true);
        this.draw();
      }
    }

    /**
     * Format the value with the number of decimals, the exponential representation and the decimal symbol
     * @param {String} value tha value to format
     * @return {String} return the value with the format applied
     */
    formatOutputValue(value) {
      parent = this.parent;

      resultValue = value+"";
      decimals = this.evaluator.eval(this.decimals);

      indexDot = resultValue.indexOf(".");
      if ( indexDot != -1 ) {
        subS = resultValue.substring(indexDot+1);

        if (subS.length > decimals) {
          resultValue = parseFloat(resultValue).toFixed(decimals);
        }
      }

      if (this.fixed) {
        // ## patch for Descartes 2 ##
        // in a different version than 2, then fixed stays as it should
        // if the version is 2 but do not use exponential notation
        if ( (parent.version !== 2) || ((parent.version === 2) && (!this.exponentialif)) ) {
          resultValue = parseFloat(value).toFixed(decimals);
        }
      }

      // if the value is zero then do not show the E in the exponential notation
      if ((this.exponentialif) && (parseFloat(resultValue) != 0)) {
        // ## patch for Descartes 2 ##
        // in the version 2 do not show the decimals
        if ((this.fixed) && (parent.version !== 2)) {
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
      // update the controls
      this.parent.updateControls();

      // if the action is init, release the click
      if (this.action === "init") {
        this.click = false;
      }
      // execute the action
      this.actionExec.execute();

      // update again the controls
      this.parent.updateControls();

      // if the action is animate then do not update the scene
      if (this.action !== "animate") {
        // update the scene
        this.parent.update();
      }

      // update again the controls
      this.parent.updateControls();
    }

    /**
     * Create a linear gradient for the background
     * @param {Number} w is the width of the canvas on which you want to create the linear gradient
     * @param {Number} h is the height of the canvas on which you want to create the linear gradient
     */
    createGradient(w, h) {
      this.linearGradient = this.ctx.createLinearGradient(0, 0, 0, h);
      hh = h*h;

      for (var i=0; i<h; i++) {
        di = MathFloor(i-(35*h)/100);
        this.linearGradient.addColorStop(i/h, `rgba(0,0,0,${((di*di*192)/hh)/255})`);
      }
    }
  }

  descartesJS.Control = Control;
  return descartesJS;
})(descartesJS || {});
