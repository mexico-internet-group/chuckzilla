'use strict';

var request = require('request');
var redir = {};

if(typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV !== 'production'){
	redir.return_url = 'https://####.####.####.####/pago-seguro?return_url=ppp';
	redir.cancel_url = 'https://####.####.####.####/pago-seguro?cancel_url=ppp';
}
else{
	redir.return_url = 'https://####.####.####.####/pago-seguro?return_url=ppp';
	redir.cancel_url = 'https://####.####.####.####/pago-seguro?cancel_url=ppp';
}

module.exports = function(db, store, payload, response){
	var user = store.users[payload.token];
	if(typeof user === 'undefined') return response({error:'YOU_DONT_HAVE_A_USER'});
	if(typeof user.tid === 'undefined') return response({error:'YOU_ARE_NOT_BUYING'});
	if(payload.tid === user.tid){
		user.tid = payload.newTid;

		var price = 0;

		redir.return_url = redir.return_url + '&address=' + payload.address + '&amount=' + price;

		map(user.cart.items, function(val, key){
			for(var i = 0; i < val.qty; i++){
				price += val.details.price;
			}
		});

		if(price < 2999){
			price += parseFloat(payload.amount);
		}

		request.post({
				url: process.env.NODE_ENV === 'production' ? 'https://api-3t.paypal.com/nvp' : 'https://api-3t.sandbox.paypal.com/nvp',
				form: {
					USER: '####.####.####.####',
					PWD: '####.####.####.####',
					SIGNATURE: '####.####.####.####',
					METHOD: 'SetExpressCheckout',
					VERSION: '78',
					PAYMENTREQUEST_0_PAYMENTACTION: 'SALE',
					PAYMENTREQUEST_0_AMT: price + '',
					PAYMENTREQUEST_0_CURRENCYCODE: 'MXN',
					cancelUrl: redir.cancel_url,
					returnUrl: redir.return_url
				}
			},
			function(e, r, body){
				if(e) return response({error:'OOPS!'});
				var tmpObj = qs.parse(body);

				if(tmpObj.TOKEN) return response({
					token: tmpObj.TOKEN,
					tid: user.tid
				});

				return response({error:'OOPS!'});
			}
		);

	}
};
