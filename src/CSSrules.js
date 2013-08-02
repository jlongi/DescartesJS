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
    meta.setAttribute("content", "chrome=1");
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

    // meta = document.createElement("meta");
    // meta.setAttribute("http-equiv", "X-UA-Compatible");
    // meta.setAttribute("content", "IE=edge");
    // // add the metadata to the head of the document
    // head.appendChild(meta);

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

    // reset style
    // cssNode.innerHTML = "html{ color:#000; background:#FFF; }\n" +
    //                     "body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,button,textarea,p,blockquote,th,td{ margin:0; padding:0; }\n" +
    //                     "table{ border-collapse:collapse; border-spacing:0; }\n" +
    //                     "fieldset,img{ border:0; }\n" +
    //                     "address,caption,cite,code,dfn,em,strong,th,var,optgroup{ font-style:inherit; font-weight:inherit; }\n" +
    //                     "del,ins{ text-decoration:none; }\n" +
    //                     "li{ list-style:none; }\n" +
    //                     "caption,th{ text-align:left; }\n" +
    //                     "h1,h2,h3,h4,h5,h6{ font-size:100%; font-weight:normal; }\n" +
    //                     "q:before,q:after{ content:''; }\n" +
    //                     "abbr,acronym{ border:0; font-variant:normal; }\n" +
    //                     "sup,sub{ vertical-align:baseline; }\n" +
    //                     "legend{ color:#000; }\n" +
    //                     "input,button,textarea,select,optgroup,option{ font-family:inherit; font-size:inherit; font-style:inherit; font-weight:inherit; }\n" +
    //                     "input,button,textarea,select{ *font-size:100%; }\n" +

    cssNode.innerHTML = 
                        "body{ text-rendering:geometricPrecision; }\n" +
                        "canvas{ image-rendering:optimizeSpeed; image-rendering:-moz-crisp-edges; image-rendering:-webkit-optimize-contrast; image-rendering:optimize-contrast; -ms-interpolation-mode:nearest-neighbor; }\n" + 
                        "div.DescartesCatcher{ background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; }\n" +
                        "div.DescartesAppContainer{ border:0px solid black; position:relative; overflow:hidden; top:0px; left:0px; }\n" +
                        "div.DescartesLoader{ background-color :#efefef; position:absolute; overflow:hidden; -moz-box-shadow:0px 0px 0px #888; -webkit-box-shadow:0px 0px 100px #888; box-shadow:0px 0px 100px #888; background-image:linear-gradient(bottom, #bbbbbb 0%, #efefef 50%, #bbbbbb 100%); background-image:-o-linear-gradient(bottom, #bbbbbb 0%, #efefef 50%, #bbbbbb 100%); background-image:-moz-linear-gradient(bottom, #bbbbbb 0%, #efefef 50%, #bbbbbb 100%); background-image:-webkit-linear-gradient(bottom, #bbbbbb 0%, #efefef 50%, #bbbbbb 100%); background-image:-ms-linear-gradient(bottom, #bbbbbb 0%, #efefef 50%, #bbbbbb 100%); top:0px; left:0px; }\n" +
                        "div.DescartesLoaderImage{ background-repeat:no-repeat; background-position:center; position:absolute; overflow:hidden; top:0px; left:0px; }\n" +
                        "canvas.DescartesLoaderBar{ position:absolute; overflow:hidden; top:0px; left:0px; }\n" +
                        "canvas.DescartesSpace2DCanvas, canvas.DescartesSpace3DCanvas, div.blocker{ position:absolute; overflow:hidden; left:0px; top:0px; }\n" +
                        "div.DescartesSpace2DContainer, div.DescartesSpace3DContainer{ position:absolute; overflow:hidden; line-height:0px; }\n" + 
                        "canvas.DescartesButton{ position:absolute; cursor:pointer; }\n" +
                        "div.DescartesSpinnerContainer, div.DescartesTextFieldContainer{ background:lightgray; position:absolute; overflow:hidden; }\n" +
                        "input.DescartesSpinnerField, input.DescartesTextFieldField, input.DescartesMenuField, input.DescartesScrollbarField{ font-family:Arial, Helvetica, 'Droid Sans', Sans-serif; padding:0px; border:solid #666666 1px; position:absolute; top:0px; }\n" +
                        "label.DescartesSpinnerLabel, label.DescartesMenuLabel, label.DescartesScrollbarLabel, label.DescartesTextFieldLabel{ font-family:Arial, Helvetica, 'Droid Sans', Sans-serif; font-weight:normal; text-align:center; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; background-color:#e0e4e8; position:absolute; left:0px; top:0px; }\n" +
                        "div.DescartesGraphicControl{ border-style:none; position:absolute; }\n" +
                        "div.DescartesTextAreaContainer{ position:absolute; overflow:hidden; background:#c0d0d8; }\n" +
                        "select.DescartesMenuSelect{ font-family:Arial, Helvetica, 'Droid Sans', Sans-serif; padding-top:0%; text-align:center; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; background-color:white; position:absolute; left:0px; top:0px; }\n" +
                        "div.DescartesScrollbarContainer{ background:#eeeeee; overflow:hidden; position:absolute; }\n";
  }

  // immediately add the style to the document
  addCSSrules();

  return descartesJS;
})(descartesJS || {});