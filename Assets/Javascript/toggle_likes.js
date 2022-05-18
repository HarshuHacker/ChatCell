// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike{
  constructor(toggleElement){
      this.toggler = toggleElement;
      this.toggleLike();
			this.liked=false
  }


  toggleLike(){
      $(this.toggler).click(function(e){
          e.preventDefault();
          let self = this;

          // this is a new way of writing ajax which you might've studied, it looks like the same as promises
          $.ajax({
              type: 'POST',
              url: $(self).attr('href'),
          })
          .done(function(data) {
              let likesCount = parseInt($(self).attr('data-likes'));
              console.log(likesCount);
              if (data.data.deleted == true){
                  likesCount -= 1;
									this.liked=false
                  
              }else{
                  likesCount += 1;
									this.liked=true
              }

              $(self).attr('data-likes', likesCount);
              if(this.liked == true)
							{
								$(self).html(`<i class="fas fa-thumbs-up liked-button"></i> ${likesCount}`) 
							}
							else
							{
								$(self).html(`<i class="far fa-thumbs-up"></i> ${likesCount}`) 
							}
          })
          .fail(function(errData) {
              console.log('error in completing the request');
          });
          

      });
  }
}
