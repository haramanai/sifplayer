/*
* Copyright (c) 2012 haramanai.
* SifObject
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
//requires sifPlayer
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
function SifObject(xmlDoc, props) {
	if (props) {
		
		for (c in props) {
			this[c] = props[c];
		}
		
	}
	//We need this for check if it is a sifobject.
	this.sifPath = this.sifPath || '';	
	
	this.init(xmlDoc);
	this.canvas = document.createElement('canvas');

}

var p = SifObject.prototype;

// public properties:

	/**
	 * The x coords to use for drawing
	 * @property x
	 * @type Number
	 **/
	p.x = 0;
	
	/**
	 * The y coords to use for drawing
	 * @property y
	 * @type Number
	 **/
	p.y = 0;
	
	/**
	 * The width to by the drawn sif
	 * @property width
	 * @type Number
	 **/
	p.width = 320;
	
	/**
	 * The height to by the drawn sif
	 * @property height
	 * @type Number
	 **/
	p.height = 240;

	/**
	 * The path of the sif.xml file this is needed for the import layer
	 * it is setted to "" (empty string).
	 * If your sif.xml is in the assets you will have to pass the path
	 * for example 'assets/'
	 * @property sifPath
	 * @type String
	 **/
	p.sifPath = '';
			
	/**
	 * The timeline to use for the tweens
	 * @property timeline
	 * @type Object
	 **/
	p.timeline = null;
	
	/**
	 * Referense to the layers by desc. This is the way to connect with
	 * the sif.
	 * @property desc
	 * @type Object
	 **/
	p.desc = {};


	
	// constructor:

	/** 
	 * Initialization method.
	 * @method init
	 * @param {XmlDocument} xmlDoc The xml document that represents the synfig animation
	 **/
	 p.init = function (xmlDoc) {
		
		var data = sifPlayer._getData(xmlDoc.getElementsByTagName('canvas')[0]);
		
		this.timeline = new createjs.Timeline();
		
		this.timeline.setPaused(true);	
		this._getCanvasData(data);
		

		
	}
	
// public methods:
	/**
	 * Prepares for drawing and draws the layers of the SifObject 
	 * @method draw
	 **/	
	p.draw = function (ctx) {

		var canvas = this.sif.canvas;
		var track = canvas.track = new sifPlayer.Tracker(ctx);
		var layers = this.sif.canvas.layer;
		var bg = canvas.bgcolor;
		//Clears
		ctx.clearRect(this.x, this.y, this.width, this.height);
		
		//Clip so the drawing will fit only our SifObject space.
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.closePath();
		ctx.clip();
		
		track.save();
		
		//Set the transform to much the sif
		track.setMatrix( [this.width / (canvas.view_box[2] - canvas.view_box[0]), 0, 0,
				this.height / (canvas.view_box[3] - canvas.view_box[1]),
				this.x + this.width / 2, this.y + this.height / 2])
				
		//Draw the layers
		for (var i = 0, ii = layers.length; i < ii; i++) {
			layers[i].draw(track);
		}
		
		track.restore();
		
		//Draw the background color
		
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = 'destination-over';
		ctx.fillStyle = 'rgba(' + bg.r + ', ' + bg.g  + ', ' + bg.b  + ', ' + bg.a +')';
		ctx.fillRect(this.x, this.y, this.width, this.height);

	}

	/**
	 * 
	 * @method tick
	 * @param {Integer} delta
	 **/		
	p.tick = function (delta) {
		this.timeline.tick(delta);

		var layers = this.sif.canvas.layer;
		var position = this.timeline.position;
		for (var i = 0, ii = layers.length; i < ii; i++) {
			position = layers[i].setPosition(position);			
		}
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
		this.sif.canvas.bgcolor.a = parseFloat(_bgcolor[3]);
		this.sif.canvas.name = data.name;
		
		
		
		this.sif.canvas.defs = this._getDefs(data.defs);
		this.sif.canvas.layer = [];
		
		this.timeline.duration = this.sif.canvas.end_time;
		
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
		var def_type;
		for (name in data) {

			if (data[name].constructor != Array) {
				if (name === 'animated') {
					defs[data[name]._id]  = {};
					defs[data[name]._id].animated = data[name];
				} else {			
					defs[data[name]._id] = {};
					defs[data[name]._id][name] = data[name];
					defs[data[name]._id]._type = name;							
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

sifPlayer.SifObject = SifObject;
}());

