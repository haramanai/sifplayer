/*
* Copyright (c) 2012 haramanai.
* angle
* version 0.2.
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
this.sifPlayer.param = this.sifPlayer.param||{};
 (function() { 

var angle =  {};


angle._setConvert = function (layer, param, wanted_type, is_type, animated) {
	var type = sifPlayer.param.angle;
	if (wanted_type === is_type) {
		param.getValue = type.getValue;
	}
	else if (type[is_type]){
		param.getValue = type[is_type];
	}
	else {
		alert('no convert for integer to ' + is_type);
	}
	

}
	
	
angle.getValue = function () {
	return this.value;
}

angle.add = function () {
	return ( this.add.lhs.getValue() + this.add.rhs.getValue() ) * this.add.scalar.getValue();
}


angle.scale = function () {
	return this.scale.link.getValue() * this.scale.scalar.getValue();
}
	
	




sifPlayer.param.angle = angle;
}());
