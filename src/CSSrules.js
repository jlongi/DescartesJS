/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib){ return descartesJS; }

  /**
   * Add meta tags needed for tablets
   */
  function addMetaTag() {
    var head = document.head;

    // try chrome frame // <meta http-equiv="X-UA-Compatible" content="chrome=1">
    var meta = document.createElement("meta");
    meta.setAttribute("http-equiv", "X-UA-Compatible");
    meta.setAttribute("content", "IE=edge,chrome=1");
    // add the metadata to the head of the document
    head.appendChild(meta);

    meta = document.createElement("meta");    
    meta.setAttribute("name", "viewport");
    meta.setAttribute("content", "width=device-width, initial-scale=1.0, user-scalable=yes");
    // add the metadata to the head of the document
    head.appendChild(meta);

    meta = document.createElement("meta");
    meta.setAttribute("name", "apple-mobile-web-app-capable");
    meta.setAttribute("content", "yes");
    // add the metadata to the head of the document
    head.appendChild(meta);

    meta = document.createElement("meta");
    meta.setAttribute("name", "apple-mobile-web-app-status-bar-style");
    meta.setAttribute("content", "black-translucent");
    // add the metadata to the head of the document
    head.appendChild(meta);

    // var link = document.createElement("link");
    // link.setAttribute("rel", "apple-touch-icon-precomposed");
    // link.setAttribute("href", "images/descartesLogo.png");
    // // add the link to the head of the document
    // document.head.appendChild(link);
  }
  
  /** 
   * Add CSS rules for the interpreted lesson
   */
  function addCSSrules() {
    // add metadata for tablets
    addMetaTag();
    
    // try to get the style
    var cssNode = document.getElementById("StyleDescartesApps2");
    
    // if the style exists, then the lesson was saved before, then remove the style
    if (cssNode) {
      (cssNode.parentNode).removeChild(cssNode);
    }
    
    cssNode = document.createElement("style");
    cssNode.type = "text/css";
    cssNode.id = "StyleDescartesApps2";
    // cssNode.media = "screen";
    cssNode.setAttribute("rel", "stylesheet");
    
    // add the style to the head of the document
    document.head.appendChild(cssNode); 

    cssNode.innerHTML = 
                        // "body{ }\n" +
                        // "html{ box-sizing: border-box; }\n" +
                        // "*, *:before, *:after { box-sizing: inherit; }\n" +
                        "canvas { image-rendering:optimizeSpeed; image-rendering:crisp-edges; image-rendering:-moz-crisp-edges; image-rendering:-o-crisp-edges; image-rendering:-webkit-optimize-contrast; -ms-interpolation-mode:nearest-neighbor; }\n" +
                        "div.DescartesCatcher{ background-color:rgba(255, 255, 255, 0); cursor:pointer; position:absolute; }\n" +
                        "div.DescartesAppContainer{ border:0px solid black; position:relative; overflow:hidden; top:0px; left:0px; }\n" +
                        "div.DescartesLoader{ background-color :#CACACA; position:absolute; overflow:hidden; top:0px; left:0px; }\n" +
                        "div.DescartesLoaderImage{ background-repeat:no-repeat; background-position:center; position:absolute; overflow:hidden; top:0px; left:0px; }\n" +
                        "canvas.DescartesLoaderBar{ position:absolute; overflow:hidden; top:0px; left:0px; }\n" +
                        "canvas.DescartesSpace2DCanvas, canvas.DescartesSpace3DCanvas, div.blocker{ position:absolute; overflow:hidden; left:0px; top:0px; }\n" +
                        "div.DescartesSpace2DContainer, div.DescartesSpace3DContainer{ position:absolute; overflow:hidden; line-height:0px; }\n" + 
                        "canvas.DescartesButton{ position:absolute; cursor:pointer; }\n" +
                        "div.DescartesButtonContainer{ position:absolute; background-repeat:no-repeat; }\n" +
                        "div.DescartesSpinnerContainer, div.DescartesTextFieldContainer, div.DescartesMenuContainer{ background:lightgray; position:absolute; overflow:hidden; }\n" +
                        "input.DescartesSpinnerField, input.DescartesTextFieldField, input.DescartesMenuField, input.DescartesScrollbarField{ -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; font-family:descartesJS_sansserif,Arial,Helvetica,Sans-serif; padding:0px; border:solid #666 1px; position:absolute; top:0px; }\n" +
                        "label.DescartesSpinnerLabel, label.DescartesMenuLabel, label.DescartesScrollbarLabel, label.DescartesTextFieldLabel{ font-family:descartesJS_sansserif,Arial,Helvetica,Sans-serif; font-weight:normal; text-align:center; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; background-color:#e0e4e8; position:absolute; left:0px; top:0px; }\n" +
                        "div.DescartesGraphicControl{ border-style:none; position:absolute; }\n" +
                        "div.DescartesTextAreaContainer{ position:absolute; overflow:hidden; background:#c0d0d8; }\n" +
                        "select.DescartesMenuSelect{ font-family:descartesJS_sansserif,Arial,Helvetica,Sans-serif; padding-top:0px; text-align:center; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; background-color:white; position:absolute; left:0px; top:0px; }\n" +
                        "div.DescartesScrollbarContainer{ background:#eee; overflow:hidden; position:absolute; }\n" +

                        // style for the internal editor

                        "div.DescartesEditorContainer{ font-family:descartesJS_sansserif,Arial,Helvetica,Sans-serif; position:fixed; left:0px; top:0px; width:100%; height:100%; background-color:#2e2e2e; z-index:10001; }\n" +
                        "div.DescartesEditorTabContainer{ width:100%; height:100%; position:absolute; padding:0px;  }\n" +

                        ".DescartesTabs{ height: 37px; }\n" +
                        ".DescartesTabs > ul{ font-size:18px; list-style:none; padding:0 1px 1px; margin-left:4px; text-align:center; }\n" +
                        ".DescartesTabs > ul > li{ margin-right:1px; padding:8px 8px; float:left; color:#fff; -webkit-user-select:none; -moz-user-select:none; user-select:none; border-radius:7px 7px 0px 0px; background:#0C91EC; background:-moz-linear-gradient(top, #0C91EC 0%, #257AB6 100%); background:-webkit-gradient(linear, left top, left bottom, color-stop(0%,#0C91EC), color-stop(100%,#257AB6)); }\n" +
                        ".DescartesTabs > ul > li:hover{ background:#fff; background:-moz-linear-gradient(top, #FFFFFF 0%, #F3F3F3 10%, #F3F3F3 50%, #FFFFFF 100%); background:-webkit-gradient(linear, left top, left bottom, color-stop(0%,#FFFFFF), color-stop(10%,#F3F3F3), color-stop(50%,#F3F3F3), color-stop(100%,#FFFFFF)); cursor:pointer; color:#000; }\n" +
                        ".DescartesTabs > ul > li.tabActiveHeader{ background:#fff; background:-moz-linear-gradient(top, #FFFFFF 0%, #F3F3F3 10%, #F3F3F3 50%, #FFFFFF 100%); background:-webkit-gradient(linear, left top, left bottom, color-stop(0%,#FFFFFF), color-stop(10%,#F3F3F3), color-stop(50%,#F3F3F3), color-stop(100%,#FFFFFF)); cursor:pointer; color:#000; }\n" +

                        ".DescartesTabscontent{ position:absolute; left:5px; right:5px; top:55px; bottom:45px; overflow:y-scroll; padding:10px 10px 25px; background:#000; background:-moz-linear-gradient(top, #FFFFFF 0%, #FFFFFF 90%, #e4e9ed 100%); background:-webkit-gradient(linear, left top, left bottom, color-stop(0%,#FFFFFF), color-stop(90%,#FFFFFF), color-stop(100%,#e4e9ed)); margin:0px; color:#000; background-color:#000; }\n" +

                        //
                        "div.DescartesConfigPanel{ position:absolute; left:10px; right:10px; top:10px; bottom:10px; overflow:y-scroll; border:solid 1px #000; border-radius:5px; font-size:18px; padding:10px; line-height:1.5em; overflow:auto; }\n" +
                        "div.DescartesLeftPanelClass{ position:absolute; left:10px; top:10px; bottom:10px; width:200px; background-color:; border:1px solid black; overflow:auto; }\n" +
                        "div.DescartesLeftPanelClass li:nth-child(odd){ background-color:#6495ED; }\n" +
                        "div.DescartesLeftPanelClass li:nth-child(even){ background-color:#ED6495; }\n" +
                        // "div.DescartesLeftPanelClass > div{ background-color:yellow; overflow:auto; }\n" +
                        "div.DescartesLeftPanelClass > div > ul{ list-style:none; background:#bbb; padding:5px; }\n" +
                        "div.DescartesLeftPanelClass > div > ul > li{ padding:5px; -webkit-user-select:none; -moz-user-select:none; user-select:none; cursor:pointer; white-space: nowrap; overflow: hidden; }\n" +

                        "div.DescartesRightPanelClass{ position:absolute; left:220px; right: 10px; top:10px; bottom:10px; background-color:; border:1px solid black; overflow:auto; }\n" +

                        "div.DescartesLabelAndElementContainer{ padding:4px 8px; margin:4px; display:inline-block; background-color:lightgray; border-radius:3px; }\n" +
                        "div.DescartesLabelAndElementContainer > select{ font-family:Monospace; font-size:18px; }\n" +
                        "div.DescartesLabelAndElementContainer > input{ font-family:Monospace; font-size:18px; }\n" +

                        //
                        "div.DescarteslistContainer{ font-family:Arial,Helvetica,Sans-serif; font-size:20px; position:absolute; left:5px; right:5px; top:45px; bottom:45px; border-radius:5px; background-color:#DDD; overflow:auto; }\n" +
                        "div.DescarteslistContainer > ul{ margin:5px; padding:5px; padding-bottom:15px; list-style:none; }\n"+
                        "div.DescarteslistContainer > ul > li{ padding:7px; margin:1px; }\n"+
                        "div.DescarteslistContainer li:nth-child(odd){ background-color:#BBB; }\n" +
                        "div.DescarteslistContainer li:nth-child(even){ background-color:#999; }\n" +

                        "div.DescartesExtraInfo{ padding: 12px; }\n" +

                        "span.DescartesSpanName{ background-color:lightblue; margin:5px; }\n" +
                        "span.DescartesSpanValue{ background-color:#333; color:white; margin:0px; padding:5px; border-radius:3px; line-height:1.75em; }\n" +
                        "span.DescartesSpanValue br{ display: none; }\n" +  // prevents breaklines
                        "span.DescartesSpanValue * { display: inline }\n" + // prevents breaklines
                        //

                        "div.Descartes_param_name{ background-color:#669; color:#ee5; margin-bottom:10px; }\n" +

                        ".DescartesToolbarPlace{ -webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box; text-align:center; border-radius:4px 4px 4px 4px;  position:absolute; left:5px; right:5px; top:0px; height:40px; min-width:290px; background: #ccc; padding:4px; }\n" +

                        ".DescartesButtonsPlace{ -webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box; text-align:center; border-radius:4px 4px 4px 4px;  position:absolute; left:5px; right:5px; bottom:0px; height:40px; min-width:290px; background: #ccc; padding:4px; }\n" +
                        
                        "div.DescartesAddPanel{ position:absolute; top:10px; left:10px; width:350px; background-color:white; }\n" +

                        "div.DescarteslistContainer li.DescartesElementSelected{ border:1px solid black; background-color:#D66; }\n" +

                        "input.DescartesEditorButton{ cursor:pointer; width:110px; height:30px; padding:5px 25px; margin:0px 2px; background:#257AB6; border:1px solid #fff; border-radius:7px; box-shadow: inset 0px 1px 0px #3e9cbf, 0px 2px 0px 0px #205c73, 0px 4px 5px #999; color:#fff; font-size:1em; }\n" +
                        "input.DescartesEditorButton:hover, input.DescartesEditorButton:focus{ background-color:#0C91EC; box-shadow:0 0 1px rgba(0,0,0, .75); }\n";

  }

  // immediately add the style to the document
  addCSSrules();

  return descartesJS;
})(descartesJS || {});