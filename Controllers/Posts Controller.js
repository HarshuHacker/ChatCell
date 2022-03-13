// Posts Controller.js

const Post=require("../Models/post")
const Comment=require("../Models/comment")
const Like=require("../Models/like")

module.exports.create= async function(req,res){
  if(typeof(req.user)!="undefined")
  {
    try{

      let post = await Post.create({
        content: req.body.content,
        user: req.user._id
      })


      if(req.xhr){
        // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!

        // post = await post.populate("user", "name").execPopulate();
        let userDet = await Post.findOne({user:req.user._id}).populate('user').exec(); 
        // populating username from post

        return res.status(200).json({
          data: {
            post: post,
            userDet: userDet
          },
          message: "Post Created !"
        })
      }
      req.flash("success","Post Created Successfully !!")
      return res.redirect("back")

    }
    catch(err)
    {
      req.flash("error",err)
      return res.redirect("back")
    }
  }
  else
  {
    req.flash("error","Sign In First")
    return res.redirect("/users/sign-in")
  }
}

module.exports.destroy= async function(req,res){
  try {
    let post = await Post.findById(req.params.id)

    if(post.user == req.user.id)
    {
      //delete all the likes associated with the post and all the likes on the comment associated with this post
      await Like.deleteMany({likeable: post,onModel: "Post"})
      await Like.deleteMany({_id: {$in: post.comments}})

      post.remove()
      await Comment.deleteMany({post: req.params.id})
      if(req.xhr){
        return res.status(200).json({
          data: {
            post_id: req.params.id
          },
          message: "Post Deleted !"
        })
      }
      req.flash("success","Post Deleted Successfully !!")
      return res.redirect("back")
    }
    else
    {
      req.flash("error","You Are Not Authorized To Delete The Post :(")
      return res.redirect("back")
    }
  }
  catch(err)
  {
    req.flash("error",err)
    return res.redirect("back")
  }
}