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
	var a = [];
	var fps = def.fps;
	var start_frame = def.start_frame;
	var end_frame = def.end_frame;
	var total_frames = end_frame - start_frame;
	
	for (var i = 0; i < total_frames; i++) {
		var canvas = document.createElement('canvas');
		canvas.height = so.height;
		canvas.width = so.width;
		var ctx = canvas.getContext('2d');
		
		//Timeline is in millisecs 
		so.tick(1000 / fps);
		so.draw(ctx);
		
		
		
		a[i] = canvas;
	}
	
	return a;
}


sifPlayer.img = img;
}());
