/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathMin = Math.min;
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
    this.a = 1;

    this.evaluator = evaluator;
    // construct a simple color
    if (!color) {
      this.colorStr = "rgba("+ this.r +","+ this.g +","+ this.b +","+ this.a + ")";

      this.getColor = this.getColorStr;
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

      this.getColor = this.getColorStr;
    }

    // the color is six hexadecimals digits #RRGGBB
    if (color.length === 6) {
      this.r = parseInt("0x"+color.substring(0,2), 16);
      this.g = parseInt("0x"+color.substring(2,4), 16);
      this.b = parseInt("0x"+color.substring(4,6), 16);
      this.colorStr = "#" + color;

      this.getColor = this.getColorStr;
    }

    // the color is eight hexadecimals digits #RRGGBBAA
    if (color.length === 8) {
      this.r = parseInt("0x"+color.substring(2,4), 16);
      this.g = parseInt("0x"+color.substring(4,6), 16);
      this.b = parseInt("0x"+color.substring(6,8), 16);
      this.a = (1-parseInt("0x"+color.substring(0,2), 16)/255);
      this.colorStr = "rgba("+ this.r +","+ this.g +","+ this.b +","+ this.a + ")";

      this.getColor = this.getColorStr;
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

      this.getColor = this.getColorExp;
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
  descartesJS.Color.prototype.getColorStr = function() {
    return this.colorStr;
  }

  /**
   *
   */
  descartesJS.Color.prototype.getColorExp = function() {
    evaluator = this.evaluator;
    this.r = MathMin(255, MathFloor(evaluator.eval(this.rExpr) * 255));
    this.g = MathMin(255, MathFloor(evaluator.eval(this.gExpr) * 255));
    this.b = MathMin(255, MathFloor(evaluator.eval(this.bExpr) * 255));
    this.a = (1 - evaluator.eval(this.aExpr));

    return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
  }

  /**
   *
   */
  descartesJS.Color.prototype.borderColor = function() {
    if (this.r + this.g + this.b < 380) {
      return "#ffffff";
    }
    return "#000000";
  }

  /**
   *
   */
  descartesJS.RGBAToHexColor = function(color) {
    color = color.substring(5, color.length-1).split(",");

    r = parseInt(color[0]).toString(16);
    g = parseInt(color[1]).toString(16);
    b = parseInt(color[2]).toString(16);
    a = (255- parseInt(parseFloat(color[3])*255)).toString(16);

    r = (r.length == 1) ? "0"+r : r;
    g = (g.length == 1) ? "0"+g : g;
    b = (b.length == 1) ? "0"+b : b;
    a = (a.length == 1) ? "0"+a : a;

    return new descartesJS.Color(a+r+g+b);
  }

  return descartesJS;
})(descartesJS || {});
