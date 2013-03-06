/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * Un nodo que forma un arbol de parseo
   * @constructor 
   */
  descartesJS.Node = function (type, value) {
    this.sep = "";
    this.type = type;
    this.value = value;
    this.parent = null;
    this.childs = [];
  }

  /**
   * Obtiene el nodo raiz del arbol
   */
  descartesJS.Node.prototype.getRoot = function() {
    if (this.parent === null) {
      return this;
    }
    return this.parent.getRoot();
  }

  /**
   * Agrega un hijo al arbol
   * @param {descartesJS.Node} child el hijo que se quiere agregar
   */
  descartesJS.Node.prototype.addChild = function(child) {
    child.parent = this;
    this.childs.push(child);
  }
  
  /**
   * Reemplaza el ultimo nodo en el arbol por un nodo dado
   * @param {descartesJS.Node} child el nodo por el cual se reemplaza el ultimo nodo del arbol
   */
  descartesJS.Node.prototype.replaceLastChild = function(child) {
    var lastChildIndex = this.childs.length-1,
    lastChild = this.childs[lastChildIndex];
  
    lastChild.parent = null;
    this.childs[lastChildIndex] = child;
    child.parent = this;
    return child;
  }

  /**
   *
   */
   descartesJS.Node.prototype.setAllEvaluateFunction = function() {
    this.setEvaluateFunction();

    for (var i=0, l=this.childs.length; i<l; i++) {
      this.childs[i].setAllEvaluateFunction();
    }
   }

  /**
   * Muestra la representacion en cadena del arbol
   */
  descartesJS.Node.prototype.toString = function() {
    var str = "tipo: " + this.type + ", valor: " + this.value + "\n";
  
    this.sep = "   " + ((this.parent) ? (this.parent.sep) : "");
    for (var i=0, l=this.childs.length; i<l; i++) {
      str += this.sep +this.childs[i].toString();
    }
  
    return str;
  }

  /**
   * Dice si el arbol contiene el nodo especificado
   * @param {descartesJS.Node} value el valor a buscar en el arbol
   * @return {Boolean} true si el valor esta en el arbol o false si no esta
   */
  descartesJS.Node.prototype.contains = function(value) {
    if (this.value === value) {
      return true;
    } 
    
    for (var i=0, l=this.childs.length; i<l; i++) {
      if (this.childs[i].contains(value)) {
        return true;
      }
    }

    return false;
  }
    
  /**
   * Convirte un arbol con el operador principal igual (=) a una arbol con operador principal a menos (-)
   * @return {descartesJS.Node} el nuevo arbol donde se reemplazo el operador = por el -
   */
  descartesJS.Node.prototype.equalToMinus = function() {
    var newRoot;
    if (this.type === "compOperator") {
      this.type = "operator";
      this.value = "-";
      
      var root = new descartesJS.Node("compOperator", "==");
      var right = new descartesJS.Node("number", "0");
      
      root.addChild(this);
      root.addChild(right);

      newRoot = this.getRoot();
      newRoot.setAllEvaluateFunction();
      
      return newRoot;
    } 
    return this;
  }
  
  /**
   * 
   */
  descartesJS.Node.prototype.setEvaluateFunction = function() {
    // numero
    if (this.type === "number") {
      this.evaluate = function(evaluator) {
        return parseFloat(this.value);
      }
    }
    
    // cadena
    else if (this.type === "string") {
      this.evaluate = function(evaluator) {
        return this.value;
      }
    }
    
    // variable
    else if ( (this.type === "identifier") && (this.childs.length === 0) ) {
      if (this.value == "rnd") {
        this.evaluate = function(evaluator) {
          return Math.random();
        }
      }
      else {
        this.evaluate = function(evaluator, getMatrix) {
          var variableValue = evaluator.variables[this.value];

          if (typeof(variableValue) === "object") {
            return variableValue.evaluate(evaluator);
          }

          // si el nombre no se encuentra en las variables pero si en las matrices
          if ((variableValue == undefined) && (getMatrix)) {
            variableValue = evaluator.matrices[this.value];
            // console.log(variableValue)
          }

          return variableValue || 0; 
        }
      }
    }
    
    // vector
    else if ( (this.type === "identifier") && (this.childs[0].type === "square_bracket") && (this.childs[0].childs.length === 1)) {
      this.evaluate = function(evaluator) {
        var pos = this.childs[0].childs[0].evaluate(evaluator);
        var value;

        try {
          return evaluator.vectors[this.value][(pos<0) ? 0 : Math.floor(pos)] || 0;
        }
        catch(e) { 
          return 0; 
        }
      }
    }
    
    // matriz
    else if ( (this.type === "identifier") && (this.childs[0].type === "square_bracket") && (this.childs[0].childs.length > 1)) {
      this.evaluate = function(evaluator) {
        var pos1 = this.childs[0].childs[0].evaluate(evaluator);
        var pos2 = this.childs[0].childs[1].evaluate(evaluator);

        try {
          return evaluator.matrices[this.value][(pos1<0) ? 0 : Math.floor(pos1)][(pos2<0) ? 0 : Math.floor(pos2)] || 0;
        }
        catch(e) {
          return 0;
        }
      }
    }
    
    // funcion
    else if ( (this.type === "identifier") && (this.childs[0].type === "parentheses") ) {
      this.evaluate = function(evaluator) {
        var argu = [];
        for (var i=0, l=this.childs[0].childs.length; i<l; i++) {
          argu.push( this.childs[0].childs[i].evaluate(evaluator) );
        }
      
        if (this.value === "_Eval_") {
          return evaluator.parser.parse(argu[0])
        }

        return evaluator.functions[this.value].apply(evaluator, argu);
      }
    }
    
    // operador
    else if (this.type === "operator") {
      var op1;
      var op2;
      var result;

      if (this.value === "+") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator, true);
          op2 = this.childs[1].evaluate(evaluator, true);

          // operacion numerica o de cadenas
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return op1 + op2;
          }
          // operacion de matrices
          else {
            return sumaMatriz(op1, op2);
          }
        }
      }
      else if (this.value === "-") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator, true);
          op2 = this.childs[1].evaluate(evaluator, true);

          // operacion numerica
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return op1 - op2;
          }
          // operacion de matrices
          else {
            return restaMatriz(op1, op2);
          }
        }
      }
      else if (this.value === "*") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator, true);
          op2 = this.childs[1].evaluate(evaluator, true);

          // operacion numerica
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return op1 * op2;
          }
          // operacion de matrices
          else {
            return multiplicacionMatriz(op1, op2);
          }
        }
      }
      else if (this.value === "/") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator, true);
          op2 = this.childs[1].evaluate(evaluator, true);

          // operacion numerica
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return op1 / op2;
          }
          // operacion de matrices
          else {
            return divisionMatriz(op1, op2);
          }
        }
      }
      else if (this.value === "%") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator);
          op2 = this.childs[1].evaluate(evaluator);
          return op1 - Math.floor(op1/op2)*op2;
        }
      }
      else if (this.value === "^") {
        this.evaluate = function(evaluator) {
          return Math.pow( this.childs[0].evaluate(evaluator), this.childs[1].evaluate(evaluator) );
        }
      }
    }
    
    // operador de comparacion
    else if (this.type === "compOperator") {
      if (this.value === "<") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) < this.childs[1].evaluate(evaluator))+0;
        }
      }
      else if (this.value === "<=") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) <= this.childs[1].evaluate(evaluator))+0;
        }
      }
      else if (this.value === ">") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) > this.childs[1].evaluate(evaluator))+0;
        }
      }
      else if (this.value === ">=") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) >= this.childs[1].evaluate(evaluator))+0;
        }
      }
      else if (this.value === "==") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) === this.childs[1].evaluate(evaluator))+0;
        }
      }
      else if (this.value === "!=") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) != this.childs[1].evaluate(evaluator))+0;
        }
      }
    }
    
    // operador booleano
    else if (this.type === "boolOperator") {
      if (this.value === "&") {
        this.evaluate = function(evaluator) {
          var op1 = this.childs[0].evaluate(evaluator) ? 1 : 0;
          if (op1) {
            return (this.childs[1].evaluate(evaluator)) ? 1 : 0;
          }
          else {
            return 0;
          }
        }
      }

      else if (this.value === "|") {
        this.evaluate = function(evaluator) {
          var op1 = this.childs[0].evaluate(evaluator) ? 1 : 0;
          if (op1) {
            return 1;
          }
          else {
            return (this.childs[1].evaluate(evaluator)) ? 1 : 0;
          }
        }
      }

      else if (this.value === "!") { 
        this.evaluate = function(evaluator) {
          var op1 = this.childs[0].evaluate(evaluator) ? 1 : 0;
          return !op1+0; 
        }
      }
    }
    
    // condicional
    else if (this.type === "conditional") {
      this.evaluate = function(evaluator) {
        var op1 = this.childs[0].evaluate(evaluator);

        if (op1 > 0) {
          return this.childs[1].evaluate(evaluator);
        }
        else {
          return this.childs[2].evaluate(evaluator);
        }        
      }
    }
    
    // signo
    else if (this.type === "sign") {
      if (this.value === "sign+") {
        this.evaluate = function(evaluator) {
          return this.childs[0].evaluate(evaluator);
        }
      }
      else {
        this.evaluate = function(evaluator) {
          return -(this.childs[0].evaluate(evaluator));
        }
      }
    }
    
    // parentesis
    else if (this.type === "parentheses") {
      this.evaluate = function(evaluator, getMatrix) {
        return this.childs[0].evaluate(evaluator, getMatrix);
      }
    }
    
    // el nodo a evaluar es una expresion (x,y) o [x,y]
    else if ( (this.type === "(expr)") || (this.type === "[expr]") ) {
      this.evaluate = function(evaluator) {
        var l = this.childs.length;
        var result = [];

        if ( (l === 1) && (this.childs[0].childs.length === 1) && (this.type === "(expr)") ) {
          result = this.childs[0].childs[0].evaluate(evaluator);
        }

        else {
          var tmpRes;
          for (var i=0; i<l; i++) {
            tmpRes = [];
            for (var j=0, n=this.childs[i].childs.length; j<n; j++) {
              tmpRes.push( this.childs[i].childs[j].evaluate(evaluator));
            }
            result[i] = tmpRes;
          }
        }

        return result;
      }
    }

    // asignacion
    else if (this.type === "asign") {
      this.evaluate = function(evaluator) {
        var ide = this.childs[0];
        var expre = this.childs[1];

        if ((ide.childs.length === 1) && (ide.childs[0].type === "square_bracket")) {
          var pos = ide.childs[0].childs;

          // un vector 
          if (pos.length === 1) {
            var tmpPos = pos[0].evaluate(evaluator);
            tmpPos = (tmpPos < 0) ? 0 : Math.floor(tmpPos);

            evaluator.vectors[ide.value][tmpPos] = expre.evaluate(evaluator);

            return;
          }

          // una matriz
          else if (pos.length === 2) {
            var tmpPos0 = pos[0].evaluate(evaluator);
            var tmpPos1 = pos[1].evaluate(evaluator);
            tmpPos0 = (tmpPos0 < 0) ? 0 : Math.floor(tmpPos0);
            tmpPos1 = (tmpPos1 < 0) ? 0 : Math.floor(tmpPos1);
            evaluator.matrices[ide.value][tmpPos0][tmpPos1] = expre.evaluate(evaluator);

            return;
          }
        } 
        else {
          var asignation = expre.evaluate(evaluator);

          // la asignacion es una variable
          if (!asignation.type) {
            evaluator.variables[ide.value] = asignation;
          } 
          // la asignacion es una matriz
          else {
            evaluator.matrices[ide.value] = asignation;
          }

          return;
        }
      }
    }
  }

  var rows;
  var cols;
  var result;
  var i, j, k, l;

  /**
   *
   */
  function createMatriz(rows, cols) {
    result = [];
    result.type = "matrix";
    result.rows = rows;
    result.cols = cols;
    
    var vectInit;
    for (j=0, k=cols; j<k; j++) {
      vectInit = [];
      for (i=0, l=rows; i<l; i++) {
        vectInit.push(0);
      }
      result[j] = vectInit;
    }

    return result;
  }

  /**
   *
   */
  function sumaMatriz(op1, op2) {
    rows = op1.rows;
    cols = op1.cols;
    result = createMatriz(rows, cols);

    for (j=0; j<rows; j++){
      for (i=0; i<cols; i++) {
        result[i][j] = op1[i][j] + op2[i][j];
      }
    }

    return result;
  }

  /**
   *
   */
  function restaMatriz(op1, op2) {
    rows = op1.rows;
    cols = op1.cols;
    result = createMatriz(rows, cols);

    for (j=0; j<rows; j++){
      for (i=0; i<cols; i++) {
        result[i][j] = op1[i][j] - op2[i][j];
      }
    }

    return result;
  }

  /**
   *
   */
  function multiplicacionMatriz(op1, op2) {
    rows = op1.rows;
    cols = op1.cols;
    result = createMatriz(rows, cols);
    var sum;

    for (j=0; j<rows; j++){
      for (i=0; i<cols; i++) {
        sum = 0;
        for (k=0; k<cols; k++) {
          sum += op1[k][j]*op2[i][k];
        }
        result[i][j] = sum;
      }
    }

    return result;
  }

  /**
   *
   */
  function minor(I, J, T) {
    var M = createMatriz(T.length-1, T.length-1);

    for (var i=0, l=M.length; i<l; i++) {
      for (var j=0; j<l; j++) {
        if (i<I) {
          if (j<J) {
            M[i][j] = T[i][j];
          }
          else {
            M[i][j] = T[i][j+1];
          }
        }
        else {
          if (i<J) {
            M[i][j] = T[i+1][j];
          }
          else {
            M[i][j] = T[i+1][j+1];
          }
        }
      }
    }

    return M;
  }
  /**
   *
   */
  function determinant(T) {
    if (T.cols > 1) {
      var D = 0;
      var s = 1;
      for (var j=0, l=T.cols; j<l; j++) {
        D += s*T[0][j]*determinant(minor(0, j, T));
        s = -s;
      }
      return D;
    } else {
      return T[0][0];
    }
   }

  /**
   *
   */
  function inverseMatriz(T) {
    var S = createMatriz(T.length, T.length);
    var det = determinant(T);

    if (det === 0) {
      return 0;
    }

    var s = 1/det;
    var t;

    if (T.length > 1) {
      for (var i=0, l=T.length; i<l; i++) {
        t = s;
        for (var j=0; j<l; j++) {
          S[j][i] = t*determinant(minor(i, j, T));
          t = - t;
        }
        s = -s;
      }
    }
    else {
      S[0][0] = s;
    }

    return S;
  }  

  /**
   *
   */
  function divisionMatriz(op1, op2) {
    var inverse = inverseMatriz(op2);

    if (inverse === 0) {
      return createMatriz(op1.rows, op1.cols);
    }

    return multiplicacionMatriz(op1, inverse);
  }

  return descartesJS;
})(descartesJS || {});