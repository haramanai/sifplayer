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
		var zoom = Math.exp(this.amount.value);
		
		ctx.save()
		ctx.translate(this.center.x, this.center.y);
		ctx.scale(zoom, zoom);
		ctx.translate(-this.center.x / zoom, -this.center.y / zoom);
	}


sifPlayer.zoom = zoom;
}());
