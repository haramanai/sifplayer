
(function() { 
	var sifPlayer = {

	_secsToMillis: function(_s) {
			return parseFloat(_s.replace("s",""))*1000;
	},
	
	_getLayer: function (parent, data) {
		if (sifPlayer[data._type]) return new sifPlayer[data._type](parent, data);
		// Not supported LAYER
		console.log("EERRROOR  "  + data._type + 'not supported');
		var bad_layer = new sifPlayer.Layer();
		bad_layer.initLayer(parent, data);
		return bad_layer;
	},
	

	
	
	_toSifValue: function( value ) {
		var num = Number(value);
		if (!isNaN(num)) return num;
		if (value === 'true') return true;
		if (value === 'false') return false;
		//if a value or vector is using a def the first letter is ':' so we check to remove it.
		if (value[0] === ":") return value.substr(1);
		return value;
	},

	
}
	
	

window.sifPlayer = sifPlayer;
}());


// namespace:
// Requires sifPlayer

(function() { 

/*
 * SifObject
 * 
 * */


function SifObject(xmlDoc, _ctx, x, y, width, height, sifPath) {
	if (!sifPath) sifPath = "";
	this.sifPath = sifPath;
	this.x = x;
	this.y = y;
	this.w = width;
	this.h = height;
	this.ctx = _ctx;
	
	this._init(xmlDoc);

}

var p = SifObject.prototype;

	p._init = function (xmlDoc) {
		
		//I am puting the function getData inside the init
		function getData (node) {

			var	data = {};

			// append a value
			function Add(name, value) {

				if (data[name]) {
					if (data[name].constructor != Array) {
						data[name] = [data[name]];
					}
					data[name][data[name].length] = value;
				}
				else {
					data[name] = value;
				}
			};
			
			// element attributes
			var c, cn, cname;
			for (c = 0; cn = node.attributes[c]; c++) {
				Add("_" + cn.name, sifPlayer._toSifValue(cn.value));
			}
			
			// child elements
			for (c = 0; cn = node.childNodes[c]; c++) {
				if (cn.nodeType == 1) {
					cname = cn.nodeName;
					if (cn.childNodes.length == 1 && cn.firstChild.nodeType == 3) {
						// text value
						Add(cn.nodeName, sifPlayer._toSifValue(cn.firstChild.nodeValue));
					}
					else {
						// A switch to help catch the changes we wand
						
						switch (cname) {
							
								
								
							case 'param':
								/* To get the params out the param array 
								*and set the name as propertie we will get
								* the ugly: 
								* bline.bline.entry[0].point.vector.x
								* canvas.canvas.layer for the PasteCanvas
								* color.color.a
								* and some more but it's the best solution for
								* a clean json 
								* */
								data[cn.getAttribute('name')] = getData(cn);
								break;
								
								
							case 'layer':
								/* layer and waypoint must always be array
								 * 
								 * */
								
								if (typeof data[cname] == 'undefined') data[cname] = [];
								var layer_type = cn.getAttribute('type');

								/*		Switch Layer Type
								*	Push a fake layer of type restore and unshift the layer
								* 	This is needed for rendering.
								* */
								switch (layer_type) {
									case 'rotate': case 'translate': case 'zoom':
										Add('layer', {_type: 'restore'});
										data.layer.unshift(getData(cn));

										
										break

									default:
										Add(cn.nodeName, getData(cn))
									
									
										break;
											
									
										
										
								} //Switch Layer Type Over
								break; //layer
									
							case 'waypoint':
								/*  To be sure that it will be an array
								 * */
									if (typeof data[cname] == 'undefined') data[cname] = [];
									//No break here just wanted to be sure that it will be an array.
										
							default:
								Add(cname, getData(cn))
								break
						} //Switch (cn.nodeName) END
					}
				}
			}

			return data;

		}
		
		var data = getData(xmlDoc.getElementsByTagName('canvas')[0]);
		//alert(JSON.stringify(data));
		
		this.timeline = new createjs.Timeline();
		this._getCanvasData(data);
		this.timeline.gotoAndPlay(0);
		
		
	}

	p._getCanvasData = function (data) {
		//var xmlDoc = sifJson._loadXML(_file);

		//console.log(JSON.stringify(data));
		this.sif = {};
		this.sif.canvas = {};
		this.sif.canvas.version = data._version;
		this.sif.canvas.width = data._width;
		this.sif.canvas.height = data._height;
		var _vb = data['_view-box'].split(" ");
		this.sif.canvas.view_box = [parseFloat(_vb[0]), parseFloat(_vb[1]), parseFloat(_vb[2]), parseFloat(_vb[3])];
		this.sif.canvas.antialias = data._antialias;
		this.sif.canvas.fps = data._fps;
		//convert the time to millis cause it's more common for computers...
		this.sif.canvas.begin_time = sifPlayer._secsToMillis(data['_begin-time']);
		this.sif.canvas.end_time = sifPlayer._secsToMillis(data['_end-time']);
		var _bgcolor = data._bgcolor.split(" ");
		this.sif.canvas.bgcolor = {};
		//convert the color to 256 to much html5 ... I think so...
		this.sif.canvas.bgcolor.r = Math.round(parseFloat(_bgcolor[0]) * 256);
		this.sif.canvas.bgcolor.g = Math.round(parseFloat(_bgcolor[1]) * 256);
		this.sif.canvas.bgcolor.b = Math.round(parseFloat(_bgcolor[2]) * 256);
		this.sif.canvas.bgcolor.a = Math.round(parseFloat(_bgcolor[3]) * 256);
		this.sif.canvas.name = data.name;
		
		
		
		this.sif.canvas.defs = this._getDefs(data.defs);
		//alert(JSON.stringify(this.sif.canvas.defs));
		this.sif.canvas.layer = [];
		//Get the layers

		for (var i = 0; i < data.layer.length; i++) {			
			this.sif.canvas.layer.push( sifPlayer._getLayer(this, data.layer[i]) );
		}

		


	}
	
	p._getDefs = function (data) {
		var defs = {};
		for (name in data) {
			if (data[name].constructor != Array) {
				if (name === 'animated') {
					defs[data[name]._id]  = {};
					defs[data[name]._id].animated = data[name];
				} else {				
					defs[data._id] = data[name];
					defs[data._id]._type = name;							
				}
			} else {
				
					
				for (var j = 0; j < data[name].length; j++) {
					if (name === 'animated') {
						defs[data[name][j]._id] = {};
						defs[data[name][j]._id].animated = data[name][j];
					} else {
						defs[data[name][j]._id] = {};
						defs[data[name][j]._id][name] = data[name][j];
						defs[data[name][j]._id]._type = name
					}
				}			
			}
		}
		//alert(JSON.stringify(defs));
		return defs;
	}

	
	p.draw = function () {

		var ctx = this.ctx;
		var canvas = this.sif.canvas;
		var layer = this.sif.canvas.layer;
		ctx.save();
		ctx.setTransform( this.w / (canvas.view_box[2] - canvas.view_box[0]), 0, 0,
				this.h / (canvas.view_box[3] - canvas.view_box[1]),
				this.w / 2, this.h / 2)
		for (var i = 0; i < layer.length; i++) {
			layer[i].draw();
		}
		
			
		ctx.restore();
		

	}
		
	
sifPlayer.SifObject = SifObject;
}());

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
		this.type = data._type;
	}
	
	p.draw = function () {
		//console.log('Cant render ' + this.type + ' yet');
	}
	
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
					if (!data[param_type]) alert(JSON.stringify(data) + "param_type : " + param_type + ' param_name : ' + param_name + ' layer type : ' + this.type);
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



sifPlayer.Layer = Layer;
}());
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
/* ***
 * REGION LAYER
 * 
 * */
(function() { 
	
function region(parent, data) {
	this.init(parent, data);
}

var p = region.prototype = new sifPlayer.Layer();


	p.init = function (parent, data) {
		this.initLayer(parent, data);
		this._setParam('blend_method',this, data.blend_method);
		this._setParam('amount',this, data.amount);
		this._setParam('origin', this, data.origin);
		this._setParam('color', this, data.color);
		this._getBline(data.bline);
		
	}

	
	p.draw = function () {
		var ctx = this.sifobj.ctx;
		var e1,e2;
		
		//var color = layer.color.color;

		ctx.fillStyle = 'rgba('+ Math.round(this.color.r * 256) + ', ' + Math.round(this.color.g * 256)  + ', ' + Math.round(this.color.b * 256)  + ', ' + Math.round(this.color.a * 256)  + ')';
		
		ctx.globalAlpha = this.amount.value;
		ctx.save();
		ctx.translate(this.origin.x, this.origin.y);
		ctx.globalCompositeOperation = this._getBlend();

		ctx.beginPath();
		
		ctx.moveTo(this.bline.entry[0].point.x, this.bline.entry[0].point.y);

		for (var i = 0; i < this.bline.entry.length - 1; i++) {
			
			e1 = this.bline.entry[i];
			e2 = this.bline.entry[i + 1];
			if (e1.split.value) {
				this._bezierPart( e1.point, e2.point, e1.t2, e2.t1);
			} else {
				this._bezierPart( e1.point, e2.point, e1.t1, e2.t1);

			}

		}
		if (this.bline.loop) {
			
			e1 = this.bline.entry[ this.bline.entry.length - 1 ];
			e2 = this.bline.entry[0];
			
			if (e1.split.value) {
				this._bezierPart( e1.point, e2.point, e1.t2, e2.t1);
			} else {
				this._bezierPart( e1.point, e2.point, e1.t1, e2.t1);
			}
		}

		ctx.closePath();
		ctx.fill();
		ctx.restore();

	}
	
	p._getBline = function (data) {
		this.bline = {};
		this.bline.entry = [];
		var e, w, tw;

		//LOOP
		this.bline.loop = data.bline._loop;
		
		for (var i = 0; i < data.bline.entry.length; i++) {
			e = {};

			
			this.bline.entry.push(e)
			entry = this.bline.entry[i];
			entry.point = {};
			entry.t1 = {};
			entry.t2 = {};
			
			
			////
			/*Here we must check first if the entry uses a def
			 * */
			 if (data.bline.entry[i]._use) {
				 data.bline.entry[i] = this.sifobj.sif.canvas.defs[ data.bline.entry[i]._use ]
				 
			}
			 
			 
			 
			//SPLIT
			this._setParam('split' , entry, data.bline.entry[i].composite.split)
			
			//POINT
			this._setParam('point', entry, data.bline.entry[i].composite.point);
			
			//T1
			if (!data.bline.entry[i].composite.t1.scale) {
				this._setParam('theta', entry.t1, data.bline.entry[i].composite.t1.radial_composite.theta);
				this._setParam('radius', entry.t1, data.bline.entry[i].composite.t1.radial_composite.radius);
			} else {
				this._setParam('theta', entry.t1, data.bline.entry[i].composite.t1.scale.link.radial_composite.theta);
				this._setParam('radius', entry.t1, data.bline.entry[i].composite.t1.scale.link.radial_composite.radius);
				this._setParam('scalar', entry.t1, data.bline.entry[i].composite.t1.scale.scalar);
	
			}
			
			//T2
			if (!data.bline.entry[i].composite.t2.scale) {
				this._setParam('theta', entry.t2, data.bline.entry[i].composite.t2.radial_composite.theta);
				this._setParam('radius', entry.t2, data.bline.entry[i].composite.t2.radial_composite.radius);
			} else {
				this._setParam('theta', entry.t2, data.bline.entry[i].composite.t2.scale.link.radial_composite.theta);
				this._setParam('radius', entry.t2, data.bline.entry[i].composite.t2.scale.link.radial_composite.radius);
				this._setParam('scalar', entry.t2, data.bline.entry[i].composite.t2.scale.scalar);
				//alert(JSON.stringify(entry));
	
			}

			
		}
	}
	
	p._bezierPart = function (_p1, _p2, _t1, _t2) {
		var _cp1 = {};
		var _cp2 = {};
		var _a;
		if (_t1.scalar) { //here was the scalar now it must get outside of the function

			_a = (_t1.theta.value - 180) * Math.PI / 180.0;
		} else {
			_a = _t1.theta.value * Math.PI / 180.0;
		}
		_cp1.x = (Math.cos(_a) * _t1.radius.value) / 3 + _p1.x
		_cp1.y = (Math.sin(_a) * _t1.radius.value) / 3 + _p1.y
		if (_t2.scalar) {
			_a = (_t2.theta.value - 180) * Math.PI / 180.0;
		} else {
			_a = _t2.theta.value * Math.PI / 180.0;
		}
		_cp2.x = -(Math.cos(_a) * _t2.radius.value) / 3 + _p2.x
		_cp2.y = -(Math.sin(_a) * _t2.radius.value) / 3 + _p2.y
			
		this.sifobj.ctx.bezierCurveTo(_cp1.x, _cp1.y, _cp2.x, _cp2.y, _p2.x, _p2.y);
	
	}
	


sifPlayer.region = region;
}());
/* ***
 * IMPORT LAYER
 * 
 * */
 (function() { 
	 
sifPlayer.import = function (parent, data) {
	this.init(parent, data);
}

var p = sifPlayer.import.prototype = new sifPlayer.Layer();

	p.init = function (parent, data) {
		this.initLayer(parent, data)
		this._setParam('tl', this, data.tl);
		this._setParam('br', this, data.br);
		this.image = new Image();
		this.image.src = this.sifobj.sifPath + data.filename.string;
		
	}

	p.draw = function () {
		var ctx = this.sifobj.ctx;
		ctx.save();
		this._drawImage();
		ctx.restore();
	}
	
	
	p._drawImage = function () {
		var ctx = this.sifobj.ctx;
		var w =  (this.br.x - this.tl.x);
		var h = (this.tl.y - this.br.y)
		var sx;
		var sy;

		
		if (w <= 0) {
			sx = -1;
			w *=-1;
		} else {
			sx = 1;
		}
		
		if (h <= 0) {
			sy = 1
			h *=-1;
		} else {
			sy = -1;
		}
		ctx.translate(this.tl.x, this.tl.y);
		ctx.scale(sx  , sy);
		ctx.drawImage(this.image, 0, 0, w, h);

	}
	


}());
/* ***
 * ROTATE LAYER
 * 
 * */
 (function() { 
	
function rotate(parent, data) {
	this.init(parent, data);
}

var p = rotate.prototype = new sifPlayer.Layer();

	p.init = function (parent, data) {
		this.initLayer(parent, data);
		this._setParam('origin', this, data.origin);
		this._setParam('amount', this, data.amount);
	}

	p.draw = function () {
		var ctx = this.sifobj.ctx;
		ctx.save();
		ctx.translate(this.origin.x, this.origin.y);
		ctx.rotate(this.amount.value * Math.PI/180);
		ctx.translate(-this.origin.x, -this.origin.y);
	}


sifPlayer.rotate = rotate;
}());
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
		//check if it is radial_composite and change the draw method
		if (this.origin.radial_composite) {
			this.draw = this.drawRadial;
		}
			
	}

	p.draw = function () {
		var ctx = this.sifobj.ctx;
		ctx.save();
		ctx.translate(this.origin.x, this.origin.y);
	}
	
	p.drawRadial = function () {
		var ctx = this.sifobj.ctx;
		var a = this.origin.radial_composite.theta.value * Math.PI / 180.0;
		var x = Math.cos(a) * this.origin.radial_composite.radius.value
		var y = Math.sin(a) * this.origin.radial_composite.radius.value
		ctx.save();
		ctx.translate(x, y);
	}


sifPlayer.translate = translate;
}());
/* ***
 * ZOOM LAYER
 * 
 * */
 (function() { 
	
function zoom(parent, data) {
	this.init(parent, data);
}

var p = zoom.prototype = new sifPlayer.Layer();

	p.init = function (parent, data) {
		this.initLayer(parent, data);
		this._setParam('center', this, data.center);
		this._setParam('amount', this, data.amount);
	}

	p.draw = function () {
		var ctx = this.sifobj.ctx;
		var zoom = Math.exp(this.amount.value);
		
		ctx.save()
		ctx.translate(this.center.x, this.center.y);
		ctx.scale(zoom, zoom);
		ctx.translate(-this.center.x / zoom, -this.center.y / zoom);
	}


sifPlayer.zoom = zoom;
}());
/* ***
 * IMPORT LAYER
 * 
 * */
 (function() { 
	 
sifPlayer.import = function (parent, data) {
	this.init(parent, data);
}

var p = sifPlayer.import.prototype = new sifPlayer.Layer();

	p.init = function (parent, data) {
		this.initLayer(parent, data)
		this._setParam('tl', this, data.tl);
		this._setParam('br', this, data.br);
		this.image = new Image();
		this.image.src = this.sifobj.sifPath + data.filename.string;
		
	}

	p.draw = function () {
		var ctx = this.sifobj.ctx;
		ctx.save();
		this._drawImage();
		ctx.restore();
	}
	
	
	p._drawImage = function () {
		var ctx = this.sifobj.ctx;
		var w =  (this.br.x - this.tl.x);
		var h = (this.tl.y - this.br.y)
		var sx;
		var sy;

		
		if (w <= 0) {
			sx = -1;
			w *=-1;
		} else {
			sx = 1;
		}
		
		if (h <= 0) {
			sy = 1
			h *=-1;
		} else {
			sy = -1;
		}
		ctx.translate(this.tl.x, this.tl.y);
		ctx.scale(sx  , sy);
		ctx.drawImage(this.image, 0, 0, w, h);

	}
	


}());
