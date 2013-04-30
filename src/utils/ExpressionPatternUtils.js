/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var tmpAnswer;
  var tempAnswers;
  var answerArray;
  var regExpPattern;
  var answerValue;

  var answer_0;
  var answer_1;
  var limInf;
  var limSup;
  var cond1;
  var cond2;
  var cond3;
  var cond4;

  /**
   * Build a text regular expression pattern from a Descartes answer pattern (auxiliary function)
   * @param {String} answer the Descartes answer pattern to convert
   * @return {Object} return an object representing a simple regular expression pattern
   */
  function buildTextRegularExpressionPattern(answer) {
    tmpAnswer = answer.trim();
    answer = { ignoreAcents: false, ignoreCaps: false, regExp: null };

    // ignore uppercase
    if ((tmpAnswer[0] == tmpAnswer[tmpAnswer.length-1]) && (tmpAnswer[0] == "'")) {
      answer.ignoreCaps = true;
      tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);

      // ignore accents
      if ((tmpAnswer[0] == "`") && (tmpAnswer[tmpAnswer.length-1] == "´")) {
        answer.ignoreAcents = true;
        tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);
      }
    }
        
    // ignore accents
    if ((tmpAnswer[0] == "`") && (tmpAnswer[tmpAnswer.length-1] == "´")) {
      answer.ignoreAcents = true;
      tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);

      // ignore uppercase
      if ((tmpAnswer[0] == tmpAnswer[tmpAnswer.length-1]) && (tmpAnswer[0] == "'")) {
        answer.ignoreCaps = true;
        tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);
      }
    }

    if ((tmpAnswer.charAt(0) === "*") && (tmpAnswer.charAt(tmpAnswer.length-1) !== "*")) {
      tmpAnswer = (tmpAnswer.substring(1)) + "$";
    }

    else if ((tmpAnswer.charAt(0) !== "*") && (tmpAnswer.charAt(tmpAnswer.length-1) === "*")) {
      tmpAnswer = "^" + (tmpAnswer.substring(0, tmpAnswer.length-1));
    }

    else if ((tmpAnswer.charAt(0) !== "*") && (tmpAnswer.charAt(tmpAnswer.length-1) !== "*")) {
      tmpAnswer = "^" + tmpAnswer + "$";
    }

    else if ((tmpAnswer.charAt(0) === "*") && (tmpAnswer.charAt(tmpAnswer.length-1) === "*")) {
      tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);
    }
        
    tmpAnswer = tmpAnswer.replace(/\?/g, "[\\S\\s]{1}");

    answer.regExp = tmpAnswer;
    
    return answer;
  }

  /**
   * Build a text regular expression pattern from a Descartes answer pattern (auxiliary function)
   * @param {String} answer the Descartes answer pattern to convert
   * @return {Object} return an object representing a simple regular expression pattern
   */
  function buildNumericRegularExpressionPattern(answer, evaluator) {
    tmpAnswer = answer.trim();
    answer = { ignoreAcents: false, ignoreCaps: false, regExp: null };

    answer.expr = tmpAnswer.split(",");

    answer.expr[0] = answer.expr[0].trim();
    answer.expr[0] = { type: answer.expr[0].charAt(0),
                       expr: evaluator.parser.parse(answer.expr[0].substring(1))
                     };

    answer.expr[1] = answer.expr[1].trim();
    answer.expr[1] = { type: answer.expr[1].charAt(answer.expr[1].length-1),
                       expr: evaluator.parser.parse(answer.expr[1].substring(0, answer.expr[1].length-1))
                     };

    return answer;
  }

  function inRange(regExp, value, evaluator) {
    value = parseFloat(value);

    answer_0 = regExp.expr[0];
    answer_1 = regExp.expr[1];
    
    limInf = evaluator.evalExpression(answer_0.expr);
    limSup = evaluator.evalExpression(answer_1.expr);
    
    cond1 = (answer_0.type == "(");
    cond2 = (answer_0.type == "[");
    cond3 = (answer_1.type == ")");
    cond4 = (answer_1.type == "]");
    
    if (((cond1 && (value > limInf)) || (cond2 && (value >= limInf))) &&
        ((cond3 && (value < limSup)) || (cond4 && (value <= limSup)))
       ) {
      return 1;
    }
    
    return 0;
  }

  /**
   * Remove the accents in a string and change the ñ for n
   * @param {String} value the string to remove the accents
   * @return {String} return ths string with the accents remove
   */
  function removeAccents(value) {
    return value.toString().replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u").replace(/Á/g, "A").replace(/É/g, "E").replace(/Í/g, "I").replace(/Ó/g, "O").replace(/Ú/g, "U").replace(/ñ/g, "n").replace(/Ñ/g, "N");
  }
  
  /**
   * Build a regular expression pattern from a Descartes answer pattern
   * @param {String} answer the Descartes answer pattern to convert
   * @return {Object} return an object representing a regular expression pattern
   */
  descartesJS.buildRegularExpresionsPatterns = function(answer, evaluator) {
    // remove parentheses in a text expression
    if ((answer.charAt(0) === "(" ) && (answer.charAt(answer.length-1) === ")") && (answer.indexOf(",") === -1)) {
      answer = answer.substring(1, answer.length-1);
    }

    answer = ((answer.replace(/&squot;/g, "'")).replace(/&amp;/g, "&")).split("|");

    for (var i=0, l=answer.length; i<l; i++) {
      tempAnswers = answer[i].split("&");
      answerArray = [];

      for (var j=0, k=tempAnswers.length; j<k; j++) {
        tmpAnswer = tempAnswers[j];

        // numeric pattern
        if ( (tmpAnswer.indexOf(",") !== -1) && 
             ( ((tmpAnswer.charAt(0) === "(" ) || (tmpAnswer.charAt(0) === "[")) && 
               ((tmpAnswer.charAt(tmpAnswer.length-1) === ")") || (tmpAnswer.charAt(tmpAnswer.length-1) === "]")) 
             )
           ) {
          answerArray.push( buildNumericRegularExpressionPattern(tmpAnswer, evaluator) );          
        }
        // text pattern
        else {
          answerArray.push( buildTextRegularExpressionPattern(tmpAnswer) );
        }
      }
      
      answer[i] = answerArray;
    }

    return answer;
  }
  
  /**
   * Decide whether the answer meets the Descartes answer pattern ignoring accents and uppercase
   * @param {String} respPattern the Descartes answer pattern
   * @param {String} resp the answer to check
   * @return {Number} return 1 if the answer meets the Descartes answer pattern and 0 if not
   */
  descartesJS.escorrecto = function(respPattern, resp, evaluator, regExpPattern) {
    evaluator = evaluator || descartesJS.externalEvaluator;
    regExpPattern = regExpPattern || descartesJS.buildRegularExpresionsPatterns(respPattern, evaluator);

    // remove the accents
    resp = removeAccents(resp);

    for (var i=0, l=regExpPattern.length; i<l; i++) {
      tempAnswers = regExpPattern[i];
      answerValue = true;

      for (var j=0, k=tempAnswers.length; j<k; j++) {
        // a text pattern
        if (tempAnswers[j].regExp) {
          answerValue = answerValue && !!(resp.match( removeAccents(tempAnswers[j].regExp), "i" ));
        }
        // a numeric pattern
        else {
          answerValue = answerValue && inRange(tempAnswers[j], resp, evaluator);
        }
      }
      
      if (answerValue) {
        return 1;
      }
    }
    
    return 0;
  }

  /**
   * Decide whether the answer meets the Descartes answer pattern strictly
   * @param {String} respPattern the Descartes answer pattern
   * @param {String} resp the answer to check
   * @return {Number} return 1 if the answer meets the Descartes answer pattern and 0 if not
   */
  descartesJS.esCorrecto = function(respPattern, resp, evaluator, regExpPattern) {
    evaluator = evaluator || descartesJS.externalEvaluator;
    regExpPattern = regExpPattern || descartesJS.buildRegularExpresionsPatterns(respPattern, evaluator);

    for (var i=0, l=regExpPattern.length; i<l; i++) {
      tempAnswers = regExpPattern[i];
      answerValue = true;
      
      for (var j=0, k=tempAnswers.length; j<k; j++) {
        tmpAnswer = tempAnswers[j].regExp;
        
        // a text pattern
        if (tmpAnswer) {
          if (tempAnswers[j].ignoreAcents) {
            resp = removeAccents(resp);
            tmpAnswer = removeAccents(tmpAnswer);
          }
          
          if (tempAnswers[j].ignoreCaps) {
            resp = resp.toLowerCase();
            tmpAnswer = removeAccents(tmpAnswer).toLowerCase();
          }

          answerValue = answerValue && !!(resp.match(tmpAnswer));
        }
        // a numeric pattern
        else {
          answerValue = answerValue = answerValue && inRange(tempAnswers[j], resp, evaluator);
        }
      }
      
      if (answerValue) {
        return 1;
      }
    }
    
    return 0;
  }

  return descartesJS;
})(descartesJS || {});