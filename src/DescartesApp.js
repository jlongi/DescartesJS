/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let tmpVal;
  let scaleToFitX;
  let scaleToFitY;
  let optimalRatio;

  let licenseA = "{\\rtf1\\uc0{\\fonttbl\\f0\\fcharset0 Arial;}{\\f0\\fs34 __________________________________________________________________________________\\par \\fs22                                        Los contenidos de esta unidad didáctica interactiva están bajo una licencia {\\*\\hyperlink Creative Commons|https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es}, si no se indica lo contrario.\\par                                        La unidad didáctica fue creada con Descartes, que es un producto de código abierto, {\\*\\hyperlink Créditos|https://arquimedes.matem.unam.mx/Descartes5/creditos/conCCL.html}\\par }";

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

      /**
       * applet code
       * @type {<applet>}
       * @private
       */
      this.applet = applet;

      /**
       * container of the java applet
       * @type {<HTMLelement>}
       * @private
       */
      this.parentC = applet.parentNode;

      /**
       * width of the applet
       * @type {Number}
       * @private
       */
      this.width = parseFloat( applet.getAttribute("width") );

      /**
       * height of the applet
       * @type {Number}
       * @private
       */
      this.height = parseFloat( applet.getAttribute("height") );

      /**
       * decimal symbol
       * @type {String}
       * @private
       */
      this.decimal_symbol = ".";
      this.decimal_symbol_regexp = new RegExp("\\.", "g");

      /**
       * language of the lesson
       * type {String}
       * @private
       */
      this.language = "español";

      /**
       * parameters of the applet
       * type {Array.<param>}
       * @private
       */
      this.children = applet.getElementsByTagName("param");

      // set the license attribute
      descartesJS.ccLicense = true;
      for (let children_i of this.children) {
        if (children_i.name === "CreativeCommonsLicense") {
          descartesJS.ccLicense = (children_i.value !== "no");
        }
      }

      /**
       * string that determines what kind of descartes lesson is
       * @type {String}
       * @private
       */
      this.code = applet.getAttribute("code");

      /**
       *
       */
      this.saveState = [];

      /**
       * images used in the applet
       * type {Array.<Image>}
       * @private
       */
      this.images = { length: -1 };

      /**
       * audios used in the applet
       * type {Array.<Audio>}
       * @private
       */
      this.audios = { length: -1 };

      /**
       * variable to record if the applet is interpreted for the first time, used to show the loader screen
       * type {Boolean}
       * @private
       */
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

      /**
       * variable that tell whether the lesson is an Arquimedes lesson
       * type {Boolean}
       * @private
       */
      this.arquimedes = (/DescartesWeb2_0|Arquimedes|Discurso/i).test(this.code);

      // Arquimedes license
      this.licenseA = (descartesJS.ccLicense) ? licenseA : "";

      let children = this.children;
      let children_i;
      let heightRTF = 0;
      let heightButtons = 0;
      let licenseHeight = (descartesJS.ccLicense) ? 90 : 0;

      for (children_i of children) {
        // get the rtf height
        if (children_i.name == "rtf_height") {
          heightRTF = (parseInt(children_i.value) + 120) || this.height;
          continue;
        }

        // get the buttons height
        if (babel[children_i.name] == "Buttons") {
          this.buttonsConfig = this.lessonParser.parseButtonsConfig(children_i.value);
          heightButtons = this.buttonsConfig.height;
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

      // configure an Arquimedes lesson
      if (this.arquimedes) {
        this.ratio = 1;
        // modify the lesson height if has rtf height parameter
        if (heightRTF) {
          this.height =  heightRTF + heightButtons + licenseHeight; // 70 is the height of the license image
        }
      }

      /**
       * external region
       * type {Space}
       * @private
       */
      if (this.externalSpace) {
        document.body.removeChild(this.externalSpace.container);
      }
      this.externalSpace = new descartesJS.SpaceExternal(this);

      /**
       * north region
       * type {Space}
       * @private
       */
      this.northSpace = {container: descartesJS.newHTML("div"), controls: []};

      /**
       * south region
       * type {Space}
       * @private
       */
      this.southSpace = {container: descartesJS.newHTML("div"), controls: []};

      /**
       * east region
       * type {Space}
       * @private
       */
      this.eastSpace = {container: descartesJS.newHTML("div"), controls: []};

      /**
       * west region
       * type {Space}
       * @private
       */
      this.westSpace = {container: descartesJS.newHTML("div"), controls: []};

      /**
       * region to show text fields for editable content
       * type {Space}
       * @private
       */
      this.editableRegion = {container: descartesJS.newHTML("div"), textFields: []};

      /**
       * array to store the lesson controls
       * type {Array.<Control>}
       * @private
       */
      this.controls = [];

      /**
       * array to store the lesson auxiliaries
       * type {Array.<Auxiliary>}
       * @private
       */
      this.auxiliaries = [];

      /**
       * array to store the lesson events
       * type {Array.<Event>}
       * @private
       */
      this.events = [];

      /**
       * the z index for order the graphics
       * @type {Number}
       * @private
       */
      this.zIndex = 0;

      /**
       * tabulation index for the text fields
       * @type {Number}
       * @private
       */
      this.tabindex = 0;

      /**
       * pleca height
       * @type {Number}
       * @private
       */
      this.plecaHeight = 0;

      /**
       * number of iframes in the lesson
       * @type {Number}
       * @private
       */
      this.nIframes = 0;

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

      // append the lesson container to the java applet container
      this.parentC.insertBefore(this.container, this.parentC.firstChild);
      this.container.width = this.loader.width = this.width;
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
        
        this.container.parentNode.removeAttribute("align");
        this.container.parentNode.style.overflow = "hidden";
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
            for (let space_i of this.spaces) {
              space_i.initSpace();
              space_i.init();
              space_i.update(true);
            }
          }
        };
        this.scaleToFit();
      }

      /**
       * array to store the lesson spaces
       * type {Array.<Space>}
       * @private
       */
      this.spaces = [];

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

      let children = this.children;
      let children_i;
      let lessonParser = this.lessonParser;

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
          this.language = children_i.value;
          continue;
        }

        // find the parameters for the pleca
        if (children_i.name == "pleca") {
          let divPleca = lessonParser.parsePleca(children_i.value, this.width);
          this.container.insertBefore(divPleca, this.loader);
          this.plecaHeight = (divPleca.imageHeight) ? divPleca.imageHeight : divPleca.offsetHeight;
          continue;
        }

        // find the parameters for the exterior space
        if (babel[children_i.name] == "Buttons") {
          this.buttonsConfig = lessonParser.parseButtonsConfig(children_i.value);
          continue;
        }

        // find the decimal symbol
        if (babel[children_i.name] == "decimal_symbol") {
          this.decimal_symbol = children_i.value;
          this.decimal_symbol_regexp = new RegExp("\\" + this.decimal_symbol, "g");
          continue;
        }

        // find the descartes version
        if (babel[children_i.name] == "version") {
          this.version = parseInt(children_i.value);
          continue;
        }

        // find the language of the lesson
        if (babel[children_i.name] == "language") {
          this.language = children_i.value;
          continue;
        }

        // ##ARQUIMEDES## //
        // find the rtf text of an Arquimedes lesson
        if (children_i.name == "rtf") {
          const posX = (this.width-780)/2;
          const posY = (parseInt(this.height) -this.plecaHeight -this.buttonsConfig.height -45);
          tmpGraphics.push(
            `space='descartesJS_stage' type='text' abs_coord='yes' expresion='[10,20]' background='yes' text='${children_i.value.replace(/'/g, "&squot;")}'`,
            `space='descartesJS_stage' type='text' abs_coord='yes' expresion='[${posX},${posY-25}]' background='yes' text='${this.licenseA}'`
          );
          if (descartesJS.ccLicense) {
            tmpGraphics.push(`space='descartesJS_stage' type='image' expresion='[${posX+15},${posY}]' background='yes' abs_coord='yes' file='lib/DescartesCCLicense.png'`);
          }
          continue;
        }
        // ##ARQUIMEDES## //

        // if the name of the children start with "E" then is a space
        if (children_i.name.startsWith("E_")) {
          if (children_i.value.match(/'HTMLIFrame'/)) {
            this.nIframes++;
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
          if (children_i.value.match(/type='fill'|tipo='relleno'|tipus='ple'|mota='betea'|type='plein'|tipo='recheo'|tipo='curva_piena'|tipo='preencher'|tipus='ple'/)) {
            this.ratio = 1;
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

      // ##ARQUIMEDES## //
      // if arquimedes then add the container of the scenario region
      if (this.arquimedes) {
        // the scenario region is only visible in arquimedes lessons
        this.stage = {container: descartesJS.newHTML("div", {id : "descartesJS_Stage"}), scroll: 0};
        // if descartesJS.TextController exist then make transparent the color of the canvas, because the selection canvas is white
        this.stage.stageSpace = this.lessonParser.parseSpace(`tipo='R2' id='descartesJS_stage' fondo='${(descartesJS.TextController) ? "ffffffff" : "blanco"}' x='0' y='0' fijo='yes' red='no' red10='no' ejes='no' text='no' ancho='${this.width}' alto='${this.height}'`);
        this.stage.container.appendChild(this.stage.stageSpace.container);
        this.container.appendChild(this.stage.container);
        this.spaces.push(this.stage.stageSpace);
      }
      // ##ARQUIMEDES## //

      // init the spaces
      let tmpSpace;
      for (let i=0,l=tmpSpaces.length; i<l; i++) {
        tmpSpace = lessonParser.parseSpace(tmpSpaces[i]);

        // ##ARQUIMEDES## //
        if (this.arquimedes) {
          this.stage.container.appendChild(tmpSpace.container);
        }
        // ##ARQUIMEDES## //

        // create and add a space to the list of spaces
        this.spaces.push(tmpSpace);

        // increase the z index for the next space is placed on the above space
        this.zIndex++;
      }

      // init the graphics
      let tmpGraph;
      for (let i=0,l=tmpGraphics.length; i<l; i++) {
        descartesJS.DEBUG.elemIndex = i;
        tmpGraph = lessonParser.parseGraphic(tmpGraphics[i]);
        if (tmpGraph) {
          this.editableRegionVisible = this.editableRegionVisible || (tmpGraph.visible);
          tmpGraph.space.addGraph(tmpGraph);
        }
      }

      // init the tridimensional graphics
      for (let i=0,l=tmp3DGraphics.length; i<l; i++) {
        tmpGraph = lessonParser.parse3DGraphic(tmp3DGraphics[i]);
        if (tmpGraph) {
          tmpGraph.space.addGraph(tmpGraph, true);
        }
      }

      // init the controls
      for (let i=0,l=tmpControls.length; i<l; i++) {
        this.controls.push( lessonParser.parseControl(tmpControls[i]) );
      }

      // init the auxiliary
      for (let i=0,l=tmpAuxiliaries.length; i<l; i++) {
        lessonParser.parseAuxiliar(tmpAuxiliaries[i]);
      }

      // init the animation
      for (let i=0,l=tmpAnimations.length; i<l; i++) {
        this.animation = lessonParser.parseAnimation(tmpAnimations[i]);
      }

      // configure the regions
      this.configRegions();

      this.updateAuxiliaries();
      // beware
      this.updateAuxiliaries();
      // beware

      for (let i=0,l=this.controls.length; i<l; i++) {
        this.controls[i].init();
      }
      this.updateControls();

      this.updateSpaces(true);

      // finish the interpretation
      const self = this;
      descartesJS.setTimeout(() => { self.finishInit(); }, 200*self.nIframes);
    }

    /**
     * Finish the interpretation
     */
    finishInit() {
      this.evaluator.setVariable("decimalSymbol", this.decimal_symbol);
      this.update();

      // hide the loader
      this.loader.style.display = "none";

      // if the window parent is different from the current window, then is embedded in an iFrame
      if (window.parent !== window) {
        this.parentC.style.margin = this.parentC.style.padding = "0px";

        // iOS fix to the scroll in iframes
        // if the scene is in an iframe and expands to the container then prevent the scroll in the document
        if (this.expand == "fit") {
          window.addEventListener("touchmove", evt => { evt.preventDefault(); evt.stopPropagation(); });
        }

        window.parent.postMessage({ type: "reportSize", href: window.location.href, width: this.width, height: this.height }, '*');
        window.parent.postMessage({ type: "ready", value: window.location.href }, '*');

        descartesJS.onResize();
      }

      // scene open in a new window
      if (window.opener) {
        window.opener.postMessage({ type: "isResizeNeeded", href: window.location.href }, '*');
      }

      this.externalSpace.init();

      // trigger descartesReady event
      try {
        let evt = new CustomEvent("descartesReady", { "detail":this });
        // send the event
        window.dispatchEvent(evt);
      }
      catch(e) {
        console.warn("CustomEvents not supported in this browser");
      }

      const self = this;
      /** */
      this.evaluator.setFunction("openKB", function(layoutType, kb_x, kb_y, var_id, tf_x, tf_y, tf_w, tf_h, tf_fs, tf_val, tf_onlyText) {
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

      this.readyApp = true;
    }

    /**
     * Adjust the size of the window if needed
     */
    adjustSize() {
      document.body.style.margin = document.body.style.padding = this.parentC.style.margin = this.parentC.style.padding = "0px";
      const winWidth = parseInt(this.width)+30;
      const winHeight = parseInt(this.height)+90;
      window.moveTo((parseInt(screen.width)-winWidth)/2, (parseInt(screen.height)-winHeight)/2);
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

      // descartes 4
      let fontSizeDefaultButtons = "15";
      let aboutWidth = 100;
      let configWidth = 100;
      let initWidth = 100;
      let clearWidth = 100;

      // descartes 2
      if (this.version === 2) {
        fontSizeDefaultButtons = "14";
        aboutWidth = 63;
        configWidth = 50;
        initWidth = 44;
        clearWidth = 53;
      }

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
              font_size: parser.parse(fontSizeDefaultButtons),
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
              font_size: parser.parse(fontSizeDefaultButtons),
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
              font_size: parser.parse(fontSizeDefaultButtons),
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
              font_size: parser.parse(fontSizeDefaultButtons),
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
        space_i.clearClick()
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
        // if the image exist return that image
        if (this.images[name]) {
          return this.images[name];
        }
        // if do not exist then create a new image
        else {
          // if (name.match(/[\w\.\-//]*(\.png|\.jpg|\.gif|\.svg|\.webp)/gi)) {
            let images = this.images;
            images[name] = new Image();
            images[name].addEventListener('load', function() { this.ready = 1; });
            images[name].addEventListener('error', function() { this.ready = 0; this.errorload = 1; });
            images[name].src = name;
            return images[name];
          // }
          // else {

          // }
        }
      }

      return new Image();
    }

    /**
     * Get an audio by name
     * @param {String} name the name of the audio
     * @return {Audio} the audio with the name
     */
    getAudio(name) {
      let audios = this.audios;
      if (name) {
        // if the audio exist return that audio
        if (audios[name]) {
          return audios[name];
        }
        // if do not exist then create a new audio
        else {
          let lastIndexOfDot = name.lastIndexOf(".");
          lastIndexOfDot = (lastIndexOfDot === -1) ? name.length : lastIndexOfDot;
          audios[name] = new Audio(name);

          let onCanPlayThrough = function(evt) {
            this.ready = 1;
          }
          audios[name].addEventListener('canplaythrough', onCanPlayThrough);

          let onError = function(evt) {
            if (!this.canPlayType("audio/" + name.substring(name.length-3)) && (name.substring(name.length-3) == "mp3")) {
              audios[name] = new Audio(name.replace("mp3", "ogg"));
              audios[name].addEventListener('canplaythrough', onCanPlayThrough);
              audios[name].addEventListener('load', onCanPlayThrough);
              audios[name].addEventListener('error', onError);
              audios[name].load();
            } else {
              console.warn("El archivo '" + name + "' no puede ser reproducido");
              this.errorload = 1;
            }
          }
          audios[name].addEventListener('error', onError);

          audios[name].play();
          descartesJS.setTimeout( function(){ audios[name].pause(); }, 15);

          return audios[name];
        }
      }

      return new Audio();
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
      let url = window.location.href;
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
     * Get the state of the applet
     * @return {String} return a string with the variables, vectors and matrices separate with commas
     */
    getState() {
      let theValues;
      let state = "";
      let theVariables = this.evaluator.variables;
      let theVectors = this.evaluator.vectors;
      let theMatrices = this.evaluator.matrices;

      // check all the variables
      for (let varName in theVariables) {
        if (theVariables.hasOwnProperty(varName)) {
          theValues = theVariables[varName];

          // if the value is a string, we must ensure that it does not lose the single quotes
          if (typeof(theValues) == "string") {
            theValues = "'" + theValues + "'";
          }

          // if the name of the variable is the name of an internal variable or is an object, then ignore it
          if ( (theValues != undefined) && (varName != "rnd") && (varName != "π") && (varName != "pi") && (varName != "e") && (varName != "Infinity") && (varName != "-Infinity") && (typeof(theValues) != "object") ) {
            state = (state != "") ? (state + "\n" + varName + "=" + theValues) : (varName + "=" + theValues);
          }
        }
      }

      // check all the vectors
      for (let vecName in theVectors) {
        if (theVectors.hasOwnProperty(vecName)) {
          state += "\n" + vecName + "=" + arrayToString(theVectors[vecName]);
        }
      }

      // check all the matrices
      for (let matName in theMatrices) {
        if (theMatrices.hasOwnProperty(matName)) {
          state += "\n" + matName + "=" + arrayToString(theMatrices[matName]);
        }
      }

      // return the values in the form variable1=value1\nvariable2=value2\n...\nvariableN=valueN
      return state;
    }

    /**
     * Set the state of the applet
     * @param {String} state string containing the values to set of the form  variable1=value1\nvariable2=value2\n...\nvariableN=valueN
     */
    setState(state, noUpdate) {
      let theState = state.split("\n");

      let tmpParse;
      let value;

      for (let i=0, l=theState.length; i<l; i++) {
        tmpParse = theState[i].split("=");

        // the text is of the type variable=value
        if (tmpParse.length >= 2) {
          value = eval(tmpParse[1]);

          // the value of a matrix
          if (tmpParse[1].indexOf("[[") != -1) {
            this.evaluator.matrices[tmpParse[0]] = value;
            this.evaluator.matrices[tmpParse[0]].rows = value.length;
            this.evaluator.matrices[tmpParse[0]].cols = value[0].length;
          }
          // the value of a vector
          else if (tmpParse[1].indexOf("[") != -1) {
            this.evaluator.vectors[tmpParse[0]] = value;
            this.evaluator.variables[tmpParse[0] + ".long"] = value.length;
          }
          // the vale of a variable
          else {
            this.evaluator.variables[tmpParse[0]] = value;
          }
        }
      }

      if (!noUpdate) {
        // update the lesson
        this.update();
      }
    }

    /**
     * Get the evaluation of the lesson
     * @return {String} return a string of the form: questions=something \n correct=something \n wrong=something \n control1=respuestaAlumno|0 o 1 \n control2=respuestaAlumno|0 o 1
     */
    getEvaluation() {
      let questions = correct = 0;
      let answers = "";

      for (let i=0, l=this.controls.length; i<l; i++) {
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
     * Store que values in the text fields in the moment of the execution and show the first element in the answer pattern
     */
    showSolution() {
      let controls = this.controls;
      for (let i=0, l=controls.length; i<l; i++) {
        if ( (controls[i].gui == "textfield") && (controls[i].evaluate) ) {
          controls[i].changeValue( controls[i].getFirstAnswer() );
        }
      }

      this.update();
    }

    /**
     * Store the values in the text fields in the moment of the execution and show the answer of the student
     */
    showAnswer() {
      for (let i=0, l=this.saveState.length; i<l; i++){
        this.evaluator.eval( this.saveState[i] );
      }

      this.update();
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
   * Get a string representation of an array
   * @param {Array} array the array to get the string representation
   * @return {String} return a string representing the array
   */
  function arrayToString(array) {
    let result = "[";

    for (let i=0, l=array.length; i<l; i++) {
      // nested array
      if (Array.isArray(array[i])) {
        result += arrayToString(array[i]);
      }
      // value
      else {
        tmpVal = array[i] || 0;

        if (typeof(tmpVal) == "string") {
          tmpVal = "'" + tmpVal + "'";
        }

        result += tmpVal;
      }

      // add commas to the string
      if (i < l-1) {
        result += ",";
      }
    }

    return result + "]"
  }

  /**
   *
   */
  function scaleToFit() {
    scaleToFitX = window.innerWidth/this.width;
    scaleToFitY = window.innerHeight/this.height;

    descartesJS.cssScale = optimalRatio = Math.min(scaleToFitX, scaleToFitY);

    this.container.style.transformOrigin = "0 0";

    // set the dimensions of the parent container (usually the body element)
    this.container.parentNode.style.width  = window.innerWidth  + "px";
    this.container.parentNode.style.height = window.innerHeight + "px";

    if (scaleToFitX < scaleToFitY) {
      this.container.style.left = "0";
      this.container.style.top = "50%";
      this.container.style.transform = `translate3d(0px,0px,0px) scale(${optimalRatio}) translate(0,-50%)`;
    }
    else {
      this.container.style.left = "50%";
      this.container.style.top = "0";
      this.container.style.transform = `translate3d(0px,0px,0px) scale(${optimalRatio}) translate(-50%,0)`;
    }
  }


  descartesJS.DescartesApp = DescartesApp;
  return descartesJS;
})(descartesJS || {});
