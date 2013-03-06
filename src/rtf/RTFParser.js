/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * 
   * @constructor 
   */
  descartesJS.RTFParser = function(evaluator) {
    this.evaluator = evaluator;
    this.tokenizer = new descartesJS.RTFTokenizer();
  }
  
  /**
   * 
   * @constructor 
   */
  descartesJS.RTFParser.prototype.parse = function(input) {
    // console.log(input);
    var tokens = this.tokenizer.tokenize(input);
    tokens = checkMathSymboslInFormula(tokens);
    var indexToken = 0;
    var fontTable = {};
    var openBlockIndex;
    var tempI = 2;
    //console.log(tokens);
    
    // se construye el bloque de tipografias
    if ( (tokens[0].type == "openBlock") && (tokens[1].value == "fonttbl") ) {
      openBlockIndex = tokens[0].value;
      
      while ( ((tokens[tempI].type != "closeBlock") && (tokens[tempI].value != openBlockIndex)) ) {
        fontTable[tokens[tempI].value] = (tokens[tempI+2].value).substring(0, (tokens[tempI+2].value).length-1);
        tempI = tempI + 3;
      }
      
      tempI++;
    }

    var colorTable = {};
    var colorTableIndex = 0;
    var r, g, b;
    
    // se contruye el bloque de colores
    if ( (tokens[tempI].type == "openBlock") && (tokens[tempI+1].value == "colortbl") ) {
      openBlockIndex = tokens[tempI++].value;
      
      tempI++;
      
      while ( ((tokens[tempI].type != "closeBlock") && (tokens[tempI].value != openBlockIndex)) ) {
        r = parseInt(tokens[tempI++].value.substring(3)).toString(16);
        g = parseInt(tokens[tempI++].value.substring(5)).toString(16);
        b = parseInt(tokens[tempI++].value.substring(4)).toString(16);
        
        // #rrggbb
        colorTable[colorTableIndex++] = "#" + ((r.length < 2)? "0"+r : r) + ((g.length < 2)? "0"+g : g) + ((b.length < 2)? "0"+b : b);
      }
      
      tempI++;      
    }

    // nodos iniciales del arbol de parseo
    var newNode = new descartesJS.RTFNode(this.evaluator, "", "textBlock", "", false, "");
    var lastNode = new descartesJS.RTFNode(this.evaluator, "", "textLineBlock", "", false, "");
    newNode.addChild(lastNode);
    
    var lastDynamicNode;
    var lastMatrixNode;
    var lastPartsNode;
    var descartesFormula = false;
    var dinamycText = false;
    var setDecimals = false;
    var setRows = false;
    var setColumns = false;
    var setParts = false;
    var currentBlock = [];
//     var styleStack = [ new descartesJS.FontStyle(20, "Arial", "", "", false, false, "#000000") ];
    var styleStack = [ new descartesJS.FontStyle(20, "Arial", "", "", false, false, null) ];
    var styleStackTop = styleStack[0];
    var stableWidth = true;

    var blockNum = -1;
    var formulaBlock = -1;
    var formulaStack = [];
    
    // bandera para saber si el texto contiene una formula
    var hasFormula = false;
    
    // componente de texto rtf de arquimedes
    var descartesComponentNumCtrl = false;
    var descartesComponentSpace = false;
    var descartesHyperLink = false;
    
    // se contruyen los nodos de texto
    for (var i=tempI, l=tokens.length; i<l; i++) {
      // se especifica la fuente
      if ((tokens[i].type == "controlWord") && (fontTable[tokens[i].value])) {
        styleStackTop.fontType = fontTable[tokens[i].value];
        continue;
      }
      
      // se especifica el tamano de la fuente
      else if ((tokens[i].type == "controlWord") && (tokens[i].value.match(/^fs(\d+)/))) {
        styleStackTop.fontSize = parseInt(((tokens[i].value.match(/^fs(\d+)/))[1])/2);
        continue;
      }
      
      // se especifica si es negrita
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "b")) {
        styleStackTop.textBold = "bold";
        continue;
      }
      // se especifica si ya no es negrita 
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "b0")) {
        styleStackTop.textBold = "";
        continue;
      }
      
      // se especifica si es italica
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "i")) {
        styleStackTop.textItalic = "italic";
        continue;
      }
      // se especifica si ya no es italica
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "i0")) {
        styleStackTop.textItalic = "";
        continue;
      }
      
      // se especifica si esta subrayado
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "ul")) {
        styleStackTop.textUnderline = true;
        continue;
      }

      // se especifica si ya no esta subrayado
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "ulnone")) {
        styleStackTop.textUnderline = false;
        continue;
      }
      
      // se especifica si tiene una linea sobre el texto
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "ol")) {
        styleStackTop.textOverline = true;
        continue;
      }

      // se especifica si ya no tiene una linea sobre el texto
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "olnone")) {
        styleStackTop.textOverline = false;
        continue;
      }
      
      // se especifica el color del texto
      else if ((tokens[i].type == "controlWord") && (tokens[i].value.match(/^cf(\d+)/))) {
        styleStackTop.textColor = colorTable[parseInt(tokens[i].value.substring(2))];
        continue;
      }

      // se especifica el inicio de un bloque de rtf generalemente para expresiones o formulas
      else if (tokens[i].type == "openBlock") {
        blockNum = tokens[i].value;
        
        styleStackTop = styleStackTop.clone();
        styleStack.push(styleStackTop);
        
        formulaStack.push(null);

        continue;
      }
      
      // se especifica el cierre de un bloque de rtf generalemente para expresiones o formulas
      else if (tokens[i].type == "closeBlock") {
        if (tokens[i].value == formulaBlock) {
          formulaBlock = -1;
          descartesFormula = false;
          lastNode = lastNode.parent;
        }
        
        styleStack.pop();
        styleStackTop = styleStack[styleStack.length-1];

        formulaStack.pop();

        continue;
      }

      // se especifica un salto de linea
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "par")) {
        lastNode.addChild( new descartesJS.RTFNode(this.evaluator, "", "newLine", styleStackTop.clone()) );
        
        newNode = new descartesJS.RTFNode(this.evaluator, "", "textLineBlock", styleStackTop.clone());
        
        // se busca un textBlock para
        if (lastNode.nodeType != "textBlock") {
          lastNode = lastNode.parent;
         
          while (lastNode.nodeType != "textBlock") {
            lastNode = lastNode.parent;
          }
        }

        lastNode.addChild(newNode);
        lastNode = newNode;

        continue;
      }

      // se especifica una formula de descartes
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "mjaformula")) {
        hasFormula = true;
        formulaBlock = blockNum;
        descartesFormula = true;
        
        newNode = new descartesJS.RTFNode(this.evaluator, "", "formula", styleStackTop.clone());
        lastNode.addChild(newNode);
        lastNode = newNode;
        
        formulaStack[formulaStack.length-1] = newNode;
        continue;
      }

      // se especifica una fraccion, una raiz, una suma, una integral, un limite
      else if ((tokens[i].type == "controlWord") && ((tokens[i].value == "fraction") || 
                                                     (tokens[i].value == "radicand") || 
                                                     (tokens[i].value == "radical") ||
                                                     (tokens[i].value == "what") ||
                                                     (tokens[i].value == "sum") ||
                                                     (tokens[i].value == "integral") ||
                                                     (tokens[i].value == "limit")
                                                    )) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

        newNode = new descartesJS.RTFNode(this.evaluator, "",  tokens[i].value, tmpStyle);

        // se agrega el nuevo nodo al elemento anterior al tope, ya que el tope contiene el nuevo elemento a agregar
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // se coloca el valor del nuevo elemento como el tope del stack
        formulaStack[formulaStack.length-1] = newNode;
        
        continue;
      }

      // se especifica el indice de una raiz, hasta donde va la suma o la integral, desde donde va la suma o la integral
      else if ((tokens[i].type == "controlWord") && ( (tokens[i].value == "index")) || 
                                                      (tokens[i].value == "to") ||
                                                      (tokens[i].value == "from") ) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();
        tmpStyle.fontSize = parseInt(tmpStyle.fontSize - tmpStyle.fontSize*.2);

        // el tamano de la tipografia no debe ser menor que 8
        if (tmpStyle.fontSize < 8) {
          tmpStyle.fontSize = 8;
        }

        newNode = new descartesJS.RTFNode(this.evaluator, "", tokens[i].value, tmpStyle);

        // se agrega el nuevo nodo al elemento anterior al tope, ya que el tope contiene el nuevo elemento a agregar
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // se coloca el valor del nuevo elemento como el tope del stack
        formulaStack[formulaStack.length-1] = newNode;
        
        continue;
      }
      
      // se especifica el numerador o el denominador de una fraccion
      else if ((tokens[i].type == "controlWord") && ((tokens[i].value == "num") || (tokens[i].value == "den"))) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();
        tmpStyle.fontSize = Math.round(tmpStyle.fontSize - tmpStyle.fontSize*.1);

        // el tamano de la tipografia no debe ser menor que 8
        if (tmpStyle.fontSize < 8) {
          tmpStyle.fontSize = 8;
        }

        if (tokens[i].value == "num") {
          newNode = new descartesJS.RTFNode(this.evaluator, "", "numerator", tmpStyle);
        }
        else if (tokens[i].value == "den") {
          newNode = new descartesJS.RTFNode(this.evaluator, "", "denominator", tmpStyle);
        }

        // se agrega el nuevo nodo al elemento anterior al tope, ya que el tope contiene el nuevo elemento a agregar
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // se coloca el valor del nuevo elemento como el tope del stack
        formulaStack[formulaStack.length-1] = newNode;
        
        continue;
      }
      
      // se especifica si el texto es un subindice o un superindice
      else if ((tokens[i].type == "controlWord") && ((tokens[i].value == "subix") || (tokens[i].value == "supix"))) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();
        tmpStyle.fontSize = Math.floor(tmpStyle.fontSize - tmpStyle.fontSize/3);
        
        // el tamano de la tipografia no debe ser menor que 8
        if (tmpStyle.fontSize < 8) {
          tmpStyle.fontSize = 8;
        }

        if (tokens[i].value == "subix") {
          newNode = new descartesJS.RTFNode(this.evaluator, "", "subIndex", tmpStyle);
        }
        else if (tokens[i].value == "supix") {
          newNode = new descartesJS.RTFNode(this.evaluator, "", "superIndex", tmpStyle);
        }
        
        newNode.originalStyle = formulaStack[formulaStack.length-2].style.clone();

        // se agrega el nuevo nodo al elemento anterior al tope, ya que el tope contiene el nuevo elemento a agregar
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // se coloca el valor del nuevo elemento como el tope del stack
        formulaStack[formulaStack.length-1] = newNode;
        
        continue;        
      }
      
      // se especifica un defparts, una matriz o un elemento
      else if ((tokens[i].type == "controlWord") && ( (tokens[i].value == "defparts") || (tokens[i].value == "matrix") || (tokens[i].value == "element") )) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

        newNode = new descartesJS.RTFNode(this.evaluator, "", tokens[i].value, tmpStyle);

        // se agrega el nuevo nodo al elemento anterior al tope, ya que el tope contiene el nuevo elemento a agregar
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // se coloca el valor del nuevo elemento como el tope del stack
        formulaStack[formulaStack.length-1] = newNode;
               
        if (tokens[i].value == "defparts") {
          lastPartsNode = newNode;
        }
        else if (tokens[i].value == "matrix") {
          lastMatrixNode = newNode;
        }

        continue;        
      }

      // se especifica el numero de renglones de una matriz
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "parts")) {
        setParts = true;
        continue;
      }
      
      // se le pasa el numero de renglones
      else if ((tokens[i].type == "text") && (setParts)) {
        lastPartsNode.parts = (parseInt(tokens[i].value));
        setParts = false;
        continue;
      }

      // se especifica el numero de renglones de una matriz
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "rows")) {
        setRows = true;
        continue;
      }
      
      // se le pasa el numero de renglones
      else if ((tokens[i].type == "text") && (setRows)) {
        lastMatrixNode.rows = (parseInt(tokens[i].value));
        setRows = false;
        continue;
      }
      
      // se especifica el numero de columnas de una matriz
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "columns")) {
        setColumns = true;
        continue;
      }
      
      // se le pasa el numero de renglones
      else if ((tokens[i].type == "text") && (setColumns)) {
        lastMatrixNode.columns = (parseInt(tokens[i].value));
        setColumns = false;
        continue;
      }
                
      // se especifica si es un texto dinamico
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "expr")) {
        stableWidth = false;
        dinamycText = true;
        continue;
      }
      
      // se especifica si el texto lleva decimales
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "decimals")) {
        setDecimals = true;
        continue;
      }
      
      // se le pasa el numero de decimales al texto
      else if ((tokens[i].type == "text") && (setDecimals)) {
        lastDynamicNode.decimals = this.evaluator.parser.parse(parseInt(tokens[i].value)+"");
        setDecimals = false;
        continue;
      }
      
      // se especifica si el texto tiene una representacion fija de decimales
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "fixed1")) {
        lastDynamicNode.fixed = true;
        continue;
      }
      // se especifica si el texto tiene una representacion fija de decimales
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "fixed0")) {
        lastDynamicNode.fixed = false;
        continue;
      }
      
      // un componente
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "component")) { }
      
      // componente del tipo control
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "NumCtrl")) {
        descartesComponentNumCtrl = true;
      }
      
      // componente del tipo espacio
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "Space")) {
        descartesComponentSpace = true;
      }

      // hipervinculos
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "hyperlink")) {
        descartesHyperLink = true;
      }

      // contenido del hipervinculo
      // falta por determinar como hacer los hipervinculos
      else if ((tokens[i].type == "text") && (descartesHyperLink)) {
        textContent = ((tokens[i].value).split("|"))[0];
        tmpStyle = styleStackTop.clone();
        tmpStyle.textUnderline = true;
        tmpStyle.textColor = "blue";

        newNode = new descartesJS.RTFNode(this.evaluator, textContent, "text", tmpStyle);
        
        if (lastNode.nodeType != "textLineBlock") {
          lastNode = lastNode.parent;
         
          while (lastNode.nodeType != "textLineBlock") {
            lastNode = lastNode.parent;
          }
        }
        
        lastNode.addChild(newNode);

        descartesHyperLink = false;
        continue;
      }

      // componente del tipo control
      else if ((tokens[i].type == "text") && (descartesComponentNumCtrl)) {
        newNode = new descartesJS.RTFNode(this.evaluator, tokens[i].value, "componentNumCtrl", styleStackTop.clone());

        lastNode.addChild(newNode);
        
        descartesComponentNumCtrl = false;
        continue;
      }

      // componente del tipo espacio
      else if ((tokens[i].type == "text") && (descartesComponentSpace)) {
        newNode = new descartesJS.RTFNode(this.evaluator, tokens[i].value, "componentSpace", styleStackTop.clone());

        lastNode.addChild(newNode);
        
        descartesComponentSpace = false;
        continue;
      }

      // se crea un nodo de texto dinamico
      else if ((tokens[i].type == "text") && (dinamycText)) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

        // se le agrega "''+" para que se utilice lo que ya se tiene implementado para los decimales en el evaluador
        textContent = this.evaluator.parser.parse("''+(" + tokens[i].value + ")");

        newNode = new descartesJS.RTFNode(this.evaluator, textContent, "dynamicText", tmpStyle);

        // se agrega el nuevo nodo al elemento anterior al tope, ya que el tope contiene el nuevo elemento a agregar
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // se coloca el valor del nuevo elemento como el tope del stack
        formulaStack[formulaStack.length-1] = newNode;
        
        // se guarda una referencia al ultimo nodo dinamico para cambiar el numero de decimales que tiene asi como si su representacion es fija o no
        lastDynamicNode = newNode;
        
        dinamycText = false;
        continue;
      }
      
      // se crea un nodo de texto que no es parte de una formula
      else if ((tokens[i].type == "text") && (!dinamycText) && (!descartesFormula)) {
        textContent = tokens[i].value;

        newNode = new descartesJS.RTFNode(this.evaluator, textContent, "text", styleStackTop.clone());
        
        if (lastNode.nodeType != "textLineBlock") {
          lastNode = lastNode.parent;
         
          while (lastNode.nodeType != "textLineBlock") {
            lastNode = lastNode.parent;
          }
        }
        
        lastNode.addChild(newNode);
        continue;
      }

      // se crea un nodo de texto que es parte de una formula
      else if ((tokens[i].type == "text") && (!dinamycText) && (descartesFormula)) {
        textContent = tokens[i].value;

        newNode = new descartesJS.RTFNode(this.evaluator, textContent, "text", formulaStack[formulaStack.length-1].style.clone());
        
        // se agrega el nuevo nodo de texto al tope del stack de formulas
        formulaStack[formulaStack.length-1].addChild(newNode);
        
        continue;
      }
      
      // se crea un nodo para simbolos matematicos dentro de textos de formulas
      else if ( (tokens[i].type == "(") || (tokens[i].type == ")") ) {
        var tmpStyle = formulaStack[formulaStack.length-1].style.clone();
        tmpStyle.textItalic = "";
        
        newNode = new descartesJS.RTFNode(this.evaluator, tokens[i].type, "mathSymbol", tmpStyle);

        // se agrega el nuevo nodo de texto al tope del stack de formulas
        formulaStack[formulaStack.length-1].addChild(newNode);
        
        continue;
      }
      // se crea un nodo para simbolos matematicos dentro de textos de formulas
      else if ( (tokens[i].type == "+") || (tokens[i].type == "-") || 
                (tokens[i].type == "*") || (tokens[i].type == "=") ) {
        newNode = new descartesJS.RTFNode(this.evaluator, tokens[i].type, "mathSymbol", formulaStack[formulaStack.length-1].style.clone());

        // se agrega el nuevo nodo de texto al tope del stack de formulas
        formulaStack[formulaStack.length-1].addChild(newNode);
        
        continue;
      }
      
      // elementos desconocidos
      else {
//         console.log("Desconocido ", tokens[i]);
      }
    }

    if (lastNode != null) {
      var rootNode = lastNode.getRoot();
      rootNode.stableWidth = stableWidth;
      rootNode.getTextMetrics();
      
      rootNode.hasFormula = hasFormula;
      
      //console.log(rootNode);
    }
    
    return rootNode;
  }
  
  /**
   * 
   */
  descartesJS.FontStyle = function(fontSize, fontType, textItalic, textBold, textUnderline, textOverline, textColor) {
    this.fontSize = fontSize;
    this.fontType = fontType;
    this.textItalic = textItalic;
    this.textBold = textBold;
    this.textUnderline = textUnderline;
    this.textOverline = textOverline;
    this.textColor = textColor;
  }
  
  /**
   * 
   */
  descartesJS.FontStyle.prototype.toString = function() {
    return (this.textBold + " " + this.textItalic + " " + this.fontSize + "px " + this.fontType).trim();
  }
  
  /**
   * 
   */
  descartesJS.FontStyle.prototype.toCSS = function() {
    var cssRule = "style='font-family: " + this.fontType + "; font-size: " + this.fontSize + "px; ";

    if (this.textUnderline && !this.textOverline) {
      cssRule += "text-decoration: underline; ";
    }
    
    if (!this.textUnderline && this.textOverline) {
      cssRule += "text-decoration: overline; ";
    }
    
    if (this.textUnderline && this.textOverline) {
      cssRule += "text-decoration: underline overline; ";
    }
    
    if (this.textBold && !this.textItalic) {
      cssRule += "font-style: normal; font-weight: bold; ";
    }
    
    if (!this.textBold && this.textItalic) {
      cssRule += "font-style: italic; font-weight: normal; ";
    }

    if (this.textBold && this.textItalic) {
      cssRule += "font-style: italic; font-weight: bold; ";
    }
    
    if (!this.textBold && !this.textItalic) {
      cssRule += "font-style: normal; font-weight: normal; ";
    }
    
    if (this.textColor) {
      cssRule += "color: " + this.textColor + "; ";
    }

    return cssRule + "'";
  }

  /**
   * 
   */
  descartesJS.FontStyle.prototype.clone = function() {
    return new descartesJS.FontStyle(this.fontSize, this.fontType, this.textItalic, this.textBold, this.textUnderline, this.textOverline, this.textColor);
  }

  checkMathSymboslInFormula = function(tokens) {
//     console.log(tokens);
    var tokensResult = [];
    
    var inFormula = false;
    var ignoreText = false;
    var inExpression = false;
    var currentOpenBlock = [];
    
    for (var i=0, l=tokens.length; i<l; i++) {
      // si inicia un bloque se registra, para saber si se esta dentro de una formula o no
      if (tokens[i].type == "openBlock") {
        currentOpenBlock.push(tokens[i].value);
      }
      
      // si cierra un bloque se registra, para saber si se esta dentro de una formula o no
      if (tokens[i].type == "closeBlock") {
        currentOpenBlock.pop();
        
        if (currentOpenBlock.length <= 0) {
          inFormula = false;
        }
      }
      
      // los parentesis dentro de una expresion no deben cambiarse
      if ((tokens[i].type == "controlWord") && ((tokens[i].value == "expr") || (tokens[i].value == "decimals"))) {
        ignoreText = true;
      }
      
      // si se esta en una formula se registra, para verificar los textos dentro de ella
      if ((tokens[i].type == "controlWord") && (tokens[i].value == "mjaformula")){
        inFormula = true
      }
      
      // si el token es un texto y estamos dentro de una formula y el texto no es una expresion entonces hay que buscar parentesis
      if ((tokens[i].type == "text") && (inFormula) && (!ignoreText)) {
        var lastIndex = 0;
        var value = tokens[i].value;
        var newValue = "";
        
        // se recorre la cadena para buscar los parentesis y generar tokens adecuados
        for (var j=0, k=value.length; j<k; j++) {
          // parentesis que cierra, parentesis que cierra, signo mas
          if ( (value.charAt(j) == "(") || (value.charAt(j) == ")") || 
               (value.charAt(j) == "+") || (value.charAt(j) == "-") || 
               (value.charAt(j) == "*") || (value.charAt(j) == "=") 
             ) {
            newValue = value.substring(lastIndex, j);
            if (newValue != "") {
              tokensResult.push( {type: "text", value: newValue} );
            }
            tokensResult.push( {type: value.charAt(j), value: value.charAt(j)} );
            lastIndex = j+1;
          }


        }

        // si se termino el recorrido se agrega el resto de la cadena
        newValue = value.substring(lastIndex, j);
        if (newValue != "") {
          tokensResult.push( {type: "text", value: newValue} );
        }
      }
      // los demas nodos
      else {
        tokensResult.push(tokens[i]);
        if ((tokens[i].type == "text") && (ignoreText)) {
          ignoreText = false;
        }
      }
    }
    
//     console.log(tokensResult);
    return tokensResult;
  }

  return descartesJS;
})(descartesJS || {});
