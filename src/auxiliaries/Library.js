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
      // the macro is embeded in the webpage
      var macroElement = document.getElementById(filename);

      if ((macroElement) && (macroElement.type == "descartes/library")) {
        response = macroElement.text;
      }
      // the macro is in an external file
      else {
        response = descartesJS.openExternalFile(filename);
      }
    }

    if (response) {
      response = ( response.replace(/&aacute;/g, "\u00e1").replace(/&eacute;/g, "\u00e9").replace(/&iacute;/g, "\u00ed").replace(/&oacute;/g, "\u00f3").replace(/&uacute;/g, "\u00fa").replace(/&Aacute;/g, "\u00c1").replace(/&Eacute;/g, "\u00c9").replace(/&Iacute;/g, "\u00cd").replace(/&Oacute;/g, "\u00d3").replace(/&Uacute;/g, "\u00da").replace(/&ntilde;/g, "\u00f1").replace(/&Ntilde;/g, "\u00d1").replace(/\&gt;/g, ">").replace(/\&lt;/g, "<").replace(/\&amp;/g, "&").replace(/\r/g, "") ).split("\n");

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