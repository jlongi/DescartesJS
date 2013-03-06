/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un espacio de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la aplicacion de descartes
   */
  descartesJS.SpaceAP = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Space.call(this, parent, values);

    // arreglo para contener las variables publicas del padre
    this.importarVars = null;
    // arreglo para contener las variables publicas propias
    this.exportarVars = null;

    var evaluator = parent.evaluator;
    
    // si el nombre del archivo es una expresion
    if (this.file.match(/^\[/) && this.file.match(/\]$/)) {
      this.file = evaluator.parser.parse(this.file.substring(1, this.file.length-1));
    }
    // si el nombre del archivo es una cadena
    else if (this.file.match(/^\'/) && this.file.match(/\'$/)) {
      this.file = evaluator.parser.parse(this.file);
    }
    else {
      this.file = evaluator.parser.parse("'" + this.file + "'");
    }
    
    this.oldFile = evaluator.evalExpression(this.file);
    
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

      // si el contenido del espacio esta embedido en la pagina
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
    
    // si se pudo leer el archivo y el archivo tiene alguna etiqueta applet, entonces se crean los elementos
    if ( (response) && (response.toString().match(/<applet/gi)) ) {
      // se encuentra el contenido del applet de descartes
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
      this.descApp.container.setAttribute("style", "position: absolute; overflow: hidden; background-color: " + this.background + "; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
      
      // se agrega el nuevo espacio
      if (oldContainer) {
        this.parent.container.replaceChild(this.descApp.container, oldContainer);
      }
      else {
        this.parent.container.insertBefore(this.descApp.container, this.parent.loader);
      }
      
      // para cada nuevo espacio creado se encuentra el offset de su posicion
      var tmpSpaces = this.descApp.spaces;
      for (var i=0, l=tmpSpaces.length; i<l; i++) {
        tmpSpaces[i].findOffset();
      }
      
      this.descApp.container.style.display = (this.evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
      
      var self = this;
      this.descApp.update = function() {
        // se actualizan los auxiliares
        this.updateAuxiliaries();
        // se actualizan los eventos
        this.updateEvents();
        // se actualizan los controles
        this.updateControls();
        // se actualizan los graficos del espacio
        this.updateSpaces();
        
        self.exportar();
      }      
    }
    
    // no se pudo cargar el archivo entonces se crea un contenedor vacio, que muestra el color del fondo y la imagen especificada, ademas la funcion de actualizacion no hace nada
    else {
      var oldContainer = (this.descApp) ? this.descApp.container : null;
      
      this.descApp = {};
      this.descApp.container = document.createElement("div");
      this.descApp.container.setAttribute("class", "DescartesAppContainer");
      
      // el estilo del contenedor
      var styleString = "position: absolute; overflow: hidden; background-color: " + this.background + "; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";";
      
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
        else if (this.bg_display == "center") {
          styleString += "background-image: url(" + this.imageSrc + "); background-repeat:no-repeat; background-position: center center;";
        }
      }
      
      this.descApp.container.setAttribute("style", styleString);
      
      // se agrega el nuevo espacio al contenedor principal
      if (oldContainer) {
        this.parent.container.replaceChild(this.descApp.container, oldContainer);
      }
      else {
        this.parent.container.insertBefore(this.descApp.container, this.parent.loader);
      }
      
      this.descApp.container.style.display = (this.evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
      
//       this.update = function() {};
    }
  }
  
  /**
   * Actualiza los valores del espacio
   */
  descartesJS.SpaceAP.prototype.update = function() {
    var tmpFile = this.evaluator.evalExpression(this.file);
    if (this.oldFile != tmpFile) {
      this.oldFile = tmpFile;

//       this.init();
      this.initFile();
    }
    else { 
    var changeX = (this.x != this.evaluator.evalExpression(this.xExpr));
    var changeY = (this.y != (this.evaluator.evalExpression(this.yExpr) + this.plecaHeight));

    this.x = (changeX) ? this.evaluator.evalExpression(this.xExpr) : this.x;
    this.y = (changeY) ? (this.evaluator.evalExpression(this.yExpr) + this.plecaHeight) : this.y;

    // si cambio alguna propiedad del espacio entonces cambiamos las propiedades del contenedor
    if (changeX) {
      this.descApp.container.style.left = this.x + "px";
    }
    if (changeY) {
      this.descApp.container.style.top = this.y + "px";
    }
    if ((changeX) || (changeY)) {
      var tmpSpaces = this.descApp.spaces;
      for (var i=0, l=tmpSpaces.length; i<l; i++) {
        tmpSpaces[i].findOffset();
      }
    }

    this.descApp.container.style.display = (this.evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
    
    //////////////////////////////////////////////////////////////////////////////////////////////////
    // se encuentran las variables externas
    if (this.firstUpdate) {
      this.firstUpdate = false;
      // el arreglo para guardar las variables no ha sido inicializado
      if (this.importarVars == null) {
        this.importarVars = [];
        for (var propName in this.evaluator.variables) {
          // solo se verifican las propiedades propias del objeto values
          if (this.evaluator.variables.hasOwnProperty(propName) && propName.match(/^public./)) {
            this.importarVars.push( { varName: propName, value: this.evaluator.getVariable(propName) } );
          }
        }
//         console.log(this.importarVars);
      } 
    }
    
    // se importaran variables en caso de ser necesario
    this.importar();
  }
}
// codigo para el importar y exportar que no deberia de existir
// por que se deberia de implematar AP.get(var, variable), AP.set(var, value), AP.update()
  
  /**
   * 
   */
  descartesJS.SpaceAP.prototype.importar = function() {
//     // el arreglo para guardar las variables no ha sido inicializado
//     if (this.importarVars == null) {
//       this.importarVars = [];
//       for (var propName in this.evaluator.variables) {
//         // solo se verifican las propiedades propias del objeto values
//         if (this.evaluator.variables.hasOwnProperty(propName) && propName.match(/^public./)) {
//           this.importarVars.push( { varName: propName, value: this.evaluator.getVariable(propName) } );
//         }
//       }
//       console.log(this.importarVars);
//     }
    
    var tmpEval;
    var updateThis = false;
    for (var i=0, l=this.importarVars.length; i<l; i++) {
      tmpEval = this.evaluator.getVariable(this.importarVars[i].varName)
      if (tmpEval != this.importarVars[i].value) {
        this.importarVars[i].value = tmpEval;
        this.descApp.evaluator.setVariable(this.importarVars[i].varName, this.importarVars[i].value);
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
