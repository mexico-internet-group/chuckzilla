module.exports = function(db, store, payload, response){

	if(typeof store.token[payload.mail] === 'undefined'){
		response({token:null});
	}
	else{
		var token = store.token[payload.mail];
		var user = store.users[token];
		var password = user.password;

		if(!user){
			return response({token:null});
		}

		if(payload.password === password){
			map(user.cart.items, function(val, key){
				var items = user.cart.items;
				if(typeof items[key] === 'undefined') items[key] = val;
				else items[key].qty = items[key].qty + val.qty;
			});

			delete store.users[payload.token];

			db.collection('users').update(
				{token: token},
				{$set:  {cart: user.cart} },
				{},
				function(){
					db.collection('users').remove({
						token: payload.token
					});
				}
			);

			response({token:token});
		}
		else{
			response({token:null});
		}
	}

	return;
};
