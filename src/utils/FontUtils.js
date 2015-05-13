/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * Converts a Descartes font string, to a canvas font string
   * @param {String} fontStr the Descartes font string
   * @return {String} the canvas font string
   */
  descartesJS.convertFont = function(fontStr) {
    if (fontStr == "") {
      return fontStr;
    }

    fontTokens = fontStr.split(",");
    fontCanvas = "";

    // bold text
    if (fontTokens[1].toLowerCase() == "bold") {
      fontCanvas += "Bold ";
    } 
    // italic text
    else if ( (fontTokens[1].toLowerCase() == "italic") || (fontTokens[1].toLowerCase() == "italics")) {
      fontCanvas += "Italic ";
    }
    // bold and italic text
    else if (fontTokens[1].toLowerCase() == "bold+italic") {
      fontCanvas += "Italic Bold ";
    }

    fontName = ((fontTokens[0].split(" "))[0]).toLowerCase();
    
    // the font size
    fontCanvas += fontTokens[2] + "px ";

    // serif font
    if ((fontName === "serif") || (fontName === "times new roman") || (fontName === "timesroman") || (fontName === "times")) {
      fontCanvas += "descartesJS_serif,Times,'Times New Roman', serif";
    }
    // sans serif font
    else if ((fontName === "sansserif") || (fontName === "arial") || (fontName === "helvetica")) {
      fontCanvas += "descartesJS_sansserif,Arial,Helvetica,Sans-serif";
    }
    // monospace font
    else {
      fontCanvas += "descartesJS_monospace,Courier,'Courier New',Monospace";
    }

    return fontCanvas;
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
      height = Math.floor(height/2+2-height/16);
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
  var font_metric = {
    // sans serif
    ss_5: { a: 5, d: 3 },
    ss_6: { a: 5, d: 3 },
    ss_7: { a: 6, d: 3 },
    ss_8: { a: 7, d: 3 },
    ss_9: { a: 9, d: 4 },
    ss_10: { a: 10, d: 4 },
    ss_11: { a: 11, d: 4 },
    ss_12: { a: 12, d: 4 },
    ss_13: { a: 13, d: 4 },
    ss_14: { a: 13, d: 4 },
    ss_15: { a: 14, d: 4 },
    ss_16: { a: 15, d: 4 },
    ss_17: { a: 15, d: 5 },
    ss_18: { a: 16, d: 5 },
    ss_19: { a: 18, d: 5 },
    ss_20: { a: 19, d: 5 },
    ss_21: { a: 19, d: 6 },
    ss_22: { a: 20, d: 6 },
    ss_23: { a: 21, d: 6 },
    ss_24: { a: 21, d: 7 },
    ss_25: { a: 23, d: 6 },
    ss_26: { a: 25, d: 7 },
    ss_27: { a: 26, d: 7 },
    ss_28: { a: 26, d: 7 },
    ss_29: { a: 27, d: 7 },
    ss_30: { a: 28, d: 8 },
    ss_31: { a: 28, d: 8 },
    ss_32: { a: 29, d: 8 },
    ss_33: { a: 31, d: 8 },
    ss_34: { a: 32, d: 8 },
    ss_35: { a: 32, d: 9 },
    ss_36: { a: 33, d: 9 },
    ss_37: { a: 34, d: 10 },
    ss_38: { a: 34, d: 10 },
    ss_39: { a: 35, d: 10 },
    ss_40: { a: 36, d: 10 },
    ss_41: { a: 38, d: 11 },
    ss_42: { a: 38, d: 11 },
    ss_43: { a: 39, d: 11 },
    ss_44: { a: 40, d: 11 },
    ss_45: { a: 40, d: 11 },
    ss_46: { a: 42, d: 11 },
    ss_47: { a: 43, d: 11 },
    ss_48: { a: 45, d: 11 },
    ss_49: { a: 45, d: 13 },
    ss_50: { a: 46, d: 13 },
    ss_51: { a: 47, d: 13 },
    ss_52: { a: 48, d: 13 },
    ss_53: { a: 48, d: 14 },
    ss_54: { a: 49, d: 14 },
    ss_55: { a: 51, d: 14 },
    ss_56: { a: 52, d: 14 },
    ss_57: { a: 52, d: 14 },
    ss_58: { a: 53, d: 14 },
    ss_59: { a: 53, d: 14 },
    ss_60: { a: 54, d: 14 },
    ss_61: { a: 55, d: 15 },
    ss_62: { a: 56, d: 15 },
    ss_63: { a: 57, d: 15 },
    ss_64: { a: 58, d: 15 },
    ss_65: { a: 59, d: 16 },
    ss_66: { a: 60, d: 16 },
    ss_67: { a: 60, d: 16 },
    ss_68: { a: 61, d: 16 },
    ss_69: { a: 62, d: 17 },
    ss_70: { a: 63, d: 17 },
    ss_71: { a: 64, d: 17 },
    ss_72: { a: 65, d: 17 },
    ss_73: { a: 66, d: 17 },
    ss_74: { a: 66, d: 17 },
    ss_75: { a: 67, d: 17 },
    ss_76: { a: 68, d: 17 },
    ss_77: { a: 70, d: 18 },
    ss_78: { a: 70, d: 18 },
    ss_79: { a: 71, d: 18 },
    ss_80: { a: 72, d: 18 },
    ss_81: { a: 73, d: 20 },
    ss_82: { a: 73, d: 20 },
    ss_83: { a: 74, d: 20 },
    ss_84: { a: 75, d: 20 },
    ss_85: { a: 77, d: 20 },
    ss_86: { a: 77, d: 20 },
    ss_87: { a: 78, d: 20 },
    ss_88: { a: 79, d: 20 },
    ss_89: { a: 80, d: 20 },
    ss_90: { a: 80, d: 20 },
    ss_91: { a: 81, d: 20 },
    ss_92: { a: 83, d: 20 },
    ss_93: { a: 84, d: 20 },
    ss_94: { a: 84, d: 20 },
    ss_95: { a: 85, d: 20 },
    ss_96: { a: 86, d: 20 },
    ss_97: { a: 87, d: 20 },
    ss_98: { a: 87, d: 20 },
    ss_99: { a: 89, d: 20 },


    // serif
    s_5: { a: 4, d: 4 },
    s_6: { a: 5, d: 4 },
    s_7: { a: 6, d: 4 },
    s_8: { a: 7, d: 4 },
    s_9: { a: 9, d: 4 },
    s_10: { a: 10, d: 3 },
    s_11: { a: 11, d: 4 },
    s_12: { a: 12, d: 4 },
    s_13: { a: 12, d: 4 },
    s_14: { a: 13, d: 4 },
    s_15: { a: 13, d: 5 },
    s_16: { a: 15, d: 5 },
    s_17: { a: 15, d: 5 },
    s_18: { a: 16, d: 5 },
    s_19: { a: 16, d: 6 },
    s_20: { a: 17, d: 6 },
    s_21: { a: 18, d: 6 },
    s_22: { a: 20, d: 6 },
    s_23: { a: 20, d: 7 },
    s_24: { a: 21, d: 7 },
    s_25: { a: 23, d: 7 },
    s_26: { a: 23, d: 7 },
    s_27: { a: 24, d: 8 },
    s_28: { a: 26, d: 8 },
    s_29: { a: 26, d: 8 },
    s_30: { a: 27, d: 8 },
    s_31: { a: 28, d: 9 },
    s_32: { a: 28, d: 9 },
    s_33: { a: 29, d: 9 },
    s_34: { a: 31, d: 9 },
    s_35: { a: 32, d: 10 },
    s_36: { a: 32, d: 10 },
    s_37: { a: 33, d: 10 },
    s_38: { a: 34, d: 10 },
    s_39: { a: 34, d: 12 },
    s_40: { a: 35, d: 12 },
    s_41: { a: 37, d: 12 },
    s_42: { a: 38, d: 12 },
    s_43: { a: 39, d: 12 },
    s_44: { a: 40, d: 12 },
    s_45: { a: 41, d: 13 },
    s_46: { a: 41, d: 13 },
    s_47: { a: 42, d: 13 },
    s_48: { a: 43, d: 13 },
    s_49: { a: 44, d: 15 },
    s_50: { a: 45, d: 15 },
    s_51: { a: 45, d: 15 },
    s_52: { a: 46, d: 15 },
    s_53: { a: 48, d: 15 },
    s_54: { a: 48, d: 15 },
    s_55: { a: 49, d: 15 },
    s_56: { a: 50, d: 15 },
    s_57: { a: 51, d: 15 },
    s_58: { a: 52, d: 15 },
    s_59: { a: 53, d: 15 },
    s_60: { a: 54, d: 15 },
    s_61: { a: 54, d: 17 },
    s_62: { a: 55, d: 17 },
    s_63: { a: 56, d: 17 },
    s_64: { a: 57, d: 17 },
    s_65: { a: 58, d: 17 },
    s_66: { a: 59, d: 17 },
    s_67: { a: 60, d: 17 },
    s_68: { a: 61, d: 17 },
    s_69: { a: 61, d: 18 },
    s_70: { a: 62, d: 18 },
    s_71: { a: 63, d: 18 },
    s_72: { a: 64, d: 18 },
    s_73: { a: 65, d: 19 },
    s_74: { a: 66, d: 19 },
    s_75: { a: 67, d: 19 },
    s_76: { a: 67, d: 19 },
    s_77: { a: 68, d: 20 },
    s_78: { a: 70, d: 20 },
    s_79: { a: 71, d: 20 },
    s_80: { a: 71, d: 20 },
    s_81: { a: 72, d: 21 },
    s_82: { a: 73, d: 21 },
    s_83: { a: 73, d: 21 },
    s_84: { a: 75, d: 21 },
    s_85: { a: 76, d: 21 },
    s_86: { a: 77, d: 21 },
    s_87: { a: 77, d: 21 },
    s_88: { a: 78, d: 21 },
    s_89: { a: 79, d: 21 },
    s_90: { a: 81, d: 21 },
    s_91: { a: 81, d: 21 },
    s_92: { a: 82, d: 21 },
    s_93: { a: 83, d: 21 },
    s_94: { a: 83, d: 21 },
    s_95: { a: 84, d: 21 },
    s_96: { a: 86, d: 21 },
    s_97: { a: 87, d: 21 },
    s_98: { a: 87, d: 21 },
    s_99: { a: 88, d: 21 },

    // monospace
    m_5: { a: 4, d: 3 },
    m_6: { a: 5, d: 3 },
    m_7: { a: 6, d: 3 },
    m_8: { a: 6, d: 3 },
    m_9: { a: 9, d: 4 },
    m_10: { a: 9, d: 4 },
    m_11: { a: 10, d: 5 },
    m_12: { a: 11, d: 5 },
    m_13: { a: 11, d: 6 },
    m_14: { a: 11, d: 7 },
    m_15: { a: 12, d: 6 },
    m_16: { a: 13, d: 6 },
    m_17: { a: 14, d: 7 },
    m_18: { a: 14, d: 7 },
    m_19: { a: 15, d: 7 },
    m_20: { a: 16, d: 7 },
    m_21: { a: 16, d: 8 },
    m_22: { a: 17, d: 8 },
    m_23: { a: 17, d: 9 },
    m_24: { a: 19, d: 9 },
    m_25: { a: 21, d: 9 },
    m_26: { a: 21, d: 9 },
    m_27: { a: 22, d: 9 },
    m_28: { a: 22, d: 10 },
    m_29: { a: 23, d: 10 },
    m_30: { a: 24, d: 10 },
    m_31: { a: 25, d: 11 },
    m_32: { a: 26, d: 11 },
    m_33: { a: 26, d: 11 },
    m_34: { a: 27, d: 11 },
    m_35: { a: 28, d: 11 },
    m_36: { a: 28, d: 12 },
    m_37: { a: 28, d: 11 },
    m_38: { a: 30, d: 11 },
    m_39: { a: 31, d: 12 },
    m_40: { a: 31, d: 12 },
    m_41: { a: 32, d: 14 },
    m_42: { a: 32, d: 14 },
    m_43: { a: 33, d: 14 },
    m_44: { a: 34, d: 14 },
    m_45: { a: 35, d: 14 },
    m_46: { a: 36, d: 14 },
    m_47: { a: 37, d: 14 },
    m_48: { a: 37, d: 14 },
    m_49: { a: 38, d: 17 },
    m_50: { a: 38, d: 17 },
    m_51: { a: 39, d: 17 },
    m_52: { a: 41, d: 17 },
    m_53: { a: 41, d: 18 },
    m_54: { a: 42, d: 18 },
    m_55: { a: 43, d: 18 },
    m_56: { a: 43, d: 18 },
    m_57: { a: 44, d: 19 },
    m_58: { a: 46, d: 19 },
    m_59: { a: 46, d: 19 },
    m_60: { a: 47, d: 19 },
    m_61: { a: 47, d: 21 },
    m_62: { a: 48, d: 21 },
    m_63: { a: 49, d: 21 },
    m_64: { a: 49, d: 22 },
    m_65: { a: 51, d: 21 },
    m_66: { a: 52, d: 21 },
    m_67: { a: 52, d: 21 },
    m_68: { a: 53, d: 21 },
    m_69: { a: 53, d: 22 },
    m_70: { a: 54, d: 22 },
    m_71: { a: 55, d: 22 },
    m_72: { a: 56, d: 22 },
    m_73: { a: 57, d: 23 },
    m_74: { a: 58, d: 23 },
    m_75: { a: 58, d: 23 },
    m_76: { a: 59, d: 23 },
    m_77: { a: 59, d: 24 },
    m_78: { a: 60, d: 24 },
    m_79: { a: 62, d: 24 },
    m_80: { a: 62, d: 24 },
    m_81: { a: 63, d: 25 },
    m_82: { a: 64, d: 25 },
    m_83: { a: 64, d: 25 },
    m_84: { a: 65, d: 25 },
    m_85: { a: 65, d: 25 },
    m_86: { a: 67, d: 25 },
    m_87: { a: 68, d: 25 },
    m_88: { a: 68, d: 25 },
    m_89: { a: 69, d: 25 },
    m_90: { a: 70, d: 25 },
    m_91: { a: 70, d: 25 },
    m_92: { a: 71, d: 25 },
    m_93: { a: 72, d: 25 },
    m_94: { a: 73, d: 25 },
    m_95: { a: 74, d: 25 },
    m_96: { a: 74, d: 25 },
    m_97: { a: 75, d: 25 },
    m_98: { a: 76, d: 25 },
    m_99: { a: 77, d: 25 }
  }

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
    if (metricCache[font]) {
      return metricCache[font];
    }

    _font_size = parseInt( font.match(/(\d+\.*)+px/)[0] );
    var _font_prefix;
    if (font.match("sansserif")) {
      _font_prefix = "ss_";
    }
    else if (font.match("serif")) {
      _font_prefix = "s_";
    }
    else if (font.match("monospace")) {
      _font_prefix = "m_";
    }

    var _f_metric = font_metric[_font_prefix + _font_size];

    var result = { ascent:   _f_metric.a, 
                   descent:  _f_metric.d,
                   h:        _f_metric.a + _f_metric.d, 
                   baseline: _f_metric.a
                 };

    metricCache[font] = result;

    return result;

    // if (metricCache[font]) {
    //   return metricCache[font];
    // }

    // _font_size = parseFloat( font.match(/(\d+\.*)+px/)[0] );
    // _canvas_size = _font_size * 2;

    // _aux_canvas.width  = _canvas_size * descartesJS._ratio;
    // _aux_canvas.height = _canvas_size * descartesJS._ratio;
    // _aux_canvas.style.width  = _canvas_size + "px";
    // _aux_canvas.style.height = _canvas_size + "px";
    // _aux_ctx = _aux_canvas.getContext("2d");
    // _aux_ctx.setTransform(descartesJS._ratio, 0, 0, descartesJS._ratio, 0, 0);

    // _baselineOffset = Math.floor( _canvas_size/2 );

    // _aux_ctx.clearRect(0, 0, _canvas_size, _canvas_size);

    // _aux_ctx.font = font;
    // _aux_ctx.fillStyle = "#ff0000";
    // _aux_ctx.fillText("\u00C1p", 0, _baselineOffset);

    // _imageData = _aux_ctx.getImageData(0, 0, _canvas_size, _canvas_size);
    // _data = _imageData.data;

    // _top = 0;
    // _bottom = 0;    

    // // top
    // for (var i=0, l=_data.length; i<l; i+=4) {
    //   if ( (_data[i] === 255) && (_data[i+1] === 0) && (_data[i+2] === 0) ) {
    //     _top = Math.floor(i/(_canvas_size*4));
    //     break;
    //   }
    // }

    // // bottom
    // for (var i=_data.length-40; i>=0; i-=4) {
    //   if ( (_data[i] == 255) && (_data[i+1] === 0) && (_data[i+2] === 0) ) {
    //     _bottom = Math.floor(i/(_canvas_size*4));
    //     break;
    //   }
    // }

    // var sansserif = [];
    // for(var i=0,l=100; i<l; i++) {
    //   if (i<=8) {
    //     sansserif[i] = 3;
    //   }
    //   else if (i<=16) {
    //     sansserif[i] = 4;
    //   }
    //   else if (i<=20) {
    //     sansserif[i] = 5;
    //   }
    //   else if (i==24) {
    //     sansserif[i] = 7
    //   }
    //   else if (i<=25) {
    //     sansserif[i] = 6;
    //   }
    //   else if (i<=29) {
    //     sansserif[i] = 7;
    //   }
    //   else if (i<=34) {
    //     sansserif[i] = 8;
    //   }
    //   else if (i<=36) {
    //     sansserif[i] = 9;
    //   }
    //   else if (i<=40) {
    //     sansserif[i] = 10;
    //   }
    //   else if (i<=48) {
    //     sansserif[i] = 11;
    //   }
    //   else if (i<=52) {
    //     sansserif[i] = 13;
    //   }
    //   else if (i<=60) {
    //     sansserif[i] = 14;
    //   }
    //   else if (i<=64) {
    //     sansserif[i] = 15;
    //   }
    //   else if (i<=68) {
    //     sansserif[i] = 16;
    //   }
    //   else if (i<=76) {
    //     sansserif[i] = 17;
    //   }
    //   else if (i<=80) {
    //     sansserif[i] = 18;
    //   }
    //   else {
    //     sansserif[i] = 20;
    //   }
    // }

    // var serif = [];
    // for(var i=0,l=100; i<l; i++) {
    //   if (i<=9) {
    //     serif[i] = 4;
    //   }
    //   else if (i==10) {
    //     serif[i] = 3;
    //   }
    //   else if (i<=14) {
    //     serif[i] = 4;
    //   }
    //   else if (i<=18) {
    //     serif[i] = 5;
    //   }
    //   else if (i<=22) {
    //     serif[i] = 6;
    //   }
    //   else if (i<=26) {
    //     serif[i] = 7;
    //   }
    //   else if (i<=30) {
    //     serif[i] = 8;
    //   }
    //   else if (i<=34) {
    //     serif[i] = 9;
    //   }
    //   else if (i<=38) {
    //     serif[i] = 10;
    //   }
    //   else if (i<=40) {
    //     serif[i] = 12;
    //   }
    //   else if (i<=44) {
    //     serif[i] = 12;
    //   }
    //   else if (i<=48) {
    //     serif[i] = 13;
    //   }
    //   else if (i<=52) {
    //     serif[i] = 15;
    //   }
    //   else if (i<=60) {
    //     serif[i] = 15;
    //   }
    //   else if (i<=64) {
    //     serif[i] = 17;
    //   }
    //   else if (i<=68) {
    //     serif[i] = 17;
    //   }
    //   else if (i<=72) {
    //     serif[i] = 18;
    //   }
    //   else if (i<=76) {
    //     serif[i] = 19;
    //   }
    //   else if (i<=80) {
    //     serif[i] = 20;
    //   }
    //   else {
    //     serif[i] = 21;
    //   }
    // }

    // var monospace = [];
    // for(var i=0,l=100; i<l; i++) {
    //   if (i<=8) {
    //     monospace[i] = 3;
    //   }
    //   else if (i<=10) {
    //     monospace[i] = 4;
    //   }
    //   else if (i<=12) {
    //     monospace[i] = 5;
    //   }
    //   else if (i==14) {
    //     monospace[i] = 7;
    //   }
    //   else if (i<=16) {
    //     monospace[i] = 6;
    //   }
    //   else if (i<=20) {
    //     monospace[i] = 7;
    //   }
    //   else if (i<=22) {
    //     monospace[i] = 8;
    //   }
    //   else if (i<=27) {
    //     monospace[i] = 9;
    //   }
    //   else if (i<=30) {
    //     monospace[i] = 10;
    //   }
    //   else if (i==36) {
    //     monospace[i] = 12;
    //   }
    //   else if (i<=38) {
    //     monospace[i] = 11;
    //   }
    //   else if (i<=40) {
    //     monospace[i] = 12;
    //   }
    //   else if (i<=48) {
    //     monospace[i] = 14;
    //   }
    //   else if (i<=52) {
    //     monospace[i] = 17;
    //   }
    //   else if (i<=56) {
    //     monospace[i] = 18;
    //   }
    //   else if (i<=60) {
    //     monospace[i] = 19;
    //   }
    //   else if (i==64) {
    //     monospace[i] = 22;
    //   }
    //   else if (i<=68) {
    //     monospace[i] = 21;
    //   }
    //   else if (i<=72) {
    //     monospace[i] = 22;
    //   }
    //   else if (i<=76) {
    //     monospace[i] = 23;
    //   }
    //   else if (i<=80) {
    //     monospace[i] = 24;
    //   }
    //   else {
    //     monospace[i] = 25;
    //   }
    // }


    // if (font.match("sansserif")) {
    //   _bottom = _baselineOffset + sansserif[parseInt(_font_size)];
    // }
    // else if (font.match("serif")) {
    //   _bottom = _baselineOffset + serif[parseInt(_font_size)];
    // }
    // else if (font.match("monospace")) {
    //   _bottom = _baselineOffset + monospace[parseInt(_font_size)];
    // }

    // var result = { ascent: (_baselineOffset - _top), 
    //                descent: (_bottom - _baselineOffset), 
    //                h: (_bottom - _top), 
    //                baseline: (_baselineOffset - _top)
    //              };

    // _aux_ctx.setTransform(1, 0, 0, 1, 0, 0);

    // metricCache[font] = result;

    // return result;
  }

  return descartesJS;
})(descartesJS || {});