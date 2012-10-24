/* ***
 * ZOOM LAYER
 * 
 * */
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
	p.draw = function () {
		var ctx = this.sifobj.ctx;
		var zoom = Math.exp(this.amount.value);
		
		ctx.save()
		ctx.translate(this.center.x, this.center.y);
		ctx.scale(zoom, zoom);
		ctx.translate(-this.center.x / zoom, -this.center.y / zoom);
	}


sifPlayer.zoom = zoom;
}());
