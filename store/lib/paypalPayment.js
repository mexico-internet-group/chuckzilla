'use strict';

const paypal = require('paypal-rest-sdk');
const util = require('util');
const redir = {};

if(typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV !== 'production'){
	redir.return_url = '//dgl.com/pago-seguro?return_url=ppp';
	redir.cancel_url = '//dgl.com/pago-seguro?cancel_url=ppp';
}
else{
	redir.return_url = '//hmovil.com/pago-seguro?return_url=ppp';
	redir.cancel_url = '//hmovil.com/pago-seguro?cancel_url=ppp';
}

module.exports = function(db, store, payload, response){
    paypal.configure({
      'client_id': 'AZWziGxDKFPvhhhsd-VsOowwFSMG_HN0_deIJNJRKhTQmFr5G90FYZPHwQIq7_50HxV19EgN9lmdEafW',
      'client_secret': 'EOyxAixI1aTEbqRyuMwq0Cv1Bbd4poyJuBjjNKr_npmLYVeM9jNtHVcVTWVCcQy7E9vtW9BJIlnDuMSN'
    });

	var user = store.users[payload.token];
	var addressDetail = payload.addressDetail;

	if(typeof user === 'undefined') return response({error:'YOU_DONT_HAVE_A_USER'});
	if(typeof user.tid === 'undefined') return response({error:'YOU_ARE_NOT_BUYING'});
	if(payload.tid === user.tid){
		user.tid = payload.newTid;
		var price = 0;
		var deliveryPrice = parseFloat(payload.delivery);
		var items = map(user.cart.items, function(val, key){
			for(var i = 0; i < val.qty; i++){
				price += val.details.price;
			}
			return {
				name: val.details.displayName,
				description: val.details.displayName,
				quantity: val.qty,
				price: val.details.price + '',
				sku: "Art. " + key,
				currency: 'MXN'
			};
		});

		var template = {
			"intent": "sale",
			"experience_profile_id": "XP-ZW2P-MSW5-33UZ-P84G",
			"payer": {
				"payment_method": "paypal"
			},
			"transactions": [
				{
					"amount": {
						"currency": "MXN",
						"total": (price + deliveryPrice) + "",
						"details": {
							"subtotal": price + "",
							"shipping": deliveryPrice + ""
						}
					},
					"description": "Payment for " + user.tid,
					"custom": "User " + payload.token,
					"payment_options": {
						"allowed_payment_method": "IMMEDIATE_PAY"
					},
					"item_list": {
						"items": items,
						"shipping_address": {
							"recipient_name": user.name + ' ' + user.lastName,
							"line1": addressDetail.postalAddress,
							"line2": "",
							"city": addressDetail.D_mnpio,
							"country_code": "MX",
							"postal_code": addressDetail.postalCode,
							"state": addressDetail.d_estado,
							"phone": payload.phone
						}
					}
				}
			],
			"redirect_urls": redir
		};

		var paymentJSON = JSON.stringify(template);

		paypal.payment.create(paymentJSON, function (error, payment) {
		    if (error) {
				console.log(JSON.stringify(error) );
		        response({error: 'ERROR'});
		    }
			else {
                payment.tid = user.tid;
		        response(payment);
		    }
		});
	}
};
