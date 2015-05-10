var express = require('express'); //requiring express functionality
var router = express.Router(); //Attaching router variable to the express's router method

/* GET home page. */
//use router methode and get the directories based on requests made
router.get('/', function(req, res, next) {
  res.render('index', { title: 'EshuTurns30' });
});

router.get('/About', function(req, res) {
	var db = req.db; //extracting the db object we passed to http and use that db connection to fill our docs variable with db documents
	var collection = db.get('usercollection');
	//db.collection.distinct('username');
	//console.log(collection); //tell app which collection to use 
	collection.distinct('username',function(e,docs){
		// for (var i = 0;i<docs.length - 1; i++) {
		// 	console.log(docs[i]);
		// }
		res.render('about', {
			"about" : docs //return results as variable docs

		}); //page render
	});
});

//get all testimonials for a person

router.get('/testimonials/:uname', function(req, res) {
	var db = req.db; //extracting the db object we passed to http and use that db connection to fill our docs variable with db documents
	var collection = db.get('usercollection'); //tell app which collection to use
	var userName = req.params.uname; 
	console.log(userName);
	collection.find({"username":userName},{},function(e,docs){
		res.render('testiDisplay', {
			"posts" : docs //return results as variable docs

		}); //page render
	});
});



router.get('/Testimonials', function(req, res, next) {
  res.render('testimonials', { title: 'EshuTurns30' });
});

router.get('/testiDisplay', function(req, res, next) {
  res.render('testiDisplay', { title: 'EshuTurns30' });
});


// router.get('/addTesti', function(req, res, next) {
// 	var db = req.db;
// 	var collection = db.get('usercollection');
// 	collection.find({},{},function(e,docs){
// 		res.render('addTesti', {
// 			"addTesti" : docs
// 		});
// 	});
// });



/* POST to Add Testi Service */
router.post('/addTesti', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var known_time = req.body.known_time;
    var Memorable_time = req.body.memorable_time;
    var One_Word = req.body.One_word;
    var first_impression = req.body.first_impression;
    var Bday_msg = req.body.bday_message;
    var Other_comments = req.body.other_comments;

    // Set our collection
    var collection = db.get('usercollection');

    var objToJson= {}; //create a json array object
    objToJson.user_name = userName;
    objToJson.known_time = known_time;
    objToJson.Memorable_time = Memorable_time;
    objToJson.One_Word = One_Word;
    objToJson.first_impression = first_impression;
    objToJson.Bday_msg = Bday_msg;
    objToJson.Other_comments = Other_comments;

    console.log(objToJson); 

    var data =[]; //create and array 
    data.push(objToJson);

    console.log(data);

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "known_time" : known_time,
        "Memorable_time": Memorable_time,
        "One_word": One_Word,
        "first_impression": first_impression,
        "Bday_message" : Bday_msg,
        "Other_comments": Other_comments

    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            //res.location("about");

            // And forward to success page
            res.render('addTesti',{"posts":data});

        }
    });
});

module.exports = router; //exporting router function back to the app
