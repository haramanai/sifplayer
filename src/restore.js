/* ***
 * RESTORE LAYER
 * 
 * */
 (function() { 
	
function restore(parent, data) {
	this.init(parent, data);
}

var p = restore.prototype = new sifPlayer.Layer();

	p.init = function (parent, data) {
		this.initLayer(parent, data);
	};
	
	p.draw = function () {
		var ctx = this.sifobj.ctx;
		ctx.restore();
	}


sifPlayer.restore = restore;
}());

