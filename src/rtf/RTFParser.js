/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathMax = Math.max;

  var tokens;
  var fontTable;
  var openBlockIndex;
  var tempI;
  var colorTable;
  var colorTableIndex;
  var r;
  var g;
  var b;
  var newNode;
  var lastNode;
  var lastDynamicNode;
  var lastMatrixNode;
  var lastPartsNode;
  var descartesFormula;
  var dynamicText;
  var setDecimals;
  var setRows;
  var setColumns;
  var setParts;
  var styleStack;
  var styleStackTop;
  var blockNum;
  var formulaBlock;
  var formulaStack;
  var descartesComponentNumCtrl;
  var descartesComponentSpace;
  var descartesHyperLink;
  var rootNode;

  /**
   * Descartes RTF parser
   * @constructor
   */
  descartesJS.RTFParser = function(evaluator) {
    this.evaluator = evaluator;
    this.tokenizer = new descartesJS.RTFTokenizer();
  }

  /**
   * Parse a string and get a rtf parse tree
   * @param {String} input the input string to parse
   * @param {RTFNode} return a parse tree corresponding to the rtf input
   */
  descartesJS.RTFParser.prototype.parse = function(input) {
// console.log(input);
    tokens = this.tokenizer.tokenize(input);
    // tokens = checkMathSymboslInFormula(tokens);
    fontTable = {};
    tempI = 2;
// console.log(tokens);

    // build the font block
    if ( (tokens[0].type === "openBlock") && (tokens[1].value === "fonttbl") ) {
      openBlockIndex = tokens[0].value;

      while ( ((tokens[tempI].type !== "closeBlock") && (tokens[tempI].value !== openBlockIndex)) ) {
        fontTable[tokens[tempI].value] = (tokens[tempI+2].value).substring(0, (tokens[tempI+2].value).length-1);
        tempI = tempI + 3;
      }

      tempI++;
    }

    colorTable = {};
    colorTableIndex = 0;

    // build the color block
    if ( (tokens[tempI].type === "openBlock") && (tokens[tempI+1].value === "colortbl") ) {
      openBlockIndex = tokens[tempI++].value;

      tempI++;

      while ( ((tokens[tempI].type !== "closeBlock") && (tokens[tempI].value !== openBlockIndex)) ) {
        // \red###\green###\blue###;
        r = parseInt(tokens[tempI++].value.substring(3)).toString(16);
        g = parseInt(tokens[tempI++].value.substring(5)).toString(16);
        b = parseInt(tokens[tempI++].value.substring(4)).toString(16);

        // colors separator
        if (tokens[tempI].value === ";") {
          tempI++;
        }

        // #rrggbb
        colorTable[colorTableIndex++] = "#" + ((r.length < 2)? "0"+r : r) + ((g.length < 2)? "0"+g : g) + ((b.length < 2)? "0"+b : b);
      }

      tempI++;
    }

    lastDynamicNode = null;
    lastMatrixNode = null;
    lastPartsNode = null;
    descartesFormula = false;
    dynamicText = false;
    setDecimals = false;
    setRows = false;
    setColumns = false;
    setParts = false;
    descartesComponentNumCtrl = false;
    descartesComponentSpace = false;
    descartesHyperLink = false;
    styleStack = [ new descartesJS.TextStyle() ];
    styleStackTop = styleStack[0];

    blockNum = -1;
    formulaBlock = -1;
    formulaStack = [];

    // initial nodes
    newNode = rootNode =  new descartesJS.TextNode("", "textBlock", styleStackTop, this.evaluator); // root
    lastNode = new descartesJS.TextNode("", "textLineBlock", styleStackTop, this.evaluator); // first line
    newNode.addChild(lastNode);
    rootNode.stableWidth = true;
    rootNode.hasFormula = false;

    // build the nodes
    for (var i=tempI, l=tokens.length; i<l; i++) {
      ////////////////////////////////////////////////////
      // controlWord elements
      ////////////////////////////////////////////////////
      if (tokens[i].type == "controlWord") {
        // font type
        if (fontTable[tokens[i].value]) {
          styleStackTop.set({ family: fontTable[tokens[i].value] });
        }

        // font size
        else if (tokens[i].value.match(/^fs(\d+)/)) {
          styleStackTop.set({ size: parseInt(((tokens[i].value.match(/^fs(\d+)/))[1])/2) });
        }

        // init bold text
        else if (tokens[i].value == "b") {
          styleStackTop.set({ bold: true });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ bold: true });
          }
        }

        // end bold text
        else if (tokens[i].value == "b0") {
          styleStackTop.set({ bold: false });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ bold: false });
          }
        }

        // init italic text
        else if (tokens[i].value == "i") {
          styleStackTop.set({ italic: true });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ italic: true });
          }
        }

        // end italic text
        else if (tokens[i].value == "i0") {
          styleStackTop.set({ italic: false });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ italic: false });
          }
        }

        // init underline text
        else if (tokens[i].value == "ul") {
          styleStackTop.set({ underline: true });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ underline: true });
          }
        }

        // end underline text
        else if (tokens[i].value == "ulnone") {
          styleStackTop.set({ underline: false });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ underline: false });
          }
        }

        // init overline text
        else if (tokens[i].value == "ol") {
          styleStackTop.set({ overline: true });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ overline: true });
          }
        }

        // end overline text
        else if (tokens[i].value == "olnone") {
          styleStackTop.set({ overline: false });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.set({ overline: false });
          }
        }

        // color text
        else if (tokens[i].value.match(/^cf(\d+)/)) {
          styleStackTop.set({ color: colorTable[parseInt(tokens[i].value.substring(2))] });
          if (formulaStack.length > 0) {
            formulaStack[formulaStack.length-1].style.color = styleStackTop.color;
          }
        }

        // a new line
        else if (tokens[i].value == "par") {
          // is not necesary to add the new line node, because a new textLineBlock is added
          // lastNode.addChild( new descartesJS.TextNode("", "newLine", styleStackTop.clone()) );

          newNode = new descartesJS.TextNode("", "textLineBlock", styleStackTop.clone(), this.evaluator);

          // find a textBlock to add the new line
          if (lastNode.nodeType != "textBlock") {
            lastNode = lastNode.parent;

            while (lastNode.nodeType != "textBlock") {
              lastNode = lastNode.parent;
            }
          }

          lastNode.addChild(newNode);
          lastNode = newNode;
        }

        // descartes formula
        else if (tokens[i].value == "mjaformula") {
          rootNode.hasFormula = true;
          formulaBlock = blockNum;
          descartesFormula = true;

          newNode = new descartesJS.TextNode("", "formula", styleStackTop.clone(), this.evaluator);
          lastNode.addChild(newNode);
          lastNode = newNode;

          formulaStack[formulaStack.length-1] = newNode;
        }

        // fraction, sum, integral and limit
        else if ((tokens[i].value == "fraction") ||
                 (tokens[i].value == "radicand") ||
                 (tokens[i].value == "radical") ||
                 (tokens[i].value == "what") ||
                 (tokens[i].value == "sum") ||
                 (tokens[i].value == "integral") ||
                 (tokens[i].value == "limit")
                ) {
          var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

          newNode = new descartesJS.TextNode("",  tokens[i].value, tmpStyle, this.evaluator);

          // add the new node to the element previous to the top, because the top contains the new element to add
          formulaStack[formulaStack.length-2].addChild(newNode);

          // the new element is the stack top
          formulaStack[formulaStack.length-1] = newNode;
        }

        // root index
        else if (tokens[i].value == "index") {
          var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

          // the size of the font can not be less than 8
          tmpStyle.size = mathMax( parseInt(tmpStyle.size - tmpStyle.size*0.5), 8 );

          newNode = new descartesJS.TextNode("", tokens[i].value, tmpStyle, this.evaluator);

          // add the new node to the element previous to the top, because the top contains the new element to add
          formulaStack[formulaStack.length-2].addChild(newNode);

          // the new element is the stack top
          formulaStack[formulaStack.length-1] = newNode;
        }

        // limits of sum and integral
        else if (
          (tokens[i].value == "to") ||
          (tokens[i].value == "from") 
        ) {
          var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

          // the size of the font can not be less than 8
          tmpStyle.size = mathMax( parseInt(tmpStyle.size - tmpStyle.size*0.2), 8 );

          newNode = new descartesJS.TextNode("", tokens[i].value, tmpStyle, this.evaluator);

          // add the new node to the element previous to the top, because the top contains the new element to add
          formulaStack[formulaStack.length-2].addChild(newNode);

          // the new element is the stack top
          formulaStack[formulaStack.length-1] = newNode;
        }

        // numerator or denominator of a fraction
        else if ((tokens[i].value == "num") || (tokens[i].value == "den")) {
          var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

          // the size of the font can not be less than 8
          tmpStyle.size = mathMax( Math.round(tmpStyle.size - tmpStyle.size*0.1), 8 );

          if (tokens[i].value == "num") {
            newNode = new descartesJS.TextNode("", "numerator", tmpStyle, this.evaluator);
          }
          else if (tokens[i].value == "den") {
            newNode = new descartesJS.TextNode("", "denominator", tmpStyle, this.evaluator);
          }

          // add the new node to the element previous to the top, because the top contains the new element to add
          formulaStack[formulaStack.length-2].addChild(newNode);

          // the new element is the stack top
          formulaStack[formulaStack.length-1] = newNode;
        }

        // subindex or superindex
        else if ((tokens[i].value == "subix") || (tokens[i].value == "supix")) {
          var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

          // the size of the font can not be less than 8
          tmpStyle.size = mathMax( Math.floor(tmpStyle.size - tmpStyle.size*0.33), 8 );

          if (tokens[i].value == "subix") {
            newNode = new descartesJS.TextNode("", "subIndex", tmpStyle, this.evaluator);
          }
          else if (tokens[i].value == "supix") {
            newNode = new descartesJS.TextNode("", "superIndex", tmpStyle, this.evaluator);
          }

          newNode.originalStyle = formulaStack[formulaStack.length-2].style.clone();

          // add the new node to the element previous to the top, because the top contains the new element to add
          formulaStack[formulaStack.length-2].addChild(newNode);

          // the new element is the stack top
          formulaStack[formulaStack.length-1] = newNode;
        }

        // defparts, a matrix or an element
        else if ( (tokens[i].value == "defparts") || (tokens[i].value == "matrix") || (tokens[i].value == "element") ) {
          var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

          newNode = new descartesJS.TextNode("", tokens[i].value, tmpStyle, this.evaluator);

          // add the new node to the element previous to the top, because the top contains the new element to add
          formulaStack[formulaStack.length-2].addChild(newNode);

          // the new element is the stack top
          formulaStack[formulaStack.length-1] = newNode;

          if (tokens[i].value == "defparts") {
            lastPartsNode = newNode;
          }
          else if (tokens[i].value == "matrix") {
            lastMatrixNode = newNode;
          }
        }

        // number of parts
        else if (tokens[i].value == "parts") {
          setParts = true;
        }

        // number of rows
        else if (tokens[i].value == "rows") {
          setRows = true;
        }

        // number of columns
        else if (tokens[i].value == "columns") {
          setColumns = true;
        }

        // dynamic text
        else if (tokens[i].value == "expr") {
          rootNode.stableWidth = false;
          dynamicText = true;
        }

        // number of decimals in the text
        else if (tokens[i].value == "decimals") {
          setDecimals = true;
        }

        // fixed representation activated
        else if (tokens[i].value == "fixed1") {
          lastDynamicNode.fixed = true;
        }

        // fixed representation desactivated
        else if (tokens[i].value == "fixed0") {
          lastDynamicNode.fixed = false;
        }

        // a component
        else if (tokens[i].value == "component") { }

        // a control component
        else if (tokens[i].value == "NumCtrl") {
          descartesComponentNumCtrl = true;
        }

        // a space component
        else if (tokens[i].value == "Space") {
          descartesComponentSpace = true;
        }

        // hyperlink
        else if (tokens[i].value == "hyperlink") {
          descartesHyperLink = true;
        }
      }

      ////////////////////////////////////////////////////
      // text elements
      ////////////////////////////////////////////////////
      if (tokens[i].type == "text") {
        // set the number of parts
        if (setParts) {
          lastPartsNode.parts = (parseInt(tokens[i].value));
          setParts = false;
        }

        // set the number of rows
        else if (setRows) {
          lastMatrixNode.rows = (parseInt(tokens[i].value));
          setRows = false;
        }

        // set the number of columns
        else if (setColumns) {
          lastMatrixNode.columns = (parseInt(tokens[i].value));
          setColumns = false;
        }

        // set the number of decimals
        else if (setDecimals) {
          // lastDynamicNode.decimals = tokens[i].value;
          lastDynamicNode.decimals = this.evaluator.parser.parse( tokens[i].value +"");
          setDecimals = false;
        }

        // hyperlink content
        else if (descartesHyperLink) {
          textContent = ((tokens[i].value).split("|"))[0];
          tmpStyle = styleStackTop.clone();

          newNode = new descartesJS.TextNode(textContent, "hyperlink", tmpStyle, this.evaluator);
          newNode.URL = ((tokens[i].value).split("|"))[1];

          if (lastNode.nodeType != "textLineBlock") {
            lastNode = lastNode.parent;

            while (lastNode.nodeType != "textLineBlock") {
              lastNode = lastNode.parent;
            }
          }

          lastNode.addChild(newNode);

          descartesHyperLink = false;
        }

        // a control component content
        else if (descartesComponentNumCtrl) {
          newNode = new descartesJS.TextNode(tokens[i].value, "componentNumCtrl", styleStackTop.clone(), this.evaluator);

          lastNode.addChild(newNode);

          descartesComponentNumCtrl = false;
        }

        // a space component content
        else if (descartesComponentSpace) {
          newNode = new descartesJS.TextNode(tokens[i].value, "componentSpace", styleStackTop.clone(), this.evaluator);

          lastNode.addChild(newNode);

          descartesComponentSpace = false;
        }

        // dynamic text content
        else if (dynamicText) {
          var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

          // textContent = tokens[i].value;
          textContent = this.evaluator.parser.parse(tokens[i].value);

          newNode = new descartesJS.TextNode(textContent, "dynamicText", tmpStyle, this.evaluator);

          // add the new node to the element previous to the top, because the top contains the new element to add
          formulaStack[formulaStack.length-2].addChild(newNode);

          // the new element is the stack top
          formulaStack[formulaStack.length-1] = newNode;

          // save the reference to the last dynamic node, to asign the number of decimals and the fixed representation
          lastDynamicNode = newNode;

          dynamicText = false;
        }

        // no formula text
        else if ((!dynamicText) && (!descartesFormula)) {
          textContent = tokens[i].value;

          newNode = new descartesJS.TextNode(textContent, "text", styleStackTop.clone(), this.evaluator);

          if (lastNode.nodeType != "textLineBlock") {
            lastNode = lastNode.parent;

            while (lastNode.nodeType != "textLineBlock") {
              lastNode = lastNode.parent;
            }
          }

          lastNode.addChild(newNode);
        }

        // formula text
        else if ((!dynamicText) && (descartesFormula)) {
          textContent = tokens[i].value;

          newNode = new descartesJS.TextNode(textContent, "text", formulaStack[formulaStack.length-1].style.clone(), this.evaluator);

          // add the new node to the top of the formulas stack
          formulaStack[formulaStack.length-1].addChild(newNode);
        }
      }

      ////////////////////////////////////////////////////
      // other elements
      ////////////////////////////////////////////////////

      // init a rtf block, expression or formula
      else if (tokens[i].type == "openBlock") {
        blockNum = tokens[i].value;

        styleStackTop = styleStackTop.clone();
        styleStack.push(styleStackTop);

        formulaStack.push(null);
      }

      // close a rtf block, expression or formulas
      else if (tokens[i].type == "closeBlock") {
        if (tokens[i].value == formulaBlock) {
          formulaBlock = -1;
          descartesFormula = false;
          lastNode = lastNode.parent;
        }

        styleStack.pop();
        styleStackTop = styleStack[styleStack.length-1];

        formulaStack.pop();
      }

      // mathematical symbols parentheses
      else if ( (tokens[i].type == "(") || (tokens[i].type == ")") ) {
        var tmpStyle = formulaStack[formulaStack.length-1].style.clone();
        tmpStyle.italic = "";

        newNode = new descartesJS.TextNode(tokens[i].type, "mathSymbol", tmpStyle, this.evaluator);

        // add the new node to the top of the formulas stack
        formulaStack[formulaStack.length-1].addChild(newNode);
      }

      // mathematical symbols +, -, *,  =
      else if ( (tokens[i].type == "+") || (tokens[i].type == "-") || (tokens[i].type == "*") || (tokens[i].type == "=") ) {
        newNode = new descartesJS.TextNode(tokens[i].type, "mathSymbol", formulaStack[formulaStack.length-1].style.clone(), this.evaluator);

        // add the new node to the top of the formulas stack
        formulaStack[formulaStack.length-1].addChild(newNode);
      }

      // unknown elements
      else {
//         console.log("Desconocido ", tokens[i]);
      }
    }

    return rootNode.normalize();
  }

  return descartesJS;
})(descartesJS || {});
