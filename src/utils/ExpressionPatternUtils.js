/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  const epsilon = 0.000000001;
  let tmpAnswer;
  let regExpPattern_i;
  let answerArray;
  let answerValue;

  /**
   * Build a text regular expression pattern from a Descartes answer pattern (auxiliary function)
   * @param {String} answer the Descartes answer pattern to convert
   * @return {Object} return an object representing a simple regular expression pattern
   */
  function buildTextRegularExpressionPattern(answer) {
    // fix to operator in text
    answer = answer.replace(/\+/g, "\\+").replace(/\*/g, "\\*").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

    tmpAnswer = answer.trim();
    answer = { ignoreAccents: false, ignoreCaps: false, regExp: null };

    // ignore uppercase
    if ((/^'.*'$/).test(tmpAnswer)) {
      answer.ignoreCaps = true;
      tmpAnswer = tmpAnswer.slice(1, -1);

      // ignore accents
      if ((/^`.*´$/).test(tmpAnswer)) {
        answer.ignoreAccents = true;
        tmpAnswer = tmpAnswer.slice(1, -1);
      }
    }

    // ignore accents
    if ((/^`.*´$/).test(tmpAnswer)) {
      answer.ignoreAccents = true;
      tmpAnswer = tmpAnswer.slice(1, -1);

      // ignore uppercase
      if ((/^'.*'$/).test(tmpAnswer)) {
        answer.ignoreCaps = true;
        tmpAnswer = tmpAnswer.slice(1, -1);
      }
    }

    if ((tmpAnswer.startsWith("\\*")) && (!tmpAnswer.endsWith("\\*"))) {
      tmpAnswer = (tmpAnswer.substring(2)) + "$";
    }
    else if ((!tmpAnswer.startsWith("\\*")) && (tmpAnswer.endsWith("\\*"))) {
      tmpAnswer = "^" + (tmpAnswer.substring(0, tmpAnswer.length-2));
    }
    else if ((!tmpAnswer.startsWith("\\*")) && (!tmpAnswer.endsWith("\\*"))) {
      tmpAnswer = "^" + tmpAnswer + "$";
    }
    else if ((tmpAnswer.startsWith("\\*")) && (tmpAnswer.endsWith("\\*"))) {
      tmpAnswer = tmpAnswer.substring(2, tmpAnswer.length-2);
    }

    answer.regExp = tmpAnswer.replace(/\?/g, "[\\S\\s]{1}");

    return answer;
  }

  /**
   * Build a text regular expression pattern from a Descartes answer pattern (auxiliary function)
   * @param {String} answer the Descartes answer pattern to convert
   * @return {Object} return an object representing a simple regular expression pattern
   */
  function buildNumericRegularExpressionPattern(answer="", evaluator) {
    let answer_reg = {};
    let answer_match = answer.match(/^\s*(\(|\[)(.*)(\)|\])\s*$/);

    // is an interval
    if (answer_match) {
      // join the parentheses or square brackets for the type
      answer_reg.type = answer_match[1] + answer_match[3];

      // split the expresión
      answer_match = descartesJS.splitComa(answer_match[2]);
      answer_reg.min = evaluator.parser.parse(answer_match[0]);
      answer_reg.max = evaluator.parser.parse(answer_match[1]);
    }
    // is a number or variable
    else {
      // convert the numerical value to a close interval
      answer_reg.type = "[]";
      answer_reg.min = answer_reg.max = evaluator.parser.parse(answer);
    }

    return answer_reg;
  }

  /**
   * 
   */
  function evalNumericAnswer(regExp, value, evaluator) {
    value = parseFloat(value);
    let min_val = evaluator.eval(regExp.min);
    let max_val = evaluator.eval(regExp.max);

    let ok_min = (regExp.type[0] == "(") ? 
                 (min_val < value) :
                 ((min_val < value) || (Math.abs(min_val - value) < epsilon));

    let ok_max = (regExp.type[1] == ")") ?
                 (value < max_val) :
                 ((value < max_val) || (Math.abs(max_val - value) < epsilon));

    return ok_min && ok_max;
  }

  /**
   * Remove the accents in a string and change the ñ for n
   * @param {String} value the string to remove the accents
   * @return {String} return ths string with the accents remove
   */
  function removeAccents(str="") {
    return str.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  /**
   * Build a regular expression pattern from a Descartes answer pattern
   * @param {String} answer the Descartes answer pattern to convert
   * @return {Object} return an object representing a regular expression pattern
   */
  descartesJS.answerRegEx = function(answer="", evaluator, isTextual) {
    if (isTextual) {
      // remove parentheses in a text expression
      if ((/^\(.*\)$/).test(answer)) {
        answer = answer.slice(1, -1);
      }
    }

    // get an array with the multiple answer patterns
    answer = ((answer.replace(/&squot;/g, "'")).replace(/&amp;/g, "&")).split("|");

    for (let i=0, l=answer.length; i<l; i++) {
      // get an array of elements joined with &
      regExpPattern_i = answer[i].split("&");
      answerArray = [];

      for (let tmpAnswer of regExpPattern_i) {
        // text pattern
        if (isTextual) {
          answerArray.push( buildTextRegularExpressionPattern(tmpAnswer) );
        }
        // numeric pattern
        else {
          answerArray.push( buildNumericRegularExpressionPattern(tmpAnswer, evaluator) );
        }
      }

      answer[i] = answerArray;
    }

    return answer;
  }

  /**
   * Decide whether the answer meets the Descartes answer pattern strictly
   * @param {String} regExpPattern the Descartes answer pattern
   * @param {String} resp the answer to check
   * @param {object} evaluator the descartes evaluator of the scene
   * @return {Number} return 1 if the answer meets the Descartes answer pattern and 0 if not
   */
  descartesJS.esCorrecto = function(regExpPattern, resp="", evaluator) {
    resp = resp+'';

    for (let regExpPattern_i of regExpPattern) {
      answerValue = true;

      for (let regExpPattern_i_j of regExpPattern_i)  {
        tmpAnswer = regExpPattern_i_j.regExp;

        // a text pattern
        if (tmpAnswer) {
          if (regExpPattern_i_j.ignoreAccents) {
            resp = removeAccents(resp);
            tmpAnswer = removeAccents(tmpAnswer);
          }

          if (regExpPattern_i_j.ignoreCaps) {
            resp = resp.toLowerCase();
            tmpAnswer = removeAccents(tmpAnswer).toLowerCase();
          }

          // !! converts the value in a boolean
          answerValue = answerValue && !!(resp.match(tmpAnswer));
        }
        // a numeric pattern
        else {
          answerValue = answerValue && evalNumericAnswer(regExpPattern_i_j, resp, evaluator);
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
