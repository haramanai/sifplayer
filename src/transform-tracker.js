/*
 * Transform tracker
 *
 * @author Kevin Moot <kevin.moot@gmail.com>
 * Based on a class created by Simon Sarris - www.simonsarris.com - sarris@acm.org
 */

"use strict";

function Tracker(ctx) {
    this.ctx = ctx;
    this.matrix = [1,0,0,1,0,0]; //initialize with the identity matrix
    this.stack = [];

    this.setContext = function(ctx) {
        this.ctx = ctx;
    };

    this.getMatrix = function() {
        return this.matrix;
    };
    
    this.setMatrix = function(m) {
        this.matrix = [m[0],m[1],m[2],m[3],m[4],m[5]];
        this.setTransform();
    };
    
    this.cloneMatrix = function(m) {
        return [m[0],m[1],m[2],m[3],m[4],m[5]];
    };
    
    //==========================================
    // Stack
    //==========================================
    
    this.save = function() {
        var matrix = this.cloneMatrix(this.getMatrix());
        this.stack.push(matrix);
        
        if (this.ctx) this.ctx.save();
    };

    this.restore = function() {
        if (this.stack.length > 0) {
            var matrix = this.stack.pop();
            this.setMatrix(matrix);
        }
        
        if (this.ctx) this.ctx.restore();
    };

    //==========================================
    // Matrix
    //==========================================

    this.setTransform = function() {
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
    
    this.translate = function(x, y) {
        this.matrix[4] += this.matrix[0] * x + this.matrix[2] * y;
        this.matrix[5] += this.matrix[1] * x + this.matrix[3] * y;
        
        this.setTransform();
    };
    
    this.rotate = function(rad) {
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

    this.scale = function(sx, sy) {
        this.matrix[0] *= sx;
        this.matrix[1] *= sx;
        this.matrix[2] *= sy;
        this.matrix[3] *= sy;
        
        this.setTransform();
    };

}
