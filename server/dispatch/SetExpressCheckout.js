module.exports = function(payload, res){
	if(typeof payload.error !== 'undefined'){
		res.send( sendError(payload.error) );
	}
	else{
		res.cookie('tid', payload.tid , {
			expires: new Date(Date.now() + (15*60*1000) ),
			httpOnly: true,
			domain: domainCookie
		});

		res.send({token: payload.token});
	}
	return;
};
