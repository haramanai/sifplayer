/*
* Copyright (c) 2012 haramanai.
* zoom
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
		this.initLayer(parent, data);
		this._setParam('center', this, data.center);
		this._setParam('amount', this, data.amount);
	}

	/**
	 * Draws the layer
	 * @method draw
	 **/
	p.draw = function (ctx) {
		var zoom = Math.exp(this.amount.value);
		
		ctx.save()
		ctx.translate(this.center.x, this.center.y);
		ctx.scale(zoom, zoom);
		ctx.translate(-this.center.x / zoom, -this.center.y / zoom);
	}


sifPlayer.zoom = zoom;
}());