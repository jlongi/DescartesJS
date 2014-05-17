/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   *
   */
  descartesJS.newLabelAndInput = function(panel, text, value) {
    var container = document.createElement("div");
    container.setAttribute("class", "DescartesLabelAndElementContainer");

    var label = newLabel(text);
    label.setAttribute("for", "Descartes_textfield_"+text);

    var input = newInput(value);
    input.setAttribute("id", "Descartes_textfield_"+text);

    container.appendChild(label);
    container.appendChild(input);
    panel.appendChild(container);

    return container;
  }

  /**
   *
   */
  descartesJS.newLabelAndCheckbox = function(panel, text, value) {
    var container = document.createElement("div");
    container.setAttribute("class", "DescartesLabelAndElementContainer");

    var label = newLabel(text);
    label.setAttribute("for", "Descartes_checkbox_"+text);

    var checkbox = newInput(value, "checkbox");
    checkbox.setAttribute("id", "Descartes_checkbox_"+text);
    checkbox.checked = value;

    container.appendChild(label);
    container.appendChild(checkbox);
    panel.appendChild(container);

    return container;
  }  

  /**
   *
   */
  descartesJS.newLabelAndMenu = function(panel, text, options, initval) {
    var container = document.createElement("div");
    container.setAttribute("class", "DescartesLabelAndElementContainer");

    var label = newLabel(text);
    label.setAttribute("for", "Descartes_menu_"+text);

    var select = document.createElement("select");
    select.setAttribute("id", "Descartes_menu_"+text);

    for (var i=0,l=options.length; i<l; i++) {
      select.innerHTML += "<option value='" + options[i] + "'> " + options[i] + "</option>\n";
    }
    select.value = initval;

    container.appendChild(label);
    container.appendChild(select);
    panel.appendChild(container);

    return container;
  }

  /**
   *
   */
  descartesJS.newFieldSet = function(panel, text) {
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
  descartesJS.addNewLine = function(container) {
    container.appendChild( document.createElement("br") );
  }

  /**
   *
   */
  function newLabel(text) {
    var label = document.createElement("label");
    label.setAttribute("style", "text-align:right; padding:5px; -webkit-touch-callout:none; -webkit-user-select:none; -khtml-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none;");
    label.innerHTML = text;
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
      obj.style.display = null;
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

  /**
   *
   */
  descartesJS.setValue = function(domobj, value) {
    var input = domobj.querySelector("input") || domobj.querySelector("select");

    if (input) {
      // checkbox
      if (input.getAttribute("type") == "checkbox") {
        input.checked = (value == "true") ? true : false;
      }
      // text field
      else {
        input.value = value;
      }
    }
  }

  return descartesJS;
})(descartesJS || {});