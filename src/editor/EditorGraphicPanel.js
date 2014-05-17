/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * 
   * @constructor 
   * @param 
   */
  descartesJS.EditorGraphicPanel = function(editor) {
    // call the parent constructor
    descartesJS.EditorGenericPanel.call(this, editor);

    this.params = editor.graphParams;

    this.prefix = "G_";
    this.dontShowList = { useFamily: true };

    // this.createPanel();
    this.createPanel2();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of EditorGenericPanel
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.EditorGraphicPanel, descartesJS.EditorGenericPanel);

  /**
   *
   */
  descartesJS.EditorGraphicPanel.prototype.createPanel = function() {
    var parentPanel = document.getElementById("tab_6");
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
  descartesJS.EditorGraphicPanel.prototype.buildobj = function(paramObj) {
    var paramsObj = paramObj.value;
    var paramsObj_i;
    var tmpObj;
    var tmpValue;
    var type = "equation";

    // find the type of the graphic
    for (var i=0, l=paramsObj.length; i<l; i++) {
      paramsObj_i = paramsObj[i];

      if (babel[paramsObj_i[0]] == "type") {
        type = babel[ paramsObj_i[1] ];
        break;
      }
    }

    tmpObj = this.newParamObject(type);

    var family = "";
    var parameter = "t";

    // find the family and the parameter name
    for (var i=0, l=paramsObj.length; i<l; i++) {
      paramsObj_i = paramsObj[i];
      tmpValue = paramsObj_i[1];

      // family
      if (babel[paramsObj_i[0]] == "family") {
        family = tmpValue;
      }

      // parameter
      if (babel[paramsObj_i[0]] == "parameter") {
        parameter = tmpValue;
      }
    }

    // copy the parameters
    for (var i=0, l=paramsObj.length; i<l; i++) {
      paramsObj_i = paramsObj[i];
      tmpValue = babel[paramsObj_i[1]] || paramsObj_i[1] || "";

      if ( (tmpValue.charAt(0) == "#") && (tmpValue.length == 7) ) {
        tmpValue = tmpValue.substring(1);
      }

      // checkbox for family
      if (babel[paramsObj_i[0]] == "family") {
        tmpObj.useFamily = "true";
      }
      // family interval and steps
      if ((family != "") && (babel[paramsObj_i[0].substring(family.length + 1)])) {
        if (paramsObj_i[0].substring(0, family.length) == family) {
          if (babel[paramsObj_i[0].substring(family.length + 1)] == "interval") {
            tmpObj.family_interval = tmpValue;
            continue;
          }
          if (babel[paramsObj_i[0].substring(family.length + 1)] == "steps") {
            tmpObj.family_steps = tmpValue;
            continue;
          }          
        }
      }

      // parameter interval and steps
      if ((parameter != "") && (babel[paramsObj_i[0].substring(parameter.length + 1)])) {
        if (paramsObj_i[0].substring(0, parameter.length) == parameter) {
          if (babel[paramsObj_i[0].substring(parameter.length + 1)] == "interval") {
            tmpObj.parameter_interval = tmpValue;
            continue;
          }
          if (babel[paramsObj_i[0].substring(parameter.length + 1)] == "steps") {
            tmpObj.parameter_steps = tmpValue;
            continue;
          }          
        }
      }

      tmpObj[babel[paramsObj_i[0]]] = tmpValue;
    }

    paramObj.paramObj = tmpObj;
    paramObj.obj = this.toNameValueArray(tmpObj);
  }

  /**
   *
   */
  descartesJS.EditorGraphicPanel.prototype.configLeftPanel = function(panel) {
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
      var definition = this.obj;

      self.hideAllAttributes();
      self.showAttributes(definition);
      self.fillAttributes(definition);
      descartesJS.showHTML(self.configRightSubPanel);
    }

    panel.appendChild(list);
  }

  /**
   *
   */
  descartesJS.EditorGraphicPanel.prototype.configRightPanel = function(panel) {
    this.configRightSubPanel = document.createElement("div");
    panel.appendChild(this.configRightSubPanel);

    this.attributes = {};

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // id
    // this.attributes.id = this.newLabelAndInput({name: "id", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // space
    this.attributes.space = this.newLabelAndInput({name: "space", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // background
    this.attributes.background = this.newLabelAndCheckbox({name: "background", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // color
    this.attributes.color = this.newLabelAndInput({name: "color", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // drawif
    this.attributes.drawif = this.newLabelAndInput({name: "drawif", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // abs_coord
    this.attributes.abs_coord = this.newLabelAndCheckbox({name: "abs_coord", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // expresion
    this.attributes.expresion = this.newLabelAndInput({name: "expresion", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // trace
    this.attributes.trace = this.newLabelAndCheckbox({name: "trace", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // parameter
    this.attributes.parameter = this.newLabelAndInput({name: "parameter", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // parameter_interval
    this.attributes.parameter_interval = this.newLabelAndInput({name: "parameter_interval", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // parameter_steps
    this.attributes.parameter_steps = this.newLabelAndInput({name: "parameter_steps", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // useFamily
    this.attributes.useFamily = this.newLabelAndCheckbox({name: "useFamily", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // family
    this.attributes.family = this.newLabelAndInput({name: "family", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // family_interval
    this.attributes.family_interval = this.newLabelAndInput({name: "family_interval", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // family_steps
    this.attributes.family_steps = this.newLabelAndInput({name: "family_steps", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // fillP
    this.attributes.fillP = this.newLabelAndInput({name: "fillP", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // fillM
    this.attributes.fillM = this.newLabelAndInput({name: "fillM", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // width
    this.attributes.width = this.newLabelAndInput({name: "width", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // visible
    this.attributes.visible = this.newLabelAndCheckbox({name: "visible", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // editable
    this.attributes.editable = this.newLabelAndCheckbox({name: "editable", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // fill
    this.attributes.fill = this.newLabelAndInput({name: "fill", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // size
    this.attributes.size = this.newLabelAndInput({name: "size", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // range
    this.attributes.range = this.newLabelAndInput({name: "range", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // text
    this.attributes.text = this.newLabelAndInput({name: "text", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // decimals
    this.attributes.decimals = this.newLabelAndInput({name: "decimals", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // fixed
    this.attributes.fixed = this.newLabelAndCheckbox({name: "fixed", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // spear
    this.attributes.spear = this.newLabelAndInput({name: "spear", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // arrow
    this.attributes.arrow = this.newLabelAndInput({name: "arrow", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // center
    this.attributes.center = this.newLabelAndInput({name: "center", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // radius
    this.attributes.radius = this.newLabelAndInput({name: "radius", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // init
    this.attributes.init = this.newLabelAndInput({name: "init", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // end
    this.attributes.end = this.newLabelAndInput({name: "end", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // vectors
    this.attributes.vectors = this.newLabelAndCheckbox({name: "vectors", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // border
    this.attributes.border = this.newLabelAndInput({name: "border", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // file
    this.attributes.file = this.newLabelAndInput({name: "file", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // opacity
    this.attributes.opacity = this.newLabelAndInput({name: "opacity", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // inirot
    this.attributes.inirot = this.newLabelAndInput({name: "inirot", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // inipos
    this.attributes.inipos = this.newLabelAndInput({name: "inipos", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // name
    this.attributes.name = this.newLabelAndInput({name: "name", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // info
    this.attributes.info = this.newLabelAndInput({name: "info", value: ""}, this.configRightSubPanel);

    descartesJS.hideHTML(this.configRightSubPanel);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  descartesJS.EditorGraphicPanel.prototype.newParamObject = function(type) {
    var tmpObj;
    
    // if the type is equation
    if (type == "equation") {
      tmpObj = { space:           "E0",
                 type:            "equation",
                 background:      "false",
                 color:           "20303a",
                 drawif:          "",
                 abs_coord:       "false",
                 expresion:       "y=x",
                 trace:           "false",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 fillP:           "",
                 fillM:           "",
                 width:           "1",
                 visible:         "false",
                 editable:        "false",
                 info:            ""
      };
    }
    // if the type is curve
    else if (type == "curve") {
      tmpObj = { space:           "E0",
                 type:            "curve",
                 background:      "false",
                 color:           "20303a",
                 drawif:          "",
                 abs_coord:       "false",
                 expresion:       "(t,t)",
                 trace:           "false",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 parameter:       "t",
                 parameter_interval: "[0,1]",
                 parameter_steps: "8",
                 fill:            "",
                 width:           "1",
                 visible:         "false",
                 editable:        "false",
                 info:            ""
      };
    }
    // if the type is sequence
    else if (type == "sequence") {
      tmpObj = { space:           "E0",
                 type:            "sequence",
                 background:      "false",
                 color:           "20303a",
                 drawif:          "",
                 abs_coord:       "false",
                 expresion:       "(n,1/n)",
                 trace:           "false",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 size:            "2",
                 visible:         "false",
                 editable:        "false",
                 range:           "[1,100]",
                 info:            ""
      };
    }
    // if the type is point
    else if (type == "point") {
      tmpObj = { space:           "E0",
                 type:            "point",
                 background:      "false",
                 color:           "20303a",
                 drawif:          "",
                 abs_coord:       "false",
                 expresion:       "(0,0)",
                 trace:           "false",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 text:            "",
                 decimals:        "2",
                 fixed:           "true",
                 size:            "2",
                 font:            "Monospaced,PLAIN,15",
                 info:            ""
      };
    }
    // if the type is segment
    else if (type == "segment") {
      tmpObj = { space:           "E0",
                 type:            "segment",
                 background:      "false",
                 color:           "20303a",
                 drawif:          "",
                 abs_coord:       "false",
                 expresion:       "(0,0)(1,1)",
                 trace:           "false",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 text:            "",
                 decimals:        "2",
                 fixed:           "true",
                 size:            "2",
                 width:           "1",
                 font:            "Monospaced,PLAIN,15",
                 info:            ""
      };
    }
    // if the type is arrow
    else if (type == "arrow") {
      tmpObj = { space:           "E0",
                 type:            "arrow",
                 background:      "false",
                 color:           "20303a",
                 drawif:          "",
                 abs_coord:       "false",
                 expresion:       "(0,0)(1,1)",
                 trace:           "false",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 text:            "",
                 decimals:        "2",
                 fixed:           "true",
                 width:           "5",
                 size:            "",
                 spear:           "8",
                 arrow:           "ee0022",
                 font:            "Monospaced,PLAIN,15",
                 info:            ""
      };
    }
    // if the type is polygon
    else if (type == "polygon") {
      tmpObj = { space:           "E0",
                 type:            "polygon",
                 background:      "false",
                 color:           "20303a",
                 drawif:          "",
                 abs_coord:       "false",
                 expresion:       "(0,0)(1,1)(2,-1)",
                 trace:           "false",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 fill:            "",
                 width:           "1",
                 info:            ""
      };
    }
    // if the type is arc
    else if (type == "arc") {
      tmpObj = { space:           "E0",
                 type:            "arc",
                 background:      "false",
                 color:           "20303a",
                 drawif:          "",
                 abs_coord:       "false",
                 center:          "(0,0)",
                 radius:          "1",
                 init:            "0",
                 end:             "90",
                 vectors:         "false",
                 trace:           "false",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 text:            "",
                 decimals:        "2",
                 fixed:           "true",
                 fill:            "",
                 width:           "1",
                 font:            "Monospaced,PLAIN,15",
                 info:            ""
      };
    }
    // if the type is fill
    else if (type == "fill") {
      tmpObj = { space:           "E0",
                 type:            "fill",
                 background:      "false",
                 color:           "20303a",
                 drawif:          "",
                 abs_coord:       "false",
                 expresion:       "(0,0)",
                 trace:           "false",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 info:            ""
      };
    }
    // if the type is text
    else if (type == "text") {
      tmpObj = { space:           "E0",
                 type:            "text",
                 background:      "false",
                 color:           "20303a",
                 drawif:          "",
                 expresion:       "[20,20]",
                 trace:           "false",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 text:            "",
                 decimals:        "2",
                 fixed:           "true",
                 width:           "1",
                 border:          "",
                 font:            "Monospaced,PLAIN,15",
                 info:            ""
      };
    }
    // if the type is image
    else if (type == "image") {
      tmpObj = { space:           "E0",
                 type:            "image",
                 background:      "false",
                 drawif:          "",
                 abs_coord:       "false",
                 expresion:       "(0,0)",
                 trace:           "false",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 file:            "",
                 inirot:          "0",
                 opacity:         "0",
                 info:            ""
      };
    }
    // if the type is macro
    else {
      tmpObj = { space:           "E0",
                 type:            "macro",
                 background:      "false",
                 drawif:          "",
                 abs_coord:       "false",
                 name:            "mac1",
                 expresion:       "",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 inirot:          "0",
                 inipos:          "[0,0]",
                 info:            ""
      };
    }

    return tmpObj;
  }

  return descartesJS;
})(descartesJS || {});