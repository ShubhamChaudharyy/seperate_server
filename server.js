const app = require('express')()
const { v4: uuidv4 }=require(`uuid`)
var cors=require('cors')
const url=require('./constants')
var socket=require('socket.io')
const helper=require('./Routes/addUsers')

global["XMLHttpRequest"] = require("xmlhttprequest").XMLHttpRequest
const port=process.env.PORT || 5000
var io=socket(port)
app.use(cors())
var socket_id;
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://peercodingide.herokuapp.com');
    next();
});
const rooms=[]
var session_destroy=(chunk)=>{
    console.log(`Room has been disconnected`)
}
const video_rooms={}
console.log(rooms)
app.get('/room_creation/:room/:name',(req,res,next)=>{
    if(rooms[req.params.room]){
    return res.status(200).send('exist')
    }    
    rooms[req.params.room]=req.params.name
    console.log(rooms)
    return res.status(200).send('into route')
})
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
server.listen(port,()=>{
    console.log('connection estabilished')
})

