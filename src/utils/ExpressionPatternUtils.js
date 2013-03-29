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
  var tempAnswer;
  var answerValue;

  /**
   * Build a simple regular expression pattern from a Descartes answer pattern (auxiliary function)
   * @param {String} answer the Descartes answer pattern to convert
   * @return {Object} return an object representing a simple regular expression pattern
   */
  function buildSimpleRegularExpressionPattern(answer) {
    tmpAnswer = answer.trim();
    answer = {ignoreAcents: false, ignoreCaps: false, regExp: null}
    
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

    if ((tmpAnswer[0] == "*") && (tmpAnswer[tmpAnswer.length-1] != "*")) {
      tmpAnswer = (tmpAnswer.substring(1)) + "$";
    }

    if ((tmpAnswer[0] != "*") && (tmpAnswer[tmpAnswer.length-1] == "*")) {
      tmpAnswer = "^" + (tmpAnswer.substring(0, tmpAnswer.length-1));
    }
        
    if ((tmpAnswer[0] == "*") && (tmpAnswer[tmpAnswer.length-1] == "*")) {
      tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);
    }
        
    tmpAnswer = tmpAnswer.replace(/\?/g, "[\\S\\s]{1}");

    answer.regExp = tmpAnswer;
    
    return answer;
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
  descartesJS.buildRegularExpresionsPatterns = function(answer) {
    if (answer.charAt(0) === "(" ) {
      answer = answer.substring(1);
    }
    if (answer.charAt(answer.length-1) === ")") {
      answer = answer.substring(0, answer.length-1);
    }

    answer = ((answer.replace(/&squot;/g, "'")).replace(/&amp;/g, "&")).split("|");

    for (var i=0, l=answer.length; i<l; i++) {
      tempAnswers = answer[i].split("&");
      answerArray = [];
      
      for (var j=0, k=tempAnswers.length; j<k; j++) {
        answerArray.push( buildSimpleRegularExpressionPattern(tempAnswers[j]) );
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
  descartesJS.escorrecto = function(respPattern, resp) {
    regExpPattern = descartesJS.buildRegularExpresionsPatterns(respPattern);

    // remove the accents
    resp = (removeAccents(resp)).toLowerCase();

    for (var i=0, l=regExpPattern.length; i<l; i++) {
      tempAnswer = regExpPattern[i];
      answerValue = true;

      for (var j=0, k=tempAnswer.length; j<k; j++) {
        tempAnswer[j].regExp = (removeAccents(tempAnswer[j].regExp)).toLowerCase();
        
        answerValue = answerValue && !!(resp.match(tempAnswer[j].regExp));
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
  descartesJS.esCorrecto = function(respPattern, resp) {
    regExpPattern = descartesJS.buildRegularExpresionsPatterns(respPattern);

    for (var i=0, l=regExpPattern.length; i<l; i++) {
      tempAnswer = regExpPattern[i];
      answerValue = true;
      
      for (var j=0, k=tempAnswer.length; j<k; j++) {
        
        if (tempAnswer[j].ignoreAcents) {
          resp = removeAccents(resp);
          tempAnswer[j].regExp = removeAccents(tempAnswer[j].regExp);
        }
        
        if (tempAnswer[j].ignoreCaps) {
          resp = resp.toLowerCase();
          tempAnswer[j].regExp = (tempAnswer[j].regExp).toLowerCase();  
        }
 
        answerValue = answerValue && !!(resp.match(tempAnswer[j].regExp));
      }
      
      if (answerValue) {
        return 1;
      }
    }
    
    return 0;
  }

  return descartesJS;
})(descartesJS || {});