/* ***
 * IMPORT LAYER
 * 
 * */
 (function() { 
	 
sifPlayer.import = function (parent, data) {
	this.init(parent, data);
}

var p = sifPlayer.import.prototype = new sifPlayer.Layer();

	p.init = function (parent, data) {
		this.initLayer(parent, data)
		this._setParam('tl', this, data.tl);
		this._setParam('br', this, data.br);
		this.image = new Image();
		this.image.src = this.sifobj.sifPath + data.filename.string;
		
	}

	p.draw = function () {
		var ctx = this.sifobj.ctx;
		ctx.save();
		this._drawImage();
		ctx.restore();
	}
	
	
	p._drawImage = function () {
		var ctx = this.sifobj.ctx;
		var w =  (this.br.x - this.tl.x);
		var h = (this.tl.y - this.br.y)
		var sx;
		var sy;

		
		if (w <= 0) {
			sx = -1;
			w *=-1;
		} else {
			sx = 1;
		}
		
		if (h <= 0) {
			sy = 1
			h *=-1;
		} else {
			sy = -1;
		}
		ctx.translate(this.tl.x, this.tl.y);
		ctx.scale(sx  , sy);
		ctx.drawImage(this.image, 0, 0, w, h);

	}
	


}());
