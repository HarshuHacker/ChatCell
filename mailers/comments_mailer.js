const nodemailer = require("../Config/nodemailer")

// this is an another way of exporting a method
exports.newComment = function(comment, userName, email){
  let htmlString = nodemailer.renderTemplate({comment: comment,userName: userName},"/comments/new_comment.ejs")

  nodemailer.transporter.sendMail({
    from: "admin@chatcell.com",
    to: email,
    subject: "A New Commnet Is Published",
    html: htmlString
  },function(err, info)
  {
    if(err)
    {
      console.log("Error Occurred While Sending The Mail : ", err)
      return 
    }
    console.log("Mail Delivered Successfully :) ")
    // console.log("Mail Delivered Successfully :) ", info)
    return
  })
}