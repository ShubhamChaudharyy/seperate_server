const app = require('express')()
const server = require('http').Server(app);
const { v4: uuidv4 }=require(`uuid`)
var cors=require('cors')
const url=require('./constants')
var socket=require('socket.io')
const requestRoute=require('./Routes/requestRoute')
const helper=require('./Routes/addUsers')
var io=socket(server)
global["XMLHttpRequest"] = require("xmlhttprequest").XMLHttpRequest

app.use((req, res, next) => {

var socket_id;
const rooms=[]
var session_destroy=(chunk)=>{
    console.log(`Room has been disconnected`)
}
const video_rooms={}
console.log(rooms)
res.setHeader('Access-Control-Allow-Origin', "*");
res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
next();
})
app.use('/room_creation/:room/:name',requestRoute)
var newConnection=(socket)=>{
    console.log(socket.id)
    socket.on('join',(data,callback)=>{
        console.log(`${data} created`)
        socket.join(data)
        callback()
    })
    socket.on('disconnect',session_destroy)
    socket.on('code_request',(data,callback)=>{
        console.log(data)
        socket.to(data.room).broadcast.emit('receive',data.value)
        callback()
    })
    socket.on('draw_peer',(data)=>{
        socket.to(data.room).broadcast.emit('draw_peer_catch',data)
    })    
    socket.on("join room", roomID => {
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
        } else {
            rooms[roomID] = [socket.id];
        }
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        if (otherUser) {
            socket.emit("other user", otherUser);
            socket.to(otherUser).emit("user joined", socket.id);
        }
    });

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });
}
io.sockets.on('connection',newConnection)
server.listen(5000,()=>{
    console.log('connection estabilished')
})

