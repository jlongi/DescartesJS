/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   *
   * @constructor 
   */
  descartesJS.RTFTokenizer = function() { };
  
  /**
   * 
   */
  descartesJS.RTFTokenizer.prototype.tokenize = function(input) {
//     console.log(input);
    if (input) {
      input = input.replace(/(\\\w+)(\\u\d+)/g, "$1 $2");

      input = input.replace(/\\u(\d+) /g, function(str, m1){ return String.fromCharCode(parseInt(m1)); });
      
      // se escapan las llaves con caracteres no visibles, para evitar confusion con las llaves no escapadas
      // input = input.replace(/\\{/g, String.fromCharCode(10003));
      // input = input.replace(/\\}/g, String.fromCharCode(10005));

      // se cambian las llaves escapadas para que no se confundan con las llaves que abren y cierran bloques
      input = input.replace(/\\{/g, String.fromCharCode(0));
      input = input.replace(/\\}/g, String.fromCharCode(1));

      // input = input.replace(/\'/g, "&squot;");
      input = input.replace(/&squot;/g, "'");
      input = input.replace(/&amp;/g, "&");
      input = input.replace(/&lt;/g, "<");
      input = input.replace(/&gt;/g, ">");
    }

    var tokens = [];
    var str = input;
    var pos = 0;
    var blockNumber = 0;
    var val;
    var exit;
    var controlWord;
    var indexOfOpenCurlyBracket;
    var indexOfCloseCurlyBracket;
    var indexOfBackSlach;
    var max;
    var displace;
    
    var addToken = function(type, value, size) {
      tokens.push({ type: type, value: value });
      str = str.slice(size);
      pos += size;
    }

    while ((input) && (pos < input.length)) {
      exit = pos;

      // llave que abre
      if (str.charAt(0) == "{") {
        blockNumber++;
        addToken("openBlock", blockNumber, 1);
        continue;
      }

      // llave que cierra
      if (str.charAt(0) == "}") {
        addToken("closeBlock", blockNumber, 1);
        blockNumber--;
        if (str == "") { pos = input.length; }
        continue;
      }
     
      // una secuancia de control de RTF
      // de la forma \rtfControlWord\ entre diagonales
      val = str.match(/^\\([\w\*]*)\\/);
      if ((val) && (val[1])) {
        controlWord = val[1];
        addToken("controlWord", controlWord, controlWord.length+1);
        pos = pos - 1;
        continue;
      }
      // de la forma \rtfControlWord una diagonal al inicio y un espacio en blanco al final
      val = str.match(/^\\(\w*)\s/);
      if ((val) && (val[1])) {
        controlWord = val[1];
        addToken("controlWord", controlWord, controlWord.length+2);
//         pos = pos - 1;
        continue;
      }
      // de la forma \rtfControlWord{ una diagonal al inicio y una llave al final
      val = str.match(/^\\(\w*)\{/);
      if ((val) && (val[1])) {
        controlWord = val[1];
        addToken("controlWord", controlWord, controlWord.length+1);
        pos = pos - 1;
        continue;
      }
      // de la forma \rtfControlWord} una diagonal al inico y una llave al final
      val = str.match(/^\\(\w*)\}/);
      if ((val) && (val[1])) {
        controlWord = val[1];
        addToken("controlWord", controlWord, controlWord.length+1);
        pos = pos - 1;
        continue;
      }
      // de la forma \rtfControlWord;\ una diagonal al inico y un punto y coma con una diagonal al final
      val = str.match(/^\\(\w*)\;\\/);
      if ((val) && (val[1])) {
        controlWord = val[1];
        addToken("controlWord", controlWord, controlWord.length+2);
        pos = pos - 1;
        continue;
      }
      // de la forma \rtfControlWord;} una diagonal al inico y un punto y coma con una llave que cierra al final
      val = str.match(/^\\(\w*)\;\}/);
      if ((val) && (val[1])) {
        controlWord = val[1];
        addToken("controlWord", controlWord, controlWord.length+2);
        pos = pos - 1;
        continue;
      }
      // de la forma \rtfControlWord una diagonal al inicio y el documento se termino
      val = str.match(/^\\(\w*)/);
      if ((val) && (val[1])) {
        controlWord = val[1];
        addToken("controlWord", controlWord, controlWord.length+1);
        pos = input.length;
        continue;
      }      
      
      if ( (str.charAt(0) != "{") && (str.charAt(0) != "}") && (str.charAt(0) != "\\") ) {
        indexOfOpenCurlyBracket = str.indexOf("{");
        indexOfCloseCurlyBracket = str.indexOf("}");
        indexOfBackSlach = str.indexOf("\\");

        max = str.length;
        indexOfOpenCurlyBracket = (indexOfOpenCurlyBracket == -1) ? (max+1) : indexOfOpenCurlyBracket;
        indexOfCloseCurlyBracket = (indexOfCloseCurlyBracket == -1) ? (max+1) : indexOfCloseCurlyBracket;
        indexOfBackSlach = (indexOfBackSlach == -1) ? (max+1) : indexOfBackSlach;

        displace = Math.min(indexOfOpenCurlyBracket, indexOfCloseCurlyBracket, indexOfBackSlach);
      
        if ( (displace != -1) && (displace != 0) ) {
          addToken("text", (str.substring(0, displace)).replace(String.fromCharCode(0), "{").replace(String.fromCharCode(1), "}"), displace);
          if (str == "") { 
            pos = input.length;
          }
          continue;
        }
        else {
          addToken("text", str.replace(String.fromCharCode(0), "{").replace(String.fromCharCode(1), "}"), str.length+1)
          pos = input.length;
          continue;
        }        
      }
      
      if (exit == pos){
        console.log("Error, simbolo no conocido: <<["+str+"]>>" );
        return;
      }

    }

    return tokens;
  }

  return descartesJS;
})(descartesJS || {});
