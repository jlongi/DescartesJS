/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var inputInicial;
  var tokens ;
  var exit;
  var pos;
  var val;
  var str;
  var inc;
  var count;
  var lastTokenType;

  var whiteSpaceRegExp = /^\s+/;
  var identifierRegExp = /^[a-zA-Z_\u00C0-\u021B\u0391-\u03C9]+[a-zA-Z_0-9\u00C0-\u021B\u0391-\u03C9]*([.]*[0-9a-zA-Z_\u00C0-\u021B\u0391-\u03C9]+[0-9]*)*/;
  var numberRegExp = /^[0-9]+[.][0-9]+|^[.][0-9]+|^[0-9]+/;
  var compOperatorRegExp = /^==|^!=|^<=|^<|^>=|^>|^#/;
  var boolOperatorRegExp = /^\!|^\~|^\&\&|^\&|^\|\||^\|/;
  var asignRegExp = /^=|^:=/;
  var conditionalRegExp = /^[\?\:]/;
  var operatorRegExp = /^[\+\-\*\/\%\^\u2212\u00b7\u00D7\u00F7]/;
  var squareBracketRegExp = /^\[|^\]/;
  var parenthesesRegExp = /^\(|^\)/;
  var separatorRegExp = /^,/;
  var finalOfExpressionRegExp = /^;/;
  var pipeStringDelimiterRegExp = /\|/g;
  var pipeAsteriskLeftRegExp = /\|\*/g;
  var pipeAsteriskRightRegExp = /\*\|/g;

  /**
   * Descartes tokenizer
   * @constructor
   */
  descartesJS.Tokenizer = function() {  };

  descartesJS.Tokenizer.prototype.tokenize = function(input) {
    inputInicial = input;

    if (input) {
      var commentIndex = input.indexOf("//");
      if ((commentIndex >= 0) && (input[commentIndex-1] !== ":")) {
        input = input.substring(0, commentIndex);
      }

      // change the values in UTF of the form \u##
      input = input.replace(/\\u(\S+) /g, function(str, m1){
        if (parseInt(m1, 16) !== 39) {
          return String.fromCharCode(parseInt(m1, 16));
        }
        return str; 
      });

      // superindex numbers codified with &sup#;
      input = input.replace(/\&sup(.+);/g, "^ $1 ");

      // single quotation marks
      input = input.replace(/&squot;/g, "'");

      // replace the pipes used like string marks
      if (input.match(/\=\|\*/g)) {
        input = input.replace(pipeAsteriskLeftRegExp, "'").replace(pipeAsteriskRightRegExp, "'");
      }
      // replace the pipes used like string marks
      if (input.match(/\=\|/g)) {
        input = input.replace(pipeStringDelimiterRegExp, "'");
      }

      var inputTrimed = input.trim();
      if ((inputTrimed.charAt(0) == "|") && (inputTrimed.charAt(inputTrimed.length-1) == "|")) {
        input = inputTrimed.replace(pipeStringDelimiterRegExp, "'");
      }
    }

    tokens = [];
    exit = false;
    pos = 0;
    str = input;
    count = 0;
    lastTokenType = "";

    /**
     * Auxiliar function to add tokens and move the character position
     * @param {String} type the type of the token
     * @param {String} value the value of the token
     * @param {Number} size the length of the value of the token
     */
    function addToken(type, value, size) {
      tokens.push({ type: type, value: value });
      str = str.slice(size);
      pos += size;
      count++;
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
            console.info(">Error, unknown symbol: ["+str+"], in the string 《" + inputInicial + "》" );
            return;
          }
        }

        val = str.substring(1, inc);
        addToken("string", val, val.length+2);
        continue;
      }

      // white spaces
      val = str.match(whiteSpaceRegExp);
      if (val) {
        str = str.slice(val[0].length);
        pos += val[0].length;
        count++;
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
        var tempVal = val[0];

        if (tempVal == "#") { tempVal = "!="; }
          addToken("compOperator", tempVal, val[0].length);
        continue;
      }

      // booleans
      val = str.match(boolOperatorRegExp);
      if (val) {
        var tempVal = val[0];
        if (tempVal == "||") { tempVal = "|"; }
        else if (tempVal == "&&") { tempVal = "&"; }
        else if (tempVal == "~") { tempVal = "!"; }

        addToken("boolOperator", tempVal, val[0].length);
        continue;
      }

      // equal (asign)
      val = str.match(asignRegExp);
      if ((val) && !(str.match( /^==/))) {
        addToken("asign", val[0], val[0].length);
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
        addToken("final_of_expresion", val[0], val[0].length);
        continue;
      }

      if (exit == pos){
        descartesJS.DEBUG.setError(descartesJS.DEBUG.EXPRESSION, inputInicial);
        // console.info("Error, simbolo no conocido: ["+str+"], en la cadena 《" + inputInicial + "》" );
        // console.info("Error: en la cadena 《 " + inputInicial + " 》");
        return;
      }
    }

    return tokens;
  }

  var result;
  var exclude = /rnd|pi|e|Infinity|-Infinity|sqr|sqrt|raíz|exp|log|log10|abs|ent|sgn|ind|sin|sen|cos|tan|cot|sec|csc|sinh|senh|cosh|tanh|coth|sech|csch|asin|asen|acos|atan|min|max/;

  /**
   * Auxiliary funtion for the macros that take a list of tokens and get a string representation
   * @param {Array<Object>} tokens the tokens to be flat
   * @return {String} return a string representation of the tokens
   */
  descartesJS.Tokenizer.prototype.flatTokens = function(tokens, prefix) {
    tokens = tokens || [];
    prefix = prefix || "";

    result = "";

    for (var i=0, l=tokens.length; i<l; i++) {
      if (tokens[i].type == "string") {
        result = result + "&squot;" + tokens[i].value + "&squot;";
      }
      else if ((tokens[i].type == "identifier") && (!tokens[i].value.match(exclude))) {
        result = result + prefix + tokens[i].value;
      }
      else {
        result = result + tokens[i].value;
      }
    }

    return result;
  }

  return descartesJS;
})(descartesJS || {});
