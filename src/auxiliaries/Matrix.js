/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let evaluator;
  let parser;
  let rows;
  let cols;
  let mat;
  let response;

  const comma_regex = /'[^']*'|"[^"]*"|[^,']+/g;
  const semicolon_regex = /'[^']*'|"[^"]*"|[^;']+/g;

  class Matrix extends descartesJS.Auxiliary {
    /**
     * Descartes matrix
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the auxiliary
     */
    constructor(parent, values) {
      // call the parent constructor
      super(parent, values);

      self = this;
      evaluator = parent.evaluator;
      parser = evaluator.parser;

      self.rows = self.rows || parser.parse("3");
      self.columns = self.columns || parser.parse("3");

      // if has an associate file then read it
      if (self.file) {
        // if the file is embedded in the page
        let matrixElement = document.getElementById(self.file);
        if ((matrixElement) && (matrixElement.type == "descartes/matrixFile")) {
          response = matrixElement.text;
        }
        // read the vector data from a file
        else {
          response = descartesJS.openFile(self.file);
        }
    
        let temp_col;
        let temp_row;
        // if the file has content, split the content
        if (response != null) {
          cols = 0;
          rows = null;
          response = response.replace(/\r/g, "").split("\n");
          self.expresion = [];

          response.forEach(col => {
            if (col) {
              // split with commas or semicolon
              if (parent.decimal_symbol == ".") {
                temp_col = col.trim().match(comma_regex) || [];
              }
              else {
                temp_col = col.trim().match(semicolon_regex) || [];
              }
              
              if (rows == null) {
                rows = temp_col.length;
              }

              temp_col.forEach((row, j) => {
                row = row.trim();

                if (parent.decimal_symbol == ".") {
                  temp_row = parseFloat(row);
                }
                else {
                  temp_row = parseFloat(row.replace(",", "."));
                }

                // if the value is not a numerical value and don't have single quotations marks then add quotes
                if (isNaN(temp_row) && (!(/^'.*'$/).test(row))) {
                  // remove the start and end double quotes
                  temp_row = row.replace(/^"(.*)"$/, "$1");
                  // add single quotes
                  temp_row = `'${temp_row}'`;
                }
                // if the value is not a numerical value but have have single quotations marks then use the original value
                // if the value es a numerical value then use the original value
                else {
                  if (parent.decimal_symbol == ",") {
                    row = row.replace(",", ".");
                  }

                  temp_row = row;
                }

                self.expresion.push( parser.parse(`${self.id}[${cols},${j}]:=${temp_row}`) );
              });

              cols++;
            }
          });
          self.rows = parser.parse(rows+"");
          self.columns = parser.parse(cols+"");
        }
    
        // if the file has no content or could not be read
        if ( (response == null) || ((response.length == 1) && (response[0] == "")) ) {
          self.expresion = [];
          self.rows = parser.parse("0");
          self.columns = parser.parse("0");
        }
      }
      // parse the expression
      else {
        self.expresion = descartesJS.splitInstructions(parser, self.expresion);
        rows = evaluator.eval(self.rows);
        cols = evaluator.eval(self.columns);
      }

      mat = [];
      mat.type = "matrix";

      for (let j=0, k=cols; j<k; j++) {
        mat[j] = Array(rows).fill(0);
      }
      evaluator.matrices[self.id] = mat;
      
      self.update();
    }

    /**
     * Update the matrix
     */
    update() {
      self = this;
      evaluator = self.evaluator;

      mat = evaluator.matrices[self.id];
      mat.rows = evaluator.eval(self.rows);
      mat.cols = evaluator.eval(self.columns);

      evaluator.setVariable(self.id + ".filas", mat.rows);
      evaluator.setVariable(self.id + ".columnas", mat.cols);

      for (let exp_i of self.expresion) {
        evaluator.eval(exp_i);
      }
    }
  }

  descartesJS.Matrix = Matrix;
  return descartesJS;
})(descartesJS || {});
