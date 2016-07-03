module.exports = function(reqObj, router, actions, req, res){
	var token = req.cookies.usrtkn;
	if( typeof req.cookies.tid === 'undefined' ) res.send( sendError('TRANSACTION_ERROR') );

	else{
		var tid = req.cookies.tid;
		var newTid = 'tid' + uuid.v1();
		actions.getPs(reqObj, req, res, token, tid, newTid);
	}
	return;
};
