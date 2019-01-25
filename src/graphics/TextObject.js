/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var decimals;

  /**
   * A Descartes plain text (not RTF)
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   * @param {String} text the content text
   */
  descartesJS.TextObject = function(parent, text) {
    this.parent = parent;
    this.evaluator = parent.evaluator;
    this.decimals = parent.decimals;
    this.fixed = parent.fixed;
    this.align = parent.align || "left";
    this.anchor = parent.anchor || "a_top_left"
    this.decimal_symbol = parent.parent.decimal_symbol;

    this.w = 100;
    this.h = 100;

    this.hasContent = (text !== "");
    this.textStr = (text || "").replace(/\\{/g, "\\curlyBracketOpen ").replace(/\\}/g, "\\curlyBracketClose ").replace(/\\\[/g, "\\squareBracketOpen ").replace(/\\\]/g, "\\squareBracketClose ");
    this.oldTextStr = null;
    this.oldWidth = null;
    this.oldSize = null;
    this.oldColor = null;
    this.oldPosX = null;
    this.oldPoxY = null;

    // is a RTF text
    if (text.match(/^\{\\rtf1/)) {
      this.type = "rtfNode";
      this.text = text;
      this.textNodes = ( new descartesJS.RTFParser(parent.evaluator) ).parse(text.substring(10));
    }
    else {
      this.descarTeXParser = new descartesJS.DescarTeXParser();
      this.text = this.parseSimpleText(this.textStr);
      this.textNodes = new descartesJS.TextNode("", "textLineBlock", null, null)
    }

  }

  /**
   * 
   */
  descartesJS.TextObject.prototype.draw = function(ctx, fill, posX, posY, onlyUpdate) {
    // draw rtfText
    if (this.type === "rtfNode") {
      this.drawRTF(ctx, fill, posX, posY, onlyUpdate);
    }
    else {
      this.drawText(ctx, fill, posX, posY, onlyUpdate);
    }
  }

  /**
   * 
   */
  descartesJS.TextObject.prototype.drawText = function(ctx, fill, posX, posY, onlyUpdate) {
    var decimals = this.evaluator.eval(this.decimals);
    var width = this.evaluator.eval(this.parent.width);
    var size = this.evaluator.eval(this.parent.font_size);
    var color = (fill.getColor) ? fill.getColor() : fill;

    var newTextStr = this.textToString(this.text, decimals, this.fixed).replace(/\\{/g, "\\curlyBracketOpen ").replace(/\\}/g, "\\curlyBracketClose ").replace(/\\\[/g, "\\squareBracketOpen ").replace(/\\\]/g, "\\squareBracketClose ");

    // check if the newTextStr contains an expression
    if (newTextStr.indexOf("[") >= 0) {
      newTextStr = this.textToString(this.parseSimpleText(newTextStr), decimals, this.fixed);
    }

    if (
      (this.oldTextStr !== newTextStr) || 
      (this.oldWidth !== width) || 
      (this.oldSize !== size) || 
      (this.oldColor !== color) ||
      (this.oldPosX !== posX) || 
      (this.oldPoxY !== posY) 
    ) {
      var style = new descartesJS.TextStyle({ 
        size: size,
        family: this.parent.font_family || "arial",
        italic: this.parent.italics || false,
        bold: this.parent.bold || false,
        color: color,
        align: this.align,
        border: this.parent.border
      });

      this.textNodes = this.descarTeXParser.parse(newTextStr, this.evaluator, style);

      this.textNodes.update(posX, posY, decimals, this.fixed, this.align, this.anchor, color, width);
    }

    if (!onlyUpdate) {
      this.textNodes.draw(ctx);
    }

    this.oldTextStr = newTextStr;
    this.oldWidth = width;
    this.oldSize = size;
    this.oldColor = color;
    this.oldPosX = posX;
    this.oldPoxY = posY;
  }

  /**
   * 
   */
  descartesJS.TextObject.prototype.drawRTF = function(ctx, fill, posX, posY, onlyUpdate) {
    fill = (fill.getColor) ? fill.getColor() : fill;
    ctx.fillStyle = fill;
    ctx.strokeStyle = fill;
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
  descartesJS.TextObject.prototype.parseSimpleText = function(text) {
    text = text.replace("&#x2013", "–").replace(/\&squot;/g, "'");

    var textElements = [];

    var txt = "'";
    var pos = 0;
    var lastPos = 0;
    var ignoreSquareBracket = -1;
    var charAt;
    var charAtAnt;
    var textLength = text.length;

    while (pos < textLength) {
      charAt = text.charAt(pos);
      charAtAnt = text.charAt(pos-1);

      // open square bracket scaped
      if ((charAt === "[") && (charAtAnt === "\\")) {
        textElements.push(text.substring(lastPos, pos-1) + "[");
        lastPos = pos+1;
      }

      // close square bracket scaped
      else if ((charAt === "]") && (charAtAnt === "\\")) {
        textElements.push(text.substring(lastPos, pos-1) + "]");
        lastPos = pos+1;
      }

      // if find an open square bracket
      else if ((charAt === "[") && (ignoreSquareBracket === -1)) {
        textElements.push(text.substring(lastPos, pos));
        lastPos = pos;
        ignoreSquareBracket++;
      }

      else if (charAt === "[") {
        ignoreSquareBracket++;
      }

      // if find a close square bracket add the string +'
      else if ((charAt === "]") && (ignoreSquareBracket === 0)) {
        textElements.push( this.evaluator.parser.parse(text.substring(lastPos, pos+1)) );
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

    textElements.push(text.substring(lastPos, pos));

    return textElements;
  }

  /**
   * 
   */
  descartesJS.TextObject.prototype.textToString = function(text, decimals, fixed) {
    var txt = "";

    if (text.type !== "rtfNode") {
      var evalString;

      for(var i=0, l=text.length; i<l; i++) {
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

  return descartesJS;
})(descartesJS || {});
