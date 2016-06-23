module.exports = function(_this, db, store, payload, response, createBucketFiles){
	var collection = db.collection('inventory');
	collection.find({_id: payload.id},{}).toArray(function(error, docs){
		if(error){
			console.log(error);
		}
		else{
			response({
				item: docs,
				socketID: payload.socketID
			});
		}
	});
	return;
};
