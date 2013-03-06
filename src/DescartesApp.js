/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una aplicacion de descartes (i.e. javascript)
   * @constructor 
   * @param {<applet>} applet es el applet que se va a reemplazar
   */
  descartesJS.DescartesApp = function(applet) {
    /**
     * Codigo de la aplicacion de descartes
     * @type {String}
     * @private
     */
    this.applet = applet;
    
    this.externalVariables = {}

    /**
     * Contenedor del applet java de descartes
     * @type {<HTMLelement>}
     * @private 
     */
    this.parentContainer = applet.parentNode;
    
    /**
     * El ancho del applet
     * @type {String}
     * @private 
     */
    this.width = applet.getAttribute("width");

    /**
     * El alto del applet
     * @type {String}
     * @private 
     */
    this.height = applet.getAttribute("height");

    /**
     * Simbolo decimal
     * @type {String}
     * @private
     */
    this.decimal_symbol = "."

    /**
     * Los paramentros del applet
     * type {[<param>]}
     * @private
     */
    this.childs = applet.getElementsByTagName("param");
    
    /**
     * 
     */
    this.code = applet.getAttribute("code");

    /**
     * El estado de las variables que se le asigno por medio de codigo javascript
     */
    this.saveState = [];
    
    /**
     * Las imagenes del applet
     * type {[Image]}
     * @private
     */
    this.images = {};
    
    /**
     * El numero de imagenes del applet
     * type {Number}
     * @private 
     */
    this.images.length = -1;
    
    /**
     * Los audios del applet
     * type {[Audio]}
     * @private
     */
    this.audios = {};
    
    /**
     * El numero de audios del applet
     * type {Number}
     * @private 
     */
    this.audios.length = -1;
    
    /**
     * Objeto para el parseo y evaluacion de expresiones
     * type {Evaluator}
     * @private
     */
    this.evaluator = new descartesJS.Evaluator(this);
   
    /**
     * Objeto para parsear los objetos de la leccion de descartes
     * @type {LessonParser}
     * @private
     */
    this.lessonParser = new descartesJS.LessonParser(this);

    /**
     * Variable que indica si es la primera vez que se interpreta el applet
     * Sirve para que la funcion init ejecute el loader o no
     * type {Boolean}
     * @private
     */
    this.firstRun = true;
    
    this.arquimedes = this.code.match("descinst.DescartesWeb2_0.class");

    this.licenseW2 = "{\\rtf1\\uc0{\\fonttbl\\f0\\fcharset0 Arial;\\f1\\fcharset0 Arial;\\f2\\fcharset0 Arial;\\f3\\fcharset0 Arial;\\f4\\fcharset0 Arial;}"+
                     "{\\f0\\fs34 __________________________________________________________________________________ \\par \\fs22 "+
                     "                                       Los contenidos de esta unidad didáctica interactiva están bajo una  {\\*\\hyperlink licencia Creative Commons|http://creativecommons.org/licenses/by-nc-sa/2.5/es/}, si no se indica lo contrario.\\par "+
                     "                                       La unidad didáctica fue creada con DescartesWeb2.0, que es un producto de código abierto del  {\\*\\hyperlink Ministerio de Educación de España|http://recursostic.educacion.es/descartes/web/DescartesWeb2.0/} y\\par "+
                     "                                       el {\\*\\hyperlink Instituto de Matemáticas|http://arquimedes.matem.unam.mx/} de la Universidad Nacional Autónoma de México, cedido bajo licencia {\\*\\hyperlink EUPL v 1.1|/resources/eupl_v1.1es.pdf}, con {\\*\\hyperlink código en Java|http://recursostic.educacion.es/descartes/web/source/}."+
                     "}";

    this.licenseA = "{\\rtf1\\uc0{\\fonttbl\\f0\\fcharset0 Arial;\\f1\\fcharset0 Arial;\\f2\\fcharset0 Arial;\\f3\\fcharset0 Arial;\\f4\\fcharset0 Arial;}"+
                    "{\\f0\\fs34 __________________________________________________________________________________ \\par \\fs22 "+
                    "                                       Los contenidos de esta unidad didáctica interactiva están bajo una  {\\*\\hyperlink licencia Creative Commons|http://creativecommons.org/licenses/by-nc-sa/2.5/es/}, si no se indica lo contrario.\\par "+
                    "                                       La unidad didáctica fue creada con Arquímedes, que es un producto de código abierto del  {\\*\\hyperlink Ministerio de Educación de España|http://recursostic.educacion.es/descartes/web/DescartesWeb2.0/} y\\par "+
                    "                                       el {\\*\\hyperlink Instituto de Matemáticas|http://arquimedes.matem.unam.mx/} de la Universidad Nacional Autónoma de México, cedido bajo licencia {\\*\\hyperlink EUPL v 1.1|/resources/eupl_v1.1es.pdf}, con {\\*\\hyperlink código en Java|http://recursostic.educacion.es/descartes/web/source/}."+
                    "}";

    this.hackChafaParaQueFuncionenLasEscenasDeArquimedes = false;

    if (this.arquimedes) {
      var childs = this.childs;
      var childs_i;
      var alturaRTF = 0;
      var alturaBotones = 0;

      for(var i=0, l=childs.length; i<l; i++) {
        childs_i = childs[i];
      
        // se encuentra la altura del rtf
        if (childs_i.name == "rtf_height") {
          alturaRTF = parseInt(childs_i.value);
        }

        // se encuentra la altura de los botones
        if (babel[childs_i.name] == "Buttons") {
          this.buttonsConfig = this.lessonParser.parseButtonsConfig(childs_i.value);
          alturaBotones = this.buttonsConfig.height;
        }
      }
      if (alturaRTF) {
        this.height =  alturaRTF + alturaBotones + 70; // 70 es la altura de la imagen de la licencia
      }
    }

    // se inician la interpretacion
    this.init()
  }

  /**
   * Inicia las variables necesarias para el parseo y la creacion de la leccion de descartes
   */
  descartesJS.DescartesApp.prototype.init = function() {
    /**
     * Objeto para el parseo y evaluacion de expresiones
     * type {Evaluator}
     * @private
     */
    this.evaluator = new descartesJS.Evaluator(this);
   
    /**
     * Objeto para parsear los objetos de la leccion de descartes
     * @type {LessonParser}
     * @private
     */
    this.lessonParser = new descartesJS.LessonParser(this);

    /**
     * Arreglo donde se guardan los espacios de la aplicacion de descartes
     * type {[Space]}
     * @private
     */
    this.spaces = [];

    /**
     * Region externa
     * type {Space}
     * @private
     */
    this.externalSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * Region norte
     * type {Space}
     * @private
     */
    this.northSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * Region sur
     * type {Space}
     * @private
     */
    this.southSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * Region este
     * type {Space}
     * @private
     */
    this.eastSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * Region oeste
     * type {Space}
     * @private
     */
    this.westSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * Region especial para colocar los controlos correspondientes a los botones creditos, config, inicio o limpiar
     * type {Space}
     * @private
     */
    this.specialSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * Region de contenido editable
     * type {<DIV>}
     * @private
     */
    this.editableRegion = {container: document.createElement("div"), textFields: []};
        
    /**
     * Arreglo donde se guardan los controles de la aplicacion de descartes
     * type {[Control]}
     * @private
     */
    this.controls = [];
   
    /**
     * Arreglo donde se guardan los auxiliares de la aplicacion de descartes
     * type {[Auxiliary]}
     * @private
     */
    this.auxiliaries = [];
   
    /**
     * Arreglo donde se guardan los eventos de la aplicacion de descartes
     * type {[Event]}
     * @private
     */
    this.events = [];
   
    /**
     * Indice z de los elementos
     * @type {number}
     * @private 
     */
    this.zIndex = 0;

    /**
     * Indice de tabulacion para los campos de texto
     * @type {number}
     * @private 
     */
    this.tabindex = 0;
    
    /**
     * Altura de la pleca si es que existe
     * @type {number}
     * @private
     */
    this.plecaHeight = 0;

    /**
     * 
     */
    this.numberOfIframes = 0;
    
    // sirve para reiniciar la leccion
    // si el contenedor del reemplazo del applet ya esta definido, significa que ya se habia interpretado anteriormente el applet, 
    // entonces se quita el contenedor con todo su contenido y se agrega uno nuevo
    if (this.container != undefined) {
      this.parentContainer.removeChild(this.container)
    }

    this.container = document.createElement("div");
    this.loader = document.createElement("div");

    // al contenedor del applet java de descartes se le agrega el nuevo contenedor para el applet interpretado por javascript
    this.parentContainer.appendChild(this.container);
    this.container.width = this.width;
    this.container.height = this.height;
    this.container.setAttribute("class", "DescartesAppContainer");
    this.container.setAttribute("style", "width: " + this.width + "px; height:" + this.height + "px;");
    
    // al contenedor se le agrega el loader
    this.container.appendChild(this.loader);
    this.loader.width = this.width;
    this.loader.height = this.height;
    this.loader.setAttribute("class", "DescartesLoader");
    this.loader.setAttribute("style", "width: " + this.width + "px; height:" + this.height + "px; z-index: 1000;");

    // si es la primera vez que se ejecuta
    if (this.firstRun) {
      var self = this;
      var imageURL = "url(" + drawDescartesLogo(this.loader.width, this.loader.height) + ")";
      
      this.imageLoader = document.createElement("div");
      this.imageLoader.width = this.width;
      this.imageLoader.height = this.height;
      this.imageLoader.setAttribute("class", "DescartesLoaderImage")
      this.imageLoader.setAttribute("style", "background-image: " + imageURL + "; width: " + this.width + "px; height:" + this.height + "px;");
      this.loader.appendChild(this.imageLoader);
      
      // se busca la imagen images/DescartesLoader.png para que sea utilizada como imagen de fondo
      var tmpImage = new Image();
      tmpImage.onload = function() {
        self.imageLoader.setAttribute("style", "background-image: url(" + this.src + "); width: " + self.width + "px; height:" + self.height + "px; top: 0px; left: 0px");
      }
      tmpImage.src = "images/DescartesLoader.png";
      
      this.loaderBar = document.createElement("canvas");
      this.loaderBar.width = this.width;
      this.loaderBar.height = this.height;
      this.loaderBar.setAttribute("class", "DescartesLoaderBar");
      this.loaderBar.setAttribute("style", "width: " + this.width + "px; height:" + this.height + "px;");
      this.loaderBar.ctx = this.loaderBar.getContext("2d");
      this.loader.appendChild(this.loaderBar);
      
      // se inicia el loader
      this.barWidth = Math.floor(this.loader.width/10);
      this.barHeight = Math.floor(this.loader.height/70);
      
      // se dibuja la barra de carga del loader
      this.timer = setInterval(function() { self.drawLoaderGraph(self.loaderBar.ctx, self.loaderBar.width, self.loaderBar.height); }, 10);

      this.firstRun = false;

      // se incia el preloader
      this.initPreloader();    
    } else {
      this.initBuildApp();
    }
  }
  
  /**
   * Inicia el audio
   */
  descartesJS.DescartesApp.prototype.initAudio = function(file) {
    var self = this;
    
    this.audios[file] = new Audio(file);
    this.audios[file].filename = file;

    // evento que se ejecuta cuando se termina de leer el audio
    var onCanPlayThrough = function() {
      this.ready = 1;
    }
    
    // evento que se ejecuta cuando ocurre un error, el audio no se pudo cargar
    var onError = function() {
//       console.log("error");
//       self.audios[file].removeEventListener('canplaythrough', onCanPlayThrough, false);
//       self.audios[file].removeEventListener('load', onCanPlayThrough, false);
// 
      if (!this.canPlayType("audio/" + this.filename.substring(this.filename.length-3)) && (this.filename.substring(this.filename.length-3) == "mp3")) {
        self.audios[file] = new Audio(this.filename.replace("mp3", "ogg"));
        self.audios[file].filename = this.filename.replace("mp3", "ogg");
        self.audios[file].addEventListener('canplaythrough', onCanPlayThrough, false);
        self.audios[file].addEventListener('load', onCanPlayThrough, false);
        self.audios[file].addEventListener('error', onError, false);
        self.audios[file].load();
      } else {
        console.log("El archivo '" + file + "' no puede ser reproducido");
        this.errorload = 1;
      }
    }
    this.audios[file].addEventListener('canplaythrough', onCanPlayThrough, false);
    this.audios[file].addEventListener('load', onCanPlayThrough, false);
    this.audios[file].addEventListener('error', onError, false);

    if (descartesJS.hasTouchSupport) {
      this.audios[file].load();
      this.audios[file].play();
      setTimeout( function(){ console.log("detenido"); self.audios[file].pause(); }, 10);
      this.audios[file].ready = 1;
    } else {
      this.audios[file].load();
    }
    
  }

  /**
   * Preloader de recursos, imagenes y audios
   */
  descartesJS.DescartesApp.prototype.initPreloader = function() {
    // ### ARQUIMEDES
    var licenceFile = "lib/DescartesCCLicense.png";
    this.images[licenceFile] = descartesJS.getCreativeCommonsLicenseImage();
    // evento que se ejecuta cuando se termina de leer la imagen
    this.images[licenceFile].addEventListener('load', function() { this.ready = 1; }, false);
    // evento que se ejecuta cuando ocurre un error, la imagen no se pudo cargar
    this.images[licenceFile].addEventListener('error', function() { this.errorload = 1; }, false);
    // this.images[licenceFile].src = licenceFile;
    // ### ARQUIMEDES

    var imgTmp;
    // se recorren todos los argumentos que definen al applet
    for(var i=0, l=this.childs.length; i<l; i++) {
      // se encuentran los nombres de archivo de las imagenes del applet
      var img = (this.childs[i].value).match(/[\w-//]*(.png|.jpg|.gif|.svg|.PNG|.JPG|.GIF|.SVG)/g);
      
      // si el elemento revisado tiene una imagen entonces hay que agregarla al arreglo de imagenes
      if (img) {
        for (var j=0, il=img.length; j<il; j++) {
          imgTmp = img[j];
          // si el nombre del archivo no es VACIO.GIF o vacio.gif
          if (!(imgTmp.toLowerCase().match(/vacio.gif$/)) && ((imgTmp.substring(0, imgTmp.length-4)) != "") ) {
            this.images[imgTmp] = new Image();

            // evento que se ejecuta cuando se termina de leer la imagen
            this.images[imgTmp].addEventListener('load', function() { this.ready = 1; }, false);

            // evento que se ejecuta cuando ocurre un error, la imagen no se pudo cargar
            this.images[imgTmp].addEventListener('error', function() { this.errorload = 1; }, false);
            
            this.images[imgTmp].src = imgTmp;
          }
        }
      }

      // se encuentran los nombres de archivo de los audios del applet
//       var aud = (this.childs[i].value).match(/[\w-//]*(.ogg|.oga|.mp3|.wav|.OGG|.OGA|.MP3|.WAV)/g);
      var aud = (this.childs[i].value).match(/[\w-//]*(\.ogg|\.oga|\.mp3|\.wav|\.OGG|\.OGA\.MP3|\.WAV)/g);
     
      // si con el elemento revisado tiene un audio entonces hay que agregarlo al arreglo de audios
      if (aud) {
        var audTmp;
        for (var j=0, al=aud.length; j<al; j++) {
          audTmp = aud[j];
          
          this.initAudio(audTmp);
        }
      }
      
      // se encuentran vectores que tengan un archivo asociado
      var vec = (this.childs[i].value).match(/vector|array|bektore|vecteur|matriz/g) && 
                (this.childs[i].value).match(/archivo|file|fitxer|artxibo|fichier|arquivo/g);
     
      // si es un vector con nombres de archivo, se crea el vector para que se precargen las imagenes, este vector se crea dos veces
      if (vec) {
        this.lessonParser.parseAuxiliar(this.childs[i].value);
      }
      
    }
        
    var self = this;

    // se cuenta cuantas imagenes se encontraron, se hace la cuenta despues debido a que puede haber nombres de archivos repetidos
    for (var propName in this.images) {
      if ((this.images).hasOwnProperty(propName)) {
        this.images.length++;
      }
    }

    // se cuenta cuantos audios se encontraron, se hace la cuenta despues debido a que puede haber nombres de archivos repetidos
    for (var propName in this.audios) {
      if ((this.audios).hasOwnProperty(propName)) {
        this.audios.length++;
      }
    }
        
    // funcion para revisar si ya se cargaron todas las imagenes
    var checkLoader = function() {
      // contador para determinar cuantas imagenes se han cargado
      self.readys = 0;
      // el numero total de imagenes
      var li = self.images.length;
      
      // se cuenta cuantas imagenes ya se han cargado
      for (var propName in self.images) {
        if ((self.images).hasOwnProperty(propName)) {
          if ( (self.images[propName].ready) || (self.images[propName].errorload) ) {
            self.readys++;
          }
        }
      }
      
      // el numero total de audios
      var la = self.audios.length;
      
      // se cuenta cuantos audios ya se han cargado
      for (var propName in self.audios) {
        if ((self.audios).hasOwnProperty(propName)) {
          if ( (self.audios[propName].ready) || (self.audios[propName].errorload) ) {
            self.readys++;
          }
        }
      }

      // si el numero de elementos listos es diferente al numero total de elementos, entonces hay que seguir ejecutando el loader
      if (self.readys != (li+la)) {
        setTimeout(checkLoader, 30);
      }
      // si el numero de elementos listos ya es igual al numero total de elementos, entonces se comienza a parsear y construir los elementos del applet
      else {
        self.initBuildApp();
      }
    }

    // se ejectuta el loader de imagenes
    checkLoader();
  }
  
  /**
   * Obtiene una imagen por nombre de archivo en el arreglo de imagenes del applet
   * @param {String} name el nombre de archivo de la imagen
   * @return {Image} la imagen correspondiente al nombre de archivo recibido
   */
  descartesJS.DescartesApp.prototype.getImage = function(name) {
    if (name) {
      // si la imagen ya esta en el arreglo de imagenes, entonces se regresa esa imagen
      if (this.images[name]) {
        return this.images[name];
      }
      // si la imagen no esta en el arreglo de imagenes, entonces se crea una nueva imagen y se agrega al arreglo de imagenes
      else {
        this.images[name] = new Image();
        this.images[name].src = name;
        
        // evento que se ejecuta cuando se termina de leer la imagen
        this.images[name].addEventListener('load', function() { this.ready = 1; }, false);
       
        // evento que se ejecuta cuando ocurre un error, la imagen no se pudo cargar
        this.images[name].addEventListener('error', function() { this.errorload = 1; }, false);
        
        return this.images[name];
      }
    }
  }
  
  /**
   * Obtiene un audio por nombre de archivo en el arreglo de audios del applet
   * @param {String} name el nombre de archivo del audio
   * @return {Image} el audio correspondiente al nombre de archivo recibido
   */
  descartesJS.DescartesApp.prototype.getAudio = function(name) {
    var self = this;
    // si la imagen ya esta en el arreglo de imagenes, entonces se regresa esa imagen
    if (this.audios[name]) {
      return this.audios[name];
    }
    // si la imagen no esta en el arreglo de imagenes, entonces se crea una nueva imagen y se agrega al arreglo de imagenes
    else {
      this.audios[name] = new Audio(name);
      
      // evento que se ejecuta cuando se termina de leer el audio
      this.audios[name].addEventListener('canplaythrough', function() { this.ready = 1; }, false);
      
      // evento que se ejecuta cuando ocurre un error, el audio no se pudo cargar
      var onError = function() {
        if (!this.canPlayType("audio/" + name.substring(name.length-3)) && (name.substring(name.length-3) == "mp3")) {
          self.audios[name] = new Audio(name.replace("mp3", "ogg"));
          self.audios[name].addEventListener('canplaythrough', onCanPlayThrough, false);
          self.audios[name].addEventListener('load', onCanPlayThrough, false);
          self.audios[name].addEventListener('error', onError, false);
          self.audios[name].load();
        } else {
          console.log("El archivo '" + name + "' no puede ser reproducido");
          this.errorload = 1;
        }
      }
      this.audios[name].addEventListener('error', onError, false);
            
//       this.audios[name].load();
      this.audios[name].play();
      setTimeout( function(){ self.audios[name].pause(); }, 10);
      
      return this.audios[name];
    }
  }

  /**
   * Dibuja la barra de carga del loader
   * @param {CanvasContextRendering2D} ctx es el contexto sobre el cual se dibuja la barra
   * @param {Number} w el ancho del area de la imagen
   * @param {Number} h el alto del area de la imagenes
   */
  descartesJS.DescartesApp.prototype.drawLoaderGraph = function(ctx, w, h) {
    var escala = 2;
    var cuantos = this.images.length + this.audios.length;
    var sep = (2*(this.barWidth-2))/cuantos;
    
    ctx.translate(w/2, h-25*escala);
    ctx.scale(escala, escala);

    ctx.strokeRect(-this.barWidth, -this.barHeight, 2*this.barWidth, this.barHeight);
    
    ctx.fillStyle = "gray";
    ctx.fillRect(-this.barWidth+2, -this.barHeight+2, 2*(this.barWidth-2), this.barHeight-4);
    
    ctx.fillStyle = "#1f375d";
    ctx.fillRect(-this.barWidth+2, -this.barHeight+2, this.readys*sep, this.barHeight-4);

    // se resetean las trasnformaciones
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  
  /**
   * Dibuja el logo de descartes y regresa la imagen correspondiente
   * @param {Number} w el ancho del espacio
   * @param {Number} h el alto del espacio
   */
  var drawDescartesLogo = function(w, h) {
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");

    ctx.save();
    
    ctx.strokeStyle = "#1f375d";
    ctx.fillStyle = "#1f375d";
    ctx.lineCap = "round";
    ctx.lineWidth = 2;

    ctx.beginPath();
    // La imagen original que hice mide 120pixeles de ancho por 65pixeles de alto 
    var escala = 3;
    ctx.translate((w-(120*escala))/2, (h-(65*escala))/2);
    ctx.scale(escala, escala);
    
    ctx.moveTo(3,25);
    ctx.lineTo(3,1);
    ctx.lineTo(21,1);
    ctx.bezierCurveTo(33,1, 41,15, 41,25);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1,63); ctx.lineTo(1,64);

    ctx.moveTo(5,62); ctx.lineTo(5,64);

    ctx.moveTo(9,61); ctx.lineTo(9,64);

    ctx.moveTo(13,60); ctx.lineTo(13,64);

    ctx.moveTo(17,58); ctx.lineTo(17,64);

    ctx.moveTo(21,56); ctx.lineTo(21,64);

    ctx.moveTo(25,53); ctx.lineTo(25,64);

    ctx.moveTo(29,50); ctx.lineTo(29,64);

    ctx.moveTo(33,46); ctx.lineTo(33,64);

    ctx.moveTo(37,41); ctx.lineTo(37,64);

    ctx.moveTo(41,32); ctx.lineTo(41,64);
    ctx.stroke();

    ctx.font = "20px Arial";
    ctx.fillText("escartes", 45, 33);
    ctx.fillText("JS", 98, 64);
    ctx.restore();

    return canvas.toDataURL();
  }
  
  /**
   * Inicia el parseo y la creacion de los objetos de la leccion de descartes
   */
  descartesJS.DescartesApp.prototype.initBuildApp = function() {
    var childs = this.childs;
    var lessonParser = this.lessonParser;
    
    var tmpSpaces = [];
    var tmpControls = [];
    var tmpAuxiliaries = [];
    var tmpGraphics = [];
    var tmp3DGraphics = [];
    var tmpAnimations = [];
    
    var chii;
    // se recorren todos los paramentros encontrados
    for(var i=0, l=childs.length; i<l; i++) {
      childs_i = childs[i];
      
      // se encuentra la informacion de la pleca
      if (childs_i.name == "pleca") {
        var divPleca = lessonParser.parsePleca(childs_i.value, this.width);
        this.container.insertBefore(divPleca, this.loader);
        
        this.plecaHeight = (divPleca.imageHeight) ? divPleca.imageHeight : divPleca.offsetHeight;
      }
      
      // se encuentran los parametros de configuracion del los espacios exteriores
      if (babel[childs_i.name] == "Buttons") {
        this.buttonsConfig = lessonParser.parseButtonsConfig(childs_i.value);
        continue;
      }
      
      // se encuentra el simbolo decimal utilizado
      if (babel[childs_i.name] == "decimal_symbol") {
        this.decimal_symbol = childs_i.value;
        continue;
      }
      
      // se encuentra la version de descartes
      if (babel[childs_i.name] == "version") {
        this.version = parseInt(childs_i.value);
        continue;
      }
      
      // se encuentra el idioma de la leccion
      if (babel[childs_i.name] == "language") {
        this.language = childs_i.value;
        continue;
      }
      
      // se encuentra si el applet esta habilitado a la interaccion con el usuario
      if (babel[childs_i.getAttribute("enable")] == "enable") {
        this.enable = babel[childs_i.getAttribute("enable")];
        continue;
      }
      
      // ##ARQUIMEDES## //
      // si el nombre del parametro es RTF entonces es el texto de arquimedes
      if (childs_i.name == "rtf") {
        var posY = (parseInt(this.height) -this.plecaHeight -this.buttonsConfig.height -45);
        tmpGraphics.push("space='descartesJS_scenario' type='text' expresion='[10,20]' background='yes' text='" + childs_i.value.replace(/'/g, "&squot;") + "'");
        tmpGraphics.push("space='descartesJS_scenario' type='text' expresion='[10," + (posY-25) + "]' background='yes' text='" + this.licenseA + "'");
        tmpGraphics.push("space='descartesJS_scenario' type='image' expresion='[15," + posY + "]' background='yes' abs_coord='yes' file='lib/DescartesCCLicense.png'");


        continue;
      }
      // ##ARQUIMEDES## //

      // si el nombre del parametro inicia con la letra E entonces es un espacio
      if (childs_i.name.charAt(0) == "E") {
        if (childs_i.value.match(/'HTMLIFrame'/)) {
          this.numberOfIframes++;
        }
        
        // si algun espacio se llamam _BASE_ entonces es una conversion de arquimedes a descartes
        if (childs_i.value.match("'_BASE_'")) {
          this.hackChafaParaQueFuncionenLasEscenasDeArquimedes = true;
        }

        tmpSpaces.push(childs_i.value);
        continue;
      }
      
      // si el nombre del parametro inicia con la letra C entonces es un control
      if ((childs_i.name.charAt(0) == "C") && (childs_i.name.charAt(1) == "_")) {
        tmpControls.push(childs_i.value);
        continue;
      }

      // si el nombre del parametro inicia con la letra A y no es la palabra "Animation" entonces es un auxiliar
      if ((childs_i.name.charAt(0) == "A") && (babel[childs_i.name] != "Animation")) {
        tmpAuxiliaries.push(childs_i.value);
        continue;
      }

      // si el nombre del parametro inicia con la letra G entonces es un grafico
      if (childs_i.name.charAt(0) == "G") {
        tmpGraphics.push(childs_i.value);
        continue;
      }

      // si el nombre del parametro inicia con la letra S entonces es un grafico tridimensional
      if (childs_i.name.charAt(0) == "S") {
        tmp3DGraphics.push(childs_i.value);
        continue;
      }
      
      // si el nombre es "Animation" entonces es una animacion
      if (babel[childs_i.name] == "Animation") {
        tmpAnimations.push(childs_i.value);
        continue;
      }
    }

    // ##ARQUIMEDES## //
    /**
     * Region del escenario solo visible para arquimedes
     */
    this.scenarioRegion = {container: document.createElement("div"), scroll: 0};
    this.scenarioRegion.container.setAttribute("id", "descartesJS_Scenario_Region");
//     this.scenarioRegion.container.setAttribute("style", "overflow: auto; width: " + this.width + "px; height: " + this.height + "px;");
    this.scenarioRegion.scenarioSpace = this.lessonParser.parseSpace("tipo='R2' id='descartesJS_scenario' fondo='blanco' x='0' y='0' fijo='yes' red='no' red10='no' ejes='no' text='no' ancho='" + this.width + "' alto='" + this.height + "'");
    this.scenarioRegion.container.appendChild(this.scenarioRegion.scenarioSpace.container);

    // si es una escena de arquimedes, entonces se agrega el contenedor
    if (this.arquimedes) {
      this.container.appendChild(this.scenarioRegion.container);
      this.spaces.push(this.scenarioRegion.scenarioSpace);
    }
    // ##ARQUIMEDES## //    

    // se inician los elementos
    var tmpSpace;
    for (var i=0, l=tmpSpaces.length; i<l; i++) {
      tmpSpace = lessonParser.parseSpace(tmpSpaces[i]);

      // ##ARQUIMEDES## //
      if (this.arquimedes) {
        this.scenarioRegion.container.appendChild(tmpSpace.container);
      }
      // ##ARQUIMEDES## //

      // se crea y se agrega un espacio a la lista de espacios
      this.spaces.push(tmpSpace);

      // se incrementa el indice z, para que el siguiente espacio se coloque sobre los anteriores
      this.zIndex++;
    }
    
    // se crean los graficos primero por si existen macros //
    var tmpGraph;
    for (var i=0, l=tmpGraphics.length; i<l; i++) {
      // se crea un grafico
      tmpGraph = lessonParser.parseGraphic(tmpGraphics[i]);
      if (tmpGraph) {
        if (tmpGraph.visible) {
          this.editableRegionVisible = true;
        }
        tmpGraph.space.addGraph(tmpGraph);
      }
    }
    
    var tmp3DGraph;
    for (var i=0, l=tmp3DGraphics.length; i<l; i++) {
      // se crea un grafico 3D
      tmpGraph = lessonParser.parse3DGraphic(tmp3DGraphics[i]);
      if (tmpGraph) {
        tmpGraph.space.addGraph(tmpGraph);
      }
    }

    for (var i=0, l=tmpControls.length; i<l; i++) {
      // se crea y se agrega un control a la lista de controles
      this.controls.push( lessonParser.parseControl(tmpControls[i]) );
    }

    for (var i=0, l=tmpAuxiliaries.length; i<l; i++) {
      // se crea un auxiliar
      lessonParser.parseAuxiliar(tmpAuxiliaries[i]);
    }

    for (var i=0, l=tmpAnimations.length; i<l; i++) {
      // se crea una animacion
      this.animation = lessonParser.parseAnimation(tmpAnimations[i]);
    }
    
    // se configuran las regiones del espacio
    this.configRegions();

    // una vez creados los elementos se actualizan
    // se actualizan los auxiliares
    this.updateAuxiliaries();

    //se inician los controles de nuevo, una vez que los auxiliares se iniciaron por si tenian valores dependientes de los auxiliares
    for (var i=0, l=this.controls.length; i<l; i++) {
      this.controls[i].init();
    }
    // se actualizan los controles
    this.updateControls();
    
    // se actualizan los graficos del espacio
    this.updateSpaces(true);

    var self = this;
    if (this.numberOfIframes) {
      setTimeout(function() { self.finishInit(); }, 250*this.numberOfIframes);
    }
    
    else {
      this.finishInit();
    }
    
  }
  
  /**
   * 
   */
  descartesJS.DescartesApp.prototype.finishInit = function() {  
    this.update();

    ////////////////////////////////////////////////////////////////////////
    // se esconde el canvas del loader una vez que ya se termino de crear
    this.loader.style.display = "none";
    this.parentContainer.style = "overflow: hidden;";
    clearTimeout(this.timer);
    
    // si el applet esta deshabilitado se coloca un div que bloquee la interaccion con el
    if (this.enable) {
      this.blocker = document.createElement("div");
      this.blocker.setAttribute("class", "blocker");
      this.blocker.setAttribute("style", "width: " + this.width + "px; height: " + this.height + "px");
      this.container.appendChild(this.blocker);
    }
  }

  
  /**
   * 
   */
  descartesJS.DescartesApp.prototype.configRegions = function() {
    var parser = this.evaluator.parser;

    var buttonsConfig = this.buttonsConfig;
    var principalContainer = this.container;
    
    // descartes 4
    if (this.version != 2) {
      var fontSizeDefaultButtons = "15";
      var aboutWidth = 100;
      var configWidth = 100;
      var initWidth = 100;
      var clearWidth = 100;
    }
    // descartes 2
    else {
      var fontSizeDefaultButtons = "14";
      var aboutWidth = 63;
      var configWidth = 50;
      var initWidth = 44;
      var clearWidth = 53;
    }

    var northRegionHeight = 0;
    var southRegionHeight = 0;
    var eastRegionHeight = 0;
    var westRegionHeight = 0;
    var editableRegionHeight = 0;
    var northRegionWidht = 0;
    var southRegionWidht = 0;
    var eastRegionWidth = 0;
    var westRegionWidth = 0;

    var northSpaceControls = this.northSpace.controls;
    var southSpaceControls = this.southSpace.controls;
    var eastSpaceControls = this.eastSpace.controls;
    var westSpaceControls = this.westSpace.controls;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////    
    // region norte
    if ((buttonsConfig.rowsNorth > 0) || ( northSpaceControls.length > 0) || (buttonsConfig.about) || (buttonsConfig.config)) {
      if (buttonsConfig.rowsNorth <= 0) {
        northRegionHeight = buttonsConfig.height;
        buttonsConfig.rowsNorth = 1;
      }
      // si el numero de filas es diferente de cero entonces la altura es la altura especificada por el numero de filas
      else {
        northRegionHeight = buttonsConfig.height * buttonsConfig.rowsNorth;
      }

      var container = this.northSpace.container;
      container.setAttribute("id", "descartesJS_northRegion");
      container.setAttribute("style", "width: " + principalContainer.width + "px; height: " + northRegionHeight + "px; background: #c0c0c0; position: absolute; left: 0px; top: 0px; z-index: 100;")

      // se agrega el contenedor del espacio antes del loader
      principalContainer.insertBefore(container, this.loader);
      
      northRegionWidht = principalContainer.width;
      var displaceButton = 0;
      // hay que mostrar el boton de creditos
      if (buttonsConfig.about) {
        displaceButton = aboutWidth;
        northRegionWidht -= displaceButton;
      }
      // hay que mostrar el boton de configuracion
      if (buttonsConfig.config) {
        northRegionWidht -= configWidth;
      }
      
      var numberOfControlsPerRow = Math.ceil(northSpaceControls.length / buttonsConfig.rowsNorth);
      var controlWidth = northRegionWidht/numberOfControlsPerRow;
      
      // se configuran los controles de la region
      for (var i=0, l=northSpaceControls.length; i<l; i++) {
        northSpaceControls[i].expresion = parser.parse("(" + (displaceButton +controlWidth*(i%numberOfControlsPerRow)) +"," + (buttonsConfig.height*Math.floor(i/numberOfControlsPerRow)) + "," + controlWidth + "," + buttonsConfig.height +")");
        northSpaceControls[i].drawif = parser.parse("1");
      }
      
      // se crean los botones de creditos y configuracion
      if (buttonsConfig.about) {
        var text;
        if (this.language == "espa\u00F1ol") {
          text = "cr\u00E9ditos";
        } 
        else if (this.language == "english") {
          text = "about";
        }

        var btnAbout = new descartesJS.Button(this, {region: "north", name: text, font_size: parser.parse(fontSizeDefaultButtons),
                                                     expresion: parser.parse("(0, 0, " + aboutWidth + ", " + northRegionHeight + ")")
                                                    }
                                             );
      }
      if (buttonsConfig.config) {
        var text;
        if (this.language == "espa\u00F1ol") {
          text = "config";
        } 
        else if (this.language == "english") {
          text = "config";
        }
        
        var btnConfig = new descartesJS.Button(this, {region: "north", name: text, font_size: parser.parse(fontSizeDefaultButtons),
                                                      action: "config",
                                                      expresion: parser.parse("(" + (northRegionWidht + aboutWidth)  + ", 0, " + configWidth + ", " + northRegionHeight + ")")
                                                     }
                                              );
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // region sur
    if ((buttonsConfig.rowsSouth > 0) || (southSpaceControls.length > 0) || (buttonsConfig.init) || (buttonsConfig.clear)) {
      // si el numero de filas es cero pero contiene controles entonces la altura es la altura especificada
      if (buttonsConfig.rowsSouth <= 0) {
        southRegionHeight = buttonsConfig.height;
        buttonsConfig.rowsSouth = 1;
      }
      // si el numero de filas es diferente de cero entonces la altura es la altura especificada por el numero de filas
      else {
        southRegionHeight = buttonsConfig.height * buttonsConfig.rowsSouth;
      }
      
      southRegionWidht = principalContainer.width;
      var displaceButton = 0;
      // hay que mostrar el boton de creditos
      if (buttonsConfig.init) {
        displaceButton = initWidth;
        southRegionWidht -= displaceButton;        
      }
      // hay que mostrar el boton de configuracion
      if (buttonsConfig.clear) {
        southRegionWidht -= clearWidth;
      }

      var container = this.southSpace.container;
      container.setAttribute("id", "descartesJS_southRegion");
      container.setAttribute("style", "width: " + principalContainer.width + "px; height: " + southRegionHeight + "px; background: #c0c0c0; position: absolute; left: 0px; top: " + (principalContainer.height-southRegionHeight) + "px; z-index: 100;")

      // se agrega el contenedor del espacio antes del loader
      principalContainer.insertBefore(container, this.loader);

      var numberOfControlsPerRow = Math.ceil(southSpaceControls.length / buttonsConfig.rowsSouth);
      var controlWidth = southRegionWidht/numberOfControlsPerRow;
      
      // se configuran los controles de la region
      for (var i=0, l=southSpaceControls.length; i<l; i++) {
        southSpaceControls[i].expresion = parser.parse("(" + (displaceButton + controlWidth*(i%numberOfControlsPerRow)) +"," + (buttonsConfig.height*Math.floor(i/numberOfControlsPerRow)) + "," + controlWidth + "," + buttonsConfig.height +")");
        southSpaceControls[i].drawif = parser.parse("1");
      }
      
      // se crean los botones de creditos y configuracion
      if (buttonsConfig.init) {
        var text;
        if (this.language == "espa\u00F1ol") {
          text = "inicio";
        } 
        else if (this.language == "english") {
          text = "init";
        }

        var btnAbout = new descartesJS.Button(this, {region: "south", name: text, font_size: parser.parse(fontSizeDefaultButtons),
                                                     action: "init",
                                                     expresion: parser.parse("(0, 0, " + initWidth + ", " + southRegionHeight + ")")
                                                    }
                                             );
      }
      if (buttonsConfig.clear) {
        var text;
        if (this.language == "espa\u00F1ol") {
          text = "limpiar";
        } 
        else if (this.language == "english") {
          text = "clear";
        }
        
        var btnConfig = new descartesJS.Button(this, {region: "south", name: text, font_size: parser.parse(fontSizeDefaultButtons),
                                                      action: "clear",
                                                      expresion: parser.parse("(" + (southRegionWidht + initWidth)  + ", 0, " + clearWidth + ", " + southRegionHeight + ")")
                                                     }
                                              );
      }      
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // region este
    if (eastSpaceControls.length > 0) {
      eastRegionHeight = principalContainer.height - northRegionHeight - southRegionHeight;
      eastRegionWidth = buttonsConfig.widthEast;
      
      var container = this.eastSpace.container;
      container.setAttribute("id", "descartesJS_eastRegion");
      container.setAttribute("style", "width: " + eastRegionWidth + "; height: " + eastRegionHeight + "px; background: #c0c0c0; position: absolute; left: " + (principalContainer.width - eastRegionWidth) + "px; top: " + northRegionHeight + "px; z-index: 100;")

      // se agrega el contenedor del espacio antes del loader
      principalContainer.insertBefore(container, this.loader);

      // se configuran los controles de la region
      for (var i=0, l=eastSpaceControls.length; i<l; i++) {
        eastSpaceControls[i].expresion = parser.parse("(0," + (buttonsConfig.height*i) + "," + eastRegionWidth + "," + buttonsConfig.height +")");
        eastSpaceControls[i].drawif = parser.parse("1");
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // region oeste
    if (westSpaceControls.length > 0) {
      westRegionHeight = principalContainer.height - northRegionHeight - southRegionHeight;
      westRegionWidth = buttonsConfig.widthWest;
      
      var container = this.westSpace.container;
      container.setAttribute("id", "descartesJS_westRegion");
      container.setAttribute("style", "width: " + westRegionWidth + "; height: " + westRegionHeight + "px; background: #c0c0c0; position: absolute; left: 0px; top: " + northRegionHeight + "px; z-index: 100;")

      // se agrega el contenedor del espacio antes del loader
      principalContainer.insertBefore(container, this.loader);

      // se configuran los controles de la region
      for (var i=0, l=westSpaceControls.length; i<l; i++) {
        westSpaceControls[i].expresion = parser.parse("(0," + (buttonsConfig.height*i) + "," + westRegionWidth + "," + buttonsConfig.height +")");
        westSpaceControls[i].drawif = parser.parse("1");
      }
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (this.editableRegionVisible) {
      editableRegionHeight = buttonsConfig.height;
      var container = this.editableRegion.container;
      container.setAttribute("id", "descartesJS_editableRegion");
      container.setAttribute("style", "width: " + principalContainer.width + "px; height: " + editableRegionHeight + "px; position: absolute; left: 0px; top: " + (principalContainer.height - southRegionHeight - buttonsConfig.height) + "px; z-index: 100; background: #c0c0c0; overflow: hidden;");
      
      // se agrega el contenedor del espacio antes del loader
      principalContainer.insertBefore(container, this.loader);

      var editableRegionTextFields = this.editableRegion.textFields
      var textFieldsWidth = (principalContainer.width)/editableRegionTextFields.length;
            
      // se configuran los campos de texto de la region
      for (var i=0, l=editableRegionTextFields.length; i<l; i++) {
        if (editableRegionTextFields[i].type == "div") {
          container.appendChild(editableRegionTextFields[i].container);

          ////////////////////////////////////////////////////////////////
          // el contenedor
          editableRegionTextFields[i].container.setAttribute("style", "font-family: Arial; width: " + (textFieldsWidth-4) + "px; height: " + (editableRegionHeight-5) + "px; position: absolute; left: " + ( i*textFieldsWidth ) + "px; top: 0px; border: 2px groove white;");

          ////////////////////////////////////////////////////////////////
          // la etiqueta
          var label = editableRegionTextFields[i].container.firstChild;
          var labelWidth = label.offsetWidth;
          label.setAttribute("style", "font-family: Arial; padding-top: 0%; background-color: lightgray; position: absolute; left: 0px; top: 0px; width: " + labelWidth + "px;");

          // se quita el primer y ultimo caracter, por que fueron guiones bajos introducidos para encontrar el tama;o inicial
          label.firstChild.textContent = label.firstChild.textContent.substring(1, label.firstChild.textContent.length-1);
          
          ////////////////////////////////////////////////////////////////
          // el campo de texto
          var textfield = editableRegionTextFields[i].container.lastChild;
          textfield.setAttribute("style", "font-family: 'Courier New'; width: " + (textFieldsWidth-labelWidth-8) + "px; height: " + (editableRegionHeight-9) + "px; position: absolute; left: " + (labelWidth) + "px; top: 0px; border: 2px groove white;");
        } 

        else {
          container.appendChild(editableRegionTextFields[i]);

          editableRegionTextFields[i].setAttribute("style", "font-family: 'Courier New'; width: " + (textFieldsWidth) + "px; height: " + (editableRegionHeight) + "px; position: absolute; left: " + ( i*textFieldsWidth ) + "px; top: 0px; border: 2px groove white;");
        }
      }
    }    
    
    this.displaceRegionNorth = northRegionHeight;
    this.displaceRegionWest = westRegionWidth;
    
    principalContainer.width = principalContainer.width - eastRegionWidth;
    principalContainer.height = principalContainer.height - southRegionHeight - editableRegionHeight;
    
    for (var i=0, l=this.spaces.length; i<l; i++) {
      this.spaces[i].init()
    }
    
  }

  /**
   * Actualiza y dibuja el reemplazo del applet
   */
  descartesJS.DescartesApp.prototype.update = function() {
    // se actualizan los auxiliares
    this.updateAuxiliaries();
    // se actualizan los eventos
    this.updateEvents();
    // se actualizan los controles
    this.updateControls();
    // se actualizan los graficos del espacio
    this.updateSpaces();
  }
  
  /**
   * Actualiza los auxiliares
   */
  descartesJS.DescartesApp.prototype.deactivateGraphiControls = function() {
    var controls_i;
    for (var i=0, l=this.controls.length; i<l; i++) {
      controls_i = this.controls[i];
      if (controls_i.type == "graphic") {
        controls_i.deactivate();
      }
    }    
  }
  
  /**
   * Actualiza los auxiliares
   */
  descartesJS.DescartesApp.prototype.updateAuxiliaries = function() {
    for (var i=0, l=this.auxiliaries.length; i<l; i++) {
      this.auxiliaries[i].update();
    }
  }

  /**
   * Actualiza los auxiliares
   */
  descartesJS.DescartesApp.prototype.updateEvents = function() {
    for (var i=0, l=this.events.length; i<l; i++) {
      this.events[i].update();
    }    
  }
  
  /**
   * Actualiza los Controles
   */
  descartesJS.DescartesApp.prototype.updateControls = function() {
    for (var i=0, l=this.controls.length; i<l; i++) {
      this.controls[i].update();
    }
  }

  /**
   * Actualiza los Espacios
   */
  descartesJS.DescartesApp.prototype.updateSpaces = function(firstime) {
    for (var i=0, l=this.spaces.length; i<l; i++) {
      this.spaces[i].update(firstime);
    } 
  }
  
  /**
   * Limpia el rastro de los espacios
   */
  descartesJS.DescartesApp.prototype.clear = function() {
    for (var i=0, l=this.spaces.length; i<l; i++) {
      this.spaces[i].spaceChange = true;
      this.spaces[i].drawBackground();
    }    
  }
  
  /**
   * Inicia la animacion
   */
  descartesJS.DescartesApp.prototype.play = function() {
    if (this.animation) {
      this.animation.play();
    }
  }
  
  /**
   * Detiene la animacion
   */
  descartesJS.DescartesApp.prototype.stop = function() {
    if (this.animation) {
      this.animation.stop();
    }
  }
  
  /**
   * Reinicia la animacion
   */
  descartesJS.DescartesApp.prototype.reinitAnimation = function() {
    if (this.animation) {
      this.animation.reinit();
    }
  }
  
  /**
   * Dado un identificador regresa un control con ese identificador o un control dummy
   * @param {String} id el identificador del control
   */
  descartesJS.DescartesApp.prototype.getControlById = function(id) {
    var controls_i;
    for (var i=0, l=this.controls.length; i<l; i++) {
      controls_i = this.controls[i];
      if (controls_i.id == id) {
        return controls_i;
      }
    }
    
    return {update: function() {}}; 
  }
  
  /**
   * Dado un component id regresa un espacio con ese component id
   * @param {String} cId el component id del espacio
   */
  descartesJS.DescartesApp.prototype.getSpaceByCId = function(cID) {
    var spaces_i;
    for (var i=0, l=this.spaces.length; i<l; i++) {
      spaces_i = this.spaces[i];
      if (spaces_i.cID == cID) {
        return spaces_i;
      }
    }
    
    return {update: function() {}, w: 0}; 
  }
  
    /**
   * Dado un component id regresa un espacio con ese id
   * @param {String} cId el component id del espacio
   */
  descartesJS.DescartesApp.prototype.getSpaceById = function(id) {
    var spaces_i;
    for (var i=0, l=this.spaces.length; i<l; i++) {
      spaces_i = this.spaces[i];
      if (spaces_i.id == id) {
        return spaces_i;
      }
    }
    
    return {update: function() {}, w: 0}; 
  }

  /**
   * Dado un component id regresa un control con ese component id
   * @param {String} cId el component id del control
   */
  descartesJS.DescartesApp.prototype.getControlByCId = function(cID) {
    var controls_i;
    for (var i=0, l=this.controls.length; i<l; i++) {
      controls_i = this.controls[i];
      if (controls_i.cID == cID) {
        return controls_i;
      }
    }
    
    return {update: function() {}, w: 0};     
  }

  var tmpVal;
  /**
   *
   */
  function arrayToString(array) {
    var result = "[";
    for (var i=0, l=array.length; i<l; i++) {
      // es un arreglo anidado
      if (array[i] instanceof Array) {
        result += arrayToString(array[i]);
      }
      // es un valor
      else {
        tmpVal = array[i];
        if ( (typeof(tmpVal) == "undefined") || (!tmpVal)) {
          tmpVal = 0;
        }
        
        if (typeof(tmpVal) == "string") {
          tmpVal = "'" + tmpVal + "'";
        }

        result += tmpVal;
      }

      // se agregan las comas
      if (i<l-1) {
        result += ",";
      }

    }
    return result + "]"
  }

  /**
   * Obtiene el estado de las variables del applet
   */
  descartesJS.DescartesApp.prototype.getState = function() {
    var theVariables = this.evaluator.variables;
    var theValues;
    var state = "";
    
    // se recorren todos los valores de las variables
    for (var varName in theVariables) {
      if (theVariables.hasOwnProperty(varName)) {
        theValues = theVariables[varName];
        
        // si el valor es una cadena hay que garantizar que no pierde las comillas sencillas
        if (typeof(theValues) == "string") {
          theValues = "'" + theValues + "'";
        }
        
        // si el nombre de la variable es alguna de las variables internas, o si es un objeto, entonces se ignora
        if ( (theValues != undefined) && (varName != "rnd") && (varName != "pi") && (varName != "e") && (varName != "Infinity") && (varName != "-Infinity") && (typeof(theValues) != "object") ) {
          
          state = (state != "") ? (state + "\n" + varName + "=" + theValues) : (varName + "=" + theValues);
        }
      }
    }

    var theVectors = this.evaluator.vectors;
    // se recorren todos los valores de los vectores
    for (var vecName in theVectors) {
      if (theVectors.hasOwnProperty(vecName)) {
        theValues = theVectors[vecName];

        state = state + "\n" + vecName + "=" + arrayToString(theValues);
      }
    }

    var theMatrices = this.evaluator.matrices;
    // se recorren todos los valores de las matrices
    for (var matName in theMatrices) {
      if (theMatrices.hasOwnProperty(matName)) {
        theValues = theMatrices[matName];

        state = state + "\n" + matName + "=" + arrayToString(theValues);
      }
    }

    // se regresan los valores en la forma variable1=valor1\nvariable2=valor2\n...\nvariableN=valorN
    return state; 
  }
  
  /**
   * Almacena el estado de las variables del applet
   * @param state una cadena que especifica los valores a guardar de la forma variable1=valor1\nvariable2=valor2\n...\nvariableN=valorN
   */
  descartesJS.DescartesApp.prototype.setState = function(state) {
    var theState = state.split("\n");
    
    // los valores se evaluan para ser agregados
    var tmpParse;
    var value;

    for (var i=0, l=theState.length; i<l; i++) {
      tmpParse = theState[i].split("=");

      // el texto es del tipo variable=valor
      if (tmpParse.length >= 2) {
        value = eval(tmpParse[1]);

        // es el valor de una matriz
        if (tmpParse[1].indexOf("[[") != -1) {
          this.evaluator.matrices[tmpParse[0]] = value;
          // this.evaluator.variables[tmpParse[0] + ".filas"] = value.length; 
          // this.evaluator.variables[tmpParse[0] + ".columnas"] = value[0].length; 
          this.evaluator.matrices[tmpParse[0]].rows = value.length;
          this.evaluator.matrices[tmpParse[0]].cols = value[0].length;
        }
        // es el valor de un vector
        else if (tmpParse[1].indexOf("[") != -1) {
          this.evaluator.vectors[tmpParse[0]] = value;
          this.evaluator.variables[tmpParse[0] + ".long"] = value.length;
        }
        // es el valor de una variable
        else {
          this.evaluator.variables[tmpParse[0]] = value;
        }
      }

      this.update();

      // tmpParse = this.evaluator.parser.parse(theState[i], true);
      
      // // se ejecuta la asignacion de valores que se encuentra en la cadena del estado
      // this.evaluator.evalExpression( tmpParse );
      
      // // se guardan las asinaciones de valores para futuras asignaciones
      // this.saveState.push(tmpParse);
    }
    
  }
  
  /**
   * @return {String} de forma: questions=algo \n correct=algo \n wrong=algo \n control1=respuestaAlumno|0 ó 1 \n control2=respuestaAlumno|0 ó 1
   */
  descartesJS.DescartesApp.prototype.getEvaluation = function() {
    var questions = 0;
    var correct = 0;
    
    var answers = "";
    
    for (var i=0, l=this.controls.length; i<l; i++) {
      if ( (this.controls[i].gui == "textfield") && (this.controls[i].evaluate) ) {
        questions++;
        correct += this.controls[i].ok;
        this.controls[i].value = (this.controls[i].value == "") ? "''" : this.controls[i].value;
        answers += (" \\n " + this.controls[i].id + "=" + this.controls[i].value + "|" + this.controls[i].ok);
      }
    }
    
    return "questions=" + questions + " \\n correct=" + correct + " \\n wrong=" + (questions-correct) + answers;
  }

  /**
   */
  descartesJS.DescartesApp.prototype.showSolution = function() {
    //guarda los valores que tienen los campos de respuesta en el momento de llamarlo y muesta el primer elemento de los patrones de respuesta
    
    for (var i=0, l=this.controls.length; i<l; i++) {
      if ( (this.controls[i].gui == "textfield") && (this.controls[i].evaluate) ) {
        this.controls[i].changeValue( this.controls[i].getFirstAnswer() );
      }
    }
    
    this.update();
  }

  /**
   */
  descartesJS.DescartesApp.prototype.showAnswer = function() {
    //guarda los valores que tienen los campos de respuesta en el momento de llamarlo y  muestra las respuestas guardadas del alumno 
    for (var i=0, l=this.saveState.length; i<l; i++){
      this.evaluator.evalExpression( this.saveState[i] );
    }
    
    this.update();
  }
    
  return descartesJS;
})(descartesJS || {});
