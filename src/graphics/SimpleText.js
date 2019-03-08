/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var txt;
  var evalString;

  var pos;
  var lastPos;
  var ignoreSquareBracket;
  var charAt;
  var charAtAnt;

  /**
   * A Descartes plain text (not RTF)
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   * @param {String} text the content text
   */
  descartesJS.SimpleText = function(parent, text) {
    this.text = text = text.replace("&#x2013", "–").replace(/\&squot;/g, "'");

    this.textElements = [];
    this.textElementsMacros = [];
    this.parent = parent;
    this.evaluator = parent.evaluator;
    this.type = "simpleText"

    txt = "'";
    pos = 0;
    lastPos = 0;
    ignoreSquareBracket = -1;

    while (pos < text.length) {
      charAt = text.charAt(pos);
      charAtAnt = text.charAt(pos-1);

      // open square bracket scaped
      if ((charAt === "[") && (charAtAnt === "\\")) {
        this.textElements.push(text.substring(lastPos, pos-1) + "[");
        this.textElementsMacros.push("'" + text.substring(lastPos, pos-1) + "['");
        lastPos = pos+1;
      }

      // close square bracket scaped
      else if ((charAt === "]") && (charAtAnt === "\\")) {
        this.textElements.push(text.substring(lastPos, pos-1) + "]");
        this.textElementsMacros.push("'" + text.substring(lastPos, pos-1) + "]'");
        lastPos = pos+1;
      }

      // if find an open square bracket
      else if ((charAt === "[") && (ignoreSquareBracket === -1)) {
        this.textElements.push(text.substring(lastPos, pos));
        this.textElementsMacros.push("'" + text.substring(lastPos, pos) + "'");
        lastPos = pos;
        ignoreSquareBracket++;
      }

      else if (charAt === "[") {
        ignoreSquareBracket++;
      }

      // if find a close square bracket add the string +'
      else if ((charAt === "]") && (ignoreSquareBracket === 0)) {
        this.textElements.push( this.evaluator.parser.parse(text.substring(lastPos, pos+1)) );
        this.textElementsMacros.push( "[" + text.substring(lastPos, pos+1) + "]");
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
    this.textElements.push(text.substring(lastPos, pos));
    this.textElementsMacros.push("'" + text.substring(lastPos, pos) + "'");
  }

  /**
   * Get the string representation of the text, replacing the number taking into account the number of decimals and the fixed value
   * @param {Number} decimal the number of decimal of the number in the text
   * @param {Boolean} fixed a condition to indicate if the number has a fixed representation
   * @return {String} return the string representation of te text
   */
  descartesJS.SimpleText.prototype.toString = function(decimals, fixed) {
    txt = "";

    for(var i=0, l=this.textElements.length; i<l; i++) {
      if (typeof(this.textElements[i]) === "string") {
        txt += this.textElements[i];
      }
      else {
        evalString = this.evaluator.eval(this.textElements[i])[0][0];

        if (evalString !== "") {
          // the evaluation is a string
          if (typeof(evalString) === "string") {
            txt += evalString;
          }
          else if (evalString == Infinity) {
            txt += "Infinity";
          }
          else if (evalString == -Infinity) {
            txt += "-Infinity";
          }
          else if (isNaN(evalString) || (evalString == "NaN")) {
            txt += "NaN";
          }
          // the evaluation is a number
          else {
            evalString = parseFloat(evalString);
            
            evalString = (fixed) ? evalString.toFixed(decimals) : descartesJS.removeNeedlessDecimals(evalString.toFixed(decimals));
            txt += evalString.toString().replace(".", this.parent.decimal_symbol);
          }
        }
      }
    }

    return txt;
  }

  return descartesJS;
})(descartesJS || {});
