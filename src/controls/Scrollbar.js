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
