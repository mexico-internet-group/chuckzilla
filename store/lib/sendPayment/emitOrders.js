module.exports = function(db, store, payload, response, charge, user, now, items, orderSequence, tr){
	response(tr.details);
	db.collection('orders').insert(tr);
	delete user.tid;
	return;
};
