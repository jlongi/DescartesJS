/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un audio de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el audio
   */
  descartesJS.Audio = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Control.call(this, parent, values);

    // se obtiene el contenedor al cual pertenece el control
    var container = this.getContainer();

    // el audio
    var expr = this.evaluator.evalExpression(this.expresion);
    if (expr[0].length == 4) {
      this.w = expr[0][2];
      this.h = expr[0][3];
    } else {
      this.w = 100;
      this.h = 28;
    }
    
    // parche provisional, para evitar que el control de audio se mueva en firefox
    var isFirefox = (navigator.userAgent.toLowerCase()).match("firefox")&&true;

    ////////////////////////////////////////////////////////////////////////////////
    // parche provisional, para evitar que el control de audio se mueva en firefox
    if (isFirefox) {
      this.audioContainer = document.createElement("div");
      this.audioContainer.setAttribute("style", "overflow: hidden; position: absolute; width: " + this.w + "px; height: 35px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    }
    ////////////////////////////////////////////////////////////////////////////////
    
    this.audio = this.parent.getAudio(this.file);
    
    if (this.autoplay) {
      this.audio.setAttribute("autoplay", "autoplay");
      this.audio.play();
    }
    
    if (this.loop) {
      this.audio.setAttribute("loop", "loop");
    }

//     if (this.controls) {
    this.audio.setAttribute("controls", "controls");
//     }

    // parche provisional, para evitar que el control de audio se mueva en firefox
    if (isFirefox) {
      this.audio.setAttribute("style", "position: absolute; width: " + this.w + "px; height: 100px; left: 0px; top: -65px;");
      // se agrega el audio al contenedor
      this.audioContainer.appendChild(this.audio);
    } else {
      this.audio.setAttribute("style", "position: absolute; width: " + this.w + "px; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");      
    }

    // se agrega el contenedor del pulsador al contenedor del espacio, en orden inverso al que aparecen listados
    // por ultimo se agrega el contenedor del pulsador al contenedor del espacio, en orden inverso al que aparecen listados
    if (!container.childNodes[0]) {
      // parche provisional, para evitar que el control de audio se mueva en firefox
      if (isFirefox) {
        container.appendChild(this.audioContainer);
      } else {
        container.appendChild(this.audio);
      }
    } else {
      // parche provisional, para evitar que el control de audio se mueva en firefox
      if (isFirefox) {
        container.insertBefore(this.audioContainer, container.childNodes[0]);
      } else {
        container.insertBefore(this.audio, container.childNodes[0]);
      }
    }
    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Audio, descartesJS.Control);

  /**
   * Actualiza el audio
   */
  descartesJS.Audio.prototype.update = function() {
    var evaluator = this.evaluator;
    var changeX = false;
    var changeY = false;
    var changeW = false;
    var changeH = false;

    // se actualiza si el audio es visible o no
    if (evaluator.evalExpression(this.drawif) > 0) {
      this.audio.style.display = "block"
    } else {
      this.audio.style.display = "none";
      this.audio.pause();
    }    
    
    // se actualiza la poscion y el tamano del audio
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

    // se actualiza el estilo del audio si cambia su tamano o su posicion
//     if (changeW || changeH || changeX || changeY) {
//       if (this.w) {
//         this.audio.setAttribute("width", this.w);
//         this.audio.setAttribute("height", this.h);
//       }
//       this.audio.setAttribute("style", "position: absolute; left: " + this.y + "px; top: " + this.x + "px;");
//     }

  }
  
  return descartesJS;
})(descartesJS || {});
