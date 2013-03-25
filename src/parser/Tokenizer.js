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
  var identifierRegExp = /^[a-zA-Z_\u00C0-\u021B]+[a-zA-Z_0-9\u00C0-\u021B]*([.]*[0-9a-zA-Z_\u00C0-\u021B]+[0-9]*)*/;
  var numberRegExp = /^[0-9]+[.][0-9]+|^[.][0-9]+|^[0-9]+/;
  var compOperatorRegExp = /^==|^!=|^<=|^<|^>=|^>|^#/;
  var boolOperatorRegExp = /^\!|^\~|^\&\&|^\&|^\|\||^\|/;
  var asignRegExp = /^=/;
  var conditionalRegExp = /^[\?\:]/;
  var operatorRegExp = /^[\+\-\*\/\%\^]/;
  var squareBracketRegExp = /^\[|^\]/;
  var parenthesesRegExp = /^\(|^\)/;
  var separatorRegExp = /^,/;
  var finalOfExpressionRegExp = /^;/;

  /**
   * Descartes tokenizer
   * @constructor 
   */
  descartesJS.Tokenizer = function() {  };
  
  descartesJS.Tokenizer.prototype.tokenize = function(input) {
    inputInicial = input;

    if (input) {
      // change the values in UTF of the form \u##
      input = input.replace(/\\u(\S+) /g, function(str, m1){ return String.fromCharCode(parseInt(m1, 16)); });

      // superindex numbers codified with &sup#;
      input = input.replace(/\&sup(.+);/g, "^$1 ");

      // single quotation marks
      input = input.replace(/&squot;/g, "'");
      
      // replace the pipes used like string marks
      if (input.match(/\=\|\*/g)) {
        input = input.replace("|*", "'", "g").replace("*|", "'", "g");
      }
      // replace the pipes used like string marks
      if (input.match(/\=\|/g)) {
        input = input.replace("|", "'", "g");
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
          } else {
            console.log(">Error, unknown symbol: ["+str+"], in the string <<" + inputInicial + ">>" );
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
    
      // operator
      val = str.match(operatorRegExp);
      if (val) {
        addToken("operator", val[0], val[0].length);
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
        addToken("parentheses", val[0], val[0].length);
        continue;
      }

      // separator
      val = str.match(separatorRegExp);
      if (val) {
        addToken("separator", val[0], val[0].length);
        continue;
      }

      // final of expression
      val = str.match(finalOfExpressionRegExp);
      if (val) {
        addToken("final_of_expresion", val[0], val[0].length);
        continue;
      }

      if (exit == pos){
        console.log("Error, simbolo no conocido: ["+str+"], en la cadena <<" + inputInicial + ">>" );
        return;
      }
    }
  
    return tokens;
  }
  
  /**
   * Auxiliary funtion for the macros that take a list of tokens and get a string representation
   * @param {Array<Object>} tokens the tokesn to be flat
   * @return {String} return a string representation of the tokens
   */
  descartesJS.Tokenizer.prototype.flatTokens = function(tokens) {
    tokens = tokens || [];
    var result = "";
    
    for (var i=0, l=tokens.length; i<l; i++) {
      if (tokens[i].type == "string") {
        result = result + "&squot;" + tokens[i].value + "&squot;";
      } else {
        result = result + tokens[i].value;
      }
    }
    
    return result;
  }

  return descartesJS;
})(descartesJS || {});