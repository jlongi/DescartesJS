/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;

  /**
   * Descartes aplication space
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.SpaceAP = function(parent, values) {
    var self = this;
    // call the parent constructor
    descartesJS.Space.call(self, parent, values);

    // array for the parent public variables
    self.iVars = null;
    // array for the own public variables
    self.eVars = null;

    evaluator = parent.evaluator;

    // if the file name is an expression
    if (self.file.match(/^\[/) && self.file.match(/\]$/)) {
      self.file = evaluator.parser.parse(self.file.substring(1, self.file.length-1));
    }
    // if the file name is a string
    else if (self.file.match(/^\'/) && self.file.match(/\'$/)) {
      self.file = evaluator.parser.parse(self.file);
    }
    // if is not an expression or a string, then is a string without single quotes
    else {
      self.file = evaluator.parser.parse("'" + self.file + "'");
    }

    // register which are the old open file
    self.oldFile = evaluator.eval(self.file);

    self.initFile();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.SpaceAP, descartesJS.Space);

  /**
   *
   */
  descartesJS.SpaceAP.prototype.initFile = function() {
    var self = this;

    self.firstUpdate = true;

    var response;

    if (self.oldFile) {
      // if the content is embedded in the webpage
      var spaceElement = document.getElementById(self.oldFile);
      if ((spaceElement) && (spaceElement.type == "descartes/spaceApFile")) {
        response = spaceElement.text;
      }
      else {
        response = descartesJS.openExternalFile(self.oldFile);
      }

      if (response != null) {
        response = response.split("\n");
      }
    }

    // if the file is readed and have an applet label, then init the creation
    if ( (response) && (response.toString().match(/<applet/gi)) ) {
      // find the Descartes applet content
      var appletContent = "";
      var initApplet = false;
      for (var i=0, l=response.length; i<l; i++) {
        if ( response[i].match("<applet") ) {
          initApplet = true;
        }

        if (initApplet) {
          appletContent += response[i];
        }

        if ( response[i].match("</applet") ) {
          break;
        }
      }

      var myApplet = document.createElement("div");
      myApplet.innerHTML = appletContent;
      myApplet.firstChild.setAttribute("width", self.w);
      myApplet.firstChild.setAttribute("height", self.h);

      var oldContainer = (self.descApp) ? self.descApp.container : null;

      self.descApp = new descartesJS.DescartesApp(myApplet.firstChild);
      self.descApp.container.setAttribute("class", "DescartesAppContainer");
      self.descApp.container.setAttribute("style", "position:absolute;overflow:hidden;background-color:" + self.background + ";width:" + self.w + "px;height:" + self.h + "px;left:" + self.x + "px;top:" + self.y + "px;z-index:" + self.zIndex + ";");

      // add the new space
      if (oldContainer) {
        self.parent.container.replaceChild(self.descApp.container, oldContainer);
      }
      else {
        self.parent.container.insertBefore(self.descApp.container, self.parent.loader);
      }

      // for every space find his offset
      var tmpSpaces = self.descApp.spaces;

      self.descApp.container.style.display = (self.evaluator.eval(self.drawif) > 0) ? "block" : "none";

      self.descApp.update = function() {
        self.updateAuxiliaries();
        self.updateEvents();
        self.updateControls();
        self.updateSpaces();

        self.exportar();
      }
    }
    // if cant read the file then create an empty container that has the background color and the background image
    else {
      var oldContainer = (self.descApp) ? self.descApp.container : null;

      self.descApp = {};
      self.descApp.container = document.createElement("div");
      self.descApp.container.setAttribute("class", "DescartesAppContainer");

      // style container
      var styleString = "position:absolute;overflow:hidden;background-color:" + self.background + ";width:" + self.w + "px;height:" + self.h + "px;left:" + self.x + "px;top:" + self.y + "px;z-index:" + self.zIndex + ";";

      if (self.image) {
        if (self.bg_display == "topleft") {
          styleString += "background-image: url(" + self.imageSrc + "); background-repeat:no-repeat;";
        }
        else if (self.bg_display == "stretch") {
          styleString += "background-image: url(" + self.imageSrc + "); background-repeat:no-repeat; background-size: 100% 100%;";
        }
        else if (self.bg_display == "patch") {
          styleString += "background-image: url(" + self.imageSrc + ");";
        }
        else if (self.bg_display == "imgcenter") {
          styleString += "background-image: url(" + self.imageSrc + "); background-repeat:no-repeat; background-position: center center;";
        }
      }

      self.descApp.container.setAttribute("style", styleString);

      // add the container to the principal container
      if (oldContainer) {
        self.parent.container.replaceChild(self.descApp.container, oldContainer);
      }
      else {
        self.parent.container.insertBefore(self.descApp.container, self.parent.loader);
      }

      self.descApp.container.style.display = (self.evaluator.eval(self.drawif) > 0) ? "block" : "none";
    }
  }

  /**
   * Update the space
   */
  descartesJS.SpaceAP.prototype.update = function() {
    var tmpFile = this.evaluator.eval(this.file);
    if (this.oldFile != tmpFile) {
      this.oldFile = tmpFile;
      this.initFile();
    }
    else {
      var changeX = (this.x != this.evaluator.eval(this.xExpr));
      var changeY = (this.y != (this.evaluator.eval(this.yExpr) + this.plecaHeight));

      this.x = (changeX) ? this.evaluator.eval(this.xExpr) : this.x;
      this.y = (changeY) ? (this.evaluator.eval(this.yExpr) + this.plecaHeight) : this.y;

      // some property of the space change then change the container properties
      if (changeX) {
        this.descApp.container.style.left = this.x + "px";
      }
      if (changeY) {
        this.descApp.container.style.top = this.y + "px";
      }
      if ((changeX) || (changeY)) {
        var tmpSpaces = this.descApp.spaces;
      }

      this.descApp.container.style.display = (this.evaluator.eval(this.drawif) > 0) ? "block" : "none";

      //////////////////////////////////////////////////////////////////////////////////////////////////
      // find the external variables
      if (this.firstUpdate) {
        this.firstUpdate = false;

        // if the array to store the variables is not initialized
        if (this.iVars == null) {
          this.iVars = [];
          for (var propName in this.evaluator.variables) {
            // check only the own properties
            if (this.evaluator.variables.hasOwnProperty(propName) && propName.match(/^public./)) {
              this.iVars.push( { varName: propName, value: this.evaluator.getVariable(propName) } );
            }
          }
        }
      }

      // import the variables if needed
      this.importar();
    }
  }

  /**
   *
   */
  descartesJS.SpaceAP.prototype.importar = function() {
    var tmpEval;
    var updateThis = false;
    for (var i=0, l=this.iVars.length; i<l; i++) {
      tmpEval = this.evaluator.getVariable(this.iVars[i].varName)
      if (tmpEval != this.iVars[i].value) {
        this.iVars[i].value = tmpEval;
        this.descApp.evaluator.setVariable(this.iVars[i].varName, this.iVars[i].value);
        updateThis = true;
      }
    }

    if (updateThis) {
      this.descApp.update();
    }
  }

  /**
   *
   */
  descartesJS.SpaceAP.prototype.exportar = function() {

  }

  return descartesJS;
})(descartesJS || {});
