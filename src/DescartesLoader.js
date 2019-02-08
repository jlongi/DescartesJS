/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var scale = 1;
  var original_scale = 1.3;
  var original_w = 880;
  var original_h = 840;
  var barWidth = 726;
  var barHeight = 14;


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

    this.imgLoader = document.createElement("div");
    this.imgLoader.setAttribute("class", "DescartesLoaderImage")

    this.progress = document.createElement("progress");
    this.progress.setAttribute("class", "PBL");
    this.progress.setAttribute("value", 0);
    this.progress.setAttribute("max", 100);

    // has a value in the parameter image_loader
    if (descartesApp.imgLoader) {
      // this.imgLoader.setAttribute("style", "background-image:url(" + descartesApp.imgLoader + ");background-size:contain;width:" + descartesApp.width + "px;height:" + descartesApp.height + "px;");
      this.imgLoader.setAttribute("style", "background-image:url(" + descartesApp.imgLoader + ");background-size:contain;");
    }
    else {
      scale = (descartesApp.width < descartesApp.height) ? (descartesApp.width/(original_w*original_scale)) : (descartesApp.height/(original_h*original_scale));
      scale = (scale > 2.5) ? 2.5 : scale;

      // this.imgLoader.setAttribute("style", "background-image:url(" + descartesJS.loaderImg.src + ");background-position:50% 33.5%;background-size:"+ (original_w*scale) +"px;width:" + descartesApp.width + "px;height:" + descartesApp.height + "px;");
      this.imgLoader.setAttribute("style", "background-image:url(" + descartesJS.loaderImg.src + ");background-position:50% 33.5%;background-size:"+ (original_w*scale) +"px;");

      this.progress.setAttribute("style", "visibility:visible; left:"+ ((descartesApp.width-barWidth*scale)/2) +"px; top:"+ ( descartesApp.height*33.5/100 + (original_h+100)*scale/2 ) +"px; width:"+ (barWidth*scale) +"px; height:"+ (barHeight*scale) +"px;");
    }

    descartesApp.loader.appendChild(this.imgLoader);
    descartesApp.loader.appendChild(this.progress);

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

    // add the license image for arquimedes lessons
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

      // macro patch, search images inside the macro
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
      if (audios.hasOwnProperty(propName)) {
        this.audios.length++;
      }
    }

    var self = this;
    var total = this.images.length + this.audios.length;
    if (total > 0) {
      this.progress.setAttribute("max", total);
    }

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

      // update the progress bar
      self.progress.setAttribute("value", self.readys);

      // if the number of count elements is different to the total then execute again checkLoader
      if (self.readys != total) {
        descartesJS.setTimeout(checkLoader, 1);
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

  return descartesJS;
})(descartesJS || {});
