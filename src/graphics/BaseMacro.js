/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;

  const regExpImage = /[\w\.\-//]*(\.png|\.jpg|\.gif|\.svg|\.webp)/gi;

  /**
   * 
   */
  function tokenizeAndPrefix(tokens, macroName, extra_ids="") {
    for (let tokens_i of tokens) {
      if (
        ((tokens_i.type === "identifier") && (!(descartesJS.reservedIds+extra_ids).match(`-${tokens_i.value}-`))) ||
        (tokens_i.value === "R") ||
        (tokens_i.value === "G") ||
        (tokens_i.value === "B")
      ) {
        tokens_i.value = `${macroName}.${tokens_i.value}`;
      }
    }
    return tokens;
  }

  /**
   * 
   */
  function funReplaceRTFExpr(str, m1, tokenizer, macroName) {
    let tokens = tokenizer.tokenize(m1.replace(/\&squot;/g, "'"));
    tokens = tokenizeAndPrefix(tokens, macroName);

    return (((/^\\expr/).test(str)) ? "\\expr " : "\\decimals ") + tokenizer.flatTokens(tokens);
  }

  class BaseMacro extends descartesJS.Graphic {
    /**
     * Constructor base para Macros 2D y 3D.
     */
    constructor(parent, values, graphicParserMethod, graphicTypeRegExp) {
      super(parent, values);

      self = this;
      self.hasExpresion = self.hasExpresion || false;

      self.graphics = [];

      // assign the values to replace the defaults values of the object
      Object.assign(self, values);

      self.hasExpresion = (self.expresion !== undefined);

      // if the expression is empty, don't do anything
      if (!self.hasExpresion) {
        return;
      }

      // if the macro name was not specified as a string, then adds single quotes to turn it into string
      if (!(String(self.expresion).charAt(0) === "'")) {
        self.expresion = `'${self.expresion}'`;
      }
      self.expresion = self.evaluator.parser.parse(self.expresion);

      const filename = self.evaluator.eval(self.expresion);
      let response;

      if (filename) {
        // the macro is embedded in the webpage
        let macroElement = document.getElementById(filename);

        if ((macroElement) && (macroElement.type === "descartes/macro")) {
          response = macroElement.text;
        }
        // the macro is in an external file
        else {
          response = descartesJS.openFile(filename);
        }
      }

      // if it was possible to read the macro
      if (response) {
        let tmpResponse = (descartesJS.convertHTMLEntities(response)).replace(/\r/g, "").split("\n");

        // maintain only the lines that have information for the macro
        response = [];

        let lessonParser = parent.lessonParser;
        let tokenizer = new descartesJS.Tokenizer();
        let tmpSplitLine;

        for (let tmpResponse_i of tmpResponse) {
          if (tmpResponse_i.includes("=")) {
            tmpSplitLine = lessonParser.split(tmpResponse_i);

            for (let tmpSplitLine_i of tmpSplitLine) {
              if ((tmpSplitLine_i) && (tmpSplitLine.length >1)) {
                if ((babel[tmpSplitLine_i[0]] === "id") || (babel[tmpSplitLine_i[0]] === "type")) {
                  response.push(tmpSplitLine);
                  break;
                }
              }
            }
          }
        }

        let respText;
        let isID;
        let isSurface;
        let propName;
        let propValue;
        let babelResp;
        let dotIndex;
        let tmpTokensRespText;
        let tmpTokens;
        let tmpTokensArray;

        // Process and add prefix to expressions
        for (let i=0, l=response.length; i<l; i++) {
          respText = response[i] || [];

          isID = ((respText) && (respText[0]) && (respText[0][0] === "id"));
          isSurface = false; // Only for 3D

          for (let j=0, k=respText.length; j<k; j++) {
            propName  = respText[j][0];
            propValue = respText[j][1];

            // if the parameters have a dot
            dotIndex = propName.indexOf(".");
            if ((dotIndex !== -1) && (!isID)) {
              babelResp = babel[propName.substring(dotIndex + 1)];
              respText[j][0] = `${self.name}.${propName}`;
            }
            else {
              babelResp = babel[propName];
            }

            if ((babelResp === "type") && (babel[propValue] === "surface")) {
              isSurface = true;
            }

            // parameters exceptions, do not add prefix
            if (graphicParserMethod.includes("3D")) {
              if (
                (babelResp === "font") ||
                (babelResp === "font_family") ||
                (((babelResp === "fill") || (babelResp === "color") || (babelResp === "backcolor") || (babelResp === "arrow")) && (respText[j][1].charAt(0) !== "(")) ||
                ((babelResp === "file") && (respText[j][1].match(regExpImage))) ||
                ((babelResp !== "id") && (babel[respText[j][1]] !== undefined))
              ) {
                if ((babelResp !== "width") && (babelResp !== "height") && (babelResp !== "length")) {
                  continue;
                }
              }
            }
            else {
              if (
                (babelResp === "font") ||
                (babelResp === "font_family") ||
                (((babelResp === "fill") || (babelResp === "color") || (babelResp === "border") || (babelResp === "arrow")) && (respText[j][1].charAt(0) !== "(")) ||
                ((babelResp === "file") && (respText[j][1].match(regExpImage))) ||
                ((babelResp !== "id") && (babel[respText[j][1]] !== undefined))
              ) {
                if (babelResp !== "radius") {
                  continue;
                }
              }
            }

            if (isSurface && babelResp === "expresion") {
              let splitExp = respText[j][1].split(" ");
              let new_exp = "";

              for (let split_i=0, split_l=splitExp.length; split_i<split_l; split_i++) {
                let tmpTokensArray = splitExp[split_i].replace(/\&squot;/g, "'").split(";");

                for (let tmpI=0, tmpL=tmpTokensArray.length; tmpI<tmpL; tmpI++) {
                  tmpTokens = tokenizer.tokenize(tmpTokensArray[tmpI].replace(/\\n/g, ";"));

                  tmpTokens = tokenizeAndPrefix(tmpTokens, self.name, ((graphicParserMethod.includes("3D"))?'-x-y-z-u-v-':'')
                  );

                  tmpTokensArray[tmpI] = tokenizer.flatTokens(tmpTokens); 
                }

                new_exp += tmpTokensArray.join(";") + " ";
              }

              respText[j][1] = new_exp;
              continue;
            }

            // is a text
            if (babelResp === "text") {
              // if the text is rtf must processing it different
              if ((/\{\\rtf1/).test(propValue)) {
                propValue = propValue
                  .replace(/\\expr\s*([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.'\+\-]*)/gi, (str, m1) => funReplaceRTFExpr(str, m1, tokenizer, self.name))
                  .replace(/\\decimals\s*([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.'\+\-]*)/gi, (str, m1) => funReplaceRTFExpr(str, m1, tokenizer, self.name));
              }
              // simple text
              else {
                tmpTokensRespText = lessonParser.parseText(propValue).txtEleMacros;

                for (let ttrt=0, lttrt=tmpTokensRespText.length; ttrt<lttrt; ttrt++) {
                  tmpTokens = tokenizer.tokenize(tmpTokensRespText[ttrt].replace(/\&squot;/g, "'"));

                  tmpTokens = tokenizeAndPrefix(tmpTokens, self.name);

                  // remove quotes and add square brackets
                  tmpTokensRespText[ttrt] = (tokenizer.flatTokens(tmpTokens)).replace(/&squot;/g, "'").replace(/'\+\(/g, "[").replace(/\)\+'/g, "]");

                  tmpTokensRespText[ttrt] = tmpTokensRespText[ttrt].slice(1, -1);
                }

                propValue = tmpTokensRespText.join("");
              }
            }
            // the token is not a text
            else {
              tmpTokensArray = propValue.replace(/\&squot;/g, "'").split(";");

              for (let tmpI=0, tmpL=tmpTokensArray.length; tmpI<tmpL; tmpI++) {
                tmpTokens = tokenizer.tokenize(tmpTokensArray[tmpI].replace(/\\n/g, ";"));

                tmpTokens = tokenizeAndPrefix(tmpTokens, self.name, ((graphicParserMethod.includes("3D"))?"-Euler-":""));

                tmpTokensArray[tmpI] = tokenizer.flatTokens(tmpTokens);
              }
              propValue = tmpTokensArray.join(";");
            }

            respText[j][1] = propValue;
          }
        }

        let tempResp;
        let isGraphic;

        // flat the expressions to obtain a string
        for (let i=0, l=response.length; i<l; i++) {
          if (response[i][0]) {
            tempResp = "";
            isGraphic = false;

            for (let j=0, k=response[i].length; j<k; j++) {
              // if the object has a type and is of the graphic type, then is a graphic object
              if ((babel[response[i][j][0]] === "type") && (graphicTypeRegExp.includes(`-${babel[response[i][j][1]]}-`))) {
                isGraphic = true;
              }
              tempResp += `${response[i][j][0]}='${response[i][j][1]}' `;
            }

            response[i] = tempResp + ((isGraphic) ? ` space='${self.spaceID}'` : "");

            // build and add the graphic elements to the space
            if (isGraphic) {
              self.graphics.push(lessonParser[graphicParserMethod](response[i], self.abs_coord, self.background, self.inirot));
            }
            // build and add the auxiliaries to the scene
            else {
              lessonParser.parseAuxiliar(response[i]);
            }
          }
        }
      }
    }
  }

  descartesJS.BaseMacro = BaseMacro;
  return descartesJS;
})(descartesJS || {});
