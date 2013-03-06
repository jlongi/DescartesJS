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
    