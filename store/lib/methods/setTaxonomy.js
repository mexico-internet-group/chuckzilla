module.exports = function(_this, db, store, payload, response, createBucketFiles){
	var collection = db.collection('tax');
	var document = {
		_id: payload.name,
		n: payload.name,
		parent: payload.parent,
		ancestor: payload.ancestor
	};
	collection.update(
		{ _id: payload.name },
		document,
		{ upsert: true },
		function(err,records){
			if(err){
				console.log(err);
			}
			else{
				response({
					insertedCount:records.insertedCount,
					socketID:payload.socketID
				});
				require('./../../retrieve/buildTax')(db, createBucketFiles);
			}
		}
	);
	return;
};
