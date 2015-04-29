/**
 * TimelinesController
 *
 * @description :: Server-side logic for managing timelines
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	postTimeline: function(req, res){
		var author=req.session.user.id;
		var content=req.param("timeline_post_content");
		var contentImg=req.param("timeline_post_image");
		if(content.trim()=="" & contentImg.trim()==""){res.send(500,{err: "DB Error" });};

		Timelines.create({author: author, content: content, contentImg: contentImg}).exec(function(error, timeline) {
            if(error) {
                console.log(author);console.log(content);
                res.send(500,{err: "DB Error" });
                console.log(error);
            } else {
                console.log(timeline);
                Timelines.update({id: timeline.id},{lastResponseTime: timeline.updatedAt}).exec(function(err, timeline) {
                    if(err) {
                        res.send(500,{err: "DB Error" });
                        console.log(err);
                    } else {
                        console.log(timeline);
                        res.send(timeline);
                    }
                });
            }
        });
	}
};

