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

  var colorExpr;

  var touch;
  var mouseX;
  var mouseY;
  var boundingRect;

  var desp;

  descartesJS.rangeOK = 1;
  descartesJS.cssScale = 1;

  /**
   * Extends an object with inheritance
   * @param {Object} child is the object that extends
   * @param {Object} parent is the objecto to extends
   */
  descartesJS.extend = function(child, parent) {
    child.prototype = Object.create(parent.prototype);

    // add the uber (super) property to execute functions of the parent
    child.prototype.uber = parent.prototype;
  }

  /**
   * Converts radians to degrees
   * @param {Number} r the radian to convert
   * @return {Number} return the convertion to degrees of the number r
   */
  descartesJS.radToDeg = function(r) {
    return r*trecientosSesentaEntreDosPi;
  }

  /**
   * Converts degrees to radians
   * @param {Number} d the degree to convert
   * @return {Number} return the convertion to radians of the number d
   */
  descartesJS.degToRad = function(d) {
    return d*dosPiEntreTrecientosSesenta;
  }

  /**
   * Function for draw the spinner control, that draws a line
   * @param {2DContext} ctx the canvas context to draw
   * @param {Number} x1 the x position of the initial point
   * @param {Number} y1 the y position of the initial point
   * @param {Number} x2 the x position of the final point
   * @param {Number} y2 the y position of the final point
   * @param {String} strokeStyle the style of the stroke used to draw the line
   * @param {Number} lineWidth the width of the line to draw
   */
  descartesJS.drawLine = function(ctx, x1, y1, x2, y2, strokeStyle, lineWidth) {
    ctx.lineWidth = lineWidth || 1;
    ctx.strokeStyle = strokeStyle || "black";
    desp = (ctx.lineWidth%2) ? .5 : 0;

    ctx.beginPath();
    ctx.moveTo(MathFloor(x1)+desp, MathFloor(y1)+desp);
    ctx.lineTo(MathFloor(x2)+desp, MathFloor(y2)+desp);
    ctx.stroke();
  }

  /**
   * Get a color string from a Descartes color
   * @param {DescartesJS.Evaluator} evaluator the evaluator needed for evaluate the posible expressions
   * @param {String|Object} color Descartes color especification
   * @return {String} return a string corresponding to the color
   */
  descartesJS.getColor = function(evaluator, color) {
    // if the color is a string then return that string color
    if ( typeof(color) === "string" ) {
      return color;
    }
    // if the color has an expression, then evaluate the string and return the corresponding color
    else {
      colorExpr = evaluator.eval(color);
      return "rgba(" + MathFloor(colorExpr[0][0]*255) + "," + MathFloor(colorExpr[0][1]*255) + "," + MathFloor(colorExpr[0][2]*255) + "," + (1-colorExpr[0][3]) + ")";
    }
  }

  /**
   * Get some feature needed for the properly interpretation of the Descartes lesson
   */
  descartesJS.getFeatures = function() {
    // detects if the browser supports touch events
    var system = navigator.appVersion.toLowerCase();
    descartesJS.hasTouchSupport = ((window.hasOwnProperty) && (window.hasOwnProperty("ontouchstart"))) || ("ontouchstart" in window) || ((/android/i).test(system));

    descartesJS.isIOS = (/iPad|iPhone/i).test(navigator.userAgent);
    descartesJS.isMsEdge = (/Edge/i).test(navigator.userAgent);

    // detects if the browser has canvas support
    var elem = document.createElement("canvas");
    descartesJS.hasCanvas = (elem.getContext && elem.getContext("2d"));

    if (descartesJS.hasCanvas) {
      // render context used to measuere text
      descartesJS.ctx = descartesJS.hasCanvas;

      // descartesJS._ratio = window.devicePixelRatio || 1;
      // descartesJS._ratio = 1.5;
      descartesJS._ratio = (descartesJS.isIOS) ? 1.2 : 1.5;
    }

    setNewToFixed();
  }

  function setNewToFixed() {
    var strNum;
    var indexOfDot;
    var diff;
    var exponentialSplit;
    var exponentialNumber;
    var exponentialSign;
    var moveDotTo;

    // maintain the original toFixed function
    Number.prototype.oToFixed = Number.prototype.toFixed;

    Number.prototype.toFixed = function(decimals) {
      decimals = (decimals) || 0;
      decimals = (decimals < 0) ? 0 : parseInt(decimals);

      strNum = this.toString();
      if (strNum.indexOf("e") !== -1) {
        exponentialSplit = strNum.split("e");
        exponentialSign = (exponentialSplit[0][0] === "-") ? "-" : "";
        exponentialNumber = (exponentialSign === "-") ? parseFloat(exponentialSplit[0].substring(1)).oToFixed(11) : parseFloat(exponentialSplit[0]).oToFixed(11);

        moveDotTo = parseInt(exponentialSplit[1]);
        indexOfDot = exponentialNumber.indexOf(".");
        exponentialNumber = exponentialNumber.replace(".", "");

        if (indexOfDot+moveDotTo < 0) {
          indexOfDot = (indexOfDot < 0) ? 1 : indexOfDot;
          strNum = exponentialSign + "0." + ("0").repeat(Math.abs(indexOfDot+moveDotTo)) + exponentialNumber;
        }
        else {
          strNum = exponentialSign + exponentialNumber + ("0").repeat(moveDotTo-exponentialNumber.length+1);
        }
      }

      indexOfDot = strNum.indexOf(".");
      
      // is a float number
      if (indexOfDot === -1) {
        if (decimals > 0) {
          strNum += "." + ("0").repeat(decimals);
        }
      }
      else {
        diff = strNum.length - indexOfDot - 1;
       
        if (diff >= decimals) {
          if (decimals <= 11) {
            strNum = parseFloat(strNum).oToFixed(decimals);
          }
          else {
            strNum = strNum.substring(0, indexOfDot +decimals +1);
          }
        }
        else {
          strNum += ("0").repeat(decimals-diff);
        }
      }

      return strNum;
    }
  }

  var indexOfDot;
  var decimalNumbers;

  /**
   *
   */
  descartesJS.removeNeedlessDecimals = function(num) {
    if (typeof(num) == "string") {
      indexOfDot = num.indexOf(".");

      if (indexOfDot !== -1) {
        decimalNumbers = num.substring(indexOfDot);

        if (parseFloat(decimalNumbers) == 0) {
          return num.substring(0, indexOfDot);
        }
        else {
          for (var i=decimalNumbers.length-1; i>0; i--) {
            if (decimalNumbers.charAt(i) !== "0") {
              return num.substring(0, indexOfDot+i+1);
            }
          }
        }
      }
    }

    return num;
  }

  /**
   *
   */
  descartesJS.returnValue = function(v) {
    return (typeof(v) === "number") ? parseFloat(v.toFixed(11)) : v;
  }

  /**
   * Get which mouse button is pressed
   */
  descartesJS.whichBtn = function(evt) {
    return (evt.which < 2) ? "L" : ((evt.which === 2) ? "M" : "R");
  }

  /**
   * Get the cursor position in absolute coordinates
   * @param {Event} evt the event that has the cursor postion
   * @return {Object} return the position of the mouse in absolute coordinates
   */
  descartesJS.getCursorPosition = function(evt, container) {
    // if has touch events
    if (evt.touches) {
      touch = evt.touches[0];

      mouseX = touch.pageX;
      mouseY = touch.pageY;
    }
    // if has mouse events
    else {
      mouseX = evt.pageX;
      mouseY = evt.pageY;
    }

    boundingRect = container.getBoundingClientRect();

    // considerar para la escala por transformacion de css
    return { 
      x: (mouseX -window.pageXOffset -boundingRect.left)/descartesJS.cssScale,
      y: (mouseY -window.pageYOffset -boundingRect.top)/descartesJS.cssScale
    }
  }

  // get the animation frame functions
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  /**
   *
   */
  descartesJS.setInterval = function(fun, delay) {
    if (!requestAnimationFrame) {
      return setInterval(fun, delay);
    }

    var start = Date.now();
    var handle = {};

    function loop() {
      if ((Date.now() - start) >= delay) {
        fun.call();
        start = Date.now();
      }

      handle.value = requestAnimationFrame(loop);
    };

    handle.value = requestAnimationFrame(loop);
    return handle;
  }

  /**
   *
   */
  descartesJS.clearInterval = function(handle) {
    if (handle) {
      (cancelAnimationFrame) ? cancelAnimationFrame(handle.value) : clearInterval(handle);
    }
  }

  /**
   *
   */
  descartesJS.setTimeout = function(fun, delay) {
    if (!requestAnimationFrame) {
      return setTimeout(fun, delay);
    }

    var start = Date.now();
    var handle = {};

    function loop() {
      if ((Date.now() - start) >= delay) {
        fun.call();
      }
      else {
        handle.value = requestAnimationFrame(loop);
      }
    };

    handle.value = requestAnimationFrame(loop);
    return handle;
  }

  /**
   *
   */
  descartesJS.clearTimeout = function(handle) {
    if (handle) {
      (cancelAnimationFrame) ? cancelAnimationFrame(handle.value) : clearTimeout(handle);
    }
  }

  var htmlAbout =
`<html>
<head>
<style>
body{text-align:center;}
iframe{width:650px;height:73px;overflow:hidden;border:1px solid black;}
dt{font-weight:bold;margin-top:10px;}
</style>
</head>
<body>
<iframe src='http://arquimedes.matem.unam.mx/Descartes5/creditos/bannerPatrocinadores.html'></iframe>
<h2><a href='http://proyectodescartes.org/' target='_blank'>ProyectoDescartes.org</a><br><a href='http://descartesjs.org' target='_blank'>DescartesJS.org</a></h2>
<dl>
<dt>Diseño funcional:</dt>
<dd>
<nobr>José Luis Abreu Leon,</nobr>
<nobr>José R. Galo Sanchez,</nobr>
<nobr>Juan Madrigal Muga</nobr>
</dd>
<dt>Autores del software:</dt>
<dd>
<nobr>José Luis Abreu Leon,</nobr>
<nobr>Marta Oliverá Serrat,</nobr>
<nobr>Oscar Escamilla González,</nobr>
<nobr>Joel Espinosa Longi</nobr>
</dd></dl>
<p>
El software en Java está bajo la licencia
<a href='https://joinup.ec.europa.eu/software/page/eupl/licence-eupl'>EUPL v.1.1</a>
<br>
El software en JavaScript está bajo licencia
<a href='http://www.gnu.org/licenses/lgpl.html'>LGPL</a>
</p>
<p>
La documentación y el código fuente se encuentran en :
<br>
<a href='http://descartes.matem.unam.mx/'>http://descartes.matem.unam.mx/</a>
</p>`;

  var htmlCreative = 
`<p>
Este objeto, creado con Descartes, está licenciado
por sus autores como
<a href='https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es'><nobr>Creative Commons</nobr></a>
<br>
<a href='https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es'><img src='https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png'></a>
</p>`;

  var htmlFinal = "</body> </html>";

  /**
   *
   */
  descartesJS.showAbout = function() {
    var content = htmlAbout;
    if (descartesJS.ccLicense) {
      content += htmlCreative;
    }
    content += htmlFinal;

    var tmpW = window.open("", "creditos", "width=700,height=500,titlebar=0,toolbar=0,location=0,menubar=0,resizable=0,scrollbars=0,status=0");
    tmpW.document.write(content);
    tmpW.document.close();
  }

  /**
   *
   */
  descartesJS.splitSeparator = function(value) {
    value = value.replace(/\\n/g, "\n");

    var inStr = false;
    var charAt;
    var valueArray = [];
    var lastIndex = 0;

    for (var i=0, l=value.length; i<l; i++) {
      charAt = value.charAt(i);
      // inside or outside of a string
      if (charAt === "'") {
        inStr = !inStr;
      }

      // if outside of a string then replace \\n and ; for a new line
      if ((!inStr) && ( (charAt === ";") || (charAt === "\n") ) ) {
        valueArray.push(value.substring(lastIndex, i).replace(/\n/g, "\\n"));
        lastIndex = i+1;
      }
    }
    valueArray.push(value.substring(lastIndex).replace(/\n/g, "\\n"));

    return valueArray;
  }

  descartesJS.preventDefault = function(evt) {
    evt.preventDefault();
    return false;
  }

  return descartesJS;
})(descartesJS || {});
