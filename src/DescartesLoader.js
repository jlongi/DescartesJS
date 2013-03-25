/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var scale;

  /**
   * Descartes loader
   * @constructor 
   * @param {<applet>} applet the applet to interpret
   */
  descartesJS.DescartesLoader = function(descartesApp) {
    this.children = descartesApp.children;
    this.lessonParser = descartesApp.lessonParser;
    this.images = descartesApp.images;
    this.images.length = descartesApp.images.length;
    this.audios = descartesApp.audios;
    this.audios.length = descartesApp.audios.length;
    this.arquimedes = descartesApp.arquimedes;
    this.descartesApp = descartesApp;

    var imageURL = (descartesApp.image_loader) ? descartesApp.image_loader : drawDescartesLogo(descartesApp.loader.width, descartesApp.loader.height);

    this.imageLoader = document.createElement("div");
    this.imageLoader.width = descartesApp.width;
    this.imageLoader.height = descartesApp.height;
    this.imageLoader.setAttribute("class", "DescartesLoaderImage")
    this.imageLoader.setAttribute("style", "background-image: url(" + imageURL + "); width: " + descartesApp.width + "px; height: " + descartesApp.height + "px;");
    descartesApp.loader.appendChild(this.imageLoader);
    
    this.loaderBar = document.createElement("canvas");
    this.loaderBar.width = descartesApp.width;
    this.loaderBar.height = descartesApp.height;
    this.loaderBar.setAttribute("class", "DescartesLoaderBar");
    this.loaderBar.setAttribute("style", "width: " + descartesApp.width + "px; height:" + descartesApp.height + "px;");
    this.loaderBar.ctx = this.loaderBar.getContext("2d");

    descartesApp.loader.appendChild(this.loaderBar);
    
    // this.barWidth = Math.floor(descartesApp.loader.width/10);
    this.barWidth = Math.floor(80);
    this.barHeight = Math.floor(descartesApp.loader.height/70);
    
    var self = this;
    this.timer = setInterval(function() { self.drawLoaderBar(self.loaderBar.ctx, descartesApp.width, descartesApp.height); }, 10);

    descartesApp.firstRun = false;

    this.initPreloader();
  }

  /**
   * Init the preload of images and audios
   */
  descartesJS.DescartesLoader.prototype.initPreloader = function() {
    var children = this.children;
    var images = this.images;
    var audios = this.audios;
    var regExpImage = /[\w-//]*(\.png|\.jpg|\.gif|\.svg|\.PNG|\.JPG|\.GIF|\.SVG)/g;
    var regExpAudio = /[\w-//]*(\.ogg|\.oga|\.mp3|\.wav|\.OGG|\.OGA\.MP3|\.WAV)/g;
    var regExpVector = /vector|array|bektore|vecteur|matriz/g;
    var regExpFile = /archivo|file|fitxer|artxibo|fichier|arquivo/g;

    // if arquimedes then add the license image
    if (this.arquimedes) {
      var licenceFile = "lib/DescartesCCLicense.png";
      images[licenceFile] = descartesJS.getCreativeCommonsLicenseImage();
      images[licenceFile].addEventListener('load', function() { this.ready = 1; });
      images[licenceFile].addEventListener('error', function() { this.errorload = 1; });
    }

    var imageFilename;
    var imageTmp;
    var audioFilename;
    var vec;
    var i, j, l, il, al;
    // check all children in the applet
    for (i=0, l=children.length; i<l; i++) {
      // check if the children has an image filename
      imageFilename = (children[i].value).match(regExpImage);
      
      // if imageFilename has a match then add the images
      if (imageFilename) {
        for (j=0, il=imageFilename.length; j<il; j++) {
          imageTmp = imageFilename[j];

          // if the filename is not VACIO.GIF or vacio.gif
          if (!(imageTmp.toLowerCase().match(/vacio.gif$/)) && ((imageTmp.substring(0, imageTmp.length-4)) != "") ) {
            images[imageTmp] = new Image();
            images[imageTmp].addEventListener('load', function() { this.ready = 1; });
            images[imageTmp].addEventListener('error', function() { this.errorload = 1; });            
            images[imageTmp].src = imageTmp;
          }
        }
      }

      // check if the children has an audio filename
      audioFilename = (children[i].value).match(regExpAudio);
     
      // if audioFilename has a match then add the audios
      if (audioFilename) {
        for (j=0, al=audioFilename.length; j<al; j++) {
          this.initAudio(audioFilename[j]);
        }
      }

      // check if the children has a vector that loads a file
      vec = (children[i].value).match(regExpVector) && (children[i].value).match(regExpFile);
     
      // if vec has a match then create the vector for the preload of images. Note: this vectors is created 2 times
      if (vec) {
        this.lessonParser.parseAuxiliar(children[i].value);
      }      
    }
        
    // count how many images
    for (var propName in images) {
      if (images.hasOwnProperty(propName)) {
        this.images.length++;
      }
    }

    // count how many audios
    for (var propName in audios) {
      if ((audios).hasOwnProperty(propName)) {
        this.audios.length++;
      }
    }

    var self = this;
    var total = this.images.length + this.audios.length;
    
    /**
     * Function that checks if all the media are loaded
     */
    var checkLoader = function() {
      // contador para determinar cuantas imagenes se han cargado
      self.readys = 0;
      
      // how many images are loaded
      for (var propName in images) {
        if (images.hasOwnProperty(propName)) {
          if ( (images[propName].ready) || (images[propName].errorload) ) {
            self.readys++;
          }
        }
      }

      // how many audios are loaded
      for (var propName in self.audios) {
        if (audios.hasOwnProperty(propName)) {
          if ( (audios[propName].ready) || (audios[propName].errorload) ) {
            self.readys++;
          }
        }
      }

      // if the number of count elements is diferente to the total then execute again checLoader
      if (self.readys != total) {
        setTimeout(checkLoader, 30);
      }
      // if the number of count elements is equal to the total then clear the timer and init the build of the app
      else {
        clearTimeout(self.timer);
        self.descartesApp.initBuildApp();
      }
    }

    // first execution of checkLoader
    checkLoader();
  }

  /**
   * Add a new audio to the array of audios
   * @param {String} file the filename of the new audio
   */
  descartesJS.DescartesLoader.prototype.initAudio = function(file) {
    var audios = this.audios;

    var lastIndexOfDot = file.lastIndexOf(".");
    lastIndexOfDot = (lastIndexOfDot === -1) ? file.lenght : lastIndexOfDot;
    var filename = file.substring(0, lastIndexOfDot);

    var mediaElement = new Audio();
    mediaElement.setAttribute("preload", "auto");

    var onCanPlayThrough = function() {
      this.ready = 1;
    }
    
    var onError = function() {
      console.log("El archivo '" + file + "' no puede ser reproducido");
      this.errorload = 1;
    }

    mediaElement.addEventListener('canplaythrough', onCanPlayThrough);
    mediaElement.addEventListener('load', onCanPlayThrough);
    mediaElement.addEventListener('error', onError);

    var source;
    // mp3
    if (mediaElement.canPlayType("audio/mpeg")) {
      source = document.createElement("source");
      source.setAttribute("src", filename + ".mp3");
      source.setAttribute("type", "audio/mpeg");
      mediaElement.appendChild(source);
    }
    // ogg, oga
    if (mediaElement.canPlayType("audio/ogg")) {
      source = document.createElement("source");
      source.setAttribute("src", filename + ".ogg");
      source.setAttribute("type", "audio/ogg");
      mediaElement.appendChild(source);

      source = document.createElement("source");
      source.setAttribute("src", filename + ".oga");
      source.setAttribute("type", "audio/ogg");
      mediaElement.appendChild(source);
    }
    // wav
    if (mediaElement.canPlayType("audio/wav")) {
      source = document.createElement("source");
      source.setAttribute("src", filename + ".wav");
      source.setAttribute("type", "audio/wav");
      mediaElement.appendChild(source);
    }

    mediaElement.load();
    mediaElement.play();
    mediaElement.pause();

    audios[file] = mediaElement;


    // var audios = this.audios;
    
    // audios[file] = new Audio(file);
    // audios[file].filename = file;

    // var onCanPlayThrough = function() {
    //   this.ready = 1;
    // }
    
    // var onError = function() {
    //   if (!this.canPlayType("audio/" + this.filename.substring(this.filename.length-3)) && (this.filename.substring(this.filename.length-3) == "mp3")) {
    //     audios[file] = new Audio(this.filename.replace("mp3", "ogg"));
    //     audios[file].filename = this.filename.replace("mp3", "ogg");
    //     audios[file].addEventListener('canplaythrough', onCanPlayThrough);
    //     audios[file].addEventListener('load', onCanPlayThrough);
    //     audios[file].addEventListener('error', onError);
    //     audios[file].load();
    //   } 
    //   else {
    //     console.log("El archivo '" + file + "' no puede ser reproducido");
    //     this.errorload = 1;
    //   }
    // }
    // audios[file].addEventListener('canplaythrough', onCanPlayThrough);
    // audios[file].addEventListener('load', onCanPlayThrough);
    // audios[file].addEventListener('error', onError);

    // if (descartesJS.hasTouchSupport) {
    //   audios[file].load();
    //   audios[file].play();
    //   // setTimeout( function(){ console.log("detenido"); audios[file].pause(); }, 10);
    //   audios[file].ready = 1;
    // } else {
    //   audios[file].load();
    // }
  }

  var barWidth;
  var barHeight;
  var howMany;
  var sep;
  /**
   * Draw the loader bar
   * @param {CanvasContextRendering2D} ctx the context render where to draw
   * @param {Number} w the width of the canvas
   * @param {Number} h the height of the canvas
   */
  descartesJS.DescartesLoader.prototype.drawLoaderBar = function(ctx, w, h) {
    // // scale = 2;
    // if (w < h) {
    //   scale = (w/(120*3));
    // }
    // else {
    //   scale = (h/(65*3));
    // }
    barWidth = this.barWidth;
    barHeight = this.barHeight;
    howMany = this.images.length + this.audios.length;
    sep = (2*(barWidth-2))/howMany;
    
    ctx.translate(w/2, (h-(65*scale))/2 +90*scale);
    // ctx.translate(w/2, h-25*scale);
    ctx.scale(scale, scale);

    ctx.strokeRect(-barWidth, -barHeight, 2*barWidth, barHeight);
    
    ctx.fillStyle = "gray";
    ctx.fillRect(-barWidth+2, -barHeight+2, 2*(barWidth-2), barHeight-4);
    
    ctx.fillStyle = "#1f375d";
    ctx.fillRect(-barWidth+2, -barHeight+2, this.readys*sep, barHeight-4);

    // reset the transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }  

  /**
   * Draw the descartesJS logo
   * @param {Number} w space width
   * @param {Number} h space height
   * @return {Image} return the image corresponding to the logo
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
    // the original image measure 120 x 65 pixels
    // scale = 3;
    if (w < h) {
      scale = (w/(120*3));
    }
    else {
      scale = (h/(65*3));
    }
    scale = (scale > 2.5) ? 2.5 : scale;

    ctx.translate((w-(120*scale))/2, (h-(65*scale))/2);
    ctx.scale(scale, scale);
    
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

    ctx.font = "20px Arial, Helvetica, 'Droid Sans', Sans-serif";
    ctx.fillText("escartes", 45, 33);
    ctx.fillText("JS", 98, 64);
    ctx.restore();

    return canvas.toDataURL();
  }  
    
  return descartesJS;
})(descartesJS || {});