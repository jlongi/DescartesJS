/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS, babel) {
  if (descartesJS.loadLib) { return descartesJS; }

  var regExpType = new String("-text-image-point-polygon-arc-segment-arrow-macro-curve-equation-sequence-rectangle-fill-");
  
  var regExpImage = /[\w\.\-//]*(\.png|\.jpg|\.gif|\.svg|\.webp)/gi;
  var expr;

  class Macro extends descartesJS.Graphic {
    /**
     * A Descartes macro
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the macro
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);
      
      this.hasExpresion = this.hasExpresion || false;
      this.inirot = this.inirot || parent.evaluator.parser.parse("0");
      this.inipos = this.inipos || parent.evaluator.parser.parse("(0,0)");

      // assign the values to replace the defaults values of the object
      Object.assign(this, values);
      this.hasExpresion = (this.expresion !== undefined);

      this.graphics = [];

      var lessonParser = parent.lessonParser;
      var tokenizer = new descartesJS.Tokenizer();

      // if the expression is empty
      if (!this.hasExpresion) {
        return;
      }

      // if the macro name was not specified as a string, then adds single quotes to turn it into string
      if ( !(this.expresion.charAt(0) === "'")) {
        this.expresion = "'" + this.expresion + "'";
      }
      this.expresion = this.evaluator.parser.parse(this.expresion);

      var filename = this.evaluator.eval(this.expresion);
      var response;

      if (filename) {
        // the macro is embedded in the webpage
        var macroElement = document.getElementById(filename);

        if ((macroElement) && (macroElement.type == "descartes/macro")) {
          response = macroElement.text;
        }
        // the macro is in an external file
        else {
          response = descartesJS.openExternalFile(filename);
        }
      }

      var indexOfEqual;
      var tmpResponse;

      // if it was possible to read the macro
      if (response) {
        tmpResponse = (descartesJS.convertHTMLEntities(response)).replace(/\r/g, "").split("\n");

        // maintain only the lines that have information for the macro
        response = [];

        for(var i=0, l=tmpResponse.length; i<l; i++) {
          if (tmpResponse[i].trim()) {
            indexOfEqual = tmpResponse[i].indexOf("=");

            if(indexOfEqual !== -1) {
              var tmpSplitLine = lessonParser.split(tmpResponse[i]);
              for (var iT=0,lT=tmpSplitLine.length; iT<lT; iT++) {
                if ((tmpSplitLine[iT]) && (tmpSplitLine.length >1)) {
                  if ((babel[tmpSplitLine[iT][0]] === "id") || (babel[tmpSplitLine[iT][0]] === "type")) {
                    response.push(tmpSplitLine);
                    break;
                  }
                }
              }
            }
          }
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var self = this;

        // function to replace expressions
        var funReplace = function(str, m1) {
          var tokens = tokenizer.tokenize(m1.replace(/\&squot;/g, "'"));

          for (var t=0, lt=tokens.length; t<lt; t++) {
            if (
              ((tokens[t].type == "identifier") && (!descartesJS.reservedIds.match("-" + tokens[t].value + "-"))) ||
              (tokens[t].value === "R") ||
              (tokens[t].value === "G") ||
              (tokens[t].value === "B")
            ) {
              tokens[t].value = self.name + "." + tokens[t].value;
            }
          }

          var prefix = (str.match(/^\\expr/)) ? "\\expr " : "\\decimals ";

          return prefix + tokenizer.flatTokens(tokens);
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var respText;
        var babelResp;
        var dotIndex;
        var tmpTokens;
        var tmpTokensRespText;
        var isID;
        // add the macro name as a prefix, only in some expressions
        for (var i=0, l=response.length; i<l; i++) {
          respText = response[i] || [];

          isID = ((respText) && (respText[0]) && (respText[0][0] === "id"));

          for (var j=0, k=respText.length; j<k; j++) {
            // if the parameters have a dot
            dotIndex = respText[j][0].indexOf(".");
            if ((dotIndex !== -1) && (!isID)) {
              babelResp = babel[respText[j][0].substring(dotIndex+1)];
              respText[j][0] = this.name + "." + respText[j][0];
            }
            else {
              babelResp = babel[respText[j][0]];
            }

            // if the expressions are different from this, then the cycle continues and is not replaced nothing
            if ( (babelResp === "font") ||
                (babelResp === "font_family") ||
                (((babelResp === "fill") || (babelResp === "color") || (babelResp === "border") || (babelResp === "arrow")) && (respText[j][1].charAt(0) !== "(")) ||
                ((babelResp === "file") && (respText[j][1].match(regExpImage))) ||
                ((babelResp !== "id") && (babel[respText[j][1]] !== undefined))
              ) {
                if (babelResp !== "radius") {
                  continue;
                }
            }

            // is a text
            if (babelResp == "text") {
              // if the text is rtf must processing it different
              if (respText[j][1].match(/\{\\rtf1/)) {
                var textTemp = respText[j][1];

                textTemp = textTemp.replace(/\\expr ([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.'\+\-]*)/gi, funReplace);
                textTemp = textTemp.replace(/\\decimals ([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.'\+\-]*)/gi, funReplace);

                respText[j][1] = textTemp;
              }
              // simple text
              else {
                tmpTokensRespText = lessonParser.parseText(respText[j][1]).textElementsMacros;

                for (var ttrt=0, lttrt=tmpTokensRespText.length; ttrt<lttrt; ttrt++) {
                  tmpTokens = tokenizer.tokenize(tmpTokensRespText[ttrt].replace(/\&squot;/g, "'"));

                  for (var tt=0, ltt=tmpTokens.length; tt<ltt; tt++) {
                    if (
                      ((tmpTokens[tt].type === "identifier") && (!descartesJS.reservedIds.match("-" + tmpTokens[tt].value + "-"))) ||
                      (tmpTokens[tt].value === "R") ||
                      (tmpTokens[tt].value === "G") ||
                      (tmpTokens[tt].value === "B")
                    ) {
                      tmpTokens[tt].value = this.name + "." + tmpTokens[tt].value;
                    }
                  }
                  tmpTokens = (tokenizer.flatTokens(tmpTokens)).replace(/&squot;/g, "'").replace(/'\+\(/g, "[").replace(/\)\+'/g, "]");

                  tmpTokensRespText[ttrt] = tmpTokens.substring(1, tmpTokens.length-1);
                }

                respText[j][1] = tmpTokensRespText.join("");
              }
            }
            // the token is not a text
            else {
              var tmpTokensArray = respText[j][1].replace(/\&squot;/g, "'").split(";");

              for (var tmpI=0, tmpL=tmpTokensArray.length; tmpI<tmpL; tmpI++) {
                tmpTokens = tokenizer.tokenize(tmpTokensArray[tmpI].replace(/\\n/g, ";"));

                for (var t=0, lt=tmpTokens.length; t<lt; t++) {
                  if (
                    ((tmpTokens[t].type === "identifier") && (!descartesJS.reservedIds.match("-" + tmpTokens[t].value + "-"))) ||
                    (tmpTokens[t].value === "R") ||
                    (tmpTokens[t].value === "G") ||
                    (tmpTokens[t].value === "B")
                  ) {
                    tmpTokens[t].value = this.name + "." + tmpTokens[t].value;
                  }
                }

                tmpTokensArray[tmpI] = tokenizer.flatTokens(tmpTokens);
              }

              respText[j][1] = tmpTokensArray.join(";");
            }
          }
        }

        var tempResp;
        var isGraphic;

        // flat the expressions to obtain a string
        for (var i=0, l=response.length; i<l; i++) {
          if (response[i][0]) {
            tempResp = "";
            isGraphic = false;

            for (var j=0, k=response[i].length; j<k; j++) {
              // if the object has a type and is of the graphic type, then is a graphic object
              if ( (babel[response[i][j][0]] === "type") && (regExpType.match("-" + babel[response[i][j][1]] + "-")) ) {
                isGraphic = true;
              }
              tempResp = tempResp + response[i][j][0] + "='" + response[i][j][1] + "' ";
            }

            response[i] = tempResp + ((isGraphic) ? " space='" + this.spaceID + "'" : "");

            // build and add the graphic elements to the space
            if (isGraphic) {
              // add something to indicate that it comes from a macro
              this.graphics.push( lessonParser.parseGraphic(response[i], this.abs_coord, this.background, this.inirot) );
            }
            // build and add the auxiliaries to the scene
            else {
              lessonParser.parseAuxiliar(response[i]);
            }
          }
        }
      }
    }

    /**
     * Update the macro
     */
    update() {
      expr = this.evaluator.eval(this.inipos);
      this.iniPosX = expr[0][0];
      this.iniPosY = expr[0][1];
    }

    /**
     * Auxiliary function for draw a macro
     * @param {CanvasRenderingContext2D} ctx rendering context on which the macro is drawn
     */
    drawAux(ctx) {
      for (var i=0, l=this.graphics.length; i<l; i++) {
        if (this.graphics[i]) {
          ctx.save();

          if (this.graphics[i].abs_coord) {
            ctx.translate(this.iniPosX, this.iniPosY);
          }
          else {
            ctx.translate(this.iniPosX*this.space.scale, -this.iniPosY*this.space.scale);
          }

          this.graphics[i].draw();

          // reset the transformations
          // ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.restore();
        }
      }
    }
  }

  descartesJS.Macro = Macro;
  return descartesJS;
})(descartesJS || {}, babel);
