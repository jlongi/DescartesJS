/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var expr;
  var tempParam;
  var theText;
  var verticalDisplace;
  var ctx;
  var cosTheta;
  var senTheta;

  /**
   * Descartes graphics
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.Graphic = function(parent, values) {
    var self = this;
    /**
     * Descartes application
     * type {DescartesApp}
     * @private
     */
    self.parent = parent;

    /**
     * object for parse and evaluate expressions
     * type {Evaluator}
     * @private
     */
    self.evaluator = parent.evaluator;

    var parser = self.evaluator.parser;

    /**
     * identifier of the space that belongs to the graphic
     * type {String}
     * @private
     */
    self.spaceID = "";

    /**
     * the condition for determining whether the graph is drawn in the background
     * type {Boolean}
     * @private
     */
    self.background = false;

    /**
     * type of the graphic
     * type {String}
     * @private
     */
    self.type = "";

    /**
     * the condition to draw the graphic
     * type {Node}
     * @private
     */
    self.drawif = parser.parse("1");

    /**
     * the condition for determine whether the graphic is in absolute coordinates
     * type {Boolean}
     * @private
     */
    self.abs_coord = (values.type && values.type === "text") ? true : false;

    /**
     * the primary color of the graphic
     * type {String}
     * @private
     */
    self.color = new descartesJS.Color("blue");
    if (self.parent.version !== 2) {
      self.color = new descartesJS.Color("20303a");

      // ##ARQUIMEDES## //
      if (self.parent.arquimedes) {
        self.color = new descartesJS.Color("black");
      }
      // ##ARQUIMEDES## //
    }

    /**
     * the color for the trace of the graphic
     * type {String}
     * @private
     */
    self.trace = "";

    /**
     * the expression for determine the position of the graphic
     * type {Node}
     * @private
     */
    self.expresion = parser.parse("(0,0)");

    /**
     * the condition and parameter name for family of the graphic
     * type {String}
     * @private
     */
    self.family = "";

    /**
     * the interval of the family
     * type {Node}
     * @private
     */
    self.family_interval = parser.parse("[0,1]");

    /**
     * the number of steps of the family
     * type {Node}
     * @private
     */
    self.family_steps = parser.parse("8");

    /**
     * type {Boolean}
     * @private
     */
    self.visible = false;

    /**
     * the condition for determining whether the graph is editable
     * type {Boolean}
     * @private
     */
    self.editable = false;

    /**
     * font of the text
     * type {String}
     * @private
     */
    self.font = "SansSerif,PLAIN," + ((self.parent.version >=5) ? "18" : "12");

    /**
     * the condition for determining whether the text of the graph is fixed or not
     * type {Boolean}
     * @private
     */
    self.fixed = true;

    /**
     * text of the graphic
     * type {String}
     * @private
     */
    self.text = "";

    /**
     * the number of decimal of the text
     * type {Node}
     * @private
     */
    self.decimals = parser.parse("2");

    // traverse the values to replace the defaults values of the object
    for (var propName in values) {
      // verify the own properties of the object
      if (values.hasOwnProperty(propName)) {
        self[propName] = values[propName];
      }
    }

    // get the space of the graphic
    self.space = self.getSpace();

    // get the canvas
    self.canvas = (self.background) ? self.space.backCanvas : self.space.canvas;
    self.ctx = self.canvas.getContext("2d");

    // if the object has trace, then get the background canvas render context
    if (self.trace) {
      self.traceCtx = self.space.backCtx;
    }

    // get a Descartes font
    this.font_str = this.font;
    this.font = descartesJS.convertFont(this.font);
    // get the font size
    this.fontSize = this.font.match(/([\d\.]+)px/);
    this.fontSize = (this.fontSize) ? parseFloat(this.fontSize[1]) : 10;

    this.font_style = descartesJS.getFontStyle(this.font_str.split(",")[1]);
    if ((typeof(this.bold) === "boolean") || (typeof(this.italics) === "boolean")) {
      if (this.bold && !this.italics) {
        this.font_style = "Bold ";
      }
      else if (!this.bold && this.italics) {
        this.font_style = "Italic ";
      }
      else if (this.bold && this.italics) {
        this.font_style = "Italic Bold ";
      }
      else if (!this.bold && !this.italics) {
        this.font_style = " ";
      }
    }

    if (!this.font_family) {
      this.font_family = this.font_str.split(",")[0];
    }
    this.font_family = descartesJS.getFontName(this.font_family);

    if (typeof this.font_size === "undefined") {
      this.font_size = parent.evaluator.parser.parse(this.fontSize.toString());
    }
  }

  /**
   * Get the space to which the graphic belongs
   * return {Space} return the space to which the graphic belongs
   */
  descartesJS.Graphic.prototype.getSpace = function() {
    return (this.parent.spaces.find( (element) => { return element.id === this.spaceID; } )) || this.parent.spaces[0];
  }

  /**
   * Get the family values of the graphic
   */
  descartesJS.Graphic.prototype.getFamilyValues = function() {
    evaluator = this.evaluator;
    expr = evaluator.eval(this.family_interval);
    this.familyInf = expr[0][0];
    this.familySup = expr[0][1];
    this.fSteps = Math.round(evaluator.eval(this.family_steps));
    this.family_sep = (this.fSteps > 0) ? (this.familySup - this.familyInf)/this.fSteps : 0;
  }

  /**
   * Auxiliar function for draw a family graphic
   * @param {CanvasRenderingContext2D} ctx the render context to draw
   * @param {String} fill the fill color of the graphic
   * @param {String} stroke the stroke color of the graphic
   */
  descartesJS.Graphic.prototype.drawFamilyAux = function(ctx, fill, stroke) {
    evaluator = this.evaluator;

    // update the family values
    this.getFamilyValues();

    // save the las value of the family parameter
    tempParam = evaluator.getVariable(this.family);

    if (this.fSteps >= 0) {
      // draw all the family mebers of the graphic
      for(var i=0, l=this.fSteps; i<=l; i++) {
        // update the value of the family parameter
        evaluator.setVariable(this.family, this.familyInf+(i*this.family_sep));

        // if the condition to draw if true then update and draw the graphic
        if ( evaluator.eval(this.drawif) > 0 ) {
          // update the values of the graphic
          this.update();
          //awful hack to help the pstricks exporter
          ctx.oldTextNode = null;
          // draw the graphic
          this.drawAux(ctx, fill, stroke);
        }
      }
    }

    evaluator.setVariable("_Text_H_", 0);
    evaluator.setVariable(this.family, tempParam);
  }

  /**
   * Draw the graphic
   * @param {String} fill the fill color of the graphic
   * @param {String} stroke the stroke color of the graphic
   */
  descartesJS.Graphic.prototype.draw = function(fill, stroke) {
    // if the graphic has a family
    if (this.family !== "") {
      this.drawFamilyAux(this.ctx, fill, stroke);
    }
    // if the graphic has not a family
    else  {
      // if the condition to draw is true
      if ( this.evaluator.eval(this.drawif) > 0 ) {
        // update the values of the graphic
        this.update();
        // draw the graphic
        this.drawAux(this.ctx, fill, stroke);
      }
    }
  }

  /**
   * Draw the trace of the graphic
   * @param {String} fill the fill color of the graphic
   * @param {String} stroke the stroke color of the graphic
   */
  descartesJS.Graphic.prototype.drawTrace = function(fill, stroke) {
    // if the graphic has a family
    if (this.family != "") {
      this.drawFamilyAux(this.traceCtx, fill, stroke);
    }
    // if the graphic has not a family
    else {
      // if the condition to draw is true
      if ( this.evaluator.eval(this.drawif) > 0 ) {
        // update the values of the graphic
        this.update();
        // draw the graphic
        this.drawAux(this.traceCtx, fill, stroke);
      }
    }
  }

  /**
   * 
   */
  descartesJS.Graphic.prototype.rotate = function(x, y, angle) {
    cosTheta = Math.cos(angle);
    senTheta = Math.sin(angle);

    return {
      x : x*cosTheta - y*senTheta,
      y : x*senTheta + y*cosTheta
    };
  }

  /**
   *
   */
  descartesJS.Graphic.prototype.dashStyle = function() {
    ctx = this.ctx
    if (this.lineDash === "dot") {
      ctx.lineCap = "butt";
      ctx.setLineDash([ctx.lineWidth, ctx.lineWidth])
    }
    else if (this.lineDash === "dash") {
      ctx.lineCap = "butt";
      ctx.setLineDash([ctx.lineWidth*4, ctx.lineWidth*3])
    }
    else if (this.lineDash === "dash_dot") {
      ctx.lineCap = "butt";
      ctx.setLineDash([ctx.lineWidth*4, ctx.lineWidth*2, ctx.lineWidth, ctx.lineWidth*2])
    }
    else {
      ctx.setLineDash([]);
    }
  }

  /**
   * Draw the text of the graphic
   * @param {CanvasRenderingContext2D} ctx the context render to draw
   * @param {String} text the text to draw
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   * @param {String} fill the fill color of the graphic
   * @param {String} font the font of the text
   * @param {String} align the alignment of the text
   * @param {String} baseline the baseline of the text
   * @param {Number} decimals the number of decimals of the text
   * @param {Boolean} fixed the number of significant digits of the number in the text
   * @param {Boolean} displaceY a flag to indicate if the text needs a displace in the y position
   */
  descartesJS.Graphic.prototype.drawText = function(ctx, text, x, y, fill, font, align, baseline, decimals, fixed, displaceY) {
    ctx.textNode = text;

    // rtf text
    if (text.type === "rtfNode") {
      ctx.fillStyle = ctx.strokeStyle = fill.getColor();
      ctx.textBaseline = "alphabetic";
      ctx.textNode.pos = { x:x, y:y };

      // text.draw(ctx, x, y, decimals, fixed, align, displaceY, fill.getColor());
      text.update(ctx, x, y, decimals, fixed, align, displaceY, fill.getColor());

      return;
    }

    // simple text (none rtf text)
    if (text.type === "simpleText") {
      text = text.toString(decimals, fixed).split("\\n");
    }

    evaluator = this.evaluator;
    ctx.fillStyle = fill.getColor();
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;

    verticalDisplace = this.fontSize*1.2 || 0;

    for (var i=0, l=text.length; i<l; i++) {
      theText = text[i];

      if (this.border) {
        ctx.strokeStyle = this.border.getColor();
        ctx.lineWidth = 4;
        ctx.lineJoin = "round";
        ctx.miterLimit = 2;
        ctx.strokeText(theText, x, y+(verticalDisplace*i));
      }
     
      ctx.fillText(theText, x, y+(verticalDisplace*i));
    }
  }

  return descartesJS;
})(descartesJS || {});
