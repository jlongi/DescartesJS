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
  descartesJS.SpaceHTML_IFrame = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Space.call(this, parent, values);

    var evaluator = this.parent.evaluator;
    
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
    
    this.MyIFrame = document.createElement("iframe");
    this.MyIFrame.setAttribute("src", this.oldFile);
    this.MyIFrame.setAttribute("id", this.id);
    this.MyIFrame.setAttribute("marginheight", 0)
    this.MyIFrame.setAttribute("marginwidth", 0)
    this.MyIFrame.setAttribute("frameborder", 0);
    this.MyIFrame.setAttribute("scrolling", "auto");
//     this.MyIFrame.setAttribute("style", "position: absolute; overflow: hidden; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
//     this.MyIFrame.setAttribute("style", "position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    this.MyIFrame.setAttribute("style", "position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px;");
    this.MyIFrame.style.display = (this.evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";

    this.parent.container.insertBefore(this.MyIFrame, this.parent.loader);

    //////////////////////////////////////////////////////////////////////
    // se registran las funciones de comunicacion
    var self = this;
    
    // funcion para asignar un valor a una variable
    this.MyIFrame.onload = function(evt) {
      var iframe = this;

      // mensaje para asignar un valor a una variable
      var iframeSet = function(varName, value) {
        iframe.contentWindow.postMessage({ type: "set", name: varName, value: value }, "*");
      }      
      self.evaluator.setFunction(self.id + ".set", iframeSet);

      // mensaje para realizar una actualizacion
      var iframeUpdate = function(varName, value) {
        iframe.contentWindow.postMessage({ type: "update" }, "*");
      }      
      self.evaluator.setFunction(self.id + ".update", iframeUpdate);
      
      // mensaje para obtener el valor de una variable
      var iframeGet = function(varName, value) {
        iframe.contentWindow.postMessage({ type: "get", name: varName, value: value }, "*");
      }
      self.evaluator.setFunction(self.id + ".get", iframeGet);
      
      // mensaje para ejecutar una funcion
      var iframeExec = function(functionName, functionParameters) {
        iframe.contentWindow.postMessage({ type: "exec", name: functionName, value: functionParameters }, "*");
      }
      self.evaluator.setFunction(self.id + ".exec", iframeExec);      
    }
    
    // se registra la variable para el scroll
    this.evaluator.setVariable(this.id + "._scroll", 0);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.SpaceHTML_IFrame, descartesJS.Space);
  
  /**
   * Actualiza los valores del espacio
   */
  descartesJS.SpaceHTML_IFrame.prototype.update = function(firstTime) { 
    if (firstTime) {
      this.x = Math.Infinity;
      this.y = Math.Infinity;
    }
      
    var evaluator = this.evaluator;
    var changeX = (this.x != evaluator.evalExpression(this.xExpr) + this.displaceRegionWest);
    var changeY = (this.y != evaluator.evalExpression(this.yExpr) + this.parent.plecaHeight  + this.displaceRegionNorth);
    this.x = (changeX) ? evaluator.evalExpression(this.xExpr) + this.displaceRegionWest: this.x;
    this.y = (changeY) ? evaluator.evalExpression(this.yExpr) + this.parent.plecaHeight  + this.displaceRegionNorth : this.y;

    var file = evaluator.evalExpression(this.file);
    // if (file != this.oldFile) {
      this.oldFile = file;
      this.MyIFrame.setAttribute("src", file);
    // }
    
    // si cambio alguna propiedad del espacio entonces cambiamos las propiedades del contenedor
    if (changeX) {
      this.MyIFrame.style.left = this.x + "px";
    }
    if (changeY) {
      this.MyIFrame.style.top = this.y + "px";
    }

    this.MyIFrame.style.display = (evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
   
    this.scrollVar = evaluator.getVariable(this.id + "._scroll");
    
    if (this.scrollVar == 1) {
      this.MyIFrame.setAttribute("scrolling", "yes");
    }
    else if (this.scrollVar == -1) {
      this.MyIFrame.setAttribute("scrolling", "no");
    }
    else {
      this.MyIFrame.setAttribute("scrolling", "auto");
    }

  }
  
  return descartesJS;
})(descartesJS || {});
