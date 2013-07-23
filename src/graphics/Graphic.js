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

  /**
   * Descartes graphics
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.Graphic = function(parent, values) {
    /**
     * Descartes application
     * type {DescartesApp}
     * @private
     */
    this.parent = parent;

    /**
     * object for parse and evaluate expressions
     * type {Evaluator}
     * @private
     */
    this.evaluator = parent.evaluator;

    var parser = this.evaluator.parser;    
    
    /**
     * identifier of the space that belongs to the graphic
     * type {String}
     * @private
     */
    this.spaceID = "E0";

    /**
     * the condition for determining whether the graph is drawn in the background
     * type {Boolean}
     * @private
     */
    this.background = false;

    /**
     * type of the graphic
     * type {String}
     * @private
     */
    this.type = "";

    /**
     * the condition to draw the graphic
     * type {Node}
     * @private
     */
    this.drawif = parser.parse("1");

    /**
     * the condition for determine whether the graphic is in absolute coordinates
     * type {Boolean}
     * @private
     */
    this.abs_coord = false;

    /**
     * the primary color of the graphic
     * type {String}
     * @private
     */
    this.color = new descartesJS.Color("blue");
    if (this.parent.version !== 2) {
    // if (this.parent.code == "descinst.com.mja.descartes.DescartesJS.class") {
      this.color = new descartesJS.Color("20303a");
    // } else {
    //   this.color = "#000000";
    // }
      // ##ARQUIMEDES## //
      if (this.parent.arquimedes) {
        this.color = new descartesJS.Color("black");
      }
      // ##ARQUIMEDES## //
    }
    // if (this.parent.code === "descinst.Descartes.class") {
    //   this.color = "blue";
    // }

    /**
     * the color for the trace of the graphic
     * type {String}
     * @private
     */
    this.trace = "";

    /**
     * the expression for determine the position of the graphic
     * type {Node}
     * @private
     */
    this.expresion = parser.parse("(0,0)");

    /**
     * the condition and parameter name for family of the graphic
     * type {String}
     * @private
     */
    this.family = "";

    /**
     * the interval of the family
     * type {Node}
     * @private
     */
    this.family_interval = parser.parse("[0,1]");

    /**
     * the number of steps of the family
     * type {Node}
     * @private
     */
    this.family_steps = parser.parse("8");
    
    // /**
    //  * type {Boolean}
    //  * @private
    //  */
    // this.visible = false;

    /**
     * the condition for determining whether the graph is editable
     * type {Boolean}
     * @private
     */
    this.editable = false;

    /**
     * font of the text
     * type {String}
     * @private
     */
    this.font = (this.parent.version >=5) ? "Monospaced,PLAIN,15" : "Monospaced,PLAIN,12";
    
    /**
     * the condition for determining whether the text of the graph is fixed or not
     * type {Boolean}
     * @private
     */
    this.fixed = true;

    /**
     * text of the graphic
     * type {String}
     * @private
     */
    this.text = "";

    /**
     * the number of decimal of the text
     * type {Node}
     * @private
     */
    this.decimals = parser.parse("2");

    // traverse the values to replace the defaults values of the object
    for (var propName in values) {
      // verify the own properties of the object
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }
    
    // get the space of the graphic
    this.space = this.getSpace();

    // get the space
    if (this.background) {
      this.canvas = this.space.backgroundCanvas;
    } else {
      this.canvas = this.space.canvas;
    }
    this.ctx = this.canvas.getContext("2d");
    
    // if the object has trace, then get the background canvas render context
    if (this.trace) {
      this.traceCtx = this.space.backgroundCanvas.getContext("2d");
    }
    
    // get a Descartes font
    this.font = descartesJS.convertFont(this.font);

    // get the font size
    this.fontSize = this.font.match(/(\d+)px/);
    if (this.fontSize) {
      this.fontSize = parseInt(this.fontSize[1]);
    } else {
      this.fontSize = 10;
    }
  }  
  
  /**
   * Get the space to which the graphic belongs
   * return {Space} return the space to which the graphic belongs
   */
  descartesJS.Graphic.prototype.getSpace = function() {
    var spaces = this.parent.spaces;
    var space_i;

    // find in the spaces
    for (var i=0, l=spaces.length; i<l; i++) {
      space_i = spaces[i];
      if (space_i.id == this.spaceID) {
        return space_i;
      }
    }
    
    // if do not find the identifier, return the first space
    return spaces[0];
  }

  /**
   * Get the family values of the graphic
   */
  descartesJS.Graphic.prototype.getFamilyValues = function() {
    evaluator = this.evaluator;
    expr = evaluator.evalExpression(this.family_interval);
    this.familyInf = expr[0][0];
    this.familySup = expr[0][1];
    this.fSteps = Math.round(evaluator.evalExpression(this.family_steps));
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
        if ( evaluator.evalExpression(this.drawif) > 0 ) {
          // update the values of the graphic
          this.update();
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
    if (this.family != "") {
      this.drawFamilyAux(this.ctx, fill, stroke);
    }
    // if the graphic has not a family
    else  {
      // if the condition to draw is true
      if ( this.evaluator.evalExpression(this.drawif) > 0 ) {
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
      if ( this.evaluator.evalExpression(this.drawif) > 0 ) {
        // update the values of the graphic
        this.update();
        // draw the graphic
        this.drawAux(this.traceCtx, fill, stroke);
      }
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
    // rtf text
    if (text.type === "rtfNode") {
      ctx.fillStyle = fill.getColor();
      ctx.strokeStyle = fill.getColor();
      ctx.textBaseline = "alphabetic";
      text.draw(ctx, x, y, decimals, fixed, align, displaceY);
      
      return;
    }

    // simple text (none rtf text)
    if (text.type === "simpleText") {
      text = text.toString(decimals, fixed).split("\\n");
    }

    x = x + (font.match("Arial") ? -2 : (font.match("Times") ? -2: 0));
    
    evaluator = this.evaluator;
    ctx.fillStyle = fill.getColor();
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
        
    if (this.border) {
      ctx.strokeStyle = this.border.getColor();
      ctx.lineWidth = parseInt(this.fontSize/12)+1.5;
    }
    
    verticalDisplace = this.fontSize*1.2 || 0;

    for (var i=0, l=text.length; i<l; i++) {
      theText = text[i];

      if (this.border) {
        ctx.lineJoin = "round";
        ctx.strokeText(theText, x, y+(verticalDisplace*i));
      }
      ctx.fillText(theText, x, y+(verticalDisplace*i));
    }
  }

  return descartesJS;
})(descartesJS || {});