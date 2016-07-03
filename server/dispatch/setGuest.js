module.exports = function(payload, res){
	if(payload.status === 'OK'){
		res.cookie('usrtkn', payload.token , {
			expires: new Date(Date.now() + (2000 * 60 * 1000) ),
			httpOnly: true,
			domain: domainCookie
		});
		var tmpObj = {
			n:payload.name,
			l:payload.lastName,
			m:payload.mail,
			c: payload.cart
		};
		res.send( tmpObj );
	}
	else{
		res.send( sendError('FATAL_ERROR_YOU_DONT_HAVE_A_USER') );
	}
	return;
};