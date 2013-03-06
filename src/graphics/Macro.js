/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un macro de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el macro
   */
  descartesJS.Macro = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    this.graphics = [];
    
    var lessonParser = parent.lessonParser;
    var tokenizer = new descartesJS.Tokenizer();

    // se recorre values para reemplazar los valores iniciales del control
    for (var propName in values) {
      // solo se verifican las propiedades propias del objeto values
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }
    
    // si la expresion se dejo en blanco
    if (this.expresion == undefined) {
      return;
    }
    
    // si el nombre del macro no fue especificado como una cadena, entonces se le agrega las comillas sencillas para convertilo en cadena
    if ( !(this.expresion.match("'")) ) {
      this.expresion = "'" + this.expresion + "'";
    }

    this.expresion = this.evaluator.parser.parse(this.expresion);

    // se obtiene el espacio al que pertenece el grafico
    
    var filename = this.expresion.value; //this.evaluator.evalExpression(this.expresion)
    var response;
      
    // si se lee el macro de un archivo externo se deben omitir solo 2 valores
    var sliceValue = 2; 
    
    if (filename) {
      // si el macro esta embedido en la pagina
      var macroElement = document.getElementById(filename);
      if ((macroElement) && (macroElement.type == "descartes/macro")) {
        response = macroElement.text;
        // si se lee del propio documento se deben omitir 3 valores
        sliceValue = 3;
      }
      
      // si el macro se lee de un archivo
      else {
        response = descartesJS.openExternalFile(filename);
        
        // se verifica que el contenido del archivo sea el de un macro de descartes
        if (!response.match("tipo_de_macro")) {
          response = null;
        }
      }
    }

    var idsMacro = "|";
    // si se pudo leer el archivo del macro
    if (response) {
      response = ( response.replace(/&aacute;/g, "á").replace(/&eacute;/g, "é").replace(/&iacute;/g, "í").replace(/&oacute;/g, "ó").replace(/&uacute;/g, "ú").replace(/&Aacute;/g, "Á").replace(/&Eacute;/g, "É").replace(/&Iacute;/g, "Í").replace(/&Oacute;/g, "Ó").replace(/&Uacute;/g, "Ú").replace(/&ntilde;/g, "ñ").replace(/&Ntilde;/g, "Ñ").replace(/\&gt;/g, ">").replace(/\&lt;/g, "<").replace(/\&amp;/g, "&") ).split("\n").slice(sliceValue);

      var respTemp;
      var tempIndexParenthesis;
      
      // se dividen las lineas en pseudotokens
      for (var i=0, l=response.length; i<l; i++) {
        if (response[i]) {
          response[i] = lessonParser.split(response[i]);
          // console.log(response);
          
          if ( (response[i]) && (response[i][0]) && (response[i][0][0]) && (response[i][0][0] == "id") ) {
            respTemp = response[i][0][1];
            tempIndexParenthesis = respTemp.indexOf("(");
            
            if (tempIndexParenthesis != -1) {
              respTemp = respTemp.substring(0,tempIndexParenthesis)
            }

            idsMacro += respTemp + "|";
          }
        }
      }
      
      var respText;
      var babelResp;
      var dotIndex;
      var tmpTokens;
      var tmpTokensRespText;
      
      // se agrega el nombre del macro como prefijo, solo en algunas expresiones
      for (var i=0, l=response.length; i<l; i++) {
        respText = response[i] || [];
       
        for (var j=0, k=respText.length; j<k; j++) {
          babelResp = babel[respText[j][0]];

          // sirve para los parametros que traen un punto
          dotIndex = respText[j][0].indexOf(".");
          if (dotIndex != -1) {
            babelResp = babel[respText[j][0].substring(dotIndex+1)];
          }
          
          // si las expresiones son diferentes a las siguientes, entonces se sigue con el ciclo y no se sustituye nada
          if ( (babelResp != "id") && 
            (babelResp != "text") && 
            (babelResp != "expresion") && 
            (babelResp != "interval") && 
            (babelResp != "steps") && 
            (babelResp != "drawif") && 
            (babelResp != "size") && 
            (babelResp != "width") && 
            (babelResp != "center") && 
            (babelResp != "radius") && 
            (babelResp != "init") && 
            (babelResp != "end") &&
            (babelResp != "inirot") && 
            (babelResp != "do") &&
            (babelResp != "while") &&
            (babelResp != "file") &&
            (babelResp != "fill") &&
            (babelResp != "color") ) {
//                       console.log("nop - ", respText[j][0]);
            continue;
          }
          
          // es un texto
          if (babelResp == "text") {
            // si el texto es rtf hay que procesarlo de otra manera
            if (respText[j][1].match(/\{\\rtf1/)) {
              var textTemp = respText[j][1];
 
              //////////////////////////////////////////////////////////////////////////////////////////////////////////////
              var self = this;
              // funcion para reemplazar las expresiones
              var funReplace = function(str, m1) {
                var tokens = tokenizer.tokenize(m1.replace(/\&squot;/g, "'"));
                
                for (var t=0, lt=tokens.length; t<lt; t++) {
                  if ( (tokens[t].type == "identifier") && (idsMacro.match("\\|" + tokens[t].value + "\\|")) ) {
                    tokens[t].value = self.name + "." + tokens[t].value;
                  }

                  // si el identificador tiene un punto, por ejemplo vector.long
                  else if ((tokens[t].type == "identifier") && ((dotIndex = (tokens[t].value).indexOf(".")) != -1)) {
                    if (idsMacro.match("\\|" + tokens[t].value.substring(0, dotIndex) + "\\|")) {
                      tokens[t].value = self.name + "." + tokens[t].value;
                    }
                  }
                }
                
                var prefix = (str.match(/^\\expr/)) ? "\\expr " : "\\decimals ";

                return prefix + tokenizer.flatTokens(tokens);
              }
              //////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
              textTemp = textTemp.replace(/\\expr ([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.']*)/gi, funReplace);
              textTemp = textTemp.replace(/\\decimals ([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.']*)/gi, funReplace);
              
              respText[j][1] = textTemp;
            }
            // texto simple
            else {
              tmpTokensRespText = lessonParser.parseText(respText[j][1]).textElementsMacros;

              for (var ttrt=0, lttrt=tmpTokensRespText.length; ttrt<lttrt; ttrt++) {
                tmpTokens = tokenizer.tokenize(tmpTokensRespText[ttrt].replace(/\&squot;/g, "'"));

                for (var tt=0, ltt=tmpTokens.length; tt<ltt; tt++) {
                  if ( (tmpTokens[tt].type == "identifier") && (idsMacro.match("\\|" + tmpTokens[tt].value + "\\|")) ) {
                    tmpTokens[tt].value = this.name + "." + tmpTokens[tt].value;
                  }
                }
                tmpTokens = (tokenizer.flatTokens(tmpTokens)).replace(/&squot;/g, "'").replace(/'\+\(/g, "[").replace(/\)\+'/g, "]");
                tmpTokensRespText[ttrt] = tmpTokens.substring(1, tmpTokens.length-1);
              }

              respText[j][1] = tmpTokensRespText.join("");
            }
          }
          
          else {
            tmpTokens = tokenizer.tokenize(respText[j][1].replace(/\&squot;/g, "'"));
            
            for (var t=0, lt=tmpTokens.length; t<lt; t++) {
              if ( (tmpTokens[t].type == "identifier") && (idsMacro.match("\\|" + tmpTokens[t].value + "\\|")) ) {
                tmpTokens[t].value = this.name + "." + tmpTokens[t].value;
              }
              
              // si el identificador tiene un punto, por ejemplo vector.long
              else if ((tmpTokens[t].type == "identifier") && ((dotIndex = (tmpTokens[t].value).indexOf(".")) != -1)) {
                if (idsMacro.match("\\|" + tmpTokens[t].value.substring(0, dotIndex) + "\\|")) {
                  tmpTokens[t].value = this.name + "." + tmpTokens[t].value;
                }
              }
            }
            respText[j][1] = tokenizer.flatTokens(tmpTokens);
          }
        
        }
      }

      var tempResp;
      
      // se aplanan las expresiones, para despues poder contruir los elementos
      for (var i=0, l=response.length; i<l; i++) {
        if (response[i][0]) {
          tempResp = "";
          for (var j=0, k=response[i].length; j<k; j++) {
            // si no es un objeto grafico
            if (babel[response[i][j][0]] != "type") {
              response[i][j] = response[i][j][0] + "='" + response[i][j][1] + "' ";
            }
            // si es un objeto grafico hay que agregarle el espacio al que pertenece
            else {
              response[i][j] = "espacio='" + this.spaceID + "' " + response[i][j][0] + "='" + response[i][j][1] + "' ";
            }
            tempResp = tempResp + response[i][j];
          }
          
          response[i] = tempResp;
          
          // se construyen y se agregan los elementos
          if (tempResp.match(/^espacio/)) {
            this.graphics.push( lessonParser.parseGraphic(response[i], this.abs_coord, this.background, this.inirot) );
          } 
          else {
            lessonParser.parseAuxiliar(response[i]);
          }
        }
      }
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Macro, descartesJS.Graphic);
    
  /**
   * Actualiza el macro
   */
  descartesJS.Macro.prototype.update = function() {
    if (this.inipos) {
      var expr = this.evaluator.evalExpression(this.inipos);
      this.iniPosX = expr[0][0];
      this.iniPosY = expr[0][1];
    }
  }
  
  /**
   * Funcion auxiliar para dibujar un macro
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el macro
   */
  descartesJS.Macro.prototype.drawAux = function(ctx) {
    for (var i=0, l=this.graphics.length; i<l; i++) {
//       ctx.save();

      if (this.inipos) {
        if (this.graphics[i].abs_coord) {
          ctx.translate(this.iniPosX, this.iniPosY);
        } else {
          ctx.translate(this.iniPosX*this.space.scale, -this.iniPosY*this.space.scale);
        }
      }
      
      this.graphics[i].draw();

      // se resetean las trasnformaciones
      ctx.setTransform(1, 0, 0, 1, 0, 0);

//       ctx.restore();
    }      
  }

  return descartesJS;
})(descartesJS || {});