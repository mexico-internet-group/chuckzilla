var exec = require('child_process').exec;

module.exports = function(db, store, payload, response){
	var date = new Date();
	var item = store.products[payload.id];
	var token = payload.token;
	var noInventory = false;

	if(typeof item === 'undefined' || typeof store.users[payload.token] === 'undefined') return response({error: 'NO_USER_NO_ITEM'});
	if(!item.available) return response({error: 'NOT_AVAILABLE'});

	var requested = (function(){
		var q = parseFloat(payload.qty);
		if(payload.operator === '-') q = q * -1;
		if(item.onHandInventory >= q) return q;
		return item.onHandInventory;
	})();

	var cart = store.users[payload.token].cart;

	cart.status = 'active';
	cart.last_modified = date;

	var qtyInCart = (function(){
		var r = 0;
		if(typeof cart.items[payload.id] === 'undefined') r = requested;
		else r = cart.items[payload.id].qty + requested;

		if(r < 0) r = 0;

		if(item.onHandInventory >= r) return r;
		noInventory = true;
		return item.onHandInventory;
	})();

	var itemInCart = {
		qty: qtyInCart,
		details: item.char
	};

	if(qtyInCart === 0) delete cart.items[payload.id], delete item.carted[token];

	else {

		var c = {
			qty: qtyInCart,
			details: item.char
		};

		if(item.children){
			c.children = item.children;
			itemInCart.children = item.children;
		}

		cart.items[payload.id] = c;

		if(!item.carted) item.carted = {};
		item.carted[token] = {
			qty: qtyInCart,
			timeStamp: date
		};
	}

	if(noInventory || item.onHandInventory === 0) response({error: 'NOT_INV'});
	else response({requested: requested, aproval: requested, total: qtyInCart});

	var cartedObj = {};
	var itemObj = {
		"cart.last_modified": date,
		"cart.status": 'active'
	};

	if(qtyInCart === 0){
		cartedObj['carted.' + token] = true;

		db.collection('inventory').update(
			{_id: payload.id},
			{$unset: cartedObj},
			{},
			function(){}
		);

		var rObj = {};
		rObj['cart.items.' + payload.id] = true;

		db.collection('users').update(
			{token: token},
			{
				$set: itemObj,
				$unset: rObj
			},
			{},
			function(){}
		);
	}
	else{
		cartedObj['carted.' + token] = {
			qty: qtyInCart,
			timeStamp: date
		};

		itemObj['cart.items.' + payload.id] = itemInCart;

		db.collection('inventory').update(
			{_id: payload.id},
			{$set: cartedObj},
			{},
			function(){}
		);

		db.collection('users').update(
			{token: token},
			{$set: itemObj},
			{},
			function(){}
		);
	}

	return;
};
