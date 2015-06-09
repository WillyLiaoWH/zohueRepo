/**
 * BackendController
 *
 * @description :: Server-side logic for managing backends
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  	index: function(req, res) {
	    res.view({
	    	//_layoutFile: '',
	    	//view: 'backend/adminPage',
	    	layout: false
		      // partials: {
		      //   head: 'partials/head',
		      //   tail: '../partials/tail',
		      // },
	    });
  	}
};

