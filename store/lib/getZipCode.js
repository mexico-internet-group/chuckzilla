module.exports = function(db, store, payload, response){
	var zipCode = payload.query;
	db.collection('postalCodes').find({
			d_codigo: zipCode
	},{
		d_asenta:1,
		D_mnpio:1,
		d_estado:1,
		d_ciudad:1
	}).toArray(function(err, docs){
		response({
			query: zipCode,
			results: docs
		});
	});
	return;
};