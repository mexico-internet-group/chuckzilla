module.exports = function(db, store, payload, response){
	var address = payload.address;
	var tmpObj = {};

	map(address, function(val, key){
		tmpObj['address.' + address.addressName + '.' + key] = val;
	});

	if( store.users[payload.token] === 'undefined') response({error: 'SESSION_INVALID'});
	else if( store.users[payload.token].type !==  'user') response({error: 'YOU_ARE_A_GUEST'});
	else{
		db.collection('users').find({token: payload.token, type: 'user'}).toArray(function(err, docs){

			db.collection('postalCodes').find({d_codigo: address.postalCode}).toArray(function(e, code){
				if(Object.keys(docs[0].address).length === 0){
					tmpObj['address.' + address.addressName + '.isFavorite'] = true;
					tmpObj.favoriteZone = code[0].zone;
					store.users[payload.token].favoriteZone = code[0].zone;
				}
				db.collection('users').update(
					{
						token: payload.token,
						type: 'user'
					},
					{
						$set: tmpObj
					},
					function(){
						response({status: 'OK'})
					}
				);
			});

		});
	}

	return;
};
