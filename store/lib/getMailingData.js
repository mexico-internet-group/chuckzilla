module.exports = function(db, store, payload, response){
	db.collection('leadsData').insert({
		_id: payload.mail,
		mail: payload.mail,
		ip: payload.ip,
		userAgent: payload.userAgent,
		conversion: false,
		referer: payload.referer,
		created: new Date(),
		mails: []
	});
	return;
};
