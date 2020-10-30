/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evalCache = {};
  var MathFloor = Math.floor;
  var evalArgument;
  var lastChild;
  var lastChildIndex;
  var newRoot;
  var root;
  var rows;
  var cols;
  var result;
  var i, j, k, l;

  class Node {
    /**
     * Nodes of a parse tree
     * @param {String} type the type of the node
     * @param {Object} value the value of the node
     */
    constructor(type, value) {
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
    getRoot() {
      if (this.parent === null) {
        return this;
      }
      return this.parent.getRoot();
    }

    /**
     * Add a child to the parse tree
     * @param {Node} child the child that want to add
     */
    addChild(child) {
      child.parent = this;
      this.childs.push(child);
    }

    /**
     * Replace the last child in the parse tree with a new node
     * @param {Node} child the new child to replace the last child in the parse tree
     */
    replaceLastChild(child) {
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
    contains(value) {
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
     * @return {Node} return a new parse tree with the conversion of the principal operator
     */
    equalToMinus() {
      if (this.type === "compOperator") {
        this.type = "operator";
        this.value = "-";

        root = new Node("compOperator", "==");

        root.addChild(this);
        root.addChild(new Node("number", "0"));

        newRoot = this.getRoot();
        newRoot.setAllEvalFun();

        return newRoot;
      }

      return this;
    }

    /**
     * Register the evaluation functions to all the nodes in the tree
     */
    setAllEvalFun() {
      this.setEvalFun();

      for (var i=0, l=this.childs.length; i<l; i++) {
        this.childs[i].setAllEvalFun();
      }
    }

    /**
     * Set the appropriate evaluate function for the node
     *
     */
    setEvalFun() {
      // number
      if (this.type === "number") {
        this.evaluate = function() {
          return parseFloat(this.value);
        }
      }

      // string
      else if (this.type === "string") {
        this.evaluate = function() {
          return this.value.replace(/\\u0027/g, "'");
        }
      }

      // variable
      else if ( (this.type === "identifier") && (this.childs.length === 0) ) {
        if (this.value === "rnd") {
          this.evaluate = function() {
            return Math.random();
          }
        }
        else {
          var variableValue;
          this.evaluate = function(evaluator, getMatrix) {
            variableValue = evaluator.variables[this.value];

            // the variable has an auxiliary variable value
            if ((typeof(variableValue) === "object") && (variableValue.length == undefined)) {
              return variableValue.evaluate(evaluator);
            }

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
        var value;
        this.evaluate = function(evaluator) {
          try {
            value = evaluator.getVector(this.value, this.childs[0].childs[0].evaluate(evaluator));
            return (value !== undefined) ? value : 0;
          }
          catch(e) {
            return 0;
          }
        }
      }

      // matrix
      else if ( (this.type === "identifier") && (this.childs[0].type === "square_bracket") && (this.childs[0].childs.length > 1)) {
        var value;
        this.evaluate = function(evaluator) {
          try {
            value = evaluator.getMatrix( this.value, this.childs[0].childs[0].evaluate(evaluator), this.childs[0].childs[1].evaluate(evaluator) );
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
        var _assign;
        var tmp_ret;

        this.evaluate = function(evaluator) {
          argu = [];
          for (var i=0, l=this.childs[0].childs.length; i<l; i++) {
            argu[i] = this.childs[0].childs[i].evaluate(evaluator);
          }

          // _Eval_
          if (this.value === "_Eval_") {
            evalArgument = (argu.length > 0) ? argu[0] : 0;

            if (typeof(evalArgument) == "number") {
              return "NaN";
            }
            else {
              // check if the string is a number, then the argument needs to be a string
              if ( (evalArgument.match(",")) && (parseFloat(evalArgument.replace(",", ".")) == evalArgument.replace(",", ".")) ) {
                // evalArgument = "'" + evalArgument + "'";
                evalArgument = evalArgument.replace(",", ".");
              }

              if (evalCache[evalArgument] == undefined) {
                _assign = (evalArgument.match(/:=/g)) ? true : false;
              
                //////////////////////////////////////////////////////////////
                if (evalArgument.match(";")) {
                  var inStr = false;
                  var charAt;
                  var valueArray = [];
                  var lastIndex = 0;

                  for (var i=0, l=evalArgument.length; i<l; i++) {
                    charAt = evalArgument.charAt(i);
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

                  evalArgument = "(" + valueArray.join(")(") + ")";
                }
                //////////////////////////////////////////////////////////////

                evalCache[evalArgument] = evaluator.parser.parse(evalArgument, _assign);
              }

              tmp_ret = evaluator.eval( evalCache[evalArgument] );
              return (tmp_ret != undefined) ? tmp_ret : NaN;
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
              if ((typeof(op1) == "number") && (typeof(op2) == "string")) {
                // op1 = descartesJS.removeNeedlessDecimals(op1.toFixed(30));
                op1 = descartesJS.removeNeedlessDecimals(op1.toString());
              }
              else if ((typeof(op1) == "string") && (typeof(op2) == "number")) {
                // op2 = descartesJS.removeNeedlessDecimals(op2.toFixed(30));
                op2 = descartesJS.removeNeedlessDecimals(op2.toString());
              }
              return op1 + op2;
            }
            // matrix operation
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
              return subtractMatrix(op1, op2);
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
              return divisionMatrix(op1, op2);
            }
          }
        }
        else if (this.value === "%") {
          this.evaluate = function(evaluator) {
            var op1 = this.childs[0].evaluate(evaluator);
            var op2 = this.childs[1].evaluate(evaluator);
            return op1 - MathFloor(op1/op2)*op2;
          }
        }
        else if (this.value === "^") {
          this.evaluate = function(evaluator) {
            var op1 = this.childs[0].evaluate(evaluator);
            var op2 = this.childs[1].evaluate(evaluator);
            if (op2 >= 0) {
              return calcExp(op1, op2);
            }
            else {
              return 1/calcExp(op1, -op2);
            }
          }
        }
      }

      // comparison operator
      else if (this.type === "compOperator") {
        if (this.value === "<") {
          this.evaluate = function(evaluator) {
            return +(this.childs[0].evaluate(evaluator) < this.childs[1].evaluate(evaluator));
          }
        }
        else if (this.value === "<=") {
          this.evaluate = function(evaluator) {
            return +(this.childs[0].evaluate(evaluator) <= this.childs[1].evaluate(evaluator));
          }
        }
        else if (this.value === ">") {
          this.evaluate = function(evaluator) {
            return +(this.childs[0].evaluate(evaluator) > this.childs[1].evaluate(evaluator));
          }
        }
        else if (this.value === ">=") {
          this.evaluate = function(evaluator) {
            return +(this.childs[0].evaluate(evaluator) >= this.childs[1].evaluate(evaluator));
          }
        }
        else if (this.value === "==") {
          this.evaluate = function(evaluator) {
            return +(this.childs[0].evaluate(evaluator) === this.childs[1].evaluate(evaluator));
          }
        }
        else if (this.value === "!=") {
          this.evaluate = function(evaluator) {
            return +(this.childs[0].evaluate(evaluator) !== this.childs[1].evaluate(evaluator));
          }
        }
      }

      // boolean operator
      else if (this.type === "boolOperator") {
        if (this.value === "&") {
          this.evaluate = function(evaluator) {
            if (this.childs[0].evaluate(evaluator)) {
              return (this.childs[1].evaluate(evaluator)) ? 1 : 0;
            }
            else {
              return 0;
            }
          }
        }

        else if (this.value === "|") {
          this.evaluate = function(evaluator) {
            if (this.childs[0].evaluate(evaluator)) {
              return 1;
            }
            else {
              return (this.childs[1].evaluate(evaluator)) ? 1 : 0;
            }
          }
        }

        else if (this.value === "!") {
          this.evaluate = function(evaluator) {
            return +(!(this.childs[0].evaluate(evaluator)));
          }
        }
      }

      // conditional
      else if (this.type === "conditional") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) > 0) ? this.childs[1].evaluate(evaluator) : ((this.childs[2]) ? this.childs[2].evaluate(evaluator) : 0);
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

      // assignation
      else if (this.type === "assign") {
        var assignation;

        var ide = this.childs[0];
        var expre = this.childs[1];
        var pos = (ide.childs[0]) ? ide.childs[0].childs : null;

        // vector assignation
        if ((ide.childs.length === 1) && (ide.childs[0].type === "square_bracket") && (pos.length === 1)) {
          this.evaluate = function(evaluator) {
            assignation = expre.evaluate(evaluator);
            evaluator.setVector(ide.value, pos[0].evaluate(evaluator), assignation);
            return assignation;
          }
        }
        // matrix assignation
        else if ((ide.childs.length === 1) && (ide.childs[0].type === "square_bracket") && (pos.length === 2)) {
          this.evaluate = function(evaluator) {
            assignation = expre.evaluate(evaluator);
            evaluator.setMatrix(ide.value, pos[0].evaluate(evaluator), pos[1].evaluate(evaluator), assignation);
            return assignation;
          }
        }
        else {
          this.evaluate = function(evaluator) {
            assignation = expre.evaluate(evaluator);

            // the assignation isn't a variable
            if (!assignation.type) {
              // prevent to assign a value to an auxiliary variable
              if (typeof(evaluator.variables[ide.value]) !== "object") {
                evaluator.variables[ide.value] = assignation;
                return assignation;
              }
            }
            // the assignation is a matrix
            else {
              evaluator.matrices[ide.value] = assignation;
              return assignation;
            }

            return 0;
          }
        }
      }
    }

    /**
     * Used only when debug
     */
    // toString() {
    //   var str = "tipo: " + this.type + ", valor: " + this.value + "\n";

    //   this.sep = "   " + ((this.parent) ? (this.parent.sep) : "");
    //   for (var i=0, l=this.childs.length; i<l; i++) {
    //     str += this.sep +this.childs[i].toString();
    //   }

    //   return str;
    // }
  }

  /**
   *
   */
  function calcExp(x, y) {
    if (y == 0) {
      return 1;
    }
    if (y < 0) {
      return NaN;
    }
    if ((x >= 0) || (MathFloor(y) === y)) {
      return Math.pow(x, y);
    }
    if (x < 0) {
      var yinv = 1/y;
      var q = MathFloor(yinv);
      if (q === yinv) {
        if (q%2 === 1) {
          return -Math.pow(-x, y);
        }
      }
    }
    return NaN;
  }

  /**
   *
   */
  function createMatrix(rows, cols) {
    result = [];
    result.type = "matrix";
    result.rows = rows;
    result.cols = cols;

    for (j=0, k=cols; j<k; j++) {
      result[j] = (Array(rows)).fill(0);
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
  function subtractMatrix(op1, op2) {
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
  function inverseMatrix(T) {
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
  function divisionMatrix(op1, op2) {
    var inverse = inverseMatrix(op2);

    if (inverse === 0) {
      return createMatrix(op1.rows, op1.cols);
    }

    return multiplicationMatrix(op1, inverse);
  }

  descartesJS.Node = Node;
  return descartesJS;
})(descartesJS || {});
