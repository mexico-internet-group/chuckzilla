var openPayClass = require('openpay');
var openpay = new openPayClass('mgrw4ztnu6wiuo3bdysp', 'sk_b7860786e81d43388d189b58cc251271', false);
var addToOrders = require('./sendPayment/addToOrders');

module.exports = function(db, store, payload, response){
	var user = store.users[payload.token];
	if(typeof user === 'undefined') return response({error:'YOU_DONT_HAVE_A_USER'});
	if(typeof user.tid === 'undefined') return response({error:'YOU_ARE_NOT_BUYING'});
	if(payload.tid === user.tid){
		user.tid = payload.newTid;
		openpay.charges.create({
			source_id : payload.payment.token_id,
			method : 'card',
			amount : payload.payment.amount,
			currency : 'MXN',
			description : 'Payment for transaction ' + user.tid,
			device_session_id : payload.payment.device_id,
			order_id : user.tid,
			customer : {
				name : user.name,
				last_name : user.lastName,
				phone_number : '',
				email : user.mail
		   }
		}, function(error, charge) {
			if(error) return response({status: 'ERROR', code: error.error_code});
			else return addToOrders(db, store, payload, response, charge);
		});
	}
	else return response({error:'TIME_OUT'});
	return;
};
