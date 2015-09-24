/**
 * ImguploadController
 *
 * @description :: Server-side logic for managing imguploads
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    upload_avatar: function(req, res){
        var http = require('http');
        http.globalAgent.maxSockets = 10000;

        var data = req.param("avatar_data");
        var data2;
        if(data){
            data2 = JSON.parse(data);
        }

        if(req.method === 'GET')
            return res.json({'status':'GET not allowed'});

        function createDir(dir, cb){
            var fs = require('fs');
            if (!fs.exists(dir)){
                fs.mkdir(dir, function (err) {
                    cb();
                });
            }else{cb();}
        }

        function upload(cb){
            var uploadFile = req.file('avatar_file');
            uploadFile.upload({ dirname: '../../assets/images/img_avatar'}, function onUploadComplete (err, files) {              //  Files will be uploaded to .tmp/uploads
                if (err) return res.serverError(err);                               //  IF ERROR Return and send 500 error with error
                var regex = /.*assets\\+(.*)/;
                var match = files[0].fd.match(regex);
                var result = match[1].replace(/\\/g, "\/");

                //http://stackoverflow.com/questions/26130914/not-able-to-resize-image-using-imagemagick-node-js
                var time = new Date().getTime();
                var recall_url = 'images/img_avatar/upload/'+time+'.jpg';

                // watchFile('assets/'+recall_url,
                //     function(){
                //         console.log("create~~~");
                //     },function(){
                //         console.log("remove~~~");
                //     });

                var easyimg = require('easyimage');
                try {
                    easyimg.crop({
                        src:files[0].fd, dst:'assets/'+recall_url,
                        cropwidth:data2.width, cropheight:data2.height,
                        gravity:'NorthWest',
                        x:data2.x, y:data2.y
                    }).then(
                    function(image) {
                        cb(recall_url);
                    },function (err) {
                        console.log(err);
                        res.ok("載入錯誤，請重新上傳！");
                    });
                } catch (e) {
                    res.ok("載入錯誤，請重新上傳！");
                }
            });
        }

        function watchFile(filepath, oncreate, ondelete) { // 監聽 file system 情況
            var fs = require('fs'), path = require('path'), filedir = path.dirname(filepath), filename = path.basename(filepath);
            fs.watch(filedir, function(event, who) {
                if (event === 'change' && who === filename) { // event 可以是 rename 或 create
                    if (fs.existsSync(filepath)) {
                        oncreate();
                    } else {
                    ondelete();
                    }
                }
            });
        }

        createDir('assets/images/img_avatar/upload', function(){
            upload(function(a) {
                // res.ok(JSON.stringify({state:200,message:null,result:a}));
                // http get status code 200 才 call back
                var interval = setInterval(function() {
                    var http = require('http');
                    http.get('http://localhost/'+a, function(interRes) {
                        console.log("Got response: " + interRes.statusCode);
                        if(interRes.statusCode == 200){
                            res.ok(JSON.stringify({state:200,message:null,result:a}));
                            clearInterval(interval);
                        }
                    }).on('error', function(e) {
                        console.log("Got error: " + e.message);
                    });
                }, 1000);
            });
        });
    },



    upload_post: function(req, res){
        var data = req.param("avatar_data");
        var data2;
        if(data){
            data2 = JSON.parse(data);
        }

        if(req.method === 'GET')
            return res.json({'status':'GET not allowed'});                      //  Call to /upload via GET is error

        function createDir(dir, cb){
            var fs = require('fs');
            if (!fs.exists(dir)){
                fs.mkdir(dir, function (err) {
                    cb();
                });
            }else{cb();}
        }

        function upload(uni_fn, cb){
            var uploadFile = req.file('avatar_file');
            
            uploadFile.upload({ dirname: 'assets/images/img_post', saveAs: uni_fn+'.jpg'}, function onUploadComplete (err, files) {              //  Files will be uploaded to .tmp/uploads
                if (err) return res.serverError(err);                               //  IF ERROR Return and send 500 error with error
                var regex = /.*assets\\+(.*)/;
                var match = files[0].fd.match(regex);
                var result = match[1].replace(/\\/g, "\/");
                console.log(result);

                //var time = new Date().getTime();
                var recall_url = 'images/img_post/upload/'+uni_fn+'.jpg';
                var easyimg = require('easyimage');

                try {
                    easyimg.crop({
                        src:files[0].fd, dst:'assets/'+recall_url,
                        // width:200, height:200,
                        cropwidth:data2.width, cropheight:data2.height,
                        // width:data2.width, height:data2.height,
                        // cropwidth:200, cropheight:200,
                        gravity:'NorthWest',
                        x:data2.x, y:data2.y
                    }).then(
                    function(image) {
                        cb(recall_url);
                        console.log('Croped: ' + image.width + ' x ' + image.height);
                    },
                    function (err) {
                        console.log(err);
                    });
                } catch (e) {
                    res.ok("載入錯誤，請重新上傳！");
                }
            });
        }

        function res_upload(uni_fn, recall_url, cb){
            var time = new Date().getTime();
            var easyimg = require('easyimage');
            var recall_url2 = 'images/img_post/resize/'+uni_fn+'.jpg';
            
            try{
                easyimg.resize({
                    src:'assets/'+recall_url, dst:'assets/'+recall_url2,
                    width:300, height:300
                }).then(
                function(image) {
                    //res.ok(JSON.stringify({state:200,message:null,result:recall_url2}));
                    cb(recall_url2);
                    console.log('Resized: ' + image.width + ' x ' + image.height);
                },
                function (err) {
                    console.log(err);
                });
            } catch (e) {
                res.ok("圖片處理失敗！");
            }
        }

        var uni_fn = new Date().getTime();
        createDir('assets/images/img_post/upload', function(){
            createDir('assets/images/img_post/resize', function(){
                upload(uni_fn, function(a) {
                    res_upload(uni_fn, a, function(b) {
                        var fs = require('fs');
                        var id = setInterval(function(){
                            console.log('assets/'+b);
                            // if (fs.existsSync('assets/'+b)) {
                                // res.ok(JSON.stringify({state:200,message:null,result:b}));
                                // clearInterval(id);
                            //}
                            fs.stat('assets/'+b, function(err, stat) {
                                if(err == null) {
                                    res.ok(JSON.stringify({state:200,message:null,result:b}));
                                    clearInterval(id);
                                } else if(err.code == 'ENOENT') {
                                    //fs.writeFile('log.txt', 'Some log\n');
                                } else {
                                    console.log('Some other error: ', err.code);
                                }
                            });
                        }, 2000);
                    });
                });
            });
        });
    },
};

