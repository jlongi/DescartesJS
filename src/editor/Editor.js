/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  // if (descartesJS.loadLib) { return descartesJS; }

  var optionText = ["Espacio 2D", "Espacio 3D", "Espacio HTMLIFrame", 
                    "Pulsador", "Campo de texto", "Men\u00FA", "Barra", "Bot\u00F3n", "Control gr\u00E1fico", "Control de texto", "Audio", "Video", 
                    "Variable", "Funci\u00F3n", "Vector", "Matriz", 
                    "Constante", "Evento", "Algoritmo", 
                    "Ecuaci\u00F3n", "Curva", "Sucesi\u00F3n", "Punto", "Segmento", "Flecha", "Pol\u00EDgono", "Arco", "Relleno", "Texto", "Image", "Macro 2D", 
                    "Punto 3D", "Segmento 3D", "Pol\u00EDgono 3D", "Curva 3D", "Tri\u00E1ngulo", "Cara", "Pol\u00EDgono regular 3D", "Superficie", "Texto 3D", "Cubo", "Paralelep\u00edpedo", "Tetraedro", "Octaedro", "Dodecaedro", "Icosaedro", "Esfera", "Elipsoide", "Cono", "Cilindro", "Macro 3D", 
                    "Animaci\u00F3n"
                    ];

  var optionType = ["R2", "R3", "HTMLIFrame", 
                    "spinner", "textfield", "menu", "scrollbar", "button", "graphic", "text", "audio", "video",
                    "variable", "function", "array", "matrix",
                    "constant", "event", "algorithm",
                    "equation", "curve", "sequence", "point", "segment", "arrow", "polygon", "arc", "fill", "text", "image", "macro",
                    "point", "segment", "polygon", "curve", "triangle", "face", "polireg", "surface", "text", "cube", "box", "tetrahedron", "octahedron", "dodecahedron", "icosahedron", "sphere", "ellipsoid", "cone", "cylinder", "macro",
                    "animation"
                    ];


  /**
   * 
   * @constructor 
   * @param 
   */
  descartesJS.Editor = function(parent) {
    this.parent = parent;

    this.container = document.createElement("div");
    this.container.setAttribute("class", "DescartesEditorContainer");
    document.body.appendChild(this.container);

    this.readConfiguration();

    // this.configDescartesTabs();
    this.hide();

    this.configDescartesParamList();
  }

  /**
   *
   */
  descartesJS.Editor.prototype.show = function() {
    this.container.style.display = "block";
  }

  /**
   *
   */
  descartesJS.Editor.prototype.hide = function() {
    this.container.style.display = "none";
  }

  /**
   *
   */
  descartesJS.Editor.prototype.readConfiguration = function() {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    this.documentClone = document.createElement("document");
    this.documentClone.innerHTML = document.documentElement.innerHTML;

    var metas = this.documentClone.querySelectorAll("meta,#StyleDescartesApps,#StyleDescartesApps2,base,.DescartesEditorContainer");
    for (var i=0, l=metas.length; i<l; i++) {
      metas[i].parentNode.removeChild(metas[i]);
    }

    // replace the applet in the document with a DescartesPlaceholder node
    var desApplets = document.querySelectorAll("applet,ajs");
    var desAppletIndex;
    for (var i=0, l=desApplets.length; i<l; i++) {
      if (desApplets[i] == this.parent.applet) {
        desAppletIndex = i;
        break;
      }
    }

    desApplets = this.documentClone.querySelectorAll("applet,ajs");
    this.appletClone = desApplets[desAppletIndex];
    desApplets[desAppletIndex].parentNode.replaceChild(document.createElement("DescartesPlaceholder"), desApplets[desAppletIndex]);

    var delNode = this.appletClone.querySelector("param");
    delNode.parentNode.removeChild(delNode);

    this.script_docBase = this.appletClone.querySelector("script");
    if (this.script_docBase) {
     this.script_docBase.parentNode.removeChild(this.script_docBase);
    }

    // console.log(this.appletClone);
    // console.log(this.parent.applet);
    // console.log(this.documentClone.innerHTML)
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    var lessonParser = this.parent.lessonParser;

    var attributes = this.parent.applet.attributes;
    this.configAttributes = [];

    for (var i=0, l=attributes.length; i<l; i++) {
      this.configAttributes.push( { name: attributes[i].name,
                                    value: attributes[i].value
                                    } );
    }

    var children = this.parent.children;
    // var children = this.appletClone.children;

    this.sceneParams = [];
    this.spaceParams = [];
    this.ctrsParams = [];
    this.auxParams = [];
    this.defParams = [];
    this.progParams = [];
    this.graphParams = [];
    this.graph3DParams = [];
    this.animParams = [];
    var tmpname = "";
    var tmpvalue = "";

    for (var i=0, l=children.length; i<l; i++) {
      tmpname = children[i].getAttribute("name");
      tmpvalue = lessonParser.split( children[i].getAttribute("value") );

      if (tmpname) {
        if (tmpname.match("E_")) {
          this.spaceParams.push( { name: tmpname, 
                                   value: tmpvalue
                                 } );
        }
        else if (tmpname.match("C_")) {
          this.ctrsParams.push( { name: tmpname, 
                                  value: tmpvalue
                                } );
        }
        else if (tmpname.match("A_")) {
          this.auxParams.push( { name: tmpname, 
                                 value: tmpvalue
                               } );
        }
        else if (tmpname.match("G_")) {
          this.graphParams.push( { name: tmpname, 
                                   value: tmpvalue
                                 } );
        }
        else if (tmpname.match("S_")) {
          this.graph3DParams.push( { name: tmpname, 
                                     value: tmpvalue
                                   } );
        }
        else if (babel[tmpname] == "Animation") {
          this.animParams.push( { name: tmpname, 
                                  value: tmpvalue
                                } );
        }
        else {
          this.sceneParams.push( { name: babel[tmpname] || tmpname, 
                                   value: babel[children[i].getAttribute("value")] || children[i].getAttribute("value")
                                 } );
        }
      }
    }

    var auxParams_i_value;
    var tmpvalue;
    var hasAlgorithm;
    var hasParenthesis;
    var hasConstant;
    var hasEvent;

    for (var i=0,l=this.auxParams.length; i<l; i++) {
      auxParams_i_value = this.auxParams[i].value;
      hasAlgorithm = hasParenthesis = hasConstant = hasEvent = false;

      for (var j=0, k=auxParams_i_value.length; j<k; j++) {
        tmpvalue = babel[auxParams_i_value[j][0]];

        if (tmpvalue == "id") {
          if (auxParams_i_value[j][1].match(/\)$/)) {
            hasParenthesis = true;
          }
        }
        if (tmpvalue == "algorithm") {
          hasAlgorithm = true;
        }
        if (tmpvalue == "event") {
          hasEvent = true;
        }
        if (tmpvalue == "constant") {
          hasConstant = true;
        }
      }
      if ((hasAlgorithm && !hasParenthesis) || hasConstant || hasEvent) {
        this.progParams.push(this.auxParams[i]);
      }
      else {
        this.defParams.push(this.auxParams[i]);
      }
    }

  }

  /**
   *
   */
  descartesJS.Editor.prototype.configDescartesTabs = function() {
    this.DescartesTabsContainer = document.createElement("div");
    this.DescartesTabsContainer.setAttribute("class", "DescartesEditorTabContainer");

    this.DescartesTabsContainer.innerHTML = 
    "<div class='DescartesTabs'>\n" +
      "<ul>\n" +
        "<li id='tabHeader_1'>Configuraci&oacute;n</li>\n" +
        "<li id='tabHeader_2'>Espacios</li>\n" +
        "<li id='tabHeader_3'>Controles</li>\n" +
        "<li id='tabHeader_4'>Definiciones</li>\n" +
        "<li id='tabHeader_5'>Programa</li>\n" +
        "<li id='tabHeader_6'>Gr&aacute;ficos</li>\n" +
        "<li id='tabHeader_7'>Gr&aacute;ficos 3D</li>\n" +
        "<li id='tabHeader_8'>Animaci&oacute;n</li>\n" +
      "</ul>\n" +
    "</div>\n" +

    "<div class='DescartesTabscontent'>\n" +
      "<div class='DescartesTabPage' id='tab_1'></div>\n" +
      "<div class='DescartesTabPage' id='tab_2'></div>\n" +
      "<div class='DescartesTabPage' id='tab_3'></div>\n" +
      "<div class='DescartesTabPage' id='tab_4'></div>\n" +
      "<div class='DescartesTabPage' id='tab_5'></div>\n" +
      "<div class='DescartesTabPage' id='tab_6'></div>\n" +
      "<div class='DescartesTabPage' id='tab_7'></div>\n" +
      "<div class='DescartesTabPage' id='tab_8'></div>\n" +
    "</div>\n" +

    "<div class='DescartesButtonsPlace'>\n" +
      "<input id='Descartes_OKButton' class='DescartesEditorButton' type='submit' value='Aceptar' />\n" +
      "<input id='Descartes_CancelButton' class='DescartesEditorButton' type='submit' value='Cancelar' />\n" +
    "</div>\n";

    var navitem = this.DescartesTabsContainer.querySelector(".DescartesTabs ul li");
    var ident = navitem.id.split("_")[1];
    navitem.parentNode.setAttribute("data-current", ident);
    navitem.setAttribute("class","tabActiveHeader");

    var pages = this.DescartesTabsContainer.querySelectorAll(".DescartesTabPage");
    for (var i = 1; i < pages.length; i++) {
      pages[i].style.display = "none";
    }

    var DescartesTabs = this.DescartesTabsContainer.querySelectorAll(".DescartesTabs ul li");
    for (var i = 0; i < DescartesTabs.length; i++) {
      DescartesTabs[i].addEventListener("click", displayPage);
    }

    /**
     *
     */
    function displayPage() {
      var current = this.parentNode.getAttribute("data-current");

      document.getElementById("tabHeader_" + current).removeAttribute("class");
      document.getElementById("tab_" + current).style.display = "none";

      var ident = this.id.split("_")[1];

      this.setAttribute("class", "tabActiveHeader");
      document.getElementById("tab_" + ident).style.display = "block";
      this.parentNode.setAttribute("data-current", ident);
    }

    this.container.appendChild(this.DescartesTabsContainer);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // build the config panel
    this.configPanel = new descartesJS.EditorConfigPanel(this);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // build the space panel
    this.spacePanel = new descartesJS.EditorSpacePanel(this);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // build the control panel
    this.controlPanel = new descartesJS.EditorControlPanel(this);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // build the definition panel
    this.definitionPanel = new descartesJS.EditorDefinitionPanel(this);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // build the program panel
    this.programPanel = new descartesJS.EditorProgramPanel(this);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // build the graphic panel
    this.graphicPanel = new descartesJS.EditorGraphicPanel(this);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // build the graphic3D panel
    this.graphic3DPanel = new descartesJS.EditorGraphic3DPanel(this);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // build the animation panel
    this.animationPanel = new descartesJS.EditorAnimationPanel(this);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var self = this;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    document.getElementById("Descartes_OKButton").addEventListener("click", function(evt) {
      evt.preventDefault();
      this.blur();
      self.hide();
      console.log("ok");
    });
    document.getElementById("Descartes_CancelButton").addEventListener("click", function(evt) {
      evt.preventDefault();
      this.blur();
      self.hide();
      console.log("cancel");
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  }

  /**
   *************************************************************************************************************************************************
   */
  descartesJS.Editor.prototype.configDescartesParamList = function() {
    this.configToolbar();

    this.configListContainer();

    this.configFooter();

    this.configAddPanel();
  }

  /**
   *
   */
  descartesJS.Editor.prototype.configToolbar = function() {
    var self = this;
    var toolbarArea = document.createElement("div");
    toolbarArea.setAttribute("class", "DescartesToolbarPlace");

    var btnAdd    = this.newButton("Agregar");
    var btnRemove = this.newButton("Remover");
    var btnClone  = this.newButton("Duplicar");
    var btnUp     = this.newButton("Subir");
    var btnDonw   = this.newButton("Bajar");

    toolbarArea.appendChild(btnAdd);
    toolbarArea.appendChild(btnRemove);
    toolbarArea.appendChild(btnClone);
    toolbarArea.appendChild(btnUp);
    toolbarArea.appendChild(btnDonw);

    this.container.appendChild(toolbarArea);

    if (descartesJS.hasTouchSupport) {
      btnAdd.addEventListener("touchend", showFun);
      btnRemove.addEventListener("touchend", removeFun);
      btnClone.addEventListener("touchend", cloneFun);
      btnUp.addEventListener("touchend", upFun);
      btnDonw.addEventListener("touchend", downFun);
    }
    else {
      btnAdd.addEventListener("click", showFun);
      btnRemove.addEventListener("click", removeFun);
      btnClone.addEventListener("click", cloneFun);
      btnUp.addEventListener("click", upFun);
      btnDonw.addEventListener("click", downFun);
    }

    function showFun(evt) {
      self.showAddPanel();
    }

    function removeFun(evt) {
      self.removeAttribute();
    }

    function cloneFun(evt) {
      self.cloneAttribute();
    }

    function upFun(evt) {
      self.moveUpAttribute();
    }

    function downFun(evt) {
      self.moveDownAttribute();
    }
  }  

  /**
   *
   */
  descartesJS.Editor.prototype.configListContainer = function() {
    var self = this;

    this.listContainer = document.createElement("div");
    this.listContainer.setAttribute("class", "DescarteslistContainer");
    this.container.appendChild(this.listContainer);

    var appletHeader = document.createElement("div");
    appletHeader.setAttribute("class", "DescartesExtraInfo");
    appletHeader.innerHTML = "&lt;script type='text/javascript' src='http://arquimedes.matem.unam.mx/Descartes5/lib/descartes-min.js'&gt;&lt;/script&gt;";
    this.listContainer.appendChild(appletHeader);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // build the config panel
    this.configPanel = new descartesJS.EditorConfigPanel(this);

    // build the space panel
    this.spacePanel = new descartesJS.EditorSpacePanel(this);

    // build the control panel
    this.controlPanel = new descartesJS.EditorControlPanel(this);

    // build the definition panel
    this.definitionPanel = new descartesJS.EditorDefinitionPanel(this);

    // build the program panel
    this.programPanel = new descartesJS.EditorProgramPanel(this);

    // build the graphic panel
    this.graphicPanel = new descartesJS.EditorGraphicPanel(this);

    // build the graphic3D panel
    this.graphic3DPanel = new descartesJS.EditorGraphic3DPanel(this);

    // build the animation panel
    this.animationPanel = new descartesJS.EditorAnimationPanel(this);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var appletFooter = document.createElement("div");
    appletFooter.setAttribute("class", "DescartesExtraInfo");
    appletFooter.innerHTML = "&lt;/ajs&gt;"
    this.listContainer.appendChild(appletFooter);

    //
    this.wichParamSelected = null;
    if (descartesJS.hasTouchSupport) {
      this.listContainer.addEventListener("touchend", listContainerFun);
    } 
    else {
      this.listContainer.addEventListener("click", listContainerFun);
    }

    function listContainerFun(evt) {
      var actualLi = null;

      if (evt.target.tagName.toLowerCase() == "li") {
        actualLi = evt.target;
      }
      else if (evt.target.parentNode.tagName.toLowerCase() == "li") {
        actualLi = evt.target.parentNode;
      }

      if (actualLi) {
        if (self.wichParamSelected) {
          self.wichParamSelected.className = self.wichParamSelected.className.replace( /(?:^|\s)DescartesElementSelected(?!\S)/g , "");
        }
        self.wichParamSelected = actualLi;
        actualLi.className += " DescartesElementSelected";
      }
    }

  }

  /**
   *
   */
  descartesJS.Editor.prototype.configFooter = function() {
    var self = this;
    var buttonArea = document.createElement("div");
    buttonArea.setAttribute("class", "DescartesButtonsPlace");

    var btnOk = this.newButton("Aceptar");
    var btnCancel = this.newButton("Cancelar");
    buttonArea.appendChild(btnOk);
    buttonArea.appendChild(btnCancel);

    this.container.appendChild(buttonArea);

    if (descartesJS.hasTouchSupport) {
      btnCancel.addEventListener("touchend", hidenFun);
      btnOk.addEventListener("touchend", okFun);
    }
    else {
      btnCancel.addEventListener("click", hidenFun);
      btnOk.addEventListener("click", okFun);
    }

    function okFun(evt) {
      evt.preventDefault();
      this.blur();

      var textContent = self.configPanel.getContent() + self.spacePanel.getContent() + self.controlPanel.getContent() + self.definitionPanel.getContent() + self.programPanel.getContent() + self.graphicPanel.getContent() + self.graphic3DPanel.getContent() + self.animationPanel.getContent();

      var newAppletContent = document.createElement("ajs");
      var attributes = self.parent.applet.attributes;

      var tmpTextContent = textContent.split("\n");
      var tmpAttributes = tmpTextContent[0];

      newAppletContent.innerHTML = tmpAttributes;
      newAppletContent = newAppletContent.firstChild;

      tmpTextContent[0] = "";

      newAppletContent.innerHTML = tmpTextContent.join("\n");

      self.parent.applet.parentNode.replaceChild(newAppletContent, self.parent.applet);
      self.parent.applet = newAppletContent;
      self.parent.children = newAppletContent.getElementsByTagName("param");

      self.parent.width = parseFloat( newAppletContent.getAttribute("width") );
      self.parent.height = parseFloat( newAppletContent.getAttribute("height") );

      self.hide();      
      self.parent.init();
    }

    function hidenFun(evt) {
      evt.preventDefault();
      this.blur();
      self.hide();
    }

  }

  /**
   *
   */
  descartesJS.Editor.prototype.configAddPanel = function() {
    var self = this;

    this.addPanelContainer = document.createElement("div");
    this.addPanelContainer.setAttribute("class", "DescartesEditorContainer");
    this.addPanelContainer.style.background = "rgba(20,20,20,.75)";
    this.container.appendChild(this.addPanelContainer);

    var addPanel = document.createElement("div");
    addPanel.setAttribute("class", "DescarteslistContainer DescartesAddPanel");
    this.addPanelContainer.appendChild(addPanel);

    var listOptionsToAdd = document.createElement("ul");
    addPanel.appendChild(listOptionsToAdd);

    var elementOption;
    for (var i=0, l=optionText.length; i<l; i++) {
      elementOption = document.createElement("li");
      elementOption.setAttribute("style", "-webkit-user-select:none; -moz-user-select:none; user-select:none; cursor:pointer;");
      elementOption.setAttribute("data-index", i);
      elementOption.innerHTML = optionText[i];

      listOptionsToAdd.appendChild(elementOption);
    }

    //
    this.addOptionValue = -1;
    this.previousAddSelected = null;
    if (descartesJS.hasTouchSupport) {
      listOptionsToAdd.addEventListener("touchend", listOptionsFun);
    }
    else {
      listOptionsToAdd.addEventListener("click", listOptionsFun);
    }

    /**
     *
     */
    function listOptionsFun(evt) {
      if (self.previousAddSelected) {
        self.previousAddSelected.className = self.previousAddSelected.className.replace( /(?:^|\s)DescartesElementSelected(?!\S)/g , "");
      }
      self.previousAddSelected = evt.target;
      evt.target.className += " DescartesElementSelected";
      self.addOptionValue = evt.target.getAttribute("data-index");
    }

    //
    var buttonArea = document.createElement("div");
    buttonArea.setAttribute("class", "DescartesButtonsPlace");
    var btnOk = this.newButton("Aceptar");
    var btnCancel = this.newButton("Cancelar");
    buttonArea.appendChild(btnOk);
    buttonArea.appendChild(btnCancel);

    this.addPanelContainer.appendChild(buttonArea);

    if (descartesJS.hasTouchSupport) {
      btnOk.addEventListener("touchend", okFun);
      btnCancel.addEventListener("touchend", hideFun);
    }
    else {
      btnOk.addEventListener("click", okFun);
      btnCancel.addEventListener("click", hideFun);
    }

    function okFun(evt) {
      evt.preventDefault();
      this.blur();
      self.hideAddPanel();
      self.addAttribute();
    }

    function hideFun(evt) {
      evt.preventDefault();
      this.blur();
      self.hideAddPanel(); 
    }

    this.hideAddPanel();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   *
   */
  descartesJS.Editor.prototype.addAttribute = function() {
    var index = parseInt(this.addOptionValue);

    if (index >= 0) {
      if (this.wichParamSelected) {
        this.wichParamSelected.className = this.wichParamSelected.className.replace( /(?:^|\s)DescartesElementSelected(?!\S)/g , "");
      }

      // spaces
      if ( (index >= 0) && (index < 3) ) {
        this.wichParamSelected = this.spacePanel.add(optionType[index]);
      }
      // controls
      else if ( (index >= 3) && (index < 12) ) {
        this.wichParamSelected = this.controlPanel.add(optionType[index]);
      }
      // definitions
      else if ( (index >= 12) && (index < 16) ) {
        this.wichParamSelected = this.definitionPanel.add(optionType[index]);
      }
      // programs
      else if ( (index >= 16) && (index < 19) ) {
        this.wichParamSelected = this.programPanel.add(optionType[index]);
      }
      // graphics
      else if ( (index >= 19) && (index < 31) ) {
        this.wichParamSelected = this.graphicPanel.add(optionType[index]);
      }
      else if ( (index >= 31) && (index < optionType.length-1) ) {
        this.wichParamSelected = this.graphic3DPanel.add(optionType[index]);
      }
      else {
        this.animationPanel.add();
      }

    }

    if (this.wichParamSelected) {
      this.listContainer.scrollTop = this.wichParamSelected.offsetTop;
    }

    this.addOptionValue = -1;
    if (this.previousAddSelected) {
      this.previousAddSelected.className = this.previousAddSelected.className.replace( /(?:^|\s)DescartesElementSelected(?!\S)/g , "");
    }
  }

  /**
   *
   */
  descartesJS.Editor.prototype.removeAttribute = function() {
    var parent;
    if (this.wichParamSelected) {
      parent = this.wichParamSelected.parentNode;

      //
      if (parent == this.configPanel.ulContainer) {
        return;
      }
      // else 
      else if (parent == this.spacePanel.ulContainer) {
        this.spacePanel.remove(parseInt(this.wichParamSelected.getAttribute("data-index")));
      }
      else if (parent == this.controlPanel.ulContainer) {
        this.controlPanel.remove(parseInt(this.wichParamSelected.getAttribute("data-index")));
      }
      else if (parent == this.definitionPanel.ulContainer) {
        this.definitionPanel.remove(parseInt(this.wichParamSelected.getAttribute("data-index")));
      }
      else if (parent == this.programPanel.ulContainer) {
        this.programPanel.remove(parseInt(this.wichParamSelected.getAttribute("data-index")));
      }
      else if (parent == this.graphicPanel.ulContainer) {
        this.graphicPanel.remove(parseInt(this.wichParamSelected.getAttribute("data-index")));
      }
      else if (parent == this.graphic3DPanel.ulContainer) {
        this.graphic3DPanel.remove(parseInt(this.wichParamSelected.getAttribute("data-index")));
      }
      else {
        this.animationPanel.remove();
      }
    }
  }

  /**
   *
   */
  descartesJS.Editor.prototype.cloneAttribute = function() {
    var parent;
    if (this.wichParamSelected) {
      parent = this.wichParamSelected.parentNode;

      //
      // if (parent == this.configPanel.ulContainer) {

      // }
      // else 
      if (parent == this.spacePanel.ulContainer) {
        this.wichParamSelected = this.spacePanel.clone(parseInt(this.wichParamSelected.getAttribute("data-index")));
      }
      else if (parent == this.controlPanel.ulContainer) {
        this.wichParamSelected = this.controlPanel.clone(parseInt(this.wichParamSelected.getAttribute("data-index")));
      }
      else if (parent == this.definitionPanel.ulContainer) {
        this.wichParamSelected = this.definitionPanel.clone(parseInt(this.wichParamSelected.getAttribute("data-index")));
      }
      else if (parent == this.programPanel.ulContainer) {
        this.wichParamSelected = this.programPanel.clone(parseInt(this.wichParamSelected.getAttribute("data-index")));
      }
      else if (parent == this.graphicPanel.ulContainer) {
        this.wichParamSelected = this.graphicPanel.clone(parseInt(this.wichParamSelected.getAttribute("data-index")));
      }
      else if (parent == this.graphic3DPanel.ulContainer) {
        this.wichParamSelected = this.graphic3DPanel.clone(parseInt(this.wichParamSelected.getAttribute("data-index")));
      }
    }
  }

  /**
   *
   */
  descartesJS.Editor.prototype.moveUpAttribute = function() {
    var parent;
    if (this.wichParamSelected) {
      parent = this.wichParamSelected.parentNode;

      //
      // if (parent == this.configPanel.ulContainer) {

      // }
      // else 
      if (parent == this.spacePanel.ulContainer) {
        this.wichParamSelected = this.spacePanel.moveUp(parseInt(this.wichParamSelected.getAttribute("data-index"))) || this.wichParamSelected;
      }
      else if (parent == this.controlPanel.ulContainer) {
        this.wichParamSelected = this.controlPanel.moveUp(parseInt(this.wichParamSelected.getAttribute("data-index"))) || this.wichParamSelected;
      }
      else if (parent == this.definitionPanel.ulContainer) {
        this.wichParamSelected = this.definitionPanel.moveUp(parseInt(this.wichParamSelected.getAttribute("data-index"))) || this.wichParamSelected;
      }
      else if (parent == this.programPanel.ulContainer) {
        this.wichParamSelected = this.programPanel.moveUp(parseInt(this.wichParamSelected.getAttribute("data-index"))) || this.wichParamSelected;
      }
      else if (parent == this.graphicPanel.ulContainer) {
        this.wichParamSelected = this.graphicPanel.moveUp(parseInt(this.wichParamSelected.getAttribute("data-index"))) || this.wichParamSelected;
      }
      else if (parent == this.graphic3DPanel.ulContainer) {
        this.wichParamSelected = this.graphic3DPanel.moveUp(parseInt(this.wichParamSelected.getAttribute("data-index"))) || this.wichParamSelected;
      }
    }
  }

  /**
   *
   */
  descartesJS.Editor.prototype.moveDownAttribute = function() {
    var parent;
    if (this.wichParamSelected) {
      parent = this.wichParamSelected.parentNode;

      //
      // if (parent == this.configPanel.ulContainer) {

      // }
      // else 
      if (parent == this.spacePanel.ulContainer) {
        this.wichParamSelected = this.spacePanel.moveDown(parseInt(this.wichParamSelected.getAttribute("data-index"))) || this.wichParamSelected;
      }
      else if (parent == this.controlPanel.ulContainer) {
        this.wichParamSelected = this.controlPanel.moveDown(parseInt(this.wichParamSelected.getAttribute("data-index"))) || this.wichParamSelected;
      }
      else if (parent == this.definitionPanel.ulContainer) {
        this.wichParamSelected = this.definitionPanel.moveDown(parseInt(this.wichParamSelected.getAttribute("data-index"))) || this.wichParamSelected;
      }
      else if (parent == this.programPanel.ulContainer) {
        this.wichParamSelected = this.programPanel.moveDown(parseInt(this.wichParamSelected.getAttribute("data-index"))) || this.wichParamSelected;
      }
      else if (parent == this.graphicPanel.ulContainer) {
        this.wichParamSelected = this.graphicPanel.moveDown(parseInt(this.wichParamSelected.getAttribute("data-index"))) || this.wichParamSelected;
      }
      else if (parent == this.graphic3DPanel.ulContainer) {
        this.wichParamSelected = this.graphic3DPanel.moveDown(parseInt(this.wichParamSelected.getAttribute("data-index"))) || this.wichParamSelected;
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  

  /**
   *
   */
  descartesJS.Editor.prototype.newButton = function(val) {
    var btn = document.createElement("input");
    btn.setAttribute("class", "DescartesEditorButton");
    btn.setAttribute("type", "submit");
    btn.setAttribute("value", val);
    return btn;
  }

  /**
   *
   */
  descartesJS.Editor.prototype.showAddPanel = function() {
    this.addPanelContainer.style.display = "block";
    this.addPanelContainer.firstChild.style.left = (parseInt(window.innerWidth)-350)/2 +"px";
  }
  /**
   *
   */
  descartesJS.Editor.prototype.hideAddPanel = function() {
    this.addPanelContainer.style.display = "none";
  }

  return descartesJS;
})(descartesJS || {});