//method to submit the form data for new post using AJAX
let createPost = function(){
  let newPostForm = $('#new-post-form')

  newPostForm.submit(function(e){
    e.preventDefault()

    $.ajax({
      type: "post",
      url: "/posts/create",
      data: newPostForm.serialize(),
      success: function(data)
      {
        //for creating a post
        console.log(data)
        let newPost = newPostDom(data.data.post,data.data.userDet)
        //for displaying a post
        $(`#posts-list-container>ol`).prepend(newPost)
        //for deleting a post
        deletePost($(" .delete-post-button", newPost))

        // call the create comment class
        new PostComments(data.data.post._id);

        new ToggleLike($(' .toggle-like-button',newPost))

        new Noty({
          theme: 'relax',
          text: "Post Published!",
          type: 'success',
          layout: 'topRight',
          timeout: 500
          
        }).show();
      },
      error: function(error)
      {
        console.log(error.responseText)
      }
    })

  })
}


//method to create a post in DOM

let newPostDom = function(post,userDet)
{
  return $(`
    <li id="post-${post._id}">
    <p>
      ${post.content}
        <a class="delete-post-button" href="/posts/destroy/${post._id}">
          <b>
            <i class="fas fa-trash"></i>
          </b>
        </a>
      <br>
      <small>
        Posted By : ${userDet.user.name}
        <i>
          (${ userDet.user.email})
        </i>
      </small>
      <br>
      <small>
          <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
            <i class="fa-regular fa-heart"></i> 0
          </a>
      </small>
    </p>
  
    <div class="post-comments">
      <form id="post-${ post._id }-comments-form" action="/comments/create" method="post">
        <input class="type-comment" type="text" name="content" placeholder="Type Here To Add Comment" style="width: 200px;">
        <input class="hidden-comment" type="hidden" name="post" value="${post._id}">
        <input class="comment-add-button" type="submit" value="Add">
      </form>
    
      <div class="post-comments-list">
        <ul id="post-comment-${post._id}" style="padding-left: 5px;">

        </ul>
      </div>
    
    </div>
  
    </li>`)
}

//method to delete a post from DOM
let deletePost = function(deleteLink){
  $(deleteLink).click(function(e){
    e.preventDefault()

    $.ajax({
      type: "get",
      url: $(deleteLink).prop("href"),
      success: function(data){
        $(`#post-${data.data.post_id}`).remove()
        new Noty({
          theme: 'relax',
          text: "Post Deleted!",
          type: 'success',
          layout: 'topRight',
          timeout: 500
          
        }).show();
      },
      error: function(error){
        console.log(error.responseText)
      }
    })
  })
}

// loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
let convertPostsToAjax = function()
{
  $('#posts-list-container>ol>li').each(function(){
      let self = $(this);
      let deleteButton = $(' .delete-post-button', self);
      deletePost(deleteButton);

      // get the post's id by splitting the id attribute
      let postId = self.prop('id').split("-")[1]
      new PostComments(postId);
  });
}

createPost()
convertPostsToAjax();