module.exports = function(_this, db, store, payload, response, createBucketFiles){
	var collection = db.collection('orders');
	var socketID = payload.socketID;
	collection.find({}).sort( { 'cart.closed': -1 } ).toArray(function(err,docs){
		if(err){
			console.log(err);
		}
		else{
			response({
				orders:docs,
				socketID:socketID
			});
		}
	});
	return;
};
