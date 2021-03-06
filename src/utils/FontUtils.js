/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  var fontTokens;
  var fontCanvas;
  var name;
  var fontStyleMap = { "bold":"Bold", "italic":"Italic", "italics":"Italic", "bold+italic":"Italic Bold" };

  descartesJS.serif_font     = "descartesJS_serif,DJS_symbol,DJS_serif,Times,'Times New Roman','Liberation Serif','Nimbus Roman No9 L Regular',serif";
  descartesJS.sansserif_font = "descartesJS_sansserif,DJS_symbol,DJS_sansserif,Helvetica,Arial,'Liberation Sans','Nimbus Sans L',sans-serif";
  descartesJS.monospace_font = "descartesJS_monospace,DJS_symbol,DJS_monospace,'Courier New',Courier,'Liberation Mono','Nimbus Mono L',monospace";
  descartesJS.math_font     = "descartesJS_math,DJS_symbol,DJS_math,DJS_serif,Times,'Times New Roman','Liberation Serif','Nimbus Roman No9 L Regular',serif";

  /**
   * Converts a Descartes font string, to a canvas font string
   * @param {String} fontStr the Descartes font string
   * @return {String} the canvas font string
   */
  descartesJS.convertFont = function(fontStr) {
    if (fontStr == "") {
      return "";
    }

    fontTokens = fontStr.split(",");
    fontCanvas = "";

    // font style
    fontCanvas += descartesJS.getFontStyle(fontTokens[1]) + " ";

    // font size
    fontCanvas += fontTokens[2] + "px ";

    // font name
    fontCanvas += descartesJS.getFontName((fontTokens[0].split(" "))[0]);

    return fontCanvas;
  }

  /**
   * 
   */
  descartesJS.getFontName = function(fontName) {
    fontName =  fontName.toLowerCase();
    
    // monospace font
    name = descartesJS.monospace_font;
    
    // serif font
    if ((fontName === "serif") || (fontName === "times new roman") || (fontName === "timesroman") || (fontName === "times")) {
      name = descartesJS.serif_font;
    }
    // sans serif font
    else if ((fontName === "sansserif") || (fontName === "arial") || (fontName === "helvetica")) {
      name = descartesJS.sansserif_font;
    }
    
    return name;
  }

  /**
   * 
   */
  descartesJS.getFontStyle = function(fontStyle) {
    return fontStyleMap[fontStyle.toLowerCase()] || "";
  }

  /**
   * Get the width in pixels of a text 
   * @param {String} text the text to measured
   * @param {String} font the font of the text
   * @return {Number} return the width of the text in pixels
   */
  descartesJS.getTextWidth = function(text, font) {
    descartesJS.ctx.font = font;
    return Math.round( descartesJS.ctx.measureText(text).width );
  }


  /**
   * Get the font size give the height of an element
   * @param {Number} height the height of an element
   * @return {Number} return the best font size of the text that fits in the element
   */
  descartesJS.getFieldFontSize = function(height) {
    height = Math.min(50, height);

    if (height >= 24) {
      height = Math.floor(height/2 +2 -height/16);
    } 
    else if (height >= 20) {
      height = 12;
    } 
    else if (height >= 17) {
      height = 11;
    } 
    else if (height >= 15) {
      height = 10;
    } 
    else {
      height = 9;
    }
    return height;
  }

  return descartesJS;
})(descartesJS || {});
