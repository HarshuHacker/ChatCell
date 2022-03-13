const User = require("../../../Models/user")
const jwt = require("jsonwebtoken")
const env = require("../../../Config/environment")

module.exports.createSession = async function(req,res)
{
  try
  {
    let user = await User.findOne({
      email: req.body.email
    })
  
    if(!user || user.password != req.body.password){
      return res.json(422, {
        message: "Invalid Usertname Or Password"
      })
    }
  
    return res.json(200, {
      message: "Sign In Successfully, Here Is Your Token. Please Keep It Safe",
      data: {
        token: jwt.sign(user.toJSON(), env.jwt_secret_or_key, {expiresIn: "100000"})
      }
    })
  }
  catch(err)
  {
    console.log("Error : ",err)
    return res.json(500, {
      message: "Internal Server Error"
    })
  }
}