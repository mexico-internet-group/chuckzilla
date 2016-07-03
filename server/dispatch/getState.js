module.exports = function(payload, res){
	res.send( JSON.stringify(payload.data) );
	return;
};