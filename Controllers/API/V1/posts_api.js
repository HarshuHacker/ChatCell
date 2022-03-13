const Post = require("../../../Models/post")
const Comment = require("../../../Models/comment")

module.exports.index = async function(req,res)
{

  let post = await Post.find({})
  .sort("-createdAt")
  .populate("user")
  .populate({
      path: "comments",
      populate: {
          path: "user"
      }
  })

  return res.json(200, {
    message: "List Of Posts V1",
    posts: post
  })
}

module.exports.destroy = async function(req,res){
  try {
    let post = await Post.findById(req.params.id)
    
    if(post.user == req.user.id)
    {
      post.remove()
      await Comment.deleteMany({post: req.params.id})

      return res.json(200, {
        message: "Post Deleted Successfully !!"
      })
    }
    else
    {
      return res.json(401, {
        message: "You Can't Delete This Post"
      })
    }
      
  }
  catch(err)
  {
    return res.json(500, {
      message: "Internal Server Error"
    })
  }
}