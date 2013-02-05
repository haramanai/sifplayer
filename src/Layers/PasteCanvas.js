/*
* Copyright (c) 2012 haramanai.
* PasteCanvas
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
* @class PasteCanvas
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	 	
function PasteCanvas(parent, data) {
	this.init(parent, data);
}

var p = PasteCanvas.prototype = new sifPlayer.Layer();
	
	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (parent, data) {
		var _set = sifPlayer.param._set;
		this.initLayer(parent, data);
		_set(this, 'amount', 'real', this, data.amount);
		_set(this, 'blend_method', 'integer', this, data.blend_method);
		_set(this, 'origin', 'vector', this, data.origin);
		_set(this, 'zoom', 'real', this, data.zoom);
		_set(this, 'focus', 'vector', this, data.focus);

		this._getLayers(data.canvas.canvas.layer);
		
		this.dCanvas = document.createElement('canvas');
	}
	
	/** 
	 * Method to get the layers for the PasteCanvas.
	 * @method _getLayers
	 * @param {Object} _layer the data of the layer
	 **/	
	p._getLayers = function (_layer) {
		this.layer = [];
		for (var i = 0; i < _layer.length; i++) {
			this.layer.push( sifPlayer._getLayer( this, _layer[i] ));
		}
		
	}
	
	/**
	 * Draws the PasteCanvas
	 * @method draw
	 **/	
	p.draw = function (track) {
		var zoom = Math.exp(this.zoom.getValue() );
		var layer = this.layer;
		var focus = this.focus;
		var origin = this.origin;
		this.dCanvas.height = 0;
		this.dCanvas.height = this.sifobj.height;
		this.dCanvas.width = this.sifobj.width;
		var nt = new sifPlayer.Tracker(this.dCanvas.getContext('2d'));


		track.save();
		track.translate(focus.getX(), focus.getY() );
		track.scale(zoom, zoom);
		track.translate(-focus.getX(), -focus.getY() );
		track.translate(origin.getX() / zoom, origin.getY() / zoom);

		nt.setMatrix(track.getMatrix());
		
		for (var i = 0, ii = layer.length; i < ii; i++) {
			
			layer[i].draw(nt);
		}
		track.setMatrix( [1, 0, 0, 1, 0, 0] );
		track.ctx.globalCompositeOperation = this._getBlend();
		track.ctx.globalAlpha = this._getTotalAmount();
		track.ctx.drawImage(nt.ctx.canvas, 0, 0);
		console.log(this.origin.getY());
		track.restore();


	}


sifPlayer.PasteCanvas = PasteCanvas;
}());
