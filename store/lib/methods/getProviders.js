module.exports = function(_this, db, store, payload, response, createBucketFiles){
	var collection = db.collection('providers');
	var type = payload.type;
	var socketID = payload.socketID;
	collection.find({},{_id:0}).toArray(function(err,docs){
		if(err){
			console.log(err);
		}
		else{
			response({
				providers:docs,
				socketID:socketID,
				type: type
			});
		}
	});
	return;
};
