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


    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        var session_basket = JSON.parse(req.body.session_basket);
        var shipment_info = JSON.parse(req.body.shipment_info);
        var payment_info = JSON.parse(req.body.payment_info);

        var customerID = Math.floor((Math.random() * 1000000000000) + 1);
        var billingID = Math.floor((Math.random() * 1000000000000) + 1);
        var shippingID = Math.floor((Math.random() * 1000000000000) + 1);

        //customer collection operation
        var CUSTOMERS = db.collection('CUSTOMERS');
        /*CUSTOMERS.deleteMany({}, function (err, result) {
            if (err) throw err;
        });*/

        var customerdata = {
            _id: customerID,
            FIRSTNAME: shipment_info['fname'],
            LASTNAME: shipment_info['lname'],
            STREET: shipment_info['add1'] + ' ' + shipment_info['add2'],
            CITY: shipment_info['city'],
            STATE: shipment_info['state'],
            ZIP: shipment_info['zipcode'],
            PHONE: shipment_info['phone']
        };

        CUSTOMERS.insertOne(customerdata, function (err, result) {
            if (err) throw err;

            //customerID = result.insertedCount + " -- " + result.ok + " -- " + result.ops[0]._id + " -- " +
            //    result.insertedId + " -- " + result.getInsertedIds().toString();
        });
        //customer collection operation


        //Bilining collection operation
        var BILLING = db.collection('BILLING');
        /*BILLING.deleteMany({}, function (err, result) {
            if (err) throw err;
        });*/

        var bilingdata = {
            _id: billingID,
            CUSTOMER_ID: customerID,
            CREDITCARDTYPE: payment_info['cardtype'],
            CREDITCARDNUM: payment_info['cardnumber'],
            CREDITCARDEXP: payment_info['expdate'],
            NAMEONCREDITCARD: payment_info['nameoncard']
        };

        BILLING.insertOne(bilingdata, function (err, result) {
            if (err) throw err;

        });
        //Bilining collection operation


        //Shipping collection operation
        var SHIPPING = db.collection('SHIPPING');
        /*SHIPPING.deleteMany({}, function (err, result) {
            if (err) throw err;
        });*/

        //(_id, CUSTOMER_ID, SHIPPING_STREET, SHIPPING_CITY, SHIPPING_STATE, SHIPPING_ZIP)

        var shipingdata = {
            _id: shippingID,
            CUSTOMER_ID: customerID,
            SHIPPING_STREET: shipment_info['add1'] + ' ' + shipment_info['add2'],
            SHIPPING_CITY: shipment_info['city'],
            SHIPPING_STATE: shipment_info['state'],
            SHIPPING_ZIP: shipment_info['zipcode'],
            SHIPPING_DILIVERY: shipment_info['delivary']
        };

        SHIPPING.insertOne(shipingdata, function (err, result) {
            if (err) throw err;

        });
        //Shipping collection operation


        //(_id, CUSTOMER_ID, BILLING_ID, SHIPPING_ID, DATE, PRODUCT_VECTOR, ORDER_TOTAL)
        //Order collection operation
        var ORDERS = db.collection('ORDERS');
        /*ORDERS.deleteMany({}, function (err, result) {
            if (err) throw err;
        });*/

        var orderdata = {
            CUSTOMER_ID: customerID,
            BILLING_ID: billingID,
            SHIPPING_ID: shippingID,
            DATE: (new Date()).toDateString(),
            PRODUCT_VECTOR: session_basket,
            ORDER_TOTAL: Object.keys(session_basket).length
        };

        ORDERS.insertOne(orderdata, function (err, result) {
            if (err) throw err;

        });
        //Order collection operation


        res.render('storeData', {
            title: '6-Your order has been Received and will be processed shortly' + ' -- ' + customerID.toString(),
            shipmentinfo: JSON.stringify(shipment_info), paymentinfo: JSON.stringify(payment_info),
            sessionbasket: JSON.stringify(session_basket)
        });

        //close connection when your app is terminating.
        db.close(function (err) {
            if (err) throw err;
        });
    });//end of connect


};
