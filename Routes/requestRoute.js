module.exports=(req,res,next)=>{
    if(rooms[req.params.room]){
    return res.status(200).send('exist')
    }    
    rooms[req.params.room]=req.params.name
    console.log(rooms)
    return res.status(200).send('into route')
}