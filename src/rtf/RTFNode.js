/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var externalColor = "#000000";
  var externalDecimals = 2;
  var externalFixed = false;

  var radicalPathStr = "m 759,1 c -8,0 -15,4 -20,14 L 325,878 153,500 c -5,-11 -11,-14 -17,-9 L 2,596 c -5,4 17,30 22,26 l 65,-47 193,422 c 3,6 27,6 32,-4 L 773,40 V 1 Z";
  var radicalPath = new Path2D(radicalPathStr);
  radicalPath.svgData = radicalPathStr;
  var sigmaPathStr = "M 780,707 H 750 C 728,805 695,872 585,872 H 180 L 509,447 225,65 h 313 c 130,0 167,49 188,181 h 30 V 0 H 25 L 384,500 0,1000 h 729 z";
  var sigmaPath = new Path2D(sigmaPathStr);
  sigmaPath.svgData = sigmaPathStr;
  var integralPathStr = "m 150,828 c -21,88 -42,144 -83,144 -6,0 -9,-2 -9,-6 0,-9 15,-8 15,-34 0,-14 -13,-22 -27,-22 -24,0 -45,22 -45,51 0,20 21,39 56,39 97,0 141,-105 159,-176 L 375,181 c 23,-91 45,-154 89,-153 6,0 9,2 9,6 0,7 -15,13 -15,35 0,14 13,20 27,20 24,0 45,-22 45,-51 C 530,18 508,0 473,0 368,0 326,120 309,190 Z";
  var integralPath = new Path2D(integralPathStr);
  integralPath.svgData = integralPathStr;

  var factorMarginH = 0.075;
  var factorMarginV = 0.05;
  var factorPaddingH = 0.075;
  var factorPaddingV = 0.05;

  class TextNode {
    /**
     *
     */
    constructor(value, nodeType, style, evaluator) {
      this.type = "rtfNode";
      this.evaluator = evaluator;

      this.parent = null;
      this.children = [];
      this.metrics = { ascent:0, descent:0, h:0, w:0, x:0, y:0, offsetX:0, offsetY:0, marginX:0, marginY:0, paddingX:0, paddingY:0 };

      this.value = value;
      this.style = style;
      this.changeNodeType(nodeType);

      this.drawBorder = function() {};
    }

    changeNodeType(nodeType) {
      this.nodeType = nodeType;
      this.draw = null;
      
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

        // a text or new line or math symbol
        case ("text"):
        case ("newLine"):
        case ("mathSymbol"):
          this.draw = this.drawText;
          break;

        // a black space 
        case ("space"):
          this.draw = this.drawSpace;
          break;

        // a word element
        case ("word"):
          this.draw = this.drawWord;
          break;

        // a hyperlink
        case ("hyperlink"):
          this.draw = this.drawHyperlink;
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
     *
     */
    clone() {
      var cloneNode = new TextNode(this.value, this.nodeType, this.style.clone());

      for (var i=0, l=this.children.length; i<l; i++) {
        cloneNode.addChild(this.children[i].clone());
      }
      
      return cloneNode;
    }
    /**
     *
     */
    toStr() {
      var str = this.value;

      for (var i=0, l=this.children.length; i<l; i++) {
        str += " " + this.children[i].toStr();
      }
      
      return str;
    }

    /**
     * 
     */
    stringify() {
      var str = '{';

      str += '"NT":"' + this.nodeType + '",';

      str += '"V":"' + (this.value || "") + '",';

      str += '"C":[';
      for (var i=0, l=this.children.length; i<l; i++) {
        str += this.children[i].stringify() + ((i==l-1)?'':',');
      }
      str += '],';

      str += '"S":' + JSON.stringify(this.style);

      return str + '}';
    }

    /**
     * Add a child to the tree of nodes
     * @param {TextNode} child the child to add
     */
    addChild(node, removeFromParent) {
      if (removeFromParent && (node.parent !== null)) {
        node.parent.removeChild(node);
      }
      // add reference to the parent
      node.parent = this;
      this.children.push(node);
    }

    /**
     * 
     */
    removeChild(node) {
      var indexOf = this.children.indexOf(node);

      if (indexOf !== -1) {
        node.parent = null;
        this.children.splice(indexOf, 1);
      }
    }
    /**
     * 
     */
    getFirstTextNode() {
      var node = this;

      while (node.children.length > 0) {
        node = node.children[0];
      }

      return node;
    }
    /**
     * 
     */
    getLastTextNode() {
      var node = this;

      while (node.children.length > 0) {
        node = node.children[node.children.length-1];
      }

      return node;
    }
    /**
     * 
     */
    nextSibling() {
      if (this.parent) {
        var current = null;
        for (var i=0, l=this.parent.children.length; i<l; i++) {
          if (current) {
            return this.parent.children[i];
          }

          if (this.parent.children[i] === this) {
            current = true;
          }
        }
      }

      return null;
    }
    /**
     * 
     */
    prevSibling() {
      if (this.parent) {
        for (var i=0, l=this.parent.children.length-1; i<l; i++) {
          if (this.parent.children[i+1] === this) {
            return this.parent.children[i];
          }
        }
      }

      return null;
    }

    /**
     * 
     */
    queryAll(nodeType) {
      var elements = [];

      if (typeof(nodeType) === "string") {
        nodeType = new RegExp(nodeType);
      }

      for (var i=0, l=this.children.length; i<l; i++) {
        elements = elements.concat( this.children[i].queryAll(nodeType) );
      }

      if (this.nodeType.match(nodeType)) {
        elements.push(this);
      }

      return elements;
    }

    /**
     * 
     */
    insertBefore(referenceNode, newNode) {
      var indexOf = this.children.indexOf(referenceNode);

      if (indexOf !== -1) {
        newNode.parent = this;
        this.children.splice(indexOf, 0, newNode);
      }
    }
    /**
     * 
     */
    insertAfter(referenceNode, newNode) {
      var indexOf = this.children.indexOf(referenceNode);

      if (indexOf !== -1) {
        newNode.parent = this;
        this.children.splice(indexOf+1, 0, newNode);
      }
    }

    /**
     * 
     */
    normalize() {
      var emptyNodes = this.queryAll(/textLineBlock|formula|numerator|denominator|superIndex|subIndex|index|subIndex|radicand|from|to|what|element/);
      
      for (var i=0, l=emptyNodes.length; i<l; i++) {
        if (emptyNodes[i].children.length === 0) {
          emptyNodes[i].addChild(new TextNode("", "text", emptyNodes[i].style));
        }
      }

      var nodesWithoutSiblings = this.queryAll(/formula|fraction|superIndex|subIndex|radical|sum|integral|limit|matrix|defparts|dynamicText|componentNumCtrl|componentSpace/);
      var nodesWithoutSiblings_i;

      for (var i=0, l=nodesWithoutSiblings.length; i<l; i++) {
        nodesWithoutSiblings_i = nodesWithoutSiblings[i];
        if ( (nodesWithoutSiblings_i.prevSibling() === null) || ((nodesWithoutSiblings_i.prevSibling() !== null) && (nodesWithoutSiblings_i.prevSibling().nodeType !== "text")) ) {
          nodesWithoutSiblings_i.parent.insertBefore(nodesWithoutSiblings_i, new TextNode("", "text", nodesWithoutSiblings_i.parent.style));
        }
        if ( (nodesWithoutSiblings_i.nextSibling() === null) || ((nodesWithoutSiblings_i.nextSibling() !== null) && (nodesWithoutSiblings_i.nextSibling().nodeType !== "text")) ) {
          nodesWithoutSiblings_i.parent.insertAfter(nodesWithoutSiblings_i, new TextNode("", "text", nodesWithoutSiblings_i.parent.style));
        }
      }

      return this;
    }

    /**
     * 
     */
    removeEmptyText() {
      var textNodes = this.queryAll(/text/);
      for (var i=0, l=textNodes.length; i<l; i++) {
        if ((textNodes[i].value === "") && (textNodes[i].parent)) {
          textNodes[i].parent.removeChild(textNodes[i]);
        }
      }
    }

    /**
     * 
     */
    adjustFontSize(insideFormula) {
      var fontSize = this.style.size;

      if (this.nodeType === "formula") {
        insideFormula = true;
      }

      for (var i=0, l=this.children.length; i<l; i++) {
        if ((this.children[i].nodeType === "text") && (insideFormula)) {
          this.children[i].style.size = fontSize;
          this.children[i].styleString = this.children[i].style.toString();
        }

        else if (this.children[i].nodeType === "index") {
          this.children[i].style.size = Math.max( parseInt(fontSize - fontSize*0.5), 8 );
          this.children[i].styleString = this.children[i].style.toString();
          this.children[i].adjustFontSize(true);
        }

        else if (
          (this.children[i].nodeType === "to") ||
          (this.children[i].nodeType === "from")
        ) {
          this.children[i].style.size = Math.max( parseInt(fontSize - fontSize*0.2), 8 );
          this.children[i].styleString = this.children[i].style.toString();
          this.children[i].adjustFontSize(true);
        }

        else if (
          (this.children[i].nodeType === "numerator") ||
          (this.children[i].nodeType === "denominator")
        ) {
          this.children[i].style.size = Math.max( parseInt(fontSize - fontSize*0.1), 8 );
          this.children[i].styleString = this.children[i].style.toString();
          this.children[i].adjustFontSize(true);
        }      

        else if (
          (this.children[i].nodeType === "subIndex") ||
          (this.children[i].nodeType === "superIndex")
        ) {
          this.children[i].style.size = Math.max( parseInt(fontSize - fontSize*0.33), 8 );
          this.children[i].styleString = this.children[i].style.toString();
          this.children[i].adjustFontSize(true);
        }

        else {
          if (insideFormula) {
            this.children[i].style.size = fontSize;
            this.children[i].styleString = this.children[i].style.toString();
          }
          this.children[i].adjustFontSize(insideFormula);
        }
      }
    }

    /**
     * 
     */
    propagateStyle(prop, value) {
      this.style[prop] = value;
      this.styleString = this.style.toString();

      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].propagateStyle(prop, value);
      }
    }

    /**
     * 
     */
    update(x, y, decimals, fixed, align, anchor, color, width) {
      externalDecimals = decimals;
      externalFixed = fixed;
      externalColor = color;

      this.metrics.w = this.metrics.h = 0;

      var oldY = y;

      // word wrap, find the new lines of the text
      if (width >= 20) {
        for (var i=0; i<this.children.length; i++) {
          this.children[i].breakLines(width);
        }
      }

      var self = this;
      var lineSep;
      var line;

      for (var i=0, l=this.children.length; i<l; i++) {
        line = this.children[i];
        line.updateLine();

        line.metrics.offsetX = x;

        line.metrics.y = y;
        y += parseInt(line.metrics.ascent +0.5);
        line.metrics.offsetY = y;
        
        lineSep = parseInt(line.metrics.descent +0.5) +parseInt(1.5 + line.style.size*0.05);
        y += lineSep;

        self.metrics.h += line.metrics.h;
        self.metrics.w = Math.max(self.metrics.w, line.metrics.w);
      };

      y = oldY;
      ////////////////////////////////////////////////////
      // anchor
      anchor = anchor || "";
      // horizontal left
      if (anchor.match("right")) {
        x -= this.metrics.w;
      }
      // horizontal center
      else if (anchor.match("_center")) {
        x -= this.metrics.w/2;
      }

      // vertical bottom
      if (anchor.match("bottom")) {
        y -= this.metrics.h;
      }
      // vertical center
      else if (anchor.match("center_")) {
        y -= this.metrics.h/2;
      }
      ////////////////////////////////////////////////////


      var lines = this.children;
      for (var i=0, l=lines.length; i<l; i++) {
        if (lines[i].style.align === "left") {
          lines[i].metrics.offsetX = x;
        }
        else if (lines[i].style.align === "right") {
          lines[i].metrics.offsetX = x + this.metrics.w - lines[i].metrics.w;
        }
        else if (lines[i].style.align === "center") {
          lines[i].metrics.offsetX = x + (this.metrics.w - lines[i].metrics.w)/2;
        }
        else if ((lines[i].style.align === "justify") && (width >= 20)) {
          lineValue = (i<l-1) ? lines[i+1].value : null;
          lines[i].metrics.offsetX = x;

          if (lineValue === "wrap") {
            lines[i].justifyAux(width);
          }

        }

        lines[i].metrics.y = y;
        y += parseInt(lines[i].metrics.ascent +0.5);
        lines[i].metrics.offsetY = y;
        
        lineSep = parseInt(lines[i].metrics.descent +0.5) +parseInt(1.5 + lines[i].style.size*0.05);
        y += lineSep;
      }

    }

    /**
     * 
     */
    breakLines(width) {
      var thisLine = this;
      var children_i;
      var lineWidth = 0;
      var finish = false;
      var childrenArray = [];

      for (var i=0, l=this.children.length; i<l; i++) {
        children_i = this.children[i];

        if (!finish) {
          if ((children_i.nodeType === "text") || (children_i.nodeType === "space")) {
            descartesJS.ctx.font = children_i.style.toString();
            children_i.metrics.w = descartesJS.ctx.measureText(children_i.value).width;
          }
          else if (children_i.nodeType === "word") {
            children_i.updateLine();
          }
          else if (children_i.nodeType === "formula") {
            children_i.updateFormula();
          }

          lineWidth += children_i.metrics.w;

          if ((lineWidth > width) && (children_i.nodeType !== "space") && (i>0)) {
            finish = true;
            childrenArray.push(children_i);
          }
        }

        else {
          childrenArray.push(children_i);
        }
      }

      if (childrenArray.length > 0) {
        var newLine = new TextNode("wrap", "textLineBlock", this.style.clone(), null);
        this.parent.insertAfter(thisLine, newLine);

        for (var i=0, l=childrenArray.length; i<l; i++) {
          if (childrenArray[i].parent) {
            childrenArray[i].parent.removeChild(childrenArray[i]);
          }
          newLine.addChild(childrenArray[i]);
        }
      }
    }

    /**
     * 
     */
    updateLine(spaceWidth) {
      var thisLine = this;

      if ((this.nodeType === "textLineBlock") || (this.nodeType === "word")) {
        this.metrics.w = 0;
        this.metrics.ascent = 0;
        this.metrics.descent = 0;

        var displaceX = 0;
        var children = this.children;
        var children_i;

        for (var i=0, l=children.length; i<l; i++) {
          children_i = children[i];

          //////////////////////////////////////////////////////////
          if (children_i.nodeType === "text") {
            descartesJS.ctx.font = children_i.style.toString();
            var value = (children_i.value !== "") ? children_i.value : "\u200A";
            children_i.metrics = getFontMetrics(descartesJS.ctx.font);
            children_i.metrics.w = descartesJS.ctx.measureText(value).width;

            children_i.metrics.offsetX = displaceX;

            Object.defineProperties(children_i.metrics, {
              "x" : { get : function() { return thisLine.metrics.offsetX + this.offsetX } },
              "y" : { get : function() { return thisLine.metrics.offsetY + this.offsetY; } }
            });
          }

          //////////////////////////////////////////////////////////
          if (children_i.nodeType === "space") {
            descartesJS.ctx.font = children_i.style.toString();
            children_i.metrics = getFontMetrics(descartesJS.ctx.font);
            if (i === l-1) {
              children_i.metrics.w = 0;
            }
            else if (spaceWidth) {
              children_i.metrics.w = spaceWidth;
            }
            else {
              children_i.metrics.w = descartesJS.ctx.measureText(" ").width;
            }
    
            children_i.metrics.offsetX = displaceX;
            
            Object.defineProperties(children_i.metrics, {
              "x" : { get : function() { return thisLine.metrics.offsetX + this.offsetX; } },
              "y" : { get : function() { return thisLine.metrics.offsetY + this.offsetY; } }
            });
          }

          //////////////////////////////////////////////////////////
          else if (children_i.nodeType === "word") {
            children_i.updateLine();
    
            children_i.metrics.offsetX_aux = displaceX;
    
            Object.defineProperties(children_i.metrics, {
              "offsetX" : { get : function() { return thisLine.metrics.offsetX + this.offsetX_aux; } },
              "offsetY" : { get : function() { return thisLine.metrics.offsetY; } },
            });
          }

          //////////////////////////////////////////////////////////
          if (children_i.nodeType === "hyperlink") {
            descartesJS.ctx.font = children_i.styleString;
            var value = (children_i.value !== "") ? children_i.value : "\u200A";
            children_i.metrics = getFontMetrics(descartesJS.ctx.font);
            children_i.metrics.w = descartesJS.ctx.measureText(value).width;

            children_i.metrics.offsetX = displaceX;

            Object.defineProperties(children_i.metrics, {
              "x" : { get : function() { return thisLine.metrics.offsetX + this.offsetX } },
              "y" : { get : function() { return thisLine.metrics.offsetY; } }
            });

            ////
            if (!children_i.clickCatcher) {
              children_i.clickCatcher = descartesJS.newHTML("div", {
                style : "position:absolute;width:" + children_i.metrics.w + "px;height:" + children_i.metrics.h + "px;cursor:pointer;",
              });
              children_i.clickCatcher.rtfNode = children_i;
              children_i.clickCatcher.action = new descartesJS.OpenURL(this.evaluator.parent, children_i.URL);
          
              children_i.clickCatcher.addEventListener("click", function(evt) {
                this.rtfNode.click = true;
                this.action.execute();
                this.rtfNode.draw(this.rtfNode.ctx);
              });
            }
            ////
          }

          //////////////////////////////////////////////////////////
          if (children_i.nodeType === "componentNumCtrl") {
            children_i.componentNumCtrl = this.evaluator.parent.getControlByCId(children_i.value);

            descartesJS.ctx.font = children_i.styleString;
            children_i.metrics = getFontMetrics(descartesJS.ctx.font);
            children_i.metrics.w = children_i.componentNumCtrl.w;
            children_i.metrics.h = children_i.componentNumCtrl.h;

            children_i.metrics.offsetX = displaceX;

            Object.defineProperties(children_i.metrics, {
              "x" : { get : function() { return thisLine.metrics.offsetX + this.offsetX } },
              "y" : { get : function() { return thisLine.metrics.offsetY; } }
            });
          }

          //////////////////////////////////////////////////////////
          if (children_i.nodeType === "componentSpace") {
            children_i.componentSpace = this.evaluator.parent.getSpaceByCId(children_i.value);

            descartesJS.ctx.font = children_i.styleString;
            children_i.metrics = getFontMetrics(descartesJS.ctx.font);
            children_i.metrics.w = children_i.componentSpace.w;
            children_i.metrics.h = children_i.componentSpace.h;

            children_i.metrics.offsetX = displaceX;

            Object.defineProperties(children_i.metrics, {
              "x" : { get : function() { return thisLine.metrics.offsetX + this.offsetX } },
              "y" : { get : function() { return thisLine.metrics.offsetY; } }
            });
          }

          //////////////////////////////////////////////////////////
          else if (children_i.nodeType === "formula") {
            children_i.updateFormula();

  // children_i.metrics.marginX = parseInt(1.5 + this.style.size*factorMarginH);
  // children_i.metrics.marginY = parseInt(1.5 + this.style.size*factorMarginV);

  // children_i.metrics.paddingX = parseInt(1.5 + this.style.size*factorPaddingH);
  // children_i.metrics.paddingY = parseInt(1.5 + this.style.size*factorPaddingV);

            children_i.metrics.offsetX_aux = displaceX;

            Object.defineProperties(children_i.metrics, {
              "x" : { get : function() { return this.offsetX; } },
              "y" : { get : function() { return this.offsetY; } },

              "offsetX" : { get : function() { return thisLine.metrics.offsetX +this.marginX +this.offsetX_aux; } },
              "offsetY" : { get : function() { return thisLine.metrics.offsetY; } }
            });

            children_i.metrics.w += 2*children_i.metrics.paddingX;
            children_i.metrics.ascent += children_i.metrics.paddingY;
            children_i.metrics.descent += children_i.metrics.paddingY;
            children_i.metrics.h += 2*children_i.metrics.paddingY;

            displaceX += 2*children_i.metrics.marginX;
          }

          // line metrics
          this.metrics.w += children_i.metrics.w +2*children_i.metrics.marginX;
          this.metrics.ascent = Math.max(this.metrics.ascent, children_i.metrics.ascent);
          this.metrics.descent = Math.max(this.metrics.descent, children_i.metrics.descent);
          displaceX += children_i.metrics.w;
        }

        this.metrics.h = this.metrics.ascent + this.metrics.descent;
      }
    }
    /**
     * 
     */
    updateFormula() {
      var thisFormula = this;

      this.metrics = { ascent:0, descent:0, h:0, w:0, x:0, y:0, offsetX:0, offsetY:0, marginX:0, marginY:0, paddingX:0, paddingY:0 };

      var children = this.children;
      var children_i;
      var displaceX = 0;

      var prevChild = { metrics : { ascent:0, descent:0, h:0, w:0, x:0, y:0, offsetX:0, offsetY:0, marginX:0, marginY:0, paddingX:0, paddingY:0 } };

      for (var i=0, l=children.length; i<l; i++) {
        children_i = children[i];

        //////////////////////////////////////////////////////////
        if (children_i.nodeType === "text") {
          descartesJS.ctx.font = children_i.style.toString();
          var value = (children_i.value !== "") ? children_i.value : "\u200A";
          children_i.metrics = getFontMetrics(descartesJS.ctx.font);
          children_i.metrics.w = descartesJS.ctx.measureText(value).width;

          children_i.metrics.offsetX = displaceX;

          Object.defineProperties(children_i.metrics, {
            "x" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.offsetX ; } },
            "y" : { get : function() { return thisFormula.metrics.offsetY; } }
          });

          displaceX += thisFormula.metrics.marginX;
        }

        
        //////////////////////////////////////////////////////////
        else if (children_i.nodeType === "dynamicText") {
          var decimals = (children_i.decimals === undefined) ? externalDecimals : children_i.evaluator.eval(children_i.decimals);
          var fixed = (children_i.fixed === undefined) ? externalFixed : children_i.fixed;
      
          var textTemp = children_i.evaluator.eval(children_i.value);
      
          // if the text is a number
          if (parseFloat(textTemp).toString() === textTemp.toString()) {
            textTemp = (fixed) ? parseFloat(textTemp).toFixed(decimals) : descartesJS.removeNeedlessDecimals((parseFloat(textTemp).toFixed(decimals)));
            textTemp = (""+textTemp).replace(".", children_i.decimal_symbol);
          }
          
          children_i.evalValue = textTemp;

          descartesJS.ctx.font = children_i.style.toString();
          children_i.metrics = getFontMetrics(descartesJS.ctx.font);

          children_i.metrics.marginX = parseInt(1.5 + this.style.size*factorMarginH);
          children_i.metrics.paddingX = parseInt(1.5 + this.style.size*factorPaddingH);

          children_i.metrics.w = descartesJS.ctx.measureText(textTemp).width + 2*children_i.metrics.paddingX;

          children_i.metrics.offsetX_aux = displaceX;

          Object.defineProperties(children_i.metrics, {
            "x" : { get : function() { return this.offsetX; } }, 
            "y" : { get : function() { return this.offsetY; } }, 

            "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.offsetX_aux +this.marginX; } }, 
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
          });

          displaceX += 2*children_i.metrics.marginX;
        }

        //////////////////////////////////////////////////////////
        if (children_i.nodeType === "superIndex") {
          var superIndex = children_i;
          superIndex.updateFormula();

          superIndex.metrics.marginX = 0*parseInt(1.5 + this.style.size*factorMarginH);
          superIndex.metrics.paddingX = 0*parseInt(1.5 + this.style.size*factorPaddingH);
          superIndex.metrics.paddingY = parseInt(1.5 + this.style.size*factorPaddingV);

          superIndex.metrics.offsetX_aux = displaceX;

          superIndex.metrics.prevChild = prevChild;

          Object.defineProperties(superIndex.metrics, {
            "x" : { get : function() { return this.offsetX; } }, 
            "y" : { get : function() { return this.offsetY; } }, 

            "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.offsetX_aux +this.marginX; } }, 
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY -this.descent +this.prevChild.metrics.descent -parseInt(2*this.prevChild.metrics.h/7); } },
          });

          superIndex.metrics.w += 2*superIndex.metrics.paddingX;
          superIndex.metrics.ascent += superIndex.metrics.paddingY;
          superIndex.metrics.descent += superIndex.metrics.paddingY;
          superIndex.metrics.h += 2*superIndex.metrics.paddingY;

          this.metrics.ascent = superIndex.metrics.descent - superIndex.metrics.prevChild.metrics.descent + parseInt(2*superIndex.metrics.prevChild.metrics.h/7) + superIndex.metrics.ascent;

          displaceX += 2*superIndex.metrics.marginX;
        }

        //////////////////////////////////////////////////////////
        else if (children_i.nodeType === "subIndex") {
          var subIndex = children_i;
          subIndex.updateFormula();

          subIndex.metrics.marginX = parseInt(1.5 + 1.25*this.style.size*factorMarginH);
          subIndex.metrics.paddingX = 0*parseInt(1.5 + 0.25*this.style.size*factorPaddingH);
          subIndex.metrics.paddingY = parseInt(1.5 + this.style.size*factorPaddingV);

          subIndex.metrics.offsetX_aux = displaceX;

          subIndex.metrics.prevChild = prevChild;

          Object.defineProperties(subIndex.metrics, {
            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.offsetX_aux +0*this.marginX; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY +this.ascent +subIndex.metrics.prevChild.metrics.descent -parseInt(4*subIndex.metrics.prevChild.metrics.h/7); } },
          });

          // subIndex.metrics.w += 2*subIndex.metrics.paddingX;
          subIndex.metrics.w += subIndex.metrics.paddingX;
          subIndex.metrics.ascent += subIndex.metrics.paddingY;
          subIndex.metrics.descent += subIndex.metrics.paddingY;
          subIndex.metrics.h += 2*subIndex.metrics.paddingY;

          this.metrics.descent = subIndex.metrics.ascent +subIndex.metrics.prevChild.metrics.descent -parseInt(4*subIndex.metrics.prevChild.metrics.h/7) +subIndex.metrics.descent;

          // displaceX += 2*subIndex.metrics.marginX;
          displaceX += subIndex.metrics.marginX;
        }

        //////////////////////////////////////////////////////////
        else if (children_i.nodeType === "fraction") {
          var fraction = children_i;

          fraction.updateFormula();

          var components = fraction.children;
          var num = components[0];
          var den = components[1];

          fraction.metrics.marginX = parseInt(1.5 + this.style.size*factorMarginH);
          fraction.metrics.paddingX = 0* parseInt(1.5 + this.style.size*factorPaddingH);
          fraction.metrics.paddingY = 0* parseInt(1.5 + this.style.size*factorPaddingV);

          var maxWidth = Math.max(num.metrics.w, den.metrics.w) +2*fraction.metrics.paddingX;

          fraction.metrics.prevChild = prevChild;

          fraction.metrics.offsetX_aux = displaceX;
          var offsetY = parseInt(-prevChild.metrics.descent +4*prevChild.metrics.h/9);

          // fraction position
          Object.defineProperties(fraction.metrics, {
            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY +offsetY; } },

            "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.marginX +this.offsetX_aux; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY -offsetY; } },
          });

          // num position
          Object.defineProperties(num.metrics, {
            "parent" : { value : fraction },
            "maxWidth" : { value : maxWidth },

            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return this.parent.metrics.offsetX + parseInt((this.maxWidth - this.w)/2); } },
            "offsetY" : { get : function() { return this.parent.metrics.offsetY - this.descent -this.parent.metrics.paddingY; } },
          });

          // den position
          Object.defineProperties(den.metrics, {
            "parent" : { value : fraction },
            "maxWidth" : { value : maxWidth },

            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return this.parent.metrics.offsetX + parseInt((this.maxWidth - this.w)/2); } },
            "offsetY" : { get : function() { return this.parent.metrics.offsetY + this.ascent + this.parent.metrics.paddingY; } },
          });

          fraction.metrics.w = maxWidth;
          fraction.metrics.ascent = num.metrics.h +offsetY +2*fraction.metrics.paddingY;
          fraction.metrics.descent = den.metrics.h -offsetY +2*fraction.metrics.paddingY;
          fraction.metrics.h = num.metrics.h + den.metrics.h +4*fraction.metrics.paddingY;

          displaceX += 2*fraction.metrics.marginX;
        }

        //////////////////////////////////////////////////////////
        else if (children_i.nodeType === "radical") {
          var radical = children_i;

          radical.updateFormula();

          var components = radical.children;
          var index = components[0];
          var radicand = components[1];

          radical.metrics.marginX = parseInt(1.5 + this.style.size*factorMarginH);
          radical.metrics.paddingX = parseInt(1.5 + this.style.size*factorPaddingH);
          radical.metrics.paddingY = parseInt(1.5 + this.style.size*factorPaddingV);

          radical.metrics.offsetX_aux = displaceX;
          // radical position
          Object.defineProperties(radical.metrics, {
            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.marginX +this.offsetX_aux; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
          });

          //////////////////////////////////
          // w=772, h=1000 radicalSign
          var fontSize = radical.style.size;
          radical.radicalSign = {
            w : fontSize,
            scaleX : fontSize/722,
            scaleY : radicand.metrics.h/1000,
          };
          var displaceIndex = parseInt(index.metrics.w - 2*radical.radicalSign.w/3);

          Object.defineProperties(radical.radicalSign, {
            "parent" : { value : radical },
            "displaceIndex" : { value : displaceIndex },

            "x" : { get: function() { return this.parent.metrics.offsetX +this.parent.metrics.paddingX + Math.max(this.displaceIndex, 0); } },
            "y" : { get: function() { return thisFormula.metrics.offsetY -radicand.metrics.ascent; } },
          });

          // index position
          Object.defineProperties(index.metrics, {
            "parent" : { value : radical },
            "displaceIndex" : { value : displaceIndex },
            "fontSize" : { value : fontSize },

            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return this.parent.metrics.offsetX +this.parent.metrics.paddingX + Math.max(this.displaceIndex, 0) -this.displaceIndex; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY -this.descent -2*this.fontSize/5; } },
          });

          // radicand position
          Object.defineProperties(radicand.metrics, {
            "parent" : { value : radical },
            "displaceIndex" : { value : displaceIndex },

            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return this.parent.metrics.offsetX +this.parent.metrics.paddingX +this.parent.radicalSign.w +Math.max(this.displaceIndex, 0) } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
          });
          
          var indexWidth = (index.metrics.w < 2*radical.radicalSign.w/3) ? radical.radicalSign.w : parseInt(index.metrics.w+radical.radicalSign.w/3);

          radical.metrics.w = indexWidth +2*radical.metrics.paddingX + radicand.metrics.w;
          radical.metrics.ascent = Math.max(radicand.metrics.ascent, (index.metrics.h +2*fontSize/5)) +radical.metrics.paddingY;
          radical.metrics.descent = radicand.metrics.descent +radical.metrics.paddingY;
          radical.metrics.h = radical.metrics.ascent + radical.metrics.descent;

          displaceX += 2*radical.metrics.marginX;
        }

        //////////////////////////////////////////////////////////
        else if (children_i.nodeType === "sum") {
          var sum = children_i;

          sum.updateFormula();

          var components = sum.children;
          var sumFrom = components[0];
          var sumTo = components[1];
          var sumWhat = components[2];

          sum.metrics.marginX = parseInt(1.5 + this.style.size*factorMarginH);
          sum.metrics.paddingX = parseInt(1.5 + this.style.size*factorPaddingH);
          sum.metrics.paddingY = parseInt(1.5 + this.style.size*factorPaddingV);

          sum.metrics.offsetX_aux = displaceX;

          // sum position
          Object.defineProperties(sum.metrics, {
            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.marginX +this.offsetX_aux; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
          });

          //////////////////////////////////
          // w=780, h=1000
          descartesJS.ctx.font = children_i.style.toString();
          var tmpMetric = getFontMetrics(descartesJS.ctx.font);
          
          var sigmaHeight = parseInt(tmpMetric.h*1.2);
          var sigmaWidth = parseInt(0.5 +sigmaHeight*780/1000);
          sum.sigmaSign = {
            w : sigmaWidth,
            h : sigmaHeight,
            scale : sigmaHeight/1000,
          };
          var sumWidth = Math.max(sumTo.metrics.w, sumFrom.metrics.w, sum.sigmaSign.w);

          sum.sigmaSign.parent = sum;
          Object.defineProperties(sum.sigmaSign, {
            "sumWidth" : { value : sumWidth },

            "x" : { get: function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX +parseInt((this.sumWidth - this.w)/2); } },
            "y" : { get: function() { return thisFormula.metrics.offsetY +tmpMetric.descent -(this.h +tmpMetric.h)/2; } },
          });

          var newBaselineTo = tmpMetric.descent -sumTo.metrics.descent -(sigmaHeight +tmpMetric.h)/2 -sum.metrics.paddingY;

          // sumTo position
          Object.defineProperties(sumTo.metrics, {
            "parent" : { value : sum },
            "sumWidth" : { value : sumWidth },
            "newBaselineTo" : { value : newBaselineTo },

            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX +parseInt((this.sumWidth - this.w)/2); } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY + this.newBaselineTo; } },
          });

          var newBaselineFrom = sumFrom.metrics.ascent +tmpMetric.descent +(sigmaHeight -tmpMetric.h)/2 +sum.metrics.paddingY;

          // sumFrom position
          Object.defineProperties(sumFrom.metrics, {
            "parent" : { value : sum },
            "sumWidth" : { value : sumWidth },
            "newBaselineFrom" : { value : newBaselineFrom },

            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX +parseInt((this.sumWidth - this.w)/2); } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY + this.newBaselineFrom; } },
          });

          // sumWhat position
          Object.defineProperties(sumWhat.metrics, {
            "parent" : { value : sum },
            "sumWidth" : { value : sumWidth },

            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return this.parent.metrics.offsetX + 2*this.parent.metrics.paddingX +this.sumWidth; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
          });

          sum.metrics.w = sumWidth + sumWhat.metrics.w +3*sum.metrics.paddingX;
          sum.metrics.ascent = Math.max( sumWhat.metrics.ascent, (-newBaselineTo +sumTo.metrics.ascent) ) +sum.metrics.paddingY;
          sum.metrics.descent = Math.max( sumWhat.metrics.descent, (newBaselineFrom +sumFrom.metrics.descent) ) +sum.metrics.paddingY;
          sum.metrics.h = sum.metrics.ascent + sum.metrics.descent;

          displaceX += 2*sum.metrics.marginX;
        }
        
        //////////////////////////////////////////////////////////
        else if (children_i.nodeType === "integral") {
          var integral = children_i;

          integral.updateFormula();

          var components = integral.children;
          var integralFrom = components[0];
          var integralTo = components[1];
          var integralWhat = components[2];

          integral.metrics.marginX = parseInt(1.5 + this.style.size*factorMarginH);
          integral.metrics.paddingX = parseInt(1.5 + this.style.size*factorPaddingH);
          integral.metrics.paddingY = parseInt(1.5 + this.style.size*factorPaddingV);

          integral.metrics.offsetX_aux = displaceX;
          // integral position
          Object.defineProperties(integral.metrics, {
            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.marginX +this.offsetX_aux; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
          });

          //////////////////////////////////
          // w=529, h=1000
          descartesJS.ctx.font = children_i.style.toString();
          var tmpMetric = getFontMetrics(descartesJS.ctx.font);

          var integralHeight = parseInt(tmpMetric.h*1.2);
          var integralWidth = parseInt(10.5 +integralHeight*529/1000);
          integral.sign = {
            w : integralWidth,
            h : integralHeight,
            scale : integralHeight/1000,
          };

          integral.sign.parent = integral;
          Object.defineProperties(integral.sign, {
            "x" : { get: function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX; } },
            "y" : { get: function() { return thisFormula.metrics.offsetY +tmpMetric.descent -(this.h +tmpMetric.h)/2; } },
          });

          var newBaselineTo = tmpMetric.descent -(integralHeight + tmpMetric.h)/2 -integralTo.metrics.descent +integralHeight/3;

          // integralTo position
          Object.defineProperties(integralTo.metrics, {
            "parent" : { value : integral },
            "integralWidth" : { value : integralWidth },
            "newBaselineTo" : { value : newBaselineTo },

            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX +parseInt(4*this.integralWidth/5); } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY + this.newBaselineTo; } },
          });

          var newBaselineFrom = tmpMetric.descent +integralFrom.metrics.ascent/2;

          // integralFrom position
          Object.defineProperties(integralFrom.metrics, {
            "parent" : { value : integral },
            "integralWidth" : { value : integralWidth },
            "newBaselineFrom" : { value : newBaselineFrom },

            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX +parseInt(2*this.integralWidth/5); } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY + this.newBaselineFrom; } },
          });

          var whatDisplace = Math.max( parseInt(4*integralWidth/5) + integralTo.metrics.w, parseInt(2*integralWidth/5 + integralFrom.metrics.w) ) +integral.metrics.paddingX;

          // integralWhat position
          Object.defineProperties(integralWhat.metrics, {
            "parent" : { value : integral },
            "whatDisplace" : { value : whatDisplace },

            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX +this.whatDisplace; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
          });

          integral.metrics.w = whatDisplace + integralWhat.metrics.w +2*integral.metrics.paddingX;
          integral.metrics.ascent = Math.max( integralWhat.metrics.ascent, (-newBaselineTo +integralTo.metrics.ascent) ) +integral.metrics.paddingY;
          integral.metrics.descent = Math.max( integralWhat.metrics.descent, (newBaselineFrom +integralFrom.metrics.descent), integralHeight -integral.metrics.ascent ) +integral.metrics.paddingY;
          integral.metrics.h = Math.max(integral.metrics.ascent + integral.metrics.descent, integralHeight);

          displaceX += 2*integral.metrics.marginX;
        }

        //////////////////////////////////////////////////////////
        else if (children_i.nodeType === "limit") {
          var limit = children_i;

          limit.updateFormula();

          var components = limit.children;
          var limitFrom = components[0];
          var limitTo = components[1];
          var limitWhat = components[2];

          limit.metrics.marginX = parseInt(1.5 + this.style.size*factorMarginH);
          limit.metrics.paddingX = parseInt(1.5 + this.style.size*factorPaddingH);
          limit.metrics.paddingY = parseInt(1.5 + this.style.size*factorPaddingV);

          limit.metrics.offsetX_aux = displaceX;
          // limit position
          Object.defineProperties(limit.metrics, {
            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.marginX +this.offsetX_aux; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
          });

          //////////////////////////////////
          descartesJS.ctx.font = children_i.style.toString();
          var tmpMetric = getFontMetrics(descartesJS.ctx.font);
          var limitTextWidth = parseInt(0.5 + descartesJS.ctx.measureText("lím").width);
          var arrowWidth = parseInt(0.5 + descartesJS.ctx.measureText("→").width);

          limitWidth = Math.max(limitTextWidth, limitFrom.metrics.w + arrowWidth + limitTo.metrics.w);

          limit.limitText = {
            parent: limit,
          };
          Object.defineProperties(limit.limitText, {
            "limitWidth" : { value : limitWidth },
            "limitTextWidth" : { value : limitTextWidth },

            "x" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX + (this.limitWidth - this.limitTextWidth)/2 } },
          });

          var newBaseline = tmpMetric.descent +Math.max(limitFrom.metrics.ascent, limitTo.metrics.ascent, 2*tmpMetric.ascent/3) +limit.metrics.paddingY;

          limit.limitArrow = {
            parent: limit,
          };
          Object.defineProperties(limit.limitArrow, {
            "newBaseline" : { value : newBaseline },

            "x" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX +limitFrom.metrics.w} },
            "y" : { get : function() { return thisFormula.metrics.offsetY + this.newBaseline; } },
          });

          // limitFrom position
          Object.defineProperties(limitFrom.metrics, {
            "parent" : { value : limit },
            "newBaseline" : { value : newBaseline },

            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY + this.newBaseline; } },
          });

          // limitTo position
          Object.defineProperties(limitTo.metrics, {
            "parent" : { value : limit },
            "arrowWidth" : { value : arrowWidth },
            "newBaseline" : { value : newBaseline },

            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },
            
            "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX + limitFrom.metrics.w + this.arrowWidth; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY + this.newBaseline; } },
          });

          // limitWhat position
          Object.defineProperties(limitWhat.metrics, {
            "parent" : { value : limit },
            "limitWidth" : { value : limitWidth },

            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },
            
            "offsetX" : { get : function() { return this.parent.metrics.offsetX + 2*this.parent.metrics.paddingX + this.limitWidth; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
          });

          limit.metrics.w = limitWidth + limitWhat.metrics.w +3*limit.metrics.paddingX;
          limit.metrics.ascent = Math.max(limitWhat.metrics.ascent, tmpMetric.ascent) +limit.metrics.paddingY;
          limit.metrics.descent = newBaseline + Math.max(limitFrom.metrics.descent, limitTo.metrics.descent) +limit.metrics.paddingY;
          limit.metrics.h = limit.metrics.ascent + limit.metrics.descent;

          displaceX += 2*limit.metrics.marginX;
        }

        //////////////////////////////////////////////////////////
        else if (children_i.nodeType === "matrix") {
          var matrix = children_i;

          matrix.updateFormula();
          
          var components = matrix.children;
          var rows = matrix.rows;
          var cols = matrix.columns;

          matrix.metrics.marginX = parseInt(1.5 + this.style.size*factorMarginH);
          matrix.metrics.paddingX = parseInt(1.5 + this.style.size*factorPaddingH);
          matrix.metrics.paddingY = parseInt(1.5 + this.style.size*factorPaddingV);

          matrix.metrics.offsetX_aux = displaceX;
          // matrix position
          Object.defineProperties(matrix.metrics, {
            "x" : { get : function() { return this.offsetX; } },
            "y" : { get : function() { return this.offsetY; } },

            "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +this.marginX +this.offsetX_aux; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
          });
          
          //////////////////////////////////
          descartesJS.ctx.font = children_i.style.toString();
          var tmpMetric = getFontMetrics(descartesJS.ctx.font);

          var rowsH = [];
          var colsW = [];

          var index_row;
          var index_col;

          // get the max height of the rows and the max width of the columns
          for (var j=0, k=rows*cols; j<k; j++) {
            index_row = parseInt(j/cols);
            index_col = j % cols;
            
            rowsH[index_row] = Math.max(rowsH[index_row] || 0, components[j].metrics.h);

            colsW[index_col] = Math.max(colsW[index_col] || 0, components[j].metrics.w);
          }

          var matrixW = (1+cols)*matrix.metrics.paddingX;
          for (var j=0; j<cols; j++) { matrixW += colsW[j]; };

          var matrixH = (1+rows)*matrix.metrics.paddingY;
          for (var j=0; j<rows; j++) { matrixH += rowsH[j]; };
          
          var dispY = tmpMetric.descent - tmpMetric.h/2;

          for (var j=0, k=rows*cols; j<k; j++) {
            index_row = parseInt(j/cols);
            index_col = j % cols;

            components[j].metrics.offsetX_aux = partialSum(colsW, index_col) + (colsW[index_col] - components[j].metrics.w)/2 +index_col*matrix.metrics.paddingX;
            components[j].metrics.offsetY_aux = partialSum(rowsH, index_row) + (rowsH[index_row] - components[j].metrics.h)/2 +(1+index_row)*matrix.metrics.paddingY;

            Object.defineProperties(components[j].metrics, {
              "parent" : { value : matrix },
              "matrixH" : { value : matrixH },
              "dispY" : { value : dispY },

              "x" : { get : function() { return this.offsetX; } },
              "y" : { get : function() { return this.offsetY; } },

              "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX + this.offsetX_aux; } },
              "offsetY" : { get : function() { return thisFormula.metrics.offsetY - this.matrixH/2 + this.ascent + this.offsetY_aux + this.dispY; } },
            });
          }

          matrix.metrics.w = matrixW ;
          matrix.metrics.ascent = matrixH/2 -dispY;
          matrix.metrics.descent = matrixH/2 +dispY;
          matrix.metrics.h = matrix.metrics.ascent + matrix.metrics.descent;

          displaceX += 2*matrix.metrics.marginX;
        }
        
        //////////////////////////////////////////////////////////
        else if (children_i.nodeType === "defparts") {
          var defparts = children_i;

          defparts.updateFormula();

          var components = children_i.children;
          var parts = children_i.parts;

          defparts.metrics.marginX = parseInt(1.5 + this.style.size*factorMarginH);
          defparts.metrics.paddingX = parseInt(1.5 + this.style.size*factorPaddingH);
          defparts.metrics.paddingY = parseInt(1.5 + this.style.size*factorPaddingV);

          defparts.metrics.offsetX_aux = displaceX;
          // defparts position
          Object.defineProperties(defparts.metrics, {
            "parent" : { value : thisFormula },

            "x" : { get : function() { return this.offsetX -2*this.marginX; } },
            "y" : { get : function() { return this.offsetY; } },
            
            "offsetX" : { get : function() { return thisFormula.metrics.offsetX +thisFormula.metrics.paddingX +3*this.marginX +this.offsetX_aux; } },
            "offsetY" : { get : function() { return thisFormula.metrics.offsetY; } },
          });

          //////////////////////////////////
          descartesJS.ctx.font = children_i.style.toString();
          var tmpMetric = getFontMetrics(descartesJS.ctx.font);

          var defpartsW = 0;
          var defpartsH = defparts.metrics.paddingY;
          var dispY = tmpMetric.descent - tmpMetric.h/2;

          for (var j=0; j<parts; j++) {
            components[j].metrics.offsetY_aux = defpartsH;

            defpartsW = Math.max(defpartsW, components[j].metrics.w);
            defpartsH += components[j].metrics.h +defparts.metrics.paddingY;
            
            Object.defineProperties(components[j].metrics, {
              "parent" : { value : defparts },
              "dispY" : { value : dispY },

              "x" : { get : function() { return this.offsetX; } },
              "y" : { get : function() { return this.offsetY; } },
              
              "offsetX" : { get : function() { return this.parent.metrics.offsetX + this.parent.metrics.paddingX; } },
              "offsetY" : { get : function() { return thisFormula.metrics.offsetY - this.parent.metrics.defpartsH/2 +this.ascent +this.offsetY_aux + this.dispY; } },
            });
          }
          defparts.metrics.defpartsH = defpartsH;

          defparts.metrics.w = defpartsW +4*defparts.metrics.paddingX;
          defparts.metrics.ascent = defpartsH/2 -dispY;
          defparts.metrics.descent = defpartsH/2 +dispY;
          defparts.metrics.h = defparts.metrics.ascent + defparts.metrics.descent;

          displaceX += 2*defparts.metrics.marginX;
        }

        //////////////////////////////////////////////////////////
        else if ( 
          (children_i.nodeType === "numerator") || 
          (children_i.nodeType === "denominator") ||
          (children_i.nodeType === "index") ||
          (children_i.nodeType === "radicand") ||
          (children_i.nodeType === "from") ||
          (children_i.nodeType === "to") ||
          (children_i.nodeType === "what") ||
          (children_i.nodeType === "element")
        ) {
          children_i.updateFormula();

          children_i.metrics.paddingX = parseInt(1.5 + this.style.size*factorPaddingH);
          children_i.metrics.paddingY = parseInt(1.5 + this.style.size*factorPaddingV);

          children_i.metrics.w += 2*children_i.metrics.paddingX;
          children_i.metrics.ascent += children_i.metrics.paddingY;
          children_i.metrics.descent += children_i.metrics.paddingY;
          children_i.metrics.h = children_i.metrics.ascent + children_i.metrics.descent;
        }

        //////////////////////////////////////////////////////////
        // assign the previous child
        prevChild = children_i;

        //////////////////////////////////////////////////////////
        this.metrics.ascent = Math.max(this.metrics.ascent, children_i.metrics.ascent);
        this.metrics.descent = Math.max(this.metrics.descent, children_i.metrics.descent);

        this.metrics.w += children_i.metrics.w +2*children_i.metrics.marginX;
        this.metrics.h = this.metrics.ascent + this.metrics.descent;
        displaceX += children_i.metrics.w;
      }
    }

    /**
     * 
     */
    justifyAux(width) {
      // count the space children
      var spaces = 0;
      var textWidth = 0;
      for (var i=0, l=this.children.length; i<l-1; i++) {
        if (this.children[i].nodeType === "space") {
          spaces++;
        }
        else {
          textWidth += this.children[i].metrics.w;
        }
      }
      // var spaceWidth = parseInt((width - textWidth)/spaces);
      var spaceWidth = (width - textWidth)/spaces;
      this.updateLine(spaceWidth);
    }

    /**
     * 
     */
    drawTextBlock(ctx) {
      ctx.fillStyle = externalColor;

      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].draw(ctx);
      }
    }
    /**
     * 
     */
    drawTextLineBlock(ctx) {
      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].draw(ctx);
      }
    }
    /**
     * 
     */
    drawText(ctx) {
      if (this.value === "") return;

      var x = this.metrics.x;
      var y = this.metrics.y;

      ctx.fillStyle = (this.style.color !== null) ? ((this.style.color.getColor) ? this.style.color.getColor() : this.style.color) : externalColor;

      ctx.font = this.style.toString();

      ctx.beginPath();

      if (this.style.overline) {
        ctx.rect(x, y -this.metrics.ascent +parseInt(1 +this.style.size/25), this.metrics.w, parseInt(1 +this.style.size/25) );
        ctx.fill();
      }
      if (this.style.underline) {
        ctx.rect(x, y +parseInt(1 +this.style.size/10), this.metrics.w, parseInt(1 +this.style.size/25) );
        ctx.fill();
      }
      if (this.style.border) {
        var tmpStroke = ctx.strokeStyle;
        ctx.lineWidth = 1 + parseInt(this.style.size/8);
        ctx.lineJoin = "round";
        ctx.miterLimit = 2;
        ctx.strokeStyle = this.style.border.getColor();
        ctx.strokeText(this.value, x, y);
        ctx.strokeStyle = tmpStroke;
      }

      ctx.fillText(this.value, x, y);

      // drawBorder
      // ctx.beginPath();
      // ctx.strokeStyle = "#ff0000";
      // ctx.lineWidth = 1;
      // ctx.rect(parseInt(this.metrics.x) +0.5, parseInt(this.metrics.y -this.metrics.ascent) +0.5, this.metrics.w, this.metrics.h);
      // ctx.stroke();

      // ctx.beginPath();
      // ctx.strokeStyle = "#0000ff";
      // ctx.lineWidth = 1;
      // ctx.moveTo(parseInt(this.metrics.x), parseInt(this.metrics.y));
      // ctx.lineTo(parseInt(this.metrics.x + this.metrics.w), parseInt(this.metrics.y));
      // ctx.stroke();

    }
    /**
     * 
     */
    drawWord(ctx) {
      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].draw(ctx);
      }
    }
    /**
     * 
     */
    drawSpace(ctx) { }
    /**
     * 
     */
    drawDynamicText(ctx) {
      var x = this.metrics.x +this.metrics.paddingX;
      var y = this.metrics.y;

      ctx.fillStyle = (this.style.color !== null) ? ((this.style.color.getColor) ? this.style.color.getColor() : this.style.color) : externalColor;
      ctx.font = this.style.toString();

      ctx.beginPath();

      if (this.style.overline) {
        ctx.rect(x, y -this.metrics.ascent +parseInt(1 +this.style.size/25), this.metrics.w, parseInt(1 +this.style.size/25) );
        ctx.fill();
      }
      if (this.style.underline) {
        ctx.rect(x, y +parseInt(1 +this.style.size/10), this.metrics.w, parseInt(1 +this.style.size/25) );
        ctx.fill();
      }

      ctx.fillText(this.evalValue, x, y);

      this.drawBorder(ctx, "blue");
    }
    /**
     * 
     */
    drawHyperlink(ctx) {
      var x = this.metrics.x;
      var y = this.metrics.y;

      this.ctx = ctx;
      // add a position to the click catcher div
      if (!this.clickCatcher.parentNode) {
        // ctx.canvas.parentNode.appendChild(this.clickCatcher);
        if (ctx.canvas.nextSibling.className) {
          ctx.canvas.parentNode.insertBefore(this.clickCatcher, ctx.canvas.nextSibling.nextSibling);
        }
        else {
          ctx.canvas.parentNode.insertBefore(this.clickCatcher, ctx.canvas.nextSibling);
        }
      }
      this.clickCatcher.style.left = x + "px";
      this.clickCatcher.style.top  = (y - this.metrics.ascent) + "px";

      ctx.fillStyle = "blue";

      if (this.click) {
        // cover the previous text when click
        ctx.fillStyle = "white";
        ctx.fillRect(x, y -this.metrics.ascent, this.metrics.w, this.metrics.h);

        ctx.fillStyle = "red";
      }

      ctx.font = this.style.toString();

      ctx.beginPath();
      ctx.rect(x, y +parseInt(1 +this.style.size/10), this.metrics.w, parseInt(1 +this.style.size/25) );
      ctx.fill();

      ctx.fillText(this.value, x, y);
    }
    /**
     * 
     */
    drawFormula(ctx) {
      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].draw(ctx);
      }
      
      this.drawBorder(ctx, "blue");
    }
    /**
     * 
     */
    drawFraction(ctx) {
      // ctx.lineWidth = 6;
      ctx.lineWidth = 5;
      ctx.fillStyle = (this.style.color !== null) ? ((this.style.color.getColor) ? this.style.color.getColor() : this.style.color) : externalColor;
      ctx.beginPath();
      var hSeg = parseInt(1 +this.style.size/24);
      ctx.rect(this.metrics.x, this.metrics.offsetY -parseInt(hSeg/2), this.metrics.w, hSeg);
      ctx.fill();

      this.children[0].draw(ctx);
      this.children[1].draw(ctx);

      this.drawBorder(ctx, "blue");
    }
    /**
     * 
     */
    drawNumDen(ctx) {
      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].draw(ctx);
      }

      this.drawBorder(ctx, "blue");
    }
    /**
     * 
     */
    drawSuperIndex(ctx) {
      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].draw(ctx);
      }

      this.drawBorder(ctx, "blue");
    }
    /**
     * 
     */
    drawSubIndex(ctx) {
      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].draw(ctx);
      }

      this.drawBorder(ctx, "blue");
    }
    /**
     * 
     */
    drawRadical(ctx) {
      ctx.save();
      ctx.fillStyle = (this.style.color !== null) ? ((this.style.color.getColor) ? this.style.color.getColor() : this.style.color) : externalColor;
      ctx.translate(this.radicalSign.x, this.radicalSign.y);
      ctx.scale(this.radicalSign.scaleX, this.radicalSign.scaleY);
      (descartesJS.isMsEdge) ? this.drawRadicalSign(ctx) : ctx.fill(radicalPath);
      ctx.restore();

      ctx.beginPath();
      ctx.fillRect(this.children[1].metrics.x+2.5, this.radicalSign.y -0.5, this.children[1].metrics.w -1.5, parseInt(1+this.style.size/18));

      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].draw(ctx);
      }

      this.drawBorder(ctx, "blue");
    }
    /**
     * 
     */
    drawSum(ctx) {
      ctx.save();
      ctx.fillStyle = (this.style.color !== null) ? ((this.style.color.getColor) ? this.style.color.getColor() : this.style.color) : externalColor;
      ctx.translate(this.sigmaSign.x, this.sigmaSign.y);
      ctx.scale(this.sigmaSign.scale, this.sigmaSign.scale);
      (descartesJS.isMsEdge) ? this.drawSigmaSign(ctx) : ctx.fill(sigmaPath);
      ctx.restore();

      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].draw(ctx);
      }

      this.drawBorder(ctx, "blue");
    }
    /**
     * 
     */
    drawIntegral(ctx) {
      ctx.save();
      ctx.fillStyle = (this.style.color !== null) ? ((this.style.color.getColor) ? this.style.color.getColor() : this.style.color) : externalColor;
      ctx.translate(this.sign.x, this.sign.y);
      ctx.scale(this.sign.scale, this.sign.scale);
      (descartesJS.isMsEdge) ? this.drawIntegralSign(ctx) : ctx.fill(integralPath);

      ctx.restore();

      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].draw(ctx);
      }

      this.drawBorder(ctx, "blue");
    }
    /**
     * 
     */
    drawLimit(ctx) {
      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].draw(ctx);
      }

      ctx.fillStyle = (this.style.color !== null) ? ((this.style.color.getColor) ? this.style.color.getColor() : this.style.color) : externalColor;

      ctx.font = this.style.toString();

      ctx.fillText("lím", this.limitText.x, this.metrics.y);
      ctx.fillText("→", this.limitArrow.x, this.limitArrow.y);

      this.drawBorder(ctx, "blue");
    }
    /**
     * 
     */
    drawMatrix(ctx) {
      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].draw(ctx);
      }

      var w = parseInt(1.5 + this.style.size/25);
      var w_2 = w/2;
      ctx.lineWidth = w;
      ctx.strokeStyle = (this.style.color !== null) ? ((this.style.color.getColor) ? this.style.color.getColor() : this.style.color) : externalColor;

      ctx.beginPath();

      ctx.moveTo(this.metrics.x +w_2 +1.5*this.metrics.marginX, this.metrics.y +w_2 -this.metrics.ascent);
      ctx.lineTo(this.metrics.x +w_2, this.metrics.y +w_2 -this.metrics.ascent);
      ctx.lineTo(this.metrics.x +w_2, this.metrics.y -w_2 -this.metrics.ascent +this.metrics.h);
      ctx.lineTo(this.metrics.x +w_2 +1.5*this.metrics.marginX, this.metrics.y -w_2 -this.metrics.ascent +this.metrics.h);

      ctx.moveTo(this.metrics.x +this.metrics.w -w_2 -1.5*this.metrics.marginX, this.metrics.y +w_2 -this.metrics.ascent);
      ctx.lineTo(this.metrics.x +this.metrics.w -w_2, this.metrics.y +w_2 -this.metrics.ascent);
      ctx.lineTo(this.metrics.x +this.metrics.w -w_2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h);
      ctx.lineTo(this.metrics.x +this.metrics.w -w_2 -1.5*this.metrics.marginX, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h);

      ctx.stroke();

      this.drawBorder(ctx, "blue");
    }
    /**
     * 
     */
    drawDefparts(ctx) {
      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].draw(ctx);
      }

      var w = parseInt(1.5 + this.style.size/25);
      var w_2 = w/2;
      ctx.lineWidth = w;
      ctx.strokeStyle = (this.style.color !== null) ? ((this.style.color.getColor) ? this.style.color.getColor() : this.style.color) : externalColor;
      ctx.beginPath();

      var x1 = 3*this.metrics.marginX;
      var x2 = x1/2;

      ctx.moveTo(this.metrics.x +w_2 +x1, this.metrics.y +w_2 -this.metrics.ascent);
      ctx.bezierCurveTo(
        this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent, 
        this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent,
        this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +2*this.metrics.marginX
      );
      ctx.lineTo(this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h/2 -5*this.metrics.marginX);
      ctx.bezierCurveTo(
        this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h/2,
        this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h/2,
        this.metrics.x +w_2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h/2
      );
      ctx.bezierCurveTo(
        this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h/2,
        this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h/2,
        this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h/2 +5*this.metrics.marginX
      );
      ctx.lineTo(this.metrics.x +w_2 +x2, this.metrics.y +w_2 -this.metrics.ascent +this.metrics.h -2*this.metrics.marginX);
      ctx.bezierCurveTo(
        this.metrics.x +w_2 +x2, this.metrics.y -w_2 -this.metrics.ascent +this.metrics.h,
        this.metrics.x +w_2 +x2, this.metrics.y -w_2 -this.metrics.ascent +this.metrics.h,
        this.metrics.x +w_2 +x1, this.metrics.y -w_2 -this.metrics.ascent +this.metrics.h
      );
      
      ctx.stroke();

      this.drawBorder(ctx, "blue");
    }
    /**
     * 
     */
    drawGenericBlock(ctx) {
      for (var i=0, l=this.children.length; i<l; i++) {
        this.children[i].draw(ctx);
      }

      this.drawBorder(ctx, "blue");
    }
    /**
     * 
     */
    drawComponentNumCtrl(ctx) {
      this.componentNumCtrl.expresion = this.evaluator.parser.parse("(" + this.metrics.x + "," + (this.metrics.y-this.metrics.ascent) + "," + this.componentNumCtrl.w + "," + this.componentNumCtrl.h + ")");
      if ( (this.componentNumCtrl) && (this.componentNumCtrl.parent) && (this.componentNumCtrl.parent.readyApp) ) {
        this.componentNumCtrl.update(true);
      }
    }
    /**
     * 
     */
    drawComponentSpace(ctx) {
      this.componentSpace.xExpr = this.evaluator.parser.parse(this.metrics.x.toString());
      this.componentSpace.yExpr = this.evaluator.parser.parse((this.metrics.y-this.metrics.ascent).toString());
      if ( (this.componentSpace) && (this.componentSpace.parent) && (this.componentSpace.parent.readyApp) ) {
        this.componentSpace.update(true);
      }
    }
    /**
     * 
     */
    drawRadicalSign(ctx) {
      ctx.strokeStyle = 'rgba(0,0,0,0)';
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';
      ctx.miterLimit = 4;
      ctx.beginPath();
      ctx.moveTo(759,1);
      ctx.bezierCurveTo(751,1,744,5,739,15);
      ctx.lineTo(325,878);
      ctx.lineTo(153,500);
      ctx.bezierCurveTo(148,489,142,486,136,491);
      ctx.lineTo(2,596);
      ctx.bezierCurveTo(-3,600,19,626,24,622);
      ctx.lineTo(89,575);
      ctx.lineTo(282,997);
      ctx.bezierCurveTo(285,1003,309,1003,314,993);
      ctx.lineTo(773,40);
      ctx.lineTo(773,1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    /**
     * 
     */
    drawSigmaSign(ctx) {
      ctx.strokeStyle = 'rgba(0,0,0,0)';
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';
      ctx.miterLimit = 4;
      ctx.beginPath();
      ctx.moveTo(780,707);
      ctx.lineTo(750,707);
      ctx.bezierCurveTo(728,805,695,872,585,872);
      ctx.lineTo(180,872);
      ctx.lineTo(509,447);
      ctx.lineTo(225,65);
      ctx.lineTo(538,65);
      ctx.bezierCurveTo(668,65,705,114,726,246);
      ctx.lineTo(756,246);
      ctx.lineTo(756,0);
      ctx.lineTo(25,0);
      ctx.lineTo(384,500);
      ctx.lineTo(0,1000);
      ctx.lineTo(729,1000);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    /**
     * 
     */
    drawIntegralSign(ctx) {
      ctx.strokeStyle = 'rgba(0,0,0,0)';
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';
      ctx.miterLimit = 4;
      ctx.beginPath();
      ctx.moveTo(150,828);
      ctx.bezierCurveTo(129,916,108,972,67,972);
      ctx.bezierCurveTo(61,972,58,970,58,966);
      ctx.bezierCurveTo(58,957,73,958,73,932);
      ctx.bezierCurveTo(73,918,60,910,46,910);
      ctx.bezierCurveTo(22,910,1,932,1,961);
      ctx.bezierCurveTo(1,981,22,1000,57,1000);
      ctx.bezierCurveTo(154,1000,198,895,216,824);
      ctx.lineTo(375,181);
      ctx.bezierCurveTo(398,90,420,27,464,28);
      ctx.bezierCurveTo(470,28,473,30,473,34);
      ctx.bezierCurveTo(473,41,458,47,458,69);
      ctx.bezierCurveTo(458,83,471,89,485,89);
      ctx.bezierCurveTo(509,89,530,67,530,38);
      ctx.bezierCurveTo(530,18,508,0,473,0);
      ctx.bezierCurveTo(368,0,326,120,309,190);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    /**
     * 
     */
    drawBorderSpecial(ctx, color) {
      ctx.beginPath();
      ctx.setLineDash([1,2]);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.rect(parseInt(this.metrics.x) +0.5, parseInt(this.metrics.y -this.metrics.ascent) +0.5, this.metrics.w, this.metrics.h);
      ctx.stroke();
      ctx.setLineDash([]);
    }


    /**
     * 
     */
    toRTF() {
      var fontTable = [];
      var colorTable = [];

      var children_i;
      var output = "";

      this.mergeTextNodes();

      for (var i=0, l=this.children.length; i<l; i++) {
        children_i = this.children[i];

        if (children_i.nodeType === "textLineBlock") {
          output += children_i.toRTFAux(fontTable, colorTable) + (((l>1)&&(i<l-1))? "\\par" : "");
        }
      }

      var fontTableStr = "{\\fonttbl";
      for (var i=0, l=fontTable.length; i<l; i++) {
        fontTableStr += "\\f" + i + "\\fcharset0 " + fontTable[i] + ";";
      }
      fontTableStr += "}";

      var colorTableStr = "";
      if (colorTable.length > 0) {
        colorTableStr = "{\\colortbl";
        for (var i=0, l=colorTable.length; i<l; i++) {
          colorTableStr += colorTable[i];
        }
        colorTableStr += "}";
      }

      output = "{\\rtf1\\uc0" + fontTableStr + colorTableStr + output + "}";

      return output;
    }
    /**
     * 
     */
    toRTFAux(fontTable, colorTable) {
      var children_i;
      var lastFontFamily;
      var lastFontSize;
      var lastColor = null;

      var output = "";
      var open;
      var close;
      var tmpFontFamily;
      var tmpFontSize;
      var tmpColor;

      var tmpRTF;

      for (var i=0, l=this.children.length; i<l; i++) {
        open = close = "";

        children_i = this.children[i];

        tmpFontFamily = this.addToFontTable(children_i.style.family, fontTable);
        tmpFontSize = children_i.style.size;
        tmpColor = this.addToColorTable(children_i.style.color, colorTable);

        if ((tmpColor === null) && (colorTable.length > 0)) {
          tmpColor = this.addToColorTable(externalColor, colorTable);
        }

        if (tmpColor !== lastColor) {
          open += "\\cf" + tmpColor;
          lastColor = tmpColor;
        }

        if (tmpFontFamily !== lastFontFamily) {
          open += "\\f" + tmpFontFamily;
          lastFontFamily = tmpFontFamily;
        }
        if (tmpFontSize !== lastFontSize) {
          open += "\\fs" + (tmpFontSize*2);
          lastFontSize = tmpFontSize;
        }

        if (children_i.style.italic) {
          open += "\\i";
          close = "\\i0" + close;
        }
        if (children_i.style.bold) {
          open += "\\b";
          close = "\\b0" + close;
        }
        if (children_i.style.underline) {
          open += "\\ul";
          close = "\\ulnone" + close;
        }
        if (children_i.style.overline) {
          open += "\\ol";
          close = "\\olnone" + close;
        }

        if (children_i.nodeType === "text") {
          children_i.value = children_i.value.replace(/\\{/g, "{").replace(/\\}/g, "}").replace(/{/g, "\\{").replace(/}/g, "\\}");

          if (open !== "") {
            tmpRTF = open + " " + children_i.value + close;
          }
          else {
            if ((output !== "") && (output.charAt(output.length-1) !== "}")) {
              tmpRTF = " " + children_i.value;
            }
            else {
              tmpRTF = children_i.value;
            }
          }

          output += tmpRTF;
        }
        else if (children_i.nodeType === "formula") {
          output += "{\\*\\mjaformula" + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}";
        }

        else if (children_i.nodeType === "componentSpace") {
          output += "{\\*\\component\\Space " + children_i.value + "}";
        }
        else if (children_i.nodeType === "componentNumCtrl") {
          output += "{\\*\\component\\NumCtrl " + children_i.value + "}";
        }
      }

      return output;
    }
    /**
     * 
     */
    formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) {
      var children_i;

      var output = "";
      var open;
      var close;
      var tmpFontFamily;
      var tmpFontSize;
      var tmpColor;

      for (var i=0, l=this.children.length; i<l; i++) {
        open = close = "";

        children_i = this.children[i];

        tmpFontFamily = this.addToFontTable(children_i.style.family, fontTable);
        tmpColor = this.addToColorTable(children_i.style.color, colorTable);

        if ((tmpColor === null) && (colorTable.length > 0)) {
          tmpColor = this.addToColorTable(externalColor, colorTable);
        }

        if (tmpFontFamily !== lastFontFamily) {
          open += "\\f" + tmpFontFamily;
          lastFontFamily = tmpFontFamily;
        }
        if (tmpColor !== lastColor) {
          open += "\\cf" + tmpColor;

          // change the lastColor value if the node is not a text node with empty text
          if ((children_i.nodeType !== "text") || ((children_i.nodeType === "text") && (children_i.value !== ""))) {
            lastColor = tmpColor;
          }
        }

        if (children_i.style.italic) {
          open += "\\i";
          close = "\\i0" + close;
        }
        if (children_i.style.bold) {
          open += "\\b";
          close = "\\b0" + close;
        }
        if (children_i.style.underline) {
          open += "\\ul";
          close = "\\ulnone" + close;
        }
        if (children_i.style.overline) {
          open += "\\ol";
          close = "\\olnone" + close;
        }

        if ((children_i.nodeType === "text") && (children_i.value !== "")) {
          children_i.value = children_i.value.replace(/\\{/g, "{").replace(/\\}/g, "}").replace(/{/g, "\\{").replace(/}/g, "\\}");
          if (open !== "") {
            tmpRTF = open + " " + children_i.value + close;
          }
          else {
            if (output.charAt(output.length-1) !== "}") {
              tmpRTF = " " + children_i.value;
            }
            else {
              tmpRTF = children_i.value;
            }
          }

          output += tmpRTF;
        }
        else if (children_i.nodeType === "dynamicText") {
          children_i.value = (children_i.value === "") ? " " : children_i.value;
          output += open + "{\\expr" + " " + children_i.value + "\\decimals " + (children_i.decimals || 2) + "\\fixed" + ((children_i.fixed) ? 1 : 0) + "}" + close;
        }
        else if (
          (children_i.nodeType === "fraction") ||
          (children_i.nodeType === "radical") ||
          (children_i.nodeType === "index") ||
          (children_i.nodeType === "radicand") ||
          (children_i.nodeType === "sum") ||
          (children_i.nodeType === "integral") ||
          (children_i.nodeType === "limit") ||
          (children_i.nodeType === "from") ||
          (children_i.nodeType === "to") ||
          (children_i.nodeType === "what") ||
          (children_i.nodeType === "element")
        ) {
          output += "{\\" + children_i.nodeType + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}";
        }
        else if (children_i.nodeType === "numerator") {
          output += "{\\num" + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}";
        }
        else if (children_i.nodeType === "denominator") {
          output += "{\\den" + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}";
        }
        else if (children_i.nodeType === "superIndex") {
          output += "{\\supix" + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}";
        }
        else if (children_i.nodeType === "subIndex") {
          output += "{\\subix" + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}";
        }
        else if (children_i.nodeType === "matrix") {
          output += "{\\matrix\\rows "+ (children_i.rows || 2) +"\\columns "+ (children_i.columns || 2) + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}";
        }
        else if (children_i.nodeType === "defparts") {
          output += "{\\defparts\\parts "+ (children_i.parts || 2) + children_i.formulaToRTF(lastFontFamily, lastFontSize, lastColor, fontTable, colorTable) + "}";
        }
        
  // console.log(children_i.nodeType, children_i, open + children_i.value + close)
      }

      return output;
    }
    /**
     * 
     */
    addToFontTable(fontType, fontTable) {
      var family;

      if (fontType.match(/times/i)) {
        family = "Times New Roman";
      }
      else if (fontType.match(/courier/i)) {
        family = "Courier New";
      }
      else if (fontType.match(/arial/i)) {
        family = "Arial";
      }

      var indexFamily = fontTable.indexOf(family);
      if (indexFamily === -1) {
        indexFamily = fontTable.length;
        fontTable.push(family);
      }

      return indexFamily;
    }
    /**
     * 
     */
    addToColorTable(textColor, colorTable) {
      if (textColor) {
        var color = "\\red" + parseInt(textColor.substring(1, 3), 16) + "\\green" + parseInt(textColor.substring(3, 5), 16) + "\\blue" + parseInt(textColor.substring(5,7), 16) + ";";

        var colorIndex = colorTable.indexOf(color);
        if (colorIndex === -1) {
          colorIndex = colorTable.length;
          colorTable.push(color);
        }
    
        return colorIndex;
      }
      return null;
    }
    /**
     * 
     */
    mergeTextNodes() {
      var deleteChild = [];
      var lastNode = null;
      for (var i=0, l=this.children.length; i<l; i++) {
        if (this.children[i].nodeType === "text") {
          if ((lastNode !== null) && (lastNode.nodeType === "text")) {
            if (lastNode.style.equals(this.children[i].style)) {
              this.children[i].value = lastNode.value + this.children[i].value;
              deleteChild.push(lastNode);
            }
          }
        }
        else {
          this.children[i].mergeTextNodes();
        }

        lastNode = this.children[i];
      }

      for (var i=0, l=deleteChild.length; i<l; i++) {
        this.removeChild(deleteChild[i]);
      }
    }
  }


  function partialSum(array, index) {
    var result = 0;
    for (var i=0; i<index; i++) {
      result += array[i];
    }
    return result;
  }


  var fontMetrics = {
    "sansserif" : {
      ascent: 1854,
      descent: -434,
      lineGap: 67,
      capHeight: 1409,
      xHeight: 1082,
      unitsPerEm: 2048
    },
    "serif" : {
      ascent: 1825,
      descent: -443,
      lineGap: 87,
      capHeight: 1341,
      xHeight: 940,
      unitsPerEm: 2048
    },
    "monospace" : {
      ascent: 1705,
      descent: -615,
      lineGap: 0,
      capHeight: 1349,
      xHeight: 1082,
      unitsPerEm: 2048
    }
  };

  // https://www.freetype.org/freetype2/docs/glyphs/glyphs-3.html/

  function getFontMetrics(font) {
    // var result = { ascent:0, descent:0, lineGap:0, capHeight:0, xHeight:0, unitsPerEm:0, h:0 };
    var result = { ascent:0, descent:0, h:0, w:0, x:0, y:0, offsetX:0, offsetY:0, marginX:0, marginY:0, paddingX:0, paddingY:0 };

    if (font.trim() == "") {
      return result;
    }

    var fontSize = parseInt( font .match(/(\d+\.*)+px/)[0] );
    var fontName = (font.match("sansserif")) ? "sansserif" : ((font.match("serif")) ? "serif" : "monospace");

    // result.lineGap = fontMetrics[fontName].lineGap * fontSize / fontMetrics[fontName].unitsPerEm;

    result.ascent = Math.ceil( (fontMetrics[fontName].ascent+25) * fontSize / fontMetrics[fontName].unitsPerEm );

    result.descent = Math.ceil( Math.abs( (fontMetrics[fontName].descent-25) * fontSize / fontMetrics[fontName].unitsPerEm ) );

    result.h = result.ascent + result.descent;

    // result.lineGap = Math.ceil( fontMetrics[fontName].lineGap * fontSize / fontMetrics[fontName].unitsPerEm );

    // result.capHeight = Math.ceil( fontMetrics[fontName].capHeight * fontSize / fontMetrics[fontName].unitsPerEm );

    // result.xHeight = Math.ceil( fontMetrics[fontName].xHeight * fontSize / fontMetrics[fontName].unitsPerEm );

    return result;
  }

  descartesJS.TextNode = TextNode;
  return descartesJS;
})(descartesJS || {});
