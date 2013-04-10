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
	var m = 1000 / fps;
	var f = 0;
	var end_frame = Math.round(so.sif.canvas.end_time / 1000 * fps);
	var img = [];
	img.sifReady = 0;

	function render() {
		var canvas = document.createElement('canvas');
		canvas.height = so.height;
		canvas.width = so.width;
		var ctx = canvas.getContext('2d');
		
		//Timeline is in millisecs 
		
		so.setPosition(m * f);
		so.draw();
		
		ctx.drawImage(so.dCanvas, 0 , 0);
		
		img[f] = canvas;
		if (f === 0) {
			img.firstFrame = document.createElement('canvas');
			img.firstFrame.width = so.width;
			img.firstFrame.height = so.height;
			img.firstFrame.getContext('2d').drawImage( so.dCanvas,0 ,0);
		}
		f +=1;
		if (f <= end_frame) {
			img.sifReady = f / end_frame;
			
			img[0].height = 0;
			img[0].height = img.firstFrame.height;
			var cctx = img[0].getContext('2d');
			cctx.globalAlpha = f / end_frame;
			cctx.drawImage( img.firstFrame, 0, 0 );
			cctx.font="30px Arial";
			cctx.globalAlpha = 1;
			cctx.fillStyle = 'rgb(255, 255, 255)';
			cctx.strokeStyle = 'rgb(0, 0, 0)';
			cctx.textAlign = 'center';
			cctx.fillText("Rendering..",canvas.width / 2,canvas.height / 2);
			cctx.fillText(Math.round((img.sifReady * 100)) + '%',canvas.width / 2,canvas.height / 2 + 30);
			
			setTimeout(arguments.callee, 0);
		} else {
			img[0] = img.firstFrame;
		}

	}
	
	render();
	
	return img;
};

img.playSif = function (file, inCanvas, fps) {
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET",file,false);
	xmlhttp.send();
	var xmlDoc=xmlhttp.responseXML;
	
	var canvas = document.getElementById(inCanvas);
	var ctx = canvas.getContext('2d');
	//TODO: find the sifPath
	var so = new sifPlayer.SifObject(xmlDoc , {sifPath: 'assets/'});

	so.width = canvas.width;
	so.height = canvas.height;
	
	var end_frame = Math.round(so.sif.canvas.end_time / fps);
	
	var def = { sifobj: so, fps: fps, start_frame: 0, end_frame: end_frame};

	var img = sifPlayer.img.getCanvasArray(def);
	
	var pos = 0;
	
	
	
	function render () {
		canvas.height = 0;
		canvas.height = so.height;
		canvas.width = so.width;
		if (img.sifReady < 1) {
			ctx.drawImage(img[0], 0, 0);
			pos = 0;
		} else {
		
			//console.log(pos);
			ctx.drawImage( img[pos], 0, 0 );
		}
		
		if (pos < img.length - 1) {
				pos += 1;
			} else {
				pos = 0;
		}
			
	}


	setInterval(render, 1000 / fps);

	
};




sifPlayer.img = img;
}());
