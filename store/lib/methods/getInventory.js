module.exports = function(_this, db, store, payload, response, createBucketFiles){
	var tmpObj = {};
	var collection = db.collection('inventory');

	if(payload.taxonomyLine !== ''){
		tmpObj.line = payload.taxonomyLine;
	}

	collection.find(tmpObj,{_id:0, carted: 0}).sort({_id: 1}).toArray(function(error, docs){
		if(error){
			console.log(error);
		}
		else{
			response({
				items: docs,
				socketID: payload.socketID
			});
		}
	});
	return;
};
