module.exports = function(payload, res){
	res.cookie('tid', payload.tid , {
		expires: new Date(Date.now() + (15*60*1000) ),
		httpOnly: true,
		domain: domainCookie
	});
	res.send({s: payload.s});
	return;
};