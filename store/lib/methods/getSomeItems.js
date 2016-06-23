module.exports = function(_this, db, store, payload, response, createBucketFiles){
  var base = payload.base;
	var collection = db.collection(base);
	var socketID = payload.socketID;
	collection.find({}).toArray(function(err,docs){
		if(err){
			console.log(err);
		}
		else{
			response({
				items:docs,
				socketID:socketID
			});
		}
	});
	return;
};
