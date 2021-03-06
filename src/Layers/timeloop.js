/*
* Copyright (c) 2012 haramanai.
* timeloop
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
* @class timeloop
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	 	
function timeloop(parent, data) {
	this.init(parent, data);
	
}

var p = timeloop.prototype = new sifPlayer.Layer();


	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (parent, data) {
		var _set = sifPlayer.param._set;	
		this.initLayer(parent, data);
		
		_set(this, 'link_time', 'integer', this, data.link_time);
		_set(this, 'local_time', 'integer', this, data.local_time);
		_set(this, 'duration', 'integer', this, data.duration);


		this.timeline.duration = this.sifobj.sif.canvas.end_time - this.sifobj.sif.canvas.begin_time;
		this.timeline.loop = true;
		
	};
	
	
	/**
	 * moves the time line of the layer to the position
	 * @method goto
	 **/		
	p.setPosition = function (position) {
		this.timeline.tick( position - this.timeline.position);
		
		var duration = this.duration.getValue();
		var link_time = this.link_time.getValue();
		var local_time = this.local_time.getValue();
		var new_pos = (position + local_time) % duration;
		if (duration != 0) {
			if (duration > 0) {	
				new_pos += link_time;
			} else {
				new_pos = link_time - new_pos;
			}
		} else {
			new_pos = link_time;
		}

		
		return new_pos;
	}
	
	
	



sifPlayer.timeloop = timeloop;
}());

