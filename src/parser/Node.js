/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  const epsilon = 0.00000001;

  const MathFloor = Math.floor;

  let lastChild;
  let lastChildIndex;
  let newRoot;
  let root;
  let rows;
  let cols;
  let result;
  let i, j, k;

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
      return this.childs.some(child => child.contains(value));
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
     * Get the children of a parenthesis expression
     */
    getChildren() {
      if ((this.type === "(expr)") || (this.type === "[expr]")) {
        if (this.childArray) {
          return this.childArray;
        }

        this.childArray = [];
        for (let c_i of this.childs) {
          if ((/square_bracket|parentheses/).test(c_i.type)) {
            this.childArray.push(...c_i.childs);
          }
        }

        return this.childArray;
      }

      return null;
    }

    /**
     * Register the evaluation functions to all the nodes in the tree
     */
    setAllEvalFun() {
      this.setEvalFun();

      for (let c_i of this.childs) {
        c_i.setAllEvalFun();
      }
    }

    /**
     * Set the appropriate evaluate function for the node
     *
     */
    setEvalFun() {
      // number
      if (this.type === "number") {
        this.evaluate = eval_number;
      }

      // string
      else if (this.type === "string") {
        this.evaluate = eval_string;
      }

      // variable
      else if ( (this.type === "identifier") && (this.childs.length === 0) ) {
        this.evaluate = eval_variable;
      }

      // vector
      else if ( (this.type === "identifier") && (this.childs[0].type === "square_bracket") && (this.childs[0].childs.length === 1)) {
        this.evaluate = eval_vector;
      }

      // matrix
      else if ( (this.type === "identifier") && (this.childs[0].type === "square_bracket") && (this.childs[0].childs.length > 1)) {
        this.evaluate = eval_matrix;
      }

      // function
      else if ( (this.type === "identifier") && (this.childs[0].type === "parentheses") ) {
        this.evaluate = eval_function;
      }

      // operator
      else if (this.type === "operator") {
        if (this.value === "+") {
          this.evaluate = operator_sum;
        }
        else if (this.value === "-") {
          this.evaluate = operator_subtraction;
        }
        else if (this.value === "*") {
          this.evaluate = operator_multiplication;
        }
        else if (this.value === "/") {
          this.evaluate = operator_division;
        }
        else if (this.value === "%") {
          this.evaluate = operator_modulus;
        }
        else if (this.value === "^") {
          this.evaluate = operator_exponentiation;
        }
      }

      // comparison operator
      else if (this.type === "compOperator") {
        if (this.value === "<") {
          this.evaluate = compOperator_less;
        }
        else if (this.value === "<=") {
          this.evaluate = compOperator_less_equal;
        }
        else if (this.value === ">") {
          this.evaluate = compOperator_greater;
        }
        else if (this.value === ">=") {
          this.evaluate = compOperator_greater_equal;
        }
        else if (this.value === "==") {
          this.evaluate = compOperator_equal;
        }
        else if (this.value === "!=") {
          this.evaluate = compOperator_not_equal;
        }
      }

      // boolean operator
      else if (this.type === "boolOperator") {
        if (this.value === "&") {
          this.evaluate = boolOperator_and;
        }
        else if (this.value === "|") {
          this.evaluate = boolOperator_or;
        }
        else if (this.value === "!") {
          this.evaluate = boolOperator_not;
        }
      }

      // conditional
      else if (this.type === "conditional") {
        this.evaluate = eval_conditional;
      }

      // sign
      else if (this.type === "sign") {
        if (this.value === "sign+") {
          this.evaluate = eval_sign_plus;
        }
        else {
          this.evaluate = eval_sign_minus;
        }
      }

      // parentheses
      else if (this.type === "parentheses") {
        this.evaluate = eval_parentheses;
      }

      // expression of the type (x,y) or [x,y]
      else if ( (this.type === "(expr)") || (this.type === "[expr]") ) {
        this.evaluate = eval_expression_par_square;
      }

      // assignation
      else if (this.type === "assign") {
        let ide = this.childs[0];
        let pos = (ide.childs[0]) ? ide.childs[0].childs : null;

        // vector assignation
        if ((ide.childs.length === 1) && (ide.childs[0].type === "square_bracket") && (pos.length === 1)) {
          this.evaluate = eval_assign;
        }
        // matrix assignation
        else if ((ide.childs.length === 1) && (ide.childs[0].type === "square_bracket") && (pos.length === 2)) {
          this.evaluate = eval_vector_assign;
        }
        else {
          this.evaluate = eval_assign_extra;
        }
      }
    }

    /**
     * Used only when debug
     */
    // toString() {
    //   let str = "tipo: " + this.type + ", valor: " + this.value + "\n";

    //   this.sep = "   " + ((this.parent) ? (this.parent.sep) : "");
    //   for (let i=0, l=this.childs.length; i<l; i++) {
    //     str += this.sep +this.childs[i].toString();
    //   }

    //   return str;
    // }
  }

  /**
   * 
   */
  function eval_number() {
    return parseFloat(this.value);
  }
  /**
   * 
   */
  function eval_string() {
    return this.value.replace(/\\u0027/g, "'");
  }
  /**
   * 
   */
  function eval_variable(evaluator, getMatrix) {
    let variableValue = evaluator.variables[this.value];

    // the variable is a descartes auxiliary variable
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
  /**
   * 
   */
  function eval_vector(evaluator) {
    try {
      let value = evaluator.getVector(
        this.value,
        this.childs[0].childs[0].evaluate(evaluator)
      );
      return (value !== undefined) ? value : 0;
    }
    catch(e) {
      return 0;
    }
  }
  /**
   * 
   */
  function eval_matrix(evaluator) {
    try {
      let value = evaluator.getMatrix(
        this.value,
        this.childs[0].childs[0].evaluate(evaluator),
        this.childs[0].childs[1].evaluate(evaluator)
      );
      return (value !== undefined) ? value : 0;
    }
    catch(e) {
      return 0;
    }
  }
  /**
   * 
   */
  function eval_function(evaluator) {
    return evaluator.functions[this.value].apply(evaluator, this.childs[0].childs.map(c_i => {
      return c_i.evaluate(evaluator);
    }));
  }
  /**
   * 
   */
  function operator_sum(evaluator) {
    let op1 = this.childs[0].evaluate(evaluator, true);
    let op2 = this.childs[1].evaluate(evaluator, true);

    // numeric or string operation
    if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
      if ((typeof(op1) == "number") && (typeof(op2) == "string")) {
        op1 = descartesJS.removeNeedlessDecimals(op1.toString());
      }
      else if ((typeof(op1) == "string") && (typeof(op2) == "number")) {
        op2 = descartesJS.removeNeedlessDecimals(op2.toString());
      }
      return op1 + op2;
    }
    // matrix operation
    return sumMatrix(op1, op2);
  }
  /**
   * 
   */
  function operator_subtraction(evaluator) {
    let op1 = this.childs[0].evaluate(evaluator, true);
    let op2 = this.childs[1].evaluate(evaluator, true);

    // numeric operation
    if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
      return op1 - op2;
    }
    // matrix operation
    return subtractMatrix(op1, op2);
  }
  /**
   * 
   */
  function operator_multiplication(evaluator) {
    let op1 = this.childs[0].evaluate(evaluator, true);
    let op2 = this.childs[1].evaluate(evaluator, true);

    // numeric operation
    if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
      return op1 * op2;
    }
    // matrix operation
    return multiplicationMatrix(op1, op2);
  }
  /**
   * 
   */
  function operator_division(evaluator) {
    let op1 = this.childs[0].evaluate(evaluator, true);
    let op2 = this.childs[1].evaluate(evaluator, true);

    // numeric operation
    if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
      return op1 / op2;
    }
    // matrix operation
    return divisionMatrix(op1, op2);
  }
  /**
   * 
   */
  function operator_modulus(evaluator) {
    let op1 = this.childs[0].evaluate(evaluator);
    let op2 = this.childs[1].evaluate(evaluator);
    return op1 - MathFloor(op1 / op2) * op2;
  }
  /**
   * 
   */
  function operator_exponentiation(evaluator) {
    let op1 = this.childs[0].evaluate(evaluator);
    let op2 = this.childs[1].evaluate(evaluator);
    if (op2 >= 0) {
      return calcExp(op1, op2);
    }
    else {
      return 1/calcExp(op1, -op2);
    }
  }
  /**
   * 
   */
  function compOperator_less(evaluator) {
    return +(this.childs[0].evaluate(evaluator) < this.childs[1].evaluate(evaluator));
  }
  /**
   * 
   */
  function compOperator_less_equal(evaluator) {
    return +(this.childs[0].evaluate(evaluator) <= this.childs[1].evaluate(evaluator));
  }
  /**
   * 
   */
  function compOperator_greater(evaluator) {
    return +(this.childs[0].evaluate(evaluator) > this.childs[1].evaluate(evaluator));
  }
  /**
   * 
   */
  function compOperator_greater_equal(evaluator) {
    return +(this.childs[0].evaluate(evaluator) >= this.childs[1].evaluate(evaluator));
  }
  /**
   * 
   */
  function compOperator_equal(evaluator) {
    let op1 = this.childs[0].evaluate(evaluator);
    let op2 = this.childs[1].evaluate(evaluator);

    // number comparison use an epsilon
    if ( (typeof(op1) == "number") && (typeof(op2) == "number") ) {
      return +(Math.abs(op1 - op2) < epsilon);
    }
    return +(op1 === op2);
  }
  /**
   * 
   */
  function compOperator_not_equal(evaluator) {
    let op1 = this.childs[0].evaluate(evaluator);
    let op2 = this.childs[1].evaluate(evaluator);

    // number comparison use an epsilon
    if ( (typeof(op1) == "number") && (typeof(op2) == "number") ) {
      return +(!(Math.abs(op1 - op2) < epsilon));
    }
    return +(op1 !== op2);
  }
  /**
   * 
   */
  function boolOperator_and(evaluator) {
    if (this.childs[0].evaluate(evaluator)) {
      return (this.childs[1].evaluate(evaluator)) ? 1 : 0;
    }
    return 0;
  }
  /**
   * 
   */
  function boolOperator_or(evaluator) {
    if (this.childs[0].evaluate(evaluator)) {
      return 1;
    }
    return (this.childs[1].evaluate(evaluator)) ? 1 : 0;
  }
  /**
   * 
   */
  function boolOperator_not(evaluator) {
    return +(!(this.childs[0].evaluate(evaluator)));
  }
  /**
   * 
   */
  function eval_conditional(evaluator) {
    return (this.childs[0].evaluate(evaluator) > 0) ? this.childs[1].evaluate(evaluator) : ((this.childs[2]) ? this.childs[2].evaluate(evaluator) : 0);
  }
  /**
   * 
   */
  function eval_sign_plus(evaluator) {
    return this.childs[0].evaluate(evaluator);
  }
  /**
   * 
   */
  function eval_sign_minus(evaluator) {
    return -(this.childs[0].evaluate(evaluator));
  }
  /**
   * 
   */
  function eval_parentheses(evaluator, getMatrix) {
    return this.childs[0].evaluate(evaluator, getMatrix);
  }
  /**
   * 
   */
  function eval_expression_par_square(evaluator) {
    if ( (this.childs.length === 1) && (this.childs[0].childs.length === 1) && (this.type === "(expr)") ) {
      return this.childs[0].childs[0].evaluate(evaluator);
    }
    else {
      // evaluates every children and add his evaluation in an array, and create an array of evaluated children
      return this.childs.map(c_i => {
        return c_i.childs.map(c_j => c_j.evaluate(evaluator));
      });
    }
  }
  /**
   * 
   */
  function eval_assign(evaluator) {
    let ide = this.childs[0];
    let expre = this.childs[1];
    let pos = (ide.childs[0]) ? ide.childs[0].childs : null;
    let assignation = expre.evaluate(evaluator);
    evaluator.setVector(ide.value, pos[0].evaluate(evaluator), assignation);
    return assignation;
  }
  /**
   * 
   */
  function eval_vector_assign(evaluator) {
    let ide = this.childs[0];
    let expre = this.childs[1];
    let pos = (ide.childs[0]) ? ide.childs[0].childs : null;
    let assignation = expre.evaluate(evaluator);
    evaluator.setMatrix(ide.value, pos[0].evaluate(evaluator), pos[1].evaluate(evaluator), assignation);
    return assignation;
  }
  /**
   * 
   */
  function eval_assign_extra(evaluator) {
    let ide = this.childs[0];
    let expre = this.childs[1];
    let assignation = expre.evaluate(evaluator);

    // the assignation isn't a variable
    if (!assignation.type) {
      // prevent to assign a value to a descartes auxiliary variable
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
      let yinv = 1/y;
      let q = MathFloor(yinv);
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
    let sum;

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
    let M = createMatrix(T.length-1, T.length-1);

    for (let i=0, l=M.length; i<l; i++) {
      for (let j=0; j<l; j++) {
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
      let D = 0;
      let s = 1;
      for (let j=0, l=T.cols; j<l; j++) {
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
    let S = createMatrix(T.length, T.length);
    let det = determinant(T);

    if (det === 0) {
      return 0;
    }

    let s = 1/det;
    let t;

    if (T.length > 1) {
      for (let i=0, l=T.length; i<l; i++) {
        t = s;
        for (let j=0; j<l; j++) {
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
    let inverse = inverseMatrix(op2);

    if (inverse === 0) {
      return createMatrix(op1.rows, op1.cols);
    }

    return multiplicationMatrix(op1, inverse);
  }

  descartesJS.Node = Node;
  return descartesJS;
})(descartesJS || {});
