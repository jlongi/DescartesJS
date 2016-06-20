/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS, babel) {
  if (descartesJS.loadLib) { return descartesJS; }

  var reservedIdentifiers = new String("-_-rnd-pi-e-sqr-raíz-sqrt-exp-log-log10-abs-ent-sgn-ind-sen-sin-cos-tan-cot-sec-csc-senh-sinh-cosh-tanh-coth-sech-csch-asen-asin-acos-atan-min-max-_Num_-_Trace_-_Stop_Audios_-esCorrecto-escorrecto-_NumToStr_-_NumACadena_-_charAt_-_letraEn_-_substring_-_subcadena_-_length_-_longitud_-_indexOf_-índiceDe-_GetValues_-_GetMatrix_-_MatrixToStr_-_StrToMatrix_-_GetVector_-_VectorToStr_-_StrToVector_-_ExecStr_-_ExecBlock_-_Save_-_Open_-_SaveState_-_OpenState_-_AnchoDeCadena_-_strWidth_-_Rojo_-_Red_-_Verde_-_Green_-_Azul_-_Blue_-");
  var regExpImage = /[\w\.\-//]*(\.png|\.jpg|\.gif|\.svg)/gi;
  var expr;

  /**
   * A Descartes macro
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the macro
   */
  descartesJS.Macro = function(parent, values) {
    /**
     * the expression for determine the position of the graphic
     * type {Node}
     * @private
     */
    this.hasExpresion = false;

    /**
     * the macro rotation
     * type {Node}
     * @private
     */
    this.inirot = parent.evaluator.parser.parse("0");

    /**
     * the macro position
     * type {Node}
     * @private
     */
    this.inipos = parent.evaluator.parser.parse("(0,0)");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    // traverse the values to replace the defaults values of the object
    for (var propName in values) {
      if (propName == "expresion") {
        this.hasExpresion = true;
      }

      // verify the own properties of the object
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }

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
      // the macro is embeded in the webpage
      var macroElement = document.getElementById(filename);

      if ((macroElement) && (macroElement.type == "descartes/macro")) {
        response = macroElement.text;
      }
      // the macro is in an external file
      else {
        response = descartesJS.openExternalFile(filename);

        // verify the content is a Descartes macro
        if ( (response) && (!response.match(/tipo_de_macro/g)) ) {
          response = null;
        }
      }
    }

    var indexOfEqual;
    var tmpIniti;
    var tmpResponse;

    // if it was posible to read the macro
    if (response) {
      tmpResponse = ( response.replace(/&aacute;/g, "\u00e1").replace(/&eacute;/g, "\u00e9").replace(/&iacute;/g, "\u00ed").replace(/&oacute;/g, "\u00f3").replace(/&uacute;/g, "\u00fa").replace(/&Aacute;/g, "\u00c1").replace(/&Eacute;/g, "\u00c9").replace(/&Iacute;/g, "\u00cd").replace(/&Oacute;/g, "\u00d3").replace(/&Uacute;/g, "\u00da").replace(/&ntilde;/g, "\u00f1").replace(/&Ntilde;/g, "\u00d1").replace(/\&gt;/g, ">").replace(/\&lt;/g, "<").replace(/\&amp;/g, "&").replace(/\r/g, "") ).split("\n");

      // maintain only the lines that have information for the macro
      response = [];

      for(var i=0, l=tmpResponse.length; i<l; i++) {
        indexOfEqual = tmpResponse[i].indexOf("=");

        if(indexOfEqual !== -1) {
          var tmpSplitLine = lessonParser.split(tmpResponse[i]);
          for (var iT=0,lT=tmpSplitLine.length; iT<lT; iT++) {
            if ((tmpSplitLine[iT]) && (tmpSplitLine.length >1)) {
              if ((babel[tmpSplitLine[iT][0]] === "id") || (babel[tmpSplitLine[iT][0]] === "type")) {
                response.push(tmpSplitLine);
              }
            }
          }
        }
      }

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
               (((babelResp === "fill") || (babelResp === "color") || (babelResp === "border") || (babelResp === "arrow")) && (respText[j][1].charAt(0) !== "(")) ||
               ((babelResp === "file") && (respText[j][1].match(regExpImage))) ||
               ((babelResp !== "id") && (babel[respText[j][1]] !== undefined))
             ) {
            continue;
          }

          // is a text
          if (babelResp == "text") {
            // if the text is rtf must processing it diferent
            if (respText[j][1].match(/\{\\rtf1/)) {
              var textTemp = respText[j][1];

              //////////////////////////////////////////////////////////////////////////////////////////////////////////////
              var self = this;

              // function to replace expresions
              var funReplace = function(str, m1) {
                var tokens = tokenizer.tokenize(m1.replace(/\&squot;/g, "'"));

                for (var t=0, lt=tokens.length; t<lt; t++) {
                  if ((tokens[t].type == "identifier")  && (!reservedIdentifiers.match("-" + tokens[t].value + "-"))) {
                    tokens[t].value = self.name + "." + tokens[t].value;
                  }
                }

                var prefix = (str.match(/^\\expr/)) ? "\\expr " : "\\decimals ";

                return prefix + tokenizer.flatTokens(tokens);
              }
              //////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
                  if ((tmpTokens[tt].type === "identifier") && (!reservedIdentifiers.match("-" + tmpTokens[tt].value + "-"))) {
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
                if ((tmpTokens[t].type === "identifier") && (!reservedIdentifiers.match("-" + tmpTokens[t].value + "-"))) {
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

      // flat the expresions to obtain a string
      for (var i=0, l=response.length; i<l; i++) {
        if (response[i][0]) {
          tempResp = "";
          isGraphic = false;

          for (var j=0, k=response[i].length; j<k; j++) {

            // if is a graphic object, add the corresponding space
            if (babel[response[i][j][0]] === "type") {
              tempResp = "espacio='" + this.spaceID + "' ";
              isGraphic = true;
            }

            tempResp = tempResp + response[i][j][0] + "='" + response[i][j][1] + "' ";
          }

          response[i] = tempResp;

          // build and add the graphic elements to the space
          if (isGraphic) {
            //agregar algo mas para indicar que se viene de un macro
            this.graphics.push( lessonParser.parseGraphic(response[i], this.abs_coord, this.background, this.inirot) );
          }
          // build and add the axiliaries to the scene
          else {
            lessonParser.parseAuxiliar(response[i]);
          }
        }
      }
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Macro, descartesJS.Graphic);

  /**
   * Update the macro
   */
  descartesJS.Macro.prototype.update = function() {
    expr = this.evaluator.eval(this.inipos);
    this.iniPosX = expr[0][0];
    this.iniPosY = expr[0][1];
  }

  /**
   * Auxiliary function for draw a macro
   * @param {CanvasRenderingContext2D} ctx rendering context on which the macro is drawn
   */
  descartesJS.Macro.prototype.drawAux = function(ctx) {
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

  return descartesJS;
})(descartesJS || {}, babel);
