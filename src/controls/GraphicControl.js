/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var PI2 = Math.PI*2;
  
  /**
   * Un control de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen un control de descartes
   */
  descartesJS.GraphicControl = function(parent, values) {
    /**
     * La aplicacion de descartes a la que corresponde el control
     * type DescartesApp
     * @private
     */
    this.parent = parent;
    this.evaluator = parent.evaluator;
    var parser = this.evaluator.parser;
    
    /**
     * El identificador del control
     * type String
     * @private
     */
    this.id = "G";

    /**
     * El tipo del control, si es numero o grafico 
     * type String
     * @private
     */
    this.type = "";
    
    /**
     * Nombre del espacio al cual pertenece el control
     * type String
     * @private
     */
    this.spaceID = "E0";

    /**
     * Texto que presenta el control
     * type String
     * @private
     */
    this.text = "";
    
    /**
     * Expresion que determina la posicion y el tamanio del control
     * type String
     * @private
     */
    this.expresion = parser.parse("(0,0)");

    /**
     * La restriccion de posicion del control
     * type String
     * @private
     */
    this.constraint;

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
     * El tamano del control
     * type Number
     * @private
     */
    this.size = parser.parse("4");

    /**
     * La condicion para determinar si los numeros del control utilizan notacion fija
     * type Boolean
     * @private
     */
    this.fixed = (this.parent.version != 2) ? false : true;

    /**
     * El color del borde del control
     * type String
     * @private
     */
    this.color = "#0000ff";

    /**
     * El color del control
     * type String
     * @private
     */
    this.colorInt = "#ff0000";

    /**
     * El tipo de la tipografia del control
     * type String
     * @private
     */
    this.font = "Monospaced,PLAIN,12";
    
    /**
     * La imagen del control
     * type Image
     * @private
     */
    this.image = new Image();
    var self = this;
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
     * El numero de decimales a mostrar en el control
     * type Number
     * @private
     */
    this.decimals = parser.parse("2");

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
    
    // se construye la cadena para la tipografia del texto del control grafico
    this.font = descartesJS.convertFont(this.font);
    
    // se construye la constriccion
    if (this.constraintExpr) {
      this.constraint = parser.parse(this.constraintExpr);
      
      if (this.constraint.type == "(expr)") {
        this.constraint = parser.parse(this.constraintExpr.substring(1, this.constraintExpr.length-1));
      }

      if (this.constraint.type == "compOperator") {
        var left = this.constraint.childs[0];
        var right = this.constraint.childs[1];
        this.newt = new descartesJS.R2Newton(this.evaluator, this.constraint);
      } else {
        this.constraint = null;
      }
    }

    // se obtiene el contenedor al cual pertenece el control
    this.container = this.getContainer();
    this.space = this.getSpace();
    this.mouseCacher = document.createElement("div");
    this.mouseCacher.setAttribute("class", "DescartesGraphicControl");
    this.mouseCacher.setAttribute("id", this.id);
//     this.mouseCacher.setAttribute("dragged", true);
    this.mouseCacher.setAttribute("tabindex", "-1"); 
    this.ctx = this.space.ctx;
    this.container.appendChild(this.mouseCacher);
    
    this.init();

    // se registran los eventos del mouse, cuando se de soporte a dispositivos moviles se deben de registrar los eventos correspondientes
    this.registerMouseEvents();
  }
  
  /**
   * Inicia los valores del control
   */
  descartesJS.GraphicControl.prototype.init = function() {
    var evaluator = this.evaluator;
    
    this.mouseCacher.style.display = (evaluator.evalExpression(this.drawif) > 0) ? "block" : "none";

    // se encuentra la posicion en x y y del control grafico y se registra
    var expr = evaluator.evalExpression(this.expresion);
    this.x = expr[0][0];
    this.y = expr[0][1];
    evaluator.setVariable(this.id+".x", this.x);
    evaluator.setVariable(this.id+".y", this.y);

    var radioTouch = 70;
    
    // si el espacio tiene una imagen de fondo entonces se asigna el nombre del archivo
    if ((this.imageSrc != "") && !(this.imageSrc.toLowerCase().match(/vacio.gif$/))) {
      this.image = this.parent.getImage(this.imageSrc);

      this.width = this.image.width;
      this.height = this.image.height;
    
      this._w = ((descartesJS.hasTouchSupport) && (this.width < radioTouch)) ? radioTouch : this.width;
      this._h = ((descartesJS.hasTouchSupport) && (this.height < radioTouch)) ? radioTouch : this.height;
    } else {
      this.width = (evaluator.evalExpression(this.size)*2);
      this.height = (evaluator.evalExpression(this.size)*2);
      
      this._w = ((descartesJS.hasTouchSupport) && (this.width < radioTouch)) ? radioTouch : this.width;
      this._h = ((descartesJS.hasTouchSupport) && (this.height < radioTouch)) ? radioTouch : this.height;
    }
    
    ////////////////////////////////////////////////////////////////////////////
    if (this.constraint) {
      var cpos = this.newt.findZero(new descartesJS.R2(this.x, this.y));
      this.x = cpos.x;
      this.y = cpos.y;
      evaluator.setVariable(this.id+".x", this.x);
      evaluator.setVariable(this.id+".y", this.y);
    }
    ////////////////////////////////////////////////////////////////////////////
      
    this.mouseCacher.setAttribute("style", "background-color: rgba(255, 255, 255, 0); width: " +this._w+ "px; height: " +this._h+ "px; z-index: " + this.zIndex + ";");
    this.mouseCacher.style.left = parseInt(this.space.getAbsoluteX(this.x)-this._w/2)+"px";
    this.mouseCacher.style.top = parseInt(this.space.getAbsoluteY(this.y)-this._h/2)+"px";
    
//     // se obtinen los controles correspondientes a la coordenada x y y
//     this.ctrX = this.parent.getControlById(this.id+".x");
//     this.ctrY = this.parent.getControlById(this.id+".y");
    
    evaluator.setVariable(this.id+".activo", 0);
  }
  
  /**
   * Actualiza los valores del control
   */
  descartesJS.GraphicControl.prototype.update = function() {
    var evaluator = this.evaluator;

    // se actualiza la posicion del control
    this.x = evaluator.getVariable(this.id+".x");
    this.y = evaluator.getVariable(this.id+".y");
    var x = this.space.getAbsoluteX(this.x);
    var y = this.space.getAbsoluteY(this.y);
    
//     this.mouseCacher.style.left = parseInt(x-this._w/2)+"px";
//     this.mouseCacher.style.top = parseInt(y-this._h/2)+"px";
    this.mouseCacher.style.left = (x-this._w/2)+"px";
    this.mouseCacher.style.top = (y-this._h/2)+"px";
    
//     this.mouseCacher.setAttribute("style", "width: " +this._w+ "px; height: " +this._h+ "px; z-index: " + this.zIndex + ";");    
    this.mouseCacher.style.display = (evaluator.evalExpression(this.activeif) > 0) ? "block" : "none";
    
    ////////////////////////////////////////////////////////////////////////////
    if (this.constraint) {
      var cpos = this.newt.findZero(new descartesJS.R2(this.x, this.y));
      this.x = cpos.x;
      this.y = cpos.y;
      evaluator.setVariable(this.id+".x", this.x);
      evaluator.setVariable(this.id+".y", this.y);
    }
    ////////////////////////////////////////////////////////////////////////////

    this.draw();
  }

  /**
   * Dibuja el control
   */
  descartesJS.GraphicControl.prototype.draw = function() {
    var evaluator = this.evaluator;

    if (evaluator.evalExpression(this.drawif) > 0) {
      var ctx = this.ctx;
      var backCtx = this.space.backgroundCtx;
      var x = this.space.getAbsoluteX(this.x);
      var y = this.space.getAbsoluteY(this.y);
      
      if (this.text != "") {
        this.drawText(x, y);
      }
    
      // si el control no tiene imagen o aun no esta lista 
      if (!this.image.ready) {
        ctx.beginPath();
        ctx.arc(x, y, this.width/2, 0, PI2, false);
    
        ctx.fillStyle = descartesJS.getColor(evaluator, this.colorInt);
        ctx.fill();
      
        ctx.lineWidth = 1;
        ctx.strokeStyle = descartesJS.getColor(evaluator, this.color);
        ctx.stroke();
      
        if (this.active) {
          ctx.beginPath();
          ctx.arc(x, y, (this.width/2)-2, 0, PI2, false);
          ctx.strokeStyle = "black";
          ctx.stroke();
        }
      
        // si deja rastro el control
        if (this.trace) {
          backCtx.lineWidth = 1;
          backCtx.strokeStyle = descartesJS.getColor(evaluator, this.trace);
          backCtx.beginPath();
          backCtx.arc(x, y, this.width/2, 0, PI2, false);
          backCtx.stroke();
        }
      } 
      // si el control tiene imagen y ya esta lista
      else {
      	if (this.image.complete){
          ctx.drawImage(this.image, x-this.image.width/2, y-this.image.height/2);
        }
        
        // si deja rastro el control
        if (this.trace) {
          backCtx.save();
          backCtx.translate(x, y);
          backCtx.scale(this.image.width/2, this.image.height/2);

          backCtx.beginPath();
          backCtx.arc(0, 0, 1, 0, PI2, false);
          backCtx.restore();
        
          backCtx.lineWidth = 1;
          backCtx.strokeStyle = descartesJS.getColor(evaluator, this.trace);
          backCtx.stroke();
        }
      }
    }
    
  }

  /**
   * Dibuja el texto del control
   */
  descartesJS.GraphicControl.prototype.drawText = function(x, y) {
    var ctx = this.ctx;
    var evaluator = this.evaluator;
    
    ctx.fillStyle = descartesJS.getColor(evaluator, this.color);
    ctx.font = this.font;
    ctx.textBaseline = "alphabetic";

    var text = evaluator.evalExpression(this.text[0], evaluator.evalExpression(this.decimals), this.fixed);
    ctx.fillText(text, x+1+this.width/2, y-1-this.height/2);
  }

  /**
   * Agrega el control a un espacio y obtiene el contenedor del espacio
   * @return {<div>} se obtiene el contenedor del espacio que contiene al control
   */
  descartesJS.GraphicControl.prototype.getContainer = function() {
    var spaces = this.parent.spaces;
    var space_i;
    // si el control esta en un espacio interno
    for(var i=0, l=spaces.length; i<l; i++) {
      space_i = spaces[i];
      if (space_i.id == this.spaceID) {
        space_i.addCtr(this);
        this.zIndex = space_i.zIndex;
        return space_i.graphicControlContainer;
      }
    }
    
    // si no encuentra un espacio con el identificador registrado entonces el control se agrega al primer espacio de la leccion
    spaces[0].addCtr(this);
    this.zIndex = spaces[0].zIndex;
    return spaces[0].graphicControlContainer;
  }

  /**
   * Obtiene el espacio al cual pertenece el control grafico
   * return {Space} el espacio al cual pertenece el grafico
   */
  descartesJS.GraphicControl.prototype.getSpace = function() {
    var spaces = this.parent.spaces;
    for (var i=0, l=spaces.length; i<l; i++) {
      if (spaces[i].id == this.spaceID) {
        return spaces[i];
      }
    }
    // si no encuentra un espacio con el identificador registrado entonces el grafico se agrega al primer espacio de la leccion
    return spaces[0];
  }
  
  /**
   * Desactiva el control grafico
   */
  descartesJS.GraphicControl.prototype.deactivate = function() {
    this.active = false;
    this.evaluator.setVariable(this.id+".activo", 0);
  }  
  
  /**
   * Registran los eventos del mouse del boton
   */
  descartesJS.GraphicControl.prototype.registerMouseEvents = function() {
    this.click = false;
    this.over = false;
    this.active = false;
    
    this.mouseCacher.oncontextmenu = function () { return false; };
    
    var self = this;

    if (descartesJS.hasTouchSupport) {
      this.mouseCacher.addEventListener("touchstart", onTouchStart, false);
    } else {
      this.mouseCacher.addEventListener("mousedown", onMouseDown, false);
      this.mouseCacher.addEventListener("mouseover", onMouseOver, false);
      this.mouseCacher.addEventListener("mouseout", onMouseOut, false);
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de presionar un boton
     * @private
     */
    function onMouseDown(evt) {
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
        if ((self.evaluator.evalExpression(self.activeif) > 0) && (self.over)) {
          
          self.parent.deactivateGraphiControls();
          self.click = true;
          self.active = true;
          self.evaluator.setVariable(self.id+".activo", 1);
          
          self.posAnte = self.getCursorPosition(evt);
          self.prePos = { x : self.space.getAbsoluteX(self.x), y : self.space.getAbsoluteY(self.y) };
          
          if (descartesJS.hasTouchSupport) {
            window.addEventListener("touchmove", onMouseMove, false);
            window.addEventListener("touchend", onMouseUp, false);
          } 
          else {
            window.addEventListener("mouseup", onMouseUp, false);
            window.addEventListener("mousemove", onMouseMove, false);
          }
        }
      }
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de presionar un boton
     * @private
     */
    function onTouchStart(evt) {
      evt.preventDefault();

      if (self.evaluator.evalExpression(self.activeif) > 0) {

        self.parent.deactivateGraphiControls();
        self.click = true;
        self.active = true;

        self.posAnte = self.getCursorPosition(evt);
        self.prePos = { x : self.space.getAbsoluteX(self.x), y : self.space.getAbsoluteY(self.y) };
        
        if (descartesJS.hasTouchSupport) {
          window.addEventListener("touchmove", onMouseMove, false);
          window.addEventListener("touchend", onMouseUp, false);
        } else {
          window.addEventListener("mouseup", onMouseUp, false);
          window.addEventListener("mousemove", onMouseMove, false);         
        }
      }
    }

    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de soltar un boton
     * @private
     */
    function onMouseUp(evt) {
      evt.preventDefault();

      if ((self.evaluator.evalExpression(self.activeif) > 0) || (self.active)) {
        self.click = false;

        if (descartesJS.hasTouchSupport) {
          window.removeEventListener("touchmove", onMouseMove, false);
          window.removeEventListener("touchend", onMouseUp, false);
        } else {
          window.removeEventListener("mouseup", onMouseUp, false);
          window.removeEventListener("mousemove", onMouseMove, false);
        }
        
        self.parent.update();
        
        self.mouseCacher.style.left = (self.space.getAbsoluteX(self.x)-self._w/2)+"px";
        self.mouseCacher.style.top = (self.space.getAbsoluteY(self.y)-self._h/2)+"px";
      }
    }
    
    /**
     * 
     * @param {Event}
     * @private
     */
    function onMouseMove(evt) {
      evt.preventDefault();

      var posNew = self.getCursorPosition(evt);

      self.posX = self.prePos.x - (self.posAnte.x - posNew.x);
      self.posY = self.prePos.y - (self.posAnte.y - posNew.y);
      
      ////////////////////////////////////////////////////////////////////////////
      if (self.constraint) {
        var tmpX = self.space.getRelativeX(self.posX);
        var tmpY = self.space.getRelativeY(self.posY);
        
        var cpos = self.newt.findZero(new descartesJS.R2(tmpX, tmpY));
        self.x = cpos.x;
        self.y = cpos.y;
        self.evaluator.setVariable(self.id+".x", self.x);
        self.evaluator.setVariable(self.id+".y", self.y);
      }
      ////////////////////////////////////////////////////////////////////////////
      else {
        self.evaluator.setVariable(self.id+".x", self.space.getRelativeX(self.posX));
        self.evaluator.setVariable(self.id+".y", self.space.getRelativeY(self.posY));
      }

      // se actualizan los controles
      self.parent.updateControls();

      self.parent.update();      
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de colocar el mouse sobre el boton
     * @private
     */
    function onMouseOver(evt) {
      self.over = true;
      self.mouseCacher.style.cursor = "pointer";
    }
    
    /**
     * 
     * @param {Event} evt el evento lanzado por la accion de sacar el mouse del boton
     * @private
     */
    function onMouseOut(evt) {
      self.over = false;
      self.mouseCacher.style.cursor = "";
      self.click = false;
    }
    
    /**
     * 
     */
    function onBlur(evt) {
      console.log("en blur");
    }
    this.mouseCacher.addEventListener("blur", onBlur, false);
        
  }
  
  /**
   * Obtiene la posicion del mouse en coordenadas absolutas respecto al espacio donde se encuentra
   * @param {Event} evt evento que contiene la posicion del mouse
   * @return {Posicion} la posicion del mouse en coordenadas absolutas respecto al espacio donde se encuentra
   */
  descartesJS.GraphicControl.prototype.getCursorPosition = function(evt) {
    var pos = descartesJS.getCursorPosition(evt);
    return { x: pos.x - (this.space.container.offsetLeft + this.space.container.parentNode.offsetLeft),
             y: pos.y - (this.space.container.offsetTop + this.space.container.parentNode.offsetTop)
           };
  }

  return descartesJS;
})(descartesJS || {});