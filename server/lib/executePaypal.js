module.exports = function(reqObj, router, actions, req, res){
	var token = req.cookies.usrtkn;
	var tid = req.cookies.tid;
	var newTid = 'tid' + uuid.v1();

	if(!token) res.send( sendError('YOU_ARE_NOT_HUMAN') );
	else if(!tid) res.send( sendError('YOU_ARE_NOT_BUYING') );
	else actions.executePaypal(reqObj, req, res, token, tid, newTid, req.body);

	return;
};
