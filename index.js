const express = require('express');
const {createServer} = require('http');
const { use } = require('react');
const {Server} = require('socket.io');
const port = 3000;


const app = express()
const httpserver = createServer(app);
const io = new Server(httpserver);


io.on('connection', async (socket) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('A user just connected with ID : ' + socket.id);


    socket.emit('welcome','welcome to the chat your id is :' + socket.id) //sending a message to a perticuler user
    io.emit('commen message','this is a common message')  // sending a message to all the users
    
    socket.broadcast.emit('users','a new user has joined , id : '+ socket.id)  // sending a message to all the rest of the users
    socket.on('chat message',(msg) => {console.log('recieved data : ' + msg);  // listening the mesage user sends

    })

    socket.on('make announcement' , (message) => {
        socket.broadcast.emit('get announcement', message)
    })

    socket.on('private message',({userId,message}) => {
        socket.to(userId).emit("get message" , {
            senderId : socket.id,
            message,
            userId
        })
    })

    socket.on('disconnect', () => {
        console.log('A user just disconnected with ID : ' + socket.id);
    })  
    })


app.get('/',(req,res) => {
    return res.json({
        message : "api is working"
    })
})

httpserver.listen(port , ()=>{
    console.log("server is running on the port number : ",port);
    
})