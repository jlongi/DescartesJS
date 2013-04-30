/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var evaluator;
  var expr;
  var tempParam;
  var theText;
  var verticalDisplace;

  var tmpExpr;
  var vectorX;
  var vectorY;
  var vectorZ;
  var translate;

  var indexOfVar;
  var arrayVars = ["x", "y", "z"];

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

    var parser = this.parent.evaluator.parser;

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
     * the expression for determine the position of the graphic
     * type {Node}
     * @private
     */
//     this.expresion = parser.parse("(0,0)");

    /**
     * the color for the trace of the graphic
     * type {String}
     * @private
     */
    // this.trace = "";

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
     * the condition for determining whether the graph is editable
     * type {Boolean}
     * @private
     */
    // this.editable = false;

    /**
     * info
     * type {String}
     * @private
     */
    // this.info = "";

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
     * point widht
     * type {Node}
     * @private
     */
    // this.size = parser.parse("2");

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
    this.inirot = parser.parse("(0,0,0)");
    
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
    this.endrot = parser.parse("(0,0,0)");
    
    /**
     * the init position of a graphic
     * type {Node}
     * @private
     */
    this.endpos = parser.parse("(0,0,0)");

    /**
     * 
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
    
    // // if the object has trace, then get the background canvas render context
    // if (this.trace) {
    //   this.traceCtx = this.space.backgroundCanvas.getContext("2d");
    // }
    
    this.font = descartesJS.convertFont(this.font)

    // get the font size
    this.fontSize = this.font.match(/(\d+)px/);
    if (this.fontSize) {
      this.fontSize = parseInt(this.fontSize[1]);
    } else {
      this.fontSize = 10;
    }

    // auxiliary vectors
    vectorX = new descartesJS.Vector3D(1, 0, 0); 
    vectorY = new descartesJS.Vector3D(0, 1, 0); 
    vectorZ = new descartesJS.Vector3D(0, 0, 1);
    translate = new descartesJS.Vector3D(0, 0, 0);
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
                
        // if the condition to draw if true then update and draw the graphic
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
    // take a look because a differente behavior
    this.mvMatrix = this.mvMatrix.setIdentity();

    if (!ignoreRotation) {
      tmpExpr = this.evaluator.evalExpression(this.inirot);    
      this.mvMatrix = this.mvMatrix.rotate(descartesJS.degToRad(tmpExpr[0][0]), vectorX); //X
      this.mvMatrix = this.mvMatrix.rotate(descartesJS.degToRad(tmpExpr[0][1]), vectorY); //Y
      this.mvMatrix = this.mvMatrix.rotate(descartesJS.degToRad(tmpExpr[0][2]), vectorZ); //Z
    }

    tmpExpr = this.evaluator.evalExpression(this.inipos);
    translate.set(tmpExpr[0][0], tmpExpr[0][1], tmpExpr[0][2]);
    this.mvMatrix = this.mvMatrix.translate(translate);

    if (!ignoreRotation) {
      tmpExpr = this.evaluator.evalExpression(this.endrot);    
      this.mvMatrix = this.mvMatrix.rotate(descartesJS.degToRad(tmpExpr[0][0]), vectorX); //X
      this.mvMatrix = this.mvMatrix.rotate(descartesJS.degToRad(tmpExpr[0][1]), vectorY); //Y
      this.mvMatrix = this.mvMatrix.rotate(descartesJS.degToRad(tmpExpr[0][2]), vectorZ); //Z
    }

    tmpExpr = this.evaluator.evalExpression(this.endpos);
    translate.set(tmpExpr[0][0], tmpExpr[0][1], tmpExpr[0][2]);
    this.mvMatrix = this.mvMatrix.translate(translate);
  }

  /**
   *
   */
  descartesJS.Graphic3D.prototype.findExpresion = function(expresion, variable) {
    indexOfVar = arrayVars.indexOf(variable);

    subexpresion = expresion.split( arrayVars[indexOfVar] + "=" )[1];

    if (subexpresion) {
      subexpresion = subexpresion.split( arrayVars[(indexOfVar+1)%3] + "=" )[0];
      subexpresion = subexpresion.split( arrayVars[(indexOfVar+2)%3] + "=" )[0];
      return subexpresion;
    }
    else {
      return "";
    }
  }  
  
  return descartesJS;
})(descartesJS || {});