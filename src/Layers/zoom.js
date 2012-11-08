/*
* Copyright (c) 2012 haramanai.
* zoom
* version 0.2
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
* @class zoom
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	 	
function zoom(parent, data) {
	this.init(parent, data);
}

var p = zoom.prototype = new sifPlayer.Layer();

	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (parent, data) {
		var _set = sifPlayer.param._set;
		this.initLayer(parent, data);
		
		_set(this, 'center', 'vector', this, data.center);
		_set(this, 'amount', 'real', this, data.amount);
	}

	/**
	 * Draws the layer
	 * @method draw
	 **/
	p.draw = function (ctx) {
		var zoom = Math.exp(this.amount.getValue());
		var center = this.center
		
		ctx.save()
		ctx.translate(center.getX(), center.getY() );
		ctx.scale(zoom, zoom);
		ctx.translate(-center.getX() / zoom, -center.getY() / zoom);
	}


sifPlayer.zoom = zoom;
}());
