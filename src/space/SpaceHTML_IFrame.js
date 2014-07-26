/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var changeX;
  var changeY;
  var file;
  var self;

  /**
   * Descartes IFrame space
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.SpaceHTML_IFrame = function(parent, values) {
    // call the parent constructor
    descartesJS.Space.call(this, parent, values);

    var evaluator = this.parent.evaluator;

    // PATCH
    // if the web browser is firefox then a problem ocurrs with a none visible iframe
    var isFirefox = window.navigator.userAgent.toLowerCase().match(/firefox/);
    // PATCH

    this.file = (this.file) ? this.file.trim() : "";

    // if the file name is an expression
    if (this.file.match(/^\[/) && this.file.match(/\]$/)) {
      this.file = evaluator.parser.parse(this.file.substring(1, this.file.length-1));
    }
    // if the file name is a string
    else if (this.file.match(/^\'/) && this.file.match(/\'$/)) {
      this.file = evaluator.parser.parse(this.file);
    }
    // if is not an expression or a string, then is a string without single quotes
    else {
      this.file = evaluator.parser.parse("'" + this.file + "'");
    }
    
    // register which are the old open file
    this.oldFile = evaluator.evalExpression(this.file);    
    
    this.MyIFrame = document.createElement("iframe");
    if (this.oldFile != 0) {
      this.MyIFrame.setAttribute("src", this.oldFile);
    }
    this.MyIFrame.setAttribute("id", this.id);
    this.MyIFrame.setAttribute("marginheight", 0);
    this.MyIFrame.setAttribute("marginwidth", 0);
    this.MyIFrame.setAttribute("frameborder", 0);
    this.MyIFrame.setAttribute("scrolling", "auto");
    // this.MyIFrame.setAttribute("style", "overflow: hidden; position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px;");
    // this.MyIFrame.setAttribute("style", "position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px;");

    this.MyIFrame.setAttribute("style", "position: static; left: 0px; top: 0px;");

    this.container = document.createElement("div");
    // this.container.setAttribute("style", "-webkit-overflow-scrolling: touch; position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px;");
    if (descartesJS.isIOS) {
      this.container.setAttribute("style", "overflow: scroll; -webkit-overflow-scrolling: touch; position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    }
    else {
      this.container.setAttribute("style", "position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";"); 
    }
    
    this.container.appendChild(this.MyIFrame);

    // this.parent.container.insertBefore(this.MyIFrame, this.parent.loader);
    this.parent.container.insertBefore(this.container, this.parent.loader);

    // register the comunication functions
    var self = this;

    this.MyIFrame.onload = function(evt) {
      var iframe = this;

      // set a value to a variable
      var iframeSet = function(varName, value) {
        iframe.contentWindow.postMessage({ type: "set", name: varName, value: value }, "*");
        return 0;
      }      
      self.evaluator.setFunction(self.id + ".set", iframeSet);

      // update the scene
      var iframeUpdate = function() {
        iframe.contentWindow.postMessage({ type: "update" }, "*");
        return 0;
      }      
      self.evaluator.setFunction(self.id + ".update", iframeUpdate);
      
      // exec a funcion of the scene
      var iframeExec = function(functionName, functionParameters) {
        iframe.contentWindow.postMessage({ type: "exec", name: functionName, value: functionParameters }, "*");
        return 0;
      }
      self.evaluator.setFunction(self.id + ".exec", iframeExec);
    }

    this.update = this.iframeUpdate;

    // a scroll variable to determine if the scroll is show or not
    this.evaluator.setVariable(this.id + "._scroll", 0);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.SpaceHTML_IFrame, descartesJS.Space);
  
  /**
   * Init the space
   */
  descartesJS.SpaceHTML_IFrame.prototype.init = function() {
    self = this;
    
    // call the init of the parent
    self.uber.init.call(self);

    // update the size of the iframe if has some regions
    if (self.MyIFrame) {
      self.MyIFrame.style.width  = self.w + "px";
      self.MyIFrame.style.height = self.h + "px";
      self.MyIFrame.style.left   = self.x + "px";
      self.MyIFrame.style.top    = self.y + "px";
    }

  }

  /**
   * Update the space
   */
  descartesJS.SpaceHTML_IFrame.prototype.iframeUpdate = function(firstTime) {
    evaluator = this.evaluator;

    this.drawIfValue = evaluator.evalExpression(this.drawif) > 0;
    this.container.style.visibility = (this.drawIfValue)? "visible" : "hidden";

    if (this.drawIfValue) {
      if (firstTime) {
        this.x = Infinity;
        this.y = Infinity;
      }

      changeX = (this.x !== (evaluator.evalExpression(this.xExpr) + this.displaceRegionWest));
      changeY = (this.y !== (evaluator.evalExpression(this.yExpr) + this.parent.plecaHeight  + this.displaceRegionNorth));
      this.x = (changeX) ? evaluator.evalExpression(this.xExpr) + this.displaceRegionWest: this.x;
      this.y = (changeY) ? evaluator.evalExpression(this.yExpr) + this.parent.plecaHeight  + this.displaceRegionNorth : this.y;

      // if the position change
      if ((changeX) || (changeY)) {
        this.container.style.left = this.x + "px";
        this.container.style.top = this.y + "px";
      }

      file = evaluator.evalExpression(this.file);
      if (file !== this.oldFile) {
        this.oldFile = file;
        this.MyIFrame.setAttribute("src", file);
      }
     
      this.scrollVar = evaluator.getVariable(this.id + "._scroll");
      
      if (this.scrollVar == 1) {
        this.MyIFrame.setAttribute("scrolling", "yes");
        this.MyIFrame.style.overflow = "";
      }
      else if (this.scrollVar == -1) {
        this.MyIFrame.setAttribute("scrolling", "no");
        this.MyIFrame.style.overflow = "hidden";
      }
      else {
        this.MyIFrame.setAttribute("scrolling", "auto");
        this.MyIFrame.style.overflow = "";
      }
    }

  }
  
  return descartesJS;
})(descartesJS || {});