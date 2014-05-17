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
  descartesJS.EditorConfigPanel = function(editor) {
    // call the parent constructor
    descartesJS.EditorGenericPanel.call(this, editor);

  	this.params = editor.sceneParams;
    this.config = editor.configAttributes;

    // this.createPanel();
    this.createPanel2();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of EditorGenericPanel
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.EditorConfigPanel, descartesJS.EditorGenericPanel);

  /**
   *
   */
  descartesJS.EditorConfigPanel.prototype.createPanel = function() {
    var tmp;

    var parentPanel = document.getElementById("tab_1");
    var panel = document.createElement("div");
    panel.setAttribute("class", "DescartesConfigPanel");
    parentPanel.appendChild(panel);
    
    this.parameters = [];

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // docBase
    tmp = this.findObjectByName(this.params, "docBase");
    if (tmp.value == window.location.href) { tmp.value = "_default_"; };
    this.parameters.push(  this.newLabelAndInput(this.findObjectByName(this.params, "docBase"), panel)  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // decimal symbol
    this.parameters.push(  this.newLabelAndMenu(this.findObjectByName(this.params, "decimal_symbol"), panel, [".", ","])  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // antialias
    this.parameters.push(  this.newLabelAndCheckbox(this.findObjectByName(this.params, "antialias"), panel)  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // language
    this.parameters.push(  this.newLabelAndMenu(this.findObjectByName(this.params, "language"), panel, ["english", "espa\u00F1ol", "catal\u00E0", "euskera", "fran\u00E7ais", "galego", "portugu\u00EAs", "valenci\u00E0"])  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // buttons
    var tmpButtons = this.parent.lessonParser.split(this.findObjectByName(this.params, "Buttons").value)
    var tmpButtonsArray = [];
    for (var i=0, l=tmpButtons.length; i<l; i++) {
      tmpButtonsArray.push( { name: babel[tmpButtons[i][0]] || tmpButtons[i][0], 
                              value: babel[tmpButtons[i][1]] || tmpButtons[i][1]
                            } );
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // fieldset
    var buttonsFieldSet = this.newFieldSet(panel, "buttons");

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // about button
    this.parameters.push(  this.newLabelAndCheckbox(this.findObjectByName(tmpButtonsArray, "about"), buttonsFieldSet)  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // config button
    this.parameters.push(  this.newLabelAndCheckbox(this.findObjectByName(tmpButtonsArray, "config"), buttonsFieldSet)  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // init button
    this.parameters.push(  this.newLabelAndCheckbox(this.findObjectByName(tmpButtonsArray, "init"), buttonsFieldSet)  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // clear button
    this.parameters.push(  this.newLabelAndCheckbox(this.findObjectByName(tmpButtonsArray, "clear"), buttonsFieldSet)  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // widthEast
    this.parameters.push(  this.newLabelAndInput(this.findObjectByName(tmpButtonsArray, "widthEast"), panel)  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // widthWest
    this.parameters.push(  this.newLabelAndInput(this.findObjectByName(tmpButtonsArray, "widthWest"), panel)  );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // height
    this.parameters.push(  this.newLabelAndInput(this.findObjectByName(tmpButtonsArray, "height"), panel)  );
  }

  /**
   *************************************************************************************************************************************************
   */
  descartesJS.EditorConfigPanel.prototype.createPanel2 = function() {
    this.ulContainer = document.createElement("ul");
    this.editor.listContainer.appendChild(this.ulContainer);

    var lessonParser = this.parent.lessonParser;
    var liElement;
    var span;
    var name;
    var value;

    var _tmpW = _tmpH = null;

    // applet header
    liElement = document.createElement("li");
    span = document.createElement("span");
    span.innerHTML = "&lt;ajs ";
    liElement.appendChild(span);

    for (var i=0, l=this.config.length; i<l; i++) {
      name = this.config[i].name;
      value = this.config[i].value;    

      if (name == "width") {
        _tmpW = value;
      }
      if (name == "height") {
        _tmpH = value;
      }

      span = document.createElement("span");
      span.innerHTML = name + '="';
      liElement.appendChild(span);

      span = document.createElement("span");
      span.setAttribute("class", "DescartesSpanValue");
      span.setAttribute("contenteditable", "true");
      span.setAttribute("autocapitalize", "off");
      span.innerHTML = value;
      liElement.appendChild(span);

      span = document.createElement("span");
      span.innerHTML = '" ';
      liElement.appendChild(span);
    }

    span = document.createElement("span");
    span.innerHTML = "&gt;";
    liElement.appendChild(span);

    this.ulContainer.appendChild(liElement);
    //////////

    //
    for (var i=0, l=this.params.length; i<l; i++) {
      liElement = document.createElement("li");
      name = this.params[i].name;
      value = this.params[i].value;

      if ((name == "size") && (_tmpW != null) && (_tmpH != null)) {
        value = _tmpW +"x"+ _tmpH;
      }

      if (babel[this.params[i].name] != "Buttons") {
        span = document.createElement("span");
        span.innerHTML = '&lt;param name="' + babel.toLanguage(name) + '" value="';
        liElement.appendChild(span);

        span = document.createElement("span");
        span.setAttribute("class", "DescartesSpanValue");
        span.setAttribute("contenteditable", "true");
        span.setAttribute("autocapitalize", "off");
        span.innerHTML = babel.toLanguage(value);
        liElement.appendChild(span);

        span = document.createElement("span");
        span.innerHTML = '"&gt;';
        liElement.appendChild(span);
      }
      else {
        span = document.createElement("span");
        span.innerHTML = '&lt;param name="' + babel.toLanguage(name) + '" value="';
        liElement.appendChild(span);

        var splitValues = lessonParser.split(value);
        for (var s_i=0, s_l=splitValues.length; s_i<s_l; s_i++) {
          name = babel[splitValues[s_i][0]] || splitValues[s_i][0];
          value = babel[splitValues[s_i][1]] || splitValues[s_i][1];

          span = document.createElement("span");
          span.innerHTML = babel.toLanguage(name) + "='";
          liElement.appendChild(span);

          span = document.createElement("span");
          span.setAttribute("class", "DescartesSpanValue");
          span.setAttribute("contenteditable", "true");
          span.setAttribute("autocapitalize", "off");
          span.innerHTML = babel.toLanguage(value);
          liElement.appendChild(span);

          span = document.createElement("span");
          span.innerHTML = "'" + ((s_i < s_l-1) ? " " : "");
          liElement.appendChild(span);
        }

        span = document.createElement("span");
        span.innerHTML = '">';
        liElement.appendChild(span);
      }

      this.ulContainer.appendChild(liElement);
    }

  }

  return descartesJS;
})(descartesJS || {});