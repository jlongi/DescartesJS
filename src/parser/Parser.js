/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  descartesJS.reservedIds = new String("-_-rnd-pi-π-e-Infinity-isTouch-esTáctil-screenOrientation-screenWidth-screenHeight-sqr-sqrt-raíz-exp-log-log10-abs-ent-sgn-ind-sin-sen-cos-tan-cot-sec-csc-sinh-senh-cosh-tanh-coth-sech-csch-asin-asen-acos-atan-atan2-floor-ceil-round-min-max-_Trace_-_Print_-_Num_-_Stop_Audios_-esCorrecto-escorrecto-parent.set-parent.update-parent.exec-toFixed-_NumToStr_-_NumACadena_-charAt-_charAt_-_letraEn_-substring-_substring_-_subcadena_-strLength-_length_-_longitud_-indexOf-_indexOf_-índiceDe-lastIndexOf-replace-_replace_-_reemplazar_-toLowerCase-toUpperCase-_Load_-_GetValues_-_GetMatrix_-_MatrixToStr_-_StrToMatrix_-_GetVector_-_VectorToStr_-_StrToVector_-_ExecStr_-_ExecBlock_-_Save_-_Open_-_SaveState_-_OpenState_-_AnchoDeCadena_-_strWidth_-_Rojo_-_Red_-_Verde_-_Green_-_Azul_-_Blue_-DJS.typeof-");


  /**
   * Descartes parser
   * @constructor
   */
  descartesJS.Parser = function(evaluator) {
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
   */
  descartesJS.Parser.prototype.setDefinition = function(name, value) {
    this.definitions[name] = value;
  }
  descartesJS.Parser.prototype.getDefinition = function(name) {
    return this.definitions[name];
  }

  /**
   * Set the value to a variable
   * @param {String} name the name of the variable to set
   * @param {Object} value the value of the variable to set
   */
  descartesJS.Parser.prototype.setVariable = function(name, value) {
    this.variables[name] = value;
  }

  /**
   * Get the value to a variable
   * @param {String} name the name of the variable to get the value
   */
  descartesJS.Parser.prototype.getVariable = function(name, firstTime) {
    if (firstTime) {
      this.variables[name] = (this.variables[name] !== undefined) ? this.variables[name] : undefined;
    }
    return this.variables[name];
  }

  /**
   * Set the value of a position in a vector
   * @param {String} name the name of the vector to set
   * @param {Number} pos the position in the vector to set
   * @param {Object} value the value of the vector to set
   */
  descartesJS.Parser.prototype.setVector = function(name, pos, value) {
    this.vectors[name][pos] = value;
  }

  /**
   * Get the value to a vector
   * @param {String} name the name of the vector to get the value
   */
  descartesJS.Parser.prototype.getVector = function(name) {
    if (!this.vectors.hasOwnProperty(name)) {
      this.vectors[name] = [0,0,0];
    }
    return this.vectors[name];
  }

  /**
   * Set the value of a position in a matrix
   * @param {String} name the name of the matrix to set
   * @param {Number} pos1 the row position in the matrix to set
   * @param {Number} pos2 the column position in the matrix to set
   * @param {Object} value the value of the matrix to set
   */
  descartesJS.Parser.prototype.setMatrix = function(name, pos1, pos2, value){
    this.matrices[name][pos1][pos2] = value;
  }

  /**
   * Get the value to a matrix
   * @param {String} name the name of the matrix to get the value
   */
  descartesJS.Parser.prototype.getMatrix = function(name){
    if (!this.matrices.hasOwnProperty(name)) {
      this.matrices[name] = [[0,0,0],[0,0,0],[0,0,0]];
    }
    return this.matrices[name];
  }

  /**
   * Set the value to a function
   * @param {String} name the name of the function to set
   * @param {Object} value the value of the function to set
   */
  descartesJS.Parser.prototype.setFunction = function(name, value){
    this.functions[name] = value;
  }

  /**
   * Get a function
   * @param {String} name the name of the function to get
   */
  descartesJS.Parser.prototype.getFunction = function(name){
    if (!this.functions.hasOwnProperty(name)) {
      this.functions[name] = function(){ return 0; };
    }
    return this.functions[name];
  }

  var parenthesesType = "parentheses";
  var squareBracketType = "square_bracket";
  var asignType = "asign";
  var compOperatorType = "compOperator";
  var identifierType = "identifier";
  var operatorType = "operator";
  var boolOperatorType = "boolOperator";
  var conditionalType = "conditional";
  var signType = "sign";
  var numberType = "number";
  var stringType = "string";
  var i;
  var l;
  var tokens;
  var lastNode;
  var node;
  var asignation;
  var count;
  var openParentesis;
  var openSquareBracket;
  var openConditional;
  var tokens_i;
  var tokens_i_value;
  var tokens_i_type;
  var root;

  /**
   * Function that parses a string
   * @param {String} input the input to parse
   * @param {Boolean} asignation identify if the input is treated like an asignation
   * @return {Node} return a parse tree from the parses input
   */
  descartesJS.Parser.prototype.parse = function(input, asignation) {
    tokens = this.tokenizer.tokenize(input);

    // tokens is undefined
    if (!tokens) {
      tokens = [];
    }
    lastNode = null;
    asignation = !asignation || false;
    count = 0;

    openParentesis = 0;
    openSquareBracket = 0;
    openConditional = 0;

    for (i=0, l=tokens.length; i<l; i++) {
      tokens_i = tokens[i];
      tokens_i_value = tokens_i.value;
      tokens_i_type = tokens_i.type;

      ////////////////////////////////////////////////////////////////////////////////
      // verify if the variables exist
      ////////////////////////////////////////////////////////////////////////////////
      if (tokens_i_type === identifierType) {
        // the identifier is a function
        if ( ((i+1)<l) && (tokens[i+1].type === parenthesesType) && (tokens[i+1].value === "(") ) {
          this.getFunction(tokens_i_value);
        }
        // the identifier is a vector or a matrix
        else if ( ((i+1)<l) && (tokens[i+1].type === squareBracketType) && (tokens[i+1].value === "[") ) {
          // vector
          if ( (tokens[i+3]) && (tokens[i+3].type === squareBracketType) && (tokens[i+3].value === "]") ) {
            this.getVector(tokens_i_value);
          }
          // matrix
          else {
            this.getMatrix(tokens_i_value);
          }
        }
        // the identifier is a variable
        else {
          var scrollable = tokens_i_value.match(/(\w*)\.mouse_x|(\w*)\.mouse_y|(\w*)\.mouse_pressed|(\w*)\.mouse_clicked|(\w*)\.clic_izquierdo/);
          if (scrollable) {
            this.variables[(scrollable[1] || scrollable[2] || scrollable[3] || scrollable[4] || scrollable[5]) + ".DESCARTESJS_no_fixed"] = 1;
          }

          this.getVariable(tokens_i_value, true);
        }
      }
      ////////////////////////////////////////////////////////////////////////////////

      ////////////////////////////////////////////////////////////////////////////////
      //
      // Asignation (one equal sign)
      //
      ////////////////////////////////////////////////////////////////////////////////
      if ( (tokens_i_type === asignType) && (asignation) && (tokens_i_value != ":=") ) {
        tokens_i_type = compOperatorType;
        tokens_i_value = "==";
      }
      if (tokens_i_type === asignType) {
        node = new descartesJS.Node(tokens_i_type, tokens_i_value);

        // the tree is not empty
        if (lastNode != null) {
          // the last element of the tree is an identifier
          if (lastNode.type === identifierType) {
            if (lastNode.parent){
              lastNode.parent.replaceLastChild(node);
            }

            node.addChild(lastNode);
            lastNode = node;
            asignation = true;
          }
          // the last element of the tree is a square bracket
          else if (lastNode.type === squareBracketType) {
            node.addChild(lastNode.parent);
            lastNode = node;
            asignation = true;
          }

          // otherwise
          else {
            node.type = compOperatorType;
            node.value = "==";
            asignation = true;

            // find an element in the tree having a higher precedence to the node to be added
            while ((lastNode.parent) && (getPrecedence(lastNode.parent.value) >= getPrecedence(node.value))){
              lastNode = lastNode.parent;
            }
            // if can find an ancestor in the tree having a higher precedence
            if (lastNode.parent){
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
          console.info("Error1: en la expresion 《 " + input + " 》, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
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
      if ( (tokens_i_type === parenthesesType) && (tokens_i_value === "(") ||
        (tokens_i_type === squareBracketType) && (tokens_i_value === "[") ) {
        node = new descartesJS.Node(tokens_i_type, tokens_i_value);

        if (tokens_i_value === "(") {
          openParentesis++;
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
          if ( (lastNode.type === operatorType) || (lastNode.type === boolOperatorType) || (lastNode.type === compOperatorType) || (lastNode.type === conditionalType) || (lastNode.type === asignType) ) {
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
            console.info("Error2: en la expresion 《 " + input + " 》, en el token ["+ i +"] {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }

        // continue with the next token
        continue;
      }

      // close parentheses
      else if ((tokens_i_type === parenthesesType) && (tokens_i_value === ")")) {

        openParentesis--;

        // the first element of the tree
        if (lastNode === null) {
          console.info("Error3: en la expresion 《 " + input + " 》, en el token (valor:" + tokens_i_value + ", tipo:" + tokens_i_type);
        }

        // the tree has some element
        else {
          // find the correspondign open parentheses
          while (lastNode && lastNode.parent && ((lastNode.value != "(")  || ((lastNode.value == "(") && (lastNode.type != parenthesesType)))) {
            lastNode = lastNode.parent;
          }

          // if find the parentheses match
          if ((lastNode) && (lastNode.value === "(")) {
            lastNode.value = "()";
          }

          // if not find the parentheses match
          else {
            // console.info("Error4: en la expresion 《 " + input + " 》, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
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
          console.info("Error5: en la expresion 《 " + input + " 》, en el token (valor:" + tokens_i_value + ", tipo:" + tokens_i_type);
        }

        // the tree has some element
        else {
          // find the correspondign square brackets
          while (lastNode && lastNode.parent && ((lastNode.value != "[")  || ((lastNode.value == "[") && (lastNode.type != squareBracketType)))) {
            lastNode = lastNode.parent;
          }

          // if find the square brackets
          if ((lastNode) && (lastNode.value === "[")) {
            lastNode.value = "[]";
          }

          // if not find the square brackets
          else {
            console.info("Error6: en la expresion 《 " + input + " 》, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
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
      if ((tokens_i_type === numberType) || (tokens_i_type === stringType) || (tokens_i_type === identifierType)) {
        if (tokens_i_type === identifierType) {
          node = new descartesJS.Node(tokens_i_type, tokens_i_value);
        }
        else {
          node = new descartesJS.Node(tokens_i_type, tokens_i_value);
        }

        // the first element of the tree
        if (lastNode === null) {
          lastNode = node;
        }

        // the tree has some element
        else {
          // the last element of the tree is an operator, an open parentheses, a sign or an asignation
          if ( (lastNode.type === operatorType) || (lastNode.type === compOperatorType) || (lastNode.type === boolOperatorType) || ((lastNode.type === parenthesesType) && (lastNode.value === "(")) || ((lastNode.type === squareBracketType) && (lastNode.value === "[")) || (lastNode.type === signType)  || (lastNode.type === conditionalType) || (lastNode.type === asignType)) {
            lastNode.addChild(node);
            lastNode = node;
          }

          // otherwise
          else {
            descartesJS.DEBUG.setError(descartesJS.DEBUG.EXPRESSION, input);
            // console.info("Error7: en la expresion 《 " + input + " 》, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
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
      if ( (tokens_i_type === operatorType) || (tokens_i_type === compOperatorType) || (tokens_i_type === boolOperatorType) ) {
        node = new descartesJS.Node(tokens_i_type, tokens_i_value);

        // the first element of the tree
        if (lastNode === null) {
          // an operator can start an expression if is a sign expression
          if ((tokens_i_value === "-") || (tokens_i_value === "+")){
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
            console.info("Error8: en la expresion 《 " + input + " 》, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");  //throw("Error: no se puede iniciar una expresion con un operador 《 " + input + " 》")
            break;
          }
        }

        // the tree has some element
        else {
          // the last element of the tree is an operator or an open parentheses and the operator is + or -
          if ( (lastNode.type === operatorType) || (lastNode.type === compOperatorType) || (lastNode.type === boolOperatorType) || (lastNode.type === asignType) || (lastNode.type === conditionalType) || (((lastNode.type === squareBracketType) && (lastNode.value === "[")) && ((tokens_i_value === "-") || (tokens_i_value === "+") || (tokens_i_value === "!"))) || (((lastNode.type === parenthesesType) && (lastNode.value === "(")) && ((tokens_i_value === "-") || (tokens_i_value === "+") || (tokens_i_value === "!"))) ) {
            // sign of an expression
            if ((tokens_i_value === "-") || (tokens_i_value === "+")){
              node.type = signType;
              node.value = signType + tokens_i_value;
            }
            lastNode.addChild(node);
            lastNode = node;
          }

          // the last element of the tree is a number, parenthetical expression, a string or an identifier
          else if ( (lastNode.type === numberType) || ((lastNode.type === parenthesesType) && (lastNode.value === "()")) || ((lastNode.type === squareBracketType) && (lastNode.value === "[]")) || (lastNode.type === stringType) || (lastNode.type === identifierType) || (lastNode.type === conditionalType) ||(lastNode.type === asignType) ) {

            // find an element in the tree having a higher precedence to the node to be added
            while ((lastNode.parent) && (getPrecedence(lastNode.parent.value) >= getPrecedence(node.value))){
              lastNode = lastNode.parent;
            }

            // if can find an ancestor in the tree having a higher precedence
            if (lastNode.parent){
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
            console.info("Error9: en la expresion 《 " + input + " 》, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
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
            while ((lastNode.parent) && (getPrecedence(lastNode.parent.value) > getPrecedence(node.value))){
              lastNode = lastNode.parent;
            }
            // if can find an ancestor in the tree having a higher precedence
            if (lastNode.parent){
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

            // find the correspondign signo ? correspondiente
            while (lastNode && lastNode.parent && ((lastNode.value != "?")  || ((lastNode.value == "?") && (lastNode.type != conditionalType)))) {
              lastNode = lastNode.parent;
            }
            // if can find the ?
            if ((lastNode) && (lastNode.value === "?")) {
              lastNode.value = "?:";
            }

            // if can not find the ?
            else {
              console.info("Error10: en la expresion 《 " + input + " 》, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
              break;
            }
          }
        }

        // last element do not exist
        else {
          console.info("Error11: en la expresion 《 " + input + " 》, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
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
          console.info("Error12: en la expresion 《 " + input + " 》, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
          break;
        }

        // continue with the next token
        continue;
      }

      console.info("Error13: en la expresion 《 " + input + " 》, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
      break;
    }

    // missing or too many parentheses or square brackets
    if (openParentesis > 0) {
      descartesJS.DEBUG.setError(descartesJS.DEBUG.PARENTHESIS_CLOSING, input);
    }
    if (openParentesis < 0) {
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

  /**
   * Get the precedence of an operator
   * @param {String} op the operator to get the precedence
   * @return {Number} return a number that represent the precedence
   */
  function getPrecedence(op) {
    switch(op){
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

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   * Register the default variables and functions of Descartes
   */
  descartesJS.Parser.prototype.registerDefaultValues = function() {
    var self = this;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // register the default variables
    self.variables["rnd"] = Math.random;
    self.variables["pi"] = self.variables["\u03C0"] = descartesJS.returnValue(Math.PI);
    self.variables["e"] = descartesJS.returnValue(Math.E);
    self.variables["Infinity"] = Infinity;
    self.variables["-Infinity"] = -Infinity;
    self.variables["isTouch"] = self.variables["esT\u00E1ctil"] = (descartesJS.hasTouchSupport) ? 1 : 0;

    // screen variables
    Object.defineProperties(self.variables, {
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // register the default funtions
    self.functions["sqr"]   = function(x) { return (x*x) };
    self.functions["sqrt"]  = self.functions["ra\u00EDz"] = Math.sqrt;
    self.functions["exp"]   = Math.exp;
    self.functions["log"]   = Math.log;
    self.functions["log10"] = function(x) { return Math.log(x)/Math.log(10) };
    self.functions["abs"]   = Math.abs;
    self.functions["ent"]   = Math.floor;
    self.functions["sgn"]   = function(x) { return (x>0) ? 1 : ((x<0) ? -1 : 0) };
    self.functions["ind"]   = function(x) { return (x) ? 1 : 0 };
    self.functions["sin"]   = self.functions["sen"] = Math.sin;
    self.functions["cos"]   = Math.cos;
    self.functions["tan"]   = Math.tan;
    self.functions["cot"]   = function(x) { return 1/Math.tan(x); };
    self.functions["sec"]   = function(x) { return 1/Math.cos(x); };
    self.functions["csc"]   = function(x) { return 1/Math.sin(x); };
    self.functions["sinh"]  = self.functions["senh"] = function(x) { return (Math.exp(x)-Math.exp(-x))/2 };
    self.functions["cosh"]  = function(x) { return (Math.exp(x)+Math.exp(-x))/2; };
    self.functions["tanh"]  = function(x) { return (Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x)); };
    self.functions["coth"]  = function(x) { return 1/self.functions.tanh(x); };
    self.functions["sech"]  = function(x) { return 1/self.functions.cosh(x); };
    self.functions["csch"]  = function(x) { return 1/self.functions.sinh(x); };
    self.functions["asin"]  = self.functions["asen"] = Math.asin;
    self.functions["acos"]  = Math.acos;
    self.functions["atan"]  = Math.atan;
    self.functions["atan2"] = Math.atan2;
    self.functions["floor"] = Math.floor;
    self.functions["ceil"] = Math.ceil; 
    self.functions["round"] = Math.round;
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    self.functions["_Stop_Audios_"] = function() { self.evaluator.parent.stopAudios(); };
    self.functions["esCorrecto"] = function(x, y, regExp) { return descartesJS.esCorrecto(x, y, self.evaluator, regExp); };
    self.functions["escorrecto"] = function(x, y, regExp) { return descartesJS.escorrecto(x, y, self.evaluator, regExp); };

    // if the lesson is inside a iframe then register the comunication functions with the parent
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
      return num.toFixed(parseInt(dec));
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
    self.functions["indexOf"] = self.functions["_indexOf_"] = self.functions["_\u00EDndiceDe_"] = function(str, word) {
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

      var index = str.indexOf(strTo);
      while (index >= 0) {
        str = str.substring(0, index) + strWith + str.substring(index+strTo.length);
        index = str.indexOf(strTo);
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


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // read external values
    /**
     *
     */
    self.functions["_Load_"] = function(file) {
      var response = "";
      if (file) {
        var fileElement = document.getElementById(file);
        response = ((fileElement) && (fileElement.type == "descartes/archivo")) ? fileElement.text : descartesJS.openExternalFile(file);
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
      var M = self.matrices[Mstr];
      if (M) {
        var strM = "<" + Mstr + ">\\n";

        var l = self.getVariable(Mstr + ".columnas_usadas") || M.cols || 0;
        var k = self.getVariable(Mstr + ".filas_usadas")    || M.rows || 0;
        var _val;

        for (var i=0; i<l; i++) {
          for (var j=0; j<k; j++) {
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
      var values = [];
      var storeValues = false;
      var findMatrix = false;
      values.type = "matrix";

      var tmpValue;

      if (response) {
        response = response.replace(/\r|\\r/g, "").split(/\n|\\n/);

        for (var i=0, l=response.length; i<l; i++) {
          // initial position of the values
          if (response[i].match("<" + name + ">")) {
            findMatrix = true;

            tmpValue = response[i].trim().split("<" + name + ">");

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

          // add elementes in between
          if (storeValues) {
            values.push(response[i].split(String.fromCharCode("166")).map(myMapFun));
          }
        }

        self.matrices[name] = values;
        self.matrices[name].rows = (values && values[0] && values[0].length) ? values[0].length : 0;
        self.matrices[name].cols = (values && values.length) ? values.length : 0;
        self.setVariable(name + ".filas", self.matrices[name].rows);
        self.setVariable(name + ".columnas", self.matrices[name].cols);
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
      var V = self.vectors[Vstr];

      if (V) {
        var strV = "<" + Vstr + ">\\n";

        var l = self.getVariable(Vstr + ".long_usada") || V._size_ || 0;
        var _val;

        for (var i=0; i<l; i++) {
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
      var values = [];
      var storeValues = false;
      var findVector = false;
      values.type = "vector";

      if (response) {
        response = response.replace(/\r|\\r/g, "").split(/\n|\\n/);

        for (var i=0, l=response.length; i<l; i++) {
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

          // add elementes in between
          if (storeValues) {
            values.push( myMapFun(response[i]) );
          }
        }

        values._size_ = values.length;
        self.vectors[name] = values;
        self.setVariable(name + ".long", values.length);
        self.setVariable(name + ".long_usada", values.length);
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
      var values = [];
      var storeValues = (name == "");
      var tmpValue;

      if (response) {
        response = response.replace(/\r|\\r/g, "").split(/\n|\\n/);

        for (var i=0, l=response.length; i<l; i++) {

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

          // add elementes in between
          if (storeValues) {
            values = values.concat(response[i].split(String.fromCharCode("166")));
          }
        }

        for(var i=0,l=values.length; i<l; i++) {
          tmpValue = values[i].split("=");
          tmpValue[0] = tmpValue[0].trim();

          if ((tmpValue.length == 2) && (tmpValue[0] != "")) {
            // is a string
            if (isNaN(parseFloat(tmpValue[1]))) {
              // .replace(/^\s|\s$/g, "") remove the initial white space
              self.setVariable(tmpValue[0], tmpValue[1].replace(/^\s|\s$/g, "").replace(/^'|'$/g, ""));
            }
            // is a number
            else {
              self.setVariable(tmpValue[0], parseFloat(tmpValue[1]));
            }
          }
        }
      }

      return 0;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var anchor = document.createElement("a");
    anchor.setAttribute("target", "_blank");
    var blob;
    var blobContent = null;
    descartesJS.newBlobContent = null;
    /**
     *
     */
    self.functions["_Save_"] = function(filename, data) {
      document.body.appendChild(anchor);
      blobContent = data.replace(/\\r/g, "").replace(/\\n/g, "\r\n").replace(/\\q/g, "'").replace(/\\_/g, "\\");

      blob = new Blob(["\ufeff", blobContent], {type:"text/plain;charset=utf-8"});
      anchor.setAttribute("href", window.URL.createObjectURL(blob));
      anchor.setAttribute("download", filename);
      // anchor.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(blobContent))

      if (blobContent != descartesJS.newBlobContent) {
        anchor.click();
        descartesJS.newBlobContent = blobContent;
      }

      document.body.removeChild(anchor);

      return 0;
    };
    // window.addEventListener("visibilitychange", function(evt) { descartesJS.newBlobContent = null; });
    // window.addEventListener("blur", function(evt) { descartesJS.newBlobContent = null; });

    var files;
    var reader;

    var input = document.createElement("input");
    input.setAttribute("type", "file");

    onHandleFileSelect = function(evt) {
      files = evt.target.files;

      reader = new FileReader();
      /**
       * read the content of the file
       */
      reader.onload = function(evt) {
        descartesJS.addExternalFileContent(files[0].name, evt.target.result);

        self.setVariable("DJS.fileName", files[0].name);
        self.setVariable("DJS.fileContent", evt.target.result);

        if (self.getFunction(self._callback)) {
          self.getFunction(self._callback).apply(self.evaluator, []);
          self.evaluator.parent.update();
        }
        // clean the input
        input.value = "";
      }

      if (files.length >0) {
        reader.readAsText(files[0]);
      }
    }
    input.addEventListener("change", onHandleFileSelect);

    /**
     *
     */
    self.functions["_Open_"] = function(callback) {
      self._callback = callback;
      input.click();

      return 0;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     *
     */
    self.functions["_AnchoDeCadena_"] = self.functions["_strWidth_"] = function(str, font, style, size) {
      return descartesJS.getTextWidth(str, descartesJS.convertFont(font + "," + style + "," + size))
    }

    self.functions["_Rojo_"]  = self.functions["_Red_"]   = function(c) { return (new descartesJS.Color(c).r)/255; }
    self.functions["_Verde_"] = self.functions["_Green_"] = function(c) { return (new descartesJS.Color(c).g)/255; }
    self.functions["_Azul_"]  = self.functions["_Blue_"]  = function(c) { return (new descartesJS.Color(c).b)/255; }

    self.functions["DJS.typeof"] = function(o) {
      if (o.rows) { return "matrix"; }
      if (o._size_) { return "vector"; }
      return typeof(o);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  }

  /**
   *
   */
  function myMapFun(x) {
    if (isNaN(parseFloat(x))) {
      return x.replace(/^\s|\s$/g, "").replace(/^'|'$/g, "");
    }
    else {
      return (parseFloat(x) == x) ? parseFloat(x) : x.replace(/^\s|\s$/g, "").replace(/^'|'$/g, "");
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// console.log(((new descartesJS.Parser).parse("(t,func(t))")).toString());
// console.log(((new descartesJS.Parser).parse("((Aleat=0)&(Opmult=2)|(Aleat=1)&(Opmult=3))\nVerError=(Opm_ok=0)\nPaso=(Opm_ok=1)?Paso+1:Paso")).toString());
// console.log(((new descartesJS.Parser).parse("3(x+2)")).toString());
// console.log(((new descartesJS.Parser).parse("", true)).toString());
// console.log(((new descartesJS.Parser).parse("3−4·5×6÷7", true)).toString());
// console.log(((new descartesJS.Parser).parse("literal3=b=1?nombre1+&squot;(&squot;:(b=2?nombre2+&squot;(&squot;:nombre3+&squot;(&squot;)", true)).toString());
// console.log(((new descartesJS.Parser).parse("bla:=1+1", true)).toString());
// console.log(((new descartesJS.Parser).parse("bla(n0,n1)&ble(n0,n2)", true)).toString());
// console.log(((new descartesJS.Parser).parse("(a:=10)+(b:=10)", true)).toString());

  return descartesJS;
})(descartesJS || {});
