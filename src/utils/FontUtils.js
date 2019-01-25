/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  var fontTokens;
  var fontCanvas;
  var name;
  var style;

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
    style = "";
    fontStyle = fontStyle.toLowerCase();

    // bold text
    if (fontStyle == "bold") {
      style += "Bold ";
    } 
    // italic text
    else if ( (fontStyle == "italic") || (fontStyle == "italics")) {
      style += "Italic ";
    }
    // bold and italic text
    else if (fontStyle == "bold+italic") {
      style += "Italic Bold ";
    }

    return style;
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
   * @param {Number} the height of an element
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

  /**
   * Object that have the metric values of diferent type fonts
   */
  // var font_metric = {
  //   // sans serif
  //   ss_5: { a: 5, d: 3 },
  //   ss_6: { a: 5, d: 3 },
  //   ss_7: { a: 6, d: 3 },
  //   ss_8: { a: 7, d: 3 },
  //   ss_9: { a: 9, d: 4 },
  //   ss_10: { a: 10, d: 4 },
  //   ss_11: { a: 11, d: 4 },
  //   ss_12: { a: 12, d: 4 },
  //   ss_13: { a: 13, d: 4 },
  //   ss_14: { a: 13, d: 4 },
  //   ss_15: { a: 14, d: 4 },
  //   ss_16: { a: 15, d: 4 },
  //   ss_17: { a: 15, d: 5 },
  //   ss_18: { a: 16, d: 5 },
  //   ss_19: { a: 18, d: 5 },
  //   ss_20: { a: 19, d: 5 },
  //   ss_21: { a: 19, d: 6 },
  //   ss_22: { a: 20, d: 6 },
  //   ss_23: { a: 21, d: 6 },
  //   ss_24: { a: 21, d: 7 },
  //   ss_25: { a: 23, d: 6 },
  //   ss_26: { a: 25, d: 7 },
  //   ss_27: { a: 26, d: 7 },
  //   ss_28: { a: 26, d: 7 },
  //   ss_29: { a: 27, d: 7 },
  //   ss_30: { a: 28, d: 8 },
  //   ss_31: { a: 28, d: 8 },
  //   ss_32: { a: 29, d: 8 },
  //   ss_33: { a: 31, d: 8 },
  //   ss_34: { a: 32, d: 8 },
  //   ss_35: { a: 32, d: 9 },
  //   ss_36: { a: 33, d: 9 },
  //   ss_37: { a: 34, d: 10 },
  //   ss_38: { a: 34, d: 10 },
  //   ss_39: { a: 35, d: 10 },
  //   ss_40: { a: 36, d: 10 },
  //   ss_41: { a: 38, d: 11 },
  //   ss_42: { a: 38, d: 11 },
  //   ss_43: { a: 39, d: 11 },
  //   ss_44: { a: 40, d: 11 },
  //   ss_45: { a: 40, d: 11 },
  //   ss_46: { a: 42, d: 11 },
  //   ss_47: { a: 43, d: 11 },
  //   ss_48: { a: 45, d: 11 },
  //   ss_49: { a: 45, d: 13 },
  //   ss_50: { a: 46, d: 13 },
  //   ss_51: { a: 47, d: 13 },
  //   ss_52: { a: 48, d: 13 },
  //   ss_53: { a: 48, d: 14 },
  //   ss_54: { a: 49, d: 14 },
  //   ss_55: { a: 51, d: 14 },
  //   ss_56: { a: 52, d: 14 },
  //   ss_57: { a: 52, d: 14 },
  //   ss_58: { a: 53, d: 14 },
  //   ss_59: { a: 53, d: 14 },
  //   ss_60: { a: 54, d: 14 },
  //   ss_61: { a: 55, d: 15 },
  //   ss_62: { a: 56, d: 15 },
  //   ss_63: { a: 57, d: 15 },
  //   ss_64: { a: 58, d: 15 },
  //   ss_65: { a: 59, d: 16 },
  //   ss_66: { a: 60, d: 16 },
  //   ss_67: { a: 60, d: 16 },
  //   ss_68: { a: 61, d: 16 },
  //   ss_69: { a: 62, d: 17 },
  //   ss_70: { a: 63, d: 17 },
  //   ss_71: { a: 64, d: 17 },
  //   ss_72: { a: 65, d: 17 },
  //   ss_73: { a: 66, d: 17 },
  //   ss_74: { a: 66, d: 17 },
  //   ss_75: { a: 67, d: 17 },
  //   ss_76: { a: 68, d: 17 },
  //   ss_77: { a: 70, d: 18 },
  //   ss_78: { a: 70, d: 18 },
  //   ss_79: { a: 71, d: 18 },
  //   ss_80: { a: 72, d: 18 },
  //   ss_81: { a: 73, d: 20 },
  //   ss_82: { a: 73, d: 20 },
  //   ss_83: { a: 74, d: 20 },
  //   ss_84: { a: 75, d: 20 },
  //   ss_85: { a: 77, d: 20 },
  //   ss_86: { a: 77, d: 20 },
  //   ss_87: { a: 78, d: 20 },
  //   ss_88: { a: 79, d: 20 },
  //   ss_89: { a: 80, d: 20 },
  //   ss_90: { a: 80, d: 20 },
  //   ss_91: { a: 81, d: 20 },
  //   ss_92: { a: 83, d: 20 },
  //   ss_93: { a: 84, d: 20 },
  //   ss_94: { a: 84, d: 20 },
  //   ss_95: { a: 85, d: 20 },
  //   ss_96: { a: 86, d: 20 },
  //   ss_97: { a: 87, d: 20 },
  //   ss_98: { a: 87, d: 20 },
  //   ss_99: { a: 89, d: 20 },

  //   ss_100: { a: 78, d: 26 },
  //   ss_101: { a: 78, d: 26 },
  //   ss_102: { a: 78, d: 26 },
  //   ss_103: { a: 78, d: 26 },
  //   ss_104: { a: 78, d: 26 },
  //   ss_105: { a: 78, d: 26 },
  //   ss_106: { a: 78, d: 26 },
  //   ss_107: { a: 78, d: 26 },
  //   ss_108: { a: 78, d: 26 },
  //   ss_109: { a: 78, d: 26 },
  //   ss_110: { a: 78, d: 26 },
  //   ss_111: { a: 78, d: 26 },
  //   ss_112: { a: 78, d: 26 },
  //   ss_113: { a: 78, d: 26 },
  //   ss_114: { a: 78, d: 26 },
  //   ss_115: { a: 78, d: 26 },
  //   ss_116: { a: 78, d: 26 },
  //   ss_117: { a: 78, d: 26 },
  //   ss_118: { a: 78, d: 26 },
  //   ss_119: { a: 78, d: 26 },
  //   ss_120: { a: 78, d: 26 },
  //   ss_121: { a: 78, d: 26 },
  //   ss_122: { a: 78, d: 26 },
  //   ss_123: { a: 78, d: 26 },
  //   ss_124: { a: 78, d: 26 },
  //   ss_125: { a: 78, d: 26 },
  //   ss_126: { a: 78, d: 26 },
  //   ss_127: { a: 78, d: 26 },
  //   ss_128: { a: 78, d: 26 },
  //   ss_129: { a: 78, d: 26 },

  //   // serif
  //   s_5: { a: 4, d: 4 },
  //   s_6: { a: 5, d: 4 },
  //   s_7: { a: 6, d: 4 },
  //   s_8: { a: 7, d: 4 },
  //   s_9: { a: 9, d: 4 },
  //   s_10: { a: 10, d: 3 },
  //   s_11: { a: 11, d: 4 },
  //   s_12: { a: 12, d: 4 },
  //   s_13: { a: 12, d: 4 },
  //   s_14: { a: 13, d: 4 },
  //   s_15: { a: 13, d: 5 },
  //   s_16: { a: 15, d: 5 },
  //   s_17: { a: 15, d: 5 },
  //   s_18: { a: 16, d: 5 },
  //   s_19: { a: 16, d: 6 },
  //   s_20: { a: 17, d: 6 },
  //   s_21: { a: 18, d: 6 },
  //   s_22: { a: 20, d: 6 },
  //   s_23: { a: 20, d: 7 },
  //   s_24: { a: 21, d: 7 },
  //   s_25: { a: 23, d: 7 },
  //   s_26: { a: 23, d: 7 },
  //   s_27: { a: 24, d: 8 },
  //   s_28: { a: 26, d: 8 },
  //   s_29: { a: 26, d: 8 },
  //   s_30: { a: 27, d: 8 },
  //   s_31: { a: 28, d: 9 },
  //   s_32: { a: 28, d: 9 },
  //   s_33: { a: 29, d: 9 },
  //   s_34: { a: 31, d: 9 },
  //   s_35: { a: 32, d: 10 },
  //   s_36: { a: 32, d: 10 },
  //   s_37: { a: 33, d: 10 },
  //   s_38: { a: 34, d: 10 },
  //   s_39: { a: 34, d: 12 },
  //   s_40: { a: 35, d: 12 },
  //   s_41: { a: 37, d: 12 },
  //   s_42: { a: 38, d: 12 },
  //   s_43: { a: 39, d: 12 },
  //   s_44: { a: 40, d: 12 },
  //   s_45: { a: 41, d: 13 },
  //   s_46: { a: 41, d: 13 },
  //   s_47: { a: 42, d: 13 },
  //   s_48: { a: 43, d: 13 },
  //   s_49: { a: 44, d: 15 },
  //   s_50: { a: 45, d: 15 },
  //   s_51: { a: 45, d: 15 },
  //   s_52: { a: 46, d: 15 },
  //   s_53: { a: 48, d: 15 },
  //   s_54: { a: 48, d: 15 },
  //   s_55: { a: 49, d: 15 },
  //   s_56: { a: 50, d: 15 },
  //   s_57: { a: 51, d: 15 },
  //   s_58: { a: 52, d: 15 },
  //   s_59: { a: 53, d: 15 },
  //   s_60: { a: 54, d: 15 },
  //   s_61: { a: 54, d: 17 },
  //   s_62: { a: 55, d: 17 },
  //   s_63: { a: 56, d: 17 },
  //   s_64: { a: 57, d: 17 },
  //   s_65: { a: 58, d: 17 },
  //   s_66: { a: 59, d: 17 },
  //   s_67: { a: 60, d: 17 },
  //   s_68: { a: 61, d: 17 },
  //   s_69: { a: 61, d: 18 },
  //   s_70: { a: 62, d: 18 },
  //   s_71: { a: 63, d: 18 },
  //   s_72: { a: 64, d: 18 },
  //   s_73: { a: 65, d: 19 },
  //   s_74: { a: 66, d: 19 },
  //   s_75: { a: 67, d: 19 },
  //   s_76: { a: 67, d: 19 },
  //   s_77: { a: 68, d: 20 },
  //   s_78: { a: 70, d: 20 },
  //   s_79: { a: 71, d: 20 },
  //   s_80: { a: 71, d: 20 },
  //   s_81: { a: 72, d: 21 },
  //   s_82: { a: 73, d: 21 },
  //   s_83: { a: 73, d: 21 },
  //   s_84: { a: 75, d: 21 },
  //   s_85: { a: 76, d: 21 },
  //   s_86: { a: 77, d: 21 },
  //   s_87: { a: 77, d: 21 },
  //   s_88: { a: 78, d: 21 },
  //   s_89: { a: 79, d: 21 },
  //   s_90: { a: 81, d: 21 },
  //   s_91: { a: 81, d: 21 },
  //   s_92: { a: 82, d: 21 },
  //   s_93: { a: 83, d: 21 },
  //   s_94: { a: 83, d: 21 },
  //   s_95: { a: 84, d: 21 },
  //   s_96: { a: 86, d: 21 },
  //   s_97: { a: 87, d: 21 },
  //   s_98: { a: 87, d: 21 },
  //   s_99: { a: 88, d: 21 },

  //   s_100: { a: 78, d: 26 },
  //   s_101: { a: 78, d: 26 },
  //   s_102: { a: 78, d: 26 },
  //   s_103: { a: 78, d: 26 },
  //   s_104: { a: 78, d: 26 },
  //   s_105: { a: 78, d: 26 },
  //   s_106: { a: 78, d: 26 },
  //   s_107: { a: 78, d: 26 },
  //   s_108: { a: 78, d: 26 },
  //   s_109: { a: 78, d: 26 },
  //   s_110: { a: 78, d: 26 },
  //   s_111: { a: 78, d: 26 },
  //   s_112: { a: 78, d: 26 },
  //   s_113: { a: 78, d: 26 },
  //   s_114: { a: 78, d: 26 },
  //   s_115: { a: 78, d: 26 },
  //   s_116: { a: 78, d: 26 },
  //   s_117: { a: 78, d: 26 },
  //   s_118: { a: 78, d: 26 },
  //   s_119: { a: 78, d: 26 },
  //   s_120: { a: 78, d: 26 },
  //   s_121: { a: 78, d: 26 },
  //   s_122: { a: 78, d: 26 },
  //   s_123: { a: 78, d: 26 },
  //   s_124: { a: 78, d: 26 },
  //   s_125: { a: 78, d: 26 },
  //   s_126: { a: 78, d: 26 },
  //   s_127: { a: 78, d: 26 },
  //   s_128: { a: 78, d: 26 },
  //   s_129: { a: 78, d: 26 },

  //   // monospace
  //   m_5: { a: 4, d: 3 },
  //   m_6: { a: 5, d: 3 },
  //   m_7: { a: 6, d: 3 },
  //   m_8: { a: 6, d: 3 },
  //   m_9: { a: 9, d: 4 },
  //   m_10: { a: 9, d: 4 },
  //   m_11: { a: 10, d: 5 },
  //   m_12: { a: 11, d: 5 },
  //   m_13: { a: 11, d: 6 },
  //   m_14: { a: 11, d: 7 },
  //   m_15: { a: 12, d: 6 },
  //   m_16: { a: 13, d: 6 },
  //   m_17: { a: 14, d: 7 },
  //   m_18: { a: 14, d: 7 },
  //   m_19: { a: 15, d: 7 },
  //   m_20: { a: 16, d: 7 },
  //   m_21: { a: 16, d: 8 },
  //   m_22: { a: 17, d: 8 },
  //   m_23: { a: 17, d: 9 },
  //   m_24: { a: 19, d: 9 },
  //   m_25: { a: 21, d: 9 },
  //   m_26: { a: 21, d: 9 },
  //   m_27: { a: 22, d: 9 },
  //   m_28: { a: 22, d: 10 },
  //   m_29: { a: 23, d: 10 },
  //   m_30: { a: 24, d: 10 },
  //   m_31: { a: 25, d: 11 },
  //   m_32: { a: 26, d: 11 },
  //   m_33: { a: 26, d: 11 },
  //   m_34: { a: 27, d: 11 },
  //   m_35: { a: 28, d: 11 },
  //   m_36: { a: 28, d: 12 },
  //   m_37: { a: 28, d: 11 },
  //   m_38: { a: 30, d: 11 },
  //   m_39: { a: 31, d: 12 },
  //   m_40: { a: 31, d: 12 },
  //   m_41: { a: 32, d: 14 },
  //   m_42: { a: 32, d: 14 },
  //   m_43: { a: 33, d: 14 },
  //   m_44: { a: 34, d: 14 },
  //   m_45: { a: 35, d: 14 },
  //   m_46: { a: 36, d: 14 },
  //   m_47: { a: 37, d: 14 },
  //   m_48: { a: 37, d: 14 },
  //   m_49: { a: 38, d: 17 },
  //   m_50: { a: 38, d: 17 },
  //   m_51: { a: 39, d: 17 },
  //   m_52: { a: 41, d: 17 },
  //   m_53: { a: 41, d: 18 },
  //   m_54: { a: 42, d: 18 },
  //   m_55: { a: 43, d: 18 },
  //   m_56: { a: 43, d: 18 },
  //   m_57: { a: 44, d: 19 },
  //   m_58: { a: 46, d: 19 },
  //   m_59: { a: 46, d: 19 },
  //   m_60: { a: 47, d: 19 },
  //   m_61: { a: 47, d: 21 },
  //   m_62: { a: 48, d: 21 },
  //   m_63: { a: 49, d: 21 },
  //   m_64: { a: 49, d: 22 },
  //   m_65: { a: 51, d: 21 },
  //   m_66: { a: 52, d: 21 },
  //   m_67: { a: 52, d: 21 },
  //   m_68: { a: 53, d: 21 },
  //   m_69: { a: 53, d: 22 },
  //   m_70: { a: 54, d: 22 },
  //   m_71: { a: 55, d: 22 },
  //   m_72: { a: 56, d: 22 },
  //   m_73: { a: 57, d: 23 },
  //   m_74: { a: 58, d: 23 },
  //   m_75: { a: 58, d: 23 },
  //   m_76: { a: 59, d: 23 },
  //   m_77: { a: 59, d: 24 },
  //   m_78: { a: 60, d: 24 },
  //   m_79: { a: 62, d: 24 },
  //   m_80: { a: 62, d: 24 },
  //   m_81: { a: 63, d: 25 },
  //   m_82: { a: 64, d: 25 },
  //   m_83: { a: 64, d: 25 },
  //   m_84: { a: 65, d: 25 },
  //   m_85: { a: 65, d: 25 },
  //   m_86: { a: 67, d: 25 },
  //   m_87: { a: 68, d: 25 },
  //   m_88: { a: 68, d: 25 },
  //   m_89: { a: 69, d: 25 },
  //   m_90: { a: 70, d: 25 },
  //   m_91: { a: 70, d: 25 },
  //   m_92: { a: 71, d: 25 },
  //   m_93: { a: 72, d: 25 },
  //   m_94: { a: 73, d: 25 },
  //   m_95: { a: 74, d: 25 },
  //   m_96: { a: 74, d: 25 },
  //   m_97: { a: 75, d: 25 },
  //   m_98: { a: 76, d: 25 },
  //   m_99: { a: 77, d: 25 },

  //   m_100: { a: 78, d: 26 },
  //   m_101: { a: 78, d: 26 },
  //   m_102: { a: 78, d: 26 },
  //   m_103: { a: 78, d: 26 },
  //   m_104: { a: 78, d: 26 },
  //   m_105: { a: 78, d: 26 },
  //   m_106: { a: 78, d: 26 },
  //   m_107: { a: 78, d: 26 },
  //   m_108: { a: 78, d: 26 },
  //   m_109: { a: 78, d: 26 },
  //   m_110: { a: 78, d: 26 },
  //   m_111: { a: 78, d: 26 },
  //   m_112: { a: 78, d: 26 },
  //   m_113: { a: 78, d: 26 },
  //   m_114: { a: 78, d: 26 },
  //   m_115: { a: 78, d: 26 },
  //   m_116: { a: 78, d: 26 },
  //   m_117: { a: 78, d: 26 },
  //   m_118: { a: 78, d: 26 },
  //   m_119: { a: 78, d: 26 },
  //   m_120: { a: 78, d: 26 },
  //   m_121: { a: 78, d: 26 },
  //   m_122: { a: 78, d: 26 },
  //   m_123: { a: 78, d: 26 },
  //   m_124: { a: 78, d: 26 },
  //   m_125: { a: 78, d: 26 },
  //   m_126: { a: 78, d: 26 },
  //   m_127: { a: 78, d: 26 },
  //   m_128: { a: 78, d: 26 },
  //   m_129: { a: 78, d: 26 },
  // }

  var metricCache = {};

  var _aux_canvas = document.createElement("canvas");
  var _aux_ctx;
  var _font_size;
  var _canvas_size;
  var _baselineOffset;
  var _imageData;
  var _data;
  var _top;
  var _bottom;

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

    // if (metricCache[font]) {
    //   return metricCache[font];
    // }

    // _font_size = parseInt( font.match(/(\d+\.*)+px/)[0] );
    // var _font_prefix;
    // if (font.match("sansserif")) {
    //   _font_prefix = "ss_";
    // }
    // else if (font.match("serif")) {
    //   _font_prefix = "s_";
    // }
    // else if (font.match("monospace")) {
    //   _font_prefix = "m_";
    // }

    // var _f_metric = font_metric[_font_prefix + _font_size];

    // var result = { ascent:   _f_metric.a, 
    //                descent:  _f_metric.d,
    //                h:        _f_metric.a + _f_metric.d, 
    //                baseline: _f_metric.a
    //              };

    // metricCache[font] = result;

    // return result;
  }

  return descartesJS;
})(descartesJS || {});