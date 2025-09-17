/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let scale = 1;
  const original_scale = 1.3;
  const original_w = 880;
  const original_h = 840;
  const barWidth = 726;
  const barHeight = 14;

  /**
   * Descartes loader
   * @param {<applet>} applet the applet to interpret
   */
  class DescartesLoader {
    constructor(descartesApp) {
      let self = this;

      self.children = descartesApp.children;
      self.lessonParser = descartesApp.lessonParser;
      self.images = descartesApp.images;
      self.audios = descartesApp.audios;
      self.im_l = self.au_l = 0;
      self.descartesApp = descartesApp;

      // add the embebed images in scripts with type "descartes/imagen"
      let descartes_images = document.querySelectorAll(`script[type="descartes/imagen"]`);
      for (let img of descartes_images) {
        self.images[img.id] = new Image();
        self.images[img.id].onload = function() {
          this.ready = 1;
        }
        self.images[img.id].src = img.innerText.trim();
      }

      self.imgLoader = descartesJS.newHTML("div", {
        class : "DescartesLoaderImage",
      });
      
      self.progress = descartesJS.newHTML("progress", {
        class : "PBL",
        value : 0,
        max   : 100,
      });

      // has a value in the parameter image_loader
      if (descartesApp.imgLoader) {
        descartesApp.loader.style.backgroundColor = "transparent";
        self.imgLoader.setAttribute("style", `background-image:url(${descartesApp.imgLoader});background-size:contain;`);
      }
      else {
        scale = (descartesApp.width < descartesApp.height) ? (descartesApp.width/(original_w*original_scale)) : (descartesApp.height/(original_h*original_scale));
        scale = Math.min(2.5, scale);

        self.imgLoader.setAttribute(
          "style", 
          `background-image:url(${descartesJS.loaderImg.src});background-position:50% 33.5%;background-size:${original_w*scale}px;`
        );

        self.progress.setAttribute(
          "style", 
          `visibility:visible;left:${(descartesApp.width - barWidth*scale)/2}px;top:${descartesApp.height*33.5/100 + (original_h+100)*scale/2}px;width:${barWidth*scale}px;height:${barHeight*scale}px;`
        );
      }

      descartesApp.loader.appendChild(self.imgLoader);
      descartesApp.loader.appendChild(self.progress);

      descartesApp.firstRun = false;

      self.initPreloader();
    }

    /**
     * Init the preload of images and audios
     */
    initPreloader() {
      let self = this;

      let children = self.children;
      let images = self.images;
      let audios = self.audios;
      let regExpImage = /[\w\.\-//]*(\.png|\.jpg|\.gif|\.svg|\.webp)/gi;
      let regExpAudio = /[\w\.\-//]*(\.ogg|\.oga|\.mp3|\.wav)/gi;
      let regExpMacro = /'macro'|'makro'/g;

      let imageFilename;
      let imageTmp;
      let audioFilename;
      let i, j, l, il, al;
      // check all children in the applet
      for (i=0, l=children.length; i<l; i++) {
        // macro patch, search images inside the macro
        if ((children[i].value).match(regExpMacro)) {
          let filename = "";
          let response;

          let values = self.lessonParser.split(children[i].value);
          for (let v_i=0, v_l=values.length; v_i<v_l; v_i++) {
            if (babel[values[v_i][0]] === "expresion") {
              filename = values[v_i][1];
            }
          }

          if (filename) {
            // the macro is embedded in the webpage
            let macroElement = document.getElementById(filename);
            if ((macroElement) && (macroElement.type == "descartes/macro")) {
              response = macroElement.text;
            }
            // the macro is in an external file
            else {
              response = descartesJS.openFile(filename);
            }
          }

          if (response) {
            imageFilename = response.match(regExpImage);
            if (imageFilename) {
              for (j=0, il=imageFilename.length; j<il; j++) {
                imageTmp = imageFilename[j];

                // if the filename is not VACIO.GIF or vacio.gif
                if (!(imageTmp.toLowerCase().endsWith("vacio.gif")) && ((imageTmp.substring(0, imageTmp.length-4)) != "") ) {
                  if(!images[imageTmp]) {
                    images[imageTmp] = this.descartesApp.getImageAux(imageTmp);
                  }
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
            if (!(imageTmp.toLowerCase().endsWith("vacio.gif")) && ((imageTmp.substring(0, imageTmp.length-4)) != "") ) {
              if(!images[imageTmp]) {
                images[imageTmp] = this.descartesApp.getImageAux(imageTmp);
              }
            }
          }
        }

        // check if the children has an audio filename
        audioFilename = (children[i].value).match(regExpAudio);

        // if audioFilename has a match then add the audios
        if (audioFilename) {
          for (j=0, al=audioFilename.length; j<al; j++) {
            if (!audios[audioFilename[j]]) {
              audios[audioFilename[j]] = this.descartesApp.getAudioAux(audioFilename[j]);
            }
          }
        }
      }

      // count how many images
      for (let propName in images) {
        if (images.hasOwnProperty(propName)) {
          self.im_l++;
        }
      }

      // count how many audios
      for (let propName in audios) {
        if (audios.hasOwnProperty(propName)) {
          self.au_l++;
        }
      }

      let total = self.im_l + self.au_l;
      if (total > 0) {
        self.progress.setAttribute("max", total);
      }

      let ready_counter;
      /**
       * Function that checks if all the media are loaded
       */
      let checkLoader = function() {
        ready_counter = 0;

        // how many images are loaded
        for (let propName in images) {
          if (images.hasOwnProperty(propName)) {
            if ( (images[propName].ready) || (images[propName].errorload) ) {
              ready_counter++;
            }
          }
        }

        // how many audios are loaded
        for (let propName in audios) {
          if (audios.hasOwnProperty(propName)) {
            if ( (audios[propName].ready) || (audios[propName].errorload) ) {
              ready_counter++;
            }
          }
        }

        // update the progress bar
        self.progress.setAttribute("value", ready_counter);

        // if the number of count elements is different to the total then execute again checkLoader
        if (ready_counter != total) {
          self.timer = descartesJS.setTimeout(checkLoader, 1);
        }
        // if the number of count elements is equal to the total init the build of the app
        else {
          self.descartesApp.initBuildApp();
        }
      }

      // first execution of checkLoader
      checkLoader();
    }
  }

  descartesJS.DescartesLoader = DescartesLoader;
  return descartesJS;
})(descartesJS || {});
