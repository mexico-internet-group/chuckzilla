module.exports = function(reqObj, router, actions, req, res){
	var detail = req.body;
	var token = req.cookies.usrtkn;
	var tid = req.cookies.tid;
	var newTid = 'tid' + uuid.v1();
	var error = false;

	var payment = {
		address: detail.address || '',
		phone: detail.phone || '',
		postalAddress: detail.postalAddress || '',
		neighborhood: detail.neighborhood || '',
		D_mnpio: detail.D_mnpio || '',
		postalCode: detail.postalCode || '',
		d_estado: detail.d_estado || '',
		holder_name: detail.holder_name || '',
		holder_last_name: detail.holder_last_name || '',
		card: detail.card || '',
		mm: detail.mm || '',
		aa: detail.aa || '',
		cvv: detail.cvv || '',
		billing_socialName: detail.billing_socialName || 0,
		billing_rfc: detail.billing_rfc || 0,
		billing_postalAddress: detail.billing_postalAddress || 0,
		billing_neighborhood: detail.billing_neighborhood || 0,
		billing_D_mnpio: detail.billing_D_mnpio || 0,
		billing_postalCode: detail.billing_postalCode || 0,
		billing_d_estado: detail.billing_d_estado || 0,
		msi: detail.msi || 0
	};

	map(payment, function(val, key){
		if(val === ''){
			error = true;
		}
	});

	const userAgent = req.headers['user-agent'];
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	if(error) res.send( sendError('PAYMENT_INCOMPLETE') );
	else if(typeof token === 'undefined') res.send( sendError('YOU_ARE_NOT_HUMAN') );
	else if(typeof tid === 'undefined') res.send( sendError('YOU_ARE_NOT_BUYING') );
	else actions.PostPayment(reqObj, req, res, payment, token, tid, newTid, userAgent, ip);
};
