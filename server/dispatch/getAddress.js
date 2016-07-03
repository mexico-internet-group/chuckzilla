module.exports = function(payload, res){
	res.send({
		address: payload.address
	});
};
