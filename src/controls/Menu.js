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
