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

  var fontTokens;
  var fontCanvas;
  var fontName;

  var colorExpr;
  var red;
  var green;
  var blue;
  var alpha;

  var mouseX;
  var mouseY;

  var desp;

  descartesJS.rangeOK = 1;
  
  /**
   * Extends an object with inheritance
   * @param {Object} child is the object that extends
   * @param {Object} parent is the objecto to extends
   */
  descartesJS.extend = function(child, parent) {
    // updated method
    if (typeof Object.create == "function") {
      child.prototype = Object.create(parent.prototype);      
    }
    // old method
    else {
      if (child.prototype.__proto__) {
        child.prototype.__proto__ = parent.prototype;
      }
      else { 
        // copy all the functions of the parent
        for( var i in parent.prototype ) { 
          if (parent.prototype.hasOwnProperty(i)) {
            child.prototype[i] = parent.prototype[i];
          }
        }
      }
    }

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
    if ( typeof(color) == "string" ) {
      return color;
    }
    // if the color has an expression, then evaluate the string and return the corresponding color
    else {
      colorExpr = evaluator.evalExpression(color);
      red   = MathFloor(colorExpr[0][0]*255);
      green = MathFloor(colorExpr[0][1]*255);
      blue  = MathFloor(colorExpr[0][2]*255);
      alpha = (1-colorExpr[0][3]);

      return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
    }    
  }
  
  /**
   * Get some feature needed for the properly interpretation of the Descartes lesson
   */
  descartesJS.getFeatures = function() {
    // detects if the browser has java enable
    descartesJS.hasJavaSupport = navigator.javaEnabled();

    // detects if the browser supports touch events
    var system = navigator.appVersion.toLowerCase();
    descartesJS.hasTouchSupport = ((window.hasOwnProperty) && (window.hasOwnProperty("ontouchstart"))) || (system.match("android")&&true);
    descartesJS.hasTouchSupport = ((navigator.userAgent).toLowerCase()).match("qt") ? false : descartesJS.hasTouchSupport;

    descartesJS.isIOS = !!(navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i));

    // detects if the browser has canvas support
    var elem = document.createElement('canvas');
    descartesJS.hasCanvasSupport = (elem.getContext && elem.getContext('2d'));
    if (descartesJS.hasCanvasSupport) {
      // render context used to measuere text
      descartesJS.ctx = document.createElement("canvas").getContext("2d");

// descartesJS.devicePixelRatio = window.devicePixelRatio || 1;
// descartesJS.backingStoreRatio = descartesJS.ctx.webkitBackingStorePixelRatio ||
//                                 descartesJS.ctx.mozBackingStorePixelRatio ||
//                                 descartesJS.ctx.msBackingStorePixelRatio ||
//                                 descartesJS.ctx.oBackingStorePixelRatio ||
//                                 descartesJS.ctx.backingStorePixelRatio || 1;
// descartesJS._ratio = descartesJS.devicePixelRatio / descartesJS.backingStoreRatio;

      descartesJS._ratio = descartesJS.devicePixelRatio = descartesJS.backingStoreRatio = 1;
    }

    setNewToFixed();
  }

  /**
   * Function that changes the definition of the function toFixed of the Number object
   */
  function setNewToFixed() {
    var strNum;
    var indexOfDot;
    var extraZero;
    var diff;
    
    var indexOfE;
    var exponentialNotationSplit;
    var exponentialNumber;
    var exponentialSign;
    var moveDotTo;

    function getStringExtraZeros(n) {
      return new Array(n+1).join("0");
    }

    // maintain the original toFixed function
    Number.prototype.originalToFixed = Number.prototype.toFixed;

    Number.prototype.toFixed = function(decimals) {
      // if the browser support more than 20 decimals use the browser function otherwise use a custom implementation
      try {
        return this.originalToFixed(decimals);
      }
      catch(e) {
        decimals = (decimals) ? decimals : 0;
        decimals = (decimals<0) ? 0 : parseInt(decimals);

        strNum = this.toString();
        indexOfE = strNum.indexOf("e");

        if (indexOfE !== -1) {
          exponentialNotationSplit = strNum.split("e");
          exponentialSign = (exponentialNotationSplit[0][0] === "-") ? "-" : "";
          exponentialNumber = (exponentialSign === "-") ? parseFloat(exponentialNotationSplit[0].substring(1)).originalToFixed(11) : parseFloat(exponentialNotationSplit[0]).originalToFixed(11);

          moveDotTo = parseInt(exponentialNotationSplit[1]);
          indexOfDot = exponentialNumber.indexOf(".");

          if (indexOfDot+moveDotTo < 0) {
            indexOfDot = (indexOfDot < 0) ? 1 : indexOfDot;
            strNum = exponentialSign + "0." + getStringExtraZeros(Math.abs(indexOfDot+moveDotTo)) + exponentialNumber.replace(".", "");
          }
          else {
            exponentialNumber = exponentialNumber.replace(".", "");
            strNum = exponentialSign + exponentialNumber + getStringExtraZeros(moveDotTo-exponentialNumber.length+1);
          }
        }

        indexOfDot = strNum.indexOf(".");
        extraZero = "";

        // is a float number
        if (indexOfDot === -1) {
          if (decimals > 0) {
            extraZero = ".";
          }

          extraZero += (new Array(decimals+1)).join("0");

          strNum = strNum + extraZero;
        }
        else {
          diff = strNum.length - indexOfDot - 1;

          if (diff >= decimals) {
            if (decimals <= 11) {
              strNum = parseFloat(strNum).originalToFixed(decimals);
            }
            
            strNum = (decimals>0) ? strNum.substring(0, indexOfDot +1 +decimals) : strNum.substring(0, indexOfDot);
          }
          else {
            for (var i=0, l=decimals-diff; i<l; i++) {
              extraZero += "0";
            }

            strNum = strNum + extraZero;
          }
        }

        return strNum;
      }
      // end catch
    }
  }
  
  /**
   *
   */
  descartesJS.removeNeedlessDecimals = function(num) {
    var indexOfDot;
    var decimalNumbers;

    if (typeof(num) == "string") {
      indexOfDot = num.indexOf(".");
      if (indexOfDot != -1) {
        decimalNumbers = num.substring(indexOfDot)

        if (parseFloat(decimalNumbers) == 0) {
          return num.substring(0, indexOfDot);
        }
        else {
          for (var i=decimalNumbers.length; i>0; i--) {
            if (decimalNumbers.charAt(i) != 0) {
              return num.substring(0, indexOfDot+i+1);
            }
          }
        }
        
        return num;        
      }
    }

    return num;
  }

  /**
   *
   */
  descartesJS.returnValue = function(v) {
    if (typeof(v) === "number") {
      return parseFloat(v.toFixed(11));
    }
    return v;
  }

  /**
   * Get which mouse button is pressed
   */
  descartesJS.whichButton = function(evt) {
    // all browsers
    if (evt.which !== null) {
      return (evt.which < 2) ? "L" : ((evt.which === 2) ? "M" : "R");
    }
    // IE
    return (evt.button < 2) ? "L" : ((evt.button === 4) ? "M" : "R");
  }

  /**
   * Get the cursor position in absolute coordinates
   * @param {Event} evt the event that has the cursor postion
   * @return {Object} return the position of the mouse in absolute coordinates
   */
  descartesJS.getCursorPosition = function(evt) {
    // if has touch events
    if (evt.touches) {
      var touch = evt.touches[0];
    
      mouseX = touch.pageX; 
      mouseY = touch.pageY;
    } 
    // if has mouse events
    else {
      // all browsers
      if (evt.pageX != undefined && evt.pageY != undefined) { 
        mouseX = evt.pageX; 
        mouseY = evt.pageY;
      } 
      // IE
      else { 
        mouseX = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mouseY = evt.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
      }
    }

    return { x:mouseX, y:mouseY };
  }
  
  /**
   * Get a screenshot of the lesson
   * @return {Image} return a screenshot image of the lesson
   */
  descartesJS.getScreenshot = function() {
    var app = descartesJS.apps[0];
    var space_i;
    var canvas = document.createElement("canvas");
    var image = new Image();

    if (app) {
      canvas.setAttribute("width", app.width);
      canvas.setAttribute("height", app.height);
      var ctx = canvas.getContext("2d");

      for (var i=0, l=app.spaces.length; i<l; i++) {
        space_i = app.spaces[i];

        // draw the content of a 2D space
        if (space_i.type === "R2") {
          ctx.drawImage(space_i.backgroundCanvas, space_i.x, space_i.y);
          ctx.drawImage(space_i.canvas, space_i.x, space_i.y);

          getScreenshotControls(ctx, space_i.container, space_i.ctrs);
        }
      }

      // draw the north space region
      if (app.northSpace.controls.length > 0) {
        getScreenshotRegion(ctx, app.northSpace.container, app.northSpace);
      }
      // draw the south space region
      if (app.southSpace.controls.length > 0) {
        getScreenshotRegion(ctx, app.southSpace.container, app.southSpace);
      }
      // draw the east space region
      if (app.eastSpace.controls.length > 0) {
        getScreenshotRegion(ctx, app.eastSpace.container, app.eastSpace);
      }
      // draw the west space region
      if (app.westSpace.controls.length > 0) {
        getScreenshotRegion(ctx, app.westSpace.container, app.westSpace);
      }

      image.src = canvas.toDataURL("image/png");
    }

    return image;
  }

  /**
   * Auxiliary function to draw the north, south, east and west regions
   * @param {2DContext} ctx the rendering context to draw
   * @param {HTMLnode} container the html container of the region
   * @param {Space} space the space to draw
   */
  function getScreenshotRegion(ctx, container, space) {
    ctx.fillStyle = "#c0c0c0";

    ctx.fillRect(container.offsetLeft, 
                 container.offsetTop, 
                 container.offsetWidth, 
                 container.offsetHeight);

    getScreenshotControls(ctx, container, space.controls);
  }

  /**
   * Auxiliary function to draw the controls of a space
   * @param {2DContext} ctx the rendering context to draw
   * @param {HMTLnode} container the html container of the space
   * @param {Array<Control>} controls the controls of the space to draw
   */
  function getScreenshotControls(ctx, container, controls) {
    var ctr_i;

    for (var i=controls.length-1; i>=0; i--) {
      ctr_i = controls[i];

      ctx.drawImage(ctr_i.getScreenshot(), container.offsetLeft + ctr_i.x, container.offsetTop + ctr_i.y);
    }
  }

  var htmlAbout = 
  "<html>\n" +
  "<head>\n" +
  "<style>\n" +
  "body{ text-align:center; }\n" +
  "iframe{ width:650px; height:73px; overflow:hidden; border:1px solid black; }\n" +
  "dt{ font-weight:bold; margin-top:10px; }\n" +
  "</style>\n" +
  "</head>\n" +
  "<body>\n" +
  "<iframe src='http://arquimedes.matem.unam.mx/Descartes5/creditos/bannerPatrocinadores.html'></iframe>\n" +
  "<h2> <a href='http://proyectodescartes.org/' target='_blank'>ProyectoDescartes.org</a> <br> <a href='http://descartesjs.org' target='_blank'>DescartesJS.org</a> </h2>\n" +
  "<dl>\n" +
  "<dt> Dise&ntilde;o funcional:</dt>\n" +
  "<dd>\n" +
  "<nobr>Jos&eacute; Luis Abreu Leon,</nobr>\n" +
  "<nobr>Jos&eacute; R. Galo Sanchez,</nobr>\n" +
  "<nobr>Juan Madrigal Muga</nobr>\n" +
  "</dd>\n" +
  "<dt>Autores del software:</dt>\n" +
  "<dd>\n" +
  "<nobr>Jos&eacute; Luis Abreu Leon,</nobr>\n" +
  "<nobr>Marta Oliver&oacute; Serrat,</nobr>\n" +
  "<nobr>Oscar Escamilla Gonz&aacute;lez,</nobr>\n" +
  "<nobr>Joel Espinosa Longi</nobr>\n" +
  "</dd>\n" +
  "</dl>\n" +
  "<p>\n" +
  "El software en Java est&aacute; bajo la licencia\n" +
  "<a href='https://joinup.ec.europa.eu/software/page/eupl/licence-eupl'>EUPL v.1.1 </a>\n" +
  "<br>\n" +
  "El software en JavaScript est&aacute; bajo licencia\n" +
  "<a href='http://www.gnu.org/licenses/lgpl.html'>LGPL</a>\n" +
  "</p>\n" +
  "<p>\n" +
  "La documentaci&oacute;n y el c&oacute;digo fuente se encuentran en :\n" +
  "<br>\n" +
  "<a href='http://arquimedes.matem.unam.mx/Descartes5/'>http://arquimedes.matem.unam.mx/Descartes5/</a>\n" +
  "</p>\n";

  var htmlCreative = "<p>\n" +
  "Este objeto, creado con Descartes, est&aacute; licenciado\n" +
  "por sus autores como\n" +
  "<a href='http://creativecommons.org/licenses/by-nc-sa/4.0/'><nobr>Creative Commons</nobr></a>\n" +
  "<br>\n" +
  "<a href='http://creativecommons.org/licenses/by-nc-sa/4.0/'><img src='https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png'></a>\n" +
  "</p>";

  var htmlFinal = "</body> </html>";

  /**
   *
   */
  descartesJS.showAbout = function() {
    var content;
    if (descartesJS.creativeCommonsLicense) {
      content = htmlAbout + htmlCreative + htmlFinal;
    }
    else {
      content = htmlAbout + htmlFinal;
    }

    var tmpW = window.open("", "creditos", "width=700,height=500,titlebar=0,toolbar=0,location=0,menubar=0,resizable=0,scrollbars=0,status=0");
    tmpW.document.write(content);
    tmpW.document.close();
  }

  return descartesJS;
})(descartesJS || {});