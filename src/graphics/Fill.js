/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var expr;
  var x;
  var y;
  var pixelStack;
  var currentPixel;
  var startColor;
  var index;
  var count;

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
      expr = this.evaluator.eval(this.expresion);

      this.exprX = expr[0][0]; // the first value of the first expression
      this.exprY = expr[0][1]; // the second value of the first expression
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
     * @param {String} fill the fill color of the fill
     */
    drawAux(ctx, fill) {
      // update the color components of the fill color
      fill.getColor();
      imageData = ctx.getImageData(0, 0, this.space.w, this.space.h);

      if (this.abs_coord) {
        x = parseInt(this.exprX);
        y = parseInt(this.exprY);
      }
      else {
        x = parseInt( this.space.getAbsoluteX(this.exprX) );
        y = parseInt( this.space.getAbsoluteY(this.exprY) );
      }

      if ((x < 0) || (y < 0) || (x >= this.space.w) || (y >= this.space.h)) {
        return;
      }

      pixelStack = [[x, y]];

      startColor = getPixel(imageData, x, y);
      count = 0;

      while(pixelStack.length > 0) {
        count++;
        currentPixel = pixelStack.pop();
        x = currentPixel[0];
        y = currentPixel[1];

        if (equalColor(startColor, getPixel(imageData, x, y))) {
          // assign the color
          setPixel(imageData, x, y, fill);

          // add the next pixel to the stack
          if (x > 0) {
            pixelStack.push([x-1, y]);
          }
          if (x < imageData.width-1) {
            pixelStack.push([x+1, y]);
          }
          pixelStack.push([x, y-1]);
          pixelStack.push([x, y+1]);
        }

        //exit safe
        if (count >= this.space.w*this.space.h*3) {
          break;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    }
  }

  /**
   *
   */
  function getPixel(imageData, x, y) {
    index = (x + y*imageData.width) *4;

    return { 
      r: imageData.data[index],
      g: imageData.data[index+1],
      b: imageData.data[index+2],
      a: imageData.data[index+3]
    }
  }

  /**
   *
   */
  function setPixel(imageData, x, y, color) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = color.r;
    imageData.data[index+1] = color.g;
    imageData.data[index+2] = color.b;
    imageData.data[index+3] = color.a*255;
  }

  /**
   *
   */
  function equalColor(c1, c2) {
    return (c1.r === c2.r) && (c1.g === c2.g) && (c1.b === c2.b) && (c1.a === c2.a);
  }

  descartesJS.Fill = Fill;
  return descartesJS;
})(descartesJS || {});
