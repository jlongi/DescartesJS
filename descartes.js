/**
 * @preserve Joel Espinosa Longi
 * joel.espinosa@amite.mx
 * j.longi@gmail.com
 * LGPL - http://www.gnu.org/licenses/lgpl.html
 * 2013-01-31
 */

/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  var PI2 = Math.PI*2;
  var trecientosSesentaEntreDosPi = 360/PI2;
  var dosPiEntreTrecientosSesenta = PI2/360;
  var MathFloor = Math.floor;

  descartesJS.rangeOK = 1;
  
  /**
   * Transforma un numero en radianes a grados
   * @param {Number} r es el numero en radianes a transformar
   * @return {Number} regresa el numero transformado a grados
   */
  descartesJS.radToDeg = function(r) {
    return r*trecientosSesentaEntreDosPi;
  }
  
  /**
   * Transforma un numero en grados a radianes
   * @param {Number} d es el numero en grados a transformar
   * @return {Number} regresa el numero transformado a radianes
   */
  descartesJS.degToRad = function(d) {
    return d*dosPiEntreTrecientosSesenta;
  }

  /**
   * Extiende un objeto por medio de herencia 
   * @param {Object} child es el objeto que va a extender
   * @param {Object} parent es el objeto que se va a extender
   */
  descartesJS.extend = function(child, parent) {
    // otros navegadores excepto ie9
    if (child.prototype.__proto__) {
      child.prototype.__proto__ = parent.prototype;
    }
    // ie9 
    else { 
      // se copia cada funcion del padre
      for( var i in parent.prototype ) { 
        if (parent.prototype.hasOwnProperty(i)) {
          child.prototype[i] = parent.prototype[i];
        }
      }
    }
    // se agrega la propiedad uber (super), para poder ejecutar los metodos del objeto extendido
    child.prototype.uber = parent.prototype;
  }
  
  /**
   * Convierte la especificacion de una tipografia definida para Descartes en una especificacion de tipografia para los textos de canvas
   * @param {String} fontStr es la especificacion de tipografia que se va a convertir
   */
  descartesJS.convertFont = function(fontStr) {
    if (fontStr == "") {
      return fontStr;
    }
    var fontTokens = fontStr.split(",");
    var fontCanvas = "";

    // si esta en negritas
    if (fontTokens[1].toLowerCase() == "bold") {
      fontCanvas += "Bold ";
    } 
    // si esta en italicas
    else if ( (fontTokens[1].toLowerCase() == "italic") || (fontTokens[1].toLowerCase() == "italics")) {
      fontCanvas += "Italic ";
    }
    // si esta en negritas e italicas
    else if (fontTokens[1].toLowerCase() == "bold+italic") {
      fontCanvas += "Italic Bold ";
    }
    
    // el tamano de la tipografia
    fontCanvas += fontTokens[2] + "px ";
    
    var fontName = ((fontTokens[0].split(" "))[0]).toLowerCase();

    // si es serif
    if ((fontName == "serif") || (fontName == "times new roman") || (fontName == "timesroman")) {
      fontCanvas += "'Times New Roman'";
    }
    // si es sansserif
    else if ((fontName == "sansserif") || (fontName == "arial") || (fontName == "helvetica")) {
      fontCanvas += "Arial";
    }
    // si es mono espaciada
    else {
      fontCanvas += "'Courier New'";
    }

    return fontCanvas;
  }

  /**
   * Dibuja una linea
   * @param {2DContext} ctx el contexto de canvas donde dibujar
   * @param {Number} x1 la posicion en x del punto inicial
   * @param {Number} y1 la posicion en y del punto inicial
   * @param {Number} x1 la posicion en x del punto final
   * @param {Number} y1 la posicion en y del punto final
   */
  descartesJS.drawLine = function(ctx, x1, y1, x2, y2, strokeStyle, lineWidth) {
    ctx.lineWidth = lineWidth || 1;
    ctx.strokeStyle = strokeStyle || "black";
    var desp = (ctx.lineWidth%2) ? .5 : 0;
    
    ctx.beginPath();
    ctx.moveTo(MathFloor(x1)+desp, MathFloor(y1)+desp);
    ctx.lineTo(MathFloor(x2)+desp, MathFloor(y2)+desp);
    ctx.stroke();
  }
  
  /**
   * Obtiene un color apartir de una especificacion de color de descartes, que puede o no tener expresiones
   * @param {DescartesJS.Evaluator} evaluator el evaluador de expresiones
   * @param {Object} color la especificacion de color de descartes
   * @return {String} regresa el color correspondiente
   */
  descartesJS.getColor = function(evaluator, color) {
    // si el color es una cadena entonces simplemente se regresa
    if ( typeof(color) == "string" ) {
      return color;
    }
    
    // si el color es una expresion entonces se evalua y se devuelve una cadena que representa el color
    else {
      var colorExpr = evaluator.evalExpression(color);
      var r = MathFloor(colorExpr[0][0]*255);
      var g = MathFloor(colorExpr[0][1]*255);
      var b = MathFloor(colorExpr[0][2]*255);
      var a = (1-colorExpr[0][3]);

      return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }    
  }
  
  /**
   * Detecta algunas caracteristicas necesarias para decidir como interpretar las lecciones
   */
  descartesJS.getFeatures = function() {
    // Detecta si el navegador tiene activado Java
    descartesJS.hasJavaSupport = navigator.javaEnabled();

    // Detecta si el navegador soporta eventos de touch
    var system = navigator.appVersion.toLowerCase();
    descartesJS.hasTouchSupport = ((window.hasOwnProperty) && (window.hasOwnProperty("ontouchstart"))) || (system.match("android")&&true);

    descartesJS.hasTouchSupport = ((navigator.userAgent).toLowerCase()).match("qt") ? false : descartesJS.hasTouchSupport;
    
    // Detecta si el navegador soporta canvas
    var elem = document.createElement('canvas');
    descartesJS.hasCanvasSupport = (elem.getContext && elem.getContext('2d'));
    if (descartesJS.hasCanvasSupport) {
      // contexto de render que se utiliza para medir el ancho de textos
      descartesJS.ctx = document.createElement("canvas").getContext("2d");
    }

    // chrome no soporta mas de 20 decimales en la funcion toFixed
    if (system.match("chrome")) {
      Number.prototype.toFixed = function(decimals) {
        decimals = (decimals<0) ? 0 : parseInt(decimals);
        var strNum = this.toString();
        var indexOfDot = strNum.indexOf(".");
        var extraCero = "";

        if (indexOfDot === -1) {
          if (decimals > 0) {
            extraCero = ".";
          }
          for (var i=0; i<decimals; i++) {
            extraCero += "0";
          }

          return strNum + extraCero;
        }
        else {
          var diff = strNum.length - indexOfDot - 1;
          if ( diff >= decimals) {
            return strNum.substring(0, indexOfDot+1 +decimals)
          }
          else {
            for (var i=0; i<decimals-diff; i++) {
              extraCero += "0";
            }
            return strNum + extraCero;
          }
        }
      }
    }
    
//     // Detecta si el navegador soporta WebGL
//     var elem = document.createElement('canvas');
//     descartesJS.hasWebGLSupport = false;
//     
//     if (elem.getContext) {
//       try {
//         descartesJS.hasWebGLSupport = elem.getContext("webgl");
//       } catch(e) {
//         try {
//           descartesJS.hasWebGLSupport = elem.getContext("experimental-webgl");
//         } catch(e) {
//           try {
//             descartesJS.hasWebGLSupport = elem.getContext("moz-webgl");
//           } catch(e) {
//             try {
//               descartesJS.hasWebGLSupport = elem.getContext("webkit-3d");
//             } catch(e) {
//               console.log("El navegador no soporta WebGL");
//             }
//           }
//         }
//       }
//     }

  }
    
  /**
   * Simplifica las peticiones de ajax
   * @return un objeto de ajax listo para hacer peticiones
   */
  function newXMLHttpRequest() {
    var xhr = false;
    
    // objeto XMLHttpRequest nativo que ie no tiene
    if (window.XMLHttpRequest) {
      try { 
        xhr = new XMLHttpRequest();
      }
      catch (e) { 
        xhr = false;
      }
    }
    // soporte para ie, hay que crear un objeto de Windows ActiveX
    else if (window.ActiveXObject) {
      try { 
        xhr = new ActiveXObject("Msxml2.XMLHTTP"); 
      }
      catch(e) {
        try { 
          xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch(e) {
          xhr = false;
        }
      }
    }
    
    return xhr;
  }
  
  /**
   * Abre un archivo externo
   * @param {String} filename el nombre del archivo que se quiere abrir
   * @return en contenido del archivo como cadena o null si el archivo no se pudo abrir
   */
  
  descartesJS.openExternalFile = function(filename) {
    var response = null;
    var xhr = newXMLHttpRequest();
    xhr.open("GET", filename, false);
    try {
      xhr.send(null);
      response = xhr.responseText;
        
      ////////////////////////////////////////////////////////////////////////
      // parche para que se puedan cargar archivos codificados en ISO-8859-1
      if (response.match(String.fromCharCode(65533))) {
	      xhr.open("GET", filename, false);
	      xhr.overrideMimeType("text/plain; charset=ISO-8859-1");

	      xhr.send(null);
	      response = xhr.responseText;
      }
      ////////////////////////////////////////////////////////////////////////
    }
    catch (e) {
      console.log("El archivo ", filename, " no se pudo abrir");
      response = null;
    }
    
    return response;
  }
  
  /**
   * Se obtiene la posicion del mouse en coordenadas absolutas
   * @param {Event} evt evento que contiene la posicion del mouse
   * @return {Object} la posicion del mouse en coordenadas absolutas
   */
  descartesJS.getCursorPosition = function(evt) {
    var x, y;

    // posicion del touch
    if (evt.touches) {
      var touch = evt.touches[0];
    
      x = touch.pageX; 
      y = touch.pageY;
    } 
    // posicion del mouse
    else {
      // los demas navegadores
      if (evt.pageX != undefined && evt.pageY != undefined) { 
        x = evt.pageX; 
        y = evt.pageY;
      } 
      // ie
      else { 
        x = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = evt.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
      }
    }

    return {x:x, y:y};
  }

  /**
   * 
   */
  descartesJS.buildSimpleRegularExpressionPattern = function(answer) {
    var tmpAnswer = answer.trim();
    answer = {ignoreAcents: false, ignoreCaps: false, regExp: null}
    
    // se ignoran las mayusculas
    if ((tmpAnswer[0] == tmpAnswer[tmpAnswer.length-1]) && (tmpAnswer[0] == "'")) {
      answer.ignoreCaps = true;
      tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);

      // se ignoran los acentos
      if ((tmpAnswer[0] == "`") && (tmpAnswer[tmpAnswer.length-1] == "´")) {
        answer.ignoreAcents = true;
        tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);
      }
    }
        
    // se ignoran los acentos
    if ((tmpAnswer[0] == "`") && (tmpAnswer[tmpAnswer.length-1] == "´")) {
      answer.ignoreAcents = true;
      tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);

      // se ignoran las mayusculas
      if ((tmpAnswer[0] == tmpAnswer[tmpAnswer.length-1]) && (tmpAnswer[0] == "'")) {
        answer.ignoreCaps = true;
        tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);
      }
    }

    if ((tmpAnswer[0] == "*") && (tmpAnswer[tmpAnswer.length-1] != "*")) {
      tmpAnswer = (tmpAnswer.substring(1)) + "$";
    }

    if ((tmpAnswer[0] != "*") && (tmpAnswer[tmpAnswer.length-1] == "*")) {
      tmpAnswer = "^" + (tmpAnswer.substring(0, tmpAnswer.length-1));
    }
        
    if ((tmpAnswer[0] == "*") && (tmpAnswer[tmpAnswer.length-1] == "*")) {
      tmpAnswer = tmpAnswer.substring(1, tmpAnswer.length-1);
    }
        
    tmpAnswer = tmpAnswer.replace(/\?/g, "[\\S\\s]{1}");

    answer.regExp = tmpAnswer;
    
    return answer;
  }
  
  /**
   * Construye una expresion regular apartir de un patron de respuesta de descartes
   * @param {String} answer el patron de respuesta de descartes del cual se quiere obtener la expresion regular
   * @return {Object} regresa un objeto que contiene informacion sobre si se debe ignorar los acentos y/o las mayusculas, asi como una expresion regular equivalente al patron de respuesta dado
   */
  descartesJS.buildRegularExpresionsPatterns = function(answer) {
    // se construyen expresiones regulares equivalentes a las de descartes
    answer = ((answer.replace(/&squot;/g, "'")).replace(/&amp;/g, "&")).split("|");

    var tempAnswers;
    var answerArray;
    
    for (var i=0, l=answer.length; i<l; i++) {
      tempAnswers = answer[i].split("&");
      answerArray = [];
      
      for (var j=0, k=tempAnswers.length; j<k; j++) {
        answerArray.push( descartesJS.buildSimpleRegularExpressionPattern(tempAnswers[j]) );
      }
      
      answer[i] = answerArray;
    }

    return answer;
  }

  
  /**
   * Quita los acentos de una cadena, asi como la reemplaza la ñ por la n
   * @return la cadena con los acentos removidos y con la ñ reemplazada por la n
   */
  removeAcents = function(value) {
    value = value.toString();
    return value.replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u").replace(/Á/g, "A").replace(/É/g, "E").replace(/Í/g, "I").replace(/Ó/g, "O").replace(/Ú/g, "U").replace(/ñ/g, "n").replace(/Ñ/g, "N");
  }
  
  /**
   * Decide si la respuesta dada cumple con el patron de respuesta ignorando los acentos y las mayusculas
   * @param {String} respPattern un patron de respuesta de descartes
   * @param {String} resp la respuesta que se quiere verificar con el patron de respuesta
   * @return {Number} regresa 1 si la respuesta cumple con el patron de respuesta y cero si no
   */
  descartesJS.escorrecto = function(respPattern, resp) {
    var regExpPattern = descartesJS.buildRegularExpresionsPatterns(respPattern);
    var tempAnswer;
    var answerValue;
    // se reemplzan los acentos en la respuesta que se quiere checar
    resp = (removeAcents(resp)).toLowerCase();

    for (var i=0, l=regExpPattern.length; i<l; i++) {
      tempAnswer = regExpPattern[i];
      answerValue = true;

      for (var j=0, k=tempAnswer.length; j<k; j++) {
        tempAnswer[j].regExp = (removeAcents(tempAnswer[j].regExp)).toLowerCase();
        
        answerValue = answerValue && !!(resp.match(tempAnswer[j].regExp));
      }
      
      if (answerValue) {
        return 1;
      }
    }
    
    return 0;
  }

  /**
   * Decide si la respuesta dada cumple con el patron de respuesta de forma estricta
   * @param {String} respPattern un patron de respuesta de descartes
   * @param {String} resp la respuesta que se quiere verificar con el patron de respuesta
   * @return {Number} regresa 1 si la respuesta cumple con el patron de respuesta y cero si no
   */
  descartesJS.esCorrecto = function(respPattern, resp) {
    var regExpPattern = descartesJS.buildRegularExpresionsPatterns(respPattern);
    var tempAnswer;
    var answerValue;

    for (var i=0, l=regExpPattern.length; i<l; i++) {
      tempAnswer = regExpPattern[i];
      answerValue = true;
      
      for (var j=0, k=tempAnswer.length; j<k; j++) {
        
        if (tempAnswer[j].ignoreAcents) {
          resp = removeAcents(resp);
          tempAnswer[j].regExp = removeAcents(tempAnswer[j].regExp);
        }
        
        if (tempAnswer[j].ignoreCaps) {
          resp = resp.toLowerCase();
          tempAnswer[j].regExp = (tempAnswer[j].regExp).toLowerCase();  
        }
 
        answerValue = answerValue && !!(resp.match(tempAnswer[j].regExp));
      }
      
      if (answerValue) {
        return 1;
      }
    }
    
    return 0;
  }
  
  /**
   * Obtiene el acho en pixeles de un texto
   * @param {String} text el texto que se quiere medir
   * @param {String} font la tipografia necesaria para medir el texto
   * @return {Number} el ancho en pixeles del texto
   */
  descartesJS.getTextWidth = function(text, font) {
    descartesJS.ctx.font = font;

    return descartesJS.ctx.measureText(text).width;
  }

  /**
   *
   */
  descartesJS.getFieldFontSize = function(h) {
    if (h <= 14) {
      return 8; 
    }

    if ((h > 14) && (h <= 16)) {
      return 9;
    }

    if ((h > 16) && (h <= 19)) {
      return 10;
    }

    if ((h > 19) && (h <= 22)) {
      return 11;
    }

    if (h > 22) {
      return parseInt(h - 11);
    }

    return Math.floor(h - (h*.25));
  }

  /**
   *
   */
  descartesJS.getCreativeCommonsLicenseImage = function() {
    var img = new Image();
    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAAfCAYAAABjyArgAAAABHNCSVQICAgIfAhkiAAACpVJREFU" +
                                    "aIHtWm1sU9cZfu61iUYnPP/bJgdhhDbFkVYcCrR0tLHXrVNL01wvgUJDh820tivrkpQQtpEvA4HG" +
                                    "hDoe/dCmNfbaVa1WKszX2oUO3xC0OHESm9Hi/FhloyQq1aY5OGgq8ce7H9f3xI7txKFsdKyPdHSP" +
                                    "z8dzz33Oe77eY46IVBzHXcUXuOkgIo4DQABwuucUeJ4Hz/NQKBTgeQUUPA9ekXryPDiOB89x4DgO" +
                                    "4DiZBQQCJQlJSiKZlEIikZCeyQQSiSSSyQTLS1KSlSciuTEsfjtgY+UmAAAHgGRxFQqFFHjFTFyh" +
                                    "kPJ4RUpkDhzHp+ubEiclbFISM5FIhfR4IlPkZDLJhE0X+nbBxspNUALIFFehhDLjKYWTx0/B4/Fg" +
                                    "cHAQU9GpDKIlqiVYu3YtjN8xouLRR5BIKsDzcalDEjw4cJD6cgaUJGkkANIY4iRxR3x+uN9xIxgM" +
                                    "ZpTX6XQQqgSsWlNW0Md9Xng4APSns+9BqVQyUZVKpRQUSvSK52B73oaJiYmCGqTRaND4i0aUl9+P" +
                                    "eCKBRCKOeDwVEnHE4wlm4emW/PHExzjS9SJGg6MAAIPBAL1eDwAIBAIQRREAUKIrwY7aHfja17+a" +
                                    "8/1XPv4ELzle+lzwbKzcJAn8fu8ZKBXKGWGVi7BIqURrcxvcx9ysglqthiAI0Gq1KC8vBwD09vYi" +
                                    "HA7D7XZjcnKSlRVMAhoad2LxHYsRj8cRi8cRj8cQj8czpwxK4mrkKn769LOIRqMQBAF2ux1arTaj" +
                                    "seFwGPX19XC73VCpVGi3tWd91LXoNdTuqPvc8MjzMJ3tO0t9/eeo39dPQwEfXfggQIJJIEiDl9Rq" +
                                    "NbW1tVEkEqG54HQ6Sa1Ws3oluhI6399HQ4Eh8g71U1//OfL0naUzYg+99+d36XTPKTrx7nHS6XQE" +
                                    "gMxmcwafzDP7HTL328f/kBFKdCU5eRx2Oz3+2ObPxDM2Nkbe/n7y9vfT2NhYQTwAiAcARWoOVioU" +
                                    "UCoyLVev18Pv96O1tRVqtTprGKTDbDYjFAqxoTQaHEWn7XDGXM6zHYm0G/F5fQgGgxAEAY27ds3J" +
                                    "L79DEASMBkcx4vOz9BGfH6PBUawqK8O996xj6b/q6sLzNhtOnj6N3Q27MD4+XhBPent+/9prMKy/" +
                                    "DzWbt6Bm8xYY1t+HMz09c/Kkg/q8feQd8tLIhWFyHHEwy9Hr9fNabS5EIhHS6/WMx/Gig0b+OkID" +
                                    "w1467+0jz3nJit99/4+kK5WsNxQKFcwfCoUIAOl0OmYt8igo+cY3acUyLZV/ez09/eMnCQC1tbXR" +
                                    "wQMHCQAdffvtgnjk9nj7+yW+u9fRj7ZZqHFnA61YpqUVy7TksNvz8uSwYMmKbc/bAEjzrdPpnNdq" +
                                    "c0GtVsPj8bC6toO21F46ZcFcak/N8wheCsJgMGTNcRaLhVm5xWLJyNNqtTAYDBkrezAo8VRUVGDj" +
                                    "pk0YHx/HmZ4erFimxb+mrmHrE1tx6cMPUVVdXRCPVqtFNBpF0H8RAFAp/AC/dXWjo/MQ9rQ0AwBc" +
                                    "3c68PDJ4AKlhK23F5N1CXV0dG+o3ArVaDbvdDgCYmJjAyROn2IFFEplj27Rc73G5XDnjMnLV0ev1" +
                                    "sB3uxEFbB954601UVVfjo8th2A53YunSpXB1OxG8dKkgHhntL0gG95vfvcrSvvfggwCAaDSKT65c" +
                                    "ycsDpASWrcnj8QCQxKmtrWWFRFGEyWSC0WiE0WiE1WrNm9fV1cXyzGYzs2LPWU+a9XLg+BmB/xO4" +
                                    "+5570NF5CGNjY2jc2YCyb92Jd44eRcXDG1CzeQubQ+eCSqWCw+HAHaoleOWVV3KW+fTT63NySAcN" +
                                    "jgPPcRgcHAQACILAhBFFEUajMaOSKIoQRRG1tbUwmUxZeRcuXIDT6WRcLpcLg4OD0gkwJawkriRw" +
                                    "IBDIapjZbGaWazabs/Jz1ZmdFo1GcaanBx2dh2C+ZEHFwxsAAANeLwa8XhQXF4NbpJyTZ5FSicaG" +
                                    "BtyxeDFLG/B6WXyZdlne9gDMgqUPlk9oK1euZAXq6+sBSPNMKBSCx+OBVqvFtm3bmCXr9XqEQiEc" +
                                    "O3YsY48MgMWnolPSe8ClPYHS0lKIoohwOJzRMLmDZscBaQ8qiiJ0Oh1L0+l0WTw/efIptO/dh1V3" +
                                    "rkTN5i346HIYVdXV6Og8hJqtWwviGR8fR1tLKx5/bDPa9+5D+959aGlqAgDs2r07b3syBAaHjOGa" +
                                    "Pp/IPWM2m9lkHgqFYDabWZ58+BAEgeXJSF+8JKPNPDZvfExadOSOLARyWaFKYGlyPJ2no/MQLNu3" +
                                    "48o//o6/hUJw2O3Y09KMqupqWPfvQ9ma1fPyWLZvh2X7dgCAs7sbzu5uXP/0OjZUPIItNY/nbY+M" +
                                    "7PHxX8a69eugK9XB7XbDYrFkWetsyKenEl1Jhh9g1ZoylOhKMniKi4uxp6UZX1q8GCPDw/hZXd0N" +
                                    "8expacb3H3oIly+HAUijTldaOiePDMmCKdOLlT6fyNbscrkwOTmJQCCA5cuXw2q1sjz5mJyeJyN9" +
                                    "yEpnM3l7PIPmtmaoVCq4XC6YTCZWh9K8bOFwGCaTCV1dXVCpVNhRuyPrY3b/sjEnz85dDXjjrTc/" +
                                    "E8/qNatRVV2Nqupq6EpLC+IBUs4e38ggioqKsP7e+zAVnYLZbGaW5Ha7sxYyQJoyKisr8+bJ9evr" +
                                    "69HV1YUlqiU4/5c+TE9PYzo2jVg8hlgsLjmDEnFE/jmJA9YDbC+p1+uh1+uhVqshiiLr9PmcNNei" +
                                    "19BxwMacNLeShzl7BoYHUFRUBGuLFe5jbqjVakQiEVZQFEU4HA7mzDEYDGhtbWUd4HA4WNn0PABY" +
                                    "vnw5wuEwHvjuAzhs78T16WnEZgks+42TiSR8Az4cO3rr3Yw3g4cJ7B3qx6JFRTh/7jxqn5X2v3a7" +
                                    "HXVpc9aNwOVysVPY/gP78fCGhzAdm8Z0LIZ4LIZYfJbAORzw/8vYWLlJmoPlKx2DsRwajQYAYLVa" +
                                    "s7ZOC8Hk5CRbXTUaTcoRn7rFSCaRTM3FlLpyul3BA0CSkkgkpHu0fe17AUgCmUymDB9voZicnITR" +
                                    "aGR1G3/emHKwJ2ZETrsyYovsrMX2dgEBoKbWJvKNDFLgop+e+OETGR41v9+/IE9XuidNMAkUuOgn" +
                                    "38gg7W3fy9L/j8LMj7rnamnI76PADTjcI5EItbW1ZTjc16xdQxc+CNBQwEdNrU23+kNvSWDX9jKa" +
                                    "W5tQaRKgVCpx2HYYr7/2Ostb6JWRdV8b4vE4BgYG8cxTz2A+pE8P8smSiDJOmbN/5+PJV0d+R6GO" +
                                    "pnxtWhDH7NDc2iRZ8kU/dbteJY1GU3CPaTQachxxUOCin4YCPnr51y8XXJeI5oynp83HM1/9Qrhy" +
                                    "lVkoR5YFy6h7rhY1W2vYVY/o6cWJ4yfmvLZ/VHgUBkM5u9A8fvwE9lv3F9DHEnJZS3reQqyO47i8" +
                                    "z4VgtrXOXoTn48srMACsuqsMza0tKF6qSbuNSHc3ImPfKv/xZGJ8HC902nGu99yCP+azTA35eABk" +
                                    "CbxQsXN1UiEccwos4/7y+7GhYgPuWn0XvqJSpf46Jb9ZetHVaBTDQ8M4ffL0goVN/wjWsJtgwbl+" +
                                    "L2T+nG9NuGkCf4EbB09EX77VjbhdQUTcvwFtwhQyXNo3TwAAAABJRU5ErkJggg==";

    return img;
  }

  return descartesJS;
})(descartesJS || {});
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
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathSin = Math.sin;
  var MathFloor = Math.floor;
  var MathRandom = Math.random;
  var MathRound = Math.round;
  var stringfromCharCode = String.fromCharCode;
  
  /**
   * 
   * @constructor 
   * @param {string} key la llave de encriptacion
   */
  descartesJS.Krypto = function(key){
    key = key || 0;
    this.key = key.toString();
  }

  /**
   * @param Number n 
   * @return String
   */
  descartesJS.Krypto.prototype.getKey = function(n) {
    var a1 = 1.0;
    var a2 = 1.4;
    var a3 = 0.6;
    var a4 = 2.2;
   
    var ll = new Array(256);
    for (var i=0; i<256; i++) {
      ll[i] = stringfromCharCode(this.alfanum( MathFloor( Math.abs(7.5*(MathSin(a1*i-n) + MathSin(a2*i+n) + MathSin(a3*i-n) + MathSin(a4*i+n))) ) ));
    }
    
    return ll.join("");
  }
  
  /**
   * @param String s es la cadena a codificar
   * @return String
   */
  descartesJS.Krypto.prototype.encode = function(s) {
    var n = MathFloor(31*MathRandom());
    
    this.key = this.getKey(n);

    var b = stringfromCharCode(this.alfanum(n));
    
    var encriptado = b + this.encripta(s)

    return encriptado;
  }
  
  /**
   * @param String s es la cadena a decodificar
   * @return String
   */
  descartesJS.Krypto.prototype.decode = function(s) {
    var n = this.numalfa( s.charCodeAt(0) );

    this.key = this.getKey(n);

    return this.desencripta(s.substring(1));
  }

  /**
   * @param String 
   * @return String
   */
  descartesJS.Krypto.prototype.encripta = function(OrigMeu) {
    return this.bytesToString( this.encriptaAux(this.stringToBytes(OrigMeu)));
  }
  
  /**
   * @param [Bytes]
   * @return String
   */
  descartesJS.Krypto.prototype.encriptaAux = function(OrigMeu) {
    if (OrigMeu == null) {
      return null;
    }
    
    if (this.key == null) {
      return null;
    }
    
    var encripMeu = new Array(3*OrigMeu.length);
    
    var x, y;
    for (var i=0, l=OrigMeu.length; i<l; i++) {
      x = MathFloor(OrigMeu[i]+128)*256 + MathRound(MathRandom()*255) + MathRound(MathRandom()*255)*256*256;
      y = MathFloor((x<<this.shift(i))/256);

      encripMeu[3*i] =   this.alfanum(y%32); 
      encripMeu[3*i+1] = this.alfanum((y/32)%32);
      encripMeu[3*i+2] = this.alfanum((y/1024)%32);
    }

    return encripMeu;
  }
    
  /**
   * @param String 
   * @return String
   */
  descartesJS.Krypto.prototype.desencripta = function(OrigMeu) {
    return this.bytesToString( this.desencriptaAux(this.stringToBytes(OrigMeu)));
  }
  
  /**
   * @param [Bytes]
   * @return String
   */
  descartesJS.Krypto.prototype.desencriptaAux = function(OrigMeu) {
    if (OrigMeu == null) {
      return null;
    }
    if (this.key == null) {
      return null;
    }

    var desencripMeu = new Array(OrigMeu.length/3);
    
    var x, y;
    var nx;
    for (var i=0, l=desencripMeu.length; i<l; i++) {
      y = this.numalfa(OrigMeu[3*i]) + this.numalfa(OrigMeu[3*i+1])*32 + this.numalfa(OrigMeu[3*i+2])*1024;
      x = MathFloor((y*256)>>this.shift(i));
      
      nx = (MathFloor(x/256)%256)-128;
      if (nx < 0) {
        nx = nx +256;
      }
      
      desencripMeu[i] = nx;
    }
    
    return desencripMeu;   
  }
  
  /**
   * @param Number <Integer>
   * return Number <Byte>
   */
  descartesJS.Krypto.prototype.alfanum = function(k) {
    k = MathFloor(k);
    if (k<10) {
      return 48 + k;
    } else {
      return 87 + k;
    }
  }
  
  /**
   * @param Number <Byte>
   * return Number <Integer>
   */
  descartesJS.Krypto.prototype.numalfa = function(b) {
    if (b<58) {
      return b-48;
    } else {
      return b-87;
    }
  }
  
  /**
   * @param String 
   * return [Bytes]
   */
  descartesJS.Krypto.prototype.stringToBytes = function(OrigMeu) {
    var b = new Array(OrigMeu.length);
    
    for (var i=0, l=OrigMeu.length; i<l; i++) {
      b[i] = OrigMeu.charCodeAt(i);
    }
    
    return b;
  }

  /**
   * @param [bytes]
   * return String 
   */
  descartesJS.Krypto.prototype.bytesToString = function(b) {
    for (var i=0, l=b.length; i<l; i++) {
      b[i] = stringfromCharCode(b[i]);
    }

    return b.join("");
  }
  
  /**
   * @param Number
   * return Number 
   */
  descartesJS.Krypto.prototype.shift = function(i) {
    var a = (this.key).charCodeAt(i%(this.key.length));
    var b = this.numalfa(a);
    var c = MathFloor((b/2)%8);
    if (c == 0) {
      c = 4;
    }
    return c;
  }

  /**
   * @param String s es la cadena a decodificar
   * return byte
   */
  descartesJS.Krypto.prototype.parseByte = function(n) {
    n = parseInt(n);
    n = (n < 0) ? 0 : n;
    n = (n > 255) ? 255 : n;
    
    return n;
  }
  
  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una animacion de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen una animacion de descartes
   */
  descartesJS.Animation = function(parent, values) {
    /**
     * La aplicacion de descartes a la que corresponde la animacion
     * type DescartesApp
     * @private
     */
    this.parent = parent;

    var tmp;
    var evaluator = parent.evaluator;
    var parser = evaluator.parser;
    var algorithmAuxiliary = new descartesJS.Auxiliary(parent);

    this.delay = (values.delay) ? parser.parse(values.delay) : parser.parse("60");
    this.loop = (values.loop) ? values.loop : false;
    this.auto = ((values.auto == undefined) && (this.parent.version == 2)) ? true : values.auto;
    this.controls = values.controls;
    
    // se parsea la expresion init
    this.init = algorithmAuxiliary.splitInstructions(parser, values.init);

    // se parsea la expresion doExpr
    this.doExpr = algorithmAuxiliary.splitInstructions(parser, values.doExpr);

    // se parsea la expresion de while
    if (values.whileExpr) {
      this.whileExpr = parser.parse(values.whileExpr);
    }
    
    var self = this;
    // se construye la funcion a ejecutar durante la animacion
    this.animationExec = function() {
      
      for (var i=0, l=self.doExpr.length; i<l; i++) {
        evaluator.evalExpression(self.doExpr[i]);
      }

      self.parent.update();

      if ( (self.playing) && ((evaluator.evalExpression(self.whileExpr) > 0) || (self.loop)) ) {
        self.timer = setTimeout(self.animationExec, evaluator.evalExpression(self.delay));
      } else {
//         console.log("animacion detenida");
        self.stop();
        self.parent.update();
      }
    }

    this.playing = false;
    // se encuentra si la animacion se inicia automaticamente
    if (this.auto) {
      this.play();
    }    
  }  
  
  /**
   * Inicia la animacion
   */
  descartesJS.Animation.prototype.play = function() {
    if (!this.playing) {
//       console.log("animacion iniciada");
      this.reinit();
    
      this.playing = true;
      this.timer = setTimeout(this.animationExec, this.parent.evaluator.evalExpression(this.delay));
    } 
    
    else {
      this.stop();
    }
  }

  /**
   * Detiene la animacion
   */
  descartesJS.Animation.prototype.stop = function() {
    this.playing = false;
    clearInterval(this.timer);
  }
  
  /**
   * Reinicia la animacion
   */
  descartesJS.Animation.prototype.reinit = function() {
// //     var evaluator = this.parent.evaluator;
    for (var i=0, l=this.init.length; i<l; i++) {
// //       evaluator.evalExpression(this.init[i]);
      this.parent.evaluator.evalExpression(this.init[i]);
    }
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * Una accion de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen una accion de descartes
   */
  descartesJS.Action = function(parent, parameter) {
    /**
     * La aplicacion de descartes a la que corresponde la accion
     * type DescartesApp
     * @private
     */
    this.parent = parent;
    this.evaluator = this.parent.evaluator;
  }  
  
  /**
   * Ejecuta la accion
   */
  descartesJS.Action.prototype.execute = function() { }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una accion de mostrar el contenido de una leccion de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el parametro de la accion
   */
  descartesJS.Message = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
    
    this.parameter = parameter;
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Message, descartesJS.Action);

  /**
   * Ejecuta la accion
   */
  descartesJS.Message.prototype.execute = function() {
    alert(this.parameter);
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una accion de calcular de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el parametro de la accion
   */
  descartesJS.Calculate = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
    
    // variables auxiliares
    var evaluator = this.evaluator;
    var parser = evaluator.parser;

    //se reemplazan los ; (punto y coma) por el salto de linea, ya que pueden aparecer ambas notaciones en la expresion
    this.parameter = parameter.replace(/&squot;/g, "'");
    this.parameter = this.parameter.replace(/;/g, "\\n");
    this.parameter = this.parameter.split("\\n") || [""];

    // se agregan solo las instrucciones que ejecuten algo, es decir, aquellas cuyo parseo no devuelven null
    var tmpParameter = [];
    var tmp;
    for (var i=0, l=this.parameter.length; i<l; i++) {
      tmp = parser.parse(this.parameter[i], true);
      if (tmp) {
        tmpParameter.push(tmp);
      }
    }
    this.parameter = tmpParameter;

    // la accion a ejecutar
    this.actionExec = function() {
      for (var i=0, l=this.parameter.length; i<l; i++) {
        evaluator.evalExpression(this.parameter[i]);
      }
    }

  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Calculate, descartesJS.Action);
  
  /**
   * Ejecuta la accion
   */
  descartesJS.Calculate.prototype.execute = function() {
    this.actionExec();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una accion de abrir un URL de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el parametro de la accion
   */
  descartesJS.OpenURL = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
    
    this.parameter = parameter;
    this.target = "_blank";
    
    var indexOfTarget = this.parameter.indexOf("target");
    
    if (indexOfTarget != -1) {
      this.target = this.parameter.substring(indexOfTarget);
      this.target = this.target.substring(this.target.indexOf("=")+1);
      this.parameter = this.parameter.substring(0, indexOfTarget-1);
    }
    
    // el parametro es codigo de javascript
    if (this.parameter.substring(0,10) == "javascript") {
      this.javascript = true;

      // reemplaza la codificacion de las comillas &squot; por '
      this.parameter = (this.parameter.substring(11)).replace(/&squot;/g, "'");
      
      // se construye la accion, que evalua el codigo javascript
      this.actionExec = function() {
        eval(this.parameter);
      }
    } 
    
    // el parametro es un archivo relativo a la pagina actual
    else if (this.parameter.substring(0,7) != "http://") {
      this.parameter = window.location.href.substring(0, window.location.href.lastIndexOf("/")+1) + this.parameter;
      
      // se construye la accion, que abre una pagina relativa a la pagina actual
      this.actionExec = function() {
        window.open(this.parameter, this.target);
      }
    }
    // el parametro es un archivo con direccion absoluta
    else {
      // se construye la accion, que abre una pagina con direccion absoluta
      this.actionExec = function() {
        window.open(this.parameter, this.target);
      }
    }
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.OpenURL, descartesJS.Action);

  /**
   * Ejecuta la accion
   */
  descartesJS.OpenURL.prototype.execute = function() {
    this.actionExec();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una accion de abrir un URL de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el parametro de la accion
   */
  descartesJS.OpenScene = function(parent, parameter) {
     // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
    
    this.parameter = parameter;
    this.target = "_blank";
    this.target = "popup";
    
    var indexOfTarget = this.parameter.indexOf("target");
    
    if (indexOfTarget != -1) {
      this.target = this.parameter.substring(indexOfTarget);
      this.target = this.target.substring(this.target.indexOf("=")+1);
      this.parameter = this.parameter.substring(0, indexOfTarget-1);
    }
    
    // el parametro es codigo de javascript
    if (this.parameter.substring(0,10) == "javascript") {
      this.javascript = true;

      // reemplaza la codificacion de las comillas &squot; por '
      this.parameter = (this.parameter.substring(11)).replace(/&squot;/g, "'");
      
      // se construye la accion, que evalua el codigo javascript
      this.actionExec = function() {
        eval(this.parameter);
      }
    } 
    
    // el parametro es un archivo relativo a la pagina actual
    else if (this.parameter.substring(0,7) != "http://") {
      this.parameter = window.location.href.substring(0, window.location.href.lastIndexOf("/")+1) + this.parameter;
      
      // se construye la accion, que abre una pagina relativa a la pagina actual
      this.actionExec = function() {
        this.window = window.open(this.parameter, this.target, "width=" + this.parent.width + ",height=" + this.parent.height + ",left=" + (window.screen.width - this.parent.width)/2 + ", top=" + (window.screen.height - this.parent.height)/2 + "location=no,menubar=no,scrollbars=no,status=no,titlebar=no,toolbar=no");

        this.window.onload = function(evt) {
          try {
            var document = this.window.document;
            var applet = document.getElementsByTagName("applet")
            if (applet && (applet.length > 0)) {
              this.window.innerWidth = applet[0].width;
              this.window.height = applet[0].height;
              document.style.margin = "0px";
              document.style.padding = "0px";
            }
          } 
          catch(e) {};
        }
      }
    }
    // el parametro es un archivo con direccion absoluta
    else {
      // se construye la accion, que abre una pagina con direccion absoluta
      this.actionExec = function() {
        this.window = window.open(this.parameter, this.target);
      }
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.OpenScene, descartesJS.Action);

  /**
   * Ejecuta la accion
   */
  descartesJS.OpenScene.prototype.execute = function() {
    this.actionExec();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una accion de mostrar el contenido de una leccion de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el parametro de la accion
   */
  descartesJS.About = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
    this.urlAbout = null;
    if (parameter != "") {
      this.urlAbout = window.location.href.substring(0, window.location.href.lastIndexOf("/")+1) + parameter;
    }
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.About, descartesJS.Action);

  /**
   * Ejecuta la accion
   */
  descartesJS.About.prototype.execute = function() {
    console.log(this.urlAbout)
    
    if (this.urlAbout) {
      var codeWindow = window.open(this.urlAbout, "_blank", "width=800px,height=600px,location=no,menubar=no,scrollbars=yes")
    }
    else {
      var codeWindow = window.open("about:blank", "_blank", "width=800px,height=600px,location=no,menubar=no,scrollbars=yes")
//     codeWindow.document.write("<textarea style='width:100%; height:100%;'>" + this.parent.applet.outerHTML + "</textarea>");
      codeWindow.document.write("<hmtl><head><title>Créditos</title></head><body><h1>Aquí van los créditos</h1></body></html>");
    }
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una accion de mostrar el contenido de una leccion de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el parametro de la accion
   */
  descartesJS.Config = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Config, descartesJS.Action);

  /**
   * Ejecuta la accion
   */
  descartesJS.Config.prototype.execute = function() {
    var codeWindow = window.open("about:blank", "_blank", "width=800px,height=600px,location=no,menubar=no,scrollbars=yes")
//     codeWindow.document.write("<textarea style='width:100%; height:100%;'>" + this.parent.applet.outerHTML + "</textarea>");
    codeWindow.document.write("<xmp style='width:100%; height:100%;'>" + this.parent.applet.outerHTML + "</xmp>");
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una accion de iniciar de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el parametro de la accion
   */
  descartesJS.Init = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Init, descartesJS.Action);

  /**
   * Ejecuta la accion
   */
  descartesJS.Init.prototype.execute = function() {
    this.parent.init();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una accion de limpiar de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el parametro de la accion
   */
  descartesJS.Clear = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Clear, descartesJS.Action);

  /**
   * Ejecuta la accion
   */
  descartesJS.Clear.prototype.execute = function() {
    this.parent.clear();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una accion de animar de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el parametro de la accion
   */
  descartesJS.Animate = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Animate, descartesJS.Action);

  
  /**
   * Ejecuta la accion
   */
  descartesJS.Animate.prototype.execute = function() {
    this.parent.play();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una accion de animar de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el parametro de la accion
   */
  descartesJS.InitAnimation = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.InitAnimation, descartesJS.Action);

  
  /**
   * Ejecuta la accion
   */
  descartesJS.InitAnimation.prototype.execute = function() {
    this.parent.reinitAnimation();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una accion de animar de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el parametro de la accion
   */
  descartesJS.PlayAudio = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
    
    this.filenameExpr = this.evaluator.parser.parse("'" + parameter.split(" ")[0].trim() + "'");
    this.filename = this.evaluator.evalExpression(this.filenameExpr);
    this.theAudio = this.parent.getAudio(this.filename)
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.PlayAudio, descartesJS.Action);
  
  /**
   * Ejecuta la accion
   */
  descartesJS.PlayAudio.prototype.execute = function() {
    this.filename = this.evaluator.evalExpression(this.filenameExpr);
//     this.theAudio = this.parent.getAudio(this.filename)
// 
//     // si el audio esta pausado se reproduce
//     if (this.theAudio.paused) {
//       this.theAudio.play();
//     } 
//     // si el audio se esta reproduciendo se detiene
//     else {
//       this.theAudio.pause();
//       this.theAudio.currentTime = 0.1;
//     }
    
    theAudio = this.parent.getAudio(this.filename)

    // si el audio esta pausado se reproduce
    if (theAudio.paused) {
      theAudio.play();
    } 
    // si el audio se esta reproduciendo se detiene
    else {
      theAudio.pause();
      theAudio.currentTime = 0.1;
    }
    
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * Un auxiliar de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen un auxiliar de descartes
   */
  descartesJS.Auxiliary = function(parent, values) {
    /**
     * La aplicacion de descartes a la que corresponde el auxiliar
     * type DescartesApp
     * @private
     */
    this.parent = parent;
    this.evaluator = this.parent.evaluator;

    var parser = parent.evaluator.parser;

    /**
     * El identificador del auxiliar
     * type String
     * @private
     */
    this.id = "";
    
    /**
     * La expresion del auxiliar
     * type String
     * @private
     */
    this.expresion = "";

    /**
     * La forma en la que se evalua el auxiliar
     * type String
     * @private
     */
    this.evaluate = "onlyOnce";

    /**
     * El numero de elementos de un vector
     * type Number
     * @private
     */
    this.size = parser.parse("3");

    /**
     * El numero de renglones de una matriz
     * type Number
     * @private
     */
    this.rows = parser.parse("3");

    /**
     * El numero de columnas de una matriz
     * type Number
     * @private
     */
    this.columns = parser.parse("3");

    // se recorre values para reemplazar los valores iniciales del auxiliar
    for (var propName in values) {
      // solo se verifican las propiedades propias del objeto values
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }
  }  
  
  /**
   * Inicia el algoritmo
   */
  descartesJS.Auxiliary.prototype.firstRun = function() { }

  /**
   * Actualiza los valores del auxiliar
   */
  descartesJS.Auxiliary.prototype.update = function() { }
  
  /**
   * Divide la expresion utilizando el punto y coma como delimitador y solo considera solo las expresiones no vacias
   * @param [DescartesJS.Parser] parser es el objeto de parseo de expresiones
   * @param [String] expression es la expresion a dividir
   * @return [Node] regresa una lista de expresiones parseadas
   */
  descartesJS.Auxiliary.prototype.splitInstructions = function(parser, expression) {
    var tmp;
    var tmpExpression = [];

    // se dividen todas las expresiones de la expresion separadas por punto y coma y se parsean
    if (expression) {
      expression = expression.split(";");
    } else {
      expression = [""];
    }
    
    // se agregan solo las instrucciones que ejecuten algo, es decir, aquellas cuyo parseo no devuelven null
    for (var i=0, l=expression.length; i<l; i++) {
      tmp = parser.parse(expression[i], true);
      if (tmp) {
        tmpExpression.push(tmp);
      }
    }
    
    return tmpExpression;
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una constante de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la constante
   */
  descartesJS.Variable = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Auxiliary.call(this, parent, values);
    
    var parser = this.evaluator.parser;
 
    this.expresionString = this.expresion;
    this.expresion = parser.parse(this.expresionString);

    if (this.expresion) {
      parser.setVariable(this.id, this.expresion);
    }
    
    if (this.editable) {
      this.registerTextField();
    }    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Variable, descartesJS.Auxiliary);
  
  /**
   * 
   */
  descartesJS.Variable.prototype.registerTextField = function() {
    var container = document.createElement("div");

    var label = document.createElement("label");
    label.appendChild( document.createTextNode("_" + this.id + "=_") ); // se agregan guiones bajo al principio y final para determinarl el tama;o inicial de la etiqueta
    
    var textField = document.createElement("input");
    textField.value = this.expresionString;
    textField.disabled = !(this.editable);

    container.appendChild(label);
    container.appendChild(textField);

    var self = this;
    textField.onkeydown = function(evt) {
      if (evt.keyCode == 13) {
        self.expresion = self.evaluator.parser.parse(this.value);
        self.evaluator.parser.setVariable(self.id, self.expresion)
        self.parent.update();
      }
    }
    
    var containerTextField = { container: container,  type: "div" };
    this.parent.editableRegion.textFields.push(containerTextField);
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una constante de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la constante
   */
  descartesJS.Constant = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Auxiliary.call(this, parent, values);
    
    this.expresion = this.evaluator.parser.parse(this.expresion);
    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Constant, descartesJS.Auxiliary);
  
  /**
   * Actualiza la constante
   */
  descartesJS.Constant.prototype.update = function() {
    this.evaluator.setVariable(this.id, this.evaluator.evalExpression(this.expresion));
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un vector de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el vector
   */
  descartesJS.Vector = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Auxiliary.call(this, parent, values);

    var evaluator = this.evaluator;
    var parser = evaluator.parser;
    
    this.expresion = this.expresion.split(";");
    
    var response;
    // si tiene un archivo asociado entonces se lee
    if (this.file) {
      // si el vector esta embedido en la pagina
      var vectorElement = document.getElementById(this.file);
      if ((vectorElement) && (vectorElement.type == "descartes/vectorFile")) {
        response = vectorElement.text;
        
        if (response[0] == '\n') {
          response = response.substring(1);
        }
      }
      // se lee el vector de un archivo
      else {
        response = descartesJS.openExternalFile(this.file);
      }
      
      if (response != null) {
        response = response.split("\n");
      }
        
      // si no tiene contenido el archivo o no se pudo leer
      if ( (response == null) || ((response.length == 1) && (response[0] == "")) ) {
        response = [];
        this.size = 0;
      }
      // si tiene contenido el archivo y se pudo leer
      else {
        this.expresion = [];
//         this.size = parser.parse( (response.length).toString() );
        this.size = null;
      }
        
      var tmpImg;
      var nonEmptyValuesIndex = 0; 
      for(var i=0, l=response.length; i<l; i++) {
        if (response[i].match(/./)) {
          this.expresion[nonEmptyValuesIndex] = this.id + "[" + nonEmptyValuesIndex + "]=" + response[i];
          nonEmptyValuesIndex++;
          
          // si el archivo al cual hace referencia el vector contiene una imagen, hay que precargarla
          tmpImg = response[i].match(/[\w-//]*(.png|.jpg|.gif|.svg|.PNG|.JPG|.GIF|.SVG)/g)
          if (tmpImg) {
            this.parent.getImage(tmpImg);
          }
        }
//         this.expresion[i] = this.id + "[" + i + "]=" + response[i];
      }
      
      if (this.size == null) {
        this.size = parser.parse( this.expresion.length + "" );
      }
      
    }

    var tmpExp;
    // se parsean los elementos de la expresion
    for(var i=0, l=this.expresion.length; i<l; i++) {
      tmpExp = parser.parse(this.expresion[i], true);
      
      if (tmpExp && (tmpExp.type != "asign")) {
        tmpExp = parser.parse( this.id + "[" + i + "]=" + this.expresion[i], true );
      }

      this.expresion[i] = tmpExp;
    }

    var length = evaluator.evalExpression(this.size);
    var vectInit = [];
    for (var i=0, l=length; i<l; i++) {
      vectInit.push(0);
    }
    evaluator.vectors[this.id] = vectInit;
    
    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Vector, descartesJS.Auxiliary);

  /**
   * Actualiza el vector
   */
  descartesJS.Vector.prototype.update = function() {
    var evaluator = this.evaluator;
// //     var length = evaluator.evalExpression(this.size);
// // 
// //     evaluator.setVariable(this.id + ".long", length);

    evaluator.setVariable(this.id + ".long", evaluator.evalExpression(this.size));

    for(var i=0, l=this.expresion.length; i<l; i++) {
      evaluator.evalExpression(this.expresion[i]);
    }
  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una matriz de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la matriz
   */
  descartesJS.Matrix = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Auxiliary.call(this, parent, values);

    var evaluator = this.evaluator;

    // se parsea la expresion
    this.expresion = this.splitInstructions(evaluator.parser, this.expresion);

    var rows = evaluator.evalExpression(this.rows);
    var cols = evaluator.evalExpression(this.columns);

    var mat = [];
    mat.type = "matrix";
    
    var vectInit;
    for (var j=0, k=cols; j<k; j++) {
      vectInit = [];
      for (var i=0, l=rows; i<l; i++) {
        vectInit.push(0);
      }
      mat[j] = vectInit;
    }
    evaluator.matrices[this.id] = mat;
    
    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Matrix, descartesJS.Auxiliary);

  /**
   * Actualiza la matriz
   */
  descartesJS.Matrix.prototype.update = function() {
    var evaluator = this.evaluator;
    var rows = evaluator.evalExpression(this.rows);
    var cols = evaluator.evalExpression(this.columns);

    evaluator.setVariable(this.id + ".filas", rows);
    evaluator.setVariable(this.id + ".columnas", cols);

    var mat = evaluator.matrices[this.id];
    mat.rows = rows;
    mat.cols = cols;

    // evaluator.setVariable(this.id + ".filas", evaluator.evalExpression(this.rows));
    // evaluator.setVariable(this.id + ".columnas", evaluator.evalExpression(this.columns));
        
    for(var i=0, l=this.expresion.length; i<l; i++) {
      evaluator.evalExpression(this.expresion[i]);
    }
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una funcion de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la funcion
   */
  descartesJS.Function = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Auxiliary.call(this, parent, values);

    var evaluator = this.evaluator;
    var parser = evaluator.parser;

    var parPos = this.id.indexOf("(");
    this.name = this.id.substring(0, parPos);
    this.params = this.id.substring(parPos+1, this.id.length-1);
    this.domain = (this.range) ? parser.parse(this.range) : parser.parse("1");
    
    if (this.params == "") {
      this.params = [];
    } else {
      this.params = this.params.split(",");
    }
    
    this.numberOfParams = this.params.length;
    
    // se parsea la expresion init
    this.init = this.splitInstructions(parser, this.init);

    // se parsea la expresion doExpr
    this.doExpr = this.splitInstructions(parser, this.doExpr);
    
    // se parsea la expresion de while
    if (this.whileExpr) {
      this.whileExpr = parser.parse(this.whileExpr);
    }
      
    this.expresion = parser.parse(this.expresion);

    var self = this;
    if (this.algorithm) {
      this.functionExec = function() {
        if (self.numberOfParams == arguments.length) {

          // se guardan los valores de las variables que tienen el mismo nombre que los parametros de la funcion
          var paramsTemp = [];
          for (var i=0, l=self.params.length; i<l; i++) {
            paramsTemp[i] = evaluator.getVariable(self.params[i]);
            
            // se asocian los parametros de entrada de la funcion con los nombres de los parametros
            evaluator.setVariable(self.params[i], arguments[i]);
          }
          
          for (var i=0, l=self.init.length; i<l; i++) {
            evaluator.evalExpression(self.init[i]);
          }
          
          do {
            for (var i=0, l=self.doExpr.length; i<l; i++) {
              evaluator.evalExpression(self.doExpr[i]);
            }
          }
          while (evaluator.evalExpression(self.whileExpr) > 0);
                   
          // se evalua el valor de regreso
          var result = evaluator.evalExpression(self.expresion);
          descartesJS.rangeOK = evaluator.evalExpression(self.domain);
//         var result = (evaluator.evalExpression(self.domain)) ? evaluator.evalExpression(self.expresion) : "Función no definida";

          // se restauran los valores de las variables que tienen el mismo nombre que los parametros de la funcion
          for (var i=0, l=self.params.length; i<l; i++) {
            evaluator.setVariable(self.params[i], paramsTemp[i]);
          }
        
          return result;
        }
        
        return 0;
      }
    } else {
      this.functionExec = function() {
        if (self.numberOfParams == arguments.length) {
          
          // se guardan los valores de las variables que tienen el mismo nombre que los parametros de la funcion
          var paramsTemp = [];
          for (var i=0, l=self.params.length; i<l; i++) {
            paramsTemp[i] = evaluator.getVariable(self.params[i]);
            
            // se asocian los parametros de entrada de la funcion con los nombres de los parametros
            evaluator.setVariable(self.params[i], arguments[i]);
          }
          
          // se evalua el valor de regreso
          var result = evaluator.evalExpression(self.expresion);
          descartesJS.rangeOK = evaluator.evalExpression(self.domain);
//         var result = (evaluator.evalExpression(self.domain)) ? evaluator.evalExpression(self.expresion) : "Función no definida";

          // se restauran los valores de las variables que tienen el mismo nombre que los parametros de la funcion
          for (var i=0, l=self.params.length; i<l; i++) {
            evaluator.setVariable(self.params[i], paramsTemp[i]);
          }
        
          return result;
        }
        
        return 0;
      }
    }
    
    evaluator.setFunction(this.name, this.functionExec);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Function, descartesJS.Auxiliary);

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una secuencia de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la secuencia
   */
  descartesJS.AuxSequence = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Auxiliary.call(this, parent, values);
    
    var evaluator = this.evaluator;
    var parser = evaluator.parser;

    var parPos = this.id.indexOf("(");
    this.name = this.id.substring(0, parPos);
    this.params = this.id.substring(parPos+1, this.id.length-1);
    this.domain = (this.range) ? parser.parse(this.range) : parser.parse("1");
    
    if (this.params == "") {
      this.params = [];
    } else {
      this.params = this.params.split(",");
    }

    this.numberOfParams = this.params.length;

    // se parsea la expresion init
    this.init = this.splitInstructions(parser, this.init);

    // se parsea la expresion doExpr
    this.doExpr = this.splitInstructions(parser, this.doExpr);
    
    // se parsea la expresion de while
    if (this.whileExpr) {
      this.whileExpr = parser.parse(this.whileExpr);
    }

    this.expresion = parser.parse(this.expresion);

    var self = this;
    if (this.algorithm) {
      this.functionExec = function() {
        if (self.numberOfParams == arguments.length) {
          
          // se guardan los valores de las variables que tienen el mismo nombre que los parametros de la funcion
          var paramsTemp = [];
          for (var i=0, l=self.params.length; i<l; i++) {
            paramsTemp[i] = evaluator.getVariable(self.params[i]);
            
            // se asocian los parametros de entrada de la funcion con los nombres de los parametros
            evaluator.setVariable(self.params[i], arguments[i]);
          }
          
          for (var i=0, l=self.init.length; i<l; i++) {
            evaluator.evalExpression(self.init[i]);
          }
          
          do {
            for (var i=0, l=self.doExpr.length; i<l; i++) {
              evaluator.evalExpression(self.doExpr[i]);
            }
          }
          while (evaluator.evalExpression(self.whileExpr) > 0);
                   
          // se evalua el valor de regreso
          var result = evaluator.evalExpression(self.expresion);
          descartesJS.rangeOK = evaluator.evalExpression(self.domain);
//         var result = (evaluator.evalExpression(self.domain)) ? evaluator.evalExpression(self.expresion) : "Función no definida";

          // se restauran los valores de las variables que tienen el mismo nombre que los parametros de la funcion
          for (var i=0, l=self.params.length; i<l; i++) {
            evaluator.setVariable(self.params[i], paramsTemp[i]);
          }
        
          return result;
        }
        
        return 0;
      }
    } else {
      this.functionExec = function() {
        if (self.numberOfParams == arguments.length) {
          
          // se guardan los valores de las variables que tienen el mismo nombre que los parametros de la funcion
          var paramsTemp = [];
          for (var i=0, l=self.params.length; i<l; i++) {
            paramsTemp[i] = evaluator.getVariable(self.params[i]);
            
            // se asocian los parametros de entrada de la funcion con los nombres de los parametros
            evaluator.setVariable(self.params[i], arguments[i]);
          }
          
          // se evalua el valor de regreso
          var result = evaluator.evalExpression(self.expresion);
          descartesJS.rangeOK = evaluator.evalExpression(self.domain);
//         var result = (evaluator.evalExpression(self.domain)) ? evaluator.evalExpression(self.expresion) : "Función no definida";

          // se restauran los valores de las variables que tienen el mismo nombre que los parametros de la funcion
          for (var i=0, l=self.params.length; i<l; i++) {
            evaluator.setVariable(self.params[i], paramsTemp[i]);
          }
        
          return result;
        }
        
        return 0;
      }
    }

    evaluator.setFunction(this.name, this.functionExec);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.AuxSequence, descartesJS.Auxiliary);

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un algoritmo de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el algoritmo
   */
  descartesJS.Algorithm = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Auxiliary.call(this, parent, values);

    var tmp;
    var evaluator = this.evaluator;
    var parser = evaluator.parser;

    // se parsea la expresion init
    this.init = this.splitInstructions(parser, this.init);

    // se parsea la expresion doExpr
    this.doExpr = this.splitInstructions(parser, this.doExpr);
    
    // se parsea la expresion de while
    if (this.whileExpr) {
      this.whileExpr = parser.parse(this.whileExpr);
    }
    
    // se crea la funcion a ejecutar en cada evaluacion del algoritmo
    this.algorithmExec = function() {
      for (var i=0, l=this.init.length; i<l; i++) {
        evaluator.evalExpression(this.init[i]);
      }
      
      do {
        for (var i=0, l=this.doExpr.length; i<l; i++) {
          evaluator.evalExpression(this.doExpr[i]);
        }
      }
      while (evaluator.evalExpression(this.whileExpr) > 0);
    }

//     this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Algorithm, descartesJS.Auxiliary);

  /**
   * Actualiza el algoritmo
   */
  descartesJS.Algorithm.prototype.update = function() {
    this.algorithmExec();
    
// //     if ((this.evaluate) && (this.evaluate == "onlyOnce")) {
    if (this.evaluate == "onlyOnce") {
      this.update = function() {};
    }
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un evento de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el evento
   */
  descartesJS.Event = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Auxiliary.call(this, parent, values);
    
    var evaluator = this.evaluator;
    
    this.condition = evaluator.parser.parse(this.condition);
    this.lastEvaluation = false;

    this.action = this.parent.lessonParser.parseAction(this);
    
    // si la forma en la que se ejecuta el evento es onlyOnce
    if (this.execution == "onlyOnce") {
      this.eventExec = function() {
        if ((evaluator.evalExpression(this.condition) > 0) && !this.lastEvaluation) {
//           console.log("onlyOnce");
          this.lastEvaluation = true;
          this.action.execute();
        }
      }
    }
    
    // si la forma en la que se ejecuta el evento es alternate
    if (this.execution == "alternate") {
      this.eventExec = function() {
        var cond = (evaluator.evalExpression(this.condition) > 0);
        
        //////////////////////////////////////////////////////////////////
        // DESCARTES 3
        if (this.parent.version == 3) {
          if (cond != this.lastEvaluation) {
            this.action.execute();
            this.lastEvaluation = (cond) ? true : false;
          }
        }
        // DESCARTES 3
        //////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////
        // los otros descartes 
        else {
          // si la condicion esta en verdadero y la ultima vez no se ejecuto, entonce se ejectua el evento
          if (cond && !this.lastEvaluation) {
            this.action.execute();
            this.lastEvaluation = true;
          }
          // si ya se ejecuto una vez y la condicion paso a falso, entonces se puede volver a ejecutar el evento
          else if (!cond && this.lastEvaluation){
            this.lastEvaluation = false;
          }
        }
        //////////////////////////////////////////////////////////////////
        
      }
    }
    
    // si la forma en la que se ejecuta el evento es always
    if (this.execution == "always") {
      this.eventExec = function() {
        if (evaluator.evalExpression(this.condition) > 0) {
          this.action.execute();
        }
      }
    }
    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Event, descartesJS.Auxiliary);

  /**
   * Actualiza el evento
   */
  descartesJS.Event.prototype.update = function() {
    this.eventExec();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un grafico de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen un grafico de descartes
   */
  descartesJS.Graphic = function(parent, values) {
    /**
     * La aplicacion de descartes a la que corresponde el grafico
     * type DescartesApp
     * @private
     */
    this.parent = parent;

    var parser = this.parent.evaluator.parser;
    
    /**
     * Objeto para el parseo y evaluacion de expresiones
     * type {Evaluator}
     * @private
     */
    this.evaluator = parent.evaluator;
    
    /**
     * El identificador del espacio al que pertenece el elemento grafico
     * type String
     * @private
     */
    this.spaceID = "E0";

    /**
     * El tipo de grafico
     * type String
     * @private
     */
    this.type = "";

    /**
     * La condicion para determinar si el grafico se dibuja en el fondo
     * type String
     * @private
     */
    this.background = false;

    /**
     * El color principal del grafico
     * type String
     * @private
     */
    if (this.parent.version != 2) {
//     if (this.parent.code == "descinst.com.mja.descartes.DescartesJS.class") {
      this.color = "#20303a";
//     } else {
//       this.color = "#000000";
//     }

      // ##ARQUIMEDES## //
      if (this.parent.arquimedes) {
        this.color = "black";
      }
      // ##ARQUIMEDES## //

    } else {
      this.color = "blue";
    }
    
    /**
     * La condicion de dibujado del grafico
     * type Boolean
     * @private
     */
    this.drawif = parser.parse("1");
    
    /**
     * La condicion para determinar si el grafico se dibuja en coordenadas absolutas
     * type Boolean
     * @private
     */
    this.abs_coord = false;
    
    /**
     * Expresion que determina la posicion y el tamanio del grafico
     * type String
     * @private
     */
//     this.expresion = parser.parse("(0,0)");

    /**
     * El color del rastro que deja el grafico
     * type String
     * @private
     */
    this.trace = "";

    /**
     * La condicion y el parametro que se utilizan para dibujar el grafico como una familia
     * type String
     * @private
     */
    this.family = "";

    /**
     * El intervalo utilizado para dibujar el grafico como una familia
     * type String
     * @private
     */
    this.family_interval = parser.parse("[0,1]");

    /**
     * El numero de pasos que se utiliza para dibujar el grafico como una familia
     * type Number
     * @private
     */
    this.family_steps = parser.parse("8");
    
    /**
     * El parametro que se utilizan para dibujar una curva
     * type String
     * @private
     */
    this.parameter = "t";

    /**
     * El intervalo utilizado para dibujar una curva
     * type String
     * @private
     */
    this.parameter_interval = parser.parse("[0,1]");

    /**
     * El numero de pasos que se utiliza para dibujar una curva
     * type Number
     * @private
     */
    this.parameter_steps = parser.parse("8");

    /**
     * La condicion y el color del relleno del grafico
     * type String
     * @private
     */
    this.fill = "";

    /**
     * La condicion y el color fill+
     * type String
     * @private
     */
    this.fillP = ""; 

    /**
     * La condicion y el color fill+
     * type String
     * @private
     */
    this.fillM = "";

    /**
     * El ancho del trazo del grafico
     * type Number
     * @private
     */
    this.width = -1;

    /**
     * La condicion para determinar ???
     * type Boolean
     * @private
     */
//     this.visible = false;

    /**
     * La condicion para determinar si una escuacion es editable
     * type Boolean
     * @private
     */
    this.editable = false;

    /**
     * La informacion de ???
     * type Boolean
     * @private
     */
    this.info = "";

    /**
     * La tipografia de info
     * type Boolean
     * @private
     */
    this.font = "Monospaced,PLAIN,12";
    
    /**
     * La condicion para determinar si el texto mostrado debe ser fijo o no
     * type Boolean
     * @private
     */
    this.fixed = true;

    /**
     * El ancho del punto
     * type Number
     * @private
     */
    this.size = parser.parse("2");

    /**
     * El texto de los graficos
     * type String
     * @private
     */
    this.text = "";

    /**
     * El numero de decimales que se muestran en el texto
     * type Number
     * @private
     */
    this.decimals = parser.parse("2");

    /**
     * El tamanio de la punta de un grafico (una flecha)
     * type Number
     * @private
     */
    this.spear = parser.parse("8");

    /**
     * El color interior de un grafico (una flecha)
     * type String
     * @private
     */
    this.arrow = "#ee0022";

    /**
     * La posicion del centro de un grafico (un circulo)
     * type String
     * @private
     */
    this.center = parser.parse("(0,0)");

    /**
     * El radio de un grafico (un circulo)
     * type Number
     * @private
     */
    this.radius = parser.parse("1");

    /**
     * El angulo o vector inicial de un grafico (un circulo)
     * type Number
     * @private
     */
    this.init = parser.parse("0");

    /**
     * El angulo o vector final de un grafico (un circulo)
     * type Number
     * @private
     */
    this.end = parser.parse("90");

    /**
     * El nombre del archivo de un grafico (una imagen)
     * type String
     * @private
     */
    this.file = "";

    /**
     * La rotacion de un grafico (una imagen)
     * type Number
     * @private
     */
    this.inirot = parser.parse("0");
    
    /**
     * La posicion de un macro
     * type Number
     * @private
     */
//     this.inipos = parser.parse("[0,0]");
    
    // se recorre values para reemplazar los valores iniciales del control
    for (var propName in values) {
      // solo se verifican las propiedades propias del objeto values
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }
    
    if ((this.expresion == undefined) && (this.type != "macro")) {
      this.expresion = parser.parse("(0,0)");
    }

    // se obtiene el espacio al que pertenece el grafico
    this.space = this.getSpace();

    if (this.background) {
      this.canvas = this.space.backgroundCanvas;
    } else {
      this.canvas = this.space.canvas;
    }
    this.ctx = this.canvas.getContext("2d");
    
    // si el objeto deja rastro, se obtiene el contexto de render del fondo
    if (this.trace) {
      this.traceCtx = this.space.backgroundCanvas.getContext("2d");
    }
    
    this.font = descartesJS.convertFont(this.font)
  }  
  
  /**
   * Obtiene el espacio al cual pertenece el grafico
   * return {Space} el espacio al cual pertenece el grafico
   */
  descartesJS.Graphic.prototype.getSpace = function() {
    var spaces = this.parent.spaces;
    var space_i;
    // se busca el espacio al que pertenece
    for (var i=0, l=spaces.length; i<l; i++) {
      space_i = spaces[i];
      if (space_i.id == this.spaceID) {
//         spaces[i].addGraph(this);
        return space_i;
      }
    }
    
    // si no encuentra un espacio con el identificador registrado entonces el grafico se agrega al primer espacio de la leccion
    return spaces[0];
  }
  
  /**
   * Obtiene los valores de la familia
   */
  descartesJS.Graphic.prototype.getFamilyValues = function() {
    var evaluator = this.evaluator;
    var expr = evaluator.evalExpression(this.family_interval);
    this.familyInf = expr[0][0];
    this.familySup = expr[0][1];
    this.fSteps = Math.round(evaluator.evalExpression(this.family_steps));
    this.family_sep = (this.fSteps > 0) ? (this.familySup - this.familyInf)/this.fSteps : 0;
  }
  
  /**
   * Funcion auxiliar para dibujar la familia
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja
   * @param {String} fill el color de relleno del grafico
   * @param {String} stroke el color del trazo del grafico
   */
  descartesJS.Graphic.prototype.drawFamilyAux = function(ctx, fill, stroke) {
    var evaluator = this.evaluator;

    // se actualizan los valores de la familia
    this.getFamilyValues();

    // se guarda el ultimo valor que tenia la variable family
    var tempParam = evaluator.getVariable(this.family);

    if (this.fSteps >= 0) {
      // se dibujan todos los miembros de la familia
      for(var i=0, l=this.fSteps; i<=l; i++) {
        // se modifica el valor de la variable family
        evaluator.setVariable(this.family, this.familyInf+(i*this.family_sep));
                
        // si la condicion de dibujo del elemento es verdadera entonces se actualiza y dibuja el elemento
        if ( evaluator.evalExpression(this.drawif) > 0 ) {
          // se actualizan los valores antes de dibujar el elemento
          this.update();
          // se dibuja el elemento
          this.drawAux(ctx, fill, stroke);
        }
      }
    }

    evaluator.setVariable("_Text_H_", 0);
    evaluator.setVariable(this.family, tempParam);
  }

  /**
   * Dibuja el grafico
   * @param {String} fill el color de relleno del grafico
   * @param {String} stroke el color del trazo del grafico
   */
  descartesJS.Graphic.prototype.draw = function(fill, stroke) {
    // si la familia esta activada entonces se dibujan varias veces los elementos
    if (this.family != "") {
      this.drawFamilyAux(this.ctx, fill, stroke);
    }
    
    // si la familia no esta activada
    // si la condicion de dibujo del elemento es verdadera entonces se actualiza y dibuja el elemento
    else  {
      // se dibuja el elemento
      if ( this.evaluator.evalExpression(this.drawif) > 0 ) {
        // se actualizan los valores antes de dibujar el elemento
        this.update();
        // se dibuja el elemento
        this.drawAux(this.ctx, fill, stroke);
      }
    }
  }
  
  /**
   * Se dibuja el rastro del grafico
   * @param {String} fill el color de relleno del punto
   * @param {String} stroke el color del trazo del punto
   */
  descartesJS.Graphic.prototype.drawTrace = function(fill, stroke) {
    // si la familia esta activada entonces se dibujan varias veces los elementos
    if (this.family != "") {
      this.drawFamilyAux(this.traceCtx, fill, stroke);
    }
    
    // si la familia no esta activada
    else {      
      // se dibuja el elemento
      if ( this.evaluator.evalExpression(this.drawif) > 0 ) {
        // se actualizan los valores antes de dibujar el elemento
        this.update();
        // se dibuja el elemento
        this.drawAux(this.traceCtx, fill, stroke);
      }
    }
  }

  /**
   * Se dibuja el texto del grafico
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja
   * @param {String} text el texto a dibujar
   * @param {Number} x la posicion en x del texto
   * @param {Number} y la posicion en y del texto
   * @param {String} fill el color de relleno del punto
   * @param {String} font la tipografia del texto
   * @param {String} align la alineacion del texto
   * @param {String} baseline la base sobre la que se dibuja el texto
   * @param {Number} decimals el numero de decimales del texto
   * @param {Boolean} fixed el texto esta en notacion fija
   */
  descartesJS.Graphic.prototype.drawText = function(ctx, text, x, y, fill, font, align, baseline, decimals, fixed) {
    // texto en rtf
    if (text.type == "rtfNode") {
      ctx.fillStyle = fill;
      ctx.strokeStyle = fill;
      ctx.textBaseline = "alphabetic";
      text.draw(ctx, x, y, decimals, fixed, align);
      
      return;
    }

    // texto del tipo simple text
    if (text.type === "simpleText") {
      text = text.toString(decimals, fixed).split("\\n");
    }

    x = x + (font.match("Arial") ? -2 : (font.match("Times") ? -2: 0));
    var evaluator = this.evaluator;
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    
    this.fontSize = font.match(/(\d+)px/);
    if (this.fontSize) {
      this.fontSize = this.fontSize[1];
    } else {
      this.fontSize = "10";
    } 
    
    if (this.border) {
      ctx.strokeStyle = descartesJS.getColor(evaluator, this.border);
      ctx.lineWidth = parseFloat(this.fontSize)/12;
    }
    
    var theText;
    var verticalDisplace = this.fontSize*1.2;

    // condicion que se checa para el ancho del texto
    // si el "tipo" de los elementos contenidos en el texto existe, significa que es algo parseado
    for (var i=0, l=text.length; i<l; i++) {
      theText = text[i];
      if (this.border) {
        ctx.strokeText(theText, x, y+(verticalDisplace*i));
      }
      ctx.fillText(theText, x, y+(verticalDisplace*i));
    }
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * @constructor 
   */
  descartesJS.SimpleText = function(text, parent) {
    this.text = text;
    this.textElements = [];
    this.textElementsMacros = [];
    this.parent = parent;
    this.evaluator = parent.evaluator;
    this.type = "simpleText"

    var txt = "'";
    var pos = 0;
    var lastPos = 0;
    var ignoreSquareBracket = -1;
    var charAt;
    var charAtAnt;

    while (pos < text.length) {
      charAt = text.charAt(pos);
      charAtAnt = text.charAt(pos-1);

      if ((charAt === "[") && (charAtAnt === "\\")) {
        this.textElements.push(text.substring(lastPos, pos-1) + "[");
        this.textElementsMacros.push("'" + text.substring(lastPos, pos-1) + "['");
        lastPos = pos+1;
      }
      
      else if ((charAt === "]") && (charAtAnt === "\\")) {
        this.textElements.push(text.substring(lastPos, pos-1) + "]");
        this.textElementsMacros.push("'" + text.substring(lastPos, pos-1) + "]'");
        lastPos = pos+1;
      }
      
      // si se encuentra un corchete que abre agregamos '+
      else if ((charAt === "[") && (ignoreSquareBracket == -1)) {
        this.textElements.push(text.substring(lastPos, pos));
        this.textElementsMacros.push("'" + text.substring(lastPos, pos) + "'");
        lastPos = pos;
        ignoreSquareBracket++;
      } 

      else if (charAt === "[") {
        ignoreSquareBracket++;
      } 

      // si se encuentra un corchete que cierra agregamos +'
      else if ((charAt === "]") && (ignoreSquareBracket == 0)) {
        this.textElements.push( this.evaluator.parser.parse(text.substring(lastPos, pos+1)) );
        this.textElementsMacros.push( "[" + text.substring(lastPos, pos+1) + "]");
        lastPos = pos+1;
        ignoreSquareBracket--;
      }
      
      else if (text.charAt(pos) == "]") {
        ignoreSquareBracket = (ignoreSquareBracket < 0) ? ignoreSquareBracket : ignoreSquareBracket-1;
        txt = txt + text.charAt(pos);
      } 

      else {
        txt = txt + text.charAt(pos);
      }      

      pos++; 
    }
    this.textElements.push(text.substring(lastPos, pos));
    this.textElementsMacros.push("'" + text.substring(lastPos, pos) + "'");
  }

  /**
   *
   */
  descartesJS.SimpleText.prototype.toString = function(decimals, fixed) {
    var txt = "";
    var evalString;

    for(var i=0, l=this.textElements.length; i<l; i++) {
      if (typeof(this.textElements[i]) === "string") {
        txt += this.textElements[i];
      }
      else {
        evalString = this.evaluator.evalExpression(this.textElements[i])[0][0];

        if (evalString != "") {
          // la evaluacion es una cadena
          if (typeof(evalString) == "string") {
            txt += evalString;
          }
          // la evaluacion es un numero
          else {
            evalString = parseFloat(evalString);

            evalString = (fixed) ? evalString.toFixed(decimals) : parseFloat(evalString.toFixed(decimals));
            txt += evalString.toString().replace(".", this.parent.decimal_symbol);                        
          }
        }
      }
    }

    return txt;
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var PI2 = Math.PI*2;
  
  /**
   * Una ecuacion de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la ecuacion
   */
  descartesJS.Equation = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    this.width = (this.width == -1) ? this.evaluator.parser.parse("1") : this.width;

    this.generateStroke();

    // se modifica la expresion y se construye un evaluador de newton
    this.parseExpresion();

    // ## parche para la version de descartes 2 ## //
    this.visible = ((this.parent.version == 2) && (this.visible == undefined)) ? true : false;
    
    if (this.visible) {
      this.registerTextField();
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Equation, descartesJS.Graphic);

  /**
   * 
   */
  descartesJS.Equation.prototype.parseExpresion = function() {
    if (this.expresion.type == "compOperator") {
      var left = this.expresion.childs[0];
      var right = this.expresion.childs[1];

      if ( (left.type == "identifier") && (left.value == "y") && (!right.contains("y")) ) {
        this.funExpr = right;
        this.drawAux = this.drawAuxFunY;
      }
      
      else if ( (right.type == "identifier") && (right.value == "y") && (!left.contains("y")) ) {
        this.funExpr = left;
        this.drawAux = this.drawAuxFunY;        
      }
      
      else if ( (left.type == "identifier") && (left.value == "x") && (!right.contains("x")) ) {
        this.funExpr = right;
        this.drawAux = this.drawAuxFunX;
      }
      
      else if ( (right.type == "identifier") && (right.value == "x") && (!left.contains("x")) ) {
        this.funExpr = right;
        this.drawAux = this.drawAuxFunX;
      }
    }

    this.newt = new descartesJS.R2Newton(this.evaluator, this.expresion);
  }
  
  /**
   * 
   */
  descartesJS.Equation.prototype.generateStroke = function() {
    this.auxCanvas = document.createElement("canvas");
    var width = parseInt(this.evaluator.evalExpression(this.width));
    this.width_2 = parseInt(width/2) || 1;
    this.auxCanvas.setAttribute("width", width);
    this.auxCanvas.setAttribute("height", width);
    this.auxCtx = this.auxCanvas.getContext("2d");
    this.auxCtx.beginPath();
    this.auxCtx.arc(this.width_2, this.width_2, this.width_2, 0, Math.PI*2, false);
    this.auxCtx.fill();
  }
  
  /**
   * Actualiza la ecuacion
   */
  descartesJS.Equation.prototype.update = function() { }
  
  /**
   * Dibuja la ecuacion
   */
  descartesJS.Equation.prototype.draw = function() {
    // si la familia esta activada entonces se dibujan varias veces los elementos
    if (this.family != "") {
      this.drawFamilyAux(this.ctx, this.fill, this.color);
    }
    
    // si la familia no esta activada
    // si la condicion de dibujo del elemento es verdadera entonces se actualiza y dibuja el elemento
    else  {
      // se dibuja el elemento
      // se actualizan los valores antes de dibujar el elemento
      this.update();
      // se dibuja el elemento
      this.drawAux(this.ctx, this.fill, this.color);
    }
  }
  
  /**
   * Dibuja el rastro de la ecuacion
   */
  descartesJS.Equation.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.fill, this.trace);
  }
  
  var evaluator;
  var parser;
  var space;
  var color;
  var width;
  var desp;
  var savex;
  var savey;
  var netsz;
  var w;
  var h;
  var dx;
  var dy;
  var q0;
  var qb;
  var t;
  var Q;
  var q;
  var Qx;
  var Qy;
  var t0;
  var zeroVisited;
  var side;
  var changeSide;
  var Px;
  var Py;
  var i;
  var j;
  
  /**
   * Funcion auxiliar para dibujar un arco
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el arco
   * @param {String} fill el color de relleno del arco
   * @param {String} stroke el color del trazo del arco
   */
  descartesJS.Equation.prototype.drawAux = function(ctx, fill, stroke) {
    ctx.lineWidth = 1;
    evaluator = this.evaluator;
    parser = evaluator.parser;
    space = this.space;

    color = descartesJS.getColor(evaluator, this.color);
    ctx.fillStyle = stroke;
    
    width = evaluator.evalExpression(this.width);
    desp = (width%2) ? .5 : 0;
    width = MathFloor(width)/2;

    savex = parser.getVariable("x");
    savey = parser.getVariable("y");
    netsz = 8;
    
    w = space.w;
    h = space.h;
    
    dx = MathFloor(w/netsz);
    if (dx<3) {
      dx=3;
    }
    dy = MathFloor(h/netsz);
    if (dy<3) {
      dy=3;
    }

    b = [];

    q0 = new descartesJS.R2();
    qb = new descartesJS.R2();
    t = new descartesJS.R2();

    for (j=MathFloor(dy/2); j<h; j+=dy) {
      for (i=MathFloor(dx/2); i<w; i+=dx) {
        if (this.abs_coord) {
          q = this.newt.findZero(new descartesJS.R2(i, j));
          evaluator.setVariable("x", q.x);
          evaluator.setVariable("y", q.y);
          Q = new descartesJS.R2(q.x, q.y);
        } else {
          q = this.newt.findZero(new descartesJS.R2(space.getRelativeX(i), space.getRelativeY(j)));
          evaluator.setVariable("x", q.x);
          evaluator.setVariable("y", q.y);
          Q = new descartesJS.R2(space.getAbsoluteX(q.x), space.getAbsoluteY(q.y));
        }
        
        Qx = MathFloor(Q.ix());
        Qy = MathFloor(Q.iy());
//         if (Qx<0 || Qx>=w || Qy<0 || Qy>=h || b[Qx][Qy]) {
        if (Qx<0 || Qx>=w || Qy<0 || Qy>=h || b[Qx + Qy*space.w]) {
          continue; // cero detectado
        }
//         b[Qx][Qy] = true;
        b[Qx + Qy*space.w] = true;

        q0.x = q.x;
        q0.y = q.y;
        qb.x = q.x;
        qb.y = q.y;
        
        // t=t0= Unit Tangent Vector
        t0 = this.newt.getUnitNormal();
        if (t0.x==0 && t0.y==0) {
          continue; /* Zero normal vector */
        }
        
        t0.rotL90();
        t.x = t0.x;
        t.y = t0.y;
        
        zeroVisited = 0;
        side = 0;
        changeSide = false;

        while (side < 2)  {
          if (changeSide) {
            t.x = -t0.x;
            t.y = -t0.y; // Invert Unit Tangent Vector
            
            q.x = q0.x;
            q.y = q0.y;
            
            qb.x = q.x;
            qb.y = q.y;
            
            Q = (this.abs_coord) ? (new descartesJS.R2(q.x, q.y)) : (new descartesJS.R2(space.getAbsoluteX(q.x), space.getAbsoluteY(q.y)));
            
            Qx = Q.ix();
            Qy = Q.iy();
            changeSide = false;
            zeroVisited = 0;
          }
          
          if (this.abs_coord) {
            q.x+=t.x; 
            q.y+=t.y; // advance along t aprox one pixel
          } else {
            q.x+=t.x/space.scale;
            q.y+=t.y/space.scale; // advance along t aprox one pixel
          }
          
          q = this.newt.findZero(q);
          evaluator.setVariable("x", q.x);
          evaluator.setVariable("y", q.y);
          
          t.x = q.x-qb.x;
          t.y = q.y-qb.y;
          t.normalize(); // update Unit Tangent Vector
          
          if (t.x==0 && t.y==0) {
            break; /* Zero tangent vector */
          }
          
          qb.x = q.x;
          qb.y = q.y;
          
          if (this.abs_coord) {
            Q = new descartesJS.R2(q.x, q.y);
          } else {
            Q = new descartesJS.R2(space.getAbsoluteX(q.x), space.getAbsoluteY(q.y));
          }
          
          Px = MathFloor(Q.ix());
          Py = MathFloor(Q.iy());
          
          if (Px!=Qx || Py!=Qy) {
            Qx = Px;
            Qy = Py;
            
            if (0<=Qx && Qx<w && 0<=Qy && Qy<h) {
              zeroVisited = 0;
              
              if (b[Qx + Qy*space.w]) {
//               if (b[Qx][Qy]) { /* Zero already detected */
                break;
              } else {
                b[Qx + Qy*space.w] = true;
//                 b[Qx][Qy]=true;
//                 if ((descartesJS.rangeOK) && (evaluator.evalExpression(this.drawif))) {
                if (descartesJS.rangeOK) {
                  ctx.drawImage(this.auxCanvas, (Qx-this.width_2), (Qy-this.width_2));
//                   descartesJS.drawPixel(ctx, Qx+desp, Qy+desp, width);
                }
              }
            } else {
              changeSide = true; 
              side++; /* Zero out of bounds */
            }
          } else if ( ++zeroVisited > 4 ) {
            changeSide = true; 
            side++; /* Stationary Zero */
          }
        }
      }
    }
 }

  /**
   * 
   */
  descartesJS.Equation.prototype.drawAuxFunY = function(ctx, fill, stroke) {
    var evaluator = this.evaluator;
    var space = this.space;
    var w = space.w;
    var dx = 1/space.scale;
    var theZeroY = space.getAbsoluteY(0);

    var width = evaluator.evalExpression(this.width);

    var color = descartesJS.getColor(evaluator, this.color);
    var colorFillM = descartesJS.getColor(evaluator, this.fillM);
    var colorFillP = descartesJS.getColor(evaluator, this.fillP);
    ctx.fillStyle = color;    
    
    var initX = space.getRelativeX(0);
    var tmpX;
    var tmpY;
    var actualTmpAbsoluteX;
    var actualTmpAbsoluteY;    

    evaluator.setVariable("x", initX);
    var previousTmpAbsoluteX = space.getAbsoluteX(initX);
    var previousTmpAbsoluteY = space.getAbsoluteY(evaluator.evalExpression(this.funExpr));
    
    var va = 0;    
    var min;
    var max;
    var minmax;
    
    for (var i=1; i<w; i++) {
      tmpX = initX + i*dx;
      evaluator.setVariable("x", tmpX);
      tmpY = evaluator.evalExpression(this.funExpr)
      evaluator.setVariable("y", tmpY);
      
      actualTmpAbsoluteX = space.getAbsoluteX(tmpX);
      actualTmpAbsoluteY = space.getAbsoluteY(tmpY);
      
      min = Math.min(va, tmpY);
      max = Math.max(va, tmpY);
      minmax = { min: min, max: max};
      
      if ( (tmpY !== undefined) && (descartesJS.rangeOK) && (evaluator.evalExpression(this.drawif)) ) {
        if ( !this.hasSingularity(dx, tmpX, "x", tmpX-dx, va, tmpX, tmpY, minmax) ){
          
          if ((this.fillM) || (this.fillP)) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = (actualTmpAbsoluteY > theZeroY) ? colorFillM : colorFillP;
            ctx.beginPath();
            ctx.moveTo(actualTmpAbsoluteX+.5, actualTmpAbsoluteY);
            ctx.lineTo(actualTmpAbsoluteX+.5, theZeroY);
            ctx.stroke();
          }

          ctx.lineWidth = width;
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(previousTmpAbsoluteX, previousTmpAbsoluteY);
          ctx.lineTo(actualTmpAbsoluteX, actualTmpAbsoluteY);
          ctx.stroke();
        }
        
      }
      
      va = tmpY || 0;
      
      previousTmpAbsoluteX = actualTmpAbsoluteX;
      previousTmpAbsoluteY = actualTmpAbsoluteY;
    }
    
  }
  
  /**
   * 
   */
  descartesJS.Equation.prototype.drawAuxFunX = function(ctx, fill, stroke) {
    var evaluator = this.evaluator;
    var space = this.space;
    var h = space.h;
    var dy = 1/space.scale;
    var theZeroX = space.getAbsoluteX(0);

    var width = evaluator.evalExpression(this.width);

    var color = descartesJS.getColor(evaluator, this.color);
    var colorFillM = descartesJS.getColor(evaluator, this.fillM);
    var colorFillP = descartesJS.getColor(evaluator, this.fillP);
    ctx.fillStyle = color;    
    
    var initY = space.getRelativeY(h);
    var tmpY;
    var tmpX;
    var actualTmpAbsoluteX;
    var actualTmpAbsoluteY;    

    evaluator.setVariable("y", initY);
    var previousTmpAbsoluteX = space.getAbsoluteX(evaluator.evalExpression(this.funExpr));
    var previousTmpAbsoluteY = space.getAbsoluteY(initY);
    
    var va = 0;    
    var min;
    var max;
    var minmax;
    
    for (var i=1; i<h; i++) {
      tmpY = initY + i*dy;
      evaluator.setVariable("y", tmpY);
      tmpX = evaluator.evalExpression(this.funExpr)
      evaluator.setVariable("x", tmpX);

      actualTmpAbsoluteX = space.getAbsoluteX(tmpX);
      actualTmpAbsoluteY = space.getAbsoluteY(tmpY);
      
      min = Math.min(va, tmpX);
      max = Math.max(va, tmpX);
      minmax = { min: min, max: max};

      if ( (tmpY !== undefined) && (descartesJS.rangeOK) && (evaluator.evalExpression(this.drawif)) ) {
        if ( !this.hasSingularity(dy, tmpY, "y", tmpY-dy, va, tmpY, tmpX, minmax) ){
          
          if ((this.fillM) || (this.fillP)) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = (actualTmpAbsoluteX > theZeroX) ? colorFillM : colorFillP;
            ctx.beginPath();
            ctx.moveTo(actualTmpAbsoluteX, actualTmpAbsoluteY+.5);
            ctx.lineTo(theZeroX, actualTmpAbsoluteY+.5);
            ctx.stroke();
          }

          ctx.lineWidth = width;
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(previousTmpAbsoluteX, previousTmpAbsoluteY);
          ctx.lineTo(actualTmpAbsoluteX, actualTmpAbsoluteY);
          ctx.stroke();
        }
        
      }

      va = tmpX || 0;
        
      previousTmpAbsoluteX = actualTmpAbsoluteX;
      previousTmpAbsoluteY = actualTmpAbsoluteY;
    }
    
  }
  
// //   if ( !this.hasSingularity(dx, tmpX, "x", tmpX-dx, va, tmpX, tmpY, minmax) ){
// //   X = tmpX
// //   vari = "x"
// //   a = tmpX-dx
// //   va = tmpY <-anterior
// //   b = tmpX
// //   vb = tmpY
// //   minimo entre tmpY anterior y tmpY
// //   maximo entre tmpY anterior y tmpY

  /**
   * 
   */
  descartesJS.Equation.prototype.hasSingularity = function(e, X, vari, a, va, b, vb, minmax) {
    if ( (Math.abs(b-a) < 1E-12) || ((Math.abs(b-a) < 1E-8) && (Math.abs(vb-va) > Math.abs(e))) ) {
      return true;
    }
    var disc = false;
    var saveX = X;
    
    var Xr = (a+b)/2;
    this.evaluator.setVariable(vari, Xr);
    var auxv = this.evaluator.evalExpression(this.funExpr);
    
//     try {
      if ((minmax.min <= auxv) && (auxv <= minmax.max)) {
        disc = false;
      } else {
        minmax.x = Math.min(minmax.min, auxv);
        minmax.y = Math.max(minmax.max, auxv);
        disc = this.hasSingularity(e, X, vari, a, va, Xr, auxv, minmax) || this.hasSingularity(e, X, vari, Xr, auxv, b, vb, minmax);
      }
//     }catch (e) { 
//       disc = true; 
//     }
        
    this.evaluator.setVariable(vari, saveX);

    return disc;
  }
  
  /**
   * Dibuja un pixel
   * @param {2DContext} ctx el contexto de canvas donde dibujar
   * @param {Number} x la posicion en x del pixel
   * @param {Number} y la posicion en y del pixel
   * @param {String} color el color del pixel a dibujar
   * @param {Number} radius el tamano del pixel
   */
  descartesJS.drawPixel = function(ctx, x, y, radius) {
//     ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, 0, PI2, false);
//     ctx.fill();
  }

  /**
   * 
   */
  descartesJS.Equation.prototype.registerTextField = function() {
    var textField = document.createElement("input");
    textField.value = this.expresionString;
    textField.disabled = !(this.editable);
    
    var self = this;
    textField.onkeydown = function(evt) {
      if (evt.keyCode == 13) {
        self.expresion = self.evaluator.parser.parse(this.value);
        self.parseExpresion();
        self.parent.update();
      }
    }
   
    this.parent.editableRegion.textFields.push(textField); 
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una curva de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la curva
   */
  descartesJS.Curve = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    this.width = (this.width == -1) ? this.evaluator.parser.parse("1") : this.width;

    // ## parche para la version de descartes 2 ## //
    this.visible = ((this.parent.version == 2) && (this.visible == undefined)) ? true : false;

    if (this.visible) {
      this.registerTextField();
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Curve, descartesJS.Graphic);
  
  /**
   * Actualiza la curva
   */
  descartesJS.Curve.prototype.update = function() {
    var evaluator = this.evaluator;

    var para = evaluator.evalExpression(this.parameter_interval);

    this.paraInf = para[0][0]; //el primer valor de la primera expresion
    this.paraSup = para[0][1]; //el segundo valor de la primera expresion

    this.pSteps = evaluator.evalExpression(this.parameter_steps);
    this.paraSep = (this.pSteps > 0) ? Math.abs(this.paraSup - this.paraInf)/this.pSteps : 0;
  }

  /**
   * dibuja la curva
   */
  descartesJS.Curve.prototype.draw = function(){
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.fill, this.color);
  }

  /**
   * Dibuja el rastro de la curva
   */
  descartesJS.Curve.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.fill, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar una curva
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja una curva
   * @param {String} fill el color de relleno de una curva
   * @param {String} stroke el color del trazo de una curva
   */
  descartesJS.Curve.prototype.drawAux = function(ctx, fill, stroke){
    var evaluator = this.evaluator;
    var space = this.space;

    // el ancho de una linea no puede ser 0 ni negativa
    var tmpLineWidth = this.evaluator.evalExpression(this.width);
    if (tmpLineWidth <=0) {
      tmpLineWidth = 0.000001;
    }
    ctx.lineWidth = tmpLineWidth;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = descartesJS.getColor(evaluator, stroke);
    
    var tempParam = evaluator.getVariable(this.parameter);
    
    ctx.beginPath();
    
    evaluator.setVariable(this.parameter, this.paraInf);
    
    var expr = evaluator.evalExpression(this.expresion);
    this.exprX = (this.abs_coord) ? expr[0][0] : space.getAbsoluteX(expr[0][0]);
    this.exprY = (this.abs_coord) ? expr[0][1] : space.getAbsoluteY(expr[0][1]);

    //MACRO//
    // se rotan los elementos en caso de ser un macro con rotacion
    var radianAngle;
    var cosTheta;
    var senTheta;
    var tmpRotX;
    var tmpRotY;

    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(this.evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }
    //MACRO//
    
    ctx.moveTo(this.exprX+.5, this.exprY+.5);
    for(var i=1; i<=this.pSteps; i++) {
      evaluator.setVariable( this.parameter, (this.paraInf+(i*this.paraSep)) );
      
      expr = evaluator.evalExpression(this.expresion);
      this.exprX = (this.abs_coord) ? expr[0][0] : space.getAbsoluteX(expr[0][0]);
      this.exprY = (this.abs_coord) ? expr[0][1] : space.getAbsoluteY(expr[0][1]);

      //MACRO//
      // se rotan los elementos en caso de ser un macro con rotacion
      if (this.rotateExp) {
        tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
        tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
        this.exprX = tmpRotX;
        this.exprY = tmpRotY;
      }
      //MACRO//
      
      ctx.lineTo(this.exprX+.5, this.exprY+.5);
    }
        
    if (this.fill) {
      ctx.fill();
    }
    ctx.stroke();
    
    evaluator.setVariable(this.parameter, tempParam);
        
//     ctx.restore()
  }
    
  /**
   * 
   */
  descartesJS.Curve.prototype.registerTextField = function() {
    var textField = document.createElement("input");
    textField.value = this.expresionString;
    textField.disabled = !(this.editable);

    var self = this;
    textField.onkeydown = function(evt) {
      if (evt.keyCode == 13) {
      self.expresion = self.evaluator.parser.parse(this.value);
      self.parent.update();
      }
    }
   
    this.parent.editableRegion.textFields.push(textField); 
  }
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  
  /**
   * Una secuencia de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la secuencia
   */
  descartesJS.Sequence = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);
    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Sequence, descartesJS.Graphic);

  /**
   * Actualiza la secuencia
   */
  descartesJS.Sequence.prototype.update = function() { 
    var evaluator = this.evaluator;

    var expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0]; //el primer valor de la primera expresion
    this.exprY = expr[0][1]; //el segundo valor de la primera expresion

    // se rotan los elementos en caso de ser un macro con rotacion
    if (this.rotateExp) {
      var radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      var cosTheta = Math.cos(radianAngle);
      var senTheta = Math.sin(radianAngle);
      var tmpRotX;
      var tmpRotY;
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }

    var range = evaluator.evalExpression(this.range);
    this.rangeInf = range[0][0];
    this.rangeMax = range[0][1];
  }

  /**
   * Dibuja la secuencia
   */
  descartesJS.Sequence.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.color, this.color);
  }

  /**
   * Dibuja el rastro de la secuencia
   */
  descartesJS.Sequence.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar una secuencia
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja la secuencia
   * @param {String} fill el color de relleno de la secuencia
   */
  descartesJS.Sequence.prototype.drawAux = function(ctx, fill){
    var evaluator = this.evaluator;
    
    var coordX;
    var coordY;
    var expr;
    var size = Math.ceil(evaluator.evalExpression(this.size)-.4);
    var desp = size;

//     ctx.save();

    // se dibuja la secuencia
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);

    ctx.beginPath();

    if (this.rangeInf > this.rangeMax) {
      var tmp = this.rangeInf;
      this.rangeInf = this.rangeMax;
      this.rangeMax = tmp;
    }
      
    var tmpValue = evaluator.getVariable("n");
    for (var i=this.rangeInf, l=this.rangeMax; i<=l; i++) {

      evaluator.setVariable("n", i);
      
      expr = evaluator.evalExpression(this.expresion);
      this.exprX = expr[0][0];
      this.exprY = expr[0][1];
      
      if (this.abs_coord) {
        coordX = expr[0][0];
        coordX = expr[0][1];
      } else {
        coordX = this.space.getAbsoluteX(expr[0][0]);
        coordY = this.space.getAbsoluteY(expr[0][1]);
      }
      
      ctx.moveTo(coordX, coordY);
      ctx.arc(coordX, coordY, size, 0, PI2, true);
    }
    evaluator.setVariable("n", tmpValue);
    
    ctx.fill();

    // se dibuja el texto
    if (this.text != [""]) {
      this.uber.drawText.call(this, ctx, this.text, coordX+desp, coordY-desp, this.color, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed);
    }

//     ctx.restore();
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  var mathRound = Math.round;
  
  /**
   * Un punto de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el punto
   */
  descartesJS.Point = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Point, descartesJS.Graphic);

  var evaluator;
  var space;
  var expr;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var coordX;
  var coordY;
  var size;
  var desp;

  /**
   * Actualiza el punto
   */
  descartesJS.Point.prototype.update = function() { 
    evaluator = this.evaluator;

    expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0]; //el primer valor de la primera expresion
    this.exprY = expr[0][1]; //el segundo valor de la primera expresion

    // se rotan los elementos en caso de ser un macro con rotacion
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }
  }

  /**
   * Dibuja el punto
   */
  descartesJS.Point.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.color, this.color);
  }

  /**
   * Dibuja el rastro del punto
   */
  descartesJS.Point.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar un punto
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el punto
   * @param {String} fill el color de relleno del punto
   */
  descartesJS.Point.prototype.drawAux = function(ctx, fill){
    evaluator = this.evaluator;
    space = this.space;

    size = mathRound(evaluator.evalExpression(this.size));
    desp = size;

    // se dibuja el punto
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);

    coordX = (this.abs_coord) ? mathRound(this.exprX) : mathRound(space.getAbsoluteX(this.exprX));
    coordY = (this.abs_coord) ? mathRound(this.exprY) : mathRound(space.getAbsoluteY(this.exprY));
     
    ctx.beginPath();
    ctx.arc(coordX, coordY, size, 0, PI2, true);
    ctx.fill()

    // se dibuja el texto
    if (this.text != [""]) {
      this.uber.drawText.call(this, ctx, this.text, coordX+desp, coordY-desp, this.color, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed);
    }

  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;

  /**
   * Un segmento de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el segmento
   */
  descartesJS.Segment = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    this.width = (this.width == -1) ? this.evaluator.parser.parse("1") : this.width;

  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Segment, descartesJS.Graphic);

  /**
   * Actualiza el segmento
   */
  descartesJS.Segment.prototype.update = function() {
    var evaluator = this.evaluator;

    var points = evaluator.evalExpression(this.expresion);
    this.endPoints = [];

    for(var i=0, l=points.length; i<l; i++){
      this.endPoints[i] = {x: points[i][0], y: points[i][1]};
    }

    // se rotan los elementos en caso de ser un macro con rotacion
    if (this.rotateExp) {
      var radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      var cosTheta = Math.cos(radianAngle);
      var senTheta = Math.sin(radianAngle);
      var tmpRotX;
      var tmpRotY;
      
      for (var i=0, l=this.endPoints.length; i<l; i++) {
        tmpRotX = this.endPoints[i].x*cosTheta - this.endPoints[i].y*senTheta;
        tmpRotY = this.endPoints[i].x*senTheta + this.endPoints[i].y*cosTheta;
        this.endPoints[i].x = tmpRotX;
        this.endPoints[i].y = tmpRotY;
      }      
    }
  }

  /**
   * Dibuja el segmento
   */
  descartesJS.Segment.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.color, this.color);
  }
  
  /**
   * Dibuja el rastro del segmento
   */
  descartesJS.Segment.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar un segmento
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el segmento
   * @param {String} fill el color de relleno del segmento
   */
  descartesJS.Segment.prototype.drawAux = function(ctx, fill, stroke){
    var evaluator = this.evaluator;

    // el ancho de una linea no puede ser 0 ni negativa
    var tmpLineWidth = evaluator.evalExpression(this.width);
    if (tmpLineWidth <=0) {
      tmpLineWidth = 0.000001;
    }
    ctx.lineWidth = tmpLineWidth;

    var desp, midpX, midpY;
    
    var size = evaluator.evalExpression(this.size);
    if (size < 0) {
      size = 0;
    }
    
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = descartesJS.getColor(evaluator, stroke);
    ctx.lineCap = "round";
    
    desp = 10+ctx.lineWidth;
    
    var lineDesp = (ctx.lineWidth%2 == 0) ? 0 : 0.5;
    
    var coordX, coordY, coordX1, coordY1, spear;      
    if (this.abs_coord) {
      coordX =  this.endPoints[0].x;
      coordY =  this.endPoints[0].y;
      coordX1 = this.endPoints[1].x;
      coordY1 = this.endPoints[1].y;
    } else {
      coordX =  this.space.getAbsoluteX(this.endPoints[0].x);
      coordY =  this.space.getAbsoluteY(this.endPoints[0].y);
      coordX1 = this.space.getAbsoluteX(this.endPoints[1].x);
      coordY1 = this.space.getAbsoluteY(this.endPoints[1].y);        
    }
    
    var size = evaluator.evalExpression(this.size);
    if (size < 0) {
      size = 0;
    }
    
    ctx.beginPath();
    ctx.moveTo(coordX+lineDesp, coordY+lineDesp);
    ctx.lineTo(coordX1+lineDesp, coordY1+lineDesp);
    
    // se dibuja el texto
    if (this.text != [""]) {
      midpX = (coordX + coordX1)/2;
      midpY = (coordY + coordY1)/2;
      
      this.uber.drawText.call(this, ctx, this.text, midpX+desp, midpY-desp, this.color, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed);
    }
    
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(coordX, coordY, size, 0, PI2, true);
    ctx.arc(coordX1, coordY1, size, 0, PI2, true);
    ctx.fill();
    
//     ctx.restore();
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  
  /**
   * Una flecha de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la flecha
   */
  descartesJS.Arrow = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    this.width = (this.width == -1) ? this.evaluator.parser.parse("5") : this.width;

  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Arrow, descartesJS.Graphic);
  
  /**
   * Actualiza la flecha
   */
  descartesJS.Arrow.prototype.update = function() {
    var evaluator = this.evaluator;

    var points = evaluator.evalExpression(this.expresion);
    this.endPoints = [];

    for(var i=0, l=points.length; i<l; i++){
      this.endPoints[i] = {x: points[i][0], y: points[i][1]};
    }
    
    // se rotan los elementos en caso de ser un macro con rotacion
    if (this.rotateExp) {
      var radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      var cosTheta = Math.cos(radianAngle);
      var senTheta = Math.sin(radianAngle);
      var tmpRotX;
      var tmpRotY;
      
      for (var i=0, l=this.endPoints.length; i<l; i++) {
        tmpRotX = this.endPoints[i].x*cosTheta - this.endPoints[i].y*senTheta;
        tmpRotY = this.endPoints[i].x*senTheta + this.endPoints[i].y*cosTheta;
        this.endPoints[i].x = tmpRotX;
        this.endPoints[i].y = tmpRotY;
      }      
    }
    
  }

  /**
   * Dibuja la flecha
   */
  descartesJS.Arrow.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.arrow, this.color);
  }

  /**
   * Dibuja el rastro de la flecha
   */
  descartesJS.Arrow.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.arrow, this.trace);
  }

  /**
   * Funcion auxiliar para dibujar una flecha
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja la flecha
   * @param {String} fill el color de relleno de la flecha
   * @param {String} stroke el color del trazo de la flecha
   */
  descartesJS.Arrow.prototype.drawAux = function(ctx, fill, stroke){
    var evaluator = this.evaluator;
    var space = this.space;

    var midpX, midpY;
    var desp = 10 + evaluator.evalExpression(this.size);
    var width1 = evaluator.evalExpression(this.width);
    if (width1 < 1) {
      width1 = 1;
    }
    var width2 = Math.ceil(width1/2);
    var scale = space.scale;
    
    this.vect = new descartesJS.Vector2D(this.endPoints[1].x-this.endPoints[0].x, this.endPoints[1].y-this.endPoints[0].y);
    var vlength = this.vect.vectorLength();
    this.angle = this.vect.angleBetweenVectors(descartesJS.Vector2D.AXIS_X);
    
//     ctx.save();
    
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = descartesJS.getColor(evaluator, stroke);
    ctx.lineWidth = 1.0;
    
    var lineDesp = (ctx.lineWidth%2 == 0) ? 0 : 0.5
    
    var coordX, coordY, coordX1, coordY1, spear;
    if (this.abs_coord) {
      coordX =  this.endPoints[0].x;
      coordY =  this.endPoints[0].y;
      
      coordX1 = this.endPoints[1].x;
      coordY1 = this.endPoints[1].y;
    } else {
      coordX =  space.getAbsoluteX(this.endPoints[0].x);
      coordY =  space.getAbsoluteY(this.endPoints[0].y);
    
      coordX1 = space.getAbsoluteX(this.endPoints[1].x);
      coordY1 = space.getAbsoluteY(this.endPoints[1].y);        
    }
    
    var spear = evaluator.evalExpression(this.spear);
    if (spear < 0) {
      spear = 0
    }
    
    ctx.save();
    ctx.translate(coordX, coordY, vlength);
    
    if (this.abs_coord) {
      if (((this.vect.x >= 0) && (this.vect.y >= 0)) || ((this.vect.x <= 0) && (this.vect.y >= 0))) {
        ctx.rotate(this.angle)
      } else {
        ctx.rotate(-this.angle)
      }
    } else {
      vlength = vlength*scale;
      
      if (((this.vect.x >= 0) && (this.vect.y >= 0)) || ((this.vect.x <= 0) && (this.vect.y >= 0))) {
        ctx.rotate(-this.angle)
      } else {
        ctx.rotate(this.angle)
      }
    }
    
    ctx.beginPath();
//     ctx.moveTo(-width2 +.5,                         MathFloor(-width2) +.5);
//     ctx.lineTo(MathFloor(vlength-spear-width1) +.5, MathFloor(-width2) +.5);
//     ctx.lineTo(MathFloor(vlength-2*spear) +.5,      MathFloor(-spear-width2) +.5);
//     ctx.lineTo(MathFloor(vlength) +.5,             .5);
//     ctx.lineTo(MathFloor(vlength-2*spear) +.5,      MathFloor(spear+width2) +.5);
//     ctx.lineTo(MathFloor(vlength-spear-width1) +.5, MathFloor(width2) +.5);
//     ctx.lineTo(-width2 +.5,                         MathFloor(width2) +.5);
    ctx.moveTo(-width2 +.5,                         MathFloor(-width2) +.5);
    ctx.lineTo(MathFloor(vlength-spear-width1) +.5, MathFloor(-width2) +.5);
    ctx.lineTo(MathFloor(vlength-2*spear) +.5,      MathFloor(-spear-width2) +.5);
    ctx.lineTo(MathFloor(vlength) +.5,              0);
    ctx.lineTo(MathFloor(vlength-2*spear) +.5,      MathFloor(spear+width2) -.5);
    ctx.lineTo(MathFloor(vlength-spear-width1) +.5, MathFloor(width2) -.5);
    ctx.lineTo(-width2 +.5,                         MathFloor(width2) -.5);
    
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
    
    // se dibuja el texto
    if (this.text != [""]) {
      midpX = (coordX + coordX1)/2;
      midpY = (coordY + coordY1)/2;
      
      this.uber.drawText.call(this, ctx, this.text, midpX, midpY, stroke, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed);
    }
    
//     ctx.restore();
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathRound = Math.round;

  /**
   * Un poligono de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el poligono
   */
  descartesJS.Polygon = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    this.width = (this.width == -1) ? this.evaluator.parser.parse("1") : this.width;
    this.endPoints = [];
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Polygon, descartesJS.Graphic);
  
  var evaluator;
  var space;
  var points;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var tmpLineWidth;
  var lineDesp;
  var coordX;
  var coordY;
  /**
   * Actualiza el poligono
   */
  descartesJS.Polygon.prototype.update = function() {
    evaluator = this.evaluator;

    points = evaluator.evalExpression(this.expresion);
    
    for(var i=0, l=points.length; i<l; i++){
      this.endPoints[i] = { x: points[i][0], y: points[i][1] };
    }
    
    // se rotan los elementos en caso de ser un macro con rotacion
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      for (var i=0, l=this.endPoints.length; i<l; i++) {
        tmpRotX = this.endPoints[i].x*cosTheta - this.endPoints[i].y*senTheta;
        tmpRotY = this.endPoints[i].x*senTheta + this.endPoints[i].y*cosTheta;
        this.endPoints[i].x = tmpRotX;
        this.endPoints[i].y = tmpRotY;
      }      
    }
  }
  
  /**
   * Dibuja el poligono
   */
  descartesJS.Polygon.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.fill, this.color);
  }
  
  /**
   * Dibuja el rastro del poligono
   */
  descartesJS.Polygon.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar un poligono
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el poligono
   * @param {String} fill el color de relleno del poligono
   */
  descartesJS.Polygon.prototype.drawAux = function(ctx, fill, stroke) {
    evaluator = this.evaluator;
    space = this.space;

    // el ancho de una linea no puede ser 0 ni negativa
    tmpLineWidth = mathRound( evaluator.evalExpression(this.width) );
    ctx.lineWidth = (tmpLineWidth > 0) ? tmpLineWidth : 0.000001;
    
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = descartesJS.getColor(evaluator, stroke);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    lineDesp = .5;

    coordX = (this.abs_coord) ? mathRound(this.endPoints[0].x) : mathRound(space.getAbsoluteX(this.endPoints[0].x));
    coordY = (this.abs_coord) ? mathRound(this.endPoints[0].y) : mathRound(space.getAbsoluteY(this.endPoints[0].y));
    
    ctx.beginPath();
    ctx.moveTo(coordX+lineDesp, coordY+lineDesp);
    
    for(var i=1, l=this.endPoints.length; i<l; i++) {
      coordX = (this.abs_coord) ? this.endPoints[i].x : space.getAbsoluteX(this.endPoints[i].x);
      coordY = (this.abs_coord) ? this.endPoints[i].y : space.getAbsoluteY(this.endPoints[i].y);
      
      ctx.lineTo(coordX+lineDesp, coordY+lineDesp);
    }
    
    // se rellena el poligono
    if (this.fill) {
      ctx.fill();
    }
    
    // se dibuja el borde
    ctx.stroke();
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  /**
   * Un arco de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el arco
   */
  descartesJS.Arc = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);
    
    this.width = (this.width == -1) ? this.evaluator.parser.parse("1") : this.width;    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Arc, descartesJS.Graphic);

  /**
   * Actualiza el arco
   */
  descartesJS.Arc.prototype.update = function() {
    var evaluator = this.evaluator;

    var expr = evaluator.evalExpression(this.center);
    this.exprX = expr[0][0]; //el primer valor de la primera expresion
    this.exprY = expr[0][1]; //el segundo valor de la primera expresion
    
    // se rotan los elementos en caso de ser un macro con rotacion
    if (this.rotateExp) {
      var radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      var cosTheta = Math.cos(radianAngle);
      var senTheta = Math.sin(radianAngle);
      var tmpRotX;
      var tmpRotY;
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }

    var iniAng = evaluator.evalExpression(this.init);
    var endAng = evaluator.evalExpression(this.end);

    // si la expresion del angulo inicial y el final son expresiones parentizadas, entonces los angulos estan especificados como vectores
    if ( ((this.init.type == "(expr)") && (this.end.type == "(expr)")) || 
         ((this.init.type == "[expr]") && (this.end.type == "[expr]")) || 
         ((this.init.type == "(expr)") && (this.end.type == "[expr]")) || 
         ((this.init.type == "[expr]") && (this.end.type == "(expr)")) 
       ) {
      this.vectors = true;
      var u1 = iniAng[0][0];
      var u2 = iniAng[0][1];
      var v1 = endAng[0][0];
      var v2 = endAng[0][1];
    
      var w1 = 1;
      var w2 = 0;
      var angulo1;
      var angulo2;
      
      // se encuentran los angulos
      angulo1 = Math.acos( (u1*w1+u2*w2)/Math.sqrt(u1*u1+u2*u2) );
      angulo2 = Math.acos( (v1*w1+v2*w2)/Math.sqrt(v1*v1+v2*v2) );

      // cambio en base al cuadrante para el primer angulo
      if ((u1 > 0) && (u2 > 0) && !this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      if ((u1 > 0) && (u2 < 0) && this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      if ((u1 < 0) && (u2 < 0) && this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      if ((u1 < 0) && (u2 > 0) && !this.abs_coord) {
        angulo1 = 2*Math.PI-angulo1;
      }
      
      // cambio en base al cuadrante para el segundo angulo
      if ((v1 > 0) && (v2 > 0) && !this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      if ((v1 > 0) && (v2 < 0) && this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      if ((v1 < 0) && (v2 < 0) && this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      if ((v1 < 0) && (v2 > 0) && !this.abs_coord) {
        angulo2 = 2*Math.PI-angulo2;
      }
      
//       this.anguloInterior = Math.acos( (u1*v1+u2*v2)/(Math.sqrt(u1*u1+u2*u2)*Math.sqrt(v1*v1+v2*v2)) );

      // se escoge siempre los angulos en orden del menor al mayor
      var tmpAngulo1 = Math.min(angulo1, angulo2);
      var tmpAngulo2 = Math.max(angulo1, angulo2);
      angulo1 = tmpAngulo1;
      angulo2 = tmpAngulo2;

      // si el angulo interno es mayor que PI y el arco esta en coordenadas absolutas
      if (((angulo2 - angulo1) > Math.PI) && this.abs_coord) {
        angulo1 = tmpAngulo2;
        angulo2 = tmpAngulo1;
      }
      // si el angulo interno es menor que PI y el arco esta en coordenadas relativas
      if (((angulo2 - angulo1) <= Math.PI) && !this.abs_coord) {
        angulo1 = tmpAngulo2;
        angulo2 = tmpAngulo1;
      }

//       console.log(u1, u2, "-------", v1, v2, "-------", angulo1*180/Math.PI, angulo2*180/Math.PI, "-------", this.anguloInterior*180/Math.PI);

      this.iniAng = angulo1;
      this.endAng = angulo2;
    }
    else {
      this.vectors = false;
      this.iniAng = descartesJS.degToRad(iniAng);
      this.endAng = descartesJS.degToRad(endAng);
    }
    
  }

  /**
   * Dibuja el arco
   */
  descartesJS.Arc.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.fill, this.color);
  }

  /**
   * Dibuja el rastro del arco
   */
  descartesJS.Arc.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.fill, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar un arco
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el arco
   * @param {String} fill el color de relleno del arco
   * @param {String} stroke el color del trazo del arco
   */
  descartesJS.Arc.prototype.drawAux = function(ctx, fill, stroke) {
    var evaluator = this.evaluator;
    var space = this.space;
    
    var desp = 1;
    var coordX = (this.abs_coord) ? MathFloor(this.exprX)+.5 : MathFloor(space.getAbsoluteX(this.exprX))+.5;
    var coordY = (this.abs_coord) ? MathFloor(this.exprY)+.5 : MathFloor(space.getAbsoluteY(this.exprY))+.5;
    var radius = evaluator.evalExpression(this.radius);
    
    if (!this.vectors) {
      // verificacion de los datos
      if (this.iniAng > this.endAng) {
        var tempAng = this.iniAng;
        this.iniAng = this.endAng;
        this.endAng = tempAng;
      }
    }
   
    if (radius < 0) {
      radius = 0;
    }
    
    var clockwise = false;

    if (!this.abs_coord) {
      radius = radius*space.scale;
      if (!this.vectors) {
        this.iniAng = -this.iniAng;
        this.endAng = -this.endAng;
        clockwise = true;
      }
    }
    
    // si los arcos estan especificados con vectores
    if (this.vectors) {
      if (this.abs_coord) {
        clockwise = false;
      }
      else {
        clockwise = true;
      }
    }
    
    // el ancho de una linea no puede ser 0 ni negativa
    var tmpLineWidth = evaluator.evalExpression(this.width);
    if (tmpLineWidth <=0) {
      tmpLineWidth = 0.000001;
    }
    ctx.lineWidth = tmpLineWidth;

    ctx.lineCap = "round";
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = descartesJS.getColor(evaluator, stroke);

    // se crea otro arco para dibujar el area coloreada del arco
    if (this.fill) {
      ctx.beginPath();
      ctx.moveTo(coordX, coordY);
      ctx.arc(coordX, coordY, radius, this.iniAng, this.endAng, clockwise);
      ctx.fill();        
    }
      
    ctx.beginPath();
    ctx.arc(coordX, coordY, radius, this.iniAng, this.endAng, clockwise);
    ctx.stroke();
    
    // se dibuja el texto
    if (this.text != [""]) {
      this.uber.drawText.call(this, ctx, this.text, coordX+desp, coordY-desp, this.color, this.font, "start", "alphabetic", evaluator.evalExpression(this.decimals), this.fixed);
    }
      
//     ctx.restore();    
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un relleno de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el relleno
   */
  descartesJS.Fill = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    // this.pixelStack = [];
    // this.startColor;
    // console.log(this.expresion, this.ctx, "|", this.space.w, this.space.h)
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Fill, descartesJS.Graphic);

  /**
   * Actualiza el relleno
   */
  descartesJS.Fill.prototype.update = function() {
    // var evaluator = this.evaluator;

    // var expr = evaluator.evalExpression(this.expresion);
    // this.exprX = expr[0][0]; //el primer valor de la primera expresion
    // this.exprY = expr[0][1]; //el segundo valor de la primera expresion

    // this.exprX = parseInt( this.space.getAbsoluteX(this.exprX+.1) );
    // this.exprY = parseInt( this.space.getAbsoluteY(this.exprY+.1) );

    // this.imageData = this.ctx.getImageData(0, 0, this.space.w, this.space.h);

    // var pixelPos = (this.exprY*this.space.w + this.exprX) * 4;
    // this.startColor = { r: this.imageData.data[pixelPos],
    //                     g: this.imageData.data[pixelPos+1],
    //                     b: this.imageData.data[pixelPos+2],
    //                     a: this.imageData.data[pixelPos+3]
    //                   }

    // this.pixelStack.push( [this.exprX, this.exprY] );
    // // console.log(this.startColor, pixelPos, this.exprX, this.exprY, this.imageData)
  }

  /**
   * Dibuja el relleno
   */
  descartesJS.Fill.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.color, this.color);
  }

  /**
   * Dibuja el rastro del relleno
   */
  descartesJS.Fill.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar un relleno
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el relleno
   * @param {String} fill el color de relleno del relleno
   */
  descartesJS.Fill.prototype.drawAux = function(ctx, fill) {
    // var evaluator = this.evaluator;
    // var fillColor = getColorComponents(descartesJS.getColor(evaluator, fill));
    // var newPos;
    // var x;
    // var y;

    // while (this.pixelStack.length) {
    //   newPos = this.pixelStack.pop();
    //   x = newPos[0];
    //   y = newPos[1];
    // }
  }

  function getColorComponents(color) {
    // var tmp;
    // var resultColor = { r: 0, g: 0, b: 0, a: 0 };

    // if (color.match(/^rgba/)) {
    //   tmp = color.substring(5, color.length-1).split(",");
    //   resultColor.r = tmp[0];
    //   resultColor.g = tmp[1];
    //   resultColor.b = tmp[2];
    //   resultColor.a = tmp[3];

    //   return resultColor;
    // }
    // else if (color.match(/^#/)) {
    //   tmp = color.substring(1);
    //   resultColor.r = parseInt(tmp.substring(0,2), 16);
    //   resultColor.g = parseInt(tmp.substring(2,4), 16);
    //   resultColor.b = parseInt(tmp.substring(4,6), 16);

    //   return resultColor;
    // }
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un texto de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el texto
   */
  descartesJS.Text = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    // alineacion
    if (!this.align) {
      this.align = "start";
    }
    
    // el texto no tiene especificado el ancho
    if (this.width == -1) {
      this.width = this.evaluator.parser.parse("0");
    }
    
    this.abs_coord = true;
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Text, descartesJS.Graphic);
  
  /**
   * Actualiza el texto
   */
  descartesJS.Text.prototype.update = function() {
    var evaluator = this.evaluator;

    var expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0]; //el primer valor de la primera expresion
    this.exprY = expr[0][1]; //el segundo valor de la primera expresion

    // se rotan los elementos en caso de ser un macro con rotacion
    if (this.rotateExp) {
      var radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      var cosTheta = Math.cos(radianAngle);
      var senTheta = Math.sin(radianAngle);
      var tmpRotX;
      var tmpRotY;
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }
  }

  /**
   * Dibuja el texto
   */
  descartesJS.Text.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.color);
  }

  /**
   * Dibuja el rastro del texto
   */
  descartesJS.Text.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.color);
  }
  
  /**
   * Funcion auxiliar para dibujar un texto
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el texto
   * @param {String} fill el color de relleno del texto
   */
  descartesJS.Text.prototype.drawAux = function(ctx, fill) {
    var newText;
    if (this.text.type === "rtfNode") {
      newText = this.text;
    }
    else {
      newText = this.splitText(this.text.toString(this.evaluator.evalExpression(this.decimals), this.fixed).split("\\n"))
    }
    
    // se dibuja el texto
    if (this.text != [""]) {
      this.uber.drawText.call(this, ctx, newText, parseFloat(this.exprX)+5, parseFloat(this.exprY), fill, this.font, this.align, "hanging");
    }
  }
  
  /**
   * 
   */
  descartesJS.Text.prototype.splitText = function(text) {
    var width = this.evaluator.evalExpression(this.width);
    var textLine;
    var w;
    var newText = [];
    var height;
    
    this.ctx.font = this.font;
    this.fontSize = this.font.match(/(\d+)px/);
    if (this.fontSize) {
      this.fontSize = this.fontSize[1];
    } else {
      this.fontSize = "10";
    } 

    // si el ancho es mayor que 20 entonces si hay que partir el texto
    // ademas el texto no debe ser en rtf text.type != "undefined"
    if ( (width >=20) && (text.type != "undefined") ) {
      for (var i=0, l=text.length; i<l; i++) {
        textLine = text[i];
        w = (this.ctx.measureText(textLine)).width;

        if (w > width) {
          newText = newText.concat( this.splitWords(textLine, width) );
        }
        else {
          newText.push(textLine);
        }    
      }
      

      height = Math.floor(this.fontSize*1.2)*(newText.length);
      this.evaluator.setVariable("_Text_H_", height);
      return newText;
    }
    
    this.evaluator.setVariable("_Text_H_", 0);
    this.evaluator.setVariable("_Text_W_", 1000);

    return text;
  }
    
  /**
   * 
   */
  descartesJS.Text.prototype.splitWords = function(text, widthLimit) {
    var restText = text;
    var resultText = [];
    
    var tempText;
    var tempTextWidth;
    var tempIndex;

    var lastIndexOfWhite;
    var inTheWord = false;
        
    do {
      tempIndex = Math.floor(restText.length*(widthLimit/this.ctx.measureText(restText).width)) +1;

      tempText = restText.slice(0, tempIndex);
      
      // si el texto inicia con un espacio en blanco, entonces se ignora el espacio en blanco
      if ((tempText != "") && (tempText[0] == " ")) {
        restText = restText.slice(1);
        tempText = restText.slice(0, tempIndex);
      }
      
      // se busca si se esta entre un palabra
      inTheWord = ( (restText[tempIndex-1]) && (restText[tempIndex]) && (restText[tempIndex-1] != " ") && (restText[tempIndex] != " ") );
      
      // se busca el ultimo indice del espacio en blanco
      lastIndexOfWhite = tempText.lastIndexOf(" ");

      // el ancho del texto
      tempTextWidth = (this.ctx.measureText(tempText)).width;
      
      if (tempTextWidth >= widthLimit) {
        if (lastIndexOfWhite != -1) {
          tempIndex = lastIndexOfWhite;
          tempText = restText.slice(0, tempIndex);
        }
        else {
          tempIndex = tempIndex-1;
          tempText = restText.slice(0, tempIndex);
        }
      }
      
      else {
        if ((inTheWord) && (lastIndexOfWhite != -1)) {
          tempIndex = lastIndexOfWhite;
          tempText = restText.slice(0, tempIndex);          
        }
      }
      
      resultText.push(tempText);
      
      restText = restText.slice(tempIndex);
    }
    while (restText != "");

    return resultText;
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una imagen de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el imagen
   */
  descartesJS.Image = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);
    
    this.img = new Image();
    // this.img.ready = 0;
    // this.img.onload = function() {
    //   this.ready = 1;
      
    //   this.onload = function() {};
    // }
    // this.img.src = this.evaluator.evalExpression(this.file);

    this.scaleX = 1;
    this.scaleY = 1;

    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Image, descartesJS.Graphic);

  /**
   * Actualiza los valores de la imagen
   */
  descartesJS.Image.prototype.update = function() {
    var evaluator = this.evaluator;

    var expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0]; //el primer valor de la primera expresion
    this.exprY = expr[0][1]; //el segundo valor de la primera expresion

    // se rotan los elementos en caso de ser un macro con rotacion
    if (this.rotateExp) {
      var radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      var cosTheta = Math.cos(radianAngle);
      var senTheta = Math.sin(radianAngle);
      var tmpRotX;
      var tmpRotY;
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }
    
    if (expr[0].length == 4) {
      this.centered = true;
      this.scaleX = expr[0][2];
      if (this.scaleX == 0) {
        this.scaleX = .00001;
      }
      this.scaleY = expr[0][3];
      if (this.scaleY == 0) {
        this.scaleY = .00001;
      }
    }      
      
    if ((expr[1]) && (expr[1].length == 2)) {
      this.centered = true;
      this.scaleX = expr[1][0];
      if (this.scaleX == 0) {
        this.scaleX = .00001;
      }
      this.scaleY = expr[1][1];      
      if (this.scaleY == 0) {
        this.scaleY = .00001;
      }
    }
    
    var imgFile = evaluator.evalExpression(this.file);

    if ((imgFile) || (imgFile == "")) {
      this.img = this.parent.getImage(imgFile);
    }
  }
  
  /**
   * Dibuja la imagen
   */
  descartesJS.Image.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this);
  }

  /**
   * Dibuja el rastro de la imagen
   */
  descartesJS.Image.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this);
  }
  
  /**
   * Funcion auxiliar para dibujar una imagen
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja una imagen
   * @param {String} fill el color de relleno de una imagen
   * @param {String} stroke el color del trazo de una imagen
   */
  descartesJS.Image.prototype.drawAux = function(ctx, fill, stroke) {
    var evaluator = this.evaluator;

    if ( (this.img) && (this.img.ready) && (this.img.complete) ) {
      var despX = (this.centered) ? 0 : this.img.width/2;
      var despY = (this.centered) ? 0 : this.img.height/2;
      var coordX = (this.abs_coord) ? this.exprX : this.space.getAbsoluteX(this.exprX);
      var coordY = (this.abs_coord) ? this.exprY : this.space.getAbsoluteY(this.exprY);
      var rotation = descartesJS.degToRad(-evaluator.evalExpression(this.inirot));

      ctx.translate(coordX+despX, coordY+despY);
      ctx.rotate(rotation);
      ctx.scale(this.scaleX, this.scaleY);

      if (this.opacity) {
        ctx.globalAlpha = evaluator.evalExpression(this.opacity);
      }

      ctx.drawImage(this.img, -this.img.width/2, -this.img.height/2);
      
      // try {
      //   ctx.drawImage(this.img, -this.img.width/2, -this.img.height/2);
      // }
      // catch(e) {
      // }

      // se resetean las trasnformaciones
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalAlpha = 1;
    }
  }
  
  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un relleno de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el relleno
   */
  descartesJS.Fill = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    // this.pixelStack = [];
    // this.startColor;
    // console.log(this.expresion, this.ctx, "|", this.space.w, this.space.h)
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Fill, descartesJS.Graphic);

  /**
   * Actualiza el relleno
   */
  descartesJS.Fill.prototype.update = function() {
    // var evaluator = this.evaluator;

    // var expr = evaluator.evalExpression(this.expresion);
    // this.exprX = expr[0][0]; //el primer valor de la primera expresion
    // this.exprY = expr[0][1]; //el segundo valor de la primera expresion

    // this.exprX = parseInt( this.space.getAbsoluteX(this.exprX+.1) );
    // this.exprY = parseInt( this.space.getAbsoluteY(this.exprY+.1) );

    // this.imageData = this.ctx.getImageData(0, 0, this.space.w, this.space.h);

    // var pixelPos = (this.exprY*this.space.w + this.exprX) * 4;
    // this.startColor = { r: this.imageData.data[pixelPos],
    //                     g: this.imageData.data[pixelPos+1],
    //                     b: this.imageData.data[pixelPos+2],
    //                     a: this.imageData.data[pixelPos+3]
    //                   }

    // this.pixelStack.push( [this.exprX, this.exprY] );
    // // console.log(this.startColor, pixelPos, this.exprX, this.exprY, this.imageData)
  }

  /**
   * Dibuja el relleno
   */
  descartesJS.Fill.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.color, this.color);
  }

  /**
   * Dibuja el rastro del relleno
   */
  descartesJS.Fill.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar un relleno
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el relleno
   * @param {String} fill el color de relleno del relleno
   */
  descartesJS.Fill.prototype.drawAux = function(ctx, fill) {
    // var evaluator = this.evaluator;
    // var fillColor = getColorComponents(descartesJS.getColor(evaluator, fill));
    // var newPos;
    // var x;
    // var y;

    // while (this.pixelStack.length) {
    //   newPos = this.pixelStack.pop();
    //   x = newPos[0];
    //   y = newPos[1];
    // }
  }

  function getColorComponents(color) {
    // var tmp;
    // var resultColor = { r: 0, g: 0, b: 0, a: 0 };

    // if (color.match(/^rgba/)) {
    //   tmp = color.substring(5, color.length-1).split(",");
    //   resultColor.r = tmp[0];
    //   resultColor.g = tmp[1];
    //   resultColor.b = tmp[2];
    //   resultColor.a = tmp[3];

    //   return resultColor;
    // }
    // else if (color.match(/^#/)) {
    //   tmp = color.substring(1);
    //   resultColor.r = parseInt(tmp.substring(0,2), 16);
    //   resultColor.g = parseInt(tmp.substring(2,4), 16);
    //   resultColor.b = parseInt(tmp.substring(4,6), 16);

    //   return resultColor;
    // }
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un macro de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el macro
   */
  descartesJS.Macro = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    this.graphics = [];
    
    var lessonParser = parent.lessonParser;
    var tokenizer = new descartesJS.Tokenizer();

    // se recorre values para reemplazar los valores iniciales del control
    for (var propName in values) {
      // solo se verifican las propiedades propias del objeto values
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }
    
    // si la expresion se dejo en blanco
    if (this.expresion == undefined) {
      return;
    }
    
    // si el nombre del macro no fue especificado como una cadena, entonces se le agrega las comillas sencillas para convertilo en cadena
    if ( !(this.expresion.match("'")) ) {
      this.expresion = "'" + this.expresion + "'";
    }

    this.expresion = this.evaluator.parser.parse(this.expresion);

    // se obtiene el espacio al que pertenece el grafico
    
    var filename = this.expresion.value; //this.evaluator.evalExpression(this.expresion)
    var response;
      
    // si se lee el macro de un archivo externo se deben omitir solo 2 valores
    var sliceValue = 2; 
    
    if (filename) {
      // si el macro esta embedido en la pagina
      var macroElement = document.getElementById(filename);
      if ((macroElement) && (macroElement.type == "descartes/macro")) {
        response = macroElement.text;
        // si se lee del propio documento se deben omitir 3 valores
        sliceValue = 3;
      }
      
      // si el macro se lee de un archivo
      else {
        response = descartesJS.openExternalFile(filename);
        
        // se verifica que el contenido del archivo sea el de un macro de descartes
        if (!response.match("tipo_de_macro")) {
          response = null;
        }
      }
    }

    var idsMacro = "|";
    // si se pudo leer el archivo del macro
    if (response) {
      response = ( response.replace(/&aacute;/g, "á").replace(/&eacute;/g, "é").replace(/&iacute;/g, "í").replace(/&oacute;/g, "ó").replace(/&uacute;/g, "ú").replace(/&Aacute;/g, "Á").replace(/&Eacute;/g, "É").replace(/&Iacute;/g, "Í").replace(/&Oacute;/g, "Ó").replace(/&Uacute;/g, "Ú").replace(/&ntilde;/g, "ñ").replace(/&Ntilde;/g, "Ñ").replace(/\&gt;/g, ">").replace(/\&lt;/g, "<").replace(/\&amp;/g, "&") ).split("\n").slice(sliceValue);

      var respTemp;
      var tempIndexParenthesis;
      
      // se dividen las lineas en pseudotokens
      for (var i=0, l=response.length; i<l; i++) {
        if (response[i]) {
          response[i] = lessonParser.split(response[i]);
          // console.log(response);
          
          if ( (response[i]) && (response[i][0]) && (response[i][0][0]) && (response[i][0][0] == "id") ) {
            respTemp = response[i][0][1];
            tempIndexParenthesis = respTemp.indexOf("(");
            
            if (tempIndexParenthesis != -1) {
              respTemp = respTemp.substring(0,tempIndexParenthesis)
            }

            idsMacro += respTemp + "|";
          }
        }
      }
      
      var respText;
      var babelResp;
      var dotIndex;
      var tmpTokens;
      var tmpTokensRespText;
      
      // se agrega el nombre del macro como prefijo, solo en algunas expresiones
      for (var i=0, l=response.length; i<l; i++) {
        respText = response[i] || [];
       
        for (var j=0, k=respText.length; j<k; j++) {
          babelResp = babel[respText[j][0]];

          // sirve para los parametros que traen un punto
          dotIndex = respText[j][0].indexOf(".");
          if (dotIndex != -1) {
            babelResp = babel[respText[j][0].substring(dotIndex+1)];
          }
          
          // si las expresiones son diferentes a las siguientes, entonces se sigue con el ciclo y no se sustituye nada
          if ( (babelResp != "id") && 
            (babelResp != "text") && 
            (babelResp != "expresion") && 
            (babelResp != "interval") && 
            (babelResp != "steps") && 
            (babelResp != "drawif") && 
            (babelResp != "size") && 
            (babelResp != "width") && 
            (babelResp != "center") && 
            (babelResp != "radius") && 
            (babelResp != "init") && 
            (babelResp != "end") &&
            (babelResp != "inirot") && 
            (babelResp != "do") &&
            (babelResp != "while") &&
            (babelResp != "file") &&
            (babelResp != "fill") &&
            (babelResp != "color") ) {
//                       console.log("nop - ", respText[j][0]);
            continue;
          }
          
          // es un texto
          if (babelResp == "text") {
            // si el texto es rtf hay que procesarlo de otra manera
            if (respText[j][1].match(/\{\\rtf1/)) {
              var textTemp = respText[j][1];
 
              //////////////////////////////////////////////////////////////////////////////////////////////////////////////
              var self = this;
              // funcion para reemplazar las expresiones
              var funReplace = function(str, m1) {
                var tokens = tokenizer.tokenize(m1.replace(/\&squot;/g, "'"));
                
                for (var t=0, lt=tokens.length; t<lt; t++) {
                  if ( (tokens[t].type == "identifier") && (idsMacro.match("\\|" + tokens[t].value + "\\|")) ) {
                    tokens[t].value = self.name + "." + tokens[t].value;
                  }

                  // si el identificador tiene un punto, por ejemplo vector.long
                  else if ((tokens[t].type == "identifier") && ((dotIndex = (tokens[t].value).indexOf(".")) != -1)) {
                    if (idsMacro.match("\\|" + tokens[t].value.substring(0, dotIndex) + "\\|")) {
                      tokens[t].value = self.name + "." + tokens[t].value;
                    }
                  }
                }
                
                var prefix = (str.match(/^\\expr/)) ? "\\expr " : "\\decimals ";

                return prefix + tokenizer.flatTokens(tokens);
              }
              //////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
              textTemp = textTemp.replace(/\\expr ([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.']*)/gi, funReplace);
              textTemp = textTemp.replace(/\\decimals ([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.']*)/gi, funReplace);
              
              respText[j][1] = textTemp;
            }
            // texto simple
            else {
              tmpTokensRespText = lessonParser.parseText(respText[j][1]).textElementsMacros;

              for (var ttrt=0, lttrt=tmpTokensRespText.length; ttrt<lttrt; ttrt++) {
                tmpTokens = tokenizer.tokenize(tmpTokensRespText[ttrt].replace(/\&squot;/g, "'"));

                for (var tt=0, ltt=tmpTokens.length; tt<ltt; tt++) {
                  if ( (tmpTokens[tt].type == "identifier") && (idsMacro.match("\\|" + tmpTokens[tt].value + "\\|")) ) {
                    tmpTokens[tt].value = this.name + "." + tmpTokens[tt].value;
                  }
                }
                tmpTokens = (tokenizer.flatTokens(tmpTokens)).replace(/&squot;/g, "'").replace(/'\+\(/g, "[").replace(/\)\+'/g, "]");
                tmpTokensRespText[ttrt] = tmpTokens.substring(1, tmpTokens.length-1);
              }

              respText[j][1] = tmpTokensRespText.join("");
            }
          }
          
          else {
            tmpTokens = tokenizer.tokenize(respText[j][1].replace(/\&squot;/g, "'"));
            
            for (var t=0, lt=tmpTokens.length; t<lt; t++) {
              if ( (tmpTokens[t].type == "identifier") && (idsMacro.match("\\|" + tmpTokens[t].value + "\\|")) ) {
                tmpTokens[t].value = this.name + "." + tmpTokens[t].value;
              }
              
              // si el identificador tiene un punto, por ejemplo vector.long
              else if ((tmpTokens[t].type == "identifier") && ((dotIndex = (tmpTokens[t].value).indexOf(".")) != -1)) {
                if (idsMacro.match("\\|" + tmpTokens[t].value.substring(0, dotIndex) + "\\|")) {
                  tmpTokens[t].value = this.name + "." + tmpTokens[t].value;
                }
              }
            }
            respText[j][1] = tokenizer.flatTokens(tmpTokens);
          }
        
        }
      }

      var tempResp;
      
      // se aplanan las expresiones, para despues poder contruir los elementos
      for (var i=0, l=response.length; i<l; i++) {
        if (response[i][0]) {
          tempResp = "";
          for (var j=0, k=response[i].length; j<k; j++) {
            // si no es un objeto grafico
            if (babel[response[i][j][0]] != "type") {
              response[i][j] = response[i][j][0] + "='" + response[i][j][1] + "' ";
            }
            // si es un objeto grafico hay que agregarle el espacio al que pertenece
            else {
              response[i][j] = "espacio='" + this.spaceID + "' " + response[i][j][0] + "='" + response[i][j][1] + "' ";
            }
            tempResp = tempResp + response[i][j];
          }
          
          response[i] = tempResp;
          
          // se construyen y se agregan los elementos
          if (tempResp.match(/^espacio/)) {
            this.graphics.push( lessonParser.parseGraphic(response[i], this.abs_coord, this.background, this.inirot) );
          } 
          else {
            lessonParser.parseAuxiliar(response[i]);
          }
        }
      }
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Macro, descartesJS.Graphic);
    
  /**
   * Actualiza el macro
   */
  descartesJS.Macro.prototype.update = function() {
    if (this.inipos) {
      var expr = this.evaluator.evalExpression(this.inipos);
      this.iniPosX = expr[0][0];
      this.iniPosY = expr[0][1];
    }
  }
  
  /**
   * Funcion auxiliar para dibujar un macro
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el macro
   */
  descartesJS.Macro.prototype.drawAux = function(ctx) {
    for (var i=0, l=this.graphics.length; i<l; i++) {
//       ctx.save();

      if (this.inipos) {
        if (this.graphics[i].abs_coord) {
          ctx.translate(this.iniPosX, this.iniPosY);
        } else {
          ctx.translate(this.iniPosX*this.space.scale, -this.iniPosY*this.space.scale);
        }
      }
      
      this.graphics[i].draw();

      // se resetean las trasnformaciones
      ctx.setTransform(1, 0, 0, 1, 0, 0);

//       ctx.restore();
    }      
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un espacio de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la aplicacion de descartes
   */
  descartesJS.RenderMath = {};

  /**
   * Regresa la inversa de la raiz cuadrada
   */
  descartesJS.RenderMath.inverseSqrt = function(n) {
    return 1.0 / Math.sqrt(number);
  }
  
  /**
   * Vector bidimensional
   */
  descartesJS.Vector2D = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
  
  descartesJS.Vector2D.prototype.clone = function() {
    return new descartesJS.Vector2D(this.x,
                                    this.y
                                   );
  }
  
  descartesJS.Vector2D.prototype.add = function(v) {
    return new descartesJS.Vector2D(this.x + v.x,
                                    this.y + v.y
                                   );
  }

  descartesJS.Vector2D.prototype.substract = function(v) {
    return new descartesJS.Vector2D(this.x - v.x,
                                    this.y - v.y
                                   );
  }
  
  descartesJS.Vector2D.prototype.multiply = function(v) {
    return new descartesJS.Vector2D(this.x * v.x,
                                    this.y * v.y
                                   );
  }

  descartesJS.Vector2D.prototype.divide = function(v) {
    return new descartesJS.Vector2D(this.x / v.x,
                                    this.y / v.y
                                   );
  }
  
  descartesJS.Vector2D.prototype.scale = function(s) {
    return new descartesJS.Vector2D(this.x * s,
                                    this.y * s
                                   );
  }
  
  descartesJS.Vector2D.prototype.dist = function (v) {
    var x = v.x - this.x;
    var y = v.y - this.y;
    return Math.sqrt(x*x + y*y);
  }
  
  descartesJS.Vector2D.prototype.negate = function () {
    return new descartesJS.Vector2D(-this.x,
                                    -this.y
                                   );
  }
  
  descartesJS.Vector2D.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
    
  descartesJS.Vector2D.prototype.squaredLength = function () {
    return this.x * this.x + this.y * this.y;
  }

  descartesJS.Vector2D.prototype.normalize = function () {
    var len = this.squaredLength();
    
    if (len > 0) {
      len = Math.sqrt(len);
      return new descartesJS.Vector2D(this.x / len,
                                      this.y / len
                                     );
    }
    else {
      return new descartesJS.Vector2D(0,
                                      0
                                     );
    }
  }
  
  descartesJS.Vector2D.prototype.crossProduct = function (v) {
//     return new descartesJS.Vector2D(0,
//                                     0,
//                                     this.x * v.y - this.y * v.x
//                                    );
    return this.x * v.y - this.y * v.x;
  }
  
  descartesJS.Vector2D.prototype.dot = function (v) {
    return this.x * v.x + this.y * v.y;
  }
  
  descartesJS.Vector2D.prototype.direction = function (v) {
    var x = this.x - v.x;
    var y = this.y - v.y;
    var len = x * x + y * y;

    if (!len) {
      return new descartesJS.Vector2D(0, 0);
    }
    
    len = 1 / Math.sqrt(len);
    
    return new descartesJS.Vector2D(x * len,
                                    y * len
                                   );
  }
  
  descartesJS.Vector2D.prototype.lerp = function(v, lerp) {
    return new descartesJS.Vector2D(this.x + lerp * (v.x - this.x),
                                    this.y + lerp * (v.y - this.y)
                                   );
  }
  
  /**
   * Vector tridimensional
   */
  descartesJS.Vector3D = function(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  descartesJS.Vector3D.prototype.set = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    return this;
  }

  descartesJS.Vector3D.prototype.toVector4D = function() {
    return new descartesJS.Vector4D(this.x, this.y, this.z, 1);
  }
  
  descartesJS.Vector3D.prototype.copy = function() {
    return new descartesJS.Vector3D(this.x, 
                                    this.y, 
                                    this.z);
  }
  
  descartesJS.Vector3D.prototype.add = function(v) {
    return new descartesJS.Vector3D(this.x + v.x,
                                    this.y + v.y,
                                    this.z + v.z);
  }
  
  descartesJS.Vector3D.prototype.substract = function(v) {
    return new descartesJS.Vector3D(this.x - v.x,
                                    this.y - v.y,
                                    this.z - v.z);
  }
  
  descartesJS.Vector3D.prototype.multiply = function(v) {
    return new descartesJS.Vector3D(this.x * v.x, 
                                    this.y * v.y, 
                                    this.z * v.z);
  }
  
  descartesJS.Vector3D.prototype.negate = function() {
    return new descartesJS.Vector3D(-this.x,
                                    -this.y,
                                    -this.z);
  }
  
  descartesJS.Vector3D.prototype.scale = function(s) {
    return new descartesJS.Vector3D(this.x * s, 
                                    this.y * s, 
                                    this.z * s);
  }
  
  descartesJS.Vector3D.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  
  descartesJS.Vector3D.prototype.squaredLength = function() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  
  descartesJS.Vector3D.prototype.normalize = function() {
    var len = this.length();
    
    // la norma del vector es cero
    if (len == 0) {
      return new descartesJS.Vector3D(0, 0, 0);
    }
    // la norma es uno, ya estaba normalizado
    else if (len == 1) {
      return new descartesJS.Vector3D(this.x, 
                                      this.y, 
                                      this.z);
    }
    
    len = 1.0 / len;

    return new descartesJS.Vector3D(this.x * len, 
                                    this.y * len, 
                                    this.z * len);
  }
  
  descartesJS.Vector3D.prototype.crossProduct = function(v) {
    return new descartesJS.Vector3D(this.y * v.z - this.z * v.y, 
                                    this.z * v.x - this.x * v.z,
                                    this.x * v.y - this.y * v.x);
  }
  
  descartesJS.Vector3D.prototype.dotProduct = function(v) {
    return new descartesJS.Vector3D(this.x * v.x + this.y * v.y + this.z * v.z);

  }
  
  //genera un vector unitario que apunta de un vector a hacia otro
  descartesJS.Vector3D.prototype.direction = function(v) {
    var x = this.x - v.x;
    var y = this.y - v.y;
    var z = this.z - v.z;
    var len = Math.sqrt(x * x + y * y + z * z);

    // la norma del vector es cero
    if (len == 0) {
      return new descartesJS.Vector3D(0, 0, 0);
    }

    len = 1.0 / len;

    return new descartesJS.Vector3D(x * len, 
                                    y * len, 
                                    z * len);
  }
  
  // linear interpolation
  descartesJS.Vector3D.prototype.lerp = function(v, interpolant) {
    return new descartesJS.Vector3D(this.x + interpolant*(v.x - this.x), 
                                    this.y + interpolant*(v.y - this.y),
                                    this.z + interpolant*(v.z - this.z));
  }

  // distancia entre dos vectores
  descartesJS.Vector3D.prototype.distance = function(v) {
    var x = v.x - this.x;
    var y = v.y - this.y;
    var z = v.z - this.z;

    return Math.sqrt(x*x + y*y + z*z);
  }
  
  // proyecta el vector del espacio de la pantalla al espacio del objeto
  // viewport [x, y, width, height]
  descartesJS.Vector3D.prototype.unproject = function(view, proj, viewport) {
    var v = new descartesJS.Vector4D( (this.x - viewport.x) * 2.0 / viewport.width - 1.0, 
                                      (this.y - viewport.y) * 2.0 / viewport.height - 1.0, 
                                      2.0 * this.z - 1.0,
                                      v[3] = 1.0 
                                    );

    var m = proj.multiply(view);
    if (!m.inverse()) {
      return null;
    }
    
    v = m.multiplyVector4(v);
    if (v.w == 0.0) {
      return null;
    }
    
    return new descartesJS.Vector3D(v.x / v.w,
                                    v.y / v.w,
                                    v.z / v.w);
  }
  
  // regresa un quaternion entre dos vectores
  descartesJS.Vector3D.prototype.rotationTo = function(v) {
    var xUnitVec3 = new descartesJS.Vector3D(1, 0, 0);
    var yUnitVec3 = new descartesJS.Vector3D(0, 1, 0);
    var zUnitVec3 = new descartesJS.Vector3D(0, 0, 1);
    
    var d = this.dotProduct(v);
//     var axis = new descartesJS.Vector3D();
    var quaternion = new descartesJS.Quaternion();
    
    if (d >= 1.0) {
      quaternion.setIdentity();
    }
    else if (d < (0.000001 - 1.0)) {
      axis = xUnitVec3.crossProduct(this);
      if (axis.length() < 0.000001) {
        axis = yUnitVec3.crossProduct(this);
      }
      if (axis.length() < 0.000001) {
        axis =  zUnitVec3.crossProduct(this);
      }
      axis = axis.normalize();
      
      quaternion = Quaternion.fromAngleAxis(Math.PI, axis);
    }
    
    else {
      var s = Math.squrt((1.0 + d) * 2.0);
      var sInv = 1.0 / s;
      axis = this.crossProduct(v);
      quaternion.x = axis.x * sInv;
      quaternion.y = axis.y * sInv;
      quaternion.z = axis.z * sInv;
      quaternion.w = s * 0.5;
      quaternion = Quaternion.normalize();
    }
    
    if (quaternion.w > 1.0) {
      quaternion.w = 1.0;
    }
    else if (quaternion.w < -1.0) {
      quaternion.w = -1.0;
    }
    
    return quaternion;
  }
  
  descartesJS.Vector4D = function(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 0;
  }

  descartesJS.Vector4D.prototype.set = function(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  descartesJS.Vector4D.prototype.toVector3D = function() {
    var w = (this.w !== 0) ? 1/this.w : 0;
    return new descartesJS.Vector3D(this.x*w, this.y*w, this.z*w);
  }
  
  
  descartesJS.Vector4D.prototype.clone = function() {
    return new descartesJS.Vector4D(this.x, this.y, this.z, this.w);
  }
  
  descartesJS.Vector4D.prototype.add = function(v) {
    return new descartesJS.Vector4D(this.x + v.x,
                                    this.y + v.y,
                                    this.z + v.z,
                                    this.w + v.w
                                   );
  }
  
  descartesJS.Vector4D.prototype.substract = function(v) {
    return new descartesJS.Vector4D(this.x - v.x,
                                    this.y - v.y,
                                    this.z - v.z,
                                    this.w - v.w
                                   );
  }
  
  descartesJS.Vector4D.prototype.multiply = function(v) {
    return new descartesJS.Vector4D(this.x * v.x,
                                    this.y * v.y,
                                    this.z * v.z,
                                    this.w * v.w
                                   );
  }
  
  descartesJS.Vector4D.prototype.divide = function(v) {
    return new descartesJS.Vector4D(this.x / v.x,
                                    this.y / v.y,
                                    this.z / v.z,
                                    this.w / v.w
                                   );
  }
  
  descartesJS.Vector4D.prototype.scale = function(s) {
    return new descartesJS.Vector4D(this.x * s,
                                    this.y * s,
                                    this.z * s,
                                    this.w * s
                                   );
  }
  
  descartesJS.Vector4D.prototype.negate = function() {
    return new descartesJS.Vector4D(-this.x,
                                    -this.y,
                                    -this.z,
                                    -this.w
                                   );
  }
  
  descartesJS.Vector4D.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  
  descartesJS.Vector4D.prototype.squaredLength = function () {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  
  descartesJS.Vector4D.prototype.lerp = function (v, lerp) {
    return new descartesJS.Vector4D(this.x + lerp * (v.x - this.x),
                                    this.y + lerp * (v.y - this.y),
                                    this.z + lerp * (v.z - this.z),
                                    this.w + lerp * (v.w - this.w)
                                   );
  }
  
  descartesJS.Matrix2x2 = function( a00, a01, 
                                    a10, a11
                                  ) {
    this.a00 = a00 || 0;
    this.a01 = a01 || 0;
    this.a10 = a10 || 0;
    this.a11 = a11 || 0;
  }
  
  descartesJS.Matrix2x2.prototype.clone = function() {
    return new descartesJS.Matrix2x2(this.a00, this.a01,
                                     this.a10, this.a11
                                    );
  }

  descartesJS.Matrix2x2.prototype.setIdentity = function() {
    this.a00 = 1;
    this.a01 = 0;
    this.a10 = 0;
    this.a11 = 1;

    return this;
  }

  descartesJS.Matrix2x2.prototype.transpose = function() {
    return new descartesJS.Matrix2x2(this.a00, this.a10,
                                     this.a01, this.a11
                                    );
  }
  
  descartesJS.Matrix2x2.prototype.determinant = function() {
    return this.a00 * this.a11 - this.a10 * this.a01;
  }

  descartesJS.Matrix2x2.prototype.inverse = function() {
    var det = this.determinant();
    
    if (!det) {
      return null;
    }
    
    det = 1 / det;
    
    return new descartesJS.Matrix2x2( this.a11 * det, -this.a10 * det,
                                     -this.a01 * det,  this.a00 * det
                                    );
  }
  
  descartesJS.Matrix2x2.prototype.multiply = function(m) {
    return new descartesJS.Matrix2x2(this.a00 * m.a00 + this.a01 * m.a10,
                                     this.a00 * m.a01 + this.a01 * m.a11,
                                     this.a10 * m.a00 + this.a11 * m.a10,
                                     this.a10 * m.a01 + this.a11 * m.a11
                                    );
  }
  
  descartesJS.Matrix2x2.prototype.rotate = function(angle) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    
    return new descartesJS.Matrix2x2(this.a00 *  c + this.a01 * s,
                                     this.a00 * -s + this.a01 * c,
                                     this.a10 *  c + this.a11 * s,
                                     this.a10 * -s + this.a11 * c
                                    );
  }
    
  descartesJS.Matrix2x2.prototype.multiplyVector2 = function(v) {
    return new descartesJS.Vector2D(v.x * this.a00 + v.y * this.a01,
                                    v.x * this.a10 + v.y * this.a11
                                   );
  }
  
  descartesJS.Matrix2x2.prototype.scale = function(v) {
    return new descartesJS.Matrix2x2(this.a00 * v.x, this.a01 * v.y,
                                     this.a10 * v.x, this.a11 * v.y
                                    );
  }    

  descartesJS.Matrix3x3 = function( a00, a01, a02, 
                                    a10, a11, a12,
                                    a20, a21, a22
                                   ) {
    this.a00 = a00 || 0;
    this.a01 = a01 || 0;
    this.a02 = a02 || 0;
    this.a10 = a10 || 0;
    this.a11 = a11 || 0;
    this.a12 = a12 || 0;
    this.a20 = a20 || 0;
    this.a21 = a21 || 0;
    this.a22 = a22 || 0;
  }
  
  descartesJS.Matrix3x3.prototype.copy = function() {
    return new descartesJS.Matrix3x3(this.a00, this.a01, this.a02, 
                                     this.a10, this.a11, this.a12, 
                                     this.a20, this.a21, this.a22
                                    ); 
  }

  descartesJS.Matrix3x3.prototype.determinant = function() {
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    
    return a00 * ( a22 * a11 - a12 * a21) + 
           a01 * (-a22 * a10 + a12 * a20) + 
           a02 * ( a21 * a10 - a11 * a20);
  }

  descartesJS.Matrix3x3.prototype.inverse = function() {
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;

    var b01 =  a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 =  a21 * a10 - a11 * a20;
    
    var d = a00 * b01 + a01 * b11 + a02 * b21;
    
    if (!d) { 
      return null; 
    }

    var invD = 1 / d;
    
    return new descartesJS.Matrix3x3( b01 * invD,  (-a22 * a01 + a02 * a21) * invD,  ( a12 * a01 - a02 * a11) * invD,
                                      b11 * invD,  ( a22 * a00 - a02 * a20) * invD,  (-a12 * a00 + a02 * a10) * invD,
                                      b21 * invD,  (-a21 * a00 + a01 * a20) * invD,  ( a11 * a00 - a01 * a10) * invD
                                    );
  }
  
  descartesJS.Matrix3x3.prototype.multply = function(m) {
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    
    var b00 = m.a00;
    var b01 = m.a01;
    var b02 = m.a02;
    var b10 = m.a10;
    var b11 = m.a11;
    var b12 = m.a12;
    var b20 = m.a20;
    var b21 = m.a21;
    var b22 = m.a22;
    
    return new descartesJS.Matrix3x3( b00 * a00 + b01 * a10 + b02 * a20, b00 * a01 + b01 * a11 + b02 * a21, b00 * a02 + b01 * a12 + b02 * a22,
                                      b10 * a00 + b11 * a10 + b12 * a20, b10 * a01 + b11 * a11 + b12 * a21, b10 * a02 + b11 * a12 + b12 * a22,
                                      b20 * a00 + b21 * a10 + b22 * a20, b20 * a01 + b21 * a11 + b22 * a21, b20 * a02 + b21 * a12 + b22 * a22
                                    );
  }
  
  descartesJS.Matrix3x3.prototype.multiplyVector2 = function(v) {
    return new descartesJS.Vector2D(v.x * this.a00 + v.y * this.a10 + this.a20,
                                    v.x * this.a01 + v.y * this.a11 + this.a21);
  }
  
  descartesJS.Matrix3x3.prototype.multiplyVector3 = function(v) {
    return new descartesJS.Vector3D(v.x * this.a00 + v.y * this.a10 + v.z * this.a20,
                                    v.x * this.a01 + v.y * this.a11 + v.z * this.a21,
                                    v.x * this.a02 + v.y * this.a12 + v.z * this.a22
                                   );
  }
  
  descartesJS.Matrix3x3.prototype.setIdentity = function() {
    this.a00 = 1;
    this.a01 = 0;
    this.a02 = 0;
    
    this.a10 = 0;
    this.a11 = 1;
    this.a12 = 0;
    
    this.a20 = 0;
    this.a21 = 0;
    this.a22 = 1;
    
    return this;
  }
  
  descartesJS.Matrix3x3.prototype.transpose = function() {
    return new descartesJS.Matrix3x3(this.a00, this.a10, this.a20,
                                     this.a01, this.a11, this.a21,
                                     this.a02, this.a12, this.a22
                                    );
  }

  descartesJS.Matrix3x3.prototype.toMatrix4x4 = function() {
    return new descartesJS.Matrix4x4(this.a00, this.a01, this.a02, 0,
                                     this.a10, this.a11, this.a12, 0,
                                     this.a20, this.a21, this.a22, 0,
                                     0,        0,        0,        1
                                     );
  }
  
  descartesJS.Matrix4x4 = function( a00, a01, a02, a03,
                                    a10, a11, a12, a13,
                                    a20, a21, a22, a23,
                                    a30, a31, a32, a33
                                   ) {
    this.a00 = a00 || 0;
    this.a01 = a01 || 0;
    this.a02 = a02 || 0;
    this.a03 = a03 || 0;
    this.a10 = a10 || 0;
    this.a11 = a11 || 0;
    this.a12 = a12 || 0;
    this.a13 = a13 || 0;
    this.a20 = a20 || 0;
    this.a21 = a21 || 0;
    this.a22 = a22 || 0;
    this.a23 = a23 || 0;
    this.a30 = a30 || 0;
    this.a31 = a31 || 0;
    this.a32 = a32 || 0;
    this.a33 = a33 || 0;
  }
  
  descartesJS.Matrix4x4.prototype.copy = function() {
    return new descartesJS.Matrix4x4(this.a00, this.a01, this.a02, this.a03,
                                     this.a10, this.a11, this.a12, this.a13,
                                     this.a20, this.a21, this.a22, this.a23,
                                     this.a30, this.a31, this.a32, this.a33
                                    ); 
  }

  descartesJS.Matrix4x4.prototype.setIdentity = function() {
    this.a00 = 1;
    this.a01 = 0;
    this.a02 = 0;
    this.a03 = 0;
    
    this.a10 = 0;
    this.a11 = 1;
    this.a12 = 0;
    this.a13 = 0;
    
    this.a20 = 0;
    this.a21 = 0;
    this.a22 = 1;
    this.a23 = 0;

    this.a30 = 0;
    this.a31 = 0;
    this.a32 = 0;
    this.a33 = 1;
    
    return this;
  }
    
  descartesJS.Matrix4x4.prototype.transpose = function() {
    return new descartesJS.Matrix3x3(this.a00, this.a10, this.a20, this.a30,
                                     this.a01, this.a11, this.a21, this.a31,
                                     this.a02, this.a12, this.a22, this.a32,
                                     this.a03, this.a13, this.a23, this.a33
                                    );
  }

  descartesJS.Matrix4x4.prototype.determinant = function() {
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a03 = this.a03;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a13 = this.a13;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    var a23 = this.a23;
    var a30 = this.a30;
    var a31 = this.a31;
    var a32 = this.a32;
    var a33 = this.a33;
    
    return a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 +
           a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 +
           a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 +
           a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 +
           a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 +
           a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33;
  }

  descartesJS.Matrix4x4.prototype.inverse = function() {
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a03 = this.a03;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a13 = this.a13;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    var a23 = this.a23;
    var a30 = this.a30;
    var a31 = this.a31;
    var a32 = this.a32;
    var a33 = this.a33;

    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    
    var d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
    
    if (!d) { 
      return null; 
    }

    var invD = 1 / d;
    
    return new descartesJS.Matrix4x4((a11 * b11 - a12 * b10 + a13 * b09) * invD,  (-a01 * b11 + a02 * b10 - a03 * b09) * invD, (a31 * b05 - a32 * b04 + a33 * b03) * invD,  (-a21 * b05 + a22 * b04 - a23 * b03) * invD, 
                                     (-a10 * b11 + a12 * b08 - a13 * b07) * invD, (a00 * b11 - a02 * b08 + a03 * b07) * invD,  (-a30 * b05 + a32 * b02 - a33 * b01) * invD, (a20 * b05 - a22 * b02 + a23 * b01) * invD,
                                     (a10 * b10 - a11 * b08 + a13 * b06) * invD,  (-a00 * b10 + a01 * b08 - a03 * b06) * invD, (a30 * b04 - a31 * b02 + a33 * b00) * invD,  (-a20 * b04 + a21 * b02 - a23 * b00) * invD, 
                                     (-a10 * b09 + a11 * b07 - a12 * b06) * invD, (a00 * b09 - a01 * b07 + a02 * b06) * invD,  (-a30 * b03 + a31 * b01 - a32 * b00) * invD, (a20 * b03 - a21 * b01 + a22 * b00) * invD
                                    );
  }

  descartesJS.Matrix4x4.prototype.toRotationMat = function() {
    return new descartesJS.Matrix4x4(this.a00, this.a01, this.a02, this.a03,
                                     this.a10, this.a11, this.a12, this.a13,
                                     this.a20, this.a21, this.a22, this.a23,
                                     0,        0,        0,        1);
  }
  
  descartesJS.Matrix4x4.prototype.toMatrix3x3 = function() {
    return new descartesJS.Matrix4x4(this.a00, this.a01, this.a02,
                                     this.a10, this.a11, this.a12,
                                     this.a20, this.a21, this.a22)    
  }

  descartesJS.Matrix4x4.prototype.toInverseMat3 = function() {
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;

    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;

    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;

    var b01 = a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 = a21 * a10 - a11 * a20;

    var d = a00 * b01 + a01 * b11 + a02 * b21;

    if (!d) { 
      return null; 
    }
    
    var invD = 1 / d;

    return new descartesJS.Matrix3x3(b01 * id, (-a22 * a01 + a02 * a21) * id, ( a12 * a01 - a02 * a11) * id,
                                     b11 * id, ( a22 * a00 - a02 * a20) * id, (-a12 * a00 + a02 * a10) * id,
                                     b21 * id, (-a21 * a00 + a01 * a20) * id, ( a11 * a00 - a01 * a10) * id
                                    );
  }

  descartesJS.Matrix4x4.prototype.multiply = function(m) {
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a03 = this.a03;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a13 = this.a13;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    var a23 = this.a23;
    var a30 = this.a30;
    var a31 = this.a31;
    var a32 = this.a32;
    var a33 = this.a33;
    
    var b00 = m.a00;
    var b01 = m.a01;
    var b02 = m.a02;
    var b03 = m.a03;
    var b10 = m.a10;
    var b11 = m.a11;
    var b12 = m.a12;
    var b13 = m.a13;
    var b20 = m.a20;
    var b21 = m.a21;
    var b22 = m.a22;
    var b23 = m.a23;
    var b30 = m.a30;
    var b31 = m.a31;
    var b32 = m.a32;
    var b33 = m.a33;
    
    return new descartesJS.Matrix4x4(b00*a00 + b01*a10 + b02*a20 + b03*a30, b00*a01 + b01*a11 + b02*a21 + b03*a31, b00*a02 + b01*a12 + b02*a22 + b03*a32, b00*a03 + b01*a13 + b02*a23 + b03*a33,
                                     b10*a00 + b11*a10 + b12*a20 + b13*a30, b10*a01 + b11*a11 + b12*a21 + b13*a31, b10*a02 + b11*a12 + b12*a22 + b13*a32, b10*a03 + b11*a13 + b12*a23 + b13*a33,
                                     b20*a00 + b21*a10 + b22*a20 + b23*a30, b20*a01 + b21*a11 + b22*a21 + b23*a31, b20*a02 + b21*a12 + b22*a22 + b23*a32, b20*a03 + b21*a13 + b22*a23 + b23*a33,
                                     b30*a00 + b31*a10 + b32*a20 + b33*a30, b30*a01 + b31*a11 + b32*a21 + b33*a31, b30*a02 + b31*a12 + b32*a22 + b33*a32, b30*a03 + b31*a13 + b32*a23 + b33*a33
                                    );
  }
  
  descartesJS.Matrix4x4.prototype.multiplyVector3 = function(v) {
    return new descartesJS.Vector3D(v.x * this.a00 + v.y * this.a10 + v.z * this.a20 + this.a30,
                                    v.x * this.a01 + v.y * this.a11 + v.z * this.a21 + this.a31,
                                    v.x * this.a02 + v.y * this.a12 + v.z * this.a22 + this.a32
                                   );
  }
  
  descartesJS.Matrix4x4.prototype.multiplyVector4 = function(v) {
    return new descartesJS.Vector4D(v.x * this.a00 + v.y * this.a10 + v.z * this.a20 + v.w * this.a30,
                                    v.x * this.a01 + v.y * this.a11 + v.z * this.a21 + v.w * this.a31,
                                    v.x * this.a02 + v.y * this.a12 + v.z * this.a22 + v.w * this.a32,
                                    v.x * this.a03 + v.y * this.a13 + v.z * this.a23 + v.w * this.a33
                                   );
  }

  descartesJS.Matrix4x4.prototype.translate = function(v) {
    return new descartesJS.Matrix4x4(this.a00, this.a01, this.a02, this.a03,
                                     this.a10, this.a11, this.a12, this.a13,
                                     this.a20, this.a21, this.a22, this.a23,
                                     this.a00 * v.x + this.a10 * v.y + this.a20 * v.z + this.a30, this.a01 * v.x + this.a11 * v.y + this.a21 * v.z + this.a31, this.a02 * v.x + this.a12 * v.y + this.a22 * v.z + this.a32, this.a03 * v.x + this.a13 * v.y + this.a23 * v.z + this.a33
                                    );
  }
    
  descartesJS.Matrix4x4.prototype.scale = function(v) {
    return new descartesJS.Matrix4x4(this.a00 * v.x, this.a01 * v.x, this.a02 * v.x, this.a03 * v.x,
                                     this.a10 * v.y, this.a11 * v.y, this.a12 * v.y, this.a13 * v.y,
                                     this.a20 * v.z, this.a21 * v.z, this.a22 * v.z, this.a23 * v.z,
                                     this.a30, this.a31, this.a32, this.a33
                                    );
  }

  descartesJS.Matrix4x4.prototype.rotate = function(angle, axis) {
    var len = Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z);
    
    if (!len) {
      return null;
    }
    
    if (len !== 1) {
      len = 1 / len;
      axis.x *= len;
      axis.y *= len;
      axis.z *= len;
    }
    
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    var t = 1 - c;

    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a03 = this.a03;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a13 = this.a13;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    var a23 = this.a23;
    
    var b00 = axis.x * axis.x * t + c; 
    var b01 = axis.y * axis.x * t + axis.z * s;
    var b02 = axis.z * axis.x * t - axis.y * s;
    var b10 = axis.x * axis.y * t - axis.z * s;
    var b11 = axis.y * axis.y * t + c;
    var b12 = axis.z * axis.y * t + axis.x * s;
    var b20 = axis.x * axis.z * t + axis.y * s;
    var b21 = axis.y * axis.z * t - axis.x * s;
    var b22 = axis.z * axis.z * t + c;

    return new descartesJS.Matrix4x4(a00 * b00 + a10 * b01 + a20 * b02,  a01 * b00 + a11 * b01 + a21 * b02,  a02 * b00 + a12 * b01 + a22 * b02,  a03 * b00 + a13 * b01 + a23 * b02,
                                     a00 * b10 + a10 * b11 + a20 * b12,  a01 * b10 + a11 * b11 + a21 * b12,  a02 * b10 + a12 * b11 + a22 * b12,  a03 * b10 + a13 * b11 + a23 * b12,
                                     a00 * b20 + a10 * b21 + a20 * b22,  a01 * b20 + a11 * b21 + a21 * b22,  a02 * b20 + a12 * b21 + a22 * b22,  a03 * b20 + a13 * b21 + a23 * b22,
                                     this.a30, this.a31, this.a32, this.a33
                                    );
  }

  descartesJS.Matrix4x4.prototype.rotateX = function(angle) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a13 = this.a13;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    var a23 = this.a23;
    
    return new descartesJS.Matrix4x4(this.a00, this.a01, this.a02, this.a03,
                                     a10 *  c + a20 * s, a11 *  c + a21 * s, a12 *  c + a22 * s, a13 *  c + a23 * s,
                                     a10 * -s + a20 * c, a11 * -s + a21 * c, a12 * -s + a22 * c, a13 * -s + a23 * c,
                                     this.a30, this.a31, this.a32, this.a33
                                    );
  }
  
  descartesJS.Matrix4x4.prototype.rotateY = function(angle) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a03 = this.a03;
    var a20 = this.a20;
    var a21 = this.a21;
    var a22 = this.a22;
    var a23 = this.a23;
    
    return new descartesJS.Matrix4x4(a00 * c + a20 * -s, a01 * c + a21 * -s, a02 * c + a22 * -s, a03 * c + a23 * -s,
                                     this.a10, this.a11, this.a12, this.a13, 
                                     a00 * s + a20 * c, a01 * s + a21 * c, a02 * s + a22 * c, a03 * s + a23 * c,
                                     this.a30, this.a31, this.a32, this.a33
                                    );
  }

  descartesJS.Matrix4x4.prototype.rotateZ = function(angle) {  
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    
    var a00 = this.a00;
    var a01 = this.a01;
    var a02 = this.a02;
    var a03 = this.a03;
    var a10 = this.a10;
    var a11 = this.a11;
    var a12 = this.a12;
    var a13 = this.a13;
    
    return new descartesJS.Matrix4x4(a00 *  c + a10 * s, a01 *  c + a11 * s, a02 *  c + a12 * s, a03 *  c + a13 * s,
                                     a00 * -s + a10 * c, a01 * -s + a11 * c, a02 * -s + a12 * c, a03 * -s + a13 * c,
                                     this.a20, this.a21, this.a22, this.a23,
                                     this.a30, this.a31, this.a32, this.a33
                                    );
  }
  
  descartesJS.Matrix4x4.prototype.frustum = function (left, right, bottom, top, near, far) {
    var rl = (right - left);
    var tb = (top - bottom);
    var fn = (far - near);
    
    return new descartesJS.Matrix4x4((near * 2) / rl, 0, 0, 0,
                                     0, (near * 2) / tb, 0, 0,
                                     (right + left) / rl, (top + bottom) / tb, -(far + near) / fn, -1,
                                     0, 0, -(far * near * 2) / fn, 0
                                    );
  }
  
  descartesJS.Matrix4x4.prototype.perspective = function (fovy, aspect, near, far) {
    var top = near * Math.tan(fovy * Math.PI / 360.0);
    var right = top * aspect;
    
    return this.frustum(-right, right, -top, top, near, far);
  }
  
  descartesJS.Matrix4x4.prototype.ortho = function (left, right, bottom, top, near, far) {
    var rl = (right - left);
    var tb = (top - bottom);
    var fn = (far - near);
    
    return new descartesJS.Matrix4x4(2 / rl, 0, 0, 0,
                                     0, 2 / tb, 0, 0,
                                     0, 0, -2 / fn, 0,
                                     -(left + right) / rl, -(top + bottom) / tb, -(far + near) / fn, 1
                                    );
  }
  
  descartesJS.Matrix4x4.prototype.lookAt = function (eye, center, up) {
        if ((eye.x === center.x) && (eye.y === center.y) && (eye.z === center.z)) {
          return (new descartesJS.Matrix4x4()).setIdentity();
        }
        
        var z0 = eye.x - center.x;
        var z1 = eye.y - center.y;
        var z2 = eye.z - center.z;
        
        var len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        var x0 = up.y * z2 - up.z * z1;
        var x1 = up.z * z0 - up.x * z2;
        var x2 = up.x * z1 - up.y * z0;        
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        var y0 = z1 * x2 - z2 * x1;
        var y1 = z2 * x0 - z0 * x2;
        var y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }
        
        return new descartesJS.Matrix4x4(x0, y0, z0, 0,
                                         x1, y1, z1, 0,
                                         x2, y2, z2, 0,
                                         -(x0 * eye.x + x1 * eye.y + x2 * eye.z), -(y0 * eye.x + y1 * eye.y + y2 * eye.z), -(z0 * eye.x + z1 * eye.y + z2 * eye.z), 1
                                        );
  }
  
  descartesJS.Matrix4x4.prototype.fromRotationTranslation = function (v) {
    var x2 = 2 * this.x;
    var y2 = 2 * this.y;
    var z2 = 2 * this.z;
    
    var xx = this.x * x2;
    var xy = this.x * y2;
    var xz = this.x * z2;
    var yy = this.y * y2;
    var yz = this.y * z2;
    var zz = this.z * z2;
    var wx = this.w * x2;
    var wy = this.w * y2;
    var wz = this.w * z2;
    
    return new descartesJS.Matrix4x4(1 - (yy + zz), xy + wz, xz - wy, 0,
                                     xy - wz, 1 - (xx + zz), yz + wx, 0,
                                     xz + wy, yz - wx, 1 - (xx + yy), 0,
                                     v.x, v.y, v.z, 1
                                    );
  }
    
  descartesJS.Quaternion = function(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 0;
  }
  
  descartesJS.Quaternion.prototype.clone = function() {
   return new descartesJS.Quaternion(this.x, this.y, this.z, this.w); 
  }
  
  descartesJS.Quaternion.prototype.setIdentity = function() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 1;
    
    return this;
  }
  
  descartesJS.Quaternion.prototype.calculateW = function () {
    return new descartesJS.Quaternion(this.x, 
                                      this.y, 
                                      this.z, 
                                      -Math.sqrt(Math.abs(1.0 - this.x * this.x - this.y * this.y - this.z * this.z))
                                      );
  }
  
  descartesJS.Quaternion.prototype.dot = function(q) {
    return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
  }
    
  descartesJS.Quaternion.prototype.inverse = function() {
    var dot = this.dot(this);
    var invDot = 0;
    
    if (dot != 0) {
      invDot = 1.0/dot;
    }
    
    return new descartesJS.Quaternion(-this.x * invDot,
                                      -this.y * invDot,
                                      -this.z * invDot,
                                       this.w * invDot
                                     );
  }
  
  descartesJS.Quaternion.prototype.conjugate = function () {
    return new descartesJS.Quaternion(-this.x,
                                      -this.y,
                                      -this.z,
                                       this.w
                                     );
  }
  
  descartesJS.Quaternion.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  
  descartesJS.Quaternion.prototype.normalize = function (quat, dest) {
    var len = this.length();
    
    if (len === 0) {
      return new descartesJS.Quaternion();
    }
    
    len = 1 / len;
    
    return new descartesJS.Quaternion(this.x * len,
                                      this.y * len,
                                      this.z * len,
                                      this.w * len
                                     );
  }
  
  descartesJS.Quaternion.prototype.add = function (q) {
    return new descartesJS.Quaternion(this.x + q.x,
                                      this.y + q.y,
                                      this.z + q.z,
                                      this.w + q.w
                                     );
  }

  descartesJS.Quaternion.prototype.multiply = function (q) {
    return new descartesJS.Quaternion(this.x * q.w + this.w * q.x + this.y * q.z - this.z * q.y,
                                      this.y * q.w + this.w * q.y + this.z * q.x - this.x * q.z,
                                      this.z * q.w + this.w * q.z + this.x * q.y - this.y * q.x,
                                      this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z
                                     );
  }

  descartesJS.Quaternion.prototype.multiplyVector3 = function (v) {
    var ix =  this.w * v.x + this.y * v.z - this.z * v.y;
    var iy =  this.w * v.y + this.z * v.x - this.x * v.z;
    var iz =  this.w * v.z + this.x * v.y - this.y * v.x;
    var iw = -this.x * v.x - this.y * v.y - this.z * v.z;
 
    return new descartesJS.Vector3D(ix * this.w + iw * -this.x + iy * -this.z - iz * -this.y,
                                    iy * this.w + iw * -this.y + iz * -this.x - ix * -this.z,
                                    iz * this.w + iw * -this.z + ix * -this.y - iy * -this.x
                                   );
  }
  
  descartesJS.Quaternion.prototype.scale = function (s) {
    return new descartesJS.Quaternion(this.x * s,
                                      this.y * s,
                                      this.z * s,
                                      this.w * s
                                     );
  }

  descartesJS.Quaternion.prototype.toMatrix3x3 = function () {
    var x2 = this.x + this.x;
    var y2 = this.y + this.y;
    var z2 = this.z + this.z;
    
    var xx = this.x * x2;
    var xy = this.x * y2;
    var xz = this.x * z2;
    var yy = this.y * y2;
    var yz = this.y * z2;
    var zz = this.z * z2;
    var wx = this.w * x2;
    var wy = this.w * y2;
    var wz = this.w * z2;
    
    return new descartesJS.Matrix3x3(1 - (yy + zz), xy + wz, xz - wy,
                                     xy - wz, 1 - (xx + zz), yz + wx,
                                     xz + wy, yz - wx, 1 - (xx + yy)
                                    );
  }

  descartesJS.Quaternion.prototype.toMat4 = function () {
    var x2 = this.x + this.x;
    var y2 = this.y + this.y;
    var z2 = this.z + this.z;
    
    var xx = this.x * x2;
    var xy = this.x * y2;
    var xz = this.x * z2;
    var yy = this.y * y2;
    var yz = this.y * z2;
    var zz = this.z * z2;
    var wx = this.w * x2;
    var wy = this.w * y2;
    var wz = this.w * z2;
    
    return new descartesJS.Matrix4x4(1 - (yy + zz), xy + wz, xz - wy, 0,
                                     xy - wz, 1 - (xx + zz), yz + wx, 0,
                                     xz + wy, yz - wx, 1 - (xx + yy), 0,
                                     0, 0, 0, 1
                                    );
  }
  
  descartesJS.Quaternion.prototype.slerp = function (q, slerp) {
    var cosHalfTheta = this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
    
    if (Math.abs(cosHalfTheta) >= 1) {
      return new descartesJS.Quaternion(this.x,
                                        this.y,
                                        this.z,
                                        this.w
                                       );
    }
    
    var halfTheta = Math.acos(cosHalfTheta);
    var sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
    
    if (Math.abs(sinHalfTheta) < 0.001) {
      return new descartesJS.Quaternion(this.x * 0.5 + q.x * 0.5,
                                        this.y * 0.5 + q.y * 0.5,
                                        this.z * 0.5 + q.z * 0.5,
                                        this.w * 0.5 + q.w * 0.5
                                       );
    }
    
    var ratioA = Math.sin((1 - slerp) * halfTheta) / sinHalfTheta;
    var ratioB = Math.sin(slerp * halfTheta) / sinHalfTheta;
    
    return new descartesJS.Quaternion(this.x * ratioA + q.x * ratioB,
                                      this.y * ratioA + q.y * ratioB,
                                      this.z * ratioA + q.z * ratioB,
                                      this.w * ratioA + q.w * ratioB
                                     );
  }

  // matriz de 3x3
  descartesJS.Quaternion.prototype.fromRotationMatrix = function(m) {
    var quaternion = new descartesJS.Quaternion();
    fTrace = m.a00 + m.a11 + m.a22;
    var fRoot;
    
    if ( fTrace > 0 ) {
      fRoot = Math.sqrt(fTrace + 1);
      quaternion.w = .5 * fRoot;
      fRoot = .5 / fRoot;
      quaternion.x = (m.a21 - m.a12) * fRoot;
      quaternion.y = (m.a02 - m.a20) * fRoot;
      quaternion.z = (m.a10 - m.a01) * fRoot;
    }
    else {
//       var s_iNext = this.fromRotationMatrix.s_iNext = this.fromRotationMatrix.s_iNext || [1,2,0];
      var s_iNext = [1,2,0];
      var i = 0;
      var mat = [m.a00, m.a01, m.a02, m.a10, m.a11, m.a12, m.a20, m.a21, m.a22];

      if (mat[4] > mat[0]) {
        i = 1;
      }
      if (mat[8] > mat[i*3+i]) {
        i = 2;
      }
      var j = s_iNext[i];
      var k = s_iNext[j];

      fRoot = Math.sqrt(mat[i*3+i]-mat[j*3+j]-mat[k*3+k] + 1.0);

      if (i == 0) {
        quaternion.x = 0.5 * fRoot;
      }
      else if (i == 1) {
        quaternion.y = 0.5 * fRoot;
      }
      else {
        quaternion.z = 0.5 * fRoot;
      }
      
      fRoot = 0.5 / fRoot;
      
      quaternion.w = (mat[k*3+j] - mat[j*3+k]) * fRoot;

      if (j == 0) {
        quaternion.x = (mat[j*3+i] + mat[i*3+j]) * fRoot;
      }
      else if (j == 1) {
        quaternion.y = (mat[j*3+i] + mat[i*3+j]) * fRoot;
      }
      else {
        quaternion.z = (mat[j*3+i] + mat[i*3+j]) * fRoot;
      }
      
      if (j == 0) {
        quaternion.x = (mat[k*3+i] + mat[i*3+k]) * fRoot;
      }
      else if (j == 1) {
        quaternion.y = (mat[k*3+i] + mat[i*3+k]) * fRoot;
      }
      else {
        quaternion.z = (mat[k*3+i] + mat[i*3+k]) * fRoot;
      }
    }
    
    return quaternion;
  }
  
  descartesJS.Quaternion.prototype.setIdentity = function() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 1;
    return this;
  }
  
  descartesJS.Quaternion.prototype.fromAngleAxis = function(angle, axis) {
    var half = angle * 0.5;
    var s = Math.sin(half);
    
    return new descartesJS.Quaternion(Math.cos(half),
                                      s * axis.x,
                                      s * axis.y,
                                      s * axis.z
                                     );
  }

  descartesJS.Quaternion.prototype.toAngleAxis = function() {
    var sqrlen = this.x * this.x + this.y * this.y + this.z * this.z;
    var vector = new descartesJS.Vector4D();
    
    if (sqrlen > 0) {
      vector.w = 2 * Math.acos(this.w);
      var invlen = descartesJS.RenderMath.inverseSqrt(sqrlen);
      vector.x = this.x * invlen;
      vector.y = this.y * invlen;
      vector.z = this.z * invlen;
    }
    else {
      vector.x = 1;
      vector.y = 0;
      vector.z = 0;
      vector.w = 0;
    }
    
    return vector;
  }
  
  
  descartesJS.Matrix4x4.prototype.toArray = function() {
    return [this.a00, this.a01, this.a02, this.a03, 
            this.a10, this.a11, this.a12, this.a13,
            this.a20, this.a21, this.a22, this.a23,
            this.a30, this.a31, this.a32, this.a33
           ];
  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * @constructor 
   */
  descartesJS.Scene = function(parent, pMatrix) {
    this.parent = parent;
    this.graphics = [];
  }

  /**
   *
   */
  descartesJS.Scene.prototype.add = function(g) {
    this.graphics.push(g);
  }

  /**
   *
   */
  function compare(a, b) {
    return b.depth - a.depth;
  }

  /**
   *
   */
  descartesJS.Scene.prototype.draw = function() {
    for(var i=0, l=this.graphics.length; i<l; i++) {
      this.graphics[i].transformVertices(this.parent);
    }

    this.graphics = this.graphics.sort(compare);

    for(var i=0, l=this.graphics.length; i<l; i++) {
      this.graphics[i].draw();
    }
  } 

  /**
   *
   */
  descartesJS.Primitive3D = function (vertices, type, style, mvMatrix, ctx) {
    this.vertices = vertices;
    this.type = type;
    this.style = style;
    this.mvMatrix = mvMatrix;
    this.ctx = ctx;
    this.transformedVertices = [];
    this.centroid = new descartesJS.Vector4D(0, 0, 0, 1);

    // asign the correct drawing function
    if (type === "vertex") {
      this.draw = drawVertex;
    }
    else if (type === "triangle") {
      this.draw = drawTriangle;
    }
    else if (type === "face") {
      this.draw = drawFace;
    }
    else if (type === "text") {
      this.draw = drawText;
    }
    else if (type === "segment") {
      this.draw = drawSegment;
    }
  }

  /**
   *
   */
  descartesJS.Primitive3D.prototype.transformVertices = function (space) {
    this.depth = 0;

    for (var i=0, l=this.vertices.length; i<l; i++) {
      this.transformedVertices[i] = space.perspectiveMatrix.multiplyVector4( this.vertices[i] ).toVector3D();

      this.depth += this.transformedVertices[i].z;

      this.transformedVertices[i].x = space.transformCoordinateX(this.transformedVertices[i].x);
      this.transformedVertices[i].y = space.transformCoordinateY(this.transformedVertices[i].y);
    }
    this.depth = this.depth / l;
  }

  /**
   *
   */
  descartesJS.Primitive3D.prototype.setStyle = function() {
    for( var i in this.style ) {
      this.ctx[i] = this.style[i];
    }
  }

  /**
   *
   */
  var drawVertex = function() {

  }

  /**
   *
   */
  var drawFace = function() {
    var ctx = this.ctx;
    this.setStyle();

    ctx.beginPath();
    ctx.moveTo(this.transformedVertices[0].x, this.transformedVertices[0].y);
    for (var i=1, l=this.transformedVertices.length; i<l; i++) {
      ctx.lineTo(this.transformedVertices[i].x, this.transformedVertices[i].y);
    }
    ctx.closePath();

    // modelo de iluminacion de alambre
    if (this.style.model == "wire") {
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.fillStyle;
      ctx.stroke();
    }
    else {
      if (this.style.edges) {
        ctx.stroke();
      }
    }

    ctx.fill();
  }

  /**
   *
   */
  var drawText = function() {

  }

  /**
   *
   */
  var drawSegment = function() {

  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un grafico de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen un grafico de descartes
   */
  descartesJS.Graphic3D = function(parent, values) {
    /**
     * La aplicacion de descartes a la que corresponde el grafico
     * type DescartesApp
     * @private
     */
    this.parent = parent;

    var parser = this.parent.evaluator.parser;
    
    /**
     * Objeto para el parseo y evaluacion de expresiones
     * type {Evaluator}
     * @private
     */
    this.evaluator = parent.evaluator;
    
    /**
     * El identificador del espacio al que pertenece el elemento grafico
     * type String
     * @private
     */
    this.spaceID = "E0";

    /**
     * El tipo de grafico
     * type String
     * @private
     */
    this.type = "";

    /**
     * La condicion para determinar si el grafico se dibuja en el fondo
     * type String
     * @private
     */
    this.background = false;

    /**
     * El color principal del grafico
     * type String
     * @private
     */
    this.color = "#eeffaa";
    this.backcolor = "#6090a0";
    this.Nu = this.evaluator.parser.parse("7");
    this.Nv = this.evaluator.parser.parse("7");
    
    /**
     * La condicion de dibujado del grafico
     * type Boolean
     * @private
     */
    this.drawif = parser.parse("1");
    
    /**
     * La condicion para determinar si el grafico se dibuja en coordenadas absolutas
     * type Boolean
     * @private
     */
    this.abs_coord = false;
    
    /**
     * Expresion que determina la posicion y el tamanio del grafico
     * type String
     * @private
     */
//     this.expresion = parser.parse("(0,0)");

    /**
     * El color del rastro que deja el grafico
     * type String
     * @private
     */
    this.trace = "";

    /**
     * La condicion y el parametro que se utilizan para dibujar el grafico como una familia
     * type String
     * @private
     */
    this.family = "";

    /**
     * El intervalo utilizado para dibujar el grafico como una familia
     * type String
     * @private
     */
    this.family_interval = parser.parse("[0,1]");

    /**
     * El numero de pasos que se utiliza para dibujar el grafico como una familia
     * type Number
     * @private
     */
    this.family_steps = parser.parse("8");
    
    /**
     * El parametro que se utilizan para dibujar una curva
     * type String
     * @private
     */
    this.parameter = "t";

    /**
     * El intervalo utilizado para dibujar una curva
     * type String
     * @private
     */
    this.parameter_interval = parser.parse("[0,1]");

    /**
     * El numero de pasos que se utiliza para dibujar una curva
     * type Number
     * @private
     */
    this.parameter_steps = parser.parse("8");

    /**
     * La condicion y el color del relleno del grafico
     * type String
     * @private
     */
    this.fill = "";

    /**
     * La condicion y el color fill+
     * type String
     * @private
     */
    this.fillP = ""; 

    /**
     * La condicion y el color fill+
     * type String
     * @private
     */
    this.fillM = "";

    /**
     * El ancho del trazo del grafico
     * type Number
     * @private
     */
    this.width = -1;
    this.length = -1;

    /**
     * La condicion para determinar ???
     * type Boolean
     * @private
     */
//     this.visible = false;

    /**
     * La condicion para determinar si una escuacion es editable
     * type Boolean
     * @private
     */
    this.editable = false;

    /**
     * La informacion de ???
     * type Boolean
     * @private
     */
    this.info = "";

    /**
     * La tipografia de info
     * type Boolean
     * @private
     */
    this.font = "Monospaced,PLAIN,12";
    
    /**
     * La condicion para determinar si el texto mostrado debe ser fijo o no
     * type Boolean
     * @private
     */
    this.fixed = true;

    /**
     * El ancho del punto
     * type Number
     * @private
     */
    this.size = parser.parse("2");

    /**
     * El texto de los graficos
     * type String
     * @private
     */
    this.text = "";

    /**
     * El numero de decimales que se muestran en el texto
     * type Number
     * @private
     */
    this.decimals = parser.parse("2");

    /**
     * El tamanio de la punta de un grafico (una flecha)
     * type Number
     * @private
     */
    this.spear = parser.parse("8");

    /**
     * El color interior de un grafico (una flecha)
     * type String
     * @private
     */
    this.arrow = "#ee0022";

    /**
     * La posicion del centro de un grafico (un circulo)
     * type String
     * @private
     */
    this.center = parser.parse("(0,0)");

    /**
     * El radio de un grafico (un circulo)
     * type Number
     * @private
     */
    this.radius = parser.parse("1");

    /**
     * El angulo o vector inicial de un grafico (un circulo)
     * type Number
     * @private
     */
    this.init = parser.parse("0");

    /**
     * El angulo o vector final de un grafico (un circulo)
     * type Number
     * @private
     */
    this.end = parser.parse("90");

    /**
     * El nombre del archivo de un grafico (una imagen)
     * type String
     * @private
     */
    this.file = "";

    /**
     * La rotacion de un grafico (una imagen)
     * type Number
     * @private
     */
    this.inirot = parser.parse("0");
    
    /**
     * La posicion de un macro
     * type Number
     * @private
     */
//     this.inipos = parser.parse("[0,0]");
    
    // se recorre values para reemplazar los valores iniciales del control
    for (var propName in values) {
      // solo se verifican las propiedades propias del objeto values
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }
    
    if ((this.expresion == undefined) && (this.type != "macro")) {
      this.expresion = parser.parse("(0,0)");
    }

    // se obtiene el espacio al que pertenece el grafico
    this.space = this.getSpace();

    if (this.background) {
      this.canvas = this.space.backgroundCanvas;
    } else {
      this.canvas = this.space.canvas;
    }
    this.ctx = this.canvas.getContext("2d");
    
    // si el objeto deja rastro, se obtiene el contexto de render del fondo
    if (this.trace) {
      this.traceCtx = this.space.backgroundCanvas.getContext("2d");
    }
    
    this.font = descartesJS.convertFont(this.font)
  }  
  
  /**
   * Obtiene el espacio al cual pertenece el grafico
   * return {Space} el espacio al cual pertenece el grafico
   */
  descartesJS.Graphic3D.prototype.getSpace = function() {
    var spaces = this.parent.spaces;
    var space_i;
    // se busca el espacio al que pertenece
    for (var i=0, l=spaces.length; i<l; i++) {
      space_i = spaces[i];
      if (space_i.id == this.spaceID) {
//         spaces[i].addGraph(this);
        return space_i;
      }
    }
    
    // si no encuentra un espacio con el identificador registrado entonces el grafico se agrega al primer espacio de la leccion
    return spaces[0];
  }
  
  /**
   * Obtiene los valores de la familia
   */
  descartesJS.Graphic3D.prototype.getFamilyValues = function() {
    var evaluator = this.evaluator;
    var expr = evaluator.evalExpression(this.family_interval);
    this.familyInf = expr[0][0];
    this.familySup = expr[0][1];
    this.fSteps = Math.round(evaluator.evalExpression(this.family_steps));
    this.family_sep = (this.fSteps > 0) ? (this.familySup - this.familyInf)/this.fSteps : 0;
  }
  
  /**
   * Funcion auxiliar para dibujar la familia
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja
   * @param {String} fill el color de relleno del grafico
   * @param {String} stroke el color del trazo del grafico
   */
  descartesJS.Graphic3D.prototype.drawFamilyAux = function(ctx, fill, stroke) {
    var evaluator = this.evaluator;

    // se actualizan los valores de la familia
    this.getFamilyValues();

    // se guarda el ultimo valor que tenia la variable family
    var tempParam = evaluator.getVariable(this.family);

    if (this.fSteps >= 0) {
      // se dibujan todos los miembros de la familia
      for(var i=0, l=this.fSteps; i<=l; i++) {
        // se modifica el valor de la variable family
        evaluator.setVariable(this.family, this.familyInf+(i*this.family_sep));
                
        // si la condicion de dibujo del elemento es verdadera entonces se actualiza y dibuja el elemento
        if ( evaluator.evalExpression(this.drawif) ) {
          // se actualizan los valores antes de dibujar el elemento
          this.update();
          // se dibuja el elemento
          this.drawAux(ctx, fill, stroke);
        }
      }
    }

    evaluator.setVariable("_Text_H_", 0);
    evaluator.setVariable(this.family, tempParam);
  }

  /**
   * Dibuja el grafico
   * @param {String} fill el color de relleno del grafico
   * @param {String} stroke el color del trazo del grafico
   */
  descartesJS.Graphic3D.prototype.draw = function(fill, stroke) {
    // si la familia esta activada entonces se dibujan varias veces los elementos
    if (this.family != "") {
      this.drawFamilyAux(this.ctx, fill, stroke);
    }
    
    // si la familia no esta activada
    // si la condicion de dibujo del elemento es verdadera entonces se actualiza y dibuja el elemento
    else  {
      // se dibuja el elemento
      if ( this.evaluator.evalExpression(this.drawif) ) {
        // se actualizan los valores antes de dibujar el elemento
        this.update();
        // se dibuja el elemento
        this.drawAux(this.ctx, fill, stroke);
      }
    }
  }
  
  /**
   * Se dibuja el rastro del grafico
   * @param {String} fill el color de relleno del punto
   * @param {String} stroke el color del trazo del punto
   */
  descartesJS.Graphic3D.prototype.drawTrace = function(fill, stroke) {
    // si la familia esta activada entonces se dibujan varias veces los elementos
    if (this.family != "") {
      this.drawFamilyAux(this.traceCtx, fill, stroke);
    }
    
    // si la familia no esta activada
    else {      
      // se dibuja el elemento
      if ( this.evaluator.evalExpression(this.drawif) ) {
        // se actualizan los valores antes de dibujar el elemento
        this.update();
        // se dibuja el elemento
        this.drawAux(this.traceCtx, fill, stroke);
      }
    }
  }

  /**
   * Se dibuja el texto del grafico
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja
   * @param {String} text el texto a dibujar
   * @param {Number} x la posicion en x del texto
   * @param {Number} y la posicion en y del texto
   * @param {String} fill el color de relleno del punto
   * @param {String} font la tipografia del texto
   * @param {String} align la alineacion del texto
   * @param {String} baseline la base sobre la que se dibuja el texto
   * @param {Number} decimals el numero de decimales del texto
   * @param {Boolean} fixed el texto esta en notacion fija
   */
  descartesJS.Graphic3D.prototype.drawText = function(ctx, text, x, y, fill, font, align, baseline, decimals, fixed) {
    if (text.type == "rtfNode") {
      ctx.fillStyle = fill;
      ctx.strokeStyle = fill;
      ctx.textBaseline = "alphabetic";
      text.draw(ctx, x, y, decimals, fixed, align);
      
      return;
    }    

    x = x + (font.match("Arial") ? -2 : (font.match("Times") ? -2: 0));
    var evaluator = this.evaluator;
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    
    this.fontSize = font.match(/(\d+)px/);
    if (this.fontSize) {
      this.fontSize = this.fontSize[1];
    } else {
      this.fontSize = "10";
    } 
    
    if (this.border) {
      ctx.strokeStyle = descartesJS.getColor(evaluator, this.border);
      ctx.lineWidth = parseFloat(this.fontSize)/12;
    }
    
    var theText;
    var verticalDisplace = this.fontSize*1.2;

    // condicion que se checa para el ancho del texto
    // si el "tipo" de los elementos contenidos en el texto existe, significa que es algo parseado
    if ( (text[0]) && (text[0].type) ) {
      for (var i=0, l=text.length; i<l; i++) {
        theText = evaluator.evalExpression(text[i], decimals, fixed);
        
        if (this.border) {
          ctx.strokeText(theText, x, y+(verticalDisplace*i));
        }
        ctx.fillText(theText, x, y+(verticalDisplace*i));
      }
    }
    // el tipo del texto es un arreglo de textos
    else {
      for (var i=0, l=text.length; i<l; i++) {
        theText = text[i];
        if (this.border) {
          ctx.strokeText(theText, x, y+(verticalDisplace*i));
        }
        ctx.fillText(theText, x, y+(verticalDisplace*i));
      }      
    }
  }

  /**
   * 
   */
  descartesJS.Graphic3D.prototype.findExpresionX = function(expresion) {
    var subexpresion = expresion.split(/x=/)[1];
    
    if (subexpresion) {
      subexpresion = subexpresion.split(/y=/)[0];
      subexpresion = subexpresion.split(/z=/)[0];
      return subexpresion;
    }
    else {
      return "";
    }
  }

  /**
   * 
   */
  descartesJS.Graphic3D.prototype.findExpresionY = function(expresion) {
    var subexpresion = expresion.split(/y=/)[1];
    
    if (subexpresion) {
      subexpresion = subexpresion.split(/x=/)[0];
      subexpresion = subexpresion.split(/z=/)[0];
      return subexpresion;
    }
    else {
      return "";
    }
  }

  /**
   * 
   */
  descartesJS.Graphic3D.prototype.findExpresionZ = function(expresion) {
    var subexpresion = expresion.split(/z=/)[1];
    
    if (subexpresion) {
      subexpresion = subexpresion.split(/x=/)[0];
      subexpresion = subexpresion.split(/y=/)[0];
      return subexpresion;
    }
    else {
      return "";
    }
  }  
  
  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una superficie de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la superficie
   */
  descartesJS.Surface3D = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic3D.call(this, parent, values);

    var parser = this.evaluator.parser;
    
    this.width = (this.width == -1) ? parser.parse("1") : this.width;

    this.mvMatrix = (new descartesJS.Matrix4x4()).setIdentity();

    this.exprX = parser.parse( this.findExpresionX(this.expresion) );
    this.exprY = parser.parse( this.findExpresionY(this.expresion) );
    this.exprZ = parser.parse( this.findExpresionZ(this.expresion) );
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Surface3D, descartesJS.Graphic3D);
  
  var evaluator;
  var tempParamU;
  var tempParamV;
  var Nu;
  var Nv;
  var xEval;
  var yEval;
  var zEval;
  var vertices;
  var faces;
  var v;
  var fillStyle;

  /**
   * Actualiza la superficie
   */
  descartesJS.Surface3D.prototype.update = function() {
    evaluator = this.evaluator;
    tempParamU = evaluator.getVariable("u");
    tempParamV = evaluator.getVariable("v");  
    evaluator.setVariable("u", 0);
    evaluator.setVariable("v", 0);
    Nu = evaluator.evalExpression(this.Nu);
    Nv = evaluator.evalExpression(this.Nv);

    fillStyle = descartesJS.getColor(evaluator, this.color);

    vertices = [];
    faces = [];

    for (var ui=0; ui<=Nu; ui++) {
      evaluator.setVariable("u", ui/Nu);

      for (var vi=0; vi<=Nv; vi++) {
        evaluator.setVariable("v", vi/Nv);
        xEval = evaluator.evalExpression(this.exprX);
        yEval = evaluator.evalExpression(this.exprY);
        evaluator.setVariable("x", xEval);
        evaluator.setVariable("y", yEval);
        zEval = evaluator.evalExpression(this.exprZ);
        
        // vertices.push( this.mvMatrix.multiplyVector4(new descartesJS.Vector4D(xEval, yEval, zEval, 1)) );

        vertices.push( new descartesJS.Vector4D(xEval, yEval, zEval, 1) );
      }
    }

    for (var ui=0; ui<Nu; ui++) {
      for (var vi=0; vi<Nv; vi++) {
        v = [];
        v.push(vertices[vi + ui*Nv + ui]);
        v.push(vertices[vi+1 + ui*Nv + ui]);
        v.push(vertices[vi+2 + (ui+1)*Nv  + ui]);
        v.push(vertices[vi+1 + (ui+1)*Nv  + ui]);

        this.space.scene.add(new descartesJS.Primitive3D( v,
                                                          "face",
                                                          { lineWidth: 2, fillStyle: fillStyle, strokeStyle: "#808080", lineCap: "round", lineJoin: "round", edges: this.edges},
                                                          this.mvMatrix,
                                                          this.ctx
                                                        ));

      }
    }
  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una malla de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la malla
   */
  descartesJS.Mesh3D = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic3D.call(this, parent, values);

    var parser = this.evaluator.parser;
    
    this.width = (this.width == -1) ? parser.parse("1") : this.width;

    this.mvMatrix = (new descartesJS.Matrix4x4()).setIdentity();

    var fileData = descartesJS.openExternalFile(this.evaluator.evalExpression(this.file)).split(/\r/);
    this.vertices = [];
    this.faces = [];
    var toInt = function(x) {
      return parseInt(x);
    }

    for (var i=0, l=fileData.length; i<l; i++) {
      if (fileData[i].match(/^V\(/)) {
        this.vertices.push( this.evaluator.parser.parse(fileData[i].substring(1), false, this.name) );
      }

      else if (fileData[i].match(/^F\(/)) {
        this.faces.push( fileData[i].substring(2, fileData[i].length-1).split(",").map(toInt) );
      }

      else if (fileData[i].match(/^VAR\(/)) {
        this.evaluator.evalExpression( this.evaluator.parser.parse(fileData[i].substring(4, fileData[i].length-1), true, this.name) );
      }
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Mesh3D, descartesJS.Graphic3D);
  
  var evaluator;
  var fillStyle;

  /**
   * Actualiza la malla
   */
  descartesJS.Mesh3D.prototype.update = function() {
    evaluator = this.evaluator;

    fillStyle = descartesJS.getColor(evaluator, this.color);

    var v;
    var vTemp;

    for (var i=0, l=this.faces.length; i<l; i++) {
      v = [];

      for (var j=0, k=this.faces[i].length; j<k; j++) {
        vTemp = this.evaluator.evalExpression( this.vertices[this.faces[i][j]] )[0];
        v.push(new descartesJS.Vector4D(vTemp[0], vTemp[1], vTemp[2], 1))
      }

      this.space.scene.add(new descartesJS.Primitive3D( v,
                                                        "face",
                                                        { lineWidth: 2, fillStyle: fillStyle, strokeStyle: "#808080", lineCap: "round", lineJoin: "round", edges: this.edges},
                                                        this.mvMatrix,
                                                        this.ctx
                                                      ));    
    }
  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathMax = Math.max;
  var MathMin = Math.min;

  descartesJS.R2 = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  descartesJS.R2.prototype.copy = function() {
    return new descartesJS.R2(this.x, this.y);
  }
  
  descartesJS.R2.prototype.ix = function() {
    return Math.round(MathMax(MathMin(this.x,32000), -32000));
  }

  descartesJS.R2.prototype.iy = function() {
    return Math.round(MathMax(MathMin(this.y,32000), -32000));
  }

  descartesJS.R2.prototype.equals = function(p) {
    return ((this.x == p.x) && (this.y == p.y)); 
  }

  descartesJS.R2.prototype.norm2 = function() {
    return this.x*this.x + this.y*this.y; 
  }

  descartesJS.R2.prototype.norm = function() {
    return Math.sqrt( this.norm2() ); 
  }

  descartesJS.R2.prototype.distance = function(p) {
    var q = this.copy(); 
    q.sub(p); 
    
    return q.norm(); 
  }

  descartesJS.R2.prototype.dot = function(p) {
    return this.x*p.x + this.y*p.y; 
  }

  descartesJS.R2.prototype.det = function(p) {
    return this.x*p.y - this.y*p.x; 
  }

  descartesJS.R2.prototype.mul = function(m) {
    this.x*=m;
    this.y*=m; 
  }

  descartesJS.R2.prototype.div = function(d) {
    this.x/=d;
    this.y/=d; 
  }

  descartesJS.R2.prototype.add = function(p) {
    this.x+=p.x;
    this.y+=p.y; 
  }

  descartesJS.R2.prototype.sub = function(p) {
    this.x-=p.x;
    this.y-=p.y; 
  }

  descartesJS.R2.prototype.normalize = function() {
    var abso = this.norm(); 
    if (abso != 0.0) { 
      this.div(abso); 
    }
  }

  descartesJS.R2.prototype.rotR90 = function() {
    var aux = this.x;
    this.x = this.y;
    this.y = -aux; 
  }

  descartesJS.R2.prototype.rotL90 = function() {
    var aux = this.x;
    this.x = -this.y;
    this.y = aux;
  }

  descartesJS.R2.prototype.rot = function(t) {
    var p = this.copy();
    var cost = Math.cos(t);
    var sint = Math.sin(t);
    this.x = p.x*cost - p.y*sint;
    this.y = p.x*sint + p.y*cost;
  }

  descartesJS.R2.prototype.rot = function(g) {
    this.rot(g*Math.PI/180); 
  }

  descartesJS.R2.prototype.intersection = function(p1, p2, q1, q2) {
    var A11 = (p2.x-p1.x);
    var A12 = (q1.x-q2.x);
    var B1 = q1.x-p1.x;
    
    var A21 = (p2.y-p1.y);
    var A22 = (q1.y-q2.y);
    var B2 = q1.y-p1.y;
    
    var mp;
    var Mp;
    var mq;
    var Mq;
    
    var Det = A11*A22-A12*A21;
    if (Math.abs(Det) > 0.000001) {
      var s = ( B1*A22-B2*A12)/Det;
      var t = (-B1*A21+B2*A11)/Det;
      if (0<=s && s<=1 && 0<=t && t<=1) {
        return new descartesJS.R2(p1.x+A11*s, p1.y+A21*s);
      } else {
        return null;
      }
    } 
    
    else if ((p2.x-q1.x)*B2 != (p2.y-q1.y)*B1) {
      return null; // no están alineados
    } else { // están alineados
      if (p1.x != p2.x) {
        mp = MathMin(p1.x, p2.x);
        Mp = MathMax(p1.x, p2.x);
        
        if (mp<=q1.x && q1.x<=Mp) {
          return q1;
        } 
        else if (mp<=q2.x && q2.x<=Mp) {
          return q2;
        }
        return null;
      } 
      else if (q1.x != q2.x) {
        mq = MathMin(q1.x, q2.x);
        Mq = MathMax(q1.x, q2.x);
        
        if (mq<=p1.x && p1.x<=Mq) {
          return p1;
        } 
        else if (mq<=p2.x && p2.x<=Mq) {
          return p2;
        }
        return null;
      } 
      else if (p1.y != p2.y) {
        mp = MathMin(p1.y, p2.y);
        Mp = MathMax(p1.y, p2.y);
        
        if (mp<=q1.y && q1.y<=Mp) {
          return q1;
        } 
        else if (mp<=q2.y && q2.y<=Mp) {
          return q2;
        }
        return null;
      } 
      else if (q1.y != q2.y) {
        mq=MathMin(q1.y, q2.y);
        Mq=MathMax(q1.y, q2.y);
        
        if (mq<=p1.y && p1.y<=Mq) {
          return p1;
        } 
        else if (mq<=p2.y && p2.y<=Mq) {
          return p2;
        }
        return null;
      } 
      else if (p1.x==q1.x && p1.y==q1.y) {
        return p1;
      } else {
        return null;
      }
    }
  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var delta = 0.000000000001;
  var epsilon = 0.000001;
  
  descartesJS.R2Newton = function(evaluator, constraint) {
    this.evaluator = evaluator;
    this.constraint = constraint;
    
    if ((this.constraint.value == "==") || (this.constraint.value == "<") || (this.constraint.value == "<=") || (this.constraint.value == ">") || (this.constraint.value == ">=")) {
      
      if ((this.constraint.value == "<") || (this.constraint.value == "<=")) {
        this.sign = "menor";
      }
      
      else if ((this.constraint.value == ">") || (this.constraint.value == ">=")) {
        this.sign = "mayor";
      }
      
      else {
        this.sign = "igual"; 
      }
      
      // una restriccion de la forma "algo = otraCosa" se convierte en "algo - otraCosa = 0"
      this.constraint = this.constraint.equalToMinus();
      // se evalua solo el lado izquierdo, ya que el lado derecho es 0
      this.constraint = this.constraint.childs[0];
    }
  }
  
  /**
   * 
   */
  descartesJS.R2Newton.prototype.getUnitNormal = function() {
    this.normal.normalize();
    return this.normal.copy();
  }
  
  /**
   * 
   */
  descartesJS.R2Newton.prototype.gradient = function(q0) {
    var evaluator = this.evaluator;
    
    var q = new descartesJS.R2(0, 0);
    
    var savex = evaluator.getVariable("x");
    var savey = evaluator.getVariable("y");

    evaluator.setVariable("x", q0.x);
    evaluator.setVariable("y", q0.y);

    this.f0 = evaluator.evalExpression(this.constraint);
    
    evaluator.setVariable("x", evaluator.getVariable("x") + delta);

    var FV = evaluator.evalExpression(this.constraint);
   
    q.x = (FV-this.f0)/delta;
    q.x = (!isNaN(q.x)) ? q.x : Infinity;
    
    evaluator.setVariable("x", evaluator.getVariable("x") - delta);
    evaluator.setVariable("y", evaluator.getVariable("y") + delta);

    FV = evaluator.evalExpression(this.constraint);

    q.y = (FV-this.f0)/delta;
    q.y = (!isNaN(q.y)) ? q.y : Infinity;

    evaluator.setVariable("x", savex);
    evaluator.setVariable("y", savey);
    
    return q;    
  }

  /**
   * 
   */
  // return R2
  // q0 es de tipo R2
  descartesJS.R2Newton.prototype.findZero = function(q0) {
    var evaluator = this.evaluator;
    
    var q = q0.copy();
    
    var savex = evaluator.getVariable("x");
    var savey = evaluator.getVariable("y");
    
    evaluator.setVariable("x", q0.x);
    evaluator.setVariable("y", q0.y);
    
    this.f0 = evaluator.evalExpression(this.constraint);
    
    if ((this.sign == "menor") && (this.f0 <= 0)) {
      return q;
    } 
    else if ((this.sign=="mayor") && (this.f0 >= 0)) {
      return q;
    }
    
    evaluator.setVariable("x", savex);
    evaluator.setVariable("y", savey);

    var xa;
    var ya;
    for (var i=0; i<256; i++) {
      xa = q.x;
      ya = q.y;

      this.normal = this.gradient(q);

      if (this.normal.norm2() != 0) {
        this.normal.mul(-this.f0/this.normal.norm2());
      }

      q.x = xa+this.normal.x; 
      q.y = ya+this.normal.y;
      
      if (this.normal.norm() < epsilon) {
        if ((this.normal.x == 0) && (this.normal.y == 0)) {
          this.normal.x = q.x-q0.x;
          this.normal.y = q.y-q0.y;
        }
        return q;
      }
    }
    
    return q;
  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  
  /**
   * Un control de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen un control de descartes
   */
  descartesJS.GraphicControl = function(parent, values) {
    /**
     * La aplicacion de descartes a la que corresponde el control
     * type DescartesApp
     * @private
     */
    this.parent = parent;
    this.evaluator = parent.evaluator;
    var parser = this.evaluator.parser;
    
    /**
     * El identificador del control
     * type String
     * @private
     */
    this.id = "G";

    /**
     * El tipo del control, si es numero o grafico 
     * type String
     * @private
     */
    this.type = "";
    
    /**
     * Nombre del espacio al cual pertenece el control
     * type String
     * @private
     */
    this.spaceID = "E0";

    /**
     * Texto que presenta el control
     * type String
     * @private
     */
    this.text = "";
    
    /**
     * Expresion que determina la posicion y el tamanio del control
     * type String
     * @private
     */
    this.expresion = parser.parse("(0,0)");

    /**
     * La restriccion de posicion del control
     * type String
     * @private
     */
    this.constraint;

    /**
     * La posicion en x del control
     * type Number
     * @private
     */
    this.x = 0;

    /**
     * La posicion en y del control
     * type Number
     * @private
     */
    this.y = 0;

    /**
     * El tamano del control
     * type Number
     * @private
     */
    this.size = parser.parse("4");

    /**
     * La condicion para determinar si los numeros del control utilizan notacion fija
     * type Boolean
     * @private
     */
    this.fixed = (this.parent.version != 2) ? false : true;

    /**
     * El color del borde del control
     * type String
     * @private
     */
    this.color = "#0000ff";

    /**
     * El color del control
     * type String
     * @private
     */
    this.colorInt = "#ff0000";

    /**
     * El tipo de la tipografia del control
     * type String
     * @private
     */
    this.font = "Monospaced,PLAIN,12";
    
    /**
     * La imagen del control
     * type Image
     * @private
     */
    this.image = new Image();
    var self = this;
    this.image.onload = function() {
      this.ready = 1;
    }

    /**
     * El nombre del archivo de la imagen de fondo del espacio
     * type String
     * @private
     */
    this.imageSrc = "";

    /**
     * La condicion de dibujado del control
     * type Boolean
     * @private
     */
    this.drawif = parser.parse("1");
    
    /**
     * La condicion de activacion del control
     * type Boolean
     * @private
     */
    this.activeif = parser.parse("1");

    /**
     * El mensaje de ayuda del control
     * type String
     * @private
     */
    this.tooltip = "";

    /**
     * La tipografia del mensaje de ayuda del control
     * type String
     * @private
     */
    this.tooltipFont = "Monospace 12px";

    /**
     * El mensaje de explicacion del control
     * type String
     * @private
     */
    this.Explanation = "";

    /**
     * La tipografia del mensaje de explicacion del control
     * type String
     * @private
     */
    this.ExplanationFont = "Monospace 12px";

    /**
     * El numero de decimales a mostrar en el control
     * type Number
     * @private
     */
    this.decimals = parser.parse("2");

    /**
     * Indice z del control
     * @type {number}
     * @private 
     */
    this.zIndex = -1;
    
    // se recorre values para reemplazar los valores iniciales del control
    for (var propName in values) {
      // solo se verifican las propiedades propias del objeto values
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }
    
    // se construye la cadena para la tipografia del texto del control grafico
    this.font = descartesJS.convertFont(this.font);
    
    // se construye la constriccion
    if (this.constraintExpr) {
      this.constraint = parser.parse(this.constraintExpr);
      
      if (this.constraint.type == "(expr)") {
        this.constraint = parser.parse(this.constraintExpr.substring(1, this.constraintExpr.length-1));
      }

      if (this.constraint.type == "compOperator") {
        var left = this.constraint.childs[0];
        var right = this.constraint.childs[1];
        this.newt = new descartesJS.R2Newton(this.evaluator, this.constraint);
      } else {
        this.constraint = null;
      }
    }

    // se obtiene el contenedor al cual pertenece el control
    this.container = this.getContainer();
    this.space = this.getSpace();
    this.mouseCacher = document.createElement("div");
    this.mouseCacher.setAttribute("class", "DescartesGraphicControl");
    this.mouseCacher.setAttribute("id", this.id);
//     this.mouseCacher.setAttribute("dragged", true);
    this.mouseCacher.setAttribute("tabindex", "-1"); 
    this.ctx = this.space.ctx;
    this.container.appendChild(this.mouseCacher);
    
    this.init();

    // se registran los eventos del mouse, cuando se de soporte a dispositivos moviles se deben de registrar los eventos correspondientes
    this.registerMouseEvents();
  }
  
  /**
   * Inicia los valores del control
   */
  descartesJS.GraphicControl.prototype.init = function() {
    var evaluator = this.evaluator;
    
    this.mouseCacher.style.display = (evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";

    // se encuentra la posicion en x y y del control grafico y se registra
    var expr = evaluator.evalExpression(this.expresion);
    this.x = expr[0][0];
    this.y = expr[0][1];
    evaluator.setVariable(this.id+".x", this.x);
    evaluator.setVariable(this.id+".y", this.y);

    var radioTouch = 70;
    
    // si el espacio tiene una imagen de fondo entonces se asigna el nombre del archivo
    if ((this.imageSrc != "") && !(this.imageSrc.toLowerCase().match(/vacio.gif$/))) {
      this.image = this.parent.getImage(this.imageSrc);

      this.width = this.image.width;
      this.height = this.image.height;
    
      this._w = ((descartesJS.hasTouchSupport) && (this.width < radioTouch)) ? radioTouch : this.width;
      this._h = ((descartesJS.hasTouchSupport) && (this.height < radioTouch)) ? radioTouch : this.height;
    } else {
      this.width = (evaluator.evalExpression(this.size)*2);
      this.height = (evaluator.evalExpression(this.size)*2);
      
      this._w = ((descartesJS.hasTouchSupport) && (this.width < radioTouch)) ? radioTouch : this.width;
      this._h = ((descartesJS.hasTouchSupport) && (this.height < radioTouch)) ? radioTouch : this.height;
    }
    
    ////////////////////////////////////////////////////////////////////////////
    if (this.constraint) {
      var cpos = this.newt.findZero(new descartesJS.R2(this.x, this.y));
      this.x = cpos.x;
      this.y = cpos.y;
      evaluator.setVariable(this.id+".x", this.x);
      evaluator.setVariable(this.id+".y", this.y);
    }
    ////////////////////////////////////////////////////////////////////////////
      
    this.mouseCacher.setAttribute("style", "background-color: rgba(255, 255, 255, 0); width: " +this._w+ "px; height: " +this._h+ "px; z-index: " + this.zIndex + ";");
    this.mouseCacher.style.left = parseInt(this.space.getAbsoluteX(this.x)-this._w/2)+"px";
    this.mouseCacher.style.top = parseInt(this.space.getAbsoluteY(this.y)-this._h/2)+"px";
    
//     // se obtinen los controles correspondientes a la coordenada x y y
//     this.ctrX = this.parent.getControlById(this.id+".x");
//     this.ctrY = this.parent.getControlById(this.id+".y");
    
    evaluator.setVariable(this.id+".activo", 0);
  }
  
  /**
   * Actualiza los valores del control
   */
  descartesJS.GraphicControl.prototype.update = function() {
    var evaluator = this.evaluator;

    // se actualiza la posicion del control
    this.x = evaluator.getVariable(this.id+".x");
    this.y = evaluator.getVariable(this.id+".y");
    var x = this.space.getAbsoluteX(this.x);
    var y = this.space.getAbsoluteY(this.y);
    
//     this.mouseCacher.style.left = parseInt(x-this._w/2)+"px";
//     this.mouseCacher.style.top = parseInt(y-this._h/2)+"px";
    this.mouseCacher.style.left = (x-this._w/2)+"px";
    this.mouseCacher.style.top = (y-this._h/2)+"px";
    
//     this.mouseCacher.setAttribute("style", "width: " +this._w+ "px; height: " +this._h+ "px; z-index: " + this.zIndex + ";");    
    this.mouseCacher.style.display = (evaluator.evalExpression(this.activeif) > 0) ? "block" : "none";
    
    ////////////////////////////////////////////////////////////////////////////
    if (this.constraint) {
      var cpos = this.newt.findZero(new descartesJS.R2(this.x, this.y));
      this.x = cpos.x;
      this.y = cpos.y;
      evaluator.setVariable(this.id+".x", this.x);
      evaluator.setVariable(this.id+".y", this.y);
    }
    ////////////////////////////////////////////////////////////////////////////

    this.draw();
  }

  /**
   * Dibuja el control
   */
  descartesJS.GraphicControl.prototype.draw = function() {
    var evaluator = this.evaluator;

    if (evaluator.evalExpression(this.drawif) > 0) {
      var ctx = this.ctx;
      var backCtx = this.space.backgroundCtx;
      var x = this.space.getAbsoluteX(this.x);
      var y = this.space.getAbsoluteY(this.y);
      
      if (this.text != "") {
        this.drawText(x, y);
      }
    
      // si el control no tiene imagen o aun no esta lista 
      if (!this.image.ready) {
        ctx.beginPath();
        ctx.arc(x, y, this.width/2, 0, PI2, false);
    
        ctx.fillStyle = descartesJS.getColor(evaluator, this.colorInt);
        ctx.fill();
      
        ctx.lineWidth = 1;
        ctx.strokeStyle = descartesJS.getColor(evaluator, this.color);
        ctx.stroke();
      
        if (this.active) {
          ctx.beginPath();
          ctx.arc(x, y, (this.width/2)-2, 0, PI2, false);
          ctx.strokeStyle = "black";
          ctx.stroke();
        }
      
        // si deja rastro el control
        if (this.trace) {
          backCtx.lineWidth = 1;
          backCtx.strokeStyle = descartesJS.getColor(evaluator, this.trace);
          backCtx.beginPath();
          backCtx.arc(x, y, this.width/2, 0, PI2, false);
          backCtx.stroke();
        }
      } 
      // si el control tiene imagen y ya esta lista
      else {
      	if (this.image.complete){
          ctx.drawImage(this.image, x-this.image.width/2, y-this.image.height/2);
        }
        
        // si deja rastro el control
        if (this.trace) {
          backCtx.save();
          backCtx.translate(x, y);
          backCtx.scale(this.image.width/2, this.image.height/2);

          backCtx.beginPath();
          backCtx.arc(0, 0, 1, 0, PI2, false);
          backCtx.restore();
        
          backCtx.lineWidth = 1;
          backCtx.strokeStyle = descartesJS.getColor(evaluator, this.trace);
          backCtx.stroke();
        }
      }
    }
    
  }

  /**
   * Dibuja el texto del control
   */
  descartesJS.GraphicControl.prototype.drawText = function(x, y) {
    var ctx = this.ctx;
    var evaluator = this.evaluator;
    
    ctx.fillStyle = descartesJS.getColor(evaluator, this.color);
    ctx.font = this.font;
    ctx.textBaseline = "alphabetic";

    var text = evaluator.evalExpression(this.text[0], evaluator.evalExpression(this.decimals), this.fixed);
    ctx.fillText(text, x+1+this.width/2, y-1-this.height/2);
  }

  /**
   * Agrega el control a un espacio y obtiene el contenedor del espacio
   * @return {<div>} se obtiene el contenedor del espacio que contiene al control
   */
  descartesJS.GraphicControl.prototype.getContainer = function() {
    var spaces = this.parent.spaces;
    var space_i;
    // si el control esta en un espacio interno
    for(var i=0, l=spaces.length; i<l; i++) {
      space_i = spaces[i];
      if (space_i.id == this.spaceID) {
        space_i.addCtr(this);
        this.zIndex = space_i.zIndex;
        return space_i.graphicControlContainer;
      }
    }
    
    // si no encuentra un espacio con el identificador registrado entonces el control se agrega al primer espacio de la leccion
    spaces[0].addCtr(this);
    this.zIndex = spaces[0].zIndex;
    return spaces[0].graphicControlContainer;
  }

  /**
   * Obtiene el espacio al cual pertenece el control grafico
   * return {Space} el espacio al cual pertenece el grafico
   */
  descartesJS.GraphicControl.prototype.getSpace = function() {
    var spaces = this.parent.spaces;
    for (var i=0, l=spaces.length; i<l; i++) {
      if (spaces[i].id == this.spaceID) {
        return spaces[i];
      }
    }
    // si no encuentra un espacio con el identificador registrado entonces el grafico se agrega al primer espacio de la leccion
    return spaces[0];
  }
  
  /**
   * Desactiva el control grafico
   */
  descartesJS.GraphicControl.prototype.deactivate = function() {
    this.active = false;
    this.evaluator.setVariable(this.id+".activo", 0);
  }  
  
  /**
   * Registran los eventos del mouse del boton
   */
  descartesJS.GraphicControl.prototype.registerMouseEvents = function() {
    this.click = false;
    this.over = false;
    this.active = false;
    
    this.mouseCacher.oncontextmenu = function () { return false; };
    
    var self = this;

    if (descartesJS.hasTouchSupport) {
      this.mouseCacher.addEventListener("touchstart", onTouchStart, false);
    } else {
      this.mouseCacher.addEventListener("mousedown", onMouseDown, false);
      this.mouseCacher.addEventListener("mouseover", onMouseOver, false);
      this.mouseCacher.addEventListener("mouseout", onMouseOut, false);
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de presionar un boton
     * @private
     */
    function onMouseDown(evt) {
      evt.preventDefault();

      // ie
      if (evt.which == null) {
        self.whichButton = (evt.button < 2) ? "LEFT" : ((evt.button == 4) ? "MIDDLE" : "RIGHT");
      } 
      // los demas
      else {
        self.whichButton = (evt.which < 2) ? "LEFT" : ((evt.which == 2) ? "MIDDLE" : "RIGHT");
      }

      if (self.whichButton == "LEFT") {
        if ((self.evaluator.evalExpression(self.activeif) > 0) && (self.over)) {
          
          self.parent.deactivateGraphiControls();
          self.click = true;
          self.active = true;
          self.evaluator.setVariable(self.id+".activo", 1);
          
          self.posAnte = self.getCursorPosition(evt);
          self.prePos = { x : self.space.getAbsoluteX(self.x), y : self.space.getAbsoluteY(self.y) };
          
          if (descartesJS.hasTouchSupport) {
            window.addEventListener("touchmove", onMouseMove, false);
            window.addEventListener("touchend", onMouseUp, false);
          } 
          else {
            window.addEventListener("mouseup", onMouseUp, false);
            window.addEventListener("mousemove", onMouseMove, false);
          }
        }
      }
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de presionar un boton
     * @private
     */
    function onTouchStart(evt) {
      evt.preventDefault();

      if (self.evaluator.evalExpression(self.activeif) > 0) {

        self.parent.deactivateGraphiControls();
        self.click = true;
        self.active = true;

        self.posAnte = self.getCursorPosition(evt);
        self.prePos = { x : self.space.getAbsoluteX(self.x), y : self.space.getAbsoluteY(self.y) };
        
        if (descartesJS.hasTouchSupport) {
          window.addEventListener("touchmove", onMouseMove, false);
          window.addEventListener("touchend", onMouseUp, false);
        } else {
          window.addEventListener("mouseup", onMouseUp, false);
          window.addEventListener("mousemove", onMouseMove, false);         
        }
      }
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de soltar un boton
     * @private
     */
    function onMouseUp(evt) {
      evt.preventDefault();

      if ((self.evaluator.evalExpression(self.activeif) > 0) || (self.active)) {
        self.click = false;

        if (descartesJS.hasTouchSupport) {
          window.removeEventListener("touchmove", onMouseMove, false);
          window.removeEventListener("touchend", onMouseUp, false);
        } else {
          window.removeEventListener("mouseup", onMouseUp, false);
          window.removeEventListener("mousemove", onMouseMove, false);
        }
        
        self.parent.update();
        
        self.mouseCacher.style.left = (self.space.getAbsoluteX(self.x)-self._w/2)+"px";
        self.mouseCacher.style.top = (self.space.getAbsoluteY(self.y)-self._h/2)+"px";
      }
    }
    
    /**
     * 
     * @param {Event}
     * @private
     */
    function onMouseMove(evt) {
      evt.preventDefault();

      var posNew = self.getCursorPosition(evt);

      self.posX = self.prePos.x - (self.posAnte.x - posNew.x);
      self.posY = self.prePos.y - (self.posAnte.y - posNew.y);
      
      ////////////////////////////////////////////////////////////////////////////
      if (self.constraint) {
        var tmpX = self.space.getRelativeX(self.posX);
        var tmpY = self.space.getRelativeY(self.posY);
        
        var cpos = self.newt.findZero(new descartesJS.R2(tmpX, tmpY));
        self.x = cpos.x;
        self.y = cpos.y;
        self.evaluator.setVariable(self.id+".x", self.x);
        self.evaluator.setVariable(self.id+".y", self.y);
      }
      ////////////////////////////////////////////////////////////////////////////
      else {
        self.evaluator.setVariable(self.id+".x", self.space.getRelativeX(self.posX));
        self.evaluator.setVariable(self.id+".y", self.space.getRelativeY(self.posY));
      }

      // se actualizan los controles
      self.parent.updateControls();

      self.parent.update();      
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de colocar el mouse sobre el boton
     * @private
     */
    function onMouseOver(evt) {
      self.over = true;
      self.mouseCacher.style.cursor = "pointer";
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de sacar el mouse del boton
     * @private
     */
    function onMouseOut(evt) {
      self.over = false;
      self.mouseCacher.style.cursor = "";
      self.click = false;
    }
    
    /**
     * 
     */
    function onBlur(evt) {
      console.log("en blur");
    }
    this.mouseCacher.addEventListener("blur", onBlur, false);
        
  }
  
  /**
   * Obtiene la posicion del mouse en coordenadas absolutas respecto al espacio donde se encuentra
   * @param {Event} evt evento que contiene la posicion del mouse
   * @return {Posicion} la posicion del mouse en coordenadas absolutas respecto al espacio donde se encuentra
   */
  descartesJS.GraphicControl.prototype.getCursorPosition = function(evt) {
    var pos = descartesJS.getCursorPosition(evt);
    return { x: pos.x - (this.space.container.offsetLeft + this.space.container.parentNode.offsetLeft),
             y: pos.y - (this.space.container.offsetTop + this.space.container.parentNode.offsetTop)
           };
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * Un control de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen un control de descartes
   */
  descartesJS.Control = function(parent, values) {
    /**
     * La aplicacion de descartes a la que corresponde el control
     * type DescartesApp
     * @private
     */
    this.parent = parent;
    this.evaluator = parent.evaluator;
    this.parser = parent.evaluator.parser;
    var parser = this.parser;

    /**
     * El identificador del control
     * type String
     * @private
     */
    this.id = "C";

    /**
     * El tipo del control, si es numero o grafico 
     * type String
     * @private
     */
    this.type = "";

    /**
     * El tipo de interfaz del control
     * type String
     * @private
     */
    this.gui = "";
    
    /**
     * La region donde se dibuja el control
     * type String
     * @private
     */
    this.region = "south";

    /**
     * Nombre del espacio al cual pertenece el control
     * type String
     * @private
     */
//     this.space = "E0";

    /**
     * Texto que presenta el control
     * type String
     * @private
     */
//     this.name = "";
    
    /**
     * La posicion en x del control
     * type Number
     * @private
     */
    this.x = 0;

    /**
     * La posicion en y del control
     * type Number
     * @private
     */
    this.y = 0;

    /**
     * El ancho del control
     * type Number
     * @private
     */
    this.w = 100;

    /**
     * El alto del control
     * type Number
     * @private
     */
    this.h = 23;

    /**
     * Expresion que determina la posicion y el tamanio del control
     * type String
     * @private
     */
    if (values.type != "text") {
      this.expresion = parser.parse("(0,0,100,23)");
    } else {
      this.expresion = parser.parse("(0,0,300,200)");
      this.w = 300;
      this.h = 200;
    }

    /**
     * La condicion para determinar si los numeros del control utilizan notacion fija
     * type Boolean
     * @private
     */
    this.fixed = (this.parent.version != 2) ? false : true;

    /**
     * La condicion para determinar ???
     * type Boolean
     * @private
     */     
    this.visible = true;

    /**
     * El color del texto del control
     * type String
     * @private
     */
    this.color = "#222222";

    /**
     * El color del control
     * type String
     * @private
     */
    this.colorInt = "#f0f8ff";

    /**
     * El texto del control en negritas
     * type String
     * @private
     */
    this.bold = "";

    /**
     * El texto del control en italicas
     * type String
     * @private
     */
    this.italics = "";

    /**
     * El texto del control subrayado
     * type String
     * @private
     */
    this.underlined = "";

    /**
     * El tamanio de la tipografia del texto del control
     * type Number
     * @private
     */
    this.font_size = parser.parse("12");
    
    /**
     * La imagen del control
     * type Image
     * @private
     */
    this.image = new Image();
    var tmpThis = this;
    this.image.onload = function() {
      this.ready = 1;
    }

    /**
     * El nombre del archivo de la imagen de fondo del espacio
     * type String
     * @private
     */
    this.imageSrc = "";
    
    /**
     * La imagen del control en over
     * type Image
     * @private
     */
    this.imageOver = new Image();
    this.imageOver.onload = function() {
      this.ready = 1;
    }

    /**
     * La imagen del control presionado
     * type Image
     * @private
     */
    this.imageDown = new Image();
    this.imageDown.onload = function() {
      this.ready = 1;
    }

    /**
     * El tipo de accion del control
     * type String
     * @private
     */
    this.action = "";

    /**
     * El parametro de la accion del control
     * type String
     * @private
     */
    this.parameter = "";

    /**
     * La tipografia del parametro de la accion del control
     * type String
     * @private
     */
    this.parameterFont = "Monospace 12px";
    
    /**
     * La condicion de dibujado del control
     * type Boolean
     * @private
     */
    this.drawif = parser.parse("1");
    
    /**
     * La condicion de activacion del control
     * type Boolean
     * @private
     */
    this.activeif = parser.parse("1");

    /**
     * El mensaje de ayuda del control
     * type String
     * @private
     */
    this.tooltip = "";

    /**
     * La tipografia del mensaje de ayuda del control
     * type String
     * @private
     */
    this.tooltipFont = "Monospace 12px";

    /**
     * El mensaje de explicacion del control
     * type String
     * @private
     */
    this.Explanation = "";

    /**
     * La tipografia del mensaje de explicacion del control
     * type String
     * @private
     */
    this.ExplanationFont = "Monospace 12px";

    /**
     * La posicion del mensaje de explicacion del control
     * type String
     * @private
     */
    this.msg_pos = "";
    /**
     * La cID del espacio
     * type String
     * @private
     */    
    this.cID = "";
    
    /**
     * El valor inicial del control (pulsador)
     * type String
     * @private
     */    
    this.valueExpr = parser.parse("0");

    /**
     * El numero de decimales a mostrar en el control
     * type Number
     * @private
     */
    this.decimals = parser.parse("2");

    /**
     * El numero minimo que puede obtener el valor del control
     * type Number
     * @private
     */
    this.min = parser.parse("-Infinity");

    /**
     * El numero maximo que puede obtener el valor del control
     * type Number
     * @private
     */
    this.max = parser.parse("Infinity");

    /**
     * El incremento del valor del control
     * type Number
     * @private
     */
    this.incr = parser.parse("0.1");

    /**
     * La condicion para que el incrementeo del valor del control sea discreto
     * type Number
     * @private
     */
    this.discrete = false;

    /**
     * La condicion para mostrar el valor del control en notacion exponencial
     * type Boolean
     * @private
     */
    this.exponentialif = false;
    
    /**
     * Indice z del control
     * @type {number}
     * @private 
     */
    this.zIndex = -1;
    
    // se recorre values para reemplazar los valores iniciales del control
    for (var propName in values) {
      // solo se verifican las propiedades propias del objeto values
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }

    // ## parche para la version 2 ## //
    if (this.name == undefined) {
      if (this.parent.version == 2) {
        this.name = this.id;
      }
      else {
        this.name = "_nada_"
      }
    }

    var expr = this.evaluator.evalExpression(this.expresion);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      this.w = expr[0][2];
      this.h = expr[0][3];
    }
    
    this.name = ((this.name == "_._") || (this.name == "_nada_") || (this.name == "_void_")) ? "" : this.name;
    
    this.actionExec = this.parent.lessonParser.parseAction(this);
  }
  
  /**
   * Inicia el control
   */
  descartesJS.Control.prototype.init = function() { }

  /**
   * Actualizan los valores del control
   */
  descartesJS.Control.prototype.update = function() { }

  /**
   * Dibuja el control
   */
  descartesJS.Control.prototype.draw = function() { }

  /**
   * Agrega el control a un espacio y obtiene el contenedor del espacio
   * @return {<div>} se obtiene el contenedor del espacio que contiene al control
   */
  descartesJS.Control.prototype.getContainer = function() {
    var spaces = this.parent.spaces;
    var space_i;
    // si el control esta en un espacio interno
    if (this.region == "interior") {
      for(var i=0, l=spaces.length; i<l; i++) {
        space_i = spaces[i];
        if (space_i.id == this.spaceID) {
          space_i.addCtr(this);
          this.zIndex = space_i.zIndex;
          return space_i.numericalControlContainer;
        }
      }
    }

    // si el control esta en la region externa
    else if (this.region == "external") {
      return this.parent.externalSpace.container;
    }
    // si el control esta en el escenario
    else if (this.region == "scenario") {
      // si tienen un cID asociado, entones si se dibujan en el escenario
      if (this.cID) {
        this.expresion = this.evaluator.parser.parse("(0,-1000," + this.w + "," + this.h + ")");
        this.parent.scenarioRegion.scenarioSpace.addCtr(this);
        this.zIndex = this.parent.scenarioRegion.scenarioSpace.zIndex;
        return this.parent.scenarioRegion.scenarioSpace.numericalControlContainer;
      }
      // si no tienen un cID asociado, entonces se agregan a la region exterior
      else {
        return this.parent.externalSpace.container;
      }

    }
    // si el control esta en la region norte
    else if (this.region == "north") {
      this.parent.northSpace.controls.push(this);
      return this.parent.northSpace.container;
    }
    // si el control esta en la region sur
    else if (this.region == "south") {
      this.parent.southSpace.controls.push(this);
      return this.parent.southSpace.container;
    }
    // si el control esta en la region este
    else if (this.region == "east") {
      this.parent.eastSpace.controls.push(this);
      return this.parent.eastSpace.container;
    }
    // si el control esta en la region oeste
    else if (this.region == "west") {
      this.parent.westSpace.controls.push(this);
      return this.parent.westSpace.container;
    }
    // si es el boton creditos, config, inicio o limpiar
    else if (this.region == "special") {
      this.parent.specialSpace.controls.push(this);
      return this.parent.specialSpace.container;
    }

    // si no encuentra un espacio con el identificador registrado entonces el control se agrega al primer espacio de la leccion
    spaces[0].addCtr(this);
    this.zIndex = spaces[0].zIndex;
    return spaces[0].numericalControlContainer;
  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;

  /**
   * Un boton de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el boton
   */
  descartesJS.Button = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Control.call(this, parent, values);

    // modificacion para hacer que el boton sea mas configurable y pueda recibir su nombre de una variable
    if ((this.name.charAt(0) == "[") && (this.name.charAt(this.name.length-1))) {
      this.name = this.parser.parse(this.name.substring(1, this.name.length-1));
    }
    else {
      this.name = this.parser.parse("'" + this.name + "'");
    }
    
    // colores en el formato
    // _COLORES_ffffff_000000_P_22
    // en el campo de la imagen, el primer color especifica el fondo del boton, el segundo especifica el color del texto y el ultimo numerp especifica el tamaño de la fuente.
    var tmpParam;
    if (this.imageSrc.match("_COLORES_")) {
      tmpParam = this.imageSrc.split("_");
      this.colorInt = tmpParam[2];
      this.color = tmpParam[3];
      this.font_size = this.parser.parse(tmpParam[5]);
      this.imageSrc = "";
    }

    // modificacion para hacer que el boton sea mas configurable y pueda recibir el nombre de la imagen a mostrar desde una variable
    if ((this.imageSrc.charAt(0) == "[") && (this.imageSrc.charAt(this.imageSrc.length-1))) {
      this.imageSrc = this.parser.parse(this.imageSrc.substring(1, this.imageSrc.length-1));
    }
    else {
      this.imageSrc = this.parser.parse("'" + this.imageSrc + "'");
    }
    
    // si el boton tiene una imagen asignada entonces se carga y se intenta asociar las imagenes de over y down correspondientes
    var imageSrc = this.evaluator.evalExpression(this.imageSrc).trim();
    if (imageSrc != "") {
      var prefix = imageSrc.substr(0, imageSrc.lastIndexOf("."));
      var sufix  = imageSrc.substr(imageSrc.lastIndexOf("."));

      // la imagen es vacia
      if (imageSrc.toLowerCase().match(/vacio.gif$/)) {
        this.image.ready = 1;
        // si la leccion es de Descartes 3, entonces como la imagen es una imagen vacia el nombre no se dibuja, para las demas versiones si se dibuja
        if (this.parent.version == 3) {
//           this.name = "";
          this.name = this.parser.parse('');
        }
        imageSrc = this.parser.parse("'vacio.gif'");
      } 
      // la imagen no es vacia
      else {
        this.image = this.parent.getImage(imageSrc);
        this.imageOver =  this.parent.getImage(prefix + "_over" + sufix);
        this.imageDown =  this.parent.getImage(prefix + "_down" + sufix);
//         this.imageOver.src =  prefix + "_over" + sufix;
//         this.imageDown.src =  prefix + "_down" + sufix;
      }
    }
    
    // se obtiene el contenedor al cual pertenece el control
    var container = this.getContainer();

    // se crea el canvas, se obtiene el contexto de render y se agrega el canvas al contenedor
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("class", "DescartesButton");
    this.canvas.setAttribute("id", this.id);
    this.canvas.setAttribute("width", this.w+"px");
    this.canvas.setAttribute("height", this.h+"px");
    this.canvas.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    this.canvas.style.display = (this.evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";

    this.ctx = this.canvas.getContext("2d");

    // se agrega el contenedor del boton al contenedor del espacio, en orden inverso al que aparecen listados
    if (!container.childNodes[0]) {
      container.appendChild(this.canvas);
    } else {
      container.insertBefore(this.canvas, container.childNodes[0]);
    }

    // se registran los eventos del mouse, cuando se de soporte a dispositivos moviles se deben de registrar los eventos correspondientes
    this.registerMouseEvents();

    // se inician los parametros del boton
    this.init();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Button, descartesJS.Control);

  /**
   * Inicia el boton
   */
  descartesJS.Button.prototype.init = function() {
    var canvas = this.canvas;
    var expr = this.evaluator.evalExpression(this.expresion);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      this.w = parseInt(expr[0][2]);
      this.h = parseInt(expr[0][3]);
    }
    
    canvas.setAttribute("width", this.w+"px");
    canvas.setAttribute("height", this.h+"px");
    canvas.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");

    this.createGradient(this.w, this.h);
    this.draw();
  }
  
  /**
   * Actualiza el boton
   */
  descartesJS.Button.prototype.update = function() {
    var changeX = false;
    var changeY = false;
    var changeW = false;
    var changeH = false;

    // se actualiza si el boton es visible o no
    if (this.evaluator.evalExpression(this.drawif) > 0) {
      this.canvas.style.display = "block";
      this.draw();
    } else {
      this.click = false;
      this.canvas.style.display = "none";
    }    

    this.evaluator.evalExpression(this.activeif);
    
    // se actualiza la poscion y el tamano del boton
    var expr = this.evaluator.evalExpression(this.expresion);
    changeX = (this.x != expr[0][0]);
    changeY = (this.y != expr[0][1]);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      changeW = (this.w != expr[0][2]);
      changeH = (this.h != expr[0][3]);
      this.w = expr[0][2];
      this.h = expr[0][3];
    }

    // si cambio el ancho o el alto del boton se calcula de nuevo el gradiente
    if (changeW || changeH) {
      this.createGradient(this.canvas.width, this.canvas.height);
    }

    // se actualiza el estilo del boton si cambia su tamano o su posicion
    if (changeW || changeH || changeX || changeY) {
      this.canvas.setAttribute("width", this.w+"px");
      this.canvas.setAttribute("height", this.h+"px");
      this.canvas.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
      this.draw();
    }

  }
  
  /**
   * Crea un gradiente lineal para el boton
   * @param {Number} w es el ancho del canvas sobre el cual se quiere crear el gradiente lineal
   * @param {Number} h es el alto del canvas sobre el cual se quiere crear el gradiente lineal
   */
  descartesJS.Button.prototype.createGradient = function(w, h) {
    this.linearGradient = this.ctx.createLinearGradient(0, 0, 0, h);
    var hh = h*h;
    var di;
    
    for (var i=0; i<h; i++) {
      di = MathFloor(i-(35*h)/100);
      this.linearGradient.addColorStop(i/h, "rgba(0,0,0,"+ ((di*di*192)/hh)/255 +")");
    }
  }
  /**
   * Dibuja el boton
   */
  descartesJS.Button.prototype.draw = function() {
    var font_size = this.evaluator.evalExpression(this.font_size);
    var name = this.evaluator.evalExpression(this.name);
    var imageSrc = this.evaluator.evalExpression(this.imageSrc);
    var image;
    if (imageSrc == "vacio.gif") {
      image = {ready: true};
    }
    else {
      image = this.parent.getImage(imageSrc);
    }
    
    var ctx = this.ctx;

    ctx.clearRect(0, 0, this.w, this.h);

    // desplazamiento para que parezca que el texto se mueve cuando se presiona el boton
    var despX = 0, despY = 0;
    if (this.click) {
      despX = 1;
      despY = 1;
    }
    
//     if (this.image.ready) {      
    if ((image) && (image.ready)) {
//       if ( ((this.image.src != "") || (!this.imageSrc.toLowerCase().match(/vacio.gif$/))) && (this.image.complete)) {
      if ( ((image.src != "") || (!imageSrc.toLowerCase().match(/vacio.gif$/))) && (image.complete) ) {
//         ctx.drawImage(this.image, (this.w-this.image.width)/2+despX, (this.h-this.image.height)/2+despY);
        ctx.drawImage(image, (this.w-image.width)/2+despX, (this.h-image.height)/2+despY);
      }
    }
    
    else {
      ctx.fillStyle = descartesJS.getColor(this.evaluator, this.colorInt);
      ctx.fillRect(0, 0, this.w, this.h);

      if (!this.click) {
        descartesJS.drawLine(ctx, this.w-1, 0, this.w-1, this.h, "rgba(0,0,0,"+(0x80/255)+")");
        descartesJS.drawLine(ctx, 0, 0, 0, this.h, "rgba(0,0,0,"+(0x18/255)+")");
        descartesJS.drawLine(ctx, 1, 0, 1, this.h, "rgba(0,0,0,"+(0x08/255)+")");
      }
      
      ctx.fillStyle = this.linearGradient;
      ctx.fillRect(0, 0, this.w, this.h);
    }
    
    if ((this.imageOver.src != "") && (this.imageOver.ready) && (this.over)) {
//       ctx.drawImage(this.imageOver, (this.w-this.image.width)/2+despX, (this.h-this.image.height)/2+despY);
      ctx.drawImage(this.imageOver, (this.w-image.width)/2+despX, (this.h-image.height)/2+despY);
    }

    if ((this.imageDown.src != "") && (this.imageDown.ready) && (this.click)){
//       ctx.drawImage(this.imageDown, (this.w-this.image.width)/2+despX, (this.h-this.image.height)/2+despY);
      ctx.drawImage(this.imageDown, (this.w-image.width)/2+despX, (this.h-image.height)/2+despY);
    } 
    
    else if (this.click) {
      ctx.save();
      descartesJS.drawLine(ctx, 0, 0, 0, this.h-2, "gray");
      descartesJS.drawLine(ctx, 0, 0, this.w-1, 0, "gray"); 

      ctx.fillStyle = "rgba(0, 0, 0,"+(0x18/255)+")";
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.restore();
    }
      
    ctx.fillStyle = descartesJS.getColor(this.evaluator, this.color);
    ctx.font = this.italics + " " + this.bold + " " + font_size + "px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // borde alrededor del texto
    ctx.strokeStyle = descartesJS.getColor(this.evaluator, this.colorInt);
    ctx.lineWidth = font_size/12;
    if (this.stroke != this.fillStyle) {
//       ctx.strokeText(this.name, MathFloor(this.w/2 + despX)+.5, MathFloor(this.h/2 + despY)+.5);
      ctx.strokeText(name, MathFloor(this.w/2 + despX)+.5, MathFloor(this.h/2 + despY)+.5);
    }

    // se escribe el nombre del boton
//     ctx.fillText(this.name, MathFloor(this.w/2 + despX)+.5, MathFloor(this.h/2 + despY)+.5);
    ctx.fillText(name, MathFloor(this.w/2 + despX)+.5, MathFloor(this.h/2 + despY)+.5);

    if (this.underlined) {
//       var txtW = ctx.measureText(this.name).width;
      var txtW = ctx.measureText(name).width;
      ctx.strokeStyle = descartesJS.getColor(this.evaluator, this.color);
      ctx.lineWidth = MathFloor(font_size/10);
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo( (this.w-txtW)/2 + despX, MathFloor(this.h + font_size)/2 + ctx.lineWidth/2 - 1.5 + despY );
      ctx.lineTo( (this.w+txtW)/2 + despX, MathFloor(this.h + font_size)/2 + ctx.lineWidth/2 - 1.5 + despY );
      ctx.stroke();
    }
     
    if (!this.evaluator.evalExpression(this.activeif)) {
      ctx.fillStyle = "rgba(" + 0xf0 + "," + 0xf0 + "," + 0xf0 + "," + (0xa0/255) + ")";
      ctx.fillRect(0, 0, this.w, this.h);
    }
    
//     ctx.restore();
  }
  
  /**
   * Ejecuta la accion del boton y actualiza
   */
  descartesJS.Button.prototype.bottonPressed = function() {
//     this.evaluator.setVariable(this.id, 0);
    // se actualizan los controles
    this.parent.updateControls();    
    // ejecutamos la accion
    if (this.action == "init") {
      this.click = false;
    } 

    this.actionExec.execute();

    // se actualizan los controles
    this.parent.updateControls();

    // si la accion es animar, entonces no se actualizan los elementos
    if (this.action != "animate") {
      // se actualizan los valores
      this.parent.update();
    }
  }
  
  /**
   * Registra los eventos del mouse del boton
   */
  descartesJS.Button.prototype.registerMouseEvents = function() {
    var hasTouchSupport = descartesJS.hasTouchSupport;
    
    this.canvas.oncontextmenu = function () { return false; };
    
    // copia de this para ser pasado a las funciones internas
    var self = this;
    var delay = 900;
    var timer;

    /**
     * Se repite durante un determinado tiempo una funcion, sirve para repedir incrementos o decrementos en el boton al dejar presionado alguno de los botones
     * @param {Number} delayTime el tiempo que se debe esperar antes de ejectuar de nuevo la funcion
     * @param {Number} fun la funcion a ejecutar
     * @private
     */
    function repeat(delayTime, fun, firstTime) {
      if (self.click) {
        fun.call(self);
//         delayTime = (delayTime < 30) ? 30 : delayTime-200;
        delayTime = (firstTime) ? delayTime : 30;
        timer = setTimeout(function() { repeat(delayTime, fun); }, delayTime);
      } else {
        clearInterval(timer);
      }
    }

    
    this.click = false;
    this.over = false;
    
    if (hasTouchSupport) {
      this.canvas.addEventListener("touchstart", onMouseDown, false);
    } else {
      this.canvas.addEventListener("mousedown", onMouseDown, false);
      this.canvas.addEventListener("mouseover", onMouseOver, false);
      this.canvas.addEventListener("mouseout", onMouseOut, false);
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de presionar un boton
     * @private
     */
    function onMouseDown(evt) {
      evt.preventDefault();

      // ie
      if (evt.which == null) {
        self.whichButton = (evt.button < 2) ? "LEFT" : ((evt.button == 4) ? "MIDDLE" : "RIGHT");
      } 
      // los demas
      else {
        self.whichButton = (evt.which < 2) ? "LEFT" : ((evt.which == 2) ? "MIDDLE" : "RIGHT");
      }

      if (self.whichButton == "LEFT") {
        if (self.evaluator.evalExpression(self.activeif) > 0) {
          self.click = true;
          
          self.draw();
          
          // se registra el valor de la variable
          self.evaluator.setVariable(self.id, self.evaluator.evalExpression(self.valueExpr));

          if (self.action == "calculate") {
            repeat(delay, self.bottonPressed, true);
          }
          
          if (hasTouchSupport) {
            window.addEventListener("touchend", onMouseUp, false);
          } else {
            window.addEventListener("mouseup", onMouseUp, false);

          }
        }
      }
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de soltar un boton
     * @private
     */
    function onMouseUp(evt) {
      if ((self.evaluator.evalExpression(self.activeif) > 0) || (self.click)) {
        self.click = false;
        self.draw();
        
        if (self.action != "calculate") {
          self.bottonPressed();
        }
        
        evt.preventDefault();

        if (hasTouchSupport) {
          window.removeEventListener("touchend", onMouseUp, false);
        } else {
          window.removeEventListener("mouseup", onMouseUp, false);
        }
      }
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de colocar el mouse sobre el boton
     * @private
     */
    function onMouseOver(evt) {
      self.over = true;
      self.draw();
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de sacar el mouse del boton
     * @private
     */
    function onMouseOut(evt) {
      self.over = false;
      self.click = false;
      self.draw();
    }
  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var decimals;

  /**
   * Un pulsador de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el pulsador
   */
  descartesJS.Spinner = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Control.call(this, parent, values);

    // el indice de tabulacion del campo de texto, que determina el orden en el que se salta cuando se presiona el tabulador
    this.tabindex = ++this.parent.tabindex;

    // contenedor del espacio
    var container = this.getContainer();
    
    // contenedor del control
    this.containerControl = document.createElement("div");
    this.canvas = document.createElement("canvas");
    this.divUp = document.createElement("div");
    this.divDown = document.createElement("div");
    this.field = document.createElement("input");
    this.label = document.createElement("label");

    // el texto de la etiqueta
    this.txtLabel = document.createTextNode(this.name);

    //se agrega el texto a la etiqueta
    this.label.appendChild(this.txtLabel);

    // se agregan todos los elementos del pulsador a un contenedor
    if (this.name.trim() != "") {
      this.containerControl.appendChild(this.label);
    }
    this.containerControl.appendChild(this.field);
    this.containerControl.appendChild(this.canvas);
    this.containerControl.appendChild(this.divUp);
    this.containerControl.appendChild(this.divDown);

    // por ultimo se agrega el contenedor del pulsador al contenedor del espacio, en orden inverso al que aparecen listados
    if (!container.childNodes[0]) {
      container.appendChild(this.containerControl);
    } else {
      container.insertBefore(this.containerControl, container.childNodes[0]);
    }

    // caso cuando el numero de decimales es negativo o cero
    this.originalIncr = this.incr;
    if (this.evaluator.evalExpression(this.decimals) <= 0) {
      var tmpIncr = this.evaluator.evalExpression(this.incr);

      if (tmpIncr > 0) {
        this.incr = this.evaluator.parser.parse(parseInt(tmpIncr).toString());
        this.originalIncr = this.incr;
      }
      else {
        this.incr = this.evaluator.parser.parse("1");
      }
    }

    this.init();

    // se registran los eventos del mouse, cuando se de soporte a dispositivos moviles se deben de registrar los eventos correspondientes
    this.registerMouseEvents();

    this.draw();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Spinner, descartesJS.Control);

  /**
   * Inicia los valores del pulsador
   */
  descartesJS.Spinner.prototype.init = function() {
    var evaluator = this.evaluator;

    // se valida el valor inicial del pulsador
    this.value = this.validateValue( evaluator.evalExpression(this.valueExpr) );
    
    // se calcula la longitud de la cadena mostrada en el campo de texto del pulsador
    var fieldValue = this.formatOutputValue(this.value);

    // se calcula el tamanio de la fuente del campo de texto del pulsador
//     this.fieldFontSize = (88.8*((this.h)/100));
    this.fieldFontSize = (this.parent.version != 2) ? descartesJS.getFieldFontSize(this.h) : 10;
    var extraSpace = (this.parent.version != 2) ? "" : "mmmmm";
    
    var fieldValueSize = descartesJS.getTextWidth(fieldValue+"m", this.fieldFontSize+"px Arial");

    // se calculan los anchos de cada elemento dentro del pulsador
    var canvasWidth = 2 + this.h/2;
    var labelWidth = this.w/2 - canvasWidth/2;
    var minTFWidth = fieldValueSize;
    var minLabelWidth = descartesJS.getTextWidth(this.name+extraSpace, this.fieldFontSize+"px Arial");
    
    if (!this.visible) {
      labelWidth = this.w - canvasWidth;
      minTFWidth = 0;
    }

    if (labelWidth < minLabelWidth) {
      labelWidth = minLabelWidth;
    }
    
    if (this.name == "") {
      labelWidth = 0;
    }
    
    if (this.w-labelWidth-canvasWidth < minTFWidth) {
      labelWidth = this.w - canvasWidth - minTFWidth;
    }
    
    if (labelWidth < 0) {
      labelWidth=0;
    }

    var fieldWidth = this.w - (labelWidth + canvasWidth);

    this.containerControl.setAttribute("class", "DescartesSpinnerContainer");
    this.containerControl.setAttribute("style", "width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    this.containerControl.style.display = (evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
  
    this.canvas.setAttribute("width", canvasWidth+"px");
    this.canvas.setAttribute("height", this.h+"px");
    this.canvas.setAttribute("style", "position: absolute; left: " + labelWidth + "px; top: 0px;");
    this.ctx = this.canvas.getContext("2d");
    
    this.divUp.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + canvasWidth + "px; height : " + this.h/2 + "px; left: " + labelWidth + "px; top: 0px;");
    this.divDown.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + canvasWidth + "px; height : " + this.h/2 + "px; left: " + labelWidth + "px; top: " + this.h/2 + "px;");

    // se crea el campo de texto del pulsador
    this.field.setAttribute("type", "text");
    this.field.setAttribute("id", this.id+"_spinner");
    this.field.value = fieldValue;
    this.field.setAttribute("class", "DescartesSpinnerField");
    this.field.setAttribute("style", "font-family: Arial; font-size: " + this.fieldFontSize + "px; width : " + (fieldWidth-2) + "px; height : " + (this.h-2) + "px; left: " + (canvasWidth + labelWidth) + "px;");
    this.field.setAttribute("tabindex", this.tabindex);
    // this.field.disabled = (evaluator.evalExpression(this.activeif) > 0) ? false : true;
    this.field.disabled = (activeif) ? false : true;

    // se crea la etiqueta correspondiente al pulsador
    this.label.setAttribute("class", "DescartesSpinnerLabel");
    this.label.setAttribute("style", "font-size:" + this.fieldFontSize + "px; width: " + labelWidth + "px; height: " + this.h + "px; line-height: " + this.h + "px;");
    // el texto de la etiqueta
//     this.txtLabel = document.createTextNode(this.name);
    
    // se registra el valor de la variable
    evaluator.setVariable(this.id, this.value);
    
    // se crea el gradiente de fondo que tiene el pulsador
    this.createGradient(this.h/2, this.h);    
  }

  var changeX;
  var changeY;
  var changeW;
  var changeH;
  var activeif = 0;
  
  /**
   * Actualiza el pulsador
   */
  descartesJS.Spinner.prototype.update = function() {    
    var evaluator = this.evaluator;

    if (evaluator.evalExpression(this.decimals) <= 0) {
      var tmpIncr = this.evaluator.evalExpression(this.incr);

      if (tmpIncr > 0) {
        this.incr = this.evaluator.parser.parse(parseInt(tmpIncr).toString());
        this.originalIncr = this.incr;
      }
      else {
        this.incr = this.evaluator.parser.parse("1");
      }
    } 
    else {
      this.incr = this.originalIncr;
    }

    changeX = false;
    changeY = false;
    changeW = false;
    changeH = false;
    
    // se actualiza la propiedad de activacion
    activeif = (evaluator.evalExpression(this.activeif) > 0);
    this.field.disabled = (activeif) ? false : true;
    
    // se actualiza si el pulsador es visible o no
    if (evaluator.evalExpression(this.drawif) > 0) {
      this.containerControl.style.display = "block"
      this.draw();
    } else {
      this.click = false;
      this.containerControl.style.display = "none";
    }

    // se actualiza la poscion y el tamano del pulsador
    var expr = evaluator.evalExpression(this.expresion);
    changeX = (this.x != expr[0][0]);
    changeY = (this.y != expr[0][1]);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      changeW = (this.w != expr[0][2]);
      changeH = (this.h != expr[0][3]);
      this.w = expr[0][2];
      this.h = expr[0][3];
    }

    // si cambio el ancho o el alto del pulsador se calcula de nuevo el gradiente
    if (changeW || changeH) {
      this.createGradient(this.canvas.width, this.canvas.height);
    }

    var oldFieldValue = this.field.value;
    var oldValue = this.value;
    
    // se actualiza el valor del pulsador
    this.value = this.validateValue( evaluator.getVariable(this.id) );
    this.field.value = this.formatOutputValue(this.value);

    if ((this.value == oldValue) && (this.field.value != oldFieldValue)) {
      // se actualiza el valor del pulsador
      this.value = this.validateValue( oldFieldValue );
      this.field.value = this.formatOutputValue(this.value);
    }
    
    // se actualiza el estilo del pulsador si cambia su tamano o su posicion
    if (changeW || changeH || changeX || changeY) {
      this.init();
      this.draw();
    }
    
    // se registra el valor de la variable
    evaluator.setVariable(this.id, this.value);
  }

  /**
   * Crea un gradiente lineal para el fondo de los botones del pulsador
   * @param {Number} w es el ancho del canvas sobre el cual se quiere crear el gradiente lineal
   * @param {Number} h es el alto del canvas sobre el cual se quiere crear el gradiente lineal
   */
  descartesJS.Spinner.prototype.createGradient = function(w, h) {
    this.linearGradient = this.ctx.createLinearGradient(0, 0, 0, h);
    var hh = h*h;
    var di;
    for (var i=0; i<h; i++) {
      di = Math.floor(i-(40*h)/100);
      this.linearGradient.addColorStop(i/h, "rgba(0,0,0,"+ ((di*di*192)/hh)/255 +")");
    }
  }

  /**
   * Dibuja el pulsador
   */
  descartesJS.Spinner.prototype.draw = function() {
    var ctx = this.ctx;

    var w = this.canvas.width;
    var h = this.canvas.height
    
    ctx.save();

    ctx.fillStyle = "#f0f8ff";
    ctx.fillRect(0, 0, w, h);
    
    ctx.fillStyle = this.linearGradient;
    ctx.fillRect(0, 0, w, h);
    
    var c1, c2;
    
    // se dibuja las lineas superiores para dar la sensacion de profundidad
    if (this.up) {
      c1 = "gray";
      c2 = "#f0f8ff";
    } else {
      c1 = "#f0f8ff";
      c2 = "gray";
    }
    
    descartesJS.drawLine(ctx, 0, 0, w, 0, c1);
    descartesJS.drawLine(ctx, 0, 0, 0, h/2, c1);
    descartesJS.drawLine(ctx, 0, h/2, w, h/2, c2);
//    descartesJS.drawLine(ctx, w-1, 0, w-1, h/2, c2);
    
    // se dibuja las lineas inferiores para dar la sensacion de profundidad
    if (this.down) {
      c1 = "gray";
      c2 = "#f0f8ff";
    } else {
      c1 = "#f0f8ff";
      c2 = "gray";
    }
    
    descartesJS.drawLine(ctx, 0, h/2+1, w, h/2+1, c1);
    descartesJS.drawLine(ctx, 0, h/2+1, 0, h, c1);
    descartesJS.drawLine(ctx, 0, h-1, w, h-1, c2);
//    descartesJS.drawLine(ctx, w-1, h/2+1, w-1, h-1, c2);
    
    var triaX = [w/2, w/5-1, w-w/5+1];
    var triaY = [h/8+1, h/8+1+h/4, h/8+1+h/4];
    
    // var activeif = (this.evaluator.evalExpression(this.activeif) > 0);
    
    // se dubuja el triangulo superior
    fillPolygon(ctx, triaX, triaY, (activeif) ? "#2244cc" : "#8888aa");
    
    triaY = [h-h/8, h-h/8-h/4, h-h/8-h/4];

    // se dubuja el triangulo inferior
    fillPolygon(ctx, triaX, triaY, (activeif) ? "#d00018" : "#aa8888");

    // se dibuja otra capa sobre el control
    ctx.fillStyle = "rgba(0,0,0,"+ 24/255 +")";
    if (this.up) { 
      ctx.fillRect(0, 0, w, h/2);
    }
    if (this.down) { 
      ctx.fillRect(0, h/2, w, h); 
    }
  }
  
  /**
   * Valida si el valor que se le pasa esta en el rango determinado por los limites (minimo y maximo)
   * @param {String} value es el valor que se desea validar
   * @return {Number} regresa el valor que recibe como argumento si este se encuentra en dentro de los limites
   *                  si el valor es mayor que el limite maximo entonces se regresa el valor maximo
   *                  si el valor es menor que el limite minimo entonces se regresa el valor minimo
   */
  descartesJS.Spinner.prototype.validateValue = function(value) {
    var evaluator = this.evaluator;
    
    var resultValue = parseFloat( evaluator.evalExpression( evaluator.parser.parse(value.toString().replace(this.parent.decimal_symbol, ".")) ) );

    // si el valor es una cadena que no representa un numero, la funcion parseFloat regresa NaN, entonces se ocupa el valor minimo
    if (!resultValue) {
      resultValue = 0; 
    }

    // si es menor que el valor minimo
    if (resultValue < evaluator.evalExpression(this.min)) {
      resultValue = evaluator.evalExpression(this.min);
    } 
    
    // si es mayor que el valor maximo
    if (resultValue > evaluator.evalExpression(this.max)) {
      resultValue = evaluator.evalExpression(this.max);
    }

    if (this.discrete) {
      var incr = evaluator.evalExpression(this.incr);
      resultValue = (incr==0) ? 0 : (incr * Math.round(resultValue / incr));
    }

    decimals = evaluator.evalExpression(this.decimals);
    if (decimals <= 0) {
      decimals = 0;
    }
    resultValue = parseFloat(parseFloat(resultValue).toFixed(decimals));
    
    return resultValue;
  }

  /**
   * El valor que se le pasa es formateado, mostrando los valores exponenciales, 
   * los decimales y el signo de puntuacion utilizado como separador de decimales
   * @param {String} value es el valor que se quiere formatear
   * @return {String} regresa el valor ya formateado
   */
  descartesJS.Spinner.prototype.formatOutputValue = function(value) {
    // se convierte en cadena
    var resultValue = value+"";

    var indexDot = resultValue.indexOf(".");
    if ( indexDot != -1 ) {
      var subS = resultValue.substring(indexDot+1);
        if (subS.length > decimals) {
        resultValue = parseFloat(resultValue).toFixed(decimals);
      }
    }
    
    if (this.fixed) {
      // ## parche para la version 2 ## //
      // si la version es diferente a la 2, entonces el fixed se queda como deberia
      // o si la version es la 2 pero no se esta utilizando la notacion exponencial
      if ( (this.parent.version != 2) || ((this.parent.version == 2) && (!this.exponentialif)) ) {
        resultValue = parseFloat(value).toFixed(decimals);
      }
    }

    // si el valor es cero entonces no se muestra la "E" de la notacion exponencial
    if ((this.exponentialif) && (parseFloat(resultValue) != 0)) {
      // ## parche para la version 2 ## //
      // en la version 2 no se muestran los decimales
      if ((this.fixed) && (this.parent.version !=2)) {
        resultValue = parseFloat(resultValue).toExponential(decimals);
      }
      else {
        resultValue = parseFloat(resultValue).toExponential();
      }
      resultValue = resultValue.toUpperCase();
      resultValue = resultValue.replace("+", "")
    }

    resultValue = resultValue.replace(".", this.parent.decimal_symbol);
    return resultValue;
  }

  /**
   * Al valor del pulsador le suma el incremento, verifica que el valor este dentro del rango y lo asigna
   */
  descartesJS.Spinner.prototype.increase = function() {
    this.changeValue( parseFloat(this.value) + this.evaluator.evalExpression(this.incr) );
  }
  
  /**
   * Al valor del pulsador le resta el incremento, verifica que el valor este dentro del rango y lo asigna
   */
  descartesJS.Spinner.prototype.decrease = function() {
    this.changeValue( parseFloat(this.value) - this.evaluator.evalExpression(this.incr) );
  }
  
  /**
   * Actualiza el valor del pulsador con el valor del campo de texto
   */
  descartesJS.Spinner.prototype.changeValue = function(value) {
    // if (this.evaluator.evalExpression(this.activeif) > 0) {
    if (activeif) {
      this.value = this.validateValue(value);
      this.field.value = this.formatOutputValue(this.value);

      // se registra el valor de la variable
      this.evaluator.setVariable(this.id, this.value);

      // se actualizan los controles
      this.parent.updateControls();

      // ejecutamos la accion
      if (this.action == "init") {
        this.click = false;
      }
      this.actionExec.execute();
      
      // se actualizan los controles
      this.parent.updateControls();
      
      // si la accion es animar, entonces no se actualizan los elementos
      if (this.action != "animate") {
        // se actualizan los valores
        this.parent.update();
      }
    }
  }

  /**
   * Registra los eventos del mouse del boton
   */
  descartesJS.Spinner.prototype.registerMouseEvents = function() {
    var hasTouchSupport = descartesJS.hasTouchSupport;

    this.divUp.oncontextmenu = function () { return false; };
    this.divDown.oncontextmenu = function () { return false; };    
    
    // copia de this para ser pasado a las funciones internas
    var self = this;
    var delay = (hasTouchSupport) ? 500 : 200;
    var timer;

    // eventos de la etiqueta para que no tenga un comportamiento extrano
    this.label.oncontextmenu = function() { return false; };
    if (hasTouchSupport) {
      this.label.addEventListener("touchstart", function (evt) { evt.preventDefault(); return false; })
    } 
    else {
      this.label.addEventListener("mousedown", function (evt) { evt.preventDefault(); return false; })
    }

    /**
     * Se repite durante un determinado tiempo una funcion, sirve para repedir incrementos o decrementos en el pulsador al dejar presionado alguno de los botones
     * @param {Number} delayTime el tiempo que se debe esperar antes de ejectuar de nuevo la funcion
     * @param {Number} fun la funcion a ejecutar
     * @private
     */
    function repeat(delayTime, fun, firstTime) {
      if (self.up || self.down) {
        fun.call(self);
//         delayTime = (delayTime < 30) ? 30 : delayTime-30;
        delayTime = (firstTime) ? delayTime : 30;
        timer = setTimeout(function() { repeat(delayTime, fun); }, delayTime);
      } else {
        clearInterval(timer);
      }
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado cuando se modifica el valor del campo de texto del pulsador
     * @private
     */
    function onChange_TextField(evt) {
      self.changeValue(self.field.value);
      evt.preventDefault();
    }
//    this.field.addEventListener("change", onChange_TextField);

    function onKeyDown_TextField(evt) {
      // responde al enter
      if (evt.keyCode == 13) {
        self.changeValue(self.field.value);
      }
    }
    this.field.addEventListener("keydown", onKeyDown_TextField, false);

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de presionar la flecha hacia arriba del pulsador
     * @private
     */
    function onMouseDown_UpButton(evt) {
      evt.preventDefault();

      // ie
      if (evt.which == null) {
        self.whichButton = (evt.button < 2) ? "LEFT" : ((evt.button == 4) ? "MIDDLE" : "RIGHT");
      } 
      // los demas
      else {
        self.whichButton = (evt.which < 2) ? "LEFT" : ((evt.which == 2) ? "MIDDLE" : "RIGHT");
      }

      if (self.whichButton == "LEFT") {
        // if (self.evaluator.evalExpression(self.activeif) > 0) {
        if (activeif) {
          self.up = true;
          repeat(delay, self.increase, true);
          self.draw();
        }
      }
    }

    if (hasTouchSupport) {
      this.divUp.addEventListener("touchstart", onMouseDown_UpButton, false);
    } else {
      this.divUp.addEventListener("mousedown", onMouseDown_UpButton, false);
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de presionar la flecha hacia abajo del pulsador
     * @private
     */
    function onMouseDown_DownButton(evt) {
      evt.preventDefault();
      // ie
      if (evt.which == null) {
        self.whichButton = (evt.button < 2) ? "LEFT" : ((evt.button == 4) ? "MIDDLE" : "RIGHT");
      } 
      // los demas
      else {
        self.whichButton = (evt.which < 2) ? "LEFT" : ((evt.which == 2) ? "MIDDLE" : "RIGHT");
      }

      if (self.whichButton == "LEFT") {
        // if (self.evaluator.evalExpression(self.activeif) > 0) {
        if (activeif) {
          self.down = true;
          repeat(delay, self.decrease, true);
          self.draw();
        }
      }
    }
    if (hasTouchSupport) {
      this.divDown.addEventListener("touchstart", onMouseDown_DownButton, false);
    } else {
      this.divDown.addEventListener("mousedown", onMouseDown_DownButton, false);
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de sacar el mouse de la flecha hacia arriba del pulsador
     * @private
     */
    function onMouseOut_UpButton(evt) {
      self.up = false;
      clearInterval(timer);
      self.draw();
      evt.preventDefault();      
    }
    if (!hasTouchSupport) {
      this.divUp.addEventListener("mouseout", onMouseOut_UpButton, false);
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de sacar el mouse de la flecha hacia abajo del pulsador
     * @private
     */
    function onMouseOut_DownButton(evt) {
      self.down = false;
      clearInterval(timer);
      self.draw();
      evt.preventDefault();
    }
    if (!hasTouchSupport) {
      this.divDown.addEventListener("mouseout", onMouseOut_DownButton, false);
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de soltar la flecha hacia arriba del pulsador
     * @private
     */
    function onMouseUp_UpButton(evt) {
      self.up = false;
      clearInterval(timer);
      self.draw();
      evt.preventDefault();
    }
    if (hasTouchSupport) {
      this.divUp.addEventListener("touchend", onMouseUp_UpButton, false);
      window.addEventListener("touchend", onMouseUp_UpButton, false);
    } else {
      this.divUp.addEventListener("mouseup", onMouseUp_UpButton, false);
      window.addEventListener("mouseup", onMouseUp_UpButton, false);
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de soltar la flecha hacia abajo del pulsador
     * @private
     */
    function onMouseUp_DownButton(evt) {
      self.down = false;
      clearInterval(timer);
      self.draw();
      evt.preventDefault();
    }
    if (hasTouchSupport) {
      this.divDown.addEventListener("touchend", onMouseUp_DownButton, false);
      window.addEventListener("touchend", onMouseUp_DownButton, false);
    } else {
      this.divDown.addEventListener("mouseup", onMouseUp_DownButton, false);
      window.addEventListener("mouseup", onMouseUp_DownButton, false);
    }
    
  }

  /**
   * Dibuja un poligono relleno
   * @param {2DContext} ctx el contexto de canvas donde dibujar
   * @param {[Number]} x las posiciones en x de los puntos del poligono
   * @param {[Number]} y las posiciones en y de los puntos del poligono
   * @param {String} color el color del pixel a dibujar
   */
  function fillPolygon(ctx, x, y, color) {
    ctx.fillStyle = color || "black";
    ctx.beginPath();
    ctx.moveTo(x[0], y[0])
    for (var i=1, l=x.length; i<l; i++) {
      ctx.lineTo(x[i], y[i]);
    }
    ctx.fill();
  }  
  
  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * Un campo de texto de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el campo de texto
   */
  descartesJS.TextField = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Control.call(this, parent, values);
    
    if (this.valueExprString === undefined) {
      this.valueExprString = "";
    }

    // se indica si el valor es una cadena vacia
    this.emptyString = false;
    
    // la evaluacion del control se inicia en cero
    this.ok = 0;
    
    // el indice de tabulacion del campo de texto, que determina el orden en el que se salta cuando se presiona el tabulador
    this.tabindex = ++this.parent.tabindex;
    
    // la respuesta existe
    if (this.answer) {
      // la respuesta esta encriptada
      if (this.answer.match("krypto_")) {
        var krypt = new descartesJS.Krypto();
        this.answer = krypt.decode(this.answer.substring(7));
      }
      this.answerPattern = this.answer;
      
      if (this.onlyText) {
        this.answer = descartesJS.buildRegularExpresionsPatterns(this.answer);
        
        // se encuentra el primer patron de respuesta de un campo solo de texto
        var sepIndex = this.answerPattern.indexOf("|");
        this.firstAnswer = (sepIndex == -1) ? this.answerPattern : this.answerPattern.substring(0, sepIndex);
      } else {
        this.buildRangeExpresions();
        
        // se encuentra el valor minimo del primer intervalo de un patron de respuesta numerico
        this.firstAnswer = this.parser.parse( this.answerPattern.substring(1, this.answerPattern.indexOf(",")) );
      }
    }
    
    // si el campo de texto es solo de texto entonces el valor introducido no debe cumplir normas de validacion
    if (this.onlyText) {
      if ( !(this.valueExprString.match(/^'/)) || !(this.valueExprString.match(/^'/)) ) {
        this.valueExpr = this.evaluator.parser.parse( "'" + this.valueExprString + "'" );
      }

      this.validateValue = function(value) { 
        if ( (value == "''") || (value == "'") ) {
          return "";
        }
        return value;
      }
      this.formatOutputValue = function(value) { 
        return value.toString(); 
      }
      this.evaluateAnswer = this.evaluateTextualAnswer;
    }
    
    // contenedor del espacio
    var container = this.getContainer();
    
    // si el nombre esta formado por espacios
    if (this.name.trim() == "") {
      this.name = "";
    }

    // contenedor del control
    this.containerControl = document.createElement("div");
    // se crea el campo de texto del campo de texto
    this.field = document.createElement("input");
    // se crea la etiqueta correspondiente al campo de texto
    this.label = document.createElement("label");
    // el texto de la etiqueta
    this.txtLabel = document.createTextNode(this.name);
    
    //se agrega el texto a la etiqueta
    this.label.appendChild(this.txtLabel);
    
    // se agregan todos los elementos del campo de texto a un contenedor
    this.containerControl.appendChild(this.label);
    this.containerControl.appendChild(this.field);
    
    // por ultimo se agrega el contenedor del pulsador al contenedor del espacio, en orden inverso al que aparecen listados
    if (!container.childNodes[0]) {
      container.appendChild(this.containerControl);
    } else {
      container.insertBefore(this.containerControl, container.childNodes[0]);
    }
    
    this.init();
    
    // se registran los eventos del mouse, cuando se de soporte a dispositivos moviles se deben de registrar los eventos correspondientes
    this.registerMouseEvents();
    
    this.draw();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.TextField, descartesJS.Control);
  
  /**
   * Inicia los valores del pulsador
   */
  descartesJS.TextField.prototype.init = function() {
    evaluator = this.evaluator;
    
    this.value = evaluator.evalExpression(this.valueExpr);
    // se valida el valor inicial del campo de texto
    this.value = this.validateValue(this.value);   
    
    // se calcula la longitud de la cadena mostrada en el campo de texto del campo de texto
    var fieldValue = this.formatOutputValue(this.value);
    
    // se calcula el tamano de la fuente del campo de texto del campo de texto
    // this.fieldFontSize = Math.floor(this.h - (this.h*.25));
    this.fieldFontSize = descartesJS.getFieldFontSize(this.h);
    var fieldValueSize = descartesJS.getTextWidth(fieldValue+"0", this.fieldFontSize+"px Arial");
    
    // se calculan los anchos de cada elemento dentro del campo de texto
    var labelWidth = this.w/2;
    var minTFWidth = fieldValueSize;
    var minLabelWidth = descartesJS.getTextWidth(this.name, this.fieldFontSize+"px Arial");
    
    if (labelWidth < minLabelWidth) {
      labelWidth = minLabelWidth;
    }
    
    if (this.name == "") {
      labelWidth = 0;
    }
    
    if (this.w-labelWidth < minTFWidth) {
      labelWidth = this.w - minTFWidth;
    }
    
    if (labelWidth < 0) {
      labelWidth=0;
    }
    
    var fieldWidth = this.w - (labelWidth);
    
    this.containerControl.setAttribute("class", "DescartesTextFieldContainer");
    this.containerControl.setAttribute("style", "width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    this.containerControl.style.display = (evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
    
    this.field.setAttribute("type", "text");
    this.field.setAttribute("id", this.id+"TextField");
    this.field.value = fieldValue;
    this.field.setAttribute("class", "DescartesTextFieldField");
    this.field.setAttribute("style", "font-size: " + this.fieldFontSize + "px; width : " + (fieldWidth -2) + "px; height : " + (this.h-2) + "px; left: " + (labelWidth) + "px;");
    this.field.setAttribute("tabindex", this.tabindex);
    this.field.disabled = (evaluator.evalExpression(this.activeif) > 0) ? false : true;
    
    this.label.setAttribute("class", "DescartesTextFieldLabel");
    this.label.setAttribute("style", "font-size:" + this.fieldFontSize + "px; width: " + labelWidth + "px; height: " + this.h + "px; line-height: " + this.h + "px;");
    
    // se registra el valor de la variable
    evaluator.setVariable(this.id, this.value);
    this.oldValue = this.value;
  }
  
  /**
   * Actualiza el campo de texto
   */
  descartesJS.TextField.prototype.update = function() {
    evaluator = this.evaluator;
    
    var changeX = false;
    var changeY = false;
    var changeW = false;
    var changeH = false;
    
    // se actualiza la propiedad de activacion
    this.field.disabled = (evaluator.evalExpression(this.activeif) > 0) ? false : true;
    
    // se actualiza si el campo de texto es visible o no
    if (evaluator.evalExpression(this.drawif) > 0) {
      this.containerControl.style.display = "block";
      this.draw();
    } else {
      this.containerControl.style.display = "none";
    }    
    
    // se actualiza la poscion y el tamano del campo de texto
    var expr = evaluator.evalExpression(this.expresion);
    changeX = (this.x != expr[0][0]);
    changeY = (this.y != expr[0][1]);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      changeW = (this.w != expr[0][2]);
      changeH = (this.h != expr[0][3]);
      this.w = expr[0][2];
      this.h = expr[0][3];
    }
    
    // se actualiza el estilo del campo de texto si cambia su tamano o su posicion
    if (changeW || changeH || changeX || changeY) {
      this.init();
    }
    
    var oldFieldValue = this.field.value;
    var oldValue = this.value;
    
    //     console.log(oldFieldValue, oldValue);
    
    // se actualiza el valor del pulsador
    this.value = this.validateValue( evaluator.getVariable(this.id) );
    
    this.field.value = this.formatOutputValue(this.value);
    
    if ((this.value === oldValue) && (this.field.value != oldFieldValue)) {
      // se actualiza el valor del pulsador
      this.value = this.validateValue( oldFieldValue );
      this.field.value = this.formatOutputValue(this.value);
    }
    
    // se registra el valor de la variable
    evaluator.setVariable(this.id, this.value);
    
    
    //     // se actualiza el valor del campo de texto
    //     var tmpFieldValue = this.field.value;
    //     var tmpIdValue = evaluator.getVariable(this.id);
    // 
    //     // si cambio el valor desde otro auxiliar
    //     if ( this.oldValue != tmpIdValue) {
  //       this.changeValue( tmpIdValue );
    //       return;
    //     }
    // 
    //     // si el campo de texto es diferente al valor
    // //     if ((this.fieldValue != "") && (this.fieldValue != this.value)) {
  //     if (this.fieldValue != this.value) {
  //       this.changeValue( tmpIdValue );
    //     }
    //     
    //     // si el valor cambio hay que corregirlo
    //     var tmpValidateFieldValue = this.validateValue(tmpFieldValue);
    //     var tmpFormatFieldValue = this.formatOutputValue(tmpValidateFieldValue);
    //     if ((tmpFormatFieldValue != this.field.value)) {
  //       this.changeValue( tmpFieldValue );
    //     }
    
  }
  
  /**
   * Valida si el valor que se le pasa esta en el rango determinado por los limites (minimo y maximo)
   * @param {String} value es el valor que se desea validar
   * @return {Number} regresa el valor que recibe como argumento si este se encuentra en dentro de los limites
   *                  si el valor es mayor que el limite maximo entonces se regresa el valor maximo
   *                  si el valor es menor que el limite minimo entonces se regresa el valor minimo
   */
  descartesJS.TextField.prototype.validateValue = function(value) {
    // si es la cadena vacia
    if ((value === "") || (value == "''")) {
      return "";
    }
    
    var evaluator = this.evaluator;
    
    var resultValue = parseFloat( evaluator.evalExpression( evaluator.parser.parse(value.toString().replace(this.parent.decimal_symbol, ".")) ) );
    
    // si el valor es una cadena que no representa un numero, la funcion parseFloat regresa NaN, entonces se ocupa el valor minimo
    if (!resultValue) {
      resultValue = 0; 
    }
    
    // si es menor que el valor minimo
    if (resultValue < evaluator.evalExpression(this.min)) {
      resultValue = evaluator.evalExpression(this.min);
    } 
    
    // si es mayor que el valor maximo
    if (resultValue > evaluator.evalExpression(this.max)) {
      resultValue = evaluator.evalExpression(this.max);
    }
    
    if (this.discrete) {
      var incr = evaluator.evalExpression(this.incr);
      resultValue = (incr==0) ? 0 : (incr * Math.round(resultValue / incr));
    }
    
    resultValue = parseFloat(parseFloat(resultValue).toFixed(evaluator.evalExpression(this.decimals)));
    
    return resultValue;    
    //     this.evaluator = evaluator;
    //     
    //     // se determina si el valor es la cadena vacia
    //     this.emptyString = (value == "");
    //     if (this.emptyString) {
      //       return "";
    //     }
    //     
    // //     var resultValue = evaluator.evalExpression( evaluator.parser.parse(value.toString()) ).toString();
    // //     resultValue = parseFloat( resultValue.replace(this.parent.decimal_symbol, ".") );
    //     value = (value.toString()).replace(this.parent.decimal_symbol, ".", "g");
    //     var resultValue = evaluator.evalExpression( evaluator.parser.parse(value) ).toString();
    //     resultValue = parseFloat( resultValue );
    // 
    //     // si el valor es una cadena que no representa un numero, la funcion parseFloat regresa NaN, entonces se ocupa el valor minimo
    //     if (!resultValue) {
      //       resultValue = 0; 
    //     }
    //     
    //     // si es menor que el valor minimo
    //     if (resultValue < evaluator.evalExpression(this.min)) {
      //       resultValue = evaluator.evalExpression(this.min);
    // 
    //     // si es mayor que el valor maximo
    //     } else if (resultValue > evaluator.evalExpression(this.max)) {
      //       resultValue = evaluator.evalExpression(this.max);
    //     }
    // 
    //     if (this.discrete) {
      //       var incr = evaluator.evalExpression(this.incr);
    //       resultValue = incr * Math.round(resultValue / incr);
    //       console.log("corregir la conversion cuando el campo discreto esta activo", resultValue);
    //     }
    // 
    //     if (this.fixed) {
      //       resultValue = parseFloat(parseFloat(resultValue).toFixed(evaluator.evalExpression(this.decimals)));
    //     }
    //     
    //     return resultValue;
  }
  
  /**
   * El valor que se le pasa es formateado, mostrando los valores exponenciales, 
   * los decimales y el signo de puntuacion utilizado como separador de decimales
   * @param {String} value es el valor que se quiere formatear
   * @return {String} regresa el valor ya formateado
   */
  descartesJS.TextField.prototype.formatOutputValue = function(value) {
    if (value === "") {
      return "";
  }
  
  //     if (this.emptyString) {
      //       return "";
      //     } 
      //     
      //     else {
        var resultValue = value+"";
        
        var decimals = this.evaluator.evalExpression(this.decimals);
        
        var indexDot = resultValue.indexOf(".");
        if ( indexDot != -1 ) {
          var subS = resultValue.substring(indexDot+1);
          if (subS.length > decimals) {
            resultValue = parseFloat(resultValue).toFixed(decimals);
          }
        }
        
        if (this.fixed) {
          resultValue = parseFloat(value).toFixed(decimals);
        }
        
        if (this.exponentialif) {
          resultValue = resultValue.toExponential(decimals);
          resultValue = resultValue.toUpperCase();
          resultValue = resultValue.replace("+", "")
        }
        
        resultValue = resultValue.replace(".", this.parent.decimal_symbol);
        return resultValue;
        //     }
}

/**
 * Se actualiza el valor del campo de texto con el valor que se le pasa
 * @param {String} value es el valor con el que se va a actualizar el campo de texto
 * @param {Boolean} update es un valor que indica si el cambio de valor necesita actualizar al padre o no
 */
descartesJS.TextField.prototype.changeValue = function(value, update) {
  if (this.evaluator.evalExpression(this.activeif) > 0) {
    this.value = this.validateValue(value);
    this.field.value = this.formatOutputValue(this.value);
    
    // si es un campo de texto que se evalua
    if (this.evaluate) {
      this.ok = this.evaluateAnswer();
    }
    
    // se registra el valor de la variable
    this.evaluator.setVariable(this.id, this.value);
    this.evaluator.setVariable(this.id+".ok", this.ok);
    
    // se actualizan los controles
    this.parent.updateControls();
    
    // ejecutamos la accion
    if (this.action == "init") {
      this.click = false;
  }
  this.actionExec.execute();
  
  // se actualizan los controles
  this.parent.updateControls();
  
  // si la accion es animar, entonces no se actualizan los elementos
  if (this.action != "animate") {
    // se actualizan los valores
    this.parent.update();
}
}    
//       this.value = this.validateValue(value);
//       this.field.value = this.formatOutputValue(this.value);
// 
//       if (this.evaluate) {
    //         this.ok = this.evaluateAnswer();
    //       }
    //       
    //       this.oldValue = this.value;
    //       
    //       // se registra el valor de la variable
    //       this.evaluator.setVariable(this.id, this.value);
    //       this.evaluator.setVariable(this.id+".ok", this.ok);
    // 
    //       if (update) {
    //         // se actualizan los controles
    //         this.parent.updateControls();
    // 
    //         // ejecutamos la accion
    //         this.actionExec.execute();
    //         
    //         // se actualizan los controles
    //         this.parent.updateControls();
    // 
    //         // si la accion es animar, entonces no se actualizan los elementos
    //         if (this.action != "animate") {
    //           // se actualizan los valores
    //           this.parent.update();
    //         }
    //       }
    }
    
    /**
     * 
     */
    descartesJS.TextField.prototype.evaluateAnswer = function() {
      var evaluator = this.evaluator;
      var value = parseFloat(this.value);
      var limInf;
      var limSup;
      var cond1;
      var cond2;
      var cond3;
      var cond4;
      var answer_i_0;
      var answer_i_1;
      var tmpValue;
      
      for (var i=0, l=this.answer.length; i<l; i++) {
        answer_i_0 = this.answer[i][0];
        answer_i_1 = this.answer[i][1];
        
        limInf = evaluator.evalExpression(answer_i_0.expression);
        limSup = evaluator.evalExpression(answer_i_1.expression);
        
        cond1 = (answer_i_0.type == "(");
        cond2 = (answer_i_0.type == "[");
        cond3 = (answer_i_1.type == ")");
        cond4 = (answer_i_1.type == "]");
        
        tmpValue = this.value;
        
        if ( (cond1 && cond3 && (tmpValue > limInf) && (tmpValue < limSup)) ||
          (cond1 && cond4 && (tmpValue > limInf) && (tmpValue <= limSup)) ||
          (cond2 && cond3 && (tmpValue >= limInf) && (tmpValue < limSup)) ||
          (cond2 && cond4 && (tmpValue >= limInf) && (tmpValue <= limSup)) ) {
          return 1;
          }
      }
      
      return 0;
    }
    
    /**
     * 
     */
    descartesJS.TextField.prototype.buildRangeExpresions = function() {
      var tmpAnswer;
      this.answer = this.answer.split("|");
      
      for (var i=0, l=this.answer.length; i<l; i++) {
        this.answer[i] = this.answer[i].trim();
        this.answer[i] = this.answer[i].split(",");
        
        tmpAnswer = this.answer[i][0].trim();
        this.answer[i][0] = { type: tmpAnswer[0], 
        expression: this.evaluator.parser.parse(tmpAnswer.substring(1)) } ;
        
        tmpAnswer = this.answer[i][1].trim();
        this.answer[i][1] = { type: tmpAnswer[tmpAnswer.length-1], 
        expression: this.evaluator.parser.parse(tmpAnswer.substring(0,tmpAnswer.length-1)) } ;
      }
    }
    
    /**
     * 
     */
    descartesJS.TextField.prototype.evaluateTextualAnswer = function() {
      var value = this.value;
      var regExpPattern;
      var tempAnswer;
      var answerValue;
      
      for (var i=0, l=this.answer.length; i<l; i++) {
        tempAnswer = this.answer[i];
        answerValue = true;
        
        for (var j=0, k=tempAnswer.length; j<k; j++) {
          regExpPattern = tempAnswer[j];
          
          if (regExpPattern.ignoreAcents) {
            value = descartesJS.replaceAcents(value);
            regExpPattern.regExp = descartesJS.replaceAcents(regExpPattern.regExp);
          }
          
          if (regExpPattern.ignoreCaps) {
            value = value.toLowerCase();
            regExpPattern.regExp = (regExpPattern.regExp).toLowerCase();
          }
          
          answerValue = answerValue && !!(value.match(regExpPattern.regExp));
        }
        
        if (answerValue) {
          return 1;
        }
        
      }
      
      return 0;
    }
    
    /**
     * @return 
     */
    descartesJS.TextField.prototype.getFirstAnswer = function() {
      // si el campo de texto tiene patron de respuesta
      if (this.answer) {
        // si el campo de texto es del tipo solo texto
        if (this.onlyText) {
          return this.firstAnswer;
        }
        // si el campo de texto es del tipo numerico
        else {
          return this.evaluator.evalExpression(this.firstAnswer);
        }
      }
      // si el campo de texto no tiene patron de respuesta
      else {
        return '';
      }
    }  
    
    /**
     * Se registran los eventos del mouse del boton
     */
    descartesJS.TextField.prototype.registerMouseEvents = function() {
      var hasTouchSupport = descartesJS.hasTouchSupport;

      // copia de this para ser pasado a las funciones internas
      var self = this;    

      // eventos de la etiqueta para que no tenga un comportamiento extrano
      this.label.oncontextmenu = function() { return false; };
      if (hasTouchSupport) {
        this.label.addEventListener("touchstart", function (evt) { evt.preventDefault(); return false; })
      } 
      else {
        this.label.addEventListener("mousedown", function (evt) { evt.preventDefault(); return false; })
      }

      /**
       * 
       * @param {Event} evt el evento lanzado cuando se modifica el valor del campo de texto del campo de texto
       * @private
       */
      //     function onChange_TextField(evt) {
          //       console.log("aqui");
          //       self.changeValue(self.field.value);
          //       evt.preventDefault();
          //     }
          //     this.field.addEventListener("change", onChange_TextField);
          
          function onBlur_textField(evt) {
            self.update();
          }
          this.field.addEventListener("blur", onBlur_textField, false);
          
          function onKeyDown_TextField(evt) {
            if (self.evaluator.evalExpression(self.activeif) > 0) {
              // responde al enter
              if (evt.keyCode == 13) {
                self.changeValue(self.field.value, true);
              }
            }
          }
          this.field.addEventListener("keydown", onKeyDown_TextField, false);
          
    }
    
    return descartesJS;
    })(descartesJS || {});
    /**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una menu de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el menu
   */
  descartesJS.Menu = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Control.call(this, parent, values);

    var parser = this.parser;
    
    // se separan las opciones utilizando la coma como separador
    this.options = (this.options) ? this.options.split(",") : [];
    
    this.menuOptions = [];
    this.strValue = [];
    
    var splitOption;
    // se parsean todas las opciones
    for (var i=0, l=this.options.length; i<l; i++) {
      // se separan las opciones si es que especifican un valor con corchetes, opcion[valor]
      splitOption = this.options[i].split(/[\[\]]/,2);

      // si al dividir la opcion solo tienen un valor, entonces no se esta especificando su valor y se toma del orden en el que aparece
      if (splitOption.length == 1) {
        this.menuOptions.push( splitOption[0] );
        this.strValue.push( i.toString() );
      } 
      // si al dividir la opcion tiene dos valores, entonces se esta especificando su valor
      else if (splitOption.length == 2) {
        this.menuOptions.push( splitOption[0] );
        
        // si el valor especificado es la cadena vacia, entones se le coloca el valor del orden
        if (splitOption[1] == "") {
          this.strValue.push( i.toString() );
        }
        
        // si no, entonces ese valor es el que se le pone
        else {
          this.strValue.push(splitOption[1]);
        }
      }
    }

    // se parsean los valores de las opciones
    for (var i=0, l=this.strValue.length; i<l; i++) {
      this.strValue[i] = parser.parse( this.strValue[i] );
    }
   
    // contenedor del espacio
    var container = this.getContainer();

    // contenedor del control
    this.containerControl = document.createElement("div");

    // se crea la etiqueta correspondiente al menu
    this.label = document.createElement("label");

    // el texto de la etiqueta
    this.txtLabel = document.createTextNode(this.name);

    //se agrega el texto a la etiqueta
    this.label.appendChild(this.txtLabel);
    
    // se crea el objeto select
    this.select = document.createElement("select");

    // se agregan las opciones al menu
    var opt;
    for (var i=0, l=this.menuOptions.length; i<l; i++) {
      opt = document.createElement("option");
      opt.innerHTML = this.menuOptions[i]; //opt.value = this.menuOptions[i];
      this.select.appendChild(opt);
    }

    // se crea el campo de texto del menu
    this.field = document.createElement("input");

    this.init();

    // se agregan todos los elementos del menu a un contenedor
    this.containerControl.appendChild(this.label);
    this.containerControl.appendChild(this.select);
    
    // si esta visible el menu, se muestra su campo de texto
    if (this.visible) {
      this.containerControl.appendChild(this.field);
    }

    // por ultimo se agrega el contenedor del menu al contenedor del espacio, en orden inverso al que aparecen listados
    if (!container.childNodes[0]) {
      container.appendChild(this.containerControl);
    } else {
      container.insertBefore(this.containerControl, container.childNodes[0]);
    }
    
    this.registerMouseEvents();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Menu, descartesJS.Control);

  /**
   * Inicia los valores del menu
   */
  descartesJS.Menu.prototype.init = function() {
    var evaluator = this.evaluator;

    // se calcula el tamanio de la fuente del campo de texto del menu
    this.fieldFontSize = (this.parent.version != 2) ? descartesJS.getFieldFontSize(this.h) : 10;

    // se busca dentro de todas las opciones, aquella cuyo valor sea el mas largo, para determinar el tamano del menu
    var minchw = 0;
    var indMinTFw = 0;
    var minTFw = 0;
    var mow;
    this.value = evaluator.evalExpression(this.valueExpr);
    this.indexValue = this.getIndex(this.value);

    // se buscan los valores mas grandes para determiniar los tamanos de los elementos
    for (var i=0, l=this.menuOptions.length; i<l; i++) {
      mow = descartesJS.getTextWidth( this.menuOptions[i], this.fieldFontSize+"px Arial" );
      if (mow > minchw) {
        minchw = mow;
        indMinTFw = i;
      }
    }
    
    minchw += 25;
    minTFw = descartesJS.getTextWidth( this.formatOutputValue(evaluator.evalExpression(this.strValue[indMinTFw])), this.fieldFontSize+"px Arial" ) + 7;
    
    var labelWidth = descartesJS.getTextWidth(this.name, this.fieldFontSize+"px Arial")+10;
    var fieldWidth = minTFw;

    if (this.name == "") {
      labelWidth = 0;
    }
    if (!this.visible) {
      fieldWidth = 0;
    }
    var chw = this.w - fieldWidth - labelWidth;
    while (chw<minchw && labelWidth>0) {
      labelWidth--;
      chw++;
    }
    while (chw<minchw && fieldWidth>0) {
      fieldWidth--;
      chw++;
    }
    while (labelWidth+chw+fieldWidth+1<this.w) {
      chw++;
      fieldWidth++;
    }
    var chx = labelWidth;
    var TFx = chx + chw;
    fieldWidth = this.w - TFx;
    
    var fieldValue = this.formatOutputValue( evaluator.evalExpression(this.strValue[this.indexValue]) );

    this.containerControl.setAttribute("class", "DescartesSpinnerContainer");
    this.containerControl.setAttribute("style", "width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    this.containerControl.style.display = (evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";

    this.label.setAttribute("class", "DescartesMenuLabel");
    this.label.setAttribute("style", "font-size:" + this.fieldFontSize + "px; width: " + labelWidth + "px; height: " + this.h + "px;  line-height: " + this.h + "px;");
    
    this.field.setAttribute("type", "text");
    this.field.setAttribute("id", this.id+"menu");
    this.field.value = fieldValue;
    this.field.setAttribute("class", "DescartesMenuField");
    this.field.setAttribute("style", "font-size: " + this.fieldFontSize + "px; width : " + (fieldWidth -2) + "px; height : " + (this.h-2) + "px; left: " + TFx + "px;");
    this.field.disabled = (evaluator.evalExpression(this.activeif) > 0) ? false : true;

    this.select.setAttribute("id", this.id+"menuSelect");
    this.select.setAttribute("class", "DescartesMenuSelect");
    this.select.setAttribute("style", "text-align: left; font-size: " + this.fieldFontSize + "px; width : " + chw + "px; height : " + this.h + "px; left: " + chx + "px; border-color: #7a8a99; border-width: 1.5px; border-style: solid; background-color: #eeeeee;");
    this.select.selectedIndex = this.indexValue;
    this.select.disabled = (evaluator.evalExpression(this.activeif) > 0) ? false : true;

    // se registra el valor de la variable
    evaluator.setVariable(this.id, parseFloat(fieldValue));
  }
  
  /**
   * Actualiza el menu
   */
  descartesJS.Menu.prototype.update = function() { 
    var evaluator = this.evaluator;

    var changeX = false;
    var changeY = false;
    var changeW = false;
    var changeH = false;

    // se actualiza la propiedad de activacion
    var activeif = (evaluator.evalExpression(this.activeif) > 0);
    this.field.disabled = (activeif) ? false : true;
    this.select.disabled = (activeif) ? false : true;
    
    // se actualiza si el menu es visible o no
    if (evaluator.evalExpression(this.drawif) > 0) {
      this.containerControl.style.display = "block"
      this.draw();
    } else {
      this.click = false;
      this.containerControl.style.display = "none";
    }

    // se actualiza la poscion y el tamano del menu
    var expr = evaluator.evalExpression(this.expresion);
    changeX = (this.x != expr[0][0]);
    changeY = (this.y != expr[0][1]);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      changeW = (this.w != expr[0][2]);
      changeH = (this.h != expr[0][3]);
      this.w = expr[0][2];
      this.h = expr[0][3];
    }

     // se actualiza el estilo del menu si cambia su tamano o su posicion
    if (changeW || changeH || changeX || changeY) {
      this.init();
      this.draw();
    }
    
    // se actualiza el valor del menu
    this.value = evaluator.getVariable(this.id);
    this.field.value = this.formatOutputValue(this.value);
    
    // se registra el valor de la variable
    evaluator.setVariable(this.id, parseFloat(this.value));
    
    this.select.selectedIndex = parseFloat(this.getIndex(this.value));
 }

  /**
   * Obtiene el indice de la opcion seleccionada
   */
  descartesJS.Menu.prototype.getIndex = function(val) {
    var val = parseFloat( (val.toString()).replace(this.parent.decimal_symbol, ".") );
    var tempInd = -1;
    var diff = Infinity;
    var rest;
    
    for (var i=0, l=this.strValue.length; i<l; i++) {
      rest = Math.abs( val - parseFloat( this.evaluator.evalExpression(this.strValue[i])) );
      
      if (rest <= diff) {
        diff = rest;
        tempInd = i;
      }
    }
        
    return tempInd;
  }
  
  /**
   * El valor que se le pasa es formateado, mostrando los valores exponenciales, 
   * los decimales y el signo de puntuacion utilizado como separador de decimales
   * @param {String} value es el valor que se quiere formatear
   * @return {String} regresa el valor ya formateado
   */
  descartesJS.Menu.prototype.formatOutputValue = function(value) {
    var resultValue = value+"";

    var decimals = this.evaluator.evalExpression(this.decimals);

    var indexDot = resultValue.indexOf(".");
    if ( indexDot != -1 ) {
      var subS = resultValue.substring(indexDot+1);
        if (subS.length > decimals) {
        resultValue = parseFloat(resultValue).toFixed(decimals);
      }
    }
    
    if (this.fixed) {
      resultValue = parseFloat(value).toFixed(decimals);
    }
    
    if (this.exponentialif) {
      resultValue = resultValue.toExponential(decimals);
      resultValue = resultValue.toUpperCase();
      resultValue = resultValue.replace("+", "")
    }

    resultValue = resultValue.replace(".", this.parent.decimal_symbol);
    return resultValue;
  }

  /**
   * Actualiza el valor del menu con el valor del campo de texto
   */
  descartesJS.Menu.prototype.changeValue = function() {
    if (this.evaluator.evalExpression(this.activeif) > 0) {    
      // se registra el valor de la variable
      this.evaluator.setVariable(this.id, this.value);

      // se actualizan los controles
      this.parent.updateControls();

      // ejecutamos la accion
      this.actionExec.execute();

      // se actualizan los controles
      this.parent.updateControls();

      // si la accion es animar, entonces no se actualizan los elementos
      if (this.action != "animate") {
        // se actualizan los valores
        this.parent.update();
      }
      
    }
  }

  /**
   * Registra los eventos del mouse del boton
   */
  descartesJS.Menu.prototype.registerMouseEvents = function() {
    var hasTouchSupport = descartesJS.hasTouchSupport;

    // copia de this para ser pasado a las funciones internas
    var self = this;

    this.select.oncontextmenu = function () { return false; };

    // eventos de la etiqueta para que no tenga un comportamiento extrano
    this.label.oncontextmenu = function() { return false; };
    if (hasTouchSupport) {
      this.label.addEventListener("touchstart", function (evt) { evt.preventDefault(); return false; })
    } 
    else {
      this.label.addEventListener("mousedown", function (evt) { evt.preventDefault(); return false; })
    }

    /**
     * 
     * @param {Event} evt el evento lanzado cuando se selecciona los elementos del menu
     * @private
     */
    function onChangeSelect(evt) {
      self.value = self.evaluator.evalExpression( self.strValue[this.selectedIndex] );
      self.field.value = self.formatOutputValue(self.value);
      self.evaluator.setVariable(self.id, self.field.value);
      
      self.changeValue();
      
      evt.preventDefault();
    }
    this.select.addEventListener("change", onChangeSelect, false);
    
    /**
     * 
     * @param {Event} evt el evento lanzado cuando se modifica el valor del campo de texto del menu
     * @private
     */
//     function onChangeField(evt) {
//       self.indexValue = self.getIndex(self.field.value);
//       self.value = self.strValue[this.selectedIndex]
//       self.field.value = self.formatOutputValue(self.value);
//       self.select.selectedIndex = self.indexValue;
// 
//       self.changeValue();
//       
//       evt.preventDefault();
//     }
//    this.field.addEventListener("change", onChangeField, false);

    function onKeyDown_TextField(evt) {
      // responde al enter
      if (evt.keyCode == 13) {
        self.indexValue = self.getIndex(self.field.value);

        self.value = self.evaluator.evalExpression( self.strValue[self.indexValue] );
        self.field.value = self.formatOutputValue(self.indexValue);
        self.select.selectedIndex = self.indexValue;
        
        self.changeValue();
      }
    }
    this.field.addEventListener("keydown", onKeyDown_TextField, false);
  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;

  /**
   * Una barra de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la barra
   */
  descartesJS.Scrollbar = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Control.call(this, parent, values);

    this.orientation = (this.w >= this.h) ? "horizontal" : "vertical";

    // contenedor del espacio
    var container = this.getContainer();

    // contenedor del control
    this.containerControl = document.createElement("div");
    this.canvas = document.createElement("canvas");
    this.divUp = document.createElement("div");
    this.divDown = document.createElement("div");
    this.field = document.createElement("input");
    this.label = document.createElement("label");
    this.scrollManipulator = document.createElement("div");
    
    // el texto de la etiqueta
    this.txtLabel = document.createTextNode(this.name);

    //se agrega el texto a la etiqueta
    this.label.appendChild(this.txtLabel);

    // se agregan todos los elementos de la barra a un contenedor
    this.containerControl.appendChild(this.label);
    this.containerControl.appendChild(this.canvas);
    this.containerControl.appendChild(this.divUp);
    this.containerControl.appendChild(this.divDown);
    this.containerControl.appendChild(this.field);
    this.containerControl.appendChild(this.scrollManipulator);
    
    // por ultimo se agrega el contenedor de la barra al contenedor del espacio, en orden inverso al que aparecen listados
    if (!container.childNodes[0]) {
      container.appendChild(this.containerControl);
    } else {
      container.insertBefore(this.containerControl, container.childNodes[0]);
    }
    
    this.init();

    // se registran los eventos del mouse, cuando se de soporte a dispositivos moviles se deben de registrar los eventos correspondientes
    this.registerMouseEvents();
    
    this.draw();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Scrollbar, descartesJS.Control);

  /**
   * Inicia los valores de la barra
   */
  descartesJS.Scrollbar.prototype.init = function() {
    var evaluator = this.evaluator;
    
    // el incremento de la barra corresponde a dividir el intervalo entre el minimo y maximo entre 100 si tiene decimales, si no el incremento es 1
    if (evaluator.evalExpression(this.decimals) == 0) {
      this.incr = 1;
    }
    else {
      this.incr = (evaluator.evalExpression(this.max) - evaluator.evalExpression(this.min)) / 100;
    }

    // se valida el valor inicial de la barra
    this.value = this.validateValue( evaluator.evalExpression(this.valueExpr) );

    // se calcula la longitud de la cadena mostrada en el campo de texto de la barra
    var fieldValue = this.formatOutputValue(this.value);

    var expr = this.evaluator.evalExpression(this.expresion);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      this.w = expr[0][2];
      this.h = expr[0][3];
    }
    this.orientation = (this.w >= this.h) ? "horizontal" : "vertical";
    
    var fieldValueSize;
    if (this.orientation == "vertical") {
      this.initVertical(fieldValue);
    } else {
      this.initHorizontal(fieldValue);      
    }

    // se registra el valor de la variable
    evaluator.setVariable(this.id, this.value);
    
    // se guarda el valor inicial del control
    var tmpValue = this.value;
    // se coloca el valor en null, para poder cambiarlo con changeValue y se acomode el scroll en su lugar
    this.value = null;
    this.changeValue(tmpValue);

    this.prePos = this.pos;
    this.draw();
  }
  
  /**
   * Inicia una barra vertical
   */
  descartesJS.Scrollbar.prototype.initVertical = function(fieldValue) {
    // se calcula el tamanio de la fuente del campo de texto de la barra
    this.fieldFontSize = MathFloor(this.w - (this.w*.25));
    this.fieldFontSize = 23 - (23*.25);
    var fieldValueSize = descartesJS.getTextWidth(fieldValue+"0", this.fieldFontSize+"px Arial");
    
    var spaceH = this.parent.getSpaceById(this.spaceID).h;

    // la altura de la etiqueta y el campo de texto es de tamano 23px
    this.labelHeight = (this.name == "") ? 0 : 23;
    var fieldHeight = (this.visible == "") ? 0 : 23;
    this.canvasHeight = this.h - this.labelHeight - fieldHeight;
    
    if (this.canvasHeight + this.y - spaceH >= 18) {
      this.canvasHeight = spaceH;
    }

    var sby = fieldHeight;
    var TFy = sby + this.canvasHeight;

    this.upHeight = this.downHeight = 15;

    this.scrollManipulatorHeight = parseInt( (this.canvasHeight-this.upHeight-this.downHeight -this.labelHeight)/10 );
    this.scrollManipulatorHeight = (this.scrollManipulatorHeight < 15) ? 15 : this.scrollManipulatorHeight;
    
    // this.scrollManipulatorLimInf = sby+this.canvasHeight-this.upHeight-this.downHeight -this.labelHeight;
    this.scrollManipulatorLimInf = TFy - this.downHeight -this.scrollManipulatorHeight;
    this.scrollManipulatorLimSup = sby+this.downHeight;

    this.containerControl.setAttribute("class", "DescartesScrollbarContainer");
    this.containerControl.setAttribute("style", "width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    this.containerControl.style.display = (this.evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
      
    this.canvas.setAttribute("width", this.w+"px");
    this.canvas.setAttribute("height", this.canvasHeight+"px");
    this.canvas.setAttribute("style", "position: absolute; left: 0px; top: " + sby + "px;");
    this.ctx = this.canvas.getContext("2d");
      
    this.divDown.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + this.w + "px; height : " + this.upHeight + "px; left: 0px; top: " + (TFy-this.downHeight) + "px;");
    this.divUp.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + this.w + "px; height : " + this.downHeight + "px; left: 0px; top: 0px;");
    
    this.scrollManipulator.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + this.w + "px; height : " + this.scrollManipulatorHeight + "px; left: 0px; top: " + this.scrollManipulatorLimInf + "px;");

    // se crea el campo de texto de la barra
    this.field.setAttribute("type", "text");
    this.field.setAttribute("id", this.id+"scrollbar");
    this.field.value = fieldValue;
    this.field.setAttribute("class", "DescartesScrollbarField");
    this.field.setAttribute("style", "font-size: " + this.fieldFontSize + "px; width : " + this.w + "px; height : " + fieldHeight + "px; left: 0px; top: 0px;");
    this.field.disabled = (this.evaluator.evalExpression(this.activeif) > 0) ? false : true;

    // se crea la etiqueta correspondiente al pulsador
    this.label.setAttribute("class", "DescartesScrollbarLabel");
    this.label.setAttribute("style", "font-size:" + this.fieldFontSize + "px; width: " + this.w + "px; height: " + this.labelHeight + "px; left: 0px; top: " + TFy + "px;");
      
    // el texto de la etiqueta
    this.txtLabel = document.createTextNode(this.name);
  }
  
  /**
   * Inicia una barra vertical
   */
  descartesJS.Scrollbar.prototype.initHorizontal = function(fieldValue) {
    // se calcula el tamanio de la fuente del campo de texto de la barra
    this.fieldFontSize = MathFloor(this.h - (this.h*.25));
    var fieldValueSize = descartesJS.getTextWidth(fieldValue+"0", this.fieldFontSize+"px Arial");
    
    var minsbw = 58;
    
    // se calculan los anchos de cada elemento dentro de la barra
    var minLabelWidth = descartesJS.getTextWidth(this.name, this.fieldFontSize+"px Arial");
    this.labelWidth = minLabelWidth;
    var minTFWidth = fieldValueSize;
    var fieldWidth = minTFWidth;
    
    if (this.name == "") {
      this.labelWidth = 0;
    }
    
    if (!this.visible) {
      fieldWidth = 0;
    }
    
    var sbw = this.w - fieldWidth - this.labelWidth;
    while ((sbw < minsbw) && (this.labelWidth > 0)) {
      this.labelWidth--;
      sbw++;
    }
    while ((sbw < minsbw) && (fieldWidth > 0)) {
      fieldWidth--;
      sbw++;
    }
    
    var sbx = this.labelWidth;
    var TFx = sbx + sbw;
    fieldWidth = this.w - TFx;
    this.canvasWidth = sbw;
    
    this.upWidth = this.downWidth = 15;
    
    this.scrollManipulatorWidth = parseInt( (this.canvasWidth-this.upWidth-this.downWidth)/10 );
    this.scrollManipulatorWidth = (this.scrollManipulatorWidth < 15) ? 15 : this.scrollManipulatorWidth;

    this.scrollManipulatorLimInf = sbx+this.downWidth;
    this.scrollManipulatorLimSup = sbx+this.canvasWidth-this.downWidth -this.scrollManipulatorWidth;

    this.containerControl.setAttribute("class", "DescartesScrollbarContainer");
    this.containerControl.setAttribute("style", "width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    this.containerControl.style.display = (this.evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
    
    this.canvas.setAttribute("width", this.canvasWidth+"px");
    this.canvas.setAttribute("height", this.h+"px");
    this.canvas.setAttribute("style", "position: absolute; left: " + sbx + "px; top: 0px;");
    this.ctx = this.canvas.getContext("2d");
    
    this.divUp.setAttribute("style", "cursor: pointer; position: absolute; width : " + this.upWidth + "px; height : " + this.h + "px; left: " + (TFx-this.downWidth) + "px; top: 0px;");
    this.divDown.setAttribute("style", "cursor: pointer; position: absolute; width : " + this.downWidth + "px; height : " + this.h + "px; left: " + this.labelWidth + "px; top: 0px;");
    
    this.scrollManipulator.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + this.scrollManipulatorWidth + "px; height : " + this.h + "px; left: " + this.scrollManipulatorLimInf + "px; top: 0px;");
    
    // se crea el campo de texto de la barra
    this.field.setAttribute("type", "text");
    this.field.setAttribute("id", this.id+"scrollbar");
    this.field.value = fieldValue;
    this.field.setAttribute("class", "DescartesScrollbarField");
    this.field.setAttribute("style", "font-size: " + this.fieldFontSize + "px; width : " + fieldWidth + "px; height : " + (this.h-2) + "px; left: " + (this.canvasWidth + this.labelWidth) + "px;");
    this.field.disabled = (this.evaluator.evalExpression(this.activeif) > 0) ? false : true;
    
    // se crea la etiqueta correspondiente al pulsador
    this.label.setAttribute("class", "DescartesScrollbarLabel");
    this.label.setAttribute("style", "font-size:" + this.fieldFontSize + "px; width: " + this.labelWidth + "px; height: " + this.h + "px;");
    
    // el texto de la etiqueta
    this.txtLabel = document.createTextNode(this.name);
  }
  
  /**
   * Actualiza la barra
   */
  descartesJS.Scrollbar.prototype.update = function() {
    var evaluator = this.evaluator;

    var changeX = false;
    var changeY = false;
    var changeW = false;
    var changeH = false;

    // el incremento de la barra corresponde a dividir el intervalo entre el minimo y maximo entre 100 si tiene decimales, si no el incremento es 1
    if (evaluator.evalExpression(this.decimals) == 0) {
      this.incr = 1;
    }
    else {
      this.incr = (evaluator.evalExpression(this.max) - evaluator.evalExpression(this.min)) / 100;
    }
    
    // se actualiza la propiedad de activacion
    this.field.disabled = (evaluator.evalExpression(this.activeif) > 0) ? false : true;
    
    // se actualiza si la barra es visible o no
    if (evaluator.evalExpression(this.drawif) > 0) {
      this.containerControl.style.display = "block"
      this.draw();
    } else {
      this.containerControl.style.display = "none";
    }
    
    // se actualiza la poscion y el tamano de la barra
    var expr = evaluator.evalExpression(this.expresion);
    changeX = (this.x != expr[0][0]);
    changeY = (this.y != expr[0][1]);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      changeW = (this.w != expr[0][2]);
      changeH = (this.h != expr[0][3]);
      this.w = expr[0][2];
      this.h = expr[0][3];
    }

    // se actualiza el valor de la barra
    this.value = this.validateValue( evaluator.getVariable(this.id) );
    this.field.value = this.formatOutputValue(this.value);

    // se actualiza el estilo de la barra si cambia su tamano o su posicion
    if (changeW || changeH || changeX || changeY) {
      this.init();
      this.draw();
    }
        
    // se registra el valor de la variable
    evaluator.setVariable(this.id, this.value);

    this.draw();
  }

  /**
   * Crea un gradiente lineal para la barra
   * @param {Number} w es el ancho del canvas sobre el cual se quiere crear el gradiente lineal
   * @param {Number} h es el alto del canvas sobre el cual se quiere crear el gradiente lineal
   */
  descartesJS.Scrollbar.prototype.createGradient = function(w, h) {
    this.linearGradient = this.ctx.createLinearGradient(0, 0, 0, h);
    var hh = h*h;
    var di;
    for (var i=0; i<h; i++) {
      di = MathFloor(i-(40*h)/100);
      this.linearGradient.addColorStop(i/h, "rgba(0,0,0,"+ ((di*di*192)/hh)/255 +")");
    }
  }

  /**
   * Dibuja la barra
   */
  descartesJS.Scrollbar.prototype.draw = function() {
    var ctx = this.ctx;
    
    if (this.orientation == "horizontal") {
      var tmpH = MathFloor(this.h);
      var tmpUpW = MathFloor(this.upWidth);
      var tmpCamvasW_upW = MathFloor(this.canvasWidth-this.upWidth);
      ctx.clearRect(0, 0, this.canvasWidth, this.h);
            
      // los botones
      ctx.strokeStyle = "#7a8a99";
      ctx.strokeRect(0, 0, tmpUpW+.5, tmpH);
      ctx.strokeRect(tmpCamvasW_upW+.5, 0, tmpUpW, tmpH);
      // triangulos de los botones
      var desp = 4;
      ctx.fillStyle = (this.up) ? "black" : "#333333";
      ctx.beginPath();
      ctx.moveTo(desp, tmpH/2);
      ctx.lineTo(tmpUpW-desp, tmpH/2-7);
      ctx.lineTo(tmpUpW-desp, tmpH/2+7);
      ctx.closePath();
      ctx.moveTo(tmpCamvasW_upW+1+tmpUpW-desp, tmpH/2);
      ctx.lineTo(tmpCamvasW_upW+1+desp,        tmpH/2-7);
      ctx.lineTo(tmpCamvasW_upW+1+desp,        tmpH/2+7);
      ctx.closePath();
      ctx.fill();
      
      // borde exterior
      ctx.strokeRect(0, .5, this.canvasWidth+.5, tmpH-1);

      // el manipulador del scroll
      var tmpPos = MathFloor(this.pos-this.labelWidth);
      ctx.fillStyle = "#ccdcec";
      ctx.fillRect(tmpPos+.5, 0, MathFloor(this.scrollManipulatorWidth), tmpH);
      ctx.strokeStyle = "#6382bf";
      ctx.strokeRect(tmpPos+.5, 0, MathFloor(this.scrollManipulatorWidth), tmpH);
      // lineas del manipulador del scroll
      var smw = MathFloor(this.scrollManipulatorWidth/2);
      ctx.beginPath();
      ctx.moveTo(tmpPos+smw+.5-2, 3);
      ctx.lineTo(tmpPos+smw+.5-2, tmpH-3);
      ctx.moveTo(tmpPos+smw+.5,   3);
      ctx.lineTo(tmpPos+smw+.5,   tmpH-3);
      ctx.moveTo(tmpPos+smw+.5+2, 3);
      ctx.lineTo(tmpPos+smw+.5+2, tmpH-3);
      ctx.stroke();
    } else {
      var tmpW = MathFloor(this.w);
      var tmpUpH = MathFloor(this.upHeight);
      var tmpCamvasH_upH = MathFloor(this.canvasHeight-this.upHeight);
      ctx.clearRect(0, 0, this.w, this.canvasHeight);
            
      // los botones
      ctx.strokeStyle = "#7a8a99";
      ctx.strokeRect(.5, 2.5, tmpW-.5, tmpUpH);
      ctx.strokeRect(.5, tmpCamvasH_upH-.5, tmpW-.5, tmpUpH);
      // triangulos de los botones
      var desp = 4;
      ctx.fillStyle = (this.down) ? "black" : "#333333";
      ctx.beginPath();
      ctx.moveTo(tmpW/2,   desp+2);
      ctx.lineTo(tmpW/2-7, tmpUpH-desp+2);
      ctx.lineTo(tmpW/2+7, tmpUpH-desp+2);
      ctx.closePath();
      ctx.moveTo(tmpW/2,   tmpCamvasH_upH+tmpUpH-desp);
      ctx.lineTo(tmpW/2-7, tmpCamvasH_upH+desp);
      ctx.lineTo(tmpW/2+7, tmpCamvasH_upH+desp);
      ctx.closePath();
      ctx.fill();
      
      // borde exterior
      ctx.strokeRect(.5, 1.5, tmpW-.5, this.canvasHeight-1.5);
      
      // el manipulador del scroll
      var tmpPos = MathFloor(this.pos);
      ctx.fillStyle = "#ccdcec";
      ctx.fillRect(0, tmpPos+.5, this.w, MathFloor(this.scrollManipulatorHeight));
      ctx.strokeStyle = "#6382bf";
      ctx.strokeRect(0, tmpPos+.5, this.w, MathFloor(this.scrollManipulatorHeight));
      // lineas del manipulador del scroll
      var smw = MathFloor(this.scrollManipulatorHeight/2);
      ctx.beginPath();
      ctx.moveTo(3,      tmpPos+smw+.5-2);
      ctx.lineTo(tmpW-3, tmpPos+smw+.5-2);
      ctx.moveTo(3,      tmpPos+smw+.5);
      ctx.lineTo(tmpW-3, tmpPos+smw+.5);
      ctx.moveTo(3,      tmpPos+smw+.5+2);
      ctx.lineTo(tmpW-3, tmpPos+smw+.5+2);
      ctx.stroke();
    }
  }
  
  /**
   * Valida si el valor que se le pasa esta en el rango determinado por los limites (minimo y maximo)
   * @param {String} value es el valor que se desea validar
   * @return {Number} regresa el valor que recibe como argumento si este se encuentra en dentro de los limites
   *                  si el valor es mayor que el limite maximo entonces se regresa el valor maximo
   *                  si el valor es menor que el limite minimo entonces se regresa el valor minimo
   */
  descartesJS.Scrollbar.prototype.validateValue = function(value) {
    var evaluator = this.evaluator;
    var resultValue = value.toString();
    resultValue = parseFloat( resultValue.replace(this.parent.decimal_symbol, ".") );

    // si el valor es una cadena que no representa un numero, la funcion parseFloat regresa NaN, entonces se ocupa el valor this.minimo
    if (!resultValue) {
      resultValue = 0; 
    }
    
    // si es menor que el valor this.minimo
    this.minimo = evaluator.evalExpression(this.min);
    if (resultValue < this.minimo) {
      this.value = null;
      resultValue = this.minimo;
    }

    // si es mayor que el valor maximo
    this.maximo = evaluator.evalExpression(this.max);
    if (resultValue > this.maximo) {
      this.value = null;
      resultValue = this.maximo;
    }

    var incr = this.incr;
    resultValue = (incr != 0) ? (resultValue*incr)/incr : 0;

//     if (this.discrete) {
//       var incr = this.incr;
//       resultValue = incr * Math.round(resultValue / incr);
//     }

    if (this.fixed) {
      resultValue = parseFloat(parseFloat(resultValue).toFixed(evaluator.evalExpression(this.decimals)));
    }

    return resultValue;
  }

  /**
   * El valor que se le pasa es formateado, mostrando los valores exponenciales, 
   * los decimales y el signo de puntuacion utilizado como separador de decimales
   * @param {String} value es el valor que se quiere formatear
   * @return {String} regresa el valor ya formateado
   */
  descartesJS.Scrollbar.prototype.formatOutputValue = function(value) {
    var resultValue = value+"";
    
    var decimals = this.evaluator.evalExpression(this.decimals);

    var indexDot = resultValue.indexOf(".");
    if ( indexDot != -1 ) {
      var subS = resultValue.substring(indexDot+1);
        if (subS.length > decimals) {
        resultValue = parseFloat(resultValue).toFixed(decimals);
      }
    }
    
    if (this.fixed) {
      resultValue = parseFloat(value).toFixed(decimals);
    }
    
    if (this.exponentialif) {
      resultValue = resultValue.toExponential(decimals);
      resultValue = resultValue.toUpperCase();
      resultValue = resultValue.replace("+", "")
    }

    resultValue = resultValue.replace(".", this.parent.decimal_symbol);
    return resultValue;
  }

  /**
   * Al valor de la barra se le suma el incremento, verifica que el valor este dentro del rango y lo asigna
   */
  descartesJS.Scrollbar.prototype.increase = function() {
    this.changeValue( parseFloat(this.value) + this.incr );
  }
  
  /**
   * Al valor de la barra se le resta el incremento, verifica que el valor este dentro del rango y lo asigna
   */
  descartesJS.Scrollbar.prototype.decrease = function() {
    this.changeValue( parseFloat(this.value) - this.incr );
  }

  /**
   * Al valor de la barra se le suma diez veces el incremento, verifica que el valor este dentro del rango y lo asigna
   */
  descartesJS.Scrollbar.prototype.increase10 = function() {
    var desp = (this.evaluator.evalExpression(this.max)-this.evaluator.evalExpression(this.min))/10;

    if (this.orientation == "horizontal") {
      if (this.clickPos.x > this.prePos) {
        this.changeValue( parseFloat(this.value) + desp );
      }
    } else {
      if (this.clickPos.y < this.prePos) {
        this.changeValue( parseFloat(this.value) + desp );
      }      
    }
  }
  
  /**
   * Al valor de la barra se le resta diez veces el incremento, verifica que el valor este dentro del rango y lo asigna
   */
  descartesJS.Scrollbar.prototype.decrease10 = function() {
    var desp = (this.evaluator.evalExpression(this.max)-this.evaluator.evalExpression(this.min))/10;

    if (this.orientation == "horizontal") {
      if (this.clickPos.x < this.prePos) {
        this.changeValue( parseFloat(this.value) - desp );
      } 
    } else {
      if (this.clickPos.y > this.prePos) {
        this.changeValue( parseFloat(this.value) - desp );
      } 
    }
  }
  
  /**
   * Actualiza el valor del barra con el valor del campo de texto
   */
  descartesJS.Scrollbar.prototype.changeValue = function(value) {
    if (this.evaluator.evalExpression(this.activeif) > 0) {
      var newValue = this.validateValue(value);

      // si cambio realmente el valor se actualiza todo
      if (newValue != this.value) {
        this.value = newValue;
        this.field.value = this.formatOutputValue(newValue);
        
        this.changeScrollPositionFromValue();

        this.prePos = this.pos;

        // se registra el valor de la variable
        this.evaluator.setVariable(this.id, this.value);

        // se actualizan los controles
        this.parent.updateControls();

        // ejecutamos la accion
        this.actionExec.execute();
        
        // se actualizan los controles
        this.parent.updateControls();

        // si la accion es animar, entonces no se actualizan los elementos
        if (this.action != "animate") {
          // se actualizan los valores
          this.parent.update();
        }
      }
    }
  }

  /**
   * Cambia el valor respecto a la posicion del scroll
   */
  descartesJS.Scrollbar.prototype.changeValueForScrollMovement = function() {
    var evaluator = this.evaluator;
    var limInf = this.scrollManipulatorLimInf;
    var limSup = this.scrollManipulatorLimSup;
    var min = evaluator.evalExpression(this.min);
    var max = evaluator.evalExpression(this.max);
    var incr = this.incr;
        
    var newValue = MathFloor( (((this.pos-limInf)*(max-min))/(limSup-limInf))/incr )*incr  +min;
    
    // si cambio realmente el valor se actualiza todo
    if (newValue != this.value) {
      this.value = newValue;
      this.field.value = this.formatOutputValue(newValue);
      
      // se registra el valor de la variable
      evaluator.setVariable(this.id, this.value);
      
      // se actualizan los controles
      this.parent.updateControls();
      // ejecutamos la accion
      this.actionExec.execute();
      // se actualizan los valores
      this.parent.update();
    }
  }
  
  /**
   * Cambia la posicion del scroll respecto a el valor
   */
  descartesJS.Scrollbar.prototype.changeScrollPositionFromValue = function() {
    var evaluator = this.evaluator;
    var limInf = this.scrollManipulatorLimInf;
    var limSup = this.scrollManipulatorLimSup;
    var min = evaluator.evalExpression(this.min);
    var max = evaluator.evalExpression(this.max);
    var incr = this.incr;
    
    this.pos = (((this.value-min)*(limSup-limInf))/(max-min))+limInf;
    
    if (this.orientation == "horizontal") {
      this.scrollManipulator.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + this.scrollManipulatorWidth + "px; height : " + this.h + "px; left: " + this.pos + "px; top: 0px;");    
    } else {
      this.scrollManipulator.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + this.w + "px; height : " + this.scrollManipulatorHeight + "px; left: 0px; top: " + this.pos + "px;");          
    }
  }
  
  /**
   * Registra los eventos del mouse del boton
   */
  descartesJS.Scrollbar.prototype.registerMouseEvents = function() {
    // copia de this para ser pasado a las funciones internas
    var self = this;
    var hasTouchSupport = descartesJS.hasTouchSupport;
    var delay = (hasTouchSupport) ? 500 : 200;
    var timer;

    this.canvas.oncontextmenu = function () { return false; };
    this.divUp.oncontextmenu = function () { return false; };
    this.divDown.oncontextmenu = function () { return false; };    
    
    /**
     * Se repite durante un determinado tiempo una funcion, sirve para repedir incrementos o decrementos en la barra al dejar presionado alguno de los botones
     * @param {Number} delayTime el tiempo que se debe esperar antes de ejectuar de nuevo la funcion
     * @param {Number} fun la funcion a ejecutar
     * @private
     */
    function repeat(delayTime, fun, firstTime, limit) {
      if ((self.up || self.down || self.canvasClick) && (Math.abs(self.value - limit) > .0000001)) {
        fun.call(self);
        delayTime = (firstTime) ? delayTime : 30;
        timer = setTimeout(function() { repeat(delayTime, fun, false, limit); }, delayTime);
      } else {
        clearInterval(timer);
      }
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado cuando se modifica el valor del campo de texto de la barra
     * @private
     */
    function onChange_TextField(evt) {
      self.changeValue(self.field.value);
      evt.preventDefault();
    }
//    this.field.addEventListener("change", onChange_TextField);


    /**
     * 
     * @param {Event} evt el evento lanzado cuando se modifica el valor del campo de texto de la barra
     * @private
     */
    function onKeyDown_TextField(evt) {
      // responde al enter
      if (evt.keyCode == 13) {
        self.changeValue(self.field.value);
      }
    }
    this.field.addEventListener("keydown", onKeyDown_TextField, false);
    
    /**
     * 
     * @param {Event} evt el evento lanzado cuando se presiona el boton del mouse sobre el fondo de la barra
     * @private
     */
    function onMouseDown_canvas(evt) {
      evt.preventDefault();

      // ie
      if (evt.which == null) {
        self.whichButton = (evt.button < 2) ? "LEFT" : ((evt.button == 4) ? "MIDDLE" : "RIGHT");
      } 
      // los demas
      else {
        self.whichButton = (evt.which < 2) ? "LEFT" : ((evt.which == 2) ? "MIDDLE" : "RIGHT");
      }

      if (self.whichButton == "LEFT") {
        if (self.evaluator.evalExpression(self.activeif) > 0) {
          self.clickPos = self.getCursorPosition(evt);
          self.canvasClick = true;
          
          if (self.orientation == "horizontal") {
            if (self.clickPos.x < self.prePos) {
              repeat(delay, self.decrease10, true, self.minimo);
            } 
            else {
              repeat(delay, self.increase10, true, self.maximo);
            }
          } 
          else {
            if (self.clickPos.y < self.prePos) {
              repeat(delay, self.increase10, true, self.maximo);
            } 
            else {
              repeat(delay, self.decrease10, true, self.minimo);
            }
          }
        }
      }
    }
    if (hasTouchSupport) {
      this.canvas.addEventListener("touchstart", onMouseDown_canvas, false);
    } else {
      this.canvas.addEventListener("mousedown", onMouseDown_canvas, false);
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de sacar el mouse del fondo de la barra
     * @private
     */
    function onMouseOut_canvas(evt) {
      self.canvasClick = false;
      clearInterval(timer);
      evt.preventDefault();
    }
    if (!hasTouchSupport) {
      this.divDown.addEventListener("mouseout", onMouseOut_DownButton, false);
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de soltar el click del mouse del fondo de la barra
     * @private
     */
    function onMouseUp_Canvas(evt) {
      self.canvasClick = false;
      clearInterval(timer);
      evt.preventDefault();
    }
    if (hasTouchSupport) {
      window.addEventListener("touchend", onMouseUp_Canvas, false);
    } else {
      window.addEventListener("mouseup", onMouseUp_Canvas, false);
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de mover el mouse sobre el fondo de la barra
     * @private
     */
    function onMouseMove_Canvas(evt) {
      if (self.canvasClick == true) {
        self.clickPos = self.getCursorPosition(evt);
        evt.preventDefault();
      }
    }
    if (hasTouchSupport) {
      this.canvas.addEventListener("touchmove", onMouseMove_Canvas, false);
    } else {
      this.canvas.addEventListener("mousemove", onMouseMove_Canvas, false);
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado cuando se presiona el boton del mouse sobre el manipulador de la barra
     * @private
     */
    function onMouseDown_scrollManipulator(evt) {
      if (self.evaluator.evalExpression(self.activeif) > 0) {
        self.scrollClick = true;
        
        self.initPos = self.getCursorPosition(evt);

        window.addEventListener("mouseup", onMouseUp_scrollManipulator, false);
        window.addEventListener("mousemove", onMouseMove_scrollManipulator, false);
        
        evt.preventDefault();
      }
    }

    /**
     * 
     * @param {Event} evt el evento lanzado cuando se presiona el boton del mouse sobre el manipulador de la barra
     * @private
     */
    function onTouchStart_scrollManipulator(evt) {
      if (self.evaluator.evalExpression(self.activeif) > 0) {
        self.scrollClick = true;
        
        self.initPos = self.getCursorPosition(evt);

        window.addEventListener("touchend", onTouchEnd_scrollManipulator, false);
        window.addEventListener("touchmove", onToucheMove_scrollManipulator, false);
        
        evt.preventDefault();
      }    
    }
    
    if (hasTouchSupport) {
      this.scrollManipulator.addEventListener("touchstart", onTouchStart_scrollManipulator, false);
    } else {
      this.scrollManipulator.addEventListener("mousedown", onMouseDown_scrollManipulator, false);
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado cuando se libera el boton del mouse sobre el manipulador de la barra
     * @private
     */
    function onMouseUp_scrollManipulator(evt) {
      self.scrollClick = false;

      self.prePos = self.pos;

      window.removeEventListener("mouseup", onMouseUp_scrollManipulator, false);
      window.removeEventListener("mousemove", onMouseMove_scrollManipulator, false);

      evt.preventDefault();
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado cuando se libera boton del mouse sobre el manipulador de la barra
     * @private
     */
    function onTouchEnd_scrollManipulator(evt) {
      self.scrollClick = false;

      self.prePos = self.pos;

      window.removeEventListener("touchend", onTouchEnd_scrollManipulator, false);
      window.removeEventListener("touchmove", onMouseMove_scrollManipulator, false);

      evt.preventDefault();
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado cuando se mueve el manipulador de la barra
     * @private
     */
    function onMouseMove_scrollManipulator(evt) {
      var newPos = self.getCursorPosition(evt);

      if (self.orientation == "horizontal") {
        self.pos = self.prePos - (self.initPos.x - newPos.x);

        if (self.pos < self.scrollManipulatorLimInf) {
          self.pos =  self.scrollManipulatorLimInf;
        }
      
        if (self.pos > self.scrollManipulatorLimSup) {
          self.pos =  self.scrollManipulatorLimSup;
        }

        self.scrollManipulator.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + self.scrollManipulatorWidth + "px; height : " + self.h + "px; left: " + self.pos + "px; top: 0px;"); 
      } else {
        self.pos = self.prePos - (self.initPos.y - newPos.y);

        if (self.pos > self.scrollManipulatorLimInf) {
          self.pos =  self.scrollManipulatorLimInf;
        }
      
        if (self.pos < self.scrollManipulatorLimSup) {
          self.pos =  self.scrollManipulatorLimSup;
        }
       
        self.scrollManipulator.setAttribute("style", "background-color: rgba(255, 255, 255, 0); cursor: pointer; position: absolute; width : " + self.w + "px; height : " + self.scrollManipulatorHeight + "px; left: 0px; top: " + self.pos + "px;"); 
      }
      
      // se cambia el valor apartir del valor del manipulador de la barra
      self.changeValueForScrollMovement();

      evt.preventDefault();
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de presionar la flecha hacia arriba de la barra
     * @private
     */
    function onMouseDown_UpButton(evt) {
      evt.preventDefault();

      // ie
      if (evt.which == null) {
        self.whichButton = (evt.button < 2) ? "LEFT" : ((evt.button == 4) ? "MIDDLE" : "RIGHT");
      } 
      // los demas
      else {
        self.whichButton = (evt.which < 2) ? "LEFT" : ((evt.which == 2) ? "MIDDLE" : "RIGHT");
      }

      if (self.whichButton == "LEFT") {
        if (self.evaluator.evalExpression(self.activeif) > 0) {
          self.up = true;
          repeat(delay, self.increase, true, self.maximo);
        }
      }
    }
    if (hasTouchSupport) {
      this.divUp.addEventListener("touchstart", onMouseDown_UpButton, false);
    } else {
      this.divUp.addEventListener("mousedown", onMouseDown_UpButton, false);
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de presionar la flecha hacia abajo de la barra
     * @private
     */
    function onMouseDown_DownButton(evt) {
      evt.preventDefault();

      // ie
      if (evt.which == null) {
        self.whichButton = (evt.button < 2) ? "LEFT" : ((evt.button == 4) ? "MIDDLE" : "RIGHT");
      } 
      // los demas
      else {
        self.whichButton = (evt.which < 2) ? "LEFT" : ((evt.which == 2) ? "MIDDLE" : "RIGHT");
      }

      if (self.whichButton == "LEFT") {
        if (self.evaluator.evalExpression(self.activeif) > 0) {
          self.down = true;
          repeat(delay, self.decrease, true, self.minimo);
        }
      }
    }
    if (hasTouchSupport) {
      this.divDown.addEventListener("touchstart", onMouseDown_DownButton, false);
    } else {
      this.divDown.addEventListener("mousedown", onMouseDown_DownButton, false);
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de sacar el mouse de la flecha hacia arriba de la barra
     * @private
     */
    function onMouseOut_UpButton(evt) {
      self.up = false;
      clearInterval(timer);
      evt.preventDefault();      
    }
    if (!hasTouchSupport) {
      this.divUp.addEventListener("mouseout", onMouseOut_UpButton, false);
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de sacar el mouse de la flecha hacia abajo de la barra
     * @private
     */
    function onMouseOut_DownButton(evt) {
      self.down = false;
      clearInterval(timer);
      evt.preventDefault();
    }
    if (!hasTouchSupport) {
      this.divDown.addEventListener("mouseout", onMouseOut_DownButton, false);
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de soltar la flecha hacia arriba de la barra
     * @private
     */
    function onMouseUp_UpButton(evt) {
      self.up = false;
      clearInterval(timer);
      evt.preventDefault();
    }
    if (hasTouchSupport) {
      window.addEventListener("touchend", onMouseUp_UpButton, false);
    } else {
      window.addEventListener("mouseup", onMouseUp_UpButton, false);
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de soltar la flecha hacia abajo de la barra
     * @private
     */
    function onMouseUp_DownButton(evt) {
      self.down = false;
      clearInterval(timer);
      evt.preventDefault();
    }
    if (hasTouchSupport) {
      window.addEventListener("touchend", onMouseUp_DownButton, false);
    } else {
      window.addEventListener("mouseup", onMouseUp_DownButton, false);
    }
    
  }
  
  /**
   * Se obtiene la posicion del mouse en coordenadas absolutas respecto al espacio donde se encuentra
   * @param {Event} evt evento que contiene la posicion del mouse
   * @return {Posicion} la posicion del mouse en coordenadas absolutas respecto al espacio donde se encuentra
   */
  descartesJS.Scrollbar.prototype.getCursorPosition = function(evt) {
    var pos = descartesJS.getCursorPosition(evt);

    return { x: pos.x - (this.containerControl.offsetLeft + this.containerControl.parentNode.offsetLeft + this.containerControl.parentNode.parentNode.offsetLeft),
             y: pos.y - (this.containerControl.offsetTop + this.containerControl.parentNode.offsetTop + this.containerControl.parentNode.parentNode.offsetTop)
           };
  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un audio de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el audio
   */
  descartesJS.Audio = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Control.call(this, parent, values);

    // se obtiene el contenedor al cual pertenece el control
    var container = this.getContainer();

    // el audio
    var expr = this.evaluator.evalExpression(this.expresion);
    if (expr[0].length == 4) {
      this.w = expr[0][2];
      this.h = expr[0][3];
    } else {
      this.w = 100;
      this.h = 28;
    }
    
    // parche provisional, para evitar que el control de audio se mueva en firefox
    var isFirefox = (navigator.userAgent.toLowerCase()).match("firefox")&&true;

    ////////////////////////////////////////////////////////////////////////////////
    // parche provisional, para evitar que el control de audio se mueva en firefox
    if (isFirefox) {
      this.audioContainer = document.createElement("div");
      this.audioContainer.setAttribute("style", "overflow: hidden; position: absolute; width: " + this.w + "px; height: 35px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    }
    ////////////////////////////////////////////////////////////////////////////////
    
    this.audio = this.parent.getAudio(this.file);
    
    if (this.autoplay) {
      this.audio.setAttribute("autoplay", "autoplay");
      this.audio.play();
    }
    
    if (this.loop) {
      this.audio.setAttribute("loop", "loop");
    }

//     if (this.controls) {
    this.audio.setAttribute("controls", "controls");
//     }

    // parche provisional, para evitar que el control de audio se mueva en firefox
    if (isFirefox) {
      this.audio.setAttribute("style", "position: absolute; width: " + this.w + "px; height: 100px; left: 0px; top: -65px;");
      // se agrega el audio al contenedor
      this.audioContainer.appendChild(this.audio);
    } else {
      this.audio.setAttribute("style", "position: absolute; width: " + this.w + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");      
    }

    // se agrega el contenedor del pulsador al contenedor del espacio, en orden inverso al que aparecen listados
    // por ultimo se agrega el contenedor del pulsador al contenedor del espacio, en orden inverso al que aparecen listados
    if (!container.childNodes[0]) {
      // parche provisional, para evitar que el control de audio se mueva en firefox
      if (isFirefox) {
        container.appendChild(this.audioContainer);
      } else {
        container.appendChild(this.audio);
      }
    } else {
      // parche provisional, para evitar que el control de audio se mueva en firefox
      if (isFirefox) {
        container.insertBefore(this.audioContainer, container.childNodes[0]);
      } else {
        container.insertBefore(this.audio, container.childNodes[0]);
      }
    }
    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Audio, descartesJS.Control);

  /**
   * Actualiza el audio
   */
  descartesJS.Audio.prototype.update = function() {
    var evaluator = this.evaluator;
    var changeX = false;
    var changeY = false;
    var changeW = false;
    var changeH = false;

    // se actualiza si el audio es visible o no
    if (evaluator.evalExpression(this.drawif) > 0) {
      this.audio.style.display = "block"
    } else {
      this.audio.style.display = "none";
      this.audio.pause();
    }    
    
    // se actualiza la poscion y el tamano del audio
    var expr = evaluator.evalExpression(this.expresion);
    changeX = (this.x != expr[0][0]);
    changeY = (this.y != expr[0][1]);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      changeW = (this.w != expr[0][2]);
      changeH = (this.h != expr[0][3]);
      this.w = expr[0][2];
      this.h = expr[0][3];
    }

    // se actualiza el estilo del audio si cambia su tamano o su posicion
//     if (changeW || changeH || changeX || changeY) {
//       if (this.w) {
//         this.audio.setAttribute("width", this.w);
//         this.audio.setAttribute("height", this.h);
//       }
//       this.audio.setAttribute("style", "position: absolute; left: " + this.y + "px; top: " + this.x + "px;");
//     }

  }
  
  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un video de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el video
   */
  descartesJS.Video = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Control.call(this, parent, values);

    var evaluator = this.evaluator;    
    
    // se obtiene el contenedor al cual pertenece el control
    var container = this.getContainer();
    
    var expr = this.evaluator.evalExpression(this.expresion);
    if (expr[0].length == 4) {
      this.w = expr[0][2];
      this.h = expr[0][3];
    } else {
      this.w = null;
      this.h = null;
    }
    
    // el video
    this.video = document.createElement("video");

    // se actualiza si el boton es visible o no
    if (evaluator.evalExpression(this.drawif) > 0) {
      this.video.style.display = "block"
    } else {
      this.video.style.display = "none";
      this.video.pause();
    }
    
    if (this.autoplay) {
      this.video.setAttribute("autoplay", "autoplay");
    }

    if (this.loop) {
      this.video.setAttribute("loop", "loop");
    }

//     if (this.controls) {
    this.video.setAttribute("controls","controls");
//     }

    if (this.poster) {
      this.video.setAttribute("poster", this.poster);
    }

    if (this.w) {
      this.video.setAttribute("width", this.w);
      this.video.setAttribute("height", this.h);
    }
    this.video.setAttribute("style", "position: absolute; overflow: hidden; left: " + this.x + "px; top: " + this.y + "px;");
//     this.video.setAttribute("style", "position: absolute; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    
    var fileName = this.file;
    var indexDot = this.file.lastIndexOf(".");
    
    if (indexDot != -1) {
      fileName = this.file.substring(0, indexDot);
    }
    
    var src = document.createElement("source");
    src.setAttribute("src", fileName + ".ogg");
    src.setAttribute("type", "video/ogg");
    this.video.appendChild(src);

    src = document.createElement("source");    
    src.setAttribute("src", fileName + ".mp4");
    src.setAttribute("type", "video/mp4");
    this.video.appendChild(src);

    src = document.createElement("source");    
    src.setAttribute("src", fileName + ".webm");
    src.setAttribute("type", "video/webm");
    this.video.appendChild(src);
    
    // se agrega el contenedor del pulsador al contenedor del espacio, en orden inverso al que aparecen listados
    // por ultimo se agrega el contenedor del pulsador al contenedor del espacio, en orden inverso al que aparecen listados
    if (!container.childNodes[0]) {
      container.appendChild(this.video);
    } else {
      container.insertBefore(this.video, container.childNodes[0]);
    }
    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Video, descartesJS.Control);

  /**
   * Actualiza el video
   */
  descartesJS.Video.prototype.update = function() {
    var evaluator = this.evaluator;
    var changeX = false;
    var changeY = false;
    var changeW = false;
    var changeH = false;

    // se actualiza si el video es visible o no
    if (evaluator.evalExpression(this.drawif) > 0) {
      this.video.style.display = "block"
    } else {
      this.video.style.display = "none";
      this.video.pause();
    }    

    // se actualiza la poscion y el tamano del boton
    var expr = evaluator.evalExpression(this.expresion);
    changeX = (this.x != expr[0][0]);
    changeY = (this.y != expr[0][1]);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      changeW = (this.w != expr[0][2]);
      changeH = (this.h != expr[0][3]);
      this.w = expr[0][2];
      this.h = expr[0][3];
    }

    // se actualiza el estilo del boton si cambia su tamano o su posicion
//     if (changeW || changeH || changeX || changeY) {
//       if (this.w) {
//         this.video.setAttribute("width", this.w);
//         this.video.setAttribute("height", this.h);
//       }
//       this.video.setAttribute("style", "position: absolute; overflow: hidden; left: " + this.y + "px; top: " + this.x +  + "px; z-index: " + this.zIndex + ";");
//       this.video.setAttribute("style", "position: absolute; left: " + this.y + "px; top: " + this.x +  + "px; z-index: " + this.zIndex + ";");
//     }

  }
    
  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;

  /**
   * Un campo de texto de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el campo de texto
   */
  descartesJS.TextArea = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Control.call(this, parent, values);

    // siempre van en la region interior
    this.region = "interior";

    // el indice de tabulacion del campo de texto, que determina el orden en el que se salta cuando se presiona el tabulador
    this.tabindex = ++this.parent.tabindex;

    // la respuesta existe
    if (this.answer) {
      // la respuesta esta encriptada
      if (this.answer.match("krypto_")) {
        var krypt = new descartesJS.Krypto();
        this.answer = krypt.decode(this.answer.substring(7));
      }
    }
    
    // contenedor del espacio
    var container = this.getContainer();

    // contenedor del control
    this.containerControl = document.createElement("div");

    // area de texto
    this.textArea = document.createElement("div");
    // area de texto de la respuesta
    this.textAreaAnswer = document.createElement("div");
    // boton para mostrar respuesta
    this.showButton = document.createElement("div");
    // active cover
    this.activeCover = document.createElement("div");
    
    this.containerControl.appendChild(this.textArea);
    this.containerControl.appendChild(this.textAreaAnswer);
    this.containerControl.appendChild(this.showButton);
    this.containerControl.appendChild(this.activeCover);
    
    // por ultimo se agrega el contenedor del pulsador al contenedor del espacio, en orden inverso al que aparecen listados
    if (!container.childNodes[0]) {
      container.appendChild(this.containerControl);
    } else {
      container.insertBefore(this.containerControl, container.childNodes[0]);
    }
    
    ////////////////////////////////////////////
    // se inicia el texto
    ////////////////////////////////////////////
    this.showAnswer = false;
    // texto sin formato
    if (this.text.type == undefined) {
      this.text = this.rawText;
    }
    else {
      if (this.text.hasFormula) {
        this.text = this.rawText;
      }
      else {
        this.text = this.text.toHTML();
      }
    }
    
    // answer
    var parseAnswer = this.parent.lessonParser.parseText(this.answer);
    // rtf answer
    if (parseAnswer.type != undefined) {
      if (!this.text.hasFormula) {
        this.answer = parseAnswer.toHTML();
      }
    }
   
    this.evaluator.setVariable(this.id, this.text);
    ////////////////////////////////////////////    

    this.drawButton();
    
    this.init();
    
    // se registran los eventos del mouse, cuando se de soporte a dispositivos moviles se deben de registrar los eventos correspondientes
    this.registerMouseEvents();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.TextArea, descartesJS.Control);

  /**
   * Inicia los valores del pulsador
   */
  descartesJS.TextArea.prototype.init = function() {
    var displaceY = (this.answer) ? 28 : 8;
    evaluator = this.evaluator;
    
    this.text = evaluator.getVariable(this.id);

    this.containerControl.setAttribute("class", "DescartesTextAreaContainer");
    this.containerControl.setAttribute("style", "width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    this.containerControl.style.display = (evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
    this.containerControl.setAttribute("spellcheck", "false");

    // area de texto
    this.textArea.setAttribute("class", "DescartesTextAreaContainer");
    this.textArea.setAttribute("style", "width: " + (this.w-8) + "px; height: " + (this.h-displaceY) + "px; left: 4px; top: 4px; background-color: white; text-align: left; font: " + descartesJS.convertFont(this.font) + ";");
    this.textArea.setAttribute("contenteditable", "true");
    
    this.textArea.innerHTML = "<span style='position: relative; top: 10px; left: 10px; white-space: nowrap;' >" + this.text + "</span>";
    
    // area de respuesta
    this.textAreaAnswer.setAttribute("class", "DescartesTextAreaContainer");
    this.textAreaAnswer.setAttribute("style", "width: " + (this.w-8) + "px; height: " + (this.h-displaceY) + "px; left: 4px; top: 4px; background-color: white; text-align: left; font: " + descartesJS.convertFont(this.font) + ";");
    this.textAreaAnswer.style.display = (this.showAnswer) ? "block" : "none";

    this.textAreaAnswer.innerHTML = "<span style='position: relative; top: 10px; left: 10px; white-space: nowrap;'>" + this.answer + "</span>";
    
    // boton para mostrar respuesta
    this.showButton.setAttribute("style", "width: 20px; height: 16px; position: absolute; bottom: 4px; right: 4px; cursor: pointer;");
    this.showButton.style.backgroundImage = "url(" + this.imageUnPush + ")";
    this.showButton.innerHTML = "<span style='position: relative; top: 2px; text-align: center; font: 9px Arial'> S </span>";
    
    this.activeCover.setAttribute("style", "position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px;");
    this.activeCover.style.display = (evaluator.evalExpression(this.activeif) > 0) ? "none" : "block";
  }
  
  /**
   * 
   */
  descartesJS.TextArea.prototype.drawButton = function() {
    var w = 20;
    var h = 16;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    var ctx = canvas.getContext("2d");

    var linearGradient = ctx.createLinearGradient(0, 0, 0, h);
    var hh = h*h;
    var di;
    
    for (var i=0; i<h; i++) {
      di = MathFloor(i-(35*h)/100);
      linearGradient.addColorStop(i/h, "rgba(0,0,0,"+ ((di*di*192)/hh)/255 +")");
    }
 
    ctx.lineWidth = 1;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h); 
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, w, h);
    descartesJS.drawLine(ctx, w-1, 0, w-1, h, "rgba(0,0,0,"+(0x80/255)+")");
    descartesJS.drawLine(ctx, 0, 0, 0, h, "rgba(0,0,0,"+(0x18/255)+")");
    descartesJS.drawLine(ctx, 1, 0, 1, h, "rgba(0,0,0,"+(0x08/255)+")");
    this.imageUnPush = canvas.toDataURL();

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h); 
    ctx.fillStyle = linearGradient;
    ctx.fillRect(0, 0, w, h);
    descartesJS.drawLine(ctx, 0, 0, 0, h-2, "gray");
    descartesJS.drawLine(ctx, 0, 0, w-1, 0, "gray"); 
    ctx.fillStyle = "rgba(0, 0, 0,"+(0x18/255)+")";
    ctx.fillRect(0, 0, this.w, this.h);
//     descartesJS.drawLine(ctx, 0, 0, 0, h, "rgba(0,0,0,"+(0x18/255)+")");
//     descartesJS.drawLine(ctx, 1, 0, 1, h, "rgba(0,0,0,"+(0x08/255)+")");

    this.imagePush = canvas.toDataURL();
   }
  
  /**
   * Actualiza el campo de texto
   */
  descartesJS.TextArea.prototype.update = function() {
    evaluator = this.evaluator;

    evaluator.setVariable(this.id, this.text);

    var changeX = false;
    var changeY = false;
    var changeW = false;
    var changeH = false;

    // se actualiza la propiedad de activacion
    this.activeCover.style.display = (evaluator.evalExpression(this.activeif) > 0) ? "none" : "block";
    
    // se actualiza si el campo de texto es visible o no
    this.containerControl.style.display = (evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";

    // se actualiza la poscion y el tamano del campo de texto
    var expr = evaluator.evalExpression(this.expresion);
    changeX = (this.x != expr[0][0]);
    changeY = (this.y != expr[0][1]);
    this.x = expr[0][0];
    this.y = expr[0][1];
    if (expr[0].length == 4) {
      changeW = (this.w != expr[0][2]);
      changeH = (this.h != expr[0][3]);
      this.w = expr[0][2];
      this.h = expr[0][3];
    }

    // se actualiza el estilo del campo de texto si cambia su tamano o su posicion
    if (changeW || changeH || changeX || changeY) {
      this.init();
    }
  }

  /**
   * Se registran los eventos del mouse del boton
   */
  descartesJS.TextArea.prototype.registerMouseEvents = function() {
    // copia de this para ser pasado a las funciones internas
    var self = this;

    /**
     * @param {Event} evt el evento lanzado cuando da click en el boton
     * @private
     */
    function onMouseDown(evt) {
      evt.preventDefault();
      self.showAnswer = !self.showAnswer;
      self.textAreaAnswer.style.display = (self.showAnswer) ? "block" : "none";
//       self.showButton.innerHTML = (self.showAnswer) ? "<span style='position: relative; top: 2px; text-align: center; font: 11px Arial'> T </span>" : "<span style='position: relative; top: 2px; text-align: center; font: 11px Arial'> S </span>";
//       console.log(self.showButton.childNodes[0].childNodes[0].textContent)
      self.showButton.childNodes[0].childNodes[0].textContent = (self.showAnswer) ? "T" : "S";
      self.showButton.style.backgroundImage = "url(" + self.imagePush + ")";

    }
    this.showButton.addEventListener("mousedown", onMouseDown);    

    /**
     * @param {Event} evt el evento lanzado cuando da click en el boton
     * @private
     */
    function onMouseUp(evt) {
      evt.preventDefault();
      self.showButton.style.backgroundImage = "url(" + self.imageUnPush + ")";
    }
    this.showButton.addEventListener("mouseup",  onMouseUp);
    this.showButton.addEventListener("mouseout", onMouseUp);
  }
  
  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un parser de elementos principales de una leccion de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   */
  descartesJS.LessonParser = function(parent) {
    this.parent = parent;

    // el parser de la leccion
    this.parser = this.parent.evaluator.parser;
  }

  /**
   * Parsea la configuración de los botones
   * @param {String} values es la cadena que contiene los valores de configuracion de los botones
   * @return {Object} regresa un objeto de configuracion con los valores correspondientes
   */
  descartesJS.LessonParser.prototype.parseButtonsConfig = function(values) {
    var buttonConfigObj = { rowsNorth: 0, rowsSouth: 0, widthEast: 125, widthWest: 125, height: 23 };

    // variable temporal para fines de calculos intermedios
    var temp;
    
    // se eliminan las comillas sencillas de la cadena de valores que definen el espacio y se dividen los valores, en el nombre del parametro y su valor
    values = this.split(values);
    
    var values_i_0, values_i_1;
    // se recorren todos los valores y se asignan a las variables del espacio
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      switch(babel[values_i_0]) {
        //
        case("rowsNorth"):
          buttonConfigObj["rowsNorth"] = parseInt(values_i_1);
          break;

        //
        case("rowsSouth"):
          buttonConfigObj["rowsSouth"] = parseInt(values_i_1);
          break;

        //
        case("widthEast"):
          buttonConfigObj["widthEast"] = parseInt(values_i_1);
          break;

        //
        case("widthWest"):
          buttonConfigObj["widthWest"] = parseInt(values_i_1);
          break;

        //
        case("height"):
          buttonConfigObj["height"] = parseInt(values_i_1);
          break;

        //
        case("about"):
          buttonConfigObj["about"] = (babel[values_i_1] == "true");
          break;

        //
        case("config"):
          buttonConfigObj["config"] = (babel[values_i_1] == "true");
          break;

        //
        case("init"):
          buttonConfigObj["init"] = (babel[values_i_1] == "true");
          break;

        //
        case("clear"):
          buttonConfigObj["clear"] = (babel[values_i_1] == "true");
          break;

        // cualquier variable que falte
        default:
          console.log("----- attributo de Espacio no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
          break;
      }
    }

    return buttonConfigObj;
  }
  
  /**
   * Parsea y crea un espacio
   * @param {String} values es la cadena que contiene los valores que definen el espacio
   * @return {Space} regresa un espacio con los valores correspondientes
   */
  descartesJS.LessonParser.prototype.parseSpace = function(values) {
    // el objeto que contendra todos los valores encontrados en values
    var spaceObj = {};
    
    // variable temporal para fines de calculos intermedios
    var temp;
    
    // se eliminan las comillas sencillas de la cadena de valores que definen el espacio y se dividen los valores, en el nombre del parametro y su valor
    values = this.split(values);
    
    var values_i_0, values_i_1;
    // se recorren todos los valores y se asignan a las variables del espacio
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];
      
      switch(babel[values_i_0]) {
        // se encuentra el tipo del espacio 2D, 3D u otro
        case("type"):
          spaceObj["type"] = values_i_1;
          break;
          
        // se encuentra el identificador del espacio 
        case("id"):
          spaceObj["id"] = values_i_1;
          break;
          
        // se encuentra la expresion que determina la posicion x del espacio
        case("x"):
          temp = values_i_1;
          
          // si esta especificado con un porcentaje se utiliza el ancho del contenedor padre para obtener el valor en pixeles
          if (temp[temp.length-1] == "%") {
            temp = (this.parent.container.width*parseFloat(temp)/100).toString();
          } 
          // si no esta especificado con un porcentaje se obtiene el valor numerico de la posicion en x
          else {
            temp = values_i_1;
          }
          
          spaceObj["xExpr"] = this.parser.parse(temp);
          break;
          
        // se encuentra la expresion que determina la posicion y del espacio
        case("y"):
          temp = values_i_1;
          
          // si esta especificado con un porcentaje se utiliza el alto del contenedor padre para obtener el valor en pixeles
          if (temp[temp.length-1] == "%") {
            temp = (this.parent.container.height*parseFloat(temp)/100).toString();
          } 
          // si no esta especificado con un porcentaje se obtiene el valor numerico de la posicion en x
          else {
            temp = values_i_1;
          }
          
          spaceObj["yExpr"] = this.parser.parse(temp);
          break;
          
        // se encuentra el ancho del espacio
        case("width"):
          temp = values_i_1;
          
          // si esta especificado con un porcentaje se utiliza el ancho del contenedor padre para obtener el valor en pixeles
          if (temp[temp.length-1] == "%") {
            temp = this.parent.container.width*parseFloat(temp)/100;
          } 
          // si no esta especificado con un porcentaje se obtiene el valor numerico del ancho
          else {
            temp = parseFloat(values_i_1);
            
            // si al convertir el valor a un numero los valores son diferentes, entonces el ancho se vuelve el ancho del contenedor padre
            if (temp != values_i_1) {
              temp = this.parent.container.width; // valor por default
            }
          }
          
          spaceObj["w"] = temp;
          break;
          
        // se encuentra el alto del espacio
        case("height"):
          temp = values_i_1;
          
          // si esta especificado con un porcentaje se utiliza el alto del contenedor padre para obtener el valor en pixeles
          if (temp[temp.length-1] == "%") {
            temp = this.parent.container.height*parseFloat(temp)/100;
          } 
          // si no esta especificado con un porcentaje se obtiene el valor numerico del alto
          else {
            temp = parseFloat(values_i_1);
            
            // si al convertir el valor a un numero los valores son diferentes, entonces el ancho se vuelve el alto del contenedor padre
            if (temp != values_i_1) {
              temp = this.parent.container.height; // valor por default
            }
          }
          
          spaceObj["h"] = temp;
          break;
          
        // se encuentra la condicion de dibujo del espacio
        case("drawif"):
          spaceObj["drawif"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra si el espacio esta fijo
        case("fixed"):
          spaceObj["fixed"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra la escala del espacio
        case("scale"):
          temp = parseFloat(values_i_1);
          
          // si al convertir el valor a un numero los valores son diferentes, entonces se utiliza el valor por default
          if (temp != values_i_1) {
            temp =  48; // valor por default
          }          
          
          spaceObj["scale"] = temp;
          break;
          
        // se encuentra la posicion x del origen del espacio
        case("O.x"):
          spaceObj["OxExpr"] = values_i_1;
          break;
          
        // se encuentra la posicion y del origen del espacio
        case("O.y"):
          spaceObj["OyExpr"] = values_i_1;
          break;
          
        // se encuentra la imagen de fondo del espacio
        case("image"):
          spaceObj["imageSrc"] = values_i_1;
          break;
          
        // se encuentra la forma en que esta colocada la imagen
        case("bg_display"):
          spaceObj["bg_display"] = babel[values_i_1];
          break;
          
        // se encuentra el color del fondo
        case("background"):
          spaceObj["background"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra el color de la red
        case("net"):
          if (babel[values_i_1] == "false"){
            spaceObj["net"] = "";
          } else {
            spaceObj["net"] = this.convertColor(values_i_1);
          }
          break;
          
        // se encuentra el color de la red10
        case("net10"):
          if (babel[values_i_1] == "false"){
            spaceObj["net10"] = "";
          } else {
            spaceObj["net10"] = this.convertColor(values_i_1);
          }
          break;
          
        // se encuentra el color de los ejes
        case("axes"):
          if (babel[values_i_1] == "false"){
            spaceObj["axes"] = "";
          } else {
            spaceObj["axes"] = this.convertColor(values_i_1);
          }
          break;
          
        // se encuentra el color del texto que muestra las coordenadas del mouse
        case("text"):
          if (babel[values_i_1] == "false"){
            spaceObj["text"] = "";
          } else {
            spaceObj["text"] = this.convertColor(values_i_1);
          }
          break;
          
        // se encuentra si los numeros del espacio estan activados
        case("numbers"):
          spaceObj["numbers"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el texto que lleva el eje X
        case("x-axis"):
          if (babel[values_i_1] == "false"){
            spaceObj["x_axis"] = "";
          }
          else {
            spaceObj["x_axis"] = values_i_1;
          }
          break;
          
        // se encuentra el texto que lleva el eje Y
        case("y-axis"):
          if (babel[values_i_1] == "false"){
            spaceObj["y_axis"] = "";
          }
          else {
            spaceObj["y_axis"] = values_i_1;
          }
          break;
          
        // se encuentra si el espacio es sensible a los movimientos del mouse
        case("sensitive_to_mouse_movements"):
          spaceObj["sensitive_to_mouse_movements"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el cID del espacio
        case("cID"):
          spaceObj["cID"] = values_i_1;
          break;
          
        // espacio 3D
        case("R3"):
          spaceObj["R3"] = (babel[values_i_1] == "true");
          break;
          
        // modo de despliege sort, painter, raytrace
        case("render"):
          spaceObj["render"] = babel[values_i_1];
          break;
          
        // opcion de cortado del algoritmo de desplegado
        case("split"):
          spaceObj["split"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el nombre del archivo de un espacio de aplicacion de descartes
        case("file"):
          spaceObj["file"] = values_i_1;
          break;
          
        // cualquier variable que falte
        default:
          console.log("----- attributo de Espacio no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
          break;
      }   
    }

    // espacio 2D
    if ((spaceObj.type == "R2") || (this.parent.version == 2)) {
      return new descartesJS.Space2D(this.parent, spaceObj);
    }
    
    // espacio 3D
    else if (spaceObj.type == "R3") {
      return new descartesJS.Space3D(this.parent, spaceObj);
      // console.log("Los espacios 3D no funcionan.");
    }

    // espacio de aplicacion de descartes
    else if (spaceObj.type == "AP") {
      return new descartesJS.SpaceAP(this.parent, spaceObj);
    }
    
    // espacio de aplicacion de descartes
    else if (spaceObj.type == "HTMLIFrame") {
      return new descartesJS.SpaceHTML_IFrame(this.parent, spaceObj);
    }
  }

  /**
   * Parsea y crea un control
   * @param {String} values es la cadena que contiene los valores que definen el control
   * @return {Control} regresa un control con los valores correspondientes
   */
  descartesJS.LessonParser.prototype.parseControl = function(values) {
    // el objeto que contendra todos los valores encontrados en values
    var controlObj = {};
    
    // se eliminan las comillas sencillas de la cadena de valores que definen el control y se dividen los valores, en el nombre del parametro y su valor
    values = this.split(values);

    var values_i_0, values_i_1;
    
    // se recorren todos los valores y se asignan a las variables del control
    for (var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      switch( babel[values_i_0]) {
        
        // se encuentra el id del control
        case("id"):
          controlObj["id"] = values_i_1;
          break;
          
        // se encuentra el tipo del control
        case("type"):
          controlObj["type"] = babel[values_i_1.trim()];
          break;
          
        // se encuentra la interfaz del control (que tipo es, si es pulsador o boton, etc)
        case("gui"):
          controlObj["gui"] = babel[values_i_1];
          break;
          
        // se encuentra la region del control
        case("region"):
          controlObj["region"] = babel[values_i_1];
          break;
          
        // se encuentra el id del espacio del control
        case("space"):
          controlObj["spaceID"] = values_i_1;
          break;
          
        // se encuentra el texto del control
        case("name"):
          controlObj["name"] = values_i_1;
          break;
          
        // se encuentra la expresión que define la posición y el tamaño del control
        case("expresion"):
          controlObj["expresion"] = this.parser.parse(values_i_1.replace(")(", ","));
          break;
          
        // se encuentra si los valores del control se expresan en notacion fija
        case("fixed"):
          controlObj["fixed"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el control es visible
        case("visible"):
          controlObj["visible"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el color del texto del control
        case("color"):
          controlObj["color"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra el color-int del texto del control
        case("colorInt"):
          controlObj["colorInt"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra si el texto del control esta en negrita
        case("bold"):
          if (babel[values_i_1] != "false") {
            controlObj["bold"] = "bold";
          }
          break;
          
        // se encuentra si el texto del control esta en cursiva
        case("italics"):
          if (babel[values_i_1] != "false") {
            controlObj["italics"] = "italic";
          }
          break;
          
        // se encuentra si el texto del control esta subrayada
        case("underlined"):
          if (babel[values_i_1] != "false") {
            controlObj["underlined"] = true;
          }
          break;
          
        // se encuentra el tamano del texto del control
        case("font_size"):
          controlObj["font_size"] = this.parser.parse(values_i_1); //parsear la posible expresion
          break;
          
        // se encuentra la imagen de fondo del control
        case("image"):
          controlObj["imageSrc"] = values_i_1;
          break;
          
        // se encuentra el tipo de accion que realizara el control
        case("action"):
          controlObj["action"] = babel[values_i_1];
          break;
          
        // se encuentra el parametro que debe ejecutar el control cuando se ejecute la accion
        case("parameter"):
          controlObj["parameter"] = values_i_1;
          break;
          
        // se encuentra la condicion de dibujo del control
        case("drawif"):
          controlObj["drawif"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la condicion de activacion del control
        case("activeif"):
          controlObj["activeif"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el tooltip del control
        case("tooltip"):
          controlObj["tooltip"] = values_i_1;
          break;
          
        // se encuentra la tipografia del tooltip del control
        case("tooltipFont"):
          controlObj["tooltipFont"] = values_i_1;
          break;
          
        // se encuentra la explicacion del control
        case("Explanation"):
          controlObj["Explanation"] = values_i_1;
          break;
          
        // se encuentra la tipografia de la explicacion del control
        case("ExplanationFont"):
          controlObj["ExplanationFont"] = values_i_1;
          break;
          
        // se encuentra la posicion relativa de los mensajes
        case("msg_pos"):
          controlObj["msg_pos"] = babel[values_i_1];
          break;
          
        // se encuentra el cID del control
        case("cID"):
          controlObj["cID"] = values_i_1;
          break;
          
        // se encuentra el valor del pulsador
        case("value"):
          var tmpVal = values_i_1.replace(/&squot;/g, "'");

          // si el control inicia y termina con || se sustituye por ''
          if (tmpVal.match(/^\|/)) {
            tmpVal = "'" + tmpVal.substring(1);
            if (tmpVal.match(/\|$/)) {
              tmpVal = tmpVal.substring(0, tmpVal.length-1) + "'";
            }
          }
          
          controlObj["valueExpr"] = this.parser.parse(tmpVal);
          controlObj["valueExprString"] = tmpVal;
          
          break;
          
        // se encuentra el numero de decimales del pulsador
        case("decimals"):
          controlObj["decimals"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el valor minimo del pulsador
        case("min"):
          controlObj["min"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el valor maximo del pulsador
        case("max"):
          controlObj["max"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el incremento del pulsador
        case("incr"):
          if (values_i_1 != 0) {
            controlObj["incr"] = this.parser.parse(values_i_1);
          }
          break;
          
        // se encuentra si el incremento es discreto en el pulsador
        case("discrete"):
          controlObj["discrete"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el campo de texto es solo de texto
        case("onlyText"):
          controlObj["onlyText"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el campo de texto es evaluado
        case("evaluate"):
          controlObj["evaluate"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el patron de respuesta del campo de texto
        case("answer"):
          controlObj["answer"] = values_i_1;
          break;
          
        // se encuentra la condicion para mostrar los valores con notacion exponecial
        case("exponentialif"):
          controlObj["exponentialif"] = parseFloat(values_i_1); //parsear la posible expresion
          break;

        // se encuentra el tamano del control grafico
        case("size"):
          controlObj["size"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la constriccion del control grafico
        case("constraint"):
          controlObj["constraintExpr"] = values_i_1;
          break;
          
        // se encuentra el texto del control grafico
        case("text"):
          // texto de un control de texto
          controlObj["rawText"] = values_i_1;
          
          var tmpText = this.parseText(values_i_1);
          for (var ii=0, ll=tmpText.length; ii<ll; ii++) {
            tmpText[ii] = this.parser.parse(tmpText[ii], false);
          }
          controlObj["text"] = tmpText;
          break;
          
        // se encuentra si el control grafico deja rastro
        case("trace"):
          controlObj["trace"] = this.convertColor(values_i_1);
          break;
          
        // se encuentran las opciones del menu
        case("options"):
          controlObj["options"] = values_i_1;
          break;
          
        // se encuentra la fuente del control grafico
        case("font"):
          controlObj["font"] = values_i_1;
          break;
          
        // se encuentra el nombre del archivo del video o del audio
        case("file"):
          controlObj["file"] = values_i_1;
          break;
          
        // se encuentra si el video o el audio se reproduce automaticamente //no funciona en el ipad
        case("autoplay"):
          controlObj["autoplay"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el video o el audio se reproduce en un ciclo
        case("loop"):
          controlObj["loop"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el video o el audio presenta los controles
        case("controls"):
          controlObj["controls"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el video tiene una imagen que mostrar
        case("poster"):
          controlObj["poster"] = babel[values_i_1];
          break;
          
        // cualquier variable que falte
        default:
          var ind    = values_i_0.indexOf(".");
          var prefix = babel[values_i_0.substring(0,ind)];
          var sufix  = babel[values_i_0.substring(ind+1)];
          
          // se encuentra la tipografia del parametro
          if ((prefix == "parameter") && (sufix == "font")) {
            controlObj["parameterFont"] = values_i_1;
            break;
            
          // se encuentra la tipografia de la explicacion
          } else if ((prefix == "Explanation") && (sufix == "font")) {
            controlObj["ExplanationFont"] = values_i_1;
            break;
            
          // se encuentra la tipografia del tooltip
          } else if ((prefix == "tooltip") && (sufix == "font")) {
            controlObj["tooltipFont"] = values_i_1;
            break;            
          }
         
          console.log("----- attributo de control no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
          break;
      }
    }

    // si el tipo de control es numerico 
    if (controlObj.type == "numeric") {

      // un pulsador
      if ((controlObj.gui == undefined) || (controlObj.gui == "spinner")) {
        return new descartesJS.Spinner(this.parent, controlObj);
      }
      
      // un boton
      else if (controlObj.gui == "button") {
        return new descartesJS.Button(this.parent, controlObj);
      }

      // un campo de texto
      else if (controlObj.gui == "textfield") {
        return new descartesJS.TextField(this.parent, controlObj);
      }
      
      // un menu
      else if (controlObj.gui == "menu") {
        return new descartesJS.Menu(this.parent, controlObj);
      }
      
      // un scrollbar
      else if (controlObj.gui == "scrollbar") {
        return new descartesJS.Scrollbar(this.parent, controlObj);
      }

    }
    
    // si el tipo de control es video
    else if (controlObj.type == "video") {
      return new descartesJS.Video(this.parent, controlObj);
    }
    
    // si el tipo de control es audio
    else if (controlObj.type == "audio") {
      return new descartesJS.Audio(this.parent, controlObj);
    }
    
    // si el tipo de control es grafico
    else if (controlObj.type == "graphic") {
      return new descartesJS.GraphicControl(this.parent, controlObj);
    }
    
    // si el tipo de control es de texto
    else if (controlObj.type == "text") {
      return new descartesJS.TextArea(this.parent, controlObj);
    }

  }

  /**
   * Parsea y crea un grafico
   * @param {String} values es la cadena que contiene los valores que definen el grafico
   * @return {Graphic} regresa un grafico con los valores correspondientes
   */
  descartesJS.LessonParser.prototype.parseGraphic = function(values, abs_coord, background, rotateExp) { 
    // el objeto que contendra todos los valores encontrados en values
    var graphicObj = { rotateExp:rotateExp };
    graphicObj["parameter"] = "t";

    // se eliminan las comillas sencillas de la cadena de valores que definen el grafico y se dividen los valores, en el nombre del parametro y su valor
    values = this.split(values);

    var values_i_0, values_i_1;
    // se recorren todos los valores y se asignan a las variables del grafico
    for(var i=0, l=values.length; i<l; i++){
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];
      
      switch(babel[values_i_0]){
        
        // se encuentra el id del espacio del grafico
        case("space"):
          graphicObj["spaceID"] = values_i_1;
          break;
          
        // se encuentra el tipo de grafico
        case("type"):
          graphicObj["type"] = babel[values_i_1];
          break;
          
        // se encuentra si el grafico debe dibujarse en el fondo
        case("background"):
          graphicObj["background"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el color del grafico
        case("color"):
          graphicObj["color"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra la condicion de dibujo del grafico
        case("drawif"):
          graphicObj["drawif"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra si el grafico utiliza coordenadas absolutas
        case("abs_coord"):
          graphicObj["abs_coord"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra la expresión del grafico
        case("expresion"):
          if (graphicObj.type != "macro") {
            graphicObj["expresion"] = this.parser.parse(values_i_1);
            graphicObj["expresionString"] = values_i_1;
          } else {
            graphicObj["expresion"] = values_i_1;
          }
          break;
          
        // se encuentra el color del rastro que deja el grafico
        case("trace"):
          graphicObj["trace"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra que variable se utiliza como parametro para una familia
        case("family"):
          graphicObj["family"] = values_i_1;
          break;
          
        // se encuentra que variable se utiliza como parametro para una familia
        case("parameter"):
          graphicObj["parameter"] = values_i_1;
          break;
          
        // se encuentra el color del relleno del grafico
        case("fill"):
          graphicObj["fill"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra el color del relleno+ del grafico
        case("fillP"):
          graphicObj["fillP"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra el color del relleno- del grafico
        case("fillM"):
          graphicObj["fillM"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra el ancho de la linea del grafico
        case("width"):
          graphicObj["width"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra si el grafico es visible
        case("visible"):
          graphicObj["visible"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el grafico es editable
        case("editable"):
          graphicObj["editable"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra la info del grafico
        case("info"):
          graphicObj["info"] = values_i_1;
          break;
          
        // se encuentra el texto del grafico
        case("text"):
          // var tmpText = this.parseText(values_i_1);

          // for (var ii=0, ll=tmpText.length; ii<ll; ii++) {
          //   tmpText[ii] = this.parser.parse(tmpText[ii], false);
          // }
          // graphicObj["text"] = tmpText;
          graphicObj["text"] = this.parseText(values_i_1);
          break;
          
        // se encuentra la tipografia del texto
        case("font"):
          graphicObj["font"] = values_i_1;
          break;
          
        // se encuentra si la representacion del texto del punto esta en notacion fija
        case("fixed"):
          graphicObj["fixed"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra la cantidad de decimales para representar el texto del punto
        case("decimals"):
          graphicObj["decimals"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el ancho del punto
        case("size"):
          graphicObj["size"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el tamano de la punta de la flecha
        case("spear"):
          graphicObj["spear"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el color interior de la flecha
        case("arrow"):
          graphicObj["arrow"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra la posicion del centro del arco
        case("center"):
          graphicObj["center"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el radio del circulo
        case("radius"):
          graphicObj["radius"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el angulo incial del arco
        case("init"):
          graphicObj["init"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el angulo final del arco
        case("end"):
          graphicObj["end"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra si el arco utiliza vectores para su especificacion
        case("vectors"):
          graphicObj["vectors"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el nombre de archivo de la imagen
        case("file"):
          var fileTmp = values_i_1.replace(/&squot;/g, "'");
          if ((fileTmp.charAt(0) == "[") && (fileTmp.charAt(fileTmp.length-1) == "]")) {
            fileTmp = fileTmp.substring(1, fileTmp.length-1);
          }
          // si es el nombre de una imagen, entonces se crea una cadena
          if (fileTmp.match(/.jpg$|.png$|.gif$|.svg$/)) {
            fileTmp = "'" + fileTmp + "'";
          }
          graphicObj["file"] = this.parser.parse(fileTmp);
          break;
          
        // se encuentra la rotacion de una imagen y un macro
        case("inirot"):
          graphicObj["inirot"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la opacidad de una imagen
        case("opacity"):
          graphicObj["opacity"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la posicion inicial del macro
        case("inipos"):
          graphicObj["inipos"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el nombre del macro
        case("name"):
          graphicObj["name"] = values_i_1;
          break;
          
        // se encuentra el nombre del macro
        case("range"):
          graphicObj["range"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el color del borde del texto
        case("border"):
          if (babel[values_i_1] != "false") {
            graphicObj["border"] = this.convertColor(values_i_1);
          }
          break;
          
        // se encuentra la alineacion del texto
        case("align"):
          graphicObj["align"] = babel[values_i_1];
          break;
          
        // cualquier variable que falte
        default:
          if (graphicObj["family"] != undefined) {
            if (values_i_0.substring(0, graphicObj["family"].length+1) == (graphicObj["family"] + ".")) {
              
              switch(babel[values_i_0.substring(graphicObj["family"].length+1)]){
                
                // se encuentra el intervalo que se utiliza como parametro para una familia
                case("interval"):
                  graphicObj["family_interval"] = this.parser.parse(values_i_1);
                  break;
                  
                // se encuentra el numero de pasos que se utiliza para una familia
                case("steps"):
                  graphicObj["family_steps"] = this.parser.parse(values_i_1);
                  break;
              }
              break;
            }
          }

          if (graphicObj["parameter"] != undefined) {
            if (values_i_0.substring(0, graphicObj["parameter"].length+1) == (graphicObj["parameter"] + ".")) {
            
              switch(babel[values_i_0.substring(graphicObj["parameter"].length+1)]){
              
                // se encuentra el intervalo que se utiliza como parametro para la curva
                case("interval"):
                  graphicObj["parameter_interval"] = this.parser.parse(values_i_1);
                  break;
                
                // se encuentra el numero de pasos que se utiliza para la curva
                case("steps"):
                  graphicObj["parameter_steps"] = this.parser.parse(values_i_1);
                  break;
              }
              break
            }
          }

          console.log("----- attributo del grafico no identificado: <" + values_i_0 + "> valor: <" + values_i_1 +"> -----");
          break;
      }
    }
    
    // MACRO //
    // si el macro utiliza coordenadas absolutas
    if (abs_coord) {
      graphicObj.abs_coord = abs_coord;
    }
    // si el macro se debe dibujar en el fondo
    if (background) {
      graphicObj.background = background;
    }
    // MACRO //

    // el grafico es una ecuacion
    if (graphicObj.type == "equation"){
      return new descartesJS.Equation(this.parent, graphicObj);
    }
    
    // el grafico es una curva
    else if (graphicObj.type == "curve") {
      return new descartesJS.Curve(this.parent, graphicObj);
    }

    // el grafico es una secuencia
    else if (graphicObj.type == "sequence") {
      return new descartesJS.Sequence(this.parent, graphicObj);
    }

    // el grafico es un punto
    else if (graphicObj.type == "point") {
      return new descartesJS.Point(this.parent, graphicObj);
    }
    
    // el grafico es un segmento
    else if (graphicObj.type == "segment") {
      return new descartesJS.Segment(this.parent, graphicObj);
    }
    
    // el grafico es una flecha
    else if (graphicObj.type == "arrow") {
      return new descartesJS.Arrow(this.parent, graphicObj);
    }
    
    // el grafico es un poligono
    else if (graphicObj.type == "polygon") {
      return new descartesJS.Polygon(this.parent, graphicObj);
    }
    
    // el grafico es arco
    else if (graphicObj.type == "arc") {
      return new descartesJS.Arc(this.parent, graphicObj);
    }
    
    // el grafico es un texto
    else if (graphicObj.type == "text") {
      return new descartesJS.Text(this.parent, graphicObj);
    }
    
    // el grafico es una imagen
    else if (graphicObj.type == "image") {
      return new descartesJS.Image(this.parent, graphicObj);
    }

    // el grafico es un macro
    else if (graphicObj.type == "macro") {
      return new descartesJS.Macro(this.parent, graphicObj);
    }

    // el grafico es un relleno
    else if (graphicObj.type == "fill") {
      return new descartesJS.Fill(this.parent, graphicObj);
    }
  }
  /**
   * Parsea y crea un grafico
   * @param {String} values es la cadena que contiene los valores que definen el grafico
   * @return {Graphic} regresa un grafico con los valores correspondientes
   */
  descartesJS.LessonParser.prototype.parse3DGraphic = function(values, abs_coord, background, rotateExp) { 
    // el objeto que contendra todos los valores encontrados en values
    var graphicObj = { rotateExp:rotateExp };
    graphicObj["parameter"] = "t";
    
    // se eliminan las comillas sencillas de la cadena de valores que definen el grafico y se dividen los valores, en el nombre del parametro y su valor
    values = this.split(values);

    var values_i_0, values_i_1;
    // se recorren todos los valores y se asignan a las variables del grafico
    for(var i=0, l=values.length; i<l; i++){
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];
      
      switch(babel[values_i_0]){
        
        // se encuentra el id del espacio del grafico
        case("space"):
          graphicObj["spaceID"] = values_i_1;
          break;
          
        // se encuentra el tipo de grafico
        case("type"):
//           console.log(values_i_1);
          graphicObj["type"] = babel[values_i_1];
          break;
          
        // se encuentra si el grafico debe dibujarse en el fondo
        case("background"):
          graphicObj["background"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el color del grafico
        case("color"):
          graphicObj["color"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra la condicion de dibujo del grafico
        case("drawif"):
          graphicObj["drawif"] = this.parser.parse(values_i_1);
          break;
          
//         // se encuentra si el grafico utiliza coordenadas absolutas
//         case("abs_coord"):
//           graphicObj["abs_coord"] = (babel[values_i_1] == "true");
//           break;
          
        // se encuentra la expresión del grafico
        case("expresion"):
          if ((graphicObj.type != "macro") && (graphicObj.type != "curve") && (graphicObj.type != "surface")) {
            graphicObj["expresion"] = this.parser.parse(values_i_1);
            graphicObj["expresionString"] = values_i_1;
          } else {
            graphicObj["expresion"] = values_i_1;
          }
          break;
                    
        // se encuentra que variable se utiliza como parametro para una familia
        case("family"):
          graphicObj["family"] = values_i_1;
          break;
          
        // se encuentra que variable se utiliza como parametro para una familia
        case("parameter"):
          graphicObj["parameter"] = values_i_1;
          break;
          
//         // se encuentra el color del relleno del grafico
//         case("fill"):
//           graphicObj["fill"] = this.convertColor(values_i_1);
//           break;
//           
//         // se encuentra el color del relleno+ del grafico
//         case("fillP"):
//           graphicObj["fillP"] = this.convertColor(values_i_1);
//           break;
//           
//         // se encuentra el color del relleno- del grafico
//         case("fillM"):
//           graphicObj["fillM"] = this.convertColor(values_i_1);
//           break;
          
        // se encuentra el ancho del grafico
        case("width"):
          graphicObj["width"] = this.parser.parse(values_i_1);
          break;

        // se encuentra el largo del grafico
        case("length"):
          graphicObj["length"] = this.parser.parse(values_i_1);
          break;
          
//         // se encuentra si el grafico es visible
//         case("visible"):
//           graphicObj["visible"] = (babel[values_i_1] == "true");
//           break;
//           
//         // se encuentra si el grafico es editable
//         case("editable"):
//           graphicObj["editable"] = (babel[values_i_1] == "true");
//           break;
//           
//         // se encuentra la info del grafico
//         case("info"):
//           graphicObj["info"] = values_i_1;
//           break;
          
        // se encuentra el texto del grafico
        case("text"):
          var tmpText = this.parseText(values_i_1);

          for (var ii=0, ll=tmpText.length; ii<ll; ii++) {
            tmpText[ii] = this.parser.parse(tmpText[ii], false);
          }
          graphicObj["text"] = tmpText;
          break;
          
        // se encuentra la tipografia del texto
        case("font"):
          graphicObj["font"] = values_i_1;
          break;
          
        // se encuentra si la representacion del texto del punto esta en notacion fija
        case("fixed"):
          graphicObj["fixed"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra la cantidad de decimales para representar el texto del punto
        case("decimals"):
          graphicObj["decimals"] = this.parser.parse(values_i_1);
          break;
          
//         // se encuentra el ancho del punto
//         case("size"):
//           graphicObj["size"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra el tamano de la punta de la flecha
//         case("spear"):
//           graphicObj["spear"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra el color interior de la flecha
//         case("arrow"):
//           graphicObj["arrow"] = this.convertColor(values_i_1);
//           break;
//           
//         // se encuentra la posicion del centro del arco
//         case("center"):
//           graphicObj["center"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra el radio del circulo
//         case("radius"):
//           graphicObj["radius"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra el angulo incial del arco
//         case("init"):
//           graphicObj["init"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra el angulo final del arco
//         case("end"):
//           graphicObj["end"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra si el arco utiliza vectores para su especificacion
//         case("vectors"):
//           graphicObj["vectors"] = (babel[values_i_1] == "true");
//           break;
//           
        // se encuentra el nombre de archivo de la imagen
        case("file"):
          var fileTmp = values_i_1.replace(/&squot;/g, "'");

          if ((fileTmp.charAt(0) == "[") && (fileTmp.charAt(fileTmp.length-1) == "]")) {
            fileTmp = fileTmp.substring(1, fileTmp.length-1);
          }

          // si es el nombre de una imagen, entonces se crea una cadena
          if (fileTmp.match(/./)) {
            fileTmp = "'" + fileTmp + "'";
          }

          graphicObj["file"] = this.parser.parse(fileTmp);
          break;
          
//         // se encuentra la opacidad de una imagen
//         case("opacity"):
//           graphicObj["opacity"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra el nombre del macro
//         case("range"):
//           graphicObj["range"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra el color del borde del texto
//         case("border"):
//           if (babel[values_i_1] != "false") {
//             graphicObj["border"] = this.convertColor(values_i_1);
//           }
//           break;
//           
//         // se encuentra la alineacion del texto
//         case("align"):
//           graphicObj["align"] = babel[values_i_1];
//           break;

        // se encuentra el modelo de iluminacion del grafico tridimensional
        case("model"):
          graphicObj["model"] = babel[values_i_1];
          break;
          
        // se encuentra si se deben dibujar las aristas
        case("edges"):
          graphicObj["edges"] = (babel[values_i_1] == "true");
          break;

        // se encuentra Nu
        case("Nu"):
          graphicObj["Nu"] = this.parser.parse(values_i_1);
          break;          

        // se encuentra Nv
        case("Nv"):
          graphicObj["Nv"] = this.parser.parse(values_i_1);
          break;          
          
        // se encuentra el nombre del grafico tridimensional
        case("name"):
          graphicObj["name"] = values_i_1;
          break;          
          
        // se encuentra el color trasero de un grafico tridimensional
        case("backcolor"):
          graphicObj["backcolor"] = this.convertColor(values_i_1);
          break;

        // se encuentra la rotacion inicial del grafico tridimensional
        case("inirot"):
          graphicObj["inirot"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la rotacion final del grafico tridimensional
        case("endrot"):
          graphicObj["endrot"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la posicion inicial del grafico tridimensional
        case("inipos"):
          graphicObj["inipos"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la posicion final del grafico tridimensional
        case("endpos"):
          graphicObj["endpos"] = this.parser.parse(values_i_1);
          break;          

        //////////////////////////////////////////////////////////////////////////////////////
          
        // cualquier variable que falte
        default:
          if (graphicObj["family"] != undefined) {
            if (values_i_0.substring(0, graphicObj["family"].length+1) == (graphicObj["family"] + ".")) {
              
              switch(babel[values_i_0.substring(graphicObj["family"].length+1)]){
                
                // se encuentra el intervalo que se utiliza como parametro para una familia
                case("interval"):
                  graphicObj["family_interval"] = this.parser.parse(values_i_1);
                  break;
                  
                // se encuentra el numero de pasos que se utiliza para una familia
                case("steps"):
                  graphicObj["family_steps"] = this.parser.parse(values_i_1);
                  break;
              }
              break;
            }
          }

          if (graphicObj["parameter"] != undefined) {
            if (values_i_0.substring(0, graphicObj["parameter"].length+1) == (graphicObj["parameter"] + ".")) {
            
              switch(babel[values_i_0.substring(graphicObj["parameter"].length+1)]){
              
                // se encuentra el intervalo que se utiliza como parametro para la curva
                case("interval"):
                  graphicObj["parameter_interval"] = this.parser.parse(values_i_1);
                  break;
                
                // se encuentra el numero de pasos que se utiliza para la curva
                case("steps"):
                  graphicObj["parameter_steps"] = this.parser.parse(values_i_1);
                  break;
              }
              break
            }
          }

          console.log("----- attributo del grafico no identificado: <" + values_i_0 + "> valor: <" + values_i_1 +"> -----");
          break;
      }
    }

    // el grafico es un punto
    if (graphicObj.type == "point") {
      return new descartesJS.Point3D(this.parent, graphicObj);
    }

    // el grafico es un segmento
    else if (graphicObj.type == "segment") {
      return new descartesJS.Segment3D(this.parent, graphicObj);
    }
    
    // el grafico es un poligono
    else if (graphicObj.type == "polygon") {
      return new descartesJS.Polygon3D(this.parent, graphicObj);
    }
    
    // el grafico es una curva
    else if (graphicObj.type == "curve") {
      return new descartesJS.Curve3D(this.parent, graphicObj);
    }
    
    // el grafico es un triangulo
    else if (graphicObj.type == "triangle") {
      return new descartesJS.Triangle3D(this.parent, graphicObj);
    }
    
    // el grafico es una cara
    else if (graphicObj.type == "face") {
      return new descartesJS.Face3D(this.parent, graphicObj);
    }
    
    // el grafico es un poligono regular
    else if (graphicObj.type == "polireg") {
      return new descartesJS.Polireg3D(this.parent, graphicObj);
    }

    // el grafico es una superficie
    else if (graphicObj.type == "surface") {
      return new descartesJS.Surface3D(this.parent, graphicObj);
    }

    // el grafico es un texto
    else if (graphicObj.type == "text") {
      return new descartesJS.Text3D(this.parent, graphicObj);
    }
    
    // el grafico es una malla
    else if (graphicObj.type == "mesh") {
      return new descartesJS.Mesh3D(this.parent, graphicObj);
    }

    else {
      console.log(graphicObj.type);
    }
    
  }
  
  /**
   * Parsea y registra o crea un auxiliar
   * @param {String} values es la cadena que contiene los valores que definen el auxiliar
   */
  descartesJS.LessonParser.prototype.parseAuxiliar = function(values) {
    // el objeto que contendra todos los valores encontrados en values
    var auxiliarObj = {};
    
    // variable temporal para fines de calculos intermedios
    var temp;
    
    // se eliminan las comillas sencillas de la cadena de valores que definen al auxiliar y se dividen los valores, en el nombre del parametro y su valor
    values = this.split(values);
    
    for(var i=0, l=values.length; i<l; i++) {
      values[i][1] = (values[i][1]).replace(/&squot;/g, "'");
    }
    
    var values_i_0, values_i_1;
    // se recorren todos los valores y se asignan a las variables del auxiliar
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      switch(babel[values_i_0]) {
        // se encuentra el id del auxiliar
        case("id"):
          auxiliarObj["id"] = values_i_1;
          break;

        // se encuentra si una variable es editable
      	case("editable"):
      	  auxiliarObj["editable"] = (babel[values_i_1] == "true");
      	  break;
	  
        // se encuentra si es una cosntante
        case("constant"):
          auxiliarObj["constant"] = (babel[values_i_1] == "true");
          break;
        
        // se encuentra si es un vector
        case("array"):
          auxiliarObj["array"] = (babel[values_i_1] == "true");
          break;

        // se encuentra si es un vector
        case("file"):
          auxiliarObj["file"] = values_i_1;
          break;

        // se encuentra si es una matriz
        case("matrix"):
          auxiliarObj["matrix"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el numero de renglones de una matriz
        case("rows"):
          auxiliarObj["rows"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el numero de renglones de una matriz
        case("columns"):
          auxiliarObj["columns"] = this.parser.parse(values_i_1);
          break;

        // se encuentra si tiene un algoritmo
        case("algorithm"):
          auxiliarObj["algorithm"] = (babel[values_i_1] == "true");
          break;
        
        // se encuentran las expresiones iniciales
        case("init"):
          auxiliarObj["init"] = values_i_1;
          break;
          
        // se encuentran las expresiones hacer
        case("do"):
          auxiliarObj["doExpr"] = values_i_1;
          break;
          
        // se encuentran las expresiones mientras
        case("while"):
          auxiliarObj["whileExpr"] = values_i_1;
          break;
          
        // se encuentra el dominio de la expresión que define el auxiliar
        case("range"):
          auxiliarObj["range"] = values_i_1;
          break;

        // se encuentra la expresión que define el auxiliar
        case("expresion"):
          auxiliarObj["expresion"] = values_i_1;
          break;
          
        // se encuentra el numero de elementos del vector
        case("size"):
          auxiliarObj["size"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la forma en la que se evalua un auxiliar
        case("evaluate"):
          auxiliarObj["evaluate"] = babel[values_i_1];
          break;
          
        // se encuentra si es un evento
        case("event"):
          auxiliarObj["event"] = babel[values_i_1];
          break;

        // se encuentra la condicion del evento
        case("condition"):
          auxiliarObj["condition"] = values_i_1;
          break;
          
        // se encuentra el tipo de ejecucion del evento
        case("execution"):
          auxiliarObj["execution"] = babel[values_i_1];
          break;

        // se encuentra la posicion del mensaje del evento
        case("msg_pos"):
          auxiliarObj["msg_pos"] = babel[values_i_1];
          break;

        // se encuentra la accion a ejecutar del evento
        case("action"):
          auxiliarObj["action"] = babel[values_i_1];
          break;
          
        // se encuentran los parametros de la accion a ejecutar del evento
        case("parameter"):
          auxiliarObj["parameter"] = values_i_1;
          break;
          
        // se encuentra si el auxiliar es una secuencia
        case("sequence"):
          auxiliarObj["sequence"] = (babel[values_i_1] == "true");
          break;
          
        default:
          var ind    = values_i_0.indexOf(".");
          var prefix = babel[values_i_0.substring(0,ind)];
          var sufix  = babel[values_i_0.substring(ind+1)];
          
          // se encuentra la tipografia del parametro
          if ((prefix == "parameter") && (sufix == "font")) {
            auxiliarObj["parameterFont"] = values_i_1;
            break;
          }
          
          console.log("----- attributo de auxiliar no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
          break;
      }
    }
        
    // una secuencia
    if (auxiliarObj.sequence) {
      var auxS = new descartesJS.AuxSequence(this.parent, auxiliarObj);
      return;
    }
    
    // una constante
    else if (auxiliarObj.constant) {
      // si se evalua una sola vez
      var auxC = new descartesJS.Constant(this.parent, auxiliarObj);
      
      // si se evalua siempre
      if ((auxiliarObj.evaluate) && (auxiliarObj.evaluate == "always")) {
        this.parent.auxiliaries.push(auxC);
      }
      return;
    } 
      
    // un algoritmo
    else if ((auxiliarObj.algorithm) && (auxiliarObj.evaluate)) {
      // si se evalua una sola vez
      var auxA = new descartesJS.Algorithm(this.parent, auxiliarObj);
      
      // si se evalua siempre
//       if (auxiliarObj.evaluate == "always") {
        this.parent.auxiliaries.push(auxA);
//       }
      return;
    }
    
    // un vector 
    else if ((auxiliarObj.array) && (!auxiliarObj.matrix) && (auxiliarObj.id.charAt(auxiliarObj.id.length-1) != ")")) {
      // si se evalua una sola vez
      var auxV = new descartesJS.Vector(this.parent, auxiliarObj);

      // si se evalua siempre
      if ((auxiliarObj.evaluate) && (auxiliarObj.evaluate == "always")) {
        this.parent.auxiliaries.push(auxV);
      }
      return;
    }

    // una matriz 
    else if ((auxiliarObj.matrix) && (auxiliarObj.id.charAt(auxiliarObj.id.length-1) != ")")) {
      // si se evalua una sola vez
      var auxM = new descartesJS.Matrix(this.parent, auxiliarObj);

      // si se evalua siempre
      if ((auxiliarObj.evaluate) && (auxiliarObj.evaluate == "always")) {
        this.parent.auxiliaries.push(auxM);
      }
      return;
    }
    
    // un evento
    else if ((auxiliarObj.event) && (auxiliarObj.id.charAt(auxiliarObj.id.length-1) != ")")) {
      var auxE = new descartesJS.Event(this.parent, auxiliarObj);
      this.parent.events.push(auxE);
      return;
    }
    
    else {
      // una funcion
      if (auxiliarObj.id.charAt(auxiliarObj.id.length-1) == ")") {
        var auxF = new descartesJS.Function(this.parent, auxiliarObj);
      } 
      // una variable
      else {
	var auxV = new descartesJS.Variable(this.parent, auxiliarObj);
      }
      return;
    }
  }
  
  /**
   * 
   */
  descartesJS.LessonParser.prototype.parseAction = function(theAction) {
    var theAction_action = theAction.action;
    var theAction_parent = theAction.parent;
    var theAction_parameter = theAction.parameter;
    
    // si tiene alguna accion, creamos la accion correspondiente
    if (theAction_action) {
      switch (theAction_action) {
        // muestra un mensaje
        case("message"):
          return (new descartesJS.Message(theAction_parent, theAction_parameter));
          break;
          
        // realizar calculos
        case("calculate"):
          return (new descartesJS.Calculate(theAction_parent, theAction_parameter));
          break;
          
        // abre un url
        case("openURL"):
          return (new descartesJS.OpenURL(theAction_parent, theAction_parameter));
          break;

        // abre una escena
        case("openScene"):
          return (new descartesJS.OpenScene(theAction_parent, theAction_parameter));
          break;

        // muestra los creditos
        case("about"):
          return (new descartesJS.About(theAction_parent, theAction_parameter));
          break;

        // muestra la configuracion de la escena
        case("config"):
          return (new descartesJS.Config(theAction_parent, theAction_parameter));
          break;

        // inicia la escena
        case("init"):
          return (new descartesJS.Init(theAction_parent, theAction_parameter));
          break;
          
        // limpia los rastros de la escena
        case("clear"):
          return (new descartesJS.Clear(theAction_parent, theAction_parameter));
          break;
          
        // comienza la animacion
        case("animate"):
          return (new descartesJS.Animate(theAction_parent, theAction_parameter));
          break;
          
        // reinicia la animacion
        case("initAnimation"):
          return (new descartesJS.InitAnimation(theAction_parent, theAction_parameter));
          break;
          
        // reproduce audio
        case("playAudio"):
          return (new descartesJS.PlayAudio(theAction_parent, theAction_parameter));
          break;

        default:
          console.log("----- Accion no soportada aun: <" + theAction_action + "> -----");
          break;
      }
    } 
    // regresamos un objeto cuya funcion de ejecucion no hace nada
    else {
      return {execute : function(){}};
    }
  }

  /**
   * Parsea y registra una animacion
   * @param {String} values es la cadena que contiene los valores que definen la animacion
   */
  descartesJS.LessonParser.prototype.parseAnimation = function(values) {
    // el objeto que contendra todos los valores encontrados en values
    var animationObj = {};
    
    // variable temporal para fines de calculos intermedios
    var temp;
    
    // se eliminan las comillas sencillas de la cadena de valores que definen a la animacion y se dividen los valores, en el nombre del parametro y su valor
    values = this.split(values);

    var values_i_0, values_i_1;
    // se recorren todos los valores y se asignan a las variables de la animacion
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      switch(babel[values_i_0]) {
        
        // se encuentra el delay de la animacion
        case("delay"):
          animationObj["delay"] = values_i_1;
          break;
          
        // se encuentra si la animacion muestra los controles o no
        case("controls"):
          animationObj["controls"] = (babel[values_i_1] == "true");
          break;

        // se encuentra si la animacion se inicia automaticamente
        case("auto"):
          animationObj["auto"] = (babel[values_i_1] == "true");
          break;

        // se encuentran si la animacion se cicla
        case("loop"):
          animationObj["loop"] = (babel[values_i_1] == "true");
          break;
         
        // se encuentran las expresiones iniciales
        case("init"):
          animationObj["init"] = values_i_1;
          break;
          
        // se encuentran las expresiones hacer
        case("do"):
          animationObj["doExpr"] = values_i_1;
          break;
          
        // se encuentran las expresiones mientras
        case("while"):
          animationObj["whileExpr"] = values_i_1;
          break;
         
        case("id"):
          animationObj["id"] = values_i_1;
          break;
         
        case("algorithm"):
          animationObj["algorithm"] = (babel[values_i_1] == "true");
          break;
          
        case("evaluate"):
          animationObj["evaluate"] = (babel[values_i_1] == "true");
          break;          
         
        // cualquier variable que falte
        default:
          console.log("----- attributo de la animacion no identificado: <" + values_i_0 + ">  <" + values_i_1 + "> -----");
          break;
      }
    }
    
    return (new descartesJS.Animation(this.parent, animationObj));
  }
  
  /**
   * 
   */
  descartesJS.LessonParser.prototype.parsePleca = function(values, w) {
    values = this.split(values);

    // el objeto que contendra todos los valores encontrados en values
    var plecaObj = {};
    plecaObj.title = "";
    plecaObj.subtitle = "";
    plecaObj.subtitlines = 0;
    plecaObj.bgcolor = "#536891";
    plecaObj.fgcolor = "white";
    plecaObj.align = "left";
    plecaObj.titleimage = "";
    // plecaObj.titlefont = "SansSerif,PLAIN,22";
    // plecaObj.subtitlefont = "SansSerif,PLAIN,20";
    plecaObj.titlefont = "SansSerif,BOLD,20";
    plecaObj.subtitlefont = "SansSerif,PLAIN,18";
     
    var values_i_0, values_i_1;
    // se recorren todos los valores y se asignan a las variables de la pleca
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      switch(values_i_0) {
        // se encuentra el texto del titulo
        case("title"):
          plecaObj.title = values_i_1;
          break;
         
        // se encuentra el texto del subtitulo
        case("subtitle"):
          plecaObj.subtitle = values_i_1;
          break;

        // se encuentra el numero de lineas texto del subtitulo
        case("subtitlines"):
          plecaObj.subtitlines = values_i_1;
          break;

        // se encuentra el color de fondo de la pleca
        case("bgcolor"):
          if (values_i_1 !== "") {
            plecaObj.bgcolor = "#" + descartesJS.getColor(this.evaluator, values_i_1);
          }
          break;

        // se encuentra el color del texto de la pleca
        case("fgcolor"):
          if (values_i_1 !== "") {
            plecaObj.fgcolor = "#" + descartesJS.getColor(this.evaluator, values_i_1);
          }
          break;

        // se encuentra el tipo de alineacion del texto de la pleca
        case("align"):
          if (values_i_1 !== "") {
            plecaObj.align = values_i_1;
          }
          break;

        // se encuentra el nombre de archivo de la imagen de la pleca
        case("titleimage"):
          plecaObj.titleimage = values_i_1;
          break;

        // se encuentra la tipografia del titulo
        case("titlefont"):
          if (values_i_1 !== "") {
            plecaObj.titlefont = descartesJS.convertFont(values_i_1);
          } else {
            plecaObj.titlefont = descartesJS.convertFont(plecaObj.titlefont);
          }
          break;

        // se encuentra la tipografia del titulo
        case("subtitlefont"):
          if (values_i_1 !== "") {
            plecaObj.subtitlefont = descartesJS.convertFont(values_i_1);
          } else {
            plecaObj.subtitlefont = descartesJS.convertFont(plecaObj.subtitlefont);
          }
          break;

        // cualquier variable que falte
        default:
          console.log("----- attributo de la pleca no identificado: <" + values_i_0 + ">  <" + values_i_1 + "> -----");
          break;
      }
    }

    // el tamano de la tipografica del subtitulo
    var subtitleFontSize = plecaObj.subtitlefont.substring(0, plecaObj.subtitlefont.indexOf("px"));
    subtitleFontSize = subtitleFontSize.substring(subtitleFontSize.lastIndexOf(" "));

    // que tanto se despega del borde el contenido de la pleca
    var paddingSides = 15;

    // la imagen de la pleca y su altura si es que existe
    var image;
    var imageHeight;
    if (plecaObj.titleimage != "") {
      image = this.parent.getImage(plecaObj.titleimage);
      imageHeight = image.height;
    }
    
    // se crea el contenedor de la pleca
    plecaObj.divPleca = document.createElement("div");
    plecaObj.divPleca.setAttribute("id", "descartesPleca");

    // si existe una imagen, entonces la altura de la pleca se ajusta a la altura de la imagen
    if (imageHeight) {
      plecaObj.divPleca.setAttribute("style", "position: absolute; left: 0px; top: 0px; text-align: " + plecaObj.align + "; width: " + (w-2*paddingSides) + "px; height: "+ (imageHeight-16) + "px; background: " + plecaObj.bgcolor + "; color: " + plecaObj.fgcolor + "; padding-top: 8px; padding-bottom: 8px; padding-left: " + paddingSides + "px; padding-right: " + paddingSides + "px; margin: 0px; overflow: hidden; z-index: 100;");
      
      image.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: -1; width: 100%; height: 100%");
      plecaObj.divPleca.appendChild(image);
    } 
    // si no hay una imagen la altura no se especifica para que el contenedor la calcule solo
    else {
      plecaObj.divPleca.setAttribute("style", "position: absolute; left: 0px; top: 0px; text-align: " + plecaObj.align + "; width: " + (w-2*paddingSides) + "px; background: " + plecaObj.bgcolor + "; color: " + plecaObj.fgcolor + "; padding-top: 8px; padding-bottom: 8px; padding-left: " + paddingSides + "px; padding-right: " + paddingSides + "px; margin: 0px; z-index: 100;");
    }
    
    // se crea el contenedor para el titulo y se agrega su contenido
    var divTitle = document.createElement("div");
    divTitle.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.titlefont + "; overflow: hidden; white-space: nowrap;");
    divTitle.innerHTML = plecaObj.title;

    // se crea el contenedor pare el subtitulo
    var divSubTitle = document.createElement("div");

    // si el numero de lineas del subtitulo es igual a 1 entonces el alto del subtitulo se ajusta a que solo sea una linea
    if (parseInt(plecaObj.subtitlines) == 1) {
      var tempDiv;
      var tempDivHeight;
      var tempFontSize;
      var noLines;
      var tempDecrement = 0;

      // se crea un contenedor temporal que sirve como sustituto al contenedor del subtitulo, y con el determinar el tamano de la letra del contenedor del subtitulo
      tempDiv = document.createElement("div");
      tempDiv.innerHTML = plecaObj.subtitle;
      document.body.appendChild(tempDiv);
      tempFontSize = subtitleFontSize;

      do {
        tempFontSize = tempFontSize - tempDecrement;
        
        // se asigna el estilo al contenedor temporar para medir el numero de lineas en las que rompe el texto
        tempDiv.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.subtitlefont + "; font-size: " + tempFontSize + "px; width: " + (w-2*paddingSides) + "px; line-height: " + tempFontSize + "px;")
        
        // se encuentra la altura del contenedor temporal
        tempDivHeight = tempDiv.offsetHeight;
        // se encuentra el numero de lineas dividiendo la altura entre la altura de una linea
        noLines = tempDivHeight / tempFontSize;

        tempDecrement = 1;
      } 
      // si el numero de lineas es uno o si el tamano de la fuente se vuelve mas pequena que 8px entonces se termina la busqueda
      while ((noLines > 1) && (tempFontSize > 8));

      // se remueve el contenedor temporal del cuerpo
      document.body.removeChild(tempDiv);
      
      // se asigna el estilo al subtitulo con el tamano de tipografia adecuado
      divSubTitle.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.subtitlefont + "; font-size: " + tempFontSize + "px; line-height: 110%; overflow: hidden; white-space: nowrap;");
    } 
    // si el numero de lineas es diferente de 1, entonces el numero de lineas se ignora
    else {
      divSubTitle.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.subtitlefont + "; line-height: 110%;");
    }
    // se asigan el contenido al subtitulo
    divSubTitle.innerHTML = plecaObj.subtitle;

    plecaObj.divPleca.appendChild(divTitle);
    plecaObj.divPleca.appendChild(divSubTitle);
    
//     console.log(plecaObj.title, plecaObj.subtitle, plecaObj.subtitlines, plecaObj.bgcolor, plecaObj.fgcolor, plecaObj.align, plecaObj.titleimage, plecaObj.titlefont, plecaObj.subtitlefont);

    plecaObj.divPleca.imageHeight = imageHeight;
    return plecaObj.divPleca;
  }
  
  /**
   * Elimina las comillas sencillas de la cadena de valores y se dividen en un arreglo con el nombre del parametro y su valor
   * @param {String} values es la cadena que contiene los valores a dividir
   * @return {[[String,String]]} regresa un arreglo de parejas nombre valor
   */
  descartesJS.LessonParser.prototype.split = function(values) {
    if (typeof(values) != "string") {
      return [];
    }

    values = values || "";
    values = values.replace(/\\'/g, "’");
    var splitValues = [];
    var pos = 0;
    var i = 0;
    var initToken = false;
    var initPosToken = 0;
    var endPosToken = 0;
    var stringToken = false;
    var valueToken = false;
    var charAt;

    // se recorre la cadena a dividir
    while (pos < values.length) {
      // se ignoran los espacios en blanco si no se ha inciado la identificacion de un token
      if ((values.charAt(pos) == " ") && (!initToken)) {
        pos++;
      }
      
      // se encuentra un caracter que es diferente de un espacio en blanco
      if ((values.charAt(pos) != " ") && (!initToken)) {
        initToken = true;
        initPosToken = pos;
      }
      
      // los valores estan especificados como una cadena
      if ((values.charAt(pos) == "=") && (values.charAt(pos+1) == "'") && (!stringToken)) {
        stringToken = true;
        
        splitValues[i] = [values.substring(initPosToken, pos)]

        initPosToken = pos+2;
        
        pos+=2;
      }
      
      if ((stringToken) && (values.charAt(pos) == "'")) {
        stringToken = false;
        
        initToken = false;
        
        splitValues[i].push(values.substring(initPosToken, pos));
        
        i++;
      }

      // los valores estan especificados como una secuencia de palabras
      if ((values.charAt(pos) == "=") && (values.charAt(pos+1) != "'") && (!stringToken)) {
        // valueToken = true;

        splitValues[i] = [values.substring(initPosToken, pos)]

        initPosToken = pos+1;
        
        pos++;

        // find the next space and equal sign
        var tmpIndexEqual = (values.substring(pos)).indexOf("=");
        var tmpIndexSpace;
        if (tmpIndexEqual == -1) {
          tmpIndexEqual = values.length;
          tmpIndexSpace = values.length;
        } 
        else {
          tmpIndexEqual += pos;

          tmpIndexSpace = values.substring(pos, tmpIndexEqual).lastIndexOf(" ");
          if (tmpIndexSpace == -1) {
            tmpIndexSpace = values.length;
          }
          else {
            tmpIndexSpace += pos;
          }
        }

        splitValues[i].push(values.substring(initPosToken, tmpIndexSpace));
        i++;
        initToken = false;

        pos = tmpIndexSpace;
      }

      // if ((valueToken) && (values.charAt(pos) == " ")) {
      //   valueToken = false;

      //   initToken = false;

      //   splitValues[i].push(values.substring(initPosToken, pos));
        
      //   i++;
      // }

      // // los valores estan especificados como una palabra y ya se terminaron los datos
      // if ((valueToken) && (pos == values.length-1)) {
      //   splitValues[i].push(values.substring(initPosToken, values.length));
      // }
      
      pos++;
    }      

    return splitValues;
  }
  
  /**
   * 
   */
  descartesJS.LessonParser.prototype.splitComa = function(string) {
    var splitString = [];
    var parentesisStack = [];
    var lastSplitIndex = 0;
    for (var i=0, l=string.length; i<l; i++) {
      if (string.charAt(i) == "(") {
        parentesisStack.push(i);
      }
      else if (string.charAt(i) == ")") {
        parentesisStack.pop();
      }
      else if ((string.charAt(i) == ",") && (parentesisStack.length == 0)) {
        splitString.push(string.substring(lastSplitIndex, i));
        lastSplitIndex = i+1;
      }
    }
    
    splitString.push(string.substring(lastSplitIndex));
    
    return splitString;
  }
  
  /**
   *
   */
  descartesJS.LessonParser.prototype.convertColor = function(color) {
    // el color es un color escrito por su nombre
    if (babel[color]) {
      if (babel[color] == "net") {
        return "red";
      }
      return babel[color];
    }
    
    // el color esta descrito por 6 digitos hexadecimales dos por cada componente, RGB #RRGGBB
    if (color.length == 6) {
      return "#" + color;
    }

    // el color esta descrito 8 digitos hexadecimales dos por cada componente, RGBA #RRGGBBAA
    if (color.length == 8) {
      return "rgba("+ parseInt("0x"+color.substring(2,4), 16) +","
                    + parseInt("0x"+color.substring(4,6), 16) +","
                    + parseInt("0x"+color.substring(6,8), 16) +","
                    + (1-parseInt("0x"+color.substring(0,2), 16)/255)
                    + ")";
    }
    
    // el color esta descrito por una expresion (exprR, exprG, exprB, exprA)
    if (color[0] == "(") {
      var tmpColor = "(";
      var splitColor = this.splitComa(color.substring(1,color.length-1));
      var hexColor;

      for (var i=0, l=splitColor.length; i<l; i++) {
        hexColor = parseInt(splitColor[i], 16);
        
        if (splitColor[i] != hexColor.toString(16)) {
          if ((splitColor[i].charAt(0) == "[") && (splitColor[i].charAt(splitColor[i].length-1) == "]")) {
            splitColor[i] = splitColor[i].substring(1, splitColor[i].length-1);
          }
          tmpColor = tmpColor + splitColor[i] + ((i<l-1)?",":")");
        } else {
          tmpColor = tmpColor + (hexColor/255) + ((i<l-1)?",":")");
        }
      }

      return this.parser.parse(tmpColor);
    }
    
    // cualquier otro valor
    return "#aa0000";
  }

  /**
   *
   */
  descartesJS.LessonParser.prototype.parseText = function(text) {
    // es un texto en RTF
    if (text.match(/^\{\\rtf1/)) {
      var RTFparser = new descartesJS.RTFParser(this.parent.evaluator);
      return RTFparser.parse(text.substring(10, text.length-1));
    }
    
    // es un texto simple
    return new descartesJS.SimpleText(text, this.parent);
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * Un nodo que forma un arbol de parseo
   * @constructor 
   */
  descartesJS.Node = function (type, value) {
    this.sep = "";
    this.type = type;
    this.value = value;
    this.parent = null;
    this.childs = [];
  }

  /**
   * Obtiene el nodo raiz del arbol
   */
  descartesJS.Node.prototype.getRoot = function() {
    if (this.parent === null) {
      return this;
    }
    return this.parent.getRoot();
  }

  /**
   * Agrega un hijo al arbol
   * @param {descartesJS.Node} child el hijo que se quiere agregar
   */
  descartesJS.Node.prototype.addChild = function(child) {
    child.parent = this;
    this.childs.push(child);
  }
  
  /**
   * Reemplaza el ultimo nodo en el arbol por un nodo dado
   * @param {descartesJS.Node} child el nodo por el cual se reemplaza el ultimo nodo del arbol
   */
  descartesJS.Node.prototype.replaceLastChild = function(child) {
    var lastChildIndex = this.childs.length-1,
    lastChild = this.childs[lastChildIndex];
  
    lastChild.parent = null;
    this.childs[lastChildIndex] = child;
    child.parent = this;
    return child;
  }

  /**
   *
   */
   descartesJS.Node.prototype.setAllEvaluateFunction = function() {
    this.setEvaluateFunction();

    for (var i=0, l=this.childs.length; i<l; i++) {
      this.childs[i].setAllEvaluateFunction();
    }
   }

  /**
   * Muestra la representacion en cadena del arbol
   */
  descartesJS.Node.prototype.toString = function() {
    var str = "tipo: " + this.type + ", valor: " + this.value + "\n";
  
    this.sep = "   " + ((this.parent) ? (this.parent.sep) : "");
    for (var i=0, l=this.childs.length; i<l; i++) {
      str += this.sep +this.childs[i].toString();
    }
  
    return str;
  }

  /**
   * Dice si el arbol contiene el nodo especificado
   * @param {descartesJS.Node} value el valor a buscar en el arbol
   * @return {Boolean} true si el valor esta en el arbol o false si no esta
   */
  descartesJS.Node.prototype.contains = function(value) {
    if (this.value === value) {
      return true;
    } 
    
    for (var i=0, l=this.childs.length; i<l; i++) {
      if (this.childs[i].contains(value)) {
        return true;
      }
    }

    return false;
  }
    
  /**
   * Convirte un arbol con el operador principal igual (=) a una arbol con operador principal a menos (-)
   * @return {descartesJS.Node} el nuevo arbol donde se reemplazo el operador = por el -
   */
  descartesJS.Node.prototype.equalToMinus = function() {
    var newRoot;
    if (this.type === "compOperator") {
      this.type = "operator";
      this.value = "-";
      
      var root = new descartesJS.Node("compOperator", "==");
      var right = new descartesJS.Node("number", "0");
      
      root.addChild(this);
      root.addChild(right);

      newRoot = this.getRoot();
      newRoot.setAllEvaluateFunction();
      
      return newRoot;
    } 
    return this;
  }
  
  /**
   * 
   */
  descartesJS.Node.prototype.setEvaluateFunction = function() {
    // numero
    if (this.type === "number") {
      this.evaluate = function(evaluator) {
        return parseFloat(this.value);
      }
    }
    
    // cadena
    else if (this.type === "string") {
      this.evaluate = function(evaluator) {
        return this.value;
      }
    }
    
    // variable
    else if ( (this.type === "identifier") && (this.childs.length === 0) ) {
      if (this.value == "rnd") {
        this.evaluate = function(evaluator) {
          return Math.random();
        }
      }
      else {
        this.evaluate = function(evaluator, getMatrix) {
          var variableValue = evaluator.variables[this.value];

          if (typeof(variableValue) === "object") {
            return variableValue.evaluate(evaluator);
          }

          // si el nombre no se encuentra en las variables pero si en las matrices
          if ((variableValue == undefined) && (getMatrix)) {
            variableValue = evaluator.matrices[this.value];
            // console.log(variableValue)
          }

          return variableValue || 0; 
        }
      }
    }
    
    // vector
    else if ( (this.type === "identifier") && (this.childs[0].type === "square_bracket") && (this.childs[0].childs.length === 1)) {
      this.evaluate = function(evaluator) {
        var pos = this.childs[0].childs[0].evaluate(evaluator);
        var value;

        try {
          return evaluator.vectors[this.value][(pos<0) ? 0 : Math.floor(pos)] || 0;
        }
        catch(e) { 
          return 0; 
        }
      }
    }
    
    // matriz
    else if ( (this.type === "identifier") && (this.childs[0].type === "square_bracket") && (this.childs[0].childs.length > 1)) {
      this.evaluate = function(evaluator) {
        var pos1 = this.childs[0].childs[0].evaluate(evaluator);
        var pos2 = this.childs[0].childs[1].evaluate(evaluator);

        try {
          return evaluator.matrices[this.value][(pos1<0) ? 0 : Math.floor(pos1)][(pos2<0) ? 0 : Math.floor(pos2)] || 0;
        }
        catch(e) {
          return 0;
        }
      }
    }
    
    // funcion
    else if ( (this.type === "identifier") && (this.childs[0].type === "parentheses") ) {
      this.evaluate = function(evaluator) {
        var argu = [];
        for (var i=0, l=this.childs[0].childs.length; i<l; i++) {
          argu.push( this.childs[0].childs[i].evaluate(evaluator) );
        }
      
        if (this.value === "_Eval_") {
          return evaluator.parser.parse(argu[0])
        }

        return evaluator.functions[this.value].apply(evaluator, argu);
      }
    }
    
    // operador
    else if (this.type === "operator") {
      var op1;
      var op2;
      var result;

      if (this.value === "+") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator, true);
          op2 = this.childs[1].evaluate(evaluator, true);

          // operacion numerica o de cadenas
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return op1 + op2;
          }
          // operacion de matrices
          else {
            return sumaMatriz(op1, op2);
          }
        }
      }
      else if (this.value === "-") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator, true);
          op2 = this.childs[1].evaluate(evaluator, true);

          // operacion numerica
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return op1 - op2;
          }
          // operacion de matrices
          else {
            return restaMatriz(op1, op2);
          }
        }
      }
      else if (this.value === "*") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator, true);
          op2 = this.childs[1].evaluate(evaluator, true);

          // operacion numerica
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return op1 * op2;
          }
          // operacion de matrices
          else {
            return multiplicacionMatriz(op1, op2);
          }
        }
      }
      else if (this.value === "/") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator, true);
          op2 = this.childs[1].evaluate(evaluator, true);

          // operacion numerica
          if ((op1.type !== "matrix") || (op2.type !== "matrix")) {
            return op1 / op2;
          }
          // operacion de matrices
          else {
            return divisionMatriz(op1, op2);
          }
        }
      }
      else if (this.value === "%") {
        this.evaluate = function(evaluator) {
          op1 = this.childs[0].evaluate(evaluator);
          op2 = this.childs[1].evaluate(evaluator);
          return op1 - Math.floor(op1/op2)*op2;
        }
      }
      else if (this.value === "^") {
        this.evaluate = function(evaluator) {
          return Math.pow( this.childs[0].evaluate(evaluator), this.childs[1].evaluate(evaluator) );
        }
      }
    }
    
    // operador de comparacion
    else if (this.type === "compOperator") {
      if (this.value === "<") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) < this.childs[1].evaluate(evaluator))+0;
        }
      }
      else if (this.value === "<=") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) <= this.childs[1].evaluate(evaluator))+0;
        }
      }
      else if (this.value === ">") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) > this.childs[1].evaluate(evaluator))+0;
        }
      }
      else if (this.value === ">=") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) >= this.childs[1].evaluate(evaluator))+0;
        }
      }
      else if (this.value === "==") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) === this.childs[1].evaluate(evaluator))+0;
        }
      }
      else if (this.value === "!=") {
        this.evaluate = function(evaluator) {
          return (this.childs[0].evaluate(evaluator) != this.childs[1].evaluate(evaluator))+0;
        }
      }
    }
    
    // operador booleano
    else if (this.type === "boolOperator") {
      if (this.value === "&") {
        this.evaluate = function(evaluator) {
          var op1 = this.childs[0].evaluate(evaluator) ? 1 : 0;
          if (op1) {
            return (this.childs[1].evaluate(evaluator)) ? 1 : 0;
          }
          else {
            return 0;
          }
        }
      }

      else if (this.value === "|") {
        this.evaluate = function(evaluator) {
          var op1 = this.childs[0].evaluate(evaluator) ? 1 : 0;
          if (op1) {
            return 1;
          }
          else {
            return (this.childs[1].evaluate(evaluator)) ? 1 : 0;
          }
        }
      }

      else if (this.value === "!") { 
        this.evaluate = function(evaluator) {
          var op1 = this.childs[0].evaluate(evaluator) ? 1 : 0;
          return !op1+0; 
        }
      }
    }
    
    // condicional
    else if (this.type === "conditional") {
      this.evaluate = function(evaluator) {
        var op1 = this.childs[0].evaluate(evaluator);

        if (op1 > 0) {
          return this.childs[1].evaluate(evaluator);
        }
        else {
          return this.childs[2].evaluate(evaluator);
        }        
      }
    }
    
    // signo
    else if (this.type === "sign") {
      if (this.value === "sign+") {
        this.evaluate = function(evaluator) {
          return this.childs[0].evaluate(evaluator);
        }
      }
      else {
        this.evaluate = function(evaluator) {
          return -(this.childs[0].evaluate(evaluator));
        }
      }
    }
    
    // parentesis
    else if (this.type === "parentheses") {
      this.evaluate = function(evaluator, getMatrix) {
        return this.childs[0].evaluate(evaluator, getMatrix);
      }
    }
    
    // el nodo a evaluar es una expresion (x,y) o [x,y]
    else if ( (this.type === "(expr)") || (this.type === "[expr]") ) {
      this.evaluate = function(evaluator) {
        var l = this.childs.length;
        var result = [];

        if ( (l === 1) && (this.childs[0].childs.length === 1) && (this.type === "(expr)") ) {
          result = this.childs[0].childs[0].evaluate(evaluator);
        }

        else {
          var tmpRes;
          for (var i=0; i<l; i++) {
            tmpRes = [];
            for (var j=0, n=this.childs[i].childs.length; j<n; j++) {
              tmpRes.push( this.childs[i].childs[j].evaluate(evaluator));
            }
            result[i] = tmpRes;
          }
        }

        return result;
      }
    }

    // asignacion
    else if (this.type === "asign") {
      this.evaluate = function(evaluator) {
        var ide = this.childs[0];
        var expre = this.childs[1];

        if ((ide.childs.length === 1) && (ide.childs[0].type === "square_bracket")) {
          var pos = ide.childs[0].childs;

          // un vector 
          if (pos.length === 1) {
            var tmpPos = pos[0].evaluate(evaluator);
            tmpPos = (tmpPos < 0) ? 0 : Math.floor(tmpPos);

            evaluator.vectors[ide.value][tmpPos] = expre.evaluate(evaluator);

            return;
          }

          // una matriz
          else if (pos.length === 2) {
            var tmpPos0 = pos[0].evaluate(evaluator);
            var tmpPos1 = pos[1].evaluate(evaluator);
            tmpPos0 = (tmpPos0 < 0) ? 0 : Math.floor(tmpPos0);
            tmpPos1 = (tmpPos1 < 0) ? 0 : Math.floor(tmpPos1);
            evaluator.matrices[ide.value][tmpPos0][tmpPos1] = expre.evaluate(evaluator);

            return;
          }
        } 
        else {
          var asignation = expre.evaluate(evaluator);

          // la asignacion es una variable
          if (!asignation.type) {
            evaluator.variables[ide.value] = asignation;
          } 
          // la asignacion es una matriz
          else {
            evaluator.matrices[ide.value] = asignation;
          }

          return;
        }
      }
    }
  }

  var rows;
  var cols;
  var result;
  var i, j, k, l;

  /**
   *
   */
  function createMatriz(rows, cols) {
    result = [];
    result.type = "matrix";
    result.rows = rows;
    result.cols = cols;
    
    var vectInit;
    for (j=0, k=cols; j<k; j++) {
      vectInit = [];
      for (i=0, l=rows; i<l; i++) {
        vectInit.push(0);
      }
      result[j] = vectInit;
    }

    return result;
  }

  /**
   *
   */
  function sumaMatriz(op1, op2) {
    rows = op1.rows;
    cols = op1.cols;
    result = createMatriz(rows, cols);

    for (j=0; j<rows; j++){
      for (i=0; i<cols; i++) {
        result[i][j] = op1[i][j] + op2[i][j];
      }
    }

    return result;
  }

  /**
   *
   */
  function restaMatriz(op1, op2) {
    rows = op1.rows;
    cols = op1.cols;
    result = createMatriz(rows, cols);

    for (j=0; j<rows; j++){
      for (i=0; i<cols; i++) {
        result[i][j] = op1[i][j] - op2[i][j];
      }
    }

    return result;
  }

  /**
   *
   */
  function multiplicacionMatriz(op1, op2) {
    rows = op1.rows;
    cols = op1.cols;
    result = createMatriz(rows, cols);
    var sum;

    for (j=0; j<rows; j++){
      for (i=0; i<cols; i++) {
        sum = 0;
        for (k=0; k<cols; k++) {
          sum += op1[k][j]*op2[i][k];
        }
        result[i][j] = sum;
      }
    }

    return result;
  }

  /**
   *
   */
  function minor(I, J, T) {
    var M = createMatriz(T.length-1, T.length-1);

    for (var i=0, l=M.length; i<l; i++) {
      for (var j=0; j<l; j++) {
        if (i<I) {
          if (j<J) {
            M[i][j] = T[i][j];
          }
          else {
            M[i][j] = T[i][j+1];
          }
        }
        else {
          if (i<J) {
            M[i][j] = T[i+1][j];
          }
          else {
            M[i][j] = T[i+1][j+1];
          }
        }
      }
    }

    return M;
  }
  /**
   *
   */
  function determinant(T) {
    if (T.cols > 1) {
      var D = 0;
      var s = 1;
      for (var j=0, l=T.cols; j<l; j++) {
        D += s*T[0][j]*determinant(minor(0, j, T));
        s = -s;
      }
      return D;
    } else {
      return T[0][0];
    }
   }

  /**
   *
   */
  function inverseMatriz(T) {
    var S = createMatriz(T.length, T.length);
    var det = determinant(T);

    if (det === 0) {
      return 0;
    }

    var s = 1/det;
    var t;

    if (T.length > 1) {
      for (var i=0, l=T.length; i<l; i++) {
        t = s;
        for (var j=0; j<l; j++) {
          S[j][i] = t*determinant(minor(i, j, T));
          t = - t;
        }
        s = -s;
      }
    }
    else {
      S[0][0] = s;
    }

    return S;
  }  

  /**
   *
   */
  function divisionMatriz(op1, op2) {
    var inverse = inverseMatriz(op2);

    if (inverse === 0) {
      return createMatriz(op1.rows, op1.cols);
    }

    return multiplicacionMatriz(op1, inverse);
  }

  return descartesJS;
})(descartesJS || {});/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un parser de elementos principales de una leccion de descartes
   * @constructor 
   */
  descartesJS.Tokenizer = function() {  };
  
  descartesJS.Tokenizer.prototype.tokenize = function(input) {
    var inputInicial = input;
    if (input) {
      // cambio de valores en utf de la forma \u##
      input = input.replace(/\\u(\S+) /g, function(str, m1){ return String.fromCharCode(parseInt(m1, 16)); });

      // caso para cuando los numeros aparecen como superindices codificados como &sup#;
      input = input.replace(/\&sup(.+);/g, "^$1 ");
      // comillas
      input = input.replace(/&squot;/g, "'");
      
      // pipes como cadenas
      if (input.match(/\=\|\*/g)) {
        input = input.replace("|*", "'", "g").replace("*|", "'", "g");
      }
    }
    
    var tokens = [];
    var exit = false;
    var pos = 0;
    var val;
    var str = input;
    var inc;
    var count = 0;

    var lastTokenType = "";
       
    /** 
     * funcion axiliar para agregar un toke a la lista de tokes y recorrer la posicion en en la cadena a analizar
     */
    var addToken = function(type, value, size) {
      tokens.push({ type: type, value: value });
      str = str.slice(size);
      pos += size;
      count++;
      lastTokenType = type;
    }

    while ((input) && (pos < input.length)) {
      exit = pos;
      
      // cadena
      if (str[0] == "'") {
        inc = 1;
        while (str[inc] != "'") {
          if (inc < str.length) {
            inc++;
          } else {
            console.log(">Error, simbolo no conocido: ["+str+"], en la cadena <<" + inputInicial + ">>" );
            return;
          }
        }
        
        val = str.substring(1, inc);
        addToken("string", val, val.length+2);
        continue;
      }
      
      // espacios en blanco
      val = str.match( /^\s+/ );
      if (val) {
        str = str.slice(val[0].length);
        pos += val[0].length;
        count++;
        continue;
      }
      
      // identificador
//       val = str.match( /^[a-zA-Z_ÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùÄËÏÖÜäëïöüÂÊÎÔÛâêîôûŽ]+[a-zA-Z_0-9ÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùÄËÏÖÜäëïöüÂÊÎÔÛâêîôûŽ]*([.]*[a-zA-Z_ÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùÄËÏÖÜäëïöüÂÊÎÔÛâêîôûŽ]+[0-9]*)*/ );
//       val = str.match( /^[a-zA-Z_\u00C0-\u021B]+[a-zA-Z_0-9\u00C0-\u021B]*([.]*[a-zA-Z_\u00C0-\u021B]+[0-9]*)*/ );
      val = str.match( /^[a-zA-Z_\u00C0-\u021B]+[a-zA-Z_0-9\u00C0-\u021B]*([.]*[0-9a-zA-Z_\u00C0-\u021B]+[0-9]*)*/ );
      if (val) {
        // expresiones de la forma 2pi se convierten en 2*pi, para esto es necesario saber que el token anterior a un identificador es un numero
        if (lastTokenType === "number") {
          tokens.push({ type: "operator", value: "*" });
        }
        addToken("identifier", val[0], val[0].length);
        continue;
      }
    
      // numero
      val = str.match( /^[0-9]+[.][0-9]+|^[.][0-9]+|^[0-9]+/ );
      if (val) {
        addToken("number", val[0], val[0].length);
        
//         // si el token es un numero seguido de un identificador hay que agregar una operacion de multiplicacion entre el numero y el identificador
//         if ( str.match( /^[a-zA-Z_ÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùÄËÏÖÜäëïöüÂÊÎÔÛâêîôûŽ]+[a-zA-Z_0-9ÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùÄËÏÖÜäëïöüÂÊÎÔÛâêîôûŽ]*([.]*[a-zA-Z_ÁÉÍÓÚáéíóúÀÈÌÒÙàèìòùÄËÏÖÜäëïöüÂÊÎÔÛâêîôûŽ]+[0-9]*)*/ ) ) {
//           addToken("operator", "*", 0);
//         }
        
        continue;
      }
    
      // comparacion
      val = str.match( /^==|^!=|^<=|^<|^>=|^>|^#/ );
      if (val) {
        var tempVal = val[0];

        if (tempVal == "#") { tempVal = "!="; }     
          addToken("compOperator", tempVal, val[0].length);
        continue;
      }
        
      // booleanos
      val = str.match( /^\!|^\~|^\&\&|^\&|^\|\||^\|/ );
      if (val) {
        var tempVal = val[0];
        if (tempVal == "||") { tempVal = "|"; } 
        else if (tempVal == "&&") { tempVal = "&"; }
        else if (tempVal == "~") { tempVal = "!"; }

        addToken("boolOperator", tempVal, val[0].length);
        continue;
      }

      // un igual
      val = str.match( /^=/ );
      if ((val) && !(str.match( /^==/))) {
        addToken("asign", val[0], val[0].length);
        continue;
      }

      // condicional
      val = str.match( /^[\?\:]/ );
      if (val) {
        addToken("conditional", val[0], val[0].length);
        continue;
      }
    
      // operador
      val = str.match( /^[\+\-\*\/\%\^]/ );
      if (val) {
        addToken("operator", val[0], val[0].length);
        continue;
      }

      // corchetes
      val = str.match( /^\[|^\]/ );
      if (val) {
        addToken("square_bracket", val[0], val[0].length);
        continue;
      }
    
      // parentesis
      val = str.match( /^\(|^\)/ );
      if (val) {
        addToken("parentheses", val[0], val[0].length);
        continue;
      }
    
      // separador
      val = str.match( /^,/ );
      if (val) {
        addToken("separator", val[0], val[0].length);
        continue;
      }

      // final de la expresion
      val = str.match( /^;/ );
      if (val) {
        addToken("final_of_expresion", val[0], val[0].length);
        continue;
      }

      if (exit == pos){
        console.log("Error, simbolo no conocido: ["+str+"], en la cadena <<" + inputInicial + ">>" );
        return;
      }
    }
  
    return tokens;
  }
  
  /**
   * 
   */
  descartesJS.Tokenizer.prototype.flatTokens = function(tokens) {
    tokens = tokens || [];
    var result = "";
    
    for (var i=0, l=tokens.length; i<l; i++) {
      if (tokens[i].type == "string") {
        result = result + "&squot;" + tokens[i].value + "&squot;";
      } else {
        result = result + tokens[i].value;
      }
    }
    
    return result;
  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * Un parser de elementos principales de una leccion de descartes
   * @constructor 
   */
  descartesJS.Parser = function(evaluator) {
    this.evaluator = evaluator;
    
    this.tokenizer = new descartesJS.Tokenizer();
    this.vectors = {};
    this.matrices = {};
    this.variables = {};
    this.functions = {};
    
    this.variables["rnd"] = Math.random;
    this.variables["pi"] = Math.PI;
    this.variables["e"] = Math.E;
    this.variables["Infinity"] = Infinity;
    this.variables["-Infinity"] = -Infinity;
    
    this.functions["sqr"]   = function(x) { return (x*x) };
    this.functions["sqrt"]  = this.functions["raíz"] = Math.sqrt;
    this.functions["exp"]   = Math.exp;
    this.functions["log"]   = Math.log;
    this.functions["log10"] = function(x) { return Math.log(x)/Math.log(10); };
    this.functions["abs"]   = Math.abs;
    this.functions["ent"]   = Math.floor;
    this.functions["sgn"]   = function(x) { return (x>0) ? 1 : ((x<0) ? -1 : 0); };
    this.functions["ind"]   = function(x) { return (x) ? 1 : 0 };
    this.functions["sin"]   = this.functions["sen"] = Math.sin;
    this.functions["cos"]   = Math.cos;
    this.functions["tan"]   = Math.tan;
    this.functions["cot"]   = function(x) { return 1/Math.tan(x); };
    this.functions["sec"]   = function(x) { return 1/Math.cos(x); };
    this.functions["csc"]   = function(x) { return 1/Math.sin(x); };
    this.functions["sinh"]  = this.functions["senh"] = function(x) { return (Math.exp(x)-Math.exp(-x))/2 };
    this.functions["cosh"]  = function(x) { return (Math.exp(x)+Math.exp(-x))/2; };
    this.functions["tanh"]  = function(x) { return (Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x)); };
    this.functions["coth"]  = function(x) { return 1/this.functions.tanh(x); };
    this.functions["sech"]  = function(x) { return 1/this.functions.cosh(x); };
    this.functions["csch"]  = function(x) { return 1/this.functions.sinh(x); };
    this.functions["asin"]  = this.functions["asen"] = Math.asin;
    this.functions["acos"]  = Math.acos;
    this.functions["atan"]  = Math.atan;
    this.functions["min"]   = Math.min;
    this.functions["max"]   = Math.max;
        
    this.functions["esCorrecto"] = function(x, y) { return descartesJS.esCorrecto(x, y); };
    this.functions["escorrecto"] = function(x, y) { return descartesJS.escorrecto(x, y); };

    // si la leccion se encuentra dentro de un frame hay que registrar las funciones de comunicacion con el padre
    if (window.parent.location.href !== window.location.href) {

      // se registra la funcion para asignar un valor a una variable del padre
      this.functions["parent.set"] = function(varName, value) {
        window.parent.postMessage({ type: "set", name: varName, value: value }, '*');
      }
      
      // se registra la funcion para actualizar al padre
      this.functions["parent.update"] = function() {
        window.parent.postMessage({ type: "update" }, '*');
      }
            
      // se registra la funcion para obtener el valor de una variable del padre
      this.functions["parent.get"] = function(varName, value) {
        window.parent.postMessage({ type: "get", name: varName, value: value }, '*');
      }
            
      // se registra la funcion para ejecutar funciones del padre
      this.functions["parent.exec"] = function(functionName, functionParameters) {
        window.parent.postMessage({ type: "exec", name: functionName, value: functionParameters }, '*');
      }
            
    }
  }
  
  /**
   * 
   */
  descartesJS.Parser.prototype.setVariable = function(name, value){
    this.variables[name] = value;
  }

  /**
   * 
   */
  descartesJS.Parser.prototype.getVariable = function(name){
    // if (!this.variables.hasOwnProperty(name)) {
    //   this.variables[name] = 0;
    // }
    return this.variables[name];
  }

  /**
   * 
   */
  descartesJS.Parser.prototype.setVector = function(name, pos, value){
    this.vectors[name][pos] = value;
  }

  /**
   * 
   */
  descartesJS.Parser.prototype.getVector = function(name){
    if (!this.vectors.hasOwnProperty(name)) {
      this.vectors[name] = [0,0,0];
    }
    return this.vectors[name];
  }

  /**
   * 
   */
  descartesJS.Parser.prototype.setMatrix = function(name, pos1, pos2, value){
    this.matrices[name][pos1][pos2] = value;
  }

  /**
   * 
   */
  descartesJS.Parser.prototype.getMatrix = function(name){
    if (!this.matrices.hasOwnProperty(name)) {
      this.matrices[name] = [[0,0,0],[0,0,0],[0,0,0]];
    }
    return this.matrices[name];
  }

  /**
   * 
   */
  descartesJS.Parser.prototype.setFunction = function(name, value){
    this.functions[name] = value;
  }

  /**
   * 
   */
  descartesJS.Parser.prototype.getFunction = function(name){
    if (!this.functions.hasOwnProperty(name)) {
      this.functions[name] = function(){return 0;};
    }
    return this.functions[name];
  }
 
  /**
   * 
   */
  descartesJS.Parser.prototype.parse = function(input, asignation, prefix) {
    prefix = (prefix) ? prefix+"." : "";

    var tokens = this.tokenizer.tokenize(input);
    // tokens es undefined
    if (!tokens) {
      tokens = [];
    }
    var lastNode = null;
    var node;
    var asignation = !asignation || false;
    var count = 0;
    
    var openParentesis = 0;
    var openSquareBracket = 0;
    var openConditional = 0;
    
    var tokens_i;
    var tokens_i_value;
    var tokens_i_type;

    for (var i=0, l=tokens.length; i<l; i++) {
      tokens_i = tokens[i];
      tokens_i_value = tokens_i.value;
      tokens_i_type = tokens_i.type;
      
      ////////////////////////////////////////////////////////////////////////////////      
      // se verifica si las variables existen
      ////////////////////////////////////////////////////////////////////////////////      
      if (tokens_i_type == "identifier") {
        // el identificador es una funcion
        if ( ((i+1)<l) && (tokens[i+1].type == "parentheses") && (tokens[i+1].value == "(") ) {
          this.getFunction(tokens_i_value);
        }
        // el identificador es un vector o una matriz
        else if ( ((i+1)<l) && (tokens[i+1].type == "square_bracket") && (tokens[i+1].value == "[") ) {
          // vector
          if ( (tokens[i+3]) && (tokens[i+3].type == "square_bracket") && (tokens[i+3].value == "]") ) {
            this.getVector(tokens_i_value);
          }
          // matriz
          else {
            this.getMatrix(tokens_i_value);
          }
        }
        // el identificador es una variable
        else {
          this.getVariable(prefix + tokens_i_value);
        } 
      }
      ////////////////////////////////////////////////////////////////////////////////
      
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Asignacion (un igual =)
      //
      ////////////////////////////////////////////////////////////////////////////////
      if ( (tokens_i_type == "asign") && (asignation) ) {
        tokens_i_type = "compOperator";
        tokens_i_value = "==";
      }
      if (tokens_i_type == "asign") {
        node = new descartesJS.Node(tokens_i_type, tokens_i_value);
        
        //hay algun elemento en el arbol
        if (lastNode != null) {
          //el ultimo elemento en el arbol es un identificador
          if (lastNode.type == "identifier") {
            if (lastNode.parent){
              lastNode.parent.replaceLastChild(node);
            } 
            
            node.addChild(lastNode);
            lastNode = node;
            asignation = true;
          }
            
          else if (lastNode.type == "square_bracket") {
            node.addChild(lastNode.parent);
            lastNode = node;
            asignation = true;            
          }
          
          //cualquier otro caso
          else {
            node.type = "compOperator";
            node.value = "==";
            asignation = true;
            
            //se busca un elemento en el arbol que tengo una precedencia mayor que la del nuevo nodo a agregar
            while ((lastNode.parent) && (this.precedence(lastNode.parent.value) >= this.precedence(node.value))){
              lastNode = lastNode.parent;
            }
            //se encontro un ancestro en el arbol con precedencia mayor que el nodo a insertar
            if (lastNode.parent){
              lastNode.parent.replaceLastChild(node);
              node.addChild(lastNode);
              lastNode = node;
            }
            
            //se llego a la raiz
            else {
              node.addChild(lastNode);
              lastNode = node;
            }
          }
        } 
        
        //No hay ultimo elemento
        else {
          console.log("Error1: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
          break;
        }
      
        //se continua con el siguiente token
        continue;
      }
    
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Parentesis, funciones, vectores y matrices
      //
      ////////////////////////////////////////////////////////////////////////////////
      //parentesis y corchetes que abren
      if ( (tokens_i_type == "parentheses") && (tokens_i_value == "(") || 
        (tokens_i_type == "square_bracket") && (tokens_i_value == "[") ) {
        node = new descartesJS.Node(tokens_i_type, tokens_i_value);
      
        if (tokens_i_value == "(") {
          openParentesis++;
        }
        
        if (tokens_i_value == "[") {
          openSquareBracket++;
        }
      
        //el primer elemento en el arbol
        if (lastNode == null) {
          if (tokens_i_value == "(") {
            var tempNode = new descartesJS.Node("(expr)", "(expr)");
            tempNode.addChild(node);
          }

          if (tokens_i_value == "[") {
            var tempNode = new descartesJS.Node("[expr]", "[expr]");
            tempNode.addChild(node);
          }
          
          lastNode = node;
        }
        //hay algun elemento en el arbol
        else {
          //el ultimo elemento en el arbol es un operador
          if ( (lastNode.type == "operator") || (lastNode.type == "boolOperator") || (lastNode.type == "compOperator") || (lastNode.type == "conditional") || (lastNode.type == "asign") ) {
            lastNode.addChild(node);
            lastNode = node;
          }
          
          //el ultimo elemento es un signo
          else if (lastNode.type == "sign") {
            lastNode.addChild(node);
            lastNode = node;
          }

          //el ultimo elemento en el arbol es un parentesis que abre
          else if ((lastNode.type == "parentheses") && (lastNode.value == "(")) {
            lastNode.addChild(node);
            lastNode = node;
          }
          
          //el ultimo elemento en el arbol es un parentesis que abre
          else if ((lastNode.type == "square_bracket") && (lastNode.value == "[")) {
            lastNode.addChild(node);
            lastNode = node;
          }
          
          //el ultimo elemento en el arbol es un parentesis cerrado
          else if ((lastNode.type == "parentheses") && (lastNode.value == "()")) {
            lastNode.parent.addChild(node);
            lastNode = node;
          }

          //el ultimo elemento en el arbol es un corchete cerrado
          else if ((lastNode.type == "square_bracket") && (lastNode.value == "[]")) {
            lastNode.parent.addChild(node);
            lastNode = node;
          }

          //el ultimo elemento en el arbol es un identificador
          else if (lastNode.type == "identifier") {
            lastNode.addChild(node);
            lastNode = node;
          }
          
          //cualquier otro caso
          else {
            console.log("Error2: en la expresion <<" + input + ">>, en el token ["+ i +"] {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }
        
        //se continua con el siguiente token
        continue;
      }
      
      //parentesis que cierran
      else if ((tokens_i_type == "parentheses") && (tokens_i_value == ")")) {

        openParentesis--;

        //el primer elemento en el arbol
        if (lastNode == null) {
          console.log("Error3: en la expresion <<" + input + ">>, en el token (valor:" + tokens_i_value + ", tipo:" + tokens_i_type);
        }
        
        //hay algun elemento en el arbol
        else {
          //se busca el parentesis que abre correspondiente
          while (lastNode && lastNode.parent && (lastNode.value != "(")) {
            lastNode = lastNode.parent;
          }
          
          //se encontro la pareja del parentesis
          if ((lastNode) && (lastNode.value == "(")) {
            lastNode.value = "()";
          }
          
          //no se encontro la pareja del parentesis
          else {
            console.log("Error4: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }
        
        //se continua con el siguiente token
        continue;
      }
      
      //corchetes que cierran
      else if ((tokens_i_type == "square_bracket") && (tokens_i_value == "]")) {

        openSquareBracket--;
        
        //el primer elemento en el arbol
        if (lastNode == null) {
          console.log("Error5: en la expresion <<" + input + ">>, en el token (valor:" + tokens_i_value + ", tipo:" + tokens_i_type);
        }
        
        //hay algun elemento en el arbol
        else {
          //se busca el corchete que abre correspondiente
          while (lastNode && lastNode.parent && (lastNode.value != "[")) {
            lastNode = lastNode.parent;
          }
          
          //se encontro la pareja del corchete
          if ((lastNode) && (lastNode.value == "[")) {
            lastNode.value = "[]";
          }
          
          //no se encontro la pareja del corchete
          else {
            console.log("Error6: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }
      
        //se continua con el siguiente token
        continue;
      }
  
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Numeros, cadenas e identificadores
      //
      ////////////////////////////////////////////////////////////////////////////////
      if ((tokens_i_type == "number") || (tokens_i_type == "string") || (tokens_i_type == "identifier")) {
        if (tokens_i_type == "identifier") {
          node = new descartesJS.Node(tokens_i_type, prefix + tokens_i_value);
        }
        else {
          node = new descartesJS.Node(tokens_i_type, tokens_i_value);
        }

        //el primer elemento en el arbol
        if (lastNode == null) {
          lastNode = node;
        }
        
        //hay algun elemento en el arbol
        else {
          //el ultimo elemento en el arbol es un operador, es un parentesis que abre, es un signo o asignacion
          if ( (lastNode.type == "operator") || (lastNode.type == "compOperator") || (lastNode.type == "boolOperator") || ((lastNode.type == "parentheses") && (lastNode.value == "(")) || ((lastNode.type == "square_bracket") && (lastNode.value == "[")) || (lastNode.type == "sign")  || (lastNode.type == "conditional") || (lastNode.type == "asign")) {
            lastNode.addChild(node);
            lastNode = node;
          }
          
          //cualquier otro caso
          else {
            console.log("Error7: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }
      
        //se continua con el siguiente token
        continue;
      }

      ////////////////////////////////////////////////////////////////////////////////
      //
      // Operadores
      //
      ////////////////////////////////////////////////////////////////////////////////
      if ( (tokens_i_type == "operator") || (tokens_i_type == "compOperator") || (tokens_i_type == "boolOperator") ) {
        node = new descartesJS.Node(tokens_i_type, tokens_i_value);
        
        //el primer elemento en el arbol
        if (lastNode == null) {
          //un operador puede empezar una expresion solamente si indica el signo de la expresion
          if ((tokens_i_value == "-") || (tokens_i_value == "+")){
            node.type = "sign";
            node.value = "sign" + tokens_i_value;
            lastNode = node;
          } 
            
          //un operador puede empezar una expresion si es una negacion booleana
          else if (tokens_i_value == "!") {
            lastNode = node;
          }
            
          else {
            console.log("Error8: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");  //throw("Error: no se puede iniciar una expresion con un operador <<" + input + ">>")
            break;
          }
        }
        
        //hay algun elemento en el arbol
        else {
          //el ultimo elemento en el arbol es un operador o un parentesis que abre y el operador es un + o -
          if ( (lastNode.type == "operator") || (lastNode.type == "compOperator") || (lastNode.type == "boolOperator") || (lastNode.type == "asign") || (lastNode.type == "conditional") || (((lastNode.type == "square_bracket") && (lastNode.value == "[")) && ((tokens_i_value == "-") || (tokens_i_value == "+") || (tokens_i_value == "!"))) || (((lastNode.type == "parentheses") && (lastNode.value == "(")) && ((tokens_i_value == "-") || (tokens_i_value == "+") || (tokens_i_value == "!"))) ) {
            //signo de una expresion
            if ((tokens_i_value == "-") || (tokens_i_value == "+")){
              node.type = "sign";
              node.value = "sign" + tokens_i_value;
            }
            lastNode.addChild(node);
            lastNode = node;
          }
            
          //el ultimo elemento en el arbol es un numero, una expresion entre parentesis, una cadena o un identificador
          else if ( (lastNode.type == "number") || ((lastNode.type == "parentheses") && (lastNode.value == "()")) || ((lastNode.type == "square_bracket") && (lastNode.value == "[]")) || (lastNode.type == "string") || (lastNode.type == "identifier") || (lastNode.type == "conditional") ||(lastNode.type == "asign") ) {
              
            //se busca un elemento en el arbol que tengo una precedencia mayor que la del nuevo nodo a agregar
            while ((lastNode.parent) && (this.precedence(lastNode.parent.value) >= this.precedence(node.value))){
              lastNode = lastNode.parent;
            }
              
            //se encontro un ancestro en el arbol con precedencia mayor que el nodo a insertar
            if (lastNode.parent){
              lastNode.parent.replaceLastChild(node);
              node.addChild(lastNode);
              lastNode = node;
            }
              
            //se llego a la raiz
            else {
              node.addChild(lastNode);
              lastNode = node;
            }
          }
            
          //cualquier otro caso
          else {
            console.log("Error9: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
            break;
          }
        }
        
        //se continua con el siguiente token
        continue;
      }
    
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Condicional
      //
      ////////////////////////////////////////////////////////////////////////////////
      if (tokens_i_type == "conditional") {
        node = new descartesJS.Node(tokens_i_type, tokens_i_value);
        
        //hay algun elemento en el arbol
        if (lastNode != null) {
          //el operador es ?
          if (node.value == "?") {
            openConditional++;
            
            //se busca un elemento en el arbol que tengo una precedencia mayor que la del nuevo nodo a agregar
            while ((lastNode.parent) && (this.precedence(lastNode.parent.value) > this.precedence(node.value))){
              lastNode = lastNode.parent;
            }
            //se encontro un ancestro en el arbol con precedencia mayor que el nodo a insertar
            if (lastNode.parent){
              lastNode.parent.replaceLastChild(node);
              node.addChild(lastNode);
              lastNode = node;
            }
            
            //se llego a la raiz
            else {
              node.addChild(lastNode);
              lastNode = node;
            }
          } else {
            openConditional--;
            
            //se busca el signo ? correspondiente
            while (lastNode && lastNode.parent && (lastNode.value != "?")) {
              lastNode = lastNode.parent;
            }
            //se encontro el ?
            if ((lastNode) && (lastNode.value == "?")) {
              lastNode.value = "?:";
            }
            
            //no se encontro el ?
            else {
              console.log("Error10: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
              break;
            }
          }
        }
      
        //No hay ultimo elemento
        else {
          console.log("Error11: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
          break;
        }
    
        //se continua con el siguiente token
        continue;
      }
  
      ////////////////////////////////////////////////////////////////////////////////
      //
      // Separador (coma ,)
      //
      ////////////////////////////////////////////////////////////////////////////////
      if (tokens_i_type == "separator") {
        //hay algun elemento en el arbol
        if (lastNode != null) {
          //se busca en el arbol un parentesis que abre
          while ( (lastNode.parent) && (lastNode.value != "(") && (lastNode.value != "[") ) {
            lastNode = lastNode.parent;
          }
        }
        
        else {
          console.log("Error12: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
          break;
        }
        
        //se continua con el siguiente token
        continue;
      }
      
      console.log("Error13: en la expresion <<" + input + ">>, en el token {valor: " + tokens_i_value + ", tipo: " + tokens_i_type + "}");
      break;
    }
    
    // faltaron o sobraron parentesis o corchetes
    if (openParentesis > 0) {
      alert("Error, faltan parentesis por cerrar: " + input);
    }
    if (openParentesis < 0) {
      alert("Error, faltan parentesis por abrir: " + input);
    }
    
    if (openSquareBracket > 0) {
      alert("Error, faltan corchetes por cerrar: " + input);
    }
    if (openSquareBracket < 0) {
      alert("Error, faltan corchetes por abrir: " + input);
    }
    // falto el segundo termino de la condiciona
    if (openConditional !=0) {
      alert("Error, condicional incompleta: " + input);
    }

    var root = (lastNode) ? lastNode.getRoot() : null;
    if (root) {
      root.setAllEvaluateFunction();
    }

    return root;
  }

  /**
   * Obtiene la precedencia de un operador
   */
  descartesJS.Parser.prototype.precedence = function(op) {
    switch(op){
      case "=":  return 1;
      case "(":  return 2;
      case "[":  return 2;
      case "?":  return 2;
      case ":":  return 3;
      case "?:": return 3;
      case "&":  return 6; //checar precedencia
      case "|":  return 6; //checar precedencia
      case "<":  return 4;
      case "<=": return 4;
      case ">":  return 4;
      case ">=": return 4;
      case "==": return 4;
      case "!=": return 4;
      case "+":  return 5;
      case "-":  return 5;
      case "/":  return 6;
      case "*":  return 6;
      case "sign-": return 6;
      case "sign+": return 6;
      case "!":  return 7;
      case "^":  return 7;
      case "%":  return 7;
      default:   return 8;
    }
  }

//  console.log(((new descartesJS.Parser).parse("(t,func(t))")).toString());
//  console.log(((new descartesJS.Parser).parse("3^2%5")).toString());
//  console.log(((new descartesJS.Parser).parse("!0*1")).toString());
//  console.log(((new descartesJS.Parser).parse("  1 / ( a + (c-d) / (e-f) * G / H )")).toString());
//  console.log(((new descartesJS.Parser).parse("((varX1/sqrt(sqr(varX1)+sqr(varX2)+0.001))/( sqr(varX1)+sqr(varX2)+0.001)+((varX1-punto.x)/sqrt(sqr(varX1-punto.x)+sqr(varX2-punto.y)+0.001))/( sqr(varX1-punto.x)+sqr(varX2-punto.y)+0.001))")).toString()); 
//  console.log(((new descartesJS.Parser).parse("[0,(")).toString());
// console.log(((new descartesJS.Parser).parse("-(2)*2/3")).toString());//^2
// console.log(((new descartesJS.Parser).parse("-2^2")).toString());
// console.log(((new descartesJS.Parser).parse("2pi")).toString());
// console.log(((new descartesJS.Parser).parse("s=p1?1:s1")).toString());

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
    
  /**
   * Evaluador
   * @constructor 
   */
  descartesJS.Evaluator = function (parent) {
    this.parent = parent;
    this.parser = new descartesJS.Parser();
    this.variables = this.parser.variables;
    this.functions = this.parser.functions;
    this.vectors = this.parser.vectors;
    this.matrices = this.parser.matrices;
  }
  
  descartesJS.Evaluator.prototype.setVariable = function(name, value) {
    this.variables[name] = value;
  }  
  
  descartesJS.Evaluator.prototype.getVariable = function(name) {
    return this.variables[name];
  }

  descartesJS.Evaluator.prototype.setVector = function(name, pos, value) {
    pos = (pos<0) ? 0 : MathFloor(pos);
    this.vectors[name][pos] = value;
  }

  descartesJS.Evaluator.prototype.getVector = function(name, pos) {
    pos = (pos<0) ? 0 : MathFloor(pos);
    return this.vectors[name][pos];
  }

  descartesJS.Evaluator.prototype.setMatrix = function(name, pos1, pos2, value) {
    pos1 = (pos1<0) ? 0 : MathFloor(pos1);
    pos2 = (pos2<0) ? 0 : MathFloor(pos2);
    this.matrices[name][pos1][pos2] = value;
  }

  descartesJS.Evaluator.prototype.getMatrix = function(name, pos1, pos2) {
    pos1 = (pos1<0) ? 0 : MathFloor(pos1);
    pos2 = (pos2<0) ? 0 : MathFloor(pos2);
    return this.matrices[name][pos1][pos2];
  }

  descartesJS.Evaluator.prototype.setFunction = function(name, value) {
    this.functions[name] = value;
  }

  descartesJS.Evaluator.prototype.getFunction = function(name) {
    return this.functions[name];
  }

  /**
   * 
   */
  descartesJS.Evaluator.prototype.evalExpression = function (expr) {
    return (expr) ? expr.evaluate(this) : 0;

    // var evaluation = this.evalAux(expr);

    // return (evaluation == undefined) ? 0 : evaluation;
  }
    
  // /**
  //  * 
  //  */
  // descartesJS.Evaluator.prototype.evalAux = function (expr) {
  //   if (expr == null) {
  //     return 0;
  //   }
    
  //   var exprType = expr.type;
  //   var exprChilds = expr.childs;
  //   var exprValue = expr.value;
   
  //   // el nodo a evaluar es un numero
  //   if (exprType == "number") {
  //     return parseFloat(exprValue);
  //   }

  //   // el nodo a evaluar es una cadena
  //   else if (exprType == "string") {
  //     return exprValue;
  //   }
    
  //   // el nodo a evaluar es una variable
  //   else if ( (exprType == "identifier") && (exprChilds.length == 0) ) {
  //     if (exprValue == "rnd") {
  //       return Math.random();
  //     }
      
  //     var tempIden = this.variables[exprValue];
  //     if ( typeof(tempIden) == "object" ) {
  //       return this.evalAux(tempIden);
  //     }
      
  //     return tempIden;
  //   }
    
  //   // el nodo a evaluar es un corchete, para casos cuando se usan expresiones como en los textos, es decir, x=[x+1]
  //   else if (exprType == "square_bracket") {
  //     return this.evalAux(exprChilds[0])
  //   }
    
  //   // el nodo a evaluar es un vector
  //   else if ( (exprType == "identifier") && (exprChilds[0].type == "square_bracket") && (exprChilds[0].childs.length == 1)) {
  //     var pos = this.evalAux(exprChilds[0].childs[0]);

  //     try {
  //       return this.vectors[exprValue][(pos<0) ? 0 : MathFloor(pos)];
  //     } 
  //     // se accede a un valor que no existe
  //     catch(e) { return 0; }
  //   }
      
  //   // el nodo a evaluar es una matriz
  //   else if ( (exprType == "identifier") && (exprChilds[0].type == "square_bracket") && (exprChilds[0].childs.length > 1)) {
  //     var pos1 = this.evalAux(exprChilds[0].childs[0]);
  //     var pos2 = this.evalAux(exprChilds[0].childs[1]);

  //     try {
  //       return this.matrices[exprValue][(pos1<0) ? 0 : MathFloor(pos1)][(pos2<0) ? 0 : MathFloor(pos2)];
  //     } 
  //     // se accede a un valor que no existe
  //     catch(e) { return 0; }

  //   }

  //   // el nodo a evaluar es una funcion
  //   else if ( (exprType == "identifier") && (exprChilds[0].type == "parentheses") ) {
      
  //     var argu = [];
  //     for (var i=0, l=exprChilds[0].childs.length; i<l; i++) {
  //       argu.push( this.evalAux(exprChilds[0].childs[i]) );
  //     }
      
  //     // funcion interna de evaluacion
  //     if (exprValue == "_Eval_") {
  //       if (!(expr.previousExpression) || (expr.previousExpression != argu[0])) {
  //         expr.previousExpression = argu[0];
  //         expr.previousParse = this.parser.parse(argu[0]);
  //       }

  //       return this.evalAux(expr.previousParse);
  //     }
      
  //     return this.functions[exprValue].apply(this, argu);
  //   }
    
  //   // el nodo a evaluar es un operador
  //   else if (exprType == "operator") {
  //     var decimals = ((this.decimals == undefined) || (this.decimals<0)) ? 2 : this.decimals;
  //     var fixed = this.fixed || false;
      
  //     var op1, op2;
      
  //     op1 = this.evalAux(exprChilds[0]);
  //     op2 = this.evalAux(exprChilds[1]);

  //     // esto es para manejar las cadenas en las expresiones, [expr]+cadena o cadena+[expr]
  //     if (exprValue == "+") { return (op1 + op2); }
  //     else if(exprValue == "-") { return (op1 - op2); }
  //     else if(exprValue == "*") { return (op1 * op2); }
  //     else if(exprValue == "/") { return (op1 / op2); }
  //     else if(exprValue == "%") { return (op1 - MathFloor(op1/op2)*op2); }
  //     else if(exprValue == "^") { return (Math.pow(op1, op2)); }
  //   }
    
  //   // el nodo a evaluar es un operador de comparacion
  //   else if (exprType == "compOperator") {
  //     var op1, op2;
  //     op1 = this.evalAux(exprChilds[0]);
  //     op2 = this.evalAux(exprChilds[1]);
    
  //     if (exprValue == "<")      { return (op1 <  op2)+0; } // para regresar los valores como 0 o 1 en lugar de true y false
  //     else if(exprValue == "<=") { return (op1 <= op2)+0; }
  //     else if(exprValue == ">")  { return (op1 >  op2)+0; }
  //     else if(exprValue == ">=") { return (op1 >= op2)+0; }
  //     else if(exprValue == "==") { return (op1 == op2)+0; }
  //     else if(exprValue == "!=") { return (op1 != op2)+0; }
  //   }
    
  //   // el nodo a evaluar es un operador booleano
  //   else if (exprType == "boolOperator") {
  //     var op1, op2;
  //     op1 = (this.evalAux(exprChilds[0]) == 1) ? 1 : 0;
      
  //     // para regresar los valores como 0 o 1 en lugar de true y false    
  //     if (exprValue == "&") {
  //       if (op1) {
  //         return (this.evalAux(exprChilds[1]) == 1) ? 1 : 0;
  //       } else {
  //         return 0;
  //       }
  //     }
  //     else if(exprValue == "|") { 
  //       if (op1) {
  //         return 1;
  //       } else {
  //         return (this.evalAux(exprChilds[1]) == 1) ? 1 : 0;          
  //       }
  //     }
  //     else if(exprValue == "!") { 
  //       return !op1+0; 
  //     }
  //   }
    
  //   // el nodo a evaluar es un if (?:)
  //   else if (exprType == "conditional") {
  //     var op1, op2, op3;
  //     op1 = this.evalAux(exprChilds[0]);
            
  //     if (op1 > 0) {
  //       return this.evalAux(exprChilds[1]);
  //     } else {
  //       return this.evalAux(exprChilds[2]);
  //     }
  //   }
    
  //   // el nodo a evaluar es un signo
  //   else if (exprType == "sign") {
  //     if (exprValue == "sign+") {
  //       return this.evalAux(exprChilds[0]);
  //     } else {
  //       return -(this.evalAux(exprChilds[0]));
  //     }
  //   }
    
  //   // el nodo a evaluar es un parentesis
  //   else if (exprType == "parentheses") {
  //     return this.evalAux(exprChilds[0]);
  //   }
        
  //   // el nodo a evaluar es una expresion (x,y) o [x,y]
  //   else if ( (exprType == "(expr)") || (exprType == "[expr]") ){
  //     var l = exprChilds.length;
  //     var result = [];
      
  //     // la expresion parentizada solo tiene un argumento (1)
  //     if ( (l == 1) && (exprChilds[0].childs.length ==1) && (exprType == "(expr)") ) {
  //       result = this.evalAux(exprChilds[0].childs[0]);
  //     } 
      
  //     // la expresion tiene un conjunto de argumentos (1,2,...) o es un arreglo
  //     else {
  //       var tmpRes;
  //       for (var i=0; i<l; i++) {
  //         tmpRes = [];
  //         for (var j=0, n=exprChilds[i].childs.length; j<n;j++) {
  //           tmpRes.push( this.evalAux(exprChilds[i].childs[j]) );
  //         }
  //         result[i] = tmpRes;
  //       }
  //     }

  //     return result;
  //   }
    
  //   // el nodo a evaluar es una asignacion
  //   else if (exprType == "asign") {
  //     var ide = exprChilds[0];
  //     var expre = exprChilds[1];
      
  //     if ((ide.childs.length == 1) && (ide.childs[0].type == "square_bracket")) {
  //       var pos = ide.childs[0].childs;
        
  //       // un vector
  //       if (pos.length == 1) {
  //         var tmpPos = this.evalAux(pos[0]);
  //         tmpPos = (tmpPos<0) ? 0 : MathFloor(tmpPos);
  //         this.vectors[ide.value][tmpPos] = this.evalAux(expre);
          
  //         return;
  //       }
        
  //       // una matriz
  //       else if (pos.length == 2) {
  //         var tmpPos0 = this.evalAux(pos[0]);
  //         var tmpPos1 = this.evalAux(pos[1]);
  //         tmpPos0 = (tmpPos0<0) ? 0 : MathFloor(tmpPos0);
  //         tmpPos1 = (tmpPos1<0) ? 0 : MathFloor(tmpPos1);
  //         this.matrices[ide.value][tmpPos0][tmpPos1] = this.evalAux(expre);

  //         return;
  //       }
  //     } else {
  //       this.variables[ide.value] = this.evalAux(expre);

  //       return;
  //     }      
  //   }

  //   // el nodo a evaluar es desconocido
  //   else {
  //     console.log("Error en la evaluacion, expresion desconocida <" + exprValue + "> \n" + expr);
  //     return;
  //   } 
  // }

//console.log((new descartesJS.Evaluator()).evalExpression((new descartesJS.Parser()).parse("ent(rnd*10)")));
//console.log((new descartesJS.Evaluator()).evalExpression((new descartesJS.Parser()).parse("(!0)")));
//console.log((new descartesJS.Evaluator()).evalExpression((new descartesJS.Parser()).parse("1 / ( 10 + (20-30) / (40-50) * 60 / 70 )")));
//console.log((new descartesJS.Evaluator()).evalExpression((new descartesJS.Parser()).parse("2*3/4")));
// console.log((new descartesJS.Evaluator()).evalExpression((new descartesJS.Parser()).parse("-2^2")));

// console.log((new descartesJS.Evaluator({decimal_symbol: "."})).evalExpression((new descartesJS.Parser()).parse("''+2.12345"), 2, true));

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var externalDecimals = 2;
  var externalFixed = false;
  
  /**
   * Un nodo que forma un arbol de parseo
   * @constructor 
   */
  descartesJS.RTFNode = function(evaluator, value, nodeType, style) {
    this.evaluator = evaluator;

    this.type = "rtfNode";
   
    this.value = value;
    this.nodeType = nodeType;
    this.style = style;
    this.styleString = style.toString()
    this.color = style.textColor;
    this.underline = style.textUnderline;
    this.overline = style.textOverline;
    
    this.parent = null;
    this.childs = [];
    
//     this.fixed = false;
//     this.decimals = this.evaluator.parser.parse("2");
    
    // el bloque superior de texto
    if (this.nodeType == "textBlock") {
      this.draw = this.drawTextBlock;
    }
    
    // una linea de texto
    else if (this.nodeType == "textLineBlock") {
      this.draw = this.drawTextLineBlock;
    }

    // una formula
    else if (this.nodeType == "formula") {
      this.draw = this.drawFormula;
    }
    
    // un super indice
    else if (this.nodeType == "superIndex") {
      this.draw = this.drawSuperIndex;
    }

    // un sub indice
    else if (this.nodeType == "subIndex") {
      this.draw = this.drawSubIndex;
    }

    // un texto dinamico
    else if (this.nodeType == "dynamicText") {
      this.draw = this.drawDynamicText;
      this.decimal_symbol = this.evaluator.parent.decimal_symbol;
    }

    // una fraccion
    else if (this.nodeType == "fraction") {
      this.draw = this.drawFraction;
    }
    
    // un numerador o un denominador
    else if ( (this.nodeType == "numerator") || (this.nodeType == "denominator") ) {
      this.draw = this.drawNumDen;
    }
    
    // una raiz
    else if (this.nodeType == "radical") {
      this.draw = this.drawRadical;
    }
        
    // un limite
    else if (this.nodeType == "limit") {
      this.draw = this.drawLimit;
    }
    
    // una integral
    else if (this.nodeType == "integral") {
      this.draw = this.drawIntegral;
    }
    
    // una suma
    else if (this.nodeType == "sum") {
      this.draw = this.drawSum;
    }
    
    // una matiz
    else if (this.nodeType == "matrix") {
      this.draw = this.drawMatrix;
    }
    
    // un elemento de un defparts
    else if (this.nodeType == "defparts") {
      this.draw = this.drawDefparts;
    }
    
    // un texto
    else if ((this.nodeType == "text") || (this.nodeType == "newLine")) {
      this.draw = this.drawText;
    }
    
    // simbolos matematicos en el texto
    else if (this.nodeType == "mathSymbol") {
      this.draw = this.drawMathSymbol;
    }
    
    // el indice de una raiz, el contenido de una raiz, desde donde va una suma, hasta donde va una suma, el contenido de una suma, un elemento
    else if ( (this.nodeType == "index") || 
              (this.nodeType == "radicand") ||
              (this.nodeType == "from") ||
              (this.nodeType == "to") ||
              (this.nodeType == "what") ||
              (this.nodeType == "element")
            ) {
      this.draw = this.drawGenericBlock;
    }
    
    // un componente del tipo control
    else if (this.nodeType == "componentNumCtrl") {
      this.draw = this.drawComponentNumCtrl;
    }

    // un componente del tipo control
    else if (this.nodeType == "componentSpace") {
      this.draw = this.drawComponentSpace;
    }
  }

  /**
   * Obtiene el nodo raiz del arbol
   */
  descartesJS.RTFNode.prototype.getRoot = function() {
    if (this.parent == null) {
      return this;
    }
    return this.parent.getRoot();
  }

  /**
   * Agrega un hijo al arbol
   * @param {descartesJS.RTFNode} child el hijo que se quiere agregar
   */
  descartesJS.RTFNode.prototype.addChild = function(child) {
    child.parent = this;
    this.childs.push(child);
  }
  
  // valores de la metrica anterior, necesaria para calcular los valores para los super y sub indices
  var previousMetric = { ascent: 0, descent: 0, height: 0 };
  function updatePreviousMetric(ascent, descent, height) {
    previousMetric.ascent = ascent;
    previousMetric.descent = descent;
    previousMetric.height = height; 
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.getTextMetrics = function() {
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    if (this.nodeType == "textBlock") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);

      for (var i=0, l=this.childs.length; i<l; i++) {
        this.childs[i].getTextMetrics();
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "textLineBlock") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);

      this.getBlockMetric();
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "newLine") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);

      var metrics = descartesJS.getFontMetrics(this.styleString);

      this.baseline = metrics.baseline;

      this.descent = metrics.descent;
      this.ascent = metrics.ascent;
      
      this.width = metrics.width;
      this.height = metrics.height;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if ( (this.nodeType == "text") || (this.nodeType == "dynamicText")) {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);

      var metrics = descartesJS.getFontMetrics(this.styleString);

      this.baseline = metrics.baseline;

      this.descent = metrics.descent;
      this.ascent = metrics.ascent;
      
      var textTemp = this.value;
      var decimals;
      var fixed;

      // si el texto es una expresion, para textos dinamicos
      if (typeof(this.value) != "string") {
        decimals = (this.decimals == undefined) ? externalDecimals : this.evaluator.evalExpression(this.decimals);
        fixed = (this.fixed == undefined) ? externalFixed : this.fixed;
        textTemp = this.evaluator.evalExpression(this.value, decimals, fixed);
        
        // es un numero
        if (parseFloat(textTemp) == textTemp) {
          textTemp = parseFloat(textTemp).toFixed(decimals);
          textTemp = (fixed) ? textTemp : parseFloat(textTemp);
          textTemp = textTemp.toString().replace(".", this.decimal_symbol);
        }
        
        textTemp += " ";
      }
            
      this.width = descartesJS.getTextWidth(textTemp, this.styleString);
      this.height = metrics.height;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "formula") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      this.getBlockMetric();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "superIndex") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;

      var metric = descartesJS.getFontMetrics(this.styleString);

      this.getBlockMetric();

      if (this.height < 0) {
        this.ascent = metric.ascent;
        this.descent = metric.descent;
        this.height = this.ascent + this.descent;
        this.width = this.spaceWidth*1.5;
      }
      
      var tmpAscent = prevHeight/2 - prevDescent + this.height;
      this.superIndexPos = tmpAscent - this.ascent;
      
      this.ascent = tmpAscent;
      this.descent = prevDescent;
      this.baseline = this.ascent;
      this.height = this.ascent + this.descent;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "subIndex") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;
      
      var metric = descartesJS.getFontMetrics(this.styleString);

      this.getBlockMetric();

      if (this.height < 0) {
        this.ascent = metric.ascent;
        this.descent = metric.descent;
        this.height = this.ascent + this.descent;
        this.width = this.spaceWidth*1.5;
      }

      this.subIndexPos = prevDescent +1;
      
      this.ascent = prevAscent;
      this.descent = this.subIndexPos + this.descent;
      this.baseline = this.ascent;
      this.height = this.ascent + this.descent;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "fraction") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;
      
      var num = this.childs[0];
      var den = this.childs[1];

      var metric = descartesJS.getFontMetrics(num.styleString);

      num.getBlockMetric();
      den.getBlockMetric();
      
      if (num.height < 0) {
        num.height = metric.height;
        num.width = this.spaceWidth;
      }
      if (den.height < 0) {
        den.height = metric.height;
        den.width = this.spaceWidth;
      }
      
      this.height = num.height + den.height -1;

      this.ascent = num.height + prevHeight/2-prevDescent;
      this.descent = this.height - this.ascent;
      this.baseline = this.ascent;

      this.width = Math.max(num.width, den.width) +this.spaceWidth +8;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "radical") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var index;
      var radicand;
      var tmpStyle = this.childs[0].style.clone();
      var tmpRadican;

      // correccion en algunas raices que aparecen de forma extraña en arquimedes
      // si tiene solo un hijo
      if (this.childs.length === 1) {
        // radican
        this.childs[1] = new descartesJS.RTFNode(this.evaluator, "", "radicand", tmpStyle);
        this.childs[1].addChild(this.childs[0]);
        // index
        this.childs[0] = new descartesJS.RTFNode(this.evaluator, "", "index", tmpStyle);
      }
      // si tiene mas de un hijo
      else {
        // si los dos primeros hijos, no son un index y un radicand, significa que esta en la forma rara de arquimedes y es necesario agregar todos los hijos como hijos de un nodo radicand
        if ( (this.childs[0].nodeType !== "index") || (this.childs[1].nodeType !== "radicand") ) {
          // radican
          tmpRadican = new descartesJS.RTFNode(this.evaluator, "", "radicand", tmpStyle);
          for (var i=0, l=this.childs.length; i<l; i++) {
            tmpRadican.addChild(this.childs[i]);
          }
          this.childs = [];

          this.childs[0] = new descartesJS.RTFNode(this.evaluator, "", "index", tmpStyle);
          this.childs[1] = tmpRadican;
        }
      }

      index    = this.childs[0];
      radicand = this.childs[1];

      index.getBlockMetric();
      radicand.getBlockMetric();

      if (radicand.height/2 < index.height) {
        this.ascent = radicand.height/2 + index.height+2 - radicand.descent;
      } 
      else {
        this.ascent = radicand.ascent +4;
      }
      
      this.descent = radicand.descent;
      this.baseline = this.ascent;
      this.height = this.ascent + this.descent;

      this.width = index.width + radicand.width +4*this.spaceWidth;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "sum") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;
      
      var from = this.childs[0];
      var to   = this.childs[1];
      var what = this.childs[2]
      
      from.getBlockMetric();
      to.getBlockMetric();
      what.getBlockMetric();
      
      // si from es vacio entonces su ascent es -1, pero es necesario calcular el espacio que ocuparia
      if (from.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(from.styleString);
        from.ascent = tmpMetric.ascent;
        from.descent = tmpMetric.descent;
        from.height = tmpMetric.height;
      }
      // si to es vacio entonces su ascent es -1, pero es necesario calcular el espacio que ocuparia
      if (to.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(to.styleString);
        to.ascent = tmpMetric.ascent;
        to.descent = tmpMetric.descent;
        to.height = tmpMetric.height;
      }
      
      var metric = descartesJS.getFontMetrics(this.styleString);

      // el ascent
      if (metric.height+to.height > what.ascent) {
        this.ascent = metric.height-metric.descent +to.height;
      } else {
        this.ascent = what.ascent;
      }
      
      // el descent
      if (from.height > what.descent) {
        this.descent = from.height + metric.descent;
      } else {
        this.descent = what.descent;
      }

      this.baseline = this.ascent;
      this.height = this.ascent + this.descent;

      var symbolStyle = this.style.clone();
      symbolStyle.fontType = "Times New Roman";
      symbolStyle.Bold = "bold";
      symbolStyle = symbolStyle.toString();

      var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(parseInt(8721)), symbolStyle);
      
      this.width = Math.max(from.width, to.width, symbolWidth) + Math.max(what.width, this.spaceWidth) +this.spaceWidth;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "integral") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;
      
      var from = this.childs[0];
      var to   = this.childs[1];
      var what = this.childs[2]
      
      from.getBlockMetric();
      to.getBlockMetric();
      what.getBlockMetric();
      
      // si from es vacio entonces su ascent es -1, pero es necesario calcular el espacio que ocuparia
      if (from.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(from.styleString);
        from.ascent = tmpMetric.ascent;
        from.descent = tmpMetric.descent;
        from.height = tmpMetric.height;
      }
      // si to es vacio entonces su ascent es -1, pero es necesario calcular el espacio que ocuparia
      if (to.ascent == -1) {
        var tmpMetric = descartesJS.getFontMetrics(to.styleString);
        to.ascent = tmpMetric.ascent;
        to.descent = tmpMetric.descent;
        to.height = tmpMetric.height;
      }

      var metric = descartesJS.getFontMetrics(this.styleString);

      // el ascent
      if (metric.height+to.height > what.ascent) {
        this.ascent = metric.height-metric.descent +to.height;
      } else {
        this.ascent = what.ascent;
      }
      
      // el descent
      if (from.height > what.descent) {
        this.descent = from.height + metric.descent;
      } else {
        this.descent = what.descent;
      }

      this.baseline = this.ascent;
      this.height = this.ascent + this.descent;

      var symbolStyle = this.style.clone();
      symbolStyle.fontSize = 1.5*symbolStyle.fontSize;
      symbolStyle.fontType = "Times New Roman";
      symbolStyle.Bold = "bold";
      symbolStyle = symbolStyle.toString();

      var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(parseInt(8747)), symbolStyle);
        
      this.width = Math.max(from.width, to.width, symbolWidth) + Math.max(what.width, this.spaceWidth) +2*this.spaceWidth;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "limit") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;
      
      var from = this.childs[0];
      var to   = this.childs[1];
      var what = this.childs[2]
      var tmpMetric;
      var metric = descartesJS.getFontMetrics(this.styleString);

      from.getBlockMetric();
      to.getBlockMetric();
      what.getBlockMetric();
      
      // si from es vacio entonces su ascent es -1, pero es necesario calcular el espacio que ocuparia
      if (from.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(from.styleString);
        from.ascent = tmpMetric.ascent;
        from.descent = tmpMetric.descent;
        from.height = tmpMetric.height;
      }
      // si to es vacio entonces su ascent es -1, pero es necesario calcular el espacio que ocuparia
      if (to.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(to.styleString);
        to.ascent = tmpMetric.ascent;
        to.descent = tmpMetric.descent;
        to.height = tmpMetric.height;
      }
      // si what es vacio entonces su ascent es -1, pero es necesario calcular el espacio que ocuparia
      if (what.ascent == -1) {
        tmpMetric = descartesJS.getFontMetrics(what.styleString);
        what.ascent = tmpMetric.ascent;
        what.descent = tmpMetric.descent;
        what.height = tmpMetric.height;
      }
            
      this.ascent = what.ascent;
      this.descent = Math.max(metric.height, what.descent);
      this.baseline = this.ascent;
      this.height = this.ascent + this.descent;

      var limitWidth = descartesJS.getTextWidth(" " + String.fromCharCode(parseInt(8594)), this.styleString);

      if (from.width == 0) {
        from.width = this.spaceWidth;
      }
      if (to.width == 0) {
        to.width = this.spaceWidth;
      }
      if (what.width == 0) {
        what.width = this.spaceWidth;
      }

      this.width = to.width + from.width + what.width + limitWidth + this.spaceWidth;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "matrix") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      
      var metric = descartesJS.getFontMetrics(this.styleString);
      
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;
      
      var maxAscenderHeight = metric.ascent;
      var maxDescenderHeight = metric.descent;
      var maxHeigth = metric.height;
      var maxWidth = this.spaceWidth;

      var childHeight;
      var childWidth;
      
      for (var i=0, l=this.childs.length; i<l; i++) {
        this.childs[i].getBlockMetric();
        
        childHeight = this.childs[i].height;
        childWidth = this.childs[i].width;
        
        if (maxHeigth < childHeight) {
          maxHeigth = childHeight;
          maxAscenderHeight = this.childs[i].ascent;
          maxDescenderHeight = this.childs[i].descent;
        }
        
        if (maxWidth < childWidth) {
          maxWidth = childWidth;
        }
      }
      
      this.childWidth = maxWidth + 2*this.spaceWidth;
      this.childHeight = maxHeigth;
      this.childAscent = maxAscenderHeight;
      this.childDescent = maxDescenderHeight;
      
      this.height = this.rows * maxHeigth;
      this.ascent = this.height/2 + prevDescent;
      this.descent = this.height - this.ascent;
      this.width = this.columns * this.childWidth +this.spaceWidth;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "defparts") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      
      var metric = descartesJS.getFontMetrics(this.styleString);
      
      var prevAscent = previousMetric.ascent;
      var prevDescent = previousMetric.descent;
      var prevHeight = previousMetric.height;
      
      var maxAscenderHeight = metric.ascent;
      var maxDescenderHeight = metric.descent;
      var maxHeigth = metric.height;
      var maxWidth = this.spaceWidth;

      var childHeight;
      var childWidth;

      for (var i=0, l=this.childs.length; i<l; i++) {
        this.childs[i].getBlockMetric();
        
        childHeight = this.childs[i].height;
        childWidth = this.childs[i].width;
        
        if (maxHeigth < childHeight) {
          maxHeigth = childHeight;
          maxAscenderHeight = this.childs[i].ascent;
          maxDescenderHeight = this.childs[i].descent;
        }
        
        if (maxWidth < childWidth) {
          maxWidth = childWidth;
        }
      }
      
      this.childWidth = maxWidth + 2*this.spaceWidth;
      this.childHeight = maxHeigth;
      this.childAscent = maxAscenderHeight;
      this.childDescent = maxDescenderHeight;
      
      this.height = this.parts * maxHeigth;
      this.ascent = this.height/2 + prevDescent;
      this.descent = this.height - this.ascent;
      this.width = maxWidth +this.spaceWidth/2;
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (this.nodeType == "mathSymbol") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      var metrics = descartesJS.getFontMetrics(this.styleString);

      this.baseline = metrics.baseline;
      this.descent = metrics.descent;
      this.ascent = metrics.ascent;
                  
      this.width = descartesJS.getTextWidth(this.value, this.styleString) + descartesJS.getTextWidth(" ", this.styleString);
      this.height = metrics.height;
    }
    
    else if (this.nodeType == "componentNumCtrl") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      this.componentNumCtrl = this.evaluator.parent.getControlByCId(this.value);
      
      this.baseline = 0;
      this.descent = 0;
      this.ascent = 0;
      
      this.height = 0;
      this.width = this.componentNumCtrl.w;
    }
    
    else if (this.nodeType == "componentSpace") {
      this.spaceWidth = descartesJS.getTextWidth(" ", this.styleString);
      this.componentSpace = this.evaluator.parent.getSpaceByCId(this.value);
      
      this.baseline = 0;
      this.descent = 0;
      this.ascent = 0;
      
      this.height = 0;
      this.width = this.componentSpace.w;
    }
        
    else {
      console.log("elemento no conocido", this.nodeType);
    }
    
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.getBlockMetric = function() {
    this.width = 0;
    var maxDescenderHeight = -1;
    var maxAscenderHeight = -1;
    var childHeight;
    var childs_i;
    
    // se recorren todos los hijos de la linea de texto, para determinar cual es el ancho, el alto
    for (var i=0, l=this.childs.length; i<l; i++) {
      childs_i = this.childs[i];
      childs_i.getTextMetrics();

      childAscent = childs_i.ascent;
      childDescent = childs_i.descent;

      this.width += childs_i.width;
     
      // se actualiza la metrica anterior
      updatePreviousMetric(childAscent, childDescent, childs_i.height);
      
      if (maxAscenderHeight < childAscent) {
        maxAscenderHeight = childAscent;
      }

      if (maxDescenderHeight < childDescent) {
        maxDescenderHeight = childDescent;
      }
      
    }

    this.ascent = maxAscenderHeight;
    this.descent = maxDescenderHeight;
    this.baseline = this.ascent;
    this.height = this.ascent + this.descent;
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawTextBlock = function(ctx, x, y, decimals, fixed, align) {
    // si existe un texto dinamico entonces hay que calcular los anchos de los elementos
    if(!this.stableWidth) {
      this.getTextMetrics();
      externalDecimals = decimals;
      externalFixed = fixed;
    }
    
    var desp = 0;
    
    var antChildY = 0;

    for (var i=0, l=this.childs.length; i<l; i++) {
      if (i>0) {
        antChildY += this.childs[i-1].height;
      }
      
      // si el texto esta centrado
      if (align == "center") {
        desp = -this.childs[i].width/2;
      }
      // si el texto esta alineado a la derecha
      else if (align == "right") {
        desp =-this.childs[i].width;
      }
      
      this.childs[i].draw(ctx, x +desp, y+antChildY);
    }
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawTextLineBlock = function(ctx, x, y) {
    // console.log("@", this.childs.length);
    var antChildX = 0;
    for (var i=0, l=this.childs.length; i<l; i++) {
      // console.log(">>>", i, this.childs[i], this.childs[i].nodeType);

      if (i>0) {
        antChildX += this.childs[i-1].width;

        if ((this.childs[i-1].nodeType == "formula")) {
          // console.log(i, antChildX);

          antChildX += 2*descartesJS.getTextWidth(" ", this.childs[i].styleString);
        }
      }

      this.childs[i].draw(ctx, x+antChildX, y+this.baseline);
    }
  }  
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawFormula = function(ctx, x, y) {
    var antChildX = 0;

    for (var i=0, l=this.childs.length; i<l; i++) {
      if (i>0) {
        antChildX += this.childs[i-1].width;
      }
      this.childs[i].draw(ctx, x + this.spaceWidth + antChildX, y);
    }    
  }
      
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawText = function(ctx, x, y) {
    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = this.styleString;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";

    ctx.fillText(this.value, x-1, y);
    
    if (this.underline) {
      var isBold = this.style.textBold == "bold";
      var sep = isBold ? 1 : .5;

      ctx.lineWidth = isBold ? 2 : 1;
      if (this.color != null) {
        ctx.strokeStyle = this.color;
      }
      ctx.beginPath();
      ctx.moveTo(x-1, parseInt(y+this.descent/2) +sep);
      ctx.lineTo(x-1+this.width, parseInt(y+this.descent/2) +sep);
      ctx.stroke();
    }
    
    if (this.overline) {
      var isBold = this.style.textBold == "bold";
      var sep = isBold ? 2 : 1.5;

      ctx.lineWidth = isBold ? 2 : 1;
      if (this.color != null) {
        ctx.strokeStyle = this.color;
      }
      ctx.beginPath();
      ctx.moveTo(x-1, parseInt(y-this.ascent) +sep);
      ctx.lineTo(x-1+this.width, parseInt(y-this.ascent) +sep);
      ctx.stroke();
    }
  }
      
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawDynamicText = function(ctx, x, y) {
    var spaceWidth = Math.floor(this.spaceWidth*.5);

    var decimals = (this.decimals == undefined) ? externalDecimals : this.evaluator.evalExpression(this.decimals);
    var fixed = (this.fixed == undefined) ? externalFixed : this.fixed;

    var textTemp = this.evaluator.evalExpression(this.value, decimals, fixed);
    
    // el texto es un numero
    if (parseFloat(textTemp) == textTemp) {
      textTemp = (fixed) ? parseFloat(textTemp).toFixed(decimals) : parseFloat(parseFloat(textTemp).toFixed(decimals));
      textTemp = (""+textTemp).replace(".", this.decimal_symbol);
    }

    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = this.styleString;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";

    this.width = descartesJS.getTextWidth(textTemp, this.styleString);
    ctx.fillText(textTemp, spaceWidth + x, y);

    if (this.underline) {
      var isBold = this.style.textBold == "bold";
      var sep = isBold ? 1 : .5;

      ctx.lineWidth = isBold ? 2 : 1;
      if (this.color != null) {
        ctx.strokeStyle = this.color;
      }
      ctx.beginPath();
      ctx.moveTo(spaceWidth + x-1, parseInt(y+this.descent/2) +sep);
      ctx.lineTo(spaceWidth + x-1+this.width, parseInt(y+this.descent/2) +sep);
      ctx.stroke();
    }
    
    if (this.overline) {
      var isBold = this.style.textBold == "bold";
      var sep = isBold ? 2 : 1.5;

      ctx.lineWidth = isBold ? 2 : 1;
      if (this.color != null) {
        ctx.strokeStyle = this.color;
      }
      ctx.beginPath();
      ctx.moveTo(spaceWidth + x-1, parseInt(y-this.ascent) +sep);
      ctx.lineTo(spaceWidth + x-1+this.width, parseInt(y-this.ascent) +sep);
      ctx.stroke();
    }
    
    this.width += 2*spaceWidth;
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawRadical = function(ctx, x, y) {
    var spaceWidth = Math.floor(this.spaceWidth);
    
    this.childs[0].draw(ctx, x, Math.floor(y +this.childs[1].descent -this.childs[1].height/2 -this.childs[0].descent));
    this.childs[1].draw(ctx, x+1.5*spaceWidth+(this.childs[0].width), y);
    
    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()

    ctx.moveTo(x, Math.floor(y +this.childs[1].descent -this.childs[1].height/2));
    ctx.lineTo(x+this.childs[0].width, Math.floor(y +this.childs[1].descent -this.childs[1].height/2));
    ctx.lineTo(x+this.childs[0].width +.5*spaceWidth, y+this.childs[1].descent);
    ctx.lineTo(x+this.childs[0].width +1*spaceWidth, y-this.childs[1].ascent);
    ctx.lineTo(x+this.childs[0].width +2*spaceWidth+this.childs[1].width, y-this.childs[1].ascent);

    ctx.stroke();
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawFraction = function(ctx, x, y) {
    this.childs[0].draw(ctx, x+(this.width-this.childs[0].width)/2, y -this.ascent);
    this.childs[1].draw(ctx, x+(this.width-this.childs[1].width)/2, y -this.ascent + this.childs[0].height -1);

    var spaceWidth = Math.floor(this.spaceWidth*.5);
    
    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()
    ctx.moveTo(x+spaceWidth, parseInt(y -this.ascent + this.childs[0].height)+.5);
    ctx.lineTo(x-spaceWidth+this.width-1, parseInt(y -this.ascent + this.childs[0].height)+.5);
    ctx.stroke();
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawNumDen = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.childs.length; i<l; i++) {
      if (i>0) {
        antChildX += this.childs[i-1].width;
      }
      this.childs[i].draw(ctx, x+antChildX, y+this.baseline);
    }  
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawSubIndex = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.childs.length; i<l; i++) {
      if (i>0) {
        antChildX += this.childs[i-1].width;
      }
      this.childs[i].draw(ctx, x+antChildX, y +this.subIndexPos);
    }
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawSuperIndex = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.childs.length; i<l; i++) {
      if (i>0) {
        antChildX += this.childs[i-1].width;
      }
      this.childs[i].draw(ctx, x+antChildX, y -this.superIndexPos);
    }  
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawLimit = function(ctx, x, y) {
    var metric = descartesJS.getFontMetrics(this.styleString);

    var symbolString = " " + String.fromCharCode(parseInt(8594));
    var symbolWidth = descartesJS.getTextWidth(symbolString, this.styleString);
    
    // from
    this.childs[0].draw(ctx, x, y +metric.descent +this.childs[0].ascent);
    
    // to
    this.childs[1].draw(ctx, x +this.childs[0].width +symbolWidth, y +metric.descent +this.childs[1].ascent);
    
    //what
    this.childs[2].draw(ctx, x +symbolWidth +this.childs[0].width +this.childs[1].width, y);

    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = this.styleString
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("lím", x +this.childs[0].width, y);
    
    ctx.fillText(symbolString, x+this.childs[0].width, y +metric.descent +this.childs[0].ascent);
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawIntegral = function(ctx, x, y) {
    var symbolStyle = this.style.clone();
    symbolStyle.fontSize = 1.5*symbolStyle.fontSize;
    symbolStyle.fontType = "Times New Roman";
    symbolStyle.Bold = "bold";
    symbolStyle = symbolStyle.toString();    
    
    var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(parseInt(8747)), symbolStyle);
    var symbolMetric = descartesJS.getFontMetrics(symbolStyle);

    var maxWidth = Math.max(this.childs[0].width, this.childs[1].width, Math.floor(1.5*symbolWidth));
    
    // from
    this.childs[0].draw(ctx, x +symbolWidth, y +symbolMetric.descent +this.childs[0].ascent);
    
    // to
    this.childs[1].draw(ctx, x +symbolWidth +this.spaceWidth/2, y -this.ascent +this.childs[1].ascent);
    
    //what
    this.childs[2].draw(ctx, x +maxWidth +symbolWidth, y);

    //signo sigma
    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = symbolStyle;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    
    ctx.fillText(String.fromCharCode(parseInt(8747)), x, y +symbolMetric.descent/2);
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawSum = function(ctx, x, y) {
    var symbolStyle = this.style.clone();
    symbolStyle.fontType = "Times New Roman";
    symbolStyle.Bold = "bold";
    symbolStyle = symbolStyle.toString();    

    var symbolWidth = descartesJS.getTextWidth(String.fromCharCode(parseInt(8721)), symbolStyle);
    var symbolMetric = descartesJS.getFontMetrics(this.styleString);

    var maxWidth = Math.max(this.childs[0].width, this.childs[1].width, symbolWidth);
    
    // from
    this.childs[0].draw(ctx, x +(maxWidth-this.childs[0].width)/2, y +symbolMetric.descent +this.childs[0].ascent);
    
    // to
    this.childs[1].draw(ctx, x +(maxWidth-this.childs[1].width)/2, y -symbolMetric.ascent -this.childs[1].descent);
    
    //what
    this.childs[2].draw(ctx, x +maxWidth, y);

    //signo sigma
    if (this.color != null) {
      ctx.fillStyle = this.color;
    }
    ctx.font = symbolStyle;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    
    ctx.fillText(String.fromCharCode(parseInt(8721)), x +Math.floor( (maxWidth-symbolWidth)/2 ), y-5);      
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawMatrix = function(ctx, x, y) {
    var columnIndex;
    var rowIndex;
    
    for (var i=0, l=this.childs.length; i<l; i++) {
      columnIndex = i%this.columns;
      rowIndex = Math.floor(i/this.columns);
            
      this.childs[i].draw(ctx, 2*this.spaceWidth + x + columnIndex*this.childWidth, y-this.ascent+this.childAscent + rowIndex*this.childHeight);
    }
    
    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()
    ctx.moveTo(Math.floor(x +this.spaceWidth) +.5, y -this.ascent +.5);
    ctx.lineTo(Math.floor(x +this.spaceWidth/2) +.5, y -this.ascent +.5);
    ctx.lineTo(Math.floor(x +this.spaceWidth/2) +.5, y +this.descent +.5);
    ctx.lineTo(Math.floor(x +this.spaceWidth) +.5, y +this.descent +.5);
    
    ctx.moveTo(Math.floor(x +this.width -this.spaceWidth) -.5, y -this.ascent +.5);
    ctx.lineTo(Math.floor(x +this.width -this.spaceWidth/2) -.5, y -this.ascent +.5);
    ctx.lineTo(Math.floor(x +this.width -this.spaceWidth/2) -.5, y +this.descent +.5);
    ctx.lineTo(Math.floor(x +this.width -this.spaceWidth) -.5, y +this.descent +.5);    
    
    ctx.stroke();  
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawDefparts = function(ctx, x, y) {
    for (var i=0, l=this.childs.length; i<l; i++) {
      this.childs[i].draw(ctx, x + this.spaceWidth/4, y-this.ascent+this.childAscent + (i%this.parts)*this.childHeight);
    }

    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
    }
    ctx.beginPath()
    ctx.moveTo(Math.floor(x +this.spaceWidth/3) +.5, y -this.ascent +.5);
    ctx.lineTo(Math.floor(x +this.spaceWidth/6) +.5, y -this.ascent +.5 +(this.spaceWidth/3-this.spaceWidth/6));
    
    ctx.lineTo(Math.floor(x +this.spaceWidth/6) +.5, y +this.descent -this.height/2 -(this.spaceWidth/3-this.spaceWidth/6));
    ctx.lineTo(x +.5, y +this.descent -this.height/2);
    ctx.lineTo(Math.floor(x +this.spaceWidth/6) +.5, y +this.descent -this.height/2 +(this.spaceWidth/3-this.spaceWidth/6));
    
    ctx.lineTo(Math.floor(x +this.spaceWidth/6) +.5, y +this.descent +.5 -(this.spaceWidth/3-this.spaceWidth/6));
    ctx.lineTo(Math.floor(x +this.spaceWidth/3) +.5, y +this.descent +.5);
    
    ctx.stroke(); 
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawMathSymbol = function(ctx, x, y) {
    ctx.lineWidth = 1;
    if (this.color != null) {
      ctx.strokeStyle = this.color;
      ctx.fillStyle = this.color;
    }
    ctx.beginPath()

    if (this.value == "(") {
      ctx.font = this.styleString;
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
      ctx.fillText("(", x, y);
      // ctx.moveTo(x +this.spaceWidth +.1, y -this.parent.ascent +this.height/10);
      // ctx.quadraticCurveTo(x +this.spaceWidth/5, y +this.parent.descent -this.parent.height/2,
      //                      x +this.spaceWidth, y +this.parent.descent -this.height/10);
      // ctx.stroke();
    }
    else if (this.value == ")") {
      ctx.font = this.styleString;
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(")", x+this.spaceWidth, y);
      // ctx.moveTo(x +this.spaceWidth +.1, y -this.parent.ascent +this.height/10);
      // ctx.quadraticCurveTo(x +this.spaceWidth +4*this.spaceWidth/5, y +this.parent.descent -this.parent.height/2,
      //                      x +this.spaceWidth, y +this.parent.descent -this.height/10);
      // ctx.stroke();
    }
    else {
      ctx.font = this.styleString;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      
      ctx.fillText(this.value, x +this.width/2, y);      
    }
  }
  
  /**
   * Dibuja los bloques de texto que no necesitan modificar las posicion de sus componentes
   */
  descartesJS.RTFNode.prototype.drawGenericBlock = function(ctx, x, y) {
    var antChildX = 0;
    for (var i=0, l=this.childs.length; i<l; i++) {
      if (i>0) {
        antChildX += this.childs[i-1].width;
      }
      this.childs[i].draw(ctx, x+antChildX, y);
    }  
  }  
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawComponentNumCtrl = function(ctx, x, y) {
    this.getTextMetrics();
    this.componentNumCtrl.expresion = this.evaluator.parser.parse("(" + x + "," + (y-this.parent.ascent) + "," + this.componentNumCtrl.w + "," + this.componentNumCtrl.h + ")");
  }
  
  /**
   * 
   */
  descartesJS.RTFNode.prototype.drawComponentSpace = function(ctx, x, y) {
    this.getTextMetrics();
    
    this.componentSpace.xExpr = this.evaluator.parser.parse(x+"");
    this.componentSpace.yExpr = this.evaluator.parser.parse((y-this.parent.ascent)+"");
  }

  /**
   * 
   */
  descartesJS.RTFNode.prototype.draw = function(ctx, x, y) {
    console.log(">>> Dibujo desconocido ", this.nodeType);
    this.childs[0].draw(ctx, x, y);
  }

  /**
   * 
   * 
   */
//   descartesJS.Arial = {};
//   descartesJS.Arial.ascent = [ 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 86, 87, 88, 89, 90, 91]
//   descartesJS.Arial.descent = [ 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 22]
//   descartesJS.Arial.leading = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 3, 3, 2, 2, 3, 3, 2, 2, 3, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3]
//   descartesJS.Times = {};
//   descartesJS.Times.ascent = [ 1, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 25, 26, 27, 28, 29, 30, 31, 32, 33, 33, 34, 35, 36, 37, 38, 39, 40, 41, 41, 42, 43, 44, 45, 46, 47, 48, 49, 49, 50, 51, 52, 53, 54, 55, 56, 57, 57, 58, 59, 60, 61, 62, 63, 64, 65, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 74, 75, 76, 77, 78, 79, 80, 81, 82, 82, 83, 84, 85, 86, 87, 88, 89, 90]
//   descartesJS.Times.descent = [ 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 21, 22, 22, 22]
//   descartesJS.Times.leading = [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 3, 2, 2, 2, 3, 3, 2, 2, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 4, 3, 3, 3, 4, 4, 3, 3, 4, 4, 4, 3, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4]
//   descartesJS.Mono = {};
//   descartesJS.Mono.ascent = [ 1, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 15, 16, 17, 18, 19, 20, 20, 21, 22, 23, 24, 25, 25, 26, 27, 28, 29, 30, 30, 31, 32, 33, 34, 35, 35, 36, 37, 38, 39, 40, 40, 41, 42, 43, 44, 45, 45, 46, 47, 48, 49, 50, 50, 51, 52, 53, 54, 55, 55, 56, 57, 58, 59, 60, 60, 61, 62, 63, 64, 65, 65, 66, 67, 68, 69, 70, 70, 71, 72, 73, 74, 75, 75, 76, 77, 78, 79, 80, 80, 81, 82, 83, 84]
//   descartesJS.Mono.descent = [ 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 23, 23, 23, 24, 24, 24, 24, 25, 25, 25, 26, 26, 26, 27, 27, 27, 27, 28, 28, 28, 29, 29, 29, 30, 30, 30, 30]
//   descartesJS.Mono.leading = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]


  // Valore auxiliares para calcular las metricas
  var text = document.createElement("span");
  text.appendChild( document.createTextNode("Áp Texto") );
  var block = document.createElement("div");
  block.setAttribute("style", "display: inline-block; width: 1px; height: 0px;");
  var div = document.createElement("div");
  div.setAttribute("style", "margin: 0; padding: 0;");
  div.appendChild(text);
  div.appendChild(block);
  var metricCache = {};

  descartesJS.getFontMetrics = function(font) {
    if (metricCache[font]) {
      return metricCache[font];
    }

    text.setAttribute("style", "font: " + font + "; margin: 0; padding: 0;");

    document.body.appendChild(div);
    
    var result = {};
    
    block.style.verticalAlign = "baseline";
    result.ascent = block.offsetTop - text.offsetTop;
    
    block.style.verticalAlign = "bottom";
    result.height = block.offsetTop - text.offsetTop;
    
    result.descent = result.height - result.ascent;
    
    result.baseline = result.ascent;
    
    document.body.removeChild(div);

    metricCache[font] = result;
    
    return result;
  }
  
  /**
   * 
   */
//   descartesJS.getFontMetrics = function(font) {
  function getFontMetrics1(font) {
    var metrics = {};
    var fontSize = 8;
    var ascentFactor;
    var descentFactor;

    var fontMatch = font.match(/(\d+)px/);
    if (fontMatch) {
      fontSize = fontMatch[1];
    }
    
    fontMatch = font.match(/(\d+.\d+)px/);
    if (fontMatch) {
      fontSize = fontMatch[1];
    }
    
    fontSize = (fontSize < 0) ? 0 : ((fontSize > 100) ? 100 : Math.floor(fontSize))
    
    // la tipografia es arial
    if (font.toLowerCase().match("arial")) {
//       metrics.leading = descartesJS.Arial.leading[fontSize];
      
      metrics.xHeight = fontSize*.53;
      
      if ((fontSize >= 8) && (fontSize <= 13)) {
        ascentFactor = fontSize*1.05; //9 10 11 12 13 14
        descentFactor = fontSize*.23; //2  3  3  3  3  3
      }
      else if ((fontSize > 13) && (fontSize <= 20)) {
        ascentFactor = fontSize;      //14 15 16 17 18 19 20
        descentFactor = fontSize*.18; // 3  3  3  4  4  4  4
      }
      else if ((fontSize > 20) && (fontSize <= 24)) {
        ascentFactor = fontSize*.915; // 20 21 22 22
        descentFactor = fontSize*.215; //  5  5  5  6
      }
      else if ((fontSize > 24) && (fontSize <= 25)) {
        ascentFactor = fontSize*.95; // 24
        descentFactor = fontSize*.2; //  5
      }
      else if ((fontSize > 25) && (fontSize <= 29)) {
        ascentFactor = fontSize*.964; // 26 27 27 28
        descentFactor = fontSize*.2;  //  6  6  6  6
      }
      else if ((fontSize > 29) && (fontSize <= 32)) {
        ascentFactor = fontSize*.935; // 29 30 
        descentFactor = fontSize*.21; //  7  7
      }
      else if ((fontSize > 32) && (fontSize <= 36)) {
        ascentFactor = fontSize*.942; // 33 34
        descentFactor = fontSize*.2;  //  7  8
      }
      else if ((fontSize > 36) && (fontSize <= 44)) {
        ascentFactor = fontSize*.91;  // 35 37 41
        descentFactor = fontSize*.22; //  9  9 10
      }
      else if ((fontSize > 44) && (fontSize <= 48)) {
        ascentFactor = fontSize*.94; // 42
        descentFactor = fontSize*.2; //  9
      }
      else if ((fontSize > 48) && (fontSize <= 52)) {
        ascentFactor = fontSize*.925; // 49
        descentFactor = fontSize*.23; // 12
      }
      else if ((fontSize > 52) && (fontSize <= 56)) {
        ascentFactor = fontSize*.9;   // 51
        descentFactor = fontSize*.23; // 13
      }
      else if ((fontSize > 52) && (fontSize <= 72)) {
        ascentFactor = fontSize*.91;  // 59 62 66 
        descentFactor = fontSize*.21; // 14 15 16
      }
      else if ((fontSize > 72) && (fontSize <= 100)) {
        ascentFactor = fontSize*.907; // 69 
        descentFactor = fontSize*.21; // 16
      }
    }
    
    // la tipografia es times
    else if (font.toLowerCase().match("times")) {
//       metrics.leading = descartesJS.Times.leading[fontSize];

      metrics.xHeight = fontSize*.46;
      
      if ((fontSize >= 8) && (fontSize <= 9)) {
        ascentFactor = fontSize*1.125; // 9 11
        descentFactor = fontSize*.2;   // 2  2
      }
      else if ((fontSize > 9) && (fontSize <= 12)) {
        ascentFactor = fontSize*1.05; // 11 12
        descentFactor = fontSize*.2;  //  2  3
      }
      else if ((fontSize > 12) && (fontSize <= 15)) {
        ascentFactor = fontSize*.93;  // 13 14 14
        descentFactor = fontSize*.21; //  3  3  4
      }
      else if ((fontSize > 15) && (fontSize <= 21)) {
        ascentFactor = fontSize*.89;  // 15 16 17 17 18 19
        descentFactor = fontSize*.22; //  4  4  4  5  5  5
      }
      else if ((fontSize > 21) && (fontSize <= 24)) {
        ascentFactor = fontSize*.913; // 21 21 22 
        descentFactor = fontSize*.22; //  5  6  6
      }
      else if ((fontSize > 21) && (fontSize <= 27)) {
        ascentFactor = fontSize*.921; // 24 24 25
        descentFactor = fontSize*.23; //  6  6  7
      }
      else if ((fontSize > 27) && (fontSize <= 30)) {
        ascentFactor = fontSize*.93;  // 27 27 28
        descentFactor = fontSize*.23; //  7  7  7
      }
      else if ((fontSize > 30) && (fontSize <= 32)) {
        ascentFactor = fontSize*.9;   // 29 
        descentFactor = fontSize*.23; //  8
      }
      else if ((fontSize > 32) && (fontSize <= 52)) {
        ascentFactor = fontSize*.915;  // 32 33 35 37 41 44 48
        descentFactor = fontSize*.235; //  8  9  9 10 11 12 13
      }
      else if ((fontSize > 52) && (fontSize <= 68)) {
        ascentFactor = fontSize*.91;   // 51 55 59 62 
        descentFactor = fontSize*.232; // 14 14 15 16
      }
      else if ((fontSize > 68) && (fontSize <= 100)) {
        ascentFactor = fontSize*.9;    // 66 69 72
        descentFactor = fontSize*.232; // 17 18 19
      }
    }

    // la tipografia es courier
    else if (font.toLowerCase().match("courier")) {
//       metrics.leading = Math.round(fontSize/7);//descartesJS.Mono.leading[fontSize];
      
      metrics.xHeight = fontSize*.44;
      
      if (fontSize == 8) {
        ascentFactor = fontSize*.78;  //7
        descentFactor = fontSize*.19; //2
      }
      else if ( (fontSize > 8) && (fontSize <=10)) {
        ascentFactor = 10;            //10 10
        descentFactor = fontSize*.24; // 3  3
      }
      else if ((fontSize > 10) && (fontSize <= 12)) {
        ascentFactor = fontSize*1.05; //12 13
        descentFactor = fontSize*.19; // 3  3
      }
      else if ((fontSize > 12) && (fontSize <= 14)) {
        ascentFactor = fontSize*1;    //13 14
        descentFactor = fontSize*.24; // 4  4
      }
      else if ((fontSize > 14) && (fontSize <= 17)) {
        ascentFactor = fontSize*.9;   //14 15 16
        descentFactor = fontSize*.24; // 4  4  5
      }
      else if ((fontSize > 17) && (fontSize <= 23)) {
       ascentFactor = fontSize*.855;  //16 17 18 18 19 20
        descentFactor = fontSize*.24; // 5  5  5  6  6  6
      }
      else if ((fontSize > 23) && (fontSize <= 24)) {
        ascentFactor = fontSize*.85;  //21
        descentFactor = fontSize*.26; // 7
      }
      else if ((fontSize > 24) && (fontSize <= 25)) {
        ascentFactor = fontSize*.89;  //23
        descentFactor = fontSize*.26; // 7
      }
      else if ((fontSize > 25) && (fontSize <= 27)) {
        ascentFactor = fontSize*.88;  //23 24
        descentFactor = fontSize*.24; // 7  7
      }
      else if ((fontSize > 27) && (fontSize <= 34)) {
        ascentFactor = fontSize*.85;  //24 26 28 29
        descentFactor = fontSize*.26; // 8  8  9  9
      }
      else if ((fontSize > 34) && (fontSize <= 38)) {
        ascentFactor = fontSize*.81;  //30 31
        descentFactor = fontSize*.26; //10 10
      }
      else if ((fontSize > 38) && (fontSize <= 44)) {
        ascentFactor = fontSize*.8;   //32 36
        descentFactor = fontSize*.26; //11 12
      }
      else if ((fontSize > 44) && (fontSize <= 48)) {
        ascentFactor = fontSize*.79;  //38
        descentFactor = fontSize*.26; //13
      }
      else if ((fontSize > 48) && (fontSize <= 52)) {
        ascentFactor = fontSize*.83;  //44
        descentFactor = fontSize*.26; //14
      }
      else if ((fontSize > 52) && (fontSize <= 60)) {
        ascentFactor = fontSize*.82;  //46 50
        descentFactor = fontSize*.26; //15 16
      }
      else if ((fontSize > 60) && (fontSize <= 100)) {
        ascentFactor = fontSize*.8;    //52 55
        descentFactor = fontSize*.267; //18 19
      }
    }
    
    metrics.ascent = Math.ceil(ascentFactor);
    metrics.descent = Math.ceil(descentFactor);
    metrics.height = metrics.descent + metrics.ascent;
    metrics.baseline = metrics.ascent;
    
    return metrics;
  }
  
  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   *
   * @constructor 
   */
  descartesJS.RTFTokenizer = function() { };
  
  /**
   * 
   */
  descartesJS.RTFTokenizer.prototype.tokenize = function(input) {
//     console.log(input);
    if (input) {
      input = input.replace(/(\\\w+)(\\u\d+)/g, "$1 $2");

      input = input.replace(/\\u(\d+) /g, function(str, m1){ return String.fromCharCode(parseInt(m1)); });
      
      // se escapan las llaves con caracteres no visibles, para evitar confusion con las llaves no escapadas
      // input = input.replace(/\\{/g, String.fromCharCode(10003));
      // input = input.replace(/\\}/g, String.fromCharCode(10005));

      // se cambian las llaves escapadas para que no se confundan con las llaves que abren y cierran bloques
      input = input.replace(/\\{/g, String.fromCharCode(0));
      input = input.replace(/\\}/g, String.fromCharCode(1));

      // input = input.replace(/\'/g, "&squot;");
      input = input.replace(/&squot;/g, "'");
      input = input.replace(/&amp;/g, "&");
      input = input.replace(/&lt;/g, "<");
      input = input.replace(/&gt;/g, ">");
    }

    var tokens = [];
    var str = input;
    var pos = 0;
    var blockNumber = 0;
    var val;
    var exit;
    var controlWord;
    var indexOfOpenCurlyBracket;
    var indexOfCloseCurlyBracket;
    var indexOfBackSlach;
    var max;
    var displace;
    
    var addToken = function(type, value, size) {
      tokens.push({ type: type, value: value });
      str = str.slice(size);
      pos += size;
    }

    while ((input) && (pos < input.length)) {
      exit = pos;

      // llave que abre
      if (str.charAt(0) == "{") {
        blockNumber++;
        addToken("openBlock", blockNumber, 1);
        continue;
      }

      // llave que cierra
      if (str.charAt(0) == "}") {
        addToken("closeBlock", blockNumber, 1);
        blockNumber--;
        if (str == "") { pos = input.length; }
        continue;
      }
     
      // una secuancia de control de RTF
      // de la forma \rtfControlWord\ entre diagonales
      val = str.match(/^\\([\w\*]*)\\/);
      if ((val) && (val[1])) {
        controlWord = val[1];
        addToken("controlWord", controlWord, controlWord.length+1);
        pos = pos - 1;
        continue;
      }
      // de la forma \rtfControlWord una diagonal al inicio y un espacio en blanco al final
      val = str.match(/^\\(\w*)\s/);
      if ((val) && (val[1])) {
        controlWord = val[1];
        addToken("controlWord", controlWord, controlWord.length+2);
//         pos = pos - 1;
        continue;
      }
      // de la forma \rtfControlWord{ una diagonal al inicio y una llave al final
      val = str.match(/^\\(\w*)\{/);
      if ((val) && (val[1])) {
        controlWord = val[1];
        addToken("controlWord", controlWord, controlWord.length+1);
        pos = pos - 1;
        continue;
      }
      // de la forma \rtfControlWord} una diagonal al inico y una llave al final
      val = str.match(/^\\(\w*)\}/);
      if ((val) && (val[1])) {
        controlWord = val[1];
        addToken("controlWord", controlWord, controlWord.length+1);
        pos = pos - 1;
        continue;
      }
      // de la forma \rtfControlWord;\ una diagonal al inico y un punto y coma con una diagonal al final
      val = str.match(/^\\(\w*)\;\\/);
      if ((val) && (val[1])) {
        controlWord = val[1];
        addToken("controlWord", controlWord, controlWord.length+2);
        pos = pos - 1;
        continue;
      }
      // de la forma \rtfControlWord;} una diagonal al inico y un punto y coma con una llave que cierra al final
      val = str.match(/^\\(\w*)\;\}/);
      if ((val) && (val[1])) {
        controlWord = val[1];
        addToken("controlWord", controlWord, controlWord.length+2);
        pos = pos - 1;
        continue;
      }
      // de la forma \rtfControlWord una diagonal al inicio y el documento se termino
      val = str.match(/^\\(\w*)/);
      if ((val) && (val[1])) {
        controlWord = val[1];
        addToken("controlWord", controlWord, controlWord.length+1);
        pos = input.length;
        continue;
      }      
      
      if ( (str.charAt(0) != "{") && (str.charAt(0) != "}") && (str.charAt(0) != "\\") ) {
        indexOfOpenCurlyBracket = str.indexOf("{");
        indexOfCloseCurlyBracket = str.indexOf("}");
        indexOfBackSlach = str.indexOf("\\");

        max = str.length;
        indexOfOpenCurlyBracket = (indexOfOpenCurlyBracket == -1) ? (max+1) : indexOfOpenCurlyBracket;
        indexOfCloseCurlyBracket = (indexOfCloseCurlyBracket == -1) ? (max+1) : indexOfCloseCurlyBracket;
        indexOfBackSlach = (indexOfBackSlach == -1) ? (max+1) : indexOfBackSlach;

        displace = Math.min(indexOfOpenCurlyBracket, indexOfCloseCurlyBracket, indexOfBackSlach);
      
        if ( (displace != -1) && (displace != 0) ) {
          addToken("text", (str.substring(0, displace)).replace(String.fromCharCode(0), "{").replace(String.fromCharCode(1), "}"), displace);
          if (str == "") { 
            pos = input.length;
          }
          continue;
        }
        else {
          addToken("text", str.replace(String.fromCharCode(0), "{").replace(String.fromCharCode(1), "}"), str.length+1)
          pos = input.length;
          continue;
        }        
      }
      
      if (exit == pos){
        console.log("Error, simbolo no conocido: <<["+str+"]>>" );
        return;
      }

    }

    return tokens;
  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }
  
  /**
   * 
   * @constructor 
   */
  descartesJS.RTFParser = function(evaluator) {
    this.evaluator = evaluator;
    this.tokenizer = new descartesJS.RTFTokenizer();
  }
  
  /**
   * 
   * @constructor 
   */
  descartesJS.RTFParser.prototype.parse = function(input) {
    // console.log(input);
    var tokens = this.tokenizer.tokenize(input);
    tokens = checkMathSymboslInFormula(tokens);
    var indexToken = 0;
    var fontTable = {};
    var openBlockIndex;
    var tempI = 2;
    //console.log(tokens);
    
    // se construye el bloque de tipografias
    if ( (tokens[0].type == "openBlock") && (tokens[1].value == "fonttbl") ) {
      openBlockIndex = tokens[0].value;
      
      while ( ((tokens[tempI].type != "closeBlock") && (tokens[tempI].value != openBlockIndex)) ) {
        fontTable[tokens[tempI].value] = (tokens[tempI+2].value).substring(0, (tokens[tempI+2].value).length-1);
        tempI = tempI + 3;
      }
      
      tempI++;
    }

    var colorTable = {};
    var colorTableIndex = 0;
    var r, g, b;
    
    // se contruye el bloque de colores
    if ( (tokens[tempI].type == "openBlock") && (tokens[tempI+1].value == "colortbl") ) {
      openBlockIndex = tokens[tempI++].value;
      
      tempI++;
      
      while ( ((tokens[tempI].type != "closeBlock") && (tokens[tempI].value != openBlockIndex)) ) {
        r = parseInt(tokens[tempI++].value.substring(3)).toString(16);
        g = parseInt(tokens[tempI++].value.substring(5)).toString(16);
        b = parseInt(tokens[tempI++].value.substring(4)).toString(16);
        
        // #rrggbb
        colorTable[colorTableIndex++] = "#" + ((r.length < 2)? "0"+r : r) + ((g.length < 2)? "0"+g : g) + ((b.length < 2)? "0"+b : b);
      }
      
      tempI++;      
    }

    // nodos iniciales del arbol de parseo
    var newNode = new descartesJS.RTFNode(this.evaluator, "", "textBlock", "", false, "");
    var lastNode = new descartesJS.RTFNode(this.evaluator, "", "textLineBlock", "", false, "");
    newNode.addChild(lastNode);
    
    var lastDynamicNode;
    var lastMatrixNode;
    var lastPartsNode;
    var descartesFormula = false;
    var dinamycText = false;
    var setDecimals = false;
    var setRows = false;
    var setColumns = false;
    var setParts = false;
    var currentBlock = [];
//     var styleStack = [ new descartesJS.FontStyle(20, "Arial", "", "", false, false, "#000000") ];
    var styleStack = [ new descartesJS.FontStyle(20, "Arial", "", "", false, false, null) ];
    var styleStackTop = styleStack[0];
    var stableWidth = true;

    var blockNum = -1;
    var formulaBlock = -1;
    var formulaStack = [];
    
    // bandera para saber si el texto contiene una formula
    var hasFormula = false;
    
    // componente de texto rtf de arquimedes
    var descartesComponentNumCtrl = false;
    var descartesComponentSpace = false;
    var descartesHyperLink = false;
    
    // se contruyen los nodos de texto
    for (var i=tempI, l=tokens.length; i<l; i++) {
      // se especifica la fuente
      if ((tokens[i].type == "controlWord") && (fontTable[tokens[i].value])) {
        styleStackTop.fontType = fontTable[tokens[i].value];
        continue;
      }
      
      // se especifica el tamano de la fuente
      else if ((tokens[i].type == "controlWord") && (tokens[i].value.match(/^fs(\d+)/))) {
        styleStackTop.fontSize = parseInt(((tokens[i].value.match(/^fs(\d+)/))[1])/2);
        continue;
      }
      
      // se especifica si es negrita
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "b")) {
        styleStackTop.textBold = "bold";
        continue;
      }
      // se especifica si ya no es negrita 
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "b0")) {
        styleStackTop.textBold = "";
        continue;
      }
      
      // se especifica si es italica
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "i")) {
        styleStackTop.textItalic = "italic";
        continue;
      }
      // se especifica si ya no es italica
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "i0")) {
        styleStackTop.textItalic = "";
        continue;
      }
      
      // se especifica si esta subrayado
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "ul")) {
        styleStackTop.textUnderline = true;
        continue;
      }

      // se especifica si ya no esta subrayado
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "ulnone")) {
        styleStackTop.textUnderline = false;
        continue;
      }
      
      // se especifica si tiene una linea sobre el texto
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "ol")) {
        styleStackTop.textOverline = true;
        continue;
      }

      // se especifica si ya no tiene una linea sobre el texto
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "olnone")) {
        styleStackTop.textOverline = false;
        continue;
      }
      
      // se especifica el color del texto
      else if ((tokens[i].type == "controlWord") && (tokens[i].value.match(/^cf(\d+)/))) {
        styleStackTop.textColor = colorTable[parseInt(tokens[i].value.substring(2))];
        continue;
      }

      // se especifica el inicio de un bloque de rtf generalemente para expresiones o formulas
      else if (tokens[i].type == "openBlock") {
        blockNum = tokens[i].value;
        
        styleStackTop = styleStackTop.clone();
        styleStack.push(styleStackTop);
        
        formulaStack.push(null);

        continue;
      }
      
      // se especifica el cierre de un bloque de rtf generalemente para expresiones o formulas
      else if (tokens[i].type == "closeBlock") {
        if (tokens[i].value == formulaBlock) {
          formulaBlock = -1;
          descartesFormula = false;
          lastNode = lastNode.parent;
        }
        
        styleStack.pop();
        styleStackTop = styleStack[styleStack.length-1];

        formulaStack.pop();

        continue;
      }

      // se especifica un salto de linea
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "par")) {
        lastNode.addChild( new descartesJS.RTFNode(this.evaluator, "", "newLine", styleStackTop.clone()) );
        
        newNode = new descartesJS.RTFNode(this.evaluator, "", "textLineBlock", styleStackTop.clone());
        
        // se busca un textBlock para
        if (lastNode.nodeType != "textBlock") {
          lastNode = lastNode.parent;
         
          while (lastNode.nodeType != "textBlock") {
            lastNode = lastNode.parent;
          }
        }

        lastNode.addChild(newNode);
        lastNode = newNode;

        continue;
      }

      // se especifica una formula de descartes
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "mjaformula")) {
        hasFormula = true;
        formulaBlock = blockNum;
        descartesFormula = true;
        
        newNode = new descartesJS.RTFNode(this.evaluator, "", "formula", styleStackTop.clone());
        lastNode.addChild(newNode);
        lastNode = newNode;
        
        formulaStack[formulaStack.length-1] = newNode;
        continue;
      }

      // se especifica una fraccion, una raiz, una suma, una integral, un limite
      else if ((tokens[i].type == "controlWord") && ((tokens[i].value == "fraction") || 
                                                     (tokens[i].value == "radicand") || 
                                                     (tokens[i].value == "radical") ||
                                                     (tokens[i].value == "what") ||
                                                     (tokens[i].value == "sum") ||
                                                     (tokens[i].value == "integral") ||
                                                     (tokens[i].value == "limit")
                                                    )) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

        newNode = new descartesJS.RTFNode(this.evaluator, "",  tokens[i].value, tmpStyle);

        // se agrega el nuevo nodo al elemento anterior al tope, ya que el tope contiene el nuevo elemento a agregar
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // se coloca el valor del nuevo elemento como el tope del stack
        formulaStack[formulaStack.length-1] = newNode;
        
        continue;
      }

      // se especifica el indice de una raiz, hasta donde va la suma o la integral, desde donde va la suma o la integral
      else if ((tokens[i].type == "controlWord") && ( (tokens[i].value == "index")) || 
                                                      (tokens[i].value == "to") ||
                                                      (tokens[i].value == "from") ) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();
        tmpStyle.fontSize = parseInt(tmpStyle.fontSize - tmpStyle.fontSize*.2);

        // el tamano de la tipografia no debe ser menor que 8
        if (tmpStyle.fontSize < 8) {
          tmpStyle.fontSize = 8;
        }

        newNode = new descartesJS.RTFNode(this.evaluator, "", tokens[i].value, tmpStyle);

        // se agrega el nuevo nodo al elemento anterior al tope, ya que el tope contiene el nuevo elemento a agregar
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // se coloca el valor del nuevo elemento como el tope del stack
        formulaStack[formulaStack.length-1] = newNode;
        
        continue;
      }
      
      // se especifica el numerador o el denominador de una fraccion
      else if ((tokens[i].type == "controlWord") && ((tokens[i].value == "num") || (tokens[i].value == "den"))) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();
        tmpStyle.fontSize = Math.round(tmpStyle.fontSize - tmpStyle.fontSize*.1);

        // el tamano de la tipografia no debe ser menor que 8
        if (tmpStyle.fontSize < 8) {
          tmpStyle.fontSize = 8;
        }

        if (tokens[i].value == "num") {
          newNode = new descartesJS.RTFNode(this.evaluator, "", "numerator", tmpStyle);
        }
        else if (tokens[i].value == "den") {
          newNode = new descartesJS.RTFNode(this.evaluator, "", "denominator", tmpStyle);
        }

        // se agrega el nuevo nodo al elemento anterior al tope, ya que el tope contiene el nuevo elemento a agregar
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // se coloca el valor del nuevo elemento como el tope del stack
        formulaStack[formulaStack.length-1] = newNode;
        
        continue;
      }
      
      // se especifica si el texto es un subindice o un superindice
      else if ((tokens[i].type == "controlWord") && ((tokens[i].value == "subix") || (tokens[i].value == "supix"))) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();
        tmpStyle.fontSize = Math.floor(tmpStyle.fontSize - tmpStyle.fontSize/3);
        
        // el tamano de la tipografia no debe ser menor que 8
        if (tmpStyle.fontSize < 8) {
          tmpStyle.fontSize = 8;
        }

        if (tokens[i].value == "subix") {
          newNode = new descartesJS.RTFNode(this.evaluator, "", "subIndex", tmpStyle);
        }
        else if (tokens[i].value == "supix") {
          newNode = new descartesJS.RTFNode(this.evaluator, "", "superIndex", tmpStyle);
        }
        
        newNode.originalStyle = formulaStack[formulaStack.length-2].style.clone();

        // se agrega el nuevo nodo al elemento anterior al tope, ya que el tope contiene el nuevo elemento a agregar
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // se coloca el valor del nuevo elemento como el tope del stack
        formulaStack[formulaStack.length-1] = newNode;
        
        continue;        
      }
      
      // se especifica un defparts, una matriz o un elemento
      else if ((tokens[i].type == "controlWord") && ( (tokens[i].value == "defparts") || (tokens[i].value == "matrix") || (tokens[i].value == "element") )) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

        newNode = new descartesJS.RTFNode(this.evaluator, "", tokens[i].value, tmpStyle);

        // se agrega el nuevo nodo al elemento anterior al tope, ya que el tope contiene el nuevo elemento a agregar
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // se coloca el valor del nuevo elemento como el tope del stack
        formulaStack[formulaStack.length-1] = newNode;
               
        if (tokens[i].value == "defparts") {
          lastPartsNode = newNode;
        }
        else if (tokens[i].value == "matrix") {
          lastMatrixNode = newNode;
        }

        continue;        
      }

      // se especifica el numero de renglones de una matriz
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "parts")) {
        setParts = true;
        continue;
      }
      
      // se le pasa el numero de renglones
      else if ((tokens[i].type == "text") && (setParts)) {
        lastPartsNode.parts = (parseInt(tokens[i].value));
        setParts = false;
        continue;
      }

      // se especifica el numero de renglones de una matriz
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "rows")) {
        setRows = true;
        continue;
      }
      
      // se le pasa el numero de renglones
      else if ((tokens[i].type == "text") && (setRows)) {
        lastMatrixNode.rows = (parseInt(tokens[i].value));
        setRows = false;
        continue;
      }
      
      // se especifica el numero de columnas de una matriz
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "columns")) {
        setColumns = true;
        continue;
      }
      
      // se le pasa el numero de renglones
      else if ((tokens[i].type == "text") && (setColumns)) {
        lastMatrixNode.columns = (parseInt(tokens[i].value));
        setColumns = false;
        continue;
      }
                
      // se especifica si es un texto dinamico
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "expr")) {
        stableWidth = false;
        dinamycText = true;
        continue;
      }
      
      // se especifica si el texto lleva decimales
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "decimals")) {
        setDecimals = true;
        continue;
      }
      
      // se le pasa el numero de decimales al texto
      else if ((tokens[i].type == "text") && (setDecimals)) {
        lastDynamicNode.decimals = this.evaluator.parser.parse(parseInt(tokens[i].value)+"");
        setDecimals = false;
        continue;
      }
      
      // se especifica si el texto tiene una representacion fija de decimales
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "fixed1")) {
        lastDynamicNode.fixed = true;
        continue;
      }
      // se especifica si el texto tiene una representacion fija de decimales
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "fixed0")) {
        lastDynamicNode.fixed = false;
        continue;
      }
      
      // un componente
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "component")) { }
      
      // componente del tipo control
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "NumCtrl")) {
        descartesComponentNumCtrl = true;
      }
      
      // componente del tipo espacio
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "Space")) {
        descartesComponentSpace = true;
      }

      // hipervinculos
      else if ((tokens[i].type == "controlWord") && (tokens[i].value == "hyperlink")) {
        descartesHyperLink = true;
      }

      // contenido del hipervinculo
      // falta por determinar como hacer los hipervinculos
      else if ((tokens[i].type == "text") && (descartesHyperLink)) {
        textContent = ((tokens[i].value).split("|"))[0];
        tmpStyle = styleStackTop.clone();
        tmpStyle.textUnderline = true;
        tmpStyle.textColor = "blue";

        newNode = new descartesJS.RTFNode(this.evaluator, textContent, "text", tmpStyle);
        
        if (lastNode.nodeType != "textLineBlock") {
          lastNode = lastNode.parent;
         
          while (lastNode.nodeType != "textLineBlock") {
            lastNode = lastNode.parent;
          }
        }
        
        lastNode.addChild(newNode);

        descartesHyperLink = false;
        continue;
      }

      // componente del tipo control
      else if ((tokens[i].type == "text") && (descartesComponentNumCtrl)) {
        newNode = new descartesJS.RTFNode(this.evaluator, tokens[i].value, "componentNumCtrl", styleStackTop.clone());

        lastNode.addChild(newNode);
        
        descartesComponentNumCtrl = false;
        continue;
      }

      // componente del tipo espacio
      else if ((tokens[i].type == "text") && (descartesComponentSpace)) {
        newNode = new descartesJS.RTFNode(this.evaluator, tokens[i].value, "componentSpace", styleStackTop.clone());

        lastNode.addChild(newNode);
        
        descartesComponentSpace = false;
        continue;
      }

      // se crea un nodo de texto dinamico
      else if ((tokens[i].type == "text") && (dinamycText)) {
        var tmpStyle = formulaStack[formulaStack.length-2].style.clone();

        // se le agrega "''+" para que se utilice lo que ya se tiene implementado para los decimales en el evaluador
        textContent = this.evaluator.parser.parse("''+(" + tokens[i].value + ")");

        newNode = new descartesJS.RTFNode(this.evaluator, textContent, "dynamicText", tmpStyle);

        // se agrega el nuevo nodo al elemento anterior al tope, ya que el tope contiene el nuevo elemento a agregar
        formulaStack[formulaStack.length-2].addChild(newNode);
        
        // se coloca el valor del nuevo elemento como el tope del stack
        formulaStack[formulaStack.length-1] = newNode;
        
        // se guarda una referencia al ultimo nodo dinamico para cambiar el numero de decimales que tiene asi como si su representacion es fija o no
        lastDynamicNode = newNode;
        
        dinamycText = false;
        continue;
      }
      
      // se crea un nodo de texto que no es parte de una formula
      else if ((tokens[i].type == "text") && (!dinamycText) && (!descartesFormula)) {
        textContent = tokens[i].value;

        newNode = new descartesJS.RTFNode(this.evaluator, textContent, "text", styleStackTop.clone());
        
        if (lastNode.nodeType != "textLineBlock") {
          lastNode = lastNode.parent;
         
          while (lastNode.nodeType != "textLineBlock") {
            lastNode = lastNode.parent;
          }
        }
        
        lastNode.addChild(newNode);
        continue;
      }

      // se crea un nodo de texto que es parte de una formula
      else if ((tokens[i].type == "text") && (!dinamycText) && (descartesFormula)) {
        textContent = tokens[i].value;

        newNode = new descartesJS.RTFNode(this.evaluator, textContent, "text", formulaStack[formulaStack.length-1].style.clone());
        
        // se agrega el nuevo nodo de texto al tope del stack de formulas
        formulaStack[formulaStack.length-1].addChild(newNode);
        
        continue;
      }
      
      // se crea un nodo para simbolos matematicos dentro de textos de formulas
      else if ( (tokens[i].type == "(") || (tokens[i].type == ")") ) {
        var tmpStyle = formulaStack[formulaStack.length-1].style.clone();
        tmpStyle.textItalic = "";
        
        newNode = new descartesJS.RTFNode(this.evaluator, tokens[i].type, "mathSymbol", tmpStyle);

        // se agrega el nuevo nodo de texto al tope del stack de formulas
        formulaStack[formulaStack.length-1].addChild(newNode);
        
        continue;
      }
      // se crea un nodo para simbolos matematicos dentro de textos de formulas
      else if ( (tokens[i].type == "+") || (tokens[i].type == "-") || 
                (tokens[i].type == "*") || (tokens[i].type == "=") ) {
        newNode = new descartesJS.RTFNode(this.evaluator, tokens[i].type, "mathSymbol", formulaStack[formulaStack.length-1].style.clone());

        // se agrega el nuevo nodo de texto al tope del stack de formulas
        formulaStack[formulaStack.length-1].addChild(newNode);
        
        continue;
      }
      
      // elementos desconocidos
      else {
//         console.log("Desconocido ", tokens[i]);
      }
    }

    if (lastNode != null) {
      var rootNode = lastNode.getRoot();
      rootNode.stableWidth = stableWidth;
      rootNode.getTextMetrics();
      
      rootNode.hasFormula = hasFormula;
      
      //console.log(rootNode);
    }
    
    return rootNode;
  }
  
  /**
   * 
   */
  descartesJS.FontStyle = function(fontSize, fontType, textItalic, textBold, textUnderline, textOverline, textColor) {
    this.fontSize = fontSize;
    this.fontType = fontType;
    this.textItalic = textItalic;
    this.textBold = textBold;
    this.textUnderline = textUnderline;
    this.textOverline = textOverline;
    this.textColor = textColor;
  }
  
  /**
   * 
   */
  descartesJS.FontStyle.prototype.toString = function() {
    return (this.textBold + " " + this.textItalic + " " + this.fontSize + "px " + this.fontType).trim();
  }
  
  /**
   * 
   */
  descartesJS.FontStyle.prototype.toCSS = function() {
    var cssRule = "style='font-family: " + this.fontType + "; font-size: " + this.fontSize + "px; ";

    if (this.textUnderline && !this.textOverline) {
      cssRule += "text-decoration: underline; ";
    }
    
    if (!this.textUnderline && this.textOverline) {
      cssRule += "text-decoration: overline; ";
    }
    
    if (this.textUnderline && this.textOverline) {
      cssRule += "text-decoration: underline overline; ";
    }
    
    if (this.textBold && !this.textItalic) {
      cssRule += "font-style: normal; font-weight: bold; ";
    }
    
    if (!this.textBold && this.textItalic) {
      cssRule += "font-style: italic; font-weight: normal; ";
    }

    if (this.textBold && this.textItalic) {
      cssRule += "font-style: italic; font-weight: bold; ";
    }
    
    if (!this.textBold && !this.textItalic) {
      cssRule += "font-style: normal; font-weight: normal; ";
    }
    
    if (this.textColor) {
      cssRule += "color: " + this.textColor + "; ";
    }

    return cssRule + "'";
  }

  /**
   * 
   */
  descartesJS.FontStyle.prototype.clone = function() {
    return new descartesJS.FontStyle(this.fontSize, this.fontType, this.textItalic, this.textBold, this.textUnderline, this.textOverline, this.textColor);
  }

  checkMathSymboslInFormula = function(tokens) {
//     console.log(tokens);
    var tokensResult = [];
    
    var inFormula = false;
    var ignoreText = false;
    var inExpression = false;
    var currentOpenBlock = [];
    
    for (var i=0, l=tokens.length; i<l; i++) {
      // si inicia un bloque se registra, para saber si se esta dentro de una formula o no
      if (tokens[i].type == "openBlock") {
        currentOpenBlock.push(tokens[i].value);
      }
      
      // si cierra un bloque se registra, para saber si se esta dentro de una formula o no
      if (tokens[i].type == "closeBlock") {
        currentOpenBlock.pop();
        
        if (currentOpenBlock.length <= 0) {
          inFormula = false;
        }
      }
      
      // los parentesis dentro de una expresion no deben cambiarse
      if ((tokens[i].type == "controlWord") && ((tokens[i].value == "expr") || (tokens[i].value == "decimals"))) {
        ignoreText = true;
      }
      
      // si se esta en una formula se registra, para verificar los textos dentro de ella
      if ((tokens[i].type == "controlWord") && (tokens[i].value == "mjaformula")){
        inFormula = true
      }
      
      // si el token es un texto y estamos dentro de una formula y el texto no es una expresion entonces hay que buscar parentesis
      if ((tokens[i].type == "text") && (inFormula) && (!ignoreText)) {
        var lastIndex = 0;
        var value = tokens[i].value;
        var newValue = "";
        
        // se recorre la cadena para buscar los parentesis y generar tokens adecuados
        for (var j=0, k=value.length; j<k; j++) {
          // parentesis que cierra, parentesis que cierra, signo mas
          if ( (value.charAt(j) == "(") || (value.charAt(j) == ")") || 
               (value.charAt(j) == "+") || (value.charAt(j) == "-") || 
               (value.charAt(j) == "*") || (value.charAt(j) == "=") 
             ) {
            newValue = value.substring(lastIndex, j);
            if (newValue != "") {
              tokensResult.push( {type: "text", value: newValue} );
            }
            tokensResult.push( {type: value.charAt(j), value: value.charAt(j)} );
            lastIndex = j+1;
          }


        }

        // si se termino el recorrido se agrega el resto de la cadena
        newValue = value.substring(lastIndex, j);
        if (newValue != "") {
          tokensResult.push( {type: "text", value: newValue} );
        }
      }
      // los demas nodos
      else {
        tokensResult.push(tokens[i]);
        if ((tokens[i].type == "text") && (ignoreText)) {
          ignoreText = false;
        }
      }
    }
    
//     console.log(tokensResult);
    return tokensResult;
  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  
  /**
   * Un espacio de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la aplicacion de descartes
   */
  descartesJS.Space = function(parent, values) {
    /**
     * La aplicacion de descartes a la que corresponde el espacio
     * type DescartesApp
     * @private
     */
    this.parent = parent;
    
    /**
     * Objeto para el parseo y evaluacion de expresiones
     * type {Evaluator}
     * @private
     */
    this.evaluator = this.parent.evaluator;

    var evaluator = this.evaluator;
    var parser = evaluator.parser;
    
    /**
     * Los valores iniciales del espacio
     * type DescartesApp
     * @private
     */
    this.values = values;
    
    /**
     * El tipo del espacio
     * type String
     * @private
     */
    this.type = "R2";

    /**
     * El identificador del espacio
     * type String
     * @private
     */
//     this.id = (this.parent.version != 2) ? "" : "descartes2_space";

    /**
     * La posicion en x del espacio
     * type Number
     * @private
     */
    this.xExpr = parser.parse("0");

    /**
     * La posicion en y del espacio
     * type Number
     * @private
     */
    this.yExpr = parser.parse("0");
    
    /**
     * El ancho del espacio
     * type Number
     * @private
     */
    this.w = parseInt(parent.container.width);

    /**
     * El alto del espacio
     * type Number
     * @private
     */
    this.h = parseInt(parent.container.height);
    
    /**
     * La condicion de dibujado del espacio
     * type Boolean
     * @private
     */
    this.drawif = parser.parse("1");

    /**
     * La condicion para determinar si el espacio esta fijo
     * type Boolean
     * @private
     */
    this.fixed = (this.parent.version != 2) ? false : true;

    /**
     * La escala del espacio
     * type Number
     * @private
     */
    this.scale = 48;
    
    /**
     * El desplazamiento en x del origen del espacio
     * type Number
     * @private
     */
    this.Ox = 0;

    /**
     * El desplazamiento en y del origen del espacio
     * type Number
     * @private
     */
    this.Oy = 0;
    
    /**
     * La imagen de fondo del espacio
     * type Image
     * @private
     */
    this.image = new Image();
    this.image.onload = function() {
      this.ready = 1;
    }
    /**
     * El nombre del archivo de la imagen de fondo del espacio
     * type String
     * @private
     */
    this.imageSrc = "";
    
    /**
     * Como se acomoda la imagen de fondo del espacio
     * type String
     * @private
     */
    this.bg_display = "topleft";
    
    /**
     * El color de fondo del espacio
     * type String
     * @private
     */
    if ( (this.parent.code == "descinst.com.mja.descartes.DescartesJS.class") || (this.parent.arquimedes) ) {
      this.background = "#f0f8fa";
    }
    else {
      this.background = "#ffffff";
    }
    
    /**
     * La condicion y el color para dibujar la red del espacio
     * type String
     * @private
     */
    this.net = (this.parent.version != 2) ? "#c0c0c0" : "";

    /**
     * La condicion y color para dibujar la red10 del espacio
     * type String
     * @private
     */
    this.net10 = (this.parent.version != 2) ? "#808080" : "";

    /**
     * La condicion y el color para dibujar los ejes del espacio
     * type String
     * @private
     */
    // ## parche para descartes 2 ## //
    this.axes = (this.parent.version != 2) ? "#808080" : "";

    /**
     * La condicion y el color del texto de las coordenadas del espacio
     * type String
     * @private
     */
    this.text = "#ffafaf";

    /**
     * La condicion para dibujar los numeros del espacio
     * type Boolean
     * @private
     */
    this.numbers = false;

    /**
     * El texto del eje x del espacio
     * type String
     * @private
     */
    this.x_axis = (this.parent.version != 2) ? "" : " ";

    /**
     * El texto del eje y del espacio
     * type String
     * @private
     */
    this.y_axis = (this.parent.version != 2) ? "" : " ";

    /**
     * La condicion para que el espacio sea sensible a los movimientos del mouse
     * type Boolean
     * @private
     */
    this.sensitive_to_mouse_movements = false;
    
    /**
     * La cID del espacio
     * type String
     * @private
     */    
    this.cID = ""

    /**
     * La posicion en x del mouse sobre el espacio
     * type Number
     * @private
     */
    this.mouse_x = 0;

    /**
     * La posicion en y del mouse sobre el espacio
     * type Number
     * @private
     */
    this.mouse_y = 0;
    
    /**
     * Los controles contenidos en el espacio
     * type [Controls]
     * @private
     */
    this.ctrs = [];
    
    /**
     * Las graficas contenidas en el espacio
     * type [Graphics]
     * @private
     */
    this.graphics = [];
    
    /**
     * Indice z de los elementos
     * @type {number}
     * @private 
     */
    this.zIndex = parent.zIndex;

    this.plecaHeight = this.parent.plecaHeight || 0;
    this.displaceRegionNorth = this.parent.displaceRegionNorth || 0;
    this.displaceRegionWest = this.parent.displaceRegionWest || 0;
    
    // se recorre values para reemplazar los valores iniciales del espacio
    for (var propName in values) {
      // solo se verifican las propiedades propias del objeto values
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }
    
    this.init();
  }
  
  /**
   * 
   */
  descartesJS.Space.prototype.init = function() {
    this.displaceRegionNorth = this.parent.displaceRegionNorth || 0;
    this.displaceRegionWest = this.parent.displaceRegionWest || 0;

    var parent = this.parent;
    var evaluator = this.evaluator;
    var thisID = this.id;
    var newH;
    var newW;
    var parentH = parseInt(this.parent.container.height);
    var parentW = parseInt(this.parent.container.width);
    
    // se obtienen los anchos preliminares para calcular la posible posicion en x y y
    evaluator.setVariable(thisID + "._w", this.w);
    evaluator.setVariable(thisID + "._h", this.h);
    
    // se encuentra la posicion en x y y del espacio
    this.x = evaluator.evalExpression(this.xExpr) + this.displaceRegionWest;
    this.y = evaluator.evalExpression(this.yExpr) + this.plecaHeight + this.displaceRegionNorth;

    // si ya fue creado el contenedor entonces se modifica su posicion en x y y, cuando hay regiones involucradas
    if (this.container) {
      this.container.style.left = this.x + "px";
      this.container.style.top = this.y + "px";
    }
    
    // se ignora el cambio en el tamano de los espacios
    if ((!this.parent.hackChafaParaQueFuncionenLasEscenasDeArquimedes) || (this.id == "_BASE_")) {
      if (this.y >=0) {
        newH = parentH - this.y;
        if (this.h > newH) {
          this.h = newH;
        }
      } else {
        newH = this.h + this.y;
        if (newH >= parentH) {
          this.h = parentH;
        } else {
          this.h = newH;
        }
      }

      if (this.x >=0) {
        newW = parentW - this.x;
        if (this.w > newW) {
          this.w = newW;
        }
      } else {
        newW = this.w + this.x;
        if (newW >= parentW) {
          this.w = parentW;
        } else {
          this.w = newW;
        }
      }
    }

    // si el espacio tiene una imagen de fondo entonces se pide la imagen al arreglo de imagenes del padre
    if ((this.imageSrc != "") || (!(this.imageSrc.toLowerCase().match(/vacio.gif$/)))) {
      this.image = parent.getImage(this.imageSrc);
    }

    // Ox
    // si esta especificado con un porcentaje
    if (this.OxExpr) {
      var OxExpr = this.OxExpr;
      if (OxExpr[OxExpr.length-1] == "%") {
        this.Ox = this.w*parseFloat(OxExpr)/100;
      } 
      // si no esta especificado con un porcentaje
      else {
        var temp = parseFloat(OxExpr);
        
        // si al convertir el valor a un numero los valores son diferentes
        if (temp != OxExpr) {
          temp = 0;
        }
        this.Ox = temp;
      }
    }
    
    // Oy
    // si esta especificado con un porcentaje
    if (this.OyExpr) {
      var OyExpr = this.OyExpr;
      if (OyExpr[OyExpr.length-1] == "%") {
        this.Oy = this.h*parseFloat(OyExpr)/100;
      } 
      // si no esta especificado con un porcentaje
      else {
        var temp = parseFloat(OyExpr);
        
        // si al convertir el valor a un numero los valores son diferentes
        if (temp != OyExpr) {
          temp = 0;
        }
        this.Oy = temp;
      }
    }

    // se registran las variables del espacio
    // ## parche para descartes 2 ## //
    if (this.parent.version != 2) {
      evaluator.setVariable(thisID + "._w", this.w);
      evaluator.setVariable(thisID + "._h", this.h);
      evaluator.setVariable(thisID + ".escala", this.scale);
      evaluator.setVariable(thisID + ".Ox", this.Ox);
      evaluator.setVariable(thisID + ".Oy", this.Oy);
      evaluator.setVariable(thisID + ".mouse_x", 0);
      evaluator.setVariable(thisID + ".mouse_y", 0);
      evaluator.setVariable(thisID + ".mouse_pressed", 0);
    }
    else {
      var tmp = this.evaluator.getVariable("_w");
      if (tmp == undefined) { tmp = this.w; };
      evaluator.setVariable("_w", tmp);

      tmp = this.evaluator.getVariable("_h");
      if (tmp == undefined) { tmp = this.h; };
      evaluator.setVariable("_h", tmp);

      tmp = this.evaluator.getVariable("escala");
      if (tmp == undefined) { tmp = this.w; };
      evaluator.setVariable("escala", tmp);

      tmp = this.evaluator.getVariable("Ox");
      if (tmp == undefined) { tmp = this.Ox; };
      evaluator.setVariable("Ox", tmp);

      tmp = this.evaluator.getVariable("Oy");
      if (tmp == undefined) { tmp = this.Oy; };
      evaluator.setVariable("Oy", tmp);
      
      evaluator.setVariable("mouse_x", 0);
      evaluator.setVariable("mouse_y", 0);
      evaluator.setVariable("mouse_pressed", 0);

      if ((this.x_axis == "") && (this.y_axis == "")) {
        this.axes = "";
      }
    }
  }
  
  /**
   * Agrega un control a la lista de controles del espacio
   * @param {Controls} ctr es el control que se quiere agregar
   */
  descartesJS.Space.prototype.addCtr = function(ctr) {
    this.ctrs.push(ctr);
  }
  
  /**
   * Agrega una grafica a la lista de graficas del espacio
   * @param {Graphics} gra es la grafica que se quiere agregar
   */
  descartesJS.Space.prototype.addGraph = function(gra) {
    this.graphics.push(gra);
  }

  /**
   * Se obtiene la posicion relativa con respecto al eje X de un punto
   * @param {Number} x es la posicion del punto
   * @return {Number} la posicion relativa con respecto al eje X de un punto
   */
  descartesJS.Space.prototype.getRelativeX = function(x) {
    return (x - MathFloor(this.w/2+this.Ox))/this.scale;
  }

  /**
   * Se obtiene la posicion relativa con respecto al eje Y de un punto
   * @param {Number} y es la posicion del punto
   * @return {Number} la posicion relativa con respecto al eje Y de un punto
   */
  descartesJS.Space.prototype.getRelativeY = function(y) {
    return (-y + MathFloor(this.h/2+this.Oy))/this.scale;
  }
  
  /**
   * Se obtiene la posicion absoluta con respecto al eje X de un punto
   * @param {Number} x es la posicion del punto
   * @return {Number} la posicion absoluta con respecto al eje X de un punto
   */
  descartesJS.Space.prototype.getAbsoluteX = function(x) {
    return (x*this.scale + MathFloor(this.w/2+this.Ox));
  }

  /**
   * Se obtiene la posicion absoluta con respecto al eje Y de un punto
   * @param {Number} y es la posicion del punto
   * @return {Number} la posicion absoluta con respecto al eje Y de un punto
   */
  descartesJS.Space.prototype.getAbsoluteY = function(y) {
    return (-y*this.scale + MathFloor(this.h/2+this.Oy));
  }

  /**
   * Se encuentra el offset de la posicion del espacio
   */
  descartesJS.Space.prototype.findOffset = function() {
    var tmpContainer = this.container;
    var containerClass;
    this.offsetLeft = 0;
    this.offsetTop = 0;

    while (tmpContainer) {
      containerClass = null;
      
      if (tmpContainer.getAttribute) {
        containerClass = tmpContainer.getAttribute("class");
      }

      if ( (containerClass) && ((containerClass == "DescartesSpace2DContainer") || (containerClass == "DescartesAppContainer")) ) {
        this.offsetLeft += tmpContainer.offsetLeft;
        this.offsetTop  += tmpContainer.offsetTop;
      }
      
      tmpContainer = tmpContainer.parentNode;
    }
  }

  /**
   * Se obtiene la posicion del mouse en coordenadas absolutas respecto al espacio donde se encuentra
   * @param {Event} evt evento que contiene la posicion del mouse
   * @return {Posicion} la posicion del mouse en coordenadas absolutas respecto al espacio donde se encuentra
   */
  descartesJS.Space.prototype.getCursorPosition = function(evt) {
    var pos = descartesJS.getCursorPosition(evt);

    return { x: pos.x - this.offsetLeft, y: pos.y - this.offsetTop };
  }
  
  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathRound = Math.round;
  var PI2 = Math.PI*2;
  
  /**
   * Un espacio de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la aplicacion de descartes
   */
  descartesJS.Space2D = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Space.call(this, parent, values);

    // se crean los elementos graficos
    this.backgroundCanvas = document.createElement("canvas");
    this.backgroundCanvas.setAttribute("id", this.id + "_background");
    this.backgroundCanvas.setAttribute("width", this.w + "px");
    this.backgroundCanvas.setAttribute("height", this.h + "px");
    this.backgroundCtx = this.backgroundCanvas.getContext("2d");

    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", this.id + "_canvas");
    this.canvas.setAttribute("width", this.w + "px");
    this.canvas.setAttribute("height", this.h + "px");
    this.canvas.setAttribute("class", "DescartesSpace2DCanvas");
    this.canvas.setAttribute("style", "z-index: " + this.zIndex + ";");
    this.ctx = this.canvas.getContext("2d");

    // se crean contenedores para los controles graficos y los numericos
    this.graphicControlContainer = document.createElement("div");
    this.graphicControlContainer.setAttribute("id", this.id + "_graphicControls");
//    this.graphicControlContainer.setAttribute("style", "width: " +this.w+ "px; height:" +this.h+ "px; position: absolute; overflow: hidden; left: 0px; top: 0px; z-index: " + this.zIndex + ";");
    this.graphicControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + this.zIndex + ";");
//     this.graphicControlContainer.style.cssText = "position: absolute; left: 0px; top: 0px; z-index: " + this.zIndex + ";");
    
    this.numericalControlContainer = document.createElement("div");
    this.numericalControlContainer.setAttribute("id", this.id + "_numericalControls");
//    this.numericalControlContainer.setAttribute("style", "width: " +this.w+ "px; height:" +this.h+ "px; position: absolute; overflow: hidden; left: 0px; top: 0px; z-index: " + this.zIndex + ";");
    this.numericalControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + this.zIndex + ";");

    // se crea el contenedor principal
    this.container = document.createElement("div");
    this.container.setAttribute("id", this.id);
    this.container.setAttribute("class", "DescartesSpace2DContainer");
    this.container.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");

    // ### ARQUIMEDES ###
    if ((this.parent.arquimedes) && (descartesJS.getColor(this.evaluator, this.background) === "#f0f8fa")) {
      this.container.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + "; border: 1px solid #b8c4c8;");
    }
    // ### ARQUIMEDES ###

    // se agregan los elementos al DOM
    this.container.appendChild(this.backgroundCanvas);
    this.container.appendChild(this.canvas);
    this.container.appendChild(this.graphicControlContainer);
    this.container.appendChild(this.numericalControlContainer);
    
    parent.container.insertBefore(this.container, parent.loader);

    // encuentra el offset del contenedor para el calculo de la posicion del mouse
    this.findOffset();

    // soporte para generar una imagen del contenido del espacio
    this.parent.images[this.id + ".image"] = this.canvas;
    this.parent.images[this.id + ".image"].ready = 1;
    this.parent.images[this.id + ".image"].complete = true;
    this.evaluator.setVariable(this.id + ".image", this.id + ".image");

    // soporte para generar una imagen del contenido del fondo del espacio
    this.parent.images[this.id + ".back"] = this.backgroundCanvas;
    this.parent.images[this.id + ".back"].ready = 1;
    this.parent.images[this.id + ".back"].complete = true;
    this.evaluator.setVariable(this.id + ".back", this.id + ".back");

    this.drawBefore = (this.evaluator.evalExpression(this.drawif) > 0);
    
    // se registran los eventos del mouse, cuando se de soporte a dispositivos moviles se deben de registrar los eventos correspondientes
    if (this.id !== "descartesJS_scenario") {
      this.registerMouseEvents();
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Space2D, descartesJS.Space);

  var thisGraphics_i;
  /**
   * Actualiza los valores del espacio
   * @param [Boolean] firstTime variable que indica si se esta actualizando por primera vez
   */
  descartesJS.Space2D.prototype.update = function(firstTime) {
    // ## parche para descartes 2 ## //
    var OxString = (this.parent.version != 2) ? this.id + ".Ox" : "Ox";
    var OyString = (this.parent.version != 2) ? this.id + ".Oy" : "Oy";
    var escalaString = (this.parent.version != 2) ? this.id + ".escala" : "escala";

    var evaluator = this.evaluator;
    
    // se garantiza que el ancho y el alto no sean modificados desde una variable externa
    evaluator.setVariable(this.id + "._w", this.w);
    evaluator.setVariable(this.id + "._h", this.h);

    var changeX = (this.x != evaluator.evalExpression(this.xExpr) + this.displaceRegionWest);
    var changeY = (this.y != evaluator.evalExpression(this.yExpr) + this.parent.plecaHeight  + this.displaceRegionNorth);
    // se checa si el espacio ha cambiado, es decir que cambio su posicion en x o y, que cambio la posicion de su origen o su escala
    this.spaceChange = firstTime || 
                       changeX || changeY ||
                       (this.drawBefore != (evaluator.evalExpression(this.drawif) > 0)) ||
                       (this.Ox != evaluator.getVariable(OxString)) ||
                       (this.Oy != evaluator.getVariable(OyString)) ||
                       (this.scale != evaluator.getVariable(escalaString));

    this.x = (changeX) ? evaluator.evalExpression(this.xExpr) + this.displaceRegionWest: this.x;
    this.y = (changeY) ? evaluator.evalExpression(this.yExpr) + this.parent.plecaHeight  + this.displaceRegionNorth : this.y;
    this.Ox = evaluator.getVariable(OxString);
    this.Oy = evaluator.getVariable(OyString);
    this.scale = evaluator.getVariable(escalaString);
    this.drawBefore = (evaluator.evalExpression(this.drawif) > 0);

    // se verifica que la escala no sobrepase el limite inferior
    if (this.scale < 0.000001) {
      this.scale = 0.000001;
      evaluator.setVariable(escalaString, 0);
    } 
    // se verifica que la escala no sobrepase el limite superiro    
    else if (this.scale > 1000000) {
      this.scale = 1000000;
      evaluator.setVariable(escalaString, 1000000);
    }
    
    // si cambio alguna propiedad del espacio entonces cambiamos las propiedades del contenedor
    if (changeX) {
      this.container.style.left = this.x + "px";
    }
    if (changeY) {
      this.container.style.top = this.y + "px";
    }
    if ((changeX) || (changeY)) {
      this.findOffset();
    }

    // si hay que dibujar entonces se dibuja
    if ( evaluator.evalExpression(this.drawif) > 0 ) {
      this.container.style.display = "block";
      
      // se dibujan los rastros de las graficas
      for(var i=0, l=this.graphics.length; i<l; i++) {
        thisGraphics_i = this.graphics[i];

        // si las graficas tiene rastro, el espacio no ha cambiado, no se ha presionado el mouse y las graficas no perteneces al fondo, hay que dibujar los graficos
        if ( (thisGraphics_i.trace != "") && (!this.spaceChange) && (!this.click) && (!thisGraphics_i.background) ) {
          thisGraphics_i.drawTrace();
        }
      }

      this.drawBackground();
      this.draw();
    } else {
      this.container.style.display = "none";
    }
    
  }

  /**
   * Dibuja el fondo del espacio
   */
  descartesJS.Space2D.prototype.drawBackground = function() {
    if (this.spaceChange) {
      var evaluator = this.evaluator;
      var ctx = this.backgroundCtx;

      // se dibuja el color del fondo
      ctx.clearRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
      ctx.fillStyle = descartesJS.getColor(evaluator, this.background);
      ctx.fillRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);

      // se dibuja la imagen, si es que tiene
      if ( (this.image) && (this.image.src != "") && (this.image.ready) && (this.image.complete) ) {
        if (this.bg_display == "topleft") {
          ctx.drawImage(this.image, 0, 0);
        } 
        else if (this.bg_display == "stretch") {
          ctx.drawImage(this.image, 0, 0, this.w, this.h);
        } 
        else if (this.bg_display == "patch") {
          ctx.fillStyle = ctx.createPattern(this.image, "repeat");
          ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        else if (this.bg_display == "center") {
          ctx.drawImage(this.image, (this.w-this.image.width)/2, (this.h-this.image.height)/2);
        }
      }
      
      var rsc = this.scale;
      var dec = 0;
      var wh_temp = ((this.w+this.h) < 0) ? 0 : (this.w+this.h);
      while (rsc>(wh_temp)) {
        rsc/=10; dec++; 
      }
      while (rsc<(wh_temp)/10) { 
        rsc*=10;
      }

      ctx.lineWidth = 1;

      //se dibuja la red grande
      if (this.net != "") {
        ctx.strokeStyle = descartesJS.getColor(evaluator, this.net);
        this.drawMarks(ctx, rsc/10, -1);
      }
      
      //se dibuja la red mas fina
      if ( ((this.parent.version != 2) && (this.net10 != "")) || 
           ((this.parent.version == 2) && (this.net != "") && (this.net10 != ""))
         ) {
        ctx.strokeStyle = descartesJS.getColor(evaluator, this.net10);
        this.drawMarks(ctx, rsc, -1);
      }
      
      //se dibujan los ejes
      if (this.axes != "") {
        ctx.strokeStyle = descartesJS.getColor(evaluator, this.axes);
        
        ctx.beginPath();
        // el eje X
        if ((this.x_axis != "") || (this.parent.version != 2)) {
          ctx.moveTo(0, MathFloor(this.h/2+this.Oy)+.5);
          ctx.lineTo(this.w, MathFloor(this.h/2+this.Oy)+.5);
        }

        // el eje Y
        if ((this.y_axis != "") || (this.parent.version != 2)) {
          ctx.moveTo(MathFloor(this.w/2+this.Ox)+.5, 0);
          ctx.lineTo(MathFloor(this.w/2+this.Ox)+.5, this.h);
        }
        
        ctx.stroke();
        
        this.drawMarks(ctx, rsc, 4);
        this.drawMarks(ctx, rsc/2, 2);
        this.drawMarks(ctx, (rsc/2)/5, 1);
      }
      
      //se dibuja el nombre de los ejes
      if ((this.x_axis != "") || (this.y_axis != "")) {
        ctx.fillStyle = descartesJS.getColor(evaluator, this.axes);
        ctx.font = "12px Arial";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillText(this.x_axis, MathFloor(this.w)-2, MathFloor(this.h/2+this.Oy));
        ctx.fillText(this.y_axis, MathFloor(this.w/2+this.Ox)-2, 0); 
      }
      
      //se dibujan los numeros en los ejes
      if ((this.numbers) && (this.axes != "")) {
        ctx.fillStyle = descartesJS.getColor(evaluator, this.axes);
        ctx.font = "12px Arial";
        ctx.textAlign = "start";
        ctx.textBaseline = "bottom";

        if (rsc>(this.w+this.h)/2) {
          this.drawNumbers(ctx, rsc/5, (rsc<=this.scale)?dec+1:dec);
        } 
        
        else if (rsc>(this.w+this.h)/4) {
          this.drawNumbers(ctx, rsc/2, (rsc<=this.scale)?dec+1:dec);
        } 
        
        else {
          this.drawNumbers(ctx, rsc, dec);
        }
      }
            
      //se dibujan solo las graficas del fondo
      for(var i=0, l=this.graphics.length; i<l; i++) {
        var thisGraphics_i = this.graphics[i];
        if (thisGraphics_i.background) {
          thisGraphics_i.draw();
        }
      }
      
    }
  }

  /**
   * Se dibuja el espacio y todo lo que contiene
   */
  descartesJS.Space2D.prototype.draw = function() {
    var ctx = this.ctx;
    var thisGraphics_i;
    var thisCtrs_i;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    //se dibujan las graficas que no son del fondo
    for(var i=0, l=this.graphics.length; i<l; i++) {
      thisGraphics_i = this.graphics[i];

      if (!thisGraphics_i.background) {
        thisGraphics_i.draw();
      }
    }

    //se dibujan los controles graficos
    for (var i=0, l=this.ctrs.length; i<l; i++) {
      thisCtrs_i = this.ctrs[i];
      if (thisCtrs_i.type == "graphic") {
        thisCtrs_i.draw();
      }
    }
        
    //se dibuja el texto mostrando la posicion del mouse
    if ((this.text != "") && (this.click) && (this.whichButton == "LEFT")) {
      ctx.fillStyle = descartesJS.getColor(this.evaluator, this.text);
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 1;
      ctx.font = "12px Courier New";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";

      var coordTxt_X = (this.scale <= 1) ? ((this.mouse_x).toFixed(0)) : (this.mouse_x).toFixed((this.scale).toString().length);
      var coordTxt_Y = (this.scale <= 1) ? ((this.mouse_y).toFixed(0)) : (this.mouse_y).toFixed((this.scale).toString().length);
      var coordTxt = "(" + coordTxt_X + "," + coordTxt_Y + ")";
      var coordTxtW = ctx.measureText(coordTxt).width;
      var mouseX = this.getAbsoluteX(this.mouse_x);
      var mouseY = this.getAbsoluteY(this.mouse_y);
      var posX = MathFloor(mouseX);
      var posY = MathFloor(mouseY-10);

      // evitar que la posicion del texto del mouse se salga del espacio
      if ((posX+coordTxtW/2) > this.w) {
        posX = this.w-coordTxtW/2;
      } 
      else if ((posX-coordTxtW/2) < 0) {
        posX = coordTxtW/2;
      }
      if ((posY+1) > this.h) {
        posY = this.h;
      } 
      else if ((posY-14) < 0) { // 14 el alto del texto (12px + 2)
        posY = 15;
      }

      ctx.fillText(coordTxt, posX, posY);

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 2.5, 0, PI2, true);
      ctx.stroke();
    }
  }
  
  /**
   * Se dibujan las marcas de los ejes del espacio
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja
   * @param {Number} rsc
   * @param {Number} sz
   */
  descartesJS.Space2D.prototype.drawMarks = function(ctx, rsc, sz) {
    var w = this.w;
    var h = this.h;
    var x, y;
    
    var x1 = 0;
    var x2 = w;
    var y1 = 0;
    var y2 = h;
    var Ox = MathFloor(w/2+this.Ox);
    var Oy = MathFloor(h/2+this.Oy);
    
    if (sz >= 0) {
      x1 = Ox-sz;
      x2 = Ox+sz;
      y1 = Oy-sz;
      y2 = Oy+sz;
    }
        
    ctx.beginPath();
    for (var i=-MathRound(Ox/rsc); (x = Ox + MathRound(i*rsc)) < w; i++) {
      ctx.moveTo(x+.5, y1+.5);
      ctx.lineTo(x+.5, y2+.5);
    }
    for (var i=-MathRound(Oy/rsc); (y = Oy + MathRound(i*rsc)) < h; i++) {
      ctx.moveTo(x1+.5, y+.5);
      ctx.lineTo(x2+.5, y+.5);
    }
    ctx.stroke();

  }
    
  /**
   * Se dibujan los numeros de los ejes del espacio
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja
   * @param {Number} rsc
   * @param {Number} dec
   */
  descartesJS.Space2D.prototype.drawNumbers = function(ctx, rsc, dec) {
    var w = this.w;
    var h = this.h;
    var x, y;
    
    var Ox = MathFloor(w/2+this.Ox);
    var Oy = MathFloor(h/2+this.Oy);
    
    for (var i=-MathRound(Ox/rsc); (x = Ox + MathRound(i*rsc)) < w; i++) {
      ctx.fillText(parseFloat( (i*rsc/this.scale).toFixed(4) ), x+2, Oy-2);
    }
    
    for (var i=-MathRound(Oy/rsc); (y = Oy + MathRound(i*rsc)) < h; i++) {
      ctx.fillText(parseFloat( (-i*rsc/this.scale).toFixed(4) ), Ox+2, y-2);
    }
  }
  
  /**
   * Se registran los eventos del mouse del espacio
   */
  descartesJS.Space2D.prototype.registerMouseEvents = function() {
    // se crea una variable con el valor del objeto (Space2D) para que el ambiente de las funciones pueda utilizarlo
    var self = this;
    var hasTouchSupport = descartesJS.hasTouchSupport;

    // bloqueo del menu contextual
    this.canvas.oncontextmenu = function () { return false; };

    ///////////////////////////////////////////////////////////////////////////
    // Registro de eventos de touch (iOS, android)
    ///////////////////////////////////////////////////////////////////////////
    if (hasTouchSupport) {
      if (this.sensitive_to_mouse_movements) {
        this.canvas.addEventListener("touchmove",  onSensitiveToMouseMovements, false);
      }
      this.canvas.addEventListener("touchstart", onTouchStart, false);
    }

    /**
     * @param {Event} evt el evento lanzado por la accion de iniciar un touch
     * @private
     */
    function onTouchStart(evt) {
      self.click = 1;
      self.parent.evaluator.setVariable(self.id + ".mouse_pressed", 1);

      // se desactivan los controles graficos
      self.parent.deactivateGraphiControls();

      onSensitiveToMouseMovements(evt);
      
//      self.parent.update();

      window.addEventListener("touchmove", onMouseMove, false);
      window.addEventListener("touchend", onTouchEnd, false);

      // intenta mantener el gesto de deslizar en las tablets      
      if ((!self.fixed) || (self.sensitive_to_mouse_movements)) {
        evt.preventDefault();
      }
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de finalizar un touch
     * @private
     */
    function onTouchEnd(evt) {
      self.click = 0;
      self.parent.evaluator.setVariable(self.id + ".mouse_pressed", 0);

      window.removeEventListener("touchmove", onMouseMove, false);
      window.removeEventListener("touchend", onTouchEnd, false);

      // self.parent.update();

      evt.preventDefault();

      self.parent.update();      
    }
  
    ///////////////////////////////////////////////////////////////////////////
    // Registro de eventos de mouse
    ///////////////////////////////////////////////////////////////////////////
    if (!hasTouchSupport) {
      if (this.sensitive_to_mouse_movements) {
        this.canvas.addEventListener("mousemove", onSensitiveToMouseMovements, false);
      }
      this.canvas.addEventListener("mousedown", onMouseDown, false);
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de presionar un boton
     * @private
     */
    function onMouseDown(evt) {
      self.click = 1;
      self.parent.evaluator.setVariable(self.id + ".mouse_pressed", 1);
      
      // se desactivan los controles graficos
      self.parent.deactivateGraphiControls();

      // ie
      if (evt.which == null) {
        self.whichButton = (evt.button < 2) ? "LEFT" : ((evt.button == 4) ? "MIDDLE" : "RIGHT");
      } 
      // los demas
      else {
        self.whichButton = (evt.which < 2) ? "LEFT" : ((evt.which == 2) ? "MIDDLE" : "RIGHT");
      }
      
      // se bloquea la aparicion del menu contextual y si el espacio no esta fijo se asigna un manejador para el zoom
      if (self.whichButton == "RIGHT") {
//        window.oncontextmenu = function () { return false; };
        window.addEventListener("mouseup", onMouseUp, false);
        

        if (!self.fixed) {
          self.clickPosForZoom = (self.getCursorPosition(evt)).y;
          self.tempScale = self.scale;
          window.addEventListener("mousemove", onMouseMoveZoom, false);
        }
      }
      
      if (self.whichButton == "LEFT") {
        self.parent.evaluator.setVariable(self.id + ".mouse_pressed", 1);
        
        onSensitiveToMouseMovements(evt);

        window.addEventListener("mousemove", onMouseMove, false);
        window.addEventListener("mouseup", onMouseUp, false);
      }
      
      evt.preventDefault();
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de soltar un boton
     * @private
     */
    function onMouseUp(evt) {
      self.click = 0;
      self.parent.evaluator.setVariable(self.id + ".mouse_pressed", 0);
      evt.preventDefault();

      // se desbloquea la aparicion del menu contextual
      if (self.whichButton == "RIGHT") {
        window.removeEventListener("mousemove", onMouseMoveZoom, false);
//	    window.oncontextmenu = "";
      }

      if (!self.sensitive_to_mouse_movements) {
        window.removeEventListener("mousemove", onMouseMove, false);
      }
      window.removeEventListener("mouseup", onMouseUp, false);

//       if (self.whichButton == "LEFT") {
//         window.removeEventListener("mousemove", onMouseMove, false);
//       }      
      
      // self.parent.update();
      
      self.parent.update();
    }
    
    /**
     * 
     */
    function onSensitiveToMouseMovements(evt) {
      self.posAnte = self.getCursorPosition(evt);
      self.mouse_x = self.getRelativeX(self.posAnte.x);
      self.mouse_y = self.getRelativeY(self.posAnte.y);
      self.parent.evaluator.setVariable(self.id + ".mouse_x", self.mouse_x);
      self.parent.evaluator.setVariable(self.id + ".mouse_y", self.mouse_y);
      
      self.parent.update();
    }
    
    /**
     * @param {Event} evt el evento lanzado por la acción de mover el mouse con el boton derecho presionado
     * @private
     */
    function onMouseMoveZoom(evt) {
      self.clickPosForZoomNew = (self.getCursorPosition(evt)).y;

      // ## parche para descartes 2 ## //
      var escalaString = (self.parent.version != 2) ? self.id + ".escala" : "escala";

      self.evaluator.setVariable(escalaString, self.tempScale + (self.tempScale/45)*((self.clickPosForZoom-self.clickPosForZoomNew)/10));
      
      self.parent.update();
      
      evt.preventDefault();
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de mover el mouse
     * @private
     */
    function onMouseMove(evt) {
      // si el espacio no esta fijo entonces se modifica la posicion del origen
      if (!self.fixed) {
        self.posNext = self.getCursorPosition(evt);
        var disp = { x:MathFloor(self.posAnte.x-self.posNext.x), 
                     y:MathFloor(self.posAnte.y-self.posNext.y) };
                    
        // ## parche para descartes 2 ## //
        var OxString = (self.parent.version != 2) ? self.id + ".Ox" : "Ox";
        var OyString = (self.parent.version != 2) ? self.id + ".Oy" : "Oy";
        self.parent.evaluator.setVariable(OxString, (self.Ox - disp.x));
        self.parent.evaluator.setVariable(OyString, (self.Oy - disp.y));
        self.posAnte.x -= disp.x;
        self.posAnte.y -= disp.y;
      }

      if (self.click) {
        onSensitiveToMouseMovements(evt);
      }

      // intenta mantener el gesto de deslizar en las tablets
      if ((!self.fixed) || (self.sensitive_to_mouse_movements)) {
        evt.preventDefault();
      }
    }
  }
    
  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathFloor = Math.floor;
  var MathRound = Math.round;
  var MathCos   = Math.cos;
  var MathSin   = Math.sin;
  
  /**
   * Un espacio de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la aplicacion de descartes
   */
  descartesJS.Space3D = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Space.call(this, parent, values);
    
    // se crean los elementos graficos
    this.backgroundCanvas = document.createElement("canvas");
    this.backgroundCanvas.setAttribute("id", this.id + "_background");
    this.backgroundCanvas.setAttribute("width", this.w + "px");
    this.backgroundCanvas.setAttribute("height", this.h + "px");
    this.backgroundCtx = this.backgroundCanvas.getContext("2d");

    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", this.id + "_canvas");
    this.canvas.setAttribute("width", this.w + "px");
    this.canvas.setAttribute("height", this.h + "px");
    this.canvas.setAttribute("class", "DescartesSpace3DCanvas");
    this.canvas.setAttribute("style", "z-index: " + this.zIndex + ";");
    this.ctx = this.canvas.getContext("2d");
    
    // se crean contenedores para los controles graficos y los numericos
    this.graphicControlContainer = document.createElement("div");
    this.graphicControlContainer.setAttribute("id", this.id + "_graphicControls");
    this.graphicControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + this.zIndex + ";");
    
    this.numericalControlContainer = document.createElement("div");
    this.numericalControlContainer.setAttribute("id", this.id + "_numericalControls");
    this.numericalControlContainer.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: " + this.zIndex + ";");

    // se crea el contenedor principal
    this.container = document.createElement("div");
    this.container.setAttribute("id", this.id);
    this.container.setAttribute("class", "DescartesSpace3DContainer");
    this.container.setAttribute("style", "left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");

    // se agregan los elementos al DOM
    this.container.appendChild(this.backgroundCanvas);
    this.container.appendChild(this.canvas);
    this.container.appendChild(this.graphicControlContainer);
    this.container.appendChild(this.numericalControlContainer);
    
    parent.container.insertBefore(this.container, parent.loader);

    // encuentra el offset del contenedor para el calculo de la posicion del mouse
    this.findOffset();
    
    // this.eye = new descartesJS.Vector3D(this.scale/5, 2, 5);
    this.eye = new descartesJS.Vector3D(0,0,0);
    this.center = new descartesJS.Vector3D(0, 0, 0);
    this.yUpEye = new descartesJS.Vector3D(0, 0, 1);
    // this.distanceEyeCenter = Math.sqrt(Math.pow(this.eye.x-this.center.x, 2) + Math.pow(this.eye.y-this.center.y, 2) + Math.pow(this.eye.z-this.center.z, 2));
    this.distanceEyeCenter = 10;
    this.alpha = Math.PI/4;
    this.beta = -Math.PI/5;
    
    // this.lookAtMatrix = (new descartesJS.Matrix4x4()).lookAt(this.eye, this.center, this.yUpEye);
    // this.perspectiveMatrix = perspective.multiply(this.lookAtMatrix);

    this.lookAtMatrix = new descartesJS.Matrix4x4();
    this.perspectiveMatrix = new descartesJS.Matrix4x4();
    this.perspective = (new descartesJS.Matrix4x4()).perspective(45, this.w/this.h, 0.01, 1000.0);

    cosAlpha = MathCos(-this.alpha);
    sinAlpha = MathSin(-this.alpha);
    cosBeta = MathCos(this.beta);
    sinBeta = MathSin(this.beta);

    this.eye.set(this.distanceEyeCenter*cosAlpha*cosBeta, 
                 this.distanceEyeCenter*sinAlpha*cosBeta, 
                -this.distanceEyeCenter*sinBeta);

    this.yUpEye = this.yUpEye.set(MathCos(-this.alpha - Math.PI/2), MathSin(-this.alpha - Math.PI/2), 0).crossProduct(this.eye).normalize();

    this.lookAtMatrix = this.lookAtMatrix.setIdentity().lookAt(this.eye, this.center, this.yUpEye);

    this.perspectiveMatrix = this.perspective.multiply(this.lookAtMatrix);

    // this.scene = new descartesJS.Scene();
  
    this.registerMouseEvents();

    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Space3D, descartesJS.Space);
    
  /**
   * Actualiza los valores del espacio
   * @param [Boolean] firstTime variable que indica si se esta actualizando por primera vez
   */
  descartesJS.Space3D.prototype.update = function(firstTime) {
    // // si hay que dibujar entonces se dibuja
    // if ( this.evaluator.evalExpression(this.drawif) > 0 ) {    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = descartesJS.getColor(this.evaluator, this.background);
    this.ctx.fillRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);

    // la escena no se esta moviendo
    if (!this.click) {
      this.scene = new descartesJS.Scene(this);

      //se dibujan las graficas que no son del fondo
      for(var i=0, l=this.graphics.length; i<l; i++) {
        var thisGraphics_i = this.graphics[i];
        // if (!thisGraphics_i.background) {
          thisGraphics_i.update();
        // }
      }
    }

    this.scene.draw();

    // }
  }

  /**
   * 
   */
  descartesJS.Space3D.prototype.transformCoordinateX = function(x) {
    var w_2 = this.w/2;
    return MathFloor(x*w_2 + w_2 + this.Ox);
  }
  
  /**
   * 
   */
  descartesJS.Space3D.prototype.transformCoordinateY = function(y) {
    var h_2 = this.h/2;
    return MathFloor(-y*h_2 + h_2 + this.Oy);
  }

  /**
   * Se registran los eventos del mouse del espacio
   */
  descartesJS.Space3D.prototype.registerMouseEvents = function() {
    // se crea una variable con el valor del objeto (Space2D) para que el ambiente de las funciones pueda utilizarlo
    var self = this;
    var hasTouchSupport = descartesJS.hasTouchSupport;
    var oldMouse = {x: 0, y: 0};

    this.canvas.oncontextmenu = function () { return false; };
    ///////////////////////////////////////////////////////////////////////////
    // Registro de eventos de touch (iOS, android)
    ///////////////////////////////////////////////////////////////////////////
    if (hasTouchSupport) {
      if (this.sensitive_to_mouse_movements) {
        this.canvas.addEventListener("touchmove",  onSensitiveToMouseMovements, false);
      }
      this.canvas.addEventListener("touchstart", onTouchStart, false);
    }

    /**
     * @param {Event} evt el evento lanzado por la accion de iniciar un touch
     * @private
     */
    function onTouchStart(evt) {
      self.click = 1;
      self.parent.evaluator.setVariable(self.id + ".mouse_pressed", 1);

//       // se desactivan los controles graficos
//       self.parent.deactivateGraphiControls();

      onSensitiveToMouseMovements(evt);
      
//      self.parent.update();

      window.addEventListener("touchmove", onMouseMove, false);
      window.addEventListener("touchend", onTouchEnd, false);

      // intenta mantener el gesto de deslizar en las tablets      
      if ((!self.fixed) || (self.sensitive_to_mouse_movements)) {
        evt.preventDefault();
      }
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de finalizar un touch
     * @private
     */
    function onTouchEnd(evt) {
      self.click = 0;
      self.parent.evaluator.setVariable(self.id + ".mouse_pressed", 0);

      window.removeEventListener("touchmove", onMouseMove, false);
      window.removeEventListener("touchend", onTouchEnd, false);

      // self.parent.update();

      evt.preventDefault();

      // self.parent.update();
    }
  
    ///////////////////////////////////////////////////////////////////////////
    // Registro de eventos de mouse
    ///////////////////////////////////////////////////////////////////////////
    if (!hasTouchSupport) {
      if (this.sensitive_to_mouse_movements) {
        this.canvas.addEventListener("mousemove", onSensitiveToMouseMovements, false);
      }
      this.canvas.addEventListener("mousedown", onMouseDown, false);
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de presionar un boton
     * @private
     */
    function onMouseDown(evt) {
      self.click = 1;
      
//       // se desactivan los controles graficos
//       self.parent.deactivateGraphiControls();

      // ie
      if (evt.which == null) {
        self.whichButton = (evt.button < 2) ? "LEFT" : ((evt.button == 4) ? "MIDDLE" : "RIGHT");
      } 
      // los demas
      else {
        self.whichButton = (evt.which < 2) ? "LEFT" : ((evt.which == 2) ? "MIDDLE" : "RIGHT");
      }
      
//       // se bloquea la aparicion del menu contextual y si el espacio no esta fijo se asigna un manejador para el zoom
//       if (self.whichButton == "RIGHT") {
// //        window.oncontextmenu = function () { return false; };
//         window.addEventListener("mouseup", onMouseUp, false);
        

//         if (!self.fixed) {
//           self.clickPosForZoom = (self.getCursorPosition(evt)).y;
//           self.tempScale = self.scale;
//           window.addEventListener("mousemove", onMouseMoveZoom, false);
//         }
//       }
      
      if (self.whichButton == "LEFT") {
        self.parent.evaluator.setVariable(self.id + ".mouse_pressed", 1);

        self.posAnte = self.getCursorPosition(evt);
        oldMouse.x = self.getRelativeX(self.posAnte.x);
        oldMouse.y = self.getRelativeY(self.posAnte.y);

        onSensitiveToMouseMovements(evt);

        window.addEventListener("mousemove", onMouseMove, false);
        window.addEventListener("mouseup", onMouseUp, false);
      }
      
      evt.preventDefault();
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de soltar un boton
     * @private
     */
    function onMouseUp(evt) {
      self.click = 0;
      self.parent.evaluator.setVariable(self.id + ".mouse_pressed", 0);
      evt.preventDefault();

      // se desbloquea la aparicion del menu contextual
      if (self.whichButton == "RIGHT") {
        window.removeEventListener("mousemove", onMouseMoveZoom, false);
//      window.oncontextmenu = "";
      }

//       if (!self.sensitive_to_mouse_movements) {
//         window.removeEventListener("mousemove", onMouseMove, false);
//       }
      window.removeEventListener("mouseup", onMouseUp, false);

// //       if (self.whichButton == "LEFT") {
// //         window.removeEventListener("mousemove", onMouseMove, false);
// //       }      
      
//       // self.parent.update();
      
//       self.parent.update();
    }

    /**
     * 
     */
    function onSensitiveToMouseMovements(evt) {
      self.posAnte = self.getCursorPosition(evt);
      self.mouse_x = self.getRelativeX(self.posAnte.x);
      self.mouse_y = self.getRelativeY(self.posAnte.y);

      self.parent.evaluator.setVariable(self.id + ".mouse_x", self.mouse_x);
      self.parent.evaluator.setVariable(self.id + ".mouse_y", self.mouse_y);

      self.parent.update();
    }
    
    /**
     * @param {Event} evt el evento lanzado por la acción de mover el mouse con el boton derecho presionado
     * @private
     */
    function onMouseMoveZoom(evt) {
      // self.clickPosForZoomNew = (self.getCursorPosition(evt)).y;

      // // ## parche para descartes 2 ## //
      // var escalaString = (self.parent.version != 2) ? self.id + ".escala" : "escala";

      // self.evaluator.setVariable(escalaString, self.tempScale + (self.tempScale/45)*((self.clickPosForZoom-self.clickPosForZoomNew)/10));
      
      // self.parent.update();
      
      // evt.preventDefault();
    }

    var cosAlpha;
    var sinAlpha;
    var cosBeta;
    var sinBeta;
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de mover el mouse
     * @private
     */
    function onMouseMove(evt) {
      // // si el espacio no esta fijo entonces se modifica la posicion del origen
      // if (!self.fixed) {
      //   self.posNext = self.getCursorPosition(evt);
      //   var disp = { x:MathFloor(self.posAnte.x-self.posNext.x), 
      //                y:MathFloor(self.posAnte.y-self.posNext.y) };
                    
      //   var OxString = self.id + ".Ox";
      //   var OyString = self.id + ".Oy";
      //   self.parent.evaluator.setVariable(OxString, (self.Ox - disp.x));
      //   self.parent.evaluator.setVariable(OyString, (self.Oy - disp.y));
      //   self.posAnte.x -= disp.x;
      //   self.posAnte.y -= disp.y;
      // }

      if (self.click) {
        onSensitiveToMouseMovements(evt);
        // self.alpha = (self.alpha + (self.mouse_x - oldMouse.x)*.2);
        // self.beta = (self.beta + (self.mouse_y - oldMouse.y)*.2);
        self.alpha = (self.alpha + (self.mouse_x - oldMouse.x));
        self.beta = (self.beta + (self.mouse_y - oldMouse.y));
        // console.log(self.alpha, self.beta)
        cosAlpha = MathCos(-self.alpha);
        sinAlpha = MathSin(-self.alpha);
        cosBeta = MathCos(self.beta);
        sinBeta = MathSin(self.beta);

// ca=cos(-alfa);sa=sen(-alfa);cb=cos(beta);sb=sen(beta);ux=ca*cb;uy=sa*cb;uz=sb;Xx=-sa;Xy=ca;Xz=0;Yx=-sb*ca;Yy=-sb*sa;Yz=cb;

        // self.eye = new descartesJS.Vector3D(self.distanceEyeCenter*cosAlpha*cosBeta, self.distanceEyeCenter*sinAlpha*cosBeta, self.distanceEyeCenter*sinBeta);
        self.eye.set(self.distanceEyeCenter*cosAlpha*cosBeta, 
                     self.distanceEyeCenter*sinAlpha*cosBeta, 
                    -self.distanceEyeCenter*sinBeta);

        self.yUpEye = self.yUpEye.set(MathCos(-self.alpha - Math.PI/2), 
                                      MathSin(-self.alpha - Math.PI/2), 
                                      0
                                     ).crossProduct(self.eye).normalize();

        self.lookAtMatrix = self.lookAtMatrix.setIdentity().lookAt(self.eye, self.center, self.yUpEye);

        self.perspectiveMatrix = self.perspective.multiply(self.lookAtMatrix);
      
        oldMouse = { x: self.mouse_x, y: self.mouse_y };
      }

      // // intenta mantener el gesto de deslizar en las tablets
      // if ((!self.fixed) || (self.sensitive_to_mouse_movements)) {
      //   evt.preventDefault();
      // }
    }
  }
  
  
  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un espacio de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la aplicacion de descartes
   */
  descartesJS.SpaceAP = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Space.call(this, parent, values);

    // arreglo para contener las variables publicas del padre
    this.importarVars = null;
    // arreglo para contener las variables publicas propias
    this.exportarVars = null;

    var evaluator = parent.evaluator;
    
    // si el nombre del archivo es una expresion
    if (this.file.match(/^\[/) && this.file.match(/\]$/)) {
      this.file = evaluator.parser.parse(this.file.substring(1, this.file.length-1));
    }
    // si el nombre del archivo es una cadena
    else if (this.file.match(/^\'/) && this.file.match(/\'$/)) {
      this.file = evaluator.parser.parse(this.file);
    }
    else {
      this.file = evaluator.parser.parse("'" + this.file + "'");
    }
    
    this.oldFile = evaluator.evalExpression(this.file);
    
    this.initFile();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.SpaceAP, descartesJS.Space);
  
  /**
   * 
   */
  descartesJS.SpaceAP.prototype.initFile = function() {
    this.firstUpdate = true;
    
    var response;

    if (this.oldFile) {

      // si el contenido del espacio esta embedido en la pagina
      var spaceElement = document.getElementById(this.oldFile);
      if ((spaceElement) && (spaceElement.type == "descartes/spaceApFile")) {
        response = spaceElement.text;
      }
      
      else {
        response = descartesJS.openExternalFile(this.oldFile);
      }
      
      if (response != null) {
        response = response.split("\n");
      }
    }
    
    // si se pudo leer el archivo y el archivo tiene alguna etiqueta applet, entonces se crean los elementos
    if ( (response) && (response.toString().match(/<applet/gi)) ) {
      // se encuentra el contenido del applet de descartes
      var appletContent = "";
      var initApplet = false;
      for (var i=0, l=response.length; i<l; i++) {
        if ( response[i].match("<applet") ) {
          initApplet = true;
        }
        
        if (initApplet) {
          appletContent += response[i];
        }
        
        if ( response[i].match("</applet") ) {
          break;
        }
      }
      
      var myApplet = document.createElement("div");
      myApplet.innerHTML = appletContent;
      myApplet.firstChild.setAttribute("width", this.w);
      myApplet.firstChild.setAttribute("height", this.h);
      
      var oldContainer = (this.descApp) ? this.descApp.container : null;
      
      this.descApp = new descartesJS.DescartesApp(myApplet.firstChild);
      this.descApp.container.setAttribute("class", "DescartesAppContainer");
      this.descApp.container.setAttribute("style", "position: absolute; overflow: hidden; background-color: " + this.background + "; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
      
      // se agrega el nuevo espacio
      if (oldContainer) {
        this.parent.container.replaceChild(this.descApp.container, oldContainer);
      }
      else {
        this.parent.container.insertBefore(this.descApp.container, this.parent.loader);
      }
      
      // para cada nuevo espacio creado se encuentra el offset de su posicion
      var tmpSpaces = this.descApp.spaces;
      for (var i=0, l=tmpSpaces.length; i<l; i++) {
        tmpSpaces[i].findOffset();
      }
      
      this.descApp.container.style.display = (this.evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
      
      var self = this;
      this.descApp.update = function() {
        // se actualizan los auxiliares
        this.updateAuxiliaries();
        // se actualizan los eventos
        this.updateEvents();
        // se actualizan los controles
        this.updateControls();
        // se actualizan los graficos del espacio
        this.updateSpaces();
        
        self.exportar();
      }      
    }
    
    // no se pudo cargar el archivo entonces se crea un contenedor vacio, que muestra el color del fondo y la imagen especificada, ademas la funcion de actualizacion no hace nada
    else {
      var oldContainer = (this.descApp) ? this.descApp.container : null;
      
      this.descApp = {};
      this.descApp.container = document.createElement("div");
      this.descApp.container.setAttribute("class", "DescartesAppContainer");
      
      // el estilo del contenedor
      var styleString = "position: absolute; overflow: hidden; background-color: " + this.background + "; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";";
      
      if (this.image) {
        if (this.bg_display == "topleft") {
          styleString += "background-image: url(" + this.imageSrc + "); background-repeat:no-repeat;";
        } 
        else if (this.bg_display == "stretch") {
          styleString += "background-image: url(" + this.imageSrc + "); background-repeat:no-repeat; background-size: 100% 100%;";
        } 
        else if (this.bg_display == "patch") {
          styleString += "background-image: url(" + this.imageSrc + ");";
        }
        else if (this.bg_display == "center") {
          styleString += "background-image: url(" + this.imageSrc + "); background-repeat:no-repeat; background-position: center center;";
        }
      }
      
      this.descApp.container.setAttribute("style", styleString);
      
      // se agrega el nuevo espacio al contenedor principal
      if (oldContainer) {
        this.parent.container.replaceChild(this.descApp.container, oldContainer);
      }
      else {
        this.parent.container.insertBefore(this.descApp.container, this.parent.loader);
      }
      
      this.descApp.container.style.display = (this.evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
      
//       this.update = function() {};
    }
  }
  
  /**
   * Actualiza los valores del espacio
   */
  descartesJS.SpaceAP.prototype.update = function() {
    var tmpFile = this.evaluator.evalExpression(this.file);
    if (this.oldFile != tmpFile) {
      this.oldFile = tmpFile;

//       this.init();
      this.initFile();
    }
    else { 
    var changeX = (this.x != this.evaluator.evalExpression(this.xExpr));
    var changeY = (this.y != (this.evaluator.evalExpression(this.yExpr) + this.plecaHeight));

    this.x = (changeX) ? this.evaluator.evalExpression(this.xExpr) : this.x;
    this.y = (changeY) ? (this.evaluator.evalExpression(this.yExpr) + this.plecaHeight) : this.y;

    // si cambio alguna propiedad del espacio entonces cambiamos las propiedades del contenedor
    if (changeX) {
      this.descApp.container.style.left = this.x + "px";
    }
    if (changeY) {
      this.descApp.container.style.top = this.y + "px";
    }
    if ((changeX) || (changeY)) {
      var tmpSpaces = this.descApp.spaces;
      for (var i=0, l=tmpSpaces.length; i<l; i++) {
        tmpSpaces[i].findOffset();
      }
    }

    this.descApp.container.style.display = (this.evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
    
    //////////////////////////////////////////////////////////////////////////////////////////////////
    // se encuentran las variables externas
    if (this.firstUpdate) {
      this.firstUpdate = false;
      // el arreglo para guardar las variables no ha sido inicializado
      if (this.importarVars == null) {
        this.importarVars = [];
        for (var propName in this.evaluator.variables) {
          // solo se verifican las propiedades propias del objeto values
          if (this.evaluator.variables.hasOwnProperty(propName) && propName.match(/^public./)) {
            this.importarVars.push( { varName: propName, value: this.evaluator.getVariable(propName) } );
          }
        }
//         console.log(this.importarVars);
      } 
    }
    
    // se importaran variables en caso de ser necesario
    this.importar();
  }
}
// codigo para el importar y exportar que no deberia de existir
// por que se deberia de implematar AP.get(var, variable), AP.set(var, value), AP.update()
  
  /**
   * 
   */
  descartesJS.SpaceAP.prototype.importar = function() {
//     // el arreglo para guardar las variables no ha sido inicializado
//     if (this.importarVars == null) {
//       this.importarVars = [];
//       for (var propName in this.evaluator.variables) {
//         // solo se verifican las propiedades propias del objeto values
//         if (this.evaluator.variables.hasOwnProperty(propName) && propName.match(/^public./)) {
//           this.importarVars.push( { varName: propName, value: this.evaluator.getVariable(propName) } );
//         }
//       }
//       console.log(this.importarVars);
//     }
    
    var tmpEval;
    var updateThis = false;
    for (var i=0, l=this.importarVars.length; i<l; i++) {
      tmpEval = this.evaluator.getVariable(this.importarVars[i].varName)
      if (tmpEval != this.importarVars[i].value) {
        this.importarVars[i].value = tmpEval;
        this.descApp.evaluator.setVariable(this.importarVars[i].varName, this.importarVars[i].value);
        updateThis = true;
      }
    }

    if (updateThis) {
      this.descApp.update();
    }
  }
  
  /**
   * 
   */
  descartesJS.SpaceAP.prototype.exportar = function() {
    
  }
  
  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un espacio de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la aplicacion de descartes
   */
  descartesJS.SpaceHTML_IFrame = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Space.call(this, parent, values);

    var evaluator = this.parent.evaluator;
    
    // si el nombre del archivo es una expresion
    if (this.file.match(/^\[/) && this.file.match(/\]$/)) {
      this.file = evaluator.parser.parse(this.file.substring(1, this.file.length-1));
    }
    // si el nombre del archivo es una cadena
    else if (this.file.match(/^\'/) && this.file.match(/\'$/)) {
      this.file = evaluator.parser.parse(this.file);
    }
    else {
      this.file = evaluator.parser.parse("'" + this.file + "'");
    }
    
    this.oldFile = evaluator.evalExpression(this.file);    
    
    this.MyIFrame = document.createElement("iframe");
    this.MyIFrame.setAttribute("src", this.oldFile);
    this.MyIFrame.setAttribute("id", this.id);
    this.MyIFrame.setAttribute("marginheight", 0)
    this.MyIFrame.setAttribute("marginwidth", 0)
    this.MyIFrame.setAttribute("frameborder", 0);
    this.MyIFrame.setAttribute("scrolling", "auto");
//     this.MyIFrame.setAttribute("style", "position: absolute; overflow: hidden; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
//     this.MyIFrame.setAttribute("style", "position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    this.MyIFrame.setAttribute("style", "position: absolute; width: " + this.w + "px; height: " + this.h + "px; left: " + this.x + "px; top: " + this.y + "px;");
    this.MyIFrame.style.display = (this.evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";

    this.parent.container.insertBefore(this.MyIFrame, this.parent.loader);

    //////////////////////////////////////////////////////////////////////
    // se registran las funciones de comunicacion
    var self = this;
    
    // funcion para asignar un valor a una variable
    this.MyIFrame.onload = function(evt) {
      var iframe = this;

      // mensaje para asignar un valor a una variable
      var iframeSet = function(varName, value) {
        iframe.contentWindow.postMessage({ type: "set", name: varName, value: value }, "*");
      }      
      self.evaluator.setFunction(self.id + ".set", iframeSet);

      // mensaje para realizar una actualizacion
      var iframeUpdate = function(varName, value) {
        iframe.contentWindow.postMessage({ type: "update" }, "*");
      }      
      self.evaluator.setFunction(self.id + ".update", iframeUpdate);
      
      // mensaje para obtener el valor de una variable
      var iframeGet = function(varName, value) {
        iframe.contentWindow.postMessage({ type: "get", name: varName, value: value }, "*");
      }
      self.evaluator.setFunction(self.id + ".get", iframeGet);
      
      // mensaje para ejecutar una funcion
      var iframeExec = function(functionName, functionParameters) {
        iframe.contentWindow.postMessage({ type: "exec", name: functionName, value: functionParameters }, "*");
      }
      self.evaluator.setFunction(self.id + ".exec", iframeExec);      
    }
    
    // se registra la variable para el scroll
    this.evaluator.setVariable(this.id + "._scroll", 0);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Space
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.SpaceHTML_IFrame, descartesJS.Space);
  
  /**
   * Actualiza los valores del espacio
   */
  descartesJS.SpaceHTML_IFrame.prototype.update = function(firstTime) { 
    if (firstTime) {
      this.x = Math.Infinity;
      this.y = Math.Infinity;
    }
      
    var evaluator = this.evaluator;
    var changeX = (this.x != evaluator.evalExpression(this.xExpr) + this.displaceRegionWest);
    var changeY = (this.y != evaluator.evalExpression(this.yExpr) + this.parent.plecaHeight  + this.displaceRegionNorth);
    this.x = (changeX) ? evaluator.evalExpression(this.xExpr) + this.displaceRegionWest: this.x;
    this.y = (changeY) ? evaluator.evalExpression(this.yExpr) + this.parent.plecaHeight  + this.displaceRegionNorth : this.y;

    var file = evaluator.evalExpression(this.file);
    // if (file != this.oldFile) {
      this.oldFile = file;
      this.MyIFrame.setAttribute("src", file);
    // }
    
    // si cambio alguna propiedad del espacio entonces cambiamos las propiedades del contenedor
    if (changeX) {
      this.MyIFrame.style.left = this.x + "px";
    }
    if (changeY) {
      this.MyIFrame.style.top = this.y + "px";
    }

    this.MyIFrame.style.display = (evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";
   
    this.scrollVar = evaluator.getVariable(this.id + "._scroll");
    
    if (this.scrollVar == 1) {
      this.MyIFrame.setAttribute("scrolling", "yes");
    }
    else if (this.scrollVar == -1) {
      this.MyIFrame.setAttribute("scrolling", "no");
    }
    else {
      this.MyIFrame.setAttribute("scrolling", "auto");
    }

  }
  
  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var babel = (function(babel) {
  
//  babel["espa\u00F1ol"] = babel["english"] = babel["catal\u00E0"] = babel["euskera"] = babel["fran\u00E7ais"] = babel["galego"] = babel["portugu\u00EAs"] = babel["valenci\u00E0"] = "";
  babel["falso"] = babel["false"] = babel["fals"] = babel["gezurra"] = babel["faux"] = babel["fals"] = "false";
  babel["verdadero"] = babel["true"] = babel["veritable"] = babel["egia"] = babel["vrai"] = babel["verdadeiro"] = babel["veritable"] = "true";
  babel["no"] = babel["ez"] = babel["non"] = babel["n\u00E3o"] = "false";
  babel["s\u00ED"] = babel["yes"] = babel["bai"] = babel["oui"] = babel["si"] = babel["sim "] = "true";
  babel["negro"] = babel["black"] = babel["negre"] = babel["beltza"] = babel["noir"] = babel["preto"] = "#000000";
  babel["maxenta"] = babel["magenta"] = "#ff00ff";
  babel["azul"] = babel["blue"] = babel["blau"] = babel["urdina"] = babel["bleu"] = "#0000ff";
  babel["turquesa"] = babel["cyan"] = babel["turkesa"] = babel["turquoise"] = "#00ffff";
  babel["verde"] = babel["green"] = babel["verd"] = babel["berdea"] = babel["vert"] = "#00ff00";
  babel["amarillo"] = babel["yellow"] = babel["groc"] = babel["horia"] = babel["jaune"] = babel["amarelo"] = "#ffff00";
  babel["naranja"] = babel["orange"] = babel["taronja"] = babel["laranja"] = babel["laranxa"] = "#ffc800";
  babel["rojo"] = babel["red"] = babel["vermell"] = babel["gorria"] = babel["rouge"] = babel["vermello"] = babel["vermelho"] = "#ff0000";
  babel["pink"] = babel["rosa"] = babel["arrosa"] = babel["rose"] = "#ffafaf";
  babel["grisObscuro"] = babel["darkGray"] = babel["grisFosc"] = babel["gris iluna"] = babel["grisObscur"] = babel["grisEscuro"] = babel["cinzaEscuro"] = "#404040";
  babel["gris"] = babel["gray"] = babel["grisa"] = babel["cinza"] = "#808080";
  babel["grisClaro"] = babel["lightGray"] = babel["grisClar"] = babel["gris argia"] = babel["grisClair"] = babel["cinzaClaro"] = "#c0c0c0";
  babel["blanco"] = babel["white"] = babel["blanc"] = babel["zuria"] = babel["branco"] = "#ffffff";
  babel["escala"] = babel["scale"] = babel["eskala"] = babel["\u00E9chelle"] = "scale";
//  babel["Se puede copiar este texto y pegarlo en una p\u00E1gina Web."] = babel["You may copy this text and paste it on a Web page."] = babel["Podeu copiar aquest text i enganxar-lo en una p\u00E0gina web."] = babel["Testu hau kopia dezakezu eta web orri batean itsasi."] = babel["Vous pouvez copier ce texte et l'accrocher en une page web."] = babel["Pode copiar este texto e pegalo nunha p\u00E1xina Web."] = babel["Voc\u00EA pode copiar este texto e col\u00E1-lo em uma p\u00E1gina WEB."] = babel["Podeu copiar aquest text i enganxar-lo en una p\u00E0gina web."] = "";
  babel["nombre"] = babel["name"] = babel["nom"] = babel["izena"] = babel["nome"] = "name";
//  babel["editable"] = babel["editable"] = babel["editable"] = babel["editagarria"] = babel["editable"] = babel["editable"] = babel["modific\u00E1vel"] = babel["editable"] = "";
  babel["ikusgai"] = babel["vis\u00EDvel"] = babel["visible"] = "visible";
  babel["rastro"] = babel["trace"] = babel["rastre"] = babel["arrastoa"] = "trace";
//   babel["control"] = babel["control"] = babel["control"] = babel["kontrola"] = babel["contr\u00F4le"] = babel["control"] = babel["controle"] = babel["control"] = "";
  babel["fondo"] = babel["background"] = babel["fons"] = babel["hondoa"] = babel["fond"] = babel["fundo"] = "background";
  babel["colour"] = babel["color"] = babel["kolorea"] = babel["couleur"] = babel["cor"] = "color";
  babel["par\u00E1metro"] = babel["parameter"] = babel["parametroa"] = babel["par\u00E2metro"] = babel["par\u00E0metre"] = "parameter";
  babel["sucesi\u00F3n"] = babel["sequence"] = babel["successi\u00F3"] = babel["segida"] = babel["succession"] = babel["seq\u00FC\u00EAncia"] = "sequence";
  babel["tama\u00F1o"] = babel["size"] = babel["neurria"] = babel["taille"] = babel["tamanho"] = babel["grand\u00E0ria"] = "size";
  babel["decimales"] = babel["decimals"] = babel["hamartarra"] = babel["d\u00E9cimales"] = babel["decimais"] = "decimals";
  babel["red"] = babel["net"] = babel["xarxa"] = babel["sarea"] = babel["r\u00E9seau"] = babel["rede"] = babel["malha"] = "net";
  babel["red10"] = babel["net10"] = babel["xarxa10"] = babel["sarea10"] = babel["r\u00E9seau10"] = babel["rede10"] = babel["malha10"] = "net10";
  babel["ejes"] = babel["axes"] = babel["eixos"] = babel["ardatzak"] = babel["eixes"] = "axes";
  babel["texto"] = babel["text"] = babel["testua"] = babel["texte"] = "text";
  //////////////////////////////
  // botones de configuracion
  //////////////////////////////
  babel["cr\u00E9ditos"] = babel["about"] = babel["cr\u00E8dits"] = babel["kreditoak"] = babel["cr\u00E9dits"] = babel["sobre"] = "about";
  babel["config"] = babel["konfig"] = babel["configura\u00E7\u00E3o"] = "config";
  babel["inicio"] = babel["init"] = babel["inici"] = babel["hasiera"] = babel["commencement"] = babel["in\u00EDcio"] = "init";
  babel["limpiar"] = babel["clear"] = babel["neteja"] = babel["ezabatu"] = babel["nettoye"] = babel["limpar"] = "clear";
  //////////////////////////////
  babel["incr"] = babel["gehi"] = babel["incremento"] = "incr";
  babel["min"] = babel["inf"] = "min";
  babel["max"] = babel["sup"] = babel["m\u00E1x"] = "max";
  babel["relleno"] = babel["fill"] = babel["ple"] = babel["betea"] = babel["plein"] = babel["recheo"] = babel["preencher"] = "fill";
  babel["relleno+"] = babel["fill+"] = babel["ple+"] = babel["betea+"] = babel["plein+"] = babel["recheo+"] = babel["preencher+"] = "fillP";
  babel["relleno-"] = babel["fill-"] = babel["ple-"] = babel["betea-"] = babel["plein-"] = babel["recheo-"] = babel["preencher-"] = "fillM";
  babel["flecha"] = babel["arrow"] = babel["fletxa"] = babel["gezia"] = babel["fl\u00E8che"] = babel["frecha"] = babel["seta"] = "arrow";
  babel["ancho"] = babel["width"] = babel["ample"] = babel["zabalera"] = babel["large"] = babel["largura"] = "width";
  babel["punta"] = babel["spear"] = babel["muturra"] = babel["pointe"] = babel["ponta"] = "spear";
  babel["regi\u00F3n"] = babel["region"] = babel["regi\u00F3"] = babel["eskualde"] = babel["r\u00E9gion"] = babel["rexi\u00F3n"] = babel["regi\u00E3o"] = "region";
  babel["norte"] = babel["north"] = babel["nord"] = babel["ipar"] = "north";
  babel["sur"] = babel["south"] = babel["sud"] = babel["hego"] = babel["sul"] = "south";
  babel["este"] = babel["east"] = babel["est"] = babel["ekialde"] = babel["leste"] = "east";
  babel["oeste"] = babel["west"] = babel["oest"] = babel["hegoalde"] = babel["ouest"] = "west";
  babel["exterior"] = babel["external"] = babel["kanpoalde"] = babel["externo"] = "external";
  babel["expresi\u00F3n"] = babel["expresion"] = babel["expresi\u00F3"] = babel["adierazpen"] = babel["express\u00E3o"] = "expresion";
  babel["tipo"] = babel["type"] = babel["tipus"] = babel["mota"] = "type";
  babel["posici\u00F3n"] = babel["position"] = babel["posici\u00F3"] = babel["posizio"] = babel["posi\u00E7\u00E3o"] = "position";
  babel["constricci\u00F3n"] = babel["constraint"] = babel["constricci\u00F3"] = babel["beharte"] = babel["constriction"] = babel["constrici\u00F3n"] = babel["restri\u00E7\u00E3o"] = "constraint";
//  babel["infinito"] = babel["infinity"] = babel["infinit"] = babel["infinitu"] = babel["infini"] = babel["infinito"] = babel["infinito"] = babel["infinit"] = "";
  babel["valor"] = babel["value"] = babel["balio"] = babel["valeur"] = "value";
  babel["ecuaci\u00F3n"] = babel["equation"] = babel["equaci\u00F3"] = babel["ekuazio"] = babel["\u00E9quation"] = babel["equa\u00E7\u00E3o"] = "equation";
  babel["curva"] = babel["curve"] = babel["corba"] = babel["kurba"] = babel["courbe"] = "curve";
  babel["texto"] = babel["text"] = babel["testu"] = babel["texte"] = "text";
  babel["punto"] = babel["point"] = babel["punt"] = babel["puntu"] = babel["ponto"] = "point";
  babel["segmento"] = babel["segment"] = babel["zuzenki"] = "segment";
  babel["arco"] = babel["arc"] = babel["arku"] = "arc";
  babel["pol\u00EDgono"] = babel["polygon"] = babel["pol\u00EDgon"] = babel["poligono"] = babel["polygone"] = "polygon";
  babel["imagen"] = babel["image"] = babel["imatge"] = babel["irudi"] = babel["imaxe"] = babel["imagem"] = "image";
  babel["Versi\u00F3n"] = babel["Version"] = babel["Versi\u00F3"] = babel["Vers\u00E3o"] = "version";
  babel["Idioma"] = babel["Language"] = babel["Hizkuntza"] = babel["Langue"] = "language";
//  babel["Espacio"] = babel["Space"] = babel["Espai"] = babel["Espazioa"] = babel["Espace"] = babel["Espazo"] = babel["Espa\u00E7o"] = babel["Espai"] = "";
  babel["O.x"] = "O.x";
  babel["O.y"] = "O.y";
//  babel["Controles"] = babel["Controls"] = babel["Controls"] = babel["Kontrolak"] = babel["Contr\u00F4les"] = babel["Controis"] = babel["Controles"] = babel["Controls"] = "";
//  babel["Auxiliares"] = babel["Auxiliaries"] = babel["Auxiliars"] = babel["Laguntzaile"] = babel["Auxiliaires"] = babel["Auxiliares"] = babel["Auxiliares"] = babel["Auxiliars"] = "";
//  babel["Gr\u00E1ficos"] = babel["Graphics"] = babel["Gr\u00E0fics"] = babel["Grafikoak"] = babel["Graphiques"] = babel["Gr\u00E1ficos"] = babel["Gr\u00E1ficos"] = babel["Gr\u00E0fics"] = "";
  babel["Botones"] = babel["Buttons"] = babel["Botons"] = babel["Botoiak"] = babel["Boutons"] = babel["Bot\u00F3ns"] = babel["Bot\u00F5es"] = babel["Botons"] = "Buttons";
  babel["Animaci\u00F3n"] = babel["Animation"] = babel["Animaci\u00F3"] = babel["Animazio"] = babel["Anima\u00E7\u00E3o"] = "Animation";
  babel["constante"] = babel["constant"] = babel["Konstante"] = "constant";
//  babel["original"] = babel["original"] = babel["original"] = babel["jatorrizkoa"] = babel["original"] = babel["orixinal"] = babel["original"] = babel["original"] = "";
//  babel["nueva"] = babel["new"] = babel["nova"] = babel["berria"] = babel["nouvelle"] = babel["novo"] = babel["novo"] = babel["nova"] = "";
//  babel["aplicar"] = babel["apply"] = babel["aplica"] = babel["ezarri"] = babel["appliquer"] = babel["aplicar"] = babel["aplicar"] = babel["aplica"] = "";
//  babel["cerrar"] = babel["close"] = babel["tanca"] = babel["itxi"] = babel["fermer"] = babel["pechar"] = babel["fechar"] = babel["tanca"] = "";
//  babel["cancelar"] = babel["cancel"] = babel["anul·la"] = babel["baliogabetu"] = babel["annuler"] = babel["cancelar"] = babel["cancelar"] = babel["anul·la"] = "";
//  babel["aceptar"] = babel["ok"] = babel["accepta"] = babel["onartu"] = babel["accepter"] = babel["aceptar"] = babel["ok"] = babel["accepta"] = "";
//  babel["agregar"] = babel["add"] = babel["afegeix"] = babel["erantsi"] = babel["ajouter"] = babel["engadir"] = babel["acrescentar"] = babel["afegeix"] = "";
//  babel["insertar"] = babel["insert"] = babel["insereix"] = babel["tartekatu"] = babel["ins\u00E9rer"] = babel["inserir"] = babel["inserir"] = babel["insereix"] = "";
//  babel["eliminar"] = babel["delete"] = babel["elimina"] = babel["kendu"] = babel["\u00E9liminer"] = babel["eliminar"] = babel["apagar"] = babel["elimina"] = "";
//  babel["arriba"] = babel["up"] = babel["amunt"] = babel["gora"] = babel["en haut"] = babel["arriba"] = babel["acima"] = babel["amunt"] = "";
//  babel["abajo"] = babel["down"] = babel["avall"] = babel["behera"] = babel["en bas"] = babel["abaixo"] = babel["abaixo"] = babel["avall"] = "";
//  babel["renombrar"] = babel["rename"] = babel["reanomenar"] = babel["berrizendatu"] = babel["r\u00E9appeler"] = babel["renomear"] = babel["renomear"] = babel["reanomenar"] = "";
//  babel["auxiliar"] = babel["auxiliary"] = babel["auxiliar"] = babel["laguntzaile"] = babel["auxiliaire"] = babel["auxiliar"] = babel["auxiliar"] = babel["auxiliar"] = "";
  babel["fuente"] = babel["font"] = babel["iturri"] = babel["source"] = babel["fonte"] = "font";
//  babel["deshacer"] = babel["undo"] = babel["desf\u00E9s"] = babel["desegin"] = babel["d\u00E9faire"] = babel["desfacer"] = babel["desfazer"] = babel["desf\u00E9s"] = "";
//  babel["rehacer"] = babel["redo"] = babel["ref\u00E9s"] = babel["berregin"] = babel["refaire"] = babel["refacer"] = babel["refazer"] = babel["ref\u00E9s"] = "";
  babel["num\u00E9rico"] = babel["numeric"] = babel["num\u00E8ric"] = babel["zenbakizko"] = babel["num\u00E9rique"] = "numeric";
  babel["gr\u00E1fico"] = babel["graphic"] = babel["gr\u00E0fic"] = babel["grafiko"] = babel["graphique"] = "graphic";
  babel["texto"] = babel["text"] = babel["testu"] = babel["texte"] = "text";
//  babel["pos"] = babel["pos"] = babel["pos"] = babel["pos"] = babel["pos"] = babel["pos"] = babel["pos"] = babel["pos"] = "";
  babel["inicio"] = babel["init"] = babel["inici"] = babel["hasiera"] = babel["commencement"] = babel["in\u00EDcio"] = "init";
  babel["hacer"] = babel["do"] = babel["fer"] = babel["egin"] = babel["faire"] = babel["facer"] = babel["fazer"] = "do";
  babel["mientras"] = babel["while"] = babel["mentre"] = babel["bitartean"] = babel["tandis que"] = babel["mentres"] = babel["enquanto"] = "while";
  babel["evaluar"] = babel["evaluate"] = babel["avalua"] = babel["ebaluatu"] = babel["\u00E9valuer"] = babel["avaliar"] = "evaluate";
  babel["variable"] = babel["aldagaia"] = babel["vari\u00E1vel"] = "variable";
  babel["funci\u00F3n"] = babel["function"] = babel["funci\u00F3"] = babel["funtzio"] = babel["fonction"] = babel["fun\u00E7\u00E3o"] = "function";
  babel["algoritmo"] = babel["algorithm"] = babel["algorisme"] = babel["algorithme"] = "algorithm";
  babel["vector"] = babel["array"] = babel["bektore"] = babel["vecteur"] = babel["matriz"] = "array";
//  babel["zoom"] = babel["zoom"] = babel["zoom"] = babel["zoom"] = babel["zoom"] = babel["zoom"] = babel["zoom"] = babel["zoom"] = "";
  babel["dibujar-si"] = babel["draw-if"] = babel["marraztu-baldin"] = babel["dessiner-si"] = babel["debuxar-se"] = babel["desenhar-se"] = babel["dibuixa-si"] = "drawif";
  babel["dominio"] = babel["range"] = babel["domini"] = babel["izate-eremua"] = babel["domain"] = babel["dom\u00EDnio"] = "range";
  babel["pausa"] = babel["delay"] = babel["eten"] = "delay";
//  babel["detener"] = babel["stop"] = babel["atura"] = babel["geldiarazi"] = babel["arr\u00EAter"] = babel["deter"] = babel["parar"] = babel["atura"] = "";
  babel["eje-x"] = babel["x-axis"] = babel["eix-x"] = babel["x-ardatza"] = babel["axe-x"] = babel["eixe-x"] = babel["eixo-x"] = "x-axis";
  babel["eje-y"] = babel["y-axis"] = babel["eix-y"] = babel["y-ardatza"] = babel["axe-y"] = babel["eixe-y"] = babel["eixo-y"] = "y-axis";
  babel["n\u00FAmeros"] = babel["numbers"] = babel["nombres"] = babel["zenbakiak"] = "numbers";
  babel["exponencial-si"] = babel["exponential-if"] = babel["esponentzial-baldin"] = babel["exponentiel-si"] = babel["exponencial-se"] = "exponentialif";
  babel["familia"] = babel["family"] = babel["fam\u00EDlia"] = babel["famille"] = "family";
  babel["intervalo"] = babel["interval"] = babel["tarte"] = babel["intervalle"] = "interval";
  babel["pasos"] = babel["steps"] = babel["passos"] = babel["pausoak"] = babel["pas"] = "steps";
  babel["centro"] = babel["center"] = babel["centre"] = babel["zentro"] = "center";
  babel["radio"] = babel["radius"] = babel["radi"] = babel["erradio"] = babel["rayon"] = babel["raio"] = "radius";
  babel["fin"] = babel["end"] = babel["fi"] = babel["bukaera"] = babel["fim"] = "end";
  babel["una-sola-vez"] = babel["only-once"] = babel["una-sola-vegada"] = babel["behin-bakarrik"] = babel["une-seule-fois"] = babel["unha-soa-vez"] = babel["apenas-uma-vez"] = "onlyOnce";
  babel["siempre"] = babel["always"] = babel["sempre"] = babel["beti"] = babel["toujours"] = "always";
//  babel["copiar"] = babel["copy"] = babel["copia"] = babel["kopiatu"] = babel["copier"] = babel["copiar"] = babel["copiar"] = babel["copia"] = "";
//  babel["pegar"] = babel["paste"] = babel["enganxa"] = babel["itsatsi"] = babel["accrocher"] = babel["pegar"] = babel["colar"] = babel["enganxa"] = "";
  babel["color-int"] = babel["int-colour"] = babel["barruko-kolore"] = babel["couleur-int"] = babel["cor-int"] = "colorInt";
  babel["repetir"] = babel["loop"] = babel["repeteix"] = babel["errepikatu"] = babel["r\u00E9p\u00E9ter"] = "loop";
  babel["controles"] = babel["controls"] = babel["kontrolak"] = babel["contr\u00F4les"] = babel["controis"] = "controls";
//  babel["c\u00F3digo"] = babel["<applet>"] = babel["</*applet*/>"] = babel["<applet>"] = babel["<applet>"] = babel["c\u00F3digo"] = babel["<applet>"] = babel["<applet>"] = "";
//  babel["Esta versi\u00F3n no permite editar."] = babel["Runtime only. No editing allowed."] = babel["Nom\u00E9s execuci\u00F3. Aquesta versi\u00F3 no permet l'edici\u00F3"] = babel["Bertsio honek ez du editatzen uzten."] = babel["Seulement ex\u00E9cution. Cette version ne permet pas l'\u00E9dition."] = babel["Esta versi\u00F3n non permite editar."] = babel["Somente para execu\u00E7\u00E3o. N\u00E3o \u00E9 poss\u00EDvel editar o c\u00F3digo."] = babel["Nom\u00E9s execuci\u00F3. Aquesta versi\u00F3 no permet l'edici\u00F3"] = "" ;
  babel["animar"] = babel["animate"] = babel["anima"] = babel["animatu"] = babel["animer"] = "animate";
//  babel["pausa"] = babel["pause"] = babel["pausa"] = babel["eten"] = babel["pause"] = babel["pausa"] = babel["pausa"] = babel["pausa"] = "";
  babel["auto"] = "auto";
  babel["alto"] = babel["height"] = babel["alt"] = babel["altu"] = babel["haut"] = babel["altura"] = "height";
  babel["x"] = babel["left"] = "x";
  babel["y"] = babel["top"] = "y";
  babel["espacio"] = babel["space"] = babel["espai"] = babel["espazio"] = babel["espace"] = babel["espazo"] = babel["espa\u00E7o"] = "space";
  babel["Nu"] = "Nu";
  babel["Nv"] = "Nv";
  babel["ancho"] = babel["depth"] = babel["amplada"] = babel["zabalera"] = babel["largeur"] = babel["ancho"] = babel["profundidade"] = babel["amplada"] = "width";
  babel["largo"] = babel["length"] = babel["llargada"] = babel["luzera"] = babel["longueur"] = babel["longo"] = babel["comprimento"] = babel["llargada"] = "length";
  babel["alto"] = babel["height"] = babel["al\u00E7ada"] = babel["altu"] = babel["hauteur"] = babel["alto"] = babel["altura"] = babel["al\u00E7ada"] = "height";
  babel["color_reverso"] = babel["backcolor"] = babel["color_revers"] = babel["atzealde kolorea"] = babel["couleur_revers"] = babel["cor_reverso"] = babel["cor_de_fundo"] = "backcolor";
  babel["aristas"] = babel["edges"] = babel["arestes"] = babel["ertzak"] = babel["ar\u00EAtes"] = babel["arestas"] = "edges";
  babel["rotini"] = babel["inirot"] = "inirot";
  babel["posini"] = babel["inipos"] = "inipos";
  babel["tri\u00E1ngulo"] = babel["triangle"] = babel["hirukia"] = babel["tri\u00E2ngulo"] = "triangle";
  babel["cara"] = babel["face"] = babel["aurpegi"] = "face";
  babel["polireg"] = babel["regpoly"] = babel["pol\u00EDgonoRegular"] = "polireg";
//  babel["Cubo"] = babel["Cube"] = babel["Cub"] = babel["Kubo"] = babel["Cube"] = babel["Cubo"] = babel["Cubo"] = babel["Cub"] = "";
//  babel["Paralelep\u00EDpedo"] = babel["Box"] = babel["Paral·lelep\u00EDpede"] = babel["Paralelepipedo"] = babel["Parall\u00E9l\u00E9pip\u00E8de"] = babel["Paralelep\u00EDpedo"] = babel["Paralelep\u00EDpedo"] = babel["Paral·lelep\u00EDpede"] = "";
//   babel["Cono"] = babel["Cone"] = babel["Con"] = babel["Kono"] = babel["C\u00F4ne"] = babel["Cono"] = babel["Cone"] = babel["Con"] = "";
//   babel["Cilindro"] = babel["Cylinder"] = babel["Cilindre"] = babel["Zilindro"] = babel["Cylindre"] = babel["Cilindro"] = babel["Cilindro"] = babel["Cilindre"] = "";
//   babel["Esfera"] = babel["Sphere"] = babel["Esfera"] = babel["Esfera"] = babel["Sph\u00E8re"] = babel["Esfera"] = babel["Esfera"] = babel["Esfera"] = "";
  babel["superficie"] = babel["surface"] = babel["superf\u00EDcie"] = babel["azalera"] = "surface";
//   babel["Tetraedro"] = babel["Tetrahedron"] = babel["Tetraedre"] = babel["Tetraedro"] = babel["T\u00E9tra\u00E8dre"] = babel["Tetraedro"] = babel["Tetraedro"] = babel["Tetraedre"] = "";
//   babel["Octaedro"] = babel["Octahedron="] = babel["Octaedre"] = babel["Oktaedro"] = babel["Octa\u00E8dre"] = babel["Octaedro"] = babel["Octaedro"] = babel["Octaedre"] = "";
//   babel["Dodecaedro"] = babel["Dodecahedron"] = babel["Dodecaedre"] = babel["Dodekaedro"] = babel["Dod\u00E9ca\u00E8dre"] = babel["Dodecaedro"] = babel["Dodecaedro"] = babel["Dodecaedre"] = "";
//   babel["Icosaedro"] = babel["Icosahedron"] = babel["Icosaedre"] = babel["Ikosaedro"] = babel["Icosa\u00E8dre"] = babel["Icosaedro"] = babel["Icosaedro"] = babel["Icosaedre"] = "";
//   babel["Elipsoide"] = babel["Ellipsoid"] = babel["El·lipsoide"] = babel["Elipsoide"] = babel["Ellipso\u00EFde"] = babel["Elipsoide"] = babel["Elips\u00F3ide"] = babel["El·lipsoide"] = "";
  babel["macro"] = babel["makro"] = "macro";
  babel["id"] = "id";
  babel["modelo"] = babel["model"] = babel["eredu"] = babel["mod\u00E8le"] = "model";
  babel["color"] = babel["kolore"] = babel["couleur"] = babel["cor"] = "color";

  babel["luz"] = babel["light"] = babel["llum"] = babel["argia"] = babel["lumi\u00E8re"] = "light";
  babel["metal"] = babel["metall"] = babel["m\u00E9tal"] = "metal";
  babel["alambre"] = babel["wire"] = babel["filferro"] = babel["alanbre"] = babel["fil de fer"] = babel["arame"] = "wire";

  babel["cortar"] = babel["split"] = babel["talla"] = babel["moztu"] = babel["couper"] = babel["dividir"] = "split";
  babel["despliegue"] = babel["render"] = babel["desplegament"] = babel["zabaltze"] = babel["d\u00E8ploiement"] = babel["despregamento"] = babel["processar"] = "render";
  babel["orden"] = babel["sort"] = babel["ordre"] = babel["ordena"] = babel["orde"] = babel["ordenar"] = "sort";
  babel["pintor"] = babel["painter"] = babel["margolari"] = babel["peintre"] = "painter";
  babel["trazado de rayos"] = babel["ray trace"] = babel["tra\u00E7at de raigs"] = babel["izpi trazadura"] = babel["trace de rayons"] = babel["trazado de raios"] = babel["tra\u00E7ado de raios"] = "raytrace";
  babel["imagen"] = babel["bg_image"] = babel["imatge"] = babel["irudia"] = babel["imaxe"] = babel["imagem_de_fundo"] = "image";
  babel["despl_imagen"] = babel["bg_display"] = babel["despl_imatge"] = babel["irudi desplazamendu"] = babel["despl_image"] = babel["despr_imaxe"] = babel["apresenta\u00E7\u00E3o_de_imagem"] = "bg_display";
  babel["arr-izq"] = babel["topleft"] = babel["dalt-esq"] = babel["goi-ezk"] = babel["au-dessus-gau"] = babel["arr-esq"] = babel["acima-esquerda"] = "topleft";
  babel["expand."] = babel["stretch"] = babel["hedatu"] = babel["expandir "] = "stretch";
  babel["mosaico"] = babel["patch"] = babel["mosaic"] = babel["mosaiko"] = babel["mosa\u00EFque"] = "patch";
  babel["centrada"] = babel["center"] = babel["zentratu"] = babel["centr\u00E9e"] = babel["centrado"] = "center";
  babel["archivo"] = babel["file"] = babel["fitxer"] = babel["artxibo"] = babel["fichier"] = babel["arquivo"] = "file";
//   babel["loc"] = babel["loc"] = babel["lloc"] = babel["lok"] = babel["lieu"] = babel["loc"] = babel["loc"] = babel["lloc"] = "";
//   babel["rot"] = babel["rot"] = babel["gir"] = babel["rot"] = babel["tour"] = babel["rot"] = babel["rot"] = babel["gir"] = "";
//   babel["macro"] = babel["macro"] = babel["macro"] = babel["makro"] = babel["macro"] = babel["macro"] = babel["macro"] = babel["macro"] = "";
//   babel["tipo_de_macro"] = babel["macro_type"] = babel["tipus_de_macro"] = babel["makro_mota"] = babel["type_de_macro"] = babel["tipo_de_macro"] = babel["tipo_de_macro"] = babel["tipus_de_macro"] = "";
//   babel["Poniendo este texto en un archivo <nombre> en el subdirectorio macros/g2d/ se crea la macro <nombre>"] = babel["Puting this text in a file <name> in subdirectory macros/g2d/ creates the macro <name>"] = babel["Posant aquest text en un fitxer <nom> en el subdirectori macros/g2d/ es crea la macro <nom>"] = babel["Artxibo batean testu hau jarriz <izena> macros/g2d/ izeneko azpidirektorioan"] = babel["En mettant ce texte dans un fichier <nom> dans le sous-r\u00E9pertoire macros/g2d/ la macro <nom> est cr\u00E9e "] = babel["Po\u00F1endo este texto nun arquivo <nombre> no subdirectorio macros/g2d/ cr\u00E9ase a macro <nombre>"] = babel["Colocando este texto num arquivo <nome> no subdiret\u00F3rio macros/g2d/ voc\u00EA criar\u00E1 a macro <nome>"] = babel["Posant aquest text en un fitxer <nom> en el subdirectori macros/g2d/ es crea la macro <nom>"] = "";
//   babel["codigo HTML"] = babel["HTML encoding"] = babel["codi HTML"] = babel[" <izena>duen makroa sortzen da"] = babel["code HTML"] = babel["c\u00F3digo HTML"] = babel["codigo HTML"] = babel["codi HTML"] = "";
  babel["filas_norte"] = babel["rows_north"] = babel["files_nord"] = babel["HTML kodea"] = babel["files_nord"] = babel["filas_norte"] = babel["linhas_norte"] = babel["files_nord"] = "rowsNorth";
  babel["filas_sur"] = babel["rows_south"] = babel["files_sud"] = babel["ipar_lerro"] = babel["files_sud"] = babel["filas_sur"] = babel["linhas_sul"] = babel["files_sud"] = "rowsSouth";
  babel["ancho_este"] = babel["width_east"] = babel["ample_est"] = babel["hego_lerro"] = babel["ample_est"] = babel["ancho_leste"] = babel["largura_leste"] = babel["ample_est"] = "widthEast";
  babel["ancho_oeste"] = babel["width_west"] = babel["ample_oest"] = babel["ekialde_zabalera"] = babel["ample_ouest"] = babel["ancho_oeste"] = babel["largura_oeste"] = babel["ample_oest"] = "widthWest";
  babel["fijo"] = babel["fixed"] = babel["fix"] = babel["hegoalde_zabalera"] = babel["fixe"] = babel["fixo"] = "fixed";
  babel["Reiniciar Animaci\u00F3n"] = babel["Init Animation"] = babel["Reinicia Animaci\u00F3"] = babel["finko"] = babel["Recommencer l'Animation"] = babel["Reiniciar Anima\u00E7\u00E3o"] = "initAnimation";
//   babel["emergente"] = babel["pop"] = babel["emergent"] = babel["Animazioa bberrabiatu"] = babel["\u00E9mergent"] = babel["emerxente"] = babel["pop"] = babel["emergent"] = "";
//   babel[" "] = babel[" "] = babel[" "] = babel["azaleratzaile"] = babel[" "] = babel["00:"] = babel["  "] = babel[" "] = "";
//   babel["="] = babel["="] = babel["="] = babel["="] = babel["="] = babel["="] = babel["="] = babel["="] = "";
  babel["Explicaci\u00F3n"] = babel["Explanation"] = babel["Azalpena"] = babel["Explication"] = babel["Explica\u00E7\u00E3o"] = babel["Explicaci\u00F3"] = "Explanation";
//   babel["gr\u00E1ficos 3D"] = babel["graphics 3D"] = babel["gr\u00E0fics 3D"] = babel["3d grafikoak"] = babel["graphiques 3D"] = babel["gr\u00E1ficos 3D"] = babel["gr\u00E1ficos 3D"] = babel["gr\u00E0fics 3D"] = "";
//   babel["?"] = babel["?"] = babel["?"] = babel["?"] = babel["?"] = babel["?"] = babel["?"] = babel["?"] = "";
  babel["tooltip"] = babel["dica"] = "tooltip";
//   babel["clic derecho"] = babel["right click"] = babel["clic dret"] = babel["lik eskuina"] = babel["clic droit"] = babel["clic dereito"] = babel["clique com o bot\u00E3o direito"] = babel["clic dret"] = "";
  babel["discreto"] = babel["discrete"] = babel["discret"] = babel["diskretu"] = "discrete";
  babel["interfaz"] = babel["gui"] = babel["interf\u00EDcie"] = babel["interfaze"] = babel["interface"] = "gui";
  babel["pulsador"] = babel["spinner"] = babel["polsador"] = babel["pultsadore"] = babel["bouton"] = "spinner";
  babel["campo de texto"] = babel["textfield"] = babel["camp de text"] = babel["testu esarrua"] = babel["champ de texte"] = "textfield";
  babel["men\u00FA"] = babel["choice"] = babel["menu"] = babel["escolha"] = "menu";
  babel["barra"] = babel["scrollbar"] = babel["barre"] = "scrollbar";
  babel["opciones"] = babel["options"] = babel["opcions"] = babel["aukerak"] = babel["opci\u00F3ns"] = babel["op\u00E7\u00F5es"] = "options";
  babel["interior"] = babel["barruko"] = babel["int\u00E9rieur"] = "interior";
  babel["condici\u00F3n"] = babel["condition"] = babel["condici\u00F3"] = babel["baldintza"] = babel["condi\u00E7\u00E3o"] = "condition";
  babel["acci\u00F3n"] = babel["action"] = babel["acci\u00F3"] = babel["ekintza"] = babel["a\u00E7\u00E3o"] = "action";
  babel["evento"] = babel["event"] = babel["esdeveniment"] = babel["gertaera"] = babel["\u00E9v\u00E9nement"] = "event";
  babel["abrir URL"] = babel["open URL"] = babel["obre URL"] = babel["URL zabaldu"] = babel["ouvrir URL"] = "openURL";
  babel["abrir Escena"] = babel["open Scene"] = babel["obre Escena"] = babel["eszena zabaldu"] = babel["ouvrir Escena"] = babel["abrir Cena"] = "openScene";
  babel["bot\u00F3n"] = babel["button"] = babel["bot\u00F3"] = babel["botoi"] = babel["bouton"] = babel["bot\u00E3o"] = "button";
  babel["mensaje"] = babel["message"] = babel["mezua"] = babel["mensaxe"] = babel["mensagem"] = babel["missatge"] = "message";
  babel["alternar"] = babel["alternate"] = babel["alterna"] = babel["txandakatu"] = babel["alterner"] = "alternate";
  babel["ejecuci\u00F3n"] = babel["execution"] = babel["execuci\u00F3"] = babel["gauzatze"] = babel["ex\u00E9cution"] = babel["execuci\u00F3n"] = babel["execu\u00E7\u00E3o"] = "execution";
  babel["calcular"] = babel["calculate"] = babel["calcula"] = babel["kalkulatu"] = babel["calculer"] = "calculate";
//   babel["s\u00EDmbolo"] = babel["symbol"] = babel["s\u00EDmbol"] = babel["sinbolo"] = babel["symbole"] = babel["s\u00EDmbolo"] = babel["s\u00EDmbolo"] = babel["s\u00EDmbol"] = "";
//   babel["UNIDAD"] = babel["UNIT"] = babel["UNITAT"] = babel["UNITATE"] = babel["UNIT\u00C9"] = babel["UNIDADE"] = babel["UNIDADE"] = babel["UNITAT"] = "";
//   babel["CURSO"] = babel["COURSE"] = babel["CURS"] = babel["IKASTAROA"] = babel["COURS"] = babel["CURSO"] = babel["CURSO"] = babel["CURS"] = "";
//   babel["animado"] = babel["animated"] = babel["animat"] = babel["animatu"] = babel["anim\u00E9"] = babel["animado"] = babel["animado"] = babel["animat"] = "";
//   babel["frecuencia"] = babel["frequency"] = babel["freq\u00FC\u00E8ncia"] = babel["maiztasun"] = babel["fr\u00E9quence"] = babel["frecuencia"] = babel["freq\u00FC\u00EAncia"] = babel["freq\u00FC\u00E8ncia"] = "";
  babel["coord_abs"] = babel["abs_coord"] = babel["koor_abs"] = "abs_coord";
//   babel["Editor de F\u00F3rmulas"] = babel["Formula Editor"] = babel["Editor de F\u00F2rmules"] = babel["Formula-editore"] = babel["\u00C9diteur de Formules"] = babel["Editor de F\u00F3rmulas"] = babel["Editor de F\u00F3rmulas"] = babel["Editor de F\u00F2rmules"] = "";
//   babel["Editor de Textos"] = babel["Text Editor"] = babel["Editor de Textos"] = babel["Testu-editore"] = babel["\u00C9diteur de Textes"] = babel["Editor de Textos"] = babel["Editor de Textos"] = babel["Editor de Textos"] = "";
//   babel["s\u00EDmbolos"] = babel["symbols"] = babel["s\u00EDmbols"] = babel["sinboloak"] = babel["symboles"] = babel["s\u00EDmbolos"] = babel["s\u00EDmbolos"] = babel["s\u00EDmbols"] = "";
//   babel["fracci\u00F3n"] = babel["fraction"] = babel["fracci\u00F3"] = babel["zatiki"] = babel["fraction"] = babel["fracci\u00F3n"] = babel["fra\u00E7\u00E3o"] = babel["fracci\u00F3"] = "";
//   babel["ra\u00EDz cuadrada"] = babel["square Root"] = babel["arrel quadrada"] = babel["erro karratu"] = babel["racine carr\u00E9e"] = babel["ra\u00EDz cadrada"] = babel["raiz quadrada"] = babel["arrel quadrada"] = "";
//   babel["sub\u00EDndice"] = babel["subindex"] = babel["sub\u00EDndex"] = babel["azpi-indize"] = babel["subindice"] = babel["sub\u00EDndice"] = babel["sub\u00EDndice"] = babel["sub\u00EDndex"] = "";
//   babel["super\u00EDndice"] = babel["superindex"] = babel["super\u00EDndex"] = babel["goi-indize"] = babel["superindice"] = babel["super\u00EDndice"] = babel["super\u00EDndice"] = babel["super\u00EDndex"] = "";
//   babel["editar"] = babel["edit"] = babel["edita"] = babel["editatu"] = babel["\u00E9diter"] = babel["editar"] = babel["editar"] = babel["edita"] = "";
//   babel["mostrar"] = babel["show"] = babel["mostra"] = babel["erakutsi"] = babel["montrer"] = babel["mostrar"] = babel["exibir"] = babel["mostra"] = "";
  babel["negrita"] = babel["bold"] = babel["negreta"] = babel["lodi"] = babel["caract\u00E8re gras"] = babel["negra"] = babel["negrito"] = "bold";
  babel["cursiva"] = babel["italics"] = babel["etzana"] = babel["italique"] = babel["it\u00E1lico"] = "italics";
  babel["subrayada"] = babel["underlined"] = babel["subratllat"] = babel["azpimarratua"] = babel["soulignement"] = babel["subli\u00F1ada"] = babel["sublinhado"] = "underlined";
//   babel["super-rayada"] = babel["overlined"] = babel["sobreratllat"] = babel["goimarratua"] = babel["surrayure"] = babel["super-raiada"] = babel["linha-superior"] = babel["sobreratllat"] = "";
//   babel["f\u00F3rmula"] = babel["formula"] = babel["f\u00F3rmula"] = babel["formula"] = babel["formule"] = babel["f\u00F3rmula"] = babel["f\u00F3rmula"] = babel["f\u00F3rmula"] = "";
//   babel["Lat\u00EDno b\u00E1sico"] = babel["Basic Latin"] = babel["Llat\u00ED b\u00E0sic"] = babel["Oinarrizko Latindarra"] = babel["Latin basique"] = babel["Lat\u00EDn b\u00E1sico"] = babel["Latim B\u00E1sico"] = babel["Llat\u00ED b\u00E0sic"] = "";
//   babel["Latino "] = babel["Latin "] = babel["Llat\u00ED 1"] = babel["Latindar "] = babel["Latin 1"] = babel["Latin "] = babel["Latim 1"] = babel["Llat\u00ED "] = "";
//   babel["Latino extendido A"] = babel["Latin Extended A"] = babel["Llat\u00ED est\u00E8s A"] = babel["Latindar zabaldua A"] = babel["Latin r\u00E9pandu A"] = babel["Latin extendido A"] = babel["Latim estendido A"] = babel["Llat\u00ED est\u00E8s A"] = "";
//   babel["Latino extendido B"] = babel["Latin Extended B"] = babel["Llat\u00ED est\u00E8s B"] = babel["Latindar zabaldua B"] = babel["Llat\u00ED r\u00E9pandu B"] = babel["Latin extendido B"] = babel["Latim estendido B"] = babel["Llat\u00ED est\u00E8s B"] = "";
//   babel["Griego b\u00E1sico"] = babel["Basic Greek"] = babel["Grec b\u00E0sic"] = babel["Oinarrizko Grekera"] = babel["Grec basique"] = babel["Grego b\u00E1sico"] = babel["Grego B\u00E1sico"] = babel["Grec b\u00E0sic"] = "";
//   babel["Cir\u00EDlico"] = babel["Cyrillic"] = babel["Cir\u00EDl·lic"] = babel["Ziriliko"] = babel["Cyrillique"] = babel["Cir\u00EDlico"] = babel["Cir\u00EDlico"] = babel["Cir\u00EDl·lic"] = "";
//   babel["Hebreo b\u00E1sico"] = babel["Basic Hebrew"] = babel["Hebreu b\u00E0sic"] = babel["Oinarrizko Hebrear"] = babel["H\u00E9breu basique"] = babel["Hebreo b\u00E1sico"] = babel["Hebreu B\u00E1sico"] = babel["Hebreu b\u00E0sic"] = "";
//   babel["\u00C1rabe b\u00E1sico"] = babel["Basic Arab"] = babel["\u00C0rab b\u00E0sic"] = babel["Oinarrizko Arabiarra"] = babel["Arabe basique"] = babel["\u00C1rabe b\u00E1sico"] = babel["\u00C1rabe B\u00E1sico"] = babel["\u00C0rab b\u00E0sic"] = "";
//   babel["Puntuaci\u00F3n general"] = babel["General Punctuation"] = babel["Puntuaci\u00F3 general"] = babel["Puntuazio orokorra"] = babel["Ponctuation g\u00E9n\u00E9rale"] = babel["Puntuaci\u00F3n xeral"] = babel["Pontua\u00E7\u00E3o Geral"] = babel["Puntuaci\u00F3 general"] = "";
//   babel["S\u00EDmbolos de moneda"] = babel["Currency Symbols"] = babel["S\u00EDmbols de moneda"] = babel["Txanpon sinboloak"] = babel["Symboles de monnaie"] = babel["S\u00EDmbolos de moeda"] = babel["S\u00EDmbolos Monet\u00E1rios"] = babel["S\u00EDmbols de moneda"] = "";
//   babel["S\u00EDmbolos tipo carta"] = babel["Letterlike Symbols"] = babel["S\u00EDmbols tipus carta"] = babel["karta motako sinboloak"] = babel["Symboles types lettre"] = babel["S\u00EDmbolos tipo carta"] = babel["S\u00EDmbolos Tipo Carta"] = babel["S\u00EDmbols tipus carta"] = "";
//   babel["Formatos de n\u00FAmeros"] = babel["Number Forms"] = babel["Formats de n\u00FAmeros"] = babel["Zenbaki formatua"] = babel["Form\u00E9s de num\u00E9ros"] = babel["Formatos de n\u00FAmeros"] = babel["Formatos de N\u00FAmeros"] = babel["Formats de n\u00FAmeros"] = "";
//   babel["Operadores matem\u00E1ticos"] = babel["Mathematical Operators"] = babel["Operadors matem\u00E0tics"] = babel["Eragile matematikoak"] = babel["Op\u00E9rateurs math\u00E9matiques"] = babel["Operadores matem\u00E1ticos"] = babel["Operadores Matem\u00E1ticos"] = babel["Operadors matem\u00E0tics"] = "";
//   babel["Bordes de cuadros"] = babel["Box Drawing"] = babel["Vores de quadres"] = babel["Koadro ertzak"] = babel["Bord de carr\u00E9s"] = babel["Bordes de cadros"] = babel["Bordas"] = babel["Vores de quadres"] = "";
//   babel["Elementos de bloque"] = babel["Block Elements"] = babel["Elements de bloc"] = babel["Blokearen elementuak"] = babel["\u00C9l\u00E9ments de bloc"] = babel["Elementos de bloque"] = babel["Elementos de Blocos"] = babel["Elements de bloc"] = "";
//   babel["S\u00EDmbolos variados"] = babel["Miscelaneous Symbols"] = babel["S\u00EDmbols variats"] = babel["Askotariko sinboloak"] = babel["Symboles vari\u00E9s"] = babel["S\u00EDmbolos variados"] = babel["S\u00EDmbolos Diversos"] = babel["S\u00EDmbols variats"] = "";
//   babel["Alfabetos Unicode"] = babel["Unicode Alphabets"] = babel["Alfabets Unicode"] = babel["Unicode alfabetoa"] = babel["Alphabets Unicode"] = babel["Alfabetos Unicode"] = babel["Alfabetos Unicode"] = babel["Alfabets Unicode"] = "";
//   babel["Base Unicode"] = babel["Unicode Base"] = babel["Base Unicode"] = babel["Unicode oina"] = babel["Base Unicode"] = babel["Base Unicode"] = babel["Unicode Base"] = babel["Base Unicode"] = "";
  babel["imagen"] = babel["image"] = babel["imatge"] = babel["irundia"] = babel["imaxe"] = babel["imagem"] = "image";
//   babel["Doc"] = babel["Doc"] = babel["Doc"] = babel["Dok"] = babel["Doc"] = babel["Doc"] = babel["Doc"] = babel["Doc"] = "";
//   babel["Aux"] = babel["Aux"] = babel["Aux"] = babel["lagunt"] = babel["Aux"] = babel["Aux"] = babel["Aux"] = babel["Aux"] = "";
//   babel["clic"] = babel["click"] = babel["clic"] = babel["klik"] = babel["clic"] = babel["clic"] = babel["clique"] = babel["clic"] = "";
  babel["pos_mensajes"] = babel["msg_pos"] = babel["pos_missatges"] = babel["mezuen_pos"] = babel["pos_messages"] = babel["pos_mensaxes"] = "msg_pos";
//   babel["arr_izq"] = babel["top_left"] = babel["dalt_esq"] = babel["goi_ezk"] = babel["au-dessus_gauche"] = babel["arr_esq"] = babel["acima_esquerda"] = babel["dalt_esq"] = "";
//   babel["arriba"] = babel["top_center"] = babel["dalt"] = babel["goian"] = babel["au-dessus"] = babel["arriba"] = babel["acima_centro"] = babel["dalt"] = "";
//   babel["arr_der"] = babel["top_right"] = babel["dalt_dreta"] = babel["goi_eskuin"] = babel["au-dessus_droite"] = babel["arr_der"] = babel["acima_direita"] = babel["dalt_dreta"] = "";
  babel["izquierda"] = babel["left"] = babel["esquerra"] = babel["eskerrean"] = babel["gauche"] = babel["esquerda"] = babel["esquerda"] = babel["esquerra"] = "left";
  babel["derecha"] = babel["right"] = babel["dreta"] = babel["eskuinan"] = babel["droite"] = babel["dereita"] = babel["direita"] = babel["dreta"] = "right";
//   babel["ab_izq"] = babel["bottom_left"] = babel["avall_esq"] = babel["Behe_ezk"] = babel["en bas_gauche"] = babel["ab_esq"] = babel["abaixo_esquerda"] = babel["avall_esq"] = "";
//   babel["abajo"] = babel["bottom"] = babel["avall"] = babel["behean"] = babel["en bas"] = babel["abaixo"] = babel["abaixo"] = babel["avall"] = "";
//   babel["ab_der"] = babel["bottom_right"] = babel["avall_dreta"] = babel["behe_eskuin"] = babel["en bas_droite"] = babel["ab_der"] = babel["abaixo_direita"] = babel["avall_dreta"] = "";
//   babel["img"] = babel["img"] = babel["img"] = babel["irud"] = babel["img"] = babel["img"] = babel["img"] = babel["img"] = "";
  babel["sensible_a_los_movimientos_del_rat\u00F3n"] = babel["sensitive_to_mouse_movements"] = babel["sensible_als_moviments_del_ratol\u00ED"] = babel["xagu mugimenduarekiko sentikorra"] = babel["sensible_aux_mouvements_du_souris"] = babel["sensible_aos_movementos_do_rato"] = babel["sens\u00EDvel_aos_movimentos_do_mouse"] = "sensitive_to_mouse_movements";
  babel["reproducir"] = babel["play"] = babel["reprodueix"] = babel["erreproduzitu"] = babel["reproduire"] = babel["reproduzir"] = "playAudio";
//   babel["infoind"] = babel["indinfo"] = babel["infoind"] = babel["baninf"] = babel["infoind"] = babel["infoind"] = babel["infoind"] = babel["infoind"] = "";
//   babel["infoest"] = babel["statinfo"] = babel["infoest"] = babel["estinf"] = babel["infoest"] = babel["infoest"] = babel["infoest"] = babel["infoest"] = "";
  babel["activo-si"] = babel["active-if"] = babel["actiu-si"] = babel["altiboa-baldin"] = babel["actif-si"] = babel["activo-se"] = babel["ativo-se"] = "activeif";
  babel["rotfin"] = babel["finrot"] = babel["bukrot"] = "endrot";
  babel["posfin"] = babel["finpos"] = babel["bukpos"] = "endpos";
  babel["editable"] = babel["editagarria"] = babel["edit\u00E1vel"] = "editable";
//   babel["camposMixtos"] = babel["mixedTF"] = babel["CampsMixtes"] = babel["esparruMistoa"] = babel["ChampsMixtes"] = babel["camposMixtos"] = babel["camposMixtos"] = babel["CampsMixtes"] = "";
//   babel["sonido"] = babel["sound"] = babel["so"] = babel["soinu"] = babel["son"] = babel["son"] = babel["som"] = babel["so"] = "";
//   babel["\u00E1lgebra"] = babel["algebra"] = babel["\u00E0lgebra"] = babel["aljebra"] = babel["alg\u00E8bre"] = babel["\u00E1lxebra"] = babel["\u00E1lgebra"] = babel["\u00E0lgebra"] = "";
//   babel["RAD"] = babel["RAD"] = babel["RAD"] = babel["RAD"] = babel["RAD"] = babel["RAD"] = babel["RAD"] = babel["RAD"] = "";
  babel["tipo"] = babel["type"] = babel["tipus"] = babel["mota"] = "type";
  babel["R2"] = "R2";
  babel["R3"] = "R3";
//   babel["TA"] = babel["TA"] = babel["TA"] = babel["TA"] = babel["TA"] = babel["TA"] = babel["TA"] = babel["TA"] = "";
//   babel["TX"] = babel["TX"] = babel["TX"] = babel["TX"] = babel["TX"] = babel["TX"] = babel["TX"] = babel["TX"] = "";
//   babel["D"] = babel["D"] = babel["D3"] = babel["D"] = babel["D3"] = babel["D"] = babel["D3"] = babel["D"] = "";
  babel["vectores"] = babel["bektoreak"] = babel["vecteurs"] = babel["vetores"] = babel["vectors"] = "vectors";
//   babel["fuente tipo"] = babel["font type"] = babel["font tipus"] = babel["iturri mota"] = babel["source type"] = babel["fonte tipo"] = babel["tipo de fonte"] = babel["font tipus"] = "";
  babel["fuente puntos"] = babel["font size"] = babel["font punts"] = babel["puntu iturria"] = babel["source points"] = babel["fonte puntos"] = babel["fonte pontos"] = "font_size";
  babel["SansSerif"] = "SansSerif";
  babel["Serif"] = "Serif";
  babel["Monoespaciada"] = babel["Monospaced"] = babel["Monoespazada"] = "Monospaced";
//   babel["\u00E1rbol"] = babel["tree"] = babel["arbre"] = babel["zuhitz"] = babel["arbre"] = babel["\u00E1rbore"] = babel["\u00E1rvore"] = babel["arbre"] = "";
//   babel["sensible"] = babel["sensible"] = babel["sensible"] = babel["sentikor"] = babel["sensible"] = babel["sensible"] = babel["sens\u00EDvel"] = babel["sensible"] = "";
//   babel["paso de l\u00EDnea"] = babel["step size"] = babel["pas de l\u00EDnia"] = babel["lerro igarotze"] = babel["pas de ligne"] = babel["paso de li\u00F1a"] = babel["passo de linha"] = babel["pas de l\u00EDnia"] = "";
//   babel["s\u00EDmbolo de multiplicaci\u00F3n"] = babel["multiplication symbol"] = babel["s\u00EDmbol del producte"] = babel["biderketa sinboloa"] = babel["symbole du produit"] = babel["s\u00EDmbolo de multiplicaci\u00F3n"] = babel["s\u00EDmbolo de multiplica\u00E7\u00E3o"] = babel["s\u00EDmbol del producte"] = "";
//   babel["par\u00E9ntesis siempre"] = babel["parenthesis always"] = babel["par\u00E8ntesis sempre"] = babel["beti parentesia"] = babel["par\u00E8nth\u00E8ses toujours"] = babel["par\u00E9ntese sempre"] = babel["par\u00E9ntesis sempre"] = babel["par\u00E8ntesis sempre"] = "";
//   babel["modo"] = babel["mode"] = babel["model"] = babel["modu"] = babel["mod\u00E8le"] = babel["modo"] = babel["modo"] = babel["model"] = "";
//   babel["autom\u00E1tico"] = babel["automatic"] = babel["autom\u00E0tic"] = babel["autom\u00E1tiko"] = babel["automatique"] = babel["autom\u00E1tico"] = babel["autom\u00E1tico"] = babel["autom\u00E0tic"] = "";
//   babel["clic y arrastre"] = babel["click and drag"] = babel["clica i arrossega"] = babel["klik eta arrastatu"] = babel["cliquer et tr\u00E2iner"] = babel["clic e arrastre"] = babel["clique e arraste"] = babel["clica i arrossega"] = "";
//   babel["clic y escribir"] = babel["click and write"] = babel["clica i y escriu"] = babel["klik eta idatzi"] = babel["cliquer et \u00E9crire"] = babel["clic e escribir"] = babel["clique e escrever"] = babel["clica i y escriu"] = "";
//   babel["escribir"] = babel["write"] = babel["escriu"] = babel["idatzi"] = babel["\u00E9crire"] = babel["escribir"] = babel["escrever"] = babel["escriu"] = "";
//   babel["guiado"] = babel["guided"] = babel["guiat"] = babel["gidatua"] = babel["guid\u00E9"] = babel["guiado"] = babel["guiado"] = babel["guiat"] = "";
  babel["ecuaci\u00F3n"] = babel["equation"] = babel["equaci\u00F3"] = babel["ekuazio"] = babel["\u00E9quation"] = babel["equa\u00E7\u00E3o"] = "equation";
//   babel["ejercicios"] = babel["exercises"] = babel["exercicis"] = babel["ariketak"] = babel["exercices"] = babel["exercicios"] = babel["exerc\u00EDcios"] = babel["exercicis"] = "";
  babel["punto"] = babel["dot"] = babel["punt"] = babel["puntu"] = babel["point"] = babel["ponto"] = "point";
//   babel["aspas"] = babel["cross"] = babel["aspes"] = babel["gurutzeak"] = babel["ailes"] = babel["aspas"] = babel["aspas"] = babel["aspes"] = "";
  babel["escenario"] = babel["scenario"] = babel["escenari"] = babel["agertoki"] = babel["sc\u00E8ne"] = babel["cen\u00E1rio"] = "scenario";
  babel["cID"] = "cID";
  babel["matriz"] = babel["matrix"] = babel["matriu"] = babel["matrice"] = "matrix";
  babel["filas"] = babel["rows"] = babel["files"] = "rows";
  babel["columnas"] = babel["columns"] = babel["colonnes"] = "columns";
  babel["solo_texto"] = babel["only_text"] = babel["seulement_texte"] = babel["s\u00F3_texto"] = babel["tan_sols_texte"] = "onlyText";
  babel["evaluar"] = babel["evaluate"] = "evaluate";
  babel["respuesta"] = babel["answer"] = "answer";
//   babel["peso"] = babel["weight"] = babel["pes"] = babel["peso"] = babel["peso"] = babel["peso"] = babel["peso"] = babel["pes"] = "";
  babel["decimal_symbol"] = babel["signo decimal"] = babel["decimal symbol"] = "decimal_symbol";
  babel["info"] = "info";
//   babel["No se encuentra"] = babel["Not Found"] = babel["No es troba"] = babel["Ez da aurkitzen"] = babel["Il ne se trouve pas"] = babel["Non se atopa"] = babel["N\u00E3o Encontrado"] = babel["No es troba"] = "";
  
  ////////////////////////
  //  opciones nuevas   //
//   babel["borde"] = babel["border"] = babel["contour"] = "border";
  babel["color_contorn_text"] = babel["color_text_border"] = babel["color_borde_texto"] = babel["muga_testuaren_kolorea"] = babel["couleur_contour_texte"] = babel["cor_borde_texto"] = babel["colore_bordo_testo"] = babel["cor_borda_texto"] = babel["color_contorn_text"] = "border";
  babel["video"] = babel["vid\u00e9o"] = "video";
  babel["audio"] = babel["\u00e0udio"] = "audio"; 
  babel["autoplay"] = "autoplay";
  babel["loop"] = "loop";
  babel["poster"] = "poster";
  babel["opacidad"] = babel["opacity"] = babel["opacit\u00E9"] = babel["opacitat"] = babel["opacidade"] = "opacity";
  babel["alinear"] = babel["align"] = babel["ali\u00F1ar"] = babel["aligner"] = "align";
  babel["malla"] = babel["mesh"] = "mesh";
  ////////////////////////
  
  return babel;
})(babel || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un vector en R2
   * @constructor 
   * @param {x} componente x del vector
   * @param {y} componente y del vector
   */
  descartesJS.Vector2D = function(x, y) {
    this.x = x;
    this.y = y;
  }
  
  /**
   * Vector correspondiente al eje X
   * @const
   * @type {Vector2D}
   */ 
  descartesJS.Vector2D.AXIS_X = new descartesJS.Vector2D(1, 0);;

  /**
   * Vector correspondiente al eje Y
   * @const
   * @type {Vector2D}
   */ 
  descartesJS.Vector2D.AXIS_Y = new descartesJS.Vector2D(0, 1);

  /**
   * Se calcula la longitud del vector
   * @return {Number} la longitud del vector
   */
  descartesJS.Vector2D.prototype.vectorLength = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
  
  /**
   * Se calcula el producto punto entre dos vectores
   * @param {Vector2D} el segundo vector para calcular el producto punto
   * @return {Number} el producto punto entre dos vectores
   */
  descartesJS.Vector2D.prototype.dotProduct = function(v) {
    return this.x*v.x + this.y*v.y;
  }
  
  /**
   * Se calcula el angulo entre dos vectores
   * @param {Vector2D} el segundo vector para calcular el angulo
   * @return {Number} el angulo entre dos vectores
   */
  descartesJS.Vector2D.prototype.angleBetweenVectors = function(v) {
    return Math.acos(this.dotProduct(v)/(this.vectorLength()*v.vectorLength()));
  }

  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una aplicacion de descartes (i.e. javascript)
   * @constructor 
   * @param {<applet>} applet es el applet que se va a reemplazar
   */
  descartesJS.DescartesApp = function(applet) {
    /**
     * Codigo de la aplicacion de descartes
     * @type {String}
     * @private
     */
    this.applet = applet;
    
    this.externalVariables = {}

    /**
     * Contenedor del applet java de descartes
     * @type {<HTMLelement>}
     * @private 
     */
    this.parentContainer = applet.parentNode;
    
    /**
     * El ancho del applet
     * @type {String}
     * @private 
     */
    this.width = applet.getAttribute("width");

    /**
     * El alto del applet
     * @type {String}
     * @private 
     */
    this.height = applet.getAttribute("height");

    /**
     * Simbolo decimal
     * @type {String}
     * @private
     */
    this.decimal_symbol = "."

    /**
     * Los paramentros del applet
     * type {[<param>]}
     * @private
     */
    this.childs = applet.getElementsByTagName("param");
    
    /**
     * 
     */
    this.code = applet.getAttribute("code");

    /**
     * El estado de las variables que se le asigno por medio de codigo javascript
     */
    this.saveState = [];
    
    /**
     * Las imagenes del applet
     * type {[Image]}
     * @private
     */
    this.images = {};
    
    /**
     * El numero de imagenes del applet
     * type {Number}
     * @private 
     */
    this.images.length = -1;
    
    /**
     * Los audios del applet
     * type {[Audio]}
     * @private
     */
    this.audios = {};
    
    /**
     * El numero de audios del applet
     * type {Number}
     * @private 
     */
    this.audios.length = -1;
    
    /**
     * Objeto para el parseo y evaluacion de expresiones
     * type {Evaluator}
     * @private
     */
    this.evaluator = new descartesJS.Evaluator(this);
   
    /**
     * Objeto para parsear los objetos de la leccion de descartes
     * @type {LessonParser}
     * @private
     */
    this.lessonParser = new descartesJS.LessonParser(this);

    /**
     * Variable que indica si es la primera vez que se interpreta el applet
     * Sirve para que la funcion init ejecute el loader o no
     * type {Boolean}
     * @private
     */
    this.firstRun = true;
    
    this.arquimedes = this.code.match("descinst.DescartesWeb2_0.class");

    this.licenseW2 = "{\\rtf1\\uc0{\\fonttbl\\f0\\fcharset0 Arial;\\f1\\fcharset0 Arial;\\f2\\fcharset0 Arial;\\f3\\fcharset0 Arial;\\f4\\fcharset0 Arial;}"+
                     "{\\f0\\fs34 __________________________________________________________________________________ \\par \\fs22 "+
                     "                                       Los contenidos de esta unidad didáctica interactiva están bajo una  {\\*\\hyperlink licencia Creative Commons|http://creativecommons.org/licenses/by-nc-sa/2.5/es/}, si no se indica lo contrario.\\par "+
                     "                                       La unidad didáctica fue creada con DescartesWeb2.0, que es un producto de código abierto del  {\\*\\hyperlink Ministerio de Educación de España|http://recursostic.educacion.es/descartes/web/DescartesWeb2.0/} y\\par "+
                     "                                       el {\\*\\hyperlink Instituto de Matemáticas|http://arquimedes.matem.unam.mx/} de la Universidad Nacional Autónoma de México, cedido bajo licencia {\\*\\hyperlink EUPL v 1.1|/resources/eupl_v1.1es.pdf}, con {\\*\\hyperlink código en Java|http://recursostic.educacion.es/descartes/web/source/}."+
                     "}";

    this.licenseA = "{\\rtf1\\uc0{\\fonttbl\\f0\\fcharset0 Arial;\\f1\\fcharset0 Arial;\\f2\\fcharset0 Arial;\\f3\\fcharset0 Arial;\\f4\\fcharset0 Arial;}"+
                    "{\\f0\\fs34 __________________________________________________________________________________ \\par \\fs22 "+
                    "                                       Los contenidos de esta unidad didáctica interactiva están bajo una  {\\*\\hyperlink licencia Creative Commons|http://creativecommons.org/licenses/by-nc-sa/2.5/es/}, si no se indica lo contrario.\\par "+
                    "                                       La unidad didáctica fue creada con Arquímedes, que es un producto de código abierto del  {\\*\\hyperlink Ministerio de Educación de España|http://recursostic.educacion.es/descartes/web/DescartesWeb2.0/} y\\par "+
                    "                                       el {\\*\\hyperlink Instituto de Matemáticas|http://arquimedes.matem.unam.mx/} de la Universidad Nacional Autónoma de México, cedido bajo licencia {\\*\\hyperlink EUPL v 1.1|/resources/eupl_v1.1es.pdf}, con {\\*\\hyperlink código en Java|http://recursostic.educacion.es/descartes/web/source/}."+
                    "}";

    this.hackChafaParaQueFuncionenLasEscenasDeArquimedes = false;

    if (this.arquimedes) {
      var childs = this.childs;
      var childs_i;
      var alturaRTF = 0;
      var alturaBotones = 0;

      for(var i=0, l=childs.length; i<l; i++) {
        childs_i = childs[i];
      
        // se encuentra la altura del rtf
        if (childs_i.name == "rtf_height") {
          alturaRTF = parseInt(childs_i.value);
        }

        // se encuentra la altura de los botones
        if (babel[childs_i.name] == "Buttons") {
          this.buttonsConfig = this.lessonParser.parseButtonsConfig(childs_i.value);
          alturaBotones = this.buttonsConfig.height;
        }
      }
      if (alturaRTF) {
        this.height =  alturaRTF + alturaBotones + 70; // 70 es la altura de la imagen de la licencia
      }
    }

    // se inician la interpretacion
    this.init()
  }

  /**
   * Inicia las variables necesarias para el parseo y la creacion de la leccion de descartes
   */
  descartesJS.DescartesApp.prototype.init = function() {
    /**
     * Objeto para el parseo y evaluacion de expresiones
     * type {Evaluator}
     * @private
     */
    this.evaluator = new descartesJS.Evaluator(this);
   
    /**
     * Objeto para parsear los objetos de la leccion de descartes
     * @type {LessonParser}
     * @private
     */
    this.lessonParser = new descartesJS.LessonParser(this);

    /**
     * Arreglo donde se guardan los espacios de la aplicacion de descartes
     * type {[Space]}
     * @private
     */
    this.spaces = [];

    /**
     * Region externa
     * type {Space}
     * @private
     */
    this.externalSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * Region norte
     * type {Space}
     * @private
     */
    this.northSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * Region sur
     * type {Space}
     * @private
     */
    this.southSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * Region este
     * type {Space}
     * @private
     */
    this.eastSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * Region oeste
     * type {Space}
     * @private
     */
    this.westSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * Region especial para colocar los controlos correspondientes a los botones creditos, config, inicio o limpiar
     * type {Space}
     * @private
     */
    this.specialSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * Region de contenido editable
     * type {<DIV>}
     * @private
     */
    this.editableRegion = {container: document.createElement("div"), textFields: []};
        
    /**
     * Arreglo donde se guardan los controles de la aplicacion de descartes
     * type {[Control]}
     * @private
     */
    this.controls = [];
   
    /**
     * Arreglo donde se guardan los auxiliares de la aplicacion de descartes
     * type {[Auxiliary]}
     * @private
     */
    this.auxiliaries = [];
   
    /**
     * Arreglo donde se guardan los eventos de la aplicacion de descartes
     * type {[Event]}
     * @private
     */
    this.events = [];
   
    /**
     * Indice z de los elementos
     * @type {number}
     * @private 
     */
    this.zIndex = 0;

    /**
     * Indice de tabulacion para los campos de texto
     * @type {number}
     * @private 
     */
    this.tabindex = 0;
    
    /**
     * Altura de la pleca si es que existe
     * @type {number}
     * @private
     */
    this.plecaHeight = 0;

    /**
     * 
     */
    this.numberOfIframes = 0;
    
    // sirve para reiniciar la leccion
    // si el contenedor del reemplazo del applet ya esta definido, significa que ya se habia interpretado anteriormente el applet, 
    // entonces se quita el contenedor con todo su contenido y se agrega uno nuevo
    if (this.container != undefined) {
      this.parentContainer.removeChild(this.container)
    }

    this.container = document.createElement("div");
    this.loader = document.createElement("div");

    // al contenedor del applet java de descartes se le agrega el nuevo contenedor para el applet interpretado por javascript
    this.parentContainer.appendChild(this.container);
    this.container.width = this.width;
    this.container.height = this.height;
    this.container.setAttribute("class", "DescartesAppContainer");
    this.container.setAttribute("style", "width: " + this.width + "px; height:" + this.height + "px;");
    
    // al contenedor se le agrega el loader
    this.container.appendChild(this.loader);
    this.loader.width = this.width;
    this.loader.height = this.height;
    this.loader.setAttribute("class", "DescartesLoader");
    this.loader.setAttribute("style", "width: " + this.width + "px; height:" + this.height + "px; z-index: 1000;");

    // si es la primera vez que se ejecuta
    if (this.firstRun) {
      var self = this;
      var imageURL = "url(" + drawDescartesLogo(this.loader.width, this.loader.height) + ")";
      
      this.imageLoader = document.createElement("div");
      this.imageLoader.width = this.width;
      this.imageLoader.height = this.height;
      this.imageLoader.setAttribute("class", "DescartesLoaderImage")
      this.imageLoader.setAttribute("style", "background-image: " + imageURL + "; width: " + this.width + "px; height:" + this.height + "px;");
      this.loader.appendChild(this.imageLoader);
      
      // se busca la imagen images/DescartesLoader.png para que sea utilizada como imagen de fondo
      var tmpImage = new Image();
      tmpImage.onload = function() {
        self.imageLoader.setAttribute("style", "background-image: url(" + this.src + "); width: " + self.width + "px; height:" + self.height + "px; top: 0px; left: 0px");
      }
      tmpImage.src = "images/DescartesLoader.png";
      
      this.loaderBar = document.createElement("canvas");
      this.loaderBar.width = this.width;
      this.loaderBar.height = this.height;
      this.loaderBar.setAttribute("class", "DescartesLoaderBar");
      this.loaderBar.setAttribute("style", "width: " + this.width + "px; height:" + this.height + "px;");
      this.loaderBar.ctx = this.loaderBar.getContext("2d");
      this.loader.appendChild(this.loaderBar);
      
      // se inicia el loader
      this.barWidth = Math.floor(this.loader.width/10);
      this.barHeight = Math.floor(this.loader.height/70);
      
      // se dibuja la barra de carga del loader
      this.timer = setInterval(function() { self.drawLoaderGraph(self.loaderBar.ctx, self.loaderBar.width, self.loaderBar.height); }, 10);

      this.firstRun = false;

      // se incia el preloader
      this.initPreloader();    
    } else {
      this.initBuildApp();
    }
  }
  
  /**
   * Inicia el audio
   */
  descartesJS.DescartesApp.prototype.initAudio = function(file) {
    var self = this;
    
    this.audios[file] = new Audio(file);
    this.audios[file].filename = file;

    // evento que se ejecuta cuando se termina de leer el audio
    var onCanPlayThrough = function() {
      this.ready = 1;
    }
    
    // evento que se ejecuta cuando ocurre un error, el audio no se pudo cargar
    var onError = function() {
//       console.log("error");
//       self.audios[file].removeEventListener('canplaythrough', onCanPlayThrough, false);
//       self.audios[file].removeEventListener('load', onCanPlayThrough, false);
// 
      if (!this.canPlayType("audio/" + this.filename.substring(this.filename.length-3)) && (this.filename.substring(this.filename.length-3) == "mp3")) {
        self.audios[file] = new Audio(this.filename.replace("mp3", "ogg"));
        self.audios[file].filename = this.filename.replace("mp3", "ogg");
        self.audios[file].addEventListener('canplaythrough', onCanPlayThrough, false);
        self.audios[file].addEventListener('load', onCanPlayThrough, false);
        self.audios[file].addEventListener('error', onError, false);
        self.audios[file].load();
      } else {
        console.log("El archivo '" + file + "' no puede ser reproducido");
        this.errorload = 1;
      }
    }
    this.audios[file].addEventListener('canplaythrough', onCanPlayThrough, false);
    this.audios[file].addEventListener('load', onCanPlayThrough, false);
    this.audios[file].addEventListener('error', onError, false);

    if (descartesJS.hasTouchSupport) {
      this.audios[file].load();
      this.audios[file].play();
      setTimeout( function(){ console.log("detenido"); self.audios[file].pause(); }, 10);
      this.audios[file].ready = 1;
    } else {
      this.audios[file].load();
    }
    
  }

  /**
   * Preloader de recursos, imagenes y audios
   */
  descartesJS.DescartesApp.prototype.initPreloader = function() {
    // ### ARQUIMEDES
    var licenceFile = "lib/DescartesCCLicense.png";
    this.images[licenceFile] = descartesJS.getCreativeCommonsLicenseImage();
    // evento que se ejecuta cuando se termina de leer la imagen
    this.images[licenceFile].addEventListener('load', function() { this.ready = 1; }, false);
    // evento que se ejecuta cuando ocurre un error, la imagen no se pudo cargar
    this.images[licenceFile].addEventListener('error', function() { this.errorload = 1; }, false);
    // this.images[licenceFile].src = licenceFile;
    // ### ARQUIMEDES

    var imgTmp;
    // se recorren todos los argumentos que definen al applet
    for(var i=0, l=this.childs.length; i<l; i++) {
      // se encuentran los nombres de archivo de las imagenes del applet
      var img = (this.childs[i].value).match(/[\w-//]*(.png|.jpg|.gif|.svg|.PNG|.JPG|.GIF|.SVG)/g);
      
      // si el elemento revisado tiene una imagen entonces hay que agregarla al arreglo de imagenes
      if (img) {
        for (var j=0, il=img.length; j<il; j++) {
          imgTmp = img[j];
          // si el nombre del archivo no es VACIO.GIF o vacio.gif
          if (!(imgTmp.toLowerCase().match(/vacio.gif$/)) && ((imgTmp.substring(0, imgTmp.length-4)) != "") ) {
            this.images[imgTmp] = new Image();

            // evento que se ejecuta cuando se termina de leer la imagen
            this.images[imgTmp].addEventListener('load', function() { this.ready = 1; }, false);

            // evento que se ejecuta cuando ocurre un error, la imagen no se pudo cargar
            this.images[imgTmp].addEventListener('error', function() { this.errorload = 1; }, false);
            
            this.images[imgTmp].src = imgTmp;
          }
        }
      }

      // se encuentran los nombres de archivo de los audios del applet
//       var aud = (this.childs[i].value).match(/[\w-//]*(.ogg|.oga|.mp3|.wav|.OGG|.OGA|.MP3|.WAV)/g);
      var aud = (this.childs[i].value).match(/[\w-//]*(\.ogg|\.oga|\.mp3|\.wav|\.OGG|\.OGA\.MP3|\.WAV)/g);
     
      // si con el elemento revisado tiene un audio entonces hay que agregarlo al arreglo de audios
      if (aud) {
        var audTmp;
        for (var j=0, al=aud.length; j<al; j++) {
          audTmp = aud[j];
          
          this.initAudio(audTmp);
        }
      }
      
      // se encuentran vectores que tengan un archivo asociado
      var vec = (this.childs[i].value).match(/vector|array|bektore|vecteur|matriz/g) && 
                (this.childs[i].value).match(/archivo|file|fitxer|artxibo|fichier|arquivo/g);
     
      // si es un vector con nombres de archivo, se crea el vector para que se precargen las imagenes, este vector se crea dos veces
      if (vec) {
        this.lessonParser.parseAuxiliar(this.childs[i].value);
      }
      
    }
        
    var self = this;

    // se cuenta cuantas imagenes se encontraron, se hace la cuenta despues debido a que puede haber nombres de archivos repetidos
    for (var propName in this.images) {
      if ((this.images).hasOwnProperty(propName)) {
        this.images.length++;
      }
    }

    // se cuenta cuantos audios se encontraron, se hace la cuenta despues debido a que puede haber nombres de archivos repetidos
    for (var propName in this.audios) {
      if ((this.audios).hasOwnProperty(propName)) {
        this.audios.length++;
      }
    }
        
    // funcion para revisar si ya se cargaron todas las imagenes
    var checkLoader = function() {
      // contador para determinar cuantas imagenes se han cargado
      self.readys = 0;
      // el numero total de imagenes
      var li = self.images.length;
      
      // se cuenta cuantas imagenes ya se han cargado
      for (var propName in self.images) {
        if ((self.images).hasOwnProperty(propName)) {
          if ( (self.images[propName].ready) || (self.images[propName].errorload) ) {
            self.readys++;
          }
        }
      }
      
      // el numero total de audios
      var la = self.audios.length;
      
      // se cuenta cuantos audios ya se han cargado
      for (var propName in self.audios) {
        if ((self.audios).hasOwnProperty(propName)) {
          if ( (self.audios[propName].ready) || (self.audios[propName].errorload) ) {
            self.readys++;
          }
        }
      }

      // si el numero de elementos listos es diferente al numero total de elementos, entonces hay que seguir ejecutando el loader
      if (self.readys != (li+la)) {
        setTimeout(checkLoader, 30);
      }
      // si el numero de elementos listos ya es igual al numero total de elementos, entonces se comienza a parsear y construir los elementos del applet
      else {
        self.initBuildApp();
      }
    }

    // se ejectuta el loader de imagenes
    checkLoader();
  }
  
  /**
   * Obtiene una imagen por nombre de archivo en el arreglo de imagenes del applet
   * @param {String} name el nombre de archivo de la imagen
   * @return {Image} la imagen correspondiente al nombre de archivo recibido
   */
  descartesJS.DescartesApp.prototype.getImage = function(name) {
    if (name) {
      // si la imagen ya esta en el arreglo de imagenes, entonces se regresa esa imagen
      if (this.images[name]) {
        return this.images[name];
      }
      // si la imagen no esta en el arreglo de imagenes, entonces se crea una nueva imagen y se agrega al arreglo de imagenes
      else {
        this.images[name] = new Image();
        this.images[name].src = name;
        
        // evento que se ejecuta cuando se termina de leer la imagen
        this.images[name].addEventListener('load', function() { this.ready = 1; }, false);
       
        // evento que se ejecuta cuando ocurre un error, la imagen no se pudo cargar
        this.images[name].addEventListener('error', function() { this.errorload = 1; }, false);
        
        return this.images[name];
      }
    }
  }
  
  /**
   * Obtiene un audio por nombre de archivo en el arreglo de audios del applet
   * @param {String} name el nombre de archivo del audio
   * @return {Image} el audio correspondiente al nombre de archivo recibido
   */
  descartesJS.DescartesApp.prototype.getAudio = function(name) {
    var self = this;
    // si la imagen ya esta en el arreglo de imagenes, entonces se regresa esa imagen
    if (this.audios[name]) {
      return this.audios[name];
    }
    // si la imagen no esta en el arreglo de imagenes, entonces se crea una nueva imagen y se agrega al arreglo de imagenes
    else {
      this.audios[name] = new Audio(name);
      
      // evento que se ejecuta cuando se termina de leer el audio
      this.audios[name].addEventListener('canplaythrough', function() { this.ready = 1; }, false);
      
      // evento que se ejecuta cuando ocurre un error, el audio no se pudo cargar
      var onError = function() {
        if (!this.canPlayType("audio/" + name.substring(name.length-3)) && (name.substring(name.length-3) == "mp3")) {
          self.audios[name] = new Audio(name.replace("mp3", "ogg"));
          self.audios[name].addEventListener('canplaythrough', onCanPlayThrough, false);
          self.audios[name].addEventListener('load', onCanPlayThrough, false);
          self.audios[name].addEventListener('error', onError, false);
          self.audios[name].load();
        } else {
          console.log("El archivo '" + name + "' no puede ser reproducido");
          this.errorload = 1;
        }
      }
      this.audios[name].addEventListener('error', onError, false);
            
//       this.audios[name].load();
      this.audios[name].play();
      setTimeout( function(){ self.audios[name].pause(); }, 10);
      
      return this.audios[name];
    }
  }

  /**
   * Dibuja la barra de carga del loader
   * @param {CanvasContextRendering2D} ctx es el contexto sobre el cual se dibuja la barra
   * @param {Number} w el ancho del area de la imagen
   * @param {Number} h el alto del area de la imagenes
   */
  descartesJS.DescartesApp.prototype.drawLoaderGraph = function(ctx, w, h) {
    var escala = 2;
    var cuantos = this.images.length + this.audios.length;
    var sep = (2*(this.barWidth-2))/cuantos;
    
    ctx.translate(w/2, h-25*escala);
    ctx.scale(escala, escala);

    ctx.strokeRect(-this.barWidth, -this.barHeight, 2*this.barWidth, this.barHeight);
    
    ctx.fillStyle = "gray";
    ctx.fillRect(-this.barWidth+2, -this.barHeight+2, 2*(this.barWidth-2), this.barHeight-4);
    
    ctx.fillStyle = "#1f375d";
    ctx.fillRect(-this.barWidth+2, -this.barHeight+2, this.readys*sep, this.barHeight-4);

    // se resetean las trasnformaciones
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  
  /**
   * Dibuja el logo de descartes y regresa la imagen correspondiente
   * @param {Number} w el ancho del espacio
   * @param {Number} h el alto del espacio
   */
  var drawDescartesLogo = function(w, h) {
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");

    ctx.save();
    
    ctx.strokeStyle = "#1f375d";
    ctx.fillStyle = "#1f375d";
    ctx.lineCap = "round";
    ctx.lineWidth = 2;

    ctx.beginPath();
    // La imagen original que hice mide 120pixeles de ancho por 65pixeles de alto 
    var escala = 3;
    ctx.translate((w-(120*escala))/2, (h-(65*escala))/2);
    ctx.scale(escala, escala);
    
    ctx.moveTo(3,25);
    ctx.lineTo(3,1);
    ctx.lineTo(21,1);
    ctx.bezierCurveTo(33,1, 41,15, 41,25);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1,63); ctx.lineTo(1,64);

    ctx.moveTo(5,62); ctx.lineTo(5,64);

    ctx.moveTo(9,61); ctx.lineTo(9,64);

    ctx.moveTo(13,60); ctx.lineTo(13,64);

    ctx.moveTo(17,58); ctx.lineTo(17,64);

    ctx.moveTo(21,56); ctx.lineTo(21,64);

    ctx.moveTo(25,53); ctx.lineTo(25,64);

    ctx.moveTo(29,50); ctx.lineTo(29,64);

    ctx.moveTo(33,46); ctx.lineTo(33,64);

    ctx.moveTo(37,41); ctx.lineTo(37,64);

    ctx.moveTo(41,32); ctx.lineTo(41,64);
    ctx.stroke();

    ctx.font = "20px Arial";
    ctx.fillText("escartes", 45, 33);
    ctx.fillText("JS", 98, 64);
    ctx.restore();

    return canvas.toDataURL();
  }
  
  /**
   * Inicia el parseo y la creacion de los objetos de la leccion de descartes
   */
  descartesJS.DescartesApp.prototype.initBuildApp = function() {
    var childs = this.childs;
    var lessonParser = this.lessonParser;
    
    var tmpSpaces = [];
    var tmpControls = [];
    var tmpAuxiliaries = [];
    var tmpGraphics = [];
    var tmp3DGraphics = [];
    var tmpAnimations = [];
    
    var chii;
    // se recorren todos los paramentros encontrados
    for(var i=0, l=childs.length; i<l; i++) {
      childs_i = childs[i];
      
      // se encuentra la informacion de la pleca
      if (childs_i.name == "pleca") {
        var divPleca = lessonParser.parsePleca(childs_i.value, this.width);
        this.container.insertBefore(divPleca, this.loader);
        
        this.plecaHeight = (divPleca.imageHeight) ? divPleca.imageHeight : divPleca.offsetHeight;
      }
      
      // se encuentran los parametros de configuracion del los espacios exteriores
      if (babel[childs_i.name] == "Buttons") {
        this.buttonsConfig = lessonParser.parseButtonsConfig(childs_i.value);
        continue;
      }
      
      // se encuentra el simbolo decimal utilizado
      if (babel[childs_i.name] == "decimal_symbol") {
        this.decimal_symbol = childs_i.value;
        continue;
      }
      
      // se encuentra la version de descartes
      if (babel[childs_i.name] == "version") {
        this.version = parseInt(childs_i.value);
        continue;
      }
      
      // se encuentra el idioma de la leccion
      if (babel[childs_i.name] == "language") {
        this.language = childs_i.value;
        continue;
      }
      
      // se encuentra si el applet esta habilitado a la interaccion con el usuario
      if (babel[childs_i.getAttribute("enable")] == "enable") {
        this.enable = babel[childs_i.getAttribute("enable")];
        continue;
      }
      
      // ##ARQUIMEDES## //
      // si el nombre del parametro es RTF entonces es el texto de arquimedes
      if (childs_i.name == "rtf") {
        var posY = (parseInt(this.height) -this.plecaHeight -this.buttonsConfig.height -45);
        tmpGraphics.push("space='descartesJS_scenario' type='text' expresion='[10,20]' background='yes' text='" + childs_i.value.replace(/'/g, "&squot;") + "'");
        tmpGraphics.push("space='descartesJS_scenario' type='text' expresion='[10," + (posY-25) + "]' background='yes' text='" + this.licenseA + "'");
        tmpGraphics.push("space='descartesJS_scenario' type='image' expresion='[15," + posY + "]' background='yes' abs_coord='yes' file='lib/DescartesCCLicense.png'");


        continue;
      }
      // ##ARQUIMEDES## //

      // si el nombre del parametro inicia con la letra E entonces es un espacio
      if (childs_i.name.charAt(0) == "E") {
        if (childs_i.value.match(/'HTMLIFrame'/)) {
          this.numberOfIframes++;
        }
        
        // si algun espacio se llamam _BASE_ entonces es una conversion de arquimedes a descartes
        if (childs_i.value.match("'_BASE_'")) {
          this.hackChafaParaQueFuncionenLasEscenasDeArquimedes = true;
        }

        tmpSpaces.push(childs_i.value);
        continue;
      }
      
      // si el nombre del parametro inicia con la letra C entonces es un control
      if ((childs_i.name.charAt(0) == "C") && (childs_i.name.charAt(1) == "_")) {
        tmpControls.push(childs_i.value);
        continue;
      }

      // si el nombre del parametro inicia con la letra A y no es la palabra "Animation" entonces es un auxiliar
      if ((childs_i.name.charAt(0) == "A") && (babel[childs_i.name] != "Animation")) {
        tmpAuxiliaries.push(childs_i.value);
        continue;
      }

      // si el nombre del parametro inicia con la letra G entonces es un grafico
      if (childs_i.name.charAt(0) == "G") {
        tmpGraphics.push(childs_i.value);
        continue;
      }

      // si el nombre del parametro inicia con la letra S entonces es un grafico tridimensional
      if (childs_i.name.charAt(0) == "S") {
        tmp3DGraphics.push(childs_i.value);
        continue;
      }
      
      // si el nombre es "Animation" entonces es una animacion
      if (babel[childs_i.name] == "Animation") {
        tmpAnimations.push(childs_i.value);
        continue;
      }
    }

    // ##ARQUIMEDES## //
    /**
     * Region del escenario solo visible para arquimedes
     */
    this.scenarioRegion = {container: document.createElement("div"), scroll: 0};
    this.scenarioRegion.container.setAttribute("id", "descartesJS_Scenario_Region");
//     this.scenarioRegion.container.setAttribute("style", "overflow: auto; width: " + this.width + "px; height: " + this.height + "px;");
    this.scenarioRegion.scenarioSpace = this.lessonParser.parseSpace("tipo='R2' id='descartesJS_scenario' fondo='blanco' x='0' y='0' fijo='yes' red='no' red10='no' ejes='no' text='no' ancho='" + this.width + "' alto='" + this.height + "'");
    this.scenarioRegion.container.appendChild(this.scenarioRegion.scenarioSpace.container);

    // si es una escena de arquimedes, entonces se agrega el contenedor
    if (this.arquimedes) {
      this.container.appendChild(this.scenarioRegion.container);
      this.spaces.push(this.scenarioRegion.scenarioSpace);
    }
    // ##ARQUIMEDES## //    

    // se inician los elementos
    var tmpSpace;
    for (var i=0, l=tmpSpaces.length; i<l; i++) {
      tmpSpace = lessonParser.parseSpace(tmpSpaces[i]);

      // ##ARQUIMEDES## //
      if (this.arquimedes) {
        this.scenarioRegion.container.appendChild(tmpSpace.container);
      }
      // ##ARQUIMEDES## //

      // se crea y se agrega un espacio a la lista de espacios
      this.spaces.push(tmpSpace);

      // se incrementa el indice z, para que el siguiente espacio se coloque sobre los anteriores
      this.zIndex++;
    }
    
    // se crean los graficos primero por si existen macros //
    var tmpGraph;
    for (var i=0, l=tmpGraphics.length; i<l; i++) {
      // se crea un grafico
      tmpGraph = lessonParser.parseGraphic(tmpGraphics[i]);
      if (tmpGraph) {
        if (tmpGraph.visible) {
          this.editableRegionVisible = true;
        }
        tmpGraph.space.addGraph(tmpGraph);
      }
    }
    
    var tmp3DGraph;
    for (var i=0, l=tmp3DGraphics.length; i<l; i++) {
      // se crea un grafico 3D
      tmpGraph = lessonParser.parse3DGraphic(tmp3DGraphics[i]);
      if (tmpGraph) {
        tmpGraph.space.addGraph(tmpGraph);
      }
    }

    for (var i=0, l=tmpControls.length; i<l; i++) {
      // se crea y se agrega un control a la lista de controles
      this.controls.push( lessonParser.parseControl(tmpControls[i]) );
    }

    for (var i=0, l=tmpAuxiliaries.length; i<l; i++) {
      // se crea un auxiliar
      lessonParser.parseAuxiliar(tmpAuxiliaries[i]);
    }

    for (var i=0, l=tmpAnimations.length; i<l; i++) {
      // se crea una animacion
      this.animation = lessonParser.parseAnimation(tmpAnimations[i]);
    }
    
    // se configuran las regiones del espacio
    this.configRegions();

    // una vez creados los elementos se actualizan
    // se actualizan los auxiliares
    this.updateAuxiliaries();

    //se inician los controles de nuevo, una vez que los auxiliares se iniciaron por si tenian valores dependientes de los auxiliares
    for (var i=0, l=this.controls.length; i<l; i++) {
      this.controls[i].init();
    }
    // se actualizan los controles
    this.updateControls();
    
    // se actualizan los graficos del espacio
    this.updateSpaces(true);

    var self = this;
    if (this.numberOfIframes) {
      setTimeout(function() { self.finishInit(); }, 250*this.numberOfIframes);
    }
    
    else {
      this.finishInit();
    }
    
  }
  
  /**
   * 
   */
  descartesJS.DescartesApp.prototype.finishInit = function() {  
    this.update();

    ////////////////////////////////////////////////////////////////////////
    // se esconde el canvas del loader una vez que ya se termino de crear
    this.loader.style.display = "none";
    this.parentContainer.style = "overflow: hidden;";
    clearTimeout(this.timer);
    
    // si el applet esta deshabilitado se coloca un div que bloquee la interaccion con el
    if (this.enable) {
      this.blocker = document.createElement("div");
      this.blocker.setAttribute("class", "blocker");
      this.blocker.setAttribute("style", "width: " + this.width + "px; height: " + this.height + "px");
      this.container.appendChild(this.blocker);
    }
  }

  
  /**
   * 
   */
  descartesJS.DescartesApp.prototype.configRegions = function() {
    var parser = this.evaluator.parser;

    var buttonsConfig = this.buttonsConfig;
    var principalContainer = this.container;
    
    // descartes 4
    if (this.version != 2) {
      var fontSizeDefaultButtons = "15";
      var aboutWidth = 100;
      var configWidth = 100;
      var initWidth = 100;
      var clearWidth = 100;
    }
    // descartes 2
    else {
      var fontSizeDefaultButtons = "14";
      var aboutWidth = 63;
      var configWidth = 50;
      var initWidth = 44;
      var clearWidth = 53;
    }

    var northRegionHeight = 0;
    var southRegionHeight = 0;
    var eastRegionHeight = 0;
    var westRegionHeight = 0;
    var editableRegionHeight = 0;
    var northRegionWidht = 0;
    var southRegionWidht = 0;
    var eastRegionWidth = 0;
    var westRegionWidth = 0;

    var northSpaceControls = this.northSpace.controls;
    var southSpaceControls = this.southSpace.controls;
    var eastSpaceControls = this.eastSpace.controls;
    var westSpaceControls = this.westSpace.controls;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    // region norte
    if ((buttonsConfig.rowsNorth > 0) || ( northSpaceControls.length > 0) || (buttonsConfig.about) || (buttonsConfig.config)) {
      if (buttonsConfig.rowsNorth <= 0) {
        northRegionHeight = buttonsConfig.height;
        buttonsConfig.rowsNorth = 1;
      }
      // si el numero de filas es diferente de cero entonces la altura es la altura especificada por el numero de filas
      else {
        northRegionHeight = buttonsConfig.height * buttonsConfig.rowsNorth;
      }

      var container = this.northSpace.container;
      container.setAttribute("id", "descartesJS_northRegion");
      container.setAttribute("style", "width: " + principalContainer.width + "px; height: " + northRegionHeight + "px; background: #c0c0c0; position: absolute; left: 0px; top: 0px; z-index: 100;")

      // se agrega el contenedor del espacio antes del loader
      principalContainer.insertBefore(container, this.loader);
      
      northRegionWidht = principalContainer.width;
      var displaceButton = 0;
      // hay que mostrar el boton de creditos
      if (buttonsConfig.about) {
        displaceButton = aboutWidth;
        northRegionWidht -= displaceButton;
      }
      // hay que mostrar el boton de configuracion
      if (buttonsConfig.config) {
        northRegionWidht -= configWidth;
      }
      
      var numberOfControlsPerRow = Math.ceil(northSpaceControls.length / buttonsConfig.rowsNorth);
      var controlWidth = northRegionWidht/numberOfControlsPerRow;
      
      // se configuran los controles de la region
      for (var i=0, l=northSpaceControls.length; i<l; i++) {
        northSpaceControls[i].expresion = parser.parse("(" + (displaceButton +controlWidth*(i%numberOfControlsPerRow)) +"," + (buttonsConfig.height*Math.floor(i/numberOfControlsPerRow)) + "," + controlWidth + "," + buttonsConfig.height +")");
        northSpaceControls[i].drawif = parser.parse("1");
      }
      
      // se crean los botones de creditos y configuracion
      if (buttonsConfig.about) {
        var text;
        if (this.language == "espa\u00F1ol") {
          text = "cr\u00E9ditos";
        } 
        else if (this.language == "english") {
          text = "about";
        }

        var btnAbout = new descartesJS.Button(this, {region: "north", name: text, font_size: parser.parse(fontSizeDefaultButtons),
                                                     expresion: parser.parse("(0, 0, " + aboutWidth + ", " + northRegionHeight + ")")
                                                    }
                                             );
      }
      if (buttonsConfig.config) {
        var text;
        if (this.language == "espa\u00F1ol") {
          text = "config";
        } 
        else if (this.language == "english") {
          text = "config";
        }
        
        var btnConfig = new descartesJS.Button(this, {region: "north", name: text, font_size: parser.parse(fontSizeDefaultButtons),
                                                      action: "config",
                                                      expresion: parser.parse("(" + (northRegionWidht + aboutWidth)  + ", 0, " + configWidth + ", " + northRegionHeight + ")")
                                                     }
                                              );
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // region sur
    if ((buttonsConfig.rowsSouth > 0) || (southSpaceControls.length > 0) || (buttonsConfig.init) || (buttonsConfig.clear)) {
      // si el numero de filas es cero pero contiene controles entonces la altura es la altura especificada
      if (buttonsConfig.rowsSouth <= 0) {
        southRegionHeight = buttonsConfig.height;
        buttonsConfig.rowsSouth = 1;
      }
      // si el numero de filas es diferente de cero entonces la altura es la altura especificada por el numero de filas
      else {
        southRegionHeight = buttonsConfig.height * buttonsConfig.rowsSouth;
      }
      
      southRegionWidht = principalContainer.width;
      var displaceButton = 0;
      // hay que mostrar el boton de creditos
      if (buttonsConfig.init) {
        displaceButton = initWidth;
        southRegionWidht -= displaceButton;        
      }
      // hay que mostrar el boton de configuracion
      if (buttonsConfig.clear) {
        southRegionWidht -= clearWidth;
      }

      var container = this.southSpace.container;
      container.setAttribute("id", "descartesJS_southRegion");
      container.setAttribute("style", "width: " + principalContainer.width + "px; height: " + southRegionHeight + "px; background: #c0c0c0; position: absolute; left: 0px; top: " + (principalContainer.height-southRegionHeight) + "px; z-index: 100;")

      // se agrega el contenedor del espacio antes del loader
      principalContainer.insertBefore(container, this.loader);

      var numberOfControlsPerRow = Math.ceil(southSpaceControls.length / buttonsConfig.rowsSouth);
      var controlWidth = southRegionWidht/numberOfControlsPerRow;
      
      // se configuran los controles de la region
      for (var i=0, l=southSpaceControls.length; i<l; i++) {
        southSpaceControls[i].expresion = parser.parse("(" + (displaceButton + controlWidth*(i%numberOfControlsPerRow)) +"," + (buttonsConfig.height*Math.floor(i/numberOfControlsPerRow)) + "," + controlWidth + "," + buttonsConfig.height +")");
        southSpaceControls[i].drawif = parser.parse("1");
      }
      
      // se crean los botones de creditos y configuracion
      if (buttonsConfig.init) {
        var text;
        if (this.language == "espa\u00F1ol") {
          text = "inicio";
        } 
        else if (this.language == "english") {
          text = "init";
        }

        var btnAbout = new descartesJS.Button(this, {region: "south", name: text, font_size: parser.parse(fontSizeDefaultButtons),
                                                     action: "init",
                                                     expresion: parser.parse("(0, 0, " + initWidth + ", " + southRegionHeight + ")")
                                                    }
                                             );
      }
      if (buttonsConfig.clear) {
        var text;
        if (this.language == "espa\u00F1ol") {
          text = "limpiar";
        } 
        else if (this.language == "english") {
          text = "clear";
        }
        
        var btnConfig = new descartesJS.Button(this, {region: "south", name: text, font_size: parser.parse(fontSizeDefaultButtons),
                                                      action: "clear",
                                                      expresion: parser.parse("(" + (southRegionWidht + initWidth)  + ", 0, " + clearWidth + ", " + southRegionHeight + ")")
                                                     }
                                              );
      }      
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // region este
    if (eastSpaceControls.length > 0) {
      eastRegionHeight = principalContainer.height - northRegionHeight - southRegionHeight;
      eastRegionWidth = buttonsConfig.widthEast;
      
      var container = this.eastSpace.container;
      container.setAttribute("id", "descartesJS_eastRegion");
      container.setAttribute("style", "width: " + eastRegionWidth + "; height: " + eastRegionHeight + "px; background: #c0c0c0; position: absolute; left: " + (principalContainer.width - eastRegionWidth) + "px; top: " + northRegionHeight + "px; z-index: 100;")

      // se agrega el contenedor del espacio antes del loader
      principalContainer.insertBefore(container, this.loader);

      // se configuran los controles de la region
      for (var i=0, l=eastSpaceControls.length; i<l; i++) {
        eastSpaceControls[i].expresion = parser.parse("(0," + (buttonsConfig.height*i) + "," + eastRegionWidth + "," + buttonsConfig.height +")");
        eastSpaceControls[i].drawif = parser.parse("1");
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // region oeste
    if (westSpaceControls.length > 0) {
      westRegionHeight = principalContainer.height - northRegionHeight - southRegionHeight;
      westRegionWidth = buttonsConfig.widthWest;
      
      var container = this.westSpace.container;
      container.setAttribute("id", "descartesJS_westRegion");
      container.setAttribute("style", "width: " + westRegionWidth + "; height: " + westRegionHeight + "px; background: #c0c0c0; position: absolute; left: 0px; top: " + northRegionHeight + "px; z-index: 100;")

      // se agrega el contenedor del espacio antes del loader
      principalContainer.insertBefore(container, this.loader);

      // se configuran los controles de la region
      for (var i=0, l=westSpaceControls.length; i<l; i++) {
        westSpaceControls[i].expresion = parser.parse("(0," + (buttonsConfig.height*i) + "," + westRegionWidth + "," + buttonsConfig.height +")");
        westSpaceControls[i].drawif = parser.parse("1");
      }
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (this.editableRegionVisible) {
      editableRegionHeight = buttonsConfig.height;
      var container = this.editableRegion.container;
      container.setAttribute("id", "descartesJS_editableRegion");
      container.setAttribute("style", "width: " + principalContainer.width + "px; height: " + editableRegionHeight + "px; position: absolute; left: 0px; top: " + (principalContainer.height - southRegionHeight - buttonsConfig.height) + "px; z-index: 100; background: #c0c0c0; overflow: hidden;");
      
      // se agrega el contenedor del espacio antes del loader
      principalContainer.insertBefore(container, this.loader);

      var editableRegionTextFields = this.editableRegion.textFields
      var textFieldsWidth = (principalContainer.width)/editableRegionTextFields.length;
            
      // se configuran los campos de texto de la region
      for (var i=0, l=editableRegionTextFields.length; i<l; i++) {
        if (editableRegionTextFields[i].type == "div") {
          container.appendChild(editableRegionTextFields[i].container);

          ////////////////////////////////////////////////////////////////
          // el contenedor
          editableRegionTextFields[i].container.setAttribute("style", "font-family: Arial; width: " + (textFieldsWidth-4) + "px; height: " + (editableRegionHeight-5) + "px; position: absolute; left: " + ( i*textFieldsWidth ) + "px; top: 0px; border: 2px groove white;");

          ////////////////////////////////////////////////////////////////
          // la etiqueta
          var label = editableRegionTextFields[i].container.firstChild;
          var labelWidth = label.offsetWidth;
          label.setAttribute("style", "font-family: Arial; padding-top: 0%; background-color: lightgray; position: absolute; left: 0px; top: 0px; width: " + labelWidth + "px;");

          // se quita el primer y ultimo caracter, por que fueron guiones bajos introducidos para encontrar el tama;o inicial
          label.firstChild.textContent = label.firstChild.textContent.substring(1, label.firstChild.textContent.length-1);
          
          ////////////////////////////////////////////////////////////////
          // el campo de texto
          var textfield = editableRegionTextFields[i].container.lastChild;
          textfield.setAttribute("style", "font-family: 'Courier New'; width: " + (textFieldsWidth-labelWidth-8) + "px; height: " + (editableRegionHeight-9) + "px; position: absolute; left: " + (labelWidth) + "px; top: 0px; border: 2px groove white;");
        } 

        else {
          container.appendChild(editableRegionTextFields[i]);

          editableRegionTextFields[i].setAttribute("style", "font-family: 'Courier New'; width: " + (textFieldsWidth) + "px; height: " + (editableRegionHeight) + "px; position: absolute; left: " + ( i*textFieldsWidth ) + "px; top: 0px; border: 2px groove white;");
        }
      }
    }    
    
    this.displaceRegionNorth = northRegionHeight;
    this.displaceRegionWest = westRegionWidth;
    
    principalContainer.width = principalContainer.width - eastRegionWidth;
    principalContainer.height = principalContainer.height - southRegionHeight - editableRegionHeight;
    
    for (var i=0, l=this.spaces.length; i<l; i++) {
      this.spaces[i].init()
    }
    
  }

  /**
   * Actualiza y dibuja el reemplazo del applet
   */
  descartesJS.DescartesApp.prototype.update = function() {
    // se actualizan los auxiliares
    this.updateAuxiliaries();
    // se actualizan los eventos
    this.updateEvents();
    // se actualizan los controles
    this.updateControls();
    // se actualizan los graficos del espacio
    this.updateSpaces();
  }
  
  /**
   * Actualiza los auxiliares
   */
  descartesJS.DescartesApp.prototype.deactivateGraphiControls = function() {
    var controls_i;
    for (var i=0, l=this.controls.length; i<l; i++) {
      controls_i = this.controls[i];
      if (controls_i.type == "graphic") {
        controls_i.deactivate();
      }
    }    
  }
  
  /**
   * Actualiza los auxiliares
   */
  descartesJS.DescartesApp.prototype.updateAuxiliaries = function() {
    for (var i=0, l=this.auxiliaries.length; i<l; i++) {
      this.auxiliaries[i].update();
    }
  }

  /**
   * Actualiza los auxiliares
   */
  descartesJS.DescartesApp.prototype.updateEvents = function() {
    for (var i=0, l=this.events.length; i<l; i++) {
      this.events[i].update();
    }    
  }
  
  /**
   * Actualiza los Controles
   */
  descartesJS.DescartesApp.prototype.updateControls = function() {
    for (var i=0, l=this.controls.length; i<l; i++) {
      this.controls[i].update();
    }
  }

  /**
   * Actualiza los Espacios
   */
  descartesJS.DescartesApp.prototype.updateSpaces = function(firstime) {
    for (var i=0, l=this.spaces.length; i<l; i++) {
      this.spaces[i].update(firstime);
    } 
  }
  
  /**
   * Limpia el rastro de los espacios
   */
  descartesJS.DescartesApp.prototype.clear = function() {
    for (var i=0, l=this.spaces.length; i<l; i++) {
      this.spaces[i].spaceChange = true;
      this.spaces[i].drawBackground();
    }    
  }
  
  /**
   * Inicia la animacion
   */
  descartesJS.DescartesApp.prototype.play = function() {
    if (this.animation) {
      this.animation.play();
    }
  }
  
  /**
   * Detiene la animacion
   */
  descartesJS.DescartesApp.prototype.stop = function() {
    if (this.animation) {
      this.animation.stop();
    }
  }
  
  /**
   * Reinicia la animacion
   */
  descartesJS.DescartesApp.prototype.reinitAnimation = function() {
    if (this.animation) {
      this.animation.reinit();
    }
  }
  
  /**
   * Dado un identificador regresa un control con ese identificador o un control dummy
   * @param {String} id el identificador del control
   */
  descartesJS.DescartesApp.prototype.getControlById = function(id) {
    var controls_i;
    for (var i=0, l=this.controls.length; i<l; i++) {
      controls_i = this.controls[i];
      if (controls_i.id == id) {
        return controls_i;
      }
    }
    
    return {update: function() {}}; 
  }
  
  /**
   * Dado un component id regresa un espacio con ese component id
   * @param {String} cId el component id del espacio
   */
  descartesJS.DescartesApp.prototype.getSpaceByCId = function(cID) {
    var spaces_i;
    for (var i=0, l=this.spaces.length; i<l; i++) {
      spaces_i = this.spaces[i];
      if (spaces_i.cID == cID) {
        return spaces_i;
      }
    }
    
    return {update: function() {}, w: 0}; 
  }
  
    /**
   * Dado un component id regresa un espacio con ese id
   * @param {String} cId el component id del espacio
   */
  descartesJS.DescartesApp.prototype.getSpaceById = function(id) {
    var spaces_i;
    for (var i=0, l=this.spaces.length; i<l; i++) {
      spaces_i = this.spaces[i];
      if (spaces_i.id == id) {
        return spaces_i;
      }
    }
    
    return {update: function() {}, w: 0}; 
  }

  /**
   * Dado un component id regresa un control con ese component id
   * @param {String} cId el component id del control
   */
  descartesJS.DescartesApp.prototype.getControlByCId = function(cID) {
    var controls_i;
    for (var i=0, l=this.controls.length; i<l; i++) {
      controls_i = this.controls[i];
      if (controls_i.cID == cID) {
        return controls_i;
      }
    }
    
    return {update: function() {}, w: 0};     
  }

  var tmpVal;
  /**
   *
   */
  function arrayToString(array) {
    var result = "[";
    for (var i=0, l=array.length; i<l; i++) {
      // es un arreglo anidado
      if (array[i] instanceof Array) {
        result += arrayToString(array[i]);
      }
      // es un valor
      else {
        tmpVal = array[i];
        if ( (typeof(tmpVal) == "undefined") || (!tmpVal)) {
          tmpVal = 0;
        }
        
        if (typeof(tmpVal) == "string") {
          tmpVal = "'" + tmpVal + "'";
        }

        result += tmpVal;
      }

      // se agregan las comas
      if (i<l-1) {
        result += ",";
      }

    }
    return result + "]"
  }

  /**
   * Obtiene el estado de las variables del applet
   */
  descartesJS.DescartesApp.prototype.getState = function() {
    var theVariables = this.evaluator.variables;
    var theValues;
    var state = "";
    
    // se recorren todos los valores de las variables
    for (var varName in theVariables) {
      if (theVariables.hasOwnProperty(varName)) {
        theValues = theVariables[varName];
        
        // si el valor es una cadena hay que garantizar que no pierde las comillas sencillas
        if (typeof(theValues) == "string") {
          theValues = "'" + theValues + "'";
        }
        
        // si el nombre de la variable es alguna de las variables internas, o si es un objeto, entonces se ignora
        if ( (theValues != undefined) && (varName != "rnd") && (varName != "pi") && (varName != "e") && (varName != "Infinity") && (varName != "-Infinity") && (typeof(theValues) != "object") ) {
          
          state = (state != "") ? (state + "\n" + varName + "=" + theValues) : (varName + "=" + theValues);
        }
      }
    }

    var theVectors = this.evaluator.vectors;
    // se recorren todos los valores de los vectores
    for (var vecName in theVectors) {
      if (theVectors.hasOwnProperty(vecName)) {
        theValues = theVectors[vecName];

        state = state + "\n" + vecName + "=" + arrayToString(theValues);
      }
    }

    var theMatrices = this.evaluator.matrices;
    // se recorren todos los valores de las matrices
    for (var matName in theMatrices) {
      if (theMatrices.hasOwnProperty(matName)) {
        theValues = theMatrices[matName];

        state = state + "\n" + matName + "=" + arrayToString(theValues);
      }
    }

    // se regresan los valores en la forma variable1=valor1\nvariable2=valor2\n...\nvariableN=valorN
    return state; 
  }
  
  /**
   * Almacena el estado de las variables del applet
   * @param state una cadena que especifica los valores a guardar de la forma variable1=valor1\nvariable2=valor2\n...\nvariableN=valorN
   */
  descartesJS.DescartesApp.prototype.setState = function(state) {
    var theState = state.split("\n");
    
    // los valores se evaluan para ser agregados
    var tmpParse;
    var value;

    for (var i=0, l=theState.length; i<l; i++) {
      tmpParse = theState[i].split("=");

      // el texto es del tipo variable=valor
      if (tmpParse.length >= 2) {
        value = eval(tmpParse[1]);

        // es el valor de una matriz
        if (tmpParse[1].indexOf("[[") != -1) {
          this.evaluator.matrices[tmpParse[0]] = value;
          // this.evaluator.variables[tmpParse[0] + ".filas"] = value.length; 
          // this.evaluator.variables[tmpParse[0] + ".columnas"] = value[0].length; 
          this.evaluator.matrices[tmpParse[0]].rows = value.length;
          this.evaluator.matrices[tmpParse[0]].cols = value[0].length;
        }
        // es el valor de un vector
        else if (tmpParse[1].indexOf("[") != -1) {
          this.evaluator.vectors[tmpParse[0]] = value;
          this.evaluator.variables[tmpParse[0] + ".long"] = value.length;
        }
        // es el valor de una variable
        else {
          this.evaluator.variables[tmpParse[0]] = value;
        }
      }

      this.update();

      // tmpParse = this.evaluator.parser.parse(theState[i], true);
      
      // // se ejecuta la asignacion de valores que se encuentra en la cadena del estado
      // this.evaluator.evalExpression( tmpParse );
      
      // // se guardan las asinaciones de valores para futuras asignaciones
      // this.saveState.push(tmpParse);
    }
    
  }
  
  /**
   * @return {String} de forma: questions=algo \n correct=algo \n wrong=algo \n control1=respuestaAlumno|0 ó 1 \n control2=respuestaAlumno|0 ó 1
   */
  descartesJS.DescartesApp.prototype.getEvaluation = function() {
    var questions = 0;
    var correct = 0;
    
    var answers = "";
    
    for (var i=0, l=this.controls.length; i<l; i++) {
      if ( (this.controls[i].gui == "textfield") && (this.controls[i].evaluate) ) {
        questions++;
        correct += this.controls[i].ok;
        this.controls[i].value = (this.controls[i].value == "") ? "''" : this.controls[i].value;
        answers += (" \\n " + this.controls[i].id + "=" + this.controls[i].value + "|" + this.controls[i].ok);
      }
    }
    
    return "questions=" + questions + " \\n correct=" + correct + " \\n wrong=" + (questions-correct) + answers;
  }

  /**
   */
  descartesJS.DescartesApp.prototype.showSolution = function() {
    //guarda los valores que tienen los campos de respuesta en el momento de llamarlo y muesta el primer elemento de los patrones de respuesta
    
    for (var i=0, l=this.controls.length; i<l; i++) {
      if ( (this.controls[i].gui == "textfield") && (this.controls[i].evaluate) ) {
        this.controls[i].changeValue( this.controls[i].getFirstAnswer() );
      }
    }
    
    this.update();
  }

  /**
   */
  descartesJS.DescartesApp.prototype.showAnswer = function() {
    //guarda los valores que tienen los campos de respuesta en el momento de llamarlo y  muestra las respuestas guardadas del alumno 
    for (var i=0, l=this.saveState.length; i<l; i++){
      this.evaluator.evalExpression( this.saveState[i] );
    }
    
    this.update();
  }
    
  return descartesJS;
})(descartesJS || {});
/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  /**
   * Arreglo donde se guardan los reemplazos de los applets construidos con javascript y html
   * type [DescartesApp]
   * @private
   */
  descartesJS.apps = [];

  /**
   * Crea los remplazos de los applets de Descartes
   */
  function createDescartesApps() {
    // se obtienen todos los applets de Descartes que se van interpretan con javascript
    var applets = getDescartesApplets();
    var applet_i;

    // se construyen los reemplazos de los applets de Descartes
    for (var i=0, l=applets.length; i<l; i++) {
      applet_i = applets[i];
      descartesJS.apps.push( new descartesJS.DescartesApp(applet_i) );
      changeClassDescartesJS(applet_i);
    }
  }

  /** 
   * Esconde los applets que se encuentran en el documento utilizando un estilo
   */
  function hideApplets() {
    // se busca un nodo de estilo cuyo identificador sea "StyleDescartesApps"
    var cssNode = document.getElementById("StyleDescartesApps");
    
    // si el nodo ya esta en el DOM se remueve
    if (cssNode) {
      (cssNode.parentNode).removeChild(cssNode);
    }
    
    // se crea el estilo, que servira para ocultar los applets java de Descartes
    cssNode = document.createElement("style");
    cssNode.id = "StyleDescartesApps";
    cssNode.type = "text/css";
    cssNode.setAttribute("rel", "stylesheet");
    cssNode.innerHTML = "applet.DescartesJS {display:none;} applet {display:none;}";
    
    // se agrega el estilo a la cabeza del documento de html
    document.head.appendChild(cssNode); 
  }
  
  /** 
   * Muestra los applets que se encuentran en el documento utilizando un estilo
   */
  function showApplets() {
    // se busca un nodo de estilo cuyo identificador sea "StyleDescartesApps"
    var cssNode = document.getElementById("StyleDescartesApps");

    cssNode.innerHTML = "applet {display:block;}";
  }
  
  /** 
   * Vuelve a mostrar los applets que no son descartesJS
   */
  function showNoDescartesJSApplets() {
    document.getElementById("StyleDescartesApps").innerHTML = "applet.DescartesJS {display:none;}";
  }
  
  /**
   * Obtiene los applets en el documento
   * @return {[<applet>]} los applets de Descartes en el documento
   */
  function getDescartesApplets() {
    // se obtienen todos los elementos del DOM cuya etiqueta sea del tipo applet
    var applets = document.getElementsByTagName("applet");
    var applet_i;
    
    // se crea un arreglo donde guardar los applets encontrados
    var tmpArrayApplets = [];

    for (var i=0, l=applets.length; i<l; i++) {
      applet_i = applets[i];
      
      // 
      // si en el atributo del codigo se encuentra la cadena DescartesJS o Descartes.class, entonces ese applet se agrega a la lista de applets a reemplazar
//       if ( ((applet_i.getAttribute("code").match("DescartesJS")) || (applet_i.getAttribute("code").match("Descartes.class"))) && 
//            (applet_i.getAttribute("code").match("descinst.DescartesBasico")) //|| (applet_i.getAttribute("code").match("descinst.DescartesWeb2_0.class"))
//          ) {
//       // si en el atributo del codigo se encuentra la cadena DescartesJS, entonces ese applet se agrega a la lista de applets a reemplazar
//       if (applet_i.getAttribute("code").match("DescartesJS")) {
      if ( (applet_i.getAttribute("code").match("DescartesJS")) || 
           (applet_i.getAttribute("code").match("Descartes.class")) || 
           (applet_i.getAttribute("code").match("descinst.DescartesWeb2_0.class"))
         ) {
        tmpArrayApplets.push(applet_i);
      }
    }
    
    return tmpArrayApplets;
  }
  
  /**
   * Cambia la clase de CSS del applet a "DescartesJS"
   * @param {<applet>} applet el applet al que se le cambia la clase
   */
  function changeClassDescartesJS(applet) {
    applet.className = "DescartesJS";
  }

  /**
   * Remueve los restos de una interpretacion anterior, en el caso de que la pagina haya sido salvada desde el navegador
   * Sirve para garantizar que una pagina salvada pueda ser interpretada de nuevo
   */
  function removeDescartesAppContainers() {
    // se buscan todas las etiquetas del documento HTML
    var allHTMLTags = document.getElementsByTagName("*");
    
    // arreglo para guardar los elementos a remover
    var toBeRemove = [];
    
    for (var i=0, l=allHTMLTags.length; i<l; i++) {
      // si se encuentra un elemento del tipo "DescartesAppContainer", entonces se agrega a lista de elementos a remover
      if (allHTMLTags[i].className == "DescartesAppContainer") {
        toBeRemove.push(allHTMLTags[i]);
      }
    }

    // se remueven los elementos encontrados del documento
    for (var i=0, l=toBeRemove.length; i<l; i++) {
      (toBeRemove[i].parentNode).removeChild(toBeRemove[i]);
    }
  }
  
  /**
   * Regresa el arreglo de todas las lecciones de descartes interpretadas con javascript
   * @return {[DescartesApp]}
   */
  descartesJS.getDescartesApps = function() {
    return descartesJS.apps;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Lo que sigue se ejecuta inmediatamente
  //////////////////////////////////////////////////////////////////////////////////////////////////
  // se ocultan los applets de java al inicio para evitar que se carge la maquina virtual

  // si la variable removeApplet existe y es verdadera, entonces se ocultan los applets
  if (!(window.hasOwnProperty('debugDescartesJS') && debugDescartesJS)) { 
    hideApplets();
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////
  

  /**
   * Funcion que se ejecuta cada vez que el navegador cambia de tamano
   */
  function onResize(evt) {
    for (var i=0, l=descartesJS.apps.length; i<l; i++) {
      for (var j=0, k=descartesJS.apps[i].spaces.length; j<k; j++) {
        descartesJS.apps[i].spaces[j].findOffset()
      }
    }
  }
  
  /**
   * Funcion que se ejecuta despues de cargar la pagina, para la interpretacion y reemplazo de los applets de descartes
   */
  function onLoad(evt) {
    // se obtienen algunas caracteristicas necesarias para interpretar las lecciones, como el soporte de eventos touch
    descartesJS.getFeatures();
    
    // si tiene soporte para canvas, que es el elemento principal para la interpretacion, entonces procedemos a crear el reemplazo
    if (descartesJS.hasCanvasSupport) {
      removeDescartesAppContainers();
      createDescartesApps();
      showNoDescartesJSApplets();
      window.addEventListener("resize", onResize, false);
    } 
    // si no tiene soporte para el canvas, entonces los applets se muestran esperando ser interpretados con Java
    else {
      showApplets();
    }
  }
  
  /**
   * Comunicacion con espacios iframe
   */
  descartesJS.receiveMessage = function(event) {
    if (descartesJS.apps.length !== 0) {
      var data = event.data;
      
      // asigna el valor a una variable
      if (data && (data.type === "set")) {
        descartesJS.apps[0].evaluator.setVariable(data.name, data.value);
      }
      
      // actualiza una escena
      else if (data && (data.type === "update")) {
        descartesJS.apps[0].update();
      }
      
// //       // obtiene el valor de una variable
// //       else if (data && (data.type === "get")) {
// //         event.source.postMessage({ type: "getResult", name: data.value, value: descartesJS.apps[0].evaluator.getVariable(data.name) }, '*');
// //       }
// //       
// //       // obtiene el valor de una variable
// //       else if (data && (data.type === "getResult")) {
// // //         descartesJS.apps[0].evaluator.setVariable(data.name, data.value);
// // //         descartesJS.apps[0].update();
// //       }
      
      // ejecuta una funcion
      else if (data && (data.type === "exec")) {
        var fun = descartesJS.apps[0].evaluator.getFunction(data.name);
        var params = [];
        if (data.value !== "") {
          params = (data.value.toString()).split(",");
        }
        
        if (fun) {
          fun.apply(descartesJS.evaluator, params);
        }
      }
      
    }
  }

  // si multiples apariciones de la biblioteca aparecen
  if (descartesJS.loadLib === undefined) {
    descartesJS.loadLib = true;
    // se registra la funcion de inico al evento de carga de la ventana
    window.addEventListener("load", onLoad, false);
    
    // se registra la funcion para paso de mensajes
    window.addEventListener("message", descartesJS.receiveMessage, false);
  }

  return descartesJS;
})(descartesJS || {});

