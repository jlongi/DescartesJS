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

  descartesJS.serif_font     = "descartesJS_serif,DJS_symbola,DJS_extra,DJS_serif,Times,'Times New Roman','Liberation Serif','Nimbus Roman No9 L Regular',serif";
  descartesJS.sansserif_font = "descartesJS_sansserif,DJS_symbola,DJS_sansserif,Helvetica,Arial,'Liberation Sans','Nimbus Sans L',sans-serif";
  descartesJS.monospace_font = "descartesJS_monospace,DJS_symbola,DJS_monospace,'Courier New',Courier,'Liberation Mono','Nimbus Mono L',monospace";

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
    fontCanvas += descartesJS.getFontStyle(fontTokens[1]);

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

  var _font_size;

  /**
   *
   */
  descartesJS.getFontMetrics = function(font) {
    var result = {};

// sans serif
// ascent = -0.0003140767846*(_font_size^2) + 0.921017849*_font_size + 0.7767317469;
// descent = -0.0005851175551*(_font_size^2) + 0.2674451709*_font_size + 1.0887015962;

// serif
// ascent = -0.00003647238191*(_font_size^2) + 0.8914890964*_font_size + 0.668615541;
// descent = -0.0009807742367*(_font_size^2) + 0.3184618868*_font_size + 0.8663797537;

// monospace
// ascent = 0.0001192160435*(_font_size^2) + 0.7541188887*_font_size + 1.4106492466;
// descent = -0.001256260588*(_font_size^2) + 0.3926891751*_font_size + 0.57969422598;

    _font_size = parseInt( font.match(/(\d+\.*)+px/)[0] );
    if (font.match("sansserif")) {
      result.ascent = -0.0003140767846*(_font_size^2) + 0.921017849*_font_size + 0.7767317469;
      result.descent = -0.0005851175551*(_font_size^2) + 0.2674451709*_font_size + 1.0887015962;
      result.h = result.ascent + result.descent;
      result.baseline = result.ascent;
    }
    else if (font.match("serif")) {
      result.ascent = -0.00003647238191*(_font_size^2) + 0.8914890964*_font_size + 0.668615541;
      result.descent = -0.0009807742367*(_font_size^2) + 0.3184618868*_font_size + 0.8663797537;
      result.h = result.ascent + result.descent;
      result.baseline = result.ascent;
    }
    else if (font.match("monospace")) {
      result.ascent = 0.0001192160435*(_font_size^2) + 0.7541188887*_font_size + 1.4106492466;
      result.descent = -0.001256260588*(_font_size^2) + 0.3926891751*_font_size + 0.57969422598;
      result.h = result.ascent + result.descent;
      result.baseline = result.ascent;
    }

    return result;
  }

  return descartesJS;
})(descartesJS || {});
