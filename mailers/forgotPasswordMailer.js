const nodeMailer = require('../Config/nodemailer');
const User = require("../Models/user")

exports.frogotpasswordLink = function(resetpassobj,email){
    console.log('forgetpsooo==>',resetpassobj);
    User.findById(resetpassobj.user,function(err,userName){
        let htmlString = nodeMailer.renderTemplate({resetpassobj: resetpassobj, email: email, userName: userName.name},'/forgotEmail/forgotEmailtemp.ejs');
            nodeMailer.transporter.sendMail({
            from:"admin@chatcell.com",
            to:email,
            subject:'Reset Password',
            //html:'<h1> yup, your comment is now published link is http://localhost:8000/user/reset_password/?sadas</h1>'
            //html:'<h1> yup, your comment is now published link is http://localhost:8000/user/reset_password/?access_token='+resetpassobj.accessToken +'</h1>'
            
            html:htmlString
        },(err,info)=>{ // in case if there is some error
            if(err){console.log('errroe in sending mail',err); return}
            console.log('Message sent',info);
            return;
        
        })
    })
    

}