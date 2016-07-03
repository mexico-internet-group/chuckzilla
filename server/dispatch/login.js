module.exports = function(payload, res){
	if(payload.token === null){
		res.send( sendError('LOGIN_ERROR') );
	}
	else{
		res.cookie('usrtkn', payload.token , {
			expires: new Date(Date.now() + (365*24*60*60*2000) ),
			httpOnly: true,
			domain: domainCookie
		});
		res.send('1');
	}
	return;
};