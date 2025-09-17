/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;

  const degToRad = descartesJS.degToRad;

  let evaluator;
  let expr;
  let tempParam;
  let tmpExpr;
  let tmpVertex;
  let tmpPrimitives;
  let tmpMatrix;

  class Graphic3D {
    /**
     * Descartes 3D graphics
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the graphic
     */
    constructor(parent, values) {
      self = this;

      self.parent = parent;
      self.evaluator = parent.evaluator;

      let parser = parent.evaluator.parser;

      self.spaceID = "E0";
      self.background = false;
      self.type = "";
      self.color = new descartesJS.Color("eeffaa");
      self.backcolor = new descartesJS.Color("6090a0");
      self.Nu = self.Nv = self.evaluator.parser.parse("7");

      self.drawif = parser.parse("1");
      self.abs_coord = false;

      self.family = "";
      self.family_interval = parser.parse("[0,1]");
      self.family_steps = parser.parse("8");

      self.font = "SansSerif,PLAIN,18";
      self.fixed = true;
      self.text = "";
      self.decimals = parser.parse("2");

      self.inirot      = self.endrot      = "(0,0,0)";
      self.inirotEuler = self.endrotEuler = false;
      self.inipos      = self.endpos      = parser.parse("(0,0,0)");

      self.model = "color";

      // assign the values to replace the defaults values of the object
      Object.assign(self, values);

      if ((self.expresion == undefined) && (self.type !== "macro")) {
        self.expresion = parser.parse("(0,0)");
      }

      // get the space of the graphic
      self.space = self.getSpace();

      // get the canvas
      self.canvas = (self.background) ? self.space.backCanvas : self.space.canvas;
      self.ctx = self.canvas.getContext("2d");

      // get a Descartes font
      self.font_str = self.font;
      self.font = descartesJS.convertFont(self.font);
      // get the font size
      self.fontSize = self.font.match(/([\d\.]+)px/);
      self.fontSize = (self.fontSize) ? parseFloat(self.fontSize[1]) : 10;

      self.font_style = descartesJS.getFontStyle(self.font_str.split(",")[1]);

      if ((typeof self.bold === "boolean") || (typeof self.italics === "boolean")) {
        self.font_style = (self.italics ? "Italic " : "") + (self.bold ? "Bold " : "");
      }
      if (!self.font_family) {
        self.font_family = self.font_str.split(",")[0];
      }
      self.font_family = descartesJS.getFontName(self.font_family);
      if (typeof self.font_size === "undefined") {
        self.font_size = parent.evaluator.parser.parse(self.fontSize.toString());
      }


      // euler rotations
      if (self.inirot.includes("Euler")) {
        self.inirot = self.inirot.replace("Euler", "");
        self.inirotEuler = true;
      }
      if (self.endrot.includes("Euler")) {
        self.endrot = self.endrot.replace("Euler", "");
        self.endrotEuler = true;
      }

      self.inirot = parser.parse(self.inirot);
      self.endrot = parser.parse(self.endrot);

      // auxiliary matrices
      self.inirotM   = new descartesJS.Mat4();
      self.inirotM_X = new descartesJS.Mat4();
      self.inirotM_Y = new descartesJS.Mat4();
      self.inirotM_Z = new descartesJS.Mat4();
      self.iniposM   = new descartesJS.Mat4();

      self.endrotM   = new descartesJS.Mat4();
      self.endrotM_X = new descartesJS.Mat4();
      self.endrotM_Y = new descartesJS.Mat4();
      self.endrotM_Z = new descartesJS.Mat4();
      self.endposM   = new descartesJS.Mat4();

      tmpMatrix = new descartesJS.Mat4();
    }

    /**
     * Get the space to which the graphic belongs
     * return {Space} return the space to which the graphic belongs
     */
    getSpace() {
      return (this.parent.spaces.find( (element) => {
        // find in the spaces
        return element.id === this.spaceID;
      } )) 
      // if do not find the identifier, return the first space
      || this.parent.spaces[0];
    }

    /**
     * Get the family values of the graphic
     */
    getFamilyValues() {
      self = this;
      evaluator = self.evaluator;
      [self.fInf, self.fSup] = evaluator.eval(self.family_interval)[0];
      self.fSteps = Math.round(evaluator.eval(self.family_steps));
      self.fSep = (self.fSteps > 0) ? (self.fSup - self.fInf)/self.fSteps : 0;
    }

    /**
     *
     */
    buildFamilyPrimitives() {
      self = this;
      evaluator = self.evaluator;

      // update the family values
      self.getFamilyValues();

      // save the last value of the family parameter
      tempParam = evaluator.getVariable(self.family);

      if (self.fSteps >= 0) {
        // build the primitives of the family
        for (let i=0, l=self.fSteps; i<=l; i++) {
          // update the value of the family parameter
          self.fVal = self.fInf + (i*self.fSep);
          evaluator.setVariable(self.family, self.fVal);

          // if the condition to draw is true then update and draw the graphic
          if (evaluator.eval(self.drawif)) {
            self.buildPrimitives();
          }
        }
      }

      evaluator.setVariable(self.family, tempParam);
    }

    /**
     * Update the 3D graphic
     */
    update() {
      self = this;
      self.primitives = [];

      if (self.evaluator.eval(self.drawif)) {
        // build the primitives of a single object
        if (!self.family) {
          self.buildPrimitives();
        }
      }

      // build the primitives of the family
      if (self.family) {
        self.buildFamilyPrimitives();
      }
    }

    /**
     *
     */
    updateMVMatrix() {
      self = this;

      tmpExpr = self.evaluator.eval(self.inirot)[0];
      if (self.inirotEuler) {
        self.inirotM.setIdentity();
        self.inirotM = self.inirotM.rotateZ(degToRad(tmpExpr[0])); //Z
        self.inirotM = self.inirotM.rotateX(degToRad(tmpExpr[1])); //X
        self.inirotM = self.inirotM.rotateZ(degToRad(tmpExpr[2])); //Z
      }
      else {
        tmpMatrix.setIdentity();
        tmpMatrix.rotateX(degToRad(tmpExpr[0]), self.inirotM_X); //X
        tmpMatrix.rotateY(degToRad(tmpExpr[1]), self.inirotM_Y); //Y
        tmpMatrix.rotateZ(degToRad(tmpExpr[2]), self.inirotM_Z); //Z
      }

      tmpExpr = self.evaluator.eval(self.inipos)[0];
      self.iniposM = self.iniposM.setIdentity().translate({ x: tmpExpr[0], y: tmpExpr[1], z: tmpExpr[2] });

      tmpExpr = self.evaluator.eval(self.endrot)[0];
      if (self.endrotEuler) {
        self.endrotM.setIdentity();
        
        self.endrotM = self.endrotM.rotateZ(degToRad(tmpExpr[0])); //Z
        self.endrotM = self.endrotM.rotateX(degToRad(tmpExpr[1])); //X
        self.endrotM = self.endrotM.rotateZ(degToRad(tmpExpr[2])); //Z
      }
      else {
        tmpMatrix.setIdentity();
        tmpMatrix.rotateX(degToRad(tmpExpr[0]), self.endrotM_X); //X
        tmpMatrix.rotateY(degToRad(tmpExpr[1]), self.endrotM_Y); //Y
        tmpMatrix.rotateZ(degToRad(tmpExpr[2]), self.endrotM_Z); //Z
      }

      tmpExpr = self.evaluator.eval(self.endpos)[0];
      self.endposM = self.endposM.setIdentity().translate({ x: tmpExpr[0], y: tmpExpr[1], z: tmpExpr[2] });
    }

    /**
     *
     */
    transformVertex(v) {
      self = this;

      if (self.inirotEuler) {
        tmpVertex = self.inirotM.mulV4(v);
      }
      else {
        tmpVertex = self.inirotM_Z.mulV4(
          self.inirotM_Y.mulV4(
            self.inirotM_X.mulV4(v)
          )
        );
      }

      tmpVertex = self.iniposM.mulV4(tmpVertex);

      if (self.endrotEuler) {
        tmpVertex = self.endrotM.mulV4(tmpVertex);
      }
      else {
        tmpVertex = self.endrotM_Z.mulV4(
          self.endrotM_Y.mulV4(
            self.endrotM_X.mulV4(tmpVertex)
          )
        );
      }

      tmpVertex = self.endposM.mulV4(tmpVertex);

      // make the rotation of the macro
      if (self.macroChildren) {
        tmpVertex = self.applyMacroTransform(tmpVertex);
      }

      // tmpVertex.adjDec();

      return tmpVertex;
    }

    /**
     *
     */
    applyMacroTransform(v) {
      self = this;

      if (self.macro_inirotEuler) {
        tmpVertex = self.macro_inirotM.mulV4(v);
      }
      else {
        tmpVertex = self.macro_inirotM_Z.mulV4(
          self.macro_inirotM_Y.mulV4(
            self.macro_inirotM_X.mulV4(v)
          )
        );
      }

      tmpVertex = self.macro_iniposM.mulV4(tmpVertex);

      if (self.macro_endrotEuler) {
        tmpVertex = self.macro_endrotM.mulV4(tmpVertex);
      }
      else {
        tmpVertex = self.macro_endrotM_Z.mulV4(
          self.macro_endrotM_Y.mulV4(
            self.macro_endrotM_X.mulV4(tmpVertex)
          )
        );
      }

      tmpVertex = self.macro_endposM.mulV4(tmpVertex);

      return tmpVertex;
    }

    /**
     * Parse expression for curve graphic
     */
    parseExpression() {
      let newExpr = [];

      for (let expr_i of this.expresion.split(";")) {
        if (expr_i.trim() !== "") {
          newExpr.push(...splitExpr(expr_i));
        }
      }

      for (let i=0, l=newExpr.length; i<l; i++) {
        newExpr[i] = this.evaluator.parser.parse( newExpr[i], true );
      }

      return newExpr;
    }

    /**
     *
     */
    splitFace(g) {
      for (let primitives_i of this.primitives) {
        tmpPrimitives = [];

        // if the primitive is a face then try to cut the other primitives faces
        if (primitives_i.type === "face") {
          for (let primitives_j of g.primitives) {
            // the primitives of g are divided and added to an array
            if (primitives_j.type === "face") {
              tmpPrimitives.push(...primitives_i.splitFace(primitives_j));
            }
            // if the primitive is not a face, then do not split it
            else {
              tmpPrimitives.push( primitives_j );
            }
          }
          
          g.primitives = tmpPrimitives;
        }
      }
    }
  }

  /**
   * Split a line if has spaces
   */
  function splitExpr(expr) {
    let tmpExprArr = [];
    let statusIgnore = 0;
    let statusEqual = 1;
    let statusId = 2;
    let status = statusIgnore;
    let charAt;
    let lastIndex = expr.length;

    for (let i=expr.length-1; i>-1; i--) {
      charAt = expr.charAt(i)

      if (status == statusIgnore) {
        if (charAt != "=") {
          continue;
        }
        else {
          status = statusEqual;
          continue;
        }
      }

      if (status == statusEqual) {
        if (charAt == " ") {
          continue;
        }
        else if ( (charAt === "<") || (charAt === ">") ) {
          status = statusIgnore;
          continue;
        }
        else {
          status = statusId;
          continue;
        }
      }

      if (status == statusId) {
        if (charAt == " ") {
          tmpExprArr.unshift(expr.substring(i+1, lastIndex));
          lastIndex = i;
          status = statusIgnore;
          continue;
        }
      }
    }

    tmpExprArr.unshift(expr.substring(0, lastIndex));

    return tmpExprArr;
  }

  descartesJS.Graphic3D = Graphic3D;
  return descartesJS;
})(descartesJS || {});
