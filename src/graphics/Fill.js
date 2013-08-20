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

  /**
   * A Descartes fill
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the fill
   */
  descartesJS.Fill = function(parent, values) {
    // call the parent constructor
    descartesJS.Graphic.call(this, parent, values);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Fill, descartesJS.Graphic);

  /**
   * Update the fill
   */
  descartesJS.Fill.prototype.update = function() {
    expr = this.evaluator.evalExpression(this.expresion);

    this.exprX = expr[0][0]; // the first value of the first expression
    this.exprY = expr[0][1]; // the second value of the first expression
  }

  /**
   * Draw the fill
   */
  descartesJS.Fill.prototype.draw = function() {
    // call the draw function of the father (uber instead of super as it is reserved word)
    this.uber.draw.call(this, this.color, this.color);
  }

  /**
   * Draw the trace of the fill
   */
  descartesJS.Fill.prototype.drawTrace = function() {
    // call the drawTrace function of the father (uber instead of super as it is reserved word)
    // this.uber.drawTrace.call(this, this.trace, this.trace);
  }
  
  /**
   * Auxiliary function for draw a fill
   * @param {CanvasRenderingContext2D} ctx rendering context on which the fill is drawn
   * @param {String} fill the fill color of the fill
   */
  descartesJS.Fill.prototype.drawAux = function(ctx, fill) {
    // update the color components of the fill color
    fill.getColor();

    // this.imageData = this.ctx.getImageData(0, 0, this.space.w, this.space.h).data;
    imageData = this.ctx.getImageData(0, 0, this.space.w, this.space.h);

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

    pixelStack = [{x: x, y: y}];

    startColor = getPixel(imageData, x, y);

    while(pixelStack.length > 0) {
      currentPixel = pixelStack.pop();
      x = currentPixel.x;
      y = currentPixel.y;

      if (equalColor(startColor, getPixel(imageData, x, y))) {
        // asign the color
        setPixel(imageData, x, y, fill);

        // add the next pixel to the stack
        if (x > 0) {
          pixelStack.push({x: x-1, y: y});
        }
        if (x <imageData.width-1) {
          pixelStack.push({x: x+1, y: y});
        }
        pixelStack.push({x: x, y: y-1});
        pixelStack.push({x: x, y: y+1});
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  /**
   *
   */
  function getPixel(imageData, x, y) {
    index = (x + y*imageData.width) *4;

    return { r: imageData.data[index],
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
    imageData.data[index+3] = 255 - color.a;
  }

  /**
   *
   */
  function equalColor(c1, c2) {
    return (c1.r === c2.r) && (c1.g === c2.g) && (c1.b === c2.b) && (c1.a === c2.a);
  }

  return descartesJS;
})(descartesJS || {});