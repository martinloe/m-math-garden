const BACKGROUND_COLOR = '#000000';
const LINE_COLOR = '#FFFFFF';
const LINE_WIDTH = 15;

var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;

var isPainting = false;
var canvas;
var context;


function prepareCanvas() {
    // console.log('Preparing canvas');
    canvas = document.getElementById('drawingCanvas');
    context = canvas.getContext('2d');

    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);
    context.strokeStyle = LINE_COLOR;
    context.lineWidth = LINE_WIDTH;
    context.lineJoin = 'round';

    document.addEventListener('mousedown', function (event) {
        // console.log('CLICK! x:',event.clientX,', y:',event.clientY);
        isPainting = true;
        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;
    });
    document.addEventListener('mousemove', function (event) {
        if (isPainting) {
            previousX = currentX;
            previousY = currentY;
            currentX = event.clientX - canvas.offsetLeft;
            currentY = event.clientY - canvas.offsetTop;
            
            // console.log(`Current X: ${currentX}, current Y: ${currentY}`);
    
            draw();
        }
    });

    document.addEventListener('mouseup', function (event) {
        // console.log('Mouse released! x:',event.clientX,', y:',event.clientY);
        isPainting = false;
    })

    canvas.addEventListener('mouseleave', function (event) {
        isPainting = false;
    })

    canvas.addEventListener('touchstart', function (event) {
        // console.log('Touchdown! x:',event.touches[0].clientX,', y:',event.touches[0].clientY);
        isPainting = true;
        currentX = event.touches[0].clientX - canvas.offsetLeft;
        currentY = event.touches[0].clientY - canvas.offsetTop;        
    });

    canvas.addEventListener('touchmove', function (event) {
        if (isPainting) {
            previousX = currentX;
            previousY = currentY;
            currentX = event.touches[0].clientX - canvas.offsetLeft;
            currentY = event.touches[0].clientY - canvas.offsetTop;
            
            // console.log(`Current X: ${currentX}, current Y: ${currentY}`);
    
            draw();
        }        
    });

    document.addEventListener('touchend', function (event) {
        isPainting = false;        
    });

    canvas.addEventListener('touchcancel',function (event) {
        isPainting = false;        
    });
};

function draw() {
    context.beginPath();
    context.moveTo(previousX, previousY);
    context.lineTo(currentX, currentY);
    context.closePath();
    context.stroke();
}

function clearCanvas(params) {
    var currentX = 0;
    var currentY = 0;
    var previousX = 0;
    var previousY = 0;
    
    context.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);
}