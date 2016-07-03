module.exports = function(payload, res){
	map(payload.orders, function(val, key){
		delete val.afScore;
		delete val.payload;
		delete val.transaction;
	});
	res.send({
		orders: payload.orders
	});
};
