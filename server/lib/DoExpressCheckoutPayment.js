module.exports = function(reqObj, router, actions, req, res){
	var token = req.cookies.usrtkn;
	var tid = req.cookies.tid;
	var newTid = 'tid' + uuid.v1();
	var obj = req.body;

	if(!token) return res.send( sendError('YOU_ARE_NOT_HUMAN') );
	if(!tid) return res.send( sendError('YOU_ARE_NOT_BUYING') );

	if(obj.token && obj.PayerID) return actions.DoExpressCheckoutPayment(reqObj, req, res, token, tid, newTid, obj);
	return res.send( sendError('CANNOT_EXECUTE') );
};
