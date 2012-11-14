/*
* Copyright (c) 2012 haramanai.
* param
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
this.sifPlayer = this.sifPlayer || {};
this.sifPlayer.param = this.sifPlayer.param||{};
 (function() { 
var param = sifPlayer.param;

	/**
	 * VECTOR
	 * @function param._getVector
	 * @param {Object} layer the layer that contains the param
	 * @param {String} param_name the name of the param
	 * @param {String} wanted_type the type that the param wands to be
	 * @param {Object} that the holder of the values
	 * @param {Object} data the data that holds the values.
	 **/		
	param._set = function(layer, param_name, wanted_type, that, data) { 
		var param_type;
		
		if (!data) alert(JSON.stringify(data) + this.type + "  " + param_name);
		if (data.animated) param_type = data.animated._type;
		if (data._type) param_type = data._type;
		
		if (data._use) {
			param._set(layer, param_name, wanted_type, that, layer.sifobj.sif.canvas.defs[data._use]);
		}		//VECTOR
		else if (data.vector || param_type === 'vector') {
			param.vector._get( layer, param_name, wanted_type, that, data );
		}		//INTEGER
		else if (data.integer || param_type === 'integer') {
			param._getNumber( layer, param_name, wanted_type, that, data, 'integer' );
		}
		else if (data.real || param_type === 'real') {
			param._getNumber( layer, param_name, wanted_type, that, data, 'real' );
		}
		else if (data.angle || param_type === 'angle') {
			param._getNumber( layer, param_name, wanted_type, that, data, 'angle' );
		}
		else if (data.bool || param_type === 'bool') {
			param.bool._get( layer, param_name, wanted_type, that, data);
		}

		else if (data.color || param_type === 'color') {
			param._getColor( layer, param_name, wanted_type, that, data );
		}
		else if (data.gradient || param_type === 'gradient') {
			param._getGradient( layer, param_name, wanted_type, that, data );
		}		//COMPOSITE
		else if (data.composite) {
			param.composite._get(layer, param_name, wanted_type, that, data);
		}		// CONVERT TYPES
		else if (data.scale || param_type === 'scale') {
			that[param_name] = {};
			that[param_name].scale = {};
			param._set(layer, 'link', data.scale._type, that[param_name].scale, data.scale.link);
			param._set(layer, 'scalar', 'real', that[param_name].scale, data.scale.scalar);
			param.convert._set( layer, that[param_name], wanted_type, 'scale');		
		}
		else if (data.radial_composite || param_type === 'radial_composite') {
			param._getRadial_composite( layer, param_name, wanted_type, that, data );
		}
		else if (data.add) {
			param_type = data.add._type;
			that[param_name] = {};
			that[param_name].add = {};
			param._set(layer, 'lhs', param_type, that[param_name].add, data.add.lhs);
			param._set(layer, 'rhs', param_type, that[param_name].add, data.add.rhs);
			param._set(layer, 'scalar', 'real', that[param_name].add, data.add.scalar);
				
			param.convert._set( layer, that[param_name], wanted_type, 'add');
			
		}		//AND
		else if (data.and) {
			param_type = data.and._type;
			
			that[param_name] = {};
			that[param_name].and = {};
			param._set(layer, 'link1', param_type, that[param_name].and, data.and.link1);
			param._set(layer, 'link2', param_type, that[param_name].and, data.and.link2);
				
			param.convert._set( layer, that[param_name], wanted_type, 'and');
			
		}		//ATAN2
		else if (data.atan2) {
			param_type = data.atan2._type;
			that[param_name] = {};
			that[param_name].atan2 = {};
			if (data.atan2._x) data.atan2.x = layer.sifobj.sif.canvas.defs[data._x];
			if (data.atan2._y) data.atan2.y = layer.sifobj.sif.canvas.defs[data._y];
			param._set(layer, 'x', 'real', that[param_name].atan2, data.atan2.x);
			param._set(layer, 'y', 'real', that[param_name].atan2, data.atan2.y);
			param.convert._set( layer, that[param_name], wanted_type, 'atan2');
			
		}		//COS
		else if (data.cos) {
			param_type = data.cos._type;
			that[param_name] = {};
			that[param_name].cos = {};
			if (data.cos._angle) data.cos._angle = layer.sifobj.sif.canvas.defs[data._angle];
			if (data.cos._amp) data.cos.amp = layer.sifobj.sif.canvas.defs[data._amp];
			param._set(layer, 'angle', 'angle', that[param_name].cos, data.cos.angle);
			param._set(layer, 'amp', 'real', that[param_name].cos, data.cos.amp);
			param.convert._set( layer, that[param_name], wanted_type, 'cos');
			
		}
		else if (data.greyed) {
			param._set(layer, param_name, wanted_type, that, data.greyed.link);
		}
		else {
			alert('no param type');
			alert(JSON.stringify(data) + ' layer type : ' + layer.type);
		}

	}

//CONVERTED 	

	

	/**
	 * animates the angle real integer and checks for convert 
	 * @function param._getNumber
	 * @param {Object} layer the layer that contains the param
	 * @param {String} param_name the name of the param
	 * @param {String} wanted_type the type that the param wands to be
	 * @param {Object} that the holder of the values
	 * @param {Object} data the data that holds the values.
	 * @param {Object} param_type the type of the data param.
	 **/	
	param._getNumber = function (layer, param_name, wanted_type, that, data, param_type) {	
		var w, tw, time;
		var tw_def = {paused: true, useTick: true};
		var timeline = layer.sifobj.timeline;
		var ease;
		that[param_name] = {};
		
		
		
		if (data.animated) {

			w = data.animated.waypoint
			that[param_name].value = w[0][param_type]._value

			tw = createjs.Tween.get(that[param_name], tw_def);


			if (w[0]._time !== "0s") {
				ease = sifPlayer._getEase(w[0]._before);
				time = sifPlayer._secsToMillis(w[0]._time);
				tw.to( {value: w[0][param_type]._value},
					time, ease);
			}

					
			for (var i = 0; i < w.length - 1; i++) {
				ease = sifPlayer._getEase(w[i + 1]._before);
				time = sifPlayer._secsToMillis(w[i + 1]._time) - sifPlayer._secsToMillis(w[i]._time);						
				if (w[i][param_type]._value !== w[i + 1][param_type]._value) {
					tw.to( {value: w[i + 1][param_type]._value},
						time, ease );
				} else {
					tw.wait(time);
				}
			}
			

			
			
			timeline.addTween(tw);


			param.convert._set( layer, that[param_name], wanted_type, param_type);
		} else {
			if (!data[param_type]) alert(JSON.stringify(data) + "param_type : " + param_type + ' param_name : ' + param_name + ' layer type : ' + this.type);
			that[param_name].value = data[param_type]._value;
			param.convert._set( layer, that[param_name], wanted_type, param_type);
		}
	}
	
		
	/**
	 * RADIAL COMPOSITE
	 * @function param._getRadial_composite
	 * @param {Object} layer the layer that contains the param
	 * @param {String} param_name the name of the param
	 * @param {String} wanted_type the type that the param wands to be
	 * @param {Object} that the holder of the values
	 * @param {Object} data the data that holds the values.
	 * @param {Object} param_type the type of the data param.
	 **/
	param._getRadial_composite = function (layer, param_name, wanted_type, that, data) {	
		param_type = 'radial_composite';
		that[param_name] = {};
		that[param_name]._type = param_type;
		that[param_name].radial_composite = {};
		// get the defs
		if (data[param_type]._radius) {
			data[param_type].radius = layer.sifobj.sif.canvas.defs[ data[param_type]._radius ];
		}
		if (data[param_type]._theta) {
			data[param_type].theta = layer.sifobj.sif.canvas.defs[ data[param_type]._theta ];
		}
		
		param._set(layer, 'radius', 'real', that[param_name][param_type], data[param_type].radius);
		param._set(layer,'theta', 'angle', that[param_name][param_type], data[param_type].theta);
		param.convert._set( layer, that[param_name], wanted_type, param_type);
	}
	
//UNCONVERTED	
	/**
	 * COLOR
	 * @function param._getColor
	 * @param {Object} layer the layer that contains the param
	 * @param {String} param_name the name of the param
	 * @param {String} wanted_type the type that the param wands to be
	 * @param {Object} that the holder of the values
	 * @param {Object} data the data that holds the values.
	 * @param {Object} param_type the type of the data param.
	 **/
	param._getColor = function (layer, param_name, wanted_type, that, data) {
		//NOT CONVERTED.
		var param_type = 'color';
		var tw_def = {paused: true, useTick: true};
		var timeline = layer.sifobj.timeline;
		that[param_name] = {};
		that[param_name].animated = true;
		
		if (data.animated) {
			w = data.animated.waypoint
			that[param_name].r = w[0][param_type].r;
			that[param_name].g = w[0][param_type].g;
			that[param_name].b = w[0][param_type].b;
			that[param_name].a = w[0][param_type].a;
			tw = createjs.Tween.get(that[param_name], tw_def);
				
			if (w[0]._time !== "0s") {
					tw.to( {r: w[0][param_type].r, g: w[0][param_type].g, b: w[0][param_type].b, a: w[0][param_type].a},
						sifPlayer._secsToMillis(w[0]._time), 
						sifPlayer._getEase(w[0]._before) );
			}

					
			for (var i = 0; i < w.length - 1; i++) {
				tw.to( {r: w[i + 1][param_type].r, g: w[i + 1][param_type].g, b: w[i + 1][param_type].b, a: w[i + 1][param_type].a},
					sifPlayer._secsToMillis(w[i + 1]._time) - sifPlayer._secsToMillis(w[i]._time),
					sifPlayer._getEase(w[i + 1]._before) );
			}
			
			timeline.addTween(tw);
		} else {
			that[param_name].r = data[param_type].r;
			that[param_name].g = data[param_type].g;
			that[param_name].b = data[param_type].b;
			that[param_name].a = data[param_type].a;
		}
	}
	
	/**
	 * GRADIENT
	 * @function param._getGradient
	 * @param {Object} layer the layer that contains the param
	 * @param {String} param_name the name of the param
	 * @param {String} wanted_type the type that the param wands to be
	 * @param {Object} that the holder of the values
	 * @param {Object} data the data that holds the values.
	 * @param {Object} param_type the type of the data param.
	 **/
	param._getGradient = function (layer, param_name, wanted_type, that, data, param_type) {
		//NOT CONVERTED.
		var param_type = 'gradient';
		var tw_def = {paused: true, useTick: true};
		var timeline = layer.sifobj.timeline;
		that[param_name] = {};
		
		var pcolor,dcolor;
		if (data.animated) {
			w = data.animated.waypoint
			that[param_type] = {};
			that[param_type].color = [];
			for (var i = 0, ii = w[0].gradient.color.length; i < ii; i++) {
				that[param_type].color.push({});
				pcolor = that[param_type].color[i];
				dcolor = w[0].gradient.color[i];
				pcolor.pos = dcolor._pos;
				pcolor.r = dcolor.r;
				pcolor.g = dcolor.g;
				pcolor.b = dcolor.b;
				pcolor.a = dcolor.a;
				
				tw = createjs.Tween.get(pcolor, tw_def);
				if (w[0]._time !== "0s") {
					tw.to( {pos: dcolor._pos, r: dcolor.r, g: dcolor.g, b: dcolor.b, a: dcolor.a},
						sifPlayer._secsToMillis(w[0]._time), 
						sifPlayer._getEase(w[0]._before) );
					
				}
				for (var j = 0, jj = w.length - 1; j < jj; j++) {
					dcolor = w[j + 1].gradient.color[i];
					tw.to( {pos: dcolor._pos, r: dcolor.r, g: dcolor.g, b: dcolor.b, a: dcolor.a},
						sifPlayer._secsToMillis(w[j + 1]._time) - sifPlayer._secsToMillis(w[j]._time), 
						sifPlayer._getEase(w[j + 1]._before) );
					
				}
				timeline.addTween(tw);
			}
						
		} else {
			that[param_type] = {};
			that[param_type].color = [];
			for (var i = 0, ii = data[param_type].color.length; i < ii; i++) {
				that[param_type].color.push({});
				pcolor = that[param_type].color[i];
				dcolor = data[param_type].color[i];
				pcolor.pos = dcolor._pos;
				pcolor.r = dcolor.r;
				pcolor.g = dcolor.g;
				pcolor.b = dcolor.b;
				pcolor.a = dcolor.a;		
			}									
		}
	}
	
		
}());
