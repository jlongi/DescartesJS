/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Agrega una etiqueta de metadatos para especificar el tama
   */
  function addMetaTag() {
    var meta = document.createElement("meta");
    meta.setAttribute("name", "viewport");
//     meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
    meta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=10.0, user-scalable=yes");

    // se agrega el elemento a la cabeza del documento
    document.head.appendChild(meta); 
  }
  
  /** 
   * Agrega reglas CSS para dar formato a todos los elementos
   */
  descartesJS.addCSSrules = function() {
    // se agregan metadatos para la pantalla de tablets
    addMetaTag();
    
    // si ya existe el elemento de estilo entonces hay que quitarlo
    var cssNode = document.getElementById("StyleDescartesApps2");
    
    // si ya existia, significa que la pagina ha sido guardada
    if (cssNode) {
      (cssNode.parentNode).removeChild(cssNode);
    }
    
    cssNode = document.createElement("style");
    cssNode.type = "text/css";
    cssNode.id = "StyleDescartesApps2";
//     cssNode.media = "screen"; // si es necesario hay que ajustar a una pantalla de tablet
    cssNode.setAttribute("rel", "stylesheet");
    
    // se agrega el estilo a la cabeza del documento
    document.head.appendChild(cssNode); 

//     cssNode.innerHTML = "html{ color:#000; background:#FFF; }\n" +
//                         "body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,button,textarea,p,blockquote,th,td{ margin:0; padding:0; }\n" +
//                         "table{ border-collapse:collapse; border-spacing:0; }\n" +
//                         "fieldset,img{ border:0; }\n" +
//                         "address,caption,cite,code,dfn,em,strong,th,var,optgroup{ font-style:inherit; font-weight:inherit; }\n" +
//                         "del,ins{ text-decoration:none; }\n" +
//                         "li{ list-style:none; }\n" +
//                         "caption,th{ text-align:left; }\n" +
//                         "h1,h2,h3,h4,h5,h6{ font-size:100%; font-weight:normal; }\n" +
//                         "q:before,q:after{ content:''; }\n" +
//                         "abbr,acronym{ border:0; font-variant:normal; }\n" +
//                         "sup,sub{ vertical-align:baseline; }\n" +
//                         "legend{ color:#000; }\n" +
//                         "input,button,textarea,select,optgroup,option{ font-family:inherit; font-size:inherit; font-style:inherit; font-weight:inherit; }\n" +
//                         "input,button,textarea,select{ *font-size:100%; }\n" +

    cssNode.innerHTML = 
                        "div.DescartesAppContainer{ border: 0px solid black; position: relative; overflow: hidden; top: 0px; left: 0px; }\n" +
                        "div.DescartesLoader{ background-color : #efefef; position: absolute; overflow: hidden; -moz-box-shadow: 0px 0px 0px #888; -webkit-box-shadow: 0px 0px 100px #888; box-shadow: 0px 0px 100px #888; background-image: linear-gradient(bottom, rgb(187,187,187) 0%, rgb(239,239,239) 50%, rgb(187,187,187) 100%); background-image: -o-linear-gradient(bottom, rgb(187,187,187) 0%, rgb(239,239,239) 50%, rgb(187,187,187) 100%); background-image: -moz-linear-gradient(bottom, rgb(187,187,187) 0%, rgb(239,239,239) 50%, rgb(187,187,187) 100%); background-image: -webkit-linear-gradient(bottom, rgb(187,187,187) 0%, rgb(239,239,239) 50%, rgb(187,187,187) 100%); background-image: -ms-linear-gradient(bottom, rgb(187,187,187) 0%, rgb(239,239,239) 50%, rgb(187,187,                   187) 100%); top: 0px; left: 0px; }\n" +
                        "div.DescartesLoaderImage{ background-repeat: no-repeat; background-position: center; position: absolute; overflow: hidden; top: 0px; left: 0px; }\n" +
                        "canvas.DescartesLoaderBar{ position: absolute; overflow: hidden; top: 0px; left: 0px; }\n" +
                        "canvas.DescartesSpace2DCanvas, canvas.DescartesSpace3DCanvas, div.blocker{ position: absolute; overflow: hidden; left: 0px; top: 0px; }\n" +
                        "div.DescartesSpace2DContainer, div.DescartesSpace3DContainer{ position: absolute; overflow: hidden; line-height: 0px; }\n" + 
                        "canvas.DescartesButton{ position: absolute; cursor: pointer; }\n" +
                        "div.DescartesSpinnerContainer, div.DescartesTextFieldContainer{ background: lightgray; position: absolute; overflow: hidden; }\n" +
                        "input.DescartesSpinnerField, input.DescartesTextFieldField, input.DescartesMenuField, input.DescartesScrollbarField{ font-family: Arial; padding: 0px; border: solid #666666 1px; position: absolute; top: 0px; }\n" +
                        "label.DescartesSpinnerLabel, label.DescartesMenuLabel, label.DescartesScrollbarLabel, label.DescartesTextFieldLabel{ font-family: Arial; font-weight: normal; text-align: center; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; background-color: #e0e4e8; position: absolute; left: 0px; top: 0px; }\n" +
                        "div.DescartesGraphicControl{ border-style: none; position: absolute; }\n" +
                        "div.DescartesTextAreaContainer{ position: absolute; overflow: hidden; background: #c0d0d8; }\n" +
                        "select.DescartesMenuSelect{ font-family: Arial; padding-top: 0%; text-align: center; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; background-color: white; position: absolute; left: 0px; top: 0px; }\n" +
                        "div.DescartesScrollbarContainer{ background: #eeeeee; overflow: hidden; position: absolute; }\n";
  }

  // se ejecuta inmediatamente la addicion de reglas de estilo
  descartesJS.addCSSrules();

  return descartesJS;
})(descartesJS || {});