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
  descartesJS.Parser = function(evaluator) {
    this.evaluator = evaluator;
    
    this.tokenizer = new descartesJS.Tokenizer();
    this.vectors = {};
    this.matrices = {};
    this.variables = {};
    this.functions = {};
    
    this.variables["rnd"] = Math.random;
    this.variables["pi"] = Math.PI;
    this.variables["e"] = Math.E;
    this.variables["Infinity"] = Infinity;
    this.variables["-Infinity"] = -Infinity;
    
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
        
    this.functions["esCorrecto"] = function(x, y) { return descartesJS.esCorrecto(x, y); };
    this.functions["escorrecto"] = function(x, y) { return descartesJS.escorrecto(x, y); };

    // si la leccion se encuentra dentro de un frame hay que registrar las funciones de comunicacion con el padre
    if (window.parent.location.href !== window.location.href) {

      // se registra la funcion para asignar un valor a una variable del padre
      this.functions["parent.set"] = function(varName, value) {
        window.parent.postMessage({ type: "set", name: varName, value: value }, '*');
      }
      
      // se registra la funcion para actualizar al padre
      this.functions["parent.update"] = function() {
        window.parent.postMessage({ type: "update" }, '*');
      }
            
      // se registra la funcion para obtener el valor de una variable del padre
      this.functions["parent.get"] = function(varName, value) {
        window.parent.postMessage({ type: "get", name: varName, value: value }, '*');
      }
            
      // se registra la funcion para ejecutar funciones del padre
      this.functions["parent.exec"] = function(functionName, functionParameters) {
        window.parent.postMessage({ type: "exec", name: functionName, value: functionParameters }, '*');
      }
            
    }
  }
  
  /**
   * 
   */
  descartesJS.Parser.prototype.setVariable = function(name, value){
    this.variables[name] = value;
  }

  /**
   * 
   */
  descartesJS.Parser.prototype.getVariable = function(name){
    // if (!this.variables.hasOwnProperty(name)) {
    //   this.variables[name] = 0;
    // }
    return this.variables[name];
  }

  /**
   * 
   */
  descartesJS.Parser.prototype.setVector = function(name, pos, value){
    this.vectors[name][pos] = value;
  }

  /**
   * 
   */
  descartesJS.Parser.prototype.getVector = function(name){
    if (!this.vectors.hasOwnProperty(name)) {
      this.vectors[name] = [0,0,0];
    }
    return this.vectors[name];
  }

  /**
   * 
   */
  descartesJS.Parser.prototype.setMatrix = function(name, pos1, pos2, value){
    this.matrices[name][pos1][pos2] = value;
  }

  /**
   * 
   */
  descartesJS.Parser.prototype.getMatrix = function(name){
    if (!this.matrices.hasOwnProperty(name)) {
      this.matrices[name] = [[0,0,0],[0,0,0],[0,0,0]];
    }
    return this.matrices[name];
  }

  /**
   * 
   */
  descartesJS.Parser.prototype.setFunction = function(name, value){
    this.functions[name] = value;
  }

  /**
   * 
   */
  descartesJS.Parser.prototype.getFunction = function(name){
    if (!this.functions.hasOwnProperty(name)) {
      this.functions[name] = function(){return 0;};
    }
    return this.functions[name];
  }
 
  /**
   * 
   */
  descartesJS.Parser.prototype.parse = function(input, asignation, prefix) {
    prefix = (prefix) ? prefix+"." : "";

    var tokens = this.tokenizer.tokenize(input);
    // tokens es undefined
    if (!tokens) {
      tokens = [];
    }
    var lastNode = null;
    var node;
    var asignation = !asignation || false;
    var count = 0;
    
    var openParentesis = 0;
    var openSquareBracket = 0;
    var openConditional = 0;
    
    var tokens_i;
    var tokens_i_value;
    var tokens_i_type;

    for (var i=0, l=tokens.length; i<l; i++) {
      tokens_i = tokens[i];
      tokens_i_value = tokens_i.value;
      tokens_i_type = tokens_i.type;
      
      ////////////////////////////////////////////////////////////////////////////////      
      // se verifica si las variables existen
      ////////////////////////////////////////////////////////////////////////////////      
      if (tokens_i_type == "identifier") {
        // el identificador es una funcion
        if ( ((i+1)<l) && (tokens[i+1].type == "parentheses") && (tokens[i+1].value == "(") ) {
          this.getFunction(tokens_i_value);
        }
        // el identificador es un vector o una matriz
        else if ( ((i+1)<l) && (tokens[i+1].type == "square_bracket") && (tokens[i+1].value == "[") ) {
          // vector
          if ( (tokens[i+3]) && (tokens[i+3].type == "square_bracket") && (tokens[i+3].value == "]") ) {
            this.getVector(tokens_i_value);
          }
          // matriz
          else {
            this.getMatrix(tokens_i_value);
          }
        }
        // el identificador es una variable
        else {
          this.getVariable(prefix + tokens_i_value);
        } 
      }
      ////////////////////////////////////////////////////////////////////////////////
      
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Asignacion (un igual =)
      //
      ////////////////////////////////////////////////////////////////////////////////
      if ( (tokens_i_type == "asign") && (asignation) ) {
        tokens_i_type = "compOperator";
        tokens_i_value = "==";
      }
      if (tokens_i_type == "asign") {
        node = new descartesJS.Node(tokens_i_type, tokens_i_value);
        
        //hay algun elemento en el arbol
        if (lastNode != null) {
          //el ultimo elemento en el arbol es un identificador
          if (lastNode.type == "identifier") {
            if (lastNode.parent){
              lastNode.parent.replaceLastChild(node);
            } 
            
            node.addChild(lastNode);
            lastNode = node;
            asignation = true;
          }
            
          else if (lastNode.type == "square_bracket") {
            node.addChild(lastNode.parent);
            lastNode = node;
            asignation = true;            
          }
          
          //cualquier otro caso
          else {
            node.type = "compOperator";
            node.value = "==";
            asignation = true;
            
            //se busca un elemento en el arbol que tengo una precedencia mayor que la del nuevo nodo a agregar
            while ((lastNode.parent) && (this.precedence(lastNode.parent.value) >= this.precedence(node.value))){
              lastNode = lastNode.parent;
            }
            //se encontro un ancestro en el arbol con precedencia mayor que el nodo a insertar
            if (lastNode.parent){
              lastNode.parent.replaceLastChild(node);
              node.addChild(lastNode);
              lastNode = node;
            }
            
            //se llego a la raiz
            else {
              node.addChild(lastNode);
              lastNode = node;
            }
          }
        } 
        
        //No hay ultimo elemento
        else {
          console.log("Error1: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
          break;
        }
      
        //se continua con el siguiente token
        continue;
      }
    
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Parentesis, funciones, vectores y matrices
      //
      ////////////////////////////////////////////////////////////////////////////////
      //parentesis y corchetes que abren
      if ( (tokens_i_type == "parentheses") && (tokens_i_value == "(") || 
        (tokens_i_type == "square_bracket") && (tokens_i_value == "[") ) {
        node = new descartesJS.Node(tokens_i_type, tokens_i_value);
      
        if (tokens_i_value == "(") {
          openParentesis++;
        }
        
        if (tokens_i_value == "[") {
          openSquareBracket++;
        }
      
        //el primer elemento en el arbol
        if (lastNode == null) {
          if (tokens_i_value == "(") {
            var tempNode = new descartesJS.Node("(expr)", "(expr)");
            tempNode.addChild(node);
          }

          if (tokens_i_value == "[") {
            var tempNode = new descartesJS.Node("[expr]", "[expr]");
            tempNode.addChild(node);
          }
          
          lastNode = node;
        }
        //hay algun elemento en el arbol
        else {
          //el ultimo elemento en el arbol es un operador
          if ( (lastNode.type == "operator") || (lastNode.type == "boolOperator") || (lastNode.type == "compOperator") || (lastNode.type == "conditional") || (lastNode.type == "asign") ) {
            lastNode.addChild(node);
            lastNode = node;
          }
          
          //el ultimo elemento es un signo
          else if (lastNode.type == "sign") {
            lastNode.addChild(node);
            lastNode = node;
          }

          //el ultimo elemento en el arbol es un parentesis que abre
          else if ((lastNode.type == "parentheses") && (lastNode.value == "(")) {
            lastNode.addChild(node);
            lastNode = node;
          }
          
          //el ultimo elemento en el arbol es un parentesis que abre
          else if ((lastNode.type == "square_bracket") && (lastNode.value == "[")) {
            lastNode.addChild(node);
            lastNode = node;
          }
          
          //el ultimo elemento en el arbol es un parentesis cerrado
          else if ((lastNode.type == "parentheses") && (lastNode.value == "()")) {
            lastNode.parent.addChild(node);
            lastNode = node;
          }

          //el ultimo elemento en el arbol es un corchete cerrado
          else if ((lastNode.type == "square_bracket") && (lastNode.value == "[]")) {
            lastNode.parent.addChild(node);
            lastNode = node;
          }

          //el ultimo elemento en el arbol es un identificador
          else if (lastNode.type == "identifier") {
            lastNode.addChild(node);
            lastNode = node;
          }
          
          //cualquier otro caso
          else {
            console.log("Error2: en la expresion <<" + input + ">>, en el token ["+ i +"] {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }
        
        //se continua con el siguiente token
        continue;
      }
      
      //parentesis que cierran
      else if ((tokens_i_type == "parentheses") && (tokens_i_value == ")")) {

        openParentesis--;

        //el primer elemento en el arbol
        if (lastNode == null) {
          console.log("Error3: en la expresion <<" + input + ">>, en el token (valor:" + tokens_i_value + ", tipo:" + tokens_i_type);
        }
        
        //hay algun elemento en el arbol
        else {
          //se busca el parentesis que abre correspondiente
          while (lastNode && lastNode.parent && (lastNode.value != "(")) {
            lastNode = lastNode.parent;
          }
          
          //se encontro la pareja del parentesis
          if ((lastNode) && (lastNode.value == "(")) {
            lastNode.value = "()";
          }
          
          //no se encontro la pareja del parentesis
          else {
            console.log("Error4: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }
        
        //se continua con el siguiente token
        continue;
      }
      
      //corchetes que cierran
      else if ((tokens_i_type == "square_bracket") && (tokens_i_value == "]")) {

        openSquareBracket--;
        
        //el primer elemento en el arbol
        if (lastNode == null) {
          console.log("Error5: en la expresion <<" + input + ">>, en el token (valor:" + tokens_i_value + ", tipo:" + tokens_i_type);
        }
        
        //hay algun elemento en el arbol
        else {
          //se busca el corchete que abre correspondiente
          while (lastNode && lastNode.parent && (lastNode.value != "[")) {
            lastNode = lastNode.parent;
          }
          
          //se encontro la pareja del corchete
          if ((lastNode) && (lastNode.value == "[")) {
            lastNode.value = "[]";
          }
          
          //no se encontro la pareja del corchete
          else {
            console.log("Error6: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }
      
        //se continua con el siguiente token
        continue;
      }
  
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Numeros, cadenas e identificadores
      //
      ////////////////////////////////////////////////////////////////////////////////
      if ((tokens_i_type == "number") || (tokens_i_type == "string") || (tokens_i_type == "identifier")) {
        if (tokens_i_type == "identifier") {
          node = new descartesJS.Node(tokens_i_type, prefix + tokens_i_value);
        }
        else {
          node = new descartesJS.Node(tokens_i_type, tokens_i_value);
        }

        //el primer elemento en el arbol
        if (lastNode == null) {
          lastNode = node;
        }
        
        //hay algun elemento en el arbol
        else {
          //el ultimo elemento en el arbol es un operador, es un parentesis que abre, es un signo o asignacion
          if ( (lastNode.type == "operator") || (lastNode.type == "compOperator") || (lastNode.type == "boolOperator") || ((lastNode.type == "parentheses") && (lastNode.value == "(")) || ((lastNode.type == "square_bracket") && (lastNode.value == "[")) || (lastNode.type == "sign")  || (lastNode.type == "conditional") || (lastNode.type == "asign")) {
            lastNode.addChild(node);
            lastNode = node;
          }
          
          //cualquier otro caso
          else {
            console.log("Error7: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }
      
        //se continua con el siguiente token
        continue;
      }

      ////////////////////////////////////////////////////////////////////////////////
      //
      // Operadores
      //
      ////////////////////////////////////////////////////////////////////////////////
      if ( (tokens_i_type == "operator") || (tokens_i_type == "compOperator") || (tokens_i_type == "boolOperator") ) {
        node = new descartesJS.Node(tokens_i_type, tokens_i_value);
        
        //el primer elemento en el arbol
        if (lastNode == null) {
          //un operador puede empezar una expresion solamente si indica el signo de la expresion
          if ((tokens_i_value == "-") || (tokens_i_value == "+")){
            node.type = "sign";
            node.value = "sign" + tokens_i_value;
            lastNode = node;
          } 
            
          //un operador puede empezar una expresion si es una negacion booleana
          else if (tokens_i_value == "!") {
            lastNode = node;
          }
            
          else {
            console.log("Error8: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");  //throw("Error: no se puede iniciar una expresion con un operador <<" + input + ">>")
            break;
          }
        }
        
        //hay algun elemento en el arbol
        else {
          //el ultimo elemento en el arbol es un operador o un parentesis que abre y el operador es un + o -
          if ( (lastNode.type == "operator") || (lastNode.type == "compOperator") || (lastNode.type == "boolOperator") || (lastNode.type == "asign") || (lastNode.type == "conditional") || (((lastNode.type == "square_bracket") && (lastNode.value == "[")) && ((tokens_i_value == "-") || (tokens_i_value == "+") || (tokens_i_value == "!"))) || (((lastNode.type == "parentheses") && (lastNode.value == "(")) && ((tokens_i_value == "-") || (tokens_i_value == "+") || (tokens_i_value == "!"))) ) {
            //signo de una expresion
            if ((tokens_i_value == "-") || (tokens_i_value == "+")){
              node.type = "sign";
              node.value = "sign" + tokens_i_value;
            }
            lastNode.addChild(node);
            lastNode = node;
          }
            
          //el ultimo elemento en el arbol es un numero, una expresion entre parentesis, una cadena o un identificador
          else if ( (lastNode.type == "number") || ((lastNode.type == "parentheses") && (lastNode.value == "()")) || ((lastNode.type == "square_bracket") && (lastNode.value == "[]")) || (lastNode.type == "string") || (lastNode.type == "identifier") || (lastNode.type == "conditional") ||(lastNode.type == "asign") ) {
              
            //se busca un elemento en el arbol que tengo una precedencia mayor que la del nuevo nodo a agregar
            while ((lastNode.parent) && (this.precedence(lastNode.parent.value) >= this.precedence(node.value))){
              lastNode = lastNode.parent;
            }
              
            //se encontro un ancestro en el arbol con precedencia mayor que el nodo a insertar
            if (lastNode.parent){
              lastNode.parent.replaceLastChild(node);
              node.addChild(lastNode);
              lastNode = node;
            }
              
            //se llego a la raiz
            else {
              node.addChild(lastNode);
              lastNode = node;
            }
          }
            
          //cualquier otro caso
          else {
            console.log("Error9: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }
        
        //se continua con el siguiente token
        continue;
      }
    
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Condicional
      //
      ////////////////////////////////////////////////////////////////////////////////
      if (tokens_i_type == "conditional") {
        node = new descartesJS.Node(tokens_i_type, tokens_i_value);
        
        //hay algun elemento en el arbol
        if (lastNode != null) {
          //el operador es ?
          if (node.value == "?") {
            openConditional++;
            
            //se busca un elemento en el arbol que tengo una precedencia mayor que la del nuevo nodo a agregar
            while ((lastNode.parent) && (this.precedence(lastNode.parent.value) > this.precedence(node.value))){
              lastNode = lastNode.parent;
            }
            //se encontro un ancestro en el arbol con precedencia mayor que el nodo a insertar
            if (lastNode.parent){
              lastNode.parent.replaceLastChild(node);
              node.addChild(lastNode);
              lastNode = node;
            }
            
            //se llego a la raiz
            else {
              node.addChild(lastNode);
              lastNode = node;
            }
          } else {
            openConditional--;
            
            //se busca el signo ? correspondiente
            while (lastNode && lastNode.parent && (lastNode.value != "?")) {
              lastNode = lastNode.parent;
            }
            //se encontro el ?
            if ((lastNode) && (lastNode.value == "?")) {
              lastNode.value = "?:";
            }
            
            //no se encontro el ?
            else {
              console.log("Error10: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
              break;
            }
          }
        }
      
        //No hay ultimo elemento
        else {
          console.log("Error11: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
          break;
        }
    
        //se continua con el siguiente token
        continue;
      }
  
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Separador (coma ,)
      //
      ////////////////////////////////////////////////////////////////////////////////
      if (tokens_i_type == "separator") {
        //hay algun elemento en el arbol
        if (lastNode != null) {
          //se busca en el arbol un parentesis que abre
          while ( (lastNode.parent) && (lastNode.value != "(") && (lastNode.value != "[") ) {
            lastNode = lastNode.parent;
          }
        }
        
        else {
          console.log("Error12: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
          break;
        }
        
        //se continua con el siguiente token
        continue;
      }
      
      console.log("Error13: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
      break;
    }
    
    // faltaron o sobraron parentesis o corchetes
    if (openParentesis > 0) {
      alert("Error, faltan parentesis por cerrar: " + input);
    }
    if (openParentesis < 0) {
      alert("Error, faltan parentesis por abrir: " + input);
    }
    
    if (openSquareBracket > 0) {
      alert("Error, faltan corchetes por cerrar: " + input);
    }
    if (openSquareBracket < 0) {
      alert("Error, faltan corchetes por abrir: " + input);
    }
    // falto el segundo termino de la condiciona
    if (openConditional !=0) {
      alert("Error, condicional incompleta: " + input);
    }

    var root = (lastNode) ? lastNode.getRoot() : null;
    if (root) {
      root.setAllEvaluateFunction();
    }

    return root;
  }

  /**
   * Obtiene la precedencia de un operador
   */
  descartesJS.Parser.prototype.precedence = function(op) {
    switch(op){
      case "=":  return 1;
      case "(":  return 2;
      case "[":  return 2;
      case "?":  return 2;
      case ":":  return 3;
      case "?:": return 3;
      case "&":  return 6; //checar precedencia
      case "|":  return 6; //checar precedencia
      case "<":  return 4;
      case "<=": return 4;
      case ">":  return 4;
      case ">=": return 4;
      case "==": return 4;
      case "!=": return 4;
      case "+":  return 5;
      case "-":  return 5;
      case "/":  return 6;
      case "*":  return 6;
      case "sign-": return 6;
      case "sign+": return 6;
      case "!":  return 7;
      case "^":  return 7;
      case "%":  return 7;
      default:   return 8;
    }
  }

//  console.log(((new descartesJS.Parser).parse("(t,func(t))")).toString());
//  console.log(((new descartesJS.Parser).parse("3^2%5")).toString());
//  console.log(((new descartesJS.Parser).parse("!0*1")).toString());
//  console.log(((new descartesJS.Parser).parse("  1 / ( a + (c-d) / (e-f) * G / H )")).toString());
//  console.log(((new descartesJS.Parser).parse("((varX1/sqrt(sqr(varX1)+sqr(varX2)+0.001))/( sqr(varX1)+sqr(varX2)+0.001)+((varX1-punto.x)/sqrt(sqr(varX1-punto.x)+sqr(varX2-punto.y)+0.001))/( sqr(varX1-punto.x)+sqr(varX2-punto.y)+0.001))")).toString()); 
//  console.log(((new descartesJS.Parser).parse("[0,(")).toString());
// console.log(((new descartesJS.Parser).parse("-(2)*2/3")).toString());//^2
// console.log(((new descartesJS.Parser).parse("-2^2")).toString());
// console.log(((new descartesJS.Parser).parse("2pi")).toString());
// console.log(((new descartesJS.Parser).parse("s=p1?1:s1")).toString());

  return descartesJS;
})(descartesJS || {});
