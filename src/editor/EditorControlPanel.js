/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  // if (descartesJS.loadLib) { return descartesJS; }

  /**
   * 
   * @constructor 
   * @param 
   */
  descartesJS.EditorControlPanel = function(editor) {
    // call the parent constructor
    descartesJS.EditorGenericPanel.call(this, editor);

    this.params = editor.ctrsParams;

    this.prefix = "C_";
    this.dontShowList = {};

    // this.createPanel();
    this.createPanel2();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of EditorGenericPanel
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.EditorControlPanel, descartesJS.EditorGenericPanel);

  /**
   *
   */
  descartesJS.EditorControlPanel.prototype.createPanel = function() {
    var parentPanel = document.getElementById("tab_3");
    var panel = document.createElement("div");
    panel.setAttribute("class", "DescartesConfigPanel");
    parentPanel.appendChild(panel);

    this.leftPanel = document.createElement("div");
    this.leftPanel.setAttribute("class", "DescartesLeftPanelClass");
    var innerLeftPanel = document.createElement("div");
    this.leftPanel.appendChild(innerLeftPanel);
    panel.appendChild(this.leftPanel);

    this.rightPanel = document.createElement("div");
    this.rightPanel.setAttribute("class", "DescartesRightPanelClass");
    panel.appendChild(this.rightPanel);

    for (var i=0, l=this.params.length; i<l; i++) {
      this.buildobj(this.params[i]);
    }

    // 
    this.configLeftPanel(innerLeftPanel);
    this.configRightPanel(this.rightPanel);
  }

  /**
   *
   */
  descartesJS.EditorControlPanel.prototype.buildobj = function(paramObj) {
    var paramsObj = paramObj.value;
    var paramsObj_i;
    var tmpObj;
    var finalControl = [];
    var tmpValue;
    var type = "spinner";

    // find the type of the control
    for (var i=0, l=paramsObj.length; i<l; i++) {
      paramsObj_i = paramsObj[i];

      if (babel[paramsObj_i[0]] == "type") {
        type = babel[ paramsObj_i[1] ];
        break;
      }
    }

    if (type == "numeric") {
      type = "spinner";
      for (var i=0, l=paramsObj.length; i<l; i++) {
        paramsObj_i = paramsObj[i];

        if (babel[paramsObj_i[0]] == "gui") {
          type = babel[ paramsObj_i[1] ];
          break;
        }
      }
    }

    tmpObj = this.newParamObject(type);

    // copy the parameters
    for (var i=0, l=paramsObj.length; i<l; i++) {
      paramsObj_i = paramsObj[i];
      tmpValue = babel[paramsObj_i[1]] || paramsObj_i[1];

      if ( (tmpValue.charAt(0) == "#") && (tmpValue.length == 7) ) {
        tmpValue = tmpValue.substring(1);
      }

      tmpObj[babel[paramsObj_i[0]]] = tmpValue;
    }

    paramObj.paramObj = tmpObj;
    paramObj.obj = this.toNameValueArray(tmpObj);
  }

  /**
   *
   */
  descartesJS.EditorControlPanel.prototype.configLeftPanel = function(panel) {
    var self = this;
    var list = document.createElement("ul");

    var sublist;

    for (var i=0, l=this.params.length; i<l; i++) {
      var sublist = document.createElement("li");

      sublist.innerHTML = this.params[i].paramObj.id + "  (" + this.params[i].paramObj.type + ")";
      sublist.obj = this.params[i].obj;
      sublist.paramObj = this.params[i].paramObj;

      sublist.addEventListener("click", itemSelected);

      list.appendChild(sublist);
    }

    function itemSelected(evt) {
      var type = this.paramObj.type;
      var control = this.obj;

      self.hideAllAttributes();
      self.showAttributes(control);
      self.fillAttributes(control);
      descartesJS.showHTML(self.configRightSubPanel);
    }

    panel.appendChild(list);
  }

  /**
   *
   */
  descartesJS.EditorControlPanel.prototype.configRightPanel = function(panel) {
    this.configRightSubPanel = document.createElement("div");
    panel.appendChild(this.configRightSubPanel);

    this.attributes = {};

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // id
    this.attributes.id = this.newLabelAndInput({name: "id", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // gui
    this.attributes.gui = this.newLabelAndMenu({name: "gui", value: "spinner"}, this.configRightSubPanel, ["spinner", "textfield", "menu", "scrollbar", "button"]);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // region
    this.attributes.region = this.newLabelAndMenu({name: "region", value: "south"}, this.configRightSubPanel, ["south", "north", "east", "west", "external", "interior", "scenario"]);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // params
    this.attributes.params = this.newLabelAndInput({name: "params", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // name
    this.attributes.name = this.newLabelAndInput({name: "name", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // expresion
    this.attributes.expresion = this.newLabelAndInput({name: "expresion", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // value
    this.attributes.value = this.newLabelAndInput({name: "value", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // incr
    this.attributes.incr = this.newLabelAndInput({name: "incr", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // min
    this.attributes.min = this.newLabelAndInput({name: "min", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // max
    this.attributes.max = this.newLabelAndInput({name: "max", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // discrete
    this.attributes.discrete = this.newLabelAndCheckbox({name: "discrete", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // decimals
    this.attributes.decimals = this.newLabelAndInput({name: "decimals", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // fixed
    this.attributes.fixed = this.newLabelAndCheckbox({name: "fixed", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // exponentialif
    this.attributes.exponentialif = this.newLabelAndInput({name: "exponentialif", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // visible
    this.attributes.visible = this.newLabelAndInput({name: "visible", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // action
    this.attributes.action = this.newLabelAndMenu({name: "action", value: ""}, this.configRightSubPanel, ["", "calculate", "init", "clear", "animate", "openURL", "openScene", "playAudio"]);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // parameter
    this.attributes.parameter = this.newLabelAndInput({name: "parameter", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // drawif
    this.attributes.drawif = this.newLabelAndInput({name: "drawif", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // activeif
    this.attributes.activeif = this.newLabelAndInput({name: "activeif", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // onlyText
    this.attributes.onlyText = this.newLabelAndCheckbox({name: "onlyText", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // options
    this.attributes.options = this.newLabelAndInput({name: "options", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // color
    this.attributes.color = this.newLabelAndInput({name: "color", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // colorInt
    this.attributes.activeif = this.newLabelAndInput({name: "colorInt", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // bold
    this.attributes.bold = this.newLabelAndCheckbox({name: "bold", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // italics
    this.attributes.italics = this.newLabelAndCheckbox({name: "italics", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // underlined
    this.attributes.underlined = this.newLabelAndCheckbox({name: "underlined", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // font_size
    this.attributes.font_size = this.newLabelAndInput({name: "font_size", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // image
    this.attributes.image = this.newLabelAndInput({name: "image", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // size
    this.attributes.size = this.newLabelAndInput({name: "size", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constraint
    this.attributes.constraint = this.newLabelAndInput({name: "constraint", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // text
    this.attributes.text = this.newLabelAndInput({name: "text", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // file
    this.attributes.file = this.newLabelAndInput({name: "file", value: ""}, this.configRightSubPanel);

    descartesJS.hideHTML(this.configRightSubPanel);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  descartesJS.EditorControlPanel.prototype.newParamObject = function(type) {
    var tmpObj;

    // if the type is spinner
    if (type == "spinner") {
      tmpObj = { id:         "n1",
                 type:       "numeric",
                 gui:        "spinner",
                 region:     "south",
                 space:      "E0",
                 name:       "",
                 expresion:  "(0,0,100,23)",
                 value:      "0",
                 incr:       "0.1",
                 min:        "",
                 max:        "",
                 discrete:   "false",
                 decimals:   "2",
                 fixed:      "true",
                 exponentialif: "",
                 visible:    "true",
                 action:     "",
                 parameter:  "",
                 drawif:     "",
                 activeif:   ""
                 // evaluate:   "false",
                 // answer:     "",
                 // weight:     ""
      };
    }
    // if the type is textfield
    else if (type == "textfield") {
      tmpObj = { id:         "n1",
                 type:       "numeric",
                 gui:        "textfield",
                 onlyText:   "false",
                 region:     "south",
                 space:      "E0",
                 name:       "",
                 expresion:  "(0,0,100,23)",
                 value:      "0",
                 incr:       "0.1",
                 min:        "",
                 max:        "",
                 discrete:   "false",
                 decimals:   "2",
                 fixed:      "true",
                 exponentialif: "",
                 visible:    "true",
                 action:     "",
                 parameter:  "",
                 drawif:     "",
                 activeif:   "",
                 evaluate:   "false",
                 answer:     ""
                 // weight:     ""
      };
    }
    // if the type is menu
    else if (type == "menu") {
      tmpObj = { id:         "n1",
                 type:       "numeric",
                 gui:        "menu",
                 region:     "south",
                 space:      "E0",
                 name:       "",
                 expresion:  "(0,0,100,23)",
                 value:      "0",
                 decimals:   "2",
                 fixed:      "true",
                 exponentialif: "",
                 visible:    "true",
                 options:    "",
                 action:     "",
                 parameter:  "",
                 drawif:     "",
                 activeif:   ""
                 // evaluate:   "false",
                 // answer:     "",
                 // weight:     ""
      };
    }
    // if the type is scrollbar
    else if (type == "scrollbar") {
      tmpObj = { id:         "n1",
                 type:       "numeric",
                 gui:        "scrollbar",
                 region:     "south",
                 space:      "E0",
                 name:       "",
                 expresion:  "(0,0,100,23)",
                 value:      "0",
                 incr:       "0.1",
                 min:        "0",
                 max:        "100",
                 discrete:   "false",
                 decimals:   "2",
                 fixed:      "true",
                 exponentialif: "",
                 visible:    "true",
                 action:     "",
                 parameter:  "",
                 drawif:     "",
                 activeif:   ""
                 // evaluate:   "false",
                 // answer:     "",
                 // weight:     ""
      };
    }
    // if the type is button
    else if (type == "button") {
      tmpObj = { id:         "n1",
                 gui:        "button",
                 type:       "numeric",
                 region:     "south",
                 space:      "E0",
                 name:       "",
                 expresion:  "(0,0,100,23)",
                 value:      "0",
                 visible:    "true",
                 color:      "222222",
                 colorInt:   "f0f8ff",
                 bold:       "false",
                 italics:    "false",
                 underlined: "false",
                 font_size:  "12",
                 image:      "",
                 action:     "",
                 parameter:  "",
                 drawif:     "",
                 activeif:   ""
      };
    }
    // if the type is graphic
    else if (type == "graphic") {
      tmpObj = { id:         "g1",
                 type:       "graphic",
                 space:      "E0",
                 color:      "222222",
                 colorInt:   "f0f8ff",
                 size:       "4",
                 expresion:  "(0,0)",
                 constraint: "",
                 image:      "",
                 drawif:     "",
                 activeif:   ""
      };           
    }
    // if the type is text
    else if (type == "text") {
      tmpObj = { id:         "t1",
                 type:       "text",
                 space:      "E0",
                 expresion:  "(0,0)",
                 text:       "",
                 answer:     "",
                 drawif:     "",
                 activeif:   ""
      };
    }
    // if the type is audio
    else if (type == "audio") {
      tmpObj = { id:         "a1",
                 type:       "audio",
                 space:      "E0",
                 expresion:  "(0,0)",
                 drawif:     "",
                 file:       ""
      };
    }
    // if the type is video
    else {
      tmpObj = { id:         "v1",
                 type:       "video",
                 space:      "E0",
                 expresion:  "(0,0)",
                 drawif:     "",
                 file:       ""
      };
    }

    return tmpObj;
  }

  return descartesJS;
})(descartesJS || {});