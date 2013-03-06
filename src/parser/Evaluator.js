/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
    
  /**
   * Evaluador
   * @constructor 
   */
  descartesJS.Evaluator = function (parent) {
    this.parent = parent;
    this.parser = new descartesJS.Parser();
    this.variables = this.parser.variables;
    this.functions = this.parser.functions;
    this.vectors = this.parser.vectors;
    this.matrices = this.parser.matrices;
  }
  
  descartesJS.Evaluator.prototype.setVariable = function(name, value) {
    this.variables[name] = value;
  }  
  
  descartesJS.Evaluator.prototype.getVariable = function(name) {
    return this.variables[name];
  }

  descartesJS.Evaluator.prototype.setVector = function(name, pos, value) {
    pos = (pos<0) ? 0 : MathFloor(pos);
    this.vectors[name][pos] = value;
  }

  descartesJS.Evaluator.prototype.getVector = function(name, pos) {
    pos = (pos<0) ? 0 : MathFloor(pos);
    return this.vectors[name][pos];
  }

  descartesJS.Evaluator.prototype.setMatrix = function(name, pos1, pos2, value) {
    pos1 = (pos1<0) ? 0 : MathFloor(pos1);
    pos2 = (pos2<0) ? 0 : MathFloor(pos2);
    this.matrices[name][pos1][pos2] = value;
  }

  descartesJS.Evaluator.prototype.getMatrix = function(name, pos1, pos2) {
    pos1 = (pos1<0) ? 0 : MathFloor(pos1);
    pos2 = (pos2<0) ? 0 : MathFloor(pos2);
    return this.matrices[name][pos1][pos2];
  }

  descartesJS.Evaluator.prototype.setFunction = function(name, value) {
    this.functions[name] = value;
  }

  descartesJS.Evaluator.prototype.getFunction = function(name) {
    return this.functions[name];
  }

  /**
   * 
   */
  descartesJS.Evaluator.prototype.evalExpression = function (expr) {
    return (expr) ? expr.evaluate(this) : 0;

    // var evaluation = this.evalAux(expr);

    // return (evaluation == undefined) ? 0 : evaluation;
  }
    
  // /**
  //  * 
  //  */
  // descartesJS.Evaluator.prototype.evalAux = function (expr) {
  //   if (expr == null) {
  //     return 0;
  //   }
    
  //   var exprType = expr.type;
  //   var exprChilds = expr.childs;
  //   var exprValue = expr.value;
   
  //   // el nodo a evaluar es un numero
  //   if (exprType == "number") {
  //     return parseFloat(exprValue);
  //   }

  //   // el nodo a evaluar es una cadena
  //   else if (exprType == "string") {
  //     return exprValue;
  //   }
    
  //   // el nodo a evaluar es una variable
  //   else if ( (exprType == "identifier") && (exprChilds.length == 0) ) {
  //     if (exprValue == "rnd") {
  //       return Math.random();
  //     }
      
  //     var tempIden = this.variables[exprValue];
  //     if ( typeof(tempIden) == "object" ) {
  //       return this.evalAux(tempIden);
  //     }
      
  //     return tempIden;
  //   }
    
  //   // el nodo a evaluar es un corchete, para casos cuando se usan expresiones como en los textos, es decir, x=[x+1]
  //   else if (exprType == "square_bracket") {
  //     return this.evalAux(exprChilds[0])
  //   }
    
  //   // el nodo a evaluar es un vector
  //   else if ( (exprType == "identifier") && (exprChilds[0].type == "square_bracket") && (exprChilds[0].childs.length == 1)) {
  //     var pos = this.evalAux(exprChilds[0].childs[0]);

  //     try {
  //       return this.vectors[exprValue][(pos<0) ? 0 : MathFloor(pos)];
  //     } 
  //     // se accede a un valor que no existe
  //     catch(e) { return 0; }
  //   }
      
  //   // el nodo a evaluar es una matriz
  //   else if ( (exprType == "identifier") && (exprChilds[0].type == "square_bracket") && (exprChilds[0].childs.length > 1)) {
  //     var pos1 = this.evalAux(exprChilds[0].childs[0]);
  //     var pos2 = this.evalAux(exprChilds[0].childs[1]);

  //     try {
  //       return this.matrices[exprValue][(pos1<0) ? 0 : MathFloor(pos1)][(pos2<0) ? 0 : MathFloor(pos2)];
  //     } 
  //     // se accede a un valor que no existe
  //     catch(e) { return 0; }

  //   }

  //   // el nodo a evaluar es una funcion
  //   else if ( (exprType == "identifier") && (exprChilds[0].type == "parentheses") ) {
      
  //     var argu = [];
  //     for (var i=0, l=exprChilds[0].childs.length; i<l; i++) {
  //       argu.push( this.evalAux(exprChilds[0].childs[i]) );
  //     }
      
  //     // funcion interna de evaluacion
  //     if (exprValue == "_Eval_") {
  //       if (!(expr.previousExpression) || (expr.previousExpression != argu[0])) {
  //         expr.previousExpression = argu[0];
  //         expr.previousParse = this.parser.parse(argu[0]);
  //       }

  //       return this.evalAux(expr.previousParse);
  //     }
      
  //     return this.functions[exprValue].apply(this, argu);
  //   }
    
  //   // el nodo a evaluar es un operador
  //   else if (exprType == "operator") {
  //     var decimals = ((this.decimals == undefined) || (this.decimals<0)) ? 2 : this.decimals;
  //     var fixed = this.fixed || false;
      
  //     var op1, op2;
      
  //     op1 = this.evalAux(exprChilds[0]);
  //     op2 = this.evalAux(exprChilds[1]);

  //     // esto es para manejar las cadenas en las expresiones, [expr]+cadena o cadena+[expr]
  //     if (exprValue == "+") { return (op1 + op2); }
  //     else if(exprValue == "-") { return (op1 - op2); }
  //     else if(exprValue == "*") { return (op1 * op2); }
  //     else if(exprValue == "/") { return (op1 / op2); }
  //     else if(exprValue == "%") { return (op1 - MathFloor(op1/op2)*op2); }
  //     else if(exprValue == "^") { return (Math.pow(op1, op2)); }
  //   }
    
  //   // el nodo a evaluar es un operador de comparacion
  //   else if (exprType == "compOperator") {
  //     var op1, op2;
  //     op1 = this.evalAux(exprChilds[0]);
  //     op2 = this.evalAux(exprChilds[1]);
    
  //     if (exprValue == "<")      { return (op1 <  op2)+0; } // para regresar los valores como 0 o 1 en lugar de true y false
  //     else if(exprValue == "<=") { return (op1 <= op2)+0; }
  //     else if(exprValue == ">")  { return (op1 >  op2)+0; }
  //     else if(exprValue == ">=") { return (op1 >= op2)+0; }
  //     else if(exprValue == "==") { return (op1 == op2)+0; }
  //     else if(exprValue == "!=") { return (op1 != op2)+0; }
  //   }
    
  //   // el nodo a evaluar es un operador booleano
  //   else if (exprType == "boolOperator") {
  //     var op1, op2;
  //     op1 = (this.evalAux(exprChilds[0]) == 1) ? 1 : 0;
      
  //     // para regresar los valores como 0 o 1 en lugar de true y false    
  //     if (exprValue == "&") {
  //       if (op1) {
  //         return (this.evalAux(exprChilds[1]) == 1) ? 1 : 0;
  //       } else {
  //         return 0;
  //       }
  //     }
  //     else if(exprValue == "|") { 
  //       if (op1) {
  //         return 1;
  //       } else {
  //         return (this.evalAux(exprChilds[1]) == 1) ? 1 : 0;          
  //       }
  //     }
  //     else if(exprValue == "!") { 
  //       return !op1+0; 
  //     }
  //   }
    
  //   // el nodo a evaluar es un if (?:)
  //   else if (exprType == "conditional") {
  //     var op1, op2, op3;
  //     op1 = this.evalAux(exprChilds[0]);
            
  //     if (op1 > 0) {
  //       return this.evalAux(exprChilds[1]);
  //     } else {
  //       return this.evalAux(exprChilds[2]);
  //     }
  //   }
    
  //   // el nodo a evaluar es un signo
  //   else if (exprType == "sign") {
  //     if (exprValue == "sign+") {
  //       return this.evalAux(exprChilds[0]);
  //     } else {
  //       return -(this.evalAux(exprChilds[0]));
  //     }
  //   }
    
  //   // el nodo a evaluar es un parentesis
  //   else if (exprType == "parentheses") {
  //     return this.evalAux(exprChilds[0]);
  //   }
        
  //   // el nodo a evaluar es una expresion (x,y) o [x,y]
  //   else if ( (exprType == "(expr)") || (exprType == "[expr]") ){
  //     var l = exprChilds.length;
  //     var result = [];
      
  //     // la expresion parentizada solo tiene un argumento (1)
  //     if ( (l == 1) && (exprChilds[0].childs.length ==1) && (exprType == "(expr)") ) {
  //       result = this.evalAux(exprChilds[0].childs[0]);
  //     } 
      
  //     // la expresion tiene un conjunto de argumentos (1,2,...) o es un arreglo
  //     else {
  //       var tmpRes;
  //       for (var i=0; i<l; i++) {
  //         tmpRes = [];
  //         for (var j=0, n=exprChilds[i].childs.length; j<n;j++) {
  //           tmpRes.push( this.evalAux(exprChilds[i].childs[j]) );
  //         }
  //         result[i] = tmpRes;
  //       }
  //     }

  //     return result;
  //   }
    
  //   // el nodo a evaluar es una asignacion
  //   else if (exprType == "asign") {
  //     var ide = exprChilds[0];
  //     var expre = exprChilds[1];
      
  //     if ((ide.childs.length == 1) && (ide.childs[0].type == "square_bracket")) {
  //       var pos = ide.childs[0].childs;
        
  //       // un vector
  //       if (pos.length == 1) {
  //         var tmpPos = this.evalAux(pos[0]);
  //         tmpPos = (tmpPos<0) ? 0 : MathFloor(tmpPos);
  //         this.vectors[ide.value][tmpPos] = this.evalAux(expre);
          
  //         return;
  //       }
        
  //       // una matriz
  //       else if (pos.length == 2) {
  //         var tmpPos0 = this.evalAux(pos[0]);
  //         var tmpPos1 = this.evalAux(pos[1]);
  //         tmpPos0 = (tmpPos0<0) ? 0 : MathFloor(tmpPos0);
  //         tmpPos1 = (tmpPos1<0) ? 0 : MathFloor(tmpPos1);
  //         this.matrices[ide.value][tmpPos0][tmpPos1] = this.evalAux(expre);

  //         return;
  //       }
  //     } else {
  //       this.variables[ide.value] = this.evalAux(expre);

  //       return;
  //     }      
  //   }

  //   // el nodo a evaluar es desconocido
  //   else {
  //     console.log("Error en la evaluacion, expresion desconocida <" + exprValue + "> \n" + expr);
  //     return;
  //   } 
  // }

//console.log((new descartesJS.Evaluator()).evalExpression((new descartesJS.Parser()).parse("ent(rnd*10)")));
//console.log((new descartesJS.Evaluator()).evalExpression((new descartesJS.Parser()).parse("(!0)")));
//console.log((new descartesJS.Evaluator()).evalExpression((new descartesJS.Parser()).parse("1 / ( 10 + (20-30) / (40-50) * 60 / 70 )")));
//console.log((new descartesJS.Evaluator()).evalExpression((new descartesJS.Parser()).parse("2*3/4")));
// console.log((new descartesJS.Evaluator()).evalExpression((new descartesJS.Parser()).parse("-2^2")));

// console.log((new descartesJS.Evaluator({decimal_symbol: "."})).evalExpression((new descartesJS.Parser()).parse("''+2.12345"), 2, true));

  return descartesJS;
})(descartesJS || {});
