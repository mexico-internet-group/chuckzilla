module.exports = function(_this, db, store, payload, response, createBucketFiles){
  var provider = payload.provider;
  var collection = db.collection('providers');
  collection.findAndModify(
		{id: provider.id},
		[],
		{$set: provider},
		{upsert: true, "new": true},
		function(err, object){
			response({
				route: payload.route,
				isHTTP: payload.isHTTP,
				socketID: payload.socketID
			});
		}
	);
	return;
};
