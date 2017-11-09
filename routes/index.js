var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoDBURI = process.env.MONGODB_URI || 'mongodb://Majed:1234567890@ds155315.mlab.com:55315/heroku_m6qrxb6d';
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended: true}));

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'MangoDB'});
});

router.get('/mongodb', function (req, res, next) {

    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;
        //get collection of routes
        var Orders = db.collection('ORDERS');
        //get all Routes
        Orders.find({}).sort({Item_Code: 1}).toArray(function (err, docs) {
            if (err) throw err;

            //res.render('mongodb', {title: 'Show the result of all documents for ORDERS'});
            res.render('mongodb', {results: docs, title: 'Show the result of all documents for ORDERS'});

        });

        //close connection when your app is terminating.
        db.close(function (err) {
            if (err) throw err;
        });
    });//end of connect

});


router.post('/savedata', function (req, res, next) {

    /*mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;
        //get collection of routes
        var Orders = db.collection('ORDERS');
        //get all Routes
        Orders.find({}).sort({Item_Code: 1}).toArray(function (err, docs) {
            if (err) throw err;

            //res.render('mongodb', {title: 'Show the result of all documents for ORDERS'});
            res.render('mongodb', {results: docs, title: 'Show the result of all documents for ORDERS'});

        });

        //close connection when your app is terminating.
        db.close(function (err) {
            if (err) throw err;
        });
    });//end of connect*/

    //res.render('testshow', {orders: req.bod.session_basket, title: 'Test save 1'});

        var Array = req.body.data;
        res.send('Response is 4 '+Array["add1"]);

});

module.exports = router;
