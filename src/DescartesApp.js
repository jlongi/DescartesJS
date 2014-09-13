/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var licenseA = "{\\rtf1\\uc0{\\fonttbl\\f0\\fcharset0 Arial;\\f1\\fcharset0 Arial;\\f2\\fcharset0 Arial;\\f3\\fcharset0 Arial;\\f4\\fcharset0 Arial;}"+
                 "{\\f0\\fs34 __________________________________________________________________________________ \\par \\fs22 "+
                 "                                       Los contenidos de esta unidad did\u00e1ctica interactiva est\u00e1n bajo una  {\\*\\hyperlink licencia Creative Commons|http://creativecommons.org/licenses/by-nc-sa/2.5/es/}, si no se indica lo contrario.\\par "+
                 "                                       La unidad did\u00e1ctica fue creada con Arqu\u00edmedes, que es un producto de c\u00f3digo abierto, {\\*\\hyperlink Creditos|http://arquimedes.matem.unam.mx/Descartes5/creditos/conCCL.html}\\par "+
                 "}";

  /**
   * Descartes application interprete with javascript
   * @constructor 
   * @param {<applet>} applet the applet to interpret
   */
  descartesJS.DescartesApp = function(applet) {
    this.animation = { playing:false, stop:function(){} };

    /**
     * applet code
     * @type {<applet>}
     * @private
     */
    this.applet = applet;
    // this.externalVariables = {};

    /**
     * container of the java applet
     * @type {<HTMLelement>}
     * @private 
     */
    this.parentContainer = applet.parentNode;

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
    this.decimal_symbol_regexp = new RegExp("\\" + this.decimal_symbol, "g");

    /**
     * language of the lesson
     * type {String}
     * @private
     */
    this.language = "espa\u00F1ol";

    /**
     * parameters of the applet
     * type {Array.<param>}
     * @private
     */
    this.children = applet.getElementsByTagName("param");

    // se the license attribute
    descartesJS.creativeCommonsLicense = true;
    for (var i=0,l=this.children.length; i<l; i++) {
      if (this.children[i].name === "CreativeCommonsLicense") {
        descartesJS.creativeCommonsLicense = (this.children[i].value === "no") ? false : true;
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
    this.images = {};
    
    /**
     * number of images used in the applet
     * type {Number}
     * @private 
     */
    this.images.length = -1;
    
    /**
     * audios used in the applet
     * type {Array.<Audio>}
     * @private
     */
    this.audios = {};
    
    /**
     * number of audios used in the applet
     * type {Number}
     * @private 
     */
    this.audios.length = -1;
    
    /**
     * variable to record if the applet is interpreted for the first time, used to show the loader screen
     * type {Boolean}
     * @private
     */
    this.firstRun = true;

    // init the interpretation
    this.init()
  }

  /**
   * Init the variables needed for parsing and create the descartes lesson
   */
  descartesJS.DescartesApp.prototype.init = function() {
  	// stop the animation, if the action init executes maybe the animation is playing
  	this.stop();

    /**
     * evaluator and parser of expressions
     * type {Evaluator}
     * @private
     */
    this.evaluator = new descartesJS.Evaluator(this);
   
    /**
     * parser of elements in the lesson
     * @type {LessonParser}
     * @private
     */
    this.lessonParser = new descartesJS.LessonParser(this);

    /**
     * variable that tell us whether the lesson is an arquimedes lesson
     * type {Boolean}
     * @private
     */
    this.arquimedes = !!this.code.match("descinst.DescartesWeb2_0.class", "i") || 
                      !!this.code.match("Arquimedes", "i") ||
                      !!this.code.match("Discurso", "i");

    // licences for arquimedes
    this.licenseA = (descartesJS.creativeCommonsLicense) ? licenseA : "";

    var children = this.children;
    var children_i;
    var heightRTF = 0;
    var heightButtons = 0;
    var licenceHeight = (descartesJS.creativeCommonsLicense) ? 90 : 0;

    for(var i=0, l=children.length; i<l; i++) {
      children_i = children[i];
    
      // get the rtf height
      if (children_i.name == "rtf_height") {
        heightRTF = parseInt(children_i.value) || this.height;
      }

      // get the buttons height
      if (babel[children_i.name] == "Buttons") {
        this.buttonsConfig = this.lessonParser.parseButtonsConfig(children_i.value);
        heightButtons = this.buttonsConfig.height;
      }

      // get image source for the loader
      if (children_i.name == "image_loader") {
        this.image_loader = children_i.value;
      }

      // // set the docBase for the elements in the resources
      if (children_i.name == "docBase") {
        this.docBase = children_i.value;
        var base = document.createElement("base");
        base.setAttribute("id", "descartesJS_base");
        base.setAttribute("href", this.docBase);
        document.head.appendChild(base);
      }

    }

    // configure an arquimedes lesson
    if (this.arquimedes) {
      // modify the lesson height if find rtf height
      if (heightRTF) {
        this.height =  heightRTF + heightButtons + licenceHeight; // 70 is the height of the licence image
      }
    }

    /**
     * array to store the lesson spaces
     * type {Array.<Space>}
     * @private
     */
    this.spaces = [];

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
     * special region to put the credits, config, init and clean buttons
     * type {Space}
     * @private
     */
    // this.specialSpace = {container: document.createElement("div"), controls: []};
    
    /**
     * region to show text fields for editable content
     * type {Space}
     * @private
     */
    this.editableRegion = {container: document.createElement("div"), textFields: []};

    /**
     *
     */
    if (descartesJS.Editor) {
      this.editor = new descartesJS.Editor(this);
    }
        
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

    // variables used for the htmliframe get function
    this.cacheVars = {};
    this.getVarsNames = {};
   
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
    this.numberOfIframes = 1;
    
    // code needed for reinit the lesson
    if (this.container != undefined) {
      this.parentContainer.removeChild(this.container);
    }

    this.container = document.createElement("div");
    this.loader = document.createElement("div");

    // append the lesson container to the java applet container
    this.parentContainer.appendChild(this.container);
    this.container.width = this.width;
    this.container.height = this.height;
    this.container.setAttribute("class", "DescartesAppContainer");
    this.container.setAttribute("style", "width:" + this.width + "px; height:" + this.height + "px;");
    
    // add the loader
    this.container.appendChild(this.loader);
    this.loader.width = this.width;
    this.loader.height = this.height;
    this.loader.setAttribute("class", "DescartesLoader");
    this.loader.setAttribute("style", "width:" + this.width + "px; height:" + this.height + "px; z-index:1000;");

    // this.adjustDimensions();

    // if is the first time in execute the interpretation
    if (this.firstRun) {
      this.descartesLoader = new descartesJS.DescartesLoader(this);
    } else {
      this.initBuildApp();
    }
  }
  
  /**
   * Init the parse and creation of objects for the descartes lesson
   */
  descartesJS.DescartesApp.prototype.initBuildApp = function() {
    var children = this.children;
    var lessonParser = this.lessonParser;
    
    var tmpSpaces = [];
    var tmpControls = [];
    var tmpAuxiliaries = [];
    var tmpGraphics = [];
    var tmp3DGraphics = [];
    var tmpAnimations = [];
    
    var children_i;

    // check all the children
    for(var i=0, l=children.length; i<l; i++) {
      children_i = children[i];
      
      // find the language of the lesson
      if (babel[children_i.name] == "language") {
        this.language = children_i.value;
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

      // find the language of the lesson, needed for arquimedes
      if (babel[children_i.name] == "language") {
        this.language = children_i.value;
        continue;
      }      

      // // find if the applet is enable for the interaction
      // if (babel[children_i.getAttribute("enable")] == "enable") {
      //   this.enable = babel[children_i.getAttribute("enable")];
      //   continue;
      // }
      
      // ##ARQUIMEDES## //
      // find the rtf text of an arquimedes lesson
      if (children_i.name == "rtf") {
        var posX = (this.width-780)/2;
        var posY = (parseInt(this.height) -this.plecaHeight -this.buttonsConfig.height -45);

        tmpGraphics.push("space='descartesJS_scenario' type='text' expresion='[10,20]' background='yes' text='" + children_i.value.replace(/'/g, "&squot;") + "'");
        tmpGraphics.push("space='descartesJS_scenario' type='text' expresion='[" + posX + "," + (posY-25) + "]' background='yes' text='" + this.licenseA + "'");
        if (descartesJS.creativeCommonsLicense) {
          tmpGraphics.push("space='descartesJS_scenario' type='image' expresion='[" + (posX+15) + "," + posY + "]' background='yes' abs_coord='yes' file='lib/DescartesCCLicense.png'");
        }

        continue;
      }
      // ##ARQUIMEDES## //

      // if the name of the children start with "E" then is a space
      if (children_i.name.charAt(0) == "E") {
        if (children_i.value.match(/'HTMLIFrame'/)) {
          this.numberOfIframes++;
        }
        
        tmpSpaces.push(children_i.value);
        continue;
      }
      
      // if the name of the children start with "C_" then is a control
      if ((children_i.name.charAt(0) == "C") && (children_i.name.charAt(1) == "_")) {
        tmpControls.push(children_i.value);
        continue;
      }

      // if the name of the children start with "A_" then is an auxiliary 
      if ((children_i.name.charAt(0) == "A") && (children_i.name.charAt(1) == "_")) {
        tmpAuxiliaries.push(children_i.value);
        continue;
      }

      // if the name of the children start with "G" then is a graphic
      if (children_i.name.charAt(0) == "G") {
        tmpGraphics.push(children_i.value);
        continue;
      }

      // if the name of the children start with "S" then is a tridimensional graphic
      if (children_i.name.charAt(0) == "S") {
        tmp3DGraphics.push(children_i.value);
        continue;
      }
      
      // if the name of the children is "Animation" then is an animation
      if (babel[children_i.name] == "Animation") {
        tmpAnimations.push(children_i.value);
        continue;
      }
    }

    // the scenario region is only visible in arquimedes lessons
    this.scenarioRegion = {container: document.createElement("div"), scroll: 0};
    this.scenarioRegion.container.setAttribute("id", "descartesJS_Scenario_Region");
    this.scenarioRegion.scenarioSpace = this.lessonParser.parseSpace("tipo='R2' id='descartesJS_scenario' fondo='blanco' x='0' y='0' fijo='yes' red='no' red10='no' ejes='no' text='no' ancho='" + this.width + "' alto='" + this.height + "'");
    this.scenarioRegion.container.appendChild(this.scenarioRegion.scenarioSpace.container);

    // ##ARQUIMEDES## //
    // if arquimedes then add the container of the scenario region
    if (this.arquimedes) {
      this.container.appendChild(this.scenarioRegion.container);
      this.spaces.push(this.scenarioRegion.scenarioSpace);
    }
    // ##ARQUIMEDES## //    

    // init the spaces
    var tmpSpace;
    for (var i=0, l=tmpSpaces.length; i<l; i++) {
      tmpSpace = lessonParser.parseSpace(tmpSpaces[i]);

      // ##ARQUIMEDES## //
      if (this.arquimedes) {
        this.scenarioRegion.container.appendChild(tmpSpace.container);
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
      tmpGraph = lessonParser.parseGraphic(tmpGraphics[i]);
      if (tmpGraph) {
        if (tmpGraph.visible) {
          this.editableRegionVisible = true;
        }

        tmpGraph.space.addGraph(tmpGraph);
      }
    }
    
    // init the tridimensional graphics
    var tmp3DGraph;
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
    if (this.numberOfIframes) {
      setTimeout(function() { self.finishInit(); }, 200*this.numberOfIframes);
    }
    else {
      this.finishInit();
    }

// console.log(this.auxiliaries)

  }
  
  /**
   * Finish the interpretation
   */
  descartesJS.DescartesApp.prototype.finishInit = function() {
    this.update();

    // hide the loader
    this.loader.style.display = "none";
    // this.parentContainer.style.overflow = "hidden";
    
    // // if the applet is disabled then put a div blocking the interacion
    // if (this.enable) {
    //   this.blocker = document.createElement("div");
    //   this.blocker.setAttribute("class", "blocker");
    //   this.blocker.setAttribute("style", "width:" + this.width + "px; height:" + this.height + "px");
    //   this.container.appendChild(this.blocker);
    // }

    // if the window parent is diferente from the current window, then the lesson is embedded in an iFrame
    if (window.parent !== window) {
      this.parentContainer.style.margin = "0px";
      this.parentContainer.style.padding = "0px";

      window.parent.postMessage({ type: "reportSize", href: window.location.href, width: this.width, height: this.height }, '*');
      window.parent.postMessage({ type: "ready" }, '*');

      descartesJS.onResize();
    }

    // scene open in a new window
    if (window.opener) {
      window.opener.postMessage({ type: "isResizeNeeded", href: window.location.href }, '*');
    }

    this.externalSpace.init();

    
  }

  /**
   * Adjust the size of the window if needed
   */
  descartesJS.DescartesApp.prototype.adjustSize = function() {
    document.body.style.margin = "0px";
    document.body.style.padding = "0px";
    this.parentContainer.style.margin = "0px";
    this.parentContainer.style.padding = "0px";
    var winWidth = parseInt(this.width)+30;
    var winHeight = parseInt(this.height)+90;

    window.moveTo((parseInt(screen.width)-winWidth)/2, (parseInt(screen.height)-winHeight)/2);
    window.resizeTo(winWidth, winHeight);

    descartesJS.onResize();      
  }

  /**
   *
   */
  descartesJS.DescartesApp.prototype.adjustDimensions = function() {
    var appletsAJS_i = this;
    var init_w;
    var w;
    var percent;

    if ((appletsAJS_i.init_w == undefined) || (appletsAJS_i.init_h == undefined)) {
      appletsAJS_i.init_w = parseInt( appletsAJS_i.container.style.width );
      appletsAJS_i.init_h = parseInt( appletsAJS_i.container.style.height );
    }

    w = parseInt(appletsAJS_i.parentContainer.offsetWidth);
    init_w = appletsAJS_i.init_w;
    percent = w/init_w;

    if (init_w > w) {
      if (appletsAJS_i.parentContainer != document.body) {
        appletsAJS_i.parentContainer.style.height = appletsAJS_i.init_h*percent + "px";
      }
      appletsAJS_i.percent = percent;
      appletsAJS_i.container.style.webkitTransform = appletsAJS_i.container.style.MozTransform = "scale(" +percent+ ")";
      appletsAJS_i.container.style.webkitTransformOrigin = appletsAJS_i.container.style.MozTransformOrigin = "top left";
    }
    else {
      if (appletsAJS_i.parentContainer != document.body) {
        appletsAJS_i.parentContainer.style.height = "auto";
      }
      appletsAJS_i.percent = 1;

      appletsAJS_i.container.style.webkitTransform = appletsAJS_i.container.style.MozTransform = "";
      appletsAJS_i.container.style.webkitTransformOrigin = appletsAJS_i.container.style.MozTransformOrigin = "";
    }
  }
  
  /**
   * Configure the regions
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
    // north region
    if ((buttonsConfig.rowsNorth > 0) || ( northSpaceControls.length > 0) || (buttonsConfig.about) || (buttonsConfig.config)) {
      if (buttonsConfig.rowsNorth <= 0) {
        northRegionHeight = buttonsConfig.height;
        buttonsConfig.rowsNorth = 1;
      }
      // if the number of rows is diferent of zero then the height is the number of rows
      else {
        northRegionHeight = buttonsConfig.height * buttonsConfig.rowsNorth;
      }

      var container = this.northSpace.container;
      container.setAttribute("id", "descartesJS_northRegion");
      container.setAttribute("style", "width:" + principalContainer.width + "px; height:" + northRegionHeight + "px; background:#c0c0c0; position:absolute; left:0px; top: " + this.plecaHeight + "px; z-index:100;")

      principalContainer.insertBefore(container, this.loader);
      
      northRegionWidht = principalContainer.width;
      var displaceButton = 0;

      // show the credits button
      if (buttonsConfig.about) {
        displaceButton = aboutWidth;
        northRegionWidht -= displaceButton;
      }
      else {
        aboutWidth = 0;
      }
      // show the configuration button
      if (buttonsConfig.config) {
        northRegionWidht -= configWidth;
      }
      
      var numberOfControlsPerRow = Math.ceil(northSpaceControls.length / buttonsConfig.rowsNorth);
      var controlWidth = northRegionWidht/numberOfControlsPerRow;
      
      // configure the controls in the region
      for (var i=0, l=northSpaceControls.length; i<l; i++) {
        northSpaceControls[i].expresion = parser.parse("(" + (displaceButton +controlWidth*(i%numberOfControlsPerRow)) +"," + (buttonsConfig.height*Math.floor(i/numberOfControlsPerRow)) + "," + controlWidth + "," + buttonsConfig.height +")");
        northSpaceControls[i].drawif = parser.parse("1");
        northSpaceControls[i].init();
      }
      
      // create the credits button
      if (buttonsConfig.about) {
        var text;
        if (this.language == "espa\u00F1ol") {
          text = "cr\u00E9ditos";
        } 
        else if (this.language == "english") {
          text = "about";
        }
        else {
          text = "cr\u00E9ditos";
        }

        var btnAbout = new descartesJS.Button(this, {region: "north", 
                                                     name: text, 
                                                     font_size: parser.parse(fontSizeDefaultButtons),
                                                     expresion: parser.parse("(0, 0, " + aboutWidth + ", " + northRegionHeight + ")")
                                                    });
        btnAbout.actionExec = { execute: descartesJS.showAbout };
        btnAbout.update();
      }
      // create the configuration button
      if (buttonsConfig.config) {
        var text = "config";
        
        var btnConfig = new descartesJS.Button(this, {region: "north", 
                                                      name: text, 
                                                      font_size: parser.parse(fontSizeDefaultButtons),
                                                      action: "config",
                                                      expresion: parser.parse("(" + (northRegionWidht + aboutWidth)  + ", 0, " + configWidth + ", " + northRegionHeight + ")")
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
      // if the number of rows is diferent of zero then the height is the number of rows
      else {
        southRegionHeight = buttonsConfig.height * buttonsConfig.rowsSouth;
      }

      southRegionWidht = principalContainer.width;
      var displaceButton = 0;
      // show the init button
      if (buttonsConfig.init) {
        displaceButton = initWidth;
        southRegionWidht -= displaceButton;
      }
      else {
        initWidth = 0;
      }
      // show the clear button
      if (buttonsConfig.clear) {
        southRegionWidht -= clearWidth;
      }

      var container = this.southSpace.container;
      container.setAttribute("id", "descartesJS_southRegion");
      container.setAttribute("style", "width:" + principalContainer.width + "px; height:" + southRegionHeight + "px; background:#c0c0c0; position:absolute; left: 0px; top:" + (principalContainer.height-southRegionHeight) + "px; z-index:100;")

      principalContainer.insertBefore(container, this.loader);

      var numberOfControlsPerRow = Math.ceil(southSpaceControls.length / buttonsConfig.rowsSouth);
      var controlWidth = southRegionWidht/numberOfControlsPerRow;
      
      // configure the controls in the region
      for (var i=0, l=southSpaceControls.length; i<l; i++) {
        southSpaceControls[i].expresion = parser.parse("(" + (displaceButton + controlWidth*(i%numberOfControlsPerRow)) +"," + (buttonsConfig.height*Math.floor(i/numberOfControlsPerRow)) + "," + controlWidth + "," + buttonsConfig.height +")");
        southSpaceControls[i].drawif = parser.parse("1");
        southSpaceControls[i].init();
      }
      
      // create the init button
      if (buttonsConfig.init) {
        var text;
        if (this.language == "espa\u00F1ol") {
          text = "inicio";
        } 
        else if (this.language == "english") {
          text = "init";
        }
        else {
          text = "inicio";
        }

        var btnInit = new descartesJS.Button(this, {region: "south", 
                                                    name: text, 
                                                    font_size: parser.parse(fontSizeDefaultButtons), 
                                                    action: "init", 
                                                    expresion: parser.parse("(0, 0, " + initWidth + ", " + southRegionHeight + ")") 
                                                  });
        btnInit.update();
      }
      // create the clear button
      if (buttonsConfig.clear) {
        var text;
        if (this.language == "espa\u00F1ol") {
          text = "limpiar";
        } 
        else if (this.language == "english") {
          text = "clear";
        }
        else {
          text = "limpiar";
        }
        
        var btnClear = new descartesJS.Button(this, {region: "south", 
                                                     name: text, 
                                                     font_size: parser.parse(fontSizeDefaultButtons),
                                                     action: "clear",
                                                     expresion: parser.parse("(" + (southRegionWidht + initWidth) + ", 0, " + clearWidth + ", " + southRegionHeight + ")")
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
      container.setAttribute("id", "descartesJS_eastRegion");
      container.setAttribute("style", "width:" + eastRegionWidth + "px; height:" + eastRegionHeight + "px; background:#c0c0c0; position:absolute; left:" + (principalContainer.width - eastRegionWidth) + "px; top:" + northRegionHeight + "px; z-index:100;");

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
      container.setAttribute("id", "descartesJS_westRegion");
      container.setAttribute("style", "width: " + westRegionWidth + "px; height: " + westRegionHeight + "px; background: #c0c0c0; position: absolute; left: 0px; top: " + northRegionHeight + "px; z-index: 100;");

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
      container.setAttribute("id", "descartesJS_editableRegion");
      container.setAttribute("style", "width:" + principalContainer.width + "px; height:" + editableRegionHeight + "px; position:absolute; left:0px; top:" + (principalContainer.height - southRegionHeight - buttonsConfig.height) + "px; z-index:100; background:#c0c0c0; overflow:hidden;");

      principalContainer.insertBefore(container, this.loader);

      var editableRegionTextFields = this.editableRegion.textFields
      var textFieldsWidth = (principalContainer.width)/editableRegionTextFields.length;

      var fontSize = descartesJS.getFieldFontSize(editableRegionHeight);
      // configure the text fields in the region
      for (var i=0, l=editableRegionTextFields.length; i<l; i++) {
        if (editableRegionTextFields[i].type == "div") {
          container.appendChild(editableRegionTextFields[i].container);

          ////////////////////////////////////////////////////////////////
          // the container
          editableRegionTextFields[i].container.setAttribute("style", "font-family: Arial, Helvetica, 'Droid Sans', Sans-serif; width: " + (textFieldsWidth-4) + "px; height: " + (editableRegionHeight) + "px; position: absolute; left: " + ( i*textFieldsWidth ) + "px; top: 0px;")// border: 2px groove white;");

          ////////////////////////////////////////////////////////////////
          // the label
          var label = editableRegionTextFields[i].container.firstChild;
          
          label.setAttribute("style", "font-family: Arial, Helvetica, 'Droid Sans', Sans-serif; font-size: " + fontSize + "px; padding-top: 0%; background-color: #e0e4e8; position: absolute; left: 0px; top: 0px; height:" + (editableRegionHeight) + "px; text-align: center; line-height: "+ (editableRegionHeight) +"px;");
          var labelWidth = label.offsetWidth;
          label.style.width = labelWidth + "px";

          // remove the first and last character, because are initially underscores
          label.firstChild.textContent = label.firstChild.textContent.substring(3, label.firstChild.textContent.length-3);
          
          ////////////////////////////////////////////////////////////////
          // the text field
          var textfield = editableRegionTextFields[i].container.lastChild;
          // textfield.setAttribute("style", "font-family:'Courier New', Courier, 'Droid Sans Mono', Monospace; width:" + (textFieldsWidth-labelWidth-8) + "px; height:" + (editableRegionHeight-9) + "px; position:absolute; left:" + (labelWidth) + "px; top:0px; border:2px groove white;");
          textfield.setAttribute("style", "font-family:'Courier New', Courier, 'Droid Sans Mono', Monospace; font-size: " + fontSize + "px; width:" + (textFieldsWidth-labelWidth) + "px; height:" + (editableRegionHeight) + "px; position:absolute; left:" + (labelWidth) + "px; top:0px; border:2px groove white;");
        } 

        else {
          container.appendChild(editableRegionTextFields[i]);

          editableRegionTextFields[i].setAttribute("style", "font-family:'Courier New', Courier, 'Droid Sans Mono', Monospace; font-size: " + fontSize + "px; width:" + (textFieldsWidth) + "px; height:" + (editableRegionHeight) + "px; position:absolute; left:" + ( i*textFieldsWidth ) + "px; top:0px; border:2px groove white;");
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
   * Update the applet
   */
  descartesJS.DescartesApp.prototype.update = function() {
    this.updateAuxiliaries();
    this.updateControls();
    this.updateEvents();
    this.updateControls();
    this.updateSpaces();
  	
    // this.updateAuxiliaries();
    // this.updateControls();
    // this.updateEvents();
    // this.updateSpaces();

    // send the cache vars to the htmliframes
    // this.sendCacheVars();
  }

  /**
   * Change the click to 0
   */
  descartesJS.DescartesApp.prototype.clearClick = function() {
    for (var i=0, l=this.spaces.length; i<l; i++) {
      this.spaces[i].clearClick()
    }    
  }
  
  /**
   * Deactivate the graphic controls
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
    if (this.animation) {
      this.animation.play();
    }
  }
  
  /**
   * Stop the animation
   */
  descartesJS.DescartesApp.prototype.stop = function() {
    if (this.animation) {
      this.animation.stop();
    }
  }
  
  /**
   * Reinit the animation
   */
  descartesJS.DescartesApp.prototype.reinitAnimation = function() {
    if (this.animation) {
      // this.animation.reinit();
      this.animation.play();
    }
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
        images[name].addEventListener('error', function() { this.errorload = 1; });
        images[name].src = name;

        return images[name];
      }
    }
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
        lastIndexOfDot = (lastIndexOfDot === -1) ? name.lenght : lastIndexOfDot;
        var namename = name.substring(0, lastIndexOfDot);
        
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
        setTimeout( function(){ audios[name].pause(); }, 15);
        
        return audios[name];
      }
    }
    else {
      return new Audio();
    }
  }  
  
  /**
   * Get a control by a component identifier
   * @param {String} cID the component identifier of the control
   * @return {Control} return a control with a component identifier or a dummy control if not find
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

  /**
   * Get a control by identifier
   * @param {String} id the identifier of the control
   * @return {Control} return a control with identifier or a dummy control if not find
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
   * Get a space by a component identifier
   * @param {String} cId the component identifier of the space
   * @return {Space} return a space with the component identifier or a dummy space if not find
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
   * Get a space by identifier
   * @param {String} cId the identifier of the space
   * @return {Space} return a space with the identifier or a dummy space if not find
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

  var tmpVal;
  /**
   * Get a string representation of an array
   * @param {Array} array the array to get the string representation
   * @return {String} return a string representing the array
   */
  function arrayToString(array) {
    var result = "[";

    for (var i=0, l=array.length; i<l; i++) {
      // nested array
      if (array[i] instanceof Array) {
        result += arrayToString(array[i]);
      }
      // value
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

      // add commas to the string
      if (i<l-1) {
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
        
        // if the name of the variable is the name of an internal variable or is an object, the ignore it
        if ( (theValues != undefined) && (varName != "rnd") && (varName != "pi") && (varName != "e") && (varName != "Infinity") && (varName != "-Infinity") && (typeof(theValues) != "object") ) {
          
          state = (state != "") ? (state + "\n" + varName + "=" + theValues) : (varName + "=" + theValues);
        }
      }
    }

    var theVectors = this.evaluator.vectors;
    // check all the vectors
    for (var vecName in theVectors) {
      if (theVectors.hasOwnProperty(vecName)) {
        theValues = theVectors[vecName];

        state = state + "\n" + vecName + "=" + arrayToString(theValues);
      }
    }

    var theMatrices = this.evaluator.matrices;
    // check all the matrices
    for (var matName in theMatrices) {
      if (theMatrices.hasOwnProperty(matName)) {
        theValues = theMatrices[matName];

        state = state + "\n" + matName + "=" + arrayToString(theValues);
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
          // this.evaluator.variables[tmpParse[0] + ".filas"] = value.length; 
          // this.evaluator.variables[tmpParse[0] + ".columnas"] = value[0].length; 
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
      this.evaluator.evalExpression( this.saveState[i] );
    }
    
    this.update();
  }

  // descartesJS.DescartesApp.prototype.registerCacheVar = function(name) {
  //   this.getVarsNames[name] = 0;
  // }

  // descartesJS.DescartesApp.prototype.sendCacheVars = function() {
  //   // traverse the values
  //   for (var propName in this.getVarsNames) {
  //     // verify the own properties of the object
  //     if (this.getVarsName.hasOwnProperty(propName)) {
  //       iframe.contentWindow.postMessage({ type: "get", name: varName }, "*");
  //     }
  //   }
  // }

  return descartesJS;
})(descartesJS || {});