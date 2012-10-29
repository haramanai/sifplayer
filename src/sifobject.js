/**
* @preserve Copyright (c) 2012 haramanai.
* sifPlayer
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
// namespace:
this.sifPlayer = this.sifPlayer||{};
(function() { 

/**
* @class SifObject
* @constructor
* @param {XmlDocument} xmlDoc The xml document that represents the synfig animation
* @param {Number} x The x of the SifObject
* @param {Number} y The y of the SifObject
* @param {Number} width The width of the SifObject
* @param {Number} height The height of the SifObject
* @param {String} sifPath The path of the sif.xml this is needed for import layer
**/
function SifObject(xmlDoc, x, y, width, height, sifPath) {
	if (!sifPath) sifPath = "";
	this.sifPath = sifPath;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.init(xmlDoc);

}

var p = SifObject.prototype;

// public properties:

	/**
	 * The x coords to use for drawing
	 * @property x
	 * @type Number
	 **/
	p.x = null;
	
	/**
	 * The y coords to use for drawing
	 * @property y
	 * @type Number
	 **/
	p.y = null;
	
	/**
	 * The width to by the drawn sif
	 * @property width
	 * @type Number
	 **/
	p.width = null;
	
	/**
	 * The height to by the drawn sif
	 * @property height
	 * @type Number
	 **/
	p.width = null;

	/**
	 * The path of the sif.xml file this is needed for the import layer
	 * it is setted to "" (empty string).
	 * If your sif.xml is in the assets you will have to pass the path
	 * for example 'assets/'
	 * @property sifPath
	 * @type String
	 **/
	p.sifPath = "";
			
	/**
	 * The timeline to use for the tweens
	 * @property timeline
	 * @type Object
	 **/
	p.timeline = null;


	// constructor:

	/** 
	 * Initialization method.
	 * @method init
	 * @param {XmlDocument} xmlDoc The xml document that represents the synfig animation
	 **/
	 p.init = function (xmlDoc) {
		
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
		
		this.timeline = new createjs.Timeline();
		
		this.timeline.setPaused(true);
		this._getCanvasData(data);
		this.timeline.duration = this.sif.canvas.end_time;
		this.timeline.gotoAndPlay(this.sif.canvas.start_time);

		
		
	}
	
// public methods:
	/**
	 * Prepares for drawing and draws the layers of the SifObject 
	 * @method draw
	 **/	
	p.draw = function (ctx) {

		var canvas = this.sif.canvas;
		var layer = this.sif.canvas.layer;
		ctx.save();
		ctx.setTransform( this.width / (canvas.view_box[2] - canvas.view_box[0]), 0, 0,
				this.height / (canvas.view_box[3] - canvas.view_box[1]),
				this.x + this.width / 2, this.y + this.height / 2)
		for (var i = 0; i < layer.length; i++) {
			layer[i].draw(ctx);
		}
		
			
		ctx.restore();
		console.log(createjs.Ticker. getMeasuredFPS());

	}



// private methods:

	/**
	 * @method _getCanvasData
	 * @protected
	 * @param {Object} data the data to get the contruct the SifObject
	 **/
	p._getCanvasData = function (data) {

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
		this.sif.canvas.begin_time = sifPlayer._canvasTimeToMillis(data['_begin-time'], this.sif.canvas.fps);
		this.sif.canvas.end_time = sifPlayer._canvasTimeToMillis(data['_end-time'], this.sif.canvas.fps);
		var _bgcolor = data._bgcolor.split(" ");
		this.sif.canvas.bgcolor = {};
		//convert the color to 256 to much html5 ... I think so...
		this.sif.canvas.bgcolor.r = Math.round(parseFloat(_bgcolor[0]) * 256);
		this.sif.canvas.bgcolor.g = Math.round(parseFloat(_bgcolor[1]) * 256);
		this.sif.canvas.bgcolor.b = Math.round(parseFloat(_bgcolor[2]) * 256);
		this.sif.canvas.bgcolor.a = Math.round(parseFloat(_bgcolor[3]) * 256);
		this.sif.canvas.name = data.name;
		
		
		
		this.sif.canvas.defs = this._getDefs(data.defs);
		this.sif.canvas.layer = [];
		
		
		//Get the layers
		for (var i = 0; i < data.layer.length; i++) {			
			this.sif.canvas.layer.push( sifPlayer._getLayer(this, data.layer[i]) );
		}

		


	}
	
	/**
	 * @method _getDefs
	 * @protected
	 * @param {Object} data the data to get defs for SifObj
	 * @return {Object} the defs for the SifObject
	 **/
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

	

	
//Common functions

	/**
	 * Gets the time in seconds and returns it to milliseconds
	 * 
	 * @function sifPlayer._secsToMillis
	 * @param {String} _s The time in seconds
	 * @return {Number} the millisecs
	 **/	
	sifPlayer._secsToMillis = function (_s) {
			return parseFloat(_s.replace("s",""))*1000;
	}
	
	/**
	 * Gets the time in seconds and returns it to milliseconds
	 * 
	 * @function sifPlayer._canvasTimeToMillis
	 * @param {String} _s The time in seconds
	 * @param {Integer} fps The frames per seccond
	 * @return {Number} the millisecs
	 **/	
	sifPlayer._canvasTimeToMillis = function (_s, fps) {
		var millis = 0;
		var t;
		if (_s.search('s') > 0){
			t = _s.split('s');
			if (t.length) {
				millis += parseFloat(t[0]) *1000;
				if (t[1].search('f') > 0) {
					millis += parseFloat(t[1].replace('f','')) * 1000/fps;
				}
			} else {
				return parseFloat(t) *1000;
			}
		} else {
			millis += parseFloat(_s.replace('f','')) * 1000/fps;
		}
		return millis;
	}
	
	
	/**
	 * Gets the time in seconds and returns it to milliseconds
	 * @function sifPlayer._getLayer
	 * @param {Object} parent The parent of new Layer
	 * @param {Object} data the data for the layer
	 * @return {Object} the a sif layer
	 **/	
	sifPlayer._getLayer = function (parent, data) {
		if (sifPlayer[data._type]) return new sifPlayer[data._type](parent, data);
		if (data._type === 'import') return new sifPlayer.Import(parent, data);
		// Not supported LAYER
		console.log("EERRROOR  "  + data._type + " layer it's not supported");
		var bad_layer = new sifPlayer.Layer();
		bad_layer.initLayer(parent, data);
		return bad_layer;
	}
	

	
	/**
	 * Gets the time in seconds and returns it to milliseconds
	 * 
	 * @function sifPlayer._toSifValue
	 * @param {String} value The value to be converted to a sif value
	 * @return {Number || String} the sif value
	 **/		
	sifPlayer._toSifValue = function ( value ) {
		var num = Number(value);
		if (!isNaN(num)) return num;
		if (value === 'true') return true;
		if (value === 'false') return false;
		//if a value or vector is using a def the first letter is ':' so we check to remove it.
		if (value[0] === ":") return value.substr(1);
		return value;
	}	
sifPlayer.SifObject = SifObject;
}());

