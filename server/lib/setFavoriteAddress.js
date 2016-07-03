module.exports = function(reqObj, router, actions, req, res){
	var data = req.body;
	if(typeof data.key === 'undefined' || data.key === ''){
		res.send( sendError('PLEASE_SELECT_A_ADDRESS') );
	}
	else{
		var token = req.cookies.usrtkn;
		var key = data.key;
		actions.setFavoriteAddress(reqObj, req, res, token, key);
	}
};
