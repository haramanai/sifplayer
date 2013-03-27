/*
* Copyright (c) 2012 haramanai.
* Layer
* version 0.1.
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
* @class Layer
* @constructor
**/	
function Layer() {
}

var p = Layer.prototype;
// public properties:

	/**
	 * The parent of the layer
	 * @property parent
	 * @type Object
	 **/
	p.parent = null;
	
	/**
	 * The refernce to the SifObject that the layer is used.
	 * @property sifobj
	 * @type Object
	 **/
	p.sifobj = null;
	
	/**
	 * The refernce to the SifObject that the layer is used.
	 * @property type
	 * @type String
	 **/
	p.type = null;

	// constructor:

	/** 
	 * Initialization method.
	 * @method initLayer
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data that will be used
	 **/
	p.initLayer = function (parent, data) {

		Layer.setParent(this, parent);
		this.type = data._type;
		if (data._desc) {
			this.desc = data._desc;
			//keep refernce of the layer to the sifobj so we can reach it.
			this.sifobj.desc[this.desc] = this;
		}
		
		this.timeline = new createjs.Timeline();
		this.timeline.setPaused(true);
		
		
		

	}
	
	Layer.setParent = function (layer, parent) {
		if (parent.hasOwnProperty('sifPath')) {
			
			layer.sifobj = parent;
		} else {
			layer.parent = parent;
			layer.sifobj = parent.sifobj;
		}
	}

// public methods:

	/**
	 * Draws the Layer
	 * @method draw
	 **/		
	p.draw = function (ctx) {
		//console.log('Cant render ' + this.type + ' yet');
	}
	
	
	/**
	 * moves the time line of the layer to the position
	 * @method setPosition
	 * param {Integer}
	 **/	
	p.setPosition = function (position) {
		this.timeline.setPosition(position);
		return position;
	}
	
	
	/**
	 * Returns a string with the equivalent type for blend
	 * @method _getBlend
	 * @return {String} the equivalent type for blend
	 **/	
	p._getBlend = function () {
		var blend = this.blend_method.getValue();		
		switch (blend) {
			case 0:
				//Composite
				return 'source-over';

			case 1:
				//Straight 
				return 'copy';

			case 13:
				//Onto
				return 'source-atop';

			case 21:
				//Straight Onto
				return 'source-in';

			case 12:
				//Behind
				return 'destination-over';

			case 19:
				//Alpha Over
				return 'destination-out';
				break;
			case 14:
				//Alpha Brighter
				return 'destination-in';
				break;
				
				
			default:
				return 'source-over';
				
		}
	}
	

	
	p._getTotalAmount = function () {
		var amount = this.amount.getValue();
		var parent = this.parent;
		if (parent) return parent._getTotalAmount() * amount;
		return Math.exp(amount);
	}


sifPlayer.Layer = Layer;
}());
