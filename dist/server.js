"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var imager_1 = require("./imager");
var head = new imager_1.IImage(500, 500);
imager_1.drawRect(head, { x: 0, y: 0 }, 500, 500, "white");
var pts = [
    { x: 10, y: 100 },
    { x: 50, y: 150 },
    { x: 50, y: 400 },
    { x: 250, y: 100 },
    { x: 130, y: 150 },
    { x: 210, y: 50 },
    { x: 10, y: 10 },
    { x: 112, y: 140 },
    { x: 140, y: 130 },
    { x: 110, y: 100 }
];
var pts2 = [
    { x: 100, y: 100 },
    { x: 300, y: 100 },
    { x: 320, y: 200 },
    { x: 310, y: 300 },
    { x: 200, y: 400 },
    { x: 90, y: 300 },
    { x: 80, y: 200 },
];
var tension = 0.7;
imager_1.drawCurveBetweenPoints(head, pts2, tension, 150, "black", 16, true); //default tension=0.5
//drawLineBetweenPoints(head, [{x:250,y:20}, {x:50, y:50}, {x:150, y: 200}], 15, "black");
head.saveImage("./dab.png");
