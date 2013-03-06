/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un grafico de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen un grafico de descartes
   */
  descartesJS.Graphic = function(parent, values) {
    /**
     * La aplicacion de descartes a la que corresponde el grafico
     * type DescartesApp
     * @private
     */
    this.parent = parent;

    var parser = this.parent.evaluator.parser;
    
    /**
     * Objeto para el parseo y evaluacion de expresiones
     * type {Evaluator}
     * @private
     */
    this.evaluator = parent.evaluator;
    
    /**
     * El identificador del espacio al que pertenece el elemento grafico
     * type String
     * @private
     */
    this.spaceID = "E0";

    /**
     * El tipo de grafico
     * type String
     * @private
     */
    this.type = "";

    /**
     * La condicion para determinar si el grafico se dibuja en el fondo
     * type String
     * @private
     */
    this.background = false;

    /**
     * El color principal del grafico
     * type String
     * @private
     */
    if (this.parent.version != 2) {
//     if (this.parent.code == "descinst.com.mja.descartes.DescartesJS.class") {
      this.color = "#20303a";
//     } else {
//       this.color = "#000000";
//     }

      // ##ARQUIMEDES## //
      if (this.parent.arquimedes) {
        this.color = "black";
      }
      // ##ARQUIMEDES## //

    } else {
      this.color = "blue";
    }
    
    /**
     * La condicion de dibujado del grafico
     * type Boolean
     * @private
     */
    this.drawif = parser.parse("1");
    
    /**
     * La condicion para determinar si el grafico se dibuja en coordenadas absolutas
     * type Boolean
     * @private
     */
    this.abs_coord = false;
    
    /**
     * Expresion que determina la posicion y el tamanio del grafico
     * type String
     * @private
     */
//     this.expresion = parser.parse("(0,0)");

    /**
     * El color del rastro que deja el grafico
     * type String
     * @private
     */
    this.trace = "";

    /**
     * La condicion y el parametro que se utilizan para dibujar el grafico como una familia
     * type String
     * @private
     */
    this.family = "";

    /**
     * El intervalo utilizado para dibujar el grafico como una familia
     * type String
     * @private
     */
    this.family_interval = parser.parse("[0,1]");

    /**
     * El numero de pasos que se utiliza para dibujar el grafico como una familia
     * type Number
     * @private
     */
    this.family_steps = parser.parse("8");
    
    /**
     * El parametro que se utilizan para dibujar una curva
     * type String
     * @private
     */
    this.parameter = "t";

    /**
     * El intervalo utilizado para dibujar una curva
     * type String
     * @private
     */
    this.parameter_interval = parser.parse("[0,1]");

    /**
     * El numero de pasos que se utiliza para dibujar una curva
     * type Number
     * @private
     */
    this.parameter_steps = parser.parse("8");

    /**
     * La condicion y el color del relleno del grafico
     * type String
     * @private
     */
    this.fill = "";

    /**
     * La condicion y el color fill+
     * type String
     * @private
     */
    this.fillP = ""; 

    /**
     * La condicion y el color fill+
     * type String
     * @private
     */
    this.fillM = "";

    /**
     * El ancho del trazo del grafico
     * type Number
     * @private
     */
    this.width = -1;

    /**
     * La condicion para determinar ???
     * type Boolean
     * @private
     */
//     this.visible = false;

    /**
     * La condicion para determinar si una escuacion es editable
     * type Boolean
     * @private
     */
    this.editable = false;

    /**
     * La informacion de ???
     * type Boolean
     * @private
     */
    this.info = "";

    /**
     * La tipografia de info
     * type Boolean
     * @private
     */
    this.font = "Monospaced,PLAIN,12";
    
    /**
     * La condicion para determinar si el texto mostrado debe ser fijo o no
     * type Boolean
     * @private
     */
    this.fixed = true;

    /**
     * El ancho del punto
     * type Number
     * @private
     */
    this.size = parser.parse("2");

    /**
     * El texto de los graficos
     * type String
     * @private
     */
    this.text = "";

    /**
     * El numero de decimales que se muestran en el texto
     * type Number
     * @private
     */
    this.decimals = parser.parse("2");

    /**
     * El tamanio de la punta de un grafico (una flecha)
     * type Number
     * @private
     */
    this.spear = parser.parse("8");

    /**
     * El color interior de un grafico (una flecha)
     * type String
     * @private
     */
    this.arrow = "#ee0022";

    /**
     * La posicion del centro de un grafico (un circulo)
     * type String
     * @private
     */
    this.center = parser.parse("(0,0)");

    /**
     * El radio de un grafico (un circulo)
     * type Number
     * @private
     */
    this.radius = parser.parse("1");

    /**
     * El angulo o vector inicial de un grafico (un circulo)
     * type Number
     * @private
     */
    this.init = parser.parse("0");

    /**
     * El angulo o vector final de un grafico (un circulo)
     * type Number
     * @private
     */
    this.end = parser.parse("90");

    /**
     * El nombre del archivo de un grafico (una imagen)
     * type String
     * @private
     */
    this.file = "";

    /**
     * La rotacion de un grafico (una imagen)
     * type Number
     * @private
     */
    this.inirot = parser.parse("0");
    
    /**
     * La posicion de un macro
     * type Number
     * @private
     */
//     this.inipos = parser.parse("[0,0]");
    
    // se recorre values para reemplazar los valores iniciales del control
    for (var propName in values) {
      // solo se verifican las propiedades propias del objeto values
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }
    
    if ((this.expresion == undefined) && (this.type != "macro")) {
      this.expresion = parser.parse("(0,0)");
    }

    // se obtiene el espacio al que pertenece el grafico
    this.space = this.getSpace();

    if (this.background) {
      this.canvas = this.space.backgroundCanvas;
    } else {
      this.canvas = this.space.canvas;
    }
    this.ctx = this.canvas.getContext("2d");
    
    // si el objeto deja rastro, se obtiene el contexto de render del fondo
    if (this.trace) {
      this.traceCtx = this.space.backgroundCanvas.getContext("2d");
    }
    
    this.font = descartesJS.convertFont(this.font)
  }  
  
  /**
   * Obtiene el espacio al cual pertenece el grafico
   * return {Space} el espacio al cual pertenece el grafico
   */
  descartesJS.Graphic.prototype.getSpace = function() {
    var spaces = this.parent.spaces;
    var space_i;
    // se busca el espacio al que pertenece
    for (var i=0, l=spaces.length; i<l; i++) {
      space_i = spaces[i];
      if (space_i.id == this.spaceID) {
//         spaces[i].addGraph(this);
        return space_i;
      }
    }
    
    // si no encuentra un espacio con el identificador registrado entonces el grafico se agrega al primer espacio de la leccion
    return spaces[0];
  }
  
  /**
   * Obtiene los valores de la familia
   */
  descartesJS.Graphic.prototype.getFamilyValues = function() {
    var evaluator = this.evaluator;
    var expr = evaluator.evalExpression(this.family_interval);
    this.familyInf = expr[0][0];
    this.familySup = expr[0][1];
    this.fSteps = Math.round(evaluator.evalExpression(this.family_steps));
    this.family_sep = (this.fSteps > 0) ? (this.familySup - this.familyInf)/this.fSteps : 0;
  }
  
  /**
   * Funcion auxiliar para dibujar la familia
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja
   * @param {String} fill el color de relleno del grafico
   * @param {String} stroke el color del trazo del grafico
   */
  descartesJS.Graphic.prototype.drawFamilyAux = function(ctx, fill, stroke) {
    var evaluator = this.evaluator;

    // se actualizan los valores de la familia
    this.getFamilyValues();

    // se guarda el ultimo valor que tenia la variable family
    var tempParam = evaluator.getVariable(this.family);

    if (this.fSteps >= 0) {
      // se dibujan todos los miembros de la familia
      for(var i=0, l=this.fSteps; i<=l; i++) {
        // se modifica el valor de la variable family
        evaluator.setVariable(this.family, this.familyInf+(i*this.family_sep));
                
        // si la condicion de dibujo del elemento es verdadera entonces se actualiza y dibuja el elemento
        if ( evaluator.evalExpression(this.drawif) > 0 ) {
          // se actualizan los valores antes de dibujar el elemento
          this.update();
          // se dibuja el elemento
          this.drawAux(ctx, fill, stroke);
        }
      }
    }

    evaluator.setVariable("_Text_H_", 0);
    evaluator.setVariable(this.family, tempParam);
  }

  /**
   * Dibuja el grafico
   * @param {String} fill el color de relleno del grafico
   * @param {String} stroke el color del trazo del grafico
   */
  descartesJS.Graphic.prototype.draw = function(fill, stroke) {
    // si la familia esta activada entonces se dibujan varias veces los elementos
    if (this.family != "") {
      this.drawFamilyAux(this.ctx, fill, stroke);
    }
    
    // si la familia no esta activada
    // si la condicion de dibujo del elemento es verdadera entonces se actualiza y dibuja el elemento
    else  {
      // se dibuja el elemento
      if ( this.evaluator.evalExpression(this.drawif) > 0 ) {
        // se actualizan los valores antes de dibujar el elemento
        this.update();
        // se dibuja el elemento
        this.drawAux(this.ctx, fill, stroke);
      }
    }
  }
  
  /**
   * Se dibuja el rastro del grafico
   * @param {String} fill el color de relleno del punto
   * @param {String} stroke el color del trazo del punto
   */
  descartesJS.Graphic.prototype.drawTrace = function(fill, stroke) {
    // si la familia esta activada entonces se dibujan varias veces los elementos
    if (this.family != "") {
      this.drawFamilyAux(this.traceCtx, fill, stroke);
    }
    
    // si la familia no esta activada
    else {      
      // se dibuja el elemento
      if ( this.evaluator.evalExpression(this.drawif) > 0 ) {
        // se actualizan los valores antes de dibujar el elemento
        this.update();
        // se dibuja el elemento
        this.drawAux(this.traceCtx, fill, stroke);
      }
    }
  }

  /**
   * Se dibuja el texto del grafico
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja
   * @param {String} text el texto a dibujar
   * @param {Number} x la posicion en x del texto
   * @param {Number} y la posicion en y del texto
   * @param {String} fill el color de relleno del punto
   * @param {String} font la tipografia del texto
   * @param {String} align la alineacion del texto
   * @param {String} baseline la base sobre la que se dibuja el texto
   * @param {Number} decimals el numero de decimales del texto
   * @param {Boolean} fixed el texto esta en notacion fija
   */
  descartesJS.Graphic.prototype.drawText = function(ctx, text, x, y, fill, font, align, baseline, decimals, fixed) {
    // texto en rtf
    if (text.type == "rtfNode") {
      ctx.fillStyle = fill;
      ctx.strokeStyle = fill;
      ctx.textBaseline = "alphabetic";
      text.draw(ctx, x, y, decimals, fixed, align);
      
      return;
    }

    // texto del tipo simple text
    if (text.type === "simpleText") {
      text = text.toString(decimals, fixed).split("\\n");
    }

    x = x + (font.match("Arial") ? -2 : (font.match("Times") ? -2: 0));
    var evaluator = this.evaluator;
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    
    this.fontSize = font.match(/(\d+)px/);
    if (this.fontSize) {
      this.fontSize = this.fontSize[1];
    } else {
      this.fontSize = "10";
    } 
    
    if (this.border) {
      ctx.strokeStyle = descartesJS.getColor(evaluator, this.border);
      ctx.lineWidth = parseFloat(this.fontSize)/12;
    }
    
    var theText;
    var verticalDisplace = this.fontSize*1.2;

    // condicion que se checa para el ancho del texto
    // si el "tipo" de los elementos contenidos en el texto existe, significa que es algo parseado
    for (var i=0, l=text.length; i<l; i++) {
      theText = text[i];
      if (this.border) {
        ctx.strokeText(theText, x, y+(verticalDisplace*i));
      }
      ctx.fillText(theText, x, y+(verticalDisplace*i));
    }
  }

  return descartesJS;
})(descartesJS || {});