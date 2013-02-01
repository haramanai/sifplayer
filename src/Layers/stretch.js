/*
* Copyright (c) 2012 haramanai.
* stretch
* version 0.2.
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
function stretch(parent, data) {
	this.init(parent, data);
}

var p = stretch.prototype = new sifPlayer.Layer();

	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (parent, data) {
		var _set = sifPlayer.param._set;
		this.initLayer(parent, data);
		
		_set(this, 'amount', 'vector', this, data.amount);
		_set(this, 'center', 'vector', this, data.center);

			
	}

	/**
	 * Draws the layer if the origin is a vector
	 * @method draw
	 **/
	p.draw = function (track) {
		var center = this.center;
		var amount = this.amount;
		track.save();
		track.translate(center.getX(), center.getY() );
		track.scale(amount.getX(), amount.getY());
		track.translate(-center.getX(), -center.getY() );
		
	}

sifPlayer.stretch = stretch;
}());
