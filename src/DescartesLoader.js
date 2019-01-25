/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var scale;
  var original_w = 880;
  var original_h = 840;
  var original_scale = 1.3;
  var barWidth = 356;


  /**
   * Descartes loader
   * @constructor
   * @param {<applet>} applet the applet to interpret
   */
  descartesJS.DescartesLoader = function(descartesApp) {
    var self = this;

    this.children = descartesApp.children;
    this.lessonParser = descartesApp.lessonParser;
    this.images = descartesApp.images;
    this.images.length = descartesApp.images.length;
    this.audios = descartesApp.audios;
    this.audios.length = descartesApp.audios.length;
    this.descartesApp = descartesApp;

    var imageURL = (descartesApp.imgLoader) ? descartesApp.imgLoader : drawDescartesLogo(descartesApp.loader.width, descartesApp.loader.height, descartesApp.ratio);

    this.imageLoader = document.createElement("div");
    this.imageLoader.width = descartesApp.width;
    this.imageLoader.height = descartesApp.height;
    this.imageLoader.setAttribute("class", "DescartesLoaderImage")
    this.imageLoader.setAttribute("style", "background-image:url(" + imageURL + ");background-size:cover;width:" + descartesApp.width + "px;height:" + descartesApp.height + "px;");

    descartesApp.loader.appendChild(this.imageLoader);

    this.loaderBar = document.createElement("canvas");
    this.loaderBar.width = descartesApp.width;
    this.loaderBar.height = descartesApp.height;
    this.loaderBar.setAttribute("class", "DescartesLoaderBar");
    this.loaderBar.setAttribute("style", "width:" + descartesApp.width + "px;height:" + descartesApp.height + "px;");
    this.loaderBar.ctx = this.loaderBar.getContext("2d");

    this.loaderBar.ctx.lineCap = "round";
    this.loaderBar.ctx.lineWidth = 14;
    this.loaderBar.ctx.translate(descartesApp.width/2, (descartesApp.height-(original_h*scale))/3 +(original_h-80)*scale);
    this.loaderBar.ctx.scale(scale, scale);

    descartesApp.loader.appendChild(this.loaderBar);

    this.timer = descartesJS.setInterval(function() { self.drawLoaderBar(self.loaderBar.ctx, barWidth); }, 10);

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
    var regExpImage = /[\w\.\-//]*(\.png|\.jpg|\.gif|\.svg)/gi;
    var regExpAudio = /[\w\.\-//]*(\.ogg|\.oga|\.mp3|\.wav)/gi;

    // if arquimedes then add the license image
    var licenceFile = "lib/DescartesCCLicense.png";
    images[licenceFile] = descartesJS.getCCLImg();
    images[licenceFile].addEventListener('load', function() { this.ready = 1; });
    images[licenceFile].addEventListener('error', function() { this.errorload = 1; });

    var imageFilename;
    var imageTmp;
    var audioFilename;
    var i, j, l, il, al;
    // check all children in the applet
    for (i=0, l=children.length; i<l; i++) {
      if (children[i].name === "rtf") {
        continue;
      }

      // macro patch
      if (children[i].value.match(/'macro'|'makro'/g)) {
        var filename = "";
        var response;

        var values = this.lessonParser.split(children[i].value);
        for (var v_i=0, v_l=values.length; v_i<v_l; v_i++) {
          if (babel[values[v_i][0]] === "expresion") {
            filename = values[v_i][1];
          }
        }

        if (filename) {
          // the macro is embeded in the webpage
          var macroElement = document.getElementById(filename);

          if ((macroElement) && (macroElement.type == "descartes/macro")) {
            response = macroElement.text;
          }
          // the macro is in an external file
          else {
            response = descartesJS.openExternalFile(filename);

            // verify the content is a Descartes macro
            if ( (response) && (!response.match(/tipo_de_macro/g)) ) {
              response = null;
            }
          }
        }

        if (response) {
          imageFilename = response.match(regExpImage);
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
        }
      }
      // macro patch

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
    this.sep = (2*barWidth)/(total-1);

    /**
     * Function that checks if all the media are loaded
     */
    var checkLoader = function() {
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
      for (var propName in audios) {
        if (audios.hasOwnProperty(propName)) {
          if ( (audios[propName].ready) || (audios[propName].errorload) ) {
            self.readys++;
          }
        }
      }

      // if the number of count elements is different to the total then execute again checkLoader
      if (self.readys != total) {
        descartesJS.setTimeout(checkLoader, 30);
      }
      // if the number of count elements is equal to the total, then clear the timer and init the build of the app
      else {
        descartesJS.clearInterval(self.timer);
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

    audios[file] = new Audio(file);
    audios[file].filename = file;

    var onCanPlayThrough = function() {
      this.ready = 1;
    }

    var onError = function() {
      if (!this.canPlayType("audio/" + this.filename.substring(this.filename.length-3)) && (this.filename.substring(this.filename.length-3) == "mp3")) {
        audios[file] = new Audio(this.filename.replace("mp3", "ogg"));
        audios[file].filename = this.filename.replace("mp3", "ogg");
        audios[file].addEventListener('canplaythrough', onCanPlayThrough);
        audios[file].addEventListener('load', onCanPlayThrough);
        audios[file].addEventListener('error', onError);
        audios[file].load();
      }
      else {
        console.log("El archivo '" + file + "' no puede ser reproducido");
        this.errorload = 1;
      }
    }
    audios[file].addEventListener('canplaythrough', onCanPlayThrough);
    audios[file].addEventListener('load', onCanPlayThrough);
    audios[file].addEventListener('error', onError);

    if (descartesJS.hasTouchSupport) {
      audios[file].load();
      audios[file].play();
      descartesJS.setTimeout( function(){
        // console.log("detenido");
        audios[file].pause();
      }, 20);
      audios[file].ready = 1;
    } else {
      audios[file].load();
    }
  }
  /**
   * Draw the loader bar
   * @param {CanvasContextRendering2D} ctx the context render where to draw
   * @param {Number} w the width of the canvas
   * @param {Number} h the height of the canvas
   */
  descartesJS.DescartesLoader.prototype.drawLoaderBar = function(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = "#f2f2f2";
    ctx.moveTo(-barWidth, 0);
    ctx.lineTo( barWidth, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#2daae4";
    ctx.moveTo(-barWidth, 0);
    ctx.lineTo(-barWidth +this.readys*this.sep, 0);
    ctx.stroke();
  }

  /**
   * Draw the descartesJS logo
   * @param {Number} w space width
   * @param {Number} h space height
   * @return {Image} return the image corresponding to the logo
   */
  var drawDescartesLogo = function(w, h, ratio) {
    var canvas = document.createElement("canvas");
    var ratio = ((w*this.ratio * h*this.ratio) > 5000000) ? 1 : ratio;

    canvas.width  = w * ratio;
    canvas.height = h * ratio;
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";

    var ctx = canvas.getContext("2d");

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    scale = (w < h) ? (w/(original_w*original_scale)) : (h/(original_h*original_scale));
    scale = (scale > 2.5) ? 2.5 : scale;

    ctx.translate((w-(original_w*scale))/2, (h-(original_h*scale))/3);
    ctx.scale(scale, scale);

    ctx.drawImage(descartesJS.loaderImg, 0, 0);

    return canvas.toDataURL();
  }

  return descartesJS;
})(descartesJS || {});
