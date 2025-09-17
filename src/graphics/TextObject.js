/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let decimals;
  let width;
  let size;
  let color;
  let newTextStr;
  let style;

  let txtEle;
  let txt;
  let pos;
  let lastPos;
  let ignoreSquareBracket;
  let charAt;
  let charAtAnt;
  let textLength;

  let evalString;

  class TextObject {
    /**
     * A Descartes plain text (not RTF)
     * @
     * @param {DescartesApp} parent the Descartes application
     * @param {String} text the content text
     */
    constructor(parent, text) {
      self = this;

      self.parent = parent;
      self.evaluator = parent.evaluator;
      self.decimals = parent.decimals;
      self.fixed = parent.fixed;
      self.align = parent.align || "left";
      self.anchor = parent.anchor || "a_top_left"
      self.decimal_symbol = parent.parent.decimal_symbol;

      self.w = self.h = 100;

      self.hasContent = (text !== "");
      self.textStr = (text || "").replace(/\\{/g, "\\curlyBracketOpen ").replace(/\\}/g, "\\curlyBracketClose ").replace(/\\\[/g, "\\squareBracketOpen ").replace(/\\\]/g, "\\squareBracketClose ");
      self.oldTextStr = self.oldWidth = self.oldSize = self.oldColor = self.oldPosX = self.oldPoxY = null;

      // is a RTF text
      if ((/^\{\\rtf1/).test(text)) {
        self.type = "rtfNode";
        self.text = text;
        self.textNodes = ( new descartesJS.RTFParser(parent.evaluator) ).parse(text.substring(10));
        self.draw = self.drawRTF;
      }
      else {
        self.descarTeXParser = new descartesJS.DescarTeXParser();
        self.text = self.parseSimpleText(self.textStr);
        self.textNodes = new descartesJS.TextNode("", "txtLineBlock", null, null);
        self.draw = self.drawText;
      }
    }

    /**
     * 
     */
    drawText(ctx, fill, posX, posY, onlyUpdate) {
      self = this;
      decimals = self.evaluator.eval(self.decimals);
      width = self.evaluator.eval(self.parent.width);
      size = self.evaluator.eval(self.parent.font_size);
      color = (fill.getColor) ? fill.getColor() : fill;

      newTextStr = self.textToString(self.text, decimals, self.fixed).replace(/\\{/g, "\\curlyBracketOpen ").replace(/\\}/g, "\\curlyBracketClose ").replace(/\\\[/g, "\\squareBracketOpen ").replace(/\\\]/g, "\\squareBracketClose ");

      // check if the newTextStr contains an expression
      if (newTextStr.indexOf("[") >= 0) {
        newTextStr = self.textToString(self.parseSimpleText(newTextStr), decimals, self.fixed);
      }

      if (
        (self.oldTextStr !== newTextStr) || 
        (self.oldWidth !== width) || 
        (self.oldSize !== size) || 
        (self.oldColor !== color) ||
        (self.oldPosX !== posX) || 
        (self.oldPoxY !== posY) 
      ) {
        style = new descartesJS.TextStyle({ 
          size: size,
          family: self.parent.font_family || "arial",
          italic: self.parent.italics || false,
          bold: self.parent.bold || false,
          color: color,
          align: self.align,
          border: self.parent.border,
          border_size: self.parent.border_size,
          shadowBlur: self.parent.shadowBlur,
          shadowOffsetX: self.parent.shadowOffsetX,
          shadowOffsetY: self.parent.shadowOffsetY,
          shadowColor: self.parent.shadowColor || "transparent",
        });

        self.textNodes = self.descarTeXParser.parse(newTextStr, self.evaluator, style);

        self.textNodes.update(posX, posY, decimals, self.fixed, self.align, self.anchor, color, width);
      }

      if (!onlyUpdate) {
        self.textNodes.draw(ctx);
      }

      self.oldTextStr = newTextStr;
      self.oldWidth = width;
      self.oldSize = size;
      self.oldColor = color;
      self.oldPosX = posX;
      self.oldPoxY = posY;
    }

    /**
     * 
     */
    drawRTF(ctx, fill, posX, posY, onlyUpdate) {
      fill = (fill.getColor) ? fill.getColor() : fill;
      ctx.fillStyle = ctx.strokeStyle = fill;
      ctx.textBaseline = "alphabetic";

      if (this.textNodes.style.align !== this.align) {
        this.textNodes.propagateStyle("align", this.align);
      }

      this.textNodes.update(posX, posY, this.evaluator.eval(this.decimals), this.fixed, this.align, this.anchor, fill, this.evaluator.eval(this.parent.width));

      if (!onlyUpdate) {
        this.textNodes.draw(ctx);
      }
    }

    /**
     * 
     */
    parseSimpleText(text) {
      text = text.replace("&#x2013", "–").replace(/\&squot;/g, "'");

      txtEle = [];
      txt = "'";
      pos = 0;
      lastPos = 0;
      ignoreSquareBracket = -1;

      textLength = text.length;

      while (pos < textLength) {
        charAt = text.charAt(pos);
        charAtAnt = text.charAt(pos-1);

        // open square bracket scaped
        if ((charAt === "[") && (charAtAnt === "\\")) {
          txtEle.push(text.substring(lastPos, pos-1) + "[");
          lastPos = pos+1;
        }

        // close square bracket scaped
        else if ((charAt === "]") && (charAtAnt === "\\")) {
          txtEle.push(text.substring(lastPos, pos-1) + "]");
          lastPos = pos+1;
        }

        // if find an open square bracket
        else if ((charAt === "[") && (ignoreSquareBracket === -1)) {
          txtEle.push(text.substring(lastPos, pos));
          lastPos = pos;
          ignoreSquareBracket++;
        }

        else if (charAt === "[") {
          ignoreSquareBracket++;
        }

        // if find a close square bracket add the string +'
        else if ((charAt === "]") && (ignoreSquareBracket === 0)) {
          txtEle.push( this.evaluator.parser.parse(text.substring(lastPos, pos+1)) );
          lastPos = pos+1;
          ignoreSquareBracket--;
        }

        else if (text.charAt(pos) == "]") {
          ignoreSquareBracket = (ignoreSquareBracket < 0) ? ignoreSquareBracket : ignoreSquareBracket-1;
          txt = txt + text.charAt(pos);
        }

        else {
          txt = txt + text.charAt(pos);
        }

        pos++;
      }

      txtEle.push(text.substring(lastPos, pos));

      return txtEle;
    }

    /**
     * 
     */
    textToString(text, decimals, fixed) {
      txt = "";

      if (text.type !== "rtfNode") {
        for(let i=0, l=text.length; i<l; i++) {
          if (typeof(text[i]) === "string") {
            txt += text[i];
          }
          else {
            evalString = this.evaluator.eval(text[i])[0][0];

            if (evalString !== "") {
              // the evaluation is a string
              if (typeof(evalString) === "string") {
                txt += evalString;
              }
              else if (evalString === Infinity) {
                txt += "Infinity";
              }
              else if (evalString === -Infinity) {
                txt += "-Infinity";
              }
              else if (isNaN(evalString) || (evalString === "NaN")) {
                txt += "NaN";
              }
              // the evaluation is a number
              else {
                evalString = parseFloat(evalString);
                
                evalString = (fixed) ? evalString.toFixed(decimals) : descartesJS.removeNeedlessDecimals(evalString.toFixed(decimals));
                txt += evalString.toString().replace(".", this.decimal_symbol);
              }
            }
          }
        }
      }

      return txt;
    }
  }

  descartesJS.TextObject = TextObject;
  return descartesJS;
})(descartesJS || {});
