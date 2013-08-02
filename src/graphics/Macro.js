/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS, babel) {
  if (descartesJS.loadLib) { return descartesJS; }

  var reservedIdentifiers = "-rnd-pi-e-sqr-sqrt-raíz-exp-log-log10-abs-ent-sgn-ind-sin-sen-cos-tan-cot-sec-csc-sinh-senh-cosh-tanh-coth-sech-csch-asin-asen-acos-atan-min-max-";

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
    this.expresion = undefined;

    /**
     * the macro rotation
     * type {Node}
     * @private
     */
    this.inirot = parent.evaluator.parser.parse("0");

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    // traverse the values to replace the defaults values of the object
    for (var propName in values) {
      // verify the own properties of the object
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }

    this.graphics = [];
    
    var lessonParser = parent.lessonParser;
    var tokenizer = new descartesJS.Tokenizer();
    
    // if the expression is empty
    if (this.expresion == undefined) {
      return;
    }

    
    // if the macro name was not specified as a string, then adds single quotes to turn it into string
    if ( !(this.expresion.charAt(0) === "'")) {
      this.expresion = "'" + this.expresion + "'";
    }
    this.expresion = this.evaluator.parser.parse(this.expresion);

    var filename = this.evaluator.evalExpression(this.expresion)
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
      tmpResponse = ( response.replace(/&aacute;/g, "á").replace(/&eacute;/g, "é").replace(/&iacute;/g, "í").replace(/&oacute;/g, "ó").replace(/&uacute;/g, "ú").replace(/&Aacute;/g, "Á").replace(/&Eacute;/g, "É").replace(/&Iacute;/g, "Í").replace(/&Oacute;/g, "Ó").replace(/&Uacute;/g, "Ú").replace(/&ntilde;/g, "ñ").replace(/&Ntilde;/g, "Ñ").replace(/\&gt;/g, ">").replace(/\&lt;/g, "<").replace(/\&amp;/g, "&").replace(/\r/g, "") ).split("\n");

      // maintain only the lines that have information for the macro
      response = [];

      for(var i=0, l=tmpResponse.length; i<l; i++) {
        indexOfEqual = tmpResponse[i].indexOf("=");

        if(indexOfEqual !== -1) {
          tmpIniti = tmpResponse[i].substring(0, indexOfEqual);
        
          if (babel[tmpIniti] === "id" || babel[tmpIniti] === "type") {
            response.push( lessonParser.split( tmpResponse[i] ) );
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
          // if the parameters that have a dot
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
               (((babelResp === "fill") || (babelResp === "color") || (babelResp === "arrow")) && (respText[j][1].charAt(0) !== "(")) ||
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

                  // // if the identifier has a dot (example vector.long)
                  // else if ((tokens[t].type == "identifier") && ((dotIndex = (tokens[t].value).indexOf(".")) != -1)) {
                  //   if (idsMacro.match("\\|" + tokens[t].value.substring(0, dotIndex) + "\\|")) {
                  //     tokens[t].value = self.name + "." + tokens[t].value;
                  //   }
                  // }
                }
                
                var prefix = (str.match(/^\\expr/)) ? "\\expr " : "\\decimals ";

                return prefix + tokenizer.flatTokens(tokens);
              }
              //////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
              textTemp = textTemp.replace(/\\expr ([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.']*)/gi, funReplace);
              textTemp = textTemp.replace(/\\decimals ([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.']*)/gi, funReplace);
              
              respText[j][1] = textTemp;
            }
            // simple text
            else {
              tmpTokensRespText = lessonParser.parseText(respText[j][1]).textElementsMacros;

              for (var ttrt=0, lttrt=tmpTokensRespText.length; ttrt<lttrt; ttrt++) {
                tmpTokens = tokenizer.tokenize(tmpTokensRespText[ttrt].replace(/\&squot;/g, "'"));

                for (var tt=0, ltt=tmpTokens.length; tt<ltt; tt++) {
                  // if ( (tmpTokens[tt].type == "identifier") && (idsMacro.match("\\|" + tmpTokens[tt].value + "\\|")) ) {
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
            tmpTokens = tokenizer.tokenize(respText[j][1]);

            for (var t=0, lt=tmpTokens.length; t<lt; t++) {

              if ((tmpTokens[t].type === "identifier") && (!reservedIdentifiers.match("-" + tmpTokens[t].value + "-"))) {
                tmpTokens[t].value = this.name + "." + tmpTokens[t].value;
              }

            }

            respText[j][1] = tokenizer.flatTokens(tmpTokens);
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
    if (this.inipos) {
      var expr = this.evaluator.evalExpression(this.inipos);
      this.iniPosX = expr[0][0];
      this.iniPosY = expr[0][1];
    }
  }
  
  /**
   * Auxiliary function for draw a macro
   * @param {CanvasRenderingContext2D} ctx rendering context on which the macro is drawn
   */
  descartesJS.Macro.prototype.drawAux = function(ctx) {
    for (var i=0, l=this.graphics.length; i<l; i++) {

      if (this.inipos) {
        if (this.graphics[i].abs_coord) {
          ctx.translate(this.iniPosX, this.iniPosY);
        } else {
          ctx.translate(this.iniPosX*this.space.scale, -this.iniPosY*this.space.scale);
        }
      }
      
      this.graphics[i].draw();

      // reset the transformations
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }      
  }

  return descartesJS;
})(descartesJS || {}, babel);