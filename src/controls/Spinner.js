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
