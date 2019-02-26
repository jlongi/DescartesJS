/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes Library
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Library = function(parent, values){
    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);

    var filename = values.file;

    if (filename) {
      // the lib is embeded in the webpage
      var libElement = document.getElementById(filename);

      if ((libElement) && (libElement.type === "descartes/library")) {
        response = libElement.text;
      }
      // the lib is in an external file
      else {
        response = descartesJS.openExternalFile(filename);
      }
    }

    if (response) {
      response = ( response.replace(/&aacute;/g, "á").replace(/&eacute;/g, "é").replace(/&iacute;/g, "í").replace(/&oacute;/g, "ó").replace(/&uacute;/g, "ú").replace(/&Aacute;/g, "Á").replace(/&Eacute;/g, "É").replace(/&Iacute;/g, "Í").replace(/&Oacute;/g, "Ó").replace(/&Uacute;/g, "Ú").replace(/&ntilde;/g, "ñ").replace(/&Ntilde;/g, "Ñ").replace(/\&gt;/g, ">").replace(/\&lt;/g, "<").replace(/\&amp;/g, "&").replace(/\r/g, "") ).split("\n");

      // create the elements
      for (var i=0,l=response.length; i<l; i++){
        if (response[i].trim() !== "") {
          parent.lessonParser.parseAuxiliar(response[i]);
        }
      }
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Library, descartesJS.Auxiliary);
    
  return descartesJS;
})(descartesJS || {});
