module.exports = function(payload, res){
	res.send({
		requested: payload.requested, aproval: payload.aproval, total: payload.total, error: payload.error
	});
	return;
}
