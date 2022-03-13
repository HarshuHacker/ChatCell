// Requiring Passport
const passport=require("passport") 
// Requiring Passport Local Strategy
const JWTStrategy=require("passport-jwt").Strategy
// Extracting Passport JWT Strategy
const ExtractJWT = require("passport-jwt").ExtractJwt
const User = require("../Models/user")
const env = require("./environment")


let opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwt_secret_or_key
}

passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){
  User.findById(jwtPayLoad._id, function(err, user){
    if(err)
    {
      console.log("Error In Finding User From JWT")
      return
    }
    if(user)
    {
      return done(null, user)
    }
    else
    {
      return done(null, false)
    }
  })
}))

module.exports = passport