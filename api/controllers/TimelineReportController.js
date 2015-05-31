/**
 * TimelineReportController
 *
 * @description :: Server-side logic for managing timelinereports
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	clickReport: function(req, res) {
        if(typeof req.session.user == 'undefined'){
            res.send(500,{err: "您沒有權限" });
        }else{
            var TimelineId = req.param("id");
            var reason = req.param("reason");
            Timelines.findOne(TimelineId).populate('report').exec(function (err, timeline) {
                timeline.report.add({article: TimelineId, reporter: req.session.user.id, reason: reason});
                timeline.save(function (err) { res.send({num:timeline.report.length+1}); });
            });
        }
    },
    cancelReport: function(req, res) {
        if(typeof req.session.user == 'undefined'){
            res.send(500,{err: "您沒有權限" });
        }else{
            var TimelineId = req.param("id");
            //var nicer = req.session.user.id;
            Timelines.findOne(TimelineId).populate('report').exec(function (err, timeline) {
                timeline.report.remove({article: TimelineId, reporter: req.session.user.id});
                console.log(timeline.report);
                res.send({num:555});
                //var key = timeline.report.find(article: TimelineId);
                //delete timeline.report[key];
                //timeline.save(function (err) { res.send({num:timeline.report.length-1}); });
            });
        }
    }
};

