/* ***
 * TRANSLATE LAYER
 * 
 * */
 (function() { 
	
function translate(parent, data) {
	this.init(parent, data);
}

var p = translate.prototype = new sifPlayer.Layer();

	p.init = function (parent, data) {
		this.initLayer(parent, data);
		this._setParam('origin', this, data.origin);
		//check if it is radial_composite and change the draw method
		if (this.origin.radial_composite) {
			this.draw = this.drawRadial;
		}
			
	}

	p.draw = function () {
		var ctx = this.sifobj.ctx;
		ctx.save();
		ctx.translate(this.origin.x, this.origin.y);
	}
	
	p.drawRadial = function () {
		var ctx = this.sifobj.ctx;
		var a = this.origin.radial_composite.theta.value * Math.PI / 180.0;
		var x = Math.cos(a) * this.origin.radial_composite.radius.value
		var y = Math.sin(a) * this.origin.radial_composite.radius.value
		ctx.save();
		ctx.translate(x, y);
	}


sifPlayer.translate = translate;
}());
