module.exports = function(payload, res){
	if(payload.auth === 0){
		res.send( sendError('CANNOT_CREATE_USER') );
	}
	else{
		res.cookie('usrtkn', payload.token , {
			expires: new Date(Date.now() + (365*24*60*60*2000) ),
			httpOnly: true,
			domain: domainCookie
		});
		res.send(payload.auth.toString());
	}
	return;
};