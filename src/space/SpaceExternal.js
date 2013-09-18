/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var self;

  /**
   * Descartes 2D space
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.SpaceExternal = function(parent) {
    // call the parent constructor
    // descartesJS.Space.call(this, parent, values);

    self = this;
    self.parent = parent;

    self.width = 228;
    self.vSpace = 25;

    // create the principal container
    self.container = document.createElement("div");
    self.container.setAttribute("id", "_DescartesExternalRegion_");
    // self.container.setAttribute("class", "DescartesSpaceExternalContainer");
    self.container.setAttribute("style", "-webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; border-style: ridge; border-width: 5px; border-color: gray; box-shadow: 0px 0px 25px 5px #000; overflow-y: scroll; overflow-x: hidden; position: absolute; left: 0px; top: 0px; z-index: 10000; width: " + (self.width +27) + "px; height: 460px; background-color: #63b4fb");

    self.moveManipulator = document.createElement("div");
    self.moveManipulator.setAttribute("style", " position: absolute; left: 0px; top: 0px; width: " + (self.width +27) + "; height: " + self.vSpace + "px; line-height: " + self.vSpace + "px; background-color: ddd; cursor: move; padding-left: 75px; font-family: Sans-Serif; font-size: 18px;");
    self.moveManipulator.innerHTML = "Descartes";
    self.container.appendChild(self.moveManipulator);

    self.ctrs = [];
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Space
  ////////////////////////////////////////////////////////////////////////////////////
  // descartesJS.extend(descartesJS.SpaceExternal, descartesJS.Space);
   
  descartesJS.SpaceExternal.prototype.init = function() {
    document.body.appendChild(this.container);

    self = this;
    var parser = self.parent.evaluator.parser;
    var fontSizeDefaultButtons = "15";
    var text;

    for (var i=0,l=self.ctrs.length; i<l; i++) {
      self.ctrs[i].expresion = parser.parse("(0," + (self.vSpace + 23 + i*35) + "," + (self.width) + ",35)");
      self.ctrs[i].update();
    }

    self.numCtr = l;

    // create the credits button
    if (self.language == "espa\u00F1ol") {
      text = "cr\u00E9ditos";
    } 
    else if (self.language == "english") {
      text = "about";
    }
    else {
      text = "cr\u00E9ditos";
    }

    var btnAbout = new descartesJS.Button(self.parent, { region: "external", 
                                                         name: text, 
                                                         font_size: parser.parse(fontSizeDefaultButtons),
                                                         expresion: parser.parse("(0," + self.vSpace + "," + (self.width/2) + ",25)") 
                                                        });
    btnAbout.actionExec = { execute: descartesJS.showAbout };
    btnAbout.update();

    // create the configuration button
    var btnConfig = new descartesJS.Button(self.parent, { region: "external", 
                                                          name: "config", 
                                                          font_size: parser.parse(fontSizeDefaultButtons),
                                                          action: "config",
                                                          expresion: parser.parse("(" + (self.width/2) + "," + self.vSpace + "," + (self.width/2) + ",25)") 
                                                        });
    btnConfig.update();    

    // create the init button
    if (self.language == "espa\u00F1ol") {
      text = "inicio";
    } 
    else if (self.language == "english") {
      text = "init";
    }
    else {
      text = "inicio";
    }

    var btnInit = new descartesJS.Button(self.parent, { region: "external", 
                                                        name: text, 
                                                        font_size: parser.parse(fontSizeDefaultButtons), 
                                                        action: "init", 
                                                        expresion: parser.parse("(0," + (self.vSpace + 23 + l*35) + "," + (self.width/2) + ",25)") 
                                                      });
    btnInit.update();

    // create the clear button
    if (self.language == "espa\u00F1ol") {
      text = "limpiar";
    } 
    else if (self.language == "english") {
      text = "clear";
    }
    else {
      text = "limpiar";
    }
    
    var btnClear = new descartesJS.Button(self.parent, { region: "external", 
                                                         name: text, 
                                                         font_size: parser.parse(fontSizeDefaultButtons),
                                                         action: "clear",
                                                         expresion: parser.parse("(" + (self.width/2) + "," + (self.vSpace + 23 + l*35) + "," + (self.width/2) + ",25)") 
                                                       });
    btnClear.update();

    // create the clear button
    if (self.language == "espa\u00F1ol") {
      text = "cerrar";
    } 
    else if (self.language == "english") {
      text = "close";
    }
    else {
      text = "close";
    }

    var btnClose = new descartesJS.Button(self.parent, { region: "external", 
                                                         name: text, 
                                                         font_size: parser.parse(fontSizeDefaultButtons),
                                                         expresion: parser.parse("(" + (self.width/4) + "," + (self.vSpace + 46 + l*35) + "," + (self.width/2) + ",25)") 
                                                       });
    btnClose.update();
    btnClose.canvas.addEventListener("click", function(evt) {
      self.hide();
    });

    self.setPositionAndSize();

    // add the events for the movement
    /**
     *
     */
    function onMouseMove(evt) {
      self.newPosition = descartesJS.getCursorPosition(evt);
      self.container.style.left = self.initialPosition.x + (self.newPosition.x - self.oldPosition.x) + "px";
      self.container.style.top  = self.initialPosition.y + (self.newPosition.y - self.oldPosition.y) + "px";
    }

    /**
     *
     */
    function onMouseUp(evt) {
      evt.preventDefault();

      self.findOffset();

      document.body.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseup", onMouseUp);
    }

    /**
     *
     */
    function onMouseDown(evt) {
      evt.preventDefault();

      self.oldPosition = descartesJS.getCursorPosition(evt);
      self.initialPosition = { x: self.container.offsetLeft, y: self.container.offsetTop };

      document.body.addEventListener("mousemove", onMouseMove);
      document.body.addEventListener("mouseup", onMouseUp);
    }

    self.moveManipulator.addEventListener("mousedown", onMouseDown);

    self.findOffset();
    self.hide();
  }

  /**
   * Add a control to the list of controls of the space
   * @param {Control} ctr is the control to add
   */
  descartesJS.SpaceExternal.prototype.addCtr = function(ctr) {
    this.ctrs.push(ctr);
  }  

  /**
   *
   */
  descartesJS.SpaceExternal.prototype.show = function() {
    this.setPositionAndSize();

    this.container.style.display = "block";
  }  

  /**
   *
   */
  descartesJS.SpaceExternal.prototype.hide = function() {
    this.container.style.display = "none";
  }  

  /**
   *
   */
  descartesJS.SpaceExternal.prototype.setPositionAndSize = function() {
    var self = this;
    var newHeight = self.vSpace + 46 + self.numCtr*35 + 25 + 10;

    self.container.style.left = Math.max((parseInt(window.innerWidth - self.width)/2), 0) + "px";
    self.container.style.top = "5px";

    // minimun space
    if (window.innerHeight < (self.vSpace + 75)) {
      self.container.style.height = (self.vSpace + 75) + "px";
    }
    else if (newHeight > (window.innerHeight-10)) {
      self.container.style.height = window.innerHeight-10;
    }
    else {
      self.container.style.height = newHeight + "px";
    }
  }

  /**
   * Find the offset postion of a space
   */
  descartesJS.SpaceExternal.prototype.findOffset = function() {
    tmpContainer = this.container;

    this.offsetLeft = 0;
    this.offsetTop = 0;

    // store the display style
    if ((this.container) && (this.container.style)) {
      tmpDisplay = this.container.style.display;
    }

    // make visible the element to get the offset values
    this.container.style.display = "block";

    if (tmpContainer.getBoundingClientRect) {
      var boundingRect = tmpContainer.getBoundingClientRect();
      this.offsetLeft = boundingRect.left;
      this.offsetTop  = boundingRect.top;
    }
    else {
      while (tmpContainer) {
        if ((tmpContainer.tagName) && (tmpContainer.tagName.toLowerCase() !== "html")) {
          this.offsetLeft += tmpContainer.offsetLeft || 0;
          this.offsetTop  += tmpContainer.offsetTop || 0;
          tmpContainer = tmpContainer.parentNode;
        }
        else {
          tmpContainer = null;
        }
      }
    }
    
    // restore the display style
    if ((this.container) && (this.container.style)) {
      this.container.style.display = tmpDisplay;
    }

    // find the offset for the controls that need it
    for (var i=0,l=this.ctrs.length; i<l; i++) {
      if (this.ctrs[i].findOffset) {
        this.ctrs[i].findOffset();
      }
    }
  }

  return descartesJS;
})(descartesJS || {});