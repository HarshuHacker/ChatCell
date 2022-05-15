// this will receive a request for connection 
module.exports.chatSockets = function(socketServer){
  const Server = require('socket.io');
  //It will be handling the connections
  let io = Server(socketServer, {
    // Fixing the cors issue
    cors: {
        // origin: "http://52.200.39.191"
        origin: "http://localhost:8000"
    }
  });

  // let io = require("socket.io")(socketServer)

  // when a connection is made this automatically sends an acknowledgement to the connectionHandler that a connection has been established
  io.sockets.on("connection", function(socket){
    console.log("New Connection Received", socket.id)

    socket.on("disconnect", function(){
      console.log("Socket Disconnected !!")
    })


    socket.on("join_room", function(data){
      console.log("Joining Request Recived ", data)
      // if a chat room exist then the user will be sent to the chat room else a chat room will be created and a user will be sent 
      socket.join(data.chatroom)
      // inform everyone that someone has joined the room
      io.in(data.chatroom).emit("user_joined", data)

      // detect send_message and broadcast to everyone in the room
      socket.on("send_message", function(data){
        io.in(data.chatroom).emit("receive_message", data)
      })
    })
  })
}