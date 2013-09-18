/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Simplify ajax requests
   * @return return an ajax object ready for requests
   */
  function newXMLHttpRequest() {
    var xhr = false;
    
    // all browsers
    if (window.XMLHttpRequest) {
      try { 
        xhr = new XMLHttpRequest();
      }
      catch (e) { 
        xhr = false;
      }
    }
    // IE do not have an XMLHttpRequest native object, so try an activeX object
    else if (window.ActiveXObject) {
      try { 
        xhr = new ActiveXObject("Msxml2.XMLHTTP"); 
      }
      catch(e) {
        try { 
          xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch(e) {
          xhr = false;
        }
      }
    }
    
    return xhr;
  }
  
  var response;
  var xhr;
  descartesJS._externalFilesContent = {};
  /**
   * Open an external file using an ajax request
   * Abre un archivo externo
   * @param {String} filename el nombre del archivo que se quiere abrir
   * @return the content of the file if readed or null if not
   */
  descartesJS.openExternalFile = function(filename) {
    ////////////////////////////////////////////////////////// 
    if (descartesJS._externalFilesContent[filename]) {
      return descartesJS._externalFilesContent[filename];
    }
    //////////////////////////////////////////////////////////

    response = null;
    xhr = newXMLHttpRequest();
    xhr.open("GET", filename, false);
    try {
      xhr.send(null);
      response = xhr.responseText;
        
      ////////////////////////////////////////////////////////////////////////
      // patch to read ISO-8859-1 text files
      if (response.match(String.fromCharCode(65533))) {
	      xhr.open("GET", filename, false);
	      xhr.overrideMimeType("text/plain; charset=ISO-8859-1");
	      xhr.send(null);
	      response = xhr.responseText;
      }
      ////////////////////////////////////////////////////////////////////////
    }
    catch (e) {
      console.log("Error to load the file :", filename);
      response = null;
    }
    
    return response;
  }

  /**
   *
   */
  descartesJS.addExternalFileContent = function(filename, data) {
    descartesJS._externalFilesContent[filename] = data;
  }

  return descartesJS;
})(descartesJS || {});