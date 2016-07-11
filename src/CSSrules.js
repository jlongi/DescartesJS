/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

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
    meta.setAttribute("content", "width=device-width,initial-scale=1.0,user-scalable=yes");
    // add the metadata to the head of the document
    if (!document.querySelector("meta[name=viewport]")) {
      head.appendChild(meta);
    }

    meta = document.createElement("meta");
    meta.setAttribute("name", "apple-mobile-web-app-capable");
    meta.setAttribute("content", "yes");
    // add the metadata to the head of the document
    head.appendChild(meta);

    meta = document.createElement("meta");
    meta.setAttribute("name", "apple-mobile-web-app-status-bar-style");
    meta.setAttribute("content", "black");
    // add the metadata to the head of the document
    head.appendChild(meta);

    meta = document.createElement("meta");
    meta.setAttribute("name", "DescartesJS_author");
    meta.setAttribute("content", "Joel Espinosa Longi");
    // add the metadata to the head of the document
    head.appendChild(meta);

  }

  /**
   * Add CSS rules for the interpreted lesson
   */
  function addCSSrules() {
    // add metadata for tablets
    addMetaTag();

    // try to get the style
    var cssNode = document.getElementById("StyleDescartesApps2");

    // if the style exists, then the lesson was saved before,then remove the style
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
                        // "body{}\n" +
                        "html{box-sizing:border-box;}\n" +
                        "*,*:before,*:after {box-sizing:inherit;}\n" +
                        "canvas {image-rendering:optimizeSpeed;image-rendering:crisp-edges;image-rendering:-moz-crisp-edges;image-rendering:-o-crisp-edges;image-rendering:-webkit-optimize-contrast;-ms-interpolation-mode:nearest-neighbor;}\n" +
                        "div.DescartesCatcher{background-color:rgba(255,255,255,0);cursor:pointer;position:absolute;}\n" +
                        "div.DescartesAppContainer{border:0 solid black;position:relative;overflow:hidden;top:0;left:0;}\n" +
                        "div.DescartesLoader{background-color:#CACACA;position:absolute;overflow:hidden;top:0;left:0;}\n" +
                        "div.DescartesLoaderImage{position:absolute;background-repeat:no-repeat;background-position:center;overflow:hidden;top:0;left:0;}\n" +
                        "canvas.DescartesLoaderBar{position:absolute;overflow:hidden;top:0;left:0;}\n" +
                        "canvas.DescartesSpace2DCanvas,canvas.DescartesSpace3DCanvas,div.blocker{touch-action:none;position:absolute;overflow:hidden;left:0;top:0;}\n" +
                        "div.DescartesSpace2DContainer,div.DescartesSpace3DContainer{position:absolute;overflow:hidden;line-height:0;}\n" +
                        "canvas.DescartesButton{position:absolute;cursor:pointer;}\n" +
                        "div.DescartesButtonContainer{position:absolute;background-repeat:no-repeat;}\n" +
                        "div.DescartesSpinnerContainer,div.DescartesTextFieldContainer,div.DescartesMenuContainer{background:lightgray;position:absolute;overflow:hidden;}\n" +
                        "div.DescartesSpinnerContainer input,div.DescartesTextFieldContainer input,div.DescartesMenuContainer select{border-radius:0;}\n" +
                        "input.DescartesSpinnerField,input.DescartesTextFieldField,input.DescartesMenuField,input.DescartesScrollbarField{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;font-family:descartesJS_sansserif,Arial,Helvetica,Sans-serif;padding:0;border:solid #666 1px;position:absolute;top:0;}\n" +
                        "label.DescartesSpinnerLabel,label.DescartesMenuLabel,label.DescartesScrollbarLabel,label.DescartesTextFieldLabel{font-family:descartesJS_sansserif,Arial,Helvetica,Sans-serif;font-weight:normal;text-align:center;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;background-color:#e0e4e8;position:absolute;left:0;top:0;}\n" +
                        "div.DescartesGraphicControl{touch-action:none;border-style:none;position:absolute;}\n" +
                        "div.DescartesTextAreaContainer{position:absolute;overflow:hidden;background:#c0d0d8;}\n" +
                        "select.DescartesMenuSelect{font-family:descartesJS_sansserif,Arial,Helvetica,Sans-serif;padding-top:0;text-align:center;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;background-color:white;position:absolute;left:0;top:0;}\n" +
                        "div.DescartesScrollbarContainer{touch-action:none;background:#eee;overflow:hidden;position:absolute;}\n" +

                        "tr,td{margin:0;padding:0;}\n" +
                        "table{border-collapse:collapse;border-spacing:0;}\n" +

                        ".TextBlock{display:block;margin:0;padding:0;}\n" +
                        ".TextLine{display:block;white-space:nowrap;margin-bottom:3px;min-height:15px;}\n" +
                        ".TextNode,.DynamicTextNode{display:inline;white-space:pre;line-height:initial !important;}\n" +
                        ".FormulaNode{display:inline-block;padding:2px 4px;margin:0px 1px;}\n" +
                        ".FractionNode{display:inline-table;margin:0 6px;text-align:center;}\n" +
                        ".NumeratorNode{display:inline-block;margin:0;padding:0.025em 5px;width:100%;border-bottom:1px solid black;}\n" +
                        ".DenominatorNode{display:inline-block;margin:0;padding:0.025em 5px;text-align:center;}\n" +
                        ".SuperIndexNode{display:inline-block;}\n" +
                        ".SubIndexNode{display:inline-block;}\n" +
                        ".RadicalNode{display:inline-block;}\n" +
                        ".RadicalSign{display:inline;padding:0;margin-left:-5px;}\n" +
                        ".IndexNode{display:inline-block;padding:0 2px;}\n" +
                        ".RadicandNode{display:inline-block;border-top:1px solid black;padding:0 3px;}\n" +
                        ".SumNode{display:inline-block;}\n" +
                        ".SumContainer{display:inline-table;text-align:center;margin:0 2px;}\n" +
                        ".SigmaSign{display:inline-block;margin:0;width:100%;font-size:130% !important;}\n" +
                        ".SumFromNode{display:inline-block;margin:0;width:100%;}\n" +
                        ".SumToNode{display:inline-block;margin:0;width:100%;}\n" +
                        ".SumWhatNode{display:inline-block;margin:0;margin-right:15px;}\n" +
                        ".IntegralNode{display:inline-block;}\n" +
                        ".IntegralContainer{display:inline-table;text-align:left;margin:0 2px;}\n" +
                        ".IntegralSign{display:inline-block;margin:0;font-size:150% !important;width:auto;}\n" +
                        ".IntegralFromNode{display:inline-block;margin:0;width:100%;}\n" +
                        ".IntegralToNode{display:inline-block;margin:0;width:100%;}\n" +
                        ".IntegralWhatNode{display:inline-block;margin:0;margin-right:15px;}\n" +
                        ".LimitNode{display:inline-block;}\n" +
                        ".LimitContainer{display:inline-flex;flex-direction:column;}\n" +
                        ".LimitSign{display:inline-block;margin:0;width:auto;  }\n" +
                        ".LimitFromToNode{display:inline-block;}\n" +
                        ".LimitFromNode{display:inline-block;}\n" +
                        ".LimitArrow{display:inline-block;margin:0;width:auto;  padding:0 4px;}\n" +
                        ".LimitToNode{display:inline-block;}\n" +
                        ".LimitWhatNode{display:inline-block;margin:0;margin-right:15px;}\n" +
                        ".MatrixNode{display:inline-block;border-left:2px solid black;border-right:2px solid black;vertical-align:middle;margin:0 5px;padding:0;}\n" +
                        ".MatrixElementNode{display:inline-block;margin:0 14px;}\n" +
                        ".CasesNode{display:inline-block;vertical-align:middle;margin:0 5px;padding:0;padding-right:10px;}\n" +
                        ".CasesElementNode{display:inline-block;}\n" +
                        ".CurlyBracket{width:auto;display:inline-flex;flex-direction:column;vertical-align:middle;}\n" +
                        ".CurlyBracket span{display:inline;font-weight:normal;font-style:normal;overflow:hidden;}\n";

 }

  // immediately add the style to the document
  addCSSrules();

  return descartesJS;
})(descartesJS || {});
