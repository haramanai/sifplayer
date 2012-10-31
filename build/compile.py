import subprocess

subprocess.call(['java', '-jar', '../tools/compiler.jar',
				'--js', '../src/sifplayer.js' ,
				'--js', '../src/Ease.js' ,
				'--js', '../src/sifobject.js' ,
				'--js', '../src/Layer.js' ,
				'--js', '../src/Layers/region.js' ,
				'--js', '../src/Layers/circle.js' ,
				'--js', '../src/Layers/import.js' ,
				'--js', '../src/Layers/linear_gradient.js' ,
				'--js', '../src/Layers/PasteCanvas.js' ,
				'--js', '../src/Layers/radial_gradient.js' ,
				'--js', '../src/Layers/restore.js' ,
				'--js', '../src/Layers/rotate.js' ,
				'--js', '../src/Layers/stretch.js' ,
				'--js', '../src/Layers/translate.js' ,
				'--js', '../src/Layers/zoom.js' ,
				'--js_output_file', '../build/sifplayer.min.js'])
