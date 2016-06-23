var ObjectId = require('mongodb').ObjectID;

module.exports = function(db, store, payload, response){
	var u = store.users[payload.token];
	
	if(payload.tid === u.tid || typeof u.tid === 'undefined'){
		u.tid = payload.newTid;

		db.collection('users').find({token: payload.token}, {_id: 0, address: 1, phone: 1}).toArray(function(err, docs){
			var els = docs[0].address || {};
			var ids = map(els, function(val, key){
				return new ObjectId(val.d_asenta);
			});
			searchDelivery(ids, els, docs[0].phone);
		});

		var searchDelivery = function(ids, els, phone){
			db
			.collection('postalCodes')
			.find({
				_id: { $in: ids }
			})
			.toArray(function(err, docs){
				map(els, function(val, key){
					map(docs, function(subval, subkey){
						_id = subval._id.valueOf();
						if(val.d_asenta == _id){
							val.ltrTime = subval.ltrTime;
							val.boxTime = subval.boxTime;
							val.zone = subval.zone;
							val.neighborhood = subval.d_asenta;
						}
					});
				});
				response({
					type: u.type,
					name: u.name,
					lastName: u.lastName,
					cart: u.cart,
					address: els,
					tid: u.tid,
					mail: u.mail,
					phone: phone
				});
			});
		}
	}
	return;
};
