module.exports = function(payload, res){
	if(payload.auth === 0){
		res.send( sendError('CANNOT_CREATE_REGISTER') );
	}
	else{
		res.send(payload.auth.toString());
	}
	return;
};
