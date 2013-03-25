/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un texto de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el texto
   */
  descartesJS.Text3D = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic3D.call(this, parent, values);

    // alineacion
    if (!this.align) {
      this.align = "start";
    }
    
    // el texto no tiene especificado el ancho
    if (this.width == -1) {
      this.width = this.evaluator.parser.parse("0");
    }
    
    this.abs_coord = true;
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic3D
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Text3D, descartesJS.Graphic3D);
  
  /**
   * Actualiza el texto
   */
  descartesJS.Text3D.prototype.update = function() {
    var evaluator = this.evaluator;

    var expr = evaluator.evalExpression(this.expresion);
    this.exprX = expr[0][0]; //el primer valor de la primera expresion
    this.exprY = expr[0][1]; //el segundo valor de la primera expresion

    // se rotan los elementos en caso de ser un macro con rotacion
    if (this.rotateExp) {
      var radianAngle = descartesJS.degToRad(evaluator.evalExpression(this.rotateExp));
      var cosTheta = Math.cos(radianAngle);
      var senTheta = Math.sin(radianAngle);
      var tmpRotX;
      var tmpRotY;
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }
  }

  /**
   * Dibuja el texto
   */
  descartesJS.Text3D.prototype.draw = function() {
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.color);
  }

  /**
   * Dibuja el rastro del text
   */
  descartesJS.Text3D.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.color);
  }
  
  /**
   * Funcion auxiliar para dibujar un texto
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja el texto
   * @param {String} fill el color de relleno del texto
   */
  descartesJS.Text3D.prototype.drawAux = function(ctx, fill) {
    var newText = this.splitText(this.text)
    
    // se dibuja el texto
    if (this.text != [""]) {
      this.uber.drawText.call(this, ctx, newText, parseFloat(this.exprX)+5, parseFloat(this.exprY), fill, this.font, this.align, "hanging", this.evaluator.evalExpression(this.decimals), this.fixed);
    }
  }
  
  /**
   * 
   */
  descartesJS.Text3D.prototype.splitText = function(text) {
    var width = this.evaluator.evalExpression(this.width);
    var textLine;
    var w;
    var newText = [];
    var height;
    
    this.ctx.font = this.font;
    this.fontSize = this.font.match(/(\d+)px/);
    if (this.fontSize) {
      this.fontSize = this.fontSize[1];
    } else {
      this.fontSize = "10";
    } 

    // si el ancho es mayor que 20 entonces si hay que partir el texto
    // ademas el texto no debe ser en rtf text.type != "undefined"
    if ( (width >=20) && (text.type != "undefined") ) {
      for (var i=0, l=text.length; i<l; i++) {
        textLine = this.evaluator.evalExpression(text[i], this.evaluator.evalExpression(this.decimals), this.fixed).trim();
        w = (this.ctx.measureText(textLine)).width;

        if (w > width) {
          newText = newText.concat( this.splitWords(textLine, width) );
        }
        else {
          newText.push(textLine);
        }    
      }
      

      height = Math.floor(this.fontSize*1.2)*(newText.length);
      this.evaluator.setVariable("_Text_H_", height);
      return newText;
    }
    
    this.evaluator.setVariable("_Text_H_", 0);
    this.evaluator.setVariable("_Text_W_", 1000);

    return text;
  }
    
  /**
   * 
   */
  descartesJS.Text3D.prototype.splitWords = function(text, widthLimit) {
    var restText = text;
    var resultText = [];
    
    var tempText;
    var tempTextWidth;
    var tempIndex;

    var lastIndexOfWhite;
    var inTheWord = false;
        
    do {
      tempIndex = Math.floor(restText.length*(widthLimit/this.ctx.measureText(restText).width)) +1;

      tempText = restText.slice(0, tempIndex);
      
      // si el texto inicia con un espacio en blanco, entonces se ignora el espacio en blanco
      if ((tempText != "") && (tempText[0] == " ")) {
        restText = restText.slice(1);
        tempText = restText.slice(0, tempIndex);
      }
      
      // se busca si se esta entre un palabra
      inTheWord = ( (restText[tempIndex-1]) && (restText[tempIndex]) && (restText[tempIndex-1] != " ") && (restText[tempIndex] != " ") );
      
      // se busca el ultimo indice del espacio en blanco
      lastIndexOfWhite = tempText.lastIndexOf(" ");

      // el ancho del texto
      tempTextWidth = (this.ctx.measureText(tempText)).width;
      
      if (tempTextWidth >= widthLimit) {
        if (lastIndexOfWhite != -1) {
          tempIndex = lastIndexOfWhite;
          tempText = restText.slice(0, tempIndex);
        }
        else {
          tempIndex = tempIndex-1;
          tempText = restText.slice(0, tempIndex);
        }
      }
      
      else {
        if ((inTheWord) && (lastIndexOfWhite != -1)) {
          tempIndex = lastIndexOfWhite;
          tempText = restText.slice(0, tempIndex);          
        }
      }
      
      resultText.push(tempText);
      
      restText = restText.slice(tempIndex);
    }
    while (restText != "");

    return resultText;
  }
  
  return descartesJS;
})(descartesJS || {});