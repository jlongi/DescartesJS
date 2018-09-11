/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var family;
  var familyArray = [descartesJS.sansserif_font, descartesJS.serif_font, descartesJS.monospace_font];

  /**
   * Font style for rtf text
   * @param {Number} size the size of the font
   * @param {String} family the font family name
   * @param {String} italic the flag if the text is italic
   * @param {String} bold the flag if the text is bold
   * @param {Boolean} underline the flag if the text is undelined
   * @param {Boolean} overline the flag if the text is overlined
   * @param {String} color the color of the text
   * @param {String} aling the aligment of the text
   * @constuctor
   */
  descartesJS.TextStyle = function(style) {
    // default values
    this.size = 20;
    this.family = "Arimo";
    this.italic = false;
    this.bold = false;
    this.underline = false;
    this.overline = false;
    this.color = null;
    this.align = "left";
    this.border = null;
    
    this.familyIndex = null;

    // if the style is null or undefined then pass an empty object
    style = style || {};

    this.set(style);
  }

  /**
   * Clone a font style
   * @return {TextStyle} return a clone font style
   */
  descartesJS.TextStyle.prototype.clone = function() {
    var style = {};
    for (var property in this) {
      if (this.hasOwnProperty(property)) {
        style[property] = this[property];
      }
    }

    return new descartesJS.TextStyle(style);
  }

  /**
   * 
   */
  descartesJS.TextStyle.prototype.set = function(style) {
    for (var property in style) {
      if (style.hasOwnProperty(property)) {
        this[property] = style[property];
      }
    }
  }

  /**
   * 
   */
  descartesJS.TextStyle.prototype.equals = function(otherStyle) {
    var eq = true;
    for (var property in this) {
      if (this.hasOwnProperty(property)) {
        eq = eq && (this[property] === otherStyle[property]);
      }
    }
    return eq;
  }

  /**
   * Convert the font style to a string representation
   * @return {String} return the string representation of the style
   */
  descartesJS.TextStyle.prototype.toString = function() {
    if (this.familyIndex === null) {
      if ((/arial/i).test(this.family) || (/sansserif/i).test(this.family)) {
        this.familyIndex = 0;
      }
      else if ((/times/i).test(this.family) || (/serif/i).test(this.family)) {
        this.familyIndex = 1;
      }
      else if ((/courier/i).test(this.family) || (/monospaced/i).test(this.family)) {
        this.familyIndex = 2;
      }
    }

    family = familyArray[this.familyIndex];
// console.log(family, this.familyIndex === null)

    return ((this.bold ? 'bold' : '') + " " + (this.italic ? 'italic' : '') + " " + this.size + "px " + family).trim();
  }

return descartesJS;
})(descartesJS || {});