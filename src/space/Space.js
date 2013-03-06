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
