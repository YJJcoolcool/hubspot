const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

console.log(__dirname)
app.use(express.static(__dirname))
app.use(bodyParser.urlencoded())

app.get('/messages', (req,res)=>{
    res.send("hello")
})
app.post('/controller/post', (req,res)=>{
    //console.log(req.body['changepos'])
    io.emit('updatemouse', req.body['changepos'])
    res.sendStatus(200)
})
io.on('connection', (socket) => {
    console.log("A user connected.")
})
var server = http.listen(80, ()=>{
    console.log("Server is listening on port "+server.address().port)
});