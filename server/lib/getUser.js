module.exports = function(reqObj, router, actions, req, res){
	if( typeof req.cookies.tid !== 'undefined' ) res.clearCookie('tid', {domain: domainCookie});

	if( typeof req.cookies.usrtkn === 'undefined' ){
		var token = uuid.v1();
		actions.setGuest(reqObj, req, res, token);
	}
	else{
		var token = req.cookies.usrtkn;
		actions.getUser(reqObj, req, res, token);
	}
	return;
};
