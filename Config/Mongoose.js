// Mongoose.js (Config)

// Requiring Mongoose to connect the server with mongo db
const Mongoose=require("mongoose")


const env = require("../Config/environment")

// Connecting mon
Mongoose.connect(`mongodb://localhost/${env.db}`)

// 
const db=Mongoose.connection

// If error occurs in connecting to the mongo db
db.on("error",console.error.bind(console,"Error In Connecting To Database"))

// If the connection is established
db.once("open",function(){
  console.log("Sucessfully Connected To Database :)")
})

module.exports = db;