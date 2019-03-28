/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class DescarTeXParser {
    /**
     * A rtf tokenizer
     */
    constructor() {
      this.tokenizer = new descartesJS.DescarTeXTokenizer();
    }

    /**
     * Get a rtf parse tree from an input
     * @param {String} input the rtf text to tokenize
     */
    parse(input, evaluator, style) {
      var tokens = this.tokenizer.tokenize(input);

      var textNodes = new descartesJS.TextNode("", "textBlock", style, null);
      var lastNode = new descartesJS.TextNode("", "textLineBlock", style.clone(), null);
      textNodes.addChild(lastNode);

      var commandStack = [];
      var lastCommand = undefined;
      var lastStyle = style;
      var styleStack = [style];
      var newStyle;
      var textParts;
      var newColor;
      var tmpNode;
      var mathMode = false;
// console.log(tokens);
      for (var i=0, l=tokens.length; i<l; i++) {
// console.log(tokens[i], `, lastCommand:${lastCommand}, tokens.type:${tokens[i].type}, mathMode:${mathMode}`);
// console.log(commandStack);

        if (tokens[i].type === "text") {
          if (lastCommand === "color_parameter") {
            newColor = new descartesJS.Color(tokens[i].value, evaluator);
            continue;
          }

          else if (lastNode.nodeType === "textLineBlock") {
            textParts = tokens[i].value.split(" ");
            for (var ti=0, tl=textParts.length; ti<tl; ti++) {
              if (textParts[ti] !== "") {
                lastNode.addChild( new descartesJS.TextNode(textParts[ti], "text", lastStyle.clone(), null) );
              }
              if (ti+1 < tl) {
                lastNode.addChild( new descartesJS.TextNode(" ", "space", lastStyle.clone(), null) );
              }
            }
          }
          else {
            lastNode.addChild( new descartesJS.TextNode(tokens[i].value, "text", lastStyle.clone(), null) );
          }
        }

        else if ( (tokens[i].type === "command") && (tokens[i].value === "curlyBracketOpen") ) {
          lastNode.addChild( new descartesJS.TextNode("{", "text", lastStyle.clone(), null) );
        }
        else if ( (tokens[i].type === "command") && (tokens[i].value === "curlyBracketClose") ) {
          lastNode.addChild( new descartesJS.TextNode("}", "text", lastStyle.clone(), null) );
        }
        else if ( (tokens[i].type === "command") && (tokens[i].value === "squareBracketOpen") ) {
          lastNode.addChild( new descartesJS.TextNode("[", "text", lastStyle.clone(), null) );
        }
        else if ( (tokens[i].type === "command") && (tokens[i].value === "squareBracketClose") ) {
          lastNode.addChild( new descartesJS.TextNode("]", "text", lastStyle.clone(), null) );
        }

        else if ( (tokens[i].type === "command") && (tokens[i].value === "newline") ) {
          if (lastNode.children.length === 0) {
            lastNode.addChild( new descartesJS.TextNode("", "text", lastStyle.clone(), null) );
          }
          lastNode = new descartesJS.TextNode("", "textLineBlock", style.clone(), null);
          textNodes.addChild(lastNode);
        }
        else if ( (tokens[i].type === "command") && (tokens[i].value === "b") ) {
          lastCommand = "bold";
          commandStack.push(lastCommand);
        }
        else if ( (tokens[i].type === "command") && (tokens[i].value === "i") ) {
          lastCommand = "italic";
          commandStack.push(lastCommand);
        }
        else if ( (tokens[i].type === "command") && (tokens[i].value === "color") ) {
          lastCommand = "color";
          commandStack.push(lastCommand);
        }
        else if ( (tokens[i].type === "command") && (tokens[i].value === "c") ) {
          lastCommand = "center";
          commandStack.push(lastCommand);
        }
        else if ( (tokens[i].type === "command") && (tokens[i].value === "l") ) {
          lastCommand = "left";
          commandStack.push(lastCommand);
        }
        else if ( (tokens[i].type === "command") && (tokens[i].value === "r") ) {
          lastCommand = "right";
          commandStack.push(lastCommand);
        }
        else if ( (tokens[i].type === "command") && (tokens[i].value === "j") ) {
          lastCommand = "justify";
          commandStack.push(lastCommand);
        }

        else if ( (tokens[i].type === "command") && (tokens[i].value === "$") ) {
          lastCommand = "formula";
          commandStack.push(lastCommand);
          mathMode = true;
        }

        else if ( (tokens[i].type === "command") && (tokens[i].value === "sum") ) {
          lastCommand = "sum";
          commandStack.push(lastCommand);
        }
        else if ( (tokens[i].type === "command") && (tokens[i].value === "int") ) {
          lastCommand = "integral";
          commandStack.push(lastCommand);
        }
        else if ( (tokens[i].type === "command") && (tokens[i].value === "lim") ) {
          lastCommand = "limit";
          commandStack.push(lastCommand);
        }

        else if ( (tokens[i].type === "command") && (tokens[i].value === "sqrt") ) {
          lastCommand = "radical";
          commandStack.push(lastCommand);
        }
        
        else if ( (tokens[i].type === "command") && (tokens[i].value === "subindex") ) {
          lastCommand = "subIndex";
          commandStack.push(lastCommand);
        }
        else if ( (tokens[i].type === "command") && (tokens[i].value === "superindex") ) {
          lastCommand = "superIndex";
          commandStack.push(lastCommand);
        }
        else if ( (tokens[i].type === "command") && (tokens[i].value === "frac") ) {
          lastCommand = "numerator";
          commandStack.push(lastCommand);
        }


        else if ( (tokens[i].type === "open") && (tokens[i].value === "{") && (lastCommand !== undefined) ) {
          if ( (lastCommand === "bold") || (lastCommand === "italic") ) {
            newStyle = lastStyle.clone();
            newStyle[lastCommand] = true;
            styleStack.push( newStyle );
            lastStyle = newStyle;
          }

          else if (lastCommand === "color") {
            lastCommand = "color_parameter";
            // commandStack.push(lastCommand);
          }

          else if (lastCommand === "color_text") {
            newStyle = lastStyle.clone();
            newStyle.color = newColor;
            styleStack.push( newStyle );
            lastStyle = newStyle;
          }

          else if (
            (lastCommand === "center") ||
            (lastCommand === "left") ||
            (lastCommand === "right") ||
            (lastCommand === "justify") 
          ) {
            newStyle = lastStyle.clone();
            newStyle.align = lastCommand;
            styleStack.push( newStyle );
            lastStyle = newStyle;

            lastNode = new descartesJS.TextNode("", "textLineBlock", lastStyle.clone(), null);
            textNodes.addChild(lastNode);
          }

          else if (lastCommand === "formula") {
            newStyle = lastStyle.clone();
            newStyle.italic = true;
            styleStack.push( newStyle );
            lastStyle = newStyle;

            tmpNode = new descartesJS.TextNode("", "formula", lastStyle.clone(), null);
            lastNode.addChild(tmpNode);
            lastNode = tmpNode;
          }
          else if ( (lastCommand === "subIndex") || (lastCommand === "superIndex") ) {
            if (mathMode) {
              newStyle = lastStyle.clone();
              // newStyle.size = Math.max( Math.floor(newStyle.size*0.33), 8 );
              styleStack.push( newStyle );
              lastStyle = newStyle;

              tmpNode = new descartesJS.TextNode("", lastCommand, lastStyle.clone(), null);
              lastNode.addChild(tmpNode);
              lastNode = tmpNode;
            }
            else {
              lastNode.addChild( new descartesJS.TextNode(((lastCommand === "subIndex") ? "_" : "^" ), "text", lastStyle.clone(), null) );
            }
          }

          else if (lastCommand === "radical") {
            if (mathMode) {
              tmpNode = new descartesJS.TextNode("", "radical", lastStyle.clone(), null);
              lastNode.addChild(tmpNode);
              lastNode = tmpNode;

              newStyle = lastStyle.clone();
              // newStyle.size = Math.max( Math.floor(newStyle.size*0.5), 8 );
              styleStack.push( newStyle );
              lastStyle = newStyle;

              tmpNode = new descartesJS.TextNode("", "index", lastStyle.clone(), null);
              lastNode.addChild(tmpNode);
              lastNode = tmpNode;

              lastCommand = "index";
            }
          }
          else if (lastCommand === "index") {
            if (mathMode) {
              styleStack.pop();
              lastStyle = styleStack[styleStack.length -1];

              tmpNode = new descartesJS.TextNode("", "radicand", lastStyle.clone(), null);
              lastNode.addChild(tmpNode);
              lastNode = tmpNode;

              lastCommand = "radicand";
            }
          }


          else if ((lastCommand === "sum") || (lastCommand === "integral") || (lastCommand === "limit")) {
            if (mathMode) {
              tmpNode = new descartesJS.TextNode("", lastCommand, lastStyle.clone(), null);
              lastNode.addChild(tmpNode);
              lastNode = tmpNode;

              newStyle = lastStyle.clone();
              // newStyle.size = Math.max( Math.floor(newStyle.size*0.2), 8 );
              styleStack.push( newStyle );
              lastStyle = newStyle;

              tmpNode = new descartesJS.TextNode("", "from", lastStyle.clone(), null);
              lastNode.addChild(tmpNode);
              lastNode = tmpNode;

              lastCommand = "from";
            }
          }
          else if (lastCommand === "from") {
            if (mathMode) {
              tmpNode = new descartesJS.TextNode("", "to", lastStyle.clone(), null);
              lastNode.addChild(tmpNode);
              lastNode = tmpNode;

              lastCommand = "to";
            }
          }
          else if (lastCommand === "to") {
            if (mathMode) {
              styleStack.pop();
              lastStyle = styleStack[styleStack.length -1];

              tmpNode = new descartesJS.TextNode("", "what", lastStyle.clone(), null);
              lastNode.addChild(tmpNode);
              lastNode = tmpNode;

              lastCommand = "what";
            }
          }

          else if (lastCommand === "numerator") {
            if (mathMode) {
              tmpNode = new descartesJS.TextNode("", "fraction", lastStyle.clone(), null);
              lastNode.addChild(tmpNode);
              lastNode = tmpNode;

              newStyle = lastStyle.clone();
              styleStack.push( newStyle );
              lastStyle = newStyle;

              tmpNode = new descartesJS.TextNode("", "numerator", lastStyle.clone(), null);
              lastNode.addChild(tmpNode);
              lastNode = tmpNode;

              lastCommand = "numerator";
            }
          }
          else if (lastCommand === "denominator") {
            tmpNode = new descartesJS.TextNode("", lastCommand, lastStyle.clone(), null);
            lastNode.addChild(tmpNode);
            lastNode = tmpNode;
          }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        else if ( (tokens[i].type === "close") && (tokens[i].value === "}") && (lastCommand !== undefined) ) {
          if ( (lastCommand === "bold") || (lastCommand === "italic") || (lastCommand === "color_text") || (lastCommand === "color") ) {
            styleStack.pop();
            lastStyle = styleStack[styleStack.length -1];
            commandStack.pop();
            lastCommand = commandStack[commandStack.length -1];
          }
          else if (lastCommand === "color_parameter") {
            lastCommand = "color_text";
            continue;
          }
          else if (
            (lastCommand === "center") ||
            (lastCommand === "left") ||
            (lastCommand === "right") ||
            (lastCommand === "justify") 
          ) {
            styleStack.pop();
            lastStyle = styleStack[styleStack.length -1];
            commandStack.pop();
            lastCommand = commandStack[commandStack.length -1];

            if ( (tokens[i+1]) && (tokens[i+1].type === "command") && (tokens[i+1].value === "newline") ) {
              lastNode = textNodes;
            }
            else {
              lastNode = new descartesJS.TextNode("", "textLineBlock", lastStyle.clone(), null);
              textNodes.addChild(lastNode);
            }
          }

          if (lastNode.nodeType === "formula") {
            mathMode = false;
            styleStack.pop();
            lastStyle = styleStack[styleStack.length -1];
            commandStack.pop();
            lastCommand = commandStack[commandStack.length -1];
            lastNode = lastNode.parent;
          }

          else if ( (lastNode.nodeType === "subIndex") || (lastNode.nodeType === "superIndex") ) {
            if (mathMode) {
              styleStack.pop();
              lastStyle = styleStack[styleStack.length -1];
              commandStack.pop();
              lastCommand = commandStack[commandStack.length -1];
              lastNode = lastNode.parent;
            }
          }

          else if (lastNode.nodeType === "index") {
            lastNode = lastNode.parent;
          }
          else if (lastNode.nodeType === "radicand") {
            commandStack.pop();
            lastCommand = commandStack[commandStack.length -1];
            lastNode = lastNode.parent.parent;
          }

          else if (lastNode.nodeType === "from") {
            lastNode = lastNode.parent;
          }
          else if (lastNode.nodeType === "to") {
            lastNode = lastNode.parent;
          }
          else if (lastNode.nodeType === "what") {
            commandStack.pop();
            lastCommand = commandStack[commandStack.length -1];
            lastNode = lastNode.parent.parent;
          }

          else if (lastNode.nodeType === "numerator") {
            lastCommand = "denominator";
            lastNode = lastNode.parent;
          }
          else if (lastNode.nodeType === "denominator") {
            styleStack.pop();
            lastStyle = styleStack[styleStack.length -1];
            commandStack.pop();
            lastCommand = commandStack[commandStack.length -1];
            lastNode = lastNode.parent.parent;
          }
        }

        // add { }
        // else if ( (tokens[i].type === "open") && (tokens[i].value === "{") && (lastCommand === undefined) ) {
        //   lastNode.addChild( new descartesJS.TextNode("{", "text", lastStyle.clone(), null) );
        // }
        // else if ( (tokens[i].type === "close") && (tokens[i].value === "}") && (lastCommand === undefined) ) {
        //   lastNode.addChild( new descartesJS.TextNode("}", "text", lastStyle.clone(), null) );
        // }


      }
      
      var currentNode;
      var nextNode;
      var joinNode = null;
      var toDelete = [];
      var tmpNode;
      // join text nodes into a word if two text nodes are together
      textNodes.children.forEach(function(line) {
        for (var i=0, l=line.children.length; i<l-1; i++) {
          currentNode = line.children[i];
          nextNode = line.children[i+1];
          
          if ((currentNode.nodeType === "text") && (nextNode.nodeType === "text") && (currentNode.style.equals(nextNode.style))) {
            if (joinNode === null) {
              joinNode = currentNode;
              tmpNode = currentNode.clone();
              joinNode.changeNodeType("word");
              joinNode.value = "___" + tmpNode.value;
              joinNode.addChild(tmpNode);
            }
            tmpNode = nextNode.clone();
            joinNode.addChild(tmpNode);
            toDelete.push(nextNode);
            joinNode.value += tmpNode.value;
          }
          else {
            joinNode = null;
          }
        }
      });

      toDelete.forEach(function(node) {
        node.parent.removeChild(node);
      });
// console.log(textNodes, textNodes.normalize());

      textNodes.adjustFontSize();
      return textNodes.normalize();
    }
  }

  descartesJS.DescarTeXParser = DescarTeXParser;
  return descartesJS;
})(descartesJS || {});
