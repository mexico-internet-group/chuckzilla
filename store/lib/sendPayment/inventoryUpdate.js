const updateUsersOrders = require('./updateUsersOrders');

module.exports = function(db, store, payload, response, charge, user, now, items, orderSequence, method, status, score){
	db.collection('inventory').update(
		{
			['carted.' + payload.token]: {
				$exists: true
			}
		},
		{
			$unset: {
				['carted.' + payload.token]: 1
			}
		},
		function(){
			updateUsersOrders(db, store, payload, response, charge, user, now, items, orderSequence, method, status, score);
		}
	);
};
