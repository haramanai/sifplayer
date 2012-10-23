
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
