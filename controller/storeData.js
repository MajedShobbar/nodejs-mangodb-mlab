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


module.exports.index = function (req, res, next) {

    res.render('test', {title: 'CS at CSUEB Majed'});

};


module.exports.saveData = function (req, res, next) {

    var customerID;

    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        var session_basket = JSON.parse(req.body.session_basket);
        var shipment_info = JSON.parse(req.body.shipment_info);
        var payment_info = JSON.parse(req.body.payment_info);

        //customer collection operation
        var CUSTOMERS = db.collection('CUSTOMERS');
        /*CUSTOMERS.deleteMany({}, function (err, result) {
            if (err) throw err;
        });*/

        var customerdata="{'FIRSTNAME':'', 'LASTNAME':'', 'STREET':'', 'CITY':'', 'STATE':'', 'ZIP':'', 'EMAIL':''}";

        CUSTOMERS.insertOne(customerdata, function (err, result) {
            if (err) throw err;

            customerID = result.insertedIds[0];
        });
        //customer collection operation


        /*//Order collection operation
        var Orders = db.collection('ORDERS');

        /!*Orders.deleteMany({}, function (err, result) {
            if (err) throw err;
        });*!/

        Orders.insertMany(session_basket, function (err, result) {
            if (err) throw err;

        });
        //Order collection operation


        //shipment info collection operation
        var shipment = db.collection('shipment_info');

        /!*shipment.deleteMany({}, function (err, result) {
            if (err) throw err;
        });*!/

        shipment.insertOne(shipment_info, function (err, result) {
            if (err) throw err;

            shipmentID = result.insertedId.toString();
        });
        //shipment info collection operation


        //payment info collection operation
        var payment = db.collection('payment_info');

        /!* payment.deleteMany({}, function (err, result) {
             if (err) throw err;
         });*!/

        payment.insertOne(payment_info, function (err, result) {
            if (err) throw err;

        });
        //payment info collection operation*/


        //var session_basketString = JSON.stringify(req.body.payment_info);
        //res.send('3- Your order has been saved and will process shortly');
        res.render('test', {title: '2- Your order has been saved and will process shortly' + ' -- ' + customerID})

        //close connection when your app is terminating.
        db.close(function (err) {
            if (err) throw err;
        });
    });//end of connect


};
