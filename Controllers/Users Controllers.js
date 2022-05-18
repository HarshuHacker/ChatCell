// Users Controllers.js

const User = require("../Models/user")
const fs = require("fs")
const path = require("path")
const ResetPassword = require("../Models/reset_passwordToken")
const crypto = require("crypto")
const forgotMailer = require('../mailers/forgotPasswordMailer');
const forgotpasswordWorker = require('../workers/forgotemail_worher');
const queue = require("../Config/kue")


module.exports.profile=async function(req,res)
{
  let user = await  User.findById(req.params.id);
  let isfriendOrNot = await User.findById(req.user.id);
  // console.log('user',user); 

  // console.log('isfriendorNot',isfriendOrNot); 
  const friendOrNot = user.friendship.find((item) => item == req.user.id);
  return res.render("user_profile",
  {
    siteName:"ChatCell !!",
    profile_user: user,
    friendOrNot: friendOrNot
  })
}

module.exports.update = async function(req,res){
  if(req.user.id == req.params.id)
  {
    try{
      let user = await User.findById(req.params.id)
      User.uploadedAvatar(req,res,function(err){
        if(err)
        {
          console.log("Multer Error : ",err)
        }
        user.name = req.body.name
        user.email = req.body.email

        if(req.file)
        {
          if(user.avatar && fs.existsSync())
          {
            fs.unlinkSync(path.join(__dirname,"..",user.avatar))
          }
          // this is saving the path of the uploaded file into the avatar field in the user
          user.avatar = User.avatarPath + "/" + req.file.filename

        }
        user.save()
        return res.redirect("back")
      })
    }catch(err){
      req.flash("error",err)
      return res.redirect("back")
    }
  }
  else
  {
    req.flash('error', 'Unauthorized!');
    return res.status(401).send("Unauthorized")
  }
}

module.exports.signup=function(req,res)
{
    if(req.isAuthenticated())
    {
        return res.redirect("/users/profile")
    }
    return res.render("user_sign_up",{
        siteName:"Chatcell Sign Up"
    })
}

module.exports.signin=function(req,res)
{
    if(req.isAuthenticated())
    {
        return res.redirect("/")
    }
    return res.render("user_sign_in",{
        siteName:"Chatcell Sign In"
    })
}

module.exports.forget_passwordEmailSec =async function(req,res){

  //console.log('@ forgot password section')
//let accesstoken = crypto.randomBytes(20).toString('hex');
//console.log('accessToken=>',accesstoken);
//res.redirect('/');
try {
  //console.log(req.body);
  let user = await User.findOne({email:req.body.email});
  // console.log('users=>',user)
  if(user!=null){
      // checking wether access token exist or not
      let findUser = await ResetPassword.findOne({user: user._id})
      // console.log('finduser==>',findUser);
      if(findUser){
          let check= await ResetPassword.findOneAndUpdate({user: user._id},{isValid:true},{
              new: true
          })
          // console.log('ckecking logic',check)
          // sending mail
          //forgotMailer.frogotpasswordLink(check,user.email);
          
          newforgDetails = {
              restepassobj:check,
              email : user.email
             }
             let job= queue.create('forgotpassword',newforgDetails).save(function(err){
                  if(err){console.log('error isn sending queue',err);return;};
                  console.log('job enqueued',job.id);
              })


      }else {

          let accesstoken = crypto.randomBytes(20).toString('hex');
          
          let restepassobj = await ResetPassword.create({
              user:user._id,
              accessToken : accesstoken,
              isValid: true

              });
             // forgotMailer.frogotpasswordLink(restepassobj,user.email);
             newforgDetails = {
              restepassobj:restepassobj,
              email : user.email
             }
             let job= queue.create('forgotpassword',newforgDetails).save(function(err){
                  if(err){console.log('error isn sending queue',err);return;};
                  console.log('job enqueued',job.id);
              })

              // console.log('restll=>',restepassobj)
          }
     
  }else{
      console.log('user not found');
      return res.redirect('/users/forgetPassword');
  }
  
} catch (error) {
      console.log('cannot find user',error)
}


return res.redirect('/');

}

// this is for forgot password logic
module.exports.forgetPassword = function(req,res){
//console.log('@ forgot password section')
// let accesstoken = crypto.randomBytes(20).toString('hex');
// console.log('accessToken=>',accesstoken);

return res.render('forgotPasswordEmailPage',{
  siteName:'codeial | forgot'
  //accesstoken: accesstoken
});

}

// reset password link
module.exports.reset_password =async function(req,res){

//    console.log(req.query.access_token);
let resrtaccfind = await ResetPassword.findOne({accessToken:req.query.access_token})
console.log('cheking restisdsa',resrtaccfind)
if(resrtaccfind){
  
  // console.log(resrtaccfind);
  // checking if the toke is valid

  if(resrtaccfind.isValid){
      res.locals.isValid = true ;    
   let userDet =await ResetPassword.findOne({user:resrtaccfind.user}).populate('user').exec(); // populating username from post
      
      console.log('it is valid and user det',resrtaccfind.isValid,userDet);
      res.locals.userDetaislpass = userDet
  }else{
      console.log('it isNot  valid',resrtaccfind.isValid);

  }

}else{
  console.log('invalid user id')
}
return res.render('forget_pass',{
  siteName:'codeial | forgot password page'
  
})

}


module.exports.forget_updata_password =async function(req,res){
// console.log('post section',req.query.reset_email);
// console.log('passwords',req.body.password,req.body.cnfpassword);

if(req.body.password == req.body.cnfpassword){
  console.log('password match')
  let userdet = await User.findOneAndUpdate({email:req.query.reset_email},{password:req.body.password},{
      new: true
  });
  // console.log('changepsot=>',userdet); 

  if(userdet){
     let uss= await ResetPassword.findOneAndUpdate({user:userdet._id},{isValid:false},{
         new:true
     })
      // console.log('isis=>',uss);
  }
 
}else{
  console.log('password does not match');
  return res.redirect('back');
}
return res.redirect('/users/sign-in');
}

module.exports.create=function(req,res)
{
    if(req.body.password != req.body.cnf_password)
    {
      req.flash("error", "Password And Confirm Password Doesn't Match :(");
      return res.redirect("back")
    }

    User.findOne({email: req.body.email},function(err,user)
    {
        if(err)
        {
          req.flash("error", "Error In Finding The User In Signing Up"); 
          return
        }

        if(!user)
        {
          User.create(req.body,function(err,user)
          {
            if(err)
            {
              req.flash("error", "Error In Creating The User While Signing Up"); 
              return
            }
            return res.redirect("/users/sign-in")
          })
        }
        else
        {
          req.flash('success', 'You have signed up, login to continue!');
          return res.redirect('back');
        }
    })
}

module.exports.createSession=function(req,res)
{
    req.flash("success","You Have Logged In Successfully !!")
    return res.redirect("/")
}

module.exports.destroySession=function(req,res)
{
    req.logout()
    req.flash("success","You Have Logged Out Successfully !!")
    return res.redirect("/")
}