$(document).ready(function(){
    $.ajax({
        type: "GET",
        url: "/ipaddress",
        dataType: "HTML",
        success: function (response) {
            document.querySelector('#ipaddr').innerHTML = response;
        },
        error: function (obj, textStatus, errorThrown) {
            console.log("Error "+textStatus+": "+errorThrown);
        }
    });
})

var socket = io();

socket.on('server', (body)=>{
    if (body["command"]=="movecursor") {
        moveCursor(body["content"])
    } else {
        console.error("SOCKET ERROR: Command not recognised.")
    }
});

socket.on('connect', () => {
    console.log("Connected to backend server.")
});

pos=[20,80];

function moveCursor(changePos){
    pos=[pos[0]+parseInt(changePos[0]), pos[1]+parseInt(changePos[1])];
    if (pos[0]<0){
        pos[0]=0;
    }
    if (pos[1]<0){
        pos[1]=0;
    }
    if (pos[0]>window.innerWidth-document.getElementById("mouse").clientWidth){
        pos[0]=window.innerWidth-document.getElementById("mouse").clientWidth;
    }
    if (pos[1]>window.innerHeight-document.getElementById("mouse").clientHeight){
        pos[1]=window.innerHeight-document.getElementById("mouse").clientHeight;
    }
    document.getElementById("mouse").style.left = pos[0]+"px";
    document.getElementById("mouse").style.top = pos[1]+"px";
    if (detectOverlap(document.getElementById("header"), document.getElementById("mouse"))){
        document.getElementById("header").style.color="red";
    } else {
        document.getElementById("header").style.color="black";
    }
}

var detectOverlap = (function () {
function getPositions(elem) {
    var pos = elem.getBoundingClientRect();
    return [[pos.left, pos.right], [pos.top, pos.bottom]];
}

function comparePositions(p1, p2) {
    var r1, r2;
    if (p1[0] < p2[0]) {
    r1 = p1;
    r2 = p2;
    } else {
    r1 = p2;
    r2 = p1;
    }
    return r1[1] > r2[0] || r1[0] === r2[0];
}

return function (a, b) {
    var pos1 = getPositions(a),
        pos2 = getPositions(b);
    return comparePositions(pos1[0], pos2[0]) && comparePositions(pos1[1], pos2[1]);
};
})();