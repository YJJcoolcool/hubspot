const formSubmitURL = window.location+"post"
const socket = io.connect('http://'+window.location.host);

const username = sessionStorage.getItem("username");

document.onmousedown = mouseDown;
document.ontouchstart = mouseDownTouch;

var originalPos = [0,0]
var newPos = [0,0]
var change = [0,0]

function mouseDown(e){
    originalPos=[e.clientX,e.clientY]
    document.onmouseup = closeDrag;
    document.onmousemove = mouseMove;
}

function mouseDownTouch(e){
    var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];
    originalPos = [Math.round(touch.pageX), Math.round(touch.pageY)]
    document.ontouchend = closeDragTouch;
    document.ontouchmove = mouseMoveTouch;
}

function mouseMove(e){
    newPos = [e.clientX,e.clientY]
    change = [newPos[0]-originalPos[0],newPos[1]-originalPos[1]]
    originalPos = [e.clientX,e.clientY]
    //document.getElementById("coords").innerHTML=change
    moveCursor(change[0], change[1])
}

function mouseMoveTouch(e){
    var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
    var touch = evt.touches[0] || evt.changedTouches[0];
    newPos = [Math.round(touch.pageX), Math.round(touch.pageY)]
    change = [newPos[0]-originalPos[0],newPos[1]-originalPos[1]]
    originalPos = [Math.round(touch.pageX), Math.round(touch.pageY)]
    //document.getElementById("coords").innerHTML=change
    moveCursor(change[0], change[1])
}

function moveCursor(X,Y){
    socket.emit("moveCursor",[username,X,Y]);
}

function closeDrag(){
    document.onmouseup = null;
    document.onmousemove = null;
}

function closeDragTouch(){
    document.ontouchend = null;
    document.ontouchmove = null;
}