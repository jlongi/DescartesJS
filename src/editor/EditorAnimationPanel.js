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
  descartesJS.EditorAnimationPanel = function(editor) {
    // call the parent constructor
    descartesJS.EditorGenericPanel.call(this, editor);

    if (editor.animParams.length <= 0) {
      this.hasAnimation = false;
      this.params = [ 
                          { name: "Animation", value: "false" }, 
                          { name: "delay", value: "1000" }, 
                          { name: "controls", value: "false" }, 
                          { name: "auto", value: "false" }, 
                          { name: "loop", value: "false" }, 
                          { name: "init", value: "" }, 
                          { name: "doExpr", value: "" }, 
                          { name: "whileExpr", value: "" }
                        ];
    }
    else {
      this.hasAnimation = true;
      var tmpAnim = editor.animParams[0].value;
      var tmpAnimArray = [{ name: "Animation", value: "true" }];
      for (var i=0, l=tmpAnim.length; i<l; i++) {
        tmpAnimArray.push( { name: babel[tmpAnim[i][0]] || tmpAnim[i][0], 
                             value: babel[tmpAnim[i][1]] || tmpAnim[i][1]
                            } );
      }

      this.params = tmpAnimArray;
    }

    // this.createPanel();
    this.createPanel2();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of EditorGenericPanel
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.EditorAnimationPanel, descartesJS.EditorGenericPanel);

  /**
   *
   */
  descartesJS.EditorAnimationPanel.prototype.createPanel = function() {
    var tmp;

    var parentPanel = document.getElementById("tab_8");
    var panel = document.createElement("div");
    panel.setAttribute("class", "DescartesConfigPanel");
    parentPanel.appendChild(panel);
    
    this.parameters = [];

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Animation
    this.parameters.push(  this.newLabelAndCheckbox(this.findObjectByName(this.params, "Animation"), panel)  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // delay
    this.parameters.push(  this.newLabelAndInput(this.findObjectByName(this.params, "delay"), panel)  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // controls
    this.parameters.push(  this.newLabelAndCheckbox(this.findObjectByName(this.params, "controls"), panel)  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // auto
    this.parameters.push(  this.newLabelAndCheckbox(this.findObjectByName(this.params, "auto"), panel)  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // loop
    this.parameters.push(  this.newLabelAndCheckbox(this.findObjectByName(this.params, "loop"), panel)  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // init
    this.parameters.push(  this.newLabelAndInput(this.findObjectByName(this.params, "init"), panel)  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // doExpr
    this.parameters.push(  this.newLabelAndInput(this.findObjectByName(this.params, "doExpr"), panel)  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // whileExpr
    this.parameters.push(  this.newLabelAndInput(this.findObjectByName(this.params, "whileExpr"), panel)  );

  }


  /**
   *************************************************************************************************************************************************
   */
  descartesJS.EditorAnimationPanel.prototype.createPanel2 = function(isNotFirstTime) {
    if (!isNotFirstTime) {
      this.ulContainer = document.createElement("ul");
      this.editor.listContainer.appendChild(this.ulContainer);      
    }

    var lessonParser = this.parent.lessonParser;
    var liElement;
    var span;
    var name;
    var prop;
    var family;
    var parameter;

    //
    if (this.hasAnimation) {
      this.ulContainer.style.display = null;

      liElement = document.createElement("li");
      span = document.createElement("span");
      span.innerHTML = '&lt;param name="' + babel.toLanguage("Animation") + '" value="';
      liElement.appendChild(span);

      for (var i=0, l=this.params.length; i<l; i++) {
        name = babel[this.params[i].name] || this.params[i].name;
        value = babel[this.params[i].value] || this.params[i].value;
        value = value.replace(/</g, "&lt;");
  
        if (name != "Animation") {
          span = document.createElement("span");
          span.innerHTML = babel.toLanguage(name) + "='";
          liElement.appendChild(span);

          span = document.createElement("span");
          span.setAttribute("class", "DescartesSpanValue");
          span.setAttribute("contenteditable", "true");
          span.innerHTML = babel.toLanguage(value);
          liElement.appendChild(span);

          span = document.createElement("span");
          span.innerHTML = "'" + ((i < l-1) ? " " : "");
          liElement.appendChild(span);
        }
      }

      span = document.createElement("span");
      span.innerHTML = '"&gt;';
      liElement.appendChild(span);

      this.ulContainer.appendChild(liElement);
    }
    else {
      this.ulContainer.style.display = "none";
    }
  }  

  /**
   *
   */
  descartesJS.EditorAnimationPanel.prototype.add = function() {
    if (!this.hasAnimation) {
      this.hasAnimation = true;
      this.ulContainer.innerHTML = "";
      this.createPanel2(true);
    }
  }

  /**
   *
   */
  descartesJS.EditorAnimationPanel.prototype.remove = function() {
    this.hasAnimation = false;
    this.ulContainer.innerHTML = "";
    this.createPanel2(true);
  }

  /**
   *
   */
  descartesJS.EditorAnimationPanel.prototype.getContent = function() {
    if (this.hasAnimation) {
      return this.ulContainer.textContent;
    }
    return "";
  }  

  return descartesJS;
})(descartesJS || {});