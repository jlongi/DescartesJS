/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un parser de elementos principales de una leccion de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   */
  descartesJS.LessonParser = function(parent) {
    this.parent = parent;

    // el parser de la leccion
    this.parser = this.parent.evaluator.parser;
  }

  /**
   * Parsea la configuración de los botones
   * @param {String} values es la cadena que contiene los valores de configuracion de los botones
   * @return {Object} regresa un objeto de configuracion con los valores correspondientes
   */
  descartesJS.LessonParser.prototype.parseButtonsConfig = function(values) {
    var buttonConfigObj = { rowsNorth: 0, rowsSouth: 0, widthEast: 125, widthWest: 125, height: 23 };

    // variable temporal para fines de calculos intermedios
    var temp;
    
    // se eliminan las comillas sencillas de la cadena de valores que definen el espacio y se dividen los valores, en el nombre del parametro y su valor
    values = this.split(values);
    
    var values_i_0, values_i_1;
    // se recorren todos los valores y se asignan a las variables del espacio
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
          buttonConfigObj["about"] = (babel[values_i_1] == "true");
          break;

        //
        case("config"):
          buttonConfigObj["config"] = (babel[values_i_1] == "true");
          break;

        //
        case("init"):
          buttonConfigObj["init"] = (babel[values_i_1] == "true");
          break;

        //
        case("clear"):
          buttonConfigObj["clear"] = (babel[values_i_1] == "true");
          break;

        // cualquier variable que falte
        default:
          console.log("----- attributo de Espacio no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
          break;
      }
    }

    return buttonConfigObj;
  }
  
  /**
   * Parsea y crea un espacio
   * @param {String} values es la cadena que contiene los valores que definen el espacio
   * @return {Space} regresa un espacio con los valores correspondientes
   */
  descartesJS.LessonParser.prototype.parseSpace = function(values) {
    // el objeto que contendra todos los valores encontrados en values
    var spaceObj = {};
    
    // variable temporal para fines de calculos intermedios
    var temp;
    
    // se eliminan las comillas sencillas de la cadena de valores que definen el espacio y se dividen los valores, en el nombre del parametro y su valor
    values = this.split(values);
    
    var values_i_0, values_i_1;
    // se recorren todos los valores y se asignan a las variables del espacio
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];
      
      switch(babel[values_i_0]) {
        // se encuentra el tipo del espacio 2D, 3D u otro
        case("type"):
          spaceObj["type"] = values_i_1;
          break;
          
        // se encuentra el identificador del espacio 
        case("id"):
          spaceObj["id"] = values_i_1;
          break;
          
        // se encuentra la expresion que determina la posicion x del espacio
        case("x"):
          temp = values_i_1;
          
          // si esta especificado con un porcentaje se utiliza el ancho del contenedor padre para obtener el valor en pixeles
          if (temp[temp.length-1] == "%") {
            temp = (this.parent.container.width*parseFloat(temp)/100).toString();
          } 
          // si no esta especificado con un porcentaje se obtiene el valor numerico de la posicion en x
          else {
            temp = values_i_1;
          }
          
          spaceObj["xExpr"] = this.parser.parse(temp);
          break;
          
        // se encuentra la expresion que determina la posicion y del espacio
        case("y"):
          temp = values_i_1;
          
          // si esta especificado con un porcentaje se utiliza el alto del contenedor padre para obtener el valor en pixeles
          if (temp[temp.length-1] == "%") {
            temp = (this.parent.container.height*parseFloat(temp)/100).toString();
          } 
          // si no esta especificado con un porcentaje se obtiene el valor numerico de la posicion en x
          else {
            temp = values_i_1;
          }
          
          spaceObj["yExpr"] = this.parser.parse(temp);
          break;
          
        // se encuentra el ancho del espacio
        case("width"):
          temp = values_i_1;
          
          // si esta especificado con un porcentaje se utiliza el ancho del contenedor padre para obtener el valor en pixeles
          if (temp[temp.length-1] == "%") {
            temp = this.parent.container.width*parseFloat(temp)/100;
          } 
          // si no esta especificado con un porcentaje se obtiene el valor numerico del ancho
          else {
            temp = parseFloat(values_i_1);
            
            // si al convertir el valor a un numero los valores son diferentes, entonces el ancho se vuelve el ancho del contenedor padre
            if (temp != values_i_1) {
              temp = this.parent.container.width; // valor por default
            }
          }
          
          spaceObj["w"] = temp;
          break;
          
        // se encuentra el alto del espacio
        case("height"):
          temp = values_i_1;
          
          // si esta especificado con un porcentaje se utiliza el alto del contenedor padre para obtener el valor en pixeles
          if (temp[temp.length-1] == "%") {
            temp = this.parent.container.height*parseFloat(temp)/100;
          } 
          // si no esta especificado con un porcentaje se obtiene el valor numerico del alto
          else {
            temp = parseFloat(values_i_1);
            
            // si al convertir el valor a un numero los valores son diferentes, entonces el ancho se vuelve el alto del contenedor padre
            if (temp != values_i_1) {
              temp = this.parent.container.height; // valor por default
            }
          }
          
          spaceObj["h"] = temp;
          break;
          
        // se encuentra la condicion de dibujo del espacio
        case("drawif"):
          spaceObj["drawif"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra si el espacio esta fijo
        case("fixed"):
          spaceObj["fixed"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra la escala del espacio
        case("scale"):
          temp = parseFloat(values_i_1);
          
          // si al convertir el valor a un numero los valores son diferentes, entonces se utiliza el valor por default
          if (temp != values_i_1) {
            temp =  48; // valor por default
          }          
          
          spaceObj["scale"] = temp;
          break;
          
        // se encuentra la posicion x del origen del espacio
        case("O.x"):
          spaceObj["OxExpr"] = values_i_1;
          break;
          
        // se encuentra la posicion y del origen del espacio
        case("O.y"):
          spaceObj["OyExpr"] = values_i_1;
          break;
          
        // se encuentra la imagen de fondo del espacio
        case("image"):
          spaceObj["imageSrc"] = values_i_1;
          break;
          
        // se encuentra la forma en que esta colocada la imagen
        case("bg_display"):
          spaceObj["bg_display"] = babel[values_i_1];
          break;
          
        // se encuentra el color del fondo
        case("background"):
          spaceObj["background"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra el color de la red
        case("net"):
          if (babel[values_i_1] == "false"){
            spaceObj["net"] = "";
          } else {
            spaceObj["net"] = this.convertColor(values_i_1);
          }
          break;
          
        // se encuentra el color de la red10
        case("net10"):
          if (babel[values_i_1] == "false"){
            spaceObj["net10"] = "";
          } else {
            spaceObj["net10"] = this.convertColor(values_i_1);
          }
          break;
          
        // se encuentra el color de los ejes
        case("axes"):
          if (babel[values_i_1] == "false"){
            spaceObj["axes"] = "";
          } else {
            spaceObj["axes"] = this.convertColor(values_i_1);
          }
          break;
          
        // se encuentra el color del texto que muestra las coordenadas del mouse
        case("text"):
          if (babel[values_i_1] == "false"){
            spaceObj["text"] = "";
          } else {
            spaceObj["text"] = this.convertColor(values_i_1);
          }
          break;
          
        // se encuentra si los numeros del espacio estan activados
        case("numbers"):
          spaceObj["numbers"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el texto que lleva el eje X
        case("x-axis"):
          if (babel[values_i_1] == "false"){
            spaceObj["x_axis"] = "";
          }
          else {
            spaceObj["x_axis"] = values_i_1;
          }
          break;
          
        // se encuentra el texto que lleva el eje Y
        case("y-axis"):
          if (babel[values_i_1] == "false"){
            spaceObj["y_axis"] = "";
          }
          else {
            spaceObj["y_axis"] = values_i_1;
          }
          break;
          
        // se encuentra si el espacio es sensible a los movimientos del mouse
        case("sensitive_to_mouse_movements"):
          spaceObj["sensitive_to_mouse_movements"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el cID del espacio
        case("cID"):
          spaceObj["cID"] = values_i_1;
          break;
          
        // espacio 3D
        case("R3"):
          spaceObj["R3"] = (babel[values_i_1] == "true");
          break;
          
        // modo de despliege sort, painter, raytrace
        case("render"):
          spaceObj["render"] = babel[values_i_1];
          break;
          
        // opcion de cortado del algoritmo de desplegado
        case("split"):
          spaceObj["split"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el nombre del archivo de un espacio de aplicacion de descartes
        case("file"):
          spaceObj["file"] = values_i_1;
          break;
          
        // cualquier variable que falte
        default:
          console.log("----- attributo de Espacio no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
          break;
      }   
    }

    // espacio 2D
    if ((spaceObj.type == "R2") || (this.parent.version == 2)) {
      return new descartesJS.Space2D(this.parent, spaceObj);
    }
    
    // espacio 3D
    else if (spaceObj.type == "R3") {
      return new descartesJS.Space3D(this.parent, spaceObj);
      // console.log("Los espacios 3D no funcionan.");
    }

    // espacio de aplicacion de descartes
    else if (spaceObj.type == "AP") {
      return new descartesJS.SpaceAP(this.parent, spaceObj);
    }
    
    // espacio de aplicacion de descartes
    else if (spaceObj.type == "HTMLIFrame") {
      return new descartesJS.SpaceHTML_IFrame(this.parent, spaceObj);
    }
  }

  /**
   * Parsea y crea un control
   * @param {String} values es la cadena que contiene los valores que definen el control
   * @return {Control} regresa un control con los valores correspondientes
   */
  descartesJS.LessonParser.prototype.parseControl = function(values) {
    // el objeto que contendra todos los valores encontrados en values
    var controlObj = {};
    
    // se eliminan las comillas sencillas de la cadena de valores que definen el control y se dividen los valores, en el nombre del parametro y su valor
    values = this.split(values);

    var values_i_0, values_i_1;
    
    // se recorren todos los valores y se asignan a las variables del control
    for (var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      switch( babel[values_i_0]) {
        
        // se encuentra el id del control
        case("id"):
          controlObj["id"] = values_i_1;
          break;
          
        // se encuentra el tipo del control
        case("type"):
          controlObj["type"] = babel[values_i_1.trim()];
          break;
          
        // se encuentra la interfaz del control (que tipo es, si es pulsador o boton, etc)
        case("gui"):
          controlObj["gui"] = babel[values_i_1];
          break;
          
        // se encuentra la region del control
        case("region"):
          controlObj["region"] = babel[values_i_1];
          break;
          
        // se encuentra el id del espacio del control
        case("space"):
          controlObj["spaceID"] = values_i_1;
          break;
          
        // se encuentra el texto del control
        case("name"):
          controlObj["name"] = values_i_1;
          break;
          
        // se encuentra la expresión que define la posición y el tamaño del control
        case("expresion"):
          controlObj["expresion"] = this.parser.parse(values_i_1.replace(")(", ","));
          break;
          
        // se encuentra si los valores del control se expresan en notacion fija
        case("fixed"):
          controlObj["fixed"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el control es visible
        case("visible"):
          controlObj["visible"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el color del texto del control
        case("color"):
          controlObj["color"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra el color-int del texto del control
        case("colorInt"):
          controlObj["colorInt"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra si el texto del control esta en negrita
        case("bold"):
          if (babel[values_i_1] != "false") {
            controlObj["bold"] = "bold";
          }
          break;
          
        // se encuentra si el texto del control esta en cursiva
        case("italics"):
          if (babel[values_i_1] != "false") {
            controlObj["italics"] = "italic";
          }
          break;
          
        // se encuentra si el texto del control esta subrayada
        case("underlined"):
          if (babel[values_i_1] != "false") {
            controlObj["underlined"] = true;
          }
          break;
          
        // se encuentra el tamano del texto del control
        case("font_size"):
          controlObj["font_size"] = this.parser.parse(values_i_1); //parsear la posible expresion
          break;
          
        // se encuentra la imagen de fondo del control
        case("image"):
          controlObj["imageSrc"] = values_i_1;
          break;
          
        // se encuentra el tipo de accion que realizara el control
        case("action"):
          controlObj["action"] = babel[values_i_1];
          break;
          
        // se encuentra el parametro que debe ejecutar el control cuando se ejecute la accion
        case("parameter"):
          controlObj["parameter"] = values_i_1;
          break;
          
        // se encuentra la condicion de dibujo del control
        case("drawif"):
          controlObj["drawif"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la condicion de activacion del control
        case("activeif"):
          controlObj["activeif"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el tooltip del control
        case("tooltip"):
          controlObj["tooltip"] = values_i_1;
          break;
          
        // se encuentra la tipografia del tooltip del control
        case("tooltipFont"):
          controlObj["tooltipFont"] = values_i_1;
          break;
          
        // se encuentra la explicacion del control
        case("Explanation"):
          controlObj["Explanation"] = values_i_1;
          break;
          
        // se encuentra la tipografia de la explicacion del control
        case("ExplanationFont"):
          controlObj["ExplanationFont"] = values_i_1;
          break;
          
        // se encuentra la posicion relativa de los mensajes
        case("msg_pos"):
          controlObj["msg_pos"] = babel[values_i_1];
          break;
          
        // se encuentra el cID del control
        case("cID"):
          controlObj["cID"] = values_i_1;
          break;
          
        // se encuentra el valor del pulsador
        case("value"):
          var tmpVal = values_i_1.replace(/&squot;/g, "'");

          // si el control inicia y termina con || se sustituye por ''
          if (tmpVal.match(/^\|/)) {
            tmpVal = "'" + tmpVal.substring(1);
            if (tmpVal.match(/\|$/)) {
              tmpVal = tmpVal.substring(0, tmpVal.length-1) + "'";
            }
          }
          
          controlObj["valueExpr"] = this.parser.parse(tmpVal);
          controlObj["valueExprString"] = tmpVal;
          
          break;
          
        // se encuentra el numero de decimales del pulsador
        case("decimals"):
          controlObj["decimals"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el valor minimo del pulsador
        case("min"):
          controlObj["min"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el valor maximo del pulsador
        case("max"):
          controlObj["max"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el incremento del pulsador
        case("incr"):
          if (values_i_1 != 0) {
            controlObj["incr"] = this.parser.parse(values_i_1);
          }
          break;
          
        // se encuentra si el incremento es discreto en el pulsador
        case("discrete"):
          controlObj["discrete"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el campo de texto es solo de texto
        case("onlyText"):
          controlObj["onlyText"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el campo de texto es evaluado
        case("evaluate"):
          controlObj["evaluate"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el patron de respuesta del campo de texto
        case("answer"):
          controlObj["answer"] = values_i_1;
          break;
          
        // se encuentra la condicion para mostrar los valores con notacion exponecial
        case("exponentialif"):
          controlObj["exponentialif"] = parseFloat(values_i_1); //parsear la posible expresion
          break;

        // se encuentra el tamano del control grafico
        case("size"):
          controlObj["size"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la constriccion del control grafico
        case("constraint"):
          controlObj["constraintExpr"] = values_i_1;
          break;
          
        // se encuentra el texto del control grafico
        case("text"):
          // texto de un control de texto
          controlObj["rawText"] = values_i_1;
          
          var tmpText = this.parseText(values_i_1);
          for (var ii=0, ll=tmpText.length; ii<ll; ii++) {
            tmpText[ii] = this.parser.parse(tmpText[ii], false);
          }
          controlObj["text"] = tmpText;
          break;
          
        // se encuentra si el control grafico deja rastro
        case("trace"):
          controlObj["trace"] = this.convertColor(values_i_1);
          break;
          
        // se encuentran las opciones del menu
        case("options"):
          controlObj["options"] = values_i_1;
          break;
          
        // se encuentra la fuente del control grafico
        case("font"):
          controlObj["font"] = values_i_1;
          break;
          
        // se encuentra el nombre del archivo del video o del audio
        case("file"):
          controlObj["file"] = values_i_1;
          break;
          
        // se encuentra si el video o el audio se reproduce automaticamente //no funciona en el ipad
        case("autoplay"):
          controlObj["autoplay"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el video o el audio se reproduce en un ciclo
        case("loop"):
          controlObj["loop"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el video o el audio presenta los controles
        case("controls"):
          controlObj["controls"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el video tiene una imagen que mostrar
        case("poster"):
          controlObj["poster"] = babel[values_i_1];
          break;
          
        // cualquier variable que falte
        default:
          var ind    = values_i_0.indexOf(".");
          var prefix = babel[values_i_0.substring(0,ind)];
          var sufix  = babel[values_i_0.substring(ind+1)];
          
          // se encuentra la tipografia del parametro
          if ((prefix == "parameter") && (sufix == "font")) {
            controlObj["parameterFont"] = values_i_1;
            break;
            
          // se encuentra la tipografia de la explicacion
          } else if ((prefix == "Explanation") && (sufix == "font")) {
            controlObj["ExplanationFont"] = values_i_1;
            break;
            
          // se encuentra la tipografia del tooltip
          } else if ((prefix == "tooltip") && (sufix == "font")) {
            controlObj["tooltipFont"] = values_i_1;
            break;            
          }
         
          console.log("----- attributo de control no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
          break;
      }
    }

    // si el tipo de control es numerico 
    if (controlObj.type == "numeric") {

      // un pulsador
      if ((controlObj.gui == undefined) || (controlObj.gui == "spinner")) {
        return new descartesJS.Spinner(this.parent, controlObj);
      }
      
      // un boton
      else if (controlObj.gui == "button") {
        return new descartesJS.Button(this.parent, controlObj);
      }

      // un campo de texto
      else if (controlObj.gui == "textfield") {
        return new descartesJS.TextField(this.parent, controlObj);
      }
      
      // un menu
      else if (controlObj.gui == "menu") {
        return new descartesJS.Menu(this.parent, controlObj);
      }
      
      // un scrollbar
      else if (controlObj.gui == "scrollbar") {
        return new descartesJS.Scrollbar(this.parent, controlObj);
      }

    }
    
    // si el tipo de control es video
    else if (controlObj.type == "video") {
      return new descartesJS.Video(this.parent, controlObj);
    }
    
    // si el tipo de control es audio
    else if (controlObj.type == "audio") {
      return new descartesJS.Audio(this.parent, controlObj);
    }
    
    // si el tipo de control es grafico
    else if (controlObj.type == "graphic") {
      return new descartesJS.GraphicControl(this.parent, controlObj);
    }
    
    // si el tipo de control es de texto
    else if (controlObj.type == "text") {
      return new descartesJS.TextArea(this.parent, controlObj);
    }

  }

  /**
   * Parsea y crea un grafico
   * @param {String} values es la cadena que contiene los valores que definen el grafico
   * @return {Graphic} regresa un grafico con los valores correspondientes
   */
  descartesJS.LessonParser.prototype.parseGraphic = function(values, abs_coord, background, rotateExp) { 
    // el objeto que contendra todos los valores encontrados en values
    var graphicObj = { rotateExp:rotateExp };
    graphicObj["parameter"] = "t";

    // se eliminan las comillas sencillas de la cadena de valores que definen el grafico y se dividen los valores, en el nombre del parametro y su valor
    values = this.split(values);

    var values_i_0, values_i_1;
    // se recorren todos los valores y se asignan a las variables del grafico
    for(var i=0, l=values.length; i<l; i++){
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];
      
      switch(babel[values_i_0]){
        
        // se encuentra el id del espacio del grafico
        case("space"):
          graphicObj["spaceID"] = values_i_1;
          break;
          
        // se encuentra el tipo de grafico
        case("type"):
          graphicObj["type"] = babel[values_i_1];
          break;
          
        // se encuentra si el grafico debe dibujarse en el fondo
        case("background"):
          graphicObj["background"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el color del grafico
        case("color"):
          graphicObj["color"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra la condicion de dibujo del grafico
        case("drawif"):
          graphicObj["drawif"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra si el grafico utiliza coordenadas absolutas
        case("abs_coord"):
          graphicObj["abs_coord"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra la expresión del grafico
        case("expresion"):
          if (graphicObj.type != "macro") {
            graphicObj["expresion"] = this.parser.parse(values_i_1);
            graphicObj["expresionString"] = values_i_1;
          } else {
            graphicObj["expresion"] = values_i_1;
          }
          break;
          
        // se encuentra el color del rastro que deja el grafico
        case("trace"):
          graphicObj["trace"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra que variable se utiliza como parametro para una familia
        case("family"):
          graphicObj["family"] = values_i_1;
          break;
          
        // se encuentra que variable se utiliza como parametro para una familia
        case("parameter"):
          graphicObj["parameter"] = values_i_1;
          break;
          
        // se encuentra el color del relleno del grafico
        case("fill"):
          graphicObj["fill"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra el color del relleno+ del grafico
        case("fillP"):
          graphicObj["fillP"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra el color del relleno- del grafico
        case("fillM"):
          graphicObj["fillM"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra el ancho de la linea del grafico
        case("width"):
          graphicObj["width"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra si el grafico es visible
        case("visible"):
          graphicObj["visible"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra si el grafico es editable
        case("editable"):
          graphicObj["editable"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra la info del grafico
        case("info"):
          graphicObj["info"] = values_i_1;
          break;
          
        // se encuentra el texto del grafico
        case("text"):
          // var tmpText = this.parseText(values_i_1);

          // for (var ii=0, ll=tmpText.length; ii<ll; ii++) {
          //   tmpText[ii] = this.parser.parse(tmpText[ii], false);
          // }
          // graphicObj["text"] = tmpText;
          graphicObj["text"] = this.parseText(values_i_1);
          break;
          
        // se encuentra la tipografia del texto
        case("font"):
          graphicObj["font"] = values_i_1;
          break;
          
        // se encuentra si la representacion del texto del punto esta en notacion fija
        case("fixed"):
          graphicObj["fixed"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra la cantidad de decimales para representar el texto del punto
        case("decimals"):
          graphicObj["decimals"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el ancho del punto
        case("size"):
          graphicObj["size"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el tamano de la punta de la flecha
        case("spear"):
          graphicObj["spear"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el color interior de la flecha
        case("arrow"):
          graphicObj["arrow"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra la posicion del centro del arco
        case("center"):
          graphicObj["center"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el radio del circulo
        case("radius"):
          graphicObj["radius"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el angulo incial del arco
        case("init"):
          graphicObj["init"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el angulo final del arco
        case("end"):
          graphicObj["end"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra si el arco utiliza vectores para su especificacion
        case("vectors"):
          graphicObj["vectors"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el nombre de archivo de la imagen
        case("file"):
          var fileTmp = values_i_1.replace(/&squot;/g, "'");
          if ((fileTmp.charAt(0) == "[") && (fileTmp.charAt(fileTmp.length-1) == "]")) {
            fileTmp = fileTmp.substring(1, fileTmp.length-1);
          }
          // si es el nombre de una imagen, entonces se crea una cadena
          if (fileTmp.match(/.jpg$|.png$|.gif$|.svg$/)) {
            fileTmp = "'" + fileTmp + "'";
          }
          graphicObj["file"] = this.parser.parse(fileTmp);
          break;
          
        // se encuentra la rotacion de una imagen y un macro
        case("inirot"):
          graphicObj["inirot"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la opacidad de una imagen
        case("opacity"):
          graphicObj["opacity"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la posicion inicial del macro
        case("inipos"):
          graphicObj["inipos"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el nombre del macro
        case("name"):
          graphicObj["name"] = values_i_1;
          break;
          
        // se encuentra el nombre del macro
        case("range"):
          graphicObj["range"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el color del borde del texto
        case("border"):
          if (babel[values_i_1] != "false") {
            graphicObj["border"] = this.convertColor(values_i_1);
          }
          break;
          
        // se encuentra la alineacion del texto
        case("align"):
          graphicObj["align"] = babel[values_i_1];
          break;
          
        // cualquier variable que falte
        default:
          if (graphicObj["family"] != undefined) {
            if (values_i_0.substring(0, graphicObj["family"].length+1) == (graphicObj["family"] + ".")) {
              
              switch(babel[values_i_0.substring(graphicObj["family"].length+1)]){
                
                // se encuentra el intervalo que se utiliza como parametro para una familia
                case("interval"):
                  graphicObj["family_interval"] = this.parser.parse(values_i_1);
                  break;
                  
                // se encuentra el numero de pasos que se utiliza para una familia
                case("steps"):
                  graphicObj["family_steps"] = this.parser.parse(values_i_1);
                  break;
              }
              break;
            }
          }

          if (graphicObj["parameter"] != undefined) {
            if (values_i_0.substring(0, graphicObj["parameter"].length+1) == (graphicObj["parameter"] + ".")) {
            
              switch(babel[values_i_0.substring(graphicObj["parameter"].length+1)]){
              
                // se encuentra el intervalo que se utiliza como parametro para la curva
                case("interval"):
                  graphicObj["parameter_interval"] = this.parser.parse(values_i_1);
                  break;
                
                // se encuentra el numero de pasos que se utiliza para la curva
                case("steps"):
                  graphicObj["parameter_steps"] = this.parser.parse(values_i_1);
                  break;
              }
              break
            }
          }

          console.log("----- attributo del grafico no identificado: <" + values_i_0 + "> valor: <" + values_i_1 +"> -----");
          break;
      }
    }
    
    // MACRO //
    // si el macro utiliza coordenadas absolutas
    if (abs_coord) {
      graphicObj.abs_coord = abs_coord;
    }
    // si el macro se debe dibujar en el fondo
    if (background) {
      graphicObj.background = background;
    }
    // MACRO //

    // el grafico es una ecuacion
    if (graphicObj.type == "equation"){
      return new descartesJS.Equation(this.parent, graphicObj);
    }
    
    // el grafico es una curva
    else if (graphicObj.type == "curve") {
      return new descartesJS.Curve(this.parent, graphicObj);
    }

    // el grafico es una secuencia
    else if (graphicObj.type == "sequence") {
      return new descartesJS.Sequence(this.parent, graphicObj);
    }

    // el grafico es un punto
    else if (graphicObj.type == "point") {
      return new descartesJS.Point(this.parent, graphicObj);
    }
    
    // el grafico es un segmento
    else if (graphicObj.type == "segment") {
      return new descartesJS.Segment(this.parent, graphicObj);
    }
    
    // el grafico es una flecha
    else if (graphicObj.type == "arrow") {
      return new descartesJS.Arrow(this.parent, graphicObj);
    }
    
    // el grafico es un poligono
    else if (graphicObj.type == "polygon") {
      return new descartesJS.Polygon(this.parent, graphicObj);
    }
    
    // el grafico es arco
    else if (graphicObj.type == "arc") {
      return new descartesJS.Arc(this.parent, graphicObj);
    }
    
    // el grafico es un texto
    else if (graphicObj.type == "text") {
      return new descartesJS.Text(this.parent, graphicObj);
    }
    
    // el grafico es una imagen
    else if (graphicObj.type == "image") {
      return new descartesJS.Image(this.parent, graphicObj);
    }

    // el grafico es un macro
    else if (graphicObj.type == "macro") {
      return new descartesJS.Macro(this.parent, graphicObj);
    }

    // el grafico es un relleno
    else if (graphicObj.type == "fill") {
      return new descartesJS.Fill(this.parent, graphicObj);
    }
  }
  /**
   * Parsea y crea un grafico
   * @param {String} values es la cadena que contiene los valores que definen el grafico
   * @return {Graphic} regresa un grafico con los valores correspondientes
   */
  descartesJS.LessonParser.prototype.parse3DGraphic = function(values, abs_coord, background, rotateExp) { 
    // el objeto que contendra todos los valores encontrados en values
    var graphicObj = { rotateExp:rotateExp };
    graphicObj["parameter"] = "t";
    
    // se eliminan las comillas sencillas de la cadena de valores que definen el grafico y se dividen los valores, en el nombre del parametro y su valor
    values = this.split(values);

    var values_i_0, values_i_1;
    // se recorren todos los valores y se asignan a las variables del grafico
    for(var i=0, l=values.length; i<l; i++){
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];
      
      switch(babel[values_i_0]){
        
        // se encuentra el id del espacio del grafico
        case("space"):
          graphicObj["spaceID"] = values_i_1;
          break;
          
        // se encuentra el tipo de grafico
        case("type"):
//           console.log(values_i_1);
          graphicObj["type"] = babel[values_i_1];
          break;
          
        // se encuentra si el grafico debe dibujarse en el fondo
        case("background"):
          graphicObj["background"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el color del grafico
        case("color"):
          graphicObj["color"] = this.convertColor(values_i_1);
          break;
          
        // se encuentra la condicion de dibujo del grafico
        case("drawif"):
          graphicObj["drawif"] = this.parser.parse(values_i_1);
          break;
          
//         // se encuentra si el grafico utiliza coordenadas absolutas
//         case("abs_coord"):
//           graphicObj["abs_coord"] = (babel[values_i_1] == "true");
//           break;
          
        // se encuentra la expresión del grafico
        case("expresion"):
          if ((graphicObj.type != "macro") && (graphicObj.type != "curve") && (graphicObj.type != "surface")) {
            graphicObj["expresion"] = this.parser.parse(values_i_1);
            graphicObj["expresionString"] = values_i_1;
          } else {
            graphicObj["expresion"] = values_i_1;
          }
          break;
                    
        // se encuentra que variable se utiliza como parametro para una familia
        case("family"):
          graphicObj["family"] = values_i_1;
          break;
          
        // se encuentra que variable se utiliza como parametro para una familia
        case("parameter"):
          graphicObj["parameter"] = values_i_1;
          break;
          
//         // se encuentra el color del relleno del grafico
//         case("fill"):
//           graphicObj["fill"] = this.convertColor(values_i_1);
//           break;
//           
//         // se encuentra el color del relleno+ del grafico
//         case("fillP"):
//           graphicObj["fillP"] = this.convertColor(values_i_1);
//           break;
//           
//         // se encuentra el color del relleno- del grafico
//         case("fillM"):
//           graphicObj["fillM"] = this.convertColor(values_i_1);
//           break;
          
        // se encuentra el ancho del grafico
        case("width"):
          graphicObj["width"] = this.parser.parse(values_i_1);
          break;

        // se encuentra el largo del grafico
        case("length"):
          graphicObj["length"] = this.parser.parse(values_i_1);
          break;
          
//         // se encuentra si el grafico es visible
//         case("visible"):
//           graphicObj["visible"] = (babel[values_i_1] == "true");
//           break;
//           
//         // se encuentra si el grafico es editable
//         case("editable"):
//           graphicObj["editable"] = (babel[values_i_1] == "true");
//           break;
//           
//         // se encuentra la info del grafico
//         case("info"):
//           graphicObj["info"] = values_i_1;
//           break;
          
        // se encuentra el texto del grafico
        case("text"):
          var tmpText = this.parseText(values_i_1);

          for (var ii=0, ll=tmpText.length; ii<ll; ii++) {
            tmpText[ii] = this.parser.parse(tmpText[ii], false);
          }
          graphicObj["text"] = tmpText;
          break;
          
        // se encuentra la tipografia del texto
        case("font"):
          graphicObj["font"] = values_i_1;
          break;
          
        // se encuentra si la representacion del texto del punto esta en notacion fija
        case("fixed"):
          graphicObj["fixed"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra la cantidad de decimales para representar el texto del punto
        case("decimals"):
          graphicObj["decimals"] = this.parser.parse(values_i_1);
          break;
          
//         // se encuentra el ancho del punto
//         case("size"):
//           graphicObj["size"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra el tamano de la punta de la flecha
//         case("spear"):
//           graphicObj["spear"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra el color interior de la flecha
//         case("arrow"):
//           graphicObj["arrow"] = this.convertColor(values_i_1);
//           break;
//           
//         // se encuentra la posicion del centro del arco
//         case("center"):
//           graphicObj["center"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra el radio del circulo
//         case("radius"):
//           graphicObj["radius"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra el angulo incial del arco
//         case("init"):
//           graphicObj["init"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra el angulo final del arco
//         case("end"):
//           graphicObj["end"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra si el arco utiliza vectores para su especificacion
//         case("vectors"):
//           graphicObj["vectors"] = (babel[values_i_1] == "true");
//           break;
//           
        // se encuentra el nombre de archivo de la imagen
        case("file"):
          var fileTmp = values_i_1.replace(/&squot;/g, "'");

          if ((fileTmp.charAt(0) == "[") && (fileTmp.charAt(fileTmp.length-1) == "]")) {
            fileTmp = fileTmp.substring(1, fileTmp.length-1);
          }

          // si es el nombre de una imagen, entonces se crea una cadena
          if (fileTmp.match(/./)) {
            fileTmp = "'" + fileTmp + "'";
          }

          graphicObj["file"] = this.parser.parse(fileTmp);
          break;
          
//         // se encuentra la opacidad de una imagen
//         case("opacity"):
//           graphicObj["opacity"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra el nombre del macro
//         case("range"):
//           graphicObj["range"] = this.parser.parse(values_i_1);
//           break;
//           
//         // se encuentra el color del borde del texto
//         case("border"):
//           if (babel[values_i_1] != "false") {
//             graphicObj["border"] = this.convertColor(values_i_1);
//           }
//           break;
//           
//         // se encuentra la alineacion del texto
//         case("align"):
//           graphicObj["align"] = babel[values_i_1];
//           break;

        // se encuentra el modelo de iluminacion del grafico tridimensional
        case("model"):
          graphicObj["model"] = babel[values_i_1];
          break;
          
        // se encuentra si se deben dibujar las aristas
        case("edges"):
          graphicObj["edges"] = (babel[values_i_1] == "true");
          break;

        // se encuentra Nu
        case("Nu"):
          graphicObj["Nu"] = this.parser.parse(values_i_1);
          break;          

        // se encuentra Nv
        case("Nv"):
          graphicObj["Nv"] = this.parser.parse(values_i_1);
          break;          
          
        // se encuentra el nombre del grafico tridimensional
        case("name"):
          graphicObj["name"] = values_i_1;
          break;          
          
        // se encuentra el color trasero de un grafico tridimensional
        case("backcolor"):
          graphicObj["backcolor"] = this.convertColor(values_i_1);
          break;

        // se encuentra la rotacion inicial del grafico tridimensional
        case("inirot"):
          graphicObj["inirot"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la rotacion final del grafico tridimensional
        case("endrot"):
          graphicObj["endrot"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la posicion inicial del grafico tridimensional
        case("inipos"):
          graphicObj["inipos"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la posicion final del grafico tridimensional
        case("endpos"):
          graphicObj["endpos"] = this.parser.parse(values_i_1);
          break;          

        //////////////////////////////////////////////////////////////////////////////////////
          
        // cualquier variable que falte
        default:
          if (graphicObj["family"] != undefined) {
            if (values_i_0.substring(0, graphicObj["family"].length+1) == (graphicObj["family"] + ".")) {
              
              switch(babel[values_i_0.substring(graphicObj["family"].length+1)]){
                
                // se encuentra el intervalo que se utiliza como parametro para una familia
                case("interval"):
                  graphicObj["family_interval"] = this.parser.parse(values_i_1);
                  break;
                  
                // se encuentra el numero de pasos que se utiliza para una familia
                case("steps"):
                  graphicObj["family_steps"] = this.parser.parse(values_i_1);
                  break;
              }
              break;
            }
          }

          if (graphicObj["parameter"] != undefined) {
            if (values_i_0.substring(0, graphicObj["parameter"].length+1) == (graphicObj["parameter"] + ".")) {
            
              switch(babel[values_i_0.substring(graphicObj["parameter"].length+1)]){
              
                // se encuentra el intervalo que se utiliza como parametro para la curva
                case("interval"):
                  graphicObj["parameter_interval"] = this.parser.parse(values_i_1);
                  break;
                
                // se encuentra el numero de pasos que se utiliza para la curva
                case("steps"):
                  graphicObj["parameter_steps"] = this.parser.parse(values_i_1);
                  break;
              }
              break
            }
          }

          console.log("----- attributo del grafico no identificado: <" + values_i_0 + "> valor: <" + values_i_1 +"> -----");
          break;
      }
    }

    // el grafico es un punto
    if (graphicObj.type == "point") {
      return new descartesJS.Point3D(this.parent, graphicObj);
    }

    // el grafico es un segmento
    else if (graphicObj.type == "segment") {
      return new descartesJS.Segment3D(this.parent, graphicObj);
    }
    
    // el grafico es un poligono
    else if (graphicObj.type == "polygon") {
      return new descartesJS.Polygon3D(this.parent, graphicObj);
    }
    
    // el grafico es una curva
    else if (graphicObj.type == "curve") {
      return new descartesJS.Curve3D(this.parent, graphicObj);
    }
    
    // el grafico es un triangulo
    else if (graphicObj.type == "triangle") {
      return new descartesJS.Triangle3D(this.parent, graphicObj);
    }
    
    // el grafico es una cara
    else if (graphicObj.type == "face") {
      return new descartesJS.Face3D(this.parent, graphicObj);
    }
    
    // el grafico es un poligono regular
    else if (graphicObj.type == "polireg") {
      return new descartesJS.Polireg3D(this.parent, graphicObj);
    }

    // el grafico es una superficie
    else if (graphicObj.type == "surface") {
      return new descartesJS.Surface3D(this.parent, graphicObj);
    }

    // el grafico es un texto
    else if (graphicObj.type == "text") {
      return new descartesJS.Text3D(this.parent, graphicObj);
    }
    
    // el grafico es una malla
    else if (graphicObj.type == "mesh") {
      return new descartesJS.Mesh3D(this.parent, graphicObj);
    }

    else {
      console.log(graphicObj.type);
    }
    
  }
  
  /**
   * Parsea y registra o crea un auxiliar
   * @param {String} values es la cadena que contiene los valores que definen el auxiliar
   */
  descartesJS.LessonParser.prototype.parseAuxiliar = function(values) {
    // el objeto que contendra todos los valores encontrados en values
    var auxiliarObj = {};
    
    // variable temporal para fines de calculos intermedios
    var temp;
    
    // se eliminan las comillas sencillas de la cadena de valores que definen al auxiliar y se dividen los valores, en el nombre del parametro y su valor
    values = this.split(values);
    
    for(var i=0, l=values.length; i<l; i++) {
      values[i][1] = (values[i][1]).replace(/&squot;/g, "'");
    }
    
    var values_i_0, values_i_1;
    // se recorren todos los valores y se asignan a las variables del auxiliar
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      switch(babel[values_i_0]) {
        // se encuentra el id del auxiliar
        case("id"):
          auxiliarObj["id"] = values_i_1;
          break;

        // se encuentra si una variable es editable
      	case("editable"):
      	  auxiliarObj["editable"] = (babel[values_i_1] == "true");
      	  break;
	  
        // se encuentra si es una cosntante
        case("constant"):
          auxiliarObj["constant"] = (babel[values_i_1] == "true");
          break;
        
        // se encuentra si es un vector
        case("array"):
          auxiliarObj["array"] = (babel[values_i_1] == "true");
          break;

        // se encuentra si es un vector
        case("file"):
          auxiliarObj["file"] = values_i_1;
          break;

        // se encuentra si es una matriz
        case("matrix"):
          auxiliarObj["matrix"] = (babel[values_i_1] == "true");
          break;
          
        // se encuentra el numero de renglones de una matriz
        case("rows"):
          auxiliarObj["rows"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra el numero de renglones de una matriz
        case("columns"):
          auxiliarObj["columns"] = this.parser.parse(values_i_1);
          break;

        // se encuentra si tiene un algoritmo
        case("algorithm"):
          auxiliarObj["algorithm"] = (babel[values_i_1] == "true");
          break;
        
        // se encuentran las expresiones iniciales
        case("init"):
          auxiliarObj["init"] = values_i_1;
          break;
          
        // se encuentran las expresiones hacer
        case("do"):
          auxiliarObj["doExpr"] = values_i_1;
          break;
          
        // se encuentran las expresiones mientras
        case("while"):
          auxiliarObj["whileExpr"] = values_i_1;
          break;
          
        // se encuentra el dominio de la expresión que define el auxiliar
        case("range"):
          auxiliarObj["range"] = values_i_1;
          break;

        // se encuentra la expresión que define el auxiliar
        case("expresion"):
          auxiliarObj["expresion"] = values_i_1;
          break;
          
        // se encuentra el numero de elementos del vector
        case("size"):
          auxiliarObj["size"] = this.parser.parse(values_i_1);
          break;
          
        // se encuentra la forma en la que se evalua un auxiliar
        case("evaluate"):
          auxiliarObj["evaluate"] = babel[values_i_1];
          break;
          
        // se encuentra si es un evento
        case("event"):
          auxiliarObj["event"] = babel[values_i_1];
          break;

        // se encuentra la condicion del evento
        case("condition"):
          auxiliarObj["condition"] = values_i_1;
          break;
          
        // se encuentra el tipo de ejecucion del evento
        case("execution"):
          auxiliarObj["execution"] = babel[values_i_1];
          break;

        // se encuentra la posicion del mensaje del evento
        case("msg_pos"):
          auxiliarObj["msg_pos"] = babel[values_i_1];
          break;

        // se encuentra la accion a ejecutar del evento
        case("action"):
          auxiliarObj["action"] = babel[values_i_1];
          break;
          
        // se encuentran los parametros de la accion a ejecutar del evento
        case("parameter"):
          auxiliarObj["parameter"] = values_i_1;
          break;
          
        // se encuentra si el auxiliar es una secuencia
        case("sequence"):
          auxiliarObj["sequence"] = (babel[values_i_1] == "true");
          break;
          
        default:
          var ind    = values_i_0.indexOf(".");
          var prefix = babel[values_i_0.substring(0,ind)];
          var sufix  = babel[values_i_0.substring(ind+1)];
          
          // se encuentra la tipografia del parametro
          if ((prefix == "parameter") && (sufix == "font")) {
            auxiliarObj["parameterFont"] = values_i_1;
            break;
          }
          
          console.log("----- attributo de auxiliar no identificado: <" + values_i_0 + "> valor: <" + values_i_1 + "> -----");
          break;
      }
    }
        
    // una secuencia
    if (auxiliarObj.sequence) {
      var auxS = new descartesJS.AuxSequence(this.parent, auxiliarObj);
      return;
    }
    
    // una constante
    else if (auxiliarObj.constant) {
      // si se evalua una sola vez
      var auxC = new descartesJS.Constant(this.parent, auxiliarObj);
      
      // si se evalua siempre
      if ((auxiliarObj.evaluate) && (auxiliarObj.evaluate == "always")) {
        this.parent.auxiliaries.push(auxC);
      }
      return;
    } 
      
    // un algoritmo
    else if ((auxiliarObj.algorithm) && (auxiliarObj.evaluate)) {
      // si se evalua una sola vez
      var auxA = new descartesJS.Algorithm(this.parent, auxiliarObj);
      
      // si se evalua siempre
//       if (auxiliarObj.evaluate == "always") {
        this.parent.auxiliaries.push(auxA);
//       }
      return;
    }
    
    // un vector 
    else if ((auxiliarObj.array) && (!auxiliarObj.matrix) && (auxiliarObj.id.charAt(auxiliarObj.id.length-1) != ")")) {
      // si se evalua una sola vez
      var auxV = new descartesJS.Vector(this.parent, auxiliarObj);

      // si se evalua siempre
      if ((auxiliarObj.evaluate) && (auxiliarObj.evaluate == "always")) {
        this.parent.auxiliaries.push(auxV);
      }
      return;
    }

    // una matriz 
    else if ((auxiliarObj.matrix) && (auxiliarObj.id.charAt(auxiliarObj.id.length-1) != ")")) {
      // si se evalua una sola vez
      var auxM = new descartesJS.Matrix(this.parent, auxiliarObj);

      // si se evalua siempre
      if ((auxiliarObj.evaluate) && (auxiliarObj.evaluate == "always")) {
        this.parent.auxiliaries.push(auxM);
      }
      return;
    }
    
    // un evento
    else if ((auxiliarObj.event) && (auxiliarObj.id.charAt(auxiliarObj.id.length-1) != ")")) {
      var auxE = new descartesJS.Event(this.parent, auxiliarObj);
      this.parent.events.push(auxE);
      return;
    }
    
    else {
      // una funcion
      if (auxiliarObj.id.charAt(auxiliarObj.id.length-1) == ")") {
        var auxF = new descartesJS.Function(this.parent, auxiliarObj);
      } 
      // una variable
      else {
	var auxV = new descartesJS.Variable(this.parent, auxiliarObj);
      }
      return;
    }
  }
  
  /**
   * 
   */
  descartesJS.LessonParser.prototype.parseAction = function(theAction) {
    var theAction_action = theAction.action;
    var theAction_parent = theAction.parent;
    var theAction_parameter = theAction.parameter;
    
    // si tiene alguna accion, creamos la accion correspondiente
    if (theAction_action) {
      switch (theAction_action) {
        // muestra un mensaje
        case("message"):
          return (new descartesJS.Message(theAction_parent, theAction_parameter));
          break;
          
        // realizar calculos
        case("calculate"):
          return (new descartesJS.Calculate(theAction_parent, theAction_parameter));
          break;
          
        // abre un url
        case("openURL"):
          return (new descartesJS.OpenURL(theAction_parent, theAction_parameter));
          break;

        // abre una escena
        case("openScene"):
          return (new descartesJS.OpenScene(theAction_parent, theAction_parameter));
          break;

        // muestra los creditos
        case("about"):
          return (new descartesJS.About(theAction_parent, theAction_parameter));
          break;

        // muestra la configuracion de la escena
        case("config"):
          return (new descartesJS.Config(theAction_parent, theAction_parameter));
          break;

        // inicia la escena
        case("init"):
          return (new descartesJS.Init(theAction_parent, theAction_parameter));
          break;
          
        // limpia los rastros de la escena
        case("clear"):
          return (new descartesJS.Clear(theAction_parent, theAction_parameter));
          break;
          
        // comienza la animacion
        case("animate"):
          return (new descartesJS.Animate(theAction_parent, theAction_parameter));
          break;
          
        // reinicia la animacion
        case("initAnimation"):
          return (new descartesJS.InitAnimation(theAction_parent, theAction_parameter));
          break;
          
        // reproduce audio
        case("playAudio"):
          return (new descartesJS.PlayAudio(theAction_parent, theAction_parameter));
          break;

        default:
          console.log("----- Accion no soportada aun: <" + theAction_action + "> -----");
          break;
      }
    } 
    // regresamos un objeto cuya funcion de ejecucion no hace nada
    else {
      return {execute : function(){}};
    }
  }

  /**
   * Parsea y registra una animacion
   * @param {String} values es la cadena que contiene los valores que definen la animacion
   */
  descartesJS.LessonParser.prototype.parseAnimation = function(values) {
    // el objeto que contendra todos los valores encontrados en values
    var animationObj = {};
    
    // variable temporal para fines de calculos intermedios
    var temp;
    
    // se eliminan las comillas sencillas de la cadena de valores que definen a la animacion y se dividen los valores, en el nombre del parametro y su valor
    values = this.split(values);

    var values_i_0, values_i_1;
    // se recorren todos los valores y se asignan a las variables de la animacion
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      switch(babel[values_i_0]) {
        
        // se encuentra el delay de la animacion
        case("delay"):
          animationObj["delay"] = values_i_1;
          break;
          
        // se encuentra si la animacion muestra los controles o no
        case("controls"):
          animationObj["controls"] = (babel[values_i_1] == "true");
          break;

        // se encuentra si la animacion se inicia automaticamente
        case("auto"):
          animationObj["auto"] = (babel[values_i_1] == "true");
          break;

        // se encuentran si la animacion se cicla
        case("loop"):
          animationObj["loop"] = (babel[values_i_1] == "true");
          break;
         
        // se encuentran las expresiones iniciales
        case("init"):
          animationObj["init"] = values_i_1;
          break;
          
        // se encuentran las expresiones hacer
        case("do"):
          animationObj["doExpr"] = values_i_1;
          break;
          
        // se encuentran las expresiones mientras
        case("while"):
          animationObj["whileExpr"] = values_i_1;
          break;
         
        case("id"):
          animationObj["id"] = values_i_1;
          break;
         
        case("algorithm"):
          animationObj["algorithm"] = (babel[values_i_1] == "true");
          break;
          
        case("evaluate"):
          animationObj["evaluate"] = (babel[values_i_1] == "true");
          break;          
         
        // cualquier variable que falte
        default:
          console.log("----- attributo de la animacion no identificado: <" + values_i_0 + ">  <" + values_i_1 + "> -----");
          break;
      }
    }
    
    return (new descartesJS.Animation(this.parent, animationObj));
  }
  
  /**
   * 
   */
  descartesJS.LessonParser.prototype.parsePleca = function(values, w) {
    values = this.split(values);

    // el objeto que contendra todos los valores encontrados en values
    var plecaObj = {};
    plecaObj.title = "";
    plecaObj.subtitle = "";
    plecaObj.subtitlines = 0;
    plecaObj.bgcolor = "#536891";
    plecaObj.fgcolor = "white";
    plecaObj.align = "left";
    plecaObj.titleimage = "";
    // plecaObj.titlefont = "SansSerif,PLAIN,22";
    // plecaObj.subtitlefont = "SansSerif,PLAIN,20";
    plecaObj.titlefont = "SansSerif,BOLD,20";
    plecaObj.subtitlefont = "SansSerif,PLAIN,18";
     
    var values_i_0, values_i_1;
    // se recorren todos los valores y se asignan a las variables de la pleca
    for(var i=0, l=values.length; i<l; i++) {
      values_i_0 = values[i][0];
      values_i_1 = values[i][1];

      switch(values_i_0) {
        // se encuentra el texto del titulo
        case("title"):
          plecaObj.title = values_i_1;
          break;
         
        // se encuentra el texto del subtitulo
        case("subtitle"):
          plecaObj.subtitle = values_i_1;
          break;

        // se encuentra el numero de lineas texto del subtitulo
        case("subtitlines"):
          plecaObj.subtitlines = values_i_1;
          break;

        // se encuentra el color de fondo de la pleca
        case("bgcolor"):
          if (values_i_1 !== "") {
            plecaObj.bgcolor = "#" + descartesJS.getColor(this.evaluator, values_i_1);
          }
          break;

        // se encuentra el color del texto de la pleca
        case("fgcolor"):
          if (values_i_1 !== "") {
            plecaObj.fgcolor = "#" + descartesJS.getColor(this.evaluator, values_i_1);
          }
          break;

        // se encuentra el tipo de alineacion del texto de la pleca
        case("align"):
          if (values_i_1 !== "") {
            plecaObj.align = values_i_1;
          }
          break;

        // se encuentra el nombre de archivo de la imagen de la pleca
        case("titleimage"):
          plecaObj.titleimage = values_i_1;
          break;

        // se encuentra la tipografia del titulo
        case("titlefont"):
          if (values_i_1 !== "") {
            plecaObj.titlefont = descartesJS.convertFont(values_i_1);
          } else {
            plecaObj.titlefont = descartesJS.convertFont(plecaObj.titlefont);
          }
          break;

        // se encuentra la tipografia del titulo
        case("subtitlefont"):
          if (values_i_1 !== "") {
            plecaObj.subtitlefont = descartesJS.convertFont(values_i_1);
          } else {
            plecaObj.subtitlefont = descartesJS.convertFont(plecaObj.subtitlefont);
          }
          break;

        // cualquier variable que falte
        default:
          console.log("----- attributo de la pleca no identificado: <" + values_i_0 + ">  <" + values_i_1 + "> -----");
          break;
      }
    }

    // el tamano de la tipografica del subtitulo
    var subtitleFontSize = plecaObj.subtitlefont.substring(0, plecaObj.subtitlefont.indexOf("px"));
    subtitleFontSize = subtitleFontSize.substring(subtitleFontSize.lastIndexOf(" "));

    // que tanto se despega del borde el contenido de la pleca
    var paddingSides = 15;

    // la imagen de la pleca y su altura si es que existe
    var image;
    var imageHeight;
    if (plecaObj.titleimage != "") {
      image = this.parent.getImage(plecaObj.titleimage);
      imageHeight = image.height;
    }
    
    // se crea el contenedor de la pleca
    plecaObj.divPleca = document.createElement("div");
    plecaObj.divPleca.setAttribute("id", "descartesPleca");

    // si existe una imagen, entonces la altura de la pleca se ajusta a la altura de la imagen
    if (imageHeight) {
      plecaObj.divPleca.setAttribute("style", "position: absolute; left: 0px; top: 0px; text-align: " + plecaObj.align + "; width: " + (w-2*paddingSides) + "px; height: "+ (imageHeight-16) + "px; background: " + plecaObj.bgcolor + "; color: " + plecaObj.fgcolor + "; padding-top: 8px; padding-bottom: 8px; padding-left: " + paddingSides + "px; padding-right: " + paddingSides + "px; margin: 0px; overflow: hidden; z-index: 100;");
      
      image.setAttribute("style", "position: absolute; left: 0px; top: 0px; z-index: -1; width: 100%; height: 100%");
      plecaObj.divPleca.appendChild(image);
    } 
    // si no hay una imagen la altura no se especifica para que el contenedor la calcule solo
    else {
      plecaObj.divPleca.setAttribute("style", "position: absolute; left: 0px; top: 0px; text-align: " + plecaObj.align + "; width: " + (w-2*paddingSides) + "px; background: " + plecaObj.bgcolor + "; color: " + plecaObj.fgcolor + "; padding-top: 8px; padding-bottom: 8px; padding-left: " + paddingSides + "px; padding-right: " + paddingSides + "px; margin: 0px; z-index: 100;");
    }
    
    // se crea el contenedor para el titulo y se agrega su contenido
    var divTitle = document.createElement("div");
    divTitle.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.titlefont + "; overflow: hidden; white-space: nowrap;");
    divTitle.innerHTML = plecaObj.title;

    // se crea el contenedor pare el subtitulo
    var divSubTitle = document.createElement("div");

    // si el numero de lineas del subtitulo es igual a 1 entonces el alto del subtitulo se ajusta a que solo sea una linea
    if (parseInt(plecaObj.subtitlines) == 1) {
      var tempDiv;
      var tempDivHeight;
      var tempFontSize;
      var noLines;
      var tempDecrement = 0;

      // se crea un contenedor temporal que sirve como sustituto al contenedor del subtitulo, y con el determinar el tamano de la letra del contenedor del subtitulo
      tempDiv = document.createElement("div");
      tempDiv.innerHTML = plecaObj.subtitle;
      document.body.appendChild(tempDiv);
      tempFontSize = subtitleFontSize;

      do {
        tempFontSize = tempFontSize - tempDecrement;
        
        // se asigna el estilo al contenedor temporar para medir el numero de lineas en las que rompe el texto
        tempDiv.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.subtitlefont + "; font-size: " + tempFontSize + "px; width: " + (w-2*paddingSides) + "px; line-height: " + tempFontSize + "px;")
        
        // se encuentra la altura del contenedor temporal
        tempDivHeight = tempDiv.offsetHeight;
        // se encuentra el numero de lineas dividiendo la altura entre la altura de una linea
        noLines = tempDivHeight / tempFontSize;

        tempDecrement = 1;
      } 
      // si el numero de lineas es uno o si el tamano de la fuente se vuelve mas pequena que 8px entonces se termina la busqueda
      while ((noLines > 1) && (tempFontSize > 8));

      // se remueve el contenedor temporal del cuerpo
      document.body.removeChild(tempDiv);
      
      // se asigna el estilo al subtitulo con el tamano de tipografia adecuado
      divSubTitle.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.subtitlefont + "; font-size: " + tempFontSize + "px; line-height: 110%; overflow: hidden; white-space: nowrap;");
    } 
    // si el numero de lineas es diferente de 1, entonces el numero de lineas se ignora
    else {
      divSubTitle.setAttribute("style", "padding: 0px; margin: 0px; font: " + plecaObj.subtitlefont + "; line-height: 110%;");
    }
    // se asigan el contenido al subtitulo
    divSubTitle.innerHTML = plecaObj.subtitle;

    plecaObj.divPleca.appendChild(divTitle);
    plecaObj.divPleca.appendChild(divSubTitle);
    
//     console.log(plecaObj.title, plecaObj.subtitle, plecaObj.subtitlines, plecaObj.bgcolor, plecaObj.fgcolor, plecaObj.align, plecaObj.titleimage, plecaObj.titlefont, plecaObj.subtitlefont);

    plecaObj.divPleca.imageHeight = imageHeight;
    return plecaObj.divPleca;
  }
  
  /**
   * Elimina las comillas sencillas de la cadena de valores y se dividen en un arreglo con el nombre del parametro y su valor
   * @param {String} values es la cadena que contiene los valores a dividir
   * @return {[[String,String]]} regresa un arreglo de parejas nombre valor
   */
  descartesJS.LessonParser.prototype.split = function(values) {
    if (typeof(values) != "string") {
      return [];
    }

    values = values || "";
    values = values.replace(/\\'/g, "’");
    var splitValues = [];
    var pos = 0;
    var i = 0;
    var initToken = false;
    var initPosToken = 0;
    var endPosToken = 0;
    var stringToken = false;
    var valueToken = false;
    var charAt;

    // se recorre la cadena a dividir
    while (pos < values.length) {
      // se ignoran los espacios en blanco si no se ha inciado la identificacion de un token
      if ((values.charAt(pos) == " ") && (!initToken)) {
        pos++;
      }
      
      // se encuentra un caracter que es diferente de un espacio en blanco
      if ((values.charAt(pos) != " ") && (!initToken)) {
        initToken = true;
        initPosToken = pos;
      }
      
      // los valores estan especificados como una cadena
      if ((values.charAt(pos) == "=") && (values.charAt(pos+1) == "'") && (!stringToken)) {
        stringToken = true;
        
        splitValues[i] = [values.substring(initPosToken, pos)]

        initPosToken = pos+2;
        
        pos+=2;
      }
      
      if ((stringToken) && (values.charAt(pos) == "'")) {
        stringToken = false;
        
        initToken = false;
        
        splitValues[i].push(values.substring(initPosToken, pos));
        
        i++;
      }

      // los valores estan especificados como una secuencia de palabras
      if ((values.charAt(pos) == "=") && (values.charAt(pos+1) != "'") && (!stringToken)) {
        // valueToken = true;

        splitValues[i] = [values.substring(initPosToken, pos)]

        initPosToken = pos+1;
        
        pos++;

        // find the next space and equal sign
        var tmpIndexEqual = (values.substring(pos)).indexOf("=");
        var tmpIndexSpace;
        if (tmpIndexEqual == -1) {
          tmpIndexEqual = values.length;
          tmpIndexSpace = values.length;
        } 
        else {
          tmpIndexEqual += pos;

          tmpIndexSpace = values.substring(pos, tmpIndexEqual).lastIndexOf(" ");
          if (tmpIndexSpace == -1) {
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

      // if ((valueToken) && (values.charAt(pos) == " ")) {
      //   valueToken = false;

      //   initToken = false;

      //   splitValues[i].push(values.substring(initPosToken, pos));
        
      //   i++;
      // }

      // // los valores estan especificados como una palabra y ya se terminaron los datos
      // if ((valueToken) && (pos == values.length-1)) {
      //   splitValues[i].push(values.substring(initPosToken, values.length));
      // }
      
      pos++;
    }      

    return splitValues;
  }
  
  /**
   * 
   */
  descartesJS.LessonParser.prototype.splitComa = function(string) {
    var splitString = [];
    var parentesisStack = [];
    var lastSplitIndex = 0;
    for (var i=0, l=string.length; i<l; i++) {
      if (string.charAt(i) == "(") {
        parentesisStack.push(i);
      }
      else if (string.charAt(i) == ")") {
        parentesisStack.pop();
      }
      else if ((string.charAt(i) == ",") && (parentesisStack.length == 0)) {
        splitString.push(string.substring(lastSplitIndex, i));
        lastSplitIndex = i+1;
      }
    }
    
    splitString.push(string.substring(lastSplitIndex));
    
    return splitString;
  }
  
  /**
   *
   */
  descartesJS.LessonParser.prototype.convertColor = function(color) {
    // el color es un color escrito por su nombre
    if (babel[color]) {
      if (babel[color] == "net") {
        return "red";
      }
      return babel[color];
    }
    
    // el color esta descrito por 6 digitos hexadecimales dos por cada componente, RGB #RRGGBB
    if (color.length == 6) {
      return "#" + color;
    }

    // el color esta descrito 8 digitos hexadecimales dos por cada componente, RGBA #RRGGBBAA
    if (color.length == 8) {
      return "rgba("+ parseInt("0x"+color.substring(2,4), 16) +","
                    + parseInt("0x"+color.substring(4,6), 16) +","
                    + parseInt("0x"+color.substring(6,8), 16) +","
                    + (1-parseInt("0x"+color.substring(0,2), 16)/255)
                    + ")";
    }
    
    // el color esta descrito por una expresion (exprR, exprG, exprB, exprA)
    if (color[0] == "(") {
      var tmpColor = "(";
      var splitColor = this.splitComa(color.substring(1,color.length-1));
      var hexColor;

      for (var i=0, l=splitColor.length; i<l; i++) {
        hexColor = parseInt(splitColor[i], 16);
        
        if (splitColor[i] != hexColor.toString(16)) {
          if ((splitColor[i].charAt(0) == "[") && (splitColor[i].charAt(splitColor[i].length-1) == "]")) {
            splitColor[i] = splitColor[i].substring(1, splitColor[i].length-1);
          }
          tmpColor = tmpColor + splitColor[i] + ((i<l-1)?",":")");
        } else {
          tmpColor = tmpColor + (hexColor/255) + ((i<l-1)?",":")");
        }
      }

      return this.parser.parse(tmpColor);
    }
    
    // cualquier otro valor
    return "#aa0000";
  }

  /**
   *
   */
  descartesJS.LessonParser.prototype.parseText = function(text) {
    // es un texto en RTF
    if (text.match(/^\{\\rtf1/)) {
      var RTFparser = new descartesJS.RTFParser(this.parent.evaluator);
      return RTFparser.parse(text.substring(10, text.length-1));
    }
    
    // es un texto simple
    return new descartesJS.SimpleText(text, this.parent);
  }

  return descartesJS;
})(descartesJS || {});