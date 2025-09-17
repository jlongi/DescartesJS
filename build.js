const fs = require("fs");
const { exec } = require("child_process");

// directory storing the source files
let prefix = "src/"

// list of files for descartes, the order is important
let files = [
  "Babel.js",

  "utils/EmbeddedFonts.js", // [1] maybe add a parameter to omit it inclusion
  "utils/EmbeddedSymbolFont.js",

  "utils/FontUtils.js",
  "utils/Utils.js",
  "utils/FileUtils.js",
  "utils/ExpressionPatternUtils.js",
  "utils/EmbeddedImages.js",
  "utils/Color.js",
  "utils/Keyboard.js",
  "CSSrules.js",
  "math/Krypto.js",

  "animation/Animation.js",

  "actions/Message.js",
  "actions/Calculate.js",
  "actions/OpenURL.js",
  "actions/Config.js",
  "actions/Init.js",
  "actions/Clear.js",
  "actions/Animate.js",
  "actions/InitAnimation.js",
  "actions/PlayAudio.js",
  
  "auxiliaries/Auxiliary.js",
  "auxiliaries/Variable.js",
  "auxiliaries/Constant.js",
  "auxiliaries/Vector.js",
  "auxiliaries/Matrix.js",
  "auxiliaries/Function.js",
  "auxiliaries/Algorithm.js",
  "auxiliaries/Event.js",
  "auxiliaries/Library.js",

  "graphics/Graphic.js",

  // used in Macro 2D and 3D, below Graphics.js because it extends it
  "graphics/BaseMacro.js",

  "graphics/SimpleText.js",
  "graphics/Equation.js",
  "graphics/Curve.js",
  "graphics/Sequence.js",
  "graphics/Point.js",
  "graphics/Segment.js",
  "graphics/Arrow.js",
  "graphics/Polygon.js",
  "graphics/Rectangle.js",
  "graphics/Arc.js",
  "graphics/Text.js",
  "graphics/Image.js",
  "graphics/Fill.js",
  "graphics/Macro.js",

  "3D/RenderMath.js",
  "3D/3DPrimitive.js",
  "3D/3DGraphic.js",
  "3D/3DPoint.js",          
  "3D/3DSegment.js",
  "3D/3DSurface.js",
  "3D/3DPolygon.js",
  "3D/3DCurve.js",
  "3D/3DTriangle.js",
  "3D/3DFace.js",
  "3D/3DPolireg.js",
  "3D/3DText.js",
  "3D/3DMacro.js",
  "3D/3DOtherGeometry.js",

  "math/R2.js",
  "math/R2Newton.js",
  "math/Vector2D.js",

  "controls/Control.js",
  "controls/Button.js",
  "controls/Spinner.js",
  "controls/Checkbox.js",
  "controls/TextField.js",
  "controls/Menu.js",
  "controls/Scrollbar.js",
  "controls/Slider.js",
  "controls/Audio.js",
  "controls/Video.js",
  "controls/TextArea.js",
  "controls/GraphicControl.js",

  "parser/LessonParser.js",
  "parser/Node.js",
  "parser/Tokenizer.js",
  "parser/Parser.js",
  "parser/Evaluator.js",

  "graphics/TextObject.js",
  "descarTeX/DescarTeXTokenizer.js",
  "descarTeX/DescarTeXParser.js",

  "rtf/TextStyle.js",
  "rtf/TextNode.js",
  "rtf/RTFTokenizer.js",
  "rtf/RTFParser.js",

  "space/Space.js",
  "space/SpaceExternal.js",
  "space/Space2D.js",
  "space/Space3D.js",
  "space/SpaceHTML_IFrame.js",

  "DescartesLoader.js",          
  "DescartesApp.js",
  "Debug.js",
  "Main.js"
];

// date object to get the date string
const date = new Date();

// auxiliar function to add a zero at the start of a string
// used for the day and month values of the date object
function addZero(str) {
  if (str.toString().length == 1) {
    return "0" + str;
  }
  return str;
}

const dateStr = `${date.getFullYear()}-${addZero(date.getMonth()+1)}-${addZero(date.getDate())}`;

// the header of the descartes files
let head = `/**
* @preserve Joel Espinosa Longi
* jlongi@im.unam.mx
* https://github.com/jlongi/DescartesJS
* LGPL - http://www.gnu.org/licenses/lgpl.html
* ${dateStr}
*/\n\n`

let output = head;

// join the content of the files
for (let i=0, l=files.length; i<l; i++) {
  if (i !== 1) {
    output += fs.readFileSync(prefix + files[i], "utf8");
  }
}

// write the descartes.js file
fs.writeFileSync('descartes.js', output);

// call the closure compiler
exec(
  "java -jar ../compiler-latest/compiler.jar --language_in=ECMASCRIPT_2017 --js=descartes.js --js_output_file=descartesNF-min.js",
  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log("Listo");

    ////////////////////////////////////////////////////////////////////////////////////////
    output = head;

    // join the content of the files
    files.forEach((file) => {
      output += fs.readFileSync(prefix + file, "utf8");
    });

    // write the descartes.js file
    fs.writeFileSync('descartes.js', output);

    // call the closure compiler
    exec(
      "java -jar ../compiler-latest/compiler.jar --language_in=ECMASCRIPT_2017 --js=descartes.js --js_output_file=descartes-min.js",
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log("Listo");
      }
    );

  }
);

