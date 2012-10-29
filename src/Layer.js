/*
* Copyright (c) 2012 haramanai.
* Layer
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
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data that will be used
	 **/
	p.initLayer = function (parent, data) {
		if (parent.hasOwnProperty('sifPath')) {
			
			this.sifobj = parent;
		} else {
			this.parent = parent;
			this.sifobj = parent.sifobj;
		}
		this.type = data._type;
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
	 * Set the a param to the Layer and tweens it
	 * @method _setParam
	 * @param {string} param_name the name of the param that we wand to add
	 * @param {Object} param The object that we will add params
	 * @param {Object} dataIn the data for the param
	 **/	
	p._setParam = function (param_name, param, dataIn) {
		var w, tw, data;
		var param_type;
		var def;
		var sifobj = this.sifobj;



		
		/* ***
		* first we check if the data use a def
		* 
		* */
		if (!dataIn) alert(this.type + "  " + param_name);
		param_type = this._getValueType(dataIn);
		
		
		
		//Just to be sure that I haven't loose a type
		if (!param_type) { 
			alert('no param type');
			alert(JSON.stringify(dataIn));
		}
		
		//Extra work for the special types
		switch (param_type) {
			case 'greyed':				
				var param_type = dataIn.greyed._type;
				dataIn = dataIn.greyed;
				dataIn[param_type] = dataIn.link[param_type];
				delete(dataIn.link);				
				break;
				
			case 'radial_composite':
				param[param_name] = {};
				param[param_name]._type = param_type;
				param[param_name].radial_composite = {};
				// get the defs
				if (dataIn[param_type]._radius) {
					dataIn[param_type].radius = this.sifobj.sif.canvas.defs[ dataIn[param_type]._radius ];
				}
				if (dataIn[param_type]._theta) {
					dataIn[param_type].theta = this.sifobj.sif.canvas.defs[ dataIn[param_type]._theta ];
				}

				this._setParam('radius', param[param_name][param_type], dataIn[param_type].radius);
				this._setParam('theta', param[param_name][param_type], dataIn[param_type].theta);
				
				return;
				break;			
			
		}

		 
		 
		 if (dataIn._use) {
			 return this._setParam(param_name, param, sifobj.sif.canvas.defs[dataIn._use]);			 
		} else {
			data = dataIn;
		}

		
		
		
		param[param_name] = {}
		var tw_def = {paused: true, useTick: true};
		switch (param_type) {
			case 'vector':
					
				if (data.animated) {
					w = data.animated.waypoint
					param[param_name].x = w[0][param_type].x;
					param[param_name].y = w[0][param_type].y;
					tw = createjs.Tween.get(param[param_name], tw_def);
						
					if (w[0]._time !== "0s") {
							tw.to( {x: w[0][param_type].x, y: w[0][param_type].y},
								sifPlayer._secsToMillis(w[0]._time), 
								createjs.Ease.linear);
					}

							
					for (var i = 0; i < w.length - 1; i++) {
						tw.to( {x: w[i + 1][param_type].x, y: w[i + 1][param_type].y},
							sifPlayer._secsToMillis(w[i + 1]._time) - sifPlayer._secsToMillis(w[i]._time),
							createjs.Ease.linear);
					}
					sifobj.timeline.addTween(tw);
				} else {
					if (!data[param_type]) alert(JSON.stringify(data));
					if (!data[param_type]) alert(JSON.stringify(dataIn));
					param[param_name].x = data[param_type].x;
					param[param_name].y = data[param_type].y;
					
				}
				break;
					
			case 'color':
				if (data.animated) {
					w = data.animated.waypoint
					param[param_name].r = w[0][param_type].r;
					param[param_name].g = w[0][param_type].g;
					param[param_name].b = w[0][param_type].b;
					param[param_name].a = w[0][param_type].a;
					tw = createjs.Tween.get(param[param_name], tw_def);
						
					if (w[0]._time !== "0s") {
							tw.to( {r: w[0][param_type].r, g: w[0][param_type].g, b: w[0][param_type].b, a: w[0][param_type].a},
								sifPlayer._secsToMillis(w[0]._time), 
								createjs.Ease.linear);
					}

							
					for (var i = 0; i < w.length - 1; i++) {
						tw.to( {r: w[i + 1][param_type].r, g: w[i + 1][param_type].g, b: w[i + 1][param_type].b, a: w[i + 1][param_type].a},
							sifPlayer._secsToMillis(w[i + 1]._time) - sifPlayer._secsToMillis(w[i]._time),
							createjs.Ease.linear);
					}
					
					sifobj.timeline.addTween(tw);
				} else {
					param[param_name].r = data[param_type].r;
					param[param_name].g = data[param_type].g;
					param[param_name].b = data[param_type].b;
					param[param_name].a = data[param_type].a;
				}
				break;
				
				
			default: //real angle integer bool 
				if (data.animated) {
					w = data.animated.waypoint
					param[param_name].value = w[0][param_type]._value
					tw = createjs.Tween.get(param[param_name], tw_def);
						
					if (w[0]._time !== "0s") {
							tw.to( {value: w[0][param_type]._value},
								sifPlayer._secsToMillis(w[0]._time), 
								createjs.Ease.linear);
					}

							
					for (var i = 0; i < w.length - 1; i++) {
						tw.to( {value: w[i + 1][param_type]._value},
							sifPlayer._secsToMillis(w[i + 1]._time) - sifPlayer._secsToMillis(w[i]._time),
							createjs.Ease.linear);
					}
					sifobj.timeline.addTween(tw);
				} else {
					if (!data[param_type]) alert(JSON.stringify(data) + "param_type : " + param_type + ' param_name : ' + param_name + ' layer type : ' + this.type);
					param[param_name].value = data[param_type]._value;
				}
				break;
		}

	}
	
	/**
	 * Returns a string with the type of the data
	 * @method _getValueType
	 * @param {Object} data the data to check the value type
	 * @return {String} the type of the data
	 **/	
	p._getValueType = function (data) {
		if (data._type) return data._type;
		if (data._use) return 'use';
		
		if (data.animated) return data.animated._type;
		if (data.vector) return 'vector'
		if (data.integer) return 'integer'
		if (data.real) return 'real'
		if (data.bool) return 'bool'
		if (data.angle) return 'angle'
		if (data.color) return 'color'
		if (data.radial_composite) return 'radial_composite'
		if (data.greyed) return 'greyed'
		
		
	}
	
	
	/**
	 * Returns a string with the equivalent type for blend
	 * @method _getBlend
	 * @return {String} the equivalent type for blend
	 **/	
	p._getBlend = function () {
		var blend = this.blend_method.value;		
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
		var amount = this.amount.value;
		var parent = this.parent;
		if (parent) return parent._getTotalAmount() * amount;
		return amount;
	}
	




sifPlayer.Layer = Layer;
}());
