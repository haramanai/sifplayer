/* ***
 * LAYER
 * 
 * */
 (function() { 
	
function Layer() {
}

var p = Layer.prototype;
	
	p.initLayer = function (parent, data) {
		if (parent.sifPath) {
			this.sifobj = parent;
		} else {
			this.parent = parent;
			this.sifobj = parent.sifobj;
		}
	}
	
	p._setParam = function (param_name, param_type, param, dataIn) {
		var w, tw, data;
		var sifobj = this.sifobj;

		/* ***
		 * first we check if the data use a def
		 * 
		 * */
		 if (dataIn._use) {
			 data = {};
			 data = sifobj.sif.canvas.defs[dataIn._use];
		} else {
			data = dataIn;
		}
		
		param[param_name] = {}
		switch (param_type) {
			case 'vector':
					
				if (data.animated) {
					w = data.animated.waypoint
					param[param_name].x = w[0][param_type].x;
					param[param_name].y = w[0][param_type].y;
					tw = createjs.Tween.get(param[param_name]);
						
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
					tw = createjs.Tween.get(param[param_name]);
						
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
					tw = createjs.Tween.get(param[param_name]);
						
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
					if (!data[param_type]) alert(JSON.stringify(data));
					param[param_name].value = data[param_type]._value;
				}
				break;
		}

	}
	
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

				//Alpha Brighter
				return 'destination-in';
				break;
				
				
			default:
				return 'source-over';
				
		}
	}



sifPlayer.Layer = Layer;
}());
