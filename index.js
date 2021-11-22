const express = require('express')
const socket = require('socket.io')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();
const port = process.env.PORT || 4000 
var server = app.listen(port,()=>{
    console.log("Server is up on ",port);
})
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');


var io = socket(server)

io.on('connection',socket=>{

    socket.on('create',(value)=>{
        const roomid = uniqueNamesGenerator({
            dictionaries: [adjectives, animals],
            length: 2
          })
          socket.join(roomid);
          socket.emit('roomid',roomid)
          io.to(roomid).emit('flag',"wait")
    })
    socket.on('join',(roomid)=>{
        socket.join(roomid)
        if (io.sockets.clients(roomid).length == 1) {
            io.to(roomid).emit('flag',"start")
        }
    }) 
})


