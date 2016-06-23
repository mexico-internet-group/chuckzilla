'use strict';

const paypal = require('paypal-rest-sdk');
const executePayment = require('./sendPayment/executePayment');

module.exports = function(db, store, payload, response){
    paypal.configure({
      'client_id': 'AZWziGxDKFPvhhhsd-VsOowwFSMG_HN0_deIJNJRKhTQmFr5G90FYZPHwQIq7_50HxV19EgN9lmdEafW',
      'client_secret': 'EOyxAixI1aTEbqRyuMwq0Cv1Bbd4poyJuBjjNKr_npmLYVeM9jNtHVcVTWVCcQy7E9vtW9BJIlnDuMSN'
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
