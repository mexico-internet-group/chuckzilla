'use strict';

const paypal = require('paypal-rest-sdk');
const executePayment = require('./sendPayment/executePayment');

module.exports = function(db, store, payload, response){
    paypal.configure({
      'client_id': '####.####.####.####',
      'client_secret': '####.####.####.####'
    });

	var paymentId = payload.paymentId;
	var payerId = payload.payment.PayerID;
	var details = { "payer_id": payerId };

	paypal.payment.execute(paymentId, details, function (error, paymentResponse) {
		if (error) return response({error: 'ERROR'});
		return executePayment(db, store, payload, response, paymentResponse, 'PayPalPlus');
	});

	return;
};
