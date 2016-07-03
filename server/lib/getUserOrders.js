module.exports = function(reqObj, router, actions, req, res){
	if( typeof req.cookies.usrtkn === 'undefined' ){
		res.send( sendError('YOU_ARE_NOT_HUMAN_;)') );
	}
	else{
		var token = req.cookies.usrtkn;
		actions.getUserOrders(reqObj, req, res, token);
	}
	return;
};
