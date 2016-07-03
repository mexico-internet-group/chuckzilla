module.exports = function(payload, res){
	if(typeof payload.error !== 'undefined'){
		res.send( sendError(payload.error) );
	}
	else if(typeof payload.status !== 'undefined' && payload.status === 'OK'){
		res.send({status: 1});
	}
};