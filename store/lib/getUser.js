module.exports = function(db, store, payload, response){
	if(typeof store.users[payload.token] === 'undefined'){
		response({
			error: true
		});
		return;
	}

	var date = new Date();
	var queryObj = {token: payload.token};
	var cart = store.users[payload.token].cart;
	var products = store.products;
	var items = cart.items;

	delete store.users[payload.token].tid;

	var responseObj = {
		cart: cart,
		favoriteZone: store.users[payload.token].favoriteZone
	};

	if( store.users[payload.token].type === 'user'){
		responseObj.name = store.users[payload.token].name;
		responseObj.lastName = store.users[payload.token].lastName;
		responseObj.mail = store.users[payload.token].mail;
	}

	if(cart.status === 'active'){
		map(items, function(val, key){
			if(products[key]){
				if(!products[key].available){
					delete items[key];
					delete products[key].carted[payload.token];

					db.collection('inventory').update(
						{_id: key},
						{$unset:
							{
								['carted.' + payload.token] : true
							}
						},
						{},
						function(){}
					);

					db.collection('users').update(
						{token: payload.token},
						{$unset:
							{
								['cart.items.' + key] : true
							}
						},
						{},
						function(){}
					);
				}
				else if(products[key].onHandInventory < items[key].qty){
					items[key].qty = products[key].onHandInventory;
					if(products[key].carted && products[key].carted[payload.token]) products[key].carted[payload.token].qty = items[key].qty;

					db.collection('users').update(
						{token: payload.token},
						{$set:
							{
								['cart.items.' + key + '.qty'] : items[key].qty
							}
						},
						{},
						function(){}
					);

					db.collection('inventory').update(
						{_id: key},
						{$set:
							{
								['carted.' + payload.token + '.qty'] : items[key].qty
							}
						},
						{},
						function(){}
					);
				}
			}
			else{
				delete items[key];
			}
		});
	}

	response(responseObj);

	if(cart.status === 'buying'){
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
			queryObj,
			{$set:
				{"cart.status": 'active'}
			},
			{},
			function(){}
		);
	}
	return;
};
