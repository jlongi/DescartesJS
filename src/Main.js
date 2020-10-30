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
    getDescartesApplets().forEach(applet => {
      descartesJS.apps.push( new descartesJS.DescartesApp(applet) );
      changeClassDescartesJS(applet);
    });
  }

  /**
   * Hide the applets in the page
   */
  function hideApplets() {
    var cssNode = document.getElementById("StyleDescartesApps");

    if (cssNode) {
      cssNode.remove();
    }

    // create the CSS style to hide the applets
    cssNode = descartesJS.newHTML("style", {
      id   : "StyleDescartesApps",
      type : "text/css",
      rel  : "stylesheet",
    });

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
   * Find and get the descartes applets in the document
   * @return {Array.<applet>} the descartes applets in the document
   */
  function getDescartesApplets() {
    return [...(document.querySelectorAll("applet,ajs"))].filter(applet => {
      return (/Descartes|DescartesJS|descinst.DescartesWeb2_0.class|Arquimedes|Discurso/i).test(applet.getAttribute("code"));
    });
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
    document.querySelectorAll(".DescartesAppContainer").forEach(element => {
      element.remove();
    });
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
    // if is adaptive then scale it
    if (descartesJS.apps.length > 0) {
      descartesJS.apps[0].scaleToFit();
    }
  }

  /**
   * Function to handle the load evt of the document
   * @param {Event} evt the evt of load the web page
   */
  function onLoad(evt) {
    var fontDiv = descartesJS.newHTML("div");
    var str = '<div style="font-size:12px;visibility:hidden;">';
    var font_names = ["descartesJS_serif", "descartesJS_sansserif", "descartesJS_monospace", "DJS_symbol", "DJS_sansserif", "DJS_serif", "DJS_monospace", "DJS_math"];

    font_names.forEach(font => {
      str += '<div style="font-family:'+ font +';"><span>_</span><span style="font-weight:bold;">_</span><span style="font-style:italic;">_</span><span style="font-weight:bold;font-style:italic;">_</span></div>';
    });

    fontDiv.innerHTML = str + '</div>';

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

    fontDiv.remove();
  }

  var applets_cache = Object.create(null);
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

      else if (data.type === "change_config") {
        let new_applets;

        if (applets_cache[data.filename]) {
          new_applets = applets_cache[data.filename];
        }
        else {
          new_applets = descartesJS.newHTML("div");
          new_applets.innerHTML = data.content;
          new_applets = new_applets.getElementsByTagName("param");
          applets_cache[data.filename] = new_applets;
        }

        let base = document.querySelector("base");
        if (!base) {
          base = descartesJS.newHTML("base");
          document.body.appendChild(base);
        }
        base.setAttribute("href", data.filename);
        
        descartesJS.apps[0].children = new_applets;
        descartesJS.apps[0].init();
      }
    }
  }

  // if the DescartesJS library is loaded multiple times, prevent the collision of different versions
  if (descartesJS.loadLib == undefined) {
    descartesJS.loadLib = true;

    // register the onload event
    window.addEventListener("load", onLoad);

    // register the message event, to handle the messages between frames
    window.addEventListener("message", descartesJS.onMessage);

    // add event listener to transitions of spaces
    ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd"].forEach(function(element) {
      window.addEventListener(element, function(evt) {
        descartesJS.onResize(evt);
      });
    });

    // force and update in the scene when all the fonts are ready
    document.fonts.ready.then(function() {
      setTimeout(() => {
        descartesJS.apps.forEach((app) => {
          app.updateControls();
          app.updateSpaces(true);
        });
      }, 500);
    });
  }

  return descartesJS;
})(descartesJS || {});
