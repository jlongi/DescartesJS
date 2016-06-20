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
    // call the parent constructor
    descartesJS.Space.call(this, parent, values);

    // array for the parent public variables
    this.iVars = null;
    // array for the own public variables
    this.eVars = null;

    evaluator = parent.evaluator;

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
    this.oldFile = evaluator.eval(this.file);

    this.initFile();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.SpaceAP, descartesJS.Space);

  /**
   *
   */
  descartesJS.SpaceAP.prototype.initFile = function() {
    this.firstUpdate = true;

    var response;

    if (this.oldFile) {
      // if the content is embedded in the webpage
      var spaceElement = document.getElementById(this.oldFile);
      if ((spaceElement) && (spaceElement.type == "descartes/spaceApFile")) {
        response = spaceElement.text;
      }
      else {
        response = descartesJS.openExternalFile(this.oldFile);
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
      myApplet.firstChild.setAttribute("width", this.w);
      myApplet.firstChild.setAttribute("height", this.h);

      var oldContainer = (this.descApp) ? this.descApp.container : null;

      this.descApp = new descartesJS.DescartesApp(myApplet.firstChild);
      this.descApp.container.setAttribute("class", "DescartesAppContainer");
      this.descApp.container.setAttribute("style", "position:absolute;overflow:hidden;background-color:" + this.background + ";width:" + this.w + "px;height:" + this.h + "px;left:" + this.x + "px;top:" + this.y + "px;z-index:" + this.zIndex + ";");

      // add the new space
      if (oldContainer) {
        this.parent.container.replaceChild(this.descApp.container, oldContainer);
      }
      else {
        this.parent.container.insertBefore(this.descApp.container, this.parent.loader);
      }

      // for every space find his offset
      var tmpSpaces = this.descApp.spaces;

      this.descApp.container.style.display = (this.evaluator.eval(this.drawif) > 0) ? "block" : "none";

      var self = this;
      this.descApp.update = function() {
        this.updateAuxiliaries();
        this.updateEvents();
        this.updateControls();
        this.updateSpaces();

        self.exportar();
      }
    }
    // if cant read the file then create an empty container that has the background color and the background image
    else {
      var oldContainer = (this.descApp) ? this.descApp.container : null;

      this.descApp = {};
      this.descApp.container = document.createElement("div");
      this.descApp.container.setAttribute("class", "DescartesAppContainer");

      // style container
      var styleString = "position:absolute;overflow:hidden;background-color:" + this.background + ";width:" + this.w + "px;height:" + this.h + "px;left:" + this.x + "px;top:" + this.y + "px;z-index:" + this.zIndex + ";";

      if (this.image) {
        if (this.bg_display == "topleft") {
          styleString += "background-image: url(" + this.imageSrc + "); background-repeat:no-repeat;";
        }
        else if (this.bg_display == "stretch") {
          styleString += "background-image: url(" + this.imageSrc + "); background-repeat:no-repeat; background-size: 100% 100%;";
        }
        else if (this.bg_display == "patch") {
          styleString += "background-image: url(" + this.imageSrc + ");";
        }
        else if (this.bg_display == "imgcenter") {
          styleString += "background-image: url(" + this.imageSrc + "); background-repeat:no-repeat; background-position: center center;";
        }
      }

      this.descApp.container.setAttribute("style", styleString);

      // add the container to the principal container
      if (oldContainer) {
        this.parent.container.replaceChild(this.descApp.container, oldContainer);
      }
      else {
        this.parent.container.insertBefore(this.descApp.container, this.parent.loader);
      }

      this.descApp.container.style.display = (this.evaluator.eval(this.drawif) > 0) ? "block" : "none";
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
