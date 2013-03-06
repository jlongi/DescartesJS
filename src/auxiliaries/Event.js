/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un evento de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el evento
   */
  descartesJS.Event = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Auxiliary.call(this, parent, values);
    
    var evaluator = this.evaluator;
    
    this.condition = evaluator.parser.parse(this.condition);
    this.lastEvaluation = false;

    this.action = this.parent.lessonParser.parseAction(this);
    
    // si la forma en la que se ejecuta el evento es onlyOnce
    if (this.execution == "onlyOnce") {
      this.eventExec = function() {
        if ((evaluator.evalExpression(this.condition) > 0) && !this.lastEvaluation) {
//           console.log("onlyOnce");
          this.lastEvaluation = true;
          this.action.execute();
        }
      }
    }
    
    // si la forma en la que se ejecuta el evento es alternate
    if (this.execution == "alternate") {
      this.eventExec = function() {
        var cond = (evaluator.evalExpression(this.condition) > 0);
        
        //////////////////////////////////////////////////////////////////
        // DESCARTES 3
        if (this.parent.version == 3) {
          if (cond != this.lastEvaluation) {
            this.action.execute();
            this.lastEvaluation = (cond) ? true : false;
          }
        }
        // DESCARTES 3
        //////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////
        // los otros descartes 
        else {
          // si la condicion esta en verdadero y la ultima vez no se ejecuto, entonce se ejectua el evento
          if (cond && !this.lastEvaluation) {
            this.action.execute();
            this.lastEvaluation = true;
          }
          // si ya se ejecuto una vez y la condicion paso a falso, entonces se puede volver a ejecutar el evento
          else if (!cond && this.lastEvaluation){
            this.lastEvaluation = false;
          }
        }
        //////////////////////////////////////////////////////////////////
        
      }
    }
    
    // si la forma en la que se ejecuta el evento es always
    if (this.execution == "always") {
      this.eventExec = function() {
        if (evaluator.evalExpression(this.condition) > 0) {
          this.action.execute();
        }
      }
    }
    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Event, descartesJS.Auxiliary);

  /**
   * Actualiza el evento
   */
  descartesJS.Event.prototype.update = function() {
    this.eventExec();
  }

  return descartesJS;
})(descartesJS || {});