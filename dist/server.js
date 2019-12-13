"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var imager_1 = require("./imager");
var canvas_1 = require("canvas");
/*
var pts2 = [
    {x:100, y:100},
    {x:300, y:100},
    {x:320, y:200},
    {x:300, y:300},
//  {x:250, y:400},
    {x:200, y:400},
//   {x:150, y:400},
    {x:100, y:300},
    {x:80, y:200},
    //{x:100, y:100}
];
*/
var faceTypes;
(function (faceTypes) {
    faceTypes[faceTypes["asuna"] = 0] = "asuna";
    faceTypes[faceTypes["megumin"] = 1] = "megumin";
    faceTypes[faceTypes["aqua"] = 2] = "aqua";
})(faceTypes || (faceTypes = {}));
var faceIndex = [
    //asuna
    [
        { x: 100, y: 100 },
        { x: 300, y: 100 },
        { x: 320, y: 200 },
        { x: 300, y: 300 },
        { x: 200, y: 400 },
        { x: 100, y: 300 },
        { x: 80, y: 200 },
    ],
    //megumin
    [
        { x: 100, y: 100 },
        { x: 300, y: 100 },
        { x: 320, y: 200 },
        { x: 290, y: 340 },
        { x: 200, y: 400 },
        { x: 0, y: 340 },
        { x: 80, y: 200 },
    ]
];
function createHead(forehead, cheek, chin) {
    var head = new imager_1.IImage(500, 500);
    //drawRect(head, {x:0, y:0}, 500, 500, "white");
    var pts2 = faceIndex[faceTypes.asuna];
    var tension = 0.4;
    var a = imager_1.PointsToArray(pts2);
    var curveyPoints = imager_1.ArrayToPoints(imager_1.getCurvePoints(a, tension, true, 16));
    var cparr = imager_1.PointsToArray(curveyPoints);
    var grad = head.ctx.createLinearGradient(0, 0, 170, 0);
    grad.addColorStop(1, "#dbc695");
    grad.addColorStop(0, "#ad945a");
    head.ctx.fillStyle = grad;
    imager_1.fillPath(head, curveyPoints);
    console.log(curveyPoints[5]);
    //drawCurveBetweenPoints(head, pts2, tension, 15, "#6e0f0f", 16, true); //default tension=0.5
    //sketchyLines(head, ArrayToPoints(cparr), 1, 20, 1, 6,"#a84432", 1);
    //sketchyLines(head, curveyPoints, 2, 20, 0.6, 2,"black", 1);
    //sketchyLines(head, curveyPoints, 4, 20, 0.6, 2,"black", 1.3);
    var copyArr = imager_1.ArrayToPoints(cparr);
    var rightSide = [];
    var found = false;
    for (var ix = 0; ix < copyArr.length; ix++) {
        var p = copyArr[ix];
        if (p.x == 320 && p.y == 200) {
            found = true;
            console.log(p);
        }
        if (p.x == 200 && p.y == 400) {
            found = false;
        }
        if (found) {
            rightSide.push(p);
        }
    }
    console.log(rightSide);
    imager_1.addToPoints(rightSide, -2, -2);
    imager_1.sketchyLines(head, imager_1.ArrayToPoints(cparr), 2, 10, 0.4, 2, "#feffad", 1.3);
    imager_1.sketchyLines(head, imager_1.ArrayToPoints(imager_1.PointsToArray(rightSide)), 5, 10, 0.4, 2, "#8c7b51", 1.3, false);
    imager_1.addToPoints(rightSide, -2, -2);
    imager_1.sketchyLines(head, imager_1.ArrayToPoints(imager_1.PointsToArray(rightSide)), 5, 10, 0.4, 2, "#8c7b51", 1.3, false);
    imager_1.drawLineBetweenPoints(head, imager_1.ArrayToPoints(cparr), 5, "black", true);
    console.log(curveyPoints[5]);
    for (var i = 0; i < pts2.length; i++) {
        imager_1.drawMarker(head, pts2[i], 5);
    }
    canvas_1.loadImage('./res/eyes/a.png').then(function (img) {
        //head.ctx.drawImage(img, 100, 130, 200, 200);
        head.saveImage("./head.png");
    });
    //drawLineBetweenPoints(head, [{x:250,y:20}, {x:50, y:50}, {x:150, y: 200}], 15, "black");
}
createHead(5, 5, 5);
