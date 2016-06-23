module.exports = function(_this, db, store, payload, response, createBucketFiles){
	var collection = db.collection('tax');
	var socketID = payload.socketID;

	collection.find({},{_id:0}).toArray(function(err,docs){
		if(err){
			console.log(err);
		}
		else{
			response({
				tax:docs,
				socketID:socketID
			});
		}
	});
	return;
};
