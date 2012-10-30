/*
* Copyright (c) 2012 haramanai.
* radial_gradient
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
function radial_gradient(parent, data) {
	this.init(parent, data);
}

var p = radial_gradient.prototype = new sifPlayer.Layer();

	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (parent, data) {
		
		this.initLayer(parent, data);
		this._setParam('amount', this, data.amount);
		this._setParam('blend_method', this, data.blend_method);
		this._setParam('center', this, data.center);	
		this._setParam('radius', this, data.radius);
		this._setParam('gradient', this, data.gradient);
	}

	/**
	 * Draws the layer
	 * @method draw
	 **/
	p.draw = function (ctx) {
		var x = this.center.x;
		var y = this.center.y;
		var grd = ctx.createRadialGradient(x, y,0, x, y, this.radius.value);
		var color = this.gradient.color;
		var vb = this.sifobj.sif.canvas.view_box;

		for (var i = 0, ii = color.length; i < ii; i++) {
			grd.addColorStop(color[i].pos, 'rgba('+ Math.round(color[i].r * 256) + ', ' + Math.round(color[i].g * 256)  + ', ' + Math.round(color[i].b * 256)  + ', ' + color[i].a  + ')');
		}
		
		ctx.globalAlpha = this._getTotalAmount();
		ctx.globalCompositeOperation = this._getBlend();		
		ctx.fillStyle = grd;
		//ctx.fillRect(vb[0] , -vb[1], vb[2] * 2, vb[2] * 2);
		//We render more than we need but it's the only solution I found
		// looks like that we don't get lower framerate by the size of the 
		// rect. So it's ok to do it like this.
		ctx.fillRect(-1000, -1000, 2000 , 2000);


	}


sifPlayer.radial_gradient = radial_gradient;
}());
