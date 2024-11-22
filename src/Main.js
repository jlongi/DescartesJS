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
      applet.className = "DescartesJS";
    });
  }

  /**
   * Hide the applets in the page
   */
  function hideApplets() {
    let cssNode = document.getElementById("StyleDescartesApps");

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
   * Find and get the Descartes applets in the document
   * @return {Array.<applet>} the Descartes applets in the document
   */
  function getDescartesApplets() {
    return [...(document.querySelectorAll("applet,ajs"))].filter(applet => {
      return (/Descartes|DescartesJS|descinst.DescartesWeb2_0.class|Arquimedes|Discurso/i).test(applet.getAttribute("code"));
    });
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
   * Get the array of Descartes apps, i.e. javascript interpretations of the Descartes applets
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
  async function onLoad(evt) {
    // wait the load of the fonts for later use
    try {
      let fonts_promises = [];
      ["descartesJS_serif", "descartesJS_sansserif", "descartesJS_monospace"].forEach(font => {
        fonts_promises.push(document.fonts.load(`20px ${font}`)); // Regular
        fonts_promises.push(document.fonts.load(`bold 20px ${font}`)); // Bold
        fonts_promises.push(document.fonts.load(`italic 20px ${font}`)); // Italic
        fonts_promises.push(document.fonts.load(`bold italic 20px ${font}`)); // Bold Italic
      });
      await Promise.all(fonts_promises);
    }
    catch(error) {
      console.log("error", error);
    }

    // get the features for interpreting Descartes applets
    descartesJS.getFeatures();

    // if has support for canvas start the interpretation
    if (descartesJS.hasCanvas) {
      window.scrollTo(0, 100);
      removeDescartesAppContainers();
      makeDescartesApps();
      window.addEventListener("resize", descartesJS.onResize);
      window.scrollTo(0, 0);
    }
    // if has not support for canvas show the applets and do not interpret
    else {
      showApplets();
    }
  }

  var applets_cache = {};
  /**
   * Function to handle the message between frames
   * @param {Event} evt the evt of receive a message
   */
  descartesJS.onMessage = function(evt) {
    if (descartesJS.apps.length > 0) {
      let data = evt.data;

      // empty message
      if (!data) { return; }

      // set a value to a variable, vector or matrix
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
        let fun = descartesJS.apps[0].evaluator.getFunction(data.name);
        if (fun) {
          fun.apply(descartesJS.apps[0].evaluator, (data.value.toString()).split(","));
        }
      }

      // the scene needs a resize then send a message to the sender to do a resize 
      else if (data.type === "isResizeNeeded") {
        evt.source.postMessage({ type: "doResize" }, '*');
      }

      // adjust the size in case is needed
      else if (data.type === "doResize") {
        if (descartesJS.apps.length > 0) {
          descartesJS.apps[0].adjustSize();
        }
      }

      // the iframe needs a change in his configuration
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
        
        descartesJS.apps[0].children = new_applets;
        descartesJS.apps[0].init();
      }

      // the iframe needs a change in his content
      else if (data.type === "change_content") {
        let new_applets = descartesJS.newHTML("div");
        new_applets.innerHTML = data.content;
        new_applets = new_applets.getElementsByTagName("param");
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
  }

  return descartesJS;
})(descartesJS || {});
