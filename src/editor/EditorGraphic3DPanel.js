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
  descartesJS.EditorGraphic3DPanel = function(editor) {
    // call the parent constructor
    descartesJS.EditorGenericPanel.call(this, editor);

    this.params = editor.graph3DParams;

    this.prefix = "S_";
    this.dontShowList = { useFamily: true };

    // this.createPanel();
    this.createPanel2();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of EditorGenericPanel
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.EditorGraphic3DPanel, descartesJS.EditorGenericPanel);

  /**
   *
   */
  descartesJS.EditorGraphic3DPanel.prototype.createPanel = function() {
    var parentPanel = document.getElementById("tab_7");
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
  descartesJS.EditorGraphic3DPanel.prototype.buildobj = function(paramObj) {
    var paramsObj = paramObj.value;
    var paramsObj_i;
    var tmpObj;
    var tmpValue;
    var type = "point";

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

    // find the family
    for (var i=0, l=paramsObj.length; i<l; i++) {
      paramsObj_i = paramsObj[i];
      tmpValue = paramsObj_i[1];

      // family
      if (babel[paramsObj_i[0]] == "family") {
        family = tmpValue;
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

      tmpObj[babel[paramsObj_i[0]]] = tmpValue;
    }

    paramObj.paramObj = tmpObj;
    paramObj.obj = this.toNameValueArray(tmpObj);
  }

  /**
   *
   */
  descartesJS.EditorGraphic3DPanel.prototype.configLeftPanel = function(panel) {
    var self = this;
    var list = document.createElement("ul");

    var sublist;

    for (var i=0, l=this.params.length; i<l; i++) {
      var sublist = document.createElement("li");

      sublist.innerHTML = this.params[i].paramObj.name + "  (" + this.params[i].paramObj.type + ")";
      sublist.obj = this.params[i].obj;
      sublist.paramObj = this.params[i].paramObj;

      sublist.addEventListener("click", itemSelected);

      list.appendChild(sublist);
    }

    function itemSelected(evt) {
      var type = this.paramObj.type;
      var Graphic3D = this.obj;

      self.hideAllAttributes();
      self.showAttributes(Graphic3D);
      self.fillAttributes(Graphic3D);
      descartesJS.showHTML(self.configRightSubPanel);
    }

    panel.appendChild(list);
  }

  /**
   *
   */
  descartesJS.EditorGraphic3DPanel.prototype.configRightPanel = function(panel) {
    this.configRightSubPanel = document.createElement("div");
    panel.appendChild(this.configRightSubPanel);

    this.attributes = {};

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // name
    this.attributes.name = this.newLabelAndInput({name: "name", value: ""}, this.configRightSubPanel);

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
    // backcolor
    this.attributes.backcolor = this.newLabelAndInput({name: "backcolor", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // drawif
    this.attributes.drawif = this.newLabelAndInput({name: "drawif", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // expresion
    this.attributes.expresion = this.newLabelAndInput({name: "expresion", value: ""}, this.configRightSubPanel);

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
    // inirot
    this.attributes.inirot = this.newLabelAndInput({name: "inirot", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // inipos
    this.attributes.inipos = this.newLabelAndInput({name: "inipos", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // endrot
    this.attributes.endrot = this.newLabelAndInput({name: "endrot", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // endpos
    this.attributes.endpos = this.newLabelAndInput({name: "endpos", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // split
    this.attributes.split = this.newLabelAndCheckbox({name: "split", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // edges
    this.attributes.edges = this.newLabelAndCheckbox({name: "edges", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // model
    this.attributes.model = this.newLabelAndMenu({name: "model", value: "metal"}, this.configRightSubPanel, ["color", "light", "metal", "wire"]);

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
    // width
    this.attributes.width = this.newLabelAndInput({name: "width", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // length
    this.attributes.length = this.newLabelAndInput({name: "length", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // height
    this.attributes.height = this.newLabelAndInput({name: "height", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Nu
    this.attributes.Nu = this.newLabelAndInput({name: "Nu", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Nv
    this.attributes.Nv = this.newLabelAndInput({name: "Nv", value: ""}, this.configRightSubPanel);

    descartesJS.hideHTML(this.configRightSubPanel);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  descartesJS.EditorGraphic3DPanel.prototype.newParamObject = function(type) {
    var tmpObj;

    // if the type is point
    if (type == "point") {
      tmpObj = { name:            "",
                 space:           "E0",
                 type:            "point",
                 background:      "false",
                 color:           "eeffaa",
                 backcolor:       "6090a0",
                 drawif:          "",
                 expresion:       "(0,0,0)",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 inirot:          "(0,0,0)",
                 inipos:          "(0,0,0)",
                 endrot:          "(0,0,0)",
                 endpos:          "(0,0,0)",
                 split:           "false",
                 text:            "",
                 decimals:        "2",
                 fixed:           "true",
                 width:           "1"
      };

    }
    // if the type is segment, polygon, curve
    else if ( (type == "segment") || (type == "polygon") || (type == "curve") ) {
      tmpObj = { name:            "",
                 space:           "E0",
                 type:            type,
                 background:      "false",
                 color:           "eeffaa",
                 drawif:          "",
                 expresion:       "",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 inirot:          "(0,0,0)",
                 inipos:          "(0,0,0)",
                 endrot:          "(0,0,0)",
                 endpos:          "(0,0,0)",
                 split:           "false",
                 width:           "1",
                 Nu:              "7"
      };

      if (type == "segment") {
        tmpObj.expresion = "(0,0,0)(1,1,1)";
      }
      else if (type == "polygon") {
        tmpObj.expresion = "(0,0,0)(1,0,0)(1,1,0)(1,1,1)";
      }
      else {
        tmpObj.expresion = "x=cos(4*pi*u) y=sen(4*pi*u) z=2*u-1";
      }
    }
    // if the type is triangle
    else if ( (type == "triangle") || (type == "face") ) {
      tmpObj = { name:            "",
                 space:           "E0",
                 type:            type,
                 background:      "false",
                 color:           "eeffaa",
                 backcolor:       "6090a0",
                 drawif:          "",
                 expresion:       "",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 inirot:          "(0,0,0)",
                 inipos:          "(0,0,0)",
                 endrot:          "(0,0,0)",
                 endpos:          "(0,0,0)",
                 split:           "false",
                 edges:           "false",
                 model:           "metal"
      };

      if (type == "triangle") {
        tmpObj.expresion = "(1,0,0)(0,1,0)(0,0,1)";
      }
      else {
        tmpObj.expresion = "(0,0)(0,1)(1,1)";
      }      
    }
    // if the type is polireg
    else if (type == "polireg") {
      tmpObj = { name:            "",
                 space:           "E0",
                 type:            "polireg",
                 background:      "false",
                 color:           "eeffaa",
                 backcolor:       "6090a0",
                 drawif:          "",
                 expresion:       "Polireg",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 inirot:          "(0,0,0)",
                 inipos:          "(0,0,0)",
                 endrot:          "(0,0,0)",
                 endpos:          "(0,0,0)",
                 split:           "false",
                 edges:           "false",
                 model:           "metal",
                 width:           "2",
                 length:          "2",
                 Nu:              "7"
      };
    }
    // if the type is surface
    else if (type == "surface") {
      tmpObj = { name:            "",
                 space:           "E0",
                 type:            "surface",
                 background:      "false",
                 color:           "eeffaa",
                 backcolor:       "6090a0",
                 drawif:          "",
                 expresion:       "x=2*u-1 y=2*v-1 z=x^2-y^2",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 inirot:          "(0,0,0)",
                 inipos:          "(0,0,0)",
                 endrot:          "(0,0,0)",
                 endpos:          "(0,0,0)",
                 split:           "false",
                 edges:           "false",
                 model:           "metal",
                 Nu:              "7",
                 Nv:              "7"
      };
    }
    // if the type is text
    else if (type == "text") {
      tmpObj = { name:            "",
                 space:           "E0",
                 type:            "face",
                 background:      "false",
                 color:           "eeffaa",
                 drawif:          "",
                 expresion:       "[20,20]",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 inirot:          "(0,0,0)",
                 inipos:          "(0,0,0)",
                 text:            "",
                 decimals:        "2",
                 fixed:           "true"
      };
    }
    // if the type is box
    else if (type == "box") {
      tmpObj = { name:            "",
                 space:           "E0",
                 type:            "box",
                 background:      "false",
                 color:           "eeffaa",
                 backcolor:       "6090a0",
                 drawif:          "",
                 expresion:       "Paralelep\u00edpedo",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 inirot:          "(0,0,0)",
                 inipos:          "(0,0,0)",
                 endrot:          "(0,0,0)",
                 endpos:          "(0,0,0)",
                 split:           "false",
                 edges:           "false",
                 model:           "metal",
                 width:           "2",
                 length:          "2",
                 height:          "2"
      };
    }
    // if the type is cube, tetrahedron, octahedron, dodecahedron, icosahedron
    else if ( (type == "cube") || (type == "tetrahedron") || (type == "octahedron") || (type == "dodecahedron") || (type == "icosahedron") ) {
      tmpObj = { name:            "",
                 space:           "E0",
                 type:            type,
                 background:      "false",
                 color:           "eeffaa",
                 backcolor:       "6090a0",
                 drawif:          "",
                 expresion:       "",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 inirot:          "(0,0,0)",
                 inipos:          "(0,0,0)",
                 endrot:          "(0,0,0)",
                 endpos:          "(0,0,0)",
                 split:           "false",
                 edges:           "false",
                 model:           "metal",
                 width:           "2"
      };

      if (type == "cube") {
        tmpObj.expresion = "Cubo";
      }
      else if (type == "tetrahedron") {
        tmpObj.expresion = "Tetraedro";
      }
      else if (type == "octahedron") {
        tmpObj.expresion = "Octaedro";
      }
      else if (type == "dodecahedron") {
        tmpObj.expresion = "Dodecaedro";
      }
      else {
        tmpObj.expresion = "Icosaedro";
      }

    }
    // if the type is sphere
    else if (type == "sphere") {
      tmpObj = { name:            "",
                 space:           "E0",
                 type:            "sphere",
                 background:      "false",
                 color:           "eeffaa",
                 backcolor:       "6090a0",
                 drawif:          "",
                 expresion:       "Esfera",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 inirot:          "(0,0,0)",
                 inipos:          "(0,0,0)",
                 endrot:          "(0,0,0)",
                 endpos:          "(0,0,0)",
                 split:           "false",
                 edges:           "false",
                 model:           "metal",
                 width:           "2",
                 Nu:              "7",
                 Nv:              "7"
      };
    }
    // if the type is ellipsoid, cone, cylinder
    else if ( (type == "ellipsoid") || (type == "cone") || (type == "cylinder") ) {
      tmpObj = { name:            "",
                 space:           "E0",
                 type:            type,
                 background:      "false",
                 color:           "eeffaa",
                 backcolor:       "6090a0",
                 drawif:          "",
                 expresion:       "",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 inirot:          "(0,0,0)",
                 inipos:          "(0,0,0)",
                 endrot:          "(0,0,0)",
                 endpos:          "(0,0,0)",
                 split:           "false",
                 edges:           "false",
                 model:           "metal",
                 width:           "2",
                 length:          "2",
                 height:          "2",
                 Nu:              "7",
                 Nv:              "7"
      };

      if (type == "ellipsoid") {
        tmpObj.expresion = "Elipsoide";
      }
      else if (type == "cone") {
        tmpObj.expresion = "Cono";
      }
      else {
        tmpObj.expresion = "Cilindro";
      }
    }
    // if the type is macro
    else {
      tmpObj = { name:            "",
                 space:           "E0",
                 type:            "macro",
                 background:      "false",
                 drawif:          "",
                 expresion:       "mi_macro",
                 useFamily:       "false",
                 family:          "",
                 family_interval: "",
                 family_steps:    "",
                 inirot:          "(0,0,0)",
                 inipos:          "(0,0,0)",
                 endrot:          "(0,0,0)",
                 endpos:          "(0,0,0)"
      };
    }

    return tmpObj;
  }

  return descartesJS;
})(descartesJS || {});