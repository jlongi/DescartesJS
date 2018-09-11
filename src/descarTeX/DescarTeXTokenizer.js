/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
    if (descartesJS.loadLib) { return descartesJS; }
  
    var operatorRegExp = /^[\_\^]/;

    /**
     * A rtf tokenizer
     * @constructor
     */
    descartesJS.DescarTeXTokenizer = function() { };
  
    /**
     * Get a rtf parse tree from an input
     * @param {String} input the rtf text to tokenize
     */
    descartesJS.DescarTeXTokenizer.prototype.tokenize = function(input) {
      input = input.replace(/\\n/g, "\\newline ");

      var tokens = [];
      var lastToken = null;
      var pos = 0;
      var inputLenght = input.length;
      var currentChar;
      var nextChar = input.charAt(0);
      var isCommand = false;
      var inMath = false;
      var brackets_open = 0;

      // replace the operators _ and ^, for the commands \subindex{} and \superindex{} respectively
      newInput = "";
      for (var i=0; i<inputLenght; i++) {
        currentChar = input.charAt(i);
        nextChar = input.charAt(i+1);

        if ((currentChar === "\\") && (nextChar === "$")) {
          inMath = true;
        }

        if (currentChar === "{") {
          brackets_open++;
        }
        else if (currentChar === "}") {
          brackets_open--;
          if (inMath && brackets_open === 0) {
            inMath = false;
          }
        }

        if (inMath) {
          if (currentChar === "_") {
            if (nextChar === "{") {
              newInput += "\\subindex";
            }
            else {
              newInput += "\\subindex{" + nextChar + "}";
              i++;
            }
          }
          else if (currentChar === "^") {
            if (nextChar === "{") {
              newInput += "\\superindex";
            }
            else {
              newInput += "\\superindex{" + nextChar + "}";
              i++;
            }
          }
          else {
            newInput += currentChar;
          }
        }
        else {
          newInput += currentChar;
        }
      }

      input = newInput;
      nextChar = input.charAt(0);
      inputLenght = input.length;

      while (pos < inputLenght) {
        currentChar = nextChar;
        nextChar = input.charAt(pos+1);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (isCommand) {
          if ((currentChar === "{") || (currentChar === "[") || (currentChar === "\\") || (currentChar === " ")) {
            isCommand = false;

            if (currentChar === " ") {
              lastToken = { type: "ignore" };
              tokens.push(lastToken);
            }
          }
          else {
            lastToken.value += currentChar;
          }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (!isCommand && (currentChar === "\\")) {
          isCommand = true;
          lastToken = { type: "command", value: "" };
          tokens.push(lastToken);
        }

        else if (!isCommand && ((currentChar === "{") || (currentChar === "["))) {
          lastToken = { type: "open", value: currentChar};
          tokens.push(lastToken);
        }
        else if (!isCommand && ((currentChar === "}") || (currentChar === "]"))) {
          lastToken = { type: "close", value: currentChar};
          tokens.push(lastToken);
        }
        // else if (!isCommand && (currentChar === "_")) {
        //   lastToken = { type: "command", value: "subindex" };
        //   tokens.push(lastToken);
        // }
        // else if (!isCommand && (currentChar === "^")) {
        //   lastToken = { type: "command", value: "superindex" };
        //   tokens.push(lastToken);
        // }

        else if (!isCommand) {
          if (lastToken && (lastToken.type === "text")) {
            lastToken.value += currentChar;
          }
          else if (lastToken && (lastToken.type === "ignore")) {
            tokens.pop();
            lastToken = tokens[tokens.length-1];
          }
          else {
            lastToken = { type: "text", value: currentChar };
            tokens.push(lastToken);
          }
        }

// console.log(currentChar)

        pos++;
      }
    
      return tokens;
    }
  
    return descartesJS;
  })(descartesJS || {});
  