module.exports = function(_this, db, store, payload, response, createBucketFiles){
	var collection = db.collection('orders');
	var socketID = payload.socketID;
	collection.find(
			{orderSequence: payload.id},
			{}
		).toArray(function(err, docs){
		if(err){
			console.log(err);
		}
		else{
			response({
				order: docs,
				socketID: socketID
			});
		}
	});
	return;
};
