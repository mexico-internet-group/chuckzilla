module.exports = function(db, store, payload, response){

	db.collection('users').find({token: payload.token}, {_id: 0, address: 1}).toArray(function(err, docs){
		var a = docs[0].address;
		updateAddress(a);
	});

	var updateAddress = function(a){
		var updateObj = {};
		var favoritePC;

		map(a, function(val, key){
			if(key === payload.key){
				if(typeof updateObj.$set === 'undefined'){
					updateObj.$set = {};
				}
				updateObj.$set['address.' + key + '.isFavorite'] = true;
				favoritePC = val.postalCode;
			}
			else{
				if(typeof updateObj.$unset === 'undefined'){
					updateObj.$unset = {};
				}
				updateObj.$unset['address.' + key + '.isFavorite'] = true;
			}
		});

		db.collection('postalCodes').find({d_codigo: favoritePC}).toArray(function(e, docs){

			updateObj.$set.favoriteZone = docs[0].zone;
			store.users[payload.token].favoriteZone = docs[0].zone;

			db.collection('users').findAndModify(
				{
					type: 'user',
					token: payload.token
				},
				[],
				updateObj,
				{"new": true},
				function(err, object){
					response({
						address: object.value.address
					});
				}
			);
		});

	};

};
