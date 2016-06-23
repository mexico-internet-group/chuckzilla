module.exports = function(db, store, payload, response){
	db.collection('users').find({token: payload.token}, {_id: 0, address: 1}).toArray(function(err, docs){
		response({
			address: docs[0].address
		});
	});
	return;
};
