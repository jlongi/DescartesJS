/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let evaluator;
  let tmpMatrix;
  let tmpExpr;

  const regExpType3D = "-point-segment-polygon-curve-triangle-face-polireg-surface-text-cube-box-tetrahedron-octahedron-sphere-dodecahedron-icosahedron-ellipsoid-cone-cylinder-torus-mesh-macro-";

  const degToRad = descartesJS.degToRad;

  let macros_count = 0;

  class Macro3D extends descartesJS.BaseMacro {
    /**
     * A Descartes macro
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the macro
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values, "parse3DGraphic", regExpType3D);

      self = this;

      self.inirot      = self.inirot      || "(0,0,0)";
      self.inirotEuler = self.inirotEuler || false;
      self.inipos      = self.inipos      || parent.evaluator.parser.parse("(0,0,0)");
      self.endrot      = self.endrot      || "(0,0,0)";
      self.endrotEuler = self.endrotEuler || false;
      self.endpos      = self.endpos      || parent.evaluator.parser.parse("(0,0,0)");
      self.name        = self.name        || `_M_${macros_count++}`;

      // assign the values to replace the defaults values of the object
      Object.assign(self, values);

      // euler rotations
      if (typeof self.inirot === "string" && self.inirot.includes("Euler")) {
        self.inirot = self.inirot.replace("Euler", "");
        self.inirotEuler = true;
      }
      if (typeof self.endrot === "string" && self.endrot.includes("Euler")) {
        self.endrot = self.endrot.replace("Euler", "");
        self.endrotEuler = true;
      }

      self.inirot = self.evaluator.parser.parse(self.inirot);
      self.endrot = self.evaluator.parser.parse(self.endrot);

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

      for (let graphics_i of self.graphics) {
        graphics_i.macroChildren = true;
      }
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
      let tempParam = evaluator.getVariable(self.family);

      if (self.fSteps >= 0) {
        // build the primitives of the family
        for (let i = 0, l = self.fSteps; i <= l; i++) {
          // update the value of the family parameter
          self.fVal = self.fInf + (i * self.fSep);
          evaluator.setVariable(self.family, self.fVal);

          // if the condition to draw is true then update and draw the graphic
          if (evaluator.eval(self.drawif)) {
            self.updateMacro();
          }
        }
      }

      evaluator.setVariable(self.family, tempParam);
    }

    /**
     * Update the macro
     */
    update() {
      self = this;
      self.primitives = [];

      if (self.evaluator.eval(self.drawif)) {
        // build the primitives of a single object
        if (!self.family) {
          self.updateMacro();
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
    updateMacro() {
      self = this;
      self.updateTransformation();

      if (self.inipos) {
        let expr = self.evaluator.eval(self.inipos)[0];
        self.iniPosX = expr[0];
        self.iniPosY = expr[1];
      }

      for (let thisGraphics_i of self.graphics) {
        thisGraphics_i.macro_inirotEuler = self.inirotEuler;
        thisGraphics_i.macro_inirotM     = self.inirotM;
        thisGraphics_i.macro_inirotM_X   = self.inirotM_X;
        thisGraphics_i.macro_inirotM_Y   = self.inirotM_Y;
        thisGraphics_i.macro_inirotM_Z   = self.inirotM_Z;
        thisGraphics_i.macro_iniposM     = self.iniposM;

        thisGraphics_i.macro_endrotEuler = self.endrotEuler;
        thisGraphics_i.macro_endrotM     = self.endrotM;
        thisGraphics_i.macro_endrotM_X   = self.endrotM_X;
        thisGraphics_i.macro_endrotM_Y   = self.endrotM_Y;
        thisGraphics_i.macro_endrotM_Z   = self.endrotM_Z;
        thisGraphics_i.macro_endposM     = self.endposM;

        thisGraphics_i.update();
      }

      // split the primitives if needed
      for (let i=0, l=self.graphics.length; i<l; i++) {
        let currentGraphic = self.graphics[i];

        if ((currentGraphic.split) || (self.split)) {
          for (let j=i+1; j<l; j++) {
            let nextGraphic = self.graphics[j];

            if ((nextGraphic.split) || (self.split)) {
              currentGraphic.splitFace(nextGraphic);
            }
          }
        }

        self.primitives = self.primitives.concat(currentGraphic.primitives || []);
      }
    }

    /**
     *
     */
    updateTransformation() {
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
      self.iniposM = self.iniposM.setIdentity().translate({
        x: tmpExpr[0],
        y: tmpExpr[1],
        z: tmpExpr[2]
      });

      tmpExpr = self.evaluator.eval(self.endrot)[0];
      if (self.endrotEuler) {
        self.endrotM.setIdentity();
        self.endrotM = self.endrotM.rotateZ(degToRad(tmpExpr[0])); //Z
        self.endrotM = self.endrotM.rotateX(degToRad(tmpExpr[1])); //X
        self.endrotM = self.endrotM.rotateZ(degToRad(tmpExpr[2])); //Z
      } else {
        tmpMatrix.setIdentity();
        tmpMatrix.rotateX(degToRad(tmpExpr[0]), self.endrotM_X); //X
        tmpMatrix.rotateY(degToRad(tmpExpr[1]), self.endrotM_Y); //Y
        tmpMatrix.rotateZ(degToRad(tmpExpr[2]), self.endrotM_Z); //Z
      }

      tmpExpr = self.evaluator.eval(self.endpos)[0];
      self.endposM = self.endposM.setIdentity().translate({
        x: tmpExpr[0],
        y: tmpExpr[1],
        z: tmpExpr[2]
      });
    }

    /**
     * Auxiliary function for draw a macro
     * @param {CanvasRenderingContext2D} ctx rendering context on which the macro is drawn
     */
    drawAux(ctx) { }
  }

  descartesJS.Macro3D = Macro3D;
  return descartesJS;
})(descartesJS || {});
