/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var translate = {x:0, y:0, z:0};

  var evaluator;
  var expr;
  var tempParam;
  var theText;
  var verticalDisplace;

  var tmpVertex;
  var tmpExpr;
  var tmpExpr2;
  var tmpExpr3;
  var lastIndexOfSpace;

  /**
   * Descartes 3D graphics
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the graphic
   */
  descartesJS.Graphic3D = function(parent, values) {
    /**
     * Descartes application
     * type {DescartesApp}
     * @private
     */
    this.parent = parent;
    
    /**
     * object for parse and evaluate expressions
     * type {Evaluator}
     * @private
     */
    this.evaluator = parent.evaluator;

    var parser = parent.evaluator.parser;

    /**
     * identifier of the space that belongs to the graphic
     * type {String}
     * @private
     */
    this.spaceID = "E0";

    /**
     * the condition for determining whether the graph is drawn in the background
     * type {Boolean}
     * @private
     */
    this.background = false;

    /**
     * type of the graphic
     * type {String}
     * @private
     */
    this.type = "";

    /**
     * the primary color of the graphic
     * type {String}
     * @private
     */
    this.color = new descartesJS.Color("eeffaa");

    /**
     * the back face color of the graphic
     * type {Node}
     * @private
     */
    this.backcolor = new descartesJS.Color("6090a0");

    this.Nu = this.evaluator.parser.parse("7");
    this.Nv = this.evaluator.parser.parse("7");
    
    /**
     * the condition to draw the graphic
     * type {Node}
     * @private
     */
    this.drawif = parser.parse("1");
    
    /**
     * the condition for determine whether the graphic is in absolute coordinates
     * type {Boolean}
     * @private
     */
    this.abs_coord = false;
    
    /**
     * the condition and parameter name for family of the graphic
     * type {String}
     * @private
     */
    this.family = "";

    /**
     * the interval of the family
     * type {Node}
     * @private
     */
    this.family_interval = parser.parse("[0,1]");

    /**
     * the number of steps of the family
     * type {Node}
     * @private
     */
    this.family_steps = parser.parse("8");
    
    /**
     * info font
     * type {String}
     * @private
     */
    this.font = "Monospaced,PLAIN,12";
    
    /**
     * the condition for determining whether the text of the graph is fixed or not
     * type {Boolean}
     * @private
     */
    this.fixed = true;

    /**
     * text of the graphic
     * type {String}
     * @private
     */
    this.text = "";

    /**
     * the number of decimal of the text
     * type {Node}
     * @private
     */
    this.decimals = parser.parse("2");

    /**
     * the init rotation of the graphic
     * type {Node}
     * @private
     */
    this.inirot = "(0,0,0)";
    this.inirotEuler = false;
    
    /**
     * the init position of a graphic
     * type {Node}
     * @private
     */
    this.inipos = parser.parse("(0,0,0)");

    /**
     * the init rotation of the graphic
     * type {Node}
     * @private
     */
    this.endrot = "(0,0,0)";
    this.endrotEuler = false;
    
    /**
     * the init position of a graphic
     * type {Node}
     * @private
     */
    this.endpos = parser.parse("(0,0,0)");

    /**
     * the ilumination model
     * type {String}
     * @private
     */
    this.model = "color";
    
    // traverse the values to replace the defaults values of the object
    for (var propName in values) {
      // verify the own properties of the object
      if (values.hasOwnProperty(propName)) {
        this[propName] = values[propName];
      }
    }

    if ((this.expresion == undefined) && (this.type != "macro")) {
      this.expresion = parser.parse("(0,0)");
    }

    // get the space of the graphic
    this.space = this.getSpace();

    if (this.background) {
      this.canvas = this.space.backgroundCanvas;
    } else {
      this.canvas = this.space.canvas;
    }
    this.ctx = this.canvas.getContext("2d");
        
    this.font = descartesJS.convertFont(this.font)

    // get the font size
    this.fontSize = this.font.match(/(\d+)px/);
    if (this.fontSize) {
      this.fontSize = parseInt(this.fontSize[1]);
    } else {
      this.fontSize = 10;
    }

    // euler rotations
    if (this.inirot.match("Euler")) {
      this.inirot = this.inirot.replace("Euler", "");
      this.inirotEuler = true;
    }
    if (this.endrot.match("Euler")) {
      this.endrot = this.endrot.replace("Euler", "");
      this.endrotEuler = true;
    }

    this.inirot = parser.parse(this.inirot);
    this.endrot = parser.parse(this.endrot);

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
  }
  
  /**
   * Get the space to which the graphic belongs
   * return {Space} return the space to which the graphic belongs
   */
  descartesJS.Graphic3D.prototype.getSpace = function() {
    var spaces = this.parent.spaces;
    var space_i;

    // find in the spaces
    for (var i=0, l=spaces.length; i<l; i++) {
      space_i = spaces[i];
      if (space_i.id == this.spaceID) {
        return space_i;
      }
    }
    
    // if do not find the identifier, return the first space
    return spaces[0];
  }
  
  /**
   * Get the family values of the graphic
   */
  descartesJS.Graphic3D.prototype.getFamilyValues = function() {
    evaluator = this.evaluator;
    expr = evaluator.evalExpression(this.family_interval);
    this.familyInf = expr[0][0];
    this.familySup = expr[0][1];
    this.fSteps = Math.round(evaluator.evalExpression(this.family_steps));
    this.family_sep = (this.fSteps > 0) ? (this.familySup - this.familyInf)/this.fSteps : 0;
  }
  
  /**
   *
   */
  descartesJS.Graphic3D.prototype.buildFamilyPrimitives = function() {
    evaluator = this.evaluator;

    // update the family values
    this.getFamilyValues();

    // save the last value of the family parameter
    tempParam = evaluator.getVariable(this.family);

    if (this.fSteps >= 0) {
      // build the primitives of the family
      for(var i=0, l=this.fSteps; i<=l; i++) {
        // update the value of the family parameter
        evaluator.setVariable(this.family, this.familyInf+(i*this.family_sep));

        // if the condition to draw is true then update and draw the graphic
        if ( evaluator.evalExpression(this.drawif) ) {
          this.buildPrimitives();
        }
      }
    }

    evaluator.setVariable(this.family, tempParam);
  }

  /**
   * Update the 3D graphic
   */
  descartesJS.Graphic3D.prototype.update = function() {
    this.primitives = [];

    if (this.evaluator.evalExpression(this.drawif)) {
      // build the primitives of the family
      if (this.family) {
        this.buildFamilyPrimitives();
      }
      // build the primitives of a single object
      else {
        this.buildPrimitives();
      }
    }
  }  

  /**
   *
   */
  descartesJS.Graphic3D.prototype.updateMVMatrix = function(ignoreRotation) {
    tmpExpr = this.evaluator.evalExpression(this.inirot);
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

    tmpExpr = this.evaluator.evalExpression(this.inipos);
    translate = { x: tmpExpr[0][0], y: tmpExpr[0][1], z: tmpExpr[0][2] };
    this.iniposM = this.iniposM.setIdentity().translate(translate);

    tmpExpr = this.evaluator.evalExpression(this.endrot);
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

    tmpExpr = this.evaluator.evalExpression(this.endpos);
    translate = { x: tmpExpr[0][0], y: tmpExpr[0][1], z: tmpExpr[0][2] };
    this.endposM = this.endposM.setIdentity().translate(translate);
  }

  /** 
   *
   */
   descartesJS.Graphic3D.prototype.transformVertex = function(v) {
    if (this.inirotEuler) {
      tmpVertex = this.inirotM.multiplyVector4(v);
    }
    else {
      tmpVertex = this.inirotM_X.multiplyVector4(v);
      tmpVertex = this.inirotM_Y.multiplyVector4(tmpVertex);
      tmpVertex = this.inirotM_Z.multiplyVector4(tmpVertex);      
    }

    tmpVertex = this.iniposM.multiplyVector4(tmpVertex);

    if (this.endrotEuler) {
      tmpVertex = this.endrotM.multiplyVector4(tmpVertex);
    }
    else {
      tmpVertex = this.endrotM_X.multiplyVector4(tmpVertex);
      tmpVertex = this.endrotM_Y.multiplyVector4(tmpVertex);
      tmpVertex = this.endrotM_Z.multiplyVector4(tmpVertex);
    }

    tmpVertex = this.endposM.multiplyVector4(tmpVertex);

    return tmpVertex;
   }

  /**
   *
   */
  descartesJS.Graphic3D.prototype.parseExpression = function() {
    tmpExpr = this.expresion.split("=");
    tmpExpr2 = tmpExpr[0];
    tmpExpr3 = [];

    for (var i=1; i<tmpExpr.length; i++) {
      tmpExpr2 += "=";

      lastIndexOfSpace = tmpExpr[i].lastIndexOf(" ");

      tmpExpr2 += (lastIndexOfSpace !== -1) ? tmpExpr[i].substring(0, lastIndexOfSpace) : tmpExpr[i];
     
      tmpExpr3.push( this.evaluator.parser.parse(tmpExpr2, true) );

      tmpExpr2 = tmpExpr[i].substring(lastIndexOfSpace+1);
    }

    return tmpExpr3;
  }

  var tmpPrimitives;

  /**
   *
   */
  descartesJS.Graphic3D.prototype.splitFace = function(g) {
    for (var i=0, l=this.primitives.length; i<l; i++) {
      tmpPrimitives = [];

      // if the primitive is a face then try to cut the other primitives faces
      if (this.primitives[i].type === "face") {

        for (var j=0, k=g.primitives.length; j<k; j++) {
          // the primitives of g are splited and added to an array
          if (g.primitives[j].type === "face") {
            tmpPrimitives = tmpPrimitives.concat( this.primitives[i].splitFace(g.primitives[j]) );
          }
          // if the primitive is not a face, then do not split it
          else {
            tmpPrimitives.push( g.primitives[j] );
          }
        }

        g.primitives = tmpPrimitives;
      }
    }
  }
  
  return descartesJS;
})(descartesJS || {});