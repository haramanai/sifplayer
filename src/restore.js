/* ***
 * RESTORE LAYER
 * 
 * */
 (function() { 

/**
* @class restore
* @extends Layer
* @constructor
* @param {Object} parent The parent of the Layer
* @param {Object} data The data for the Layer
**/	 	
function restore(parent, data) {
	this.init(parent, data);
}

var p = restore.prototype = new sifPlayer.Layer();


	/** 
	 * Initialization method.
	 * @method init
	 * @param {Object} parent The parent of the Layer
	 * @param {Object} data The data for the Layer
	 **/
	p.init = function (parent, data) {
		this.initLayer(parent, data);
	};
	
	/**
	 * Draw for restore layer.
	 * @method draw
	 **/
	p.draw = function () {
		var ctx = this.sifobj.ctx;
		ctx.restore();
	}


sifPlayer.restore = restore;
}());

