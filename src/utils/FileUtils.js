/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  descartesJS.cacheFiles = Object.create(null);

  /**
   * Open an external file using an xml http request
   * @param {String} filename the filename of the file to open
   * @return {*} the content of the file if reader or null if not
   */
  descartesJS.openFile = function(filename) {
    if (descartesJS.cacheFiles[filename]) {
      return descartesJS.cacheFiles[filename];
    }

    var response = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", filename, false);
    try {
      xhr.send(null);
      response = (xhr.status === 200 || xhr.status === 304) ? xhr.responseText : (xhr.responseText || "");
      response = (xhr.status === 404) ? "" : response;

      ////////////////////////////////////////////////////////////////////////
      // patch to read ISO-8859-1 text files
      if (response.match(String.fromCharCode(65533))) {
	      xhr.open("GET", filename, false);
	      xhr.overrideMimeType("text/plain;charset=ISO-8859-1");
	      xhr.send(null);
	      response = xhr.responseText;
      }
      ////////////////////////////////////////////////////////////////////////
    }
    catch (e) {
      // console.log("Error to load the file :", filename);
      response = null;
    }

    return response;
  }

  /**
   *
   */
  descartesJS.addExternalFileContent = function(filename, data) {
    descartesJS.cacheFiles[filename] = data;
  }

  return descartesJS;
})(descartesJS || {});
