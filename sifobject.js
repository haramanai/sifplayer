/*
* sifobject
* Visit https://github.com/haramanai/sifplayer for documentation, updates and examples.
*
* Copyright (c) 2012 haramanai.
* 
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
(function(window) { 

function SifObject(_sif, _canvas, _ctx) {
	this.canvas = _canvas;
	this.ctx = _ctx;
	this.sif = _sif;
	
	this._init();
}

var p = SifObject.prototype;

	p._init = function () {
		this.sif.timeline = new createjs.Timeline();
		this._loadImages(this.sif.canvas);
		this._setTweens();
	}
	
	p.tick = function (e) {
		this.draw();
	}
	
	p._loadImages = function (canvas) {
				
		for (var i = 0; i < canvas.layer.length; i++) {
			if (canvas.layer[i].type === 'import') {
				canvas.layer[i].image = new Image();
				canvas.layer[i].image.src = canvas.layer[i].filename;
			}
			
			if (canvas.layer[i].type === 'PasteCanvas') {
				this._loadImages(canvas.layer[i].canvas);
			}
			
		}

		

	}
	
	

	/*
	 * 
	 * 			DRAW
	 * 
	 */
	 
	p.draw = function () {


		this.ctx.save();
		this.ctx.setTransform( this.canvas.width / (this.sif.canvas.view_box[2] - this.sif.canvas.view_box[0]), 0, 0,
				this.canvas.height / (this.sif.canvas.view_box[3] - this.sif.canvas.view_box[1]),
				this.canvas.width / 2, this.canvas.height / 2)

		for (var i = 0; i < this.sif.canvas.layer.length; i++) {

			this._drawLayer(this.sif.canvas.layer[i]);
		}
		
			
		this.ctx.restore();

	}
	
	p._drawLayer = function (layer) {

		switch (layer.type) {
			case "region":
				this._drawRegion(layer);
				break;
				
			case "PasteCanvas":

				this.ctx.save();
				this.ctx.translate(layer.origin.vector.x, layer.origin.vector.y);
				this.ctx.scale(Math.exp(layer.zoom.value), Math.exp(layer.zoom.value));
				for (var i = 0; i < layer.canvas.layer.length; i++) {
					this._drawLayer(layer.canvas.layer[i]);
				}
				this.ctx.restore();
				break;
				
			case 'import':
				this.ctx.save();
				this._drawImage(layer);
				this.ctx.restore();
				break;

			case 'translate':
				this.ctx.save();
				this.ctx.translate(layer.origin.vector.x, layer.origin.vector.y);
				break;
				
			case 'zoom':
				this.ctx.save()
				this.ctx.translate(layer.center.vector.x , layer.center.vector.y );
				this.ctx.scale(Math.exp(layer.amount.value), Math.exp(layer.amount.value));
				this.ctx.translate(-layer.center.vector.x , -layer.center.vector.y );
				break;
				
			case 'rotate':
				this.ctx.save();
				this.ctx.translate(layer.origin.vector.x, layer.origin.vector.y);
				this.ctx.rotate(layer.amount.value * Math.PI/180);
				this.ctx.translate(-layer.origin.vector.x, -layer.origin.vector.y);
				break;
				
			case 'restore': //this is a custom type. it helps to work with translate , zoom and rotate
				this.ctx.restore();
				break;
			
				

		}
	}
	
	p._drawRegion = function (layer) {
		
		
		
		this.ctx.fillStyle = 'rgba('+ Math.round(layer.color.r) + ', ' + Math.round(layer.color.g) + ', ' + Math.round(layer.color.b) + ', ' + Math.round(layer.color.a) + ')';
		this.ctx.globalAlpha = layer.amount.value;
		this.ctx.save();
		this.ctx.translate(layer.origin.vector.x, layer.origin.vector.y);
		this._setBlendByLayer(layer);
		this.ctx.beginPath();
		this.ctx.moveTo(layer.bline.entry[0].point.vector.x, layer.bline.entry[0].point.vector.y);

		for (var i = 0; i < layer.bline.entry.length - 1; i++) {
			if (layer.bline.entry[i].split.value === true) {
				this._bezierPart( layer.bline.entry[i].point.vector, layer.bline.entry[i + 1].point.vector,
							layer.bline.entry[i].t2, layer.bline.entry[i + 1].t1);
			} else {
				this._bezierPart( layer.bline.entry[i].point.vector, layer.bline.entry[i + 1].point.vector,
							layer.bline.entry[i].t1, layer.bline.entry[i + 1].t1);
			}

		}
		if (layer.bline.loop === "true") {
			if (layer.bline.entry[layer.bline.entry.length - 1].split.value === true) {
				this._bezierPart( layer.bline.entry[layer.bline.entry.length - 1].point.vector,
								layer.bline.entry[0].point.vector,
								layer.bline.entry[layer.bline.entry.length - 1].t2,
								layer.bline.entry[0].t1);
			} else {
				this._bezierPart( layer.bline.entry[layer.bline.entry.length - 1].point.vector,
								layer.bline.entry[0].point.vector,
								layer.bline.entry[layer.bline.entry.length - 1].t1,
								layer.bline.entry[0].t1);
			}
		}
		//ctx.closePath();
		this.ctx.fill();
		this.ctx.restore();

		
	}
	
	p._setBlendByLayer = function (layer) {
				
		switch (layer.blend_method.value) {
			case 0:
				//Composite
				this.ctx.globalCompositeOperation = 'source-over';
				break;
			case 1:
				//Straight 
				this.ctx.globalCompositeOperation = 'copy';
				break;
			case 13:
				//Onto
				this.ctx.globalCompositeOperation = 'source-atop';
				break;
			case 21:
				//Straight Onto
				this.ctx.globalCompositeOperation = 'source-in';
				break;
			case 12:
				//Behind
				this.ctx.globalCompositeOperation = 'destination-over';
				break;
			case 19:
				//Alpha Over
				this.ctx.globalCompositeOperation = 'destination-out';
				break;
			case 14:
				//Alpha Brighter
				this.ctx.globalCompositeOperation = 'destination-in';
				break;
				
				
			default:
				this.ctx.globalCompositeOperation = 'source-over';
				
		}
	}
	
	p._bezierPart = function (_p1, _p2, _t1, _t2) {
		var _cp1 = {};
		var _cp2 = {};
		var _a;
		if (_t1.scalar) {
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
			
		this.ctx.bezierCurveTo(_cp1.x, _cp1.y, _cp2.x, _cp2.y, _p2.x, _p2.y);
	
	}
	
	p._drawImage = function (layer) {
		var w =  (layer.br.vector.x - layer.tl.vector.x);
		var h = (layer.tl.vector.y - layer.br.vector.y)
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
		this.ctx.translate(layer.tl.vector.x, layer.tl.vector.y);
		this.ctx.scale(sx  , sy);
		this.ctx.drawImage(layer.image, 0, 0, w, h);

	},
	
	
	



	/*
	 * 
	 * 		TWEEN
	 * 
	 */
	 
	p._setTweens = function () {
		for ( var i = 0; i < this.sif.canvas.layer.length; i++) {
			this._tweenLayer(this.sif.canvas.layer[i]);
		}
	}
	
	p._tweenLayer = function (layer) {
				
		for (p in layer) {
			switch (p) {
				
				// Not used.
				case 'type': case 'active': case 'desc': case 'version': 
					break;
					
				// More not used
				case 'image': case 'c': case 'gama_adjust': case 'blend_method': case 'filename': case 'time_offset':
					break;
					
				case 'origin': case 'focus': case 'tl': case 'br':
					this._tweenVector(layer[p].vector);
					break;
					
				
				case 'amount': case 'zoom': case 'z_depth':
					this._tweenNum(layer[p]);
					break;
				
				case 'color':

					this._tweenColor(layer[p]);
					break;

					
				case 'bline':
					this._tweenBline(layer[p]);
					break;
					
				case 'canvas':
					for (var i = 0; i < layer.canvas.layer.length; i++) {
						this._tweenLayer(layer.canvas.layer[i]);
					}
					break;
				default:
					console.log(p);
						
			}
		}
	}
	p._tweenNum = function (num) {
		if (num.waypoint) {
			var tw = createjs.Tween.get(num);
			if (num.waypoint[0].time != 0) {
				tw.to( {value: num.waypoint[0].value},
				num.waypoint[0].time,
				createjs.Ease.linear);
			}
			for (var i = 0; i < num.waypoint.length - 1; i++) {
				tw.to( { value: num.waypoint[i + 1].value }
						,num.waypoint[i + 1].time - num.waypoint[i].time
						, createjs.Ease.linear);
			}
			this.sif.timeline.addTween(tw);
		}
	}
	
	p._tweenColor = function (color) {
		if (color.waypoint) {
			var tw = createjs.Tween.get(color);
			if (color.waypoint[0].time != 0) {
				
				tw.to( {r: color.waypoint[0].r , g: color.waypoint[0].g, b: color.waypoint[0].b, a: color.waypoint[0].a},
				color.waypoint[0].time,
				createjs.Ease.linear);
			}
			for (var i = 0; i < color.waypoint.length - 1; i++) {
				tw.to( {r: color.waypoint[i + 1].r , g: color.waypoint[i + 1].g, b: color.waypoint[i + 1].b, a: color.waypoint[i + 1].a}
						,color.waypoint[i + 1].time - color.waypoint[i].time
						, createjs.Ease.linear);
			}
			this.sif.timeline.addTween(tw);
		}
	}
	
	p._tweenVector = function (v) {
		if (v.waypoint) {
			var tw = createjs.Tween.get(v);
			if (v.waypoint[0].time != 0) {
				tw.to( {x: v.waypoint[0].x, y: v.waypoint[0].y},
				v.waypoint[0].time,
				createjs.Ease.linear);
			}

			for (var i = 0; i < v.waypoint.length - 1; i++) {
				tw.to({x: v.waypoint[i + 1].x, y: v.waypoint[i + 1].y}
				,v.waypoint[i + 1].time - v.waypoint[i].time
				, createjs.Ease.linear);
				
			}
			this.sif.timeline.addTween(tw);
		}
	}
	
		
	p._tweenT =  function (t) {
		this._tweenNum(t.radius);
		this._tweenNum(t.theta);
	}
	
	p._tweenBline =  function (b) {
		for (var i = 0; i < b.entry.length; i++) {
			this._tweenVector(b.entry[i].point.vector);
			this._tweenT(b.entry[i].t1);
			this._tweenT(b.entry[i].t2);
		}
					
	}
	
	
window.SifObject = SifObject;
}(window));

