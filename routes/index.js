var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoDBURI = process.env.MONGODB_URI || 'mongodb://Majed:1234567890@ds155315.mlab.com:55315/heroku_m6qrxb6d';

//to process data sent in on request need body-parser module
var bodyParser = require('body-parser');
var path = require('path'); //to work with separtors on any OS including Windows
var querystring = require('querystring'); //for use in GET Query string of form URI/path?name=value

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencode


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

    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        var shipment_info = JSON.parse(req.body.shipment_info);
        var payment_info = JSON.parse(req.body.payment_info);
        var session_basket = JSON.parse(req.body.session_basket);

        //get collection of routes
        var Orders = db.collection('ORDERS');

// Note that the  insert method can take either an array or a dict.
        Orders.deleteMany({}, function (err, result) {
            if (err) throw err;
        });

        Orders.insertMany(session_basket, function (err, result) {
            if (err) throw err;

            var session_basketString = JSON.stringify(req.body.session_basket);
            res.send('Response is 6 ' + ' -- ' + result.statusCode + ' -- ' + session_basketString);
        });


        /* //get all Routes
        Orders.find({}).sort({Item_Code: 1}).toArray(function (err, docs) {
            if (err) throw err;

            //res.render('mongodb', {title: 'Show the result of all documents for ORDERS'});
            res.render('mongodb', {results: docs, title: 'Show the result of all documents for ORDERS'});

        });*/

        //close connection when your app is terminating.
        db.close(function (err) {
            if (err) throw err;
        });
    });//end of connect

});

module.exports = router;
