module.exports = function(db, store, payload, response){
	if( typeof store.users[payload.token] === 'undefined' ){
		var date = new Date();
		var collection = db.collection('users');
		var guest = {
			type: 'guest',
			token: payload.token,
			created: date,
			cart:{
				last_modified: date,
				status: 'inactive',
				items: {}
			},
			favoriteZone: 1
		};

		store.users[payload.token] = guest;

		response({
			status: 'OK',
			token: payload.token,
			cart: guest.cart
		});

		collection.insert(guest);
		delete store.users[payload.token]._id;
	}
	else{
		response({status:'ERROR'});
	}
	return;
};
