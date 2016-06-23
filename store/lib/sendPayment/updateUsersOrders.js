const emitOrders = require('./emitOrders');

module.exports = function(db, store, payload, response, charge, user, now, items, orderSequence, method, status, score){
	const oldItems  = user.cart.items;

	const tr = {
		orderSequence: orderSequence,
		tid: user.tid,
		cart: {
			closed: now,
			items: oldItems
		},
		transaction: charge,
		deliveryAddress: payload.payment.address,
		orderStatus: status === 'OK' ? 'PAYMENT_COMPLETE':'PENDING_REVIEW',
		afScore: score
	};

	const newCar = user.cart = {
		last_modified: now,
		status: 'inactive',
		items: {}
	};

	const extraData = {
		name: user.name,
		lastName: user.lastName,
		mail: user.mail,
		transaction: user.tid,
		method: method,
		address: payload.payment.address,
		items: items,
		amount: payload.payment.amount,
		orderSequence: orderSequence,
		orderStatus: status === 'OK' ? 'PAYMENT_COMPLETE':'PENDING_REVIEW'
	};

	tr.details = extraData;
	tr.payload = payload;

	db.collection('users').findAndModify(
		{ type: 'user', token: payload.token },
		[],
		{
			$set: { cart: newCar },
			$push: {
				orders: tr
			}
		},
		{"new": true},
		function(err, obj){
			tr.details.address = obj.value.address[payload.payment.address];
			tr.details.address.d_asenta = payload.payment.d_asenta;
			emitOrders(db, store, payload, response, charge, user, now, items, orderSequence, tr);
		}
	);
};
