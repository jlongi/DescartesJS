/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Descartes event
   * @constructor 
   * @param {DescartesApp} parent the Descartes application
   * @param {String} values the values of the auxiliary
   */
  descartesJS.Event = function(parent, values){
    // call the parent constructor
    descartesJS.Auxiliary.call(this, parent, values);
    
    var evaluator = this.evaluator;
    
    delete(this.evaluate);
    this.condition = evaluator.parser.parse(this.condition);
    this.lastEvaluation = false;

    this.action = this.parent.lessonParser.parseAction(this);
    
    // if the type of evaluation is onlyOnce
    if (this.execution == "onlyOnce") {
      this.eventExec = function() {
        if ((this.evaluator.eval(this.condition) > 0) && (!this.lastEvaluation)) {
          this.lastEvaluation = true;
          this.action.execute();
        }
      }
    }
    
    // if the type of evaluation is alternate
    if (this.execution == "alternate") {
      this.eventExec = function() {
        var cond = (this.evaluator.eval(this.condition) > 0);
        //////////////////////////////////////////////////////////////////
        // DESCARTES 3
        if (this.parent.version === 3) {
          if (cond !== this.lastEvaluation) {
            this.action.execute();
            this.lastEvaluation = (cond) ? true : false;
          }
        }
        // DESCARTES 3
        //////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////
        // other versions
        else {
          // if the condition was true and the last time was not executed, then the event is executed
          if ((cond) && (!this.lastEvaluation)) {
            this.action.execute();
            this.lastEvaluation = true;
          }
          // if already run once and the condition is evaluated to false, then rerun the event
          else if ((!cond) && (this.lastEvaluation)) {
            this.lastEvaluation = false;
          }
        }
        //////////////////////////////////////////////////////////////////
        
      }
    }

    // if the type of evaluation is always
    if (this.execution == "always") {
      this.eventExec = function() {
        if (this.evaluator.eval(this.condition) > 0) {
          this.action.execute();
        }
      }
    }
    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // create an inheritance of Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Event, descartesJS.Auxiliary);

  /**
   * Update the event
   */
  descartesJS.Event.prototype.update = function() {
    this.eventExec();
  }

  return descartesJS;
})(descartesJS || {});
