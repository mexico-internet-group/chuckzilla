module.exports = function(_this, db, store, payload, response, createBucketFiles){
	var collection = db.collection(payload.collection);
	var tmpObj = {};
	if(payload.collection === 'users'){
		tmpObj = {token: payload.id}
	}else{
		tmpObj = {id: payload.id}
	}

	collection.find(tmpObj,{}).toArray(function(error, docs){
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
