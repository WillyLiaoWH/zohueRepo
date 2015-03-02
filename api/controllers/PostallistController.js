/**
 * PostallistController
 *
 * @description :: Server-side logic for managing postallists
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	createpost: function(req, res) {
		fs = require('fs')
		var content;
		var array;
		fs.readFile('post.txt', 'utf8', function (err,data) {
  			if (err) {
    			return console.log(err);
  			}
  			content = data.replace(/\"/g,'');
  			array = content.split("\n");
  			array.forEach(function(line) {
  				var split = line.split(",");
    			//console.log(split[0]); // 縣市
  				//console.log(split[1]); // 鄉鎮區
  				//console.log(split[2]); // 郵遞區號
  				//console.log(line);
  				Postallist.create({postalcode: split[2].replace('\r',''), addressCity: split[0], addressDistrict: split[1] }).exec(function(error, postal) {
                    if(error) {
                    	console.log(error);
                        res.send(500,{err: "DB Error" });
                    } else {
                        console.log(postal);
                        // req.session.user = user;
                        //res.send(postal);
                    }
                });
                //res.end(Postallist);
			});
		});
	},
	destroyall: function(req, res) {
		Postallist.destroy({}).exec(function deleteCB(err){
  			console.log('The record has been deleted');
  		});
	},
	getall: function(req, res) {
		var array1=[],array2=[],array3=[],array4=[],array5=[],array6=[],
            array7=[],array8=[],array9=[],array10=[],array11=[],array12=[],
            array13=[],array14=[],array15=[],array16=[],array17=[],array18=[],
            array19=[],array20=[],array21=[],array22=[],array=[],array_s=[];
		Postallist.find({}).exec(function findCB(err,found){
 			while (found.length){
 				var obj = found.pop();
    			//console.log('Found User with name '+obj.id)
    			var addressDistrict = obj.addressDistrict;
    			var postalcode = obj.postalcode;
    			array_s = {'postalcode':postalcode,'addressDistrict':addressDistrict};
                switch (obj.addressCity) {
                	case '臺北市': array1.push(array_s);
                	break;
                	case '新北市': array2.push(array_s);
                	break;
                	case '基隆市': array3.push(array_s);
                	break;
                	case '桃園縣': array4.push(array_s);
                	break;
                	case '新竹縣': array5.push(array_s);
                	break;
                	case '新竹市': array6.push(array_s);
               		break;
                    case '苗栗縣': array7.push(array_s);
                    break;
                    case '臺中市': array8.push(array_s);
                    break;
                    case '彰化縣': array9.push(array_s);
                    break;
                    case '南投縣': array10.push(array_s);
                    break;
                    case '雲林縣': array11.push(array_s);
                    break;
                    case '嘉義縣': array12.push(array_s);
                    break;
                    case '嘉義市': array13.push(array_s);
                    break;
                    case '臺南市': array14.push(array_s);
                    break;
                    case '高雄市': array15.push(array_s);
                    break;
                    case '屏東縣': array16.push(array_s);
                    break;
                    case '宜蘭縣': array17.push(array_s);
                    break;
                    case '花蓮縣': array18.push(array_s);
                    break;
                    case '臺東縣': array19.push(array_s);
                    break;
                    case '澎湖縣': array20.push(array_s);
                    break;
                    case '金門縣': array21.push(array_s);
                    break;
                    case '連江縣': array22.push(array_s);
                    break;
                    default:
                    break;
                }
 			}
 			array = [
				{'addressCity':'臺北市',
				'district':array1},
				{'addressCity':'新北市',
				'district':array2},
				{'addressCity':'基隆市',
				'district':array3},
				{'addressCity':'桃園縣',
				'district':array4},
				{'addressCity':'新竹縣',
            	'district':array5},
            	{'addressCity':'新竹市',
            	'district':array6},
            	{'addressCity':'苗栗縣',
            	'district':array7},
            	{'addressCity':'臺中市',
            	'district':array8},
            	{'addressCity':'彰化縣',
            	'district':array9},
            	{'addressCity':'南投縣',
            	'district':array10},
            	{'addressCity':'雲林縣',
            	'district':array11},
            	{'addressCity':'嘉義縣',
            	'district':array12},
            	{'addressCity':'嘉義市',
            	'district':array13},
            	{'addressCity':'臺南市',
            	'district':array14},
            	{'addressCity':'高雄市',
            	'district':array15},
            	{'addressCity':'屏東縣',
            	'district':array16},
            	{'addressCity':'宜蘭縣',
            	'district':array17},
            	{'addressCity':'花蓮縣',
            	'district':array18},
            	{'addressCity':'台東縣',
            	'district':array19},
            	{'addressCity':'澎湖縣',
            	'district':array20},
            	{'addressCity':'金門縣',
            	'district':array21},
            	{'addressCity':'連江縣',
            	'district':array22}
           	];
            str = JSON.stringify(array);
            res.end(str);
  		});
	}
};

