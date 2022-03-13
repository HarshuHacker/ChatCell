// passport-local-strategy.js (Config)

// Requiring Passport
const passport=require("passport") 
// Requiring Passport Local Strategy
const LocalStrategy=require("passport-local").Strategy
//Requiring The User-Model
const User=require("../Models/user")
const env = require("./environment")

// Telling Passport To Use Local Strategy
passport.use(new LocalStrategy(
  {
    // The Field Which Need to Be Unique
    usernameField: "email",
    passReqToCallback: true
  },
  // The Email Password Entered By The User
  function(req,email,password,done)
  {
    User.findOne({email:email},function(err,user)
    {
      // If Error Occurs
      if(err)
      {
        req.flash("error",err)
        return done(err)
      }

      // If Password Is Incorrect Or The User With Given Email-id Is Not Found
      if(!user || user.password!=password)
      {
        req.flash("error","Invalid Username Or Password")
        return done(null,false)
      }

      // If The User Is Found
      return done(null,user)

    })
  }
))

// Serializing The User To Decide Which Key Is To Be Kept In The Cookies
passport.serializeUser(function(user,done)
{
  // Passing Null For No Error And user_id To Store The Encrypted Content
  done(null,user.id)
})

// De-Serializing The User From The Key In The Cookies
passport.deserializeUser(function(id,done)
{
  User.findById(id,function(err,user)
  {
    // If Error Occurs
    if(err)
    {
      console.log("Error In Finding User --> Passport")
      return done(err)
    }

    // If No Error Occurs
    return done(null,user)
  })
})

passport.checkAuthentication=function(req,res,next)
{
  if(req.isAuthenticated())
  {
    return next()
  }
  return res.redirect("/users/sign-in")
}

passport.setAuthenticatedUser=function(req,res,next)
{
  if(req.isAuthenticated())
  {
    // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
    res.locals.user=req.user
  }
  next()
}

module.exports=passport