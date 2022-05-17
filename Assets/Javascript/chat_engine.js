// this class will send a request for connection
class ChatEngine{
  // this will take id of the chat box and the email id of the user who is initiating the connection
  constructor(chatBoxId, userEmail){
    this.chatBox = $(`#${chatBoxId}`)
    this.userEmail = userEmail

    // initiating the connection
    // this.socket = io.connect("http://52.200.39.191:4000")
    this.socket = io.connect("http://localhost:4000")

    // only if the user has initialized a connection
    if(this.userEmail){
      this.connectionHandler()
    }
  }

  connectionHandler(){
    let self = this
    // this will have to and fro interaction between the server and the user
    this.socket.on("connect", function(){
      console.log("Connection Established Using Sockets ..")

      self.socket.emit("join_room", {
        user_email: self.userEmail,
        chatroom: "chatcell"
      })

      self.socket.on("user_joined", function(data){
        console.log("A User Joined !! ", data)
      })
    })

    // send a message on clicking the send message button
    $("#send-message").click(function(){
      let msg = $("#chat-message-input").val()
      console.log("Message : ",msg)

      if(msg != ""){
        self.socket.emit("send_message", {
          message: msg,
          user_email: self.userEmail,
          chatroom: "chatcell"
        })
      }
    })

    self.socket.on("receive_message", function(data){
      console.log("message received", data.message)
      let newMessage = $("<li>")
      let messageType = "other-message"
      if(data.user_email == self.userEmail){
        messageType = "self-message"
      }

      newMessage.append($("<span>", {
        "html": data.message
      }))

      newMessage.append($("<div>",{
        "html": data.user_email
      }))

      newMessage.addClass(messageType)
      $("#chat-messages-list").append(newMessage)
    })

  }
}