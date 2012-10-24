/* ***
 * ROTATE LAYER
 * 
 * */
 (function() { 

/**
* @class rotate
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	 	
function rotate(parent, data) {
	this.init(parent, data);
}

var p = rotate.prototype = new sifPlayer.Layer();

	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (parent, data) {
		this.initLayer(parent, data);
		this._setParam('origin', this, data.origin);
		this._setParam('amount', this, data.amount);
	}

	/**
	 * Draws the layer
	 * @method draw
	 **/
	p.draw = function () {
		var ctx = this.sifobj.ctx;
		ctx.save();
		ctx.translate(this.origin.x, this.origin.y);
		ctx.rotate(this.amount.value * Math.PI/180);
		ctx.translate(-this.origin.x, -this.origin.y);
	}


sifPlayer.rotate = rotate;
}());
