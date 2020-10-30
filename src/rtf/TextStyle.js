/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var family;

  class TextStyle {
    /**
     * Font style for rtf text
     * @param {Number} size the size of the font
     * @param {String} family the font family name
     * @param {String} italic the flag if the text is italic
     * @param {String} bold the flag if the text is bold
     * @param {Boolean} underline the flag if the text is underlined
     * @param {Boolean} overline the flag if the text is overlined
     * @param {String} color the color of the text
     * @param {String} align the alignment of the text
     */
    constructor(style) {
      // default values
      this.size = 20;
      this.family = "Arimo";
      this.italic = false;
      this.bold = false;
      this.underline = false;
      this.overline = false;
      this.color = null;
      this.border = null;
      this.align = "left";
      
      // this.familyIndex = null;

      // if the style is null or undefined then pass an empty object
      style = style || {};

      this.set(style);
    }

    /**
     * Clone a font style
     * @return {TextStyle} return a clone font style
     */
    clone() {
      return new TextStyle(Object.assign({}, this));
    }

    /**
     * 
     */
    set(style) {
      // assign the values to replace the defaults values of the object
      Object.assign(this, style);
    }

    /**
     * 
     */
    equals(otherStyle) {
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
    toString(math) {
      if ((/arial|sansserif/i).test(this.family)) {
        family = descartesJS.sansserif_font;
      }
      else if ((/times|serif/i).test(this.family)) {
        family = (math) ? descartesJS.math_font : descartesJS.serif_font;
      }
      else if ((/courier|monospaced/i).test(this.family)) {
        family = descartesJS.monospace_font;
      }

      return ((this.bold ? 'bold' : '') + " " + (this.italic ? 'italic' : '') + " " + this.size + "px " + family).trim();
    }
  }

  descartesJS.TextStyle = TextStyle;
  return descartesJS;
})(descartesJS || {});
