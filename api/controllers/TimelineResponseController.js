/**
 * TimelineResponseController
 *
 * @description :: Server-side logic for managing timelineresponses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	leaveCommentTimeline: function(req, res){
        var author=req.session.user.id;
		var comment=req.param("comment");
        var comment_image=req.param("comment_image");
		var article_id=req.param("article_id");
		Response.create({author: author, comment: comment, comment_image: comment_image, article: article_id}).exec(function(error, response) {
            if(error) {
                res.send(500,{err: "DB Error" });
                console.log(error);
            } else {
                Articles.update({id: article_id},{lastResponseTime: response.createdAt}).exec(function(err, article) {
                    if(err) {
                        res.send(500,{err: "DB Error" });
                        console.log(err);
                    } else {
                        res.send(article);
                    }
                });
            }
        });
	}
};

