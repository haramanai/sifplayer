/* ***
 * ROTATE LAYER
 * 
 * */
 (function() { 
	
function rotate(parent, data) {
	this.init(parent, data);
}

var p = rotate.prototype = new sifPlayer.Layer();

	p.init = function (parent, data) {
		this.initLayer(parent, data);
		this._setParam('origin', this, data.origin);
		this._setParam('amount', this, data.amount);
	}

	p.draw = function () {
		var ctx = this.sifobj.ctx;
		ctx.save();
		ctx.translate(this.origin.x, this.origin.y);
		ctx.rotate(this.amount.value * Math.PI/180);
		ctx.translate(-this.origin.x, -this.origin.y);
	}


sifPlayer.rotate = rotate;
}());
