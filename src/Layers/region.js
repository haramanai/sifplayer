/*
* Copyright (c) 2012 haramanai.
* region
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
* @class region
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	
function region(parent, data) {
	this.init(parent, data);
}

var p = region.prototype = new sifPlayer.Layer();
	
	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (parent, data) {
		var _set = sifPlayer.param._set;
		this.initLayer(parent, data);
		_set(this, 'blend_method', 'integer', this, data.blend_method);
		_set(this, 'amount', 'real', this, data.amount);
		_set(this, 'origin', 'vector', this, data.origin);
		_set(this, 'color', 'color', this, data.color);
		this._getBline(data.bline);
			
	}

// public methods:

	/**
	 * Draws the region
	 * @method draw
	 * @param {CanvasRenderingContext2D} } ctx The canvas 2D context object to draw into.
	 **/	
	p.draw = function (ctx) {
		
		var e1,e2;
		
		
		//var color = layer.color.color;

		ctx.fillStyle = 'rgba('+ Math.round(this.color.r * 256) + ', ' + Math.round(this.color.g * 256)  + ', ' + Math.round(this.color.b * 256)  + ', ' + this.color.a  + ')';
		
		ctx.globalAlpha = this._getTotalAmount();
		ctx.save();
		ctx.translate(this.origin.getX(), this.origin.getY() );
		ctx.globalCompositeOperation = this._getBlend();

		ctx.beginPath();
		e1 = this.bline.entry[0].composite.getPoint();
		ctx.moveTo(e1.getX(), e1.getY() );
		
		for (var i = 0; i < this.bline.entry.length - 1; i++) {
			
			e1 = this.bline.entry[i].composite;
			e2 = this.bline.entry[i + 1].composite;
			

			if (e1.split.getValue()) {
				this._bezierPart( ctx, e1.getPoint(), e2.getPoint(), e1.getT2(), e2.getT1());
			} else {
				this._bezierPart( ctx, e1.getPoint(), e2.getPoint(), e1.getT1(), e2.getT1());

			}

		}
		if (this.bline.loop) {
			e1 = this.bline.entry[ this.bline.entry.length - 1 ].composite;
			e2 = this.bline.entry[0].composite;
			
			if (e1.split.getValue()) {
				this._bezierPart( ctx, e1.getPoint(), e2.getPoint(), e1.getT2(), e2.getT1());
			} else {
				this._bezierPart( ctx, e1.getPoint(), e2.getPoint(), e1.getT1(), e2.getT1());
			}
		}

		ctx.closePath();
		ctx.fill();
		ctx.restore();

	}


	/**
	 * Gets the bline data
	 * @method _getBline
	 **/		
	p._getBline = function (data) {
		var _set = sifPlayer.param._set;
		this.bline = {};
		this.bline.entry = [];
		var w, tw;

		//LOOP
		this.bline.loop = data.bline._loop;
		
		for (var i = 0, ii = data.bline.entry.length; i < ii; i++) {
			
			var e = {};
			//if (data.bline.entry[i].composite.point.composite) alert('in');
			_set(this, 'composite', 'composite', e, data.bline.entry[i]);
			this.bline.entry.push(e.composite);
			
		}
		//alert(JSON.stringify(this.bline.entry[2]));
	}


	/**
	 * draws a part of the bezier curve
	 * @method _bezierPart
	 * @param {CanvasRenderingContext2D} } ctx The canvas 2D context object to draw into.
	 * @param {Object} _p1 The first point of the curve
	 * @param {Object} _p2 The second point of the curve
	 * @param {Object} _t1 The T1 of the curve
	 * @param {Object} _t2 The T2 of the curve
	 **/		
	p._bezierPart = function (ctx, _p1, _p2, _t1, _t2) {
		
		var _cp1 = {};
		var _cp2 = {};

		_cp1.x = _t1.x + _p1.getX();
		_cp1.y = _t1.y + _p1.getY();

		_cp2.x = -_t2.x + _p2.getX();
		_cp2.y = -_t2.y + _p2.getY();

		ctx.bezierCurveTo(_cp1.x, _cp1.y, _cp2.x, _cp2.y, _p2.getX(), _p2.getY());
	
	}
	


sifPlayer.region = region;
}());
