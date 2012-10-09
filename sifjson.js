var sifJson = {
	constructSifJson: function (_file) {
		var xmlDoc = sifJson._loadXML(_file);
		var sif = {};
		sif.guid = {};
		var c;
		var l;
		sif.canvas = this._getCanvasAttr(sif, xmlDoc.getElementsByTagName('canvas')[0]);
		sif.canvas.layer = [];
		//sif.canvas.layer = getLayers(xmlDoc.getElementsByTagName('canvas')[0].getElementsByTagName('layer'));
		for (var i = 0; i < xmlDoc.getElementsByTagName('canvas')[0].childNodes.length; i++) {
			c = xmlDoc.getElementsByTagName('canvas')[0].childNodes[i];
			
			if (c.nodeType !== 3) {
				switch (c.nodeName) {
					case ('layer'):
						l = this._getLayer(sif, c);
						if (l.type !== 'translate' && l.type !== 'zoom' && l.type !== 'rotate') {
							sif.canvas.layer.push(l);
						} else {
							sif.canvas.layer.unshift(l);
							sif.canvas.layer.push({type: 'restore'});
						}
						break;
				}
			}
		}
		return sif;
	},
	
	_getCanvasAttr: function (sif, _canvas) {
		var _cv = {};
		_cv.version = _canvas.getAttribute('version');
		_cv.width = parseInt(_canvas.getAttribute('width'));
		_cv.height = parseInt(_canvas.getAttribute('height'));
		_cv.xres = parseFloat(_canvas.getAttribute('xres'));
		_cv.yres = parseFloat(_canvas.getAttribute('yres'));
		var _vb = _canvas.getAttribute('view-box').split(" ");
		_cv.view_box = [parseFloat(_vb[0]), parseFloat(_vb[1]), parseFloat(_vb[2]), parseFloat(_vb[3])];
		_cv.antialias = parseInt(_canvas.getAttribute('antialias'));
		_cv.fps = parseFloat(_canvas.getAttribute('fps'));
		//convert the time to millis cause it's more common for computers...
		_cv.begin_time = sifJson._secsToMillis(_canvas.getAttribute('begin-time'));
		_cv.end_time = sifJson._secsToMillis(_canvas.getAttribute('end-time'));
		var _bgcolor = _canvas.getAttribute('bgcolor').split(" ");
		_cv.bgcolor = {};
		//convert the color to 256 to much html5 ... I think so...
		_cv.bgcolor.r = Math.round(parseFloat(_bgcolor[0]) * 256);
		_cv.bgcolor.g = Math.round(parseFloat(_bgcolor[1]) * 256);
		_cv.bgcolor.b = Math.round(parseFloat(_bgcolor[2]) * 256);
		_cv.bgcolor.a = Math.round(parseFloat(_bgcolor[3]) * 256);
		_cv.name = _canvas.getElementsByTagName('name')[0].textContent;
		
		_cv.defs = {};
		_cv.defs = sifJson._getCanvasDefs(sif, _canvas);
		return _cv;
	},
	
	_getCanvasDefs: function (sif, _canvas) {
		var _defs = {};
		var d = _canvas.getElementsByTagName('defs')[0];
		if (d) {
			var c = d.childNodes;
			var n;
			for (var i = 0; i < c.length; i++) {
				if (c[i].nodeType !== 3) {
					_defs[c[i].getAttribute('id')] = {};
					n = _defs[c[i].getAttribute('id')];
					n.type = c[i].getAttribute('type');
					n.guid = c[i].getAttribute('guid');
					if (n.type === 'vector') {
						n[n.type] = sifJson._getVector(sif, c[i]);
					} else {
						n[n.type] = sifJson._getValue(sif, n.type, c[i]);
					}
				}
			}
		}
		
		return _defs;
	},
		

	_loadXML: function (file) {
		if (window.XMLHttpRequest)
		{// code for IE7+, Firefox, Chrome, Opera, Safari
			var xmlhttp=new XMLHttpRequest();

		}
		else
		{// code for IE6, IE5
			var xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open("GET",file,false);
		xmlhttp.send();
		var xmlDoc=xmlhttp.responseXML;
		return xmlDoc;
	},


	_getLayer: function (sif, _l) {
		var layer = {};
		var c;
		var l;
		layer.type = _l.getAttribute('type');
		layer.active = _l.getAttribute('active');
		layer.version = _l.getAttribute('version');
		layer.desc = _l.getAttribute('desc');

		for (var i = 0; i < _l.childNodes.length; i++) {
			c = _l.childNodes[i];
			if (c.nodeType !== 3) {
				switch (c.getAttribute("name")) {
					case ("z_depth"):
						layer.z_depth = sifJson._getValue(sif, "real",c);
						break;
					case ("amount"):
						if (layer.type === 'rotate') {
							layer.amount = sifJson._getValue(sif, 'angle', c);
						} else {
							layer.amount = sifJson._getValue(sif, 'real', c);
						}
						break;
					case ("blend_method"):
						layer.blend_method = sifJson._getValue(sif, "integer", c);
						break;
					case ("color"):
						layer.color = sifJson._getColor(c);
						break;
							
					case ("origin"):
						layer.origin = {};
						layer.origin.vector = sifJson._getVector(sif, c);
						break;
						
					case ("focus"):
						layer.focus = {};
						layer.focus.vector = sifJson._getVector(sif, c);
						break;
						
					case ("center"):
						layer.center = {};
						layer.center.vector = sifJson._getVector(sif, c);
						break;
						
					case ("zoom"):
						layer.zoom = sifJson._getValue(sif, "real", c);
						break;
						
					case ("invert"):
						layer.invert = sifJson._getValue(sif, "bool", c);
						break;
							
					case ("antialias"):
						layer.antialias = sifJson._getValue(sif, "bool", c);
						break;
							
					case ("feather"):
						layer.feather = sifJson._getValue(sif, "real", c);
						break;
							
					case ("blurtype"):
						layer.blurtype = sifJson._getValue(sif, "integer", c);
						break;
							
					case ("winding_style"):
						layer.winding_style = sifJson._getValue(sif, "integer", c);
						break;
							
					case ("bline"):
						layer.bline = sifJson._getBline(sif, c);
						break;
						
					case 'filename':
						layer.filename = c.getElementsByTagName('string')[0].textContent;
						break;
					
					case 'gamma_adjust':
						layer.gama_adjust = sifJson._getValue(sif, 'real', c);
						break;
						
					case 'tl': case 'br':
						layer[c.getAttribute("name")]  = {};
						layer[c.getAttribute("name")].vector = sifJson._getVector(sif, c);
						break;
					
					case 'c':
						layer.c = sifJson._getValue(sif, 'integer', c);
						layer.c.static = Boolean(c.getElementsByTagName('integer')[0].getAttribute('static'));
						break;
						
					case 'time_offset':
						layer.time_offset = sifJson._secsToMillis( c.getElementsByTagName('time')[0].getAttribute('value'));
						break;
						
					case ('canvas'):
						layer.canvas = {};
						layer.canvas.layer = [];
						for (var j = 0; j < c.childNodes[1].childNodes.length; j++) {
							c2 = c.childNodes[1].childNodes[j];
							if (c2.nodeType !== 3) {
								switch (c2.nodeName) {
									case ('layer'):
										l = sifJson._getLayer(sif, c2);
										if (l.type !== 'translate' && l.type !== 'zoom' && l.type !== 'rotate') {
											layer.canvas.layer.push(l);
										} else {
											layer.canvas.layer.unshift(l);
											layer.canvas.layer.push({type: 'restore'});
										}

										break;
								}
							}
						}
						break;

						
							
							
				}
			}
		}
		


		return layer;
	},


	_getValue: function (sif, value_type, _p) {
		var _param = {};
		var _use = _p.getAttribute('use');
		if (_use) {
			_use = _use.substring(1);
			_param = sif.canvas.defs[_use][sif.canvas.defs[_use].type];
			//_param.use = _use;
			return _param;
		}
		
		
		switch (value_type) {
			case ("real"):
				_param.value = parseFloat(_p.getElementsByTagName(value_type)[0].getAttribute('value'));
				break;
			case ("angle"):
				_param.value = parseFloat(_p.getElementsByTagName(value_type)[0].getAttribute('value'));
				break;
			case ("integer"):
				_param.value = parseInt(_p.getElementsByTagName(value_type)[0].getAttribute('value'));
				break;
			case ("bool"):
				_param.value = Boolean(_p.getElementsByTagName(value_type)[0].getAttribute('value'));
				break;

		}
		
				
		if (_p.getElementsByTagName('waypoint')[0]) {
			var _wp = _p.getElementsByTagName('waypoint');
			_param.waypoint = [];
			//First frame. If it is not starting from 0 we have to make it start from 0
			for (var i = 0; i < _wp.length; i++) {
				
				_param.waypoint[i] = {};
				_param.waypoint[i].time = sifJson._secsToMillis(_wp[i].getAttribute('time'));
				_param.waypoint[i].before = _wp[i].getAttribute('before');
				_param.waypoint[i].after = _wp[i].getAttribute('after');
				switch (value_type) {
					case ("real"):
						_param.waypoint[i].value = parseFloat(_wp[i].getElementsByTagName(value_type)[0].getAttribute('value'));
						break;
					case ("angle"):
						_param.waypoint[i].value = parseFloat(_wp[i].getElementsByTagName(value_type)[0].getAttribute('value'));
						break;
					case ("integer"):
						_param.waypoint[i].value = parseInt(_wp[i].getElementsByTagName(value_type)[0].getAttribute('value'));
						break;
					case ("bool"):
						_param.waypoint[i].value = Boolean(_wp[i].getElementsByTagName(value_type)[0].getAttribute('value'));
						break;
				}
				_param.waypoint[i].guid = _wp[i].getElementsByTagName(value_type)[0].getAttribute('guid');
			}	
		}
		return _param;
	},

	_getColor: function (_p) {
		var _c = {};
		_c.r = Math.round(parseFloat(_p.getElementsByTagName('color')[0].getElementsByTagName('r')[0].textContent) * 256);
		_c.g = Math.round(parseFloat(_p.getElementsByTagName('color')[0].getElementsByTagName('g')[0].textContent) * 256);
		_c.b = Math.round(parseFloat(_p.getElementsByTagName('color')[0].getElementsByTagName('b')[0].textContent) * 256);
		_c.a = Math.round(parseFloat(_p.getElementsByTagName('color')[0].getElementsByTagName('a')[0].textContent) * 256);

		if (_p.getElementsByTagName('waypoint')[0]) {
			var _wp = _p.getElementsByTagName('waypoint');
			_c.waypoint = [];
		
			for (var i = 0; i < _wp.length; i++) {
				var _color = _wp[i].getElementsByTagName('color')[0];
				_c.waypoint[i] = {};
				_c.waypoint[i].time = sifJson._secsToMillis(_wp[i].getAttribute('time'));
				_c.waypoint[i].before = _wp[i].getAttribute('before');
				_c.waypoint[i].after = _wp[i].getAttribute('after');
				_c.waypoint[i].guid = _color.getAttribute('guid');
				_c.waypoint[i]
				_c.waypoint[i].r = Math.round(parseFloat(_color.getElementsByTagName('r')[0].textContent) * 256);
				_c.waypoint[i].g = Math.round(parseFloat(_color.getElementsByTagName('g')[0].textContent) * 256);
				_c.waypoint[i].b = Math.round(parseFloat(_color.getElementsByTagName('b')[0].textContent) * 256);
				_c.waypoint[i].a = Math.round(parseFloat(_color.getElementsByTagName('a')[0].textContent) * 256);
			}	
		}
		
		return _c;
	},

	_getVector: function (sif, _p) {
		var _o = {};
		_o.x = parseFloat(_p.getElementsByTagName('vector')[0].getElementsByTagName('x')[0].textContent);
		_o.y = parseFloat(_p.getElementsByTagName('vector')[0].getElementsByTagName('y')[0].textContent);
		
		if (_p.getElementsByTagName('animated')[0]) {
			var _wp = _p.getElementsByTagName('waypoint');
			_o.waypoint = [];
			for (var i = 0; i < _wp.length; i++) {
				_o.waypoint[i] = {};
				_o.waypoint[i].time = sifJson._secsToMillis(_wp[i].getAttribute('time'));
				_o.waypoint[i].before = _wp[i].getAttribute('before');
				_o.waypoint[i].after = _wp[i].getAttribute('after');
				_o.waypoint[i].guid = _wp[i].getElementsByTagName("vector")[0].getAttribute('guid');
				_o.waypoint[i].x = parseFloat(_wp[i].getElementsByTagName("vector")[0].getElementsByTagName("x")[0].textContent)
				_o.waypoint[i].y = parseFloat(_wp[i].getElementsByTagName("vector")[0].getElementsByTagName("y")[0].textContent)
			}
				
		}
		return _o;
	},

	_getBline: function (sif, _p) {
		var _bl = {};
		_bl.type = _p.getElementsByTagName('bline')[0].getAttribute('type');
		_bl.loop = _p.getElementsByTagName('bline')[0].getAttribute('loop');
		_bl.guid = _p.getElementsByTagName('bline')[0].getAttribute('guid');
		_bl.entry = [];
		_e = _p.getElementsByTagName('entry');
		for (var i = 0; i < _e.length; i++) {
			_bl.entry[i] = {};
			_bl.entry[i].point = {};
			_bl.entry[i].point.vector = sifJson._getVector(sif, _e[i].getElementsByTagName('point')[0]);
			_bl.entry[i].width = sifJson._getValue(sif, "real", _e[i].getElementsByTagName('width')[0]);
			_bl.entry[i].origin = sifJson._getValue(sif, "real", _e[i].getElementsByTagName('origin')[0]);
			_bl.entry[i].split = sifJson._getValue(sif, "bool", _e[i].getElementsByTagName('split')[0]);
			_bl.entry[i].t1 = sifJson._getT(sif, _e[i].getElementsByTagName('t1')[0]);
			_bl.entry[i].t2 = sifJson._getT(sif, _e[i].getElementsByTagName('t2')[0]);
		}
		
		
		return _bl;
	},

	_getT: function (sif, _p) {
		var _t = {};
		_t.radius = sifJson._getValue(sif, "real", _p.getElementsByTagName('radius')[0]);
		_t.theta = sifJson._getValue(sif, "angle", _p.getElementsByTagName('theta')[0]);

		return _t;
	},



	_secsToMillis: function (_s) {
		return parseFloat(_s.replace("s",""))*1000;
	},

}
