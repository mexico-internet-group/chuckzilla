module.exports = function(reqObj, router, actions, req, res){
	var token = req.cookies.usrtkn;
	var tid = req.cookies.tid;
	var newTid = 'tid' + uuid.v1();
	var delivery = req.body.delivery;
	var addressDetail = req.body.addressDetail;
	var phone = req.body.phone;

	if(!token) res.send( sendError('YOU_ARE_NOT_HUMAN') );
	else if(!tid) res.send( sendError('YOU_ARE_NOT_BUYING') );
	else actions.paypalPayment(reqObj, req, res, token, tid, newTid, delivery, addressDetail, phone);

	return;
};
