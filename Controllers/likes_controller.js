// likes_controller.js

const Like = require("../Models/like")
const Post = require("../Models/post")
const Comment = require("../Models/comment")

module.exports.toggleLike = async function(req,res)
{
  try{

    //likes/toggle/?id=abcdef&type=onModel
    let likeable
    // a variable deleted is false if there is like from before
    let deleted = false

    if(req.query.type == "Post"){
      likeable = await Post.findById(req.query.id).populate("likes")
    }
    else{
      likeable = await Comment.findById(req.query.id).populate("likes")
    }

    // Check if like already exists
    let existingLike = await Like.findOne({
      likeable: req.query.id,
      onModel: req.query.type,
      user: req.user._id
    })

    // If a like already exists then delete it
    if(existingLike){
      likeable.likes.pull(existingLike._id)
      likeable.save()

      existingLike.remove()
      deleted = true
    }
    else{
      //else make a new like
      let newLike = await Like.create({
        likeable: req.query.id,
        onModel: req.query.type,
        user: req.user._id
      })

      likeable.likes.push(newLike._id)
      likeable.save()
    }

    // for ajax request
    return res.json(200, {
      message: "Request Successful !!",
      data:{
        deleted: deleted
      }
    })
  }
  catch(err){
    console.log(err)
    return res.json(500,{
      message: "Internal Server Error"
    })
  }
}