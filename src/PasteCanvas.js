/* ***
 * PASTECANVAS LAYER
 * 
 * */
(function() { 
	
function PasteCanvas(parent, data) {
	this.init(parent, data);
}

var p = PasteCanvas.prototype = new sifPlayer.Layer();
	
	p.init = function (parent, data) {
		this.initLayer(parent, data);
		this._setParam('blend_method', this, data.blend_method);
		this._setParam('origin', this, data.origin);
		this._setParam('zoom', this, data.zoom);
		this._setParam('focus', this, data.focus);

		this._getLayers(data.canvas.canvas.layer);
	}
	
	p._getLayers = function (_layer) {
		this.layer = [];
		for (var i = 0; i < _layer.length; i++) {
			this.layer.push( sifPlayer._getLayer( this, _layer[i] ));
		}
		
	}
	
	p.draw = function () {
		var ctx = this.sifobj.ctx;
		var zoom = Math.exp(this.zoom.value);
		ctx.save();
		ctx.translate(this.focus.x, this.focus.y);
		ctx.scale(zoom, zoom);
		ctx.translate(-this.focus.x, -this.focus.y);
		ctx.translate(this.origin.x / zoom, this.origin.y / zoom);

		for (var i = 0; i < this.layer.length; i++) {
			
			this.layer[i].draw();
		}

		ctx.restore();
	}


sifPlayer.PasteCanvas = PasteCanvas;
}());
