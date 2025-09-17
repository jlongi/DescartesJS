/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let initial_input;
  let tokens ;
  let exit;
  let pos;
  let val;
  let str;
  let inc;
  let lastTokenType;

  let whiteSpaceRegExp = /^\s+/;
  let identifierRegExp = /^[a-zA-Z_\u00C0-\u021B\u0391-\u03C9]+[a-zA-Z_0-9\u00C0-\u021B\u0391-\u03C9]*([.]*[0-9a-zA-Z_\u00C0-\u021B\u0391-\u03C9]+[0-9]*)*/;
  let numberRegExp = /^([0-9]+[.][0-9]+|[.][0-9]+|[0-9]+)/;  // num.num , .num , num
  let compOperatorRegExp = /^(==|!=|<=|<|>=|>|#)/;  // == , != , <= , < , >= , > , #
  let boolOperatorRegExp = /^(\!|\~|\&\&|\&|\|\||\|)/;  // ! , ~ , && , & , | , ||
  let assignRegExp = /^(=|:=)/;  // = , :=
  let conditionalRegExp = /^[\?\:]/;
  let operatorRegExp = /^[\+\-\*\/\%\^\u2212\u00b7\u00D7\u00F7]/;
  let squareBracketRegExp = /^(\[|\])/; // [ , ]
  let parenthesesRegExp = /^(\(|\))/;   // ( , )
  let separatorRegExp = /^,/;
  let finalOfExpressionRegExp = /^;/;
  let pipeStringDelimiterRegExp = /\|/g;
  let pipeAsteriskLeftRegExp = /\|\*/g;
  let pipeAsteriskRightRegExp = /\*\|/g;
  let commentRegExp = /^\/\//g;
  let httpRegExp = /:\/\//g;
  
  let result;
  let exclude = /rnd|pi|e|Infinity|-Infinity|sqr|sqrt|raíz|exp|log|log10|abs|ent|sgn|ind|sin|sen|cos|tan|cot|sec|csc|sinh|senh|cosh|tanh|coth|sech|csch|asin|asen|acos|atan|min|max/;

  /**
   * 
   */
  class Tokenizer {
    /**
     * Descartes tokenizer
     */
    constructor() { }

    /**
     * 
     */
    tokenize(input) {
      initial_input = input;

      if (input) {
        input = input
        // change the values in UTF of the form \u##
        .replace(/\\u(\S+) /g, (str, hex) => {
          if (parseInt(hex, 16) !== 39) {
            return String.fromCharCode(parseInt(hex, 16));
          }
          return str; 
        })
        // super index numbers codified with &sup#;
        .replace(/\&sup(.+?);/g, "^$1 ")
        // single quotation marks
        .replace(/&squot;/g, "'")
        // replace the variable rnd for the function random()
        .replace(/\brnd\b/g, "random()");

        // replace the pipes used like string marks
        if (input.match(/\=\|\*/g)) {
          input = input.replace(pipeAsteriskLeftRegExp, "'").replace(pipeAsteriskRightRegExp, "'");
        }
        // replace the pipes used like string marks
        if (input.match(/\=\|/g)) {
          input = input.replace(pipeStringDelimiterRegExp, "'");
        }

        let inputTrimmed = input.trim();
        if ((inputTrimmed[0] == "|") && (inputTrimmed[inputTrimmed.length-1] == "|")) {
          input = inputTrimmed.replace(pipeStringDelimiterRegExp, "'");
        }
      }

      tokens = [];
      exit = false;
      pos = 0;
      str = input;
      lastTokenType = "";

      /**
       * Auxiliary function to add tokens and move the character position
       * @param {String} type the type of the token
       * @param {String} value the value of the token
       * @param {Number} size the length of the value of the token
       */
      function addToken(type, value, size) {
        tokens.push({ type: type, value: value });
        str = str.slice(size);
        pos += size;
        lastTokenType = type;
      }

      while ((input) && (pos < input.length)) {
        exit = pos;

        // string
        if (str[0] == "'") {
          inc = 1;
          while (str[inc] != "'") {
            if (inc < str.length) {
              inc++;
            }
            else {
              // console.info(`>Error, unknown symbol: [${str}], in the string 《${initial_input}》`);
              return;
            }
          }

          val = str.substring(1, inc);
          addToken("string", val, val.length+2);
          continue;
        }

        // comments
        val = str.match(commentRegExp);
        if (val) {
          if (str.match(httpRegExp)) {
            continue;
          }
          else {
            pos = 2*input.length;
            break;
          }
        }

        // white spaces
        val = str.match(whiteSpaceRegExp);
        if (val) {
          str = str.slice(val[0].length);
          pos += val[0].length;
          continue;
        }

        // operator
        val = str.match(operatorRegExp);
        if (val) {
          val[0] = val[0].replace(/\u00F7/g, "/").replace(/\u2212/g, "-").replace(/\u00b7/g, "*").replace(/\u00D7/g, "*")
          addToken("operator", val[0], val[0].length);
          continue;
        }

        // identifier
        val = str.match(identifierRegExp);
        if (val) {
          // expression of the form 2pi change to 2*pi, so we need to know that the type of the last token is a number
          if (lastTokenType === "number") {
            // add a multiplication operator
            tokens.push({ type: "operator", value: "*" });
          }
          // add the identifier token
          addToken("identifier", val[0], val[0].length);
          continue;
        }

        // number
        val = str.match(numberRegExp);
        if (val) {
          addToken("number", val[0], val[0].length);
          continue;
        }

        // comparison
        val = str.match(compOperatorRegExp);
        if (val) {
          let tempVal = val[0];

          if (tempVal == "#") { 
            tempVal = "!="; 
          }
          addToken("compOperator", tempVal, val[0].length);
          continue;
        }

        // booleans
        val = str.match(boolOperatorRegExp);
        if (val) {
          let tempVal = val[0];
          if (tempVal == "||") { 
            tempVal = "|"; 
          }
          else if (tempVal == "&&") { 
            tempVal = "&"; 
          }
          else if (tempVal == "~") { 
            tempVal = "!"; 
          }

          addToken("boolOperator", tempVal, val[0].length);
          continue;
        }

        // equal (assign)
        val = str.match(assignRegExp);
        if ((val) && !((/^==/).test(str))) {
          addToken("assign", val[0], val[0].length);
          continue;
        }

        // conditional
        val = str.match(conditionalRegExp);
        if (val) {
          addToken("conditional", val[0], val[0].length);
          continue;
        }

        // square brackets
        val = str.match(squareBracketRegExp);
        if (val) {
          addToken("square_bracket", val[0], val[0].length);
          continue;
        }

        // parentheses
        val = str.match( parenthesesRegExp );
        if (val) {
          if ((val == "(") && (lastTokenType === "number")) {
            // add a multiplication operator
            tokens.push({ type: "operator", value: "*" });
          }

          addToken("parentheses", val[0], val[0].length);
          continue;
        }

        // separator
        val = str.match(separatorRegExp);
        if (val) {
          addToken("separator", val[0], val[0].length);
          continue;
        }

        // square
        if (str.charCodeAt(0) === 178) {
          // add a multiplication operator
          tokens.push({ type: "operator", value: "^" });

          // add the identifier token
          addToken("number", 2, 1);
          continue;
        }
        // cube
        if (str.charCodeAt(0) === 179) {
          // add a multiplication operator
          tokens.push({ type: "operator", value: "^" });

          // add the identifier token
          addToken("number", 3, 1);
          continue;
        }

        // final of expression
        val = str.match(finalOfExpressionRegExp);
        if (val) {
          addToken("final_of_expression", val[0], val[0].length);
          continue;
        }

        if (exit == pos){
          descartesJS.DEBUG.setError(descartesJS.DEBUG.EXPRESSION, initial_input);
          // console.info(`Error, símbolo no conocido: ${str}, en la cadena 《${initial_input}》`);
          // console.info(`Error: en la cadena 《${initial_input}》`);
          return;
        }
      }

      return tokens;
    }

    /**
     * Auxiliary function for the macros that take a list of tokens and get a string representation
     * @param {Array<Object>} tokens the tokens to be flat
     * @return {String} return a string representation of the tokens
     */
    flatTokens(tokens=[], prefix="") {
      result = "";

      for (let token of tokens) {
        if (token.type == "string") {
          result += `&squot;${token.value}&squot;`;
        }
        else if ((token.type == "identifier") && (!exclude.test(token.value))) {
          result += prefix + token.value;
        }
        else {
          result += token.value;
        }
      }

      return result;
    }
  }

  descartesJS.Tokenizer = Tokenizer;
  return descartesJS;
})(descartesJS || {});
