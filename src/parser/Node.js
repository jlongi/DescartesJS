/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evalArgument;
  var evalCache = {};

  var mathFloor = Math.floor;
  var lastChildIndex;
  var newRoot;
  var root;
  var right;
  descartesJS.fullDecimals = false;
  
  /**
   * Nodes of a parse tree
   * @param {String} type the type of the node
   * @param {Object} value the value of the node
   * @constructor 
   */
  descartesJS.Node = function(type, value) {
    this.sep = "";
    this.type = type;
    this.value = value;
    this.parent = null;
    this.childs = [];
  }

  /**
   * Get the root of the parse tree
   * @return {Node} return the root of the parse tree
   */
  descartesJS.Node.prototype.getRoot = function() {
    if (this.parent === null) {
      return this;
    }
    return this.parent.getRoot();
  }

  /**
   * Add a child to the parse tree
   * @param {Node} child the child that want to add
   */
  descartesJS.Node.prototype.addChild = function(child) {
    child.parent = this;
    this.childs.push(child);
  }
  
  /**
   * Replace the last child in the parse tree with a new node
   * @param {Node} child the new child to replace the last child in the parse tree
   */
  descartesJS.Node.prototype.replaceLastChild = function(child) {
    lastChildIndex = this.childs.length-1,
    lastChild = this.childs[lastChildIndex];
  
    lastChild.parent = null;
    this.childs[lastChildIndex] = child;
    child.parent = this;

    return child;
  }

  /**
   * Decide if the parse tree contains a node with some value
   * @param {Node} value the value to find in the parse tree
   * @return {Boolean} return true if the value is in the parse tree or false if not
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
   * Converts a parse tree with an equal operator as principal operator in a parse tree with a minus operator as a principal operator
   * @return {Node} return a new parse tree with the convertion of the principal operator
   */
  descartesJS.Node.prototype.equalToMinus = function() {
    if (this.type === "compOperator") {
      this.type = "operator";
      this.value = "-";
      
      root = new descartesJS.Node("compOperator", "==");
      right = new descartesJS.Node("number", "0");
      
      root.addChild(this);
      root.addChild(right);

      newRoot = this.getRoot();
      newRoot.setAllEvaluateFunction();
      
      return newRoot;
    }

    return this;
  }

  /**
   * Register the evaluation functions to all the nodes in the tree
   */
   descartesJS.Node.prototype.setAllEvaluateFunction = function() {
    this.setEvaluateFunction();

    for (var i=0, l=this.childs.length; i<l; i++) {
      this.childs[i].setAllEvaluateFunction();
    }
  }

  /**
   * Set the apropiate evaluate function for the node
   * 
   */
  descartesJS.Node.prototype.setEvaluateFunction = function() {
    // number
    if (this.type === "number") {
      this.evaluate = function(evaluator) {
        return parseFloat(this.value);
      }
    }
    
    // string
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
        var variableValue;
        this.evaluate = function(evaluator, getMatrix) {
          variableValue = evaluator.variables[this.value];

          // the variable has an auxiliar variable value
          if ((typeof(variableValue) === "object") && (variableValue.length == undefined)) {
            return variableValue.evaluate(evaluator);
          }

          // if the name of the variable is the name of a matrix, for matrix operations
          // if ((getMatrix) && (evaluator.matrices[this.value])) {
          //   variableValue = evaluator.matrices[this.value];
          // }

          if (variableValue == undefined) {
            if (getMatrix || evaluator.matrices[this.value]) {
              variableValue = evaluator.matrices[this.value];
            }
            else if (evaluator.vectors[this.value]) {
              variableValue = evaluator.vectors[this.value];
            }
          }

          return (variableValue !== undefined) ? variableValue : 0; 
        }
      }
    }
    
    // vector
    else if ( (this.type === "identifier") && (this.childs[0].type === "square_bracket") && (this.childs[0].childs.length === 1)) {
      var pos;
      var value;
      this.evaluate = function(evaluator) {
        pos = this.childs[0].childs[0].evaluate(evaluator);

        try {
          value = evaluator.vectors[this.value][(pos<0) ? 0 : mathFloor(pos)];
          return (value !== undefined) ? value : 0;
        }
        catch(e) { 
          return 0; 
        }
      }
    }
    
    // matrix
    else if ( (this.type === "identifier") && (this.childs[0].type === "square_bracket") && (this.childs[0].childs.length > 1)) {
      var pos1;
      var pos2;
      var value;
      this.evaluate = function(evaluator) {
        pos1 = this.childs[0].childs[0].evaluate(evaluator);
        pos2 = this.childs[0].childs[1].evaluate(evaluator);

        try {
          value = evaluator.matrices[this.value][(pos1<0) ? 0 : mathFloor(pos1)][(pos2<0) ? 0 : mathFloor(pos2)]; 
          return (value !== undefined) ? value : 0;
        }
        catch(e) {
          return 0;
        }
      }
    }
    
    // function
    else if ( (this.type === "identifier") && (this.childs[0].type === "parentheses") ) {
      var argu;
      var _asign;

      this.evaluate = function(evaluator) {
        argu = [];
        for (var i=0, l=this.childs[0].childs.length; i<l; i++) {
          argu[i] = this.childs[0].childs[i].evaluate(evaluator);
        }

        // _Eval_
        if (this.value === "_Eval_") {
          // argu[0] = (argu.length > 0) ? argu[0].toString() : '';
          // evalArgument = argu[0].replace(evaluator.parent.decimal_symbol_regexp, ".");
          evalArgument = (argu.length > 0) ? argu[0] : 0;

          if (typeof(evalArgument) == "number") {
            return "NaN";
          }
          else {
            if (evalCache[evalArgument] == undefined) {
              _asign = (evalArgument.match(/:=/g)) ? true : false;
              evalCache[evalArgument] = evaluator.parser.parse(evalArgument, _asign);
            }

            return evaluator.evalExpression( evalCache[evalArgument] ) || NaN;
          }
        }

        return evaluator.functions[this.value].apply(evaluator, argu);
      }
    }
    
    // operator
    else if (this.type === "operator") {
      if (this.value === "+") {
        this.evaluate = function(evaluator) {
          var op1 = this.childs[0].evaluate(evaluator, true);
          var op2 = this.childs[1].evaluate(evaluator, true);

          // numeric or string operation
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return op1 + op2;
          }
          // matix operation
          else {
            return sumMatrix(op1, op2);
          }
        }
      }
      else if (this.value === "-") {
        this.evaluate = function(evaluator) {
          var op1 = this.childs[0].evaluate(evaluator, true);
          var op2 = this.childs[1].evaluate(evaluator, true);

          // numeric operation
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return op1 - op2;
          }
          // matrix operation
          else {
            return substactMatrix(op1, op2);
          }
        }
      }
      else if (this.value === "*") {
        this.evaluate = function(evaluator) {
          var op1 = this.childs[0].evaluate(evaluator, true);
          var op2 = this.childs[1].evaluate(evaluator, true);

          // numeric operation
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return op1 * op2;
          }
          // matrix operation
          else {
            return multiplicationMatrix(op1, op2);
          }
        }
      }
      else if (this.value === "/") {
        this.evaluate = function(evaluator) {
          var op1 = this.childs[0].evaluate(evaluator, true);
          var op2 = this.childs[1].evaluate(evaluator, true);

          // numeric operation
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return op1 / op2;
          }
          // matrix operation
          else {
            return divisionMatriz(op1, op2);
          }
        }
      }
      else if (this.value === "%") {
        this.evaluate = function(evaluator) {
          var op1 = this.childs[0].evaluate(evaluator);
          var op2 = this.childs[1].evaluate(evaluator);
          return op1 - mathFloor(op1/op2)*op2;
        }
      }
      else if (this.value === "^") {
        this.evaluate = function(evaluator) {
          return Math.pow( this.childs[0].evaluate(evaluator), this.childs[1].evaluate(evaluator) );
        }
      }
    }
    
    // comparison operator
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
          return (this.childs[0].evaluate(evaluator) !== this.childs[1].evaluate(evaluator))+0;
        }
      }
    }
    
    // boolean operator
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
    
    // conditional
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
    
    // sign
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
    
    // parentheses
    else if (this.type === "parentheses") {
      this.evaluate = function(evaluator, getMatrix) {
        return this.childs[0].evaluate(evaluator, getMatrix);
      }
    }
    
    // expression of the type (x,y) or [x,y]
    else if ( (this.type === "(expr)") || (this.type === "[expr]") ) {
      this.evaluate = function(evaluator) {
        var l = this.childs.length;
        var result = [];
        var tmpRes;

        if ( (l === 1) && (this.childs[0].childs.length === 1) && (this.type === "(expr)") ) {
          result = this.childs[0].childs[0].evaluate(evaluator);
        }

        else {
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

    // asignation
    else if (this.type === "asign") {
      var ide;
      var expre;
      var pos;
      var tmpPos;
      var tmpPos0;
      var tmpPos1;
      var asignation;

      this.evaluate = function(evaluator) {
        ide = this.childs[0];
        expre = this.childs[1];

        if ((ide.childs.length === 1) && (ide.childs[0].type === "square_bracket")) {
          pos = ide.childs[0].childs;

          // vector 
          if (pos.length === 1) {
            tmpPos = pos[0].evaluate(evaluator);
            tmpPos = (tmpPos < 0) ? 0 : mathFloor(tmpPos);

            evaluator.vectors[ide.value][tmpPos] = expre.evaluate(evaluator);

            return;
          }

          // matrix
          else if (pos.length === 2) {
            tmpPos0 = pos[0].evaluate(evaluator);
            tmpPos1 = pos[1].evaluate(evaluator);
            tmpPos0 = (tmpPos0 < 0) ? 0 : mathFloor(tmpPos0);
            tmpPos1 = (tmpPos1 < 0) ? 0 : mathFloor(tmpPos1);

            // condition to handle wrong matrix access
            if (!evaluator.matrices[ide.value][tmpPos0]) {
              evaluator.matrices[ide.value][tmpPos0] = [];
            }
            evaluator.matrices[ide.value][tmpPos0][tmpPos1] = expre.evaluate(evaluator);

            return;
          }
        }
        else {
          asignation = expre.evaluate(evaluator);

          // the asignation is a variable
          if (!asignation.type) {

            // prevent to asign a value to an auxiliar variable
            if (typeof(evaluator.variables[ide.value]) !== "object") {
              evaluator.variables[ide.value] = asignation;
            }

          } 
          // the asignation is a matrix
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
  function createMatrix(rows, cols) {
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
  function sumMatrix(op1, op2) {
    rows = op1.rows;
    cols = op1.cols;
    result = createMatrix(rows, cols);

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
  function substactMatrix(op1, op2) {
    rows = op1.rows;
    cols = op1.cols;
    result = createMatrix(rows, cols);

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
  function multiplicationMatrix(op1, op2) {
    rows = op1.rows;
    cols = op1.cols;
    result = createMatrix(rows, cols);
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
    var M = createMatrix(T.length-1, T.length-1);

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
    var S = createMatrix(T.length, T.length);
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
      return createMatrix(op1.rows, op1.cols);
    }

    return multiplicationMatrix(op1, inverse);
  }

  /**
   */
  descartesJS.Node.prototype.toString = function() {
    var str = "tipo: " + this.type + ", valor: " + this.value + "\n";
  
    this.sep = "   " + ((this.parent) ? (this.parent.sep) : "");
    for (var i=0, l=this.childs.length; i<l; i++) {
      str += this.sep +this.childs[i].toString();
    }
  
    return str;
  }  

  return descartesJS;
})(descartesJS || {});