/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var externalDecimals = 2;
  var externalFixed = false;
  
  /**
   * A node of rtf text
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
    this.children = [];
    
    // the principal text block
    if (this.nodeType == "textBlock") {
      this.draw = this.drawTextBlock;
    }
    
    // a text line
    else if (this.nodeType == "textLineBlock") {
      this.draw = this.drawTextLineBlock;
    }

    // a formula
    else if (this.nodeType == "formula") {
      this.draw = this.drawFormula;
    }
    
    // a super index
    else if (this.nodeType == "superIndex") {
      this.draw = this.drawSuperIndex;
    }

    // a sub index
    else if (this.nodeType == "subIndex") {
      this.draw = this.drawSubIndex;
    }

    // a dynamic text
    else if (this.nodeType == "dynamicText") {
      this.draw = this.drawDynamicText;
      this.decimal_symbol = this.evaluator.parent.decimal_symbol;
    }

    // a fraction
    else if (this.nodeType == "fraction") {
      this.draw = this.drawFraction;
    }
    
    // a numerator or denominator
    else if ( (this.nodeType == "numerator") || (this.nodeType == "denominator") ) {
      this.draw = this.drawNumDen;
    }
    
    // a radical
    else if (this.nodeType == "radical") {
      this.draw = this.drawRadical;
    }
        
    // a limit
    else if (this.nodeType == "limit") {
      this.draw = this.drawLimit;
    }
    
    // an integral
    else if (this.nodeType == "integral") {
      this.draw = this.drawIntegral;
    }
    
    // a sum
    else if (this.nodeType == "sum") {
      this.draw = this.drawSum;
    }
    
    // a matrix
    else if (this.nodeType == "matrix") {
      this.draw = this.drawMatrix;
    }
    
    // a defparts element
    else if (this.nodeType == "defparts") {
      this.draw = this.drawDefparts;
    }
    
    // a text or new line
    else if ((this.nodeType == "text") || (this.nodeType == "newLine")) {
      this.draw = this.drawText;
    }
    
    // a math symbol
    else if (this.nodeType == "mathSymbol") {
      this.draw = this.drawMathSymbol;
    }
    
    // an index of a root or contents of a root or from value of a root
    // an index of a sum or contents of a sum or from value of a sum
    // an element 
    else if ( (this.nodeType == "index") || 
              (this.nodeType == "radicand") ||
              (this.nodeType == "from") ||
              (this.nodeType == "to") ||
              (this.nodeType == "what") ||
              (this.nodeType == "element")
            ) {
      this.draw = this.drawGenericBlock;
    }
    
    // a component of a control
    else if (this.nodeType == "componentNumCtrl") {
      this.draw = this.drawComponentNumCtrl;
    }

    // a component of a space
    else if (this.nodeType == "componentSpace") {
      this.draw = this.drawComponentSpace;
    }
  }

  /**
   * Get the root of the tree of nodes
   * return {RTFNode} return the root of the tree of nodes
   */
  descartesJS.RTFNode.prototype.getRoot = function() {
    if (this.parent == null) {
      return this;
    }
    return this.parent.getRoot();
  }

  /**
   * Add a child to the tree of nodes
   * @param {descartesJS.RTFNode} child the child to add
   */
  descartesJS.RTFNode.prototype.addChild = function(child) {
    child.parent = this;
    this.children.push(child);
  }
  
  // metric values, needed to calculate the super and sub indices
  var previousMetric = { ascent: 0, descent: 0, height: 0 };
  /**
   * Set the previous metric
   * @param {Number} ascent the ascent value
   * @param {Number} descent the descent value
   * @param {Number} height the height value
   */
  function updatePreviousMetric(ascent, descent, height) {
    previousMetric.ascent = ascent;
    previousMetric.descent = descent;
    previousMetric.height = height; 
  }
  
  /**
   * Get the text metrics of the rtf text
   */
  descartesJS.RTFNode.prototype.getTextMetrics = function() {
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    if (this.nodeType == "textBlock") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);

      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].getTextMetrics();
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

      // if the text is a dynamic text
      if (typeof(this.value) != "string") {
        decimals = (this.decimals == undefined) ? externalDecimals : this.evaluator.evalExpression(this.decimals);
        fixed = (this.fixed == undefined) ? externalFixed : this.fixed;
        textTemp = this.evaluator.evalExpression(this.value, decimals, fixed);

        // is a number
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
      
      var num = this.children[0];
      var den = this.children[1];

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
      var tmpStyle = this.children[0].style.clone();
      var tmpRadican;

      // correction in the roots when has only one child (problem in some lessons of Arquimedes)
      if (this.children.length === 1) {
        // radican
        this.children[1] = new descartesJS.RTFNode(this.evaluator, "", "radicand", tmpStyle);
        this.children[1].addChild(this.children[0]);
        // index
        this.children[0] = new descartesJS.RTFNode(this.evaluator, "", "index", tmpStyle);
      }
      // if has mora tan one child
      else {
        // if the first two children not are an index and radicand, then is a problem in Arquimedes
        // and is necesary to add all the children un the radicand value
        if ( (this.children[0].nodeType !== "index") || (this.children[1].nodeType !== "radicand") ) {
          // radican
          tmpRadican = new descartesJS.RTFNode(this.evaluator, "", "radicand", tmpStyle);
          for (var i=0, l=this.children.length; i<l; i++) {
            tmpRadican.addChild(this.children[i]);
          }
          this.children = [];

          this.children[0] = new descartesJS.RTFNode(this.evaluator, "", "index", tmpStyle);
          this.children[1] = tmpRadican;
        }
      }

      index    = this.children[0];
      radicand = this.children[1];

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
      
      var from = this.children[0];
      var to   = this.children[1];
      var what = this.children[2]
      
      from.getBlockMetric();
      to.getBlockMetric();
      what.getBlockMetric();

      // if "from" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (from.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(from.styleString);
        from.ascent = tmpMetric.ascent;
        from.descent = tmpMetric.descent;
        from.height = tmpMetric.height;
      }
      // if "to" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (to.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(to.styleString);
        to.ascent = tmpMetric.ascent;
        to.descent = tmpMetric.descent;
        to.height = tmpMetric.height;
      }
      
      var metric = descartesJS.getFontMetrics(this.styleString);

      // the ascent
      if (metric.height+to.height > what.ascent) {
        this.ascent = metric.height-metric.descent +to.height;
      } else {
        this.ascent = what.ascent;
      }
      
      // the descent
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
      
      var from = this.children[0];
      var to   = this.children[1];
      var what = this.children[2]
      
      from.getBlockMetric();
      to.getBlockMetric();
      what.getBlockMetric();
      
      // if "from" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (from.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(from.styleString);
        from.ascent = tmpMetric.ascent;
        from.descent = tmpMetric.descent;
        from.height = tmpMetric.height;
      }
      // if "to" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (to.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(to.styleString);
        to.ascent = tmpMetric.ascent;
        to.descent = tmpMetric.descent;
        to.height = tmpMetric.height;
      }

      var metric = descartesJS.getFontMetrics(this.styleString);

      // the ascent
      if (metric.height+to.height > what.ascent) {
        this.ascent = metric.height-metric.descent +to.height;
      } else {
        this.ascent = what.ascent;
      }
      
      // the descent
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
      
      var from = this.children[0];
      var to   = this.children[1];
      var what = this.children[2]
      var tmpMetric;
      var metric = descartesJS.getFontMetrics(this.styleString);

      from.getBlockMetric();
      to.getBlockMetric();
      what.getBlockMetric();
      
      // if "from" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (from.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(from.styleString);
        from.ascent = tmpMetric.ascent;
        from.descent = tmpMetric.descent;
        from.height = tmpMetric.height;
      }
      // if "to" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (to.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(to.styleString);
        to.ascent = tmpMetric.ascent;
        to.descent = tmpMetric.descent;
        to.height = tmpMetric.height;
      }
      // if "what" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
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
      
      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].getBlockMetric();
        
        childHeight = this.children[i].height;
        childWidth = this.children[i].width;
        
        if (maxHeigth < childHeight) {
          maxHeigth = childHeight;
          maxAscenderHeight = this.children[i].ascent;
          maxDescenderHeight = this.children[i].descent;
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

      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].getBlockMetric();
        
        childHeight = this.children[i].height;
        childWidth = this.children[i].width;
        
        if (maxHeigth < childHeight) {
          maxHeigth = childHeight;
          maxAscenderHeight = this.children[i].ascent;
          maxDescenderHeight = this.children[i].descent;
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
      console.log("Element i=unknown", this.nodeType);
    }
    
  }
  
  /**
   * Get the metric of a block
   */
  descartesJS.RTFNode.prototype.getBlockMetric = function() {
    this.width = 0;
    var maxDescenderHeight = -1;
    var maxAscenderHeight = -1;
    var childHeight;
    var children_i;
    
    // loops throught all the children of a text line to determine which is the width and the height
    for (var i=0, l=this.children.length; i<l; i++) {
      children_i = this.children[i];
      children_i.getTextMetrics();

      childAscent = children_i.ascent;
      childDescent = children_i.descent;

      this.width += children_i.width;
     
      // update the previous metric
      updatePreviousMetric(childAscent, childDescent, children_i.height);
      
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
   * Draw a text block
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   * @param {Number} decimals the number of decimals of the text
   * @param {Boolean} fixed the number of significant digits of the number in the text
   * @param {String} align the alignment of the text
   * @param {Boolean} displaceY a flag to indicate if the text needs a displace in the y position
   */
  descartesJS.RTFNode.prototype.drawTextBlock = function(ctx, x, y, decimals, fixed, align, displaceY) {
    // if the text has a dynamic text, then is necesary to calculate the width of the elements
    if(!this.stableWidth) {
      this.getTextMetrics();
      externalDecimals = decimals;
      externalFixed = fixed;
    }

    displaceY = (displaceY) ? -this.children[0].ascent : 0;
    
    var desp = 0;
    var antChildY = 0;

    for (var i=0, l=this.children.length; i<l; i++) {
      if (i>0) {
        antChildY += this.children[i-1].height;
      }
      
      // if the text align is center
      if (align == "center") {
        desp = -this.children[i].width/2;
      }
      // if the text align is right
      else if (align == "right") {
        desp =-this.children[i].width;
      }
      
      this.children[i].draw(ctx, x +desp, y +displaceY +antChildY);
    }
  }

  /**
   * Draw a text line block
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawTextLineBlock = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.children.length; i<l; i++) {

      if (i>0) {
        antChildX += this.children[i-1].width;

        if ((this.children[i-1].nodeType == "formula")) {
          antChildX += 2*descartesJS.getTextWidth(" ", this.children[i].styleString);
        }
      }

      this.children[i].draw(ctx, x+antChildX, y+this.baseline);
    }
  }  
  
  /**
   * Draw a formula
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawFormula = function(ctx, x, y) {
    var antChildX = 0;

    for (var i=0, l=this.children.length; i<l; i++) {
      if (i>0) {
        antChildX += this.children[i-1].width;
      }
      this.children[i].draw(ctx, x + this.spaceWidth + antChildX, y);
    }    
  }
      
  /**
   * Draw a text
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
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
   * Draw a dynamic text
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawDynamicText = function(ctx, x, y) {
    var spaceWidth = Math.floor(this.spaceWidth*.5);

    var decimals = (this.decimals == undefined) ? externalDecimals : this.evaluator.evalExpression(this.decimals);
    var fixed = (this.fixed == undefined) ? externalFixed : this.fixed;

    var textTemp = this.evaluator.evalExpression(this.value, decimals, fixed);
    
    // the text is a number
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
   * Draw a radical
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawRadical = function(ctx, x, y) {
    var spaceWidth = Math.floor(this.spaceWidth);
    
    this.children[0].draw(ctx, x, Math.floor(y +this.children[1].descent -this.children[1].height/2 -this.children[0].descent));
    this.children[1].draw(ctx, x+1.5*spaceWidth+(this.children[0].width), y);
    
    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()

    ctx.moveTo(x, Math.floor(y +this.children[1].descent -this.children[1].height/2));
    ctx.lineTo(x+this.children[0].width, Math.floor(y +this.children[1].descent -this.children[1].height/2));
    ctx.lineTo(x+this.children[0].width +.5*spaceWidth, y+this.children[1].descent);
    ctx.lineTo(x+this.children[0].width +1*spaceWidth, y-this.children[1].ascent);
    ctx.lineTo(x+this.children[0].width +2*spaceWidth+this.children[1].width, y-this.children[1].ascent);

    ctx.stroke();
  }
  
  /**
   * Draw a fraction
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawFraction = function(ctx, x, y) {
    this.children[0].draw(ctx, x+(this.width-this.children[0].width)/2, y -this.ascent);
    this.children[1].draw(ctx, x+(this.width-this.children[1].width)/2, y -this.ascent + this.children[0].height -1);

    var spaceWidth = Math.floor(this.spaceWidth*.5);
    
    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()
    ctx.moveTo(x+spaceWidth, parseInt(y -this.ascent + this.children[0].height)+.5);
    ctx.lineTo(x-spaceWidth+this.width-1, parseInt(y -this.ascent + this.children[0].height)+.5);
    ctx.stroke();
  }

  /**
   * Draw a numerator or denominator
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawNumDen = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.children.length; i<l; i++) {
      if (i>0) {
        antChildX += this.children[i-1].width;
      }
      this.children[i].draw(ctx, x+antChildX, y+this.baseline);
    }  
  }
  
  /**
   * Draw a sub index
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawSubIndex = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.children.length; i<l; i++) {
      if (i>0) {
        antChildX += this.children[i-1].width;
      }
      this.children[i].draw(ctx, x+antChildX, y +this.subIndexPos);
    }
  }
  
  /**
   * Draw a super index
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawSuperIndex = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.children.length; i<l; i++) {
      if (i>0) {
        antChildX += this.children[i-1].width;
      }
      this.children[i].draw(ctx, x+antChildX, y -this.superIndexPos);
    }  
  }

  /**
   * Draw a limit
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawLimit = function(ctx, x, y) {
    var metric = descartesJS.getFontMetrics(this.styleString);

    var symbolString = " " + String.fromCharCode(parseInt(8594));
    var symbolWidth = descartesJS.getTextWidth(symbolString, this.styleString);
    
    // from
    this.children[0].draw(ctx, x, y +metric.descent +this.children[0].ascent);
    
    // to
    this.children[1].draw(ctx, x +this.children[0].width +symbolWidth, y +metric.descent +this.children[1].ascent);
    
    //what
    this.children[2].draw(ctx, x +symbolWidth +this.children[0].width +this.children[1].width, y);

    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = this.styleString
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("lím", x +this.children[0].width, y);
    
    ctx.fillText(symbolString, x+this.children[0].width, y +metric.descent +this.children[0].ascent);
  }
  
  /**
   * Draw an integral
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawIntegral = function(ctx, x, y) {
    var symbolStyle = this.style.clone();
    symbolStyle.fontSize = 1.5*symbolStyle.fontSize;
    symbolStyle.fontType = "Times New Roman";
    symbolStyle.Bold = "bold";
    symbolStyle = symbolStyle.toString();    
    
    var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(parseInt(8747)), symbolStyle);
    var symbolMetric = descartesJS.getFontMetrics(symbolStyle);

    var maxWidth = Math.max(this.children[0].width, this.children[1].width, Math.floor(1.5*symbolWidth));
    
    // from
    this.children[0].draw(ctx, x +symbolWidth, y +symbolMetric.descent +this.children[0].ascent);
    
    // to
    this.children[1].draw(ctx, x +symbolWidth +this.spaceWidth/2, y -this.ascent +this.children[1].ascent);
    
    // what
    this.children[2].draw(ctx, x +maxWidth +symbolWidth, y);

    // sigma character
    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = symbolStyle;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    
    ctx.fillText(String.fromCharCode(parseInt(8747)), x, y +symbolMetric.descent/2);
  }

  /**
   * Draw a sum
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawSum = function(ctx, x, y) {
    var symbolStyle = this.style.clone();
    symbolStyle.fontType = "Times New Roman";
    symbolStyle.Bold = "bold";
    symbolStyle = symbolStyle.toString();    

    var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(parseInt(8721)), symbolStyle);
    var symbolMetric = descartesJS.getFontMetrics(this.styleString);

    var maxWidth = Math.max(this.children[0].width, this.children[1].width, symbolWidth);
    
    // from
    this.children[0].draw(ctx, x +(maxWidth-this.children[0].width)/2, y +symbolMetric.descent +this.children[0].ascent);
    
    // to
    this.children[1].draw(ctx, x +(maxWidth-this.children[1].width)/2, y -symbolMetric.ascent -this.children[1].descent);
    
    // what
    this.children[2].draw(ctx, x +maxWidth, y);

    // sum character
    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = symbolStyle;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    
    ctx.fillText(String.fromCharCode(parseInt(8721)), x +Math.floor( (maxWidth-symbolWidth)/2 ), y-5);      
  }

  /**
   * Draw a matrix
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawMatrix = function(ctx, x, y) {
    var columnIndex;
    var rowIndex;
    
    for (var i=0, l=this.children.length; i<l; i++) {
      columnIndex = i%this.columns;
      rowIndex = Math.floor(i/this.columns);
            
      this.children[i].draw(ctx, 2*this.spaceWidth + x + columnIndex*this.childWidth, y-this.ascent+this.childAscent + rowIndex*this.childHeight);
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
   * Draw a def parts
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawDefparts = function(ctx, x, y) {
    for (var i=0, l=this.children.length; i<l; i++) {
      this.children[i].draw(ctx, x + this.spaceWidth/4, y-this.ascent+this.childAscent + (i%this.parts)*this.childHeight);
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
   * Draw a math symbol
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
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
   * Draw a generic block, that do not need to modify the position of its components
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawGenericBlock = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.children.length; i<l; i++) {
      if (i>0) {
        antChildX += this.children[i-1].width;
      }
      this.children[i].draw(ctx, x+antChildX, y);
    }  
  }  
  
  /**
   * Draw a control componet
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawComponentNumCtrl = function(ctx, x, y) {
    this.getTextMetrics();
    this.componentNumCtrl.expresion = this.evaluator.parser.parse("(" + x + "," + (y-this.parent.ascent) + "," + this.componentNumCtrl.w + "," + this.componentNumCtrl.h + ")");
  }
  
  /**
   * Draw a space component
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawComponentSpace = function(ctx, x, y) {
    this.getTextMetrics();
    this.componentSpace.xExpr = this.evaluator.parser.parse(x+"");
    this.componentSpace.yExpr = this.evaluator.parser.parse((y-this.parent.ascent)+"");
  }

  /**
   * Draw a unknown element
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.draw = function(ctx, x, y) {
    console.log(">>> Dibujo desconocido ", this.nodeType);
    this.children[0].draw(ctx, x, y);
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.toHTML = function() {
    var htmlString = "";
    
    if ( (this.nodeType === "textLineBlock") || (this.nodeType === "textBlock") ) {
      for (var i=0, l=this.children.length; i<l; i++) {
        htmlString = htmlString + this.children[i].toHTML();
      }
    }
    else if (this.nodeType === "text") {
      htmlString = "<span " + this.style.toCSS() + ">" + this.value + "</span>"; 
    }
    else if (this.nodeType === "newLine") {
      htmlString = "<span " + this.style.toCSS() + ">" + this.value + "<br /></span>";
    }
    else {
      console.log(">>><<<", this);
    }
    
    return htmlString;
  }


  // auxiliary values to calculate the metrics
  var text = document.createElement("span");
  text.appendChild( document.createTextNode("Áp") );
  var block = document.createElement("div");
  block.setAttribute("style", "display: inline-block; width: 1px; height: 0px;");
  var div = document.createElement("div");
  div.setAttribute("style", "margin: 0; padding: 0;");
  div.appendChild(text);
  div.appendChild(block);
  var metricCache = {};

  /**
   * Get the metrics of a font
   * @param {String} font the Descartes font to obtain the metric
   * @return {Object} return an object containing the metric of the font (ascent, descent, height)
   */
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
  
  return descartesJS;
})(descartesJS || {});