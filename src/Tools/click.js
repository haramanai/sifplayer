 (function() { 

var click = {};

	click.mouse_x = 0;
	click.mouse_y = 0;
	
	click.mouse_down = false;
	click.mouse_pressed = false;
	click.mouse_released = false;
	

	click.hitTest = function(x, y, PasteCanvas) {
		
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext('2d');
		canvas.height = canvas.width = 1;
		ctx.setTransform(1,  0, 0, 1, -x, -y);
		ctx.drawImage(PasteCanvas.dCanvas,0,0);
		

		var hit = ctx.getImageData(0, 0, 1, 1).data[3] > 1;
		
		return hit;
	}



sifPlayer.click = click;
}());
