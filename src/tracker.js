
(function() { 


/**
* @class Tracker
* @constructor
* @param {Context} The context to track.
**/
function Tracker(ctx) {
    this.ctx = ctx;
    this.matrix = [1,0,0,1,0,0]; 
    this.stack = [];
    this.setTransform();
}

var p = Tracker.prototype;

    p.setContext = function(ctx) {
        this.ctx = ctx;
    };

    p.getMatrix = function() {
        return this.matrix;
    };
    
    p.setMatrix = function(m) {
        this.matrix = [m[0],m[1],m[2],m[3],m[4],m[5]];
        this.setTransform();
    };
    
    p.cloneMatrix = function(m) {
        return [m[0],m[1],m[2],m[3],m[4],m[5]];
    };
    
    //==========================================
    // Stack
    //==========================================
    
    p.save = function() {
        var matrix = this.cloneMatrix(this.getMatrix());
        this.stack.push(matrix);
        
        if (this.ctx) this.ctx.save();
    };

    p.restore = function() {
        if (this.stack.length > 0) {
            var matrix = this.stack.pop();
            this.setMatrix(matrix);
        }
        
        if (this.ctx) this.ctx.restore();
    };

    //==========================================
    // Matrix
    //==========================================

    p.setTransform = function() {
        if (this.ctx) {
            this.ctx.setTransform(
                this.matrix[0],
                this.matrix[1],
                this.matrix[2],
                this.matrix[3],
                this.matrix[4],
                this.matrix[5]
            );
        }
    };
    
    p.translate = function(x, y) {
        this.matrix[4] += this.matrix[0] * x + this.matrix[2] * y;
        this.matrix[5] += this.matrix[1] * x + this.matrix[3] * y;
        
        this.setTransform();
    };
    
    p.rotate = function(rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        var m11 = this.matrix[0] * c + this.matrix[2] * s;
        var m12 = this.matrix[1] * c + this.matrix[3] * s;
        var m21 = this.matrix[0] * -s + this.matrix[2] * c;
        var m22 = this.matrix[1] * -s + this.matrix[3] * c;
        this.matrix[0] = m11;
        this.matrix[1] = m12;
        this.matrix[2] = m21;
        this.matrix[3] = m22;
        
        this.setTransform();
    };

    p.scale = function(sx, sy) {
        this.matrix[0] *= sx;
        this.matrix[1] *= sx;
        this.matrix[2] *= sy;
        this.matrix[3] *= sy;
        
        this.setTransform();
    };



sifPlayer.Tracker = Tracker;

}());
