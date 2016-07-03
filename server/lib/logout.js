module.exports = function(reqObj, router, actions, req, res){
	res.clearCookie('usrtkn',{domain: domainCookie});
	res.clearCookie('tid',{domain: domainCookie});
    res.send('1');
	return;
};