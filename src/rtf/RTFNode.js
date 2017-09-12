/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathMax = Math.max;
  var externalDecimals = 2;
  var externalFixed = false;
  var localColor;

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

    switch(this.nodeType) {
      // the principal text block
      case ("textBlock"):
        this.draw = this.drawTextBlock;
        break;

      // a text line
      case ("textLineBlock"):
        this.draw = this.drawTextLineBlock;
        break;

      // a formula
      case ("formula"):
        this.draw = this.drawFormula;
        break;

      // a super index
      case ("superIndex"):
        this.draw = this.drawSuperIndex;
        break;

      // a sub index
      case ("subIndex"):
        this.draw = this.drawSubIndex;
        break;

      // a dynamic text
      case ("dynamicText"):
        this.draw = this.drawDynamicText;
        this.decimal_symbol = this.evaluator.parent.decimal_symbol;
        break;

      // a fraction
      case ("fraction"):
        this.draw = this.drawFraction;
        break;

      // a numerator or denominator
      case ("numerator"):
      case ("denominator"):
        this.draw = this.drawNumDen;
        break;

      // a radical
      case ("radical"):
        this.draw = this.drawRadical;
        break;

      // a limit
      case ("limit"):
        this.draw = this.drawLimit;
        break;

      // an integral
      case ("integral"):
        this.draw = this.drawIntegral;
        break;

      // a sum
      case ("sum"):
        this.draw = this.drawSum;
        break;

      // a matrix
      case ("matrix"):
        this.draw = this.drawMatrix;
        break;

      // a defparts element
      case ("defparts"):
        this.draw = this.drawDefparts;
        break;

      // a text or new line
      case ("text"):
      case ("newLine"):
        this.draw = this.drawText;
        break;

      // a hyperlink
      case ("hyperlink"):
        this.draw = this.drawHyperlink;
        break;

      // a math symbol
      case ("mathSymbol"):
        this.draw = this.drawMathSymbol;
        break;

      // an index of a root or contents of a root or from value of a root
      // an index of a sum or contents of a sum or from value of a sum
      // an element
      case ("index"):
      case ("radicand"):
      case ("from"):
      case ("to"):
      case ("what"):
      case ("element"):
        this.draw = this.drawGenericBlock;
        break;

      // a component of a control
      case ("componentNumCtrl"):
        this.draw = this.drawComponentNumCtrl;
        break;

      // a component of a space
      case ("componentSpace"):
        this.draw = this.drawComponentSpace;
        break;
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
  var prevMetric = { ascent: 0, descent: 0, h: 0 };
  /**
   * Set the previous metric
   * @param {Number} ascent the ascent value
   * @param {Number} descent the descent value
   * @param {Number} h the h value
   */
  function updatePrevMetric(ascent, descent, h) {
    prevMetric.ascent = ascent;
    prevMetric.descent = descent;
    prevMetric.h = h;
  }

  var metric;

  /**
   * Get the text metric of the rtf text
   */
  descartesJS.RTFNode.prototype.getTextMetrics = function() {
    this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
    var prevAscent = prevMetric.ascent;
    var prevDescent = prevMetric.descent;
    var prevHeight = prevMetric.h;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    if (this.nodeType == "textBlock") {
      this.w = this.h = 0;
      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].getTextMetrics();
        this.w = Math.max(this.w, this.children[i].w);
        this.h += this.children[i].h;
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "textLineBlock") {
      this.getBlockMetric();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "newLine") {
      metric = descartesJS.getFontMetrics(this.styleString);

      this.w = 0;
      this.h = metric.h;
      this.baseline = metric.baseline;
      this.descent = metric.descent;
      this.ascent = metric.ascent;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if ( (this.nodeType == "text") || (this.nodeType == "dynamicText")) {
      metric = descartesJS.getFontMetrics(this.styleString);

      this.baseline = metric.baseline;
      this.descent = metric.descent;
      this.ascent = metric.ascent;

      var textTemp = this.value;
      var decimals;
      var fixed;

      // if the text is a dynamic text
      if (typeof(this.value) != "string") {
        decimals = (this.decimals == undefined) ? externalDecimals : this.evaluator.eval(this.decimals);
        fixed = (this.fixed == undefined) ? externalFixed : this.fixed;
        textTemp = this.evaluator.eval(this.value, decimals, fixed);

        // is a number
        if (parseFloat(textTemp).toString() === textTemp.toString()) {
          textTemp = (fixed) ? parseFloat(textTemp).toFixed(decimals) : descartesJS.removeNeedlessDecimals((parseFloat(textTemp).toFixed(decimals)));
          textTemp = (""+textTemp).replace(".", this.decimal_symbol);
        }

        textTemp += " ";
      }

      this.w = descartesJS.getTextWidth(textTemp, this.styleString);
      this.h = metric.h;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "formula") {
      this.getBlockMetric();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "hyperlink") {
      metric = descartesJS.getFontMetrics(this.styleString);

      this.w = descartesJS.getTextWidth(this.value, this.styleString);
      this.h = metric.h;
      this.baseline = metric.baseline;
      this.descent = metric.descent;
      this.ascent = metric.ascent;

      this.clickCacher = document.createElement("div");
      this.clickCacher.setAttribute("style", "position:absolute;width:" + this.w + "px;height:" + this.h + "px;cursor:pointer;");

      var action = new descartesJS.OpenURL(this.evaluator.parent, this.URL);

      var _self = this;
      this.clickCacher.addEventListener("click", function(evt) {
        _self.click = true;
        action.actionExec();
      })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "superIndex") {
      metric = descartesJS.getFontMetrics(this.styleString);

      this.getBlockMetric();

      if (this.h < 0) {
        this.ascent = metric.ascent;
        this.descent = metric.descent;
        this.h = this.ascent + this.descent;
        this.w = this.spaceWidth*1.5;
      }

      var tmpAscent = prevHeight/2 - prevDescent + this.h;
      this.superIndexPos = tmpAscent - this.ascent;

      this.ascent = tmpAscent;
      this.descent = prevDescent;
      this.baseline = this.ascent;
      this.h = this.ascent + this.descent;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "subIndex") {
      metric = descartesJS.getFontMetrics(this.styleString);

      this.getBlockMetric();

      if (this.h < 0) {
        this.ascent = metric.ascent;
        this.descent = metric.descent;
        this.h = this.ascent + this.descent;
        this.w = this.spaceWidth*1.5;
      }

      this.subIndexPos = prevDescent +1;

      this.ascent = prevAscent;
      this.descent = this.subIndexPos + this.descent;
      this.baseline = this.ascent;
      this.h = this.ascent + this.descent;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "fraction") {
      var num = this.children[0];
      var den = this.children[1];
      metric = descartesJS.getFontMetrics(num.styleString);

      num.getBlockMetric();
      den.getBlockMetric();

      if (num.h < 0) {
        num.h = metric.h;
        num.w = this.spaceWidth;
      }
      if (den.h < 0) {
        den.h = metric.h;
        den.w = this.spaceWidth;
      }

      this.h = num.h + den.h -1;

      this.ascent = num.h + Math.round( prevHeight/2 )-prevDescent;
      this.descent = this.h - this.ascent;
      this.baseline = this.ascent;

      this.w = MathMax(num.w, den.w) +this.spaceWidth +8;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "radical") {
      var index;
      var radicand;
      var tmpStyle = this.children[0].style.clone();
      var tmpRadican;

      // correction in the roots when has only one child (problem in some lessons of Arquimedes)
      if (this.children.length === 1) {
        // radican
        this.children[1] = new descartesJS.RTFNode(this.evaluator, " ", "radicand", tmpStyle);
        this.children[1].addChild(this.children[0]);
        // index
        this.children[0] = new descartesJS.RTFNode(this.evaluator, " ", "index", tmpStyle);
      }
      // if has more than one child
      else {
        // if the first two children not are an index and radicand, then is a problem in Arquimedes
        // and is necesary to add all the children in the radicand value
        if ( (this.children[0].nodeType !== "index") || (this.children[1].nodeType !== "radicand") ) {
          // radicand
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

      if (index.children.length <= 0) {
        var tmpStyle = this.style.clone();
        tmpStyle.fontSize = parseInt(tmpStyle.fontSize - tmpStyle.fontSize*.2);
        index.addChild( new descartesJS.RTFNode(this.evaluator, " ", "text", tmpStyle) );
      }
      if (radicand.children.length <= 0) {
        radicand.addChild( new descartesJS.RTFNode(this.evaluator, " ", "text", this.style.clone()) );
      }

      index.getBlockMetric();
      radicand.getBlockMetric();

      this.ascent = (radicand.h/2 < index.h) ? (radicand.h/2 + index.h+2 - radicand.descent) : radicand.ascent +4;
      this.descent = radicand.descent;
      this.baseline = this.ascent;
      this.h = this.ascent + this.descent;

      this.w = index.w + radicand.w +4*this.spaceWidth;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if ((this.nodeType == "sum") || (this.nodeType == "integral")) {
      var from = this.children[0];
      var to   = this.children[1];
      var what = this.children[2]
      var tmpMetric;

      from.getBlockMetric();
      to.getBlockMetric();
      what.getBlockMetric();

      // if "from" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (from.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(from.styleString);
        from.ascent = tmpMetric.ascent;
        from.descent = tmpMetric.descent;
        from.h = tmpMetric.h;
      }
      // if "to" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (to.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(to.styleString);
        to.ascent = tmpMetric.ascent;
        to.descent = tmpMetric.descent;
        to.h = tmpMetric.h;
      }

      metric = descartesJS.getFontMetrics(this.styleString);

      // the ascent
      if (metric.h+to.h > what.ascent) {
        this.ascent = metric.h-metric.descent +to.h;
      } else {
        this.ascent = what.ascent;
      }

      // the descent
      if (from.h > what.descent) {
        this.descent = from.h + metric.descent;
      } else {
        this.descent = what.descent;
      }

      this.baseline = this.ascent;
      this.h = this.ascent + this.descent;

      var symbolStyle = this.style.clone();
      symbolStyle.fontType = descartesJS.serif_font;
      symbolStyle.Bold = "bold";

      if (this.nodeType == "sum") {
        symbolStyle = symbolStyle.toString();

        var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(931), symbolStyle);

        this.w = MathMax(from.w, to.w, symbolWidth) + MathMax(what.w, this.spaceWidth) +this.spaceWidth;
      }
      else if (this.nodeType == "integral") {
        symbolStyle.fontSize = 1.5*symbolStyle.fontSize;
        symbolStyle = symbolStyle.toString();

        var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(8747), symbolStyle);

        this.w = MathMax(from.w, to.w, symbolWidth) + MathMax(what.w, this.spaceWidth) +2*this.spaceWidth;
      }

    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "limit") {
      var from = this.children[0];
      var to   = this.children[1];
      var what = this.children[2]
      var tmpMetric;
      metric = descartesJS.getFontMetrics(this.styleString);

      from.getBlockMetric();
      to.getBlockMetric();
      what.getBlockMetric();

      // if "from" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (from.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(from.styleString);
        from.ascent = tmpMetric.ascent;
        from.descent = tmpMetric.descent;
        from.h = tmpMetric.h;
      }
      // if "to" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (to.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(to.styleString);
        to.ascent = tmpMetric.ascent;
        to.descent = tmpMetric.descent;
        to.h = tmpMetric.h;
      }
      // if "what" is empty then the ascent is -1, but is necesary to calculate the space which would occupy
      if (what.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(what.styleString);
        what.ascent = tmpMetric.ascent;
        what.descent = tmpMetric.descent;
        what.h = tmpMetric.h;
      }

      this.ascent = what.ascent;
      this.descent = MathMax(metric.h, from.h, to.h, what.descent);
      this.baseline = this.ascent;
      this.h = this.ascent + this.descent;

      var limitWidth = descartesJS.getTextWidth(" " + String.fromCharCode(8594), this.styleString);

      if (from.w == 0) {
        from.w = this.spaceWidth;
      }
      if (to.w == 0) {
        to.w = this.spaceWidth;
      }
      if (what.w == 0) {
        what.w = this.spaceWidth;
      }

      this.w = to.w + from.w + what.w + limitWidth + this.spaceWidth;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "matrix") {
      metric = descartesJS.getFontMetrics(this.styleString);

      var maxAscenderHeight = metric.ascent;
      var maxDescenderHeight = metric.descent;
      var maxHeight = metric.h;
      var maxWidth = this.spaceWidth;

      var childHeight;
      var childWidth;

      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].getBlockMetric();

        childHeight = this.children[i].h;
        childWidth = this.children[i].w;

        if (maxHeight < childHeight) {
          maxHeight = childHeight;
          maxAscenderHeight = this.children[i].ascent;
          maxDescenderHeight = this.children[i].descent;
        }

        if (maxWidth < childWidth) {
          maxWidth = childWidth;
        }
      }

      this.childWidth = maxWidth + 2*this.spaceWidth;
      this.childHeight = maxHeight;
      this.childAscent = maxAscenderHeight;
      this.childDescent = maxDescenderHeight;

      this.h = this.rows * maxHeight;
      this.ascent = this.h/2;
      this.descent = this.h/2;
      this.w = this.columns * this.childWidth +this.spaceWidth;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "defparts") {
      metric = descartesJS.getFontMetrics(this.styleString);

      var maxAscenderHeight = metric.ascent;
      var maxDescenderHeight = metric.descent;
      var maxHeight = metric.h;
      var maxWidth = this.spaceWidth;

      var childHeight;
      var childWidth;

      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].getBlockMetric();

        childHeight = this.children[i].h;
        childWidth = this.children[i].w;

        if (maxHeight < childHeight) {
          maxHeight = childHeight;
          maxAscenderHeight = this.children[i].ascent;
          maxDescenderHeight = this.children[i].descent;
        }

        if (maxWidth < childWidth) {
          maxWidth = childWidth;
        }
      }

      this.childWidth = maxWidth + 2*this.spaceWidth;
      this.childHeight = maxHeight;
      this.childAscent = maxAscenderHeight;
      this.childDescent = maxDescenderHeight;

      this.h = this.parts * maxHeight;
      this.ascent = this.h/2 + prevDescent;
      this.descent = this.h - this.ascent;
      this.w = this.childWidth +  +this.spaceWidth/2;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "mathSymbol") {
      metric = descartesJS.getFontMetrics(this.styleString);

      this.baseline = metric.baseline;
      this.descent = metric.descent;
      this.ascent = metric.ascent;

      this.w = descartesJS.getTextWidth(this.value, this.styleString) + this.spaceWidth;
      this.h = metric.h;
    }

    else if (this.nodeType == "componentNumCtrl") {
      metric = descartesJS.getFontMetrics(this.styleString);

      this.componentNumCtrl = this.evaluator.parent.getControlByCId(this.value);

      this.baseline = metric.baseline-2;
      this.descent = metric.descent-2;
      this.ascent = metric.ascent+2;

      this.h = this.componentNumCtrl.h || 1;
      this.w = this.componentNumCtrl.w || 1;
    }

    else if (this.nodeType == "componentSpace") {
      this.componentSpace = this.evaluator.parent.getSpaceByCId(this.value);

      this.baseline = 0;
      this.descent = 0;
      this.ascent = 0;

      this.h = 0;
      this.w = this.componentSpace.w;
    }

    else {
      console.log("Element i=unknown", this.nodeType);
    }

  }

  /**
   * Get the metric of a block
   */
  descartesJS.RTFNode.prototype.getBlockMetric = function() {
    this.w = 0;
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

      this.w += children_i.w;

      // update the previous metric
      updatePrevMetric(childAscent, childDescent, children_i.h);

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
    this.h = this.ascent + this.descent;
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
  descartesJS.RTFNode.prototype.drawTextBlock = function(ctx, x, y, decimals, fixed, align, displaceY, color) {
    localColor = color;

    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";

    // if the text has a dynamic text, then is necesary to calculate the width of the elements
    if (!this.stableWidth) {
      externalDecimals = decimals;
      externalFixed = fixed;
      this.getTextMetrics();
    }

    displaceY = (displaceY) ? -this.children[0].ascent : 0;

    var desp = 0;
    var previousChildPos = 0;

    for (var i=0, l=this.children.length; i<l; i++) {
      if (i>0) {
        previousChildPos += this.children[i-1].h;
      }

      // if the text align is center
      if (align == "center") {
        desp = -this.children[i].w/2;
      }
      // if the text align is right
      else if (align == "right") {
        desp =-this.children[i].w;
      }

      this.children[i].draw(ctx, x+desp, y+displaceY+previousChildPos);
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
      ctx.strokeStyle = ctx.fillStyle = localColor;

      if (i>0) {
        antChildX += this.children[i-1].w;

        if ((this.children[i-1].nodeType == "formula")) {
          antChildX += 2*this.children[i-1].spaceWidth;
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
        antChildX += this.children[i-1].w;
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
      ctx.lineTo(x-1+this.w, parseInt(y+this.descent/2) +sep);
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
      ctx.lineTo(x-1+this.w, parseInt(y-this.ascent) +sep);
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
    var spaceWidth = MathFloor(this.spaceWidth*.5);

    var decimals = (this.decimals == undefined) ? externalDecimals : this.evaluator.eval(this.decimals);
    var fixed = (this.fixed == undefined) ? externalFixed : this.fixed;

    var textTemp = this.evaluator.eval(this.value);
    // the text is a number
    if (parseFloat(textTemp).toString() === textTemp.toString()) {
      textTemp = (fixed) ? parseFloat(textTemp).toFixed(decimals) : descartesJS.removeNeedlessDecimals((parseFloat(textTemp).toFixed(decimals)));
      textTemp = (""+textTemp).replace(".", this.decimal_symbol);
    }

    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = this.styleString;

    this.w = descartesJS.getTextWidth(textTemp, this.styleString);
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
      ctx.lineTo(spaceWidth + x-1+this.w, parseInt(y+this.descent/2) +sep);
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
      ctx.lineTo(spaceWidth + x-1+this.w, parseInt(y-this.ascent) +sep);
      ctx.stroke();
    }

    this.w += 2*spaceWidth;
  }

  /**
   * Draw a hyperlink
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawHyperlink = function(ctx, x, y) {
    // add and position of the click cacher div
    if (!this.clickCacher.parentNode) {
      // ctx.canvas.parentNode.appendChild(this.clickCacher);
      if (ctx.canvas.nextSibling.className) {
        ctx.canvas.parentNode.insertBefore(this.clickCacher, ctx.canvas.nextSibling.nextSibling);
      }
      else {
        ctx.canvas.parentNode.insertBefore(this.clickCacher, ctx.canvas.nextSibling);
      }
      this.clickCacher.style.left = (x -2) + "px";
      this.clickCacher.style.top  = (y - this.ascent -2) + "px";
    }

    ctx.save();

    if (this.click) {
      ctx.fillStyle = "red";
      ctx.strokeStyle = "red";
    }
    else {
      ctx.fillStyle = "blue";
      ctx.strokeStyle = "blue";
    }

    ctx.font = this.styleStr;

    ctx.fillText(this.value, x-1, y);

    var isBold = this.style.textBold == "bold";
    var sep = isBold ? 1 : .5;
    ctx.lineWidth = isBold ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(x-1, Math.ceil(y+this.descent/2) +sep -2);
    ctx.lineTo(x-1+this.w, Math.ceil(y+this.descent/2) +sep -2);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Draw a radical
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawRadical = function(ctx, x, y) {
    var spaceWidth = MathFloor(this.spaceWidth);

    this.children[0].draw(ctx, x, MathFloor(y +this.children[1].descent -this.children[1].h/2 -this.children[0].descent));
    this.children[1].draw(ctx, x+1.5*spaceWidth+(this.children[0].w), y);

    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()

    ctx.moveTo(x, MathFloor(y +this.children[1].descent -this.children[1].h/2));
    ctx.lineTo(x+this.children[0].w, MathFloor(y +this.children[1].descent -this.children[1].h/2));
    ctx.lineTo(x+this.children[0].w +.5*spaceWidth, y+this.children[1].descent);
    ctx.lineTo(x+this.children[0].w +1*spaceWidth, y-this.children[1].ascent);
    ctx.lineTo(x+this.children[0].w +2*spaceWidth+this.children[1].w, y-this.children[1].ascent);

    ctx.stroke();
  }

  /**
   * Draw a fraction
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawFraction = function(ctx, x, y) {
    this.children[0].draw(ctx, x+(this.w-this.children[0].w)/2, y -this.ascent);
    this.children[1].draw(ctx, x+(this.w-this.children[1].w)/2, y -this.ascent + this.children[0].h -1);

    var spaceWidth = MathFloor(this.spaceWidth*.5);

    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()
    ctx.moveTo(x+spaceWidth, parseInt(y -this.ascent + this.children[0].h) -.5);
    ctx.lineTo(x-spaceWidth+this.w-1, parseInt(y -this.ascent + this.children[0].h) -.5);
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
        antChildX += this.children[i-1].w;
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
        antChildX += this.children[i-1].w;
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
        antChildX += this.children[i-1].w;
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
    this.children[1].draw(ctx, x +this.children[0].w +symbolWidth, y +metric.descent +this.children[1].ascent);

    //what
    this.children[2].draw(ctx, x +symbolWidth +this.children[0].w +this.children[1].w, y);

    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = this.styleString
    ctx.fillText("lím", x +this.children[0].w, y);

    ctx.fillText(symbolString, x+this.children[0].w, y +metric.descent +this.children[0].ascent);
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
    symbolStyle.fontType = descartesJS.serif_font;
    symbolStyle.Bold = "bold";
    symbolStyle = symbolStyle.toString();

    var symbolWidth = 2*descartesJS.getTextWidth(String.fromCharCode(8747), symbolStyle)/3 ;
    var symbolMetric = descartesJS.getFontMetrics(symbolStyle);

    var maxWidth = MathMax(this.children[0].w, this.children[1].w, MathFloor(1.5*symbolWidth));

    // from
    this.children[0].draw(ctx, x +symbolWidth, y +symbolMetric.descent +this.children[0].ascent);

    // to
    this.children[1].draw(ctx, x +symbolWidth +this.spaceWidth/2, y -this.ascent +this.children[1].ascent);

    // what
    this.children[2].draw(ctx, x +maxWidth +symbolWidth, y);

    // integral character
    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = symbolStyle;

    ctx.fillText(String.fromCharCode(8747), x, y +symbolMetric.descent/2);
  }

  /**
   * Draw a sum
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawSum = function(ctx, x, y) {
    var symbolStyle = this.style.clone();
    var fntSz = symbolStyle.fontSize;
    symbolStyle.fontSize = 1.5*fntSz;
    symbolStyle.fontType = descartesJS.serif_font;
    symbolStyle.Bold = "bold";
    symbolStyle = symbolStyle.toString();

    var symbolWidth = 2*descartesJS.getTextWidth(String.fromCharCode(931), symbolStyle)/3 ;
    var symbolMetric = descartesJS.getFontMetrics(this.styleString);

    var maxWidth = MathMax(this.children[0].w, this.children[1].w, symbolWidth);

    // from
    this.children[0].draw(ctx, x +(maxWidth-this.children[0].w)/2, y +symbolMetric.descent +this.children[0].ascent);

    // to
    this.children[1].draw(ctx, x +(maxWidth-this.children[1].w)/2, y -symbolMetric.ascent -this.children[1].descent);

    // what
    this.children[2].draw(ctx, x +maxWidth  +parseInt(fntSz/3), y);

    // sigma character
    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = symbolStyle;

    ctx.fillText(String.fromCharCode(931), x +MathFloor( (maxWidth-symbolWidth)/2 -symbolWidth/5 ), y +parseInt(fntSz/8));
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
      rowIndex = MathFloor(i/this.columns);

      this.children[i].draw(ctx, 2*this.spaceWidth + x + columnIndex*this.childWidth, y-this.ascent+this.childAscent + rowIndex*this.childHeight);
    }

    ctx.lineWidth = 1.5;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()
    ctx.moveTo(MathFloor(x +this.spaceWidth) +.5, y -this.ascent +.5);
    ctx.lineTo(MathFloor(x +this.spaceWidth/2) +.5, y -this.ascent +.5);
    ctx.lineTo(MathFloor(x +this.spaceWidth/2) +.5, y +this.descent +.5);
    ctx.lineTo(MathFloor(x +this.spaceWidth) +.5, y +this.descent +.5);

    ctx.moveTo(MathFloor(x +this.w -this.spaceWidth) -.5, y -this.ascent +.5);
    ctx.lineTo(MathFloor(x +this.w -this.spaceWidth/2) -.5, y -this.ascent +.5);
    ctx.lineTo(MathFloor(x +this.w -this.spaceWidth/2) -.5, y +this.descent +.5);
    ctx.lineTo(MathFloor(x +this.w -this.spaceWidth) -.5, y +this.descent +.5);

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
      this.children[i].draw(ctx, x + this.style.fontSize/2, y-this.ascent+this.childAscent + (i%this.parts)*this.childHeight);
    }
    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath();
    ctx.moveTo(parseInt(x +this.style.fontSize*0.4) +0.5, y -this.ascent -1.5);
    ctx.lineTo(parseInt(x +this.style.fontSize*0.18) +0.5, y -this.ascent +3.5);
    ctx.lineTo(parseInt(x +this.style.fontSize*0.18) +0.5, y +this.descent -this.h/2 -4.5);
    ctx.lineTo(x, y +this.descent -this.h/2);
    ctx.lineTo(parseInt(x +this.style.fontSize*0.18) +0.5, y +this.descent -this.h/2 +4.5);
    ctx.lineTo(parseInt(x +this.style.fontSize*0.18) +0.5, y +this.descent -3.5);
    ctx.lineTo(parseInt(x +this.style.fontSize*0.4) +0.5, y +this.descent +1.5);

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

    var spaceW_2 = this.spaceWidth/2;

    if (this.value == "(") {
      ctx.font = this.styleString;

      ctx.fillText("(", x+spaceW_2, y);
      // ctx.moveTo(x +this.spaceWidth +.1, y -this.parent.ascent +this.h/10);
      // ctx.quadraticCurveTo(x +this.spaceWidth/5, y +this.parent.descent -this.parent.h/2,
      //                      x +this.spaceWidth, y +this.parent.descent -this.h/10);
      // ctx.stroke();
    }
    else if (this.value == ")") {
      ctx.font = this.styleString;

      ctx.fillText(")", x+spaceW_2, y);
      // ctx.moveTo(x +this.spaceWidth +.1, y -this.parent.ascent +this.h/10);
      // ctx.quadraticCurveTo(x +this.spaceWidth +4*this.spaceWidth/5, y +this.parent.descent -this.parent.h/2,
      //                      x +this.spaceWidth, y +this.parent.descent -this.h/10);
      // ctx.stroke();
    }
    else {
      ctx.font = this.styleString;

      ctx.fillText(this.value, x+spaceW_2, y);
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
        antChildX += this.children[i-1].w;
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
    // update the metric of the parent
    this.parent.getTextMetrics();
    // this.componentNumCtrl.expresion = this.evaluator.parser.parse("(" + x + "," + (y-this.parent.ascent) + "," + this.componentNumCtrl.w + "," + this.componentNumCtrl.h + ")");
    this.componentNumCtrl.expresion = this.evaluator.parser.parse("(" + x + "," + (y-this.ascent) + "," + this.componentNumCtrl.w + "," + this.componentNumCtrl.h + ")");
  }

  /**
   * Draw a space component
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.drawComponentSpace = function(ctx, x, y) {
    this.getTextMetrics();

    this.componentSpace.xExpr = this.evaluator.parser.parse(x.toString());
    this.componentSpace.yExpr = this.evaluator.parser.parse((y-this.parent.ascent).toString());
  }

  /**
   * Draw a unknown element
   * @param {2DContext} ctx the context to draw the text
   * @param {Number} x the x position of the text
   * @param {Number} y the y position of the text
   */
  descartesJS.RTFNode.prototype.draw = function(ctx, x, y) {
    console.log(">>> Dibujo desconocido ", this.nodeType);
    // this.children[0].draw(ctx, x, y);
  }

  /**
   *
   */
  descartesJS.RTFNode.prototype.toHTML = function(objectReferences) {
    return this.toHTMLAux(objectReferences);
  }  

  /**
   *
   */
  descartesJS.RTFNode.prototype.toHTMLAux = function(objectReferences) {
    var htmlDom = document.createDocumentFragment();
    var css = (this.style) ? this.style.toCSS() : "";
    var domNode;

    ////////////////////////////////////////////////////////////////////////////////////////////////
    if (this.nodeType === "textBlock") {
      domNode = richTextEditor.newTextBlock();
      for (var i=0, l=this.children.length; i<l; i++) {
        domNode.appendChild( this.children[i].toHTMLAux(objectReferences) );
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "textLineBlock") {
      domNode = richTextEditor.newTextLineBlock();
      for (var i=0, l=this.children.length; i<l; i++) {
        domNode.appendChild( this.children[i].toHTMLAux(objectReferences) );
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "text") {
      domNode = richTextEditor.newTextNode(css, this.value);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "newLine") {
      domNode = richTextEditor.newNewLine(css);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "hyperlink") {
      domNode = richTextEditor.newHyperLink(css, this.value, this.URL);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "formula") {
      domNode = richTextEditor.newFormula(css, formulaToHTML(this));
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "componentSpace") {
      objectReferences.spaces.push({ cID: "cID_"+this.value, value: this.componentSpace} );
      domNode = richTextEditor.newComponentSpace(this.componentSpace.w, this.value);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType === "componentNumCtrl") {
      objectReferences.ctrs.push({ cID: "cID_"+this.value, value: this.componentNumCtrl} );
      domNode = richTextEditor.newComponentNumCtrl(this.componentNumCtrl.w, this.componentNumCtrl.h, this.value);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    else {
      domNode = document.createDocumentFragment();
      console.log(">>>", this, "<<<");
    }

    htmlDom.appendChild(domNode);

    return htmlDom;
  }

  /**
   *
   */
  function formulaToHTML(formula) {
    var htmlDom = document.createDocumentFragment();
    var children_i;
    var domNode;

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // for empty parameters
    if (formula.children.length === 0) {
      domNode = richTextEditor.newFormulaTextNode(richTextEditor.narrowSpace);
      htmlDom.appendChild(domNode);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    for (var i=0; i<formula.children.length; i++) {
      children_i = formula.children[i];

      ////////////////////////////////////////////////////////////////////////////////////////////////
      if (children_i.nodeType === "text") {
        domNode = richTextEditor.newFormulaTextNode(children_i.value);
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "dynamicText") {
        domNode = richTextEditor.newDynamicTextNode(children_i);
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      // ToDo: componer los signos matematicos, para que no se puedan editar
      else if (children_i.nodeType === "mathSymbol") {
        domNode = richTextEditor.newMathSymbolNode(children_i.value);
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "superIndex") {
        domNode = richTextEditor.newSuperIndexNode(formulaToHTML(children_i));
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "subIndex") {
        domNode = richTextEditor.newSubIndexNode(formulaToHTML(children_i));
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "fraction") {
        domNode = richTextEditor.newFractionNode(formulaToHTML(children_i.children[0]), formulaToHTML(children_i.children[1]));
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "radical") {
        domNode = richTextEditor.newRadicalNode(formulaToHTML(children_i.children[0]), formulaToHTML(children_i.children[1]));
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "sum") {
        domNode = richTextEditor.newSumNode(formulaToHTML(children_i.children[1]), formulaToHTML(children_i.children[0]), formulaToHTML(children_i.children[2]));
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "integral") {
        domNode = richTextEditor.newIntegralNode(formulaToHTML(children_i.children[1]), formulaToHTML(children_i.children[0]), formulaToHTML(children_i.children[2]));
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "limit") {
        domNode = richTextEditor.newLimitNode(formulaToHTML(children_i.children[1]), formulaToHTML(children_i.children[0]), formulaToHTML(children_i.children[2]));
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "matrix") {
        var children = [];
        for (var ci=0, cl=children_i.children.length; ci<cl; ci++) {
          children.push( formulaToHTML(children_i.children[ci]) );
        }
        domNode = richTextEditor.newMatrixNode(children_i.rows, children_i.columns, children);
      }
      ////////////////////////////////////////////////////////////////////////////////////////////////
      else if (children_i.nodeType === "defparts") {
        var children = [];
        for (var ci=0; ci<children_i.parts; ci++) {
          children.push( formulaToHTML(children_i.children[ci]) );
        }
        domNode = richTextEditor.newCasesElementNode(children_i.parts, children);
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////
      else {
        domNode = document.createDocumentFragment();
        console.log(">>>", children_i, "<<<");
      }


      htmlDom.appendChild(domNode);
    }

    return htmlDom;
  }

  return descartesJS;
})(descartesJS || {});
