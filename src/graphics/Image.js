/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let MathRound = Math.round;

  let evaluator;
  let tmpRot;
  let imgFile;
  let despX;
  let despY;
  let coordX;
  let coordY;
  let rotation;

  let w;
  let h;
  let self;
  
  class DescartesImage extends descartesJS.Graphic {
    /**
     * A Descartes image
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the image
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      self = this;

      self.file = self.file || "";
      self.inirot = self.inirot || parent.evaluator.parser.parse("0");

      self.img = new Image();
      self.scaleX = self.scaleY = 1;
      self.ratio = parent.ratio;

      let ch = self.expresion.getChildren();

      self.x_e = ch[0];
      self.y_e = ch[1];
      
      if (ch.length > 2) {
        self.centered = true;

        self.s_x_e = ch[2];

        if (ch.length > 3) {
          self.s_y_e = ch[3];
        }
        else {
          self.s_y_e = ch[2];
        }
      }

      // if has a clipping region
      let clip = self.evaluator.eval(self.clip);
      if (clip) {
        self.clip = self.clip.getChildren();
      }

      self.update();
    }

    /**
     * Update the image
     */
    update() {
      let self = this;

      evaluator = self.evaluator;

      self.X = evaluator.eval(self.x_e);
      self.Y = evaluator.eval(self.y_e);

      // rotate the elements in case the graphic is part of a macro
      if (self.rotateExp) {
        tmpRot = self.rotate(self.X, self.Y, descartesJS.degToRad(evaluator.eval(self.rotateExp)));
        self.X = tmpRot.x;
        self.Y = tmpRot.y;
      }

      if (self.centered) {
        self.scaleX = evaluator.eval(self.s_x_e);
        self.scaleY = evaluator.eval(self.s_y_e);

        if (self.scaleX == 0) {
          self.scaleX = 0.00001;
        }
        if (self.scaleY == 0) {
          self.scaleY = 0.00001;
        }
      }

      imgFile = evaluator.eval(self.file);

      if ((imgFile) || (imgFile == "")) {
        self.img = self.parent.getImage(imgFile);
        
        if (!self.img.hasUpdate) {
          self.img.hasUpdate = true;
          self.img.addEventListener("load", ()=>{
            self.space.update(true);
          });
        }
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
      self = this;
      evaluator = self.evaluator;

      if ( (self.img) && (self.img.ready) && (self.img.complete) ) {
        if (!self.clip) {
          w = self.img.width;
          h = self.img.height;

          // if the images is a space image
          if (self.img.canvas) {
            w = MathRound( w/self.img.ratio );
            h = MathRound( h/self.img.ratio );
          }
        }
        else {
          w = evaluator.eval(self.clip[2]);
          h = evaluator.eval(self.clip[3]);
        }

        despX = (self.centered) ? 0 : MathRound(w/2);
        despY = (self.centered) ? 0 : MathRound(h/2);

        coordX = MathRound( (self.abs_coord) ? self.X : self.space.getAbsoluteX(self.X) );
        coordY = MathRound( (self.abs_coord) ? self.Y : self.space.getAbsoluteY(self.Y) );
        rotation = descartesJS.degToRad(-evaluator.eval(self.inirot));

        ctx.save();
        ctx.translate(coordX+despX, coordY+despY);
        ctx.rotate(rotation);

        if (self.opacity) {
          ctx.globalAlpha = evaluator.eval(self.opacity);
        }

        // draw image
        ctx.scale(self.scaleX, self.scaleY);

        if (!self.clip) {
          ctx.drawImage(self.img, -w/2, -h/2, w, h);
        }
        else {
          if (self.img.canvas) {
            ctx.drawImage(self.img, evaluator.eval(self.clip[0])*self.img.ratio, evaluator.eval(self.clip[1])*self.img.ratio, w*self.img.ratio, h*self.img.ratio, -w/2, -h/2, w, h);
          }
          else {
            ctx.drawImage(self.img, evaluator.eval(self.clip[0]), evaluator.eval(self.clip[1]), w, h, -w/2, -h/2, w, h);
          }
        }

        // reset the transformations
        ctx.restore();
      }
    }
  }
  
  descartesJS.Image = DescartesImage;
  return descartesJS;
})(descartesJS || {});
