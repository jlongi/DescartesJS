/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  class Event extends descartesJS.Auxiliary {
    /**
     * Descartes event
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the auxiliary
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);
      
      let self = this;
      let evaluator = self.evaluator;
      
      delete(self.evaluate);
      self.condition = evaluator.parser.parse(self.condition);
      self.lastEval = false;

      self.action = self.parent.lessonParser.parseAction(self);
      
      // if the type of evaluation is onlyOnce
      if (self.execution == "onlyOnce") {
        self.eventExec = function() {
          if ((self.evaluator.eval(self.condition) > 0) && (!self.lastEval)) {
            self.lastEval = true;
            self.action.execute();
          }
        }
      }
      
      // if the type of evaluation is alternate
      if (self.execution == "alternate") {
        self.eventExec = function() {
          const cond = (self.evaluator.eval(self.condition) > 0);

          // if the condition was true and the last time was not executed, then the event is executed
          if ((cond) && (!self.lastEval)) {
            self.action.execute();
            self.lastEval = true;
          }
          // if already run once and the condition is evaluated to false, then rerun the event
          else if ((!cond) && (self.lastEval)) {
            self.lastEval = false;
          }
        }
      }

      // if the type of evaluation is always
      if (self.execution == "always") {
        self.eventExec = function() {
          if (self.evaluator.eval(self.condition) > 0) {
            self.action.execute();
          }
        }
      }
    }
    
    /**
     * Update the event
     */
    update() {
      this.eventExec();
    }
  }

  descartesJS.Event = Event;
  return descartesJS;
})(descartesJS || {});
