/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let evaluator;
  let tempParam;
  let theText;
  let verticalDisplace;
  let ctx;
  let cosTheta;
  let senTheta;

  class Graphic {
    /**
     * Descartes graphics
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the graphic
     */
    constructor(parent, values) {
      self = this;
      self.parent = parent;
      self.evaluator = parent.evaluator;

      let parser = self.evaluator.parser;

      self.spaceID = self.type = self.trace = self.family = self.text = "";

      self.background = self.visible = self.editable = false;

      self.drawif = parser.parse("1");

      self.abs_coord = (values && values.type && values.type.toLowerCase() === "text");

      self.color = new descartesJS.Color("20303a");

      self.expresion = parser.parse("(0,0)");

      self.family_interval = parser.parse("[0,1]");

      self.family_steps = parser.parse("8");

      self.font = "SansSerif,PLAIN," + ((self.parent.version >= 5) ? "18" : "12");

      self.fixed = true;

      self.decimals = parser.parse("2");

      // assign the values to replace the defaults values of the object
      Object.assign(this, values);

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
      self.font_str = self.font;
      self.font = descartesJS.convertFont(self.font);
      // get the font size
      self.fontSize = self.font.match(/([\d\.]+)px/);
      self.fontSize = (self.fontSize) ? parseFloat(self.fontSize[1]) : 10;

      self.font_style = descartesJS.getFontStyle(self.font_str.split(",")[1]);

      if ((typeof self.bold === "boolean") || (typeof self.italics === "boolean")) {
        self.font_style = (self.italics ? "Italic " : "") + (self.bold ? "Bold " : "");
      }
      if (!self.font_family) {
        self.font_family = self.font_str.split(",")[0];
      }
      self.font_family = descartesJS.getFontName(self.font_family);

      if (typeof self.font_size === "undefined") {
        self.font_size = parent.evaluator.parser.parse(self.fontSize.toString());
      }
    }

    /**
     * Get the space to which the graphic belongs
     * return {Space} return the space to which the graphic belongs
     */
    getSpace() {
      return (this.parent.spaces.find( (element) => {
        // find in the spaces
        return element.id === this.spaceID;
      } )) 
      // if do not find the identifier, return the first space
      || this.parent.spaces[0];
    }

    /**
     * Get the family values of the graphic
     */
    getFamilyValues() {
      self = this;
      evaluator = self.evaluator;
      [self.fInf, self.fSup] = evaluator.eval(self.family_interval)[0];
      self.fSteps = Math.round(evaluator.eval(self.family_steps));
      self.fSep = (self.fSteps > 0) ? (self.fSup - self.fInf)/self.fSteps : 0;
    }

    /**
     * Auxiliary function for draw a family graphic
     * @param {CanvasRenderingContext2D} ctx the render context to draw
     * @param {String} fill the fill color of the graphic
     * @param {String} stroke the stroke color of the graphic
     */
    drawFamilyAux(ctx, fill, stroke) {
      self = this;
      evaluator = self.evaluator;

      // update the family values
      self.getFamilyValues();

      // save the las value of the family parameter
      tempParam = evaluator.getVariable(self.family);

      if (self.fSteps >= 0) {
        // draw all the family members of the graphic
        for (let i=0, l=self.fSteps; i<=l; i++) {
          // update the value of the family parameter
          evaluator.setVariable(self.family, self.fInf + (i*self.fSep));

          // if the condition to draw if true then update and draw the graphic
          if ( evaluator.eval(self.drawif) > 0 ) {
            // update the values of the graphic
            self.update();
            // draw the graphic
            self.drawAux(ctx, fill, stroke);
          }
        }
      }

      evaluator.setVariable("_Text_H_", 0);
      evaluator.setVariable(self.family, tempParam);
    }

    /**
     * Draw the graphic
     * @param {String} fill the fill color of the graphic
     * @param {String} stroke the stroke color of the graphic
     */
    draw(fill, stroke) {
      // if the graphic has a family
      if (this.family !== "") {
        this.drawFamilyAux(this.ctx, fill, stroke);
      }
      // if the graphic has not a family
      else {
        // if the condition to draw is true
        if ( this.evaluator.eval(this.drawif) > 0 ) {
          // update the values of the graphic
          this.update();
          // draw the graphic
          this.drawAux(this.ctx, fill, stroke);
        }
      }

      // restore the stoke style
      this.ctx.setLineDash([]);
    }

    /**
     * Draw the trace of the graphic
     * @param {String} fill the fill color of the graphic
     * @param {String} stroke the stroke color of the graphic
     */
    drawTrace(fill, stroke) {
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
    rotate(x, y, angle) {
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
    dashStyle() {
      ctx = this.ctx
      ctx.lineCap = "butt";

      switch (this.lineDash) {
        case "dot":
          ctx.setLineDash([ctx.lineWidth, ctx.lineWidth]);
          break;
        case "dash":
          ctx.setLineDash([ctx.lineWidth * 4, ctx.lineWidth * 3]);
          break;
        case "dash_dot":
          ctx.setLineDash([ctx.lineWidth * 4, ctx.lineWidth * 2, ctx.lineWidth, ctx.lineWidth * 2]);
          break;
        default:
          ctx.lineCap = "round";
          ctx.setLineDash([]);
          break;
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
    drawText(ctx, text, x, y, fill, font, align, baseline, decimals, fixed, displaceY) {
      ctx.textNode = text;

      // rtf text
      if (text.type === "rtfNode") {
        ctx.fillStyle = ctx.strokeStyle = fill.getColor();
        ctx.textBaseline = "alphabetic";
        ctx.textNode.pos = { x:x, y:y };

        text.update(ctx, x, y, decimals, fixed, align, displaceY, fill.getColor());

        return;
      }

      // simple text (not rtf text)
      if (text.type === "simpleText") {
        text = text.toString(decimals, fixed).split("\\n");
      }

      evaluator = this.evaluator;
      ctx.fillStyle = fill.getColor();
      ctx.font = font;
      ctx.textAlign = align;
      ctx.textBaseline = baseline;

      verticalDisplace = this.fontSize*1.2 || 0;

      for (let i=0, l=text.length; i<l; i++) {
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
  }

  descartesJS.Graphic = Graphic;
  return descartesJS;
})(descartesJS || {});
