/*
* Copyright (c) 2012 haramanai.
* import
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
	p.draw = function (ctx) {
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
