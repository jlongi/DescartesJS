/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un parser de elementos principales de una leccion de descartes
   * @constructor 
   */
  descartesJS.Tokenizer = function() {  };
  
  descartesJS.Tokenizer.prototype.tokenize = function(input) {
    var inputInicial = input;
    if (input) {
      // cambio de valores en utf de la forma \u##
      input = input.replace(/\\u(\S+) /g, function(str, m1){ return String.fromCharCode(parseInt(m1, 16)); });

      // caso para cuando los numeros aparecen como superindices codificados como &sup#;
      input = input.replace(/\&sup(.+);/g, "^$1 ");
      // comillas
      input = input.replace(/&squot;/g, "'");
      
      // pipes como cadenas
      if (input.match(/\=\|\*/g)) {
        input = input.replace("|*", "'", "g").replace("*|", "'", "g");
      }
    }
    
    var tokens = [];
    var exit = false;
    var pos = 0;
    var val;
    var str = input;
    var inc;
    var count = 0;

    var lastTokenType = "";
       
    /** 
     * funcion axiliar para agregar un toke a la lista de tokes y recorrer la posicion en en la cadena a analizar
     */
    var addToken = function(type, value, size) {
      tokens.push({ type: type, value: value });
      str = str.slice(size);
      pos += size;
      count++;
      lastTokenType = type;
    }

    while ((input) && (pos < input.length)) {
      exit = pos;
      
      // cadena
      if (str[0] == "'") {
        inc = 1;
        while (str[inc] != "'") {
          if (inc < str.length) {
            inc++;
          } else {
            console.log(">Error, simbolo no conocido: ["+str+"], en la cadena <<" + inputInicial + ">>" );
            return;
          }
        }
        
        val = str.substring(1, inc);
        addToken("string", val, val.length+2);
        continue;
      }
      
      // espacios en blanco
      val = str.match( /^\s+/ );
      if (val) {
        str = str.slice(val[0].length);
        pos += val[0].length;
        count++;
        continue;
      }
      
      // identificador
//       val = str.match( /^[a-zA-Z_ÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùÄËÏÖÜäëïöüÂÊÎÔÛâêîôûŽ]+[a-zA-Z_0-9ÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùÄËÏÖÜäëïöüÂÊÎÔÛâêîôûŽ]*([.]*[a-zA-Z_ÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùÄËÏÖÜäëïöüÂÊÎÔÛâêîôûŽ]+[0-9]*)*/ );
//       val = str.match( /^[a-zA-Z_\u00C0-\u021B]+[a-zA-Z_0-9\u00C0-\u021B]*([.]*[a-zA-Z_\u00C0-\u021B]+[0-9]*)*/ );
      val = str.match( /^[a-zA-Z_\u00C0-\u021B]+[a-zA-Z_0-9\u00C0-\u021B]*([.]*[0-9a-zA-Z_\u00C0-\u021B]+[0-9]*)*/ );
      if (val) {
        // expresiones de la forma 2pi se convierten en 2*pi, para esto es necesario saber que el token anterior a un identificador es un numero
        if (lastTokenType === "number") {
          tokens.push({ type: "operator", value: "*" });
        }
        addToken("identifier", val[0], val[0].length);
        continue;
      }
    
      // numero
      val = str.match( /^[0-9]+[.][0-9]+|^[.][0-9]+|^[0-9]+/ );
      if (val) {
        addToken("number", val[0], val[0].length);
        
//         // si el token es un numero seguido de un identificador hay que agregar una operacion de multiplicacion entre el numero y el identificador
//         if ( str.match( /^[a-zA-Z_ÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùÄËÏÖÜäëïöüÂÊÎÔÛâêîôûŽ]+[a-zA-Z_0-9ÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùÄËÏÖÜäëïöüÂÊÎÔÛâêîôûŽ]*([.]*[a-zA-Z_ÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùÄËÏÖÜäëïöüÂÊÎÔÛâêîôûŽ]+[0-9]*)*/ ) ) {
//           addToken("operator", "*", 0);
//         }
        
        continue;
      }
    
      // comparacion
      val = str.match( /^==|^!=|^<=|^<|^>=|^>|^#/ );
      if (val) {
        var tempVal = val[0];

        if (tempVal == "#") { tempVal = "!="; }     
          addToken("compOperator", tempVal, val[0].length);
        continue;
      }
        
      // booleanos
      val = str.match( /^\!|^\~|^\&\&|^\&|^\|\||^\|/ );
      if (val) {
        var tempVal = val[0];
        if (tempVal == "||") { tempVal = "|"; } 
        else if (tempVal == "&&") { tempVal = "&"; }
        else if (tempVal == "~") { tempVal = "!"; }

        addToken("boolOperator", tempVal, val[0].length);
        continue;
      }

      // un igual
      val = str.match( /^=/ );
      if ((val) && !(str.match( /^==/))) {
        addToken("asign", val[0], val[0].length);
        continue;
      }

      // condicional
      val = str.match( /^[\?\:]/ );
      if (val) {
        addToken("conditional", val[0], val[0].length);
        continue;
      }
    
      // operador
      val = str.match( /^[\+\-\*\/\%\^]/ );
      if (val) {
        addToken("operator", val[0], val[0].length);
        continue;
      }

      // corchetes
      val = str.match( /^\[|^\]/ );
      if (val) {
        addToken("square_bracket", val[0], val[0].length);
        continue;
      }
    
      // parentesis
      val = str.match( /^\(|^\)/ );
      if (val) {
        addToken("parentheses", val[0], val[0].length);
        continue;
      }
    
      // separador
      val = str.match( /^,/ );
      if (val) {
        addToken("separator", val[0], val[0].length);
        continue;
      }

      // final de la expresion
      val = str.match( /^;/ );
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
   * 
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
