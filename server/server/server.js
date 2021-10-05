let socket = io();
let cursors = {};

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

// Function to create the player text element on screen
function displayplayer(usernamelist){
    console.log(usernamelist)
    for (let a in usernamelist){
        if (!(document.querySelector("#playerlist").contains(document.querySelector("#"+a)))) {
            let element = document.createElement("p");
            element.innerHTML = a;
            element.id = a;
            document.querySelector("#playerlist-list").prepend(element)
            cursors[a] = new Cursor(a);
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
socket.on("moveCursor", (body)=>{
    cursors[body[0]].move(body[1],body[2]);
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

class Cursor{
    constructor(username){
        this.username = username;
        this.element = document.createElement("div");
        this.X=0;
        this.Y=0;
        this.element.style = "position: absolute; left:0px; top:0";
        this.element.id = username;
        this.element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-up-left" width="44" height="44" viewBox="0 0 24 24" stroke-width="3" stroke="#'+Math.floor(Math.random()*16777215).toString(16)+'" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="7" y1="7" x2="17" y2="17" /><polyline points="16 7 7 7 7 16" /></svg>';
        document.body.appendChild(this.element);
    }
    move (x,y){
        this.X+=x;
        this.Y+=y;
        this.element.style.left = this.X+"px";
        this.element.style.top = this.Y+"px";
    }
}