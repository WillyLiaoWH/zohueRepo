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

		Timelines.create({author: author, content: content, contentImg: contentImg, responseNum: "0", clickNum: "0"}).exec(function(error, timeline) {
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
	},
	setTimelinePage: function(req, res){
		//var tab=req.param("tab");
		var account = req.session.user.account;

		// notes: 未來可能需要用到.skip(10).limit(10)
		User.find({account: account}).populate('timelinesPost', { sort: 'updatedAt DESC' }).exec(function(err, result) {
			if (err) {
            	res.send(500, { err: "DB Error" });
        	} else {
        		res.send({timelinesList: result[0].timelinesPost, avatar: req.session.user.img});
            }
		});
	}
};

