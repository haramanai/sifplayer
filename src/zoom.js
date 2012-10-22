/* ***
 * ZOOM LAYER
 * 
 * */
 (function() { 
	
function zoom(parent, data) {
	this.init(parent, data);
}

var p = zoom.prototype = new sifPlayer.Layer();

	p.init = function (parent, data) {
		this.initLayer(parent, data);
		this._setParam('center', this, data.center);
		this._setParam('amount', this, data.amount);
	}

	p.draw = function () {
		var ctx = this.sifobj.ctx;
		ctx.save()
		ctx.translate(this.center.x , this.center.y );
		ctx.scale(Math.exp(this.amount.value), Math.exp(this.amount.value));
		ctx.translate(-this.center.x , -this.center.y );
	}


sifPlayer.zoom = zoom;
}());
