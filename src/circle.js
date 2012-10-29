/*
* Copyright (c) 2012 haramanai.
* rotate
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
* @class circle
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	 	
function circle(parent, data) {
	this.init(parent, data);
}

var p = circle.prototype = new sifPlayer.Layer();

	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (parent, data) {
		
		this.initLayer(parent, data);
		this._setParam('amount', this, data.amount);
		this._setParam('origin', this, data.origin);	
		this._setParam('radius', this, data.radius);
		this._setParam('color', this, data.color);
		this._setParam('blend_method',this, data.blend_method);
		
	}

	/**
	 * Draws the layer
	 * @method draw
	 **/
	p.draw = function (ctx) {
		var origin = this.origin;
		ctx.fillStyle = 'rgba('+ Math.round(this.color.r * 256) + ', ' + Math.round(this.color.g * 256)  + ', ' + Math.round(this.color.b * 256)  + ', ' + Math.round(this.color.a * 256)  + ')';		
		ctx.globalAlpha = this._getTotalAmount();
		ctx.globalCompositeOperation = this._getBlend();
		
		ctx.beginPath();
		ctx.arc(origin.x, origin.y, this.radius.value, 0 , 2 * Math.PI, false);
		ctx.fill();
		ctx.closePath();
	}


sifPlayer.circle = circle;
}());
