/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var tmpVal;
  var scaleToFitX;
  var scaleToFitY;
  var optimalRatio;
  
  var licenseA = "{\\rtf1\\uc0{\\fonttbl\\f0\\fcharset0 Arial;}{\\f0\\fs34 __________________________________________________________________________________\\par \\fs22                                        Los contenidos de esta unidad didáctica interactiva están bajo una licencia {\\*\\hyperlink Creative Commons|https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es}, si no se indica lo contrario.\\par                                        La unidad didáctica fue creada con Descartes, que es un producto de código abierto, {\\*\\hyperlink Creditos|http://arquimedes.matem.unam.mx/Descartes5/creditos/conCCL.html}\\par }";

  /**
   * Descartes application interpreted with JavaScript
   * @constructor
   * @param {<applet>} applet the applet to interpret
   */
  descartesJS.DescartesApp = function(applet) {
    this.animation = { playing:false, play:function(){}, stop:function(){},  reinit:function(){} };

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
    for (var i=0,l=this.children.length; i<l; i++) {
      if (this.children[i].name === "CreativeCommonsLicense") {
        descartesJS.ccLicense = !(this.children[i].value === "no");
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

    // function to prevent undefined error
    this.scaleToFit = function() {};

    /**
     * evaluator and parser of expressions
     * type {Evaluator}
     * @private
     */
    this.evaluator = new descartesJS.Evaluator(this);

    // get the url parameter if any
    this.getURLParameters();

    /**
     * parser of elements in the lesson
     * @type {LessonParser}
     * @private
     */
    this.lessonParser = new descartesJS.LessonParser(this);

    // init the interpretation
    this.init()
  }

  /**
   * Init the variables needed for parsing and create the descartes scene
   */
  descartesJS.DescartesApp.prototype.init = function() {
    // stop the animation, if the action init executes maybe the animation is playing
    this.stop();

    /**
     * variable that tell whether the lesson is an arquimedes lesson
     * type {Boolean}
     * @private
     */
    this.arquimedes = (/DescartesWeb2_0|Arquimedes|Discurso/i).test(this.code);

    // arquimedes license 
    this.licenseA = (descartesJS.ccLicense) ? licenseA : "";

    var children = this.children;
    var children_i;
    var heightRTF = 0;
    var heightButtons = 0;
    var licenceHeight = (descartesJS.ccLicense) ? 90 : 0;

    for (var i=0, l=children.length; i<l; i++) {
      children_i = children[i];

      // get the rtf height
      if (children_i.name == "rtf_height") {
        heightRTF = (parseInt(children_i.value) + 120) || this.height;
      }

      // get the buttons height
      if (babel[children_i.name] == "Buttons") {
        this.buttonsConfig = this.lessonParser.parseButtonsConfig(children_i.value);
        heightButtons = this.buttonsConfig.height;
      }

      // get image source for the loader
      if (children_i.name == "image_loader") {
        this.imgLoader = children_i.value;
      }

      // get the cover of the scene
      if (children_i.name == "expand") {
        this.expand = children_i.value;
      }

      // set the docBase for the elements in the resources
      if (children_i.name == "docBase") {
        this.docBase = children_i.value;
        var base = document.createElement("base");
        base.id = "descartesJS_base";
        base.setAttribute("href", this.docBase);
        document.head.appendChild(base);
      }
    }

    // cover space
    if (this.expand == "cover") {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }

    // configure an arquimedes lesson
    if (this.arquimedes) {
      this.ratio = 1;
      // modify the lesson height if has rtf height parameter
      if (heightRTF) {
        this.height =  heightRTF + heightButtons + licenceHeight; // 70 is the height of the licence image
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
    this.northSpace = {container: document.createElement("div"), controls: []};

    /**
     * south region
     * type {Space}
     * @private
     */
    this.southSpace = {container: document.createElement("div"), controls: []};

    /**
     * east region
     * type {Space}
     * @private
     */
    this.eastSpace = {container: document.createElement("div"), controls: []};

    /**
     * west region
     * type {Space}
     * @private
     */
    this.westSpace = {container: document.createElement("div"), controls: []};

    /**
     * region to show text fields for editable content
     * type {Space}
     * @private
     */
    this.editableRegion = {container: document.createElement("div"), textFields: []};

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

    this.container = document.createElement("div");
    this.loader = document.createElement("div");

    // append the lesson container to the java applet container
    this.parentC.insertBefore(this.container, this.parentC.firstChild);
    this.container.width = this.loader.width = this.width;
    this.container.height = this.loader.height = this.height;
    this.container.className = "DescartesAppContainer";
    this.container.setAttribute("style", "width:" + this.width + "px;height:" + this.height + "px;");

    // add the loader
    this.container.appendChild(this.loader);
    this.loader.className = "DescartesLoader";

    //
    // fit space
    if (this.expand == "fit") {
      this.container.parentNode.removeAttribute("align");
      this.container.parentNode.style.overflow = "hidden";
      this.container.parentNode.style.width = "100vw";
      this.container.parentNode.style.height = "100vh";
      this.scaleToFit = scaleToFit;
      this.scaleToFit();
    }
    //

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
  descartesJS.DescartesApp.prototype.initBuildApp = function() {
    descartesJS.showConfig = true;

    var children = this.children;
    var children_i;
    var lessonParser = this.lessonParser;

    var tmpSpaces = [];
    var tmpControls = [];
    var tmpAuxiliaries = [];
    var tmpGraphics = [];
    var tmp3DGraphics = [];
    var tmpAnimations = [];

    // check all the children
    for(var i=0, l=children.length; i<l; i++) {
      children_i = children[i];

      // find if the scene is editable
      if (babel[children_i.name] == "editable") {
        descartesJS.showConfig = (babel[children_i.value] == 'false') ? false : true;
        continue;
      }

      // find the language of the lesson
      if (babel[children_i.name] == "language") {
        this.language = children_i.value;
        continue;
      }

      // find the parameters for the pleca
      if (children_i.name == "pleca") {
        var divPleca = lessonParser.parsePleca(children_i.value, this.width);
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
      // find the rtf text of an arquimedes lesson
      if (children_i.name == "rtf") {
        var posX = (this.width-780)/2;
        var posY = (parseInt(this.height) -this.plecaHeight -this.buttonsConfig.height -45);

        tmpGraphics.push("space='descartesJS_stage' type='text' abs_coord='yes' expresion='[10,20]' background='yes' text='" + children_i.value.replace(/'/g, "&squot;") + "'");
        tmpGraphics.push("space='descartesJS_stage' type='text' abs_coord='yes' expresion='[" + posX + "," + (posY-25) + "]' background='yes' text='" + this.licenseA + "'");
        if (descartesJS.ccLicense) {
          tmpGraphics.push("space='descartesJS_stage' type='image' expresion='[" + (posX+15) + "," + posY + "]' background='yes' abs_coord='yes' file='lib/DescartesCCLicense.png'");
        }

        continue;
      }
      // ##ARQUIMEDES## //

      // if the name of the children start with "E" then is a space
      if (children_i.name.charAt(0) == "E") {
        if (children_i.value.match(/'HTMLIFrame'/)) {
          this.nIframes++;
        }

        tmpSpaces.push(children_i.value);
        continue;
      }

      // if the name of the children start with "C_" then is a control
      if ((/^C_/).test(children_i.name)) {
        tmpControls.push(children_i.value);
        continue;
      }

      // if the name of the children start with "A_" then is an auxiliary
      if ((/^A_/).test(children_i.name)) {
        tmpAuxiliaries.push(children_i.value);
        continue;
      }

      // if the name of the children start with "G" then is a graphic
      if ((/^G_/).test(children_i.name)) {
        // prevent the use of a retina canvas
        if (children_i.value.match(/type='fill'|tipo='relleno'|tipus='ple'|mota='betea'|type='plein'|tipo='recheo'|tipo='curva_piena'|tipo='preencher'|tipus='ple'/)) {
          this.ratio = 1;
        }
        tmpGraphics.push(children_i.value);
        continue;
      }

      // if the name of the children start with "S" then is a tridimensional graphic
      if ((/^S_/).test(children_i.name)) {
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
      this.stage = {container: document.createElement("div"), scroll: 0};
      this.stage.container.id = "descartesJS_Stage";

      // if descartesJS.TextController exist then make transparent the color of the canvas, because the selection canvas is white
      this.stage.stageSpace = this.lessonParser.parseSpace("tipo='R2' id='descartesJS_stage' fondo='" + ((descartesJS.TextController) ? "ffffffff" : "blanco") +"' x='0' y='0' fijo='yes' red='no' red10='no' ejes='no' text='no' ancho='" + this.width + "' alto='" + this.height + "'");
      this.stage.container.appendChild(this.stage.stageSpace.container);

      this.container.appendChild(this.stage.container);
      this.spaces.push(this.stage.stageSpace);
    }
    // ##ARQUIMEDES## //

    // init the spaces
    var tmpSpace;
    for (var i=0, l=tmpSpaces.length; i<l; i++) {
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
    var tmpGraph;
    for (var i=0, l=tmpGraphics.length; i<l; i++) {
      descartesJS.DEBUG.elemIndex = i;
      tmpGraph = lessonParser.parseGraphic(tmpGraphics[i]);
      if (tmpGraph) {
        this.editableRegionVisible = this.editableRegionVisible || (tmpGraph.visible);
        tmpGraph.space.addGraph(tmpGraph);
      }
    }

    // init the tridimensional graphics
    for (var i=0, l=tmp3DGraphics.length; i<l; i++) {
      tmpGraph = lessonParser.parse3DGraphic(tmp3DGraphics[i]);
      if (tmpGraph) {
        tmpGraph.space.addGraph(tmpGraph, true);
      }
    }

    // init the controls
    for (var i=0, l=tmpControls.length; i<l; i++) {
      this.controls.push( lessonParser.parseControl(tmpControls[i]) );
    }

    // init the auxiliary
    for (var i=0, l=tmpAuxiliaries.length; i<l; i++) {
      lessonParser.parseAuxiliar(tmpAuxiliaries[i]);
    }

    // init the animation
    for (var i=0, l=tmpAnimations.length; i<l; i++) {
      this.animation = lessonParser.parseAnimation(tmpAnimations[i]);
    }

    // configure the regions
    this.configRegions();

    this.updateAuxiliaries();
    // beware
    this.updateAuxiliaries();
    // beware

    for (var i=0, l=this.controls.length; i<l; i++) {
      this.controls[i].init();
    }
    this.updateControls();

    this.updateSpaces(true);

    // finish the interpretation
    var self = this;
    if (this.nIframes) {
      descartesJS.setTimeout(function() { self.finishInit(); }, 200*this.nIframes);
    }
    else {
      this.finishInit();
    }
  }

  /**
   * Finish the interpretation
   */
  descartesJS.DescartesApp.prototype.finishInit = function() {
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
    var evt;
    try {
      evt = new CustomEvent("descartesReady", { "detail":this });
      // send the event
      window.dispatchEvent(evt);
    }
    catch(e) {
      console.warn("CustomEvents not supported in this browser");
    }

    this.readyApp = true;
  }

  /**
   * Adjust the size of the window if needed
   */
  descartesJS.DescartesApp.prototype.adjustSize = function() {
    document.body.style.margin = document.body.style.padding = this.parentC.style.margin = this.parentC.style.padding = "0px";
    var winWidth = parseInt(this.width)+30;
    var winHeight = parseInt(this.height)+90;

    window.moveTo((parseInt(screen.width)-winWidth)/2, (parseInt(screen.height)-winHeight)/2);
    window.resizeTo(winWidth, winHeight);

    descartesJS.onResize();
  }

  /**
   * Configure the regions
   */
  descartesJS.DescartesApp.prototype.configRegions = function() {
    var parser = this.evaluator.parser;
    var buttonsConfig = this.buttonsConfig || {};
    var principalContainer = this.container;

    // descartes 4
    var fontSizeDefaultButtons = "15";
    var aboutWidth = configWidth = initWidth = clearWidth = 100;

    // descartes 2
    if (this.version == 2) {
      fontSizeDefaultButtons = "14";
      aboutWidth = 63;
      configWidth = 50;
      initWidth = 44;
      clearWidth = 53;
    }

    var northRegionHeight = southRegionHeight = eastRegionHeight = westRegionHeight = editableRegionHeight = northRegionWidth = southRegionWidth = eastRegionWidth = westRegionWidth = 0;

    var northSpaceControls = this.northSpace.controls;
    var southSpaceControls = this.southSpace.controls;
    var eastSpaceControls = this.eastSpace.controls;
    var westSpaceControls = this.westSpace.controls;

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

      var container = this.northSpace.container;
      container.id = "descartesJS_north";
      container.setAttribute("style", "width:" + principalContainer.width + "px;height:" + northRegionHeight + "px;left:0;top:" + this.plecaHeight + "px;");

      principalContainer.insertBefore(container, this.loader);

      northRegionWidth = principalContainer.width;
      var displaceButton = 0;

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

      var numberOfControlsPerRow = Math.ceil(northSpaceControls.length / buttonsConfig.rowsNorth);
      var controlWidth = northRegionWidth/numberOfControlsPerRow;

      // configure the controls in the region
      for (var i=0, l=northSpaceControls.length; i<l; i++) {
        northSpaceControls[i].expresion = parser.parse("(" + (displaceButton +controlWidth*(i%numberOfControlsPerRow)) +"," + (buttonsConfig.height*Math.floor(i/numberOfControlsPerRow)) + "," + controlWidth + "," + buttonsConfig.height +")");
        northSpaceControls[i].drawif = parser.parse("1");
        northSpaceControls[i].init();
      }

      // create the credits button
      if (buttonsConfig.about) {
        var btnAbout = new descartesJS.Button(this, {region: "north",
                                                     name: (this.language == "english") ? "about" : "créditos",
                                                     font_size: parser.parse(fontSizeDefaultButtons),
                                                     expresion: parser.parse("(0, 0, " + aboutWidth + ", " + northRegionHeight + ")")
                                                    });
        btnAbout.actionExec = { execute: descartesJS.showAbout };
        btnAbout.update();
      }
      // create the configuration button
      if (buttonsConfig.config) {
        var btnConfig = new descartesJS.Button(this, {region: "north",
                                                      name: "config",
                                                      font_size: parser.parse(fontSizeDefaultButtons),
                                                      action: "config",
                                                      expresion: parser.parse("(" + (northRegionWidth + aboutWidth)  + ", 0, " + configWidth + ", " + northRegionHeight + ")")
                                                     });
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
      var displaceButton = 0;
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

      var container = this.southSpace.container;
      container.id = "descartesJS_south";
      container.setAttribute("style", "width:" + principalContainer.width + "px;height:" + southRegionHeight + "px;left:0;bottom:0;");

      principalContainer.insertBefore(container, this.loader);

      var numberOfControlsPerRow = Math.ceil(southSpaceControls.length / buttonsConfig.rowsSouth);
      var controlWidth = southRegionWidth/numberOfControlsPerRow;

      // configure the controls in the region
      for (var i=0, l=southSpaceControls.length; i<l; i++) {
        southSpaceControls[i].expresion = parser.parse("(" + (displaceButton + controlWidth*(i%numberOfControlsPerRow)) +"," + (buttonsConfig.height*Math.floor(i/numberOfControlsPerRow)) + "," + controlWidth + "," + buttonsConfig.height +")");
        southSpaceControls[i].drawif = parser.parse("1");
        southSpaceControls[i].init();
      }

      // create the init button
      if (buttonsConfig.init) {
        var btnInit = new descartesJS.Button(this, {region: "south",
                                                    name: (this.language == "english") ? "init" : "inicio",
                                                    font_size: parser.parse(fontSizeDefaultButtons),
                                                    action: "init",
                                                    expresion: parser.parse("(0, 0, " + initWidth + ", " + southRegionHeight + ")")
                                                  });
        btnInit.update();
      }
      // create the clear button
      if (buttonsConfig.clear) {
        var btnClear = new descartesJS.Button(this, {region: "south",
                                                     name: (this.language == "english") ? "clear" : "limpiar",
                                                     font_size: parser.parse(fontSizeDefaultButtons),
                                                     action: "clear",
                                                     expresion: parser.parse("(" + (southRegionWidth + initWidth) + ", 0, " + clearWidth + ", " + southRegionHeight + ")")
                                                     });
        btnClear.update();
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // east region
    if (eastSpaceControls.length > 0) {
      eastRegionHeight = principalContainer.height - northRegionHeight - southRegionHeight;
      eastRegionWidth = buttonsConfig.widthEast;

      var container = this.eastSpace.container;
      container.id = "descartesJS_east";
      container.setAttribute("style", "width:" + eastRegionWidth + "px;height:" + eastRegionHeight + "px;right:0;top:" + northRegionHeight + "px;");

      principalContainer.insertBefore(container, this.loader);

      // configure the controls in the region
      for (var i=0, l=eastSpaceControls.length; i<l; i++) {
        eastSpaceControls[i].expresion = parser.parse("(0," + (buttonsConfig.height*i) + "," + eastRegionWidth + "," + buttonsConfig.height +")");
        eastSpaceControls[i].drawif = parser.parse("1");
        eastSpaceControls[i].init();
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // west region
    if (westSpaceControls.length > 0) {
      westRegionHeight = principalContainer.height - northRegionHeight - southRegionHeight;
      westRegionWidth = buttonsConfig.widthWest;

      var container = this.westSpace.container;
      container.id = "descartesJS_west";
      container.setAttribute("style", "width: " + westRegionWidth + "px;height:" + westRegionHeight + "px;left:0;top:" + northRegionHeight + "px;");

      principalContainer.insertBefore(container, this.loader);

      // configure the controls in the region
      for (var i=0, l=westSpaceControls.length; i<l; i++) {
        westSpaceControls[i].expresion = parser.parse("(0," + (buttonsConfig.height*i) + "," + westRegionWidth + "," + buttonsConfig.height +")");
        westSpaceControls[i].drawif = parser.parse("1");
        westSpaceControls[i].init();
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // editable and visible region
    if (this.editableRegionVisible) {
      editableRegionHeight = buttonsConfig.height;
      var container = this.editableRegion.container;
      container.id = "descartesJS_editableRegion";
      container.setAttribute("style", "width:" + principalContainer.width + "px;height:" + editableRegionHeight + "px;left:0;top:" + (principalContainer.height - southRegionHeight - buttonsConfig.height) + "px;");

      principalContainer.insertBefore(container, this.loader);

      var editableRegionTextFields = this.editableRegion.textFields;
      var textFieldsWidth = (principalContainer.width)/editableRegionTextFields.length;

      var fontSize = descartesJS.getFieldFontSize(editableRegionHeight);
      // configure the text fields in the region
      for (var i=0, l=editableRegionTextFields.length; i<l; i++) {
        if (editableRegionTextFields[i].type == "div") {
          container.appendChild(editableRegionTextFields[i].container);

          ////////////////////////////////////////////////////////////////
          // the container
          editableRegionTextFields[i].container.setAttribute("style", "font-family:"+ descartesJS.sansserif_font +";width:" + (textFieldsWidth-4) + "px;height:" + (editableRegionHeight) + "px;position:absolute;left:" + ( i*textFieldsWidth ) + "px;top:0;");

          ////////////////////////////////////////////////////////////////
          // the label
          var label = editableRegionTextFields[i].container.firstChild;

          label.setAttribute("style", "font-family:"+ descartesJS.sansserif_font +";font-size:" + fontSize + "px;padding-top:0;background-color:#e0e4e8;position:absolute;left:0;top:0;height:" + (editableRegionHeight) + "px;text-align:center;line-height:"+ (editableRegionHeight) +"px;");
          var labelWidth = label.offsetWidth;
          label.style.width = labelWidth + "px";

          // remove the first and last character, because are initially underscores
          label.firstChild.textContent = label.firstChild.textContent.substring(3, label.firstChild.textContent.length-3);

          ////////////////////////////////////////////////////////////////
          // the text field
          var textfield = editableRegionTextFields[i].container.lastChild;
          textfield.setAttribute("style", "font-family:"+ descartesJS.monospace_font +";font-size:" + fontSize + "px;width:" + (textFieldsWidth-labelWidth) + "px;height:" + (editableRegionHeight) + "px;position:absolute;left:" + (labelWidth) + "px;top:0;border:2px groove white;");
        }

        else {
          container.appendChild(editableRegionTextFields[i]);

          editableRegionTextFields[i].setAttribute("style", "font-family:"+ descartesJS.monospace_font +";font-size:" + fontSize + "px;width:" + (textFieldsWidth) + "px;height:" + (editableRegionHeight) + "px;position:absolute;left:" + ( i*textFieldsWidth ) + "px;top:0;border:2px groove white;");
        }
      }
    }

    this.displaceRegionNorth = northRegionHeight;
    this.displaceRegionSouth = southRegionHeight;

    this.displaceRegionEast = eastRegionWidth;
    this.displaceRegionWest = westRegionWidth;

    for (var i=0, l=this.spaces.length; i<l; i++) {
      this.spaces[i].init()
    }
  }

  /**
   * Update the applet
   */
  descartesJS.DescartesApp.prototype.update = function() {
    this.updateAuxiliaries();
    this.updateControls();
    this.updateEvents();
    this.updateControls();
    this.updateSpaces();
  }

  /**
   * Change the click to 0
   */
  descartesJS.DescartesApp.prototype.clearClick = function() {
    for (var i=0, l=this.spaces.length; i<l; i++) {
      this.spaces[i].clearClick()
    }
  }

  /** */
  descartesJS.DescartesApp.prototype.removeButtonClick = function() {
    descartesJS.newBlobContent = null;
    for (var i=0, l=this.controls.length; i<l; i++) {
      this.controls[i].buttonClick = false;
    }
  }

  /**
   * Deactivate the graphic controls
   */
  descartesJS.DescartesApp.prototype.deactivateGraphicControls = function() {
    var controls_i;
    for (var i=0, l=this.controls.length; i<l; i++) {
      controls_i = this.controls[i];
      if (controls_i.type == "graphic") {
        controls_i.deactivate();
      }
    }
  }

  /**
   * Update the auxiliaries
   */
  descartesJS.DescartesApp.prototype.updateAuxiliaries = function() {
    for (var i=0, l=this.auxiliaries.length; i<l; i++) {
      this.auxiliaries[i].update();
    }
  }

  /**
   * Update the events
   */
  descartesJS.DescartesApp.prototype.updateEvents = function() {
    for (var i=0, l=this.events.length; i<l; i++) {
      this.events[i].update();
    }
  }

  /**
   * Update the controls
   */
  descartesJS.DescartesApp.prototype.updateControls = function() {
    for (var i=0, l=this.controls.length; i<l; i++) {
      this.controls[i].update();
    }
  }

  /**
   * Update the spaces
   */
  descartesJS.DescartesApp.prototype.updateSpaces = function(firstime) {
    for (var i=0, l=this.spaces.length; i<l; i++) {
      this.spaces[i].update(firstime);
    }
  }

  /**
   * Clear the trace in the space
   */
  descartesJS.DescartesApp.prototype.clear = function() {
    for (var i=0, l=this.spaces.length; i<l; i++) {
      this.spaces[i].spaceChange = true;

      if (this.spaces[i].drawBackground) {
        this.spaces[i].drawBackground();
      }
    }
  }

  /**
   * Play the animation
   */
  descartesJS.DescartesApp.prototype.play = function() {
    this.animation.play();
  }

  /**
   * Stop the animation
   */
  descartesJS.DescartesApp.prototype.stop = function() {
    this.animation.stop();
  }

  /**
   * Reinit the animation
   */
  descartesJS.DescartesApp.prototype.reinitAnimation = function() {
    this.animation.reinit();
  }

  /**
   * Stop the playing audios
   */
  descartesJS.DescartesApp.prototype.stopAudios = function() {
    // stop the animation
    this.stop()

    // stop the audios
    for (var propName in this.audios) {
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
  descartesJS.DescartesApp.prototype.getImage = function(name) {
    var images = this.images;
    if (name) {
      // if the image exist return that image
      if (images[name]) {
        return images[name];
      }
      // if do not exist then create a new image
      else {
        images[name] = new Image();
        images[name].addEventListener('load', function() { this.ready = 1; });
        images[name].addEventListener('error', function() { this.ready = 0; this.errorload = 1; });
        images[name].src = name;

        return images[name];
      }
    }

    return new Image();
  }

  /**
   * Get an audio by name
   * @param {String} name the name of the audio
   * @return {Audio} the audio with the name
   */
  descartesJS.DescartesApp.prototype.getAudio = function(name) {
    var audios = this.audios;
    if (name) {
      // if the audio exist return that audio
      if (audios[name]) {
        return audios[name];
      }
      // if do not exist then create a new audio
      else {
        var lastIndexOfDot = name.lastIndexOf(".");
        lastIndexOfDot = (lastIndexOfDot === -1) ? name.length : lastIndexOfDot;
        audios[name] = new Audio(name);

        var onCanPlayThrough = function(evt) {
          this.ready = 1;
        }
        audios[name].addEventListener('canplaythrough', onCanPlayThrough);

        var onError = function(evt) {
          if (!this.canPlayType("audio/" + name.substring(name.length-3)) && (name.substring(name.length-3) == "mp3")) {
            audios[name] = new Audio(name.replace("mp3", "ogg"));
            audios[name].addEventListener('canplaythrough', onCanPlayThrough);
            audios[name].addEventListener('load', onCanPlayThrough);
            audios[name].addEventListener('error', onError);
            audios[name].load();
          } else {
            console.log("El archivo '" + name + "' no puede ser reproducido");
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
  descartesJS.DescartesApp.prototype.getControlByCId = function(cID) {
    return this.getControlById(cID, true);
  }

  /**
   * Get a control by identifier
   * @param {String} id the identifier of the control
   * @return {Control} return a control with identifier or a dummy control if not find
   */
  descartesJS.DescartesApp.prototype.getControlById = function(id, cID) {
    var param = (cID) ? "cID" : "id";
    var controls_i;
    for (var i=0, l=this.controls.length; i<l; i++) {
      controls_i = this.controls[i];
      if (controls_i[param] == id) {
        return controls_i;
      }
    }

    return { update: function() {}, w: 0, h: 0 };
  }

  /**
   * Get a space by a component identifier
   * @param {String} cId the component identifier of the space
   * @return {Space} return a space with the component identifier or a dummy space if not find
   */
  descartesJS.DescartesApp.prototype.getSpaceByCId = function(cID) {
    return this.getSpaceById(cID, true);
  }

  /**
   * Get a space by identifier
   * @param {String} cId the identifier of the space
   * @return {Space} return a space with the identifier or a dummy space if not find
   */
  descartesJS.DescartesApp.prototype.getSpaceById = function(id, cID) {
    var param = (cID) ? "cID" : "id";
    var spaces_i;
    for (var i=0, l=this.spaces.length; i<l; i++) {
      spaces_i = this.spaces[i];
      if (spaces_i[param] == id) {
        return spaces_i;
      }
    }

    return { update: function() {}, w: 0, h: 0 };
  }

  /**
   * Get the parameters in the URL an set the values in the URL object
   * ex. index.html?var1=0&var2=hi, creates URL.var1=0 y URL.var2='hi' 
   */
  descartesJS.DescartesApp.prototype.getURLParameters = function() {
    var url = window.location.href;
    var indexParams = url.indexOf("?");
    var tmpParam;

    if (indexParams != -1) {
      url = decodeURIComponent(url.substring(indexParams+1)).split("&");
      for (var i=0, l=url.length; i<l; i++) {
        tmpParam = url[i].split("=");

        if (tmpParam.length == 2) {
          // is number
          if (+tmpParam[1] == +tmpParam[1]) {
            tmpParam[1] = parseFloat(tmpParam[1]);
          }
          this.evaluator.setVariable("URL." + tmpParam[0], tmpParam[1]);
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
    var result = "[";

    for (var i=0, l=array.length; i<l; i++) {
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
   * Get the state of the applet
   * @return {String} return a string with the variables, vectors and matrices separate with commas
   */
  descartesJS.DescartesApp.prototype.getState = function() {
    var theValues;
    var state = "";

    var theVariables = this.evaluator.variables;
    // check all the variables
    for (var varName in theVariables) {
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

    var theVectors = this.evaluator.vectors;
    // check all the vectors
    for (var vecName in theVectors) {
      if (theVectors.hasOwnProperty(vecName)) {
        state += "\n" + vecName + "=" + arrayToString(theVectors[vecName]);
      }
    }

    var theMatrices = this.evaluator.matrices;
    // check all the matrices
    for (var matName in theMatrices) {
      if (theMatrices.hasOwnProperty(matName)) {
        state += "\n" + matName + "=" + arrayToString(theMatrices[matName]);
      }
    }

    // return the values in the form variable1=value1\nvariable2=value2\n...\nvariableN=valueN
    return state;
  }

  /**
   * Set the state of the applet
   * @param {String} state string containing the values to set of the form variable1=value1\nvariable2=value2\n...\nvariableN=valueN
   */
  descartesJS.DescartesApp.prototype.setState = function(state, noUpdate) {
    var theState = state.split("\n");

    var tmpParse;
    var value;

    for (var i=0, l=theState.length; i<l; i++) {
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
  descartesJS.DescartesApp.prototype.getEvaluation = function() {
    var questions = correct = 0;
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
   * Store que values in the text fields in the moment of the execution and show the first element in the answer pattern
   */
  descartesJS.DescartesApp.prototype.showSolution = function() {
    var controls = this.controls;
    for (var i=0, l=controls.length; i<l; i++) {
      if ( (controls[i].gui == "textfield") && (controls[i].evaluate) ) {
        controls[i].changeValue( controls[i].getFirstAnswer() );
      }
    }

    this.update();
  }

  /**
   * Store the values in the text fields in the moment of the execution and show the answer of the student
   */
  descartesJS.DescartesApp.prototype.showAnswer = function() {
    for (var i=0, l=this.saveState.length; i<l; i++){
      this.evaluator.eval( this.saveState[i] );
    }

    this.update();
  }

  /**
   * 
   */
  descartesJS.DescartesApp.prototype.cleanCanvasImages = function() {
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

  /**
   *
   */
  function scaleToFit() {
    scaleToFitX = window.innerWidth/this.width;
    scaleToFitY = window.innerHeight/this.height;

    descartesJS.cssScale = optimalRatio = Math.min(scaleToFitX, scaleToFitY);

    this.container.style.transformOrigin = "0 0";

    if (scaleToFitX < scaleToFitY) {
      this.container.style.left = "0";
      this.container.style.transform = "translate3d(0px, 0px, 0px) scale("+optimalRatio+")";
    }
    else {
      this.container.style.left = "50%";
      this.container.style.transform = "translate3d(0px, 0px, 0px) scale("+optimalRatio+") translate(-50%, 0)";
    }
  }

  return descartesJS;
})(descartesJS || {});
