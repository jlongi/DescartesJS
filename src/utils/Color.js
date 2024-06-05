/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  const MathFloor = Math.floor;

  var regExpImage = /[\w-//]*(\.png|\.jpg|\.gif|\.svg|\.webp)/gi;
  var evaluator;
  var tmpColor;
  var splitColor;
  var hexColor;
  var splitString;
  var splitColor_i;
  var numParentheses;
  var numSquareParentheses;
  var lastSplitIndex;
  var charAt;
  var r;
  var g;
  var b;
  var a;
  var stop_tmp;
  var grad;
  var img;
  var parent;

  /**
   *
   */
  class Color {
    constructor(color, evaluator) {
      var self = this;
      self.r = self.g = self.b = 0;
      self.a = 1;

      self.evaluator = evaluator;

      self.getColor = self.getColorStr;

      let grad_info;
      let stop;

      // construct a simple color
      if (!color) {
        self.colorStr = `rgba(${self.r},${self.g},${self.b},${self.a})`;
        return;
      }

      // linear gradient
      else if (color.match(/^GradL/)) {
        grad_info = self.splitComa( color.substring(6, color.length-1) );
        self.x1 = self.evaluator.parser.parse(grad_info[0]);
        self.y1 = self.evaluator.parser.parse(grad_info[1]);
        self.x2 = self.evaluator.parser.parse(grad_info[2]);
        self.y2 = self.evaluator.parser.parse(grad_info[3]);
        self.stops = [];
        for (let i=4; i<grad_info.length; i++) {
          if (grad_info[i] != "") {
            stop = grad_info[i].split("|");

            self.stops.push({
              percentage: self.evaluator.parser.parse(stop[1]),
              color: "#" + stop[2]
            });
          }
        }

        self.getColor = self.getLinearGradient;
        return;
      }

      // pattern
      else if (color.match(/^Pattern/)) {
        self.img_src = color.substring(8, color.length-1);
        if (self.img_src.match(regExpImage)) {
          self.img_src = "'" + self.img_src + "'";
        }
        self.img_src = self.evaluator.parser.parse(self.img_src);

        self.getColor = self.getPattern;
        return;
      }

      // the color is a color name
      else if (babel[color]) {
        if (babel[color] === "net") {
          color = "rojo";
        }

        color = babel[color];

        self.r = descartesJS.toHex(color.substring(1,3));
        self.g = descartesJS.toHex(color.substring(3,5));
        self.b = descartesJS.toHex(color.substring(5,7));
        self.colorStr = color;
      }

      // the color is six hexadecimals digits #RRGGBB
      else if (color.length === 6) {
        self.r = descartesJS.toHex(color.substring(0,2));
        self.g = descartesJS.toHex(color.substring(2,4));
        self.b = descartesJS.toHex(color.substring(4,6));
        self.colorStr = "#" + color;
      }

      // the color is eight hexadecimals digits #RRGGBBAA
      else if (color.length === 8) {
        self.r = descartesJS.toHex(color.substring(2,4));
        self.g = descartesJS.toHex(color.substring(4,6));
        self.b = descartesJS.toHex(color.substring(6,8));
        self.a = (1-descartesJS.toHex(color.substring(0,2))/255);
        self.colorStr = `rgba(${self.r},${self.g},${self.b},${self.a})`;
      }

      // the color is a Descartes expression (exprR, exprG, exprB, exprA)
      else if (color[0] === "(") {
        tmpColor = [];
        splitColor = self.splitComa(color.substring(1, color.length-1));

        for (var i=0, l=splitColor.length; i<l; i++) {
          splitColor_i = splitColor[i];
          hexColor = parseInt(splitColor_i, 16);
          
          if ( (splitColor_i !== hexColor.toString(16)) && (splitColor_i !== "0"+hexColor.toString(16)) ) {
            if ((splitColor_i.charAt(0) === "[") && (splitColor_i.charAt(splitColor_i.length-1) === "]")) {
              splitColor_i = splitColor_i.substring(1, splitColor_i.length-1);
            }

            tmpColor.push(self.evaluator.parser.parse( splitColor_i ));
          }
          else {
            tmpColor.push(self.evaluator.parser.parse( (hexColor/255).toString() ));
          }
        }

        self.rExpr = tmpColor[0];
        self.gExpr = tmpColor[1];
        self.bExpr = tmpColor[2];
        self.aExpr = tmpColor[3];

        self.getColor = self.getColorExp;
      }
    }

    /**
     * Split a string using a coma delimiter
     * @param {String} string the string to split
     * @return {Array<String>} return an array of the splitting string using a coma delimiter
     */
    splitComa(string) {
      splitString = [];

      numParentheses = 0;
      numSquareParentheses = 0;

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
          numSquareParentheses++;
        }
        else if (charAt === "]") {
          numSquareParentheses--;
        }
        else if ((charAt === ",") && (numParentheses === 0) && (numSquareParentheses === 0)) {
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
    getColorStr() {
      return this.colorStr;
    }

    /**
     *
     */
    getColorExp() {
      var self = this;
      
      evaluator = self.evaluator;
      self.r = MathFloor(evaluator.eval(self.rExpr) * 255);
      self.g = MathFloor(evaluator.eval(self.gExpr) * 255);
      self.b = MathFloor(evaluator.eval(self.bExpr) * 255);
      self.a = (1 - evaluator.eval(self.aExpr));

      return `rgba(${self.r},${self.g},${self.b},${self.a})`;
    }

    /**
     * 
     */
    getLinearGradient() {
      var self = this;

      grad = descartesJS.ctx.createLinearGradient(
        self.evaluator.eval(self.x1),
        self.evaluator.eval(self.y1),
        self.evaluator.eval(self.x2),
        self.evaluator.eval(self.y2)
      );

      for (let i=0; i<self.stops.length; i++) {
        stop_tmp = self.evaluator.eval(self.stops[i].percentage);
        stop_tmp = (stop_tmp < 0) ? 0 : ((stop_tmp > 1) ? 1 : stop_tmp)
        grad.addColorStop(
          stop_tmp,
          self.stops[i].color
        );
      }

      return grad;
    }

    /**
     * 
     */
     getPattern() {
      var self = this;
      parent = self.evaluator.parent;
      img = parent.getImage(self.evaluator.eval(self.img_src));

      if (img) {
        try {
          return descartesJS.ctx.createPattern(img, "repeat");
        } catch (e) {
          return "ff00ff";          
        }
      }
      return "ff00ff";
    }

    /**
     *
     */
    borderColor() {
      return (this.r + this.g + this.b < 380) ? "#ffffff" : "#000000";
    }
  }

  /**
   *
   */
  descartesJS.toHex = function(color) {
    return parseInt("0x"+color, 16);
  }

  /**
   *
   */
  descartesJS.RGBAToHexColor = function(color) {
    color = color.substring(5, color.length-1).split(",");

    r = parseInt(color[0]).toString(16);
    g = parseInt(color[1]).toString(16);
    b = parseInt(color[2]).toString(16);
    a = (255 - (parseInt(parseFloat(color[3])*255))).toString(16);

    if (r.length === 1) r = "0"+r;
    if (g.length === 1) g = "0"+g;
    if (b.length === 1) b = "0"+b;
    if (a.length === 1) a = "0"+a;

    return new Color(a+r+g+b);
  }

  descartesJS.Color = Color;
  return descartesJS;
})(descartesJS || {});
