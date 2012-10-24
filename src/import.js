/* ***
 * IMPORT LAYER
 * 
 * */
 (function() { 


/**
* It's the import layer but it's name Imoprt cause import is reserved word
* @class Import
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	 
function Import (parent, data) {
	this.init(parent, data);
}

var p = Import.prototype = new sifPlayer.Layer();

	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (parent, data) {
		this.initLayer(parent, data)
		this._setParam('tl', this, data.tl);
		this._setParam('br', this, data.br);
		this.image = new Image();
		this.image.src = this.sifobj.sifPath + data.filename.string;
		
	}
	
// public methods:

	/**
	 * Draws the layer
	 * @method draw
	 **/	
	p.draw = function () {
		var ctx = this.sifobj.ctx;
		ctx.save();
		this._drawImage();
		ctx.restore();
	}
	
	/**
	 * Draws the image
	 * @method _drawImage
	 **/	
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
	

sifPlayer.Import = Import;
}());
