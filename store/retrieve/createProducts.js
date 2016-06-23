var searchFeed = require('../searchFeed.js');
var createProductsClass = function(db, store, createBucketFiles){
    db.collection('inventory').find({}, {} )
	.toArray(function(err, docs){
		map(docs, function(val, key){
			if(val.onHandInventory > -1){
                var tmpObj = {
					char: {
						department: val.department,
						family: val.family,
						line: val.line,
						price: val.price,
						displayName: val.displayName,
                        weight: val.weight
					},
					onHandInventory: val.onHandInventory,
					carted: val.carted,
                    available: val.available
				};

                if(val.children){
                    tmpObj.children = val.children;
                    map(val.children, function(value){
                        if(store.products[value] && !store.products[value].parent) store.products[value].parent = [];
                        if(store.products[value]) store.products[value].parent.push(val.id);
                    });
                }

				store.products[val.id] = tmpObj;
			}
		});
    });
};

module.exports = createProductsClass;
