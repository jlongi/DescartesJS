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

  class DescartesImage extends descartesJS.Graphic {
    /**
     * A Descartes image
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the image
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      this.file = this.file || "";
      this.inirot = this.inirot || parent.evaluator.parser.parse("0");

      this.img = new Image();
      this.scaleX = this.scaleY = 1;
      this.ratio = parent.ratio;

      let ch = this.expresion.getChildren();

      this.x_e = ch[0];
      this.y_e = ch[1];
      
      if (ch.length > 2) {
        this.centered = true;

        this.s_x_e = ch[2];

        if (ch.length > 3) {
          this.s_y_e = ch[3];
        }
        else {
          this.s_y_e = ch[2];
        }
      }

      // if has a clipping region
      let clip = this.evaluator.eval(this.clip);
      if (clip) {
        this.clip = this.clip.getChildren();
      }

      this.update();
    }

    /**
     * Update the image
     */
    update() {
      evaluator = this.evaluator;

      let x = evaluator.eval(this.x_e);
      let y = evaluator.eval(this.y_e);
      this.exprX = x;
      this.exprY = y;

      // rotate the elements in case the graphic is part of a macro
      if (this.rotateExp) {
        tmpRot = this.rotate(x, y, descartesJS.degToRad(evaluator.eval(this.rotateExp)));

        this.exprX = tmpRot.x;
        this.exprY = tmpRot.y;
      }

      if (this.centered) {
        this.scaleX = evaluator.eval(this.s_x_e);
        this.scaleY = evaluator.eval(this.s_y_e);

        if (this.scaleX == 0) {
          this.scaleX = 0.00001;
        }
        if (this.scaleY == 0) {
          this.scaleY = 0.00001;
        }
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
    draw() {
      super.draw();
    }

    /**
     * Draw the trace of the image
     */
    drawTrace() {
      super.drawTrace();
    }

    /**
     * Auxiliary function for draw an image
     * @param {CanvasRenderingContext2D} ctx rendering context on which the image is drawn
     */
    drawAux(ctx) {
      evaluator = this.evaluator;
      space = this.space;

      if ( (this.img) && (this.img.ready) && (this.img.complete) ) {
        if (!this.clip) {
          w = this.img.width;
          h = this.img.height;
        }
        else {
          w = evaluator.eval(this.clip[2]);
          h = evaluator.eval(this.clip[3]);
        }

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
        if (!this.clip) {
          ctx.drawImage(this.img, -w/2, -h/2, w, h);
        }
        else {
          ctx.drawImage(this.img, evaluator.eval(this.clip[0]), evaluator.eval(this.clip[1]), w, h, -w/2, -h/2, w, h);
        }

        // reset the transformations
        ctx.restore();
      }
    }
  }
  
  descartesJS.Image = DescartesImage;
  return descartesJS;
})(descartesJS || {});
