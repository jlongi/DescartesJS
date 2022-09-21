/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS, babel) {
  if (descartesJS.loadLib) { return descartesJS; }

  var regExpType = new String("-point-segment-polygon-curve-triangle-face-polireg-surface-text-cube-box-tetrahedron-octahedron-sphere-dodecahedron-icosahedron-ellipsoid-cone-cylinder-torus-mesh-macro-");
  var regExpImage = /[\w\.\-//]*(\.png|\.jpg|\.gif|\.svg|\.webp)/gi;
  var thisGraphics_i;
  var thisGraphicsNext;
  var macros_count = 0;

  class Macro3D extends descartesJS.Graphic {
    /**
     * A Descartes macro
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the macro
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.expresion = this.expresion || undefined;
      this.inirot = this.inirot || "(0,0,0)";
      this.inirotEuler = this.inirotEuler || false;
      this.inipos = this.inipos || parent.evaluator.parser.parse("(0,0,0)");
      this.endrot = this.endrot || "(0,0,0)";
      this.endrotEuler = this.endrotEuler || false;
      this.endpos = this.endpos || parent.evaluator.parser.parse("(0,0,0)");
      this.name = this.name || "_descartes_empty_name_" + (macros_count++)

      // assign the values to replace the defaults values of the object
      Object.assign(this, values);

      // euler rotations
      if (this.inirot.match("Euler")) {
        this.inirot = this.inirot.replace("Euler", "");
        this.inirotEuler = true;
      }
      if (this.endrot.match("Euler")) {
        this.endrot = this.endrot.replace("Euler", "");
        this.endrotEuler = true;
      }

      this.inirot = this.evaluator.parser.parse(this.inirot);
      this.endrot = this.evaluator.parser.parse(this.endrot);

      // auxiliary matrices
      this.inirotM   = new descartesJS.Matrix4x4();
      this.inirotM_X = new descartesJS.Matrix4x4();
      this.inirotM_Y = new descartesJS.Matrix4x4();
      this.inirotM_Z = new descartesJS.Matrix4x4();
      this.iniposM   = new descartesJS.Matrix4x4();

      this.endrotM   = new descartesJS.Matrix4x4();
      this.endrotM_X = new descartesJS.Matrix4x4();
      this.endrotM_Y = new descartesJS.Matrix4x4();
      this.endrotM_Z = new descartesJS.Matrix4x4();
      this.endposM   = new descartesJS.Matrix4x4();

      this.graphics = [];
      
      var lessonParser = parent.lessonParser;
      var tokenizer = new descartesJS.Tokenizer();
      
      // if the expression is empty
      if (this.expresion == undefined) {
        return;
      }

      // if the macro name was not specified as a string, then adds single quotes to turn it into string
      if ( !(this.expresion.charAt(0) === "'")) {
        this.expresion = "'" + this.expresion + "'";
      }
      this.expresion = this.evaluator.parser.parse(this.expresion);

      var filename = this.evaluator.eval(this.expresion);
      var response;

      if (filename) {
        // the macro is embedded in the webpage
        var macroElement = document.getElementById(filename);

        if ((macroElement) && (macroElement.type == "descartes/macro")) {
          response = macroElement.text;
        }
        // the macro is in an external file
        else {
          response = descartesJS.openExternalFile(filename);
        }
      }

      var indexOfEqual;
      var tmpResponse;

      // if it was possible to read the macro
      if (response) {
        tmpResponse = (descartesJS.convertHTMLEntities(response)).replace(/\r/g, "").split("\n");

        // maintain only the lines that have information for the macro
        response = [];

        for(var i=0, l=tmpResponse.length; i<l; i++) {
          indexOfEqual = tmpResponse[i].indexOf("=");

          if(indexOfEqual !== -1) {
            var tmpSplitLine = lessonParser.split(tmpResponse[i]);
            for (var iT=0,lT=tmpSplitLine.length; iT<lT; iT++) {
              if ((tmpSplitLine[iT]) && (tmpSplitLine.length >1)) {
                if ((babel[tmpSplitLine[iT][0]] === "id") || (babel[tmpSplitLine[iT][0]] === "type")) {
                  response.push(tmpSplitLine);
                  break;
                }
              }
            }
          }
        }

        var respText;
        var babelResp;
        var dotIndex;
        var tmpTokens;
        var tmpTokensRespText;
        var isID;
        var isSurface;

        // add the macro name as a prefix, only in some expressions
        for (var i=0, l=response.length; i<l; i++) {
          respText = response[i] || [];

          isID = ((respText) && (respText[0]) && (respText[0][0] === "id"));
          isSurface = false;

          for (var j=0, k=respText.length; j<k; j++) {
            // if the parameters have a dot
            dotIndex = respText[j][0].indexOf(".");
            if ((dotIndex !== -1) && (!isID)) {
              babelResp = babel[respText[j][0].substring(dotIndex+1)];
              respText[j][0] = this.name + "." + respText[j][0];
            }
            else {
              babelResp = babel[respText[j][0]];
            }

            if ( (babelResp === "type") && (babel[respText[j][1]] === "surface") ) {
              isSurface = true;
            }

            // if the expressions are different from this, then the cycle continues and is not replaced nothing        
            if ( (babelResp === "font") ||
                (babelResp === "font_family") ||
                (((babelResp === "fill") || (babelResp === "color") || (babelResp === "backcolor") || (babelResp === "arrow")) && (respText[j][1].charAt(0) !== "(")) ||
                ((babelResp === "file") && (respText[j][1].match(regExpImage))) ||
                ((babelResp !== "id") && (babel[respText[j][1]] !== undefined)) ||
                (isSurface && babelResp === "expresion")
              ) {
                if ((babelResp !== "width") && (babelResp !== "height") && (babelResp !== "length")) {
                  continue;
                }
            }

            // is a text
            if (babelResp == "text") {
              // if the text is rtf must processing it different
              if (respText[j][1].match(/\{\\rtf1/)) {
                var textTemp = respText[j][1];
  
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                var self = this;

                // function to replace expressions
                var funReplace = function(str, m1) {
                  var tokens = tokenizer.tokenize(m1.replace(/\&squot;/g, "'"));
                  
                  for (var t=0, lt=tokens.length; t<lt; t++) {
                    if (
                      ((tokens[t].type == "identifier") && (!descartesJS.reservedIds.match("-" + tokens[t].value + "-"))) ||
                      (tokens[t].value === "R") ||
                      (tokens[t].value === "G") ||
                      (tokens[t].value === "B")
                    ) {
                      tokens[t].value = self.name + "." + tokens[t].value;
                    }
                  }
                  
                  var prefix = (str.match(/^\\expr/)) ? "\\expr " : "\\decimals ";

                  return prefix + tokenizer.flatTokens(tokens);
                }
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
                textTemp = textTemp.replace(/\\expr ([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.'\+\-]*)/gi, funReplace);
                textTemp = textTemp.replace(/\\decimals ([a-zA-Z_0-9\u00C0-\u021B+*/%|&^#!?:()><.'\+\-]*)/gi, funReplace);
                
                respText[j][1] = textTemp;
              }
              // simple text
              else {
                // tmpTokensRespText = lessonParser.parseText(respText[j][1]).textElementsMacro3Ds;
                tmpTokensRespText = lessonParser.parseText(respText[j][1]).textElementsMacros;

                for (var ttrt=0, lttrt=tmpTokensRespText.length; ttrt<lttrt; ttrt++) {
                  tmpTokens = tokenizer.tokenize(tmpTokensRespText[ttrt].replace(/\&squot;/g, "'"));

                  for (var tt=0, ltt=tmpTokens.length; tt<ltt; tt++) {
                    if (
                      ((tmpTokens[tt].type === "identifier") && (!descartesJS.reservedIds.match("-" + tmpTokens[tt].value + "-"))) ||
                      (tmpTokens[tt].value === "R") ||
                      (tmpTokens[tt].value === "G") ||
                      (tmpTokens[tt].value === "B")
                    ) {
                      tmpTokens[tt].value = this.name + "." + tmpTokens[tt].value;
                    }
                  }
                  tmpTokens = (tokenizer.flatTokens(tmpTokens)).replace(/&squot;/g, "'").replace(/'\+\(/g, "[").replace(/\)\+'/g, "]");

                  tmpTokensRespText[ttrt] = tmpTokens.substring(1, tmpTokens.length-1);
                }

                respText[j][1] = tmpTokensRespText.join("");
              }
            }
            // the token is not a text
            else {
              var tmpTokensArray = respText[j][1].replace(/\&squot;/g, "'").split(";");

              for (var tmpI=0, tmpL=tmpTokensArray.length; tmpI<tmpL; tmpI++) {
                tmpTokens = tokenizer.tokenize(tmpTokensArray[tmpI].replace(/\\n/g, ";"));

                for (var t=0, lt=tmpTokens.length; t<lt; t++) {
                  if (
                    ((tmpTokens[t].type === "identifier") && (!descartesJS.reservedIds.match("-" + tmpTokens[t].value + "-"))) ||
                    (tmpTokens[t].value === "R") ||
                    (tmpTokens[t].value === "G") ||
                    (tmpTokens[t].value === "B")
                  ) {
                    tmpTokens[t].value = this.name + "." + tmpTokens[t].value;
                  }
                }

                tmpTokensArray[tmpI] = tokenizer.flatTokens(tmpTokens);
              }

              respText[j][1] = tmpTokensArray.join(";");
            }
          }
        }

        var tempResp;
        var isGraphic;

        // flat the expressions to obtain a string
        for (var i=0, l=response.length; i<l; i++) {
          if (response[i][0]) {
            tempResp = "";
            isGraphic = false;

            for (var j=0, k=response[i].length; j<k; j++) {
              // if the object has a type and is of the graphic3D type, then is a graphic object
              if ( (babel[response[i][j][0]] === "type") && (regExpType.match("-" + babel[response[i][j][1]] + "-")) ) {
                isGraphic = true;
              }

              tempResp = tempResp + response[i][j][0] + "='" + response[i][j][1] + "' ";
            }

            response[i] = tempResp + ((isGraphic) ? " space='" + this.spaceID + "'" : "");

            // build and add the graphic elements to the space
            if (isGraphic) {
              // add something to indicate that it comes from a macro
              this.graphics.push( lessonParser.parse3DGraphic(response[i], this.abs_coord, this.background, this.inirot) );
            } 
            // build and add the auxiliaries to the scene
            else {
              lessonParser.parseAuxiliar(response[i]);
            }
          }
        }
      }

      for (var i=0, l=this.graphics.length; i<l; i++) {
        this.graphics[i].macroChildren = true;
      }

    }

    /**
     *
     */
    buildFamilyPrimitives() {
      evaluator = this.evaluator;

      // update the family values
      this.getFamilyValues();

      // save the last value of the family parameter
      var tempParam = evaluator.getVariable(this.family);

      if (this.fSteps >= 0) {
        // build the primitives of the family
        for(var i=0, l=this.fSteps; i<=l; i++) {
          // update the value of the family parameter
          evaluator.setVariable(this.family, this.familyInf+(i*this.family_sep));

          this.familyValue = this.familyInf+(i*this.family_sep);

          // if the condition to draw is true then update and draw the graphic
          if ( evaluator.eval(this.drawif) ) {
            this.updateMacro();
          }
        }
      }

      evaluator.setVariable(this.family, tempParam);
    }

    /**
     * Update the macro
     */
    update() {
      this.primitives = [];

      if (this.evaluator.eval(this.drawif)) {
        // build the primitives of a single object
        if (!this.family) {
          this.updateMacro();
        }
      }

      // build the primitives of the family
      if (this.family) {
        this.buildFamilyPrimitives();
      }    
    }

    /**
     * 
     */
    updateMacro() {
      this.updateTransformation();

      if (this.inipos) {
        var expr = this.evaluator.eval(this.inipos);
        this.iniPosX = expr[0][0];
        this.iniPosY = expr[0][1];
      }

      for (var i=0, l=this.graphics.length; i<l; i++) {
        thisGraphics_i = this.graphics[i];

        thisGraphics_i.macro_inirotEuler = this.inirotEuler;
        thisGraphics_i.macro_inirotM     = this.inirotM;
        thisGraphics_i.macro_inirotM_X   = this.inirotM_X;
        thisGraphics_i.macro_inirotM_Y   = this.inirotM_Y;
        thisGraphics_i.macro_inirotM_Z   = this.inirotM_Z;
        thisGraphics_i.macro_iniposM = this.iniposM;

        thisGraphics_i.macro_endrotEuler = this.endrotEuler;
        thisGraphics_i.macro_endrotM     = this.endrotM;
        thisGraphics_i.macro_endrotM_X   = this.endrotM_X;
        thisGraphics_i.macro_endrotM_Y   = this.endrotM_Y;
        thisGraphics_i.macro_endrotM_Z   = this.endrotM_Z;
        thisGraphics_i.macro_endposM = this.endposM;

        thisGraphics_i.update();
      }

      // split the primitives if needed
      for (var i=0, l=this.graphics.length; i<l; i++) {
        thisGraphics_i = this.graphics[i];

        if ((thisGraphics_i.split) || (this.split)) {
          for (var j=i+1; j<l; j++) {
            thisGraphicsNext = this.graphics[j];

            if ((thisGraphicsNext.split) || (this.split)) {
              thisGraphics_i.splitFace(thisGraphicsNext);
            }
          }
        }

        this.primitives = this.primitives.concat( thisGraphics_i.primitives || [] );
      }
    }

    /**
     *
     */
    updateTransformation() {
      tmpExpr = this.evaluator.eval(this.inirot);
      if (this.inirotEuler) {
        this.inirotM = this.inirotM.setIdentity();
        this.inirotM = this.inirotM.rotateZ(descartesJS.degToRad(tmpExpr[0][0])); //Z
        this.inirotM = this.inirotM.rotateX(descartesJS.degToRad(tmpExpr[0][1])); //X
        this.inirotM = this.inirotM.rotateZ(descartesJS.degToRad(tmpExpr[0][2])); //Z
      }
      else {
        this.inirotM_X = this.inirotM_X.setIdentity().rotateX(descartesJS.degToRad(tmpExpr[0][0])); //X
        this.inirotM_Y = this.inirotM_Y.setIdentity().rotateY(descartesJS.degToRad(tmpExpr[0][1])); //Y
        this.inirotM_Z = this.inirotM_Z.setIdentity().rotateZ(descartesJS.degToRad(tmpExpr[0][2])); //Z
      }

      tmpExpr = this.evaluator.eval(this.inipos);
      translate = { x: tmpExpr[0][0], y: tmpExpr[0][1], z: tmpExpr[0][2] };
      this.iniposM = this.iniposM.setIdentity().translate(translate);

      tmpExpr = this.evaluator.eval(this.endrot);
      if (this.endrotEuler) {
        this.endrotM = this.endrotM.setIdentity();
        this.endrotM = this.endrotM.rotateZ(descartesJS.degToRad(tmpExpr[0][0])); //Z
        this.endrotM = this.endrotM.rotateX(descartesJS.degToRad(tmpExpr[0][1])); //X
        this.endrotM = this.endrotM.rotateZ(descartesJS.degToRad(tmpExpr[0][2])); //Z
      }
      else {
        this.endrotM_X = this.endrotM_X.setIdentity().rotateX(descartesJS.degToRad(tmpExpr[0][0])); //X
        this.endrotM_Y = this.endrotM_Y.setIdentity().rotateY(descartesJS.degToRad(tmpExpr[0][1])); //Y
        this.endrotM_Z = this.endrotM_Z.setIdentity().rotateZ(descartesJS.degToRad(tmpExpr[0][2])); //Z
      }

      tmpExpr = this.evaluator.eval(this.endpos);
      translate = { x: tmpExpr[0][0], y: tmpExpr[0][1], z: tmpExpr[0][2] };
      this.endposM = this.endposM.setIdentity().translate(translate);
    }
    
    /**
     * Auxiliary function for draw a macro
     * @param {CanvasRenderingContext2D} ctx rendering context on which the macro is drawn
     */
    drawAux(ctx) { }
  }

  descartesJS.Macro3D = Macro3D;
  return descartesJS;
})(descartesJS || {}, babel);
