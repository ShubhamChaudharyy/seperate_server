var firebase=require('../Firebase_Helper/Firebase')
var helper=require('../Routes/addUsers');
const { addUser } = require('../Routes/addUsers');
var socket_id;
joinVerify=(data,callback)=>{
    data.id=socket_id;
    const { user , error } = addUser( data )
    if(error)
    return callback(error)
    socket.emit('welcome',{user:'admin',text:`${user.name} welcome to the room`})
    socket.join(user.room)
    callback()
}
module.exports.
module.catch_code_request=(data)=>{

}
module.exports.catch_socket_id=(id)=>{
socket_id=id
}
