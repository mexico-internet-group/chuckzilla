var exec = require('child_process').exec;

module.exports = function(db, store){

	var now = new Date();
	var threshold = new Date(now.getTime() - 900000);

	var q = db.collection('users').find({
		'cart.status': 'buying',
		'cart.last_modified': {$lte: threshold}
	}, {
		token: 1
	});

	q.toArray(function(e, docs){
		if(e) return console.log('EXPIRE_BUYINGS_QUERY', e);

		map(docs, function(Val, Key){
			var cart = store.users[Val.token].cart;
			var products = store.products;

			if(!cart) return null;

			var items = cart.items;

			map(items, function(val, key){
				if(products[key]){
					products[key].onHandInventory = products[key].onHandInventory + val.qty;
					db.collection('inventory').update(
						{_id: key},
						{$set:
							{
								onHandInventory: products[key].onHandInventory
							}
						},
						{},
						function(){}
					);
					global.searchEngine.update({
						index: 'dgl',
						type: 'product',
						id: key,
						body: {
							doc: {
								onHandInventory: products[key].onHandInventory
							}
						},
						function(e, r){}
					});

					if(products[key].parent){
						map(products[key].parent, function(value, index){
		                    var bundle = products[value];
		                    if(!bundle) return null;
		                    if(bundle.children){
		                        var max = 0;
		                        map(bundle.children, function(subvalue, subindex){
		                            if(store.products[subvalue] && store.products[subvalue].onHandInventory > max) max = store.products[subvalue].onHandInventory;
		                        });
		                        bundle.onHandInventory = max;

		                        global.searchEngine.update({
		                            index: 'dgl',
		                            type: 'product',
		                            id: value,
		                            body: {
		                                doc: {
		                                    onHandInventory: bundle.onHandInventory
		                                }
		                            },
		                            function(e, r){}
		                        });
		                        db.collection('inventory').update(
		                            {_id: value},
		                            {$set:
		                                {
		                                    onHandInventory: bundle.onHandInventory
		                                }
		                            },
		                            {},
		                            function(){}
		                        );

		                    }
		                });
					}


					if(products[key].children){
						map(products[key].children, function(value, index){
							if(!products[value]) return null;
							products[value].onHandInventory = products[value].onHandInventory + items[key].qty;
							global.searchEngine.update({
								index: 'dgl',
								type: 'product',
								id: value,
								body: {
									doc: {
										onHandInventory: products[value].onHandInventory
									}
								},
								function(e, r){}
							});
							db.collection('inventory').update(
								{_id: value},
								{$set:
									{
										onHandInventory: products[value].onHandInventory
									}
								},
								{},
								function(){}
							);
						});
					}

				}
			});

			cart.status = 'active';

			db.collection('users').update(
				{token: Val.token},
				{$set:
					{"cart.status": 'active'}
				},
				{},
				function(){}
			);

		});

	});
};
