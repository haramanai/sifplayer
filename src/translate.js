/*
* Copyright (c) 2012 haramanai.
* translate
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
* @class translate
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	 	
function translate(parent, data) {
	this.init(parent, data);
}

var p = translate.prototype = new sifPlayer.Layer();

	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (parent, data) {
		this.initLayer(parent, data);
		this._setParam('origin', this, data.origin);
		//check if it is radial_composite and change the draw method
		if (this.origin.radial_composite) {
			this.draw = this.drawRadial;
		}
			
	}

	/**
	 * Draws the layer if the origin is a vector
	 * @method draw
	 **/
	p.draw = function (ctx) {
		ctx.save();
		ctx.translate(this.origin.x, this.origin.y);
	}

	/**
	 * Draws the layer if the origin is a radial_composite
	 * @method drawRadial
	 **/	
	p.drawRadial = function (ctx) {
		var a = this.origin.radial_composite.theta.value * Math.PI / 180.0;
		var x = Math.cos(a) * this.origin.radial_composite.radius.value
		var y = Math.sin(a) * this.origin.radial_composite.radius.value
		ctx.save();
		ctx.translate(x, y);
	}


sifPlayer.translate = translate;
}());
