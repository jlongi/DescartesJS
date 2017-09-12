/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS, babel) {
  if (descartesJS.loadLib) { return descartesJS; }

  var temp;
  var babelValue;
  var values_i_0;
  var values_i_1;
  var spaceObj;
  var controlObj;
  var graphicObj;
  var auxiliarObj;
  var regExpImage = /[\w-//]*(\.png|\.jpg|\.gif|\.svg)/gi;

  var theAction_action;
  var theAction_parent;
  var theAction_parameter;

  var splitValues;
  var pos;
  var i;
  var initToken;
  var initPosToken;
  var endPosToken;
  var stringToken;
  var valueToken;
  var charAt;

  var splitString;
  var parenthesesStack;
  var lastSplitIndex;

  var tmpColor;
  var splitColor;
  var hexColor;

  var subtitleFontSize;
  var plecaObj;
  var paddingSides = 15;
  var image;
  var imageHeight;
  var divTitle;
  var divSubTitle;
  var tempDiv;
  var tempDivHeight;
  var tempFontSize;
  var noLines;
  var tempDecrement;
  var tmpIndexEqual;
  var tmpIndexSpace;

  var charAt;

  /**
   * Parser of principal elements of descartes
   * @constructor
   * @param {DescartesApp} parent the Descartes application
   */
  descartesJS.LessonParser = function(parent) {
    this.parent = parent;

    this.parser = parent.evaluator.parser;

    this.RTFparser = new descartesJS.RTFParser(parent.evaluator);
  }

  /**
   * Parse the button configuration
   * @param {String} values is the string containing the values ​​that define the button configuration
   * @return {Object} return a configuration object with the corresponding values
   */
  descartesJS.LessonParser.prototype.parseButtonsConfig = function(values) {
    // default values
    var buttonConfigObj = { rowsNorth: 0, rowsSouth: 0, widthEast: 125, widthWest: 125, height: 23 };

    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);

    // traverse all values and asign to variables of the button configuration
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      babelValue = babel[values_i_0];

      switch(babelValue) {
        //
        case("rowsNorth"):
        case("rowsSouth"):
        case("widthEast"):
        case("widthWest"):
        case("height"):
          buttonConfigObj[babelValue] = parseInt(values_i_1);
          break;

        //
        case("about"):
        case("config"):
        case("init"):
        case("clear"):
          buttonConfigObj[babelValue] = (babel[values_i_1] === "true");
          break;

        // any variable missing
        default:
          console.log("Propiedad de botones no identificada: <" + values_i_0 + "> valor: <" + values_i_1 + ">");
          break;
      }
    }

    return buttonConfigObj;
  }

  /**
   * Parse and create a space
   * @param {String} values is the string containing the values ​​that define the space
   * @return {Space} return a space constructed with the correspondign values
   */
  descartesJS.LessonParser.prototype.parseSpace = function(values) {
    // object containing all the values ​​found in values
    spaceObj = {};

    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);

    // traverse all values and asign to variables to the space
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      babelValue = babel[values_i_0];

      //////////////////////////////////////////
      descartesJS.DEBUG.paramName = values_i_0;
      descartesJS.DEBUG.objectName = "Space";
      //////////////////////////////////////////

      switch(babelValue) {
        // identifier
        case("id"):
          // get the id for the debug
          descartesJS.DEBUG.idName = values_i_1;
        // text of the X axis
        case("x_axis"):
        // text of the Y axis
        case("y_axis"):
        // the type of the space (2D, 3D or another)
        case("type"):
        // control identifier (for rtf positioning)
        case("cID"):
        // file name of an external space
        case("file"):
        // information
        case("info"):
          spaceObj[babelValue] = values_i_1;
          break;

        // fixed condition
        case("fixed"):
        // condition to show the numbers in the space
        case("numbers"):
        // sensitive to mouse movements condition
        case("sensitive_to_mouse_movements"):
        // space 3D
        case("R3"):
        // split option for the render
        case("split"):
        // resizable
        case("resizable"):
          spaceObj[babelValue] = (babel[values_i_1] === "true");
          break;

        // how the background image is positioned
        case("bg_display"):
        // render mode sort, painter, raytrace
        case("render"):
          spaceObj[babelValue] = babel[values_i_1];
          break;

        // color of the net
        case("net"):
        // color of the net 10
        case("net10"):
        // color of the axis
        case("axes"):
        // color of the coordinate text of the mouse
        case("text"):
          if (values_i_1 != "") {
            spaceObj[babelValue] = (babel[values_i_1] === "false") ? "" : new descartesJS.Color(values_i_1, this.parent.evaluator);
          }
          else {
            spaceObj[babelValue] = "";
          }
          break;

        // x position of origin
        case("O.x"):
          spaceObj["OxExpr"] = values_i_1;
          break;

        // y position of origin
        case("O.y"):
          spaceObj["OyExpr"] = values_i_1;
          break;

        // background image
        case("image"):
          spaceObj["imageSrc"] = values_i_1;
          break;

        // x position
        case("x"):
          temp = values_i_1;

          // if specified with a percentage use the parent container's width to get the value in pixels
          if (temp[temp.length-1] === "%") {
            spaceObj["xPercentExpr"] = temp.trim();
            temp = (this.parent.container.width*parseFloat(temp)/100).toString();
          }
          // if not specified with a percentage get the numerical value of the position in x
          else {
            temp = values_i_1;
          }

          spaceObj["xExpr"] = this.parser.parse(temp);
          break;

        // y position
        case("y"):
          temp = values_i_1;

          // if specified with a percentage use the parent container's height to get the value in pixels
          if (temp[temp.length-1] === "%") {
            spaceObj["yPercentExpr"] = temp.trim();
            temp = (this.parent.container.height*parseFloat(temp)/100).toString();
          }
          // if not specified with a percentage get the numerical value of the position in y
          else {
            temp = values_i_1;
          }

          spaceObj["yExpr"] = this.parser.parse(temp);
          break;

        // width
        case("width"):
          temp = values_i_1.trim();
          spaceObj["wModExpr"] = temp;

          // if specified with a percentage use the parent container's width to get the value in pixels
          if (temp[temp.length-1] === "%") {
            spaceObj["wExpr"] = temp;
            temp = this.parent.container.width*parseFloat(temp)/100;
          }
          // if not specified with a percentage get the numerical value of the width
          else {
            temp = parseFloat(values_i_1);

            // whether to convert the value to a number the values ​​are different, then the width becomes the width of the parent container
            if (temp != values_i_1) {
              temp = this.parent.container.width; // default value
              spaceObj["_w_"] = values_i_1.trim();
            }
          }

          spaceObj["w"] = temp;
          break;

        // height
        case("height"):
          temp = values_i_1.trim();
          spaceObj["hModExpr"] = temp;
          
          // if specified with a percentage use the parent container's height to get the value in pixels
          if (temp[temp.length-1] === "%") {
            spaceObj["hExpr"] = temp;
            temp = this.parent.container.height*parseFloat(temp)/100;
          }
          // if not specified with a percentage get the numerical value of the height
          else {
            temp = parseFloat(values_i_1);

            // whether to convert the value to a number the values ​​are different, then the height becomes the height of the parent container
            if (temp != values_i_1) {
              temp = this.parent.container.height; // default value
              spaceObj["_h_"] = values_i_1.trim()
            }
          }

          spaceObj["h"] = temp;
          break;

        // drawif condition
        case("drawif"):
          if (values_i_1 != "") {
            spaceObj["drawif"] = this.parser.parse(values_i_1);
          }
          break;

        // scale
        case("scale"):
          temp = parseFloat(values_i_1);

          // whether to convert the value to a number the values ​​are different, then use the default value
          // this case ocurrs when the scale has a no valid value
          // if (temp.toString() != values_i_1) {
          if (isNaN(temp)) {
            temp =  48; // default value
          }

          spaceObj["scale"] = temp;
          break;

        // background color
        case("background"):
          spaceObj["background"] = new descartesJS.Color(values_i_1, this.parent.evaluator);
          break;

        // any variable missing
        default:
          console.log("Propiedad del espacio no identificada: <" + values_i_0 + "> valor: <" + values_i_1 + ">");
          break;
      }
    }

    // construct the space
    switch(spaceObj.type) {
      case("R2"):
        return new descartesJS.Space2D(this.parent, spaceObj);
        break;

      case("R3"):
        return new descartesJS.Space3D(this.parent, spaceObj);
        break;

      case("AP"):
        return new descartesJS.SpaceAP(this.parent, spaceObj);
        break;

      case("HTMLIFrame"):
        return new descartesJS.SpaceHTML_IFrame(this.parent, spaceObj);
        break;

      // Descartes 2
      default:
        return new descartesJS.Space2D(this.parent, spaceObj);
        break;
    }
  }

  /**
   * Parse and create a control
   * @param {String} values is the string containing the values ​​that define the control
   * @return {Control} return a control constructed with the correspondign values
   */
  descartesJS.LessonParser.prototype.parseControl = function(values) {
    // object containing all the values ​​found in values
    controlObj = { type: "numeric" };

    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);

    // traverse all values and asign to variables to the control
    for (var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      babelValue = babel[values_i_0];

      //////////////////////////////////////////
      descartesJS.DEBUG.paramName = values_i_0;
      descartesJS.DEBUG.objectName = "Control";
      //////////////////////////////////////////

      switch(babelValue) {
        // identifier
        case("id"):
          // get the id for the debug
          descartesJS.DEBUG.idName = values_i_1;
        // name
        case("name"):
        // parameter of the action
        case("parameter"):
        // tooltip
        case("tooltip"):
        // font tooltip
        case("tooltipFont"):
        // explanation
        case("Explanation"):
        // font explanation
        case("ExplanationFont"):
        // control identifier (for rtf positioning)
        case("cID"):
        // control menu options
        case("options"):
        // control graphic text font
        case("font"):
        // control graphic text font
        case("font_family"):
        // file name of a video or audio control
        case("file"):
        // answer pattern
        case("answer"):
        // css class
        case("cssClass"):
        // css class
        case("radio_group"):        
        // information
        case("info"):
          controlObj[babelValue] = values_i_1;
          break;

        // interface (spinner, button, etc)
        case("gui"):
        // region
        case("region"):
        // action
        case("action"):
        // relative position of control mesagges
        case("msg_pos"):
        // video control poster image
        case("poster"):
        // text alignment
        case("text_align"):
        // image alignment
        case("image_align"):
          controlObj[babelValue] = babel[values_i_1];
          break;

        // condition to use fixed notation in the text
        case("fixed"):
        // visible condition
        case("visible"):
        // condition for the discrete increment
        case("discrete"):
        // condition for a only text control
        case("onlyText"):
        // condition to evaluate the control
        case("evaluate"):
        // condition to auto play a video or audio control
        case("autoplay"):
        // condition to loop a video or audio control
        case("loop"):
        // condition to show the controls of a video or audio control
        case("controls"):
        // condition to show or remove the gradient in the buttons
        case("flat"):
          controlObj[babelValue] = (babel[values_i_1] === "true");
          break;

        // color text
        case("color"):
        // color-int text
        case("colorInt"):
        // control graphic trace
        case("trace"):
          controlObj[babelValue] = new descartesJS.Color(values_i_1, this.parent.evaluator);
          break;

        // font size
        case("font_size"):
        // drawif condition
        case("drawif"):
        // activeif condition
        case("activeif"):
        // number of decimals of the text in the graphic control
        case("decimals"):
        // minimum value
        case("min"):
        // maximum value
        case("max"):
        // control graphic size
        case("size"):
          if (values_i_1 !== "") {
            controlObj[babelValue] = this.parser.parse(values_i_1);
          }
          break;

        // control graphic constraint
        case("constraint"):
          controlObj["constraintExpr"] = values_i_1;
          break;

        // image
        case("image"):
          controlObj["imageSrc"] = values_i_1;
          break;

        // id of the containing space
        case("space"):
          controlObj["spaceID"] = values_i_1;
          break;

        // type
        case("type"):
          controlObj["type"] = babel[values_i_1.trim()];
          break;

        // expresion of the position and size
        case("expresion"):
          controlObj["expresion"] = this.parser.parse(values_i_1.replace(")(", ","));
          break;

        // border color of the text
        case("borderColor"):
          controlObj[babelValue] = (babel[values_i_1] === "false") ? "" : values_i_1;
          break;

        // bold text contidition
        case("bold"):
          if (babel[values_i_1] != "false") {
            controlObj["bold"] = "bold";
          }
          break;

        // italic text condition
        case("italics"):
          if (babel[values_i_1] != "false") {
            controlObj["italics"] = "italic";
          }
          break;

        // underline text condition
        case("underlined"):
          if (babel[values_i_1] != "false") {
            controlObj["underlined"] = true;
          }
          break;

        // value
        case("value"):
          var tmpVal = values_i_1.replace(/&squot;/g, "'");

          // replace the pipes with single quotation marks in the text value
          if (tmpVal.match(/^\|/)) {
            tmpVal = "'" + tmpVal.substring(1);
            if (tmpVal.match(/\|$/)) {
              tmpVal = tmpVal.substring(0, tmpVal.length-1) + "'";
            }
          }

          // the value expression for future evaluation
          controlObj["valueExpr"] = this.parser.parse(tmpVal);
          // the value string for reference
          controlObj["valueExprString"] = tmpVal;
          break;

        // increment
        case("incr"):
          if (values_i_1 != 0) {
            controlObj["incr"] = this.parser.parse(values_i_1);
          }
          break;

        // condition to show the text content in exponential notation
        case("exponentialif"):
          controlObj["exponentialif"] = parseFloat(values_i_1); // parse the posible expression
          break;

        // control graphic text
        case("text"):
          // the raw string
          controlObj["rawText"] = values_i_1;

          var tmpText = this.parseText(values_i_1);
          for (var ii=0, ll=tmpText.length; ii<ll; ii++) {
            tmpText[ii] = this.parser.parse(tmpText[ii], false);
          }

          controlObj["text"] = tmpText;
          break;

        // any variable missing
        default:
          var ind    = values_i_0.indexOf(".");
          var prefix = babel[values_i_0.substring(0,ind)];
          var sufix  = babel[values_i_0.substring(ind+1)];

          // find the font of the paramether
          if ((prefix === "parameter") && (sufix === "font")) {
            controlObj["parameterFont"] = values_i_1;
            break;

          // find the font of the explanation
          } else if ((prefix === "Explanation") && (sufix === "font")) {
            controlObj["ExplanationFont"] = values_i_1;
            break;

          // find the font of the tooltip
          } else if ((prefix === "tooltip") && (sufix === "font")) {
            controlObj["tooltipFont"] = values_i_1;
            break;
          }

          console.log("Propiedad de control no identificada: <" + values_i_0 + "> valor: <" + values_i_1 + ">");
          break;
      }
    }

    if (controlObj.type === "numeric") {
      switch (controlObj.gui) {
        case("spinner"):
          return new descartesJS.Spinner(this.parent, controlObj);
          break;

        case("button"):
          return new descartesJS.Button(this.parent, controlObj);
          break;

        case("textfield"):
          return new descartesJS.TextField(this.parent, controlObj);
          break;

        case("menu"):
          return new descartesJS.Menu(this.parent, controlObj);
          break;

        case("scrollbar"):
          return new descartesJS.Scrollbar(this.parent, controlObj);
          break;

        default:
          return new descartesJS.Spinner(this.parent, controlObj);
          break;
      }
    }

    else if (controlObj.type === "video") {
      return new descartesJS.Video(this.parent, controlObj);
    }

    else if (controlObj.type === "audio") {
      return new descartesJS.Audio(this.parent, controlObj);
    }

    else if (controlObj.type === "graphic") {
      return new descartesJS.GraphicControl(this.parent, controlObj);
    }

    else if (controlObj.type === "text") {
      return new descartesJS.TextArea(this.parent, controlObj);
    }

    else if (controlObj.type === "checkbox") {
      return new descartesJS.Checkbox(this.parent, controlObj);
    }

  }

  /**
   * Parse and create a graphic
   * @param {String} values is the string containing the values ​​that define the graphic
   * @param {Boolean} abs_coord is a boolean specifying the use of absolute coordinate in macro graphics
   * @param {Boolena} background is a boolean specifying that draw in the background the macro graphics
   * @param {Node} rotateExp is a expression that specify a rotation for the macro graphics
   * @return {Graphic} return a graphic constructed with the correspondign values
   */
  descartesJS.LessonParser.prototype.parseGraphic = function(values, abs_coord, background, rotateExp) {
    // object containing all the values ​​found in values
    graphicObj = { rotateExp: rotateExp, parameter: "t" };

    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);

    // traverse all values and asign to variables del graphic
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      babelValue = babel[values_i_0];

      //////////////////////////////////////////
      descartesJS.DEBUG.paramName = values_i_0;
      descartesJS.DEBUG.objectName = "Graphic";
      //////////////////////////////////////////

      if (values_i_1 != "") {
        switch(babelValue) {
          // type
          case("type"):
            // get the type for the debug
            descartesJS.DEBUG.idName = values_i_1;
          // text alignment
          case("align"):
          // ancho text
          case("anchor"):
          // linedash
          case("lineDash"):
            graphicObj[babelValue] = babel[values_i_1];
            break;

          // condition to draw the graphic in the background
          case("background"):
          // type of coordinates
          case("abs_coord"):
          // visible condition
          case("visible"):
          // editable condition
          case("editable"):
          // condition to use fixed notation in the text
          case("fixed"):
          // arc condition to use vectors
          case("vectors"):
          // bold text contidition
          case("bold"):
          // italic text condition
          case("italics"):
          // underline text condition
          case("underlined"):
            graphicObj[babelValue] = (babel[values_i_1] === "true");
            break;

          // color
          case("color"):
          // fill color
          case("fill"):
          // equation fill+ color
          case("fillP"):
          // equation fill- color
          case("fillM"):
          // arrow color
          case("arrow"):
          // trace
          case("trace"):
            // patch for catala
            if (babel[values_i_1] === "false") {
              graphicObj[babelValue] = "";
            }
            else {
              graphicObj[babelValue] = new descartesJS.Color(values_i_1, this.parent.evaluator);
            }
            break;

          // family parameter
          case("family"):
          // parameter of a curve
          case("parameter"):
          // information
          case("info"):
          // text font
          case("font"):
          // text font_family
          case("font_family"):
          // macro name
          case("name"):
          // arc init angle
          case("init"):
          // arc end angle
          case("end"):
            graphicObj[babelValue] = values_i_1;
            break;

          // drawif condition
          case("drawif"):
          // width
          case("width"):
          // number of decimals of the text in the graphic
          case("decimals"):
          // size
          case("size"):
          // arrow spear size
          case("spear"):
          // arc center
          case("center"):
          // arc radius
          case("radius"):
          // border radius
          case("border_radius"):
          // image opacity
          case("opacity"):
          // image and macro rotation
          case("inirot"):
          // macro initial position
          case("inipos"):
          // range
          case("range"):
          // font size
          case("font_size"):
            if (values_i_1 != "") {
              graphicObj[babelValue] = this.parser.parse(values_i_1);
            }
            break;

          // space identifier
          case("space"):
            graphicObj["spaceID"] = values_i_1;
            break;

          // expression
          case("expresion"):
            if (values_i_1 != "") {
              if (graphicObj.type != "macro") {
                graphicObj["expresion"] = this.parser.parse(values_i_1);
                graphicObj["expresionString"] = values_i_1;
              } else {
                graphicObj["expresion"] = values_i_1;
              }
            }
            break;

          // text
          case("text"):
            graphicObj["text"] = this.parseText(values_i_1);
            break;

          // file name
          case("file"):
            var fileTmp = values_i_1.replace(/&squot;/g, "'");
            if ((fileTmp.charAt(0) === "[") && (fileTmp.charAt(fileTmp.length-1) === "]")) {
              fileTmp = fileTmp.substring(1, fileTmp.length-1);
            }
            // explicit image file name
            if (fileTmp.match(regExpImage)) {
              fileTmp = "'" + fileTmp + "'";
            }
            graphicObj["file"] = this.parser.parse(fileTmp);
            break;

          // color border
          case("border"):
            if ( (values_i_1 != "") && (babel[values_i_1] != "false") ) {
              graphicObj["border"] = new descartesJS.Color(values_i_1, this.parent.evaluator);
            }
            break;

          // any variable missing
          default:
            if (graphicObj["family"] != undefined) {
              if (values_i_0.substring(0, graphicObj["family"].length+1) === (graphicObj["family"] + ".")) {

                switch(babel[values_i_0.substring(graphicObj["family"].length+1)]) {

                  // find the interval variable of a family
                  case("interval"):
                    if (values_i_1 != "") {
                      graphicObj["family_interval"] = this.parser.parse(values_i_1);
                    }
                    break;

                  // find the number of steps in the family
                  case("steps"):
                    if (values_i_1 != "") {
                      graphicObj["family_steps"] = this.parser.parse(values_i_1);
                    }
                    break;
                }
                break;
              }
            }

            if (graphicObj["parameter"] != undefined) {

              if (values_i_0.match(graphicObj["parameter"] + ".")) {

                // default parameter in a macro
                if (graphicObj["parameter"] !== values_i_0.substring(0, values_i_0.indexOf(graphicObj["parameter"]) +graphicObj["parameter"].length)) {
                  graphicObj["parameter"] = values_i_0.substring(0, values_i_0.indexOf(graphicObj["parameter"]) +graphicObj["parameter"].length);
                }

                switch (babel[values_i_0.substring(graphicObj["parameter"].length +1)]) {

                  // find the interval variable of a parameter
                  case("interval"):
                    if (values_i_1 != "") {
                      graphicObj["parameter_interval"] = this.parser.parse(values_i_1);
                    }
                    break;

                  // find the number of steps in the parameter
                  case("steps"):
                    if (values_i_1 != "") {
                      graphicObj["parameter_steps"] = this.parser.parse(values_i_1);
                    }
                    break;
                }
                break;
              }
            }

            console.log("Propiedad del grafico no identificada: <" + values_i_0 + "> valor: <" + values_i_1 +">");
            break;
        }
      } // end switch

    } // end if

    // MACRO //
    // when absolute coordinates are used
    if (abs_coord) {
      graphicObj.abs_coord = abs_coord;
    }
    // if have to draw the macro in the background
    if (background) {
      graphicObj.background = background;
    }
    // MACRO //

    switch(graphicObj.type) {
      case("text"):
        return new descartesJS.Text(this.parent, graphicObj);
        break;

      case("image"):
        return new descartesJS.Image(this.parent, graphicObj);
        break;

      case("point"):
        return new descartesJS.Point(this.parent, graphicObj);
        break;

      case("polygon"):
        return new descartesJS.Polygon(this.parent, graphicObj);
        break;

      case("arc"):
        return new descartesJS.Arc(this.parent, graphicObj);
        break;

      case("segment"):
        return new descartesJS.Segment(this.parent, graphicObj);
        break;

      case("arrow"):
        return new descartesJS.Arrow(this.parent, graphicObj);
        break;

      case("macro"):
        return new descartesJS.Macro(this.parent, graphicObj);
        break;

      case("curve"):
        return new descartesJS.Curve(this.parent, graphicObj);
        break;

      case("equation"):
        return new descartesJS.Equation(this.parent, graphicObj);
        break;

      case("sequence"):
        return new descartesJS.Sequence(this.parent, graphicObj);
        break;

      case("rectangle"):
        return new descartesJS.Rectangle(this.parent, graphicObj);
        break;

      case("fill"):
        return new descartesJS.Fill(this.parent, graphicObj);
        break;

      default:
        break;
    }

  }

  /**
   * Parse and create a 3D graphic
   * @param {String} values is the string containing the values ​​that define the 3D graphic
   * @param {Boolean} abs_coord is a boolean specifying the use of absolute coordinate in macro graphics
   * @param {Boolena} background is a boolean specifying that draw in the background the macro graphics
   * @param {Node} rotateExp is a expression that specify a rotation for the macro graphics
   * @return {3DGraphic} return a 3D graphic constructed with the correspondign values
   */
  descartesJS.LessonParser.prototype.parse3DGraphic = function(values, abs_coord, background, rotateExp) {
    // object containing all the values ​​found in values
    graphicObj = { rotateExp:rotateExp };
    graphicObj["parameter"] = "t";

    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);

    // traverse all values and asign to variables del graphic
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      babelValue = babel[values_i_0];

      //////////////////////////////////////////
      descartesJS.DEBUG.paramName = values_i_0;
      descartesJS.DEBUG.objectName = "Graphic3D";
      //////////////////////////////////////////

      switch(babelValue) {
        // type
        case("type"):
        // get the type for the debug
        descartesJS.DEBUG.idName = values_i_1;
        // ilumination model
        case("model"):
        // linedash
        case("lineDash"):
          graphicObj[babelValue] = babel[values_i_1];
          break;

        // condition to draw the graphic in the background
        case("background"):
        // condition to use fixed notation in the text
        case("fixed"):
        // condition to calculate the intersection edges of faces
        case("split"):
        // bold text contidition
        case("bold"):
        // italic text condition
        case("italics"):
        // underline text condition
        case("underlined"):
          graphicObj[babelValue] = (babel[values_i_1] === "true");
          break;

        // condition to draw the edges
        case("edges"):
        // patch for catala
        if (babel[values_i_1] === "false") {
          graphicObj[babelValue] = "";
        }
        else {
          if (babel[values_i_1] === "true") {
            values_i_1 = "808080";
          }
          graphicObj[babelValue] = new descartesJS.Color(values_i_1, this.parent.evaluator);
        }
        break;

        // color
        case("color"):
        // back face color
        case("backcolor"):
          graphicObj[babelValue] = new descartesJS.Color(values_i_1, this.parent.evaluator);
          break;

        // drawif condition
        case("drawif"):
        // width
        case("width"):
        // lenght
        case("length"):
        // height
        case("height"):
        // R
        case("R"):
        // r
        case("r"):
        // number of decimals of the text in the graphic
        case("decimals"):
        // Nu parameter
        case("Nu"):
        // Nv parameter
        case("Nv"):
        // initial position
        case("inipos"):
        // end position
        case("endpos"):
        // slope angle of the text
        case("offset_angle"):
        // offset from the point to the text
        case("offset_dist"):
        // font size
        case("font_size"):
          if (values_i_1 != "") {
            graphicObj[babelValue] = this.parser.parse(values_i_1);
          }
          break;

        // family parameter
        case("family"):
        // curve parameter
        case("parameter"):
        // font text
        case("font"):
        // text font_family
        case("font_family"):
        // name
        case("name"):
        // initial rotation
        case("inirot"):
        // end rotation
        case("endrot"):
        // information
        case("info"):
          graphicObj[babelValue] = values_i_1;
          break;

        // space identifier
        case("space"):
          graphicObj["spaceID"] = values_i_1;
          break;

        // expression
        case("expresion"):
          if ((graphicObj.type != "macro") && (graphicObj.type != "curve") && (graphicObj.type != "surface")) {
            graphicObj["expresion"] = this.parser.parse(values_i_1);
            graphicObj["expresionString"] = values_i_1;
          } else {
            // graphicObj["expresion"] = values_i_1.replace(/\\n/g, " ").replace(/;/g, " ");
            graphicObj["expresion"] = values_i_1.replace(/\\n/g, ";");
          }
          break;

        // text
        case("text"):
          var tmpText = this.parseText(values_i_1);

          for (var ii=0, ll=tmpText.length; ii<ll; ii++) {
            tmpText[ii] = this.parser.parse(tmpText[ii], false);
          }
          graphicObj["text"] = tmpText;
          break;

        // file name
        case("file"):
          var fileTmp = values_i_1.replace(/&squot;/g, "'");

          if ((fileTmp.charAt(0) === "[") && (fileTmp.charAt(fileTmp.length-1) === "]")) {
            fileTmp = fileTmp.substring(1, fileTmp.length-1);
          }

          if (fileTmp.match(/./)) {
            fileTmp = "'" + fileTmp + "'";
          }

          graphicObj["file"] = this.parser.parse(fileTmp);
          break;

        //
        default:
          if (graphicObj["family"] !== undefined) {
            if (values_i_0.substring(0, graphicObj["family"].length+1) === (graphicObj["family"] + ".")) {

              // family interval
              if (babel[values_i_0.substring(graphicObj["family"].length+1)] === "interval") {
                if (values_i_1 != "") {
                  graphicObj["family_interval"] = this.parser.parse(values_i_1);
                }
                break;
              }
              // family steps
              else {
                if (values_i_1 != "") {
                  graphicObj["family_steps"] = this.parser.parse(values_i_1);
                }
                break;
              }
            }
          }

          console.log("Propiedad del grafico 3D no identificada: <" + values_i_0 + "> valor: <" + values_i_1 +">");
          break;
      }
    }
    switch(graphicObj.type) {
      case("point"):
        return new descartesJS.Point3D(this.parent, graphicObj);
        break;

      case("segment"):
        return new descartesJS.Segment3D(this.parent, graphicObj);
        break;

      case("polygon"):
        return new descartesJS.Polygon3D(this.parent, graphicObj);
        break;

      case("curve"):
        return new descartesJS.Curve3D(this.parent, graphicObj);
        break;

      case("triangle"):
        return new descartesJS.Triangle3D(this.parent, graphicObj);
        break;

      case("face"):
        return new descartesJS.Face3D(this.parent, graphicObj);
        break;

      case("polireg"):
        return new descartesJS.Polireg3D(this.parent, graphicObj);
        break;

      case("surface"):
        return new descartesJS.Surface3D(this.parent, graphicObj);
        break;

      case("text"):
        return new descartesJS.Text3D(this.parent, graphicObj);
        break;

      case("cube"):
      case("box"):
      case("tetrahedron"):
      case("octahedron"):
      case("sphere"):
      case("dodecahedron"):
      case("icosahedron"):
      case("ellipsoid"):
      case("cone"):
      case("cylinder"):
      case("torus"):
      case("mesh"):
        return new descartesJS.OtherGeometry(this.parent, graphicObj);
        break;

      case("macro"):
        return new descartesJS.Macro3D(this.parent, graphicObj);
        break;

      default:
        // console.log(graphicObj.type);
        break;
    }
  }

  /**
   * Parse and create an auxiliar
   * @param {String} values is the string containing the values ​​that define the auxiliar
   * @return {Auxiliary} return a auxiliar constructed with the correspondign values
   */
  descartesJS.LessonParser.prototype.parseAuxiliar = function(values) {
    // object containing all the values ​​found in values
    auxiliarObj = {};

    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);

    for(var i=0, l=values.length; i<l; i++) {
      values[i][1] = (values[i][1]).replace(/&squot;/g, "'");
    }

    // traverse all values and asign to variables del auxiliar
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      babelValue = babel[values_i_0];

      //////////////////////////////////////////
      descartesJS.DEBUG.paramName = values_i_0;
      descartesJS.DEBUG.objectName = "Auxiliar";
      //////////////////////////////////////////

      switch(babelValue) {
        // information
        case("info"):
          auxiliarObj[babelValue] = values_i_1;
          break;

        // identifier
        case("id"):
          // get the id for the debug
          descartesJS.DEBUG.idName = values_i_1;
        // file name of a vector
        case("file"):
        // init expression
        case("init"):
        // do expression
        case("doExpr"):
        // while expression
        case("whileExpr"):
        // function range
        case("range"):
        // local variables
        case("local"):
        // expression
        case("expresion"):
        // event condition
        case("condition"):
        // event parameter
        case("parameter"):
          auxiliarObj[babelValue] = values_i_1.replace(/&squot;/g, "'");
          break;

        // editable condition
        case("editable"):
        // constant condition
        case("constant"):
        // vector condition
        case("array"):
        // matrix condition
        case("matrix"):
        // algorithm condition
        case("algorithm"):
        // event expression
        case("event"):
        // sequence condition
        case("sequence"):
          auxiliarObj[babelValue] = (babel[values_i_1] === "true");
          break;

        // number of elements in a vector
        case("size"):
        // number of rows in a matrix
        case("rows"):
        // number of columns in a matrix
        case("columns"):
          auxiliarObj[babelValue] = this.parser.parse(values_i_1);
          break;

        // type of evaluation
        case("evaluate"):
        // // event expression
        // case("event"):
        // execution expression of an event
        case("execution"):
        // relative position of event mesagges
        case("msg_pos"):
        // event action
        case("action"):
        // type
        case("type"):
          auxiliarObj[babelValue] = babel[values_i_1];
          break;

        // x
        case("x"):
        // y
        case("y"):
        // width
        case("width"):
        // height
        case("height"):
          auxiliarObj[babelValue] = this.parser.parse(values_i_1);
          break;
        //////////////////////////////

        // library documentation
        case("doc"):
          break;

        // any variable missing
        default:
          var ind    = values_i_0.indexOf(".");
          var prefix = babel[values_i_0.substring(0,ind)];
          var sufix  = babel[values_i_0.substring(ind+1)];

          // find the font of the paramether
          if ((prefix === "parameter") && (sufix === "font")) {
            auxiliarObj["parameterFont"] = values_i_1;
            break;
          }

          console.log("Propiedad del auxiliar no identificada: <" + values_i_0 + "> valor: <" + values_i_1 + ">");
          break;
      }
    }

    if (auxiliarObj.sequence) {
      auxiliarObj.type = "sequence";
    }
    else if (auxiliarObj.constant) {
      auxiliarObj.type = "constant";
    }
    else if ((auxiliarObj.algorithm) && (auxiliarObj.evaluate)) {
      auxiliarObj.type = "algorithm";
    }
    else if ((auxiliarObj.array) && (!auxiliarObj.matrix) && (auxiliarObj.id.charAt(auxiliarObj.id.length-1) != ")")) {
      auxiliarObj.type = "vector";
    }
    else if ((auxiliarObj.matrix) && (auxiliarObj.id.charAt(auxiliarObj.id.length-1) != ")")) {
      auxiliarObj.type = "matrix";
    }
    else if ((auxiliarObj.event) && (auxiliarObj.id.charAt(auxiliarObj.id.length-1) != ")")) {
      auxiliarObj.type = "event";
    }
    else if (auxiliarObj.type === "library") {
      auxiliarObj.type = "library";
    }
    else {
      if (auxiliarObj.id.charAt(auxiliarObj.id.length-1) === ")") {
        auxiliarObj.type = "function";
      }
      else {
        auxiliarObj.type = "variable";
      }
    }
    descartesJS.DEBUG.typeName = auxiliarObj.type;



    switch(auxiliarObj.type) {
      case("sequence"):
        var auxS = new descartesJS.Function(this.parent, auxiliarObj);
        break;

      case("constant"):
        // only once evaluation
        var auxC = new descartesJS.Constant(this.parent, auxiliarObj);

        // always evaluation
        if ((auxiliarObj.evaluate) && (auxiliarObj.evaluate === "always")) {
          this.parent.auxiliaries.push(auxC);
        }
        break;

      case("algorithm"):
        this.parent.auxiliaries.push( new descartesJS.Algorithm(this.parent, auxiliarObj) );
        break;

      case("vector"):
        // only once evaluation
        var auxV = new descartesJS.Vector(this.parent, auxiliarObj);

        // always evaluation
        if ((auxiliarObj.evaluate) && (auxiliarObj.evaluate === "always")) {
          this.parent.auxiliaries.push(auxV);
        }
        break;

      case("matrix"):
        // only once evaluation
        var auxM = new descartesJS.Matrix(this.parent, auxiliarObj);

        // always evaluation
        if ((auxiliarObj.evaluate) && (auxiliarObj.evaluate === "always")) {
          this.parent.auxiliaries.push(auxM);
        }
        break;

      case("event"):
        this.parent.events.push( new descartesJS.Event(this.parent, auxiliarObj) );
        break;

      case("library"):
        new descartesJS.Library(this.parent, auxiliarObj);
        break;

      case("function"):
        new descartesJS.Function(this.parent, auxiliarObj);
        break;

      case("variable"):
        new descartesJS.Variable(this.parent, auxiliarObj);
        break;

      default:
        break;
      
    }
  }

  /**
   * Parse and create an action
   * @param {String} theAction is the string containing the values ​​that define the action
   * @return {Action} return a action constructed with the correspondign values
   */
  descartesJS.LessonParser.prototype.parseAction = function(theAction) {
    theAction_action = theAction.action;
    theAction_parent = theAction.parent;
    theAction_parameter = theAction.parameter;

    // if has some action then create it
    if (theAction_action) {
      switch (theAction_action) {
        // show a message
        case("message"):
          return (new descartesJS.Message(theAction_parent, theAction_parameter));
          break;

        // performs calculations
        case("calculate"):
          return (new descartesJS.Calculate(theAction_parent, theAction_parameter));
          break;

        // open an URL
        case("openURL"):
          return (new descartesJS.OpenURL(theAction_parent, theAction_parameter));
          break;

        // open a scene
        case("openScene"):
          return (new descartesJS.OpenScene(theAction_parent, theAction_parameter));
          break;

        // show credits
        case("about"):
          return (new descartesJS.About(theAction_parent, theAction_parameter));
          break;

        // show the editor
        case("config"):
          return (new descartesJS.Config(theAction_parent, theAction_parameter));
          break;

        // init the scene
        case("init"):
          return (new descartesJS.Init(theAction_parent, theAction_parameter));
          break;

        // clear the trace
        case("clear"):
          return (new descartesJS.Clear(theAction_parent, theAction_parameter));
          break;

        // start the animation
        case("animate"):
          return (new descartesJS.Animate(theAction_parent, theAction_parameter));
          break;

        // init the animation
        case("initAnimation"):
          return (new descartesJS.InitAnimation(theAction_parent, theAction_parameter));
          break;

        // play audio
        case("playAudio"):
          return (new descartesJS.PlayAudio(theAction_parent, theAction_parameter));
          break;

        default:
          console.log("Accion no soportada: <" + theAction_action + ">");
          break;
      }
    }
    // if has not some action then return a function that does nothing
    else {
      return {execute : function() {}};
    }
  }

  /**
   * Parse and create an animation
   * @param {String} values is the string containing the values ​​that define the animation
   * @return {Animation} return a animation constructed with the correspondign values
   */
  descartesJS.LessonParser.prototype.parseAnimation = function(values) {
    // object containing all the values ​​found in values
    var animationObj = {};

    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);

    // traverse all values and asign to variables of the animation
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      babelValue = babel[values_i_0];

      switch(babelValue) {

        // identifier
        case("id"):
        // time delay
        case("delay"):
        // init expression
        case("init"):
        // do expression
        case("doExpr"):
        // while expression
        case("whileExpr"):
          animationObj[babelValue] = values_i_1.replace(/&squot;/g, "'");
          break;

        // condition to show the controls
        case("controls"):
        // condition to star automatically
        case("auto"):
        // condition to loop
        case("loop"):
        // algorithm condition
        case("algorithm"):
        // type of evaluation
        case("evaluate"):
          animationObj[babelValue] = (babel[values_i_1] === "true");
          break;

        // any variable missing
        default:
          console.log("Propiedad de la animacion no identificada: <" + values_i_0 + ">  <" + values_i_1 + ">");
          break;
      }
    }

    return (new descartesJS.Animation(this.parent, animationObj));
  }

  /**
   *
   */
  descartesJS.LessonParser.prototype.parsePleca = function(values, w) {
    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);

    // object containing all the values ​​found in values
    plecaObj = {
                title:        "",
                subtitle:     "",
                subtitlines:  0,
                bgcolor:      "#536891",
                fgcolor:      "white",
                align:        "left",
                titleimage:   "",
                titlefont:    "SansSerif,BOLD,20",
                subtitlefont: "SansSerif,PLAIN,18"
             };

    // traverse all values and asign to variables of the pleca
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      switch(values_i_0) {
        // title text
        case("title"):
          plecaObj.title = values_i_1;
          break;

        // subtitle text
        case("subtitle"):
          plecaObj.subtitle = values_i_1;
          break;

        // number of lines of the subtitle
        case("subtitlines"):
          plecaObj.subtitlines = values_i_1;
          break;

        // background color
        case("bgcolor"):
          if (values_i_1 != "") {
            plecaObj.bgcolor = (new descartesJS.Color(values_i_1, this.parent.evaluator)).getColor();
          }
          break;

        // text color
        case("fgcolor"):
          if (values_i_1 != "") {
            plecaObj.fgcolor = (new descartesJS.Color(values_i_1, this.parent.evaluator)).getColor();
          }
          break;

        // alignment
        case("align"):
          if (values_i_1 != "") {
            plecaObj.align = values_i_1;
          }
          break;

        // file image
        case("titleimage"):
          plecaObj.titleimage = values_i_1;
          break;

        // title font
        case("titlefont"):
          plecaObj.titlefont = (values_i_1 != "") ? descartesJS.convertFont(values_i_1) : descartesJS.convertFont(plecaObj.titlefont);
          break;

        // subtitle font
        case("subtitlefont"):
          plecaObj.subtitlefont = (values_i_1 != "") ? descartesJS.convertFont(values_i_1) : descartesJS.convertFont(plecaObj.subtitlefont);
          break;

        // any variable missing
        default:
          console.log("Propiedad de la pleca no identificada: <" + values_i_0 + ">  <" + values_i_1 + ">");
          break;
      }
    }

    // the pleca is empty
    if ((plecaObj.title === "") && (plecaObj.subtitle === "")) {
      return document.createElement("div");
    }

    // the subtitle font size
    subtitleFontSize = plecaObj.subtitlefont.substring(0, plecaObj.subtitlefont.indexOf("px"));
    subtitleFontSize = subtitleFontSize.substring(subtitleFontSize.lastIndexOf(" "));

    // the image and its height if it exists
    if (plecaObj.titleimage != "") {
      image = this.parent.getImage(plecaObj.titleimage);
      imageHeight = image.height;
    }

    // create the container
    plecaObj.divPleca = document.createElement("div");
    plecaObj.divPleca.setAttribute("id", "descartesPleca");

    // if there is an image, then the height of the pleca is adjusted to the height of the image
    if (imageHeight) {
      plecaObj.divPleca.setAttribute("style", "position:absolute;left:0;top:0;text-align:" + plecaObj.align + ";width:" + (w-2*paddingSides) + "px;height:"+ (imageHeight-16) + "px;background:" + plecaObj.bgcolor + ";color:" + plecaObj.fgcolor + ";padding-top:8px;padding-bottom:8px;padding-left:" + paddingSides + "px;padding-right:" + paddingSides + "px;margin:0;overflow:hidden;z-index:100;");

      image.setAttribute("style", "position: absolute;left:0;top:0;z-index:-1;width:100%;height:100%;");
      plecaObj.divPleca.appendChild(image);
    }
    // if there is not an image, the the height is not specified and the contaier guest the height
    else {
      plecaObj.divPleca.setAttribute("style", "position:absolute;left:0;top:0;text-align:" + plecaObj.align + ";width:" + (w-2*paddingSides) + "px;background:" + plecaObj.bgcolor + ";color:" + plecaObj.fgcolor + ";padding-top:12px;padding-bottom:12px;padding-left:" + paddingSides + "px;padding-right:" + paddingSides + "px;margin:0;z-index:100;");
    }

    // creates the container for the title and the content is added
    divTitle = document.createElement("div");
    divTitle.setAttribute("style", "padding:0;margin:0;font:" + plecaObj.titlefont + ";overflow:hidden;white-space:nowrap;");
    divTitle.innerHTML = plecaObj.title;

    // create the container for the subtitle
    divSubTitle = document.createElement("div");

    // if the number of lines of the subtitle is equal to 1 then the height of the subtitle fits only one line
    if (parseInt(plecaObj.subtitlines) === 1) {
      tempDecrement = 0;

      // creates a temporary container that serves as a substitute container for the subtitle, to determine the font size of the subtitle container
      tempDiv = document.createElement("div");
      tempDiv.innerHTML = plecaObj.subtitle;
      document.body.appendChild(tempDiv);
      tempFontSize = subtitleFontSize;

      do {
        tempFontSize = tempFontSize - tempDecrement;

        // style is assigned to temporary container to measure the number of lines in the text
        tempDiv.setAttribute("style", "padding:0;margin:0;font:" + plecaObj.subtitlefont + ";font-size:" + tempFontSize + "px;width:" + (w-2*paddingSides) + "px;line-height:" + tempFontSize + "px;")

        // find the height of the temporary container
        tempDivHeight = tempDiv.offsetHeight;
        // find the number of lines by dividing the height between the height of a line
        noLines = tempDivHeight / tempFontSize;

        tempDecrement = 1;
      }
      // If the number of lines is one or the font size becomes smaller than 8px then the search ends
      while ((noLines > 1) && (tempFontSize > 8));

      // temporary container is removed from the body
      document.body.removeChild(tempDiv);

      // assign to the subtitle style the proper font size
      divSubTitle.setAttribute("style", "padding:0;margin:0;font:" + plecaObj.subtitlefont + ";font-size:" + tempFontSize + "px;line-height: 110%;overflow:hidden;white-space:nowrap;");
    }
    // if the number of lines is different from 1, then the number of lines is ignored
    else {
      divSubTitle.setAttribute("style", "padding:0;margin:0;font:" + plecaObj.subtitlefont + ";line-height:110%;");
    }
    // assign the content to the subtitle
    divSubTitle.innerHTML = plecaObj.subtitle;

    plecaObj.divPleca.appendChild(divTitle);
    plecaObj.divPleca.appendChild(divSubTitle);

    plecaObj.divPleca.imageHeight = imageHeight;
    return plecaObj.divPleca;
  }

  /**
   * Removes single quotes in the value and divided into an array of parameters name and value pairs
   * @param {String} values the string to divided
   * @return {Array<Array<String>>} return the array of name and value pairs
   */
  descartesJS.LessonParser.prototype.split = function(values) {
    if (typeof(values) != "string") {
      return [];
    }

    values = values || "";
    values = values.replace(/\\'/g, "’");

    splitValues = [];
    pos = i = initPosToken = endPosToken = 0;
    initToken = stringToken = valueToken = false;

    // traverse the string to split
    while (pos < values.length) {
      // ignoring the blank spaces if not started the identification of a token
      if ((values.charAt(pos) === " ") && (!initToken)) {
        pos++;
      }

      // find a character which is different from a blank space
      if ((values.charAt(pos) !== " ") && (!initToken)) {
        initToken = true;
        initPosToken = pos;
      }

      // values ​​are specified as a string
      if ((values.charAt(pos) === "=") && (values.charAt(pos+1) === "'") && (!stringToken)) {
        stringToken = true;

        splitValues[i] = [values.substring(initPosToken, pos)]

        initPosToken = pos+2;

        pos+=2;
      }

      if ((stringToken) && (values.charAt(pos) === "'")) {
        stringToken = false;

        initToken = false;

        splitValues[i].push(values.substring(initPosToken, pos));

        i++;
      }

      // values ​​are specified as a word sequence
      if ((values.charAt(pos) === "=") && (values.charAt(pos+1) !== "'") && (!stringToken)) {
        splitValues[i] = [values.substring(initPosToken, pos)]

        initPosToken = pos+1;

        pos++;

        // find the next space and equal sign
        tmpIndexEqual = (values.substring(pos)).indexOf("=");

        if (tmpIndexEqual === -1) {
          tmpIndexEqual = values.length;
          tmpIndexSpace = values.length;
        }
        else {
          tmpIndexEqual += pos;

          tmpIndexSpace = values.substring(pos, tmpIndexEqual).lastIndexOf(" ");
          if (tmpIndexSpace === -1) {
            tmpIndexSpace = values.length;
          }
          else {
            tmpIndexSpace += pos;
          }
        }

        splitValues[i].push(values.substring(initPosToken, tmpIndexSpace));
        i++;
        initToken = false;

        pos = tmpIndexSpace;
      }

      pos++;
    }

    return splitValues;
  }

  /**
   * Parse a text an construct a simple text or rtf text
   * @param {String} text the string text to parse
   * @param {Object} return a rtf text or a simple text
   */
  descartesJS.LessonParser.prototype.parseText = function(text) {
    text = text || "";
    // is a RTF text
    if (text.match(/^\{\\rtf1/)) {
      return this.RTFparser.parse(text.substring(10));
    }

    // is a simple text
    return new descartesJS.SimpleText(this.parent, text);
  }

  return descartesJS;
})(descartesJS || {}, babel);
