let socket = io();

$(document).ready(function(){
    socket.emit('get-connectedplayers')
    console.log("Ok")
    $.ajax({
        type: "GET",
        url: "/ipaddress",
        dataType: "HTML",
        success: function (response) {
            document.querySelector('#ipaddr').innerHTML = response;
            new QRCode(document.getElementById("qrcode"), {text:"http://"+response,width: 128, height: 128});
        },
        error: function (obj, textStatus, errorThrown) {
            console.log("Error "+textStatus+": "+errorThrown);
        }
    });
})

socket.on('server', (body)=>{
    if (body["command"]=="movecursor") {
        moveCursor(body["content"])
    } else {
        console.error("SOCKET ERROR: Command not recognised.")
    }
});

function displayplayer(usernamelist){
    console.log(usernamelist)
    for (let a in usernamelist){
        if (!(document.querySelector("#playerlist").contains(document.querySelector("#"+a)))) {
            let element = document.createElement("p");
            element.innerHTML = a;
            element.id = a;
            document.querySelector("#playerlist-list").prepend(element)
        }
    };
    $("#playerlist-list > p").each((index, elem) => {
        if (!(elem.id in usernamelist)){
            document.getElementById(elem.id).remove()
        };
      });
}
socket.on("server-updateplayers", (body)=>{
    displayplayer(body);
});
socket.on("give-connectedplayers", (body)=>{
    displayplayer(body);
});
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

let detectOverlap = (function () {
function getPositions(elem) {
    let pos = elem.getBoundingClientRect();
    return [[pos.left, pos.right], [pos.top, pos.bottom]];
}

function comparePositions(p1, p2) {
    let r1, r2;
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
    let pos1 = getPositions(a),
        pos2 = getPositions(b);
    return comparePositions(pos1[0], pos2[0]) && comparePositions(pos1[1], pos2[1]);
};
})();