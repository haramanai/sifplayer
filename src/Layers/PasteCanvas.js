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
	p.draw = function (ctx) {
		var zoom = Math.exp(this.zoom.getValue() );
		var layer = this.layer;
		var focus = this.focus;
		var origin = this.origin;
		
		ctx.save();
		ctx.translate(focus.getX(), focus.getY() );
		ctx.scale(zoom, zoom);
		ctx.translate(-focus.getX(), -focus.getY() );
		ctx.translate(origin.getX() / zoom, origin.getY() / zoom);

		for (var i = 0, ii = layer.length; i < ii; i++) {
			
			layer[i].draw(ctx);
		}

		ctx.restore();
	}


sifPlayer.PasteCanvas = PasteCanvas;
}());
