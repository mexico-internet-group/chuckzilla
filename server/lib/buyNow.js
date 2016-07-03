module.exports = function(reqObj, router, actions, req, res){
	var token = req.cookies.usrtkn;
	var tid = 'tid' + uuid.v1();
	actions.buyNow(reqObj, req, res, token, tid);
	return;
};