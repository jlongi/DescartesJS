/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var evaluator;
  var tmpColor;
  var splitColor;
  var hexColor;
  var splitString;
  var numParentheses;
  var numSquareParenteses;
  var lastSplitIndex;
  var charAt;
  var r;
  var g;
  var b;
  var a;

  /**
   *
   */
  descartesJS.Color = function(color, evaluator) {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;

    this.evaluator = evaluator;

    // construct a simple color
    if (!color) {
      this.colorStr = "rgba("+ this.r +","+ this.g +","+ this.b +","+ this.a + ")";

      this.getColor = this.getColorString;
      return;
    }

    // the color is a color name
    if (babel[color]) {
      if (babel[color] === "net") {
        color = "rojo";
      }

      color = babel[color];

      this.r = parseInt("0x"+color.substring(1,3), 16);
      this.g = parseInt("0x"+color.substring(3,5), 16);
      this.b = parseInt("0x"+color.substring(5,7), 16);
      this.colorStr = color;

      this.getColor = this.getColorString;
    }

    // the color is six hexadecimals digits #RRGGBB
    if (color.length === 6) {
      this.r = parseInt("0x"+color.substring(0,2), 16);
      this.g = parseInt("0x"+color.substring(2,4), 16);
      this.b = parseInt("0x"+color.substring(4,6), 16);
      this.colorStr = "#" + color;

      this.getColor = this.getColorString;
    }

    // the color is eight hexadecimals digits #RRGGBBAA
    if (color.length === 8) {
      this.r = parseInt("0x"+color.substring(2,4), 16);
      this.g = parseInt("0x"+color.substring(4,6), 16);
      this.b = parseInt("0x"+color.substring(6,8), 16);
      this.a = (1-parseInt("0x"+color.substring(0,2), 16)/255);
      this.colorStr = "rgba("+ this.r +","+ this.g +","+ this.b +","+ this.a + ")";

      this.getColor = this.getColorString;
    }

    // the color is a Descartes expression (exprR, exprG, exprB, exprA)
    if (color[0] === "(") {
      tmpColor = [];
      splitColor = this.splitComa(color.substring(1, color.length-1));

      for (var i=0, l=splitColor.length; i<l; i++) {
        hexColor = parseInt(splitColor[i], 16);

        if ( (splitColor[i] != hexColor.toString(16)) && (splitColor[i] !== "0"+hexColor.toString(16)) ) {
          if ((splitColor[i].charAt(0) === "[") && (splitColor[i].charAt(splitColor[i].length-1) === "]")) {
            splitColor[i] = splitColor[i].substring(1, splitColor[i].length-1);
          }

          tmpColor.push(this.evaluator.parser.parse( splitColor[i] ));
        }
        else {
          tmpColor.push(this.evaluator.parser.parse( (hexColor/255).toString() ));
        }
      }

      this.rExpr = tmpColor[0];
      this.gExpr = tmpColor[1];
      this.bExpr = tmpColor[2];
      this.aExpr = tmpColor[3];

      this.getColor = this.getColorExpression;
    }
    
  }

  /**
   * Split a string using a coma delimiter
   * @param {String} string the string to split
   * @return {Array<String>} return an array of the spliting string using a coma delimiter
   */
  descartesJS.Color.prototype.splitComa = function(string) {
    splitString = [];
    
    numParentheses = 0;
    numSquareParenteses = 0;

    lastSplitIndex = 0;

    for (var i=0, l=string.length; i<l; i++) {
      charAt = string.charAt(i);
    
      if (charAt === "(") {
        numParentheses++;
      }
      else if (charAt === ")") {
        numParentheses--;
      }
      else if (charAt === "[") {
        numSquareParenteses++;
      }
      else if (charAt === "]") {
        numSquareParenteses--;
      }
      else if ((charAt === ",") && (numParentheses === 0) && (numSquareParenteses === 0)) {
        splitString.push(string.substring(lastSplitIndex, i));
        lastSplitIndex = i+1;
      }
    }
    
    splitString.push(string.substring(lastSplitIndex));
    
    return splitString;
  }


  /**
   *
   */
  descartesJS.Color.prototype.getColorString = function() {
    return this.colorStr;
  }

  /**
   *
   */
  descartesJS.Color.prototype.getColorExpression = function() {
    evaluator = this.evaluator;
    this.r = MathFloor(evaluator.evalExpression(this.rExpr) * 255);
    this.g = MathFloor(evaluator.evalExpression(this.gExpr) * 255);
    this.b = MathFloor(evaluator.evalExpression(this.bExpr) * 255);
    this.a = (1 - evaluator.evalExpression(this.aExpr));

    return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
  }

  /**
   *
   */
  descartesJS.Color.prototype.borderColor = function() {
    if (this.r + this.g + this.b < 380) {
      return "white";
    }
    return "black";
  }

  return descartesJS;
})(descartesJS || {});