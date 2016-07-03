module.exports = function(reqObj, router, actions, req, res){
	var token = req.cookies.usrtkn;
	var name = req.body.name;
	var lastName = req.body.lastName;
	var mail = req.body.mail;
	var password = req.body.pass;
	var phone = req.body.phone;

	if(typeof name === 'undefined' || typeof lastName === 'undefined' || typeof mail === 'undefined' || typeof password === 'undefined' || typeof phone === 'undefined'){
		res.send( sendError('DATA_INCOMPLETE') );
	}
	else{
		var tid = req.cookies.tid;
		actions.setUser(reqObj, req, res, token, name, lastName, mail, password, phone, tid);
	}
	return;
};
