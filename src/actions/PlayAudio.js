/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una accion de animar de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el parametro de la accion
   */
  descartesJS.PlayAudio = function(parent, parameter) {
    // se llama al constructor del padre
    descartesJS.Action.call(this, parent, parameter);
    
    this.filenameExpr = this.evaluator.parser.parse("'" + parameter.split(" ")[0].trim() + "'");
    this.filename = this.evaluator.evalExpression(this.filenameExpr);
    this.theAudio = this.parent.getAudio(this.filename)
  }  
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Action
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.PlayAudio, descartesJS.Action);
  
  /**
   * Ejecuta la accion
   */
  descartesJS.PlayAudio.prototype.execute = function() {
    this.filename = this.evaluator.evalExpression(this.filenameExpr);
//     this.theAudio = this.parent.getAudio(this.filename)
// 
//     // si el audio esta pausado se reproduce
//     if (this.theAudio.paused) {
//       this.theAudio.play();
//     } 
//     // si el audio se esta reproduciendo se detiene
//     else {
//       this.theAudio.pause();
//       this.theAudio.currentTime = 0.1;
//     }
    
    theAudio = this.parent.getAudio(this.filename)

    // si el audio esta pausado se reproduce
    if (theAudio.paused) {
      theAudio.play();
    } 
    // si el audio se esta reproduciendo se detiene
    else {
      theAudio.pause();
      theAudio.currentTime = 0.1;
    }
    
  }

  return descartesJS;
})(descartesJS || {});