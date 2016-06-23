module.exports = function(_this, db, store, payload, response, createBucketFiles){
  var item = payload.item;
  item.url = item.url.toLowerCase().replace(/ /g,'');
  item.upcs = item.upcs.split(',');

  map(item.upcs, function(val, key){
    item.upcs[key] = val.replace(/ /g, '');
  });

  var collection = db.collection('landing');

  collection.findAndModify(
		{id: payload.item.id},
		[],
		{$set: item},
		{upsert: true},
		function(err, object){
            var upcObj = {};
            if(object.value && object.value.upcs){
                map(object.value.upcs, function(val, key){
                    upcObj[val] = 1;
                });
            }
            if(item.upcs){
                map(item.upcs, function(val, key){
                    if(upcObj[val]) delete upcObj[val];
                    db.collection('inventory').findAndModify(
                        {id: val},
                        [],
                        {
                            $addToSet: {
                                parentSearchLines:
                                {
                                    displayName: payload.item.displayName,
                                    url: payload.item.url
                                }
                            }
                        },
                        {"new": true},
                        function(error, obj){
                            if(error) return console.log(error);
                            if(obj.value && obj.value.parentSearchLines){
                                map(obj.value.parentSearchLines, function(val, key){
                                  val.url = val.url.replace(/-/g, '');
                                });
                                global.searchEngine.update({
                                        index: 'dgl',
                                        type: 'product',
                                        id: obj.value.id,
                				        body: {
                					        doc: {
                                                parentSearchLines: obj.value.parentSearchLines
                                            }
                                        }
                                    },
                                    function(e, r){}
                                );
                            }
                        }
                    );
                });

                map(upcObj, function(val, key){
                    db.collection('inventory').findAndModify(
                        {id: key},
                        [],
                        {
                            $pull: {
                                parentSearchLines: {
                                    displayName: payload.item.displayName,
                                    url: payload.item.url
                                }
                            }
                        },
                        {"new": true},
                        function(error, obj){
                            if(error) return console.log(error);
                            if(obj.value && obj.value.parentSearchLines){
                                global.searchEngine.update({
                                        index: 'dgl',
                                        type: 'product',
                                        id: obj.value.id,
                                        body: {
                                            doc: {
                                                parentSearchLines: obj.value.parentSearchLines
                                            }
                                        }
                                    },
                                    function(e, r){}
                                );
                            }
                        }
                    );
                });
            }
            response({
                route: payload.route,
				isHTTP: payload.isHTTP,
				socketID: payload.socketID
			});
        }
    );
	return;
};
