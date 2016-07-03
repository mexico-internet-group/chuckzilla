'use strict';

var request = require('request');
var executePayment = require('./sendPayment/executePayment');

module.exports = function(db, store, payload, response){
	var user = store.users[payload.token];
	if(typeof user === 'undefined') return response({error:'YOU_DONT_HAVE_A_USER'});
	if(typeof user.tid === 'undefined') return response({error:'YOU_ARE_NOT_BUYING'});
	if(payload.tid === user.tid){
		user.tid = payload.newTid;

		var price = 0;

		map(user.cart.items, function(val, key){
			for(var i = 0; i < val.qty; i++){
				price += val.details.price;
			}
		});

		if(price < 2999){
			price += parseFloat(payload.obj.amount);
		}

		request.post({
				url: process.env.NODE_ENV === 'production' ? 'https://api-3t.paypal.com/nvp' : 'https://api-3t.sandbox.paypal.com/nvp',
				form: {
					USER: '####.####.####.####',
					PWD: '####.####.####.####',
					SIGNATURE: '####.####.####.####',
					METHOD: 'DoExpressCheckoutPayment',
					VERSION: '93',
					TOKEN: payload.obj.token,
					PAYERID: payload.obj.PayerID,
					PAYMENTREQUEST_0_PAYMENTACTION: 'SALE',
					PAYMENTREQUEST_0_AMT: price + '',
					PAYMENTREQUEST_0_CURRENCYCODE: 'MXN'
				}
			},
			function(e, r, body){
				if(e) return response({error:'OOPS!'});
				var paymentResponse = qs.parse(body);

				if(paymentResponse.ACK === 'Success'){
					payload.payment = {};
					payload.payment.address = payload.obj.address;
					payload.payment.amount = parseFloat(payload.obj.amount);
					return executePayment(db, store, payload, response, paymentResponse, 'PayPalExpressCheckout');
				}
				return response({error:'OOPS!'});
			}
		);

	}
};
