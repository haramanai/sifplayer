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
	}

	p.draw = function () {
		var ctx = this.sifobj.ctx;
		ctx.save();
		ctx.translate(this.origin.x, this.origin.y);
	}


sifPlayer.translate = translate;
}());
