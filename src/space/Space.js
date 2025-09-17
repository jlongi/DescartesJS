/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  let self;
  let parent;
  let evaluator;
  let parser;
  let this_id_with_dot;
  let newH;
  let newW;
  let parentH;
  let parentW;
  let temp;
  let OxExpr;
  let OyExpr;

  class Space {
    /**
     * Descartes space
     * @param {DescartesApp} parent the Descartes application
     * @param {String} values the values of the graphic
     */
    constructor(parent, values) {
      self = this;

      self.parent = parent;
      self.evaluator = self.parent.evaluator;
      evaluator = self.evaluator;
      parser = evaluator.parser;

      self.id = self.imageSrc = self.x_axis = self.y_axis = self.cID = "";
      self.type = "2D";

      self.xExpr = self.yExpr = parser.parse("0");

      self.w = parseInt(parent.container.width);
      self.h = parseInt(parent.container.height);

      self.drawif = parser.parse("1");

      self.fixed = self.text = self.numbers = self.sensitive_to_mouse_movements = false;

      self.scale = 48;

      self.Ox = self.Oy = self.mouse_x = self.mouse_y = self.border_width = self.border_radius = 0;

      self.image = new Image();
      self.image.onload = function() {
        this.ready = 1;
      }

      self.bg_display = "topleft";

      self.background = new descartesJS.Color("ffffff");
      self.net = new descartesJS.Color("b8c4c8");
      self.net10 = new descartesJS.Color("889498");
      self.axes = new descartesJS.Color("405860");
      self.border_color = new descartesJS.Color("000000");

      self.ctrs = [];
      self.graphicsCtr = [];
      self.graphics = [];
      self.backGraphics = [];

      self.zIndex = parent.zIndex;

      self.plecaHeight = parent.plecaHeight || 0;
      self.displaceRegionNorth = parent.displaceRegionNorth || 0;
      self.displaceRegionWest = parent.displaceRegionWest || 0;

      // assign the values to replace the defaults values of the object
      Object.assign(self, values);

      self.initSpace();
    }

    /**
     * Init the values of the space
     */
    initSpace() {
      self = this;

      parent = self.parent;
      evaluator = self.evaluator;
      this_id_with_dot = self.id + ".";

      if (!self.resizable) {
        self.displaceRegionNorth = parent.displaceRegionNorth || 0;
        self.displaceRegionSouth = parent.displaceRegionSouth || 0;
        self.displaceRegionEast = parent.displaceRegionEast || 0;
        self.displaceRegionWest = parent.displaceRegionWest || 0;
        parentW = parseInt(parent.container.width);
        parentH = parseInt(parent.container.height);

        // dimensions in percentages
        if (self.wExpr != undefined) {
          self.w = parseInt(parentW - self.displaceRegionWest - self.displaceRegionEast)*parseFloat(self.wExpr)/100;
        }
        if (self.hExpr != undefined) {
          self.h = parseInt(parentH - self.displaceRegionNorth - self.displaceRegionSouth)*parseFloat(self.hExpr)/100;
        }

        // get the x and y position
        if (self.xPercentExpr != undefined) {
          self.xExpr = evaluator.parser.parse((parseInt(parentW - self.displaceRegionWest - self.displaceRegionEast)*parseFloat(self.xPercentExpr)/100).toString());
        }
        if (self.yPercentExpr != undefined) {
          self.yExpr = evaluator.parser.parse((parseInt(parentH - self.displaceRegionNorth - self.displaceRegionSouth)*parseFloat(self.yPercentExpr)/100).toString());
        }

        self.x = evaluator.eval(self.xExpr) + self.displaceRegionWest;
        self.y = evaluator.eval(self.yExpr) + self.plecaHeight + self.displaceRegionNorth;

        // if the container exist then modify it's x and y position
        if (self.container) {
          self.container.style.left = self.x + "px";
          self.container.style.top  = self.y + "px";
        }

        if (self.y >= 0) {
          newH = parentH - self.y;
          if (self.h > newH) {
            self.h = newH;
          }
        } 
        else {
          newH = self.h + self.y;
          self.h = (newH >= parentH) ? parentH : newH;
        }

        if (self.x >= 0) {
          newW = parentW - self.x;
          if (self.w > newW) {
            self.w = newW;
          }
        } 
        else {
          newW = self.w + self.x;
          self.w = (newW >= parentW) ? parentW : newW;
        }
      }

      // if the space has a background image then get the image from the parent
      if ( (self.imageSrc != "") || !(/vacio.gif$/i).test(self.imageSrc.trim()) ) {
        self.image = parent.getImage(self.imageSrc);
      }

      // Ox
      // if specified with a percentage
      if (self.OxExpr) {
        OxExpr = self.OxExpr;
        if (OxExpr.endsWith("%")) {
          self.Ox = self.w*parseFloat(OxExpr)/100;
        }
        // if not specified with a percentage
        else {
          temp = parseFloat(OxExpr);

          // whether to convert the value to a number the values ​​are different
          if (temp != OxExpr) {
            temp = 0;
          }
          self.Ox = temp;
        }
      }

      // Oy
      // if specified with a percentage
      if (self.OyExpr) {
        OyExpr = self.OyExpr;
        if (OyExpr.endsWith("%")) {
          self.Oy = self.h*parseFloat(OyExpr)/100;
        }
        // if not specified with a percentage
        else {
          temp = parseFloat(OyExpr);

          // whether to convert the value to a number the values ​​are different
          if (temp != OyExpr) {
            temp = 0;
          }
          self.Oy = temp;
        }
      }

      // register the space variables
      // ## Descartes 2 patch ## //
      if ((self.id !== "") && (parent.version !== 2)) {
        evaluator.setVariable(this_id_with_dot + "_w", self.w);
        evaluator.setVariable(this_id_with_dot + "_h", self.h);
        evaluator.setVariable(this_id_with_dot + "escala", evaluator.getVariable(this_id_with_dot + "escala") || self.scale);
        evaluator.setVariable(this_id_with_dot + "Ox", evaluator.getVariable(this_id_with_dot + "Ox") || self.Ox);
        evaluator.setVariable(this_id_with_dot + "Oy", evaluator.getVariable(this_id_with_dot + "Oy") || self.Oy);
        evaluator.setVariable(this_id_with_dot + "mouse_x", 0);
        evaluator.setVariable(this_id_with_dot + "mouse_y", 0);
        evaluator.setVariable(this_id_with_dot + "mouse_pressed", 0);
        evaluator.setVariable(this_id_with_dot + "mouse_clicked", 0);
        evaluator.setVariable(this_id_with_dot + "clic_izquierdo", 0);
      }
      else {
        temp = evaluator.getVariable("_w");
        evaluator.setVariable("_w", (temp === undefined) ? self.w : temp);

        temp = evaluator.getVariable("_h");
        if (temp === undefined) { temp = self.h; };
        evaluator.setVariable("_h", temp);

        temp = evaluator.getVariable("escala");
        if (temp === undefined) { temp = self.scale; };
        evaluator.setVariable("escala", temp);

        temp = evaluator.getVariable("Ox");
        if (temp === undefined) { temp = self.Ox; };
        evaluator.setVariable("Ox", temp);

        temp = evaluator.getVariable("Oy");
        if (temp === undefined) { temp = self.Oy; };
        evaluator.setVariable("Oy", temp);

        evaluator.setVariable("mouse_x", 0);
        evaluator.setVariable("mouse_y", 0);
        evaluator.setVariable("mouse_pressed", 0);
        evaluator.setVariable("mouse_clicked", 0);
        evaluator.setVariable("clic_izquierdo", 0);

        if ((parent.version == 2) && (self.x_axis === "") && (self.y_axis === "")) {
          self.axes = "";
        }
      }

      self.w_2 = self.w/2;
      self.h_2 = self.h/2;

      // register the download function
      evaluator.setFunction(this_id_with_dot + "download_image", function(filename) {
        self.evaluator.functions["_SaveSpace_"](filename, self.canvas.toDataURL("image/png"));
      });
    }

    /**
     * Add a control to the list of controls of the space
     * @param {Control} ctr is the control to add
     */
    addCtr(ctr) {
      if (ctr.type === "GraphicControl") {
        this.graphicsCtr.push(ctr);
      }
      else {
        this.ctrs.push(ctr);
      }
    }

    /**
     * Add a graphic to the list of graphics of the space
     * @param {Graphic} gra is the graphic to add
     */
    addGraph(gra, is3D) {
      // add only graphs with the type of the space
      if ( ((this.type === "2D") && is3D) || ((this.type === "3D") && !is3D) ) {
        return;
      }

      if ((gra.background) && (this.type !== "3D")) {
        this.backGraphics.push(gra);
      }
      else {
        this.graphics.push(gra);
      }
    }

    /**
     * Change the click to 0
     */
    clearClick() {
      this.evaluator.setVariable(this.mclickedString, 0);
      this.evaluator.setVariable(this.mclicizquierdoString, 0);
    }


    /**
     * Calculate the position relative to the X axis
     * @param {Number} x ths position
     * @return {Number} return the position relative to the X axis
     */
    getRelativeX(x) {
      return (parseInt(x) - this.w_2 - this.Ox)/this.scale;
    }

    /**
     * Calculate the position relative to the Y axis
     * @param {Number} y ths position
     * @return {Number} return the position relative to the Y axis
     */
    getRelativeY(y) {
      return (-parseInt(y) + this.h_2 + this.Oy)/this.scale;
    }

    /**
     * Calculate the position absolute respect to the canvas coordinate system
     * @param {Number} x ths position
     * @return {Number} return the position absolute to the X axis
     */
    getAbsoluteX(x) {
      return x*this.scale + this.w_2 + this.Ox;
    }

    /**
     * Calculate the position absolute respect to the canvas coordinate system
     * @param {Number} y ths position
     * @return {Number} return the position absolute to the Y axis
     */
    getAbsoluteY(y) {
      return -y*this.scale + this.h_2 + this.Oy;
    }
  }

  descartesJS.Space = Space;
  return descartesJS;
})(descartesJS || {});
