/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  descartesJS.DEBUG = {
    PARENTHESIS_CLOSING: "Faltan paréntesis por cerrar",
    PARENTHESIS_OPENING: "Faltan paréntesis por abrir",
    BRACKET_CLOSING: "Faltan corchetes por cerrar",
    BRACKET_OPENING: "Faltan corchetes por abrir",
    INCOMPLETE_IF: "Condicional incompleta",
    EXPRESSION: "En la expresión",
  };

  descartesJS.DEBUG.setError = function(type, expr) {
    var errStr = "Error: " + type + " en《 " + expr + " 》. ";
    var tmpErr = "";
    var extraErr = "";

    switch(descartesJS.DEBUG.objectName) {
      //////////////////////////////////////////
      case("Auxiliar"):
        if ( (descartesJS.DEBUG.typeName === "event") || (descartesJS.DEBUG.typeName === "algorithm") || (descartesJS.DEBUG.typeName === "constant")) {
          tmpErr = "En el programa ";
        }
        else {
          tmpErr = "En la definición "
        }

        if ( (babel[descartesJS.DEBUG.paramName] == "doExpr") ||
             (babel[descartesJS.DEBUG.paramName] == "init") ) {
          extraErr = " en la línea " + (descartesJS.DEBUG.lineCount+1);
        }

        errStr += tmpErr + "「" +descartesJS.DEBUG.idName + "」, en el paramétro 「" + descartesJS.DEBUG.paramName + "」" + extraErr + ".";
        break;

      //////////////////////////////////////////
      case("Graphic"):
        errStr += "En el gráfico #" + (descartesJS.DEBUG.elemIndex+1) + " de tipo 「" +descartesJS.DEBUG.idName + "」, en el paramétro 「" + descartesJS.DEBUG.paramName + "」.";
        break;
    }

    console.info(errStr);
  }

  return descartesJS;
})(descartesJS || {});
