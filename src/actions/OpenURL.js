/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una accion de abrir un URL de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el parametro de la accion
   */
  descartesJS.OpenURL = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
    
    this.parameter = parameter;
    this.target = "_blank";
    
    var indexOfTarget = this.parameter.indexOf("target");
    
    if (indexOfTarget != -1) {
      this.target = this.parameter.substring(indexOfTarget);
      this.target = this.target.substring(this.target.indexOf("=")+1);
      this.parameter = this.parameter.substring(0, indexOfTarget-1);
    }
    
    // el parametro es codigo de javascript
    if (this.parameter.substring(0,10) == "javascript") {
      this.javascript = true;

      // reemplaza la codificacion de las comillas &squot; por '
      this.parameter = (this.parameter.substring(11)).replace(/&squot;/g, "'");
      
      // se construye la accion, que evalua el codigo javascript
      this.actionExec = function() {
        eval(this.parameter);
      }
    } 
    
    // el parametro es un archivo relativo a la pagina actual
    else if (this.parameter.substring(0,7) != "http://") {
      this.parameter = window.location.href.substring(0, window.location.href.lastIndexOf("/")+1) + this.parameter;
      
      // se construye la accion, que abre una pagina relativa a la pagina actual
      this.actionExec = function() {
        window.open(this.parameter, this.target);
      }
    }
    // el parametro es un archivo con direccion absoluta
    else {
      // se construye la accion, que abre una pagina con direccion absoluta
      this.actionExec = function() {
        window.open(this.parameter, this.target);
      }
    }
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.OpenURL, descartesJS.Action);

  /**
   * Ejecuta la accion
   */
  descartesJS.OpenURL.prototype.execute = function() {
    this.actionExec();
  }

  return descartesJS;
})(descartesJS || {});