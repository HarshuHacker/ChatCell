// forgot_pass.js (Models)

const mongoose=require("mongoose")

const restPasswordSchema=new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  accessToken : {
    type: String,
    required: true
  },
  isValid: {
    type: Boolean,
    default: true
  }
},{
  timestamps:true
})

const ResetPassword=mongoose.model("ResetPassword",restPasswordSchema)
module.exports=ResetPassword