/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un video de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el video
   */
  descartesJS.Video = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Control.call(this, parent, values);

    var evaluator = this.evaluator;    
    
    // se obtiene el contenedor al cual pertenece el control
    var container = this.getContainer();
    
    var expr = this.evaluator.evalExpression(this.expresion);
    if (expr[0].length == 4) {
      this.w = expr[0][2];
      this.h = expr[0][3];
    } else {
      this.w = null;
      this.h = null;
    }
    
    // el video
    this.video = document.createElement("video");

    // se actualiza si el boton es visible o no
    if (evaluator.evalExpression(this.drawif) > 0) {
      this.video.style.display = "block"
    } else {
      this.video.style.display = "none";
      this.video.pause();
    }
    
    if (this.autoplay) {
      this.video.setAttribute("autoplay", "autoplay");
    }

    if (this.loop) {
      this.video.setAttribute("loop", "loop");
    }

//     if (this.controls) {
    this.video.setAttribute("controls","controls");
//     }

    if (this.poster) {
      this.video.setAttribute("poster", this.poster);
    }

    if (this.w) {
      this.video.setAttribute("width", this.w);
      this.video.setAttribute("height", this.h);
    }
    this.video.setAttribute("style", "position: absolute; overflow: hidden; left: " + this.x + "px; top: " + this.y + "px;");
//     this.video.setAttribute("style", "position: absolute; left: " + this.x + "px; top: " + this.y + "px; z-index: " + this.zIndex + ";");
    
    var fileName = this.file;
    var indexDot = this.file.lastIndexOf(".");
    
    if (indexDot != -1) {
      fileName = this.file.substring(0, indexDot);
    }
    
    var src = document.createElement("source");
    src.setAttribute("src", fileName + ".ogg");
    src.setAttribute("type", "video/ogg");
    this.video.appendChild(src);

    src = document.createElement("source");    
    src.setAttribute("src", fileName + ".mp4");
    src.setAttribute("type", "video/mp4");
    this.video.appendChild(src);

    src = document.createElement("source");    
    src.setAttribute("src", fileName + ".webm");
    src.setAttribute("type", "video/webm");
    this.video.appendChild(src);
    
    // se agrega el contenedor del pulsador al contenedor del espacio, en orden inverso al que aparecen listados
    // por ultimo se agrega el contenedor del pulsador al contenedor del espacio, en orden inverso al que aparecen listados
    if (!container.childNodes[0]) {
      container.appendChild(this.video);
    } else {
      container.insertBefore(this.video, container.childNodes[0]);
    }
    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Control
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Video, descartesJS.Control);

  /**
   * Actualiza el video
   */
  descartesJS.Video.prototype.update = function() {
    var evaluator = this.evaluator;
    var changeX = false;
    var changeY = false;
    var changeW = false;
    var changeH = false;

    // se actualiza si el video es visible o no
    if (evaluator.evalExpression(this.drawif) > 0) {
      this.video.style.display = "block"
    } else {
      this.video.style.display = "none";
      this.video.pause();
    }    

    // se actualiza la poscion y el tamano del boton
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

    // se actualiza el estilo del boton si cambia su tamano o su posicion
//     if (changeW || changeH || changeX || changeY) {
//       if (this.w) {
//         this.video.setAttribute("width", this.w);
//         this.video.setAttribute("height", this.h);
//       }
//       this.video.setAttribute("style", "position: absolute; overflow: hidden; left: " + this.y + "px; top: " + this.x +  + "px; z-index: " + this.zIndex + ";");
//       this.video.setAttribute("style", "position: absolute; left: " + this.y + "px; top: " + this.x +  + "px; z-index: " + this.zIndex + ";");
//     }

  }
    
  return descartesJS;
})(descartesJS || {});
