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
    let head = document.head;

    // 
    let meta = descartesJS.newHTML("meta", {
      name    : "viewport",
      content : "width=device-width,initial-scale=1.0,user-scalable=yes",
    });
    // add the metadata to the head of the document
    if (!document.querySelector("meta[name=viewport]")) {
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
    let cssNode = document.getElementById("StyleDescartesApps2");

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

      ".DescartesAppContainer *,.DescartesAppContainer *:before,.DescartesAppContainer *:after{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;transform:translate3d(0,0,0);}\n" +
      ".DescartesAppContainer{border:none;overflow:hidden;position:relative;top:0;left:0;}\n" +
      ".DescartesCatcher{background-color:rgba(0,0,0,0);cursor:pointer;position:absolute;}\n" +
      ".DescartesLoader{background-color:#fff;overflow:hidden;position:absolute;top:0;left:0;z-index:1000;width:100%;height:100%;display:none;}\n" +
      ".DescartesLoaderImage{position:absolute;background-repeat:no-repeat;background-position:center;overflow:hidden;top:0;left:0;width:100%;height:100%;}\n" +
      ".DescartesSpace2DCanvas,.DescartesSpace3DCanvas,.blocker{touch-action:none;position:absolute;overflow:hidden;left:0;top:0;}\n" +
      ".DescartesSpace2DContainer,.DescartesSpace3DContainer{position:absolute;overflow:hidden;line-height:0;}\n" +

      // style for checkbox
      ".DescartesCheckboxContainer input[type=checkbox],.DescartesCheckboxContainer input[type=radio]{display: none;}\n" +
      ".DescartesCheckboxContainer input[type=checkbox]+label::after{position:absolute;left:0px;content:'';padding:0;margin:0;width:100%;height:100%;background:#fff;border:1px solid gray;}\n" +
      ".DescartesCheckboxContainer input[type=checkbox]:checked+label::after{content:'';background:url("+ descartesJS.getSvgCheckbox() +") center center no-repeat;background-size:contain;background-color:#fff;}\n" +
      ".DescartesCheckboxContainer input[type=radio]+label::after{position:absolute;left:0px;content:'';padding:0;margin:0;width:100%;height:100%;background:#fff;border:1px solid gray;border-radius:50%;}\n" +
      ".DescartesCheckboxContainer input[type=radio]:checked+label::after{content:'';background:url("+ descartesJS.getSvgRadio() +") center center no-repeat;background-size:contain;background-color:#fff;}\n" +
      ".DescartesCheckbox{position:absolute;}\n" +

      ".TextfieldCover{position:absolute;overflow:hidden;background-color:transparent;cursor:pointer;}\n" +
      "input[type=text]{-webkit-appearance:none;}\n" +

      ".DescartesButton{position:absolute;cursor:pointer;}\n" +
      ".DescartesButtonContainer,.DescartesSpinnerContainer,.DescartesCheckboxContainer,.DescartesTextFieldContainer,.DescartesMenuContainer{position:absolute;overflow:hidden;}\n" +
      ".DescartesSpinnerContainer input,.DescartesCheckboxContainer,.DescartesTextFieldContainer input,.DescartesMenuContainer select{border-radius:0;}\n" +
      ".DescartesSpinnerField,.DescartesTextFieldField,.DescartesMenuField,.DescartesScrollbarField,.DescartesSliderField{font-family:"+ descartesJS.sansserif_font +";padding:0 2px;border:solid #666 1px;position:absolute;}\n" +
      "input[type=text]:disabled,.DescartesMenuSelect:disabled{background-color:#e3e3e3;cursor:not-allowed;opacity:1;}\n" +
      ".DescartesSpinnerLabel,.DescartesCheckboxLabel,.DescartesMenuLabel,.DescartesScrollbarLabel,.DescartesSliderLabel,.DescartesTextFieldLabel{font-family:"+ descartesJS.sansserif_font +";font-weight:normal;text-align:center;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;position:absolute;left:0;top:0;}\n" +
      ".DescartesGraphicControl{touch-action:none;border-style:none;position:absolute;}\n" +
      ".DescartesTextAreaContainer{position:absolute;overflow:hidden;background:#F7F7F7;resize:none;border:solid #666 1px;}\n" +
      ".DescartesTextAreaContainer *{border:none;}\n" +
      ".DescartesMenuSelect{font-family:"+ descartesJS.sansserif_font +";padding-top:0;text-align:center;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;position:absolute;border:1px solid #7a8a99; background:#fff url('"+ descartesJS.getSvgMenu() +"') 100%/22px no-repeat;padding:0 22px 0 5px;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none;}\n" +
      ".DescartesMenuSelect::-ms-expand{display:none;}\n" + // corrects the appearance in internet explorer
      
      ".DescartesScrollbarContainer,.DescartesSliderContainer{touch-action:none;background:#eee;overflow:hidden;position:absolute;}\n" + 
      ".DescartesSliderContainer{background:transparent;}\n" +
      ".DescartesRange{-webkit-appearance:none;appearance:none;background:transparent;cursor: pointer;}\n" +
      ".DescartesRange::-webkit-slider-runnable-track{background:var(--track_color);height:var(--track_h);border-radius:var(--track_h);}\n" +
      ".DescartesRange::-moz-range-track{background:var(--track_color);height:var(--track_h);border-radius:var(--track_h);}\n" +
      ".DescartesRange::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;margin-top:calc(var(--track_h) / 2 - var(--thumb_size) / 2);border-radius:50%;background-color:var(--thumb_color);height:var(--thumb_size);width:var(--thumb_size);}\n" +
      ".DescartesRange::-moz-range-thumb{border:none;border-radius:50%;background-color:var(--thumb_color);height:var(--thumb_size);width:var(--thumb_size);}\n" +

      ".DJS_Up,.DJS_Down{cursor:pointer;position:absolute;border-width:1px 0 1px 1px;background-size:cover;background-repeat:none;background-position:center;}\n" +
      
      ".DJS_Up[horizontal=false]{background-color:#f0f8ff;background-image:" + descartesJS.createGradient(50,100) + ", url('"+ descartesJS.getSvgArrowUp() +"');}\n" +
      ".DJS_Up[horizontal=true]{background-color:#f0f8ff;background-image:" + descartesJS.createGradient(50,100,90) + ", url('"+ descartesJS.getSvgArrowUp(true) +"');}\n" +
      ".DJS_Up[active=false]::after{cursor:not-allowed;content:'';position:absolute;left:0;top:0;width:100%;height:100%;background:rgba(255,255,255,0.3);}\n" +

      ".DJS_Down[horizontal=false]{background-color:#f0f8ff;background-image:" + descartesJS.createGradient(0,50) + ", url('"+ descartesJS.getSvgArrowDown() +"');}\n" +
      ".DJS_Down[horizontal=true]{background-color:#f0f8ff;background-image:" + descartesJS.createGradient(50,100,-90) + ", url('"+ descartesJS.getSvgArrowDown(true) +"');}\n" +
      ".DJS_Down[active=false]::after{cursor:not-allowed;content:'';position:absolute;left:0;top:0;width:100%;height:100%;background:rgba(255,255,255,0.3);}\n" +

      ".DescartesKeyboardContainer{position:absolute;left:0;top:0;width:100%;height:100%;background-color:rgba(0,0,0,0.1);z-index:1000;}\n" +
      ".DescartesKeysContainer{display:flex;flex-direction:row;flex-wrap:wrap;background-color:#c0c0c0;border-radius:4px;border:1px solid rgba(0,0,0,0.3);box-shadow:0 0 8px 0 rgba(0,0,0,0.75);box-sizing: content-box;}\n" +

      // keys
      ".DescartesKeysContainer > div, .new_line_btn{margin:5px 0 0 5px;display:inline-block;min-width:40px;min-height:40px;max-height:40px;line-height:35px;background-color:#ebeff3;font-family:"+ descartesJS.math_font +";font-size:18px;font-weight:bold;color:black;cursor:pointer;text-align:center;border-radius:4px;border:1px solid rgba(0,0,0,0.3);box-shadow:0 1px 2px 0 rgba(0,0,0,0.25);transform-origin:center;user-select:none;}\n" +
      ".DescartesKeysContainer > div:hover, .new_line_btn:hover{background-color:rgba(0,0,0,0.05);transform:scale(1.1);}\n" +
      ".DescartesKeysContainer > div:active, .new_line_btn:active{transform:scale(0.95);}\n" +
      ".DescartesKeyboardDisplay{font-family:"+ descartesJS.sansserif_font +";padding:0 2px;border:solid #666 1px;text-align:left;background-color:white;position:absolute;overflow:hidden;outline:2px solid black; resize: none;}\n" +
      ".custom_keyboard{display:none;}\n" +

      ".DJS_Gradient{position:absolute;display:none;}\n" +

      (descartesJS.addSymbolFont ? descartesJS.addSymbolFont() : "") +

      (descartesJS.addFonts ? descartesJS.addFonts() : "");
  })();
  // immediately add the style to the document

  return descartesJS;
})(descartesJS || {});
