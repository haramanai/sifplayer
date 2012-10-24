/* ***
 * PASTECANVAS LAYER
 * 
 * */
(function() { 

/**
* @class PasteCanvas
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	 	
function PasteCanvas(parent, data) {
	this.init(parent, data);
}

var p = PasteCanvas.prototype = new sifPlayer.Layer();
	
	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (parent, data) {
		this.initLayer(parent, data);
		this._setParam('blend_method', this, data.blend_method);
		this._setParam('origin', this, data.origin);
		this._setParam('zoom', this, data.zoom);
		this._setParam('focus', this, data.focus);

		this._getLayers(data.canvas.canvas.layer);
	}
	
	/** 
	 * Method to get the layers for the PasteCanvas.
	 * @method _getLayers
	 * @param {Object} _layer the data of the layer
	 **/	
	p._getLayers = function (_layer) {
		this.layer = [];
		for (var i = 0; i < _layer.length; i++) {
			this.layer.push( sifPlayer._getLayer( this, _layer[i] ));
		}
		
	}
	
	/**
	 * Draws the PasteCanvas
	 * @method draw
	 **/	
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
