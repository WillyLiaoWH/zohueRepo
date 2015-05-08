/**
 * TimelineResponseController
 *
 * @description :: Server-side logic for managing timelineresponses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	leaveCommentTimeline: function(req, res){
        var author=req.session.user.id;
		var comment=req.param("timeline_comment_content");
        var comment_image=req.param("timeline_comment_image");
		var timeline_id=req.param("timeline_id");
		TimelineResponse.create({author: author, comment: comment, comment_image: comment_image, timeline: timeline_id}).exec(function(error, response) {
            if(error) {
                res.send(500,{err: "DB Error" });
                console.log(error);
            } else {
            	res.send('留言成功！');
                // Articles.update({id: article_id},{lastResponseTime: response.createdAt}).exec(function(err, article) {
                //     if(err) {
                //         res.send(500,{err: "DB Error" });
                //         console.log(err);
                //     } else {
                //         res.send(article);
                //     }
                // });
            }
        });
	}
};

