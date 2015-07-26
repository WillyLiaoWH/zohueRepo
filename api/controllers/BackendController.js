/**
 * BackendController
 *
 * @description :: Server-side logic for managing backends
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  	index: function(req, res) {
  		// if(session["admin"]=true){
  		// 	res.view({
		  //   	//_layoutFile: '',
		  //   	//view: 'backend/adminPage',
		  //   	layout: false
			 //      // partials: {
			 //      //   head: 'partials/head',
			 //      //   tail: '../partials/tail',
			 //      // },
		  //   });
  		// }else{
  		// 	res.send(500,{err: "DB Error" });
  		// }

	    res.view({
	    	//_layoutFile: '',
	    	//view: 'backend/adminPage',
	    	layout: false
		      // partials: {
		      //   head: 'partials/head',
		      //   tail: '../partials/tail',
		      // },
	    });


  	},

    getArticles: function(req, res){ // 根據board及category撈文章。
        var board=req.param("board");

        Articles.find({board: board}).populate('author').populate('nicer').populate('report').populate('board').exec(function(err, articlesList) {
            if (err) {
                res.send(500, { err: "DB Error" });
            } else {
                res.send({articlesList: articlesList});
            }
        });    
    },

  	getArticlesByBoards: function(req, res){ // 根據board撈文章。

        //var board=req.param("board");
        // var boards;
        // var boardCate;
        
        // BoardCategory.find().exec(function(err, boardCateList) {
        //     boardCate=boardCateList;
        // });
        
        Articles.find().populate('author').populate('nicer').populate('report').populate('board').exec(function(err, articlesList) {
            if (err) {
                res.send(500, { err: "DB Error" });
            } else {
                    // Boards.find().populate('category').exec(function(err, board) {
                    //     if(err) {
                    //         res.send(500, { err: "DB Error" });
                    //     } else {
                    //         //Boards.find({category: board[0].category.id}).exec(function(err, boardsList) {
                    //             //boards=boardsList;
                    //             res.send({articlesList: articlesList, board: board[0], boards: boards, boardCate: boardCate});
                    //         //});
                    //     }
                    // });
                    res.send({articlesList: articlesList});
            }
        });




        	// Boards.find(board).populate('articles').populate('category').exec(function(err, articlesList) {
        	// 	if (articlesList.length==0) {
         //        res.send("查無結果！");
	        //     } else {
	        //     	console.log(articlesList);
	        //         sails.services['util'].populateDeep('boards', articlesList[0], 'articles.author', function (err, articlesList2) {
	        //             sails.services['util'].populateDeep('boards', articlesList2, 'articles.nicer', function (err, articlesList3) {
	        //             	sails.services['util'].populateDeep('boards', articlesList3, 'articles.report', function (err, articlesList4) {
	        //             		console.log(articlesList4);
	        //             		//console.log(articlesList4);
	        //             	});
	        //             });
	        //         });
	        //     }
        	// });

            // Articles.find({board: board}).populate('author').populate('nicer').populate('report').populate('board').exec(function(err, articlesList) {
            //     if (err) {
            //         res.send(500, { err: "DB Error" });
            //     } else {
            //     	var bid = articlesList[0]['board']['category'];
            //     	console.log(articlesList[0]);
            //     	BoardCategory.find(bid).exec(function(err, result){
            //     		console.log(result);
            //     	});



            //         // Boards.find({id: board}).populate('category').exec(function(err, board) {
            //         //     if(err) {
            //         //         res.send(500, { err: "DB Error" });
            //         //     } else {
            //         //         Boards.find({category: board[0].category.id}).exec(function(err, boardsList) {
            //         //             boards=boardsList;
            //         //             res.send({articlesList: articlesList, board: board[0], boards: boards, boardCate: boardCate});
            //         //         });
            //         //     }
            //         // });
            //     }
            // });
        
	},

    getArticlesByCategory: function(req, res){ // 根據category撈文章。
        var boards;
        var category=req.param("category");

        Boards.find({category: category}).exec(function(err, boards) {
            if(err) {
                console.log(err);
            } else {
                var boardsArray=[];
                boards=boards;
                
                for(i=0;i<boards.length;i++){
                    boardsArray.push(boards[i].id.toString());
                }

                Articles.find({board : boardsArray}).populate('author').populate('nicer').populate('report').populate('board').exec(function(err, articlesList) {
                    if (err) {
                        res.send(500, { err: "DB Error" });
                    } else {
                        res.send({articlesList: articlesList});
                    }
                });
            }
        });
    }
};

