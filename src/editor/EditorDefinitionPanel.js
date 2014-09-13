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
  descartesJS.EditorDefinitionPanel = function(editor) {
    // call the parent constructor
    descartesJS.EditorGenericPanel.call(this, editor);

    this.params = editor.defParams;

    this.prefix = "A_";
    this.dontShowList = { type: true };
    this.notifyProgram = true;

    // this.createPanel();
    this.createPanel2();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of EditorGenericPanel
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.EditorDefinitionPanel, descartesJS.EditorGenericPanel);

  /**
   *
   */
  descartesJS.EditorDefinitionPanel.prototype.createPanel = function() {
    var parentPanel = document.getElementById("tab_4");
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
  descartesJS.EditorDefinitionPanel.prototype.buildobj = function(paramObj) {
    var paramsObj = paramObj.value;
    var paramsObj_i;
    var tmpObj;
    var finalDefinition = [];
    var tmpValue;
    var type = "variable";
    var hasArray = false;
    var hasMatrix = false;
    var hasParenthesis = false;

    // find the type of the definition
    for (var i=0, l=paramsObj.length; i<l; i++) {
      paramsObj_i = paramsObj[i];

      if (babel[paramsObj_i[0]] == "array") {
        hasArray = true;
      }
      if (babel[paramsObj_i[0]] == "matrix") {
        hasMatrix = true;
      }
      if (paramsObj_i[1].match(/\)$/)) {
        hasParenthesis = true;
      }
    }

    if (hasMatrix) {
      type = "matrix";
    }
    else if (hasArray) {
      type = "array";
    }
    else if (hasParenthesis) {
      type = "function";
    }
    else {
      type = "variable";
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
  descartesJS.EditorDefinitionPanel.prototype.configLeftPanel = function(panel) {
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
  descartesJS.EditorDefinitionPanel.prototype.configRightPanel = function(panel) {
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
    // algorithm
    this.attributes.algorithm = this.newLabelAndCheckbox({name: "algorithm", value: "false"}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // range
    this.attributes.range = this.newLabelAndInput({name: "range", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // local
    this.attributes.local = this.newLabelAndInput({name: "local", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // init
    this.attributes.init = this.newLabelAndInput({name: "init", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // doExpr
    this.attributes.doExpr = this.newLabelAndInput({name: "doExpr", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // whileExpr
    this.attributes.whileExpr = this.newLabelAndInput({name: "whileExpr", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // evaluate
    this.attributes.evaluate = this.newLabelAndMenu({name: "evaluate", value: "onlyOnce"}, this.configRightSubPanel, ["onlyOnce", "always"]);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // file
    this.attributes.file = this.newLabelAndInput({name: "file", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // columns
    this.attributes.columns = this.newLabelAndInput({name: "columns", value: ""}, this.configRightSubPanel);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // rows
    this.attributes.rows = this.newLabelAndInput({name: "rows", value: ""}, this.configRightSubPanel);


    descartesJS.hideHTML(this.configRightSubPanel);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   *
   */
  descartesJS.EditorDefinitionPanel.prototype.newParamObject = function(type) {
    var tmpObj;

    // if the type is variable
    if (type == "variable") {
      tmpObj = { id:        "v1",
                 expresion: "0", 
                 type:      "variable"
      };
    }
    // if the type is function
    else if (type == "function") {
      tmpObj = { id:        "f(x)",
                 algorithm: "false",
                 expresion: "x",
                 range:     "",
                 local:     "",
                 init:      "",
                 doExpr:    "",
                 whileExpr: "",
                 type:      "function"
      };
    }
    // if the type is array
    else if (type == "array") {
      tmpObj = { id:        "V1",
                 array:     "true",
                 evaluate:  "onlyOnce",
                 size:      "3",
                 expresion: "V3[0]=0;V3[1]=0;V3[2]=0",
                 file:      "",
                 type:      "array"
      };
    }
    // if the type is matrix
    else {
      tmpObj = { id:        "M1",
                 matrix:    "true",
                 evaluate:  "onlyOnce",
                 columns:   "3",
                 rows:      "3",
                 expresion: "M4[0,0]=0;M4[1,0]=0;M4[2,0]=0;M4[0,1]=0;M4[1,1]=0;M4[2,1]=0;M4[0,2]=0;M4[1,2]=0;M4[2,2]=0;", 
                 type:      "matrix"
      };
    }
   
    return tmpObj;
  }

  return descartesJS;
})(descartesJS || {});