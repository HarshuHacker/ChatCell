const queue = require("../Config/kue")
const commentsMailer = require("../mailers/comments_mailer")
queue.process("emails", function(job, done){
  console.log("Emails Worker Is Processing A Job")
  // accessing the job.data from the data sent through comments controller
  commentsMailer.newComment(job.data.comment, job.data.userDet.user.name, job.data.userDet.user.email)
  done()
})