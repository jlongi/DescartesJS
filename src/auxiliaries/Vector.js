/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Un vector de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen el vector
   */
  descartesJS.Vector = function(parent, values){
    // se llama al constructor del padre
    descartesJS.Auxiliary.call(this, parent, values);

    var evaluator = this.evaluator;
    var parser = evaluator.parser;
    
    this.expresion = this.expresion.split(";");
    
    var response;
    // si tiene un archivo asociado entonces se lee
    if (this.file) {
      // si el vector esta embedido en la pagina
      var vectorElement = document.getElementById(this.file);
      if ((vectorElement) && (vectorElement.type == "descartes/vectorFile")) {
        response = vectorElement.text;
        
        if (response[0] == '\n') {
          response = response.substring(1);
        }
      }
      // se lee el vector de un archivo
      else {
        response = descartesJS.openExternalFile(this.file);
      }
      
      if (response != null) {
        response = response.split("\n");
      }
        
      // si no tiene contenido el archivo o no se pudo leer
      if ( (response == null) || ((response.length == 1) && (response[0] == "")) ) {
        response = [];
        this.size = 0;
      }
      // si tiene contenido el archivo y se pudo leer
      else {
        this.expresion = [];
//         this.size = parser.parse( (response.length).toString() );
        this.size = null;
      }
        
      var tmpImg;
      var nonEmptyValuesIndex = 0; 
      for(var i=0, l=response.length; i<l; i++) {
        if (response[i].match(/./)) {
          this.expresion[nonEmptyValuesIndex] = this.id + "[" + nonEmptyValuesIndex + "]=" + response[i];
          nonEmptyValuesIndex++;
          
          // si el archivo al cual hace referencia el vector contiene una imagen, hay que precargarla
          tmpImg = response[i].match(/[\w-//]*(.png|.jpg|.gif|.svg|.PNG|.JPG|.GIF|.SVG)/g)
          if (tmpImg) {
            this.parent.getImage(tmpImg);
          }
        }
//         this.expresion[i] = this.id + "[" + i + "]=" + response[i];
      }
      
      if (this.size == null) {
        this.size = parser.parse( this.expresion.length + "" );
      }
      
    }

    var tmpExp;
    // se parsean los elementos de la expresion
    for(var i=0, l=this.expresion.length; i<l; i++) {
      tmpExp = parser.parse(this.expresion[i], true);
      
      if (tmpExp && (tmpExp.type != "asign")) {
        tmpExp = parser.parse( this.id + "[" + i + "]=" + this.expresion[i], true );
      }

      this.expresion[i] = tmpExp;
    }

    var length = evaluator.evalExpression(this.size);
    var vectInit = [];
    for (var i=0, l=length; i<l; i++) {
      vectInit.push(0);
    }
    evaluator.vectors[this.id] = vectInit;
    
    this.update();
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Auxiliary
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Vector, descartesJS.Auxiliary);

  /**
   * Actualiza el vector
   */
  descartesJS.Vector.prototype.update = function() {
    var evaluator = this.evaluator;
// //     var length = evaluator.evalExpression(this.size);
// // 
// //     evaluator.setVariable(this.id + ".long", length);

    evaluator.setVariable(this.id + ".long", evaluator.evalExpression(this.size));

    for(var i=0, l=this.expresion.length; i<l; i++) {
      evaluator.evalExpression(this.expresion[i]);
    }
  }

  return descartesJS;
})(descartesJS || {});
