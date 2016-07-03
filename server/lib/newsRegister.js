module.exports = function(reqObj, router, actions, req, res){
	var token = req.cookies.usrtkn;
	var name = req.body.name;
	var mail = req.body.mail;
	var fingerprint = req.body.fingerprint;
  var ipuser = req.headers['x-forwarded-for'];

	if(typeof name === 'undefined' || typeof mail === 'undefined'){
		res.send( sendError('DATA_INCOMPLETE') );
	}
	else{
		actions.newsRegister(reqObj, req, res, name, mail, token, ipuser, fingerprint);
	}

	return;
};
