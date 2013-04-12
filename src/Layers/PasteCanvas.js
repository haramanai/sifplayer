/*
* Copyright (c) 2012 haramanai.
* PasteCanvas
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/
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
		var _set = sifPlayer.param._set;
		this.initLayer(parent, data);
		_set(this, 'amount', 'real', this, data.amount);
		_set(this, 'blend_method', 'integer', this, data.blend_method);
		_set(this, 'origin', 'vector', this, data.origin);
		_set(this, 'zoom', 'real', this, data.zoom);
		_set(this, 'focus', 'vector', this, data.focus);

		this._getLayers(data.canvas.canvas.layer);
		
		this.dCanvas = document.createElement('canvas');
		this.tracker = new sifPlayer.Tracker(this.dCanvas.getContext('2d'));
	}
	
	/** 
	 * Method to get the layers for the PasteCanvas.
	 * @method _getLayers
	 * @param {Object} _layer the data of the layer
	 **/	
	p._getLayers = function (_layer) {
		this.layer = [];
		if (_layer) {
			for (var i = 0; i < _layer.length; i++) {
				this.layer.push( sifPlayer._getLayer( this, _layer[i] ));
			}
		}
		
	}
	
	/**
	 * Draws the PasteCanvas
	 * @method draw
	 **/	
	p.draw = function (track) {
		var zoom = Math.exp(this.zoom.getValue() );
		var layer = this.layer;
		var focus = this.focus;
		var origin = this.origin;
		this.dCanvas.height = 0;
		this.dCanvas.height = this.sifobj.height;
		this.dCanvas.width = this.sifobj.width;
		
		this.tracker.setMatrix(track.matrix);
		this.tracker.translate(focus.getX(), focus.getY() );
		this.tracker.scale(zoom, zoom);
		this.tracker.translate(-focus.getX(), -focus.getY() );
		this.tracker.translate(origin.getX() / zoom, origin.getY() / zoom);

		
		
		for (var i = 0, ii = layer.length; i < ii; i++) {
			if (layer[i].active) {
				layer[i].draw(this.tracker);
			}
		}
		//If not track ctx then this is the sifObjects fake pastecanvas
		if (track.ctx) {
			track.save();
			track.setMatrix( [1, 0, 0, 1, 0, 0] );
			track.ctx.globalAlpha = this.amount.getValue();
			track.ctx.globalCompositeOperation = this._getBlend();
			track.ctx.drawImage(this.tracker.ctx.canvas, 0, 0);
			track.restore();
		}


	}


	/**
	 * moves the time line of the layer to the position
	 * @method setPosition
	 * param {Integer}
	 **/		
	p.setPosition = function (position) {		
		var layers = this.layer;
		this.timeline.setPosition(position);
		for (var i = 0, ii = layers.length; i < ii; i++) {
			position = layers[i].setPosition(position);		
		}
		return position;
	}

	
	PasteCanvas.makeFake = function (parent) {
		//An Empty PasteCanvas to be used for the sifobject's root layers
		//This way we can link functionallity of PasteCanvas with the sifobject
		var data = {"_type":"PasteCanvas","_active":true,"_version":0.1,"z_depth":{"_name":"z_depth","real":{"_value":0}},"amount":{"_name":"amount","real":{"_value":1}},"blend_method":{"_name":"blend_method","integer":{"_value":0}},"origin":{"_name":"origin","vector":{"x":0,"y":0}},"canvas":{"_name":"canvas","canvas":{}},"zoom":{"_name":"zoom","real":{"_value":0}},"time_offset":{"_name":"time_offset","time":{"_value":"0s"}},"children_lock":{"_name":"children_lock","bool":{"_value":false,"_static":true}},"focus":{"_name":"focus","vector":{"x":0,"y":0}},"outline_grow":{"_name":"outline_grow","real":{"_value":0}}};
		return new sifPlayer[data._type](parent, data);
	}
	
	
	


sifPlayer.PasteCanvas = PasteCanvas;
}());
