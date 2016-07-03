module.exports = function(payload, res){
	res.clearCookie('ppp',{domain: domainCookie});
	
	if(typeof payload.error !== 'undefined'){
		res.clearCookie('usrtkn', {domain: domainCookie} );
		res.send( sendError('USER_DOESNT_EXIST') );
	}
	else{
		var tmpObj = {
			n:payload.name,
			l:payload.lastName,
			m:payload.mail,
			f: payload.favoriteZone,
			c: payload.cart
		};
		res.send( tmpObj );
	}
	return;
};
