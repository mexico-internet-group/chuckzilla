module.exports = function(_this, db, store, payload, response, createBucketFiles){
	var socketID = payload.socketID;
	db.collection('users').find({type: 'user'},{
		_id: 0,
		token: 1,
		mail: 1,
		providerType: 1,
		orders: 1
	}).sort( { 'created': -1 } ).toArray(function(err,docs){
		if(err) return console.log(err);
		response({
			users: docs,
			socketID: socketID
		});
	});
	return;
};
