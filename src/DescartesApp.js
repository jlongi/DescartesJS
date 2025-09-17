/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let fill_regexp = /type='fill'|tipo='relleno'|tipus='ple'|mota='betea'|type='plein'|tipo='recheo'|tipo='curva_piena'|tipo='preencher'|tipus='ple'/;

  /**
   * Descartes application interpreted with JavaScript
   * @param {<applet>} applet the applet to interpret
   */
  class DescartesApp {
    constructor(applet) {
      this.animation = { 
        playing: false, 
        play:   ()=>{},
        stop:   ()=>{},
        reinit: ()=>{},
      };

      this.ratio = descartesJS._ratio;

      this.URL = window.location.href;

      this.applet = applet;

      this.parentC = applet.parentNode;

      this.width = parseFloat( applet.getAttribute("width") );
      this.height = parseFloat( applet.getAttribute("height") );

      this.decimal_symbol = ".";
      this.decimal_symbol_regexp = new RegExp("\\.", "g");

      this.language = "español";

      this.children = applet.getElementsByTagName("param");
      this.code = applet.getAttribute("code");

      this.images = { };
      this.audios = { };

      this.firstRun = true;

      this.keyboard = new descartesJS.Keyboard(this);

      // function to prevent undefined error
      this.scaleToFit = () => {};

      // init the interpretation
      this.init()
    }

    /**
     * Init the variables needed for parsing and create the descartes scene
     */
    init() {
      // stop the animation, if the action init executes maybe the animation is playing
      this.stop();

      /**
       * evaluator and parser of expressions
       * type {Evaluator}
       * @private
       */
      this.evaluator = new descartesJS.Evaluator(this);

      // get the width and height of the scene 
      this.evaluator.setVariable("DJS.w", this.width);
      this.evaluator.setVariable("DJS.h", this.height);
      this.evaluator.setVariable("DJS.container_w", this.width);
      this.evaluator.setVariable("DJS.container_h", this.height);

      // get the url parameter if any
      this.getURLParameters();

      /**
       * parser of elements in the lesson
       * @type {LessonParser}
       * @private
       */
      this.lessonParser = new descartesJS.LessonParser(this);

      let children = this.children;
      let children_i;

      for (children_i of children) {
        // get the buttons height
        if (babel[children_i.name] == "Buttons") {
          this.buttonsConfig = this.lessonParser.parseButtonsConfig(children_i.value);
          continue;
        }

        // get image source for the loader
        if (children_i.name == "image_loader") {
          this.imgLoader = children_i.value;
          continue;
        }

        // get the cover parameter of the scene
        if (children_i.name == "expand") {
          this.expand = children_i.value;
          continue;
        }

        // set the docBase for the elements in the resources
        if (children_i.name == "docBase") {
          document.head.appendChild(
            descartesJS.newHTML("base", {
              id   : "descartesJS_base",
              href : children_i.value,
            })
          );
          continue;
        }

        if (children_i.name.startsWith("E_")) {
          break;
        }
      }


      if (this.externalSpace && this.externalSpace.container.parentNode) {
        document.body.removeChild(this.externalSpace.container);
      }
      this.externalSpace = new descartesJS.SpaceExternal(this);


      this.northSpace = {container: descartesJS.newHTML("div"), controls: []};
      this.southSpace = {container: descartesJS.newHTML("div"), controls: []};
      this.eastSpace = {container: descartesJS.newHTML("div"), controls: []};
      this.westSpace = {container: descartesJS.newHTML("div"), controls: []};
      this.editableRegion = {container: descartesJS.newHTML("div"), textFields: []};

      this.spaces = [];
      this.controls = [];
      this.auxiliaries = [];
      this.events = [];

      this.zIndex = this.tabindex = this.plecaHeight = this.nIframes = 0;


      // code needed for reinit the lesson
      if (this.container != undefined) {
        this.cleanCanvasImages();
        this.parentC.removeChild(this.container);
        delete(this.container);
        delete(this.loader);
      }

      this.container = descartesJS.newHTML("div");
      this.loader = descartesJS.newHTML("div", {
        class : "DescartesLoader",
      });
      /** Prevent show context menu when a right click occurs */
      this.container.addEventListener("contextmenu", descartesJS.preventDefault);
      /** */

      // append the lesson container to the java applet container
      this.parentC.insertBefore(this.container, this.parentC.firstChild);
      this.container.width  = this.loader.width  = this.width;
      this.container.height = this.loader.height = this.height;
      this.container.className = "DescartesAppContainer";
      this.container.setAttribute("style", `width:${this.width}px;height:${this.height}px;`);

      // add the loader
      this.container.appendChild(this.loader);

      // resize functions
      // fit space
      if (this.expand == "fit") {
        let cssNode = descartesJS.newHTML("style", {
          rel  : "stylesheet",
          type : "text/css",
          id   : "StyleDescartesAppsPrint",
        });
        document.head.insertBefore(cssNode, document.head.firstChild);
        cssNode.innerHTML = `@page{margin:0cm;size:${this.width}px ${this.height}px;}`;

        let meta_viewport = document.querySelector("meta[name=viewport");
        if (meta_viewport) {
          if (window.parent == window) {
            meta_viewport.setAttribute("content", `width=${this.width},initial-scale=1.0,user-scalable=no`);
          }
        }

        document.body.style.margin = document.body.style.padding = 0;
        document.body.style.overflow = "hidden";
        this.container.parentNode.removeAttribute("align");
        this.container.parentNode.style.overflow = "hidden";
        this.container.style.left = this.container.style.top = '50%';
        this.container.style.transformOrigin = '50% 50%';
        this.scaleToFit = scaleToFit;
        this.scaleToFit();
      }
      // cover space
      if (this.expand == "cover") {
        this.scaleToFit = function() {
          this.container.width = this.width = window.innerWidth;
          this.container.height = this.height = window.innerHeight;
          this.container.setAttribute("style", `width:${this.width}px;height:${this.height}px;`);
          this.evaluator.setVariable("DJS.container_w", this.container.width);
          this.evaluator.setVariable("DJS.container_h", this.container.height);
          try { this.update(); } catch(e) {}

          if (this.spaces) {
            for (const space_i of this.spaces) {
              space_i.initSpace();
              space_i.init();
              space_i.update(true);
            }
          }
        };
        this.scaleToFit();
      }

      // first run
      if (this.firstRun) {
        this.loader.style.display = "block";
        new descartesJS.DescartesLoader(this);
      } else {
        this.initBuildApp();
      }
    }

    /**
     * Init the parsing and creation of objects for the descartes lesson
     */
    initBuildApp() {
      descartesJS.showConfig = true;

      let self = this;

      let children = self.children;
      let children_i;
      let lessonParser = self.lessonParser;

      let tmpSpaces = [];
      let tmpControls = [];
      let tmpAuxiliaries = [];
      let tmpGraphics = [];
      let tmp3DGraphics = [];
      let tmpAnimations = [];

      // check all the children
      for (children_i of children) {
        // find if the scene is editable
        if (babel[children_i.name] == "editable") {
          descartesJS.showConfig = (babel[children_i.value] != 'false');
          continue;
        }

        // find the language of the lesson
        if (babel[children_i.name] == "language") {
          self.language = children_i.value;
          continue;
        }

        // find the parameters for the buttons
        if (babel[children_i.name] == "Buttons") {
          self.buttonsConfig = lessonParser.parseButtonsConfig(children_i.value);
          continue;
        }

        // find the decimal symbol
        if (babel[children_i.name] == "decimal_symbol") {
          self.decimal_symbol = children_i.value;
          self.decimal_symbol_regexp = new RegExp("\\" + self.decimal_symbol, "g");
          continue;
        }

        // find the descartes version
        if (babel[children_i.name] == "version") {
          self.version = parseInt(children_i.value);
          continue;
        }

        // if the name of the children start with "E" then is a space
        if (children_i.name.startsWith("E_")) {
          if ((/='HTMLIFrame'/).test(children_i.value)) {
            self.nIframes++;
          }
          tmpSpaces.push(children_i.value);
          continue;
        }

        // if the name of the children start with "C_" then is a control
        if (children_i.name.startsWith("C_")) {
          tmpControls.push(children_i.value);
          continue;
        }

        // if the name of the children start with "A_" then is an auxiliary
        if (children_i.name.startsWith("A_")) {
          tmpAuxiliaries.push(children_i.value);
          continue;
        }

        // if the name of the children start with "G" then is a graphic
        if (children_i.name.startsWith("G_")) {
          // prevent the use of a retina canvas if the space has a fill graphic
          if (fill_regexp.test(children_i.value)) {
            self.ratio = 1;
          }
          tmpGraphics.push(children_i.value);
          continue;
        }

        // if the name of the children start with "S" then is a tridimensional graphic
        if (children_i.name.startsWith("S_")) {
          tmp3DGraphics.push(children_i.value);
          continue;
        }

        // if the name of the children is "Animation" then is an animation
        if (babel[children_i.name] == "Animation") {
          tmpAnimations.push(children_i.value);
          continue;
        }
      }

      // init the spaces
      for (let tmpSpaces_i of tmpSpaces) {
        // create and add a space to the list of spaces
        self.spaces.push(lessonParser.parseSpace(tmpSpaces_i));
        // increase the z index for the next space is placed on the above space
        self.zIndex++;
      }

      // init the graphics
      tmpGraphics.forEach((elem, i) => {
        descartesJS.DEBUG.elemIndex = i;
        elem = lessonParser.parseGraphic(elem);
        if (elem) {
          self.editableRegionVisible = self.editableRegionVisible || (elem.visible);
          elem.space.addGraph(elem);
        }
      });

      // init the tridimensional graphics
      tmp3DGraphics.forEach((elem, i) => {
        descartesJS.DEBUG.elemIndex = i;
        elem = lessonParser.parse3DGraphic(elem);
        if (elem) {
          elem.space.addGraph(elem, true);
        }
      });

      // init the controls
      for (let tmpControls_i of tmpControls) {
        self.controls.push( lessonParser.parseControl(tmpControls_i) );
      }

      // init the auxiliary
      for (let tmpAuxiliaries_i of tmpAuxiliaries) {
        lessonParser.parseAuxiliar(tmpAuxiliaries_i);
      }

      // init the animation
      for (let tmpAnimations_i of tmpAnimations) {
        self.animation = lessonParser.parseAnimation(tmpAnimations_i);
      }

      // configure the regions
      self.configRegions();

      self.updateAuxiliaries();
      // beware
      self.updateAuxiliaries();
      // beware

      for (let controls_i of self.controls) {
        controls_i.init();
      }
      self.updateControls();

      self.updateSpaces(true);

      // finish the interpretation
      descartesJS.setTimeout(() => { self.finishInit(); }, 10*self.nIframes);

      // event listener for copy the configuration of the scene
      document.addEventListener('keydown', function(evt) {
        if (
          (evt.ctrlKey && evt.shiftKey && evt.key === 'C') ||
          (evt.commandKey && evt.shiftKey && evt.key === 'C')
        ) {
          // console.log("Control+Shift+C o Command+Shift+C presionados!");
          navigator.clipboard.writeText(self.applet.innerHTML);
          // prevent that some browsers open the DOM inspector
          descartesJS.preventDefault(evt);
        }
      });
    }

    /**
     * Finish the interpretation
     */
    finishInit() {
      let self = this;

      self.evaluator.setVariable("decimalSymbol", self.decimal_symbol);
      self.update();

      // when done remove the loader container from the DOM
      self.loader.parentNode.removeChild(self.loader);

      // if the window parent is different from the current window, then is embedded in an iFrame
      if (window.parent !== window) {
        self.parentC.style.margin = self.parentC.style.padding = "0px";

        // iOS fix to the scroll in iframes
        // if the scene is in an iframe and expands to the container then prevent the scroll in the document
        if (self.expand == "fit") {
          window.addEventListener("touchmove", evt => { evt.preventDefault(); evt.stopPropagation(); });
        }

        window.parent.postMessage({ type: "reportSize", href: self.URL, width: self.width, height: self.height }, '*');
        window.parent.postMessage({ type: "ready", value: self.URL }, '*');

        descartesJS.onResize();
      }

      // scene open in a new window
      if (window.opener) {
        window.opener.postMessage({ type: "isResizeNeeded", href: self.URL }, '*');
      }

      // init the external space only when showConfig == true
      if (descartesJS.showConfig) {
        self.externalSpace.init();
      }

      // trigger descartesReady event
      try {
        window.dispatchEvent(new CustomEvent("descartesReady", { "detail":self }));
      }
      catch(e) {
        console.warn("CustomEvents not supported in this browser");
      }

      /** */
      self.evaluator.setFunction("openKB", function(layoutType, kb_x, kb_y, var_id, tf_x, tf_y, tf_w, tf_h, tf_fs, tf_val, tf_onlyText) {
        let textfield = {
          x : tf_x,
          y : tf_y,
          w : tf_w,
          h : tf_h,
          fs : tf_fs + "px",
          value : tf_val+"",
          type : "custom",
          tagName: "textfield"
        }
        self.keyboard.show(null, layoutType, kb_x, kb_y, var_id, textfield, tf_onlyText)
      });

      self.readyApp = true;
    }

    /**
     * Adjust the size of the window if needed
     */
    adjustSize() {
      document.body.style.margin = document.body.style.padding = this.parentC.style.margin = this.parentC.style.padding = "0px";
      const winWidth  = parseInt(this.width  + 30);
      const winHeight = parseInt(this.height + 90);
      window.moveTo(
        parseInt(screen.width  - winWidth)  /2, 
        parseInt(screen.height - winHeight) /2
      );
      window.resizeTo(winWidth, winHeight);
      descartesJS.onResize();
    }

    /**
     * Configure the regions
     */
    configRegions() {
      let parser = this.evaluator.parser;
      let buttonsConfig = this.buttonsConfig || {};
      let principalContainer = this.container;

      let defaultFontSizeButtons = "15";
      let aboutWidth = 100;
      let configWidth = 100;
      let initWidth = 100;
      let clearWidth = 100;

      let northRegionHeight = 0;
      let southRegionHeight = 0;
      let eastRegionHeight = 0;
      let westRegionHeight = 0;
      let editableRegionHeight = 0;
      let northRegionWidth = 0;
      let southRegionWidth = 0;
      let eastRegionWidth = 0;
      let westRegionWidth = 0;

      let northSpaceControls = this.northSpace.controls;
      let southSpaceControls = this.southSpace.controls;
      let eastSpaceControls = this.eastSpace.controls;
      let westSpaceControls = this.westSpace.controls;

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // north region
      if ((buttonsConfig.rowsNorth > 0) || ( northSpaceControls.length > 0) || (buttonsConfig.about) || (buttonsConfig.config)) {
        // if the number of rows is zero but contains controls then the height is the specified height
        if (buttonsConfig.rowsNorth <= 0) {
          northRegionHeight = buttonsConfig.height;
          buttonsConfig.rowsNorth = 1;
        }
        // if the number of rows is different of zero then the height is the number of rows
        else {
          northRegionHeight = buttonsConfig.height * buttonsConfig.rowsNorth;
        }

        let container = this.northSpace.container;
        container.id = "descartesJS_north";
        container.setAttribute("style", `width:${principalContainer.width}px;height:${northRegionHeight}px;left:0;top:${this.plecaHeight}px;`);

        principalContainer.insertBefore(container, this.loader);

        northRegionWidth = principalContainer.width;
        let displaceButton = 0;

        // show the credits button
        if (buttonsConfig.about) {
          displaceButton = aboutWidth;
          northRegionWidth -= displaceButton;
        }
        else {
          aboutWidth = 0;
        }
        // show the configuration button
        if (buttonsConfig.config) {
          northRegionWidth -= configWidth;
        }

        let numberOfControlsPerRow = Math.ceil(northSpaceControls.length / buttonsConfig.rowsNorth);
        let controlWidth = northRegionWidth/numberOfControlsPerRow;

        // configure the controls in the region
        for (let i=0,l=northSpaceControls.length; i<l; i++) {
          northSpaceControls[i].expresion = parser.parse(`(${displaceButton + controlWidth*(i%numberOfControlsPerRow)},${buttonsConfig.height*Math.floor(i/numberOfControlsPerRow)},${controlWidth},${buttonsConfig.height})`);
          northSpaceControls[i].init();
        }

        // create the credits button
        if (buttonsConfig.about) {
          let btnAbout = new descartesJS.Button(
            this, 
            {
              region: "north",
              name: (this.language == "english") ? "about" : "créditos",
              font_size: parser.parse(defaultFontSizeButtons),
              expresion: parser.parse(`(0,0,${aboutWidth},${northRegionHeight})`)
            }
          );
          btnAbout.actionExec = { execute: descartesJS.showAbout };
          btnAbout.update();
        }
        // create the configuration button
        if (buttonsConfig.config) {
          let btnConfig = new descartesJS.Button(
            this, 
            {
              region: "north",
              name: "config",
              font_size: parser.parse(defaultFontSizeButtons),
              action: "config",
              expresion: parser.parse(`(${northRegionWidth + aboutWidth},0,${configWidth},${northRegionHeight})`)
            }
          );
          btnConfig.update();
        }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // south region
      if ((buttonsConfig.rowsSouth > 0) || (southSpaceControls.length > 0) || (buttonsConfig.init) || (buttonsConfig.clear)) {
        // if the number of rows is zero but contains controls then the height is the specified height
        if (buttonsConfig.rowsSouth <= 0) {
          southRegionHeight = buttonsConfig.height;
          buttonsConfig.rowsSouth = 1;
        }
        // if the number of rows is different of zero then the height is the number of rows
        else {
          southRegionHeight = buttonsConfig.height * buttonsConfig.rowsSouth;
        }

        southRegionWidth = principalContainer.width;
        let displaceButton = 0;
        // show the init button
        if (buttonsConfig.init) {
          displaceButton = initWidth;
          southRegionWidth -= displaceButton;
        }
        else {
          initWidth = 0;
        }
        // show the clear button
        if (buttonsConfig.clear) {
          southRegionWidth -= clearWidth;
        }

        let container = this.southSpace.container;
        container.id = "descartesJS_south";
        container.setAttribute("style", `width:${principalContainer.width}px;height:${southRegionHeight}px;left:0;bottom:0;`);

        principalContainer.insertBefore(container, this.loader);

        let numberOfControlsPerRow = Math.ceil(southSpaceControls.length / buttonsConfig.rowsSouth);
        let controlWidth = southRegionWidth/numberOfControlsPerRow;

        // configure the controls in the region
        for (let i=0,l=southSpaceControls.length; i<l; i++) {
          southSpaceControls[i].expresion = parser.parse(`(${displaceButton + controlWidth*(i%numberOfControlsPerRow)},${buttonsConfig.height*Math.floor(i/numberOfControlsPerRow)},${controlWidth},${buttonsConfig.height})`);
          southSpaceControls[i].init();
        }

        // create the init button
        if (buttonsConfig.init) {
          let btnInit = new descartesJS.Button(
            this, 
            {
              region: "south",
              name: (this.language == "english") ? "init" : "inicio",
              font_size: parser.parse(defaultFontSizeButtons),
              action: "init",
              expresion: parser.parse(`(0,0,${initWidth},${southRegionHeight})`)
            }
          );
          btnInit.update();
        }
        // create the clear button
        if (buttonsConfig.clear) {
          let btnClear = new descartesJS.Button(
            this, 
            {
              region: "south",
              name: (this.language == "english") ? "clear" : "limpiar",
              font_size: parser.parse(defaultFontSizeButtons),
              action: "clear",
              expresion: parser.parse(`(${southRegionWidth + initWidth},0,${clearWidth},${southRegionHeight})`)
            }
          );
          btnClear.update();
        }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // east region
      if (eastSpaceControls.length > 0) {
        eastRegionHeight = principalContainer.height - northRegionHeight - southRegionHeight;
        eastRegionWidth = buttonsConfig.widthEast;

        let container = this.eastSpace.container;
        container.id = "descartesJS_east";
        container.setAttribute("style", `width:${eastRegionWidth}px;height:${eastRegionHeight}px;right:0;top:${northRegionHeight}px;`);

        principalContainer.insertBefore(container, this.loader);

        // configure the controls in the region
        for (let i=0,l=eastSpaceControls.length; i<l; i++) {
          eastSpaceControls[i].expresion = parser.parse(`(0,${buttonsConfig.height*i},${eastRegionWidth},${buttonsConfig.height})`);
          eastSpaceControls[i].init();
        }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // west region
      if (westSpaceControls.length > 0) {
        westRegionHeight = principalContainer.height - northRegionHeight - southRegionHeight;
        westRegionWidth = buttonsConfig.widthWest;

        let container = this.westSpace.container;
        container.id = "descartesJS_west";
        container.setAttribute("style", `width:${westRegionWidth}px;height:${westRegionHeight}px;left:0;top:${northRegionHeight}px;`);

        principalContainer.insertBefore(container, this.loader);

        // configure the controls in the region
        for (let i=0,l=westSpaceControls.length; i<l; i++) {
          westSpaceControls[i].expresion = parser.parse(`(0,${buttonsConfig.height*i},${westRegionWidth},${buttonsConfig.height}`);
          westSpaceControls[i].init();
        }
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // editable and visible region
      if (this.editableRegionVisible) {
        editableRegionHeight = buttonsConfig.height;
        let container = this.editableRegion.container;
        container.id = "descartesJS_editableRegion";
        container.setAttribute("style", `position:absolute;width:${principalContainer.width}px;height:${editableRegionHeight}px;left:0;top:${principalContainer.height - southRegionHeight - buttonsConfig.height}px;`);

        principalContainer.insertBefore(container, this.loader);

        let editableRegionTextFields = this.editableRegion.textFields;
        let textFieldsWidth = (principalContainer.width)/editableRegionTextFields.length;

        let fontSize = descartesJS.getFieldFontSize(editableRegionHeight);
        // configure the text fields in the region
        for (let i=0,l=editableRegionTextFields.length; i<l; i++) {
          if (editableRegionTextFields[i].type == "div") {
            container.appendChild(editableRegionTextFields[i].container);

            ////////////////////////////////////////////////////////////////
            // the container
            editableRegionTextFields[i].container.setAttribute("style", `font-family:${descartesJS.sansserif_font};width:${textFieldsWidth-4}px;height:${editableRegionHeight}px;position:absolute;left:${i*textFieldsWidth}px;top:0;`);

            ////////////////////////////////////////////////////////////////
            // the label
            let label = editableRegionTextFields[i].container.firstChild;

            label.setAttribute("style", `font-family:${descartesJS.sansserif_font};font-size:${fontSize}px;padding-top:0;background-color:#e0e4e8;position:absolute;left:0;top:0;height:${editableRegionHeight}px;text-align:center;line-height:${editableRegionHeight}px;`);
            
            let labelWidth = label.offsetWidth;
            label.style.width = labelWidth + "px";

            // remove the first and last character, because are initially underscores
            label.firstChild.textContent = label.firstChild.textContent.substring(3, label.firstChild.textContent.length-3);

            ////////////////////////////////////////////////////////////////
            // the text field
            let textfield = editableRegionTextFields[i].container.lastChild;
            textfield.setAttribute("style", `font-family:${descartesJS.monospace_font};font-size:${fontSize}px;width:${textFieldsWidth-labelWidth}px;height:${editableRegionHeight}px;position:absolute;left:${labelWidth}px;top:0;border:2px groove white;`);
          }

          else {
            container.appendChild(editableRegionTextFields[i]);

            editableRegionTextFields[i].setAttribute("style", `font-family:${descartesJS.monospace_font};font-size:${fontSize}px;width:${textFieldsWidth}px;height:${editableRegionHeight}px;position:absolute;left:${i*textFieldsWidth}px;top:0;border:2px groove white;`);
          }
        }
      }

      this.displaceRegionNorth = northRegionHeight;
      this.displaceRegionSouth = southRegionHeight + (editableRegionHeight || 0);

      this.displaceRegionEast = eastRegionWidth;
      this.displaceRegionWest = westRegionWidth;

      for (let space_i of this.spaces) {
        space_i.init()
      }
    }

    /**
     * Update the applet
     */
    update() {
      this.updateAuxiliaries();
      this.updateControls();
      this.updateEvents();
      this.updateControls();
      this.updateSpaces();
    }

    /**
     * Change the click to 0
     */
    clearClick() {
      for (let space_i of this.spaces) {
        space_i.clearClick();
      }
    }

    /**
     *
     */
    removeButtonClick() {
      descartesJS.newBlobContent = null;
      for (let control_i of this.controls) {
        control_i.buttonClick = false;
      }
    }

    /**
     * Deactivate the graphic controls
     */
    deactivateControls() {
      if (this.controls) {
        for (let control_i of this.controls) {
          if (control_i.deactivate) {
            control_i.deactivate();
          }
        }
      }
    }

    /**
     * Update the auxiliaries
     */
    updateAuxiliaries() {
      for (let aux_i of this.auxiliaries) {
        aux_i.update();
      }
    }

    /**
     * Update the events
     */
    updateEvents() {
      for (let event_i of this.events) {
        event_i.update();
      }
    }

    /**
     * Update the controls
     */
    updateControls() {
      for (let control_i of this.controls) {
        control_i.update();
      }
    }

    /**
     * Update the spaces
     */
    updateSpaces(first_time) {
      for (let space_i of this.spaces) {
        space_i.update(first_time);
      }
    }

    /**
     * Clear the trace in the space
     */
    clear() {
      for (let space_i of this.spaces) {
        space_i.spaceChange = true;
        if (space_i.drawBackground) {
          space_i.drawBackground();
        }
      }
    }

    /**
     * Play the animation
     */
    play() {
      this.animation.play();
    }

    /**
     * Stop the animation
     */
    stop() {
      this.animation.stop();
    }

    /**
     * Reinit the animation
     */
    reinitAnimation() {
      this.animation.reinit();
    }

    /**
     * Stop the playing audios
     */
    stopAudios() {
      // stop the animation
      this.stop()

      // stop the audios
      for (let propName in this.audios) {
        if ((this.audios).hasOwnProperty(propName)) {
          if (this.audios[propName].pause) {
            this.audios[propName].pause();
            this.audios[propName].currentTime = 0;
          }
        }
      }
    }

    /**
     * Get an image by name
     * @param {String} name the name of the image
     * @return {Image} the image with the name
     */
    getImage(name) {
      if (name) {
        // if ths image do not exist then create a new image
        if (!this.images[name]) {
          this.images[name] = this.getImageAux(name);
        }
        return this.images[name];
      }
      // return an empty image
      return new Image();
    }

    /**
     * Get image auxiliar function
     */
    getImageAux(filename) {
      const img = new Image();
      if (filename.startsWith("http")) {
        img.crossOrigin = "Anonymous";
      }
      img.onload = function() { this.ready = 1; };
      img.onerror = function() { this.errorload = 1; };
      img.src = filename;
      return img;
    }

    /**
     * Get an audio by name
     * @param {String} name the name of the audio
     * @return {Audio} the audio with the name
     */
    getAudio(name) {
      if (name) {
        // if the audio do not exist then create a new audio
        if (!this.audios[name]) {
          this.audios[name] = this.getAudioAux(name);
        }
        return this.audios[name];
      }
      //return an empty audio
      return new Audio();
    }

    /**
     * Get audio auxiliar function
     */
    getAudioAux(filename) {
      let audio = new Audio(filename);
      audio.filename = filename;

      let onCanPlayThrough = function() {
        this.ready = 1;
      }

      let onError = function() {
        if (!this.canPlayType("audio/" + this.filename.substring(this.filename.length-3)) && (this.filename.substring(this.filename.length-3) == "mp3")) {
          audio = new Audio(this.filename.replace("mp3", "ogg"));
          audio.filename = this.filename.replace("mp3", "ogg");
          audio.addEventListener('canplaythrough', onCanPlayThrough);
          audio.addEventListener('load', onCanPlayThrough);
          audio.addEventListener('error', onError);
          audio.load();
        }
        else {
          console.warn(`El archivo ${filename} no puede ser reproducido`);
          this.errorload = 1;
        }
      }
      audio.addEventListener('canplaythrough', onCanPlayThrough);
      audio.addEventListener('load', onCanPlayThrough);
      audio.addEventListener('error', onError);

      if (descartesJS.hasTouchSupport) {
        audio.load();
        audio.play();
        descartesJS.setTimeout( ()=>{
          audio.pause();
        }, 20);
        audio.ready = 1;
      } else {
        audio.load();
      }

      return audio;
    }    

    /**
     * Get a control by a component identifier
     * @param {String} cID the component identifier of the control
     * @return {Control} return a control with a component identifier or a dummy control if not find
     */
    getControlByCId(cID) {
      return this.getControlById(cID, true);
    }

    /**
     * Get a control by identifier
     * @param {String} id the identifier of the control
     * @return {Control} return a control with identifier or a dummy control if not find
     */
    getControlById(id, cID) {
      let param = (cID) ? "cID" : "id";
      for (let control_i of this.controls) {
        if (control_i[param] == id) {
          return control_i;
        }
      }

      return { update: ()=>{}, w: 0, h: 0 };
    }

    /**
     * Get a space by a component identifier
     * @param {String} cId the component identifier of the space
     * @return {Space} return a space with the component identifier or a dummy space if not find
     */
    getSpaceByCId(cID) {
      return this.getSpaceById(cID, true);
    }

    /**
     * Get a space by identifier
     * @param {String} cId the identifier of the space
     * @return {Space} return a space with the identifier or a dummy space if not find
     */
    getSpaceById(id, cID) {
      let param = (cID) ? "cID" : "id";
      for (let space_i of this.spaces) {
        if (space_i[param] == id) {
          return space_i;
        }
      }

      return { update: ()=>{}, w: 0, h: 0 };
    }

    /**
     * Get the parameters in the URL an set the values in the URL object
     * ex. index.html?var1=0&var2=hi, creates URL.var1=0 y URL.var2='hi'
     */
    getURLParameters() {
      let url = this.URL;
      let indexParams = url.indexOf("?");
      let tmpParam;

      if (indexParams != -1) {
        url = decodeURIComponent(url.substring(indexParams+1)).split("&");
        for (let url_i of url) {
          tmpParam = url_i.split("=");
          if (tmpParam.length == 2) {
            // (+tmpParam[1] == +tmpParam[1])
            // +VAR if VAR is a number then +VAR is a number, but if is not a number the +VAR is NaN; NaN==NaN is false
            this.evaluator.setVariable(`URL.${tmpParam[0]}`, (+tmpParam[1] == +tmpParam[1]) ? parseFloat(tmpParam[1]) : tmpParam[1]);
          }
        }
      }
    }

    /**
     *
     */
    cleanCanvasImages() {
      this.container.querySelectorAll("canvas").forEach((canvas) => {
        canvas.width = canvas.height = 1;
        canvas.style.width = canvas.style.height = "1px";
      });

      this.spaces.forEach((space) => {
        if (space.canvas) {
          space.canvas = space.ctx = null;
        }
        if (space.backCanvas) {
          space.backCanvas = space.backCtx = null;
        }
      });

      for (let image_name in this.images) {
        if ( (this.images[image_name].nodeName) && (this.images[image_name].nodeName.toLowerCase() === "canvas") ) {
          delete this.images[image_name];
        }
      }
    }
  }

  /**
   *
   */
  function scaleToFit() {
    descartesJS.cssScale = Math.min(
      window.innerWidth  / this.width, 
      window.innerHeight / this.height
    );

    // set the dimensions of the parent container (usually the body element)
    this.container.parentNode.style.width  = window.innerWidth  + "px";
    this.container.parentNode.style.height = window.innerHeight + "px";
    // It only needs to be done once (lines 312-313)
    // this.container.style.left = this.container.style.top = '50%';
    // this.container.style.transformOrigin = '50% 50%';
    this.container.style.transform = `translate(-50%, -50%) scale(${descartesJS.cssScale})`;
  }


  descartesJS.DescartesApp = DescartesApp;
  return descartesJS;
})(descartesJS || {});
