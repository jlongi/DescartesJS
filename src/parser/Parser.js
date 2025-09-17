/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  descartesJS.reservedIds = "-_-_NUM_MAX_ITE_ALG_-rnd-pi-π-e-Infinity-isTouch-esTáctil-device-dispositivo-screenOrientation-screenWidth-screenHeight-sqr-sqrt-raíz-exp-log-log10-abs-ent-sgn-ind-sin-sen-cos-tan-cot-sec-csc-sinh-senh-cosh-tanh-coth-sech-csch-asin-asen-acos-atan-atan2-floor-piso-ceil-techo-round-redondeo-trunc-truncamiento-min-max-_Trace_-_Print_-_Num_-isNumber-esNúmero-random-aleatorio-_Stop_Audios_-parent.set-parent.update-parent.exec-toFixed-_NumToStr_-_NumACadena_-charAt-_charAt_-_letraEn_-substring-_substring_-_subcadena_-strLength-_length_-_longitud_-indexOf-_indexOf_-índiceDe-lastIndexOf-replace-_replace_-_reemplazar_-toLowerCase-toUpperCase-trim-_Load_-_GetValues_-_GetMatrix_-_MatrixToStr_-_StrToMatrix_-_GetVector_-_VectorToStr_-_StrToVector_-_ExecStr_-_ExecBlock_-_Save_-_SaveSpace_-_Open_-_SaveState_-_OpenState_-_AnchoDeCadena_-_strWidth_-R-G-B-_Rojo_-_Red_-_Verde_-_Green_-_Azul_-_Blue_-DJS.typeof-DJS.squote-DJS.comma-DJS.w-DJS.h-";

  const parenthesesType = "parentheses";
  const squareBracketType = "square_bracket";
  const assignType = "assign";
  const compOperatorType = "compOperator";
  const identifierType = "identifier";
  const operatorType = "operator";
  const boolOperatorType = "boolOperator";
  const conditionalType = "conditional";
  const signType = "sign";
  const numberType = "number";
  const stringType = "string";

  let tokens;
  let lastNode;
  let node;
  let openParenthesis;
  let openSquareBracket;
  let openConditional;
  let tokens_i;
  let tokens_i_value;
  let tokens_i_type;
  let root;

  class Parser {
    /**
     * Descartes parser
     */
    constructor(evaluator) {
      this.evaluator = evaluator;

      this.tokenizer = new descartesJS.Tokenizer();
      this.vectors = {};
      this.matrices = {};
      this.variables = {};
      this.functions = {};
      this.definitions = {};

      this.registerDefaultValues();
      if (this.registerExternalValues) {
        this.registerExternalValues();
      }
    }
    
    /**
     * Function that parses a string
     * @param {String} input the input to parse
     * @param {Boolean} assignation identify if the input is treated like an assignation
     * @return {Node} return a parse tree from the parses input
     */
    parse(input, assignation) {
      tokens = this.tokenizer.tokenize(input);

      // tokens is undefined
      if (!tokens) {
        tokens = [];
      }
      lastNode = null;
      assignation = !assignation || false;

      openParenthesis = 0;
      openSquareBracket = 0;
      openConditional = 0;

      for (let i=0, l=tokens.length; i<l; i++) {
        tokens_i = tokens[i];
        tokens_i_value = tokens_i.value;
        tokens_i_type = tokens_i.type;

        ////////////////////////////////////////////////////////////////////////////////
        // verify if the variables exist
        ////////////////////////////////////////////////////////////////////////////////
        if (tokens_i_type === identifierType) {
          // the identifier is a function
          if ( tokens[i+1] && (tokens[i+1].type === parenthesesType) && (tokens[i+1].value === "(") ) {
            // check if the function exist, if not create an empty function with return value 0
            if (!this.functions.hasOwnProperty(tokens_i_value)) {
              this.functions[tokens_i_value] = () => { return 0; };
            }
          }
          // the identifier is a vector or a matrix
          else if ( tokens[i+1] && (tokens[i+1].type === squareBracketType) && (tokens[i+1].value === "[") ) {
            // vector
            if ( (tokens[i+3]) && (tokens[i+3].type === squareBracketType) && (tokens[i+3].value === "]") ) {
              // check if the vectoir exist, if not create an 3 lenght vector with zero values
              if (!this.vectors.hasOwnProperty(tokens_i_value)) {
                this.vectors[tokens_i_value] = [0,0,0];
              }
            }
            // matrix
            else {
              // check if the matrix exist, if not create an 3x3 matrix with zero values
              if (!this.matrices.hasOwnProperty(tokens_i_value)) {
                this.matrices[tokens_i_value] = [[0,0,0],[0,0,0],[0,0,0]];
              }
            }
          }
          // the identifier is a variable
          else {
            let scrollable = tokens_i_value.match(/(\w*)(\.mouse_x|\.mouse_y|\.mouse_pressed|\.mouse_clicked|\.clic_izquierdo)$/);
            if (scrollable) {
              this.variables[scrollable[1] + ".DJS_NO_FIXED"] = 1;
            }
          }
        }
        ////////////////////////////////////////////////////////////////////////////////

        ////////////////////////////////////////////////////////////////////////////////
        //
        // assignation (one equal sign)
        //
        ////////////////////////////////////////////////////////////////////////////////
        if ( (tokens_i_type === assignType) && (assignation) && (tokens_i_value != ":=") ) {
          tokens_i_type = compOperatorType;
          tokens_i_value = "==";
        }
        if (tokens_i_type === assignType) {
          node = new descartesJS.Node(tokens_i_type, tokens_i_value);

          // the tree is not empty
          if (lastNode != null) {
            assignation = true;

            // the last element of the tree is an identifier
            if (lastNode.type === identifierType) {
              if (lastNode.parent) {
                lastNode.parent.replaceLastChild(node);
              }
              node.addChild(lastNode);
              lastNode = node;
            }
            // the last element of the tree is a square bracket
            else if (lastNode.type === squareBracketType) {
              node.addChild(lastNode.parent);
              lastNode = node;
            }
            // otherwise
            else {
              node.type = compOperatorType;
              node.value = "==";

              // find an element in the tree having a higher precedence to the node to be added
              while ((lastNode.parent) && (getPrecedence(lastNode.parent.value) >= getPrecedence(node.value))) {
                lastNode = lastNode.parent;
              }
              // if can find an ancestor in the tree having a higher precedence
              if (lastNode.parent) {
                lastNode.parent.replaceLastChild(node);
                node.addChild(lastNode);
                lastNode = node;
              }
              // reached the root
              else {
                node.addChild(lastNode);
                lastNode = node;
              }
            }
          }

          // do not have last element
          else {
            showError(1, input, tokens_i_value, tokens_i_type);
            break;
          }

          // continue with the next token
          continue;
        }

        ////////////////////////////////////////////////////////////////////////////////
        //
        // Parentheses, function, vectors and matrices
        //
        ////////////////////////////////////////////////////////////////////////////////
        // open parentheses and open square brackets
        if (
          (tokens_i_type === parenthesesType)   && (tokens_i_value === "(") ||
          (tokens_i_type === squareBracketType) && (tokens_i_value === "[")
        ) {
          node = new descartesJS.Node(tokens_i_type, tokens_i_value);

          if (tokens_i_value === "(") {
            openParenthesis++;
          }

          if (tokens_i_value === "[") {
            openSquareBracket++;
          }

          // the first element of the tree
          if (lastNode === null) {
            if (tokens_i_value === "(") {
              (new descartesJS.Node("(expr)", "(expr)")).addChild(node);
            }

            if (tokens_i_value === "[") {
              (new descartesJS.Node("[expr]", "[expr]")).addChild(node);
            }

            lastNode = node;
          }
          // the tree has some element
          else {
            // the last element of the tree is an operator
            if (
              (lastNode.type === operatorType) ||
              (lastNode.type === boolOperatorType) ||
              (lastNode.type === compOperatorType) ||
              (lastNode.type === conditionalType) ||
              (lastNode.type === assignType)
            ) {
              lastNode.addChild(node);
              lastNode = node;
            }

            // the last element is a sign
            else if (lastNode.type === signType) {
              lastNode.addChild(node);
              lastNode = node;
            }

            // the last element in the tree is an open parentheses
            else if ((lastNode.type === parenthesesType) && (lastNode.value === "(")) {
              lastNode.addChild(node);
              lastNode = node;
            }

            // the last element in the tree is an open square bracket
            else if ((lastNode.type === squareBracketType) && (lastNode.value === "[")) {
              lastNode.addChild(node);
              lastNode = node;
            }

            // the last element in the tree is a close parentheses
            else if ((lastNode.type === parenthesesType) && (lastNode.value === "()")) {
              lastNode.parent.addChild(node);
              lastNode = node;
            }

            // the last element in the tree is a close square bracket
            else if ((lastNode.type === squareBracketType) && (lastNode.value === "[]")) {
              lastNode.parent.addChild(node);
              lastNode = node;
            }

            // the last element in the tree is an identifier
            else if (lastNode.type === identifierType) {
              lastNode.addChild(node);
              lastNode = node;
            }

            // otherwise
            else {
              showError(2, input, tokens_i_value, tokens_i_type);
              break;
            }
          }

          // continue with the next token
          continue;
        }

        // close parentheses
        else if ((tokens_i_type === parenthesesType) && (tokens_i_value === ")")) {

          openParenthesis--;

          // the first element of the tree
          if (lastNode === null) {
            showError(3, input, tokens_i_value, tokens_i_type);
          }

          // the tree has some element
          else {
            // find the corresponding open parentheses
            while (lastNode && lastNode.parent && ((lastNode.value != "(")  || ((lastNode.value == "(") && (lastNode.type != parenthesesType)))) {
              lastNode = lastNode.parent;
            }

            // if find the parentheses match
            if ((lastNode) && (lastNode.value === "(")) {
              lastNode.value = "()";
            }

            // if not find the parentheses match
            else {
              showError(4, input, tokens_i_value, tokens_i_type);
              break;
            }
          }

          // continue with the next token
          continue;
        }

        // close square brackets
        else if ((tokens_i_type === squareBracketType) && (tokens_i_value === "]")) {

          openSquareBracket--;

          // the first element of the tree
          if (lastNode === null) {
            showError(5, input, tokens_i_value, tokens_i_type);
          }

          // the tree has some element
          else {
            // find the corresponding square brackets
            while (lastNode && lastNode.parent && ((lastNode.value != "[")  || ((lastNode.value == "[") && (lastNode.type != squareBracketType)))) {
              lastNode = lastNode.parent;
            }

            // if find the square brackets
            if ((lastNode) && (lastNode.value === "[")) {
              lastNode.value = "[]";
            }

            // if not find the square brackets
            else {
              showError(6, input, tokens_i_value, tokens_i_type);
              break;
            }
          }

          // continue with the next token
          continue;
        }

        ////////////////////////////////////////////////////////////////////////////////
        //
        // Numbers, strings and identifiers
        //
        ////////////////////////////////////////////////////////////////////////////////
        if (
          (tokens_i_type === numberType) ||
          (tokens_i_type === stringType) ||
          (tokens_i_type === identifierType)
        ) {
          node = new descartesJS.Node(tokens_i_type, tokens_i_value);

          // the first element of the tree
          if (lastNode === null) {
            lastNode = node;
          }

          // the tree has some element
          else {
            // the last element of the tree is an operator, an open parentheses, a sign or an assignation
            if (
              (lastNode.type === operatorType) ||
              (lastNode.type === compOperatorType) ||
              (lastNode.type === boolOperatorType) ||
              ((lastNode.type === parenthesesType) && (lastNode.value === "(")) ||
              ((lastNode.type === squareBracketType) && (lastNode.value === "[")) ||
              (lastNode.type === signType) ||
              (lastNode.type === conditionalType) ||
              (lastNode.type === assignType)
            ) {
              lastNode.addChild(node);
              lastNode = node;
            }

            // otherwise
            else {
              // descartesJS.DEBUG.setError(descartesJS.DEBUG.EXPRESSION, input);
              // showError(7, input, tokens_i_value, tokens_i_type);
              break;
            }
          }

          // continue with the next token
          continue;
        }

        ////////////////////////////////////////////////////////////////////////////////
        //
        // Operators
        //
        ////////////////////////////////////////////////////////////////////////////////
        if (
          (tokens_i_type === operatorType) ||
          (tokens_i_type === compOperatorType) ||
          (tokens_i_type === boolOperatorType)
        ) {
          node = new descartesJS.Node(tokens_i_type, tokens_i_value);

          // the first element of the tree
          if (lastNode === null) {
            // an operator can start an expression if is a sign expression
            if ((tokens_i_value === "-") || (tokens_i_value === "+")) {
              node.type = signType;
              node.value = signType + tokens_i_value;
              lastNode = node;
            }

            // an operator can start an expression if is a boolean negation
            else if (tokens_i_value === "!") {
              lastNode = node;
            }

            // otherwise
            else {
              showError(8, input, tokens_i_value, tokens_i_type);
              break;
            }
          }

          // the tree has some element
          else {
            // the last element of the tree is an operator or an open parentheses and the operator is + or -
            if (
              (lastNode.type === operatorType) ||
              (lastNode.type === compOperatorType) ||
              (lastNode.type === boolOperatorType) ||
              (lastNode.type === assignType) ||
              (lastNode.type === conditionalType) ||
              (((lastNode.type === squareBracketType) && (lastNode.value === "[")) && ((tokens_i_value === "-") ||
              (tokens_i_value === "+") ||
              (tokens_i_value === "!"))) ||
              (((lastNode.type === parenthesesType) && (lastNode.value === "(")) && ((tokens_i_value === "-") ||
              (tokens_i_value === "+") ||
              (tokens_i_value === "!")))
            ) {
              // sign of an expression
              if ((tokens_i_value === "-") || (tokens_i_value === "+")) {
                node.type = signType;
                node.value = signType + tokens_i_value;
              }
              lastNode.addChild(node);
              lastNode = node;
            }

            // the last element of the tree is a number, parenthetical expression, a string or an identifier
            else if (
              (lastNode.type === numberType) ||
              ((lastNode.type === parenthesesType) && (lastNode.value === "()")) ||
              ((lastNode.type === squareBracketType) && (lastNode.value === "[]")) ||
              (lastNode.type === stringType) ||
              (lastNode.type === identifierType) ||
              (lastNode.type === conditionalType) ||(lastNode.type === assignType)
            ) {

              // find an element in the tree having a higher precedence to the node to be added
              while ((lastNode.parent) && (getPrecedence(lastNode.parent.value) >= getPrecedence(node.value))) {
                lastNode = lastNode.parent;
              }

              // if can find an ancestor in the tree having a higher precedence
              if (lastNode.parent) {
                lastNode.parent.replaceLastChild(node);
                node.addChild(lastNode);
                lastNode = node;
              }

              // reached the root
              else {
                node.addChild(lastNode);
                lastNode = node;
              }
            }

            // otherwise
            else {
              showError(9, input, tokens_i_value, tokens_i_type);
              break;
            }
          }

          // continue with the next token
          continue;
        }

        ////////////////////////////////////////////////////////////////////////////////
        //
        // Conditional
        //
        ////////////////////////////////////////////////////////////////////////////////
        if (tokens_i_type === conditionalType) {
          node = new descartesJS.Node(tokens_i_type, tokens_i_value);

          // the tree has some element
          if (lastNode != null) {
            // the operator is ?
            if (node.value === "?") {
              openConditional++;

              // find an element in the tree having a higher precedence to the node to be added
              while ((lastNode.parent) && (getPrecedence(lastNode.parent.value) > getPrecedence(node.value))) {
                lastNode = lastNode.parent;
              }
              // if can find an ancestor in the tree having a higher precedence
              if (lastNode.parent) {
                lastNode.parent.replaceLastChild(node);
                node.addChild(lastNode);
                lastNode = node;
              }

              // reached the root
              else {
                node.addChild(lastNode);
                lastNode = node;
              }
            } else {
              openConditional--;

              // find the corresponding ?
              while (lastNode && lastNode.parent && ((lastNode.value != "?")  || ((lastNode.value == "?") && (lastNode.type != conditionalType)))) {
                lastNode = lastNode.parent;
              }
              // if can find the ?
              if ((lastNode) && (lastNode.value === "?")) {
                lastNode.value = "?:";
              }

              // if can not find the ?
              else {
                showError(10, input, tokens_i_value, tokens_i_type);
                break;
              }
            }
          }

          // last element do not exist
          else {
            showError(11, input, tokens_i_value, tokens_i_type);
            break;
          }

          // continue with the next token
          continue;
        }

        ////////////////////////////////////////////////////////////////////////////////
        //
        // Separator (comma ,)
        //
        ////////////////////////////////////////////////////////////////////////////////
        if (tokens_i_type === "separator") {
          // the tree has some element
          if (lastNode != null) {
            // find in the tree an open parentheses
            while ( (lastNode.parent) && (lastNode.value != "(") && (lastNode.value != "[") ) {
              lastNode = lastNode.parent;
            }
          }

          else {
            showError(12, input, tokens_i_value, tokens_i_type);
            break;
          }

          // continue with the next token
          continue;
        }

        showError(13, input, tokens_i_value, tokens_i_type);
        break;
      }

      // missing or too many parentheses or square brackets
      if (openParenthesis > 0) {
        descartesJS.DEBUG.setError(descartesJS.DEBUG.PARENTHESIS_CLOSING, input);
      }
      if (openParenthesis < 0) {
        descartesJS.DEBUG.setError(descartesJS.DEBUG.PARENTHESIS_OPENING, input);
      }

      if (openSquareBracket > 0) {
        descartesJS.DEBUG.setError(descartesJS.DEBUG.BRACKET_CLOSING, input);
      }
      if (openSquareBracket < 0) {
        descartesJS.DEBUG.setError(descartesJS.DEBUG.BRACKET_OPENING, input);
      }
      
      // miss the second term of the conditional
      if (openConditional !=0) {
        descartesJS.DEBUG.setError(descartesJS.DEBUG.INCOMPLETE_IF, input);
      }

      root = (lastNode) ? lastNode.getRoot() : null;
      if (root) {
        root.setAllEvalFun();
      }

      return root;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Register the default variables and functions of Descartes
     */
    registerDefaultValues() {
      const waitTime = 1500;
      let lastTime = Date.now();

      let self = this;

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // register the default variables
      self.variables["_NUM_MAX_ITE_ALG_"] = 100000;
      self.variables["pi"] = self.variables["π"] = Math.PI;
      self.variables["e"] = Math.E;
      self.variables["Infinity"] = Infinity;
      self.variables["-Infinity"] = -Infinity;
      self.variables["isTouch"] = self.variables["esTáctil"] = (descartesJS.hasTouchSupport) ? 1 : 0;
      self.variables["device"] = self.variables["dispositivo"] = (function() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
          return "tablet";
        }
        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
          return "mobile";
        }
        return "desktop";
      })();

      // readonly variables
      Object.defineProperties(self.variables, {
        // screen variables
        "screenOrientation" : { 
          get : function() { 
            if ( window.matchMedia("(orientation: landscape)").matches ) {
              return "landscape";
            }
            return "portrait";
          }
        },
        "screenWidth" : { get : function() { return window.innerWidth; } },
        "screenHeight" : { get : function() { return window.innerHeight; } },
      });
      self.variables["DJS.squote"] = "\\u0027";
      self.variables["DJS.comma"] = "\\u002C";


      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // register the default functions
      let evalCache = {};
      self.functions["_Eval_"] = function(evalArgument="") {
        if (evalArgument == "") {
          return 0;
        }

        // if the argument is a number return the string NaN
        if (typeof(evalArgument) == "number") {
          return "NaN";
        }
        // the argument is a string
        else {
          // check if the string is a number, then the argument needs to be a string
          let tmp_replace = evalArgument.replace(",", ".");
          if ( ((/,/).test(evalArgument)) && (parseFloat(tmp_replace) == tmp_replace) ) {
            evalArgument = tmp_replace;
          }

          if (evalCache[evalArgument] == undefined) {
            let _assign = (evalArgument.match(/:=/g)) ? true : false;

            // multiple expressions
            if ((/;/).test(evalArgument)) {
              let inStr = false;
              let charAt;
              let valueArray = [];
              let lastIndex = 0;

              for (let i=0, l=evalArgument.length; i<l; i++) {
                charAt = evalArgument[i];

                // inside or outside of a string
                if (charAt === "'") {
                  inStr = !inStr;
                }

                if ((!inStr) && (charAt === ";")) {
                  valueArray.push(evalArgument.substring(lastIndex, i));
                  lastIndex = i+1;
                }
              }

              valueArray.push(evalArgument.substring(lastIndex));

              evalCache[evalArgument] = self.parse(`(${valueArray.join(")(")})`, _assign);
            }
            else {
              evalCache[evalArgument] = self.parse(evalArgument, _assign);
            }
          }

          let tmp_ret = self.evaluator.eval( evalCache[evalArgument] );
          return (tmp_ret != undefined) ? tmp_ret : "NaN";
        }
      }

      self.functions["sqr"]   = function(x) { return (x*x) };
      self.functions["sqrt"]  = self.functions["raíz"] = Math.sqrt;
      self.functions["exp"]   = Math.exp;
      self.functions["log"]   = Math.log;
      self.functions["log10"] = (Math.log10) ? Math.log10 : function(x) { return Math.log(x)/Math.log(10) };
      self.functions["abs"]   = Math.abs;
      self.functions["ent"]   = function(x) { return Math.trunc(parseFloat(x) + (Math.sign(x)*0.0000000000000001)) };
      self.functions["sgn"]   = Math.sign;
      self.functions["ind"]   = function(x) { return (x) ? 1 : 0 };
      self.functions["sin"]   = self.functions["sen"] = Math.sin;
      self.functions["cos"]   = Math.cos;
      self.functions["tan"]   = Math.tan;
      self.functions["cot"]   = function(x) { return 1/Math.tan(x); };
      self.functions["sec"]   = function(x) { return 1/Math.cos(x); };
      self.functions["csc"]   = function(x) { return 1/Math.sin(x); };
      self.functions["sinh"]  = self.functions["senh"] = (Math.sinh) ? Math.sinh : function(x) { return (Math.exp(x)-Math.exp(-x))/2 };
      self.functions["cosh"]  = (Math.cosh) ? Math.cosh : function(x) { return (Math.exp(x)+Math.exp(-x))/2; };
      self.functions["tanh"]  = (Math.tanh) ? Math.tanh : function(x) { return (Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x)); };
      self.functions["coth"]  = function(x) { return 1/self.functions.tanh(x); };
      self.functions["sech"]  = function(x) { return 1/self.functions.cosh(x); };
      self.functions["csch"]  = function(x) { return 1/self.functions.sinh(x); };
      self.functions["asin"]  = self.functions["asen"] = Math.asin;
      self.functions["acos"]  = Math.acos;
      self.functions["atan"]  = Math.atan;
      self.functions["atan2"] = Math.atan2;
      self.functions["floor"] = self.functions["piso"] = Math.floor;
      self.functions["ceil"]  = self.functions["techo"] = Math.ceil;
      self.functions["round"] = self.functions["redondeo"] = Math.round;
      self.functions["trunc"] = self.functions["truncamiento"] = Math.trunc;
      self.functions["min"]   = Math.min;
      self.functions["max"]   = Math.max;
      self.functions["_Trace_"] = self.functions["_Print_"] = function() { console.info.apply(console, arguments); return 0; };
      self.functions["_Num_"] = function(x) {
        if (typeof(x) == "number") {
          return "NaN";
        }
        else {
          x = x.replace(",", ".");
          return (parseFloat(x) == x) ? parseFloat(x) : "NaN";
        }
      };
      self.functions["isNumber"] = self.functions["esNúmero"] = function(x) {
        return (Number.isFinite(x)) ? 1 : 0;
      }
      self.functions["random"] = self.functions["aleatorio"] = function(min, max) {
        min = isNaN(parseFloat(min)) ? 0 : parseFloat(min);
        max = isNaN(parseFloat(max)) ? 1 : parseFloat(max);
        
        // if the min value is greater than the max value, then invert the values
        if (min > max) { [min, max] = [max, min]; }
        return min + Math.random()*(max-min);
      };


      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      self.functions["_Stop_Audios_"] = function() { self.evaluator.parent.stopAudios(); };

      // if the lesson is inside a iframe then register the communication functions with the parent
      if (window.parent !== window) {
        // function to set a variable value to the parent
        self.functions["parent.set"] = function(varName, value) {
          window.parent.postMessage({ type: "set", name: varName, value: value }, '*');
          return 0;
        }

        // function to update the parent
        self.functions["parent.update"] = function() {
          window.parent.postMessage({ type: "update" }, '*');
          return 0;
        }

        // function to execute a function in the parent
        self.functions["parent.exec"] = function(functionName, functionParameters) {
          window.parent.postMessage({ type: "exec", name: functionName, value: functionParameters }, '*');
          return 0;
        }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /**
       *
       */
      self.functions["toFixed"] = self.functions["_NumToStr_"] = self.functions["_NumACadena_"] = function(num, dec) {
        num = isNaN(parseFloat(num)) ? 0 : parseFloat(num);
        dec = dec || 0;
        return (num.toFixed(parseInt(dec))).replace(".", self.evaluator.parent.decimal_symbol);
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // new string functions
      /**
       *
       */
      self.functions["charAt"] = self.functions["_charAt_"] = self.functions["_letraEn_"] = function(str, n) {
        str = (str || "").toString();
        n = (isNaN(parseInt(n))) ? 0 : parseInt(n);
        return str.charAt(n);
      };
      /**
       *
       */
      self.functions["substring"] = self.functions["_substring_"] = self.functions["_subcadena_"] = function(str, i, j) {
        str = (str || "").toString();
        i = (isNaN(parseInt(i))) ? 0 : parseInt(i);
        j = (isNaN(parseInt(j))) ? 0 : parseInt(j);

        if ( (i >= 0) && (j >= 0) ) {
          return str.substring(i, j);
        }
        else {
          if ( (i < 0) && (j >= 0) ) {
            return str.substring(j);
          }
          else if ( (j < 0) && (i >= 0)) {
            return str.substring(i);
          }
          else {
            return "";
          }
        }
      };
      /**
       *
       */
      self.functions["strLength"] = self.functions["_length_"] = self.functions["_longitud_"] = function(str) {
        return ((str || "").toString()).length;
      };
      /**
       *
       */
      self.functions["indexOf"] = self.functions["_indexOf_"] = self.functions["_índiceDe_"] = function(str, word) {
        return ((str || "").toString()).indexOf( (word || "").toString() );
      };
      /**
       *
       */
      self.functions["lastIndexOf"] = function(str, word) {
        return ((str || "").toString()).lastIndexOf( (word || "").toString() );
      };
      /**
       *
       */
      self.functions["replace"] = self.functions["_replace_"] = self.functions["_reemplazar_"] = function(str, strTo, strWith) {
        str = (str || "").toString();
        strTo = (strTo || "").toString();
        strWith = (strWith || "").toString();

        let index = str.indexOf(strTo);
        while (index >= 0) {
          str = str.substring(0, index) + strWith + str.substring(index+strTo.length);
          index = str.indexOf(strTo, index+strWith.length);
        }
        
        return str;
      };
      /**
       *
       */
      self.functions["toLowerCase"] = function(str) {
        return ((str || "").toString()).toLowerCase();
      };
      /**
       *
       */
      self.functions["toUpperCase"] = function(str) {
        return ((str || "").toString()).toUpperCase();
      };
      /**
       *
       */
      self.functions["trim"] = function(str) {
        return ((str || "").toString()).trim();
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // read external values
      /**
       *
       */
      self.functions["_Load_"] = function(file) {
        let response = "";
        if (file) {
          let fileElement = document.getElementById(file);
          response = ((fileElement) && (fileElement.type == "descartes/archivo")) ? fileElement.text : descartesJS.openFile(file);
        }
        return response || "";
      }
      /**
       *
       */
      self.functions["_GetValues_"] = function(file, name) {
        return self.functions._ExecBlock_(self.functions._Load_(file).replace(/&brvbar;/g, String.fromCharCode("166")), name);
      };
      /**
       *
       */
      self.functions["_GetMatrix_"] = function(file, name) {
        return self.functions._StrToMatrix_(self.functions._Load_(file).replace(/&brvbar;/g, String.fromCharCode("166")), name);
      };
      /**
       *
       */
      self.functions["_MatrixToStr_"] = function(Mstr) {
        let M = self.matrices[Mstr];
        if (M) {
          let strM = "<" + Mstr + ">\\n";

          let l = self.evaluator.getVariable(Mstr + ".columnas_usadas") || M.cols || 0;
          let k = self.evaluator.getVariable(Mstr + ".filas_usadas")    || M.rows || 0;
          let _val;

          for (let i=0; i<l; i++) {
            for (let j=0; j<k; j++) {
              _val = M[i][j];

              if (_val !== undefined) {
                if (typeof(_val) == "string") {
                  _val = "'" + _val + "'";
                }
                else if (typeof(_val) == "number") {
                  _val = descartesJS.removeNeedlessDecimals(_val.toFixed(6));
                }

                strM += _val + ((j<k-1)? (" \u00A6 ") : "");
              }
            }
            // remove the last pipe if any
            strM = strM.replace(/(\u00A6 )$/g, "") + "\\n";
          }
          
          return strM + "</" + Mstr + ">";
        }
        else {
          return "";
        }
      }
      /**
       *
       */
      self.functions["_StrToMatrix_"] = function(response, name) {
        let values = [];
        let storeValues = false;
        let findMatrix = false;
        values.type = "matrix";

        let tmpValue;

        if (response) {
          response = response.replace(/\r|\\r/g, "").split(/\n|\\n/);

          for (let i=0, l=response.length; i<l; i++) {
            // initial position of the values
            if (response[i].match("<" + name + ">")) {
              findMatrix = true;

              tmpValue = response[i].trim().split(`<${name}>`);

              if ((tmpValue.length == 2) && (tmpValue[1] != "")) {
                values.push(tmpValue[1].split(String.fromCharCode("166")).map(myMapFun));
              }

              storeValues = true;
              continue;
            }

            // final position of the values
            if (response[i].match("</" + name + ">")) {
              tmpValue = response[i].trim().split("</" + name + ">");

              if ((tmpValue.length == 2) && (tmpValue[0] != "")) {
                values.push(tmpValue[0].split(String.fromCharCode("166")).map(myMapFun));
              }

              storeValues = false;
              i = response.length;
            }

            // add elements in between
            if (storeValues) {
              values.push(response[i].split(String.fromCharCode("166")).map(myMapFun));
            }
          }

          self.matrices[name] = values;
          self.matrices[name].rows = (values && values[0] && values[0].length) ? values[0].length : 0;
          self.matrices[name].cols = (values && values.length) ? values.length : 0;
          self.evaluator.setVariable(name + ".filas", self.matrices[name].rows);
          self.evaluator.setVariable(name + ".columnas", self.matrices[name].cols);
        }

        return (findMatrix) ? "OK" : "ERROR";
      }
      /**
       *
       */
      self.functions["_GetVector_"] = function(file, name) {
        return self.functions._StrToVector_(self.functions._Load_(file), name);
      }
      /**
       *
       */
      self.functions["_VectorToStr_"] = function(Vstr) {
        let V = self.vectors[Vstr];

        if (V) {
          let strV = "<" + Vstr + ">\\n";

          let l = self.evaluator.getVariable(Vstr + ".long_usada") || V._size_ || 0;
          let _val;

          for (let i=0; i<l; i++) {
            _val = V[i];

            if (_val !== undefined) {
              if (typeof(_val) == "number") {
                _val = parseFloat(_val);
              }

              strV += _val + "\\n";
            }
            else {
              strV += 0 + "\\n";
            }
          }

          return strV + "</" + Vstr + ">";
        }
        else {
          return "";
        }
      }
      /**
       *
       */
      self.functions["_StrToVector_"] = function(response, name) {
        let values = [];
        let storeValues = false;
        let findVector = false;
        values.type = "vector";

        if (response) {
          response = response.replace(/\r|\\r/g, "").split(/\n|\\n/);

          for (let i=0, l=response.length; i<l; i++) {
            // initial position of the values
            if (response[i].match("<" + name + ">")) {
              findVector = true;
              storeValues = true;
              continue;
            }

            // final position of the values
            if (response[i].match("</" + name + ">")) {
              storeValues = false;
              i = response.length;
            }

            // add elements in between
            if (storeValues) {
              values.push( myMapFun(response[i]) );
            }
          }

          values._size_ = values.length;
          self.vectors[name] = values;
          self.evaluator.setVariable(name + ".long", values.length);
          self.evaluator.setVariable(name + ".long_usada", values.length);
        }

        return (findVector) ? "OK" : "ERROR";
      }
      /**
       *
       */
      self.functions["_ExecStr_"] = function(response) {
        return self.functions._ExecBlock_(response, "");
      }
      /**
       *
       */
      self.functions["_ExecBlock_"] = function(response, name) {
        let values = [];
        let storeValues = (name == "");
        let tmpValue;

        if (response) {
          response = response.replace(/\r|\\r/g, "").split(/\n|\\n/);

          for (let i=0, l=response.length; i<l; i++) {

            // initial position of the values
            if (response[i].match("<" + name + ">")) {
              tmpValue = response[i].trim().split("<" + name + ">");

              if ((tmpValue.length == 2) && (tmpValue[1] != "")) {
                values = values.concat(tmpValue[1].split(String.fromCharCode("166")));
              }

              storeValues = true;
              continue;
            }

            // final position of the values
            if (response[i].match("</" + name + ">")) {
              tmpValue = response[i].trim().split("</" + name + ">");

              if ((tmpValue.length == 2) && (tmpValue[0] != "")) {
                values = values.concat(tmpValue[0].split(String.fromCharCode("166")))
              }

              storeValues = false;
              continue;
            }

            // add elements in between
            if (storeValues) {
              values = values.concat(response[i].split(String.fromCharCode("166")));
            }
          }

          for (let i=0, l=values.length; i<l; i++) {
            tmpValue = values[i].split("=");
            tmpValue[0] = tmpValue[0].trim();

            if ((tmpValue.length == 2) && (tmpValue[0] != "")) {
              // is a string
              if (isNaN(parseFloat(tmpValue[1]))) {
                self.evaluator.setVariable(tmpValue[0], tmpValue[1].trim().replace(/^'|'$/g, ""));
              }
              // is a number
              else {
                self.evaluator.setVariable(tmpValue[0], parseFloat(tmpValue[1]));
              }
            }
          }
        }

        return 0;
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      let anchor = descartesJS.newHTML("a", {
        target : "_blank",
      });
      let blob;
      let blobContent = null;
      descartesJS.newBlobContent = null;
      /**
       *
       */
      self.functions["_Save_"] = function(filename, data) {
        self.evaluator.parent.removeButtonClick();
        if ((Date.now() - lastTime) > waitTime) {
          lastTime = Date.now();

          document.body.appendChild(anchor);
          blobContent = data.replace(/\\r/g, "").replace(/\\n/g, "\r\n").replace(/\\q/g, "'").replace(/\\_/g, "\\").replace(/\\br/g, "\\n");

          blob = new Blob(["\ufeff", blobContent], {type:"text/plain;charset=utf-8"});
          anchor.setAttribute("href", window.URL.createObjectURL(blob));
          anchor.setAttribute("download", filename);

          if (blobContent != descartesJS.newBlobContent) {
            anchor.click();
            descartesJS.newBlobContent = blobContent;
          }

          document.body.removeChild(anchor);
        }
        return 0;
      };


      let anchorImg = descartesJS.newHTML("a", {
        target : "_blank",
      });
      /**
       *
       */
      self.functions["_SaveSpace_"] = function(filename, img) {
        self.evaluator.parent.removeButtonClick();
        if ((Date.now() - lastTime) > waitTime) {
          lastTime = Date.now();

          document.body.appendChild(anchorImg);

          blobContent = img;
          anchorImg.setAttribute("href", blobContent);
          anchorImg.setAttribute("download", filename);

          if (blobContent != descartesJS.newBlobContent) {
            anchorImg.click();
            descartesJS.newBlobContent = blobContent;
          }

          document.body.removeChild(anchorImg);
        }
        return 0;
      };


      let files;
      let reader;

      let input = descartesJS.newHTML("input", {
        type : "file",
      });

      input.addEventListener("change", function(evt) {
        files = evt.target.files;

        reader = new FileReader();
        /**
         * read the content of the file
         */
        reader.onload = function(evt) {
          descartesJS.addExternalFileContent(files[0].name, evt.target.result);

          self.evaluator.setVariable("DJS.fileName", files[0].name);
          self.evaluator.setVariable("DJS.fileContent", evt.target.result);

          let tmp_fun = self.evaluator.getFunction(self._callback);
          if (tmp_fun) {
            tmp_fun.apply(self.evaluator, []);
            self.evaluator.parent.update();
          }
          // clean the input
          input.value = "";
        }

        if (files.length > 0) {
          reader.readAsText(files[0]);
        }
      });

      /**
       *
       */
      self.functions["_Open_"] = function(callback) {
        self.evaluator.parent.removeButtonClick();
        if ((Date.now() - lastTime) > waitTime) {
          self._callback = callback;
          input.click();
          lastTime = Date.now();
        }
        return 0;
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      /**
       *
       */
      self.functions["_AnchoDeCadena_"] = self.functions["_strWidth_"] = function(str, font, style, size) {
        return descartesJS.getTextWidth(str, descartesJS.convertFont(font + "," + style + "," + size))
      }

      self.functions["R"] = self.functions["_Rojo_"]  = self.functions["_Red_"]   = function(c) { return (new descartesJS.Color(c).r)/255; }
      self.functions["G"] = self.functions["_Verde_"] = self.functions["_Green_"] = function(c) { return (new descartesJS.Color(c).g)/255; }
      self.functions["B"] = self.functions["_Azul_"]  = self.functions["_Blue_"]  = function(c) { return (new descartesJS.Color(c).b)/255; }

      self.functions["HSV2RGB"] = function(h, s, v) {
        h = (parseInt(h) % 360);
        let c = v * s;
        let x = c * (1 - Math.abs((h/60) % 2 -1));
        let m = v - c;
        let R;
        let G;
        let B;

        if ((0 <= h) && (h < 60)) {
          R = c;
          G = x;
          B = 0;
        }
        else if ((60 <= h) && (h < 120)) {
          R = x;
          G = c;
          B = 0;
        }
        else if ((120 <= h) && (h < 180)) {
          R = 0;
          G = c;
          B = x;
        }
        else if ((180 <= h) && (h < 240)) {
          R = 0;
          G = x;
          B = c;
        }
        else if ((240 <= h) && (h < 300)) {
          R = x;
          G = 0;
          B = c;
        }
        else if ((300 <= h) && (h < 360)) {
          R = c;
          G = 0;
          B = x;
        }
        R = parseInt((R+m)*255);
        G = parseInt((G+m)*255);
        B = parseInt((B+m)*255);
      
        return `${R.toString(16).padStart(2,"0")}${G.toString(16).padStart(2,"0")}${B.toString(16).padStart(2,"0")}`;
      };


      self.functions["DJS.typeof"] = function(o) {
        if (o.rows) { return "matrix"; }
        if (o._size_) { return "vector"; }
        return typeof(o);
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
  }

  /**
   * Get the precedence of an operator
   * @param {String} op the operator to get the precedence
   * @return {Number} return a number that represent the precedence
   */
  function getPrecedence(op) {
    switch(op) {
      case "=":  return 1;
      case ":=": return 1;
      case "(":  return 2;
      case "[":  return 2;
      case "?":  return 2;
      case ":":  return 3;
      case "?:": return 3;
      case "|":  return 6; //check
      case "&":  return 7; //check
      case "<":  return 5;
      case "<=": return 5;
      case ">":  return 5;
      case ">=": return 5;
      case "==": return 5;
      case "!=": return 5;
      case "+":  return 6;
      case "-":  return 6;
      case "/":  return 7;
      case "*":  return 7;
      case "sign-": return 7;
      case "sign+": return 7;
      case "!":  return 8;
      case "%":  return 8;
      case "^":  return 9;
      default:   return 9;
    }
  }

  /**
   *
   */
  function myMapFun(x) {
    let cleaned = String(x).trim().replace(/^'|'$/g, "");
    let num = parseFloat(cleaned);
    return (!isNaN(num) && String(num) === cleaned) ? num : cleaned
  }

  /**
   * 
   */
  function showError(num, input, tokens_i_value, tokens_i_type) {
    console.info(`Error${num}: en la expresión 《${input}》, en el token {valor: ${tokens_i_value}, tipo: ${tokens_i_type}}`);
  }

// console.log(((new Parser).parse("(t,func(t))")).toString());
// console.log(((new Parser).parse("((Aleat=0)&(Opmult=2)|(Aleat=1)&(Opmult=3))\nVerError=(Opm_ok=0)\nPaso=(Opm_ok=1)?Paso+1:Paso")).toString());
// console.log(((new Parser).parse("3(x+2)")).toString());
// console.log(((new Parser).parse("", true)).toString());
// console.log(((new Parser).parse("3−4·5×6÷7", true)).toString());
// console.log(((new Parser).parse("literal3=b=1?nombre1+&squot;(&squot;:(b=2?nombre2+&squot;(&squot;:nombre3+&squot;(&squot;)", true)).toString());
// console.log(((new Parser).parse("bla:=1+1", true)).toString());
// console.log(((new Parser).parse("bla(n0,n1)&ble(n0,n2)", true)).toString());
// console.log(((new Parser).parse("(a:=10)+(b:=10)", true)).toString());

  descartesJS.Parser = Parser;
  return descartesJS;
})(descartesJS || {});
