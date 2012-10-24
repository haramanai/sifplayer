/* ***
 * REGION LAYER
 * 
 * */
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
		
		this.initLayer(parent, data);
		this._setParam('blend_method',this, data.blend_method);
		this._setParam('amount',this, data.amount);
		this._setParam('origin', this, data.origin);
		this._setParam('color', this, data.color);
		this._getBline(data.bline);
		
	}

// public methods:

	/**
	 * Draws the region
	 * @method draw
	 **/	
	p.draw = function () {
		
		var ctx = this.sifobj.ctx;
		var e1,e2;

		
		//var color = layer.color.color;

		ctx.fillStyle = 'rgba('+ Math.round(this.color.r * 256) + ', ' + Math.round(this.color.g * 256)  + ', ' + Math.round(this.color.b * 256)  + ', ' + Math.round(this.color.a * 256)  + ')';
		
		ctx.globalAlpha = this.amount.value;
		ctx.save();
		ctx.translate(this.origin.x, this.origin.y);
		ctx.globalCompositeOperation = this._getBlend();

		ctx.beginPath();
		
		ctx.moveTo(this.bline.entry[0].point.x, this.bline.entry[0].point.y);

		for (var i = 0; i < this.bline.entry.length - 1; i++) {
			
			e1 = this.bline.entry[i];
			e2 = this.bline.entry[i + 1];
			if (e1.split.value) {
				this._bezierPart( e1.point, e2.point, e1.t2, e2.t1);
			} else {
				this._bezierPart( e1.point, e2.point, e1.t1, e2.t1);

			}

		}
		if (this.bline.loop) {
			
			e1 = this.bline.entry[ this.bline.entry.length - 1 ];
			e2 = this.bline.entry[0];
			
			if (e1.split.value) {
				this._bezierPart( e1.point, e2.point, e1.t2, e2.t1);
			} else {
				this._bezierPart( e1.point, e2.point, e1.t1, e2.t1);
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
		this.bline = {};
		this.bline.entry = [];
		var e, w, tw;

		//LOOP
		this.bline.loop = data.bline._loop;
		
		for (var i = 0; i < data.bline.entry.length; i++) {
			e = {};

			
			this.bline.entry.push(e)
			entry = this.bline.entry[i];
			entry.point = {};
			entry.t1 = {};
			entry.t2 = {};
			
			
			////
			/*Here we must check first if the entry uses a def
			 * */
			 if (data.bline.entry[i]._use) {
				 data.bline.entry[i] = this.sifobj.sif.canvas.defs[ data.bline.entry[i]._use ]
				 
			}
			 
			 
			 
			//SPLIT
			this._setParam('split' , entry, data.bline.entry[i].composite.split)
			
			//POINT
			this._setParam('point', entry, data.bline.entry[i].composite.point);
			
			//T1
			if (!data.bline.entry[i].composite.t1.scale) {
				this._setParam('theta', entry.t1, data.bline.entry[i].composite.t1.radial_composite.theta);
				this._setParam('radius', entry.t1, data.bline.entry[i].composite.t1.radial_composite.radius);
			} else {
				this._setParam('theta', entry.t1, data.bline.entry[i].composite.t1.scale.link.radial_composite.theta);
				this._setParam('radius', entry.t1, data.bline.entry[i].composite.t1.scale.link.radial_composite.radius);
				this._setParam('scalar', entry.t1, data.bline.entry[i].composite.t1.scale.scalar);
	
			}
			
			//T2
			if (!data.bline.entry[i].composite.t2.scale) {
				this._setParam('theta', entry.t2, data.bline.entry[i].composite.t2.radial_composite.theta);
				this._setParam('radius', entry.t2, data.bline.entry[i].composite.t2.radial_composite.radius);
			} else {
				this._setParam('theta', entry.t2, data.bline.entry[i].composite.t2.scale.link.radial_composite.theta);
				this._setParam('radius', entry.t2, data.bline.entry[i].composite.t2.scale.link.radial_composite.radius);
				this._setParam('scalar', entry.t2, data.bline.entry[i].composite.t2.scale.scalar);
				//alert(JSON.stringify(entry));
	
			}

			
		}
	}


	/**
	 * draws a part of the bezier curve
	 * @method _bezierPart
	 * @param {Object} _p1 The first point of the curve
	 * @param {Object} _p2 The second point of the curve
	 * @param {Object} _t1 The T1 of the curve
	 * @param {Object} _t2 The T2 of the curve
	 **/		
	p._bezierPart = function (_p1, _p2, _t1, _t2) {
		var _cp1 = {};
		var _cp2 = {};
		var _a;
		if (_t1.scalar) { //here was the scalar now it must get outside of the function

			_a = (_t1.theta.value - 180) * Math.PI / 180.0;
		} else {
			_a = _t1.theta.value * Math.PI / 180.0;
		}
		_cp1.x = (Math.cos(_a) * _t1.radius.value) / 3 + _p1.x
		_cp1.y = (Math.sin(_a) * _t1.radius.value) / 3 + _p1.y
		if (_t2.scalar) {
			_a = (_t2.theta.value - 180) * Math.PI / 180.0;
		} else {
			_a = _t2.theta.value * Math.PI / 180.0;
		}
		_cp2.x = -(Math.cos(_a) * _t2.radius.value) / 3 + _p2.x
		_cp2.y = -(Math.sin(_a) * _t2.radius.value) / 3 + _p2.y
			
		this.sifobj.ctx.bezierCurveTo(_cp1.x, _cp1.y, _cp2.x, _cp2.y, _p2.x, _p2.y);
	
	}
	


sifPlayer.region = region;
}());
