/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  // if (descartesJS.loadLib) { return descartesJS; }

  var language;

  /**
   * 
   * @constructor 
   * @param 
   */
  descartesJS.EditorGenericPanel = function(editor) {
  	this.editor = editor;
  	this.parent = editor.parent;

  	language = this.parent.language;
  }

  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.findObjectByName = function(valArray, name) {
    for (var i=0, l=valArray.length; i<l; i++) {
      if (valArray[i].name == name) {
        return valArray[i];
      }
    }
    return null;
    // return {name: name, value: null};
  }

  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.newLabelAndInput = function(obj, panel) {
    var container = document.createElement("div");
    container.setAttribute("class", "DescartesLabelAndElementContainer");
    container.obj = obj;

    var label = newLabel(obj.name);
    // label.setAttribute("for", "Descartes_textfield_"+text);

    var input = newInput(obj.value);
    // input.setAttribute("id", "Descartes_textfield_"+text);

    container.appendChild(label);
    container.appendChild(input);
    panel.appendChild(container);

    container.addEventListener("change", storeValue);

    return container;
  }

  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.newLabelAndMenu = function(obj, panel, options) {
    var container = document.createElement("div");
    container.setAttribute("class", "DescartesLabelAndElementContainer");
    container.obj = obj;

    var label = newLabel(obj.name);
    // label.setAttribute("for", "Descartes_menu_"+text);

    var select = document.createElement("select");
    // select.setAttribute("id", "Descartes_menu_"+text);

    for (var i=0,l=options.length; i<l; i++) {
      select.innerHTML += "<option value='" + options[i] + "'> " + options[i] + "</option>\n";
    }
    select.value = obj.value;

    container.appendChild(label);
    container.appendChild(select);
    panel.appendChild(container);

    container.addEventListener("change", storeValue);

    return container;
  }  

  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.newLabelAndCheckbox = function(obj, panel) {
    var container = document.createElement("div");
    container.setAttribute("class", "DescartesLabelAndElementContainer");
    container.obj = obj;

    var label = newLabel(obj.name);
    // label.setAttribute("for", "Descartes_checkbox_"+text);

    var checkbox = newInput(obj.value, "checkbox");
    // checkbox.setAttribute("id", "Descartes_checkbox_"+text);
    checkbox.checked = (obj.value == "true") ? true : false;

    container.appendChild(label);
    container.appendChild(checkbox);
    panel.appendChild(container);

    container.addEventListener("change", storeValue);

    return container;
  }    

  /**
   *
   */
  function newLabel(text) {
    var label = document.createElement("label");
    label.setAttribute("style", "text-align:right; padding:5px; -webkit-touch-callout:none; -webkit-user-select:none; -khtml-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none;");
    label.innerHTML = babel.translate(language, text);
    return label;
  }

  /**
   *
   */
  function newInput(value, type) {
    var input = document.createElement("input");
    input.value = value;
    if (type) {
      input.setAttribute("type", type);
    }
    return input;    
  }

  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.newFieldSet = function(panel, text) {
    var fieldset = document.createElement("fieldset");
    var fieldSetLegend = document.createElement("legend");
    fieldSetLegend.innerHTML = text;
    fieldset.appendChild(fieldSetLegend);
    
    panel.appendChild(fieldset);

    return fieldset;
  }

  /**
   *
   */
  function storeValue(evt) {
    var input = this.querySelector("input") || this.querySelector("select");
    var value = input.value;
    if (input.getAttribute("type") == "checkbox") {
      value = input.checked.toString();
    }

    this.obj.value = value;
// console.log(this.obj)
  }

  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.setValue = function(domobj, obj) {
    domobj.obj = obj;
    var input = domobj.querySelector("input") || domobj.querySelector("select");

    if (input) {
      // checkbox
      if (input.getAttribute("type") == "checkbox") {
        input.checked = (obj.value == "true") ? true : false;
      }
      // text field
      else {
        input.value = obj.value;
      }
    }
  }

  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.fillAttributes = function(space) {
    var c;

    for (var i=0, l=space.length; i<l; i++) {
      c = this.attributes[space[i].name];
      if (c) {
        this.setValue(c, space[i]);
      }
    }
  }
  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.hideAllAttributes = function() {
    for (var att in this.attributes) {
      descartesJS.hideHTML( this.attributes[att] );
    }
  }
  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.showAttributes = function(space) {
    for (var i=0, l=space.length; i<l; i++) {
      if (this.attributes[space[i].name]) {
        descartesJS.showHTML( this.attributes[space[i].name] );
      }
    }
  }

  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.toNameValueArray = function(objArray) {
    var tmpArray = [];
    for (var prop in objArray) {
      tmpArray.push( { name: prop, value: objArray[prop] } )
    }
    return tmpArray;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   *************************************************************************************************************************************************
   */
  descartesJS.EditorGenericPanel.prototype.createPanel2 = function(isNotFirstTime) {
    var displaceIndex = (this.useDisplaceIndex) ? this.editor.definitionPanel.params.length : 0;

    if (!isNotFirstTime) {
      for (var i=0, l=this.params.length; i<l; i++) {
        this.buildobj(this.params[i]);
      }

      this.ulContainer = document.createElement("ul");
      this.editor.listContainer.appendChild(this.ulContainer);      
    }

    var lessonParser = this.parent.lessonParser;
    var liElement;
    var span;
    var editSpan;
    var name;
    var prop;
    var family;
    var param_i;

    if (this.params.length == 0) {
      this.ulContainer.style.display = "none";
    }
    else {
      this.ulContainer.style.display = null;
    }

    for (var i=0, l=this.params.length; i<l; i++) {
      liElement = document.createElement("li");
      liElement.setAttribute("data-index", i);
      param_i = this.params[i].obj;
      name = this.params[i].name;

      span = document.createElement("span");
      span.innerHTML = '<div class="Descartes_param_name">' + '&lt;param name="' + this.prefix + (((i+displaceIndex+1)<10) ? "0" : "") + (i+displaceIndex+1) + '" value="<br></div>';
      liElement.appendChild(span);

      for (var ii=0, ll=param_i.length; ii<ll; ii++) {
        prop = param_i[ii];
        prop.value = prop.value.replace(/</g, "&lt;");

        if ( (prop.name == "family_interval") || (prop.name == "family_steps") ) { 
          family = this.params[i].paramObj.family;
          span = document.createElement("span");
          span.setAttribute("class", "family");
          span.innerHTML = family + ((family != "") ? "." : "") + ((prop.name == "family_interval") ? babel.toLanguage("interval") : babel.toLanguage("steps")) + "='";
          liElement.appendChild(span);

          editSpan = document.createElement("span");
          editSpan.setAttribute("class", "DescartesSpanValue");
          editSpan.setAttribute("contenteditable", "true");
          editSpan.setAttribute("autocapitalize", "off");
          editSpan.innerHTML = babel.toLanguage(prop.value);
          liElement.appendChild(editSpan);

          span = document.createElement("span");
          span.innerHTML = "'" + ((ii<ll-1)?" ":"");
          liElement.appendChild(span);
        }
        else if ( (prop.name == "parameter_interval") || (prop.name == "parameter_steps") ) {
          parameter = this.params[i].paramObj.parameter;
          span = document.createElement("span");
          span.setAttribute("class", "parameter");
          span.innerHTML = parameter + ((parameter != "") ? "." : "") + ((prop.name == "parameter_interval") ? babel.toLanguage("interval") : babel.toLanguage("steps")) + "='";
          liElement.appendChild(span);

          editSpan = document.createElement("span");
          editSpan.setAttribute("class", "DescartesSpanValue");
          editSpan.setAttribute("contenteditable", "true");
          editSpan.setAttribute("autocapitalize", "off");
          editSpan.innerHTML = babel.toLanguage(prop.value);
          liElement.appendChild(editSpan);

          span = document.createElement("span");
          span.innerHTML = "'" + ((ii<ll-1)?" ":"");
          liElement.appendChild(span);          
        }
        else {
          if (!this.dontShowList[prop.name]) { 
            span = document.createElement("span");
            span.innerHTML = babel.toLanguage(prop.name) + "='";
            liElement.appendChild(span);

            editSpan = document.createElement("span");
            editSpan.setAttribute("class", "DescartesSpanValue");
            editSpan.setAttribute("contenteditable", "true");
            editSpan.setAttribute("autocapitalize", "off");
            editSpan.innerHTML = babel.toLanguage(prop.value);
            liElement.appendChild(editSpan);

            span = document.createElement("span");
            span.innerHTML = "'" + ((ii<ll-1)?" ":"");
            liElement.appendChild(span);
          }
        }

        //
        if (prop.name == "family") {
          editSpan.addEventListener("input", function(evt) {
            var familyRelated = this.parentNode.querySelectorAll(".family");
            var text;

            for (var i=0, l=familyRelated.length; i<l; i++) {
              text = familyRelated[i].innerHTML;

              if (text.match("intervalo")) {
                familyRelated[i].innerHTML = this.textContent + ((this.textContent != "") ? "." : "") + "intervalo='";
              }
              else {
                familyRelated[i].innerHTML = this.textContent + ((this.textContent != "") ? "." : "") + "pasos='";
              }   
            }
          });
        }

        //
        if (prop.name == "parameter") {
          editSpan.addEventListener("input", function(evt) {
            var parameterRelated = this.parentNode.querySelectorAll(".parameter");
            var text;

            for (var i=0, l=parameterRelated.length; i<l; i++) {
              text = parameterRelated[i].innerHTML;

              if (text.match("intervalo")) {
                parameterRelated[i].innerHTML = this.textContent + ((this.textContent != "") ? "." : "") + "intervalo='";
              }
              else {
                parameterRelated[i].innerHTML = this.textContent + ((this.textContent != "") ? "." : "") + "pasos='";
              }   
            }
          });
        }        

      }

      span = document.createElement("span");
      span.innerHTML = '<br>"&gt;';
      liElement.appendChild(span);

      this.ulContainer.appendChild(liElement);      
    }
  }

  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.add = function(type) {
    var newParam = { name: "_" };

    newParam.paramObj = this.newParamObject(type);
    newParam.obj = this.toNameValueArray(newParam.paramObj);

    this.params.push(newParam);
    this.ulContainer.innerHTML = "";
    this.createPanel2(true);

    //
    if (this.notifyProgram) {
      this.editor.programPanel.renumerate();
    }

    var tmp = this.ulContainer.querySelectorAll("li");
    tmp[this.params.length-1].className += " DescartesElementSelected";
    return tmp[this.params.length-1];
  }

  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.remove = function(index) {
    this.params.splice(index, 1);
    this.ulContainer.innerHTML = "";
    this.createPanel2(true);

    //
    if (this.notifyProgram) {
      this.editor.programPanel.renumerate();
    }    
  }

  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.clone = function(index) {
    var oldParam = this.params[index];
    var newParam = { name: "_", paramObj: {} };

    for (var prop in oldParam.paramObj) {
      newParam.paramObj[prop] = oldParam.paramObj[prop];
    }

    newParam.obj = this.toNameValueArray(newParam.paramObj);

    this.params.push(newParam);
    this.ulContainer.innerHTML = "";
    this.createPanel2(true);

    //
    if (this.notifyProgram) {
      this.editor.programPanel.renumerate();
    }

    var tmp = this.ulContainer.querySelectorAll("li");
    tmp[this.params.length-1].className += " DescartesElementSelected";
    return tmp[this.params.length-1];    
  }

  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.moveUp = function(index) {
    if (index > 0) {
      var tmpParam = this.params[index-1];
      this.params[index-1] = this.params[index];
      this.params[index] = tmpParam;
      this.ulContainer.innerHTML = "";
      this.createPanel2(true);

      var tmp = this.ulContainer.querySelectorAll("li");
      tmp[index-1].className += " DescartesElementSelected";
      return tmp[index-1];
    }
  }

  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.moveDown = function(index) {
    if (index < this.params.length-1) {
      var tmpParam = this.params[index+1];
      this.params[index+1] = this.params[index];
      this.params[index] = tmpParam;
      this.ulContainer.innerHTML = "";
      this.createPanel2(true);

      var tmp = this.ulContainer.querySelectorAll("li");
      tmp[index+1].className += " DescartesElementSelected";
      return tmp[index+1];
    }
  }

  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.renumerate = function() {
    var displaceIndex = this.editor.definitionPanel.params.length;
    var tmp = this.ulContainer.querySelectorAll("li");
    for (var i=0, l=tmp.length; i<l; i++) {
      tmp[i].firstChild.innerHTML = '&lt;param name="' + this.prefix + (i+displaceIndex+1) + '" value="';
    }
  }

  /**
   *
   */
  descartesJS.EditorGenericPanel.prototype.getContent = function() {
    var text = "";
    var ulList = this.ulContainer.querySelectorAll("li");
    var param_i;

    var spanList;

    for (var i=0,l=ulList.length; i<l; i++) {
      spanList = ulList[i].querySelectorAll("span");

      for (var j=0, k=spanList.length; j<k; j++) {
        if (spanList[j].className == "DescartesSpanValue") {
          text += spanList[j].textContent.replace(/'/g, "&squot;");
        }
        else {
          text += spanList[j].textContent;
        }
      }

      text += "\n";
    }

    return text.replace(/intervalo=''/g, "").replace(/pasos=''/g, "");
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   *
   */
  descartesJS.hideHTML = function(obj) {
    if ((obj) && (obj.style)) {
      obj.style.display = "none";
    }
  }

  /**
   *
   */
  descartesJS.showHTML = function(obj) {
    if ((obj) && (obj.style)) {
      obj.style.display = "";
    }
  }

  /**
   *
   */
  descartesJS.hideMultipleHTML = function(objlist) {
    for (var i=0, l=objlist.length; i<l; i++) {
      descartesJS.hideHTML(objlist[i]);
    }
  }

  /**
   *
   */
  descartesJS.showMultipleHTML = function(objlist) {
    for (var i=0, l=objlist.length; i<l; i++) {
      descartesJS.showHTML(objlist[i]);
    }
  }  

  return descartesJS;
})(descartesJS || {});