module.exports = function(db, store, payload, response){
	var id = payload.token;
	var u = store.users[payload.token];
	var cart = store.users[payload.token].cart;
	var queryObj = {token: id};
	var date = new Date();
	var products = store.products;
	var items = cart.items;

	if(cart.status === 'active'){
		map(items, function(val, key){
			if(products[key]){
				products[key].onHandInventory = products[key].onHandInventory - val.qty;
				if(products[key].onHandInventory < 0){
					var delta = 0 - products[key].onHandInventory;
					products[key].onHandInventory = 0;
					items[key].qty = items[key].qty - delta;
					db.collection('users').update(
						queryObj,
						{$set:
							{
								['cart.items.' + key + '.qty']: items[key].qty
							}
						},
						{},
						function(){}
					);
				}

				if(products[key].children){
					map(products[key].children, function(value, index){
						if(!products[value]) return null;
						products[value].onHandInventory = products[value].onHandInventory - items[key].qty;
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
			}
		});

		response({s:1, tid: payload.tid});
		cart.status = 'buying';
		cart.last_modified = date;
		u.tid = payload.tid;

		db.collection('users').update(
			queryObj,
			{$set:
				{
					'cart.status': 'buying',
					'cart.last_modified': date,
				}
			},
			{},
			function(){}
		);
	}
	else{
		response({s:0});
	}

	return;
};
