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
		this._setParam('blend_method', 'integer', this, data.blend_method);
		this._setParam('origin', 'vector', this, data.origin);
		this._setParam('zoom', 'real', this, data.zoom);

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
		ctx.save();
		ctx.translate(this.origin.x, this.origin.y);
		ctx.scale(Math.exp(this.zoom.value), Math.exp(this.zoom.value));
		for (var i = 0; i < this.layer.length; i++) {
			this.layer[i].draw();
		}

		ctx.restore();
	}


sifPlayer.PasteCanvas = PasteCanvas;
}());
