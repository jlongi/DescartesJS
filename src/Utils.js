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
