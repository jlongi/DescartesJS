/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let tmp_css_str = "applet.DescartesJS,applet,ajs.DescartesJS,ajs";

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

    cssNode.innerHTML = tmp_css_str + "{display:none;}";

    // add the style in the head of the document
    document.head.appendChild(cssNode);
  }

  /**
   * Show the hidden applets
   */
  function showApplets() {
    document.getElementById("StyleDescartesApps").innerHTML = tmp_css_str + "{display:block;}";
  }

  /**
   * Find and get the Descartes applets in the document
   * @return {Array.<applet>} the Descartes applets in the document
   */
  function getDescartesApplets() {
    return [...(document.querySelectorAll("applet,ajs"))].filter(applet => {
      return (/Descartes|DescartesJS|DescartesWeb2_0/i).test(applet.getAttribute("code"));
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
   */
  descartesJS.onResize = function() {
    // if is adaptive then scale it
    if (descartesJS.apps.length > 0) {
      descartesJS.apps[0].scaleToFit();
    }
  }

  /**
   * Function to handle the load evt of the document
   */
  async function onLoad() {
    // wait the load of the fonts for later use
    try {
      let fonts_promises = [];
      ["descartesJS_serif", "descartesJS_sansserif", "descartesJS_monospace", "DJS_symbol", "DJS_math"].forEach(font => {
        fonts_promises.push(document.fonts.load(`9px ${font}`)); // Regular
        fonts_promises.push(document.fonts.load(`bold 9px ${font}`)); // Bold
        fonts_promises.push(document.fonts.load(`italic 9px ${font}`)); // Italic
        fonts_promises.push(document.fonts.load(`bold italic 9px ${font}`)); // Bold Italic
      });
      await Promise.all(fonts_promises);
    }
    catch(error) {
      console.log(error);
      return;
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
      let new_applets;

      // empty message
      if (!data) { return; }

      switch (data.type) {

        // set a value to a variable, vector or matrix
        case "set":
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
        break;

        // update the scene
        case "update":
          descartesJS.apps[0].update();
        break;

        // execute a function
        case "exec":
          let fun = descartesJS.apps[0].evaluator.getFunction(data.name);
          if (fun) {
            fun.apply(descartesJS.apps[0].evaluator, (data.value.toString()).split(","));
          }
        break;

        // the scene needs a resize then send a message to the sender to do a resize 
        case "isResizeNeeded":
          evt.source.postMessage({ type: "doResize" }, '*');
        break;

        // adjust the size in case is needed
        case "doResize":
          if (descartesJS.apps.length > 0) {
            descartesJS.apps[0].adjustSize();
          }
        break;

        // the iframe needs a change in his configuration
        case "change_config":
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
        break;

        // the iframe needs a change in his content
        case "change_content":
          new_applets = descartesJS.newHTML("div");
          new_applets.innerHTML = data.content;
          new_applets = new_applets.getElementsByTagName("param");
          descartesJS.apps[0].children = new_applets;
          descartesJS.apps[0].init();
        break;
      } // end switch
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
    ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd"].forEach((element) => {
      window.addEventListener(element, (evt) => {
        descartesJS.onResize(evt);
      });
    });
  }

  return descartesJS;
})(descartesJS || {});
