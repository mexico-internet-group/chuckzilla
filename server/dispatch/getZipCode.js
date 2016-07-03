module.exports = function(payload, res){
	if(payload.results.length === 0){
		res.send( sendError('ZIP_CODE_DOESNT_EXIST') );
	}
	else{
		res.send({
			query: payload.query,
			results: payload.results
		});
	}
	return;
};