module.exports = function(store, payload){
	var user = store.users[payload.token];
	var items = user.cart.items;
	map(items, function(val, key){
		if(store.products[key] && store.products[key].carted[payload.token]) delete store.products[key].carted[payload.token];
	});
};
