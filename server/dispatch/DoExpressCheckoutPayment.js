module.exports = function(payload, req, res){
	if(typeof payload.error !== 'undefined'){
		res.send( sendError('TRANSACTION_NOT_AVAILABLE') );
	}
	else{
		if(payload.status === 'ERROR'){
			res.send({
				description: 'TRANSACTION_ERROR',
				code: payload.code
			});
		}
		else{
			if( typeof req.cookies.tid !== 'undefined' ) res.clearCookie('tid',{domain: domainCookie});
			res.send({
				status: payload.status,
				method: payload.method,
				auth: payload.auth,
				transaction: payload.transaction
			});
			mail.sendOrder(payload);
		}
	}
	return;
};
