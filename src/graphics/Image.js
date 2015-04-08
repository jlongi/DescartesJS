/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var mathRound = Math.round;

  var evaluator;
  var expr;
  var radianAngle;
  var cosTheta;
  var senTheta;
  var tmpRotX;
  var tmpRotY;
  var imgFile;
  var space;
  var despX;
  var despY;
  var coordX;
  var coordY;
  var rotation;

  /**
   * A Descartes image
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the image
   */
  descartesJS.Image = function(parent, values) {
    /**
     * the file name of the graphic
     * type {String}
     * @private
     */
    this.file = "";

    /**
     * the rotation of an image
     * type {Node}
     * @private
     */
    this.inirot = parent.evaluator.parser.parse("0");    

    this.pattern = false;

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);
    
    this.img = new Image();

    this.scaleX = 1;
    this.scaleY = 1;

    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Image, descartesJS.Graphic);

  /**
   * Update the image
   */
  descartesJS.Image.prototype.update = function() {
    evaluator = this.evaluator;

    expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression

    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }
    
    // configuration of the form (x,y,ew,eh)
    if (expr[0].length >= 4) {
      this.centered = true;
      this.scaleX = expr[0][2];
      if (this.scaleX == 0) {
        this.scaleX = 0.00001;
      }
      this.scaleY = expr[0][3];
      if (this.scaleY == 0) {
        this.scaleY = 0.00001;
      }

      if (expr[0][4]) {
        this.pattern = (expr[0][4] == 1) ? true : false;
      }
    }      
      
    // configuration of the form (x,y)(ew,eh)
    if ((expr[1]) && (expr[1].length == 2)) {
      this.centered = true;
      this.scaleX = expr[1][0];
      if (this.scaleX == 0) {
        this.scaleX = 0.00001;
      }
      this.scaleY = expr[1][1];      
      if (this.scaleY == 0) {
        this.scaleY = 0.00001;
      }
    }
    
    imgFile = evaluator.evalExpression(this.file);
    if ((imgFile) || (imgFile == "")) {
      this.img = this.parent.getImage(imgFile);
    }
  }
  
  /**
   * Draw the image
   */
  descartesJS.Image.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this);
  }

  /**
   * Draw the trace of the image
   */
  descartesJS.Image.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    this.uber.drawTrace.call(this);
  }
  
  /**
   * Auxiliary function for draw an image
   * @param {CanvasRenderingContext2D} ctx rendering context on which the image is drawn
   */
  descartesJS.Image.prototype.drawAux = function(ctx) {
    evaluator = this.evaluator;
    space = this.space;

    if ( (this.img) && (this.img.ready) && (this.img.complete) ) {
      despX = (this.centered) ? 0 : mathRound(this.img.width/2);
      despY = (this.centered) ? 0 : mathRound(this.img.height/2);
      coordX = (this.abs_coord) ? mathRound(this.exprX) : mathRound(space.getAbsoluteX(this.exprX));
      coordY = (this.abs_coord) ? mathRound(this.exprY) : mathRound(space.getAbsoluteY(this.exprY));
      rotation = descartesJS.degToRad(-evaluator.evalExpression(this.inirot));

      ctx.save();
      ctx.translate(coordX+despX, coordY+despY);
      ctx.rotate(rotation);

      if (this.opacity) {
        ctx.globalAlpha = evaluator.evalExpression(this.opacity);
      }

      // stretch image
      if (!this.pattern) {
        ctx.scale(this.scaleX, this.scaleY);
        // ctx.drawImage(this.img, -mathRound(this.img.width/2), -mathRound(this.img.height/2));
        ctx.drawImage(this.img, -this.img.width/2, -this.img.height/2);
      }
      // repeat image
      else {
        ctx.fillStyle = ctx.createPattern(this.img, "repeat");
        // ctx.translate(-mathRound(this.img.width/2)*this.scaleX, -mathRound(this.img.height/2)*this.scaleY);
        ctx.drawImage(this.img, (-this.img.width/2)*this.scaleX, (-this.img.height/2)*this.scaleY);
        ctx.fillRect(0, 0, this.img.width*this.scaleX, this.img.height*this.scaleY);
      }

      // reset the transformations
      ctx.restore();
      // ctx.setTransform(1, 0, 0, 1, 0, 0)
      // ctx.globalAlpha = 1;
    }
  }
  
  return descartesJS;
})(descartesJS || {});