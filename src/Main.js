/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  /**
   * Array to store the javascript replacements of the java applets
   * type [DescartesApp]
   * @private
   */
  descartesJS.apps = [];

  /**
   * Make the javascript replacements of the java applets
   */
  function makeDescartesApps() {
    var applets = getDescartesApplets();

    // for all descartes applets in the page make a javascript replacement
    for (var i=0, l=applets.length; i<l; i++) {
      descartesJS.apps.push( new descartesJS.DescartesApp(applets[i]) );
      changeClassDescartesJS(applets[i]);
    }
  }

  /** 
   * Hide the applets in the page
   */
  function hideApplets() {
    var cssNode = document.getElementById("StyleDescartesApps");
    
    if (cssNode) {
      (cssNode.parentNode).removeChild(cssNode);
    }
    
    // create the CSS style to hide the applets
    cssNode = document.createElement("style");
    cssNode.id = "StyleDescartesApps";
    cssNode.type = "text/css";
    cssNode.setAttribute("rel", "stylesheet");
    cssNode.innerHTML = "applet.DescartesJS {display:none;} applet {display:none;}";
    
    // add the style in the head of the document
    document.head.appendChild(cssNode); 
  }
  
  /** 
   * Show the hidden applets
   */
  function showApplets() {
    var cssNode = document.getElementById("StyleDescartesApps");

    cssNode.innerHTML = "applet {display:block;}";
  }
  
  /** 
   * Shows applets that are not descartes
   */
  function showNoDescartesJSApplets() {
    document.getElementById("StyleDescartesApps").innerHTML = "applet.DescartesJS {display:none;}";
  }
  
  /**
   * Find and get the descartes applets in the document
   * @return {Array.<applet>} the descartes applets in the document
   */
  function getDescartesApplets() {
    // get all the applets in the document
    var applets = document.getElementsByTagName("applet");
    var applet_i;
    
    // se crea un arreglo donde guardar los applets encontrados
    var tmpArrayApplets = [];

    for (var i=0, l=applets.length; i<l; i++) {
      applet_i = applets[i];
      if ( (applet_i.getAttribute("code").match("DescartesJS")) || 
           (applet_i.getAttribute("code").match("Descartes.class")) || 
           (applet_i.getAttribute("code").match("descinst.DescartesWeb2_0.class")) ||
           (applet_i.getAttribute("code").match("descinst.Arquimedes.class"))
         ) {
        tmpArrayApplets.push(applet_i);
      }
    }
    
    return tmpArrayApplets;
  }
  
  /**
   * Change the class of an applet to "DescartesJS"
   * @param {<applet>} applet the applet to change the class
   */
  function changeClassDescartesJS(applet) {
    applet.className = "DescartesJS";
  }

  /**
   * Remove extra data included in an previous interpretation
   */
  function removeDescartesAppContainers() {
    // get all html tags
    var allHTMLTags = document.getElementsByTagName("*");
    
    // array to store the elements to be removed
    var toBeRemoved = [];
    
    for (var i=0, l=allHTMLTags.length; i<l; i++) {
      // remove elements with "DescartesAppContainer" class
      if (allHTMLTags[i].className == "DescartesAppContainer") {
        toBeRemoved.push(allHTMLTags[i]);
      }
    }

    // remove the elements in the toBeRemove array
    for (var i=0, l=toBeRemoved.length; i<l; i++) {
      (toBeRemoved[i].parentNode).removeChild(toBeRemoved[i]);
    }
  }
  
  /**
   * Get the array of descartes apps, i.e. javascript interpretations of the descartes applets
   * @return {Array.<DescartesApp>}
   */
  descartesJS.getDescartesApps = function() {
    return descartesJS.apps;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // The following code is executed immediately
  //////////////////////////////////////////////////////////////////////////////////////////////////  
  // if the variable debugDescartesJS exist and is true then hide the applets
  if (!(window.hasOwnProperty('debugDescartesJS') && debugDescartesJS)) { 
    hideApplets();
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////
  
  /**
   * Function to handle the resize of the browser
   * @param {Event} event the event of resize the browser
   */
  descartesJS.onResize = function(event) {
    var spaces;
    for (var i=0, l=descartesJS.apps.length; i<l; i++) {
      spaces = descartesJS.apps[i].spaces;

      for (var j=0, k=spaces.length; j<k; j++) {
        
        spaces[j].findOffset();
      }
    }
  }
  
  /**
   * Function to handle the load event of the document
   * @param {Event} event the event of load the web page
   */
  function onLoad(event) {
    // get the features for interpreting descartes applets
    descartesJS.getFeatures();

    // if has support for canvas start the interpretation
    if (descartesJS.hasCanvasSupport) {
      removeDescartesAppContainers();
      makeDescartesApps();
      showNoDescartesJSApplets();
      window.addEventListener("resize", descartesJS.onResize);

      // scroll the page 1 pixel to remove the address bar when page is done loading in mobile
      setTimeout(function() { window.scrollTo(0, 1); }, 1);
    } 
    // if has not support for canvas show the applets and do not interpret
    else {
      // prompt a message to install chrome frame
      // when the instalation is ready reload the webpage
      // document.location.reload()

      showApplets();
    }
  }
  
  /**
   * Function to handle the message between frames
   * @param {Event} event the event of receive a message
   */
  descartesJS.receiveMessage = function(event) {
    if (descartesJS.apps.length > 0) {
      var data = event.data;
      
      if (!data) {
        return;
      }

      // set a value to a variable
      if (data.type === "set") {
        descartesJS.apps[0].evaluator.setVariable(data.name, data.value);
      }
      
      // update the scene
      else if (data.type === "update") {
        descartesJS.apps[0].update();
      }
            
      // execute a function
      else if (data.type === "exec") {
        var fun = descartesJS.apps[0].evaluator.getFunction(data.name);
        var params = [];
        
        if (data.value !== "") {
          params = (data.value.toString()).split(",");
        }
        
        if (fun) {
          fun.apply(descartesJS.apps[0].evaluator, params);
        }
      }
    }
  }

  // if the library is loaded multiple times
  if (descartesJS.loadLib === undefined) {
    descartesJS.loadLib = true;

    // register the onload event
    window.addEventListener("load", onLoad);
    
    // register the message event, to handle the messages between frames
    window.addEventListener("message", descartesJS.receiveMessage);
  }

  return descartesJS;
})(descartesJS || {});