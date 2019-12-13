"use strict";
//declare function require(name:string);
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("canvas");
var fs_1 = require("fs");
var rnd = require("random");
function ArrayToPoints(arr) {
    var res = [];
    for (var i = 0; i < arr.length - 2; i += 2) {
        res.push({ x: arr[i], y: arr[i + 1] });
    }
    return res;
}
exports.ArrayToPoints = ArrayToPoints;
function PointsToArray(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        res.push(arr[i].x);
        res.push(arr[i].y);
    }
    return res;
}
exports.PointsToArray = PointsToArray;
function randInt(min, max) {
    return Math.floor((Math.random() * max) + min);
}
function randFloat(min, max) {
    return Math.random() * max + min;
}
/**
 * IImage is used to create a new image
 */
var IImage = /** @class */ (function () {
    function IImage(width, height) {
        if (width === void 0) { width = 500; }
        if (height === void 0) { height = 500; }
        this.canvas = canvas_1.createCanvas(width, height);
        ;
        this.ctx = this.canvas.getContext('2d');
    }
    /**
     * Saves the image as a png
     * @param file the path of the file including the file name. eg: './temp.png/'
     */
    IImage.prototype.saveImage = function (file) {
        if (file === void 0) { file = './temp.png'; }
        var buf = this.canvas.toBuffer();
        fs_1.writeFile(file, buf, function (e) {
            if (e) {
                console.log('error in saving file');
                console.error(e);
            }
            else {
                console.log("File: " + file + " saved");
            }
        });
    };
    return IImage;
}());
exports.IImage = IImage;
/**
 * draws a simple line between two points
 * @param II the IImage object
 * @param A point A
 * @param B point B
 * @param T thickness of the line
 * @param C the colour of the line
 */
function drawLine(II, A, B, T, C) {
    if (C === void 0) { C = II.color; }
    II.ctx.strokeStyle = C;
    II.ctx.beginPath();
    II.ctx.moveTo(A.x, A.y);
    II.ctx.lineTo(B.x, B.y);
    var a = 1;
    for (var i = 0; i < T; i++) {
        var thicc = i * a;
        II.ctx.moveTo(A.x - thicc, A.y + thicc);
        II.ctx.lineTo(B.x - thicc, B.y + thicc);
        a *= -1;
    }
    II.ctx.stroke();
}
exports.drawLine = drawLine;
/**
 * Draws straight lines between all points
 * @param II IImage object
 * @param points array of points
 * @param T thickness
 * @param C colour
 */
function drawLineBetweenPoints(II, points, T, C, loop) {
    if (C === void 0) { C = II.color; }
    if (loop === void 0) { loop = false; }
    if (points.length < 1) {
        console.log('Unable to draw, not enough points');
        return false;
    }
    II.ctx.strokeStyle = C;
    II.ctx.lineWidth = 2;
    var flipper = 0.5;
    for (var t = 0; t < T; t++) {
        II.ctx.beginPath();
        var thicc = t * flipper;
        var a = points[0];
        II.ctx.moveTo(a.x - thicc, a.y + thicc);
        for (var i = 1; i < points.length; i++) {
            var b = points[i];
            II.ctx.lineTo(b.x - thicc, b.y + thicc);
            console.log;
        }
        flipper *= -1;
        if (loop) {
            II.ctx.lineTo(a.x - thicc, a.y + thicc);
        }
        II.ctx.stroke();
    }
}
exports.drawLineBetweenPoints = drawLineBetweenPoints;
function drawRect(II, p, width, height, C) {
    if (C === void 0) { C = II.color; }
    II.ctx.fillStyle = C;
    II.ctx.fillRect(p.x, p.y, width, height);
}
exports.drawRect = drawRect;
function smoothPoints(II, points, smoothness, thickness, C) {
    if (C === void 0) { C = II.color; }
    // move to the first point
    II.ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length - 2; i++) {
        var xc = (points[i].x + points[i + 1].x) / 2;
        var yc = (points[i].y + points[i + 1].y) / 2;
        II.ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    // curve through the last two points
    II.ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
}
function drawCurveBetweenPoints(II, points, tension, thickness, C, numOfSegments, closedLoop) {
    if (tension === void 0) { tension = 0.5; }
    if (thickness === void 0) { thickness = 1; }
    if (C === void 0) { C = II.color; }
    if (numOfSegments === void 0) { numOfSegments = 16; }
    if (closedLoop === void 0) { closedLoop = false; }
    II.ctx.strokeStyle = C;
    //begin path
    II.ctx.beginPath();
    var pp = PointsToArray(points);
    //interps between points
    var pts = getCurvePoints(pp, tension, closedLoop, numOfSegments);
    //draws line using pts
    II.ctx.moveTo(pts[0], pts[1]);
    for (var i = 2; i < pts.length - 1; i += 2) {
        II.ctx.lineTo(pts[i], pts[i + 1]);
    }
    II.ctx.stroke();
    if (thickness > 1) {
        for (var i = 0; i < points.length; i++) {
            points[i].x += 0.5;
            points[i].y += 0.5;
        }
        drawCurveBetweenPoints(II, points, tension, thickness -= 1, C, numOfSegments, closedLoop);
    }
}
exports.drawCurveBetweenPoints = drawCurveBetweenPoints;
function getCurvePoints(pts, tension, isClosed, numOfSegments) {
    // use input value if provided, or use a default value	 
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    isClosed = isClosed ? isClosed : false;
    numOfSegments = numOfSegments ? numOfSegments : 16;
    var _pts = [], res = [], // clone array
    x, y, // our x,y coords
    t1x, t2x, t1y, t2y, // tension vectors
    c1, c2, c3, c4, // cardinal points
    st, t, i; // steps based on num. of segments
    // clone array so we don't change the original
    //
    _pts = pts.slice(0);
    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.push(pts[0]);
        _pts.push(pts[1]);
    }
    else {
        _pts.unshift(pts[1]); //copy 1. point and insert at beginning
        _pts.unshift(pts[0]);
        _pts.push(pts[pts.length - 2]); //copy last point and append
        _pts.push(pts[pts.length - 1]);
    }
    // ok, lets start..
    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i = 2; i < (_pts.length - 4); i += 2) {
        for (t = 0; t <= numOfSegments; t++) {
            // calc tension vectors
            t1x = (_pts[i + 2] - _pts[i - 2]) * tension;
            t2x = (_pts[i + 4] - _pts[i]) * tension;
            t1y = (_pts[i + 3] - _pts[i - 1]) * tension;
            t2y = (_pts[i + 5] - _pts[i + 1]) * tension;
            // calc step
            st = t / numOfSegments;
            // calc cardinals
            c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
            c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
            c4 = Math.pow(st, 3) - Math.pow(st, 2);
            // calc x and y cords with common control vectors
            x = c1 * _pts[i] + c2 * _pts[i + 2] + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i + 1] + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y;
            //store points in array
            res.push(x);
            res.push(y);
        }
    }
    return res;
}
exports.getCurvePoints = getCurvePoints;
function drawMarker(II, p, size, C) {
    if (C === void 0) { C = II.color; }
    II.ctx.strokeStyle = C;
    II.ctx.strokeRect(p.x - size / 2, p.y - size / 2, size, size);
}
exports.drawMarker = drawMarker;
function fillPath(II, points) {
    II.ctx.beginPath();
    II.ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        var p = points[i];
        II.ctx.lineTo(p.x, p.y);
    }
    II.ctx.closePath();
    II.ctx.fill();
}
exports.fillPath = fillPath;
/**
 *
 * @param II
 * @param points
 * @param thickness
 * @param skippyCoff
 * @param lineCoff a number between 0-1
 * @param C
 */
function sketchyLines(II, points, thickness, skippyCoff, lineCoff, SD, C, rndOffset, loop) {
    if (SD === void 0) { SD = 6; }
    if (C === void 0) { C = II.color; }
    if (loop === void 0) { loop = true; }
    II.ctx.strokeStyle = C;
    var numOfPoints = points.length;
    for (var i = 0; i < numOfPoints; i++) {
        var roll = Math.random();
        if (lineCoff >= roll) { //draws line if roll was high enough
            var max = numOfPoints - 1 - i;
            if (max > 0) {
                var a = numOfPoints / skippyCoff;
                var skip = rnd.normal(a, SD);
                var b = Math.round(skip());
                if (b > max) {
                    //console.log(max, i, b)
                    if (loop) {
                        var dif = b - max;
                        console.log(dif);
                        for (var q = 0; q < dif; q++) {
                            points.push(points[q]);
                        }
                    }
                    else {
                        b = max;
                    }
                }
                if (b < 1) {
                    b = 0;
                }
                var c = b + i;
                var rndO = rnd.normal(0, rndOffset);
                var p1 = points[i];
                var p1Offset = [rndO(), rndO()];
                p1.x += p1Offset[0];
                p1.y += p1Offset[1];
                var p2 = points[c];
                var p2Offset = [rndO(), rndO()];
                p2.x += p2Offset[0];
                p2.y += p2Offset[1];
                var interpPoints = [];
                interpPoints.push(p1);
                for (var x = i; x < c; x++) {
                    // x - i loop index 
                    var pp = points[x];
                    var index = x - i;
                    pp.x += (b - index) / b * p1Offset[0] + (index) / b * p2Offset[0];
                    pp.y += (b - index) / b * p1Offset[1] + (index) / b * p2Offset[1];
                    interpPoints.push(pp);
                }
                interpPoints.push(p2);
                //II.ctx.lineWidth = thickness;
                drawLineBetweenPoints(II, interpPoints, thickness, C);
                //drawLine(II, p1, p2, thickness, C);
            }
        }
    }
}
exports.sketchyLines = sketchyLines;
function addToPoints(points, x, y) {
    for (var i = 0; i < points.length; i++) {
        points[i].x += x;
        points[i].y += y;
    }
}
exports.addToPoints = addToPoints;
