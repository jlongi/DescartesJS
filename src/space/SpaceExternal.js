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
    self = this;
    self.parent = parent;

    self.width = 228;
    self.vSpace = 25;

    // create the principal container
    self.container = document.createElement("div");
    self.container.setAttribute("style", "box-sizing:border-box;border-style:ridge;border-width:5px;border-color:gray;box-shadow:#000 0 0 25px 5px;overflow-y:scroll;overflow-x:hidden;position:fixed;left:0;top:0;z-index:10000;width:" + (self.width +27) + "px;height:460px;background-color:#63b4fb;");

    self.movable = document.createElement("div");
    self.movable.setAttribute("style", "position:absolute;left:0;top:0;width:" + (self.width +27) + "px;height:" + self.vSpace + "px;line-height:" + self.vSpace + "px;background-color:#ddd;cursor:move;padding-left:75px;font-family:"+ descartesJS.sansserif_font +";font-size:18px;");
    self.movable.innerHTML = "Descartes";
    self.container.appendChild(self.movable);

    self.ctrs = [];
  }

  descartesJS.SpaceExternal.prototype.init = function() {
    document.body.appendChild(this.container);

    self = this;
    var parser = self.parent.evaluator.parser;
    var fontSizeDefaultButtons = "15";

    for (var i=0,l=self.ctrs.length; i<l; i++) {
      self.ctrs[i].expresion = parser.parse("(0," + (self.vSpace + 23 + i*35) + "," + (self.width) + ",35)");
      self.ctrs[i].update();
    }

    self.numCtr = l;

    // create the credits button
    var btnAbout = new descartesJS.Button(self.parent, { 
      region: "external",
      name: (self.language == "english") ? "about" : "créditos",
      font_size: parser.parse(fontSizeDefaultButtons),
      expresion: parser.parse("(0," + self.vSpace + "," + (self.width/2) + ",25)")
    });
    btnAbout.actionExec = { execute: descartesJS.showAbout };
    btnAbout.update();

    // create the configuration button
    var btnConfig = new descartesJS.Button(self.parent, { 
      region: "external",
      name: "config",
      font_size: parser.parse(fontSizeDefaultButtons),
      action: "config",
      expresion: parser.parse("(" + (self.width/2) + "," + self.vSpace + "," + (self.width/2) + ",25)")
    });
    btnConfig.update();

    // create the init button
    var btnInit = new descartesJS.Button(self.parent, { 
      region: "external",
      name: (self.language == "english") ? "init" : "inicio",
      font_size: parser.parse(fontSizeDefaultButtons),
      action: "init",
      expresion: parser.parse("(0," + (self.vSpace + 23 + l*35) + "," + (self.width/2) + ",25)")
    });
    btnInit.update();

    // create the clear button
    var btnClear = new descartesJS.Button(self.parent, { 
      region: "external",
      name: (self.language == "english") ? "clear" : "limpiar",
      font_size: parser.parse(fontSizeDefaultButtons),
      action: "clear",
      expresion: parser.parse("(" + (self.width/2) + "," + (self.vSpace + 23 + l*35) + "," + (self.width/2) + ",25)")
    });
    btnClear.update();

    // create the clear button
    var btnClose = new descartesJS.Button(self.parent, { 
      region: "external",
      name: (self.language == "english") ? "close" : "cerrar",
      font_size: parser.parse(fontSizeDefaultButtons),
      expresion: parser.parse("(" + (self.width/4) + "," + (self.vSpace + 46 + l*35) + "," + (self.width/2) + ",25)")
    });
    btnClose.update();
    btnClose.btn.addEventListener("click", function(evt) {
      self.hide();
    });

    self.setPositionAndSize();

    // add the events for the movement
    /**
     *
     */
    function onMouseMove(evt) {
      self.newPos = descartesJS.getCursorPosition(evt, document.body);
      self.container.style.left = self.initialPosition.x + (self.newPos.x - self.oldPos.x)*descartesJS.cssScale + "px";
      self.container.style.top  = self.initialPosition.y + (self.newPos.y - self.oldPos.y)*descartesJS.cssScale + "px";
    }

    /**
     *
     */
    function onMouseUp(evt) {
      evt.preventDefault();

      document.body.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseup", onMouseUp);
    }

    /**
     *
     */
    function onMouseDown(evt) {
      evt.preventDefault();

      self.oldPos = descartesJS.getCursorPosition(evt, document.body);
      self.initialPosition = { x: self.container.offsetLeft, y: self.container.offsetTop };

      document.body.addEventListener("mousemove", onMouseMove);
      document.body.addEventListener("mouseup", onMouseUp);
    }

    self.movable.addEventListener("mousedown", onMouseDown);

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
    self = this;
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

  return descartesJS;
})(descartesJS || {});
