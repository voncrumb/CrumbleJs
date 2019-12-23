import {
    IImage, 
    drawLineBetweenPoints, 
    drawLine, 
    drawRect, 
    drawCurveBetweenPoints, 
    drawMarker, 
    getCurvePoints,
    fillPath, 
    PointsToArray, 
    ArrayToPoints, 
    point,
    sketchyLines,
    addToPoints,
    copyPoints,
    interpCurvePoints,
    movePointsToPoint,
    findCenter,
    stroke,
    strokePoints,
    splitInterp
} from './crumble'


import {loadImage} from 'canvas';
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


enum faceTypes {
    asuna,
    megumin,
    aqua
}



let faceIndex: point[][] = [
    //asuna
    [
        {x:100, y:100},
        {x:300, y:100},
        {x:320, y:200},
        {x:300, y:300},//chin
        {x:200, y:400},
        {x:100, y:300},
        {x:80, y:200},
    ],
    //megumin
    [
        {x:100, y:100},
        {x:300, y:100},
        {x:320, y:200},
        {x:290, y:340},
        {x:200, y:400},
        {x:0, y:340},
        {x:80, y:200},
    ]
]




function createHead(forehead: number, cheek: number, chin: number){
    let head = new IImage(500, 500);
    //drawRect(head, {x:0, y:0}, 500, 500, "white");

    let pts2 = faceIndex[faceTypes.asuna];


    var tension = 1;
    let a = PointsToArray(pts2);
    let curveyPoints = ArrayToPoints(getCurvePoints(a, tension, true, 16));

    let cparr = PointsToArray(curveyPoints);


    let grad = head.ctx.createLinearGradient(0, 0, 170, 0);
    grad.addColorStop(1, "#dbc695")
    grad.addColorStop(0, "#ad945a");

    head.ctx.fillStyle = grad;
    fillPath(head, curveyPoints);

    console.log(curveyPoints[5])
    
    //drawCurveBetweenPoints(head, pts2, tension, 15, "#6e0f0f", 16, true); //default tension=0.5
    //sketchyLines(head, ArrayToPoints(cparr), 1, 20, 1, 6,"#a84432", 1);
    //sketchyLines(head, curveyPoints, 2, 20, 0.6, 2,"black", 1);
    //sketchyLines(head, curveyPoints, 4, 20, 0.6, 2,"black", 1.3);
    let copyArr = ArrayToPoints(cparr);
    let rightSide: point[] = []
    let found = false;
    for(let ix = 0; ix < copyArr.length; ix++){
        let p = copyArr[ix];
        if(p.x == 320 && p.y == 200){
            found = true;
            console.log(p)
        }

        if(p.x == 200 && p.y == 400){
            found = false;
        }

        if(found){
            rightSide.push(p);
        }
    }
    console.log(rightSide)
    addToPoints(rightSide, -2, -2)

    //draws lighter shades
    sketchyLines(head, ArrayToPoints(cparr), 2, 10, 0.4, 2,"#feffad", 1.3);
    
    //draws darker shading
    sketchyLines(head, ArrayToPoints(PointsToArray(rightSide)), 5, 5, 0.4, 2,"#8c7b51", 1.3, false);
    addToPoints(rightSide, -2, -2) //Crude copy method
    sketchyLines(head, ArrayToPoints(PointsToArray(rightSide)), 5, 5, 0.4, 2,"#8c7b51", 1.3, false);


    drawLineBetweenPoints(head, ArrayToPoints(cparr), 5, "black", true)
    console.log(curveyPoints[5])

    for(let i = 0; i < pts2.length; i++){
        drawMarker(head, pts2[i], 5);
    }  

    loadImage('./res/eyes/a.png').then((img) => {
        //head.ctx.drawImage(img, 100, 130, 200, 200);
        head.saveImage("./head.png");
    })

    //drawLineBetweenPoints(head, [{x:250,y:20}, {x:50, y:50}, {x:150, y: 200}], 15, "black");
    

}


function tester(){
    let head = new IImage(500, 500);

    //white background
    drawRect(head, {x:0, y:0}, 500, 500, "white");


    let pts = faceIndex[faceTypes.asuna];

    let pp: point[] = [
        {x: 0, y:0},
        {x: 500, y:500}
    ]

    let c = interpCurvePoints(pp, 1, false, 16);
    
    let a = sketchyLines(c, 5, 0.9, 2, 1.3, false);
    
    
    for(let i = 0; i < a.length; i++){
        //console.log(a[i])
        
        //drawLineBetweenPoints(head, a[i], 1, "black", false);
    }
 

    var testion = 0.4;
    let curvery = interpCurvePoints(pts, testion, true, 16);

    
    
    

    //draws the outline of the face
    let a1 = sketchyLines(curvery, 16, 0.2, 20, 1.3, true);
    for(let i = 0; i < a1.length; i++){
        let a2 = a1[i];
        for(let o = 0; o < a2.length - 1; o++){
            let a3 = a2[o];
            let a4 = a2[o + 1];
            //stroke(head, a3, a4, 2, 0, 2);
        }
        head.ctx.fillStyle = 'black'
        //strokePoints(head, a2, 2, 1);
        //drawLineBetweenPoints(head, a1[i], 5, "black", false);
        strokePoints(head, a1[i], 2, 0);
    }
    //drawLineBetweenPoints(head, curvery, 5, "black", true);
    let ahh = splitInterp(curvery, pts);
    for(let i = 0; i < ahh.length; i++){
        //strokePoints(head, ahh[i], 1, 0);
    }
    


    let ppp: point[] = [
        {x: 50, y: 200},
        {x: 150, y: 50},
        {x: 300, y: 200},
        {x: 200, y: 400}
    ]
    
    


    //fills the face with a gradient
    let grad = head.ctx.createLinearGradient(0, 0, 170, 0);
    grad.addColorStop(1, "#dbc695")
    grad.addColorStop(0, "#ad945a");
    head.ctx.fillStyle = grad;
    
    let center = findCenter(curvery);
    let dab = movePointsToPoint(curvery, center, 0.006);

    //fillPath(head, dab);

    

   
    //stroke(head, {x: 50, y: 50}, {x: 400, y: 400}, 10, 5, 2);
    head.ctx.fillStyle = "black"
    //strokePoints(head, ppp, 5, 1);
    let ahhh = interpCurvePoints(ppp, 0.4, false)
    //strokePoints(head, ahhh, 2, 2)

    head.saveImage('./Iwantdie.png')
}

tester();

//createHead(5, 5, 5);
