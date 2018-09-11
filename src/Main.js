/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

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
    cssNode.innerHTML = "applet.DescartesJS,applet,ajs.DescartesJS,ajs{display:none;}";

    // add the style in the head of the document
    document.head.appendChild(cssNode);
  }

  /**
   * Show the hidden applets
   */
  function showApplets() {
    document.getElementById("StyleDescartesApps").innerHTML = "applet.DescartesJS,applet,ajs.DescartesJS,ajs{display:block;}";
  }

  /**
   * Shows applets that are not descartes
   */
  function showNoDescartesJSApplets() {
    document.getElementById("StyleDescartesApps").innerHTML = "applet.DescartesJS,applet,ajs.DescartesJS,ajs{display:none;}";
  }

  /**
   * Find and get the descartes applets in the document
   * @return {Array.<applet>} the descartes applets in the document
   */
  function getDescartesApplets() {
    // get all the applets in the document
    var applets = document.querySelectorAll("applet,ajs");
    var descartesRegExp = /Descartes|DescartesJS|descinst.DescartesWeb2_0.class|Arquimedes|Discurso/i;

    // create an array to hold the applets
    var tmpArrayApplets = [];

    for (var i=0, l=applets.length; i<l; i++) {
      if ( descartesRegExp.test(applets[i].getAttribute("code")) ) {
        tmpArrayApplets.push(applets[i]);
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
   * Remove extra data included in a previous interpretation
   */
  function removeDescartesAppContainers() {
    // remove elements with "DescartesAppContainer" class
    var toBeRemoved = document.querySelectorAll(".DescartesAppContainer");

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
  hideApplets();
  //////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Function to handle the resize of the browser
   * @param {Event} evt the evt of resize the browser
   */
  descartesJS.onResize = function(evt) {
    // if is adaptative then scale it
    if (descartesJS.apps.length > 0) {
      descartesJS.apps[0].scaleToFit();
    }
  }

  /**
   * Function to handle the load evt of the document
   * @param {Event} evt the evt of load the web page
   */
  function onLoad(evt) {
    var fontDiv = document.createElement("div");
    fontDiv.innerHTML = '<div style="font-size:12px;visibility:hidden;">\n'+
                        '<div style="font-family:descartesJS_serif;">\n'+
                            '<span>_</span>\n'+
                            '<span style="font-weight:bold;">_</span>\n'+
                            '<span style="font-style:italic;">_</span>\n'+
                            '<span style="font-weight:bold;font-style:italic;">_</span>\n'+
                        '</div>\n'+
                        '<div style="font-family:descartesJS_sansserif;">\n'+
                            '<span>_</span>\n'+
                            '<span style="font-weight:bold;">_</span>\n'+
                            '<span style="font-style:italic;">_</span>\n'+
                            '<span style="font-weight:bold;font-style:italic;">_</span>\n'+
                        '</div>\n'+
                        '<div style="font-family:descartesJS_monospace;">\n'+
                            '<span>_</span>\n'+
                            '<span style="font-weight:bold;">_</span>\n'+
                            '<span style="font-style:italic;">_</span>\n'+
                            '<span style="font-weight:bold;font-style:italic;">_</span>\n'+
                        '</div>\n'+
                        '<div style="font-family:DJS_symbola;">\n'+
                            '<span>_</span>\n'+
                            '<span style="font-weight:bold;">_</span>\n'+
                            '<span style="font-style:italic;">_</span>\n'+
                            '<span style="font-weight:bold;font-style:italic;">_</span>\n'+
                        '</div>\n'+
                        '<div style="font-family:DJS_extra;">\n'+
                            '<span>_</span>\n'+
                            '<span style="font-weight:bold;">_</span>\n'+
                            '<span style="font-style:italic;">_</span>\n'+
                            '<span style="font-weight:bold;font-style:italic;">_</span>\n'+
                        '</div>\n'+
                        '<div style="font-family:DJS_sansserif;">\n'+
                            '<span>_</span>\n'+
                            '<span style="font-weight:bold;">_</span>\n'+
                            '<span style="font-style:italic;">_</span>\n'+
                            '<span style="font-weight:bold;font-style:italic;">_</span>\n'+
                        '</div>\n'+
                        '<div style="font-family:DJS_monospace;">\n'+
                            '<span>_</span>\n'+
                            '<span style="font-weight:bold;">_</span>\n'+
                            '<span style="font-style:italic;">_</span>\n'+
                            '<span style="font-weight:bold;font-style:italic;">_</span>\n'+
                        '</div>\n'+
                        '<div style="font-family:DJS_serif;">\n'+
                            '<span>_</span>\n'+
                            '<span style="font-weight:bold;">_</span>\n'+
                            '<span style="font-style:italic;">_</span>\n'+
                            '<span style="font-weight:bold;font-style:italic;">_</span>\n'+
                        '</div>\n'+
                    '</div>';
    document.body.appendChild(fontDiv);

    // get the features for interpreting descartes applets
    descartesJS.getFeatures();

    // if has support for canvas start the interpretation
    if (descartesJS.hasCanvas) {
      window.scrollTo(0, 10);

      removeDescartesAppContainers();
      makeDescartesApps();

      window.addEventListener("resize", descartesJS.onResize);

      window.scrollTo(0, 0);
    }
    // if has not support for canvas show the applets and do not interpret
    else {
      showApplets();
    }

    document.body.removeChild(fontDiv);
  }

  /**
   * Function to handle the message between frames
   * @param {Event} evt the evt of receive a message
   */
  descartesJS.onMessage = function(evt) {
    if (descartesJS.apps.length > 0) {
      var data = evt.data;

      if (!data) { return; }

      // set a value to a variable
      if (data.type === "set") {
        if ((typeof(data.value) == "string") || (typeof(data.value) == "number")) {
          descartesJS.apps[0].evaluator.setVariable(data.name, data.value);
        }
        else {
          if ((data.value) && (data.value.rows != undefined)) {
            descartesJS.apps[0].evaluator.matrices[data.name] = data.value;
          }
          else {
            descartesJS.apps[0].evaluator.vectors[data.name] = data.value;
          }
        }
      }

      // update the scene
      else if (data.type === "update") {
        descartesJS.apps[0].update();
      }

      // execute a function
      else if (data.type === "exec") {
        var fun = descartesJS.apps[0].evaluator.getFunction(data.name);
        if (fun) {
          fun.apply(descartesJS.apps[0].evaluator, (data.value.toString()).split(","));
        }
      }

      else if (data.type === "isResizeNeeded") {
        evt.source.postMessage({ type: "doResize" }, '*');
      }

      else if (data.type === "doResize") {
        if (descartesJS.apps.length > 0) {
          descartesJS.apps[0].adjustSize();
        }
      }
    }
  }

  // if the DescartesJS library is loaded multiple times, prevent the collision of diferent versions
  if (descartesJS.loadLib == undefined) {
    descartesJS.loadLib = true;

    // register the onload event
    window.addEventListener("load", onLoad);

    // register the message event, to handle the messages between frames
    window.addEventListener("message", descartesJS.onMessage);

    // add event listener to transitions of spaces
    var trasitionEvents = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd"];
    for (var i=0,l=trasitionEvents.length; i<l; i++) {
      window.addEventListener(trasitionEvents[i], function(evt) {
        descartesJS.onResize(evt);
      });
    }
  }

  return descartesJS;
})(descartesJS || {});
