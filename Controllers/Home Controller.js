// Home Controller.js

const Post = require("../Models/post")
const User = require("../Models/user")

module.exports.home = async function(req,res)
{
    //Using Populate To Get Data From User
    try
    {
        let post = await Post.find({})
        .sort("-createdAt")
        .populate("user")
        .populate({
            //populate the user and likes of the comment
            path: "comments",
            populate: {
                path: "user likes"
            }
        })

        // getting list of all the users
        let users = await User.find({})

        console.log('allusers',users);
        friendshipuser=[]
        if(req.user)
        {
            let listForCurrentUser = await User.findById(req.user.id);
            console.log('current user=>',listForCurrentUser.friendship);
            // loopig and getting the values all the user
            for(let uid of listForCurrentUser.friendship)
            {
                // console.log('udis',uid);
                let friendsuser = await User.findById(uid);
                //console.log('@@@ frindship',friendsuser);
                friendshipuser.push(friendsuser)
            }
        }
        else
        {
            friendshipuser=[]
        }

        console.log('friendshipuser=>',friendshipuser);
        
        return res.render('home',
        {
            siteName:"ChatCell",
            posts:post,
            all_users:users,
            addedfriends: friendshipuser
        })
    }
    catch(err)
    {
        req.flash("error : ",err)
        return res.redirect("back")
    }
}