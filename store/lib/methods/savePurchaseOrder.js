module.exports = function(_this, db, store, payload, response, createBucketFiles){
	var socketID = payload.socketID;
	var purchaseOrder = payload.purchaseOrder;
	var date = new Date();

    if(purchaseOrder.folio === '0'){
        db.collection('counters').findAndModify(
    		{ _id: 'purchaseOrderId'},
    		[],
    		{ $inc: { seq: 1 } },
    		{'new': true},
    		function(err, obj){
                purchaseOrder.folio = obj.value.seq;
                var collection = db.collection('purchaseOrders');
                collection.insert(purchaseOrder, function(err, result){
        			if(err) return console.log(err);
        		});
    		}
    	);
    }
    /*
	var collectionEntries = db.collection('entries').count(function(err, count){
		if(err) return console.log(err);
		var consecutive = count + 1;
		var tmpObj = {
			id: item.entrieID,
			productID: item.productID,
			date: date,
			quantity: item.quantity,
			user: item.mailtkn,
			consecutive: consecutive
		};

		var collection = db.collection('entries');
		collection.insert(tmpObj, function(err, result){
			if(err) return console.log(err);
		});
		db.collection('inventory').findOne({
				_id: item.productID
			},
	    {

	    },
	    function(e, d){
	    	if(d !== null){
					var tmpObj = d;

					if(typeof parseInt(item.quantity) == 'string') item.quantity = 0;
					var suma = parseInt(tmpObj.onHandInventory) + parseInt(item.quantity);
					if(suma < 0) suma = parseInt(tmpObj.onHandInventory);

					tmpObj.onHandInventory = suma;
					tmpObj.msi = '';
					if(typeof d.msi !== 'undefined'){
						map(d.msi, function(valmsi, keymsi){
							tmpObj.msi += valmsi;
							if(keymsi !== d.msi.length - 1){
								tmpObj.msi += ',';
							}
						});
					}
					payload.item = {body: tmpObj, files: tmpObj.numberOfImages};
					updateProduct(_this, db, store, payload, response, createBucketFiles);
				}
			}
	  );
	});
    */

    response({
		route: payload.route,
		isHTTP: payload.isHTTP,
		socketID: payload.socketID
	});
	return;
};
