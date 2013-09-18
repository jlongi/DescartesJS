#!/usr/bin/env ruby

require "date"

out = File.new("descartes.js", "w")
prefix = "src/"
files = [ "Babel.js",

          "utils/Utils.js",
          "utils/FileUtils.js",
          "utils/ExpressionPatternUtils.js",
          "utils/EmbeddedImages.js",
          "utils/Color.js",
          "CSSrules.js",
          "math/Krypto.js",

          "animation/Animation.js",

          "actions/Action.js",
          "actions/Message.js",
          "actions/Calculate.js",
          "actions/OpenURL.js",
          "actions/OpenScene.js",
          "actions/About.js",
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
          
          "graphics/Graphic.js",
          "graphics/SimpleText.js",
          "graphics/Equation.js",
          "graphics/Curve.js",
          "graphics/Sequence.js",
          "graphics/Point.js",
          "graphics/Segment.js",
          "graphics/Arrow.js",
          "graphics/Polygon.js",
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

          "3D/3DOtherGeometry.js",

          "math/R2.js",
          "math/R2Newton.js",
          "math/Vector2D.js",

          "controls/Control.js",
          "controls/Button.js",
          "controls/Spinner.js",
          "controls/TextField.js",
          "controls/Menu.js",
          "controls/Scrollbar.js",
          "controls/Audio.js",
          "controls/Video.js",
          "controls/TextArea.js",
          "controls/GraphicControl.js",

          "parser/LessonParser.js",
          "parser/Node.js",
          "parser/Tokenizer.js",
          "parser/Parser.js",
          "parser/Evaluator.js",

          "rtf/RTFNode.js",
          "rtf/RTFTokenizer.js",
          "rtf/RTFParser.js",

          "space/Space.js",
          "space/SpaceExternal.js",
          "space/Space2D.js",
          "space/Space3D.js",
          "space/SpaceAP.js",
          "space/SpaceHTML_IFrame.js",
          
          "DescartesLoader.js",          
          "DescartesApp.js",
          "Main.js"]

# add the header to the malted-min.js file
out.write(
"/**
 * @preserve Joel Espinosa Longi
 * j.longi@gmail.com
 * https://github.com/jlongi/DescartesJS
 * LGPL - http://www.gnu.org/licenses/lgpl.html
 * " + Date.today.to_s() + "
 */\n\n")

# join the content of the files
files.each do |file|
  out.write(File.read(prefix + file))
end
out.close

# call the closure compiler
exec("java -jar ../compiler-latest/compiler.jar --js=descartes.js --js_output_file=descartes-min.js", )