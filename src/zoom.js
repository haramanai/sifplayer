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
		this._setParam('focus', this, data.focus);
	}

	p.draw = function () {
		var ctx = this.sifobj.ctx;
		
		ctx.save()
		ctx.translate(this.center.x + this.focus.x, this.center.y + this.focus.y);
		ctx.scale(Math.exp(this.amount.value), Math.exp(this.amount.value));
		ctx.translate(-this.center.x -this.focus.x, -this.center.y - this.focus.y );
	}


sifPlayer.zoom = zoom;
}());
