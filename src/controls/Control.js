/**
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
