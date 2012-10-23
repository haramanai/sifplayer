

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

