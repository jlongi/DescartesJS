/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS, babel) {
  if (descartesJS.loadLib) { return descartesJS; }

  var temp;
  var values_i_0;
  var values_i_1;
  var spaceObj;
  var controlObj;
  var graphicObj;
  var auxiliarObj;
  var regExpImage = /[\w-//]*(\.png|\.jpg|\.gif|\.svg|\.PNG|\.JPG|\.GIF|\.SVG)/g;

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
  var parentesisStack;
  var lastSplitIndex;

  var tmpColor;
  var splitColor;
  var hexColor;

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

      switch(babel[values_i_0]) {
        //
        case("rowsNorth"):
          buttonConfigObj["rowsNorth"] = parseInt(values_i_1);
          break;

        //
        case("rowsSouth"):
          buttonConfigObj["rowsSouth"] = parseInt(values_i_1);
          break;

        //
        case("widthEast"):
          buttonConfigObj["widthEast"] = parseInt(values_i_1);
          break;

        //
        case("widthWest"):
          buttonConfigObj["widthWest"] = parseInt(values_i_1);
          break;

        //
        case("height"):
          buttonConfigObj["height"] = parseInt(values_i_1);
          break;

        //
        case("about"):
          buttonConfigObj["about"] = (babel[values_i_1] === "true");
          break;

        //
        case("config"):
          buttonConfigObj["config"] = (babel[values_i_1] === "true");
          break;

        //
        case("init"):
          buttonConfigObj["init"] = (babel[values_i_1] === "true");
          break;

        //
        case("clear"):
          buttonConfigObj["clear"] = (babel[values_i_1] === "true");
          break;

        // any variable missing
        default:
          console.log("----- attributo de space no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
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
      
      switch(babel[values_i_0]) {
        // the type of the space (2D, 3D or another)
        case("type"):
          spaceObj["type"] = values_i_1;
          break;
          
        // identifier
        case("id"):
          spaceObj["id"] = values_i_1;
          break;
          
        // x position
        case("x"):
          temp = values_i_1;
          
          // if specified with a percentage use the parent container's width to get the value in pixels
          if (temp[temp.length-1] === "%") {
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
          temp = values_i_1;
          
          // if specified with a percentage use the parent container's width to get the value in pixels
          if (temp[temp.length-1] === "%") {
            temp = this.parent.container.width*parseFloat(temp)/100;
          }
          // if not specified with a percentage get the numerical value of the width
          else {
            temp = parseFloat(values_i_1);
            
            // whether to convert the value to a number the values ​​are different, then the width becomes the width of the parent container
            if (temp != values_i_1) {
              temp = this.parent.container.width; // default value
            }
          }
          
          spaceObj["w"] = temp;
          break;
          
        // height
        case("height"):
          temp = values_i_1;
          
          // if specified with a percentage use the parent container's height to get the value in pixels
          if (temp[temp.length-1] === "%") {
            temp = this.parent.container.height*parseFloat(temp)/100;
          } 
          // if not specified with a percentage get the numerical value of the height
          else {
            temp = parseFloat(values_i_1);
            
            // whether to convert the value to a number the values ​​are different, then the height becomes the height of the parent container
            if (temp != values_i_1) {
              temp = this.parent.container.height; // default value
            }
          }
          
          spaceObj["h"] = temp;
          break;
          
        // drawif condition
        case("drawif"):
          spaceObj["drawif"] = this.parser.parse(values_i_1);
          break;
          
        // fixed condition
        case("fixed"):
          spaceObj["fixed"] = (babel[values_i_1] === "true");
          break;
          
        // scale
        case("scale"):
          temp = parseFloat(values_i_1);
          
          // whether to convert the value to a number the values ​​are different, then use the default value
          // this case ocurrs when the scale has a no valid value
          if (temp.toString() != values_i_1) {
            temp =  48; // default value
          }          
          
          spaceObj["scale"] = temp;
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
        
        // how the background image is positioned
        case("bg_display"):
          spaceObj["bg_display"] = babel[values_i_1];
          break;
          
        // background color
        case("background"):
          spaceObj["background"] = this.convertColor(values_i_1);
          break;
          
        // color of the net
        case("net"):
          spaceObj["net"] = (babel[values_i_1] === "false") ? "" : this.convertColor(values_i_1);
          break;
          
        // color of the net 10
        case("net10"):
          spaceObj["net10"] = (babel[values_i_1] === "false") ? "" : this.convertColor(values_i_1);
          break;
          
        // color of the axis
        case("axes"):
          spaceObj["axes"] = (babel[values_i_1] === "false") ? "" : this.convertColor(values_i_1);
          break;

        // color of the coordinate text of the mouse
        case("text"):
          spaceObj["text"] = (babel[values_i_1] === "false") ? "" : this.convertColor(values_i_1);
          break;
          
        // condition to show the numbers in the space
        case("numbers"):
          spaceObj["numbers"] = (babel[values_i_1] === "true");
          break;
          
        // text of the X axis
        case("x-axis"):
          spaceObj["x_axis"] = (babel[values_i_1] === "false") ? "" : values_i_1;
          break;
          
        // text of the Y axis
        case("y-axis"):
          spaceObj["y_axis"] = (babel[values_i_1] === "false") ? "" : values_i_1;
          break;
          
        // sensitive to mouse movements condition
        case("sensitive_to_mouse_movements"):
          spaceObj["sensitive_to_mouse_movements"] = (babel[values_i_1] === "true");
          break;
          
        // control identifier (for rtf positioning)
        case("cID"):
          spaceObj["cID"] = values_i_1;
          break;
          
        // space 3D
        case("R3"):
          spaceObj["R3"] = (babel[values_i_1] === "true");
          break;
          
        // render mode sort, painter, raytrace
        case("render"):
          spaceObj["render"] = babel[values_i_1];
          break;
          
        // split option for the render
        case("split"):
          spaceObj["split"] = (babel[values_i_1] === "true");
          break;
          
        // file name of an external space
        case("file"):
          spaceObj["file"] = values_i_1;
          break;
          
        // any variable missing
        default:
          console.log("----- attributo de space no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
          break;
      }   
    }

    if ((spaceObj.type === "R2") || (this.parent.version < 4)) {
      return new descartesJS.Space2D(this.parent, spaceObj);
    }
    
    else if (spaceObj.type === "R3") {
      return new descartesJS.Space3D(this.parent, spaceObj);
    }

    else if (spaceObj.type === "AP") {
      return new descartesJS.SpaceAP(this.parent, spaceObj);
    }
    
    else if (spaceObj.type === "HTMLIFrame") {
      return new descartesJS.SpaceHTML_IFrame(this.parent, spaceObj);
    }
  }

  /**
   * Parse and create a control
   * @param {String} values is the string containing the values ​​that define the control
   * @return {Control} return a control constructed with the correspondign values
   */
  descartesJS.LessonParser.prototype.parseControl = function(values) {
    // object containing all the values ​​found in values
    controlObj = {};
    
    // remove the single quotation marks of the string of values, and divides the values in parameter name and value
    values = this.split(values);

    // traverse all values and asign to variables to the control
    for (var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      switch( babel[values_i_0]) {
        
        // identifier
        case("id"):
          controlObj["id"] = values_i_1;
          break;
          
        // type
        case("type"):
          controlObj["type"] = babel[values_i_1.trim()];
          break;
          
        // interface (spinner, button, etc)
        case("gui"):
          controlObj["gui"] = babel[values_i_1];
          break;
          
        // region
        case("region"):
          controlObj["region"] = babel[values_i_1];
          break;
          
        // id of the containing space
        case("space"):
          controlObj["spaceID"] = values_i_1;
          break;
          
        // name
        case("name"):
          controlObj["name"] = values_i_1;
          break;
          
        // expresion of the position and size
        case("expresion"):
          controlObj["expresion"] = this.parser.parse(values_i_1.replace(")(", ","));
          break;
          
        // condition to use fixed notation in the text
        case("fixed"):
          controlObj["fixed"] = (babel[values_i_1] === "true");
          break;
          
        // visible condition
        case("visible"):
          controlObj["visible"] = (babel[values_i_1] === "true");
          break;
          
        // color text
        case("color"):
          controlObj["color"] = this.convertColor(values_i_1);
          break;
          
        // color-int text
        case("colorInt"):
          controlObj["colorInt"] = this.convertColor(values_i_1);
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
          
        // font size
        case("font_size"):
          controlObj["font_size"] = this.parser.parse(values_i_1); //parsear la posible expresion
          break;
          
        // image
        case("image"):
          controlObj["imageSrc"] = values_i_1;
          break;
          
        // action
        case("action"):
          controlObj["action"] = babel[values_i_1];
          break;
          
        // parameter of the action
        case("parameter"):
          controlObj["parameter"] = values_i_1;
          break;
          
        // drawif condition
        case("drawif"):
          controlObj["drawif"] = this.parser.parse(values_i_1);
          break;
          
        // activeif condition
        case("activeif"):
          controlObj["activeif"] = this.parser.parse(values_i_1);
          break;
          
        // tooltip
        case("tooltip"):
          controlObj["tooltip"] = values_i_1;
          break;
          
        // font tooltip
        case("tooltipFont"):
          controlObj["tooltipFont"] = values_i_1;
          break;
          
        // explanation
        case("Explanation"):
          controlObj["Explanation"] = values_i_1;
          break;
          
        // font explanation
        case("ExplanationFont"):
          controlObj["ExplanationFont"] = values_i_1;
          break;
          
        // relative position of control mesagges
        case("msg_pos"):
          controlObj["msg_pos"] = babel[values_i_1];
          break;
          
        // control identifier (for rtf positioning)
        case("cID"):
          controlObj["cID"] = values_i_1;
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
          
        // number of decimals of the text in the graphic control
        case("decimals"):
          controlObj["decimals"] = this.parser.parse(values_i_1);
          break;
          
        // minimum value
        case("min"):
          controlObj["min"] = this.parser.parse(values_i_1);
          break;
          
        // maximum value
        case("max"):
          controlObj["max"] = this.parser.parse(values_i_1);
          break;
          
        // increment
        case("incr"):
          if (values_i_1 != 0) {
            controlObj["incr"] = this.parser.parse(values_i_1);
          }
          break;
          
        // condition for the discrete increment
        case("discrete"):
          controlObj["discrete"] = (babel[values_i_1] === "true");
          break;
          
        // condition for a only text control
        case("onlyText"):
          controlObj["onlyText"] = (babel[values_i_1] === "true");
          break;
          
        // condition to evaluate the control
        case("evaluate"):
          controlObj["evaluate"] = (babel[values_i_1] === "true");
          break;
          
        // answer pattern
        case("answer"):
          controlObj["answer"] = values_i_1;
          break;
          
        // condition to show the text content in exponential notation
        case("exponentialif"):
          controlObj["exponentialif"] = parseFloat(values_i_1); // parse the posible expression
          break;

        // control graphic size
        case("size"):
          controlObj["size"] = this.parser.parse(values_i_1);
          break;
          
        // control graphic constraint
        case("constraint"):
          controlObj["constraintExpr"] = values_i_1;
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
          
        // control graphic trace
        case("trace"):
          controlObj["trace"] = this.convertColor(values_i_1);
          break;
          
        // control menu options
        case("options"):
          controlObj["options"] = values_i_1;
          break;
          
        // control graphic text font
        case("font"):
          controlObj["font"] = values_i_1;
          break;
          
        // file name of a video or audio control
        case("file"):
          controlObj["file"] = values_i_1;
          break;
          
        // condition to auto play a video or audio control
        case("autoplay"):
          controlObj["autoplay"] = (babel[values_i_1] === "true");
          break;
          
        // condition to loop a video or audio control
        case("loop"):
          controlObj["loop"] = (babel[values_i_1] === "true");
          break;
          
        // condition to show the controls of a video or audio control
        case("controls"):
          controlObj["controls"] = (babel[values_i_1] === "true");
          break;
          
        // video control poster image
        case("poster"):
          controlObj["poster"] = babel[values_i_1];
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
         
          console.log("----- attributo de control no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
          break;
      }
    }

    if (controlObj.type === "numeric") {

      if ((controlObj.gui === undefined) || (controlObj.gui === "spinner")) {
        return new descartesJS.Spinner(this.parent, controlObj);
      }
      
      else if (controlObj.gui === "button") {
        return new descartesJS.Button(this.parent, controlObj);
      }

      else if (controlObj.gui === "textfield") {
        return new descartesJS.TextField(this.parent, controlObj);
      }
      
      else if (controlObj.gui === "menu") {
        return new descartesJS.Menu(this.parent, controlObj);
      }
      
      else if (controlObj.gui === "scrollbar") {
        return new descartesJS.Scrollbar(this.parent, controlObj);
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
      
      switch(babel[values_i_0]) {
        
        // space identifier
        case("space"):
          graphicObj["spaceID"] = values_i_1;
          break;
          
        // type
        case("type"):
          graphicObj["type"] = babel[values_i_1];
          break;
          
        // condition to draw the graphic in the background
        case("background"):
          graphicObj["background"] = (babel[values_i_1] === "true");
          break;
          
        // color
        case("color"):
          graphicObj["color"] = this.convertColor(values_i_1);
          break;
          
        // drawif condition
        case("drawif"):
          graphicObj["drawif"] = this.parser.parse(values_i_1);
          break;
          
        // type of coordinates
        case("abs_coord"):
          graphicObj["abs_coord"] = (babel[values_i_1] === "true");
          break;
          
        // expression
        case("expresion"):
          if (graphicObj.type != "macro") {
            graphicObj["expresion"] = this.parser.parse(values_i_1);
            graphicObj["expresionString"] = values_i_1;
          } else {
            graphicObj["expresion"] = values_i_1;
          }
          break;
          
        // trace
        case("trace"):
          graphicObj["trace"] = this.convertColor(values_i_1);
          break;
          
        // family parameter
        case("family"):
          graphicObj["family"] = values_i_1;
          break;
          
        // parameter of a curve
        case("parameter"):
          graphicObj["parameter"] = values_i_1;
          break;
          
        // fill color
        case("fill"):
          graphicObj["fill"] = this.convertColor(values_i_1);
          break;
          
        // equation fill+ color
        case("fillP"):
          graphicObj["fillP"] = this.convertColor(values_i_1);
          break;
          
        // equation fill- color
        case("fillM"):
          graphicObj["fillM"] = this.convertColor(values_i_1);
          break;
          
        // width
        case("width"):
          graphicObj["width"] = this.parser.parse(values_i_1);
          break;
          
        // visible condition
        case("visible"):
          graphicObj["visible"] = (babel[values_i_1] === "true");
          break;
          
        // editable condition
        case("editable"):
          graphicObj["editable"] = (babel[values_i_1] === "true");
          break;
          
        // information
        case("info"):
          graphicObj["info"] = values_i_1;
          break;
          
        // text
        case("text"):
          graphicObj["text"] = this.parseText(values_i_1);
          break;
          
        // text font
        case("font"):
          graphicObj["font"] = values_i_1;
          break;
          
        // condition to use fixed notation in the text
        case("fixed"):
          graphicObj["fixed"] = (babel[values_i_1] === "true");
          break;
          
        // number of decimals of the text in the graphic
        case("decimals"):
          graphicObj["decimals"] = this.parser.parse(values_i_1);
          break;
          
        // size
        case("size"):
          graphicObj["size"] = this.parser.parse(values_i_1);
          break;
          
        // arrow spear size
        case("spear"):
          graphicObj["spear"] = this.parser.parse(values_i_1);
          break;
          
        // arrow color
        case("arrow"):
          graphicObj["arrow"] = this.convertColor(values_i_1);
          break;
          
        // arc center
        case("center"):
          graphicObj["center"] = this.parser.parse(values_i_1);
          break;
          
        // arc radius
        case("radius"):
          graphicObj["radius"] = this.parser.parse(values_i_1);
          break;
          
        // arc init angle
        case("init"):
          graphicObj["init"] = this.parser.parse(values_i_1);
          break;
          
        // arc end angle
        case("end"):
          graphicObj["end"] = this.parser.parse(values_i_1);
          break;
          
        // arc condition to use vectors
        case("vectors"):
          graphicObj["vectors"] = (babel[values_i_1] === "true");
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
          
        // image opacity
        case("opacity"):
          graphicObj["opacity"] = this.parser.parse(values_i_1);
          break;
          
        // image and macro rotation
        case("inirot"):
          graphicObj["inirot"] = this.parser.parse(values_i_1);
          break;
          
        // macro initial position
        case("inipos"):
          graphicObj["inipos"] = this.parser.parse(values_i_1);
          break;
          
        // macro name
        case("name"):
          graphicObj["name"] = values_i_1;
          break;
          
        // range
        case("range"):
          graphicObj["range"] = this.parser.parse(values_i_1);
          break;
          
        // color border
        case("border"):
          if (babel[values_i_1] != "false") {
            graphicObj["border"] = this.convertColor(values_i_1);
          }
          break;
          
        // text alignment
        case("align"):
          graphicObj["align"] = babel[values_i_1];
          break;
          
        // any variable missing
        default:
          if (graphicObj["family"] != undefined) {
            if (values_i_0.substring(0, graphicObj["family"].length+1) === (graphicObj["family"] + ".")) {
              
              switch(babel[values_i_0.substring(graphicObj["family"].length+1)]) {
                
                // find the interval variable of a family
                case("interval"):
                  graphicObj["family_interval"] = this.parser.parse(values_i_1);
                  break;
                  
                // find the number of steps in the family
                case("steps"):
                  graphicObj["family_steps"] = this.parser.parse(values_i_1);
                  break;
              }
              break;
            }
          }

          if (graphicObj["parameter"] != undefined) {
            if (values_i_0.substring(0, graphicObj["parameter"].length+1) === (graphicObj["parameter"] + ".")) {
            
              switch(babel[values_i_0.substring(graphicObj["parameter"].length+1)]) {
              
                // find the interval variable of a curve
                case("interval"):
                  graphicObj["parameter_interval"] = this.parser.parse(values_i_1);
                  break;
                
                // find the number of steps in the curve
                case("steps"):
                  graphicObj["parameter_steps"] = this.parser.parse(values_i_1);
                  break;
              }
              break
            }
          }

          console.log("----- attributo del graphic no identificado: <" + values_i_0 + "> valor: <" + values_i_1 +"> -----");
          break;
      }
    }
    
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

    if (graphicObj.type === "equation") {
      return new descartesJS.Equation(this.parent, graphicObj);
    }
    
    else if (graphicObj.type === "curve") {
      return new descartesJS.Curve(this.parent, graphicObj);
    }

    else if (graphicObj.type === "sequence") {
      return new descartesJS.Sequence(this.parent, graphicObj);
    }

    else if (graphicObj.type === "point") {
      return new descartesJS.Point(this.parent, graphicObj);
    }
    
    else if (graphicObj.type === "segment") {
      return new descartesJS.Segment(this.parent, graphicObj);
    }
    
    else if (graphicObj.type === "arrow") {
      return new descartesJS.Arrow(this.parent, graphicObj);
    }
    
    else if (graphicObj.type === "polygon") {
      return new descartesJS.Polygon(this.parent, graphicObj);
    }
    
    else if (graphicObj.type === "arc") {
      return new descartesJS.Arc(this.parent, graphicObj);
    }
    
    else if (graphicObj.type === "text") {
      return new descartesJS.Text(this.parent, graphicObj);
    }
    
    else if (graphicObj.type === "image") {
      return new descartesJS.Image(this.parent, graphicObj);
    }

    else if (graphicObj.type === "macro") {
      return new descartesJS.Macro(this.parent, graphicObj);
    }

    else if (graphicObj.type === "fill") {
      return new descartesJS.Fill(this.parent, graphicObj);
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
      
      switch(babel[values_i_0]) {
        
        // space identifier
        case("space"):
          graphicObj["spaceID"] = values_i_1;
          break;
          
        // type
        case("type"):
          graphicObj["type"] = babel[values_i_1];
          break;
          
        // condition to draw the graphic in the background
        case("background"):
          graphicObj["background"] = (babel[values_i_1] === "true");
          break;
          
        // color
        case("color"):
          graphicObj["color"] = this.convertColor(values_i_1);
          break;
          
        // drawif condition
        case("drawif"):
          graphicObj["drawif"] = this.parser.parse(values_i_1);
          break;
          
        // expression
        case("expresion"):
          if ((graphicObj.type != "macro") && (graphicObj.type != "curve") && (graphicObj.type != "surface")) {
            graphicObj["expresion"] = this.parser.parse(values_i_1);
            graphicObj["expresionString"] = values_i_1;
          } else {
            graphicObj["expresion"] = values_i_1;
          }
          break;
                    
        // family parameter
        case("family"):
          graphicObj["family"] = values_i_1;
          break;
          
        // curve parameter
        case("parameter"):
          graphicObj["parameter"] = values_i_1;
          break;
          
        // width
        case("width"):
          graphicObj["width"] = this.parser.parse(values_i_1);
          break;

        // lenght
        case("length"):
          graphicObj["length"] = this.parser.parse(values_i_1);
          break;
          
        // text
        case("text"):
          var tmpText = this.parseText(values_i_1);

          for (var ii=0, ll=tmpText.length; ii<ll; ii++) {
            tmpText[ii] = this.parser.parse(tmpText[ii], false);
          }
          graphicObj["text"] = tmpText;
          break;
          
        // font text
        case("font"):
          graphicObj["font"] = values_i_1;
          break;
          
        // condition to use fixed notation in the text
        case("fixed"):
          graphicObj["fixed"] = (babel[values_i_1] === "true");
          break;
          
        // number of decimals of the text in the graphic
        case("decimals"):
          graphicObj["decimals"] = this.parser.parse(values_i_1);
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

        // ilumination model
        case("model"):
          graphicObj["model"] = babel[values_i_1];
          break;
          
        // condition to draw the edges
        case("edges"):
          graphicObj["edges"] = (babel[values_i_1] === "true");
          break;

        // Nu parameter
        case("Nu"):
          graphicObj["Nu"] = this.parser.parse(values_i_1);
          break;          

        // Nv parameter
        case("Nv"):
          graphicObj["Nv"] = this.parser.parse(values_i_1);
          break;          
          
        // name
        case("name"):
          graphicObj["name"] = values_i_1;
          break;          
          
        // back face color
        case("backcolor"):
          graphicObj["backcolor"] = this.convertColor(values_i_1);
          break;

        // initial rotation
        case("inirot"):
          graphicObj["inirot"] = this.parser.parse(values_i_1);
          break;
          
        // end rotation
        case("endrot"):
          graphicObj["endrot"] = this.parser.parse(values_i_1);
          break;
          
        // initial position
        case("inipos"):
          graphicObj["inipos"] = this.parser.parse(values_i_1);
          break;
          
        // end position
        case("endpos"):
          graphicObj["endpos"] = this.parser.parse(values_i_1);
          break;          

        //////////////////////////////////////////////////////////////////////////////////////
          
        // any variable missing
        default:
          if (graphicObj["family"] != undefined) {
            if (values_i_0.substring(0, graphicObj["family"].length+1) === (graphicObj["family"] + ".")) {
              
              switch(babel[values_i_0.substring(graphicObj["family"].length+1)]) {
                
                // find the interval variable of a family
                case("interval"):
                  graphicObj["family_interval"] = this.parser.parse(values_i_1);
                  break;
                  
                // find the number of steps in the family
                case("steps"):
                  graphicObj["family_steps"] = this.parser.parse(values_i_1);
                  break;
              }
              break;
            }
          }

          if (graphicObj["parameter"] != undefined) {
            if (values_i_0.substring(0, graphicObj["parameter"].length+1) === (graphicObj["parameter"] + ".")) {
            
              switch(babel[values_i_0.substring(graphicObj["parameter"].length+1)]) {
              
                // find the interval variable of a curve
                case("interval"):
                  graphicObj["parameter_interval"] = this.parser.parse(values_i_1);
                  break;
                
                // find the number of steps in the curve
                case("steps"):
                  graphicObj["parameter_steps"] = this.parser.parse(values_i_1);
                  break;
              }
              break
            }
          }

          console.log("----- attributo del graphic no identificado: <" + values_i_0 + "> valor: <" + values_i_1 +"> -----");
          break;
      }
    }

    if (graphicObj.type === "point") {
      return new descartesJS.Point3D(this.parent, graphicObj);
    }

    else if (graphicObj.type === "segment") {
      return new descartesJS.Segment3D(this.parent, graphicObj);
    }
    
    else if (graphicObj.type === "polygon") {
      return new descartesJS.Polygon3D(this.parent, graphicObj);
    }
    
    else if (graphicObj.type === "curve") {
      return new descartesJS.Curve3D(this.parent, graphicObj);
    }
    
    else if (graphicObj.type === "triangle") {
      return new descartesJS.Triangle3D(this.parent, graphicObj);
    }
    
    else if (graphicObj.type === "face") {
      return new descartesJS.Face3D(this.parent, graphicObj);
    }
    
    else if (graphicObj.type === "polireg") {
      return new descartesJS.Polireg3D(this.parent, graphicObj);
    }

    else if (graphicObj.type === "surface") {
      return new descartesJS.Surface3D(this.parent, graphicObj);
    }

    else if (graphicObj.type === "text") {
      return new descartesJS.Text3D(this.parent, graphicObj);
    }
    
    else if (graphicObj.type === "mesh") {
      return new descartesJS.Mesh3D(this.parent, graphicObj);
    }

    else {
      console.log(graphicObj.type);
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

      switch(babel[values_i_0]) {
        // identifier
        case("id"):
          auxiliarObj["id"] = values_i_1;
          break;

        // editable condition
      	case("editable"):
      	  auxiliarObj["editable"] = (babel[values_i_1] === "true");
      	  break;
	  
        // constant condition
        case("constant"):
          auxiliarObj["constant"] = (babel[values_i_1] === "true");
          break;
        
        // vector condition
        case("array"):
          auxiliarObj["array"] = (babel[values_i_1] === "true");
          break;

        // number of elements in a vector
        case("size"):
          auxiliarObj["size"] = this.parser.parse(values_i_1);
          break;

        // file name of a vector
        case("file"):
          auxiliarObj["file"] = values_i_1;
          break;

        // matrix condition
        case("matrix"):
          auxiliarObj["matrix"] = (babel[values_i_1] === "true");
          break;
          
        // number of rows in a matrix
        case("rows"):
          auxiliarObj["rows"] = this.parser.parse(values_i_1);
          break;
          
        // number of columns in a matrix
        case("columns"):
          auxiliarObj["columns"] = this.parser.parse(values_i_1);
          break;

        // algorithm condition
        case("algorithm"):
          auxiliarObj["algorithm"] = (babel[values_i_1] === "true");
          break;
        
        // init expression
        case("init"):
          auxiliarObj["init"] = values_i_1;
          break;
          
        // do expression
        case("do"):
          auxiliarObj["doExpr"] = values_i_1;
          break;
          
        // while expression
        case("while"):
          auxiliarObj["whileExpr"] = values_i_1;
          break;
          
        // function range
        case("range"):
          auxiliarObj["range"] = values_i_1;
          break;

        // expression
        case("expresion"):
          auxiliarObj["expresion"] = values_i_1;
          break;
          
        // type of evaluation
        case("evaluate"):
          auxiliarObj["evaluate"] = babel[values_i_1];
          break;
          
        // event expression
        case("event"):
          auxiliarObj["event"] = babel[values_i_1];
          break;

        // event condition
        case("condition"):
          auxiliarObj["condition"] = values_i_1;
          break;
          
        // execution expression of an event
        case("execution"):
          auxiliarObj["execution"] = babel[values_i_1];
          break;

        // relative position of event mesagges
        case("msg_pos"):
          auxiliarObj["msg_pos"] = babel[values_i_1];
          break;

        // event action
        case("action"):
          auxiliarObj["action"] = babel[values_i_1];
          break;
          
        // event parameter
        case("parameter"):
          auxiliarObj["parameter"] = values_i_1;
          break;
          
        // sequence condition
        case("sequence"):
          auxiliarObj["sequence"] = (babel[values_i_1] === "true");
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
          
          console.log("----- attributo de auxiliar no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
          break;
      }
    }

    // sequence
    if (auxiliarObj.sequence) {
      var auxS = new descartesJS.AuxSequence(this.parent, auxiliarObj);
      return;
    }
    
    // constant
    else if (auxiliarObj.constant) {
      // only once evaluation
      var auxC = new descartesJS.Constant(this.parent, auxiliarObj);
      
      // always evaluation
      if ((auxiliarObj.evaluate) && (auxiliarObj.evaluate === "always")) {
        this.parent.auxiliaries.push(auxC);
      }
      return;
    }

    // algorithm
    else if ((auxiliarObj.algorithm) && (auxiliarObj.evaluate)) {
      // only once evaluation
      var auxA = new descartesJS.Algorithm(this.parent, auxiliarObj);
      
      // always evaluation
//       if (auxiliarObj.evaluate === "always") {
        this.parent.auxiliaries.push(auxA);
//       }
      return;
    }
    
    // vector
    else if ((auxiliarObj.array) && (!auxiliarObj.matrix) && (auxiliarObj.id.charAt(auxiliarObj.id.length-1) != ")")) {
      // only once evaluation
      var auxV = new descartesJS.Vector(this.parent, auxiliarObj);

      // always evaluation
      if ((auxiliarObj.evaluate) && (auxiliarObj.evaluate === "always")) {
        this.parent.auxiliaries.push(auxV);
      }
      return;
    }

    // matrix
    else if ((auxiliarObj.matrix) && (auxiliarObj.id.charAt(auxiliarObj.id.length-1) != ")")) {
      // only once evaluation
      var auxM = new descartesJS.Matrix(this.parent, auxiliarObj);

      // always evaluation
      if ((auxiliarObj.evaluate) && (auxiliarObj.evaluate === "always")) {
        this.parent.auxiliaries.push(auxM);
      }
      return;
    }
    
    // event
    else if ((auxiliarObj.event) && (auxiliarObj.id.charAt(auxiliarObj.id.length-1) != ")")) {
      // var auxE = new descartesJS.Event(this.parent, auxiliarObj);
      // this.parent.events.push(auxE);

      this.parent.events.push( new descartesJS.Event(this.parent, auxiliarObj) );

      return;
    }
    
    else {
      // function
      if (auxiliarObj.id.charAt(auxiliarObj.id.length-1) === ")") {
        // var auxF = new descartesJS.Function(this.parent, auxiliarObj);
        new descartesJS.Function(this.parent, auxiliarObj);
      } 
      // variable
      else {
      	// var auxV = new descartesJS.Variable(this.parent, auxiliarObj);
        new descartesJS.Variable(this.parent, auxiliarObj);
      }
      return;
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
          console.log("----- Accion no soportada aun: <" + theAction_action + "> -----");
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

      switch(babel[values_i_0]) {
        
        // time delay
        case("delay"):
          animationObj["delay"] = values_i_1;
          break;
          
        // condition to show the controls
        case("controls"):
          animationObj["controls"] = (babel[values_i_1] === "true");
          break;

        // condition to star automatically
        case("auto"):
          animationObj["auto"] = (babel[values_i_1] === "true");
          break;

        // condition to loop
        case("loop"):
          animationObj["loop"] = (babel[values_i_1] === "true");
          break;
         
        // init expression
        case("init"):
          animationObj["init"] = values_i_1;
          break;
          
        // do expression
        case("do"):
          animationObj["doExpr"] = values_i_1;
          break;
          
        // while expression
        case("while"):
          animationObj["whileExpr"] = values_i_1;
          break;

        // identifier
        case("id"):
          animationObj["id"] = values_i_1;
          break;
         
        // algorithm condition
        case("algorithm"):
          animationObj["algorithm"] = (babel[values_i_1] === "true");
          break;

        // type of evaluation          
        case("evaluate"):
          animationObj["evaluate"] = (babel[values_i_1] === "true");
          break;          
         
        // any variable missing
        default:
          console.log("----- attributo de la animacion no identificado: <" + values_i_0 + ">  <" + values_i_1 + "> -----");
          break;
      }
    }
    
    return (new descartesJS.Animation(this.parent, animationObj));
  }

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
            plecaObj.bgcolor = "#" + descartesJS.getColor(this.evaluator, values_i_1);
          }
          break;

        // text color
        case("fgcolor"):
          if (values_i_1 != "") {
            plecaObj.fgcolor = "#" + descartesJS.getColor(this.evaluator, values_i_1);
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
          console.log("----- attributo de la pleca no identificado: <" + values_i_0 + ">  <" + values_i_1 + "> -----");
          break;
      }
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
      plecaObj.divPleca.setAttribute("style", "position: absolute; left: 0px; top: 0px; text-align: " + plecaObj.align + "; width: " + (w-2*paddingSides) + "px; height: "+ (imageHeight-16) + "px; background: " + plecaObj.bgcolor + "; color: " + plecaObj.fgcolor + "; padding-top: 8px; padding-bottom: 8px; padding-left: " + paddingSides + "px; padding-right: " + paddingSides + "px; margin: 0px; overflow: hidden; z-index: 100;");
      
      image.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: -1; width: 100%; height: 100%");
      plecaObj.divPleca.appendChild(image);
    } 
    // if there is not an image, the the height is not specified and the contaier guest the height
    else {
      plecaObj.divPleca.setAttribute("style", "position: absolute; left: 0px; top: 0px; text-align: " + plecaObj.align + "; width: " + (w-2*paddingSides) + "px; background: " + plecaObj.bgcolor + "; color: " + plecaObj.fgcolor + "; padding-top: 8px; padding-bottom: 8px; padding-left: " + paddingSides + "px; padding-right: " + paddingSides + "px; margin: 0px; z-index: 100;");
    }
    
    // creates the container for the title and the content is added
    divTitle = document.createElement("div");
    divTitle.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.titlefont + "; overflow: hidden; white-space: nowrap;");
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
        tempDiv.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.subtitlefont + "; font-size: " + tempFontSize + "px; width: " + (w-2*paddingSides) + "px; line-height: " + tempFontSize + "px;")
        
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
      divSubTitle.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.subtitlefont + "; font-size: " + tempFontSize + "px; line-height: 110%; overflow: hidden; white-space: nowrap;");
    } 
    // if the number of lines is different from 1, then the number of lines is ignored
    else {
      divSubTitle.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.subtitlefont + "; line-height: 110%;");
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
   * @return {Array<Array<Strin>>} return the array of name and value pairs
   */
  descartesJS.LessonParser.prototype.split = function(values) {
    if (typeof(values) != "string") {
      return [];
    }

    values = values || "";
    values = values.replace(/\\'/g, "’");
    
    splitValues = [];
    pos = 0;
    i = 0;
    initToken = false;
    initPosToken = 0;
    endPosToken = 0;
    stringToken = false;
    valueToken = false;

    // traverse the string to split
    while (pos < values.length) {
      // ignoring the blank spaces if not started the identification of a token
      if ((values.charAt(pos) === " ") && (!initToken)) {
        pos++;
      }
      
      // find a character which is different from a blank space
      if ((values.charAt(pos) != " ") && (!initToken)) {
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
      if ((values.charAt(pos) === "=") && (values.charAt(pos+1) != "'") && (!stringToken)) {
        splitValues[i] = [values.substring(initPosToken, pos)]

        initPosToken = pos+1;
        
        pos++;

        // find the next space and equal sign
        var tmpIndexEqual = (values.substring(pos)).indexOf("=");
        var tmpIndexSpace;
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
   * Split a string using a coma delimiter
   * @param {String} string the string to split
   * @return {Array<String>} return an array of the spliting string using a coma delimiter
   */
  descartesJS.LessonParser.prototype.splitComa = function(string) {
    splitString = [];
    parentesisStack = [];
    lastSplitIndex = 0;

    for (var i=0, l=string.length; i<l; i++) {
      if (string.charAt(i) === "(") {
        parentesisStack.push(i);
      }
      else if (string.charAt(i) === ")") {
        parentesisStack.pop();
      }
      else if ((string.charAt(i) === ",") && (parentesisStack.length === 0)) {
        splitString.push(string.substring(lastSplitIndex, i));
        lastSplitIndex = i+1;
      }
    }
    
    splitString.push(string.substring(lastSplitIndex));
    
    return splitString;
  }
  
  /**
   * Given a Descartes color get an CSS color
   * @param {String} color the Descartes color to convert
   * @return {String} return a CSS color string
   */
  descartesJS.LessonParser.prototype.convertColor = function(color) {
    // the color is a color name
    if (babel[color]) {
      if (babel[color] === "net") {
        return "red";
      }
      return babel[color];
    }
    
    // the color is six hexadecimals digits #RRGGBB
    if (color.length === 6) {
      return "#" + color;
    }

    // the color is eight hexadecimals digits #RRGGBBAA
    if (color.length === 8) {
      return "rgba("+ parseInt("0x"+color.substring(2,4), 16) +","
                    + parseInt("0x"+color.substring(4,6), 16) +","
                    + parseInt("0x"+color.substring(6,8), 16) +","
                    + (1-parseInt("0x"+color.substring(0,2), 16)/255)
                    + ")";
    }

    // the color is a Descartes expression (exprR, exprG, exprB, exprA)
    if (color[0] === "(") {
      tmpColor = "(";
      splitColor = this.splitComa(color.substring(1,color.length-1));

      for (var i=0, l=splitColor.length; i<l; i++) {
        hexColor = parseInt(splitColor[i], 16);
        
        if (splitColor[i] != hexColor.toString(16)) {
          if ((splitColor[i].charAt(0) === "[") && (splitColor[i].charAt(splitColor[i].length-1) === "]")) {
            splitColor[i] = splitColor[i].substring(1, splitColor[i].length-1);
          }
          tmpColor = tmpColor + splitColor[i] + ((i<l-1)?",":")");
        } else {
          tmpColor = tmpColor + (hexColor/255) + ((i<l-1)?",":")");
        }
      }

      return this.parser.parse(tmpColor);
    }
    
    // otherwise
    return "#aa0000";
  }

  /**
   * Parse a text an construct a simple text or rtf text
   * @param {String} text the string text to parse
   * @param {Object} return a rtf text or a simple text
   */
  descartesJS.LessonParser.prototype.parseText = function(text) {
    // is a RTF text
    if (text.match(/^\{\\rtf1/)) {
      return this.RTFparser.parse(text.substring(10));
    }
    
    // is a simple text
    return new descartesJS.SimpleText(this.parent, text);
  }

  return descartesJS;
})(descartesJS || {}, babel);