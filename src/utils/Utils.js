/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  const tri_pi2 = 360/(Math.PI*2);
  const pi2_tri = (Math.PI*2)/360;
  const MathFloor = Math.floor;

  let pointer;
  let boundingRect;
  let indexOfDot;
  let decimalNumbers;

  descartesJS.rangeOK = 1;
  descartesJS.cssScale = 1;

  /**
   * Converts radians to degrees
   * @param {Number} r the radian to convert
   * @return {Number} return the conversion to degrees of the number r
   */
  descartesJS.radToDeg = function(r) {
    return r*tri_pi2;
  }

  /**
   * Converts degrees to radians
   * @param {Number} d the degree to convert
   * @return {Number} return the conversion to radians of the number d
   */
  descartesJS.degToRad = function(d) {
    return d*pi2_tri;
  }

  /**
   * Get some feature needed for the properly interpretation of the Descartes lesson
   */
  descartesJS.getFeatures = function() {
    // detects if the browser supports touch events
    let system = "";
    try {
      system = navigator.appVersion.toLowerCase();
    }
    catch(e) { console.warn("navigator.appVersion is deprecated"); };
    descartesJS.hasTouchSupport = ((window.hasOwnProperty) && (window.hasOwnProperty("ontouchstart"))) || ("ontouchstart" in window) || ((/android/i).test(system));

    descartesJS.isIOS = (/iPad|iPhone/i).test(navigator.userAgent);
    descartesJS.isMsEdge = (/Edge/i).test(navigator.userAgent);

    // detects if the browser has canvas 2D support
    let elem = descartesJS.newHTML("canvas");
    descartesJS.hasCanvas = (elem.getContext && elem.getContext("2d"));

    if (descartesJS.hasCanvas) {
      elem.width = elem.height = 1;
      // render context used to measure text
      descartesJS.ctx = descartesJS.hasCanvas;

      // descartesJS._ratio = window.devicePixelRatio || 1;
      // descartesJS._ratio = (descartesJS.isIOS) ? 1.25 : Math.max(1.5, window.devicePixelRatio);
      descartesJS._ratio = 2;
    }

    setNewToFixed();
  }

  function setNewToFixed() {
    let strNum;
    let indexOfDot;
    let diff;
    let exponentialSplit;
    let exponentialNumber;
    let exponentialSign;
    let moveDotTo;

    // maintain the original toFixed function
    Number.prototype.oToFixed = Number.prototype.toFixed;

    Number.prototype.toFixed = function(decimals = 0) {
      decimals = Math.max(0, parseInt(decimals));
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
          for (let i=decimalNumbers.length-1; i>0; i--) {
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
   * Get which mouse button is pressed
   */
  descartesJS.whichBtn = function(evt) {
    if (evt.touches) {
      return "L";
    }
    else {
      return (evt.button === 0) ? "L" : ((evt.button === 1) ? "M" : "R");
    }
  }

  /**
   * Create gradient for buttons
   */
  descartesJS.createGradient = function(start=0, end=100, rotate=0) {
    let h = 100;
    let hh = h*h;
    let di;
    let str = `linear-gradient(${rotate}deg,`;
    let c = start*2;

    for (let i=start; i<end; i++) {
      di = MathFloor(100-i-(35*h)/100);
      str += `rgba(0,0,0,${((di*di*192)/hh)/255}) ${i*2 - c}%, `;
    }

    str += `rgba(0,0,0,0.1) 100%)`;
    return str;
  }

  /**
   * Get the cursor position in absolute coordinates
   * @param {Event} evt the event that has the cursor position
   * @return {Object} return the position of the mouse in absolute coordinates
   */
  descartesJS.getCursorPosition = function(evt, container) {
    pointer = (evt.touches) ? evt.touches[0] : evt;
    boundingRect = container.getBoundingClientRect();

    if (pointer) {
      // consider for the scale by css transformation
      return { 
        x: (pointer.pageX -window.scrollX -boundingRect.left) / descartesJS.cssScale,
        y: (pointer.pageY -window.scrollY -boundingRect.top)  / descartesJS.cssScale
      }
    }
    else {
      return null;
    }
  }

  /**
   *
   */
  descartesJS.splitSeparator = function(value) {
    value = value.replace(/\\n/g, "\n");

    let inStr = false;
    let charAt;
    let valueArray = [];
    let lastIndex = 0;

    for (let i=0, l=value.length; i<l; i++) {
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

  /**
   *
   */
  descartesJS.preventDefault = function(evt) {
    evt.preventDefault();
    return false;
  }

  /**
   *
   */
  descartesJS.convertHTMLEntities = function(html) {
    let txt = descartesJS.newHTML("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  /**
   *
   */
  descartesJS.newHTML = function(tag, attributes) {
    let dom = document.createElement(tag);
    for (let attr in attributes) {
      dom.setAttribute(attr, attributes[attr]);
    }
    return dom;
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

    let start = Date.now();
    let handle = {};

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

    let start = Date.now();
    let handle = {};

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

  const htmlAbout =
`<html>
<head>
<style>
body{text-align:center;}
iframe{width:650px;height:73px;overflow:hidden;border:1px solid black;}
dt{font-weight:bold;margin-top:10px;}
</style>
</head>
<body>
<iframe src='https://arquimedes.matem.unam.mx/Descartes5/creditos/bannerPatrocinadores.html'></iframe>
<h2><a href='https://proyectodescartes.org/' target='_blank'>ProyectoDescartes.org</a><br><a href='https://descartesjs.org' target='_blank'>DescartesJS.org</a></h2>
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
<a href='https://www.gnu.org/licenses/lgpl.html'>LGPL</a>
</p>
<p>
La documentación y el código fuente se encuentran en :
<br>
<a href='https://descartes.matem.unam.mx/'>https://descartes.matem.unam.mx/</a>
</p>`;

  const htmlCreative = 
`<p>
Este objeto, creado con Descartes, está licenciado
por sus autores como
<a href='https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es'><nobr>Creative Commons</nobr></a>
<br>
<a href='https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es'><img src='https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png'></a>
</p>`;

  const htmlFinal = "</body> </html>";

  /**
   *
   */
  descartesJS.showAbout = function() {
    let content = htmlAbout;
    if (descartesJS.ccLicense) {
      content += htmlCreative;
    }
    content += htmlFinal;

    let tmpW = window.open("", "creditos", "width=700,height=500,titlebar=0,toolbar=0,location=0,menubar=0,resizable=0,scrollbars=0,status=0");
    tmpW.document.write(content);
    tmpW.document.close();
  }

  return descartesJS;
})(descartesJS || {});
