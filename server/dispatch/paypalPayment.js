module.exports = function(payload, res){
	if(typeof payload.error !== 'undefined'){
		res.send( sendError('PAYPAL_NOT_AVAILABLE') );
	}
	else{
		res.cookie('tid', payload.tid , {
			expires: new Date(Date.now() + (15*60*1000) ),
			httpOnly: true,
			domain: domainCookie
		});
		res.cookie('ppp', payload.id , {
			expires: new Date(Date.now() + (15*60*1000) ),
			domain: domainCookie
		});

		map(payload.links, function(val, key){
			if(val.rel === 'approval_url'){
				res.send({
					redir: val.href
				});
			}
		});
	}
	return;
};
