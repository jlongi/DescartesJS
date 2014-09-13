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
  descartesJS.EditorProgramPanel = function(editor) {
    // call the parent constructor
    descartesJS.EditorGenericPanel.call(this, editor);

    this.params = editor.progParams;

    this.prefix = "A_";
    this.dontShowList = { type: true };
    this.useDisplaceIndex = true;

    // this.createPanel();
    this.createPanel2();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of EditorGenericPanel
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.EditorProgramPanel, descartesJS.EditorGenericPanel);

  /**
   *
   */
  descartesJS.EditorProgramPanel.prototype.createPanel = function() {
    var parentPanel = document.getElementById("tab_5");
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
  descartesJS.EditorProgramPanel.prototype.buildobj = function(paramObj) {
    var paramsObj = paramObj.value;
    var paramsObj_i;
    var tmpObj;
    var tmpValue;
    var type = "constant";

    // find the type of the control
    for (var i=0, l=paramsObj.length; i<l; i++) {
      paramsObj_i = paramsObj[i];

      if (babel[paramsObj_i[0]] == "constant") {
        type = "constant";
      }
      if (babel[paramsObj_i[0]] == "event") {
        type = "event";
      }
      if (babel[paramsObj_i[0]] == "algorithm") {
        type = "algorithm";
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
  descartesJS.EditorProgramPanel.prototype.configLeftPanel = function(panel) {
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
      var program = this.obj;

      self.hideAllAttributes();
      self.showAttributes(program);
      self.fillAttributes(program);
      descartesJS.showHTML(self.configRightSubPanel);
    }

    panel.appendChild(list);
  }

  /**
   *
   */
  descartesJS.EditorProgramPanel.prototype.configRightPanel = function(panel) {
    this.configRightSubPanel = document.createElement("div");
    panel.appendChild(this.configRightSubPanel);

    this.attributes = {};

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // id
    this.attributes.id = this.newLabelAndInput({name: "id", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // expresion
    this.attributes.expresion = this.newLabelAndInput({name: "expresion", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // condition
    this.attributes.condition = this.newLabelAndInput({name: "condition", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // action
    this.attributes.action = this.newLabelAndMenu({name: "action", value: ""}, this.configRightSubPanel, ["", "calculate", "init", "clear", "animate", "openURL", "openScene", "playAudio"]);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // parameter
    this.attributes.parameter = this.newLabelAndInput({name: "parameter", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // execution
    this.attributes.execution = this.newLabelAndMenu({name: "execution", value: "onlyOnce"}, this.configRightSubPanel, ["onlyOnce", "alternate", "always"]);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // algorithm
    this.attributes.algorithm = this.newLabelAndCheckbox({name: "algorithm", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // evaluate
    this.attributes.evaluate = this.newLabelAndMenu({name: "evaluate", value: "onlyOnce"}, this.configRightSubPanel, ["onlyOnce", "always"]);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // init
    this.attributes.init = this.newLabelAndInput({name: "init", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // doExpr
    this.attributes.doExpr = this.newLabelAndInput({name: "doExpr", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // whileExpr
    this.attributes.whileExpr = this.newLabelAndInput({name: "whileExpr", value: ""}, this.configRightSubPanel);

    descartesJS.hideHTML(this.configRightSubPanel);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  descartesJS.EditorProgramPanel.prototype.newParamObject = function(type) {
    var tmpObj;
    
    // if the type is constant
    if (type == "constant") {
      tmpObj = { id:        "c1",
                 expresion: "0",
                 evaluate:  "onlyOnce", 
                 constant:  "true",
                 type:      "constant"
      };
    }
    // if the type is event
    else if (type == "event") {
      tmpObj = { id:        "e1",
                 "event":   "true",
                  condition: "",
                  action:    "",
                  parameter: "",
                  execution: "",
                  type:      "event"
      };
    }
    // if the type is algorithm
    else {
      tmpObj = { id:        "A1",
                 algorithm: "true",
                 evaluate:  "onlyOnce",
                 init:      "",
                 doExpr:    "",
                 whileExpr: "", 
                 type:      "algorithm"
      };
    }

    return tmpObj;
  }

  return descartesJS;
})(descartesJS || {});