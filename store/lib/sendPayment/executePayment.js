var cleanCart = require('./cleanCart');
var inventoryUpdate = require('./inventoryUpdate');

module.exports = function(db, store, payload, response, charge, method, status, score){
	var user = store.users[payload.token];
	var now = new Date();
	var items = user.cart.items;

	cleanCart(store, payload);

	db.collection('counters').findAndModify(
		{ _id: 'orderid'},
		[],
		{ $inc: { seq: 1 } },
		{'new': true},
		function(err, obj){
			const orderSequence = obj.value.seq;
			inventoryUpdate(db, store, payload, response, charge, user, now, items, orderSequence, method, status, score);
		}
	);

	return;
};
