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
  descartesJS.EditorSpacePanel = function(editor) {
    // call the parent constructor
    descartesJS.EditorGenericPanel.call(this, editor);

    this.params = editor.spaceParams;
    this.prefix = "E_";
    this.dontShowList = {};

    // this.createPanel();
    this.createPanel2();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of EditorGenericPanel
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.EditorSpacePanel, descartesJS.EditorGenericPanel);

  /**
   *
   */
  descartesJS.EditorSpacePanel.prototype.createPanel = function() {
    var parentPanel = document.getElementById("tab_2");
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
  descartesJS.EditorSpacePanel.prototype.buildobj = function(paramObj) {
    var paramsObj = paramObj.value;
    var paramsObj_i;
    var tmpObj;
    var tmpValue;
    var type = "R2";

    // find the type of the space
    for (var i=0, l=paramsObj.length; i<l; i++) {
      paramsObj_i = paramsObj[i];

      if (babel[paramsObj_i[0]] == "type") {
        type = paramsObj_i[1];
        break;
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
  descartesJS.EditorSpacePanel.prototype.configLeftPanel = function(panel) {
    var self = this;
    var list = document.createElement("ul");

    var sublist;

    for (var i=0, l=this.params.length; i<l; i++) {
      var sublist = document.createElement("li");

      sublist.innerHTML = this.params[i].paramObj.id + "  (space" + this.params[i].paramObj.type + ")";
      sublist.obj = this.params[i].obj;
      sublist.paramObj = this.params[i].paramObj;

      sublist.addEventListener("click", itemSelected);

      list.appendChild(sublist);
    }

    function itemSelected(evt) {
      var type = this.paramObj.type;
      var space = this.obj;

      self.hideAllAttributes();
      self.showAttributes(space);
      self.fillAttributes(space);
      descartesJS.showHTML(self.configRightSubPanel);
    }

    panel.appendChild(list);
  }

  /**
   *
   */
  descartesJS.EditorSpacePanel.prototype.configRightPanel = function(panel) {
    this.configRightSubPanel = document.createElement("div");
    panel.appendChild(this.configRightSubPanel);

    this.attributes = {};

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // id
    this.attributes.id = this.newLabelAndInput({name: "id", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // fieldset
    // var sizeFieldSet = descartesJS.newFieldSet(this.configRightSubPanel, "position and dimension");

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // x
    this.attributes.x = this.newLabelAndInput({name: "x", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // y
    this.attributes.y = this.newLabelAndInput({name: "y", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // width
    this.attributes.width = this.newLabelAndInput({name: "width", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // height
    this.attributes.height = this.newLabelAndInput({name: "height", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // drawif
    this.attributes.drawif = this.newLabelAndInput({name: "drawif", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // R2 and R3
    // fixed
    this.attributes.fixed = this.newLabelAndCheckbox({name: "fixed", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // R2 and R3
    // scale
    this.attributes.scale = this.newLabelAndInput({name: "scale", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // R2 and R3
    // O.x
    this.attributes["O.x"] = this.newLabelAndInput({name: "O.x", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // R2 and R3
    // O.y
    this.attributes["O.y"] = this.newLabelAndInput({name: "O.y", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // image
    this.attributes.image = this.newLabelAndInput({name: "image", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // bg_display
    this.attributes.bg_display = this.newLabelAndMenu({name: "bg_display", value: "topleft"}, this.configRightSubPanel, ["topleft", "stretch", "patch", "center"]);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // background
    this.attributes.background = this.newLabelAndInput({name: "background", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // only HTMLIFrame
    // file
    this.attributes.file = this.newLabelAndInput({name: "file", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // only R2
    // net
    this.attributes.net = this.newLabelAndInput({name: "net", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // only R2
    // net10
    this.attributes.net10 = this.newLabelAndInput({name: "net10", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // only R2
    // axes
    this.attributes.axes = this.newLabelAndInput({name: "axes", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // only R2
    // text
    this.attributes.text = this.newLabelAndInput({name: "text", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // only R2
    // numbers
    this.attributes.numbers = this.newLabelAndCheckbox({name: "numbers", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // only R2    
    // x_axes
    this.attributes.x_axis = this.newLabelAndInput({name: "x_axis", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // only R2    
    // y_axes
    this.attributes.y_axis = this.newLabelAndInput({name: "y_axis", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // only R3
    // render
    this.attributes.render = this.newLabelAndMenu({name: "render", value: "sort"}, this.configRightSubPanel, ["sort", "painter"]);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // only R3
    // split
    this.attributes.split = this.newLabelAndCheckbox({name: "split", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // R2 and R3
    // sensitive_to_mouse_movements
    this.attributes.sensitive_to_mouse_movements = this.newLabelAndCheckbox({name: "sensitive_to_mouse_movements", value: "false"}, this.configRightSubPanel);

    descartesJS.hideHTML(this.configRightSubPanel);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  descartesJS.EditorSpacePanel.prototype.newParamObject = function(type) {
    var tmpObj;

    // if the type is R2
    if (type == "R2") {
      tmpObj = { type:       "R2",
                 id:         "E0",
                 x:          "0",
                 y:          "0",
                 width:      "100%", 
                 height:     "100%",
                 drawif:     "1",
                 fixed:      "false",
                 scale:      "48",
                 "O.x":      "0",
                 "O.y":      "0",
                 image:      "",
                 bg_display: "topleft",
                 background: "f0f8fa",
                 net:        "b8c4c8",
                 net10:      "889498",
                 axes:       "405860",
                 text:       "405860",
                 numbers:    "false",
                 x_axis:     "",
                 y_axis:     "",
                 sensitive_to_mouse_movements: "false"
      };
    }
    // if the type is R3
    else if (type == "R3") {
      tmpObj = { type:       "R3",
                 id:         "E0",
                 x:          "0",
                 y:          "0",
                 width:      "100%", 
                 height:     "100%",
                 drawif:     "1",
                 fixed:      "false",
                 scale:      "48",
                 "O.x":      "0",
                 "O.y":      "0",
                 image:      "",
                 bg_display: "topleft",
                 background: "000000",
                 render:     "order",
                 split:      "false",
                 sensitive_to_mouse_movements: "false"
      };
    }
    // if the type is HTMLIframe
    else {
      tmpObj = { type:       "HTMLIFrame",
                 id:         "E0",
                 x:          "0",
                 y:          "0",
                 width:      "100%", 
                 height:     "100%",
                 drawif:     "1",
                 image:      "",
                 bg_display: "topleft",
                 background: "f0f8fa",
                 file:       ""
      };
    }

    return tmpObj;
  }

  return descartesJS;
})(descartesJS || {});