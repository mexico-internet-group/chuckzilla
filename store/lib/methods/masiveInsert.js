var node_xj = require("xls-to-json");
var updateProduct = require("./updateProduct");

module.exports = function(_this, db, store, payload, response, createBucketFiles){
	payload.item = payload.masive;
	payload.isMasive = true;
	var socketID = payload.socketID;
	var masive = payload.masive;
	var body = masive.body;
	var errorList = masive.errorList;

	console.log(errorList);

	map(body, function(val, key){
		var tmpObj = {};

		if(val.isProduct === 'true'){
			db.collection('inventory').findOne({
					_id: val._id
				},
		    	{},
		    	function(e, d){
		    		if(d === null){
						tmpObj = val;
						tmpObj.isNew = 'true';
					}
					else{
						tmpObj = d;
						tmpObj.height = val.height;
						tmpObj.width = val.width;
						tmpObj.deep = val.deep;
						tmpObj.weight = val.weight;
						tmpObj.sku = val.sku;
						tmpObj.displayName = val.displayName;
						tmpObj.char = val.char;
						tmpObj.description = val.description;
						tmpObj.msi = '';
						tmpObj.originalPrice = d.price;
						if(typeof d.msi !== 'undefined'){
							map(d.msi, function(valmsi, keymsi){
								tmpObj.msi += valmsi;
								if(keymsi !== d.msi.length - 1){
									tmpObj.msi += ',';
								}
							});
						}
					}
					payload.item = {body: tmpObj};
					updateProduct(_this, db, store, payload, response, createBucketFiles);
				}
		  );
		}
		else if(val.isPrice === 'true'){
			db.collection('inventory').findOne({
					_id: val._id
				},
		    	{},
		    	function(e, d){
					var item = store.products[val._id];
					var price = val.price;
					var p = parseFloat(price);

					item.price = p;

					if(d) db.collection('inventory').update(
						{_id: val._id},
						{
							$set: { price: item.price }
						},
						function(e){
							if(e) return console.log(e);
						}
					);

					global.searchEngine.update({
						index: 'dgl',
						type: 'product',
						id: val._id,
						body: {
							doc: {
								price: item.price
							}
						}
					},
					function(e, r){}
					);
				}
			);
		}
	});

	response({
		route: payload.route + '?errors=' + JSON.stringify(errorList),
		isHTTP: payload.isHTTP,
		socketID: payload.socketID
	});

	return;
};
