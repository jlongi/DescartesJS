/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var expr;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;

  var width;
  var textLine;
  var w;
  var newText;
  var height;

  var restText;
  var resultText;
  var tempText;
  var charAt;
  var lastIndex;
  var decimals;

  var tmpString;

  /**
   * A Descartes text
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the text
   */
  descartesJS.Text = function(parent, values) {
    /**
     * the stroke width of the graph
     * type {Number}
     * @private
     */
    this.width = parent.evaluator.parser.parse("0");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    // alignment
    if (!this.align) {
      this.align = "start";
    }

    this.ascent = this.fontSize -Math.ceil(this.fontSize/7) -((this.font.match("Courier")) ? 3 : 0);
    this.descent = descartesJS.getFontMetrics(this.font).descent
    this.abs_coord = true;
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Text, descartesJS.Graphic);

  /**
   * Update the text
   */
  descartesJS.Text.prototype.update = function() {
    evaluator = this.evaluator;

    expr = evaluator.eval(this.expresion);
    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression

    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.eval(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);

      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }

    // configuration of the form (x,y,ew,eh)
    if (expr[0].length >= 4) {
      this.centered = true;
      this.exprW = expr[0][2];
      this.exprH = expr[0][3];
    }
  }

  /**
   * Draw the text
   */
  descartesJS.Text.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.color);
  }

  /**
   * Draw the trace of the text
   */
  descartesJS.Text.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this, this.color);
  }

  /**
   * Auxiliary function for draw a text
   * @param {CanvasRenderingContext2D} ctx rendering context on which the text is drawn
   * @param {String} fill the fill color of the text
   * @param {String} stroke the stroke color of the text
   */
  descartesJS.Text.prototype.drawAux = function(ctx, fill) {
    decimals = this.evaluator.eval(this.decimals);

    if (this.text.type === "rtfNode") {
      newText = this.text;
      this.ascent = 0;
    }
    else {
      newText = this.splitText(this.text.toString(decimals, this.fixed).split("\\n"));
    }

    // draw the text
    if (this.text != [""]) {
      var posX = parseInt(this.exprX)+5;
      var posY = parseInt(this.exprY)+this.ascent;

      if (this.centered) {
        var width = this.getMaxWidth(newText);
        posX = parseInt(this.exprX + (this.exprW - width)/2);
        posY = parseInt(this.exprY + this.descent + (this.exprH - (this.fontSize*1.2)*(newText.length-1))/2);
      }

      this.uber.drawText.call(this, ctx, newText, posX, posY, fill, this.font, this.align, "alphabetic", decimals, this.fixed);
    }
  }

  /**
   * Split a text
   * @param {SimpleText} text the simple text to split
   * @return {Array<String>} return the divided text
   */
  descartesJS.Text.prototype.splitText = function(text) {
    evaluator = this.evaluator;
    width = evaluator.eval(this.width);
    newText = [];

    // if the width is greater than 20 then split the text
    // besides the text should not be a rtf text (text.type! = "undefined")
    if ( (width >=20) && (text.type != "undefined") ) {
      for (var i=0, l=text.length; i<l; i++) {
        textLine = text[i];
        w = descartesJS.getTextWidth(textLine, this.font);

        if (w > width) {
          newText = newText.concat( this.splitWords(textLine, width) );
        }
        else {
          newText.push(textLine);
        }
      }

      height = Math.floor(this.fontSize*1.2)*(newText.length);
      evaluator.setVariable("_Text_H_", height);
      return newText;
    }

    evaluator.setVariable("_Text_H_", 0);

    return text;
  }

  /**
   * Split a text form a width
   * @param {String} text the text to split
   * @param {Number} widthLimit the width to split the text
   * @return {Array<String>} return the divided text
   */
  descartesJS.Text.prototype.splitWords = function(text, widthLimit) {
    restText = text;
    resultText = [];
    tempText = "";
    lastIndex = 0;

    for (var i=0, l=text.length; i<l; i++) {
      charAt = restText.charAt(i);

      if (charAt === " ") {
        lastIndexOfWhite = i;
      }

      tempText += charAt;

      if (descartesJS.getTextWidth(tempText, this.font) > widthLimit) {
        tmpString = text.substring(lastIndex, i+1);

        if (charAt !== " ") {
          if (tmpString.indexOf(" ") === -1) {
            lastIndexOfWhite = i;
            i--;
          }
          else {
            i = lastIndexOfWhite;
          }
        }

        resultText.push( text.substring(lastIndex, lastIndexOfWhite) );

        tempText = "";
        lastIndex = i+1;
      }

    }
    resultText.push( text.substring(lastIndex) );

    return resultText
  }

  /**
   *
   */
  descartesJS.Text.prototype.getMaxWidth = function(text) {
    var width = -1;

    for (var i=0, l=text.length; i<l; i++) {
      textLine = text[i];
      width = Math.max(width, descartesJS.getTextWidth(textLine, this.font));
    }

    return width;
  }

  return descartesJS;
})(descartesJS || {});
