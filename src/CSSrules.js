/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Add CSS rules for the lesson
   */
  (function() {
    ////////////////////////////////////////////////////////////////////
    // add metadata for tablets
    ////////////////////////////////////////////////////////////////////
    var head = document.head;

    // try chrome frame // <meta http-equiv="X-UA-Compatible" content="chrome=1">
    var meta = descartesJS.newHTML("meta", {
      "http-equiv" : "X-UA-Compatible",
      content      : "IE=edge,chrome=1",
    });
    // add the metadata to the head of the document
    head.appendChild(meta);

    // add the metadata to the head of the document
    if (!document.querySelector("meta[name=viewport]")) {
      meta = descartesJS.newHTML("meta", {
        name    : "viewport",
        content : "width=device-width,initial-scale=1.0,user-scalable=yes",
      });
      
      head.appendChild(meta);
    }

    meta = descartesJS.newHTML("meta", {
      name    : "mobile-web-app-capable",
      content : "yes",
    });
    // add the metadata to the head of the document
    head.appendChild(meta);

    meta = descartesJS.newHTML("meta", {
      name    : "apple-mobile-web-app-capable",
      content : "yes",
    });
    // add the metadata to the head of the document
    head.appendChild(meta);

    meta = descartesJS.newHTML("meta", {
      name    : "apple-mobile-web-app-status-bar-style",
      content : "black",
    });
    // add the metadata to the head of the document
    head.appendChild(meta);
    ////////////////////////////////////////////////////////////////////

    // try to get the style
    var cssNode = document.getElementById("StyleDescartesApps2");

    // if the style exists, then the lesson was saved before, then remove the style
    if (cssNode) {
      cssNode.remove();
    }

    cssNode = descartesJS.newHTML("style", {
      rel  : "stylesheet",
      type : "text/css",
      id   : "StyleDescartesApps2",
    });

    // add the style to the head of the document
    document.head.insertBefore(cssNode, document.head.firstChild);

    cssNode.innerHTML =
      "body{-webkit-font-smoothing:antialiased;}\n" +

      "#descartesJS_north,#descartesJS_south,#descartesJS_east,#descartesJS_west{background:#c0c0c0;position:absolute;z-index:100;}\n"+

      // progress bar style
      ".PBL{position:absolute;background-color:#f2f2f2;border:none;-webkit-appearance:none;-moz-appearance:none;appearance:none;color:#2daae4;visibility:hidden;border-radius:100vw;}\n" +
      ".PBL::-moz-progress-bar{background:#2daae4;border-radius:inherit;}\n" +
      ".PBL::-webkit-progress-bar{background:#f2f2f2;border-radius:100vw;}\n" +
      ".PBL::-webkit-progress-value{background:#2daae4;border-radius:inherit;}\n" +
      ".PBL::-ms-fill{background:#2daae4;border-radius:inherit;}\n" +

      ".DescartesAppContainer *,.DescartesAppContainer *:before,.DescartesAppContainer *:after{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;}\n" +
      ".DescartesAppContainer{border:none;overflow:hidden;position:relative;top:0;left:0;}\n" +
      ".DescartesCatcher{background-color:rgba(0,0,0,0);cursor:pointer;position:absolute;}\n" +
      ".DescartesLoader{background-color:#fff;overflow:hidden;position:absolute;top:0;left:0;z-index:1000;width:100%;height:100%;display:none;}\n" +
      ".DescartesLoaderImage{position:absolute;background-repeat:no-repeat;background-position:center;overflow:hidden;top:0;left:0;width:100%;height:100%;}\n" +
      ".DescartesSpace2DCanvas,.DescartesSpace3DCanvas,.blocker{touch-action:none;position:absolute;overflow:hidden;left:0;top:0;}\n" +
      ".DescartesSpace2DContainer,.DescartesSpace3DContainer{position:absolute;overflow:hidden;line-height:0;}\n" +

      // style for check box
      ".DescartesCheckboxContainer input[type=checkbox],.DescartesCheckboxContainer input[type=radio]{display: none;}\n" +
      ".DescartesCheckboxContainer input[type=checkbox]+label::after,.DescartesCheckboxContainer input[type=radio]+label::after{position:absolute;left:0px;content:'';padding:0;margin:0;width:100%;height:100%;background:white;border: 1px solid gray;}\n" +
      ".DescartesCheckboxContainer input[type=checkbox]:checked+label::after,.DescartesCheckboxContainer input[type=radio]:checked+label::after{content:'';background:url("+ descartesJS.getSvgCheckbox() +") center center no-repeat;background-size:contain;background-color:white;}\n" +
      ".DescartesCheckbox{position:absolute;}\n" +

      ".DescartesButton{position:absolute;cursor:pointer;}\n" +
      ".DescartesButtonContainer{position:absolute;overflow:hidden;}\n" +
      ".DescartesSpinnerContainer,.DescartesCheckboxContainer,.DescartesTextFieldContainer,.DescartesMenuContainer{background-color:lightgray;position:absolute;overflow:hidden;}\n" +
      ".DescartesSpinnerContainer input,.DescartesCheckboxContainer,.DescartesTextFieldContainer input,.DescartesMenuContainer select{border-radius:0;}\n" +
      ".DescartesSpinnerField,.DescartesTextFieldField,.DescartesMenuField,.DescartesScrollbarField{font-family:"+ descartesJS.sansserif_font +";padding:0 2px;border:solid #666 1px;position:absolute;}\n" +
      ".DescartesSpinnerLabel,.DescartesCheckboxLabel,.DescartesMenuLabel,.DescartesScrollbarLabel,.DescartesTextFieldLabel{font-family:"+ descartesJS.sansserif_font +";font-weight:normal;text-align:center;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;background-color:#e0e4e8;position:absolute;left:0;top:0;}\n" +
      ".DescartesGraphicControl{touch-action:none;border-style:none;position:absolute;}\n" +
      ".DescartesTextAreaContainer{position:absolute;overflow:hidden;background:#F7F7F7;}\n" +
      ".DescartesMenuSelect{font-family:"+ descartesJS.sansserif_font +";padding-top:0;text-align:center;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;position:absolute;border:1px solid #7a8a99; background:#fff url('"+ descartesJS.getSvgMenu() +"') 100%/22px no-repeat;padding:0 22px 0 5px;-webkit-appearance:none;-moz-appearance:none;appearance:none;}\n" +
      ".DescartesMenuSelect::-ms-expand{display:none;}\n" + // corrects the appearance in internet explorer
      ".DescartesScrollbarContainer{touch-action:none;background:#eee;overflow:hidden;position:absolute;}\n" + 
      
      ".DJS_Up,.DJS_Down{cursor:pointer;position:absolute;border-width:1px 0 1px 1px;background-size:cover;background-repeat:no-repeat;}\n" +
      ".DJS_Up{background-image:url('"+ descartesJS.getSvgArrowUp() +"')}\n" +
      ".DJS_Up[active=false]{background-image:url('"+ descartesJS.getSvgArrowUp("8888aa") +"')}\n" +
      ".DJS_Down{background-image:url('"+ descartesJS.getSvgArrowDown() +"')}\n" +
      ".DJS_Down[active=false]{background-image:url('"+ descartesJS.getSvgArrowDown("aa8888") +"')}\n" +

      ".DJS_Gradient{position:absolute;"+ descartesJS.createGradient() +"}\n" +

      (descartesJS.addFonts ? descartesJS.addFonts() : "");
  })();
  // immediately add the style to the document

  return descartesJS;
})(descartesJS || {});
