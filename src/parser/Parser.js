/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
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
    
    this.registerDefaultValues();
  }
  
  /**
   * Set the value to a variable
   * @param {String} name the name of the variable to set
   * @param {Object} value the value of the variable to set
   */
  descartesJS.Parser.prototype.setVariable = function(name, value){
    this.variables[name] = value;
  }

  /**
   * Get the value to a variable
   * @param {String} name the name of the variable to get the value
   */
  descartesJS.Parser.prototype.getVariable = function(name){
    return this.variables[name];
  }

  /**
   * Set the value of a position in a vector
   * @param {String} name the name of the vector to set
   * @param {Number} pos the position in the vector to set
   * @param {Object} value the value of the vector to set
   */
  descartesJS.Parser.prototype.setVector = function(name, pos, value){
    this.vectors[name][pos] = value;
  }

  /**
   * Get the value to a vector
   * @param {String} name the name of the vector to get the value
   */
  descartesJS.Parser.prototype.getVector = function(name){
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
  // descartesJS.Parser.prototype.parse = function(input, asignation, prefix) {
  descartesJS.Parser.prototype.parse = function(input, asignation) {
    // prefix = (prefix) ? prefix+"." : "";

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
          // this.getVariable(prefix + tokens_i_value);
          this.getVariable(tokens_i_value);
        } 
      }
      ////////////////////////////////////////////////////////////////////////////////
      
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Asignation (one equal sign)
      //
      ////////////////////////////////////////////////////////////////////////////////
      if ( (tokens_i_type === asignType) && (asignation) ) {
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
            while ((lastNode.parent) && (this.getPrecedence(lastNode.parent.value) >= this.getPrecedence(node.value))){
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
          console.log("Error1: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
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
            console.log("Error2: en la expresion <<" + input + ">>, en el token ["+ i +"] {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
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
          console.log("Error3: en la expresion <<" + input + ">>, en el token (valor:" + tokens_i_value + ", tipo:" + tokens_i_type);
        }
        
        // the tree has some element
        else {
          // find the correspondign open parentheses
          while (lastNode && lastNode.parent && (lastNode.value != "(")) {
            lastNode = lastNode.parent;
          }
          
          // if find the parentheses match
          if ((lastNode) && (lastNode.value === "(")) {
            lastNode.value = "()";
          }
          
          // if not find the parentheses match
          else {
            console.log("Error4: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
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
          console.log("Error5: en la expresion <<" + input + ">>, en el token (valor:" + tokens_i_value + ", tipo:" + tokens_i_type);
        }
        
        // the tree has some element
        else {
          // find the correspondign square brackets
          while (lastNode && lastNode.parent && (lastNode.value != "[")) {
            lastNode = lastNode.parent;
          }
          
          // if find the square brackets
          if ((lastNode) && (lastNode.value === "[")) {
            lastNode.value = "[]";
          }
          
          // if not find the square brackets
          else {
            console.log("Error6: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
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
          // node = new descartesJS.Node(tokens_i_type, prefix + tokens_i_value);
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
            console.log("Error7: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
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
            console.log("Error8: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");  //throw("Error: no se puede iniciar una expresion con un operador <<" + input + ">>")
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
            while ((lastNode.parent) && (this.getPrecedence(lastNode.parent.value) >= this.getPrecedence(node.value))){
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
            console.log("Error9: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
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
            while ((lastNode.parent) && (this.getPrecedence(lastNode.parent.value) > this.getPrecedence(node.value))){
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
            while (lastNode && lastNode.parent && (lastNode.value != "?")) {
              lastNode = lastNode.parent;
            }
            // if can find the ?
            if ((lastNode) && (lastNode.value === "?")) {
              lastNode.value = "?:";
            }
            
            // if can not find the ?
            else {
              console.log("Error10: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
              break;
            }
          }
        }
      
        // last element do not exist
        else {
          console.log("Error11: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
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
          console.log("Error12: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
          break;
        }
        
        // continue with the next token
        continue;
      }
      
      console.log("Error13: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
      break;
    }
    
    // missing or too many parentheses or square brackets
    if (openParentesis > 0) {
      alert("Error, faltan parentesis por cerrar: " + input);
    }
    if (openParentesis < 0) {
      alert("Error, faltan parentesis por abrir: " + input);
    }
    
    if (openSquareBracket > 0) {
      alert("Error, faltan square bracketss por cerrar: " + input);
    }
    if (openSquareBracket < 0) {
      alert("Error, faltan square bracketss por abrir: " + input);
    }
    // miss the second term of the conditional
    if (openConditional !=0) {
      alert("Error, condicional incompleta: " + input);
    }

    root = (lastNode) ? lastNode.getRoot() : null;
    if (root) {
      root.setAllEvaluateFunction();
    }

    return root;
  }

  /**
   * Get the precedence of an operator
   * @param {String} op the operator to get the precedence
   * @return {Number} return a number that represent the precedence
   */
  descartesJS.Parser.prototype.getPrecedence = function(op) {
    switch(op){
      case "=":  return 1;
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
      case "^":  return 8;
      case "%":  return 8;
      default:   return 9;
    }
  }

  /**
   * Register the default variables and functions of Descartes
   */
  descartesJS.Parser.prototype.registerDefaultValues = function() {
    // register the default variables
    this.variables["rnd"] = Math.random;
    this.variables["pi"] = Math.PI;
    this.variables["e"] = Math.E;
    this.variables["Infinity"] = Infinity;
    this.variables["-Infinity"] = -Infinity;
    
    // register the default funtions
    this.functions["sqr"]   = function(x) { return (x*x) };
    this.functions["sqrt"]  = this.functions["raíz"] = Math.sqrt;
    this.functions["exp"]   = Math.exp;
    this.functions["log"]   = Math.log;
    this.functions["log10"] = function(x) { return Math.log(x)/Math.log(10); };
    this.functions["abs"]   = Math.abs;
    this.functions["ent"]   = Math.floor;
    this.functions["sgn"]   = function(x) { return (x>0) ? 1 : ((x<0) ? -1 : 0); };
    this.functions["ind"]   = function(x) { return (x) ? 1 : 0 };
    this.functions["sin"]   = this.functions["sen"] = Math.sin;
    this.functions["cos"]   = Math.cos;
    this.functions["tan"]   = Math.tan;
    this.functions["cot"]   = function(x) { return 1/Math.tan(x); };
    this.functions["sec"]   = function(x) { return 1/Math.cos(x); };
    this.functions["csc"]   = function(x) { return 1/Math.sin(x); };
    this.functions["sinh"]  = this.functions["senh"] = function(x) { return (Math.exp(x)-Math.exp(-x))/2 };
    this.functions["cosh"]  = function(x) { return (Math.exp(x)+Math.exp(-x))/2; };
    this.functions["tanh"]  = function(x) { return (Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x)); };
    this.functions["coth"]  = function(x) { return 1/this.functions.tanh(x); };
    this.functions["sech"]  = function(x) { return 1/this.functions.cosh(x); };
    this.functions["csch"]  = function(x) { return 1/this.functions.sinh(x); };
    this.functions["asin"]  = this.functions["asen"] = Math.asin;
    this.functions["acos"]  = Math.acos;
    this.functions["atan"]  = Math.atan;
    this.functions["min"]   = Math.min;
    this.functions["max"]   = Math.max;

    // new internal functions
    var self = this;
    this.functions["_Trace_"] = function(x) { console.log(x); };
    this.functions["_Stop_Audios_"] = function() { self.evaluator.parent.stopAudios(); };
    ////////////////////////////////////////

    // function for the dialog
    this.functions["esCorrecto"] = function(x, y, regExp) { return descartesJS.esCorrecto(x, y, self.evaluator, regExp); };
    this.functions["escorrecto"] = function(x, y, regExp) { return descartesJS.escorrecto(x, y, self.evaluator, regExp); };

    // if the lesson is inside a iframe then register the comunication functions with the parent
    if (window.parent !== window) {

      // function to set a variable value to the parent
      this.functions["parent.set"] = function(varName, value) {
        window.parent.postMessage({ type: "set", name: varName, value: value }, '*');
      }

      // // function to get a variable value from the parent
      // this.functions["parent.get"] = function(varName) {
      //   if (this.parent.cacheVars[varName]) {
      //     return this.parent.cacheVars[varName];
      //   }

      //   window.parent.postMessage({ type: "get", name: varName }, '*');
      //   return 0;
      // }
      
      // function to update the parent
      this.functions["parent.update"] = function() {
        window.parent.postMessage({ type: "update" }, '*');
      }

      // function to execute a function in the parent
      this.functions["parent.exec"] = function(functionName, functionParameters) {
        window.parent.postMessage({ type: "exec", name: functionName, value: functionParameters }, '*');
      }
    }
  }  

//  console.log(((new descartesJS.Parser).parse("(t,func(t))")).toString());
// console.log(((new descartesJS.Parser).parse("((Aleat=0)&(Opmult=2)|(Aleat=1)&(Opmult=3))\nVerError=(Opm_ok=0)\nPaso=(Opm_ok=1)?Paso+1:Paso")).toString());

  return descartesJS;
})(descartesJS || {});