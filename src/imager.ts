//declare function require(name:string);


import { createCanvas, Canvas, CanvasRenderingContext2D } from 'canvas'; 
import { writeFile } from 'fs';
import * as paper from 'paper';
import * as rnd from 'random';


//const fs = require('fs');

/**
 * interface for points. x & y values are both numbers
 */
interface point{
    x: number;
    y: number;
}


function ArrayToPoints(arr: number[]){
    let res: point[] = [];
    for(let i = 0; i < arr.length - 2; i += 2){
        res.push(
            {x:arr[i], y:arr[i+1]}
        );
    }
    return res;
}

function PointsToArray(arr: point[]){
    let res: number[] = [];
    for(let i = 0; i < arr.length; i++){
        res.push(arr[i].x);
        res.push(arr[i].y);
    }
    return res;
}


function randInt(min: number, max: number){
    return Math.floor((Math.random() * max) + min);
}

function randFloat(min: number, max: number){
    return Math.random() * max + min;
}


/**
 * IImage is used to create a new image
 */
class IImage{
    canvas: Canvas;
    ctx: CanvasRenderingContext2D;
    color: string;
    constructor(width = 500, height = 500){
        this.canvas = createCanvas(width, height);;
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Saves the image as a png
     * @param file the path of the file including the file name. eg: './temp.png/'
     */
    saveImage(file = './temp.png'){
        let buf = this.canvas.toBuffer();
        writeFile(file, buf, (e) =>{
            if(e){
                console.log('error in saving file');
                console.error(e);
            }else{
                console.log(`File: ${file} saved`);
            }
        });
    }

    
}

/**
 * draws a simple line between two points
 * @param II the IImage object
 * @param A point A
 * @param B point B
 * @param T thickness of the line
 * @param C the colour of the line
 */
function drawLine(II: IImage, A: point, B: point, T: number, C: string = II.color){
    II.ctx.strokeStyle = C;

    II.ctx.beginPath();

    II.ctx.moveTo(A.x, A.y);
    II.ctx.lineTo(B.x, B.y);

    let a = 1;
    for(let i = 0; i < T; i++){
        let thicc = i * a;
        II.ctx.moveTo(A.x - thicc, A.y + thicc);
        II.ctx.lineTo(B.x - thicc, B.y + thicc);
        a *= -1;
    }

    II.ctx.stroke(); 
}

/**
 * Draws straight lines between all points
 * @param II IImage object
 * @param points array of points
 * @param T thickness
 * @param C colour 
 */
function drawLineBetweenPoints(II: IImage, points: point[], T: number, C: string = II.color, loop: boolean = false){
    if(points.length < 1){
        console.log('Unable to draw, not enough points')
        return false;
    }

    II.ctx.strokeStyle = C;
    II.ctx.lineWidth = 2;

    let flipper = 0.5;

    for(let t = 0; t < T; t++){
        II.ctx.beginPath();

        let thicc = t * flipper;

        let a = points[0];
        II.ctx.moveTo(a.x - thicc, a.y + thicc);

        for(let i = 1; i < points.length; i++){
            let b = points[i];
            II.ctx.lineTo(b.x - thicc, b.y + thicc);
            console.log
        }

        flipper *= -1;
        if(loop){
            II.ctx.lineTo(a.x - thicc, a.y + thicc);
        }

        II.ctx.stroke();
    }    
}


function drawRect(II: IImage, p: point, width: number, height: number, C: string = II.color){
    II.ctx.fillStyle = C;
    II.ctx.fillRect(p.x, p.y, width, height);
}


function smoothPoints(II: IImage, points: point[], smoothness: number, thickness: number, C: string = II.color){
    // move to the first point
   II.ctx.moveTo(points[0].x, points[0].y);


   for (var i = 1; i < points.length - 2; i ++)
   {
      var xc = (points[i].x + points[i + 1].x) / 2;
      var yc = (points[i].y + points[i + 1].y) / 2;
      II.ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
   }
    // curve through the last two points
    II.ctx.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);
}



function drawCurveBetweenPoints(II: IImage, points: point[], tension: number = 0.5, thickness: number = 1, C: string = II.color, numOfSegments: number = 16, closedLoop: boolean = false){
    II.ctx.strokeStyle = C;

    //begin path
    II.ctx.beginPath();

    let pp: number[] = PointsToArray(points)

    //interps between points
    let pts = getCurvePoints(pp, tension, closedLoop, numOfSegments);

    //draws line using pts
    II.ctx.moveTo(pts[0], pts[1]);

    for(let i = 2; i < pts.length - 1; i += 2){
        II.ctx.lineTo(pts[i], pts[i+1]);
    }

    II.ctx.stroke();

    if(thickness > 1){
        for(let i = 0; i < points.length; i++){
            points[i].x += 0.5;
            points[i].y += 0.5;
        }
        drawCurveBetweenPoints(II, points, tension, thickness -= 1, C, numOfSegments, closedLoop);
    }
}



function getCurvePoints(pts, tension, isClosed, numOfSegments) {

    // use input value if provided, or use a default value	 
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    isClosed = isClosed ? isClosed : false;
    numOfSegments = numOfSegments ? numOfSegments : 16;

    var _pts = [], res = [],	// clone array
        x, y,			// our x,y coords
        t1x, t2x, t1y, t2y,	// tension vectors
        c1, c2, c3, c4,		// cardinal points
        st, t, i;		// steps based on num. of segments

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
        _pts.unshift(pts[1]);	//copy 1. point and insert at beginning
        _pts.unshift(pts[0]);
        _pts.push(pts[pts.length - 2]);	//copy last point and append
        _pts.push(pts[pts.length - 1]);
    }

    // ok, lets start..

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i=2; i < (_pts.length - 4); i+=2) {
        for (t=0; t <= numOfSegments; t++) {

        // calc tension vectors
        t1x = (_pts[i+2] - _pts[i-2]) * tension;
        t2x = (_pts[i+4] - _pts[i]) * tension;

        t1y = (_pts[i+3] - _pts[i-1]) * tension;
        t2y = (_pts[i+5] - _pts[i+1]) * tension;

        // calc step
        st = t / numOfSegments;

        // calc cardinals
        c1 =   2 * Math.pow(st, 3) 	- 3 * Math.pow(st, 2) + 1; 
        c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
        c3 = 	   Math.pow(st, 3)	- 2 * Math.pow(st, 2) + st; 
        c4 = 	   Math.pow(st, 3)	- 	  Math.pow(st, 2);

        // calc x and y cords with common control vectors
        x = c1 * _pts[i]	+ c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
        y = c1 * _pts[i+1]	+ c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

        //store points in array
        res.push(x);
        res.push(y);

        }
    }
    return res;
}


function drawMarker(II: IImage, p: point, size: number, C: string = II.color){
    II.ctx.strokeStyle = C;
    II.ctx.strokeRect(p.x - size / 2, p.y - size / 2, size, size);
}

function fillPath(II: IImage, points: point[]){
   

    II.ctx.beginPath();
    II.ctx.moveTo(points[0].x, points[0].y);

    for(let i = 1; i < points.length; i++){
        let p = points[i];
        II.ctx.lineTo(p.x, p.y);
    }

    II.ctx.closePath();
    
    II.ctx.fill();
}

/**
 * 
 * @param II 
 * @param points 
 * @param thickness 
 * @param skippyCoff 
 * @param lineCoff a number between 0-1 
 * @param C 
 */
function sketchyLines(II: IImage, points: point[], thickness: number, skippyCoff: number, lineCoff: number, SD: number = 6,C: any = II.color, rndOffset: number, loop: boolean = true){
    II.ctx.strokeStyle = C;
    
    let numOfPoints = points.length;

    for(let i = 0; i < numOfPoints; i++){
        let roll = Math.random();
        if(lineCoff >= roll){ //draws line if roll was high enough
            let max = numOfPoints - 1 - i;
            if(max > 0){
                let a = numOfPoints / skippyCoff;
                let skip = rnd.normal(a, SD)
                let b = Math.round(skip());

                if(b > max){
                    //console.log(max, i, b)
                    if(loop){
                        let dif = b - max;
                        console.log(dif)
                        for(let q = 0; q < dif; q++){
                            points.push(points[q]);
                        }
                    }else{
                        b = max;
                    }                    
                }
                if(b < 1){
                    b = 0
                }

                let c = b + i;

                let rndO = rnd.normal(0, rndOffset);

                let p1 = points[i];
                let p1Offset = [rndO(), rndO()]
                p1.x += p1Offset[0];
                p1.y += p1Offset[1];

                let p2 = points[c];
                let p2Offset = [rndO(), rndO()]
                p2.x += p2Offset[0];
                p2.y += p2Offset[1];

                let interpPoints = [];
                interpPoints.push(p1);
                
                for(let x = i; x < c; x++){
                    // x - i loop index 
                    let pp = points[x];
                    let index = x - i;
                    pp.x += (b-index)/b * p1Offset[0] + (index)/b * p2Offset[0];
                    pp.y += (b-index)/b * p1Offset[1] + (index)/b * p2Offset[1];
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

function addToPoints(points: point[], x: number, y: number){
    for(let i = 0; i < points.length; i++){
        points[i].x += x;
        points[i].y += y;
    }
}



export {IImage}
export {
    drawLine,
    drawLineBetweenPoints, 
    drawRect, 
    drawCurveBetweenPoints, 
    drawMarker, 
    getCurvePoints, 
    fillPath, 
    PointsToArray, 
    ArrayToPoints,
    point,
    sketchyLines,
    addToPoints
}