// script.js

// Requiring Express As It Is A Framework
const express=require("express")

// Requiring environment.js from config folder
const env = require("./Config/environment")

// Require Morgan For Access Log
const logger=require("morgan")

// Storing Express Into A Const 
const app=express()

// passing app to the function at the given path
require("./Config/view_helpers")(app)

// Assigning A Port Number
const port=8000

// Requiring Cookie Parser Used To Read And Write Into The Cookies
const cookieParser=require("cookie-parser")

// Requiring Express-EJS-Layouts For Using Layout.ejs
const expressLayouts=require("express-ejs-layouts")

// Requiring To Connect to Database
const db=require("./Config/Mongoose")

// Requiring Express-Session For Creating A Session
const session=require("express-session")

// User For Session Cookie
// Requiring Passport
const passport=require("passport")
// Requiring Passport-Local-Strategy
const passportLocal=require("./Config/passport-local-strategy")
// Requiring Passport-JWT-Strategy
const passportJWT=require("./Config/passport-jwt-strategy")
// Requiring Passport-Google-Strategy
const passportGoogle=require("./Config/passport-google-oauth2-strategy")
// to store session information in mongoStore
const MongoStore = require("connect-mongo")

// For Using SASS Instead of CSS
const sassMiddleware=require("node-sass-middleware")

//For Notification
const flash = require("connect-flash")

// Requiring Custom Middleware
const customMware = require("./Config/Middleware")

// set up the chat server to be used with socket.io
const chatServer = require("http").Server(app)
// passing chatserver to the chatSockets function at the given path
const chatSockets = require("./Config/chat_sockets").chatSockets(chatServer)
// creating a port for chatServer
chatServer.listen(4000)
console.log("Chat Server Is Listening On Port 4000")

// Requiring Path
const path = require("path")

// Use this only if the environment is set to development mode
if(env.name == "development"){
    // Setting Up SASS 
    console.log("Deve")
    app.use(sassMiddleware({
        // path from where we pich SASS file
        src: path.join(__dirname, env.asset_path, "SASS"),
        // path where we put CSS files
        dest: path.join(__dirname, env.asset_path, "CSS"),
        // If We Want to see the errors in the compilation of files
        debug: false,
        // Use compressed if we want the css in one line
        outputStyle: "extended",
        // The Location where the server should look for css files
        prefix: "/CSS", 
        //Make it false For SCSS and true for SASS
        indentedSyntax: true 
    }))
}
else{
    console.log("Prod")
}

// Used For Storing Inputs From The User
app.use(express.urlencoded({extended: false}))

// Used To Read And Write Into The Cookies
app.use(cookieParser())

// Used If we want to use layouts
app.use(expressLayouts)

// Used For Accessing Assets Like CSS Javascript & Images
app.use(express.static(env.asset_path))

// Make uploads path available to the browser
app.use("/uploads",express.static(__dirname + "/uploads"))

// Takes The Mode and Options To Be Dispalyed In The Logs File
app.use(logger(env.morgan.mode, env.morgan.options))

// Used When We Want To Apply Specific Styles And Scripts For Different EJS File Using Same Layouts
// For Styles
app.set("layout extractStyles",true)
// For Scripts
app.set("layout extractScripts",true)

// Setting EJS As View Engine
app.set("view engine","ejs")

// Setting Up The Views Path
app.set("views","./Views")

// Creating A Session
// MongoStore is used to store the session cookie in the db
app.use(session({
    name: "ChatCell",
    // Secret Key To Encrypt The Session Cookie Key
    secret: env.session_cookie_key,
    // When The User Is logged out then we don't need to store information
    saveUninitialized:false,
    // If We want to rewrite the session data into the session store even if there is no change
    resave:false,
    // Setting Up The properties for the cookie
    cookie:{
        maxAge:(1000*60*100) // The Time After Which The Cookie Will Expire
    },
    store:MongoStore.create(
        {
            // the location where the cookie will be stored
            mongoUrl: "mongodb://localhost/chatcell_development-sir",
            // if we want the cookie to be removed automatically
            autoRemove: "disabled"
        },
        // If Error occurs in storing the cookie
        function(err){
            console.log(err || "Connect MongoDB setup OK")
        }
    )
}))

// Used For Initializing Passport
app.use(passport.initialize())
// Used For Allowing Passport To Use The Session
app.use(passport.session())
// Used To Authenticate User
app.use(passport.setAuthenticatedUser)

// For Showing Notification
app.use(flash())
app.use(customMware.setFlash)

// Setting Routes Path
app.use("/",require("./Routes/route"))

// Setting Up The Port
app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server: ${err}`)
        return
    }
    console.log(`Server is running on port: ${port}`)
})