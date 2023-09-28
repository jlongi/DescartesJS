/**
 * @author Joel Espinosa Longi
 * @licencia LGPL - http://www.gnu.org/licenses/lgpl.html
 */

 var descartesJS = (function(descartesJS) {
  if (descartesJS.loadLib) { return descartesJS; }

  var margin = 5;

  /**
   *
   */
  class Keyboard {
    constructor(parent) {
      this.parent = parent;

      this.container = descartesJS.newHTML("div", {
        class : "DescartesKeyboardContainer",
      });
      this.container.oncontextmenu = function() { return false; };

      // this.display = descartesJS.newHTML("input", {
      //   type : "text",
      //   class : "DescartesKeyboardDisplay",
      //   inputmode : "none"
      // });
      // this.container.appendChild(this.display);
      this.display = descartesJS.newHTML("textarea", {
        class : "DescartesKeyboardDisplay",
        spellcheck : "false",
        inputmode : "none"
      });
      this.container.appendChild(this.display);

      this.keyContainer = descartesJS.newHTML("div", {
        style : "position:absolute; padding-bottom:5px;",
        class : "DescartesKeysContainer"
      });
      this.container.appendChild(this.keyContainer);

      this.aditionalKeys = descartesJS.newHTML("div", {
        style : "position:absolute; padding: 0 5px 5px 0; display:none;",
        class : "DescartesKeysContainer"
      });
      this.container.appendChild(this.aditionalKeys);

      this.newLine = descartesJS.newHTML("div", {
        style : "position:absolute; background-color:white; margin:0; font-family:DJS_sansserif; font-size:17px; font-weight:normal; line-height:38px", 
        class : "new_line_btn",
      });
      this.newLine.textContent = "\\n";
      this.newLine.addEventListener("pointerup", () => {
        this.insert("\n");
      });

      this.container.appendChild(this.newLine);

      /**
       * 
       */
      this.display.addEventListener("keydown", (evt) => {
        this.keypressed = true;

        // esc
        if (evt.keyCode === 27) {
          this.close();
        }
        // enter
        else if (evt.keyCode === 13) {
          this.onEnter();
        }
      });
      
      /**
       * 
       */
      // this.keyContainer.addEventListener("pointerup", (evt) => {
      //   this.displayCursor = this.display.selectionStart;
      // });

      this.key_pressed = false;
      let idTimeout;
      this.delete_pressed = false;
      let deleteTimeout;
      /**
       * 
       */
      this.keyContainer.addEventListener("pointerdown", (evt) => {
        if (
          (evt.target.id == "k_op") ||
          (evt.target.id == "k_dot") ||
          (evt.target.id == "k_a") ||
          (evt.target.id == "k_e") ||
          (evt.target.id == "k_i") ||
          (evt.target.id == "k_o") ||
          (evt.target.id == "k_u") 
        ) {
          // add an event listener to prevent the delete key to get stuck
          evt.target.onpointerleave = function() {
            clearTimeout(idTimeout);
          }

          let letter = evt.target.textContent.trim().toLowerCase();
          idTimeout = setTimeout(() => {
            this.key_pressed = true;
            this.showAditionalKeys(letter);
          },
          600);
        }
        else if (evt.target.id == "k_delete") {
          // add an event listener to prevent the delete key to get stuck
          evt.target.onpointerleave = function() {
            clearTimeout(deleteTimeout);
          }

          deleteTimeout = setInterval(() => {
            this.delete_pressed = true;
            this.delete();
          },
          200);
        }
      });

      /**
       * 
       */
      this.keyContainer.addEventListener("pointerup", (evt) => {
        if ( (evt.target != this.keyContainer) && (evt.target !=this.container) ) {
          evt.preventDefault();
          evt.stopPropagation();

          if (evt.target.id == "k_left") {
            this.display.selectionStart = this.display.selectionEnd = Math.max(0, this.display.selectionStart-1);
          }
          else if (evt.target.id == "k_right") {
            this.display.selectionStart = this.display.selectionEnd = Math.min(this.display.value.length, this.display.selectionStart+1);
          }
          else if (evt.target.id == "k_delete") {
            if (!this.delete_pressed) {
              this.delete();
            }

            clearTimeout(deleteTimeout);

            this.delete_pressed = false;
          }
          else if (evt.target.id == "k_√") {
            this.insert("√(");
          }
          else if (evt.target.id == "k_space") {
            this.insert(" ");
          }
          else if (evt.target.id == "k_esc") {
            this.close();
          }
          else if (evt.target.id == "k_shift") {
            let keys = this.keyContainer.querySelectorAll("div");
            let a_keys = this.aditionalKeys.querySelectorAll("div");
            this.shift = !this.shift;

            if (this.shift) {
              keys.forEach(k => {
                // change the letters to uppercase
                if (k.textContent.trim().length == 1) {
                  k.textContent = k.textContent.toUpperCase();
                }
                // change point to comma with shift
                if (k.getAttribute("id") == "k_point_comma") {
                  k.textContent = ",";
                }
              });

              a_keys.forEach(k => {
                k.textContent = k.textContent.toUpperCase();
              });
            }
            else {
              keys.forEach(k => {
                // change the letters to lowercase
                if (k.textContent.trim().length == 1) {
                  k.textContent = k.textContent.toLowerCase();
                }
                // change comma to point with shift
                if (k.getAttribute("id") == "k_point_comma") {
                  k.textContent = ".";
                }
              });

              a_keys.forEach(k => {
                k.textContent = k.textContent.toLowerCase();
              });
            }
          }
          else if (evt.target.id == "k_num_layout") {
            this["setLayout_" + this.layout_mode.replace("alfa", "num")]();
          }
          else if (evt.target.id == "k_alfa_layout") {
            this["setLayout_" + this.layout_mode.replace("num", "alfa")]();
          }
          else if (evt.target.id == "k_clear") {
            this.display.value = "";
          }
          else if (
            (evt.target.id == "k_op") ||
            (evt.target.id == "k_dot") ||
            (evt.target.id == "k_a") ||
            (evt.target.id == "k_e") ||
            (evt.target.id == "k_i") ||
            (evt.target.id == "k_o") ||
            (evt.target.id == "k_u") 
            ){
            clearTimeout(idTimeout);

            if (!this.key_pressed) {
              this.insert(evt.target.textContent.trim());
              this.aditionalKeys.style.display = "none";
            }
           
            this.key_pressed = false;
          }
          // enter
          else if (evt.target.id == "k_return") {
            this.onEnter();
          }
          else {
            let content = evt.target.textContent.trim();

            this.insert(content);

            this.aditionalKeys.style.display = "none";
          }
        }

        this.display.focus();
      });

      /**
       * 
       */
      this.keyContainer.addEventListener("mouseup", (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
      });


      let aditionalPointerDown = false;
      /**
       * 
       */
      this.aditionalKeys.addEventListener("pointerdown", (evt) => {
        aditionalPointerDown = true;
      });

      /**
       * 
       */
      this.aditionalKeys.addEventListener("pointerup", (evt) => {
        if (aditionalPointerDown) {
          if ( (evt.target != this.keyContainer) && (evt.target != this.container) ) {
            evt.preventDefault();
            evt.stopPropagation();

            let content = evt.target.textContent.trim();
            this.insert(content);
          }

          this.key_pressed = false;
          this.aditionalKeys.style.display = "none";
        }

        aditionalPointerDown = false;
        this.display.focus();
      });

    }

    /**
     * 
     */
    insert(text) {
      this.display.setRangeText(text);

      this.display.selectionStart += text.length;
      this.display.selectionStart = this.display.selectionEnd;
    }

    /**
     * 
     */
    delete() {
      if (this.display.selectionStart == this.display.selectionEnd) {
        this.display.selectionStart = Math.max(0, this.display.selectionStart-1);
      }
      this.display.setRangeText("");
    }

    /**
     * 
     */
    addKey(val, id, style) {
      id = (id) ? "id='" + id + "'" : "";
      style = (style) ? "style='" + style + "'" : "";
      return `<div ${id} ${style}>${val}</div>`
    }
    addKeys(keys_arr) {
      let str = "";
      keys_arr.forEach(k => {
        if (typeof(k) === "object") {
          str += this.addKey(k.val, k.id, k.style);
        }
        else {
          str += this.addKey(k);
        }
      });

      return str;
    }

    /**
     * 
     */
    showAditionalKeys(key) {
      let keys = [];
      if (key == ".") {
        keys = [",", ";", ":", "-", "_", "¿", "?", "¡", "!", "(", ")"];
      }
      else if (key == "+") {
        keys = ["-", "×", "÷", "^"];
      }
      else if (key == "a") {
        keys = ["á", "à", "ä", "â"];
      }
      else if (key == "e") {
        keys = ["é", "è", "ë", "ê"];
      }
      else if (key == "i") {
        keys = ["í", "ì", "ï", "î"];
      }
      else if (key == "o") {
        keys = ["ó", "ò", "ö", "ô"];
      }
      else if (key == "u") {
        keys = ["ú", "ù", "ü", "û"];
      }

      this.aditionalKeys.innerHTML = this.addKeys(keys);

      if (this.shift) {
        this.aditionalKeys.innerHTML = this.aditionalKeys.innerHTML.toUpperCase();
      }

      this.aditionalKeys.style.display = "flex";
      this.aditionalKeys.style.left = this.keyContainer.style.left;
      this.aditionalKeys.style.top = (parseFloat(this.keyContainer.style.top)-50) + "px";
    }

    /**
     * 
     */
    setLayout_14x1() {
      let keys = [
        1, 
        2, 
        3, 
        4, 
        5, 
        6, 
        7, 
        8, 
        9, 
        0, 
        {val:this.parent.decimal_symbol},
        "-",
        {val:"⌫", id:"k_delete"},
        {val:"↵", id:"k_return"}
      ];

      this.keyContainer.innerHTML = this.addKeys(keys);
      this.keyContainer.style.width = (margin + 14*(40+5))+"px";
    }

    /**
     * 
     */
    setLayout_7x2() {
      let keys = [
        1, 
        2, 
        3, 
        4, 
        5, 
        {val:this.parent.decimal_symbol},
        {val:"⌫", id:"k_delete"},

        6, 
        7, 
        8, 
        9, 
        0, 
        "-",
        {val:"↵", id:"k_return"}
      ];
      
      this.keyContainer.innerHTML = this.addKeys(keys);
      this.keyContainer.style.width = (margin + 7*(40+5))+"px";
    }

    /**
     * 
     */
    setLayout_10x2() {
      let keys = [
        "(",
        1, 
        2, 
        3, 
        4, 
        5, 
        "²",
        "/",
        "×",
        {val:"⌫", id:"k_delete"},

        ")",
        6, 
        7, 
        8, 
        9, 
        0,
        {val:this.parent.decimal_symbol},
        "-",
        "+",
        {val:"↵", id:"k_return"}
      ];

      this.keyContainer.innerHTML = this.addKeys(keys);
      this.keyContainer.style.width = (margin + 10*(40+5))+"px";
    }

    /**
     * 
     */
    setLayout_4x4() {
      let keys = [
        7,
        8,
        9,
        {val:"⌫", id:"k_delete"},

        4,
        5,
        6,
        "+",

        1,
        2,
        3,
        "-",

        {val:0, style:`width:${40*2+5}px;`},
        {val:this.parent.decimal_symbol},
        {val:"↵", id:"k_return"}
      ];

      this.keyContainer.innerHTML = this.addKeys(keys);
      this.keyContainer.style.width = (margin + 4*(40+5))+"px";
    }

    /**
     * 
     */
    setLayout_5x4() {
      let keys = [
        7,
        8,
        9,
        "²",
        {val:"⌫", id:"k_delete"},
        
        4,
        5,
        6,
        "/",
        "×",

        1,
        2,
        3,
        "−",
        "+",
        
        {val:0, style:`width:${40*2+5}px;`},
        ".",
        {val:"↵", id:"k_return", style:"margin-left:50px;"}
      ];

      this.keyContainer.innerHTML = this.addKeys(keys);
      this.keyContainer.style.width = (margin + 5*(40+5))+"px";
    }

    /**
     * 
     */
    setLayout_11x3() {
      let keys = [
        "q",
        "w",
        {val:"e", id:"k_e"},
        "r",
        "t",
        "y",
        {val:"u", id:"k_u"},
        {val:"i", id:"k_i"},
        {val:"o", id:"k_o"},
        "p",
        {val:"⌫", id:"k_delete"},

        {val:"a", id:"k_a"},
        "s",
        "d",
        "f",
        "g",
        "h",
        "j",
        "k",
        "l",
        "ñ",
        {val:".", id:"k_dot"},
        
        {val:"⇅", id:"k_shift"},
        "z",
        "x",
        "c",
        "v",
        "b",
        "n",
        "m",
        {val:"", id:"k_space", style:`width:${40*2+5}px;`},
        {val:"↵", id:"k_return"}
      ];

      this.keyContainer.innerHTML = this.addKeys(keys);
      this.keyContainer.style.width = (margin + 11*(40+5))+"px";
      this.shift = false;
    }

    /**
     * 
     */
     setLayout_11x4() {
      let keys = [
        1, 
        2, 
        3, 
        4, 
        5, 
        6, 
        7, 
        8, 
        9, 
        0,
        {val:"⌫", id:"k_delete"},

        "q",
        "w",
        {val:"e", id:"k_e"},
        "r",
        "t",
        "y",
        {val:"u", id:"k_u"},
        {val:"i", id:"k_i"},
        {val:"o", id:"k_o"},
        "p",
        {val:"+", id:"k_op"},

        {val:"a", id:"k_a"},
        "s",
        "d",
        "f",
        "g",
        "h",
        "j",
        "k",
        "l",
        "ñ",
        {val:".", id:"k_dot"},
        
        {val:"⇅", id:"k_shift"},
        "z",
        "x",
        "c",
        "v",
        "b",
        "n",
        "m",
        {val:"", id:"k_space", style:`width:${40*2+5}px;`},
        {val:"↵", id:"k_return"}
      ];

      this.keyContainer.innerHTML = this.addKeys(keys);
      this.keyContainer.style.width = (margin + 11*(40+5))+"px";
    }

    /**
     * 
     */
     setLayout_10x4_alfa() {
      let keys = [
        "q",
        "w",
        {val:"e", id:"k_e"},
        "r",
        "t",
        "y",
        {val:"u", id:"k_u"},
        {val:"i", id:"k_i"},
        {val:"o", id:"k_o"},
        "p",

        {val:"a", id:"k_a"},
        "s",
        "d",
        "f",
        "g",
        "h",
        "j",
        "k",
        "l",
        "ñ",

        {val:"⇅", id:"k_shift", style:`width:${40*1.5+5*0.5}px;`},
        "z",
        "x",
        "c",
        "v",
        "b",
        "n",
        "m",
        {val:"⌫", id:"k_delete", style:`width:${40*1.5+5*0.5}px;`},

        {val:"123", id:"k_num_layout", style:`width:${40*2+5}px;`},
        {val:"", id:"k_space", style:`width:${40*5+5*4}px;transform:none !important;`},
        {val:"/", id:"k_slash"},
        {val:".", id:"k_dot"},
        {val:"↵", id:"k_return"}
      ];

      this.keyContainer.innerHTML = this.addKeys(keys);
      this.keyContainer.style.width = (margin + 10*(40+5))+"px";
    }

    /**
     * 
     */
     setLayout_10x4_num() {
      let keys = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",

        "@",
        '"',
        "$",
        "_",
        "-",
        "+",
        "(",
        ")",
        "/",
        "*",

        "&",
        "|",
        "º",
        ":",
        ";",
        "¡",
        "!",
        "¿",
        "?",
        {val:"⌫", id:"k_delete"},


        {val:"ABC", id:"k_alfa_layout", style:`width:${40*2+5}px;`},
        {val:"", id:"k_space", style:`width:${40*5+5*4}px;transform:none !important;`},
        {val:",", id:"k_slash"},
        {val:".", id:"k_dot"},
        {val:"↵", id:"k_return"}
      ];

      this.keyContainer.innerHTML = this.addKeys(keys);
      this.keyContainer.style.width = (margin + 10*(40+5))+"px";
    }

    /**
     * 
     */
    showCustomKB(c_kb) {
      let divs = c_kb.querySelectorAll("div");
      let num_keys = parseInt( c_kb.getAttribute("cols") || divs.length );
      let keys = [];
      let k;
      let id;
      let size;

      for (let i=0; i<divs.length; i++) {
        k = {val: divs[i].textContent};

        id = divs[i].getAttribute("id");
        if (id) { 
          k.id = id;
        }

        size = divs[i].getAttribute("size");
        if (size) {
          k.style = `width:${40*parseInt(size) + 5*(parseInt(size)-1) }px;transform:none !important;`;
        }
        keys.push(k);
      }

      this.keyContainer.innerHTML = this.addKeys(keys);
      this.keyContainer.style.width = (margin + num_keys*(40+5))+"px";
    }

    /**
     * 
     */
    setLayout(which) {
      this.layout_mode = which;

      let c_kb = document.getElementById("kb_" + which);
      if (c_kb) {
        this.showCustomKB(c_kb);
        return;
      }

      if (which == "14x1") {
        this.setLayout_14x1();
      }
      else if (which == "7x2") {
        this.setLayout_7x2();
      }
      else if (which == "10x2") {
        this.setLayout_10x2();
      }
      else if (which == "4x4") {
        this.setLayout_4x4();
      }
      else if (which == "5x4") {
        this.setLayout_5x4();
      }
      else if (which == "11x3") {
        this.setLayout_11x3();
      }
      else if (which == "11x4") {
        this.setLayout_11x4();
      }
      else if (which == "10x4_alfa") {
        this.setLayout_10x4_alfa();
      }
      else if (which == "10x4_num") {
        this.setLayout_10x4_num();
      }
      else {
        this.setLayout_14x1();
        // this.setLayout_7x2();
        // this.setLayout_10x2();
        // this.setLayout_4x4();
        // this.setLayout_5x4();
        // this.setLayout_11x3();
        // this.setLayout_11x4();
        // this.setLayout_10x4_alfa();
        // this.setLayout_10x4_num();
      }
    }

    /**
     * 
     */
    show(ctr, layoutType, kb_x, kb_y, var_id, textfield, onlyText) {
      this.ctr = ctr;
      this.var_id = var_id;
      this.onlyText = onlyText;

      if (!this.container.parentNode) {
        this.parent.container.appendChild(this.container);
      }
      this.container.style.display = "block";

      this.setDisplay(textfield);

      this.setLayout(layoutType);

      this.keyContainer.style.left = kb_x + "px";
      this.keyContainer.style.top  = kb_y + "px";

      // hide the aditional keys
      this.aditionalKeys.style.display = "none";
    }

    /**
     * 
     */
    close() {
      this.container.style.display = "none";
    }

    /**
     * 
     */
    setDisplay(textfield) {
      let x;
      let y;
      let w;
      let h;
      let fs;

      if (textfield.type == "custom") {
        x = textfield.x;
        y = textfield.y;
        w = textfield.w;
        h = textfield.h;
        fs = textfield.fs;
      }
      else {
        let containerRect = this.container.getBoundingClientRect();
        
        let rect = textfield.getBoundingClientRect();

        x = rect.left/descartesJS.cssScale - containerRect.left/descartesJS.cssScale;
        y = rect.top/descartesJS.cssScale - containerRect.top/descartesJS.cssScale;
        w = rect.width/descartesJS.cssScale;
        h = rect.height/descartesJS.cssScale;
        fs = textfield.style.fontSize;
      }

      if (textfield.tagName.toLowerCase() == "textarea") {
        this.display.setAttribute("style", `left:${x}px;top:${y}px;width:${w}px;height:${h}px;font-size:${fs};line-height:${1.2}em;padding:5px;font:${textfield.style.font};`);
        this.newLine.style.left = (x+w-42) + "px";
        this.newLine.style.top  = (y+h-42) + "px";
        this.newLine.style.display = "block";
      }
      else {
        this.display.setAttribute("style", `left:${x}px;top:${y}px;width:${w}px;height:${h}px;font-size:${fs};line-height:${h}px;white-space:nowrap;`);
        this.newLine.style.display = "none";
      }
      this.display.value = textfield.value || "";
      this.display.focus();
      this.display.selectionStart = this.display.selectionEnd = this.display.value.length;
    }

    /**
     * 
     */
    onEnter() {
      let result = this.display.value;
      
      if (!this.onlyText) {
        let parse = this.parent.evaluator.parser.parse(result.replace(/√/g, "sqrt"));

        try {
          if (parse) {
            result = this.parent.evaluator.eval(parse);
          }
        } catch(e) {
          result = 0;
        }
      }

      if (this.ctr) {
        this.ctr.changeValue(result, true);
      }
      else {
        this.var_id = (this.var_id+"").trim();
        let indexCor = this.var_id.indexOf("[");

        // variable id
        if (indexCor == -1) {
          this.parent.evaluator.setVariable(this.var_id, result);
        }
        else {
          let indexComa = this.var_id.indexOf(",");
          let id = this.var_id.substring(0, indexCor);

          // vector id
          if (indexComa == -1) {
            this.parent.evaluator.setVector(
              id, 
              parseInt(this.var_id.substring(indexCor+1)), 
              result
            );
          }
          // matrix id
          else {
            this.parent.evaluator.setMatrix(
              id, 
              parseInt(this.var_id.substring(indexCor+1)), 
              parseInt(this.var_id.substring(indexComa+1)),
              result
            );
          }
        }
        
        // // vector o matrix id
        // if ( (this.var_id +"").match(/\[/g) ) {
        //   // matrix
        //   if ( (this.var_id +"").match(/,/g) ) {

        //   }
        //   
        //   else {

        //   }
        // }
      }
      
      this.parent.update();
      this.close();
    }
  }

  descartesJS.Keyboard = Keyboard;
  return descartesJS;
})(descartesJS || {});
