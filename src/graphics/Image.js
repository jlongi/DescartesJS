/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var MathRound = Math.round;

  var evaluator;
  var expr;
  var tmpRot;
  var imgFile;
  var space;
  var despX;
  var despY;
  var coordX;
  var coordY;
  var rotation;

  var w;
  var h;

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

    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);

    this.img = new Image();

    this.scaleX = this.scaleY = 1;

    this.ratio = parent.ratio;

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

    expr = evaluator.eval(this.expresion);
    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression

    // rotate the elements in case the graphic is part of a macro
    if (this.rotateExp) {
      tmpRot = this.rotate(expr[0][0], expr[0][1], descartesJS.degToRad(evaluator.eval(this.rotateExp)));

      this.exprX = tmpRot.x;
      this.exprY = tmpRot.y;
    }

    // configuration of the form (x,y,ew,eh)
    if (expr[0].length >= 4) {
      this.centered = true;
      this.scaleX = expr[0][2];
      this.scaleY = expr[0][3];
    }

    // configuration of the form (x,y)(ew,eh)
    if ((expr[1]) && (expr[1].length == 2)) {
      this.centered = true;
      this.scaleX = expr[1][0];
      this.scaleY = expr[1][1];
    }

    if (this.scaleX == 0) {
      this.scaleX = 0.00001;
    }
    if (this.scaleY == 0) {
      this.scaleY = 0.00001;
    }

    var self = this;
    imgFile = evaluator.eval(this.file);
    if ((imgFile) || (imgFile == "")) {
      this.img = this.parent.getImage(imgFile);
      this.img.addEventListener("load", function(evt) {
        self.space.update(true);
      });
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
      w = this.img.width;
      h = this.img.height;

      // if the images is a space image
      if (this.img.canvas) {
        w = MathRound( w/this.ratio );
        h = MathRound( h/this.ratio );
      }

      despX = (this.centered) ? 0 : MathRound(w/2);
      despY = (this.centered) ? 0 : MathRound(h/2);

      coordX = MathRound( (this.abs_coord) ? this.exprX : space.getAbsoluteX(this.exprX) );
      coordY = MathRound( (this.abs_coord) ? this.exprY : space.getAbsoluteY(this.exprY) );
      rotation = descartesJS.degToRad(-evaluator.eval(this.inirot));

      ctx.save();
      ctx.translate(coordX+despX, coordY+despY);
      ctx.rotate(rotation);

      if (this.opacity) {
        ctx.globalAlpha = evaluator.eval(this.opacity);
      }

      // draw image
      ctx.scale(this.scaleX, this.scaleY);
      ctx.drawImage(this.img, -w/2, -h/2, w, h);

      // reset the transformations
      ctx.restore();
    }
  }

  return descartesJS;
})(descartesJS || {});
