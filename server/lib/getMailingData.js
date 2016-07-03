module.exports = function(reqObj, router, actions, req, res){
	const userAgent = req.headers['user-agent'];
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	const mail = req.query.m;
	const referer = req.headers.referer;
	
	actions.getMailingData(mail, ip, userAgent, referer);

	res.cookie('leadAddress', mail , {
		expires: new Date(Date.now() + (365*24*60*60*2000) ),
		httpOnly: true,
		domain: domainCookie
	});

	res.end();
	return;
};
