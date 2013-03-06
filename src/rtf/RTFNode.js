/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var externalDecimals = 2;
  var externalFixed = false;
  
  /**
   * Un nodo que forma un arbol de parseo
   * @constructor 
   */
  descartesJS.RTFNode = function(evaluator, value, nodeType, style) {
    this.evaluator = evaluator;

    this.type = "rtfNode";
   
    this.value = value;
    this.nodeType = nodeType;
    this.style = style;
    this.styleString = style.toString()
    this.color = style.textColor;
    this.underline = style.textUnderline;
    this.overline = style.textOverline;
    
    this.parent = null;
    this.childs = [];
    
//     this.fixed = false;
//     this.decimals = this.evaluator.parser.parse("2");
    
    // el bloque superior de texto
    if (this.nodeType == "textBlock") {
      this.draw = this.drawTextBlock;
    }
    
    // una linea de texto
    else if (this.nodeType == "textLineBlock") {
      this.draw = this.drawTextLineBlock;
    }

    // una formula
    else if (this.nodeType == "formula") {
      this.draw = this.drawFormula;
    }
    
    // un super indice
    else if (this.nodeType == "superIndex") {
      this.draw = this.drawSuperIndex;
    }

    // un sub indice
    else if (this.nodeType == "subIndex") {
      this.draw = this.drawSubIndex;
    }

    // un texto dinamico
    else if (this.nodeType == "dynamicText") {
      this.draw = this.drawDynamicText;
      this.decimal_symbol = this.evaluator.parent.decimal_symbol;
    }

    // una fraccion
    else if (this.nodeType == "fraction") {
      this.draw = this.drawFraction;
    }
    
    // un numerador o un denominador
    else if ( (this.nodeType == "numerator") || (this.nodeType == "denominator") ) {
      this.draw = this.drawNumDen;
    }
    
    // una raiz
    else if (this.nodeType == "radical") {
      this.draw = this.drawRadical;
    }
        
    // un limite
    else if (this.nodeType == "limit") {
      this.draw = this.drawLimit;
    }
    
    // una integral
    else if (this.nodeType == "integral") {
      this.draw = this.drawIntegral;
    }
    
    // una suma
    else if (this.nodeType == "sum") {
      this.draw = this.drawSum;
    }
    
    // una matiz
    else if (this.nodeType == "matrix") {
      this.draw = this.drawMatrix;
    }
    
    // un elemento de un defparts
    else if (this.nodeType == "defparts") {
      this.draw = this.drawDefparts;
    }
    
    // un texto
    else if ((this.nodeType == "text") || (this.nodeType == "newLine")) {
      this.draw = this.drawText;
    }
    
    // simbolos matematicos en el texto
    else if (this.nodeType == "mathSymbol") {
      this.draw = this.drawMathSymbol;
    }
    
    // el indice de una raiz, el contenido de una raiz, desde donde va una suma, hasta donde va una suma, el contenido de una suma, un elemento
    else if ( (this.nodeType == "index") || 
              (this.nodeType == "radicand") ||
              (this.nodeType == "from") ||
              (this.nodeType == "to") ||
              (this.nodeType == "what") ||
              (this.nodeType == "element")
            ) {
      this.draw = this.drawGenericBlock;
    }
    
    // un componente del tipo control
    else if (this.nodeType == "componentNumCtrl") {
      this.draw = this.drawComponentNumCtrl;
    }

    // un componente del tipo control
    else if (this.nodeType == "componentSpace") {
      this.draw = this.drawComponentSpace;
    }
  }

  /**
   * Obtiene el nodo raiz del arbol
   */
  descartesJS.RTFNode.prototype.getRoot = function() {
    if (this.parent == null) {
      return this;
    }
    return this.parent.getRoot();
  }

  /**
   * Agrega un hijo al arbol
   * @param {descartesJS.RTFNode} child el hijo que se quiere agregar
   */
  descartesJS.RTFNode.prototype.addChild = function(child) {
    child.parent = this;
    this.childs.push(child);
  }
  
  // valores de la metrica anterior, necesaria para calcular los valores para los super y sub indices
  var previousMetric = { ascent: 0, descent: 0, height: 0 };
  function updatePreviousMetric(ascent, descent, height) {
    previousMetric.ascent = ascent;
    previousMetric.descent = descent;
    previousMetric.height = height; 
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.getTextMetrics = function() {
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    if (this.nodeType == "textBlock") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);

      for (var i=0, l=this.childs.length; i<l; i++) {
        this.childs[i].getTextMetrics();
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "textLineBlock") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);

      this.getBlockMetric();
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "newLine") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);

      var metrics = descartesJS.getFontMetrics(this.styleString);

      this.baseline = metrics.baseline;

      this.descent = metrics.descent;
      this.ascent = metrics.ascent;
      
      this.width = metrics.width;
      this.height = metrics.height;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if ( (this.nodeType == "text") || (this.nodeType == "dynamicText")) {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);

      var metrics = descartesJS.getFontMetrics(this.styleString);

      this.baseline = metrics.baseline;

      this.descent = metrics.descent;
      this.ascent = metrics.ascent;
      
      var textTemp = this.value;
      var decimals;
      var fixed;

      // si el texto es una expresion, para textos dinamicos
      if (typeof(this.value) != "string") {
        decimals = (this.decimals == undefined) ? externalDecimals : this.evaluator.evalExpression(this.decimals);
        fixed = (this.fixed == undefined) ? externalFixed : this.fixed;
        textTemp = this.evaluator.evalExpression(this.value, decimals, fixed);
        
        // es un numero
        if (parseFloat(textTemp) == textTemp) {
          textTemp = parseFloat(textTemp).toFixed(decimals);
          textTemp = (fixed) ? textTemp : parseFloat(textTemp);
          textTemp = textTemp.toString().replace(".", this.decimal_symbol);
        }
        
        textTemp += " ";
      }
            
      this.width = descartesJS.getTextWidth(textTemp, this.styleString);
      this.height = metrics.height;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "formula") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      this.getBlockMetric();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "superIndex") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;

      var metric = descartesJS.getFontMetrics(this.styleString);

      this.getBlockMetric();

      if (this.height < 0) {
        this.ascent = metric.ascent;
        this.descent = metric.descent;
        this.height = this.ascent + this.descent;
        this.width = this.spaceWidth*1.5;
      }
      
      var tmpAscent = prevHeight/2 - prevDescent + this.height;
      this.superIndexPos = tmpAscent - this.ascent;
      
      this.ascent = tmpAscent;
      this.descent = prevDescent;
      this.baseline = this.ascent;
      this.height = this.ascent + this.descent;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "subIndex") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;
      
      var metric = descartesJS.getFontMetrics(this.styleString);

      this.getBlockMetric();

      if (this.height < 0) {
        this.ascent = metric.ascent;
        this.descent = metric.descent;
        this.height = this.ascent + this.descent;
        this.width = this.spaceWidth*1.5;
      }

      this.subIndexPos = prevDescent +1;
      
      this.ascent = prevAscent;
      this.descent = this.subIndexPos + this.descent;
      this.baseline = this.ascent;
      this.height = this.ascent + this.descent;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "fraction") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;
      
      var num = this.childs[0];
      var den = this.childs[1];

      var metric = descartesJS.getFontMetrics(num.styleString);

      num.getBlockMetric();
      den.getBlockMetric();
      
      if (num.height < 0) {
        num.height = metric.height;
        num.width = this.spaceWidth;
      }
      if (den.height < 0) {
        den.height = metric.height;
        den.width = this.spaceWidth;
      }
      
      this.height = num.height + den.height -1;

      this.ascent = num.height + prevHeight/2-prevDescent;
      this.descent = this.height - this.ascent;
      this.baseline = this.ascent;

      this.width = Math.max(num.width, den.width) +this.spaceWidth +8;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "radical") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var index;
      var radicand;
      var tmpStyle = this.childs[0].style.clone();
      var tmpRadican;

      // correccion en algunas raices que aparecen de forma extraña en arquimedes
      // si tiene solo un hijo
      if (this.childs.length === 1) {
        // radican
        this.childs[1] = new descartesJS.RTFNode(this.evaluator, "", "radicand", tmpStyle);
        this.childs[1].addChild(this.childs[0]);
        // index
        this.childs[0] = new descartesJS.RTFNode(this.evaluator, "", "index", tmpStyle);
      }
      // si tiene mas de un hijo
      else {
        // si los dos primeros hijos, no son un index y un radicand, significa que esta en la forma rara de arquimedes y es necesario agregar todos los hijos como hijos de un nodo radicand
        if ( (this.childs[0].nodeType !== "index") || (this.childs[1].nodeType !== "radicand") ) {
          // radican
          tmpRadican = new descartesJS.RTFNode(this.evaluator, "", "radicand", tmpStyle);
          for (var i=0, l=this.childs.length; i<l; i++) {
            tmpRadican.addChild(this.childs[i]);
          }
          this.childs = [];

          this.childs[0] = new descartesJS.RTFNode(this.evaluator, "", "index", tmpStyle);
          this.childs[1] = tmpRadican;
        }
      }

      index    = this.childs[0];
      radicand = this.childs[1];

      index.getBlockMetric();
      radicand.getBlockMetric();

      if (radicand.height/2 < index.height) {
        this.ascent = radicand.height/2 + index.height+2 - radicand.descent;
      } 
      else {
        this.ascent = radicand.ascent +4;
      }
      
      this.descent = radicand.descent;
      this.baseline = this.ascent;
      this.height = this.ascent + this.descent;

      this.width = index.width + radicand.width +4*this.spaceWidth;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "sum") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;
      
      var from = this.childs[0];
      var to   = this.childs[1];
      var what = this.childs[2]
      
      from.getBlockMetric();
      to.getBlockMetric();
      what.getBlockMetric();
      
      // si from es vacio entonces su ascent es -1, pero es necesario calcular el espacio que ocuparia
      if (from.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(from.styleString);
        from.ascent = tmpMetric.ascent;
        from.descent = tmpMetric.descent;
        from.height = tmpMetric.height;
      }
      // si to es vacio entonces su ascent es -1, pero es necesario calcular el espacio que ocuparia
      if (to.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(to.styleString);
        to.ascent = tmpMetric.ascent;
        to.descent = tmpMetric.descent;
        to.height = tmpMetric.height;
      }
      
      var metric = descartesJS.getFontMetrics(this.styleString);

      // el ascent
      if (metric.height+to.height > what.ascent) {
        this.ascent = metric.height-metric.descent +to.height;
      } else {
        this.ascent = what.ascent;
      }
      
      // el descent
      if (from.height > what.descent) {
        this.descent = from.height + metric.descent;
      } else {
        this.descent = what.descent;
      }

      this.baseline = this.ascent;
      this.height = this.ascent + this.descent;

      var symbolStyle = this.style.clone();
      symbolStyle.fontType = "Times New Roman";
      symbolStyle.Bold = "bold";
      symbolStyle = symbolStyle.toString();

      var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(parseInt(8721)), symbolStyle);
      
      this.width = Math.max(from.width, to.width, symbolWidth) + Math.max(what.width, this.spaceWidth) +this.spaceWidth;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "integral") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;
      
      var from = this.childs[0];
      var to   = this.childs[1];
      var what = this.childs[2]
      
      from.getBlockMetric();
      to.getBlockMetric();
      what.getBlockMetric();
      
      // si from es vacio entonces su ascent es -1, pero es necesario calcular el espacio que ocuparia
      if (from.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(from.styleString);
        from.ascent = tmpMetric.ascent;
        from.descent = tmpMetric.descent;
        from.height = tmpMetric.height;
      }
      // si to es vacio entonces su ascent es -1, pero es necesario calcular el espacio que ocuparia
      if (to.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(to.styleString);
        to.ascent = tmpMetric.ascent;
        to.descent = tmpMetric.descent;
        to.height = tmpMetric.height;
      }

      var metric = descartesJS.getFontMetrics(this.styleString);

      // el ascent
      if (metric.height+to.height > what.ascent) {
        this.ascent = metric.height-metric.descent +to.height;
      } else {
        this.ascent = what.ascent;
      }
      
      // el descent
      if (from.height > what.descent) {
        this.descent = from.height + metric.descent;
      } else {
        this.descent = what.descent;
      }

      this.baseline = this.ascent;
      this.height = this.ascent + this.descent;

      var symbolStyle = this.style.clone();
      symbolStyle.fontSize = 1.5*symbolStyle.fontSize;
      symbolStyle.fontType = "Times New Roman";
      symbolStyle.Bold = "bold";
      symbolStyle = symbolStyle.toString();

      var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(parseInt(8747)), symbolStyle);
        
      this.width = Math.max(from.width, to.width, symbolWidth) + Math.max(what.width, this.spaceWidth) +2*this.spaceWidth;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "limit") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;
      
      var from = this.childs[0];
      var to   = this.childs[1];
      var what = this.childs[2]
      var tmpMetric;
      var metric = descartesJS.getFontMetrics(this.styleString);

      from.getBlockMetric();
      to.getBlockMetric();
      what.getBlockMetric();
      
      // si from es vacio entonces su ascent es -1, pero es necesario calcular el espacio que ocuparia
      if (from.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(from.styleString);
        from.ascent = tmpMetric.ascent;
        from.descent = tmpMetric.descent;
        from.height = tmpMetric.height;
      }
      // si to es vacio entonces su ascent es -1, pero es necesario calcular el espacio que ocuparia
      if (to.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(to.styleString);
        to.ascent = tmpMetric.ascent;
        to.descent = tmpMetric.descent;
        to.height = tmpMetric.height;
      }
      // si what es vacio entonces su ascent es -1, pero es necesario calcular el espacio que ocuparia
      if (what.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(what.styleString);
        what.ascent = tmpMetric.ascent;
        what.descent = tmpMetric.descent;
        what.height = tmpMetric.height;
      }
            
      this.ascent = what.ascent;
      this.descent = Math.max(metric.height, what.descent);
      this.baseline = this.ascent;
      this.height = this.ascent + this.descent;

      var limitWidth = descartesJS.getTextWidth(" " + String.fromCharCode(parseInt(8594)), this.styleString);

      if (from.width == 0) {
        from.width = this.spaceWidth;
      }
      if (to.width == 0) {
        to.width = this.spaceWidth;
      }
      if (what.width == 0) {
        what.width = this.spaceWidth;
      }

      this.width = to.width + from.width + what.width + limitWidth + this.spaceWidth;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "matrix") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      
      var metric = descartesJS.getFontMetrics(this.styleString);
      
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;
      
      var maxAscenderHeight = metric.ascent;
      var maxDescenderHeight = metric.descent;
      var maxHeigth = metric.height;
      var maxWidth = this.spaceWidth;

      var childHeight;
      var childWidth;
      
      for (var i=0, l=this.childs.length; i<l; i++) {
        this.childs[i].getBlockMetric();
        
        childHeight = this.childs[i].height;
        childWidth = this.childs[i].width;
        
        if (maxHeigth < childHeight) {
          maxHeigth = childHeight;
          maxAscenderHeight = this.childs[i].ascent;
          maxDescenderHeight = this.childs[i].descent;
        }
        
        if (maxWidth < childWidth) {
          maxWidth = childWidth;
        }
      }
      
      this.childWidth = maxWidth + 2*this.spaceWidth;
      this.childHeight = maxHeigth;
      this.childAscent = maxAscenderHeight;
      this.childDescent = maxDescenderHeight;
      
      this.height = this.rows * maxHeigth;
      this.ascent = this.height/2 + prevDescent;
      this.descent = this.height - this.ascent;
      this.width = this.columns * this.childWidth +this.spaceWidth;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "defparts") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      
      var metric = descartesJS.getFontMetrics(this.styleString);
      
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;
      
      var maxAscenderHeight = metric.ascent;
      var maxDescenderHeight = metric.descent;
      var maxHeigth = metric.height;
      var maxWidth = this.spaceWidth;

      var childHeight;
      var childWidth;

      for (var i=0, l=this.childs.length; i<l; i++) {
        this.childs[i].getBlockMetric();
        
        childHeight = this.childs[i].height;
        childWidth = this.childs[i].width;
        
        if (maxHeigth < childHeight) {
          maxHeigth = childHeight;
          maxAscenderHeight = this.childs[i].ascent;
          maxDescenderHeight = this.childs[i].descent;
        }
        
        if (maxWidth < childWidth) {
          maxWidth = childWidth;
        }
      }
      
      this.childWidth = maxWidth + 2*this.spaceWidth;
      this.childHeight = maxHeigth;
      this.childAscent = maxAscenderHeight;
      this.childDescent = maxDescenderHeight;
      
      this.height = this.parts * maxHeigth;
      this.ascent = this.height/2 + prevDescent;
      this.descent = this.height - this.ascent;
      this.width = maxWidth +this.spaceWidth/2;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "mathSymbol") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var metrics = descartesJS.getFontMetrics(this.styleString);

      this.baseline = metrics.baseline;
      this.descent = metrics.descent;
      this.ascent = metrics.ascent;
                  
      this.width = descartesJS.getTextWidth(this.value, this.styleString) + descartesJS.getTextWidth(" ", this.styleString);
      this.height = metrics.height;
    }
    
    else if (this.nodeType == "componentNumCtrl") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      this.componentNumCtrl = this.evaluator.parent.getControlByCId(this.value);
      
      this.baseline = 0;
      this.descent = 0;
      this.ascent = 0;
      
      this.height = 0;
      this.width = this.componentNumCtrl.w;
    }
    
    else if (this.nodeType == "componentSpace") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      this.componentSpace = this.evaluator.parent.getSpaceByCId(this.value);
      
      this.baseline = 0;
      this.descent = 0;
      this.ascent = 0;
      
      this.height = 0;
      this.width = this.componentSpace.w;
    }
        
    else {
      console.log("elemento no conocido", this.nodeType);
    }
    
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.getBlockMetric = function() {
    this.width = 0;
    var maxDescenderHeight = -1;
    var maxAscenderHeight = -1;
    var childHeight;
    var childs_i;
    
    // se recorren todos los hijos de la linea de texto, para determinar cual es el ancho, el alto
    for (var i=0, l=this.childs.length; i<l; i++) {
      childs_i = this.childs[i];
      childs_i.getTextMetrics();

      childAscent = childs_i.ascent;
      childDescent = childs_i.descent;

      this.width += childs_i.width;
     
      // se actualiza la metrica anterior
      updatePreviousMetric(childAscent, childDescent, childs_i.height);
      
      if (maxAscenderHeight < childAscent) {
        maxAscenderHeight = childAscent;
      }

      if (maxDescenderHeight < childDescent) {
        maxDescenderHeight = childDescent;
      }
      
    }

    this.ascent = maxAscenderHeight;
    this.descent = maxDescenderHeight;
    this.baseline = this.ascent;
    this.height = this.ascent + this.descent;
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawTextBlock = function(ctx, x, y, decimals, fixed, align) {
    // si existe un texto dinamico entonces hay que calcular los anchos de los elementos
    if(!this.stableWidth) {
      this.getTextMetrics();
      externalDecimals = decimals;
      externalFixed = fixed;
    }
    
    var desp = 0;
    
    var antChildY = 0;

    for (var i=0, l=this.childs.length; i<l; i++) {
      if (i>0) {
        antChildY += this.childs[i-1].height;
      }
      
      // si el texto esta centrado
      if (align == "center") {
        desp = -this.childs[i].width/2;
      }
      // si el texto esta alineado a la derecha
      else if (align == "right") {
        desp =-this.childs[i].width;
      }
      
      this.childs[i].draw(ctx, x +desp, y+antChildY);
    }
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawTextLineBlock = function(ctx, x, y) {
    // console.log("@", this.childs.length);
    var antChildX = 0;
    for (var i=0, l=this.childs.length; i<l; i++) {
      // console.log(">>>", i, this.childs[i], this.childs[i].nodeType);

      if (i>0) {
        antChildX += this.childs[i-1].width;

        if ((this.childs[i-1].nodeType == "formula")) {
          // console.log(i, antChildX);

          antChildX += 2*descartesJS.getTextWidth(" ", this.childs[i].styleString);
        }
      }

      this.childs[i].draw(ctx, x+antChildX, y+this.baseline);
    }
  }  
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawFormula = function(ctx, x, y) {
    var antChildX = 0;

    for (var i=0, l=this.childs.length; i<l; i++) {
      if (i>0) {
        antChildX += this.childs[i-1].width;
      }
      this.childs[i].draw(ctx, x + this.spaceWidth + antChildX, y);
    }    
  }
      
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawText = function(ctx, x, y) {
    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = this.styleString;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";

    ctx.fillText(this.value, x-1, y);
    
    if (this.underline) {
      var isBold = this.style.textBold == "bold";
      var sep = isBold ? 1 : .5;

      ctx.lineWidth = isBold ? 2 : 1;
      if (this.color != null) {
        ctx.strokeStyle = this.color;
      }
      ctx.beginPath();
      ctx.moveTo(x-1, parseInt(y+this.descent/2) +sep);
      ctx.lineTo(x-1+this.width, parseInt(y+this.descent/2) +sep);
      ctx.stroke();
    }
    
    if (this.overline) {
      var isBold = this.style.textBold == "bold";
      var sep = isBold ? 2 : 1.5;

      ctx.lineWidth = isBold ? 2 : 1;
      if (this.color != null) {
        ctx.strokeStyle = this.color;
      }
      ctx.beginPath();
      ctx.moveTo(x-1, parseInt(y-this.ascent) +sep);
      ctx.lineTo(x-1+this.width, parseInt(y-this.ascent) +sep);
      ctx.stroke();
    }
  }
      
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawDynamicText = function(ctx, x, y) {
    var spaceWidth = Math.floor(this.spaceWidth*.5);

    var decimals = (this.decimals == undefined) ? externalDecimals : this.evaluator.evalExpression(this.decimals);
    var fixed = (this.fixed == undefined) ? externalFixed : this.fixed;

    var textTemp = this.evaluator.evalExpression(this.value, decimals, fixed);
    
    // el texto es un numero
    if (parseFloat(textTemp) == textTemp) {
      textTemp = (fixed) ? parseFloat(textTemp).toFixed(decimals) : parseFloat(parseFloat(textTemp).toFixed(decimals));
      textTemp = (""+textTemp).replace(".", this.decimal_symbol);
    }

    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = this.styleString;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";

    this.width = descartesJS.getTextWidth(textTemp, this.styleString);
    ctx.fillText(textTemp, spaceWidth + x, y);

    if (this.underline) {
      var isBold = this.style.textBold == "bold";
      var sep = isBold ? 1 : .5;

      ctx.lineWidth = isBold ? 2 : 1;
      if (this.color != null) {
        ctx.strokeStyle = this.color;
      }
      ctx.beginPath();
      ctx.moveTo(spaceWidth + x-1, parseInt(y+this.descent/2) +sep);
      ctx.lineTo(spaceWidth + x-1+this.width, parseInt(y+this.descent/2) +sep);
      ctx.stroke();
    }
    
    if (this.overline) {
      var isBold = this.style.textBold == "bold";
      var sep = isBold ? 2 : 1.5;

      ctx.lineWidth = isBold ? 2 : 1;
      if (this.color != null) {
        ctx.strokeStyle = this.color;
      }
      ctx.beginPath();
      ctx.moveTo(spaceWidth + x-1, parseInt(y-this.ascent) +sep);
      ctx.lineTo(spaceWidth + x-1+this.width, parseInt(y-this.ascent) +sep);
      ctx.stroke();
    }
    
    this.width += 2*spaceWidth;
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawRadical = function(ctx, x, y) {
    var spaceWidth = Math.floor(this.spaceWidth);
    
    this.childs[0].draw(ctx, x, Math.floor(y +this.childs[1].descent -this.childs[1].height/2 -this.childs[0].descent));
    this.childs[1].draw(ctx, x+1.5*spaceWidth+(this.childs[0].width), y);
    
    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()

    ctx.moveTo(x, Math.floor(y +this.childs[1].descent -this.childs[1].height/2));
    ctx.lineTo(x+this.childs[0].width, Math.floor(y +this.childs[1].descent -this.childs[1].height/2));
    ctx.lineTo(x+this.childs[0].width +.5*spaceWidth, y+this.childs[1].descent);
    ctx.lineTo(x+this.childs[0].width +1*spaceWidth, y-this.childs[1].ascent);
    ctx.lineTo(x+this.childs[0].width +2*spaceWidth+this.childs[1].width, y-this.childs[1].ascent);

    ctx.stroke();
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawFraction = function(ctx, x, y) {
    this.childs[0].draw(ctx, x+(this.width-this.childs[0].width)/2, y -this.ascent);
    this.childs[1].draw(ctx, x+(this.width-this.childs[1].width)/2, y -this.ascent + this.childs[0].height -1);

    var spaceWidth = Math.floor(this.spaceWidth*.5);
    
    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()
    ctx.moveTo(x+spaceWidth, parseInt(y -this.ascent + this.childs[0].height)+.5);
    ctx.lineTo(x-spaceWidth+this.width-1, parseInt(y -this.ascent + this.childs[0].height)+.5);
    ctx.stroke();
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawNumDen = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.childs.length; i<l; i++) {
      if (i>0) {
        antChildX += this.childs[i-1].width;
      }
      this.childs[i].draw(ctx, x+antChildX, y+this.baseline);
    }  
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawSubIndex = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.childs.length; i<l; i++) {
      if (i>0) {
        antChildX += this.childs[i-1].width;
      }
      this.childs[i].draw(ctx, x+antChildX, y +this.subIndexPos);
    }
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawSuperIndex = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.childs.length; i<l; i++) {
      if (i>0) {
        antChildX += this.childs[i-1].width;
      }
      this.childs[i].draw(ctx, x+antChildX, y -this.superIndexPos);
    }  
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawLimit = function(ctx, x, y) {
    var metric = descartesJS.getFontMetrics(this.styleString);

    var symbolString = " " + String.fromCharCode(parseInt(8594));
    var symbolWidth = descartesJS.getTextWidth(symbolString, this.styleString);
    
    // from
    this.childs[0].draw(ctx, x, y +metric.descent +this.childs[0].ascent);
    
    // to
    this.childs[1].draw(ctx, x +this.childs[0].width +symbolWidth, y +metric.descent +this.childs[1].ascent);
    
    //what
    this.childs[2].draw(ctx, x +symbolWidth +this.childs[0].width +this.childs[1].width, y);

    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = this.styleString
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("lím", x +this.childs[0].width, y);
    
    ctx.fillText(symbolString, x+this.childs[0].width, y +metric.descent +this.childs[0].ascent);
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawIntegral = function(ctx, x, y) {
    var symbolStyle = this.style.clone();
    symbolStyle.fontSize = 1.5*symbolStyle.fontSize;
    symbolStyle.fontType = "Times New Roman";
    symbolStyle.Bold = "bold";
    symbolStyle = symbolStyle.toString();    
    
    var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(parseInt(8747)), symbolStyle);
    var symbolMetric = descartesJS.getFontMetrics(symbolStyle);

    var maxWidth = Math.max(this.childs[0].width, this.childs[1].width, Math.floor(1.5*symbolWidth));
    
    // from
    this.childs[0].draw(ctx, x +symbolWidth, y +symbolMetric.descent +this.childs[0].ascent);
    
    // to
    this.childs[1].draw(ctx, x +symbolWidth +this.spaceWidth/2, y -this.ascent +this.childs[1].ascent);
    
    //what
    this.childs[2].draw(ctx, x +maxWidth +symbolWidth, y);

    //signo sigma
    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = symbolStyle;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    
    ctx.fillText(String.fromCharCode(parseInt(8747)), x, y +symbolMetric.descent/2);
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawSum = function(ctx, x, y) {
    var symbolStyle = this.style.clone();
    symbolStyle.fontType = "Times New Roman";
    symbolStyle.Bold = "bold";
    symbolStyle = symbolStyle.toString();    

    var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(parseInt(8721)), symbolStyle);
    var symbolMetric = descartesJS.getFontMetrics(this.styleString);

    var maxWidth = Math.max(this.childs[0].width, this.childs[1].width, symbolWidth);
    
    // from
    this.childs[0].draw(ctx, x +(maxWidth-this.childs[0].width)/2, y +symbolMetric.descent +this.childs[0].ascent);
    
    // to
    this.childs[1].draw(ctx, x +(maxWidth-this.childs[1].width)/2, y -symbolMetric.ascent -this.childs[1].descent);
    
    //what
    this.childs[2].draw(ctx, x +maxWidth, y);

    //signo sigma
    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = symbolStyle;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    
    ctx.fillText(String.fromCharCode(parseInt(8721)), x +Math.floor( (maxWidth-symbolWidth)/2 ), y-5);      
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawMatrix = function(ctx, x, y) {
    var columnIndex;
    var rowIndex;
    
    for (var i=0, l=this.childs.length; i<l; i++) {
      columnIndex = i%this.columns;
      rowIndex = Math.floor(i/this.columns);
            
      this.childs[i].draw(ctx, 2*this.spaceWidth + x + columnIndex*this.childWidth, y-this.ascent+this.childAscent + rowIndex*this.childHeight);
    }
    
    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()
    ctx.moveTo(Math.floor(x +this.spaceWidth) +.5, y -this.ascent +.5);
    ctx.lineTo(Math.floor(x +this.spaceWidth/2) +.5, y -this.ascent +.5);
    ctx.lineTo(Math.floor(x +this.spaceWidth/2) +.5, y +this.descent +.5);
    ctx.lineTo(Math.floor(x +this.spaceWidth) +.5, y +this.descent +.5);
    
    ctx.moveTo(Math.floor(x +this.width -this.spaceWidth) -.5, y -this.ascent +.5);
    ctx.lineTo(Math.floor(x +this.width -this.spaceWidth/2) -.5, y -this.ascent +.5);
    ctx.lineTo(Math.floor(x +this.width -this.spaceWidth/2) -.5, y +this.descent +.5);
    ctx.lineTo(Math.floor(x +this.width -this.spaceWidth) -.5, y +this.descent +.5);    
    
    ctx.stroke();  
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawDefparts = function(ctx, x, y) {
    for (var i=0, l=this.childs.length; i<l; i++) {
      this.childs[i].draw(ctx, x + this.spaceWidth/4, y-this.ascent+this.childAscent + (i%this.parts)*this.childHeight);
    }

    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()
    ctx.moveTo(Math.floor(x +this.spaceWidth/3) +.5, y -this.ascent +.5);
    ctx.lineTo(Math.floor(x +this.spaceWidth/6) +.5, y -this.ascent +.5 +(this.spaceWidth/3-this.spaceWidth/6));
    
    ctx.lineTo(Math.floor(x +this.spaceWidth/6) +.5, y +this.descent -this.height/2 -(this.spaceWidth/3-this.spaceWidth/6));
    ctx.lineTo(x +.5, y +this.descent -this.height/2);
    ctx.lineTo(Math.floor(x +this.spaceWidth/6) +.5, y +this.descent -this.height/2 +(this.spaceWidth/3-this.spaceWidth/6));
    
    ctx.lineTo(Math.floor(x +this.spaceWidth/6) +.5, y +this.descent +.5 -(this.spaceWidth/3-this.spaceWidth/6));
    ctx.lineTo(Math.floor(x +this.spaceWidth/3) +.5, y +this.descent +.5);
    
    ctx.stroke(); 
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawMathSymbol = function(ctx, x, y) {
    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;
    }
    ctx.beginPath()

    if (this.value == "(") {
      ctx.font = this.styleString;
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
      ctx.fillText("(", x, y);
      // ctx.moveTo(x +this.spaceWidth +.1, y -this.parent.ascent +this.height/10);
      // ctx.quadraticCurveTo(x +this.spaceWidth/5, y +this.parent.descent -this.parent.height/2,
      //                      x +this.spaceWidth, y +this.parent.descent -this.height/10);
      // ctx.stroke();
    }
    else if (this.value == ")") {
      ctx.font = this.styleString;
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(")", x+this.spaceWidth, y);
      // ctx.moveTo(x +this.spaceWidth +.1, y -this.parent.ascent +this.height/10);
      // ctx.quadraticCurveTo(x +this.spaceWidth +4*this.spaceWidth/5, y +this.parent.descent -this.parent.height/2,
      //                      x +this.spaceWidth, y +this.parent.descent -this.height/10);
      // ctx.stroke();
    }
    else {
      ctx.font = this.styleString;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      
      ctx.fillText(this.value, x +this.width/2, y);      
    }
  }
  
  /**
   * Dibuja los bloques de texto que no necesitan modificar las posicion de sus componentes
   */
  descartesJS.RTFNode.prototype.drawGenericBlock = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.childs.length; i<l; i++) {
      if (i>0) {
        antChildX += this.childs[i-1].width;
      }
      this.childs[i].draw(ctx, x+antChildX, y);
    }  
  }  
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawComponentNumCtrl = function(ctx, x, y) {
    this.getTextMetrics();
    this.componentNumCtrl.expresion = this.evaluator.parser.parse("(" + x + "," + (y-this.parent.ascent) + "," + this.componentNumCtrl.w + "," + this.componentNumCtrl.h + ")");
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawComponentSpace = function(ctx, x, y) {
    this.getTextMetrics();
    
    this.componentSpace.xExpr = this.evaluator.parser.parse(x+"");
    this.componentSpace.yExpr = this.evaluator.parser.parse((y-this.parent.ascent)+"");
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.draw = function(ctx, x, y) {
    console.log(">>> Dibujo desconocido ", this.nodeType);
    this.childs[0].draw(ctx, x, y);
  }

  /**
   * 
   * 
   */
//   descartesJS.Arial = {};
//   descartesJS.Arial.ascent = [ 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 86, 87, 88, 89, 90, 91]
//   descartesJS.Arial.descent = [ 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 22]
//   descartesJS.Arial.leading = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 3, 3, 2, 2, 3, 3, 2, 2, 3, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3]
//   descartesJS.Times = {};
//   descartesJS.Times.ascent = [ 1, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 25, 26, 27, 28, 29, 30, 31, 32, 33, 33, 34, 35, 36, 37, 38, 39, 40, 41, 41, 42, 43, 44, 45, 46, 47, 48, 49, 49, 50, 51, 52, 53, 54, 55, 56, 57, 57, 58, 59, 60, 61, 62, 63, 64, 65, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 74, 75, 76, 77, 78, 79, 80, 81, 82, 82, 83, 84, 85, 86, 87, 88, 89, 90]
//   descartesJS.Times.descent = [ 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 21, 22, 22, 22]
//   descartesJS.Times.leading = [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 3, 2, 2, 2, 3, 3, 2, 2, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 4, 3, 3, 3, 4, 4, 3, 3, 4, 4, 4, 3, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4]
//   descartesJS.Mono = {};
//   descartesJS.Mono.ascent = [ 1, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 15, 16, 17, 18, 19, 20, 20, 21, 22, 23, 24, 25, 25, 26, 27, 28, 29, 30, 30, 31, 32, 33, 34, 35, 35, 36, 37, 38, 39, 40, 40, 41, 42, 43, 44, 45, 45, 46, 47, 48, 49, 50, 50, 51, 52, 53, 54, 55, 55, 56, 57, 58, 59, 60, 60, 61, 62, 63, 64, 65, 65, 66, 67, 68, 69, 70, 70, 71, 72, 73, 74, 75, 75, 76, 77, 78, 79, 80, 80, 81, 82, 83, 84]
//   descartesJS.Mono.descent = [ 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 23, 23, 23, 24, 24, 24, 24, 25, 25, 25, 26, 26, 26, 27, 27, 27, 27, 28, 28, 28, 29, 29, 29, 30, 30, 30, 30]
//   descartesJS.Mono.leading = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]


  // Valore auxiliares para calcular las metricas
  var text = document.createElement("span");
  text.appendChild( document.createTextNode("Áp Texto") );
  var block = document.createElement("div");
  block.setAttribute("style", "display: inline-block; width: 1px; height: 0px;");
  var div = document.createElement("div");
  div.setAttribute("style", "margin: 0; padding: 0;");
  div.appendChild(text);
  div.appendChild(block);
  var metricCache = {};

  descartesJS.getFontMetrics = function(font) {
    if (metricCache[font]) {
      return metricCache[font];
    }

    text.setAttribute("style", "font: " + font + "; margin: 0; padding: 0;");

    document.body.appendChild(div);
    
    var result = {};
    
    block.style.verticalAlign = "baseline";
    result.ascent = block.offsetTop - text.offsetTop;
    
    block.style.verticalAlign = "bottom";
    result.height = block.offsetTop - text.offsetTop;
    
    result.descent = result.height - result.ascent;
    
    result.baseline = result.ascent;
    
    document.body.removeChild(div);

    metricCache[font] = result;
    
    return result;
  }
  
  /**
   * 
   */
//   descartesJS.getFontMetrics = function(font) {
  function getFontMetrics1(font) {
    var metrics = {};
    var fontSize = 8;
    var ascentFactor;
    var descentFactor;

    var fontMatch = font.match(/(\d+)px/);
    if (fontMatch) {
      fontSize = fontMatch[1];
    }
    
    fontMatch = font.match(/(\d+.\d+)px/);
    if (fontMatch) {
      fontSize = fontMatch[1];
    }
    
    fontSize = (fontSize < 0) ? 0 : ((fontSize > 100) ? 100 : Math.floor(fontSize))
    
    // la tipografia es arial
    if (font.toLowerCase().match("arial")) {
//       metrics.leading = descartesJS.Arial.leading[fontSize];
      
      metrics.xHeight = fontSize*.53;
      
      if ((fontSize >= 8) && (fontSize <= 13)) {
        ascentFactor = fontSize*1.05; //9 10 11 12 13 14
        descentFactor = fontSize*.23; //2  3  3  3  3  3
      }
      else if ((fontSize > 13) && (fontSize <= 20)) {
        ascentFactor = fontSize;      //14 15 16 17 18 19 20
        descentFactor = fontSize*.18; // 3  3  3  4  4  4  4
      }
      else if ((fontSize > 20) && (fontSize <= 24)) {
        ascentFactor = fontSize*.915; // 20 21 22 22
        descentFactor = fontSize*.215; //  5  5  5  6
      }
      else if ((fontSize > 24) && (fontSize <= 25)) {
        ascentFactor = fontSize*.95; // 24
        descentFactor = fontSize*.2; //  5
      }
      else if ((fontSize > 25) && (fontSize <= 29)) {
        ascentFactor = fontSize*.964; // 26 27 27 28
        descentFactor = fontSize*.2;  //  6  6  6  6
      }
      else if ((fontSize > 29) && (fontSize <= 32)) {
        ascentFactor = fontSize*.935; // 29 30 
        descentFactor = fontSize*.21; //  7  7
      }
      else if ((fontSize > 32) && (fontSize <= 36)) {
        ascentFactor = fontSize*.942; // 33 34
        descentFactor = fontSize*.2;  //  7  8
      }
      else if ((fontSize > 36) && (fontSize <= 44)) {
        ascentFactor = fontSize*.91;  // 35 37 41
        descentFactor = fontSize*.22; //  9  9 10
      }
      else if ((fontSize > 44) && (fontSize <= 48)) {
        ascentFactor = fontSize*.94; // 42
        descentFactor = fontSize*.2; //  9
      }
      else if ((fontSize > 48) && (fontSize <= 52)) {
        ascentFactor = fontSize*.925; // 49
        descentFactor = fontSize*.23; // 12
      }
      else if ((fontSize > 52) && (fontSize <= 56)) {
        ascentFactor = fontSize*.9;   // 51
        descentFactor = fontSize*.23; // 13
      }
      else if ((fontSize > 52) && (fontSize <= 72)) {
        ascentFactor = fontSize*.91;  // 59 62 66 
        descentFactor = fontSize*.21; // 14 15 16
      }
      else if ((fontSize > 72) && (fontSize <= 100)) {
        ascentFactor = fontSize*.907; // 69 
        descentFactor = fontSize*.21; // 16
      }
    }
    
    // la tipografia es times
    else if (font.toLowerCase().match("times")) {
//       metrics.leading = descartesJS.Times.leading[fontSize];

      metrics.xHeight = fontSize*.46;
      
      if ((fontSize >= 8) && (fontSize <= 9)) {
        ascentFactor = fontSize*1.125; // 9 11
        descentFactor = fontSize*.2;   // 2  2
      }
      else if ((fontSize > 9) && (fontSize <= 12)) {
        ascentFactor = fontSize*1.05; // 11 12
        descentFactor = fontSize*.2;  //  2  3
      }
      else if ((fontSize > 12) && (fontSize <= 15)) {
        ascentFactor = fontSize*.93;  // 13 14 14
        descentFactor = fontSize*.21; //  3  3  4
      }
      else if ((fontSize > 15) && (fontSize <= 21)) {
        ascentFactor = fontSize*.89;  // 15 16 17 17 18 19
        descentFactor = fontSize*.22; //  4  4  4  5  5  5
      }
      else if ((fontSize > 21) && (fontSize <= 24)) {
        ascentFactor = fontSize*.913; // 21 21 22 
        descentFactor = fontSize*.22; //  5  6  6
      }
      else if ((fontSize > 21) && (fontSize <= 27)) {
        ascentFactor = fontSize*.921; // 24 24 25
        descentFactor = fontSize*.23; //  6  6  7
      }
      else if ((fontSize > 27) && (fontSize <= 30)) {
        ascentFactor = fontSize*.93;  // 27 27 28
        descentFactor = fontSize*.23; //  7  7  7
      }
      else if ((fontSize > 30) && (fontSize <= 32)) {
        ascentFactor = fontSize*.9;   // 29 
        descentFactor = fontSize*.23; //  8
      }
      else if ((fontSize > 32) && (fontSize <= 52)) {
        ascentFactor = fontSize*.915;  // 32 33 35 37 41 44 48
        descentFactor = fontSize*.235; //  8  9  9 10 11 12 13
      }
      else if ((fontSize > 52) && (fontSize <= 68)) {
        ascentFactor = fontSize*.91;   // 51 55 59 62 
        descentFactor = fontSize*.232; // 14 14 15 16
      }
      else if ((fontSize > 68) && (fontSize <= 100)) {
        ascentFactor = fontSize*.9;    // 66 69 72
        descentFactor = fontSize*.232; // 17 18 19
      }
    }

    // la tipografia es courier
    else if (font.toLowerCase().match("courier")) {
//       metrics.leading = Math.round(fontSize/7);//descartesJS.Mono.leading[fontSize];
      
      metrics.xHeight = fontSize*.44;
      
      if (fontSize == 8) {
        ascentFactor = fontSize*.78;  //7
        descentFactor = fontSize*.19; //2
      }
      else if ( (fontSize > 8) && (fontSize <=10)) {
        ascentFactor = 10;            //10 10
        descentFactor = fontSize*.24; // 3  3
      }
      else if ((fontSize > 10) && (fontSize <= 12)) {
        ascentFactor = fontSize*1.05; //12 13
        descentFactor = fontSize*.19; // 3  3
      }
      else if ((fontSize > 12) && (fontSize <= 14)) {
        ascentFactor = fontSize*1;    //13 14
        descentFactor = fontSize*.24; // 4  4
      }
      else if ((fontSize > 14) && (fontSize <= 17)) {
        ascentFactor = fontSize*.9;   //14 15 16
        descentFactor = fontSize*.24; // 4  4  5
      }
      else if ((fontSize > 17) && (fontSize <= 23)) {
       ascentFactor = fontSize*.855;  //16 17 18 18 19 20
        descentFactor = fontSize*.24; // 5  5  5  6  6  6
      }
      else if ((fontSize > 23) && (fontSize <= 24)) {
        ascentFactor = fontSize*.85;  //21
        descentFactor = fontSize*.26; // 7
      }
      else if ((fontSize > 24) && (fontSize <= 25)) {
        ascentFactor = fontSize*.89;  //23
        descentFactor = fontSize*.26; // 7
      }
      else if ((fontSize > 25) && (fontSize <= 27)) {
        ascentFactor = fontSize*.88;  //23 24
        descentFactor = fontSize*.24; // 7  7
      }
      else if ((fontSize > 27) && (fontSize <= 34)) {
        ascentFactor = fontSize*.85;  //24 26 28 29
        descentFactor = fontSize*.26; // 8  8  9  9
      }
      else if ((fontSize > 34) && (fontSize <= 38)) {
        ascentFactor = fontSize*.81;  //30 31
        descentFactor = fontSize*.26; //10 10
      }
      else if ((fontSize > 38) && (fontSize <= 44)) {
        ascentFactor = fontSize*.8;   //32 36
        descentFactor = fontSize*.26; //11 12
      }
      else if ((fontSize > 44) && (fontSize <= 48)) {
        ascentFactor = fontSize*.79;  //38
        descentFactor = fontSize*.26; //13
      }
      else if ((fontSize > 48) && (fontSize <= 52)) {
        ascentFactor = fontSize*.83;  //44
        descentFactor = fontSize*.26; //14
      }
      else if ((fontSize > 52) && (fontSize <= 60)) {
        ascentFactor = fontSize*.82;  //46 50
        descentFactor = fontSize*.26; //15 16
      }
      else if ((fontSize > 60) && (fontSize <= 100)) {
        ascentFactor = fontSize*.8;    //52 55
        descentFactor = fontSize*.267; //18 19
      }
    }
    
    metrics.ascent = Math.ceil(ascentFactor);
    metrics.descent = Math.ceil(descentFactor);
    metrics.height = metrics.descent + metrics.ascent;
    metrics.baseline = metrics.ascent;
    
    return metrics;
  }
  
  return descartesJS;
})(descartesJS || {});
