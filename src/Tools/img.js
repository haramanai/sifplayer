/*
* Copyright (c) 2012 haramanai.
* img for sifPlayer
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/
//requires sifPlayer
(function() { 
var img = {};

img.getCanvasArray = function (def) {
	var so = def.sifobj;
	var fps = def.fps;
	var f = 0;
	var end_frame = Math.round(so.sif.canvas.end_time / fps);
	var img = [];
	img.sifReady = 0;

	function render() {
		var canvas = document.createElement('canvas');
		canvas.height = so.height;
		canvas.width = so.width;
		var ctx = canvas.getContext('2d');
		
		//Timeline is in millisecs 
		so.setPosition(fps * f);
		so.draw();
		
		ctx.drawImage(so.dCanvas, 0 , 0);
		
		
		img[f] = canvas;
		if (f === 0) {
			img.firstFrame = document.createElement('canvas');
			img.firstFrame.width = so.width;
			img.firstFrame.height = so.height;
			var cctx = img.firstFrame.getContext('2d');
			cctx.drawImage( so.dCanvas,0 ,0);
		}
		f +=1;
		if (f <= end_frame) {
			img.sifReady = f / end_frame;		
			setTimeout(arguments.callee, 0);
		}

	}
	
	render();
	
	return img;
}


sifPlayer.img = img;
}());
