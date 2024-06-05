/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  const DEBUG = {
    PARENTHESIS_CLOSING: "Faltan paréntesis por cerrar",
    PARENTHESIS_OPENING: "Faltan paréntesis por abrir",
    BRACKET_CLOSING: "Faltan corchetes por cerrar",
    BRACKET_OPENING: "Faltan corchetes por abrir",
    INCOMPLETE_IF: "Condicional incompleta",
    EXPRESSION: "En la expresión",
  };

  DEBUG.setError = function(type, expr) {
    let errStr = `Error: ${type} en《 ${expr} 》`;
    let tmpErr = "";
    let extraErr = "";

    switch (descartesJS.DEBUG.objectName) {
      case("Auxiliar"):
        tmpErr = ( (descartesJS.DEBUG.typeName === "event") || (descartesJS.DEBUG.typeName === "algorithm") || (descartesJS.DEBUG.typeName === "constant") ) ? "En el programa " : "En la definición ";

        if ( (babel[descartesJS.DEBUG.paramName] == "doExpr") ||
             (babel[descartesJS.DEBUG.paramName] == "init") ) {
          extraErr = " en la línea " + (descartesJS.DEBUG.lineCount+1);
        }

        errStr += `${tmpErr}「${descartesJS.DEBUG.idName}」, en el parámetro 「${descartesJS.DEBUG.paramName}」${extraErr}.`;
        break;

      case("Graphic"):
        errStr += `En el gráfico #${descartesJS.DEBUG.elemIndex+1} de tipo 「${descartesJS.DEBUG.idName}」, en el parámetro 「${descartesJS.DEBUG.paramName}」.`;
        break;
    }

    console.info(errStr);
  }

  descartesJS.DEBUG = DEBUG;
  return descartesJS;
})(descartesJS || {});
