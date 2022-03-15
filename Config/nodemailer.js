const nodemailer = require("nodemailer")
const ejs = require("ejs")
const path = require("path")
const env = require("./environment")

let transporter = nodemailer.createTransport(env.smtp)

let renderTemplate = function(data, relativePath){
  let mailHTML
  ejs.renderFile(
    path.join(__dirname, "../Views/mailers", relativePath),
    data,
    function(err, template){
      if(err)
      {
        console.log("Error In Rendering The Template : ",err)
        return
      }
      mailHTML = template
    }
  )
  return mailHTML
}

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate
}