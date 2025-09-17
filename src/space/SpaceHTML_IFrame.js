/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let evaluator;
  let container;
  let changeX;
  let changeY;
  let tmp;
  let file;
  let scrollVar;

  class SpaceHTMLIFrame extends descartesJS.Space {
    /**
     * Descartes IFrame space
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the graphic
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      const self = this;
      evaluator = self.parent.evaluator;

      if (self._w_ != undefined) {
        let tmpW = evaluator.parser.parse(self._w_);
        self._w_ = (tmpW.type != "number") ? tmpW : undefined;
      }
      if (self._h_ != undefined) {
        let tmpH = evaluator.parser.parse(self._h_);
        self._h_ = (tmpH.type != "number") ? tmpH : undefined;
      }

      // if the web browser is firefox then a problem occurs with a none visible iframe
      self.isFirefox = (/firefox/i).test(window.navigator.userAgent);

      self.file = (self.file) ? self.file.trim() : "";

      // if the file name is an expression
      if ((/^\[.*\]$/).test(self.file)) {
        self.file = evaluator.parser.parse(self.file.slice(1, -1));
      }
      // if the file name is a string
      else if ((/^\'.*\'$/).test(self.file)) {
        self.file = evaluator.parser.parse(self.file);
      }
      // if is not an expression or a string, then is a string without single quotes
      else {
        self.file = evaluator.parser.parse(`'${self.file}'`);
      }
      
      // register the previous open file
      self.oldFile = evaluator.eval(self.file);    

      self.MyIFrame = descartesJS.newHTML("iframe", {
        marginheight : 0,
        marginwidth  : 0,
        frameborder  : 0,
        scrolling    : "auto",
        class        : "DescartesSpaceIframe",
      });
      if (self.oldFile != 0) {
        self.MyIFrame.setAttribute("src", self.oldFile);
      }

      var strStyle = (descartesJS.isIOS) ? "overflow:scroll;-webkit-overflow-scrolling:touch;overflow-scrolling:touch;" : "";

      self.container = descartesJS.newHTML("div", {
        id    : self.id,
        class : "DescartesSpaceIframeContainer",
        style : `width:${self.w}px;height:${self.h}px;left:${self.x}px;top:${self.y}px;z-index:${self.zIndex};${strStyle}`,
      });
      self.container.appendChild(self.MyIFrame);

      if (self.imageSrc) {
        self.container.style.backgroundImage = `url(${self.imageSrc})`;
      }

      self.parent.container.insertBefore(self.container, self.parent.loader);

      // register the communication functions
      self.MyIFrame.onload = function(evt) {
        let iframe = this;

        // set a value to a variable
        self.evaluator.setFunction(self.id + ".set",
          function(varName, value) {
            iframe.contentWindow.postMessage({ type: "set", name: varName, value: value }, "*");
            return 0;
          }
        );

        // update the scene
        self.evaluator.setFunction(self.id + ".update",
          function() {
            iframe.contentWindow.postMessage({ type: "update" }, "*");
            return 0;
          }
        );
        
        // exec a function of the scene
        self.evaluator.setFunction(self.id + ".exec",
          function (functionName, functionParameters) {
            iframe.contentWindow.postMessage({ type: "exec", name: functionName, value: functionParameters }, "*");
            return 0;
          }
        );

        // change the configuration of the iframe, this supposes tha the iframe has a DescartesJS scene 
        self.evaluator.setFunction(self.id + ".changeConf",
          function iframeChangeConfig(filename) {
            if (filename) {
              let content;

              if (descartesJS.cacheFiles[filename]) {
                content = descartesJS.cacheFiles[filename];
              }
              else {
                let embedElement = document.getElementById(filename);
                content = ((embedElement) && (embedElement.type === "descartes/embed")) ? embedElement.textContent : descartesJS.openFile(filename);
                content = (new DOMParser()).parseFromString(content, "text/html").querySelector("ajs");
                content = (content) ? content.innerHTML : "";
                descartesJS.cacheFiles[filename] = content;
              }

              iframe.contentWindow.postMessage({ type: "change_config", filename: filename, content: content }, "*");
            }
            return 0;
          }
        );

        // change the content of an iframe
        self.evaluator.setFunction(self.id + ".changeContent",
          function(data) {
            if (data) {
              let content = (new DOMParser()).parseFromString(data.replace(/\&sq;/g, "'"), "text/html").querySelector("ajs");
              content = (content) ? content.innerHTML : "";
              iframe.contentWindow.postMessage({ type: "change_content", content: content }, "*");
            }
          }
        );
        
        self.ImReady = !self.isFirefox;
        if (!self.isFirefox) {
          self.container.style.visibility = "visible";
          self.container.style.opacity = "1";
          self.container.style.zIndex = self.zIndex;
          self.container.style.display = (self.drawIfValue) ? "block" : "none";
        }
        self.MyIFrame.style.visibility = "visible";
        self.container.style.backgroundImage = "";
      }

      // self.update = self.iframeUpdate;
      self.update();

      // a scroll variable to determine if the scroll is show or not
      self.evaluator.setVariable(self.id + "._scroll", 0);
    }
        
    /**
     * Init the space
     */
    init() {
      // call the init of the parent
      this.initSpace();
    }

    /**
     * Update the space
     */
    update(firstTime) {
      self = this;
      container = self.container;
      evaluator = self.evaluator;

      self.drawIfValue = evaluator.eval(self.drawif) > 0;

      if (self.ImReady) {
        container.style.display = (self.drawIfValue) ? "block" : "none";
      }
      else {
        container.style.visibility = (self.drawIfValue) ? "visible" : "hidden";
        container.style.opacity = (self.drawIfValue) ? "1" : "0";
        container.style.zIndex = (self.drawIfValue) ? self.zIndex : -1000;
      }

      if (self.drawIfValue) {
        if (firstTime) {
          self.x = self.y = Infinity;
        }

        tmp = evaluator.eval(self.xExpr) + self.displaceRegionWest;
        changeX = (self.x !== tmp);
        if (changeX) { self.x = tmp; }

        tmp = evaluator.eval(self.yExpr) + self.parent.plecaHeight  + self.displaceRegionNorth;
        changeY = (self.y !== tmp);
        if (changeY) { self.y = tmp; }

        if (self._w_ != undefined) {
          tmp = evaluator.eval(self._w_);
          if (self.w !== tmp) {
            self.container.style.width = tmp + "px";
            self.w = tmp;
          }
        }
        if (self._h_ != undefined) {
          tmp = evaluator.eval(self._h_);
          if (self.h !== tmp) {
            container.style.height = tmp + "px";
            self.h = tmp;
          }
        }

        // if the position change
        if ((changeX) || (changeY)) {
          self.container.style.left = self.x + "px";
          self.container.style.top = self.y + "px";
        }

        file = evaluator.eval(self.file);
        if (file !== self.oldFile) {
          self.ImReady = false;

          if (!self.isFirefox) {
            container.style.display = "block";
            container.style.visibility = (self.drawIfValue) ? "visible" : "hidden";
            container.style.opacity = (self.drawIfValue) ? "1" : "0";
            container.style.zIndex = (self.drawIfValue) ? self.zIndex : -1000;
          }

          if (self.imageSrc) {
            container.style.backgroundImage = `url(${self.imageSrc})`;
          }

          self.MyIFrame.style.visibility = "hidden";
          self.oldFile = file;

          // prevent add history entries when the source of an iframe change
          self.MyIFrame.contentWindow.location.replace(file);
        }
      
        scrollVar = evaluator.getVariable(self.id + "._scroll");
        
        if (scrollVar == 1) {
          self.MyIFrame.setAttribute("scrolling", "yes");
          self.MyIFrame.style.overflow = "";
        }
        else if (scrollVar == -1) {
          self.MyIFrame.setAttribute("scrolling", "no");
          self.MyIFrame.style.overflow = "hidden";
        }
        else {
          self.MyIFrame.setAttribute("scrolling", "auto");
          self.MyIFrame.style.overflow = "";
        }
      }
      else {
        // remove focus of the iframe
        self.MyIFrame.contentWindow.blur();
      }
    }
  }

  descartesJS.SpaceHTMLIFrame = SpaceHTMLIFrame;  
  return descartesJS;
})(descartesJS || {});
