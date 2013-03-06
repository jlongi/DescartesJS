/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una curva de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la curva
   */
  descartesJS.Curve = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic.call(this, parent, values);

    this.width = (this.width == -1) ? this.evaluator.parser.parse("1") : this.width;

    // ## parche para la version de descartes 2 ## //
    this.visible = ((this.parent.version == 2) && (this.visible == undefined)) ? true : false;

    if (this.visible) {
      this.registerTextField();
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Curve, descartesJS.Graphic);
  
  /**
   * Actualiza la curva
   */
  descartesJS.Curve.prototype.update = function() {
    var evaluator = this.evaluator;

    var para = evaluator.evalExpression(this.parameter_interval);

    this.paraInf = para[0][0]; //el primer valor de la primera expresion
    this.paraSup = para[0][1]; //el segundo valor de la primera expresion

    this.pSteps = evaluator.evalExpression(this.parameter_steps);
    this.paraSep = (this.pSteps > 0) ? Math.abs(this.paraSup - this.paraInf)/this.pSteps : 0;
  }

  /**
   * dibuja la curva
   */
  descartesJS.Curve.prototype.draw = function(){
    // se llama la funcion draw del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.draw.call(this, this.fill, this.color);
  }

  /**
   * Dibuja el rastro de la curva
   */
  descartesJS.Curve.prototype.drawTrace = function() {
    // se llama la funcion drawTrace del padre (uber en lugar de super ya que es palabra reservada)
    this.uber.drawTrace.call(this, this.fill, this.trace);
  }
  
  /**
   * Funcion auxiliar para dibujar una curva
   * @param {CanvasRenderingContext2D} ctx el contexto de render sobre el cual se dibuja una curva
   * @param {String} fill el color de relleno de una curva
   * @param {String} stroke el color del trazo de una curva
   */
  descartesJS.Curve.prototype.drawAux = function(ctx, fill, stroke){
    var evaluator = this.evaluator;
    var space = this.space;

    // el ancho de una linea no puede ser 0 ni negativa
    var tmpLineWidth = this.evaluator.evalExpression(this.width);
    if (tmpLineWidth <=0) {
      tmpLineWidth = 0.000001;
    }
    ctx.lineWidth = tmpLineWidth;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = descartesJS.getColor(evaluator, fill);
    ctx.strokeStyle = descartesJS.getColor(evaluator, stroke);
    
    var tempParam = evaluator.getVariable(this.parameter);
    
    ctx.beginPath();
    
    evaluator.setVariable(this.parameter, this.paraInf);
    
    var expr = evaluator.evalExpression(this.expresion);
    this.exprX = (this.abs_coord) ? expr[0][0] : space.getAbsoluteX(expr[0][0]);
    this.exprY = (this.abs_coord) ? expr[0][1] : space.getAbsoluteY(expr[0][1]);

    //MACRO//
    // se rotan los elementos en caso de ser un macro con rotacion
    var radianAngle;
    var cosTheta;
    var senTheta;
    var tmpRotX;
    var tmpRotY;

    if (this.rotateExp) {
      radianAngle = descartesJS.degToRad(this.evaluator.evalExpression(this.rotateExp));
      cosTheta = Math.cos(radianAngle);
      senTheta = Math.sin(radianAngle);
      
      tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
      tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
      this.exprX = tmpRotX;
      this.exprY = tmpRotY;
    }
    //MACRO//
    
    ctx.moveTo(this.exprX+.5, this.exprY+.5);
    for(var i=1; i<=this.pSteps; i++) {
      evaluator.setVariable( this.parameter, (this.paraInf+(i*this.paraSep)) );
      
      expr = evaluator.evalExpression(this.expresion);
      this.exprX = (this.abs_coord) ? expr[0][0] : space.getAbsoluteX(expr[0][0]);
      this.exprY = (this.abs_coord) ? expr[0][1] : space.getAbsoluteY(expr[0][1]);

      //MACRO//
      // se rotan los elementos en caso de ser un macro con rotacion
      if (this.rotateExp) {
        tmpRotX = this.exprX*cosTheta - this.exprY*senTheta;
        tmpRotY = this.exprX*senTheta + this.exprY*cosTheta;
        this.exprX = tmpRotX;
        this.exprY = tmpRotY;
      }
      //MACRO//
      
      ctx.lineTo(this.exprX+.5, this.exprY+.5);
    }
        
    if (this.fill) {
      ctx.fill();
    }
    ctx.stroke();
    
    evaluator.setVariable(this.parameter, tempParam);
        
//     ctx.restore()
  }
    
  /**
   * 
   */
  descartesJS.Curve.prototype.registerTextField = function() {
    var textField = document.createElement("input");
    textField.value = this.expresionString;
    textField.disabled = !(this.editable);

    var self = this;
    textField.onkeydown = function(evt) {
      if (evt.keyCode == 13) {
      self.expresion = self.evaluator.parser.parse(this.value);
      self.parent.update();
      }
    }
   
    this.parent.editableRegion.textFields.push(textField); 
  }
  return descartesJS;
})(descartesJS || {});