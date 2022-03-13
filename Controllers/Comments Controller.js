// Comments Controller.js

const Comment=require("../Models/comment")
const Post=require("../Models/post")
const queue = require("../Config/kue")
const Like = require("../Models/like")

// For Creating A Comment
module.exports.create = async function(req,res){
  try 
  {
    // Finding The Post
    let post = await Post.findById(req.body.post)
    if(post)
    {
      // Creating Comment
      let comment = await Comment.create(
      {
        content: req.body.content,
        user: req.user._id,
        post: req.body.post
      })

      // Pushing The Comment Created into the array comments in the post model
      post.comments.push(comment)
      post.save()
      
      // populating user model 
      let userDet =await Comment.findOne({user:req.user._id}).populate('user').exec();

      // putting this into the queue and sending to the kue file in the config folder
      let job = queue.create("emails", {comment, userDet}).save(function(err){
        if(err)
        {
          console.log("Error In Sending To THe Queue : ",err)
          return
        }
        console.log("Job Enqueued : ",job.id)
      })

      // For Ajax Request
      if (req.xhr){
        return res.status(200).json({
            data: {
                comment: comment,
                userDet: userDet
            },
            message: "Post created!"
        });
    }

      req.flash("success","Comment Added Successfully")
      res.redirect("/")

    }
  }
  catch (err)
  {
    req.flash("error",err)
    return res.redirect("back")
  }
}

// For Deleting A Comment
module.exports.destroy = async function(req,res){
  try 
  {
    // Searching For the comment
    let comment = await Comment.findById(req.params.id)
    // Checking If the user trying to delete the comment is same as the user who created the comment
    if(comment.user == req.user.id)
    {
      // storing the post associated with the comment
      let postId = comment.post
      comment.remove()

      // Removing the specific comment from the post
      let post = await Post.findByIdAndUpdate(postId,{$pull:{comments: req.params.id}})
      //delete all the likes associated with the comments
      await Like.deleteMany({likeable : comment._id, onModel : "Comment"})
      
      // for ajax call
      if (req.xhr)
      {
        return res.status(200).json(
          {
            data: {
              comment_id: req.params.id
              },
              message: "Post deleted"
          });
      }

      req.flash("success","Comment Deleted Successfully")
      return res.redirect("back")
    }
    else
    {
      req.flash("error","You Are Not Authorized To Delete The Comment :(")
      return res.redirect("back")
    }
  } 
  catch (err) 
  {
    req.flash("error",err)
    return res.redirect("back")
  }
}