/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let x;
  let y;
  let pixelStack;
  let startColor;
  let count;
  let imageData;
  let pixelData;
  let colorCtx = document.createElement('canvas').getContext('2d');
  colorCtx.canvas.width = 1;
  colorCtx.canvas.height = 1;

  class Fill extends descartesJS.Graphic {
    /**
     * A Descartes fill
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the fill
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);
    }

    /**
     * Update the fill
     */
    update() {
      [this.X, this.Y] = this.evaluator.eval(this.expresion)[0];
    }

    /**
     * Draw the fill
     */
    draw() {
      super.draw(this.color, this.color);
    }

    /**
     * Draw the trace of the fill
     */
    drawTrace() {
      super.drawTrace(this.trace, this.trace);
    }

    /**
     * Auxiliary function for draw a fill
     * @param {CanvasRenderingContext2D} ctx rendering context on which the fill is drawn
     * @param {String} fill the fill color of the graphics
     */
    drawAux(ctx, fill) {
      // get the color in a 32bits representation
      fill = colorTo32Bits(fill.getColor());

      imageData = ctx.getImageData(0, 0, this.space.w, this.space.h);

      pixelData = new Uint32Array(imageData.data.buffer);

      x = parseInt((this.abs_coord) ? this.X : this.space.getAbsoluteX(this.X));
      y = parseInt((this.abs_coord) ? this.Y : this.space.getAbsoluteY(this.Y));

      // initial color of the pixel in the position x, y
      startColor = getPixel(pixelData, imageData.width, imageData.height, x, y);
      // if the pixel is outside of the canvas getPixel returns -1
      if ((startColor == -1) || (fill == startColor)) {
        return;
      }

      pixelStack = [x, y];
      count = 0;

      while (pixelStack.length > 0) {
        count++;

        y = pixelStack.pop();
        x = pixelStack.pop();

        if (startColor == getPixel(pixelData, imageData.width, imageData.height, x, y)) {
          // assign the color
          pixelData[x + y*imageData.width] = fill;

          // add the next pixel to the stack
          pixelStack.push(x-1, y);
          pixelStack.push(x+1, y);
          pixelStack.push(x, y-1);
          pixelStack.push(x, y+1);
        }

        //exit safe
        if (count >= this.space.w*this.space.h) {
          break;
        }
      }

      // write the pixels in the canvas
      ctx.putImageData(imageData, 0, 0);
    }
  }

  /**
   *
   */
  function getPixel(pixelData, w, h, x, y) {
    return (x < 0 || y < 0 || x >= w || y >= h) ? -1 : pixelData[x + y*w];
  }

  /**
   *
   */
  function colorTo32Bits(color) {
    colorCtx.clearRect(0, 0, 1, 1);
    colorCtx.fillStyle = color;
    colorCtx.fillRect(0, 0, 1, 1);
    return new Uint32Array(colorCtx.getImageData(0, 0, 1, 1).data.buffer)[0];    
  }

  descartesJS.Fill = Fill;
  return descartesJS;
})(descartesJS || {});
