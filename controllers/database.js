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


module.exports.storeData = function (req, res, next) {


    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        var session_basket = JSON.parse(req.body.session_basket);
        var shipment_info = JSON.parse(req.body.shipment_info);
        var payment_info = JSON.parse(req.body.payment_info);

        //Create ID's for the customer and billing and shipping records
        var customerID = Math.floor((Math.random() * 1000000000000) + 1);
        var billingID = Math.floor((Math.random() * 1000000000000) + 1);
        var shippingID = Math.floor((Math.random() * 1000000000000) + 1);

        //customer collection operation
        var CUSTOMERS = db.collection('CUSTOMERS');

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

        });
        //customer collection operation


        //Bilining collection operation
        var BILLING = db.collection('BILLING');

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


        //Order collection operation
        var total = 0;
        for (var i = 0; i < session_basket.length; i++)
            total = total + (session_basket[i].quantity * session_basket[i].price);

        total = total + ((total * 8) / 100) + 2;

        var ORDERS = db.collection('ORDERS');

        var orderdata = {
            CUSTOMER_ID: customerID,
            BILLING_ID: billingID,
            SHIPPING_ID: shippingID,
            DATE: (new Date()).toDateString(),
            PRODUCT_VECTOR: session_basket,
            ORDER_TOTAL: '$ ' + total.toFixed(2)
        };
        //ORDER_TOTAL: Object.keys(session_basket).length

        ORDERS.insertOne(orderdata, function (err, result) {
            if (err) throw err;

        });
        //Order collection operation


        res.render('storeData', {
            title: 'Order Was Successful',
            shipmentinfo: JSON.stringify(shipment_info), paymentinfo: JSON.stringify(payment_info),
            sessionbasket: JSON.stringify(session_basket)
        });


        //close connection when The app is terminating.
        db.close(function (err) {
            if (err) throw err;
        });
    });//end of connect


};
