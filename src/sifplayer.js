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

(function() { 	
	sifPlayer = {};
//Common functions
	/**
	 * Gets the time in seconds and returns it to milliseconds
	 * 
	 * @function sifPlayer._secsToMillis
	 * @param {Element} node XML node element to be parsed
	 * @return {Object} the data that can be used by the SifObject
	 **/	
	sifPlayer._getData = function (node) {

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
							data[cn.getAttribute('name')] = sifPlayer._getData(cn);
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
								case 'rotate': case 'translate': case 'zoom': case 'stretch':
									Add('layer', {_type: 'restore'});
									data.layer.unshift(sifPlayer._getData(cn));

									
									break

								default:
									Add(cn.nodeName, sifPlayer._getData(cn))
								
								
									break;
										
								
									
									
							} //Switch Layer Type Over
							break; //layer
								
						case 'waypoint':
							/*  To be sure that it will be an array
							 * */
								if (typeof data[cname] == 'undefined') data[cname] = [];
								//No break here just wanted to be sure that it will be an array.
									
						default:
							Add(cname, sifPlayer._getData(cn))
							break
					} //Switch (cn.nodeName) END
				}
			}
		}

		return data;

	}


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
	 * @param {String} _s The time in seconds and frames
	 * @param {Integer} fps The frames per seccond
	 * @return {Number} the millisecs
	 **/	
	sifPlayer._canvasTimeToMillis = function (_s, fps) {
		var millis = 0;
		var t;
		if (_s.search('m') > 0 ) {
			t = _s.split('m');
			millis += t[0] * 60000
			_s = t[1];
		}

		if (_s.search('s') > 0 ) {
			t = _s.split('s');
			millis += t[0] * 1000;
			_s = t[1];			
		}
		
		if (_s.search('f') > 0 ) {
			t = _s.split('f');
			millis += t[0] * 1000/fps;	
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
	
	/**
	 * Gets the time in seconds and returns it to milliseconds
	 * 
	 * @method createjs.Ease.bool
	 * @static
	 **/	
	createjs.Ease.constant = function (t) {return t < 1?0:1};
	createjs.Ease.bool = function (t) {return t < 1?1:0}; 

window.sifPlayer = sifPlayer;
}());

