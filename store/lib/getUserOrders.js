module.exports = function(db, store, payload, response){
	db.collection('users').find({token: payload.token}, {_id: 0, orders: 1, address: 1}).toArray(function(err, docs){
		map(docs[0].orders, function(val, key){
			val.deliveryData =  docs[0].address[val.deliveryAddress];
		});
		response({
			orders: docs[0].orders
		});
	});
	return;
};
