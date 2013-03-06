/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * @constructor 
   */
  descartesJS.SimpleText = function(text, parent) {
    this.text = text;
    this.textElements = [];
    this.textElementsMacros = [];
    this.parent = parent;
    this.evaluator = parent.evaluator;
    this.type = "simpleText"

    var txt = "'";
    var pos = 0;
    var lastPos = 0;
    var ignoreSquareBracket = -1;
    var charAt;
    var charAtAnt;

    while (pos < text.length) {
      charAt = text.charAt(pos);
      charAtAnt = text.charAt(pos-1);

      if ((charAt === "[") && (charAtAnt === "\\")) {
        this.textElements.push(text.substring(lastPos, pos-1) + "[");
        this.textElementsMacros.push("'" + text.substring(lastPos, pos-1) + "['");
        lastPos = pos+1;
      }
      
      else if ((charAt === "]") && (charAtAnt === "\\")) {
        this.textElements.push(text.substring(lastPos, pos-1) + "]");
        this.textElementsMacros.push("'" + text.substring(lastPos, pos-1) + "]'");
        lastPos = pos+1;
      }
      
      // si se encuentra un corchete que abre agregamos '+
      else if ((charAt === "[") && (ignoreSquareBracket == -1)) {
        this.textElements.push(text.substring(lastPos, pos));
        this.textElementsMacros.push("'" + text.substring(lastPos, pos) + "'");
        lastPos = pos;
        ignoreSquareBracket++;
      } 

      else if (charAt === "[") {
        ignoreSquareBracket++;
      } 

      // si se encuentra un corchete que cierra agregamos +'
      else if ((charAt === "]") && (ignoreSquareBracket == 0)) {
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
   *
   */
  descartesJS.SimpleText.prototype.toString = function(decimals, fixed) {
    var txt = "";
    var evalString;

    for(var i=0, l=this.textElements.length; i<l; i++) {
      if (typeof(this.textElements[i]) === "string") {
        txt += this.textElements[i];
      }
      else {
        evalString = this.evaluator.evalExpression(this.textElements[i])[0][0];

        if (evalString != "") {
          // la evaluacion es una cadena
          if (typeof(evalString) == "string") {
            txt += evalString;
          }
          // la evaluacion es un numero
          else {
            evalString = parseFloat(evalString);

            evalString = (fixed) ? evalString.toFixed(decimals) : parseFloat(evalString.toFixed(decimals));
            txt += evalString.toString().replace(".", this.parent.decimal_symbol);                        
          }
        }
      }
    }

    return txt;
  }

  return descartesJS;
})(descartesJS || {});