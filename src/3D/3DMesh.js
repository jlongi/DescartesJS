/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  /**
   * Una malla de descartes
   * @constructor 
   * @param {DescartesApp} parent es la aplicacion de descartes
   * @param {string} values son los valores que definen la malla
   */
  descartesJS.Mesh3D = function(parent, values) {
    // se llama al constructor del padre
    descartesJS.Graphic3D.call(this, parent, values);

    var parser = this.evaluator.parser;
    
    this.width = (this.width == -1) ? parser.parse("1") : this.width;

    this.mvMatrix = (new descartesJS.Matrix4x4()).setIdentity();

    var fileData = descartesJS.openExternalFile(this.evaluator.evalExpression(this.file)).split(/\r/);
    this.vertices = [];
    this.faces = [];
    var toInt = function(x) {
      return parseInt(x);
    }

    for (var i=0, l=fileData.length; i<l; i++) {
      if (fileData[i].match(/^V\(/)) {
        this.vertices.push( this.evaluator.parser.parse(fileData[i].substring(1), false, this.name) );
      }

      else if (fileData[i].match(/^F\(/)) {
        this.faces.push( fileData[i].substring(2, fileData[i].length-1).split(",").map(toInt) );
      }

      else if (fileData[i].match(/^VAR\(/)) {
        this.evaluator.evalExpression( this.evaluator.parser.parse(fileData[i].substring(4, fileData[i].length-1), true, this.name) );
      }
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////////////
  // se crea la herencia de Graphic
  ////////////////////////////////////////////////////////////////////////////////////
  descartesJS.extend(descartesJS.Mesh3D, descartesJS.Graphic3D);
  
  var evaluator;
  var fillStyle;

  /**
   * Actualiza la malla
   */
  descartesJS.Mesh3D.prototype.update = function() {
    evaluator = this.evaluator;

    fillStyle = descartesJS.getColor(evaluator, this.color);

    var v;
    var vTemp;

    for (var i=0, l=this.faces.length; i<l; i++) {
      v = [];

      for (var j=0, k=this.faces[i].length; j<k; j++) {
        vTemp = this.evaluator.evalExpression( this.vertices[this.faces[i][j]] )[0];
        v.push(new descartesJS.Vector4D(vTemp[0], vTemp[1], vTemp[2], 1))
      }

      this.space.scene.add(new descartesJS.Primitive3D( v,
                                                        "face",
                                                        { lineWidth: 2, fillStyle: fillStyle, strokeStyle: "#808080", lineCap: "round", lineJoin: "round", edges: this.edges},
                                                        this.mvMatrix,
                                                        this.ctx
                                                      ));    
    }
  }

  return descartesJS;
})(descartesJS || {});
