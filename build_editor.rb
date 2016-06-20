#!/usr/bin/env ruby

require "date"

out = File.new("descartes_editor.js", "w")
prefix = "src/"
files = [ "editor/EditorGenericPanel.js",
          "editor/EditorConfigPanel.js",
          "editor/EditorSpacePanel.js",
          "editor/EditorControlPanel.js",
          "editor/EditorDefinitionPanel.js",
          "editor/EditorProgramPanel.js",
          "editor/EditorGraphicPanel.js",
          "editor/EditorGraphic3DPanel.js",
          "editor/EditorAnimationPanel.js",
          "editor/Editor.js"
        ]

# add the header to the malted-min.js file
out.write(
"/**
 * @preserve Joel Espinosa Longi
 * jlongi@im.unam.mx
 * LGPL - http://www.gnu.org/licenses/lgpl.html
 * " + Date.today.to_s() + "
 */\n\n")

# join the content of the files
files.each do |file|
  out.write(File.read(prefix + file))
end
out.close

# call the closure compiler
exec("java -jar ../compiler-latest/compiler.jar --js=descartes_editor.js --js_output_file=descartes_editor-min.js", )