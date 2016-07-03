module.exports = function(payload, req, res){
	console.log(payload);
	if(typeof payload.error !== 'undefined'){

		if( typeof req.cookies.tid !== 'undefined' ) res.cookie('tid', payload.tid , {
			expires: new Date(Date.now() + (15*60*1000) ),
			httpOnly: true,
			domain: domainCookie
		});

		if(payload.error === 'DENIED') res.send( sendError('DENIED') );
		else res.send( sendError('TRANSACTION_NOT_AVAILABLE') );
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
