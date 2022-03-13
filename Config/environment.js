const fs=require("fs")
const rfs = require("rotating-file-stream")
const path = require("path")

const logDirectory = path.join(__dirname,"../production_logs")
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory
})

const development = {
  name : "development",
  asset_path: "./Assets",
  session_cookie_key: "Blah",
  db: "chatcell_production",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "harshisindian@gmail.com",
      pass: "ayushpogo2000"
    }
  },
  google_client_id: "131425656802-t9t4agqq69n2o6pr7jcoq5ttp9pqsnib.apps.googleusercontent.com",
  google_client_secret: "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",
  google_call_back_url: "http://localhost:8000/users/auth/google/callback",
  jwt_secret_or_key: "CHATCELL",
  morgan: {
    mode: "dev",
    options: {stream: accessLogStream}
  }
}

const production = {
  name : "production",
  asset_path: process.env.CHATCELL_ASSET_PATH,
  session_cookie_key: process.env.CHATCELL_SESSION_COOKIE_KEY,
  db: process.env.CHATCELL_DB,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.CHATCELL_USER_EMAIL,
      pass: process.env.CHATCELL_USER_PASSWORD
    }
  },
  google_client_id: process.env.CHATCELL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.CHATCELL_GOOGLE_CLIENT_SECRET,
  google_call_back_url: process.env.CHATCELL_GOOGLE_CALL_BACK_URL,
  // google_call_back_url: "http://chatcell.com/users/auth/google/callback",
  jwt_secret_or_key: process.env.CHATCELL_JWT_SECRET_OR_KEY,
  morgan: {
    mode: "combined",
    options: {stream: accessLogStream}
  }
}

// module.exports = eval(process.env.CHATCELL_ENVIRONMENT)==undefined ? development : eval(process.env.CHATCELL_ENVIRONMENT)
module.exports = development
// module.exports = production