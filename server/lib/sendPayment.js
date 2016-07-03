module.exports = function(reqObj, router, actions, req, res){
	var detail = req.body;
	var token = req.cookies.usrtkn;
	var tid = req.cookies.tid;
	var newTid = 'tid' + uuid.v1();
	var error = false;

	var payment = {
		address: detail.address || '',
		token_id: detail.token_id || '',
		device_id: detail.device_id || '',
		amount: detail.amount || ''
	};

	map(payment, function(val, key){
		if(val === ''){
			error = true;
		}
	});

	if(error) res.send( sendError('PAYMENT_INCOMPLETE') );
	else if(typeof token === 'undefined') res.send( sendError('YOU_ARE_NOT_HUMAN') );
	else if(typeof tid === 'undefined') res.send( sendError('YOU_ARE_NOT_BUYING') );
	else actions.sendPayment(reqObj, req, res, payment, token, tid, newTid);
};
