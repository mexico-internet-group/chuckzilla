module.exports = function(db, store, payload, response){
	if( typeof store.token[payload.mail] === 'undefined' ){
		var date = new Date();
		var collection = db.collection('users');

		store.users[payload.token].type = 'user';
		store.users[payload.token].name = store.users[payload.token].name || payload.name;
		store.users[payload.token].lastName = store.users[payload.token].lastName || payload.lastName;
		store.users[payload.token].mail = store.users[payload.token].mail || payload.mail;
		store.users[payload.token].password = store.users[payload.token].password || payload.password;

		store.token[payload.mail] = payload.token;

		response({auth: 1, token: payload.token});

		collection.update(
			{token: payload.token},
			{$set:
				{
					type: 'user',
					name: store.users[payload.token].name,
					lastName: store.users[payload.token].lastName,
					mail: store.users[payload.token].mail,
					password: store.users[payload.token].password,
					address: store.users[payload.token].address || {},
					orders: store.users[payload.token].orders || [],
					providerType: store.users[payload.token].providerType || 0,
					phone: payload.phone
				}
			},
			{},
			function(){}
		);

		delete store.users[payload.token]._id;
	}
	else{
		response({auth:0});
	}
	return;
};
