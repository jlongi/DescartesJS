/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class Library extends descartesJS.Auxiliary {
    /**
     * Descartes Library
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the auxiliary
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      let filename = values.file;
      let response;

      if (filename) {
        // the lib is embedded in the webpage
        let libElement = document.getElementById(filename);
        
        if ((libElement) && (libElement.type === "descartes/library")) {
          response = libElement.text;
        }
        // the lib is in an external file
        else {
          response = descartesJS.openFile(filename);
        }
      }

      if (response) {
        response = ((descartesJS.convertHTMLEntities(response)).replace(/\r/g, "")).split("\n");

        // create the elements
        for (var i=0, l=response.length; i<l; i++){
          if (response[i].trim() !== "") {
            parent.lessonParser.parseAuxiliar(response[i]);
          }
        }
      }
    }
  }

  descartesJS.Library = Library;
  return descartesJS;
})(descartesJS || {});
