/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

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
    
    this.ascent = this.fontSize -Math.ceil(this.fontSize/7) -((this.font.match("Courier")) ? 3 : 0);;
    
    this.abs_coord = true;
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Text, descartesJS.Graphic);
  
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

  /**
   * Update the text
   */
  descartesJS.Text.prototype.update = function() {
    evaluator = this.evaluator;

    expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression

    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
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
    if (this.text.type === "rtfNode") {
      newText = this.text;
      this.ascent = 0;
    }
    else {
      newText = this.splitText(this.text.toString(this.evaluator.evalExpression(this.decimals), this.fixed).split("\\n"))
    }

    // draw the text
    if (this.text != [""]) {
      //this.uber.drawText.call(this, ctx, newText, parseFloat(this.exprX)+5, parseFloat(this.exprY), fill, this.font, this.align, "hanging");
      this.uber.drawText.call(this, ctx, newText, parseInt(this.exprX)+5, parseInt(this.exprY)+this.ascent, fill, this.font, this.align, "alphabetic");
    }
  }
  
  /**
   * Split a text
   * @param {SimpleText} text the simple text to split
   * @return {Array<String>} return the divided text
   */
  descartesJS.Text.prototype.splitText = function(text) {
    evaluator = this.evaluator;
    width = evaluator.evalExpression(this.width);
    newText = [];
    
    this.ctx.font = this.font;

    // if the width is greater than 20 then split the text
    // besides the text should not be a rtf text (text.type! = "undefined")
    if ( (width >=20) && (text.type != "undefined") ) {
      for (var i=0, l=text.length; i<l; i++) {
        textLine = text[i];
        w = (this.ctx.measureText(textLine)).width;

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
    evaluator.setVariable("_Text_W_", 1000);

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
    var tmpString;

    for (var i=0, l=text.length; i<l; i++) {
      charAt = restText.charAt(i);
      
      if (charAt === " ") {
        lastIndexOfWhite = i;
      }

      tempText += charAt;

      if (Math.round(this.ctx.measureText(tempText).width) > widthLimit) {
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
    resultText.push( text.substring(lastIndex));

    return resultText
  }

  return descartesJS;
})(descartesJS || {});