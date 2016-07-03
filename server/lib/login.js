module.exports = function(reqObj, router, actions, req, res){
	var token = req.cookies.usrtkn;
	var mail = req.body.mail;
	var password = req.body.pass;
	if(typeof mail === 'undefined' || typeof password === 'undefined'){
		res.send( sendError('DATA_INCOMPLETE') );
	}
	else{
		actions.login(reqObj, req, res, mail, password, token);
	}
	return;
};