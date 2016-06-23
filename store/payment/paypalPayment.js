'use strict';

var paypal = require('paypal-rest-sdk');
var util = require('util');

paypal.configure({
  'client_id': 'AaPckTDp_3o8t8CdgU35BnMRtFTzw79-a-ujUlEk6IS16Gxpx2TpKA-3obX39wEBZmTHAh8Z_OvEKrMc',
  'client_secret': 'EIdVyTEbwjzunA19VZQdUukdcVe5q2RGW1QBDyCuALf8_ScQz_906njl9k7AnObqRWBmWsGRKQAew4d7'
});

var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://return.url",
        "cancel_url": "http://cancel.url"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "item",
                "sku": "item",
                "price": "1.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "MXN",
            "total": "1.00"
        },
        "description": "This is the payment description."
    }]
};


paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        console.log("Create Payment Response");
        console.log(payment);
    }
});
